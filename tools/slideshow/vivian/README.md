# Vivian — influencer slideshows (Metricool brand "vivian", IG river.viv, TikTok Vivian)
## FAITH MODE v2 (user, 2026-11-18) — copies TikTok @secret_shitz ("shh"). THIS OVERRIDES EVERYTHING BELOW.
river.viv is a Christian girl's account that quietly promotes Bible Meet. SLIDES ONLY (no videos). No Cinema, no movies.
Approved samples (look at them): slides/vivian-faith-v2-sample/01.jpg (bed, string lights), 02.jpg (under trees),
03.jpg (car sunroof).
LOOK: zero effort on purpose. Real unedited front-camera photo, slightly soft and grainy, flat natural light.
  Only her eyes/brows/hair at the very bottom edge (cut at the nose), looking up or to the side; the top ~3/4 is empty
  (ceiling, wall, sky, trees, car roof). One small plain line (render_rel.js, TikTok Sans 40px) in the empty space:
  dark navy #1B2440 on light photos, white on dark ones. No box, outline, glow, emoji.
PLACES — rotate, never the same place twice in a row (check used.txt): her bedroom (string lights, plain wall),
  lying in bed, under trees / on grass, passenger seat (car roof / sunroof / window with sky), parking lot at sunset,
  park bench, campus steps, kitchen counter, bathroom floor, curled up in a blanket. ~Half outdoors.
PHOTOS: relgen.py cand W "<place + light>, <what fills the empty top>" → pick a clear ref_face match with NO white/flat
  padding or seams (Higgsfield sometimes pads the top — reject those; or crop to the real part if the 4:5 crop is clean)
  → ALWAYS relgen.py grain cand_N.jpg p.jpg (0.93–0.96) → render_rel.js with y:100 so her eyes show.
LINES (the most important part): get 8 candidates from ChatGPT with `python3 tools/ugc/line.py vivian slides/used.txt`
  (key OPENAI_KEY_FILE) and pick/edit the best one — you still own the quality.  SINCERE, never jokes or memes. Short, lowercase, lazy punctuation, girls read it and
  think "that's me" and save/share it. Three kinds, rotate:
  - confession: "i could be mad at God and still talk to him every single night", "i lied i still cry every time
    they sing that one song at church", "i pray for people who will never know i did"
  - quiet hope: "i just want friends i can pray with and also laugh with"
  - "you deserve…": "you deserve friends who pray for you by name"
  Faith themes: prayer, trusting God, church, worship, christian friendships, loneliness, new city/college, healing.
  NEVER dating/romance/boyfriend/husband lines (user 2026-11-18: Bible Meet is a friendship app, not a dating app).
  Never preachy, never telling people what they must do, never mocking God/the Bible/church. Never name a church day.
  Never copy shh's lines — only the shapes. If it sounds like a quote account, a sermon, an ad or a joke, rewrite.
POSTS (mix): ~3 of 4 = ONE slide, one line (her biggest posts are single slides).
  ~1 of 4 = APP BUILD: 4–5 slides, SAME photo, only the line changes and builds (shh: "i don't text first anymore /
  i don't beg anymore / i don't chase anymore / i just don't anymore"); faith version ends with what she does about it →
  last slide = Bible Meet on a phone over her heavily blurred, darkened photo, NO text (real screens
  tools/faith-slides/assets/screen_map.png or screen_meeting.png in an iPhone frame). e.g. "moved here in august /
  still don't know a single christian girl / not sitting home alone again this week / [Bible Meet]".
  App build if her last 3 faith posts had no app. No FQ yellow quote posts any more.
CAPTION: tiny ("hi lol", "long week", "be honest", "amen?") + #fyp #relatable #viral #christiangirl (+1). Never the app.
Log in slides/used.txt: "date | vivian FAITH | 1-slide/APP | lines (short) | place".

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

## DAILY MIX (user, 2026-11-08) — 3 posts a day
- 9:08am run → E (relatable)   - 2:08pm run → a film format A/B/C/D (never the same letter as her previous film post)
- 7:08pm run → E (relatable)
- Every 4th E post is E-APP: if her last 3 E posts in used.txt are all plain E, this one is E-APP.
- Cinema otherwise lives in her bio link; the film formats keep their own app slides/captions.

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
   spelling (lowercase, "rn", emojis). The chat must sound EXACTLY like real friends texting — plain, normal
   lines ("wanna do a movie night?", "u pick"). NEVER name the app, never write a line just to set up the app
   (user: "sounds like you promoting it", "no one says that"). The ONLY app moment is a screenshot of Cinema's results
   she sends as a photo in the chat (cropped top of screen.png, ~320px wide). No separate app slide for this format.
   Keep every bubble inside the slide (nothing cut off at the bottom).
   Render: node render_texts.js DIR (texts.json).
C. MOODY FILM LIST (approved "amazing"; ref slides/vivian-healing-sample/) — see the section above.
E. RELATABLE (user, 2026-11-08 — now the MAIN format; refs: the "shh" relatable photo carousels, 100K–300K likes).
   Looks like zero effort — that is the point. Lazy low-angle front-camera selfie: her face only in the bottom third
   (often cut off at the chin/nose), looking up or off to the side, the top 2/3 empty ceiling/wall/sky, flat dull light,
   unedited. One small line per slide in TikTok's own text style (TikTok Sans 500, ~40px, dark navy #1B2440, no
   outline; white only on a dark photo) in the empty space, centred or a little right. All lowercase, lazy punctuation,
   no emojis on the slide. Photos: python3 relgen.py cand W "<scene>" (or `mirror` for a mirror-selfie reveal slide) →
   pick a clear ref_face match. Render: node render_rel.js DIR (rel.json; see the header comment).
   Structures (rotate): 1 slide, one line | 3–6 slides, SAME photo, the text builds and the last slide flips it with a
   self-roast ("i stopped explaining myself / … / ok i still check his location") | 2 slides: confession + mirror
   selfie "hi my names vivian and i …".
   Lines: ORIGINAL confessional + relatable (situationships, overthinking, friendships, self-worth, being a girl) — never
   copy other creators' lines. Example: "i dont have a type i just have a pattern", "im not mad im just going to remember
   this forever". Read them out loud: if it sounds like a quote account or an ad, rewrite.
   NO app, NO movies on plain E posts. Caption = tiny ("hi lol", "anyway", "not me", "be honest") + #fyp #relatable
   #viral + 1 more. No Cinema line in the caption.
   E-APP (every 4th E post): a 3–5 slide build that ends with what she does about it tonight → last slide = the
   Cinema app (appshot.js, phone on her blurred photo, no text), query = the feeling in her words, Top Results = 5
   fitting films. e.g. "he left me on delivered since tuesday / im not gonna text him / im not gonna text him / im gonna
   do this instead / [app]". Caption stays tiny; no Cinema line.
D. Other Gen Z formats you can invent at the same quality: photo dump ("things that got me through october"), "pov"
   slides, "red flags vs green flags in the movies he picks", a notes-app screenshot list, "rating my exes by their
   comfort movie". Always her voice, always the same girl, Cinema only as a natural part of it.
