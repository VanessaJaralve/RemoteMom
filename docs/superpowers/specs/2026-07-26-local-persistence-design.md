# Local Persistence Design

## Goal

Persist the existing shared local app state on-device so To-Dos, Grocery, Kid Schedule, and Health changes survive app reloads.

## Scope

This milestone adds local-only persistence. It does not add Firebase, auth, cloud sync, Google Calendar sync, notifications, or premium multi-child features.

## Architecture

The existing `AppStateProvider` remains the only state API used by screens. A small storage module wraps AsyncStorage with typed `loadPersistedAppState` and `savePersistedAppState` functions. The provider initializes from sample data, attempts to restore saved state after mount, and saves the full shared state after user-driven changes.

The storage payload mirrors the current shared provider shape: `tasks`, `groceryItems`, `scheduleItems`, and `medicines`. Keeping this boundary explicit makes Firebase a future replacement or companion for the storage module rather than a screen rewrite.

## Data Flow

On app start, `AppStateProvider` renders with sample data so screens remain usable immediately. It then reads AsyncStorage. If a complete valid payload exists, the provider replaces the sample data with saved local data. If storage is empty, malformed, or unreadable, the provider keeps sample data.

After restore finishes, any state change made through provider actions writes the latest full payload to AsyncStorage.

## Error Handling

Storage read and parse failures are caught and treated as no saved data. Storage write failures are caught so UI updates still succeed locally in memory. No user-facing error UI is added in this milestone because persistence is an infrastructure bridge, not a full settings or account feature.

## Testing

Tests cover restoring saved data into Today, saving after app actions, empty storage fallback, and invalid storage fallback. Existing screen tests continue to wrap screens in `AppStateProvider`.
