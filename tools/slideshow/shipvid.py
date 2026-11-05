"""HIGH SEAS stills video. Usage: python3 shipvid.py WORKDIR [--ov]  (reads plan.json -> video.mp4)
7-flash burst -> sea-spray flash -> drifting title (Barlow kicker, coral Mrs Saint Delafield script, giant Pirata One HIGH SEAS,
compass rule, EB Garamond italic sub) -> per film full-bleed vertical jump cuts in a thin inset frame, navy wave band at the
bottom w/ compass + coral year|where, DM Serif title, Garamond italic line sliding in from the left -> phone end card."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#F2EEE4'); ACC = P.get('acc', '#EE5A43'); SH_C = P.get('shade', '7,20,32')
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
CSS = (ff('Ry', 'dm-serif-display', 400) + ff('Pi', 'pirata-one', 400) + ff('Md', 'mrs-saint-delafield', 400) + ff('Os', 'barlow-condensed', 500) +
       ff('Lb', 'eb-garamond', 400, 'italic') +
       f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center}}")
import math
def _pt(r,a): return f"{r*math.sin(a):.2f},{-r*math.cos(a):.2f}"
STAR = ("<svg width='54' height='54' viewBox='-27 -27 54 54'>"
        f"<circle r='17' fill='none' stroke='{INK}' stroke-width='1.4' opacity='.8'/>"
        + ''.join(f"<polygon points='{_pt(25 if k%2==0 else 15,k*math.pi/4)} {_pt(4,k*math.pi/4+math.pi/2)} 0,0 {_pt(4,k*math.pi/4-math.pi/2)}' fill='{ACC if k==0 else INK}' opacity='{1 if k%2==0 else .7}'/>" for k in range(8))
        + f"<circle r='2.6' fill='{ACC}'/></svg>")
def rope(wd=170, rev=False):
    g = 'linear-gradient(%s,transparent,%s)' % ('270deg' if rev else '90deg', INK)
    return (f"<div style='width:{wd}px;height:5px;position:relative'><div style='position:absolute;top:0;left:0;right:0;height:1.6px;background:{g}'></div>"
            f"<div style='position:absolute;top:3.4px;left:0;right:0;height:1.6px;background:{g};opacity:.55'></div></div>")
SH = f"text-shadow:0 3px 24px rgba({SH_C},.85),0 0 6px rgba({SH_C},.5)"
FRAME = f"<div style='position:absolute;left:30px;top:30px;right:30px;bottom:30px;border:2px solid {INK};opacity:.55;border-radius:6px'></div>"
ti = P['title']; top = ti.get('top', 190)
ov = {}
ov['tshade'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1200px;background:linear-gradient(180deg,rgba({SH_C},.86),rgba({SH_C},.62) 55%,rgba({SH_C},0))'></div>"
                f"<div style='position:absolute;bottom:0;left:0;width:100%;height:440px;background:linear-gradient(0deg,rgba({SH_C},.72),rgba({SH_C},0))'></div>{FRAME}")
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:500 31px Os;letter-spacing:.5em;padding-left:.5em;color:{INK}'>{ti['kick']}</div>"
ov['tscript'] = f"<div style='position:absolute;top:{top+46}px;width:100%;{SH};font:400 170px/1 Md;color:{ACC}'>{ti['script']}</div>"
ov['thero'] = (f"<div style='position:absolute;top:{top+190}px;width:100%;{SH};font:400 {ti.get('fs',196)}px/.92 Pi;letter-spacing:.02em;color:{INK}'>"
               + '<br>'.join(ti['hero']) + "</div>")
ov['tsub'] = (f"<div style='position:absolute;top:{top+620}px;width:100%;{SH}'>"
              f"<div style='display:flex;align-items:center;justify-content:center;gap:22px;margin-bottom:26px'>{rope(200)}{STAR}{rope(200, True)}</div>"
              f"<div style='font:400 italic 42px/1.34 Lb;color:{INK}'>{ti['sub']}</div></div>")
ov['tfoot'] = (f"<div style='position:absolute;top:{H-170}px;width:100%;{SH};display:flex;align-items:center;justify-content:center;gap:20px'>"
               f"{rope(90)}<div style='font:500 26px Os;letter-spacing:.5em;padding-left:.5em;color:{ACC}'>{ti['foot']}</div>{rope(90, True)}</div>")
WAVE = ("<svg style='position:absolute;left:0;top:1235px' width='1080' height='70' viewBox='0 0 1080 70'><path d='M0 40 "
        + ' '.join(f"Q {x+67.5} {14 if (x//135)%2==0 else 66} {x+135} 40" for x in range(0,1080,135))
        + f" V70 H0 Z' fill='rgba({SH_C},.9)'/><path d='M0 40 " + ' '.join(f"Q {x+67.5} {14 if (x//135)%2==0 else 66} {x+135} 40" for x in range(0,1080,135))
        + f"' fill='none' stroke='{INK}' stroke-opacity='.55' stroke-width='2'/></svg>")
ov['fshade'] = (f"<div style='position:absolute;bottom:0;left:0;width:100%;height:1000px;background:linear-gradient(0deg,rgba({SH_C},.5),rgba({SH_C},0))'></div>"
                f"{WAVE}<div style='position:absolute;top:1303px;left:0;width:100%;bottom:0;background:rgba({SH_C},.9)'></div>"
                f"<div style='position:absolute;top:0;left:0;width:100%;height:260px;background:linear-gradient(180deg,rgba({SH_C},.55),rgba({SH_C},0))'></div>{FRAME}")
for i, f in enumerate(P['films']):
    ov[f'f{i}'] = (f"<div style='position:absolute;top:96px;width:100%;{SH};font:500 27px Os;letter-spacing:.42em;padding-left:.42em;color:{INK}'>LOG Nº 0{i+1} &nbsp;·&nbsp; {f['place']}</div>"
                   f"<div style='position:absolute;top:1385px;left:80px;right:80px;text-align:left'>"
                   f"<div style='display:flex;align-items:center;gap:18px'>{STAR}<div style='font:500 25px Os;letter-spacing:.36em;color:{ACC}'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>"
                   f"<div style='font:400 {f.get('fs',92)}px/1.02 Ry;color:{INK};margin-top:22px'>{f['t']}</div>"
                   f"<div style='font:400 italic 40px/1.28 Lb;margin-top:20px;color:{INK};opacity:.92'>{f['line']}</div></div>")
pages = {k: f"<html><head><meta charset=utf-8><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
if len(sys.argv) > 2 and sys.argv[2] == '--ov': sys.exit()

DUST = 'E8F2F2'
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], y=b[2] if len(b) > 2 else 50, mv=1 if k % 2 else -1, z=1.1))
tc = [piece(c[0], c[2], W, H, x=c[1], y=c[3] if len(c) > 3 else 50, mv=1 if k % 2 == 0 else -1, z=1.08) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[0]fade=in:st=0:d=0.22:color=0x{DUST}[z];[1]format=rgba[s];[z][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.1:d=0.4:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.3:d=0.5:alpha=1[h];[b][h]overlay=x='max(0,60-200*(t-0.3))':y=0[c];"
      f"[4]format=rgba,fade=in:st=0.5:d=0.5:alpha=1[e];[c][e]overlay=x=0:y='max(0,60-170*(t-0.5))'[d];"
      f"[5]format=rgba,fade=in:st=0.95:d=0.5:alpha=1[u];[d][u]overlay=x=0:y='max(0,30-90*(t-0.95))'[f];"
      f"[6]format=rgba,fade=in:st=1.3:d=0.5:alpha=1[r];[f][r]overlay=0:0,format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tsub.png -loop 1 -i {T}/tfoot.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
for i, f in enumerate(P['films']):
    parts = [piece(it[0], it[1], W, H, x=it[2], y=it[3] if len(it) > 3 else 50, mv=1 if (i + k) % 2 else -1) for k, it in enumerate(f['cuts'])]
    sd = round(sum(it[1] for it in f['cuts']), 3)
    open(f'{T}/p{i}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}.txt -c copy {T}/pan{i}.mp4")
    fc = (f"[0]fade=in:st=0:d=0.16:color=0x{DUST}[z];[1]format=rgba[s];[z][s]overlay=0:0[a];"
          f"[2]format=rgba,fade=in:st=0.12:d=0.32:alpha=1[o];[a][o]overlay=x='-90*pow(max(0,1-(t-0.12)/0.45),3)':y=0,format=yuv420p")
    sh(f"ffmpeg -v error -y -i {T}/pan{i}.mp4 -loop 1 -i {T}/fshade.png -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {sd} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
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
fc += "[v]eq=saturation=1.05:contrast=1.05,colorbalance=rs=-0.01:gs=0.0:bs=0.02:rh=0.02:bh=-0.01,noise=alls=7:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
