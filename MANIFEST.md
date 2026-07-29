# Release Manifest - v0.3.0 RC3.3

| Path | Purpose |
|---|---|
| `.nojekyll` | Prevents GitHub Pages/Jekyll processing. |
| `index.html` | App shell, five views, diagnostics, dialogs, and navigation. |
| `styles.css` | Mobile/iPad layouts, mode themes, response controls, and Past checks archive styling. |
| `road-data.js` | Public itinerary, mode packs, assignment response definitions, facts, badges, teasers, and Live Check dates. |
| `app.js` | State, rendering, scroll-safe Adventure actions, Live Check lifecycle, responses, journals, stays, backup, updates, and migration. |
| `service-worker.js` | Offline shell cache and old-version cleanup. |
| `manifest.webmanifest` | PWA identity and icons. |
| `release-manifest.json` | Published-version check. |
| `icons/` | App, maskable, Apple touch, favicon, and source SVG icons. |
| `RC3_FEATURE_PATCH.diff` | Unified patch applied to the RC2 baseline before version bump. |
| `README.md` | Current project overview and release provenance. |
| `RELEASE_NOTES.md` | RC3.3 scope and retained RC3.2 response details. |
| `CHANGELOG.md` | Cumulative version history. |
| `KNOWN_ISSUES.md` | Current limits and deferred capabilities. |
| `TESTING_CHECKLIST.md` | Device and RC3.3 acceptance tests. |
| `TEST_REPORT.md` | Automated validation evidence. |
| `validation-status.json` | Machine-readable current release status. |
| `RELEASE_STATUS.md` | Release gate and required physical testing. |
| `BUILD_PROVENANCE.md` | Clean rebuild source and patch method. |
| `FILE_HASHES_SHA256.txt` | SHA-256 for every packaged file except itself. |
| `GITHUB_BROWSER_UPDATE.md` | Computer/browser deployment procedure. |
| `WORKING_COPY_UPDATE.md` | iPhone/iPad deployment procedure. |
| `start-local.sh` / `start-local.bat` | Local static server helpers. |
