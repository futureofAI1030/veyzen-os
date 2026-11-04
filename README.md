# VEYZEN OS — phone-first starter

This package contains the VEYZEN OS prototype plus:
- PWA manifest and app icons
- Offline service worker caching
- GitHub Actions workflow that can build a **debug APK in the cloud**

## Easiest phone-only route: install it as a home-screen app
1. Create a GitHub account if needed and make a **new public repository** named `veyzen-os`.
2. Upload the contents of this folder to the repository (not the outer folder itself). Include hidden `.github` folder if the upload interface allows it.
3. In the repository, open **Settings → Pages** and enable deployment from the `main` branch, root folder.
4. Wait for GitHub Pages to publish the site.
5. Open the published HTTPS address in Chrome on your Vivo phone.
6. Chrome menu (⋮) → **Install app** or **Add to Home screen**.
7. Open VEYZEN OS from its new home-screen icon. Once it has loaded online once, its app shell and saved notes/tasks can work offline.

## Build an Android APK without a computer
The included GitHub Actions workflow can build a debug APK on GitHub's cloud computers:
1. Upload all files, including `.github/workflows/android-apk.yml`, to the repository's `main` branch.
2. Open the repository's **Actions** tab.
3. Select **Build VEYZEN OS APK**, then **Run workflow** (or wait for the first push build).
4. When the run completes successfully, open the run and download the `veyzen-os-debug-apk` artifact.
5. Extract the downloaded artifact ZIP on your phone. Tap `app-debug.apk` to install. Android may ask you to allow installs from that browser/file manager; only allow it for this file if you trust the source.

## Limitations in this prototype
- The APK built by this workflow is a debug build, not a Play Store release-signed APK.
- Account login, registration and real-time friend messaging are not implemented yet. The current login button is a placeholder; Guest Mode works locally.
- The chat screen is a placeholder until a secure backend is configured.
- GitHub Pages repositories are public when using a public repository. Do not upload secrets, passwords, private messages or personal data.
- Never share your GitHub password or verification codes. Enable two-factor authentication.

## What's already functional
Dashboard, dual navigation, themes A–E + System Default, offline local notes, task planner, saved game list and network status.
