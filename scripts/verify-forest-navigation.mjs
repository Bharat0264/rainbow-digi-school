import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1535,height:950}});
const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()});});
await page.goto((process.argv[2]||'http://127.0.0.1:4189')+'/about');
await page.locator('.forest-monkey-image').evaluate(img=>img.decode());
const idle=(id)=>page.waitForFunction(id=>{
  const s=document.querySelector('.bn-squirrel'),sign=document.querySelector(`[data-nav-id="${id}"]`);
  if(!s||!sign)return false;
  const r=sign.getBoundingClientRect(),c=document.querySelector('.bn-main-nav').getBoundingClientRect();
  return s.dataset.state==='idle'&&Math.abs(Number(s.dataset.x)-(r.left+r.width/2-c.left))<1;
},id);
await idle('about');await page.waitForTimeout(400);
await page.screenshot({path:'artifacts/forest-desktop.png'});
assert.equal(await page.locator('.bn-monkey-art').count(),0);
assert.equal(await page.locator('.forest-mascot').count(),1);
assert.equal(await page.locator('.forest-logo-inset svg').count(),1);
const url=page.url();
await page.locator('.forest-mascot').click();
await page.waitForFunction(()=>document.querySelector('.bn-squirrel').dataset.state==='runningToTreehouse');
await page.waitForFunction(()=>document.querySelector('.bn-squirrel').dataset.state==='enteringTreehouse');
await page.waitForTimeout(160);
await page.screenshot({path:'artifacts/forest-entering.png'});
await page.waitForFunction(()=>document.querySelector('.bn-squirrel').dataset.state==='insideTreehouse');
assert.equal(page.url(),url);
console.log('PASS monkey activation: running → entering → inside; URL unchanged');
for(const id of ['admissions','academics','campus','events','contact','apply']){
  await page.locator(`[data-nav-id="${id}"]`).click();
  await idle(id);
  assert.equal(new URL(page.url()).pathname,id==='apply'?'/admissions':`/${id}`);
  const error=await page.evaluate(id=>{const s=document.querySelector('.bn-squirrel'),r=document.querySelector(`[data-nav-id="${id}"]`).getBoundingClientRect(),c=document.querySelector('.bn-main-nav').getBoundingClientRect();return Math.abs(Number(s.dataset.x)-(r.left+r.width/2-c.left));},id);
  assert.ok(error<1,`${id} landing ${error}`);
  console.log('PASS navigation and landing:',id);
}
await page.locator('.forest-mascot').focus();await page.keyboard.press('Enter');
await page.waitForTimeout(150);await page.locator('[data-nav-id="about"]').click();await idle('about');
assert.equal(new URL(page.url()).pathname,'/about');
console.log('PASS keyboard activation and interrupted treehouse journey');
for(const width of [1024,768,390,320]){
  await page.setViewportSize({width,height:900});await page.waitForTimeout(1600);
  if(width<768){await page.locator('.bn-menu-trigger').click();await page.locator('#mobile-link-chain a').filter({hasText:'Contact'}).click();await idle('menu');}
  await page.screenshot({path:`artifacts/forest-${width}.png`});
  const layout=await page.evaluate(()=>{
    const m=document.querySelector('.forest-mascot').getBoundingClientRect(),h=document.querySelector('.bn-header').getBoundingClientRect();
    return{overflow:document.querySelector('.bn-main-nav').scrollWidth>innerWidth,pageOverflow:document.documentElement.scrollWidth>innerWidth,centerError:Math.abs(m.left+m.width/2-innerWidth/2),contained:m.bottom<=h.bottom};
  });
  assert.equal(layout.overflow,false);assert.ok(layout.centerError<1);assert.ok(layout.contained);
  console.log('PASS responsive',width,layout);
}
await page.emulateMedia({reducedMotion:'reduce'});
await page.locator('.forest-mascot').focus();await page.keyboard.press('Space');
await page.waitForFunction(()=>document.querySelector('.bn-squirrel').dataset.state==='insideTreehouse');
assert.equal(await page.locator('.squirrel-sprite').evaluate(el=>getComputedStyle(el).animationName),'none');
assert.deepEqual(errors,[]);
assert.deepEqual(failed.filter(r=>!r.url.endsWith('/api/events')),[]);
console.log('PASS reduced motion; page errors:',errors,'external failures:',failed);
await browser.close();
