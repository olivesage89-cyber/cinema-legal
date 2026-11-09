"""SECRET GARDEN stills video. Usage: python3 gardenvid.py WORKDIR [--ov]  (reads plan.json -> video.mp4)
7-flash burst -> full-screen drifting title (jump cuts) w/ moss shade + curling ivy corners, Cormorant SC kicker,
rose Mrs Saint Delafield 'a secret', cream Bodoni Moda caps GARDEN, Cormorant italic sub -> per film: 3 rounded panels
stacked edge to edge on a moss page with pressed-leaf silhouettes, panels slide in staggered and jump-cut out of sync,
'Nº 0X / 05 · PLACE' kicker, Bodoni italic title, rose 'year | where', italic line; falling petals over everything
-> phone end card on blurred still, no text."""
import json, os, subprocess, sys, random, math
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#F6EEDF'); ACC = P.get('acc', '#F2A3B3'); SH_C = P.get('shade', '12,26,17'); BG = P.get('bg', '10261A')
PX, PW, PH, RR = 60, 960, 440, 30
PY = [392, 848, 1304]
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
CSS = (ff('Bd', 'bodoni-moda', 500) + ff('Bd', 'bodoni-moda', 500, 'italic') + ff('Bd', 'bodoni-moda', 700) + ff('Ms', 'mrs-saint-delafield', 400) +
       ff('Cs', 'cormorant-sc', 500) + ff('Cs', 'cormorant-sc', 600) + ff('Cg', 'cormorant-garamond', 500, 'italic') +
       f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center}}")
SH = f"text-shadow:0 3px 26px rgba({SH_C},.95),0 0 10px rgba({SH_C},.75)"

def leaf(x, y, ang, s, col, op):
    return (f"<path transform='translate({x:.0f},{y:.0f}) rotate({ang:.0f}) scale({s:.2f})' d='M0 0 C 12 -16 34 -18 52 0 C 34 18 12 16 0 0 Z' "
            f"fill='{col}' fill-opacity='{op}'/><path transform='translate({x:.0f},{y:.0f}) rotate({ang:.0f}) scale({s:.2f})' d='M0 0 L46 0' stroke='{col}' stroke-opacity='{op*0.6}' stroke-width='1.5'/>")
def vine(ox, oy, fx, fy, col='#CFE3C2', op=.8, sc=1.0):
    # ivy running from a corner along the top/bottom edge (wavy stem, leaves, berries, spiral curl at the tip)
    out = ''
    for L, horiz in ((600 * sc, True), (380 * sc, False)):
        pts = []
        for k in range(40):
            t = k / 39; u = L * t; w = 22 * math.sin(t * 7.0) * (0.4 + t)
            pts.append((ox + fx * (u if horiz else 70 + w), oy + fy * (70 + w if horiz else u)))
        ex, ey = pts[-1]
        for k in range(1, 36):
            t = k / 35; r = 40 * (1 - t) + 4; a = t * 8.5
            if horiz: pts.append((ex + fx * (r * math.sin(a)), ey + fy * (40 - r * math.cos(a))))
            else: pts.append((ex + fx * (40 - r * math.cos(a)), ey + fy * (r * math.sin(a))))
        d = 'M' + ' L'.join(f'{x:.0f} {y:.0f}' for x, y in pts)
        out += f"<path d='{d}' fill='none' stroke='{col}' stroke-opacity='{op}' stroke-width='2.4' stroke-linecap='round'/>"
        rnd = random.Random(int(ox * 3 + oy + L))
        for k in range(3, 38, 3):
            x, y = pts[k]; side = 1 if (k // 3) % 2 else -1
            base = (0 if fx > 0 else 180) if horiz else (90 if fy > 0 else 270)
            out += leaf(x, y, base + side * 55 + rnd.uniform(-12, 12), 0.55 + 0.4 * rnd.random(), col, op)
        for k in (8, 20, 29):
            x, y = pts[k]
            out += f"<circle cx='{x:.0f}' cy='{y:.0f}' r='6' fill='{ACC}' fill-opacity='.9'/><circle cx='{x+9:.0f}' cy='{y+7:.0f}' r='4.5' fill='{ACC}' fill-opacity='.8'/>"
    return out

ti = P['title']; top = ti.get('top', 300)
VINES = (f"<svg style='position:absolute;left:0;top:0' width='{W}' height='{H}'>" + vine(0, 0, 1, 1) + vine(W, H, -1, -1) + "</svg>")
ov = {}
ov['tshade'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1300px;background:linear-gradient(180deg,rgba({SH_C},.9),rgba({SH_C},.6) 55%,rgba({SH_C},0))'></div>"
                f"<div style='position:absolute;bottom:0;left:0;width:100%;height:520px;background:linear-gradient(0deg,rgba({SH_C},.8),rgba({SH_C},0))'></div>"
                f"<div style='position:absolute;left:44px;top:44px;right:44px;bottom:44px;border:1.5px solid rgba(246,238,223,.45);border-radius:36px'></div>" + VINES)
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:600 38px Cs;letter-spacing:.38em;padding-left:.38em;color:{INK}'>{ti['kick']}</div>"
ov['tscript'] = f"<div style='position:absolute;top:{top+40}px;width:100%;{SH};font:400 {ti.get('fs2',190)}px/1.3 Ms;color:{ACC};transform:rotate(-4deg)'>{ti['script']}</div>"
ov['thero'] = f"<div style='position:absolute;top:{top+230}px;width:100%;{SH};font:500 {ti.get('fs',190)}px/1 Bd;letter-spacing:.06em;padding-left:.06em;color:{INK}'>{ti['hero']}</div>"
ov['tsub'] = (f"<div style='position:absolute;top:{top+455}px;left:120px;right:120px;{SH};font:italic 500 56px/1.15 Cg;color:{INK}'>{ti['sub']}</div>")
ov['tfoot'] = (f"<div style='position:absolute;top:{top+630}px;width:100%;{SH};font:600 30px Cs;letter-spacing:.45em;padding-left:.45em;color:{ACC}'>❦ &nbsp;{ti['foot']}&nbsp; ❦</div>")
# moss page with pressed-leaf silhouettes (panels punched out later)
rnd = random.Random(7); leaves = ''
for k in range(46):
    leaves += leaf(rnd.uniform(-40, W), rnd.uniform(-40, H), rnd.uniform(0, 360), rnd.uniform(1.2, 3.2), '#9FC79A', rnd.uniform(.035, .08))
ov['page'] = (f"<div style='position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 45%,#1D3A27,#12281B 60%,#0A1810)'></div>"
              f"<svg style='position:absolute;left:0;top:0' width='{W}' height='{H}'>{leaves}</svg>"
              + ''.join(f"<div style='position:absolute;left:{PX-1}px;top:{y-1}px;width:{PW}px;height:{PH}px;border:1.5px solid rgba(242,163,179,.5);border-radius:{RR+1}px'></div>" for y in PY))
for i, f in enumerate(P['films']):
    ov[f'k{i}'] = f"<div style='position:absolute;top:96px;width:100%;font:600 30px Cs;letter-spacing:.34em;padding-left:.34em;color:{ACC};{SH}'>Nº 0{i+1} / 05 &nbsp;·&nbsp; {f['place']}</div>"
    ov[f'f{i}'] = (f"<div style='position:absolute;top:150px;width:100%'>"
                   f"<div style='font:italic 500 {f.get('fs',92)}px/1.12 Bd;color:{INK};white-space:nowrap;{SH}'>{f['t']}</div>"
                   f"<div style='font:600 31px Cs;letter-spacing:.3em;padding-left:.3em;color:{ACC};margin-top:6px;{SH}'>{f['yr']} &nbsp;|&nbsp; {f['where']}</div></div>"
                   f"<div style='position:absolute;top:{PY[2]+PH+40}px;width:100%;font:italic 500 54px/1.15 Cg;color:{INK};{SH}'>{f['line']}</div>")
# falling petals sheet (tileable, 2 x H)
pet = ''
rnd = random.Random(3)
for k in range(30):
    x, y = rnd.uniform(0, W), rnd.uniform(0, H); a = rnd.uniform(0, 360); s = rnd.uniform(.7, 1.5)
    col = rnd.choice(['#F7C6D0', '#F2A3B3', '#FFF3EC', '#F9D9DF'])
    for dy in (0, H):
        pet += (f"<ellipse cx='0' cy='0' rx='{13*s:.1f}' ry='{7*s:.1f}' transform='translate({x:.0f},{y+dy:.0f}) rotate({a:.0f})' fill='{col}' fill-opacity='{rnd.uniform(.55,.9):.2f}'/>")
ov['petals'] = f"<svg style='position:absolute;left:0;top:0' width='{W}' height='{2*H}'><defs><filter id='b'><feGaussianBlur stdDeviation='1.2'/></filter></defs><g filter='url(#b)'>{pet}</g></svg>"
pages = {k: f"<html><head><meta charset=utf-8><style>{CSS}{'body{height:%dpx}' % (2*H) if k=='petals' else ''}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){await p.setViewportSize({width:%d,height:k=='petals'?%d:%d});fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), W, 2 * H, H, T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
S = 3; mk = Image.new('L', (W * S, H * S), 255)
for y in PY: ImageDraw.Draw(mk).rounded_rectangle([PX * S, y * S, (PX + PW) * S, (y + PH) * S], RR * S, fill=0)
mk = mk.resize((W, H), Image.LANCZOS)
pg = Image.open(f'{T}/page.png').convert('RGBA'); pa = pg.split()[3]
from PIL import ImageChops
pg.putalpha(ImageChops.multiply(mk, Image.new('L', (W, H), 255)))
# keep the pink hairline borders that sit on the hole edges
Image.alpha_composite(Image.new('RGBA', (W, H), (0, 0, 0, 0)), pg).save(f'{T}/frame.png')
if len(sys.argv) > 2 and sys.argv[2] == '--ov': sys.exit()

FL = 'FFF4F0'
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], y=b[2] if len(b) > 2 else 50, mv=1 if k % 2 else -1, z=1.1))
tc = [piece(c[0], c[2], W, H, x=c[1], y=c[3] if len(c) > 3 else 50, mv=1 if k % 2 == 0 else -1, z=1.08) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[0]fade=in:st=0:d=0.25:color=0x{FL}[z];[1]format=rgba[s];[z][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.1:d=0.35:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.3:d=0.6:alpha=1[h];[b][h]overlay=x='-max(0,60-200*(t-0.3))':y=0[c];"
      f"[4]format=rgba,fade=in:st=0.55:d=0.45:alpha=1[e];[c][e]overlay=x=0:y='max(0,60-200*(t-0.55))'[d];"
      f"[5]format=rgba,fade=in:st=0.95:d=0.5:alpha=1[u];[d][u]overlay=x=0:y='max(0,30-90*(t-0.95))'[f];"
      f"[6]format=rgba,fade=in:st=1.3:d=0.5:alpha=1[r];[f][r]overlay=0:0,format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tsub.png -loop 1 -i {T}/tfoot.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
# panel schedule: (still index, start, end) per panel — cuts staggered so something changes every ~0.4s
SCHED = [[(0, 0, 1.1), (3, 1.1, 2.2), (2, 2.2, 3.0)], [(1, 0, 1.5), (4, 1.5, 3.0)], [(2, 0, 1.9), (0, 1.9, 3.0)]]
SD = 3.0
for i, f in enumerate(P['films']):
    st = f['stills']  # 5 items [file, x, y]
    pans = []
    for j, sch in enumerate(SCHED):
        parts = [piece(st[s][0], round(e - b, 3), PW, PH, x=st[s][1], y=st[s][2], mv=1 if (i + j + q) % 2 else -1, z=1.12) for q, (s, b, e) in enumerate(sch)]
        open(f'{T}/p{i}_{j}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}_{j}.txt -c copy {T}/pan{i}_{j}.mp4"); pans.append(f'{T}/pan{i}_{j}.mp4')
    dl = [0.0, 0.12, 0.24]
    fc = f"color=c=0x{BG}:s={W}x{H}:r={FPS}:d={SD}[bg];"
    cur = 'bg'
    for j in range(3):
        sgn = -1 if j % 2 == 0 else 1
        fc += (f"[{j}]setpts=PTS+{dl[j]}/TB[q{j}];[{cur}][q{j}]overlay=x='{PX}+{sgn}*260*pow(max(0,1-(t-{dl[j]})/0.45),3)':y={PY[j]}:enable='gte(t,{dl[j]})':eof_action=repeat[m{j}];")
        cur = f'm{j}'
    fc += (f"[3]format=rgba[fr];[{cur}][fr]overlay=0:0[a];"
           f"[4]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[a][k]overlay=0:0[b];"
           f"[5]format=rgba,fade=in:st=0.15:d=0.4:alpha=1[o];[b][o]overlay=x=0:y='50*pow(max(0,1-(t-0.15)/0.5),3)',"
           f"fade=in:st=0:d=0.14:color=0x{FL},format=yuv420p")
    sh(f"ffmpeg -v error -y -i {pans[0]} -i {pans[1]} -i {pans[2]} -loop 1 -i {T}/frame.png -loop 1 -i {T}/k{i}.png -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {SD} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(30))
bg = Image.blend(bg, Image.new('RGB', (W, H), tuple(int(c) for c in SH_C.split(','))), 0.3)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
mk = Image.new('L', (W, H), 0)
ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
mk = mk.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25:color=0x{FL},format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
TEND = round(len(P['burst']) * P.get('flash', 0.2) + tdur + SD * len(P['films']), 3)
inp = ' '.join(f'-i {s}' for s in segs) + f' -loop 1 -i {T}/petals.png'
NP = len(segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(NP)) + ''.join(f'[s{k}]' for k in range(NP)) + f"concat=n={NP}:v=1:a=0[v];"
fc += (f"[{NP}]format=rgba[pt];[v][pt]overlay=x='18*sin(t*0.9)':y='-{H}+mod(t*85,{H})':enable='between(t,{len(P['burst'])*P.get('flash',0.2)},{TEND})':shortest=0[vp];"
       "[vp]eq=saturation=1.07:contrast=1.04,colorbalance=rs=0.02:gs=0.0:bs=-0.01:rh=0.03:bh=-0.02,noise=alls=8:allf=t,vignette=PI/6,format=yuv420p[out]")
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -t {TEND+ED} -r {FPS} -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
