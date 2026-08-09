# RemoteMom Beta Recruitment Page Design

## Goal

Create a separate Vercel-served beta recruitment page at `/beta/` while preserving the existing landing page at `/` for the broader waitlist and validation survey.

The beta page should help Vanessa invite a small group of trusted Android testers to try the current RemoteMom APK and provide focused feedback before broader launch decisions.

## Product Fit

The page must support RemoteMom's core promise:

> Manage the day without carrying it all in your head.

The page should frame RemoteMom as a calm daily command center for remote working moms managing work, home, one child's schedule, groceries, and medicine routines.

The page must keep the MVP boundary clear:

- The current app is Android beta testing only.
- The current MVP supports one child in the UI.
- App data is local-first and not cloud-backed up.
- RemoteMom organizes medicine routines only and does not provide medical advice.
- Multiple children, sharing, reminders, cloud backup, calendar sync, and paid tiers are future validation areas, not current beta promises.

## Page Structure

The new page should live at:

```text
landing/beta/index.html
```

The deployed URL should be:

```text
https://remote-mom.vercel.app/beta/
```

It should reuse the existing landing page visual system, screenshot asset, and waitlist JavaScript where practical.

Recommended sections:

1. Hero
   - Headline: `Help test RemoteMom for Android`
   - Support copy explaining the Today-first mental-load promise.
   - Primary CTA to the beta interest form.
   - App screenshot preview using the existing RemoteMom dashboard mockup.

2. What Testers Will Try
   - Today Dashboard
   - To-Dos
   - Grocery List
   - One-child Schedule
   - Medicine Tracker

3. Beta Expectations
   - 10 to 15 minute test.
   - Android APK install outside Google Play.
   - Local data only.
   - One-child MVP.
   - Feedback can be sent through the app or directly to Vanessa.

4. What We Are Validating
   - Whether the Today Dashboard is understandable and useful.
   - Whether one-child support is enough for early use.
   - Whether multiple children, partner/caregiver sharing, or reminders matter most next.
   - Whether the app feels worth using again tomorrow.

5. Privacy And Medicine Safety
   - Entries stay local in the beta app.
   - Waitlist and beta interest submissions may be saved in Vanessa's Google Sheet.
   - RemoteMom does not calculate dosage, recommend dosage, diagnose, or replace medical advice.

6. Beta Interest Form
   - Reuse the existing `/api/waitlist` endpoint.
   - Collect `name` and `email`.
   - Use visitor-facing status copy that says the user is on the RemoteMom beta interest list.

## Navigation

The existing `/` page should remain unchanged in purpose and continue to support:

- public waitlist
- validation survey
- pricing and premium-interest questions

The new `/beta/` page can link back to `/` for people who want the broader survey, but it should not replace the existing page.

## Technical Approach

- Add a new static HTML file under `landing/beta/index.html`.
- Reuse `landing/styles.css` with small additive classes if needed.
- Reuse `landing/waitlist.js`; because `/beta/` is nested one level deeper, reference it as `../waitlist.js`.
- Reference the existing screenshot as `../remotemom-dashboard-mockup.png`.
- Keep forms posting to `/api/waitlist`.
- Avoid changing the current validation form or backend endpoints.

## Acceptance Criteria

- `/` remains the existing survey and waitlist landing page.
- `/beta/` exists as a separate beta tester recruitment page.
- The beta page clearly explains Android APK beta expectations.
- The beta page highlights current MVP features without promising future premium features as already available.
- The beta page includes one-child MVP, local-first, and medicine-safety language.
- The beta page includes a form connected to the existing waitlist pipeline.
- The page remains mobile-first and easy to scan.

## Out Of Scope

- No Firebase.
- No app-store distribution.
- No public APK download link.
- No payments or premium gates.
- No new Google Sheet tab unless separately approved.
- No app functionality changes.
