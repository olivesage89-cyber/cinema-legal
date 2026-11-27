#!/usr/bin/env python3
"""Coffee drafts (Junko format): a cafe in golden afternoon light. She sits alone at a small round table, typing
"wanna grab coffee?" to a friend and deleting it, 9 times ("TOO EAGER." / "'NO PRESSURE LOL'... TOO MUCH PRESSURE.").
Priya's notification ("hey!! random but wanna grab coffee sometime?") -> "...SHE ASKED FIRST." -> "I'M LITERALLY AT
COFFEE RIGHT NOW." -> she sends one text -> Priya walks in with two lattes: "ALREADY ORDERED YOURS." -> they laugh.
HUD: DRAFTS DELETED x0 -> x9 + TEXTS SENT x0 -> x1 (-> COFFEES WITH FRIENDS x1).
Punchline card, verse (1 John 4:19, WEB). app: notif.
usage: python3 coffee-drafts.py <outdir> [check t1,t2,..]  -> <outdir>/a.mp4..e.mp4 + list.txt (silent)."""
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

NOTIF, OH, SENT, ENTER, ARRIVE, PUNCH, VERSE, TOTAL = 10.6, 11.6, 15.2, 15.9, 18.3, 21.6, 25.8, 30.0
DEL = [1.9, 2.9, 3.9, 4.8, 6.4, 7.2, 8.0, 9.0, 9.9]           # each deleted draft
MX, FX, SY, S0 = 420, 790, 790, 160                           # her / friend seat x, seat y, size
TX = 605                                                       # table x
THINK = [(0.6, 'OK. JUST TEXT HER.\n"WANNA GRAB COFFEE?"'), (3.2, 'TOO EAGER.\nDELETE.'),
         (5.5, '"NO PRESSURE LOL"\n...TOO MUCH PRESSURE.'), (7.9, 'WHAT IF SHE\'S BUSY\nFOREVER.')]
SAYS = [(OH, '...SHE ASKED FIRST.', 'me'), (13.0, "I'M LITERALLY AT\nCOFFEE RIGHT NOW.", 'think'), (SENT - 0.1, '"AT THE CORNER CAFE.\nCOME NOW??"', 'me'),
        (ARRIVE + 0.2, 'ALREADY ORDERED\nYOURS.', 'co'), (20.0, 'OK I LOVE HER.', 'think')]
END_SAY = PUNCH - 0.3
ZX, ZY, ZW = 90, 60, 900
def sx(x): return (x - ZX) * PW / ZW

def ndel(t): return sum(1 for a in DEL if t >= a)

def room(t):
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); gd = ImageDraw.Draw(glow); k4 = SS / 4
    def G(x, y, r, c): gd.ellipse([(x - r) * k4, (y - r) * k4, (x + r) * k4, (y + r) * k4], fill=c)
    warm = ease((t - OH) / 2.5)
    FLOOR = 680
    im.paste(vgrad(PW * SS, FLOOR * SS, mix((222, 196, 168), (238, 204, 164), warm), mix((204, 176, 148), (222, 184, 142), warm)), (0, 0))
    im.paste(vgrad(PW * SS, (PH - FLOOR) * SS, (150, 104, 74), (120, 80, 56)), (0, FLOOR * SS))
    for k in range(9): d.line([(k * 140 - 60, FLOOR), (k * 180 - 330, PH)], (132, 90, 64), 3)   # floor boards
    # dark green lower wall panelling
    d.rect([0, 520, PW, FLOOR], (70, 104, 88)); d.rect([0, 512, PW, 524], (54, 84, 70))
    for k in range(10): d.rect([20 + k * 110, 548, 100 + k * 110, 660], None, r=6, outline=(58, 90, 76), width=4)
    d.rect([0, FLOOR - 6, PW, FLOOR + 4], (90, 60, 44))
    # big cafe window (right/back) with a golden-hour street
    wx, wy, ww, wh = 560, 110, 470, 380
    g = vgrad(int(ww * SS), int(wh * SS), (250, 206, 150), (255, 170, 120)); im.paste(g, (int(wx * SS), int(wy * SS)))
    G(wx + 330, wy + 120, 120, (150, 110, 50)); d.cap(wx + 330, wy + 120, 34, (255, 240, 200))
    for (bx, bw, bh, bc) in ((wx, 120, 200, (196, 130, 110)), (wx + 130, 90, 150, (170, 116, 104)), (wx + 230, 140, 230, (206, 150, 118)), (wx + 380, 100, 170, (180, 122, 100))):
        d.rect([bx, wy + wh - bh, bx + bw, wy + wh], bc)
        for r_ in range(3):
            for c_ in range(int(bw / 34)):
                d.rect([bx + 12 + c_ * 34, wy + wh - bh + 20 + r_ * 44, bx + 30 + c_ * 34, wy + wh - bh + 46 + r_ * 44], (250, 222, 170) if (r_ + c_) % 3 else (130, 96, 90))
    for tx in (wx + 110, wx + 360):   # street trees
        d.rect([tx - 7, wy + wh - 110, tx + 7, wy + wh], (110, 76, 56))
        for dx, dy, rr in ((0, -140, 52), (-34, -110, 40), (34, -110, 40)): d.cap(tx + dx, wy + wh + dy, rr, (226, 150, 76))
    # someone walking past outside
    px_ = wx + ((t * 40) % (ww + 120)) - 60
    d.cap(px_, wy + wh - 70, 12, (120, 92, 84)); d.rect([px_ - 10, wy + wh - 58, px_ + 10, wy + wh - 10], (120, 92, 84), r=8)
    d.rect([wx, wy, wx + ww, wy + wh], None, r=4, outline=(54, 84, 70), width=14)
    for k in (1, 2): d.line([(wx + ww * k / 3, wy), (wx + ww * k / 3, wy + wh)], (54, 84, 70), 8)
    d.rect([wx - 16, wy + wh, wx + ww + 16, wy + wh + 18], (54, 84, 70), r=3)
    # window lettering arc
    f = INTER('800', 26 * SS); lab = 'CORNER CAFE'; tw = d.d.textlength(lab, font=f) / SS
    d.rect([wx + ww / 2 - tw / 2 - 16, wy + 30, wx + ww / 2 + tw / 2 + 16, wy + 72], (54, 84, 70), r=8); d.text((wx + ww / 2 - tw / 2, wy + 36), lab, f, (255, 236, 190))
    # chalkboard menu (left)
    d.rect([130, 120, 370, 330], (44, 52, 50), r=6, outline=(150, 108, 70), width=10)
    d.text((166, 140), 'MENU', INTER('800', 30 * SS), (245, 240, 230))
    for i, (it, pr) in enumerate((('LATTE', '4.5'), ('CHAI', '4'), ('DRIP', '3'), ('SCONE', '3.5'))):
        d.text((158, 190 + i * 32), it, INTER('500', 20 * SS), (220, 220, 210)); d.text((310, 190 + i * 32), pr, INTER('500', 20 * SS), (220, 220, 210))
    # wall clock
    d.cap(470, 180, 44, (90, 60, 44)); d.cap(470, 180, 37, (252, 248, 238))
    ang = -math.pi / 2 + (4.25 + t / 60) / 12 * 2 * math.pi; d.line([(470, 180), (470 + 18 * math.cos(ang), 180 + 18 * math.sin(ang))], (40, 40, 40), 4)
    ang = -math.pi / 2 + ((16 + t * 0.9) % 60) / 60 * 2 * math.pi; d.line([(470, 180), (470 + 28 * math.cos(ang), 180 + 28 * math.sin(ang))], (40, 40, 40), 3)
    # pendant lamps
    for lx in (250, 610, 930):
        d.line([(lx, 0), (lx, 60)], (60, 50, 44), 3); d.pie([lx - 40, 44, lx + 40, 124], 180, 360, (54, 84, 70))
        d.cap(lx, 86, 10, (255, 236, 180)); G(lx, 110, 110, (130, 100, 50))
    # counter (left back) with espresso machine + pastry case
    d.rect([40, 400, 360, 420], (130, 88, 60), r=4); d.rect([50, 420, 350, 520], (160, 112, 78))
    d.rect([70, 330, 170, 400], (196, 200, 206), r=8); d.rect([86, 350, 154, 372], (70, 74, 80), r=4)
    for k in range(2): d.line([(100 + k * 30, 300 - (t * 22 + k * 12) % 34), (96 + k * 30, 280 - (t * 22 + k * 12) % 34)], (255, 255, 255), 3)
    d.rect([200, 350, 340, 400], (230, 236, 240), r=6); d.rect([210, 360, 330, 392], (250, 246, 240), r=4)
    for k in range(4): d.cap(228 + k * 28, 382, 10, (214, 160, 96))
    S.plant(d, 30 + 500, 520, (200, 120, 90), (96, 156, 100), t)
    # chairs (backs behind the people)
    for cx in (MX, FX):
        d.rect([cx - 70, SY - 230, cx + 70, SY - 210], (110, 72, 50), r=8)
        d.rect([cx - 62, SY - 210, cx - 50, SY - 20], (110, 72, 50)); d.rect([cx + 50, SY - 210, cx + 62, SY - 20], (110, 72, 50))
        d.rect([cx - 80, SY - 26, cx + 90, SY - 6], (130, 86, 60), r=8)
        d.rect([cx - 72, SY - 6, cx - 60, SY + 120], (100, 66, 46)); d.rect([cx + 72, SY - 6, cx + 84, SY + 120], (100, 66, 46))
    # her
    if t < NOTIF: mood, tilt = 'sad', 0.12 + 0.04 * math.sin(t * 1.3)
    elif t < OH: mood, tilt = 'flat', -0.1 + 0.18 * math.sin((t - NOTIF) * 28) * max(0, 1 - (t - NOTIF) / 0.6)
    elif t < ARRIVE: mood, tilt = 'smile', 0.04
    else: mood, tilt = 'laugh', 0.08 * math.sin(t * 14)
    pop = 1 + 0.07 * math.sin(min(1, max(0, t - NOTIF) / 0.35) * math.pi) if t >= NOTIF else 1
    arm = 'phone' if t < ARRIVE + 0.4 else 'lap'
    hd = S.person(d, MX, SY, S0 * pop, None, 'sit', mood, None, ('long', None), t, 1, arm, head_tilt=tilt)
    if hd:
        typing = t < NOTIF and any(a - 0.6 <= t < a for a in DEL) or (SENT - 1.0 <= t < SENT)
        jig = math.sin(t * 40) * 1.5 if typing else 0
        d.rect([hd[0] - 20, hd[1] - 34 + jig, hd[0] + 20, hd[1] + 28 + jig], (40, 40, 46), r=7)
        d.rect([hd[0] - 16, hd[1] - 29 + jig, hd[0] + 16, hd[1] + 23 + jig], (236, 244, 255), r=5)
        G(hd[0], hd[1], 50, (60, 80, 110))
    # table between them with cups
    d.ell([TX - 120, SY - 34, TX + 120, SY + 6], (236, 228, 214)); d.ell([TX - 120, SY - 40, TX + 120, SY], (250, 244, 232))
    d.rect([TX - 10, SY - 14, TX + 10, SY + 110], (70, 60, 54)); d.ell([TX - 60, SY + 104, TX + 60, SY + 124], (70, 60, 54))
    def cup(cx, cy, steam=True):
        d.ell([cx - 30, cy - 4, cx + 30, cy + 10], (240, 236, 230)); d.rect([cx - 20, cy - 40, cx + 20, cy], (252, 250, 246), r=6)
        d.rect([cx - 20, cy - 30, cx + 20, cy - 18], (190, 140, 100)); d.arc([cx + 12, cy - 34, cx + 34, cy - 12], 270, 90, (252, 250, 246), 5)
        if steam:
            for k in range(2): d.line([(cx - 6 + k * 12, cy - 52 - (t * 20 + k * 10) % 26), (cx - 10 + k * 12, cy - 70 - (t * 20 + k * 10) % 26)], (255, 255, 255), 3)
    cup(TX - 50, SY - 20, steam=False)           # her cold latte
    # friend: walks in from the right with two cups, then sits
    if t >= ENTER:
        if t < ARRIVE:
            k = ease((t - ENTER) / (ARRIVE - ENTER)); x = lerp(1120, FX, k)
            S.person(d, x, SY + 128, S0, (150, 110, 190), 'walk', 'smile', None, ('bun', None), t, 3, 'lap')
            hy = SY + 128 - S0 * 0.95 - S0 * 1.05 + S0 * 0.95
            for dx in (-34, 34): cup(x + dx, hy, steam=True)
        else:
            S.person(d, FX, SY, S0, (150, 110, 190), 'sit', 'laugh', None, ('bun', None), t, 3, 'lap', head_tilt=-0.05 + 0.06 * math.sin(t * 13))
            cup(TX + 50, SY - 20); cup(TX + 6, SY - 12)
    gs = glow.filter(ImageFilter.GaussianBlur(12)).resize(im.size, Image.BILINEAR)
    im = Image.fromarray(np.clip(np.asarray(im, np.float32) + np.asarray(gs, np.float32) * 0.5, 0, 255).astype(np.uint8))
    z = 1 + 0.04 * min(t, PUNCH) / PUNCH; cw = ZW / z; x0 = ZX + (ZW - cw) / 2; y0 = ZY + (ZW - cw) / 2
    im = im.crop((int(x0 * SS), int(y0 * SS), int((x0 + cw) * SS), int((y0 + cw) * SS))).resize((PW * SS, PH * SS), Image.LANCZOS)
    db = D(im)
    if NOTIF <= t < NOTIF + 3.4:
        kk = ease((t - NOTIF) / 0.4) * (1 - ease((t - NOTIF - 3.0) / 0.4))
        S.notif(db, im, 220, 36, kk, 'Priya', 'hey!! wanna grab coffee sometime?')
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
    elif kind == 'co': fill, ol = (214, 196, 240), (60, 40, 90)
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
    n = ndel(t)
    lcol = (240, 80, 80) if n else (150, 150, 160)
    Lh = ('DRAFTS DELETED', f'x{n}', lcol, pulse(DEL), [(240, 80, 80) if i < n else (50, 50, 60) for i in range(9)], 9)
    if t < ARRIVE:
        s = 1 if t >= SENT else 0
        R = ('TEXTS SENT', f'x{s}', (90, 220, 120) if s else (240, 80, 80), pulse([SENT]), [(70, 170, 100) if s else (50, 50, 60)] + [(50, 50, 60)] * 4, 5)
    else:
        R = ('COFFEES WITH FRIENDS', 'x1', (90, 220, 120), pulse([ARRIVE]), [(70, 170, 100)] * 5, 5)
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
        if tt <= T < end: bubble(im, sx(MX) + 40, BY, txt, T - tt, 'think', sx(MX))
    for j, (tt, txt, who) in enumerate(SAYS):
        end = SAYS[j + 1][0] - 0.1 if j + 1 < len(SAYS) else END_SAY
        if not (tt <= T < end): continue
        if who == 'co': bubble(im, sx(FX) - 40, BY, txt, T - tt, 'co', sx(FX))
        else: bubble(im, sx(MX) + 40, BY + ((60 if '\n' not in txt else -40) if who == 'me' else 0), txt, T - tt, 'think' if who == 'think' else 'say', sx(MX))
    # her one sent text (shows as a small sent bubble)
    if T >= PUNCH:
        k = ease((T - PUNCH) / 0.5)
        im = Image.blend(im, Image.new('RGB', (W, H), (8, 8, 12)), 0.82 * k); d = ImageDraw.Draw(im)
        tv = T - PUNCH
        if T < VERSE:
            rows = [('MY 9 DRAFTS?', (245, 245, 245), 0.2), ('ALL DELETED.', (240, 80, 80), 0.7),
                    ('HER ONE TEXT?', (245, 245, 245), 1.6), ('TWO LATTES.', (247, 184, 58), 2.1)]
            for i, (txt, col, st) in enumerate(rows):
                a = ease((tv - st) / 0.3)
                if a <= 0: continue
                fs = 72
                while d.textlength(txt, font=MONT(fs)) > 960: fs -= 2
                f = MONT(fs); tw = d.textlength(txt, font=f)
                d.text(((W - tw) / 2, 790 + i * 100 + (i >= 2) * 60 + (1 - a) * 20), txt, font=f, fill=mix((8, 8, 12), col, a))
        else:
            a = ease((T - VERSE) / 0.8); fv = ImageFont.truetype(f'{FD}/lora-latin-500-italic.ttf', 60)
            L = ['“We love him, because', 'he first loved us.”']
            for i, l in enumerate(L):
                tw = d.textlength(l, font=fv); d.text(((W - tw) / 2, 820 + i * 86), l, font=fv, fill=mix((8, 8, 12), (235, 235, 235), a))
            r = '1 JOHN 4:19'; fr = INTER('700', 34); tw = d.textlength(r, font=fr)
            d.text(((W - tw) / 2, 1040), r, font=fr, fill=mix((8, 8, 12), (247, 184, 58), ease((T - VERSE - 0.6) / 0.6)))
    return np.asarray(im)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if CHECK:
        for s in CHECK.split(','): Image.fromarray(frame(float(s))).save(f'{OUT}/check_{s}.jpg', quality=88)
        sys.exit()
    segs = [('a', 0, NOTIF), ('b', NOTIF, ENTER), ('c', ENTER, PUNCH), ('d', PUNCH, VERSE), ('e', VERSE, TOTAL)]; parts = []
    for name, a, b in segs:
        tmp = f'{OUT}/{name}.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for fi in range(int(round((b - a) * FPS))): p.stdin.write(frame(a + fi / FPS).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, f'{OUT}/{name}.mp4'); parts.append(f'{name}.mp4')
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{x}'\n" for x in parts)); print('parts', parts)
