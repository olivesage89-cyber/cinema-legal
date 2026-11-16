# Junko-style faith videos — motion_scene (Bible Meet promo) — approved 2026-11-16

Made entirely in code (PIL + numpy frames → ffmpeg). No Higgsfield, no ElevenLabs, no cost.
Style reference: TikTok @junkosworld1 — faceless cream "mannequin" characters (thick rounded limbs,
thin grey outline, NO face: emotion = posture — head dropped/shoulders slumped vs upright), a detailed
flat-cartoon room, a black HUD bar on top with 1–2 COUNTERS that change with the story, pop-in bubbles,
then a 2-line-pair PUNCHLINE card ("MY BRAIN AT 2 AM? / PROSECUTOR. / ONE TEXT FROM A FRIEND? / CASE CLOSED.").
We end on a short Bible verse (World English Bible wording, exact) instead of a follow card.

Approved examples (copy one and change it):
- `overthinking.py` → https://getcinema.app/slides/junko-overthinking-2am/video.mp4 (single scene + HUD + punchline + verse)
- `lib.py` (main) → https://getcinema.app/slides/junko-alone-together/video.mp4 (ALONE vs TOGETHER split screen)

Account: Metricool brand "motion scene" (blogId 7702303) → Instagram motion_scene + TikTok motion_scene_.
ONE video a day. No more Cinema film slideshows/videos on this account (user 2026-11-16).

## Content rules (user)
- Relatable, a little funny, warm — faith life + loneliness/friendship. Never preachy, never judging,
  never telling people what they must do. Lines short, UPPERCASE in bubbles/HUD, sound like a real person.
- Never tie church to a specific day (no "Sunday") — "church" / "after church" only.
- Bible Meet (the user's Christian friendship app) appears ONLY softly inside the story: an iOS notification
  with the app icon (`notif()`: "BIBLE MEET · now" + a friend's message, or "Bible study tonight · 0.4 mi away ·
  6 going · tap to join"), never an ad line, never in the caption. About 2 of every 3 videos have the
  notification; the rest have no app at all (the friend can just show up / call).
- Vary every day: struggle/joke, room (bedroom, kitchen, car, café, dorm, church lobby, park bench, office),
  time of day, counters, characters (friends wear coloured tops: green/red/yellow/purple; hair 'bun'/'long'/'bob').
  Check slides/junko-used.txt — never repeat a story, punchline or verse.
- Story ideas: "times i said i'm fine" counter; "unread messages from the group chat" (they kept checking on you);
  "excuses not to go to bible study" counter vs it was actually great; "people i know in this city: 0 → 6";
  "times i rehearsed saying hi" at church; screen time vs time with friends; "prayers i forgot to pray for others";
  new-city loneliness; a friend notices you've been quiet; small group potluck chaos; overthinking a text.

## Build
1. `cp tools/junko/overthinking.py tools/junko/<slug>.py` (or start from `lib.py`'s scene()/frame()), write the new
   story: HUD labels/values over time, bubble timings, room, character poses, notification text, punchline rows,
   verse. Helpers in lib.py: D (draw at 1x coords on a 2x canvas), vgrad, person(d,x,y,s,shirt|None,'sit'|'walk',
   mood 'sad'/'flat'/'smile'/'laugh'/'closed', None, (hair,None), t, seed, arm 'lap'/'phone'/'pray'/'shoulderR'/
   'umbrella'/'link'), window, frames_on_wall, plant, string_lights, notif. Main character = shirt None (plain cream).
2. `python3 <slug>.py W "t1,t2,t3,t4"` → LOOK at check_*.jpg at the busiest moments: bubbles readable and not over
   the notification or heads, HUD numbers right, nothing cut off, characters read clearly. Fix, re-check.
3. `python3 <slug>.py W` → W/a.mp4… + list.txt (silent, ~20–30s total).
4. Sound: `python3 sfx.py <seconds> W/sfx.wav '[["pop",1.0],["tick_every",0.5,0,13],["buzz",13],["ping",13.05],["whoosh",17.35]]'`
   (pop on every bubble/counter jump, ping on the notification, whoosh on scene/punchline changes).
5. `python3 mix.py W W/sfx.wav W/video.mp4 --moods tender,warm,night --account motion_scene` → keep the credit.
   Pull frames from video.mp4 at 5+ times and look again before posting.

## Post
Commit W/video.mp4 as slides/junko-<slug>/video.mp4 + append to slides/junko-used.txt:
`date | story | counters | punchline | app: notif/none | verse | music`. git pull --rebase, push, poll
https://getcinema.app/slides/junko-<slug>/video.mp4 until 200.
Metricool blogId 7702303 (confirm Instagram motion_scene / TikTok motion_scene_ with getBrandSettings), two posts,
both autoPublish:true, draft:false: Instagram instagramData {type:"REEL", showReelOnFeed:true, isAiGenerated:true},
videoCoverMilliseconds at a frame with a bubble; TikTok tiktokData {privacyOption:"PUBLIC_TO_EVERYONE",
title:<hook>, isAigc:true}. Caption: line 1 a short relatable hook (lowercase, e.g. "my brain at 2am is not on my
side"); blank; the verse in quotes + " — Ref"; blank; 4–6 hashtags (#christiantiktok #faith #relatable #jesus
#christian #overthinking…); LAST line = the music credit. No app name.
