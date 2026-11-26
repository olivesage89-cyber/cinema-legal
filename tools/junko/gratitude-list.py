#!/usr/bin/env python3
"""Gratitude list (Junko format): dorm room at dusk. She sits on her bed with a journal: "THANKFUL FOR:" ...and gets
stuck on "coffee" and "wifi". Friend Mia's notification ("random but i thank God for you. like, a lot.") -> "...OH." ->
she starts writing and can't stop (Mia, roommate, the girls at bible study...) -> fills both pages -> "...coffee stays
on the list though." HUD: TIME 7:02 -> 7:33 PM (staring) + THINGS I'M THANKFUL FOR x0 -> x2 -> x14.
Punchline card, verse (Philippians 1:3, WEB). app: notif.
usage: python3 gratitude-list.py <outdir> [check t1,t2,..]  -> <outdir>/a.mp4..e.mp4 + list.txt (silent)."""
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

NOTIF, OH, PUNCH, VERSE, TOTAL = 10.3, 11.3, 21.2, 25.4, 30.0
ADD = [3.9, 6.5] + [12.6 + i * 0.42 for i in range(12)]      # x1 coffee, x2 wifi, then x3..x14 after the text
MX, SY = 690, 800                                             # she sits on the bed edge
PHONE = (900, 726)                                            # phone lying on the bed
THINK = [(0.8, 'OK. GRATITUDE LIST.\nSHOULD BE EASY.'), (3.4, 'THANKFUL FOR...\nCOFFEE.'),
         (6.0, 'IS WIFI A BLESSING?\nASKING FOR ME.'), (8.4, 'WHY IS THIS\nSO HARD.')]
SAYS = [(OH, '...OH.', 'me'), (13.0, 'MIA. HER COFFEE RUNS.\nHER 7AM VOICE MEMOS.', 'think'),
        (15.6, 'MY ROOMMATE. THE GIRLS\nAT BIBLE STUDY.', 'think'), (18.3, '...COFFEE STAYS ON\nTHE LIST THOUGH.', 'think')]
END_SAY = PUNCH - 0.3
ZX, ZY, ZW = 90, 60, 900
def sx(x): return (x - ZX) * PW / ZW

def nthank(t): return sum(1 for a in ADD if t >= a)
def clock(t):
    m = 2 + int(min(t, NOTIF) / NOTIF * 31) + (int((t - NOTIF) / 1.4) if t > NOTIF else 0)
    return f'7:{m:02d} PM'

def room(t):
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); gd = ImageDraw.Draw(glow); k4 = SS / 4
    def G(x, y, r, c): gd.ellipse([(x - r) * k4, (y - r) * k4, (x + r) * k4, (y + r) * k4], fill=c)
    warm = ease((t - OH) / 2.0)                    # room warms up once she starts writing
    FLOOR = 660
    im.paste(vgrad(PW * SS, FLOOR * SS, mix((176, 168, 200), (214, 190, 196), warm), mix((150, 142, 178), (192, 166, 172), warm)), (0, 0))
    im.paste(vgrad(PW * SS, (PH - FLOOR) * SS, (120, 116, 140), (88, 84, 106)), (0, FLOOR * SS))
    # painted cinder-block wall (dorm)
    bl = mix((160, 152, 186), (198, 174, 182), warm)
    for r_ in range(13):
        y = 40 + r_ * 48; d.line([(0, y), (PW, y)], bl, 2)
        for c_ in range(9):
            x = c_ * 128 + (64 if r_ % 2 else 0); d.line([(x, y), (x, y + 48)], bl, 2)
    d.rect([0, FLOOR - 8, PW, FLOOR + 4], (110, 104, 130))
    for k in range(8):   # floor tiles
        d.line([(k * 150 - 30, FLOOR + 4), (k * 190 - 250, PH)], (104, 100, 124), 2)
    d.line([(0, 760), (PW, 760)], (104, 100, 124), 2); d.line([(0, 880), (PW, 880)], (104, 100, 124), 2)
    # window with dusk over campus
    wx, wy, ww, wh = 330, 120, 250, 280
    g = vgrad(int(ww * SS), int(wh * SS), (98, 92, 160), (250, 160, 120)); im.paste(g, (int(wx * SS), int(wy * SS)))
    d.cap(wx + 70, wy + 60, 3, (255, 250, 230)); d.cap(wx + 190, wy + 40, 2, (255, 250, 230))
    for (bx, bw, bh) in ((wx + 10, 90, 90), (wx + 120, 120, 70)):    # campus buildings
        d.rect([bx, wy + wh - bh, bx + bw, wy + wh], (70, 62, 104))
        for r_ in range(2):
            for c_ in range(int(bw / 30)):
                lit = (r_ * 3 + c_ * 7) % 4 != 0
                d.rect([bx + 10 + c_ * 30, wy + wh - bh + 16 + r_ * 32, bx + 24 + c_ * 30, wy + wh - bh + 32 + r_ * 32], (255, 214, 140) if lit else (90, 80, 120))
    d.rect([wx + 105, wy + wh - 120, wx + 117, wy + wh - 70], (70, 62, 104)); d.poly([(wx + 95, wy + wh - 120), (wx + 111, wy + wh - 150), (wx + 127, wy + wh - 120)], (70, 62, 104))
    d.cap(wx + 200, wy + wh - 110, 34, (60, 80, 84)); d.rect([wx + 196, wy + wh - 90, wx + 204, wy + wh - 70], (60, 50, 60))
    d.rect([wx, wy, wx + ww, wy + wh], None, r=4, outline=(244, 240, 236), width=12)
    d.line([(wx + ww / 2, wy), (wx + ww / 2, wy + wh)], (244, 240, 236), 7)
    d.rect([wx - 16, wy + wh, wx + ww + 16, wy + wh + 16], (244, 240, 236), r=3)
    S.plant(d, wx + 40, wy + wh, (236, 170, 140), (96, 156, 100), t)
    # desk (left): lamp, books, closed laptop, mug, mini fridge under
    d.rect([130, 540, 370, 566], (176, 132, 96), r=8); d.rect([144, 566, 160, 660], (140, 100, 72)); d.rect([340, 566, 356, 660], (140, 100, 72))
    d.rect([180, 580, 300, 660], (236, 236, 240), r=8); d.rect([188, 596, 194, 630], (190, 190, 196), r=2)   # mini fridge
    d.rect([166, 380, 174, 540], (90, 70, 60)); d.poly([(130, 380), (210, 380), (196, 330), (144, 330)], (255, 226, 160))
    G(170, 400, 130, (120, 90, 45))
    for i, (bh, bc) in enumerate(((22, (90, 120, 170)), (18, (200, 110, 90)), (26, (110, 150, 110)))):
        y0 = 540 - sum(b[0] for b in ((22,), (18,), (26,))[:i + 1]); d.rect([220, y0, 320 - i * 8, y0 + bh], bc, r=3)
    d.rect([298, 516, 330, 540], (244, 220, 120), r=5); d.arc([322, 520, 342, 536], 270, 90, (244, 220, 120), 5)
    # pennant + cork board with polaroids above the bed
    d.poly([(640, 140), (640, 210), (800, 175)], (200, 80, 80)); d.rect([632, 132, 642, 218], (120, 84, 60))
    d.rect([820, 120, 1010, 300], (196, 150, 104), r=6, outline=(150, 108, 70), width=8)
    for (px, py, pc) in ((840, 140, (150, 196, 230)), (920, 150, (240, 190, 140)), (850, 220, (180, 220, 170)), (930, 225, (230, 170, 190))):
        d.rect([px, py, px + 62, py + 62], (252, 250, 246), r=2); d.rect([px + 6, py + 6, px + 56, py + 44], pc)
        d.cap(px + 31, py + 6, 5, (220, 70, 70))
    S.string_lights(d, type('GL', (), {'cap': staticmethod(lambda x, y, r, c: G(x, y, r, tuple(int(v * (0.5 + 0.5 * warm)) for v in c)))}), 600, 1040, 330, t)
    # bed (right, along the wall)
    d.rect([480, 600, 1060, 734], (130, 110, 150), r=20)                 # wall-side bed frame / headboard
    d.rect([490, 726, 1060, 806], (250, 246, 238), r=18)                  # mattress
    d.rect([490, 790, 1060, 846], (150, 112, 90), r=10)                   # frame
    for lx in (510, 1030): d.rect([lx, 846, lx + 18, 880], (120, 86, 66))
    d.rect([920, 664, 1060, 734], (255, 252, 246), r=26)                  # pillow
    QL, QL2 = mix((120, 150, 200), (226, 150, 130), warm), mix((100, 128, 180), (204, 126, 108), warm)
    d.rect([760, 712, 1060, 800], QL, r=30)                               # quilt
    for k in range(4): d.line([(790 + k * 70, 718), (790 + k * 70, 796)], QL2, 4)
    d.line([(770, 756), (1060, 756)], QL2, 4)
    # rug
    d.ell([300, 900, 860, 990], (200, 140, 150))
    # phone on the bed
    ring = NOTIF <= t < NOTIF + 1.0
    jig = math.sin(t * 70) * 3 if ring else 0
    d.rect([PHONE[0] - 28 + jig, PHONE[1] - 10, PHONE[0] + 28 + jig, PHONE[1] + 8], (30, 30, 36), r=5)
    lit = NOTIF <= t < NOTIF + 3.0
    d.rect([PHONE[0] - 24 + jig, PHONE[1] - 7, PHONE[0] + 24 + jig, PHONE[1] + 4], (236, 244, 255) if lit else (60, 64, 80), r=3)
    if lit:
        G(PHONE[0], PHONE[1], 60, (70, 90, 130))
        if ring:
            for k in range(2): d.arc([PHONE[0] - 46 - k * 16, PHONE[1] - 34 - k * 16, PHONE[0] + 46 + k * 16, PHONE[1] + 30 + k * 16], 200, 340, (70, 60, 90), 4)
    # her
    if t < NOTIF: mood, tilt = 'sad', 0.10 + (0.05 if t > 8.2 else 0)
    elif t < OH: mood, tilt = 'flat', -0.1 + 0.18 * math.sin((t - NOTIF) * 28) * max(0, 1 - (t - NOTIF) / 0.6)   # looks at phone
    elif t < 18.2: mood, tilt = 'smile', 0.05
    else: mood, tilt = 'laugh', 0.08 * math.sin(t * 14)
    pop = 1 + 0.07 * math.sin(min(1, max(0, t - NOTIF) / 0.35) * math.pi) if t >= NOTIF else 1
    hd = S.person(d, MX, SY, 170 * pop, None, 'sit', mood, None, ('long', None), t, 1, 'phone', head_tilt=tilt)
    # open journal in her hands
    bx, by = hd
    d.rect([bx - 66, by - 40, bx + 66, by + 18], (90, 120, 110), r=6)
    d.rect([bx - 60, by - 36, bx - 2, by + 12], (252, 248, 236), r=3); d.rect([bx + 2, by - 36, bx + 60, by + 12], (252, 248, 236), r=3)
    n = nthank(t)
    for k in range(min(n, 7)):
        L = 40 - (k * 13) % 14
        d.line([(bx - 54, by - 30 + k * 6.4), (bx - 54 + L, by - 30 + k * 6.4)], (70, 80, 110), 2)
    for k in range(max(0, n - 7)):
        L = 40 - (k * 11) % 14
        d.line([(bx + 8, by - 30 + k * 6.4), (bx + 8 + L, by - 30 + k * 6.4)], (70, 80, 110), 2)
    if n >= 2 and t < NOTIF:   # crossed-out "wifi"
        d.line([(bx - 56, by - 23.6), (bx - 10, by - 23.6)], (210, 70, 70), 2)
    # pen moving while writing
    writing = any(a - 0.35 <= t < a for a in ADD)
    px = bx + (20 if n >= 7 else -24) + (math.sin(t * 22) * 10 if writing else 0)
    py = by - 26 + (min(n, 13) % 7) * 6.4
    d.line([(px, py), (px + 16, py - 34)], (40, 40, 50), 4)
    G(bx, by - 10, 60, tuple(int(v * (0.2 + 0.4 * warm)) for v in (140, 110, 60)))
    gs = glow.filter(ImageFilter.GaussianBlur(12)).resize(im.size, Image.BILINEAR)
    im = Image.fromarray(np.clip(np.asarray(im, np.float32) + np.asarray(gs, np.float32) * 0.55, 0, 255).astype(np.uint8))
    z = 1 + 0.04 * min(t, PUNCH) / PUNCH; cw = ZW / z; x0 = ZX + (ZW - cw) / 2; y0 = ZY + (ZW - cw) / 2
    im = im.crop((int(x0 * SS), int(y0 * SS), int((x0 + cw) * SS), int((y0 + cw) * SS))).resize((PW * SS, PH * SS), Image.LANCZOS)
    db = D(im)
    if NOTIF <= t < NOTIF + 3.4:
        kk = ease((t - NOTIF) / 0.4) * (1 - ease((t - NOTIF - 3.0) / 0.4))
        S.notif(db, im, 220, 36, kk, 'Mia', 'random but i thank God for you. like, a lot.')
    return im.resize((PW, PH), Image.LANCZOS)

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
    n = nthank(t)
    good = t >= ADD[2]
    tcol = (240, 80, 80) if t < OH else (90, 220, 120)
    tf = min(6, int(min(t, NOTIF) / NOTIF * 6.99))
    tsq = [(240, 80, 80) if i < tf else (50, 50, 60) for i in range(6)] if t < OH else [(70, 170, 100)] * 6
    Lh = ('TIME', clock(t), tcol, pulse([NOTIF]), tsq, 6)
    ncol = (90, 220, 120) if good else ((240, 80, 80) if n < 2 else (247, 184, 58))
    fill = round(n / 14 * 10)
    R = ("THINGS I'M THANKFUL FOR", f'x{n}', ncol, pulse(ADD), [((70, 170, 100) if good else (240, 80, 80)) if i < fill else (50, 50, 60) for i in range(10)], 10)
    for cx, (lab, val, col, pz, sq, nsq) in ((290, Lh), (790, R)):
        f = PIX(30); tw = d.textlength(lab, font=f); d.text((cx - tw / 2, 200), lab, font=f, fill=(150, 150, 160))
        f = MONT(80 * pz); tw = d.textlength(val, font=f); d.text((cx - tw / 2, 245 - (pz - 1) * 40), val, font=f, fill=col)
        x0 = cx - (nsq * 26 - 6) / 2
        for i in range(nsq):
            x = x0 + i * 26; d.rounded_rectangle([x, 352, x + 20, 372], radius=4, fill=sq[i])
    d.line([(540, 210), (540, 370)], fill=(60, 60, 70), width=3)

def frame(T):
    im = Image.new('RGB', (W, H), (10, 10, 14))
    sc = room(min(T, PUNCH))
    fade = np.clip(np.linspace(5, 0, PH), 0, 1)[:, None] * np.ones((1, PW)); m = Image.fromarray((fade * 255).astype(np.uint8))
    im.paste(sc, (0, PY), m)
    hud(im, T)
    BY = PY + 250
    for j, (tt, txt) in enumerate(THINK):
        end = THINK[j + 1][0] - 0.1 if j + 1 < len(THINK) else NOTIF - 0.1
        if tt <= T < end: bubble(im, sx(MX) - 60, BY, txt, T - tt, 'think', sx(MX))
    for j, (tt, txt, who) in enumerate(SAYS):
        end = SAYS[j + 1][0] - 0.1 if j + 1 < len(SAYS) else END_SAY
        if tt <= T < end: bubble(im, sx(MX) - 60, BY + (60 if txt == '...OH.' else 0), txt, T - tt, 'think' if who == 'think' else 'say', sx(MX))
    if T >= PUNCH:
        k = ease((T - PUNCH) / 0.5)
        im = Image.blend(im, Image.new('RGB', (W, H), (8, 8, 12)), 0.82 * k); d = ImageDraw.Draw(im)
        tv = T - PUNCH
        if T < VERSE:
            rows = [('MY GRATITUDE LIST?', (245, 245, 245), 0.2), ('STUCK ON WIFI.', (240, 80, 80), 0.7),
                    ('MY FRIENDS?', (245, 245, 245), 1.6), ('OUT OF PAGES.', (247, 184, 58), 2.1)]
            for i, (txt, col, st) in enumerate(rows):
                a = ease((tv - st) / 0.3)
                if a <= 0: continue
                fs = 72
                while d.textlength(txt, font=MONT(fs)) > 960: fs -= 2
                f = MONT(fs); tw = d.textlength(txt, font=f)
                d.text(((W - tw) / 2, 790 + i * 100 + (i >= 2) * 60 + (1 - a) * 20), txt, font=f, fill=mix((8, 8, 12), col, a))
        else:
            a = ease((T - VERSE) / 0.8); fv = ImageFont.truetype(f'{FD}/lora-latin-500-italic.ttf', 60)
            L = ['“I thank my God', 'whenever I remember you…”']
            for i, l in enumerate(L):
                tw = d.textlength(l, font=fv); d.text(((W - tw) / 2, 820 + i * 86), l, font=fv, fill=mix((8, 8, 12), (235, 235, 235), a))
            r = 'PHILIPPIANS 1:3'; fr = INTER('700', 34); tw = d.textlength(r, font=fr)
            d.text(((W - tw) / 2, 1040), r, font=fr, fill=mix((8, 8, 12), (247, 184, 58), ease((T - VERSE - 0.6) / 0.6)))
    return np.asarray(im)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if CHECK:
        for s in CHECK.split(','): Image.fromarray(frame(float(s))).save(f'{OUT}/check_{s}.jpg', quality=88)
        sys.exit()
    segs = [('a', 0, NOTIF), ('b', NOTIF, 15.5), ('c', 15.5, PUNCH), ('d', PUNCH, VERSE), ('e', VERSE, TOTAL)]; parts = []
    for name, a, b in segs:
        tmp = f'{OUT}/{name}.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for fi in range(int(round((b - a) * FPS))): p.stdin.write(frame(a + fi / FPS).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, f'{OUT}/{name}.mp4'); parts.append(f'{name}.mp4')
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{x}'\n" for x in parts)); print('parts', parts)
