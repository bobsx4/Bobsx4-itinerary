# Update to v0.3.0 RC2 with Working Copy

Working Copy preserves name conflicts by creating numbered copies. To avoid `index-2.html` and `app-3.js`:

1. Export a backup from Road Companion.
2. Extract the RC2 ZIP in Files.
3. In the Working Copy repository root, delete the existing primary app files before import:

```text
index.html
app.js
styles.css
road-data.js
service-worker.js
manifest.webmanifest
release-manifest.json
README.md
RELEASE_NOTES.md
CHANGELOG.md
KNOWN_ISSUES.md
MANIFEST.md
TESTING_CHECKLIST.md
TEST_REPORT.md
GITHUB_BROWSER_UPDATE.md
WORKING_COPY_UPDATE.md
```

4. Delete any obsolete numbered duplicates such as `index-2.html`, `app-3.js`, or `styles-2.css`.
5. Import the **contents inside** the extracted RC2 folder into the repository root.
6. Commit:

```text
Road Companion v0.3.0 RC2 - distinct Navigator and Explorer experiences
```

7. Push to `origin/main`.
8. Wait for GitHub Pages, then verify `v0.3.0 RC2` on the live site.
9. Open the Home Screen app and tap **Refresh**.
