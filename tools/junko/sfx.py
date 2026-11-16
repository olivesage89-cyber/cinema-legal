#!/usr/bin/env python3
"""Code-made sound effects (no cost, no copyright).
  python3 sfx.py <seconds> <out.wav> '<events json>'
  events: [["pop",1.0],["tick_every",0.5,0,13],["buzz",13.0],["ping",13.05],["whoosh",17.35]]
  kinds: pop (bubble/thought appears), ping (notification), buzz (phone vibrate), whoosh (scene change),
         tick (single clock tick), tick_every <step> <from> <to>"""
import sys, json, wave, numpy as np
sr = 44100

def render(seconds, events):
    n = int(seconds * sr); out = np.zeros(n); rng = np.random.default_rng(1)
    T = lambda d: np.arange(int(d * sr)) / sr
    def add(t0, s):
        i = int(t0 * sr)
        if i < n: out[i:i + len(s)] += s[:n - i]
    def pop(t0):
        t = T(0.15); f = 500 * np.exp(-t * 20) + 300; add(t0, 0.35 * np.sin(2 * np.pi * np.cumsum(f) / sr) * np.exp(-t * 30))
    def tick(t0):
        t = T(0.03); add(t0, 0.06 * rng.standard_normal(len(t)) * np.exp(-t * 200))
    def buzz(t0):
        t = T(0.9); add(t0, 0.09 * np.sign(np.sin(2 * np.pi * 150 * t)) * (np.sin(2 * np.pi * 3 * t) > 0) * np.exp(-t * 0.5))
    def ping(t0):
        for f, d0 in ((1318.5, 0), (1760, 0.09)):
            t = T(0.6); add(t0 + d0, 0.2 * np.sin(2 * np.pi * f * t) * np.exp(-t * 7))
    def whoosh(t0):
        t = T(0.5); add(t0, np.convolve(rng.standard_normal(len(t)) * 0.06 * np.sin(np.pi * t / 0.5) ** 2, np.ones(30) / 30, 'same'))
    K = dict(pop=pop, tick=tick, buzz=buzz, ping=ping, whoosh=whoosh)
    for e in events:
        if e[0] == 'tick_every':
            step, a, b = e[1:]; x = a
            while x < b: tick(x); x += step
        else: K[e[0]](e[1])
    return out

if __name__ == '__main__':
    out = render(float(sys.argv[1]), json.loads(sys.argv[3]))
    w = wave.open(sys.argv[2], 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
