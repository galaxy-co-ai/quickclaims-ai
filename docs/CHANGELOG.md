# Changelog

All notable changes to QuickClaims.ai will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- Documentation structure (docs/, CHANGELOG.md, plans/)
- Vitest testing framework with React Testing Library
- One-shot scope parsing: upload a carrier scope PDF without creating a project first - AI extracts address and auto-creates project
- Measurement report parsing: AI parses EagleView, HOVER, and GAF QuickMeasure PDFs to extract roof measurements and calculate supplement line items
- Global search with Cmd+K / Ctrl+K command palette to quickly find projects, claims, and documents
- Email page with Coming Soon placeholder for future Resend integration
- Claim workflow automation: status auto-advances as tasks are completed (scope parsed, deltas generated, defense notes generated)
- Settings persistence: user preferences (theme, notifications, AI settings) now saved to database and restored on page load
- Error pages: custom error.tsx, global-error.tsx, and not-found.tsx for better error handling
- Loading states: skeleton loading UI for all main routes (dashboard, projects, documents, settings, claims)
- Rate limiting: Upstash-based rate limiting on AI routes to prevent abuse
- Security headers: CSP, HSTS, X-Frame-Options, and other security headers in next.config.ts
- CI/CD: GitHub Actions workflow for lint, typecheck, test, and build on PRs

### Changed
- (none yet)

### Fixed
- Removed console.log/error/warn statements from production code
- Added user-friendly toast notifications for all error states
- Accessibility: Added ARIA attributes to tabs, modals, and photo lightbox for better screen reader support
- Accessibility: Added keyboard navigation (Escape to close) for modal dialogs
- **PDF Parsing (Major Fix)**: Replaced unreliable `pdf-parse` library with robust dual-method extraction:
  - **Primary**: Mozilla PDF.js (`pdfjs-dist`) - pure JavaScript, works everywhere
  - **Fallback**: GPT-4 Vision for scanned/image-based PDFs
  - New `lib/pdf/extract.ts` utility with automatic fallback chain
- **PDF Error Handling**: Improved error messages for PDF parsing failures - now shows specific, actionable messages for download failures, corrupted files, encrypted PDFs, and scanned images without OCR

---

## Previous Releases

See README.md for historical feature releases.
