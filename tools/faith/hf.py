#!/usr/bin/env python3
"""Higgsfield platform API helper for the faith videos.

Key: HF_KEY_FILE env var -> file containing `HF_KEY=id:secret` (or just `id:secret`).
Never print the key.

  python3 hf.py image <out.png> <ref_image_url> "<prompt>"         # grok edit, keeps characters/style
  python3 hf.py video <out.mp4> <image_url> <seconds> "<prompt>"    # seedance 2.0 image-to-video WITH audio (voices)
  python3 hf.py batch <jobs.json>                                    # run many jobs in parallel (see README)

Each finished job also writes <out>.url (the public CDN url of the result, valid ~7 days),
so a generated still can be fed straight into `video`.
"""
import json, os, sys, time, urllib.request

API = 'https://platform.higgsfield.ai'


def key():
    p = os.environ.get('HF_KEY_FILE')
    if not p:
        sys.exit('set HF_KEY_FILE')
    for line in open(p):
        line = line.strip()
        if line.startswith('HF_KEY='):
            return line.split('=', 1)[1].strip()
        if ':' in line and not line.startswith('#'):
            return line
    sys.exit('no key in HF_KEY_FILE')


def req(url, body=None):
    r = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None,
                               headers={'Authorization': 'Key ' + key(), 'Content-Type': 'application/json'},
                               method='POST' if body is not None else 'GET')
    try:
        with urllib.request.urlopen(r, timeout=90) as f:
            return json.loads(f.read())
    except urllib.error.HTTPError as e:
        return json.loads(e.read() or b'{}') | {'http_error': e.code}


def submit(job):
    if job['kind'] == 'image':
        body = {'prompt': job['prompt'], 'image_urls': [job['ref']], 'aspect_ratio': '9:16'}
        r = req(f'{API}/xai/grok-imagine-image-2.0', body)
    else:
        body = {'prompt': job['prompt'], 'image_url': job['ref'], 'duration': int(job.get('seconds', 6)),
                'resolution': '720p', 'aspect_ratio': '9:16', 'generate_audio': True}
        r = req(f'{API}/bytedance/seedance-2.0/image-to-video', body)
    if 'status_url' not in r:
        detail = r.get('detail', r)
        if 'credit' in str(detail).lower():
            sys.exit('HIGGSFIELD_OUT_OF_CREDITS: top up the API balance (separate from the website plan)')
        raise SystemExit(f"submit failed for {job['out']}: {detail}")
    return r['status_url']


def run(jobs):
    pend = {}
    for j in jobs:
        pend[j['out']] = (j, submit(j))
    results = {}
    t0 = time.time()
    while pend and time.time() - t0 < 1200:
        time.sleep(8)
        for out, (j, su) in list(pend.items()):
            r = req(su)
            s = r.get('status')
            if s in ('queued', 'in_progress'):
                continue
            del pend[out]
            if s == 'completed':
                u = (r.get('video') or {}).get('url') or (r.get('images') or [{}])[0].get('url')
                urllib.request.urlretrieve(u, out)
                open(out + '.url', 'w').write(u)
                results[out] = 'ok'
            else:
                err = r.get('error', s)
                if 'credit' in str(err).lower():
                    print('HIGGSFIELD_OUT_OF_CREDITS', flush=True)
                results[out] = f'FAILED ({s}): {err}'
            print(out, results[out], flush=True)
    for out in pend:
        results[out] = 'TIMEOUT'
        print(out, 'TIMEOUT', flush=True)
    return results


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'image':
        run([{'kind': 'image', 'out': sys.argv[2], 'ref': sys.argv[3], 'prompt': sys.argv[4]}])
    elif cmd == 'video':
        run([{'kind': 'video', 'out': sys.argv[2], 'ref': sys.argv[3], 'seconds': sys.argv[4], 'prompt': sys.argv[5]}])
    elif cmd == 'batch':
        jobs = json.load(open(sys.argv[2]))
        for j in jobs:  # allow ref = "@<file>" to use the .url of an earlier result
            if j['ref'].startswith('@'):
                j['ref'] = open(j['ref'][1:] + '.url').read().strip()
        run(jobs)
    else:
        sys.exit(__doc__)
