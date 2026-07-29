# Update Road Companion from a Computer

This is a clean replacement of the runtime files, not a partial hotfix.

1. In the installed app, open **Settings -> Export backup**.
2. Extract the RC3.3 ZIP.
3. Open `Bobsx4-itinerary` on GitHub and confirm `main` is selected.
4. Choose **Add file -> Upload files**.
5. Drag the **contents inside** the extracted folder into the upload area.
6. Confirm these are listed as replacements: `index.html`, `styles.css`, `app.js`, `road-data.js`, `service-worker.js`, `manifest.webmanifest`, and `release-manifest.json`.
7. Commit directly to `main` with:

```text
Road Companion v0.3.0 RC3.3 - Live Checks and Adventure scroll
```

8. Wait for the Pages action to show a green check.
9. Open the live site once with `?clean=rc3-3` appended.
10. Verify `v0.3.0 RC3.3`, full styling, and no red diagnostic banner.
11. Open each installed Home Screen app and tap **Refresh**.
12. Confirm local hotel details, profiles, journals, and RC2 progress remain.
