# Yaseenis Hub

Mobile-first Islamic digital resource hub for the Yaseenis ecosystem.

## Included
- Tamil-first responsive homepage with resource-category search
- Links to the Yaseenis website and PDF Hub
- Progressive Web App manifest and service worker
- Installable on supported mobile browsers; previously cached app shell can open offline
- Search is currently over the category cards; external article/PDF content is not indexed inside this site yet

## Publish with GitHub Pages
1. Open **Settings → Pages** in this repository.
2. Choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then save.
3. Wait for GitHub Pages to publish. Use the exact URL shown in Pages settings.
4. For a custom domain, configure DNS and the custom domain in Pages settings. Do not assume the custom domain is connected until GitHub confirms it.

## Install on a phone
- iPhone: open the published HTTPS site in Safari → Share → Add to Home Screen.
- Android: open the published HTTPS site in Chrome → Install app / Add to Home screen.
The install prompt appears only in supported browsers and after the site meets PWA requirements.

## Content integration
The homepage currently links to existing Yaseenis pages. To show actual article and PDF results in unified search, the sources must expose a reliable feed/API or be indexed into a catalogue. No copyrighted books or media are copied into this repository.
