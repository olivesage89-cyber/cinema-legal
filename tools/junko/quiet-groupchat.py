#!/usr/bin/env python3
"""Group chat while I've been quiet (home desk at night, Junko format: HUD counters, thought bubbles, she finally opens
the group chat — every message is people checking on her — punchline card, verse). app: none.
usage: python3 quiet-groupchat.py <outdir> [check t1,t2,..]   -> <outdir>/a.mp4..e.mp4 + list.txt (silent)."""
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

THOUGHTS = [(1.0, "I'LL REPLY\nLATER."), (3.6, "THEY'RE PROBABLY\nBUSY ANYWAY."),
            (6.2, "TOO LATE TO\nREPLY NOW."), (8.8, "THEY PROBABLY\nDIDN'T EVEN NOTICE.")]
UNREAD = [3, 12, 26, 47]
PICK, OPEN, REPLY, CLOSE, PUNCH, VERSE, TOTAL = 11.6, 12.2, 16.6, 18.8, 21.4, 25.6, 30.0
MSGS = [(12.8, 'MAYA', "hey, haven't heard from you. you ok?"), (13.7, 'SARAH', 'praying for you this week'),
        (14.6, 'JESS', 'we saved you a seat. and a cupcake'), (15.5, 'HANNAH', 'no pressure. we just miss you')]
ME_MSG, FRIEND = (REPLY, "sorry i've been so quiet"), (REPLY + 1.1, 'MAYA', 'FINALLY. coffee tomorrow?')
FL, MX = 780, 330

def glow_finish(im, glow, amt=0.6):
    gs = glow.filter(ImageFilter.GaussianBlur(12)).resize(im.size, Image.BILINEAR)
    return Image.fromarray(np.clip(np.asarray(im, np.float32) + np.asarray(gs, np.float32) * amt, 0, 255).astype(np.uint8))

def unread(t):
    v = 0
    for (tt, _), n in zip(THOUGHTS, UNREAD):
        if t >= tt + 0.3: v = n
        elif t >= tt - 1.2: v = max(v, int(lerp(v, n, ease((t - tt + 1.2) / 1.5))))
    return v

def days(t): return sum(1 for tt, _ in THOUGHTS if t >= tt + 0.3)

def room(t):
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); g = ImageDraw.Draw(glow); k4 = SS / 4
    def G(x, y, r, c): g.ellipse([(x - r) * k4, (y - r) * k4, (x + r) * k4, (y + r) * k4], fill=c)
    warm = ease((t - REPLY) / 2.0)
    im.paste(vgrad(PW * SS, FL * SS, mix((66, 74, 104), (138, 100, 86), warm), mix((50, 56, 84), (108, 76, 64), warm)), (0, 0))
    im.paste(vgrad(PW * SS, (PH - FL) * SS, (44, 40, 50), (16, 14, 18)), (0, FL * SS))
    d.rect([0, FL - 6, PW, FL + 4], (34, 32, 46))
    # window with city lights (left)
    S.window(d, 60, 160, 230, 280, (44, 50, 80), (16, 20, 44), (50, 56, 96), t, panel=im)
    for i in range(9):
        bx = 76 + i * 23; bh = 40 + (i * 37) % 70
        d.rect([bx, 440 - bh, bx + 20, 432], (26, 28, 48))
        for j in range(3):
            if (i + j) % 2: d.rect([bx + 6, 440 - bh + 8 + j * 14, bx + 12, 440 - bh + 14 + j * 14], (250, 214, 120))
    # cork board with photos + calendar over the desk
    d.rect([560, 150, 820, 330], (150, 112, 78), r=6); d.rect([570, 160, 810, 320], (190, 150, 104), r=4)
    for (x, y, w, h, c) in ((586, 176, 70, 56, (240, 238, 230)), (668, 172, 60, 74, (160, 200, 230)), (742, 180, 54, 48, (250, 220, 120)), (590, 250, 80, 52, (240, 170, 170)), (690, 258, 96, 46, (200, 230, 200))):
        d.rect([x, y, x + w, y + h], c, r=2); d.cap(x + w / 2, y + 5, 4, (200, 60, 60))
    # calendar with crossed days
    d.rect([860, 160, 1000, 310], (240, 238, 232), r=6); d.rect([860, 160, 1000, 196], (200, 80, 80), r=6); d.rect([860, 186, 1000, 196], (200, 80, 80))
    for i in range(12):
        cx, cy = 876 + (i % 4) * 32, 214 + (i // 4) * 30
        d.rect([cx, cy, cx + 20, cy + 18], (220, 218, 212), r=3)
        if i < 4 + days(t):
            d.line([(cx + 2, cy + 2), (cx + 18, cy + 16)], (200, 70, 70), 3); d.line([(cx + 18, cy + 2), (cx + 2, cy + 16)], (200, 70, 70), 3)
    # shelf with books + plant
    d.rect([330, 330, 500, 342], (90, 66, 54))
    for i, (bw, bh, bc) in enumerate([(22, 64, (180, 80, 80)), (18, 54, (80, 130, 180)), (26, 70, (220, 180, 80)), (20, 58, (100, 150, 110))]):
        xx = 344 + i * 28; d.rect([xx, 330 - bh, xx + bw, 330], mix(bc, (50, 56, 84), 0.3), r=3)
    S.plant(d, 470, 330, (170, 100, 76), (90, 150, 90), t)
    # desk (right of her), laptop, lamp, mug
    d.rect([500, 586, 1040, 610], (130, 94, 68), r=6)
    d.rect([520, 610, 540, FL], (100, 72, 54)); d.rect([1000, 610, 1020, FL], (100, 72, 54))
    d.rect([880, 610, 1020, 720], (116, 84, 62), r=4); d.rect([892, 650, 1008, 660], (96, 68, 50))
    d.rect([640, 470, 830, 580], (60, 64, 78), r=8); d.rect([650, 480, 820, 570], mix((70, 90, 140), (90, 110, 150), 0.5), r=4)
    for k in range(4): d.rect([664, 494 + k * 18, 664 + (130 - k * 22), 502 + k * 18], (150, 170, 210), r=3)
    d.poly([(620, 586), (850, 586), (836, 578), (634, 578)], (90, 94, 108))
    d.rect([950, 440, 958, 586], (60, 54, 50)); d.poly([(910, 440), (1000, 440), (984, 384), (926, 384)], (255, 222, 160))
    d.rect([930, 578, 980, 586], (60, 54, 50), r=3)
    G(955, 470, 220, (190, 140, 70) if warm < 1 else (210, 150, 70))
    d.rect([862, 540, 900, 586], (230, 120, 100), r=6); d.arc([890, 550, 912, 572], -90, 90, (230, 120, 100), 5)
    # chair
    d.rect([MX - 120, 440, MX - 96, 680], (70, 66, 80), r=10)
    d.rect([MX - 110, 640, MX + 110, 668], (70, 66, 80), r=10); d.rect([MX - 6, 668, MX + 6, 750], (56, 52, 64))
    d.rect([MX - 70, 750, MX + 70, 762], (56, 52, 64), r=5)
    # phone face-down on the desk, buzzing on every new message
    picked = t >= PICK
    if not picked:
        buzz = any(tt - 1.0 <= t < tt + 0.4 for tt, _ in THOUGHTS[1:]) or (t >= 10.2)
        jit = math.sin(t * 80) * 3 if buzz else 0
        d.rect([560 + jit, 574, 620 + jit, 586], (36, 36, 46), r=4)
        if buzz: G(590, 580, 50, (60, 80, 130))
    sad = t < REPLY + 0.6
    tilt = (-0.12 * ease(t / 10)) if sad else 0.08
    hand = S.person(d, MX, 650, 200, None, 'sit', 'sad' if sad else 'smile', None, ('bun', None), t, 1,
                    'phone' if picked else 'lap', head_tilt=tilt)
    if picked:
        d.rect([hand[0] - 24, hand[1] - 42, hand[0] + 24, hand[1] + 32], (230, 240, 255), r=8)
        G(hand[0], hand[1] - 10, 36, (40, 60, 100))
    return glow_finish(im, glow).resize((PW, PH), Image.LANCZOS)

def wrap(d, s, f, maxw):
    out, cur = [], ''
    for w in s.split(' '):
        nx = (cur + ' ' + w).strip()
        if d.textlength(nx, font=f) > maxw and cur: out.append(cur); cur = w
        else: cur = nx
    return out + [cur]

def phone_ui(im, t):
    k = ease((t - OPEN) / 0.45) * (1 - ease((t - CLOSE) / 0.4))
    if k <= 0: return
    x0, w, h = 540, 510, 900; y0 = PY + 50 + (1 - k) * 1000
    lay = Image.new('RGBA', (w + 60, h + 60), (0, 0, 0, 0)); L = ImageDraw.Draw(lay)
    L.rounded_rectangle([30, 36, w + 30, h + 36], radius=60, fill=(0, 0, 0, 120))
    lay = lay.filter(ImageFilter.GaussianBlur(14)); L = ImageDraw.Draw(lay)
    L.rounded_rectangle([30, 30, w + 30, h + 30], radius=60, fill=(24, 24, 30))
    L.rounded_rectangle([44, 44, w + 16, h + 16], radius=48, fill=(250, 248, 246))
    # chat content on its own layer so it can scroll under the header
    top, bot = 206, h + 4
    C = Image.new('RGBA', (w + 60, 2400), (0, 0, 0, 0)); CL = ImageDraw.Draw(C)
    y = 20; fm = INTER('500', 30); fn = INTER('700', 22)
    items = [(tt, who, msg, 'l') for tt, who, msg in MSGS] + [(ME_MSG[0], None, ME_MSG[1], 'r'), (FRIEND[0], FRIEND[1], FRIEND[2], 'l')]
    for tt, who, msg, side in items:
        a = ease((t - tt) / 0.3)
        if a <= 0: continue
        lines = wrap(CL, msg, fm, 340); bw = max(CL.textlength(l, font=fm) for l in lines) + 40; bh = 40 * len(lines) + 24
        yy = y + (1 - a) * 16
        if side == 'l':
            CL.text((72, yy), who, font=fn, fill=(130, 130, 140)); yy += 30
            bx = 64; fill, tc = (230, 230, 236), (24, 24, 30)
        else:
            bx = w + 2 - bw; fill, tc = (70, 130, 240), (255, 255, 255)
        CL.rounded_rectangle([bx, yy, bx + bw, yy + bh], radius=26, fill=fill + (int(255 * a),))
        for i, l in enumerate(lines): CL.text((bx + 20, yy + 11 + i * 40), l, font=fm, fill=tc + (int(255 * a),))
        y = yy + bh + 18
    scroll = max(0, y - (bot - top))
    crop = C.crop((0, int(scroll), w + 60, int(scroll) + bot - top))
    lay.alpha_composite(crop, (0, top))
    L = ImageDraw.Draw(lay)
    L.rectangle([44, 96, w + 16, top], fill=(242, 240, 238)); L.line([(44, top), (w + 16, top)], fill=(220, 218, 214), width=2)
    L.rounded_rectangle([44, 44, w + 16, 110], radius=48, fill=(242, 240, 238)); L.rectangle([44, 80, w + 16, 110], fill=(242, 240, 238))
    L.rounded_rectangle([w / 2 - 40, 58, w / 2 + 100, 86], radius=14, fill=(24, 24, 30))
    L.ellipse([70, 118, 140, 188], fill=(120, 170, 130)); fi = INTER('800', 26)
    L.text((105 - L.textlength('SG', font=fi) / 2, 138), 'SG', font=fi, fill=(255, 255, 255))
    L.text((158, 118), 'small group', font=INTER('700', 34), fill=(24, 24, 30))
    ur = 47 if t < OPEN + 0.9 else max(0, 47 - int(47 * ease((t - OPEN - 0.9) / 3.6)))
    L.text((158, 158), f'{ur} unread' if ur else 'you, maya, sarah, jess, hannah', font=INTER('500', 24), fill=(200, 70, 70) if ur else (120, 120, 128))
    im.paste(lay, (int(x0 - 30), int(y0 - 30)), lay)

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
    if t < REPLY + 0.3: llab, lval, lcol = "DAYS I'VE BEEN QUIET", f'x{days(t)}', (240, 80, 80)
    else: llab, lval, lcol = 'DAYS UNTIL COFFEE', 'x1', (90, 220, 120)
    if t < OPEN + 0.9: rlab, rval, rcol = 'UNREAD (GROUP CHAT)', f'{unread(t)}', (240, 80, 80)
    elif t < OPEN + 2.6: rlab, rval, rcol = 'UNREAD (GROUP CHAT)', '???', (247, 184, 58)
    else: rlab, rval, rcol = 'PEOPLE CHECKING ON ME', 'x4', (90, 220, 120)
    for cx, lab in ((290, llab), (790, rlab)):
        f = PIX(30); tw = d.textlength(lab, font=f); d.text((cx - tw / 2, 200), lab, font=f, fill=(150, 150, 160))
    def pulse(ts):
        m = min([abs(t - x) for x in ts] + [9]); return 1 + 0.25 * max(0, 1 - m / 0.25)
    lp = pulse([tt + 0.3 for tt, _ in THOUGHTS] + [REPLY + 0.3]); rp = pulse([tt + 0.3 for tt, _ in THOUGHTS] + [OPEN + 2.6])
    f = MONT(80 * lp); tw = d.textlength(lval, font=f); d.text((290 - tw / 2, 245 - (lp - 1) * 40), lval, font=f, fill=lcol)
    f = MONT(80 * rp); tw = d.textlength(rval, font=f); d.text((790 - tw / 2, 245 - (rp - 1) * 40), rval, font=f, fill=rcol)
    for i in range(4):
        x = 210 + i * 40; on = i < days(t)
        col = ((200, 60, 70) if t < REPLY + 0.3 else (120, 100, 60)) if on else (50, 50, 60)
        d.rounded_rectangle([x, 350, x + 28, 378], radius=5, fill=col)
    for i in range(4):
        x = 710 + i * 40; ok = t >= OPEN + 2.6 and t >= MSGS[i][0]
        d.rounded_rectangle([x, 350, x + 28, 378], radius=5, fill=(70, 170, 100) if ok else (50, 50, 60))
    d.line([(540, 210), (540, 370)], fill=(60, 60, 70), width=3)

def frame(T):
    im = Image.new('RGB', (W, H), (10, 10, 14))
    sc = room(min(T, PUNCH))
    fade = np.clip(np.linspace(5, 0, PH), 0, 1)[:, None] * np.ones((1, PW)); m = Image.fromarray((fade * 255).astype(np.uint8))
    im.paste(sc, (0, PY), m)
    ref = sc.transpose(Image.FLIP_TOP_BOTTOM).crop((0, 0, PW, 300)).filter(ImageFilter.GaussianBlur(3))
    rm = Image.fromarray((np.linspace(70, 0, 300)[:, None] * np.ones((1, PW))).astype(np.uint8))
    im.paste(ref, (0, PY + 780 + 4), rm)
    hud(im, T)
    for tt, txt in THOUGHTS:
        if tt <= T < tt + 2.4: bubble(im, 560, PY + 40, txt, T - tt, 'think', 0.2)
    if PICK - 0.2 <= T < OPEN + 0.6: bubble(im, 250, PY + 120, '...47?', T - PICK + 0.2, 'say', 0.6)
    phone_ui(im, min(T, PUNCH))
    if CLOSE + 0.3 <= T < PUNCH: bubble(im, 560, PY + 60, 'THEY... NOTICED.', T - CLOSE - 0.3, 'think', 0.2)
    if T >= PUNCH:
        k = ease((T - PUNCH) / 0.5)
        im = Image.blend(im, Image.new('RGB', (W, H), (8, 8, 12)), 0.82 * k); d = ImageDraw.Draw(im)
        tv = T - PUNCH
        if T < VERSE:
            rows = [('ME GOING QUIET?', (245, 245, 245), 0.2), ('"NOBODY WILL NOTICE."', (240, 80, 80), 0.7),
                    ('THE GROUP CHAT?', (245, 245, 245), 1.6), ('NOTICED. 47 TIMES.', (247, 184, 58), 2.1)]
            for i, (txt, col, st) in enumerate(rows):
                a = ease((tv - st) / 0.3)
                if a <= 0: continue
                fs = 72
                while d.textlength(txt, font=MONT(fs)) > 960: fs -= 2
                f = MONT(fs); tw = d.textlength(txt, font=f)
                d.text(((W - tw) / 2, 790 + i * 100 + (i >= 2) * 60 + (1 - a) * 20), txt, font=f, fill=mix((8, 8, 12), col, a))
        else:
            a = ease((T - VERSE) / 0.8); fv = ImageFont.truetype(f'{FD}/lora-latin-500-italic.ttf', 54)
            for i, l in enumerate(['"Therefore exhort one another,', 'and build each other up,', 'even as you also do."']):
                tw = d.textlength(l, font=fv); d.text(((W - tw) / 2, 830 + i * 76), l, font=fv, fill=mix((8, 8, 12), (235, 235, 235), a))
            r = '1 THESSALONIANS 5:11'; fr = INTER('700', 34); tw = d.textlength(r, font=fr)
            d.text(((W - tw) / 2, 1086), r, font=fr, fill=mix((8, 8, 12), (247, 184, 58), ease((T - VERSE - 0.6) / 0.6)))
    return np.asarray(im)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if CHECK:
        for s in CHECK.split(','): Image.fromarray(frame(float(s))).save(f'{OUT}/check_{s}.jpg', quality=88)
        sys.exit()
    segs = [('a', 0, PICK), ('b', PICK, CLOSE), ('c', CLOSE, PUNCH), ('d', PUNCH, VERSE), ('e', VERSE, TOTAL)]; parts = []
    for name, a, b in segs:
        tmp = f'{OUT}/{name}.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for fi in range(int(round((b - a) * FPS))): p.stdin.write(frame(a + fi / FPS).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, f'{OUT}/{name}.mp4'); parts.append(f'{name}.mp4')
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{x}'\n" for x in parts)); print('parts', parts)
