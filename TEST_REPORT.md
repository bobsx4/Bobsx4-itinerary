# v0.3.0 RC2 Test Report

**Build tested:** Bobsx4 Road Companion v0.3.0 RC2  
**Test date:** July 27, 2026  
**Result:** Automated/static and headless responsive rendering checks passed; physical iPhone/iPad acceptance remains required.

## Automated checks

| Test | Result | Notes |
|---|---|---|
| JavaScript syntax | PASS | `app.js`, `road-data.js`, and `service-worker.js` passed `node --check`. |
| HTML IDs | PASS | 126 IDs; all unique. |
| Adventure data | PASS | 10 days; every day contains complete Navigator and Explorer mode packs. |
| Mode distinction | PASS | Every day has different briefings, missions, observations, photo prompt, badge, and teaser by mode. |
| Mission/observation IDs | PASS | Unique within each day/mode pack. |
| Published version | PASS | App data, index, release manifest, script query strings, and cache use RC2. |
| Mobile runtime | PASS | Navigator and Explorer rendered and switched successfully at 390×844. |
| Navigator runtime | PASS | `Navigator briefing`, `Navigator assignments`, `Field log`, Navigator-specific mission/observation/badge rendered. |
| Explorer runtime | PASS | `Today's adventure`, `Today's missions`, `Road Quest`, Explorer-specific mission/sighting/badge rendered. |
| Responsive iPad | PASS | Two-column Adventure layout rendered at 1180×820. |
| Mode-aware metrics | PASS | App code counts only the active mode's visible missions and observations. |
| Interaction separation | PASS | Navigator progress survived profile switching; Explorer opened with zero independent progress and its own badge. |
| Mobile section order | PASS | Navigator and Explorer rendered different card order on the same day. |
| State compatibility | PASS | Storage schema remains v3; existing hotels, confirmation numbers, names, journals, and checks remain compatible. |
| Offline inventory | PASS | Service worker uses `bobsx4-road-companion-v0.3.0-rc2` and caches RC2 asset URLs. |

## Runtime comparison captured

```text
Navigator:
Navigator briefing | Navigator assignments | Field log
First assignment: Predict the Lethbridge arrival time before leaving Edmonton
First observation: Major highway interchange
Badge: Launch Coordinator

Explorer:
Today's adventure | Today's missions | Road Quest
First mission: Choose the first official road-trip song
First sighting: Grain elevator
Badge: Open-Road Scout
```

## Physical-device tests still required

- Safari/Home Screen refresh after GitHub Pages deployment.
- iPhone safe-area and keyboard behaviour.
- iPad portrait and landscape review by the younger traveller.
- Tone review by the oldest traveller: Navigator should feel teen-appropriate rather than childish.
- Offline relaunch after one online load.
- Existing local Lethbridge reservation migration.
