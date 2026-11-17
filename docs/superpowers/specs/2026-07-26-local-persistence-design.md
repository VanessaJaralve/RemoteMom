# Local Persistence Design

Last updated: November 18, 2026 — approved data-protection follow-up [#38](https://github.com/VanessaJaralve/RemoteMom/issues/38). The original implementation plan remains historical. This decision supersedes sample fallback after failed restore, record filtering and silent save failures.

## Goal

Persist the existing shared local app state on-device so To-Dos, Grocery, Kid Schedule, and Health changes survive app reloads.

## Scope

This milestone adds local-only persistence. It does not add Firebase, auth, cloud sync, Google Calendar sync, notifications, or premium multi-child features.

## Architecture

The existing `AppStateProvider` remains the only state API used by screens. A small storage module wraps AsyncStorage with typed `loadPersistedAppState` and `savePersistedAppState` functions. The provider holds its initial sample state privately until storage is read successfully; editable screens do not mount during loading or recovery. Only an absent storage key starts the existing sample-data experience.

The storage payload mirrors the current shared provider shape: `schemaVersion`, `children`, `tasks`, `groceryItems`, `scheduleItems`, `medicines`, and `medicineDoseLogs`. `children` currently contains one internal default child for the one-child MVP. `medicines` remains the permanent schedule model, while `medicineDoseLogs` records per-date, per-time completion state. Keeping this boundary explicit makes Firebase a future replacement or companion for the storage module rather than a screen rewrite.

Older persisted payloads may not include `medicineDoseLogs`. The storage loader normalizes those payloads to an empty dose-log array so existing local data can continue loading.

Older persisted payloads may not include `schemaVersion` or `children`. These are treated as legacy local data and normalized in memory to the current schema. Schema v1 payloads migrate to schema v2 by adding the missing default child collection and linking child schedule / Child medicine records without a child ID to the default child ID. Valid saved child records are retained; a missing default child is appended only when a normalized record references it. Explicit valid empty collections remain empty. Existing IDs, medicine fields, dose logs and known supported records are preserved.

Payloads with unsupported schema versions, unknown root fields, malformed collections or an invalid member enter recovery. The loader does not filter records or write a shortened replacement. Unknown root fields are protected rather than silently discarded; the supported historic/current fields remain unchanged. Missing legacy `children` and `medicineDoseLogs` fields can be normalized, but a present malformed field is an error. Non-finite numeric refill thresholds are rejected to prevent JSON round trips from changing them to null. The storage key remains `remotemom:appState:v1` and the schema remains version 2.

## Data Flow

On app start, `AppStateProvider` shows a calm loading message and reads AsyncStorage. The loader distinguishes three results:

- `empty`: `getItem()` returned exactly `null`; show the existing new-install samples.
- `loaded`: restore the complete valid or supported legacy state, then mount the screens.
- `blocked`: preserve the storage key and keep editable screens unmounted. This includes empty-string/corrupt JSON, invalid data, unsupported schema and read failure.

The recovery screen explains that the saved data has not been replaced. **Try again** re-reads storage; it never resets data or saves the initial samples after a failed restore. Unsupported-version copy directs the user to the app version that saved the data or a newer compatible version.

After a successful restore, normalized state and subsequent shared-state changes are saved through the same adapter. A module-level promise queue serializes both reads and writes, including across provider unmount/remount. A later restore waits for an earlier pending write, and rapid writes cannot finish out of order. Each save captures its serialized snapshot when requested.

## Error Handling

Read failures return a protected result distinct from absent data. No failed restore, unsupported payload or invalid member authorizes a write or removal of the original key. Recovery is non-destructive; no reset, salvage, export or cloud feature is added.

Save returns explicit success or failure. If a write fails, the current edits stay in memory and an accessible shared warning says **Your latest changes aren’t saved yet.** **Retry saving** captures the latest full state. The warning stays visible during retries until the latest request succeeds. Completion of an older request cannot overwrite the latest request's status. Failures do not log payloads or native error details.

This is still local storage, not backup. Closing the app after a failed save can lose unsaved in-memory edits; the warning asks the user to keep RemoteMom open and try saving again. This fix cannot recover data that was already overwritten by an earlier app version.

## Testing

Regression coverage uses synthetic storage and controlled promises. It covers restoration into Today, versioned saves, valid empty data through reopening, legacy and child migration, preservation of non-default children, loading gates, protected invalid/unsupported data, failed read retry, failed save with latest-state retry, rapid writes, stale completion status and remount while a write is pending. Adapter tests cover ordering and queue recovery as well as all stored collections. Existing screen tests continue to wrap screens in `AppStateProvider`.

Verification results belong in the existing project checklist and the linked pull request. A passing adapter or React test is not an installed-APK result. Actual device reopening must be checked against an identified candidate build before broader beta distribution; build/source reconciliation remains separate from this storage fix.
