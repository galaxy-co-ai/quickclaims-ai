# QuickClaims.ai

AI-powered project management platform for construction contractors.

## Features

- **AI Concierge**: Guided project creation with intelligent questioning
- **Document Upload**: Support for insurance scopes, photos, and project documents
- **Auto-Generation**:
  - Project Roadmaps based on scope analysis
  - Material lists with quantities
  - Detailed cost estimates (labor, permits, materials)
  - Project Briefs as the source of truth

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI GPT-4 with Vision API
- **Auth**: Clerk / NextAuth.js
- **File Storage**: AWS S3 / Vercel Blob / Uploadthing

## Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

#### Required:
- `DATABASE_URL` - PostgreSQL connection string (get from Vercel/Neon)
- `OPENAI_API_KEY` - OpenAI API key for AI features

#### Choose Authentication Provider:
- **Clerk** (recommended): Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
- **NextAuth**: Set `NEXTAUTH_URL` and `NEXTAUTH_SECRET`

#### Choose File Storage:
- **Vercel Blob** (recommended): Set `BLOB_READ_WRITE_TOKEN`
- **AWS S3**: Set AWS credentials
- **Uploadthing**: Set Uploadthing keys

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (after DATABASE_URL is set)
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
quickclaims-ai/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── dashboard/           # User dashboard
│   ├── projects/            # Project management
│   │   └── [id]/           # Individual project view
│   └── api/                # API routes
│       ├── projects/       # Project CRUD
│       ├── uploads/        # File upload handling
│       └── ai/             # AI generation endpoints
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── project/            # Project-specific components
│   └── concierge/          # AI concierge chat interface
├── lib/
│   ├── db.ts              # Prisma client
│   ├── ai/                # AI utilities and prompts
│   ├── storage/           # File storage utilities
│   └── validations/       # Zod schemas
└── prisma/
    └── schema.prisma      # Database schema
```

## Next Steps

1. Set up environment variables
2. Configure database connection
3. Choose and configure authentication provider
4. Choose and configure file storage
5. Start building!
