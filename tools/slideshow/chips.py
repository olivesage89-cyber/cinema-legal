import sys, colorsys, glob
from PIL import Image
def chips(files, n=5):
    tiles = [Image.open(f).convert('RGB').resize((240, 135)) for f in files]
    S = Image.new('RGB', (240, 135 * len(tiles)))
    for i, t in enumerate(tiles): S.paste(t, (0, 135 * i))
    q = S.quantize(colors=24, method=Image.Quantize.MEDIANCUT); pal = q.getpalette()
    cols = [(c, tuple(pal[i*3:i*3+3])) for c, i in q.getcolors()]
    tot = sum(c for c, _ in cols)
    def hls(rgb): return colorsys.rgb_to_hls(*[v/255 for v in rgb])
    cand = [(c, rgb) for c, rgb in cols if 0.2 < hls(rgb)[1] < 0.93 and c / tot > 0.008]
    cand.sort(key=lambda x: -(x[0]/tot)**0.4 * (0.25 + hls(x[1])[2]))
    pick = []
    def dist(a, b): return sum((x-y)**2 for x, y in zip(a, b)) ** .5
    for c, rgb in cand:
        if all(dist(rgb, p) > 70 for p in pick): pick.append(rgb)
        if len(pick) == n: break
    pick.sort(key=lambda r: hls(r)[1], reverse=True)
    return ['#%02X%02X%02X' % p for p in pick]
if __name__ == '__main__':
    D = sys.argv[1]
    for k in sys.argv[2:]: print(k, chips(sorted(glob.glob(f'{D}/{k}_*.jpg'))))
