import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
const server=await createServer({server:{port:4257}});await server.listen();
const browser=await chromium.launch();
try {
  for(const width of [390,1440]) {
    const page=await browser.newPage({viewport:{width,height:900}});
    await page.clock.install();await page.goto('http://localhost:4257');
    await page.locator('.featured-branch').evaluate(e=>e.decode());
    await page.evaluate(async()=>{const i=new Image();i.src='/images/navigation/squirrel-entry-poses.webp';await i.decode();});
    await page.clock.runFor(100);
    const read=()=>page.locator('.featured-squirrel').evaluate(e=>{
      const d={...e.dataset},r=e.getBoundingClientRect(),n=e.parentElement.getBoundingClientRect();
      const pixels=e.getContext('2d').getImageData(0,0,128,128).data;
      let visible=false,outside=false,sumX=0,sumY=0,count=0;
      for(let y=0;y<128;y++)for(let x=0;x<128;x++)if(pixels[(y*128+x)*4+3]>70){
        visible=true;
        const wx=r.x-n.x+(x+.5)*r.width/128,wy=r.y-n.y+(y+.5)*r.height/128;
        const radius=+d.doorRadius,dx=wx-Number(d.doorX),dy=wy-Number(d.doorY);
        sumX+=dx;sumY+=dy;count++;
        const side=d.state==='exitingHouse'?-Number(d.direction):Number(d.direction);
        const t=Math.max(0,Math.min(1,(Number(d.entryProgress)-.18)/.64));
        const insertion=t*t*(3-2*t),boundary=side*(Number(d.bodySize)*.8*(1-insertion)-radius*insertion);
        const exterior=d.peeking!=='true'&&(side===1?dx<boundary+1:dx>boundary-1);
        if(!exterior&&Math.hypot(dx,dy)>radius+1)outside=true;
      }
      return {...d,visible,outside,tailDrift:count?Math.hypot(sumX/count,sumY/count)/Number(d.doorRadius):0};
    });
    let initial=await read();assert.equal(initial.state,'inside');assert.equal(initial.peeking,'true');assert.ok(initial.visible);assert.equal(initial.outside,false);
    for(let i=0;i<20;i++) {
      await page.clock.runFor(50);const d=await read();
      assert.equal(d.state,'inside','Startup stays inside without a side-leaf flash');
      assert.equal(d.outside,false);
    }
    for(const route of ['/academics','/campus']) {
      if(width<768)await page.locator('.featured-menu').click();
      await page.locator(`${width<768?'.featured-drawer':'.featured-signs'} a[href="${route}"]`).click();
      if(width<768) {
        await page.clock.runFor(5000);
        const indoor=await read();
        assert.equal(indoor.state,'inside','Mobile navigation keeps squirrel indoors');
        assert.equal(indoor.peeking,'true');assert.ok(indoor.visible);assert.equal(indoor.outside,false);
        await page.locator('.featured-logo').click();
        await page.clock.runFor(1000);
        assert.equal((await read()).state,'inside');
        continue;
      }
      let sawExit=false;
      for(let i=0;i<85;i++) {await page.clock.runFor(1000/30);const d=await read();if(d.state==='exitingHouse'){sawExit=true;assert.equal(d.outside,false,'Exit follows the actual opening');}
        if(['descending','boardMoving','standing'].includes(d.state))assert.ok(d.visible,'Outside squirrel stays visible in front of the scenery');
      }
      assert.ok(sawExit);assert.equal((await read()).state,'standing');
      const bounds=await page.locator('.featured-squirrel').evaluate(e=>({z:+getComputedStyle(e).zIndex,x:+e.dataset.x,doorX:+e.dataset.doorX,r:+e.dataset.doorRadius}));
      assert.ok(bounds.z>6,'Squirrel is above wall and branch fittings');
      assert.ok(Math.abs(bounds.x-bounds.doorX)<bounds.r*7,'Turnaround stays beside house rather than disappearing at distant signs');
      await page.locator('.featured-logo').click();
      let tail=false,entry=false,pause=false,peekRise=false,last=0;
      for(let i=0;i<230;i++) {
        await page.clock.runFor(1000/30);const d=await read();
        if(d.state==='enteringHouse') {entry=true;assert.equal(d.outside,false,'Portal masking follows insertion');assert.equal(+d.direction,route==='/academics'?1:-1,'Entry mirrors the side of approach');assert.ok(+d.entryProgress>=last);last=+d.entryProgress;if(last>.7&&d.visible)tail=true;
          if(last>.9&&d.visible) assert.ok(d.tailDrift<.5,'Last tail pixels recede at center, not opposite rim');
        }
        if(d.state==='inside'&&d.peeking==='false'){pause=true;assert.equal(d.visible,false);}
        if(d.state==='inside'&&d.peeking==='true'&&+d.peekProgress>0&&+d.peekProgress<1)peekRise=true;
      }
      assert.ok(entry&&tail&&pause&&peekRise,'Entry includes trailing tail, hidden pause and animated peek');
      const home=await read();assert.equal(home.state,'inside');assert.equal(home.peeking,'true');assert.ok(home.visible);assert.equal(home.outside,false);
    }
    if(width>=768) {
      await page.locator('.featured-signs a[href="/academics"]').click();
      await page.clock.runFor(300);
      await page.setViewportSize({width:390,height:900});
      await page.clock.runFor(300);
      assert.equal((await read()).state,'inside','Switching to mobile stops an active trip');
    }
    console.log(width,width<768?'mobile stays inside after navigation':'desktop portal animation and mobile resize passed');
    await page.close();
  }
} finally {await browser.close();await server.close();}
process.exit(0);
