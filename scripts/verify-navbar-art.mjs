import assert from 'node:assert/strict';
import {createServer} from 'vite';import {chromium} from 'playwright';import fs from 'node:fs/promises';
const server=await createServer({server:{port:4286}});await server.listen();const browser=await chromium.launch();
const results=[];
try {
 for(const [width,height,dpr] of [[1440,900,1],[1440,900,2],[390,844,3],[1895,900,2],[1895,900,3]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:dpr});
  const payloads=new Map();const pending=[];
  page.on('response',r=>{if(r.url().includes('/assets/nav/optimized/'))pending.push(r.body().then(body=>payloads.set(new URL(r.url()).pathname,body.length)));});
  await page.goto('http://localhost:4286');
  await page.locator('.featured-inner').evaluate(async n=>Promise.all([...n.querySelectorAll('img')].map(i=>i.decode())));
  await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(150);
  const images=await page.locator('.featured-inner img').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {src:new URL(e.currentSrc).pathname,width:r.width,height:r.height,x:r.x,y:r.y};}));
  for(const image of images.filter(i=>/desktop-|compact-|assembly/.test(i.src))){
   assert.ok(Math.abs(image.x-Math.round(image.x))<.01,'Static art starts on whole pixels');
   assert.ok(Math.abs(image.width-Math.round(image.width))<.01,'Static art has a whole-pixel width');
  }
  const canvas=await page.locator('.featured-squirrel').evaluate(e=>({pixels:e.width,css:e.getBoundingClientRect().width,state:e.dataset.state}));
  assert.ok(canvas.pixels>=canvas.css*dpr-.1);assert.equal(canvas.state,'inside');
  await page.screenshot({path:`artifacts/navbar-final-${width}-${dpr}.png`});
  await Promise.all(pending);
  const payloadBytes=[...payloads.values()].reduce((a,b)=>a+b,0);
  if(dpr===2)assert.ok(payloadBytes<900*1024,'2x artwork stays under 900 KiB, even without SVG transfer compression');
  const resourceTiming=await page.evaluate(()=>performance.getEntriesByType('resource').filter(e=>e.name.includes('/assets/nav/optimized/')).map(e=>({path:new URL(e.name).pathname,transfer:e.transferSize,encoded:e.encodedBodySize,decoded:e.decodedBodySize})));
  if(width===390){
   await page.locator('.featured-menu').click();await page.screenshot({path:'artifacts/navbar-final-mobile-drawer.png'});
   await page.addStyleTag({content:'.featured-nav {background:#181b24}'});await page.screenshot({path:'artifacts/navbar-final-dark-3x.png'});
  }
  results.push({width,height,dpr,payloadBytes,images,resourceTiming,payloads:Object.fromEntries(payloads)});
  console.log(`${width}px / ${dpr}x: ${Math.round(payloadBytes/1024)} KiB payload; ${Math.round(resourceTiming.reduce((a,r)=>a+r.transfer,0)/1024)} KiB transfer`);
  await page.close();
 }
 await fs.writeFile('artifacts/navbar-final-audit.json',JSON.stringify(results,null,2));
}finally{await browser.close();await server.close();}
process.exit(0);
