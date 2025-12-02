# QuickClaims.ai

AI-powered project management platform for construction contractors. Upload scope documents and get instant roadmaps, materials lists, and cost estimates.

## Features

- **AI Concierge**: Guided project creation wizard
- **Document Upload**: Insurance scopes (PDF), photos, and project documents
- **AI Document Generation**:
  - Project Roadmaps with phases and tasks
  - Materials lists with quantities and pricing
  - Detailed cost estimates with role-based labor breakdown
  - Project Briefs with objectives and risks
- **Smart Caching**: Redis-powered caching for fast repeat generations
- **RAG Context**: Vector search for improved AI accuracy
- **Export Options**: CSV and PDF exports for all documents
- **Generation Options**: Adjust temperature and detail level

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL + Prisma ORM
- **File Storage**: Vercel Blob
- **AI**: OpenAI GPT-4o
- **Caching**: Upstash Redis
- **Vector Search**: Upstash Vector
- **Deployment**: Vercel

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

Fill in your environment variables (see `.env.example` for full list):

**Required:**
- `DATABASE_URL` - Neon PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token

**Recommended:**
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` - For caching
- `UPSTASH_VECTOR_REST_URL` / `UPSTASH_VECTOR_REST_TOKEN` - For RAG

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
quickclaims-ai/
├── app/
│   ├── api/                 # API routes
│   │   ├── ai/generate/     # AI document generation
│   │   ├── exports/         # CSV/PDF exports
│   │   ├── projects/        # Project CRUD + activity
│   │   └── uploads/         # File upload handling
│   ├── dashboard/           # Dashboard with AI concierge
│   └── projects/[id]/       # Project detail page
├── components/
│   ├── project/             # Project-specific components
│   └── ui/                  # Reusable primitives (Button, Input, Card, Label)
├── docs/
│   ├── CURRENT_SESSION.md   # Session tracking
│   └── sessions/            # Archived sessions
├── lib/
│   ├── ai/                  # AI utilities (openai.ts, guidance.ts)
│   ├── extract/             # PDF text extraction
│   ├── types/               # TypeScript type definitions
│   └── validations/         # Zod schemas
├── prisma/
│   └── schema.prisma        # Database schema
├── WARP.md                  # Project rules and conventions
└── README.md
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects` | GET/POST | List/create projects |
| `/api/projects/[id]/activity` | GET | Get activity log |
| `/api/uploads` | POST | Upload files |
| `/api/uploads/[id]` | PATCH/DELETE | Rename/delete uploads |
| `/api/ai/generate` | POST | Generate AI documents |
| `/api/exports/[id]/materials.csv` | GET | Export materials CSV |
| `/api/exports/[id]/materials/pdf` | GET | Export materials PDF |
| `/api/exports/[id]/estimate.csv` | GET | Export estimate CSV |
| `/api/exports/[id]/estimate/pdf` | GET | Export estimate PDF |

## Development

```bash
# Type check
npx tsc --noEmit

# Build
npm run build

# Prisma Studio (DB GUI)
npx prisma studio
```

## Deployment

Push to `main` branch triggers automatic Vercel deployment.

## License

Private - GalaxyCo.ai
