// Encode the approved transparent image-tool outputs for production delivery.
import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const source='C:/Users/bhara/.codex/generated_images/01a12186-f2a1-7022-abcd-cd06469042ad/';
const assets=[
  ['exec-9140e577-a649-4470-832c-5082937b23aa.png','monkey-sign.webp',720],
  ['exec-27ffda45-3f4f-4e35-9a8d-2526dd7ecff3.png','treehouse.webp',800],
  ['exec-6125ce12-e099-48b0-9f3e-56be65481a38.png','squirrel-poses.webp',1200],
  ['exec-8cff38e5-d9f0-470f-98ef-5bcafc40c6f8.png','branch.webp',2172],
];
await mkdir('public/images/navigation',{recursive:true});
const browser=await chromium.launch();const page=await browser.newPage();
for(const [file,name,maxWidth] of assets){
  const input=(await readFile(source+file)).toString('base64');
  const result=await page.evaluate(async({input,maxWidth})=>{
    const img=new Image();img.src='data:image/png;base64,'+input;await img.decode();
    const canvas=document.createElement('canvas');canvas.width=Math.min(maxWidth,img.width);canvas.height=Math.round(img.height*canvas.width/img.width);
    const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);
    const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let transparent=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]===0)transparent++;
    return{data:canvas.toDataURL('image/webp',.91).split(',')[1],width:canvas.width,height:canvas.height,transparent};
  },{input,maxWidth});
  const bytes=Buffer.from(result.data,'base64');await writeFile('public/images/navigation/'+name,bytes);
  console.log(name,JSON.stringify({width:result.width,height:result.height,transparent:result.transparent,bytes:bytes.length}));
}
await browser.close();
