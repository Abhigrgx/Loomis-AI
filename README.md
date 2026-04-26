# Loomis AI

Production-ready AI platform baseline with:

- Next.js + Tailwind frontend
- Node.js + Express backend (MVC)
- MongoDB schema for users, conversations, outputs, settings
- OpenAI-compatible chat integration with context memory
- Security defaults (JWT, validation, rate limiting, helmet, CORS)
- CI pipeline and deployment templates

## Repository structure

```text
.
├── backend
├── frontend
├── docs
├── .github/workflows
├── docker-compose.yml
├── render.yaml
└── .env.example
```

## Quick start

1. Copy environment template:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
npm --workspace backend install
npm --workspace frontend install
```

3. Run backend:

```bash
cd backend
npm run dev
```

4. Run frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Frontend URL: http://localhost:3000
Backend URL: http://localhost:8080/api/v1

## Backend API overview

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET /api/v1/auth/me
- POST /api/v1/chat
- GET /api/v1/chat/:conversationId/messages
- GET /api/v1/history/conversations
- GET /api/v1/history/outputs
- GET/PATCH /api/v1/user/settings

## Deployment targets

- Frontend: Vercel
- Backend: Render/AWS/Railway
- Database: MongoDB Atlas

See docs/architecture.md for full architecture rationale and scaling strategy.

## E2E smoke test

One-command API smoke check (health -> register -> login -> chat assertions):

```bash
npm run smoke:e2e
```

Optional environment variables:

- `SMOKE_BASE_URL` (default `http://127.0.0.1:8080/api/v1`)
- `SMOKE_REQUEST_TIMEOUT_MS` (default `10000`)
- `SMOKE_HEALTH_RETRIES` (default `20`)
- `SMOKE_HEALTH_RETRY_DELAY_MS` (default `1000`)
- `SMOKE_REQUIRE_REAL_OPENAI` (default `false`; if `true`, fails when model is `fallback-local`)

The CI workflow runs this command in the `smoke-e2e` job after starting MongoDB and the backend.
To enable strict real-OpenAI verification in CI, add repository secret `RUN_OPENAI_STRICT_SMOKE=true` and configure `OPENAI_API_KEY`.
