"""Fetch official trailers via the Cinema downloader and split them into shots.
Usage: python3 trailers.py WORKDIR a=movie:639 b=movie:207 ...
For each title: TMDB -> official YouTube trailer -> POST downloader /fetch (1080p) -> WORKDIR/<slug>.mp4
-> scene detection -> WORKDIR/shots_<slug>.json [{i,ss,d}] + numbered contact sheet WORKDIR/shotsheet_<slug>.jpg
(thumbnail of each shot's middle frame, with index + duration). LOOK at the sheets and pick shots by index.
Skips logos/title cards at the start/end; you still must avoid shots with on-screen text, credits or studio logos."""
import json, os, sys, subprocess, urllib.request, concurrent.futures as cf, re
from PIL import Image, ImageDraw
K = '96d478e3d9b0de03ca0829bb8f987845'; A = 'https://api.themoviedb.org/3/'
DL = 'https://cinema-downloader-production.up.railway.app/fetch'
ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1anNyeHB2ZXllY2JvZ3FubWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNzA0NDksImV4cCI6MjEwMTY0NjQ0OX0.1R4Gfb0VbJwEG-Hhmtgs0RB92PFts_mwf4BEF5pfi00'
D = os.path.abspath(sys.argv[1]); os.makedirs(D, exist_ok=True)

def tmdb(p): return json.load(urllib.request.urlopen(A + p + ('&' if '?' in p else '?') + 'api_key=' + K))

def pick_trailer(t, i):
    vs = [v for v in tmdb(f'{t}/{i}/videos')['results'] if v['site'] == 'YouTube']
    def score(v):
        n = v['name'].lower(); s = 0
        s += 10 if v['type'] == 'Trailer' else (4 if v['type'] == 'Teaser' else 0)
        s += 3 if v.get('official') else 0
        s += 2 if 'official' in n else 0
        s -= 6 if any(w in n for w in ['reaction', 'review', 'featurette', 'behind', 'interview', 'clip', 'tv spot']) else 0
        s += 1 if v.get('size', 0) >= 1080 else 0
        return s
    vs.sort(key=score, reverse=True)
    return vs[0]['key'] if vs else None

def fetch(slug, t, i):
    key = pick_trailer(t, i)
    if not key: return slug, 'no trailer on TMDB'
    out = f'{D}/{slug}.mp4'
    req = urllib.request.Request(DL, data=json.dumps({'url': f'https://www.youtube.com/watch?v={key}'}).encode(),
                                 headers={'Content-Type': 'application/json', 'x-cinema-key': ANON})
    for attempt in range(2):
        try:
            with urllib.request.urlopen(req, timeout=600) as r, open(out, 'wb') as f: f.write(r.read())
            if os.path.getsize(out) > 100000: break
        except Exception as e: err = str(e)
    else: return slug, 'download failed: ' + err
    shots(slug); return slug, 'ok ' + key

def shots(slug):
    src = f'{D}/{slug}.mp4'
    dur = float(subprocess.check_output(f'ffprobe -v error -show_entries format=duration -of csv=p=0 "{src}"', shell=True))
    log = subprocess.run(f'ffmpeg -hide_banner -i "{src}" -vf "scale=320:-1,select=\'gt(scene,0.28)\',showinfo" -an -f null -', shell=True, capture_output=True, text=True).stderr
    cuts = [0.0] + [float(x) for x in re.findall(r'pts_time:([0-9.]+)', log)] + [dur]
    lo, hi = min(6.0, dur * 0.06), dur - min(12.0, dur * 0.1)   # skip studio logos / end title + credits
    S = []
    for a, b in zip(cuts, cuts[1:]):
        a2, b2 = a + 0.08, b - 0.08
        if b2 - a2 >= 0.9 and a2 >= lo and b2 <= hi: S.append({'i': len(S), 'ss': round(a2, 2), 'd': round(b2 - a2, 2)})
    th = []
    for s in S:
        p = f'{D}/_th_{slug}_{s["i"]}.jpg'
        subprocess.run(f'ffmpeg -v error -y -ss {s["ss"] + s["d"]/2:.2f} -i "{src}" -frames:v 1 -vf scale=240:-1 "{p}"', shell=True)
        th.append(p)
    json.dump(S, open(f'{D}/shots_{slug}.json', 'w'))
    if not th: return
    w, h = Image.open(th[0]).size; c = 6; r = (len(th) + c - 1) // c
    sheet = Image.new('RGB', (w * c, h * r)); dr = ImageDraw.Draw(sheet)
    for k, (s, p) in enumerate(zip(S, th)):
        x, y = (k % c) * w, (k // c) * h; sheet.paste(Image.open(p), (x, y))
        dr.rectangle([x, y, x + 74, y + 16], fill='black'); dr.text((x + 3, y + 2), f'{s["i"]} {s["d"]:.1f}s', fill='yellow')
        os.remove(p)
    sheet.save(f'{D}/shotsheet_{slug}.jpg')

jobs = [(a.split('=')[0], *a.split('=')[1].split(':')) for a in sys.argv[2:]]
with cf.ThreadPoolExecutor(5) as ex:
    for slug, msg in ex.map(lambda j: fetch(*j), jobs): print(slug, msg)
