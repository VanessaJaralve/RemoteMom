# Medicine Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Module 5 only: the Family Health / Medicine Tracker inside the existing Health tab.

**Architecture:** Keep medicine data local with React state for now, because Firebase and notifications are not part of this module. Define the exact `Medicine` model in `src/models/Medicine.ts`, then implement a focused Health screen for Mom and Child medicine entries, reminder-time labels, refill threshold display, and mark-as-taken behavior.

**Tech Stack:** React Native, Expo, TypeScript, Jest, React Native Testing Library.

---

### Task 1: Failing Medicine Tests

**Files:**
- Create: `__tests__/HealthScreen.test.tsx`

- [x] **Step 1: Write failing tests**

Cover exact `Medicine` model usage, the Health screen heading, Mom and Child sample medicines, reminder times, refill threshold display, adding a medicine, and mark-as-taken behavior.

- [x] **Step 2: Run tests to verify red**

Run: `pnpm test --runInBand`
Expected: fail because `src/models/Medicine.ts` and the Health medicine UI do not exist yet.

### Task 2: Medicine Model And Health Screen

**Files:**
- Create: `src/models/Medicine.ts`
- Modify: `src/screens/HealthScreen.tsx`

- [x] **Step 1: Add exact Medicine model**

Define `Medicine` with `id`, `personName`, `medicineName`, `dosage`, `times`, `refillReminderThreshold`, and `lastTaken`.

- [x] **Step 2: Replace placeholder with Medicine Tracker UI**

Render a title, person/medicine/dosage/times/refill threshold inputs, add button, medicine cards, reminder-time labels, refill threshold display, and mark-as-taken controls.

- [x] **Step 3: Keep scope limited**

Do not add Firebase notifications or Today Dashboard behavior.

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
Expected: only Module 5 files, tests, and the plan document changed.
