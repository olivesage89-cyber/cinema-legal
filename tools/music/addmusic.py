#!/usr/bin/env python3
"""Put a copyright-free music track (Kevin MacLeod, CC BY 4.0) under a finished video.

  python3 addmusic.py IN.mp4 OUT.mp4 --moods sad,dreamy [--account vivian] [--used ../../slides/used.txt] [--track "Dreamer"]

Picks a track from library.json whose moods match (avoiding tracks this account used in the
last 14 lines of used.txt that mention it), lays it under the whole video with a 1s fade-out,
copies the video stream untouched, and prints JSON: {"title","credit"}.
The CREDIT line must go at the end of the caption (license requirement).
"""
import argparse, json, os, random, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser()
ap.add_argument('inp'); ap.add_argument('out')
ap.add_argument('--moods', default='cozy')
ap.add_argument('--account', default='')
ap.add_argument('--used', default=os.path.join(HERE, '..', '..', 'slides', 'used.txt'))
ap.add_argument('--track', default='')
a = ap.parse_args()
lib = json.load(open(os.path.join(HERE, 'library.json')))
if a.track:
    pick = [t for t in lib if t['title'].lower() == a.track.lower()]
    if not pick: sys.exit('track not in library')
    t = pick[0]
else:
    want = set(m.strip() for m in a.moods.split(',') if m.strip())
    cands = [t for t in lib if want & set(t['moods'])] or lib
    recent = ''
    if a.account and os.path.exists(a.used):
        lines = [l for l in open(a.used) if a.account.lower() in l.lower()]
        recent = ''.join(lines[-14:]).lower()
    fresh = [t for t in cands if t['title'].lower() not in recent] or cands
    t = random.choice(fresh)
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', a.inp],
                           capture_output=True, text=True).stdout.strip())
fo = max(0, dur - 1.0)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a.inp, '-stream_loop', '-1', '-i', os.path.join(HERE, t['file']),
                '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy',
                '-af', f'afade=t=out:st={fo:.2f}:d=1.0', '-c:a', 'aac', '-b:a', '160k', '-shortest',
                '-movflags', '+faststart', a.out], check=True)
credit = f"🎵 {t['title']} – Kevin MacLeod (incompetech.com) CC BY 4.0"
print(json.dumps({'title': t['title'], 'credit': credit}, ensure_ascii=False))
