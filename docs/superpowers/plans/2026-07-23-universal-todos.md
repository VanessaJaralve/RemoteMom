# Universal To-Do List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Module 2 only: the Universal To-Do List inside the existing To-Dos tab.

**Architecture:** Keep data local with React state for now, because Firebase is not part of this module. Define the exact `Task` model in `src/models/Task.ts`, then implement a focused To-Dos screen with add, life-area selection, optional due date, and done toggle behavior.

**Tech Stack:** React Native, Expo, TypeScript, Jest, React Native Testing Library.

---

### Task 1: Failing To-Do Tests

**Files:**
- Create: `__tests__/TodosScreen.test.tsx`
- Modify: `jest.globals.js`

- [x] **Step 1: Extend test React Native mocks**

Add host mocks for `Pressable`, `ScrollView`, and `TextInput` so tests can fire presses and text input changes.

- [x] **Step 2: Write failing tests**

Cover exact `Task` model usage, the To-Dos screen heading, adding a task with `title`, `lifeArea`, and `dueDate`, and toggling `isDone`.

- [x] **Step 3: Run tests to verify red**

Run: `pnpm test --runInBand`
Expected: fail because `src/models/Task.ts` and the To-Dos feature UI do not exist yet.

### Task 2: To-Do Model And Screen

**Files:**
- Create: `src/models/Task.ts`
- Modify: `src/screens/TodosScreen.tsx`

- [x] **Step 1: Add exact Task model**

Define `Task` with `id`, `title`, `lifeArea`, `dueDate`, and `isDone`.

- [x] **Step 2: Replace placeholder with To-Do feature UI**

Render a title, inputs, life-area selector, task list, color tags, optional due date, and done toggles.

- [x] **Step 3: Keep scope limited**

Do not modify Grocery, Health, Kid Schedule, or Today Dashboard feature behavior.

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
Expected: only Module 2 files, tests, and the plan document changed.
