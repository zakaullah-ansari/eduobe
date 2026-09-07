"""EduOBE AI microservice entrypoint (FastAPI).

Run:  uvicorn app.main:app --host 0.0.0.0 --port 8000
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import get_settings
from .routers import (
    chatbot,
    content,
    dropout,
    evaluation,
    insights,
    questions,
    recommender,
    search,
    sentiment,
    skill_gap,
    study_plan,
    summarization,
)
from .services.llm import llm_service

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("eduobe.ai")

ROUTERS = [
    chatbot.router,
    recommender.router,
    sentiment.router,
    content.router,
    summarization.router,
    dropout.router,
    search.router,
    questions.router,
    evaluation.router,
    skill_gap.router,
    study_plan.router,
    insights.router,
]


@asynccontextmanager
async def lifespan(_: FastAPI):
    settings = get_settings()
    logger.info(
        "EduOBE AI service starting (env=%s, llm=%s)",
        settings.app_env,
        "configured" if llm_service.configured else "fallback (offline deterministic)",
    )
    yield
    logger.info("EduOBE AI service stopped")


app = FastAPI(
    title="EduOBE AI Service",
    description="AI capabilities: chatbot, recommender, sentiment, content generation, "
    "dropout prediction, smart search, question generation, answer evaluation, "
    "skill gap, study plans, learning paths, insights.",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in ROUTERS:
    app.include_router(router)


@app.get("/health", tags=["system"], summary="Health check")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "service": "EduOBE AI Service",
        "version": "2.0.0",
        "llmConfigured": llm_service.configured,
        "routes": len(ROUTERS),
    }
