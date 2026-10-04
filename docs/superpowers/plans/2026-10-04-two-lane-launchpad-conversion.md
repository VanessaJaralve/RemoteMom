# Two-Lane Launchpad Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the existing global Launchpad so mothers seeking remote work and mothers already working remotely can recognize themselves, submit a measurable stage selection, and receive one balanced Starter Kit through the existing reliable funnel.

**Architecture:** Keep the current static Launchpad pages, shared browser submission script, Vercel endpoint, Google Apps Script webhook, Google Sheet destination, and direct PDF download. Add one bounded `currentStage` value across the form and collection pipeline, preserve historical payload compatibility in Apps Script, and update the page and generated PDF to serve the two approved audience lanes without adding email automation or mobile-app features.

**Tech Stack:** Static HTML/CSS/JavaScript, Vercel Node endpoint, Google Apps Script, Jest, Python/ReportLab, Poppler PDF rendering, existing Google Sheets collection pipeline.

---

## File Map

- Modify `__tests__/LaunchpadLeadEndpoint.test.ts`: endpoint validation and normalized payload coverage.
- Modify `__tests__/LandingPage.test.ts`: two-lane page, form, download, script, and PDF artifact assertions.
- Modify `__tests__/ValidationGoogleAppsScript.test.ts`: sheet header and backward-compatible stage routing assertions.
- Modify `landing/launchpad/index.html`: two-lane positioning, stage recognition, benefits, trust copy, and required stage field.
- Modify `landing/launchpad/styles.css`: responsive stage cards and two-lane content presentation.
- Modify `landing/launchpad/download/index.html`: first-step guidance, social links, and secondary beta invitation.
- Modify `landing/waitlist.js`: collect and validate `currentStage` while retaining local backup and confirmed redirect behavior.
- Modify `api/launchpad-lead.js`: allowlist and validate the four stage values.
- Modify `integrations/google-apps-script/validation-webhook.gs`: append the stage column while accepting older payloads without it.
- Modify `scripts/build-launchpad-starter-kit.py`: add the Remote-Life path and shared choose-your-path action plan.
- Regenerate `output/pdf/remote-moms-work-fit-safety-starter-kit.pdf`: canonical generated PDF.
- Regenerate `landing/launchpad/download/remote-moms-work-fit-safety-starter-kit.pdf`: public download copy.
- Modify `docs/Validation_Collection_Setup.md`: payload and Google Sheet schema.
- Modify `docs/RemoteMom_Project_Checklist.md`: completed implementation and verification history.
- Modify `docs/RemoteMom_Product_Brief_Roadmap.md`: reconcile Phase 4 status and active Launchpad validation focus.

### Task 1: Define Two-Lane Funnel Behavior With Failing Tests

**Files:**
- Modify: `__tests__/LaunchpadLeadEndpoint.test.ts`
- Modify: `__tests__/LandingPage.test.ts`
- Modify: `__tests__/ValidationGoogleAppsScript.test.ts`

- [ ] **Step 1: Add current-stage endpoint fixtures and validation assertions**

Add `currentStage` to `validBody`:

```ts
const validBody = {
  email: 'maria@example.com',
  biggestChallenge: 'finding-legitimate-opportunities',
  currentStage: 'looking-for-remote-work',
  name: 'Maria',
  utmCampaign: 'starter-kit-launch',
  utmMedium: 'organic-social',
  utmSource: 'instagram'
};
```

Extend the invalid-submission test with:

```ts
const invalidStageResponse = createResponse();

await handler(
  { method: 'POST', body: { ...validBody, currentStage: 'not-approved' } },
  invalidStageResponse
);

expect(invalidStageResponse.statusCode).toBe(400);
```

In the forwarding test, assert the normalized webhook body contains:

```ts
expect(global.fetch).toHaveBeenCalledWith(
  'https://example.com/remotemom-webhook',
  expect.objectContaining({
    body: expect.stringContaining('"currentStage":"looking-for-remote-work"')
  })
);
```

- [ ] **Step 2: Add landing, submission-script, and download-page assertions**

Add assertions in the existing Launchpad funnel test:

```ts
expect(launchpadHtml).toContain('name="currentStage"');
expect(launchpadHtml).toContain('value="looking-for-remote-work"');
expect(launchpadHtml).toContain('value="returning-after-career-break"');
expect(launchpadHtml).toContain('value="already-working-remotely"');
expect(launchpadHtml).toContain('value="exploring-both"');
expect(launchpadHtml).toContain('Already working remotely');
expect(launchpadHtml).toContain('Improve work-from-home boundaries and routines');
expect(script).toContain("formData.get('currentStage')");
expect(downloadHtml).toContain('Start with the path that matches your current stage');
expect(downloadHtml).toContain('https://www.facebook.com/VanJaralve');
expect(downloadHtml).toContain('https://www.instagram.com/vdjaralve/');
```

- [ ] **Step 3: Add Apps Script schema assertions**

Extend the Apps Script test with:

```ts
expect(script).toContain("'Current Stage'");
expect(script).toContain("payload.currentStage || ''");
```

This explicitly tests backward compatibility: missing `currentStage` becomes an empty cell instead of rejecting historical payloads.

- [ ] **Step 4: Run focused tests and confirm the new assertions fail**

Run:

```bash
pnpm test -- --runInBand \
  __tests__/LaunchpadLeadEndpoint.test.ts \
  __tests__/LandingPage.test.ts \
  __tests__/ValidationGoogleAppsScript.test.ts
```

Expected: FAIL because `currentStage`, the two-lane page copy, social links, and Sheet column are not implemented yet.

- [ ] **Step 5: Commit the failing tests**

```bash
git add __tests__/LaunchpadLeadEndpoint.test.ts __tests__/LandingPage.test.ts __tests__/ValidationGoogleAppsScript.test.ts
git commit -m "test: define two-lane launchpad conversion behavior"
```

### Task 2: Implement Stage Collection And Endpoint Validation

**Files:**
- Modify: `landing/launchpad/index.html`
- Modify: `landing/waitlist.js`
- Modify: `api/launchpad-lead.js`
- Test: `__tests__/LaunchpadLeadEndpoint.test.ts`
- Test: `__tests__/LandingPage.test.ts`

- [ ] **Step 1: Add the required current-stage field to the form**

Insert this field before `biggestChallenge`:

```html
<fieldset class="stage-field">
  <legend>Which best describes you right now?</legend>
  <label class="stage-option">
    <input type="radio" name="currentStage" value="looking-for-remote-work" required />
    <span>I'm looking for remote work</span>
  </label>
  <label class="stage-option">
    <input type="radio" name="currentStage" value="returning-after-career-break" required />
    <span>I'm returning after a career break</span>
  </label>
  <label class="stage-option">
    <input type="radio" name="currentStage" value="already-working-remotely" required />
    <span>I'm already working remotely</span>
  </label>
  <label class="stage-option">
    <input type="radio" name="currentStage" value="exploring-both" required />
    <span>I'm exploring what would work for my family</span>
  </label>
</fieldset>
```

Update the privacy note so it accurately lists name, email, current stage, selected challenge, and campaign source.

- [ ] **Step 2: Include and validate currentStage in the browser submission payload**

Add this property to `lead` in `landing/waitlist.js`:

```js
currentStage: String(formData.get('currentStage') ?? '').trim(),
```

Replace the incomplete-form guard with:

```js
if (!lead.name || !lead.email || !lead.currentStage || !lead.biggestChallenge) {
  if (status) {
    status.textContent = 'Please add your name, email, current stage, and biggest challenge.';
  }

  return;
}
```

Do not change the existing confirmed redirect, bounded UTM values, or local-backup behavior.

- [ ] **Step 3: Add the endpoint stage allowlist and normalized field**

In `api/launchpad-lead.js`, add:

```js
const allowedCurrentStages = [
  'looking-for-remote-work',
  'returning-after-career-break',
  'already-working-remotely',
  'exploring-both'
];
```

Add to `normalizeLead`:

```js
currentStage: String(lead.currentStage || '').trim(),
```

Extend `isValidLead`:

```js
allowedCurrentStages.includes(lead.currentStage) &&
```

Export the allowlist for direct inspection if future tests need it:

```js
module.exports.allowedCurrentStages = allowedCurrentStages;
```

- [ ] **Step 4: Run the endpoint and landing tests**

```bash
pnpm test -- --runInBand __tests__/LaunchpadLeadEndpoint.test.ts __tests__/LandingPage.test.ts
```

Expected: endpoint stage assertions PASS; page-copy and download-link assertions may remain failing until Task 4.

- [ ] **Step 5: Commit the collection changes**

```bash
git add landing/launchpad/index.html landing/waitlist.js api/launchpad-lead.js
git commit -m "feat: segment launchpad leads by current stage"
```

### Task 3: Preserve Stage Data In Google Sheets

**Files:**
- Modify: `integrations/google-apps-script/validation-webhook.gs`
- Test: `__tests__/ValidationGoogleAppsScript.test.ts`

- [ ] **Step 1: Add Current Stage to appended Launchpad rows**

Insert the stage after the email field:

```js
sheet.appendRow([
  new Date(),
  payload.submittedAt || '',
  payload.name || '',
  payload.email || '',
  payload.currentStage || '',
  payload.biggestChallenge || '',
  payload.utmSource || '',
  payload.utmMedium || '',
  payload.utmCampaign || '',
  'launchpad-starter-kit-form',
  JSON.stringify(payload)
]);
```

- [ ] **Step 2: Update the expected Launchpad Leads headers**

Use this exact ordered schema:

```js
const headers = [
  'Received At',
  'Submitted At',
  'Name',
  'Email',
  'Current Stage',
  'Biggest Challenge',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'Source',
  'Raw Payload'
];
```

The `payload.currentStage || ''` fallback is required so historical payloads remain accepted.

- [ ] **Step 3: Run the Apps Script test**

```bash
pnpm test -- --runInBand __tests__/ValidationGoogleAppsScript.test.ts
```

Expected: PASS.

- [ ] **Step 4: Commit the Sheet routing change**

```bash
git add integrations/google-apps-script/validation-webhook.gs
git commit -m "feat: store launchpad audience stage"
```

### Task 4: Polish The Two-Lane Landing And Download Experience

**Files:**
- Modify: `landing/launchpad/index.html`
- Modify: `landing/launchpad/styles.css`
- Modify: `landing/launchpad/download/index.html`
- Test: `__tests__/LandingPage.test.ts`

- [ ] **Step 1: Replace the hero message with the shared promise**

Use:

```html
<h1 id="launchpad-title">Build a remote-work path that fits your career and your family life.</h1>
<p class="hero-subtitle">
  Whether you're looking for remote work or already working from home, use a practical starter kit to make your next step more focused and sustainable.
</p>
```

Keep one hero CTA: `Get the free starter kit`. Do not add the mobile app to the hero.

- [ ] **Step 2: Add the four-stage recognition section**

Add an accessible section before the benefits grid:

```html
<section class="stage-section" aria-labelledby="stage-title">
  <p class="eyebrow">Start where you are</p>
  <h2 id="stage-title">Which stage sounds most like you?</h2>
  <div class="stage-grid">
    <article><h3>Looking for remote work</h3><p>Choose a realistic direction and focus your search.</p></article>
    <article><h3>Returning after a career break</h3><p>Translate your experience and rebuild momentum one step at a time.</p></article>
    <article><h3>Already working remotely</h3><p>Improve work-from-home boundaries and routines.</p></article>
    <article><h3>Exploring what fits</h3><p>Compare career needs with the realities of family life.</p></article>
  </div>
</section>
```

- [ ] **Step 3: Rebalance the benefits and trust copy**

Retain role fit and opportunity verification, and add explicit benefits for boundaries, routines, and sustainable work-family planning. State that the resource is educational, makes no employment or income guarantee, and cannot certify that an opportunity is legitimate or safe.

Do not claim automated email delivery. Describe the current direct-download behavior accurately.

- [ ] **Step 4: Update the download page**

Use this first-step guidance:

```html
<p>Start with the path that matches your current stage. You do not need to complete every worksheet at once.</p>
```

Add existing-account links:

```html
<nav class="social-links" aria-label="Follow Vanessa">
  <a href="https://www.facebook.com/VanJaralve">Follow on Facebook</a>
  <a href="https://www.instagram.com/vdjaralve/">Follow on Instagram</a>
</nav>
```

Keep `/beta/` in the secondary `Already working remotely?` panel.

- [ ] **Step 5: Add responsive styles**

Add styles following the existing card system:

```css
.stage-section {
  margin: 0 auto;
  max-width: 1240px;
  padding: clamp(72px, 10vw, 132px) clamp(18px, 5vw, 72px);
}

.stage-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.stage-grid article,
.stage-option {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  padding: 22px;
}

.stage-field {
  border: 0;
  margin: 0 0 20px;
  padding: 0;
}

.stage-field legend {
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 10px;
}

.stage-option {
  align-items: flex-start;
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.stage-option input {
  flex: 0 0 auto;
  margin-top: 3px;
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin-top: 24px;
}

@media (max-width: 720px) {
  .stage-grid {
    grid-template-columns: 1fr;
  }
}
```

Adjust selectors as needed to avoid the existing `.field input { width: 100% }` rule affecting radio controls.

- [ ] **Step 6: Run the landing-page test**

```bash
pnpm test -- --runInBand __tests__/LandingPage.test.ts
```

Expected: PASS after all specified copy, fields, links, and download references exist.

- [ ] **Step 7: Commit the page polish**

```bash
git add landing/launchpad/index.html landing/launchpad/styles.css landing/launchpad/download/index.html
git commit -m "feat: polish launchpad for two audience lanes"
```

### Task 5: Balance And Regenerate The Starter Kit

**Files:**
- Modify: `scripts/build-launchpad-starter-kit.py`
- Regenerate: `output/pdf/remote-moms-work-fit-safety-starter-kit.pdf`
- Regenerate: `landing/launchpad/download/remote-moms-work-fit-safety-starter-kit.pdf`
- Test: `__tests__/LandingPage.test.ts`

- [ ] **Step 1: Update the opening instructions with choose-your-path guidance**

Add language that clearly labels:

```python
p("Choose the path that matches your current stage", "SectionTitle"),
p(
    "Use the Career Path if you are looking for remote work or returning after a career break. "
    "Use the Remote-Life Path if you already work remotely and want calmer boundaries and routines. "
    "Complete only the worksheets that support your next step.",
    "SectionIntro",
),
```

- [ ] **Step 2: Add a Remote-Life worksheet section**

Add a dedicated section using the existing worksheet helpers:

```python
p("Remote-Life Path: make remote work sustainable", "SectionTitle"),
p(
    "Review where work and family responsibilities compete for the same time or attention.",
    "SectionIntro",
),
worksheet_table(
    ["Pressure point", "What happens now", "Small boundary or routine to test"],
    [
        ["Starting the workday", "", ""],
        ["Family interruptions", "", ""],
        ["Meals and groceries", "", ""],
        ["Child schedule transitions", "", ""],
        ["Ending the workday", "", ""],
    ],
    [43 * mm, 60 * mm, 67 * mm],
    [12 * mm] + [20 * mm] * 5,
),
```

Add a non-judgmental daily-planning prompt that asks what needs attention, what can wait, and what boundary will be tested. Do not add clinical, childcare, employment, or income advice.

- [ ] **Step 3: Reframe the seven-day plan as a shared plan**

Retain career-search actions for Career Path readers and add selectable Remote-Life alternatives for current remote workers. Each day should require one small action, not both paths.

- [ ] **Step 4: Generate both PDF copies**

Run:

```bash
python3 scripts/build-launchpad-starter-kit.py
```

Expected: the script prints the canonical output path and the landing download copy path without error.

- [ ] **Step 5: Inspect PDF structure and rendered pages**

Run:

```bash
pdfinfo output/pdf/remote-moms-work-fit-safety-starter-kit.pdf
pdftotext output/pdf/remote-moms-work-fit-safety-starter-kit.pdf - | rg "Career Path|Remote-Life Path|seven-day"
LAUNCHPAD_RENDER_DIR="$(mktemp -d /tmp/remotemom-launchpad-render.XXXXXX)"
pdftoppm -png -r 120 output/pdf/remote-moms-work-fit-safety-starter-kit.pdf "$LAUNCHPAD_RENDER_DIR/page"
find "$LAUNCHPAD_RENDER_DIR" -maxdepth 1 -type f -name 'page-*.png' -print
```

Expected: PDF metadata is readable, all three path labels are extractable, and each page renders to a PNG. Visually inspect every rendered page for clipping, overlap, unreadable tables, broken links, and blank pages.

- [ ] **Step 6: Confirm canonical and public PDFs match**

```bash
shasum -a 256 \
  output/pdf/remote-moms-work-fit-safety-starter-kit.pdf \
  landing/launchpad/download/remote-moms-work-fit-safety-starter-kit.pdf
```

Expected: identical hashes.

- [ ] **Step 7: Commit the generated kit**

```bash
git add scripts/build-launchpad-starter-kit.py output/pdf/remote-moms-work-fit-safety-starter-kit.pdf landing/launchpad/download/remote-moms-work-fit-safety-starter-kit.pdf
git commit -m "feat: balance launchpad starter kit for two paths"
```

### Task 6: Document, Verify, And Prepare Deployment Handoff

**Files:**
- Modify: `docs/Validation_Collection_Setup.md`
- Modify: `docs/RemoteMom_Project_Checklist.md`
- Modify: `docs/RemoteMom_Product_Brief_Roadmap.md`

- [ ] **Step 1: Update the collection contract**

Update the Launchpad example in `docs/Validation_Collection_Setup.md` to include:

```json
{
  "submissionType": "launchpad-lead",
  "name": "Vanessa",
  "email": "vanessa@example.com",
  "currentStage": "already-working-remotely",
  "biggestChallenge": "family-compatible-schedule",
  "utmSource": "instagram",
  "utmMedium": "social",
  "utmCampaign": "launchpad-validation",
  "submittedAt": "2026-10-04T00:00:00.000Z"
}
```

Document the four accepted stage values, the `Current Stage` Sheet column, the empty-cell behavior for historical payloads, and the unchanged direct-download behavior.

- [ ] **Step 2: Update the existing project status documents**

Add one completed Phase 4 checklist row describing the two-lane Launchpad conversion polish, stage segmentation, balanced Starter Kit, tests, and verification date.

Update the product brief so Phase 4 reflects work already completed and names the 30-day two-lane Launchpad content validation cycle as the active focus. Keep mobile-app beta recruitment as a parallel waiting-for-testers activity, not the active development priority.

- [ ] **Step 3: Run focused and full automated checks**

```bash
pnpm test -- --runInBand \
  __tests__/LaunchpadLeadEndpoint.test.ts \
  __tests__/LandingPage.test.ts \
  __tests__/ValidationGoogleAppsScript.test.ts
pnpm test -- --runInBand
pnpm exec tsc --noEmit
```

Expected: all focused tests, the full Jest suite, and TypeScript checking PASS. If an unrelated existing failure occurs, capture the exact command and failure without changing unrelated files.

- [ ] **Step 4: Perform responsive and accessibility inspection**

Serve the landing directory with an available local static server. Inspect `/launchpad/` and `/launchpad/download/` at approximately 390px, 768px, and 1440px widths. Verify:

- Hero and stage cards remain readable without horizontal scrolling.
- All radio options and the submit button are keyboard reachable.
- Labels announce the current-stage group and all inputs.
- Focus indicators remain visible.
- Form failure copy does not claim remote storage.
- A successful mocked or configured submission redirects only after confirmation.
- The PDF link downloads the regenerated public file.
- Social links and the secondary beta link open the intended destinations.

- [ ] **Step 5: Verify the deployed Google Apps Script before public traffic**

Replace the deployed Apps Script source with the updated repository version, deploy a new web-app version, and submit one privacy-safe test lead with `currentStage: "already-working-remotely"`. Confirm the `Launchpad Leads` row contains the new stage column and UTM values. Delete only the clearly identified synthetic test row after verification if cleanup is desired.

- [ ] **Step 6: Commit documentation and final verification record**

```bash
git add docs/Validation_Collection_Setup.md docs/RemoteMom_Project_Checklist.md docs/RemoteMom_Product_Brief_Roadmap.md
git commit -m "docs: record two-lane launchpad conversion rollout"
```

- [ ] **Step 7: Final scope audit**

Confirm the implementation did not add separate audience landing pages, new social accounts, job listings, coaching, email automation, payments, cloud storage, or new RemoteMoms app features. Confirm existing leads remain readable and no sensitive family or medicine data is collected.
