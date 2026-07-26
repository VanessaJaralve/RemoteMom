# Shared Local App State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add shared local state so Today updates when users change To-Dos, Grocery, Kid Schedule, and Health.

**Architecture:** Add an `AppStateProvider` and `useAppState()` hook backed by React state and initialized from existing sample data. Refactor module screens to read/write through the shared state while keeping form inputs local and keeping persistence/Firebase out of scope.

**Tech Stack:** React Native, Expo, TypeScript, Jest, React Native Testing Library.

---

### Task 1: Failing Shared-State Tests

**Files:**
- Create: `__tests__/SharedAppState.test.tsx`
- Modify: existing screen tests to wrap screens in `AppStateProvider`

- [x] **Step 1: Write failing tests**

Cover add task -> Today, check grocery -> Today, add schedule item -> Today, and mark medicine taken -> Today.

- [x] **Step 2: Run tests to verify red**

Run: `pnpm test --runInBand`
Expected: fail because `src/state/AppState.tsx` does not exist and screens still use isolated local state.

### Task 2: Provider And Screen Refactor

**Files:**
- Create: `src/state/AppState.tsx`
- Modify: `App.tsx`
- Modify: `src/screens/TodosScreen.tsx`
- Modify: `src/screens/GroceryScreen.tsx`
- Modify: `src/screens/KidScreen.tsx`
- Modify: `src/screens/HealthScreen.tsx`
- Modify: `src/screens/TodayScreen.tsx`

- [x] **Step 1: Add provider/hook**

Expose shared arrays and actions for tasks, grocery items, schedule items, and medicines.

- [x] **Step 2: Refactor screens**

Move module collection state out of screens and into `useAppState()`. Keep screen form fields local.

- [x] **Step 3: Keep scope limited**

Do not add Firebase, persistence, notifications, Google Calendar sync, or premium multi-child logic.

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
Expected: only shared local state and relevant screen/test files changed.
