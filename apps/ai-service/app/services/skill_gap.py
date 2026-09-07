"""Skill gap analysis service (10/14)."""
from __future__ import annotations

from typing import Any

from ..schemas.common import SkillGapRequest
from .llm import llm_service


def _normalize(skills: list[str]) -> set[str]:
    return {s.strip().lower() for s in skills if s.strip()}


def analyze(req: SkillGapRequest) -> dict[str, Any]:
    student = _normalize(req.studentSkills)
    targets = _normalize(req.targetSkills)
    coursework = _normalize(req.coursework)

    # skills explicitly listed as missing
    missing = sorted(targets - student)
    # skills implied by coursework not claimed by student
    implied = sorted(coursework - student)
    detected = sorted(student & targets)

    coverage = len(detected) / max(1, len(targets))
    gap_score = round(1 - coverage, 4)

    suggestions: list[str] = []
    for skill in missing[:8]:
        suggestions.append(f"Enroll in targeted resources for '{skill}' (MOOC, lab module, or project).")
    for skill in implied[:5]:
        suggestions.append(f"Practice '{skill}' through the mapped coursework and mini-projects.")
    if detected:
        suggestions.append("Maintain current level through regular practice and peer mentoring.")

    recommendation = llm_service.complete(
        f"Given student skills {sorted(student)} and target skills {sorted(targets)}, "
        "suggest a 30-day focused skill improvement plan in 3 bullets.",
        system="You are a career development advisor.",
    )

    return {
        "detectedSkills": detected,
        "missingSkills": missing,
        "impliedByCoursework": implied,
        "gapScore": gap_score,
        "coverage": round(coverage, 4),
        "suggestions": suggestions,
        "recommendation": recommendation,
        "model": "eduobe-gap-v1",
    }
