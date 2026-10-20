// Offline exports only. sharp is installed under ignored artifacts/tooling.
import {createRequire} from 'node:module';import fs from 'node:fs/promises';
const require=createRequire(new URL('../artifacts/tooling/package.json',import.meta.url));const sharp=require('sharp');const rows=[];
for(const kind of ['desktop','compact'])for(const width of [1600,2400,3200,3600,4800,5400]){
 const input=`design-masters/bark-only/${kind}-bark-master.png`;
 const base=sharp(input).resize({width,kernel:'lanczos3',withoutEnlargement:true}).toColourspace('srgb').sharpen({sigma:.5,m1:.3,m2:.3});
 for(const format of ['avif','webp']){
  const path=`public/images/navigation/bark/${kind}-bark-${width}.${format}`;
  const info=await (format==='avif'?base.clone().avif({quality:60,effort:4,chromaSubsampling:'4:4:4'}):base.clone().webp({quality:85,alphaQuality:100,effort:5})).toFile(path);
  rows.push({kind,width:info.width,height:info.height,format,bytes:info.size});console.log(kind,width,format,Math.round(info.size/1024)+' KiB');
 }
}
await fs.writeFile('artifacts/bark-export-sizes.json',JSON.stringify(rows,null,2));
