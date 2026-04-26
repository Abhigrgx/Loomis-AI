# Loomis AI System Architecture

## 1) High-level design

Loomis AI uses a decoupled web architecture:

- Frontend: Next.js (App Router) + Tailwind CSS + Zustand
- Backend: Node.js + Express REST API (MVC pattern)
- Database: MongoDB Atlas with Mongoose models
- AI provider: OpenAI-compatible service abstraction with fallback
- Deployment: Vercel (frontend), Render/AWS/Railway (backend), MongoDB Atlas (data)

## 2) Why this architecture

- Next.js gives strong DX, SSR/SSG support, and Vercel-first deployment.
- Express MVC keeps API behavior clear and testable while staying lightweight.
- MongoDB fits fast-evolving conversational schemas and AI output metadata.
- OpenAI service abstraction lets the platform swap to local/open-source models later.
- Decoupled deploy targets allow independent scaling for UI and API tiers.

## 3) Text architecture diagram

```text
[ User Browser ]
      |
      v
[ Next.js Frontend (Vercel) ]
      |
      | HTTPS + JWT
      v
[ Express API (Render/AWS/Railway) ]
      |        |          |
      |        |          +--> [ Object Storage (S3/Cloudinary) for files ]
      |        |
      |        +--> [ OpenAI / Local LLM Gateway ]
      |
      +--> [ MongoDB Atlas ]

Support services:
- Rate limiting and request validation
- CI/CD pipeline via GitHub Actions
- Observability via platform logs + APM optional
```

## 4) Core services

- Auth service: registration, login, JWT token issuance, role-ready authorization.
- Chat service: prompt intake, context assembly, model invocation, response persistence.
- History service: conversation and output retrieval for dashboard/history panel.
- Settings service: per-user model, temperature, and token settings.

## 5) Security controls

- Helmet + CORS + compression middleware defaults.
- JWT-based stateless authentication with role claim support.
- Global and AI-specific rate limiting.
- Input validation with express-validator.
- Environment-secret isolation and production-only secret injection.

## 6) Scalability notes

- Stateless API nodes can scale horizontally behind load balancer.
- MongoDB indexes on userId/conversationId for high-read chat history.
- AI gateway can route by model, tenant, or cost policy.
- Add Redis for distributed rate limiting and cache in multi-instance deployments.
