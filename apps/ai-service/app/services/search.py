"""Smart search service (7/14).

BM25-style ranked search over arbitrary JSON documents with typo
tolerance (edit distance) and field weights. Deterministic offline.
"""
from __future__ import annotations

import math
import re
from collections import Counter
from typing import Any

import numpy as np

from ..schemas.common import SearchRequest

K1, B = 1.5, 0.75


def _tokens(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def _flatten(obj: Any) -> str:
    if isinstance(obj, dict):
        return " ".join(_flatten(v) for v in obj.values())
    if isinstance(obj, list):
        return " ".join(_flatten(v) for v in obj)
    return str(obj)


def _edit_distance(a: str, b: str, limit: int = 2) -> int:
    if abs(len(a) - len(b)) > limit:
        return limit + 1
    row = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        prev = row[0]
        row[0] = i
        for j, cb in enumerate(b, 1):
            temp = row[j]
            row[j] = min(row[j] + 1, row[j - 1] + 1, prev + (ca != cb))
            prev = temp
    return row[-1]


def search(req: SearchRequest) -> dict[str, Any]:
    query_terms = _tokens(req.query)
    if not req.index:
        return {"results": [], "query": req.query, "engine": "bm25-v1", "resultCount": 0}

    # corpus stats
    docs = [{"id": doc.get("id") or str(i), "text": _flatten(doc), **doc} for i, doc in enumerate(req.index)]
    doc_terms = [_tokens(d["text"]) for d in docs]
    N = len(docs)
    avg_len = sum(len(t) for t in doc_terms) / max(1, N)
    df = Counter()
    for terms in doc_terms:
        for term in set(terms):
            df[term] += 1

    # fuzzy expansion
    expanded: list[str] = []
    for qt in query_terms:
        expanded.append(qt)
        for vocab in df:
            if _edit_distance(qt, vocab) <= 1:
                expanded.append(vocab)

    results = []
    for i, (doc, terms) in enumerate(zip(docs, doc_terms)):
        tf = Counter(terms)
        score = 0.0
        for term in expanded:
            if term not in tf:
                continue
            idf = math.log(1 + (N - df[term] + 0.5) / (df[term] + 0.5))
            freq = tf[term]
            score += idf * (freq * (K1 + 1)) / (freq + K1 * (1 - B + B * len(terms) / avg_len))
        results.append({"doc": doc, "score": round(score, 4)})

    results.sort(key=lambda r: r["score"], reverse=True)
    top = results[: req.limit]
    return {
        "results": [
            {
                "id": r["doc"]["id"],
                "score": r["score"],
                "snippet": _snippet(r["doc"]["text"], query_terms),
                "document": r["doc"],
            }
            for r in top
        ],
        "query": req.query,
        "expandedTerms": expanded,
        "engine": "bm25-v1",
        "resultCount": len(top),
    }


def _snippet(text: str, terms: list[str], length: int = 160) -> str:
    lowered = text.lower()
    for term in terms:
        index = lowered.find(term)
        if index != -1:
            start = max(0, index - 40)
            return ("..." if start > 0 else "") + text[start : start + length] + ("..." if start + length < len(text) else "")
    return text[:length] + ("..." if len(text) > length else "")
