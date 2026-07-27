# Update Road Companion from a Computer

1. In the currently installed app, open **Settings → Export backup**.
2. Extract the RC2 ZIP on the computer.
3. Open the `Bobsx4-itinerary` repository on GitHub and confirm the `main` branch is selected.
4. Choose **Add file → Upload files**.
5. Drag the **contents inside** the extracted release folder into the upload area. Do not upload the ZIP or its enclosing folder.
6. Commit directly to `main` with:

```text
Road Companion v0.3.0 RC2 - distinct Navigator and Explorer experiences
```

7. Open **Actions** and wait for the Pages deployment to show a green check.
8. Open the live site and verify the header displays `v0.3.0 RC2`.
9. On each installed phone or iPad, open Road Companion and tap **Refresh**.
10. Confirm local hotel details and profile names remain present.

GitHub replaces files with matching paths. It does not create `index-2.html` or `app-3.js` duplicates when uploading through the browser.
