# Vivian — influencer slideshows (Metricool brand "vivian", IG river.viv, TikTok Vivian)
Vivian = a consistent AI girl (Higgsfield character "Vivian v2", id in vivgen.py). Faceless? NO — her face is shown; it's always the same trained character.
Format (approved 2026-10-27, slides/vivian-keeper-test/):
1. Slide 1 = a NEW photo of Vivian (vivgen.py) in a fitting everyday place (bed, car, couch, café, kitchen, mirror, park, bookstore, cinema seat…) + a bold first-person hook, lowercase TikTok voice.
2. Slides 2–6 = 5 film stills (stills.py), each with "title (year)" kicker + her one-line take in her voice (opinionated, funny, relatable — dating, friendships, comfort, girlhood, seasons). Text sits in empty space, never over faces.
3. Slide 7 = app phone (appshot.js) composited on a heavily blurred, darkened photo of Vivian. NO text.
Render: node render_viv.js DIR (DIR/viv.json — see example.viv.json; fields img, x, y, ty, k, t). Font Montserrat 600 white with dark glow.
Photos: HF_KEY_FILE=<path to key file> python3 vivgen.py DIR "prompt" ...  (prompts: describe the scene + "candid iPhone photo"; she's a young woman — don't describe her face, the character handles it). Check every photo looks like her and has no weird hands/text; regenerate if not.
Key: NEVER in the repo. It lives on the Mac at /Users/sage/Cinema 2/Slideshows/_engine/.hf_key (HF_KEY=id:secret). Never print it.

## VIDEOS — quote style (approved 2026-10-28; references: slides/vivian-quote-test/video1.mp4, video2.mp4)
- ONE continuous ~10s close-up selfie clip, no cuts. Her face fills the frame (forehead to chin); background dark, blurry,
  barely visible. Soft, DIM, WARM INDOOR light only (bed, bedroom floor, couch, bathroom at night) — strong coloured
  light (street lights, neon, harsh orange) changes her face, so never use it.
- She barely moves: emotional look, slow blink, glance away and back, hand on cheek, playing with hair. Never talking.
- One heartfelt line in her voice (love, heartbreak, situationships, self-worth, healing, missing someone), lowercase,
  original (never copy other creators' lines), max ~20 words. Soft yellow text (#F6E58D or #F5C84C), centred ~70%.
- IDENTITY IS EVERYTHING: always generate 4 candidates (quotevid.py cand) and only use one that clearly matches ref_face.jpg
  (freckles, brown hair, same features). If none match, regenerate. Then crop tight (quotevid.py tight).
- Silent: the user adds a sad/trending sound by hand. Cinema is promoted via her bio link, not in these videos.
- Build: quotevid.py cand → tight → vid → text (see the docstring).

## SLIDESHOWS — healing/heartbreak film lists (approved 2026-10-28 "amazing"; reference slides/vivian-healing-sample/)
Matches her quote videos so the account feels like one girl:
1. Slide 1 = a NEW tight, moody close-up of Vivian (make it like the videos: quotevid.py cand → pick the matching face → tight)
   + her hook in soft yellow (#F6E58D), e.g. "movies i watched while getting over someone who never really chose me".
2. Slides 2–6 = 5 well-loved films/shows that fit the feeling (stills.py; beautiful, emotional frames; no promo art/text),
   "title (year)" kicker + her one-line take, all in the same soft yellow, text in empty space (never over eyes/faces).
   Topics: heartbreak, situationships, healing, missing someone, self-worth, falling in love, loneliness, growing up.
3. Slide 7 = Cinema app (appshot.js) on a heavily blurred, darkened second close-up of her; query = the hook's feeling. NO text.
Render: node render_viv.js DIR (DIR/viv.json like example.viv.json; per-slide "c" overrides the colour).

## SLIDESHOW ROTATION — Gen Z mix (user, 2026-10-28): Vivian must NOT look like a movie account.
"mix in gen Z mindset… text between people, point at a poster… just gen z things". Rotate formats; never the same
format twice in a row (check slides/used.txt). Every post still ends with the Cinema app slide (no text).
A. POINTING AT A POSTER (approved "good"; ref slides/vivian-genz-pointing/): cover + 4 slides, each a DIFFERENT relaxed
   photo of her (sitting on bed, couch, floor, lying on stomach… never stiff standing) pointing up at ONE poster sticker
   (white border, slight tilt) placed exactly where her finger points; one Gen Z caption per slide in white
   ("for when you miss someone you can't text"). Photos: generate pointing poses with lots of empty space above her
   (Soul + her character, strength 1, batch 4, pick matching faces; reject images with white padding/seams).
   Render: node render_point.js DIR (point.json).
B. TEXT CONVERSATION (ref slides/vivian-genz-texts/): B&W moody close-up cover ("texting my bestie the night after the
   breakup") + 2–3 iMessage dark-mode chat slides with her bestie / situationship / mom / sister — funny, real, Gen Z
   spelling (lowercase, "rn", "lmaooo", emojis), and Cinema comes up naturally ("i literally just typed that into cinema").
   Render: node render_texts.js DIR (texts.json).
C. MOODY FILM LIST (approved "amazing"; ref slides/vivian-healing-sample/) — see the section above.
D. Other Gen Z formats you can invent at the same quality: photo dump ("things that got me through october"), "pov"
   slides, "red flags vs green flags in the movies he picks", a notes-app screenshot list, "rating my exes by their
   comfort movie". Always her voice, always the same girl, Cinema only as a natural part of it.
