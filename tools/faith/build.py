#!/usr/bin/env python3
"""Cut a faith animation video from voiced clips.

  python3 build.py speech <clip.mp4> ...     # print where speech is in each clip (for caption timing)
  python3 build.py make <spec.json>          # build the final video; prints {"out","seconds","music","credit"}

spec.json (all paths relative to the spec's folder):
{
  "account": "lamb" | "bean",
  "clips": [ {"file": "c1.mp4", "captions": [[0.4, 2.5, "I'm so tired...", ["tired..."]], ...]}, ... ],
  "hook": ["for anyone tired of", "pretending they're okay"],      # 1-2 short lines, top of screen, first ~4.5s
  "verse": "Come to me, all you who labor ... rest.",               # WEB translation (public domain)
  "ref": "MATTHEW 11:28",
  "moods": "tender,emotional",                                       # music tags (tools/music/library.json)
  "out": "video.mp4"
}
Caption words listed in the 4th item are drawn in yellow (match the word exactly as written, incl. punctuation).
"""
import json, os, random, subprocess, sys, textwrap, re
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
FONT_PIX = os.path.join(HERE, 'fonts', 'pixelify-sans-latin-700-normal.ttf')
FONT_SERIF = os.path.join(HERE, 'fonts', 'lora-latin-500-italic.ttf')
USED = os.path.join(REPO, 'slides', 'faith-used.txt')
W, H, END = 720, 1280, 4.5


def dur(p):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).decode())


def speech(p):
    out = subprocess.run(['ffmpeg', '-i', p, '-af', 'silencedetect=n=-33dB:d=0.35', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    marks = re.findall(r'silence_(start|end): ([0-9.]+)', out)
    d = dur(p); segs = []; cur = 0.0; silent = False
    for k, v in marks:
        v = float(v)
        if k == 'start':
            if v - cur > 0.15: segs.append((round(cur, 2), round(v, 2)))
            silent = True
        else:
            cur = v; silent = False
    if not silent and d - cur > 0.15: segs.append((round(cur, 2), round(d, 2)))
    return segs


def text_png(path, text, hl, font, y, color=(255, 255, 255)):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    words = text.split(' '); sp = d.textlength(' ', font=font); lines = [[]]
    for w in words:
        if lines[-1] and d.textlength(' '.join(lines[-1] + [w]), font=font) > W - 80: lines.append([w])
        else: lines[-1].append(w)
    lh = int(font.size * 1.25)
    for li, l in enumerate(lines):
        x = (W - d.textlength(' '.join(l), font=font)) / 2
        for w in l:
            d.text((x, y + li * lh), w, font=font, fill=(255, 214, 64) if w in hl else color, stroke_width=4, stroke_fill=(20, 20, 20))
            x += d.textlength(w, font=font) + sp
    im.save(path)


def make(spec_path):
    base = os.path.dirname(os.path.abspath(spec_path)); s = json.load(open(spec_path))
    B = os.path.join(base, 'build'); os.makedirs(B, exist_ok=True)
    clips = [os.path.join(base, c['file']) for c in s['clips']]
    off, t = [], 0.0
    for c in clips: off.append(t); t += dur(c)
    total = t + END
    ov = []
    pix = ImageFont.truetype(FONT_PIX, 48)
    for ci, c in enumerate(s['clips']):
        for k, (a, b, txt, hl) in enumerate(c.get('captions', [])):
            p = f'{B}/cap{ci}_{k}.png'; text_png(p, txt, hl, pix, 760); ov.append((p, off[ci] + a, off[ci] + b))
    hook = ' '.join(s.get('hook', []))
    if hook:
        p = f'{B}/hook.png'; text_png(p, hook, [], ImageFont.truetype(FONT_PIX, 40), 170); ov.append((p, 0, 4.6))
    # verse card
    card = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(card)
    verse = '"' + s['verse'].strip('"') + '"'
    size = 58 if len(verse) < 60 else 48 if len(verse) < 110 else 40
    lf = ImageFont.truetype(FONT_SERIF, size); L = textwrap.wrap(verse, max(14, int(760 / size * 1.25)))
    lh = int(size * 1.35); y0 = 600 - len(L) * lh // 2
    for i, l in enumerate(L):
        d.text(((W - d.textlength(l, font=lf)) / 2, y0 + i * lh), l, font=lf, fill='white', stroke_width=2, stroke_fill=(30, 20, 10))
    rf = ImageFont.truetype(FONT_PIX, 34); r = s['ref'].upper()
    d.text(((W - d.textlength(r, font=rf)) / 2, y0 + len(L) * lh + 30), r, font=rf, fill=(255, 214, 64), stroke_width=3, stroke_fill=(20, 20, 20))
    card.save(f'{B}/card.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.1', '-i', clips[-1], '-frames:v', '1', '-update', '1', f'{B}/last.png'], check=True)
    # music (library tracks, CC BY) - avoid tracks this account used recently
    lib = json.load(open(os.path.join(REPO, 'tools', 'music', 'library.json')))
    want = set(x.strip() for x in s.get('moods', 'tender,emotional').split(','))
    cands = [m for m in lib if want & set(m['moods'])] or lib
    recent = ''.join([l for l in open(USED)] [-20:]).lower() if os.path.exists(USED) else ''
    fresh = [m for m in cands if m['title'].lower() not in recent] or cands
    track = random.choice(fresh)
    # ffmpeg graph
    inp, fc = [], []
    for i, c in enumerate(clips):
        inp += ['-i', c]
        fc.append(f'[{i}:v]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps=30,setsar=1,format=yuv420p[v{i}];'
                  f'[{i}:a]aresample=44100,aformat=channel_layouts=stereo[a{i}]')
    n = len(clips)
    inp += ['-loop', '1', '-t', str(END), '-i', f'{B}/last.png']
    fc.append(f'[{n}:v]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps=30,setsar=1,format=yuv420p,eq=brightness=-0.12:saturation=0.85,gblur=sigma=6[vend]')
    fc.append(f'anullsrc=r=44100:cl=stereo,atrim=duration={END}[aend]')
    fc.append(''.join(f'[v{i}][a{i}]' for i in range(n)) + f'[vend][aend]concat=n={n + 1}:v=1:a=1[vc][ac]')
    mi = n + 1
    inp += ['-stream_loop', '-1', '-i', os.path.join(REPO, 'tools', 'music', track['file'])]
    last, idx = 'vc', mi + 1
    for j, (p, a, b) in enumerate(ov):
        inp += ['-i', p]; fc.append(f"[{last}][{idx}:v]overlay=0:0:enable='between(t,{a:.2f},{b:.2f})'[o{j}]"); last = f'o{j}'; idx += 1
    inp += ['-i', f'{B}/card.png']; fc.append(f"[{last}][{idx}:v]overlay=0:0:enable='gte(t,{t + 0.3:.2f})'[vout]")
    fc.append(f'[{mi}:a]atrim=duration={total:.2f},volume=0.20,afade=t=in:d=1.5,afade=t=out:st={total - 2:.2f}:d=2,aformat=channel_layouts=stereo[mu];'
              f'[ac][mu]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[aout]')
    out = os.path.join(base, s.get('out', 'video.mp4'))
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inp + ['-filter_complex', ';'.join(fc), '-map', '[vout]', '-map', '[aout]',
                    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
                    '-movflags', '+faststart', out], check=True)
    credit = f"🎵 {track['title']} – Kevin MacLeod (incompetech.com) CC BY 4.0"
    print(json.dumps({'out': out, 'seconds': round(total, 2), 'music': track['title'], 'credit': credit}, ensure_ascii=False))


if __name__ == '__main__':
    if len(sys.argv) < 3: sys.exit(__doc__)
    if sys.argv[1] == 'speech':
        for p in sys.argv[2:]: print(os.path.basename(p), f'{dur(p):.2f}s', 'speech:', speech(p))
    elif sys.argv[1] == 'make':
        make(sys.argv[2])
    else:
        sys.exit(__doc__)
