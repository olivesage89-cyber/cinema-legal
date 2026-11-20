#!/usr/bin/env python3
"""New in the city (Junko format): empty apartment full of moving boxes at dusk, HUD counters, thought bubbles,
a Bible Meet notification about a Bible study nearby, then a warm living room where she meets six people,
punchline card, verse (Psalm 68:6). app: notif.
usage: python3 new-city.py <outdir> [check t1,t2,..]   -> <outdir>/a.mp4..e.mp4 + list.txt (silent)."""
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

THOUGHTS = [(1.0, 'THE BOXES ARE\nMY ROOMMATES NOW.'), (3.6, 'I SAID GOODNIGHT\nTO MY PLANT.'),
            (6.2, "MAYBE I'M JUST\nMEANT TO BE ALONE."), (8.8, 'THE PIZZA GUY\nCOUNTS, RIGHT?')]
DAYS = [3, 12, 27, 41]
BUZZ, SCENE2, PUNCH, VERSE, TOTAL = 11.6, 16.0, 22.8, 26.8, 30.4
PICK = BUZZ + 1.0
HELLOS = [(16.7, 'HI! YOU MUST\nBE NEW!', 2), (18.0, 'SIT WITH US!', 4), (19.3, 'WE MADE\nTOO MUCH SOUP.', 6)]
FRIENDS = [  # x, y, scale, shirt, hair, pose
    (480, 650, 150, (90, 160, 110), ('long', None), 'sit'), (630, 650, 150, (210, 90, 90), ('bob', None), 'sit'),
    (780, 650, 150, (230, 190, 80), ('bun', None), 'sit'), (1000, 660, 150, (140, 110, 190), ('bob', None), 'sit'),
    (880, 730, 120, (80, 130, 190), ('long', None), 'sit'), (330, 800, 150, (230, 140, 90), ('bun', None), 'walk')]

def glow_finish(im, glow, amt=0.6):
    gs = glow.filter(ImageFilter.GaussianBlur(12)).resize(im.size, Image.BILINEAR)
    return Image.fromarray(np.clip(np.asarray(im, np.float32) + np.asarray(gs, np.float32) * amt, 0, 255).astype(np.uint8))

def nthought(t): return sum(1 for tt, _ in THOUGHTS if t >= tt + 0.3)

def box(d, x, y, w, h, label=None, c=(196, 150, 100)):
    d.rect([x, y, x + w, y + h], c, r=4); d.rect([x, y, x + w, y + h * 0.16], mix(c, (255, 255, 255), 0.12), r=4)
    d.rect([x + w / 2 - 10, y, x + w / 2 + 10, y + h * 0.4], mix(c, (240, 230, 200), 0.45))
    d.line([(x, y + h * 0.16), (x + w, y + h * 0.16)], mix(c, (0, 0, 0), 0.25), 2)
    if label: f = MONT(18 * SS); d.text((x + 14, y + h * 0.56), label, f, mix(c, (40, 30, 20), 0.7))

def apartment(t):
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); g = ImageDraw.Draw(glow); k4 = SS / 4
    def G(x, y, r, c): g.ellipse([(x - r) * k4, (y - r) * k4, (x + r) * k4, (y + r) * k4], fill=c)
    dusk = ease(t / 11)
    im.paste(vgrad(PW * SS, FL * SS, mix((150, 140, 150), (84, 82, 112), dusk), mix((120, 112, 124), (62, 60, 88), dusk)), (0, 0))
    im.paste(vgrad(PW * SS, (PH - FL) * SS, (120, 92, 70), (60, 44, 34)), (0, FL * SS))
    d.rect([0, FL - 6, PW, FL + 4], (90, 70, 56))
    for i in range(7): d.line([(i * 170 - 40, FL + 4), (i * 170 - 120, PH)], (100, 76, 58), 3)
    # big bare window with sunset -> dusk + city skyline
    S.window(d, 70, 130, 300, 320, (220, 214, 206), mix((250, 160, 110), (70, 70, 120), dusk), mix((250, 210, 150), (150, 100, 120), dusk),
             t, night=dusk > 0.6, panel=im)
    for i in range(11):
        bx = 82 + i * 26; bh = 50 + (i * 41) % 90
        d.rect([bx, 440 - bh, bx + 22, 440], mix((120, 100, 120), (34, 34, 60), dusk))
        for j in range(3):
            if (i + j) % 2 and dusk > 0.5: d.rect([bx + 7, 440 - bh + 10 + j * 16, bx + 13, 440 - bh + 16 + j * 16], (250, 214, 120))
    d.line([(220, 130), (220, 450)], (220, 214, 206), 7); d.line([(70, 290), (370, 290)], (220, 214, 206), 7)
    # bare bulb from ceiling
    d.line([(560, 0), (560, 170)], (50, 46, 44), 3); d.rect([550, 160, 570, 176], (70, 66, 60), r=3); d.cap(560, 190, 18, (255, 236, 180))
    G(560, 190, 90, (90, 74, 40))
    # empty wall: nail with nothing on it, one lonely frame leaning on the floor
    d.cap(760, 200, 4, (90, 80, 76)); d.cap(900, 240, 4, (90, 80, 76))
    # stacks of moving boxes (right + back)
    box(d, 760, 560, 170, 140, 'BOOKS'); box(d, 940, 520, 140, 180, 'KITCHEN', (186, 140, 92))
    box(d, 790, 430, 130, 130, 'MISC', (206, 160, 108)); box(d, 950, 400, 120, 120, None, (196, 150, 100))
    box(d, 770, 700, 300, 80, 'FRAGILE', (180, 136, 90))
    # mattress on the floor
    d.rect([410, 730, 720, 782], (236, 232, 226), r=14); d.rect([410, 768, 720, 782], (210, 204, 196), r=6)
    d.rect([620, 712, 712, 740], (250, 248, 244), r=12)
    # pizza box on the floor
    d.rect([60, 742, 200, 772], (230, 200, 150), r=3); d.line([(60, 752), (200, 752)], (200, 170, 120), 2); d.cap(130, 762, 8, (200, 70, 60))
    # her box-seat + the plant beside her (her only "roommate")
    box(d, 240, 620, 160, 160, 'STUFF', (206, 158, 104))
    S.plant(d, 455, 730, (190, 110, 80), (90, 150, 90), t)
    # phone on the box next to her
    picked = t >= PICK; buzz = BUZZ <= t < PICK
    if not picked:
        jit = math.sin(t * 90) * 3 if buzz else 0
        d.rect([370 + jit, 608, 396 + jit, 620], (230, 240, 255) if t >= BUZZ else (40, 40, 50), r=3)
        if t >= BUZZ: G(383, 612, 50, (70, 100, 160))
    sad = t < PICK + 0.4
    hand = S.person(d, 310, 620, 200, None, 'sit', 'sad' if sad else 'smile', None, ('bun', None), t, 1,
                    'phone' if picked else 'lap', head_tilt=-0.15 * ease(t / 10) if sad else 0.05)
    if picked:
        d.rect([hand[0] - 24, hand[1] - 42, hand[0] + 24, hand[1] + 32], (230, 240, 255), r=8); G(hand[0], hand[1] - 10, 30, (40, 60, 100))
    out = glow_finish(im, glow)
    if t >= BUZZ:
        db = D(out); kk = ease((t - BUZZ) / 0.4) * (1 - ease((t - BUZZ - 3.0) / 0.4))
        S.notif(db, out, 220, 50, kk, 'Bible study tonight', '0.4 mi away · 6 going · tap to join')
    return out.resize((PW, PH), Image.LANCZOS)

def livingroom(t):
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); gd = D(glow)
    class GL:  # string_lights expects a D-like with cap() on the glow canvas (1/4 res)
        def cap(s, x, y, r, c): ImageDraw.Draw(glow).ellipse([(x - r) * SS / 4, (y - r) * SS / 4, (x + r) * SS / 4, (y + r) * SS / 4], fill=c)
    im.paste(vgrad(PW * SS, FL * SS, (196, 132, 96), (156, 98, 74)), (0, 0))
    im.paste(vgrad(PW * SS, (PH - FL) * SS, (110, 74, 54), (54, 36, 28)), (0, FL * SS))
    d.rect([0, FL - 6, PW, FL + 4], (96, 62, 46))
    S.window(d, 40, 150, 200, 230, (120, 80, 60), (40, 44, 86), (90, 70, 110), t, panel=im)
    S.string_lights(d, GL(), 0, PW, 70, t)
    S.frames_on_wall(d, [(450, 200, 110, 90, (120, 80, 56), (150, 190, 210)), (590, 180, 90, 120, (120, 80, 56), (230, 200, 120)),
                         (710, 210, 130, 80, (120, 80, 56), (200, 150, 160))])
    d.rect([880, 170, 980, 186], (120, 80, 56)); d.rect([900, 120, 920, 170], (90, 130, 170), r=3); d.rect([924, 130, 942, 170], (200, 90, 80), r=3)
    # floor lamp
    d.rect([1040, 300, 1048, FL], (70, 50, 40)); d.poly([(1010, 300), (1078, 300), (1066, 250), (1022, 250)], (255, 226, 170))
    GL().cap(1044, 290, 70, (110, 84, 40))
    # rug, couch, coffee table with soup + snacks
    d.ell([240, 760, 1040, 860], (150, 80, 70))
    d.rect([340, 520, 920, 600], (80, 110, 120), r=30); d.rect([330, 600, 930, 700], (90, 122, 132), r=20)
    d.rect([300, 560, 360, 710], (80, 110, 120), r=24); d.rect([900, 560, 960, 710], (80, 110, 120), r=24)
    # armchairs: hers (left) and friend's (right)
    for ax, col in ((50, (190, 140, 90)), (930, (170, 120, 150))):
        d.rect([ax, 540, ax + 150, 620], col, r=28); d.rect([ax - 10, 610, ax + 160, 712], mix(col, (255, 255, 255), 0.08), r=20)
    d.rect([500, 720, 800, 740], (120, 80, 56), r=6); d.rect([520, 740, 534, 790], (100, 66, 46)); d.rect([766, 740, 780, 790], (100, 66, 46))
    d.rect([560, 690, 620, 720], (240, 238, 232), r=8); d.ell([566, 684, 614, 698], (230, 150, 70))
    d.rect([660, 700, 740, 720], (230, 200, 140), r=6)
    for i in range(3): d.cap(678 + i * 22, 698, 8, (200, 140, 80))
    d.rect([520, 680, 540, 720], (250, 250, 250), r=4)
    d.ell([830, 800, 960, 840], (200, 150, 90))
    # friends
    hellos = [h for h in HELLOS if t >= h[0]]
    for i, (x, y, s, sh, hair, pose) in enumerate(FRIENDS):
        hand = S.person(d, x, y, s, sh, pose, 'laugh' if i % 2 else 'smile', None, hair, t, 10 + i,
                        'umbrella' if pose == 'walk' else 'lap', head_tilt=-0.15 if pose == 'sit' and x > 600 else 0.12)
        if pose == 'walk' and hand: d.ell([hand[0] - 34, hand[1] - 10, hand[0] + 34, hand[1] + 12], (240, 238, 232)); d.ell([hand[0] - 26, hand[1] - 14, hand[0] + 26, hand[1] - 2], (220, 120, 90))
    # her, upright and smiling in the left armchair
    S.person(d, 125, 660, 160, None, 'sit', 'smile', None, ('bun', None), t, 1, 'lap', head_tilt=0.15)
    return glow_finish(im, glow, 0.7).resize((PW, PH), Image.LANCZOS)

def room(t):
    if t < SCENE2: return apartment(t)
    return livingroom(t)

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

def known(t):
    n = 0
    for tt, _, v in HELLOS:
        if t >= tt + 0.3: n = v
    return n

def hud(im, t):
    d = ImageDraw.Draw(im); n = nthought(t)
    days = DAYS[n - 1] if n else 1
    if n < 4 and t < THOUGHTS[-1][0] + 0.3:
        nxt = DAYS[n]; tt = THOUGHTS[n][0]
        if t >= tt - 1.0: days = int(lerp(days, nxt, ease((t - tt + 1.0) / 1.3)))
    lval, lcol = f'x{days}', (240, 80, 80) if t < SCENE2 else (247, 184, 58)
    if t < THOUGHTS[3][0] + 0.3: rval, rcol = '0', (240, 80, 80)
    elif t < SCENE2 + 0.4: rval, rcol = '1?', (247, 184, 58)
    else: rval, rcol = f'{known(t)}' if known(t) else '1?', (90, 220, 120) if known(t) else (247, 184, 58)
    for cx, lab in ((290, 'DAYS IN THIS CITY'), (790, 'PEOPLE I KNOW HERE')):
        f = PIX(30); tw = d.textlength(lab, font=f); d.text((cx - tw / 2, 200), lab, font=f, fill=(150, 150, 160))
    def pulse(ts):
        m = min([abs(t - x) for x in ts] + [9]); return 1 + 0.25 * max(0, 1 - m / 0.25)
    lp = pulse([tt + 0.3 for tt, _ in THOUGHTS]); rp = pulse([THOUGHTS[3][0] + 0.3] + [h[0] + 0.3 for h in HELLOS])
    f = MONT(80 * lp); tw = d.textlength(lval, font=f); d.text((290 - tw / 2, 245 - (lp - 1) * 40), lval, font=f, fill=lcol)
    f = MONT(80 * rp); tw = d.textlength(rval, font=f); d.text((790 - tw / 2, 245 - (rp - 1) * 40), rval, font=f, fill=rcol)
    for i in range(4):
        x = 210 + i * 40; on = i < n
        d.rounded_rectangle([x, 350, x + 28, 378], radius=5, fill=((200, 60, 70) if t < SCENE2 else (150, 120, 60)) if on else (50, 50, 60))
    kn = known(t)
    for i in range(6):
        x = 670 + i * 40; ok = i < kn
        d.rounded_rectangle([x, 350, x + 28, 378], radius=5, fill=(70, 170, 100) if ok else (50, 50, 60))
    d.line([(540, 210), (540, 370)], fill=(60, 60, 70), width=3)

def frame(T):
    im = Image.new('RGB', (W, H), (10, 10, 14))
    sc = room(min(T, PUNCH))
    # whoosh transition: quick dip to dark around SCENE2
    dip = max(0, 1 - abs(T - SCENE2) / 0.35)
    if dip > 0: sc = Image.blend(sc, Image.new('RGB', sc.size, (8, 8, 12)), dip)
    fade = np.clip(np.linspace(5, 0, PH), 0, 1)[:, None] * np.ones((1, PW)); m = Image.fromarray((fade * 255).astype(np.uint8))
    im.paste(sc, (0, PY), m)
    ref = sc.transpose(Image.FLIP_TOP_BOTTOM).crop((0, 0, PW, 300)).filter(ImageFilter.GaussianBlur(3))
    rm = Image.fromarray((np.linspace(70, 0, 300)[:, None] * np.ones((1, PW))).astype(np.uint8))
    im.paste(ref, (0, PY + 780 + 4), rm)
    hud(im, T)
    for tt, txt in THOUGHTS:
        if tt <= T < tt + 2.4: bubble(im, 560, PY + 150, txt, T - tt, 'think', 0.2)
    if PICK + 0.6 <= T < SCENE2 - 0.3: bubble(im, 640, PY + 300, '0.4 MILES...?', T - PICK - 0.6, 'say', 0.15)
    if SCENE2 <= T < PUNCH:
        pos = [(520, PY + 90, 0.4), (860, PY + 110, 0.6), (440, PY + 196, 0.25)]
        for (tt, txt, _), (cx, y, tl) in zip(HELLOS, pos):
            if tt <= T < tt + (1.5 if tt < HELLOS[-1][0] else 1.6): bubble(im, cx, y, txt, T - tt, 'say', tl)
        if T >= 21.0: bubble(im, 270, PY + 110, 'I KNOW PEOPLE.', T - 21.0, 'think', 0.12)
    if T >= PUNCH:
        k = ease((T - PUNCH) / 0.5)
        im = Image.blend(im, Image.new('RGB', (W, H), (8, 8, 12)), 0.82 * k); d = ImageDraw.Draw(im)
        tv = T - PUNCH
        if T < VERSE:
            rows = [('MY FRIENDS IN THIS CITY?', (245, 245, 245), 0.2), ('ONE HOUSEPLANT.', (240, 80, 80), 0.7),
                    ('ONE BIBLE STUDY LATER?', (245, 245, 245), 1.6), ('SIX. PLANT STILL #1.', (247, 184, 58), 2.1)]
            for i, (txt, col, st) in enumerate(rows):
                a = ease((tv - st) / 0.3)
                if a <= 0: continue
                fs = 72
                while d.textlength(txt, font=MONT(fs)) > 960: fs -= 2
                f = MONT(fs); tw = d.textlength(txt, font=f)
                d.text(((W - tw) / 2, 790 + i * 100 + (i >= 2) * 60 + (1 - a) * 20), txt, font=f, fill=mix((8, 8, 12), col, a))
        else:
            a = ease((T - VERSE) / 0.8); fv = ImageFont.truetype(f'{FD}/lora-latin-500-italic.ttf', 60)
            for i, l in enumerate(['"God sets the lonely', 'in families."']):
                tw = d.textlength(l, font=fv); d.text(((W - tw) / 2, 860 + i * 84), l, font=fv, fill=mix((8, 8, 12), (235, 235, 235), a))
            r = 'PSALM 68:6'; fr = INTER('700', 34); tw = d.textlength(r, font=fr)
            d.text(((W - tw) / 2, 1060), r, font=fr, fill=mix((8, 8, 12), (247, 184, 58), ease((T - VERSE - 0.6) / 0.6)))
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
