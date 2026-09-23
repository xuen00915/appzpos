import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const uiRoot = resolve(scriptDirectory, '..');
const componentRoot = resolve(
  uiRoot,
  'client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components'
);
const pageDirectory = resolve(componentRoot, 'cn-f&b-restaurant-cloud-pos-system');
const files = [
  resolve(pageDirectory, 'cn-f&b-restaurant-cloud-pos-system.component.html'),
  resolve(pageDirectory, 'cn-f&b-restaurant-cloud-pos-system.component.ts'),
  resolve(pageDirectory, 'home-page-content.zh.ts'),
  resolve(componentRoot, 'home-page-template/home-page-template.component.html'),
  resolve(componentRoot, 'home-hero/home-hero.component.html'),
  resolve(componentRoot, 'home-order-flow/home-order-flow.component.html'),
  resolve(componentRoot, 'home-story-sections/home-story-sections.component.html'),
  resolve(componentRoot, 'home-ecosystem/home-ecosystem.component.html'),
  resolve(componentRoot, 'home-proof/home-proof.component.html'),
  resolve(componentRoot, 'index/home-page-proof.en.ts'),
  resolve(componentRoot, 'cn-custom-request-demo/cn-custom-request-demo.component.html'),
  resolve(componentRoot, 'cn-custom-request-demo/cn-custom-request-demo.component.ts')
];

for (const file of files) {
  if (!existsSync(file)) {
    console.error(`Chinese homepage contract failed: missing source file ${file}`);
    process.exit(1);
  }
}

const source = files.map((file) => readFileSync(file, 'utf8')).join('\n');
const routeTemplate = readFileSync(
  resolve(pageDirectory, 'cn-f&b-restaurant-cloud-pos-system.component.html'),
  'utf8'
);
const chineseConfigSource = readFileSync(resolve(pageDirectory, 'home-page-content.zh.ts'), 'utf8');
const normalizedSource = source
  .replace(/<br\s*\/?\s*>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&nbsp;/g, ' ')
  .replace(/&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ')
  .trim();
const compactSource = normalizedSource.replace(/\s+/g, '');

const expectedPhrases = [
  'APPZPOS POS系统',
  '云端智能POS餐饮系统',
  '高达50%政府津贴折扣',
  'APPZPOS POS系统云端智能POS餐饮系统高达50%政府津贴折扣',
  '专为餐饮业者设计的全方位餐饮系统，包括收银系统、销售报告分析、会员管理、库存管理、促销优惠，运营流程等',
  '预约免费演示',
  'WhatsApp联系我们',
  '新加坡本地最佳POS系统供应商 满足您餐饮业务的一切需求，您的餐厅运营首选',
  '欢迎来到APPZPOS！我们是新加坡市面上最强大的云端智能POS系统，为餐饮、零售和美容院等各行各业提供经济实惠的收银系统。我们拥有丰富的餐饮业合作经验，能够根据不同客户的需求提供建议并提供最合适的解决方案。除了定制化的收银软件和硬件配置，我们还提供符合现代化餐厅需求的POS餐饮系统，包括收银机、平板点餐、网站点餐、扫码点餐、自助点餐机、KDS厨房系统、排队叫号系统和外卖订单中心等一系列附加功能的整合。通过这些功能的综合运用，我们能够确保您的餐饮业务运营更加顺畅、高效、迅速！',
  '收银机 / 电子点餐',
  '网站 点餐',
  '扫码 点餐',
  '自助 点餐机',
  '排队叫号 系统',
  'KDS厨房 系统',
  '外卖订单 中心',
  '云端POS系统',
  '- 通过互联网随时随地访问、管理您的数据，实现实时数据同步',
  '实时更新',
  '- 轻松设置或更新菜单信息，包括价格、附加项目、特价项目或套餐等',
  '报告分析',
  '- 实时生成各种报告，包括每日销售、项目销售和客户销售等',
  '智能库存',
  '- 实时跟踪菜单库存，并在库存量低于设定值时发送警报通知',
  '桌位管理',
  '- 使用二维餐厅平面图查看各个桌位的占用情况，轻松管理店内实况',
  '会员管理',
  '- 收集客户信息并根据层级设置不同的奖励或优惠，如积分、优惠券等',
  '支付选项',
  '- 与多个支付平台合作，提供刷卡机和在线支付方式，以确保安全支付',
  '外卖平台链接',
  '- 与Grab、Foodpanda和Deliveroo等应用合作，统一所有餐厅订单',
  '多种语言',
  '- 提供不同语言的菜单，以服务多元化的客户群体',
  '其他功能',
  '- 拆分账单或订单、转移订单、员工打卡等',
  '了解更多',
  '网站点餐系统',
  '在线点餐',
  '- 允许顾客进入网站查看菜单、付款，并随时随地轻松点餐',
  '送餐服务',
  '- 顾客可选择预订订单，自取或送货，并随时查询订单状态',
  '- 随时更新菜单信息，包括价格、特别优惠活动或供应情况',
  '在线支付',
  '- 与多个支付平台合作，提供多种支付选项，让顾客通过网站安全支付',
  '促销推广',
  '- 提供特惠折扣、优惠券，促销和广告横幅展示，吸引顾客参与或消费',
  '配送平台链接',
  '- 目前已与Grabexpress、Lalamove、Pandago合作，顾客可自选喜爱的配送平台',
  '扫码点餐系统',
  '电子菜单',
  '- 顾客通过扫描二维码查看菜单，并可以通过手机下单，无需与服务员接触',
  '成本节省',
  '- 减少印刷菜单和减少对人力的依赖',
  '点餐界面',
  '- 个性化点餐定制功能，界面简单易操作，顾客可自主选择菜品和规格，完成点餐和支付',
  '- 在二维码点餐页面上可展示促销活动或推广信息，吸引顾客参与或消费',
  '自助点餐机',
  '无接触点餐',
  '- 顾客可自主选择菜品和规格，完成点餐和支付，从而减少等待时间',
  '- 触屏点餐方式，个性化点餐定制功能，界面简单易操作，让客户轻松点餐',
  '款式选项',
  '- 提供15.6英寸、21英寸、24英寸和32英寸的屏幕，可选择安装在台面或支架上',
  '- 在自助点餐机主页上展示促销活动或推广信息，吸引顾客参与或消费',
  '排队叫号系统',
  '叫号系统',
  '- 为所有订单分配特定的排队号，准确地告知顾客等待时间和顺位，减少排队烦恼',
  '实时叫号',
  '- 与KDS厨房系统同步，一旦订单准备好，即可实时更新排队号码',
  '屏幕选项',
  '- 提供多种尺寸的屏幕显示，以满足不同餐厅的需求',
  '- 除了排队号码外，可在主页上展示促销活动或推广信息，吸引顾客参与或消费',
  'KDS厨房系统',
  '订单追踪',
  '- 实时追踪订单的状态和进度，包括新订单、修改和取消订单等',
  '订单界面',
  '- 根据不同厨房工作流程定制KDS显示界面',
  '视觉提示',
  '- 使用不同的颜色指示不同的订单状态（例如，新订单、进行中、已完成）',
  '无缝连接',
  '- 与排队叫号系统同步，实时显示“处理中”和“可收取”的订单',
  '提高效率',
  '- 根据订单优先级和预计烹饪时间协调准备工作，确保及时完成每道菜品',
  '错误减少',
  '- 通过清晰的界面和订单状态提示，可以减少订单处理过程中的错误',
  '外卖订单中心',
  '统一管理',
  '- 集中管理所有来自不同平台的外卖订单，包括店内订单，提高了订单处理的效率和准确性',
  '合作平台',
  '- 目前已与GrabFood、Foodpanda和Deliveroo合作，将其集成到一个中心平台',
  '- 通过订单中心，您可以统一管理不同平台的菜单，实时更新菜单详情和供应情况',
  '自动订单分配',
  '- 根据送货日期和时间，将订单自动分配到相应的厨房显示系统，确保及时完成',
  '送货信息显示',
  '- 在POS系统中显示来自每个送货平台的司机和客户联系信息，以便进行简单的沟通',
  '订单综合报告',
  '- 在一个POS系统中轻松管理所有送货、在线和实体店订单，并生成实时分析报告',
  '新加坡本地最佳POS系统供应商满足您餐饮业务的一切需求，您的餐厅运营首选',
  '客制化POS软件与硬件',
  '餐车，档口，餐厅都适用',
  'APPZPOS提供全面的餐厅管理系统，定制合适的软件和硬件配置，以满足各类餐饮的需求。除了基本的收银操作外，APPZPOS系统添加了许多餐厅管理附加功能，包括自动化订单处理、配送管理、库存管理、支付程序、员工管理、会员管理、促销活动管理、第三方平台集成，以及实时报告分析等，使您能够更轻松、更完善地经营餐厅。',
  '联系我们，探索适合您业务的POS解决方案。',
  '联系我们',
  '统一管理POS餐饮系统',
  '高效经营，实现最大化盈利',
  '云端POS系统 -',
  '在一个POS系统中心集中管理，并通过互联网随时随地更新或查看',
  '实时报告分析 -',
  '记录了每笔交易的细节信息，包括销售额、产品类别、交易时间、支付方式等，并利用生成的实时报告数据进行分析',
  '第三方整合 -',
  '与第三方平台合作（如外卖配送、支付、会计软件、商场平台等），在我们的POS系统中直接处理与第三方平台相关的业务，例如接收在线订单、处理支付、安排配送等',
  '多店运营 -',
  '如果您正在扩张到更多的地点，您可以通过我们统一的POS系统，轻松管理多个分店的运营',
  '享受高达50%的政府津贴',
  '简单申请，轻松获得资金返还',
  '我们是PSG政府津贴预先批准的POS供应商，专为本地餐饮中小企业提供收银服务。只需购买任意一套APPZPOS POS系统，我们将全程协助您轻松快速完成申请！',
  'SMEs are eligible for up to 50% Productivity Solutions Grant (PSG) support for the adoption of APPZPOS F&B Point of Sales, a Pre-Approved Solution under the IMDA SMEs Go Digital programme.',
  'APPZPOS的优势',
  '会员管理系统',
  '收集客户信息，根据客户的购买历史和偏好，提供个性化的服务和推荐',
  '可设置不同的客户层级，并提供相应的奖励或优惠，如积分、优惠券等',
  '新加坡本地服务',
  '新加坡本地开发人员和技术支持团队，免费上门安装，快速响应您的请求，提供及时帮助',
  '支持客户在业务扩展过程中开设新的分店，利用统一的POS系统轻松管理多个门店',
  '库存管理系统',
  '实时跟踪菜单库存，确保及时补货和避免缺货情况，提高库存管理的效率',
  '设定库存警报，在库存量低于设定值时发送通知，以便及时采取必要行动',
  '安全支付程序',
  '提供多种安全支付选项，包括在线支付、刷卡支付等，确保客户支付安全',
  '目前与多个可信支付终端平台合作集成，降低支付风险（Nets，Kpay，Stripe，Fomopay等）',
  '配送管理系统',
  '自动化配送管理，与Grabexpress，PandaGo和Lalamove合作集成，实时跟踪配送状态',
  '同时与GrabFood、Foodpanda和Deliveroo合作集成，将所有外卖订单集中到一个POS系统',
  '客户信息安全',
  'ISO27001认证，符合法律法规要求，维护客户的一切信息安全',
  '由CREST认可的VAPT认证，透过专业的评估与测试以确保系统的安全性和完整性',
  '我们的客户'
];

const expectedRoutes = [
  "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!",
  '/cloud-pos-point-of-sales-system',
  '/f&b-restaurant-online-ordering-website',
  '/f&b-restaurant-emenu-qr-code-ordering-system',
  '/self-order-kiosk-restaurant',
  '/f&b-restaurant-queue-number-display-system',
  '/f&b-restaurant-kitchen-display-system',
  '/f&b-restaurant-delivery-integration',
  'psg-pos-system-grant-singapore',
  "http://m.me/APPZPOS?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!"
];

const expectedImages = [
  'APPZPOS-Pos-Best-Point-of-Sales-System-Banner.png',
  'APPZPOS-Pos-Best-Point-of-Sales-System-Banner-mobile.png',
  'APPZPOS-Pos-System-Singapore-Home-POS-System2.png',
  'APPZPOS-Pos-System-Singapore-Home-Website-Order2.png',
  'APPZPOS-Pos-System-Singapore-Home-Table-QR-Order2.png',
  'APPZPOS-Pos-System-Singapore-Home-Self-Order-Kiosk2.png',
  'APPZPOS-Pos-System-Singapore-Home-Queue-Number-Display2.png',
  'APPZPOS-Pos-System-Singapore-Home-Kitchen-Display-System2.png',
  'APPZPOS-Pos-System-Singapore-Home-Order-Hub2.png',
  'APPZPOS-best-pos-system-singapore-cloud-POS-system.png',
  'APPZPOS-best-point-of-sale-system-Website-ordering.png',
  'APPZPOS-best-point-of-sale-system-Table-QR-Ordering.png',
  'APPZPOS-all-in-one-pos-system-Self-order-kiosk.png',
  'APPZPOS-point-of-sales-system-singapore-queue-number-display2.png',
  'APPZPOS-point-of-sales-system-Kitchen-display-system-KDS.png',
  'APPZPOS-best-pos-system-singapore-order-hub.png',
  'APPZPOS-Pos-System-Singapore-pos-mobile.png',
  'APPZPOS-Pos-System-Singapore-website-order-mobile.png',
  'APPZPOS-Pos-System-Singapore-qr-order-mobile.png',
  'APPZPOS-Pos-System-Singapore-self-kiosk-mobile.png',
  'APPZPOS-Pos-System-Singapore-queue-number-display-mobile.png',
  'APPZPOS-Pos-System-Singapore-kitchen-display-system-mobile.png',
  'APPZPOS-Pos-System-Singapore-order-hub-mobile.png',
  'APPZPOS-Pos-Point-of-Sales-System-Customized-Software-and-Hardware.png',
  'APPZPOS-point-of-sale-software-all-in-one-pos-solutions.png',
  'APPZPOS-All-in-One-Pos-System-PSG-banner.png',
  'FA_IMDA_Full_Colour_Horizontal_Lockup.png',
  'APPZPOS-Point-of-Sale-Software-Customer-Relationship-Management.png',
  'APPZPOS-Best-Point-of-Sale-System-Local-Based-Support.png',
  'APPZPOS-Best-Point-of-Sale-System-Payment-Integration.png',
  'APPZPOS-Best-Point-of-Sale-System-Inventory-Management.png',
  'APPZPOS-Point-of-Sale-Software-Delivery-Management.png',
  'APPZPOS-Point-of-Sale-Software-Data-Security.png',
  'APPZPOS-Point-of-Sales-System-Singapore-i-Steak.png',
  'APPZPOS-Point-of-Sales-System-Singapore-Kei-Kaisendon.png',
  'APPZPOS-Point-of-Sale-Software-Onkei.png',
  'APPZPOS-Point-of-Sales-System-Singapore-Keitaku.png',
  'Ajumma.png',
  'APPZPOS-Pos-System-Singapore-Pasta-Play.png',
  'APPZPOS-Pos-System-Singapore-Tangled.png',
  'APPZPOS-Pos-Point-of-Sales-System-Pizza-Master_Fernando.png',
  'APPZPOS-Best-POS-Ton-Coffee.png',
  'APPZPOS-Point-of-Sales-System-Singapore-A-Roy-Thai.png',
  'APPZPOS-All-in-One-Pos-System-thaitogo.png',
  'APPZPOS-All-in-One-Pos-System-Wokker-Aroy-Thai.png',
  'APPZPOS-Best-Point-of-Sale-System-Empire-Phoenix-Garden.png',
  'APPZPOS-Best-Pos-System-Singapore-FS-Culinary.png',
  'APPZPOS-Pos-System-Singapore-ANDO.png',
  'Rasa-Istimewa.png',
  'Ensei.png',
  'Soi-19.png',
  'Yogurt-Planet.png',
  'APPZPOS-All-in-One-Pos-System-Sigl-食纪.png',
  'APPZPOS-Pos-System-Singapore-Alter-Ego.png',
  'APPZPOS-Pos-System-Singapore-Artisan.png',
  'APPZPOS-Best-Pos-System-Singapore-Atn-Spice-Restaurant.png',
  'APPZPOS-Pos-System-Singapore-Bar-Stories.png',
  'APPZPOS-Pos-System-Singapore-Bespoke-Dining-Club.png',
  'APPZPOS-Point-of-Sales-System-Singapore-Beyong-Fruit.png',
  'APPZPOS-Pos-System-Singapore-ROF.png',
  'APPZPOS-Best-Pos-System-Singapore-Cool-Cup.png',
  'APPZPOS-Best-Point-of-Sale-System-Darling-Linda.png',
  'APPZPOS-All-in-One-Pos-System-Simplicite.png',
  'APPZPOS-Best-Pos-System-Singapore-Fresh-Fruits-Lab-Group.png',
  'Kaisen-Ryori.png',
  'APPZPOS-Best-Point-of-Sale-System-Go2eat.png',
  'APPZPOS-Pos-Point-of-Sales-System-Gold-Tat-Lee.png',
  'APPZPOS-Best-Point-of-Sale-System-Grand-Konak.png',
  'APPZPOS-Best-Point-of-Sale-System-Kaash-Biryani.png',
  'APPZPOS-Point-of-Sale-Software-Tea-Space.png',
  'APPZPOS-All-in-One-Pos-System-Sarigama-Grand.png',
  'APPZPOS-Point-of-Sale-Software-Paw-Paw-Town.png',
  'APPZPOS-Pos-Point-of-Sales-System-Overworld.png',
  'APPZPOS-Point-of-Sale-Software-Cafe-Three.png',
  'Mr-Prawn-Cafe.png',
  'APPZPOS-Pos-Point-of-Sales-System-Moms-Hug.png',
  'APPZPOS-All-in-One-Pos-System-Teavana.png',
  'Znoodle.png',
  'APPZPOS-Best-Point-of-Sale-System-Freshio.png',
  'APPZPOS-Best-POS-The-Original-Taste.png',
  'APPZPOS-Best-POS-Yuyu.png',
  'APPZPOS-Point-of-Sale-Software-Pilcrow-Western.png',
  'swan.png',
  'Overly-Cheezy.png',
  'APPZPOS-Best-POS-Empire-Hotpot.png',
  'APPZPOS-Point-of-Sales-System-Singapore-Simple-Burger.png',
  'Durian-Grandpa.png',
  'nampla.png',
  'APPZPOS-Point-of-Sale-Software-李记串串香.png',
  '3-meals.png',
  'APPZPOS-All-in-One-Pos-System-Unami-Ramen.png',
  'DL-Lifestyle.png',
  'APPZPOS-All-in-One-Pos-System-顺旺.png',
  'Yi-Jia-Ren.png',
  'APPZPOS-Best-Point-of-Sale-System-Adinda.png',
  'APPZPOS-Point-of-Sale-Software-Mexican-and-Indian-Restaurant.png',
  'APPZPOS-Point-of-Sale-Software-Platform-1094.png',
  'Xiao-Yin-Mao.png',
  'Ryans-Grocery.png',
  'APPZPOS-Pos-Point-of-Sales-System-Sticky-Fingers.png',
  'Long-Quan-Cha-Shi.png',
  'Breakfast-at-Jerrys.png',
  'APPZPOS-Pos-System-Singapore-Asli-Malaysia.png',
  'Fish-Soup.png',
  'Beth.png',
  'APPZPOS-Best-POS-Jules.png',
  'APPZPOS-Pos-System-Singapore-Wings-Plus.png',
  'APPZPOS-Best-Pos-System-Singapore-Cafe-Coldrea.png',
  'APPZPOS-Best-POS-Palm-Green.png',
  'APPZPOS Point of Sales WhatsApp Us.png',
  'APPZPOS Point of Sales Messenger Us.png'
];

const expectedMetadata = [
  'APPZPOS云端智能POS餐饮系统 收银系统 | 新加坡餐厅运营首选',
  '收银机、电子点餐、网站点餐、扫码点餐、自助点餐机、KDS厨房系统、排队叫号系统和外卖订单中心。高达50%政府津贴折扣！立即联系我们 +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
];

const expectedHooks = [
  'openDialog()',
  'CNModalRequestDemoComponent',
  "width: '600px'",
  '(ngSubmit)="onSubmit()"',
  'formControlName="name"',
  'formControlName="email"',
  'formControlName="mobilenum"',
  'formControlName="restaurant_name"',
  '/api/WebSiteController/SendEmail'
];

const groups = [
  ['phrases', expectedPhrases, (value) =>
    normalizedSource.includes(value)
    || compactSource.includes(value.replace(/\s+/g, ''))
    || (value.startsWith('- ')
      && chineseConfigSource.includes(value.slice(2))
      && source.includes('<span> - {{ feature.description }}</span>'))],
  ['routes', expectedRoutes, (value) => source.includes(value)],
  ['images', expectedImages, (value) => source.includes(value)],
  ['metadata', expectedMetadata, (value) => source.includes(value)],
  ['hooks', expectedHooks, (value) => source.includes(value)]
];

const failures = [];
if (!routeTemplate.includes('app-home-page-template')) failures.push('shared template selector missing');
if (routeTemplate.includes('id="webview"') || routeTemplate.includes('id="mobile_view"')) {
  failures.push('legacy duplicate view ids remain');
}
for (const fallback of ['Everything Works Together', 'Our Commitment to Local Excellence']) {
  if (chineseConfigSource.includes(fallback)) failures.push(`English fallback added to Chinese config: ${fallback}`);
}
for (const [name, expectations, present] of groups) {
  const missing = expectations.filter((value) => !present(value));
  if (missing.length) {
    failures.push(`${name}:\n${missing.map((value) => `  - ${value}`).join('\n')}`);
  }
}

if (failures.length) {
  console.error(`Chinese homepage contract failed:\n${failures.join('\n')}`);
  process.exit(1);
}

console.log(
  `Chinese homepage contract passed: ${expectedPhrases.length} phrases, ` +
  `${expectedRoutes.length} routes, ${expectedImages.length} images, ` +
  `${expectedMetadata.length} metadata values, ${expectedHooks.length} hooks.`
);
