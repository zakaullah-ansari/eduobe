"""Personalized study plan service (11/14)."""
from __future__ import annotations

from typing import Any

from ..schemas.common import StudyPlanRequest

LEVELS = {0: "very low confidence", 1: "low confidence", 2: "solid", 3: "strong"}


def generate(req: StudyPlanRequest) -> dict[str, Any]:
    topics = req.topics or ["core course material"]
    priority = req.priorityTopics or topics[:2]
    total_hours = req.hoursPerWeek * req.weeks
    share = total_hours / max(1, len(topics))

    weeks: list[dict[str, Any]] = []
    for week in range(1, req.weeks + 1):
        tasks = []
        for i, topic in enumerate(topics):
            is_priority = topic in priority
            hours = round(share * (1.4 if is_priority else 0.85), 1)
            phase = "mastery" if week > req.weeks * 0.7 else ("practice" if week > req.weeks * 0.4 else "foundation")
            tasks.append({
                "topic": topic,
                "phase": phase,
                "hours": hours,
                "activity": {
                    "foundation": f"Watch lectures and read notes on {topic}",
                    "practice": f"Solve problem sets and past questions on {topic}",
                    "mastery": f"Attempt mock tests and teach-back on {topic}",
                }[phase],
                "priority": is_priority,
                "milestone": f"Week {week}: {'complete ' if phase == 'mastery' else 'progress on '}{topic}",
            })
        weeks.append({"week": week, "goal": req.goal or f"Complete study milestone for week {week}", "tasks": tasks})

    weekly_load = round(total_hours / req.weeks, 1)
    return {
        "plan": weeks,
        "summary": {
            "weeks": req.weeks,
            "hoursPerWeek": req.hoursPerWeek,
            "totalHours": total_hours,
            "weeklyLoad": weekly_load,
            "topics": len(topics),
            "priorities": priority,
        },
        "scheduleSuggestion": [
            "Allocate 60% of weekly hours to priority topics",
            "Schedule 25-minute focused sessions with 5-minute breaks",
            "Reserve the last 20% for revision and self-assessment",
        ],
        "model": "eduobe-scheduler-v1",
    }
