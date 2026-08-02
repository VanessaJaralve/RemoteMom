# RemoteMom — Codex Instructions

## Required Project Context

RemoteMom is a personal productivity and family-management app for remote working moms.

Before planning or changing code, read:

- The existing Product Summary
- The existing Project Plan
- The existing Roadmap
- The existing product or feature requirements
- The existing data-model documentation
- The existing decision log
- The existing change history
- Any documentation specifically related to the requested module

Find and use the existing project documents. Do not create duplicate versions of documentation that already exists.

## Product Purpose

RemoteMom brings the mental load of work, home, parenting, groceries, child schedules, and family medicine into one calm daily view.

The app should help the user understand:

- What needs attention today
- What has already been completed
- What remains open
- What requires follow-up
- What can safely wait
- Whether something important may have been forgotten

The core product promise is:

> Manage the day without carrying it all in your head.

## Primary User

The initial target user is a remote working mom managing one child while balancing:

- Work responsibilities
- Household tasks
- Groceries and meals
- Child schedules
- Errands
- Personal responsibilities
- Family medicine and health routines

The MVP supports one child, but the data model should not permanently hard-code the application around only one child.

## Current MVP

The current MVP includes:

1. Universal To-Do List
2. Grocery List
3. Child Schedule for one child
4. Family Health and Medicine Tracker for Mom and Child
5. Today Dashboard
6. Local device persistence
7. Landing and waitlist page

Do not add roadmap or premium features unless the current task explicitly requests them.

## Central Product Experience

The Today Dashboard is the central RemoteMom experience.

Every relevant module should contribute accurate information to Today.

The Today Dashboard must reference or derive information from the original source records. Do not create disconnected duplicate copies of tasks, events, grocery records, or medicine records.

Completing or editing an item from Today must update the original source record.

## Product Priorities

Use this priority order when making decisions:

1. Reduce the user’s mental load.
2. Make the Today Dashboard accurate and useful.
3. Make adding and completing items fast.
4. Make important responsibilities easy to recognize.
5. Keep the interface calm and easy to scan.
6. Protect existing user data.
7. Keep the MVP focused.
8. Prepare for future expansion without prematurely implementing it.

Prefer a smaller, reliable improvement over a large, speculative feature.

## User Experience Principles

RemoteMom should feel:

- Calm
- Warm
- Supportive
- Practical
- Trustworthy
- Easy to understand
- Mobile-first

RemoteMom should not feel:

- Corporate
- Clinical
- Childish
- Judgmental
- Overly complicated
- Like enterprise project-management software

Use supportive language such as:

- Needs attention
- Still open
- Move to tomorrow
- Nothing urgent right now
- Three priorities today

Avoid guilt-based language such as:

- You failed
- You forgot
- You are behind
- Unproductive

## Local Persistence

The MVP is local-first.

When changing stored data:

- Preserve existing local user data.
- Inspect the current storage implementation first.
- Use stable IDs.
- Consider schema migration and backward compatibility.
- Do not introduce cloud services unless explicitly requested.
- Do not claim that data is backed up when it is only stored locally.
- Test persistence after refresh or reopening the app.

## Date and Today Logic

Use one consistent, testable source of logic for deciding what belongs on Today.

Consider:

- Local timezone
- Date-only records
- Timed records
- Overdue tasks
- All-day events
- Completed items
- Deleted or edited source records
- Date changes at midnight
- Multiple items scheduled at the same time

Avoid duplicating date-filtering logic across several components.

## Child Data

The MVP user interface supports one child.

Where practical:

- Represent the child as an entity with a stable ID.
- Associate schedules and health records with that ID.
- Avoid fixed global fields that assume only one child can ever exist.
- Do not expose unfinished multiple-child functionality in the MVP.

## Medicine Safety

RemoteMom is an organizational tool and does not provide medical advice.

Never:

- Calculate dosage
- Recommend dosage
- Diagnose conditions
- Suggest changing prescribed instructions
- Infer medical directions not entered by the user

Medicine names, dosage text, instructions, and schedules must remain user-entered.

Where practical, separate:

- The permanent medicine schedule
- The daily completion log

Marking today’s medicine as taken must not alter the permanent medicine schedule.

Do not place medicine names, dosage details, health notes, child details, task content, or other sensitive user content in analytics or application logs.

## Roadmap Awareness

Future possibilities may include:

- Multiple children
- Recurring tasks and routines
- Notifications
- Calendar synchronization
- Cloud backup
- Shared access
- Task assignment
- Meal planning
- Weekly planning
- Follow-up tracking
- Mental Load Inbox
- Day Reset
- Medicine refill reminders

These features may influence safe architectural decisions, but they must not be implemented unless explicitly included in the current task or approved project phase.

## Non-Goals for the MVP

Do not introduce the following unless specifically requested:

- Remote job listings
- Career coaching
- Public community features
- Social feeds
- Full budgeting
- Banking integrations
- Full recipe marketplace
- Clinical medical records
- AI medical recommendations
- Complex project-management boards
- Extensive gamification
- Caregiver marketplaces

## Development Process

For every task:

1. Read the relevant project documentation.
2. Inspect the existing implementation.
3. Explain what already exists and identify the actual gap.
4. Identify affected source modules and Today Dashboard behavior.
5. Consider local-persistence and data-migration impact.
6. Use the smallest safe implementation.
7. Preserve unrelated working behavior.
8. Follow existing code conventions and architecture.
9. Add or update relevant tests.
10. Run available linting, type checking, tests, and production build.
11. Update the appropriate documentation and change history.

Do not claim that a check passed unless it was actually executed successfully.

## Documentation Rules

When product or technical decisions change:

- Update the existing relevant document.
- Do not create another competing project plan or roadmap.
- Record meaningful architectural decisions.
- Keep the roadmap phases distinct.
- Do not silently move future features into the MVP.
- Update the change history after meaningful code changes.

When documents conflict, identify the conflict and use the most recently approved or dated decision. Do not silently combine contradictory requirements.

## Definition of Done

A change is complete only when:

- Requested behavior works.
- Existing behavior has not been unnecessarily broken.
- Relevant Today Dashboard behavior is correct.
- Local data is preserved or safely migrated.
- Empty, error, and completed states are handled.
- Date and timezone behavior has been considered.
- Accessibility has been considered.
- Sensitive information is not logged.
- Relevant checks have been run.
- Documentation and change history have been updated.
- Known limitations are clearly reported.

## Required Completion Report

At the end of every task, report:

### Completed
What changed.

### Files Changed
The main files changed and why.

### Verification
The commands and checks actually run.

### Acceptance Criteria
Which required behaviors passed or remain unresolved.

### Data Impact
Any effect on existing locally stored data.

### Documentation
Which existing documents were updated.

### Known Limitations
Anything incomplete, unverified, or requiring follow-up.

## Final Decision Rule

Before adding or changing a feature, ask:

> Does this help a remote working mom manage today with less mental effort?

If not, it probably does not belong in the current MVP.
