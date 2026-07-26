# Kid Schedule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Module 4 only: the Kid's Schedule inside the existing Kid tab.

**Architecture:** Keep schedule data local with React state for now, because Firebase is not part of this module. Define the exact `ScheduleItem` model in `src/models/ScheduleItem.ts`, then implement a focused Kid screen for one-child MVP scheduling with recurring activities, start/end time, and notes.

**Tech Stack:** React Native, Expo, TypeScript, Jest, React Native Testing Library.

---

### Task 1: Failing Kid Schedule Tests

**Files:**
- Create: `__tests__/KidScreen.test.tsx`

- [x] **Step 1: Write failing tests**

Cover exact `ScheduleItem` model usage, the Kid screen heading, one-child MVP label, adding a recurring activity with start/end time and notes, and preserving future modules as untouched placeholders.

- [x] **Step 2: Run tests to verify red**

Run: `pnpm test --runInBand`
Expected: fail because `src/models/ScheduleItem.ts` and the Kid schedule UI do not exist yet.

### Task 2: Schedule Model And Kid Screen

**Files:**
- Create: `src/models/ScheduleItem.ts`
- Modify: `src/screens/KidScreen.tsx`

- [x] **Step 1: Add exact ScheduleItem model**

Define `ScheduleItem` with `id`, `title`, `category`, `startTime`, `endTime`, `recurring`, `recurrenceRule`, and `notes`.

- [x] **Step 2: Replace placeholder with Kid Schedule UI**

Render a title, one-child MVP label, title/start/end/notes inputs, recurring toggle, recurrence rule input, add button, and schedule cards.

- [x] **Step 3: Keep scope limited**

Do not modify Health, Medicine, Today Dashboard, or premium multi-child features.

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
Expected: only Module 4 files, tests, and the plan document changed.
