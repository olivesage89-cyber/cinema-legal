#!/usr/bin/env python3
"""Excuses not to go to bible study (Junko format: HUD countdown + excuse counter, thought bubbles,
notification, scene change to friends' living room, punchline card, verse).
usage: python3 excuses.py <outdir> [check t1,t2,..]   -> <outdir>/a.mp4..e.mp4 + list.txt (silent)."""
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

EXCUSES = [(1.0, "I'M KIND OF\nTIRED THOUGH"), (3.7, "WHAT IF IT'S\nAWKWARD?"),
           (6.4, "I CAN NEVER FIND\nROMANS FAST ENOUGH"), (9.1, "I COULD JUST PRAY\nFROM MY COUCH")]
BUZZ, FINE, GO, SWITCH, PUNCH, VERSE, TOTAL = 12.0, 14.4, 15.4, 16.6, 21.4, 25.6, 29.6

def glow_finish(im, glow, amt=0.6):
    gs = glow.filter(ImageFilter.GaussianBlur(12)).resize(im.size, Image.BILINEAR)
    return Image.fromarray(np.clip(np.asarray(im, np.float32) + np.asarray(gs, np.float32) * amt, 0, 255).astype(np.uint8))

def home(t):
    """scene 1: own living room at dusk, phone on side table"""
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); g = ImageDraw.Draw(glow); k4 = SS / 4
    def G(x, y, r, c): g.ellipse([(x - r) * k4, (y - r) * k4, (x + r) * k4, (y + r) * k4], fill=c)
    FL = 780
    im.paste(vgrad(PW * SS, FL * SS, (92, 80, 112), (70, 60, 88)), (0, 0))
    im.paste(vgrad(PW * SS, (PH - FL) * SS, (54, 44, 56), (22, 18, 24)), (0, FL * SS))
    d.rect([0, FL - 6, PW, FL + 4], (60, 48, 64))
    S.window(d, 60, 160, 230, 270, (64, 52, 76), (250, 168, 120), (130, 92, 150), t, night=False, panel=im)
    d.cap(175, 330, 30, (255, 214, 150))  # setting sun
    S.frames_on_wall(d, [(420, 200, 120, 150, (60, 48, 70), (140, 120, 170)), (560, 230, 90, 90, (60, 48, 70), (120, 150, 160))])
    # door + coat hook
    d.rect([905, 400, 1050, FL], (120, 82, 64), r=6); d.rect([918, 414, 1037, FL], (140, 98, 74), r=4)
    d.cap(930, 600, 9, (230, 190, 90)); d.rect([860, 380, 880, 390], (60, 48, 70))
    d.rect([848, 386, 890, 520], (196, 92, 84), r=16)  # jacket on hook
    # couch
    cc, cb = (120, 104, 150), (104, 88, 132)
    d.rect([300, 500, 860, 650], cb, r=44); d.rect([270, 590, 350, 770], cc, r=30); d.rect([810, 590, 890, 770], cc, r=30)
    d.rect([320, 640, 840, 720], cc, r=26); d.rect([330, 720, 830, 770], (88, 74, 112))
    d.rect([620, 590, 740, 660], (230, 196, 120), r=24)  # cushion
    # side table + lamp + phone
    d.rect([110, 600, 240, FL], (110, 78, 60), r=8); d.rect([124, 680, 226, 690], (86, 60, 46))
    d.rect([168, 470, 176, 600], (70, 54, 46)); d.poly([(130, 470), (214, 470), (196, 410), (148, 410)], (250, 214, 160))
    G(172, 450, 200, (150, 100, 50))
    picked = t >= BUZZ + 1.2
    on = t >= BUZZ
    jit = math.sin(t * 90) * 3 if BUZZ <= t < BUZZ + 1.2 else 0
    if not picked:
        d.rect([196 + jit, 586, 234 + jit, 598], (230, 240, 255) if on else (40, 40, 50), r=4)
        if on: G(215, 590, 60, (80, 110, 180))
    # character
    if t < GO:
        mood = 'sad' if t < BUZZ + 1.0 else 'smile'
        tilt = (-0.12 * ease(t / 6)) if t < BUZZ + 1.0 else 0.0
        hand = S.person(d, 520, 650, 190, None, 'sit', mood, None, ('bob', None), t, 1, 'phone' if picked else 'lap', head_tilt=tilt)
        if picked:
            d.rect([hand[0] - 24, hand[1] - 42, hand[0] + 24, hand[1] + 32], (230, 240, 255), r=8); G(hand[0], hand[1], 70, (70, 100, 160))
    else:
        k = ease((t - GO) / 1.2)
        S.person(d, lerp(560, 960, k), FL + 6, 150, None, 'walk', 'smile', None, ('bob', None), t, 1, 'lap')
    out = glow_finish(im, glow).resize((PW, PH), Image.LANCZOS)
    if t >= BUZZ:
        big = out.resize((PW * SS, PH * SS)); db = D(big)
        kk = ease((t - BUZZ) / 0.4) * (1 - ease((t - BUZZ - 2.2) / 0.4))
        if kk > 0:
            S.notif(db, big, 220, 50, kk, 'Maya', 'saving you a seat. also i made brownies')
            out = big.resize((PW, PH), Image.LANCZOS)
    return out

def study(t):
    """scene 2: a friend's living room, warm, string lights, everyone laughing"""
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); g = ImageDraw.Draw(glow); k4 = SS / 4
    def G(x, y, r, c): g.ellipse([(x - r) * k4, (y - r) * k4, (x + r) * k4, (y + r) * k4], fill=c)
    class GL:
        @staticmethod
        def cap(x, y, r, c): G(x, y, r, c)
    FL = 780
    im.paste(vgrad(PW * SS, FL * SS, (176, 112, 84), (146, 88, 66)), (0, 0))
    im.paste(vgrad(PW * SS, (PH - FL) * SS, (100, 64, 48), (36, 24, 20)), (0, FL * SS))
    d.rect([0, FL - 6, PW, FL + 4], (110, 70, 52))
    S.string_lights(d, GL, 40, 1040, 120, t)
    S.window(d, 820, 200, 200, 240, (120, 80, 60), (40, 34, 70), (80, 60, 110), t, night=True, panel=im)
    S.frames_on_wall(d, [(90, 220, 110, 140, (110, 74, 56), (220, 170, 130)), (220, 250, 80, 90, (110, 74, 56), (150, 190, 170))])
    S.plant(d, 1010, FL, (190, 110, 80), (90, 150, 90), t)
    # big couch
    cc, cb = (214, 140, 98), (188, 116, 80)
    d.rect([90, 470, 950, 640], cb, r=50); d.rect([50, 580, 140, 770], cc, r=34); d.rect([900, 580, 990, 770], cc, r=34)
    d.rect([100, 630, 940, 715], cc, r=28); d.rect([110, 715, 930, 770], (160, 96, 66))
    # people (left -> right): green bun, main, red long, yellow bob
    sh = math.sin(t * 7)
    S.person(d, 230, 640, 160, (92, 150, 112), 'sit', 'laugh', None, ('bun', None), t + sh * 0.05, 3, 'lap')
    S.person(d, 430, 640, 170, None, 'sit', 'laugh', None, ('bob', None), t, 1, 'lap')
    S.person(d, 630, 640, 160, (196, 92, 84), 'sit', 'laugh', None, ('long', None), t, 4, 'lap')
    S.person(d, 820, 640, 160, (230, 186, 70), 'sit', 'laugh', None, ('bob', None), t, 6, 'lap')
    # coffee table in front: brownies, candles, open bible
    d.rect([300, 790, 780, 826], (120, 78, 54), r=10); d.rect([320, 826, 336, 900], (100, 64, 46)); d.rect([744, 826, 760, 900], (100, 64, 46))
    d.ell([340, 770, 470, 800], (246, 240, 230))
    for i in range(5): d.rect([352 + i * 22, 766 - (i % 2) * 6, 372 + i * 22, 786 - (i % 2) * 6], (96, 58, 40), r=3)
    d.rect([520, 776, 620, 792], (240, 232, 214), r=4); d.rect([567, 776, 572, 792], (180, 120, 90))
    for cx in (660, 710):
        fl = math.sin(t * 9 + cx) * 2
        d.rect([cx, 752, cx + 20, 792], (250, 240, 222), r=4); d.ell([cx + 3, 728 + fl, cx + 17, 754], (255, 196, 96)); G(cx + 10, 742, 46, (160, 110, 40))
    out = glow_finish(im, glow).resize((PW, PH), Image.LANCZOS)
    z = 1 + 0.03 * (t / 5); cw, ch = int(PW / z), int(PH / z)
    return out.crop(((PW - cw) // 2, (PH - ch) // 2, (PW - cw) // 2 + cw, (PH - ch) // 2 + ch)).resize((PW, PH), Image.BICUBIC)

def bubble(im, cx, y, text, k, kind='think', tail=0.62):
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
        for cx2, cy2, r in ((w * tail, h + 26, 13), (w * tail + w * 0.06, h + 56, 8)): L.ellipse([cx2 - r, cy2 - r, cx2 + r, cy2 + r], fill=fill, outline=ol, width=4)
    else:
        tx = w * tail; L.polygon([(tx - 18, h + 2), (tx + 18, h + 2), (tx - 4, h + 44)], fill=fill)
        L.line([(tx - 18, h + 6), (tx - 4, h + 44), (tx + 18, h + 6)], fill=ol, width=6)
    lay = lay.resize((max(1, int(lay.width * sc)), max(1, int(lay.height * sc))), Image.LANCZOS)
    im.paste(lay, (int(cx - lay.width / 2), int(y)), lay)

def hud(im, t):
    d = ImageDraw.Draw(im)
    n = sum(1 for tt, _ in EXCUSES if t >= tt + 0.3)
    if t < SWITCH:
        llab, rlab = 'BIBLE STUDY IN', 'EXCUSES'
        if t < FINE: mins = int(lerp(45, 12, min(1, t / BUZZ))); lval, lcol = f'{mins} MIN', (240, 80, 80)
        else: lval, lcol = 'LEAVING NOW', (90, 220, 120)
        if t < BUZZ + 1.2: rval, rcol = f'x{n}', (240, 80, 80)
        elif t < FINE: rval, rcol = '???', (247, 184, 58)
        else: rval, rcol = 'x0', (90, 220, 120)
    else:
        mins = int(lerp(22 * 60 + 18, 22 * 60 + 47, min(1, (t - SWITCH) / 4.8)))
        llab, lval, lcol = 'TIME', f'{(mins // 60) - 12}:{mins % 60:02d} PM', (90, 220, 120)
        rlab, rval, rcol = 'GLAD I CAME', '100%', (90, 220, 120)
    for cx, lab in ((290, llab), (790, rlab)):
        f = PIX(30); tw = d.textlength(lab, font=f); d.text((cx - tw / 2, 200), lab, font=f, fill=(150, 150, 160))
    lf = MONT(80 if len(lval) < 9 else 62); tw = d.textlength(lval, font=lf)
    d.text((290 - tw / 2, 245 + (80 - lf.size) * 0.6), lval, font=lf, fill=lcol)
    pulse = 1 + 0.25 * max(0, 1 - min(abs(t - (tt + 0.3)) for tt, _ in EXCUSES) / 0.25) if t < BUZZ else 1
    f = MONT(80 * pulse); tw = d.textlength(rval, font=f); d.text((790 - tw / 2, 245 - (pulse - 1) * 40), rval, font=f, fill=rcol)
    if t < SWITCH:
        for i in range(4):
            x = 720 + i * 40; on = i < n and t < FINE
            d.rounded_rectangle([x, 350, x + 28, 378], radius=5, fill=(200, 60, 70) if on else (50, 50, 60))
            if on: d.line([(x + 7, 357), (x + 21, 371)], fill=(255, 255, 255), width=3); d.line([(x + 21, 357), (x + 7, 371)], fill=(255, 255, 255), width=3)
    else:
        for i in range(4):
            x = 720 + i * 40; d.rounded_rectangle([x, 350, x + 28, 378], radius=5, fill=(70, 170, 100))
    d.line([(540, 210), (540, 370)], fill=(60, 60, 70), width=3)

def frame(T):
    im = Image.new('RGB', (W, H), (10, 10, 14))
    sc = home(T) if T < SWITCH else study(min(T, PUNCH) - SWITCH)
    fade = np.clip(np.linspace(5, 0, PH), 0, 1)[:, None] * np.ones((1, PW)); m = Image.fromarray((fade * 255).astype(np.uint8))
    tr = min(1, abs(T - SWITCH) / 0.3)  # dip to black around the scene change
    if tr < 1: sc = Image.blend(Image.new('RGB', (PW, PH), (10, 10, 14)), sc, tr)
    im.paste(sc, (0, PY), m)
    ref = sc.transpose(Image.FLIP_TOP_BOTTOM).crop((0, 0, PW, 300)).filter(ImageFilter.GaussianBlur(3))
    rm = Image.fromarray((np.linspace(70, 0, 300)[:, None] * np.ones((1, PW))).astype(np.uint8))
    im.paste(ref, (0, PY + 780 + 4), rm)
    hud(im, T)
    for tt, txt in EXCUSES:
        if tt <= T < tt + 2.6: bubble(im, 540, PY + 60, txt, T - tt, 'think', 0.5)
    if FINE <= T < GO + 1.0: bubble(im, 700, PY + 50, '...OKAY. FINE.', T - FINE, 'say', 0.22)
    if SWITCH + 0.6 <= T < SWITCH + 3.0: bubble(im, 470, PY + 70, 'WHY DID I ALMOST\nNOT COME?', T - SWITCH - 0.6, 'say', 0.45)
    if SWITCH + 3.0 <= T < PUNCH: bubble(im, 700, PY + 80, 'SAME TIME\nNEXT WEEK?', T - SWITCH - 3.0, 'say', 0.4)
    if T >= PUNCH:
        k = ease((T - PUNCH) / 0.5)
        im = Image.blend(im, Image.new('RGB', (W, H), (8, 8, 12)), 0.82 * k); d = ImageDraw.Draw(im)
        tv = T - PUNCH
        if T < VERSE:
            rows = [('MY EXCUSES?', (245, 245, 245), 0.2), ('VERY CONVINCING.', (240, 80, 80), 0.7),
                    ('"SAVING YOU A SEAT"?', (245, 245, 245), 1.6), ('MORE CONVINCING.', (247, 184, 58), 2.1)]
            for i, (txt, col, st) in enumerate(rows):
                a = ease((tv - st) / 0.3)
                if a <= 0: continue
                f = MONT(70); tw = d.textlength(txt, font=f)
                d.text(((W - tw) / 2, 790 + i * 100 + (i >= 2) * 60 + (1 - a) * 20), txt, font=f, fill=mix((8, 8, 12), col, a))
        else:
            a = ease((T - VERSE) / 0.8); fv = ImageFont.truetype(f'{FD}/lora-latin-500-italic.ttf', 54)
            for i, l in enumerate(['"See how good and how pleasant it is', 'for brothers to live together in unity!"']):
                tw = d.textlength(l, font=fv); d.text(((W - tw) / 2, 860 + i * 76), l, font=fv, fill=mix((8, 8, 12), (235, 235, 235), a))
            r = 'PSALM 133:1'; fr = INTER('700', 34); tw = d.textlength(r, font=fr)
            d.text(((W - tw) / 2, 1040), r, font=fr, fill=mix((8, 8, 12), (247, 184, 58), ease((T - VERSE - 0.6) / 0.6)))
    return np.asarray(im)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if CHECK:
        for s in CHECK.split(','): Image.fromarray(frame(float(s))).save(f'{OUT}/check_{s}.jpg', quality=88)
        sys.exit()
    segs = [('a', 0, BUZZ), ('b', BUZZ, SWITCH), ('c', SWITCH, PUNCH), ('d', PUNCH, VERSE), ('e', VERSE, TOTAL)]; parts = []
    for name, a, b in segs:
        tmp = f'{OUT}/{name}.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for fi in range(int(round((b - a) * FPS))): p.stdin.write(frame(a + fi / FPS).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, f'{OUT}/{name}.mp4'); parts.append(f'{name}.mp4')
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{x}'\n" for x in parts)); print('parts', parts)
