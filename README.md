# Bobsx4 Road Companion

**Release:** v0.3.0 RC1  
**Build date:** July 27, 2026  
**Hosting target:** GitHub Pages  
**Runtime:** Static HTML, CSS, and JavaScript; no Flask server or backend required.

Bobsx4 Road Companion is an offline-first family travel companion. It combines the adult itinerary and stay tools with a profile-based Adventure Mode, daily field journals, Road Quest counters, badges, and a post-trip scrapbook.

## Application areas

- **Home — Mission Control:** dynamic departure/trip countdown, next day, readiness, quick actions, and active-profile progress.
- **Trip:** itinerary, route overview, hotel details, shopping/packing/border lists, and one-tap map links.
- **Adventure:** a profile-adapted current-day briefing, missions, field facts, photo mission, Road Quest counters, journal, badge, and the next-day teaser at the bottom.
- **Memories:** profile-specific trip statistics, badge collection, and a day-by-day scrapbook.
- **Settings:** local profile names and experience styles, install/update controls, official live checks, backup/restore, general notes, and local-data reset.

The hidden travel engine controls dates, current-day selection, itinerary data, hotel inheritance, map endpoints, local state, migrations, profiles, badges, and offline caching.

## Profiles

The public source ships with neutral names:

- **Navigator:** independent tone, deeper prompts, route tasks, photography, and reflection.
- **Explorer:** more visual/direct prompts, spotting, and straightforward reflections.

Rename either profile locally in Settings. Names, journals, tallies, confirmation numbers, and notes are stored in that device's browser and are not published to GitHub.

## Current adventure

The included adventure is **Northwest Adventure 2026**, July 30–August 8:

1. Edmonton → Lethbridge
2. Glacier National Park → Kalispell
3. Kalispell → Coeur d'Alene
4. Silverwood round trip from Coeur d'Alene
5. Coeur d'Alene → Spokane Valley shopping → Sandpoint
6. Sandpoint → Kootenay Lake Ferry → Nelson
7. Nelson → Penticton
8. Penticton → Kangaroo Creek Farm → Clearwater
9. Wells Gray / Mount Robson corridor → Hinton
10. Hinton → Berwyn

## Privacy and sharing

The GitHub Pages site is public, but personal entries are local to each browser profile. Sharing the site URL gives each family member the same app and itinerary, but **not** the same journals or progress. Each device develops its own Adventure profile history.

Use **Settings → Export backup** to create a JSON copy of local data. A backup can be moved to another device and restored there, but RC1 does not merge two people's entries.

## Local testing

Run a local static server from the repository root:

- Windows: `start-local.bat`
- macOS/Linux: `./start-local.sh`

Then open `http://localhost:8080/`.

Opening `index.html` directly from Files is not a complete PWA test because service workers require an HTTP/HTTPS origin.

## Updating GitHub Pages

See `WORKING_COPY_UPDATE.md`. Working Copy preserves conflicting filenames by adding suffixes, so existing root app files and numbered duplicates must be removed before importing a release.

## Important limits in RC1

- Progress and journals do not synchronize automatically across family devices.
- The photo mission records completion but does not store the actual image.
- Distances are planned values in the adventure data; hotel addresses improve map endpoints but do not yet recalculate the displayed kilometre/time estimates.
- Live weather, live traffic, ferry queues, border waits, and fuel prices are links/placeholders rather than embedded feeds.
- Only one Adventure is included in the UI, although the data model supports an array of Adventures.

See `KNOWN_ISSUES.md`, `TESTING_CHECKLIST.md`, and `RELEASE_NOTES.md` for more detail.
