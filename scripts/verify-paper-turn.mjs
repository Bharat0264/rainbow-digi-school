import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const server=await createServer({server:{port:4322,strictPort:true}});await server.listen();
const browser=await chromium.launch(); const results=[];
const count=page=>page.locator('.gallery-page-controls p').innerText();
const wait=page=>page.waitForTimeout(1000);
try {
 await fs.mkdir('artifacts',{recursive:true});
 for(const width of [360,390,414,768,1024,1440]) {
  const context=await browser.newContext({viewport:{width,height:width<768?844:900},hasTouch:width<768});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:4322/school-life?album=campus#gallery');
  await page.locator('.paper-engine .stf__block').waitFor();await page.waitForTimeout(700);
  await page.keyboard.press('ArrowRight');await wait(page);
  assert.equal(await count(page),width<768?'Page 2 of 12':'Page 3 of 12');
  const expected=width<768?'--portrait':'--landscape'; assert.ok(await page.locator('.paper-engine .stf__wrapper').evaluate((e,s)=>e.classList.contains(s),expected));
  await page.keyboard.press('ArrowLeft');await wait(page);assert.equal(await count(page),'Page 1 of 12');
  // Normal flip remains in-flight at 300ms; fast repeat has a shorter finish.
  await page.waitForTimeout(1100);await page.keyboard.press('ArrowRight');await page.waitForTimeout(300);
  assert.equal(await page.locator('.paper-engine').getAttribute('data-state'),'flipping');
  if(width===390||width===1440)await page.screenshot({path:`artifacts/paper-bending-${width}.png`});
  await page.keyboard.press('ArrowRight');await page.waitForTimeout(650);assert.notEqual(await page.locator('.paper-engine').getAttribute('data-state'),'flipping');
  await page.keyboard.press('Home');assert.equal(await count(page),'Front cover');assert.ok(await page.getByRole('button',{name:'Previous page',exact:true}).isDisabled());
  await page.keyboard.press('ArrowLeft');await wait(page);assert.equal(await count(page),'Front cover');
  await page.keyboard.press('End');assert.equal(await count(page),'Back cover');assert.ok(await page.getByRole('button',{name:'Next page',exact:true}).isDisabled());
  await page.keyboard.press('ArrowRight');await wait(page);assert.equal(await count(page),'Back cover');
  await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');await wait(page);assert.equal(await count(page),'Page 1 of 12');
  const rect=await page.locator('.paper-engine .paper-leaf.--right:visible').last().boundingBox();
  // A slow partial drag returns to the same page; crossing the spine completes.
  const from={x:rect.x+rect.width-5,y:rect.y+rect.height-10};
  await page.mouse.move(from.x,from.y);await page.mouse.down();
  await page.mouse.move(from.x-rect.width*.45,from.y-25,{steps:15});await page.waitForTimeout(400);await page.mouse.up();await wait(page);assert.equal(await count(page),'Page 1 of 12');
  await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(from.x-rect.width*1.2,from.y-25,{steps:25});await page.waitForTimeout(350);await page.mouse.up();await wait(page);assert.equal(await count(page),width<768?'Page 2 of 12':'Page 3 of 12');
  // Native mobile input uses the same continuously tracked fold, without a touch delay.
  if(width===390){
   await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');await wait(page);
   const box=await page.locator('.paper-engine .paper-leaf.--right:visible').last().boundingBox();const session=await page.context().newCDPSession(page);
   const x=box.x+box.width*.92,y=box.y+box.height*.8;
   await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
   for(const d of [.15,.4,.8,1.1])await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-box.width*d,y:y-12}]});
   await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait(page);assert.equal(await count(page),'Page 2 of 12');await session.detach();
  }
  const layout=await page.locator('.gallery-viewer').evaluate(d=>({outer:d.scrollHeight<=d.clientHeight+1,book:d.querySelector('.gallery-mode-book').scrollHeight<=d.querySelector('.gallery-mode-book').clientHeight+1,horizontal:document.documentElement.scrollWidth<=innerWidth}));assert.deepEqual(layout,{outer:true,book:true,horizontal:true});
  const position=await page.locator('.paper-engine-slot').boundingBox();await page.keyboard.press('ArrowRight');await wait(page);const after=await page.locator('.paper-engine-slot').boundingBox();assert.deepEqual(after,position,'No layout shift during turn');
  assert.equal(await page.locator('.paper-turn-book img:not([alt])').count(),0);
  if(width===390||width===1440){await page.screenshot({path:`artifacts/paper-ready-${width}.png`});const axe=await new AxeBuilder({page}).include('.gallery-viewer').analyze();assert.deepEqual(axe.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);}
  await page.getByRole('button',{name:'Show grid view'}).click();assert.equal(await page.locator('.gallery-grid-photo').count(),12);
  await page.locator('.gallery-grid-photo').first().click();await page.getByRole('dialog',{name:'Album photo',exact:true}).waitFor();await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Show book view'}).click();await page.locator('.paper-engine').waitFor();
  assert.deepEqual(errors,[]);results.push({width,passed:'boundaries, normal/rapid flips, partial/completed drag, reverse, layout, grid and lightbox'});console.log(width,'paper-turn passed');await context.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await page.goto('http://localhost:4322/school-life?album=campus#gallery');await page.locator('.paper-crossfade-spread').waitFor();
 assert.equal(await page.locator('.paper-engine').count(),0);await page.keyboard.press('ArrowRight');await page.waitForTimeout(300);assert.equal(await count(page),'Page 2 of 12');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('.paper-engine').waitFor();await page.waitForTimeout(300);assert.equal(await count(page),'Page 2 of 12');
 await page.setViewportSize({width:1024,height:768});await page.waitForTimeout(400);assert.ok(await page.locator('.stf__wrapper').evaluate(e=>e.classList.contains('--landscape')));
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('.paper-crossfade-spread').waitFor();assert.equal(await page.locator('.paper-crossfade-spread .paper-leaf').count(),2);
 await fs.writeFile('artifacts/paper-turn-qa.json',JSON.stringify(results,null,2));console.log('Live resize and reduced-motion crossfade passed');await page.close();
}finally{await browser.close();await server.close();}
