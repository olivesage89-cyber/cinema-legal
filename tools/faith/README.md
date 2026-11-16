# Faith animation videos (Bible Meet promo accounts) — approved 2026-11-12

Two Instagram accounts, one character each. Each video: a character is struggling → Jesus comes and answers
gently → a closing moment → verse card. 30–45s, 5 voiced shots. **No app mention anywhere in the video**
(the user's rule: "promoting our app, but don't make it obvious"). Approved examples:
https://getcinema.app/slides/faith-lamb-tired/video.mp4 and https://getcinema.app/slides/faith-bean-alone/video.mp4

| account | Metricool brand (blogId) | post to | character | master (always the reference image) |
|---|---|---|---|---|
| lamb | "Anime" brand 7680537 | **Instagram morgan_se_ ONLY** (that brand's TikTok is the anime account — never post faith there) | small white low-poly lamb + low-poly Jesus, stylised indie-game 3D | https://getcinema.app/slides/faith-masters/lamb_master.jpg |
| bean | "ede.nnico" brand 7681463 | **Instagram ede.nnico ONLY** (that brand's TikTok is a Cinema account — never post faith there) | soft round YELLOW bean (always yellow), 2D storybook paper-grain pastel; Jesus drawn as a gentle cartoon man (wavy brown hair, short beard, white robe, soft blue sash) | https://getcinema.app/slides/faith-masters/bean_master.jpg |

Other refs in slides/faith-masters/ (style-only shots, example shots). Other bean characters (mint green, pink,
lavender, cream) may appear as friends/family; the main bean is ALWAYS the yellow one.

## Content rules (user)
- Never tie church to a specific day (no "Sunday", "Sunday service", "every Sunday" etc.) — say "church" / "after church" only (user rule 2026-11-16).
- **Settings lean into NATURE** (user 2026-11-12): meadows, forest stream, misty mountain trail, wildflower
  field, lake at dawn, snowy pine forest, starry sky, rainy hillside, garden, picnic under a tree, sunflower field,
  beach at sunset, autumn park, campfire, riverbank, orchard. Indoors (church, bedroom at night) only now and then
  when the story needs it. Vary time of day / weather / season every video.
- Same characters + art style every time; everything else changes: struggle, verse, setting, light, shots, extra
  characters. Never repeat a story/verse/setting — check slides/faith-used.txt.
- Struggles to rotate: tired of pretending, loneliness, anxiety about the future, fear, grief/missing someone,
  feeling far from God, shame/being forgiven, comparison, waiting/unanswered prayer, rejection, starting over,
  feeling not enough, overthinking at night, a friend who left. Bible Meet's message (finding your people /
  faith friends / not walking alone) can show up softly in the story (e.g. new friends arrive at the end) — never
  the app itself.
- Jesus is gentle, few words, never preachy; his lines may paraphrase Scripture. Character lines short and honest.
- Verse card = World English Bible (public domain) wording, exact. Check it.

## Shots (5, ~5–8s each)
1. Character alone, the struggle (says line 1). 2. Close-up, emotion (line 2) — or Jesus arriving.
3. Jesus arrives / sits / kneels (speaks). 4. Comfort moment (Jesus's key line). 5. Resolution wide shot
(character's last short line, or a friend's line). Vary the order/angles across days.

## Build (tools/faith/)
Higgsfield key: `HF_KEY_FILE=<staged .hf_key>` (never print it). Video prompts: **do not write the name "Jesus"
in Seedance prompts** (it got blocked once as "copyright") — write "the kind bearded man in the white robe".
Grok image prompts can say Jesus.
1. Stills — `hf.py batch jobs.json` with kind "image", ref = the account master URL. Prompt template:
   "Keep the exact same <art style> as the reference image, the same <character> and the same Jesus (<look>).
   <new setting, light, weather>. New shot: <what happens, framing>. No text, vertical."
   LOOK at a contact sheet: same characters/style as the master, no extra limbs, no text, emotion reads.
   Regenerate bad ones.
2. Clips — kind "video", ref "@<still.png>", seconds 5–8, prompt: "<style> animation. <action>. <who> says
   <right away/slowly> in <voice>: \"<line>\" <reaction>. <camera>. <ambient sound>, no music."
   Voices: Jesus = "a warm, calm, deep, gentle adult male voice"; lamb/bean = "a small, gentle, young voice";
   friends = "a friendly bright young voice".
3. `python3 build.py speech c*.mp4` → caption windows; write spec.json (see build.py doc); 1–3 caption chunks
   per clip, yellow on the key word. Hook = 1–2 short lines ("for anyone who …"). moods: tender, emotional,
   dreamy, wonder, warm, sad.
4. `python3 build.py make spec.json` → prints music credit. LOOK at frames (captions on time with speech
   windows, not over faces, verse card readable). If a clip has no speech where expected, or a character
   morphs, regenerate that clip.

## Post
Commit video.mp4 to slides/faith-<account>-<slug>/; append to slides/faith-used.txt:
`date | <account> | struggle | setting | verse ref | music: <title>`; push; poll the getcinema.app URL until 200.
Metricool: Instagram ONLY, instagramData {type:"REEL", showReelOnFeed:true, isAiGenerated:true},
autoPublish:true, draft:false, videoCoverMilliseconds ~3500 (a frame with the character + hook).
Caption: line 1 the hook ("for anyone who's tired today 🤍"); blank line; the verse in quotes + " — Ref";
blank line; 5–7 hashtags (#jesus #christian #faith #bible #godslove #christiananimation …); LAST line the music
credit. No app name.
