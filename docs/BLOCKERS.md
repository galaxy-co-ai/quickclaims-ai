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
**Issue:** Users reported "technical error" when uploading carrier scope PDFs via the AI assistant. The `pdf-parse` library (v2.4.5) uses native Node.js modules that don't work in Vercel's Edge Runtime (the default for API routes).

**Impact:** All document parsing via the AI chat interface was failing in production, despite working locally.

**Resolution:** 
1. Added `export const runtime = 'nodejs'` to API routes that use pdf-parse:
   - `app/api/ai/chat/route.ts`
   - `app/api/claims/[claimId]/parse-scope/route.ts`
2. Improved error handling with specific, actionable error messages for:
   - Download failures (network issues, invalid URLs)
   - PDF parsing failures (corrupted, encrypted files)
   - Empty/scanned PDFs (no OCR text)

**Files Modified:**
- `app/api/ai/chat/route.ts`
- `app/api/claims/[claimId]/parse-scope/route.ts`
- `lib/ai/scope-parser.ts`
- `lib/ai/measurement-parser.ts`
- `lib/extract/scope.ts`
