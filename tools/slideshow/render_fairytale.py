import json, random, subprocess, sys, os
from PIL import Image, ImageFilter, ImageDraw
D = os.path.expanduser('~/work/fairytale'); P = json.load(open(f'{D}/plan.json')); E = os.path.expanduser('~/engine')
F = E + '/node_modules/@fontsource/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Cd','cinzel-decorative',700)+ff('Ps','pinyon-script',400)+ff('Lc','libre-caslon-text',400)+ff('Lc','libre-caslon-text',400,'italic')
INK = P['ink']; PAGE = P['page']
dirs = ['Keiichi Hara','Kenji Kamiyama','Goro Miyazaki','Masahiro Andō','Yoh Yoshinari']
cover = [('w0.jpg',42),('n0.jpg',32),('e3.jpg',32),('s13.jpg',38),('l7.jpg',50)]
random.seed(3)
stars = ','.join(f"radial-gradient({random.choice([2,3,4])}px {random.choice([2,3,4])}px at {random.randint(0,100)}% {random.randint(0,100)}%, rgba(250,236,200,{random.uniform(.3,.8):.2f}), transparent)" for _ in range(90))
pages = {}
for i, f in enumerate(P['films']):
    img, x = cover[i]
    pages[f'0{i+1}'] = f"""<html><head><style>{CSS}*{{margin:0;padding:0}}body{{width:1080px;height:1350px;background:{stars},{PAGE};color:#FBF1DF;text-align:center;position:relative;overflow:hidden}}
.k{{position:absolute;top:66px;width:100%;font:400 22px Lc;letter-spacing:.55em;padding-left:.55em;color:{INK}}}
.t{{position:absolute;top:108px;width:100%;font:700 {int(f['fs']*0.95)}px/1.1 Cd}}
.o{{position:absolute;left:150px;top:{300 if '<br>' in f['t'] else 250}px;width:780px;height:{800 if '<br>' in f['t'] else 850}px;border:2px solid {INK};border-radius:392px 392px 0 0;padding:12px;box-sizing:border-box}}
.o:before{{content:'';position:absolute;inset:-16px;border:1px solid {INK};border-radius:408px 408px 0 0;opacity:.8}}
.a{{width:100%;height:100%;border-radius:380px 380px 0 0;background:url(file://{D}/{img}) {x}% 50%/cover;filter:saturate(1.04) contrast(1.03)}}
.l{{position:absolute;top:{1135 if '<br>' in f['t'] else 1135}px;width:100%;font:400 italic 32px/1.32 Lc}}
.m{{position:absolute;top:1252px;width:100%;font:400 19px Lc;letter-spacing:.3em;padding-left:.3em;color:{INK}}}
.n{{position:absolute;bottom:34px;right:44px;font:400 40px Ps;color:{INK};opacity:.85}}
.g{{position:absolute;inset:0;opacity:.07;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence baseFrequency='.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}}
</style></head><body><div class=k>CHAPTER {['I','II','III','IV','V'][i]}</div><div class=t>{f['t']}</div>
<div class=o><div class=a></div></div><div class=l>{f['line']}</div><div class=m>DIR. {dirs[i].upper()} &nbsp;·&nbsp; {f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div><div class=g></div></body></html>"""
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_s.html',O[k]);await p.goto('file://%s/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);"
      "await p.screenshot({path:'%s/ig/'+k+'.png'});}await b.close();})();") % (json.dumps(pages), D, D, D)
open(f'{D}/_s.js','w').write(js); subprocess.run(f'cd {E} && node {D}/_s.js', shell=True, check=True)
names = ['wonderland','napping','earthsea','snowwhite','lwa']
for i, n in enumerate(names):
    Image.open(f'{D}/ig/0{i+1}.png').convert('RGB').save(f'{D}/ig/0{i+1}_{n}.jpg', quality=93); os.remove(f'{D}/ig/0{i+1}.png')
# app slide
W, H = 1080, 1350
bg = Image.open(f'{D}/s17.jpg').convert('RGB'); s = max(W/bg.width, H/bg.height)*1.1
bg = bg.resize((int(bg.width*s), int(bg.height*s))); l = int((bg.width-W)*0.6); t = (bg.height-H)//2
bg = bg.crop((l, t, l+W, t+H)).filter(ImageFilter.GaussianBlur(26)); bg = Image.blend(bg, Image.new('RGB', (W, H), (18, 17, 42)), .35)
ph = Image.open(f'{D}/phone.png').convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width*1180/ph.height), 1180), Image.LANCZOS)
bg.paste(ph, ((W-ph.width)//2, (H-1180)//2), ph); bg.save(f'{D}/ig/06_cinema.jpg', quality=93)
print('ok')
