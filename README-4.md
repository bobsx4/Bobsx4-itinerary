# Bobsx4 Road Companion v0.1.3

Personal, offline-capable Progressive Web App for the Northwest Loop 2026 road trip.

## Repository-ready release

This folder is the complete GitHub repository root. Do not upload the enclosing ZIP folder as a subfolder.

For Working Copy on iPhone or iPad:

1. Unzip the release in the Files app.
2. Open the `Bobsx4-itinerary` repository in Working Copy.
3. Choose **Import Files** and select every item inside this extracted folder.
4. Confirm replacement of existing files.
5. Review the changed-files list.
6. Commit with a message such as `Road Companion v0.1.3`.
7. Push to GitHub.

Detailed instructions are in `WORKING_COPY_UPDATE.md`.

## Included app features

- Offline app shell after the first successful online load
- Daily itinerary and route links
- Checklists and travel notes stored on the device
- Hotel and reservation cards
- JSON backup and restore
- GitHub Pages deployment support
- iPhone safe-area and bottom-navigation handling

## Important privacy note

GitHub Pages sites and public repositories expose committed source data. Avoid committing reservation confirmation numbers or other sensitive travel details unless you are comfortable with them being publicly readable. Local notes entered inside the app remain on the device unless exported.

## Updating itinerary data

Most trip content lives in `trip-data.js`.

For every release, update together:

- `version` in `trip-data.js`
- `CACHE_NAME` in `service-worker.js`
- the visible fallback version in `index.html`
- `CHANGELOG.md`
- `RELEASE_NOTES.md`

Changing the service-worker cache name forces installed copies to retrieve the new files.
