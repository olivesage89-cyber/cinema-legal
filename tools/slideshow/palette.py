"""Suggest text colours for a still.  Usage: python3 palette.py IMAGE [IMAGE...]
Prints the image's dominant colours and candidate text inks that suit it:
  - 'pop'   : a saturated accent pulled from the image itself (e.g. the red of a coat, the pink of a sky)
  - 'contrast': the complementary hue at a readable lightness
  - 'soft'  : a pale tint of the dominant hue (cream / blush / mint / sky)
Pick ONE per post (title colour), and make sure it differs from the last few posts' colours in used.txt."""
import sys, colorsys
from PIL import Image

def hexc(r, g, b): return '#%02X%02X%02X' % (int(r), int(g), int(b))

for path in sys.argv[1:]:
    im = Image.open(path).convert('RGB'); im.thumbnail((200, 200))
    q = im.quantize(colors=8, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[:24]; counts = sorted(q.getcolors(), reverse=True)
    cols = [(c, tuple(pal[i * 3:i * 3 + 3])) for c, i in counts]
    tot = sum(c for c, _ in cols)
    print(path)
    print('  dominant:', ', '.join(f'{hexc(*rgb)} {c*100//tot}%' for c, rgb in cols[:5]))
    # most saturated reasonably-present colour = 'pop'
    best = max(cols, key=lambda x: colorsys.rgb_to_hls(*[v / 255 for v in x[1]])[2] * (x[0] / tot) ** 0.3)
    h, l, s = colorsys.rgb_to_hls(*[v / 255 for v in best[1]])
    pop = colorsys.hls_to_rgb(h, 0.62, min(1, s * 1.6 + 0.25))
    dh, dl, ds = colorsys.rgb_to_hls(*[v / 255 for v in cols[0][1]])
    con = colorsys.hls_to_rgb((dh + 0.5) % 1, 0.66 if dl < 0.5 else 0.3, 0.75)
    soft = colorsys.hls_to_rgb(dh, 0.9, 0.55)
    avg_l = sum(colorsys.rgb_to_hls(*[v / 255 for v in rgb])[1] * c for c, rgb in cols) / tot
    print('  pop:', hexc(*[v * 255 for v in pop]), ' contrast:', hexc(*[v * 255 for v in con]), ' soft:', hexc(*[v * 255 for v in soft]),
          ' | image is', 'DARK (light/saturated text reads well)' if avg_l < 0.45 else 'LIGHT (use deep/saturated text, or move text to a darker area)')
