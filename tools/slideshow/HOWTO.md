# Cinema slideshow engine — v2 "film poster" look

Approved reference: ../sweater weather v2/  (v1 blocky style is retired — do not use it)

## Setup (cloud workspace)
Copy this folder to ~/engine, then:
  cd ~/engine && npm i @fontsource/pinyon-script @fontsource/cormorant-garamond
Playwright + Pillow are preinstalled. TMDB key is inside stills.py.

## The look (attention to detail is the whole point)
- Every slide should look like a film poster someone would screenshot.
- Type: elegant script title (Pinyon) + small spaced serif caps (Cormorant) in butter yellow #F4E7A1.
  No bold/blocky fonts, no boxes, no heavy dark gradients.
- Film-stock grade is automatic in render2.js: faded blacks, muted colour, warm/teal tint, grain, soft vignette.
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
5. node render2.js ~/work/<slug>   → out/01..07 jpg (1080x1350)
6. Make a contact sheet of out/ and LOOK at it like an art director: is every slide beautiful? text in empty
   space, readable, nothing clipped at the top, no face covered, colours pleasing. Fix and re-render until yes.
