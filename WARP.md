# QuickClaims.ai - Project Rules

Last Updated: 2025-12-02

## Project Overview
AI-powered project management platform for construction contractors. Generates roadmaps, materials lists, and cost estimates from uploaded scope documents.

## Tech Stack (Locked)
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom design tokens
- **Database:** Neon PostgreSQL via Prisma ORM
- **File Storage:** Vercel Blob
- **AI:** OpenAI GPT-4o
- **Caching:** Upstash Redis
- **Vector Search:** Upstash Vector
- **Deployment:** Vercel

## Commit Scopes
Use these scopes for conventional commits:
- `ai` - AI generation, prompts, OpenAI integration
- `api` - API routes and endpoints
- `db` - Database schema, migrations, Prisma
- `ui` - Components, pages, styling
- `export` - CSV/PDF export functionality
- `upload` - File upload handling
- `cache` - Redis caching logic
- `vector` - Vector search and embeddings
- `docs` - Documentation updates
- `config` - Configuration, env vars, build

Examples:
- `feat(ai): add role-based labor breakdown`
- `fix(upload): handle large file uploads`
- `refactor(ui): extract Button component`

## Directory Structure
```
quickclaims-ai/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── projects/[id]/     # Project detail
│   └── layout.tsx, page.tsx
├── components/
│   ├── project/           # Project-specific components
│   └── ui/                # Reusable primitives (Button, Input, Card, Label)
├── docs/
│   ├── CURRENT_SESSION.md # Active session status
│   └── sessions/          # Archived sessions
├── lib/
│   ├── ai/                # AI utilities (openai.ts, guidance.ts)
│   ├── extract/           # File extraction (scope.ts)
│   ├── types/             # Shared TypeScript types
│   └── validations/       # Zod schemas
├── prisma/
│   └── schema.prisma
└── WARP.md                # This file
```

## Code Standards

### TypeScript
- Zero `any` types except for third-party lib workarounds (document with comment)
- All function params and returns typed
- Use Zod for runtime validation of external data

### Components
- Use `components/ui/` primitives for consistency
- Client components: `"use client"` directive at top
- Prop interfaces defined inline or in same file
- No inline styles; Tailwind only

### API Routes
- Return `NextResponse.json()` for all responses
- Always validate input with Zod
- Handle errors with try/catch, return proper status codes
- Log errors to console with context

### Database
- Never modify existing migrations
- Use `npx prisma db push` for dev schema sync
- Create proper migrations for production changes
- Include `userId` on all user-owned models (once auth is added)

## Design System
Follows GalaxyCo.ai design tokens:
- **Border radius:** `rounded-xl` (cards), `rounded-lg` (buttons/inputs)
- **Shadows:** `shadow-soft`, `shadow-soft-hover`
- **Card pattern:** `bg-card rounded-2xl border border-border shadow-soft p-6`
- **Colors:** Use CSS variables (--primary, --foreground, etc.)

## Session Management
- Read `docs/CURRENT_SESSION.md` at session start
- Update it at session end with changes made
- Archive completed sessions to `docs/sessions/YYYY-MM-DD.md`

## Testing
- Test commands manually before committing
- Verify build passes: `npm run build`
- Check TypeScript: `npx tsc --noEmit`

## Deployment
- Push to `main` triggers Vercel production deploy
- Preview deployments auto-created for PRs
- Environment variables managed via Vercel Dashboard

## Security
- Never log or expose API keys
- Never commit `.env.local`
- Use environment variables for all secrets
- Validate all user input server-side
