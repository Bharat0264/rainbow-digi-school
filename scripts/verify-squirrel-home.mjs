import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const browser=await chromium.launch();
const errors=[];
try {
 for(const width of [390,1440]) for(const reducedMotion of ['no-preference','reduce']) {
  const page=await browser.newPage({viewport:{width,height:950},reducedMotion});
  page.on('pageerror',e=>errors.push(e.message));
  const time=new Date('2026-10-12T06:00:00Z');
  await page.clock.install({time});await page.clock.pauseAt(time);
  await page.goto('http://127.0.0.1:4231',{waitUntil:'networkidle'});
  const read=()=>page.locator('.featured-squirrel').evaluate(c=>({...c.dataset,pixels:c.getContext('2d').getImageData(0,0,128,128).data.some((v,i)=>i%4===3&&v)}));
  const hidden=async()=>{assert.equal((await read()).state,'inside');assert.equal((await read()).pixels,false);assert.equal(await page.locator('.featured-squirrel').count(),1);};
  await hidden();await page.clock.runFor(30000);await hidden();
  const homeHeading=await page.locator('h1').innerText();
  async function tab(id,path) {
   if(width<1101)await page.locator('.featured-menu').click();
   const link=page.locator(`[data-nav-id="${id}"]:visible`);
   const x=await link.evaluate(el=>{const b=el.getBoundingClientRect(),n=el.closest('nav').getBoundingClientRect();return b.x-n.x+b.width/2;});
   await link.click();assert.equal(new URL(page.url()).pathname,path);
   if(reducedMotion==='no-preference')assert.ok(['exitingHouse','boardMoving'].includes((await read()).state));
   await page.clock.runFor(2200);
   const pose=await read();assert.equal(pose.state,'standing');assert.equal(pose.target,id);assert.ok(pose.pixels);assert.ok(Math.abs(+pose.x-x)<.5);assert.ok(Math.abs(+pose.y-pose.surfaceY)<.01);
   await page.waitForFunction(id=>document.querySelector('[data-nav-id='+id+']')?.getAttribute('aria-current')==='page',id);
   assert.equal(await page.locator(`[data-nav-id="${id}"]`).first().getAttribute('aria-current'),'page');
  }
  for(const [id,path] of [['academics','/academics'],['admissions','/admissions'],['contact','/contact']])await tab(id,path);
  await page.locator('.featured-monkey').click();
  if(reducedMotion==='no-preference') {
   assert.equal(new URL(page.url()).pathname,'/contact');
   await page.clock.runFor(200);assert.notEqual((await read()).state,'standing');
   await page.locator('.featured-monkey').click();
  }
  await page.clock.runFor(6000);await hidden();
  assert.equal(new URL(page.url()).pathname,'/');
  assert.equal(await page.locator('[data-nav-id="home"]').first().getAttribute('aria-current'),'page');
  assert.equal(await page.locator('h1').innerText(),homeHeading);
  await tab('admissions','/admissions');
  await page.locator('.featured-logo').click();assert.equal(new URL(page.url()).pathname,'/');
  await page.clock.runFor(6000);await hidden();
  assert.equal(await page.locator('h1').innerText(),homeHeading);
  // Superseding navigation must cancel the monkey's deferred Home action.
  await tab('contact','/contact');await page.locator('.featured-monkey').click();
  await tab('academics','/academics');await page.clock.runFor(6000);
  assert.equal(new URL(page.url()).pathname,'/academics');
  await page.reload({waitUntil:'networkidle'});await hidden();await page.clock.runFor(30000);await hidden();
  await page.locator('.featured-monkey').click();assert.equal(new URL(page.url()).pathname,'/');
  console.log(`PASS ${width}px / ${reducedMotion}: initial + refresh hidden, three branch targets, monkey completion/Home content/highlight, logo, superseding navigation, already-inside Home.`);
  await page.close();
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
