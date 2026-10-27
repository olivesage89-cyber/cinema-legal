# Cinema slideshow engine

## Most important rule: VARY THE LOOK
The user does NOT want one template repeated. Every slideshow gets its own design that fits its mood.
render2.js ("film poster" look: script + serif, butter yellow, film grain) is ONE example, not the template.
For each new slideshow, design a fresh look: copy render2.js to render_<slug>.js and change it freely —
fonts (any @fontsource family: e.g. Playfair, DM Serif, Bodoni Moda, Caveat, Homemade Apple, Mrs Saint Delafield,
Anton, Bebas Neue, Inter), text colour, layout (full-bleed, collage of 2–3 stills on paper, framed with a border,
letterbox bars, polaroid, magazine), colour grade (warm, cool, B&W, faded, high-contrast), text position.
Don't repeat the previous slideshow's look (record a one-line style note in used.txt so the next run can avoid it).
Quality bar = the user's references: MUBI / Blackbars / film-account posts that make you stop scrolling.
Approved examples: https://getcinema.app/slides/sweater-weather-v2/ (01_cover.jpg … 07_cinema.jpg).

## Cover vs inside slides
The COVER is the hook — make it a stunning film-poster image (one gorgeous still, beautiful type, grade, grain).
The INSIDE slides do NOT have to match the cover's style. Pick one inside layout per slideshow from the library
below (or invent one at the same quality), keep it consistent within that slideshow, and rotate across slideshows.
Reference screenshots (other accounts, for study only — never copy their names/branding): /Users/sage/Cinema 2/Slideshows/_engine/refs/

### Inside-slide layout library
1. PAPER DEEP-DIVE — cream paper texture; 2 stills side by side on top; serif italic heading in a deep colour
   (e.g. burgundy); short justified serif paragraph with a few **bold** key phrases; 2 stills underneath; small
   brand mark at top. Works for a single-film "why this film stays with you" carousel.
2. FILM STRIP — cream page; one large still with a row of 3 small stills under it; bold serif title + (year)
   small; thin rule; one-line centred description in small serif. Clean, archival.
3. POSTER CARD — still fills the top ~55%; solid black bottom with a slanted top edge; big bold white sans title,
   "Dir. Name (year)" under it, 2–3 line description; the film's real poster (TMDB poster_path) in a white frame
   overlapping on the right.
4. DUOTONE — each slide washed in one colour (purple, teal, deep red, olive…), different per slide; 2 stills
   stacked; big serif title with the same title in script as a translucent "ghost" overlapping it; "DIR. NAME"
   caps on the right; a tiny italic line or quote in a corner.
5. MAGAZINE — off-white page; giant condensed title (Anton/Bebas-style) in a colour sampled from the film's
   still, top-left; "DIRECTED BY" small under it; a justified paragraph to the right; a small inset still with a
   white border; a big still across the bottom.
6. FRAMED STILL — cream border around one big still; bold serif caps title bottom-left; "Dir. Name (year)" in
   serif with the year in italics; tiny brand mark at top.
7. FULL-BLEED POSTER — one still edge to edge, text in its empty area (the sweater-weather-v2 style).
Posters: stills.py can be extended to fetch d['images']['posters'] (iso_639_1 'en') for layout 3.

## Setup (cloud workspace)
Copy this folder to ~/engine, then:
  cd ~/engine && npm i @fontsource/pinyon-script @fontsource/cormorant-garamond  (+ any other @fontsource fonts your design needs)
Playwright + Pillow are preinstalled. TMDB key is inside stills.py.

## Principles that apply to EVERY look (attention to detail is the whole point)
- Every slide should look like a film poster someone would screenshot.
- Typography must feel designed and intentional (pairings, spacing, hierarchy) — never default-looking.
- Always apply a tasteful grade + subtle grain so stills feel like film, not screenshots.
- STILL CHOICE IS EVERYTHING. Pick wide, calm, cinematic frames with NEGATIVE SPACE (sky, water, wall,
  dusk, fog, a big empty field) where the text can sit. Iconic or beautiful > literal.
  Avoid: posters/promo photoshoots/collages, frames with text, cluttered crowds, faces that would be covered.
  A title with only promo photos on TMDB → swap that title for another that fits the mood.
- Text goes ONLY in the empty area: set "ty" (vertical centre %, ~15–30 for sky at top, ~65–82 for empty
  bottom) and "x" (horizontal crop centre %). Never over a face or a busy texture.
  If the empty area is very pale (near-white sky), choose a different still — butter yellow needs mid/dark tones.
- Copy: lowercase italic one-liners that sell the FEELING, not a plot summary
  (e.g. "carpe diem, under a pink october sky"). Max 2 short lines.
- Cover: kicker ("A WATCHLIST FOR"), one big script word, one serif-caps word, and an italic sub line.
  The count in the sub line must match the number of films.

## Make one slideshow
1. Pick a mood theme + 5 well-known titles that genuinely fit it.
   TMDB ids: https://api.themoviedb.org/3/search/multi?api_key=KEY&query=TITLE
2. python3 stills.py ~/work/<slug> a=movie:639 b=tv:4586 ...   → look at every sheet_*.jpg (up to 36 stills each)
3. python3 stills.py ~/work/<slug> --get a:22:a.jpg ...   (also a cover still and an end-slide still)
4. Write ~/work/<slug>/slides.json (copy example.slides.json): cover {kick,h,h2,sub}, movies {t (use <br> for 2 lines),
   yr, dir, ov, x, ty, fs (script size ~120–170)}, end {p}.
5. node render_<slug>.js ~/work/<slug>  (your per-slideshow design)   → out/01..07 jpg (1080x1350)
6. Make a contact sheet of out/ and LOOK at it like an art director: is every slide beautiful? text in empty
   space, readable, nothing clipped at the top, no face covered, colours pleasing. Fix and re-render until yes.

## Weekly VIDEOS (1080x1920, ~24s) — tools: stillvid.py + trailers.py
Two kinds, one each per week:
A) MOVING-STILLS video: TMDB stills (stills.py) → 3 stills per film stacked on black with slow drift, staggered reveal.
B) REAL-CLIPS video: official trailers → shots → 3 shots per film stacked (same builder).
   python3 trailers.py ~/work/<slug> a=movie:639 ...   (downloads the official YouTube trailer through the user's Railway
   downloader /fetch endpoint in 1080p, splits it into shots, writes shots_<slug>.json + shotsheet_<slug>.jpg).
   LOOK at every shotsheet and pick shots: no on-screen text/title cards/credits/logos, no sex/nudity/violence,
   no near-black frames, faces and moments that sell the mood. Prefer shots ≥1.5s.
Build: write ~/work/<slug>/video.json (see example.video.json): title_kick/title/title_sub + title_img (still) or
title_clip {src,ss,d,x}; films [{t,yr,dir,imgs:[3 items]}] where an item is a still filename or a clip {src,ss,d,x};
end_line + end_img or end_clip. Then: python3 stillvid.py ~/work/<slug>  → video.mp4.
CHECK: extract frames at several timestamps and look — panels filled (no black bars), right film in each segment,
nothing awkward. Vary the look week to week like the slideshows (ink colour, fonts in stillvid.py overlay_html,
panel count/layout, single full-bleed clips with title+year like the A24-list reference) — the stacked layout is one option.
Needs fonts: npm i @fontsource/pinyon-script @fontsource/cormorant-garamond (node_modules next to stillvid.py).


## APP SCREEN (approved — use exactly this look, every post)
appshot.js recreates Cinema's real native search-results screen (from Native/SearchView.swift) inside an iPhone frame.
The user approved it as "perfect, always like this". Rules:
- The Cinema slide (last slide of every slideshow / the IG carousel) = ONLY the framed phone (phone.png) centred on a
  clean background (plain colour that fits the post's palette, or a softly blurred still). NO text on that slide —
  no headline, no app name, no "app store". Same for the video end card: the phone, no text.
- The screen shows the post's mood as the search bubble (query), a 1–2 sentence intro, and 3 rows:
  "Top Results" = the post's 5 films (in order), then 2 more rows of real, fitting titles with short row names.
  Get posters from TMDB (w500) into the work dir.
- Build: write DIR/app.json {query, intro, rows:{name:[poster files]}} then `node appshot.js DIR` → screen.png
  (1206x2622) + phone.png (transparent, framed). Then composite phone.png onto the background with PIL:
  slide 1080x1350 (phone height ≈ 1180px, centred), video end card 1080x1920 (phone height ≈ 1600px).
  Needs: npm i @fontsource/inter.

## CAPTIONS (all posts)
Format, nothing else:
  <title of the post>
  <one short description line>
  <mention the app: found with Cinema — type a feeling, get the films>
  <4–6 hashtags>
