import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const video=await readFile(process.argv[2]||'C:/Users/bhara/Downloads/gemini_generated_video_5286d296.mp4');
await page.route('http://reference.local/video.mp4', async route => {
  const range=route.request().headers().range;
  const match=range?.match(/bytes=(\d+)-(\d*)/);
  const start=Number(match?.[1]||0),end=match?.[2]?Number(match[2]):video.length-1;
  await route.fulfill({status:match?206:200,contentType:'video/mp4',headers:{'Access-Control-Allow-Origin':'*','Accept-Ranges':'bytes',...(match?{'Content-Range':`bytes ${start}-${end}/${video.length}`}:{})},body:video.subarray(start,end+1)});
});
await page.setContent('<video crossorigin="anonymous" src="http://reference.local/video.mp4" muted style="width:100%;height:100%;position:absolute;inset:0"></video>');
await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
console.log(await page.locator('video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight})));
for (const time of [0,2,4,6,8]) {
  await page.locator('video').evaluate((v,t)=>new Promise(resolve=>{v.onseeked=resolve;v.currentTime=t+.01;}),time);
  await page.waitForTimeout(500);
  const data=await page.locator('video').evaluate(v=>{const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);return {time:v.currentTime,image:c.toDataURL('image/png').split(',')[1]};});
  console.log('Decoded frame',data.time);
  await writeFile(`artifacts/reference-${time}.png`,Buffer.from(data.image,'base64'));
}
await browser.close();
