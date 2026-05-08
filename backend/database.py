import os
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
import logging

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/secondbrain")

# Create engine
engine = create_engine(DATABASE_URL, echo=False)

# Session local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Document(Base):
    """
    Represents an ingested document (e.g. a markdown file, a GitHub repo overview, a PDF).
    """
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    source_url = Column(String, unique=True, index=True)
    source_type = Column(String) # github, pdf, notes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    """
    Represents a specific chunk of text from a document, along with its vector embedding.
    """
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    content = Column(Text, nullable=False)
    
    # Store embedding (assuming 1536 dimensions for OpenAI text-embedding-3-small/ada-002)
    embedding = Column(Vector(1536))
    
    document = relationship("Document", back_populates="chunks")

def init_db():
    """
    Initializes the database, creating the pgvector extension and all tables.
    """
    try:
        # Create pgvector extension if it doesn't exist
        with engine.connect() as conn:
            conn.execute("CREATE EXTENSION IF NOT EXISTS vector")
            conn.commit()
            
        Base.metadata.create_all(bind=engine)
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
