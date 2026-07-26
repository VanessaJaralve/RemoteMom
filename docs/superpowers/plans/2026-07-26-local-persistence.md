# Local Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Save and restore the existing shared local app state on-device.

**Architecture:** Add AsyncStorage as the local persistence engine behind a focused storage helper module. Keep `AppStateProvider` as the only API screens use, with restore-on-mount and save-after-change behavior.

**Tech Stack:** React Native, Expo, TypeScript, AsyncStorage, Jest, React Native Testing Library.

---

### Task 1: Storage Dependency And Tests

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `jest.globals.js`
- Create: `__tests__/LocalPersistence.test.tsx`

- [x] **Step 1: Add failing persistence tests**

Cover saved data restore, save after task add, empty storage fallback, and invalid storage fallback.

- [x] **Step 2: Verify red**

Run: `pnpm test --runInBand __tests__/LocalPersistence.test.tsx`
Expected: fail because persistence is not implemented.

### Task 2: Storage Helpers And Provider Wiring

**Files:**
- Create: `src/state/persistence.ts`
- Modify: `src/state/AppState.tsx`

- [x] **Step 1: Add typed persistence helpers**

Implement `loadPersistedAppState` and `savePersistedAppState` with a single AsyncStorage key and defensive validation.

- [x] **Step 2: Restore provider state on mount**

Load persisted state after mount and keep sample data if no valid payload exists.

- [x] **Step 3: Save provider state after restore**

Save the full shared state after actions change tasks, groceries, schedule, or medicines.

### Task 3: Verification

**Files:**
- Existing source and tests

- [x] **Step 1: Run tests**

Run: `pnpm test --runInBand`
Expected: all tests pass.

- [x] **Step 2: Run TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: exit code 0.

- [x] **Step 3: Review scope**

Check diff for local persistence only and confirm no Firebase, sync, notifications, or premium multi-child logic.
