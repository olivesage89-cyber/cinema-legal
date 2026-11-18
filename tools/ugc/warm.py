#!/usr/bin/env python3
"""warm.py in.mp4 text.png out.mp4 [strength 1.0] — warm, rich phone-filter look (like the user_783787 reference):
slightly darker, more contrast, more colour, nudged toward peach/amber. Keeps full sharpness."""
import sys, subprocess, numpy as np, cv2
src, txt, out = sys.argv[1:4]; k = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
W, H = 720, 1280
p = subprocess.Popen(['ffmpeg','-v','error','-i',src,'-vf',f'scale={W}:{H}:flags=lanczos,fps=30','-f','rawvideo','-pix_fmt','bgr24','-'], stdout=subprocess.PIPE)
o = subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s',f'{W}x{H}','-r','30','-i','-','-i',txt,
     '-filter_complex','[0:v][1:v]overlay=0:0,format=yuv420p','-an','-c:v','libx264','-crf','18','-preset','veryfast','-movflags','+faststart',out], stdin=subprocess.PIPE)
lut = None
while True:
    b = p.stdout.read(W*H*3)
    if len(b) < W*H*3: break
    f = np.frombuffer(b, np.uint8).reshape(H, W, 3)
    lab = cv2.cvtColor(f, cv2.COLOR_BGR2LAB).astype(np.float32)
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
    m = L.mean()
    L = (L - m) * (1 + 0.14*k) + m - 16*k                     # a bit darker + more contrast
    L = np.where(L > 200, 200 + (L - 200) * 0.6, L)            # soften blown whites
    A = 128 + (A - 128) * (1 + 0.55*k) + 3.0*k                 # more colour, toward warm red/peach
    B = 128 + (B - 128) * (1 + 0.45*k) + 4.5*k                 # toward amber
    # extra warmth in the skin/mid tones
    mid = np.exp(-((L - 130) / 60) ** 2); A += 1.5*k*mid; B += 2.0*k*mid
    lab = np.clip(np.dstack([L, A, B]), 0, 255).astype(np.uint8)
    o.stdin.write(cv2.cvtColor(lab, cv2.COLOR_LAB2BGR).tobytes())
o.stdin.close(); o.wait()
