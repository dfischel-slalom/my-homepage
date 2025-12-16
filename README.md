# My Homepage

Static single-page site with a photo card, weather widget, and contact modal.

## Features
- Weather from Open-Meteo (no API key) with city dropdown (Seattle, LA, Boston, Waterloo), condition icon, wind/temp, and themed background art.
- Dynamic hero art + gradient that swap with the weather; clear sky also plays `assets/BruceHappy.mp3` (loops, stops when not clear).
- Contact form opens in a modal, validates subject/message, and launches a mailto link to `doug.fischels@slalom.com` with a brief thank-you toast.
- Avatar hover/focus swap between `assets/me.jpeg` and `assets/me2.jpg`.

## Run locally
- PowerShell preview: `ii .\index.html` (or open the file directly in a browser).
- No build step required; everything is static. Keep the `assets/` folder alongside the HTML for images/audio.

## Notes for deployment
- Works on static hosts like Vercel. Ensure `assets/BruceHappy.mp3`, `assets/me.jpeg`, and `assets/me2.jpg` are deployed. The weather API is public and client-side. Autoplay may need a user click depending on browser policy.
