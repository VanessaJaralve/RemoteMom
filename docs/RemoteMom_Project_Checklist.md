# RemoteMom Project Checklist

Use this as the living tracker for product, build, and business-readiness work.

| Phase | Module | Activity | Status | Completed Date | Notes |
|---|---|---|---|---:|---|
| Phase 1: MVP Foundation | Project setup | Move project to RemoteMom GitHub repo | Completed | 2026-07-23 | Personal project repo is `VanessaJaralve/RemoteMom`. |
| Phase 1: MVP Foundation | App shell | App shell with bottom tabs | Completed | 2026-07-23 | Created Today, Health, Kid, Grocery, and To-Dos navigation structure. |
| Phase 1: MVP Foundation | Universal To-Do List | Build Module 2: Universal To-Do List | Completed | 2026-07-23 | Built task model, add/check behavior, and life-area tags. |
| Phase 1: MVP Foundation | Grocery List | Build Module 3: Grocery List | Completed | 2026-07-23 | Built grocery item model, category sorting, checkbox logic, and recurring flag. |
| Phase 1: MVP Foundation | Child Schedule | Build Module 4: Kid Schedule | Completed | 2026-07-26 | Built one-child MVP schedule with time, recurrence, and notes. |
| Phase 1: MVP Foundation | Family Health / Medicine Tracker | Build Module 5: Family Health / Medicine Tracker | Completed | 2026-07-26 | Built Mom and Child medicine entries, dosage, daily times, refill threshold, and mark-as-taken behavior. |
| Phase 1: MVP Foundation | Today Dashboard | Build Module 6: Today Dashboard | Completed | 2026-07-26 | Built daily timeline pulling from To-Dos, Grocery, Kid Schedule, and Medicine sample data. |
| Phase 1: MVP Foundation | Shared state | Share local app state across modules | Completed | 2026-07-26 | Today Dashboard updates when items are added, checked, edited, or marked taken. |
| Phase 1: MVP Foundation | Local persistence | Add local persistence | Completed | 2026-07-26 | Added AsyncStorage so local data survives reloads. |
| Phase 1: MVP Foundation | Core module actions | Add edit and delete flows | Completed | 2026-07-26 | Added Edit, Save, Cancel, and Delete for all editable modules. |
| Phase 1: MVP Foundation | UI polish | Complete visual QA and UI polish | Completed | 2026-07-26 | Polished form panels, card spacing, action button rows, 44px tap targets, and Today Dashboard text readability. |
| Phase 1: MVP Foundation | Core module actions | Add delete confirmations | Completed | 2026-07-26 | Added two-step inline delete confirmations across To-Dos, Grocery, Kid Schedule, and Medicine. |
| Phase 1: MVP Foundation | Today Dashboard | Build Today Dashboard v2 | Completed | 2026-07-28 | Added urgent, overdue, next-up summary, morning/evening timeline sections, sorted items, focus framing, and cleaner life-area tags. |
| Phase 1: MVP Foundation | Reminder-ready fields | Add reminder-ready fields | Completed | 2026-07-28 | Added optional local reminder-ready fields and visible Reminder ready/off labels without Firebase, push notifications, permissions, or calendar sync. |
| Phase 1: MVP Foundation | Today Dashboard | Add source-aware Today actions | Completed | 2026-08-02 | Added Today actions that update original To-Do, Grocery, and Medicine source records without creating duplicate dashboard state. |
| Phase 2: Validation Foundation | Landing page | Build landing / waitlist page | Completed | 2026-07-28 | Built a static RemoteMom landing/waitlist page with Today Dashboard preview image, niche positioning, Free/Future Premium framing, and waitlist intake. |
| Phase 2: Validation Foundation | Pricing validation | Create pricing and tier validation | Completed | 2026-07-31 | Added Free vs Premium boundaries, competitor pricing anchors, price points to test, interview/survey prompts, and decision rules before Firebase. |
| Phase 2: Validation Foundation | Cloud planning | Create Firebase Auth + Firestore plan | Completed | 2026-07-31 | Added a future-only plan for auth strategy, Firestore data model, security rules, local-to-cloud migration, sync boundary, offline/privacy considerations, and future build phases. |
| Phase 2: Validation Foundation | Validation survey | Add validation survey form | Completed | 2026-08-01 | Added MVP validation survey for children count, hardest daily area, premium feature interest, price comfort, and interview permission. |
| Phase 2: Validation Foundation | Validation pipeline | Connect real validation collection endpoint | Completed | 2026-08-01 | Connected validation form to `/api/validation`, webhook forwarding, local backup fallback, and setup docs. |
| Phase 2: Validation Foundation | Validation pipeline | Add Google Sheets validation response destination | Completed | 2026-08-01 | Added Google Apps Script webhook template and response sheet destination for validation and waitlist collection. |
| Phase 2: Validation Foundation | Validation pipeline | Migrate validation responses to personal sheet | Completed | 2026-08-01 | Updated collection docs, tests, and Apps Script template to use Vanessa's personal Gmail-owned response sheet. |
| Phase 2: Validation Foundation | Validation pipeline | Fix validation response write confirmation | Completed | 2026-08-01 | Required Apps Script JSON `ok: true` before treating collection as successful. |
| Phase 2: Validation Foundation | Waitlist pipeline | Connect waitlist real collection pipeline | Completed | 2026-08-01 | Connected landing waitlist forms to `/api/waitlist` and routed signups to a Waitlist tab through the same webhook. |
| Phase 2: Validation Foundation | Landing page | Polish visitor-facing landing copy | Completed | 2026-08-01 | Replaced technical public form notes with warmer visitor-facing copy. |
| Phase 2: Validation Foundation | Interviews | Create validation interview script and scorecard | Completed | 2026-08-02 | Added interview script, follow-up templates, scorecard fields, scoring definitions, and decision thresholds. |
| Phase 2: Validation Foundation | Documentation | Create product brief and roadmap document | Completed | 2026-08-02 | Created the product brief and roadmap source document and shareable DOCX. |
| Phase 2: Validation Foundation | Documentation | Save RemoteMom Codex project instructions | Completed | 2026-08-02 | Saved the RemoteMom operating instructions as `AGENTS.md` at the repo root. |
| Phase 2: Validation Foundation | Documentation | Complete documentation and current app alignment audit | Completed | 2026-08-02 | Aligned existing documentation to `AGENTS.md`, documented source-of-truth conflicts, and added the module-by-module app audit/backlog. |
| Phase 2: Validation Foundation | Checklist | Restructure checklist by roadmap phase | Completed | 2026-08-02 | Added phase, module, activity, status, completed date, and notes columns in the local checklist and Google Sheet. |
| Phase 3: Public Beta Readiness | Family Health / Medicine Tracker | Separate medicine schedules from daily completion logs | Completed | 2026-08-02 | Added local per-date, per-time medicine dose logs so Health and Today can mark one scheduled dose without changing the permanent medicine schedule. |
| Phase 3: Public Beta Readiness | Family Health / Medicine Tracker | Add medicine safety copy directly in Health | Completed | 2026-08-02 | Added point-of-entry Health screen copy clarifying that RemoteMom organizes medicine routines only, uses user-entered medicine details, does not recommend dosages or diagnose, and dose completion does not change the saved schedule. |
| Phase 3: Public Beta Readiness | Date and time logic | Add shared date/time utility for Today and schedules | Completed | 2026-08-02 | Added shared date/time utilities for local date keys, time parsing, sort fallbacks, due-date classification, Kid schedule sorting, and Today priority behavior. |
| Phase 3: Public Beta Readiness | Local persistence | Add persistence schema versioning and migration guardrails | Completed | 2026-08-02 | Added schema versioning, legacy no-version normalization, unsupported-version fallback, and item-level validation for saved local records. |
| Phase 3: Public Beta Readiness | Child data | Add internal default child entity/id | Completed | 2026-08-02 | Added a default Child entity, persisted children collection, schema v2 migration, and default childId links for child schedule and child medicine records without exposing multi-child UI. |
| Phase 3: Public Beta Readiness | Feedback | Add in-app feedback path | Completed | 2026-08-02 | Added a More tab with a beta feedback email action that does not attach sensitive app data. |
| Phase 3: Public Beta Readiness | Privacy and trust | Add basic privacy policy | Completed | 2026-08-02 | Added plain-language privacy and medicine-safety copy in the app and landing page covering local app data, waitlist/validation/feedback collection, family schedule data, and medicine-related entries. |
| Phase 3: Public Beta Readiness | App identity | Polish app identity and first impression | Completed | 2026-08-09 | Renamed the Expo app identity to RemoteMom, aligned the app scheme/slug, added a calm splash background, and added the RemoteMom brand promise to the Today first screen. |
| Phase 3: Public Beta Readiness | Mobile UI | Review mobile spacing and tap targets | Completed | 2026-08-02 | Added focused mobile ergonomics tests, roomier edit/delete action padding, compact hit areas for checkbox and recurring controls, and safer wrapping for child schedule time inputs. |
| Phase 3: Public Beta Readiness | Device testing | Run Expo Go local phone smoke test | Completed | 2026-08-09 | Android Expo Go smoke test completed by Vanessa. Core flows mostly passed, but failures/modification needs were found and added as follow-up checklist rows: To-Do date input, Child Schedule time input, Medicine form controls, More feedback email bug, and Grocery category selection improvement. |
| Phase 3: Public Beta Readiness | To-Dos | Add structured date input for To-Dos | Completed | 2026-08-09 | Added Today/Tomorrow/No due date quick controls that fill parseable local date keys while preserving the manual due-date field and existing Task model. |
| Phase 3: Public Beta Readiness | Child Schedule | Add structured start/end time input | Completed | 2026-08-09 | Added school morning, afternoon activity, and bedtime routine presets that fill start/end times while preserving the one-child MVP UI and existing ScheduleItem model. |
| Phase 3: Public Beta Readiness | Family Health / Medicine Tracker | Add medicine person, time, and frequency controls | Completed | 2026-08-09 | Added Mom/Child selection and user-selected frequency shortcuts that fill daily medicine times without dosage advice or Medicine model changes. |
| Phase 3: Public Beta Readiness | More / Feedback | Fix Email Feedback action crash | Completed | 2026-08-09 | Fixed the beta feedback action so failed email opens show a calm fallback with Vanessa's feedback email instead of crashing. |
| Phase 3: Public Beta Readiness | Grocery List | Add grocery category selection | Completed | 2026-08-09 | Added common category selection controls that fill the existing category field while preserving custom category typing, category sorting, and the existing GroceryItem model. |
| Phase 3: Public Beta Readiness | Beta assets | Prepare app screenshots | Completed | 2026-08-09 | Created a local screenshot kit with generated PNGs for Today Dashboard, To-Dos, Grocery, Child Schedule, Medicine Tracker, plus a contact sheet for beta sharing and early store-listing drafts. |
| Phase 3: Public Beta Readiness | Beta distribution | Prepare no-budget Expo Go beta setup | Completed | 2026-08-09 | Created a free Expo Go beta guide with Vanessa setup steps, tester instructions, local-data limitations, tester checklist, success criteria, and follow-up questions. Paid TestFlight and Google Play testing remain future options when budget is available. |
| Phase 3: Public Beta Readiness | Beta distribution | Prepare Android APK sideload beta package | Completed | 2026-08-09 | Generated EAS Android internal APK build `c517ff91-ac09-43c1-9447-5c62389e5524` under Vanessa's personal Expo account and downloaded the verified local APK to `releases/android-sideload/RemoteMom-0.1.0-beta.apk`. Next step: Vanessa pre-share phone test before sending to testers. |
| Phase 3: Public Beta Readiness | Beta messaging | Create beta invitation message | Completed | 2026-08-09 | Added a short tester invite message in the Expo Go beta guide, including install steps, QR-code instructions, privacy/local-storage note, and medicine-safety note. |
| Phase 3: Public Beta Readiness | Beta messaging | Update beta questions from early validation signals | Completed | 2026-08-09 | Added one-child MVP framing and follow-up questions to compare multiple-child support, partner/caregiver sharing, reminders, and later willingness to pay before beta testing. |
| Phase 3: Public Beta Readiness | UX polish | Add calm empty states across module screens | Completed | 2026-08-02 | Added supportive blank/cleared-list states for Today, To-Dos, Grocery, Child Schedule, and Health without changing data models or roadmap scope. |
| Phase 4: Beta Learning | Recruiting | Invite 10 to 30 target users | Not Started |  | Start with a small group outside the immediate friend network. |
| Phase 4: Beta Learning | Metrics | Track installs, waitlist signups, and feedback | Not Started |  | Use lightweight tracking that avoids sensitive task, child, or medicine content. |
| Phase 4: Beta Learning | User research | Ask users what they opened first | Not Started |  | Learn whether Today is becoming the starting habit. |
| Phase 4: Beta Learning | User research | Ask what users stopped using or ignored | Not Started |  | Identify modules that need simplification or clearer value. |
| Phase 4: Beta Learning | User research | Capture the strongest repeated pain | Not Started |  | Look for repeated pain around groceries, child schedule, medicine, or Today planning. |
| Phase 4: Beta Learning | Review process | Review feedback weekly | Not Started |  | Decide weekly whether to improve the MVP, validate premium, or pause a weak idea. |
| Phase 5: Cloud Sync Planning and Build | Cloud planning | Review Firebase Auth and Firestore plan | Not Started |  | Reconfirm validation supports account sync before building cloud features. |
| Phase 5: Cloud Sync Planning and Build | Cloud setup | Add Firebase configuration | Not Started |  | Future-only until account sync is approved. |
| Phase 5: Cloud Sync Planning and Build | Authentication | Add email/password authentication | Not Started |  | Keep signed-out local mode working. |
| Phase 5: Cloud Sync Planning and Build | Data architecture | Add repository boundary between local and cloud data | Not Started |  | Avoid rewriting screens when adding sync. |
| Phase 5: Cloud Sync Planning and Build | Cloud data model | Add Firestore user-owned collections | Not Started |  | User data must stay isolated by account. |
| Phase 5: Cloud Sync Planning and Build | Migration | Add local-to-cloud migration | Not Started |  | Preserve local data when a user creates an account. |
| Phase 5: Cloud Sync Planning and Build | Security | Add security rules and tests | Not Started |  | Verify one user cannot access another user's data. |
| Phase 6: Premium Feature Validation | Multiple children | Validate multiple-child support | Not Started |  | Test demand before exposing premium multi-child UI. |
| Phase 6: Premium Feature Validation | Sharing | Validate partner or caregiver sharing | Not Started |  | Test whether shared access is a stronger paid feature than multi-child. |
| Phase 6: Premium Feature Validation | Reminders | Validate real reminders | Not Started |  | Test willingness to pay for notifications before building them. |
| Phase 6: Premium Feature Validation | Medicine alerts | Validate medicine alerts | Not Started |  | Treat as higher-trust feature; do not build until safety and privacy basics are ready. |
| Phase 6: Premium Feature Validation | Calendar sync | Validate calendar sync | Not Started |  | Confirm demand before adding Google Calendar or other calendar integrations. |
| Phase 6: Premium Feature Validation | Cloud backup | Validate cloud backup | Not Started |  | Confirm account sync and backup are worth the added complexity. |
| Phase 6: Premium Feature Validation | Weekly family view | Validate weekly family view | Not Started |  | Confirm this supports RemoteMom's niche rather than becoming a generic planner. |
| Phase 7: Monetization and Launch | Pricing | Choose pricing based on validation | Not Started |  | Use real demand signals before setting paid tiers. |
| Phase 7: Monetization and Launch | Premium gating | Add premium gates only after paid-value proof | Not Started |  | Gate only features that users repeatedly request and understand. |
| Phase 7: Monetization and Launch | Store listing | Prepare App Store and Google Play listing assets | Not Started |  | Prepare listing copy, screenshots, icon, privacy details, and support information. |
| Phase 7: Monetization and Launch | Support and trust | Add support contact and privacy policy links | Not Started |  | Required before broader public launch. |
| Phase 7: Monetization and Launch | Product metrics | Add lightweight product metrics | Not Started |  | Add only after privacy rules are written; exclude sensitive family and medicine content. |
| Phase 7: Monetization and Launch | Launch | Launch to a focused niche audience | Not Started |  | Launch to remote working moms first before broad marketing. |

## Status Key

- `Completed`: Built, verified, and pushed.
- `In Progress`: Currently being worked on.
- `Not Started`: Planned but not yet built.
- `Blocked`: Waiting on a decision, account, dependency, or external setup.

## Current Recommended Next Step

Install and test the Android APK on Vanessa's phone before sending it to trusted testers.
