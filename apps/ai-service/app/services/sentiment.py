"""Sentiment analysis service (3/14).

Rule-based lexicon with negation handling and intensity weighting.
Falls back gracefully to the LLM when configured.
"""
from __future__ import annotations

import re
from typing import Any

from ..schemas.common import SentimentRequest
from .llm import llm_service

POSITIVE = {
    "good": 1, "great": 2, "excellent": 3, "awesome": 3, "amazing": 3, "love": 3,
    "best": 3, "helpful": 2, "clear": 1.5, "interesting": 2, "engaging": 2,
    "enjoyed": 2, "improved": 2, "interactive": 1.5, "friendly": 1.5, "well": 1.5,
    "effective": 2, "outstanding": 3, "fantastic": 3, "satisfied": 2, "recommend": 2,
}
NEGATIVE = {
    "bad": -1, "poor": -1.5, "terrible": -3, "worst": -3, "hate": -3, "boring": -2,
    "confusing": -2, "difficult": -1.5, "useless": -2.5, "waste": -2, "slow": -1,
    "unclear": -2, "unhelpful": -2, "worried": -1.5, "disappointed": -2, "frustrated": -2.5,
    "annoyed": -2, "lack": -1.5, "missed": -1.5, "cancelled": -1.5, "negative": -2,
}
NEGATORS = {"not", "no", "never", "hardly", "isn't", "wasn't", "don't", "doesn't", "didn't", "cannot", "can't"}
INTENSIFIERS = {"very": 1.5, "really": 1.5, "extremely": 2, "so": 1.3, "quite": 1.3, "too": 1.3}
KEYWORDS_BY_POLARITY = {
    "positive": ["good", "great", "helpful", "loved", "engaging"],
    "negative": ["bad", "poor", "boring", "confusing", "worst"],
}


def _analyze(text: str) -> dict[str, Any]:
    words = re.findall(r"[a-z']+", text.lower())
    score = 0.0
    hits: list[str] = []
    for i, word in enumerate(words):
        weight = POSITIVE.get(word, NEGATIVE.get(word, 0))
        if weight == 0:
            continue
        multiplier = 1.0
        # negation window of 3 words
        window = words[max(0, i - 3) : i]
        if any(n in window for n in NEGATORS):
            multiplier = -0.8
        # intensifier window of 2 words
        if any(intensifier in words[max(0, i - 2) : i] for intensifier in INTENSIFIERS):
            multiplier *= 1.5
        score += weight * multiplier
        hits.append(word)

    if score > 0.7:
        label = "positive"
    elif score < -0.7:
        label = "negative"
    elif score != 0:
        label = "mixed"
    else:
        label = "neutral"

    confidence = min(1.0, abs(score) / 3 + (0.4 if hits else 0.1))
    keywords = [w for w in words if w in KEYWORDS_BY_POLARITY["positive"] + KEYWORDS_BY_POLARITY["negative"]]
    return {
        "sentiment": label,
        "score": round(score, 4),
        "confidence": round(confidence, 4),
        "keywords": keywords[:6],
    }


def analyze(req: SentimentRequest) -> dict[str, Any]:
    texts = req.texts or ([req.text] if req.text else [])
    results = [_analyze(t) for t in texts]

    distribution: dict[str, int] = {"positive": 0, "neutral": 0, "negative": 0, "mixed": 0}
    for r in results:
        distribution[r["sentiment"]] += 1

    summary = None
    if results:
        joined = " | ".join(f"{t[:90]}" for t in texts[:40])
        summary = llm_service.complete(
            f"Summarize the sentiment of these student comments in 2 sentences: {joined}",
            system="You are an academic quality analyst.",
        )

    return {
        "results": results,
        "distribution": distribution,
        "summary": summary,
        "model": "gpt-4o-mini" if llm_service.configured else "eduobe-lexicon-v1",
        "usage": {"inputTokens": sum(len(t.split()) for t in texts), "outputTokens": 0},
    }
