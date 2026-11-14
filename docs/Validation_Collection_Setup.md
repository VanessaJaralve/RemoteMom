# RemoteMom Validation Collection Setup

The landing page validation survey now submits to `/api/validation`. The waitlist forms submit to
`/api/waitlist`. The separate beta tester feedback page submits to `/api/beta-feedback`. The
Black Friday / Cyber Monday early-access page submits to `/api/black-friday`. The separate Remote
Mom's Launchpad starter-kit form submits to `/api/launchpad-lead`.

Response sheet:
https://docs.google.com/spreadsheets/d/1-uWXiAuLlIsGZ5TZ6_SVR11Vwt7CNPbvOMbcmCNAr1s/edit

## Required Environment Variable

Set this variable on the hosting platform before sharing the landing page publicly:

```text
VALIDATION_SUBMISSIONS_WEBHOOK_URL=<your secure webhook URL>
```

The endpoints forward each completed validation survey, waitlist signup, beta feedback response, or
Black Friday early-access signup as JSON to that webhook. Use
`integrations/google-apps-script/validation-webhook.gs` as the first webhook destination. Deploy it
from the personal Gmail account that owns the response sheet.

## Google Apps Script Deployment

1. Open the response sheet above.
2. Go to Extensions > Apps Script.
3. Replace the default script with `integrations/google-apps-script/validation-webhook.gs`.
4. Deploy it as a web app.
5. Set access to anyone with the link.
6. Copy the web app URL into `VALIDATION_SUBMISSIONS_WEBHOOK_URL` on the hosting platform.

## Expected Payload

```json
{
  "childrenCount": "one",
  "hardestArea": "child",
  "premiumFeature": "reminders",
  "priceComfort": "39-year",
  "interviewPermission": "yes",
  "submittedAt": "2026-08-01T00:00:00.000Z"
}
```

Waitlist submissions are sent as:

```json
{
  "email": "vanessa@example.com",
  "name": "Vanessa",
  "submissionType": "waitlist",
  "submittedAt": "2026-08-01T00:00:00.000Z"
}
```

Beta feedback submissions are sent as:

```json
{
  "submissionType": "beta-feedback",
  "name": "Vanessa",
  "email": "vanessa@example.com",
  "installedAndOpened": "yes",
  "understoodPurpose": "yes",
  "firstScreen": "today",
  "todayHelped": "somewhat",
  "mostUsefulFeature": "The Today view helped me see what to do next.",
  "confusingOrTooMuch": "The medicine section needs clearer time controls.",
  "oneChildEnough": "yes-for-beta",
  "nextPriority": "sharing",
  "useAgainTomorrow": "yes",
  "worthPayingFor": "maybe",
  "bugsOrIssues": "No crash found.",
  "submittedAt": "2026-08-10T00:00:00.000Z"
}
```

Google Apps Script routes `submissionType: "beta-feedback"` responses into a `Beta Feedback` tab.
Tester feedback should not include private medicine names, dosage details, child details, or other
sensitive family information.

Black Friday early-access submissions are sent as:

```json
{
  "submissionType": "black-friday-early-access",
  "name": "Vanessa",
  "email": "vanessa@example.com",
  "androidPhone": "yes",
  "childrenCount": "two",
  "biggestStruggle": "keeping-today-clear",
  "betaInterest": "yes",
  "submittedAt": "2026-09-27T00:00:00.000Z"
}
```

Google Apps Script routes `submissionType: "black-friday-early-access"` responses into a
`Black Friday Early Access` tab. This campaign is an early-access beta and founding-mom interest
test, not a payment collection flow.

Launchpad starter-kit submissions are sent as:

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

Google Apps Script routes `submissionType: "launchpad-lead"` responses into a `Launchpad Leads`
tab. The page captures only `utm_source`, `utm_medium`, and `utm_campaign`; each value is normalized
and limited to 100 characters by the endpoint. The allowed challenge values are role choice,
legitimate opportunities, resume or portfolio, family-compatible schedule, and returning after a
career gap. The required `currentStage` value is one of `looking-for-remote-work`,
`returning-after-career-break`, `already-working-remotely`, or `exploring-both`. New rows include a
`Current Stage` column. Historical payloads that do not contain `currentStage` remain compatible and
are written with an empty stage cell.

After a confirmed submission, the visitor is sent to `/launchpad/download/`. The downloadable file
is `landing/launchpad/download/remote-moms-work-fit-safety-starter-kit.pdf`. This is a direct
download flow; email delivery is not part of the documented current design.

## Preview Behavior

If an endpoint is unavailable or the webhook is not configured, the landing page attempts a local backup
in the visitor's browser under `remotemom:validation-survey`, `remotemom:waitlist`,
`remotemom:beta-feedback`, `remotemom:black-friday-early-access`, or
`remotemom:launchpad-leads`. Launchpad visitors are not redirected to the download page when the
webhook cannot confirm collection. These local backups keep previews and retry recovery useful, but
public collection requires the webhook variable above. A local backup is not remote collection and
is not automatically replayed. Browser storage may be unavailable; a failure to save locally must not
be presented as a successful backup. Confirm actual failure behavior under issue #19.

## Launchpad help and recovery (issue #16)

**Guidance drafted 2026-11-14; help subset released through PR #20.** The live help route
reuses `vanessa.jaralve@gmail.com`, already present in the RemoteMom app/landing beta-feedback source,
with the subject `RemoteMom Launchpad help`. Keep the address visible and copyable if the visitor's
email application does not open. The owner still needs to confirm Launchpad monitoring responsibility
and cadence.

Public response expectation:

> Email help is handled manually; there is no guaranteed response time during this early version.

### Visitor recovery guidance

- If signup does not finish, check the required fields and connection before retrying. A message about a
  backup on this device does not mean the request reached the collection destination or will be sent later.
- If the PDF does not open after reaching the download page, open the download link in a browser and use the
  PDF viewer's save/download action where available. Do not tell the reader to wait for a delivery email.
- If the issue continues, use the help route and include the affected page, visible error, and general
  device/browser. Remove personal information from screenshots. Do not request passwords, payment-card
  information, private family/health details, or a copy of browser storage.
- Do not prescribe clearing browser data as a routine fix: it can remove the local backup. Do not repeatedly
  resubmit uncertain requests without considering duplicate records during support investigation.

### Maintainer investigation and evidence

Use labeled test data and inspect the selected destination privately to distinguish confirmed receipt,
an unconfirmed request, a duplicate, and a local-only backup. Do not publish private sheet rows, contact
details, webhook URLs, or credentials. Escalate reproducible defects to the repository maintainer with
sanitized expected/actual behavior and reproduction steps; coordinate the live checks with #19.

The support process, response ownership decisions, file inventory, and release/rollback rules live in
[the existing Launchpad business roadmap](launchpad-business/README.md#issue-16--help-file-handling-and-buyer-operations).
The current distribution PDF and legacy generated output are different files. The editable source for
the current published design was not found in the repository or saved-assets review; staging output must not be
treated as design-equivalent or automatically copied over it.

Before marking the Stage 1 support gate complete, link deployed desktop/mobile help checks, the
owner-confirmed monitoring arrangement, verified failure/retry instructions, and #19's collection/download
evidence. Source inspection and local tests alone do not establish that the live integration works.
No email automation, marketing enrollment, purchase, refund, or customer outreach is performed by this
documentation change.

## Issue #19 initial production test — 2026-11-14

**Initial validation started; #19 is not closed.** This evidence applies to the released help subset at
commit [`061c31bd7e4eb968ecfef740a9a63239e1490bef`](https://github.com/VanessaJaralve/RemoteMom/commit/061c31bd7e4eb968ecfef740a9a63239e1490bef),
merged through [PR #20](https://github.com/VanessaJaralve/RemoteMom/pull/20) at 13:58:58 Manila
(`2026-11-14T05:58:58Z`). The production deployment succeeded; see the
[release record](launchpad-business/README.md#issue-16--help-file-handling-and-buyer-operations).

The synthetic case `QA TEST issue19 20261114055933Z` was submitted at **14:01:48.538 Manila**
(`2026-11-14T06:01:48.538Z`). It used the existing stage `already-working-remotely` and challenge
`family-compatible-schedule`, with UTM source `qa`, medium `validation`, and campaign
`issue19-20261114055933z`. The test email, destination link, private row location, and raw payload are
intentionally omitted. Exclude this QA campaign from #13 baseline reporting. One synthetic row is
retained; no customer or app-local data was altered.

| Check | Observed result | Scope or remaining evidence |
|---|---|---|
| Public help surfaces | Passed on desktop and 390 × 844 mobile at `/launchpad/#help` and `/launchpad/download/#download-help` | Anchors/return navigation, disclosures, keyboard interaction, and visible correct mailto checked; no inbox monitoring or email-delivery test implied |
| Empty form | Blocked with clear required-fields message | Does not establish malformed-email, unknown-value, or all-field validation coverage |
| One valid labeled signup | Confirmed collection and progression to the download page | One existing stage/challenge combination only |
| Private destination evidence | Exactly one matching synthetic row; 11 expected columns; name, email, stage, challenge, and all UTM fields matched | Verified privately; no private rows or payloads are published here |
| Public PDF new-tab fallback | Opened the current ten-page kit | Distribution PDF unchanged; marker `20261024` retained |
| Primary Download action | Link clicked | Local saved-file completion remains unverified: browser security policy blocked the downloads page and no workaround was used |
| Python regression tests | Two passed again against the release head | Focused regression evidence only |
| Supplemental assertion harness | Head and base each reported 11 passed and the same two stale-copy failures | Official Jest unavailable; this is not a Jest/Expo pass |
| Collection failure, storage failure, retry, and duplicate handling | Not verified in this production case | Remaining #19 work; source inspection does not substitute for these checks |
| Full stage/challenge, malformed-input, and cross-device coverage | Not complete | #12/#18 decisions remain pending; do not infer full funnel readiness from one success case |

This initial test supports the released subset only. Keep #16 In Progress until the monitoring
owner/cadence, #11 editable-source gap, remaining #19 evidence, and Stage 2 completion or explicit
deferral are recorded. The earlier draft guidance remains the operating reference; this section adds
only observed release and validation evidence.
