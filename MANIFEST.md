# Known Issues and Deferred Capabilities

## RC3 test focus

RC3 adds inline assignment and question responses. Physical iPhone and iPad testing is still required for keyboard behaviour, long-answer layout, and Home Screen cache refresh.

### 1. Per-device data only

Profiles, counters, assignment responses, journals, badges, hotel confirmations, and notes remain local to the current phone, iPad, or browser. A backup copies state but does not merge two family members' entries.

### 2. Photo mission stores completion only

The app does not retain the actual photo yet. Photo storage, permissions, capacity, backup, and scrapbook attachment handling require a separate design.

### 3. Distances are planned values

Changing a hotel address updates Google/Apple Maps endpoints, but displayed kilometres and drive-time text remain the planned values in `road-data.js`.

**Planned:** supported routing provider, automatic recalculation, and an explicit scenic/manual override.

### 4. Live services are links

Weather, roads, borders, ferries, and fuel prices are not embedded. The app provides live-check links and keeps the core itinerary available offline.

### 5. GasBuddy

RC3 does not call an undocumented GasBuddy interface. A later release may provide open-in-GasBuddy/search links, vehicle range, and refuelling-area guidance while reserving direct live-price integration for an approved interface.

### 6. One visible Adventure

The data model supports an Adventures array, but RC3 does not expose a selector or builder.

### 7. Changing a profile's experience after use

A profile can be switched between Navigator and Explorer in Settings. Existing entries remain stored, but each mode intentionally shows its own missions, responses, and observation list. For the cleanest scrapbook, choose a mode for each person before the trip and keep it.

### 8. Assignment completion remains explicit

Entering an answer does not automatically check the assignment complete. This is intentional: a prediction may be entered before the task itself is finished. The traveller should check the assignment when it is actually complete.

### 9. Service-worker timing

After a GitHub Pages push, the installed Home Screen app may show the prior build until deployment completes and Refresh is tapped.

### 10. Browser storage

Clearing Safari site data or deleting the Home Screen web app may remove local progress. Export a backup before major changes.
