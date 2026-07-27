# v0.3.0 RC1 Testing Checklist

Use both the oldest daughter's iPhone and the youngest daughter's iPad where possible.

| Area | Required test | Pass criteria | Status |
|---|---|---|---|
| Installation | Open the live GitHub Pages URL and launch from the existing Home Screen icon | New interface opens without reinstalling | To test |
| Version/update | Confirm header and Settings show `v0.3.0 RC1`; tap Refresh | App reloads and remains on the same URL | To test |
| Migration | Open Stays after updating | Existing locally entered Lethbridge confirmation/details remain | To test |
| Countdown | Reopen on consecutive dates | Countdown/day number changes automatically | To test |
| Bottom navigation | Scroll long Adventure and Trip pages on iPhone | Navigation remains fixed to bottom and never drifts into page content | To test |
| iPhone layout | Open every primary section in portrait | No horizontal clipping; controls remain tappable | To test |
| iPad portrait | Open Adventure Mode | Layout uses the larger screen cleanly; no oversized phone-only appearance | To test |
| iPad landscape | Rotate while in Adventure Mode | Side navigation appears and two-column content remains usable | To test |
| Profiles | Rename Navigator/Explorer and switch between them | Name/tone changes; progress remains separate | To test |
| Missions | Check two missions for one profile | Progress bar and count update; other profile remains unchanged | To test |
| Road Quest | Add/subtract sightings | Counts never fall below zero and persist after closing/reopening | To test |
| Journal | Enter rating, favourite, food, purchase, surprise, and note | Values persist and appear in Memories | To test |
| Badge | Complete requirements and claim a day badge | Badge appears in Memories and remains claimed | To test |
| Teaser | Scroll to bottom of Adventure Mode | Tomorrow teaser is the final content section | To test |
| Stays | Add/edit a hotel and confirmation | Details persist locally; confirmation is not visible in repository source | To test |
| Route links | Save a hotel street address and open that day's route | Map uses the street address as endpoint | To test |
| Checklists | Check items and add/delete a custom item | Progress and custom items persist | To test |
| Backup | Export a backup, make a change, restore backup | Prior state returns without an error | To test |
| Offline | Open every section online, enable Airplane Mode, relaunch | App shell, itinerary, journals, counters, and memories remain available | To test |
| External links | Try official fact/live-check links while online | Link opens outside/alongside the app; Road Companion state remains intact | To test |

## Required results to advance to RC2

- No loss of existing local stay/confirmation data.
- No bottom-nav movement on either iPhone or iPad.
- No profile cross-contamination.
- Journal and Road Quest state persist across a full app close/reopen.
- Offline relaunch succeeds after one complete online load.
- No itinerary regressions in the ten current days.

Record device model, iOS/iPadOS version, orientation, issue description, and screenshot for any failure.
