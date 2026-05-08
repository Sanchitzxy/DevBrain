from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Second Brain for Developers API",
    description="Backend API for the Second Brain system.",
    version="1.0.0"
)

class IngestRequest(BaseModel):
    source_url: str
    source_type: str # github, pdf, youtube, website, etc.

@app.get("/")
def read_root():
    return {"message": "Welcome to Second Brain API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/ingest")
async def ingest_source(request: IngestRequest, background_tasks: BackgroundTasks):
    """
    Endpoint to trigger ingestion of a source.
    """
    logger.info(f"Received ingestion request for {request.source_url} of type {request.source_type}")
    
    # In a real app, we'd enqueue a Celery task here.
    # For now, simulate background processing if we were using FastAPI's simple background tasks,
    # though our plan states we'll use a worker (like Celery/RQ).
    
    return {"message": "Ingestion task accepted", "task_id": "dummy-task-id-123"}

@app.get("/api/search")
async def search(query: str, limit: int = 5):
    """
    Semantic search endpoint.
    """
    # Placeholder for hybrid search implementation
    return {
        "query": query,
        "results": [
            {"id": "1", "content": f"Result related to {query}", "score": 0.95, "source": "github"},
            {"id": "2", "content": "Another matching chunk...", "score": 0.88, "source": "notes"}
        ]
    }
