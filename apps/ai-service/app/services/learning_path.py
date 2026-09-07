"""Learning path builder service (12/14)."""
from __future__ import annotations

from typing import Any

from ..schemas.common import LearningPathRequest
from .llm import llm_service

LEVEL_ORDER = {"beginner": 0, "intermediate": 1, "advanced": 2}
MILESTONES = [
    ("Foundations", "Build the core vocabulary and mental models", 0.25),
    ("Core Practice", "Hands-on exercises and guided projects", 0.5),
    ("Integration", "Real-world case studies and cross-topic synthesis", 0.75),
    ("Capstone", "Independent capstone tied to the goal", 1.0),
]


def build(req: LearningPathRequest) -> dict[str, Any]:
    courses = req.availableCourses or []
    start_level = LEVEL_ORDER.get(req.currentLevel, 0)
    end_level = LEVEL_ORDER.get(req.targetLevel, 1)
    levels_needed = max(1, end_level - start_level + 1)

    phases: list[dict[str, Any]] = []
    used = set()

    for phase_index, (title, description, progress) in enumerate(MILESTONES):
        # pick courses whose level marker roughly matches the milestone
        candidates = [
            c for c in courses
            if c.get("level", "beginner") in {
                "beginner": ["beginner", "intermediate"],
                "intermediate": ["intermediate", "advanced"],
                "advanced": ["advanced"],
            }.get(["beginner", "intermediate", "advanced"][min(phase_index, 2)], ["beginner"])
            and c.get("id") not in used
        ][:2]
        for c in candidates:
            used.add(c.get("id"))
        phases.append({
            "phase": phase_index + 1,
            "title": title,
            "description": description,
            "progressPercent": round(progress * 100),
            "courses": candidates or [{"name": f"{title} module", "id": None}],
        })

    llm_summary = llm_service.complete(
        f"Create a concise roadmap description to reach '{req.targetLevel}' from '{req.currentLevel}' for goal: {req.goal}",
        system="You are a learning experience designer.",
    )

    return {
        "goal": req.goal,
        "currentLevel": req.currentLevel,
        "targetLevel": req.targetLevel,
        "estimatedWeeks": req.weeks,
        "phases": phases,
        "roadmapSummary": llm_summary or (
            f"Progress from {req.currentLevel} to {req.targetLevel} across "
            f"{req.weeks} weeks using the {len(phases)} phases above."
        ),
        "model": "eduobe-path-v1",
    }
