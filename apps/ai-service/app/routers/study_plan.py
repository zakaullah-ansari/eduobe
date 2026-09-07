"""Study plan & learning path router."""
from fastapi import APIRouter, Depends

from ..core.security import require_service_key
from ..schemas.common import StudyPlanRequest, LearningPathRequest
from ..services.study_plan import generate as generate_plan
from ..services.learning_path import build as build_path

router = APIRouter(prefix="/api/v1/ai/study-plan", tags=["study-plan"], dependencies=[Depends(require_service_key)])


@router.post("/generate", summary="Generate a personalized study plan")
def generate_endpoint(req: StudyPlanRequest):
    return generate_plan(req)


@router.post("/learning-path", summary="Generate a learning path")
def learning_path_endpoint(req: LearningPathRequest):
    return build_path(req)
