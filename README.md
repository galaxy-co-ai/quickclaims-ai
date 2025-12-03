# QuickClaims.ai

AI-powered insurance claim supplement platform for roofing contractors. Upload carrier scopes, photos, and measurements — the AI generates professional delta analyses, defense notes, and supplement packages with IRC code citations.

**Last Updated:** December 3, 2025

## ✨ What's New - AI Document Generation

The AI assistant is now a domain expert in roofing supplement estimation. It can:

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
- **Proactive Generation** - Suggests documents based on what you share
- **Natural Conversation** - Just describe what you need in plain English
- **Action-Oriented** - Creates documents directly, doesn't just explain how

### Knowledge Base
- **100+ Xactimate Codes** - Full pricing and descriptions
- **IRC Building Codes** - R903, R904, R905, R806 with defense templates
- **Commonly Missed Items** - 15+ items carriers frequently omit
- **Supplement Workflow** - 6-phase process with KPIs

### Core Platform
- **Project Management** - iOS-style interface with cards and tabs
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

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL + Prisma ORM
- **File Storage**: Vercel Blob
- **AI**: 
  - OpenAI GPT-4o (chat, vision)
  - Anthropic Claude Sonnet (document generation)
- **Caching**: Upstash Redis
- **Vector Search**: Upstash Vector
- **Deployment**: Vercel

## Project Structure

```
quickclaims-ai/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── chat/                    # AI assistant endpoint
│   │   │   └── generate/                # Legacy document generation
│   │   ├── claims/[claimId]/
│   │   │   ├── analyze-photo/           # GPT-4 Vision analysis
│   │   │   ├── defense-notes/           # Defense note generation
│   │   │   ├── generate-deltas/         # Delta detection engine
│   │   │   └── parse-scope/             # Carrier scope parsing
│   │   ├── documents/                   # Document listing
│   │   ├── exports/                     # CSV/PDF exports
│   │   ├── photos/analyze/              # Batch photo analysis
│   │   ├── projects/                    # Project CRUD
│   │   └── uploads/                     # File uploads
│   ├── dashboard/                       # AI chat interface
│   ├── documents/                       # Documents list
│   ├── projects/[id]/                   # Project detail (4 tabs)
│   └── settings/                        # User settings
├── components/
│   ├── claims/                          # Claim UI components
│   ├── layout/                          # AppShell, Sidebar, MobileNav
│   ├── project/                         # Project components
│   └── ui/                              # Reusable primitives
├── lib/
│   ├── ai/
│   │   ├── knowledge/                   # Domain knowledge base
│   │   │   ├── commonly-missed.ts       # Items carriers omit
│   │   │   ├── document-templates.ts    # Output templates
│   │   │   ├── irc-codes-full.ts        # Building codes
│   │   │   ├── supplement-workflow.ts   # Process knowledge
│   │   │   └── xactimate-full.ts        # 100+ line item codes
│   │   ├── anthropic.ts                 # Claude integration
│   │   ├── document-generator.ts        # Document generation
│   │   ├── executor.ts                  # Tool execution
│   │   ├── openai.ts                    # GPT-4 integration
│   │   └── tools.ts                     # AI tool definitions
│   ├── claims/                          # Claim utilities
│   └── validations/                     # Zod schemas
├── prisma/
│   └── schema.prisma                    # Database schema
└── README.md
```

## AI Tools Available

| Tool | Description |
|------|-------------|
| `generate_delta_analysis` | Create delta report comparing scope to code requirements |
| `generate_cover_letter` | Professional carrier submission email |
| `generate_defense_notes` | Xactimate-ready notes with IRC citations |
| `generate_supplement_letter` | Complete submission document |
| `generate_rebuttal` | Counter to carrier objections |
| `generate_project_brief` | Project summary with timeline |
| `lookup_xactimate_code` | Look up code pricing and description |
| `lookup_irc_code` | Get IRC requirements for components |
| `analyze_photos` | AI vision analysis of project photos |
| `create_project` | Create new project |
| `create_claim` | Start insurance claim tracking |

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
- `DATABASE_URL` - Neon PostgreSQL
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key (for Claude)
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob

**Recommended:**
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
- `UPSTASH_VECTOR_REST_URL` / `UPSTASH_VECTOR_REST_TOKEN`
- `GAMMA_API_KEY` - For presentation generation

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
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint check
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

- [ ] Clerk authentication
- [ ] Email tool for carrier/contractor communication
- [ ] Carrier scope PDF auto-parsing on upload
- [ ] Measurement report integration (EagleView/Hover)
- [ ] Mobile app

## Deployment

Push to `main` branch triggers automatic Vercel deployment.

## License

Private - GalaxyCo.ai
