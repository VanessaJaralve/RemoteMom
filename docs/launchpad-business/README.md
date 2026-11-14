# RemoteMom Launchpad Business Roadmap

> Business workstream for **The Remote Mom's Launchpad**. This plan is separate from RemoteMom app engineering. It tracks the digital education business: positioning, Payhip conversion, lead generation, content, customer experience, and later app coordination.

## North-star outcome

Validate a repeatable, ethical path from qualified audience attention to the first paid customers for the Launchpad digital products, without relying on paid ads or building more products before demand is tested.

**Positioning:** Helping moms build a remote-working life that works for their careers, families, and everyday responsibilities.

**Brand phrase:** Remote work that fits real life.

## Current baseline

- Payhip product-page views reported: approximately 149 combined since around November 2025.
- Main eBook page: more than 100 views.
- High-Value Hybrid page: fewer than 25 views.
- Sales: 0.
- Checkout activity: none reported.
- Traffic source: not yet tracked.
- Promotion: no consistent active promotion yet.

These are the owner's reported starting figures, not independently verified analytics. The current evidence points first to an acquisition and conversion-measurement gap; it is too early to conclude that pricing or product-market fit is wrong.

## Product architecture

1. **Entry product:** *The Remote Mom's Launchpad: Mastering the Mindset, Time, and Tech to Go Remote* — retain the complete eBook as the core introductory product.
2. **Career-positioning companion:** *The High-Value Hybrid: Identifying Your Top Transferable Skills* — position as the next step for readers who need to translate existing experience into remote-work value.
3. **Flagship bundle (build after the page and funnel are validated):** The Remote Work Ready Mom Collection — eBook, High-Value Hybrid, readiness assessment, transferable-skills workbook, job-search tracker, scam checklist, CV/application preparation templates, weekly planner/boundary planner, and a 30-day action plan.
4. **Later service:** optional guided workshop/cohort, only after audience conversations validate the need.
5. **Separate product line:** RemoteMom app remains a beta product. Do not mix app waitlist consent with Launchpad marketing consent.

## Audience and market

Serve both Philippine and international audiences, with localized examples, platforms, payment expectations, and resource links where needed. Avoid promising guaranteed remote jobs or employment outcomes.

## Work stages and completion gates

The stages below align this existing roadmap with the revised GitHub backlog. Basic help and file
handling belong before the free-kit experiment; mature buyer operations and email automation do not.

| Stage | Focus | Completion gate |
|---|---|---|
| 1. Foundation & free-funnel verification | Both audiences, existing kit, signup permission, measurement, early research, help, and delivery | #1, #11, #13, #18, #19 and the Stage 1 subsets of #12/#16 are verified before #14; #15 research can run alongside this work |
| 2. Existing paid offer | Accurate Payhip listings, previews, checkout, delivery, and buyer support | Relevant #2–#5 checks and Stage 2 support are verified before paid promotion; optional email work has its own decision and tests |
| 3. Four-week validation | Organic content for both audience paths | #14 publishes four weeks of tracked content and records learning; a verified free-kit experiment can start without Stage 2 paid offers or full email automation |
| 4. Evidence-led collection | Reuse inventory, scope decision, selected resources, and packaging | Inventory in #6 may begin early; production waits for #15 and #14 findings; selected #7–#9 assets and bundle-specific delivery QA precede #10 promotion |
| 5. App readiness | Separate beta assessment | #17 documents evidence and follow-up decisions; it does not block Launchpad validation or authorize app monetization |

## Recommended execution order

**Before the four-week experiment**

- Confirm both audience paths and the page's immediate conversion goal under #1.
- Review the existing Starter Kit under #11 rather than assume it needs recreating.
- Verify signup wording, collection, direct download, attribution, and the early help/file-handling
  process under #12, #13, #16, #18, and #19.
- Start the 5–10 reader conversations in #15. Inventory reusable assets without committing to new production.

**During the four-week experiment**

- Publish a sustainable content cycle on existing channels, primarily directing readers to the free kit.
- Review channel visits, confirmed signups, delivery issues, and feedback weekly using #13's definitions.
- Mention a paid offer only after its relevant listing, checkout/delivery, and support checks pass.
- Keep email automation optional and separate from the initial direct-download journey.

**After reviewing the evidence**

- Record what to continue, change, or stop in #14.
- Use the experiment and #15 research to decide whether to build, narrow, or defer the collection in #6.
- Build only selected resources, then verify the actual bundle before promotion.

## Working validation targets (not forecasts)

The earlier business plan proposed 50–100 qualified product-page visits, 10–20 free-resource subscribers,
and 3–5 genuine paid customers for a 30-day experiment. These are historical working hypotheses, not
forecasts or release gates. For the initial kit-only experiment, measure **confirmed kit requests**;
the historical subscriber wording does not imply permission to send marketing. Select the current
experiment's measures under #1/#13/#14; paid-customer
targets apply only when a paid route is operating. If traffic is limited, investigate distribution
before drawing pricing conclusions. If qualified traffic reaches a verified paid offer but checkout
remains inactive, interview visitors and test page clarity, trust, and offer relevance.

## Operating rules

- Do not create another standalone eBook before validating the existing products and bundle.
- Do not lower prices or buy ads based only on low historical traffic.
- Track weekly: channel visits, product-page views, opt-ins, checkout starts, sales, revenue, and top content.
- Keep the app beta waitlist and Launchpad marketing list distinct unless people explicitly consent to both.
- Keep customer data, private webhook URLs, API keys, and credentials out of this public repository.
- Close an issue only when its acceptance criteria are met and evidence is linked in the issue.

## Issues #12 and #18 — kit requests and audience choices

**Decision recorded 2026-11-14:** the initial free-kit experiment collects Starter Kit requests only.
After confirmed collection, the visitor downloads the existing PDF on the next page. The form states
this before submission, explains why the details are collected, and says that requesting the kit does
not subscribe the visitor to marketing emails or join the RemoteMom app beta. The download page keeps
beta interest optional and separate.

No marketing permission is collected in Stage 1. The conditional consent-purpose/version/timestamp
criterion in #12 is therefore not applicable to this version; do not create or infer those values from
the request timestamp. Current and historical Launchpad records remain kit requests. They must not be
treated as a marketing audience or an app-beta list. Support contact also remains separate from
marketing permission. The existing manual help route makes no guaranteed-response, retention, or
automatic-removal promise.

**Stage 2 decision:** defer email delivery and the proposed 4–5 email nurture sequence. Retain the
gated follow-up in [#12](https://github.com/VanessaJaralve/RemoteMom/issues/12); there is no email-service
selection or activation in this release. Revisit only after the verified free-kit experiment and
reader findings show a useful purpose, then approve and test the service, separate permission record,
unsubscribe, failure handling, and exclusion of people without the relevant permission. Keep #12 open
for that follow-up unless its deferral is moved into a separately linked issue; completing Stage 1 does
not claim that the full email workflow exists.

For #18, use one native grouped list: four career choices and five work/family choices. Keep all five
historical values and add boundaries, interruptions, workload planning, and task transitions. All nine
choices remain available at every stage, including “exploring both”; a stage change intentionally keeps
the selected challenge. This supports people with overlapping needs without splitting the kit funnel
or collecting private family details.

The exact value/label mapping, unchanged sheet schema, historical interpretation, and #13 reporting
rules live in [Validation Collection Setup](../Validation_Collection_Setup.md#issues-12-and-18--request-scope-and-challenge-mapping).
Measure stage and challenge as separate dimensions and record the deployment boundary when comparing
old and new option sets. No historical answer is rewritten into a more specific new category.

**Remaining evidence:** representative-reader wording checks remain under #15; none were completed in
that issue when this decision was recorded. Controlled source tests and a browser preview do not alone
prove the production destination mapping. Link the actual release and labeled destination evidence to
#18/#19 before marking that criterion complete. The broader #19 journey checks, #13 baseline, #16
monitoring arrangement, and spreadsheet literal-text hardening remain prerequisites before broad
promotion. This change does not authorize outreach, beta invitations, or the four-week campaign.

## Issue #16 — help, file handling, and buyer operations

**Released subset; issue #16 remains In Progress.** The help and file-handling changes originally
drafted on 2026-11-14 were released through [PR #20](https://github.com/VanessaJaralve/RemoteMom/pull/20).
The published-help criterion is satisfied, and #19 has one verified production signup/collection case.
Monitoring ownership/cadence, the editable-source gap, remaining #19 coverage, and Stage 2 operations
remain unresolved. The release record below preserves the distinction between deployed help and full
completion of [#16](https://github.com/VanessaJaralve/RemoteMom/issues/16).

### Stage 1: contact, intake, and escalation

The released help surfaces reuse `vanessa.jaralve@gmail.com` with a `RemoteMom Launchpad help` subject.
This address already appears publicly as RemoteMom beta feedback in `landing/index.html` and
`src/screens/MoreScreen.tsx`; no new inbox is assumed. The owner must confirm who monitors Launchpad
requests and the review cadence before the Stage 1 support gate can be considered complete.

Public expectation wording for this early version:

> Email help is handled manually; there is no guaranteed response time during this early version.

The contact link and copyable address are live on the Launchpad and download surfaces. Help explains
the direct-download design and what to try when signup or opening the PDF fails. A browser-local
backup is not confirmed remote collection and is not automatically resent. Do not promise email kit
delivery, automatic recovery, or a numeric response time. See the recovery guidance in
[Validation Collection Setup](../Validation_Collection_Setup.md#launchpad-help-and-recovery-issue-16).

Use the selected inbox and a private support log with only the information needed to resolve a request:
case reference, date received, category, affected page/resource version, general device/browser,
short problem description, status, next action, and resolution. Suggested categories are signup,
download, incorrect/unreadable file, and content question. Suggested statuses are New, Investigating,
Waiting for information, and Resolved. These are a template, not actual customer records.

Prioritize blocked delivery and incorrect files. Reproduce a technical problem with test data, then
send a sanitized defect report to the repository maintainer: affected page, expected/actual behavior,
reproduction steps, general device/browser, resource version, and any safe screenshots. Link collection
and download defects to #19. If a general blocker is confirmed, pause promotion of the affected route
until it is fixed and retested. Keep customer messages, email addresses, receipts, private sheet rows,
webhook URLs, and credentials out of GitHub; do not ask for passwords or private family/health details.

### Stage 1: Starter Kit artifact inventory

The following identities come from the reviewed `main` tree. The release preserved the distribution
PDF, and the public ten-page kit opened during the production check. Git blob IDs identify the recorded
repository bytes; they are not a claim of matching editable design sources. Local save/open evidence is recorded separately below.

| Artifact | Location | Observed identity | Handling |
|---|---|---|---|
| Current distribution PDF | `landing/launchpad/download/remote-moms-work-fit-safety-starter-kit.pdf` | 110,460 bytes; Git blob `1ddd48183d0f9602df55f42c06de0944ee9abad2` | Preserve this published-design artifact while #11 reviews its contents and provenance |
| Legacy generated output | `output/pdf/remote-moms-work-fit-safety-starter-kit.pdf` | 20,025 bytes; Git blob `38251317eb1904322d6b9cc001ce47f03a6dacec` | Different bytes from the distribution PDF; not an interchangeable master |
| Legacy editable generator | `scripts/build-launchpad-starter-kit.py` | Existing ReportLab source | Treat staging-only output as a review candidate; it is not verified to reproduce the published design |
| Editable master for current published design | Not identified in the repository or saved-assets review | **Source master not found** | Recover or identify the original source before claiming the current design is reproducible |

The existing download link uses `?v=20261024`. Preserve it until a reviewed replacement is released;
it is an observed link marker, not evidence of an approved release date. Do not overwrite the current
distribution PDF with legacy output to make the inventory appear consistent.

For future candidates, use `remote-moms-work-fit-safety-starter-kit_YYYY-MM-DD_rN.pdf`, with the actual
candidate date and revision. Keep the public filename stable so existing links remain usable. Record
the candidate's source, file hash, revision, review result, and relationship to the distribution artifact.
The staging-only generator replaces the legacy `output/pdf` review copy only. It must not publish a PDF
or replace the distribution artifact automatically.

For a release, preserve the previous distribution artifact and commit, render/check every page, test
mobile opening and links, and record the selected source and review evidence. Update the public file,
link version marker, and inventory together only after release approval. The change-log entry records
the old/new identities, actual release date, reason, QA evidence, deployment reference, and rollback
target. This section's draft record and `docs/RemoteMom_Project_Checklist.md` track current work; future
release entries should be added here rather than creating a competing roadmap.

If a replacement is defective, restore the recorded previous PDF and corresponding download link/version
marker, redeploy through the normal process, and verify the restored download. Record the rollback and
reason. Keep historical artifacts; do not regenerate an unverified substitute as a recovery action.

### Stage 2: buyer support, feedback, and updates

Activate these steps only after the owner verifies the actual listings, delivery behavior, and applicable
policies under #2–#4 (and #10 for the bundle). This draft creates no refund entitlement, refund restriction,
payment promise, or assumed Payhip capability.

- For purchase/access problems, verify the transaction privately using the available platform tools and
  provide the recovery steps confirmed during checkout testing. Never request payment-card details.
- Use a short optional feedback prompt: “Were you able to open and use the files? Which exercise or resource
  did you try first? What felt useful, unclear, or missing?” Store responses privately and summarize themes.
- Turn actionable feedback into a sanitized issue linked to the affected product/version. Record the decision
  to fix, clarify, investigate, or defer. Feedback is not permission to publish a testimonial.
- Before replacing a paid file, verify the platform's actual update and customer re-download behavior. Record
  old/new versions, the correction, checks, and delivery method. Do not promise automated updates or email
  notifications until those functions are configured and tested.
- Keep necessary delivery/correction communication separate from optional marketing. This preparation does
  not send outreach, enroll subscribers, or activate email automation.
- Review recurring questions at the owner-confirmed cadence and update the existing FAQ/instructions when
  repeated confusion appears. Keep the listing and help wording consistent.

### #16 decision and acceptance-evidence record

| Item | Current status | Evidence needed before completion |
|---|---|---|
| Published Launchpad help/contact route | **Satisfied for the released subset:** both help surfaces, anchors, disclosures/keyboard operation, and visible correct mailto checked on desktop and 390 × 844 mobile | Public links and release evidence below; this does not verify inbox monitoring or email delivery |
| Response expectations and escalation | Manual/no-guaranteed-time wording published; sanitized maintainer escalation documented | Monitoring owner/cadence remain explicitly unconfirmed |
| Signup/download recovery | One production signup, private destination match, empty-form validation, and public PDF opening verified; local save/open user-confirmed on 2026-11-14 | Remaining #19 failure/retry/full-coverage checks remain unverified |
| Master and version handling | Distribution/legacy artifacts distinguished; staging safeguard released; published design source not found | #11 records source recovery/provenance outcome; no regenerated design equivalence is claimed |
| Privacy of support records | Private-intake template and public-defect boundaries documented | Actual support handling uses a private location; published evidence contains no customer data |
| Buyer policy, feedback, and update workflow | Draft instructions only; not activated | Owner verifies #2–#4/#10 behavior and policies, feedback handling, and supported update/re-download steps |
| Deployment and issue closure | **In Progress; released subset only** | Confirm monitoring arrangement, resolve/track #11 source gap, complete remaining #19 coverage, and complete or explicitly defer Stage 2 with linked follow-up; #12/#18 decisions remain pending |

**Historical draft change record — 2026-11-14:** added the early support process, proposed reuse of the existing
public email, artifact divergence record, staging-only generation requirement, and release/rollback
instructions. No published PDF is replaced by this documentation work. No live support, email, checkout,
or collection result is asserted. #14 depends only on completed Stage 1 support, not Stage 2 buyer operations.

**Release and initial validation record — 2026-11-14:** PR #20 merged to `main` as
[`061c31bd7e4eb968ecfef740a9a63239e1490bef`](https://github.com/VanessaJaralve/RemoteMom/commit/061c31bd7e4eb968ecfef740a9a63239e1490bef)
at **13:58:58 Manila** (`2026-11-14T05:58:58Z`).
[Vercel production deployment](https://vercel.com/vanessajaralve-5251s-projects/remote-mom/44kTFpf2eUU3uxTM5HfxzMuBF5Lv)
succeeded. The [Launchpad help section](https://remote-mom.vercel.app/launchpad/#help) and
[download help section](https://remote-mom.vercel.app/launchpad/download/#download-help) are live.

Desktop and 390 × 844 mobile help checks covered anchors/return navigation, disclosures, keyboard use,
and the visible correct mailto. The PDF was unchanged, retains marker `20261024`, and opened as the
current ten-page kit in a new tab. The primary Download link was clicked. Browser policy initially
blocked inspection of the downloads page; no workaround was used. On 2026-11-14, Vanessa replied
“confirmed open” after being asked to check Downloads and open `remote-moms-work-fit-safety-starter-kit.pdf`.
Local save/open is therefore user-confirmed; it was not verified through an automated/browser inspection.

One labeled #19 signup was confirmed in the intended private destination with exactly one matching
synthetic row and all 11 expected columns correctly mapped. Empty-form submission was also blocked
with clear required-fields feedback. See the [initial production test matrix](../Validation_Collection_Setup.md#issue-19-initial-production-test--2026-11-14)
for the precise scope and remaining checks. One synthetic row is retained and its QA campaign must be
excluded from baseline reporting; no customer or app-local data was altered.

Two Python regression tests passed again against the release head. Official Jest was unavailable.
The supplemental assertion harness reported 11 passes and the same two stale-copy failures on both
release head and base; this is not a Jest or Expo pass. #16 and #19 remain open/In Progress; this release
does not clear all Stage 1 gates or activate Stage 2 operations.

## GitHub tracking

Issues in this repository use the `[LAUNCHPAD]` title prefix. Use the issue list as the task backlog and this document as the source-of-truth roadmap. Suggested manual GitHub labels if desired: `launchpad`, `priority: high`, `priority: medium`, `priority: low`, `workstream: marketing`, `workstream: product`, `workstream: operations`, `workstream: analytics`, and `workstream: app`.

## App workstream boundary

The RemoteMom app is still beta and should remain a separate roadmap. Prioritize reminders/notifications, recurrence reliability, first-run/sample-data behavior, multi-child workflows, data backup/sync, and privacy/security review before a paid subscription is considered. Do not imply these app capabilities are complete in Launchpad product marketing.
