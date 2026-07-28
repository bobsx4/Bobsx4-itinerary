# v0.3.0 RC3 Test Report

**Build tested:** Bobsx4 Road Companion v0.3.0 RC3  
**Test date:** July 27, 2026  
**Result:** Static validation and headless interaction/rendering checks passed; physical iPhone/iPad persistence and keyboard acceptance remain required.

## Automated and static checks

| Test | Result | Notes |
|---|---|---|
| JavaScript syntax | PASS | `app.js`, `road-data.js`, and `service-worker.js` passed `node --check`. |
| HTML IDs | PASS | 126 IDs; all unique. |
| Adventure data | PASS | 10 days and complete Navigator/Explorer mode packs. |
| Mission metadata | PASS | 98 total assignments; IDs unique within each day/mode. |
| Response coverage | PASS | 71 assignments contain 92 structured response fields. |
| Response types | PASS | Text, textarea, time, number, and select metadata validated. |
| Fact metadata | PASS | 40 fact/route-intelligence cards have stable response IDs. |
| Published version | PASS | App data, index, release manifest, script query strings, and cache use RC3. |
| Privacy | PASS | The private Lethbridge confirmation number is absent from public source. |
| Offline inventory | PASS | Service worker uses `bobsx4-road-companion-v0.3.0-rc3` and caches RC3 asset URLs. |

## Headless interaction checks

| Test | Result | Notes |
|---|---|---|
| Navigator response rendering | PASS | July 31 displayed response panels for estimate, elevation, park priority, and arrival/delay assignments. |
| Elevation notation | PASS | The “clear change caused by elevation” assignment accepted a multiline field response. |
| Save feedback | PASS | Entering an answer changed the panel status to `Saved on this device`. |
| Fact response | PASS | Route Intelligence question accepted an inline Field response. |
| In-session persistence | PASS | Assignment answer remained after leaving and reopening the Adventure view. |
| Memories integration | PASS | Assignment and Route Intelligence answers appeared in the July 31 scrapbook card. |
| Profile separation | PASS | Navigator answer survived profile switching; Explorer answer remained invisible when returning to Navigator. |
| Explorer response rendering | PASS | Explorer favourite-view assignment displayed its own answer control. |
| Mobile rendering | PASS | Response UI rendered at 390×844 without horizontal overflow. |
| iPad rendering | PASS | Response UI rendered in the 1024×1366 two-column layout. |
| JavaScript page errors | PASS | No page errors occurred during profile-switch and response-entry interaction tests. |

## Preview captures

- `rc3_assignment_answers_mobile.png` — Navigator July 31 response flow on a phone-sized viewport.
- `rc3_assignment_answers_ipad.png` — Navigator July 31 in the iPad two-column layout.

The preview harness used an opaque headless document, so it could verify in-session state and rendering but could not provide a reliable cross-reload browser-storage test. Real Safari/Home Screen storage remains part of physical-device acceptance.

## Physical-device tests still required

- GitHub Pages deployment and Home Screen Refresh to RC3.
- Existing RC2 hotel, journal, checklist, and profile data preservation.
- Cross-close/reopen persistence of assignment and fact responses in Safari/PWA storage.
- iPhone keyboard behaviour with long response panels.
- iPad portrait and landscape review.
- Offline response entry after one online load.
- Tone and usefulness review by both travellers.
