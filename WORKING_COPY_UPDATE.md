# Update through Working Copy

Working Copy imports duplicate names instead of overwriting them. For this release:

1. Keep your `icons` folder.
2. In the repository root, delete the existing unsuffixed app files: `index.html`, `app.js`, `trip-data.js`, `styles.css`, `service-worker.js`, `manifest.webmanifest`, and the Markdown release files.
3. Delete obsolete numbered duplicates such as `index-2.html`, `index-3.html`, `app-2.js`, and `app-3.js`.
4. Import the contents of this package into the repository root.
5. Confirm the new files have their normal unsuffixed names.
6. Commit: `Road Companion v0.2.0`
7. Push, wait for GitHub Pages to finish, then open the site in Safari once.

Local hotel confirmations and checkmarks are stored in browser data and are not in these repository files.
