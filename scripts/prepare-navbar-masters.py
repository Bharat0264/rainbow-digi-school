"""Offline only: preserve original geometry, split layers, prepare web-source masters."""
from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np
import vtracer, re
root=Path('design-masters'); out=Path('public/assets/nav/optimized');out.mkdir(parents=True,exist_ok=True)
def clean(im):
 a=np.array(im.convert('RGBA')); alpha=Image.fromarray(a[:,:,3]);near=np.array(Image.eval(alpha,lambda x:255 if x<12 else 0).filter(ImageFilter.MaxFilter(5)))>0
 rgb=a[:,:,:3].astype(float);sat=rgb.max(2)-rgb.min(2)
 # Restrict background cleanup to the exterior 2px ring; internal details stay intact.
 bad=near & (sat<25) & (rgb.max(2)>65)
 a[bad,3]=0
 alpha=Image.fromarray(a[:,:,3]).filter(ImageFilter.GaussianBlur(.5))
 a[:,:,3]=np.array(alpha)
 # Decontaminate only partially transparent exterior pixels with adjacent opaque colors.
 edge=(a[:,:,3]>0)&(a[:,:,3]<245)&near
 best=a[:,:,3].copy(); colors=a[:,:,:3].copy()
 for dy in [-1,0,1]:
  for dx in [-1,0,1]:
   shifted=np.roll(a,(dy,dx),(0,1));take=edge&(shifted[:,:,3]>best)
   best[take]=shifted[:,:,3][take];colors[take]=shifted[:,:,:3][take]
 a[edge,:3]=colors[edge];a[a[:,:,3]==0,:3]=0
 return Image.fromarray(a)
for compact in [False,True]:
 src=Image.open('public/images/navigation/'+('branch-house-compact-detailed.webp' if compact else 'branch-house-detailed.webp')).convert('RGBA')
 src=clean(src)
 if compact: im=src
 else:
  im=Image.open(root/'canopy.png').convert('RGBA')
  im.putalpha(src.getchannel('A').resize(im.size,Image.Resampling.LANCZOS))
  im=im.resize((7680,1520),Image.Resampling.LANCZOS)
 a=np.array(im);w,h=im.size;rgb=a[:,:,:3].astype(float)
 green=(rgb[:,:,1]>rgb[:,:,0]*.98)&(rgb[:,:,1]>rgb[:,:,2]*1.12)
 yy,xx=np.indices((h,w));nx=xx/w*(1536 if compact else 2172);ny=yy/h*(1024 if compact else 430)
 house=((nx>590)&(nx<985)&(ny<444)) if compact else ((nx>938)&(nx<1248)&(ny<313))
 masks={'leaves':green,'house':house&~green,'branch':~house&~green}
 for name,mask in masks.items():
  layer=a.copy();layer[~mask]=0
  Image.fromarray(layer).save(root/f'{"compact" if compact else "desktop"}-{name}.png')
 im.save(root/f'{"compact" if compact else "desktop"}-master.png')
 print('prepared',compact,im.size,flush=True)
# Trace existing coils and metal contours, keeping their original SVG coordinate systems.
for name,size,original in [('branch-double-wrap',(256,384),(1024,1536)),('hex-brass-rope-connector',(256,512),(887,1774)),('gold-rail-screw',(96,96),(256,256)),('board-rope-hex-nut',(128,128),(256,256))]:
 im=clean(Image.open(f'public/assets/nav/{name}.webp')).resize(size,Image.Resampling.LANCZOS)
 path=root/f'{name}-trace.png';im.save(path)
 target=out/f'{name}.svg'
 vtracer.convert_image_to_svg_py(str(path),str(target),colormode='color',hierarchical='stacked',mode='spline',filter_speckle=2,color_precision=5,layer_difference=20,path_precision=1)
 s=target.read_text();s=re.sub(r'<\?xml.*?\?>','',s);s=re.sub(r'<!--.*?-->','',s,flags=re.S)
 s=s.replace(f'width="{size[0]}" height="{size[1]}"',f'width="{original[0]}" height="{original[1]}" viewBox="0 0 {size[0]} {size[1]}"')
 target.write_text(re.sub(r'>\s+<','><',s).strip());print(name,target.stat().st_size,flush=True)
