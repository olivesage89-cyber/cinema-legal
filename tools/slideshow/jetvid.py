"""JET-SET SPY (passport stamps) stills video. Usage: python3 spyvid.py WORKDIR [--ov]  (plan.json -> video.mp4)
7-flash burst -> full-screen jump-cut title (cold teal shade, film registration corners, Special Elite kicker,
Bodoni italic 'being a', giant red Big Shoulders SPY revealed from under a sliding redaction bar)
-> per film: dossier page — typewriter 'FILE Nº 0X / 05 · CITY', cream condensed caps title, red 'year | where',
two near-uncropped 16:9 panels stacked edge to edge jump-cutting out of sync, rubber stamp thumps onto the corner,
Bodoni italic line + redacted typewriter memo line -> phone end card on blurred still, no text."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = '#F3EEE4'; ACC = '#9BD3F2'; SH_C = '6,10,24'; BG = '0A1226'
PH = 608; PY = [330, 330 + PH + 6]
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.12):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.12 * mv)); b = max(0, min(1, x / 100 + 0.12 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = (ff('It', 'italiana', 400) + ff('Pi', 'pinyon-script', 400) + ff('In', 'inter', 500) + ff('In', 'inter', 600) +
       ff('Bo', 'bodoni-moda', 400, 'italic') + ff('Bo', 'bodoni-moda', 500, 'italic') +
       f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center}}")
SH = f"text-shadow:0 3px 26px rgba({SH_C},.95),0 0 10px rgba({SH_C},.8)"
def corners(m=46, L=56, c='rgba(239,231,214,.8)'):
    s = f"position:absolute;width:{L}px;height:{L}px;border-color:{c};border-style:solid;"
    return (f"<div style='{s}left:{m}px;top:{m}px;border-width:3px 0 0 3px'></div><div style='{s}right:{m}px;top:{m}px;border-width:3px 3px 0 0'></div>"
            f"<div style='{s}left:{m}px;bottom:{m}px;border-width:0 0 3px 3px'></div><div style='{s}right:{m}px;bottom:{m}px;border-width:0 3px 3px 0'></div>")
ti = P['title']; top = ti.get('top', 300)
ov = {}
ov['tshade'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1300px;background:linear-gradient(180deg,rgba({SH_C},.88),rgba({SH_C},.66) 60%,rgba({SH_C},0))'></div>"
                f"<div style='position:absolute;bottom:0;left:0;width:100%;height:520px;background:linear-gradient(0deg,rgba({SH_C},.85),rgba({SH_C},0))'></div>"
                f"<div style='position:absolute;left:0;right:0;bottom:96px;font:500 24px In;letter-spacing:.32em;padding-left:.32em;color:rgba(243,238,228,.8)'>{ti['route']}</div>")
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:500 34px In;letter-spacing:.5em;padding-left:.5em'>{ti['kick']}</div>"
ov['tscript'] = f"<div style='position:absolute;top:{top+40}px;width:100%;{SH};font:400 170px/1.3 Pi;color:{ACC}'>{ti['script']}</div>"
ov['thero'] = f"<div style='position:absolute;top:{top+250}px;width:100%;font:400 380px/1 It;letter-spacing:.16em;padding-left:.16em;color:{INK};{SH}'>{ti['hero']}</div>"
ov['tbar'] = f"<div style='position:absolute;top:{top+640}px;left:290px;width:500px;height:3px;background:{ACC};box-shadow:0 0 18px {ACC}'></div>"
ov['tsub'] = f"<div style='position:absolute;top:{top+690}px;left:60px;right:60px;{SH};font:italic 400 52px/1.22 Bo'>{ti['sub']}</div>"
ov['tfoot'] = f"<div style='position:absolute;top:{top+850}px;width:100%;{SH};font:500 28px In;letter-spacing:.42em;padding-left:.42em;color:{ACC}'>✦ &nbsp;{ti['foot']}&nbsp; ✦</div>"
ov['page'] = (f"<div style='position:absolute;left:0;top:0;width:100%;height:{PY[0]}px;background:radial-gradient(ellipse 80% 140% at 50% 0%,#1A2A52,#0A1226 75%)'></div>"
              f"<div style='position:absolute;left:0;top:{PY[0]+PH}px;width:100%;height:6px;background:#0A1226'></div>"
              f"<div style='position:absolute;left:0;top:{PY[1]+PH}px;width:100%;height:{H-PY[1]-PH}px;background:radial-gradient(ellipse 80% 140% at 50% 100%,#1A2A52,#0A1226 75%)'></div>"
              + ''.join(f"<div style='position:absolute;left:0;top:{y}px;width:100%;height:2px;background:rgba(243,238,228,.5)'></div>" for y in (PY[0]-2, PY[0]+PH, PY[1]-2, PY[1]+PH)))
SC = [1.75, 1.38, 1.14, 1.0]
def stamp(f, s, op):
    return (f"<div style='position:absolute;left:{W-360}px;top:{PY[0]+PH-200}px;width:300px;height:300px;transform:rotate(-14deg) scale({s});opacity:{op}'>"
            f"<div style='position:absolute;inset:0;border:6px solid {ACC};border-radius:50%'></div><div style='position:absolute;inset:16px;border:2px solid {ACC};border-radius:50%'></div>"
            f"<div style='position:absolute;top:62px;width:100%;font:600 22px In;letter-spacing:.4em;padding-left:.4em;color:{ACC}'>ARRIVED</div>"
            f"<div style='position:absolute;top:100px;left:20px;right:20px;height:90px;display:flex;align-items:center;justify-content:center;font:400 {f.get('sfs',64)}px/1 It;color:{ACC};border-top:2px solid {ACC};border-bottom:2px solid {ACC}'>{f['place']}</div>"
            f"<div style='position:absolute;top:208px;width:100%;font:600 24px In;letter-spacing:.3em;padding-left:.3em;color:{ACC}'>10 · NOV · 26</div></div>")
for i, f in enumerate(P['films']):
    ov[f'k{i}'] = f"<div style='position:absolute;top:66px;width:100%;font:500 26px In;letter-spacing:.42em;padding-left:.42em;color:{ACC}'>DESTINATION 0{i+1} / 05 &nbsp;·&nbsp; {f['place']}</div>"
    ov[f'f{i}'] = (f"<div style='position:absolute;top:104px;height:150px;width:100%;display:flex;align-items:center;justify-content:center'>"
                   f"<div style='font:400 {f.get('fs',120)}px/1.0 It;text-align:center;letter-spacing:.06em;padding-left:.06em;white-space:nowrap;color:{INK}' class=fit>{f['t']}</div></div>"
                   f"<div style='position:absolute;top:262px;width:100%;font:500 28px In;letter-spacing:.3em;padding-left:.3em;color:{INK};opacity:.9'>{f['yr']} &nbsp;<span style='color:{ACC}'>|</span>&nbsp; {f['where']}</div>")
    ov[f'l{i}'] = (f"<div style='position:absolute;top:{PY[1]+PH+58}px;width:100%;font:italic 400 50px/1.15 Bo;color:{INK}'>{f['line']}</div>"
                   f"<div style='position:absolute;top:{PY[1]+PH+168}px;width:100%;font:500 24px In;letter-spacing:.34em;padding-left:.34em;color:rgba(243,238,228,.62)'>{f['route']}</div>")
    for q, s in enumerate(SC):
        ov[f's{i}_{q}'] = stamp(f, s, 0.92 if q == 3 else 0.7)
FIT = "<script>for(const e of document.querySelectorAll('.fit')){let s=parseFloat(getComputedStyle(e).fontSize);while(e.scrollWidth>980&&s>40){s-=2;e.style.fontSize=s+'px'}}</script>"
pages = {k: f"<html><head><meta charset=utf-8><style>{CSS}</style></head><body>{v}{FIT}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);await p.evaluate(()=>{for(const e of document.querySelectorAll('.fit')){let s=parseFloat(getComputedStyle(e).fontSize);while(e.scrollWidth>980&&s>40){s-=2;e.style.fontSize=s+'px'}}});"
      "await p.waitForTimeout(120);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
if len(sys.argv) > 2 and sys.argv[2] == '--ov': sys.exit()
FL = 'F2F4F5'
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], y=b[2], mv=1 if k % 2 else -1, z=1.1))
tc = [piece(c[0], c[2], W, H, x=c[1], y=c[3], mv=1 if k % 2 == 0 else -1, z=1.08) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[0]fade=in:st=0:d=0.2:color=0x{FL}[z];[1]format=rgba[s];[z][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.1:d=0.35:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.25:d=0.45:alpha=1[h];[b][h]overlay=x='-max(0,50-180*(t-0.25))':y=0[c];"
      f"[4]format=rgba,fade=in:st=0.35:d=0.3:alpha=1[e];[c][e]overlay=0:0[d];"
      f"[5]format=rgba,fade=in:st=0.7:d=0.2:alpha=1[br];[d][br]overlay=x='-{W}*pow(max(0,1-(t-0.7)/0.45),3)':y=0[d2];"
      f"[6]format=rgba,fade=in:st=1.05:d=0.45:alpha=1[u];[d2][u]overlay=x=0:y='max(0,30-90*(t-1.05))'[f];"
      f"[7]format=rgba,fade=in:st=1.35:d=0.45:alpha=1[r];[f][r]overlay=0:0,format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tbar.png -loop 1 -i {T}/tsub.png -loop 1 -i {T}/tfoot.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SD = 3.2
SCHED = [[(0, 0, 1.0), (1, 1.0, 2.1), (2, 2.1, 3.2)], [(3, 0, 0.6), (4, 0.6, 1.7), (0, 1.7, 2.6), (3, 2.6, 3.2)]]
ST = [0.45, 0.5, 0.55, 0.6]
for i, f in enumerate(P['films']):
    st = f['stills']; pans = []
    for j, sch in enumerate(SCHED):
        parts = [piece(st[s][0], round(e - b, 3), W, PH, x=st[s][1], y=st[s][2], mv=1 if (i + j + q) % 2 else -1, z=1.1) for q, (s, b, e) in enumerate(sch)]
        open(f'{T}/p{i}_{j}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}_{j}.txt -c copy {T}/pan{i}_{j}.mp4"); pans.append(f'{T}/pan{i}_{j}.mp4')
    dl = [0.0, 0.1]
    fc = f"color=c=0x{BG}:s={W}x{H}:r={FPS}:d={SD}[bg];"; cur = 'bg'
    for j in range(2):
        sgn = -1 if j == 0 else 1
        fc += (f"[{j}]setpts=PTS+{dl[j]}/TB[q{j}];[{cur}][q{j}]overlay=x='{sgn}*{W}*pow(max(0,1-(t-{dl[j]})/0.35),3)':y={PY[j]}:enable='gte(t,{dl[j]})':eof_action=repeat[m{j}];"); cur = f'm{j}'
    fc += (f"[2]format=rgba[fr];[{cur}][fr]overlay=0:0[a];"
           f"[3]format=rgba,fade=in:st=0.05:d=0.25:alpha=1[k];[a][k]overlay=0:0[b];"
           f"[4]format=rgba,fade=in:st=0.12:d=0.35:alpha=1[o];[b][o]overlay=x=0:y='36*pow(max(0,1-(t-0.12)/0.45),3)'[c];"
           f"[5]format=rgba,fade=in:st=0.3:d=0.4:alpha=1[l];[c][l]overlay=0:0[d0];")
    cur = 'd0'
    for q in range(4):
        en = f"between(t,{ST[q]},{ST[q+1]-0.001})" if q < 3 else f"gte(t,{ST[3]})"
        fc += f"[{6+q}]format=rgba[st{q}];[{cur}][st{q}]overlay=0:0:enable='{en}'[d{q+1}];"; cur = f'd{q+1}'
    fc += f"[{cur}]fade=in:st=0:d=0.12:color=0x{FL},format=yuv420p"
    sh(f"ffmpeg -v error -y -i {pans[0]} -i {pans[1]} -loop 1 -i {T}/page.png -loop 1 -i {T}/k{i}.png -loop 1 -i {T}/f{i}.png -loop 1 -i {T}/l{i}.png "
       + ' '.join(f"-loop 1 -i {T}/s{i}_{q}.png" for q in range(4)) + f" -filter_complex \"{fc}\" -t {SD} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(30))
bg = Image.blend(bg, Image.new('RGB', (W, H), (10, 18, 38)), 0.35)
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
fc += "[v]eq=saturation=1.04:contrast=1.05,colorbalance=rs=-0.01:bs=0.03:rh=0.03:bh=-0.01,noise=alls=9:allf=t,vignette=PI/5,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -t {TEND+ED} -r {FPS} -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
