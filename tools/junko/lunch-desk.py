#!/usr/bin/env python3
"""Lunch at my desk (Junko format): office at lunch break, she eats alone at her desk for the 37th time, reading the
verse of the day on her phone "quietly" ("if anyone asks, it's an email"). A coworker walks by: "wait... is that today's
verse??" -> "...it's an email." -> "same verse. i've been hiding it too." -> pulls up a chair. HUD: LUNCHES ALONE AT MY
DESK x1 -> x37 (-> LUNCHES TOGETHER x1) + COWORKERS WHO LOVE JESUS x0 -> x1. Punchline card, verse (Ecclesiastes 4:9).
app: none.  usage: python3 lunch-desk.py <outdir> [check t1,t2,..]  -> <outdir>/a.mp4..e.mp4 + list.txt (silent)."""
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

MX, CX0, CX1, CXS = 560, 1180, 860, 840   # main x, coworker walk from/to, coworker sitting x
CNT_A, CNT_B = 0.3, 2.7                     # lunches counter 1 -> 37
WALK0, WALK1, FIND, SIT, TOGETHER, PUNCH, VERSE, TOTAL = 11.9, 13.3, 17.2, 19.0, 20.2, 22.4, 26.6, 30.2
THINK = [(0.8, 'LUNCH AT MY DESK.\nAGAIN.'), (3.6, 'VERSE OF THE DAY...\nREADING IT QUIETLY.'),
         (6.4, 'IF ANYONE ASKS,\nIT\'S AN EMAIL.'), (9.2, 'NOBODY HERE IS\nINTO JESUS ANYWAY.')]
SAYS = [(13.4, 'WAIT... IS THAT\nTODAY\'S VERSE??', 'co'), (15.3, '...IT\'S AN\nEMAIL.', 'me'),
        (FIND, 'SAME VERSE. I\'VE BEEN\nHIDING IT TOO.', 'co'), (19.5, 'SAME DESK\nTOMORROW?', 'co')]
END_SAY = PUNCH - 0.3
ZX, ZY, ZW = 90, 60, 900
def sx(x): return (x - ZX) * PW / ZW

def nlunch(t): return 0 if t < CNT_A else min(37, 1 + int((t - CNT_A) / ((CNT_B - CNT_A) / 36)))
def ncow(t): return 0 if t < FIND + 0.3 else 1

def room(t):
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); gd = ImageDraw.Draw(glow); k4 = SS / 4
    def G(x, y, r, c): gd.ellipse([(x - r) * k4, (y - r) * k4, (x + r) * k4, (y + r) * k4], fill=c)
    FLOOR = 640
    im.paste(vgrad(PW * SS, FLOOR * SS, (214, 222, 206), (188, 200, 184)), (0, 0))
    im.paste(vgrad(PW * SS, (PH - FLOOR) * SS, (120, 128, 146), (84, 90, 108)), (0, FLOOR * SS))
    d.rect([0, FLOOR - 8, PW, FLOOR + 4], (150, 156, 150))
    for k in range(9): d.line([(k * 140 - 60, FLOOR + 4), (k * 160 - 250, PH)], (110, 118, 136), 2)
    # big office window with city at noon
    wx, wy, ww, wh = 60, 70, 420, 330
    g = vgrad(int(ww * SS), int(wh * SS), (128, 190, 240), (204, 230, 246)); im.paste(g, (int(wx * SS), int(wy * SS)))
    for i, (bx, bw, bh, bc) in enumerate([(70, 70, 170, (150, 170, 196)), (140, 60, 230, (130, 150, 180)), (200, 90, 140, (170, 186, 206)),
                                          (290, 70, 250, (120, 140, 172)), (360, 60, 180, (156, 174, 200)), (420, 70, 120, (140, 160, 190))]):
        d.rect([bx, wy + wh - bh, bx + bw, wy + wh], bc)
        for r_ in range(int(bh / 26)):
            for c_ in range(int(bw / 22)): d.rect([bx + 8 + c_ * 20, wy + wh - bh + 12 + r_ * 26, bx + 18 + c_ * 20, wy + wh - bh + 24 + r_ * 26], (226, 236, 246))
    for i, cx in enumerate((150, 360)):
        cx2 = cx + (t * 6 * (1 + i * 0.4)) % 50
        for dx, rr in ((-30, 22), (0, 30), (30, 22)): d.cap(cx2 + dx, 120 + i * 30, rr, (255, 255, 255))
    d.rect([wx, wy, wx + ww, wy + wh], None, r=4, outline=(236, 238, 232), width=12)
    d.line([(wx + ww / 2, wy), (wx + ww / 2, wy + wh)], (236, 238, 232), 8)
    G(270, 230, 260, (60, 70, 70))
    # blinds top
    d.rect([wx - 10, wy - 16, wx + ww + 10, wy + 6], (240, 240, 236), r=4)
    # wall clock 12:30
    cx, cy = 640, 150; d.cap(cx, cy, 50, (60, 64, 70)); d.cap(cx, cy, 42, (250, 250, 246))
    for k in range(12):
        a = k * math.pi / 6; d.line([(cx + math.cos(a) * 34, cy + math.sin(a) * 34), (cx + math.cos(a) * 39, cy + math.sin(a) * 39)], (90, 90, 96), 3)
    d.line([(cx, cy), (cx + 4, cy - 22)], (40, 40, 46), 5); d.line([(cx, cy), (cx, cy + 32)], (40, 40, 46), 3)
    # cork board
    d.rect([760, 90, 1010, 290], (196, 150, 104), r=6, outline=(150, 108, 70), width=8)
    for (px, py, pw_, ph_, pc, ang) in ((790, 115, 70, 80, (255, 244, 160), 0), (880, 110, 90, 60, (250, 250, 250), 0), (900, 190, 80, 70, (180, 220, 250), 0), (800, 210, 70, 56, (250, 190, 200), 0)):
        d.rect([px, py, px + pw_, py + ph_], pc, r=2); d.cap(px + pw_ / 2, py + 6, 5, (220, 70, 70))
        for k in range(3): d.line([(px + 10, py + 22 + k * 12), (px + pw_ - 12, py + 22 + k * 12)], (170, 170, 176), 2)
    # desk along the back
    d.rect([110, 556, 1000, 586], (176, 132, 96), r=8); d.rect([120, 586, 990, 600], (146, 106, 76))
    d.rect([140, 600, 160, 660], (110, 80, 60)); d.rect([950, 600, 970, 660], (110, 80, 60))
    d.rect([170, 600, 360, 650], (156, 114, 82), r=6); d.rect([250, 618, 290, 626], (210, 190, 160), r=3)  # drawer
    # monitor
    d.rect([180, 360, 430, 520], (40, 42, 50), r=12); d.rect([192, 372, 418, 508], (220, 236, 250), r=4)
    for k in range(6):
        d.rect([204, 384 + k * 20, 300, 396 + k * 20], (170, 196, 224), r=2); d.rect([310, 384 + k * 20, 406, 396 + k * 20], (196, 214, 236), r=2)
    d.rect([292, 520, 318, 548], (60, 62, 70)); d.rect([256, 546, 354, 558], (60, 62, 70), r=4)
    d.rect([418, 380, 452, 412], (255, 232, 110), r=2); d.rect([420, 420, 452, 450], (255, 182, 200), r=2)  # sticky notes
    d.rect([200, 560, 400, 572], (230, 230, 232), r=4)  # keyboard
    # mug + papers + plant
    d.rect([440, 520, 476, 560], (90, 140, 200), r=6); d.arc([466, 528, 490, 552], 270, 90, (90, 140, 200), 6)
    d.rect([880, 540, 960, 560], (246, 246, 240), r=2); d.rect([884, 530, 956, 544], (236, 236, 230), r=2)
    S.plant(d, 940, 530, (226, 226, 220), (96, 156, 100), t)
    # salad on desk (next to her)
    d.chord([640, 506, 760, 566], 0, 180, (246, 246, 240)); d.rect([640, 532, 760, 538], (246, 246, 240))
    for i, (lx, lc) in enumerate(((660, (110, 180, 90)), (690, (140, 200, 100)), (716, (220, 80, 70)), (740, (110, 170, 90)), (700, (240, 200, 90)))):
        d.cap(lx, 530 - (i == 2) * 4, 13, lc)
    d.line([(752, 520), (790, 482)], (200, 200, 204), 5)
    # second chair (coworker rolls it in)
    def chair(x, back=True):
        if back: d.rect([x - 78, 560, x + 78, 760], (60, 66, 84), r=36); d.rect([x - 64, 574, x + 64, 746], (76, 84, 104), r=28)
        d.rect([x - 10, 790, x + 10, 900], (50, 54, 66)); d.rect([x - 90, 890, x + 90, 906], (50, 54, 66), r=8)
        for wx_ in (x - 84, x, x + 84): d.cap(wx_, 916, 12, (36, 38, 46))
    # her chair + her
    chair(MX)
    if t < WALK1: mood, tilt = 'sad', 0.08
    elif t < FIND: mood, tilt = 'flat', (0.22 * math.sin((t - WALK1) * 30) * max(0, 1 - (t - WALK1) / 0.6))
    elif t < TOGETHER - 0.8: mood, tilt = 'smile', 0.0
    else: mood, tilt = 'laugh', 0.1 * math.sin(t * 14)
    ph = S.person(d, MX, 780, 170, None, 'sit', mood, None, ('bob', None), t, 1, 'phone', head_tilt=tilt)
    d.rect([ph[0] - 22, ph[1] - 36, ph[0] + 22, ph[1] + 28], (236, 244, 255), r=7)
    d.rect([ph[0] - 12, ph[1] - 22, ph[0] + 12, ph[1] - 18], (150, 160, 190)); d.rect([ph[0] - 2, ph[1] - 12, ph[0] + 2, ph[1] + 10], (230, 170, 80)); d.rect([ph[0] - 8, ph[1] - 6, ph[0] + 8, ph[1] - 2], (230, 170, 80))
    G(ph[0], ph[1], 60, (60, 80, 110))
    # coworker
    if t >= WALK0:
        if t < SIT:
            k = ease((t - WALK0) / (WALK1 - WALK0)); x = lerp(CX0, CX1, k)
            ta = t if t < WALK1 else (5 * math.pi - 7) / 6
            cm = 'flat' if t < WALK1 else ('smile' if t < FIND else 'laugh')
            hd = S.person(d, x, 960, 160, (92, 150, 112), 'walk', cm, None, ('bun', None), ta, 7, 'phone' if t >= FIND else 'lap', head_tilt=-0.08 if t >= FIND else 0)
            if hd: d.rect([hd[0] - 20, hd[1] - 34, hd[0] + 20, hd[1] + 26], (236, 244, 255), r=7); G(hd[0], hd[1], 50, (60, 80, 110))
        else:
            k = ease((t - SIT) / 0.4); x = lerp(CXS + 60, CXS, k)
            chair(x)
            S.person(d, x, 780, 160, (92, 150, 112), 'sit', 'laugh' if t > TOGETHER - 0.8 else 'smile', None, ('bun', None), t, 7, 'lap', head_tilt=-0.06 * math.sin(t * 13) if t > TOGETHER - 0.8 else 0)
    gs = glow.filter(ImageFilter.GaussianBlur(12)).resize(im.size, Image.BILINEAR)
    im = Image.fromarray(np.clip(np.asarray(im, np.float32) + np.asarray(gs, np.float32) * 0.5, 0, 255).astype(np.uint8))
    out = im.resize((PW, PH), Image.LANCZOS)
    z = 1 + 0.04 * min(t, PUNCH) / PUNCH; cw = ZW / z; x0 = ZX + (ZW - cw) / 2; y0 = ZY + (ZW - cw) / 2
    return out.crop((int(x0), int(y0), int(x0 + cw), int(y0 + cw))).resize((PW, PH), Image.BICUBIC)

def bubble(im, cx, y, text, k, kind='think', target=None):
    if k <= 0: return
    d = ImageDraw.Draw(im); f = MONT(44); lines = text.split('\n')
    tw = max(d.textlength(l, font=f) for l in lines); w, h = tw + 76, 58 * len(lines) + 48
    cx = min(max(cx, w / 2 + 30), W - w / 2 - 30)
    tail = 0.5 if target is None else min(0.85, max(0.15, (target - (cx - w / 2)) / w))
    sc = 0.6 + 0.4 * ease(k / 0.6) + 0.06 * math.sin(min(k, 1) * math.pi)
    lay = Image.new('RGBA', (int(w + 20), int(h + 80)), (0, 0, 0, 0)); L = ImageDraw.Draw(lay)
    if kind == 'think': fill, ol = (255, 255, 255), (232, 96, 120)
    elif kind == 'co': fill, ol = (170, 226, 180), (30, 60, 40)
    else: fill, ol = (247, 184, 58), (40, 30, 20)
    L.rounded_rectangle([6, 6, w + 6, h + 6], radius=34, fill=fill, outline=ol, width=6)
    for i, l in enumerate(lines):
        lw = L.textlength(l, font=f); L.text((6 + (w - lw) / 2, 30 + i * 58), l, font=f, fill=(24, 22, 26))
    if kind == 'think':
        for cx2, cy2, r in ((w * tail, h + 26, 13), (w * tail + w * 0.03, h + 56, 8)): L.ellipse([cx2 - r, cy2 - r, cx2 + r, cy2 + r], fill=fill, outline=ol, width=4)
    else:
        tx = w * tail; L.polygon([(tx - 18, h + 2), (tx + 18, h + 2), (tx - 4, h + 44)], fill=fill)
        L.line([(tx - 18, h + 6), (tx - 4, h + 44), (tx + 18, h + 6)], fill=ol, width=6)
    lay = lay.resize((max(1, int(lay.width * sc)), max(1, int(lay.height * sc))), Image.LANCZOS)
    im.paste(lay, (int(cx - lay.width / 2), int(y + (1 - sc) * h)), lay)

def hud(im, t):
    d = ImageDraw.Draw(im)
    def pulse(ts):
        m = min([abs(t - x) for x in ts] + [9]); return 1 + 0.25 * max(0, 1 - m / 0.25)
    n, c = nlunch(t), ncow(t)
    steps = [CNT_A + i * (CNT_B - CNT_A) / 36 for i in range(37)]
    if t < TOGETHER: L = ('LUNCHES ALONE AT MY DESK', f'x{n}', (240, 80, 80), pulse([CNT_B]), [(240, 80, 80) if i < math.ceil(n / 3.7) else (50, 50, 60) for i in range(10)])
    else: L = ('LUNCHES TOGETHER', 'x1', (90, 220, 120), pulse([TOGETHER]), [(70, 170, 100) if i < 1 else (50, 50, 60) for i in range(10)])
    R = ('COWORKERS WHO LOVE JESUS', f'x{c}', (240, 80, 80) if c == 0 else (90, 220, 120), pulse([FIND + 0.3]), [(70, 170, 100) if i < c else (50, 50, 60) for i in range(10)])
    for cx, (lab, val, col, pz, sq) in ((290, L), (790, R)):
        f = PIX(30); tw = d.textlength(lab, font=f); d.text((cx - tw / 2, 200), lab, font=f, fill=(150, 150, 160))
        f = MONT(80 * pz); tw = d.textlength(val, font=f); d.text((cx - tw / 2, 245 - (pz - 1) * 40), val, font=f, fill=col)
        for i in range(10):
            x = cx - 129 + i * 26; d.rounded_rectangle([x, 352, x + 20, 372], radius=4, fill=sq[i])
    d.line([(540, 210), (540, 370)], fill=(60, 60, 70), width=3)

def frame(T):
    im = Image.new('RGB', (W, H), (10, 10, 14))
    sc = room(min(T, PUNCH))
    fade = np.clip(np.linspace(5, 0, PH), 0, 1)[:, None] * np.ones((1, PW)); m = Image.fromarray((fade * 255).astype(np.uint8))
    im.paste(sc, (0, PY), m)
    hud(im, T)
    BY = PY + 90
    for j, (tt, txt) in enumerate(THINK):
        end = THINK[j + 1][0] - 0.1 if j + 1 < len(THINK) else WALK0 + 0.6
        if tt <= T < end: bubble(im, sx(MX), BY, txt, T - tt, 'think', sx(MX))
    for j, (tt, txt, who) in enumerate(SAYS):
        end = SAYS[j + 1][0] - 0.1 if j + 1 < len(SAYS) else END_SAY
        if tt <= T < end:
            tx = sx(MX) if who == 'me' else sx(CX1 if tt < SIT else CXS)
            bubble(im, tx - (60 if who == 'co' else 0), BY, txt, T - tt, 'say' if who == 'me' else 'co', tx)
    if T >= PUNCH:
        k = ease((T - PUNCH) / 0.5)
        im = Image.blend(im, Image.new('RGB', (W, H), (8, 8, 12)), 0.82 * k); d = ImageDraw.Draw(im)
        tv = T - PUNCH
        if T < VERSE:
            rows = [('MY FAITH AT WORK?', (245, 245, 245), 0.2), ('UNDERCOVER. 37 LUNCHES.', (240, 80, 80), 0.7),
                    ('MY COWORKER?', (245, 245, 245), 1.6), ('ALSO UNDERCOVER.', (247, 184, 58), 2.1)]
            for i, (txt, col, st) in enumerate(rows):
                a = ease((tv - st) / 0.3)
                if a <= 0: continue
                fs = 72
                while d.textlength(txt, font=MONT(fs)) > 960: fs -= 2
                f = MONT(fs); tw = d.textlength(txt, font=f)
                d.text(((W - tw) / 2, 790 + i * 100 + (i >= 2) * 60 + (1 - a) * 20), txt, font=f, fill=mix((8, 8, 12), col, a))
        else:
            a = ease((T - VERSE) / 0.8); fv = ImageFont.truetype(f'{FD}/lora-latin-500-italic.ttf', 60)
            for i, l in enumerate(['"Two are better than one,', 'because they have a good', 'reward for their labor."']):
                tw = d.textlength(l, font=fv); d.text(((W - tw) / 2, 810 + i * 84), l, font=fv, fill=mix((8, 8, 12), (235, 235, 235), a))
            r = 'ECCLESIASTES 4:9'; fr = INTER('700', 34); tw = d.textlength(r, font=fr)
            d.text(((W - tw) / 2, 1100), r, font=fr, fill=mix((8, 8, 12), (247, 184, 58), ease((T - VERSE - 0.6) / 0.6)))
    return np.asarray(im)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if CHECK:
        for s in CHECK.split(','): Image.fromarray(frame(float(s))).save(f'{OUT}/check_{s}.jpg', quality=88)
        sys.exit()
    segs = [('a', 0, WALK0), ('b', WALK0, SIT), ('c', SIT, PUNCH), ('d', PUNCH, VERSE), ('e', VERSE, TOTAL)]; parts = []
    for name, a, b in segs:
        tmp = f'{OUT}/{name}.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for fi in range(int(round((b - a) * FPS))): p.stdin.write(frame(a + fi / FPS).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, f'{OUT}/{name}.mp4'); parts.append(f'{name}.mp4')
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{x}'\n" for x in parts)); print('parts', parts)
