# Bobsx4 Road Companion

**Release:** v0.3.0 RC2  
**Build date:** July 27, 2026  
**Hosting target:** GitHub Pages  
**Runtime:** Static HTML, CSS, and JavaScript; no Flask server or backend required.

Bobsx4 Road Companion is an offline-first family travel companion. It combines the adult itinerary and stay tools with profile-based Adventure experiences, daily journals, Road Quest counters, badges, and a post-trip scrapbook.

## Application areas

- **Home — Mission Control:** dynamic countdown, next day, readiness, quick actions, and active-profile progress.
- **Trip:** itinerary, route overview, hotel details, shopping/packing/border lists, and map links.
- **Adventure:** current-day content tailored to the active Navigator or Explorer profile.
- **Memories:** profile-specific statistics, badges, observations, ratings, and scrapbook entries.
- **Settings:** local profile names and experience styles, update controls, official live checks, backup/restore, notes, and local-data reset.

## Navigator and Explorer are intentionally different

### Navigator

A co-pilot and field-reporter experience for an independent teen traveller:

- timing and route decisions;
- deeper route context;
- operational observations;
- deliberate photography;
- field notes and future-trip advice;
- Navigator credentials and dispatch-style teasers.

### Explorer

A visual adventure experience:

- direct missions;
- I-Spy Road Quest counters;
- animals, scenery, rides, signs, shops, ferries, and landmarks;
- quick facts and photo challenges;
- favourite moments, food, purchases, surprises, and memories;
- Explorer badges and next-day teasers.

Rename either profile locally in Settings. Names, journals, tallies, confirmation numbers, and notes remain on that device and are not published to GitHub.

## Current Adventure

**Northwest Adventure 2026**, July 30–August 8:

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

The public site contains only the app and public itinerary. Each phone or iPad keeps its own journals, badges, sightings, checklist state, hotel confirmations, and notes. Sharing the URL gives family members the same app but not the same local progress.

Use **Settings → Export backup** before major updates or device cleanup.

## Updating GitHub Pages

- Computer/browser workflow: see `GITHUB_BROWSER_UPDATE.md`.
- iPhone/iPad Working Copy workflow: see `WORKING_COPY_UPDATE.md`.

## Current limits

- No automatic family-device synchronization.
- Photo missions store completion, not the image.
- Displayed kilometres and drive times are planned values and do not yet recalculate from hotel changes.
- Weather, traffic, ferry queues, border waits, and fuel prices remain links rather than embedded feeds.
- One Adventure is visible in the UI, although the data model supports multiple Adventures.
