#!/usr/bin/env python3
"""Small group potluck chaos (Junko format): dining room at dusk, every friend walks in with... chips. BAGS OF CHIPS x1 -> x5,
MAIN DISHES x0. Everyone droops, then everyone laughs -> chip dinner under string lights (FRIENDS AT THE TABLE 5 + TIMES WE
LAUGHED), punchline card, verse (Proverbs 15:17). app: none.
usage: python3 potluck-chips.py <outdir> [check t1,t2,..]   -> <outdir>/a.mp4..e.mp4 + list.txt (silent)."""
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
FL = 780
WALK = 1.1
# seat x, shirt, hair, bag colour, arrival time, line
PEOPLE = [(250, None, 'long', (220, 70, 60), None, None),
          (395, (90, 160, 110), 'bun', (247, 184, 58), 2.6, 'I BROUGHT\nCHIPS!'),
          (540, (200, 80, 80), 'bob', (80, 130, 220), 5.2, 'SAME.\nCHIPS.'),
          (685, (230, 190, 70), 'long', (235, 120, 40), 7.8, 'SALSA!\n...AND CHIPS.'),
          (830, (140, 104, 186), 'bun', (110, 180, 90), 10.4, 'WAIT. WHO BROUGHT\nTHE ACTUAL FOOD?')]
DROOP, LAUGH, SCENE2, PUNCH, VERSE, TOTAL = 12.0, 13.6, 15.6, 22.4, 26.4, 30.2
P2 = [(16.2, 2, 'BEST POTLUCK\nWE\'VE EVER HAD.'), (17.9, 1, 'SAME TIME\nNEXT WEEK?'), (19.6, 0, 'I\'M BRINGING\nCHIPS.'),
      (21.0, 4, 'NOOO.')]

def glow_finish(im, glow, amt=0.6):
    gs = glow.filter(ImageFilter.GaussianBlur(12)).resize(im.size, Image.BILINEAR)
    return Image.fromarray(np.clip(np.asarray(im, np.float32) + np.asarray(gs, np.float32) * amt, 0, 255).astype(np.uint8))

def seated(i, t): return i == 0 or t >= PEOPLE[i][4] + WALK
def nbags(t): return sum(1 for i in range(5) if seated(i, t))

def bag(d, x, y, col, sc=1.0):
    w, h = 46 * sc, 58 * sc
    d.poly([(x - w / 2, y), (x - w / 2 + 5 * sc, y - h), (x + w / 2 - 5 * sc, y - h), (x + w / 2, y)], col)
    for k in range(5): d.poly([(x - w / 2 + 5 * sc + k * (w - 10 * sc) / 5, y - h), (x - w / 2 + 5 * sc + (k + 0.5) * (w - 10 * sc) / 5, y - h - 7 * sc),
                              (x - w / 2 + 5 * sc + (k + 1) * (w - 10 * sc) / 5, y - h)], col)
    d.ell([x - 13 * sc, y - h * 0.62, x + 13 * sc, y - h * 0.3], (255, 244, 200))
    d.rect([x - w / 2 + 2, y - h * 0.18, x + w / 2 - 2, y - h * 0.1], mix(col, (0, 0, 0), 0.25))

def room(t):
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); k4 = SS / 4
    gd = ImageDraw.Draw(glow)
    class GL:
        def cap(s, x, y, r, c): gd.ellipse([(x - r) * k4, (y - r) * k4, (x + r) * k4, (y + r) * k4], fill=c)
    two = t >= SCENE2
    dusk = ease(t / 12) if not two else 1.0
    wall1 = mix((206, 172, 150), (150, 120, 120), dusk); wall2 = mix((186, 150, 134), (126, 100, 104), dusk)
    if two: wall1, wall2 = (176, 120, 96), (140, 90, 76)
    im.paste(vgrad(PW * SS, FL * SS, wall1, wall2), (0, 0))
    im.paste(vgrad(PW * SS, (PH - FL) * SS, (120, 84, 62), (80, 54, 40)), (0, FL * SS))
    for k in range(8): d.line([(k * 150 - 40, FL + 4), (k * 150 - 120, PH)], (100, 70, 52), 3)
    d.rect([0, FL - 8, PW, FL + 4], mix(wall2, (60, 40, 30), 0.5))
    # wainscot stripe
    d.rect([0, 560, PW, 572], mix(wall1, (255, 255, 255), 0.18))
    # window (dusk -> night)
    S.window(d, 60, 120, 240, 280, (110, 80, 66), mix((250, 190, 150), (40, 44, 90), dusk), mix((255, 150, 120), (90, 70, 120), dusk), t,
             night=dusk > 0.7, panel=im)
    S.frames_on_wall(d, [(360, 150, 110, 140, (110, 80, 66), (150, 180, 170)), (490, 190, 90, 90, (110, 80, 66), (220, 170, 120)),
                         (600, 160, 120, 100, (110, 80, 66), (170, 150, 200))])
    # door (right) — swings dark while someone is coming in
    op = 0
    for (_, _, _, _, ta, _) in PEOPLE[1:]:
        if ta and ta - 0.4 <= t < ta + WALK + 0.3: op = max(op, min(1, (t - ta + 0.4) / 0.3, (ta + WALK + 0.3 - t) / 0.3))
    d.rect([930, 300, 1070, FL], (110, 80, 66), r=6); d.rect([942, 312, 1058, FL], (60, 44, 40))
    d.rect([942 + 100 * op, 312, 1058, FL], (150, 110, 84)) if op < 0.98 else None
    if op < 0.6: d.cap(960 + 100 * op + 12, 560, 7, (230, 200, 120))
    # string lights (scene 2)
    if two: S.string_lights(d, GL(), 0, PW, 50, t, True); S.string_lights(d, GL(), 300, PW, 90, t + 1, True)
    # pendant lamp
    d.line([(540, 0), (540, 150)], (60, 50, 50), 4)
    d.poly([(480, 210), (500, 150), (580, 150), (600, 210)], (60, 70, 70)); d.ell([520, 200, 560, 222], (255, 236, 190))
    GL().cap(540, 230, 160 if two else 120, (120, 96, 60) if two else (90, 76, 50))
    # chair backs
    for (sx, *_rest) in PEOPLE:
        d.rect([sx - 52, 470, sx + 52, 640], (120, 76, 50), r=14); d.rect([sx - 40, 484, sx + 40, 520], (140, 92, 62), r=8)
    # people
    for i, (sx, shirt, hair, col, ta, _) in enumerate(PEOPLE):
        sd = 11 + i * 3
        if not seated(i, t):
            if ta is None or t < ta: continue
            k = ease((t - ta) / WALK); x = lerp(1060, sx, k)
            S.person(d, x, FL + 6, 150, shirt, 'walk', 'smile', None, (hair, None), t, sd, 'lap')
            bag(d, x - 34, FL + 6 - 150 * 1.1, col, 0.9)
            continue
        if not two:
            if t >= LAUGH: mood, tilt = 'laugh', 0.12 * math.sin(t * 16 + i * 1.7)
            elif t >= DROOP: mood, tilt = 'flat', 0.06 * (i - 2)
            else: mood, tilt = 'smile', (-0.08 if i == 0 else 0.0)
            S.person(d, sx, 684, 150, shirt, 'sit', mood, None, (hair, None), t, sd, 'lap', head_tilt=tilt)
        else:
            tt = t - SCENE2
            laughing = ((tt + i * 0.9) % 2.4) < 1.0 or t >= 21.0
            eat = ((tt + i * 1.3) % 3.0) < 1.2 and not laughing
            hd = S.person(d, sx, 684, 150, shirt, 'sit', 'laugh' if laughing else 'smile', None, (hair, None), t, sd,
                          'phone' if eat else 'lap', head_tilt=0.12 * math.sin(t * 15 + i) if laughing else 0.0)
            if hd: d.poly([(hd[0] - 12, hd[1] - 4), (hd[0] + 12, hd[1] - 10), (hd[0] + 2, hd[1] + 12)], (240, 196, 100))
    # table + cloth
    d.rect([150, 628, 930, 648], (244, 238, 226), r=8)
    d.rect([160, 640, 920, 792], (236, 228, 214)); d.rect([160, 770, 920, 792], (210, 90, 80))
    for k in range(12): d.line([(190 + k * 65, 652), (190 + k * 65, 768)], (226, 216, 200), 3)
    # stuff on the table
    if not two:
        for i, (sx, *_r) in enumerate(PEOPLE):
            if seated(i, t):
                pk = ease((t - (PEOPLE[i][4] or -9) - WALK) / 0.25)
                bag(d, sx + 30, 636, PEOPLE[i][3], 0.6 + 0.4 * pk)
        if seated(3, t): d.rect([725, 604, 755, 636], (200, 60, 50), r=5); d.rect([723, 598, 757, 608], (240, 240, 240), r=3)
        d.ell([470, 616, 610, 640], (255, 255, 255)); d.ell([490, 620, 590, 634], (236, 236, 236))  # the empty serving plate
    else:
        d.ell([400, 590, 680, 640], (240, 236, 226)); d.chord([400, 560, 680, 640], 0, 180, (200, 120, 80))
        for k in range(18):
            cx = 430 + (k * 37) % 220; cy = 600 + (k * 13) % 22
            d.poly([(cx, cy), (cx + 22, cy - 6), (cx + 8, cy - 22)], (244, 198, 96) if k % 3 else (230, 170, 70))
        for i, x0 in enumerate((210, 760, 850)): bag(d, x0, 636, PEOPLE[i + 2][3], 0.7)
        d.rect([300, 604, 330, 636], (200, 60, 50), r=5)
        for x0 in (240, 380, 690, 820): d.rect([x0, 602, x0 + 26, 636], (250, 250, 255), r=6); d.rect([x0 + 3, 612, x0 + 23, 634], (240, 150, 90), r=4)
    return glow_finish(im, glow, 0.55 if two else 0.4).resize((PW, PH), Image.LANCZOS)

def bubble(im, cx, y, text, k, kind='think', target=None):
    if k <= 0: return
    d = ImageDraw.Draw(im); f = MONT(44); lines = text.split('\n')
    tw = max(d.textlength(l, font=f) for l in lines); w, h = tw + 76, 58 * len(lines) + 48
    cx = min(max(cx, w / 2 + 30), W - w / 2 - 30)
    tail = 0.5 if target is None else min(0.85, max(0.15, (target - (cx - w / 2)) / w))
    sc = 0.6 + 0.4 * ease(k / 0.6) + 0.06 * math.sin(min(k, 1) * math.pi)
    lay = Image.new('RGBA', (int(w + 20), int(h + 80)), (0, 0, 0, 0)); L = ImageDraw.Draw(lay)
    if kind == 'think': fill, ol = (255, 255, 255), (232, 96, 120)
    else: fill, ol = (247, 184, 58), (40, 30, 20)
    L.rounded_rectangle([6, 6, w + 6, h + 6], radius=34, fill=fill, outline=ol, width=6)
    for i, l in enumerate(lines):
        lw = L.textlength(l, font=f); L.text((6 + (w - lw) / 2, 30 + i * 58), l, font=f, fill=(24, 22, 26))
    if kind == 'think':
        for cx2, cy2, r in ((w * tail, h + 26, 13), (w * tail - w * 0.03, h + 56, 8)): L.ellipse([cx2 - r, cy2 - r, cx2 + r, cy2 + r], fill=fill, outline=ol, width=4)
    else:
        tx = w * tail; L.polygon([(tx - 18, h + 2), (tx + 18, h + 2), (tx - 4, h + 44)], fill=fill)
        L.line([(tx - 18, h + 6), (tx - 4, h + 44), (tx + 18, h + 6)], fill=ol, width=6)
    lay = lay.resize((max(1, int(lay.width * sc)), max(1, int(lay.height * sc))), Image.LANCZOS)
    im.paste(lay, (int(cx - lay.width / 2), int(y + (1 - sc) * h)), lay)

def laughs(t):
    if t < SCENE2 + 0.4: return 0
    return int(lerp(0, 23, ease((t - SCENE2 - 0.4) / (PUNCH - SCENE2 - 0.8))) ** 1)

def hud(im, t):
    d = ImageDraw.Draw(im)
    def pulse(ts):
        m = min([abs(t - x) for x in ts] + [9]); return 1 + 0.25 * max(0, 1 - m / 0.25)
    if t < SCENE2:
        n = nbags(t)
        L = ('BAGS OF CHIPS', f'x{n}', (247, 184, 58), pulse([p[4] + WALK for p in PEOPLE[1:]]))
        R = ('MAIN DISHES', 'x0', (240, 80, 80), pulse([p[4] + WALK + 0.15 for p in PEOPLE[1:]] + [DROOP]))
        lsq = [(247, 184, 58) if i < n else (50, 50, 60) for i in range(5)]; rsq = [(50, 50, 60)] * 5
    else:
        lg = laughs(t)
        L = ('FRIENDS AT THE TABLE', '5', (90, 220, 120), pulse([SCENE2 + 0.4]))
        R = ('TIMES WE LAUGHED', f'x{lg}', (90, 220, 120), 1 + 0.12 * abs(math.sin(t * 6)) if lg < 23 else 1)
        lsq = [(70, 170, 100)] * 5; rsq = [(70, 170, 100) if i < min(5, lg // 4 + (lg > 0)) else (50, 50, 60) for i in range(5)]
    for cx, (lab, val, col, p), sq in ((290, L, lsq), (790, R, rsq)):
        f = PIX(30); tw = d.textlength(lab, font=f); d.text((cx - tw / 2, 200), lab, font=f, fill=(150, 150, 160))
        f = MONT(80 * p); tw = d.textlength(val, font=f); d.text((cx - tw / 2, 245 - (p - 1) * 40), val, font=f, fill=col)
        for i in range(5):
            x = cx - 98 + i * 40; d.rounded_rectangle([x, 350, x + 28, 378], radius=5, fill=sq[i])
    d.line([(540, 210), (540, 370)], fill=(60, 60, 70), width=3)

HEADY = PY + 405  # approx head top on screen
def frame(T):
    im = Image.new('RGB', (W, H), (10, 10, 14))
    sc = room(min(T, PUNCH))
    dip = max(0, 1 - abs(T - SCENE2) / 0.35)
    if dip > 0: sc = Image.blend(sc, Image.new('RGB', sc.size, (8, 8, 12)), dip)
    fade = np.clip(np.linspace(5, 0, PH), 0, 1)[:, None] * np.ones((1, PW)); m = Image.fromarray((fade * 255).astype(np.uint8))
    im.paste(sc, (0, PY), m)
    ref = sc.transpose(Image.FLIP_TOP_BOTTOM).crop((0, 0, PW, 300)).filter(ImageFilter.GaussianBlur(3))
    rm = Image.fromarray((np.linspace(70, 0, 300)[:, None] * np.ones((1, PW))).astype(np.uint8))
    im.paste(ref, (0, PY + 780 + 4), rm)
    hud(im, T)
    BY = PY + 90
    if 0.5 <= T < 2.4: bubble(im, 330, BY, 'POTLUCK NIGHT.\nI BROUGHT CHIPS.', T - 0.5, 'think', PEOPLE[0][0])
    for (sx, _, _, _, ta, line) in PEOPLE[1:]:
        t0 = ta + WALK
        end = LAUGH if ta == PEOPLE[4][4] else t0 + 1.4
        if t0 <= T < end: bubble(im, sx, BY, line, T - t0, 'say', sx)
    if LAUGH <= T < SCENE2 - 0.3: bubble(im, 330, BY, '...CHIP DINNER?', T - LAUGH, 'say', PEOPLE[0][0])
    if SCENE2 <= T < PUNCH:
        for j, (tt, who, txt) in enumerate(P2):
            end = P2[j + 1][0] if j + 1 < len(P2) else PUNCH
            if tt <= T < end: bubble(im, PEOPLE[who][0], BY, txt, T - tt, 'say', PEOPLE[who][0])
    if T >= PUNCH:
        k = ease((T - PUNCH) / 0.5)
        im = Image.blend(im, Image.new('RGB', (W, H), (8, 8, 12)), 0.82 * k); d = ImageDraw.Draw(im)
        tv = T - PUNCH
        if T < VERSE:
            rows = [('5 BAGS OF CHIPS?', (245, 245, 245), 0.2), ('ZERO DINNER.', (240, 80, 80), 0.7),
                    ('5 FRIENDS AT ONE TABLE?', (245, 245, 245), 1.6), ('STILL A FEAST.', (247, 184, 58), 2.1)]
            for i, (txt, col, st) in enumerate(rows):
                a = ease((tv - st) / 0.3)
                if a <= 0: continue
                fs = 72
                while d.textlength(txt, font=MONT(fs)) > 960: fs -= 2
                f = MONT(fs); tw = d.textlength(txt, font=f)
                d.text(((W - tw) / 2, 790 + i * 100 + (i >= 2) * 60 + (1 - a) * 20), txt, font=f, fill=mix((8, 8, 12), col, a))
        else:
            a = ease((T - VERSE) / 0.8); fv = ImageFont.truetype(f'{FD}/lora-latin-500-italic.ttf', 58)
            for i, l in enumerate(['"Better is a dinner of herbs,', 'where love is,', 'than a fattened calf with hatred."']):
                tw = d.textlength(l, font=fv); d.text(((W - tw) / 2, 820 + i * 82), l, font=fv, fill=mix((8, 8, 12), (235, 235, 235), a))
            r = 'PROVERBS 15:17'; fr = INTER('700', 34); tw = d.textlength(r, font=fr)
            d.text(((W - tw) / 2, 1090), r, font=fr, fill=mix((8, 8, 12), (247, 184, 58), ease((T - VERSE - 0.6) / 0.6)))
    return np.asarray(im)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if CHECK:
        for s in CHECK.split(','): Image.fromarray(frame(float(s))).save(f'{OUT}/check_{s}.jpg', quality=88)
        sys.exit()
    segs = [('a', 0, 7.8), ('b', 7.8, SCENE2), ('c', SCENE2, PUNCH), ('d', PUNCH, VERSE), ('e', VERSE, TOTAL)]; parts = []
    for name, a, b in segs:
        tmp = f'{OUT}/{name}.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for fi in range(int(round((b - a) * FPS))): p.stdin.write(frame(a + fi / FPS).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, f'{OUT}/{name}.mp4'); parts.append(f'{name}.mp4')
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{x}'\n" for x in parts)); print('parts', parts)
