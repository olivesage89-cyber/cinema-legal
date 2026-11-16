#!/usr/bin/env python3
"""Junko-style drawing library + the approved ALONE vs TOGETHER split-screen video.
  import lib            -> D (2x drawing wrapper), vgrad, ease/lerp/mix, person() (faceless mannequin),
                           window(), frames_on_wall(), plant(), string_lights(), notif() (Bible Meet notification),
                           scene() (the split-screen rooms), F (Inter fonts)
  python3 lib.py <outdir> [check t1,t2]   -> renders the split-screen video parts (see README)"""
import sys, os, math, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
FD, ICON = HERE + '/fonts', HERE + '/assets/appicon.png'
OUT = sys.argv[1] if __name__ == '__main__' and len(sys.argv) > 1 else '.'
W, H, FPS = 1080, 1920, 30
PX, PW, PH, Y1, Y2 = 20, 1040, 800, 110, 960
SS = 2
F = lambda w, s: ImageFont.truetype(f'{FD}/inter-{w}.ttf', int(s))
ICON_IM = Image.open(ICON).convert('RGB')

BEATS = [('night', 5.4), ('evening', 5.4), ('church', 5.0), ('end', 4.6)]
STARTS = np.cumsum([0] + [b[1] for b in BEATS]); TOTAL = float(STARTS[-1])
def ease(x): x = min(1, max(0, x)); return x * x * (3 - 2 * x)
def lerp(a, b, k): return a + (b - a) * k
def mix(c1, c2, k): return tuple(int(lerp(a, b, k)) for a, b in zip(c1, c2))

class D:
    """ImageDraw wrapper taking 1x coordinates on a 2x canvas"""
    def __init__(s, im): s.d = ImageDraw.Draw(im)
    def _b(s, b): return [v * SS for v in b]
    def rect(s, b, fill, r=0, outline=None, width=0):
        if r: s.d.rounded_rectangle(s._b(b), radius=r * SS, fill=fill, outline=outline, width=width * SS)
        else: s.d.rectangle(s._b(b), fill=fill, outline=outline, width=width * SS)
    def ell(s, b, fill, outline=None, width=0): s.d.ellipse(s._b(b), fill=fill, outline=outline, width=width * SS)
    def poly(s, pts, fill): s.d.polygon([(x * SS, y * SS) for x, y in pts], fill=fill)
    def line(s, pts, fill, w): s.d.line([(x * SS, y * SS) for x, y in pts], fill=fill, width=int(w * SS), joint='curve')
    def arc(s, b, a0, a1, fill, w): s.d.arc(s._b(b), a0, a1, fill=fill, width=int(w * SS))
    def pie(s, b, a0, a1, fill): s.d.pieslice(s._b(b), a0, a1, fill=fill)
    def chord(s, b, a0, a1, fill): s.d.chord(s._b(b), a0, a1, fill=fill)
    def text(s, xy, t, f, fill): s.d.text((xy[0] * SS, xy[1] * SS), t, font=f, fill=fill)
    def cap(s, x, y, r, fill): s.ell([x - r, y - r, x + r, y + r], fill)

def vgrad(w, h, c1, c2):
    a = np.linspace(0, 1, h)[:, None, None]; g = np.array(c1) * (1 - a) + np.array(c2) * a
    return Image.fromarray(np.repeat(g, w, 1).astype(np.uint8))

# ---------------- character ----------------
def person(d, x, y, s, shirt, pose, mood, skin, hair, t, seed=0, arm='lap', head_tilt=0.0, look=0.0):
    """faceless mannequin (junko style): cream body, grey outline, emotion through posture"""
    BODY = (240, 234, 224); OL = (120, 116, 112); SH = (214, 208, 198)
    sad = mood in ('sad', 'flat')
    breathe = math.sin(t * 2.2 + seed) * s * 0.012
    def limb(pts, w, col=BODY):
        d.line(pts, OL, w + 5); d.line(pts, col, w)
        for px, py in (pts[0], pts[-1]): d.cap(px, py, w / 2, col)
    def ball(cx, cy, r, col=BODY):
        d.cap(cx, cy, r + 2.5, OL); d.cap(cx, cy, r, col)
    lw, aw = s * 0.25, s * 0.19
    if pose == 'sit':
        hip = (x, y - s * 0.1)
        for sx in (-1, 1):
            k = (x + sx * s * 0.13 + s * 0.05, y)
            limb([(x + sx * s * 0.1, hip[1]), (k[0] + s * 0.18, y - s * 0.02), (k[0] + s * 0.2, y + s * 0.72)], lw, BODY if sx > 0 else SH)
            d.rect([k[0] + s * 0.1, y + s * 0.66, k[0] + s * 0.42, y + s * 0.8], OL, r=s * 0.07)
    else:
        ph = t * 6 + seed; bob = abs(math.sin(ph)) * s * 0.035
        hip = (x, y - s * 0.95 + bob)
        for k, sg in ((0, 1), (1, -1)):
            sw = math.sin(ph + k * math.pi) * s * 0.2
            limb([hip, (x + sw * 0.5 + s * 0.04, y - s * 0.48), (x + sw, y - s * 0.06)], lw, SH if k else BODY)
    slump = s * (0.16 if sad else 0.0)
    neck = (hip[0] + (s * 0.06 if sad else 0), hip[1] - s * 1.05 + slump + breathe)
    # torso: thick pill, optional colored top
    tw = s * 0.42
    if shirt is None: limb([hip, neck], tw)
    else:
        d.line([hip, neck], OL, tw + 5); d.line([hip, neck], shirt, tw); d.cap(neck[0], neck[1], tw / 2, shirt); d.cap(hip[0], hip[1], tw / 2, shirt)
    # head: sad = dropped forward/down
    r = s * 0.34
    hx = neck[0] + head_tilt * s * 0.4 + (s * 0.08 if sad else 0)
    hy = neck[1] - r * (0.55 if sad else 1.25)
    hs, hc = hair; HC = (150, 146, 140)
    if hs == 'long': d.rect([hx - r * 1.1, hy - r * 0.4, hx + r * 1.1, hy + r * 1.5], HC, r=r * 0.6)
    ball(hx, hy, r)
    if hs == 'bun': ball(hx - r * 0.2, hy - r * 1.05, r * 0.42, HC)
    if hs == 'long': d.chord([hx - r * 1.04, hy - r * 1.06, hx + r * 1.04, hy + r * 0.2], 180, 360, HC)
    # soft side shade on head
    d.chord([hx - r, hy - r, hx + r, hy + r], 60, 150, SH)
    # arms
    sh_l, sh_r = (neck[0] - s * 0.16, neck[1] + s * 0.12), (neck[0] + s * 0.16, neck[1] + s * 0.12)
    ret = None
    def arm2(a, b, c, col=BODY): limb([a, b, c], aw, col)
    if arm == 'phone':
        hd = (neck[0] + s * 0.05, neck[1] + s * (0.62 if sad else 0.5))
        arm2(sh_l, (sh_l[0] - s * 0.2, sh_l[1] + s * 0.5), (hd[0] - s * 0.08, hd[1] + s * 0.08), SH); arm2(sh_r, (sh_r[0] + s * 0.2, sh_r[1] + s * 0.5), (hd[0] + s * 0.1, hd[1] + s * 0.08))
        ret = hd
    elif arm == 'pray':
        hd = (neck[0], neck[1] + s * 0.42)
        arm2(sh_l, (sh_l[0] - s * 0.18, sh_l[1] + s * 0.55), (hd[0] - s * 0.03, hd[1]), SH); arm2(sh_r, (sh_r[0] + s * 0.18, sh_r[1] + s * 0.55), (hd[0] + s * 0.03, hd[1]))
        ball(hd[0], hd[1] - s * 0.06, s * 0.09)
    elif arm == 'shoulderR':
        arm2(sh_l, (sh_l[0] - s * 0.2, sh_l[1] + s * 0.55), (x - s * 0.05, neck[1] + s * 0.85), SH)
        arm2(sh_r, (x + s * 0.55, neck[1] - s * 0.05), (x + s * 0.9, neck[1] + s * 0.05))
    elif arm == 'umbrella':
        hd = (neck[0] + s * 0.25, neck[1] + s * 0.2)
        arm2(sh_l, (sh_l[0] - s * 0.15, sh_l[1] + s * 0.55), (sh_l[0], sh_l[1] + s * 0.85), SH); arm2(sh_r, (sh_r[0] + s * 0.3, sh_r[1] + s * 0.4), hd)
        ret = hd
    elif arm == 'link':
        arm2(sh_l, (sh_l[0] - s * 0.35, sh_l[1] + s * 0.35), (x - s * 0.8, neck[1] + s * 0.55), SH); arm2(sh_r, (sh_r[0] + s * 0.35, sh_r[1] + s * 0.35), (x + s * 0.8, neck[1] + s * 0.55))
    else:
        arm2(sh_l, (sh_l[0] - s * 0.18, sh_l[1] + s * 0.5), (x - s * 0.1, neck[1] + s * 0.95), SH); arm2(sh_r, (sh_r[0] + s * 0.18, sh_r[1] + s * 0.5), (x + s * 0.18, neck[1] + s * 0.95))
    return ret

# ---------------- scene helpers ----------------
def window(d, x, y, w, h, frame, sky1, sky2, t, night=True, rain=False, panel=None):
    g = vgrad(int(w * SS), int(h * SS), sky1, sky2); panel.paste(g, (int(x * SS), int(y * SS)))
    if night:
        for i in range(14):
            sx, sy = x + (i * 53) % w, y + (i * 37) % (h * 0.6); tw = 0.5 + 0.5 * math.sin(t * 3 + i)
            d.cap(sx, sy, 1.4 + tw, (230, 230, 255))
        d.cap(x + w * 0.72, y + h * 0.25, w * 0.09, (238, 236, 214))
    d.rect([x, y, x + w, y + h], None, r=6, outline=frame, width=10)
    d.line([(x + w / 2, y), (x + w / 2, y + h)], frame, 7); d.line([(x, y + h * 0.5), (x + w, y + h * 0.5)], frame, 7)

def frames_on_wall(d, items):
    for (x, y, w, h, fr, inner) in items:
        d.rect([x, y, x + w, y + h], fr, r=4); d.rect([x + 8, y + 8, x + w - 8, y + h - 8], inner)
        d.poly([(x + 10, y + h - 10), (x + w * 0.45, y + h * 0.4), (x + w - 10, y + h - 10)], mix(inner, (255, 255, 255), 0.25))

def plant(d, x, y, pot, leaf, t):
    d.rect([x - 26, y - 46, x + 26, y], pot, r=8)
    for i, a in enumerate([-60, -25, 10, 45, 80]):
        sway = math.sin(t * 1.5 + i) * 3
        ang = math.radians(a - 90 + sway); L = 60 + (i % 2) * 18
        ex, ey = x + math.cos(ang) * L, y - 46 + math.sin(ang) * L
        d.line([(x, y - 46), (ex, ey)], leaf, 13)

def string_lights(d, gl, x0, x1, y, t, on=True):
    pts = [(x0 + (x1 - x0) * k / 40, y + math.sin(k / 40 * math.pi) * 26) for k in range(41)]
    d.line(pts, (70, 60, 50), 2)
    for i in range(1, 40, 4):
        bx, by = pts[i]; tw = 0.7 + 0.3 * math.sin(t * 4 + i)
        d.cap(bx, by + 8, 6, (255, int(220 * tw), int(140 * tw)) if on else (90, 90, 100))
        if on: gl.cap(bx, by + 8, 22, (int(140 * tw),) * 3)

def notif(d, panel, x, y, k, who, msg):
    w, h = 640, 128; yy = lerp(y - 220, y, k)
    if k <= 0: return
    shadow = Image.new('L', (int((w + 40) * SS), int((h + 40) * SS))); ImageDraw.Draw(shadow).rounded_rectangle([20 * SS, 26 * SS, (w + 20) * SS, (h + 26) * SS], radius=30 * SS, fill=110)
    panel.paste((0, 0, 0), (int((x - 20) * SS), int((yy - 20) * SS)), shadow.filter(ImageFilter.GaussianBlur(14 * SS)))
    d.rect([x, yy, x + w, yy + h], (246, 246, 248), r=30)
    ic = ICON_IM.resize((int(64 * SS), int(64 * SS)), Image.LANCZOS); m = Image.new('L', ic.size); ImageDraw.Draw(m).rounded_rectangle([0, 0, ic.size[0] - 1, ic.size[1] - 1], radius=15 * SS, fill=255)
    panel.paste(ic, (int((x + 22) * SS), int((yy + 22) * SS)), m)
    d.text((x + 104, yy + 18), 'BIBLE MEET', F('700', 20 * SS), (130, 130, 140)); d.text((x + w - 70, yy + 18), 'now', F('500', 20 * SS), (150, 150, 160))
    d.text((x + 104, yy + 44), who, F('700', 28 * SS), (24, 24, 30)); d.text((x + 104, yy + 80), msg, F('500', 25 * SS), (70, 70, 78))

# ---------------- scenes ----------------
def scene(beat, t, good):
    cold = not good
    im = Image.new('RGB', (PW * SS, PH * SS)); d = D(im)
    glow = Image.new('RGB', (PW * SS // 4, PH * SS // 4)); gl = D(glow); gl.d = ImageDraw.Draw(glow)
    def G(b, c):  # draw on glow layer in 1x coords (glow is SS/4 scale)
        k = SS / 4; ImageDraw.Draw(glow).ellipse([b[0] * k, b[1] * k, b[2] * k, b[3] * k], fill=c)
    class GL:
        @staticmethod
        def cap(x, y, r, c): G([x - r, y - r, x + r, y + r], c)
    FLOOR = 640
    if beat in ('night', 'evening'):
        wall1, wall2 = ((48, 58, 92), (36, 44, 74)) if cold else ((150, 104, 82), (122, 82, 64))
        im.paste(vgrad(PW * SS, FLOOR * SS, wall1, wall2), (0, 0))
        im.paste(vgrad(PW * SS, (PH - FLOOR) * SS, (34, 38, 60) if cold else (96, 62, 48), (22, 24, 40) if cold else (70, 44, 34)), (0, FLOOR * SS))
        d.rect([0, FLOOR - 6, PW, FLOOR + 4], (30, 34, 54) if cold else (84, 54, 42))
    if beat == 'night':
        window(d, 70, 120, 230, 270, (40, 48, 78) if cold else (120, 80, 60), (14, 18, 40), (40, 50, 90), t, panel=im)
        frames_on_wall(d, [(560, 130, 110, 140, (40, 48, 78) if cold else (110, 74, 56), (70, 86, 130) if cold else (196, 150, 120)), (690, 160, 80, 80, (40, 48, 78) if cold else (110, 74, 56), (60, 74, 110) if cold else (170, 120, 96))])
        if good: string_lights(d, GL, 520, 980, 90, t)
        # rug + bed
        d.ell([180, 690, 760, 760], (40, 46, 74) if cold else (150, 86, 70))
        d.rect([340, 380, 380, 640], (40, 46, 70) if cold else (110, 70, 50), r=10)  # headboard post
        d.rect([340, 380, 690, 470], (52, 60, 92) if cold else (130, 84, 60), r=22)
        d.rect([340, 520, 900, 610], (52, 60, 92) if cold else (130, 84, 60), r=14)
        d.rect([370, 455, 520, 515], (180, 190, 220) if cold else (246, 238, 228), r=26)
        d.rect([470, 480, 900, 560], (72, 86, 136) if cold else (214, 126, 86), r=30)
        for k in range(3): d.line([(560 + k * 110, 490), (590 + k * 110, 548)], (62, 74, 120) if cold else (190, 108, 74), 4)
        # nightstand + clock + lamp
        d.rect([150, 470, 300, 640], (44, 50, 80) if cold else (120, 78, 56), r=10); d.rect([165, 540, 285, 552], (34, 38, 62) if cold else (96, 62, 44))
        d.rect([170, 430, 250, 470], (24, 26, 40), r=10); d.text((180, 437), '11:48', F('700', 24 * SS), (120, 220, 255) if cold else (255, 160, 90))
        plant(d, 275, 470, (90, 96, 130) if cold else (190, 110, 80), (60, 100, 110) if cold else (90, 150, 90), t)
        if good:
            d.rect([118, 300, 126, 470], (80, 56, 40)); d.poly([(80, 300), (164, 300), (146, 240), (98, 240)], (255, 220, 160))
            GL.cap(122, 300, 150, (210, 150, 70))
        # character on bed edge
        mood = 'sad' if (cold or t < 2.1) else 'smile'
        ph = person(d, 610, 520, 150, None, 'sit', mood, (226, 232, 246) if cold else (250, 236, 222), ('bob', (40, 30, 30)), t, 1, 'phone', head_tilt=0.12 if cold or t < 2.1 else 0.0)
        flick = 0.85 + 0.15 * math.sin(t * 13)
        d.rect([ph[0] - 22, ph[1] - 38, ph[0] + 22, ph[1] + 30], (210, 230, 255) if cold else (255, 244, 230), r=8)
        GL.cap(ph[0], ph[1] + 10, 70, (int(70 * flick), int(110 * flick), int(200 * flick)) if cold else (int(170 * flick), int(130 * flick), int(80 * flick)))
        if cold and t > 2.0:
            k = ease((t - 2.0) / 0.45)
            if k > 0.02:
                c1 = mix((48, 58, 92), (228, 232, 244), k)
                d.rect([300, 140, 900, 222], c1, r=40); d.text((338, 163), 'what if it never gets better?', F('700', 32 * SS), mix((48, 58, 92), (40, 44, 64), k))
                for cx, cy, rr in ((690, 248, 14), (712, 282, 9)): d.cap(cx, cy, rr, c1)
        if good: notif(d, im, 200, 130, ease((t - 1.5) / 0.4), 'Sarah', "praying for you tonight. you're not alone")
    elif beat == 'evening':
        window(d, 760, 110, 220, 260, (40, 48, 78) if cold else (120, 80, 60), (20, 24, 50) if cold else (60, 40, 70), (50, 60, 100) if cold else (230, 140, 110), t, night=cold, panel=im)
        # shelf + books
        d.rect([80, 230, 380, 246], (40, 46, 70) if cold else (110, 72, 52))
        for i, (bw, bh, bc) in enumerate([(26, 80, (90, 70, 120)), (22, 70, (70, 110, 120)), (30, 86, (140, 80, 70)), (20, 64, (190, 160, 90)), (28, 78, (80, 120, 90))]):
            xx = 96 + sum(b[0] + 4 for b in [(26,), (22,), (30,), (20,), (28,)][:i]); c = mix(bc, (40, 50, 80), 0.5) if cold else bc
            d.rect([xx, 230 - bh, xx + bw, 230], c, r=3)
        if good: string_lights(d, GL, 60, 720, 70, t)
        # couch
        cc, cd_ = ((64, 76, 120), (50, 60, 98)) if cold else ((206, 140, 100), (180, 116, 80))
        d.rect([150, 330, 830, 520], cd_, r=50); d.rect([110, 430, 210, 640], cc, r=34); d.rect([770, 430, 870, 640], cc, r=34); d.rect([160, 500, 820, 610], cc, r=30)
        # coffee table
        d.rect([300, 600, 690, 636], (40, 46, 70) if cold else (120, 78, 54), r=10); d.rect([320, 636, 336, 690], (36, 40, 62) if cold else (100, 64, 46)); d.rect([654, 636, 670, 690], (36, 40, 62) if cold else (100, 64, 46))
        if cold:
            # TV glow from the left edge
            fl = 0.7 + 0.3 * math.sin(t * 9) * math.sin(t * 3.3)
            GL.cap(-60, 380, 260, (int(40 * fl), int(70 * fl), int(150 * fl)))
            d.rect([400, 580, 440, 600], (150, 160, 190), r=6)  # cold mug
            ph = person(d, 490, 500, 140, None, 'sit', 'flat', (226, 232, 246), ('bob', (40, 30, 30)), t, 2, 'phone', head_tilt=0.15)
            d.rect([ph[0] - 20, ph[1] - 34, ph[0] + 20, ph[1] + 28], (210, 230, 255), r=7); GL.cap(ph[0], ph[1] + 10, 60, (60, 90, 170))
        else:
            for cx in (360, 420, 620):
                fl = math.sin(t * 9 + cx) * 2
                d.rect([cx, 560, cx + 22, 600], (250, 240, 222), r=4); d.ell([cx + 3, 534 + fl, cx + 19, 562], (255, 196, 96)); GL.cap(cx + 11, 548, 40, (150, 100, 40))
            d.rect([470, 586, 560, 600], (240, 232, 214), r=4); d.rect([515, 586, 520, 600], (180, 120, 90))  # open bible
            for i, mx in enumerate((580,)):
                d.rect([mx, 572, mx + 34, 600], (240, 236, 230), r=6)
                for k in range(2): d.line([(mx + 10 + k * 12, 566 - (t * 20 + k * 10) % 30), (mx + 6 + k * 12, 548 - (t * 20 + k * 10) % 30)], (255, 255, 255), 3)
            k = ease((t - 0.2) / 1.2)
            person(d, lerp(60, 300, k), 500, 132, (92, 150, 112), 'sit', 'closed', (250, 236, 222), ('bun', (110, 70, 40)), t, 3, 'shoulderR' if k > 0.95 else 'lap')
            person(d, lerp(940, 690, k), 500, 132, (196, 92, 84), 'sit', 'closed', (250, 236, 222), ('long', (90, 56, 36)), t, 4, 'pray')
            person(d, 490, 500, 140, None, 'sit', 'closed' if t > 1.8 else 'sad', (250, 236, 222), ('bob', (40, 30, 30)), t, 2, 'pray', head_tilt=0.1)
            if t > 0.6: notif(d, im, 200, 110, ease((t - 0.6) / 0.4) * (1 - ease((t - 2.4) / 0.4)), 'Bible study tonight', '0.4 mi away  ·  6 going  ·  tap to join')
    elif beat == 'church':
        sky1, sky2 = ((86, 94, 116), (120, 128, 146)) if cold else ((120, 180, 236), (255, 214, 160))
        im.paste(vgrad(PW * SS, FLOOR * SS, sky1, sky2), (0, 0))
        if good:
            d.cap(860, 140, 60, (255, 240, 200)); GL.cap(860, 140, 220, (220, 170, 90))
        for i, cx in enumerate((180, 420, 720)):  # clouds
            cx2 = cx + (t * 8 * (1 + i * 0.3)) % 60
            cc = (120, 126, 144) if cold else (255, 250, 245)
            for dx, rr in ((-40, 34), (0, 46), (44, 36)): d.cap(cx2 + dx, 110 + i * 30, rr, cc)
        # trees
        for tx in (60, 960):
            d.rect([tx - 12, 420, tx + 12, FLOOR], (70, 56, 50) if cold else (110, 70, 44))
            for dx, dy, rr in ((0, 380, 80), (-50, 420, 60), (50, 420, 60)): d.cap(tx + dx, dy, rr, (64, 80, 84) if cold else (232, 150, 70))
        # church
        wc, rc, dc = ((140, 146, 164), (80, 84, 104), (70, 70, 86)) if cold else ((244, 230, 210), (176, 96, 72), (130, 76, 54))
        d.rect([360, 330, 700, FLOOR], wc); d.poly([(340, 330), (530, 220), (720, 330)], rc)
        d.rect([500, 140, 560, 230], wc); d.poly([(490, 140), (530, 80), (570, 140)], rc); d.rect([526, 40, 534, 84], (245, 245, 245)); d.rect([514, 54, 546, 61], (245, 245, 245))
        for wx in (400, 620): d.rect([wx, 400, wx + 40, 470], (70, 90, 130) if cold else (120, 170, 220), r=20)
        d.rect([490, 520, 570, FLOOR], dc, r=40)
        d.rect([0, FLOOR, PW, PH], (60, 66, 82) if cold else (126, 168, 98)); d.rect([440, FLOOR, 620, PH], (84, 88, 104) if cold else (210, 196, 170))
        if cold:
            for i in range(5): d.cap(150 + i * 70, 640 - 10, 26, (60, 64, 80)); d.rect([150 + i * 70 - 22, 600, 150 + i * 70 + 22, 640], (70, 74, 92), r=10)  # people chatting by door
            x = 640 + t * 34
            hd = person(d, x, 760, 112, None, 'walk', 'sad', (226, 232, 246), ('bob', (40, 30, 30)), t, 5, 'umbrella', head_tilt=0.12)
            d.line([hd, (hd[0], hd[1] - 150)], (40, 40, 50), 5); d.pie([hd[0] - 120, hd[1] - 230, hd[0] + 120, hd[1] - 70], 180, 360, (44, 56, 92))
            for i in range(80):
                rx = (i * 97 + t * 140) % (PW + 60) - 30; ry = (i * 61 + t * 820) % PH
                d.line([(rx, ry), (rx - 7, ry + 26)], (170, 180, 210), 2)
            for i in range(6):
                rx = (i * 173 + 80) % PW; ph_ = (t * 1.6 + i * 0.37) % 1
                d.ell([rx - 30 * ph_, 740 - 6 * ph_, rx + 30 * ph_, 740 + 6 * ph_], None, outline=(110, 118, 140), width=2)
        else:
            for i, (dx, sh, hs, sd, ar) in enumerate([(-170, (92, 150, 112), ('bun', (110, 70, 40)), 3, 'link'), (0, None, ('bob', (40, 30, 30)), 5, 'link'), (170, (196, 92, 84), ('long', (90, 56, 36)), 4, 'link')]):
                person(d, 420 + dx + t * 30, 770, 106, sh, 'walk', 'laugh', (250, 236, 222), hs, t, sd, ar)
            for i in range(14):
                lx = (i * 83 + t * 40 * (1 + i % 3)) % PW; ly = (i * 57 + t * 110) % PH
                ang = t * 3 + i; d.poly([(lx, ly), (lx + 14 * math.cos(ang), ly + 8), (lx + 4, ly + 16)], (236, 140, 60) if i % 2 else (210, 90, 50))
    gsm = glow.filter(ImageFilter.GaussianBlur(12)).resize(im.size, Image.BILINEAR)
    a = np.asarray(im, np.float32) + np.asarray(gsm, np.float32) * 0.6
    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).resize((PW, PH), Image.LANCZOS)
    # slow camera push + vignette
    z = 1 + 0.045 * (t / 5.4); cw, ch = int(PW / z), int(PH / z)
    out = out.crop(((PW - cw) // 2, (PH - ch) // 2, (PW - cw) // 2 + cw, (PH - ch) // 2 + ch)).resize((PW, PH), Image.BICUBIC)
    return out

yy, xx = np.mgrid[0:PH, 0:PW].astype(np.float32)
VIG = np.clip(1.1 - np.hypot((xx - PW / 2) / PW, (yy - PH / 2) / PH) * 0.9, 0.55, 1)[:, :, None]
TIMES = {'night': '11:48 PM', 'evening': '7:30 PM', 'church': 'AFTER CHURCH'}
MASK = Image.new('L', (PW, PH)); ImageDraw.Draw(MASK).rounded_rectangle([0, 0, PW - 1, PH - 1], radius=36, fill=255)

def frame(T):
    bi = max(i for i in range(len(BEATS)) if T >= STARTS[i]); beat, dur = BEATS[bi]; t = T - STARTS[bi]
    im = Image.new('RGB', (W, H), (10, 10, 14)); d = ImageDraw.Draw(im)
    if beat != 'end':
        for good, py in ((False, Y1), (True, Y2)):
            p = scene(beat, t, good); p = Image.fromarray((np.asarray(p, np.float32) * VIG).astype(np.uint8))
            im.paste(p, (PX, py), MASK)
            lab, col = ('TOGETHER', (255, 196, 92)) if good else ('ALONE', (240, 100, 100))
            f = F('800', 50); tw = d.textlength(lab, font=f)
            d.rounded_rectangle([(W - tw) / 2 - 26, py + 18, (W + tw) / 2 + 26, py + 90], radius=36, fill=(14, 14, 20)); d.text(((W - tw) / 2, py + 26), lab, font=f, fill=col)
            tl = TIMES[beat]; ft = F('700', 30); tw = d.textlength(tl, font=ft)
            d.rounded_rectangle([PX + PW - tw - 66, py + PH - 72, PX + PW - 24, py + PH - 22], radius=25, fill=(14, 14, 20)); d.text((PX + PW - tw - 45, py + PH - 64), tl, font=ft, fill=(235, 235, 240))
        k = min(1, t / 0.25, (dur - t) / 0.25)
        if k < 1: im = Image.blend(Image.new('RGB', (W, H), (10, 10, 14)), im, max(0, k))
    else:
        k = ease(t / 0.8); c = int(245 * k); fl = F('800', 66)
        for i, l in enumerate(['faith was never meant', 'to be carried alone.']):
            tw = d.textlength(l, font=fl); d.text(((W - tw) / 2, 700 + i * 86), l, font=fl, fill=(c, c, c))
        k2 = ease((t - 1.2) / 0.8); fv = ImageFont.truetype(f'{FD}/lora-latin-500-italic.ttf', 44)
        for i, l in enumerate(['"Bear one another\'s burdens, and so', 'fulfill the law of Christ."']):
            tw = d.textlength(l, font=fv); d.text(((W - tw) / 2, 940 + i * 62), l, font=fv, fill=(int(200 * k2),) * 3)
        r = 'GALATIANS 6:2'; fr = F('700', 30); tw = d.textlength(r, font=fr); d.text(((W - tw) / 2, 1090), r, font=fr, fill=(int(255 * k2), int(196 * k2), int(92 * k2)))
    return np.asarray(im)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if len(sys.argv) > 2:
        for s in sys.argv[2].split(','): Image.fromarray(frame(float(s))).save(f'{OUT}/check_{s}.jpg', quality=88)
        sys.exit()
    parts = []
    for bi, (name, dur) in enumerate(BEATS):
        tmp = f'{OUT}/{name}.tmp.mp4'
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for fi in range(int(round(dur * FPS))): p.stdin.write(frame(STARTS[bi] + fi / FPS).tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, f'{OUT}/{name}.mp4'); parts.append(f'{name}.mp4')
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{x}'\n" for x in parts)); print('parts', parts, 'total', TOTAL)
