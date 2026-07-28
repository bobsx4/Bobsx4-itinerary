# Bobsx4 Road Companion v0.3.0 RC3.2 - Release Notes

RC3.2 is a clean rebuild from the known-good RC2 package. It preserves the distinct Navigator and Explorer experiences and adds the answer-capture capability requested during RC2 testing.

## Assignment responses

Assignments can now define one or more fields directly below the task. Examples include predicted and actual arrival times, a clear change caused by elevation, ferry queue and crossing times, the most valuable Glacier stop, Silverwood ride rankings, Kangaroo Creek Farm observations, landscape transitions, and route decisions.

The app supports text, multiline notes, time, number, and select fields. Responses save locally as they are entered. Completing the assignment checkbox remains a separate action.

## Fact responses

Questions in Cool Things to Know and Route Intelligence can be answered inline. Navigator sees **Field response** and Explorer sees **My answer**. These answers are also carried into Memories.

## Memories

Navigator responses appear under Assignment records and Route-intelligence responses. Explorer responses appear under Mission answers and Things I figured out.

## RC3.1 diagnostics retained

- The page can detect when `styles.css` was not loaded.
- A clear diagnostic banner appears instead of silently presenting an unstyled page.
- Versioned asset query strings and a new service-worker cache prevent prior runtime assets from being mixed into RC3.2.

## Data compatibility

The storage key and schema remain unchanged from RC2. Existing local hotel confirmations, notes, profiles, journals, checklists, sightings, ratings, and badges should remain. Export a backup before deployment.

## Deferred

Automatic route-distance recalculation, live family synchronization, actual photo storage, weather/fuel feeds, and multi-Adventure selection remain deferred. See `KNOWN_ISSUES.md`.
