import json,sys,os,subprocess
from PIL import Image, ImageFilter, ImageDraw
D=os.path.abspath(sys.argv[1]); P=json.load(open(f'{D}/plan.json')); E=os.path.dirname(os.path.abspath(__file__)); os.makedirs(f'{D}/ig',exist_ok=True)
F=E+'/node_modules/@fontsource/'
def ff(fam,pkg,w,st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS=ff('It','italiana',400)+ff('In','inter',500)+ff('In','inter',600)+ff('Bo','bodoni-moda',400,'italic')
INK='#F3EEE4';RED='#9BD3F2'
pick=[(0,1),(2,0),(0,2),(0,2),(2,1)]
pages=[]
for i,f in enumerate(P['films']):
    a,b=pick[i]; s1=f['stills'][a]; s2=f['stills'][b]
    pages.append(f"""<html><head><meta charset=utf-8><style>{CSS}*{{margin:0;padding:0}}body{{width:1080px;height:1350px;background:radial-gradient(ellipse 90% 60% at 50% 0%,#1A2A52,#0A1226 70%);position:relative;overflow:hidden;color:{INK};text-align:center}}
.k{{position:absolute;top:58px;width:100%;font:500 24px In;letter-spacing:.42em;color:{RED}}}
.t{{position:absolute;top:92px;height:130px;width:100%;display:flex;align-items:center;justify-content:center;font:400 {f.get('igfs',int(f['fs']*0.92))}px/1.0 It;letter-spacing:.06em;white-space:nowrap}}
.y{{position:absolute;top:232px;width:100%;font:500 26px In;letter-spacing:.3em;opacity:.9}}
.big{{position:absolute;left:0;top:290px;width:1080px;height:608px;background:url(file://{D}/{s1[0]}) {s1[1]}% {s1[2]}%/cover;filter:saturate(.95) contrast(1.06)}}
.hl{{position:absolute;left:0;width:100%;height:2px;background:rgba(243,238,228,.5)}}
.ins{{position:absolute;left:64px;top:940px;width:440px;height:248px;background:url(file://{D}/{s2[0]}) {s2[1]}% {s2[2]}%/cover;border:10px solid #EDE6D6;box-shadow:0 14px 40px rgba(0,0,0,.7);transform:rotate(-3deg)}}
.tape{{position:absolute;left:220px;top:920px;width:150px;height:40px;background:rgba(232,220,190,.55);transform:rotate(-6deg)}}
.r{{position:absolute;left:560px;right:56px;top:960px;text-align:left}}.l{{font:italic 400 44px/1.18 Bo}}.s{{margin-top:26px;font:500 22px In;letter-spacing:.3em;color:rgba(243,238,228,.62)}}
.st{{position:absolute;right:70px;top:1120px;width:210px;height:210px;transform:rotate(-14deg);opacity:.9;color:{RED}}}.st .o{{position:absolute;inset:0;border:5px solid {RED};border-radius:50%}}.st .i{{position:absolute;inset:12px;border:2px solid {RED};border-radius:50%}}.st .a{{position:absolute;top:44px;width:100%;font:600 16px In;letter-spacing:.4em;padding-left:.4em}}.st .c{{position:absolute;top:72px;left:14px;right:14px;height:62px;display:flex;align-items:center;justify-content:center;font:400 {int(f.get('sfs',60)*0.7)}px/1 It;border-top:2px solid {RED};border-bottom:2px solid {RED}}}.st .d{{position:absolute;top:148px;width:100%;font:600 15px In;letter-spacing:.22em;padding-left:.22em}}
.mk{{position:absolute;left:64px;top:1262px;font:500 18px In;letter-spacing:.4em;color:rgba(243,238,228,.45)}}
</style></head><body><div class=k>DESTINATION 0{i+1} / 05 &nbsp;·&nbsp; {f['place']}</div><div class=t>{f['t']}</div><div class=y>{f['yr']} &nbsp;<span style='color:{RED}'>|</span>&nbsp; {f['where']}</div>
<div class=big></div><div class=hl style='top:288px'></div><div class=hl style='top:898px'></div><div class=ins></div><div class=tape></div>
<div class=r><div class=l>{f['line']}</div><div class=s>{f['route']}</div></div>
<div class=st><div class=o></div><div class=i></div><div class=a>ARRIVED</div><div class=c>{f['place']}</div><div class=d>10 · NOV · 26</div></div><div class=mk>A JET-SET SPY · Nº 0{i+1}</div></body></html>""")
js="const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});const O=%s;for(let i=0;i<O.length;i++){fs.writeFileSync('%s/_s.html',O[i]);await p.goto('file://%s/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);await p.screenshot({path:'%s/ig/0'+(i+1)+'.png'});}await b.close();})();"%(json.dumps(pages),D,D,D)
open(f'{D}/_s.js','w').write(js); subprocess.run(f'cd {E} && node {D}/_s.js',shell=True,check=True)
for i in range(1,6):
    im=Image.open(f'{D}/ig/0{i}.png').convert('RGB'); im.save(f'{D}/ig/0{i}.jpg',quality=93); os.remove(f'{D}/ig/0{i}.png')
bg=Image.open(f"{D}/{P['end_bg']}").convert('RGB'); W,H=1080,1350; s=max(W/bg.width,H/bg.height)*1.1
bg=bg.resize((int(bg.width*s),int(bg.height*s))); l=int((bg.width-W)*.4); t0=(bg.height-H)//2
bg=bg.crop((l,t0,l+W,t0+H)).filter(ImageFilter.GaussianBlur(30)); bg=Image.blend(bg,Image.new('RGB',(W,H),(10,18,38)),0.35)
ph=Image.open(f"{D}/app/phone.png").convert('RGBA'); ph=ph.crop(ph.getbbox()); ph=ph.resize((int(ph.width*1180/ph.height),1180),Image.LANCZOS)
mk=Image.new('L',(W,H),0); ImageDraw.Draw(mk).rounded_rectangle([(W-ph.width)//2+15,(H-1180)//2+30,(W+ph.width)//2-15,(H+1180)//2+22],90,fill=150)
mk=mk.filter(ImageFilter.GaussianBlur(32)); bg=Image.composite(Image.new('RGB',(W,H),(0,0,0)),bg,mk)
bg.paste(ph,((W-ph.width)//2,(H-1180)//2),ph); bg.save(f'{D}/ig/06_cinema.jpg',quality=93)
