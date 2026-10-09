import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[],backendFallbacks=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error'){
  if(m.text().startsWith('Failed to fetch events from backend. Using fallback.'))backendFallbacks.push(m.text());
  else errors.push(m.text());
}});
const base=process.argv[2]||'http://127.0.0.1:5173';
await page.goto(`${base}/about`);
await page.waitForSelector('.bn-squirrel[data-x]');
const settle=async id=>{
  await page.waitForFunction(id=>{
    const squirrel=document.querySelector('.bn-squirrel'), sign=document.querySelector(`[data-nav-id="${id}"]`);
    if(!squirrel||!sign)return false;
    const box=document.querySelector('.bn-main-nav').getBoundingClientRect(),r=sign.getBoundingClientRect();
    return squirrel.dataset.phase==='idle'&&Math.abs(Number(squirrel.dataset.x)-(r.left+r.width/2-box.left))<1;
  },id,{timeout:6000});
};
await settle('about');
await page.screenshot({path:'artifacts/nav-desktop.png'});
const monkeyTransform=await page.locator('.bn-monkey-art').getAttribute('transform');
for(const id of ['admissions','academics','campus','events','contact','apply']){
  await page.locator(`[data-nav-id="${id}"]`).click();
  if(id==='admissions'){
    await page.waitForTimeout(180);
    await page.screenshot({path:'artifacts/nav-run.png'});
    const a=await page.locator('.sq-run-back').last().evaluate(el=>getComputedStyle(el).transform);
    await page.waitForTimeout(100);
    const b=await page.locator('.sq-run-back').last().evaluate(el=>getComputedStyle(el).transform);
    assert.notEqual(a,b,'Legs must articulate during travel');
  }
  await settle(id);
  assert.equal(await page.locator('.bn-monkey-art').getAttribute('transform'),monkeyTransform,'Travel must not reposition the monkey');
  assert.equal(new URL(page.url()).pathname,id==='apply'?'/admissions':`/${id}`);
  assert.equal(await page.locator('.bn-scene .bn-active').count(),1);
  console.log(`PASS route + landing + unique highlight: ${id}`);
}
await page.locator('[data-nav-id="about"]').click();
await page.waitForTimeout(100);
await page.locator('[data-nav-id="events"]').click();
await settle('events');
console.log('PASS interrupted travel lands at latest target');
await page.locator('[data-nav-id="about"]').click();
const pathErrors=await page.evaluate(()=>new Promise(resolve=>{
  const errors=[];
  function sample(){
    const s=document.querySelector('.bn-squirrel'),p=document.querySelector('[data-branch-path]');
    let lo=0,hi=p.getTotalLength();
    for(let i=0;i<20;i++){const m=(lo+hi)/2;if(p.getPointAtLength(m).x<Number(s.dataset.x))lo=m;else hi=m;}
    errors.push(Math.abs(p.getPointAtLength((lo+hi)/2).y-12-Number(s.dataset.y)));
    if(errors.length<30)requestAnimationFrame(sample);else resolve(errors);
  }requestAnimationFrame(sample);
}));
assert.ok(Math.max(...pathErrors)<.1,'Travel anchor follows branch within 0.1px');
await page.locator('[data-nav-id="events"]').click();
await settle('events');
console.log('PASS continuous branch alignment and stationary monkey');
for(const width of [1024,768,390,320]){
  await page.setViewportSize({width,height:850});
  if(width>=768)await settle('events');
  else {
    await settle(width===390?'menu':'apply');
    await page.locator('.bn-menu-trigger').click();
    await page.locator('#mobile-link-chain a').filter({hasText:'Contact'}).click();
    await page.locator('[data-nav-id="apply"]').click();
    await settle('apply');
  }
  assert.equal(await page.locator('.bn-squirrel').count(),1);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  assert.equal(overflow,false,`Overflow at ${width}`);
  await page.screenshot({path:`artifacts/nav-${width}.png`});
  console.log(`PASS responsive ${width}`);
}
await page.emulateMedia({reducedMotion:'reduce'});
await page.setViewportSize({width:1440,height:900});
await page.locator('[data-nav-id="about"]').click();
await settle('about');
assert.equal(await page.locator('.sq-tail').evaluate(el=>getComputedStyle(el).animationName),'none');
console.log('PASS reduced motion',JSON.stringify(errors));
console.log('Events backend fallback messages (not navigation failures):',backendFallbacks.length);
assert.deepEqual(errors,[]);
await browser.close();
