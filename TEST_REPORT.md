# v0.3.0 RC3.3 Test Report

**Build tested:** Bobsx4 Road Companion v0.3.0 RC3.3  
**Test date:** July 28, 2026  
**Baseline:** user-supplied v0.3.0 RC2 archive  
**Result:** Automated/static and headless interaction checks passed; physical iPhone/iPad acceptance remains required.

## RC3.3 focused checks

| Check | Result |
|---|---|
| JavaScript syntax: app, data, service worker | PASS |
| Event-day Live Check remains current | PASS |
| July 31 checks archive on August 1 | PASS |
| August 1/2 checks archive on their following days | PASS |
| August 3/4 checks archive on their following days | PASS |
| All checks archived after the trip | PASS |
| Adventure day strip centres horizontally without a window scroll | PASS |
| Adventure action preserves vertical window position | PASS |
| Other-view navigation retains scroll-to-top behaviour | PASS |

The 43 RC3.2 clean-rebuild checks below remain applicable because RC3.3 preserves the storage key, schema, profile/day/mission identifiers, response rendering, Memories, and offline architecture.

## Automated checks

| Test | Result | Detail |
|---|---|---|
| file:index.html | PASS | 25788 bytes |
| file:styles.css | PASS | 48812 bytes |
| file:app.js | PASS | 86981 bytes |
| file:road-data.js | PASS | 189787 bytes |
| file:service-worker.js | PASS | 1961 bytes |
| file:manifest.webmanifest | PASS | 716 bytes |
| file:release-manifest.json | PASS | 179 bytes |
| signature:index | PASS |  |
| signature:styles | PASS |  |
| signature:app | PASS |  |
| signature:data | PASS |  |
| signature:service-worker | PASS |  |
| version:index | PASS |  |
| version:release | PASS |  |
| version:service-worker | PASS |  |
| css-marker | PASS |  |
| css-responses | PASS |  |
| app-responses | PASS |  |
| data-response-assignment-count | PASS | count=71 |
| data-fact-id-count | PASS |  |
| no-markdown-runtime-swap | PASS |  |
| node-check:app.js | PASS |  |
| node-check:road-data.js | PASS |  |
| node-check:service-worker.js | PASS |  |
| road-data-evaluation | PASS |  |
| road-data-structure | PASS | {"assignments": 71, "completeModes": true, "days": 10, "facts": 40, "fields": 92, "profiles": 2, "version": "0.3.0 RC3.3", "versionCode": "0.3.0-rc3.3"} |
| browser-version | PASS |  |
| browser-css-loaded | PASS | '1' |
| browser-no-diagnostic | PASS |  |
| browser-no-errors | PASS | console=[]; page=[] |
| navigator-response-entry | PASS |  |
| navigator-fact-entry | PASS |  |
| response-does-not-auto-complete | PASS |  |
| responses-in-memories | PASS | JUL 30 Edmonton to Lethbridge  Edmonton, AB → Lethbridge, AB  No entry yet. Open this day in Adventure Mode to add field notes.  JUL 31 Glacier National Park to Kalispell  Lethbridge, AB → Kalispell, MT  ASSIGNMENT RECORDS Record one clear change caused by elevation: temperature, plants, snow, or cloud What changed with elevation?: Air became colder, trees gave way to alpine plants, and snow patches appeared near Logan Pass. ROUTE-INTELLIGENCE RESPONSES Which side of the pass looked wetter or greener today? The west side looked wetter and greener. AUG 1 Kalispell to Coeur d'Alene  Kalispell, MT → Coeur d'Alene, ID  No entry yet. Open this day in Adventure Mode to add field notes.  AUG 2 Silverwood from Coeur d'Alene  Coeur d'Alene, ID → Coeur d'Alene, ID  No entry yet. Open this day in Adventure Mode to add field notes.  AUG 3 Coeur d'Alene and Spokane shopping to Sandpoint  Coeur d'Alene, ID → Sandpoint, ID  No entry yet. Open this day in Adventure Mode to add field notes.  AUG 4 Sandpoint to Nelson  Sandpoint, ID → Nelson, BC  No entry yet. Open this day in Adventure Mode to add field notes.  AUG 5 Nelson to Penticton  Nelson, BC → Penticton, BC  No entry yet. Open this day in Adventure Mode to add field notes.  AUG 6 Penticton, Kangaroo Creek Farm, and Clearwater  Penticton, BC → Clearwater, BC  No entry yet. Open this day in Adventure Mode to add field notes.  AUG 7 Clearwater to Hinton  Clearwater, BC → Hinton, AB  No entry yet. Open this day in Adventure Mode to add field notes.  AUG 8 Hinton to Berwyn  Hinton, AB → Berwyn, AB  No entry yet. Open this day in Adventure Mode to add field notes. |
| explorer-mode-visible | PASS |  |
| explorer-hides-navigator-response | PASS |  |
| explorer-response-entry | PASS |  |
| local-state-created | PASS |  |
| navigator-response-persistence | PASS |  |
| explorer-response-persistence | PASS |  |
| profile-response-separation | PASS |  |
| ipad-render | PASS | [] |
| service-worker-shell-inventory | PASS |  |

## Verified feature inventory

- 10 travel days with complete Navigator and Explorer packs.
- 71 response-enabled assignments containing 92 structured fields.
- 40 fact/route-intelligence prompts with stable response IDs.
- Assignment answers save independently from completion checkboxes.
- Navigator and Explorer answers remain separate.
- Saved answers appear in the appropriate Memories headings.
- iPhone and iPad layouts rendered without page errors.
- RC3.3 asset versions and service-worker cache are internally consistent.

## Physical tests still required

- GitHub Pages deployment and no-diagnostic full styling.
- iPhone keyboard, safe area, portrait, and landscape.
- iPad portrait and landscape with the younger traveller.
- Offline Home Screen relaunch after one successful online load.
- Existing hotel, profile, journal, and RC3.2 progress retention.
