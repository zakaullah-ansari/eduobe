"""Chatbot service (1/14)."""
from __future__ import annotations

import re
from typing import Any

from ..schemas.common import ChatRequest, ChatResponse
from .llm import llm_service

INTENT_PATTERNS: list[tuple[str, str]] = [
    (r"\b(attendance|absent|present)\b", "attendance"),
    (r"\b(syllabus|course|subject|curriculum)\b", "syllabus"),
    (r"\b(marks|exam|assessment|result|grade)\b", "marks"),
    (r"\b(fee|payment|scholarship)\b", "fees"),
    (r"\b(timetable|schedule|class)\b", "timetable"),
    (r"\b(library|book|issue)\b", "library"),
    (r"\b(placement|job|internship|career)\b", "placement"),
    (r"\b(hostel|mess|room)\b", "hostel"),
    (r"\b(graduation|degree|semester)\b", "academic"),
    (r"\b(hello|hi|hey|namaste)\b", "greeting"),
    (r"\b(thank|thanks)\b", "thanks"),
]

FALLBACK_ANSWERS: dict[str, str] = {
    "greeting": "Hello! I'm EduOBE Assistant. Ask me about attendance, marks, syllabus, timetable, fees, placements, or anything else related to your academics.",
    "thanks": "You're welcome! Is there anything else I can help you with?",
    "attendance": "You can view your attendance under the Attendance section of your dashboard. If you have concerns about minimum attendance, contact your course faculty or class advisor.",
    "syllabus": "Your syllabus is available in the Courses section. Each course page includes the unit-wise syllabus and mapped course outcomes.",
    "marks": "Your marks appear in the Assessments section after faculty publishes them. Marks are typically published within a few days of the assessment.",
    "fees": "Fee and scholarship details are available in the Finance section. Contact the accounts office for payment-related queries.",
    "timetable": "Your live timetable is in the Timetable section. Room and faculty changes are reflected there in real time.",
    "library": "The Library section lets you browse the catalogue, see available books, and track issued items.",
    "placement": "The Placement section lists recruiters, job openings, and training schedules. Keep your profile updated for a better match.",
    "hostel": "Hostel & mess information is available under Campus Life. You can raise maintenance requests there.",
    "academic": "Your academic overview shows semester progress, CGPA, and completed credits.",
    "default": "I can help with attendance, syllabus, marks, timetable, fees, placements, library, and other academic topics. Could you rephrase your question?",
}


def _detect_intent(message: str) -> str:
    for pattern, intent in INTENT_PATTERNS:
        if re.search(pattern, message, re.IGNORECASE):
            return intent
    return "default"


def _llm_answer(req: ChatRequest) -> str | None:
    system = (
        "You are EduOBE Assistant, a helpful assistant for an outcome-based education "
        "platform. Answer concisely in 2-4 sentences, and direct the user to the relevant "
        "module when appropriate. Never fabricate student-specific data."
    )
    history = "\n".join(f"{h.get('role', 'user')}: {h.get('content', '')}" for h in req.history[-8:])
    prompt = (
        f"{history}\n"
        f"Context: {req.context}\n"
        f"Student asks: {req.message}\n"
        "Provide the assistant reply."
    )
    return llm_service.complete(prompt, system=system)


def chat(req: ChatRequest) -> ChatResponse:
    out_tokens = len(req.message.split())
    answer = _llm_answer(req) or FALLBACK_ANSWERS[_detect_intent(req.message)]

    return ChatResponse(
        answer=answer,
        model="gpt-4o-mini" if llm_service.configured else "eduobe-deterministic",
        suggestedPrompts=[
            "What is my attendance percentage?",
            "When is my next assessment?",
            "Show my current CGPA",
            "What placements are available?",
        ],
        metadata={"intent": _detect_intent(req.message), "fallback": not llm_service.configured},
        usage={"inputTokens": len(history_tokens(req)), "outputTokens": out_tokens},
    )


def history_tokens(req: ChatRequest) -> list[str]:
    return [w for h in req.history[-8:] for w in str(h.get("content", "")).split()]
