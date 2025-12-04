# QuickClaims.ai

AI-powered insurance claim supplement platform for roofing contractors. Upload carrier scopes, photos, and measurements — the AI generates professional delta analyses, defense notes, and supplement packages with IRC code citations.

**Last Updated:** December 3, 2025

## ✨ What's New

### Knowledge Base Expansion - Phase 2 (Latest)
Continued expansion of the AI's domain knowledge:
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
- **Vector Search**: Upstash Vector
- **Deployment**: Vercel

## Project Structure

```
quickclaims-ai/
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
│   │   │   ├── [id]/                    # Single conversation
│   │   │   │   └── messages/            # Add messages
│   │   │   └── active/                  # Get/create active convo
│   │   ├── documents/                   # Document listing
│   │   ├── exports/                     # CSV/PDF exports
│   │   ├── photos/analyze/              # Batch photo analysis
│   │   ├── projects/
│   │   │   ├── [id]/                    # Project GET/PATCH/DELETE
│   │   │   └── route.ts                 # Project list/create
│   │   ├── uploads/                     # File uploads
│   │   └── webhooks/clerk/              # Clerk user sync
│   ├── dashboard/                       # AI chat interface
│   ├── documents/                       # Documents list
│   ├── projects/[id]/                   # Project detail (4 tabs)
│   ├── settings/                        # User settings
│   ├── sign-in/                         # Clerk sign-in
│   └── sign-up/                         # Clerk sign-up
├── components/
│   ├── claims/                          # Claim UI components
│   ├── features/                        # Feature modals
│   │   ├── EditProjectModal.tsx         # Edit project dialog
│   │   └── NewProjectModal.tsx          # Create project dialog
│   ├── layout/                          # AppShell, Sidebar, MobileNav
│   ├── project/                         # Project components
│   └── ui/                              # Reusable primitives
├── lib/
│   ├── ai/
│   │   ├── knowledge/                   # Domain knowledge base
│   │   │   ├── carrier-patterns.ts      # Carrier objections & rebuttals
│   │   │   ├── commonly-missed.ts       # 40+ items carriers omit
│   │   │   ├── document-templates.ts    # Output templates
│   │   │   ├── index.ts                 # Knowledge base exports
│   │   │   ├── irc-codes-full.ts        # Building codes
│   │   │   ├── manufacturer-requirements.ts  # GAF/OC/CT specs
│   │   │   ├── measurement-intelligence.ts   # EagleView/HOVER parsing
│   │   │   ├── osha-safety.ts           # 29 CFR 1926 fall protection (NEW)
│   │   │   ├── state-codes.ts           # State-specific amendments (NEW)
│   │   │   ├── supplement-workflow.ts   # Process knowledge
│   │   │   └── xactimate-full.ts        # 100+ line item codes
│   │   ├── anthropic.ts                 # Claude integration
│   │   ├── document-generator.ts        # Document generation
│   │   ├── executor.ts                  # Tool execution
│   │   ├── openai.ts                    # GPT-4 integration
│   │   ├── scope-parser.ts              # Carrier scope PDF parsing
│   │   └── tools.ts                     # AI tool definitions
│   ├── auth.ts                          # Clerk auth utilities
│   ├── claims/                          # Claim utilities
│   └── validations/                     # Zod schemas
├── middleware.ts                        # Clerk route protection
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
| `parse_carrier_scope` | Parse carrier scope PDF and extract all data |
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

- [ ] Email tool for carrier/contractor communication
- [ ] Measurement report integration (EagleView/Hover)
- [ ] Settings persistence to database
- [ ] Mobile app

## Deployment

Push to `main` branch triggers automatic Vercel deployment.

## License

Private - GalaxyCo.ai
