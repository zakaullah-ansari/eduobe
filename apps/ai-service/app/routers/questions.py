"""Question generation router."""
from fastapi import APIRouter, Depends

from ..core.security import require_service_key
from ..schemas.common import QuestionRequest
from ..services.question import generate

router = APIRouter(prefix="/api/v1/ai/questions", tags=["questions"], dependencies=[Depends(require_service_key)])


@router.post("/generate", summary="Generate assessment questions")
def generate_endpoint(req: QuestionRequest):
    return generate(req)
