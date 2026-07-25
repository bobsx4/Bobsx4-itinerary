# Northwest Family Road Trip 2026 - PWA v0.1.0

This is a static, offline-capable Progressive Web App. It does not use Python, Flask, a database, or a continuously running server.

## What is included

- Ten-day itinerary from Edmonton to Berwyn
- Daily distances, approximate drive times, route notes, and map buttons
- Glacier, concert, Silverwood, shopping, Kootenay, Okanagan, Wells Gray, and return-home planning
- Editable hotel and confirmation details
- Shopping, packing, border, and readiness checklists
- General and daily notes
- Local device storage
- JSON backup and restore
- Offline app shell after the first successful online load
- Google Maps daily routes and Apple Maps point-to-point links
- Official live-check links for roads, Glacier, the concert, Silverwood, the border, and Victoria's Secret

## Fastest way to publish it

GitHub Pages is free and does not require a server process.

1. Sign in to GitHub on a computer.
2. Create a new repository, such as `northwest-road-trip-2026`.
3. Extract this ZIP and upload every file and folder in this directory to the repository root.
4. Open the repository's **Settings**.
5. Select **Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select the `main` branch and `/ (root)`, then save.
8. Wait for GitHub to show the published HTTPS address.
9. Open that address in Safari on the iPhone.
10. Tap **Share**, choose **Add to Home Screen**, and tap **Add**.
11. Open the new Home Screen icon once while online so the offline files can finish caching.

## Test it on a computer before publishing

### Windows

Double-click `start-local.bat`. If Windows asks which Python command to use, install Python or run:

```text
python -m http.server 8765
```

Then open:

```text
http://localhost:8765
```

### macOS or Linux

In Terminal, enter this folder and run:

```text
./start-local.sh
```

Or run:

```text
python3 -m http.server 8765
```

Then open `http://localhost:8765`.

A local preview is useful, but Home Screen installation and reliable offline caching require HTTPS. GitHub Pages supplies HTTPS automatically.

## Data and privacy

The app has no account, analytics, advertisements, or remote database. Hotel details, confirmation numbers, notes, and checkmarks are saved in the browser's local storage.

Export a backup after entering important details. Clearing Safari website data or deleting the Home Screen app can remove locally stored information.

## Offline behaviour

After the app is published and opened successfully while online, the interface and preloaded itinerary are cached. Notes, hotel details, and checklists work without service.

These features still require internet access:

- Google Maps and Apple Maps navigation
- Official road, park, border, venue, and store pages
- Live traffic, weather, closures, and wildfire information

## Updating the itinerary

Most trip content is in `trip-data.js`. Edit that file to change dates, routes, stops, checklist items, and official links.

When publishing a new app version, also update:

- `version` in `trip-data.js`
- `CACHE_NAME` in `service-worker.js`
- the version entry in `CHANGELOG.md`

Changing the cache name makes installed copies retrieve the new app files.

## Current route assumptions

The app treats all distances and drive times as planning estimates. It explicitly leaves room for border processing, meals, park traffic, construction, sightseeing, weather, and wildlife delays.

The route dashboard includes a live-check section. Recheck the official sources immediately before each major travel day.
