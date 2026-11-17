#!/usr/bin/env python3
"""Times I said "I'm fine" (Junko format: HUD counters, incoming texts + reply bubbles, a friend knocks
and walks in with soup — no app — punchline card, verse).
usage: python3 fine.py <outdir> [check t1,t2,..]   -> <outdir>/a.mp4..e.mp4 + list.txt (silent)."""
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

# (time, sender, incoming text, my reply)
TEXTS = [(1.0, 'MOM', 'HOW ARE YOU\nDOING, SWEETIE?', "I'M FINE!"),
         (3.9, 'WORK', 'YOU GOOD? YOU SEEMED\nOFF IN THE MEETING', 'TOTALLY FINE :)'),
         (6.8, 'JESS', "HAVEN'T HEARD FROM\nYOU IN A WHILE", "YEAH I'M FINE!\nJUST BUSY"),
         (9.7, 'JESS', 'YOU SURE?', "I'M FINE. REALLY.")]
KNOCK, OPEN, SITS, HONEST, SOUP, PUNCH, VERSE, TOTAL = 12.8, 13.6, 15.6, 17.6, 19.8, 22.2, 26.4, 30.4
FX, MX = 300, 480  # friend / main seat x

def glow_finish(im, glow, amt=0.6):
    gs = glow.filter(ImageFilter.GaussianBlur(12)).resize(im.size, Image.BILINEAR)
    return Image.fromarray(np.clip(np.asarray(im, np.float32) + np.asarray(gs, np.float32) * amt, 0, 255).astype(np.uint8))

def kitchen(t):
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); g = ImageDraw.Draw(glow); k4 = SS / 4
    def G(x, y, r, c): g.ellipse([(x - r) * k4, (y - r) * k4, (x + r) * k4, (y + r) * k4], fill=c)
    warm = ease((t - SITS) / 1.5)
    dusk = ease(t / 11)
    FL = 780
    im.paste(vgrad(PW * SS, FL * SS, mix((86, 96, 118), (176, 128, 92), warm), mix((70, 78, 98), (146, 100, 72), warm)), (0, 0))
    im.paste(vgrad(PW * SS, (PH - FL) * SS, mix((58, 56, 64), (98, 70, 54), warm), (20, 18, 22)), (0, FL * SS))
    d.rect([0, FL - 6, PW, FL + 4], mix((50, 52, 64), (110, 74, 54), warm))
    # window: sunset -> night
    S.window(d, 330, 170, 200, 170, mix((80, 86, 104), (120, 84, 64), warm), mix((240, 160, 120), (24, 28, 58), dusk),
             mix((150, 110, 160), (46, 44, 84), dusk), t, night=dusk > 0.7, panel=im)
    # upper cabinets + backsplash tiles + counter
    for i in range(3):
        x = 600 + i * 112; d.rect([x, 140, x + 104, 290], (236, 232, 222), r=6); d.rect([x + 46, 250, x + 58, 262], (150, 140, 130), r=3)
    for i in range(6):
        for j in range(3): d.rect([606 + i * 54, 390 + j * 50, 652 + i * 54, 432 + j * 50], mix((150, 168, 176), (196, 170, 140), warm), r=3)
    d.rect([590, 540, 940, 560], (60, 58, 62), r=4)
    d.rect([600, 560, 930, FL], (226, 220, 208), r=4)
    for i in range(3): d.rect([612 + i * 106, 578, 706 + i * 106, 760], (240, 236, 226), r=4); d.rect([650 + i * 106, 600, 668 + i * 106, 608], (150, 140, 130), r=3)
    # kettle + plant on counter
    d.rect([640, 488, 720, 540], (200, 80, 70), r=20); d.rect([668, 474, 692, 490], (60, 50, 50), r=6); d.line([(720, 500), (748, 486)], (200, 80, 70), 10)
    S.plant(d, 880, 540, (190, 110, 80), (90, 150, 90), t)
    # fridge with a note
    d.rect([944, 250, 1074, FL], (226, 230, 232), r=14); d.line([(944, 440), (1074, 440)], (180, 186, 190), 4)
    d.rect([958, 330, 966, 410], (160, 166, 170), r=3); d.rect([958, 470, 966, 560], (160, 166, 170), r=3)
    d.rect([990, 300, 1040, 350], (250, 230, 120)); d.rect([1000, 480, 1050, 540], (150, 200, 230))
    # door (left) — opens at OPEN
    op = ease((t - OPEN) / 0.6) * (1 - ease((t - SITS - 0.6) / 0.6))
    d.rect([40, 360, 210, FL], (60, 54, 60), r=6)
    if op > 0:
        d.rect([50, 370, 200, FL], mix((60, 54, 60), (255, 220, 160), op), r=4); G(125, 560, 160 * op, (150, 110, 60))
    dw = lerp(150, 34, op)
    d.rect([50, 370, 50 + dw, FL], (128, 92, 70), r=4); d.rect([62, 382, 50 + dw - 12, FL], (146, 106, 80), r=4)
    if op < 0.5: d.cap(50 + dw - 22, 590, 9, (230, 190, 90))
    jit = math.sin(t * 60) * 2 if KNOCK <= t < KNOCK + 0.7 else 0
    d.rect([50 + jit, 370, 50 + dw + jit, 374], (128, 92, 70))
    # pendant lamp over table, turns on when the friend sits down
    d.line([(660, 0), (660, 360)], (60, 56, 60), 4)
    d.poly([(610, 400), (710, 400), (690, 360), (630, 360)], mix((110, 106, 100), (255, 224, 160), warm))
    if warm > 0: G(660, 430, 300, tuple(int(v * warm) for v in (130, 88, 40)))
    # small table + chairs
    d.rect([560, 640, 780, 664], (150, 104, 74), r=8); d.rect([586, 664, 602, FL], (120, 82, 58)); d.rect([738, 664, 754, FL], (120, 82, 58))
    for cx in (MX, FX):
        if cx == FX and t < SITS - 0.2: continue
        d.rect([cx - 64, 642, cx + 64, 662], (104, 70, 52), r=6); d.rect([cx - 56, 662, cx - 44, FL], (90, 60, 44)); d.rect([cx + 44, 662, cx + 56, FL], (90, 60, 44))
    # mug (+ soup when the friend sits)
    d.rect([600, 604, 636, 640], (90, 130, 170), r=6); d.arc([626, 610, 650, 632], -90, 90, (90, 130, 170), 6)
    if t >= SITS:
        a = ease((t - SITS) / 0.3)
        d.rect([680, 640 - 44 * a, 748, 640], (200, 140, 88), r=8); d.rect([676, 640 - 50 * a, 752, 640 - 40 * a], (120, 80, 56), r=4); d.rect([688, 640 - 30 * a, 740, 640 - 22 * a], (240, 230, 210))
        for i in range(3):
            sx = 696 + i * 18; ph = t * 2 + i
            d.line([(sx + math.sin(ph) * 4, 580 - (i % 2) * 8), (sx + math.sin(ph + 1) * 4, 560 - (i % 2) * 8)], (255, 255, 255), 3)
    # friend: walks in, sits, hand on shoulder
    if OPEN + 0.3 <= t < SITS:
        k = ease((t - OPEN - 0.3) / (SITS - OPEN - 0.3))
        S.person(d, lerp(120, FX, k), FL + 6, 170, (140, 104, 186), 'walk', 'smile', None, ('long', None), t, 5, 'lap')
    elif t >= SITS:
        S.person(d, FX, 650, 178, (140, 104, 186), 'sit', 'smile', None, ('long', None), t, 5, 'shoulderR' if t >= HONEST else 'lap', head_tilt=0.12)
    # main character
    sad = t < SOUP
    phone = t < KNOCK + 0.4
    tilt = -0.14 * ease(t / 10) if t < KNOCK else (0.25 * ease((t - KNOCK) / 0.4) if t < HONEST else -0.08)
    hand = S.person(d, MX, 650, 190, None, 'sit', 'sad' if sad else 'smile', None, ('bob', None), t, 1, 'phone' if phone else 'lap', head_tilt=tilt)
    if phone:
        d.rect([hand[0] - 24, hand[1] - 42, hand[0] + 24, hand[1] + 32], (230, 240, 255), r=8); G(hand[0], hand[1], 70, (70, 100, 160))
    return glow_finish(im, glow).resize((PW, PH), Image.LANCZOS)

def bubble(im, cx, y, text, k, kind='think', tail=0.5, who=None):
    if k <= 0: return
    d = ImageDraw.Draw(im); f = MONT(42 if kind == 'text' else 44); lines = text.split('\n')
    tw = max(d.textlength(l, font=f) for l in lines); w, h = tw + 76, 58 * len(lines) + 48
    sc = 0.6 + 0.4 * ease(k / 0.6) + 0.06 * math.sin(min(k, 1) * math.pi)
    top = 44 if who else 0
    lay = Image.new('RGBA', (int(w + 20), int(h + 80 + top)), (0, 0, 0, 0)); L = ImageDraw.Draw(lay)
    if kind == 'text': fill, ol, tc = (232, 232, 238), (120, 120, 132), (24, 22, 26)
    elif kind == 'think': fill, ol, tc = (255, 255, 255), (232, 96, 120), (24, 22, 26)
    else: fill, ol, tc = (247, 184, 58), (40, 30, 20), (24, 22, 26)
    if who:
        fw = PIX(30); L.text((14, 4), who, font=fw, fill=(255, 255, 255), stroke_width=4, stroke_fill=(20, 20, 26))
    L.rounded_rectangle([6, 6 + top, w + 6, h + 6 + top], radius=34, fill=fill, outline=ol, width=6)
    for i, l in enumerate(lines):
        lw = L.textlength(l, font=f); L.text((6 + (w - lw) / 2, 30 + top + i * 58), l, font=f, fill=tc)
    if kind == 'think':
        for cx2, cy2, r in ((w * tail, h + 26, 13), (w * tail + w * 0.06, h + 56, 8)): L.ellipse([cx2 - r, cy2 - r, cx2 + r, cy2 + r], fill=fill, outline=ol, width=4)
    elif kind == 'say':
        tx = w * tail; L.polygon([(tx - 18, h + 2), (tx + 18, h + 2), (tx - 4, h + 44)], fill=fill)
        L.line([(tx - 18, h + 6), (tx - 4, h + 44), (tx + 18, h + 6)], fill=ol, width=6)
    lay = lay.resize((max(1, int(lay.width * sc)), max(1, int(lay.height * sc))), Image.LANCZOS)
    im.paste(lay, (int(cx - lay.width / 2), int(y)), lay)

def hud(im, t):
    d = ImageDraw.Draw(im)
    n = sum(1 for tt, *_ in TEXTS if t >= tt + 1.2)
    if t < HONEST + 0.3:
        llab, rlab = 'ACTUALLY FINE', "TIMES I SAID I'M FINE"
        pct = [12, 8, 5, 3, 1][n]; lval, lcol = f'{pct}%', (240, 80, 80)
        if t < KNOCK: rval, rcol = f'x{n}', (240, 80, 80)
        else: rval, rcol = '???', (247, 184, 58)
    else:
        llab, rlab = 'ACTUALLY FINE', 'HONEST ANSWERS'
        lval, lcol = ('GETTING THERE', (90, 220, 120)) if t >= SOUP else ('NOT YET', (247, 184, 58))
        rval, rcol = 'x1', (90, 220, 120)
    for cx, lab in ((290, llab), (790, rlab)):
        f = PIX(30); tw = d.textlength(lab, font=f); d.text((cx - tw / 2, 200), lab, font=f, fill=(150, 150, 160))
    lf = MONT(80 if len(lval) < 9 else 58); tw = d.textlength(lval, font=lf)
    d.text((290 - tw / 2, 245 + (80 - lf.size) * 0.6), lval, font=lf, fill=lcol)
    pulse = 1 + 0.25 * max(0, 1 - min(abs(t - (tt + 1.2)) for tt, *_ in TEXTS) / 0.25) if t < KNOCK else 1
    if abs(t - HONEST - 0.3) < 0.25: pulse = 1 + 0.25 * (1 - abs(t - HONEST - 0.3) / 0.25)
    f = MONT(80 * pulse); tw = d.textlength(rval, font=f); d.text((790 - tw / 2, 245 - (pulse - 1) * 40), rval, font=f, fill=rcol)
    for i in range(4):
        x = 720 + i * 40
        if t < HONEST + 0.3:
            on = i < n
            d.rounded_rectangle([x, 350, x + 28, 378], radius=5, fill=(200, 60, 70) if on else (50, 50, 60))
            if on: d.line([(x + 7, 357), (x + 21, 371)], fill=(255, 255, 255), width=3); d.line([(x + 21, 357), (x + 7, 371)], fill=(255, 255, 255), width=3)
        else:
            d.rounded_rectangle([x, 350, x + 28, 378], radius=5, fill=(70, 170, 100) if i == 0 else (50, 50, 60))
    d.line([(540, 210), (540, 370)], fill=(60, 60, 70), width=3)

def frame(T):
    im = Image.new('RGB', (W, H), (10, 10, 14))
    sc = kitchen(min(T, PUNCH))
    fade = np.clip(np.linspace(5, 0, PH), 0, 1)[:, None] * np.ones((1, PW)); m = Image.fromarray((fade * 255).astype(np.uint8))
    im.paste(sc, (0, PY), m)
    ref = sc.transpose(Image.FLIP_TOP_BOTTOM).crop((0, 0, PW, 300)).filter(ImageFilter.GaussianBlur(3))
    rm = Image.fromarray((np.linspace(70, 0, 300)[:, None] * np.ones((1, PW))).astype(np.uint8))
    im.paste(ref, (0, PY + 780 + 4), rm)
    hud(im, T)
    for tt, who, q, a in TEXTS:
        if tt <= T < tt + 2.7: bubble(im, 330, PY + 30, q, T - tt, 'text', who=who)
        if tt + 0.9 <= T < tt + 2.7: bubble(im, 760, PY + 210, a, T - tt - 0.9, 'say', 0.2)
    if KNOCK <= T < OPEN + 0.9: bubble(im, 200, PY + 160, 'KNOCK KNOCK', T - KNOCK, 'say', 0.35)
    if OPEN + 1.0 <= T < HONEST: bubble(im, 360, PY + 40, "YOU SAID 'FINE'\nFOUR TIMES.", T - OPEN - 1.0, 'say', 0.2)
    if HONEST <= T < SOUP: bubble(im, 720, PY + 90, "...OKAY.\nI'M NOT FINE.", T - HONEST, 'say', 0.12)
    if SOUP <= T < PUNCH: bubble(im, 330, PY + 40, 'I KNOW.\nI BROUGHT SOUP.', T - SOUP, 'say', 0.2)
    if T >= PUNCH:
        k = ease((T - PUNCH) / 0.5)
        im = Image.blend(im, Image.new('RGB', (W, H), (8, 8, 12)), 0.82 * k); d = ImageDraw.Draw(im)
        tv = T - PUNCH
        if T < VERSE:
            rows = [("MY \"I'M FINE\"?", (245, 245, 245), 0.2), ('OSCAR-WORTHY.', (240, 80, 80), 0.7),
                    ('MY FRIEND?', (245, 245, 245), 1.6), ('NOT BUYING IT.', (247, 184, 58), 2.1)]
            for i, (txt, col, st) in enumerate(rows):
                a = ease((tv - st) / 0.3)
                if a <= 0: continue
                f = MONT(72); tw = d.textlength(txt, font=f)
                d.text(((W - tw) / 2, 790 + i * 100 + (i >= 2) * 60 + (1 - a) * 20), txt, font=f, fill=mix((8, 8, 12), col, a))
        else:
            a = ease((T - VERSE) / 0.8); fv = ImageFont.truetype(f'{FD}/lora-latin-500-italic.ttf', 54)
            for i, l in enumerate(['"A friend loves at all times;', 'and a brother is born for adversity."']):
                tw = d.textlength(l, font=fv); d.text(((W - tw) / 2, 860 + i * 76), l, font=fv, fill=mix((8, 8, 12), (235, 235, 235), a))
            r = 'PROVERBS 17:17'; fr = INTER('700', 34); tw = d.textlength(r, font=fr)
            d.text(((W - tw) / 2, 1040), r, font=fr, fill=mix((8, 8, 12), (247, 184, 58), ease((T - VERSE - 0.6) / 0.6)))
    return np.asarray(im)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if CHECK:
        for s in CHECK.split(','): Image.fromarray(frame(float(s))).save(f'{OUT}/check_{s}.jpg', quality=88)
        sys.exit()
    segs = [('a', 0, KNOCK), ('b', KNOCK, SITS), ('c', SITS, PUNCH), ('d', PUNCH, VERSE), ('e', VERSE, TOTAL)]; parts = []
    for name, a, b in segs:
        tmp = f'{OUT}/{name}.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for fi in range(int(round((b - a) * FPS))): p.stdin.write(frame(a + fi / FPS).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, f'{OUT}/{name}.mp4'); parts.append(f'{name}.mp4')
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{x}'\n" for x in parts)); print('parts', parts)
