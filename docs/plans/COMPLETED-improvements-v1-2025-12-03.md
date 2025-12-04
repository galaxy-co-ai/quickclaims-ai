# [COMPLETED] QuickClaims.ai Improvements V1

**Completed:** 2025-12-03  
**Agent:** Cursor AI (Claude)  
**Branch:** feature/improvements-v1  
**Total Commits:** 10  

---

# QuickClaims.ai Improvements Implementation Plan V1

**Created:** December 3, 2025  
**Status:** COMPLETED  
**Branch:** feature/improvements-v1  

---

## Agent Kickoff Instructions

You are implementing a comprehensive improvement plan for QuickClaims.ai, an AI-powered insurance supplement platform for roofing contractors.

### CRITICAL RULES - READ CAREFULLY

1. **DO NOT modify existing UI** - layouts, styles, component designs must stay the same
2. **DO NOT remove or reorganize** existing features
3. **ONLY add new features/pages** as specified in this plan
4. **Backend enhancements are fine** - but frontend must remain simple and consistent
5. **After EACH phase**: commit to git and update docs/CHANGELOG.md
6. **Use conventional commits**: `feat(scope): message`, `fix(scope): message`, `chore(scope): message`
7. **If blocked**: document in docs/BLOCKERS.md and continue to next phase
8. **When ALL phases complete**: rename this file to add [COMPLETED] prefix and date

### Git Workflow

1. Create and checkout branch: `git checkout -b feature/improvements-v1`
2. After each phase: commit with descriptive message, then push
3. At the end: leave branch ready for user to review and merge

---

## Phase 0: Project Setup

Create documentation structure and testing framework.

### 0.1 Create docs folder structure

The docs folder should contain:
- `docs/CHANGELOG.md` - Track all changes
- `docs/BLOCKERS.md` - Document any blockers encountered
- `docs/plans/` - This plan file is already here

### 0.2 Set up Vitest for testing

Install dependencies:
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

Create `vitest.config.ts` at project root:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
})
```

Create `vitest.setup.ts` at project root:
```typescript
import '@testing-library/jest-dom'
```

Add to `package.json` scripts:
```json
"test": "vitest",
"test:run": "vitest run"
```

### 0.3 Initialize CHANGELOG.md

Create `docs/CHANGELOG.md`:
```markdown
# Changelog

All notable changes to QuickClaims.ai will be documented in this file.

## [Unreleased]

### Added
- Documentation structure (docs/, CHANGELOG.md, plans/)
- Vitest testing framework

### Changed
- (none yet)

### Fixed
- (none yet)
```

### 0.4 Initialize BLOCKERS.md

Create `docs/BLOCKERS.md`:
```markdown
# Blockers Log

Document any blockers encountered during implementation.

## Format
- **Date**: YYYY-MM-DD
- **Phase**: X
- **Issue**: Description
- **Resolution**: How it was resolved (or "Skipped - moved to next phase")

---

(No blockers yet)
```

**COMMIT**: `chore(setup): add docs structure and vitest testing framework`

---

## Phase 1: Code Quality Fixes

Fix console.log statements and silent error handling per project rules.

### 1.1 Remove console.log/error/warn statements

Files to fix (replace with toast.error or remove entirely):

| File | Count | Action |
|------|-------|--------|
| `app/claims/[id]/ClaimDetailClient.tsx` | 7 | Replace with toast.error |
| `app/api/ai/generate/route.ts` | 2 | Remove (server-side) |
| `components/claims/SupplementBuilder.tsx` | 2 | Replace with toast.error |
| `components/claims/DefenseNotes.tsx` | 3 | Replace with toast.error |
| `components/claims/StartClaimButton.tsx` | 1 | Replace with toast.error |
| `lib/ai/gamma.ts` | 3 | Remove (server-side) |
| `app/api/claims/[claimId]/analyze-photo/route.ts` | 1 | Remove (server-side) |
| `components/ui/AddressAutocomplete.tsx` | 1 | Replace with toast.error |
| `app/claims/[id]/checklist/PhotoChecklist.tsx` | 1 | Replace with toast.error |

Pattern to follow for client components:
```typescript
// BEFORE
} catch (error) {
  console.error('Failed to load photos:', error)
}

// AFTER
} catch {
  toast.error('Could not load photos. Please try again.')
}
```

For API routes, simply remove the console statements or replace with proper server logging if needed.

### 1.2 Fix silent catch blocks

There are 18 empty `catch {` blocks that swallow errors silently. Each must have user-friendly feedback added.

### 1.3 Add basic test

Create `lib/__tests__/smoke.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'

describe('Smoke tests', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true)
  })
})
```

**COMMIT**: `fix(quality): remove console logs and add user-friendly error messages`

---

## Phase 2: Scope Parsing Without Project ID

Enable one-shot workflow: upload scope PDF and auto-create project.

### 2.1 Update scope parser to extract address

Modify `lib/ai/scope-parser.ts`:
- Ensure address extraction from parsed scope text
- Return extracted address, carrier, claim number in the result object

### 2.2 Update executor to auto-create project

Modify `lib/ai/executor.ts` function `parseCarrierScope` (around line 595-650):

Current behavior returns error if no projectId. Change to:
1. Parse the scope first to extract address, carrier, claim info
2. Search for existing project with matching address (case-insensitive)
3. If not found, create new project with extracted data
4. Then associate scope with project and continue

```typescript
async function parseCarrierScope(args: {
  fileUrl: string
  projectId?: string
}): Promise<ToolResult> {
  const userId = getUserId()
  
  try {
    // If projectId provided, use it directly
    if (args.projectId) {
      // ... existing logic
    }
    
    // No projectId - parse first, then find/create project
    const parseResult = await parseCarrierScopeFromUrl(args.fileUrl, null, userId)
    
    if (!parseResult.success || !parseResult.data?.extractedAddress) {
      return { success: false, message: 'Could not extract address from scope PDF' }
    }
    
    // Search for existing project by address
    let project = await db.project.findFirst({
      where: {
        userId,
        address: { contains: parseResult.data.extractedAddress, mode: 'insensitive' }
      }
    })
    
    // Create project if not found
    if (!project) {
      project = await db.project.create({
        data: {
          userId,
          clientName: parseResult.data.extractedClientName || 'Unknown Client',
          address: parseResult.data.extractedAddress,
          projectType: 'Insurance Claim',
          status: 'created',
        }
      })
    }
    
    // Now associate scope with project
    // ... continue with existing logic using project.id
  }
}
```

### 2.3 Update AI tool definition

In `lib/ai/tools.ts`, update `parse_carrier_scope` description:
```typescript
description: 'Parse a carrier scope PDF and extract all data (address, carrier, claim #, line items, totals, D$/SQ). If no projectId is provided, automatically finds or creates a project based on the extracted address.',
```

Remove `required: ['fileUrl']` - projectId should be optional.

**COMMIT**: `feat(scope): enable scope parsing without requiring project ID`

---

## Phase 3: Measurement Report Parsing

Add AI-powered parsing for EagleView, HOVER, and GAF QuickMeasure PDFs.

### 3.1 Create measurement parser module

Create `lib/ai/measurement-parser.ts`:

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export interface MeasurementData {
  totalSquares: number
  pitch: string | null
  ridgeLength: number | null
  hipLength: number | null
  valleyLength: number | null
  eaveLength: number | null
  rakeLength: number | null
  wastePercent: number | null
  reportType: 'eagleview' | 'hover' | 'gaf_quickmeasure' | 'unknown'
  rawFields: Record<string, string | number>
}

export async function parseMeasurementReport(
  pdfText: string
): Promise<{ success: boolean; data?: MeasurementData; message: string }> {
  // Use GPT-4o to extract structured measurement data
  // Reference patterns from lib/ai/knowledge/measurement-intelligence.ts
  
  const systemPrompt = `You are a measurement report parser. Extract roof measurements from EagleView, HOVER, or GAF QuickMeasure reports.
  
Return JSON with these fields:
- totalSquares: number (total roof area in squares)
- pitch: string (e.g., "6/12", "8/12")  
- ridgeLength: number (linear feet)
- hipLength: number (linear feet)
- valleyLength: number (linear feet)
- eaveLength: number (linear feet)
- rakeLength: number (linear feet)
- wastePercent: number (percentage)
- reportType: "eagleview" | "hover" | "gaf_quickmeasure" | "unknown"
- rawFields: object with any other relevant fields found

If a field cannot be determined, use null.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Parse this measurement report:\n\n${pdfText}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    })
    
    const data = JSON.parse(response.choices[0]?.message?.content || '{}')
    
    return {
      success: true,
      data: data as MeasurementData,
      message: `Parsed ${data.reportType} report: ${data.totalSquares} squares`
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to parse measurement report'
    }
  }
}
```

### 3.2 Add AI tool for measurement parsing

In `lib/ai/tools.ts`, add new tool:

```typescript
{
  type: 'function',
  function: {
    name: 'parse_measurement_report',
    description: 'Parse an EagleView, HOVER, or GAF QuickMeasure PDF to extract roof measurements (total squares, pitch, ridge/hip/valley/eave/rake lengths, waste percentage). Automatically populates project with measurement data.',
    parameters: {
      type: 'object',
      properties: {
        fileUrl: {
          type: 'string',
          description: 'The URL of the measurement report PDF file',
        },
        projectId: {
          type: 'string',
          description: 'The project ID to associate measurements with',
        },
      },
      required: ['fileUrl', 'projectId'],
    },
  },
},
```

Add to TOOL_DESCRIPTIONS:
```typescript
parse_measurement_report: 'Parsing measurement report',
```

### 3.3 Add executor implementation

In `lib/ai/executor.ts`:
1. Import the parser
2. Add case in switch statement
3. Implement function that parses PDF and updates project/claim

**COMMIT**: `feat(measurements): add AI parsing for EagleView, HOVER, GAF QuickMeasure PDFs`

---

## Phase 4: Global Search

Implement semantic search across projects, claims, and documents.

### 4.1 Create search API endpoint

Create `app/api/search/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireAuthUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { searchScope, embed, vectorIndex } from '@/lib/vector'

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuthUserId()
    const query = request.nextUrl.searchParams.get('q')
    
    if (!query || query.length < 2) {
      return NextResponse.json({ projects: [], documents: [] })
    }
    
    // Parallel search: database + semantic
    const [dbResults, semanticResults] = await Promise.all([
      // Database text search
      db.project.findMany({
        where: {
          userId,
          OR: [
            { clientName: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } },
            { claim: { carrier: { contains: query, mode: 'insensitive' } } },
            { claim: { claimNumber: { contains: query, mode: 'insensitive' } } },
          ],
        },
        take: 10,
        include: { claim: { select: { id: true, carrier: true, status: true } } },
      }),
      // Semantic search (if configured)
      vectorIndex ? performSemanticSearch(userId, query) : Promise.resolve([]),
    ])
    
    return NextResponse.json({
      projects: dbResults,
      semantic: semanticResults,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

async function performSemanticSearch(userId: string, query: string) {
  // Implementation using lib/vector.ts
  return []
}
```

### 4.2 Create search indexer

Create `lib/search/indexer.ts` for indexing projects and documents when created.

### 4.3 Create Command Palette component

Create `components/ui/CommandPalette.tsx`:

- Modal overlay triggered by Cmd+K / Ctrl+K
- Search input with debounce (300ms)
- Results grouped by type
- Keyboard navigation (arrow keys, Enter)
- MUST include: role="dialog", aria-modal, aria-label, focus trap

### 4.4 Integrate into AppShell

In `components/layout/AppShell.tsx`:
- Add useEffect for keyboard listener (Cmd+K / Ctrl+K)
- Render CommandPalette conditionally
- DO NOT change any existing layout or styling

**COMMIT**: `feat(search): add global semantic search with Cmd+K command palette`

---

## Phase 5: Accessibility Fixes

Fix WCAG compliance issues without changing visual design.

### 5.1 Fix tab components in ClaimDetailClient

In `app/claims/[id]/ClaimDetailClient.tsx`:

```typescript
// Tab container
<div 
  className="flex gap-2 border-b..."
  role="tablist"
  aria-label="Claim sections"
>

// Each tab button
<button
  onClick={() => setActiveTab('scope')}
  role="tab"
  aria-selected={activeTab === 'scope'}
  aria-controls="tabpanel-scope"
  tabIndex={activeTab === 'scope' ? 0 : -1}
  className={...}
>

// Tab content
<div
  role="tabpanel"
  id="tabpanel-scope"
  aria-labelledby="tab-scope"
>
```

### 5.2 Fix photo lightbox

In `app/projects/[id]/ProjectDetailClient.tsx` (PhotoGallery component around line 1100):

- Add `aria-label="Close photo"` to close button
- Add `role="dialog"` and `aria-modal="true"` to modal container
- Add keyboard handler:
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedPhoto(null)
    // Arrow keys for navigation
  }
  if (selectedPhoto) {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }
}, [selectedPhoto])
```

### 5.3 Fix modal dialogs

In `components/features/EditProjectModal.tsx` and `NewProjectModal.tsx`:
- Verify focus trap is working
- Add Escape key handler
- Ensure proper aria attributes

### 5.4 Audit remaining elements

Check for any buttons or interactive elements missing aria-labels and fix them.

**COMMIT**: `fix(a11y): add ARIA attributes, keyboard navigation, focus management`

---

## Phase 6: Email Page (Coming Soon)

Add placeholder Email page for future Resend integration.

### 6.1 Create Email page

Create `app/email/page.tsx`:

```typescript
import { AppShell } from '@/components/layout'
import { Card } from '@/components/ui'
import { Mail, Bell } from 'lucide-react'

export default function EmailPage() {
  return (
    <AppShell mobileTitle="Email">
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8" />
          </div>
          
          <h1 className="text-2xl font-semibold mb-2">Email Integration</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Send supplement submissions, rebuttals, and follow-ups directly to carriers — all from within QuickClaims.
          </p>
          
          <Card className="p-6 text-left max-w-md mx-auto">
            <h3 className="font-medium mb-3">Coming Soon</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                One-click supplement submission to adjusters
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Pre-written email templates for every stage
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Automatic follow-up reminders
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Email history linked to each claim
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
```

### 6.2 Add to navigation

In `components/layout/Sidebar.tsx`, add Email link (after Documents):
```typescript
{ icon: Mail, label: 'Email', href: '/email' },
```

In `components/layout/MobileNav.tsx`, add Email to navigation items.

### 6.3 Create email placeholder module

Create `lib/email/index.ts`:
```typescript
export interface EmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  // Placeholder for future Resend integration
  // Will be implemented when domain is configured
  
  if (!process.env.RESEND_API_KEY) {
    return { 
      success: false, 
      error: 'Email not configured. RESEND_API_KEY required.' 
    }
  }
  
  // TODO: Implement with Resend
  return { success: false, error: 'Email integration coming soon.' }
}
```

**COMMIT**: `feat(email): add Email page with Coming Soon placeholder`

---

## Phase 7: Claim Workflow Automation

Auto-advance claim status based on actions.

### 7.1 Create workflow automation module

Create `lib/claims/workflow-automation.ts`:

```typescript
import { db } from '@/lib/db'
import { logActivity } from '@/lib/activity'

type ClaimStatus = 
  | 'intake'
  | 'scope_review'
  | 'delta_analysis'
  | 'supplement_pending'
  | 'awaiting_sol'
  | 'rebuttal'
  | 'build_scheduled'
  | 'post_build'
  | 'invoicing'
  | 'depreciation_pending'
  | 'completed'

const STATUS_ORDER: ClaimStatus[] = [
  'intake',
  'scope_review', 
  'delta_analysis',
  'supplement_pending',
  'awaiting_sol',
  'rebuttal',
  'build_scheduled',
  'post_build',
  'invoicing',
  'depreciation_pending',
  'completed',
]

export async function checkAndAdvanceStatus(claimId: string): Promise<void> {
  const claim = await db.claim.findUnique({
    where: { id: claimId },
    include: {
      carrierScopes: { select: { id: true } },
      deltas: { where: { status: { in: ['identified', 'approved'] } } },
      project: {
        include: {
          documents: { where: { type: { in: ['delta_analysis', 'defense_notes'] } } }
        }
      }
    }
  })
  
  if (!claim) return
  
  const currentIndex = STATUS_ORDER.indexOf(claim.status as ClaimStatus)
  let newStatus: ClaimStatus | null = null
  
  // Determine appropriate status based on completed work
  if (claim.carrierScopes.length > 0 && currentIndex < STATUS_ORDER.indexOf('scope_review')) {
    newStatus = 'scope_review'
  }
  
  if (claim.deltas.length > 0 && currentIndex < STATUS_ORDER.indexOf('delta_analysis')) {
    newStatus = 'delta_analysis'
  }
  
  const hasDefenseNotes = claim.project.documents.some(d => d.type === 'defense_notes')
  if (hasDefenseNotes && currentIndex < STATUS_ORDER.indexOf('supplement_pending')) {
    newStatus = 'supplement_pending'
  }
  
  // Only advance forward, never backward
  if (newStatus && STATUS_ORDER.indexOf(newStatus) > currentIndex) {
    await db.claim.update({
      where: { id: claimId },
      data: { status: newStatus }
    })
    
    await logActivity({
      claimId,
      action: 'status_change',
      description: `Status auto-advanced to ${newStatus.replace(/_/g, ' ')}`
    })
  }
}
```

### 7.2 Integrate into existing flows

Add `checkAndAdvanceStatus(claimId)` call to:
- `app/api/claims/[claimId]/parse-scope/route.ts` - after successful parse
- `app/api/claims/[claimId]/generate-deltas/route.ts` - after deltas generated
- `app/api/claims/[claimId]/defense-notes/generate/route.ts` - after notes generated

**COMMIT**: `feat(workflow): auto-advance claim status based on completed actions`

---

## Phase 8: Settings Persistence

Connect Settings page to User.preferences in database.

### 8.1 Create settings validation schema

Create `lib/validations/settings.ts`:

```typescript
import { z } from 'zod'

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  defaultCarrier: z.string().optional(),
  defaultProjectType: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  compactView: z.boolean().optional(),
})

export type UserPreferences = z.infer<typeof userPreferencesSchema>
```

### 8.2 Create settings API endpoint

Create `app/api/settings/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireAuthUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { userPreferencesSchema } from '@/lib/validations/settings'

export async function GET() {
  try {
    const userId = await requireAuthUserId()
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { preferences: true }
    })
    return NextResponse.json({ preferences: user?.preferences || {} })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await requireAuthUserId()
    const body = await request.json()
    
    const validated = userPreferencesSchema.parse(body)
    
    const user = await db.user.update({
      where: { id: userId },
      data: { preferences: validated },
      select: { preferences: true }
    })
    
    return NextResponse.json({ preferences: user.preferences })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid preferences' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
  }
}
```

### 8.3 Update Settings page

Modify `app/settings/page.tsx` to:
- Fetch preferences on mount via GET /api/settings
- Save changes via PATCH /api/settings
- Add toast feedback on save success/failure
- DO NOT change visual layout

**COMMIT**: `feat(settings): persist user preferences to database`

---

## Phase 9: Finalization

Complete documentation and mark plan as finished.

### 9.1 Update README.md

Add to "What's New" section:

```markdown
### Improvements V1 (December 2025)
- **Global Search** - Press Cmd+K to search across all projects, claims, and documents
- **Smart Scope Parsing** - Upload carrier scopes without creating a project first - AI extracts address and auto-creates
- **Measurement Report Parsing** - AI parses EagleView, HOVER, and GAF QuickMeasure PDFs automatically
- **Workflow Automation** - Claim status auto-advances as you complete tasks
- **Settings Persistence** - Your preferences are now saved to your account
- **Accessibility Improvements** - Better keyboard navigation and screen reader support
```

Update "Coming Soon":
```markdown
- [x] ~~Email integration~~ Email page added (integration pending domain setup)
```

### 9.2 Final CHANGELOG update

Update `docs/CHANGELOG.md` with version number and release date.

### 9.3 Run full test suite

```bash
npm run test:run
npm run lint  
npm run build
```

Fix any issues that arise before proceeding.

### 9.4 Mark plan as complete

Rename this file:
```
docs/plans/PLAN-improvements-v1.md -> docs/plans/COMPLETED-improvements-v1-YYYY-MM-DD.md
```

Add completion header to top of file:
```markdown
# [COMPLETED] QuickClaims.ai Improvements V1

**Completed:** YYYY-MM-DD  
**Agent:** Cursor AI  
**Branch:** feature/improvements-v1  
**Total Commits:** X  
```

### 9.5 Final commit and push

```bash
git add .
git commit -m "docs: mark improvements-v1 plan as complete"
git push -u origin feature/improvements-v1
```

---

## Summary Checklist

- [x] Phase 0: Project Setup (docs, testing)
- [x] Phase 1: Code Quality Fixes  
- [x] Phase 2: Scope Parsing Without Project ID
- [x] Phase 3: Measurement Report Parsing
- [x] Phase 4: Global Search
- [x] Phase 5: Accessibility Fixes
- [x] Phase 6: Email Page (Coming Soon)
- [x] Phase 7: Claim Workflow Automation
- [x] Phase 8: Settings Persistence
- [x] Phase 9: Finalization

**Total Phases:** 10  
**Actual Commits:** 10  
**Branch:** feature/improvements-v1
