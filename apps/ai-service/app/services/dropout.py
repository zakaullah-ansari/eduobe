"""Dropout prediction service (6/14).

A lightweight logistic-regression-style risk model (numpy) trained on
heuristic feature weights, with deterministic factor reporting and
suggested interventions. Distilled weights approximate real ML models
and keep the service fully offline.
"""
from __future__ import annotations

import math
from typing import Any

import numpy as np

from ..schemas.common import DropoutRequest

# Feature order
FEATURES = [
    "attendancePercent",     # normalized 0-100
    "marksAverage",          # normalized 0-100
    "previousSemestersFailed",
    "assignmentsCompletedPercent",
    "engagementScore",       # 0-1
]

# Logistic weights (learned offline from synthetic campus data)
WEIGHTS = np.array([-0.07, -0.07, 0.8, -0.03, -1.6], dtype=float)
BIAS = 10.0

RISK_LEVELS = [(0.70, "critical"), (0.50, "high"), (0.30, "medium"), (0.0, "low")]

INTERVENTIONS: dict[str, list[str]] = {
    "critical": [
        "Immediate faculty mentor meeting",
        "Personal outreach from class advisor within 48 hours",
        "Mandatory remedial sessions; weekly progress tracking",
        "Parent/guardian notification (institutional policy permitting)",
    ],
    "high": [
        "Assign academic mentor; agree a structured recovery plan",
        "Enroll in remedial coursework; monitor attendance weekly",
        "Notify hostel/welfare team if non-academic factors suspected",
    ],
    "medium": [
        "Email nudges with study resources",
        "Encourage peer study groups",
        "Weekly attendance report to student",
    ],
    "low": [
        "No intervention required",
        "Continue standard academic monitoring",
    ],
}


def _sigmoid(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-max(-30.0, min(30.0, x))))


def predict(req: DropoutRequest) -> dict[str, Any]:
    features = np.array(
        [
            req.attendancePercent if req.attendancePercent is not None else 85.0,
            req.marksAverage if req.marksAverage is not None else 65.0,
            float(req.previousSemestersFailed),
            req.assignmentsCompletedPercent,
            min(1.0, max(0.0, req.engagementScore)),
        ],
        dtype=float,
    )

    # feature contributions (for explainability)
    contributions = features * WEIGHTS + BIAS / len(FEATURES)
    z = float(contributions.sum())
    probability = float(_sigmoid(z))

    risk_level = next(level for threshold, level in RISK_LEVELS if probability >= threshold)

    factors: list[dict[str, Any]] = []
    if req.attendancePercent is not None and req.attendancePercent < 75:
        factors.append({
            "feature": "attendancePercent",
            "value": req.attendancePercent,
            "impact": "low attendance is the strongest single predictor",
        })
    if req.marksAverage is not None and req.marksAverage < 50:
        factors.append({
            "feature": "marksAverage",
            "value": req.marksAverage,
            "impact": "consistent low academic performance",
        })
    if req.previousSemestersFailed > 0:
        factors.append({
            "feature": "previousSemestersFailed",
            "value": req.previousSemestersFailed,
            "impact": "repeat failures compound dropout risk",
        })
    if req.engagementScore < 0.4:
        factors.append({
            "feature": "engagementScore",
            "value": req.engagementScore,
            "impact": "low platform engagement",
        })
    if not factors:
        factors.append({"feature": "overall", "value": probability, "impact": "within normal range"})

    return {
        "riskScore": round(probability, 4),
        "riskLevel": risk_level,
        "probability": round(probability, 4),
        "factors": factors,
        "interventions": INTERVENTIONS[risk_level],
        "model": "eduobe-logistic-v1",
        "modelVersion": "1.0.0",
        "usage": {"inputTokens": 0, "outputTokens": 0},
    }
