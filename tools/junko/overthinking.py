#!/usr/bin/env python3
"""Approved example #2 — overthinking at 2 AM (Junko format: HUD counters, thought bubbles, punchline card, verse).
usage: python3 overthinking.py <outdir> [check t1,t2,..]   -> <outdir>/a.mp4..d.mp4 + list.txt (silent). Copy this file for new videos."""
import sys, os, math, subprocess, numpy as np
OUT = sys.argv[1]
CHECK = sys.argv[2] if len(sys.argv) > 2 else None
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import lib as S
FD = S.FD
from PIL import Image, ImageDraw, ImageFont, ImageFilter
D, vgrad, ease, lerp, mix, SS = S.D, S.vgrad, S.ease, S.lerp, S.mix, S.SS
W, H, FPS = 1080, 1920, 30
PW, PH, PY = 1080, 1080, 470
MONT = lambda s: ImageFont.truetype(f'{FD}/montserrat-latin-700-normal.ttf', int(s))
PIX = lambda s: ImageFont.truetype(f'{FD}/pixelify-sans-latin-700-normal.ttf', int(s))
INTER = S.F

THOUGHTS = [(1.0, 'DID I SAY SOMETHING\nWEIRD TODAY?'), (4.0, 'WHAT IF THEY ALL\nSECRETLY HATE ME?'),
            (7.0, "WHAT IF GOD IS\nTIRED OF ME?"), (10.0, "WHAT IF IT'S ALWAYS\nGOING TO BE LIKE THIS?")]
BUZZ, PUNCH, VERSE, TOTAL = 13.0, 17.6, 21.8, 26.0

def room(t):
    calm = ease((t - BUZZ - 1.0) / 1.5)
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    FL = 780
    im.paste(vgrad(PW * SS, FL * SS, mix((52, 62, 98), (120, 92, 84), calm), mix((38, 46, 78), (92, 68, 62), calm)), (0, 0))
    im.paste(vgrad(PW * SS, (PH - FL) * SS, (30, 30, 42), (12, 12, 16)), (0, FL * SS))
    d.rect([0, FL - 6, PW, FL + 4], (28, 30, 46))
    S.window(d, 90, 170, 250, 290, (40, 48, 78), (14, 18, 40), (40, 50, 90), t, panel=im)
    # poster + shelf
    d.rect([720, 170, 850, 330], (30, 40, 80), r=6); d.poly([(785, 200), (805, 270), (765, 270)], (240, 240, 250)); d.cap(785, 290, 10, (255, 140, 60))
    d.rect([420, 300, 640, 314], (70, 56, 50))
    for i, (bw, bh, bc) in enumerate([(24, 70, (180, 70, 70)), (20, 60, (80, 130, 180)), (28, 76, (220, 180, 70)), (22, 64, (90, 150, 100))]):
        xx = 436 + i * 32; d.rect([xx, 300 - bh, xx + bw, 300], mix(bc, (40, 50, 80), 0.35), r=3)
    # bed (right)
    d.rect([600, 520, 640, 780], (60, 46, 40), r=8)
    d.rect([600, 600, 1080, 700], (232, 230, 226), r=14); d.rect([700, 590, 1080, 660], (40, 70, 150), r=20)
    d.rect([600, 700, 1080, 780], (70, 54, 46))
    # nightstand + lamp + phone
    d.rect([330, 580, 500, 780], (96, 70, 54), r=8); d.rect([345, 660, 485, 672], (70, 50, 40))
    lamp_on = calm
    d.rect([400, 470, 410, 580], (60, 50, 44)); d.poly([(360, 470), (450, 470), (430, 410), (380, 410)], mix((120, 110, 100), (255, 222, 160), lamp_on))
    buzz = t >= BUZZ and t < BUZZ + 1.2
    jit = math.sin(t * 90) * 3 if buzz else 0
    picked = t >= BUZZ + 1.0
    if not picked:
        d.rect([440 + jit, 566, 490 + jit, 580], (230, 240, 255) if t >= BUZZ else (40, 40, 50), r=4)
    # character on bed edge
    sad = t < BUZZ + 1.0
    hand = S.person(d, 700, 640, 200, None, 'sit', 'sad' if sad else 'smile', None, ('bob', None), t, 1,
                    'phone' if picked else 'lap', head_tilt=-0.15 * ease(t / 12) if sad else 0.0)
    if picked:
        d.rect([hand[0] - 26, hand[1] - 44, hand[0] + 26, hand[1] + 34], (230, 240, 255), r=8)
    # glow
    gl = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); g = ImageDraw.Draw(gl); k = SS / 4
    def G(x, y, r, c): g.ellipse([(x - r) * k, (y - r) * k, (x + r) * k, (y + r) * k], fill=c)
    if lamp_on > 0: G(405, 440, 260, tuple(int(v * lamp_on) for v in (200, 140, 60)))
    if t >= BUZZ:
        if picked: G(hand[0], hand[1], 80, (60, 90, 150))
        else: G(465, 573, 70, (80, 110, 180))
    gs = gl.filter(ImageFilter.GaussianBlur(12)).resize(im.size, Image.BILINEAR)
    a = np.clip(np.asarray(im, np.float32) + np.asarray(gs, np.float32) * 0.6, 0, 255).astype(np.uint8)
    out = Image.fromarray(a).resize((PW, PH), Image.LANCZOS)
    if t >= BUZZ:
        dd = D(Image.new('RGB', (1, 1)))  # notif needs a 2x canvas -> draw on a 2x copy
        big = out.resize((PW * SS, PH * SS)); db = D(big)
        kk = ease((t - BUZZ) / 0.4) * (1 - ease((t - BUZZ - 2.2) / 0.4))
        S.notif(db, big, 220, 60, kk, 'Grace', "you've been on my heart. praying for you")
        out = big.resize((PW, PH), Image.LANCZOS)
    return out

def bubble(im, cx, y, text, k, kind='think'):
    if k <= 0: return
    d = ImageDraw.Draw(im); f = MONT(44); lines = text.split('\n')
    tw = max(d.textlength(l, font=f) for l in lines); w, h = tw + 80, 60 * len(lines) + 50
    sc = 0.6 + 0.4 * ease(k / 0.6) + 0.06 * math.sin(min(k, 1) * math.pi)
    lay = Image.new('RGBA', (int(w + 20), int(h + 80)), (0, 0, 0, 0)); L = ImageDraw.Draw(lay)
    fill, ol = ((255, 255, 255), (232, 96, 120)) if kind == 'think' else ((247, 184, 58), (40, 30, 20))
    L.rounded_rectangle([6, 6, w + 6, h + 6], radius=34, fill=fill, outline=ol, width=6)
    for i, l in enumerate(lines):
        lw = L.textlength(l, font=f); L.text((6 + (w - lw) / 2, 30 + i * 60), l, font=f, fill=(24, 22, 26))
    if kind == 'think':
        for cx2, cy2, r in ((w * 0.62, h + 26, 13), (w * 0.68, h + 56, 8)): L.ellipse([cx2 - r, cy2 - r, cx2 + r, cy2 + r], fill=fill, outline=ol, width=4)
    lay = lay.resize((max(1, int(lay.width * sc)), max(1, int(lay.height * sc))), Image.LANCZOS)
    im.paste(lay, (int(cx - lay.width / 2), int(y)), lay)

def hud(im, t):
    d = ImageDraw.Draw(im)
    mins = int(lerp(72, 167, min(1, t / BUZZ))); clock = f'{mins // 60}:{mins % 60:02d} AM'
    n = sum(1 for tt, _ in THOUGHTS if t >= tt + 0.3)
    for cx, lab in ((290, 'TIME'), (790, 'WORST CASE SCENARIOS')):
        f = PIX(30); tw = d.textlength(lab, font=f); d.text((cx - tw / 2, 200), lab, font=f, fill=(150, 150, 160))
    f = MONT(80); tw = d.textlength(clock, font=f); d.text((290 - tw / 2, 245), clock, font=f, fill=(240, 80, 80) if t < BUZZ + 1 else (90, 220, 120))
    if t < BUZZ + 1.2: val, col = f'x{n}', (240, 80, 80)
    elif t < BUZZ + 2.4: val, col = '???', (247, 184, 58)
    else: val, col = 'x0', (90, 220, 120)
    pulse = 1 + 0.25 * max(0, 1 - min(abs(t - (tt + 0.3)) for tt, _ in THOUGHTS) / 0.25) if t < BUZZ else 1
    f = MONT(80 * pulse); tw = d.textlength(val, font=f); d.text((790 - tw / 2, 245 - (pulse - 1) * 40), val, font=f, fill=col)
    for i in range(5):
        x = 700 + i * 40; on = i < n and t < BUZZ + 2.4
        d.rounded_rectangle([x, 350, x + 28, 378], radius=5, fill=(200, 60, 70) if on else (50, 50, 60))
        if on: d.line([(x + 7, 357), (x + 21, 371)], fill=(255, 255, 255), width=3); d.line([(x + 21, 357), (x + 7, 371)], fill=(255, 255, 255), width=3)
    d.line([(540, 210), (540, 370)], fill=(60, 60, 70), width=3)

def frame(T):
    im = Image.new('RGB', (W, H), (10, 10, 14))
    sc = room(min(T, PUNCH))
    m = Image.new('L', (PW, PH)); ImageDraw.Draw(m).rectangle([0, 0, PW, PH], fill=255)
    fade = np.clip(np.linspace(5, 0, PH), 0, 1)[:, None] * np.ones((1, PW)); m = Image.fromarray((fade * 255).astype(np.uint8))
    im.paste(sc, (0, PY), m)
    # floor reflection (Junko look)
    ref = sc.transpose(Image.FLIP_TOP_BOTTOM).crop((0, 0, PW, 300)).filter(ImageFilter.GaussianBlur(3))
    rm = Image.fromarray((np.linspace(70, 0, 300)[:, None] * np.ones((1, PW))).astype(np.uint8))
    im.paste(ref, (0, PY + 780 + 4), rm)
    hud(im, T)
    for tt, txt in THOUGHTS:
        if tt <= T < tt + 3.0: bubble(im, 640, PY + 70, txt, T - tt)
    if BUZZ + 2.6 <= T < PUNCH: bubble(im, 860, PY + 150, '...OH.', T - BUZZ - 2.6)
    if T >= PUNCH:
        k = ease((T - PUNCH) / 0.5)
        im = Image.blend(im, Image.new('RGB', (W, H), (8, 8, 12)), 0.82 * k); d = ImageDraw.Draw(im)
        tv = T - PUNCH
        if T < VERSE:
            rows = [('MY BRAIN AT 2 AM?', (245, 245, 245), 0.2), ('PROSECUTOR.', (240, 80, 80), 0.7),
                    ('ONE TEXT FROM A FRIEND?', (245, 245, 245), 1.6), ('CASE CLOSED.', (247, 184, 58), 2.1)]
            for i, (txt, col, st) in enumerate(rows):
                a = ease((tv - st) / 0.3)
                if a <= 0: continue
                f = MONT(72); tw = d.textlength(txt, font=f)
                d.text(((W - tw) / 2, 800 + i * 100 + (i >= 2) * 60 + (1 - a) * 20), txt, font=f, fill=mix((8, 8, 12), col, a))
        else:
            a = ease((T - VERSE) / 0.8); fv = ImageFont.truetype(f'{FD}/lora-latin-500-italic.ttf', 54)
            for i, l in enumerate(['"casting all your worries on him,', 'because he cares for you."']):
                tw = d.textlength(l, font=fv); d.text(((W - tw) / 2, 860 + i * 76), l, font=fv, fill=mix((8, 8, 12), (235, 235, 235), a))
            r = '1 PETER 5:7'; fr = INTER('700', 34); tw = d.textlength(r, font=fr)
            d.text(((W - tw) / 2, 1040), r, font=fr, fill=mix((8, 8, 12), (247, 184, 58), ease((T - VERSE - 0.6) / 0.6)))
    return np.asarray(im)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if CHECK:
        for s in CHECK.split(','): Image.fromarray(frame(float(s))).save(f'{OUT}/check_{s}.jpg', quality=88)
        sys.exit()
    segs = [('a', 0, BUZZ), ('b', BUZZ, PUNCH), ('c', PUNCH, VERSE), ('d', VERSE, TOTAL)]; parts = []
    for name, a, b in segs:
        tmp = f'{OUT}/{name}.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for fi in range(int(round((b - a) * FPS))): p.stdin.write(frame(a + fi / FPS).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, f'{OUT}/{name}.mp4'); parts.append(f'{name}.mp4')
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{x}'\n" for x in parts)); print('parts', parts)
