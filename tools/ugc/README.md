# Faith guy videos — cozy account (Metricool brand "cozy" 7681065: IG _ceillo_77, TikTok elio_luize) — approved 2026-11-18
"cozy" is only the account's nickname; nothing to do with the content. NO Cinema / movies on this account any more.
Style: TikTok @yeetyghost (same guy, same kitchen, phone propped on the counter, whole body, ~7s, he sways/grooves to
music, sips a drink, half smile, never talks) + text like @ozono20 (a short heartfelt paragraph), but faith-oriented.
Approved samples: guy/sample_navy.mp4, guy/sample_cream.mp4. Character refs: guy/ref_kitchen_*.jpg (SAME guy every video).

## Build one video
1. Line: `python3 line.py guy ../../slides/used.txt` (ChatGPT gpt-5, key OPENAI_KEY_FILE) → pick the best or edit it.
   Must sound like a real early-20s Christian guy: plain, sincere, warm, never preachy/telling people what to do, never
   mocking, no church day, no app name, no clever poetic metaphors. Shapes: "the older i get…", "if…, why…? maybe…",
   "there's this girl… she's reading this right now", "i'm single because…", "someone said: '…' and i really felt that".
2. Start frame (GEMINI_KEY_FILE): `python3 gimg.py f.png "Same guy as the reference photo (same face, hair, light moustache),
   same small apartment kitchen, same camera position: phone propped on the counter filming his whole body. Now he wears
   <new outfit>, holding <drink>, <spot/pose>. No phone visible in frame. Real, unedited iPhone photo, vertical 9:16"
   guy/ref_kitchen_grey.jpg guy/ref_kitchen_navy.jpg` → LOOK: same face, no phone/tablet/status bar/text. Rotate outfits
   (hoodies, crewnecks, tees; shorts + white socks + slides) and drinks (iced coffee, can, mug, water bottle). Sometimes
   evening light. Crop to 9:16 centred, 720x1280.
3. Clip: `python3 omni.py v.mp4 7 f.png "Static phone propped on the kitchen counter, no camera movement, whole body in frame.
   He casually grooves to music: sways side to side, small shoulder bounce, nods, takes one sip, half smile, glances away
   and back. He does not talk. Natural, real, unedited phone video."`
4. Text: `node txt.js t.png "<line>" 12 580` (top ~12%, over the cabinets; width 560–620).
5. Colour + text: `python3 warm.py v.mp4 t.png final.mp4` (approved warm look; full sharpness). Output is SILENT
   (no AI audio — user). LOOK at 3+ frames: same guy, natural motion, no warped hands/face, text readable.

## Post
Commit final.mp4 to slides/guy-<slug>/video.mp4 + used.txt line "date | cozy GUY | line | outfit/drink".
Metricool 7681065, two posts autoPublish:true draft:false: Instagram {type:"REEL", showReelOnFeed:true, isAiGenerated:true},
TikTok {privacyOption:"PUBLIC_TO_EVERYONE", title:<line, shortened>, isAigc:true, autoAddMusic:false}.
Caption: tiny ("real", "be honest", "pray for me lol", "anyway") + #christian #faith #fyp #relatable (+1). No app name.
