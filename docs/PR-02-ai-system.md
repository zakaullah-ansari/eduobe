# PR #2 — EduOBE AI System

This pull request adds a complete, production-shaped AI subsystem to EduOBE:
an LLM-powered academic assistant with deterministic offline fallbacks.

## What was built

### 1. Python AI microservice (`apps/ai-service`)
FastAPI service exposing 12 route modules backed by 14 services and 1 background worker.

| Service | Fallback behaviour (no API key) |
|---|---|
| `chatbot` | Intent detection + curated academic answers per intent (attendance, syllabus, marks, fees, placements, …) |
| `recommender` | Hybrid TF-IDF/cosine similarity + interest boost, ranked course suggestions |
| `sentiment` | Lexicon with negation & intensifier handling, per-text label + distribution + optional LLM summary |
| `content` | Template-driven generation for 9 content types (lesson plan, quiz, notes, assignment, question paper, MOOC, case study, study guide, rubric) |
| `summarizer` | Extractive frequency scoring with optional bullet/plain output, compression ratio |
| `dropout` | Logistic-style risk model with explainable factors and tiered interventions |
| `search` | BM25 ranking with typo tolerance (edit distance ≤1) and snippets |
| `question` | Bloom-level question generation across 6 question types |
| `evaluation` | Rubric-aware answer scoring (keyword coverage, n-gram overlap, depth, structure) |
| `skill_gap` | Student-vs-target skill diff, coverage score, suggestions |
| `study_plan` | Week-by-week scheduler with priority weighting, phases, milestones |
| `learning_path` | Milestone-based path builder over an available course catalog |
| `insights` | Feedback/sentiment aggregation → distribution, themes, recommendations |
| `llm` | Shared OpenAI-compatible client; all services degrade gracefully offline |

Worker (`app/workers/worker.py`): consumes AI jobs from the Redis list
`eduobe:ai:jobs`, dispatches by `jobType` (dropout/sentiment/recommendation/insights
batches), and POSTs results back to the NestJS webhook so DB state is updated.

### 2. NestJS backend (35 AI modules in `apps/api/src/modules/ai-*`)
Each module follows the existing Department pattern: `dto/`, `service`
(PrismaService + EventService + AiGatewayService), `controller`
(JwtAuthGuard + TenantGuard + PermissionsGuard), and `module` exporting the service.

- 23 CRUD modules for the new Prisma models (conversation, message, chatbot-config,
  feedback, recommender, recommendation, recommendation-feedback, learning-path,
  learning-path-node, study-plan, skill-gap, sentiment, content-generation,
  content-request, question-generation, answer-evaluation, dropout-prediction,
  at-risk, smart-search, search-feedback, summarization, usage, job)
- 12 capability modules: `ai-engine` (gateway), `ai-health`, `ai-chatbot`
  (chat orchestration + usage logging), `ai-webhook` (worker callbacks),
  `ai-event-consumer`, `ai-analytics`, `ai-insights`, `ai-embedding`,
  `ai-cache`, `ai-prompt`, `ai-model`, `ai-moderator`

The `AiGatewayService` maps NestJS feature names to the Python FastAPI routes
(`AI_FEATURE_ROUTES`) and surfaces `model`/`usage`/`metadata`/`latencyMs`.

### 3. Frontend (`apps/web`)
- 7 services (`ai-chatbot`, `ai-recommender`, `ai-sentiment`,
  `ai-content-generation`, `ai-dropout-prediction`, `ai-smart-search`,
  `ai-study-plan` + `ai-summarization`) with react-query hooks
- 5 pages under `/ai/`: chatbot, recommendations, sentiment, content-generation, dropout
- Floating `AiChatbotWidget` available across the dashboard
- AI section added to the dashboard sidebar

### 4. Prisma schema
21 new models (`AIConfiguration` … `AIJob`) with matching enums and relation
backfills on `Tenant`/`User`/`Student`/`Course`/`CourseOffering` (70 models total).

### 5. Ops & docs
- Dockerfiles for API, web, and AI service; docker-compose adds
  `ai-service` + `ai-worker` and wires API/web behind Redis
- `.env.example` extended with AI vars; `apps/ai-service/.env.example`
- `docs/PR-02-ai-system.md` (this file) and this README section

## Architecture

```
Browser ──▶ Next.js (apps/web) ──▶ NestJS API (apps/api)
                                      │  AiGatewayService (X-AI-Service-Key)
                                      ▼
                              FastAPI AI service (apps/ai-service, :8000)
                                      │            ▲
              AIJob enqueue (Redis)   ▼            │ webhook callback
                              ai-worker (Python) ───┘
```

- **Auth:** every AI route on the API is behind the same JWT/Tenant/Permissions
  guards as the rest of the app. The Python service and worker use a shared
  `X-AI-Service-Key` secret (disabled in development when unset).
- **Resilience:** with no `OPENAI_API_KEY`, the whole system still functions on
  deterministic, offline logic.
- **Observability:** chatbot/usage flows write `AIUsageLog` rows; `ai-webhook`
  persists worker results into `AIJob`; `ai-analytics`/`ai-insights` aggregate.

## Running locally

```bash
pnpm install
pnpm db:generate

# terminals:
pnpm dev:api                          # NestJS API :4000
cd apps/ai-service && uvicorn app.main:app --host 0.0.0.0 --port 8000
python -m app.workers.worker          # optional background worker
pnpm dev:web                          # Next.js :3000
```

Or with Docker:

```bash
docker compose up --build
```

## Verification

- `pnpm db:generate` ✅ (Prisma Client v5.22.0 generated)
- `pnpm --filter @eduobe/api type-check` ✅ (0 errors)
- `pnpm --filter @eduobe/web type-check` ✅ (0 errors, incl. added UI components)

> Note: `binaries.prisma.sh` is blocked in some CI/sandbox networks. When that
> happens, point `PRISMA_SCHEMA_ENGINE_BINARY` / `PRISMA_QUERY_ENGINE_LIBRARY`
> at locally-provided engine binaries for `prisma generate` (see `.env.example`).
