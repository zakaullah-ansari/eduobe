"""Summarization router."""
from fastapi import APIRouter, Depends

from ..core.security import require_service_key
from ..schemas.common import SummarizeRequest
from ..services.summarizer import summarize

router = APIRouter(prefix="/api/v1/ai/summarization", tags=["summarization"], dependencies=[Depends(require_service_key)])


@router.post("/summarize", summary="Summarize a document or text")
def summarize_endpoint(req: SummarizeRequest):
    return summarize(req)
