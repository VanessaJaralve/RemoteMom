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

These are initial setup instructions. For an existing production deployment, use the endpoint-match,
verification, and rollback procedure in [issue #23 below](#issue-23--literal-text-spreadsheet-ingestion).
Saving Apps Script HEAD does not update an existing versioned web-app deployment.

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
beta list on the strength of the kit request alone. [Issue #12](https://github.com/VanessaJaralve/RemoteMom/issues/12)
is Done for the verified Stage 1 request/permission work. Optional email delivery/nurture is deferred
to [issue #24](https://github.com/VanessaJaralve/RemoteMom/issues/24), status **Later**, with a separate
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

Controlled tests cover all 36 stage/challenge pairs, the real form's changed-stage behavior, and Apps
Script's old/new mapping. PR #22 separately records the production release and labeled new-category
destination check, campaign `issue18-20261114100210z`; exclude that QA activity from #13 reporting.
#12 is Done after its optional email scope moved to #24. Vanessa's November 16 confirmation below
completes the manual native-arrow check; #18 remains In Progress for representative-reader wording.
The spreadsheet safeguard in #23 is complete. #19 adopts the documented operational duplicate-accounting
option without implementing remote idempotency; its remaining physical-PDF and journey acceptance is
separate from the verified taxonomy release.

### User-reported keyboard acceptance — 2026-11-16

In direct response to the request to open the challenge dropdown, use the up/down arrow keys, press
Enter, and check that the answer remains selected, Vanessa replied: “It worked for me.” This is
**user-reported success** for the explicit native-arrow selection/commit check. Device, operating
system, and browser were not specified; do not label it as a new automated Chrome or phone test.

Together with the earlier Tab navigation, native typeahead, form submission/error focus, and
exercise/note/copy/fallback evidence, this completes the remaining keyboard items in #18/#19.
#18 still needs representative-reader wording findings. #19 still needs detailed physical-phone/
saved-PDF readability and final acceptance. Vanessa's separate page-10 report identifies a circular
next-step journey, not a readability pass. The bounded correction is implemented and locally verified
as `next-step-v2`, marker `20261116b`: choose one page-9 action, optionally explore Android beta
interest, or use the existing help route. Exact artifact identities, preservation checks, and pinned
rebuild/rollback instructions are in the
[business roadmap](launchpad-business/README.md#issue-11--useful-next-step-after-the-kit--2026-11-16).
Record actual deployment, public-byte readback, destination checks, and release acceptance in
[#11](https://github.com/VanessaJaralve/RemoteMom/issues/11); local verification does not establish a
live replacement. The paid eBook CTA remains deferred until its actual Payhip listing/delivery and
support are verified under #2–#4/Stage 2 #16. No collection payload, permission, or app-data change is
part of this PDF revision.

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

## Issue #13 — measurement inventory and definitions

### Owner-approved request-only reporting — 2026-11-17

Vanessa approved the proposed operating arrangement on November 17: the initial free-kit experiment
uses **request-only reporting**, and **Vanessa reviews the report manually each Monday**. This resolves
the reporting-scope and weekly-owner/cadence decisions. It is an explicit change to the initial
measurement scope, not evidence that the original full-funnel events have been implemented.

Use the existing verified `Launchpad Leads` source and the definitions below. Count persisted requests
within the stated window, exclude known QA, retain missing UTMs as unattributed, and apply the existing
five-minute duplicate-review rule. Keep raw requests primary and record any independently supported
retry adjustment separately. Report channel/campaign, stage and challenge only where the source and
sample size support a useful, privacy-safe aggregate.

Visits, visitors, page views, form starts, submission errors, PDF clicks, completed downloads,
conversion and drop-off remain **not measured**. Their full-funnel goals and definitions are retained
for a later separately approved source, scope and cost decision; they are deferred from this initial
request-only experiment. No zero, estimate, conversion rate or unique-person count may substitute for
unavailable measures. Paid-product reporting remains conditional on the verified paid route.

**Manual review window:** each Monday, review the previous Monday at 00:00 through the current Monday
at 00:00 in Asia/Manila, start inclusive and end exclusive. The first regular review is **Monday,
November 23, 2026**, for **November 16 00:00–November 23 00:00 Asia/Manila**. The completed November
10–17 report below is a separate pre-launch example; it is not that upcoming period or one of the
four campaign weeks. The first planned campaign week remains November 23–30, with its review on
November 30 if the campaign proceeds through its existing gates.

**Current #13 acceptance: 12/13; Open / In Progress.** The source/counting decision and weekly-report
preparation criteria are satisfied under this approved limited scope, using the completed pre-launch
example and the adopted manual routine. Vanessa reported changing the Instagram bio on November 17;
the actual desktop route now reaches Launchpad, but retains `ig / social` with no campaign rather
than the registered `instagram / organic_social / launchpad-profile` values. The actual-channel route
criterion remains open for one exact full-URL mobile replacement and verification. Future post/Story
placement checks remain under #14 when used. Future reports still require actual extraction and
review; this approval does not claim they have happened.
No assistant automation, reminder, analytics service, paid plan, permission change or campaign launch
is created by this operating decision.

**Readiness review — 2026-11-15, Asia/Manila:** this inventory supports the November 20 readiness
target for Thanksgiving, Black Friday, and Cyber Monday content about practical tech and workspaces.
At that review, it documented available evidence and proposed counting rules; **no fresh baseline or
weekly report had been produced**. The subsequent November 16 request baseline and adopted duplicate
convention are recorded below. The Launchpad free-kit journey is separate from the `/black-friday/` app-beta
early-access campaign and its sheet tab. Do not combine their records.

### Reporting sources and verification boundary

| Source | Evidence and current availability |
|---|---|
| Launchpad attribution and collection code | Reviewed `landing/waitlist.js`, `api/launchpad-lead.js`, and `integrations/google-apps-script/validation-webhook.gs`. The page reads only `utm_source`, `utm_medium`, and `utm_campaign` from its current URL at submission; the endpoint trims/bounds each to 100 characters and supplies UTC `submittedAt`. The destination stores eleven columns, including a native `Received At` date, stage, challenge, UTMs, and `Source: launchpad-starter-kit-form`. This is request attribution, not visitor tracking or a first-touch attribution system. |
| Live Launchpad destination | The labeled November 14 checks under #19, #18/PR #22, and #23/PR #25 verified controlled requests and destination mapping. Those checks establish collection behavior, not an aggregate audience baseline. No customer-row aggregation or reporting export was performed for the November 15 inventory. The separate November 16 bounded read and request baseline are recorded below. |
| Vercel Web Analytics | **Not enabled**, observed read-only on November 15 in the [production deployment details](https://vercel.com/vanessajaralve-5251s-projects/remote-mom/8cALk2rKLhacwjc9rfM7Bsvqx4nr) for source commit `b09fd5c`: “Web Analytics Not Enabled.” Speed Insights also showed Not Enabled. No setting was changed. This is an unavailable reporting source, not an account-permission denial. |
| Browser funnel events | No analytics SDK or page/form/download event reporting was found in the reviewed Launchpad HTML/scripts, API, or package dependencies. Form validation/recovery code and ordinary PDF links exist; they do not persist event totals. Other externally configured reporting, if any, remains unverified. |
| Facebook, Instagram, Pinterest, and Payhip reports | No account reporting or dated export was inspected here. Social-platform clicks cannot substitute for website visits. The approximately 149 historical combined Payhip views, zero sales, and no reported checkout activity remain unverified owner-reported context, not a Launchpad baseline. Paid-product measures require the operating paid route and its verified reporting source. |

### Metric definitions and counting limits

The definitions below are the reporting contract. Where event collection is absent, the method is
proposed and the result must read **not measured**, never zero or an estimated conversion rate.

| Metric | Counting rule | Available evidence / limitation |
|---|---|---|
| Visits, visitors, and page views | Use **visits** to mean sessions covering `/launchpad/`; report source-defined visitors and page views separately. Record the chosen provider's identity, session, bot-filtering, and attribution rules before using its totals. | No verified source supplies these measures today; Vercel Web Analytics is disabled. **Not measured.** Request rows and social clicks cannot supply these denominators. |
| Form starts | One first interaction with a signup field per measured visit; repeated edits in that visit do not add starts. Requires a visit identifier and collected start event. | No such event/visit collection is implemented in the reviewed source. **Not measured.** A submitted request does not reveal abandoned starts. |
| Confirmed kit requests | Count persisted `Launchpad Leads` rows with `Source: launchpad-starter-kit-form` in the reporting window, after the QA exclusions below; disclose raw counts and any separately reviewed duplicate adjustment. | Controlled requests verified the destination. The November 16 record below adds an actual dated request baseline. A row confirms collection, not that the browser received confirmation, marketing permission, or a completed download. Local browser backups do not count. |
| Submission errors | Count failed attempts by category: validation rejection, destination/server failure, and network/timeout/unknown receipt. Keep those categories separate; a lost response may follow a successful write. | Source code defines the states but stores no aggregate attempt/error events. **Not measured.** Do not infer a failed write from every browser error or compute an error rate without an attempt denominator. |
| PDF link clicks | Count activations of the main download link and fallback open-PDF link separately; repeat activations are repeat click events. | Both are ordinary links in `landing/launchpad/download/index.html`; no click reporting is implemented. **Not measured.** Download-page visits or PDF HTTP requests are not equivalent to clicks. |
| Completed PDF downloads | Successful file receipt/save on the reader's device, distinct from a click, viewer open, or HTTP 200 response. | No reliable aggregate completion source is available. **Not measured.** Controlled file-open/download checks are delivery QA, not audience download totals. |

For every report, record the site/product, source/export date, exact start and end
(start inclusive, end exclusive), timezone, exclusions, unknown values, and duplicate policy.
Use the API's UTC `Submitted At` for request-window inclusion and `Received At` for reconciliation;
convert explicitly when presenting an Asia/Manila window. Flag missing/invalid historical times
separately instead of silently substituting a timestamp. Keep missing UTMs as **unattributed**,
missing stage/challenge values as **unknown**, and unrecognized values as **unmapped**. Retain
recognized historical values under the existing mapping. Preserve raw values and the option-set
boundary described above. Report stage and challenge separately from campaign audience.

Retain but exclude these synthetic campaigns, plus any other clearly labeled QA, when a report is
actually prepared: **`issue19-20261114055933z`**, **`issue18-20261114100210z`**, and
**`issue23-20261114120210z`**. The November 15 inventory established this rule; its actual application
to the November 15 reporting window is recorded in the November 16 baseline below. Use a separate
labeled QA campaign for future end-to-end checks rather than a promotion ID.

**Original duplicate recommendation — 2026-11-15, pending adoption at that time:** preserve all rows. Privately flag
nearby requests with the same trimmed email, stage, challenge, and UTMs for review against receipt
times and any known retry; a flag alone is not proof of duplication. Decide and record the review
window before producing adjusted counts. Report raw non-QA requests, suspected repeat requests,
and any evidence-based adjusted total separately. Do not count unique emails as unique visitors,
delete repeat rows, or assume every repeat request is accidental. The current flow has no remote
idempotency key. Keep contact values and raw payloads out of published reports.
The dated November 16 convention below adopts and specifies this recommendation.

### Prepared holiday campaign links

**Proposal only — not published or tested end to end.** Facebook, Instagram, and Pinterest are
candidate channels; finalize only those Vanessa confirms are used. Account availability has not
been verified here. For practical tech/workspace content, assess existing equipment and skills,
identify a real work constraint, and evaluate a tool or upgrade against that need. These links
direct readers to the free kit; they do not establish a paid discount or a tech product endorsement.
Examples cover both audience paths and all three occasions; they are not a committed posting schedule.

Use `utm_source=facebook|instagram|pinterest`, `utm_medium=organic_social`, and
`utm_campaign=holiday2026-{occasion}-{audience}-pNN`, where occasion is `thanksgiving`, `blackfriday`,
or `cybermonday`, and audience is `career` or `remote-life`. Keep a stable post ID in the #14 content
record and reuse it for that post's link. All three captured values must remain within 100 characters.
The campaign identifies the post's intended audience; it does not infer the reader's `currentStage`
or selected on-page path. Do not use `utm_content`, which this form does not capture.

| Channel / occasion | Career-path example | Remote-life-path example |
|---|---|---|
| Facebook / Thanksgiving | [Prepared p01](https://remote-mom.vercel.app/launchpad/?utm_source=facebook&utm_medium=organic_social&utm_campaign=holiday2026-thanksgiving-career-p01) | [Prepared p02](https://remote-mom.vercel.app/launchpad/?utm_source=facebook&utm_medium=organic_social&utm_campaign=holiday2026-thanksgiving-remote-life-p02) |
| Instagram / Black Friday | [Prepared p03](https://remote-mom.vercel.app/launchpad/?utm_source=instagram&utm_medium=organic_social&utm_campaign=holiday2026-blackfriday-career-p03) | [Prepared p04](https://remote-mom.vercel.app/launchpad/?utm_source=instagram&utm_medium=organic_social&utm_campaign=holiday2026-blackfriday-remote-life-p04) |
| Pinterest / Cyber Monday | [Prepared p05](https://remote-mom.vercel.app/launchpad/?utm_source=pinterest&utm_medium=organic_social&utm_campaign=holiday2026-cybermonday-career-p05) | [Prepared p06](https://remote-mom.vercel.app/launchpad/?utm_source=pinterest&utm_medium=organic_social&utm_campaign=holiday2026-cybermonday-remote-life-p06) |

Before publishing, finalize the post/channel mapping and verify that the actual social-link route
preserves all three query values to the form. These original examples had not received live HTTP or
submission checks at the November 15 inventory. The dated direct-link checks below cover the later
Facebook/Instagram campaign register. Email links remain deferred with #24; no email audience or
permission is inferred from kit requests.

### Holiday direct-link verification — 2026-11-16

The [canonical campaign pack](../marketing/launchpad-social/holiday-2026-campaign.md) now contains
12 post IDs across both paths, each with Facebook and Instagram variants. These are the existing
accounts referenced by the download page; current activity and actual posting routes are not
established by those account links. Pinterest and email are not in the prepared posting plan.

| Verification | Observed result |
|---|---|
| All 24 direct HTTP URLs | **24/24 passed** on November 16, 05:15:16–05:15:54 Asia/Manila (`2026-11-15T21:15:16.665417Z`–`21:15:54.402038Z`). Each returned HTTP 200 and `text/html; charset=utf-8`, retained its exact URL and all three expected UTM values, and contained the expected Launchpad title and actual `data-launchpad-form` targeting `/api/launchpad-lead` |
| Browser navigation to signup | Chrome opened Facebook p01/p03/p05 and Instagram p02/p04/p06. Activating the hero Starter Kit link reached `#starter-kit` while preserving all three query values exactly in each of the six cases |
| Naming and coverage | 24 unique links, approved source values, `organic_social` medium, stable post IDs, and each captured value under 100 characters. Original p01–p06 occasion/audience pairs are retained |
| Submission and attribution limit | No form was submitted for these checks. Prior labeled production checks establish collection mapping; these direct URL checks do not establish a social-app redirect, Story sticker, shared bio route, visitor counter, or new collected request |

Use the post's registered link when its actual placement is approved and record that real route in
the campaign publication log. A changing Instagram bio link cannot reliably identify the originating
older feed post; report its observed active interval and route limitation. The full #13 channel-link
criterion remains open for the actual platform routes.

### Reporting capability decision — 2026-11-16

A read-only check of the [project Analytics page](https://vercel.com/vanessajaralve-5251s-projects/remote-mom/analytics)
showed the **Hobby** team plan, an **Enable** control, and an explicit **Demo Data** preview. Analytics
is still disabled; the demo figures are not RemoteMom results. No setting, plan, or service was changed.

The current [Vercel custom-event documentation](https://vercel.com/docs/analytics/custom-events) limits
custom events to Pro/Enterprise. Its [pricing table](https://vercel.com/docs/analytics/limits-and-pricing),
checked November 16, includes 50,000 monthly events for Hobby but no custom events or UTM reporting;
Pro events are usage-priced and the optional Plus add-on includes UTM reporting. Therefore enabling
basic Hobby page views alone would not supply the required form-start/error/PDF-click breakdowns.

The remaining concrete decision is an approved reporting source and cost boundary for the full
funnel, or an explicit limited-measurement experiment decision with unavailable metrics retained.
Any approved event implementation should send only the fixed page/event category and permitted
campaign metadata, never names, emails, notes, form answers, or raw request bodies. Keep confirmed
requests sourced from the existing private destination and apply the recorded QA/duplicate rules.
No full-funnel source, paid upgrade, new telemetry, or campaign-go decision is claimed here.

### Observed request baseline — 2026-11-16

**Scope:** the [Launchpad free Starter Kit](https://remote-mom.vercel.app/launchpad/), using persisted
`Launchpad Leads` records with `Source: launchpad-starter-kit-form`. This is a confirmed-request
baseline; it does not establish website traffic, conversion, marketing permission, or download totals.

| Reporting metadata | Verified value |
|---|---|
| Reporting window | **2026-11-15 00:00 to 2026-11-16 00:00 Asia/Manila**, start inclusive and end exclusive |
| Equivalent UTC bounds | **`2026-11-14T16:00:00Z` <= `Submitted At` < `2026-11-15T16:00:00Z`** |
| Read/extraction time | **`2026-11-15T19:26:42.931Z`**, or **2026-11-16 03:26:42.931 Asia/Manila** |
| Source and access | Authorized read-only owner-browser access to the collection sheet succeeded after the Sheets connector returned HTTP 403; no access setting changed |
| Bounded-read checks | All eleven expected headers matched. A last-nonempty-receipt check and blank next-row check bounded the snapshot. The read was limited to headers, receipt-boundary navigation, submitted timestamps, and stage/challenge/UTM/source values; no Name, Email, or Raw Payload values were read |
| Snapshot coverage | Eight stored rows; all had valid `Submitted At` values and the expected Launchpad source. Every submitted timestamp preceded the reporting window. These historical rows were not classified as customers or unique readers |

This complete calendar day follows the November 14 taxonomy and ingestion releases. The snapshot
contained each of the three known QA campaign identifiers listed above, all before the reporting
window. Their exclusion was applied to the period selection; **zero QA requests were removed from
this period**, not three. Other historical records were not classified or deduplicated by this read.

| Request measure | Observed result for the stated window |
|---|---|
| Persisted Launchpad requests before QA exclusion | **0** |
| In-window QA requests excluded | **0** |
| Raw non-QA confirmed kit requests | **0** |
| Requests in the five-minute pre-window duplicate-review lookback | **0** |
| Candidate duplicate groups / extra rows | **0 / 0** |
| Independently confirmed accidental-retry extras | **0** |
| Retry-adjusted confirmed requests | **0**; no subtraction or row alteration occurred |
| Current stage, challenge, and UTM source/medium/campaign breakdowns | **No observations in the window** |

All eight examined stored timestamps and sources were valid, so no unclassifiable timestamp/source
record affected this bounded read. No period or lookback request required an email comparison.
The zero duplicate counts describe this empty period, not the duplicate status of historical rows.
No sheet record was created, changed, or deleted.

Visits, visitors, sessions, page views, form starts, submission-error totals, PDF clicks, and completed
downloads remain **not measured**. Do not calculate conversion, error, or drop-off rates, infer that
nobody visited, or draw a demand/sales conclusion from zero recorded requests in this one-day window.

### Adopted duplicate accounting — 2026-11-16

Keep **raw non-QA confirmed requests** as the primary total and retain every source row. For a period
with eligible requests, privately compare the same trimmed email, stage, challenge, and all three
UTM values. Sort by the API's `Submitted At`; matching requests within **five minutes of the first
request in a group** are review candidates. Start a new group after that interval rather than
extending a group indefinitely through successive retries. Include a five-minute pre-window
lookback for boundary repeats; lookback rows do not enter the period's count.

The five-minute convention is a review aid, not proof of duplication. A repeat may be intentional;
changed values or longer-delayed retries may evade the flag. Preserve the extraction time, private
row references, and review rationale. Report candidate groups/extra rows separately. Subtract an
extra row only when independent evidence confirms an accidental retry; otherwise retain it in the
primary total and disclose the unresolved candidate count. Label any resulting adjustment as
retry-adjusted requests, not unique visitors or subscribers. Publish no contact values or raw payloads.

This method was applied to the observed period by checking source, timestamps, QA markers, and the
lookback first; there were no eligible requests to compare. No historical duplicate review or
automatic deduplication was performed. Remote idempotency remains unimplemented; this convention
provides the operational/accounting option allowed by #19.

### Prepared manual weekly reporting routine — 2026-11-16

This routine was prepared November 16 and **adopted by Vanessa on November 17** for request-only
reporting. **Owner: Vanessa; cadence: manual review each Monday.** Review the previous complete
Monday-to-Monday week in Asia/Manila with start-inclusive/end-exclusive bounds. The first regular
review is **November 23**, covering **November 16 00:00 to November 23 00:00 Asia/Manila**.
The separate November 10–17 pre-launch report is the completed example, not this upcoming reporting
period. The routine is a manual owner commitment; no scheduled automation or future completed report
is implied.

For each report, reuse the metadata and request-measure tables above: record the period and extraction
time, privately verify the source/header/read boundary, apply QA exclusions and duplicate accounting,
and retain raw and adjusted totals separately. Add request counts by UTM channel/campaign, current
stage, and challenge as separate dimensions, retaining unknown/unattributed values. Report unavailable
traffic/event measures as **not measured**; add conversion/drop-off only after reliable compatible
denominators exist. Record observed delivery issues and the next investigation/action without private
contact data. Add paid-product measures only when that separate route and its reporting are verified.

The baseline table above was the worked **one-day** example at the November 16 preparation.
No seven-day figures or weekly audience trends had been observed at that time. The November 17
pre-launch seven-day report below adds a completed request aggregate; the manual routine does not
enable analytics or email.

**Remaining #13 work after the November 16 read:** choose and verify reliable sources/counting for
the presently unmeasured traffic and funnel events; confirm actual channels and test their final
campaign links; and produce an actual weekly report using an agreed owner/cadence. The dated
confirmed-request baseline, applied QA filters, and duplicate convention are now recorded, but these
do not complete #13 or authorize campaign publication. No analytics service has been enabled.

### Pre-UAT measurement readiness — 2026-11-17

After Vanessa's November 17 approval, #13 is **12/13; Open / In Progress** under the explicitly
approved request-only scope above. The reporting-source decision and weekly-owner/cadence preparation
are resolved. Full-funnel goals remain documented as deferred and unmeasured. The November 17 actual
Instagram route reaches the correct destination but lacks the registered campaign and uses different
source/medium values, so the actual channel-route criterion remains open. Later reports and campaign
results require their own observed evidence.

| Work item | Current evidence | Remaining action / category |
|---|---|---|
| Campaign and profile link preparation | The existing register contains 24 holiday URLs across 12 post IDs, with a Facebook and Instagram variant for each, plus two separate profile URLs. A November 17 static check passed the destination, exact three supported UTM keys, allowed source/medium values, unique post coverage, and 100-character limits. Earlier November 16 HTTP and browser checks remain the live direct-link evidence | Preparation complete. No additional tracking code is needed merely to preserve the registered parameters |
| Existing Facebook profile route | The November 16 actual desktop profile click and signup-anchor continuation retained the registered `facebook / organic_social / launchpad-profile` values | Desktop route complete for the recorded placement. Check other actual placements when used; do not infer mobile-app routing from this result |
| Existing Instagram profile route | November 17, recorded at 10:16 Manila (02:16 UTC): Vanessa reports changing the bio on her phone. The actual desktop profile click reaches Launchpad and the hero action reaches `#starter-kit`, both retaining `utm_source=ig`, `utm_medium=social`, `utm_content=link_in_bio`, and no `utm_campaign`. The owner editor's disabled Website field displays `remote-mom.vercel.app/launchpad` without a query and explicitly requires mobile editing. No form was submitted | Destination correction verified; registered tracking remains incomplete. On mobile, paste the [complete registered URL](https://remote-mom.vercel.app/launchpad/?utm_source=instagram&utm_medium=organic_social&utm_campaign=launchpad-profile), save, then verify the actual profile click and signup-anchor continuation with all three expected values. This does not verify the mobile in-app route or establish why the displayed values differ. See the [dated profile record](../marketing/launchpad-social/holiday-2026-campaign.md#instagram-bio-destination-correction--2026-11-17); click identifiers are omitted |
| Future campaign post and Story routes | All direct URLs are prepared; no holiday posts or Stories have been published | Placement check with #14 when each real placement is used. Prepared URLs are not evidence of a published route |
| Request attribution and counting | The current browser, endpoint, and eleven-column destination contract retain stage, challenge, source, and bounded UTMs. QA exclusions, unknown/unattributed handling, and five-minute duplicate-review rules are documented above | Ready for reporting against the authorized request source. Keep raw requests primary; do not infer visits, subscribers, or completed downloads |
| Traffic, starts, errors, and PDF clicks | No verified reporting source is available; the last observed Vercel configuration was disabled. The present source stores none of these event totals | **Resolved scope decision:** Vanessa approved request-only reporting November 17. These metrics, completed downloads, conversion and drop-off stay **not measured**; full-funnel implementation is deferred until a separate source/scope/cost decision |
| Weekly operating arrangement | **Approved November 17:** Vanessa owns a manual review each Monday using the existing report fields and counting rules | First regular review: November 23 for November 16–23 Manila. No automation is created and no future review is claimed completed |
| Completed pre-launch seven-day report | The authorized owner-browser read completed the November 10 00:00–November 17 00:00 Asia/Manila report below: four in-window persisted requests, three known QA exclusions, and one raw non-QA-labeled request | Completed example for the approved request-only routine. It is separate from the upcoming November 16–23 period and is not a campaign week |
| Four-week campaign results | The first planned campaign week is November 23–30; the campaign has not begun | Later observation under #14. A pre-launch seven-day report must be labeled separately and cannot satisfy a campaign week's results |

### Completed pre-launch seven-day request report — 2026-11-17

**Scope:** the existing Launchpad free-kit request source, before the planned four-week campaign.
This is a completed seven-day request report. It does not measure website visits, unique people,
demand, conversions, or completed downloads, and it does not count as a campaign week's results.

| Reporting metadata | Observed evidence |
|---|---|
| Reporting window | **November 10 00:00–November 17 00:00, 2026, Asia/Manila**; start inclusive, end exclusive |
| Equivalent UTC bounds | **`2026-11-09T16:00:00Z` <= `Submitted At` < `2026-11-16T16:00:00Z`** |
| Duplicate-review lookback | Five minutes before the start, beginning `2026-11-09T15:55:00Z`; lookback rows are excluded from the period total |
| Extraction completed | **`2026-11-16T22:25:33Z`**, or **November 17, 06:25:33 Asia/Manila**; source inspection occurred approximately 22:23–22:25 UTC |
| Access method | The purpose-built Sheets metadata read first returned permission denied before row access. The subsequent authorized owner-browser read succeeded without changing sharing or permissions |
| Source and header verification | The visible source and `Launchpad Leads` tab matched the established destination; all eleven headers exactly matched the current contract |
| Read boundary | Upward navigation from row 1000 in receipt column A, submitted-time column B, and source column J each found row 10 as the last data row. `A11:B11` and `E11:J11` were blank |
| Read scope | Only `A2:B10` and `E2:J10` were read: nine stored data rows. Name/Email columns C:D and Raw Payload column K were not read |
| Date coverage | All nine submitted timestamps were explicit valid UTC values; five stored rows were outside the reporting period. The period spans the November 14 taxonomy/ingestion releases and is not a homogeneous post-release week |

| Request measure | Observed result for this window |
|---|---|
| In-window persisted rows with source `launchpad-starter-kit-form`, before QA exclusion | **4** |
| In-window rows excluded by the exact three known QA campaign identifiers | **3** |
| Raw non-QA-labeled confirmed kit requests | **1** |
| In-window rows with another source | **0** |
| Invalid or missing submitted timestamps in the bounded snapshot | **0** |
| Requests in the five-minute pre-window lookback | **0** |
| Duplicate candidate groups / extra rows | **0 / 0**; with only one eligible request and no lookback rows, no email comparison was needed |
| Independently confirmed accidental-retry extras subtracted | **0** |
| Retry-adjusted requests | **1**; no subtraction or record alteration occurred |
| UTM attribution of the non-QA-labeled request | **1 unattributed**: source, medium, and campaign were all missing |
| Current-stage and challenge coverage | The eligible request used recognized values. Public category detail is omitted for this one-request sample |

The three exclusions matched `issue19-20261114055933z`, `issue18-20261114100210z`, and
`issue23-20261114120210z`. No unknown record was classified as QA by guesswork. The remaining request
is described as **non-QA-labeled**, not as a verified customer, unique person, or demonstrated demand.
The earlier one-day zero-request baseline remains valid for its different window.

Visits, visitors, page views, form starts, submission errors, PDF clicks, completed downloads,
conversion, and drop-off remain **not measured**. Missing UTMs prevent source/campaign attribution of
the one remaining request. No customer contact values, row-level records, raw payloads, or private
access links are included in this report. No source row, signup, analytics setting, permission,
scheduled report, or email workflow was created or changed.

At the time of this extraction, #13 was **Open / In Progress, 10/13**. Vanessa's later November 17
approval above resolves the request-only scope and manual reporting owner/cadence, bringing the
approved-scope acceptance at that point to **12/13**. It remains **12/13** after the November 17
Instagram check: the destination is corrected, but the registered tracking values are not retained.
This report's figures and limits are unchanged; future placement checks and campaign reporting
remain under the planned #14 work and observation windows.

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

**PR #21 release boundary:** no Google Apps Script deployment, sheet schema migration, production submission,
email enrollment, PDF replacement, or mobile-app change is part of this branch. The #12 permission
decision, #18 challenge taxonomy, complete mobile/PDF and audience-path coverage, and any destination
deduplication decision were separate work at that review point. PR #22 subsequently supplied the
permission/taxonomy release evidence; #12 is Done and optional email is #24 Later. The remaining
#18 checks, wider #19 coverage, and destination safeguards are still required before their issues close.

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
PDF replacement, or app-local data change was performed by these tests. At that review point,
destination retry and literal-text ingestion were separate follow-ups. #23's verified ingestion
release is recorded below; the destination retry decision and wider #19 acceptance remain open.

**Separate ingestion follow-up found in the PR #21 source review:** the then-current Apps Script wrote
submitted name/tracking strings directly with `appendRow`. Store untrusted text literally at
that boundary; [Google documents that a leading equals sign is interpreted as a formula](https://developers.google.com/apps-script/reference/spreadsheet/sheet#appendrowrowcontents).
The signup-validation PR did not change that destination behavior. The implementation, isolated proof,
and verified production release are tracked under #23 below.

## Issue #23 — literal-text spreadsheet ingestion

**Verified release and completed acceptance — 2026-11-14:** the matched live Apps Script deployment
was updated from version **16 to 18 at 20:01 Asia/Manila**. Source tests, isolated real-Sheets checks,
one labeled production request, and actual production value/formula readback passed. The deployment
URL, execute-as identity, and access settings stayed the same; other deployments remain on versions
17 and 15. This completes the ingestion safeguard's implementation and production acceptance.
[Issue #23](https://github.com/VanessaJaralve/RemoteMom/issues/23) closes after its repository PR is
published and merged. The broader #19/#14 gates remain separate.

### Write behavior and compatibility

`appendLiteralRow` in `integrations/google-apps-script/validation-webhook.gs` is the common write
boundary for validation responses, waitlist signups, beta feedback, Black Friday early access, and
Launchpad kit requests. It prefixes every nonempty string with one apostrophe before the single
submission-row `appendRow` call. This includes submitted text, the fixed source value, and raw JSON;
there is no initial unsafe append followed by a rewrite. Empty strings remain empty. Native `Date`,
number, and boolean cell values pass through unchanged.

The existing payload-field defaults (`value || ''`), route selection, source values, column order,
and eleven-column Launchpad layout are unchanged. In particular, route-level falsy values retain the
old empty-cell defaults; the helper does not change those defaults to preserve zero or false in a
field that already replaced them. Old challenge values, existing rows, missing-stage payloads, and
the existing legacy stage-column insertion remain supported. No customer-row rewrite or new schema
migration is introduced. The form, API payload, published PDF, and app-local data are unchanged.

Objects, arrays, and other unsupported cell types throw a generic error during encoding, before any
submission row is appended or a success response is produced. The route's existing sheet/header
initialization runs first: a missing sheet may be created, headers may be written, or the legacy
stage column may be inserted before such a rejection. This is not a promise of zero spreadsheet
changes on every invalid request. A failed append also prevents the normal JSON success response.

This change does not add remote idempotency, automatic retry, or a concurrency guarantee for existing
sheet initialization/legacy migration. A lost response can still follow a successful remote write;
inspect an uncertain result before retrying, account for duplicates, and keep that decision in #19.

### Verification procedure and observed results

The Jest fixture executes the actual repository Apps Script with Google services substituted. It
asserts the exact arguments supplied to `appendRow`; it does not emulate apostrophe parsing, formula
evaluation, stored cell values, or display behavior.

For real service verification, add `integrations/google-apps-script/literal-text-verification.gs`
beside the reviewed webhook candidate in the Apps Script editor and select
`verifyLiteralTextInIsolatedSpreadsheet`. Do not run the production `doPost` entry point. Each run
creates a new QA-only workbook, passes that workbook to the actual append functions, and retains it
privately. The runner does not open the production workbook, share or delete data, or make network
requests. Keep the workbook identity in private verification records; publish only the date and
aggregate result.

The runner flushes writes and checks exact values/types with `getValues()` plus empty `getFormulas()`
for every checked cell. It covers formula-like strings, whitespace and existing apostrophes,
leading-zero/date-like text, Unicode, empty values, native dates/numbers/booleans, raw JSON, all five
routes, all nine Launchpad challenges, missing-stage payloads, one legacy-column insertion, preserved
synthetic historical data, and rejected structured cell values. Do not replace real service readback
with the Jest argument fixture when verifying a later implementation change.

| Check | Observed result |
|---|---|
| Focused `ValidationGoogleAppsScript.test.ts` suite | **56 tests passed** |
| Full `pnpm exec jest --runInBand` | **383 tests passed across 32 suites; zero failures** |
| `pnpm exec tsc --noEmit` | Passed |
| `git diff --check` | Passed |
| Independent source review | No introduced blocker; existing initialization/concurrency and remote retry limits retained |
| Isolated actual Apps Script run | **Passed**, 2026-11-14 **19:56:52–19:57:10 Asia/Manila**; summary logged at **19:57:09** |
| Real-Sheets aggregate checks | **21 row checks; 254 cell checks; 225 string cells; 254 empty-formula checks; 14 route cases across all five routes; 2 rejected-value cases** |
| Isolated evidence retention | QA-only workbook retained privately; no workbook identifier, URL, or contact value published here |

### Production release evidence and rollback

The pre-release inventory on 2026-11-14 found three active deployments using versions **17, 16, and
15**. The earlier checklist claim that all active deployments used version 17 was not a valid current
inventory. Saving HEAD and passing the isolated runner alone did not identify the live target.

The live-route match was established through Apps Script execution history: the known production QA
requests at **14:01:48** and **18:03:06 Asia/Manila on 2026-11-14** both show completed `doPost` Web App
executions on **version 16**, matching the previously recorded private receipt times. Exactly one
active deployment used that version. The hosting variable is a write-only secret; its URL was not
read and no environment setting was changed. Only that matched deployment was updated to **version
18 at 20:01 Manila**. Its URL, execute-as identity, and access settings were preserved. The active
versions after this release are **17, 18, and 15**; versions 17/15 were not changed.

One normal production form request used QA campaign **`issue23-20261114120210z`**, submitted at
**20:04:21.106 Manila** and received at **20:04:22.597 Manila**. A bounded before/after read found
exactly one new eleven-column row, with submitted fields and raw JSON matching the synthetic request.
The checked header and seven earlier rows were unchanged. This is the scope of the preservation
readback; it is not a claim that every historical row was re-audited.

| Production evidence | Observed result |
|---|---|
| Live deployment | **Version 18**, released **2026-11-14 at 20:01 Asia/Manila** on the matched original version 16 deployment; existing URL, execution identity, and access preserved |
| Original rollback target | **Version 16**, with the existing matched deployment/configuration retained; other active deployments stay on 17 and 15 |
| Labeled request and mapping | Exactly one new row; eleven expected columns; submitted fields, stage/challenge, UTMs, source, and raw JSON matched privately |
| Literal values | Original leading-apostrophe text and numeric-looking text `00123` preserved as submitted |
| Actual production `getValues()` / `getFormulas()` check | **Passed at 20:09:35–20:09:36 Manila**: ten exact string cells, eleven empty-formula cells, valid native received-at `Date`, and matching headers |
| Existing bounded data | Checked header plus seven earlier rows unchanged between the before/after reads |
| Browser journey | Redirect to `/launchpad/download/` observed after collection |
| Public PDF | HTTP **200**, `application/pdf`, **110,460 bytes**, SHA-256 `b0d245586b9de17d4b77ad42a14e398f4123082f2266e5f69511a7dabf45e06e`; unchanged |
| QA evidence and reporting | One labeled synthetic row retained; exclude campaign `issue23-20261114120210z` from #13 reporting together with the earlier QA campaigns |

The bounded production verification was read-only. Its temporary check was removed by restoring the
unchanged isolated runner afterward; no further deployment was created. No private contact values,
workbook/deployment identifiers, endpoint URL, row location, or raw payload are published here.
The production case verifies the normal request journey and its literal values. Formula-like input
across all five routes was exercised in the isolated workbook, not by sending those cases through
every public form. Physical mobile PDF readability and wider audience/copy checks remain in #11/#19.

**Rollback procedure:** restore only the matched deployment to its recorded original **version 16**,
keeping its URL, execute-as identity, and access settings. Keep the other deployments at versions
17 and 15. Verify the restored route, record the outcome, and retain the labeled QA evidence; do not
delete or rewrite historical/customer rows. Inspect any uncertain receipt before retrying. The
successful release did not require a rollback and does not establish remote exactly-once delivery.

No paid checkout, outreach, email automation, app-beta enrollment, or app-data change is part of #23.

## Launchpad help and recovery (issue #16)

**Guidance drafted 2026-11-14; help subset released through PR #20.** The live help route
reuses `vanessa.jaralve@gmail.com`, already present in the RemoteMom app/landing beta-feedback source,
with the subject `RemoteMom Launchpad help`. Keep the address visible and copyable if the visitor's
email application does not open. On November 16, Vanessa answered “I can check everyday” to the
existing help-inbox monitoring question. **Vanessa is the confirmed monitor, with a daily review
cadence during the campaign.** No automated reminder or guaranteed response time is implied.

**Approved November 17:** Vanessa owns unresolved signup/download follow-up through resolution or
an explicitly recorded handoff. Keep one private email thread per case in the existing help inbox,
recording the affected resource/version, problem, status, next action and resolution; use a separate
private log only if later needed. Keep customer details and raw messages private, and publish only
sanitized, reproducible technical defects in GitHub. This confirms the operating arrangement; it does
not claim actual customer cases were handled. No mailbox settings, labels, log or automated schedule
were created by recording the approval.

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

The support-readiness record combines the deployed desktop/mobile help checks, verified failure/retry
instructions, file-handling evidence, Vanessa's confirmed daily monitoring and the November 17
follow-up/private-thread approval. Those owner decisions no longer need reconfirmation. #16 retains
its separate Stage 2 buyer-operation requirements, while #11/#18/#19 retain their remaining reader,
physical-phone/saved-PDF and final journey acceptance. Approval of the operating arrangement does not
supply new live-integration or customer-case evidence.
No email automation, marketing enrollment, purchase, refund, or customer outreach is performed by this
documentation change.

## Issue #19 initial production test — 2026-11-14

**Historical initial validation; #19 is not closed.** The remaining-work statements in this initial
record reflect the November 14 check. Current keyboard acceptance is recorded above, and November 16
confirms daily inbox monitoring; neither changes the scope of this earlier production test.
This evidence applies to the released help subset at
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
| Full stage/challenge, malformed-input, and cross-device coverage | Not complete in this initial case | PR #22 later verified the permission/taxonomy release; #12 is Done, #24 is Later, and #18 reader/native-picker plus wider #19 checks remain open |

This initial test supports the released subset only. Keep #16 In Progress until the monitoring
owner/cadence, #11 editable-source gap, remaining #19 evidence, and Stage 2 completion or explicit
deferral are recorded. The earlier draft guidance remains the operating reference; this section adds
only observed release and validation evidence.
