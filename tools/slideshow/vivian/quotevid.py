"""Vivian QUOTE videos (approved 2026-10-28). One 10s continuous close-up selfie of Vivian + one heartfelt line in yellow text.
Key: env HF_KEY_FILE (line HF_KEY=id:secret) — never print it. W = work dir.
  python3 quotevid.py cand W "<scene>"          -> W/cand_0..3.jpg (4 candidates) + W/cand.jpg sheet next to ref face
  python3 quotevid.py tight W cand_N.jpg CX CY   -> W/tight.jpg  (crop so her face fills the frame; CX,CY = face centre 0-1)
  python3 quotevid.py vid W "<motion>"           -> W/v.mp4 (10s) + W/motion.jpg
  python3 quotevid.py text W "<line>" COLOR [TY] -> W/video.mp4 (COLOR e.g. #F6E58D or #F5C84C; TY = text centre % default 70)
"""
import os, sys, time, json, subprocess, httpx
from PIL import Image
HERE=os.path.dirname(os.path.abspath(__file__)); B='https://api.higgsfield.ai'; CR='9e320394-7e32-4ae0-823c-b115b8c73d07'
cmd, W = sys.argv[1], os.path.abspath(sys.argv[2]); os.makedirs(W,exist_ok=True); os.chdir(W)
def key():
    if 'HF_KEY' not in os.environ:
        for l in open(os.environ['HF_KEY_FILE']):
            if l.startswith('HF_KEY='): os.environ['HF_KEY']=l.strip().split('=',1)[1]
    return {'Authorization':'Key '+os.environ['HF_KEY']}
STYLE=("very tight extreme close-up front-camera selfie, her face fills almost the whole vertical frame from forehead to chin, hair framing the face, "
       "the background is barely visible, dark and out of focus, soft dim warm indoor light on her face, natural skin, freckles, candid TikTok video still, phone not visible")
if cmd=='cand':
    H=key(); r=httpx.post(B+'/v1/text2image/soul',headers=H,json={'params':{'prompt':sys.argv[3]+', '+STYLE,'width_and_height':'1152x2048','quality':'1080p','batch_size':4,'custom_reference_id':CR,'custom_reference_strength':1,'enhance_prompt':False}},timeout=60); r.raise_for_status(); sid=r.json()['id']
    for t in range(90):
        js=httpx.get(B+'/v1/job-sets/'+sid,headers=H,timeout=30).json()['jobs']
        if all(j['status'] in ('completed','failed','nsfw','canceled') for j in js): break
        time.sleep(8)
    s=Image.new('RGB',(5*240,427)); s.paste(Image.open(HERE+'/ref_face.jpg').convert('RGB').resize((240,192)),(0,0))
    for i,j in enumerate(js):
        if j['status']=='completed':
            open(f'cand_{i}.jpg','wb').write(httpx.get(j['results']['raw']['url'],timeout=60).content); s.paste(Image.open(f'cand_{i}.jpg').convert('RGB').resize((240,427)),((i+1)*240,0))
    s.save('cand.jpg'); print('LOOK at cand.jpg: pick the one that is clearly the same girl as ref (top-left)')
elif cmd=='tight':
    im=Image.open(sys.argv[3]); Wd,Hd=im.size; cx,cy=float(sys.argv[4]),float(sys.argv[5]); w=int(Wd*0.6); h=int(w*16/9)
    x=min(max(0,int(Wd*cx-w/2)),Wd-w); y=min(max(0,int(Hd*cy-h*0.40)),Hd-h); im.crop((x,y,x+w,y+h)).resize((1152,2048),Image.LANCZOS).save('tight.jpg',quality=95)
elif cmd=='vid':
    key(); import higgsfield_client as hf
    u=hf.upload_file('tight.jpg'); r=hf.subscribe('kling-video/v2.5-turbo/pro/image-to-video',arguments={'prompt':'close-up handheld selfie video, '+sys.argv[3]+', subtle natural movement, no talking','image_url':u,'duration':10,'negative_prompt':'distorted face, face morphing, identity change, extra fingers, text, talking'})
    url=(r.get('video') or {}).get('url'); assert url, json.dumps(r)[:300]
    open('v.mp4','wb').write(httpx.get(url,timeout=180).content)
    for i,t in enumerate([0.5,2.5,4.5,6.5,9.3]): subprocess.run(f"ffmpeg -v error -y -ss {t} -i v.mp4 -frames:v 1 -vf scale=160:284 _m{i}.jpg",shell=True)
    s=Image.new('RGB',(800,284)); [s.paste(Image.open(f'_m{i}.jpg'),(i*160,0)) for i in range(5)]; s.save('motion.jpg')
elif cmd=='text':
    ty=float(sys.argv[5]) if len(sys.argv)>5 else 70
    json.dump({'q':{'t':sys.argv[3],'c':sys.argv[4],'ty':ty,'fs':60}},open('qt.json','w'))
    subprocess.run(f"node {HERE}/quote_overlay.js qt.json {W}",shell=True,check=True)
    subprocess.run("ffmpeg -v error -y -i v.mp4 -i t_q.png -filter_complex \"[0]scale=1080:1920,setsar=1,fps=30[v];[v][1]overlay=0:0,noise=alls=3:allf=t,format=yuv420p\" -an -c:v libx264 -crf 20 -preset slow -movflags +faststart video.mp4",shell=True,check=True)
    subprocess.run("ffmpeg -v error -y -ss 5 -i video.mp4 -frames:v 1 -vf scale=360:-1 check.jpg",shell=True)
