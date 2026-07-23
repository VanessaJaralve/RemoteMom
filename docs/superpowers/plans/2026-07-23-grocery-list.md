# Grocery List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Module 3 only: the Grocery List inside the existing Grocery tab.

**Architecture:** Keep grocery data local with React state for now, because Firebase is not part of this module. Define the exact `GroceryItem` model in `src/models/GroceryItem.ts`, then implement a focused Grocery screen with add, category sorting/grouping, checked toggle, and recurring flag behavior.

**Tech Stack:** React Native, Expo, TypeScript, Jest, React Native Testing Library.

---

### Task 1: Failing Grocery Tests

**Files:**
- Create: `__tests__/GroceryScreen.test.tsx`

- [x] **Step 1: Write failing tests**

Cover exact `GroceryItem` model usage, the Grocery screen heading, category grouping/sorting, adding an item with `itemName`, `category`, and `isRecurring`, and toggling `isChecked`.

- [x] **Step 2: Run tests to verify red**

Run: `pnpm test --runInBand`
Expected: fail because `src/models/GroceryItem.ts` and the Grocery feature UI do not exist yet.

### Task 2: Grocery Model And Screen

**Files:**
- Create: `src/models/GroceryItem.ts`
- Modify: `src/screens/GroceryScreen.tsx`

- [x] **Step 1: Add exact GroceryItem model**

Define `GroceryItem` with `id`, `itemName`, `category`, `isChecked`, and `isRecurring`.

- [x] **Step 2: Replace placeholder with Grocery feature UI**

Render a title, item name input, category input, recurring toggle, add button, grouped grocery list, category headings, checked toggles, and recurring labels.

- [x] **Step 3: Keep scope limited**

Do not modify Kid Schedule, Health, or Today Dashboard feature behavior.

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
Expected: only Module 3 files, tests, and the plan document changed.
