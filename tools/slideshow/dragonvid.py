"""HERE BE DRAGONS stills video. Usage: python3 dragonvid.py WORKDIR [--ov]  (reads plan.json -> video.mp4)
7-flash burst -> full-screen jump-cut title w/ charred shade + double gold inset border w/ diamond studs,
Tenor Sans spaced kicker, ember Fondamento italic 'here be', giant gold Almendra SC DRAGONS, Fondamento italic sub
-> per film: 3 full-width panels stacked EDGE TO EDGE under a charcoal header band (kicker, Almendra SC title,
ember 'year | where'), panels wipe in staggered and jump-cut out of sync; italic line at the foot;
rising embers over everything -> phone end card on blurred still, no text."""
import json, os, subprocess, sys, random
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = '#F4E7CF'; GOLD = '#E9B65A'; EMB = '#FF7A2E'; SH_C = '14,9,6'; BG = '0E0906'
PH = 480; PY = [372, 372 + PH, 372 + 2 * PH]
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
CSS = (ff('Al', 'almendra-sc', 400) + ff('Ad', 'almendra-display', 400) + ff('Fo', 'fondamento', 400, 'italic') + ff('Fo', 'fondamento', 400) +
       ff('Te', 'tenor-sans', 400) +
       f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center}}")
SH = f"text-shadow:0 3px 26px rgba({SH_C},.95),0 0 12px rgba({SH_C},.8)"
GOLDTXT = (f"background:linear-gradient(180deg,#FFE7A8 0%,{GOLD} 45%,#B9772C 100%);-webkit-background-clip:text;background-clip:text;color:transparent;"
           f"filter:drop-shadow(0 4px 18px rgba({SH_C},.95)) drop-shadow(0 0 30px rgba(255,122,46,.35))")
def stud(x, y, s=9): return f"<div style='position:absolute;left:{x-s}px;top:{y-s}px;width:{2*s}px;height:{2*s}px;background:{GOLD};transform:rotate(45deg)'></div>"

ti = P['title']; top = ti.get('top', 250)
ov = {}
ov['tshade'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1250px;background:linear-gradient(180deg,rgba({SH_C},.88),rgba({SH_C},.55) 55%,rgba({SH_C},0))'></div>"
                f"<div style='position:absolute;bottom:0;left:0;width:100%;height:560px;background:linear-gradient(0deg,rgba({SH_C},.85),rgba({SH_C},0))'></div>"
                f"<div style='position:absolute;left:40px;top:40px;right:40px;bottom:40px;border:2px solid rgba(233,182,90,.75)'></div>"
                f"<div style='position:absolute;left:54px;top:54px;right:54px;bottom:54px;border:1px solid rgba(233,182,90,.4)'></div>"
                + stud(41, 41) + stud(W - 41, 41) + stud(41, H - 41) + stud(W - 41, H - 41) + stud(W // 2, 41, 7) + stud(W // 2, H - 41, 7))
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:400 36px Te;letter-spacing:.42em;padding-left:.42em;color:{INK}'>{ti['kick']}</div>"
ov['tscript'] = f"<div style='position:absolute;top:{top+62}px;width:100%;{SH};font:italic 400 {ti.get('fs2',120)}px/1.2 Fo;color:{EMB}'>{ti['script']}</div>"
ov['thero'] = f"<div style='position:absolute;top:{top+200}px;width:100%;font:400 {ti.get('fs',200)}px/1 Al;letter-spacing:.02em;{GOLDTXT}'>{ti['hero']}</div>"
ov['tsub'] = (f"<div style='position:absolute;top:{top+440}px;left:60px;right:60px;{SH};font:italic 400 50px/1.2 Fo;color:{INK}'>{ti['sub']}</div>")
ov['tfoot'] = (f"<div style='position:absolute;top:{top+600}px;width:100%;{SH};font:400 30px Te;letter-spacing:.5em;padding-left:.5em;color:{GOLD}'>◆ &nbsp;{ti['foot']}&nbsp; ◆</div>")
# header band + foot band + hairlines between the edge-to-edge panels
ov['page'] = (f"<div style='position:absolute;left:0;top:0;width:100%;height:{PY[0]}px;background:radial-gradient(ellipse 70% 120% at 50% 0%,#2A170C,#120B07 70%)'></div>"
              f"<div style='position:absolute;left:0;top:{PY[2]+PH}px;width:100%;height:{H-PY[2]-PH}px;background:radial-gradient(ellipse 70% 140% at 50% 100%,#2A170C,#120B07 70%)'></div>"
              + ''.join(f"<div style='position:absolute;left:0;top:{y-1}px;width:100%;height:3px;background:linear-gradient(90deg,rgba(233,182,90,0),{GOLD} 20%,{GOLD} 80%,rgba(233,182,90,0))'></div>" for y in (PY[0], PY[1], PY[2], PY[2] + PH))
              + stud(W // 2, PY[0], 8) + stud(W // 2, PY[2] + PH, 8))
for i, f in enumerate(P['films']):
    ov[f'k{i}'] = f"<div style='position:absolute;top:62px;width:100%;font:400 28px Te;letter-spacing:.4em;padding-left:.4em;color:{GOLD}'>Nº 0{i+1} / 05 &nbsp;·&nbsp; {f['place']}</div>"
    ov[f'f{i}'] = (f"<div style='position:absolute;top:112px;width:100%'>"
                   f"<div style='font:400 {f.get('fs',86)}px/1.1 Al;white-space:nowrap;{GOLDTXT}'>{f['t']}</div>"
                   f"<div style='font:400 31px Te;letter-spacing:.3em;padding-left:.3em;color:{EMB};margin-top:14px'>{f['yr']} &nbsp;|&nbsp; {f['where']}</div></div>"
                   f"<div style='position:absolute;top:{PY[2]+PH+22}px;width:100%;font:italic 400 44px/1.15 Fo;color:{INK}'>{f['line']}</div>")
# rising embers sheet (tileable, 2 x H)
emb = ''
rnd = random.Random(5)
for k in range(46):
    x, y = rnd.uniform(0, W), rnd.uniform(0, H); r = rnd.uniform(1.6, 4.6)
    col = rnd.choice(['#FF8A3D', '#FFB255', '#FF6A1F', '#FFD68A']); op = rnd.uniform(.55, .95)
    for dy in (0, H):
        emb += f"<circle cx='{x:.0f}' cy='{y+dy:.0f}' r='{r:.1f}' fill='{col}' fill-opacity='{op:.2f}'/>"
ov['embers'] = (f"<svg style='position:absolute;left:0;top:0' width='{W}' height='{2*H}'><defs><filter id='b' x='-50%' y='-50%' width='200%' height='200%'>"
                f"<feGaussianBlur stdDeviation='2.2' result='g'/><feMerge><feMergeNode in='g'/><feMergeNode in='g'/><feMergeNode in='SourceGraphic'/></feMerge></filter></defs><g filter='url(#b)'>{emb}</g></svg>")
pages = {k: f"<html><head><meta charset=utf-8><style>{CSS}{'body{height:%dpx}' % (2*H) if k=='embers' else ''}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){await p.setViewportSize({width:%d,height:k=='embers'?%d:%d});fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), W, 2 * H, H, T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
if len(sys.argv) > 2 and sys.argv[2] == '--ov': sys.exit()

FL = 'FFE2B8'
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], y=b[2] if len(b) > 2 else 50, mv=1 if k % 2 else -1, z=1.1))
tc = [piece(c[0], c[2], W, H, x=c[1], y=c[3] if len(c) > 3 else 50, mv=1 if k % 2 == 0 else -1, z=1.08) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[0]fade=in:st=0:d=0.25:color=0x{FL}[z];[1]format=rgba[s];[z][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.1:d=0.35:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.3:d=0.5:alpha=1[h];[b][h]overlay=x='-max(0,60-200*(t-0.3))':y=0[c];"
      f"[4]format=rgba,fade=in:st=0.5:d=0.5:alpha=1[e];[c][e]overlay=x=0:y='max(0,70-220*(t-0.5))'[d];"
      f"[5]format=rgba,fade=in:st=0.95:d=0.5:alpha=1[u];[d][u]overlay=x=0:y='max(0,30-90*(t-0.95))'[f];"
      f"[6]format=rgba,fade=in:st=1.3:d=0.5:alpha=1[r];[f][r]overlay=0:0,format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tsub.png -loop 1 -i {T}/tfoot.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SCHED = [[(0, 0, 1.0), (3, 1.0, 2.0), (1, 2.0, 3.0)], [(1, 0, 1.4), (4, 1.4, 3.0)], [(2, 0, 0.7), (0, 0.7, 1.8), (3, 1.8, 3.0)]]
SD = 3.0
for i, f in enumerate(P['films']):
    st = f['stills']  # 5 items [file, x, y]
    pans = []
    for j, sch in enumerate(SCHED):
        parts = [piece(st[s][0], round(e - b, 3), W, PH, x=st[s][1], y=st[s][2], mv=1 if (i + j + q) % 2 else -1, z=1.12) for q, (s, b, e) in enumerate(sch)]
        open(f'{T}/p{i}_{j}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}_{j}.txt -c copy {T}/pan{i}_{j}.mp4"); pans.append(f'{T}/pan{i}_{j}.mp4')
    dl = [0.0, 0.12, 0.24]
    fc = f"color=c=0x{BG}:s={W}x{H}:r={FPS}:d={SD}[bg];"
    cur = 'bg'
    for j in range(3):
        sgn = -1 if j % 2 == 0 else 1
        fc += (f"[{j}]setpts=PTS+{dl[j]}/TB[q{j}];[{cur}][q{j}]overlay=x='{sgn}*{W}*pow(max(0,1-(t-{dl[j]})/0.4),3)':y={PY[j]}:enable='gte(t,{dl[j]})':eof_action=repeat[m{j}];")
        cur = f'm{j}'
    fc += (f"[3]format=rgba[fr];[{cur}][fr]overlay=0:0[a];"
           f"[4]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[a][k]overlay=0:0[b];"
           f"[5]format=rgba,fade=in:st=0.15:d=0.4:alpha=1[o];[b][o]overlay=x=0:y='40*pow(max(0,1-(t-0.15)/0.5),3)',"
           f"fade=in:st=0:d=0.14:color=0x{FL},format=yuv420p")
    sh(f"ffmpeg -v error -y -i {pans[0]} -i {pans[1]} -i {pans[2]} -loop 1 -i {T}/page.png -loop 1 -i {T}/k{i}.png -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {SD} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(30))
bg = Image.blend(bg, Image.new('RGB', (W, H), tuple(int(c) for c in SH_C.split(','))), 0.35)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
mk = Image.new('L', (W, H), 0)
ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
mk = mk.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25:color=0x{FL},format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
B0 = len(P['burst']) * P.get('flash', 0.2)
TEND = round(B0 + tdur + SD * len(P['films']), 3)
inp = ' '.join(f'-i {s}' for s in segs) + f' -loop 1 -i {T}/embers.png'
NP = len(segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(NP)) + ''.join(f'[s{k}]' for k in range(NP)) + f"concat=n={NP}:v=1:a=0[v];"
fc += (f"[{NP}]format=rgba[pt];[v][pt]overlay=x='14*sin(t*1.3)':y='-mod(t*120,{H})':enable='between(t,{B0},{TEND})':shortest=0[vp];"
       "[vp]eq=saturation=1.06:contrast=1.05,colorbalance=rs=0.03:gs=0.0:bs=-0.03:rh=0.03:bh=-0.03,noise=alls=8:allf=t,vignette=PI/5,format=yuv420p[out]")
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -t {TEND+ED} -r {FPS} -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
