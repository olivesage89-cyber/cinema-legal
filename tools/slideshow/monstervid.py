"""GENTLE MONSTERS (creature field-notes) stills video. Usage: python3 monstervid.py WORKDIR [--ov]  (plan.json -> video.mp4)
7-flash burst -> full-screen jump-cut title (deep moss shade, Inter kicker, honey Pinyon 'gentle', giant cream Gloock MONSTERS
letter-spaced, honey rule, Fraunces italic sub, paw-dot foot) -> per film: moss-black page, Inter 'CREATURE Nº 0X / 05 · NAME',
cream Fraunces italic title, 'year | where', THREE rounded panels rising in staggered, each jump-cutting out of sync,
Caveat honey hand-written field note at the bottom -> phone end card on blurred still, no text."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = '#F4ECDD'; ACC = '#FFB04A'; SH_C = '8,16,12'; BG = '0B130F'
PW, PH, GAP = 980, 420, 22; PX = (W - PW) // 2
PY0 = 318; PY = [PY0 + k * (PH + GAP) for k in range(3)]
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.12):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.12 * mv)); b = max(0, min(1, x / 100 + 0.12 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset ultrafast -crf 14 {out}")
    return out
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = (ff('Gl', 'gloock', 400) + ff('Pi', 'pinyon-script', 400) + ff('In', 'inter', 500) + ff('In', 'inter', 600) +
       ff('Fr', 'fraunces', 400, 'italic') + ff('Fr', 'fraunces', 500, 'italic') + ff('Ca', 'caveat', 500) + ff('Ca', 'caveat', 600) +
       f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center}}")
SH = f"text-shadow:0 3px 26px rgba({SH_C},.95),0 0 10px rgba({SH_C},.8)"
ti = P['title']; top = ti.get('top', 300)
ov = {}
ov['tshade'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1320px;background:linear-gradient(180deg,rgba({SH_C},.86),rgba({SH_C},.62) 62%,rgba({SH_C},0))'></div>"
                f"<div style='position:absolute;bottom:0;left:0;width:100%;height:460px;background:linear-gradient(0deg,rgba({SH_C},.8),rgba({SH_C},0))'></div>")
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:500 34px In;letter-spacing:.5em;padding-left:.5em'>{ti['kick']}</div>"
ov['tscript'] = f"<div style='position:absolute;top:{top+30}px;width:100%;{SH};font:400 200px/1.3 Pi;color:{ACC}'>{ti['script']}</div>"
ov['thero'] = f"<div style='position:absolute;top:{top+300}px;width:100%;font:400 156px/1.1 Gl;letter-spacing:.06em;padding-left:.06em;color:{INK};{SH}'>{ti['hero']}</div>"
ov['tbar'] = (f"<div style='position:absolute;top:{top+520}px;left:340px;width:400px;height:3px;background:{ACC};box-shadow:0 0 16px {ACC}'></div>")
ov['tsub'] = f"<div style='position:absolute;top:{top+566}px;left:70px;right:70px;{SH};font:italic 400 54px/1.22 Fr'>{ti['sub']}</div>"
ov['tfoot'] = f"<div style='position:absolute;top:{top+760}px;width:100%;{SH};font:500 27px In;letter-spacing:.42em;padding-left:.42em;color:{ACC}'>●&nbsp; {ti['foot']} &nbsp;●</div>"
# page: moss-black gradient with 3 rounded windows cut out (drawn as frame over the panels)
page = Image.new('RGBA', (W, H), (0, 0, 0, 0))
g = Image.new('RGB', (W, H)); gd = ImageDraw.Draw(g)
for yy in range(H):
    t = abs(yy - H / 2) / (H / 2); c = (int(11 + 12 * t), int(19 + 16 * t), int(15 + 10 * t)); gd.line([(0, yy), (W, yy)], fill=c)
m = Image.new('L', (W, H), 255); md = ImageDraw.Draw(m)
for y in PY: md.rounded_rectangle([PX, y, PX + PW, y + PH], 34, fill=0)
page.paste(g, (0, 0), m)
dr = ImageDraw.Draw(page)
for y in PY: dr.rounded_rectangle([PX - 1, y - 1, PX + PW + 1, y + PH + 1], 35, outline=(244, 236, 221, 70), width=2)
page.save(f'{T}/page.png')
mask = Image.new('L', (PW, PH), 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, PW - 1, PH - 1], 34, fill=255); mask.save(f'{T}/pmask.png')
for i, f in enumerate(P['films']):
    ov[f'k{i}'] = f"<div style='position:absolute;top:58px;width:100%;font:500 25px In;letter-spacing:.42em;padding-left:.42em;color:{ACC}'>CREATURE Nº 0{i+1} / 05 &nbsp;·&nbsp; {f['beast']}</div>"
    ov[f'f{i}'] = (f"<div style='position:absolute;top:96px;height:140px;width:100%;display:flex;align-items:center;justify-content:center'>"
                   f"<div style='font:italic 400 {f.get('fs',104)}px/1.0 Fr;text-align:center;white-space:nowrap;color:{INK}' class=fit>{f['t']}</div></div>"
                   f"<div style='position:absolute;top:248px;width:100%;font:500 27px In;letter-spacing:.3em;padding-left:.3em;color:{INK};opacity:.88'>{f['yr']} &nbsp;<span style='color:{ACC}'>|</span>&nbsp; {f['where']}</div>")
    ov[f'l{i}'] = (f"<div style='position:absolute;top:{PY[2]+PH+52}px;left:60px;right:60px;font:500 66px/1.05 Ca;color:{ACC};transform:rotate(-1.5deg)'>{f['line']}</div>"
                   f"<div style='position:absolute;top:{PY[2]+PH+150}px;width:100%;font:500 23px In;letter-spacing:.34em;padding-left:.34em;color:rgba(244,236,221,.58)'>{f['dir']}</div>")
FIT = "<script></script>"
pages = {k: f"<html><head><meta charset=utf-8><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);await p.evaluate(()=>{for(const e of document.querySelectorAll('.fit')){let s=parseFloat(getComputedStyle(e).fontSize);while(e.scrollWidth>980&&s>40){s-=2;e.style.fontSize=s+'px'}}});"
      "await p.waitForTimeout(120);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
if len(sys.argv) > 2 and sys.argv[2] == '--ov': sys.exit()
FL = 'F6EFE2'
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], y=b[2], mv=1 if k % 2 else -1, z=1.1))
tc = [piece(c[0], c[2], W, H, x=c[1], y=c[3], mv=1 if k % 2 == 0 else -1, z=1.08) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[0]fade=in:st=0:d=0.2:color=0x{FL}[z];[1]format=rgba[s];[z][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.1:d=0.35:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.25:d=0.5:alpha=1[h];[b][h]overlay=x=0:y='max(0,40-120*(t-0.25))'[c];"
      f"[4]format=rgba,fade=in:st=0.45:d=0.45:alpha=1[e];[c][e]overlay=x=0:y='max(0,50-150*(t-0.45))'[d];"
      f"[5]format=rgba,fade=in:st=0.85:d=0.3:alpha=1[br];[d][br]overlay=x='-{W}*pow(max(0,1-(t-0.85)/0.45),3)':y=0[d2];"
      f"[6]format=rgba,fade=in:st=1.1:d=0.45:alpha=1[u];[d2][u]overlay=x=0:y='max(0,30-90*(t-1.1))'[f];"
      f"[7]format=rgba,fade=in:st=1.45:d=0.45:alpha=1[r];[f][r]overlay=0:0,format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tbar.png -loop 1 -i {T}/tsub.png -loop 1 -i {T}/tfoot.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SD = 3.3
# per panel: list of (still index, start, end) — cuts out of sync, max ~1.1s
SCHED = [[(0, 0, 1.1), (3, 1.1, 2.2), (0, 2.2, 3.3)],
         [(1, 0, 0.7), (4, 0.7, 1.7), (1, 1.7, 2.6), (4, 2.6, 3.3)],
         [(2, 0, 1.0), (5, 1.0, 1.9), (2, 1.9, 3.3)]]
for i, f in enumerate(P['films']):
    st = f['stills']; pans = []
    for j, sch in enumerate(SCHED):
        parts = [piece(st[s][0], round(e - b, 3), PW, PH, x=st[s][1], y=st[s][2], mv=1 if (i + j + q) % 2 else -1, z=1.1) for q, (s, b, e) in enumerate(sch)]
        open(f'{T}/p{i}_{j}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}_{j}.txt -c copy {T}/pan{i}_{j}.mp4"); pans.append(f'{T}/pan{i}_{j}.mp4')
    dl = [0.0, 0.12, 0.24]
    fc = f"color=c=0x{BG}:s={W}x{H}:r={FPS}:d={SD}[bg];[6]format=gray[mk];"; cur = 'bg'
    for j in range(3):
        fc += (f"[{j}]setpts=PTS+{dl[j]}/TB,format=rgba,fade=in:st={dl[j]}:d=0.25:alpha=1[q{j}];")
    fc += "[mk]split=3[mk0][mk1][mk2];"
    for j in range(3):
        fc += (f"[q{j}][mk{j}]alphamerge[r{j}];[{cur}][r{j}]overlay=x={PX}:y='{PY[j]}+90*pow(max(0,1-(t-{dl[j]})/0.4),3)':enable='gte(t,{dl[j]})':eof_action=repeat[m{j}];"); cur = f'm{j}'
    fc += (f"[3]format=rgba[fr];[{cur}][fr]overlay=0:0[a];"
           f"[4]format=rgba,fade=in:st=0.05:d=0.25:alpha=1[k];[a][k]overlay=0:0[b];"
           f"[5]format=rgba,fade=in:st=0.12:d=0.35:alpha=1[o];[b][o]overlay=x=0:y='36*pow(max(0,1-(t-0.12)/0.45),3)'[c];"
           f"[7]format=rgba,fade=in:st=0.45:d=0.4:alpha=1[l];[c][l]overlay=x='-40*pow(max(0,1-(t-0.45)/0.5),3)':y=0,"
           f"fade=in:st=0:d=0.12:color=0x{FL},format=yuv420p")
    sh(f"ffmpeg -v error -y -i {pans[0]} -i {pans[1]} -i {pans[2]} -loop 1 -i {T}/page.png -loop 1 -i {T}/k{i}.png -loop 1 -i {T}/f{i}.png -loop 1 -i {T}/pmask.png -loop 1 -i {T}/l{i}.png "
       f"-filter_complex \"{fc}\" -t {SD} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(30))
bg = Image.blend(bg, Image.new('RGB', (W, H), (11, 19, 15)), 0.35)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
mk = Image.new('L', (W, H), 0)
ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
mk = mk.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.4); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25:color=0x{FL},format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
TEND = round(len(P['burst']) * P.get('flash', 0.2) + tdur + SD * len(P['films']), 3)
inp = ' '.join(f'-i {s}' for s in segs); NP = len(segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(NP)) + ''.join(f'[s{k}]' for k in range(NP)) + f"concat=n={NP}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.05:contrast=1.04,colorbalance=rs=0.02:gs=0.01:bs=-0.02:rh=0.03:bh=-0.02,noise=alls=9:allf=t,vignette=PI/5,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -t {TEND+ED} -r {FPS} -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
