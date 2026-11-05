"""OLD WEST (frontier wood-type) stills video. Usage: python3 westvid.py WORKDIR (reads plan.json -> video.mp4)
Burst -> full-screen panning title (Oswald spaced kicker, Libre Baskerville italic 'the', turquoise Rye OLD WEST,
star rule, italic sub, tag) -> per film: FULL-BLEED vertical frames panning across the landscape, 4 jump cuts,
inside a thin cream poster border w/ corner stars; bottom: 'TRAIL 0N / 05' star kicker, cream Rye title,
italic line, star rule, turquoise 'year | where' -> phone end card on blurred sunset."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#6FD0C2'); CREAM = '#F3E6CC'; DUST = (26, 15, 9)
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, x=50, mv=1, amp=110, z=1.06):
    """full-bleed 1080x1920 crop of a wide still, panning amp px horizontally, slow push-in."""
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    im = Image.open(f'{D}/{img}'); s = H * z / im.height
    W2 = int(im.width * s) // 2 * 2; H2 = int(H * z) // 2 * 2
    span = W2 - W; cx = span * x / 100
    a = max(0, min(span, cx - amp / 2 * mv)); b = max(0, min(span, cx + amp / 2 * mv))
    vf = (f"scale={W2}:{H2}:flags=lanczos,crop={W}:{H}:'{a}+({b}-{a})*t/{dur}':'(ih-{H})/2',fps={FPS},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Ry', 'rye', 400) + ff('Os', 'oswald', 500) + ff('Os', 'oswald', 400) + ff('Lb', 'libre-baskerville', 400, 'italic') + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{CREAM};text-align:center}}"
SH = "text-shadow:0 2px 24px rgba(20,10,4,.95),0 0 8px rgba(20,10,4,.6)"
def rule(c, w=420): return (f"<div style='display:flex;align-items:center;justify-content:center;gap:16px;color:{c}'>"
                            f"<div style='width:{w//2}px;height:0;border-top:2px dashed {c};opacity:.8'></div>"
                            f"<div style='font:400 26px Ry'>★</div><div style='width:{w//2}px;height:0;border-top:2px dashed {c};opacity:.8'></div></div>")
BORDER = (f"<div style='position:absolute;left:34px;top:34px;width:{W-68-4}px;height:{H-68-4}px;border:2px solid rgba(243,230,204,.55);border-radius:10px'></div>"
          + ''.join(f"<div style='position:absolute;{v}:20px;{h}:20px;width:30px;height:30px;font:400 24px/30px Ry;color:{CREAM}'>★</div>"
                    for v in ('top', 'bottom') for h in ('left', 'right')))
ti = P['title']; top = ti.get('top', 200)
ov = {'border': BORDER}
ov['tshade'] = "<div style='position:absolute;top:0;left:0;width:100%;height:1200px;background:linear-gradient(180deg,rgba(24,13,7,.88),rgba(24,13,7,.55) 55%,rgba(24,13,7,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:500 30px Os;letter-spacing:.5em;padding-left:.5em'>{ti['kick']}</div>"
ov['tscript'] = f"<div style='position:absolute;top:{top+66}px;width:100%;{SH};font:400 italic 92px/1 Lb'>{ti['script']}</div>"
ov['thero'] = (f"<div style='position:absolute;top:{top+178}px;width:100%;font:400 158px/1 Ry;color:{INK};"
               f"text-shadow:0 0 30px rgba(111,208,194,.28),0 5px 26px rgba(20,10,4,.95)'>{ti['hero']}</div>")
ov['trule'] = f"<div style='position:absolute;top:{top+372}px;width:100%'>{rule(CREAM, 560)}</div>"
ov['tsub'] = (f"<div style='position:absolute;top:{top+430}px;width:100%;{SH}'>"
              f"<div style='font:400 italic 42px/1.45 Lb'>{ti['sub']}</div>"
              f"<div style='font:500 24px Os;letter-spacing:.44em;padding-left:.44em;margin-top:30px;color:{INK}'>{ti['tag']}</div></div>")
ov['fshade'] = "<div style='position:absolute;bottom:0;left:0;width:100%;height:960px;background:linear-gradient(0deg,rgba(24,13,7,.94),rgba(24,13,7,.78) 45%,rgba(24,13,7,0))'></div>"
BY = P.get('by', 1330)
for i, f in enumerate(P['films']):
    ov[f'k{i}'] = (f"<div style='position:absolute;top:{BY}px;width:100%;{SH};font:500 26px Os;letter-spacing:.5em;padding-left:.5em;color:{INK}'>"
                   f"★ &nbsp;TRAIL 0{i+1} / 05&nbsp; ★</div>")
    ov[f't{i}'] = (f"<div style='position:absolute;top:{BY+46}px;width:100%;height:220px;display:flex;align-items:center;justify-content:center'>"
                   f"<div style='font:400 {f.get('fs',90)}px/1.08 Ry;{SH};max-width:980px'>{f['t']}</div></div>")
    ov[f'l{i}'] = (f"<div style='position:absolute;top:{BY+282}px;width:100%;{SH}'>"
                   f"<div style='font:400 italic 33px/1.4 Lb;opacity:.95;padding:0 80px'>{f['line']}</div>"
                   f"<div style='margin-top:22px'>{rule(CREAM, 320)}</div>"
                   f"<div style='font:500 27px Os;letter-spacing:.3em;margin-top:18px;color:{INK};padding-left:.3em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), x=b[1], mv=1 if k % 2 else -1, amp=40))
tc = [piece(c[0], c[2], x=c[1], mv=1 if k % 2 == 0 else -1, amp=120) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.35:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.25:d=0.4:alpha=1[r];[b][r]overlay=x=0:y='max(0,40-110*(t-0.25))'[c];"
      f"[4]format=rgba,fade=in:st=0.45:d=0.45:alpha=1[h];[c][h]overlay=x='-220*pow(max(0,1-(t-0.45)/0.55),2)':y=0[d];"
      f"[5]format=rgba,fade=in:st=0.9:d=0.4:alpha=1[l];[d][l]overlay=0:0[e];"
      f"[6]format=rgba,fade=in:st=1.15:d=0.5:alpha=1[u];[e][u]overlay=x=0:y='max(0,30-90*(t-1.15))'[f];"
      f"[7]format=rgba[bd];[f][bd]overlay=0:0,format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/trule.png -loop 1 -i {T}/tsub.png -loop 1 -i {T}/border.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.6); NC = 4; C = round(SEG / NC, 3)
for i, f in enumerate(P['films']):
    imgs = f['imgs']
    parts = [piece(imgs[ph][0], C, x=imgs[ph][1], mv=1 if (ph + i) % 2 else -1) for ph in range(NC)]
    open(f'{T}/p{i}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}.txt -c copy {T}/p{i}.mp4")
    fc = (f"[1]format=rgba[sd];[0][sd]overlay=0:0[l0];[2]format=rgba[bd];[l0][bd]overlay=0:0[l1];"
          f"[3]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[l1][k]overlay=x=0:y='max(0,20-80*t)'[l2];"
          f"[4]format=rgba,fade=in:st=0.15:d=0.35:alpha=1[t];[l2][t]overlay=x='-160*pow(max(0,1-(t-0.15)/0.45),2)':y=0[l3];"
          f"[5]format=rgba,fade=in:st=0.45:d=0.35:alpha=1[l];[l3][l]overlay=x=0:y='max(0,24-80*(t-0.45))',format=yuv420p")
    sh(f"ffmpeg -v error -y -i {T}/p{i}.mp4 -loop 1 -i {T}/fshade.png -loop 1 -i {T}/border.png -loop 1 -i {T}/k{i}.png -loop 1 -i {T}/t{i}.png -loop 1 -i {T}/l{i}.png -filter_complex \"{fc}\" -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), DUST), 0.35)
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
fc += "[v]eq=saturation=1.02:contrast=1.04,colorbalance=rs=0.02:gs=0.005:bs=-0.025:rm=0.015:bm=-0.02,noise=alls=6:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
