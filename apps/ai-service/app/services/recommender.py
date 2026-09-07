"""Course recommender (2/14).

Hybrid approach: TF-IDF style content similarity over course names
(numpy), boosted by interest overlap and prerequisites. Deterministic
and dependency-light so it works offline.
"""
from __future__ import annotations

import math
import re
from collections import Counter

import numpy as np

from ..schemas.common import RecommendRequest

STOPWORDS = {
    "the", "a", "an", "and", "or", "of", "to", "in", "for", "on", "with", "i", "ii",
    "iii", "fundamentals", "introduction", "basics", "advanced", "level", "course",
}


def _tokens(text: str) -> list[str]:
    words = re.findall(r"[a-z]+", text.lower())
    return [w for w in words if w not in STOPWORDS and len(w) > 1]


def _vectorize(texts: list[str]) -> np.ndarray:
    docs = [_tokens(t) for t in texts]
    vocabulary = sorted({w for doc in docs for w in doc})
    idx = {w: i for i, w in enumerate(vocabulary)}
    matrix = np.zeros((len(docs), len(vocabulary)), dtype=float)
    for row, doc in enumerate(docs):
        counts = Counter(doc)
        for word, count in counts.items():
            matrix[row, idx[word]] = count
    # tf-idf (simplified)
    df = (matrix > 0).sum(axis=0)
    idf = np.log((1 + len(docs)) / (1 + df)) + 1
    return matrix * idf


def _cosine_similarity(matrix: np.ndarray, vector: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(matrix, axis=1)
    vnorm = np.linalg.norm(vector)
    if vnorm == 0 or np.all(norms == 0):
        return np.zeros(matrix.shape[0])
    return (matrix @ vector) / (norms * vnorm)


def recommend(req: RecommendRequest) -> dict:
    if not req.courseNames and not req.courseIds:
        return {"recommendations": [], "reason": "No course catalog supplied"}

    catalog = req.courseNames or req.courseIds
    profile = " ".join(req.interests + req.completedCourses[:10])

    # Build a shared vocabulary so catalog and profile vectors align
    all_texts = list(catalog) + ([profile] if profile else [])
    matrix_and_profile = _vectorize(all_texts)
    matrix = matrix_and_profile[: len(catalog)]
    profile_vec = matrix_and_profile[len(catalog) :][0] if profile else np.zeros(matrix.shape[1])

    scores = _cosine_similarity(matrix, profile_vec)
    # Boost by interest keyword overlap
    for i, name in enumerate(catalog):
        overlap = len(set(_tokens(name)) & set(_tokens(" ".join(req.interests))))
        scores[i] += 0.15 * overlap

    order = np.argsort(-scores)
    recommendations = []
    for position, index in enumerate(order):
        name = catalog[int(index)]
        if name in req.completedCourses:
            continue
        recommendations.append(
            {
                "courseId": req.courseIds[int(index)] if req.courseIds else None,
                "name": name,
                "score": round(float(scores[int(index)]), 4),
                "reason": recommend_reason(name, req.interests),
                "rank": position + 1,
            }
        )
        if len(recommendations) >= req.limit:
            break

    return {
        "recommendations": recommendations,
        "model": "eduobe-hybrid-cf-v1",
        "usage": {"inputTokens": len(profile.split()), "outputTokens": 0},
    }


def recommend_reason(course: str, interests: list[str]) -> str:
    overlap = set(_tokens(course)) & set(_tokens(" ".join(interests)))
    if overlap:
        return f"Matches your interest in {', '.join(sorted(overlap))}"
    return "Complements your completed coursework"
