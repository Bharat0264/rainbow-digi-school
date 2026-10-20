import assert from 'node:assert/strict';import {createServer} from 'vite';import {chromium} from 'playwright';import fs from 'node:fs/promises';
const server=await createServer({server:{port:4293}});await server.listen();const browser=await chromium.launch();const result=[];
try{for(const width of [1440,390])for(const dpr of [1,2,3]){
 const p=await browser.newPage({viewport:{width,height:width===1440?900:844},deviceScaleFactor:dpr});await p.goto('http://localhost:4293');
 await p.locator('.featured-branch').evaluate(e=>e.decode());await p.locator('.featured-bark').evaluate(e=>e.decode());await p.locator('.featured-assembly').evaluate(e=>e.decode());await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
 const aligned=await p.locator('.featured-bark').evaluate(e=>{const r=e.getBoundingClientRect(),o=document.querySelector('.featured-branch').getBoundingClientRect();return {dx:r.x-o.x,dy:r.y-o.y,dw:r.width-o.width,dh:r.height-o.height,transform:getComputedStyle(e).transform,src:e.currentSrc};});
 for(const k of ['dx','dy','dw','dh'])assert.ok(Math.abs(aligned[k])<.02,`${k} must match old frame`);assert.equal(aligned.transform,'none');
 const rects=await p.locator('.featured-inner').evaluate(e=>[...e.querySelectorAll('.featured-branch,.featured-assembly,.featured-sign,.featured-ropes [data-rope-front]')].map(n=>({class:n.className?.baseVal??n.className,rect:n.getBoundingClientRect().toJSON()})));
 await p.screenshot({path:`artifacts/bark-after-${width}-${dpr}.png`});result.push({width,dpr,rects});console.log(width,dpr,aligned);
 if(dpr===2){const file=aligned.src.split('/images/')[1];const bytes=(await fs.stat('public/images/'+file)).size+(await fs.stat(`public/images/navigation/bark/${width===390?'compact':'desktop'}-bark-matte.png`)).size;assert.ok(bytes<350*1024);}
 await p.close();}
 const before=await fs.readFile('artifacts/bark-before-geometry.json').then(JSON.parse).catch(e=>{if(e.code!=='ENOENT')throw e;return null;});if(before)assert.deepEqual(result,before,'All existing navbar anchors and boxes stay exactly unchanged');
 for(const format of ['avif','webp']){const bytes=(await fs.stat(`public/images/navigation/bark/desktop-bark-3600.${format}`)).size+(await fs.stat('public/images/navigation/bark/desktop-bark-matte.png')).size;assert.ok(bytes<350*1024,'Largest desktop 2x bark, including precision matte, stays under 350 KiB');}
 await fs.writeFile('artifacts/bark-after-geometry.json',JSON.stringify(result,null,2));console.log('Zero drift, no static scale, and 2x budget passed');
}finally{await browser.close();await server.close();}process.exit(0);
