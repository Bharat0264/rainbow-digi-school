import {createServer} from 'vite';import {chromium} from 'playwright';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
await fs.mkdir('artifacts',{recursive:true});await fs.writeFile('artifacts/gallery-harness.html',`<div id="root"></div><script type="module">import React from '/node_modules/.vite/deps/react.js';import ReactDOM from'/node_modules/.vite/deps/react-dom_client.js';import Gallery from'/src/components/gallery/Gallery.jsx';import{galleryPhotos}from'/src/data/gallery.js';import'/src/index.css';ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Gallery,{photos:[...galleryPhotos,...galleryPhotos.map(p=>({...p,id:p.id+'-extra'}))]}));</script>`);
const server=await createServer({server:{port:4301}});await server.listen();const browser=await chromium.launch();const results=[];
try{
 for(const width of [360,390,414,768,1024,1440]){
  const page=await browser.newPage({viewport:{width,height:900},hasTouch:width<768});const errors=[];page.on('pageerror',e=>errors.push(e.message));const images=new Map();
  page.on('response',r=>{if(r.request().resourceType()==='image'&&(/placeholder|gallery/.test(r.url())))images.set(r.url(),r);});
  await page.goto('http://localhost:4301/school-life#gallery');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(700);
  const gallery=page.locator('#gallery');const thumbs=gallery.getByRole('button',{name:/^Open photo/});await thumbs.first().waitFor();assert.equal(await thumbs.count(),12);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No horizontal scroll');
  const columns=await gallery.locator('ul').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);assert.equal(columns,width<640?2:width<1024?3:4);
  for(const category of ['Events','Classrooms','Sports','Celebrations','Campus','All']){
   const chip=gallery.getByRole('button',{name:category,exact:true});assert.ok((await chip.boundingBox()).height>=44);await chip.focus();await page.keyboard.press('Enter');
   assert.equal(await chip.getAttribute('aria-pressed'),'true');assert.equal(await thumbs.count(),category==='All'?12:category==='Campus'?1:category==='Events'?4:category==='Celebrations'?7:0);await page.waitForTimeout(220);
  }
  await gallery.locator('img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
  let initialPayload=0;for(const r of images.values())initialPayload+=(await r.body()).length;assert.ok(initialPayload<500*1024);assert.ok(![...images.keys()].some(url=>/-full[.-]/.test(url)),'Full image stays deferred');
  if(width===390||width===1440){await gallery.scrollIntoViewIfNeeded();await page.waitForTimeout(250);await gallery.screenshot({path:`artifacts/gallery-${width}.png`});}
  const opener=thumbs.nth(2);await opener.click();const dialog=page.getByRole('dialog',{name:'Photo gallery'});await dialog.waitFor({state:'visible'});
  const counter=()=>dialog.locator('[aria-live="polite"][aria-atomic="true"]').innerText();assert.equal(await counter(),'3 / 12');
  const close=dialog.getByRole('button',{name:'Close gallery'});assert.equal(await close.evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Shift+Tab');assert.equal(await dialog.getByRole('button',{name:'Next photo'}).evaluate(e=>e===document.activeElement),true);await page.keyboard.press('Tab');assert.equal(await close.evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('ArrowRight');assert.equal(await counter(),'4 / 12');await page.keyboard.press('ArrowLeft');assert.equal(await counter(),'3 / 12');
  await dialog.getByRole('button',{name:'Next photo'}).click();assert.equal(await counter(),'4 / 12');await dialog.getByRole('button',{name:'Previous photo'}).click();assert.equal(await counter(),'3 / 12');
  const stage=dialog.locator('img').locator('..');await stage.dispatchEvent('pointerdown',{pointerType:'touch',pointerId:9,clientX:260,clientY:250});await stage.dispatchEvent('pointerup',{pointerType:'touch',pointerId:9,clientX:90,clientY:250});assert.equal(await counter(),'4 / 12');
  await stage.dispatchEvent('pointerdown',{pointerType:'touch',pointerId:9,clientX:90,clientY:250});await stage.dispatchEvent('pointerup',{pointerType:'touch',pointerId:9,clientX:260,clientY:250});assert.equal(await counter(),'3 / 12');
  if(width===390)await dialog.screenshot({path:'artifacts/gallery-lightbox-390.png'});
  await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});assert.equal(await opener.evaluate(e=>e===document.activeElement),true);
  await opener.click();await close.click();await dialog.waitFor({state:'hidden'});assert.equal(await opener.evaluate(e=>e===document.activeElement),true);
  await page.goto('http://localhost:4301/');const preview=page.getByRole('region',{name:'Gallery preview'});assert.equal(await preview.locator('li:visible').count(),width<768?4:6);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);if(width===390||width===1440)await page.locator('[class*=photoColumn]').screenshot({path:`artifacts/home-gallery-${width}.png`});await preview.getByRole('link').first().click();await page.waitForURL('**/school-life#gallery');await page.goto('http://localhost:4301/');const homeLink=page.getByRole('link',{name:'View full gallery',exact:true});await homeLink.click();await page.waitForURL('**/school-life#gallery');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1800);
  const offset=await page.locator('#gallery').evaluate(e=>e.getBoundingClientRect().top);assert.ok(Math.abs(offset-128)<6,`Gallery anchor offset: ${offset}`);assert.deepEqual(errors,[]);
  results.push({width,columns,initialGalleryKiB:Math.round(initialPayload/1024),homeAnchorTop:offset});console.log(width,'filters, lightbox, focus, swipe, Home scroll passed');await page.close();
 }
 const fixture=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await fixture.goto('http://localhost:4301/artifacts/gallery-harness.html');await fixture.getByRole('button',{name:/^Open photo/}).first().waitFor();const gallery=fixture.locator('#gallery');const cards=gallery.getByRole('button',{name:/^Open photo/});assert.equal(await cards.count(),12);await gallery.getByRole('button',{name:/^Load more/}).click();assert.equal(await cards.count(),24);assert.equal(await gallery.getByRole('button',{name:/^Load more/}).count(),0);assert.equal(await cards.first().locator('..').evaluate(e=>getComputedStyle(e).animationName),'none');await cards.nth(12).click();const dialog=fixture.getByRole('dialog');assert.equal(await dialog.locator('[aria-atomic="true"]').innerText(),'13 / 24');await fixture.keyboard.press('Escape');await gallery.getByRole('button',{name:'Events',exact:true}).click();assert.equal(await cards.count(),8);console.log('24-entry fixture: Load more, filter reset, viewer counter and reduced motion passed');await fixture.close();await fs.writeFile('artifacts/gallery-qa.json',JSON.stringify(results,null,2));
}finally{await browser.close();await server.close();}process.exit(0);

