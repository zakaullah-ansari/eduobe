"""Answer evaluation service (9/14).

Rubric-aware scoring: keyword coverage, semantic overlap (n-gram
Jaccard/Word-overlap), length adequacy, and structure bonus.
"""
from __future__ import annotations

import math
import re
from typing import Any

from ..schemas.common import EvaluateRequest
from .llm import llm_service

STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "of", "to", "in", "for", "on", "with", "at",
    "by", "is", "are", "was", "were", "be", "been", "it", "this", "that", "as", "from",
    "not", "have", "has", "had", "will", "would", "can", "could",
}


def _keywords(text: str) -> set[str]:
    return {w for w in re.findall(r"[a-z']+", text.lower()) if w not in STOPWORDS and len(w) > 2}


def _ngrams(text: str, n: int = 2) -> set[str]:
    words = _keywords(text)
    return {" ".join(pair) for pair in zip(sorted(words), sorted(words)[1:])}


def evaluate(req: EvaluateRequest) -> dict[str, Any]:
    student = req.studentAnswer.strip()
    expected = (req.expectedAnswer or "").strip()

    score = 0.0
    breakdown: list[dict[str, Any]] = []

    # 1. Keyword coverage (50%)
    if expected:
        student_kw = _keywords(student)
        expected_kw = _keywords(expected)
        coverage = len(expected_kw & student_kw) / max(1, len(expected_kw))
        coverage_score = coverage * 0.5 * req.maxScore
        breakdown.append({
            "criterion": "key points coverage",
            "obtained": round(coverage_score, 2),
            "max": round(req.maxScore * 0.5, 2),
            "comment": f"Covered {len(expected_kw & student_kw)} of {len(expected_kw)} key points",
        })
        score += coverage_score

    # 2. Semantic overlap via n-grams (25%)
    if expected:
        student_ngrams = _ngrams(student)
        expected_ngrams = _ngrams(expected)
        union = student_ngrams | expected_ngrams
        jaccard = len(student_ngrams & expected_ngrams) / max(1, len(union))
        overlap_score = jaccard * 0.25 * req.maxScore
        breakdown.append({
            "criterion": "semantic overlap",
            "obtained": round(overlap_score, 2),
            "max": round(req.maxScore * 0.25, 2),
            "comment": f"Semantic similarity {round(jaccard, 3)}",
        })
        score += overlap_score

    # 3. Depth / length adequacy (15%)
    expected_len = max(1, len(_keywords(expected))) if expected else 20
    ratio = min(1.0, len(_keywords(student)) / expected_len)
    depth_score = ratio * 0.15 * req.maxScore
    breakdown.append({
        "criterion": "depth of explanation",
        "obtained": round(depth_score, 2),
        "max": round(req.maxScore * 0.15, 2),
        "comment": f"Answer covers {round(ratio * 100)}% of expected depth",
    })
    score += depth_score

    # 4. Structure (10%)
    structure_score = 0.0
    if len(re.findall(r"\n+|\.\s", student)) >= 2 or len(student.split()) >= 40:
        structure_score = req.maxScore * 0.1
    breakdown.append({
        "criterion": "structure and clarity",
        "obtained": round(structure_score, 2),
        "max": round(req.maxScore * 0.1, 2),
        "comment": "Clear paragraph structure" if structure_score else "Improve structure/organisation",
    })
    score += structure_score

    # Rubric-specific adjustments
    if req.rubric:
        rubric_extra = 0.0
        for criterion, weight in req.rubric.items():
            if isinstance(weight, (int, float)):
                rubric_extra += min(1.0, len(_keywords(student)) / 30) * weight
        bonus = min(req.maxScore * 0.15, rubric_extra)
        breakdown.append({
            "criterion": "rubric bonus",
            "obtained": round(bonus, 2),
            "max": round(req.maxScore * 0.15, 2),
            "comment": "Custom rubric weights applied",
        })
        score += bonus

    score = min(req.maxScore, round(score, 2))

    feedback = (
        "Strong answer: covers the core points with clear structure."
        if score >= 0.8 * req.maxScore
        else "Good effort; include more key points and examples to strengthen the answer."
        if score >= 0.6 * req.maxScore
        else "Needs improvement: revisit the topic and cover the missing key points."
    )

    llm_feedback = llm_service.complete(
        f"Evaluate this student answer against expectations and give 2 specific improvement tips.\n"
        f"Question: {req.question}\nExpected: {expected}\nStudent: {student}",
        system="You are a fair, encouraging engineering faculty evaluator.",
    )
    if llm_feedback:
        feedback = llm_feedback

    return {
        "score": score,
        "maxScore": req.maxScore,
        "percentage": round((score / req.maxScore * 100), 2),
        "feedback": feedback,
        "breakdown": breakdown,
        "model": "gpt-4o-mini" if llm_service.configured else "eduobe-rubric-v1",
    }
