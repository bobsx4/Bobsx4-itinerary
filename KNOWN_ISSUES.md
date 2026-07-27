# Known Issues and Deferred Capabilities

## RC1 test focus

### 1. Per-device data only

Profiles, counters, journals, badges, hotel confirmations, and notes stay on the current device. Opening the public URL on another phone or iPad starts a separate local history.

**Workaround:** export a backup from one device and restore it on another. This copies rather than merges the state.

### 2. Photo mission stores completion only

The app does not yet retain the photo itself. iOS photo/file storage and scrapbook attachment handling need a separate design and storage-capacity test.

### 3. Distances are planned values

Changing a hotel address updates Google/Apple Maps endpoints, but the displayed kilometres and drive-time text remain the planned values in `road-data.js`.

**Planned:** a supported routing provider, automatic recalculation, and an explicit manual/scenic-route override.

### 4. Live services are links

Weather, road conditions, border status, ferry service, and fuel prices are not embedded. The app provides official links and works offline with the last cached app data.

### 5. GasBuddy

RC1 does not call an undocumented GasBuddy API. A future release may provide open-in-GasBuddy/search links, vehicle fuel range, and refuelling-area guidance while reserving direct live-price integration for an approved interface.

### 6. One visible Adventure

The data file supports multiple Adventures, but RC1 does not yet expose an Adventure selector or builder.

### 7. Service-worker timing

After pushing to GitHub Pages, the old Home Screen instance may remain active until GitHub finishes deploying and the new service worker installs. Use the visible Refresh button after the live site shows the new release.

### 8. Browser storage

Clearing Safari website data or deleting the Home Screen web app may remove local progress. Export a backup before major updates or device cleanup.
