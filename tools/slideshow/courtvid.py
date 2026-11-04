"""GILDED COURT stills video. Usage: python3 courtvid.py WORKDIR [--ov]  (reads plan.json -> video.mp4)
Burst of 7 flash cuts -> champagne flash -> full-screen drifting title (Cinzel spaced kicker, Italianno script 'life at',
Cinzel Decorative 'COURT', crown ornament, Bodoni italic sub) -> per film: oxblood velvet page w/ faint gold damask,
3 rounded gilt-framed panels fading in staggered, each jump-cutting through 3 stills (offset cut points),
'ACT N · PLACE' + Cinzel title on top, Bodoni italic line + 'year | where' under; champagne shimmer between films
-> framed Cinema phone on blurred candlelit still (no text)."""
import json, os, subprocess, sys, math
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#F6ECDD'); ACC = P.get('acc', '#EBA9B6'); GOLD = P.get('gold', '#CFA960'); PAGE = P.get('page', '#21060C')
TOPB, PH, GAP, PX = 286, 430, 24, 40
PW = W - 2 * PX
PY = [TOPB + k * (PH + GAP) for k in range(3)]
def sh(c): subprocess.run(c, shell=True, check=True)
def hexrgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.12, zoom=0.0):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.1 * mv)); b = max(0, min(1, x / 100 + 0.1 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out

F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = (ff('Ci', 'cinzel', 400) + ff('Ci', 'cinzel', 600) + ff('Cd', 'cinzel-decorative', 700) + ff('It', 'italianno', 400) +
       ff('Bo', 'bodoni-moda', 400, 'italic') + ff('Bo', 'bodoni-moda', 400) +
       f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center}}")
CROWN = (f"<svg width='70' height='46' viewBox='0 0 70 46'><path d='M6 38 L3 10 L19 24 L35 4 L51 24 L67 10 L64 38 Z' fill='none' stroke='{GOLD}' stroke-width='2.4' stroke-linejoin='round'/>"
         f"<path d='M8 43 H62' stroke='{GOLD}' stroke-width='2.4'/><circle cx='3' cy='9' r='3' fill='{GOLD}'/><circle cx='35' cy='3.5' r='3.4' fill='{ACC}'/><circle cx='67' cy='9' r='3' fill='{GOLD}'/>"
         f"<circle cx='20' cy='33' r='2.2' fill='{ACC}'/><circle cx='35' cy='31' r='2.6' fill='{GOLD}'/><circle cx='50' cy='33' r='2.2' fill='{ACC}'/></svg>")
def rule(wd=150): return f"<div style='width:{wd}px;height:1.6px;background:linear-gradient(90deg,transparent,{GOLD})'></div>"
def ruler(wd=150): return f"<div style='width:{wd}px;height:1.6px;background:linear-gradient(270deg,transparent,{GOLD})'></div>"
DIAM = f"<div style='width:9px;height:9px;transform:rotate(45deg);background:{ACC}'></div>"
ti = P['title']; top = ti.get('top', 170)
SH = "text-shadow:0 2px 26px rgba(20,2,6,.8),0 0 8px rgba(20,2,6,.45)"
ov = {}
ov['tshade'] = ("<div style='position:absolute;top:0;left:0;width:100%;height:1250px;background:linear-gradient(180deg,rgba(26,4,9,.92),rgba(26,4,9,.8) 52%,rgba(26,4,9,0))'></div>"
                "<div style='position:absolute;bottom:0;left:0;width:100%;height:420px;background:linear-gradient(0deg,rgba(26,4,9,.6),rgba(26,4,9,0))'></div>")
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:400 30px Ci;letter-spacing:.42em;padding-left:.42em;color:{ACC}'>{ti['kick']}</div>"
ov['tscript'] = f"<div style='position:absolute;top:{top+40}px;width:100%;{SH};font:400 190px/1 It;color:{INK}'>{ti['script']}</div>"
ov['thero'] = f"<div style='position:absolute;top:{top+212}px;width:100%;{SH};font:700 {ti.get('fs',178)}px/1 Cd;letter-spacing:.06em;padding-left:.06em;color:{INK}'>{ti['hero']}</div>"
ov['tsub'] = (f"<div style='position:absolute;top:{top+430}px;width:100%;{SH}'>"
              f"<div style='display:flex;align-items:center;justify-content:center;gap:24px;margin-bottom:26px'>{rule(190)}{CROWN}{ruler(190)}</div>"
              f"<div style='font:400 italic 46px/1.28 Bo;color:{INK}'>{ti['sub']}</div></div>")
ov['tfoot'] = (f"<div style='position:absolute;top:{H-150}px;width:100%;{SH};display:flex;align-items:center;justify-content:center;gap:20px'>"
               f"{rule(90)}<div style='font:400 25px Ci;letter-spacing:.44em;padding-left:.44em;color:{INK}'>{ti['foot']}</div>{ruler(90)}</div>")

# page: oxblood velvet, faint gold damask lattice, soft vignette, rounded gilt-framed holes
pg = Image.new('RGB', (W, H), PAGE); dr = ImageDraw.Draw(pg, 'RGBA'); g = hexrgb(GOLD)
S = 96
for j in range(-1, H // S + 2):
    for i in range(-1, W // S + 2):
        cx, cy = i * S + (S // 2 if j % 2 else 0), j * S
        pts = [(cx + 30 * math.sin(a / 40 * 2 * math.pi) * (0.55 + 0.45 * abs(math.cos(a / 40 * 2 * math.pi))), cy - 40 * math.cos(a / 40 * 2 * math.pi)) for a in range(41)]
        dr.line(pts, fill=g + (24,), width=2)
        dr.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=g + (34,))
        dr.ellipse([cx - 1 + S // 2, cy + S // 2 - 1, cx + 1 + S // 2, cy + S // 2 + 1], fill=g + (30,))
vg = Image.new('L', (W, H), 0); ImageDraw.Draw(vg).ellipse([-300, -200, W + 300, H + 200], fill=255)
vg = vg.filter(ImageFilter.GaussianBlur(220))
pg = Image.composite(pg, Image.new('RGB', (W, H), (10, 2, 4)), vg).filter(ImageFilter.GaussianBlur(.5)).convert('RGBA')
m = Image.new('L', (W, H), 255); dm = ImageDraw.Draw(m)
for y in PY: dm.rounded_rectangle([PX, y, PX + PW - 1, y + PH - 1], 30, fill=0)
pg.putalpha(m)
d2 = ImageDraw.Draw(pg)
for y in PY:
    d2.rounded_rectangle([PX - 3, y - 3, PX + PW + 2, y + PH + 2], 33, outline=g + (235,), width=3)
    d2.rounded_rectangle([PX - 12, y - 12, PX + PW + 11, y + PH + 11], 41, outline=g + (90,), width=1)
pg.save(f'{T}/mat.png')
BOT = PY[2] + PH
for i, f in enumerate(P['films']):
    ov[f'f{i}'] = (f"<div style='position:absolute;top:0;height:{TOPB}px;width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding-top:40px;box-sizing:border-box'>"
                   f"<div style='display:flex;align-items:center;gap:16px'>{rule(70)}<div style='font:400 23px Ci;letter-spacing:.36em;color:{ACC};padding-left:.36em'>{f['act']}</div>{ruler(70)}</div>"
                   f"<div style='font:600 {f.get('fs',76)}px/1.04 Ci;letter-spacing:.03em;margin-top:18px;max-width:1020px'>{f['t']}</div></div>"
                   f"<div style='position:absolute;top:{BOT}px;height:{H-BOT}px;width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding-bottom:26px;box-sizing:border-box'>"
                   f"<div style='font:400 italic 40px/1.24 Bo;max-width:960px'>{f['line']}</div>"
                   f"<div style='display:flex;align-items:center;gap:16px;margin-top:22px'>{DIAM}<div style='font:400 24px Ci;letter-spacing:.3em;color:{GOLD};padding-left:.3em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div>{DIAM}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
if len(sys.argv) > 2 and sys.argv[2] == '--ov': sys.exit()

SHIM = 'F7E6C4'
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], y=b[2] if len(b) > 2 else 50, mv=1 if k % 2 else -1, z=1.1))
tc = [piece(c[0], c[2], W, H, x=c[1], y=c[3] if len(c) > 3 else 50, mv=1 if k % 2 == 0 else -1, z=1.08) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[0]fade=in:st=0:d=0.22:color=0x{SHIM}[z];[1]format=rgba[s];[z][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.1:d=0.4:alpha=1[k];[a][k]overlay=x=0:y='max(0,20-70*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.3:d=0.55:alpha=1[h];[b][h]overlay=x=0:y='max(0,40-110*(t-0.3))'[c];"
      f"[4]format=rgba,fade=in:st=0.55:d=0.5:alpha=1[e];[c][e]overlay=x=0:y='max(0,50-140*(t-0.55))'[d];"
      f"[5]format=rgba,fade=in:st=0.95:d=0.55:alpha=1[u];[d][u]overlay=x=0:y='max(0,30-90*(t-0.95))'[f];"
      f"[6]format=rgba,fade=in:st=1.35:d=0.5:alpha=1[r];[f][r]overlay=0:0,format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tsub.png -loop 1 -i {T}/tfoot.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.0); ST = 0.12
for i, f in enumerate(P['films']):
    grid = f['grid']; panels = []
    for k in range(3):
        parts = []; t0 = ST * k
        bounds = [0, 0.9 + 0.16 * k, 1.85 + 0.1 * k, SEG - t0]
        for ph in range(3):
            it = grid[ph][k]; img, x = it[:2]; y = it[2] if len(it) > 2 else 45
            parts.append(piece(img, round(bounds[ph + 1] - bounds[ph], 3), PW, PH, x, y, mv=1 if (k + ph) % 2 else -1))
        open(f'{T}/p{i}{k}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}{k}.txt -c copy {T}/pan{i}{k}.mp4"); panels.append(f'{T}/pan{i}{k}.mp4')
    fc = f"color=c={PAGE}:s={W}x{H}:r={FPS}:d={SEG}[bg];"
    for k in range(3): fc += f"[{k}]format=rgba,fade=in:st=0:d=0.28:alpha=1,setpts=PTS-STARTPTS+{ST*k}/TB[q{k}];"
    last = 'bg'
    for k in range(3):
        fc += f"[{last}][q{k}]overlay=x={PX}:y='{PY[k]}+36*pow(max(0,1-(t-{ST*k})/0.34),3)':eof_action=pass[l{k}];"; last = f'l{k}'
    fc += (f"[3]format=rgba[mt];[{last}][mt]overlay=0:0[mm];[4]format=rgba,fade=in:st=0.12:d=0.3:alpha=1[o];[mm][o]overlay=0:0,"
           f"fade=in:st=0:d=0.14:color=0x{SHIM},format=yuv420p")
    sh(f"ffmpeg -v error -y -i {panels[0]} -i {panels[1]} -i {panels[2]} -loop 1 -i {T}/mat.png -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(30))
bg = Image.blend(bg, Image.new('RGB', (W, H), (34, 6, 12)), 0.4)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
mk = Image.new('L', (W, H), 0)
ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
mk = mk.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25:color=0x{SHIM},format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.04:contrast=1.04,colorbalance=rs=0.02:gs=0.0:bs=-0.012:rh=0.01,noise=alls=6:allf=t,vignette=PI/7,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
