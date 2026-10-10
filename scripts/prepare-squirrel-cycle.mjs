import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';

// Normalize the generated 4x2 gait atlas to a common foot baseline and cell size.
const input = process.argv[2];
if (!input) throw new Error('Pass the generated transparent 4x2 PNG path');
const browser = await chromium.launch();
const page = await browser.newPage();
const result = await page.evaluate(async base64 => {
  const image = new Image(); image.src = `data:image/png;base64,${base64}`; await image.decode();
  const source = document.createElement('canvas'); source.width = image.width; source.height = image.height;
  const ctx = source.getContext('2d'); ctx.drawImage(image, 0, 0);
  const atlas = document.createElement('canvas'); atlas.width = 1024; atlas.height = 128;
  const out = atlas.getContext('2d');
  const bounds = [], cells = [];
  for (let i = 0; i < 8; i++) {
    let x = Math.round(i % 4 * image.width / 4);
    const y = Math.round(Math.floor(i / 4) * image.height / 2);
    let w = Math.floor(image.width / 4);
    const h = Math.floor(image.height / 2);
    // The generated extended stride crosses its nominal column boundary.
    if(i===5) w=Math.round(image.width*.528)-x;
    if(i===6) {x=Math.round(image.width*.528);w=Math.round(image.width*.75)-x;}
    const pixels = ctx.getImageData(x, y, w, h).data;
    const visited=new Uint8Array(w*h), queue=new Int32Array(w*h);
    let best={count:0,minX:w,minY:h,maxX:0,maxY:0};
    for(let seed=0;seed<w*h;seed++) {
      if(visited[seed] || pixels[seed*4+3]<=150) continue;
      let head=0,tail=1;queue[0]=seed;visited[seed]=1;
      const box={count:0,minX:w,minY:h,maxX:0,maxY:0};
      while(head<tail){
        const p=queue[head++],px=p%w,py=Math.floor(p/w);box.count++;
        box.minX=Math.min(box.minX,px);box.maxX=Math.max(box.maxX,px);box.minY=Math.min(box.minY,py);box.maxY=Math.max(box.maxY,py);
        const neighbors=[px>0?p-1:-1,px<w-1?p+1:-1,py>0?p-w:-1,py<h-1?p+w:-1];
        for(const q of neighbors)if(q>=0&&!visited[q]&&pixels[q*4+3]>150){visited[q]=1;queue[tail++]=q;}
      }
      if(box.count>best.count)best={...box,seed};
    }
    const {minX,minY,maxX,maxY}=best;
    // Remove disconnected neighbor fragments inside the bounding rectangle too,
    // while retaining a two-pixel antialiased fringe around the main silhouette.
    const keep=new Uint8Array(w*h);let head=0,tail=1;queue[0]=best.seed;keep[best.seed]=1;
    while(head<tail){const p=queue[head++],px=p%w,py=Math.floor(p/w);
      for(const q of [px>0?p-1:-1,px<w-1?p+1:-1,py>0?p-w:-1,py<h-1?p+w:-1])
        if(q>=0&&!keep[q]&&pixels[q*4+3]>150){keep[q]=1;queue[tail++]=q;}
    }
    for(let p=0;p<w*h;p++)if(!keep[p]){
      const px=p%w,py=Math.floor(p/w);let nearby=false;
      for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(px+dx>=0&&px+dx<w&&py+dy>=0&&py+dy<h&&keep[(py+dy)*w+px+dx])nearby=true;
      if(!nearby)pixels[p*4+3]=0;
    }
    const cell=document.createElement('canvas');cell.width=w;cell.height=h;
    cell.getContext('2d').putImageData(new ImageData(pixels,w,h),0,0);
    cells.push({cell,minX,minY});
    bounds.push({x:x+minX,y:y+minY,w:maxX-minX+1,h:maxY-minY+1});
  }
  const scale = 116 / Math.max(...bounds.map(b => Math.max(b.w,b.h)));
  bounds.forEach((b,i) => out.drawImage(cells[i].cell,cells[i].minX,cells[i].minY,b.w,b.h,i*128+(128-b.w*scale)/2,120-b.h*scale,b.w*scale,b.h*scale));
  return { data: atlas.toDataURL('image/webp',.9).split(',')[1], bounds };
}, (await readFile(input)).toString('base64'));
await writeFile('public/images/navigation/squirrel-gait-v2.webp',Buffer.from(result.data,'base64'));
console.log(JSON.stringify({bounds:result.bounds,bytes:Buffer.from(result.data,'base64').length}));
await browser.close();
