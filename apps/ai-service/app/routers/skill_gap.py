"""Skill gap analysis router."""
from fastapi import APIRouter, Depends

from ..core.security import require_service_key
from ..schemas.common import SkillGapRequest
from ..services.skill_gap import analyze

router = APIRouter(prefix="/api/v1/ai/skill-gap", tags=["skill-gap"], dependencies=[Depends(require_service_key)])


@router.post("/analyze", summary="Analyze skill gaps for a student or cohort")
def analyze_endpoint(req: SkillGapRequest):
    return analyze(req)
