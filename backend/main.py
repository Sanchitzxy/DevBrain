from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import logging
from typing import List

from worker import ingest_source_task, get_embedding
from database import get_db, init_db, DocumentChunk

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Second Brain for Developers API",
    description="Backend API for the Second Brain system.",
    version="1.0.0"
)

@app.on_event("startup")
def on_startup():
    init_db()

class IngestRequest(BaseModel):
    source_url: str
    source_type: str # github, pdf, youtube, website, etc.
    content: str = "" # Optional direct content for testing

class SearchResult(BaseModel):
    id: int
    content: str
    score: float
    source_url: str

@app.get("/")
def read_root():
    return {"message": "Welcome to Second Brain API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/ingest")
async def ingest_source(request: IngestRequest):
    """
    Endpoint to trigger ingestion of a source using Celery worker.
    """
    logger.info(f"Received ingestion request for {request.source_url} of type {request.source_type}")
    
    # Enqueue a Celery task
    task = ingest_source_task.delay(request.source_url, request.source_type, request.content)
    
    return {"message": "Ingestion task accepted", "task_id": str(task.id)}

@app.get("/api/search", response_model=List[SearchResult])
async def search(query: str, limit: int = 5, db: Session = Depends(get_db)):
    """
    Semantic search endpoint.
    Performs a vector search against pgvector.
    """
    try:
        # Generate embedding for the query
        query_embedding = get_embedding(query)
        
        # Perform vector similarity search using L2 distance (<-> operator in pgvector)
        # Order by distance (closest first)
        results = db.query(DocumentChunk).order_by(
            DocumentChunk.embedding.l2_distance(query_embedding)
        ).limit(limit).all()
        
        # Format response
        search_results = []
        for chunk in results:
            # We approximate a score based on distance (closer = higher score)
            # This is a basic mapping; real implementation would use cosine distance or BM25
            search_results.append({
                "id": chunk.id,
                "content": chunk.content,
                "score": 1.0, # Placeholder score visualization
                "source_url": chunk.document.source_url if chunk.document else "unknown"
            })
            
        return search_results
    except Exception as e:
        logger.error(f"Search failed: {e}")
        raise HTTPException(status_code=500, detail="Search failed")
