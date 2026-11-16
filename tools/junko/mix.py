#!/usr/bin/env python3
"""Join scene files + put a library track (Kevin MacLeod, CC BY 4.0) UNDER the code sound effects.
  python3 mix.py <workdir> <sfx.wav> <out.mp4> [--moods tender,warm] [--account motion_scene] [--track "Title"]
  workdir must hold list.txt + the scene mp4s. Output: 44.1 kHz AAC (never 96k — it won't play).
  Prints {"title","credit"}: credit = LAST line of the caption (license)."""
import argparse, json, os, random, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); MUS = os.path.join(HERE, '..', 'music')
ap = argparse.ArgumentParser(); ap.add_argument('work'); ap.add_argument('sfx'); ap.add_argument('out')
ap.add_argument('--moods', default='tender,warm'); ap.add_argument('--account', default='motion_scene')
ap.add_argument('--track', default=''); ap.add_argument('--used', default=os.path.join(HERE, '..', '..', 'slides', 'used.txt'))
a = ap.parse_args()
lib = json.load(open(os.path.join(MUS, 'library.json')))
if a.track: t = [x for x in lib if x['title'].lower() == a.track.lower()][0]
else:
    want = set(a.moods.split(',')); c = [x for x in lib if want & set(x['moods'])] or lib
    recent = ''.join([l for l in open(a.used) if a.account.lower() in l.lower()][-14:]).lower() if os.path.exists(a.used) else ''
    t = random.choice([x for x in c if x['title'].lower() not in recent] or c)
silent = os.path.join(a.work, 'silent.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', os.path.join(a.work, 'list.txt'), '-c', 'copy', silent], check=True)
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', silent], capture_output=True, text=True).stdout)
fc = (f"[1]atrim=0:{dur},afade=t=in:d=0.8,afade=t=out:st={dur - 2:.2f}:d=2,volume=0.6[m];"
      "[2]aformat=channel_layouts=stereo[s];[m][s]amix=inputs=2:normalize=0,aresample=44100[a]")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', silent, '-stream_loop', '-1', '-i', os.path.join(MUS, t['file']), '-i', a.sfx,
                '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '44100',
                '-t', f'{dur}', '-movflags', '+faststart', a.out], check=True)
print(json.dumps({'title': t['title'], 'credit': f"🎵 {t['title']} – Kevin MacLeod (incompetech.com) CC BY 4.0"}, ensure_ascii=False))
