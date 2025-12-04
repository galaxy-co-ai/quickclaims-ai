# Blockers Log

Document any blockers encountered during implementation.

## Format

```
### [Date] Phase X: Brief Title
**Issue:** Description of the blocker
**Impact:** What this prevents
**Resolution:** How it was resolved (or "Skipped - moved to next phase")
```

---

## Log

### [2025-12-04] PDF Parsing: Document Upload Failures in Production
**Issue:** Users reported "technical error" when uploading carrier scope PDFs via the AI assistant. The `pdf-parse` library (v2.4.5) uses native Node.js modules that don't work reliably in Vercel's serverless environment.

**Impact:** All document parsing via the AI chat interface was failing in production, despite working locally.

**Resolution (Attempt 1 - Partial):** 
- Added `export const runtime = 'nodejs'` to API routes
- Improved error handling
- **Result:** Still failing in production

**Resolution (Attempt 2 - Complete Fix):**
Replaced `pdf-parse` entirely with a robust dual-method extraction system:

1. **New `lib/pdf/extract.ts` utility** with:
   - **Primary**: Mozilla PDF.js (`pdfjs-dist`) - pure JavaScript, works everywhere
   - **Fallback**: GPT-4 Vision for scanned/image-based PDFs
   - Automatic fallback chain: PDF.js → GPT-4 Vision → graceful failure
   - Reports which method succeeded

2. **Updated all PDF consumers** to use new extraction:
   - `lib/ai/scope-parser.ts`
   - `lib/ai/measurement-parser.ts`
   - `lib/extract/scope.ts`

**Files Modified:**
- `lib/pdf/extract.ts` (NEW)
- `lib/ai/scope-parser.ts`
- `lib/ai/measurement-parser.ts`
- `lib/extract/scope.ts`
- `package.json` (added `pdfjs-dist`)
