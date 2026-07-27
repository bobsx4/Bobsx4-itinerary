# Bobsx4 Road Companion v0.3.0 RC1 — Release Notes

## Purpose of this release

v0.3.0 RC1 replaces the original itinerary-oriented interface with the first reusable **Road Companion architecture**. It is a substantial foundation release intended for iPhone and iPad testing before the Northwest Adventure begins.

## Headline additions

### New application architecture

The app is now organized around:

1. **Home / Mission Control**
2. **Trip**
3. **Adventure Mode**
4. **Memories**
5. **Settings**

A shared data/state engine sits underneath those areas so the itinerary, local stays, profiles, progress, and memories are not maintained as disconnected pages.

### Adventure Mode

Each travel day now includes:

- a Navigator briefing and an Explorer briefing;
- profile-appropriate missions;
- official or route-relevant field facts;
- a photo mission;
- Road Quest counters with an honor-system reminder;
- a five-star day rating;
- quick journal fields for the best moment, food, purchases, surprises/funny moments, and future notes;
- a day badge with transparent unlock requirements;
- a next-day teaser as the final section on the page.

### Age-appropriate profile design

The Navigator experience deliberately avoids a childish tone. It emphasizes route reasoning, photography, timing, observation, and reflection. The Explorer experience is more visual and direct without using cartoon mascots, XP, or juvenile language.

### Memories

Progress is now transformed into a profile-specific scrapbook with:

- day ratings;
- journal entries;
- Road Quest totals;
- photo-mission completion;
- day badges;
- cumulative achievement badges;
- overall trip statistics.

### Responsive design

- Fixed iPhone bottom navigation with safe-area handling.
- Two-column Adventure Mode and card layouts on iPad-sized screens.
- Left navigation rail on wide iPad/desktop landscape screens.
- Reduced-motion support.
- Print view for the itinerary.

### Update controls

- Visible version number in the header and Settings.
- Refresh button in the header, Home quick actions, and Settings.
- Published-version check through `release-manifest.json`.
- New versioned service-worker cache.

### Privacy and migration

- Profile names, journals, counters, badges, hotel confirmations, and notes remain local.
- Existing v0.2 local stays, checklists, notes, and completed-day state are migrated from `northwest-road-trip-2026-state-v1` into the v3 state model.
- No hotel confirmation number is present in the public source.

## Itinerary included in RC1

The concert/Missoula plan and Spokane Valley hotel have been removed. The current route uses Kalispell on July 31 and Coeur d'Alene on August 1–3, followed by Sandpoint, the Kootenay Lake Ferry, Nelson, Penticton, Kangaroo Creek Farm, Clearwater, Hinton, and home.

## Deliberately deferred

- Automatic route-distance recalculation.
- Approved GasBuddy/live-fuel integration.
- Shared cloud state and family voting.
- Stored photo attachments.
- Live GPS progress and geofenced notifications.
- Weather and traffic feeds.
- Adventure builder and visible multi-Adventure selector.

These are architectural follow-ons rather than RC1 blockers.
