# Music for videos (approved 2026-10-28)
The user chose: every video gets copyright-free music mixed IN, so it auto-posts with sound on
Instagram + TikTok (no trending sound, no manual step). Library = 24 calm Kevin MacLeod tracks
(incompetech.com, CC BY 4.0), trimmed to 70s, loudness-normalised (-14 LUFS). Tags in library.json.

  python3 tools/music/addmusic.py W/video.mp4 W/video_music.mp4 --moods <tags> --account <name>
  -> prints {"title","credit"}; post video_music.mp4 (commit it as video.mp4).

Mood tags by account (pick ones that fit the video):
  vivian: sad, tender, emotional        cozy: cozy, warm, lofi, winter, night
  anime: dreamy, nostalgic, sad, wonder  motion_scene / ede.nnico: cinematic, wonder, dreamy, nostalgic, warm, night
LICENSE: CC BY needs credit. Put the printed credit line as the LAST line of the caption
(after the hashtags). Log the track in used.txt so the same account doesn't repeat it for 2 weeks.
Never put copyrighted/trending songs into a file (TikTok/IG mute or flag them).
