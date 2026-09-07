"""Sentiment analysis router."""
from fastapi import APIRouter, Depends

from ..core.security import require_service_key
from ..schemas.common import SentimentRequest
from ..services.sentiment import analyze

router = APIRouter(prefix="/api/v1/ai/sentiment", tags=["sentiment"], dependencies=[Depends(require_service_key)])


@router.post("/analyze", summary="Analyze sentiment of text")
def analyze_endpoint(req: SentimentRequest):
    return analyze(req)
