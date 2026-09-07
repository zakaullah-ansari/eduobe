"""Shared LLM client (service 14/14).

If OPENAI_API_KEY is configured the service talks to the OpenAI-compatible
API; otherwise every consumer falls back to deterministic, offline logic so
the whole microservice works without any external dependency.
"""
from __future__ import annotations

import json
import logging
from typing import Any

import httpx

from ..core.config import get_settings

logger = logging.getLogger("eduobe.ai.llm")


class LLMService:
    def __init__(self) -> None:
        self.settings = get_settings()

    @property
    def configured(self) -> bool:
        return bool(self.settings.openai_api_key)

    def complete(self, prompt: str, *, system: str | None = None, max_tokens: int | None = None) -> str | None:
        """Call the LLM. Returns None when not configured or on failure."""
        if not self.configured:
            return None
        try:
            payload: dict[str, Any] = {
                "model": self.settings.openai_model,
                "messages": [],
                "temperature": self.settings.temperature,
                "max_tokens": max_tokens or self.settings.max_tokens,
            }
            if system:
                payload["messages"].append({"role": "system", "content": system})
            payload["messages"].append({"role": "user", "content": prompt})

            with httpx.Client(timeout=self.settings.llm_timeout) as client:
                resp = client.post(
                    f"{self.settings.openai_base_url}/chat/completions",
                    headers={"Authorization": f"Bearer {self.settings.openai_api_key}"},
                    json=payload,
                )
                resp.raise_for_status()
                data = resp.json()
            return data["choices"][0]["message"]["content"].strip()
        except Exception as exc:  # noqa: BLE001 - degrade gracefully
            logger.warning("LLM call failed, using fallback: %s", exc)
            return None

    def json_complete(self, prompt: str, *, system: str | None = None) -> dict[str, Any] | list[Any] | None:
        content = self.complete(prompt, system=system)
        if not content:
            return None
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            # tolerate markdown fences
            start, end = content.find("{"), content.rfind("}")
            if start != -1 and end != -1:
                try:
                    return json.loads(content[start : end + 1])
                except json.JSONDecodeError:
                    return None
            return None


llm_service = LLMService()
