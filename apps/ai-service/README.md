# EduOBE AI Service

FastAPI microservice powering EduOBE's AI features. Works fully offline with
deterministic fallbacks; set `OPENAI_API_KEY` to enable LLM-powered responses.

## Run

```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Background worker (consumes `eduobe:ai:jobs` from Redis):

```bash
python -m app.workers.worker
```

## Layout

| Path | Purpose |
|---|---|
| `app/core/` | Settings + shared `X-AI-Service-Key` auth |
| `app/schemas/` | Request/response models |
| `app/services/` | 14 services (chatbot, recommender, sentiment, content, summarizer, dropout, search, questions, evaluation, skill-gap, study-plan, learning-path, insights, llm) |
| `app/routers/` | 12 FastAPI routers (`/api/v1/ai/*`) |
| `app/workers/` | Redis-backed background job worker |

## AI service → NestJS integration

- The NestJS `AiGatewayService` proxies to `/api/v1/ai/...` and passes the
  shared key in `X-AI-Service-Key`.
- The worker POSTs completed jobs to the NestJS `ai-webhook` endpoint
  (`POST /api/v1/ai/webhook`) so `AIJob` records stay in sync.
- `AI_ENABLED=false` disables enqueueing; the API remains fully functional.
