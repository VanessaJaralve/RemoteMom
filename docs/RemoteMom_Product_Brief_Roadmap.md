# RemoteMom Product Brief And Roadmap

Last updated: 2026-11-18

## Executive Summary

RemoteMom is a personal productivity app for remote working moms who are managing work, home, parenting, meals, schedules, and family health at the same time.

Its purpose is to reduce the daily mental load by bringing important family and work-life tasks into one simple mobile experience. Instead of jumping between notes, calendars, grocery lists, reminder apps, and memory, a mom can open RemoteMom and quickly see what needs attention today, what has already been handled, and what still needs follow-up.

The current MVP is intentionally focused. It supports one child, keeps data local on the device, and combines core daily-life modules into a Today Dashboard. Future premium features should be added only after validation shows clear demand.

## Product Purpose

RemoteMom exists to help remote working moms feel more organized, less scattered, and more in control of the day.

The app is not trying to become a complex family operating system right away. The first version is designed to answer one practical question:

What does Mom need to remember, handle, or follow up on today?

The core product promise is:

> Manage the day without carrying it all in your head.

## Target User

The first target user is a remote or hybrid working mom who is balancing paid work with household and parenting responsibilities.

The MVP focuses on a mom with one child. This keeps the first version simple and makes it easier to validate the daily habit. Multiple children can become a premium feature later if validation supports it.

## Problem Statement

Remote working moms often manage several disconnected streams of information:

- Work and personal tasks
- Grocery needs and household errands
- Child schedules, routines, and reminders
- Family health and medicine routines
- Notes, texts, calendars, and mental reminders

The pain is not just that these items exist. The real problem is context switching. A mom may know everything is written down somewhere, but still feel scattered because there is no calm daily view that pulls it together.

## Product Objective

The main product objective is to create a calm daily command center for remote working moms.

RemoteMom should help the user:

- See the day clearly
- Capture tasks quickly
- Track groceries without extra friction
- Keep one child's schedule visible
- Track medicine routines for Mom and Child
- Know what is done and what still needs attention
- Build trust before adding cloud sync, notifications, or paid features

## Business Objective

The business objective is to validate whether RemoteMom can become a focused niche app with a free MVP and future premium features.

The first paid-value hypothesis is that users may pay for features that reduce coordination stress across the family day, especially:

- Multiple children
- Partner or caregiver sharing
- Real reminders and medicine alerts
- Calendar sync
- Cloud backup and cross-device sync
- Smart daily summaries

RemoteMom should not compete broadly as another generic productivity app. Its niche is the remote working mom who needs one practical place to manage daily family life while working from home.

## Current MVP Scope

The current MVP includes:

- App shell with bottom navigation
- Universal To-Do List
- Grocery List
- Child Schedule for one child
- Family Health / Medicine Tracker
- Today Dashboard v2
- Shared state across modules
- Local persistence
- Edit and delete flows
- Reminder-ready fields
- Landing and waitlist page
- Validation form connected to Google Sheets
- Waitlist form connected to Google Sheets
- Beta feedback form connected to Google Sheets
- Black Friday / Cyber Monday early-access beta page connected to Google Sheets
- Interview script and validation scorecard
- Plain-language privacy and beta feedback path

## Current Module Summary

### Module 1: App Shell

The app has a mobile-first structure with bottom navigation across the core daily-life areas.

### Module 2: Universal To-Do List

The To-Do List supports tasks across life areas such as work, home, child, errands, and personal needs. Tasks can be added, checked, edited, and reflected in the Today Dashboard.

### Module 3: Grocery List

The Grocery List supports category sorting, checkbox logic, and recurring item flags. It helps the user manage household needs without mixing grocery items into general tasks.

### Module 4: Child Schedule

The Child Schedule supports one child in the MVP. It tracks child-related schedule items with time, recurrence, notes, and reminder-ready fields.

### Module 5: Family Health / Medicine Tracker

The Medicine Tracker supports Mom and Child medicine entries. It includes dosage, daily times, refill threshold display, and mark-as-taken behavior.

### Module 6: Today Dashboard

The Today Dashboard combines To-Dos, Grocery, Child Schedule, and Medicine into one scrollable daily timeline with life-area color tags. Today Dashboard v2 strengthens this as the core daily-value surface.

## Product Principles

RemoteMom should follow these product principles until the roadmap is explicitly changed:

- The Today Dashboard is the central experience.
- Today must be derived from source records, not disconnected duplicate records.
- Completing or editing a Today item should update the original source module.
- The MVP supports one child in the user interface.
- Future data decisions should avoid permanently hard-coding the app around only one child.
- The MVP is local-first and must not imply cloud backup while data is stored only on the device.
- Current MVP features and future premium features must stay clearly separated.
- The interface should feel calm, warm, practical, trustworthy, and easy to scan.
- Medicine tracking is organizational only and must never calculate dosage, recommend dosage, diagnose conditions, or infer medical instructions.
- Medicine names, dosage text, instructions, and schedules must remain user-entered.
- Sensitive user content should not be sent to analytics or application logs.
- Future readiness is useful only when it does not prematurely expose or build roadmap features.

Final product decision rule:

> Does this help a remote working mom manage today with less mental effort?

## Validation Status

RemoteMom currently has a live landing page and connected collection pipeline.

Public landing page:
https://remote-mom.vercel.app/

Validation, waitlist, and beta feedback submissions are collected through Vercel endpoints and forwarded to Google Sheets using Google Apps Script.

Early survey responses are still limited, so they should be treated as directional signals, not proof. The strongest early signal so far is that respondents have two children, and that sharing or multiple-child support may become important premium features.

Reddit pain-point research completed on 2026-08-15 added a stronger qualitative signal around mental load, childcare coverage gaps, grocery and meal planning invisibility, medicine/health routine confidence, and partner/caregiver coordination. The ranked product-opportunity analysis recommends validating a Today Planning Check-In / Calm Command Center before building larger roadmap features. This keeps the next improvement close to the MVP promise and avoids premature Firebase, partner sharing, payments, calendar sync, or medicine alerts.

The current beta learning questions now focus on:

- Whether Today helps the user understand what needs attention today.
- What still remains in the user's head after using RemoteMom.
- Which next improvement testers prefer: sick-day/backup-care checklist, childcare waitlist tracker, better grocery/meal planning, medicine reminders, partner sharing, or multiple children.
- Whether Health feels clear, safe, and non-judgmental.
- Whether testers would open RemoteMom again tomorrow morning.
- Whether one-child MVP is enough for beta.
- Whether sharing, reminders, multiple children, or paid pricing deserve future work.

**Historical September 13 record:** the product brief recorded three early feedback responses and reported that all three testers installed and opened the app. The recorded product signal was not to add full push notifications yet, but to make reminder-ready timing and schedule frequency clearer inside the local MVP. That record described To-Do reminder-ready time presets, structured Child Schedule frequency choices, calmer no-reminder copy, and clearer Today timing/detail display as completed, without Firebase notifications, calendar sync or cloud persistence. Preserve this dated completion history. The [November 18 source assessment below](#current-app-audit) identifies differences in current main; source/build provenance remains unresolved, so the historical statement is not a new current-source or APK verification.

Seasonal early-access validation added on 2026-09-27 creates a Black Friday / Cyber Monday page for
recruiting founding-mom beta interest without collecting payments or implying a full public launch.
Submissions are routed to a separate `Black Friday Early Access` Google Sheet tab using the existing
Vercel endpoint and Apps Script pipeline.

## Documentation Inventory And Alignment

Current documentation reviewed on 2026-08-02:

| Document | Path | Current Coverage | Alignment Notes |
| --- | --- | --- | --- |
| Codex project instructions | `AGENTS.md` | Product principles, MVP boundaries, Today Dashboard rules, persistence, medicine safety, privacy, documentation rules, definition of done | Current operating guide for future work. |
| Product brief and roadmap | `docs/RemoteMom_Product_Brief_Roadmap.md` | Product summary, objectives, MVP modules, validation, roadmap, success metrics, risks, next step | Updated as the primary product source of truth. |
| Project checklist | `docs/RemoteMom_Project_Checklist.md` | Build/change history and next planned work | Was stale for several completed items; updated to match the current completed history. |
| Pricing and tier validation | `docs/Pricing_Tier_Validation.md` | Free vs Premium hypothesis, price points, validation questions, decision rules | Aligned with one-child local MVP and future premium boundaries. |
| Firebase Auth and Firestore plan | `docs/Firebase_Auth_Firestore_Plan.md` | Future cloud sync/auth architecture, data model, migration, rules, privacy | Future-only plan; do not build until validation supports account sync. |
| Firebase App Distribution beta guide | `docs/RemoteMom_Firebase_App_Distribution_Beta_Guide.md` | Android beta distribution through Firebase App Distribution, tester invite flow, release notes, and privacy boundaries | Current beta distribution plan only; does not add Auth, Firestore, analytics, notifications, or cloud sync. |
| Validation collection setup | `docs/Validation_Collection_Setup.md` | Vercel endpoints, webhook environment variable, Google Apps Script, response sheet | Current real collection pipeline for validation and waitlist. |
| Interview script and scorecard | `docs/Validation_Interview_Script_Scorecard.md` | Interview script, scorecard fields, decision thresholds, follow-up templates | Current validation process document. |
| Historical implementation plans | `docs/superpowers/plans/*.md` | Module-by-module build plans for app shell, To-Dos, Grocery, Kid Schedule, Medicine, Today, shared state, persistence, edit/delete | Useful change history, not the current roadmap source. |
| Local persistence design | `docs/superpowers/specs/2026-07-26-local-persistence-design.md` | Local AsyncStorage persistence design | Useful technical design history. |

Documentation gaps:

- There is no separate standalone decision log file. Meaningful decisions currently live inside the product brief, pricing plan, Firebase plan, checklist, and historical plans.
- There is no separate standalone data-model document beyond the TypeScript model files and Firebase plan.
- There is no standalone change-history file beyond the project checklist and historical plan documents.

Resolved conflicts:

- `docs/RemoteMom_Project_Checklist.md` previously listed Visual QA, delete confirmations, Today Dashboard v2, reminder-ready fields, landing page, pricing validation, and Firebase planning as `Not Started`, even though later commits and the Google Sheet tracker showed them as completed. Resolution: treat the later dated commits and Google Sheet tracker as the latest approved status, and update the Markdown checklist.
- Older implementation plans describe Today as initially read-only and sample-data based. Resolution: preserve those files as historical build plans, while this product brief reflects the current shared-state Today Dashboard.
- The one-child MVP is current, but validation responses suggest moms with two children may be important. Resolution: keep one-child UI as MVP, preserve future readiness in architecture, and do not expose multiple-child features yet.

## Current App Audit

### November 18, 2026 readiness assessment — issue #17

**Assessment complete for eight of nine criteria; follow-up disposition remains open. Recommendation: improve and reconcile the existing beta, then continue research before considering app monetization.** This is a read-only assessment under [#17](https://github.com/VanessaJaralve/RemoteMom/issues/17). It does not authorize new features, subscriptions, entitlement work, cloud services, recruitment, invitations or public launch. The one-child, local-first MVP remains the scope. Launchpad's free-kit and existing-PDF workstreams retain their separate accepted checks and gates.

**Evidence baseline:** main commit [2d70752](https://github.com/VanessaJaralve/RemoteMom/commit/2d70752e6884b378b4c158be26b20080bee3edc7), committed November 17, 2026 at 13:57:21 UTC. The review read the current app entry point, all source modules/models, configuration, nine relevant existing test files and the existing project documents. Retrieved code/test files were checked against their Git blob hashes. The findings below are source-backed observations and explicitly identified control-flow inferences. No app was installed or run, no Jest/type-check/build pass is claimed, no Firebase console or private response rows were inspected, and no personal app data was read or changed.

#### Current implementation and limits

| Area | Source-backed finding | Practical limit or remaining evidence |
|---|---|---|
| App scope and Today integration | [App.tsx](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/App.tsx#L7-L83) imports and mounts the reviewed provider and Today, Health, Kid, Grocery, To-Dos and More screens. [TodayScreen](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/screens/TodayScreen.tsx#L71-L229) derives items from shared source arrays and calls task, grocery and individual-dose actions. [AppState](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/state/AppState.tsx#L169-L350) preserves source-backed completion; medicine completion remains a separate per-date/per-time log. | These are current-code findings, not a new device usability or reliability pass. The historical source-aware completion and per-dose work remains completed; it is not reopened. |
| Reminder labels and recurrence | [Reminder formatting](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/utils/reminders.ts#L1-L12) only returns labels. Current [To-Dos inputs](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/screens/TodosScreen.tsx#L43-L80) and [task actions](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/state/AppState.tsx#L28-L34) expose title, life area and due date; creation sets reminderEnabled to false. [Kid](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/screens/KidScreen.tsx#L60-L96) stores a recurring flag and free-text rule. [Today](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/screens/TodayScreen.tsx#L105-L170) includes every schedule record and unchecked recurring groceries; it does not expand weekday recurrence or regenerate checked groceries. The Task model has no recurring-task rule. | Sample/persisted reminder metadata is display data, not scheduled notifications. No notification, calendar-sync or Firebase app SDK is present in the reviewed package/source. Current source does not substantiate the recorded September reminder-time presets, structured frequency choices or Today reminder/recurrence display. Source/build provenance must be reconciled; do not infer a regression or assume a distributed APK equals main. |
| First run and sample records | [AppState](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/state/AppState.tsx#L99-L159) initially renders sample collections, then restores saved data. [Sample data](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/data/sampleData.ts#L16-L113) includes tasks, recurring schedules, groceries and example medicine entries. App/Today have no first-run gate or explicit sample-mode label. Valid saved empty arrays are accepted. Existing empty-state components are present. | The current source can present examples as ordinary actionable items, including health entries and reminder-ready labels. This warrants a bounded first-run/build check; no actual reader confusion is claimed. Do not reset an existing user's data or invent an onboarding feature to complete this review. |
| Local persistence and recovery | [Persistence](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/state/persistence.ts#L11-L208) stores schema version 2 under the existing local key, normalizes legacy/schema-1 records, validates items and supplies the default child. Missing storage, malformed/unsupported data and read errors all return null. The [provider](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/state/AppState.tsx#L108-L159) then sets hydration complete and saves its current state. Write errors are swallowed. | **Source inference:** after an unsuccessful restore or unsupported payload, a successful subsequent write can replace the original key with sample state. This is not observed user data loss, but the control flow does not preserve the raw payload or distinguish failure from a new install. There is no user-facing save-failure/recovery path, export or cloud backup in the reviewed source. Preserve current valid/empty/legacy data in any separately scoped fix. |
| Today timing | [Today medicine items](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/screens/TodayScreen.tsx#L78-L103) label every dose lacking today's log as overdue, without comparing its scheduled time with the clock. Its [memoized timeline](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/screens/TodayScreen.tsx#L191-L205) depends on source arrays, not a day/clock or foreground-refresh signal. [Date helpers](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/utils/dateTime.ts#L35-L99) and [dose lookup](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/utils/medicineDoseLogs.ts#L28-L42) do use the local date when called. | Future scheduled doses can receive an overdue label by construction; an unchanged mounted timeline has no explicit midnight-refresh trigger. Reproduce those bounded display cases on the identified beta build before implementation. This concerns accurate organizational labels, not clinical advice or changes to entered medicine instructions. |
| Child/family scope | The source keeps a stable default child entity. New Kid records use that child; Child medicine entries can carry its ID. There is no exposed child selector, shared-family account or task-assignment service. | Architectural preparation does not validate multi-child/shared-family demand or authorize those features. Keep one-child UI and local use. |
| Privacy and permissions | [More](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/screens/MoreScreen.tsx#L6-L82) states that app entries stay local, are not cloud-backed and provide no medical advice. Its feedback action opens an email subject without app-entry attachments and has a failure message. Static search found no app-entry network upload or analytics/logging call in the reviewed app source. The [Launchpad form](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/landing/launchpad/index.html#L227-L249) expressly excludes marketing/app-beta enrollment; [beta interest](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/landing/beta/index.html#L204-L230) is separate. | This is a source-boundary assessment, not a security certification, OS-backup audit or live permission test. Survey/feedback submissions remain a separate collection population; Starter Kit requests do not prove app installation, use or permission for app marketing. |

#### Existing beta, build and paid-value evidence

The earlier [Validation Status](#validation-status) records a September 13 review of three beta responses, all reported as installed/opened, and the earlier audit records Vanessa's APK download plus installation difficulty. Preserve those dated aggregates and completed preparation. The current review did not re-read the underlying private responses or verify unique users, the tested build, current installation counts, repeat use or retention.

The [Firebase distribution guide](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/docs/RemoteMom_Firebase_App_Distribution_Beta_Guide.md#L35-L45) calls version 0.1.1 its latest build, while the [project checklist](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/docs/RemoteMom_Project_Checklist.md#L54-L64) records a later 0.1.2 build as ready for Firebase upload. Those records do not establish which binary is currently distributed or which contains the documented September controls. Firebase App Distribution is a distribution channel; it is not app-data sync or backup. Reconcile actual release/build/source evidence before treating source or old device findings as current-beta behavior.

The early two-child/sharing signal remains directional: the reviewed records do not supply a denominator, segment comparison or repeated paid-priority result. The [pricing plan](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/docs/Pricing_Tier_Validation.md#L167-L191) and [interview scorecard](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/docs/Validation_Interview_Script_Scorecard.md#L81-L109) define prospective thresholds, not achieved results. [Beta questions](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/landing/beta-feedback/index.html#L139-L155) about returning tomorrow or what would make the app worth paying for later measure stated intent, not observed retention or purchase. No app-specific paid-value threshold or repeat-use outcome is established by the reviewed repository evidence. July competitor-price references remain dated historical research and were not refreshed.

The current [checklist](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/docs/RemoteMom_Project_Checklist.md#L100-L123) still leaves the relevant app research, metrics, review and premium-validation rows unstarted. Do not convert completed survey preparation or secondary research into completed primary-user study work. With no reader available now, preserve these evidence gaps; another invitation template or speculative feature draft would not resolve them.

#### Prioritized bounded recommendations

1. **Protect local data first.** Scope a reproduction and recovery fix for failed reads, invalid/unsupported payloads and silent write failures. Preserve a valid prior payload and valid empty/legacy states; avoid silently replacing real data with examples. The evidence above justifies a focused existing-MVP reliability follow-up, not cloud sync.
2. **Reconcile source, build and documentation.** Identify the currently distributed APK and its source/build evidence, then check the already-recorded reminder, frequency and date/time controls against that artifact. Keep historical completed work intact; correct active capability claims only from verified provenance. No new beta release or outreach is implied.
3. **Verify Today labels at time boundaries.** Reproduce a future scheduled dose and an unchanged app crossing local midnight/returning to foreground; define a narrowly scoped correction for inaccurate labels or stale day state. Preserve separate dose logs and user-entered instructions. Do not add alerts or a recurrence engine.
4. **Continue research when participants are available.** Revisit actual return use, daily benefit, multi-child/shared-family priorities and willingness to pay for a shared outcome. Current evidence does not justify subscriptions, entitlements, new premium features or public app launch.

The source review also records sample-mode clarity and unlabelled example entries as a bounded first-run concern. Combine it with source/build verification rather than expanding the app. These are recommendations; implementation follow-up approval and issue references remain the ninth #17 item.

#### Checks actually performed and acceptance mapping

The reviewer inspected existing tests for persistence, reminder labels, Today actions, child identity, shared state, empty states, Health, More and date helpers. The persistence tests assert fallback to samples for malformed/unsupported data, but do not establish preservation of the original raw payload after that fallback. Reminder tests cover seeded metadata/labels, not creation of the documented missing preset controls. The reviewed Today tests cover source completion and future task priority, not the future-dose/midnight cases above. **Test-file inspection is not test execution.** No new tests, app build, simulator, physical-device or live-cloud checks were run in this assessment.

| Original #17 criterion | Assessment outcome |
|---|---|
| 1. Current scope and existing beta evidence | Reviewed; implemented current source, historical reported evidence and future requests are separated above. |
| 2. Reminders/notifications and recurring tasks | Assessed, including display-only metadata, recurrence limits and current-source/documentation mismatch. |
| 3. First-run/sample data and daily planning | Assessed from the mounted provider/screens; sample visibility, source actions and timing limits recorded. Physical-device behavior remains untested. |
| 4. Multi-child/shared-family demand | Existing directional evidence reviewed; insufficient validated demand recorded without changing MVP scope. |
| 5. Persistence, backup/sync, privacy/security | Assessed from source and existing plans; local storage/recovery risks and the lack of verified cloud backup are explicit. |
| 6. Willingness to use/pay | Existing evidence and thresholds reviewed; retention and paid-value outcomes remain unverified, so no subscription proposal is made. |
| 7. App-beta and Launchpad permission separation | Preserved in the reviewed separate forms and this recommendation; no enrollment or contact performed. |
| 8. Prioritized readiness report | Recorded in this existing product document with dated evidence, limits and the improve-beta/continue-research recommendation. |
| 9. Separately scoped approved follow-ups | **Open.** Add actual issue references after follow-up disposition. This assessment does not create or approve an implementation epic. |

Keep #17 **In Progress, 8/9** once this assessment is recorded. Its assessment is complete within the stated read-only scope; unresolved implementation work and human evidence do not become passed runtime tests. This does not reopen completed Launchpad #4/#13/#16 or clear any Launchpad reader/device, Book 2 customer-file or promotion gate.

#### Pinned source identity

All links in this assessment pin the reviewed commit. The following blob identities make the critical code findings independently traceable; the project checklist remains the existing change-history destination.

| File | Git blob SHA |
|---|---|
| [App.tsx](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/App.tsx) | 4cf216f33182cd97857cd0c429924238236135bf |
| [src/state/AppState.tsx](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/state/AppState.tsx) | aadb4a0befb18733b1d54b2fd0e6562eb88fb697 |
| [src/state/persistence.ts](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/state/persistence.ts) | 7b7f2b82e1853a5593a2d394f3a23aec34ceb824 |
| [src/screens/TodosScreen.tsx](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/screens/TodosScreen.tsx) | 3d9312e0d0fe3a41a39ade07a16af9b9e73fa0a5 |
| [src/screens/KidScreen.tsx](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/screens/KidScreen.tsx) | 94e3aa0ff4e8c6b53465897a7a60e7c6992b531a |
| [src/screens/TodayScreen.tsx](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/screens/TodayScreen.tsx) | ce6ac781dc8c4a2a1757b57c6064df407d63e6d2 |
| [src/data/sampleData.ts](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/data/sampleData.ts) | 24ac3c538fd208d2bfbc74277d4104f3569a9767 |
| [src/utils/reminders.ts](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/utils/reminders.ts) | 05f0b7b72547bb3db90e3bc3adca8c54d5734f8b |
| [src/utils/dateTime.ts](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/utils/dateTime.ts) | e335f9c83cb17378758716c945d34c828a599bc9 |
| [src/utils/medicineDoseLogs.ts](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/utils/medicineDoseLogs.ts) | 43131e224eb42050e34c69ead5fbdefcdbf316d2 |
| [src/screens/MoreScreen.tsx](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/src/screens/MoreScreen.tsx) | 82b7d22d539fb3511c25b15c1476913117e3b342 |
| [package.json](https://github.com/VanessaJaralve/RemoteMom/blob/2d70752e6884b378b4c158be26b20080bee3edc7/package.json) | df7a7b60c914dd670afd361a64cb8a1b86788683 |

### Earlier audit and completed work — historical record

The following audit, later August/September additions and completed statuses are preserved. Where their active-behavior wording differs from the pinned November 18 source findings above, source/build identity is unresolved; neither a regression nor the distributed APK's contents is inferred.

Audit date: 2026-08-02

Overall status: RemoteMom is a functional local-first MVP with shared state, local persistence, and a Today Dashboard that derives from source module records. Source-aware Today actions now let users complete common items from the central dashboard. Medicine schedules are now separate from per-day, per-time completion logs. Shared date/time utilities now support common time parsing, local date keys, due-date classification, Kid schedule sorting, and safer Today priority behavior. Local persistence now includes schema versioning, legacy normalization, unsupported-version fallback, item-level validation, and an internal default child entity. Beta trust basics now include a plain-language in-app privacy note, medicine-safety copy, a feedback email path with crash fallback, landing-page privacy/feedback copy, calm empty states across core module screens, point-of-entry medicine-safety copy in Health, and a focused mobile spacing and tap-target pass across core modules. Android Expo Go smoke testing was completed on 2026-08-09 and found several input-control improvements. Calendar-style To-Do date picker controls with fixed week rows, Child Schedule 12-hour alarm-style start/end time controls, medicine person/frequency shortcuts, grocery category selection controls, To-Do reminder-ready time presets, structured Child Schedule frequency choices, the first-pass RemoteMom app identity polish, beta screenshot assets, and a no-budget Expo Go beta guide are now complete. Android APK sideload beta configuration, tester guidance, EAS APK generation, a separate `/beta/` Android tester recruitment page, a separate `/beta-feedback/` tester survey page, and a distribution-only Firebase App Distribution setup guide are now complete; the original survey and waitlist page remains available at `/`. The Android APK has been uploaded to Firebase App Distribution, Vanessa has downloaded it successfully, and the Firebase tester install instructions have been clarified after the first beta feedback reported that installation was hard. The remaining gaps are recruiting trusted beta testers, reviewing install/download status with beta feedback, and broader beta-launch readiness.

| Area | Current Implementation | What Works | Gaps / Risks | Priority |
| --- | --- | --- | --- | --- |
| Universal To-Do List | `TodosScreen` uses shared `tasks` from `AppStateProvider`; supports add, edit, delete confirmation, done toggle, life-area tags, optional due date, calendar-style date picker controls, and reminder-ready time presets | Tasks update Today through shared state; stable ids exist; persistence saves changes; Today/Tomorrow/month-picker controls save parseable local date keys; selected reminder-ready times save to the existing Task model and appear in Today; cleared task lists show supportive empty-state copy | Generated ids use `Date.now()` only; reminder times are local labels and do not trigger notifications yet | Medium |
| Grocery List | `GroceryScreen` uses shared `groceryItems`; supports add, edit, delete confirmation, checked toggle, category sorting, recurring flag, category selection controls, and custom category typing | Category grouping and checked logic work; common category controls fill the existing category field; recurring unchecked items feed Today as individual actionable source records; cleared grocery lists show supportive empty-state copy | Custom category typing remains free text; no aisle library or store-specific ordering yet | Medium |
| One-child schedule | `KidScreen` uses shared `scheduleItems`; supports add, edit, delete confirmation, recurring flag, structured frequency choices, notes, quick start/end time presets, and 12-hour alarm-style start/end time controls | Schedule items feed Today and persist locally; UI clearly states one-child MVP; controls save standard 12-hour time labels and recurrence strings; start-time sorting uses shared parsed-time logic; child schedule records carry the internal default `childId`; Today shows recurrence details; cleared schedule lists show supportive empty-state copy | Recurrence is descriptive only and does not yet expand or hide items by weekday | Medium |
| Family Health / Medicine Tracker | `HealthScreen` uses shared `medicines` plus local `medicineDoseLogs`; supports Mom/Child entries, dosage, times, refill threshold, per-time mark taken, edit/delete, person selection, and user-selected frequency shortcuts | Medicine entries feed Today; user-entered dosage is preserved; no dosage advice is generated; frequency shortcuts only fill the existing daily times field; marking one scheduled dose taken does not change the permanent medicine schedule or automatically complete other daily times; Child medicine records carry the internal default `childId`; Health and More both state that RemoteMom does not provide medical advice | Dose logs are local-only; no refill inventory math; date boundary depends on current local-date helper | Medium |
| Today Dashboard | `TodayScreen` builds timeline from shared tasks, grocery items, schedule items, medicines, and dose logs | Derived from source arrays; updates when source records change; central daily view exists; RemoteMom identity and mental-load promise are visible on the first screen; life-area tags and priority summary work; users can mark tasks done, check grocery items, and mark individual medicine doses taken from Today; parseable future due dates no longer become urgent; To-Do reminder-ready times drive timeline time when selected; schedule recurrence details appear in the timeline; an all-clear empty state appears when nothing needs attention | Recurrence is not expanded or filtered by weekday yet | High |
| Local persistence | `AppStateProvider` restores/saves one versioned AsyncStorage payload via `src/state/persistence.ts` | Local state survives reloads in tests; legacy no-version and schema v1 payloads migrate in memory; missing dose logs normalize safely; missing child collection normalizes to the default child; malformed collections or unsupported future schema versions fall back to sample data; malformed records inside valid arrays are dropped; no cloud claims in app code | Write failures are still silent; there is no user-facing recovery UI for corrupted storage; storage is local-only and not backed up | Medium |
| Landing, waitlist, beta feedback, and seasonal early-access pages | Static landing page submits validation and waitlist forms to Vercel endpoints, the separate `/beta-feedback/` page submits tester feedback, and the separate `/black-friday/` page collects Black Friday / Cyber Monday early-access beta interest through the same real collection pipeline; Apps Script writes to Google Sheets | Public collection works; local browser backup exists for endpoint failure; copy distinguishes Free MVP, beta, and future premium; page now includes plain-language local-first privacy, medicine-safety, and beta feedback copy; tester feedback and seasonal early-access interest are collected without public APK links or payment collection | Raw payloads are stored in the sheet; fallback copy can confuse public users if endpoint fails; no spam protection | Medium |

## Today Dashboard Integration Findings

Current strengths:

- Today derives from `tasks`, `groceryItems`, `scheduleItems`, and `medicines` in `AppStateProvider`.
- Adding, editing, deleting, checking, or marking items in source modules updates Today because the same shared state arrays are used.
- Completed tasks are filtered out of Today.
- Checked recurring grocery items are removed from Today.
- Marking a task done, checking a grocery item, or marking an individual medicine dose taken from Today calls the existing source-module shared-state action.

Completed integration improvements and the earlier remaining ID note (historical):

- Medicine actions from Today create or update a local `MedicineDoseLog` for the specific medicine, local date, and scheduled time. The permanent `Medicine` schedule is not changed.
- Today's timeline item ids are still not fully normalized across sources. Tasks, schedule items, and grocery items use source ids; medicine uses `medicine.id + time` so multiple daily times can render separately.
- Date handling now has a shared utility for time parsing, local date keys, sort fallback minutes, and parseable due-date classification.
- Medicine completion is now per scheduled time and per local date through the same shared local date key.

## Critical Data-Loss And Medicine-Safety Risks

Critical:

- No current unresolved medicine-completion data model issue is classified as Critical after the per-dose local completion log change. Point-of-entry medicine-safety copy is now visible in Health before beta.
- Source-aware Today actions are now implemented for tasks, grocery items, and individual medicine doses.

High:

- Local persistence now has schema versioning, safer validation, and default-child migration. The remaining persistence risk is that write failures and unrecoverable corrupted storage do not yet have user-facing recovery UI.
- Date and time parsing is centralized for the current MVP behavior. The remaining date risk is that user inputs are still free text and recurrence is not expanded by calendar date.
- The app now has an internal default child entity/id without exposing multiple-child UI. Future multi-child work must still remain premium-validation-driven.

Privacy:

- No app analytics or logging of sensitive content was found.
- The validation/waitlist pipeline stores raw payloads in Vanessa's Google Sheet. The app and landing page now disclose this in plain language for beta readiness.

## Prioritized Improvement Backlog

| Priority | Improvement | Rationale |
| --- | --- | --- |
| High | Scope local-state recovery and preservation after failed/unsupported restore | November 18 source review identifies a possible sample-state overwrite path and silent save failures. Reproduce safely before a bounded fix; preserve existing data. |
| High | Reconcile the current source, documented controls and distributed beta build | Historical completed controls are not all present in pinned main; 0.1.1/0.1.2 distribution records need an evidence-based reconciliation. |
| High | Verify Today future-dose labels and date-refresh behavior | Current source labels every unlogged dose overdue and has no explicit clock/foreground timeline refresh. Reproduce organizational display cases without adding alerts or clinical logic. |
| High | Validate Today Planning Check-In / Calm Command Center with beta testers | Reddit pain-point ranking shows the strongest MVP-aligned opportunity is helping moms know what needs attention today without carrying everything mentally. |
| Medium | Validate sick-day and backup-care follow-up needs through beta questions | Reddit evidence shows frequent daycare illness and care gaps, but this should be tested before adding a new module. |
| Medium | Validate grocery/meal planning visibility in Today | Grocery planning appears as invisible mental load; first confirm whether the existing Grocery-to-Today flow is enough. |
| Medium | Split reusable form/card/action UI patterns after behavior stabilizes | Reduces duplication without a large premature refactor. |
| Later | Add analytics or product metrics only after privacy rules are written | Useful for beta learning, but sensitive content must be excluded. |

## Recommended Order Of Implementation

Completed: Today source-aware completion actions.

Completed: Medicine daily completion model and UI adjustment.

Completed: Shared date/time utility for Today and schedules.

Completed: Persistence schema versioning and migration guardrails.

Completed: Internal default child entity/id.

Completed: Privacy policy and beta feedback path.

Completed: Calm empty states across core module screens.

Completed: Medicine safety copy directly in Health.

Completed: Mobile spacing and tap-target review.

Completed: Fix Email Feedback action crash.

Completed: Structured date/time and medicine form controls.

Completed: Grocery category selection.

Completed: App identity and first impression polish.

Completed: Prepare app screenshots.

Completed: Prepare no-budget Expo Go beta setup.

Completed: Create beta invitation message.

Completed: Prepare Android APK sideload beta package.

Completed: Create separate Android beta recruitment page.

Completed: Create separate beta feedback survey page.

Completed: Prepare Firebase App Distribution beta setup.

Completed: Clarify reminder-ready time and schedule frequency controls from early beta feedback.

**Current November 18 next step:** disposition the three bounded readiness follow-ups above. No new reader is available; recruitment and repeat-use research remain pending. The assessment does not authorize implementation or distribution changes.

The following earlier recruitment recommendation is retained as planning history, not a new invitation instruction:

Previously recommended: invite 5 to 10 trusted Android beta testers through Firebase App Distribution before building larger roadmap features.

1. Invite 5 to 10 trusted Android testers through Firebase App Distribution.
2. Send each tester the clarified install message and ask them to use the same Google account for the invite and App Tester.
3. Ask testers to start with Today, then try To-Dos, Grocery, Child Schedule, and Medicine.
4. Send testers to the private beta feedback page after they use the app.
5. Track invite acceptance, build downloads, and feedback responses.
6. Review repeated beta feedback before changing the MVP.

Single most important next mobile-app task:

Invite trusted Android testers through Firebase App Distribution, monitor install friction, and review feedback before changing the MVP.

Active audience-building focus:

1. Use Remote Mom's Launchpad as the primary content and lead-generation funnel while the mobile beta waits for additional testers.
2. Serve two equal audience lanes through Vanessa's existing Facebook and Instagram accounts: mothers seeking remote work and mothers already working remotely.
3. Track each Launchpad lead's current stage, challenge, platform, and campaign source without collecting sensitive family details.
4. Run a 30-day two-lane content validation cycle after confirming the page, direct download, PDF, and Google Sheet routing work end to end.
5. Keep RemoteMoms beta recruitment as a secondary path for leads who voluntarily express a daily work-family organization need.

## Current Strategic Recommendation

**November 18, 2026:** improve and reconcile the existing beta, then continue research before considering monetization. Prioritize local-data preservation, source/build identity and accurate Today labels within the one-child, local-first MVP. Keep known limitations visible and preserve completed preparation.

The historical beta and survey records do not establish current-build reliability, repeated use or a paid-value threshold. Keep subscriptions, entitlements, cloud sync, shared-family access, multiple-child UI, real notifications and public launch deferred. No new recruitment, release or implementation is authorized by this assessment.

The earlier Expo Go preparation remains completed history. Firebase App Distribution is the later documented distribution approach, but the current distributed binary still needs reconciliation; do not describe either channel as a new tested release.

## Roadmap

### Phase 1: MVP Foundation

Status: Completed

Objective: Build the local-first app foundation and prove the core daily workflow.

Completed work:

- App shell
- To-Do List
- Grocery List
- Child Schedule
- Medicine Tracker
- Today Dashboard
- Shared state
- Local persistence
- Edit and delete flows
- Reminder-ready fields

### Phase 2: Validation Foundation

Status: Completed

Objective: Create a way to collect real demand signals before building cloud infrastructure or payments.

Completed work:

- Landing page
- Waitlist section
- Validation survey
- Google Sheets collection pipeline
- Waitlist tab
- Pricing and tier validation plan
- Interview script
- Validation scorecard

### Phase 3: Public Beta Readiness

Status: Recommended Next

Objective: Prepare the app to be tested by people outside the immediate friend group.

Recommended work:

- Completed: Add in-app feedback link or form
- Completed: Add basic privacy policy
- Completed: Add medicine safety copy directly in Health
- Completed: Review mobile UI spacing and tap targets
- Completed: Polish app name, icon, splash, and first impression
- Completed: Prepare app screenshots
- Completed: Prepare no-budget Expo Go beta setup
- Completed: Create a short beta invitation message
- Invite 5 trusted Expo Go beta testers

Success criteria:

- A new user can understand the app quickly
- A user can send feedback without messaging Vanessa directly
- The app feels trustworthy enough for family schedule and health tracking
- The beta version can be shared with a small group

### Phase 4: Beta Learning

Status: In Progress

Objective: Learn whether users return to the app and which pain is strongest.

Recommended work:

- Completed: Build and globally position the Launchpad starter-kit funnel
- Completed: Polish the funnel and Starter Kit for two equal audience lanes
- Publish the two-lane Facebook and Instagram content cycle through the existing accounts
- Track Launchpad signups by current stage, challenge, platform, and campaign
- Invite 10 to 30 target users
- Track installs, waitlist signups, and feedback
- Ask users what they opened first
- Ask what they stopped using or ignored
- Capture the strongest repeated pain
- Review feedback weekly

Success criteria:

- Users describe a real daily problem in their own words
- Users ask to keep using the app
- Users request one or two repeated premium features
- At least a few users express willingness to pay for the same outcome

### Phase 5: Cloud Sync Planning And Build

Status: Future

Objective: Add account-based sync only after validation supports it.

Recommended work:

- Review Firebase Auth and Firestore plan
- Add Firebase configuration
- Add email/password authentication
- Keep signed-out local mode working
- Add repository boundary between local and cloud data
- Add Firestore user-owned collections
- Add local-to-cloud migration
- Add security rules and tests

Success criteria:

- Signed-out local mode still works
- Signed-in users can sync across sessions
- One user cannot access another user's data
- Local data can migrate safely into a cloud account

### Phase 6: Premium Feature Validation

Status: Future

Objective: Build only the premium features that users repeatedly request.

Candidate premium features:

- Multiple children
- Partner or caregiver sharing
- Real reminders
- Medicine alerts
- Calendar sync
- Cloud backup
- Weekly family view

Success criteria:

- One premium feature cluster is clearly stronger than the others
- Users can explain why they would pay for it
- The feature supports RemoteMom's niche rather than turning it into a generic organizer

### Phase 7: Monetization And Launch

Status: Future

Objective: Prepare the app for sustainable public launch.

Recommended work:

- Choose pricing based on validation
- Add premium gates only after paid-value proof
- Prepare App Store and Google Play listing assets
- Add support contact and privacy policy
- Add analytics or lightweight product metrics
- Launch to a focused niche audience before broad marketing

Initial pricing hypotheses:

- Free MVP for one child and local use
- Premium at around $39 per year if daily value is proven
- Founding member annual offer around $29 per year if early users show purchase intent

## Success Metrics

Early validation metrics:

- 10 or more waitlist or validation responses
- 5 or more users describe a strong daily pain
- 3 or more users say they would pay around $39 per year
- Multiple users ask for the same premium feature
- Users agree to try a prototype or beta version

Beta metrics:

- Users open the app beyond the first day
- Users add their own tasks, groceries, schedule items, or medicine entries
- Users use Today Dashboard as the starting point
- Users submit feedback without being chased
- Users can describe what RemoteMom replaced or improved

## Risks And Open Questions

Key risks:

- Users may like the idea but not use it daily
- Friends may be supportive but not representative of paying users
- Multiple-child and sharing needs may be stronger than the one-child MVP
- Health and medicine tracking requires high trust
- A full app store launch may create support expectations too early

Open questions:

- Is the strongest niche remote working moms, moms with two or more children, or parents managing schedules with another adult?
- Is the Today Dashboard the core habit?
- Is sharing more valuable than reminders?
- Will users pay for cloud sync, or do they see it as expected basic functionality?
- What is the smallest beta version that feels trustworthy?

## Recommended Immediate Next Step

Record disposition and separately scoped references for the November 18 readiness findings in #17 before treating that assessment as closed. Preserve its eight completed review criteria and the explicit lack of new runtime or demand evidence.

The next implementation proposal should address a reproduced existing-MVP reliability or provenance gap from the prioritized backlog. Do not repeat completed feedback/privacy/assets preparation or start speculative premium work while readers are unavailable. The current assessment does not schedule recruitment or change Launchpad's independent acceptance gates.
