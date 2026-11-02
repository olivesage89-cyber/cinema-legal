import sys,json
from PIL import Image
from rembg import remove,new_session
D='/root/work/mc/'
S=json.load(open(D+'slides.json'))
sess=new_session(sys.argv[1] if len(sys.argv)>1 else 'u2net_human_seg')
for s in S:
    if s.get('type')=='cover': continue
    im=Image.open(D+s['img']).convert('RGB'); W,H=im.size
    z=s.get('z',1); ch=H/z; cw=ch*1080/1350
    if cw>W: cw=W; ch=cw*1350/1080
    x0=(W-cw)*s['x']/100; y0=(H-ch)*s.get('y',50)/100
    c=im.crop((int(x0),int(y0),int(x0+cw),int(y0+ch))).resize((1080,1350),Image.LANCZOS)
    n=s['file'][:2]; c.save(D+f'cut/{n}_bg.jpg',quality=95)
    fg=remove(c,session=sess,post_process_mask=True); fg.save(D+f'cut/{n}_fg.png')
    print(n,flush=True)
