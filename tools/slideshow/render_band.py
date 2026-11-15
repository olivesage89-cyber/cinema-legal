import json, sys, os, base64
from playwright.sync_api import sync_playwright
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
D = os.path.expanduser(sys.argv[1]); P = json.load(open(f'{D}/plan.json')); M = json.load(open(f'{D}/meta.json'))
F = os.path.expanduser('~/engine/node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Pm','permanent-marker',400)+ff('Sg','space-grotesk',400)+ff('Sg','space-grotesk',500)+ff('Sg','space-grotesk',600)
S = [("blues_13.jpg","blues_1.jpg","blues","two brothers, one mission from god &amp; the band they have to put back together"),
     ("ttyd_7.jpg","ttyd_2.jpg","ttyd","one summer, one hit song &amp; four kids from erie who almost made it"),
     ("sing_9.jpg","sing_2.jpg","sing","a dublin kid starts a band to impress a girl — and finds out who he is"),
     ("comm_3.jpg","comm_5.jpg","comm","dublin's hardest-working soul band, held together by pure stubbornness"),
     ("boho_0.jpg","boho_12.jpg","boho","four misfits, one stadium &amp; twenty minutes that made history")]
fib = "repeating-linear-gradient(90deg,rgba(255,255,255,.10) 0 2px,rgba(0,0,0,.05) 2px 5px),linear-gradient(180deg,rgba(255,255,255,.22),rgba(0,0,0,.10))"
jag = "polygon(0 4%,2% 0,98% 3%,100% 0,99% 20%,100% 38%,98.6% 55%,100% 74%,98.8% 100%,2% 97%,0 100%,1.2% 78%,0 60%,1.5% 42%,0 24%)"
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width':1080,'height':1350})
    for i,(a,c,k,line) in enumerate(S):
        f = P['films'][i]; dr = ', '.join(M[k]['dir'])
        dots = ''.join(f"<span style='display:inline-block;width:14px;height:14px;border-radius:50%;margin:0 7px;background:{f['acc'] if j==i else 'rgba(246,238,221,.25)'}'></span>" for j in range(5))
        html = f"""<html><head><style>{CSS}*{{margin:0;padding:0}}body{{width:1080px;height:1350px;background:#0D0B0A;color:#F6EEDD;text-align:center;position:relative;overflow:hidden}}
.im{{position:absolute;left:0;width:1080px;background-size:cover;filter:saturate(1.06) contrast(1.04)}}</style></head><body>
<div class=im style="top:0;height:500px;background-image:url(file://{D}/{a});background-position:50% 35%"></div>
<div class=im style="top:506px;height:380px;background-image:url(file://{D}/{c});background-position:50% 35%"></div>
<div style="position:absolute;left:0;top:886px;width:100%;height:464px;background:radial-gradient(ellipse 60% 70% at 50% 45%,{f['glow']},rgba(0,0,0,0) 70%)"></div>
<div style="position:absolute;top:928px;width:100%;font:600 21px Sg;letter-spacing:.46em;padding-left:.46em;color:{f['acc']}">TRACK 0{i+1} &nbsp;/&nbsp; 05 &nbsp;·&nbsp; THE SETLIST</div>
<div style="position:absolute;top:972px;width:100%;display:flex;justify-content:center"><div style="transform:rotate({f.get('rot',-1.5)}deg);filter:drop-shadow(0 8px 14px rgba(0,0,0,.55))">
<div style="background:{fib},{f['tape']};clip-path:{jag};padding:18px 52px 22px;font:400 {int(f.get('fs',90)*0.9)}px/1 Pm;color:{f.get('tink','#141210')};white-space:nowrap">{f['t']}</div></div></div>
<div style="position:absolute;top:1135px;width:100%;font:500 27px Sg;letter-spacing:.14em;padding-left:.14em">{f['yr']} <span style="color:{f['acc']}">&nbsp;|&nbsp;</span> {f['where']} <span style="color:{f['acc']}">&nbsp;|&nbsp;</span> DIR. {dr.upper()}</div>
<div style="position:absolute;top:1188px;width:100%;padding:0 110px;box-sizing:border-box;font:400 29px/1.35 Sg;color:rgba(246,238,221,.86)">{line}</div>
<div style="position:absolute;top:1296px;width:100%">{dots}</div>
<div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(0,0,0,.35));pointer-events:none"></div>
</body></html>"""
        open(f'{D}/_s.html','w').write(html); pg.goto(f'file://{D}/_s.html'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(250)
        pg.screenshot(path=f'{D}/out/_{i}.png')
        im = Image.open(f'{D}/out/_{i}.png').convert('RGB')
        import random; random.seed(i); n = Image.effect_noise((1080,1350), 18).convert('RGB'); im = Image.blend(im, n, 0.035)
        im.save(f'{D}/out/0{i+1}_{k}.jpg', quality=93)
    b.close()
W,H=1080,1350
bgi = Image.open(f"{D}/boho_0.jpg").convert('RGB'); s = max(W/bgi.width, H/bgi.height)
bgi = bgi.resize((int(bgi.width*s)+1, int(bgi.height*s)+1), Image.LANCZOS); ex=int((bgi.width-W)*0.3)
bgi = bgi.crop((ex,(bgi.height-H)//2,ex+W,(bgi.height-H)//2+H))
bg = ImageEnhance.Brightness(bgi.filter(ImageFilter.GaussianBlur(34))).enhance(0.7)
ph = Image.open(f"{D}/phone.png").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width*1180/ph.height),1180), Image.LANCZOS)
mk = Image.new('L',(W,H),0); ImageDraw.Draw(mk).rounded_rectangle([(W-ph.width)//2+20,(H-1180)//2+30,(W+ph.width)//2-20,(H+1180)//2+20],90,fill=150)
mk = mk.filter(ImageFilter.GaussianBlur(32)); bg = Image.composite(Image.new('RGB',(W,H),(14,6,4)), bg, mk)
bg.paste(ph,((W-ph.width)//2,(H-1180)//2),ph); bg.save(f'{D}/out/06_cinema.jpg', quality=93)
