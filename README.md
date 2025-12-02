# QuickClaims.ai

AI-powered insurance claim supplement platform for construction contractors. Upload carrier scopes, detect missing items, generate IRC-backed defense notes, and build professional supplement packages.

**Last Updated:** December 2, 2025

## Features

### Core Platform
- **AI Concierge** - Guided project creation wizard
- **Document Upload** - Insurance scopes (PDF), photos, project documents
- **AI Document Generation** - Roadmaps, materials lists, cost estimates, briefs
- **Smart Caching** - Redis-powered caching for fast repeat generations
- **Export Options** - CSV and PDF exports

### Insurance Claims (Complete)
- **Carrier Scope Parsing** - AI extracts line items from SOL PDFs
- **D$/SQ Analytics** - Dollar per square calculation and tracking
- **Photo Analysis** - GPT-4 Vision detects roof components and damage
- **Delta Detection** - Finds missing items by comparing scope vs. photos + code requirements
- **IRC Code References** - 9 complete IRC codes with defense templates
- **Defense Note Generator** - Professional justifications with code citations
- **Supplement Builder** - Complete package with line items, photos, defense notes
- **Xactimate Export** - CSV format compatible with Xactimate import
- **Analytics Dashboard** - D$/SQ trends, carrier comparisons, pipeline tracking
- **Workflow Tracking** - 11 claim stages with expected days and next actions
- **Build Day Checklist** - 50+ item mobile-friendly photo checklist

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL + Prisma ORM
- **File Storage**: Vercel Blob
- **AI**: OpenAI GPT-4o / GPT-4 Vision
- **Caching**: Upstash Redis
- **Vector Search**: Upstash Vector
- **Deployment**: Vercel

## Project Structure

```
quickclaims-ai/
├── app/
│   ├── api/
│   │   ├── ai/generate/              # AI document generation
│   │   ├── claims/[claimId]/
│   │   │   ├── analyze-photo/        # GPT-4 Vision analysis
│   │   │   ├── defense-notes/        # Defense note generation
│   │   │   ├── deltas/[deltaId]/     # Delta item management
│   │   │   ├── generate-deltas/      # Delta detection engine
│   │   │   ├── parse-scope/          # Carrier scope parsing
│   │   │   └── supplement/           # Supplement package builder
│   │   ├── exports/                  # CSV/PDF exports
│   │   ├── projects/                 # Project CRUD + activity
│   │   └── uploads/                  # File upload handling
│   ├── claims/
│   │   ├── [id]/
│   │   │   ├── page.tsx              # Claim detail
│   │   │   ├── ClaimDetailClient.tsx # Tabbed interface (6 tabs)
│   │   │   └── checklist/            # Build day photo checklist
│   │   ├── analytics/                # D$/SQ and pipeline analytics
│   │   └── page.tsx                  # Claims list
│   ├── dashboard/                    # AI concierge
│   └── projects/[id]/                # Project detail
├── components/
│   ├── claims/                       # Claim components
│   │   ├── ClaimSummaryCard.tsx
│   │   ├── DefenseNotes.tsx
│   │   ├── DeltaList.tsx
│   │   ├── LineItemsTable.tsx
│   │   ├── ScopeUploader.tsx
│   │   ├── StartClaimButton.tsx
│   │   └── SupplementBuilder.tsx
│   ├── project/                      # Project components
│   └── ui/                           # Reusable primitives
├── lib/
│   ├── ai/                           # OpenAI utilities
│   ├── claims/
│   │   ├── irc-codes.ts              # IRC code reference + defense templates
│   │   ├── photo-analysis.ts         # GPT-4 Vision prompts
│   │   ├── photo-checklist.ts        # Build day checklist items (50+)
│   │   ├── schemas.ts                # Claim status definitions
│   │   ├── scope-parser.ts           # Carrier scope extraction
│   │   ├── workflow.ts               # Stage tracking utilities
│   │   ├── xactimate-codes.ts        # Xactimate code library (50+ codes)
│   │   └── xactimate-export.ts       # ESX export format
│   ├── extract/                      # PDF text extraction
│   └── validations/                  # Zod schemas
├── prisma/
│   └── schema.prisma                 # Database schema
└── WARP.md                           # Project rules
```

## Database Models

### Core
- **Project** - Roofing project with client info, uploads, documents
- **Upload** - Files stored in Vercel Blob
- **Document** - AI-generated documents (roadmap, materials, estimate, brief)

### Insurance Claims
- **Claim** - Insurance claim linked to project, 11 workflow stages
- **CarrierScope** - Parsed statement of loss with totals
- **LineItem** - Individual scope line items with Xactimate codes
- **ClaimActivity** - Audit log of claim actions
- **PhotoAnalysis** - GPT-4 Vision results for uploaded photos
- **DeltaItem** - Missing/incorrect items for supplement

## API Endpoints

### Projects
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects` | GET/POST | List/create projects |
| `/api/projects/[id]/activity` | GET | Activity log |
| `/api/uploads` | POST | Upload files |
| `/api/uploads/[id]` | PATCH/DELETE | Rename/delete |
| `/api/ai/generate` | POST | Generate AI documents |
| `/api/exports/[id]/materials.csv` | GET | Materials CSV |
| `/api/exports/[id]/estimate.csv` | GET | Estimate CSV |

### Claims
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/claims` | GET/POST | List/create claims |
| `/api/claims/[id]` | GET/PATCH | Get/update claim |
| `/api/claims/[id]/parse-scope` | POST | Parse carrier SOL PDF |
| `/api/claims/[id]/analyze-photo` | GET/POST | Photo analysis |
| `/api/claims/[id]/generate-deltas` | GET/POST | Delta detection |
| `/api/claims/[id]/deltas/[deltaId]` | PATCH/DELETE | Update delta status |
| `/api/claims/[id]/defense-notes` | GET/POST | Defense notes |
| `/api/claims/[id]/supplement` | GET/POST | Supplement package |

## Claim Workflow Stages

1. **Intake** - Initial setup (1 day expected)
2. **Scope Review** - Reviewing carrier scope (2 days)
3. **Delta Analysis** - Finding missing items (3 days)
4. **Supplement Pending** - Submitted to carrier (14 days)
5. **Awaiting SOL** - Waiting for revised SOL (10 days)
6. **Rebuttal** - Supplement denied, preparing response (5 days)
7. **Build Scheduled** - Approved, construction scheduled (30 days)
8. **Post Build** - Construction complete (5 days)
9. **Invoicing** - Invoice submitted (14 days)
10. **Depreciation Pending** - Awaiting depreciation recovery (30 days)
11. **Completed** - Claim fully resolved

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
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob

**Recommended:**
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
- `UPSTASH_VECTOR_REST_URL` / `UPSTASH_VECTOR_REST_TOKEN`

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

## Not Yet Implemented

- Authentication (Stack Auth planned, using TEMP_USER_ID)
- Multi-tenant user isolation
- Email notifications for claim status changes
- Mobile app (currently responsive web)

## Deployment

Push to `main` branch triggers automatic Vercel deployment.

## License

Private - GalaxyCo.ai
