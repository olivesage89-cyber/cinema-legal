"""Cozy-account SLIDESHOW builder: AI cozy rooms where each movie plays on a screen in the scene.
Key: env HF_KEY_FILE (line HF_KEY=id:secret) — never print it. W = work dir.
  python3 screen_slides.py gen W KEY "<scene prompt with a device whose screen is green>"   -> W/KEY_0..3.jpg + W/KEY_check.txt (screen fill score)
  python3 screen_slides.py place W KEY_n.jpg MOVIE_STILL.jpg OUT.jpg      -> movie warped onto the green screen + green spill removed
  python3 screen_slides.py text W IN.jpg "caption" OUT.jpg [TY]          -> 1080x1350 slide with small white caption (TY = 0-1, default 0.10)
RULES (user): the WHOLE screen must be visible — nothing in front of it, nothing overlapping (fill score must be >= 0.99,
else regenerate). Prefer landscape screens (laptop, TV, projector, tablet on a stand) so the movie isn't cropped.
"""
import os, sys, time, httpx, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage
B='https://api.higgsfield.ai'
STYLE=", warm amber candlelight and fairy lights, cream knit blankets, cozy aesthetic, shallow depth of field, soft film grain, shot on iPhone, vertical, no people, no faces, no text"
GREEN=" the screen is solid flat bright chroma key green with nothing on it, the entire device and its screen fully visible with clear space around it, absolutely nothing in front of or overlapping the screen,"
cmd,W=sys.argv[1],os.path.abspath(sys.argv[2]); os.makedirs(W,exist_ok=True); os.chdir(W)
def key():
    if 'HF_KEY' not in os.environ:
        for l in open(os.environ['HF_KEY_FILE']):
            if l.startswith('HF_KEY='): os.environ['HF_KEY']=l.strip().split('=',1)[1]
    return {'Authorization':'Key '+os.environ['HF_KEY']}
def quad(path):
    a=np.array(Image.open(path).convert('RGB')).astype(int); R,G,Bc=a[...,0],a[...,1],a[...,2]
    g=(G>120)&(G>R+40)&(G>Bc+30); lab,n=ndimage.label(g)
    if n==0: return None,0,g
    sz=ndimage.sum(g,lab,range(1,n+1)); m=lab==(sz.argmax()+1); ys,xs=np.nonzero(m); s=xs+ys; d=xs-ys
    q=[(int(xs[s.argmin()]),int(ys[s.argmin()])),(int(xs[d.argmax()]),int(ys[d.argmax()])),(int(xs[s.argmax()]),int(ys[s.argmax()])),(int(xs[d.argmin()]),int(ys[d.argmin()]))]
    P=Image.new('L',(a.shape[1],a.shape[0]),0); ImageDraw.Draw(P).polygon(q,fill=1); P=np.array(P).astype(bool)
    return q, (m&P).sum()/max(1,P.sum()), g
if cmd=='gen':
    H=key(); k,p=sys.argv[3],sys.argv[4]
    sid=httpx.post(B+'/v1/text2image/soul',headers=H,json={'params':{'prompt':p+GREEN+STYLE,'width_and_height':'1536x2048','quality':'1080p','batch_size':4,'enhance_prompt':False}},timeout=60).json()['id']
    for t in range(90):
        js=httpx.get(B+'/v1/job-sets/'+sid,headers=H,timeout=30).json()['jobs']
        if all(j['status'] in ('completed','failed','nsfw','canceled') for j in js): break
        time.sleep(8)
    out=[]
    for i,j in enumerate(js):
        if j['status']=='completed':
            f=f'{k}_{i}.jpg'; open(f,'wb').write(httpx.get(j['results']['raw']['url'],timeout=60).content)
            q,fill,_=quad(f); out.append(f'{f} fill={fill:.3f} quad={q}')
    open(f'{k}_check.txt','w').write('\n'.join(out)); print('\n'.join(out)); print('use only fill >= 0.99, then LOOK at it')
elif cmd=='place':
    src,mv,out=sys.argv[3],sys.argv[4],sys.argv[5]; q,fill,g=quad(src); assert q and fill>=0.99, f'screen blocked/odd (fill {fill:.3f}) — regenerate'
    im=Image.open(src).convert('RGB'); m=Image.open(mv).convert('RGB').point(lambda v:int(v*0.93)); w,h=m.size
    A=[];b=[]
    for (x,y),(X,Y) in zip(q,[(0,0),(w,0),(w,h),(0,h)]): A+= [[x,y,1,0,0,0,-X*x,-X*y],[0,0,0,x,y,1,-Y*x,-Y*y]]; b+=[X,Y]
    c=np.linalg.solve(np.array(A,float),np.array(b,float)); warped=m.transform(im.size,Image.PERSPECTIVE,c,Image.BICUBIC)
    P=Image.new('L',im.size,0); ImageDraw.Draw(P).polygon(q,fill=1); P=np.array(P).astype(bool)  # only the screen quad (not green-lit keyboard/trackpad)
    mask=ndimage.binary_dilation(ndimage.binary_fill_holes(g&ndimage.binary_dilation(P,iterations=4)),iterations=3)&ndimage.binary_dilation(P,iterations=5)
    a=np.array(im).astype(float); R,G,Bc=a[...,0],a[...,1],a[...,2]; sp=~mask; a[...,1]=np.where(sp,np.minimum(G,np.maximum(R,Bc)),G)  # despill: green never above max(R,B) (keeps greys, no dark blotches)
    Image.composite(warped,Image.fromarray(a.clip(0,255).astype('uint8')),Image.fromarray((mask*255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))).save(out,quality=95)
elif cmd=='text':
    src,t,out=sys.argv[3],sys.argv[4],sys.argv[5]; ty=float(sys.argv[6]) if len(sys.argv)>6 else 0.10
    im=Image.open(src).convert('RGB'); im=im.resize((1080,int(im.height*1080/im.width)),Image.LANCZOS); top=max(0,(im.height-1350)//2); im=im.crop((0,top,1080,top+1350))
    fo=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',40); lay=Image.new('RGBA',im.size,(0,0,0,0)); d=ImageDraw.Draw(lay); w=d.textlength(t,font=fo); y=int(1350*ty)
    sh=Image.new('RGBA',im.size,(0,0,0,0)); ImageDraw.Draw(sh).text(((1080-w)/2,y),t,font=fo,fill=(0,0,0,190)); sh=sh.filter(ImageFilter.GaussianBlur(5)); d.text(((1080-w)/2,y),t,font=fo,fill=(255,255,255,245))
    Image.alpha_composite(Image.alpha_composite(im.convert('RGBA'),sh),lay).convert('RGB').save(out,quality=93)
