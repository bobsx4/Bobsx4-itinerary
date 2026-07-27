# Updating v0.2.x to v0.3.0 RC1 with Working Copy

Working Copy's Import action does not overwrite conflicts; it creates files such as `index-2.html` or `app-3.js`. Clean the repository root before importing this release.

## 1. Protect local app data

In the currently installed Road Companion:

1. Open **Settings**.
2. Tap **Export backup**.
3. Save the JSON file in Files.

The new app also migrates the existing v0.2 browser state automatically, but the backup is an extra safeguard.

## 2. Extract the release

In the iPhone/iPad Files app, tap the ZIP once. Open the extracted folder. You must import the **contents inside the folder**, not the ZIP and not the enclosing folder.

## 3. Clean the Working Copy repository root

In `Bobsx4-itinerary`, delete the old app files and all numbered duplicates before import:

- `index.html`, `index-2.html`, `index-3.html`, etc.
- `app.js` and `app-*.js`
- `trip-data.js` and `trip-data-*.js`
- `road-data.js` and `road-data-*.js`
- `styles.css` and `styles-*.css`
- `service-worker.js` and `service-worker-*.js`
- `manifest.webmanifest` and `manifest-*.webmanifest`
- old numbered copies of README/release/changelog/update/test files

Also remove the obsolete `trip-data.js`; v0.3 uses `road-data.js`.

Keep the repository itself. The `icons` folder may be deleted and replaced, or its files may be imported after deleting the old versions.

## 4. Import release contents

Use **Import** in Working Copy and select every item inside the extracted release folder. The repository root should then contain:

```text
index.html
app.js
road-data.js
styles.css
service-worker.js
manifest.webmanifest
release-manifest.json
icons/
README.md
CHANGELOG.md
RELEASE_NOTES.md
KNOWN_ISSUES.md
TESTING_CHECKLIST.md
WORKING_COPY_UPDATE.md
MANIFEST.md
TEST_REPORT.md
.nojekyll
```

There should be no numbered app files and no extra enclosing release folder.

## 5. Commit and push

Suggested commit message:

```text
Road Companion v0.3.0 RC1 - Adventure Mode foundation
```

Push to `origin/main`. In GitHub, wait for the Pages deployment to finish with a green check.

## 6. Activate the new build

1. Open the live GitHub Pages URL in Safari and confirm it displays `v0.3.0 RC1`.
2. Open the Home Screen app.
3. Tap the circular **Refresh** button in the top bar.
4. Open **Stays** and verify the local Lethbridge confirmation/details migrated.
5. Export another backup once the migration is confirmed.

You do not normally need to remove and re-add the Home Screen app because the URL, app ID, start URL, and scope remain unchanged.
