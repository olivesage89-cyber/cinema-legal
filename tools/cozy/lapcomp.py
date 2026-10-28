import sys, subprocess, numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
src, crop, trailer_clips, out = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]   # crop "w:h:x:y" or "none"; clips "file@ss@d,file@ss@d"
r=lambda c: subprocess.run(c,shell=True,check=True)
vf=f"crop={crop},scale=1080:1920" if crop!='none' else "scale=1080:1920"
r(f"ffmpeg -v error -y -i {src} -vf {vf},fps=24 -c:v libx264 -crf 14 _lz.mp4")
r("ffmpeg -v error -y -ss 1 -i _lz.mp4 -frames:v 1 _lf.png")
a=np.array(Image.open('_lf.png').convert('RGB')).astype(int); R,G,B=a[...,0],a[...,1],a[...,2]
m=(G>150)&(G>R+60)&(G>B+50); lab,n=ndimage.label(m); sz=ndimage.sum(m,lab,range(1,n+1)); m=ndimage.binary_fill_holes(lab==(sz.argmax()+1))
ys,xs=np.nonzero(m); s=xs+ys; d=xs-ys
q=[(xs[s.argmin()]-2,ys[s.argmin()]-2),(xs[d.argmax()]+2,ys[d.argmax()]-2),(xs[s.argmax()]+2,ys[s.argmax()]+2),(xs[d.argmin()]-2,ys[d.argmin()]+2)]
key='0x%02X%02X%02X'%tuple(int(v) for v in np.median(a[m],axis=0))
q=[(int(x),int(y)) for x,y in q]; print('quad',q,'key',key)
Image.new('L',(1080,1920),0).save('_q.png'); im=Image.new('L',(1080,1920),0); ImageDraw.Draw(im).polygon(q,fill=255); im.save('_q.png')
ins=''; fl=''; parts=trailer_clips.split(',')
for i,p in enumerate(parts):
    f,ss,dd=p.split('@'); ins+=f" -ss {ss} -t {dd} -i {f}"; fl+=f"[{i}]fps=24,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1[c{i}];"
fl+=''.join(f'[c{i}]' for i in range(len(parts)))+f"concat=n={len(parts)}:v=1,eq=brightness=-0.04:saturation=0.9,scale=1080:1920,setsar=1,format=rgba,perspective={q[0][0]}:{q[0][1]}:{q[1][0]}:{q[1][1]}:{q[3][0]}:{q[3][1]}:{q[2][0]}:{q[2][1]}:sense=destination[o]"
r(f'ffmpeg -v error -y {ins} -filter_complex "{fl}" -map "[o]" -t 5 -c:v png _tr.mov')
r(f'ffmpeg -v error -y -i _lz.mp4 -i _tr.mov -loop 1 -i _q.png -filter_complex "[0]split=3[o1][o2][o3];[o1]despill=type=green:mix=0.7:expand=0.2[d1];[o3]despill=type=green:mix=0.7:expand=0.2,format=rgba[d2];[o2]chromakey={key}:0.2:0.08,format=rgba,alphaextract[ka];[d2][ka]alphamerge[k];[2]format=gray[m];[1][m]alphamerge[t];[d1][t]overlay=0:0:shortest=1[b1];[b1][k]overlay=0:0,format=yuv420p" -t 5 -c:v libx264 -crf 14 {out}')
