// Offline encoder. Install sharp in an ignored tooling folder; no production dependency.
import {createRequire} from 'node:module';import fs from 'node:fs/promises';
const require=createRequire(new URL('../artifacts/tooling/package.json',import.meta.url));const sharp=require('sharp');
const out='public/assets/nav/optimized';await fs.mkdir(out,{recursive:true});const manifest={};
async function exportSet(name,input,widths){
 const metadata=await sharp(input).metadata();manifest[name]={source:[metadata.width,metadata.height],variants:[]};
 for(const width of widths.filter(w=>w<=metadata.width)){
  const base=sharp(input).resize({width,kernel:'lanczos3',withoutEnlargement:true}).toColourspace('srgb').sharpen({sigma:.5,m1:.3,m2:.3});
  for(const format of ['avif','webp']){
   const file=`${out}/${name}-${width}.${format}`;
   const result=await (format==='avif'?base.clone().avif({quality:60,effort:4,chromaSubsampling:'4:4:4'}):base.clone().webp({quality:85,alphaQuality:100,effort:5})).toFile(file);
   manifest[name].variants.push({width:result.width,height:result.height,format,bytes:result.size});
  }
 }
 console.log(name,manifest[name].variants.map(v=>`${v.width}/${v.format}:${Math.round(v.bytes/1024)}K`).join(' '));
}
for(const type of ['desktop','compact'])for(const layer of ['branch','leaves','house'])await exportSet(`${type}-${layer}`,`design-masters/${type}-${layer}.png`,type==='desktop'?[1600,2400,3200,4800,5400]:[480,960,1440,1536]);
await exportSet('assembly','public/assets/nav/connected-logo-mascot.webp',[320,640,960,1106]);
await exportSet('board','design-masters/board-master.png',[180,240,360,480,594,720]);
await exportSet('gait','design-masters/gait.png',[1024,2048,3072]);
await exportSet('entry','design-masters/entry.png',[512,1024,1536]);
const {optimize}=await import('../artifacts/tooling/node_modules/svgo/lib/svgo.js');
for(const name of ['branch-double-wrap','hex-brass-rope-connector','gold-rail-screw','board-rope-hex-nut']){
 const path=`${out}/${name}.svg`;const svg=await fs.readFile(path,'utf8');
 await fs.writeFile(path,optimize(svg,{multipass:true,floatPrecision:0}).data);
}
await fs.writeFile('docs/navbar-art-manifest.json',JSON.stringify(manifest,null,2));
