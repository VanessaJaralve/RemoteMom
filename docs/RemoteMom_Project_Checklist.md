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
| Visual QA and UI polish | Not Started |  | Tap-test app in Expo Go, improve spacing, card layouts, and mobile button ergonomics. |
| Delete confirmations | Not Started |  | Add confirmation state before removing To-Dos, Grocery items, Kid Schedule items, and Medicine entries. |
| Today Dashboard v2 | Not Started |  | Make Today the core paid-value surface: urgent items, overdue items, morning/evening framing, and clearer priorities. |
| Reminder-ready fields | Not Started |  | Prepare data model fields for future reminders without adding Firebase notifications yet. |
| Landing / waitlist page | Not Started |  | Validate the niche promise and collect early interest before building payments. |
| Pricing and tier validation | Not Started |  | Test Free vs Premium feature boundaries with target users. |
| Firebase Auth + Firestore plan | Not Started |  | Plan account-based sync after paid-value validation. |
| Firebase Auth + Firestore build | Not Started |  | Add cloud sync only after the local MVP and positioning are validated. |
| Premium feature gating | Not Started |  | Gate multi-child, sharing, reminders, calendar sync, and cloud features later. |

## Status Key

- `Completed`: Built, verified, and pushed.
- `In Progress`: Currently being worked on.
- `Not Started`: Planned but not yet built.
- `Blocked`: Waiting on a decision, account, dependency, or external setup.

## Current Recommended Next Step

Visual QA and UI polish, then delete confirmations.
