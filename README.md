# Movies Hub 🎬

A responsive movie-discovery website with a cinematic dark-blue interface, searchable catalogue, genre filters, language browsing, trailer links, and a locally saved watchlist.

## Features
- Mobile-first responsive layout
- Search by title, year, language, or genre
- Genre and language filters
- Browser-local favourites/watchlist
- Trailer discovery links
- Catalogue stored in `data/movies.json`
- No build step or package installation required

## Run locally
Open `index.html` in a browser, or use a static local server for best results (the JSON catalogue is loaded with fetch).

## Deploy with GitHub Pages
1. Open repository **Settings → Pages**.
2. Under Build and deployment, choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`, then save.
4. Wait for the deployment URL shown in Settings → Pages.

## Add or update titles
Edit `data/movies.json` and follow the existing JSON fields. Trailer links should point to official trailers or authorized sources. The initial catalogue is demo content; verify movie details and availability before publishing.

## Copyright and streaming
Movies Hub is a discovery catalogue. It does not host movie files or provide unauthorized copyrighted downloads. Use official trailers and licensed streaming or digital-store services. Metadata and imagery belong to their respective owners.

## Optional next step: live metadata
You can connect a movie metadata provider such as TMDB after configuring a permitted API key and following its attribution and usage terms. Do not commit API secrets to this public repository.