> NOTE (user 2026-11-17): river.viv no longer posts these stock-photo listicles. Vivian posts her own-face faith
> formats instead — see tools/slideshow/vivian/README.md "FAITH MODE".

# Faith listicle slideshows — vivian (river.viv Instagram + TikTok) (Bible Meet promo) — approved 2026-11-16

TikTok photo slideshows in the emily_internet_hoarder / Deepstash style: a cover with a list title, then one tip per
slide over a detailed, warm, cozy photo. The app (Bible Meet, the user's Christian friendship app) appears softly
in SOME posts, never as an ad. Approved example: https://getcinema.app/slides/faith-slides-ref/grow-closer-preview.jpg

Account (user 2026-11-16): Metricool brand "vivian" (blogId 7694475) → **Instagram river.viv + TikTok river.viv**.
4 slideshows a day. (Moved from cin_seven_, which now posts the lamb videos. No more Cinema content on vivian.)

## Writing rules (from the user)
- Never tie church to a specific day (no "Sunday", "Sunday service", "every Sunday" etc.) — say "church" / "after church" only (user rule 2026-11-16).
- Sound like a real person, casual and lowercase, short. If a line sounds like an ad or "AI", rewrite it. The user
  rejected a made-up personal testimonial story ("i moved here in august…") as weird/AI-sounding — use LIST posts.
- Tips are invitations, never rules or commands about religious practice (the user rejected "actually rest on
  sundays — telling people what day to rest, no"). Nothing preachy, no judging, no telling people what they must do.
- Formats: "N things to start doing to …", "signs God is …", "things i stopped doing that …", "cozy ways to …",
  "christian habits that …", "how to make christian friends as an adult", verse lists. 5–7 tips + cover.
- App rotation (vary it — check slides/faith-slides-used.txt):
  - ~half of posts: ONE tip mentions Bible Meet softly, e.g. tip "join a bible study, even if you don't know anyone"
    + sub "use Bible Meet to find one near you" with `"app": "card"` (small App Store-style card). Other ways:
    `"app": "meeting"` (real app screen with a meeting card open) or `"app": "map"`, or the tip IS the app when the
    topic is about finding christian friends. Never more than one app slide.
  - the rest: no app at all (builds trust; the account must feel like a real faith page).
- Never name the app in the cover. Caption never sells the app.

## Photos
`make.py photos spec.json` makes 2 Soul photos per slide → LOOK at pick.jpg and choose with "pick". Prompts: one
detailed, real-life cozy scene per tip that matches it (morning Bible by a window, autumn walk, journaling by
candlelight, friends' bible study night shot from behind, sunset car ride with headphones, hilltop sunrise…).
Rich detail, warm light, NO empty/boring scenes, no visible faces (backs/hands/objects), no readable text in the
image. Reject photos with garbled big text, odd hands, or faces facing the camera. Vary seasons/places post to post.

## Build + post
`make.py build spec.json` → out/01.jpg… + preview.jpg. LOOK at preview: text readable, not over faces, app card
neat. Commit the JPGs to slides/faith-slides-<slug>/ and append to slides/faith-slides-used.txt:
`date | title | tips (short) | app: card/meeting/map/none`. Push; poll https://getcinema.app/slides/faith-slides-<slug>/01.jpg.
Metricool: createScheduledPost blogId 7694475, providers [instagram, tiktok], autoPublish:true, draft:false, image URLs
in order, instagramData {type:"POST", isAiGenerated:true}, tiktokData {privacyOption:"PUBLIC_TO_EVERYONE", title:<cover text, ≤90 chars>, autoAddMusic:true,
photoCoverIndex:0}. Caption: the cover line + a short natural line (e.g. "save this for later 🤍") + 4–6 hashtags
(#christiantiktok #faith #jesus #christiangirl …). No app name in the caption.
