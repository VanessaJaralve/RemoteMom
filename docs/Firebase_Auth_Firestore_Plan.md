# RemoteMom Firebase Auth And Firestore Plan

## Goal

Plan the future account-based sync layer for RemoteMom without building it yet.

This step prepares the architecture for Firebase Auth and Cloud Firestore after pricing and paid-value validation. It does not install Firebase packages, create Firebase config, add auth screens, migrate data, deploy rules, or implement cloud writes.

## Do Not Build Yet

Keep these out of the current milestone:

- Firebase SDK installation
- Firebase project configuration
- Login, signup, or password reset screens
- Firestore read/write code
- Cloud migration prompts
- Push notifications
- Premium gates
- Payment or subscription logic
- Google Calendar sync

The next build step should start only after this plan is reviewed and the validation signals support account-based sync.

## Source Context

The app is currently local-first:

- `AppStateProvider` owns shared state for tasks, grocery items, schedule items, and medicines.
- `src/state/persistence.ts` persists one local payload in AsyncStorage at `remotemom:appState:v1`.
- The local payload shape is:
  - `tasks`
  - `groceryItems`
  - `scheduleItems`
  - `medicines`

Firebase should be introduced behind a storage/sync boundary so screens do not need to know whether data is local or cloud-backed.

## Platform Choice

For the current Expo app, evaluate the Firebase JS SDK first because Expo documents it as usable in Expo projects. React Native Firebase is also an option, but it requires native app setup and is heavier for this MVP stage.

Planning assumption:

- Start with Firebase JS SDK for Auth and Firestore planning.
- Reassess React Native Firebase only if native persistence, native analytics, or native notification integration becomes required.

Official references checked on 2026-07-31:

- Expo Firebase guide: https://docs.expo.dev/guides/using-firebase/
- Cloud Firestore data model: https://firebase.google.com/docs/firestore/data-model
- Firestore security rules get started: https://firebase.google.com/docs/firestore/security/get-started
- Firebase Security Rules and Authentication: https://firebase.google.com/docs/rules/rules-and-auth
- Firestore offline access: https://firebase.google.com/docs/firestore/manage-data/enable-offline
- Auth state persistence: https://firebase.google.com/docs/auth/web/auth-state-persistence

## Auth Strategy

### MVP Auth Providers

Start simple:

- Email/password
- Email link or password reset later

Defer:

- Google sign-in
- Apple sign-in
- Phone auth
- Partner invite flow

Reasoning: the first cloud milestone should prove account-based backup and cross-device sync, not social auth complexity.

### Auth State

Add an `AuthProvider` only when the build begins. It should expose:

- `user`
- `isAuthLoading`
- `signUp(email, password)`
- `signIn(email, password)`
- `signOut()`
- `resetPassword(email)`

The app should support:

- Signed-out local mode
- Signed-in cloud mode
- Migration from local data into cloud data after sign-in

## Firestore Data Model

Use user-owned documents first. Add family/shared workspaces only after the one-user sync path is stable.

### Recommended V1 Structure

```text
users/{uid}
  profile
    email
    displayName
    createdAt
    updatedAt
    plan
    onboardingCompleted

users/{uid}/tasks/{taskId}
  title
  lifeArea
  dueDate
  reminderTime
  reminderEnabled
  isDone
  createdAt
  updatedAt
  deletedAt

users/{uid}/groceryItems/{itemId}
  itemName
  category
  isChecked
  isRecurring
  reminderTime
  reminderEnabled
  createdAt
  updatedAt
  deletedAt

users/{uid}/scheduleItems/{itemId}
  title
  category
  startTime
  endTime
  recurring
  recurrenceRule
  reminderEnabled
  notes
  childId
  createdAt
  updatedAt
  deletedAt

users/{uid}/medicines/{medicineId}
  personName
  medicineName
  dosage
  times
  refillReminderThreshold
  reminderEnabled
  lastTaken
  createdAt
  updatedAt
  deletedAt
```

### Why Subcollections

Use subcollections because Firestore stores data as documents in collections and subcollections, and the app's modules already map naturally to separate collections. This keeps list queries focused and avoids one oversized user document.

### Future Multi-Child Structure

Do not add this in V1, but leave `childId` on schedule items so premium multi-child support has a path later.

Future:

```text
users/{uid}/children/{childId}
  name
  color
  birthYear
  archivedAt
```

## Security Rules Shape

Initial rules should be user-owned and conservative.

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /{collection}/{documentId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

Before production, tighten these with field validation:

- Require expected field names per collection.
- Prevent clients from writing another user's UID.
- Validate booleans, strings, arrays, and timestamp fields.
- Restrict `plan` changes to server/admin code when premium exists.

## Local-To-Cloud Migration

Migration should be explicit and reversible for the user.

### Migration Trigger

After successful sign-up or sign-in, if local AsyncStorage contains data and cloud collections are empty, show:

```text
Move your local RemoteMom data into your account?
```

Actions:

- `Move local data`
- `Keep this device local`

### Migration Steps

1. Read current local payload from `loadPersistedAppState()`.
2. Check cloud collections for existing user data.
3. If cloud is empty, batch-create task, grocery, schedule, and medicine documents.
4. Preserve local ids as Firestore document ids where possible.
5. Add `createdAt`, `updatedAt`, and `deletedAt: null`.
6. Keep AsyncStorage as a local fallback until cloud sync is confirmed.
7. After confirmed upload, store a small migration marker locally.

### Conflict Rule

For V1, avoid complex merge UI. If cloud data exists, do not auto-merge. Ask the user to choose:

- Use cloud data on this device
- Keep local-only data for now

## Sync Boundary

Introduce a storage abstraction before writing Firestore code.

Recommended modules:

```text
src/state/localRepository.ts
src/state/cloudRepository.ts
src/state/syncRepository.ts
```

Repository methods:

- `loadAppState()`
- `saveAppState(state)`
- `subscribeToAppState(callback)`
- `createTask(input)`
- `updateTask(id, input)`
- `deleteTask(id)`
- Similar methods for grocery, schedule, and medicine

Screens should continue using `useAppState()`. The provider should decide whether actions hit local state only or cloud sync.

## Offline Strategy

The current app already works offline through AsyncStorage. Keep that behavior.

For cloud mode:

- Keep in-memory React state responsive.
- Queue or retry writes only after cloud behavior is implemented and tested.
- Do not assume web-style Firestore offline persistence will cover every Expo runtime path without validation.
- Test offline behavior on the actual deployment target before relying on it for user trust.

## Privacy And Trust

RemoteMom may contain health and family schedule information. Treat privacy as product trust, not an afterthought.

Before cloud launch:

- Add a plain-language privacy note.
- Avoid storing unnecessary sensitive data.
- Do not store medicine photos, documents, or insurance data in the first cloud version.
- Add account deletion/export planning before a public paid launch.

## Implementation Sequence

### Phase 1: Plan Review

- Review this document.
- Confirm whether account sync is justified by validation results.
- Choose Firebase JS SDK vs React Native Firebase.

### Phase 2: Auth Skeleton

- Add Firebase dependency and config loading.
- Add `AuthProvider`.
- Add email/password auth screens.
- Keep signed-out local mode working.

### Phase 3: Repository Boundary

- Extract local persistence behind `localRepository`.
- Add tests proving screens still work through `useAppState()`.

### Phase 4: Firestore Cloud Repository

- Add per-user subcollections.
- Add create/update/delete methods.
- Add read subscription or load methods.
- Keep migration disabled until rules are ready.

### Phase 5: Security Rules And Emulator Tests

- Add Firestore rules.
- Test user can access only `users/{ownUid}`.
- Test user cannot access another user's docs.
- Test required fields by collection.

### Phase 6: Local-To-Cloud Migration

- Add migration prompt.
- Upload local data to empty cloud account.
- Keep a rollback-safe local copy.

## Acceptance Criteria For The Future Build

The Firebase build is ready only when:

- Signed-out local mode still works.
- A new user can create an account.
- Existing local data can be moved into the account.
- Cloud data reloads after app restart.
- One user cannot read or write another user's data.
- All existing tests still pass.
- New auth, repository, migration, and rules tests pass.

## Recommended Next Action

Before building Firebase, connect the waitlist page to a real validation form and collect pricing/sync demand signals. If users strongly ask for cloud backup, cross-device sync, sharing, or multi-child support, proceed to Phase 1 review and then Phase 2 auth skeleton.
