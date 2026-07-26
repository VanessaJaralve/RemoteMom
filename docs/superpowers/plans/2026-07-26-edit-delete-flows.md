# Edit Delete Flows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add delete and edit flows for To-Dos, Grocery, Kid Schedule, and Medicine items.

**Architecture:** Extend `AppStateProvider` with update/delete actions for each existing model. Each module screen keeps its existing local form state, adds an editing id, populates the form from the selected item, saves through the provider, and cancels back to add mode.

**Tech Stack:** React Native, Expo, TypeScript, Jest, React Native Testing Library, AsyncStorage persistence through the existing provider.

---

### Task 1: Failing Behavior Tests

**Files:**
- Create: `__tests__/EditDeleteFlows.test.tsx`

- [x] **Step 1: Add failing tests**

Cover deleting and editing task, grocery, schedule, and medicine items, including Today updates where the item appears on the dashboard.

- [x] **Step 2: Verify red**

Run: `pnpm test --runInBand __tests__/EditDeleteFlows.test.tsx`
Expected: fail because edit/delete buttons and provider actions do not exist.

### Task 2: Shared State Actions

**Files:**
- Modify: `src/state/AppState.tsx`

- [x] **Step 1: Add update/delete action types**

Expose `updateTask`, `deleteTask`, `updateGroceryItem`, `deleteGroceryItem`, `updateScheduleItem`, `deleteScheduleItem`, `updateMedicine`, and `deleteMedicine`.

- [x] **Step 2: Implement immutable state updates**

Update actions preserve stable ids and existing status fields unless the form explicitly changes a field. Delete actions filter the item out of the relevant collection.

### Task 3: Screen Controls

**Files:**
- Modify: `src/screens/TodosScreen.tsx`
- Modify: `src/screens/GroceryScreen.tsx`
- Modify: `src/screens/KidScreen.tsx`
- Modify: `src/screens/HealthScreen.tsx`

- [x] **Step 1: Add edit mode**

Each screen stores the id currently being edited, populates the existing form on Edit, changes the submit label to Save, and offers Cancel.

- [x] **Step 2: Add delete buttons**

Each item row/card gets a Delete button that removes the item through shared state.

### Task 4: Verification

**Files:**
- Existing source and tests

- [x] **Step 1: Run tests**

Run: `pnpm test --runInBand`
Expected: all tests pass.

- [x] **Step 2: Run TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: exit code 0.

- [x] **Step 3: Review scope**

Confirm no Firebase, sync, notifications, or premium multi-child behavior was added.
