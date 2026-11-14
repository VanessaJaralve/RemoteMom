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
and limited to 100 characters by the endpoint. The challenge contract now retains the five original
values and adds four remote-life choices; see the exact mapping below. The required `currentStage`
value is one of `looking-for-remote-work`,
`returning-after-career-break`, `already-working-remotely`, or `exploring-both`. New rows include a
`Current Stage` column. Historical payloads that do not contain `currentStage` remain compatible and
are written with an empty stage cell.

After a confirmed submission, the visitor is sent to `/launchpad/download/`. The downloadable file
is `landing/launchpad/download/remote-moms-work-fit-safety-starter-kit.pdf`. This is a direct
download flow; email delivery is not part of the documented current design.

## Issues #12 and #18 — request scope and challenge mapping

**Implementation decision — 2026-11-14:** the initial experiment collects **Starter Kit requests
only**. The form explains the direct PDF download before submission, describes the use of submitted
details, and states that a request does not subscribe the reader to marketing emails or join the
RemoteMom app beta. The download page keeps the optional beta interest form as a separate action.

Name and email identify the kit request and support an investigation if the reader contacts Vanessa.
Stage, challenge, and bounded campaign values support aggregate learning about reader needs and
acquisition sources. The existing `submissionType: "launchpad-lead"` and sheet source
`launchpad-starter-kit-form` identify a kit request. They are **not** marketing or app-beta permission.
The endpoint constructs an explicit payload and does not forward additional marketing/beta flags.
There is no marketing checkbox, consent field, consent version, or consent timestamp in this flow.
The request timestamp must not be repurposed as a marketing-permission timestamp.

Treat historical Launchpad rows the same way: preserve them as kit-request records and never infer
marketing or beta permission from their presence. Do not import these records into a marketing or
beta list on the strength of the kit request alone. Any later email delivery/nurture proposal remains
gated under [issue #12 Stage 2](https://github.com/VanessaJaralve/RemoteMom/issues/12), with a separate
purpose, permission decision, service choice, and delivery/unsubscribe/failure checks. No such service
or enrollment is activated by this change. Use the existing manual help route; no retention deadline,
automatic deletion, or self-service unsubscribe capability is promised.

### One grouped challenge list

All nine options are available to all four stages. Native option groups make the two needs easy to
scan without filtering a reader into a single path. The helper says: “Choose the one that matters
most right now. You can choose from either group.” It is associated with the select using
`aria-describedby`; validation feedback adds its own description without removing the helper.

| Group | Stable value | Visible wording | Compatibility |
|---|---|---|---|
| Finding or returning to remote work | `choosing-the-right-role` | Choosing the right role | Existing; unchanged meaning |
| Finding or returning to remote work | `finding-legitimate-opportunities` | Finding legitimate opportunities | Existing; unchanged meaning |
| Finding or returning to remote work | `resume-or-portfolio` | Improving my resume or portfolio | Existing; unchanged meaning |
| Finding or returning to remote work | `returning-after-career-gap` | Returning after a career gap | Existing; unchanged meaning |
| Making remote work fit family life | `family-compatible-schedule` | Finding a family-compatible schedule | Existing; unchanged meaning |
| Making remote work fit family life | `work-family-boundaries` | Work and family boundaries | Added in this revision |
| Making remote work fit family life | `managing-interruptions` | Handling work interruptions | Added in this revision |
| Making remote work fit family life | `planning-workload` | Planning my workload | Added in this revision |
| Making remote work fit family life | `switching-between-tasks` | Switching work and family tasks | Added in this revision |

Changing the stage intentionally keeps the selected challenge: every pair is supported, including
`exploring-both`. No option becomes hidden or invalid after a stage change. The browser and endpoint
share `landing/launchpad/lead-validation.js`, which accepts the same nine values and rejects unknown
values before collection. The four stage values, timestamp, and UTM bounds are unchanged.

The existing Apps Script copies the stable challenge into `Biggest Challenge` and the stage into
`Current Stage` in the eleven-column `Launchpad Leads` layout. It has no challenge-specific allowlist
to update. New choices therefore need no new columns, Apps Script deployment, or historical-row
migration. Its existing support for older payloads without a stage remains unchanged. Local backups
use the existing key and retain old records; the Today Dashboard and app-local storage are unaffected.

### Reporting contract for #13

- Report `currentStage` and `biggestChallenge` separately. A challenge group does not establish the
  reader's work stage, because readers may choose from either group.
- Preserve raw challenge values and the mapping above. Never recode an old schedule selection as
  boundaries, interruptions, workload, or transitions; the original answer does not establish that detail.
- Record the actual deployment commit/time in the linked release evidence. Compare periods with the
  option-set change identified; the new choices were unavailable in earlier periods. Do not treat an
  earlier zero for a new choice as evidence that the need did not exist.
- Count confirmed kit requests, not newsletter subscribers or completed PDF downloads. Keep unknown
  or historical blank values visible as unmapped/unknown; do not silently guess a category.
- Exclude labeled QA campaigns and account for uncertain duplicate submissions in the #13 baseline.

### Acceptance boundary

The wording follows the approved two-path design and remains subject to representative-reader review
under [#15](https://github.com/VanessaJaralve/RemoteMom/issues/15). No completed reader findings were
available in that issue when this revision was prepared. Do not mark the reader-review criterion of
#18 complete on the strength of internal review.

Controlled tests must exercise all 36 stage/challenge pairs, the real form's changed-stage behavior,
and Apps Script's old/new mapping. They establish source behavior, not a new production destination
write. Link the actual test and deployment evidence in #12/#18/#19, and record a labeled new-category
destination check before claiming the changed taxonomy is verified in production. The existing
spreadsheet literal-text ingestion and remote retry/idempotency follow-ups remain separate.

### Controlled verification — 2026-11-14

The existing locked dependencies and actual Jest/Babel/JSDOM setup were used. No dependency manifests
changed. These checks used synthetic data, mocked HTTP responses, and stubbed Google spreadsheet
services; they did not create production records.

| Check | Executed result |
|---|---|
| Focused validator, endpoint, real form events, and Apps Script routing suites | **221 tests passed across 4 suites** |
| Full `pnpm exec jest --runInBand` | **340 tests passed across all 32 suites; zero failures** |
| `pnpm exec tsc --noEmit` | Passed |
| `node --check` for shared validator, endpoint, and submission script | Passed |
| `git diff --check` | Passed |
| Independent permission/source review | No Stage 1 blocker found; confirmed the kit-only copy and separate beta action match behavior |

The focused coverage includes all 36 stage/challenge pairs, exact forwarded values/UTMs, all four new
choices through the actual form, every changed-stage destination, helper/error associations, injected
marketing/beta flag exclusion, old local-backup preservation, and execution of the repository Apps
Script for nine values and legacy stage/header compatibility. The repository defines no lint or
production-build script. Deployment, desktop/mobile UI, and live destination results belong in the
linked release evidence; these local checks do not establish them. Final UI polish adds spacing above
the submit button without changing the validated behavior.

The 390-pixel preview exposed a truncated new label in the closed native select. The four new labels
were shortened to the wording in the table above, preserving their values and meaning. Browser
verification checks the shortened labels, native keyboard selection, and the associated request/helper
copy. Existing historical values and labels remain unchanged.

## Preview Behavior

If an endpoint is unavailable or the webhook is not configured, the landing page attempts a local backup
in the visitor's browser under `remotemom:validation-survey`, `remotemom:waitlist`,
`remotemom:beta-feedback`, `remotemom:black-friday-early-access`, or
`remotemom:launchpad-leads`. Launchpad visitors are not redirected to the download page when the
webhook cannot confirm collection. These local backups keep previews and retry recovery useful, but
public collection requires the webhook variable above. A local backup is not remote collection and
is not automatically replayed. Browser storage may be unavailable; a failure to save locally must not
be presented as a successful backup. Confirm actual failure behavior under issue #19.

## Issue #19 signup reliability — PR #21, 2026-11-14

The `issue-19-signup-reliability` branch adds the validation and recovery changes below. Implementation
and test evidence are recorded here; the merge state, deployment commit, and subsequent production
checks are recorded in [PR #21](https://github.com/VanessaJaralve/RemoteMom/pull/21) and
[issue #19](https://github.com/VanessaJaralve/RemoteMom/issues/19). The broader issue remains open.
The initial production test later in this document still describes the earlier release.

- `landing/launchpad/lead-validation.js` supplies one validation contract to the browser and the
  endpoint. Required name, email, stage, and challenge values must be nonblank strings. Stage and
  challenge values retain the current allowlists. Email validation checks practical public-address
  syntax, including plus tags and subdomains; it does not verify mailbox ownership, deliverability,
  or domain existence. Optional UTM values must be strings when present and remain bounded to
  100 characters when forwarded.
- Malformed JSON, null, arrays, scalar bodies, and structured field values receive `400` before any
  webhook call. The endpoint returns a known field and a correction message. The browser highlights
  that field, preserves the entered details, and does not describe a validation failure as a saved backup.
- The browser resets and redirects only after a successful HTTP response with a JSON object whose
  `ok` value is exactly `true`. The endpoint continues requiring confirmation from the collection
  destination. A non-confirming or malformed response never becomes a successful signup.
- A single in-flight submission guard blocks overlapping attempts. Confirmation is bounded to
  20 seconds, including JSON-body reading. Timeout/network/server errors retain the form values and
  attempt a local backup under the existing `remotemom:launchpad-leads` key. The message distinguishes
  an available local copy from a backup that could not be saved.
- Backups preserve existing entries, avoid appending an identical name/email/stage/challenge/UTM
  entry on a retry, and leave malformed or non-array stored data untouched. They are not automatically
  sent, cleared, or migrated. The other form handlers and mobile-app storage are unchanged.

**Retry limit:** a timeout, lost response, or browser abort does not prove that the destination failed
to write. A later manual retry can create a second remote row. This branch prevents overlapping
browser submissions and duplicate local backups; it does not implement server/destination idempotency
or automatic retries. The error message explains the uncertain result and provides retry/help guidance.
Investigate uncertain receipts privately before repeated retries, account for duplicates in reporting,
and exclude all labeled QA activity from #13 baseline figures.

**Release boundary:** no Google Apps Script deployment, sheet schema migration, production submission,
email enrollment, PDF replacement, or mobile-app change is part of this branch. The #12 permission
decision, #18 challenge taxonomy, complete mobile/PDF and audience-path coverage, and any destination
deduplication decision remain separate evidence before #19 can close.

### Controlled verification for the review branch

Checks ran on 2026-11-14 using the locked dependencies installed with
`pnpm install --frozen-lockfile --ignore-scripts`; `package.json` and `pnpm-lock.yaml` are unchanged.
The actual repository Jest/Babel setup was used, including JSDOM with the real form markup for
browser event tests. Network responses, exceptional storage access, and navigation were controlled;
no production requests or new lead records were created.

| Check | Result | Scope |
|---|---|---|
| Focused endpoint and shared-validator tests | 131 passed in 2 suites | Malformed/type-invalid input, practical email syntax, all 20 current stage/challenge pairs, normalized UTMs/timestamp, and collection confirmation/failure |
| Browser event-flow tests | 47 passed in 1 suite | Actual form DOM/FormData, required/invalid fields and focus, strict confirmation, 400 vs uncertain failures, storage preservation, retries, overlap prevention, timeout and late responses |
| Initial full Jest suite | 297 passed, 2 failed; 31 suites passed, 1 failed | The same two test cases failed on untouched baseline `a2d7ee62`: Android beta invite guidance and Launchpad hero text. Baseline: 123 passed, 2 failed. The release follow-up below resolves both cases |
| `pnpm exec tsc --noEmit` | Passed | Test tuple typing corrected before final verification |
| `node --check` for endpoint, shared validator, and submission script | Passed | JavaScript syntax |
| `git diff --check` | Passed | No whitespace errors |

The repository defines no lint or production-build script. This initial review did not verify a
production deployment or complete the remaining mobile/PDF, audience-path, consent, or destination checks.

### Release review and regression follow-up — 2026-11-14

The final review found that the Android case identified missing documented installation guidance,
not only an obsolete heading. The beta page and its existing Firebase distribution guide now explain
private invitations, optional Firebase App Tester, and use of the Google account that accepted the
invitation. The accepting account may differ from the invitation email. The public page still has no
APK URL, and joining the interest list does not send an automatic invitation. The guide links the
current official Firebase instructions and troubleshooting reference.

`LandingPage.test.ts` retains the Android requirements and adds checks for the account distinction
and optional App Tester. Its obsolete Launchpad hero/benefit assertions now reflect the current page;
the required fields, four stages, attribution, endpoint, safety language, PDF, and secondary beta
checks remain in place. No signup runtime behavior was changed during this follow-up.

| Final pre-merge check | Result |
|---|---|
| Actual full `pnpm exec jest --runInBand` | **299 passed, 32 suites passed, zero failures**, including all 178 signup reliability tests |
| `pnpm exec tsc --noEmit` | Passed |
| Runtime JavaScript syntax and patch whitespace | Passed |
| Independent signup source review | No introduced release blocker found |

The locked dependency manifest and lockfile are unchanged. This is pre-merge evidence; consult PR #21
and issue #19 for the observed release result. No production signup, Apps Script deployment, public
PDF replacement, or app-local data change was performed by these tests. The destination retry and
literal-text ingestion follow-ups remain open, as do the wider #19 acceptance criteria.

**Separate ingestion follow-up found in source review:** the existing Apps Script writes submitted
name/tracking strings directly with `appendRow`. Ensure that untrusted text is stored literally at
that boundary; [Google documents that a leading equals sign is interpreted as a formula](https://developers.google.com/apps-script/reference/spreadsheet/sheet#appendrowrowcontents).
This pre-existing destination behavior is unchanged by the signup-validation PR and needs its own
controlled test and deployment review before broad promotion.

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
| Primary Download action | Link clicked; local save/open confirmed by Vanessa on 2026-11-14 | User replied “confirmed open” after being asked to check Downloads and open `remote-moms-work-fit-safety-starter-kit.pdf`; this is user-confirmed evidence. Earlier browser inspection was blocked by policy; no workaround was used |
| Python regression tests | Two passed again against the release head | Focused regression evidence only |
| Supplemental assertion harness | Head and base each reported 11 passed and the same two stale-copy failures | Official Jest unavailable; this is not a Jest/Expo pass |
| Collection failure, storage failure, retry, and duplicate handling | Not verified in this production case | Remaining #19 work; source inspection does not substitute for these checks |
| Full stage/challenge, malformed-input, and cross-device coverage | Not complete | #12/#18 decisions remain pending; do not infer full funnel readiness from one success case |

This initial test supports the released subset only. Keep #16 In Progress until the monitoring
owner/cadence, #11 editable-source gap, remaining #19 evidence, and Stage 2 completion or explicit
deferral are recorded. The earlier draft guidance remains the operating reference; this section adds
only observed release and validation evidence.
