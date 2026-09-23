import { mkdirSync, writeFileSync } from 'node:fs';

const preview = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4313/';
const endpoint = `http://127.0.0.1:${process.env.APPZPOS_CDP_PORT ?? '9225'}`;
const pages = [
  ['f&b-restaurant-emenu-qr-code-ordering-system', 8],
  ['f&b-restaurant-online-ordering-website', 9],
  ['self-order-kiosk-restaurant', 8],
  ['f&b-restaurant-kitchen-display-system', 6],
  ['f&b-restaurant-queue-number-display-system', 5],
  ['f&b-restaurant-delivery-integration', 5]
];
const target = await fetch(`${endpoint}/json/new?${encodeURIComponent(preview)}`, {method:'PUT'}).then(r=>r.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(resolve=>socket.addEventListener('open',resolve,{once:true}));
let nextId=0;
const pending=new Map();
socket.addEventListener('message',event=>{
  const message=JSON.parse(event.data);
  if(pending.has(message.id)){pending.get(message.id)(message.result);pending.delete(message.id);}
});
const send=(method,params={})=>new Promise(resolve=>{
  pending.set(++nextId,resolve);socket.send(JSON.stringify({id:nextId,method,params}));
});
const evaluate=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const failures=[];
await send('Page.enable');
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
for(const [page,count] of pages){
  await send('Page.navigate',{url:new URL(page,preview).href});
  for(let attempt=0;attempt<40;attempt++){
    if(await evaluate(`Boolean(document.querySelector('app-solution-page .pos-feature-grid'))`))break;
    await wait(250);
  }
  await evaluate(`Promise.race([Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,8000))])`);
  for(const width of [1440,1280,1024,768,600,430,390,320]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<=768});
    await wait(100);
    const result=await evaluate(`(()=>{
      const visible=e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0;
      const lines=e=>{const r=document.createRange();r.selectNodeContents(e);return new Set([...r.getClientRects()].filter(x=>x.width>0).map(x=>Math.round(x.top))).size;};
      const cards=[...document.querySelectorAll('[data-pos-feature]')];
      const top=cards[0]?.getBoundingClientRect().top;
      return {
        shell:document.querySelectorAll('app-solution-page').length,
        featureHeading:document.querySelectorAll('[data-pos-feature-heading] h2').length,
        featureDescription:!!document.querySelector('[data-pos-feature-heading] p')?.textContent.trim(),
        overviewLines:lines([...document.querySelectorAll('.pos-overview h2')].find(visible)),
        heroLines:lines(document.querySelector('.solution-island-hero h1')),
        heroHeight:document.querySelector('.solution-island-hero').getBoundingClientRect().height,
        heroDecoration:getComputedStyle(document.querySelector('.solution-island-hero__copy'),'::before').content,
        content:document.querySelectorAll('#content').length,
        forms:document.querySelectorAll('#requestdemo app-custom-request-demo').length,
        overflow:document.documentElement.scrollWidth>innerWidth,
        featureCount:cards.length,
        columns:cards.filter(c=>Math.abs(c.getBoundingClientRect().top-top)<2).length,
        copyClipped:[...document.querySelectorAll('#content h2,#content h3,#content p')].filter(visible).some(e=>e.scrollWidth>e.clientWidth+2),
        overviewCount:[...document.querySelectorAll('.pos-overview')].filter(visible).length,
        imagesLoaded:[...document.querySelectorAll('#content img')].filter(visible).every(i=>i.naturalWidth>0),
        gtm:!!document.querySelector('script[src*="googletagmanager.com/gtm.js?id=GTM-N7VKTGG"]'),
        meta:!!document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]'),
        whatsapp:!!document.querySelector('a.btn-whatsapp[href^="https://wa.me/6583109631"]')
      };
    })()`);
    const columns=width>=1200?4:width>=600?2:1;
    if(result.shell!==1||result.content!==1||result.forms!==1||result.overflow||result.copyClipped||result.featureCount!==count||result.columns!==columns||result.overviewCount!==1||!result.imagesLoaded||!result.gtm||!result.meta||!result.whatsapp||result.heroHeight>540||result.heroDecoration!=='none'||result.featureHeading!==1||!result.featureDescription||result.heroLines>3||(width>=1024&&result.overviewLines!==1)){
      failures.push({page,width,...result});
    }
    if(process.env.APPZPOS_SCREENSHOT_DIR && (width===1440||width===390)){
      await evaluate(`document.querySelector('.pos-feature-section').scrollIntoView({block:'start'})`);
      await wait(100);
      mkdirSync(process.env.APPZPOS_SCREENSHOT_DIR,{recursive:true});
      const screenshot=await send('Page.captureScreenshot',{format:'png'});
      writeFileSync(`${process.env.APPZPOS_SCREENSHOT_DIR}/${page}-${width}.png`,Buffer.from(screenshot.data,'base64'));
    }
  }
}
await send('Page.close');socket.close();
console.log(JSON.stringify({status:failures.length?'fail':'pass',pages:pages.length,viewports:8,failures},null,2));
if(failures.length)process.exitCode=1;
