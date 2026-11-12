import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json')); O = f'{D}/out'; os.makedirs(O, exist_ok=True)
E = os.path.dirname(os.path.abspath(__file__)); F = E + '/node_modules/@fontsource/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = (ff('In','inter',500)+ff('In','inter',600)+ff('Fr','fraunces',400,'italic')+ff('Ca','caveat',500)+
 "*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;background:radial-gradient(ellipse 90% 70% at 50% 45%,#16241C,#0B130F 80%);color:#F4ECDD;text-align:center;position:relative}"
 ".im{position:absolute;border-radius:30px;background-size:cover;box-shadow:0 18px 50px rgba(0,0,0,.55);outline:2px solid rgba(244,236,221,.22);outline-offset:-1px}"
 ".gr{position:absolute;inset:0;pointer-events:none;opacity:.05;background-image:url(GRAIN)}")
# grain
g = Image.effect_noise((540, 675), 60).convert('L').resize((1080, 1350)); g.save(f'{D}/_grain.png')
CSS = CSS.replace('GRAIN', f'file://{D}/_grain.png')
pages = []
for i, f in enumerate(P['films']):
    st = f['stills']; a, b, c = f.get('slide', [0, 1, 2])
    def bg(k): return f"background-image:url(file://{D}/{st[k][0]});background-position:{st[k][1]}% {st[k][2]}%"
    h = (f"<div style='position:absolute;top:58px;width:100%;font:500 22px In;letter-spacing:.42em;padding-left:.42em;color:#FFB04A'>CREATURE Nº 0{i+1} / 05 &nbsp;·&nbsp; {f['beast']}</div>"
         f"<div style='position:absolute;top:96px;width:100%;height:110px;display:flex;align-items:center;justify-content:center'><div class=fit style='font:italic 400 {min(f.get('fs',104),96)}px/1 Fr;white-space:nowrap'>{f['t']}</div></div>"
         f"<div style='position:absolute;top:214px;width:100%;font:500 23px In;letter-spacing:.3em;padding-left:.3em;opacity:.88'>{f['yr']} &nbsp;<span style='color:#FFB04A'>|</span>&nbsp; {f['where']}</div>"
         f"<div class=im style='left:60px;top:272px;width:960px;height:540px;{bg(a)}'></div>"
         f"<div class=im style='left:60px;top:836px;width:468px;height:264px;{bg(b)}'></div>"
         f"<div class=im style='left:552px;top:836px;width:468px;height:264px;{bg(c)}'></div>"
         f"<div style='position:absolute;top:1132px;left:50px;right:50px;font:500 64px/1 Ca;color:#FFB04A;transform:rotate(-1.5deg)'>{f['line']}</div>"
         f"<div style='position:absolute;top:1232px;width:100%;font:500 20px In;letter-spacing:.34em;padding-left:.34em;color:rgba(244,236,221,.58)'>{f['dir']}</div><div class=gr></div>")
    pages.append((f'0{i+1}_{f["slug"]}.jpg', h))
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});const P=%s;"
      "for(const [n,h] of P){fs.writeFileSync('%s/_p.html','<html><head><meta charset=utf-8><style>%s</style></head><body>'+h+'</body></html>');await p.goto('file://%s/_p.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.evaluate(()=>{for(const e of document.querySelectorAll('.fit')){let s=parseFloat(getComputedStyle(e).fontSize);while(e.scrollWidth>960&&s>40){s-=2;e.style.fontSize=s+'px'}}});await p.waitForTimeout(150);"
      "await p.screenshot({path:'%s/'+n,type:'jpeg',quality:93});}await b.close();})();") % (json.dumps(pages), D, CSS.replace("'", "\\'"), D, O)
open(f'{D}/_s.js', 'w').write(js); subprocess.run(f'cd {E} && node {D}/_s.js', shell=True, check=True)
# app slide
W, H = 1080, 1350
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = (bg.width - W) // 2; t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28)); bg = Image.blend(bg, Image.new('RGB', (W, H), (11, 19, 15)), 0.35)
ph = Image.open(f"{D}/phone.png").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1180 / ph.height), 1180), Image.LANCZOS)
mk = Image.new('L', (W, H), 0); ImageDraw.Draw(mk).rounded_rectangle([(W-ph.width)//2+16, (H-1180)//2+30, (W+ph.width)//2-16, (H+1180)//2+24], 90, fill=150)
bg = Image.composite(Image.new('RGB', (W, H)), bg, mk.filter(ImageFilter.GaussianBlur(32)))
bg.paste(ph, ((W - ph.width) // 2, (H - 1180) // 2), ph); bg.save(f'{O}/06_cinema.jpg', quality=93)
print(sorted(os.listdir(O)))
