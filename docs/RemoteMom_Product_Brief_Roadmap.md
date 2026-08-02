# RemoteMom Product Brief And Roadmap

Last updated: 2026-08-02

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
- Interview script and validation scorecard

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

Validation and waitlist submissions are collected through Vercel endpoints and forwarded to Google Sheets using Google Apps Script.

Early survey responses are still limited, so they should be treated as directional signals, not proof. The strongest early signal so far is that respondents have two children, and that sharing or multiple-child support may become important premium features.

## Documentation Inventory And Alignment

Current documentation reviewed on 2026-08-02:

| Document | Path | Current Coverage | Alignment Notes |
| --- | --- | --- | --- |
| Codex project instructions | `AGENTS.md` | Product principles, MVP boundaries, Today Dashboard rules, persistence, medicine safety, privacy, documentation rules, definition of done | Current operating guide for future work. |
| Product brief and roadmap | `docs/RemoteMom_Product_Brief_Roadmap.md` | Product summary, objectives, MVP modules, validation, roadmap, success metrics, risks, next step | Updated as the primary product source of truth. |
| Project checklist | `docs/RemoteMom_Project_Checklist.md` | Build/change history and next planned work | Was stale for several completed items; updated to match the current completed history. |
| Pricing and tier validation | `docs/Pricing_Tier_Validation.md` | Free vs Premium hypothesis, price points, validation questions, decision rules | Aligned with one-child local MVP and future premium boundaries. |
| Firebase Auth and Firestore plan | `docs/Firebase_Auth_Firestore_Plan.md` | Future cloud sync/auth architecture, data model, migration, rules, privacy | Future-only plan; do not build until validation supports account sync. |
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

Audit date: 2026-08-02

Overall status: RemoteMom is a functional local-first MVP with shared state, local persistence, and a Today Dashboard that derives from source module records. Source-aware Today actions now let users complete common items from the central dashboard. Medicine schedules are now separate from per-day, per-time completion logs. Shared date/time utilities now support common time parsing, local date keys, due-date classification, Kid schedule sorting, and safer Today priority behavior. The remaining gaps are reliability and trust gaps around persistence versioning, child modeling, empty/error states, and privacy/policy readiness for beta.

| Area | Current Implementation | What Works | Gaps / Risks | Priority |
| --- | --- | --- | --- | --- |
| Universal To-Do List | `TodosScreen` uses shared `tasks` from `AppStateProvider`; supports add, edit, delete confirmation, done toggle, life-area tags, optional due date, reminder-ready labels | Tasks update Today through shared state; stable ids exist; persistence saves changes; parseable date-only due dates are classified through shared local date logic | Due date input is still free text; no empty state; generated ids use `Date.now()` only | High |
| Grocery List | `GroceryScreen` uses shared `groceryItems`; supports add, edit, delete confirmation, checked toggle, category sorting, recurring flag | Category grouping and checked logic work; recurring unchecked items feed Today as individual actionable source records | No empty state; category is free text | Medium |
| One-child schedule | `KidScreen` uses shared `scheduleItems`; supports add, edit, delete confirmation, recurring flag, recurrence text, notes | Schedule items feed Today and persist locally; UI clearly states one-child MVP; start-time sorting uses shared parsed-time logic | No child entity or `childId`; start/end times are still free text; recurrence is descriptive only | High |
| Family Health / Medicine Tracker | `HealthScreen` uses shared `medicines` plus local `medicineDoseLogs`; supports Mom/Child entries, dosage, times, refill threshold, per-time mark taken, edit/delete | Medicine entries feed Today; user-entered dosage is preserved; no dosage advice is generated; marking one scheduled dose taken does not change the permanent medicine schedule or automatically complete other daily times | No medical disclaimer in UI; dose logs are local-only; no refill inventory math; date boundary depends on current local-date helper | High |
| Today Dashboard | `TodayScreen` builds timeline from shared tasks, grocery items, schedule items, medicines, and dose logs | Derived from source arrays; updates when source records change; central daily view exists; life-area tags and priority summary work; users can mark tasks done, check grocery items, and mark individual medicine doses taken from Today; parseable future due dates no longer become urgent | Today still uses simple free-text fallbacks; due-date input has no picker or validation; recurrence is not expanded by date | High |
| Local persistence | `AppStateProvider` restores/saves one AsyncStorage payload via `src/state/persistence.ts` | Local state survives reloads in tests; invalid storage falls back safely to sample data; no cloud claims in app code | No schema version field or migrations; validation only checks arrays, not item shape; fallback to sample data after corrupt storage could hide data loss; write failures are silent | High |
| Landing and waitlist page | Static landing page submits validation and waitlist forms to Vercel endpoints, then Apps Script writes to Google Sheets | Public collection works; local browser backup exists for endpoint failure; copy distinguishes Free MVP and future premium | No privacy policy yet; raw payloads are stored in the sheet; fallback copy can confuse public users if endpoint fails; no spam protection | High |

## Today Dashboard Integration Findings

Current strengths:

- Today derives from `tasks`, `groceryItems`, `scheduleItems`, and `medicines` in `AppStateProvider`.
- Adding, editing, deleting, checking, or marking items in source modules updates Today because the same shared state arrays are used.
- Completed tasks are filtered out of Today.
- Checked recurring grocery items are removed from Today.
- Marking a task done, checking a grocery item, or marking an individual medicine dose taken from Today calls the existing source-module shared-state action.

Current gaps:

- Medicine actions from Today create or update a local `MedicineDoseLog` for the specific medicine, local date, and scheduled time. The permanent `Medicine` schedule is not changed.
- Today's timeline item ids are still not fully normalized across sources. Tasks, schedule items, and grocery items use source ids; medicine uses `medicine.id + time` so multiple daily times can render separately.
- Date handling now has a shared utility for time parsing, local date keys, sort fallback minutes, and parseable due-date classification.
- Medicine completion is now per scheduled time and per local date through the same shared local date key.

## Critical Data-Loss And Medicine-Safety Risks

Critical:

- No current unresolved medicine-completion data model issue is classified as Critical after the per-dose local completion log change. The remaining medicine safety work is still High priority before broader beta.
- Source-aware Today actions are now implemented for tasks, grocery items, and individual medicine doses.

High:

- Local persistence needs schema versioning and safer validation before public beta. The current fallback behavior protects the UI but can mask malformed saved data.
- Date and time parsing is centralized for the current MVP behavior. The remaining date risk is that user inputs are still free text and recurrence is not expanded by calendar date.
- The child model should introduce an internal default child id before multi-child premium work, without exposing multiple-child UI.

Privacy:

- No app analytics or logging of sensitive content was found.
- The validation/waitlist pipeline stores raw payloads in Vanessa's Google Sheet. This is acceptable for early validation, but a privacy policy should disclose collection before broader beta sharing.

## Prioritized Improvement Backlog

| Priority | Improvement | Rationale |
| --- | --- | --- |
| High | Add persistence schema versioning, stricter validation, and migration/fallback handling | Protects local user data before public beta. |
| High | Add medicine safety copy and disclaimer in Health | Builds trust while avoiding medical advice, dosage calculations, or diagnosis. |
| High | Add a default child entity/id internally while keeping one-child UI | Preserves MVP boundary while preparing for future multi-child premium support. |
| High | Add plain-language privacy policy and in-app/landing links | Needed before broader beta because the app touches family schedule and medicine data. |
| Medium | Add calm empty states across all module screens | Improves first-run and cleared-list experience. |
| Medium | Split reusable form/card/action UI patterns after behavior stabilizes | Reduces duplication without a large premature refactor. |
| Later | Add analytics or product metrics only after privacy rules are written | Useful for beta learning, but sensitive content must be excluded. |

## Recommended Order Of Implementation

Completed: Today source-aware completion actions.

Completed: Medicine daily completion model and UI adjustment.

Completed: Shared date/time utility for Today and schedules.

1. Persistence schema versioning and migration guardrails.
2. Internal default child entity/id.
3. Privacy policy and beta feedback path.
4. Empty states and small UI polish.

Single most important next development task:

Add persistence schema versioning, stricter validation, and migration/fallback guardrails.

## Current Strategic Recommendation

Do not launch as a full world-market app store product yet.

Instead, move toward a small public beta:

- Keep the app free while testing the daily habit
- Add an easy feedback path
- Prepare privacy and trust basics
- Test with strangers outside the immediate friend group
- Use TestFlight or Android testing before a full public app store launch
- Avoid building premium payments until demand is clearer

This approach allows real-world learning without taking on the pressure of full launch support, app store reviews, paid subscriptions, and user expectations before the product is ready.

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

- Add in-app feedback link or form
- Add basic privacy policy
- Polish app name, icon, splash, and first impression
- Review mobile UI spacing and tap targets
- Prepare app screenshots
- Prepare TestFlight and Android testing setup
- Create a short beta invitation message

Success criteria:

- A new user can understand the app quickly
- A user can send feedback without messaging Vanessa directly
- The app feels trustworthy enough for family schedule and health tracking
- The beta version can be shared with a small group

### Phase 4: Beta Learning

Status: Not Started

Objective: Learn whether users return to the app and which pain is strongest.

Recommended work:

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

Prepare RemoteMom for a small public beta rather than a full public launch.

The next build step should be:

1. Add an in-app feedback path.
2. Add a basic privacy policy page.
3. Polish app first impressions.
4. Prepare beta screenshots and invitation copy.
5. Share the beta with a small group outside the immediate friend network.

This keeps momentum moving while still protecting the product from becoming too large before the market signal is clear.
