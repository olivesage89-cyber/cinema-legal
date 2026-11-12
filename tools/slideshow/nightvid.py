"""ALL-NIGHTER (one-night movies) stills video. Usage: python3 nightvid.py WORKDIR (reads plan.json -> video.mp4)
Burst -> full-screen drifting title (midnight shade, Inter spaced kicker, magenta neon Neonderthaw 'one' that flickers
on, giant Monoton NIGHT with cyan tube glow, DM Serif italic sub, amber Share Tech Mono '9:00 PM -> 6:00 AM') ->
per film: on midnight-navy page, amber digital clock (blinking colon) ticking later each film, DM Serif title with
magenta neon glow, mono 'year | where', italic line, then THREE rounded panels with neon hairline borders sliding in
from alternating sides, each jump-cutting drifting stills (white flash) -> framed app phone end card, no text."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
MAG = '#FF4FA3'; CYAN = '#7FE9FF'; AMB = '#FFB54A'; CREAM = '#FBF1E4'; NAVY = '#070A16'
PX, PW, PH = 40, 1000, 414; PY = [410, 840, 1270]
def sh(c): subprocess.run(c, shell=True, check=True)
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Mo', 'monoton', 400) + ff('Nd', 'neonderthaw', 400) + ff('Ds', 'dm-serif-display', 400) + ff('Ds', 'dm-serif-display', 400, 'italic') + \
      ff('Tm', 'share-tech-mono', 400) + ff('In', 'inter', 600) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{CREAM};text-align:center}}"
SHD = "text-shadow:0 2px 26px rgba(0,0,0,.85)"
NEON = f"text-shadow:0 0 6px #fff,0 0 18px {MAG},0 0 42px {MAG},0 0 80px rgba(255,79,163,.6)"
ov = {}
ti = P['title']; top = ti.get('top', 200)
ov['tshade'] = f"<div style='position:absolute;top:0;left:0;width:100%;height:1350px;background:linear-gradient(180deg,rgba(5,7,20,.92),rgba(5,7,20,.66) 60%,rgba(5,7,20,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SHD};font:600 30px In;letter-spacing:.5em;padding-left:.5em'>{ti['kick']}</div>"
ov['tscript'] = (f"<div style='position:absolute;top:{top+40}px;width:100%'><div style='display:inline-block;transform:rotate(-7deg);"
                 f"font:400 250px/1 Nd;color:#FFE3F1;{NEON}'>{ti['script']}</div></div>")
ov['thero'] = (f"<div style='position:absolute;top:{top+300}px;width:100%;font:400 {ti.get('fs',196)}px/1 Mo;color:#EFFFFF;letter-spacing:.02em;"
               f"text-shadow:0 0 4px #fff,0 0 16px {CYAN},0 0 40px {CYAN},0 0 90px rgba(127,233,255,.55)'>{ti['hero']}</div>")
ov['tsub'] = (f"<div style='position:absolute;top:{top+540}px;width:100%;{SHD}'><div style='font:italic 400 58px/1.12 Ds'>{ti['sub']}</div>"
              f"<div style='font:400 32px Tm;letter-spacing:.3em;padding-left:.3em;margin-top:34px;color:{AMB};text-shadow:0 0 14px rgba(255,181,74,.6)'>{ti['tag']}</div></div>")
bgcss = f"background:radial-gradient(ellipse at 50% 18%,#1A1640 0,#0D0F26 40%,{NAVY} 75%)"
glow = f"0 0 0 2px {MAG},0 0 22px rgba(255,79,163,.55),0 0 50px rgba(255,79,163,.22)"
ov['page'] = (f"<div style='position:absolute;inset:0;{bgcss}'></div>"
)
ov['rims'] = "".join(f"<div style='position:absolute;left:{PX}px;top:{y}px;width:{PW-4}px;height:{PH-4}px;border-radius:30px;border:2px solid rgba(255,190,225,.85);box-shadow:{glow}'></div>" for y in PY)
for i, f in enumerate(P['films']):
    hh, mm, ap = f['clock']
    for on in (0, 1):
        col = ':' if on else '<span style="opacity:.15">:</span>'
        ov[f'c{i}{on}'] = (f"<div style='position:absolute;top:78px;width:100%;font:400 44px Tm;letter-spacing:.12em;color:{AMB};"
                           f"text-shadow:0 0 10px rgba(255,181,74,.9),0 0 30px rgba(255,140,40,.45)'>{hh}{col}{mm} <span style='font-size:30px'>{ap}</span>"
                           f"<span style='font-size:24px;letter-spacing:.3em;color:rgba(255,181,74,.7)'>&nbsp;&nbsp;·&nbsp;&nbsp;NO.0{i+1}</span></div>")
    ov[f't{i}'] = (f"<div style='position:absolute;top:140px;width:100%;height:130px;display:flex;align-items:center;justify-content:center'>"
                   f"<div style='font:400 {f.get('fs',84)}px/1 Ds;color:#FFF4FA;{NEON}'>{f['t']}</div></div>")
    ov[f'l{i}'] = (f"<div style='position:absolute;top:282px;width:100%'><div style='font:400 28px Tm;letter-spacing:.26em;padding-left:.26em;color:{CYAN};text-shadow:0 0 10px rgba(127,233,255,.5)'>"
                   f"{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div><div style='font:italic 400 40px/1.15 Ds;margin-top:14px;color:#EDE6F2;{SHD}'>{f['line']}</div></div>")
    ov[f'n{i}'] = f"<div style='position:absolute;top:1722px;width:100%;font:400 27px Tm;letter-spacing:.45em;padding-left:.45em;color:#FF7DBB;text-shadow:0 0 12px rgba(255,79,163,.7)'>— ONE NIGHT · 0{i+1} / 05 —</div>"
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
mk = Image.new('L', (PW, PH), 0); ImageDraw.Draw(mk).rounded_rectangle([0, 0, PW - 1, PH - 1], 30, fill=255); mk.save(f'{T}/mask.png')

n = [0]
def piece(img, dur, x=50, y=50, mv=1, amp=110, z=1.08, w=W, h=H, flash=False):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    im = Image.open(f'{D}/{img}'); s = max(h * z / im.height, w * 1.06 / im.width)
    W2 = int(im.width * s) // 2 * 2; H2 = int(im.height * s) // 2 * 2
    span = W2 - w; cx = span * x / 100; cy = (H2 - h) * y / 100
    a = max(0, min(span, cx - amp / 2 * mv)); b = max(0, min(span, cx + amp / 2 * mv))
    fl = ",fade=in:st=0:d=0.14:color=white" if flash else ""
    vf = f"scale={W2}:{H2}:flags=lanczos,crop={w}:{h}:'{a}+({b}-{a})*t/{dur}':{cy:.0f},fps={FPS},setsar=1{fl},format=yuv420p"
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), x=b[1], mv=1 if k % 2 else -1, amp=40, flash=(k % 2 == 0)))
tc = [piece(c[0], c[2], x=c[1], mv=1 if k % 2 == 0 else -1, amp=130, flash=(k == 0)) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
flick = "enable='gte(t,0.35)*not(between(t,0.48,0.55))*not(between(t,0.66,0.70))'"
flick2 = "enable='gte(t,0.6)*not(between(t,0.74,0.79))*not(between(t,0.9,0.93))'"
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba[r];[b][r]overlay=0:0:{flick}[c];"
      f"[4]format=rgba[h];[c][h]overlay=0:0:{flick2}[d];"
      f"[5]format=rgba,fade=in:st=1.05:d=0.45:alpha=1[u];[d][u]overlay=x=0:y='max(0,30-90*(t-1.05))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.4)
SPL = [[1.0, 1.1], [1.25, 1.0], [0.85, 1.2]]
ORDER = [[0, 3, 1], [1, 4, 2], [2, 0, 3]]
for i, f in enumerate(P['films']):
    imgs = f['imgs']; pv = []
    for p in range(3):
        d = SPL[p] + [round(SEG - sum(SPL[p]), 3)]
        cs = []
        for q in range(3):
            it = imgs[(p + 3 * q) % len(imgs)]
            cs.append(piece(it[0], d[q], x=it[1], y=it[2], mv=1 if (p + q + i) % 2 else -1, amp=70, w=PW, h=PH, flash=True))
        open(f'{T}/q{i}{p}.txt', 'w').write(''.join(f"file '{c}'\n" for c in cs))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/q{i}{p}.txt -c copy {T}/q{i}{p}.mp4"); pv.append(f'{T}/q{i}{p}.mp4')
    # inputs: 0-2 panels, 3 mask, 4 page, 5 rims, 6/7 clock off/on, 8 title, 9 line, 10 num
    fc = f"[3]format=gray,split=3[m0][m1][m2];[4]format=rgba[pg];color=c=0x070A16:s={W}x{H}:d={SEG}:r={FPS}[bg0];[bg0][pg]overlay=0:0[b0];"
    prev = 'b0'
    for p in range(3):
        st = 0.1 * p; sg = -1 if p % 2 == 0 else 1
        xo = f"{PX}+({sg})*1120*max(0,1-(t-{st})/0.34)*max(0,1-(t-{st})/0.34)"
        fc += (f"[{p}]setpts=PTS-STARTPTS,format=rgba[r{p}];[r{p}][m{p}]alphamerge[v{p}];"
               f"[{prev}][v{p}]overlay=x='{xo}':y={PY[p]}:enable='gte(t,{st})'[o{p}];"); prev = f'o{p}'
    fc += (f"[5]format=rgba,fade=in:st=0.45:d=0.2:alpha=1[rm];[{prev}][rm]overlay=0:0[m0x];"
           f"[6]format=rgba[cA];[7]format=rgba[cB];[m0x][cA]overlay=0:0[c1];[c1][cB]overlay=0:0:enable='lt(mod(t,1),0.5)'[c2];"
           f"[8]format=rgba[t];[c2][t]overlay=0:0:enable='gte(t,0.12)*not(between(t,0.24,0.29))'[l2];"
           f"[9]format=rgba,fade=in:st=0.35:d=0.35:alpha=1[l];[l2][l]overlay=x=0:y='max(0,22-80*(t-0.35))'[l3];"
           f"[10]format=rgba,fade=in:st=0.6:d=0.3:alpha=1[nn];[l3][nn]overlay=0:0,format=yuv420p")
    open(f'{T}/fc{i}.txt', 'w').write(fc)
    sh(f"ffmpeg -v error -y -i {pv[0]} -i {pv[1]} -i {pv[2]} -loop 1 -i {T}/mask.png -loop 1 -i {T}/page.png -loop 1 -i {T}/rims.png "
       f"-loop 1 -i {T}/c{i}0.png -loop 1 -i {T}/c{i}1.png -loop 1 -i {T}/t{i}.png -loop 1 -i {T}/l{i}.png -loop 1 -i {T}/n{i}.png "
       f"-filter_complex_script {T}/fc{i}.txt -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
# end card
bgi = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bgi.width, H / bgi.height)
bgi = bgi.resize((int(bgi.width * s) + 1, int(bgi.height * s) + 1), Image.LANCZOS)
bgi = bgi.crop(((bgi.width - W) // 2, (bgi.height - H) // 2, (bgi.width - W) // 2 + W, (bgi.height - H) // 2 + H))
bg = ImageEnhance.Brightness(bgi.filter(ImageFilter.GaussianBlur(38))).enhance(0.6)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
mk = Image.new('L', (W, H), 0)
ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=160)
mk = mk.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25,format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.06:contrast=1.05,colorbalance=rs=-0.01:bs=0.02:rh=0.015:bh=-0.005,noise=alls=7:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
