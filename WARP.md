# QuickClaims.ai - Project Rules

Last Updated: December 3, 2025

## Project Overview
AI-powered insurance claim supplement platform for construction contractors. Parses carrier scopes, detects missing items, generates IRC-backed defense notes, and builds professional supplement packages. Features a proactive AI assistant that chains multiple actions automatically (parse scope → create project → generate docs), persistent chat history, Clerk authentication, and comprehensive project management.

## Tech Stack (Locked)
- **Framework:** Next.js 16 with App Router (Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom design tokens
- **Database:** Neon PostgreSQL via Prisma ORM
- **File Storage:** Vercel Blob
- **Authentication:** Clerk
- **AI:** OpenAI GPT-4o / GPT-4 Vision, Anthropic Claude Sonnet
- **Caching:** Upstash Redis
- **Vector Search:** Upstash Vector
- **Deployment:** Vercel

## Commit Scopes
Use these scopes for conventional commits:
- `ai` - AI generation, prompts, OpenAI/Anthropic integration
- `api` - API routes and endpoints
- `auth` - Authentication, Clerk integration
- `chat` - AI chat/conversation features
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
- `feat(chat): add conversation persistence`
- `fix(auth): wire Clerk to API routes`

## Directory Structure
```
quickclaims-ai/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── chat/                 # AI chat endpoint
│   │   │   ├── generate/             # Document generation
│   │   │   └── upload/               # Chat file uploads
│   │   ├── claims/[claimId]/         # All claims endpoints
│   │   ├── conversations/            # Chat persistence
│   │   │   ├── [id]/                 # Single conversation
│   │   │   │   └── messages/         # Add messages
│   │   │   └── active/               # Get/create active convo
│   │   ├── exports/                  # CSV/PDF exports
│   │   ├── projects/
│   │   │   ├── [id]/                 # Project CRUD
│   │   │   │   └── activity/         # Activity log
│   │   │   └── route.ts              # List/create
│   │   ├── uploads/                  # File handling
│   │   └── webhooks/clerk/           # Clerk user sync
│   ├── claims/[id]/                  # Claim detail + checklist
│   ├── dashboard/                    # AI concierge chat
│   ├── projects/[id]/                # Project detail (4 tabs)
│   ├── settings/                     # User settings
│   ├── sign-in/                      # Clerk sign-in
│   └── sign-up/                      # Clerk sign-up
├── components/
│   ├── claims/                       # Claim-specific components
│   ├── features/                     # Feature modals (edit/new project)
│   ├── layout/                       # AppShell, Sidebar, MobileNav
│   ├── project/                      # Project components
│   └── ui/                           # Reusable primitives
├── lib/
│   ├── ai/                           # AI utilities
│   │   ├── knowledge/                # Domain knowledge base
│   │   ├── anthropic.ts              # Claude integration
│   │   ├── document-generator.ts     # Doc generation
│   │   ├── executor.ts               # Tool execution (17 tools)
│   │   ├── openai.ts                 # GPT-4 integration
│   │   ├── scope-parser.ts           # Carrier scope PDF parsing
│   │   └── tools.ts                  # AI tool definitions
│   ├── auth.ts                       # Clerk auth utilities
│   ├── claims/                       # Claims logic
│   │   ├── irc-codes.ts              # IRC references
│   │   ├── photo-analysis.ts         # GPT-4 Vision
│   │   ├── scope-parser.ts           # Scope extraction
│   │   ├── workflow.ts               # Stage tracking
│   │   └── xactimate-codes.ts        # Code library
│   ├── extract/                      # PDF extraction
│   └── validations/                  # Zod schemas
├── middleware.ts                     # Clerk route protection
├── prisma/
│   └── schema.prisma                 # Database schema
├── README.md                         # Full project docs
└── WARP.md                           # This file
```

## Code Standards

### TypeScript
- Zero `any` types except for third-party lib workarounds (document with comment)
- All function params and returns typed
- Use Zod for runtime validation of external data
- Run `npx tsc --noEmit` before committing

### Components
- Use `components/ui/` primitives for consistency
- Client components: `"use client"` directive at top
- Prop interfaces defined inline or in same file
- No inline styles; Tailwind only

### API Routes
- Return `NextResponse.json()` for all responses
- Always validate input with Zod
- Handle errors with try/catch, return proper status codes
- Always use `requireAuthUserId()` from `lib/auth.ts` for protected routes
- Filter all database queries by `userId` for data isolation

### Authentication
- All API routes (except webhooks and public pages) must call `requireAuthUserId()`
- Use `verifyClaimOwnership()` or similar helpers for nested resources
- Return 401 for unauthorized, 404 for not found (don't leak existence)

### Database
- Never modify existing migrations
- Use `npx prisma db push` for dev schema sync
- Create proper migrations for production changes
- Always include `userId` on user-owned models
- Filter queries by `userId` to ensure data isolation

## Design System
Follows GalaxyCo.ai design tokens:
- **Border radius:** `rounded-xl` (cards), `rounded-lg` (buttons/inputs)
- **Shadows:** `shadow-soft`, `shadow-soft-hover`
- **Card pattern:** `bg-card rounded-2xl border border-border shadow-soft p-6`
- **Colors:** Use CSS variables (--primary, --foreground, etc.)

## Documentation
- **README.md** is the single source of truth for project status
- Update README.md when completing major features
- Keep "Coming Soon" section accurate

## Testing
- Test commands manually before committing
- Verify build passes: `npm run build`
- Check TypeScript: `npx tsc --noEmit`
- Test on mobile viewport before considering UI complete

## Deployment
- Push to `main` triggers Vercel production deploy
- Preview deployments auto-created for PRs
- Environment variables managed via Vercel Dashboard
- Required env vars:
  - `DATABASE_URL`
  - `OPENAI_API_KEY`
  - `ANTHROPIC_API_KEY`
  - `BLOB_READ_WRITE_TOKEN`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `CLERK_WEBHOOK_SECRET`

## Security
- Never log or expose API keys
- Never commit `.env.local`
- Use environment variables for all secrets
- Validate all user input server-side
- All routes protected by Clerk middleware
- Data isolation enforced at API level
