import { HomePageTemplateConfig, HomeSolutionsConfig } from '../home-page-template/home-page-template.models';
import { ENGLISH_HOME_PROOF_CONFIG } from '../index/home-page-proof.en';

const imageBase = 'https://appzpos.com/admin/Upload/0771BB36-9631-40F2-A204-C60247E9F1E1/Images/';

export const CHINESE_HOME_SOLUTIONS_CONFIG: HomeSolutionsConfig = {
  title: '新加坡本地最佳POS系统供应商满足您餐饮业务的一切需求，您的餐厅运营首选',
  description: '欢迎来到APPZPOS！我们是新加坡市面上最强大的云端智能POS系统，为餐饮、零售和美容院等各行各业提供经济实惠的收银系统。我们拥有丰富的餐饮业合作经验，能够根据不同客户的需求提供建议并提供最合适的解决方案。除了定制化的收银软件和硬件配置，我们还提供符合现代化餐厅需求的POS餐饮系统，包括收银机、平板点餐、网站点餐、扫码点餐、自助点餐机、KDS厨房系统、排队叫号系统和外卖订单中心等一系列附加功能的整合。通过这些功能的综合运用，我们能够确保您的餐饮业务运营更加顺畅、高效、迅速！',
  initialItemId: 'pos',
  learnMoreLabel: '了解更多',
  productOrder: ['pos', 'website', 'qr', 'kiosk', 'queue', 'kds', 'hub'],
  items: [
    {
      id: 'pos', title: '收银机 / 电子点餐', moduleTitle: '收银机 / 电子点餐',
      summary: '通过互联网随时随地访问、管理您的数据，实现实时数据同步',
      route: '/cloud-pos-point-of-sales-system', image: 'assets/images/ecosystem/ecosystem-dining.webp',
      imageAlt: '收银机与电子点餐系统', ariaLabel: '收银机 / 电子点餐', depth: .55,
      legacyImages: ['APPZPOS-Pos-System-Singapore-Home-POS-System2.png', 'APPZPOS-Pos-System-Singapore-pos-mobile.png'],
      features: [
        { label: '云端POS系统', description: '通过互联网随时随地访问、管理您的数据，实现实时数据同步' },
        { label: '实时更新', description: '轻松设置或更新菜单信息，包括价格、附加项目、特价项目或套餐等' },
        { label: '报告分析', description: '实时生成各种报告，包括每日销售、项目销售和客户销售等' },
        { label: '智能库存', description: '实时跟踪菜单库存，并在库存量低于设定值时发送警报通知' },
        { label: '桌位管理', description: '使用二维餐厅平面图查看各个桌位的占用情况，轻松管理店内实况' },
        { label: '会员管理', description: '收集客户信息并根据层级设置不同的奖励或优惠，如积分、优惠券等' },
        { label: '支付选项', description: '与多个支付平台合作，提供刷卡机和在线支付方式，以确保安全支付' },
        { label: '外卖平台链接', description: '与Grab、Foodpanda和Deliveroo等应用合作，统一所有餐厅订单' },
        { label: '多种语言', description: '提供不同语言的菜单，以服务多元化的客户群体' },
        { label: '其他功能', description: '拆分账单或订单、转移订单、员工打卡等' }
      ]
    },
    {
      id: 'website', title: '网站点餐', moduleTitle: '网站点餐系统', summary: '允许顾客进入网站查看菜单、付款，并随时随地轻松点餐',
      route: '/f&b-restaurant-online-ordering-website', image: 'assets/images/ecosystem/ecosystem-website-ordering.webp',
      imageAlt: '网站点餐系统', ariaLabel: '网站点餐系统', depth: .68,
      legacyImages: ['APPZPOS-Pos-System-Singapore-Home-Website-Order2.png', 'APPZPOS-Pos-System-Singapore-website-order-mobile.png'],
      features: [
        { label: '在线点餐', description: '允许顾客进入网站查看菜单、付款，并随时随地轻松点餐' },
        { label: '送餐服务', description: '顾客可选择预订订单，自取或送货，并随时查询订单状态' },
        { label: '实时更新', description: '随时更新菜单信息，包括价格、特别优惠活动或供应情况' },
        { label: '在线支付', description: '与多个支付平台合作，提供多种支付选项，让顾客通过网站安全支付' },
        { label: '多种语言', description: '提供不同语言的菜单，以服务多元化的客户群体' },
        { label: '促销推广', description: '提供特惠折扣、优惠券，促销和广告横幅展示，吸引顾客参与或消费' },
        { label: '配送平台链接', description: '目前已与Grabexpress、Lalamove、Pandago合作，顾客可自选喜爱的配送平台' }
      ]
    },
    {
      id: 'qr', title: '扫码点餐', moduleTitle: '扫码点餐系统', summary: '顾客通过扫描二维码查看菜单，并可以通过手机下单，无需与服务员接触',
      route: '/f&b-restaurant-emenu-qr-code-ordering-system', image: 'assets/images/ecosystem/ecosystem-table-qr.webp',
      imageAlt: '扫码点餐系统', ariaLabel: '扫码点餐系统', depth: .35,
      legacyImages: ['APPZPOS-Pos-System-Singapore-Home-Table-QR-Order2.png', 'APPZPOS-Pos-System-Singapore-qr-order-mobile.png'],
      features: [
        { label: '电子菜单', description: '顾客通过扫描二维码查看菜单，并可以通过手机下单，无需与服务员接触' },
        { label: '成本节省', description: '减少印刷菜单和减少对人力的依赖' },
        { label: '点餐界面', description: '个性化点餐定制功能，界面简单易操作，顾客可自主选择菜品和规格，完成点餐和支付' },
        { label: '实时更新', description: '随时更新菜单信息，包括价格、特别优惠活动或供应情况' },
        { label: '在线支付', description: '与多个支付平台合作，提供多种支付选项，让顾客通过网站安全支付' },
        { label: '促销推广', description: '在二维码点餐页面上可展示促销活动或推广信息，吸引顾客参与或消费' },
        { label: '多种语言', description: '提供不同语言的菜单，以服务多元化的客户群体' }
      ]
    },
    {
      id: 'kiosk', title: '自助点餐机', moduleTitle: '自助点餐机', summary: '顾客可自主选择菜品和规格，完成点餐和支付，从而减少等待时间',
      route: '/self-order-kiosk-restaurant', image: 'assets/images/ecosystem/ecosystem-kiosk.webp',
      imageAlt: '自助点餐机', ariaLabel: '自助点餐机', depth: .88,
      legacyImages: ['APPZPOS-Pos-System-Singapore-Home-Self-Order-Kiosk2.png', 'APPZPOS-Pos-System-Singapore-self-kiosk-mobile.png'],
      features: [
        { label: '无接触点餐', description: '顾客可自主选择菜品和规格，完成点餐和支付，从而减少等待时间' },
        { label: '成本节省', description: '减少印刷菜单和减少对人力的依赖' },
        { label: '点餐界面', description: '触屏点餐方式，个性化点餐定制功能，界面简单易操作，让客户轻松点餐' },
        { label: '实时更新', description: '随时更新菜单信息，包括价格、特别优惠活动或供应情况' },
        { label: '款式选项', description: '提供15.6英寸、21英寸、24英寸和32英寸的屏幕，可选择安装在台面或支架上' },
        { label: '促销推广', description: '在自助点餐机主页上展示促销活动或推广信息，吸引顾客参与或消费' },
        { label: '支付选项', description: '与多个支付平台合作，提供刷卡机和在线支付方式，以确保安全支付' },
        { label: '多种语言', description: '提供不同语言的菜单，以服务多元化的客户群体' }
      ]
    },
    {
      id: 'queue', title: '排队叫号系统', moduleTitle: '排队叫号系统', summary: '为所有订单分配特定的排队号，准确地告知顾客等待时间和顺位，减少排队烦恼',
      route: '/f&b-restaurant-queue-number-display-system', image: 'assets/images/ecosystem/ecosystem-queue.webp',
      imageAlt: '排队叫号系统', ariaLabel: '排队叫号系统', depth: .78,
      legacyImages: ['APPZPOS-Pos-System-Singapore-Home-Queue-Number-Display2.png', 'APPZPOS-Pos-System-Singapore-queue-number-display-mobile.png'],
      features: [
        { label: '叫号系统', description: '为所有订单分配特定的排队号，准确地告知顾客等待时间和顺位，减少排队烦恼' },
        { label: '实时叫号', description: '与KDS厨房系统同步，一旦订单准备好，即可实时更新排队号码' },
        { label: '屏幕选项', description: '提供多种尺寸的屏幕显示，以满足不同餐厅的需求' },
        { label: '促销推广', description: '除了排队号码外，可在主页上展示促销活动或推广信息，吸引顾客参与或消费' }
      ]
    },
    {
      id: 'kds', title: 'KDS厨房系统', moduleTitle: 'KDS厨房系统', summary: '实时追踪订单的状态和进度，包括新订单、修改和取消订单等',
      route: '/f&b-restaurant-kitchen-display-system', image: 'assets/images/ecosystem/ecosystem-kitchen.webp',
      imageAlt: 'KDS厨房系统', ariaLabel: 'KDS厨房系统', depth: .72,
      legacyImages: ['APPZPOS-Pos-System-Singapore-Home-Kitchen-Display-System2.png', 'APPZPOS-Pos-System-Singapore-kitchen-display-system-mobile.png'],
      features: [
        { label: '订单追踪', description: '实时追踪订单的状态和进度，包括新订单、修改和取消订单等' },
        { label: '订单界面', description: '根据不同厨房工作流程定制KDS显示界面' },
        { label: '视觉提示', description: '使用不同的颜色指示不同的订单状态（例如，新订单、进行中、已完成）' },
        { label: '无缝连接', description: '与排队叫号系统同步，实时显示“处理中”和“可收取”的订单' },
        { label: '提高效率', description: '根据订单优先级和预计烹饪时间协调准备工作，确保及时完成每道菜品' },
        { label: '错误减少', description: '通过清晰的界面和订单状态提示，可以减少订单处理过程中的错误' }
      ]
    },
    {
      id: 'hub', title: '外卖订单中心', moduleTitle: '外卖订单中心', summary: '集中管理所有来自不同平台的外卖订单，包括店内订单，提高了订单处理的效率和准确性',
      route: '/f&b-restaurant-delivery-integration', image: 'assets/images/ecosystem/ecosystem-delivery.webp',
      imageAlt: '外卖订单中心', ariaLabel: '外卖订单中心', depth: 1,
      legacyImages: ['APPZPOS-Pos-System-Singapore-Home-Order-Hub2.png', 'APPZPOS-Pos-System-Singapore-order-hub-mobile.png'],
      features: [
        { label: '统一管理', description: '集中管理所有来自不同平台的外卖订单，包括店内订单，提高了订单处理的效率和准确性' },
        { label: '合作平台', description: '目前已与GrabFood、Foodpanda和Deliveroo合作，将其集成到一个中心平台' },
        { label: '订单追踪', description: '实时追踪订单的状态和进度，包括新订单、修改和取消订单等' },
        { label: '实时更新', description: '通过订单中心，您可以统一管理不同平台的菜单，实时更新菜单详情和供应情况' },
        { label: '自动订单分配', description: '根据送货日期和时间，将订单自动分配到相应的厨房显示系统，确保及时完成' },
        { label: '送货信息显示', description: '在POS系统中显示来自每个送货平台的司机和客户联系信息，以便进行简单的沟通' },
        { label: '订单综合报告', description: '在一个POS系统中轻松管理所有送货、在线和实体店订单，并生成实时分析报告' }
      ]
    }
  ]
};

export const CHINESE_HOME_PAGE_CONFIG: HomePageTemplateConfig = {
  language: 'zh',
  hero: {
    headingId: 'cn-home-title',
    title: 'APPZPOS POS系统',
    titleAccent: '云端智能POS餐饮系统 高达50%政府津贴折扣',
    description: '专为餐饮业者设计的全方位餐饮系统，包括收银系统、销售报告分析、会员管理、库存管理、促销优惠，运营流程等',
    industryTabLabel: '按行业预览APPZPOS',
    industryHint: '选择行业，探索适合您的系统',
    industryStatusPrefix: '正在显示APPZPOS行业：',
    visual: {
      kind: 'product-showcase',
      hardwareImage: 'assets/images/appzpos-pos-terminal-hardware-only.png',
      hardwareAlt: 'APPZPOS触摸屏POS收银机与小票打印机',
      hardwareWidth: 1672,
      hardwareHeight: 941,
      brandImage: 'https://appzpos.com/admin/Upload/0771BB36-9631-40F2-A204-C60247E9F1E1/Images/APPZPOS-300X150px.png',
      industries: [
        {
          id: 'quick-service', label: '快餐服务', eyebrow: '餐饮 / 快餐服务',
          workspaceTitle: '柜台与取餐订单', screenImage: 'assets/images/appzpos-screen-quick-service.png',
          modules: ['POS收银系统', '网站点餐系统', '自助点餐机', 'KDS厨房系统', '排队叫号系统']
        },
        {
          id: 'restaurant', label: '餐厅', eyebrow: '餐饮 / 餐厅',
          workspaceTitle: '桌位与厨房订单', screenImage: 'assets/images/appzpos-screen-restaurant.png',
          modules: ['POS收银系统', '网站点餐系统', '扫码点餐系统', 'KDS厨房系统']
        },
        {
          id: 'retail', label: '零售', eyebrow: '零售',
          workspaceTitle: '商品与结账', screenImage: 'assets/images/appzpos-screen-retail.png',
          modules: ['POS收银系统', '网站点餐系统', '自助点餐机']
        },
        {
          id: 'salon', label: '美容美发', eyebrow: '美容 / 美发',
          workspaceTitle: '服务与顾客', screenImage: 'assets/images/appzpos-screen-salon.png',
          modules: ['POS收银系统', '网站点餐系统', '会员管理 (CRM)', '库存管理', '支付集成']
        }
      ]
    },
    ctas: [
      { kind: 'action', action: 'request-demo', label: '预约免费演示' },
      {
        kind: 'link', label: 'WhatsApp联系我们',
        href: "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!",
        target: '_blank', rel: 'noopener noreferrer'
      }
    ]
  },
  solutions: CHINESE_HOME_SOLUTIONS_CONFIG,
  storySections: [
    {
      id: 'cn-custom-pos',
      title: '客制化POS软件与硬件 餐车，档口，餐厅都适用',
      paragraphs: [
        'APPZPOS提供全面的餐厅管理系统，定制合适的软件和硬件配置，以满足各类餐饮的需求。除了基本的收银操作外，APPZPOS系统添加了许多餐厅管理附加功能，包括自动化订单处理、配送管理、库存管理、支付程序、员工管理、会员管理、促销活动管理、第三方平台集成，以及实时报告分析等，使您能够更轻松、更完善地经营餐厅。',
        '联系我们，探索适合您业务的POS解决方案。'
      ],
      image: 'APPZPOS-Pos-Point-of-Sales-System-Customized-Software-and-Hardware.png',
      imageAlt: 'APPZPOS-Pos-Point-of-Sales-System-Customized-Software-and-Hardware',
      imageWidth: 900,
      imageHeight: 760,
      imagePosition: 'right',
      cta: {
        kind: 'link', label: '联系我们',
        href: "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!",
        target: '_blank', rel: 'noopener', icon: 'whatsapp'
      }
    },
    {
      id: 'cn-unified-management',
      title: '统一管理POS餐饮系统 高效经营，实现最大化盈利',
      presentation: 'cards',
      bullets: [
        { label: '云端POS系统', text: '在一个POS系统中心集中管理，并通过互联网随时随地更新或查看', iconClass: 'bi-cloud-check' },
        { label: '实时报告分析', text: '记录了每笔交易的细节信息，包括销售额、产品类别、交易时间、支付方式等，并利用生成的实时报告数据进行分析', iconClass: 'bi-graph-up-arrow' },
        { label: '第三方整合', text: '与第三方平台合作（如外卖配送、支付、会计软件、商场平台等），在我们的POS系统中直接处理与第三方平台相关的业务，例如接收在线订单、处理支付、安排配送等', iconClass: 'bi-diagram-3' },
        { label: '多店运营', text: '如果您正在扩张到更多的地点，您可以通过我们统一的POS系统，轻松管理多个分店的运营', iconClass: 'bi-buildings' }
      ]
    }
  ],
  grant: {
    title: '享受高达50%的政府津贴',
    secondaryTitle: '简单申请，轻松获得资金返还',
    paragraphs: [
      '符合条件的新加坡企业可为合格的APPZPOS数字化项目申请EDGE Grant支持。我们将协助您了解申请流程与所需资料！',
      '符合条件的新加坡企业可为合格的 APPZPOS 数字化项目申请 EDGE Grant 支持，具体资助比例视项目活动而定。'
    ],
    image: 'assets/images/smes-go-digital-lockup-vertical.png',
    imageAlt: 'IMDA预先批准方案，符合高达50%企业津贴支持资格',
    imageWidth: 1273,
    imageHeight: 1251,
    cta: { kind: 'link', href: 'psg-pos-system-grant-singapore', label: '了解更多' }
  },
  features: {
    title: 'APPZPOS的优势',
    items: [
      { id: 'cn-crm', title: '会员管理系统', icon: 'APPZPOS-Point-of-Sale-Software-Customer-Relationship-Management.png', iconAlt: 'APPZPOS-Point-of-Sale-Software-Customer-Relationship-Management', points: ['收集客户信息，根据客户的购买历史和偏好，提供个性化的服务和推荐', '可设置不同的客户层级，并提供相应的奖励或优惠，如积分、优惠券等'] },
      { id: 'cn-support', title: '新加坡本地服务', icon: 'APPZPOS-Best-Point-of-Sale-System-Local-Based-Support.png', iconAlt: 'APPZPOS-Best-Point-of-Sale-System-Local-Based-Support', points: ['新加坡本地开发人员和技术支持团队，免费上门安装，快速响应您的请求，提供及时帮助', '支持客户在业务扩展过程中开设新的分店，利用统一的POS系统轻松管理多个门店'] },
      { id: 'cn-inventory', title: '库存管理系统', icon: 'APPZPOS-Best-Point-of-Sale-System-Payment-Integration.png', iconAlt: 'APPZPOS-Best-Point-of-Sale-System-Payment-Integration', points: ['实时跟踪菜单库存，确保及时补货和避免缺货情况，提高库存管理的效率', '设定库存警报，在库存量低于设定值时发送通知，以便及时采取必要行动'] },
      { id: 'cn-payment', title: '安全支付程序', icon: 'APPZPOS-Best-Point-of-Sale-System-Inventory-Management.png', iconAlt: 'APPZPOS-Best-Point-of-Sale-System-Inventory-Management', points: ['提供多种安全支付选项，包括在线支付、刷卡支付等，确保客户支付安全', '目前与多个可信支付终端平台合作集成，降低支付风险（Nets，Kpay，Stripe，Fomopay等）'] },
      { id: 'cn-delivery', title: '配送管理系统', icon: 'APPZPOS-Point-of-Sale-Software-Delivery-Management.png', iconAlt: 'APPZPOS-Point-of-Sale-Software-Delivery-Management', points: ['自动化配送管理，与Grabexpress，PandaGo和Lalamove合作集成，实时跟踪配送状态', '同时与GrabFood、Foodpanda和Deliveroo合作集成，将所有外卖订单集中到一个POS系统'] },
      { id: 'cn-security', title: '客户信息安全', icon: 'APPZPOS-Point-of-Sale-Software-Data-Security.png', iconAlt: 'APPZPOS-Point-of-Sale-Software-Data-Security', points: ['ISO27001认证，符合法律法规要求，维护客户的一切信息安全', '由CREST认可的VAPT认证，透过专业的评估与测试以确保系统的安全性和完整性'] }
    ]
  },
  proof: {
    customersTitle: '我们的客户',
    showAllLabel: '查看全部',
    closeDialogLabel: '关闭客户标志',
    customers: ENGLISH_HOME_PROOF_CONFIG.customers,
    testimonials: []
  },
  conversion: { locale: 'zh', sectionId: 'requestdemo' },
  floatingContacts: [
    {
      href: "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!",
      image: imageBase + 'APPZPOS Point of Sales WhatsApp Us.png',
      imageAlt: 'APPZPOS Point of Sales WhatsApp Us', target: '_blank', rel: 'noopener'
    },
    {
      href: "http://m.me/APPZPOS?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!",
      image: imageBase + 'APPZPOS Point of Sales Messenger Us.png',
      imageAlt: 'APPZPOS Point of Sales Messenger Us', target: '_blank', rel: 'noopener'
    }
  ]
};
