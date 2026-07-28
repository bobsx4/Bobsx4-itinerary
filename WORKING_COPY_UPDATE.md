# Update to v0.3.0 RC3 with Working Copy

Working Copy preserves name conflicts by creating numbered copies. To avoid `index-2.html` and `app-3.js`:

1. Export a backup from Road Companion.
2. Extract the RC3 ZIP in Files.
3. In the Working Copy repository root, delete the existing primary app and documentation files before import.
4. Delete obsolete numbered duplicates such as `index-2.html`, `app-3.js`, or `styles-2.css`.
5. Import the **contents inside** the extracted RC3 folder into the repository root.
6. Commit:

```text
Road Companion v0.3.0 RC3 - assignment responses and field notes
```

7. Push to `origin/main`.
8. Wait for GitHub Pages, then verify `v0.3.0 RC3` on the live site.
9. Open the Home Screen app and tap **Refresh**.
10. Confirm local hotel details, profile names, journals, and RC2 progress remain present.
