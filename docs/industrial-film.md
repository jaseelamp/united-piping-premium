# Industrial perspective — continuous film asset

The former “Every connection starts on paper” homepage panel is now a cinematic industrial feature at `#industrial-perspective`. It currently displays the static `dist/assets/pipe-hero.jpg` poster. There is no slideshow, simulated camera movement, or placeholder playback button. The separate illustrated engineering hero remains above it.

## Delivery brief (15 seconds, seamless loop)

- 00–03: Dark macro shot of a large steel pipe; a beam of light reveals its metallic texture.
- 03–06: Move through the pipe opening into a large industrial environment.
- 06–09: Close-up of precision machining, inspection, or an industrial component.
- 09–12: Wide industrial infrastructure shot communicating scale.
- 12–15: Return to a dark circular pipe composition matching the first frame.

Create one continuous, visually coherent background film. Do not substitute a carousel or rapidly changing unrelated stock images. Match lighting, color grade, camera direction and the closing/opening composition. No text baked into the film, no audio required. Use cleared footage; do not imply depicted facilities belong to United Piping.

## Installation

Export 1920×1080 H.264 MP4, yuv420p, fast-start metadata, approximately 24–30fps. Prefer under 8 MB. Put the finished file at `dist/assets/industrial-perspective.mp4`, then set `industrialFilmSrc` in `dist/data/config.json` to `/assets/industrial-perspective.mp4`. This configuration is preserved by `build.py`. No file or URL is configured until a finished film is available.

The implemented video slot uses muted, inline, loop playback. It pauses when offscreen, in background tabs, with the global motion switch, or with its own pause control. Reduced-motion preferences and loading/playback failures retain the static poster. Verify all five beats, seamless looping, pause/resume and mobile cropping before publishing the film.

## Beyond Supply imagery

Each service selects a different static image with its accordion: material surface treatment, the supplied pipe inspection photo, warehouse pipe bundles, and technical document binders. The three illustrative scenes reuse the existing site image sheet `dist/assets/industries.jpg`; inspection uses `dist/assets/inspection-engineer.jpg`. These are user-selected service views, not an automatic slider.
