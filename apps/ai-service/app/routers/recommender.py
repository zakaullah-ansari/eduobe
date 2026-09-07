"""Course recommender router."""
from fastapi import APIRouter, Depends

from ..core.security import require_service_key
from ..schemas.common import RecommendRequest
from ..services.recommender import recommend

router = APIRouter(prefix="/api/v1/ai/recommender", tags=["recommender"], dependencies=[Depends(require_service_key)])


@router.post("/recommend", summary="Generate course recommendations")
def recommend_endpoint(req: RecommendRequest):
    return recommend(req)
