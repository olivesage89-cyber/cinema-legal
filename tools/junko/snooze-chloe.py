#!/usr/bin/env python3
"""Snooze (Junko format): bedroom at sunrise. Her alarm goes off at 6:00 and she snoozes it 6 times ("quiet time with God
right after this one"). Reading-plan buddy Chloe's notification ("reading plan day 12! i'm on ch. 3, you?") -> she shoots up:
"ALSO ON CHAPTER 3." -> Chloe: "you just woke up didn't you" -> "...OPENING IT NOW." -> reads, sun pours in.
HUD: TIME 6:00 -> 6:54 AM + SNOOZES x0 -> x6 -> CHAPTERS READ x0 -> x1. Punchline card, verse (Lamentations 3:22-23, WEB).
app: notif.  usage: python3 snooze-chloe.py <outdir> [check t1,t2,..]  -> <outdir>/a.mp4..e.mp4 + list.txt (silent)."""
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

SNOOZE = [0.7, 3.0, 5.3, 7.6, 9.6, 11.0]        # her hand hits snooze (x1..x6)
BUZZ, SITUP, BUZZ2, READ, DONE = 12.0, 13.0, 15.6, 17.9, 20.0
PUNCH, VERSE, TOTAL = 22.6, 26.8, 32.0
MX = 640                                       # sitting x
HEAD = (500, 694)                              # lying head on pillow
PHONE = (262, 636)                             # phone on nightstand
THINK = [(1.1, 'FIVE MORE\nMINUTES.'), (3.4, 'QUIET TIME WITH GOD\nRIGHT AFTER THIS ONE.'),
         (5.7, 'HE KNOWS\nI\'M TIRED.'), (8.0, 'I\'LL JUST READ\nFASTER.'), (10.0, 'OK. LAST ONE.')]
SAYS = [(13.5, 'ALSO ON\nCHAPTER 3.', 'me'), (16.6, '...OPENING\nIT NOW.', 'me'), (DONE, 'BEST 9 MINUTES\nOF MY MORNING.', 'think')]
END_SAY = PUNCH - 0.3
ZX, ZY, ZW = 90, 60, 900
def sx(x): return (x - ZX) * PW / ZW

def nsnooze(t): return sum(1 for s in SNOOZE if t >= s)
def clock(t):
    if t >= READ: m = 54 + min(8, int((t - READ) / 0.5))
    else: m = 9 * nsnooze(t)
    return f'{6 + m // 60}:{m % 60:02d} AM'
def nread(t): return 1 if t >= DONE - 0.4 else 0

def room(t):
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); gd = ImageDraw.Draw(glow); k4 = SS / 4
    def G(x, y, r, c): gd.ellipse([(x - r) * k4, (y - r) * k4, (x + r) * k4, (y + r) * k4], fill=c)
    sun = 0.55 + 0.45 * ease((t - READ) / 2.5) + 0.12 * min(t, READ) / READ   # sunrise gets brighter
    FLOOR = 660
    im.paste(vgrad(PW * SS, FLOOR * SS, mix((150, 126, 140), (246, 206, 176), sun), mix((130, 108, 124), (232, 184, 152), sun)), (0, 0))
    im.paste(vgrad(PW * SS, (PH - FLOOR) * SS, mix((110, 80, 70), (176, 122, 86), sun), mix((84, 60, 54), (140, 94, 66), sun)), (0, FLOOR * SS))
    d.rect([0, FLOOR - 8, PW, FLOOR + 4], mix((96, 74, 70), (196, 150, 118), sun))
    for k in range(8): d.line([(k * 150 - 40, FLOOR + 4), (k * 180 - 220, PH)], mix((96, 70, 60), (156, 106, 76), sun), 2)
    # window with sunrise + blinds half open
    wx, wy, ww, wh = 120, 130, 300, 300
    g = vgrad(int(ww * SS), int(wh * SS), mix((70, 80, 140), (150, 190, 236), sun * 0.8), mix((240, 140, 110), (255, 214, 150), sun)); im.paste(g, (int(wx * SS), int(wy * SS)))
    sy = lerp(wy + wh + 30, wy + wh - 70, min(1, t / READ * 0.7 + 0.3 * ease((t - READ) / 2)))
    d.cap(wx + ww * 0.62, sy, 46, (255, 236, 170)); G(wx + ww * 0.62, sy, 160, tuple(int(v * sun) for v in (170, 120, 60)))
    for i, (hx, hh) in enumerate(((0, 60), (60, 90), (130, 50), (190, 80), (250, 50))):
        d.rect([wx + hx, wy + wh - hh, wx + hx + 56, wy + wh], mix((120, 90, 110), (200, 140, 120), sun))
    for k in range(6): d.rect([wx, wy + 8 + k * 22, wx + ww, wy + 20 + k * 22], (246, 240, 230), r=3)   # blinds (top half)
    d.rect([wx, wy, wx + ww, wy + wh], None, r=4, outline=(250, 244, 236), width=12)
    d.line([(wx, wy + wh * 0.5 + 40), (wx + ww, wy + wh * 0.5 + 40)], (250, 244, 236), 6)
    # light stripes on the wall from the blinds
    for k in range(4): G(560 + k * 70, 300 + k * 18, 70, tuple(int(v * sun * 0.6) for v in (150, 110, 60)))
    # frames + shelf with plant
    S.frames_on_wall(d, [(620, 150, 120, 150, (150, 100, 76), (176, 206, 196)), (770, 190, 90, 90, (150, 100, 76), (236, 196, 150))])
    d.rect([880, 300, 1020, 314], (150, 100, 76)); S.plant(d, 950, 300, (230, 226, 216), (96, 156, 100), t)
    # string lights over the bed (soft, morning)
    S.string_lights(d, type('GL', (), {'cap': staticmethod(lambda x, y, r, c: G(x, y, r, tuple(int(v * 0.4) for v in c)))}), 470, 990, 380, t)
    # nightstand
    d.rect([170, 650, 340, 830], (160, 112, 82), r=10); d.rect([186, 720, 324, 732], (130, 88, 64)); d.rect([244, 770, 268, 780], (226, 206, 170), r=3)
    d.rect([180, 830, 196, 860], (120, 82, 60)); d.rect([314, 830, 330, 860], (120, 82, 60))
    # lamp
    d.rect([196, 520, 204, 650], (110, 80, 60)); d.poly([(160, 520), (240, 520), (224, 466), (176, 466)], (255, 236, 196))
    # bible on nightstand (until she picks it up)
    if t < 16.9:
        d.rect([290, 628, 336, 650], (150, 60, 56), r=3); d.rect([292, 634, 334, 638], (230, 200, 120))
    # phone on nightstand (alarm)
    ring = any(s - 0.9 <= t < s for s in SNOOZE) or t < 0
    if t < BUZZ + 0.5:
        jig = math.sin(t * 70) * 3 if ring else 0
        d.rect([PHONE[0] - 26 + jig, PHONE[1] - 10, PHONE[0] + 26 + jig, PHONE[1] + 10], (30, 30, 36), r=5)
        d.rect([PHONE[0] - 22 + jig, PHONE[1] - 7, PHONE[0] + 22 + jig, PHONE[1] + 5], (255, 210, 120) if ring else (60, 64, 80), r=3)
        if ring:
            G(PHONE[0], PHONE[1], 60, (150, 110, 40))
            for s_ in (-1, 1):
                for k in range(2): d.arc([PHONE[0] - 40 - k * 16, PHONE[1] - 30 - k * 16, PHONE[0] + 40 + k * 16, PHONE[1] + 30 + k * 16], 200 if s_ < 0 else -20, 250 if s_ < 0 else 30, (90, 70, 60), 4)
    # bed
    d.rect([400, 470, 440, 860], (150, 100, 76), r=14)                         # headboard post
    d.rect([400, 500, 560, 740], (176, 120, 90), r=30)                        # headboard
    d.rect([420, 734, 990, 820], (250, 246, 238), r=18)                       # mattress
    d.rect([420, 800, 990, 850], (196, 140, 104), r=10)                       # frame
    for lx in (440, 960): d.rect([lx, 850, lx + 18, 880], (130, 88, 64))
    d.rect([432, 690, 570, 742], (255, 252, 246), r=24)                      # pillow
    BL, BL2 = (116, 156, 206), (96, 134, 186)
    if t < SITUP:
        # lying under the blanket: head on pillow, arm reaches to snooze
        BODY, OL = (240, 234, 224), (120, 116, 112); HC = (150, 146, 140)
        hx, hy = HEAD; r = 54
        d.cap(hx, hy, r + 2.5, OL); d.cap(hx, hy, r, BODY)
        d.chord([hx - r * 1.04, hy - r * 1.06, hx + r * 1.04, hy + r * 0.2], 180, 360, HC)
        d.chord([hx - r, hy - r, hx + r, hy + r], 60, 150, (214, 208, 198))
        # reach amount
        reach = 0.0
        for s in SNOOZE:
            if s - 0.45 <= t < s + 0.5: reach = ease((t - s + 0.45) / 0.45) * (1 - ease((t - s - 0.1) / 0.4))
        if BUZZ - 0.2 <= t < SITUP: reach = ease((t - BUZZ + 0.2) / 0.4)
        sh = (550, 728); hand = (lerp(560, PHONE[0] + 10, reach), lerp(760, PHONE[1] - 6, reach))
        el = (lerp(540, 430, reach), lerp(770, 690 + 20 * (1 - reach), reach))
        if reach > 0.05:
            d.line([sh, el, hand], OL, 33 + 5); d.line([sh, el, hand], BODY, 33); d.cap(hand[0], hand[1], 16.5, BODY)
        # blanket lump
        d.rect([530, 700, 985, 800], BL, r=46); d.ell([600, 668, 860, 760], BL)
        for k in range(4): d.line([(620 + k * 90, 712), (660 + k * 90, 792)], BL2, 5)
        if BUZZ <= t < SITUP:  # holding phone over the blanket, reading notification
            d.rect([hand[0] - 22, hand[1] - 34, hand[0] + 22, hand[1] + 26], (236, 244, 255), r=7); G(hand[0], hand[1], 50, (60, 80, 110))
    else:
        # blanket pushed back, she sits on the edge
        d.rect([700, 726, 985, 790], BL, r=30); d.ell([760, 700, 960, 770], BL)
        for k in range(3): d.line([(740 + k * 80, 734), (770 + k * 80, 780)], BL2, 5)
        pop = 1 + 0.08 * math.sin(min(1, (t - SITUP) / 0.35) * math.pi)
        if t < 16.9: mood, arm, tilt = ('flat' if t < SITUP + 0.4 else 'smile'), 'phone', (0.18 * math.sin((t - SITUP) * 28) * max(0, 1 - (t - SITUP) / 0.6))
        elif t < DONE: mood, arm, tilt = 'smile', 'phone', 0.06
        else: mood, arm, tilt = 'closed', 'phone', 0.05
        if BUZZ2 <= t < 16.9: mood = 'flat'; tilt = 0.12 + 0.04 * math.sin(t * 20) * max(0, 1 - (t - BUZZ2) / 0.6)
        ph = S.person(d, MX, 800, 170 * pop, None, 'sit', mood, None, ('bob', None), t, 1, arm, head_tilt=tilt)
        if t < 16.9:
            d.rect([ph[0] - 22, ph[1] - 36, ph[0] + 22, ph[1] + 28], (236, 244, 255), r=7); G(ph[0], ph[1], 60, (60, 80, 110))
        else:  # open bible
            bx, by = ph
            d.rect([bx - 58, by - 34, bx + 58, by + 16], (150, 60, 56), r=6)
            d.rect([bx - 52, by - 30, bx - 2, by + 10], (252, 248, 236), r=3); d.rect([bx + 2, by - 30, bx + 52, by + 10], (252, 248, 236), r=3)
            for k in range(4):
                d.line([(bx - 46, by - 22 + k * 8), (bx - 8, by - 22 + k * 8)], (180, 176, 170), 2); d.line([(bx + 8, by - 22 + k * 8), (bx + 46, by - 22 + k * 8)], (180, 176, 170), 2)
            d.rect([bx - 3, by - 8, bx + 3, by + 26], (230, 190, 90))  # ribbon
            G(bx, by - 10, 90, tuple(int(v * ease((t - 16.9) / 1.0)) for v in (140, 110, 60)))
    gs = glow.filter(ImageFilter.GaussianBlur(12)).resize(im.size, Image.BILINEAR)
    im = Image.fromarray(np.clip(np.asarray(im, np.float32) + np.asarray(gs, np.float32) * 0.55, 0, 255).astype(np.uint8))
    # zoom (2x canvas), then notification in panel space
    z = 1 + 0.04 * min(t, PUNCH) / PUNCH; cw = ZW / z; x0 = ZX + (ZW - cw) / 2; y0 = ZY + (ZW - cw) / 2
    im = im.crop((int(x0 * SS), int(y0 * SS), int((x0 + cw) * SS), int((y0 + cw) * SS))).resize((PW * SS, PH * SS), Image.LANCZOS)
    db = D(im)
    if BUZZ <= t < BUZZ + 3.1:
        kk = ease((t - BUZZ) / 0.4) * (1 - ease((t - BUZZ - 2.7) / 0.4))
        S.notif(db, im, 220, 36, kk, 'Chloe', "reading plan day 12! i'm on ch. 3, you?")
    if BUZZ2 <= t < READ + 0.4:
        kk = ease((t - BUZZ2) / 0.4) * (1 - ease((t - READ) / 0.4))
        S.notif(db, im, 220, 36, kk, 'Chloe', "lol you just woke up didn't you")
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
    n = nsnooze(t)
    tcol = (240, 80, 80) if t < READ else (90, 220, 120)
    tsq = [(240, 80, 80) if i < n else (50, 50, 60) for i in range(6)] if t < READ else [(70, 170, 100)] * 6
    Lh = ('TIME', clock(t), tcol, pulse(SNOOZE + [READ]), tsq)
    if t < READ: R = ('SNOOZES', f'x{n}', (240, 80, 80) if n else (150, 150, 160), pulse(SNOOZE), [(240, 80, 80) if i < n else (50, 50, 60) for i in range(6)])
    else:
        c = nread(t); R = ('CHAPTERS READ', f'x{c}', (240, 80, 80) if c == 0 else (90, 220, 120), pulse([READ, DONE - 0.4]), [(70, 170, 100) if i < c else (50, 50, 60) for i in range(6)])
    for cx, (lab, val, col, pz, sq) in ((290, Lh), (790, R)):
        f = PIX(30); tw = d.textlength(lab, font=f); d.text((cx - tw / 2, 200), lab, font=f, fill=(150, 150, 160))
        f = MONT(80 * pz); tw = d.textlength(val, font=f); d.text((cx - tw / 2, 245 - (pz - 1) * 40), val, font=f, fill=col)
        for i in range(6):
            x = cx - 76 + i * 26; d.rounded_rectangle([x, 352, x + 20, 372], radius=4, fill=sq[i])
    d.line([(540, 210), (540, 370)], fill=(60, 60, 70), width=3)

def frame(T):
    im = Image.new('RGB', (W, H), (10, 10, 14))
    sc = room(min(T, PUNCH))
    fade = np.clip(np.linspace(5, 0, PH), 0, 1)[:, None] * np.ones((1, PW)); m = Image.fromarray((fade * 255).astype(np.uint8))
    im.paste(sc, (0, PY), m)
    hud(im, T)
    BY = PY + 230
    for j, (tt, txt) in enumerate(THINK):
        end = THINK[j + 1][0] - 0.1 if j + 1 < len(THINK) else BUZZ - 0.1
        if tt <= T < end: bubble(im, sx(HEAD[0]) + 40, BY + 60, txt, T - tt, 'think', sx(HEAD[0]))
    for j, (tt, txt, who) in enumerate(SAYS):
        end = SAYS[j + 1][0] - 0.1 if j + 1 < len(SAYS) else END_SAY
        if tt <= T < end: bubble(im, sx(MX) - 40, BY, txt, T - tt, 'think' if who == 'think' else 'say', sx(MX))
    if T >= PUNCH:
        k = ease((T - PUNCH) / 0.5)
        im = Image.blend(im, Image.new('RGB', (W, H), (8, 8, 12)), 0.82 * k); d = ImageDraw.Draw(im)
        tv = T - PUNCH
        if T < VERSE:
            rows = [('MY ALARM?', (245, 245, 245), 0.2), ('SNOOZED 6 TIMES.', (240, 80, 80), 0.7),
                    ('ONE TEXT FROM CHLOE?', (245, 245, 245), 1.6), ('WIDE AWAKE.', (247, 184, 58), 2.1)]
            for i, (txt, col, st) in enumerate(rows):
                a = ease((tv - st) / 0.3)
                if a <= 0: continue
                fs = 72
                while d.textlength(txt, font=MONT(fs)) > 960: fs -= 2
                f = MONT(fs); tw = d.textlength(txt, font=f)
                d.text(((W - tw) / 2, 790 + i * 100 + (i >= 2) * 60 + (1 - a) * 20), txt, font=f, fill=mix((8, 8, 12), col, a))
        else:
            a = ease((T - VERSE) / 0.8); fv = ImageFont.truetype(f'{FD}/lora-latin-500-italic.ttf', 54)
            L = ['“It is because of Yahweh’s loving', 'kindnesses that we are not consumed,', 'because his mercies don’t fail.',
                 'They are new every morning.', 'Great is your faithfulness.”']
            for i, l in enumerate(L):
                tw = d.textlength(l, font=fv); d.text(((W - tw) / 2, 720 + i * 76), l, font=fv, fill=mix((8, 8, 12), (235, 235, 235), a))
            r = 'LAMENTATIONS 3:22–23'; fr = INTER('700', 34); tw = d.textlength(r, font=fr)
            d.text(((W - tw) / 2, 1140), r, font=fr, fill=mix((8, 8, 12), (247, 184, 58), ease((T - VERSE - 0.6) / 0.6)))
    return np.asarray(im)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if CHECK:
        for s in CHECK.split(','): Image.fromarray(frame(float(s))).save(f'{OUT}/check_{s}.jpg', quality=88)
        sys.exit()
    segs = [('a', 0, BUZZ), ('b', BUZZ, READ), ('c', READ, PUNCH), ('d', PUNCH, VERSE), ('e', VERSE, TOTAL)]; parts = []
    for name, a, b in segs:
        tmp = f'{OUT}/{name}.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for fi in range(int(round((b - a) * FPS))): p.stdin.write(frame(a + fi / FPS).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, f'{OUT}/{name}.mp4'); parts.append(f'{name}.mp4')
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{x}'\n" for x in parts)); print('parts', parts)
