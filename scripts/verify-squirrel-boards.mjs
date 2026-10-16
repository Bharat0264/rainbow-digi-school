import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://127.0.0.1:4215';
const output = 'artifacts/squirrel-branch-rests';
const links = [['home','/'],['academics','/academics'],['admissions','/admissions'],['campus','/campus'],['school-life','/school-life'],['contact','/contact']];
await mkdir(output,{recursive:true});
const browser = await chromium.launch(), reports = [], errors = [];
try {
  for (const width of [360,390,430,768,1100,1101,1440,2560]) {
    for (const reducedMotion of ['no-preference','reduce']) {
      const page = await browser.newPage({viewport:{width,height:950},reducedMotion});
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base+'/privacy-policy',{waitUntil:'networkidle'});
      const now = new Date('2026-10-11T14:00:00Z');
      await page.clock.install({time:now}); await page.clock.pauseAt(now);
      const read = () => page.locator('.featured-squirrel').evaluate(c=>({...c.dataset,
        pixels:c.getContext('2d').getImageData(0,0,128,128).data.filter((_,i)=>i%4===3).filter(v=>v>0).length}));
      async function click(id) {
        if (await page.locator('.featured-menu').isVisible() && await page.locator('.featured-menu').getAttribute('aria-expanded') === 'false') await page.locator('.featured-menu').click();
        const board = page.locator(`[data-nav-id="${id}"]:visible`);
        const expectedX = await board.evaluate(el=>{const r=el.getBoundingClientRect(),n=el.closest('nav').getBoundingClientRect();return r.left-n.left+r.width/2;});
        await board.focus(); await page.keyboard.press('Enter'); return expectedX;
      }
      const destinations=[];
      for (const [id,path] of links) {
        const previous = await read(), beforeURL = page.url();
        const expectedX = await click(id);
        if (reducedMotion === 'no-preference') {
          const start=await read();
          assert.equal(page.url(),beforeURL);
          assert.ok(Math.abs(+start.x-previous.x)<.01,'No teleport on tab click');
          assert.ok(Math.abs(+start.y-previous.y)<.01);
          await page.clock.runFor(400);
          const moving=await read();
          assert.equal(moving.state,'boardMoving');
          assert.ok(Math.abs(+moving.y-moving.surfaceY)<.01,'Walk stays on bark');
          await page.clock.runFor(700);
        }
        await page.waitForURL(base+path); await page.clock.runFor(50);
        const resting=await read();
        assert.equal(resting.state,'standing'); assert.equal(resting.target,id);
        assert.ok(Math.abs(+resting.x-expectedX)<.5,`${width}/${id}: above exact board`);
        assert.ok(Math.abs(+resting.y-resting.surfaceY)<.01,'Paws on bark');
        assert.equal(resting.scale,'1'); assert.equal(resting.frame,'0'); assert.ok(resting.pixels>500,'Fully visible standing sprite');
        destinations.push(resting.x);
        await page.clock.runFor(3000);
        assert.deepEqual(await read(),resting,'Standing pose persists after routing');
        if ([360,1440].includes(width) && reducedMotion==='no-preference') await page.locator('.featured-nav').screenshot({path:`${output}/${width}-${id}.png`});
        reports.push({width,reducedMotion,id,path,resting});
      }
      if (width>=768) assert.equal(new Set(destinations).size,6,'Six separately measured desktop destinations');
      if (reducedMotion==='no-preference') {
        await click('home'); await page.clock.runFor(250);
        await page.setViewportSize({width:width+10,height:950}); await page.clock.runFor(100);
        const inFlight=await read();
        assert.equal(inFlight.target,'home'); assert.ok(Math.abs(+inFlight.y-inFlight.surfaceY)<.01,'Resize during movement stays on branch');
        await page.clock.runFor(1000); await page.waitForURL(base+'/');
        await page.setViewportSize({width,height:950}); await page.clock.runFor(100);
      }
      // Latest click wins without teleporting or allowing an old route callback.
      await click('home'); await page.clock.runFor(250);
      const interrupted=await read(); await click('academics');
      if (reducedMotion==='no-preference') assert.ok(Math.abs(+(await read()).x-interrupted.x)<.01);
      await page.clock.runFor(1200); await page.waitForURL(base+'/academics');
      await page.clock.runFor(2000); assert.equal((await read()).target,'academics');
      // Responsive resting anchor tracks live board or cached drawer projection.
      await page.setViewportSize({width:width+20,height:950}); await page.clock.runFor(100);
      let resized=await read(); assert.equal(resized.state,'standing'); assert.ok(Math.abs(+resized.y-resized.surfaceY)<.01);
      if (width>=768) {
        const expected=await page.locator('[data-nav-id="academics"]:visible').evaluate(el=>{const r=el.getBoundingClientRect(),n=el.closest('nav').getBoundingClientRect();return r.left-n.left+r.width/2;});
        assert.ok(Math.abs(+resized.x-expected)<.5);
      }
      await page.setViewportSize({width,height:950}); await page.clock.runFor(100);
      // Both house controls start at the current position; entry from both sides.
      for (const [id,control] of [['contact','.featured-monkey'],['home','.featured-logo']]) {
        await click(id); await page.clock.runFor(2000);
        const previous=await read(), previousURL=page.url();
        await page.locator(control).focus(); await page.keyboard.press('Enter');
        if (reducedMotion==='no-preference') {
          const start=await read(); assert.ok(Math.abs(+start.x-previous.x)<.01); assert.ok(Math.abs(+start.y-previous.y)<.01);
          await page.clock.runFor(1100); const entry=await read(); assert.equal(entry.state,'enteringHouse'); assert.ok(entry.pixels>0);
          if ([360,1440].includes(width)) await page.locator('.featured-nav').screenshot({path:`${output}/${width}-${id}-entry.png`});
          await page.clock.runFor(1000);
        }
        const inside=await read(); assert.equal(inside.state,'inside'); assert.equal(inside.pixels,0);
        if (control==='.featured-logo') await page.waitForURL(base+'/');
        else assert.equal(page.url(),previousURL,'Monkey does not navigate');
      }
      // A new tab after entry emerges from the opening, never the old rest point.
      await click('campus');
      if (reducedMotion==='no-preference') assert.equal((await read()).state,'exitingHouse');
      await page.clock.runFor(2100); await page.waitForURL(base+'/campus');
      assert.equal((await read()).state,'standing');
      if (reducedMotion==='no-preference') {
        await click('admissions'); await page.clock.runFor(250);
        await page.emulateMedia({reducedMotion:'reduce'}); await page.clock.runFor(50);
        await page.waitForURL(base+'/admissions');
        assert.equal((await read()).state,'standing','Live reduced-motion change settles to requested branch anchor');
        await page.emulateMedia({reducedMotion:'no-preference'});
        // Logo's pending Home callback is superseded by the monkey action.
        await page.locator('.featured-logo').click(); await page.clock.runFor(250);
        await page.locator('.featured-monkey').click(); await page.clock.runFor(2000);
        assert.equal((await read()).state,'inside');
        assert.equal(new URL(page.url()).pathname,'/admissions','No stale logo route after newer monkey action');
      }
      assert.equal(await page.locator('.featured-squirrel').count(),1);
      assert.equal(await page.locator('.featured-squirrel').evaluate(c=>getComputedStyle(c).pointerEvents),'none');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      await page.close();
    }
  }
  assert.deepEqual(errors,[]);
  await writeFile(`${output}/report.json`,JSON.stringify({reports,errors},null,2));
  console.log('PASS: 96 tab/rest/route cases; rapid retargeting, persistent visible poses, branch contact, resize, keyboard, both house controls, emergence and reduced motion across 8 widths.');
} finally { await browser.close(); }
