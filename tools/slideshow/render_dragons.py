import json,sys,os,subprocess
from PIL import Image, ImageFilter, ImageDraw
D=os.path.abspath(sys.argv[1]); P=json.load(open(f'{D}/plan.json')); E=os.path.dirname(os.path.abspath(__file__))
F=E+'/node_modules/@fontsource/'
def ff(fam,pkg,w,st='normal'): return f"@font-face{{font-family:'{fam}';font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS=ff('Al','almendra-sc',400)+ff('Fo','fondamento',400,'italic')+ff('Te','tenor-sans',400)
G='#E9B65A';EMB='#FF7A2E';INK='#F4E7CF'
GT="background:linear-gradient(180deg,#FFE7A8 0%,#E9B65A 45%,#B9772C 100%);-webkit-background-clip:text;color:transparent"
pages=[]
pick=[(0,2),(1,0),(0,3),(0,1),(0,3)]
for i,f in enumerate(P['films']):
    a,b=pick[i]; s1=f['stills'][a]; s2=f['stills'][b]
    html=f"""<html><head><meta charset=utf-8><style>{CSS}*{{margin:0;padding:0}}body{{width:1080px;height:1350px;background:radial-gradient(ellipse 80% 60% at 50% 100%,#2A170C,#120B07 70%);position:relative;overflow:hidden;color:{INK};text-align:center}}
.big{{position:absolute;left:0;top:0;width:1080px;height:760px;background:url(file://{D}/{s1[0]}) {s1[1]}% {s1[2]}%/cover;filter:saturate(1.06) contrast(1.05)}}
.fade{{position:absolute;left:0;top:560px;width:1080px;height:202px;background:linear-gradient(180deg,rgba(18,11,7,0),#120B07)}}
.ins{{position:absolute;right:70px;top:500px;width:400px;height:225px;background:url(file://{D}/{s2[0]}) {s2[1]}% {s2[2]}%/cover;border:3px solid {G};box-shadow:0 10px 40px rgba(0,0,0,.7)}}
.blk{{position:absolute;left:70px;right:60px;bottom:90px;text-align:left}}.k{{font:28px Te;letter-spacing:.4em;color:{G};text-align:left}}
.t{{margin:22px 0 0 -4px;font:{min(104,int(f.get('fs',86)*1.2))}px/1.05 Al;text-align:left;{GT};filter:drop-shadow(0 0 24px rgba(255,122,46,.25))}}
.y{{margin-top:22px;font:30px Te;letter-spacing:.3em;color:{EMB};text-align:left}}
.l{{margin-top:16px;font:italic 46px/1.2 Fo;text-align:left}}
.fr{{position:absolute;inset:26px;border:1.5px solid rgba(233,182,90,.55)}}
</style></head><body><div class=big></div><div class=fade></div><div class=ins></div><div class=fr></div>
<div class=blk><div class=k>HERE BE DRAGONS · Nº 0{i+1}</div><div class=t>{f['t']}</div><div class=y>{f['yr']} &nbsp;|&nbsp; {f['where']}</div><div class=l>{f['line']}</div></div></body></html>"""
    pages.append(html)
js="const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});const O=%s;for(let i=0;i<O.length;i++){fs.writeFileSync('%s/_s.html',O[i]);await p.goto('file://%s/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);await p.screenshot({path:'%s/ig/0'+(i+1)+'.png'});}await b.close();})();"%(json.dumps(pages),D,D,D)
open(f'{D}/_s.js','w').write(js); subprocess.run(f'cd {E} && node {D}/_s.js',shell=True,check=True)
for i in range(1,6):
    im=Image.open(f'{D}/ig/0{i}.png').convert('RGB'); im.save(f'{D}/ig/0{i}.jpg',quality=93); os.remove(f'{D}/ig/0{i}.png')
# app slide
bg=Image.open(f"{D}/p1.jpg").convert('RGB'); W,H=1080,1350; s=max(W/bg.width,H/bg.height)*1.1
bg=bg.resize((int(bg.width*s),int(bg.height*s))); l=int((bg.width-W)*.45); t0=(bg.height-H)//2
bg=bg.crop((l,t0,l+W,t0+H)).filter(ImageFilter.GaussianBlur(30)); bg=Image.blend(bg,Image.new('RGB',(W,H),(14,9,6)),0.35)
ph=Image.open(f"{D}/app/phone.png").convert('RGBA'); ph=ph.crop(ph.getbbox()); ph=ph.resize((int(ph.width*1180/ph.height),1180),Image.LANCZOS)
mk=Image.new('L',(W,H),0); ImageDraw.Draw(mk).rounded_rectangle([(W-ph.width)//2+15,(H-1180)//2+30,(W+ph.width)//2-15,(H+1180)//2+22],90,fill=150)
mk=mk.filter(ImageFilter.GaussianBlur(32)); bg=Image.composite(Image.new('RGB',(W,H),(0,0,0)),bg,mk)
bg.paste(ph,((W-ph.width)//2,(H-1180)//2),ph); bg.save(f'{D}/ig/06_cinema.jpg',quality=93)
