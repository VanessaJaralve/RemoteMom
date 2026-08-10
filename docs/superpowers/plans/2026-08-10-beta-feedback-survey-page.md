# Beta Feedback Survey Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a separate `/beta-feedback/` tester survey page with real collection into a dedicated Beta Feedback Google Sheet tab.

**Architecture:** Add one static feedback page, one Vercel API endpoint, one browser form handler branch, and one Apps Script routing branch. Reuse the existing collection pattern and `VALIDATION_SUBMISSIONS_WEBHOOK_URL`, but keep beta feedback separate with `submissionType: "beta-feedback"` and a `Beta Feedback` tab.

**Tech Stack:** Static HTML, shared CSS in `landing/styles.css`, browser JavaScript in `landing/waitlist.js`, Vercel serverless functions, Google Apps Script webhook template, Jest tests.

---

### Task 1: Add Beta Feedback Endpoint

**Files:**
- Create: `api/beta-feedback.js`
- Create: `__tests__/BetaFeedbackEndpoint.test.ts`

- [ ] **Step 1: Write the endpoint test**

Create `__tests__/BetaFeedbackEndpoint.test.ts`:

```ts
declare function require(moduleName: string): any;
declare const global: any;
declare const process: {
  env: Record<string, string | undefined>;
};

const handler = require('../api/beta-feedback.js');

function createResponse() {
  const response: any = {
    body: undefined,
    headers: {} as Record<string, string>,
    statusCode: 200,
    ended: false,
    end() {
      response.ended = true;
      return response;
    },
    json(body: unknown) {
      response.body = body;
      return response;
    },
    setHeader(name: string, value: string) {
      response.headers[name] = value;
      return response;
    },
    status(statusCode: number) {
      response.statusCode = statusCode;
      return response;
    }
  };

  return response;
}

describe('beta feedback collection endpoint', () => {
  const validBody = {
    bugsOrIssues: 'No bugs found.',
    confusingOrTooMuch: 'The medicine section needed a second look.',
    email: 'tester@example.com',
    firstScreen: 'Today',
    installedAndOpened: 'yes',
    mostUsefulFeature: 'today',
    name: 'Beta Tester',
    nextPriority: 'sharing',
    oneChildEnough: 'no',
    todayHelped: 'yes',
    understoodPurpose: 'A daily view for remote working moms.',
    useAgainTomorrow: 'yes',
    worthPayingFor: 'Sharing with my partner.'
  };

  it('rejects incomplete beta feedback submissions', async () => {
    const response = createResponse();

    await handler({ method: 'POST', body: { name: 'Beta Tester' } }, response);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: 'Please complete the required beta feedback questions before submitting.'
    });
  });

  it('requires a configured webhook before accepting beta feedback', async () => {
    const response = createResponse();
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;

    await handler({ method: 'POST', body: validBody }, response);

    expect(response.statusCode).toBe(503);
    expect(response.body).toEqual({
      error: 'Beta feedback collection is not configured yet.'
    });
  });

  it('forwards complete beta feedback with a beta-feedback submission type', async () => {
    const response = createResponse();
    const originalFetch = global.fetch;
    process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL = 'https://example.com/remotemom-webhook';
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ ok: true }),
      ok: true
    });

    await handler({ method: 'POST', body: validBody }, response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/remotemom-webhook',
      expect.objectContaining({
        body: expect.stringContaining('"submissionType":"beta-feedback"'),
        method: 'POST'
      })
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/remotemom-webhook',
      expect.objectContaining({
        body: expect.stringContaining('"todayHelped":"yes"')
      })
    );

    global.fetch = originalFetch;
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;
  });

  it('rejects webhook responses that do not confirm the beta feedback sheet write', async () => {
    const response = createResponse();
    const originalFetch = global.fetch;
    process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL = 'https://example.com/remotemom-webhook';
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ ok: false }),
      ok: true
    });

    await handler({ method: 'POST', body: validBody }, response);

    expect(response.statusCode).toBe(502);
    expect(response.body).toEqual({
      error: 'Beta feedback collection destination did not confirm the sheet write.'
    });

    global.fetch = originalFetch;
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;
  });
});
```

- [ ] **Step 2: Run the new test and verify it fails**

Run:

```bash
PATH="/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm test -- BetaFeedbackEndpoint.test.ts
```

Expected: FAIL because `api/beta-feedback.js` does not exist yet.

- [ ] **Step 3: Implement the endpoint**

Create `api/beta-feedback.js`:

```js
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  return body;
}

function normalizeFeedback(body) {
  const feedback = parseBody(body);

  return {
    bugsOrIssues: String(feedback.bugsOrIssues || '').trim(),
    confusingOrTooMuch: String(feedback.confusingOrTooMuch || '').trim(),
    email: String(feedback.email || '').trim(),
    firstScreen: String(feedback.firstScreen || '').trim(),
    installedAndOpened: String(feedback.installedAndOpened || '').trim(),
    mostUsefulFeature: String(feedback.mostUsefulFeature || '').trim(),
    name: String(feedback.name || '').trim(),
    nextPriority: String(feedback.nextPriority || '').trim(),
    oneChildEnough: String(feedback.oneChildEnough || '').trim(),
    submissionType: 'beta-feedback',
    submittedAt: new Date().toISOString(),
    todayHelped: String(feedback.todayHelped || '').trim(),
    understoodPurpose: String(feedback.understoodPurpose || '').trim(),
    useAgainTomorrow: String(feedback.useAgainTomorrow || '').trim(),
    worthPayingFor: String(feedback.worthPayingFor || '').trim()
  };
}

function isValidFeedback(feedback) {
  return Boolean(
    feedback.name &&
      feedback.email &&
      feedback.email.includes('@') &&
      feedback.installedAndOpened &&
      feedback.todayHelped &&
      feedback.mostUsefulFeature &&
      feedback.oneChildEnough &&
      feedback.nextPriority &&
      feedback.useAgainTomorrow
  );
}

async function forwardToWebhook(feedback) {
  const webhookUrl = process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;

  if (!webhookUrl) {
    return { configured: false };
  }

  const response = await fetch(webhookUrl, {
    body: JSON.stringify(feedback),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

  let body = {};

  try {
    body = await response.json();
  } catch {
    body = {};
  }

  return { body, configured: true, ok: response.ok };
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST beta feedback submissions are supported.' });
  }

  const feedback = normalizeFeedback(req.body);

  if (!isValidFeedback(feedback)) {
    return res.status(400).json({
      error: 'Please complete the required beta feedback questions before submitting.'
    });
  }

  try {
    const delivery = await forwardToWebhook(feedback);

    if (!delivery.configured) {
      return res.status(503).json({ error: 'Beta feedback collection is not configured yet.' });
    }

    if (!delivery.ok) {
      return res.status(502).json({ error: 'Beta feedback collection destination rejected the request.' });
    }

    if (!delivery.body || delivery.body.ok !== true) {
      return res
        .status(502)
        .json({ error: 'Beta feedback collection destination did not confirm the sheet write.' });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'Beta feedback collection destination is unavailable.' });
  }
};
```

- [ ] **Step 4: Run the endpoint test**

Run:

```bash
PATH="/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm test -- BetaFeedbackEndpoint.test.ts
```

Expected: PASS.

### Task 2: Add Beta Feedback Page And Browser Handler

**Files:**
- Create: `landing/beta-feedback/index.html`
- Modify: `landing/waitlist.js`
- Modify: `landing/styles.css`
- Modify: `__tests__/LandingPage.test.ts`

- [ ] **Step 1: Add landing page tests**

Modify `__tests__/LandingPage.test.ts`:

```ts
const betaFeedbackHtmlPath = join(landingDir, 'beta-feedback', 'index.html');
```

Add this test inside the existing `describe` block:

```ts
  it('includes a separate beta feedback survey page with private APK handling', () => {
    expect(existsSync(betaFeedbackHtmlPath)).toBe(true);

    const feedbackHtml = readFileSync(betaFeedbackHtmlPath, 'utf8');
    const script = readFileSync(scriptPath, 'utf8');

    expect(feedbackHtml).toContain('RemoteMom beta feedback');
    expect(feedbackHtml).toContain('data-beta-feedback-form');
    expect(feedbackHtml).toContain('data-endpoint="/api/beta-feedback"');
    expect(feedbackHtml).toContain('name="installedAndOpened"');
    expect(feedbackHtml).toContain('name="todayHelped"');
    expect(feedbackHtml).toContain('name="mostUsefulFeature"');
    expect(feedbackHtml).toContain('name="oneChildEnough"');
    expect(feedbackHtml).toContain('name="nextPriority"');
    expect(feedbackHtml).toContain('name="useAgainTomorrow"');
    expect(feedbackHtml).toContain('Do not enter private medicine details.');
    expect(feedbackHtml).not.toContain('RemoteMom-0.1.0-beta.apk');
    expect(feedbackHtml).not.toContain('expo.dev/artifacts');
    expect(script).toContain('remotemom:beta-feedback');
    expect(script).toContain('data-beta-feedback-form');
    expect(script).toContain('/api/beta-feedback');
  });
```

- [ ] **Step 2: Run the landing page test and verify it fails**

Run:

```bash
PATH="/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm test -- LandingPage.test.ts
```

Expected: FAIL because the page and handler are not implemented yet.

- [ ] **Step 3: Create the feedback page**

Create `landing/beta-feedback/index.html` with a form-first page. Use `../styles.css` and `../waitlist.js`. The form must include `data-beta-feedback-form` and `data-endpoint="/api/beta-feedback"`.

Use these field names:

```text
name
email
installedAndOpened
understoodPurpose
firstScreen
todayHelped
mostUsefulFeature
confusingOrTooMuch
oneChildEnough
nextPriority
useAgainTomorrow
worthPayingFor
bugsOrIssues
```

Required fields in the HTML: `name`, `email`, `installedAndOpened`, `todayHelped`, `mostUsefulFeature`, `oneChildEnough`, `nextPriority`, `useAgainTomorrow`.

Include these exact visible phrases:

```text
RemoteMom beta feedback
Tell me what happened after you tested RemoteMom.
Do not enter private medicine details.
Feedback may be saved in Vanessa's Google Sheet.
RemoteMom organizes routines only and does not provide medical advice.
```

- [ ] **Step 4: Extend browser JavaScript**

In `landing/waitlist.js`, add:

```js
  const betaFeedbackStorageKey = 'remotemom:beta-feedback';
  const betaFeedbackForm = document.querySelector('[data-beta-feedback-form]');
```

Then add a submit handler after the validation form handler. It should collect the field names listed in Step 3, post JSON to `betaFeedbackForm.dataset.endpoint || '/api/beta-feedback'`, reset on success, show:

```text
Feedback sent. Thank you for helping shape RemoteMom.
```

On failure, call `saveLocalBackup(betaFeedbackStorageKey, feedback)` and show:

```text
Could not reach the feedback endpoint. Saved as a backup on this device.
```

- [ ] **Step 5: Add small page styles**

Append small additive styles to `landing/styles.css` for:

```css
.feedback-form
.textarea-field textarea
.form-grid
```

The styles should reuse existing inputs/buttons, keep mobile layout single-column, and avoid changing the existing `/` or `/beta/` pages.

- [ ] **Step 6: Run the landing page test**

Run:

```bash
PATH="/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm test -- LandingPage.test.ts
```

Expected: PASS.

### Task 3: Update Apps Script Routing

**Files:**
- Modify: `integrations/google-apps-script/validation-webhook.gs`
- Modify: `__tests__/ValidationGoogleAppsScript.test.ts`

- [ ] **Step 1: Update the Apps Script test**

Add expectations to `__tests__/ValidationGoogleAppsScript.test.ts`:

```ts
    expect(script).toContain("BETA_FEEDBACK_SHEET_NAME = 'Beta Feedback'");
    expect(script).toContain("payload.submissionType === 'beta-feedback'");
    expect(script).toContain('appendBetaFeedback');
    expect(script).toContain('ensureBetaFeedbackSheet');
    expect(script).toContain('installedAndOpened');
    expect(script).toContain('todayHelped');
    expect(script).toContain('oneChildEnough');
    expect(script).toContain('nextPriority');
```

- [ ] **Step 2: Run the Apps Script test and verify it fails**

Run:

```bash
PATH="/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm test -- ValidationGoogleAppsScript.test.ts
```

Expected: FAIL because beta feedback routing does not exist yet.

- [ ] **Step 3: Add Apps Script beta feedback routing**

In `integrations/google-apps-script/validation-webhook.gs`:

Add:

```js
const BETA_FEEDBACK_SHEET_NAME = 'Beta Feedback';
```

In `doPost`, before waitlist routing:

```js
  if (payload.submissionType === 'beta-feedback') {
    return appendBetaFeedback(spreadsheet, payload);
  }
```

Add `appendBetaFeedback(spreadsheet, payload)` that appends the columns from the design spec and source `beta-feedback-form`.

Add `ensureBetaFeedbackSheet(spreadsheet)` with the Beta Feedback headers.

- [ ] **Step 4: Run the Apps Script test**

Run:

```bash
PATH="/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm test -- ValidationGoogleAppsScript.test.ts
```

Expected: PASS.

### Task 4: Update Documentation And Checklist

**Files:**
- Modify: `docs/RemoteMom_Project_Checklist.md`
- Modify: `docs/RemoteMom_Product_Brief_Roadmap.md`
- Modify: `docs/Validation_Collection_Setup.md`
- Update: live Google Sheet `Checklist`

- [ ] **Step 1: Update local checklist**

Add this row near other Phase 3 beta rows:

```markdown
| Phase 3: Public Beta Readiness | Beta feedback | Create separate beta feedback survey page | Completed | 2026-08-10 | Added a separate `/beta-feedback/` page and real collection endpoint so testers can submit structured feedback after trying the Android APK. |
```

- [ ] **Step 2: Update product roadmap**

In `docs/RemoteMom_Product_Brief_Roadmap.md`, update the current status paragraph and implementation order to mention the separate `/beta-feedback/` page and endpoint.

- [ ] **Step 3: Update collection setup docs**

In `docs/Validation_Collection_Setup.md`, add that:

- `/api/beta-feedback` collects tester feedback.
- Apps Script routes `submissionType: "beta-feedback"` to the `Beta Feedback` tab.
- Feedback form fallback storage is `remotemom:beta-feedback`.
- Testers should avoid entering private medicine details.

- [ ] **Step 4: Update live Google Sheet checklist**

Insert the same checklist row into the live `Checklist` tab:

```text
Phase 3: Public Beta Readiness | Beta feedback | Create separate beta feedback survey page | Completed | 2026-08-10 | Added a separate /beta-feedback/ page and real collection endpoint so testers can submit structured feedback after trying the Android APK.
```

### Task 5: Final Verification And Commit

**Files:**
- All changed files

- [ ] **Step 1: Run targeted tests**

Run:

```bash
PATH="/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm test -- LandingPage.test.ts BetaFeedbackEndpoint.test.ts ValidationGoogleAppsScript.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run TypeScript check**

Run:

```bash
PATH="/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/vaneVanessa_KidNationssa_kidnation/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm exec tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Run static diff check**

Run:

```bash
git diff --check
```

Expected: no output and exit code 0.

- [ ] **Step 4: Verify no public APK exposure**

Run:

```bash
rg -n "RemoteMom-0\\.1\\.0-beta\\.apk|expo\\.dev/artifacts|href=\\\".*apk|download the APK" landing api docs/RemoteMom_Project_Checklist.md docs/RemoteMom_Product_Brief_Roadmap.md docs/Validation_Collection_Setup.md
```

Expected: no matches.

- [ ] **Step 5: Verify expected page and endpoint phrases**

Run:

```bash
rg -n "RemoteMom beta feedback|/api/beta-feedback|remotemom:beta-feedback|Beta Feedback|submissionType: 'beta-feedback'|submissionType\":\"beta-feedback" landing api integrations docs __tests__
```

Expected: matches in the page, endpoint, Apps Script, docs, and tests.

- [ ] **Step 6: Commit and push**

Run:

```bash
git add api/beta-feedback.js __tests__/BetaFeedbackEndpoint.test.ts __tests__/LandingPage.test.ts __tests__/ValidationGoogleAppsScript.test.ts landing/beta-feedback/index.html landing/waitlist.js landing/styles.css integrations/google-apps-script/validation-webhook.gs docs/RemoteMom_Project_Checklist.md docs/RemoteMom_Product_Brief_Roadmap.md docs/Validation_Collection_Setup.md
git commit -m "Add beta feedback survey page"
git push origin main
```

Expected: changes are pushed to `main`.

## Self-Review

- Spec coverage: Tasks cover page, endpoint, browser fallback, Apps Script tab routing, tests, docs, checklist, Google Sheet sync, and privacy/medicine safety copy.
- Completion scan: No unfinished markers remain.
- Scope check: The plan does not include Firebase, accounts, public APK download, payments, analytics, or app functionality changes.
