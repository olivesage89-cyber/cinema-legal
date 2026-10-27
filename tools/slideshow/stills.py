"""Usage: python3 stills.py WORKDIR slug=movie:ID slug=tv:ID ...
Fetches title/year/director/overview + up to 12 textless backdrops per title from TMDB,
writes WORKDIR/meta.json and a numbered contact sheet WORKDIR/sheet_<slug>.jpg to pick from.
Then: python3 stills.py WORKDIR --get slug:index:outname.jpg ...  downloads the original-size still."""
import json, os, sys, urllib.request, glob
from PIL import Image, ImageDraw
K = '96d478e3d9b0de03ca0829bb8f987845'; A = 'https://api.themoviedb.org/3/'
D = sys.argv[1]; os.makedirs(D + '/c', exist_ok=True)
def g(p): return json.load(urllib.request.urlopen(A + p + ('&' if '?' in p else '?') + 'api_key=' + K))
if sys.argv[2] == '--get':
    m = json.load(open(D + '/meta.json'))
    for a in sys.argv[3:]:
        s, n, out = a.split(':')
        urllib.request.urlretrieve('https://image.tmdb.org/t/p/original' + m[s]['b'][int(n)], f'{D}/{out}')
    sys.exit()
meta = json.load(open(D + '/meta.json')) if os.path.exists(D + '/meta.json') else {}
for a in sys.argv[2:]:
    s, ti = a.split('='); t, i = ti.split(':')
    d = g(f'{t}/{i}?append_to_response=credits,images&include_image_language=null,en')
    dirs = [c['name'] for c in d['credits'].get('crew', []) if c.get('job') == 'Director'] or [c['name'] for c in d.get('created_by', [])]
    bs = [b for b in d['images']['backdrops'] if b['iso_639_1'] is None][:36]
    meta[s] = dict(name=d.get('title') or d.get('name'), year=(d.get('release_date') or d.get('first_air_date') or '')[:4],
                   dir=dirs[:2], overview=d['overview'], b=[b['file_path'] for b in bs])
    sheet = Image.new('RGB', (1200, max(1,(len(bs)+5)//6)*113), 'black'); dr = ImageDraw.Draw(sheet)
    for n, b in enumerate(bs):
        f = f'{D}/c/{s}_{n}.jpg'; urllib.request.urlretrieve('https://image.tmdb.org/t/p/w300' + b['file_path'], f)
        im = Image.open(f).convert('RGB'); im = im.resize((200, 113)); x, y = (n % 6) * 200, (n // 6) * 113
        sheet.paste(im, (x, y)); dr.text((x + 5, y + 5), str(n), fill='yellow')
    sheet.save(f'{D}/sheet_{s}.jpg'); print(s, meta[s]['name'], meta[s]['year'], meta[s]['dir'], len(bs))
json.dump(meta, open(D + '/meta.json', 'w'), indent=1)
