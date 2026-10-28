"""Generate photos of Vivian (trained Higgsfield character).
Usage: python3 vivgen.py OUTDIR "prompt 1" ["prompt 2" ...]   -> OUTDIR/viv_0.jpg ...
Key: env HF_KEY (key-id:secret) or a file given by env HF_KEY_FILE containing HF_KEY=... . Never print it.
Size 1536x2048 (3:4) — crop to 4:5 when composing slides."""
import os, sys, time, json, httpx
if 'HF_KEY' not in os.environ and os.environ.get('HF_KEY_FILE'):
    for l in open(os.environ['HF_KEY_FILE']):
        if l.startswith('HF_KEY='): os.environ['HF_KEY']=l.strip().split('=',1)[1]
H={'Authorization':'Key '+os.environ['HF_KEY']}; B='https://api.higgsfield.ai'
CR='9e320394-7e32-4ae0-823c-b115b8c73d07'   # "Vivian v2" character
out=sys.argv[1]; os.makedirs(out,exist_ok=True); sets=[]
for p in sys.argv[2:]:
    r=httpx.post(B+'/v1/text2image/soul',headers=H,json={'params':{'prompt':p,'width_and_height':'1536x2048','quality':'1080p','batch_size':1,'custom_reference_id':CR,'enhance_prompt':False}},timeout=60)
    r.raise_for_status(); sets.append(r.json()['id'])
done={}
for t in range(80):
    for i,s in enumerate(sets):
        if i in done: continue
        jb=httpx.get(B+'/v1/job-sets/'+s,headers=H,timeout=30).json()['jobs'][0]
        if jb['status'] in ('completed','failed','nsfw','canceled'):
            done[i]=jb['status']
            if jb['status']=='completed':
                open(f'{out}/viv_{i}.jpg','wb').write(httpx.get(jb['results']['raw']['url'],timeout=60).content)
            print(i,jb['status'],flush=True)
    if len(done)==len(sets): break
    time.sleep(8)
