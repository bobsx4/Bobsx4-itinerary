# Build Provenance - v0.3.0 RC3.2

## Trusted baseline

- File: `Bobsx4_Road_Companion_v0.3.0_RC2_repo-ready(1).zip`
- SHA-256: `e06d2f23af442a06d9d91d74b6dd7e09b74e81cfac608dc0fb3c58cf9cf31f44`
- Role: known-good complete application baseline supplied by the user.

## Feature reference

- File: `Bobsx4_Road_Companion_v0.3.0_RC3.1_RUNTIME_REPAIR.zip`
- SHA-256: `a3a7ae8175bbb1209999811f13e0e1fd0e0fa016d9f4783fca2043794d1f3393`
- Role: reference only for the intended RC3 response and RC3.1 diagnostic changes.

## Rebuild method

A unified patch was generated for only `index.html`, `styles.css`, `app.js`, `road-data.js`, `service-worker.js`, and `release-manifest.json`. That patch was applied to a fresh extraction of RC2. The patched runtime was compared byte-for-byte with the feature reference before receiving a new RC3.2 version and cache identity.

## Packaging controls

- Runtime JavaScript syntax checked with Node.
- Release JSON parsed.
- HTML, CSS marker, required references, and runtime signatures checked.
- Road data loaded in an isolated JavaScript context.
- Navigator and Explorer response entry, persistence, separation, and Memories output tested in headless Chromium with an in-memory localStorage implementation.
- iPhone and iPad layouts rendered to screenshots.
- Full and runtime-only ZIP files extracted into separate directories and compared byte-for-byte with the source tree.
