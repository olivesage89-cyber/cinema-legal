# Cozy room videos (account "cozy": IG _ceillo_77, TikTok elio_luize; Metricool blogId 7681065)
Approved 2026-10-28 (user: "yesssssss. every video has to be like that"): reference = slides/cozy-test-v3/video.mp4

## The format (follow exactly)
A faceless girl's cozy night-in routine that ends with Cinema picking the movie.
1. OPENING BURST: 5–8 flash cuts of 0.2s each, previewing the best moments (candle, pour, socks, the movie on the laptop…).
2. ROUTINE in JUMP CUTS: every moment is 2 short pieces of the SAME clip (0.5–0.8s each) showing progress —
   pajamas laid → smoothed; match struck → candle lit; cocoa pouring → cup full; marshmallows dropping → floating.
   Stills (no "motion") get a slow push-in and 0.6–0.9s. Total ~20–26 cuts. NEVER one action for long.
3. PHONE: her hands typing on her phone (screen NEVER visible — back of phone to camera), ~4s, while the see-through
   Cinema app (hologram, no phone frame) floats out beside the phone: search screen → mood typed → results.
4. MOVIE: laptop on a bed tray with treats in front, nobody touching it, playing the Top Result's trailer shots. 2 cuts, ~3.5s.
5. A small white caption centred near the top the whole time ("a cozy fall movie night", "pov: first snow night in"…).
Total 16–20s. Silent (the user adds a trending sound by hand).

## Logic rules (the user called these out)
- Every shot must make sense: real cozy actions, in an order that tells the night: outside/season → getting ready →
  candles → treats being made → settling in (socks/blanket) → phone picks the movie → movie plays.
- Nobody uses the laptop while the movie plays. No faces ever (crop if a chin/lips appear). Same outfit + room + nail
  colour within a video (put it in plan.style and in every prompt). Hands look natural; regenerate weird ones.
- Vary season/theme, room colours, treats, outfit and the movie every video. Warm, candlelit, aesthetic.

## Build (tools in this folder; Higgsfield key file on the Mac: /Users/sage/Cinema 2/Slideshows/_engine/.hf_key)
pip install --break-system-packages higgsfield-client httpx scipy; engine fonts: npm i @fontsource/inter in tools/slideshow
1. Pick theme + movie (fits the mood, well loved; check slides/used.txt). Get its official trailer with
   ../slideshow/trailers.py and pick 2 clean shots (no text) for the laptop.
2. Write W/plan.json (see example.plan.json): ~10–12 shots (6–8 with "motion"), the "phone" and "laptop" shots,
   caption, holo placement, cuts list [clip, start, dur] following the format above. Write W/app.json + TMDB posters
   (query = the mood, Top Results = the movie first + 4 fitting titles, 2 more rows) like appshot.js.
3. ENGINE=~/engine HF_KEY_FILE=<staged key> python3 cozyvid.py gen W   → LOOK at sheet.jpg; regenerate bad shots.
4. ... cozyvid.py vid W → LOOK at motion.jpg; choose the good 0.5–0.8s windows for the cuts list; redo bad clips.
5. ... cozyvid.py lap W → LOOK at lapchk.jpg (movie fills the screen, no green left). Set "crop" so the laptop is
   mid-size in frame with the treats visible.
6. ... cozyvid.py app W; then set plan.holo: pcx/pcy = phone centre in 1080x1920, x0/y0 = top-left of the panel
   on the EMPTY side of the phone (k≈0.6), so it floats beside the phone, not over her hands. cozyvid.py holo W → LOOK holochk.jpg.
7. ... cozyvid.py cut W → LOOK at cutsheet.jpg and frames; fix and re-cut until it feels like the reference.
Cost ≈ $2–3 per video (Kling 2.5 turbo 5s clips + Soul stills).

# Cozy SLIDESHOWS (approved 2026-10-28; reference slides/cozy-slides-sample/ 01…07)
"A night in" told through the screens in a faceless cozy room — NOT a plain film list.
1. Cover: AI cozy scene (bed by a rainy window, cocoa, candles, closed laptop…) + small white caption ("my rainy sunday movie night").
2. Slides 2–6: one movie each, PLAYING on a screen in a cozy scene (laptop on a bed tray, wall TV, laptop by fuzzy socks,
   tablet on a stand, projector on the wall…), caption = a time stamp + a short line in her voice
   ("9pm: paddington 2 because i deserve joy"). Vary the device and room every slide; same cozy world/palette within a post.
3. Slide 7: Cinema app (appshot.js) on the blurred cover; query = the night's mood; Top Results = the 5 movies. No text.
SCREEN RULE (user, twice): the WHOLE screen must be visible — NOTHING in front of or overlapping it. screen_slides.py
gen reports a fill score; use only fill >= 0.99 and LOOK. Prefer landscape screens so the movie isn't cropped. Remove green
spill (place does it) and check no green tint is left on blankets. Movie stills: beautiful, recognisable, no text (stills.py).
