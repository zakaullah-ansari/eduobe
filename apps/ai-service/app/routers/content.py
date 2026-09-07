"""Content generation router."""
from fastapi import APIRouter, Depends

from ..core.security import require_service_key
from ..schemas.common import ContentRequest
from ..services.content import generate

router = APIRouter(prefix="/api/v1/ai/content", tags=["content"], dependencies=[Depends(require_service_key)])


@router.post("/generate", summary="Generate structured academic content")
def generate_endpoint(req: ContentRequest):
    return generate(req)
