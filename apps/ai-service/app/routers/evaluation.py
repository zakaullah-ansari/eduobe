"""Answer evaluation router."""
from fastapi import APIRouter, Depends

from ..core.security import require_service_key
from ..schemas.common import EvaluateRequest
from ..services.evaluation import evaluate

router = APIRouter(prefix="/api/v1/ai/evaluation", tags=["evaluation"], dependencies=[Depends(require_service_key)])


@router.post("/evaluate", summary="Evaluate a student answer against a rubric")
def evaluate_endpoint(req: EvaluateRequest):
    return evaluate(req)
