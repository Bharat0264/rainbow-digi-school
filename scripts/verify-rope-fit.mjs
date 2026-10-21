import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { ropeSurface, ropeWrapFit } from '../src/components/layout/ropeGeometry.js';

// The lower anchor is fixed to the traced bark, even as the upper intersection leans.
for (const [x, expected] of [[189,304],[553,377],[1374,362],[1983,326]]) {
  const art={x:0,y:0,width:2172,height:430};
  const native=ropeSurface(x,art);
  assert.equal(native.under,expected);
  const scaled=ropeSurface(x*.5+30,{x:30,y:12,width:1086,height:215});
  assert.ok(Math.abs(scaled.top-(native.top*.5+12))<1e-8);
  assert.ok(Math.abs(scaled.under-(native.under*.5+12))<1e-8);
  assert.ok(Math.abs(scaled.angle-native.angle)<1e-8);
  const fit=ropeWrapFit(x,native.top,native.under,native.angle,5.5);
  assert.ok(fit.bodyHeight>native.under-native.top);
}
const server=await createServer({server:{port:4314,strictPort:true}});await server.listen();
const browser=await chromium.launch();const results=[];
try {
 await fs.mkdir('artifacts',{recursive:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2,reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://localhost:4314/');
 for (const width of [360,390,414,768,1024,1440,2172,1024]) {
  await page.setViewportSize({width,height:900});await page.locator('.featured-branch').evaluate(e=>e.decode());await page.waitForTimeout(250);
  const checks=await page.locator('[data-rope-front]').evaluateAll(nodes=>nodes.map(node=>{
   const {x,top,under,hole,thickness,wrapAngle,board}=node.dataset;
   const wrap=node.querySelector('[data-branch-wrap]'),group=wrap?.parentElement;
   if(!group)return {board,logo:true};
   const m=group.parentElement.getCTM().inverse().multiply(group.getCTM());
   const box={x:+wrap.getAttribute('x'),y:+wrap.getAttribute('y'),width:+wrap.getAttribute('width'),height:+wrap.getAttribute('height')};
   const bottom=new DOMPoint(box.x+box.width/2,box.y+box.height*920/940).matrixTransform(m);
   const crown=new DOMPoint(box.x+box.width/2,box.y).matrixTransform(m);
   return {board,x:+x,top:+top,under:+under,hole:+hole,thickness:+thickness,angle:+wrapAngle,axisX:m.c,axisY:m.d,bottom,crown,
    paths:[...node.querySelectorAll(':scope > path')].map(p=>p.getAttribute('d'))};
  }));
  assert.equal(checks.filter(c=>c.logo).length,2,'Keep both fixed house connectors');
  assert.equal(checks.filter(c=>!c.logo).length,width<768?0:12);
  const branchWraps = checks.filter(c=>!c.logo);
  if(branchWraps.length) for(const row of [branchWraps.slice(0,6),branchWraps.slice(6)]) {
    const gaps=row.slice(1).map((item,i)=>item.x-row[i].x);
    assert.ok(Math.max(...gaps)-Math.min(...gaps)<.04,'Wraps are evenly spaced along each side of the house');
  }
  assert.equal(await page.locator('[data-wrap-contact]').count(),branchWraps.length*2,'Separate contact shadows under both turns');
  assert.equal(await page.locator('[data-rope-overlap]').count(),branchWraps.length,'Lower turns overlap the straight strand');
  for(const c of branchWraps){
   assert.ok(Math.abs(c.bottom.x-c.x)<1/64,`Coil exit meets the vertical hanging strand: ${JSON.stringify({width,...c})}`);
   assert.ok(Math.abs(c.bottom.y-(c.under+c.thickness*.42))<1/64,'Lower turn hugs bark');
   assert.ok(Math.abs(c.crown.y-(c.top-c.thickness*.42))<1/64,'Upper turn hugs bark');
   assert.ok(Math.abs(c.axisX/c.axisY+Math.tan(c.angle*Math.PI/180))<1e-6,'Coil axis follows the branch normal, not a shear');
   assert.ok(c.under>c.top && c.hole>c.bottom.y);
   assert.ok(c.paths.every(d=>d.startsWith(`M ${c.x} `)&&d.endsWith(`V ${c.hole}`)),'Drops remain vertical into board eyelets');
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);
  if([390,1440,2172].includes(width))await page.locator('.featured-nav').screenshot({path:`artifacts/rope-fit-${width}.png`});
  results.push({width,branchWraps:checks.filter(c=>!c.logo).length,passed:true});console.log(width,'rope fit passed');
 }
 await fs.writeFile('artifacts/rope-fit-qa.json',JSON.stringify(results,null,2));
}finally{await browser.close();await server.close();}
