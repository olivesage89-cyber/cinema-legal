"""HANGING SCROLL stills video. Usage: python3 wuxiavid.py WORKDIR [--ov]  (plan.json -> video.mp4)
7-flash burst -> full-screen jump-cut title (ink shade, Inter kicker, ivory Cormorant italic 'a martial arts', giant gold
Cinzel LEGEND, vermilion brush seal 武侠, Cormorant sub, gold foot) -> per film: ink-jade page with mist, Inter 'LEGEND 0X / 05',
ivory Cinzel title, 'year | where', ONE tall hanging scroll (gold-bordered panel between two lacquered rods) that UNROLLS
downward and jump-cuts through 4 stills (~0.8s each), vermilion seal with the film's Chinese numeral stamps onto the corner,
Cormorant italic line + DIR. -> phone end card on blurred still, no text."""
import json, os, subprocess, sys, random
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
IVORY = '#F3EAD7'; GOLD = '#D9B36C'; VERM = '#D2412C'; SH_C = '8,12,10'
PX, PY, PW, PH = 140, 400, 800, 1060
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.12):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.06 * mv)); b = max(0, min(1, x / 100 + 0.06 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset ultrafast -crf 14 {out}")
    return out
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = (ff('Ci', 'cinzel', 500) + ff('Ci', 'cinzel', 700) + ff('In', 'inter', 500) + ff('In', 'inter', 600) +
       ff('Co', 'cormorant-garamond', 400, 'italic') + ff('Co', 'cormorant-garamond', 500, 'italic') +
       f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{IVORY};text-align:center}}")
HEAD = f"<link rel=stylesheet href='file://{F}ma-shan-zheng/index.css'>"
TS = f"text-shadow:0 3px 26px rgba({SH_C},.95),0 0 10px rgba({SH_C},.8)"
def seal(txt, sz, rot=-4, vertical=False):
    inner = (f"<div style='writing-mode:vertical-rl;font:400 {int(sz*.42)}px/1 \"Ma Shan Zheng\";letter-spacing:-.02em'>{txt}</div>" if vertical
             else f"<div style='font:400 {int(sz*.7)}px/1 \"Ma Shan Zheng\"'>{txt}</div>")
    return (f"<div style='display:inline-flex;align-items:center;justify-content:center;width:{sz}px;height:{int(sz*(1.55 if vertical else 1))}px;"
            f"background:{VERM};color:#FBEFE2;border-radius:6px;transform:rotate({rot}deg);box-shadow:0 4px 18px rgba(0,0,0,.5),inset 0 0 0 4px rgba(251,239,226,.22);"
            f"filter:contrast(1.05)'>{inner}</div>")
ti = P['title']; top = ti.get('top', 330)
ov = {}
ov['tshade'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1400px;background:linear-gradient(180deg,rgba({SH_C},.86),rgba({SH_C},.62) 60%,rgba({SH_C},0))'></div>"
                f"<div style='position:absolute;bottom:0;left:0;width:100%;height:420px;background:linear-gradient(0deg,rgba({SH_C},.7),rgba({SH_C},0))'></div>")
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{TS};font:600 31px In;letter-spacing:.5em;padding-left:.5em'>{ti['kick']}</div>"
ov['tpre'] = f"<div style='position:absolute;top:{top+66}px;width:100%;{TS};font:italic 500 104px/1.1 Co;color:{IVORY}'>{ti['pre']}</div>"
ov['thero'] = (f"<div style='position:absolute;top:{top+196}px;width:100%;{TS};font:700 168px/1.1 Ci;letter-spacing:.06em;padding-left:.06em;"
               f"color:#E8C987;text-shadow:0 2px 0 #8A6428,0 6px 30px rgba({SH_C},.95),0 0 12px rgba({SH_C},.7);white-space:nowrap' class=fitw>{ti['hero']}</div>")
ov['tseal'] = f"<div style='position:absolute;top:{top-200}px;width:100%;text-align:center'>{seal('武侠', 96, 5, True)}</div>"
ov['tbar'] = f"<div style='position:absolute;top:{top+420}px;left:340px;width:400px;height:3px;background:linear-gradient(90deg,transparent,{GOLD},transparent)'></div>"
ov['tsub'] = f"<div style='position:absolute;top:{top+462}px;left:80px;right:80px;{TS};font:italic 400 60px/1.18 Co'>{ti['sub']}</div>"
ov['tfoot'] = f"<div style='position:absolute;top:{top+680}px;width:100%;{TS};font:600 25px In;letter-spacing:.34em;padding-left:.34em;color:{GOLD}'>{ti['foot']}</div>"
# ink-jade page with mist bands
random.seed(7)
g = Image.new('RGB', (W, H)); gd = ImageDraw.Draw(g)
for yy in range(H):
    t = yy / H; gd.line([(0, yy), (W, yy)], fill=(int(14 + 6 * t), int(24 - 6 * t), int(21 - 5 * t)))
mist = Image.new('L', (W, H), 0); md = ImageDraw.Draw(mist)
for k in range(9):
    cy = random.randint(200, H - 100); md.ellipse([random.randint(-400, 300), cy - 60, random.randint(700, 1500), cy + 60], fill=random.randint(30, 60))
mist = mist.filter(ImageFilter.GaussianBlur(70))
g = Image.composite(Image.new('RGB', (W, H), (70, 96, 84)), g, mist)
gl = Image.new('L', (W, H), 0); ImageDraw.Draw(gl).ellipse([90, 280, 990, 1560], fill=70); gl = gl.filter(ImageFilter.GaussianBlur(140))
g = Image.composite(Image.new('RGB', (W, H), (120, 98, 60)), g, gl)
g.save(f'{T}/page.png')
g.crop((PX - 30, PY + 10, PX + PW + 30, PY + PH + 60)).save(f'{T}/cover.png')
ROD = (f"<div style='position:absolute;left:{PX-44}px;width:{PW+88}px;height:24px;border-radius:12px;"
       f"background:linear-gradient(180deg,#6B2A1E,#3A150F 55%,#1E0907);box-shadow:0 6px 16px rgba(0,0,0,.6)'>"
       f"<div style='position:absolute;left:-14px;top:-6px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#F6E3B2,{GOLD} 50%,#7D5A22)'></div>"
       f"<div style='position:absolute;right:-14px;top:-6px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#F6E3B2,{GOLD} 50%,#7D5A22)'></div></div>")
ov['rod'] = f"<div style='position:absolute;top:0;left:0'>{ROD.replace('position:absolute;left', 'position:absolute;top:4px;left')}</div>"
NUM = '一二三四五'
for i, f in enumerate(P['films']):
    ov[f'k{i}'] = (f"<div style='position:absolute;top:66px;width:100%;font:600 25px In;letter-spacing:.32em;padding-left:.32em;color:{GOLD}'>"
                   f"LEGEND 0{i+1} / 05 &nbsp;·&nbsp; {f['tag']}</div>")
    ov[f'f{i}'] = (f"<div style='position:absolute;top:104px;height:170px;width:100%;display:flex;align-items:center;justify-content:center'>"
                   f"<div style='font:700 {f.get('fs',86)}px/1.08 Ci;letter-spacing:.03em;text-align:center;color:{IVORY};text-shadow:0 4px 20px rgba(0,0,0,.6)' class=fit>{f['t']}</div></div>"
                   f"<div style='position:absolute;top:290px;width:100%;font:600 26px In;letter-spacing:.3em;padding-left:.3em;color:{IVORY};opacity:.92'>{f['yr']} &nbsp;<span style='color:{VERM}'>|</span>&nbsp; {f['where'].upper()}</div>"
                   f"<div style='position:absolute;top:{PY-30}px;left:0'>{ROD}</div>")
    ov[f's{i}'] = f"<div style='position:absolute;top:{PY+PH-150}px;left:{PX+PW-62}px'>{seal(NUM[i], 112, -6)}</div>"
    ov[f'l{i}'] = (f"<div style='position:absolute;top:{PY+PH+70}px;left:50px;right:50px;font:italic 500 58px/1.12 Co;color:{IVORY}'>{f['line']}</div>"
                   f"<div style='position:absolute;top:{PY+PH+214}px;width:100%;font:600 22px In;letter-spacing:.3em;padding-left:.3em;color:{GOLD};opacity:.9'>DIR. {f['dir']}</div>")
pages = {k: f"<html><head><meta charset=utf-8>{HEAD}<style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.evaluate(()=>{for(const e of document.querySelectorAll('.fit')){let s=parseFloat(getComputedStyle(e).fontSize);while((e.scrollWidth>960||e.scrollHeight>170)&&s>40){s-=2;e.style.fontSize=s+'px'}}"
      "for(const e of document.querySelectorAll('.fitw')){let s=parseFloat(getComputedStyle(e).fontSize);e.style.display='inline-block';e.style.width='auto';while(e.scrollWidth>980&&s>60){s-=2;e.style.fontSize=s+'px'}e.style.display='block';e.style.width='100%%'}});"
      "await p.waitForTimeout(300);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
Image.open(f'{T}/rod.png').crop((0, 0, W, 40)).save(f'{T}/rodb.png')
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
      f"[2]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[a0][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.2:d=0.45:alpha=1[h];[b][h]overlay=x=0:y='max(0,40-120*(t-0.2))'[c];"
      f"[4]format=rgba,fade=in:st=0.45:d=0.35:alpha=1[e];[c][e]overlay=x=0:y='80*pow(max(0,1-(t-0.45)/0.45),3)'[d];"
      f"[5]format=rgba,fade=in:st=1.0:d=0.12:alpha=1[se];[d][se]overlay=x=0:y=0[d1];"
      f"[6]format=rgba,fade=in:st=0.85:d=0.3:alpha=1[br];[d1][br]overlay=x='-{W}*pow(max(0,1-(t-0.85)/0.45),3)':y=0[d2];"
      f"[7]format=rgba,fade=in:st=1.05:d=0.45:alpha=1[u];[d2][u]overlay=x=0:y='max(0,30-90*(t-1.05))'[f];"
      f"[8]format=rgba,fade=in:st=1.4:d=0.45:alpha=1[r];[f][r]overlay=0:0,format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tpre.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tseal.png -loop 1 -i {T}/tbar.png -loop 1 -i {T}/tsub.png -loop 1 -i {T}/tfoot.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SD = 3.3; CUTS = [(0, 0.85), (0.85, 1.65), (1.65, 2.5), (2.5, 3.3)]
UN = 0.55  # unroll time
for i, f in enumerate(P['films']):
    st = f['stills']
    parts = [piece(st[q][0], round(e - b, 3), PW, PH, x=st[q][1], y=st[q][2], mv=1 if (i + q) % 2 else -1, z=1.1) for q, (b, e) in enumerate(CUTS)]
    open(f'{T}/p{i}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}.txt -vf \"drawbox=x=0:y=0:w=iw:h=ih:color=0xD9B36C@0.95:t=4,drawbox=x=10:y=10:w=iw-20:h=ih-20:color=0xF3EAD7@0.35:t=1\" -c:v libx264 -preset ultrafast -crf 14 {T}/pan{i}.mp4")
    R = f"{PH}*(1-pow(max(0,1-t/{UN}),3))"
    fc = (f"[1]format=yuv420p[pg];[pg][0]overlay=x={PX}:y={PY}[a];"
          f"[2]format=rgba[cv];[a][cv]overlay=x={PX-30}:y='{PY+10}+{R}':enable='lt(t,{UN})'[a2];"
          f"[3]format=rgba[rb];[a2][rb]overlay=x=0:y='{PY-6}+{R}'[a3];"
          f"[4]format=rgba,fade=in:st=0.02:d=0.25:alpha=1[k];[a3][k]overlay=0:0[b];"
          f"[5]format=rgba,fade=in:st=0.1:d=0.35:alpha=1[o];[b][o]overlay=x=0:y='30*pow(max(0,1-(t-0.1)/0.45),3)'[c];"
          f"[6]format=rgba,fade=in:st=0.62:d=0.08:alpha=1,scale=w='iw':h='ih'[s];[c][s]overlay=0:0:enable='gte(t,0.62)'[c2];"
          f"[7]format=rgba,fade=in:st=0.55:d=0.4:alpha=1[l];[c2][l]overlay=x=0:y='30*pow(max(0,1-(t-0.55)/0.5),3)',"
          f"fade=in:st=0:d=0.12:color=0x{FL},format=yuv420p")
    sh(f"ffmpeg -v error -y -i {T}/pan{i}.mp4 -loop 1 -i {T}/page.png -loop 1 -i {T}/cover.png -loop 1 -i {T}/rodb.png -loop 1 -i {T}/k{i}.png -loop 1 -i {T}/f{i}.png -loop 1 -i {T}/s{i}.png -loop 1 -i {T}/l{i}.png "
       f"-filter_complex \"{fc}\" -t {SD} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(30))
bg = Image.blend(bg, Image.new('RGB', (W, H), (14, 20, 17)), 0.3)
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
fc += "[v]eq=saturation=1.06:contrast=1.04,colorbalance=rs=0.02:bs=-0.01:rh=0.03:gh=0.01:bh=-0.03,noise=alls=8:allf=t,vignette=PI/5,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -t {TEND+ED} -r {FPS} -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
