# Today Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Module 6 only: a read-only Today Dashboard that combines the existing local/sample modules into one timeline.

**Architecture:** Add shared sample-data exports using the existing `Task`, `GroceryItem`, `ScheduleItem`, and `Medicine` model shapes. Replace `TodayScreen` with a focused scrollable timeline that maps those sources into color-tagged dashboard items without adding backend, calendar, notification, or premium logic.

**Tech Stack:** React Native, Expo, TypeScript, Jest, React Native Testing Library.

---

### Task 1: Failing Today Dashboard Tests

**Files:**
- Create: `__tests__/TodayScreen.test.tsx`

- [x] **Step 1: Write failing tests**

Cover the Today Dashboard heading, timeline content pulled from to-dos, groceries, kid schedule, and medicine, and absence of Firebase, Google Calendar, notification, and premium multi-child features.

- [x] **Step 2: Run tests to verify red**

Run: `pnpm test --runInBand`
Expected: fail because the Today screen still renders the placeholder and shared sample data does not exist yet.

### Task 2: Shared Sample Data And Today Screen

**Files:**
- Create: `src/data/sampleData.ts`
- Modify: `src/screens/TodayScreen.tsx`

- [x] **Step 1: Add shared sample data**

Export `sampleTasks`, `sampleGroceryItems`, `sampleScheduleItems`, and `sampleMedicines` using the existing model types.

- [x] **Step 2: Replace placeholder with read-only Today Dashboard**

Render a title, summary, and scrollable timeline with work, kid, health, and household color tags.

- [x] **Step 3: Keep scope limited**

Do not add Firebase, Google Calendar sync, notifications, or premium multi-child features.

### Task 3: Verification

**Files:**
- Existing test and TypeScript files

- [x] **Step 1: Run unit tests**

Run: `pnpm test --runInBand`
Expected: all tests pass.

- [x] **Step 2: Run TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: exit code 0.

- [x] **Step 3: Review git diff**

Run: `git status -sb` and `git diff --stat`
Expected: only Today Dashboard files, tests, and the plan document changed.
