import json,os,subprocess,sys
D=os.path.expanduser('~/work/one-night'); P=json.load(open(D+'/plan.json')); E=os.path.expanduser('~/engine')
F=E+'/node_modules/@fontsource/'
def ff(fam,pkg,w=400,st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS=ff('Ds','dm-serif-display')+ff('Ds','dm-serif-display',400,'italic')+ff('Tm','share-tech-mono')+"*{margin:0;padding:0}body{width:1080px;height:1350px;color:#FBF1E4;text-align:center;background:radial-gradient(ellipse at 50% 12%,#1A1640 0,#0D0F26 42%,#070A16 78%);overflow:hidden}"
MAG='#FF4FA3'
NEON=f"text-shadow:0 0 6px #fff,0 0 18px {MAG},0 0 42px {MAG},0 0 80px rgba(255,79,163,.6)"
box=f"border-radius:28px;border:2px solid rgba(255,190,225,.85);box-shadow:0 0 0 2px {MAG},0 0 22px rgba(255,79,163,.55),0 0 50px rgba(255,79,163,.22);background-size:cover;filter:saturate(1.05) contrast(1.04)"
pages={}
for i,f in enumerate(P['films']):
    im=f['imgs']; h,m,ap=f['clock']
    def bg(it): return f"background-image:url(file://{D}/{it[0]});background-position:{it[1]}% {it[2]}%"
    pages[f'0{i+1}']=(f"<div style='position:absolute;top:70px;width:100%;font:400 40px Tm;letter-spacing:.12em;color:#FFB54A;text-shadow:0 0 10px rgba(255,181,74,.9),0 0 30px rgba(255,140,40,.45)'>{h}:{m} <span style='font-size:27px'>{ap}</span><span style='font-size:22px;letter-spacing:.3em;color:rgba(255,181,74,.7)'>&nbsp;&nbsp;·&nbsp;&nbsp;NO.0{i+1}</span></div>"
      f"<div style='position:absolute;left:50px;top:150px;width:976px;height:560px;{box};{bg(im[0])}'></div>"
      f"<div style='position:absolute;left:50px;top:740px;width:476px;height:290px;{box};{bg(im[1])}'></div>"
      f"<div style='position:absolute;left:550px;top:740px;width:476px;height:290px;{box};{bg(im[2])}'></div>"
      f"<div style='position:absolute;top:1070px;width:100%;font:400 {min(92,int(f.get('fs',84)*1.0))}px/1 Ds;color:#FFF4FA;{NEON}'>{f['t']}</div>"
      f"<div style='position:absolute;top:1178px;width:100%;font:400 27px Tm;letter-spacing:.26em;color:#7FE9FF;text-shadow:0 0 10px rgba(127,233,255,.5)'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div>"
      f"<div style='position:absolute;top:1226px;width:100%;font:italic 400 38px/1.15 Ds;color:#EDE6F2'>{f['line']}</div>")
html={k:f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k,v in pages.items()}
js=("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});"
 "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_s.html',O[k]);await p.goto('file://%s/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);"
 "await p.screenshot({path:'%s/out/'+k+'.jpg',type:'jpeg',quality:92});}await b.close();})();")%(json.dumps(html),D,D,D)
open(D+'/_s.js','w').write(js); subprocess.run(f'cd {E} && node {D}/_s.js',shell=True,check=True)
# app slide
from PIL import Image,ImageFilter,ImageEnhance,ImageDraw
W,H=1080,1350
b=Image.open(D+'/f15.jpg').convert('RGB'); s=max(W/b.width,H/b.height); b=b.resize((int(b.width*s)+1,int(b.height*s)+1)); b=b.crop(((b.width-W)//2,(b.height-H)//2,(b.width-W)//2+W,(b.height-H)//2+H))
b=ImageEnhance.Brightness(b.filter(ImageFilter.GaussianBlur(36))).enhance(0.6)
ph=Image.open(D+'/phone.png').convert('RGBA'); ph=ph.crop(ph.getbbox()); ph=ph.resize((int(ph.width*1180/ph.height),1180),Image.LANCZOS)
mk=Image.new('L',(W,H),0); ImageDraw.Draw(mk).rounded_rectangle([(W-ph.width)//2+15,(H-1180)//2+30,(W+ph.width)//2-15,(H+1180)//2+25],90,fill=160); mk=mk.filter(ImageFilter.GaussianBlur(30))
b=Image.composite(Image.new('RGB',(W,H)),b,mk); b.paste(ph,((W-ph.width)//2,(H-1180)//2),ph); b.save(D+'/out/06_cinema.jpg',quality=93)
