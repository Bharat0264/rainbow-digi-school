import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
const base=process.argv[2] || 'http://127.0.0.1:4210';
await mkdir('artifacts/squirrel-cycle',{recursive:true});
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1536,height:850}});
const errors=[], apiFailures=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
page.on('response',r=>{if(r.status()>=400)apiFailures.push({url:r.url(),status:r.status()});});
await page.goto(base,{waitUntil:'networkidle'});
await page.locator('.featured-branch').evaluate(image=>image.decode());
await page.waitForTimeout(350);
await page.screenshot({path:'artifacts/squirrel-cycle/desktop.png'});
const sprite=page.locator('.featured-squirrel');
assert.equal(await sprite.count(),1);
const targets=[['home','/'],['academics','/academics'],['admissions','/admissions'],['campus','/campus'],['events','/events'],['contact','/contact'],['apply','/admissions']];
const outcomes=[];
await page.evaluate(()=>{window.gaitSamples=[];window.gaitSampler=setInterval(()=>{const c=document.querySelector('.featured-squirrel');window.gaitSamples.push({state:c.dataset.state,frame:c.dataset.frame,direction:c.dataset.direction,x:c.getBoundingClientRect().x});},25);});
for(const [id,path] of targets){
 await page.locator(`[data-nav-id="${id}"]`).click();
 await page.waitForFunction(()=>document.querySelector('.featured-squirrel').dataset.state==='idle');
 assert.equal(new URL(page.url()).pathname,path);
 const geometry=await page.evaluate(id=>{const s=document.querySelector('.featured-squirrel').getBoundingClientRect(),b=document.querySelector(`[data-nav-id="${id}"]`).getBoundingClientRect();return {error:Math.abs(s.x+s.width/2-b.x-b.width/2),y:s.y};},id);
 assert.ok(geometry.error<2,`${id} landing off by ${geometry.error}`);outcomes.push({id,...geometry});
}
const samples=await page.evaluate(()=>{clearInterval(window.gaitSampler);return window.gaitSamples;});
const frames=[...new Set(samples.filter(s=>['walking','running'].includes(s.state)).map(s=>s.frame))];
assert.ok(frames.length>=5,`Only ${frames.length} gait frames observed`);
assert.ok(samples.some(s=>s.state==='stopping'));
assert.ok(samples.some(s=>s.direction==='-1'));
// Capture the actual renderer at successive gait frames for visual review.
await page.evaluate(()=>{window.frameImages={};window.frameCapture=setInterval(()=>{const c=document.querySelector('.featured-squirrel');if(['walking','running'].includes(c.dataset.state))window.frameImages[c.dataset.frame]=c.toDataURL();},10);});
await page.locator('[data-nav-id="home"]').click();
await page.waitForFunction(()=>document.querySelector('.featured-squirrel').dataset.state==='idle');
const filmstrip=await page.evaluate(async()=>{
 clearInterval(window.frameCapture);
 const entries=Object.entries(window.frameImages).sort(([a],[b])=>Number(a)-Number(b));
 const sheet=document.createElement('canvas');sheet.width=entries.length*160;sheet.height=160;
 const ctx=sheet.getContext('2d');ctx.fillStyle='#f8f3e8';ctx.fillRect(0,0,sheet.width,sheet.height);
 for(let i=0;i<entries.length;i++){const image=new Image();image.src=entries[i][1];await image.decode();ctx.drawImage(image,i*160+16,0);ctx.fillStyle='#4d2c15';ctx.font='14px sans-serif';ctx.fillText(`Gait frame ${entries[i][0]}`,i*160+25,150);}
 return sheet.toDataURL().split(',')[1];
});
await writeFile('artifacts/squirrel-cycle/browser-gait-filmstrip.png',Buffer.from(filmstrip,'base64'));
await page.locator('[data-nav-id="apply"]').click();await page.waitForFunction(()=>document.querySelector('.featured-squirrel').dataset.state==='idle');
await page.locator('[data-nav-id="home"]').click();await page.waitForTimeout(100);
const before=await sprite.boundingBox();
await page.locator('[data-nav-id="contact"]').click();
const after=await sprite.boundingBox();assert.ok(Math.abs(before.x-after.x)<50,'Redirect teleported');
await page.waitForFunction(()=>document.querySelector('.featured-squirrel').dataset.state==='idle');
await page.locator('.featured-monkey').click();
await page.waitForFunction(()=>document.querySelector('.featured-squirrel').dataset.state==='enteringHouse');
assert.equal(await page.locator('.featured-house-front').count(),1);
await page.screenshot({path:'artifacts/squirrel-cycle/entering-house.png'});
await page.waitForFunction(()=>document.querySelector('.featured-squirrel').dataset.state==='inside');
await page.waitForTimeout(250);
const blank=await sprite.evaluate(c=>!c.getContext('2d').getImageData(0,0,128,128).data.some((v,i)=>i%4===3&&v));assert.ok(blank,'Squirrel remained outside');
await page.locator('.featured-monkey').click();assert.equal(await sprite.getAttribute('data-state'),'inside');
await page.locator('[data-nav-id="academics"]').click();await page.waitForFunction(()=>document.querySelector('.featured-squirrel').dataset.state==='idle');
await page.locator('.featured-logo').click();await page.waitForFunction(()=>document.querySelector('.featured-squirrel').dataset.state==='inside');
assert.equal(new URL(page.url()).pathname,'/');
const responsive=[];
for(const width of [360,768,1024,1440]){
 await page.setViewportSize({width,height:850});await page.waitForTimeout(120);
 if(width<=1250){await page.locator('.featured-menu').click();await page.screenshot({path:`artifacts/squirrel-cycle/menu-${width}.png`});await page.locator('.featured-drawer [data-nav-id="campus"]').click();}
 else await page.locator('[data-nav-id="campus"]').click();
 await page.waitForFunction(()=>document.querySelector('.featured-squirrel').dataset.state==='idle');
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);
 responsive.push({width,overflow});
}
await page.emulateMedia({reducedMotion:'reduce'});
await page.locator('[data-nav-id="home"]').click();assert.equal(await sprite.getAttribute('data-state'),'idle');
await page.locator('.featured-monkey').click();assert.equal(await sprite.getAttribute('data-state'),'inside');
await writeFile('artifacts/squirrel-cycle/report.json',JSON.stringify({base,frames,outcomes,responsive,errors,apiFailures},null,2));
console.log(JSON.stringify({frames,outcomes,responsive,errors,apiFailures},null,2));
await browser.close();
