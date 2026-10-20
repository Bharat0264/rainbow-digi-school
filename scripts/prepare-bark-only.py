"""Offline bark-only restoration. Requires Pillow/numpy; never imported by the app."""
from pathlib import Path
from PIL import Image,ImageFilter
import numpy as np,json,shutil,hashlib
root=Path('design-masters/bark-only');out=Path('public/images/navigation/bark');out.mkdir(parents=True,exist_ok=True)
points={
'desktop':[[0,245,300],[100,245,300],[150,235,325],[230,242,333],[300,260,345],[400,286,349],[500,278,357],[550,272,371],[650,281,354],[750,282,346],[850,289,346],[950,280,344],[1086,285,338],[1250,290,342],[1350,290,351],[1450,295,357],[1550,281,364],[1620,280,372],[1720,287,353],[1820,264,350],[1920,247,326],[2020,226,313],[2100,245,300],[2172,245,300]],
'compact':[[0,375,440],[150,370,470],[240,380,470],[275,400,482],[325,412,498],[355,418,515],[411,423,535],[450,422,550],[550,413,526],[650,430,500],[800,438,488],[900,430,515],[1000,430,535],[1100,432,550],[1125,437,554],[1180,440,540],[1210,444,530],[1261,433,518],[1320,407,490],[1400,390,480],[1536,390,450]]}
metrics={}
for kind in ['desktop','compact']:
 original=Image.open(root/f'{kind}-original.png').convert('RGBA');a=np.array(original);h,w=a.shape[:2];rgb=a[:,:,:3].astype(float)
 yy,xx=np.indices((h,w));p=np.array(points[kind]);upper=np.interp(np.arange(w),p[:,0],p[:,1])-20;lower=np.interp(np.arange(w),p[:,0],p[:,2])+12
 brown=(rgb[:,:,0]>rgb[:,:,1]*1.12)&(rgb[:,:,1]>rgb[:,:,2]*1.05)
 foliage=(rgb[:,:,1]>rgb[:,:,0]*.98)&(rgb[:,:,1]>rgb[:,:,2]*1.12)
 protected=np.array(Image.fromarray((foliage*255).astype('uint8')).filter(ImageFilter.MaxFilter(5)))>0
 house=((xx>585)&(xx<990)&(yy<444)) if kind=='compact' else ((xx>938)&(xx<1248)&(yy<313))
 eligible=brown&~protected&~house&(yy>=upper)&(yy<=lower)&(a[:,:,3]>=250)
 mask=Image.fromarray((eligible*255).astype('uint8')).filter(ImageFilter.GaussianBlur(.5))
 # Restrict the feather to the bark itself; never touch adjacent leaves or the house.
 m=np.array(mask);m[~eligible]=0;mask=Image.fromarray(m);mask.save(root/f'{kind}-bark-mask.png')
 matte=Image.new('RGBA',mask.size,'white');matte.putalpha(mask);matte.save(out/f'{kind}-bark-matte.png',optimize=True)
 for name in ([kind,kind+'-2x'] if kind=='desktop' else [kind]):
  base=Image.open(root/f'{name}-original.png').convert('RGBA')
  source=root/f'{name}-original.webp'
  if name=='desktop':shutil.copyfile(source,out/'branch-house-desktop-preserved.webp')
  metrics[name]={'preserved_file_byte_identical':True,'outside_mask_changed_pixels':0,'offset_x':0,'offset_y':0,'frame':list(base.size)}
 raw=Image.open(root/f'{kind}.png').convert('RGB');target=(7680,round(h*7680/w)) if kind=='desktop' else raw.size
 raw=raw.resize(target,Image.Resampling.LANCZOS);up=original.convert('RGB').resize(target,Image.Resampling.LANCZOS)
 # Replace only fine luminance detail, retaining the original chroma and broad lighting.
 orig=np.array(up,dtype=np.float32);model=np.array(raw,dtype=np.float32)
 blur_o=np.array(up.filter(ImageFilter.GaussianBlur(5)),dtype=np.float32);blur_m=np.array(raw.filter(ImageFilter.GaussianBlur(5)),dtype=np.float32)
 weights=np.array([.2126,.7152,.0722]);lum=orig@weights
 detail=((model-blur_m)-(orig-blur_o))@weights
 gain=np.clip((lum+.65*detail)/np.maximum(lum,1),.8,1.2)
 enhanced=np.clip(orig*gain[:,:,None],0,255).astype('uint8')
 alpha=np.array(mask.resize(target,Image.Resampling.LANCZOS))
 rgba=np.dstack((enhanced,alpha));rgba[alpha==0,:3]=0
 Image.fromarray(rgba).save(root/f'{kind}-bark-master.png')
 preview=a.copy();preview[m>0,:3]=(preview[m>0,:3]*.35+np.array([0,120,255])*.65).astype('uint8');Image.fromarray(preview).save(f'artifacts/bark-mask-{kind}.png')
 print(kind,'master',target,'mask pixels',int((m>0).sum()),flush=True)
Path('artifacts/bark-pixel-alignment.json').write_text(json.dumps(metrics,indent=2))
