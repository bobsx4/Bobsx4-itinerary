# Changelog

## v0.3.0 RC1 — 2026-07-27

### Added

- Home/Mission Control dashboard.
- Five-area navigation: Home, Trip, Adventure, Memories, Settings.
- Adventure-based data schema with an Adventures array.
- Two local Adventure profiles: Navigator and Explorer.
- Locally renameable profiles and selectable experience style.
- Profile-specific daily missions, briefings, photo prompts, and journal labels.
- Road Quest sighting counters with per-profile storage.
- Day ratings, field journals, daily badges, global badges, trip statistics, and scrapbook.
- Tomorrow teaser as the last Adventure section.
- Responsive iPhone and iPad layouts, including iPad landscape side navigation.
- Version badge, build date, update check, and manual refresh controls.
- Release manifest and v0.3.0 RC1 service-worker cache.
- v0.2 local-state migration.
- Backup/restore for the complete v3 local state.
- Official live-check links for parks, borders, roads, ferry, Silverwood, Victoria's Secret, and Kangaroo Creek Farm.

### Changed

- Rebuilt the interface and data model around Road Companion rather than a single itinerary page.
- Renamed the child-facing area to Adventure Mode.
- Updated itinerary to Kalispell July 31 and Coeur d'Alene August 1–3.
- Removed Missoula, the concert, and the Spokane Valley overnight.
- Removed Cabela's from the shopping list.
- Updated the Penticton/Clearwater day to include Kangaroo Creek Farm within the confirmed 9:00 AM–3:00 PM window.
- Updated Sandpoint–Nelson to intentionally use the Kootenay Lake Ferry route.
- Hotel addresses now alter the map link endpoints while displayed drive metrics remain the planned trip values.

### Fixed

- Bottom navigation is fixed to the viewport and respects iPhone safe areas.
- Departure countdown is recalculated from the device date whenever the app is rendered, focused, or restored from the background.
- Journal entries now immediately contribute to badge eligibility and Memories after the save debounce.
- New cache names prevent old and new app files from being mixed.
- Public source no longer includes a hotel confirmation number.

## v0.2.1 — 2026-07-27

- Added Kalispell July 31.
- Added two-night Coeur d'Alene base August 1–3.
- Removed Missoula/concert and Spokane Valley hotel.

## v0.2.0 — 2026-07-26

- Dynamic date countdown.
- Visible version information.
- Kootenay Lake Ferry routing.
- Hotel-address substitutions in map links.

## v0.1.x — 2026-07-26

- Initial static itinerary PWA.
- Local stays, notes, checklists, route links, and offline app shell.
