import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const server = await createServer({ server: { port: 4242 } });
await server.listen();
const browser = await chromium.launch();
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.clock.install();
    await page.goto('http://localhost:4242');
    await page.waitForFunction(() => document.querySelector('.featured-squirrel').dataset.story === 'true');
    const read = () => page.locator('.featured-squirrel').evaluate(e => {
      const pixels=e.getContext('2d').getImageData(0,0,128,128).data;
      const rect=e.getBoundingClientRect(), nav=e.parentElement.getBoundingClientRect();
      let visible=false, outside=false;
      for(let y=0;y<128;y++) for(let x=0;x<128;x++) if(pixels[(y*128+x)*4+3]>60) {
        visible=true;
        const dx=rect.x-nav.x+(x+.5)*rect.width/128-Number(e.dataset.doorX);
        const dy=rect.y-nav.y+(y+.5)*rect.height/128-Number(e.dataset.doorY);
        if(Math.hypot(dx,dy)>Number(e.dataset.doorRadius)+1) outside=true;
      }
      return {...e.dataset,visible,outside};
    });
    const states=new Set();
    let peek=false, tail=false;
    for(let i=0;i<190;i++) {
      await page.clock.runFor(1000/30);
      const d=await read();states.add(d.state);
      if(d.state==='approaching'||d.state==='idle') assert.ok(Math.abs(+d.y-+d.surfaceY)<.01,'Paws stay on traced bark');
      if(d.state==='inside') assert.equal(d.visible,false,'Fully hidden inside');
      if(d.state==='peeking') {assert.equal(d.outside,false,'Peek stays in actual doorway');peek ||=d.visible;}
      if(d.state==='enteringHouse'&&+d.entryProgress>.7) tail ||=d.visible;
    }
    for(const state of ['idle','approaching','climbing','enteringHouse','inside','peeking','exitingHouse','descending']) assert.ok(states.has(state),state);
    assert.ok(peek&&tail,'Peek and tail-last poses are visible');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.clock.runFor(150);
    assert.equal((await read()).visible,false);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    console.log(`${width}px: run, grounded paws, entry, tail, pause, circular peek, exit and reduced motion passed`);
    await page.close();
  }
} finally {await browser.close();await server.close();}
