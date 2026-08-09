# Beta Recruitment Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a separate `/beta/` Vercel page that recruits trusted Android testers while preserving the existing `/` survey and waitlist page.

**Architecture:** Build one new static HTML page under `landing/beta/index.html`, reuse the existing landing CSS and waitlist submission JavaScript, and add only small additive CSS classes if the beta page needs page-specific layout. Keep `/api/waitlist` as the beta interest collection endpoint and do not expose a public APK link.

**Tech Stack:** Static HTML, shared CSS in `landing/styles.css`, existing browser JavaScript in `landing/waitlist.js`, Vercel static hosting and existing API endpoints.

---

### Task 1: Add Beta Recruitment Page

**Files:**
- Create: `landing/beta/index.html`
- Modify: none
- Test: manual browser preview

- [ ] **Step 1: Create the beta page folder and file**

Create `landing/beta/index.html` with this structure:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="Help test RemoteMom for Android, a calm daily command center for remote working moms managing work, home, one child's schedule, groceries, and medicine routines."
    />
    <title>RemoteMom | Android Beta</title>
    <link rel="stylesheet" href="../styles.css" />
  </head>
  <body>
    <header class="site-header" aria-label="RemoteMom beta">
      <a class="brand" href="../" aria-label="RemoteMom home">RemoteMom</a>
      <nav class="nav" aria-label="Beta page sections">
        <a href="#features">Features</a>
        <a href="#expectations">Beta test</a>
        <a href="#feedback">Feedback</a>
        <a class="nav-cta" href="#join">Join beta list</a>
      </nav>
    </header>

    <main id="top">
      <section class="hero beta-hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">Android beta testers wanted</p>
          <h1 id="hero-title">Help test RemoteMom for Android</h1>
          <p class="hero-subtitle">
            A calm Today view for remote working moms managing work, home, one child's schedule,
            groceries, and medicine routines.
          </p>
          <div class="beta-actions">
            <a class="button-link" href="#join">Join the beta list</a>
            <a class="secondary-link" href="../#validation">Take the survey instead</a>
          </div>
        </div>

        <div class="hero-visual" aria-label="RemoteMom Today Dashboard preview">
          <img
            src="../remotemom-dashboard-mockup.png"
            alt="RemoteMom Today Dashboard mobile app preview"
          />
        </div>
      </section>

      <section class="proof-strip" aria-label="What beta testers will try">
        <div>
          <strong>Today</strong>
          <span>one calm daily view</span>
        </div>
        <div>
          <strong>Groceries</strong>
          <span>categories and checkoffs</span>
        </div>
        <div>
          <strong>Child</strong>
          <span>one-child MVP schedule</span>
        </div>
        <div>
          <strong>Health</strong>
          <span>medicine routine tracking</span>
        </div>
      </section>

      <section class="fit-section" id="features" aria-labelledby="features-title">
        <div class="section-copy">
          <h2 id="features-title">What you will test</h2>
          <p>
            The beta is focused on whether RemoteMom makes the day easier to scan, not on a
            finished app-store launch.
          </p>
        </div>
        <div class="fit-grid beta-feature-grid">
          <article>
            <span>01</span>
            <h3>Today Dashboard</h3>
            <p>See what needs attention today across tasks, groceries, schedule, and medicine.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Quick daily lists</h3>
            <p>Add to-dos and groceries, choose categories, and mark items complete.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Family routines</h3>
            <p>Try one child's schedule and Mom or Child medicine routine tracking.</p>
          </article>
        </div>
      </section>

      <section class="tier-section" id="expectations" aria-labelledby="expectations-title">
        <h2 id="expectations-title">What to expect from this beta</h2>
        <div class="tier-layout">
          <article>
            <h3>Private Android APK</h3>
            <p>
              If you are a fit, Vanessa will send the APK link privately. The APK is not posted
              publicly and is not from Google Play yet.
            </p>
          </article>
          <article>
            <h3>10 to 15 minute test</h3>
            <p>
              Try the main flows, close and reopen the app, then share what felt useful,
              confusing, or missing.
            </p>
          </article>
          <article>
            <h3>One-child MVP</h3>
            <p>
              The app supports one child for now. Your feedback will help decide whether multiple
              children, sharing, or reminders should come next.
            </p>
          </article>
        </div>
      </section>

      <section class="privacy-section" aria-labelledby="safety-title">
        <div class="section-copy">
          <h2 id="safety-title">A careful early test</h2>
          <p>
            RemoteMom is still local-first. It does not claim cloud backup, shared accounts, or
            app-store polish yet.
          </p>
        </div>
        <div class="privacy-grid">
          <article>
            <h3>Local app data</h3>
            <p>Your beta entries stay on your device for now and are not backed up to RemoteMom cloud storage.</p>
          </article>
          <article>
            <h3>Medicine safety</h3>
            <p>RemoteMom organizes medicine routines only. It does not calculate dosage, diagnose, or replace medical advice.</p>
          </article>
          <article>
            <h3>Feedback collection</h3>
            <p>Beta interest and feedback may be saved in Vanessa's Google Sheet so the product can improve.</p>
          </article>
        </div>
      </section>

      <section class="fit-section" id="feedback" aria-labelledby="feedback-title">
        <div class="section-copy">
          <h2 id="feedback-title">Feedback questions</h2>
          <p>After testing, these are the answers that will help most.</p>
        </div>
        <ol class="question-list">
          <li>What did you understand RemoteMom was for?</li>
          <li>Which screen did you want to open first?</li>
          <li>Did the Today view help you see what needed attention?</li>
          <li>Which feature felt most useful: Today, To-Dos, Grocery, Child Schedule, or Medicine?</li>
          <li>What felt confusing, too much, or unnecessary?</li>
          <li>Was one child enough for this test, or would you need multiple children before using it weekly?</li>
          <li>Which would matter more next: multiple children, sharing with a partner or caregiver, or reminders?</li>
          <li>Would you use this again tomorrow? Why or why not?</li>
          <li>What would make RemoteMom feel worth paying for later?</li>
        </ol>
      </section>

      <section class="waitlist-section" id="join" aria-labelledby="join-title">
        <div>
          <h2 id="join-title">Join the Android beta interest list.</h2>
          <p>
            If you are a fit for the early test, Vanessa will send the APK link and install
            instructions privately.
          </p>
        </div>
        <form
          class="waitlist-form"
          id="beta-waitlist-form"
          data-waitlist-form
          data-endpoint="/api/waitlist"
        >
          <div class="field">
            <label for="beta-name">Name</label>
            <input id="beta-name" name="name" autocomplete="name" required />
          </div>
          <div class="field">
            <label for="beta-email">Email</label>
            <input id="beta-email" name="email" type="email" autocomplete="email" required />
          </div>
          <button type="submit">Join beta list</button>
          <p class="form-note">
            The APK link is shared privately with trusted testers, not posted publicly.
          </p>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>
      </section>
    </main>

    <footer class="site-footer">
      <span>RemoteMom</span>
      <span><a href="../">View the main survey page</a></span>
    </footer>

    <script src="../waitlist.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Preview the page through a local server**

Run:

```bash
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/landing/beta/
```

Expected: The page loads, the screenshot displays, section links scroll, and no JavaScript console errors occur.

### Task 2: Add Beta Page Styling

**Files:**
- Modify: `landing/styles.css`
- Test: local browser preview at desktop and mobile widths

- [ ] **Step 1: Add small additive CSS classes**

Append these classes to `landing/styles.css`:

```css
.beta-hero h1 {
  font-size: clamp(44px, 7vw, 92px);
  max-width: 760px;
}

.beta-actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.button-link {
  align-items: center;
  background: var(--accent);
  border-radius: 999px;
  color: #ffffff;
  display: inline-flex;
  font-weight: 800;
  min-height: 48px;
  padding: 12px 18px;
}

.secondary-link {
  color: var(--accent-dark);
  font-size: 14px;
  font-weight: 800;
}

.beta-feature-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.question-list {
  color: var(--ink);
  display: grid;
  gap: 12px;
  line-height: 1.5;
  margin: 28px 0 0;
  max-width: 820px;
  padding-left: 24px;
}

.question-list li {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
}

@media (max-width: 760px) {
  .beta-feature-grid {
    grid-template-columns: 1fr;
  }

  .beta-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .button-link,
  .secondary-link {
    justify-content: center;
    text-align: center;
  }
}
```

- [ ] **Step 2: Verify the existing page still works visually**

Open:

```text
http://127.0.0.1:4173/landing/
```

Expected: The existing survey/waitlist page remains usable and visually unchanged except for harmless shared CSS additions that are unused on `/`.

### Task 3: Update Checklist And Product Docs

**Files:**
- Modify: `docs/RemoteMom_Project_Checklist.md`
- Modify: `docs/RemoteMom_Product_Brief_Roadmap.md`
- Update: Google Sheet `Checklist`

- [ ] **Step 1: Add a completed checklist row**

Add this row to `docs/RemoteMom_Project_Checklist.md` near the beta distribution or beta messaging rows:

```markdown
| Phase 3: Public Beta Readiness | Beta recruitment | Create separate Android beta recruitment page | Completed | 2026-08-09 | Added a separate `/beta/` Vercel page so Vanessa can recruit trusted Android testers while keeping the existing survey and waitlist page available at `/`. |
```

- [ ] **Step 2: Update the product roadmap status**

In `docs/RemoteMom_Product_Brief_Roadmap.md`, update the current status paragraph to mention that a separate Android beta recruitment page exists while the original survey page remains available.

- [ ] **Step 3: Add the same checklist row to Google Sheets**

Use the Google Sheets connector to insert the same row into the `Checklist` tab near the existing beta rows.

Expected: The row includes phase, module, activity, status, completed date, and notes.

### Task 4: Verify And Commit

**Files:**
- All files changed in Tasks 1-3

- [ ] **Step 1: Run static checks**

Run:

```bash
git diff --check
```

Expected: no output and exit code 0.

- [ ] **Step 2: Verify beta page content exists**

Run:

```bash
rg -n "Help test RemoteMom for Android|Join the Android beta interest list|Was one child enough|/api/waitlist" landing/beta/index.html
```

Expected: all four phrases are found.

- [ ] **Step 3: Verify the APK link is not public**

Run:

```bash
rg -n "RemoteMom-0.1.0-beta.apk|expo.dev/artifacts|download the APK" landing/beta landing/index.html
```

Expected: no public APK artifact or local APK filename appears in either page.

- [ ] **Step 4: Review git status**

Run:

```bash
git status --short
```

Expected: only the intended files are modified or created, plus any pre-existing unrelated untracked file such as `remotemom-expo-go-qr.png`.

- [ ] **Step 5: Commit and push**

Run:

```bash
git add landing/beta/index.html landing/styles.css docs/RemoteMom_Project_Checklist.md docs/RemoteMom_Product_Brief_Roadmap.md
git commit -m "Add Android beta recruitment page"
git push origin main
```

Expected: changes are pushed to `main`.

## Self-Review

- Spec coverage: The plan preserves `/`, adds `/beta/`, uses the existing waitlist endpoint, highlights MVP features, keeps the APK private, and includes one-child, local-first, and medicine-safety language.
- Completion scan: No unfinished markers remain.
- Scope check: The plan is limited to a static beta recruitment page, small CSS additions, docs, checklist, and verification. No app functionality, Firebase, payments, or APK distribution changes are included.
