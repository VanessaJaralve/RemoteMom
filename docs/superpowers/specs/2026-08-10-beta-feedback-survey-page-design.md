# RemoteMom Beta Feedback Survey Page Design

## Goal

Create a separate tester feedback survey page at `/beta-feedback/` so Vanessa can send one link to Android beta testers after they try the APK.

The page should collect structured feedback into the existing real collection pipeline while keeping tester feedback separate from waitlist signups and general MVP validation responses.

## Product Fit

The feedback page supports the current beta goal: learn whether RemoteMom helps remote working moms manage today with less mental effort.

The page should help answer:

- Did testers understand RemoteMom quickly?
- Did the Today Dashboard feel useful?
- Which current MVP feature helped most?
- What was confusing or unnecessary?
- Is one-child support enough for early use?
- Should future work prioritize multiple children, partner/caregiver sharing, or reminders?
- Is there any willingness to pay later?

## Page And URL

Create a new static page:

```text
landing/beta-feedback/index.html
```

Expected deployed URL:

```text
https://remote-mom.vercel.app/beta-feedback/
```

Existing pages must remain unchanged in purpose:

- `/` remains the general landing, waitlist, and validation survey page.
- `/beta/` remains the Android beta recruitment page.
- `/beta-feedback/` becomes the post-test feedback survey page.

## Survey Questions

The form should collect:

1. Name
2. Email
3. Were you able to install and open the app?
4. What did you understand RemoteMom was for?
5. Which screen did you open first?
6. Did the Today view help you see what needed attention?
7. Which feature felt most useful?
8. What felt confusing, too much, or unnecessary?
9. Was one child enough for this test?
10. Which matters most next: multiple children, sharing, or reminders?
11. Would you use this again tomorrow?
12. What would make RemoteMom worth paying for later?
13. Any bugs or issues?

Use a mix of short text fields, select controls, radio controls, and textareas to keep the page easy to complete on mobile.

## Data Collection

Add a new Vercel endpoint:

```text
api/beta-feedback.js
```

The endpoint should:

- Accept only `POST` and `OPTIONS`.
- Normalize expected fields.
- Require name, email, install/open status, Today usefulness, most useful feature, one-child fit, next priority, and tomorrow-use answer.
- Forward to the existing `VALIDATION_SUBMISSIONS_WEBHOOK_URL`.
- Include `submissionType: "beta-feedback"`.
- Return success only when the Apps Script webhook responds with `{ ok: true }`.
- Return calm, non-technical error messages.

## Google Sheet Destination

Update the Apps Script webhook template:

```text
integrations/google-apps-script/validation-webhook.gs
```

When `payload.submissionType === "beta-feedback"`, append to a separate tab:

```text
Beta Feedback
```

Suggested columns:

- Received At
- Submitted At
- Name
- Email
- Installed And Opened
- Understood Purpose
- First Screen
- Today Helped
- Most Useful Feature
- Confusing Or Too Much
- One Child Enough
- Next Priority
- Use Again Tomorrow
- Worth Paying For
- Bugs Or Issues
- Source
- Raw Payload

## Browser Behavior

Extend `landing/waitlist.js` to support a new `[data-beta-feedback-form]` form.

If the endpoint is unavailable, save a local browser backup under:

```text
remotemom:beta-feedback
```

The public status copy should say:

- Success: `Feedback sent. Thank you for helping shape RemoteMom.`
- Local fallback: `Could not reach the feedback endpoint. Saved as a backup on this device.`

## Privacy And Safety

The page must include a short note:

- Feedback may be saved in Vanessa's Google Sheet.
- Do not enter private medicine details.
- RemoteMom organizes routines only and does not provide medical advice.
- APK links are shared privately and should not be posted publicly.

## Visual Direction

Reuse the existing landing page style system:

- `landing/styles.css`
- calm colors
- mobile-first layout
- clear labels
- large enough tap targets
- no public APK links

The page should be form-first, not a marketing page.

## Tests

Add or update tests to cover:

- The `/beta-feedback/` page exists.
- Required survey questions are present.
- The page posts to `/api/beta-feedback`.
- No public APK artifact or local APK filename appears on the page.
- The endpoint rejects incomplete feedback.
- The endpoint forwards complete feedback with `submissionType: "beta-feedback"`.
- Apps Script routes beta feedback to the `Beta Feedback` tab.
- Landing script includes `remotemom:beta-feedback` fallback storage.

## Documentation And Checklist

Update existing documents only:

- `docs/RemoteMom_Project_Checklist.md`
- `docs/RemoteMom_Product_Brief_Roadmap.md`
- `docs/Validation_Collection_Setup.md`

Add the same checklist row to the live Google Sheet:

```text
Phase 3: Public Beta Readiness | Beta feedback | Create separate beta feedback survey page | Completed | 2026-08-10 | Added a separate /beta-feedback/ page and real collection endpoint so testers can submit structured feedback after trying the Android APK.
```

## Acceptance Criteria

- `/beta-feedback/` exists as a separate page.
- Existing `/` and `/beta/` pages keep their current purposes.
- Feedback form submits to `/api/beta-feedback`.
- Feedback submissions route to a `Beta Feedback` tab in the Google Sheet webhook template.
- Sensitive medicine details are discouraged.
- The APK link remains private and is not exposed publicly.
- Tests cover the new page, endpoint, Apps Script routing, and local fallback behavior.
- Documentation and checklist are updated.

## Out Of Scope

- No Firebase.
- No user accounts.
- No public APK download page.
- No payment or subscription logic.
- No app functionality changes.
- No analytics.
