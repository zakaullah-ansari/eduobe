"""EduOBE AI background worker (1 worker).

Consumes AI jobs published to a Redis list/stream by the NestJS API
(domain event consumer enqueues rows in DB and publishes lightweight
job events here). Each job maps to one of the AI services; callbacks
are posted back to the NestJS webhook endpoint.

Run:  python -m app.workers.worker
"""
from __future__ import annotations

import asyncio
import json
import logging
import signal
from typing import Any

import httpx
import redis.asyncio as aioredis

from ..core.config import get_settings
from ..services import (
    dropout,
    insights,
    recommender,
    sentiment,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("eduobe.ai.worker")

JOB_HANDLERS: dict[str, Any] = {
    "dropout_batch": lambda payload: dropout.predict(_coerce_dropout(payload)),
    "sentiment_batch": lambda payload: {
        "result": sentiment.analyze(_sentiment_request(payload))
    },
    "recommendation_batch": lambda payload: recommender.recommend(_recommend_request(payload)),
    "insights_batch": lambda payload: insights.analyze(_insights_request(payload)),
}

JOB_TO_FEATURE: dict[str, str] = {
    "dropout_batch": "dropout",
    "sentiment_batch": "sentiment",
    "recommendation_batch": "recommender",
    "insights_batch": "insights",
}


def _coerce_dropout(payload: dict[str, Any]) -> Any:
    from ..schemas.common import DropoutRequest
    return DropoutRequest(**{k: v for k, v in payload.items() if k in DropoutRequest.model_fields})


def _sentiment_request(payload: dict[str, Any]) -> Any:
    texts = payload.get("texts") or []
    comment = payload.get("comment") or payload.get("message")
    if comment and not texts:
        texts = [comment]
    from ..schemas.common import SentimentRequest
    return SentimentRequest(tenantId=payload.get("tenantId", "system"), texts=texts)


def _recommend_request(payload: dict[str, Any]) -> Any:
    from ..schemas.common import RecommendRequest
    return RecommendRequest(**_defaults(payload, RecommendRequest))


def _insights_request(payload: dict[str, Any]) -> Any:
    from ..schemas.common import InsightsRequest
    return InsightsRequest(**{k: v for k, v in payload.items() if k in InsightsRequest.model_fields})


def _defaults(payload: dict[str, Any], model: Any) -> dict[str, Any]:
    return {k: v for k, v in payload.items() if k in model.model_fields}


async def process_job(job: dict[str, Any]) -> dict[str, Any]:
    job_type = job.get("jobType", "unknown")
    handler = JOB_HANDLERS.get(job_type)
    if not handler:
        return {"status": "failed", "error": f"Unknown job type {job_type}"}
    try:
        result = handler(job.get("payload") or {})
        if isinstance(result, dict) and "result" not in result:
            result = {"result": result}
        return {"status": "completed", "result": result}
    except Exception as exc:  # noqa: BLE001
        logger.exception("job %s failed", job_type)
        return {"status": "failed", "error": str(exc)}


async def callback(webhook_url: str, api_key: str, job: dict[str, Any], outcome: dict[str, Any]) -> None:
    payload = {
        "jobType": job.get("jobType"),
        "jobId": job.get("id") or job.get("jobId"),
        "status": outcome.get("status"),
        "result": outcome.get("result"),
        "error": outcome.get("error"),
        "payload": job.get("payload") or {},
    }
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["X-AI-Service-Key"] = api_key
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(webhook_url, json=payload, headers=headers)
    except Exception as exc:  # noqa: BLE001
        logger.warning("callback failed: %s", exc)


async def run() -> None:
    settings = get_settings()
    redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    queue_key = settings.redis_queue_key
    logger.info("AI worker listening on Redis list %s (batch size %d)", queue_key, settings.worker_batch_size)

    stopping = asyncio.Event()
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, stopping.set)

    while not stopping.is_set():
        try:
            items = await redis.lrange(queue_key, 0, settings.worker_batch_size - 1)
            if items:
                await redis.ltrim(queue_key, len(items), -1)
                for raw in items:
                    try:
                        job = json.loads(raw)
                    except json.JSONDecodeError:
                        continue
                    logger.info("processing job %s", job.get("jobType"))
                    outcome = await process_job(job)
                    webhook = job.get("webhookUrl") or f"{settings.webhook_url or 'http://localhost:4000/api/v1/ai/webhook'}"
                    await callback(webhook, settings.service_api_key, job, outcome)
            else:
                # poll with backoff (1s) - production uses BRPOP; this keeps
                # the demo self-contained with a bounded CPU footprint
                await asyncio.sleep(1.0)
        except asyncio.CancelledError:
            break
        except Exception as exc:  # noqa: BLE001
            logger.error("worker loop error: %s", exc)
            await asyncio.sleep(3.0)

    await redis.aclose()
    logger.info("AI worker stopped")


if __name__ == "__main__":
    asyncio.run(run())
