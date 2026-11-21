#!/usr/bin/env python3
"""Screen time vs time with friends (Junko format): couch at night, phone glow, screen time climbing while snacks pile up,
a Bible Meet notification from Abby (coffee + a walk tomorrow?), then a sunny park bench with coffee, punchline card,
verse (Psalm 90:12). app: notif.
usage: python3 screen-time.py <outdir> [check t1,t2,..]   -> <outdir>/a.mp4..e.mp4 + list.txt (silent)."""
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

THOUGHTS = [(1.0, 'JUST ONE\nMORE VIDEO.'), (3.6, 'WATCHING STRANGERS\nHAVE BRUNCH.'),
            (6.2, 'SAVED 40 REELS\nABOUT FRIENDSHIP.'), (8.8, 'WHY AM I\nSTILL LONELY?')]
SCREEN = [(2, 14), (3, 48), (5, 26), (7, 19)]
BUZZ, SCENE2, PUNCH, VERSE, TOTAL = 11.6, 16.0, 22.8, 26.8, 30.4
PICK = BUZZ + 1.0
CHATS = [(16.7, 'HOW ARE YOU\nREALLY DOING?', '20 MIN'), (18.0, 'SAME TIME\nNEXT WEEK?', '1 HR'), (19.3, 'YOUR COFFEE\nGOT COLD. AGAIN.', '2 HRS')]

def glow_finish(im, glow, amt=0.6):
    gs = glow.filter(ImageFilter.GaussianBlur(12)).resize(im.size, Image.BILINEAR)
    return Image.fromarray(np.clip(np.asarray(im, np.float32) + np.asarray(gs, np.float32) * amt, 0, 255).astype(np.uint8))

def nthought(t): return sum(1 for tt, _ in THOUGHTS if t >= tt + 0.3)

def couch_night(t):
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); k4 = SS / 4
    def G(x, y, r, c): ImageDraw.Draw(glow).ellipse([(x - r) * k4, (y - r) * k4, (x + r) * k4, (y + r) * k4], fill=c)
    late = ease(t / 10)
    im.paste(vgrad(PW * SS, FL * SS, mix((74, 84, 120), (40, 46, 78), late), mix((60, 68, 100), (30, 34, 60), late)), (0, 0))
    im.paste(vgrad(PW * SS, (PH - FL) * SS, (46, 50, 74), (24, 26, 40)), (0, FL * SS))
    d.rect([0, FL - 6, PW, FL + 4], (34, 38, 58))
    # window: dusk -> deep night
    S.window(d, 760, 120, 250, 290, (44, 52, 84), mix((90, 80, 130), (14, 18, 40), late), mix((200, 130, 120), (40, 50, 90), late), t,
             night=late > 0.4, panel=im)
    # shelf with books + a dusty plant
    d.rect([90, 230, 400, 246], (44, 50, 78))
    xx = 104
    for bw, bh, bc in [(26, 80, (90, 70, 120)), (22, 70, (70, 110, 120)), (30, 86, (140, 80, 70)), (20, 64, (190, 160, 90)), (28, 78, (80, 120, 90))]:
        d.rect([xx, 230 - bh, xx + bw, 230], mix(bc, (40, 50, 80), 0.45), r=3); xx += bw + 4
    S.plant(d, 350, 230, (90, 96, 130), (60, 100, 110), t)
    S.frames_on_wall(d, [(470, 150, 120, 96, (44, 52, 84), (70, 86, 130))])
    # wall clock with hands spinning (time-lapse)
    d.cap(650, 190, 46, (44, 52, 84)); d.cap(650, 190, 38, (210, 214, 228))
    a1 = t * 2.4; a2 = t * 0.2
    d.line([(650, 190), (650 + 30 * math.sin(a1), 190 - 30 * math.cos(a1))], (40, 44, 60), 4)
    d.line([(650, 190), (650 + 20 * math.sin(a2), 190 - 20 * math.cos(a2))], (40, 44, 60), 6)
    # couch
    cc, cd_ = (64, 76, 120), (50, 60, 98)
    d.rect([170, 440, 700, 620], cd_, r=50); d.rect([130, 540, 230, 760], cc, r=34); d.rect([640, 540, 740, 760], cc, r=34)
    d.rect([180, 610, 690, 720], cc, r=30); d.rect([200, 718, 220, 780], (30, 34, 52)); d.rect([650, 718, 670, 780], (30, 34, 52))
    # cushion
    d.rect([210, 560, 300, 630], (120, 90, 140), r=22)
    # coffee table (right) with snacks piling up per thought
    d.rect([760, 690, 1040, 716], (44, 50, 78), r=8); d.rect([780, 716, 796, 780], (34, 38, 60)); d.rect([1004, 716, 1020, 780], (34, 38, 60))
    n = nthought(t)
    d.rect([790, 652, 826, 690], (150, 160, 190), r=6)  # cold mug
    if n >= 1: d.poly([(850, 690), (862, 640), (912, 636), (924, 690)], (220, 80, 70)); d.text((866, 655), 'CHIPS', MONT(15 * SS), (255, 230, 180))
    if n >= 2: d.rect([940, 650, 1010, 690], (240, 236, 226), r=4); d.poly([(940, 650), (975, 630), (1010, 650)], (220, 214, 200)); d.cap(975, 668, 7, (200, 60, 50))
    if n >= 3: d.rect([800, 620, 832, 652], (170, 140, 200), r=6)  # 2nd mug stacked
    if n >= 4:
        for i in range(3): d.ell([860 + i * 30, 690 - 10, 884 + i * 30, 690], (230, 190, 110))
    # blanket over her legs
    picked = t >= PICK
    sad = t < PICK + 0.4
    hand = S.person(d, 420, 660, 200, None, 'sit', 'sad' if sad else 'smile', None, ('long', None), t, 1, 'phone',
                    head_tilt=0.1 + 0.08 * ease(t / 10) if sad else 0.0)
    d.rect([330, 640, 560, 720], (110, 150, 170), r=30); d.rect([330, 640, 560, 660], (130, 170, 190), r=20)
    for k in range(4): d.line([(355 + k * 55, 646), (370 + k * 55, 714)], (96, 134, 152), 4)
    if hand:
        lit = (255, 244, 222) if t >= BUZZ else (210, 230, 255)
        jit = math.sin(t * 90) * 3 if BUZZ <= t < PICK else 0
        d.rect([hand[0] - 26 + jit, hand[1] - 44, hand[0] + 26 + jit, hand[1] + 34], (30, 30, 40), r=9)
        d.rect([hand[0] - 21 + jit, hand[1] - 38, hand[0] + 21 + jit, hand[1] + 28], (120, 200, 255) if t < BUZZ else (255, 214, 140), r=6)
        fl = 0.8 + 0.2 * math.sin(t * 11) * math.sin(t * 3.1)
        col = (int(120 * fl), int(90 * fl), int(50 * fl)) if t >= BUZZ else (int(40 * fl), int(70 * fl), int(150 * fl))
        G(hand[0], hand[1] + 6, 64, col)
    out = glow_finish(im, glow, 0.6)
    if t >= BUZZ:
        db = D(out); kk = ease((t - BUZZ) / 0.4) * (1 - ease((t - BUZZ - 3.0) / 0.4))
        S.notif(db, out, 220, 50, kk, 'Abby', "coffee + a walk tomorrow? i'll pick you up")
    return out.resize((PW, PH), Image.LANCZOS)

def park(t):
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); k4 = SS / 4
    def G(x, y, r, c): ImageDraw.Draw(glow).ellipse([(x - r) * k4, (y - r) * k4, (x + r) * k4, (y + r) * k4], fill=c)
    tt = t - SCENE2
    im.paste(vgrad(PW * SS, FL * SS, (130, 190, 236), (255, 222, 170)), (0, 0))
    d.cap(880, 150, 60, (255, 242, 200)); G(880, 150, 200, (200, 160, 80))
    for i, cx in enumerate((160, 470, 760)):
        cx2 = cx + (t * 9 * (1 + i * 0.3)) % 80
        for dx, rr in ((-40, 32), (0, 44), (42, 34)): d.cap(cx2 + dx, 100 + i * 34, rr, (255, 250, 245))
    # far hills + grass
    d.ell([-200, 470, 700, 820], (150, 196, 120)); d.ell([400, 500, 1300, 840], (136, 186, 110))
    d.rect([0, 640, PW, PH], (126, 176, 98))
    # pond with ducks
    d.ell([620, 700, 1060, 800], (110, 170, 210)); d.ell([660, 712, 1020, 760], (150, 200, 230))
    for i in range(2):
        dx = 760 + i * 120 + math.sin(t * 0.8 + i) * 14
        d.ell([dx - 18, 734, dx + 18, 756], (250, 250, 250)); d.cap(dx + 14, 730, 9, (250, 250, 250)); d.poly([(dx + 22, 728), (dx + 32, 732), (dx + 22, 735)], (240, 160, 60))
    # trees (autumn)
    for tx, sc in ((80, 1.0), (1000, 0.9)):
        d.rect([tx - 12 * sc, 380, tx + 12 * sc, 650], (110, 70, 44))
        for dx, dy, rr in ((0, 330, 90), (-55, 380, 66), (55, 380, 66)): d.cap(tx + dx * sc, dy + (1 - sc) * 60, rr * sc, (232, 150, 70) if tx != 560 else (220, 120, 60))
    # path
    d.poly([(0, 840), (PW, 800), (PW, 880), (0, 930)], (214, 196, 168))
    # background walker with a dog
    wx = 790 + tt * 62
    if -100 < wx < 1200:
        S.person(d, wx, 640, 70, (140, 110, 190), 'walk', 'smile', None, ('bob', None), t, 7, 'lap')
        d.line([(wx + 10, 600), (wx + 50, 628)], (60, 50, 40), 2)
        d.ell([wx + 44, 620, wx + 80, 640], (170, 120, 80)); d.cap(wx + 82, 618, 9, (170, 120, 80))
    # falling leaves
    for i in range(10):
        lx = (i * 107 + t * 30 * (1 + i % 3)) % PW; ly = (i * 71 + t * 70) % (PH - 100)
        ang = t * 3 + i; d.poly([(lx, ly), (lx + 14 * math.cos(ang), ly + 8), (lx + 4, ly + 16)], (236, 140, 60) if i % 2 else (210, 90, 50))
    # bench
    d.rect([210, 662, 720, 690], (150, 96, 60), r=6); d.rect([210, 560, 720, 586], (150, 96, 60), r=6); d.rect([210, 600, 720, 626], (150, 96, 60), r=6)
    for bx in (240, 680): d.rect([bx, 690, bx + 16, 790], (60, 56, 56)); d.rect([bx, 560, bx + 16, 690], (60, 56, 56))
    # her (left, upright, laughing) + Abby (green top, right), both holding coffee
    laughing = (tt % 2.6) < 1.3
    h1 = S.person(d, 360, 690, 180, None, 'sit', 'laugh' if laughing else 'smile', None, ('long', None), t, 1, 'phone', head_tilt=0.12)
    h2 = S.person(d, 580, 690, 180, (90, 160, 110), 'sit', 'smile', None, ('bun', None), t, 2, 'phone', head_tilt=-0.14)
    for h in (h1, h2):
        if h:
            d.rect([h[0] - 20, h[1] - 34, h[0] + 20, h[1] + 20], (245, 240, 232), r=5); d.rect([h[0] - 20, h[1] - 14, h[0] + 20, h[1] + 4], (180, 120, 80))
            d.rect([h[0] - 22, h[1] - 40, h[0] + 22, h[1] - 30], (90, 70, 60), r=3)
            for k in range(2):
                sy = (t * 22 + k * 12) % 30
                d.line([(h[0] - 5 + k * 10, h[1] - 48 - sy), (h[0] - 9 + k * 10, h[1] - 66 - sy)], (255, 255, 255), 3)
    # her phone face-down on the bench
    d.rect([650, 652, 700, 664], (40, 40, 50), r=3)
    return glow_finish(im, glow, 0.5).resize((PW, PH), Image.LANCZOS)

def room(t):
    return couch_night(t) if t < SCENE2 else park(t)

def bubble(im, cx, y, text, k, kind='think', tail=0.5):
    if k <= 0: return
    d = ImageDraw.Draw(im); f = MONT(44); lines = text.split('\n')
    tw = max(d.textlength(l, font=f) for l in lines); w, h = tw + 76, 58 * len(lines) + 48
    sc = 0.6 + 0.4 * ease(k / 0.6) + 0.06 * math.sin(min(k, 1) * math.pi)
    lay = Image.new('RGBA', (int(w + 20), int(h + 80)), (0, 0, 0, 0)); L = ImageDraw.Draw(lay)
    if kind == 'think': fill, ol = (255, 255, 255), (232, 96, 120)
    else: fill, ol = (247, 184, 58), (40, 30, 20)
    L.rounded_rectangle([6, 6, w + 6, h + 6], radius=34, fill=fill, outline=ol, width=6)
    for i, l in enumerate(lines):
        lw = L.textlength(l, font=f); L.text((6 + (w - lw) / 2, 30 + i * 58), l, font=f, fill=(24, 22, 26))
    if kind == 'think':
        for cx2, cy2, r in ((w * tail, h + 26, 13), (w * tail - w * 0.05, h + 56, 8)): L.ellipse([cx2 - r, cy2 - r, cx2 + r, cy2 + r], fill=fill, outline=ol, width=4)
    else:
        tx = w * tail; L.polygon([(tx - 18, h + 2), (tx + 18, h + 2), (tx - 4, h + 44)], fill=fill)
        L.line([(tx - 18, h + 6), (tx - 4, h + 44), (tx + 18, h + 6)], fill=ol, width=6)
    lay = lay.resize((max(1, int(lay.width * sc)), max(1, int(lay.height * sc))), Image.LANCZOS)
    im.paste(lay, (int(cx - lay.width / 2), int(y)), lay)

def friend_time(t):
    v, n = '0 MIN', 0
    for i, (tt, _, val) in enumerate(CHATS):
        if t >= tt + 0.3: v, n = val, i + 1
    if t >= 21.3: n = 4
    return v, n

def hud(im, t):
    d = ImageDraw.Draw(im); n = nthought(t)
    if t < SCENE2 + 0.4:
        hh, mm = SCREEN[n - 1] if n else (1, 2)
        if n < 4 and t < THOUGHTS[-1][0] + 0.3:
            nh, nm = SCREEN[n]; tt = THOUGHTS[n][0]
            if t >= tt - 1.0:
                a = hh * 60 + mm; b = nh * 60 + nm; m = int(lerp(a, b, ease((t - tt + 1.0) / 1.3))); hh, mm = m // 60, m % 60
        lval, lcol = f'{hh}H {mm:02d}M', (240, 80, 80)
    else: lval, lcol = '0H 12M', (90, 220, 120)
    rv, rn = friend_time(t)
    rcol = (240, 80, 80) if rn == 0 else (90, 220, 120)
    for cx, lab in ((290, 'SCREEN TIME'), (790, 'TIME WITH FRIENDS')):
        f = PIX(30); tw = d.textlength(lab, font=f); d.text((cx - tw / 2, 200), lab, font=f, fill=(150, 150, 160))
    def pulse(ts):
        m = min([abs(t - x) for x in ts] + [9]); return 1 + 0.25 * max(0, 1 - m / 0.25)
    lp = pulse([tt + 0.3 for tt, _ in THOUGHTS] + [SCENE2 + 0.4]); rp = pulse([c[0] + 0.3 for c in CHATS])
    f = MONT(80 * lp); tw = d.textlength(lval, font=f); d.text((290 - tw / 2, 245 - (lp - 1) * 40), lval, font=f, fill=lcol)
    f = MONT(80 * rp); tw = d.textlength(rv, font=f); d.text((790 - tw / 2, 245 - (rp - 1) * 40), rv, font=f, fill=rcol)
    for i in range(4):
        x = 210 + i * 40; on = i < n and t < SCENE2
        d.rounded_rectangle([x, 350, x + 28, 378], radius=5, fill=(200, 60, 70) if on else (50, 50, 60))
    for i in range(4):
        x = 710 + i * 40; ok = i < rn
        d.rounded_rectangle([x, 350, x + 28, 378], radius=5, fill=(70, 170, 100) if ok else (50, 50, 60))
    d.line([(540, 210), (540, 370)], fill=(60, 60, 70), width=3)

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
    for tt, txt in THOUGHTS:
        if tt <= T < tt + 2.4: bubble(im, 560, PY + 120, txt, T - tt, 'think', 0.2)
    if PICK + 0.6 <= T < SCENE2 - 0.3: bubble(im, 640, PY + 260, '...YES?', T - PICK - 0.6, 'say', 0.15)
    if SCENE2 <= T < PUNCH:
        pos = [(720, PY + 150, 0.25), (720, PY + 150, 0.25), (720, PY + 150, 0.25)]
        for (tt, txt, _), (cx, y, tl) in zip(CHATS, pos):
            if tt <= T < tt + 1.25: bubble(im, cx, y, txt, T - tt, 'say', tl)
        if T >= 21.0: bubble(im, 330, PY + 150, 'BEST 2 HOURS\nALL WEEK.', T - 21.0, 'think', 0.45)
    if T >= PUNCH:
        k = ease((T - PUNCH) / 0.5)
        im = Image.blend(im, Image.new('RGB', (W, H), (8, 8, 12)), 0.82 * k); d = ImageDraw.Draw(im)
        tv = T - PUNCH
        if T < VERSE:
            rows = [('7 HOURS OF REELS?', (245, 245, 245), 0.2), ('STILL LONELY.', (240, 80, 80), 0.7),
                    ('ONE COFFEE WITH A FRIEND?', (245, 245, 245), 1.6), ('FULL CUP. FULL HEART.', (247, 184, 58), 2.1)]
            for i, (txt, col, st) in enumerate(rows):
                a = ease((tv - st) / 0.3)
                if a <= 0: continue
                fs = 72
                while d.textlength(txt, font=MONT(fs)) > 960: fs -= 2
                f = MONT(fs); tw = d.textlength(txt, font=f)
                d.text(((W - tw) / 2, 790 + i * 100 + (i >= 2) * 60 + (1 - a) * 20), txt, font=f, fill=mix((8, 8, 12), col, a))
        else:
            a = ease((T - VERSE) / 0.8); fv = ImageFont.truetype(f'{FD}/lora-latin-500-italic.ttf', 58)
            for i, l in enumerate(['"So teach us to count our days,', 'that we may gain', 'a heart of wisdom."']):
                tw = d.textlength(l, font=fv); d.text(((W - tw) / 2, 820 + i * 82), l, font=fv, fill=mix((8, 8, 12), (235, 235, 235), a))
            r = 'PSALM 90:12'; fr = INTER('700', 34); tw = d.textlength(r, font=fr)
            d.text(((W - tw) / 2, 1090), r, font=fr, fill=mix((8, 8, 12), (247, 184, 58), ease((T - VERSE - 0.6) / 0.6)))
    return np.asarray(im)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if CHECK:
        for s in CHECK.split(','): Image.fromarray(frame(float(s))).save(f'{OUT}/check_{s}.jpg', quality=88)
        sys.exit()
    segs = [('a', 0, BUZZ), ('b', BUZZ, SCENE2), ('c', SCENE2, PUNCH), ('d', PUNCH, VERSE), ('e', VERSE, TOTAL)]; parts = []
    for name, a, b in segs:
        tmp = f'{OUT}/{name}.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for fi in range(int(round((b - a) * FPS))): p.stdin.write(frame(a + fi / FPS).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, f'{OUT}/{name}.mp4'); parts.append(f'{name}.mp4')
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{x}'\n" for x in parts)); print('parts', parts)
