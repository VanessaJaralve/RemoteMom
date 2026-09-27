# Black Friday Early Access Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a separate Black Friday / Cyber Monday early-access beta page and route campaign submissions to a separate Google Sheet tab.

**Architecture:** Reuse the existing static landing site, shared `landing/waitlist.js` form handler pattern, Vercel API forwarding pattern, and Google Apps Script router. Add a single new endpoint and campaign-specific submission type without touching mobile app data models.

**Tech Stack:** Static HTML/CSS/JavaScript, Vercel serverless functions, Google Apps Script, Jest.

---

### Task 1: Campaign Page And Frontend Submission

**Files:**
- Create: `landing/black-friday/index.html`
- Modify: `landing/styles.css`
- Modify: `landing/waitlist.js`
- Test: `__tests__/LandingPage.test.ts`

- [x] **Step 1: Write failing landing-page tests**

Check for `/black-friday/`, `data-black-friday-form`, `/api/black-friday`, the required form fields, beta-only copy, no payment language, and local backup key.

- [x] **Step 2: Run tests and verify failure**

Run: `pnpm test -- LandingPage.test.ts BlackFridayEarlyAccessEndpoint.test.ts ValidationGoogleAppsScript.test.ts`

Expected: FAIL because the page and endpoint do not exist yet.

- [x] **Step 3: Implement page and shared JavaScript handling**

Add a standalone campaign page with the approved early-access positioning. Add JavaScript handling for `[data-black-friday-form]` that posts to `/api/black-friday` and saves local fallback entries under `remotemom:black-friday-early-access`.

### Task 2: Collection Endpoint And Apps Script Routing

**Files:**
- Create: `api/black-friday.js`
- Modify: `integrations/google-apps-script/validation-webhook.gs`
- Test: `__tests__/BlackFridayEarlyAccessEndpoint.test.ts`
- Test: `__tests__/ValidationGoogleAppsScript.test.ts`

- [x] **Step 1: Write failing endpoint and Apps Script tests**

Check endpoint validation, webhook forwarding, required `submissionType`, and Apps Script routing to `Black Friday Early Access`.

- [x] **Step 2: Implement endpoint and routing**

Add `/api/black-friday` with CORS, strict allowed values, webhook forwarding, and destination confirmation. Update Apps Script to create and append rows to the campaign sheet.

### Task 3: Documentation And Verification

**Files:**
- Modify: `docs/Validation_Collection_Setup.md`
- Modify: `docs/RemoteMom_Product_Brief_Roadmap.md`
- Modify: `docs/RemoteMom_Project_Checklist.md`

- [x] **Step 1: Update existing docs**

Document the new endpoint, submission payload, Google Sheet tab, and beta-only campaign boundary.

- [x] **Step 2: Run verification**

Run: `pnpm test`, `pnpm exec tsc --noEmit`, and manually inspect `/black-friday/` in a browser where possible.
