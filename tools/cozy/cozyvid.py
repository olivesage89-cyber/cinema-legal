"""Cozy-room routine video builder (account "cozy": IG _ceillo_77, TikTok elio_luize). See README.md for the rules.
All footage is made with the Higgsfield API (key file via env HF_KEY_FILE, line HF_KEY=id:secret — never print it).
Work dir W holds plan.json. Steps (run in order, LOOK at the outputs between steps):
  python3 cozyvid.py gen W        -> images i_<key>.jpg for every shot (+ sheet.jpg). Regenerate bad ones: gen W key1 key2
  python3 cozyvid.py vid W        -> 5s clips v_<key>.mp4 for every shot with "motion" (+ motion.jpg sheet). Re-run with keys to redo some
  python3 cozyvid.py lap W        -> lap.mp4 : laptop green screen replaced by the trailer shots in plan.movie.clips
  python3 cozyvid.py app W        -> renders the Cinema hologram states (needs W/app.json + posters, like appshot.js)
  python3 cozyvid.py holo W       -> phone.mp4 : phone shot + see-through app floating beside the phone (plan.holo)
  python3 cozyvid.py cut W        -> video.mp4 : opening flash burst + jump-cut routine + phone + movie, caption on top
"""
import os, sys, json, time, glob, subprocess, concurrent.futures as cf
import httpx
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
HERE=os.path.dirname(os.path.abspath(__file__)); B='https://api.higgsfield.ai'
W=os.path.abspath(sys.argv[2]); os.chdir(W); P=json.load(open('plan.json')); ONLY=sys.argv[3:]
def key():
    if 'HF_KEY' not in os.environ:
        for l in open(os.environ['HF_KEY_FILE']):
            if l.startswith('HF_KEY='): os.environ['HF_KEY']=l.strip().split('=',1)[1]
    return {'Authorization':'Key '+os.environ['HF_KEY']}
def sh(c): subprocess.run(c,shell=True,check=True)
STYLE=P.get('style',"cozy aesthetic, warm amber candlelight, dark moody golden tones, shallow depth of field, soft film grain, shot on iPhone, vertical, no text, no faces")
def sheet(files,out,w=240):
    h=int(w*16/9); s=Image.new('RGB',(6*w,((len(files)+5)//6)*h))
    for i,f in enumerate(files): s.paste(Image.open(f).convert('RGB').resize((w,h)),((i%6)*w,(i//6)*h))
    s.save(out,quality=85)
def gen():
    H=key(); sets={}
    for s in P['shots']:
        if ONLY and s['key'] not in ONLY: continue
        r=httpx.post(B+'/v1/text2image/soul',headers=H,json={'params':{'prompt':s['prompt']+', '+STYLE,'width_and_height':'1152x2048','quality':'1080p','batch_size':1,'enhance_prompt':False}},timeout=60); r.raise_for_status(); sets[s['key']]=r.json()['id']
    done={}
    for t in range(100):
        for k,j in sets.items():
            if k in done: continue
            jb=httpx.get(B+'/v1/job-sets/'+j,headers=H,timeout=30).json()['jobs'][0]
            if jb['status'] in ('completed','failed','nsfw','canceled'):
                done[k]=jb['status']; print(k,jb['status'],flush=True)
                if jb['status']=='completed': open(f'i_{k}.jpg','wb').write(httpx.get(jb['results']['raw']['url'],timeout=60).content)
        if len(done)==len(sets): break
        time.sleep(8)
    sheet([f"i_{s['key']}.jpg" for s in P['shots'] if os.path.exists(f"i_{s['key']}.jpg")],'sheet.jpg')
def vid():
    key(); import higgsfield_client as hf
    todo=[s for s in P['shots'] if s.get('motion') and (not ONLY or s['key'] in ONLY)]
    def go(s):
        try:
            u=hf.upload_file(f"i_{s['key']}.jpg")
            r=hf.subscribe('kling-video/v2.5-turbo/pro/image-to-video',arguments={'prompt':s['motion'],'image_url':u,'duration':5,'negative_prompt':'face, text, distortion, extra fingers, morphing'})
            url=(r.get('video') or {}).get('url')
            if not url: return s['key'],'FAIL '+json.dumps(r)[:200]
            open(f"v_{s['key']}.mp4",'wb').write(httpx.get(url,timeout=120).content); return s['key'],'ok'
        except Exception as e: return s['key'],'ERR '+str(e)[:200]
    with cf.ThreadPoolExecutor(8) as ex:
        for k,st in ex.map(go,todo): print(k,st,flush=True)
    fr=[]
    for s in P['shots']:
        if s.get('motion') and os.path.exists(f"v_{s['key']}.mp4"):
            for t in (0.3,1.5,2.7,3.9,4.8):
                o=f"_m_{s['key']}_{t}.jpg"; sh(f"ffmpeg -v error -y -ss {t} -i v_{s['key']}.mp4 -frames:v 1 -vf scale=240:-1 {o}"); fr.append(o)
    s=Image.new('RGB',(5*240,(len(fr)//5)*427))
    for i,f in enumerate(fr): s.paste(Image.open(f),((i%5)*240,(i//5)*427))
    s.save('motion.jpg',quality=85)
def lap():
    L=P['laptop']; clips=','.join(f"{c['src']}@{c['ss']}@{c['d']}" for c in P['movie']['clips'])
    sh(f"python3 {HERE}/lapcomp.py v_{L['key']}.mp4 {L.get('crop','none')} \"{clips}\" lap.mp4")
    sh("ffmpeg -v error -y -ss 2.5 -i lap.mp4 -frames:v 1 -vf scale=432:-1 lapchk.jpg")
def app():
    q=json.load(open('app.json'))['query']; st=[{'mode':'idle','typed':'','caret':True}]
    st+=[{'mode':'idle','typed':q[:i],'caret':True} for i in range(1,len(q)+1)]
    st+=[{'mode':'idle','typed':q,'caret':False}]+[{'mode':'res','typed':'','op':o} for o in (0.25,0.5,0.75,1)]
    json.dump(st,open('states.json','w')); sh(f"node {HERE}/holoanim.js {W}")
def holo():
    Hh=P['holo']; FPS=24; os.makedirs('ph',exist_ok=True); [os.remove(f) for f in glob.glob('ph/*')]
    sh(f"ffmpeg -v error -y -t {Hh.get('dur',4.2)} -i v_{Hh['key']}.mp4 -vf fps=24,scale=1080:1920 ph/%04d.png")
    seq=sorted(glob.glob('ph/*.png')); K=Hh.get('k',0.6)
    st=[];
    for f in sorted(glob.glob('hstates/*.png')):
        im=Image.open(f).convert('RGBA'); st.append(im.resize((int(im.width*K),int(im.height*K)),Image.LANCZOS))
    gl=[s.filter(ImageFilter.GaussianBlur(16)) for s in st]; nq=len(st)-5
    def sidx(t):
        if t<0.3: return 0
        k=int((t-0.3)/0.06)+1
        if k<=nq: return k
        if t<0.3+nq*0.06+0.25: return nq
        return min(nq+1+int((t-(0.55+nq*0.06))/0.045),len(st)-1)
    ease=lambda x:(lambda y:y*y*(3-2*y))(max(0,min(1,x)))
    X0,Y0,PCX,PCY=Hh['x0'],Hh['y0'],Hh['pcx'],Hh['pcy']; D=len(seq)/FPS
    os.makedirs('ho',exist_ok=True); [os.remove(f) for f in glob.glob('ho/*')]
    for i,f in enumerate(seq):
        u=i/FPS; fr=Image.open(f).convert('RGBA'); j=sidx(max(0,u-0.4)); e=ease(u/0.5); a=e*(1-ease((u-(D-0.35))/0.35)); sc=0.35+0.65*e
        im,g=st[j],gl[j]
        if sc<0.999: im=im.resize((int(im.width*sc),int(im.height*sc)),Image.LANCZOS); g=g.resize(im.size)
        fx=X0+st[j].width/2; fy=Y0+st[j].height/2-40*ease(u/D); cx=PCX+(fx-PCX)*e; cy=PCY+(fy-PCY)*e; pos=(int(cx-im.width/2),int(cy-im.height/2))
        g=g.copy(); g.putalpha(g.getchannel('A').point(lambda v:int(v*0.35*a))); im=im.copy(); im.putalpha(im.getchannel('A').point(lambda v:int(v*0.9*a)))
        fr.alpha_composite(g,pos); fr.alpha_composite(im,pos); fr.convert('RGB').save(f'ho/{i:04d}.jpg',quality=95)
    sh("ffmpeg -v error -y -framerate 24 -i ho/%04d.jpg -c:v libx264 -crf 14 -pix_fmt yuv420p phone.mp4")
    sh("ffmpeg -v error -y -ss 3 -i phone.mp4 -frames:v 1 -vf scale=432:-1 holochk.jpg")
def cut():
    S="scale=1080:1920,setsar=1,fps=24"; os.makedirs('q',exist_ok=True); [os.remove(f) for f in glob.glob('q/*')]
    def src(k):
        if k=='lap': return 'lap.mp4'
        if k=='phone': return 'phone.mp4'
        if os.path.exists(f'v_{k}.mp4'): return f'v_{k}.mp4'
        o=f'z_{k}.mp4'
        if not os.path.exists(o): sh(f"ffmpeg -v error -y -loop 1 -i i_{k}.jpg -vf \"scale=1188:2112,zoompan=z='1+0.0015*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=24,setsar=1\" -t 5 -c:v libx264 -crf 14 -pix_fmt yuv420p {o}")
        return o
    n=0
    for k,ss,d in P['cuts']:
        n+=1; sh(f"ffmpeg -v error -y -ss {ss} -t {d} -i {src(k)} -vf {S} -an -c:v libx264 -crf 14 -pix_fmt yuv420p q/{n:03d}.mp4")
    open('q.txt','w').write(''.join(f"file 'q/{i:03d}.mp4'\n" for i in range(1,n+1)))
    Wd,Hd=1080,1920; cap=Image.new('RGBA',(Wd,Hd),(0,0,0,0)); f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',36); t=P['caption']
    w=ImageDraw.Draw(cap).textlength(t,font=f); shd=Image.new('RGBA',(Wd,Hd),(0,0,0,0)); ImageDraw.Draw(shd).text(((Wd-w)/2,330),t,font=f,fill=(0,0,0,170))
    cap=Image.alpha_composite(shd.filter(ImageFilter.GaussianBlur(4)),cap); ImageDraw.Draw(cap).text(((Wd-w)/2,330),t,font=f,fill=(255,255,255,240)); cap.save('cap.png')
    sh("ffmpeg -v error -y -f concat -safe 0 -i q.txt -i cap.png -filter_complex \"[0]setsar=1[v];[v][1]overlay=0:0,eq=saturation=0.97,noise=alls=5:allf=t,format=yuv420p\" -c:v libx264 -crf 21 -preset slow -movflags +faststart video.mp4")
    sh("ffmpeg -v error -y -i video.mp4 -vf fps=2,scale=150:-1,tile=12x3 cutsheet.jpg")
{'gen':gen,'vid':vid,'lap':lap,'app':app,'holo':holo,'cut':cut}[sys.argv[1]]()
