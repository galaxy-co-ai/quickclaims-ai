# QuickClaims.ai

AI-powered insurance claim supplement platform for roofing contractors. Upload carrier scopes, photos, and measurements — the AI generates professional delta analyses, defense notes, and supplement packages with IRC code citations.

**Last Updated:** December 4, 2025

## ✨ What's New

### Improvements V1 (December 2025)
**Features:**
- **Global Search** - Press Cmd+K / Ctrl+K to search across all projects, claims, and documents
- **Smart Scope Parsing** - Upload carrier scopes without creating a project first - AI extracts address and auto-creates
- **Measurement Report Parsing** - AI parses EagleView, HOVER, and GAF QuickMeasure PDFs automatically
- **Workflow Automation** - Claim status auto-advances as you complete tasks
- **Settings Persistence** - Your preferences are now saved to your account
- **Email Page** - Coming soon placeholder for future Resend integration

**Infrastructure:**
- **Rate Limiting** - Upstash-based rate limiting protects AI endpoints from abuse
- **Error Handling** - Custom error pages (error.tsx, global-error.tsx, not-found.tsx)
- **Loading States** - Skeleton loading UI for all main routes
- **Security Headers** - HSTS, CSP, X-Frame-Options, and other security headers
- **CI/CD Pipeline** - GitHub Actions for lint, typecheck, test, and build

**Accessibility:**
- ARIA attributes on tabs, modals, and photo lightbox
- Keyboard navigation (Escape to close dialogs)
- Screen reader improvements

### Knowledge Base Expansion - Phase 4
Pricing intelligence and communication templates:
- **Regional Pricing & O&P** - Regional multipliers, O&P justification rules, carrier-specific policies
- **Email Templates** - Complete 16-email workflow from intake to claim closure

### Knowledge Base Expansion - Phase 3
Business intelligence and damage identification:
- **Depreciation Knowledge** - Material life expectancy tables, RCV/ACV policy differences, depreciation challenges
- **Damage Pattern Identification** - Hail, wind, and non-storm damage identification with photo documentation standards

### Knowledge Base Expansion - Phase 2
Code compliance expansion:
- **OSHA Safety Requirements** - 29 CFR 1926 Subpart M fall protection with defense notes for steep/high charges
- **State-Specific Codes** - Florida HVHZ, Texas TDI, Colorado hail zones, and more state amendments

### Knowledge Base Expansion - Phase 1
Major expansion of the AI's domain knowledge:
- **Manufacturer Requirements** - GAF, Owens Corning, CertainTeed, Atlas installation guides with warranty requirements
- **Carrier Objection Patterns** - 20+ common objections with proven rebuttal templates
- **Expanded Missed Items** - From 15 to 40+ commonly missed items with defense notes
- **Measurement Intelligence** - EagleView/HOVER parsing rules, waste exclusions, pitch factors

### Proactive AI Assistant
- **Automatic tool chaining** - AI chains multiple actions without asking permission (parse scope → create project → generate docs)
- **Scope PDF auto-parsing** - Drop a carrier scope PDF and AI extracts everything (address, carrier, claim #, line items, totals, D$/SQ)
- **Natural personality** - Warm, concise responses like a skilled coworker (no "I'd be happy to help!" fluff)
- **Smart context** - AI knows what each project needs and proactively suggests next steps
- **One-shot workflows** - "Here's the State Farm scope for Johnson" → Project created, scope parsed, delta analysis ready

### Conversation Persistence & History
- **Conversations persist** - Navigate away and come back, your chat history is saved
- **History panel** - View all past conversations with the AI
- **New chat button** - Start fresh conversations anytime
- **Delete conversations** - Remove old chats you no longer need

### Project Editing
- **Edit project cards** - Hover over any project to edit or delete
- **Update details** - Change client name, address, project type, or status
- **AI can update projects** - Just ask the assistant to fix project details

### Clerk Authentication
- **Secure sign-in/sign-up** - Powered by Clerk
- **User-specific data** - All projects, claims, and docs isolated per user
- **Automatic user sync** - Webhook keeps database in sync with Clerk

### AI Document Generation
The AI assistant is a domain expert in roofing supplement estimation. It can:

- **Generate Delta Analysis Reports** - Compare carrier scope against IRC requirements
- **Create Defense Notes** - 2-3 sentence notes with code citations, ready for Xactimate
- **Write Cover Letters** - Professional submission emails to carriers
- **Build Supplement Letters** - Complete submission documents with all details
- **Draft Rebuttals** - Counter carrier objections with evidence
- **Produce Project Briefs** - Summaries with timelines and next steps

All generated documents auto-save to the **AI Docs** tab of each project.

## Features

### AI Assistant (Powered by Claude & GPT-4)
- **Domain Expert** - Knows IRC codes, Xactimate codes, supplement workflow
- **Proactive & Action-First** - Does the work first, explains briefly after
- **Automatic Tool Chaining** - Chains up to 5 tools in one response (parse → create → generate)
- **Natural Personality** - Warm and concise like a skilled coworker, no chatbot fluff
- **Smart Context** - Tracks project state and suggests what's missing
- **File Uploads** - Drag & drop photos and documents into the chat
- **Scope PDF Parsing** - Automatically extracts all data from carrier scopes
- **Persistent History** - Conversations saved across sessions

### Knowledge Base (Expanded)
- **100+ Xactimate Codes** - Full pricing and descriptions
- **IRC Building Codes** - R903, R904, R905, R806, R908 with defense templates
- **40+ Commonly Missed Items** - Categorized by priority (critical/high/medium)
- **Manufacturer Requirements** - GAF, Owens Corning, CertainTeed, Atlas installation specs
- **Carrier Objection Patterns** - 20+ objections with rebuttal templates by carrier
- **Measurement Intelligence** - EagleView/HOVER field parsing and waste rules
- **OSHA Safety Requirements** - 29 CFR 1926 fall protection with charge justifications
- **State Code Amendments** - Florida, Texas, Colorado, and more state-specific requirements
- **Depreciation Knowledge** - Material life expectancy, RCV/ACV, depreciation challenges
- **Damage Identification** - Hail, wind, age, manufacturing defect patterns with photo standards
- **Regional Pricing & O&P** - Regional multipliers, O&P justification with carrier policies
- **Email Templates** - 16 complete email templates for the entire supplement workflow
- **Supplement Workflow** - 6-phase process with KPIs

### Core Platform
- **Project Management** - iOS-style interface with cards and tabs
- **Project Editing** - Edit or delete projects from the grid
- **Document Upload** - Carrier scopes (PDF), photos, measurements
- **Photo Analysis** - GPT-4 Vision detects components and damage
- **Smart Organization** - AI tags and categorizes uploads
- **Export Options** - CSV and PDF exports

### Insurance Claims
- **Carrier Scope Parsing** - AI extracts line items from SOL PDFs
- **D$/SQ Analytics** - Dollar per square calculation
- **Delta Detection** - Find missing items vs. photos + code requirements
- **Defense Note Generator** - Professional justifications with citations
- **Supplement Builder** - Complete packages ready to submit
- **Xactimate Export** - CSV compatible with Xactimate import

### Authentication & Security
- **Clerk Integration** - Secure sign-in with email/OAuth
- **Data Isolation** - Each user sees only their own data
- **Protected Routes** - Middleware protects all app routes
- **Webhook Sync** - User data synced via secure webhooks

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL + Prisma ORM
- **File Storage**: Vercel Blob
- **Authentication**: Clerk
- **AI**: 
  - OpenAI GPT-4o (chat, vision)
  - Anthropic Claude Sonnet (document generation)
- **Caching**: Upstash Redis
- **Rate Limiting**: Upstash Ratelimit
- **Vector Search**: Upstash Vector
- **Testing**: Vitest + React Testing Library
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## Project Structure

```
quickclaims-ai/
├── .github/
│   └── workflows/
│       └── ci.yml                       # CI pipeline (lint, test, build)
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── chat/                    # AI assistant endpoint
│   │   │   ├── generate/                # Document generation
│   │   │   └── upload/                  # AI chat file uploads
│   │   ├── claims/[claimId]/
│   │   │   ├── analyze-photo/           # GPT-4 Vision analysis
│   │   │   ├── defense-notes/           # Defense note generation
│   │   │   ├── generate-deltas/         # Delta detection engine
│   │   │   └── parse-scope/             # Carrier scope parsing
│   │   ├── conversations/               # Chat persistence
│   │   ├── search/                      # Global search API
│   │   ├── settings/                    # User preferences API
│   │   └── webhooks/clerk/              # Clerk user sync
│   ├── dashboard/
│   │   ├── page.tsx                     # AI chat interface
│   │   └── loading.tsx                  # Loading skeleton
│   ├── documents/                       # Documents list
│   ├── email/                           # Email page (coming soon)
│   ├── projects/[id]/                   # Project detail (4 tabs)
│   ├── settings/                        # User settings
│   ├── error.tsx                        # Error boundary
│   ├── global-error.tsx                 # Root error handler
│   ├── not-found.tsx                    # 404 page
│   ├── sign-in/                         # Clerk sign-in
│   └── sign-up/                         # Clerk sign-up
├── components/
│   ├── claims/                          # Claim UI components
│   ├── features/                        # Feature modals
│   ├── layout/                          # AppShell, Sidebar, MobileNav
│   ├── project/                         # Project components
│   └── ui/
│       ├── CommandPalette.tsx           # Cmd+K global search
│       └── ...                          # Other UI primitives
├── docs/
│   ├── CHANGELOG.md                     # Version history
│   ├── BLOCKERS.md                      # Implementation blockers
│   └── plans/                           # Implementation plans
├── lib/
│   ├── ai/
│   │   ├── knowledge/                   # Domain knowledge base (14 modules)
│   │   ├── measurement-parser.ts        # EagleView/HOVER parser
│   │   ├── scope-parser.ts              # Carrier scope PDF parsing
│   │   └── tools.ts                     # AI tool definitions
│   ├── claims/
│   │   └── workflow-automation.ts       # Auto-advance claim status
│   ├── rate-limit.ts                    # Upstash rate limiting
│   ├── validations/
│   │   └── settings.ts                  # Settings Zod schemas
│   └── ...
├── middleware.ts                        # Clerk route protection
├── next.config.ts                       # Security headers, config
├── vitest.config.ts                     # Test configuration
├── prisma/
│   └── schema.prisma                    # Database schema
├── README.md                            # This file
└── WARP.md                              # Project rules
```

## Database Models

| Model | Purpose |
|-------|---------|
| `User` | User accounts (synced with Clerk) |
| `Project` | Roofing/restoration projects |
| `Upload` | Files attached to projects |
| `Document` | AI-generated documents |
| `Claim` | Insurance claims |
| `CarrierScope` | Parsed carrier scopes |
| `LineItem` | Scope line items |
| `DeltaItem` | Missing/underscoped items |
| `PhotoAnalysis` | AI photo analysis results |
| `ClaimActivity` | Claim timeline events |
| `Conversation` | AI chat conversations |
| `ChatMessage` | Individual chat messages |

## AI Tools Available

| Tool | Description |
|------|-------------|
| `create_project` | Create new project |
| `update_project` | Edit project details |
| `list_projects` | Get user's projects |
| `get_project_details` | Full project info |
| `parse_carrier_scope` | Parse carrier scope PDF and extract all data (auto-creates project if needed) |
| `parse_measurement_report` | Parse EagleView/HOVER/GAF QuickMeasure PDFs for roof measurements |
| `generate_delta_analysis` | Create delta report comparing scope to code requirements |
| `generate_cover_letter` | Professional carrier submission email |
| `generate_defense_notes` | Xactimate-ready notes with IRC citations |
| `generate_supplement_letter` | Complete submission document |
| `generate_rebuttal` | Counter to carrier objections |
| `generate_project_brief` | Project summary with timeline |
| `lookup_xactimate_code` | Look up code pricing and description |
| `lookup_irc_code` | Get IRC requirements for components |
| `analyze_photos` | AI vision analysis of project photos |
| `create_claim` | Start insurance claim tracking |
| `navigate_to` | Navigate user to app pages |
| `export_document` | Export to PDF/CSV |

## IRC Codes in Knowledge Base

| Code | Title | Common Use |
|------|-------|------------|
| R903.2.2 | Crickets & Saddles | Chimneys >30" wide |
| R904.1 | Manufacturer Instructions | Starter course, general |
| R905.2.1 | Sheathing Requirements | Decking replacement |
| R905.2.7.1 | Ice Barrier | Ice & water shield |
| R905.2.8.1 | Starter Course | Eaves requirement |
| R905.2.8.2 | Valleys | Valley metal, IWS |
| R905.2.8.3 | Step Flashing | Wall intersections |
| R905.2.8.5 | Drip Edge | Eaves and rakes |
| R806.2 | Ventilation | Ridge vent, NFA calc |

## Getting Started

### 1. Clone and Install
```bash
git clone https://github.com/galaxy-co-ai/quickclaims-ai.git
cd quickclaims-ai
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

**Required:**
- `DATABASE_URL` - Neon PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key (for Claude)
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_WEBHOOK_SECRET` - Clerk webhook signing secret

**Optional:**
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` - Redis caching
- `UPSTASH_VECTOR_REST_URL` / `UPSTASH_VECTOR_REST_TOKEN` - Vector search
- `GAMMA_API_KEY` - Presentation generation

### 3. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Development Commands

```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint check
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npx tsc --noEmit     # TypeScript check
npx prisma studio    # Database GUI
npx prisma db push   # Push schema changes
```

## Claim Workflow Stages

1. **Intake** - Initial setup (1 day)
2. **Scope Review** - Review carrier scope (2 days)
3. **Delta Analysis** - Find missing items (3 days)
4. **Supplement Pending** - Submitted to carrier (14 days)
5. **Awaiting SOL** - Waiting for revised SOL (10 days)
6. **Rebuttal** - Preparing response (5 days)
7. **Build Scheduled** - Construction scheduled (30 days)
8. **Post Build** - Construction complete (5 days)
9. **Invoicing** - Invoice submitted (14 days)
10. **Depreciation Pending** - Awaiting recovery (30 days)
11. **Completed** - Claim resolved

## Coming Soon

- [ ] Email tool for carrier/contractor communication (page added, integration pending)
- [x] ~~Measurement report integration~~ (EagleView/HOVER/GAF QuickMeasure parsing added)
- [x] ~~Settings persistence to database~~ (user preferences now saved)
- [ ] Mobile app

## Deployment

Push to `main` branch triggers automatic Vercel deployment.

## License

Private - GalaxyCo.ai
