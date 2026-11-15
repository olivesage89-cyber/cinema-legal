"""ISLAND, NO SIGNAL stills video. Usage: python3 islandvid.py WORKDIR [--ov]  (plan.json -> video.mp4)
7-flash burst -> full-screen jump-cut title (deep lagoon shade, Space Mono 'NO SERVICE' status bar w/ empty signal bars,
Inter kicker, sand Cormorant italic 'an island with', giant coral Shrikhand 'no signal', turquoise rule, Cormorant sub,
Space Mono foot) -> per film: lagoon page, Space Mono 'ISLAND 0X / 05 · PLACE' + signal bars, sand Shrikhand title,
'year | where', FOUR cinemascope strips stacked edge to edge sliding in from alternating sides + jump-cutting out of sync,
Cormorant italic line + DIR. -> phone end card on blurred lagoon, no text."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
SAND = '#F6E9D2'; CORAL = '#FF7F66'; TURQ = '#5FE0D4'; SH_C = '2,30,32'; BG = '03282A'
SH, GAP, SY0 = 318, 4, 332
SY = [SY0 + k * (SH + GAP) for k in range(4)]
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
CSS = (ff('Sh', 'shrikhand', 400) + ff('Sm', 'space-mono', 400) + ff('Sm', 'space-mono', 700) + ff('In', 'inter', 500) + ff('In', 'inter', 600) +
       ff('Co', 'cormorant-garamond', 400, 'italic') + ff('Co', 'cormorant-garamond', 500, 'italic') +
       f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{SAND};text-align:center}}")
TS = f"text-shadow:0 3px 26px rgba({SH_C},.95),0 0 10px rgba({SH_C},.8)"
def bars(col, on=0, sz=1.0):
    s = ''.join(f"<span style='display:inline-block;width:{int(7*sz)}px;height:{int((8+k*6)*sz)}px;margin-right:{int(4*sz)}px;border-radius:2px;"
                f"{'background:'+col if k < on else 'border:2px solid '+col+';box-sizing:border-box;opacity:.75'}'></span>" for k in range(4))
    return f"<span style='display:inline-flex;align-items:flex-end;vertical-align:-2px'>{s}</span>"
ti = P['title']; top = ti.get('top', 330)
ov = {}
ov['tshade'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1360px;background:linear-gradient(180deg,rgba({SH_C},.88),rgba({SH_C},.6) 62%,rgba({SH_C},0))'></div>"
                f"<div style='position:absolute;bottom:0;left:0;width:100%;height:420px;background:linear-gradient(0deg,rgba({SH_C},.75),rgba({SH_C},0))'></div>")
ov['tstat'] = (f"<div style='position:absolute;top:70px;left:70px;right:70px;display:flex;justify-content:space-between;font:700 28px Sm;letter-spacing:.06em;{TS}'>"
               f"<span>{bars(SAND, 0, 1.3)}&nbsp; No Service</span><span style='color:{CORAL}'>✕ &nbsp;0 BARS</span></div>")
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{TS};font:600 32px In;letter-spacing:.5em;padding-left:.5em'>{ti['kick']}</div>"
ov['tpre'] = f"<div style='position:absolute;top:{top+62}px;width:100%;{TS};font:italic 500 112px/1.1 Co;color:{SAND}'>{ti['pre']}</div>"
ov['thero'] = (f"<div style='position:absolute;top:{top+190}px;width:100%;{TS};font:400 178px/1.15 Sh;color:{CORAL};white-space:nowrap' class=fitw>{ti['hero']}</div>")
ov['tbar'] = f"<div style='position:absolute;top:{top+438}px;left:360px;width:360px;height:3px;background:{TURQ};box-shadow:0 0 16px {TURQ}'></div>"
ov['tsub'] = f"<div style='position:absolute;top:{top+478}px;left:70px;right:70px;{TS};font:italic 400 60px/1.18 Co'>{ti['sub']}</div>"
ov['tfoot'] = f"<div style='position:absolute;top:{top+700}px;width:100%;{TS};font:700 26px Sm;letter-spacing:.3em;padding-left:.3em;color:{TURQ}'>✕&nbsp; {ti['foot']} &nbsp;✕</div>"
# lagoon page with soft sun glow at top
g = Image.new('RGB', (W, H)); gd = ImageDraw.Draw(g)
for yy in range(H):
    t = yy / H; c = (int(4 + 2 * t), int(46 - 22 * t), int(48 - 20 * t)); gd.line([(0, yy), (W, yy)], fill=c)
glow = Image.new('L', (W, H), 0); ImageDraw.Draw(glow).ellipse([140, -260, 940, 360], fill=90); glow = glow.filter(ImageFilter.GaussianBlur(120))
g = Image.composite(Image.new('RGB', (W, H), (60, 150, 140)), g, glow)
g.save(f'{T}/page.png')
for i, f in enumerate(P['films']):
    ov[f'k{i}'] = (f"<div style='position:absolute;top:62px;width:100%;font:700 25px Sm;letter-spacing:.24em;padding-left:.24em;color:{TURQ}'>"
                   f"ISLAND 0{i+1} / 05 &nbsp;·&nbsp; {f['place']} &nbsp; {bars(TURQ, 0, 0.9)}</div>")
    ov[f'f{i}'] = (f"<div style='position:absolute;top:100px;height:150px;width:100%;display:flex;align-items:center;justify-content:center'>"
                   f"<div style='font:400 {f.get('fs',112)}px/1.15 Sh;text-align:center;white-space:nowrap;color:{SAND}' class=fit>{f['t']}</div></div>"
                   f"<div style='position:absolute;top:262px;width:100%;font:600 27px In;letter-spacing:.3em;padding-left:.3em;color:{SAND};opacity:.92'>{f['yr']} &nbsp;<span style='color:{CORAL}'>|</span>&nbsp; {f['where'].upper()}</div>")
    ov[f'l{i}'] = (f"<div style='position:absolute;top:{SY[3]+SH+40}px;left:60px;right:60px;font:italic 500 58px/1.1 Co;color:{SAND};white-space:nowrap'>{f['line']}</div>"
                   f"<div style='position:absolute;top:{SY[3]+SH+176}px;width:100%;font:700 22px Sm;letter-spacing:.28em;padding-left:.28em;color:{CORAL};opacity:.9'>{f['dir']}</div>")
pages = {k: f"<html><head><meta charset=utf-8><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.evaluate(()=>{for(const e of document.querySelectorAll('.fit')){let s=parseFloat(getComputedStyle(e).fontSize);while(e.scrollWidth>960&&s>40){s-=2;e.style.fontSize=s+'px'}}"
      "for(const e of document.querySelectorAll('.fitw')){let s=parseFloat(getComputedStyle(e).fontSize);e.style.display='inline-block';e.style.width='auto';while(e.scrollWidth>980&&s>60){s-=2;e.style.fontSize=s+'px'}e.style.display='block';e.style.width='100%%'}});"
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
fc = (f"[0]fade=in:st=0:d=0.2:color=0x{FL}[z];[1]format=rgba[s];[z][s]overlay=0:0[a0];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[st];[a0][st]overlay=x=0:y='-30*pow(max(0,1-t/0.4),3)'[a];"
      f"[3]format=rgba,fade=in:st=0.1:d=0.35:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[4]format=rgba,fade=in:st=0.25:d=0.5:alpha=1[h];[b][h]overlay=x=0:y='max(0,40-120*(t-0.25))'[c];"
      f"[5]format=rgba,fade=in:st=0.5:d=0.3:alpha=1[e];[c][e]overlay=x=0:y='70*pow(max(0,1-(t-0.5)/0.45),3)'[d];"
      f"[6]format=rgba,fade=in:st=0.9:d=0.3:alpha=1[br];[d][br]overlay=x='-{W}*pow(max(0,1-(t-0.9)/0.45),3)':y=0[d2];"
      f"[7]format=rgba,fade=in:st=1.1:d=0.45:alpha=1[u];[d2][u]overlay=x=0:y='max(0,30-90*(t-1.1))'[f];"
      f"[8]format=rgba,fade=in:st=1.45:d=0.45:alpha=1[r];[f][r]overlay=0:0,format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tstat.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tpre.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tbar.png -loop 1 -i {T}/tsub.png -loop 1 -i {T}/tfoot.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SD = 3.3
SCHED = [[(0, 0, 0.9), (4, 0.9, 1.8), (0, 1.8, 2.6), (4, 2.6, 3.3)],
         [(1, 0, 0.6), (5, 0.6, 1.5), (1, 1.5, 2.4), (5, 2.4, 3.3)],
         [(2, 0, 1.0), (6, 1.0, 1.9), (2, 1.9, 2.8), (6, 2.8, 3.3)],
         [(3, 0, 0.75), (7, 0.75, 1.65), (3, 1.65, 2.5), (7, 2.5, 3.3)]]
for i, f in enumerate(P['films']):
    st = f['stills']; pans = []
    for j, sch in enumerate(SCHED):
        parts = [piece(st[s][0], round(e - b, 3), W, SH, x=st[s][1], y=st[s][2], mv=1 if (i + j + q) % 2 else -1, z=1.1) for q, (s, b, e) in enumerate(sch)]
        open(f'{T}/p{i}_{j}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}_{j}.txt -c copy {T}/pan{i}_{j}.mp4"); pans.append(f'{T}/pan{i}_{j}.mp4')
    dl = [0.0, 0.1, 0.2, 0.3]
    fc = ''; cur = '4:v'
    fc += f"[4]format=yuv420p[pg];"; cur = 'pg'
    for j in range(4):
        sgn = '-' if j % 2 == 0 else ''
        fc += (f"[{j}]setpts=PTS+{dl[j]}/TB[q{j}];[{cur}][q{j}]overlay=x='{sgn}{W}*pow(max(0,1-(t-{dl[j]})/0.42),3)':y={SY[j]}:enable='gte(t,{dl[j]})':eof_action=repeat[m{j}];"); cur = f'm{j}'
    fc += (f"[5]format=rgba,fade=in:st=0.05:d=0.25:alpha=1[k];[{cur}][k]overlay=0:0[b];"
           f"[6]format=rgba,fade=in:st=0.12:d=0.35:alpha=1[o];[b][o]overlay=x=0:y='36*pow(max(0,1-(t-0.12)/0.45),3)'[c];"
           f"[7]format=rgba,fade=in:st=0.5:d=0.4:alpha=1[l];[c][l]overlay=x=0:y='30*pow(max(0,1-(t-0.5)/0.5),3)',"
           f"fade=in:st=0:d=0.12:color=0x{FL},format=yuv420p")
    sh(f"ffmpeg -v error -y -i {pans[0]} -i {pans[1]} -i {pans[2]} -i {pans[3]} -loop 1 -i {T}/page.png -loop 1 -i {T}/k{i}.png -loop 1 -i {T}/f{i}.png -loop 1 -i {T}/l{i}.png "
       f"-filter_complex \"{fc}\" -t {SD} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(30))
bg = Image.blend(bg, Image.new('RGB', (W, H), (3, 40, 42)), 0.3)
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
fc += "[v]eq=saturation=1.07:contrast=1.04,colorbalance=rs=0.01:bs=0.01:rh=0.03:gh=0.01:bh=-0.03,noise=alls=8:allf=t,vignette=PI/5,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -t {TEND+ED} -r {FPS} -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
