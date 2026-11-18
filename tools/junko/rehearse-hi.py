#!/usr/bin/env python3
"""Times I rehearsed saying hi (church lobby after service, Junko format: HUD counters, thought-bubble drafts,
a soft Bible Meet notification, a friend walks over and says it first, punchline card, verse).
usage: python3 rehearse-hi.py <outdir> [check t1,t2,..]   -> <outdir>/a.mp4..e.mp4 + list.txt (silent)."""
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

DRAFTS = [(1.0, "HI! I'M NEW HERE."), (3.5, 'HEY... GREAT\nSERMON, RIGHT?'),
          (6.0, 'HELLO. I ALSO\nLIKE... JESUS.'), (8.5, 'OKAY JUST WAVE.\nNO. TOO MUCH.')]
NOTIF, WALK, ARRIVE, MYHI, SIT, PUNCH, VERSE, TOTAL = 11.4, 14.2, 15.6, 17.4, 19.0, 21.0, 25.2, 29.8
MX, HX, FL = 400, 640, 780
REH_MAX = 14

def glow_finish(im, glow, amt=0.6):
    gs = glow.filter(ImageFilter.GaussianBlur(12)).resize(im.size, Image.BILINEAR)
    return Image.fromarray(np.clip(np.asarray(im, np.float32) + np.asarray(gs, np.float32) * amt, 0, 255).astype(np.uint8))

def stand(d, x, s, shirt, mood, hair, t, seed, arm='lap', tilt=0.0, sway=0.0):
    # 'walk' pose frozen mid-stride = standing; a tiny sway keeps it alive
    tt = (-seed + sway * math.sin(t * 1.3 + seed)) / 6
    return S.person(d, x, FL + 6, s, shirt, 'walk', mood, None, (hair, None), tt, seed, arm, head_tilt=tilt)

def lobby(t):
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); g = ImageDraw.Draw(glow); k4 = SS / 4
    def G(x, y, r, c): g.ellipse([(x - r) * k4, (y - r) * k4, (x + r) * k4, (y + r) * k4], fill=c)
    warm = ease((t - SIT) / 1.4)
    im.paste(vgrad(PW * SS, FL * SS, mix((214, 196, 170), (232, 200, 160), warm), mix((190, 170, 146), (214, 178, 136), warm)), (0, 0))
    im.paste(vgrad(PW * SS, (PH - FL) * SS, (120, 84, 62), (40, 28, 22)), (0, FL * SS))
    d.rect([0, FL - 8, PW, FL + 4], (150, 112, 84))
    d.rect([0, 640, PW, 652], (170, 140, 112))  # chair rail
    # two tall arched stained-glass windows
    for wx in (470, 860):
        w, top, bot = 120, 150, 520
        d.rect([wx - 8, top + 52, wx + w + 8, bot + 8], (120, 92, 70), r=6); d.ell([wx - 8, top - 8, wx + w + 8, top + 112], (120, 92, 70))
        cols = [(90, 150, 210), (240, 190, 80), (200, 90, 90), (110, 170, 120)]
        for j in range(4):
            for i in range(2):
                d.rect([wx + i * w / 2 + 3, top + 60 + j * (bot - top - 60) / 4 + 3, wx + (i + 1) * w / 2 - 3, top + 60 + (j + 1) * (bot - top - 60) / 4 - 3],
                       cols[(i + j) % 4], r=2)
        d.ell([wx, top, wx + w, top + 104], (240, 214, 120)); d.cap(wx + w / 2, top + 52, 22, (250, 240, 200))
        # sunbeam on the floor
        G(wx + 60, FL + 40, 120, (70, 56, 30)); G(wx + 60, 330, 120, (60, 50, 26))
    # double doors to the sanctuary (center-right), one cracked open
    d.rect([640, 300, 800, FL - 6], (96, 66, 46), r=4)
    d.rect([650, 310, 716, FL - 6], (130, 90, 62), r=3); d.rect([724, 310, 790, FL - 6], (130, 90, 62), r=3)
    for xx in (662, 736):
        d.rect([xx, 330, xx + 42, 420], (110, 76, 52), r=3); d.rect([xx, 450, xx + 42, 700], (110, 76, 52), r=3)
    d.rect([708, 520, 714, 570], (220, 190, 100), r=2); d.rect([726, 520, 732, 570], (220, 190, 100), r=2)
    d.rect([630, 286, 810, 302], (86, 58, 40), r=3)
    # welcome banner
    d.rect([140, 120, 400, 190], (70, 90, 130), r=10); fb = S.F('800', 34 * SS)
    tw = ImageDraw.Draw(Image.new('L', (1, 1))).textlength('WELCOME', font=fb) / SS
    d.text((270 - tw / 2, 134), 'WELCOME', fb, (250, 244, 230))
    d.line([(160, 0), (160, 120)], (110, 100, 90), 3); d.line([(380, 0), (380, 120)], (110, 100, 90), 3)
    # bulletin board
    d.rect([170, 260, 360, 400], (170, 130, 90), r=6); d.rect([180, 270, 350, 390], (206, 170, 120), r=4)
    for (x, y, w, h, c) in ((192, 282, 60, 46, (250, 250, 240)), (262, 278, 76, 54, (250, 220, 120)), (196, 340, 70, 40, (160, 200, 230)), (278, 342, 58, 40, (240, 170, 170))):
        d.rect([x, y, x + w, y + h], c, r=2); d.cap(x + w / 2, y + 4, 4, (200, 60, 60))
    # coffee table (left) with urn, cups, donut box
    d.rect([20, 560, 300, 584], (240, 236, 228), r=6); d.rect([20, 584, 300, 700], (230, 224, 214), r=4)
    d.rect([40, 584, 52, FL], (110, 90, 74)); d.rect([268, 584, 280, FL], (110, 90, 74))
    d.rect([50, 440, 120, 560], (176, 180, 186), r=14); d.rect([60, 430, 110, 446], (120, 124, 130), r=6); d.rect([112, 520, 132, 530], (120, 124, 130), r=3)
    for i in range(3):
        sx = 84 + i * 14; ph = t * 2 + i
        d.line([(sx + math.sin(ph) * 4, 420 - (i % 2) * 8), (sx + math.sin(ph + 1) * 4, 396 - (i % 2) * 8)], (255, 255, 255), 3)
    for i in range(4): d.rect([150 + i * 8, 520 - i * 12, 180 + i * 8, 560 - i * 12], (250, 250, 250), r=3, outline=(200, 196, 190), width=1)
    d.rect([200, 536, 290, 560], (240, 150, 170), r=4); d.rect([200, 528, 290, 540], (250, 200, 210), r=4)
    S.plant(d, 1040, FL, (170, 100, 76), (90, 150, 90), t)
    # background groups chatting (smaller = further back), they laugh on and off
    for (bx, sh, hair, sd, ph) in ((800, (210, 90, 90), 'bun', 11, 0.0), (930, (90, 120, 180), 'bob', 12, 1.3)):
        m = 'laugh' if math.sin(t * 1.6 + ph) > 0.2 else 'smile'
        S.person(d, bx, FL + 2, 112, sh, 'walk', m, None, (hair, None), -sd / 6, sd, 'lap', head_tilt=(0.2 if bx < 860 else -0.2))
    # Hannah walks over from the right
    if WALK <= t < ARRIVE:
        k = ease((t - WALK) / (ARRIVE - WALK))
        S.person(d, lerp(1180, HX, k), FL + 6, 176, (96, 170, 110), 'walk', 'smile', None, ('long', None), t, 5, 'lap')
    elif t >= ARRIVE:
        stand(d, HX, 176, (96, 170, 110), 'laugh' if SIT <= t < SIT + 1.2 else 'smile', 'long', t, 5, 'lap', tilt=-0.18, sway=0.3)
    # main character, coffee cup in hand; slumps as the rehearsals pile up, looks up at the notification
    nervous = t < MYHI + 0.6
    tilt = (-0.1 * ease(t / 10) if t < NOTIF else 0.05) if nervous else 0.15
    hand = stand(d, MX, 186, None, 'sad' if (nervous and not (NOTIF + 0.6 <= t < NOTIF + 2.0)) else 'smile', 'bob', t, 1, 'phone', tilt=tilt, sway=0.4 if nervous else 0.2)
    d.rect([hand[0] - 20, hand[1] - 36, hand[0] + 20, hand[1] + 8], (250, 250, 250), r=4, outline=(180, 176, 170), width=2)
    d.rect([hand[0] - 20, hand[1] - 18, hand[0] + 20, hand[1] - 6], (150, 110, 80))
    if NOTIF <= t < NOTIF + 1.0:  # phone buzz glow in the pocket
        G(MX + 40, FL - 260, 40, (70, 100, 160))
    out = glow_finish(im, glow).resize((PW, PH), Image.LANCZOS)
    if t >= NOTIF:
        big = out.resize((PW * SS, PH * SS)); db = D(big)
        kk = ease((t - NOTIF) / 0.4) * (1 - ease((t - NOTIF - 2.6) / 0.4))
        if kk > 0:
            S.notif(db, big, 220, 60, kk, 'Hannah', "are you by the coffee? i'm in green :)")
            out = big.resize((PW, PH), Image.LANCZOS)
    return out

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

def reh(t):
    if t < 1.0: return 0
    return min(REH_MAX, 1 + int((t - 1.0) / ((NOTIF - 1.6) / (REH_MAX - 1))))

def hud(im, t):
    d = ImageDraw.Draw(im)
    n = reh(t)
    if t < MYHI + 0.3:
        llab, lval, lcol = 'TIMES I REHEARSED "HI"', f'x{n}', (240, 80, 80)
    else:
        llab, lval, lcol = 'REHEARSED LINES USED', f'0/{REH_MAX}', (247, 184, 58)
    rlab = "PEOPLE I'VE TALKED TO"
    if t < NOTIF: rval, rcol = 'x0', (240, 80, 80)
    elif t < ARRIVE + 0.4: rval, rcol = '???', (247, 184, 58)
    else: rval, rcol = 'x1', (90, 220, 120)
    for cx, lab in ((290, llab), (790, rlab)):
        f = PIX(30); tw = d.textlength(lab, font=f); d.text((cx - tw / 2, 200), lab, font=f, fill=(150, 150, 160))
    # pulse the left number on every new rehearsal
    lp = 1.0
    if 1.0 <= t < NOTIF:
        step = (NOTIF - 1.6) / (REH_MAX - 1); ph = ((t - 1.0) % step) / 0.22
        if ph < 1 and n < REH_MAX or t - 1.0 < 0.22: lp = 1 + 0.2 * (1 - min(1, ph))
    if abs(t - MYHI - 0.3) < 0.25: lp = 1 + 0.25 * (1 - abs(t - MYHI - 0.3) / 0.25)
    f = MONT(80 * lp); tw = d.textlength(lval, font=f); d.text((290 - tw / 2, 245 - (lp - 1) * 40), lval, font=f, fill=lcol)
    rp = 1 + 0.25 * (1 - abs(t - ARRIVE - 0.4) / 0.25) if abs(t - ARRIVE - 0.4) < 0.25 else 1
    f = MONT(80 * rp); tw = d.textlength(rval, font=f); d.text((790 - tw / 2, 245 - (rp - 1) * 40), rval, font=f, fill=rcol)
    # left: a tally strip of rehearsals; right: one box that turns green
    for i in range(REH_MAX):
        x = 290 - REH_MAX * 13 + i * 26
        on = i < n
        d.rounded_rectangle([x, 352, x + 18, 370], radius=4, fill=((200, 60, 70) if t < MYHI + 0.3 else (120, 100, 60)) if on else (50, 50, 60))
    for i in range(4):
        x = 720 + i * 40
        ok = i == 0 and t >= ARRIVE + 0.4
        d.rounded_rectangle([x, 350, x + 28, 378], radius=5, fill=(70, 170, 100) if ok else (50, 50, 60))
    d.line([(540, 210), (540, 370)], fill=(60, 60, 70), width=3)

def frame(T):
    im = Image.new('RGB', (W, H), (10, 10, 14))
    sc = lobby(min(T, PUNCH))
    fade = np.clip(np.linspace(5, 0, PH), 0, 1)[:, None] * np.ones((1, PW)); m = Image.fromarray((fade * 255).astype(np.uint8))
    im.paste(sc, (0, PY), m)
    ref = sc.transpose(Image.FLIP_TOP_BOTTOM).crop((0, 0, PW, 300)).filter(ImageFilter.GaussianBlur(3))
    rm = Image.fromarray((np.linspace(70, 0, 300)[:, None] * np.ones((1, PW))).astype(np.uint8))
    im.paste(ref, (0, PY + 780 + 4), rm)
    hud(im, T)
    for tt, txt in DRAFTS:
        if tt <= T < tt + 2.3: bubble(im, 640, PY + 60, txt, T - tt, 'think', 0.22)
    if NOTIF + 0.7 <= T < NOTIF + 2.4: bubble(im, 230, PY + 250, '!!', T - NOTIF - 0.7, 'say', 0.75)
    if ARRIVE <= T < MYHI: bubble(im, 790, PY + 150, "HI! I'M HANNAH!", T - ARRIVE, 'say', 0.25)
    if MYHI <= T < SIT + 0.2: bubble(im, 270, PY + 200, '...HI.', T - MYHI, 'say', 0.75)
    if SIT <= T < PUNCH: bubble(im, 800, PY + 150, 'COME SIT\nWITH US!', T - SIT, 'say', 0.25)
    if T >= PUNCH:
        k = ease((T - PUNCH) / 0.5)
        im = Image.blend(im, Image.new('RGB', (W, H), (8, 8, 12)), 0.82 * k); d = ImageDraw.Draw(im)
        tv = T - PUNCH
        if T < VERSE:
            rows = [('ME PRACTICING "HI"?', (245, 245, 245), 0.2), ('14 DRAFTS.', (240, 80, 80), 0.7),
                    ('HER SAYING IT FIRST?', (245, 245, 245), 1.6), ('ONE TAKE.', (247, 184, 58), 2.1)]
            for i, (txt, col, st) in enumerate(rows):
                a = ease((tv - st) / 0.3)
                if a <= 0: continue
                f = MONT(72); tw = d.textlength(txt, font=f)
                d.text(((W - tw) / 2, 790 + i * 100 + (i >= 2) * 60 + (1 - a) * 20), txt, font=f, fill=mix((8, 8, 12), col, a))
        else:
            a = ease((T - VERSE) / 0.8); fv = ImageFont.truetype(f'{FD}/lora-latin-500-italic.ttf', 54)
            for i, l in enumerate(['"Therefore accept one another,', 'even as Christ also accepted you,', 'to the glory of God."']):
                tw = d.textlength(l, font=fv); d.text(((W - tw) / 2, 830 + i * 76), l, font=fv, fill=mix((8, 8, 12), (235, 235, 235), a))
            r = 'ROMANS 15:7'; fr = INTER('700', 34); tw = d.textlength(r, font=fr)
            d.text(((W - tw) / 2, 1086), r, font=fr, fill=mix((8, 8, 12), (247, 184, 58), ease((T - VERSE - 0.6) / 0.6)))
    return np.asarray(im)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if CHECK:
        for s in CHECK.split(','): Image.fromarray(frame(float(s))).save(f'{OUT}/check_{s}.jpg', quality=88)
        sys.exit()
    segs = [('a', 0, NOTIF), ('b', NOTIF, SIT), ('c', SIT, PUNCH), ('d', PUNCH, VERSE), ('e', VERSE, TOTAL)]; parts = []
    for name, a, b in segs:
        tmp = f'{OUT}/{name}.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for fi in range(int(round((b - a) * FPS))): p.stdin.write(frame(a + fi / FPS).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, f'{OUT}/{name}.mp4'); parts.append(f'{name}.mp4')
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{x}'\n" for x in parts)); print('parts', parts)
