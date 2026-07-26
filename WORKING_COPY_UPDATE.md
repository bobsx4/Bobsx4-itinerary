# Updating Bobsx4 Road Companion with Working Copy

## Import the release

1. In the iOS **Files** app, tap `Bobsx4_Road_Companion_v0.1.3_repo-ready.zip` to extract it.
2. Open the extracted folder.
3. Tap **Select**, then **Select All**.
4. Tap **Share** and choose **Working Copy**, or use Working Copy's **Import Files** command from inside the repository.
5. Choose the existing `Bobsx4-itinerary` repository as the destination.
6. Import into the repository root, not into a new subfolder.
7. Allow Working Copy to replace files with matching names.

## Review and publish

1. Open the repository's changed-files view.
2. Confirm that files such as `index.html`, `trip-data.js`, `service-worker.js`, and `styles.css` appear at the repository root.
3. Commit using:

   `Road Companion v0.1.3 - repository-ready update`

4. Push the commit to GitHub.
5. Wait one or two minutes for GitHub Pages to redeploy.
6. Open the site in Safari and refresh once while online.
7. If the Home Screen app still shows the old release, close it completely and reopen it. The new service-worker cache is `northwest-road-trip-v0.1.3`.

## Quick correctness check

- App version shows `0.1.3` under More/About.
- Night 1 shows Holiday Inn Express Lethbridge Southeast.
- Night 4 shows Spokane Valley.
- Bottom navigation remains attached to the bottom while content scrolls.
