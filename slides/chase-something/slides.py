"""chase IG slides: POSTER CARD layout (still top, black bottom w/ slanted edge, Anton title, framed poster) + app phone slide."""
import json, os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageFilter, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D); os.makedirs('out', exist_ok=True)
F = os.path.expanduser('~/engine/node_modules/@fontsource/')
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Ant', 'anton', 400) + ff('Pf', 'playfair-display', 500, 'italic') + ff('Int', 'inter', 400) + ff('Int', 'inter', 500) + ff('Int', 'inter', 600)
INK = '#FF7A3D'; CREAM = '#F6EEDF'
S = [
 dict(t='Rocky', yr='1976', dir='John G. Avildsen', img='r5.jpg', x=58, y=50, poster='app/p1366.jpg', where='Prime Video',
      ov='A small-time Philly boxer gets one shot at the heavyweight title and decides the win is just going the distance.', line='for the 4 a.m. runs nobody sees'),
 dict(t='The Pursuit<br>of Happyness', yr='2006', dir='Gabriele Muccino', img='h1.jpg', x=52, y=50, poster='app/p1402.jpg', where='Angel Studios',
      ov='A broke single dad and his son sleep wherever they can while he fights for one unpaid internship.', line="for when you're starting from zero"),
 dict(t='Whiplash', yr='2014', dir='Damien Chazelle', img='w5.jpg', x=70, y=50, poster='app/p244786.jpg', where='Rent on Apple TV',
      ov='A young jazz drummer and a merciless teacher push each other to the edge of greatness.', line="for when good isn't good enough"),
 dict(t='Ford v Ferrari', yr='2019', dir='James Mangold', img='f2.jpg', x=46, y=55, poster='app/p359724.jpg', where='FX Now',
      ov='A car designer and a hot-headed driver build a car to beat Ferrari at Le Mans, 1966.', line='for when you go like hell anyway'),
 dict(t='Hidden Figures', yr='2016', dir='Theodore Melfi', img='d2.jpg', x=45, y=50, poster='app/p381284.jpg', where='HBO Max',
      ov='Three brilliant mathematicians at NASA refuse to stay invisible while sending a man into orbit.', line='for proving the whole room wrong'),
]
def still(p, x, y, w=1080, h=800, out=None):
    im = Image.open(p).convert('RGB'); s = max(w / im.width, h / im.height); im = im.resize((int(im.width * s) + 1, int(im.height * s) + 1), Image.LANCZOS)
    l = int(min(max(im.width * x / 100 - w / 2, 0), im.width - w)); t = int(min(max(im.height * y / 100 - h / 2, 0), im.height - h))
    im.crop((l, t, l + w, t + h)).save(out, quality=95); return out
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1350})
    for i, s in enumerate(S):
        st = still(s['img'], s['x'], s['y'], out=f'{D}/out/_s{i}.jpg')
        html = f"""<html><head><style>{CSS}*{{margin:0;padding:0}}body{{width:1080px;height:1350px;background:#0C0B0A;position:relative;overflow:hidden}}
        .st{{position:absolute;top:0;left:0;width:1080px;height:800px;background:url(file://{st}) center/cover;filter:contrast(1.05) saturate(.95)}}
        .bk{{position:absolute;left:0;right:0;top:690px;bottom:0;background:#0C0B0A;clip-path:polygon(0 110px,100% 0,100% 100%,0 100%)}}
        .gr{{position:absolute;inset:0;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='300' height='300' filter='url(%23n)' opacity='.09'/></svg>");mix-blend-mode:overlay}}
        .num{{position:absolute;left:64px;top:840px;font:600 22px Int;letter-spacing:.5em;color:{INK}}}
        .t{{position:absolute;left:60px;top:880px;width:600px;font:400 92px/0.98 Ant;color:{CREAM};text-transform:uppercase}}
        .d{{position:absolute;left:64px;width:590px;font:500 italic 30px Pf;color:{CREAM};opacity:.9}}
        .ov{{position:absolute;left:64px;width:580px;font:400 23px/1.5 Int;color:rgba(246,238,223,.72)}}
        .w{{position:absolute;left:64px;bottom:56px;font:600 20px Int;letter-spacing:.32em;color:{INK}}}
        .po{{position:absolute;right:62px;top:640px;width:300px;height:450px;background:url(file://{D}/{s['poster']}) center/cover;border:10px solid {CREAM};box-shadow:0 20px 60px rgba(0,0,0,.6);transform:rotate(2deg)}}
        .ln{{position:absolute;right:62px;width:320px;top:1140px;text-align:center;font:500 italic 26px Pf;color:{CREAM};opacity:.85}}
        </style></head><body><div class=st></div><div class=bk></div>
        <div class=num>0{i+1} / 05</div><div class=t id=t>{s['t']}</div><div class=d id=d>Dir. {s['dir']} <span style='opacity:.7'>({s['yr']})</span></div>
        <div class=ov id=ov>{s['ov']}</div><div class=w>{s['yr']}&nbsp;&nbsp;|&nbsp;&nbsp;{s['where'].upper()}</div>
        <div class=po></div><div class=ln>{s['line']}</div><div class=gr></div></body></html>"""
        open(f'{D}/out/_s.html', 'w').write(html); pg.goto(f'file://{D}/out/_s.html'); pg.evaluate('document.fonts.ready')
        pg.evaluate("""()=>{const t=document.getElementById('t'),d=document.getElementById('d'),o=document.getElementById('ov');
          const y=t.offsetTop+t.offsetHeight+18; d.style.top=y+'px'; o.style.top=(y+d.offsetHeight+22)+'px';}""")
        pg.wait_for_timeout(150); pg.screenshot(path=f'{D}/out/0{i+1}_film.png')
        Image.open(f'{D}/out/0{i+1}_film.png').convert('RGB').save(f'{D}/out/0{i+1}_film.jpg', quality=93); os.remove(f'{D}/out/0{i+1}_film.png')
    b.close()
# app slide: phone only on softly blurred still
bg = Image.open('f3.jpg').convert('RGB'); s = 1350 * 1.1 / bg.height; bg = bg.resize((int(bg.width * s), int(1350 * 1.1)))
l = (bg.width - 1080) // 2; bg = bg.crop((l, 60, l + 1080, 60 + 1350)).filter(ImageFilter.GaussianBlur(36)); bg = ImageEnhance.Brightness(bg).enhance(0.6)
ph = Image.open('app/phone.png'); k = 1180 / ph.height; ph = ph.resize((int(ph.width * k), 1180), Image.LANCZOS)
bg.paste(ph, ((1080 - ph.width) // 2, (1350 - 1180) // 2), ph); bg.save('out/06_cinema.jpg', quality=93)
for f in os.listdir('out'):
    if f.startswith('_'): os.remove('out/' + f)
print(sorted(os.listdir('out')))
