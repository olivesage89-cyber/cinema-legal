#!/usr/bin/env python3
"""omni.py <out.mp4> <seconds> <image.png|-> "<prompt>"  -> Gemini Omni 1.2 Flash, 9:16 720p, with audio"""
import sys, json, base64, urllib.request, os
K = open(os.environ.get('GEMINI_KEY_FILE', os.path.expanduser('~/.secrets/gemini'))).read().strip()
out, secs, img, prompt = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
inp = [{"type": "text", "text": prompt}]
if img != '-':
    inp.insert(0, {"type": "image", "mime_type": "image/png", "data": base64.b64encode(open(img, 'rb').read()).decode()})
body = {"model": "gemini-omni-1.2-flash", "input": inp,
        "response_format": {"type": "video", "aspect_ratio": "9:16", "resolution": "720p", "duration": f"{secs}s"}}
r = urllib.request.Request('https://generativelanguage.googleapis.com/v1beta/interactions', data=json.dumps(body).encode(),
                           headers={'x-goog-api-key': K, 'Content-Type': 'application/json'})
try: d = json.loads(urllib.request.urlopen(r, timeout=600).read())
except urllib.error.HTTPError as e: print('HTTP', e.code, e.read()[:600].decode(errors='replace')); sys.exit(1)
for s in d.get('steps', []):
    if s.get('type') == 'model_output':
        for c in s.get('content', []):
            if c.get('data'): open(out, 'wb').write(base64.b64decode(c['data'])); print('ok', out); sys.exit()
print('no video', json.dumps(d)[:600])
