# Hyena Design

Responsive bento portfolio. Plain HTML, CSS, and JavaScript; no bundler or dependency install is required. GSAP and WarpKit are vendored locally.

## Preview and checks

Use Node.js 20 or newer:

```sh
npm start
npm test
```

The development server listens on `http://127.0.0.1:4173`. Open the site over HTTP; opening `index.html` directly cannot load the JSON carousel reliably.

## Editing

- `index.html`: homepage, selected work, contact, footer.
- `projects.json`: carousel titles, descriptions, thumbnails, categories, tech stacks, and optional project URLs.
- `css/`: shared styling, responsive layout, stickers and case studies.
- `js/`: carousel, cursor, scroll animations, sticker removal, existing analytics.
- `assets/stickers/`: custom sticker PNGs; preserve exact filename casing.
- `warpkit/`: exported runtime, scenes, posters, and portrait asset. The profile iframe intentionally isolates its pointer input from the hero.
- `nothing.html`, `promptly.html`, `blender-gallery.html`: retained case studies using the new design system.
- `about.html`, `contact.html`: compatibility redirects to homepage sections.

The carousel advances every five seconds, pauses during interaction and when hidden, and respects reduced motion. Stickers leave matching residue at 40% opacity; reloading restores them.

## Deployment

The existing `.github/workflows/deploy.yml` deploys the repository root to the existing FTP host on a push to `main`, using `FTP_USERNAME` and `FTP_PASSWORD` repository secrets. Development tools and package metadata are excluded from uploads. Nothing needs to be built before upload. The deploy action's normal tracked-file cleanup removes files from prior deployments; no destructive server cleanup option is enabled.

The public domain remains `https://hyenathedesigner.be/`. Canonical metadata, social preview, favicon, sitemap, email address, live project URLs, collaborator credit, and existing production analytics were preserved. No publication is performed by `npm start` or `npm test`.
