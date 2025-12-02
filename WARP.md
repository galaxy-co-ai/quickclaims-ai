# QuickClaims.ai - Project Rules

Last Updated: December 2, 2025

## Project Overview
AI-powered insurance claim supplement platform for construction contractors. Parses carrier scopes, detects missing items, generates IRC-backed defense notes, and builds professional supplement packages.

## Tech Stack (Locked)
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom design tokens
- **Database:** Neon PostgreSQL via Prisma ORM
- **File Storage:** Vercel Blob
- **AI:** OpenAI GPT-4o / GPT-4 Vision
- **Caching:** Upstash Redis
- **Vector Search:** Upstash Vector
- **Deployment:** Vercel

## Commit Scopes
Use these scopes for conventional commits:
- `ai` - AI generation, prompts, OpenAI integration
- `api` - API routes and endpoints
- `claims` - Insurance claims functionality
- `db` - Database schema, migrations, Prisma
- `ui` - Components, pages, styling
- `export` - CSV/PDF export functionality
- `upload` - File upload handling
- `cache` - Redis caching logic
- `vector` - Vector search and embeddings
- `docs` - Documentation updates
- `config` - Configuration, env vars, build

Examples:
- `feat(claims): add delta detection engine`
- `fix(upload): handle large file uploads`
- `refactor(ui): extract Button component`

## Directory Structure
```
quickclaims-ai/
├── app/
│   ├── api/
│   │   ├── ai/generate/           # AI document generation
│   │   ├── claims/[claimId]/      # All claims endpoints
│   │   ├── exports/               # CSV/PDF exports
│   │   ├── projects/              # Project CRUD
│   │   └── uploads/               # File handling
│   ├── claims/
│   │   ├── [id]/                  # Claim detail + checklist
│   │   ├── analytics/             # D$/SQ analytics
│   │   └── page.tsx               # Claims list
│   ├── dashboard/                 # AI concierge
│   └── projects/[id]/             # Project detail
├── components/
│   ├── claims/                    # Claim-specific components
│   ├── project/                   # Project components
│   └── ui/                        # Reusable primitives
├── lib/
│   ├── ai/                        # OpenAI utilities
│   ├── claims/                    # Claims logic
│   │   ├── irc-codes.ts           # IRC references
│   │   ├── photo-analysis.ts      # GPT-4 Vision
│   │   ├── photo-checklist.ts     # Build day checklist
│   │   ├── schemas.ts             # Status definitions
│   │   ├── scope-parser.ts        # Scope extraction
│   │   ├── workflow.ts            # Stage tracking
│   │   ├── xactimate-codes.ts     # Code library
│   │   └── xactimate-export.ts    # ESX export
│   ├── extract/                   # PDF extraction
│   └── validations/               # Zod schemas
├── prisma/
│   └── schema.prisma
├── README.md                      # Full project docs
└── WARP.md                        # This file
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

## Documentation
- **README.md** is the single source of truth for project status
- Update README.md when completing major features
- No separate session files needed - keep README.md current

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
