#!/usr/bin/env python3
"""gimg.py <out.png> "<prompt>" [ref.png ...]  -> Gemini image (nano banana pro), 9:16"""
import sys, json, base64, urllib.request, os
K = open(os.environ.get('GEMINI_KEY_FILE', os.path.expanduser('~/.secrets/gemini'))).read().strip()
out, prompt, refs = sys.argv[1], sys.argv[2], sys.argv[3:]
parts = [{"inline_data": {"mime_type": "image/png" if r.endswith('png') else "image/jpeg", "data": base64.b64encode(open(r, 'rb').read()).decode()}} for r in refs] + [{"text": prompt}]
body = {"contents": [{"parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": os.environ.get("AR", "9:16")}}}
for model in ((os.environ["MODEL"],) if os.environ.get("MODEL") else ("gemini-3-pro-image", "gemini-3.1-flash-image")):
    r = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent', data=json.dumps(body).encode(),
                               headers={'x-goog-api-key': K, 'Content-Type': 'application/json'})
    try:
        d = json.loads(urllib.request.urlopen(r, timeout=300).read())
        for p in d['candidates'][0]['content']['parts']:
            if 'inlineData' in p: open(out, 'wb').write(base64.b64decode(p['inlineData']['data'])); print('ok', model, out); sys.exit()
        print('no image', model, json.dumps(d)[:300])
    except urllib.error.HTTPError as e: print('err', model, e.code, e.read()[:300])
