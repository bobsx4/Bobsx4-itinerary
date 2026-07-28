# Bobsx4 Road Companion

**Release:** v0.3.0 RC3.2 clean rebuild  
**Build date:** July 28, 2026  
**Hosting target:** GitHub Pages  
**Runtime:** Static HTML, CSS, and JavaScript; no Flask server or backend required.

Bobsx4 Road Companion is an offline-first family travel companion. It combines adult itinerary and stay tools with distinct Navigator and Explorer experiences, daily journals, Road Quest counters, assignment responses, badges, and a post-trip scrapbook.

## Clean rebuild provenance

RC3.2 was rebuilt from the user-supplied, known-good **v0.3.0 RC2** archive. The RC3 assignment-response functionality and RC3.1 asset diagnostics were then re-applied in a clean source tree. The unsuccessful RC3 and RC3.1 deployment packages are not used as the release base.

## Application areas

- **Home - Mission Control:** dynamic countdown, next day, readiness, quick actions, and active-profile progress.
- **Trip:** itinerary, route overview, hotel details, shopping/packing/border lists, and map links.
- **Adventure:** current-day content tailored to the active Navigator or Explorer profile.
- **Memories:** profile-specific statistics, badges, observations, ratings, assignment answers, and scrapbook entries.
- **Settings:** local profile names and experience styles, update controls, official live checks, backup/restore, notes, and local-data reset.

## Assignment and question responses

Assignments that need an answer include an expandable response panel directly beneath the assignment. Supported field types include text, multiline notes, time, number, and selected choices. Fact prompts can also be answered inline. Saved answers appear in Memories and remain separate for Navigator and Explorer.

## Current Adventure

**Northwest Adventure 2026**, July 30-August 8:

1. Edmonton to Lethbridge
2. Glacier National Park to Kalispell
3. Kalispell to Coeur d'Alene
4. Silverwood round trip from Coeur d'Alene
5. Coeur d'Alene to Spokane Valley shopping to Sandpoint
6. Sandpoint to Kootenay Lake Ferry to Nelson
7. Nelson to Penticton
8. Penticton to Kangaroo Creek Farm to Clearwater
9. Wells Gray / Mount Robson corridor to Hinton
10. Hinton to Berwyn

## Privacy and sharing

The public site contains only the app and public itinerary. Each phone or iPad keeps its own journals, badges, sightings, checklist state, hotel confirmations, notes, and assignment responses. Sharing the URL gives family members the same app but not the same local progress.

Use **Settings -> Export backup** before major updates or device cleanup.

## Updating GitHub Pages

- Computer/browser workflow: see `GITHUB_BROWSER_UPDATE.md`.
- iPhone/iPad Working Copy workflow: see `WORKING_COPY_UPDATE.md`.

## Current limits

- No automatic family-device synchronization.
- Photo missions store completion, not the image.
- Displayed kilometres and drive times are planned values and do not yet recalculate from hotel changes.
- Weather, traffic, ferry queues, border waits, and fuel prices remain links rather than embedded feeds.
- One Adventure is visible in the UI, although the data model supports multiple Adventures.
