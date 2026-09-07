"""Feedback & sentiment insights service (13/14)."""
from __future__ import annotations

from collections import Counter
from typing import Any

from ..schemas.common import InsightsRequest
from .llm import llm_service


def analyze(req: InsightsRequest) -> dict[str, Any]:
    sentiments = req.sentiments or []
    feedbacks = req.feedbacks or []

    distribution = Counter(
        s.get("sentiment", "neutral") for s in sentiments if isinstance(s, dict)
    )
    totals = sum(distribution.values()) or 1

    rating_values = [
        f.get("rating") for f in feedbacks
        if isinstance(f, dict) and isinstance(f.get("rating"), (int, float))
    ]
    average_rating = round(sum(rating_values) / len(rating_values), 2) if rating_values else None

    themes: Counter[str] = Counter()
    for item in sentiments + feedbacks:
        if not isinstance(item, dict):
            continue
        text = str(item.get("text") or item.get("comment") or "").lower()
        for kw in item.get("keywords", []) or []:
            themes[str(kw)] += 1
        for theme in ["teaching", "content", "facilities", "assessment", "labs", "support", "communication"]:
            if theme in text:
                themes[theme] += 1

    summary_data = {
        "distribution": dict(distribution),
        "totals": totals,
        "averageRating": average_rating,
        "topThemes": themes.most_common(8),
    }

    summary = llm_service.complete(
        f"Summarize the quality of this education program from feedback: {summary_data}",
        system="You are an academic quality improvement lead.",
    )

    # actionable recommendations (deterministic)
    recommendations = []
    if distribution.get("negative", 0) / totals > 0.25:
        recommendations.append("Address negative sentiment drivers with a targeted faculty/support intervention.")
    if themes.get("assessment", 0) >= 3:
        recommendations.append("Review assessment clarity and feedback turnaround times.")
    if themes.get("facilities", 0) >= 3:
        recommendations.append("Escalate facility/lab concerns to campus operations.")
    if not recommendations:
        recommendations.append("Maintain current quality; run the next feedback cycle on schedule.")

    return {
        **summary_data,
        "summary": summary,
        "recommendations": recommendations,
        "model": "gpt-4o-mini" if llm_service.configured else "eduobe-insights-v1",
        "usage": {"inputTokens": totals, "outputTokens": 0},
    }
