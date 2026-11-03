"""FIELD EXPEDITION stills video. Usage: python3 expedvid.py WORKDIR (reads plan.json -> video.mp4)
Burst -> full-screen drifting title (Special Elite kicker, giant IM Fell SC hero, italic sub, dashed map route to an X)
-> per film: jungle-green page w/ gold topo contours, 3 edge-to-edge cinemascope panels sliding in from alternating
sides with offset jump cuts, parchment hairlines, IM Fell SC title + 'EXPEDITION Nº' + location on top, italic line +
'year | where' under -> phone end card on blurred still."""
import json, os, subprocess, sys, math, random
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#F1E3BF'); ACC = P.get('acc', '#E9B04F'); PAGE = P.get('page', '#0C1610')
TOPB, PH, GAP = 290, 452, 8
PY = [TOPB + k * (PH + GAP) for k in range(3)]
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.12):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.1 * mv)); b = max(0, min(1, x / 100 + 0.1 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out

F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Fs', 'im-fell-english-sc', 400) + ff('Fe', 'im-fell-english', 400) + ff('Fe', 'im-fell-english', 400, 'italic') + \
      ff('Se', 'special-elite', 400) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center}}"
COMPASS = (f"<svg width='64' height='64' viewBox='-32 -32 64 64'><circle r='22' fill='none' stroke='{ACC}' stroke-width='1.5'/>"
           f"<circle r='27' fill='none' stroke='{ACC}' stroke-width='.8' stroke-dasharray='2 3'/>"
           f"<path d='M0-30L5 0 0 30-5 0Z' fill='{ACC}'/><path d='M-30 0L0-5 30 0 0 5Z' fill='{ACC}' opacity='.55'/>"
           f"<circle r='2.5' fill='{PAGE}'/></svg>")
ti = P['title']; top = ti.get('top', 190)
SH = "text-shadow:0 2px 24px rgba(0,0,0,.65),0 0 6px rgba(0,0,0,.35)"
ov = {}
ov['tshade'] = ("<div style='position:absolute;top:0;left:0;width:100%;height:1100px;background:linear-gradient(180deg,rgba(6,14,9,.86),rgba(6,14,9,.6) 45%,rgba(6,14,9,0))'></div>"
                "<div style='position:absolute;bottom:0;left:0;width:100%;height:380px;background:linear-gradient(0deg,rgba(6,14,9,.55),rgba(6,14,9,0))'></div>")
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:400 30px Se;letter-spacing:.34em;padding-left:.34em;color:{ACC}'>{ti['kick']}</div>"
ov['thero'] = f"<div style='position:absolute;top:{top+62}px;width:100%;{SH};font:400 {ti.get('fs',156)}px/1 Fs;letter-spacing:.01em;color:{INK}'>{ti['hero']}</div>"
ov['tsub'] = (f"<div style='position:absolute;top:{top+262}px;width:100%;{SH}'>"
              f"<div style='display:flex;align-items:center;justify-content:center;gap:22px;margin-bottom:20px'>"
              f"<div style='width:170px;height:2px;background:{ACC}'></div>{COMPASS}<div style='width:170px;height:2px;background:{ACC}'></div></div>"
              f"<div style='font:400 italic 47px/1.25 Fe;color:{INK}'>{ti['sub']}</div></div>")
ov['troute'] = (f"<svg style='position:absolute;left:0;top:{H-330}px' width='{W}' height='300' viewBox='0 0 {W} 300'>"
                f"<path d='M110 230 C 260 120, 380 260, 520 170 S 800 60, 930 110' fill='none' stroke='{INK}' stroke-width='4' stroke-dasharray='14 12' opacity='.9'/>"
                f"<circle cx='110' cy='230' r='9' fill='{INK}'/>"
                f"<g transform='translate(950 104)' stroke='#E0533A' stroke-width='9' stroke-linecap='round'><path d='M-22-22L22 22M22-22L-22 22'/></g></svg>"
                f"<div style='position:absolute;top:{H-118}px;width:100%;font:400 25px Se;letter-spacing:.4em;padding-left:.4em;color:{INK};{SH}'>5 FILMS · FOLLOW THE MAP</div>")

# page: jungle green with faint gold topographic contour lines
random.seed(7)
pg = Image.new('RGB', (W, H), PAGE); dr = ImageDraw.Draw(pg, 'RGBA')
for cx, cy, r0 in [(180, 150, 30), (900, 120, 20), (850, 1800, 30), (200, 1790, 40)]:
    for k in range(14):
        r = r0 + k * 26; pts = []
        for s in range(0, 361, 6):
            a = math.radians(s); rr = r * (1 + 0.16 * math.sin(3 * a + k * .4) + 0.08 * math.cos(5 * a + k))
            pts.append((cx + rr * math.cos(a) * 1.5, cy + rr * math.sin(a)))
        dr.line(pts, fill=(233, 176, 79, 30 if k % 4 else 52), width=2)
pg = pg.filter(ImageFilter.GaussianBlur(.6)).convert('RGBA')
m = Image.new('L', (W, H), 255); dm = ImageDraw.Draw(m)
for y in PY: dm.rectangle([0, y, W - 1, y + PH - 1], fill=0)
pg.putalpha(m)
d2 = ImageDraw.Draw(pg)
for y in PY: d2.line([(0, y - 2), (W, y - 2)], fill=(241, 227, 191, 150), width=1); d2.line([(0, y + PH + 1), (W, y + PH + 1)], fill=(241, 227, 191, 150), width=1)
pg.save(f'{T}/mat.png')
BOT = PY[2] + PH
for i, f in enumerate(P['films']):
    ov[f'f{i}'] = (f"<div style='position:absolute;top:0;height:{TOPB}px;width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding-top:44px;box-sizing:border-box'>"
                   f"<div style='font:400 23px Se;letter-spacing:.32em;color:{ACC};padding-left:.32em'>EXPEDITION Nº 0{i+1} &nbsp;·&nbsp; {f['loc']}</div>"
                   f"<div style='font:400 {f.get('fs',82)}px/1.02 Fs;margin-top:16px;max-width:1020px'>{f['t']}</div></div>"
                   f"<div style='position:absolute;top:{BOT}px;height:{H-BOT}px;width:100%;display:flex;flex-direction:column;justify-content:center;padding-bottom:30px;box-sizing:border-box'>"
                   f"<div style='font:400 italic 41px/1.2 Fe;max-width:960px;margin:0 auto'>{f['line']}</div>"
                   f"<div style='font:400 24px Se;letter-spacing:.3em;margin-top:20px;color:{ACC};padding-left:.3em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
if len(sys.argv) > 2 and sys.argv[2] == '--ov': sys.exit()

segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], mv=1 if k % 2 else -1, z=1.08))
tc = [piece(c[0], c[2], W, H, x=c[1], y=c[3] if len(c) > 3 else 50, mv=1 if k % 2 == 0 else -1, z=1.08) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.35:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.22:d=0.5:alpha=1[h];[b][h]overlay=x=0:y='max(0,60-150*(t-0.22))'[c];"
      f"[4]format=rgba,fade=in:st=0.7:d=0.5:alpha=1[u];[c][u]overlay=x=0:y='max(0,30-90*(t-0.7))'[d];"
      f"[5]format=rgba,fade=in:st=1.1:d=0.6:alpha=1[r];[d][r]overlay=x='-{W}*max(0,1-(t-1.1)/0.7)*0':y=0,format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tsub.png -loop 1 -i {T}/troute.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.1); ST = 0.1; PHASES = 3
for i, f in enumerate(P['films']):
    imgs = f['imgs']; mm = len(imgs); panels = []
    for k in range(3):
        parts = []; t0 = ST * k
        # offset cut points per panel so cuts never land together
        bounds = [0, 0.95 + 0.17 * k, 1.95 + 0.12 * k, SEG - t0]
        for ph in range(PHASES):
            it = imgs[(ph * 3 + k + (ph // 2)) % mm]; img, x = it[:2]; y = it[2] if len(it) > 2 else 45
            parts.append(piece(img, round(bounds[ph + 1] - bounds[ph], 3), W, PH, x, y, mv=1 if (k + ph) % 2 else -1))
        open(f'{T}/p{i}{k}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}{k}.txt -c copy {T}/pan{i}{k}.mp4"); panels.append(f'{T}/pan{i}{k}.mp4')
    fc = f"color=c={PAGE}:s={W}x{H}:r={FPS}:d={SEG}[bg];"
    for k in range(3): fc += f"[{k}]format=rgba,setpts=PTS-STARTPTS+{ST*k}/TB[q{k}];"
    last = 'bg'
    for k in range(3):
        sgn = '-' if k % 2 == 0 else ''
        fc += f"[{last}][q{k}]overlay=x='{sgn}{W}*pow(max(0,1-(t-{ST*k})/0.3),3)':y={PY[k]}:eof_action=pass[l{k}];"; last = f'l{k}'
    fc += f"[3]format=rgba[mt];[{last}][mt]overlay=0:0[mm];[4]format=rgba,fade=in:st=0.1:d=0.3:alpha=1[o];[mm][o]overlay=0:0,format=yuv420p"
    sh(f"ffmpeg -v error -y -i {panels[0]} -i {panels[1]} -i {panels[2]} -loop 1 -i {T}/mat.png -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), (12, 22, 16)), 0.35)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
mk = Image.new('L', (W, H), 0)
ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
mk = mk.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25,format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.05:contrast=1.03,colorbalance=rs=0.015:gs=0.008:bs=-0.02,noise=alls=6:allf=t,vignette=PI/7,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
