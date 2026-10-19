# Image and startup optimization

- Carousel variants: maximum 1280 × 1280, proportional resizing without enlargement, WebP quality 88. Nine converted thumbnails total 912,764 bytes versus 8,390,009 bytes for their sources. Already-small images are retained when conversion offers little benefit.
- Full artwork links retain their original files through the optional `artwork` property in `projects.json`.
- PNG display assets use lossless WebP; JPEG display variants use WebP quality 90. Only smaller candidates referenced by the site were retained. Originals remain available.
- Nothing OS's animation uses lossless animated WebP: 7,111,910 bytes versus 9,167,140 bytes. Decoded RGBA hashes matched at every original 100 ms interval; total duration and infinite looping are preserved. The encoder merged one duplicate frame and retained its duration.
- The 64 × 64 PNG favicon is 9,014 bytes versus the original 251,388-byte SVG. The SVG source is retained.
- The homepage preloads the existing hero poster and Styro font. WarpKit starts after two animation frames and a browser idle opportunity (700 ms timeout), preserving the poster while loading. Case-study images below the cover use lazy loading.

## Shader audit

WarpKit 1.4.0 already stops animation outside its intersection margin and in hidden documents, honors reduced-motion preferences, and caps pixel ratio at 1 on coarse pointers, 1.25 on WebGL, and 1.5 on WebGPU. The renderer disables antialiasing. Its supported attributes include `paused` and `motion`; there is no exposed quality setting.

The vendor runtime and both scene payloads were left unchanged. No shader layers, effects, scene resolution, speed, or pointer-isolation iframe were removed. Optimizing their math or changing resolution requires live GPU profiling and visual comparison first.

## Verification and limits

`npm test` covers local asset delivery, project links, carousel interactions, and runtime-before-scene bootstrap sequencing after paint/idle. The byte reports in this directory record generated variants.

No measured LCP or GPU/frame-rate improvement is claimed: live browser measurement and shader visual comparison were unavailable due to the browser access restriction. The deferred bootstrap also intentionally delays the start of live animation while retaining the poster. Compare cold-cache homepage LCP and both interactive scenes on target devices before assessing production results.
