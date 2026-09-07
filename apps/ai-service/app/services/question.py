"""Question generation service (8/14)."""
from __future__ import annotations

import random
from typing import Any

from ..schemas.common import QuestionRequest
from .llm import llm_service

BLOOM_PREFIX = {
    "remember": ["Define", "List", "State", "Identify"],
    "understand": ["Explain", "Describe", "Summarize", "Interpret"],
    "apply": ["Apply", "Solve", "Demonstrate", "Illustrate"],
    "analyze": ["Analyze", "Compare", "Differentiate", "Examine"],
    "evaluate": ["Evaluate", "Critique", "Justify", "Recommend"],
    "create": ["Design", "Propose", "Develop", "Construct"],
}
DISTRACTORS = ["the opposite concept", "a related but incorrect principle", "an unrelated topic", "a partially correct statement"]
DIFFICULTY_MULTIPLIER = {"easy": 1, "medium": 2, "hard": 3}
TYPES = ["mcq", "true_false", "short_answer", "long_answer", "fill_blank", "numerical"]


def _mcq(topic: str, difficulty: str, seed: int) -> dict[str, Any]:
    rng = random.Random(seed)
    prefix = rng.choice(BLOOM_PREFIX["remember"] + BLOOM_PREFIX["understand"])
    stem = f"{prefix} {topic}".capitalize()
    correct = f"A correct explanation of {topic}."
    distractors = rng.sample(DISTRACTORS, 3)
    options = [correct] + distractors
    rng.shuffle(options)
    return {
        "type": "mcq",
        "question": f"{stem}?",
        "options": options,
        "correctAnswer": "A" if options[0] == correct else "B",  # simplified index letter
        "answerIndex": options.index(correct),
        "difficulty": difficulty,
        "marks": DIFFICULTY_MULTIPLIER.get(difficulty, 1),
    }


def _true_false(topic: str, seed: int) -> dict[str, Any]:
    rng = random.Random(seed)
    answer = rng.random() > 0.45
    statement = f"{topic} is a core concept covered in this course."
    if not answer:
        statement = f"{topic} is unrelated to the learning objectives of this course."
    return {"type": "true_false", "question": statement, "correctAnswer": str(answer).lower(), "difficulty": "easy", "marks": 1}


def _short_answer(topic: str, difficulty: str, seed: int) -> dict[str, Any]:
    rng = random.Random(seed)
    verb = rng.choice(BLOOM_PREFIX["understand"] + BLOOM_PREFIX["apply"])
    return {
        "type": "short_answer",
        "question": f"{verb} {topic} in 2-3 sentences.",
        "expected": f"A concise, accurate explanation of {topic} with a relevant example.",
        "difficulty": difficulty,
        "marks": DIFFICULTY_MULTIPLIER.get(difficulty, 1),
    }


def _fill_blank(topic: str, seed: int) -> dict[str, Any]:
    return {
        "type": "fill_blank",
        "question": f"________ is the term that describes {topic} in this course.",
        "correctAnswer": topic,
        "difficulty": "easy",
        "marks": 1,
    }


def generate(req: QuestionRequest) -> dict[str, Any]:
    question_type = req.questionType if req.questionType in TYPES else "mcq"
    seed = abs(hash(req.topic + str(req.count))) % (2**31)
    generated = []

    generators = {
        "mcq": _mcq,
        "true_false": _true_false,
        "short_answer": _short_answer,
        "fill_blank": _fill_blank,
        "long_answer": lambda t, d, s: {
            "type": "long_answer",
            "question": f"Discuss {t} with reference to applications and limitations.",
            "expected": f"A structured essay: definition of {t}, key applications, advantages, limitations, and examples.",
            "difficulty": d,
            "marks": DIFFICULTY_MULTIPLIER.get(d, 1) * 2,
        },
        "numerical": lambda t, d, s: {
            "type": "numerical",
            "question": f"Solve a numerical problem based on {t}.",
            "expected": "A worked solution with units.",
            "difficulty": d,
            "marks": DIFFICULTY_MULTIPLIER.get(d, 1) * 2,
        },
    }

    for i in range(req.count):
        generated.append(generators[question_type](req.topic, req.difficulty, seed + i))

    # Optional LLM polish
    if llm_service.configured:
        llm = llm_service.json_complete(
            f"Generate {req.count} {question_type} questions about '{req.topic}' "
            f"({req.bloomLevel} level) as JSON: {{questions:[...]}}"
        )
        if isinstance(llm, dict) and llm.get("questions"):
            generated = llm["questions"]

    return {
        "questions": generated,
        "topic": req.topic,
        "questionType": question_type,
        "bloomLevel": req.bloomLevel,
        "model": "gpt-4o-mini" if llm_service.configured else "eduobe-template-v1",
        "usage": {"inputTokens": len(req.topic.split()), "outputTokens": len(generated) * 12},
    }
