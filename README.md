# My Homepage (simple)

This is a minimal static homepage with:

- Blue gradient background
- "Hello, world!" intro
- Circular photo (placeholder at `assets/avatar.svg`) — replace with your photo
- A `Contact me` button (currently non-functional)

Quick preview (PowerShell):

```powershell
ii .\index.html
```

To use your own photo:

1. Put your image at `assets/me.jpg` (or update the `<img>` `src` in `index.html`).
2. The page will fall back to the SVG placeholder if `assets/me.jpg` is missing.
