# RemoteMom Project Checklist

Use this as the living tracker for product, build, and business-readiness work.

| Activity | Status | Completed Date | Notes |
|---|---|---:|---|
| Move project to RemoteMom GitHub repo | Completed | 2026-07-23 | Personal project repo is `VanessaJaralve/RemoteMom`. |
| App shell with bottom tabs | Completed | 2026-07-23 | Created Today, Health, Kid, Grocery, and To-Dos navigation structure. |
| Module 2: Universal To-Do List | Completed | 2026-07-23 | Built task model, add/check behavior, and life-area tags. |
| Module 3: Grocery List | Completed | 2026-07-23 | Built grocery item model, category sorting, checkbox logic, and recurring flag. |
| Module 4: Kid Schedule | Completed | 2026-07-26 | Built one-child MVP schedule with time, recurrence, and notes. |
| Module 5: Family Health / Medicine Tracker | Completed | 2026-07-26 | Built Mom and Child medicine entries, dosage, daily times, refill threshold, and mark-as-taken behavior. |
| Module 6: Today Dashboard | Completed | 2026-07-26 | Built daily timeline pulling from To-Dos, Grocery, Kid Schedule, and Medicine sample data. |
| Shared app state across modules | Completed | 2026-07-26 | Today Dashboard updates when items are added, checked, edited, or marked taken. |
| Local persistence | Completed | 2026-07-26 | Added AsyncStorage so local data survives reloads. |
| Edit and delete flows | Completed | 2026-07-26 | Added Edit, Save, Cancel, and Delete for all editable modules. |
| Visual QA and UI polish | Completed | 2026-07-26 | Polished form panels, card spacing, action button rows, 44px tap targets, and Today Dashboard text readability. |
| Delete confirmations | Completed | 2026-07-26 | Added two-step inline delete confirmations across To-Dos, Grocery, Kid Schedule, and Medicine. |
| Today Dashboard v2 | Completed | 2026-07-28 | Added urgent, overdue, next-up summary, morning/evening timeline sections, sorted items, focus framing, and cleaner life-area tags. |
| Reminder-ready fields | Completed | 2026-07-28 | Added optional local reminder-ready fields and visible Reminder ready/off labels without Firebase, push notifications, permissions, or calendar sync. |
| Landing / waitlist page | Completed | 2026-07-28 | Built a static RemoteMom landing/waitlist page with Today Dashboard preview image, niche positioning, Free/Future Premium framing, and waitlist intake. |
| Pricing and tier validation | Completed | 2026-07-31 | Added Free vs Premium boundaries, competitor pricing anchors, price points to test, interview/survey prompts, and decision rules before Firebase. |
| Firebase Auth + Firestore plan | Completed | 2026-07-31 | Added a future-only plan for auth strategy, Firestore data model, security rules, local-to-cloud migration, sync boundary, offline/privacy considerations, and future build phases. |
| Validation survey form | Completed | 2026-08-01 | Added MVP validation survey for children count, hardest daily area, premium feature interest, price comfort, and interview permission. |
| Real validation collection endpoint | Completed | 2026-08-01 | Connected validation form to `/api/validation`, webhook forwarding, local backup fallback, and setup docs. |
| Google Sheets validation response destination | Completed | 2026-08-01 | Added Google Apps Script webhook template and response sheet destination for validation and waitlist collection. |
| Personal validation response sheet migration | Completed | 2026-08-01 | Updated collection docs, tests, and Apps Script template to use Vanessa's personal Gmail-owned response sheet. |
| Validation response write confirmation fix | Completed | 2026-08-01 | Required Apps Script JSON `ok: true` before treating collection as successful. |
| Waitlist real collection pipeline | Completed | 2026-08-01 | Connected landing waitlist forms to `/api/waitlist` and routed signups to a Waitlist tab through the same webhook. |
| Landing page visitor-facing copy polish | Completed | 2026-08-01 | Replaced technical public form notes with warmer visitor-facing copy. |
| Validation interview script and scorecard | Completed | 2026-08-02 | Added interview script, follow-up templates, scorecard fields, scoring definitions, and decision thresholds. |
| RemoteMom product brief and roadmap document | Completed | 2026-08-02 | Created the product brief and roadmap source document and shareable DOCX. |
| RemoteMom Codex project instructions | Completed | 2026-08-02 | Saved the RemoteMom operating instructions as `AGENTS.md` at the repo root. |
| Documentation and current app alignment audit | Completed | 2026-08-02 | Aligned existing documentation to `AGENTS.md`, documented source-of-truth conflicts, and added the module-by-module app audit/backlog. |
| Today Dashboard source-aware actions | Completed | 2026-08-02 | Added Today actions that update original To-Do, Grocery, and Medicine source records without creating duplicate dashboard state. |
| Phase 1: MVP Foundation | Completed | 2026-08-02 | Local-first app foundation is complete: app shell, To-Dos, Grocery, Child Schedule, Medicine, Today Dashboard, shared state, persistence, edit/delete, reminder-ready fields, and source-aware Today actions. |
| Phase 2: Validation Foundation | Completed | 2026-08-02 | Demand validation foundation is complete: landing page, waitlist, validation survey, Google Sheets collection, pricing plan, interview script, and scorecard. |
| Phase 3: Public Beta Readiness | Not Started |  | Prepare the app to be tested by people outside the immediate friend group. Includes feedback path, privacy policy, app polish, screenshots, beta setup, and invitation copy. |
| Phase 3 task: In-app feedback path | Not Started |  | Add a simple feedback link or form so beta users can respond without messaging Vanessa directly. |
| Phase 3 task: Basic privacy policy | Not Started |  | Add plain-language privacy policy coverage for local app data, validation/waitlist collection, family schedule data, and medicine-related entries. |
| Phase 3 task: App identity and first impression polish | Not Started |  | Polish app name presentation, icon, splash, screenshots, and first-run impression before beta sharing. |
| Phase 3 task: TestFlight and Android beta setup | Not Started |  | Prepare the controlled mobile beta distribution path before public app store launch. |
| Phase 4: Beta Learning | Not Started |  | Invite 10 to 30 target users and review retention, repeated pain, feedback, and willingness-to-pay signals. |
| Phase 5: Cloud Sync Planning and Build | Not Started |  | Add account-based Firebase sync only after validation supports it, while keeping signed-out local mode working. |
| Phase 6: Premium Feature Validation | Not Started |  | Validate which paid feature cluster is strongest: multiple children, sharing, real reminders, medicine alerts, calendar sync, cloud backup, or weekly family view. |
| Phase 7: Monetization and Launch | Not Started |  | Prepare pricing, premium gates, store listings, support contact, privacy policy, lightweight metrics, and focused niche launch only after paid-value proof. |
| Firebase Auth + Firestore build | Not Started |  | Add cloud sync only after the local MVP and positioning are validated. |
| Premium feature gating | Not Started |  | Gate multi-child, sharing, reminders, calendar sync, and cloud features later. |

## Status Key

- `Completed`: Built, verified, and pushed.
- `In Progress`: Currently being worked on.
- `Not Started`: Planned but not yet built.
- `Blocked`: Waiting on a decision, account, dependency, or external setup.

## Current Recommended Next Step

Separate permanent medicine schedules from daily medicine completion records, so marking a medicine taken records a date-safe completion without changing the medicine schedule itself.
