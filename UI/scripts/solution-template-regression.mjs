import { mkdirSync, writeFileSync } from 'node:fs';

const preview = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4313/';
const endpoint = `http://127.0.0.1:${process.env.APPZPOS_CDP_PORT ?? '9225'}`;
const pages = [
  ['cloud-pos-point-of-sales-system', 12],
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
      const hero=document.querySelector('.solution-island-hero,[data-solution-hero]');
      const heroTitle=hero?.querySelector('h1');
      const heroCopy=hero?.querySelector('.solution-island-hero__copy,.appz-solution-hero__copy');
      return {
        shell:document.querySelectorAll('app-solution-page').length,
        featureHeading:document.querySelectorAll('[data-pos-feature-heading] h2').length,
        featureDescription:!!document.querySelector('[data-pos-feature-heading] p')?.textContent.trim(),
        overviewLines:lines([...document.querySelectorAll('.pos-overview h2')].find(visible)),
        heroLines:lines(heroTitle),
        heroHeight:hero.getBoundingClientRect().height,
        heroDecoration:getComputedStyle(heroCopy,'::before').content,
        content:document.querySelectorAll('#content').length,
        forms:document.querySelectorAll('#requestdemo app-custom-request-demo').length,
        overflow:document.documentElement.scrollWidth>innerWidth,
        featureCount:cards.length,
        columns:cards.filter(c=>Math.abs(c.getBoundingClientRect().top-top)<2).length,
        copyClipped:[...document.querySelectorAll('#content h2,#content h3,#content p')].filter(visible).some(e=>e.scrollWidth>e.clientWidth+2),
        showcaseHeadings:[...document.querySelectorAll('.pos-system-card__body h2')].filter(visible).map(heading=>{
          const body=heading.closest('.pos-system-card__body');
          const card=heading.closest('.pos-system-card');
          const headingBounds=heading.getBoundingClientRect();
          const cardBounds=card.getBoundingClientRect();
          const bodyStyles=getComputedStyle(body);
          const headingStyles=getComputedStyle(heading);
          const bodyContentWidth=body.clientWidth-parseFloat(bodyStyles.paddingLeft)-parseFloat(bodyStyles.paddingRight);
          return {
            text:heading.textContent.replace(/\\s+/g,' ').trim(),
            featured:card.classList.contains('pos-system-card--featured'),
            widthRatio:bodyContentWidth?headingBounds.width/bodyContentWidth:0,
            cardWidthRatio:cardBounds.width?headingBounds.width/cardBounds.width:0,
            forcedBreaks:heading.querySelectorAll('br').length,
            maxWidth:headingStyles.maxWidth,
            whiteSpace:headingStyles.whiteSpace,
            overflowWrap:headingStyles.overflowWrap,
            wordBreak:headingStyles.wordBreak,
            hyphens:headingStyles.hyphens,
            textWrap:headingStyles.textWrap,
            clipped:heading.scrollWidth>heading.clientWidth+2
          };
        }),
        showcaseImages:[...document.querySelectorAll('.pos-system-card__visual')].filter(visible).map(visual=>{
          const card=visual.closest('.pos-system-card');
          const image=visual.querySelector('img');
          const visualBounds=visual.getBoundingClientRect();
          const imageBounds=image.getBoundingClientRect();
          const imageStyles=getComputedStyle(image);
          return {
            featured:card.classList.contains('pos-system-card--featured'),
            frameHeight:Math.round(visualBounds.height),
            imageHeight:Math.round(imageBounds.height),
            objectFit:imageStyles.objectFit,
            clipped:image.scrollWidth>image.clientWidth+2
          };
        }),
        overviewCount:[...document.querySelectorAll('.pos-overview')].filter(visible).length,
        imagesLoaded:[...document.querySelectorAll('#content img')].filter(visible).every(i=>i.naturalWidth>0),
        gtm:!!document.querySelector('script[src*="googletagmanager.com/gtm.js?id=GTM-N7VKTGG"]'),
        meta:!!document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]'),
        whatsapp:!!document.querySelector('a.btn-whatsapp[href^="https://wa.me/6583109631"]')
      };
    })()`);
    const columns=width>=1200?4:width>=600?2:1;
    const headingsUseSharedNaturalWrap=result.showcaseHeadings.length>0&&result.showcaseHeadings.every(heading=>
      !heading.clipped&&heading.forcedBreaks===0&&heading.maxWidth==='none'&&heading.whiteSpace==='normal'
      &&heading.overflowWrap==='normal'&&heading.wordBreak==='normal'&&heading.hyphens==='none'
      &&heading.textWrap==='wrap'
      &&(width<1024||(heading.widthRatio>=.95&&(heading.featured||heading.cardWidthRatio>=.9))));
    const imagesUseFixedResponsiveFrames=result.showcaseImages.length>0&&result.showcaseImages.every(image=>{
      const expectedHeight=width<=599?230:width<=991?280:image.featured?430:320;
      return image.frameHeight===expectedHeight&&image.imageHeight===expectedHeight
        &&image.objectFit==='contain'&&!image.clipped;
    });
    const maximumHeroLines=width<=320?4:3;
    if(result.shell!==1||result.content!==1||result.forms!==1||result.overflow||result.copyClipped||result.featureCount!==count||result.columns!==columns||result.overviewCount!==1||!result.imagesLoaded||!result.gtm||!result.meta||!result.whatsapp||result.heroHeight>540||result.heroDecoration!=='none'||result.featureHeading!==1||!result.featureDescription||result.heroLines>maximumHeroLines||(width>=1024&&result.overviewLines!==1)||!headingsUseSharedNaturalWrap||!imagesUseFixedResponsiveFrames){
      failures.push({page,width,...result});
    }
    if(process.env.APPZPOS_SCREENSHOT_DIR && (width===1440||width===390)){
      await evaluate(`([...document.querySelectorAll('.pos-system-showcase')].find(section=>{
        const bounds=section.getBoundingClientRect();
        return bounds.width>0&&bounds.height>0;
      }))?.scrollIntoView({block:'start'})`);
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
