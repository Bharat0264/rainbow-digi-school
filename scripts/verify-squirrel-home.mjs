import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const base=process.argv[2]||'http://127.0.0.1:4231';
const output='artifacts/squirrel-home';
await mkdir(output,{recursive:true});
const browser=await chromium.launch();
const errors=[],reports=[];
try {
 for(const width of [320,390,430,768,1100,1101,1440]) for(const reducedMotion of ([390,1440].includes(width)?['no-preference','reduce']:['no-preference'])) {
  const page=await browser.newPage({viewport:{width,height:950},reducedMotion});
  page.on('pageerror',e=>errors.push(e.message));
  const time=new Date('2026-10-12T06:00:00Z');
  await page.clock.install({time});await page.clock.pauseAt(time);
  await page.goto(base,{waitUntil:'networkidle'});
  const read=()=>page.locator('.featured-squirrel').evaluate(c=>({...c.dataset,pixels:c.getContext('2d').getImageData(0,0,128,128).data.some((v,i)=>i%4===3&&v)}));
  const hidden=async()=>{assert.equal((await read()).state,'inside');assert.equal((await read()).pixels,false);assert.equal(await page.locator('.featured-squirrel').count(),1);};
  const samples=[];
  async function finish(state) {
   for(let elapsed=0;elapsed<10000;elapsed+=100) {
    const pose=await read();samples.push(pose);
    if(pose.state===state)return pose;
    await page.clock.runFor(100);
   }
   assert.fail(`Never reached ${state}: ${JSON.stringify(await read())}`);
  }
  await hidden();await page.clock.runFor(30000);await hidden();
  await page.locator('.featured-nav').screenshot({path:`${output}/initial-${width}-${reducedMotion}.png`});
  const homeHeading=await page.locator('h1').innerText();
  async function tab(id,path) {
   if(width<1101)await page.locator('.featured-menu').click();
   const link=page.locator(`[data-nav-id="${id}"]:visible`);
   const x=await link.evaluate(el=>{const b=el.getBoundingClientRect(),n=el.closest('nav').getBoundingClientRect();return b.x-n.x+b.width/2;});
   await link.click();assert.equal(new URL(page.url()).pathname,path);
   const pose=await finish('standing');assert.equal(pose.target,id);assert.ok(pose.pixels);assert.ok(Math.abs(+pose.x-x)<.5);assert.ok(Math.abs(+pose.y-pose.surfaceY)<.01);
   await page.waitForFunction(id=>document.querySelector('[data-nav-id='+id+']')?.getAttribute('aria-current')==='page',id);
   assert.equal(await page.locator(`[data-nav-id="${id}"]`).first().getAttribute('aria-current'),'page');
   return pose;
  }
  const targets=[];
  for(const [id,path] of [['home','/'],['academics','/academics'],['admissions','/admissions'],['campus','/campus'],['school-life','/school-life'],['contact','/contact']])targets.push(await tab(id,path));
  if(width>1100)assert.equal(new Set(targets.map(p=>Math.round(+p.x))).size,6,'Each desktop tab has its own destination');
  const historyBefore=await page.evaluate(()=>history.state.idx);
  await page.locator('.featured-monkey').click();
  // No animation-clock advancement: route, active tab and content must update now.
  assert.equal(new URL(page.url()).pathname,'/');
  await page.locator('[data-nav-id="home"][aria-current="page"]').first().waitFor({state:'attached',timeout:1000});
  assert.equal(await page.locator('[data-nav-id="home"]').first().getAttribute('aria-current'),'page');
  assert.equal(await page.locator('h1').innerText(),homeHeading);
  assert.equal(await page.evaluate(()=>history.state.idx),historyBefore+1,'One navigation per monkey click');
  if(reducedMotion==='no-preference') {
   assert.notEqual((await read()).state,'inside','Navigation precedes animation completion');
  }
  await finish('inside');await hidden();
  assert.equal(await page.evaluate(()=>history.state.idx),historyBefore+1,'Entry cannot navigate a second time');
  assert.equal(new URL(page.url()).pathname,'/');
  assert.equal(await page.locator('[data-nav-id="home"]').first().getAttribute('aria-current'),'page');
  assert.equal(await page.locator('h1').innerText(),homeHeading);
  await tab('admissions','/admissions');
  await page.locator('.featured-logo').click();assert.equal(new URL(page.url()).pathname,'/');
  await finish('inside');await hidden();
  assert.equal(await page.locator('h1').innerText(),homeHeading);
  // Superseding navigation must never be overwritten by a stale Home action.
  await tab('contact','/contact');await page.locator('.featured-monkey').click();
  await tab('academics','/academics');await page.clock.runFor(6000);
  assert.equal(new URL(page.url()).pathname,'/academics');
  // Reverse an exit and then interrupt its entry before choosing another tab.
  await page.locator('.featured-monkey').click();await finish('inside');
  async function quickTab(id) {
   if(width<1101)await page.locator('.featured-menu').click();
   await page.locator(`[data-nav-id="${id}"]:visible`).click();
  }
  await quickTab('academics');await page.clock.runFor(320);
  await page.locator('.featured-monkey').click();assert.equal(new URL(page.url()).pathname,'/');
  await page.clock.runFor(160);await quickTab('contact');await page.clock.runFor(120);
  await quickTab('admissions');await finish('standing');
  assert.equal((await read()).target,'admissions');await page.clock.runFor(6000);
  assert.equal(new URL(page.url()).pathname,'/admissions');
  await page.locator('.featured-monkey').focus();await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).pathname,'/');
  await page.clock.runFor(200);await page.locator('.featured-monkey').click();
  await finish('inside');await hidden();
  await page.reload({waitUntil:'networkidle'});await hidden();await page.clock.runFor(30000);await hidden();
  await page.locator('.featured-monkey').click();assert.equal(new URL(page.url()).pathname,'/');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  if(reducedMotion==='no-preference') {
   assert.ok(samples.some(p=>p.state==='exitingHouse'&&p.pixels),'Visible exit frames');
   assert.ok(samples.some(p=>p.state==='enteringHouse'&&p.pixels),'Visible entry frames');
   assert.ok(new Set(samples.filter(p=>p.state==='boardMoving').map(p=>p.frame)).size>=3,'Articulated gait frames');
  }
  reports.push({width,reducedMotion,targets,samples});
  console.log(`PASS ${width}px / ${reducedMotion}: initial + refresh hidden, six tab targets, immediate monkey Home/content/highlight, single navigation, logo, reversed/repeated clicks, keyboard, overflow.`);
  await page.close();
 }
 assert.deepEqual(errors,[]);
 await writeFile(`${output}/report.json`,JSON.stringify({errors,reports},null,2));
}finally{await browser.close();}
