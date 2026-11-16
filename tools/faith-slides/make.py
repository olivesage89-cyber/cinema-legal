#!/usr/bin/env python3
"""Faith listicle slideshow builder (cin_seven_ TikTok, Bible Meet promo).

  python3 make.py photos <spec.json>   # generate 2 Higgsfield Soul photos per slide -> <dir>/<id>_0.png, <id>_1.png + contact sheet pick.jpg
  python3 make.py build  <spec.json>   # render slides -> <dir>/out/01.jpg ... and preview.jpg

spec.json (paths relative to the spec's folder):
{
  "cover": {"text": "6 things to start doing to grow closer to God this season", "photo": "cov", "prompt": "<scene>"},
  "slides": [
    {"title": "1. read one chapter before you touch your phone", "sub": "even if it's just a psalm...",
     "photo": "t1", "prompt": "<scene>", "app": null},
    {"title": "4. join a bible study, even if you don't know anyone", "sub": "use Bible Meet to find one near you",
     "photo": "t4", "prompt": "<scene>", "app": "card"}      # app: null | "card" | "meeting" | "map"
  ],
  "pick": {"cov": 1, "t1": 0}                                  # which of the two photos to use (default 0)
}
Higgsfield key: HF_KEY_FILE (line HF_KEY=id:secret). Never print it.
"""
import json, os, sys, textwrap, time, urllib.request
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

HERE = os.path.dirname(os.path.abspath(__file__))
W, H = 1080, 1350
STYLE = ('highly detailed lifestyle photography, rich textures, warm cozy moody tones, soft natural light, shot on iPhone, '
         'Pinterest aesthetic, film grain, no text, no readable writing, no visible faces')
I = lambda w, s: ImageFont.truetype(f'{HERE}/fonts/inter-{w}.ttf', s)


def key():
    for l in open(os.environ['HF_KEY_FILE']):
        l = l.strip()
        if l.startswith('HF_KEY='): return l.split('=', 1)[1]
        if ':' in l: return l
    sys.exit('no key')


def api(url, body=None):
    r = urllib.request.Request(url, data=json.dumps(body).encode() if body else None, method='POST' if body else 'GET',
                               headers={'Authorization': 'Key ' + key(), 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(r, timeout=90) as f: return json.loads(f.read())
    except urllib.error.HTTPError as e: return json.loads(e.read() or b'{}')


def photos(spec_path):
    base = os.path.dirname(os.path.abspath(spec_path)); s = json.load(open(spec_path))
    items = [s['cover']] + s['slides']; jobs = []
    for it in items:
        for k in (0, 1):
            out = f"{base}/{it['photo']}_{k}.png"
            if os.path.exists(out): continue
            r = api('https://platform.higgsfield.ai/higgsfield-ai/soul/standard',
                    {'prompt': it['prompt'] + ', ' + STYLE, 'aspect_ratio': '3:4', 'resolution': '1080p'})
            if 'status_url' not in r:
                if 'credit' in str(r).lower(): sys.exit('HIGGSFIELD_OUT_OF_CREDITS')
                sys.exit(f'submit failed: {r}')
            jobs.append((out, r['status_url']))
    t0 = time.time()
    while jobs and time.time() - t0 < 900:
        time.sleep(8)
        for out, su in list(jobs):
            r = api(su); st = r.get('status')
            if st in ('queued', 'in_progress'): continue
            jobs.remove((out, su))
            if st == 'completed': urllib.request.urlretrieve(r['images'][0]['url'], out)
            else: print('FAILED', out, st)
    # contact sheet: one row per item, both options
    rows = []
    for it in items:
        ims = [Image.open(f"{base}/{it['photo']}_{k}.png").convert('RGB') for k in (0, 1) if os.path.exists(f"{base}/{it['photo']}_{k}.png")]
        row = Image.new('RGB', (640, 420)); x = 0
        for im in ims:
            im.thumbnail((315, 420)); row.paste(im, (x, 0)); x += 320
        rows.append(row)
    sheet = Image.new('RGB', (640 * ((len(rows) + 1) // 2), 420 * 2))
    for i, r in enumerate(rows): sheet.paste(r, ((i // 2) * 640, (i % 2) * 420))
    sheet.save(f'{base}/pick.jpg', quality=85); print('sheet', f'{base}/pick.jpg (rows: ' + ', '.join(i['photo'] for i in items) + ')')


def fit(im, ytop=0.45):
    r = max(W / im.width, H / im.height); im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    x = (im.width - W) // 2; y = int((im.height - H) * ytop); return im.crop((x, y, x + W, y + H))


def shade(im, top=0.55, rest=0.82):
    im = ImageEnhance.Brightness(im).enhance(rest)
    g = Image.linear_gradient('L').resize((W, H)).point(lambda v: int((255 - v) * (1 - top)))
    return Image.composite(Image.new('RGB', (W, H)), im, g)


def block(im, lines, y):
    d = ImageDraw.Draw(im); sh = Image.new('L', im.size); ds = ImageDraw.Draw(sh); out = []
    for txt, f, col, wrap in lines:
        for l in textwrap.wrap(txt, wrap):
            out.append((l, f, col, (W - d.textlength(l, font=f)) / 2, y)); y += int(f.size * 1.32)
        y += int(f.size * 0.45)
    for l, f, col, x, yy in out: ds.text((x, yy + 3), l, font=f, fill=255)
    im.paste((0, 0, 0), (0, 0), sh.filter(ImageFilter.GaussianBlur(8)).point(lambda v: int(v * 0.8)))
    for l, f, col, x, yy in out: d.text((x, yy), l, font=f, fill=col)
    return y


def appcard(im, y):
    cw, ch = 860, 190; x0 = (W - cw) // 2
    card = ImageEnhance.Brightness(im.crop((x0, y, x0 + cw, y + ch)).filter(ImageFilter.GaussianBlur(22))).enhance(0.45)
    m = Image.new('L', (cw, ch)); ImageDraw.Draw(m).rounded_rectangle([0, 0, cw - 1, ch - 1], radius=38, fill=255)
    im.paste(card, (x0, y), m); d = ImageDraw.Draw(im)
    d.rounded_rectangle([x0, y, x0 + cw - 1, y + ch - 1], radius=38, outline=(90, 90, 90), width=2)
    ic = Image.open(f'{HERE}/assets/appicon.png').convert('RGB').resize((130, 130), Image.LANCZOS)
    mi = Image.new('L', (130, 130)); ImageDraw.Draw(mi).rounded_rectangle([0, 0, 129, 129], radius=30, fill=255)
    im.paste(ic, (x0 + 30, y + 30), mi)
    d.text((x0 + 186, y + 44), 'Bible Meet', font=I('700', 44), fill=(250, 250, 250))
    d.text((x0 + 186, y + 104), 'Christian friends & bible studies', font=I('500', 28), fill=(205, 205, 205))
    bx = x0 + cw - 160; d.rounded_rectangle([bx, y + 66, bx + 124, y + 124], radius=29, fill=(240, 240, 240))
    gw = d.textlength('GET', font=I('800', 28)); d.text((bx + (124 - gw) / 2, y + 79), 'GET', font=I('800', 28), fill=(20, 110, 240))


def phone(im, which, y):
    app = Image.open(f'{HERE}/assets/screen_{which}.png').convert('RGB')
    hh = H - y - 40; ph = app.resize((int(app.width * hh / app.height), hh), Image.LANCZOS)
    px = (W - ph.width) // 2
    glow = Image.new('L', (W, H)); ImageDraw.Draw(glow).rounded_rectangle([px - 20, y - 20, px + ph.width + 20, y + ph.height + 20], radius=80, fill=150)
    im.paste((255, 214, 150), (0, 0), glow.filter(ImageFilter.GaussianBlur(60)).point(lambda v: int(v * 0.3)))
    m = Image.new('L', ph.size); ImageDraw.Draw(m).rounded_rectangle([0, 0, ph.width - 1, ph.height - 1], radius=int(ph.width * 0.11), fill=255)
    im.paste(ph, (px, y), m)


def build(spec_path):
    base = os.path.dirname(os.path.abspath(spec_path)); s = json.load(open(spec_path)); pick = s.get('pick', {})
    os.makedirs(f'{base}/out', exist_ok=True)
    src = lambda pid: Image.open(f"{base}/{pid}_{pick.get(pid, 0)}.png").convert('RGB')
    cov = shade(fit(src(s['cover']['photo'])), top=0.35, rest=0.7)
    block(cov, [(s['cover']['text'], I('800', 74), (252, 252, 252), 18)], 430); cov.save(f'{base}/out/01.jpg', quality=93)
    for i, sl in enumerate(s['slides']):
        im = shade(fit(src(sl['photo'])))
        if sl.get('app') in ('meeting', 'map'): im = ImageEnhance.Brightness(im).enhance(0.55).filter(ImageFilter.GaussianBlur(10))
        y = block(im, [(sl['title'], I('800', 60), (252, 252, 252), 24), (sl.get('sub', ''), I('500', 38), (228, 228, 228), 36)], 150)
        if sl.get('app') == 'card': appcard(im, max(y + 40, 980))
        elif sl.get('app') in ('meeting', 'map'): phone(im, sl['app'], max(y + 20, 520))
        im.save(f'{base}/out/{i + 2:02d}.jpg', quality=93)
    files = sorted(f for f in os.listdir(f'{base}/out') if f[:2].isdigit() and f.endswith('.jpg'))
    strip = Image.new('RGB', (300 * len(files), 375))
    for k, f in enumerate(files): strip.paste(Image.open(f'{base}/out/{f}').resize((300, 375)), (300 * k, 0))
    strip.save(f'{base}/out/preview.jpg', quality=85); print('built', len(files), 'slides ->', f'{base}/out/preview.jpg')


if __name__ == '__main__':
    if len(sys.argv) < 3: sys.exit(__doc__)
    {'photos': photos, 'build': build}[sys.argv[1]](sys.argv[2])
