#!/usr/bin/env python3
"""I'll pray for you (Junko format): sitting in her car in a grocery-store parking lot at dusk. HUD: TIMES I SAID "I'LL PRAY"
x1 -> x9 vs PRAYERS ACTUALLY PRAYED x0. Lena's notification ("interview in 10 min!! thank you for praying") -> she prays right
there in the car, all 9 (counter 0 -> 9) -> Lena: "I GOT THE JOB!!!". Punchline card, verse (James 5:16). app: notif.
usage: python3 pray-for-you.py <outdir> [check t1,t2,..]   -> <outdir>/a.mp4..e.mp4 + list.txt (silent)."""
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

SAID = [(0.8, 1, 'LENA\'S INTERVIEW?\n"I\'LL PRAY FOR YOU!"'), (3.6, 2, 'MOM\'S KNEE?\n"PRAYING, MOM!"'),
        (6.4, 3, 'SAM\'S BIG EXAM?\n"COVERED IN PRAYER!"'), (9.2, 9, '+6 PRAYING HANDS\nIN THE GROUP CHAT.')]
BUZZ, PRAY, CNT0, CNT1, JOB, PUNCH, VERSE, TOTAL = 12.0, 15.6, 16.0, 19.6, 20.0, 22.8, 27.0, 30.4
PRAYING = [(16.3, 'LENA\'S INTERVIEW.\nMOM\'S KNEE.'), (18.0, 'SAM\'S EXAM. AND THE\nWHOLE GROUP CHAT.')]
DX = 650  # driver x (viewer's right)
HX = (DX - 150) * 1080 / 800  # driver x on screen after zoom
WS = [(292, 362), (788, 362), (842, 612), (238, 612)]  # windshield
CAR, CAR2 = (86, 146, 156), (66, 120, 130)

def nsaid(t): return max([n for tt, n, _ in SAID if t >= tt + 0.3] + [0])
def nprayed(t): return 0 if t < CNT0 else min(9, 1 + int((t - CNT0) / ((CNT1 - CNT0) / 9)))

def room(t):
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); gd = ImageDraw.Draw(glow); k4 = SS / 4
    def G(x, y, r, c): gd.ellipse([(x - r) * k4, (y - r) * k4, (x + r) * k4, (y + r) * k4], fill=c)
    dusk = ease(t / 20)
    # sky
    im.paste(vgrad(PW * SS, 320 * SS, mix((236, 150, 120), (120, 90, 140), dusk), mix((250, 196, 140), (210, 130, 120), dusk)), (0, 0))
    d.cap(880, 250 + 40 * dusk, 46, (255, 214, 150))
    # store building
    d.rect([-10, 170, 1090, 620], (176, 150, 132)); d.rect([-10, 160, 1090, 186], (140, 116, 104))
    d.rect([330, 200, 750, 270], (60, 90, 80), r=10)
    f = MONT(46 * SS); tw = d.d.textlength('MARKET', font=f) / SS; d.text((540 - tw / 2, 205), 'MARKET', f, (255, 236, 190))
    G(540, 235, 170, (60, 50, 30))
    for i in range(6):
        x = 40 + i * 170
        d.rect([x, 320, x + 140, 560], (255, 226, 160)); d.rect([x, 320, x + 140, 560], None, outline=(110, 90, 80), width=6)
        d.line([(x + 70, 320), (x + 70, 560)], (110, 90, 80), 4)
        for j in range(3): d.rect([x + 12 + j * 42, 470 - (j % 2) * 30, x + 40 + j * 42, 560], mix((200, 90, 80), (90, 150, 110), j / 2), r=3)
        G(x + 70, 440, 120, (70, 56, 30))
    d.rect([-10, 560, 1090, 620], (150, 128, 114))
    # asphalt + lines
    im.paste(vgrad(PW * SS, (PH - 620) * SS, (88, 84, 96), (52, 50, 60)), (0, 620 * SS))
    for k in range(-2, 9): d.line([(k * 190 + 60, 640), (k * 190 - 40, 1080)], (220, 214, 200), 6)
    # lamp posts
    for lx in (90, 990):
        d.rect([lx - 7, 150, lx + 7, 700], (60, 60, 70)); d.rect([lx - 40, 140, lx + 40, 158], (60, 60, 70), r=6)
        d.ell([lx - 30, 152, lx + 30, 172], (255, 240, 200)); G(lx, 200, 90, tuple(int(v * dusk) for v in (120, 110, 70)))
    # ---- car interior (clipped to windshield)
    inner = im.copy(); di = D(inner)
    lit = ease((t - PRAY) / 0.6) * (1 - ease((t - PUNCH + 0.2) / 0.3))
    di.rect([200, 340, 880, 640], mix((40, 40, 54), (96, 80, 66), lit * 0.8))
    di.poly([(360, 372), (720, 372), (740, 452), (340, 452)], mix((150, 120, 130), (190, 140, 120), dusk * 0.3))  # rear window
    for sx in (430, DX):
        di.rect([sx - 72, 432, sx + 72, 640], mix((70, 66, 80), (120, 100, 84), lit * 0.6), r=30)
        di.rect([sx - 38, 396, sx + 38, 436], mix((76, 72, 86), (126, 106, 90), lit * 0.6), r=12)
    # character
    picked = t < PRAY or t >= JOB
    if t < BUZZ: mood, tilt, arm = 'flat', 0.0, 'phone'
    elif t < PRAY: mood, tilt, arm = 'flat', (0.25 * math.sin((t - BUZZ) * 30) * max(0, 1 - (t - BUZZ) / 0.6)), 'phone'
    elif t < JOB: mood, tilt, arm = 'closed', 0.0, 'pray'
    else: mood, tilt, arm = 'laugh', 0.12 * math.sin(t * 15), 'phone'
    sad = mood in ('flat',) and t < BUZZ
    hd = S.person(di, DX, 712, 170, None, 'sit', 'sad' if sad else ('smile' if mood == 'closed' else mood), None, ('long', None), t, 3, arm, head_tilt=tilt)
    if hd and picked:
        bright = t >= BUZZ - 0.05
        di.rect([hd[0] - 22, hd[1] - 36, hd[0] + 22, hd[1] + 28], (230, 240, 255) if bright else (170, 190, 230), r=7)
        G(hd[0], hd[1], 70 if bright else 45, (60, 90, 150) if bright else (30, 45, 80))
    # steering wheel
    di.ell([DX - 92, 592, DX + 92, 650], None, outline=(30, 30, 36), width=14)
    if lit > 0: G(540, 400, 230, tuple(int(v * lit) for v in (170, 120, 50)))
    m = Image.new('L', im.size); ImageDraw.Draw(m).polygon([(x * SS, y * SS) for x, y in WS], fill=255)
    im.paste(inner, (0, 0), m)
    # glass sheen
    sh = Image.new('L', im.size); sd = ImageDraw.Draw(sh)
    sd.polygon([(x * SS, y * SS) for x, y in WS], fill=26)
    for x0, w0 in ((330, 60), (430, 24), (700, 40)): sd.polygon([((x0) * SS, 362 * SS), ((x0 + w0) * SS, 362 * SS), ((x0 + w0 - 150) * SS, 612 * SS), ((x0 - 150) * SS, 612 * SS)], fill=40)
    sh = Image.fromarray((np.asarray(sh) * (np.asarray(m) > 0)).astype(np.uint8))
    im.paste((210, 225, 245), (0, 0), sh)
    # ---- car body
    d.rect([282, 326, 798, 366], CAR, r=20)
    d.line([(292, 362), (238, 612)], CAR, 22); d.line([(788, 362), (842, 612)], CAR, 22)
    for mx in (196, 884): d.rect([mx - 26, 516, mx + 26, 552], CAR2, r=10)
    d.poly([(222, 606), (858, 606), (900, 694), (180, 694)], mix(CAR, (255, 255, 255), 0.12))
    d.line([(400, 616), (380, 690)], CAR2, 3); d.line([(680, 616), (700, 690)], CAR2, 3)
    d.rect([170, 688, 910, 784], CAR, r=34)
    d.rect([412, 712, 668, 760], (44, 46, 52), r=12)
    for k in range(4): d.line([(424, 722 + k * 11), (656, 722 + k * 11)], (70, 72, 80), 3)
    for hx in (262, 818):
        d.ell([hx - 58, 708, hx + 58, 752], (255, 244, 206)); G(hx, 730, 70, tuple(int(v * dusk) for v in (130, 120, 80)))
    d.rect([160, 774, 920, 806], (56, 58, 66), r=12)
    d.rect([450, 778, 630, 802], (236, 236, 228), r=4)
    for wx in (210, 780): d.rect([wx, 800, wx + 92, 836], (24, 24, 28), r=10)
    # glow finish
    gs = glow.filter(ImageFilter.GaussianBlur(12)).resize(im.size, Image.BILINEAR)
    im = Image.fromarray(np.clip(np.asarray(im, np.float32) + np.asarray(gs, np.float32) * 0.6, 0, 255).astype(np.uint8))
    Z0, Z1 = (150, 110), 800  # zoom: crop 800x800 (1x coords) -> full panel
    im = im.crop((Z0[0] * SS, Z0[1] * SS, (Z0[0] + Z1) * SS, (Z0[1] + Z1) * SS)).resize((PW * SS, PH * SS), Image.LANCZOS)
    db = D(im)
    if BUZZ <= t < BUZZ + 3.0:
        kk = ease((t - BUZZ) / 0.4) * (1 - ease((t - BUZZ - 2.6) / 0.4))
        S.notif(db, im, 220, 36, kk, 'Lena', 'interview in 10 min!! thank you for praying')
    if JOB <= t:
        kk = ease((t - JOB) / 0.4) * (1 - ease((t - PUNCH + 0.3) / 0.3))
        S.notif(db, im, 220, 36, kk, 'Lena', 'I GOT THE JOB!!! your prayers worked')
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
    n, p = nsaid(t), nprayed(t)
    stepts = [CNT0 + i * (CNT1 - CNT0) / 9 for i in range(9)]
    L = ('TIMES I SAID "I\'LL PRAY"', f'x{n}', (247, 184, 58), pulse([tt + 0.3 for tt, _, _ in SAID]), [(247, 184, 58) if i < n else (50, 50, 60) for i in range(9)])
    rc = (240, 80, 80) if p == 0 else (90, 220, 120)
    R = ('PRAYERS ACTUALLY PRAYED', f'x{p}', rc, pulse(stepts + [tt + 0.45 for tt, _, _ in SAID]), [(70, 170, 100) if i < p else (50, 50, 60) for i in range(9)])
    for cx, (lab, val, col, pz, sq) in ((290, L), (790, R)):
        f = PIX(30); tw = d.textlength(lab, font=f); d.text((cx - tw / 2, 200), lab, font=f, fill=(150, 150, 160))
        f = MONT(80 * pz); tw = d.textlength(val, font=f); d.text((cx - tw / 2, 245 - (pz - 1) * 40), val, font=f, fill=col)
        for i in range(9):
            x = cx - 116 + i * 26; d.rounded_rectangle([x, 352, x + 20, 372], radius=4, fill=sq[i])
    d.line([(540, 210), (540, 370)], fill=(60, 60, 70), width=3)

def frame(T):
    im = Image.new('RGB', (W, H), (10, 10, 14))
    sc = room(min(T, PUNCH))
    fade = np.clip(np.linspace(5, 0, PH), 0, 1)[:, None] * np.ones((1, PW)); m = Image.fromarray((fade * 255).astype(np.uint8))
    im.paste(sc, (0, PY), m)
    hud(im, T)
    BY = PY + 110
    for j, (tt, _, txt) in enumerate(SAID):
        end = SAID[j + 1][0] - 0.1 if j + 1 < len(SAID) else BUZZ - 0.1
        if tt <= T < end: bubble(im, 600, BY, txt, T - tt, 'think', HX)
    if BUZZ + 3.0 <= T < PRAY + 0.5: bubble(im, 600, BY, '...PRAYING.\nRIGHT NOW. HERE.', T - BUZZ - 3.0, 'say', HX)
    for j, (tt, txt) in enumerate(PRAYING):
        end = PRAYING[j + 1][0] - 0.1 if j + 1 < len(PRAYING) else JOB - 0.1
        if tt <= T < end: bubble(im, 600, BY, txt, T - tt, 'think', HX)
    if T >= PUNCH:
        k = ease((T - PUNCH) / 0.5)
        im = Image.blend(im, Image.new('RGB', (W, H), (8, 8, 12)), 0.82 * k); d = ImageDraw.Draw(im)
        tv = T - PUNCH
        if T < VERSE:
            rows = [('"I\'LL PRAY FOR YOU"?', (245, 245, 245), 0.2), ('9 TIMES THIS WEEK.', (240, 80, 80), 0.7),
                    ('ACTUALLY PRAYING?', (245, 245, 245), 1.6), ('ALL 9. IN A PARKING LOT.', (247, 184, 58), 2.1)]
            for i, (txt, col, st) in enumerate(rows):
                a = ease((tv - st) / 0.3)
                if a <= 0: continue
                fs = 72
                while d.textlength(txt, font=MONT(fs)) > 960: fs -= 2
                f = MONT(fs); tw = d.textlength(txt, font=f)
                d.text(((W - tw) / 2, 790 + i * 100 + (i >= 2) * 60 + (1 - a) * 20), txt, font=f, fill=mix((8, 8, 12), col, a))
        else:
            a = ease((T - VERSE) / 0.8); fv = ImageFont.truetype(f'{FD}/lora-latin-500-italic.ttf', 60)
            for i, l in enumerate(['"...pray for one another,', 'that you may be healed."']):
                tw = d.textlength(l, font=fv); d.text(((W - tw) / 2, 850 + i * 84), l, font=fv, fill=mix((8, 8, 12), (235, 235, 235), a))
            r = 'JAMES 5:16'; fr = INTER('700', 34); tw = d.textlength(r, font=fr)
            d.text(((W - tw) / 2, 1050), r, font=fr, fill=mix((8, 8, 12), (247, 184, 58), ease((T - VERSE - 0.6) / 0.6)))
    return np.asarray(im)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if CHECK:
        for s in CHECK.split(','): Image.fromarray(frame(float(s))).save(f'{OUT}/check_{s}.jpg', quality=88)
        sys.exit()
    segs = [('a', 0, BUZZ), ('b', BUZZ, JOB), ('c', JOB, PUNCH), ('d', PUNCH, VERSE), ('e', VERSE, TOTAL)]; parts = []
    for name, a, b in segs:
        tmp = f'{OUT}/{name}.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for fi in range(int(round((b - a) * FPS))): p.stdin.write(frame(a + fi / FPS).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, f'{OUT}/{name}.mp4'); parts.append(f'{name}.mp4')
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{x}'\n" for x in parts)); print('parts', parts)
