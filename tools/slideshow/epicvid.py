"""ANCIENT EPIC stills video. Usage: python3 epicvid.py WORKDIR [--ov]  (reads plan.json -> video.mp4)
7-flash burst -> gold flash -> full-screen drifting title (Jost kicker, giant gold Marcellus SC ANCIENT, ivory Italianno 'epic',
laurel rule, Spectral italic sub) -> per film: jump cuts inside a tall Roman ARCH window on a dark bronze page w/ double gold
arch outline + laurel crown, 'Nº 0X / 05 · PLACE' kicker, gold year|where, Marcellus SC title + Spectral italic line rising in
-> phone end card on blurred still, no text."""
import json, os, subprocess, sys, math
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#F6EBD6'); GOLD = P.get('gold', '#E3B25F'); SH_C = P.get('shade', '24,13,7')
AX, AY, AW, AH = 120, 330, 840, 1040; R = AW // 2
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
CSS = (ff('Mc', 'marcellus-sc', 400) + ff('It', 'italianno', 400) + ff('Js', 'jost', 500) + ff('Sp', 'spectral', 400, 'italic') +
       f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center}}")

def laurel(wd=150, col=GOLD, flip=False):
    # one laurel branch curving upward, leaves alternating
    lv = []
    for k in range(7):
        t = k / 6; x = 10 + t * (wd - 30); y = 40 - 26 * math.sin(t * math.pi * .55)
        ang = -20 - 25 * t
        for s in (1, -1):
            lv.append(f"<ellipse cx='{x:.1f}' cy='{y + s*7:.1f}' rx='10' ry='3.8' transform='rotate({ang + s*38:.0f} {x:.1f} {y + s*7:.1f})' fill='{col}'/>")
    path = "M6 42 Q %d 30 %d 12" % (wd * .55, wd - 14)
    tr = f" style='transform:scaleX(-1)'" if flip else ''
    return (f"<svg width='{wd}' height='56' viewBox='0 0 {wd} 56'{tr}><path d='{path}' stroke='{col}' stroke-width='1.6' fill='none'/>"
            + ''.join(lv) + "</svg>")
def rule(wd=170, rev=False):
    g = 'linear-gradient(%s,transparent,%s)' % ('270deg' if rev else '90deg', GOLD)
    return f"<div style='width:{wd}px;height:1.6px;background:{g}'></div>"
CROWN = f"<div style='display:flex;align-items:flex-end;justify-content:center;gap:4px'>{laurel(130)}<svg width='16' height='16' viewBox='-8 -8 16 16'><polygon points='0,-7 7,0 0,7 -7,0' fill='{GOLD}'/></svg>{laurel(130, flip=True)}</div>"
SH = f"text-shadow:0 3px 26px rgba({SH_C},.9),0 0 8px rgba({SH_C},.6)"
ti = P['title']; top = ti.get('top', 250)
ov = {}
ov['tshade'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1250px;background:linear-gradient(180deg,rgba({SH_C},.88),rgba({SH_C},.6) 55%,rgba({SH_C},0))'></div>"
                f"<div style='position:absolute;bottom:0;left:0;width:100%;height:520px;background:linear-gradient(0deg,rgba({SH_C},.8),rgba({SH_C},0))'></div>"
                f"<div style='position:absolute;left:34px;top:34px;right:34px;bottom:34px;border:1.5px solid {GOLD};opacity:.6'></div>"
                f"<div style='position:absolute;left:44px;top:44px;right:44px;bottom:44px;border:1px solid {GOLD};opacity:.35'></div>")
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:500 31px Js;letter-spacing:.52em;padding-left:.52em;color:{INK}'>{ti['kick']}</div>"
ov['thero'] = (f"<div style='position:absolute;top:{top+70}px;width:100%;{SH};font:400 {ti.get('fs',178)}px/1 Mc;letter-spacing:.06em;padding-left:.06em;color:{GOLD}'>{ti['hero']}</div>")
ov['tscript'] = f"<div style='position:absolute;top:{top+185}px;width:100%;{SH};font:400 250px/1 It;color:{INK};transform:rotate(-5deg)'>{ti['script']}</div>"
ov['tsub'] = (f"<div style='position:absolute;top:{top+470}px;width:100%;{SH}'>"
              f"<div style='display:flex;justify-content:center;margin-bottom:24px'>{CROWN}</div>"
              f"<div style='font:400 italic 43px/1.34 Sp;color:{INK}'>{ti['sub']}</div></div>")
ov['tfoot'] = (f"<div style='position:absolute;top:{H-180}px;width:100%;{SH};display:flex;align-items:center;justify-content:center;gap:22px'>"
               f"{rule(110)}<div style='font:500 26px Js;letter-spacing:.5em;padding-left:.5em;color:{GOLD}'>{ti['foot']}</div>{rule(110, True)}</div>")
# arch page (opaque; hole punched later)
def arch_path(o):
    x0, x1, yb, cy, r = AX - o, AX + AW + o, AY + AH + o, AY + R, R + o
    return f"M{x0} {yb} L{x0} {cy} A{r} {r} 0 0 1 {x1} {cy} L{x1} {yb} Z"
KEY = (f"<svg style='position:absolute;left:0;top:0' width='{W}' height='{H}'>"
       f"<path d='{arch_path(16)}' fill='none' stroke='{GOLD}' stroke-width='2.4'/>"
       f"<path d='{arch_path(30)}' fill='none' stroke='{GOLD}' stroke-width='1' stroke-opacity='.55'/>"
       f"<polygon points='540,{AY-46} 553,{AY-30} 540,{AY-14} 527,{AY-30}' fill='{GOLD}'/>"
       + ''.join(f"<line x1='{AX-30}' y1='{AY+AH+30+k}' x2='{AX+AW+30}' y2='{AY+AH+30+k}' stroke='{GOLD}' stroke-opacity='{o}' stroke-width='1.4'/>" for k, o in ((14, .7), (20, .35)))
       + "</svg>")
ov['page'] = (f"<div style='position:absolute;inset:0;background:radial-gradient(ellipse 80% 55% at 50% 45%,#3A2214,#1C0F08 70%,#120904)'></div>"
              f"<div style='position:absolute;inset:0;opacity:.08;background:repeating-linear-gradient(115deg,transparent 0 46px,#F6EBD6 46px 47px,transparent 47px 140px)'></div>"
              f"{KEY}<div style='position:absolute;top:{AY-118}px;width:100%;display:flex;justify-content:center'>{CROWN}</div>")
for i, f in enumerate(P['films']):
    ov[f'k{i}'] = f"<div style='position:absolute;top:118px;width:100%;font:500 26px Js;letter-spacing:.46em;padding-left:.46em;color:{INK};opacity:.92'>Nº 0{i+1} / 05 &nbsp;·&nbsp; {f['place']}</div>"
    ov[f'f{i}'] = (f"<div style='position:absolute;top:{AY+AH+78}px;left:70px;right:70px'>"
                   f"<div style='font:500 25px Js;letter-spacing:.4em;padding-left:.4em;color:{GOLD}'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div>"
                   f"<div style='font:400 {f.get('fs',88)}px/1.04 Mc;letter-spacing:.03em;color:{INK};margin-top:20px'>{f['t']}</div>"
                   f"<div style='font:400 italic 41px/1.3 Sp;margin-top:16px;color:{INK};opacity:.9'>{f['line']}</div></div>")
pages = {k: f"<html><head><meta charset=utf-8><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
# punch the arch hole (anti-aliased) + soft inner shadow
S = 3; mk = Image.new('L', (W * S, H * S), 255); d = ImageDraw.Draw(mk)
d.rectangle([AX * S, (AY + R) * S, (AX + AW) * S, (AY + AH) * S], fill=0); d.ellipse([AX * S, AY * S, (AX + AW) * S, (AY + AW) * S], fill=0)
mk = mk.resize((W, H), Image.LANCZOS)
pg = Image.open(f'{T}/page.png').convert('RGBA'); pg.putalpha(mk)
inner = Image.new('L', (W, H), 0); inner.paste(mk.filter(ImageFilter.GaussianBlur(26)), (0, 0))
shade = Image.new('RGBA', (W, H), (12, 6, 3, 0)); shade.putalpha(Image.eval(inner, lambda v: int(v * .75)))
base = Image.alpha_composite(shade, pg); base.save(f'{T}/frame.png')
if len(sys.argv) > 2 and sys.argv[2] == '--ov': sys.exit()

DUST = 'F3D9A4'
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], y=b[2] if len(b) > 2 else 50, mv=1 if k % 2 else -1, z=1.1))
tc = [piece(c[0], c[2], W, H, x=c[1], y=c[3] if len(c) > 3 else 50, mv=1 if k % 2 == 0 else -1, z=1.08) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[0]fade=in:st=0:d=0.25:color=0x{DUST}[z];[1]format=rgba[s];[z][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.1:d=0.4:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.3:d=0.55:alpha=1[h];[b][h]overlay=x=0:y='max(0,50-160*(t-0.3))'[c];"
      f"[4]format=rgba,fade=in:st=0.6:d=0.5:alpha=1[e];[c][e]overlay=x='max(0,70-220*(t-0.6))':y=0[d];"
      f"[5]format=rgba,fade=in:st=1.0:d=0.5:alpha=1[u];[d][u]overlay=x=0:y='max(0,30-90*(t-1.0))'[f];"
      f"[6]format=rgba,fade=in:st=1.35:d=0.5:alpha=1[r];[f][r]overlay=0:0,format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/tsub.png -loop 1 -i {T}/tfoot.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
for i, f in enumerate(P['films']):
    parts = [piece(it[0], it[1], AW, AH, x=it[2], y=it[3] if len(it) > 3 else 50, mv=1 if (i + k) % 2 else -1, z=1.1) for k, it in enumerate(f['cuts'])]
    sd = round(sum(it[1] for it in f['cuts']), 3)
    open(f'{T}/p{i}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}.txt -c copy {T}/pan{i}.mp4")
    fc = (f"color=c=0x1C0F08:s={W}x{H}:r={FPS}:d={sd}[bg];[bg][0]overlay={AX}:{AY}[a0];[1]format=rgba[fr];[a0][fr]overlay=0:0[a];"
          f"[2]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[a][k]overlay=0:0[b];"
          f"[3]format=rgba,fade=in:st=0.12:d=0.35:alpha=1[o];[b][o]overlay=x=0:y='70*pow(max(0,1-(t-0.12)/0.5),3)',"
          f"fade=in:st=0:d=0.14:color=0x{DUST},format=yuv420p")
    sh(f"ffmpeg -v error -y -i {T}/pan{i}.mp4 -loop 1 -i {T}/frame.png -loop 1 -i {T}/k{i}.png -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {sd} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
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
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25:color=0x{DUST},format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.04:contrast=1.05,colorbalance=rs=0.02:gs=0.0:bs=-0.02:rh=0.02:bh=-0.02,noise=alls=7:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
