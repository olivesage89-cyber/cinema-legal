import json,sys,os,subprocess
D=os.path.abspath(sys.argv[1]);P=json.load(open(f'{D}/plan.json'));E=os.path.dirname(os.path.abspath(__file__))
F=E+'/node_modules/@fontsource/'
def ff(fam,pkg,w,st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS=ff('Ci','cinzel',600)+ff('Ka','kaushan-script',400)+ff('Mo','montserrat',600)+"""*{margin:0;padding:0}body{width:1080px;height:1350px;background:#101E16;color:#FBF3E4;text-align:center;position:relative;overflow:hidden}
.glow{position:absolute;inset:0;background:radial-gradient(ellipse 90% 40% at 50% 0%,rgba(70,100,62,.55),transparent 70%)}
.k{position:absolute;top:58px;width:100%;font:600 22px Mo;letter-spacing:.5em;padding-left:.5em}
.t{position:absolute;top:100px;width:100%;font:600 62px/1.08 Ci;letter-spacing:.05em;text-transform:uppercase}
.big{position:absolute;left:0;top:268px;width:1080px;height:560px;background-size:cover;border-top:4px solid rgba(251,236,205,.6);border-bottom:4px solid rgba(251,236,205,.6)}
.sm{position:absolute;top:842px;width:533px;height:300px;background-size:cover;border:3px solid rgba(251,236,205,.55);box-sizing:border-box}
.l{position:absolute;top:1170px;width:100%;font:400 54px/1.1 Ka}
.m{position:absolute;top:1252px;width:100%;font:600 24px Mo;letter-spacing:.3em;padding-left:.3em;color:#E6DCC6}
.gr{position:absolute;inset:0;opacity:.07;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")}"""
S=P['slides'];pages={}
for i,f in enumerate(P['films']):
    a=f['accent'];b,s1,s2=S[i]
    bp=lambda x:f"background-image:url(file://{D}/{x[0]});background-position:{x[1]}% {x[2]}%"
    two=f['t'].count('<br>')
    top=100 if two else 128
    pages[f'0{i+1}']=(f"<div class=glow></div><div class=k style='color:{a}'>✦ &nbsp;STOP 0{i+1} OF 05&nbsp; ✦</div><div class=t style='top:{top}px;font-size:{56 if two else 66}px'>{f['t']}</div>"
      f"<div class=big style='{bp(b)}'></div><div class=sm style='left:4px;{bp(s1)}'></div><div class=sm style='left:543px;{bp(s2)}'></div>"
      f"<div class=l style='color:{a}'>{f['line']}</div><div class=m>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div><div class=gr></div>")
html={k:f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k,v in pages.items()}
js=("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});"
 "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_s.html',O[k]);await p.goto('file://%s/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);"
 "await p.screenshot({path:'%s/out/'+k+'.jpg',type:'jpeg',quality:93});}await b.close();})();")%(json.dumps(html),D,D,D)
open(f'{D}/_s.js','w').write(js);subprocess.run(f'cd {E} && node {D}/_s.js',shell=True,check=True)
