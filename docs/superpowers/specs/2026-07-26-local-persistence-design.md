# Local Persistence Design

## Goal

Persist the existing shared local app state on-device so To-Dos, Grocery, Kid Schedule, and Health changes survive app reloads.

## Scope

This milestone adds local-only persistence. It does not add Firebase, auth, cloud sync, Google Calendar sync, notifications, or premium multi-child features.

## Architecture

The existing `AppStateProvider` remains the only state API used by screens. A small storage module wraps AsyncStorage with typed `loadPersistedAppState` and `savePersistedAppState` functions. The provider initializes from sample data, attempts to restore saved state after mount, and saves the full shared state after user-driven changes.

The storage payload mirrors the current shared provider shape: `schemaVersion`, `children`, `tasks`, `groceryItems`, `scheduleItems`, `medicines`, and `medicineDoseLogs`. `children` currently contains one internal default child for the one-child MVP. `medicines` remains the permanent schedule model, while `medicineDoseLogs` records per-date, per-time completion state. Keeping this boundary explicit makes Firebase a future replacement or companion for the storage module rather than a screen rewrite.

Older persisted payloads may not include `medicineDoseLogs`. The storage loader normalizes those payloads to an empty dose-log array so existing local data can continue loading.

Older persisted payloads may not include `schemaVersion` or `children`. These are treated as legacy local data and normalized in memory to the current schema. Schema v1 payloads are migrated to schema v2 by adding the default child collection and linking child schedule / Child medicine records to the default child id. Payloads with unsupported future schema versions are not trusted and fall back to sample data. The loader validates required collection arrays and filters malformed records inside otherwise valid arrays.

## Data Flow

On app start, `AppStateProvider` renders with sample data so screens remain usable immediately. It then reads AsyncStorage. If a complete valid or migratable payload exists, the provider replaces the sample data with normalized saved local data. If storage is empty, unsupported, malformed, or unreadable, the provider keeps sample data.

After restore finishes, any state change made through provider actions writes the latest full payload to AsyncStorage.

## Error Handling

Storage read and parse failures are caught and treated as no saved data. Storage write failures are caught so UI updates still succeed locally in memory. No user-facing error UI is added in this milestone because persistence is an infrastructure bridge, not a full settings or account feature.

## Testing

Tests cover restoring saved data into Today, saving versioned payloads after app actions, legacy payload migration, schema v1 child migration, missing dose-log normalization, unsupported schema fallback, malformed collection fallback, malformed record filtering, empty storage fallback, and invalid storage fallback. Existing screen tests continue to wrap screens in `AppStateProvider`.
