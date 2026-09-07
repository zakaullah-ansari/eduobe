"""Text summarization service (5/14).

Extractive summarization: sentence scoring by word frequency
(TextRank-inspired), with optional LLM abstraction when configured.
"""
from __future__ import annotations

import re
from collections import Counter
from typing import Any

import numpy as np

from ..schemas.common import SummarizeRequest
from .llm import llm_service

STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "of", "to", "in", "for", "on", "with", "at",
    "by", "is", "are", "was", "were", "be", "been", "it", "this", "that", "as", "from",
    "not", "have", "has", "had", "will", "would", "can", "could", "may", "might", "we",
}


def _sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p.strip() for p in parts if len(p.split()) >= 4]


def summarize(req: SummarizeRequest) -> dict[str, Any]:
    sentences = _sentences(req.text)
    if not sentences:
        return {"summary": req.text, "sentences": 1, "model": "eduobe-extractive-v1"}

    words = [w.lower() for w in re.findall(r"[a-z']+", req.text) if w.lower() not in STOPWORDS]
    freq = Counter(words)
    if not freq:
        freq = Counter(re.findall(r"[a-z']+", req.text.lower()))

    scores = []
    for sentence in sentences:
        sentence_words = [w.lower() for w in re.findall(r"[a-z']+", sentence) if w.lower() not in STOPWORDS]
        if not sentence_words:
            scores.append(0.0)
            continue
        scores.append(sum(freq.get(w, 0) for w in sentence_words) / len(sentence_words))

    scores = np.array(scores, dtype=float)
    if scores.sum() == 0:
        scores = np.ones_like(scores)

    # greedy selection keeping original order
    order = np.argsort(-scores)
    max_sentences = min(req.maxSentences, len(sentences))
    selected = sorted(int(i) for i in order[:max_sentences])
    summary_sentences = [sentences[i] for i in selected]

    if req.bullet:
        summary = "\n".join(f"- {s}" for s in summary_sentences)
    else:
        summary = " ".join(summary_sentences)

    llm_summary = llm_service.complete(
        f"Summarize the following document in {req.maxSentences} sentences:\n\n{req.text[:6000]}",
        system="You are a precise academic summarizer.",
    )
    if llm_summary:
        summary = llm_summary

    return {
        "summary": summary,
        "sentences": len(summary_sentences),
        "originalWords": len(words),
        "compression": round(1 - len(summary.split()) / max(1, len(words)), 2),
        "model": "gpt-4o-mini" if llm_service.configured else "eduobe-extractive-v1",
    }
