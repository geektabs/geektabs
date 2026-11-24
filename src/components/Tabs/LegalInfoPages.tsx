import React, { useState } from 'react';
import { ShieldCheck, FileText, Info, Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react';

export type LegalPageType = 'privacy' | 'terms' | 'about' | 'contact';

interface LegalInfoPagesProps {
  page: LegalPageType;
  onNavigate: (tab: string) => void;
  language?: string;
}

interface LegalBundle {
  backToHome: string;
  navAria: string;
  tabs: { about: string; privacy: string; terms: string; contact: string };
  privacy: {
    eyebrow: string;
    title: string;
    updated: string;
    s1Title: string;
    s1p1Prefix: string;
    s1p1Suffix: string;
    s1p2: string;
    s2Title: string;
    s2p1: string;
    s3Title: string;
    s3p1: string;
    s3p2Start: string;
    s3p2AdsSettings: string;
    s3p2Mid: string;
    s3p2AboutAds: string;
    s3p2End: string;
    s4Title: string;
    s4p1Start: string;
    s4p1Link: string;
    s4p1End: string;
  };
  terms: {
    eyebrow: string;
    title: string;
    updated: string;
    s1Title: string;
    s1p1Start: string;
    s1p1Link: string;
    s1p1End: string;
    s2Title: string;
    s2p1: string;
    s2p2: string;
    s3Title: string;
    s3p1: string;
    s4Title: string;
    s4p1: string;
  };
  about: {
    eyebrow: string;
    title: string;
    subtitle: string;
    missionTitle: string;
    missionBody: string;
    toolsTitle: string;
    cards: Array<{ title: string; body: string }>;
    privacyTitle: string;
    privacyBody: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    supportEmailTitle: string;
    supportEmailDesc: string;
    responseTimeTitle: string;
    responseTimeDesc: string;
    submittedTitle: string;
    submittedBodyStart: string;
    submittedBodyEnd: string;
    openEmailBtn: string;
    sendAnotherBtn: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    topicLabel: string;
    topics: string[];
    messageLabel: string;
    messagePlaceholder: string;
    sendBtn: string;
  };
}

const EN_BUNDLE: LegalBundle = {
  backToHome: 'Back to Home',
  navAria: 'Information pages',
  tabs: {
    about: 'About',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    contact: 'Contact',
  },
  privacy: {
    eyebrow: 'Privacy & Data Protection',
    title: 'Privacy Policy',
    updated: 'Last Updated: November 23, 2026',
    s1Title: '1. Information Stored Locally on Your Device',
    s1p1Prefix:
      'GeekTabs is built with a privacy-first architecture. Personal productivity items you create—including bookmarks, calendar events and reminders, notes, to-do lists, theme colors, custom wallpapers, and language preferences—are stored locally in your web browser via ',
    s1p1Suffix: ' and IndexedDB.',
    s1p2: 'GeekTabs does not require account registration to use core dashboard features and does not sell your personal productivity entries to third parties. You may export, back up, or delete your local workspace data at any time from Settings.',
    s2Title: '2. External Utilities & Network Requests',
    s2p1: 'Certain optional tools retrieve live public information on demand: weather forecasts query meteorological endpoints using your chosen city or coordinates; currency conversion fetches live foreign exchange quotes; the IP address lookup displays network routing metadata; and the broadband speed test measures throughput and latency against edge test servers.',
    s3Title: '3. Advertising, Cookies, and Google AdSense',
    s3p1: "GeekTabs may display advertisements served by third-party vendors, including Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites on the internet.",
    s3p2Start:
      "Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to GeekTabs and/or other sites across the web. Users may opt out of personalized advertising by visiting ",
    s3p2AdsSettings: 'Google Ads Settings',
    s3p2Mid: ' or opt out of third-party vendor cookie use for personalized advertising by visiting ',
    s3p2AboutAds: 'aboutads.info',
    s3p2End: '.',
    s4Title: '4. Your Privacy Rights & Contact',
    s4p1Start:
      'Depending on your region (including the EEA/UK under GDPR and California under CCPA/CPRA), you have the right to know what data is processed, clear local browser storage, manage cookie preferences in your browser, or contact us with privacy questions via our ',
    s4p1Link: 'Contact page',
    s4p1End: '.',
  },
  terms: {
    eyebrow: 'Service Agreement',
    title: 'Terms of Service',
    updated: 'Last Updated: November 23, 2026',
    s1Title: '1. Acceptance of Terms',
    s1p1Start: 'By accessing or using GeekTabs, you agree to be bound by these Terms of Service and our ',
    s1p1Link: 'Privacy Policy',
    s1p1End: '. If you do not agree with these terms, please discontinue use of the site.',
    s2Title: '2. Permitted Use & Productivity Tools',
    s2p1: 'GeekTabs provides web-based productivity utilities—including a customizable start dashboard, bookmarks manager, calendar, scientific and currency calculator, notes editor, task list, IP lookup, and speed test—for personal and lawful informational use.',
    s2p2: 'You agree not to misuse network diagnostic endpoints, automate abusive traffic, attempt unauthorized access, or interfere with the normal operation of the platform.',
    s3Title: '3. Local Data & Backup Responsibility',
    s3p1: 'Because notes, bookmarks, calendar items, tasks, and custom settings are stored locally inside your browser storage, clearing site data or switching browsers can remove unsaved local records. We strongly recommend exporting periodic backups using the Data Backup & Restore feature in Settings.',
    s4Title: '4. Third-Party Links & Disclaimers',
    s4p1: 'External websites accessible through bookmarks, search engines, or reference links are operated independently by third parties and governed by their own terms and policies. GeekTabs provides all tools and market/weather/network estimates on an "as-is" and "as-available" basis without warranties of uninterrupted availability or financial accuracy.',
  },
  about: {
    eyebrow: 'About Our Platform',
    title: 'About GeekTabs',
    subtitle: 'Your everyday space for useful websites, focus tools, and productivity.',
    missionTitle: 'Our Mission',
    missionBody:
      'GeekTabs was created to transform the everyday browser start page into a calm, aesthetic, and genuinely useful productivity workspace. Instead of scattering bookmarks, weather checks, quick calculations, notes, and network diagnostics across dozens of disconnected tabs, GeekTabs brings them together in one distraction-free interface.',
    toolsTitle: 'Core Tools Included',
    cards: [
      {
        title: 'Home Dashboard & Weather',
        body: 'Personalized greeting, precision clock, integrated multi-engine search, live local weather forecast, and Daily Digest inspiration cards.',
      },
      {
        title: 'Bookmarks & Quick Links',
        body: 'Categorized visual bookmarks with instant access to everyday AI tools, office suites, entertainment, and custom personal shortcuts.',
      },
      {
        title: 'Calendar & Holidays',
        body: 'Interactive monthly planner supporting personal events, reminders, and multi-region public holiday tracking.',
      },
      {
        title: 'Calculator, IP & Speed Diagnostics',
        body: 'Standard and scientific math, live currency conversion, public IPv4/IPv6 network inspection, and real-time broadband speed benchmarking.',
      },
    ],
    privacyTitle: 'Privacy-First & Multi-Language Support',
    privacyBody:
      'With 23 supported languages, customizable light/dark/glass card themes, 1920×1080 wallpaper presets, and built-in data backup/restore, GeekTabs adapts cleanly to desktop and mobile workflows while keeping personal workspace entries in your own browser.',
  },
  contact: {
    eyebrow: 'Get In Touch',
    title: 'Contact Us',
    subtitle: "Questions, feedback, bug reports, or privacy requests? We'd love to hear from you.",
    supportEmailTitle: 'Direct Support Email',
    supportEmailDesc: 'For general inquiries, technical assistance, and privacy or legal notices:',
    responseTimeTitle: 'Typical Response Time',
    responseTimeDesc: 'We review messages Monday through Friday and aim to respond within 1–2 business days.',
    submittedTitle: 'Message Prepared',
    submittedBodyStart: 'Thank you for reaching out to GeekTabs. Your message has been formatted—click below to send it directly via your email app, or email ',
    submittedBodyEnd: '.',
    openEmailBtn: 'Open in Email App',
    sendAnotherBtn: 'Send Another Message',
    nameLabel: 'Your Name',
    namePlaceholder: 'Alex Morgan',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@example.com',
    topicLabel: 'Topic',
    topics: ['General Inquiry', 'Feature Suggestion', 'Bug Report', 'Privacy & Legal', 'Advertising & Partnerships'],
    messageLabel: 'Message',
    messagePlaceholder: 'How can we help?',
    sendBtn: 'Send Message',
  },
};

const LEGAL_TRANSLATIONS: Record<string, LegalBundle> = {
  English: EN_BUNDLE,
  Chinese: {
    backToHome: '返回首页',
    navAria: '信息页面',
    tabs: { about: '关于我们', privacy: '隐私政策', terms: '服务条款', contact: '联系我们' },
    privacy: {
      eyebrow: '隐私与数据保护',
      title: '隐私政策',
      updated: '最后更新：2026年11月23日',
      s1Title: '1. 存储在您设备本地的信息',
      s1p1Prefix: 'GeekTabs 采用隐私优先架构设计。您创建的个人效率数据——包括书签、日历活动与提醒、笔记、待办清单、主题配色、自定义壁纸与语言偏好——均通过 ',
      s1p1Suffix: ' 与 IndexedDB 存储在您的本地浏览器中。',
      s1p2: '使用核心仪表盘功能无需注册账号，GeekTabs 也不会向任何第三方出售您的个人工作区记录。您可以随时前往“设置”导出、备份或清除本地数据。',
      s2Title: '2. 外部工具与网络请求',
      s2p1: '部分可选工具会按需获取实时公开信息：天气预报根据您选择的城市或坐标请求气象接口；汇率换算获取实时外汇报价；IP 地址查询展示网络路由元数据；宽带测速则向边缘测试服务器测量吞吐与延迟。',
      s3Title: '3. 广告、Cookie 与 Google AdSense',
      s3p1: 'GeekTabs 可能会展示由 Google AdSense 等第三方广告服务商提供的广告。包括 Google 在内的第三方供应商会使用 Cookie，根据用户此前访问本站或其他网站的记录来展示相关广告。',
      s3p2Start: 'Google 使用广告 Cookie 使其及合作伙伴能够根据用户对 GeekTabs 及互联网上其他网站的访问情况投放广告。您可前往 ',
      s3p2AdsSettings: 'Google 广告设置',
      s3p2Mid: ' 选择退出个性化广告，或访问 ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: ' 选择停用第三方供应商的个性化广告 Cookie。',
      s4Title: '4. 您的隐私权利与联系方式',
      s4p1Start: '根据您所在地区的适用法律（包括欧洲经济区/英国 GDPR 及加州 CCPA/CPRA），您有权了解所处理的数据、清除浏览器本地存储、在浏览器中管理 Cookie 偏好，或通过我们的',
      s4p1Link: '联系页面',
      s4p1End: '咨询隐私相关问题。',
    },
    terms: {
      eyebrow: '服务协议',
      title: '服务条款',
      updated: '最后更新：2026年11月23日',
      s1Title: '1. 条款接受',
      s1p1Start: '访问或使用 GeekTabs 即表示您同意受本服务条款及我们的',
      s1p1Link: '隐私政策',
      s1p1End: '约束。如果您不同意这些条款，请停止使用本网站。',
      s2Title: '2. 允许的使用方式与效率工具',
      s2p1: 'GeekTabs 提供网页端效率工具——包括可定制启动仪表盘、书签管理器、日历、科学及汇率计算器、富文本笔记、待办清单、IP 查询与网络测速——供个人合法与信息参考使用。',
      s2p2: '您同意不滥用网络诊断接口、不发起自动化恶意流量、不尝试未授权访问或干扰平台正常运行。',
      s3Title: '3. 本地数据与备份责任',
      s3p1: '由于笔记、书签、日历日程、待办事项与自定义设置均存储在浏览器本地存储空间中，清理网站数据或更换浏览器可能导致未导出记录丢失。我们强烈建议定期使用“设置”中的“数据备份与恢复”功能导出备份。',
      s4Title: '4. 第三方链接与免责声明',
      s4p1: '通过书签、搜索引擎或参考链接访问的外部网站均由第三方独立运营，受其各自条款与政策约束。GeekTabs 按“现状”与“可用性”提供所有工具及市场/天气/网络参考数据，不对不间断可用性或金融精确性作任何保证。',
    },
    about: {
      eyebrow: '关于平台',
      title: '关于 GeekTabs',
      subtitle: '您的日常精选网站、专注工具与高效率工作空间。',
      missionTitle: '我们的使命',
      missionBody: 'GeekTabs 致力于将每天打开的浏览器起始页转变为宁静、美观且真正实用的效率空间。不必再在几十个零散标签页之间切换书签、天气、计算器、笔记和网络检测工具，GeekTabs 将它们优雅整合于一处无干扰界面之中。',
      toolsTitle: '内置核心工具',
      cards: [
        { title: '主页仪表盘与实时天气', body: '个性化问候语、精密时钟、多引擎聚合搜索、当地实时天气预报与每日精选灵感卡片。' },
        { title: '书签与快速导航', body: '分类清晰的视觉书签，一键直达常用 AI 工具、办公套件、影音娱乐与个人快捷链接。' },
        { title: '日历与多国节假日', body: '支持个人日程、定时提醒与多国家地区法定节假日同步追踪的交互式月历。' },
        { title: '计算器、IP 与网速诊断', body: '标准与科学计算、实时汇率换算、公网 IPv4/IPv6 网络信息检查及实时宽带速度评测。' },
      ],
      privacyTitle: '隐私优先与 23 种语言支持',
      privacyBody: '支持 23 种语言、浅色/深色/玻璃质感卡片主题、1920×1080 高清壁纸预设以及内置数据备份恢复，GeekTabs 在桌面与移动端均能流畅适配，同时将个人数据安心留在您自己的浏览器中。',
    },
    contact: {
      eyebrow: '联系我们',
      title: '联系我们',
      subtitle: '有功能建议、问题反馈或隐私咨询？欢迎随时与我们联系。',
      supportEmailTitle: '支持邮箱',
      supportEmailDesc: '适用于一般咨询、技术支持以及隐私或法律相关通知：',
      responseTimeTitle: '通常响应时间',
      responseTimeDesc: '我们周一至周五查收邮件，并力争在 1–2 个工作日内回复。',
      submittedTitle: '邮件内容已就绪',
      submittedBodyStart: '感谢您联系 GeekTabs。您的留言已整理完毕——点击下方按钮即可在邮件客户端直接发送，或手动发送邮件至 ',
      submittedBodyEnd: '。',
      openEmailBtn: '在邮件应用中打开',
      sendAnotherBtn: '再发送一条消息',
      nameLabel: '您的称呼',
      namePlaceholder: '张明',
      emailLabel: '电子邮箱',
      emailPlaceholder: 'you@example.com',
      topicLabel: '咨询主题',
      topics: ['一般咨询', '功能建议', '问题反馈', '隐私与法律', '广告与合作'],
      messageLabel: '留言内容',
      messagePlaceholder: '请问有什么可以帮您？',
      sendBtn: '发送消息',
    },
  },
  'Chinese Traditional': {
    backToHome: '返回首頁',
    navAria: '資訊頁面',
    tabs: { about: '關於我們', privacy: '隱私權政策', terms: '服務條款', contact: '聯絡我們' },
    privacy: {
      eyebrow: '隱私與資料保護',
      title: '隱私權政策',
      updated: '最後更新：2026年11月23日',
      s1Title: '1. 儲存於您裝置本機的資訊',
      s1p1Prefix: 'GeekTabs 採用隱私優先架構。您建立的個人生產力項目——包含書籤、行事曆活動與提醒、筆記、待辦清單、主題色彩、自訂桌布與語言偏好——皆透過 ',
      s1p1Suffix: ' 與 IndexedDB 儲存於您的瀏覽器本機空間。',
      s1p2: '使用核心儀表板功能無需註冊帳號，GeekTabs 亦不會將您的個人資料販售予任何第三方。您隨時可於「設定」匯出、備份或清除本機工作區資料。',
      s2Title: '2. 外部工具與網路請求',
      s2p1: '部分選用工具會依需求擷取即時公開資訊：天氣預報依您選擇的城市或座標查詢氣象端點；匯率換算擷取即時外匯報價；IP 位址查詢顯示網路路由中繼資訊；寬頻測速則針對邊緣測試伺服器量測頻寬與延遲。',
      s3Title: '3. 廣告、Cookie 與 Google AdSense',
      s3p1: 'GeekTabs 可能會顯示由 Google AdSense 等第三方廠商提供的廣告。包含 Google 在內的第三方廠商會使用 Cookie，依據使用者先前造訪本網站或網路上其他網站的紀錄放送廣告。',
      s3p2Start: 'Google 使用廣告 Cookie 讓其及合作夥伴能依據使用者造訪 GeekTabs 及其他網站的紀錄顯示廣告。您可前往 ',
      s3p2AdsSettings: 'Google 廣告設定',
      s3p2Mid: ' 停用個人化廣告，或造訪 ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: ' 停用第三方廠商用於個人化廣告的 Cookie。',
      s4Title: '4. 您的隱私權與聯絡方式',
      s4p1Start: '依據您所在地區之法律（包含歐洲經濟區/英國 GDPR 及加州 CCPA/CPRA），您有權了解資料處理方式、清除瀏覽器本機儲存空間、在瀏覽器中管理 Cookie 偏好，或透過我們的',
      s4p1Link: '聯絡頁面',
      s4p1End: '提出隱私相關疑問。',
    },
    terms: {
      eyebrow: '服務協議',
      title: '服務條款',
      updated: '最後更新：2026年11月23日',
      s1Title: '1. 條款接受',
      s1p1Start: '存取或使用 GeekTabs 即表示您同意受本服務條款與我們的',
      s1p1Link: '隱私權政策',
      s1p1End: '約束。若您不同意相關條款，請停止使用本網站。',
      s2Title: '2. 允許使用範圍與生產力工具',
      s2p1: 'GeekTabs 提供網頁端生產力工具——包含可自訂啟動儀表板、書籤管理員、行事曆、科學與匯率計算機、筆記編輯器、待辦清單、IP 查詢與網速測試——僅供個人合法與資訊參考使用。',
      s2p2: '您同意不濫用網路診斷端點、不發動自動化惡意流量、不嘗試未經授權存取或干擾平台正常運作。',
      s3Title: '3. 本機資料與備份責任',
      s3p1: '由於筆記、書籤、行事曆項目、待辦事項與自訂設定皆儲存於瀏覽器本機空間，清除網站資料或更換瀏覽器可能會移除未匯出的本機紀錄。強烈建議定期使用「設定」中的資料備份與還原功能匯出備份。',
      s4Title: '4. 第三方連結與免責聲明',
      s4p1: '透過書籤、搜尋引擎或參考連結前往之外部網站由第三方獨立營運，並受其各自條款與政策規範。GeekTabs 依「現狀」及「現有」基礎提供所有工具及市場/天氣/網路參考估算，不保證不中斷可用性或金融精確度。',
    },
    about: {
      eyebrow: '關於平台',
      title: '關於 GeekTabs',
      subtitle: '您的日常實用網站、專注工具與高效率工作空間。',
      missionTitle: '我們的使命',
      missionBody: 'GeekTabs 致力於將每天打開的瀏覽器起始頁轉化為寧靜、美觀且真正實用的生產力空間。無須再在數十個零散分頁間切換書籤、天氣、計算機、筆記與網路檢測工具，GeekTabs 將它們整齊匯聚於零干擾的單一介面中。',
      toolsTitle: '內建核心工具',
      cards: [
        { title: '首頁儀表板與即時天氣', body: '個人化問候語、精準時鐘、多引擎整合搜尋、當地即時天氣預報與每日精選靈感卡片。' },
        { title: '書籤與快速連結', body: '分類清晰的可視化書籤，一鍵存取日常 AI 工具、辦公套件、娛樂影音與個人捷徑。' },
        { title: '行事曆與國定假日', body: '支援個人活動、定時提醒與多國家地區國定假日同步追蹤的互動式月曆。' },
        { title: '計算機、IP 與網速診斷', body: '標準與科學計算、即時匯率換算、公網 IPv4/IPv6 網路檢視與即時寬頻速度測試。' },
      ],
      privacyTitle: '隱私優先與多語系支援',
      privacyBody: '支援 23 種語言、淺色/深色/玻璃質感卡片主題、1920×1080 桌布預設與內建資料備份/還原，GeekTabs 能流暢適配桌面與行動裝置工作流程，同時將個人資料安心留存於您自己的瀏覽器內。',
    },
    contact: {
      eyebrow: '聯絡我們',
      title: '聯絡我們',
      subtitle: '有任何問題、建議、錯誤回報或隱私需求？歡迎隨時與我們聯繫。',
      supportEmailTitle: '直接支援信箱',
      supportEmailDesc: '適用於一般諮詢、技術協助以及隱私或法律通知：',
      responseTimeTitle: '一般回覆時間',
      responseTimeDesc: '我們於週一至週五審閱訊息，並致力於 1–2 個工作天內回覆。',
      submittedTitle: '訊息已準備完成',
      submittedBodyStart: '感謝您聯絡 GeekTabs。您的訊息已完成格式化——點擊下方即可透過郵件應用程式直接寄出，或寄信至 ',
      submittedBodyEnd: '。',
      openEmailBtn: '於郵件應用程式中開啟',
      sendAnotherBtn: '再傳送一則訊息',
      nameLabel: '您的姓名',
      namePlaceholder: '王小明',
      emailLabel: '電子郵件地址',
      emailPlaceholder: 'you@example.com',
      topicLabel: '主旨類別',
      topics: ['一般諮詢', '功能建議', '錯誤回報', '隱私與法律', '廣告與合作'],
      messageLabel: '訊息內容',
      messagePlaceholder: '我們能為您提供什麼協助？',
      sendBtn: '傳送訊息',
    },
  },
  Spanish: {
    backToHome: 'Volver al inicio',
    navAria: 'Páginas de información',
    tabs: { about: 'Acerca de', privacy: 'Política de privacidad', terms: 'Términos de servicio', contact: 'Contacto' },
    privacy: {
      eyebrow: 'Privacidad y protección de datos',
      title: 'Política de privacidad',
      updated: 'Última actualización: 23 de noviembre de 2026',
      s1Title: '1. Información almacenada localmente en tu dispositivo',
      s1p1Prefix: 'GeekTabs está diseñado con una arquitectura centrada en la privacidad. Los elementos personales que creas —marcadores, eventos y recordatorios, notas, listas de tareas, colores de tema, fondos personalizados e idioma— se guardan localmente en tu navegador mediante ',
      s1p1Suffix: ' e IndexedDB.',
      s1p2: 'GeekTabs no requiere registro de cuenta para usar las funciones principales del panel ni vende tus datos personales a terceros. Puedes exportar, respaldar o eliminar tus datos locales en cualquier momento desde Ajustes.',
      s2Title: '2. Utilidades externas y solicitudes de red',
      s2p1: 'Algunas herramientas opcionales obtienen información pública en directo bajo demanda: el clima consulta puntos meteorológicos según tu ciudad o coordenadas; el conversor de divisas obtiene cotizaciones cambiarias; la consulta de IP muestra metadatos de red; y el test de velocidad mide rendimiento y latencia frente a servidores de prueba.',
      s3Title: '3. Publicidad, cookies y Google AdSense',
      s3p1: 'GeekTabs puede mostrar anuncios servidos por proveedores externos, incluido Google AdSense. Estos proveedores utilizan cookies para mostrar anuncios basados en visitas anteriores del usuario a este u otros sitios web.',
      s3p2Start: 'El uso de cookies publicitarias por parte de Google permite mostrar anuncios según las visitas a GeekTabs y otros sitios web. Puedes inhabilitar la publicidad personalizada visitando ',
      s3p2AdsSettings: 'Configuración de anuncios de Google',
      s3p2Mid: ' o gestionar cookies de terceros visitando ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '.',
      s4Title: '4. Tus derechos de privacidad y contacto',
      s4p1Start: 'Según tu región (incluidos el EEE/Reino Unido bajo el RGPD y California bajo CCPA/CPRA), tienes derecho a conocer qué datos se procesan, borrar el almacenamiento local, gestionar cookies en tu navegador o escribirnos a través de nuestra ',
      s4p1Link: 'página de Contacto',
      s4p1End: '.',
    },
    terms: {
      eyebrow: 'Acuerdo de servicio',
      title: 'Términos de servicio',
      updated: 'Última actualización: 23 de noviembre de 2026',
      s1Title: '1. Aceptación de los términos',
      s1p1Start: 'Al acceder o utilizar GeekTabs, aceptas quedar sujeto a estos Términos de servicio y a nuestra ',
      s1p1Link: 'Política de privacidad',
      s1p1End: '. Si no estás de acuerdo, deja de utilizar el sitio.',
      s2Title: '2. Uso permitido y herramientas de productividad',
      s2p1: 'GeekTabs ofrece utilidades web de productividad —panel inicial personalizable, marcadores, calendario, calculadora científica y de divisas, notas, tareas, consulta IP y test de velocidad— para uso personal e informativo lícito.',
      s2p2: 'Aceptas no hacer un uso indebido de los puntos de diagnóstico de red, no generar tráfico automatizado abusivo, no intentar accesos no autorizados ni interferir en el funcionamiento de la plataforma.',
      s3Title: '3. Datos locales y responsabilidad de respaldo',
      s3p1: 'Dado que notas, marcadores, eventos, tareas y ajustes se almacenan localmente en tu navegador, borrar los datos del sitio o cambiar de navegador puede eliminar registros no guardados. Recomendamos exportar copias periódicas desde Copia de seguridad y restauración en Ajustes.',
      s4Title: '4. Enlaces de terceros y exención de garantías',
      s4p1: 'Los sitios externos accesibles mediante marcadores o búsquedas son operados por terceros independientes bajo sus propias políticas. GeekTabs ofrece todas las herramientas y estimaciones de mercado, clima y red «tal cual» y «según disponibilidad», sin garantías de disponibilidad continua ni exactitud financiera.',
    },
    about: {
      eyebrow: 'Sobre nuestra plataforma',
      title: 'Acerca de GeekTabs',
      subtitle: 'Tu espacio diario para sitios útiles, herramientas de enfoque y productividad.',
      missionTitle: 'Nuestra misión',
      missionBody: 'GeekTabs nació para convertir la página de inicio del navegador en un espacio de productividad sereno, estético y útil. En lugar de dispersar marcadores, clima, cálculos, notas y diagnósticos de red en decenas de pestañas, los reúne en una sola interfaz sin distracciones.',
      toolsTitle: 'Herramientas principales incluidas',
      cards: [
        { title: 'Panel inicial y Clima', body: 'Saludo personalizado, reloj preciso, búsqueda integrada multimotor, clima local en vivo y tarjetas de Resumen Diario.' },
        { title: 'Marcadores y accesos rápidos', body: 'Marcadores visuales categorizados con acceso inmediato a IA, suites de oficina, entretenimiento y enlaces personales.' },
        { title: 'Calendario y festivos', body: 'Planificador mensual interactivo para eventos, recordatorios y festivos oficiales de múltiples países.' },
        { title: 'Calculadora, IP y Velocidad', body: 'Cálculo estándar y científico, cambio de divisas en vivo, inspección IPv4/IPv6 y prueba de banda ancha en tiempo real.' },
      ],
      privacyTitle: 'Privacidad primero y soporte en 23 idiomas',
      privacyBody: 'Con 23 idiomas compatibles, temas claro/oscuro/cristal, fondos 1920×1080 y copia de seguridad integrada, GeekTabs se adapta perfectamente a escritorio y móvil manteniendo tus datos en tu propio navegador.',
    },
    contact: {
      eyebrow: 'Ponte en contacto',
      title: 'Contáctanos',
      subtitle: '¿Preguntas, sugerencias, reportes de errores o consultas de privacidad? Nos encantará leerte.',
      supportEmailTitle: 'Correo de soporte directo',
      supportEmailDesc: 'Para consultas generales, asistencia técnica y avisos legales o de privacidad:',
      responseTimeTitle: 'Tiempo habitual de respuesta',
      responseTimeDesc: 'Revisamos los mensajes de lunes a viernes y procuramos responder en 1–2 días hábiles.',
      submittedTitle: 'Mensaje preparado',
      submittedBodyStart: 'Gracias por escribir a GeekTabs. Tu mensaje está listo: haz clic abajo para enviarlo desde tu aplicación de correo o escribe a ',
      submittedBodyEnd: '.',
      openEmailBtn: 'Abrir en app de correo',
      sendAnotherBtn: 'Enviar otro mensaje',
      nameLabel: 'Tu nombre',
      namePlaceholder: 'Alex Morgan',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'tu@ejemplo.com',
      topicLabel: 'Tema',
      topics: ['Consulta general', 'Sugerencia de función', 'Reporte de error', 'Privacidad y legal', 'Publicidad y alianzas'],
      messageLabel: 'Mensaje',
      messagePlaceholder: '¿En qué podemos ayudarte?',
      sendBtn: 'Enviar mensaje',
    },
  },
  French: {
    backToHome: "Retour à l'accueil",
    navAria: "Pages d'information",
    tabs: { about: 'À propos', privacy: 'Confidentialité', terms: 'Conditions', contact: 'Contact' },
    privacy: {
      eyebrow: 'Confidentialité et protection des données',
      title: 'Politique de confidentialité',
      updated: 'Dernière mise à jour : 23 novembre 2026',
      s1Title: '1. Informations stockées localement sur votre appareil',
      s1p1Prefix: 'GeekTabs repose sur une architecture respectueuse de la vie privée. Vos éléments personnels — favoris, événements et rappels, notes, tâches, thèmes, fonds d’écran et langue — sont stockés localement dans votre navigateur via ',
      s1p1Suffix: ' et IndexedDB.',
      s1p2: 'Aucune création de compte n’est requise pour utiliser les fonctionnalités principales et GeekTabs ne revend jamais vos données personnelles à des tiers. Vous pouvez exporter ou effacer vos données locales à tout moment depuis les Paramètres.',
      s2Title: '2. Outils externes et requêtes réseau',
      s2p1: 'Certains outils optionnels récupèrent des données publiques à la demande : la météo interroge des services météorologiques selon votre ville ; le convertisseur obtient les taux de change en direct ; l’outil IP affiche les métadonnées réseau ; et le test de débit mesure la vitesse vers des serveurs dédiés.',
      s3Title: '3. Publicité, cookies et Google AdSense',
      s3p1: 'GeekTabs peut afficher des annonces diffusées par des partenaires tiers, notamment Google AdSense. Ces fournisseurs utilisent des cookies afin de proposer des annonces basées sur les visites précédentes sur ce site ou d’autres sites.',
      s3p2Start: 'L’utilisation de cookies publicitaires par Google permet de diffuser des annonces pertinentes. Vous pouvez désactiver la publicité personnalisée via ',
      s3p2AdsSettings: 'Paramètres des annonces Google',
      s3p2Mid: ' ou gérer les cookies tiers sur ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '.',
      s4Title: '4. Vos droits et contact',
      s4p1Start: 'Selon votre juridiction (y compris l’EEE/Royaume-Uni via le RGPD et la Californie via le CCPA/CPRA), vous disposez de droits d’information, d’effacement local et de gestion des cookies, ou pouvez nous écrire via notre ',
      s4p1Link: 'page Contact',
      s4p1End: '.',
    },
    terms: {
      eyebrow: 'Conditions du service',
      title: "Conditions d'utilisation",
      updated: 'Dernière mise à jour : 23 novembre 2026',
      s1Title: '1. Acceptation des conditions',
      s1p1Start: "En accédant à GeekTabs ou en l'utilisant, vous acceptez ces Conditions d'utilisation et notre ",
      s1p1Link: 'Politique de confidentialité',
      s1p1End: '. Si vous n’acceptez pas ces conditions, veuillez cesser d’utiliser le site.',
      s2Title: '2. Utilisation autorisée et outils',
      s2p1: 'GeekTabs propose des outils web de productivité — tableau de bord, favoris, calendrier, calculatrice scientifique et devises, notes, tâches, diagnostic IP et test de débit — pour un usage personnel, licite et informatif.',
      s2p2: 'Vous vous engagez à ne pas détourner les points de diagnostic réseau, automatiser un trafic abusif, tenter d’accès non autorisé ou perturber le service.',
      s3Title: '3. Données locales et sauvegardes',
      s3p1: 'Vos notes, favoris, tâches et réglages étant stockés localement dans le navigateur, la suppression des données du site ou le changement de navigateur peut effacer vos éléments non sauvegardés. Exportez régulièrement vos données depuis Sauvegarde et restauration dans Paramètres.',
      s4Title: '4. Liens tiers et clause de non-garantie',
      s4p1: 'Les sites externes accessibles via les favoris ou moteurs de recherche sont gérés indépendamment par des tiers. GeekTabs fournit tous les outils et estimations « en l’état » sans garantie de disponibilité continue ni d’exactitude financière.',
    },
    about: {
      eyebrow: 'À propos de la plateforme',
      title: 'À propos de GeekTabs',
      subtitle: 'Votre espace quotidien pour vos sites utiles, outils de concentration et productivité.',
      missionTitle: 'Notre mission',
      missionBody: 'GeekTabs transforme la page d’accueil du navigateur en un espace de travail calme, esthétique et utile. Au lieu d’éparpiller favoris, météo, calculs, notes et diagnostics réseau dans des dizaines d’onglets, tout est réuni dans une interface claire.',
      toolsTitle: 'Outils principaux inclus',
      cards: [
        { title: 'Accueil et Météo', body: 'Message de bienvenue, horloge précise, recherche multi-moteurs, météo locale en direct et cartes Résumé du jour.' },
        { title: 'Favoris et liens rapides', body: 'Favoris visuels classés par catégories pour accéder en un clic à vos outils d’IA, suites bureautiques et liens personnels.' },
        { title: 'Calendrier et jours fériés', body: 'Agenda mensuel interactif gérant événements, rappels et jours fériés de plusieurs pays.' },
        { title: 'Calculatrice, IP et Débit', body: 'Calculs standard et scientifiques, taux de change en direct, analyse IPv4/IPv6 et test de vitesse haut débit.' },
      ],
      privacyTitle: 'Confidentialité et support multilingue',
      privacyBody: 'Avec 23 langues prises en charge, thèmes clair/sombre/verre, fonds d’écran 1920×1080 et sauvegarde intégrée, GeekTabs s’adapte au bureau comme au mobile tout en conservant vos données dans votre navigateur.',
    },
    contact: {
      eyebrow: 'Nous contacter',
      title: 'Contactez-nous',
      subtitle: 'Questions, retours, signalements de bugs ou demandes liées à la confidentialité ? Écrivez-nous.',
      supportEmailTitle: 'E-mail de support direct',
      supportEmailDesc: 'Pour toute question générale, assistance technique ou demande juridique / confidentialité :',
      responseTimeTitle: 'Délai de réponse habituel',
      responseTimeDesc: 'Nous traitons les messages du lundi au vendredi et visons une réponse sous 1 à 2 jours ouvrés.',
      submittedTitle: 'Message préparé',
      submittedBodyStart: 'Merci de contacter GeekTabs. Votre message est prêt : cliquez ci-dessous pour l’envoyer via votre messagerie, ou écrivez à ',
      submittedBodyEnd: '.',
      openEmailBtn: "Ouvrir dans l'app e-mail",
      sendAnotherBtn: 'Envoyer un autre message',
      nameLabel: 'Votre nom',
      namePlaceholder: 'Alex Morgan',
      emailLabel: 'Adresse e-mail',
      emailPlaceholder: 'vous@exemple.com',
      topicLabel: 'Sujet',
      topics: ['Question générale', 'Suggestion de fonctionnalité', 'Signalement de bug', 'Confidentialité et légal', 'Publicité et partenariats'],
      messageLabel: 'Message',
      messagePlaceholder: 'Comment pouvons-nous vous aider ?',
      sendBtn: 'Envoyer le message',
    },
  },
  German: {
    backToHome: 'Zurück zur Startseite',
    navAria: 'Informationsseiten',
    tabs: { about: 'Über uns', privacy: 'Datenschutz', terms: 'Nutzungsbedingungen', contact: 'Kontakt' },
    privacy: {
      eyebrow: 'Datenschutz & Datensicherheit',
      title: 'Datenschutzerklärung',
      updated: 'Zuletzt aktualisiert: 23. November 2026',
      s1Title: '1. Lokal auf Ihrem Gerät gespeicherte Informationen',
      s1p1Prefix: 'GeekTabs folgt einem Privacy-First-Prinzip. Ihre persönlichen Produktivitätsdaten — Lesezeichen, Termine und Erinnerungen, Notizen, Aufgabenlisten, Designfarben, eigene Hintergrundbilder und Spracheinstellungen — werden lokal im Browser über ',
      s1p1Suffix: ' und IndexedDB gespeichert.',
      s1p2: 'Für die Kernfunktionen ist keine Kontoregistrierung erforderlich, und GeekTabs verkauft keine persönlichen Daten an Dritte. Sie können Ihre lokalen Daten jederzeit in den Einstellungen exportieren, sichern oder löschen.',
      s2Title: '2. Externe Dienste & Netzwerkanfragen',
      s2p1: 'Einige optionale Werkzeuge rufen auf Abruf öffentliche Echtzeitdaten ab: Wettervorhersagen nutzen Ihren gewählten Ort; die Währungsumrechnung lädt aktuelle Wechselkurse; die IP-Abfrage zeigt Routing-Metadaten; und der Speedtest misst Durchsatz und Latenz gegen Testserver.',
      s3Title: '3. Werbung, Cookies und Google AdSense',
      s3p1: 'GeekTabs kann Anzeigen von Drittanbietern wie Google AdSense einblenden. Drittanbieter einschließlich Google verwenden Cookies, um Anzeigen basierend auf früheren Besuchen auf dieser oder anderen Websites auszuspielen.',
      s3p2Start: 'Die Verwendung von Werbe-Cookies durch Google ermöglicht personalisierte Anzeigen basierend auf Besuchen bei GeekTabs und anderen Websites. Sie können personalisierte Werbung in den ',
      s3p2AdsSettings: 'Google-Anzeigeneinstellungen',
      s3p2Mid: ' deaktivieren oder Drittanbieter-Cookies unter ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: ' verwalten.',
      s4Title: '4. Ihre Datenschutzrechte & Kontakt',
      s4p1Start: 'Je nach Region (einschließlich EWR/UK unter DSGVO und Kalifornien unter CCPA/CPRA) haben Sie Rechte auf Auskunft, Löschung lokaler Browserdaten, Cookie-Kontrolle sowie Kontaktaufnahme über unsere ',
      s4p1Link: 'Kontaktseite',
      s4p1End: '.',
    },
    terms: {
      eyebrow: 'Nutzungsvereinbarung',
      title: 'Nutzungsbedingungen',
      updated: 'Zuletzt aktualisiert: 23. November 2026',
      s1Title: '1. Annahme der Bedingungen',
      s1p1Start: 'Durch den Zugriff auf oder die Nutzung von GeekTabs erklären Sie sich mit diesen Nutzungsbedingungen und unserer ',
      s1p1Link: 'Datenschutzerklärung',
      s1p1End: ' einverstanden. Wenn Sie nicht zustimmen, beenden Sie bitte die Nutzung der Website.',
      s2Title: '2. Zulässige Nutzung & Werkzeuge',
      s2p1: 'GeekTabs stellt webbasierte Produktivitätswerkzeuge — anpassbares Start-Dashboard, Lesezeichen, Kalender, wissenschaftlichen und Währungsrechner, Notizen, Aufgabenliste, IP-Abfrage und Speedtest — zur persönlichen und rechtmäßigen Informationsnutzung bereit.',
      s2p2: 'Sie verpflichten sich, Diagnose-Endpunkte nicht zu missbrauchen, keinen automatisierten schädlichen Datenverkehr zu erzeugen und den Betrieb der Plattform nicht zu stören.',
      s3Title: '3. Lokale Daten & Sicherungspflicht',
      s3p1: 'Da Notizen, Lesezeichen, Kalenderdaten, Aufgaben und Einstellungen lokal im Browser gespeichert werden, kann das Löschen von Websitedaten ungesicherte Einträge entfernen. Wir empfehlen regelmäßige Backups über Datensicherung & Wiederherstellung in den Einstellungen.',
      s4Title: '4. Links Dritter & Haftungsausschluss',
      s4p1: 'Externe Websites, die über Lesezeichen oder Suchmaschinen aufgerufen werden, unterliegen eigenen Bedingungen der jeweiligen Betreiber. GeekTabs stellt alle Tools und Markt-/Wetter-/Netzwerkschätzungen ohne Gewähr für ununterbrochene Verfügbarkeit oder finanzielle Genauigkeit bereit.',
    },
    about: {
      eyebrow: 'Über unsere Plattform',
      title: 'Über GeekTabs',
      subtitle: 'Ihr täglicher Raum für nützliche Websites, Fokus-Tools und Produktivität.',
      missionTitle: 'Unsere Mission',
      missionBody: 'GeekTabs wurde geschaffen, um die alltägliche Browser-Startseite in einen ruhigen, ästhetischen und wirklich nützlichen Arbeitsbereich zu verwandeln — Lesezeichen, Wetter, Rechner, Notizen und Netzwerkdiagnose vereint in einer ablenkungsfreien Oberfläche.',
      toolsTitle: 'Enthaltene Kernfunktionen',
      cards: [
        { title: 'Start-Dashboard & Wetter', body: 'Persönliche Begrüßung, präzise Uhr, Multi-Engine-Suche, Live-Wettervorhersage und Tagesbriefing.' },
        { title: 'Lesezeichen & Schnelllinks', body: 'Kategorisierte visuelle Lesezeichen mit direktem Zugriff auf KI-Tools, Office-Apps und persönliche Links.' },
        { title: 'Kalender & Feiertage', body: 'Interaktiver Monatsplaner für eigene Termine, Erinnerungen und Feiertage mehrerer Länder.' },
        { title: 'Rechner, IP & Speedtest', body: 'Standard- und wissenschaftliches Rechnen, Live-Währungskurse, IPv4/IPv6-Analyse und Breitband-Speedtest.' },
      ],
      privacyTitle: 'Datenschutz zuerst & 23 Sprachen',
      privacyBody: 'Mit 23 unterstützten Sprachen, Hell-/Dunkel-/Glas-Designs, 1920×1080-Hintergrundbildern und integrierter Sicherungsfunktion passt sich GeekTabs nahtlos an Desktop und Mobilgeräte an.',
    },
    contact: {
      eyebrow: 'Kontakt aufnehmen',
      title: 'Kontakt',
      subtitle: 'Fragen, Feedback, Fehlerberichte oder Datenschutzanfragen? Wir freuen uns über Ihre Nachricht.',
      supportEmailTitle: 'Direkte Support-E-Mail',
      supportEmailDesc: 'Für allgemeine Anfragen, technische Hilfe sowie Datenschutz- oder Rechtshinweise:',
      responseTimeTitle: 'Übliche Antwortzeit',
      responseTimeDesc: 'Wir prüfen Nachrichten von Montag bis Freitag und antworten in der Regel innerhalb von 1–2 Werktagen.',
      submittedTitle: 'Nachricht vorbereitet',
      submittedBodyStart: 'Vielen Dank für Ihre Nachricht an GeekTabs. Klicken Sie unten, um sie direkt über Ihre E-Mail-App zu senden, oder schreiben Sie an ',
      submittedBodyEnd: '.',
      openEmailBtn: 'In E-Mail-App öffnen',
      sendAnotherBtn: 'Weitere Nachricht senden',
      nameLabel: 'Ihr Name',
      namePlaceholder: 'Alex Morgan',
      emailLabel: 'E-Mail-Adresse',
      emailPlaceholder: 'sie@beispiel.de',
      topicLabel: 'Thema',
      topics: ['Allgemeine Anfrage', 'Funktionsvorschlag', 'Fehlerbericht', 'Datenschutz & Recht', 'Werbung & Partnerschaften'],
      messageLabel: 'Nachricht',
      messagePlaceholder: 'Wie können wir helfen?',
      sendBtn: 'Nachricht senden',
    },
  },
  Japanese: {
    backToHome: 'ホームに戻る',
    navAria: '情報ページ',
    tabs: { about: '概要', privacy: 'プライバシーポリシー', terms: '利用規約', contact: 'お問い合わせ' },
    privacy: {
      eyebrow: 'プライバシーとデータ保護',
      title: 'プライバシーポリシー',
      updated: '最終更新日：2026年11月23日',
      s1Title: '1. お使いの端末にローカル保存される情報',
      s1p1Prefix: 'GeekTabs はプライバシー重視の設計を採用しています。ブックマーク、カレンダー予定やリマインダー、メモ、To-Doリスト、テーマ設定、カスタム壁紙、言語設定などのデータは ',
      s1p1Suffix: ' および IndexedDB を通じてお使いのブラウザ内にローカル保存されます。',
      s1p2: '主要機能の利用にアカウント登録は不要であり、個人データを第三者へ販売することはありません。ローカルデータは「設定」からいつでも書き出し・バックアップ・削除できます。',
      s2Title: '2. 外部ユーティリティとネットワーク通信',
      s2p1: '一部の任意ツールは操作に応じて公開情報を取得します。天気予報は選択都市や座標をもとに気象データを取得し、通貨換算は為替レートを取得し、IP確認はネットワーク経路情報を表示し、回線速度テストはテストサーバーとの通信速度と遅延を計測します。',
      s3Title: '3. 広告、Cookie および Google AdSense',
      s3p1: 'GeekTabs では Google AdSense などの第三者配信事業者による広告が表示される場合があります。Google を含む配信事業者は、過去のアクセス情報に基づき広告を配信するため Cookie を使用します。',
      s3p2Start: 'Google の広告 Cookie により、GeekTabs や他サイトへのアクセス履歴に基づく広告表示が可能になります。パーソナライズ広告は ',
      s3p2AdsSettings: 'Google 広告設定',
      s3p2Mid: ' から無効化でき、第三者配信事業者の Cookie については ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: ' からも設定可能です。',
      s4Title: '4. プライバシーに関する権利とお問い合わせ',
      s4p1Start: 'お住まいの地域の法令（EEA/英国の GDPR、カリフォルニア州 CCPA/CPRA など）に基づき、ブラウザデータの削除や Cookie 管理、または',
      s4p1Link: 'お問い合わせページ',
      s4p1End: 'からのご相談が可能です。',
    },
    terms: {
      eyebrow: '利用規約',
      title: '利用規約',
      updated: '最終更新日：2026年11月23日',
      s1Title: '1. 規約への同意',
      s1p1Start: 'GeekTabs にアクセスまたは利用することにより、本利用規約および',
      s1p1Link: 'プライバシーポリシー',
      s1p1End: 'に同意したものとみなされます。同意されない場合は利用をお控えください。',
      s2Title: '2. 許可された利用と生産性ツール',
      s2p1: 'GeekTabs は、カスタマイズ可能なダッシュボード、ブックマーク、カレンダー、電卓・為替計算、メモ、To-Do、IP確認、速度テストなどの Web ツールを個人的かつ合法的な情報利用向けに提供します。',
      s2p2: '診断エンドポイントの悪用、過度な自動トラフィック、不正アクセス、プラットフォームの通常運用を妨げる行為を行わないことに同意するものとします。',
      s3Title: '3. ローカルデータとバックアップの責任',
      s3p1: 'メモやブックマーク、予定、設定はブラウザ内にローカル保存されるため、サイトデータの消去やブラウザ変更により未保存記録が失われる場合があります。「設定」のデータバックアップ・復元機能による定期的な保存を強く推奨します。',
      s4Title: '4. 第三者リンクと免責事項',
      s4p1: 'ブックマークや検索からアクセスする外部サイトは各運営者によって独立管理されています。GeekTabs の全ツールおよび市場・天気・通信の推定値は現状有姿で提供され、継続的可用性や金融上の正確性を保証するものではありません。',
    },
    about: {
      eyebrow: 'プラットフォームについて',
      title: 'GeekTabs について',
      subtitle: '便利なサイト、集中ツール、毎日の生産性をひとつにまとめたスタートスペース。',
      missionTitle: '私たちのミッション',
      missionBody: 'GeekTabs は、毎日のブラウザのスタートページを穏やかで美しく実用的なワークスペースへ変えるために生まれました。数十個のタブに散らばりがちなブックマーク、天気、計算、メモ、回線診断をすっきり一画面に集約します。',
      toolsTitle: '主な搭載ツール',
      cards: [
        { title: 'ホーム＆天気予報', body: 'パーソナライズ挨拶、精密時計、マルチ検索、現地リアルタイム天気、デイリーダイジェストカード。' },
        { title: 'ブックマーク＆クイックリンク', body: 'AI ツール、オフィススイート、音楽・エンタメ、個人用ショートカットを整理できるカテゴリ別ブックマーク。' },
        { title: 'カレンダー＆世界祝日', body: '個人の予定やリマインダーに加え、複数国・地域の祝日をまとめて確認できる月間カレンダー。' },
        { title: '電卓・IP確認・速度テスト', body: '標準・関数電卓、ライブ為替変換、IPv4/IPv6 ネットワーク診断、リアルタイム回線速度テスト。' },
      ],
      privacyTitle: 'プライバシー優先＆23言語対応',
      privacyBody: '23言語対応、ライト/ダーク/ガラスカードテーマ、1920×1080 壁紙プリセット、バックアップ機能を備え、PC でもモバイルでもデータをローカルに保ったまま快適に利用できます。',
    },
    contact: {
      eyebrow: 'お問い合わせ',
      title: 'お問い合わせ',
      subtitle: 'ご質問、ご意見、不具合報告、プライバシーに関するご連絡はこちらからお送りください。',
      supportEmailTitle: 'サポートメールアドレス',
      supportEmailDesc: '一般的なお問い合わせ、技術サポート、プライバシー・法務連絡先：',
      responseTimeTitle: '通常の返信目安',
      responseTimeDesc: '月曜〜金曜に内容を確認し、1〜2営業日以内の返信を目指しています。',
      submittedTitle: 'メール作成の準備ができました',
      submittedBodyStart: 'GeekTabs へのお問い合わせありがとうございます。下のボタンからメールアプリで直接送信するか、直接 ',
      submittedBodyEnd: ' までお送りください。',
      openEmailBtn: 'メールアプリを開く',
      sendAnotherBtn: '別のメッセージを送る',
      nameLabel: 'お名前',
      namePlaceholder: '山田 太郎',
      emailLabel: 'メールアドレス',
      emailPlaceholder: 'you@example.com',
      topicLabel: 'お問い合わせ種別',
      topics: ['一般的なお問い合わせ', '機能のご提案', '不具合の報告', 'プライバシー・法務', '広告・提携について'],
      messageLabel: 'メッセージ',
      messagePlaceholder: 'ご用件をお知らせください',
      sendBtn: 'メッセージを送信',
    },
  },
  Korean: {
    backToHome: '홈으로 돌아가기',
    navAria: '정보 페이지',
    tabs: { about: '소개', privacy: '개인정보 처리방침', terms: '이용약관', contact: '문의하기' },
    privacy: {
      eyebrow: '개인정보 보호 및 데이터 보안',
      title: '개인정보 처리방침',
      updated: '최종 업데이트: 2026년 11월 23일',
      s1Title: '1. 기기에 로컬 저장되는 정보',
      s1p1Prefix: 'GeekTabs는 개인정보 보호 우선 구조로 설계되었습니다. 북마크, 달력 일정 및 알림, 메모, 할 일 목록, 테마 색상, 사용자 배경화면, 언어 설정 등 직접 생성한 항목은 ',
      s1p1Suffix: ' 및 IndexedDB를 통해 브라우저 내부에 로컬 저장됩니다.',
      s1p2: '핵심 대시보드 기능을 사용하기 위해 회원가입이 필요하지 않으며 개인 데이터를 제3자에게 판매하지 않습니다. 설정에서 언제든 로컬 데이터를 내보내거나 백업·삭제할 수 있습니다.',
      s2Title: '2. 외부 유틸리티 및 네트워크 요청',
      s2p1: '일부 선택 도구는 요청 시 공개 실시간 정보를 조회합니다. 날씨는 선택한 도시 또는 좌표로 기상 정보를 조회하며, 환율 변환은 실시간 외환 시세를 불러오고, IP 조회는 네트워크 라우팅 정보를 표시하며, 속도 측정은 엣지 테스트 서버와의 대역폭·지연 시간을 측정합니다.',
      s3Title: '3. 광고, 쿠키 및 Google 애드센스',
      s3p1: 'GeekTabs는 Google 애드센스 등 제3자 광고 공급업체의 광고를 게재할 수 있습니다. Google을 포함한 제3자 공급업체는 사용자의 이전 웹사이트 방문 기록을 바탕으로 쿠키를 사용해 맞춤 광고를 제공합니다.',
      s3p2Start: 'Google의 광고 쿠키를 통해 GeekTabs 및 다른 웹사이트 방문 기록을 기반으로 광고가 제공될 수 있습니다. 맞춤 광고는 ',
      s3p2AdsSettings: 'Google 광고 설정',
      s3p2Mid: '에서 해제하거나 ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '에서 제3자 맞춤 광고 쿠키를 관리할 수 있습니다.',
      s4Title: '4. 개인정보 권리 및 문의',
      s4p1Start: '거주 지역 법령(EEA/영국 GDPR, 캘리포니아 CCPA/CPRA 등)에 따라 처리 내역을 확인하거나 브라우저 로컬 저장소 삭제, 쿠키 설정 관리 및 ',
      s4p1Link: '문의하기 페이지',
      s4p1End: '를 통한 개인정보 문의가 가능합니다.',
    },
    terms: {
      eyebrow: '서비스 약관',
      title: '이용약관',
      updated: '최종 업데이트: 2026년 11월 23일',
      s1Title: '1. 약관 동의',
      s1p1Start: 'GeekTabs에 접속하거나 사용함으로써 귀하는 본 이용약관 및 ',
      s1p1Link: '개인정보 처리방침',
      s1p1End: '에 동의하게 됩니다. 동의하지 않는 경우 사이트 이용을 중단해 주세요.',
      s2Title: '2. 허용된 이용 및 생산성 도구',
      s2p1: 'GeekTabs는 맞춤형 시작 대시보드, 북마크 관리자, 캘린더, 공학용/환율 계산기, 메모, 할 일 목록, IP 조회 및 속도 측정 등 웹 기반 생산성 유틸리티를 개인적이고 합법적인 정보 활용 목적으로 제공합니다.',
      s2p2: '네트워크 진단 엔드포인트를 악용하거나 자동화된 비정상 트래픽을 유발하거나 무단 접근 및 정상 운영 방해 행위를 하지 않는 데 동의합니다.',
      s3Title: '3. 로컬 데이터 및 백업 책임',
      s3p1: '메모, 북마크, 일정, 할 일과 설정은 브라우저 로컬 저장소에 보관되므로 사이트 데이터를 삭제하거나 브라우저를 바꾸면 백업되지 않은 기록이 사라질 수 있습니다. 설정의 백업 및 복원 기능으로 주기적으로 내보내기를 권장합니다.',
      s4Title: '4. 제3자 링크 및 면책 조항',
      s4p1: '북마크나 검색을 통해 이동하는 외부 사이트는 각 운영 주체의 약관과 정책에 따릅니다. GeekTabs는 모든 도구와 시장·날씨·네트워크 추정치를 "있는 그대로" 제공하며 중단 없는 가용성이나 금융 정확성을 보증하지 않습니다.',
    },
    about: {
      eyebrow: '플랫폼 소개',
      title: 'GeekTabs 소개',
      subtitle: '유용한 웹사이트, 집중 도구, 일상 생산성을 위한 깔끔한 시작 공간.',
      missionTitle: '우리의 미션',
      missionBody: 'GeekTabs는 매일 마주하는 브라우저 시작 페이지를 차분하고 아름다우며 실용적인 작업 공간으로 바꾸기 위해 만들어졌습니다. 수많은 탭에 흩어지던 북마크, 날씨, 계산, 메모, 네트워크 진단을 방해 없는 하나의 화면에 담았습니다.',
      toolsTitle: '포함된 핵심 도구',
      cards: [
        { title: '홈 대시보드 및 날씨', body: '맞춤 인사말, 정밀 시계, 다중 검색 엔진 통합, 실시간 지역 날씨, 데일리 다이제스트 영감 카드.' },
        { title: '북마크 및 빠른 링크', body: 'AI 도구, 오피스 앱, 엔터테인먼트, 개인 바로가기를 깔끔하게 정리하는 시각적 북마크.' },
        { title: '캘린더 및 공휴일', body: '개인 일정, 시간 알림, 여러 국가의 공휴일을 함께 확인하는 인터랙티브 월간 플래너.' },
        { title: '계산기 · IP · 속도 측정', body: '일반 및 공학용 계산, 실시간 환율 변환, IPv4/IPv6 네트워크 점검, 광대역 속도 벤치마크.' },
      ],
      privacyTitle: '개인정보 우선 및 23개 언어 지원',
      privacyBody: '23개 언어, 라이트/다크/글래스 카드 테마, 1920×1080 고해상도 배경화면, 내장 백업 및 복원을 지원하며 개인 데이터는 사용자 브라우저 안에 안전하게 유지됩니다.',
    },
    contact: {
      eyebrow: '연락하기',
      title: '문의하기',
      subtitle: '질문, 피드백, 버그 제보 또는 개인정보 관련 요청이 있다면 언제든 연락해 주세요.',
      supportEmailTitle: '지원 이메일',
      supportEmailDesc: '일반 문의, 기술 지원, 개인정보 및 법무 관련 안내:',
      responseTimeTitle: '평균 응답 시간',
      responseTimeDesc: '월요일~금요일에 메시지를 검토하며 영업일 기준 1~2일 내 답변을 목표로 합니다.',
      submittedTitle: '메시지 준비 완료',
      submittedBodyStart: 'GeekTabs에 문의해 주셔서 감사합니다. 아래 버튼을 클릭해 메일 앱에서 바로 발송하거나 ',
      submittedBodyEnd: ' 로 직접 보내실 수 있습니다.',
      openEmailBtn: '메일 앱에서 열기',
      sendAnotherBtn: '다른 메시지 보내기',
      nameLabel: '이름',
      namePlaceholder: '김민수',
      emailLabel: '이메일 주소',
      emailPlaceholder: 'you@example.com',
      topicLabel: '문의 유형',
      topics: ['일반 문의', '기능 제안', '버그 제보', '개인정보 및 법무', '광고 및 제휴'],
      messageLabel: '메시지',
      messagePlaceholder: '어떤 도움이 필요하신가요?',
      sendBtn: '메시지 보내기',
    },
  },
  Italian: {
    backToHome: 'Torna alla home',
    navAria: 'Pagine informative',
    tabs: { about: 'Informazioni', privacy: 'Privacy Policy', terms: 'Termini di servizio', contact: 'Contatti' },
    privacy: {
      eyebrow: 'Privacy e protezione dei dati',
      title: 'Informativa sulla privacy',
      updated: 'Ultimo aggiornamento: 23 novembre 2026',
      s1Title: '1. Informazioni salvate localmente sul dispositivo',
      s1p1Prefix: 'GeekTabs è progettato con un’architettura orientata alla privacy. I contenuti personali — segnalibri, eventi e promemoria, note, attività, colori del tema, sfondi personalizzati e lingua — restano salvati localmente nel browser tramite ',
      s1p1Suffix: ' e IndexedDB.',
      s1p2: 'Non è necessaria alcuna registrazione per usare le funzioni principali e GeekTabs non vende i tuoi dati personali a terzi. Puoi esportare, eseguire il backup o eliminare i dati locali in qualsiasi momento dalle Impostazioni.',
      s2Title: '2. Utilità esterne e richieste di rete',
      s2p1: 'Alcuni strumenti opzionali recuperano dati pubblici in tempo reale su richiesta: le previsioni meteo interrogano i servizi meteorologici per la località scelta; il convertitore recupera i cambi valutari; la ricerca IP mostra i metadati di rete; e lo speed test misura banda e latenza verso server di prova.',
      s3Title: '3. Pubblicità, cookie e Google AdSense',
      s3p1: 'GeekTabs può mostrare annunci pubblicitari erogati da fornitori terzi, incluso Google AdSense. I fornitori terzi utilizzano cookie per pubblicare annunci in base alle visite precedenti su questo o altri siti web.',
      s3p2Start: 'L’uso dei cookie pubblicitari da parte di Google consente di mostrare annunci pertinenti in base alle visite su GeekTabs e altri siti. Puoi disattivare la pubblicità personalizzata visitando ',
      s3p2AdsSettings: 'Impostazioni annunci Google',
      s3p2Mid: ' o gestire i cookie di terze parti su ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '.',
      s4Title: '4. I tuoi diritti sulla privacy e contatti',
      s4p1Start: 'In base alla normativa locale (inclusi SEE/Regno Unito con il GDPR e California con CCPA/CPRA), puoi conoscere i dati trattati, cancellare i dati locali del browser, gestire i cookie o contattarci tramite la nostra ',
      s4p1Link: 'pagina Contatti',
      s4p1End: '.',
    },
    terms: {
      eyebrow: 'Accordo di servizio',
      title: 'Termini di servizio',
      updated: 'Ultimo aggiornamento: 23 novembre 2026',
      s1Title: '1. Accettazione dei termini',
      s1p1Start: 'Accedendo o utilizzando GeekTabs accetti i presenti Termini di servizio e la nostra ',
      s1p1Link: 'Informativa sulla privacy',
      s1p1End: '. Se non accetti tali termini, interrompi l’utilizzo del sito.',
      s2Title: '2. Uso consentito e strumenti di produttività',
      s2p1: 'GeekTabs offre utilità web per la produttività — dashboard iniziale, segnalibri, calendario, calcolatrice scientifica e valute, note, elenco attività, verifica IP e speed test — per uso personale, lecito e informativo.',
      s2p2: 'L’utente si impegna a non abusare degli endpoint diagnostici, non automatizzare traffico anomalo, non tentare accessi non autorizzati né interferire con il funzionamento della piattaforma.',
      s3Title: '3. Dati locali e responsabilità di backup',
      s3p1: 'Poiché note, segnalibri, calendario, attività e impostazioni risiedono localmente nel browser, la pulizia dei dati del sito o il cambio browser può eliminare i record non salvati. Consigliamo backup periodici tramite Backup e ripristino nelle Impostazioni.',
      s4Title: '4. Link di terze parti ed esclusioni',
      s4p1: 'I siti esterni raggiunti tramite segnalibri o motori di ricerca sono gestiti autonomamente da terzi. GeekTabs fornisce strumenti e stime di mercato/meteo/rete «così come sono», senza garanzie di disponibilità continua o accuratezza finanziaria.',
    },
    about: {
      eyebrow: 'La nostra piattaforma',
      title: 'Informazioni su GeekTabs',
      subtitle: 'Il tuo spazio quotidiano per siti utili, strumenti di concentrazione e produttività.',
      missionTitle: 'La nostra missione',
      missionBody: 'GeekTabs trasforma la pagina iniziale del browser in uno spazio di lavoro sereno, curato e davvero utile, riunendo segnalibri, meteo, calcoli, note e diagnostica di rete in un’unica interfaccia senza distrazioni.',
      toolsTitle: 'Strumenti principali inclusi',
      cards: [
        { title: 'Home Dashboard e Meteo', body: 'Saluto personalizzato, orologio di precisione, ricerca multMotore, meteo locale dal vivo e schede Riepilogo Quotidiano.' },
        { title: 'Segnalibri e link rapidi', body: 'Segnalibri visivi categorizzati con accesso immediato a strumenti IA, suite ufficio, svago e scorciatoie personali.' },
        { title: 'Calendario e festività', body: 'Pianificatore mensile interattivo per eventi, promemoria e festività ufficiali di più paesi.' },
        { title: 'Calcolatrice, IP e Speed Test', body: 'Calcolo standard e scientifico, tassi di cambio live, verifica rete IPv4/IPv6 e benchmark velocità broadband.' },
      ],
      privacyTitle: 'Privacy prima di tutto e 23 lingue',
      privacyBody: 'Con 23 lingue supportate, temi chiaro/scuro/vetro, sfondi 1920×1080 e backup integrato, GeekTabs si adatta perfettamente a desktop e mobile mantenendo i tuoi dati nel browser.',
    },
    contact: {
      eyebrow: 'Restiamo in contatto',
      title: 'Contattaci',
      subtitle: 'Domande, feedback, segnalazioni di bug o richieste sulla privacy? Scrivici pure.',
      supportEmailTitle: 'Email di supporto diretto',
      supportEmailDesc: 'Per richieste generali, assistenza tecnica e comunicazioni legali o sulla privacy:',
      responseTimeTitle: 'Tempo di risposta tipico',
      responseTimeDesc: 'Esaminiamo i messaggi dal lunedì al venerdì e rispondiamo di norma entro 1–2 giorni lavorativi.',
      submittedTitle: 'Messaggio pronto',
      submittedBodyStart: 'Grazie per aver contattato GeekTabs. Il messaggio è pronto: clicca qui sotto per inviarlo con la tua app email oppure scrivi a ',
      submittedBodyEnd: '.',
      openEmailBtn: 'Apri nell’app email',
      sendAnotherBtn: 'Invia un altro messaggio',
      nameLabel: 'Il tuo nome',
      namePlaceholder: 'Alex Morgan',
      emailLabel: 'Indirizzo email',
      emailPlaceholder: 'tu@esempio.com',
      topicLabel: 'Argomento',
      topics: ['Richiesta generale', 'Suggerimento funzionalità', 'Segnalazione bug', 'Privacy e note legali', 'Pubblicità e partnership'],
      messageLabel: 'Messaggio',
      messagePlaceholder: 'Come possiamo aiutarti?',
      sendBtn: 'Invia messaggio',
    },
  },
  Russian: {
    backToHome: 'На главную',
    navAria: 'Информационные страницы',
    tabs: { about: 'О сервисе', privacy: 'Конфиденциальность', terms: 'Условия', contact: 'Контакты' },
    privacy: {
      eyebrow: 'Конфиденциальность и защита данных',
      title: 'Политика конфиденциальности',
      updated: 'Последнее обновление: 23 ноября 2026 г.',
      s1Title: '1. Информация, хранящаяся локально на вашем устройстве',
      s1p1Prefix: 'GeekTabs построен на принципах приоритета приватности. Ваши личные данные — закладки, события и напоминания календаря, заметки, список дел, настройки темы, свои обои и язык — хранятся локально в браузере через ',
      s1p1Suffix: ' и IndexedDB.',
      s1p2: 'Для работы основных функций регистрация не требуется, а GeekTabs не продаёт ваши данные третьим лицам. Вы можете экспортировать, сохранить резервную копию или удалить локальные данные в Настройках.',
      s2Title: '2. Внешние сервисы и сетевые запросы',
      s2p1: 'Отдельные инструменты запрашивают публичные данные по мере необходимости: прогноз погоды использует выбранный город или координаты; конвертер валют загружает курсы обмена; проверка IP отображает сетевые метаданные; а тест скорости измеряет пропускную способность и задержку.',
      s3Title: '3. Реклама, файлы cookie и Google AdSense',
      s3p1: 'GeekTabs может отображать рекламу сторонних поставщиков, включая Google AdSense. Сторонние поставщики, в том числе Google, используют cookie для показа объявлений с учётом предыдущих посещений.',
      s3p2Start: 'Использование рекламных cookie Google позволяет показывать релевантные объявления на основе посещений GeekTabs и других сайтов. Отключить персонализацию рекламы можно в ',
      s3p2AdsSettings: 'Настройках рекламы Google',
      s3p2Mid: ' или на сайте ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '.',
      s4Title: '4. Ваши права и обратная связь',
      s4p1Start: 'В зависимости от вашего региона (включая ЕЭЗ/Великобританию по GDPR и Калифорнию по CCPA/CPRA), вы можете очистить локальное хранилище, управлять cookie в браузере или связаться с нами через ',
      s4p1Link: 'страницу контактов',
      s4p1End: '.',
    },
    terms: {
      eyebrow: 'Пользовательское соглашение',
      title: 'Условия использования',
      updated: 'Последнее обновление: 23 ноября 2026 г.',
      s1Title: '1. Принятие условий',
      s1p1Start: 'Используя GeekTabs, вы соглашаетесь с настоящими Условиями использования и нашей ',
      s1p1Link: 'Политикой конфиденциальности',
      s1p1End: '. Если вы не согласны, прекратите использование сайта.',
      s2Title: '2. Допустимое использование и инструменты',
      s2p1: 'GeekTabs предоставляет веб-инструменты для продуктивности — настраиваемую главную панель, закладки, календарь, научный и валютный калькулятор, заметки, список задач, проверку IP и тест скорости — для личного и законного информационного использования.',
      s2p2: 'Вы соглашаетесь не злоупотреблять сетевой диагностикой, не создавать автоматизированную нагрузку, не предпринимать попыток несанкционированного доступа и не нарушать работу сервиса.',
      s3Title: '3. Локальные данные и резервное копирование',
      s3p1: 'Поскольку заметки, закладки, события, задачи и настройки хранятся локально в браузере, очистка данных сайта или смена браузера может удалить несохранённые записи. Рекомендуем регулярно экспортировать копию в Настройках.',
      s4Title: '4. Внешние ссылки и отказ от гарантий',
      s4p1: 'Сторонние сайты, открываемые через закладки или поиск, управляются независимыми владельцами. GeekTabs предоставляет все инструменты и оценки «как есть» без гарантий бесперебойной работы или финансовой точности.',
    },
    about: {
      eyebrow: 'О платформе',
      title: 'О GeekTabs',
      subtitle: 'Ваше ежедневное пространство для полезных сайтов, фокуса и продуктивности.',
      missionTitle: 'Наша миссия',
      missionBody: 'GeekTabs создан, чтобы превратить стартовую страницу браузера в спокойное, эстетичное и по-настоящему полезное рабочее пространство, объединив закладки, погоду, расчёты, заметки и диагностику сети в одном интерфейсе.',
      toolsTitle: 'Основные инструменты',
      cards: [
        { title: 'Главная панель и погода', body: 'Персональное приветствие, точные часы, поиск по нескольким системам, прогноз погоды и карточки «Сводка дня».' },
        { title: 'Закладки и быстрые ссылки', body: 'Визуальные категории закладок с мгновенным доступом к ИИ-сервисам, офисным приложениям и личным ссылкам.' },
        { title: 'Календарь и праздники', body: 'Интерактивный календарь на месяц для событий, напоминаний и праздников разных стран.' },
        { title: 'Калькулятор, IP и тест скорости', body: 'Обычный и научный калькулятор, живой обмен валют, анализ IPv4/IPv6 и измерение скорости канала.' },
      ],
      privacyTitle: 'Приватность и поддержка 23 языков',
      privacyBody: '23 поддерживаемых языка, светлая/тёмная/стеклянная темы, обои 1920×1080 и встроенное резервное копирование делают GeekTabs удобным на компьютере и телефоне, сохраняя ваши записи локально.',
    },
    contact: {
      eyebrow: 'Связаться с нами',
      title: 'Контакты',
      subtitle: 'Вопросы, отзывы, сообщения об ошибках или запросы по конфиденциальности? Будем рады помочь.',
      supportEmailTitle: 'Почта поддержки',
      supportEmailDesc: 'Для общих вопросов, технической помощи и юридических уведомлений:',
      responseTimeTitle: 'Обычное время ответа',
      responseTimeDesc: 'Мы проверяем сообщения с понедельника по пятницу и стараемся ответить за 1–2 рабочих дня.',
      submittedTitle: 'Письмо подготовлено',
      submittedBodyStart: 'Спасибо за обращение в GeekTabs. Нажмите кнопку ниже, чтобы отправить письмо через ваш почтовый клиент, или напишите на ',
      submittedBodyEnd: '.',
      openEmailBtn: 'Открыть в почте',
      sendAnotherBtn: 'Отправить ещё сообщение',
      nameLabel: 'Ваше имя',
      namePlaceholder: 'Алексей Смирнов',
      emailLabel: 'Электронная почта',
      emailPlaceholder: 'you@example.com',
      topicLabel: 'Тема',
      topics: ['Общий вопрос', 'Предложение функции', 'Сообщение об ошибке', 'Конфиденциальность и право', 'Реклама и партнёрство'],
      messageLabel: 'Сообщение',
      messagePlaceholder: 'Чем мы можем помочь?',
      sendBtn: 'Отправить сообщение',
    },
  },
  Luxembourgish: {
    backToHome: 'Zréck op d’Startsäit',
    navAria: 'Informatiounssäiten',
    tabs: { about: 'Iwwer eis', privacy: 'Dateschutz', terms: 'Notzungsbedéngungen', contact: 'Kontakt' },
    privacy: {
      eyebrow: 'Dateschutz & Datesécherheet',
      title: 'Dateschutzerklärung',
      updated: 'Lescht Aktualiséierung: 23. November 2026',
      s1Title: '1. Lokal op Ärem Apparat gespäichert Donnéeën',
      s1p1Prefix: 'GeekTabs ass op Privatsphär ausgeluecht. Är perséinlech Produktivitéitsdaten — Lieszeechen, Kalennerevenementer, Notizen, To-do-Lëschten, Faarwen, eegen Hannergrondbiller a Sprooch — ginn lokal an Ärem Browser iwwer ',
      s1p1Suffix: ' an IndexedDB gespäichert.',
      s1p2: 'Fir d’Haaptfunktiounen ass keng Umeldung néideg a GeekTabs verkeeft keng perséinlech Daten un Drëtter. Dir kënnt Är lokal Daten zu all Moment an den Astellungen exportéieren oder läschen.',
      s2Title: '2. Extern Tools & Netzwierkufroen',
      s2p1: 'Verschidde fakultativ Tools froen ëffentlech Echtzäitdaten of: d’Wiederprävisioun sicht fir Är gewielte Stad; de Wärungsemrechner luet aktuell Coursen; den IP-Lookup weist Netzwierk-Metadaten; an de Speedtest moosst Duerchsaz a Latenz.',
      s3Title: '3. Reklamm, Cookien a Google AdSense',
      s3p1: 'GeekTabs kann Annoncë vun Drëttubidder wéi Google AdSense weisen. Drëttubidder dorënner Google benotzen Cookien fir Reklamm op Basis vu fréiere Visitten auszeschëdden.',
      s3p2Start: 'D’Benotze vu Reklamm-Cookien duerch Google erméiglecht personaliséiert Reklamm. Dir kënnt dat iwwer ',
      s3p2AdsSettings: 'Google-Annoncenastellungen',
      s3p2Mid: ' deaktivéieren oder Drëtt-Cookien op ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: ' verwalten.',
      s4Title: '4. Är Dateschutzrechter & Kontakt',
      s4p1Start: 'Ofhängeg vun Ärer Regioun (dorënner EWR/UK mam RGPD a Kalifornien mam CCPA/CPRA) hutt Dir Rechter op Auskonft, Läsche vu Browserdaten a Kontakt iwwer eis ',
      s4p1Link: 'Kontaktsäit',
      s4p1End: '.',
    },
    terms: {
      eyebrow: 'Serviceaccord',
      title: 'Notzungsbedéngungen',
      updated: 'Lescht Aktualiséierung: 23. November 2026',
      s1Title: '1. Akzeptanz vun de Bedéngungen',
      s1p1Start: 'Mat dem Zougrëff op GeekTabs akzeptéiert Dir dës Notzungsbedéngungen an eis ',
      s1p1Link: 'Dateschutzerklärung',
      s1p1End: '. Wann Dir net averstane sidd, notzt d’Säit w.e.g. net weider.',
      s2Title: '2. Erlaabte Notzung & Produktivitéitstools',
      s2p1: 'GeekTabs bitt Web-Tools — Start-Dashboard, Lieszeechen, Kalenner, Rechner a Wärungen, Notizen, Aufgaben, IP-Analyse a Speedtest — fir perséinlechen a legale Gebrauch.',
      s2p2: 'Dir sidd averstanen d’Diagnos-Endpunkter net ze mëssbrauchen, keen automatiséierten Trafic ze schécken an de Betrib net ze stéieren.',
      s3Title: '3. Lokal Daten & Backup-Responsabilitéit',
      s3p1: 'Well Notizen, Lieszeechen, Terminer an Astellungen lokal am Browser leien, kann d’Läsche vu Websäitedaten ongeséchert Elementer ewechhuelen. Mir recommandéieren reegelméisseg Backups iwwer d’Astellungen.',
      s4Title: '4. Drëtt-Linken & Garantieaussoen',
      s4p1: 'Extern Websäite ginn eegestänneg vun Drëtter bedriwwen. GeekTabs stellt all Tools a Schätzungen „wéi se sinn“ ouni Garantie op Dauerverfügbarkeet zur Verfügung.',
    },
    about: {
      eyebrow: 'Iwwer eis Plattform',
      title: 'Iwwer GeekTabs',
      subtitle: 'Ären alldeegleche Raum fir nëtzlech Websäiten, Fokus-Tools a Produktivitéit.',
      missionTitle: 'Eis Missioun',
      missionBody: 'GeekTabs bréngt Lieszeechen, Wieder, Rechnungen, Notizen an Netzwierkdiagnos op enger roueger, propperer Startsäit zesummen — ouni Oflenkung an ouni Dosende vun oppene Tabs.',
      toolsTitle: 'Integréiert Haapt-Tools',
      cards: [
        { title: 'Start-Dashboard & Wieder', body: 'Perséinlech Begréissung, präzis Auer, Multi-Sichmaschinn, Live-Wieder an Dagbléck-Kaarten.' },
        { title: 'Lieszeechen & Schnelllinken', body: 'Kategoriséiert visuell Lieszeechen fir KI-Tools, Office-Apps, Musek an eege Linken.' },
        { title: 'Kalenner & Feierdeeg', body: 'Interaktive Mountplang fir Evenementer, Erënnerungen a Feierdeeg aus méi Länner.' },
        { title: 'Rechner, IP & Speedtest', body: 'Standard- a wëssenschaftleche Rechner, Live-Wärungen, IPv4/IPv6-Analys a Vitesse-Test.' },
      ],
      privacyTitle: 'Privatsphär & 23 Sproochen',
      privacyBody: 'Mat 23 Sproochen, Hell-/Donkel-/Glas-Designen, 1920×1080 Hannergrënn an integréiertem Backup funktionéiert GeekTabs op Desktop a Mobil an hält Är Donnéeën an Ärem Browser.',
    },
    contact: {
      eyebrow: 'Kontakt ophuelen',
      title: 'Kontaktéiert eis',
      subtitle: 'Froen, Feedback, Feelerberichter oder Dateschutz-Ufroen? Mir freeën eis op Är Noriicht.',
      supportEmailTitle: 'Direkt Support-E-Mail',
      supportEmailDesc: 'Fir allgemeng Ufroen, technesch Hëllef oder Dateschutz- a Rechtsufroen:',
      responseTimeTitle: 'Typesch Äntwertzäit',
      responseTimeDesc: 'Mir liesen d’Noriichten vu Méindeg bis Freideg a äntwerten normalerweis bannent 1–2 Aarbechtsdeeg.',
      submittedTitle: 'Noriicht preparéiert',
      submittedBodyStart: 'Merci fir Är Noriicht u GeekTabs. Klickt hei ënnendrënner fir se mat Ärer E-Mail-App ze schécken, oder schreift un ',
      submittedBodyEnd: '.',
      openEmailBtn: 'An E-Mail-App opmaachen',
      sendAnotherBtn: 'Nach eng Noriicht schécken',
      nameLabel: 'Ären Numm',
      namePlaceholder: 'Alex Morgan',
      emailLabel: 'E-Mail-Adress',
      emailPlaceholder: 'dir@beispill.lu',
      topicLabel: 'Thema',
      topics: ['Allgemeng Ufro', 'Funktiounsvirschlag', 'Feelerbericht', 'Dateschutz & Recht', 'Reklamm & Partnerschaft'],
      messageLabel: 'Noriicht',
      messagePlaceholder: 'Wéi kënne mir hëllefen?',
      sendBtn: 'Noriicht schécken',
    },
  },
  Dutch: {
    backToHome: 'Terug naar start',
    navAria: 'Informatiepagina’s',
    tabs: { about: 'Over ons', privacy: 'Privacybeleid', terms: 'Voorwaarden', contact: 'Contact' },
    privacy: {
      eyebrow: 'Privacy & gegevensbescherming',
      title: 'Privacybeleid',
      updated: 'Laatst bijgewerkt: 23 november 2026',
      s1Title: '1. Lokaal op uw apparaat opgeslagen gegevens',
      s1p1Prefix: 'GeekTabs is gebouwd met privacy voorop. Persoonlijke items die u aanmaakt — bladwijzers, agenda-afspraken en herinneringen, notities, takenlijsten, themakleuren, eigen achtergronden en taal — worden lokaal in uw browser opgeslagen via ',
      s1p1Suffix: ' en IndexedDB.',
      s1p2: 'Er is geen accountregistratie nodig voor de hoofdfuncties en GeekTabs verkoopt uw persoonlijke gegevens nooit aan derden. U kunt uw lokale gegevens altijd via Instellingen exporteren, back-uppen of verwijderen.',
      s2Title: '2. Externe hulpmiddelen & netwerkverzoeken',
      s2p1: 'Sommige optionele tools halen op verzoek live openbare informatie op: het weer gebruikt uw gekozen stad of coördinaten; valutaomrekening haalt actuele wisselkoersen op; IP-opzoeking toont netwerkroutering; en de snelheidstest meet doorvoer en latentie.',
      s3Title: '3. Advertenties, cookies en Google AdSense',
      s3p1: 'GeekTabs kan advertenties tonen van derde aanbieders, waaronder Google AdSense. Deze aanbieders gebruiken cookies om advertenties weer te geven op basis van eerdere bezoeken aan deze of andere websites.',
      s3p2Start: 'Het gebruik van advertentiecookies door Google maakt gepersonaliseerde advertenties mogelijk. U kunt zich afmelden via ',
      s3p2AdsSettings: 'Google-advertentie-instellingen',
      s3p2Mid: ' of cookies van derden beheren via ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '.',
      s4Title: '4. Uw privacyrechten & contact',
      s4p1Start: 'Afhankelijk van uw regio (waaronder EER/VK onder de AVG en Californië onder CCPA/CPRA) kunt u lokale browseropslag wissen, cookievoorkeuren aanpassen of contact opnemen via onze ',
      s4p1Link: 'Contactpagina',
      s4p1End: '.',
    },
    terms: {
      eyebrow: 'Gebruiksovereenkomst',
      title: 'Servicevoorwaarden',
      updated: 'Laatst bijgewerkt: 23 november 2026',
      s1Title: '1. Aanvaarding van voorwaarden',
      s1p1Start: 'Door GeekTabs te openen of te gebruiken gaat u akkoord met deze Servicevoorwaarden en ons ',
      s1p1Link: 'Privacybeleid',
      s1p1End: '. Als u niet akkoord gaat, stop dan met het gebruik van de site.',
      s2Title: '2. Toegestaan gebruik & tools',
      s2p1: 'GeekTabs biedt webgebaseerde productiviteitstools — aanpasbaar startdashboard, bladwijzers, agenda, wetenschappelijke en valutarekenmachine, notities, takenlijst, IP-check en snelheidstest — voor persoonlijk en rechtmatig gebruik.',
      s2p2: 'U stemt ermee in geen misbruik te maken van diagnostische eindpunten, geen overmatig geautomatiseerd verkeer te sturen en de werking van het platform niet te verstoren.',
      s3Title: '3. Lokale gegevens & back-upverantwoordelijkheid',
      s3p1: 'Omdat notities, bladwijzers, afspraken, taken en instellingen lokaal in uw browser worden bewaard, kan het wissen van sitegegevens onopgeslagen records verwijderen. Maak regelmatig back-ups via Gegevensback-up & herstel in Instellingen.',
      s4Title: '4. Links van derden & disclaimers',
      s4p1: 'Externe websites via bladwijzers of zoekmachines worden onafhankelijk beheerd door derden. GeekTabs biedt alle tools en markt-, weer- en netwerkschattingen "zoals ze zijn" zonder garantie van ononderbroken beschikbaarheid.',
    },
    about: {
      eyebrow: 'Over ons platform',
      title: 'Over GeekTabs',
      subtitle: 'Uw dagelijkse plek voor nuttige websites, focustools en productiviteit.',
      missionTitle: 'Onze missie',
      missionBody: 'GeekTabs maakt van uw dagelijkse startpagina een rustige, verzorgde en echt nuttige werkruimte door bladwijzers, weer, berekeningen, notities en netwerktools overzichtelijk op één plek te bundelen.',
      toolsTitle: 'Inbegrepen kerntools',
      cards: [
        { title: 'Startdashboard & Weer', body: 'Persoonlijke begroeting, nauwkeurige klok, zoekbalk voor meerdere zoekmachines, live lokaal weer en Dagelijks Overzicht.' },
        { title: 'Bladwijzers & Snelkoppelingen', body: 'Visuele categorieën met directe toegang tot AI-tools, kantoorapps, entertainment en persoonlijke links.' },
        { title: 'Agenda & Feestdagen', body: 'Interactieve maandplanner voor eigen afspraken, herinneringen en feestdagen van meerdere landen.' },
        { title: 'Rekenmachine, IP & Snelheid', body: 'Standaard en wetenschappelijk rekenen, live wisselkoersen, IPv4/IPv6-diagnose en breedbandsnelheidstest.' },
      ],
      privacyTitle: 'Privacy voorop & 23 talen',
      privacyBody: 'Met 23 talen, lichte/donkere/glas-thema’s, 1920×1080 achtergronden en ingebouwde back-up past GeekTabs moeiteloos op desktop en mobiel terwijl uw gegevens in uw eigen browser blijven.',
    },
    contact: {
      eyebrow: 'Neem contact op',
      title: 'Contact opnemen',
      subtitle: 'Vragen, feedback, bugmeldingen of privacyverzoeken? We horen graag van u.',
      supportEmailTitle: 'Direct support-e-mailadres',
      supportEmailDesc: 'Voor algemene vragen, technische hulp en privacy- of juridische meldingen:',
      responseTimeTitle: 'Gebruikelijke reactietijd',
      responseTimeDesc: 'We bekijken berichten van maandag t/m vrijdag en streven naar een antwoord binnen 1–2 werkdagen.',
      submittedTitle: 'Bericht klaargezet',
      submittedBodyStart: 'Bedankt voor uw bericht aan GeekTabs. Klik hieronder om het direct via uw e-mailapp te verzenden of mail naar ',
      submittedBodyEnd: '.',
      openEmailBtn: 'Openen in e-mailapp',
      sendAnotherBtn: 'Nog een bericht sturen',
      nameLabel: 'Uw naam',
      namePlaceholder: 'Alex Morgan',
      emailLabel: 'E-mailadres',
      emailPlaceholder: 'u@voorbeeld.nl',
      topicLabel: 'Onderwerp',
      topics: ['Algemene vraag', 'Functiesuggestie', 'Bugmelding', 'Privacy & Juridisch', 'Advertenties & Partnerschappen'],
      messageLabel: 'Bericht',
      messagePlaceholder: 'Waarmee kunnen we helpen?',
      sendBtn: 'Bericht versturen',
    },
  },
  Swedish: {
    backToHome: 'Tillbaka till startsidan',
    navAria: 'Informationssidor',
    tabs: { about: 'Om oss', privacy: 'Integritetspolicy', terms: 'Användarvillkor', contact: 'Kontakt' },
    privacy: {
      eyebrow: 'Integritet & dataskydd',
      title: 'Integritetspolicy',
      updated: 'Senast uppdaterad: 23 november 2026',
      s1Title: '1. Information som lagras lokalt på din enhet',
      s1p1Prefix: 'GeekTabs är byggt med integritet i första rummet. Personliga data du skapar — bokmärken, kalenderhändelser, anteckningar, att göra-listor, temafärger, egna bakgrunder och språkval — lagras lokalt i din webbläsare via ',
      s1p1Suffix: ' och IndexedDB.',
      s1p2: 'Inget konto krävs för kärnfunktionerna och GeekTabs säljer aldrig dina personliga uppgifter till tredje part. Du kan när som helst exportera, säkerhetskopiera eller radera lokala data i Inställningar.',
      s2Title: '2. Externa verktyg & nätverksanrop',
      s2p1: 'Vissa valfria verktyg hämtar offentlig realtidsinformation vid behov: väderprognoser hämtas för vald stad; valutakonverteraren hämtar aktuella kurser; IP-kontrollen visar nätverksdata; och hastighetstestet mäter prestanda mot testservrar.',
      s3Title: '3. Annonser, cookies och Google AdSense',
      s3p1: 'GeekTabs kan visa annonser från tredjepartsleverantörer, inklusive Google AdSense, som använder cookies baserat på tidigare besök på denna eller andra webbplatser.',
      s3p2Start: 'Googles annonscookies möjliggör relevanta annonser baserat på besök på GeekTabs och andra sidor. Du kan välja bort personliga annonser i ',
      s3p2AdsSettings: 'Googles annonsinställningar',
      s3p2Mid: ' eller hantera tredjepartscookies på ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '.',
      s4Title: '4. Dina integritetsrättigheter & kontakt',
      s4p1Start: 'Beroende på din region (inklusive EES/Storbritannien under GDPR och Kalifornien under CCPA/CPRA) kan du rensa lokal lagring, hantera cookies i webbläsaren eller kontakta oss via vår ',
      s4p1Link: 'Kontaktsida',
      s4p1End: '.',
    },
    terms: {
      eyebrow: 'Användaravtal',
      title: 'Användarvillkor',
      updated: 'Senast uppdaterad: 23 november 2026',
      s1Title: '1. Godkännande av villkor',
      s1p1Start: 'Genom att använda GeekTabs godkänner du dessa Användarvillkor samt vår ',
      s1p1Link: 'Integritetspolicy',
      s1p1End: '. Om du inte godkänner villkoren bör du sluta använda webbplatsen.',
      s2Title: '2. Tillåten användning & verktyg',
      s2p1: 'GeekTabs erbjuder webbverktyg för produktivitet — anpassningsbar startsida, bokmärken, kalender, vetenskaplig och valutakalkylator, anteckningar, att göra-lista, IP-kontroll och hastighetstest — för personligt och lagligt bruk.',
      s2p2: 'Du samtycker till att inte missbruka diagnostikfunktioner, automatisera skadlig trafik eller störa plattformens drift.',
      s3Title: '3. Lokal lagring & ansvar för säkerhetskopior',
      s3p1: 'Eftersom anteckningar, bokmärken, kalenderposter och inställningar lagras lokalt i webbläsaren kan rensad webbplatsdata radera osparade poster. Vi rekommenderar regelbundna säkerhetskopior via Inställningar.',
      s4Title: '4. Länkar till tredje part & ansvarsfriskrivning',
      s4p1: 'Externa webbplatser drivs oberoende av tredje part under egna villkor. GeekTabs tillhandahåller alla verktyg och uppskattningar i befintligt skick utan garanti för oavbruten tillgänglighet.',
    },
    about: {
      eyebrow: 'Om vår plattform',
      title: 'Om GeekTabs',
      subtitle: 'Din dagliga plats för användbara webbplatser, fokusverktyg och produktivitet.',
      missionTitle: 'Vårt uppdrag',
      missionBody: 'GeekTabs förvandlar webbläsarens startsida till en lugn, stilren och användbar arbetsyta där bokmärken, väder, beräkningar, anteckningar och nätverksdiagnostik samlas utan störande flik-kaos.',
      toolsTitle: 'Centrala verktyg som ingår',
      cards: [
        { title: 'Startsida & Väder', body: 'Personlig hälsning, exakt klocka, multisök, lokal väderprognos i realtid och Dagens Sammanfattning.' },
        { title: 'Bokmärken & Snabblänkar', body: 'Kategoriserade bokmärken med snabb åtkomst till AI-verktyg, kontorsappar och egna genvägar.' },
        { title: 'Kalender & Helgdagar', body: 'Interaktiv månadsplanerare med händelser, påminnelser och helgdagar för flera länder.' },
        { title: 'Kalkylator, IP & Hastighetstest', body: 'Standard- och vetenskaplig matte, valutakurser i realtid, IPv4/IPv6-koll och bredbandstest.' },
      ],
      privacyTitle: 'Integritet först & stöd för 23 språk',
      privacyBody: 'Med 23 språk, ljusa/mörka/glas-teman, 1920×1080-bakgrunder och inbyggd backup anpassar sig GeekTabs smidigt mellan dator och mobil medan dina data stannar i din webbläsare.',
    },
    contact: {
      eyebrow: 'Hör av dig',
      title: 'Kontakta oss',
      subtitle: 'Frågor, feedback, felrapporter eller integritetsärenden? Vi hör gärna från dig.',
      supportEmailTitle: 'Direkt supportmejl',
      supportEmailDesc: 'För allmänna frågor, teknisk hjälp samt integritets- och juridiska ärenden:',
      responseTimeTitle: 'Normal svarstid',
      responseTimeDesc: 'Vi går igenom meddelanden måndag till fredag och siktar på att svara inom 1–2 arbetsdagar.',
      submittedTitle: 'Meddelandet är klart',
      submittedBodyStart: 'Tack för att du kontaktar GeekTabs. Klicka nedan för att skicka via din e-postapp, eller mejla ',
      submittedBodyEnd: '.',
      openEmailBtn: 'Öppna i e-postapp',
      sendAnotherBtn: 'Skicka ett till meddelande',
      nameLabel: 'Ditt namn',
      namePlaceholder: 'Alex Morgan',
      emailLabel: 'E-postadress',
      emailPlaceholder: 'du@exempel.se',
      topicLabel: 'Ämne',
      topics: ['Allmän fråga', 'Funktionsförslag', 'Felrapport', 'Integritet & juridik', 'Annonsering & samarbeten'],
      messageLabel: 'Meddelande',
      messagePlaceholder: 'Hur kan vi hjälpa dig?',
      sendBtn: 'Skicka meddelande',
    },
  },
  Finnish: {
    backToHome: 'Takaisin etusivulle',
    navAria: 'Tietosivut',
    tabs: { about: 'Tietoja', privacy: 'Tietosuoja', terms: 'Käyttöehdot', contact: 'Yhteystiedot' },
    privacy: {
      eyebrow: 'Tietosuoja & tietoturva',
      title: 'Tietosuojakäytäntö',
      updated: 'Päivitetty viimeksi: 23. marraskuuta 2026',
      s1Title: '1. Laitteellesi paikallisesti tallennettavat tiedot',
      s1p1Prefix: 'GeekTabs on suunniteltu tietosuoja edellä. Luomasi henkilökohtaiset tiedot — kirjanmerkit, kalenteritapahtumat, muistiinpanot, tehtävälistat, teemavärit, omat taustakuvat ja kieli — tallentuvat paikallisesti selaimeesi ',
      s1p1Suffix: ' ja IndexedDB-tallennustilan avulla.',
      s1p2: 'Perustoimintoihin ei vaadita rekisteröitymistä, eikä GeekTabs myy henkilötietoja kolmansille osapuolille. Voit viedä, varmuuskopioida tai poistaa paikalliset tiedot milloin tahansa Asetuksista.',
      s2Title: '2. Ulkoiset työkalut & verkkopyynnöt',
      s2p1: 'Tietyt valinnaiset työkalut hakevat julkisia tietoja pyynnöstä: sääennusteet hakevat valitun kaupungin tiedot, valuuttamuunnin hakee kurssit, IP-haku näyttää reititystietoja ja nopeustesti mittaa yhteyden suorituskykyä.',
      s3Title: '3. Mainonta, evästeet ja Google AdSense',
      s3p1: 'GeekTabs voi näyttää kolmansien osapuolien, kuten Google AdSensen, toimittamia mainoksia, jotka käyttävät evästeitä aiempien sivustovierailujen perusteella.',
      s3p2Start: 'Googlen mainosevästeet mahdollistavat mainosten näyttämisen vierailujen perusteella. Voit hallita personoitua mainontaa kohdassa ',
      s3p2AdsSettings: 'Googlen mainosasetukset',
      s3p2Mid: ' tai kolmannen osapuolen evästeitä osoitteessa ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '.',
      s4Title: '4. Tietosuojaoikeutesi & yhteydenotto',
      s4p1Start: 'Alueesi lainsäädännön mukaan (mukaan lukien ETA/UK GDPR ja Kalifornia CCPA/CPRA) voit tyhjentää selaimen paikallisen tallennustilan, hallita evästeitä tai ottaa yhteyttä ',
      s4p1Link: 'Yhteystiedot-sivumme',
      s4p1End: ' kautta.',
    },
    terms: {
      eyebrow: 'Palvelusopimus',
      title: 'Käyttöehdot',
      updated: 'Päivitetty viimeksi: 23. marraskuuta 2026',
      s1Title: '1. Ehtojen hyväksyminen',
      s1p1Start: 'Käyttämällä GeekTabsia hyväksyt nämä Käyttöehdot sekä ',
      s1p1Link: 'Tietosuojakäytäntömme',
      s1p1End: '. Jos et hyväksy ehtoja, lopeta sivuston käyttö.',
      s2Title: '2. Sallittu käyttö & työkalut',
      s2p1: 'GeekTabs tarjoaa selainpohjaisia tuottavuustyökaluja — aloitussivun, kirjanmerkit, kalenterin, tieteellisen ja valuuttalaskimen, muistiinpanot, tehtävälistan, IP-haun ja nopeustestin — henkilökohtaiseen ja lailliseen käyttöön.',
      s2p2: 'Sitoudut olemaan käyttämättä verkkodiagnostiikkaa väärin, lähettämättä haitallista automatisoitua liikennettä tai häiritsemättä palvelun toimintaa.',
      s3Title: '3. Paikalliset tiedot & varmuuskopiointi',
      s3p1: 'Koska muistiinpanot, kirjanmerkit, tapahtumat ja asetukset tallennetaan paikallisesti selaimeen, sivustotietojen tyhjentäminen voi poistaa tallentamattomat tiedot. Suosittelemme säännöllistä varmuuskopiointia Asetuksista.',
      s4Title: '4. Kolmannen osapuolen linkit & vastuuvapaus',
      s4p1: 'Kirjanmerkkien tai hakujen kautta avatut ulkoiset sivustot toimivat omien ehtojensa mukaisesti. GeekTabs tarjoaa työkalut ja arviot sellaisenaan ilman takuuta keskeytymättömästä saatavuudesta.',
    },
    about: {
      eyebrow: 'Tietoa alustasta',
      title: 'Tietoa GeekTabsista',
      subtitle: 'Päivittäinen tilasi hyödyllisille verkkosivuille, keskittymistyökaluille ja tuottavuudelle.',
      missionTitle: 'Missiomme',
      missionBody: 'GeekTabs muuttaa selaimen aloitussivun rauhalliseksi, selkeäksi ja hyödylliseksi työtilaksi kokoamalla kirjanmerkit, sään, laskelmat, muistiinpanot ja verkkotestit yhdelle häiriöttömälle näkymälle.',
      toolsTitle: 'Sisältyvät ydintyökalut',
      cards: [
        { title: 'Aloitussivu & Sää', body: 'Yksilöllinen tervehdys, tarkka kello, monihakukone, reaaliaikainen sääennuste ja Päivän Katsaus.' },
        { title: 'Kirjanmerkit & Pikalinkit', body: 'Visuaalisesti luokitellut kirjanmerkit tekoälytyökaluille, toimistosovelluksille ja omille linkeille.' },
        { title: 'Kalenteri & Pyhäpäivät', body: 'Interaktiivinen kuukausikalenteri omille tapahtumille, muistutuksille ja useiden maiden juhlapyhille.' },
        { title: 'Laskin, IP & Nopeustesti', body: 'Perus- ja tieteellinen laskin, live-valuuttakurssit, IPv4/IPv6-tarkistus ja laajakaistan nopeustesti.' },
      ],
      privacyTitle: 'Tietosuoja edellä & 23 kieltä',
      privacyBody: '23 tuettua kieltä, vaalea/tumma/lasi-teemat, 1920×1080 taustakuvat ja sisäänrakennettu varmuuskopiointi mukautuvat sujuvasti työpöydälle ja mobiiliin tietojen pysyessä selaimessasi.',
    },
    contact: {
      eyebrow: 'Ota yhteyttä',
      title: 'Ota yhteyttä',
      subtitle: 'Kysymyksiä, palautetta, vikailmoituksia tai tietosuojapyyntöjä? Kuulemme sinusta mielellämme.',
      supportEmailTitle: 'Suora tukisähköposti',
      supportEmailDesc: 'Yleisiin kysymyksiin, tekniseen tukeen sekä tietosuoja- ja lakiasioihin:',
      responseTimeTitle: 'Tyypillinen vastausaika',
      responseTimeDesc: 'Käsittelemme viestit maanantaista perjantaihin ja pyrimme vastaamaan 1–2 arkipäivässä.',
      submittedTitle: 'Viesti valmiina',
      submittedBodyStart: 'Kiitos yhteydenotostasi GeekTabsiin. Napsauta alta lähettääksesi sähköpostisovelluksellasi tai lähetä suoraan osoitteeseen ',
      submittedBodyEnd: '.',
      openEmailBtn: 'Avaa sähköpostisovelluksessa',
      sendAnotherBtn: 'Lähetä uusi viesti',
      nameLabel: 'Nimesi',
      namePlaceholder: 'Alex Morgan',
      emailLabel: 'Sähköpostiosoite',
      emailPlaceholder: 'sina@esimerkki.fi',
      topicLabel: 'Aihe',
      topics: ['Yleinen kysymys', 'Ominaisuusehdotus', 'Vikailmoitus', 'Tietosuoja & lakiasiat', 'Mainonta & kumppanuudet'],
      messageLabel: 'Viesti',
      messagePlaceholder: 'Kuinka voimme auttaa?',
      sendBtn: 'Lähetä viesti',
    },
  },
  Hindi: {
    backToHome: 'होम पर लौटें',
    navAria: 'जानकारी पृष्ठ',
    tabs: { about: 'हमारे बारे में', privacy: 'गोपनीयता नीति', terms: 'सेवा की शर्तें', contact: 'संपर्क करें' },
    privacy: {
      eyebrow: 'गोपनीयता और डेटा सुरक्षा',
      title: 'गोपनीयता नीति',
      updated: 'अंतिम अद्यतन: 23 नवंबर 2026',
      s1Title: '1. आपके डिवाइस पर स्थानीय रूप से सहेजी गई जानकारी',
      s1p1Prefix: 'GeekTabs को गोपनीयता-प्रथम संरचना के साथ बनाया गया है। आपके द्वारा बनाई गई व्यक्तिगत सामग्री—जैसे बुकमार्क, कैलेंडर ईवेंट और रिमाइंडर, नोट्स, टू-डू सूचियाँ, थीम रंग, कस्टम वॉलपेपर और भाषा प्राथमिकताएँ—आपके वेब ब्राउज़र में ',
      s1p1Suffix: ' और IndexedDB के माध्यम से स्थानीय रूप से संग्रहीत होती हैं।',
      s1p2: 'मुख्य डैशबोर्ड सुविधाओं के लिए किसी खाते के पंजीकरण की आवश्यकता नहीं है और GeekTabs आपका व्यक्तिगत डेटा किसी तीसरे पक्ष को नहीं बेचता। आप सेटिंग्स से कभी भी अपना स्थानीय डेटा एक्सपोर्ट, बैकअप या हटा सकते हैं।',
      s2Title: '2. बाहरी उपयोगिताएँ और नेटवर्क अनुरोध',
      s2p1: 'कुछ वैकल्पिक टूल आवश्यकता अनुसार लाइव सार्वजनिक जानकारी प्राप्त करते हैं: मौसम पूर्वानुमान आपके चुने शहर या निर्देशांक से मौसम डेटा लाता है; मुद्रा परिवर्तक लाइव विनिमय दरें प्राप्त करता है; IP लुकअप नेटवर्क रूटिंग दिखाता है; और स्पीड टेस्ट परीक्षण सर्वर से गति व लेटेंसी मापता है।',
      s3Title: '3. विज्ञापन, कुकीज़ और Google AdSense',
      s3p1: 'GeekTabs Google AdSense सहित तृतीय-पक्ष विक्रेताओं द्वारा दिए गए विज्ञापन दिखा सकता है, जो पिछली वेबसाइट विज़िट के आधार पर विज्ञापन दिखाने के लिए कुकीज़ का उपयोग करते हैं।',
      s3p2Start: 'Google द्वारा विज्ञापन कुकीज़ के उपयोग से इस साइट और अन्य साइटों की विज़िट के आधार पर विज्ञापन दिखाए जा सकते हैं। आप ',
      s3p2AdsSettings: 'Google विज्ञापन सेटिंग्स',
      s3p2Mid: ' पर जाकर वैयक्तिकृत विज्ञापन बंद कर सकते हैं या ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: ' पर तृतीय-पक्ष कुकीज़ प्रबंधित कर सकते हैं।',
      s4Title: '4. आपके गोपनीयता अधिकार और संपर्क',
      s4p1Start: 'आपके क्षेत्र के कानूनों (EEA/UK GDPR और कैलिफ़ोर्निया CCPA/CPRA सहित) के अनुसार आप स्थानीय ब्राउज़र स्टोरेज साफ़ कर सकते हैं, कुकी प्राथमिकताएँ नियंत्रित कर सकते हैं या हमारे ',
      s4p1Link: 'संपर्क पृष्ठ',
      s4p1End: ' के माध्यम से प्रश्न पूछ सकते हैं।',
    },
    terms: {
      eyebrow: 'सेवा अनुबंध',
      title: 'सेवा की शर्तें',
      updated: 'अंतिम अद्यतन: 23 नवंबर 2026',
      s1Title: '1. शर्तों की स्वीकृति',
      s1p1Start: 'GeekTabs का उपयोग करके आप इन सेवा की शर्तों और हमारी ',
      s1p1Link: 'गोपनीयता नीति',
      s1p1End: ' से सहमत होते हैं। यदि आप सहमत नहीं हैं, तो कृपया साइट का उपयोग न करें।',
      s2Title: '2. अनुमत उपयोग और उत्पादकता उपकरण',
      s2p1: 'GeekTabs व्यक्तिगत और वैध सूचनात्मक उपयोग के लिए अनुकूलन योग्य स्टार्ट डैशबोर्ड, बुकमार्क, कैलेंडर, वैज्ञानिक व मुद्रा कैलकुलेटर, नोट्स, कार्य सूची, IP जाँच और स्पीड टेस्ट जैसी सेवाएँ प्रदान करता है।',
      s2p2: 'आप सहमत हैं कि आप नेटवर्क निदान एंडपॉइंट का दुरुपयोग नहीं करेंगे, स्वचालित दुरुपयोग ट्रैफ़िक नहीं भेजेंगे और प्लेटफ़ॉर्म के सामान्य संचालन में बाधा नहीं डालेंगे।',
      s3Title: '3. स्थानीय डेटा और बैकअप ज़िम्मेदारी',
      s3p1: 'नोट्स, बुकमार्क, कैलेंडर आइटम, कार्य और सेटिंग्स ब्राउज़र में स्थानीय रूप से संग्रहीत होते हैं, इसलिए साइट डेटा साफ़ करने या ब्राउज़र बदलने से डेटा हट सकता है। सेटिंग्स से नियमित बैकअप लेने की सलाह दी जाती है।',
      s4Title: '4. तृतीय-पक्ष लिंक और अस्वीकरण',
      s4p1: 'बुकमार्क या खोज से खुलने वाली बाहरी वेबसाइटें स्वतंत्र तृतीय पक्षों द्वारा संचालित होती हैं। GeekTabs सभी टूल और बाज़ार/मौसम/नेटवर्क अनुमान "जैसा है" आधार पर बिना किसी निरंतर उपलब्धता या वित्तीय सटीकता की गारंटी के प्रदान करता है।',
    },
    about: {
      eyebrow: 'हमारे प्लेटफ़ॉर्म के बारे में',
      title: 'GeekTabs के बारे में',
      subtitle: 'उपयोगी वेबसाइटों, फ़ोकस टूल और दैनिक उत्पादकता के लिए आपका स्थान।',
      missionTitle: 'हमारा मिशन',
      missionBody: 'GeekTabs को रोज़मर्रा के ब्राउज़र स्टार्ट पेज को एक शांत, सुंदर और वास्तव में उपयोगी कार्यक्षेत्र में बदलने के लिए बनाया गया है—जहाँ बुकमार्क, मौसम, गणना, नोट्स और नेटवर्क जाँच एक ही साफ़ इंटरफ़ेस में मिलते हैं।',
      toolsTitle: 'शामिल मुख्य टूल',
      cards: [
        { title: 'होम डैशबोर्ड और मौसम', body: 'व्यक्तिगत अभिवादन, सटीक घड़ी, मल्टी-इंजन खोज, लाइव स्थानीय मौसम और दैनिक सारांश कार्ड।' },
        { title: 'बुकमार्क और त्वरित लिंक', body: 'AI टूल्स, ऑफिस सूट, मनोरंजन और निजी शॉर्टकट के लिए सुव्यवस्थित विज़ुअल बुकमार्क।' },
        { title: 'कैलेंडर और अवकाश', body: 'व्यक्तिगत इवेंट, रिमाइंडर और बहु-देशीय सार्वजनिक अवकाश ट्रैकिंग वाला मासिक प्लानर।' },
        { title: 'कैलकुलेटर, IP और स्पीड टेस्ट', body: 'मानक व वैज्ञानिक गणित, लाइव मुद्रा विनिमय, IPv4/IPv6 जाँच और रीयल-टाइम ब्रॉडबैंड स्पीड टेस्ट।' },
      ],
      privacyTitle: 'गोपनीयता-प्रथम और 23 भाषा समर्थन',
      privacyBody: '23 भाषाओं, लाइट/डार्क/ग्लास कार्ड थीम, 1920×1080 वॉलपेपर प्रीसेट और अंतर्निहित बैकअप/रिस्टोर के साथ GeekTabs डेस्कटॉप और मोबाइल दोनों पर सहज काम करता है।',
    },
    contact: {
      eyebrow: 'संपर्क करें',
      title: 'हमसे संपर्क करें',
      subtitle: 'सवाल, सुझाव, बग रिपोर्ट या गोपनीयता अनुरोध? हमें आपकी बात सुनकर खुशी होगी।',
      supportEmailTitle: 'सीधा सहायता ईमेल',
      supportEmailDesc: 'सामान्य पूछताछ, तकनीकी सहायता और गोपनीयता या कानूनी सूचनाओं के लिए:',
      responseTimeTitle: 'सामान्य प्रतिक्रिया समय',
      responseTimeDesc: 'हम सोमवार से शुक्रवार संदेशों की समीक्षा करते हैं और 1–2 कार्यदिवसों में उत्तर देने का प्रयास करते हैं।',
      submittedTitle: 'संदेश तैयार है',
      submittedBodyStart: 'GeekTabs से संपर्क करने के लिए धन्यवाद। अपने ईमेल ऐप से भेजने के लिए नीचे क्लिक करें या सीधे ईमेल करें: ',
      submittedBodyEnd: '।',
      openEmailBtn: 'ईमेल ऐप में खोलें',
      sendAnotherBtn: 'एक और संदेश भेजें',
      nameLabel: 'आपका नाम',
      namePlaceholder: 'आरव शर्मा',
      emailLabel: 'ईमेल पता',
      emailPlaceholder: 'you@example.com',
      topicLabel: 'विषय',
      topics: ['सामान्य पूछताछ', 'फ़ीचर सुझाव', 'बग रिपोर्ट', 'गोपनीयता और कानूनी', 'विज्ञापन और साझेदारी'],
      messageLabel: 'संदेश',
      messagePlaceholder: 'हम आपकी क्या सहायता कर सकते हैं?',
      sendBtn: 'संदेश भेजें',
    },
  },
  Norwegian: {
    backToHome: 'Tilbake til forsiden',
    navAria: 'Informasjonssider',
    tabs: { about: 'Om oss', privacy: 'Personvern', terms: 'Vilkår', contact: 'Kontakt' },
    privacy: {
      eyebrow: 'Personvern & datasikkerhet',
      title: 'Personvernerklæring',
      updated: 'Sist oppdatert: 23. november 2026',
      s1Title: '1. Informasjon som lagres lokalt på enheten din',
      s1p1Prefix: 'GeekTabs er bygget med personvern først. Personlige data du oppretter — bokmerker, kalenderhendelser, notater, gjøremålslister, temafarger, bakgrunner og språkvalg — lagres lokalt i nettleseren din via ',
      s1p1Suffix: ' og IndexedDB.',
      s1p2: 'Ingen kontoregistrering kreves for kjernefunksjonene, og GeekTabs selger ikke dine personlige data til tredjeparter. Du kan når som helst eksportere, sikkerhetskopiere eller slette lokale data fra Innstillinger.',
      s2Title: '2. Eksterne verktøy & nettverksforespørsler',
      s2p1: 'Enkelte valgfrie verktøy henter offentlig sanntidsinformasjon ved behov: værvarsel henter data for valgt sted, valutakalkulatoren henter kurser, IP-oppslaget viser rutingsmetadata, og hastighetstesten måler båndbredde og forsinkelse.',
      s3Title: '3. Annonsering, informasjonskapsler og Google AdSense',
      s3p1: 'GeekTabs kan vise annonser fra tredjepartsleverandører, inkludert Google AdSense, som bruker informasjonskapsler basert på tidligere besøk på dette eller andre nettsteder.',
      s3p2Start: 'Googles annonsekapsler gjør det mulig å vise annonser basert på besøk hos GeekTabs og andre sider. Du kan velge bort personlige annonser i ',
      s3p2AdsSettings: 'Googles annonseinnstillinger',
      s3p2Mid: ' eller administrere tredjepartskapsler på ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '.',
      s4Title: '4. Dine personvernrettigheter & kontakt',
      s4p1Start: 'Avhengig av region (inkludert EØS/Storbritannia under GDPR og California under CCPA/CPRA) kan du tømme lokal nettleserlagring, styre informasjonskapsler eller kontakte oss via vår ',
      s4p1Link: 'Kontaktside',
      s4p1End: '.',
    },
    terms: {
      eyebrow: 'Tjenesteavtale',
      title: 'Vilkår for bruk',
      updated: 'Sist oppdatert: 23. november 2026',
      s1Title: '1. Aksept av vilkår',
      s1p1Start: 'Ved å bruke GeekTabs godtar du disse vilkårene og vår ',
      s1p1Link: 'Personvernerklæring',
      s1p1End: '. Hvis du ikke godtar vilkårene, ber vi deg avslutte bruken av nettstedet.',
      s2Title: '2. Tillatt bruk & produktivitetsverktøy',
      s2p1: 'GeekTabs tilbyr nettbaserte verktøy — startdashboard, bokmerker, kalender, vitenskapelig og valutakalkulator, notater, gjøremålsliste, IP-oppslag og hastighetstest — til personlig og lovlig informasjonsbruk.',
      s2p2: 'Du samtykker i å ikke misbruke diagnoseendepunkter, sende skadelig automatisert trafikk eller forstyrre plattformens normale drift.',
      s3Title: '3. Lokale data & ansvar for sikkerhetskopiering',
      s3p1: 'Fordi notater, bokmerker, kalenderoppføringer, oppgaver og innstillinger lagres lokalt i nettleseren, kan sletting av nettstedsdata fjerne ulagrede oppføringer. Vi anbefaler jevnlige sikkerhetskopier i Innstillinger.',
      s4Title: '4. Tredjepartslenker & ansvarsfraskrivelse',
      s4p1: 'Eksterne nettsteder styres uavhengig av tredjeparter under egne vilkår. GeekTabs leverer alle verktøy og estimater «som de er» uten garanti for uavbrutt tilgjengelighet.',
    },
    about: {
      eyebrow: 'Om plattformen vår',
      title: 'Om GeekTabs',
      subtitle: 'Ditt daglige rom for nyttige nettsider, fokusverktøy og produktivitet.',
      missionTitle: 'Vårt oppdrag',
      missionBody: 'GeekTabs gjør nettleserens startside til et rolig, ryddig og nyttig arbeidsområde der bokmerker, vær, utregninger, notater og nettverksdiagnostikk samles på ett sted.',
      toolsTitle: 'Kjerneverktøy som følger med',
      cards: [
        { title: 'Startdashboard & Vær', body: 'Personlig hilsen, presis klokke, multisøk, lokalt værvarsel i sanntid og Daglig Sammendrag.' },
        { title: 'Bokmerker & Hurtiglenker', body: 'Kategoriserte bokmerker med rask tilgang til AI-verktøy, kontorpakker og personlige lenker.' },
        { title: 'Kalender & Helligdager', body: 'Interaktiv månedskalender for hendelser, påminnelser og helligdager i flere land.' },
        { title: 'Kalkulator, IP & Hastighetstest', body: 'Standard og vitenskapelig matte, live valutakurser, IPv4/IPv6-sjekk og bredbåndstest.' },
      ],
      privacyTitle: 'Personvern først & 23 språk',
      privacyBody: 'Med 23 språk, lyse/mørke/glass-temaer, 1920×1080-bakgrunner og innebygd sikkerhetskopiering tilpasser GeekTabs seg sømløst til både PC og mobil.',
    },
    contact: {
      eyebrow: 'Ta kontakt',
      title: 'Kontakt oss',
      subtitle: 'Spørsmål, tilbakemeldinger, feilrapporter eller personvernhenvendelser? Vi vil gjerne høre fra deg.',
      supportEmailTitle: 'Direkte e-post for brukerstøtte',
      supportEmailDesc: 'For generelle henvendelser, teknisk hjelp samt personvern- eller juridiske meldinger:',
      responseTimeTitle: 'Vanlig svartid',
      responseTimeDesc: 'Vi gjennomgår meldinger mandag til fredag og svarer normalt innen 1–2 virkedager.',
      submittedTitle: 'Melding klargjort',
      submittedBodyStart: 'Takk for at du kontakter GeekTabs. Klikk nedenfor for å sende via e-postappen din, eller skriv til ',
      submittedBodyEnd: '.',
      openEmailBtn: 'Åpne i e-postapp',
      sendAnotherBtn: 'Send en ny melding',
      nameLabel: 'Ditt navn',
      namePlaceholder: 'Alex Morgan',
      emailLabel: 'E-postadresse',
      emailPlaceholder: 'du@eksempel.no',
      topicLabel: 'Emne',
      topics: ['Generell henvendelse', 'Funksjonsforslag', 'Feilrapport', 'Personvern & juridisk', 'Annonsering & samarbeid'],
      messageLabel: 'Melding',
      messagePlaceholder: 'Hvordan kan vi hjelpe?',
      sendBtn: 'Send melding',
    },
  },
  Thai: {
    backToHome: 'กลับสู่หน้าแรก',
    navAria: 'หน้าข้อมูล',
    tabs: { about: 'เกี่ยวกับ', privacy: 'นโยบายความเป็นส่วนตัว', terms: 'ข้อกำหนดการใช้งาน', contact: 'ติดต่อเรา' },
    privacy: {
      eyebrow: 'ความเป็นส่วนตัวและการคุ้มครองข้อมูล',
      title: 'นโยบายความเป็นส่วนตัว',
      updated: 'อัปเดตล่าสุด: 23 พฤศจิกายน 2026',
      s1Title: '1. ข้อมูลที่จัดเก็บไว้ในอุปกรณ์ของคุณ',
      s1p1Prefix: 'GeekTabs ออกแบบโดยคำนึงถึงความเป็นส่วนตัวเป็นหลัก ข้อมูลส่วนตัวที่คุณสร้าง—เช่น บุ๊กมาร์ก กิจกรรมและการแจ้งเตือนในปฏิทิน บันทึก รายการสิ่งที่ต้องทำ สีธีม วอลเปเปอร์ และภาษา—จะถูกเก็บไว้ในเบราว์เซอร์ของคุณผ่าน ',
      s1p1Suffix: ' และ IndexedDB',
      s1p2: 'ไม่จำเป็นต้องลงทะเบียนบัญชีเพื่อใช้งานหลัก และ GeekTabs ไม่ขายข้อมูลส่วนตัวของคุณแก่บุคคลที่สาม คุณสามารถส่งออก สำรอง หรือลบข้อมูลในเครื่องได้ทุกเมื่อที่การตั้งค่า',
      s2Title: '2. เครื่องมือภายนอกและคำขอเครือข่าย',
      s2p1: 'เครื่องมือเสริมบางอย่างจะดึงข้อมูลสาธารณะแบบเรียลไทม์เมื่อใช้งาน เช่น พยากรณ์อากาศดึงข้อมูลตามเมืองหรือพิกัด การแปลงสกุลเงินดึงอัตราแลกเปลี่ยนสด การตรวจ IP แสดงเส้นทางเครือข่าย และทดสอบความเร็ววัดค่าการรับส่งและความหน่วง',
      s3Title: '3. โฆษณา คุกกี้ และ Google AdSense',
      s3p1: 'GeekTabs อาจแสดงโฆษณาจากผู้ให้บริการภายนอก รวมถึง Google AdSense ซึ่งใช้คุกกี้เพื่อแสดงโฆษณาตามการเข้าชมเว็บไซต์นี้หรือเว็บไซต์อื่นก่อนหน้า',
      s3p2Start: 'การใช้คุกกี้โฆษณาของ Google ช่วยให้แสดงโฆษณาตามการเข้าชม GeekTabs และเว็บอื่นได้ คุณสามารถปิดโฆษณาส่วนบุคคลได้ที่ ',
      s3p2AdsSettings: 'การตั้งค่าโฆษณา Google',
      s3p2Mid: ' หรือจัดการคุกกี้บุคคลที่สามที่ ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '',
      s4Title: '4. สิทธิความเป็นส่วนตัวและการติดต่อ',
      s4p1Start: 'ขึ้นอยู่กับกฎหมายในภูมิภาคของคุณ (รวมถึง EEA/UK ภายใต้ GDPR และแคลิฟอร์เนียภายใต้ CCPA/CPRA) คุณสามารถล้างข้อมูลเบราว์เซอร์ จัดการคุกกี้ หรือสอบถามผ่าน ',
      s4p1Link: 'หน้าติดต่อเรา',
      s4p1End: '',
    },
    terms: {
      eyebrow: 'ข้อตกลงการให้บริการ',
      title: 'ข้อกำหนดการใช้งาน',
      updated: 'อัปเดตล่าสุด: 23 พฤศจิกายน 2026',
      s1Title: '1. การยอมรับข้อกำหนด',
      s1p1Start: 'การเข้าถึงหรือใช้งาน GeekTabs ถือว่าคุณยอมรับข้อกำหนดการใช้งานเหล่านี้และ ',
      s1p1Link: 'นโยบายความเป็นส่วนตัว',
      s1p1End: ' ของเรา หากไม่ยอมรับโปรดหยุดใช้งานเว็บไซต์',
      s2Title: '2. การใช้งานที่อนุญาตและเครื่องมือการทำงาน',
      s2p1: 'GeekTabs ให้บริการเครื่องมือบนเว็บ ได้แก่ แดชบอร์ดเริ่มต้น บุ๊กมาร์ก ปฏิทิน เครื่องคิดเลขวิทยาศาสตร์และอัตราแลกเปลี่ยน บันทึก รายการงาน ตรวจ IP และทดสอบความเร็ว เพื่อการใช้งานส่วนตัวและถูกต้องตามกฎหมาย',
      s2p2: 'คุณตกลงว่าจะไม่ใช้เครื่องมือวินิจฉัยเครือข่ายในทางที่ผิด ไม่สร้างทราฟฟิกอัตโนมัติในทางมิชอบ ไม่พยายามเข้าถึงโดยไม่ได้รับอนุญาต และไม่รบกวนการทำงานของระบบ',
      s3Title: '3. ข้อมูลในเครื่องและความรับผิดชอบในการสำรองข้อมูล',
      s3p1: 'เนื่องจากบันทึก บุ๊กมาร์ก ปฏิทิน งาน และค่าตั้งต่าง ๆ เก็บไว้ในเบราว์เซอร์ของคุณ การล้างข้อมูลไซต์หรือเปลี่ยนเบราว์เซอร์อาจทำให้ข้อมูลที่ยังไม่สำรองหายไป แนะนำให้สำรองข้อมูลเป็นประจำในการตั้งค่า',
      s4Title: '4. ลิงก์ภายนอกและการปฏิเสธความรับผิด',
      s4p1: 'เว็บไซต์ภายนอกที่เปิดผ่านบุ๊กมาร์กหรือการค้นหาอยู่ภายใต้ข้อกำหนดของผู้ให้บริการรายนั้น GeekTabs ให้บริการเครื่องมือและข้อมูลประมาณการตามสภาพที่เป็นอยู่โดยไม่รับประกันความพร้อมใช้งานตลอดเวลาหรือความถูกต้องทางการเงิน',
    },
    about: {
      eyebrow: 'เกี่ยวกับแพลตฟอร์มของเรา',
      title: 'เกี่ยวกับ GeekTabs',
      subtitle: 'พื้นที่ประจำวันของคุณสำหรับเว็บไซต์ที่มีประโยชน์ เครื่องมือโฟกัส และประสิทธิภาพการทำงาน',
      missionTitle: 'พันธกิจของเรา',
      missionBody: 'GeekTabs สร้างขึ้นเพื่อเปลี่ยนหน้าเริ่มต้นเบราว์เซอร์ในทุกวันให้เป็นพื้นที่ทำงานที่สงบ สวยงาม และใช้งานได้จริง รวมบุ๊กมาร์ก สภาพอากาศ การคำนวณ บันทึก และเครื่องมือเครือข่ายไว้ในหน้าจอเดียว',
      toolsTitle: 'เครื่องมือหลักที่มีให้ใช้งาน',
      cards: [
        { title: 'แดชบอร์ดหน้าแรก & สภาพอากาศ', body: 'คำทักทายส่วนตัว นาฬิกาแม่นยำ ค้นหาหลายเครื่องมือ พยากรณ์อากาศสด และการ์ดสรุปประจำวัน' },
        { title: 'บุ๊กมาร์ก & ลิงก์ด่วน', body: 'จัดหมวดหมู่บุ๊กมาร์กเข้าถึง AI ชุดทำงาน ความบันเทิง และทางลัดส่วนตัวได้ในคลิกเดียว' },
        { title: 'ปฏิทิน & วันหยุด', body: 'ตัววางแผนรายเดือนแบบโต้ตอบ รองรับกิจกรรม การแจ้งเตือน และวันหยุดหลายประเทศ' },
        { title: 'เครื่องคิดเลข IP & ทดสอบความเร็ว', body: 'คำนวณทั่วไปและวิทยาศาสตร์ อัตราแลกเปลี่ยนสด ตรวจ IPv4/IPv6 และทดสอบสปีดเน็ต' },
      ],
      privacyTitle: 'เน้นความเป็นส่วนตัวและรองรับ 23 ภาษา',
      privacyBody: 'รองรับ 23 ภาษา ธีมการ์ดสว่าง/มืด/กระจก วอลเปเปอร์ 1920×1080 และระบบสำรองข้อมูลในตัว ใช้ได้ลื่นไหลทั้งบนเดสก์ท็อปและมือถือโดยข้อมูลยังอยู่ในเบราว์เซอร์ของคุณ',
    },
    contact: {
      eyebrow: 'ติดต่อเรา',
      title: 'ติดต่อเรา',
      subtitle: 'มีคำถาม ข้อเสนอแนะ รายงานบั๊ก หรือคำขอเรื่องความเป็นส่วนตัว? เรายินดีรับฟังจากคุณ',
      supportEmailTitle: 'อีเมลฝ่ายสนับสนุนโดยตรง',
      supportEmailDesc: 'สำหรับคำถามทั่วไป การช่วยเหลือทางเทคนิค และแจ้งเรื่องกฎหมายหรือความเป็นส่วนตัว:',
      responseTimeTitle: 'ระยะเวลาตอบกลับโดยทั่วไป',
      responseTimeDesc: 'เราตรวจสอบข้อความวันจันทร์ถึงศุกร์ และมุ่งตอบกลับภายใน 1–2 วันทำการ',
      submittedTitle: 'เตรียมข้อความเรียบร้อยแล้ว',
      submittedBodyStart: 'ขอบคุณที่ติดต่อ GeekTabs คลิกด้านล่างเพื่อส่งผ่านแอปอีเมลของคุณ หรือส่งถึง ',
      submittedBodyEnd: '',
      openEmailBtn: 'เปิดในแอปอีเมล',
      sendAnotherBtn: 'ส่งข้อความอื่น',
      nameLabel: 'ชื่อของคุณ',
      namePlaceholder: 'สมชาย ใจดี',
      emailLabel: 'ที่อยู่อีเมล',
      emailPlaceholder: 'you@example.com',
      topicLabel: 'หัวข้อ',
      topics: ['สอบถามทั่วไป', 'เสนอแนะฟีเจอร์', 'รายงานปัญหา', 'ความเป็นส่วนตัวและกฎหมาย', 'โฆษณาและความร่วมมือ'],
      messageLabel: 'ข้อความ',
      messagePlaceholder: 'ให้เราช่วยเรื่องอะไรดี?',
      sendBtn: 'ส่งข้อความ',
    },
  },
  Portuguese: {
    backToHome: 'Voltar ao início',
    navAria: 'Páginas de informação',
    tabs: { about: 'Sobre', privacy: 'Política de Privacidade', terms: 'Termos de Serviço', contact: 'Contacto' },
    privacy: {
      eyebrow: 'Privacidade e Proteção de Dados',
      title: 'Política de Privacidade',
      updated: 'Última atualização: 23 de novembro de 2026',
      s1Title: '1. Informações armazenadas localmente no seu dispositivo',
      s1p1Prefix: 'O GeekTabs foi concebido com foco na privacidade. Os seus itens pessoais — marcadores, eventos e lembretes, notas, listas de tarefas, cores de tema, fundos personalizados e idioma — são guardados localmente no navegador através de ',
      s1p1Suffix: ' e IndexedDB.',
      s1p2: 'Não é necessário registo de conta para utilizar as funções principais e o GeekTabs não vende os seus dados pessoais a terceiros. Pode exportar, fazer cópia de segurança ou eliminar os dados locais em qualquer altura nas Definições.',
      s2Title: '2. Utilitários externos e pedidos de rede',
      s2p1: 'Algumas ferramentas opcionais obtêm dados públicos em tempo real mediante pedido: a meteorologia consulta a sua cidade ou coordenadas; o conversor cambial obtém cotações; a pesquisa IP mostra metadados de rede; e o teste de velocidade mede débito e latência.',
      s3Title: '3. Publicidade, Cookies e Google AdSense',
      s3p1: 'O GeekTabs pode apresentar anúncios de fornecedores terceiros, incluindo o Google AdSense, que utilizam cookies para apresentar publicidade com base em visitas anteriores a este ou outros sites.',
      s3p2Start: 'A utilização de cookies de publicidade pela Google permite apresentar anúncios relevantes com base nas suas visitas. Pode desativar anúncios personalizados em ',
      s3p2AdsSettings: 'Definições de Anúncios Google',
      s3p2Mid: ' ou gerir cookies de terceiros em ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '.',
      s4Title: '4. Os seus direitos de privacidade e contacto',
      s4p1Start: 'Consoante a sua região (incluindo EEE/Reino Unido ao abrigo do RGPD e Califórnia ao abrigo da CCPA/CPRA), pode limpar o armazenamento local do navegador, gerir cookies ou contactar-nos através da nossa ',
      s4p1Link: 'página de Contacto',
      s4p1End: '.',
    },
    terms: {
      eyebrow: 'Acordo de Serviço',
      title: 'Termos de Serviço',
      updated: 'Última atualização: 23 de novembro de 2026',
      s1Title: '1. Aceitação dos Termos',
      s1p1Start: 'Ao aceder ou utilizar o GeekTabs, concorda com estes Termos de Serviço e com a nossa ',
      s1p1Link: 'Política de Privacidade',
      s1p1End: '. Caso não concorde, interrompa a utilização do site.',
      s2Title: '2. Utilização permitida e ferramentas',
      s2p1: 'O GeekTabs disponibiliza utilitários web de produtividade — painel inicial personalizável, marcadores, calendário, calculadora científica e cambial, notas, tarefas, consulta IP e teste de velocidade — para uso pessoal e lícito.',
      s2p2: 'Compromete-se a não fazer uso indevido dos pontos de diagnóstico de rede, automatizar tráfego abusivo, tentar acesso não autorizado ou interferir no funcionamento normal da plataforma.',
      s3Title: '3. Dados locais e responsabilidade de cópia de segurança',
      s3p1: 'Como notas, marcadores, eventos, tarefas e definições são guardados localmente no navegador, limpar dados do site ou trocar de navegador pode apagar registos não guardados. Recomendamos cópias regulares nas Definições.',
      s4Title: '4. Ligações de terceiros e isenções',
      s4p1: 'Os sites externos acessíveis através de marcadores ou motores de pesquisa são operados de forma independente por terceiros. O GeekTabs fornece todas as ferramentas e estimativas «tal como estão», sem garantias de disponibilidade contínua ou exatidão financeira.',
    },
    about: {
      eyebrow: 'Sobre a Nossa Plataforma',
      title: 'Sobre o GeekTabs',
      subtitle: 'O seu espaço diário para sites úteis, ferramentas de foco e produtividade.',
      missionTitle: 'A Nossa Missão',
      missionBody: 'O GeekTabs transforma a página inicial do navegador num espaço de trabalho calmo, estético e verdadeiramente útil, reunindo marcadores, meteorologia, cálculos, notas e diagnósticos de rede numa interface sem distrações.',
      toolsTitle: 'Ferramentas Principais Incluídas',
      cards: [
        { title: 'Painel Inicial e Meteorologia', body: 'Saudação personalizada, relógio de precisão, pesquisa multimotor, meteorologia local ao vivo e cartões Resumo Diário.' },
        { title: 'Marcadores e Ligações Rápidas', body: 'Marcadores visuais categorizados com acesso imediato a ferramentas de IA, suítes de escritório e atalhos pessoais.' },
        { title: 'Calendário e Feriados', body: 'Agenda mensal interativa para eventos pessoais, lembretes e feriados oficiais de vários países.' },
        { title: 'Calculadora, IP e Velocidade', body: 'Cálculo padrão e científico, câmbio ao vivo, inspeção IPv4/IPv6 e teste de velocidade em tempo real.' },
      ],
      privacyTitle: 'Privacidade em primeiro lugar e 23 idiomas',
      privacyBody: 'Com 23 idiomas suportados, temas claro/escuro/vidro, papéis de parede 1920×1080 e cópia de segurança integrada, o GeekTabs adapta-se perfeitamente ao computador e telemóvel mantendo os seus dados no navegador.',
    },
    contact: {
      eyebrow: 'Fale Connosco',
      title: 'Contacte-nos',
      subtitle: 'Dúvidas, sugestões, relatórios de erros ou questões de privacidade? Gostaríamos de ouvir a sua opinião.',
      supportEmailTitle: 'E-mail de Suporte Direto',
      supportEmailDesc: 'Para questões gerais, apoio técnico e avisos legais ou de privacidade:',
      responseTimeTitle: 'Tempo habitual de resposta',
      responseTimeDesc: 'Analisamos as mensagens de segunda a sexta e procuramos responder em 1–2 dias úteis.',
      submittedTitle: 'Mensagem Preparada',
      submittedBodyStart: 'Obrigado por contactar o GeekTabs. Clique abaixo para enviar pela sua aplicação de e-mail ou escreva para ',
      submittedBodyEnd: '.',
      openEmailBtn: 'Abrir na App de E-mail',
      sendAnotherBtn: 'Enviar Outra Mensagem',
      nameLabel: 'O Seu Nome',
      namePlaceholder: 'Alex Morgan',
      emailLabel: 'Endereço de E-mail',
      emailPlaceholder: 'voce@exemplo.com',
      topicLabel: 'Assunto',
      topics: ['Questão Geral', 'Sugestão de Funcionalidade', 'Relatório de Erro', 'Privacidade e Legal', 'Publicidade e Parcerias'],
      messageLabel: 'Mensagem',
      messagePlaceholder: 'Como podemos ajudar?',
      sendBtn: 'Enviar Mensagem',
    },
  },
  Vietnamese: {
    backToHome: 'Quay lại trang chủ',
    navAria: 'Các trang thông tin',
    tabs: { about: 'Giới thiệu', privacy: 'Chính sách bảo mật', terms: 'Điều khoản dịch vụ', contact: 'Liên hệ' },
    privacy: {
      eyebrow: 'Quyền riêng tư & Bảo vệ dữ liệu',
      title: 'Chính sách bảo mật',
      updated: 'Cập nhật lần cuối: 23 tháng 11, 2026',
      s1Title: '1. Thông tin được lưu cục bộ trên thiết bị của bạn',
      s1p1Prefix: 'GeekTabs được xây dựng với kiến trúc ưu tiên quyền riêng tư. Dữ liệu cá nhân bạn tạo—bao gồm dấu trang, sự kiện và lời nhắc lịch, ghi chú, danh sách việc cần làm, màu giao diện, hình nền tùy chỉnh và ngôn ngữ—được lưu cục bộ trong trình duyệt qua ',
      s1p1Suffix: ' và IndexedDB.',
      s1p2: 'Bạn không cần đăng ký tài khoản để dùng các tính năng cốt lõi và GeekTabs không bán dữ liệu cá nhân của bạn cho bên thứ ba. Bạn có thể xuất, sao lưu hoặc xóa dữ liệu cục bộ bất kỳ lúc nào trong Cài đặt.',
      s2Title: '2. Tiện ích bên ngoài & Yêu cầu mạng',
      s2p1: 'Một số công cụ tùy chọn tải thông tin công khai trực tiếp khi bạn yêu cầu: dự báo thời tiết truy vấn theo thành phố hoặc tọa độ; chuyển đổi tiền tệ lấy tỷ giá hối đoái; tra cứu IP hiển thị thông tin tuyến mạng; và đo tốc độ kiểm tra băng thông cùng độ trễ tới máy chủ thử nghiệm.',
      s3Title: '3. Quảng cáo, Cookie và Google AdSense',
      s3p1: 'GeekTabs có thể hiển thị quảng cáo do bên thứ ba cung cấp, bao gồm Google AdSense. Các nhà cung cấp này sử dụng cookie để hiển thị quảng cáo dựa trên lượt truy cập trước đó của người dùng.',
      s3p2Start: 'Việc Google sử dụng cookie quảng cáo cho phép hiển thị quảng cáo phù hợp dựa trên lượt truy cập GeekTabs và các trang web khác. Bạn có thể tắt quảng cáo cá nhân hóa tại ',
      s3p2AdsSettings: 'Cài đặt quảng cáo Google',
      s3p2Mid: ' hoặc quản lý cookie bên thứ ba tại ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '.',
      s4Title: '4. Quyền riêng tư & Liên hệ',
      s4p1Start: 'Tùy theo khu vực (bao gồm EEA/Anh theo GDPR và California theo CCPA/CPRA), bạn có quyền xóa bộ nhớ trình duyệt cục bộ, quản lý cookie hoặc liên hệ với chúng tôi qua ',
      s4p1Link: 'trang Liên hệ',
      s4p1End: '.',
    },
    terms: {
      eyebrow: 'Thỏa thuận dịch vụ',
      title: 'Điều khoản dịch vụ',
      updated: 'Cập nhật lần cuối: 23 tháng 11, 2026',
      s1Title: '1. Chấp nhận điều khoản',
      s1p1Start: 'Khi truy cập hoặc sử dụng GeekTabs, bạn đồng ý tuân thủ các Điều khoản dịch vụ này và ',
      s1p1Link: 'Chính sách bảo mật',
      s1p1End: ' của chúng tôi. Nếu không đồng ý, vui lòng ngừng sử dụng trang web.',
      s2Title: '2. Phạm vi sử dụng hợp lệ & Công cụ năng suất',
      s2p1: 'GeekTabs cung cấp các tiện ích web phục vụ năng suất—bảng điều khiển trang chủ, quản lý dấu trang, lịch, máy tính khoa học và tiền tệ, ghi chú, danh sách công việc, tra cứu IP và đo tốc độ mạng—cho mục đích cá nhân và hợp pháp.',
      s2p2: 'Bạn đồng ý không lạm dụng điểm cuối chẩn đoán mạng, không tạo lưu lượng tự động gây hại, không truy cập trái phép hoặc làm gián đoạn hoạt động của nền tảng.',
      s3Title: '3. Dữ liệu cục bộ & Trách nhiệm sao lưu',
      s3p1: 'Do ghi chú, dấu trang, lịch, công việc và cài đặt được lưu cục bộ trong trình duyệt, việc xóa dữ liệu trang web hoặc đổi trình duyệt có thể làm mất dữ liệu chưa sao lưu. Hãy sao lưu định kỳ trong Cài đặt.',
      s4Title: '4. Liên kết bên thứ ba & Miễn trừ trách nhiệm',
      s4p1: 'Các trang web bên ngoài mở qua dấu trang hoặc công cụ tìm kiếm do bên thứ ba vận hành độc lập. GeekTabs cung cấp toàn bộ công cụ và số liệu ước tính theo nguyên trạng, không bảo đảm hoạt động liên tục hay độ chính xác tài chính.',
    },
    about: {
      eyebrow: 'Về nền tảng của chúng tôi',
      title: 'Giới thiệu GeekTabs',
      subtitle: 'Không gian hằng ngày cho các trang web hữu ích, công cụ tập trung và hiệu suất làm việc.',
      missionTitle: 'Sứ mệnh của chúng tôi',
      missionBody: 'GeekTabs biến trang bắt đầu trình duyệt hằng ngày thành không gian làm việc nhẹ nhàng, thẩm mỹ và thực sự hữu ích—gói gọn dấu trang, thời tiết, tính toán, ghi chú và kiểm tra mạng trong một giao diện không gây xao nhãng.',
      toolsTitle: 'Các công cụ chính đi kèm',
      cards: [
        { title: 'Trang chủ & Thời tiết', body: 'Lời chào cá nhân, đồng hồ chính xác, tìm kiếm đa công cụ, dự báo thời tiết trực tiếp và thẻ Tổng hợp hằng ngày.' },
        { title: 'Dấu trang & Liên kết nhanh', body: 'Dấu trang trực quan theo danh mục để mở nhanh công cụ AI, bộ ứng dụng văn phòng và lối tắt cá nhân.' },
        { title: 'Lịch & Ngày lễ', body: 'Lịch tháng tương tác hỗ trợ sự kiện cá nhân, lời nhắc và theo dõi ngày lễ nhiều quốc gia.' },
        { title: 'Máy tính, IP & Đo tốc độ', body: 'Tính toán cơ bản & khoa học, tỷ giá trực tiếp, kiểm tra mạng IPv4/IPv6 và đo tốc độ băng thông.' },
      ],
      privacyTitle: 'Ưu tiên quyền riêng tư & Hỗ trợ 23 ngôn ngữ',
      privacyBody: 'Với 23 ngôn ngữ, giao diện sáng/tối/kính, hình nền 1920×1080 và sao lưu tích hợp, GeekTabs thích ứng mượt mà trên cả máy tính và di động trong khi vẫn giữ dữ liệu trong trình duyệt của bạn.',
    },
    contact: {
      eyebrow: 'Kết nối với chúng tôi',
      title: 'Liên hệ với chúng tôi',
      subtitle: 'Có câu hỏi, góp ý, báo lỗi hay yêu cầu về quyền riêng tư? Chúng tôi rất mong được lắng nghe bạn.',
      supportEmailTitle: 'Email hỗ trợ trực tiếp',
      supportEmailDesc: 'Dành cho thắc mắc chung, hỗ trợ kỹ thuật và thông báo pháp lý hoặc quyền riêng tư:',
      responseTimeTitle: 'Thời gian phản hồi thông thường',
      responseTimeDesc: 'Chúng tôi kiểm tra tin nhắn từ Thứ Hai đến Thứ Sáu và cố gắng phản hồi trong 1–2 ngày làm việc.',
      submittedTitle: 'Tin nhắn đã được chuẩn bị',
      submittedBodyStart: 'Cảm ơn bạn đã liên hệ GeekTabs. Nhấn nút bên dưới để gửi qua ứng dụng email hoặc gửi tới ',
      submittedBodyEnd: '.',
      openEmailBtn: 'Mở trong ứng dụng Email',
      sendAnotherBtn: 'Gửi tin nhắn khác',
      nameLabel: 'Tên của bạn',
      namePlaceholder: 'Nguyễn Minh',
      emailLabel: 'Địa chỉ email',
      emailPlaceholder: 'you@example.com',
      topicLabel: 'Chủ đề',
      topics: ['Thắc mắc chung', 'Đề xuất tính năng', 'Báo lỗi', 'Quyền riêng tư & Pháp lý', 'Quảng cáo & Hợp tác'],
      messageLabel: 'Nội dung',
      messagePlaceholder: 'Chúng tôi có thể giúp gì cho bạn?',
      sendBtn: 'Gửi tin nhắn',
    },
  },
  Polish: {
    backToHome: 'Wróć do strony głównej',
    navAria: 'Strony informacyjne',
    tabs: { about: 'O nas', privacy: 'Polityka prywatności', terms: 'Regulamin', contact: 'Kontakt' },
    privacy: {
      eyebrow: 'Prywatność i ochrona danych',
      title: 'Polityka prywatności',
      updated: 'Ostatnia aktualizacja: 23 listopada 2026',
      s1Title: '1. Informacje przechowywane lokalnie na Twoim urządzeniu',
      s1p1Prefix: 'GeekTabs powstał z myślą o prywatności. Twoje osobiste elementy — zakładki, wydarzenia i przypomnienia, notatki, listy zadań, kolory motywu, własne tapety i język — są przechowywane lokalnie w przeglądarce za pomocą ',
      s1p1Suffix: ' i IndexedDB.',
      s1p2: 'Korzystanie z głównych funkcji nie wymaga rejestracji konta, a GeekTabs nie sprzedaje Twoich danych podmiotom trzecim. Możesz w każdej chwili wyeksportować, wykonać kopię lub usunąć dane lokalne w Ustawieniach.',
      s2Title: '2. Zewnętrzne narzędzia i żądania sieciowe',
      s2p1: 'Wybrane narzędzia pobierają publiczne dane na żądanie: prognoza pogody używa wybranego miasta lub współrzędnych; przelicznik walut pobiera kursy wymiany; test IP prezentuje metadane sieciowe; a test prędkości mierzy transfer i opóźnienia.',
      s3Title: '3. Reklamy, pliki cookie i Google AdSense',
      s3p1: 'GeekTabs może wyświetlać reklamy dostarczane przez zewnętrznych dostawców, w tym Google AdSense, którzy wykorzystują pliki cookie na podstawie wcześniejszych wizyt użytkownika w tej lub innych witrynach.',
      s3p2Start: 'Pliki cookie reklamowe Google umożliwiają dopasowywanie reklam do wcześniejszych odwiedzin. Możesz wyłączyć reklamy spersonalizowane w ',
      s3p2AdsSettings: 'Ustawieniach reklam Google',
      s3p2Mid: ' lub zarządzać plikami cookie dostawców zewnętrznych na ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '.',
      s4Title: '4. Twoje prawa i kontakt',
      s4p1Start: 'Zależnie od regionu (w tym EOG/Wielka Brytania na mocy RODO oraz Kalifornia na mocy CCPA/CPRA) możesz wyczyścić lokalną pamięć przeglądarki, zarządzać plikami cookie lub napisać do nas przez ',
      s4p1Link: 'stronę Kontakt',
      s4p1End: '.',
    },
    terms: {
      eyebrow: 'Warunki świadczenia usług',
      title: 'Regulamin serwisu',
      updated: 'Ostatnia aktualizacja: 23 listopada 2026',
      s1Title: '1. Akceptacja regulaminu',
      s1p1Start: 'Korzystając z GeekTabs, akceptujesz niniejszy Regulamin oraz naszą ',
      s1p1Link: 'Politykę prywatności',
      s1p1End: '. Jeśli nie wyrażasz zgody, zaprzestań korzystania ze strony.',
      s2Title: '2. Dozwolone korzystanie i narzędzia',
      s2p1: 'GeekTabs udostępnia narzędzia internetowe wspierające produktywność — konfigurowalny pulpit startowy, zakładki, kalendarz, kalkulator naukowy i walutowy, notatki, listę zadań, sprawdzanie IP oraz test prędkości — do użytku osobistego i zgodnego z prawem.',
      s2p2: 'Zobowiązujesz się nie nadużywać punktów diagnostyki sieciowej, nie generować szkodliwego ruchu automatycznego i nie zakłócać działania platformy.',
      s3Title: '3. Dane lokalne i odpowiedzialność za kopie zapasowe',
      s3p1: 'Ponieważ notatki, zakładki, wydarzenia, zadania i ustawienia są przechowywane lokalnie w przeglądarce, usunięcie danych witryny lub zmiana przeglądarki może skasować niezapisane wpisy. Zalecamy regularne kopie zapasowe w Ustawieniach.',
      s4Title: '4. Linki zewnętrzne i wyłączenie odpowiedzialności',
      s4p1: 'Zewnętrzne witryny otwierane z zakładek lub wyszukiwarki działają na własnych zasadach ich operatorów. GeekTabs udostępnia wszystkie narzędzia i szacunki „tak jak są”, bez gwarancji nieprzerwanej dostępności czy dokładności finansowej.',
    },
    about: {
      eyebrow: 'O naszej platformie',
      title: 'O GeekTabs',
      subtitle: 'Twoja codzienna przestrzeń na przydatne strony, skupienie i produktywność.',
      missionTitle: 'Nasza misja',
      missionBody: 'GeekTabs zmienia zwykłą stronę startową przeglądarki w spokojną, estetyczną i praktyczną przestrzeń roboczą, łącząc zakładki, pogodę, obliczenia, notatki i diagnostykę sieci w jednym miejscu.',
      toolsTitle: 'Wbudowane narzędzia główne',
      cards: [
        { title: 'Strona główna i Pogoda', body: 'Spersonalizowane powitanie, precyzyjny zegar, wyszukiwarka wielosilnikowa, prognoza pogody na żywo i Przegląd dnia.' },
        { title: 'Zakładki i Szybkie linki', body: 'Przejrzyste kategorie zakładek z natychmiastowym dostępem do narzędzi AI, pakietów biurowych i własnych skrótów.' },
        { title: 'Kalendarz i Święta', body: 'Interaktywny planer miesięczny obsługujący wydarzenia, przypomnienia oraz święta wielu krajów.' },
        { title: 'Kalkulator, IP i Test prędkości', body: 'Obliczenia zwykłe i naukowe, kursy walut na żywo, inspekcja IPv4/IPv6 oraz pomiar szybkości łącza.' },
      ],
      privacyTitle: 'Prywatność przede wszystkim i 23 języki',
      privacyBody: 'Dzięki 23 językom, motywom jasnym/ciemnym/szklanym, tapetom 1920×1080 oraz funkcji kopii zapasowej GeekTabs świetnie sprawdza się na komputerze i smartfonie, utrzymując Twoje dane w przeglądarce.',
    },
    contact: {
      eyebrow: 'Skontaktuj się',
      title: 'Kontakt',
      subtitle: 'Pytania, opinie, zgłoszenia błędów lub prośby o prywatność? Chętnie odpowiemy.',
      supportEmailTitle: 'Bezpośredni e-mail wsparcia',
      supportEmailDesc: 'W sprawach ogólnych, pomocy technicznej oraz zgłoszeń prawnych lub prywatności:',
      responseTimeTitle: 'Typowy czas odpowiedzi',
      responseTimeDesc: 'Wiadomości sprawdzamy od poniedziałku do piątku i staramy się odpowiadać w ciągu 1–2 dni roboczych.',
      submittedTitle: 'Wiadomość przygotowana',
      submittedBodyStart: 'Dziękujemy za kontakt z GeekTabs. Kliknij poniżej, aby wysłać ją w swoim programie pocztowym, lub napisz na ',
      submittedBodyEnd: '.',
      openEmailBtn: 'Otwórz w aplikacji pocztowej',
      sendAnotherBtn: 'Wyślij kolejną wiadomość',
      nameLabel: 'Twoje imię',
      namePlaceholder: 'Jan Kowalski',
      emailLabel: 'Adres e-mail',
      emailPlaceholder: 'ty@przyklad.pl',
      topicLabel: 'Temat',
      topics: ['Zapytanie ogólne', 'Sugestia funkcji', 'Zgłoszenie błędu', 'Prywatność i kwestie prawne', 'Reklama i partnerstwa'],
      messageLabel: 'Wiadomość',
      messagePlaceholder: 'W czym możemy pomóc?',
      sendBtn: 'Wyślij wiadomość',
    },
  },
  Danish: {
    backToHome: 'Tilbage til forsiden',
    navAria: 'Informationssider',
    tabs: { about: 'Om os', privacy: 'Privatlivspolitik', terms: 'Servicevilkår', contact: 'Kontakt' },
    privacy: {
      eyebrow: 'Privatliv & databeskyttelse',
      title: 'Privatlivspolitik',
      updated: 'Sidst opdateret: 23. november 2026',
      s1Title: '1. Oplysninger gemt lokalt på din enhed',
      s1p1Prefix: 'GeekTabs er bygget med fokus på privatliv. Personlige data du opretter — bogmærker, kalenderaftaler og påmindelser, noter, opgavelister, temafarver, egne baggrunde og sprogvalg — gemmes lokalt i din browser via ',
      s1p1Suffix: ' og IndexedDB.',
      s1p2: 'Det kræver ingen konto at bruge hovedfunktionerne, og GeekTabs sælger ikke dine personlige oplysninger til tredjeparter. Du kan til enhver tid eksportere, sikkerhedskopiere eller slette lokale data i Indstillinger.',
      s2Title: '2. Eksterne værktøjer & netværksanmodninger',
      s2p1: 'Visse valgfrie værktøjer henter offentlige live-data efter behov: vejrudsigter henter data for valgt by; valutaomregneren henter aktuelle kurser; IP-opslag viser netværksruting; og hastighedstesten måler båndbredde og svartid.',
      s3Title: '3. Annoncering, cookies og Google AdSense',
      s3p1: 'GeekTabs kan vise annoncer leveret af tredjepartsudbydere, herunder Google AdSense, som bruger cookies baseret på tidligere besøg på denne eller andre hjemmesider.',
      s3p2Start: 'Googles brug af annoncecookies gør det muligt at vise relevante annoncer. Du kan fravælge personlige annoncer via ',
      s3p2AdsSettings: 'Googles annonceindstillinger',
      s3p2Mid: ' eller administrere tredjepartscookies på ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '.',
      s4Title: '4. Dine privatlivsrettigheder & kontakt',
      s4p1Start: 'Afhængigt af dit område (herunder EØS/Storbritannien under GDPR og Californien under CCPA/CPRA) kan du rydde lokal browserlagring, styre cookieindstillinger eller kontakte os via vores ',
      s4p1Link: 'Kontaktside',
      s4p1End: '.',
    },
    terms: {
      eyebrow: 'Serviceaftale',
      title: 'Servicevilkår',
      updated: 'Sidst opdateret: 23. november 2026',
      s1Title: '1. Accept af vilkår',
      s1p1Start: 'Ved at bruge GeekTabs accepterer du disse Servicevilkår samt vores ',
      s1p1Link: 'Privatlivspolitik',
      s1p1End: '. Hvis du ikke accepterer vilkårene, bedes du stoppe brugen af siden.',
      s2Title: '2. Tilladt brug & produktivitetsværktøjer',
      s2p1: 'GeekTabs leverer webbaserede produktivitetsværktøjer — tilpasseligt startdashboard, bogmærker, kalender, videnskabelig og valutalommeregner, noter, opgaveliste, IP-opslag og hastighedstest — til personligt og lovligt brug.',
      s2p2: 'Du accepterer ikke at misbruge diagnostiske funktioner, sende skadelig automatiseret trafik eller forstyrre platformens drift.',
      s3Title: '3. Lokale data & ansvar for backup',
      s3p1: 'Da noter, bogmærker, kalenderelementer, opgaver og indstillinger gemmes lokalt i browseren, kan sletning af webstedsdata fjerne ugemte poster. Vi anbefaler løbende backups via Indstillinger.',
      s4Title: '4. Tredjepartslinks & ansvarsfraskrivelse',
      s4p1: 'Eksterne sider via bogmærker eller søgemaskiner drives uafhængigt af tredjeparter. GeekTabs leverer alle værktøjer og estimater "som de er" uden garanti for uafbrudt tilgængelighed.',
    },
    about: {
      eyebrow: 'Om vores platform',
      title: 'Om GeekTabs',
      subtitle: 'Dit daglige rum til nyttige websites, fokusværktøjer og produktivitet.',
      missionTitle: 'Vores mission',
      missionBody: 'GeekTabs forvandler browserens startside til et roligt, æstetisk og brugbart arbejdsrum ved at samle bogmærker, vejr, beregninger, noter og netværksdiagnostik i én ren brugerflade.',
      toolsTitle: 'Centrale værktøjer inkluderet',
      cards: [
        { title: 'Startdashboard & Vejr', body: 'Personlig hilsen, præcis urvisning, multisøgning, lokal vejrudsigt og Dagligt overblik.' },
        { title: 'Bogmærker & Hurtige links', body: 'Kategoriserede bogmærker med hurtig adgang til AI-værktøjer, kontorapps og personlige genveje.' },
        { title: 'Kalender & Helligdage', body: 'Interaktiv månedsplanlægger med begivenheder, påmindelser og helligdage i flere lande.' },
        { title: 'Lommeregner, IP & Hastighed', body: 'Standard og videnskabelig beregning, live valutakurser, IPv4/IPv6-tjek og bredbåndstest.' },
      ],
      privacyTitle: 'Privatliv først & 23 sprog',
      privacyBody: 'Med 23 sprog, lyse/mørke/glas-temaer, 1920×1080 baggrunde og indbygget backup fungerer GeekTabs gnidningsfrit på både computer og mobil med alle data sikkert i din browser.',
    },
    contact: {
      eyebrow: 'Kontakt os',
      title: 'Kontakt os',
      subtitle: 'Spørgsmål, feedback, fejlrapporter eller forespørgsler om privatliv? Vi vil meget gerne høre fra dig.',
      supportEmailTitle: 'Direkte support-e-mail',
      supportEmailDesc: 'Til generelle spørgsmål, teknisk hjælp samt privatlivs- eller juridiske henvendelser:',
      responseTimeTitle: 'Typisk svartid',
      responseTimeDesc: 'Vi læser beskeder mandag til fredag og sigter efter svar inden for 1–2 hverdage.',
      submittedTitle: 'Besked klargjort',
      submittedBodyStart: 'Tak fordi du kontakter GeekTabs. Klik nedenfor for at sende via din e-mailapp, eller skriv til ',
      submittedBodyEnd: '.',
      openEmailBtn: 'Åbn i e-mailapp',
      sendAnotherBtn: 'Send en ny besked',
      nameLabel: 'Dit navn',
      namePlaceholder: 'Alex Morgan',
      emailLabel: 'E-mailadresse',
      emailPlaceholder: 'dig@eksempel.dk',
      topicLabel: 'Emne',
      topics: ['Generel forespørgsel', 'Funktionsforslag', 'Fejlrapport', 'Privatliv & juridisk', 'Annoncering & partnerskaber'],
      messageLabel: 'Besked',
      messagePlaceholder: 'Hvordan kan vi hjælpe?',
      sendBtn: 'Send besked',
    },
  },
  Turkish: {
    backToHome: 'Ana Sayfaya Dön',
    navAria: 'Bilgi sayfaları',
    tabs: { about: 'Hakkında', privacy: 'Gizlilik Politikası', terms: 'Kullanım Şartları', contact: 'İletişim' },
    privacy: {
      eyebrow: 'Gizlilik ve Veri Koruma',
      title: 'Gizlilik Politikası',
      updated: 'Son Güncelleme: 23 Kasım 2026',
      s1Title: '1. Cihazınızda Yerel Olarak Saklanan Bilgiler',
      s1p1Prefix: 'GeekTabs gizlilik odaklı bir mimariyle tasarlanmıştır. Yer imleri, takvim etkinlikleri ve hatırlatmalar, notlar, yapılacaklar listesi, tema renkleri, özel duvar kâğıtları ve dil tercihleriniz tarayıcınızda ',
      s1p1Suffix: ' ve IndexedDB aracılığıyla yerel olarak saklanır.',
      s1p2: 'Temel pano özelliklerini kullanmak için hesap kaydı gerekmez ve GeekTabs kişisel verilerinizi üçüncü taraflara satmaz. Yerel verilerinizi dilediğiniz zaman Ayarlar üzerinden dışa aktarabilir, yedekleyebilir veya silebilirsiniz.',
      s2Title: '2. Harici Araçlar ve Ağ İstekleri',
      s2p1: 'Bazı isteğe bağlı araçlar talep üzerine canlı genel bilgileri alır: hava durumu seçtiğiniz şehre göre tahmin sorgular; döviz çevirici canlı kurları getirir; IP sorgulama ağ yönlendirme bilgilerini gösterir; hız testi ise aktarım hızı ve gecikmeyi ölçer.',
      s3Title: '3. Reklamlar, Çerezler ve Google AdSense',
      s3p1: 'GeekTabs, Google AdSense dâhil üçüncü taraf sağlayıcıların sunduğu reklamları gösterebilir. Bu sağlayıcılar, kullanıcıların önceki web sitesi ziyaretlerine göre reklam sunmak için çerez kullanır.',
      s3p2Start: 'Google’ın reklam çerezlerini kullanması, GeekTabs ve diğer sitelere yapılan ziyaretlere göre reklam sunulmasını sağlar. Kişiselleştirilmiş reklamları ',
      s3p2AdsSettings: 'Google Reklam Ayarları',
      s3p2Mid: ' üzerinden kapatabilir veya üçüncü taraf çerezlerini ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: ' adresinden yönetebilirsiniz.',
      s4Title: '4. Gizlilik Haklarınız ve İletişim',
      s4p1Start: 'Bölgenize bağlı olarak (GDPR kapsamında AEA/Birleşik Krallık ve CCPA/CPRA kapsamında Kaliforniya dâhil) yerel tarayıcı verilerini temizleyebilir, çerez tercihlerini yönetebilir veya ',
      s4p1Link: 'İletişim sayfamız',
      s4p1End: ' üzerinden bize ulaşabilirsiniz.',
    },
    terms: {
      eyebrow: 'Hizmet Sözleşmesi',
      title: 'Kullanım Şartları',
      updated: 'Son Güncelleme: 23 Kasım 2026',
      s1Title: '1. Şartların Kabulü',
      s1p1Start: 'GeekTabs’a erişerek veya kullanarak bu Kullanım Şartlarını ve ',
      s1p1Link: 'Gizlilik Politikamızı',
      s1p1End: ' kabul etmiş olursunuz. Bu şartları kabul etmiyorsanız lütfen siteyi kullanmayı bırakın.',
      s2Title: '2. İzin Verilen Kullanım ve Araçlar',
      s2p1: 'GeekTabs; özelleştirilebilir başlangıç panosu, yer imleri yöneticisi, takvim, bilimsel ve döviz hesap makinesi, notlar, görev listesi, IP sorgulama ve hız testi gibi web üretkenlik araçlarını kişisel ve yasal bilgilendirme amaçlı sunar.',
      s2p2: 'Ağ tanılama uç noktalarını kötüye kullanmamayı, zararlı otomatik trafik üretmemeyi, yetkisiz erişim denememeyi ve platformun normal işleyişine müdahale etmemeyi kabul edersiniz.',
      s3Title: '3. Yerel Veriler ve Yedekleme Sorumluluğu',
      s3p1: 'Notlar, yer imleri, takvim kayıtları, görevler ve ayarlar tarayıcıda yerel saklandığı için site verilerinin temizlenmesi veya tarayıcı değiştirilmesi yedeklenmemiş verileri silebilir. Ayarlardan düzenli yedek almanızı öneririz.',
      s4Title: '4. Üçüncü Taraf Bağlantıları ve Sorumluluk Reddi',
      s4p1: 'Yer imleri veya arama motorları üzerinden erişilen harici siteler üçüncü taraflarca bağımsız yönetilir. GeekTabs tüm araçları ve tahminleri kesintisiz erişim veya finansal kesinlik garantisi olmaksızın «olduğu gibi» sunar.',
    },
    about: {
      eyebrow: 'Platformumuz Hakkında',
      title: 'GeekTabs Hakkında',
      subtitle: 'Faydalı web siteleri, odak araçları ve üretkenlik için günlük alanınız.',
      missionTitle: 'Misyonumuz',
      missionBody: 'GeekTabs, tarayıcı başlangıç sayfasını sakin, estetik ve gerçekten kullanışlı bir çalışma alanına dönüştürmek için tasarlandı; yer imleri, hava durumu, hesaplamalar, notlar ve ağ testlerini tek temiz arayüzde birleştirir.',
      toolsTitle: 'Dahil Edilen Temel Araçlar',
      cards: [
        { title: 'Ana Pano ve Hava Durumu', body: 'Kişisel karşılama, hassas saat, çoklu motor arama, canlı yerel hava tahmini ve Günlük Özet kartları.' },
        { title: 'Yer İmleri ve Hızlı Bağlantılar', body: 'Yapay zekâ araçları, ofis paketleri, eğlence ve kişisel kısayollara anında erişim sağlayan kategorili yer imleri.' },
        { title: 'Takvim ve Tatiller', body: 'Kişisel etkinlikler, hatırlatmalar ve çoklu ülke resmi tatillerini destekleyen etkileşimli aylık planlayıcı.' },
        { title: 'Hesap Makinesi, IP ve Hız Testi', body: 'Standart ve bilimsel matematik, canlı döviz çevirme, IPv4/IPv6 incelemesi ve gerçek zamanlı hız testi.' },
      ],
      privacyTitle: 'Önce Gizlilik ve 23 Dil Desteği',
      privacyBody: '23 dil, açık/koyu/cam kart temaları, 1920×1080 duvar kâğıdı ön ayarları ve yerleşik yedekleme ile GeekTabs verilerinizi tarayıcınızda tutarak masaüstü ve mobilde sorunsuz çalışır.',
    },
    contact: {
      eyebrow: 'Bize Ulaşın',
      title: 'İletişim',
      subtitle: 'Sorularınız, geri bildirimleriniz, hata bildirimleriniz veya gizlilik talepleriniz mi var? Sizden haber almaktan mutluluk duyarız.',
      supportEmailTitle: 'Doğrudan Destek E-postası',
      supportEmailDesc: 'Genel sorular, teknik destek ve gizlilik veya yasal bildirimler için:',
      responseTimeTitle: 'Ortalama Yanıt Süresi',
      responseTimeDesc: 'Mesajları Pazartesi–Cuma arası inceliyor ve 1–2 iş günü içinde yanıtlamayı hedefliyoruz.',
      submittedTitle: 'Mesaj Hazırlandı',
      submittedBodyStart: 'GeekTabs ile iletişime geçtiğiniz için teşekkürler. E-posta uygulamanızla göndermek için aşağıya tıklayın veya doğrudan yazın: ',
      submittedBodyEnd: '.',
      openEmailBtn: 'E-posta Uygulamasında Aç',
      sendAnotherBtn: 'Başka Mesaj Gönder',
      nameLabel: 'Adınız',
      namePlaceholder: 'Deniz Yılmaz',
      emailLabel: 'E-posta Adresi',
      emailPlaceholder: 'siz@ornek.com',
      topicLabel: 'Konu',
      topics: ['Genel Soru', 'Özellik Önerisi', 'Hata Bildirimi', 'Gizlilik ve Yasal', 'Reklam ve İş Ortaklıkları'],
      messageLabel: 'Mesaj',
      messagePlaceholder: 'Nasıl yardımcı olabiliriz?',
      sendBtn: 'Mesaj Gönder',
    },
  },
  Greek: {
    backToHome: 'Επιστροφή στην αρχική',
    navAria: 'Σελίδες πληροφοριών',
    tabs: { about: 'Σχετικά', privacy: 'Απόρρητο', terms: 'Όροι χρήσης', contact: 'Επικοινωνία' },
    privacy: {
      eyebrow: 'Απόρρητο & Προστασία Δεδομένων',
      title: 'Πολιτική Απορρήτου',
      updated: 'Τελευταία ενημέρωση: 23 Νοεμβρίου 2026',
      s1Title: '1. Πληροφορίες που αποθηκεύονται τοπικά στη συσκευή σας',
      s1p1Prefix: 'Το GeekTabs βασίζεται σε αρχιτεκτονική προτεραιότητας απορρήτου. Τα προσωπικά σας στοιχεία — σελιδοδείκτες, συμβάντα και υπενθυμίσεις, σημειώσεις, λίστες εργασιών, χρώματα θέματος, ταπετσαρίες και γλώσσα — αποθηκεύονται τοπικά στον περιηγητή σας μέσω ',
      s1p1Suffix: ' και IndexedDB.',
      s1p2: 'Δεν απαιτείται εγγραφή λογαριασμού για τις βασικές λειτουργίες και το GeekTabs δεν πωλεί προσωπικά δεδομένα σε τρίτους. Μπορείτε να εξαγάγετε, να δημιουργήσετε αντίγραφο ή να διαγράψετε τοπικά δεδομένα από τις Ρυθμίσεις.',
      s2Title: '2. Εξωτερικά εργαλεία & αιτήματα δικτύου',
      s2p1: 'Ορισμένα προαιρετικά εργαλεία ανακτούν δημόσια δεδομένα κατόπιν αιτήματος: η πρόγνωση καιρού ελέγχει την επιλεγμένη πόλη, ο μετατροπέας συναλλάγματος ανακτά ισοτιμίες, η αναζήτηση IP εμφανίζει μεταδεδομένα δικτύου και το τεστ ταχύτητας μετρά ταχύτητα και καθυστέρηση.',
      s3Title: '3. Διαφημίσεις, Cookies και Google AdSense',
      s3p1: 'Το GeekTabs ενδέχεται να προβάλλει διαφημίσεις από τρίτους παρόχους, συμπεριλαμβανομένου του Google AdSense, οι οποίοι χρησιμοποιούν cookies βάσει προηγούμενων επισκέψεων σε αυτόν ή άλλους ιστότοπους.',
      s3p2Start: 'Η χρήση cookies διαφήμισης από την Google επιτρέπει την προβολή σχετικών διαφημίσεων. Μπορείτε να εξαιρεθείτε από εξατομικευμένες διαφημίσεις στις ',
      s3p2AdsSettings: 'Ρυθμίσεις διαφημίσεων Google',
      s3p2Mid: ' ή να διαχειριστείτε cookies τρίτων στο ',
      s3p2AboutAds: 'aboutads.info',
      s3p2End: '.',
      s4Title: '4. Τα δικαιώματα απορρήτου & επικοινωνία',
      s4p1Start: 'Ανάλογα με την περιοχή σας (συμπεριλαμβανομένου ΕΟΧ/ΗΒ βάσει GDPR και Καλιφόρνιας βάσει CCPA/CPRA), μπορείτε να διαγράψετε τοπικά δεδομένα περιηγητή, να ρυθμίσετε cookies ή να επικοινωνήσετε μαζί μας μέσω της ',
      s4p1Link: 'σελίδας Επικοινωνίας',
      s4p1End: '.',
    },
    terms: {
      eyebrow: 'Συμφωνία Υπηρεσίας',
      title: 'Όροι Χρήσης',
      updated: 'Τελευταία ενημέρωση: 23 Νοεμβρίου 2026',
      s1Title: '1. Αποδοχή των Όρων',
      s1p1Start: 'Με την πρόσβαση ή χρήση του GeekTabs αποδέχεστε αυτούς τους Όρους Χρήσης και την ',
      s1p1Link: 'Πολιτική Απορρήτου',
      s1p1End: ' μας. Εάν δεν συμφωνείτε, παρακαλούμε διακόψτε τη χρήση του ιστότοπου.',
      s2Title: '2. Επιτρεπόμενη χρήση & εργαλεία',
      s2p1: 'Το GeekTabs παρέχει διαδικτυακά εργαλεία παραγωγικότητας — προσαρμόσιμο πίνακα εκκίνησης, σελιδοδείκτες, ημερολόγιο, επιστημονική και συναλλαγματική αριθμομηχανή, σημειώσεις, λίστα εργασιών, έλεγχο IP και τεστ ταχύτητας — για προσωπική και νόμιμη χρήση.',
      s2p2: 'Συμφωνείτε να μην κάνετε κατάχρηση διαγνωστικών σημείων, να μην αποστέλλετε κακόβουλη αυτοματοποιημένη κίνηση και να μην παρεμποδίζετε τη λειτουργία της πλατφόρμας.',
      s3Title: '3. Τοπικά δεδομένα & ευθύνη αντιγράφων ασφαλείας',
      s3p1: 'Επειδή σημειώσεις, σελιδοδείκτες, συμβάντα, εργασίες και ρυθμίσεις αποθηκεύονται τοπικά στον περιηγητή, η εκκαθάριση δεδομένων μπορεί να διαγράψει μη αποθηκευμένες εγγραφές. Συνιστούμε τακτικά αντίγραφα ασφαλείας από τις Ρυθμίσεις.',
      s4Title: '4. Σύνδεσμοι τρίτων & αποποίηση ευθυνών',
      s4p1: 'Οι εξωτερικοί ιστότοποι λειτουργούν ανεξάρτητα από τρίτους με τους δικούς τους όρους. Το GeekTabs παρέχει όλα τα εργαλεία και τις εκτιμήσεις «ως έχουν» χωρίς εγγύηση αδιάλειπτης διαθεσιμότητας ή οικονομικής ακρίβειας.',
    },
    about: {
      eyebrow: 'Σχετικά με την πλατφόρμα μας',
      title: 'Σχετικά με το GeekTabs',
      subtitle: 'Ο καθημερινός σας χώρος για χρήσιμους ιστότοπους, εργαλεία συγκέντρωσης και παραγωγικότητα.',
      missionTitle: 'Η Αποστολή μας',
      missionBody: 'Το GeekTabs μετατρέπει την αρχική σελίδα του περιηγητή σε έναν ήρεμο, αισθητικό και πρακτικό χώρο εργασίας, συγκεντρώνοντας σελιδοδείκτες, καιρό, υπολογισμούς, σημειώσεις και διαγνωστικά δικτύου χωρίς περισπασμούς.',
      toolsTitle: 'Βασικά Εργαλεία που Περιλαμβάνονται',
      cards: [
        { title: 'Αρχικός Πίνακας & Καιρός', body: 'Εξατομικευμένος χαιρετισμός, ρολόι ακριβείας, αναζήτηση πολλαπλών μηχανών, ζωντανός τοπικός καιρός και Ημερήσια Σύνοψη.' },
        { title: 'Σελιδοδείκτες & Γρήγοροι Σύνδεσμοι', body: 'Οργανωμένοι σελιδοδείκτες για εργαλεία AI, εφαρμογές γραφείου, ψυχαγωγία και προσωπικές συντομεύσεις.' },
        { title: 'Ημερολόγιο & Αργίες', body: 'Διαδραστικό μηνιαίο ημερολόγιο για προσωπικά συμβάντα, υπενθυμίσεις και αργίες πολλών χωρών.' },
        { title: 'Αριθμομηχανή, IP & Ταχύτητα', body: 'Τυπικοί και επιστημονικοί υπολογισμοί, ζωντανό συνάλλαγμα, έλεγχος IPv4/IPv6 και μέτρηση ευρυζωνικής ταχύτητας.' },
      ],
      privacyTitle: 'Προτεραιότητα στο Απόρρητο & 23 Γλώσσες',
      privacyBody: 'Με 23 γλώσσες, φωτεινά/σκοτεινά/γυάλινα θέματα, ταπετσαρίες 1920×1080 και ενσωματωμένο αντίγραφο ασφαλείας, το GeekTabs προσαρμόζεται σε υπολογιστή και κινητό κρατώντας τα δεδομένα στον περιηγητή σας.',
    },
    contact: {
      eyebrow: 'Επικοινωνήστε μαζί μας',
      title: 'Επικοινωνία',
      subtitle: 'Ερωτήσεις, σχόλια, αναφορές σφαλμάτων ή αιτήματα απορρήτου; Θα χαρούμε να σας ακούσουμε.',
      supportEmailTitle: 'Άμεσο Email Υποστήριξης',
      supportEmailDesc: 'Για γενικές ερωτήσεις, τεχνική βοήθεια και ειδοποιήσεις απορρήτου ή νομικών θεμάτων:',
      responseTimeTitle: 'Συνήθης Χρόνος Απόκρισης',
      responseTimeDesc: 'Εξετάζουμε τα μηνύματα Δευτέρα με Παρασκευή και στοχεύουμε σε απάντηση εντός 1–2 εργάσιμων ημερών.',
      submittedTitle: 'Το μήνυμα ετοιμάστηκε',
      submittedBodyStart: 'Ευχαριστούμε που επικοινωνήσατε με το GeekTabs. Κάντε κλικ παρακάτω για αποστολή μέσω της εφαρμογής email σας ή γράψτε στο ',
      submittedBodyEnd: '.',
      openEmailBtn: 'Άνοιγμα στην εφαρμογή Email',
      sendAnotherBtn: 'Αποστολή άλλου μηνύματος',
      nameLabel: 'Το όνομά σας',
      namePlaceholder: 'Alex Morgan',
      emailLabel: 'Διεύθυνση Email',
      emailPlaceholder: 'you@example.com',
      topicLabel: 'Θέμα',
      topics: ['Γενική ερώτηση', 'Πρόταση λειτουργίας', 'Αναφορά σφάλματος', 'Απόρρητο & Νομικά', 'Διαφήμιση & Συνεργασίες'],
      messageLabel: 'Μήνυμα',
      messagePlaceholder: 'Πώς μπορούμε να βοηθήσουμε;',
      sendBtn: 'Αποστολή μηνύματος',
    },
  },
};

export default function LegalInfoPages({
  page,
  onNavigate,
  language = 'English',
}: LegalInfoPagesProps) {
  const L = LEGAL_TRANSLATIONS[language] || LEGAL_TRANSLATIONS.English;
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactTopic, setContactTopic] = useState(L.contact.topics[0]);
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [composedMailto, setComposedMailto] = useState('');

  React.useEffect(() => {
    setContactTopic(L.contact.topics[0]);
  }, [language, L.contact.topics]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, tab: string) => {
    e.preventDefault();
    onNavigate(tab);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;
    const subject = encodeURIComponent(`[GeekTabs] ${contactTopic} — ${contactName.trim()}`);
    const body = encodeURIComponent(
      `${L.contact.nameLabel}: ${contactName.trim()}\n${L.contact.emailLabel}: ${contactEmail.trim()}\n${L.contact.topicLabel}: ${contactTopic}\n\n${contactMessage.trim()}`
    );
    setComposedMailto(`mailto:support@geektabs.com?subject=${subject}&body=${body}`);
    setSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  const navTabs: Array<{ key: LegalPageType; label: string; href: string }> = [
    { key: 'about', label: L.tabs.about, href: '/about' },
    { key: 'privacy', label: L.tabs.privacy, href: '/privacy' },
    { key: 'terms', label: L.tabs.terms, href: '/terms' },
    { key: 'contact', label: L.tabs.contact, href: '/contact' },
  ];

  return (
    <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 text-xs font-bold uppercase tracking-wider word-color transition-colors"
        >
          <ArrowLeft size={14} />
          <span>{L.backToHome}</span>
        </a>

        <nav aria-label={L.navAria} className="flex flex-wrap items-center gap-2">
          {navTabs.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                page === item.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-black/5 dark:bg-white/10 word-color opacity-80 hover:opacity-100'
              }`}
              style={page === item.key ? { color: '#ffffff', WebkitTextFillColor: '#ffffff' } : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="GeekTabs-card rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        {page === 'privacy' && (
          <>
            <section aria-labelledby="privacy-heading" className="space-y-3 border-b border-black/10 dark:border-white/10 pb-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-500">
                <ShieldCheck size={16} />
                <span>{L.privacy.eyebrow}</span>
              </div>
              <h1 id="privacy-heading" className="text-2xl sm:text-3xl font-black tracking-tight word-color">
                {L.privacy.title}
              </h1>
              <p className="text-xs sm:text-sm word-color opacity-65">
                {L.privacy.updated}
              </p>
            </section>

            <section className="space-y-3 text-sm sm:text-[15px] leading-relaxed word-color opacity-90">
              <h2 className="text-lg font-bold word-color">{L.privacy.s1Title}</h2>
              <p>
                {L.privacy.s1p1Prefix}
                <code className="font-mono text-xs">localStorage</code>
                {L.privacy.s1p1Suffix}
              </p>
              <p>{L.privacy.s1p2}</p>
            </section>

            <section className="space-y-3 text-sm sm:text-[15px] leading-relaxed word-color opacity-90">
              <h2 className="text-lg font-bold word-color">{L.privacy.s2Title}</h2>
              <p>{L.privacy.s2p1}</p>
            </section>

            <section className="space-y-3 text-sm sm:text-[15px] leading-relaxed word-color opacity-90">
              <h2 className="text-lg font-bold word-color">{L.privacy.s3Title}</h2>
              <p>{L.privacy.s3p1}</p>
              <p>
                {L.privacy.s3p2Start}
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 underline font-semibold hover:text-indigo-400"
                >
                  {L.privacy.s3p2AdsSettings}
                </a>
                {L.privacy.s3p2Mid}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 underline font-semibold hover:text-indigo-400"
                >
                  {L.privacy.s3p2AboutAds}
                </a>
                {L.privacy.s3p2End}
              </p>
            </section>

            <section className="space-y-3 text-sm sm:text-[15px] leading-relaxed word-color opacity-90">
              <h2 className="text-lg font-bold word-color">{L.privacy.s4Title}</h2>
              <p>
                {L.privacy.s4p1Start}
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  className="text-indigo-500 underline font-semibold hover:text-indigo-400"
                >
                  {L.privacy.s4p1Link}
                </a>
                {L.privacy.s4p1End}
              </p>
            </section>
          </>
        )}

        {page === 'terms' && (
          <>
            <section aria-labelledby="terms-heading" className="space-y-3 border-b border-black/10 dark:border-white/10 pb-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-500">
                <FileText size={16} />
                <span>{L.terms.eyebrow}</span>
              </div>
              <h1 id="terms-heading" className="text-2xl sm:text-3xl font-black tracking-tight word-color">
                {L.terms.title}
              </h1>
              <p className="text-xs sm:text-sm word-color opacity-65">
                {L.terms.updated}
              </p>
            </section>

            <section className="space-y-3 text-sm sm:text-[15px] leading-relaxed word-color opacity-90">
              <h2 className="text-lg font-bold word-color">{L.terms.s1Title}</h2>
              <p>
                {L.terms.s1p1Start}
                <a
                  href="/privacy"
                  onClick={(e) => handleLinkClick(e, 'privacy')}
                  className="text-indigo-500 underline font-semibold hover:text-indigo-400"
                >
                  {L.terms.s1p1Link}
                </a>
                {L.terms.s1p1End}
              </p>
            </section>

            <section className="space-y-3 text-sm sm:text-[15px] leading-relaxed word-color opacity-90">
              <h2 className="text-lg font-bold word-color">{L.terms.s2Title}</h2>
              <p>{L.terms.s2p1}</p>
              <p>{L.terms.s2p2}</p>
            </section>

            <section className="space-y-3 text-sm sm:text-[15px] leading-relaxed word-color opacity-90">
              <h2 className="text-lg font-bold word-color">{L.terms.s3Title}</h2>
              <p>{L.terms.s3p1}</p>
            </section>

            <section className="space-y-3 text-sm sm:text-[15px] leading-relaxed word-color opacity-90">
              <h2 className="text-lg font-bold word-color">{L.terms.s4Title}</h2>
              <p>{L.terms.s4p1}</p>
            </section>
          </>
        )}

        {page === 'about' && (
          <>
            <section aria-labelledby="about-heading" className="space-y-3 border-b border-black/10 dark:border-white/10 pb-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-500">
                <Info size={16} />
                <span>{L.about.eyebrow}</span>
              </div>
              <h1 id="about-heading" className="text-2xl sm:text-3xl font-black tracking-tight word-color">
                {L.about.title}
              </h1>
              <p className="text-sm sm:text-base word-color opacity-75">
                {L.about.subtitle}
              </p>
            </section>

            <section className="space-y-3 text-sm sm:text-[15px] leading-relaxed word-color opacity-90">
              <h2 className="text-lg font-bold word-color">{L.about.missionTitle}</h2>
              <p>{L.about.missionBody}</p>
            </section>

            <section className="space-y-4 text-sm sm:text-[15px] leading-relaxed word-color opacity-90">
              <h2 className="text-lg font-bold word-color">{L.about.toolsTitle}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {L.about.cards.map((card) => (
                  <div key={card.title} className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                    <h3 className="font-bold word-color mb-1">{card.title}</h3>
                    <p className="text-xs sm:text-sm opacity-80">{card.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3 text-sm sm:text-[15px] leading-relaxed word-color opacity-90">
              <h2 className="text-lg font-bold word-color">{L.about.privacyTitle}</h2>
              <p>{L.about.privacyBody}</p>
            </section>
          </>
        )}

        {page === 'contact' && (
          <>
            <section aria-labelledby="contact-heading" className="space-y-3 border-b border-black/10 dark:border-white/10 pb-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-500">
                <Mail size={16} />
                <span>{L.contact.eyebrow}</span>
              </div>
              <h1 id="contact-heading" className="text-2xl sm:text-3xl font-black tracking-tight word-color">
                {L.contact.title}
              </h1>
              <p className="text-sm sm:text-base word-color opacity-75">
                {L.contact.subtitle}
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-1.5">
                  <h2 className="text-sm font-bold word-color">{L.contact.supportEmailTitle}</h2>
                  <p className="text-xs word-color opacity-75">
                    {L.contact.supportEmailDesc}
                  </p>
                  <a
                    href="mailto:support@geektabs.com"
                    className="inline-block text-sm font-bold text-indigo-500 hover:underline pt-1"
                  >
                    support@geektabs.com
                  </a>
                </div>
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-1.5">
                  <h2 className="text-sm font-bold word-color">{L.contact.responseTimeTitle}</h2>
                  <p className="text-xs word-color opacity-75 leading-relaxed">
                    {L.contact.responseTimeDesc}
                  </p>
                </div>
              </div>

              <div className="md:col-span-3">
                {submitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-base">
                      <CheckCircle2 size={20} />
                      <span>{L.contact.submittedTitle}</span>
                    </div>
                    <p className="text-sm word-color opacity-85 leading-relaxed">
                      {L.contact.submittedBodyStart}
                      <a href="mailto:support@geektabs.com" className="text-indigo-500 font-semibold underline">
                        support@geektabs.com
                      </a>
                      {L.contact.submittedBodyEnd}
                    </p>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {composedMailto && (
                        <a
                          href={composedMailto}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider"
                          style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                        >
                          <Send size={13} />
                          <span>{L.contact.openEmailBtn}</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                        style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                      >
                        {L.contact.sendAnotherBtn}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider word-color opacity-70 mb-1.5">
                          {L.contact.nameLabel}
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder={L.contact.namePlaceholder}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-sm word-color focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider word-color opacity-70 mb-1.5">
                          {L.contact.emailLabel}
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder={L.contact.emailPlaceholder}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-sm word-color focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider word-color opacity-70 mb-1.5">
                        {L.contact.topicLabel}
                      </label>
                      <select
                        value={contactTopic}
                        onChange={(e) => setContactTopic(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-sm word-color focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      >
                        {L.contact.topics.map((topic) => (
                          <option key={topic} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider word-color opacity-70 mb-1.5">
                        {L.contact.messageLabel}
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder={L.contact.messagePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-sm word-color focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-y"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                      style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                    >
                      <Send size={14} />
                      <span>{L.contact.sendBtn}</span>
                    </button>
                  </form>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </article>
  );
}
