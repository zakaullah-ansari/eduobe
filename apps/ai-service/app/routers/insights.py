"""Feedback & sentiment insights router."""
from fastapi import APIRouter, Depends

from ..core.security import require_service_key
from ..schemas.common import InsightsRequest
from ..services.insights import analyze

router = APIRouter(prefix="/api/v1/ai/insights", tags=["insights"], dependencies=[Depends(require_service_key)])


@router.post("/analyze", summary="Analyze feedback & sentiment into actionable insights")
def analyze_endpoint(req: InsightsRequest):
    return analyze(req)
