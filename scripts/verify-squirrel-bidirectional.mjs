import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir,writeFile } from 'node:fs/promises';
const base=process.argv[2]||'http://127.0.0.1:4231';
const output='artifacts/squirrel-bidirectional';
await mkdir(output,{recursive:true});
const browser=await chromium.launch(), reports=[], errors=[];
try {
 for(const width of [360,768,1100,1101,1440,2560]) {
  const page=await browser.newPage({viewport:{width,height:950}});
  page.on('pageerror',e=>errors.push(e.message));
  const time=new Date('2026-10-12T06:00:00Z');
  await page.clock.install({time});await page.clock.pauseAt(time);
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('.featured-branch').evaluate(i=>i.decode());
  const squirrel=page.locator('.featured-squirrel');
  const read=()=>squirrel.evaluate(c=>({...c.dataset,pixels:c.getContext('2d').getImageData(0,0,128,128).data.filter((v,i)=>i%4===3&&v>0).length}));
  const states=new Set(),directions=new Set(),gait=new Set(),frames=[];
  let previous=await read(),completed=0;
  for(let step=0;step<460 && completed<2;step++) {
   await page.clock.runFor(80);
   const sample=await read(); states.add(sample.state);
   if(sample.state==='approaching') {
    assert.ok(Math.abs(+sample.y-sample.surfaceY)<.01,'Paws follow branch');
    gait.add(sample.frame);
   }
   if(sample.state==='enteringHouse') {
    directions.add(sample.direction);
    if(width===1440||width===360) {
     if(step%3===0) {
      const nav=await page.locator('.featured-inner').boundingBox();
      const clip={x:Math.max(0,nav.x+ +sample.doorX-100),y:Math.max(0,nav.y+ +sample.doorY-80),width:200,height:140};
      const png=await page.screenshot({clip});frames.push({label:`${sample.direction==='1'?'Left':'Right'} entry / ${sample.pixels}px`,png:png.toString('base64')});
     }
    }
   }
   if(sample.state==='inside') {
    assert.equal(sample.pixels,0,'Completely hidden inside');
    if(previous.state!=='inside')completed++;
   }
   if(previous.state!=='inside'&&sample.state!=='inside') {
    assert.ok(Math.abs(+sample.x-previous.x)<35,`No visible teleport: ${width} ${previous.state} -> ${sample.state}`);
   }
   previous=sample;
  }
  assert.equal(completed,2,'Both automatic runs complete');
  assert.deepEqual([...directions].sort(),['-1','1']);
  assert.ok(states.has('climbing'));
  assert.ok(gait.size>=4,'Distinct leg/tail poses');
  assert.equal(await squirrel.evaluate(c=>getComputedStyle(c).pointerEvents),'none');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  // Manual navigation remains immediate, even while emerging from the house.
  if(width<768)await page.locator('.featured-menu').click();
  await page.locator('[data-nav-id="contact"]:visible').click();
  assert.equal(new URL(page.url()).pathname,'/contact');
  await page.clock.runFor(2200);
  assert.equal((await read()).state,'standing');
  await page.locator('.featured-monkey').click();
  await page.clock.runFor(320);
  const before=await read();
  await page.locator('.featured-monkey').click();
  assert.equal((await read()).x,before.x,'Repeat does not restart');
  await page.clock.runFor(4500);
  assert.equal((await read()).state,'inside');
  // Resize between distinct desktop/mobile artwork during a trip.
  if(width<768)await page.locator('.featured-menu').click();
  await page.locator('[data-nav-id="home"]:visible').click();
  await page.clock.runFor(300);
  await page.setViewportSize({width:width<768?1440:390,height:950});
  await page.clock.runFor(2300);
  assert.equal((await read()).state,'standing');
  assert.ok(Number.isFinite(+(await read()).x));
  await page.locator('.featured-monkey').click();
  await page.clock.runFor(200);
  await page.emulateMedia({reducedMotion:'reduce'});await page.clock.runFor(50);
  assert.equal((await read()).state,'inside');assert.equal((await read()).pixels,0);
  reports.push({width,completed,directions:[...directions],gait:[...gait]});
  if(frames.length) {
   const sheet=await browser.newPage({viewport:{width:800,height:900}});
   await sheet.setContent(`<body style="margin:0;display:grid;grid-template-columns:repeat(4,200px);font:12px sans-serif">${frames.map(f=>`<div>${f.label}<img width="200" src="data:image/png;base64,${f.png}"></div>`).join('')}</body>`);
   await sheet.screenshot({path:`${output}/${width}-entries.png`,fullPage:true});await sheet.close();
  }
  await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:900},reducedMotion:'reduce'});
 await reduced.goto(base,{waitUntil:'networkidle'});
 assert.equal(await reduced.locator('.featured-squirrel').getAttribute('data-state'),'idle');
 await reduced.locator('.featured-menu').click();
 await reduced.locator('[data-nav-id="academics"]:visible').click();
 assert.equal(new URL(reduced.url()).pathname,'/academics');
 assert.equal(await reduced.locator('.featured-squirrel').getAttribute('data-state'),'standing');
 await reduced.close();
 assert.deepEqual(errors,[]);
 await writeFile(`${output}/report.json`,JSON.stringify({reports,errors},null,2));
 console.log('PASS: left and right entry, four gait poses, hidden completion, branch contact, continuity, immediate navigation, responsive resize, reduced motion and no overflow at six widths.');
}finally{await browser.close();}
