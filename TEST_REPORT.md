# v0.3.0 RC1 Test Report

**Build tested:** Bobsx4 Road Companion v0.3.0 RC1  
**Test date:** July 27, 2026  
**Result:** Automated/static release checks passed; physical iPhone/iPad testing remains required before promotion.

## Automated checks completed

| Test | Result | Notes |
|---|---|---|
| JavaScript syntax | PASS | `app.js`, `road-data.js`, and `service-worker.js` passed `node --check`. |
| Adventure data validation | PASS | 1 Adventure, 10 sequential days, 2 profiles, 14 available badges, unique mission/spotting IDs, required briefings/facts/photo prompts/teasers. |
| Manifest consistency | PASS | App identity, scope/start URL, version code, icons, and data schema agree across source files. |
| Offline shell inventory | PASS | Service worker includes the app shell and uses cache `bobsx4-road-companion-v0.3.0-rc1`. |
| Runtime rendering smoke test | PASS | Five views rendered; v0.3.0 RC1 displayed; dynamic July 27 countdown rendered as 3 days; current/next day selected correctly. |
| Adventure interaction smoke test | PASS | Missions, Road Quest counters, rating, journal, badge eligibility/claim, profile switch, and scrapbook rendering passed. |
| Local hotel test | PASS | Hotel name/address/confirmation saved to local storage and changed route links. |
| v0.2 migration test | PASS | Legacy local hotel confirmation, notes, completed day, and custom list item migrated to schema 3. |
| Privacy/source scan | PASS | No real confirmation number or work-project terms in public release source. Obsolete concert and Cabela's itinerary content absent from `road-data.js`. |
| HTML structure | PASS | 104 IDs, all unique. Tomorrow teaser appears after the full Adventure grid. |
| Asset inventory | PASS | Required app files and icons exist and are non-empty. PNG dimensions match manifest declarations. |
| Local HTTP delivery | PASS | App shell, scripts, stylesheet, service worker, manifest, release manifest, and icon returned HTTP 200 from a local static server. |

## Runtime smoke-test outcome

```text
Version: 0.3.0 RC1
Countdown on 2026-07-27: 3 days
Views rendered: 5
Day badge: claimed successfully
Profile switch: Navigator → Explorer
Local hotel save: passed
Legacy migration: passed
```

## Tests that require the family's devices

A simulated/static environment cannot fully verify Safari PWA behaviour, iPhone safe-area rendering, iPad rotation, Home Screen cache activation, keyboard behaviour, or offline relaunch on iOS/iPadOS. Those items are intentionally listed in `TESTING_CHECKLIST.md` and are the primary RC1 acceptance tests.

## Promotion recommendation

Keep this build at **RC1** until:

- the existing Lethbridge local confirmation is confirmed after migration;
- bottom navigation remains fixed during long scrolls on iPhone;
- iPad portrait and landscape layouts pass visual review;
- profile data remains separate across repeated use;
- offline Home Screen relaunch passes after one online load.
