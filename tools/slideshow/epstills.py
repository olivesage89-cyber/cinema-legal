import json,sys,urllib.request,os
from PIL import Image,ImageDraw
K='96d478e3d9b0de03ca0829bb8f987845';A='https://api.themoviedb.org/3/'
D,s,tid=sys.argv[1],sys.argv[2],sys.argv[3]; seasons=sys.argv[4].split(',') if len(sys.argv)>4 else ['1']
g=lambda p: json.load(urllib.request.urlopen(A+p+('&' if '?' in p else '?')+'api_key='+K))
m=json.load(open(D+'/meta.json')); bs=[]
for se in seasons:
  sd=g(f'tv/{tid}/season/{se}')
  for e in sd['episodes']:
    try: im=g(f"tv/{tid}/season/{se}/episode/{e['episode_number']}/images")['stills']
    except Exception: im=[]
    bs+= [x['file_path'] for x in im][:3]
bs=bs[:48]; key=s+'E'; m[key]=dict(m[s]); m[key]['b']=bs
sheet=Image.new('RGB',(1200,max(1,(len(bs)+5)//6)*113)); dr=ImageDraw.Draw(sheet)
for n,b in enumerate(bs):
  f=f'{D}/c/{key}_{n}.jpg'; urllib.request.urlretrieve('https://image.tmdb.org/t/p/w300'+b,f)
  x,y=(n%6)*200,(n//6)*113; sheet.paste(Image.open(f).convert('RGB').resize((200,113)),(x,y)); dr.text((x+5,y+5),str(n),fill='yellow')
sheet.save(f'{D}/sheet_{key}.jpg'); json.dump(m,open(D+'/meta.json','w'),indent=1); print(key,len(bs))
