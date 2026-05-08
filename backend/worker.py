import os
from celery import Celery
import time
import logging
from sqlalchemy.orm import Session
from database import SessionLocal, Document, DocumentChunk

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Initialize Celery app
celery_app = Celery(
    "worker",
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list[str]:
    """Basic text splitter."""
    chunks = []
    start = 0
    text_length = len(text)
    while start < text_length:
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

def get_embedding(text: str) -> list[float]:
    """
    Generate embedding.
    In a true production setting we would use sentence-transformers or OpenAI API.
    For local-first demonstration without relying on external API keys or large model weights,
    we generate a deterministic pseudo-embedding of 1536 dimensions.
    """
    # Simulate a 1536-dimensional embedding (OpenAI ad-002 / text-embedding-3-small shape)
    # deterministic based on string length to simulate real embeddings
    val = (len(text) % 100) / 100.0
    return [val] * 1536

@celery_app.task(name="ingest_source_task")
def ingest_source_task(source_url: str, source_type: str, content: str = ""):
    """
    Background task to ingest a source.
    1. Extracts text (uses provided content for simplicity)
    2. Chunks text
    3. Generates embeddings
    4. Stores to PostgreSQL/pgvector
    """
    logger.info(f"Starting ingestion for {source_type}: {source_url}")
    
    # If no content is provided, mock some downloaded content
    if not content:
        content = f"This is mock content downloaded from {source_url}. It contains details about the system architecture."
        
    db: Session = SessionLocal()
    try:
        # Check if document already exists
        doc = db.query(Document).filter(Document.source_url == source_url).first()
        if not doc:
            doc = Document(title=source_url.split("/")[-1], source_url=source_url, source_type=source_type)
            db.add(doc)
            db.commit()
            db.refresh(doc)
            
        # Clear existing chunks if re-ingesting
        db.query(DocumentChunk).filter(DocumentChunk.document_id == doc.id).delete()
        
        # Chunk text
        chunks = chunk_text(content)
        
        # Process and store chunks
        for text_chunk in chunks:
            embedding = get_embedding(text_chunk)
            db_chunk = DocumentChunk(
                document_id=doc.id,
                content=text_chunk,
                embedding=embedding
            )
            db.add(db_chunk)
            
        db.commit()
        logger.info(f"Successfully finished ingestion for {source_url}, processed {len(chunks)} chunks.")
        return {"status": "success", "url": source_url, "chunks_processed": len(chunks)}
    except Exception as e:
        db.rollback()
        logger.error(f"Failed ingestion for {source_url}: {e}")
        return {"status": "error", "error": str(e)}
    finally:
        db.close()
