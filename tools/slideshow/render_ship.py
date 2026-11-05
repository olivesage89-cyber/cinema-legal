"""HIGH SEAS 'SHIP'S LOG' IG slides: python3 render_ship.py WORKDIR (plan.json + ig.json) -> WORKDIR/ig/0X.jpg
Sail-canvas page, navy kicker w/ compass, big DM Serif title in a per-film ink, Dir. + year, Garamond italic line,
small white-bordered inset still tilted top-right, big still across the bottom with a wave-cut top edge, coral WATCH ON."""
import json, os, sys, subprocess
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json')); G = json.load(open(f'{D}/ig.json'))
E = os.path.dirname(os.path.abspath(__file__)); F = E + '/node_modules/@fontsource/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
NAVY = '#0B1E30'; ACC = P['acc']
wave = ' '.join(f"Q {x+67.5} {0 if (x//135)%2==0 else 44} {x+135} 22" for x in range(0, 1080, 135))
MASK = ("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1080' height='720'><path d='M0 22 " + wave + " V720 H0 Z' fill='black'/></svg>").replace('#', '%23')
CSS = (ff('Ds', 'dm-serif-display', 400) + ff('Ds', 'dm-serif-display', 400, 'italic') + ff('Os', 'barlow-condensed', 500) + ff('Lb', 'eb-garamond', 400, 'italic') + ff('Lb', 'eb-garamond', 400) +
       f"*{{margin:0;padding:0;box-sizing:border-box}}body{{width:1080px;height:1350px;overflow:hidden;background:#EEE7DA;color:{NAVY};position:relative}}"
       ".grain{position:absolute;inset:0;opacity:.18;mix-blend-mode:multiply;background:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence baseFrequency='.8' numOctaves='3'/><feColorMatrix values='0 0 0 0 .45 0 0 0 0 .38 0 0 0 0 .3 0 0 0 .5 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>\")}"
       f".big{{position:absolute;left:0;bottom:0;width:1080px;height:720px;background-size:cover;-webkit-mask:url(\"{MASK}\");mask:url(\"{MASK}\");filter:saturate(1.05) contrast(1.04)}}"
       f".k{{position:absolute;left:78px;top:70px;display:flex;align-items:center;gap:16px;font:500 24px Os;letter-spacing:.4em;color:{NAVY}}}"
       ".k i{display:block;width:70px;height:1.5px;background:currentColor;opacity:.6}"
       ".t{position:absolute;left:72px;top:140px;width:640px;font:400 var(--fs)/.98 Ds}"
       ".tb{position:absolute;left:78px;width:600px}"
       ".d{font:400 32px Lb;letter-spacing:.01em}.l{font:400 italic 38px/1.34 Lb;margin-top:20px;opacity:.9}"
       f".w{{margin-top:26px;font:500 26px Os;letter-spacing:.32em;color:{ACC}}}"
       ".in{position:absolute;right:66px;top:110px;width:300px;height:360px;border:12px solid #fff;box-shadow:0 14px 34px rgba(11,30,48,.35);background-size:cover;transform:rotate(4deg)}")
js = []
for i, f in enumerate(P['films']):
    g = G[i]; fs = g.get('fs', 110); nl = g['t'].count('<br>') + 1; y = 140 + fs * .98 * nl + 30
    html = (f"<html><head><meta charset=utf-8><style>{CSS}</style></head><body>"
            f"<div class='k'>THE HIGH SEAS <i></i> LOG Nº 0{i+1}</div>"
            f"<div class='t' style='--fs:{fs}px;color:{g['ink']}'>{g['t']}</div>"
            f"<div class='tb' style='top:{y:.0f}px'><div class='d'>Dir. {g['dir']} <i>({f['yr']})</i></div><div class='l'>{f['line'].replace('<br>',' ')}</div>"
            f"<div class='w'>WATCH ON · {f['where'].upper()}</div></div>"
            f"<div class='in' style=\"background-image:url(file://{D}/{g['inset']});background-position:{g.get('ipos','50% 50%')}\"></div>"
            f"<div class='big' style=\"background-image:url(file://{D}/{g['still']});background-position:{g.get('pos','50% 50%')}\"></div><div class='grain'></div></body></html>")
    open(f'{D}/ig/_{i}.html', 'w').write(html); js.append(f'{D}/ig/_{i}.html')
s = ("const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});"
     "for(const [i,f] of %s.entries()){await p.goto('file://'+f);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);"
     "await p.screenshot({path:'%s/ig/0'+(i+1)+'.jpg',type:'jpeg',quality:93});}await b.close();})();") % (json.dumps(js), D)
open(f'{D}/ig/_r.js', 'w').write(s); subprocess.run(f'cd {E} && node {D}/ig/_r.js', shell=True, check=True)
