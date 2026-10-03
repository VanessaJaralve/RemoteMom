# Launchpad Validation Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a Philippines-focused Remote Mom's Launchpad opt-in funnel with a downloadable starter kit, separate lead collection, tracked campaign sources, and four social validation assets.

**Architecture:** Extend the existing static landing stack with a separate `/launchpad/` route and shared submission script. Add a dedicated Vercel endpoint that forwards normalized leads to the existing Apps Script webhook, where they are routed to a `Launchpad Leads` sheet. Generate the PDF and social images from project-local scripts so the assets are reproducible and easy to revise.

**Tech Stack:** Static HTML/CSS/JavaScript, Vercel Node endpoint, Google Apps Script, Jest, ReportLab, Pillow, Poppler, existing Vercel deployment structure.

---

### Task 1: Define funnel behavior with failing tests

**Files:**
- Create: `__tests__/LaunchpadLeadEndpoint.test.ts`
- Modify: `__tests__/LandingPage.test.ts`
- Modify: `__tests__/ValidationGoogleAppsScript.test.ts`

- [x] Test that `/launchpad/` includes the approved headline, benefit copy, required lead fields, privacy copy, and local PDF link.
- [x] Test that the shared script submits Launchpad leads, captures allowed UTM values, redirects to the download page, and preserves a local backup on failure.
- [x] Test endpoint validation, normalized `launchpad-lead` forwarding, configured-webhook behavior, and sheet-write confirmation.
- [x] Test Apps Script routing and the `Launchpad Leads` headers.
- [x] Run the focused tests and confirm failure because the funnel does not yet exist.

### Task 2: Implement the landing page and lead pipeline

**Files:**
- Create: `landing/launchpad/index.html`
- Create: `landing/launchpad/download/index.html`
- Create: `landing/launchpad/styles.css`
- Create: `api/launchpad-lead.js`
- Modify: `landing/waitlist.js`
- Modify: `integrations/google-apps-script/validation-webhook.gs`

- [x] Build a mobile-first, accessible opt-in page with one primary CTA and accurate safety language.
- [x] Add five challenge options and explicit consent/privacy copy.
- [x] Capture `utm_source`, `utm_medium`, and `utm_campaign` from the page URL using bounded, normalized strings.
- [x] Send leads to `/api/launchpad-lead`, preserve a local-device backup on failure, and redirect only after confirmed collection.
- [x] Route `launchpad-lead` submissions to a separate `Launchpad Leads` sheet.
- [x] Add a download page with the PDF link and a secondary RemoteMoms beta link.
- [x] Run focused tests and confirm they pass.

### Task 3: Generate and verify the starter-kit PDF

**Files:**
- Create: `scripts/build-launchpad-starter-kit.py`
- Create: `output/pdf/pinay-mom-remote-work-fit-safety-starter-kit.pdf`
- Copy: `landing/launchpad/download/pinay-mom-remote-work-fit-safety-starter-kit.pdf`

- [x] Generate a branded, mobile-readable PDF from the approved starter-kit content.
- [x] Include role fit, transferable skills, schedule compatibility, job verification, privacy, and the seven-day plan.
- [x] Include official Philippine safety references and avoid legal, hiring, or income guarantees.
- [x] Render every page to PNG, inspect the complete document, and verify page count and extracted text.

### Task 4: Create four social assets

**Files:**
- Create: `scripts/build-launchpad-social-assets.py`
- Create: `marketing/launchpad-social/post-01-remote-vs-flexible.png`
- Create: `marketing/launchpad-social/post-02-verify-before-applying.png`
- Create: `marketing/launchpad-social/post-03-va-not-only-path.png`
- Create: `marketing/launchpad-social/post-04-thirty-minute-search.png`

- [x] Generate four 1080-by-1350 static assets matching the Launchpad funnel.
- [x] Keep each asset focused on one hook with readable mobile typography and one concise CTA.
- [x] Include no fabricated testimonials, results, salaries, or employment promises.
- [x] Inspect the four final PNG files at original resolution.

### Task 5: Verify responsive behavior and update documentation

**Files:**
- Modify: `docs/Validation_Collection_Setup.md`
- Modify: `docs/RemoteMom_Project_Checklist.md`

- [x] Document the endpoint, submission type, sheet name, fields, PDF path, and UTM behavior in the existing collection guide.
- [x] Record the completed funnel in the existing checklist.
- [x] Serve the static site locally and inspect mobile, tablet, and desktop layouts.
- [x] Verify keyboard focus, form errors, successful submission behavior, and download availability.
- [x] Run focused Jest tests, all available static checks, and the production build if the repository defines one.
- [x] Report any unrelated test-environment limitations without claiming they passed.
