"""Vivian RELATABLE photos (format E, approved 2026-11-08). Lazy low-angle front-camera selfies with lots of empty
ceiling/wall/sky above her face, like the "shh" relatable-carousel accounts.
Key: env HF_KEY_FILE (line HF_KEY=id:secret) — never print it.
  python3 relgen.py cand W "<scene>"     (or: relgen.py mirror W "<scene>" for a mirror selfie)
      -> W/cand_0..3.jpg + W/cand.jpg sheet (ref face top-left). Pick ONLY a clear match.
Scene examples: "lying on her back in bed looking up at the camera, white ceiling with fairy lights",
"sitting on the bathroom floor, white ceiling and shelf corner", "outside under green trees and pale sky",
"mirror selfie in her bedroom holding her phone, black crewneck and shorts" (for a reveal slide).
Output is 1152x2048 (9:16); render_rel.js crops to 4:5."""
import os, sys, time, httpx
from PIL import Image
if sys.argv[1]=='grain':  # relgen.py grain IN.jpg OUT.jpg [darken 0.93]: phone-camera softness + noise (always do this)
    import numpy as np; from PIL import Image
    im=Image.open(sys.argv[2]).convert('RGB'); w,h=im.size; im=im.resize((w//2,h//2),Image.BILINEAR).resize((w,h),Image.BILINEAR)
    a=np.asarray(im).astype(np.float32); g=np.random.default_rng()
    a=a*float(sys.argv[4] if len(sys.argv)>4 else .95)+g.normal(0,7,(h,w,1))+g.normal(0,3,(h,w,3))
    Image.fromarray(np.clip(a,0,255).astype(np.uint8)).save(sys.argv[3],quality=88); sys.exit()
HERE=os.path.dirname(os.path.abspath(__file__)); B='https://api.higgsfield.ai'; CR='9e320394-7e32-4ae0-823c-b115b8c73d07'
W=os.path.abspath(sys.argv[2]); os.makedirs(W,exist_ok=True); os.chdir(W)
for l in open(os.environ['HF_KEY_FILE']):
    if l.startswith('HF_KEY='): H={'Authorization':'Key '+l.strip().split('=',1)[1]}
STYLE=("lazy low-angle front-camera selfie taken from below, too close, only her eyes, brows and hair at the very bottom edge of the frame, "
       "cut off at the nose, she looks up past the camera, the top three quarters of the frame is empty background, flat natural light, "
       "grainy iPhone front camera photo, soft focus, slight noise, unedited, no makeup, freckles, messy brown hair, not posed, phone not visible")
if sys.argv[1]=='mirror': STYLE="casual mirror selfie, she holds her phone in front of her chest, ordinary messy bedroom, flat dull daylight, unedited real iPhone photo"
r=httpx.post(B+'/v1/text2image/soul',headers=H,json={'params':{'prompt':sys.argv[3]+', '+STYLE,'width_and_height':'1152x2048','quality':'1080p','batch_size':4,'custom_reference_id':CR,'custom_reference_strength':1,'enhance_prompt':False}},timeout=60)
if r.status_code!=200: sys.exit(f'Higgsfield {r.status_code}: {r.text[:200]}')
sid=r.json()['id']
for t in range(90):
    js=httpx.get(B+'/v1/job-sets/'+sid,headers=H,timeout=30).json()['jobs']
    if all(j['status'] in ('completed','failed','nsfw','canceled') for j in js): break
    time.sleep(8)
s=Image.new('RGB',(5*240,427)); s.paste(Image.open(HERE+'/ref_face.jpg').convert('RGB').resize((240,192)),(0,0))
for i,j in enumerate(js):
    if j['status']=='completed':
        open(f'cand_{i}.jpg','wb').write(httpx.get(j['results']['raw']['url'],timeout=60).content)
        s.paste(Image.open(f'cand_{i}.jpg').convert('RGB').resize((240,427)),((i+1)*240,0))
s.save('cand.jpg'); print('LOOK at cand.jpg: pick one that is clearly the same girl as ref (top-left)')
