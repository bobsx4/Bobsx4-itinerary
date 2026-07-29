# Build Provenance - v0.3.0 RC3.3

## Immediate baseline

- File: `Bobsx4_Road_Companion_v0.3.0_RC3.2_CLEAN_REBUILD_repo-ready (1).zip`
- Role: accepted RC3.2 source and runtime supplied in the active Road Companion workspace.

## Trusted baseline

- File: `Bobsx4_Road_Companion_v0.3.0_RC2_repo-ready(1).zip`
- SHA-256: `e06d2f23af442a06d9d91d74b6dd7e09b74e81cfac608dc0fb3c58cf9cf31f44`
- Role: known-good complete application baseline supplied by the user.

## Feature reference

- File: `Bobsx4_Road_Companion_v0.3.0_RC3.1_RUNTIME_REPAIR.zip`
- SHA-256: `a3a7ae8175bbb1209999811f13e0e1fd0e0fa016d9f4783fca2043794d1f3393`
- Role: reference only for the intended RC3 response and RC3.1 diagnostic changes.

## RC3.2 rebuild method

A unified patch was generated for only `index.html`, `styles.css`, `app.js`, `road-data.js`, `service-worker.js`, and `release-manifest.json`. That patch was applied to a fresh extraction of RC2. The patched runtime was compared byte-for-byte with the feature reference before receiving a new RC3.2 version and cache identity.

## RC3.3 update method

RC3.3 changes only `app.js`, `styles.css`, `road-data.js`, `index.html`, `service-worker.js`, release metadata, and documentation. It replaces vertical `scrollIntoView()` behaviour with horizontal-only day-strip centring and adds derived post-event Live Check archiving. The storage key and data schema remain unchanged.

## Packaging controls

- Runtime JavaScript syntax checked with Node.
- Release JSON parsed.
- HTML, CSS marker, required references, and runtime signatures checked.
- Road data loaded in an isolated JavaScript context.
- Navigator and Explorer response entry, persistence, separation, and Memories output tested in headless Chromium with an in-memory localStorage implementation.
- iPhone and iPad layouts rendered to screenshots.
- Full and runtime-only ZIP files extracted into separate directories and compared byte-for-byte with the source tree.
- Focused DOM checks simulate event-day and next-day Live Check status, Adventure actions, and other-view navigation.
