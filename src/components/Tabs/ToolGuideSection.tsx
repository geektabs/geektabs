import React from 'react';

export type GuideToolKey = 'links' | 'calendar' | 'calculator' | 'ip' | 'speed';

interface GuideItem {
  title: string;
  overview: string;
  highlights: Array<{ heading: string; body: string }>;
  faqs: Array<{ q: string; a: string }>;
}

interface LocalizedGuides {
  faqHeading: string;
  tools: Record<GuideToolKey, GuideItem>;
}

const GUIDE_TRANSLATIONS: Record<string, LocalizedGuides> = {
  English: {
    faqHeading: 'Frequently Asked Questions',
    tools: {
      links: {
        title: 'Organize Your Everyday Web Bookmarks',
        overview:
          'GeekTabs Bookmarks helps you group frequently visited websites, office suites, AI assistants, music platforms, and personal shortcuts into clean visual categories so every workflow starts with one click.',
        highlights: [
          {
            heading: 'Custom Categories & Instant Edits',
            body: 'Create new bookmark collections, rename categories, add custom URLs, or edit icons at any time without leaving your start workspace.',
          },
          {
            heading: 'Local Privacy & Easy Backups',
            body: 'Your bookmark collections stay stored locally inside your browser and can be exported or restored anytime from Settings.',
          },
        ],
        faqs: [
          {
            q: 'Can I add my own custom websites to Bookmarks?',
            a: 'Yes. Use the Add Bookmark button inside any category to save a custom website title and URL, or create your own category.',
          },
          {
            q: 'Are my personal bookmarks backed up automatically?',
            a: 'All bookmark changes save automatically to your browser storage, and you can download a full backup file from Settings > General.',
          },
        ],
      },
      calendar: {
        title: 'Smart Monthly Calendar & Multi-Region Holidays',
        overview:
          'Plan upcoming deadlines, schedule personal reminders, and keep track of regional public holidays across multiple countries in a single clear monthly calendar view.',
        highlights: [
          {
            heading: 'Events & Time-Stamped Reminders',
            body: 'Add custom events or timed reminders to any date so important meetings, bills, and personal milestones stay visible all month.',
          },
          {
            heading: 'Multi-Country Holiday View',
            body: 'Toggle regional holiday calendars alongside your personal schedule to coordinate cleanly across international teams and time zones.',
          },
        ],
        faqs: [
          {
            q: 'How do I add an event or reminder to a specific day?',
            a: 'Click any date on the calendar grid, choose Event or Reminder, enter a title and optional time, and click Save.',
          },
          {
            q: 'Can I view holidays for more than one country?',
            a: 'Yes. You can enable multiple holiday regions simultaneously from the holiday selector in the calendar header.',
          },
        ],
      },
      calculator: {
        title: 'Precision Calculator & Live Currency Converter',
        overview:
          'Switch seamlessly between everyday arithmetic, scientific math functions, and real-time foreign exchange conversion with support for both live market quotes and custom manual rates.',
        highlights: [
          {
            heading: 'Standard & Scientific Modes',
            body: 'Handle quick totals, percentages, trigonometry, powers, logarithms, and expression history right inside one fast tool.',
          },
          {
            heading: 'Live & Manual FX Conversion',
            body: 'Compare major currency pairs using updated market exchange rates or switch to Manual Mode when working with fixed invoice rates.',
          },
        ],
        faqs: [
          {
            q: 'Where do the live currency rates come from?',
            a: 'Live Mode retrieves current foreign exchange reference rates from public market feeds and lets you refresh quotes on demand.',
          },
          {
            q: 'When should I use Manual Mode in the currency converter?',
            a: 'Manual Mode is ideal when you want to calculate totals using a specific bank, card, or contract exchange rate.',
          },
        ],
      },
      ip: {
        title: 'Public IPv4 / IPv6 Lookup & Connection Diagnostics',
        overview:
          'Inspect your active public IPv4 and IPv6 addresses, approximate ISP geolocation, ASN network identifiers, and connection security diagnostics in seconds.',
        highlights: [
          {
            heading: 'Dual-Stack IP Detection',
            body: 'Check whether your internet provider routes traffic over IPv4 only or supports dual-stack IPv4 and IPv6 connectivity.',
          },
          {
            heading: 'Route & Privacy Insights',
            body: 'Review approximate city/region routing, timezone offset, DNS encryption status, WebRTC leak checks, and transport security.',
          },
        ],
        faqs: [
          {
            q: 'Why does IP geolocation sometimes show a nearby city?',
            a: 'IP lookup estimates location from your ISP routing node or regional Point of Presence (PoP) rather than device GPS.',
          },
          {
            q: 'What does it mean if IPv6 shows as not detected?',
            a: 'Your current router, VPN, or internet service provider is routing traffic over IPv4 only, which is normal on many networks.',
          },
        ],
      },
      speed: {
        title: 'Real-Time Broadband Speed & Quality Benchmark',
        overview:
          'Measure real-world download throughput, upload bandwidth, round-trip latency, and network jitter to see how well your connection supports 4K streaming, online gaming, and HD video calls.',
        highlights: [
          {
            heading: 'Latency, Jitter & Throughput',
            body: 'Runs multi-phase diagnostics across edge servers to test responsiveness (ping & jitter) as well as sustained download and upload speeds.',
          },
          {
            heading: 'Network Quality Score',
            body: 'Translates raw Mbps and millisecond measurements into clear 1–5 star ratings for Streaming, Gaming, and Video Conferencing.',
          },
        ],
        faqs: [
          {
            q: 'How can I get the most accurate speed test result?',
            a: 'Close heavy background downloads or streams, test near your Wi-Fi router or over Ethernet, and re-run to confirm consistency.',
          },
          {
            q: 'Why do latency and jitter matter alongside Mbps?',
            a: 'Low latency and low jitter keep video calls smooth and multiplayer games responsive even when total bandwidth is moderate.',
          },
        ],
      },
    },
  },
  Chinese: {
    faqHeading: '常见问题',
    tools: {
      links: {
        title: '整理您的日常网页书签',
        overview: 'GeekTabs 书签帮助您将常用网站、办公套件、AI 助手、音乐平台和个人快捷入口按清晰分类整理，每次工作流都可一键直达。',
        highlights: [
          { heading: '自定义分类与即时编辑', body: '无需离开首页即可随时新建书签集合、重命名分类、添加自定义网址或编辑图标。' },
          { heading: '本地隐私与便捷备份', body: '您的书签数据仅保存在本地浏览器中，可随时前往“设置”导出或恢复备份。' },
        ],
        faqs: [
          { q: '我可以添加自己的常用网站吗？', a: '可以。点击任意分类下的“添加书签”按钮即可保存自定义网站标题与链接，或创建新分类。' },
          { q: '我的个人书签会自动保存吗？', a: '所有书签修改均会自动保存至浏览器本地存储，您还可在“设置 > 常规”中导出完整备份文件。' },
        ],
      },
      calendar: {
        title: '智能月历与多国家地区节假日',
        overview: '在清晰的月历视图中统一规划日程截止日期、安排个人提醒，并实时查看多个国家与地区的法定节假日。',
        highlights: [
          { heading: '日程活动与定时提醒', body: '为任意日期添加自定义活动或定时提醒，重要会议、账单和纪念日整月清晰可见。' },
          { heading: '多国节假日同步视图', body: '同时切换多个国家或地区的节假日日历，方便跨团队、跨时区安排日程。' },
        ],
        faqs: [
          { q: '如何为指定日期添加活动或提醒？', a: '点击月历网格中的任意日期，选择“活动”或“提醒”，填写标题和可选时间后点击保存即可。' },
          { q: '可以同时查看多个国家的节假日吗？', a: '可以。您可以在日历顶部的国家地区选择器中同时勾选多个节假日区域。' },
        ],
      },
      calculator: {
        title: '精密计算器与实时汇率换算',
        overview: '在日常四则运算、科学计算函数和实时外汇换算之间无缝切换，同时支持实时市场牌价与手动自定义汇率模式。',
        highlights: [
          { heading: '标准模式与科学计算模式', body: '在一个高效工具内即可完成日常汇总、百分比、三角函数、幂运算、对数与历史记录查看。' },
          { heading: '实时牌价与手动自定义汇率', body: '既可通过实时市场汇率对比主流货币，也可切换至手动模式按固定合同或账单汇率核算。' },
        ],
        faqs: [
          { q: '实时汇率数据来自哪里？', a: '实时模式会从公开外汇市场数据源获取当前参考牌价，并支持随时手动刷新最新报价。' },
          { q: '什么时候适合使用汇率换算的手动模式？', a: '当您希望按照特定银行、信用卡或合同约定的固定汇率核算金额时，手动模式最为适用。' },
        ],
      },
      ip: {
        title: '公网 IPv4 / IPv6 查询与连接诊断',
        overview: '几秒钟内查看您当前的公网 IPv4 与 IPv6 地址、ISP 运营商近似地理位置、ASN 网络编号及连接安全诊断。',
        highlights: [
          { heading: '双栈 IP 网络检测', body: '快速检查您的网络运营商是仅路由 IPv4 流量，还是支持 IPv4 与 IPv6 双栈连接。' },
          { heading: '路由与隐私安全洞察', body: '查看城市/区域路由位置、时区偏移、DNS 加密状态、WebRTC 泄露检测及传输加密信息。' },
        ],
        faqs: [
          { q: '为什么 IP 定位有时显示的是附近城市？', a: 'IP 查询是根据运营商路由节点或区域接入点（PoP）估算位置，而非设备的精准 GPS 定位。' },
          { q: '如果显示未检测到 IPv6 是什么意思？', a: '说明您当前的路由器、VPN 或网络运营商仅通过 IPv4 转发流量，这在多数网络中属于正常情况。' },
        ],
      },
      speed: {
        title: '实时宽带网速与网络质量基准测试',
        overview: '实测真实下载吞吐量、上传带宽、往返延迟与网络抖动，全面评估当前网络对 4K 流媒体、在线游戏与高清视频会议的支持表现。',
        highlights: [
          { heading: '延迟、抖动与上下行吞吐', body: '通过边缘测速节点执行多阶段诊断，全面测试网络响应时间（Ping 与抖动）及持续下载与上传速率。' },
          { heading: '网络质量星级评分', body: '将原始 Mbps 速率与毫秒延迟转化为直观的 1–5 星评级，涵盖流媒体、游戏及视频通话场景。' },
        ],
        faqs: [
          { q: '怎样才能获得最准确的测速结果？', a: '关闭后台大流量下载或高清视频播放，尽量靠近路由器或使用有线连接，并可多测一次以确认稳定性。' },
          { q: '除了 Mbps 网速外，为什么延迟和抖动也很重要？', a: '低延迟和低抖动能够确保视频会议不卡顿、多人联机游戏响应迅速，即使总带宽适中也能流畅体验。' },
        ],
      },
    },
  },
  'Chinese Traditional': {
    faqHeading: '常見問題',
    tools: {
      links: {
        title: '整理您的日常網頁書籤',
        overview: 'GeekTabs 書籤協助您將常用網站、辦公套件、AI 助手、音樂平台與個人捷徑依清晰分類管理，每次工作流程都能一鍵啟動。',
        highlights: [
          { heading: '自訂分類與即時編輯', body: '無須離開首頁即可隨時新增書籤集合、重新命名分類、加入自訂網址或編輯圖示。' },
          { heading: '本機隱私與輕鬆備份', body: '您的書籤集合僅儲存於瀏覽器本機空間，隨時可於「設定」匯出或還原備份。' },
        ],
        faqs: [
          { q: '我可以加入自己常用的網站嗎？', a: '可以。點擊任意分類中的「新增書籤」按鈕即可儲存自訂網站標題與網址，或建立全新分類。' },
          { q: '我的個人書籤會自動儲存嗎？', a: '所有書籤變更都會自動儲存至瀏覽器本機空間，您亦可於「設定 > 一般」下載完整備份檔案。' },
        ],
      },
      calendar: {
        title: '智慧月曆與多國地區節假日',
        overview: '在簡潔清晰的月曆檢視中統一規劃截稿日期、排程個人提醒，並即時掌握多個國家與地區的國定假日。',
        highlights: [
          { heading: '活動排程與定時提醒', body: '為任意日期新增自訂活動或定時提醒，重要會議、帳單與個人里程碑整月清楚掌握。' },
          { heading: '多國節假日同步檢視', body: '可同時顯示多個國家與地區的假日行事曆，方便跨團隊與跨時區協作。' },
        ],
        faqs: [
          { q: '如何在特定日期新增活動或提醒？', a: '點擊月曆網格上的任意日期，選擇「活動」或「提醒」，輸入標題與選填時間後點擊儲存即可。' },
          { q: '可以同時檢視多個國家的假日嗎？', a: '可以。您可在月曆頂端的地區選擇器中同時啟用多個國家或地區的假日顯示。' },
        ],
      },
      calculator: {
        title: '精密計算機與即時匯率換算',
        overview: '在日常四則運算、科學計算函式與即時外匯換算間流暢切換，並同時支援即時市場報價與手動自訂匯率。',
        highlights: [
          { heading: '標準與科學計算模式', body: '在單一快速工具內即可處理日常加總、百分比、三角函數、次方、對數與計算歷史紀錄。' },
          { heading: '即時與手動匯率換算', body: '可依最新市場匯率比較主要貨幣對，或切換為手動模式以固定合約或發票匯率換算。' },
        ],
        faqs: [
          { q: '即時匯率資料從何而來？', a: '即時模式會從公開外匯市場資料來源擷取最新參考匯率，並支援隨時手動重新整理報價。' },
          { q: '什麼時候適合使用手動匯率模式？', a: '當您需要依照特定銀行、信用卡或合約約定匯率計算總額時，手動模式最為理想。' },
        ],
      },
      ip: {
        title: '公網 IPv4 / IPv6 查詢與連線診斷',
        overview: '在數秒內檢視您目前的公網 IPv4 與 IPv6 位址、ISP 業者約略地理位置、ASN 網路代碼及連線安全診斷。',
        highlights: [
          { heading: '雙堆疊 IP 偵測', body: '快速確認您的網路業者是僅透過 IPv4 路由流量，或支援 IPv4 與 IPv6 雙堆疊連線。' },
          { heading: '路由與隱私安全資訊', body: '檢視城市/地區路由位置、時區偏移、DNS 加密狀態、WebRTC 外洩檢查與傳輸加密細節。' },
        ],
        faqs: [
          { q: '為什麼 IP 定位有時會顯示鄰近城市？', a: 'IP 查詢是依據 ISP 路由節點或區域接入點（PoP）推估位置，而非裝置本身的 GPS 座標。' },
          { q: '如果顯示未偵測到 IPv6 代表什麼？', a: '這表示您目前的路由器、VPN 或網路服務商僅透過 IPv4 傳送流量，在許多網路環境中屬於正常現象。' },
        ],
      },
      speed: {
        title: '即時寬頻網速與連線品質基準測試',
        overview: '量測實際下載吞吐量、上傳頻寬、往返延遲與網路抖動，評估連線支援 4K 串流、線上遊戲與高畫質視訊通話的表現。',
        highlights: [
          { heading: '延遲、抖動與吞吐效能', body: '透過邊緣測速伺服器執行多階段診斷，測試回應速度（Ping 與抖動）以及持續下載與上傳速率。' },
          { heading: '網路品質評分', body: '將原始 Mbps 與毫秒數據轉換為直覺的 1–5 星評分，涵蓋串流影音、遊戲與視訊會議情境。' },
        ],
        faqs: [
          { q: '如何取得最準確的測速結果？', a: '請關閉背景大量下載或高畫質串流，盡量靠近 Wi-Fi 路由器或改用有線網路，並可重測確認穩定度。' },
          { q: '除了 Mbps 之外，為什麼延遲與抖動也很重要？', a: '低延遲與低抖動能讓視訊通話流暢不卡頓、多人連線遊戲反應敏捷，即使總頻寬中等也能保有良好體驗。' },
        ],
      },
    },
  },
  Spanish: {
    faqHeading: 'Preguntas frecuentes',
    tools: {
      links: {
        title: 'Organiza tus marcadores web diarios',
        overview: 'Marcadores de GeekTabs te permite agrupar tus sitios web frecuentes, suites de oficina, asistentes de IA, música y accesos directos personales en categorías visuales limpias.',
        highlights: [
          { heading: 'Categorías personalizadas y edición al instante', body: 'Crea nuevas colecciones de marcadores, renombra categorías, añade URL personalizadas o edita iconos sin salir de tu espacio inicial.' },
          { heading: 'Privacidad local y copias sencillas', body: 'Tus marcadores permanecen guardados localmente en tu navegador y pueden exportarse o restaurarse en cualquier momento desde Ajustes.' },
        ],
        faqs: [
          { q: '¿Puedo añadir mis propios sitios web personalizados?', a: 'Sí. Usa el botón Añadir marcador dentro de cualquier categoría para guardar un título y una URL, o crea tu propia categoría.' },
          { q: '¿Se guardan automáticamente mis marcadores personales?', a: 'Todos los cambios se guardan automáticamente en el almacenamiento del navegador y puedes descargar una copia completa desde Ajustes > General.' },
        ],
      },
      calendar: {
        title: 'Calendario mensual inteligente y festivos regionales',
        overview: 'Planifica próximos plazos, programa recordatorios personales y sigue los días festivos de varios países en una única vista mensual clara.',
        highlights: [
          { heading: 'Eventos y recordatorios con hora', body: 'Añade eventos personalizados o recordatorios programados en cualquier fecha para mantener visibles reuniones, pagos y metas.' },
          { heading: 'Vista de festivos multipaís', body: 'Activa calendarios de festivos regionales junto a tu agenda personal para coordinar fácilmente entre equipos internacionales.' },
        ],
        faqs: [
          { q: '¿Cómo añado un evento o recordatorio a un día concreto?', a: 'Haz clic en cualquier fecha del calendario, elige Evento o Recordatorio, introduce un título y hora opcional, y pulsa Guardar.' },
          { q: '¿Puedo ver los festivos de más de un país?', a: 'Sí. Puedes activar varias regiones de festivos a la vez desde el selector de país en la cabecera del calendario.' },
        ],
      },
      calculator: {
        title: 'Calculadora de precisión y conversor de divisas en vivo',
        overview: 'Alterna sin esfuerzo entre aritmética cotidiana, funciones científicas y conversión de divisas en tiempo real con tipos de mercado o tasas manuales.',
        highlights: [
          { heading: 'Modos estándar y científico', body: 'Resuelve sumas rápidas, porcentajes, trigonometría, potencias, logaritmos e historial de operaciones desde una sola herramienta.' },
          { heading: 'Conversión FX en vivo y manual', body: 'Compara divisas principales con cotizaciones actualizadas o cambia a Modo Manual para usar tipos de cambio fijos de factura.' },
        ],
        faqs: [
          { q: '¿De dónde provienen los tipos de cambio en vivo?', a: 'El modo en vivo obtiene tasas de referencia de divisas desde fuentes públicas del mercado y te permite actualizarlas al instante.' },
          { q: '¿Cuándo conviene usar el Modo Manual?', a: 'El Modo Manual es ideal cuando necesitas calcular importes con el tipo de cambio exacto de tu banco, tarjeta o contrato.' },
        ],
      },
      ip: {
        title: 'Consulta pública IPv4 / IPv6 y diagnóstico de conexión',
        overview: 'Inspecciona en segundos tus direcciones públicas IPv4 e IPv6, geolocalización aproximada de tu ISP, identificador ASN y diagnósticos de seguridad.',
        highlights: [
          { heading: 'Detección IP de doble pila', body: 'Comprueba si tu proveedor enruta el tráfico solo por IPv4 o si admite conectividad dual IPv4 e IPv6.' },
          { heading: 'Información de ruta y privacidad', body: 'Revisa ciudad/región aproximada, diferencia UTC, estado de cifrado DNS, comprobaciones de fugas WebRTC y seguridad de transporte.' },
        ],
        faqs: [
          { q: '¿Por qué la geolocalización IP muestra a veces una ciudad cercana?', a: 'La búsqueda de IP estima la ubicación según el nodo de enrutamiento o PoP regional de tu ISP, no mediante el GPS del dispositivo.' },
          { q: '¿Qué significa si IPv6 aparece como no detectado?', a: 'Significa que tu router, VPN o proveedor de internet opera solo sobre IPv4, algo habitual en muchas redes.' },
        ],
      },
      speed: {
        title: 'Prueba de velocidad de banda ancha y calidad en tiempo real',
        overview: 'Mide velocidad real de descarga, ancho de banda de subida, latencia de ida y vuelta y jitter para evaluar streaming 4K, gaming y videollamadas HD.',
        highlights: [
          { heading: 'Latencia, jitter y velocidad', body: 'Ejecuta diagnósticos multifase en servidores perimetrales para medir respuesta (ping y jitter) y tasas sostenidas de descarga y subida.' },
          { heading: 'Puntuación de calidad de red', body: 'Convierte los valores en Mbps y milisegundos en claras valoraciones de 1 a 5 estrellas para Streaming, Gaming y Videollamadas.' },
        ],
        faqs: [
          { q: '¿Cómo obtener el resultado más preciso en el test de velocidad?', a: 'Cierra descargas pesadas o transmisiones en segundo plano, haz la prueba cerca del router Wi-Fi o por cable y repite para confirmar.' },
          { q: '¿Por qué importan la latencia y el jitter además de los Mbps?', a: 'Una latencia baja y un jitter mínimo mantienen fluidas las videollamadas y los juegos online incluso con ancho de banda moderado.' },
        ],
      },
    },
  },
  French: {
    faqHeading: 'Questions fréquentes',
    tools: {
      links: {
        title: 'Organisez vos favoris web du quotidien',
        overview: 'Les favoris GeekTabs regroupent vos sites fréquents, suites bureautiques, outils d’IA, plateformes musicales et raccourcis personnels dans des catégories visuelles claires.',
        highlights: [
          { heading: 'Catégories personnalisées et édition rapide', body: 'Créez de nouvelles collections, renommez vos catégories, ajoutez des URL ou modifiez les icônes à tout moment depuis votre espace.' },
          { heading: 'Confidentialité locale et sauvegardes simples', body: 'Vos favoris restent enregistrés localement dans votre navigateur et peuvent être exportés ou restaurés depuis les Paramètres.' },
        ],
        faqs: [
          { q: 'Puis-je ajouter mes propres sites web aux Favoris ?', a: 'Oui. Utilisez le bouton Ajouter un favori dans n’importe quelle catégorie pour enregistrer un titre et une URL, ou créez votre propre catégorie.' },
          { q: 'Mes favoris personnels sont-ils enregistrés automatiquement ?', a: 'Toutes les modifications sont sauvegardées automatiquement dans votre navigateur, avec export complet possible via Paramètres > Général.' },
        ],
      },
      calendar: {
        title: 'Calendrier mensuel intelligent et jours fériés',
        overview: 'Planifiez vos échéances, programmez vos rappels personnels et suivez les jours fériés de plusieurs pays dans une vue mensuelle épurée.',
        highlights: [
          { heading: 'Événements et rappels horodatés', body: 'Ajoutez des événements ou des rappels minutés à n’importe quelle date pour garder réunions, factures et échéances visibles tout le mois.' },
          { heading: 'Suivi multi-pays des jours fériés', body: 'Affichez les jours fériés de plusieurs régions en parallèle de votre agenda pour coordonner vos équipes internationales.' },
        ],
        faqs: [
          { q: 'Comment ajouter un événement ou un rappel à un jour précis ?', a: 'Cliquez sur une date du calendrier, choisissez Événement ou Rappel, saisissez un titre et une heure optionnelle puis cliquez sur Enregistrer.' },
          { q: 'Puis-je afficher les jours fériés de plusieurs pays ?', a: 'Oui. Vous pouvez activer simultanément plusieurs régions depuis le sélecteur de pays en haut du calendrier.' },
        ],
      },
      calculator: {
        title: 'Calculatrice de précision et convertisseur de devises en direct',
        overview: 'Passez sans friction des calculs du quotidien aux fonctions scientifiques et à la conversion de devises en temps réel ou à taux manuel fixe.',
        highlights: [
          { heading: 'Modes standard et scientifique', body: 'Effectuez totaux rapides, pourcentages, trigonométrie, puissances, logarithmes et consultez l’historique dans un seul outil rapide.' },
          { heading: 'Conversion de devises en direct et manuelle', body: 'Comparez les principales paires avec les cours actualisés du marché ou passez en mode manuel pour des taux fixes de facturation.' },
        ],
        faqs: [
          { q: 'D’où proviennent les taux de change en direct ?', a: 'Le mode en direct récupère les taux de référence publics du marché des changes et permet d’actualiser les cotations à la demande.' },
          { q: 'Quand utiliser le mode manuel du convertisseur ?', a: 'Le mode manuel est idéal pour calculer des montants selon un taux spécifique de banque, carte ou contrat.' },
        ],
      },
      ip: {
        title: 'Analyse IPv4 / IPv6 publique et diagnostic réseau',
        overview: 'Inspectez en quelques secondes vos adresses publiques IPv4 et IPv6, la géolocalisation approximative du FAI, l’ASN et les diagnostics de sécurité.',
        highlights: [
          { heading: 'Détection IP double pile', body: 'Vérifiez si votre fournisseur achemine le trafic uniquement en IPv4 ou prend en charge la connectivité double pile IPv4/IPv6.' },
          { heading: 'Routage et confidentialité', body: 'Consultez la zone de routage estimée, le fuseau horaire, l’état du chiffrement DNS, les tests de fuite WebRTC et la sécurité TLS.' },
        ],
        faqs: [
          { q: 'Pourquoi la géolocalisation IP indique-t-elle parfois une ville voisine ?', a: 'La recherche IP estime la position via le nœud de routage ou point de présence (PoP) de votre FAI plutôt que par GPS.' },
          { q: 'Que signifie IPv6 non détecté ?', a: 'Votre routeur, VPN ou fournisseur d’accès utilise actuellement uniquement IPv4, ce qui reste courant sur de nombreux réseaux.' },
        ],
      },
      speed: {
        title: 'Test de débit haut débit et qualité réseau en temps réel',
        overview: 'Mesurez votre débit descendant et montant réel, la latence aller-retour et la gigue pour évaluer le streaming 4K, le jeu en ligne et la visio HD.',
        highlights: [
          { heading: 'Latence, gigue et débit', body: 'Exécute des diagnostics multi-étapes sur des serveurs de proximité pour mesurer la réactivité (ping et gigue) et les débits soutenus.' },
          { heading: 'Score de qualité réseau', body: 'Traduit vos mesures en Mbps et millisecondes en notes claires de 1 à 5 étoiles pour le Streaming, le Jeu et les Appels vidéo.' },
        ],
        faqs: [
          { q: 'Comment obtenir un résultat de test de débit fiable ?', a: 'Fermez les téléchargements lourds ou flux vidéo en arrière-plan, testez près du routeur Wi-Fi ou en Ethernet et relancez pour confirmer.' },
          { q: 'Pourquoi la latence et la gigue comptent-elles autant que les Mbps ?', a: 'Une faible latence et peu de gigue garantissent des appels fluides et des jeux réactifs même avec une bande passante modérée.' },
        ],
      },
    },
  },
  German: {
    faqHeading: 'Häufig gestellte Fragen',
    tools: {
      links: {
        title: 'Tägliche Web-Lesezeichen übersichtlich organisieren',
        overview: 'GeekTabs Lesezeichen bündelt häufig besuchte Websites, Office-Suites, KI-Assistenten, Musikplattformen und persönliche Kurzbefehle in klaren visuellen Kategorien.',
        highlights: [
          { heading: 'Eigene Kategorien & Sofortbearbeitung', body: 'Erstellen Sie neue Sammlungen, benennen Sie Kategorien um, fügen Sie eigene URLs hinzu oder passen Sie Symbole jederzeit direkt an.' },
          { heading: 'Lokaler Datenschutz & einfache Backups', body: 'Ihre Lesezeichen bleiben lokal in Ihrem Browser gespeichert und lassen sich jederzeit in den Einstellungen exportieren oder wiederherstellen.' },
        ],
        faqs: [
          { q: 'Kann ich eigene Websites zu den Lesezeichen hinzufügen?', a: 'Ja. Nutzen Sie in jeder Kategorie die Schaltfläche „Lesezeichen hinzufügen“ für eigene Titel und URLs oder legen Sie eine neue Kategorie an.' },
          { q: 'Werden meine persönlichen Lesezeichen automatisch gesichert?', a: 'Alle Änderungen werden automatisch lokal im Browser gespeichert; eine vollständige Sicherungsdatei lässt sich unter Einstellungen > Allgemein laden.' },
        ],
      },
      calendar: {
        title: 'Smarter Monatskalender & internationale Feiertage',
        overview: 'Planen Sie Fristen, setzen Sie persönliche Erinnerungen und behalten Sie gesetzliche Feiertage mehrerer Länder in einer klaren Monatsansicht im Blick.',
        highlights: [
          { heading: 'Termine & zeitgenaue Erinnerungen', body: 'Fügen Sie jedem Datum Termine oder Erinnerungen mit Uhrzeit hinzu, damit Meetings, Rechnungen und Meilensteine sichtbar bleiben.' },
          { heading: 'Länderübergreifende Feiertagsansicht', body: 'Aktivieren Sie regionale Feiertagskalender parallel zu Ihrem Zeitplan für reibungslose Abstimmung über Zeitzonen hinweg.' },
        ],
        faqs: [
          { q: 'Wie füge ich einem bestimmten Tag einen Termin hinzu?', a: 'Klicken Sie auf ein Datum im Kalender, wählen Sie Termin oder Erinnerung, geben Sie Titel und optionale Uhrzeit ein und speichern Sie.' },
          { q: 'Kann ich Feiertage für mehr als ein Land anzeigen?', a: 'Ja. Über die Länderauswahl im Kalenderkopf lassen sich mehrere Feiertagsregionen gleichzeitig aktivieren.' },
        ],
      },
      calculator: {
        title: 'Präzisionsrechner & Live-Währungsumrechner',
        overview: 'Wechseln Sie nahtlos zwischen Alltagsarithmetik, wissenschaftlichen Funktionen und Echtzeit-Währungsumrechnung mit Live-Kursen oder manuellen Festkursen.',
        highlights: [
          { heading: 'Standard- & Wissenschaftsmodus', body: 'Erledigen Sie Summen, Prozente, Trigonometrie, Potenzen, Logarithmen und Verlaufsprüfungen direkt in einem schnellen Werkzeug.' },
          { heading: 'Live- & manueller Wechselkurs', body: 'Vergleichen Sie wichtige Währungspaare mit aktuellen Marktkursen oder wechseln Sie für feste Rechnungskurse in den manuellen Modus.' },
        ],
        faqs: [
          { q: 'Woher stammen die Live-Wechselkurse?', a: 'Der Live-Modus ruft aktuelle Referenzkurse aus öffentlichen Marktdaten ab und lässt sich bei Bedarf jederzeit aktualisieren.' },
          { q: 'Wann ist der manuelle Modus sinnvoll?', a: 'Der manuelle Modus eignet sich ideal, wenn Sie Beträge mit einem bestimmten Bank-, Karten- oder Vertragswechselkurs berechnen möchten.' },
        ],
      },
      ip: {
        title: 'Öffentliche IPv4 / IPv6-Abfrage & Verbindungsdiagnose',
        overview: 'Prüfen Sie in Sekunden Ihre aktiven öffentlichen IPv4- und IPv6-Adressen, die ungefähre ISP-Geolokalisierung, ASN-Daten und Sicherheitsdiagnosen.',
        highlights: [
          { heading: 'Dual-Stack-IP-Erkennung', body: 'Prüfen Sie, ob Ihr Internetanbieter den Datenverkehr nur über IPv4 routet oder bereits Dual-Stack mit IPv4 und IPv6 unterstützt.' },
          { heading: 'Routing- & Datenschutzinfos', body: 'Überprüfen Sie Region, Zeitzonenversatz, DNS-Verschlüsselungsstatus, WebRTC-Leak-Tests und Transportsicherheit.' },
        ],
        faqs: [
          { q: 'Warum zeigt die IP-Ortung manchmal eine Nachbarstadt an?', a: 'Die IP-Abfrage schätzt den Standort anhand des regionalen Routing-Knotens (PoP) Ihres Providers und nicht per Geräte-GPS.' },
          { q: 'Was bedeutet „IPv6 nicht erkannt“?', a: 'Ihr aktueller Router, VPN oder Internetanbieter leitet den Verkehr ausschließlich über IPv4, was in vielen Netzen normal ist.' },
        ],
      },
      speed: {
        title: 'Echtzeit-Breitband-Speedtest & Qualitätsbenchmark',
        overview: 'Messen Sie reale Download-Rate, Upload-Bandbreite, Round-Trip-Latenz und Jitter, um die Eignung für 4K-Streaming, Gaming und HD-Videocalls zu prüfen.',
        highlights: [
          { heading: 'Latenz, Jitter & Datendurchsatz', body: 'Führt mehrstufige Messungen über Edge-Server durch, um Reaktionszeit (Ping & Jitter) sowie konstante Up-/Download-Raten zu testen.' },
          { heading: 'Netzwerkqualitätswert', body: 'Übersetzt rohe Mbps- und Millisekunden-Werte in klare 1–5-Sterne-Bewertungen für Streaming, Gaming und Videokonferenzen.' },
        ],
        faqs: [
          { q: 'Wie erhalte ich möglichst genaue Testergebnisse?', a: 'Schließen Sie große Hintergrund-Downloads oder Streams, testen Sie nahe am Router oder per LAN-Kabel und wiederholen Sie den Test.' },
          { q: 'Warum sind Latenz und Jitter neben Mbps so wichtig?', a: 'Niedrige Latenz und geringer Jitter sorgen für flüssige Videoanrufe und reaktionsschnelle Spiele selbst bei moderater Bandbreite.' },
        ],
      },
    },
  },
  Japanese: {
    faqHeading: 'よくある質問',
    tools: {
      links: {
        title: '毎日のWebブックマークをスマートに整理',
        overview: 'GeekTabsのブックマークでは、よく使うサイト、オフィスツール、AIアシスタント、音楽サービス、個人用ショートカットを見やすいカテゴリに整理できます。',
        highlights: [
          { heading: '自由なカテゴリ作成と即時編集', body: 'スタート画面から離れることなく、ブックマーク集の作成、カテゴリ名の変更、URLの追加やアイコン編集が行えます。' },
          { heading: 'ローカル保存によるプライバシー保護', body: 'ブックマークはお使いのブラウザ内に安全に保存され、設定画面からいつでもバックアップや復元が可能です。' },
        ],
        faqs: [
          { q: '自分の好きなWebサイトを追加できますか？', a: 'はい。各カテゴリ内の「ブックマークを追加」ボタンからタイトルとURLを保存したり、新しいカテゴリを作成したりできます。' },
          { q: 'ブックマークは自動で保存されますか？', a: 'すべての変更はブラウザのストレージへ自動保存され、「設定 > 一般」から完全なバックアップファイルを書き出せます。' },
        ],
      },
      calendar: {
        title: 'スマート月間カレンダー＆複数国の祝日表示',
        overview: '見やすい月間カレンダー上で、予定の締め切り管理やリマインダー設定、複数国・地域の祝日確認をまとめて行えます。',
        highlights: [
          { heading: '予定と時刻付きリマインダー', body: '任意の日付にカスタム予定や時刻指定のリマインダーを登録し、会議や支払い期限を月単位で把握できます。' },
          { heading: '複数地域の祝日を同時チェック', body: '個人のスケジュールと並行して複数の国・地域の祝日を切り替えられ、海外チームとの調整にも便利です。' },
        ],
        faqs: [
          { q: '特定の日付に予定やリマインダーを追加するには？', a: 'カレンダー上の日付をクリックし、「予定」または「リマインダー」を選んでタイトルと時刻（任意）を入力し保存してください。' },
          { q: '複数の国の祝日を同時に見られますか？', a: 'はい。カレンダー上部の祝日セレクターから複数の国・地域を同時に有効にできます。' },
        ],
      },
      calculator: {
        title: '高精度電卓＆リアルタイム通貨コンバーター',
        overview: '日常計算や関数電卓、ライブ市場レートと手動設定レートの両方に対応した為替計算を1つの画面でスムーズに切り替えられます。',
        highlights: [
          { heading: '標準モード＆関数計算モード', body: '合計やパーセント計算から三角関数、累乗、対数、計算履歴までひとつの高速なツールでこなせます。' },
          { heading: 'ライブ為替＆手動レート換算', body: '最新市場レートでの通貨比較に加え、請求書や契約上の固定レートを使った手動モード換算にも対応します。' },
        ],
        faqs: [
          { q: 'ライブ為替レートはどこから取得していますか？', a: 'ライブモードでは公開為替フィードから参考レートを取得し、必要なときにオンデマンドで更新できます。' },
          { q: '手動モードはどのようなときに使いますか？', a: '銀行やカード会社、契約書で指定された固定レートをもとに金額を換算したい場合に最適です。' },
        ],
      },
      ip: {
        title: 'パブリックIPv4 / IPv6確認＆接続診断',
        overview: '現在使用中のIPv4・IPv6アドレス、プロバイダーのおおよその地域情報、ASNネットワーク番号、接続セキュリティ診断を瞬時に確認できます。',
        highlights: [
          { heading: 'デュアルスタックIP検出', body: 'お使いの回線がIPv4のみでルーティングされているか、IPv4/IPv6デュアルスタックに対応しているかを確認できます。' },
          { heading: '経路とプライバシー診断', body: '推定都市・地域、タイムゾーン、DNS暗号化状況、WebRTCリーク検査、通信トランスポートの安全性を一覧できます。' },
        ],
        faqs: [
          { q: 'IPの位置情報が近隣の都市で表示されるのはなぜですか？', a: 'IP検索は端末のGPSではなく、インターネットプロバイダーの経路ノード（PoP）を基準に位置を推定するためです。' },
          { q: 'IPv6が「未検出」となるのはどういう意味ですか？', a: '現在お使いのルーター、VPN、またはプロバイダーがIPv4のみで通信している状態で、多くの環境で一般的な動作です。' },
        ],
      },
      speed: {
        title: 'リアルタイム回線速度＆ネットワーク品質テスト',
        overview: '実測のダウンロード・アップロード速度、応答遅延（Ping）、ジッターを計測し、4K動画視聴やオンラインゲーム、HD通話への適性を診断します。',
        highlights: [
          { heading: '遅延・ジッター・スループット計測', body: 'エッジサーバーに対して多段階診断を実行し、応答性（Ping・ジッター）と持続的な上下通信速度を正確に測定します。' },
          { heading: 'ネットワーク品質スコア', body: '計測されたMbpsとミリ秒から、ストリーミング・ゲーム・ビデオ通話向けのわかりやすい5つ星評価を算出します。' },
        ],
        faqs: [
          { q: 'より正確な速度テスト結果を得るには？', a: 'バックグラウンドの大きなダウンロードや動画再生を止め、Wi-Fiルーターの近くまたは有線LAN接続で計測してください。' },
          { q: 'Mbpsだけでなく遅延やジッターも重要なのはなぜ？', a: '遅延やジッターが低いほど、総帯域が中程度でもビデオ会議の途切れやゲームのラグが抑えられるためです。' },
        ],
      },
    },
  },
  Korean: {
    faqHeading: '자주 묻는 질문',
    tools: {
      links: {
        title: '일상 웹 북마크를 깔끔하게 정리하세요',
        overview: 'GeekTabs 북마크는 자주 방문하는 웹사이트, 오피스 도구, AI 어시스턴트, 음악 플랫폼 및 개인 바로가기를 깔끔한 시각적 카테고리로 묶어 한 번의 클릭으로 시작할 수 있게 해줍니다.',
        highlights: [
          { heading: '맞춤형 카테고리 및 즉시 편집', body: '시작 화면을 벗어나지 않고 언제든 새 북마크 컬렉션을 만들고 카테고리 이름을 바꾸거나 URL·아이콘을 수정할 수 있습니다.' },
          { heading: '로컬 개인정보 보호 및 간편한 백업', body: '북마크 데이터는 브라우저 내부에 로컬 저장되며 설정에서 언제든 내보내거나 복원할 수 있습니다.' },
        ],
        faqs: [
          { q: '내가 자주 가는 웹사이트를 직접 추가할 수 있나요?', a: '네. 원하는 카테고리의 북마크 추가 버튼을 눌러 사이트 이름과 URL을 저장하거나 새 카테고리를 만들 수 있습니다.' },
          { q: '개인 북마크는 자동으로 저장되나요?', a: '모든 변경 사항은 브라우저 저장소에 자동 저장되며 설정 > 일반에서 전체 백업 파일을 다운로드할 수 있습니다.' },
        ],
      },
      calendar: {
        title: '스마트 월간 캘린더 및 다국가 공휴일',
        overview: '깔끔한 월간 캘린더 화면에서 다가오는 마감 일정, 개인 알림, 여러 국가 및 지역의 공휴일을 한눈에 관리하세요.',
        highlights: [
          { heading: '일정 및 시간 지정 알림', body: '원하는 날짜에 맞춤 일정이나 시간 알림을 추가해 중요한 회의와 납부일, 기념일을 한 달 내내 놓치지 않도록 관리합니다.' },
          { heading: '다국가 공휴일 동시 보기', body: '개인 일정과 함께 여러 지역의 공휴일 달력을 함께 켜서 글로벌 팀이나 시간대 간 일정을 손쉽게 조율하세요.' },
        ],
        faqs: [
          { q: '특정 날짜에 일정이나 알림을 추가하려면 어떻게 하나요?', a: '달력 격자에서 날짜를 클릭하고 일정 또는 알림을 선택한 뒤 제목과 선택 시간을 입력하고 저장을 누르면 됩니다.' },
          { q: '여러 국가의 공휴일을 동시에 볼 수 있나요?', a: '네. 캘린더 상단의 공휴일 선택기에서 여러 국가 및 지역을 동시에 활성화할 수 있습니다.' },
        ],
      },
      calculator: {
        title: '정밀 계산기 및 실시간 환율 변환기',
        overview: '일반 사칙연산, 공학용 수학 함수, 실시간 시장 환율과 수동 지정 환율을 모두 지원하는 외화 계산 기능을 한곳에서 자유롭게 전환하세요.',
        highlights: [
          { heading: '일반 및 공학용 계산 모드', body: '빠른 합계와 백분율, 삼각함수, 거듭제곱, 로그 및 계산 기록 확인까지 하나의 빠른 도구에서 처리합니다.' },
          { heading: '실시간 및 수동 환율 계산', body: '최신 시장 환율로 주요 통화를 비교하거나 고정 인보이스·계약 환율이 필요할 때 수동 모드로 전환할 수 있습니다.' },
        ],
        faqs: [
          { q: '실시간 환율 데이터는 어디에서 가져오나요?', a: '실시간 모드는 공개 외환 시장 피드에서 최신 기준 환율을 조회하며 필요할 때 즉시 새로고침할 수 있습니다.' },
          { q: '수동 환율 모드는 언제 사용하면 좋나요?', a: '은행, 카드사 또는 계약서에서 정한 특정 고정 환율로 금액을 계산하고 싶을 때 수동 모드가 가장 유용합니다.' },
        ],
      },
      ip: {
        title: '공인 IPv4 / IPv6 조회 및 연결 진단',
        overview: '현재 사용 중인 공인 IPv4 및 IPv6 주소, 통신사(ISP) 기반 추정 위치, ASN 네트워크 식별자 및 보안 연결 상태를 몇 초 만에 확인하세요.',
        highlights: [
          { heading: '듀얼 스택 IP 감지', body: '인터넷 회선이 IPv4 전용으로 라우팅되는지, IPv4와 IPv6 듀얼 스택을 지원하는지 확인합니다.' },
          { heading: '경로 및 개인정보 보안 분석', body: '대략적인 도시/지역 경로, 시간대 오프셋, DNS 암호화 상태, WebRTC 유출 점검 및 전송 보안 상태를 확인할 수 있습니다.' },
        ],
        faqs: [
          { q: 'IP 위치 정보가 인근 다른 도시로 표시되는 이유는 무엇인가요?', a: 'IP 조회는 기기의 GPS가 아니라 통신사의 지역 라우팅 거점(PoP)을 기준으로 위치를 추정하기 때문입니다.' },
          { q: 'IPv6가 감지되지 않음으로 표시되면 어떤 의미인가요?', a: '현재 공유기, VPN 또는 인터넷 회선이 IPv4로만 트래픽을 전송하고 있음을 의미하며 많은 네트워크에서 정상적인 상태입니다.' },
        ],
      },
      speed: {
        title: '실시간 인터넷 속도 측정 및 품질 벤치마크',
        overview: '실제 다운로드·업로드 대역폭, 왕복 지연 시간(Ping), 지터를 측정해 4K 스트리밍, 온라인 게임, HD 화상 회의 지원 수준을 확인하세요.',
        highlights: [
          { heading: '지연 시간, 지터 및 전송 속도', body: '엣지 서버와 다단계 진단을 수행해 응답 속도(핑·지터)와 지속적인 다운로드·업로드 속도를 측정합니다.' },
          { heading: '네트워크 품질 점수', body: '측정된 Mbps와 밀리초 데이터를 바탕으로 스트리밍, 게이밍, 화상 통화별 1~5점 별점 등급을 제공합니다.' },
        ],
        faqs: [
          { q: '가장 정확한 속도 측정 결과를 얻으려면 어떻게 해야 하나요?', a: '백그라운드 대용량 다운로드나 영상 스트리밍을 잠시 끄고 공유기 근처 또는 유선 LAN 상태에서 다시 측정해 보세요.' },
          { q: 'Mbps 속도 외에 지연 시간과 지터가 왜 중요한가요?', a: '지연 시간과 지터가 낮아야 전체 대역폭이 보통 수준이어도 화상 통화가 끊기지 않고 게임 반응 속도가 쾌적합니다.' },
        ],
      },
    },
  },
  Italian: {
    faqHeading: 'Domande frequenti',
    tools: {
      links: {
        title: 'Organizza i tuoi segnalibri web quotidiani',
        overview: 'I segnalibri di GeekTabs raccolgono siti frequenti, suite da ufficio, assistenti IA, musica e collegamenti personali in categorie visive ordinate.',
        highlights: [
          { heading: 'Categorie personalizzate e modifica immediata', body: 'Crea nuove raccolte, rinomina categorie, aggiungi URL personalizzati o modifica le icone senza lasciare il tuo spazio.' },
          { heading: 'Privacy locale e backup semplici', body: 'I tuoi segnalibri restano salvati localmente nel browser e possono essere esportati o ripristinati in qualsiasi momento dalle Impostazioni.' },
        ],
        faqs: [
          { q: 'Posso aggiungere i miei siti web personalizzati?', a: 'Sì. Usa il pulsante Aggiungi segnalibro in qualsiasi categoria per salvare titolo e URL o crea una nuova categoria.' },
          { q: 'I miei segnalibri vengono salvati automaticamente?', a: 'Tutte le modifiche vengono salvate automaticamente nel browser e puoi scaricare un backup completo da Impostazioni > Generali.' },
        ],
      },
      calendar: {
        title: 'Calendario mensile smart e festività multi-paese',
        overview: 'Pianifica scadenze, imposta promemoria personali e consulta le festività pubbliche di più paesi in una vista mensile chiara.',
        highlights: [
          { heading: 'Eventi e promemoria con orario', body: 'Aggiungi eventi personalizzati o promemoria orari a qualsiasi giorno per tenere sotto controllo riunioni, scadenze e obiettivi.' },
          { heading: 'Vista festività multi-paese', body: 'Attiva i calendari delle festività regionali accanto alla tua agenda per coordinarti al meglio tra fusi orari diversi.' },
        ],
        faqs: [
          { q: 'Come aggiungo un evento o promemoria a una data?', a: 'Fai clic su un giorno del calendario, scegli Evento o Promemoria, inserisci titolo ed eventuale orario e premi Salva.' },
          { q: 'Posso visualizzare le festività di più paesi insieme?', a: 'Sì. Puoi abilitare più aree geografiche contemporaneamente dal selettore nell’intestazione del calendario.' },
        ],
      },
      calculator: {
        title: 'Calcolatrice di precisione e convertitore valute live',
        overview: 'Passa facilmente dai calcoli quotidiani alle funzioni scientifiche e alla conversione di valute con cambi di mercato in tempo reale o tassi manuali.',
        highlights: [
          { heading: 'Modalità standard e scientifica', body: 'Esegui totali rapidi, percentuali, trigonometria, potenze, logaritmi e controlla la cronologia in un unico strumento veloce.' },
          { heading: 'Conversione FX live e manuale', body: 'Confronta le principali valute con tassi aggiornati oppure usa la modalità manuale per cambi fissi di banca o fattura.' },
        ],
        faqs: [
          { q: 'Da dove arrivano i tassi di cambio live?', a: 'La modalità live recupera i tassi di riferimento da feed pubblici di mercato e consente l’aggiornamento su richiesta.' },
          { q: 'Quando conviene usare la modalità manuale?', a: 'La modalità manuale è ideale quando devi calcolare importi con il tasso fisso di una specifica banca, carta o contratto.' },
        ],
      },
      ip: {
        title: 'Ricerca IPv4 / IPv6 pubblico e diagnostica connessione',
        overview: 'Verifica in pochi secondi i tuoi indirizzi pubblici IPv4 e IPv6, la geolocalizzazione approssimativa dell’ISP, l’ASN e la sicurezza della connessione.',
        highlights: [
          { heading: 'Rilevamento IP dual-stack', body: 'Controlla se il tuo provider instrada il traffico solo su IPv4 o supporta la connettività dual-stack IPv4 e IPv6.' },
          { heading: 'Dettagli su percorso e privacy', body: 'Esamina città/regione stimata, fuso orario, cifratura DNS, test contro perdite WebRTC e sicurezza del trasporto.' },
        ],
        faqs: [
          { q: 'Perché la geolocalizzazione IP mostra talvolta una città vicina?', a: 'La posizione IP viene stimata dal nodo di instradamento o PoP regionale dell’ISP e non dal GPS del dispositivo.' },
          { q: 'Cosa significa se IPv6 risulta non rilevato?', a: 'Significa che il router, la VPN o il provider instradano attualmente solo su IPv4, condizione normale su molte reti.' },
        ],
      },
      speed: {
        title: 'Test velocità banda larga e qualità rete in tempo reale',
        overview: 'Misura velocità reale di download, banda di upload, latenza e jitter per valutare il supporto a streaming 4K, gaming online e videochiamate HD.',
        highlights: [
          { heading: 'Latenza, jitter e throughput', body: 'Esegue test multifase verso server perimetrali per verificare reattività (ping e jitter) e velocità sostenute in download e upload.' },
          { heading: 'Punteggio qualità della rete', body: 'Converte Mbps e millisecondi in valutazioni chiare da 1 a 5 stelle per Streaming, Gaming e Videochiamate.' },
        ],
        faqs: [
          { q: 'Come ottenere il risultato più preciso nel test di velocità?', a: 'Chiudi download pesanti o streaming in background, esegui il test vicino al router Wi-Fi o via cavo Ethernet e ripeti la prova.' },
          { q: 'Perché latenza e jitter contano oltre ai Mbps?', a: 'Bassa latenza e basso jitter mantengono fluide le videochiamate e reattivi i giochi online anche con banda moderata.' },
        ],
      },
    },
  },
  Russian: {
    faqHeading: 'Частые вопросы',
    tools: {
      links: {
        title: 'Организуйте повседневные веб-закладки',
        overview: 'Закладки GeekTabs объединяют часто посещаемые сайты, офисные пакеты, ИИ-помощников, музыку и личные ссылки в аккуратные визуальные категории.',
        highlights: [
          { heading: 'Свои категории и мгновенное редактирование', body: 'Создавайте новые подборки, переименовывайте категории, добавляйте свои URL-адреса и меняйте иконки прямо в рабочем пространстве.' },
          { heading: 'Локальная приватность и простое резервирование', body: 'Все закладки хранятся локально в вашем браузере; вы можете в любой момент экспортировать или восстановить их в Настройках.' },
        ],
        faqs: [
          { q: 'Можно ли добавить собственные сайты в Закладки?', a: 'Да. Нажмите «Добавить закладку» в любой категории, чтобы сохранить название и адрес сайта, или создайте новую категорию.' },
          { q: 'Сохраняются ли личные закладки автоматически?', a: 'Все изменения сохраняются автоматически в хранилище браузера, а полную резервную копию можно скачать в разделе Настройки > Общие.' },
        ],
      },
      calendar: {
        title: 'Умный месячный календарь и праздники разных стран',
        overview: 'Планируйте дедлайны, добавляйте личные напоминания и отслеживайте государственные праздники нескольких стран на одном наглядном календаре.',
        highlights: [
          { heading: 'События и напоминания со временем', body: 'Добавляйте события или напоминания с точным временем на любую дату, чтобы встречи, счета и важные планы всегда были перед глазами.' },
          { heading: 'Праздники нескольких регионов сразу', body: 'Подключайте праздничные календари разных стран рядом с личным расписанием для удобной работы с международными командами.' },
        ],
        faqs: [
          { q: 'Как добавить событие или напоминание на конкретный день?', a: 'Нажмите на нужную дату в сетке календаря, выберите «Событие» или «Напоминание», введите название и время и нажмите «Сохранить».' },
          { q: 'Можно ли просматривать праздники сразу нескольких стран?', a: 'Да. В меню выбора стран в верхней части календаря можно одновременно отметить несколько регионов.' },
        ],
      },
      calculator: {
        title: 'Точный калькулятор и живой конвертер валют',
        overview: 'Мгновенно переключайтесь между обычной арифметикой, научными вычислениями и конвертацией валют по актуальному биржевому или ручному курсу.',
        highlights: [
          { heading: 'Стандартный и научный режимы', body: 'Быстрые расчёты, проценты, тригонометрия, степени, логарифмы и история выражений в одном удобном инструменте.' },
          { heading: 'Живой и ручной режим обмена валют', body: 'Сравнивайте основные валюты по свежим рыночным котировкам или переключитесь на ручной курс для счетов и договоров.' },
        ],
        faqs: [
          { q: 'Откуда берутся актуальные курсы валют?', a: 'В живом режиме курсы загружаются из открытых рыночных источников и обновляются по вашему запросу.' },
          { q: 'Когда стоит использовать ручной режим конвертации?', a: 'Ручной режим удобен, когда нужно рассчитать сумму по фиксированному курсу конкретного банка, карты или контракта.' },
        ],
      },
      ip: {
        title: 'Проверка публичного IPv4 / IPv6 и диагностика сети',
        overview: 'За секунды узнайте свои публичные IPv4- и IPv6-адреса, примерную геолокацию провайдера, ASN и параметры защищённости подключения.',
        highlights: [
          { heading: 'Поддержка Dual-Stack IP', body: 'Проверьте, работает ли ваш провайдер только через IPv4 или поддерживает одновременную маршрутизацию IPv4 и IPv6.' },
          { heading: 'Маршрутизация и приватность', body: 'Просматривайте город маршрутизации, часовой пояс, статус шифрования DNS, проверку утечек WebRTC и транспортную безопасность.' },
        ],
        faqs: [
          { q: 'Почему IP-геолокация иногда показывает соседний город?', a: 'Определение местоположения по IP опирается на региональный узел (PoP) вашего провайдера, а не на GPS устройства.' },
          { q: 'Что означает, если IPv6 не обнаружен?', a: 'Ваш роутер, VPN или интернет-провайдер маршрутизирует трафик только по IPv4 — это стандартная ситуация для многих сетей.' },
        ],
      },
      speed: {
        title: 'Тест скорости интернета и качества соединения в реальном времени',
        overview: 'Измерьте реальную скорость загрузки и отдачи, задержку (пинг) и джиттер для оценки качества 4K-стриминга, онлайн-игр и HD-видеосвязи.',
        highlights: [
          { heading: 'Пинг, джиттер и пропускная способность', body: 'Многоэтапная проверка до ближайших узлов измеряет отклик сети и стабильность скорости скачивания и выгрузки.' },
          { heading: 'Оценка качества сети', body: 'Переводит мегабиты в секунду и миллисекунды в понятный рейтинг от 1 до 5 звёзд для стриминга, игр и видеозвонков.' },
        ],
        faqs: [
          { q: 'Как получить максимально точный результат теста скорости?', a: 'Остановите крупные загрузки в фоне, тестируйте ближе к роутеру или по кабелю и при необходимости повторите замер.' },
          { q: 'Почему задержка и джиттер важны не меньше Мбит/с?', a: 'Низкий пинг и минимальный джиттер обеспечивают плавные видеозвонки и быстрый отклик в играх даже при умеренной скорости канала.' },
        ],
      },
    },
  },
  Luxembourgish: {
    faqHeading: 'Heefeg gestallte Froen',
    tools: {
      links: {
        title: 'Är alldeeglech Web-Lieszeechen iwwersiichtlech organiséieren',
        overview: 'GeekTabs Lieszeechen gruppéiert heefeg besichte Websäiten, Office-Apps, KI-Hëllefer, Museksplattforme a perséinlech Linken a kloere visuelle Kategorien.',
        highlights: [
          { heading: 'Eege Kategorien & direkt Upassungen', body: 'Erstellt nei Sammlungen, nennt Kategorien ëm, setzt eege URLen derbäi oder ännert Symboler zu all Moment direkt hei.' },
          { heading: 'Lokal Dateschutz & einfach Backups', body: 'Är Lieszeeche bleiwen lokal am Browser gespäichert a kënnen zu all Moment iwwer d’Astellungen exportéiert oder restauréiert ginn.' },
        ],
        faqs: [
          { q: 'Kann ech meng eege Websäiten derbäisetzen?', a: 'Jo. Benotzt de Knäppchen „Bookmark derbäisetzen“ an all Kategorie fir en Titel an eng URL ze späicheren oder erstellt eng nei Kategorie.' },
          { q: 'Ginn meng Lieszeechen automatesch gespäichert?', a: 'All Ännerunge ginn automatesch am Browser gespäichert; eng komplett Backupdatei kënnt Dir ënner Astellungen > Allgemeng eroflueden.' },
        ],
      },
      calendar: {
        title: 'Smarte Mountkalenner & international Feierdeeg',
        overview: 'Plangt Terminer, setzt perséinlech Erënnerungen a behält gesetzlech Feierdeeg aus méi Länner an enger kloerer Mountsiicht am Bléck.',
        highlights: [
          { heading: 'Evenementer & Erënnerunge mat Auerzäit', body: 'Setzt perséinlech Evenementer oder Erënnerunge mat Zäitangab op all Datum, sou datt Reuniounen a Rechnungen ëmmer siichtbar bleiwen.' },
          { heading: 'Feierdeeg aus méi Länner gläichzäiteg', body: 'Schalt regional Feierdagskalenner niewent Ärem Plang un, fir iwwer Zäitzonen ewech propper ze koordinéieren.' },
        ],
        faqs: [
          { q: 'Wéi setzen ech en Evenement op e bestëmmten Dag?', a: 'Klickt op en Datum am Kalenner, wielt Evenement oder Erënnerung, gitt en Titel an optional eng Zäit an a späichert.' },
          { q: 'Kann ech Feierdeeg fir méi wéi ee Land gesinn?', a: 'Jo. Dir kënnt méi Länner gläichzäiteg iwwer de Länner-Wieler am Kalennerkapp aktivéieren.' },
        ],
      },
      calculator: {
        title: 'Präzisiounsrechner & Live-Wärungsemrechner',
        overview: 'Wiessele ouni Ëmwee tëscht Alldagsrechnungen, wëssenschaftleche Funktiounen an Echtzäit-Wärungsemrechnung mat Live- oder manuelle Fixcoursen.',
        highlights: [
          { heading: 'Standard- & wëssenschaftleche Modus', body: 'Berechent séier Zommen, Prozenter, Trigonometrie, Potenzen, Logarithmen a kuckt d’Historie an engem séieren Tool no.' },
          { heading: 'Live- & manuell Wiesselcoursen', body: 'Vergläicht Wärungspueren mat aktuelle Maartcoursen oder wiesselt op de manuelle Modus fir fest Kontrakt- oder Rechnungscoursen.' },
        ],
        faqs: [
          { q: 'Wouhier kommen d’Live-Wiesselcoursen?', a: 'De Live-Modus hëlt aktuell Referenzcoursen aus ëffentleche Maartquellen a léisst Iech d’Wäerter op Ufro nei lueden.' },
          { q: 'Wéini soll ech de manuelle Modus benotzen?', a: 'De manuelle Modus ass ideal wann Dir mat engem spezifesche Bank-, Kaarten- oder Kontraktwiesselcours rechne wëllt.' },
        ],
      },
      ip: {
        title: 'Ëffentlech IPv4 / IPv6-Offro & Verbindungsdiagnos',
        overview: 'Iwwerpréift a Sekonnen Är aktiv IPv4- an IPv6-Adressen, déi ongeféier ISP-Geolokalisatioun, ASN-Daten a Sécherheetsdiagnosen.',
        highlights: [
          { heading: 'Dual-Stack IP-Erkennung', body: 'Kuckt no op Ären Internetprovider nëmmen iwwer IPv4 routt oder och IPv4 + IPv6 Dual-Stack ënnerstëtzt.' },
          { heading: 'Routing- & Privatsphär-Iwwerbléck', body: 'Prüft Stad/Regioun, Zäitzon, DNS-Verschlësselungsstatus, WebRTC-Leak-Tester an Transportsécherheet.' },
        ],
        faqs: [
          { q: 'Firwat weist d’IP-Lokalisatioun heiansdo eng Nopeschstad?', a: 'D’IP-Offro schätzt d’Positioun unhand vum regionale Routing-Node (PoP) vum Provider a net iwwer GPS.' },
          { q: 'Wat bedeit et wann IPv6 net erkannt gëtt?', a: 'Äre Router, VPN oder Provider leet den Trafic momentan nëmmen iwwer IPv4, wat an ville Netzwierker normal ass.' },
        ],
      },
      speed: {
        title: 'Echtzäit-Breetband-Speedtest & Qualitéits-Benchmark',
        overview: 'Moosst Är tatsächlech Download- an Upload-Vitesse, Latenz a Jitter fir 4K-Streaming, Online-Spiller an HD-Videokonferenzen anzeschätzen.',
        highlights: [
          { heading: 'Latenz, Jitter & Duerchsaz', body: 'Feiert Méiphasen-Tester iwwer Edge-Serveren duerch fir Reaktiounszäit (Ping & Jitter) souwéi stabil Up-/Download-Vitessen ze moossen.' },
          { heading: 'Netzwierkqualitéits-Score', body: 'Wandelt Mbps a Millisekonnen a kloer 1–5 Stären-Bewäertunge fir Streaming, Gaming a Video-Uriff ëm.' },
        ],
        faqs: [
          { q: 'Wéi kréien ech dat geneest Speedtest-Resultat?', a: 'Maacht grouss Hannergrond-Downloads oder Streams zou, test no beim Router oder iwwer Kabel a widderhuelt den Test.' },
          { q: 'Firwat sinn Latenz a Jitter niewent Mbps sou wichteg?', a: 'Niddreg Latenz a wéineg Jitter suerge fir flësseg Videokonferenzen a séier Reaktiounen a Spiller och bei mëttlerer Bandbreet.' },
        ],
      },
    },
  },
  Dutch: {
    faqHeading: 'Veelgestelde vragen',
    tools: {
      links: {
        title: 'Organiseer uw dagelijkse webbladwijzers',
        overview: 'Met GeekTabs Bladwijzers groepeert u veelbezochte websites, kantoorapps, AI-assistenten, muziekdiensten en persoonlijke snelkoppelingen in overzichtelijke visuele categorieën.',
        highlights: [
          { heading: 'Eigen categorieën & direct bewerken', body: 'Maak nieuwe verzamelingen aan, hernoem categorieën, voeg eigen URL’s toe of bewerk pictogrammen zonder uw startscherm te verlaten.' },
          { heading: 'Lokale privacy & eenvoudig back-uppen', body: 'Uw bladwijzers blijven lokaal in uw browser opgeslagen en kunnen op elk moment via Instellingen worden geëxporteerd of hersteld.' },
        ],
        faqs: [
          { q: 'Kan ik mijn eigen websites toevoegen aan Bladwijzers?', a: 'Ja. Gebruik de knop Bladwijzer toevoegen binnen elke categorie om een titel en URL op te slaan of maak een nieuwe categorie.' },
          { q: 'Worden mijn persoonlijke bladwijzers automatisch bewaard?', a: 'Alle wijzigingen worden automatisch lokaal opgeslagen en u kunt een volledige back-up downloaden via Instellingen > Algemeen.' },
        ],
      },
      calendar: {
        title: 'Slimme maandkalender & internationale feestdagen',
        overview: 'Plan aankomende deadlines, stel persoonlijke herinneringen in en volg nationale feestdagen van meerdere landen in één heldere maandweergave.',
        highlights: [
          { heading: 'Afspraken & getimede herinneringen', body: 'Voeg eigen afspraken of herinneringen met tijdstip toe aan elke dag zodat vergaderingen, facturen en mijlpalen zichtbaar blijven.' },
          { heading: 'Meerdere landen tegelijk bekijken', body: 'Toon regionale feestdagen naast uw eigen planning om moeiteloos samen te werken over verschillende tijdzones heen.' },
        ],
        faqs: [
          { q: 'Hoe voeg ik een afspraak of herinnering toe aan een dag?', a: 'Klik op een datum in de kalender, kies Afspraak of Herinnering, vul een titel en optionele tijd in en klik op Opslaan.' },
          { q: 'Kan ik feestdagen voor meer dan één land bekijken?', a: 'Ja. U kunt via de landenkiezer bovenaan de kalender meerdere regio’s tegelijk inschakelen.' },
        ],
      },
      calculator: {
        title: 'Precisierekenmachine & live valutaconverter',
        overview: 'Schakel moeiteloos tussen dagelijks rekenwerk, wetenschappelijke functies en realtime valutaomrekening met actuele koersen of handmatige vaste tarieven.',
        highlights: [
          { heading: 'Standaard- & wetenschappelijke modus', body: 'Bereken snelle totalen, percentages, goniometrie, machten, logaritmen en bekijk uw rekenhistorie in één snelle tool.' },
          { heading: 'Live & handmatige wisselkoersen', body: 'Vergelijk belangrijke valutaparen met bijgewerkte marktkoersen of schakel naar handmatige modus voor vaste factuurkoersen.' },
        ],
        faqs: [
          { q: 'Waar komen de live wisselkoersen vandaan?', a: 'De live modus haalt actuele referentiekoersen op uit openbare marktfeeds en laat u koersen op verzoek verversen.' },
          { q: 'Wanneer gebruik ik de handmatige modus?', a: 'De handmatige modus is ideaal wanneer u bedragen wilt berekenen met een specifieke bank-, kaart- of contractkoers.' },
        ],
      },
      ip: {
        title: 'Openbare IPv4 / IPv6-opzoeking & verbindingsdiagnose',
        overview: 'Bekijk binnen enkele seconden uw actieve openbare IPv4- en IPv6-adressen, geschatte providerlocatie, ASN-gegevens en beveiligingsdiagnoses.',
        highlights: [
          { heading: 'Dual-stack IP-detectie', body: 'Controleer of uw internetprovider alleen via IPv4 routeert of ook dual-stack IPv4 en IPv6 ondersteunt.' },
          { heading: 'Route- & privacy-inzichten', body: 'Bekijk geschatte stad/regio, tijdzone, DNS-versleutelingsstatus, WebRTC-lekcontroles en transportbeveiliging.' },
        ],
        faqs: [
          { q: 'Waarom toont IP-geolocatie soms een nabijgelegen stad?', a: 'IP-detectie schat de locatie op basis van het regionale routingknooppunt (PoP) van uw provider en niet via apparaat-GPS.' },
          { q: 'Wat betekent het als IPv6 niet wordt gedetecteerd?', a: 'Uw huidige router, VPN of provider gebruikt alleen IPv4-routering, wat op veel netwerken gebruikelijk is.' },
        ],
      },
      speed: {
        title: 'Realtime breedbandsnelheid & kwaliteitsbenchmark',
        overview: 'Meet werkelijke downloadsnelheid, uploadbandbreedte, latentie en netwerkjitter om 4K-streaming, online gaming en HD-videogesprekken te beoordelen.',
        highlights: [
          { heading: 'Latentie, jitter & doorvoer', body: 'Voert meerfasentests uit via edge-servers om responstijd (ping & jitter) en stabiele up- en downloadsnelheden te meten.' },
          { heading: 'Netwerkkwaliteitsscore', body: 'Vertaalt ruwe Mbps- en milliseconde-waarden naar duidelijke 1–5 sterrenscores voor Streaming, Gaming en Videobellen.' },
        ],
        faqs: [
          { q: 'Hoe krijg ik het nauwkeurigste snelheidsresultaat?', a: 'Sluit zware downloads of streams op de achtergrond, test dicht bij de router of via ethernet en test nogmaals ter controle.' },
          { q: 'Waarom zijn latentie en jitter net zo belangrijk als Mbps?', a: 'Lage latentie en weinig jitter houden videogesprekken vloeiend en games responsief, zelfs bij gemiddelde bandbreedte.' },
        ],
      },
    },
  },
  Swedish: {
    faqHeading: 'Vanliga frågor',
    tools: {
      links: {
        title: 'Organisera dina dagliga webbokmärken',
        overview: 'GeekTabs Bokmärken hjälper dig att samla ofta besökta webbplatser, kontorspaket, AI-assistenter, musik och personliga genvägar i tydliga visuella kategorier.',
        highlights: [
          { heading: 'Egna kategorier & direktredigering', body: 'Skapa nya samlingar, byt namn på kategorier, lägg till egna webbadresser eller ändra ikoner direkt från startsidan.' },
          { heading: 'Lokal integritet & enkel säkerhetskopiering', body: 'Dina bokmärken sparas lokalt i webbläsaren och kan när som helst exporteras eller återställas från Inställningar.' },
        ],
        faqs: [
          { q: 'Kan jag lägga till egna webbplatser i Bokmärken?', a: 'Ja. Använd knappen Lägg till bokmärke i valfri kategori för att spara titel och URL, eller skapa en ny kategori.' },
          { q: 'Sparas mina personliga bokmärken automatiskt?', a: 'Alla ändringar sparas automatiskt i webbläsarens lagring, och du kan ladda ner en fullständig säkerhetskopia under Inställningar > Allmänt.' },
        ],
      },
      calendar: {
        title: 'Smart månadskalender & internationella helgdagar',
        overview: 'Planera kommande deadlines, lägg in personliga påminnelser och håll koll på helgdagar i flera länder i en tydlig månadsvy.',
        highlights: [
          { heading: 'Händelser & tidsatta påminnelser', body: 'Lägg till egna händelser eller tidssatta påminnelser på valfritt datum så att möten, räkningar och milstolpar syns hela månaden.' },
          { heading: 'Helgdagar för flera länder samtidigt', body: 'Visa regionala helgdagskalendrar sida vid sida med ditt schema för smidig samordning över tidszoner.' },
        ],
        faqs: [
          { q: 'Hur lägger jag till en händelse eller påminnelse?', a: 'Klicka på ett datum i kalendern, välj Händelse eller Påminnelse, ange titel och valfri tid och klicka på Spara.' },
          { q: 'Kan jag se helgdagar för mer än ett land?', a: 'Ja. Du kan aktivera flera länder samtidigt från väljaren i kalenderns sidhuvud.' },
        ],
      },
      calculator: {
        title: 'Precisionskalkylator & valutakonverterare i realtid',
        overview: 'Växla sömlöst mellan vardagsmatematik, vetenskapliga funktioner och valutaomvandling med både livekurser och manuella kurser.',
        highlights: [
          { heading: 'Standard- & vetenskapligt läge', body: 'Hantera snabba summor, procent, trigonometri, potenser, logaritmer och beräkningshistorik i ett enda snabbt verktyg.' },
          { heading: 'Live- & manuell valutaomvandling', body: 'Jämför större valutapar med uppdaterade marknadskurser eller byt till manuellt läge för fasta avtals- eller fakturakurser.' },
        ],
        faqs: [
          { q: 'Varifrån kommer livekurserna?', a: 'Liveläget hämtar aktuella referenskurser från offentliga marknadsflöden och låter dig uppdatera vid behov.' },
          { q: 'När bör jag använda manuellt läge?', a: 'Manuellt läge passar perfekt när du vill räkna med en exakt bank-, kort- eller avtalskurs.' },
        ],
      },
      ip: {
        title: 'Publik IPv4 / IPv6-sökning & anslutningsdiagnostik',
        overview: 'Kontrollera dina aktiva publika IPv4- och IPv6-adresser, ungefärlig operatörsplats, ASN-nummer och anslutningssäkerhet på några sekunder.',
        highlights: [
          { heading: 'Dual-stack IP-detektering', body: 'Se om din internetleverantör endast använder IPv4 eller stöder dual-stack med både IPv4 och IPv6.' },
          { heading: 'Rutt- & integritetsinsikter', body: 'Granska beräknad stad/region, tidszon, DNS-kryptering, WebRTC-läckagetest och transportsäkerhet.' },
        ],
        faqs: [
          { q: 'Varför visar IP-platsen ibland en närliggande stad?', a: 'IP-sökning uppskattar platsen utifrån din leverantörs regionala knutpunkt (PoP) snarare än enhetens GPS.' },
          { q: 'Vad betyder det om IPv6 inte hittas?', a: 'Din router, VPN eller internetleverantör skickar för närvarande endast trafik via IPv4, vilket är vanligt i många nätverk.' },
        ],
      },
      speed: {
        title: 'Bredbandshastighet & nätverkskvalitet i realtid',
        overview: 'Mät verklig nedladdnings- och uppladdningshastighet, latens och jitter för att se hur väl uppkopplingen klarar 4K-streaming, spel och HD-videosamtal.',
        highlights: [
          { heading: 'Latens, jitter & kapacitet', body: 'Kör flerstegstester mot edge-servrar för att mäta svarstid (ping & jitter) samt uthållig ned- och uppladdning.' },
          { heading: 'Betyg för nätverkskvalitet', body: 'Omvandlar Mbps och millisekunder till tydliga 1–5 stjärnor för Streaming, Gaming och Videosamtal.' },
        ],
        faqs: [
          { q: 'Hur får jag ett så exakt hastighetstest som möjligt?', a: 'Stäng tunga bakgrundsnedladdningar eller strömmar, testa nära Wi-Fi-routern eller via Ethernet och kör gärna om testet.' },
          { q: 'Varför är latens och jitter viktiga utöver Mbps?', a: 'Låg latens och lågt jitter håller videosamtal stabila och onlinespel responsiva även vid måttlig bandbredd.' },
        ],
      },
    },
  },
  Finnish: {
    faqHeading: 'Usein kysytyt kysymykset',
    tools: {
      links: {
        title: 'Järjestä päivittäiset verkkokirjanmerkkisi',
        overview: 'GeekTabs-kirjanmerkit kokoaa suosikkisivustosi, toimistosovellukset, tekoälyavustajat, musiikkipalvelut ja omat pikakuvakkeet selkeisiin visuaalisiin kategorioihin.',
        highlights: [
          { heading: 'Omat kategoriat & välitön muokkaus', body: 'Luo uusia kokoelmia, nimeä kategorioita uudelleen, lisää omia verkko-osoitteita tai muokkaa kuvakkeita poistumatta aloitussivulta.' },
          { heading: 'Paikallinen tietosuoja & helpot varmuuskopiot', body: 'Kirjanmerkkisi pysyvät tallessa selaimesi paikallisessa muistissa ja ne voi viedä tai palauttaa milloin tahansa Asetuksista.' },
        ],
        faqs: [
          { q: 'Voinko lisätä omia verkkosivustoja kirjanmerkkeihin?', a: 'Kyllä. Paina Lisää kirjanmerkki missä tahansa kategoriassa tallentaaksesi otsikon ja osoitteen, tai luo uusi kategoria.' },
          { q: 'Tallennetaanko kirjanmerkkini automaattisesti?', a: 'Kaikki muutokset tallentuvat automaattisesti selaimeen, ja voit ladata täyden varmuuskopion kohdasta Asetukset > Yleiset.' },
        ],
      },
      calendar: {
        title: 'Älykäs kuukausikalenteri & usean maan juhlapyhät',
        overview: 'Suunnittele määräajat, aseta henkilökohtaisia muistutuksia ja seuraa useiden maiden pyhäpäiviä yhdessä selkeässä kuukausinäkymässä.',
        highlights: [
          { heading: 'Tapahtumat & ajastetut muistutukset', body: 'Lisää tapahtumia tai kellonajalla varustettuja muistutuksia mille tahansa päivälle, jotta kokoukset ja laskut pysyvät mielessä.' },
          { heading: 'Monen maan juhlapyhänäkymä', body: 'Ota alueelliset pyhäpäiväkalenterit näkyviin oman aikataulusi rinnalle kansainvälisen tiimityön helpottamiseksi.' },
        ],
        faqs: [
          { q: 'Miten lisään tapahtuman tai muistutuksen tietylle päivälle?', a: 'Klikkaa päivää kalenterista, valitse Tapahtuma tai Muistutus, anna otsikko ja valinnainen aika ja paina Tallenna.' },
          { q: 'Voinko nähdä useamman maan pyhäpäivät samanaikaisesti?', a: 'Kyllä. Voit valita useita alueita yhtä aikaa kalenterin yläreunan maavalitsimesta.' },
        ],
      },
      calculator: {
        title: 'Tarkka laskin & reaaliaikainen valuuttamuunnin',
        overview: 'Vaihda sujuvasti peruslaskennan, tieteellisten funktioiden ja valuuttamuunnoksen välillä sekä live-kursseilla että manuaalisella kurssilla.',
        highlights: [
          { heading: 'Perus- & tieteellinen laskintila', body: 'Hoida nopeat yhteenlaskut, prosentit, trigonometria, potenssit, logaritmit ja laskuhistoria yhdessä nopeassa työkalussa.' },
          { heading: 'Live- & manuaalinen valuuttamuunnos', body: 'Vertaile päävaluuttoja ajantasaisilla markkinakursseilla tai vaihda manuaalitilaan kiinteitä sopimus- ja laskukursseja varten.' },
        ],
        faqs: [
          { q: 'Mistä reaaliaikaiset valuuttakurssit tulevat?', a: 'Live-tila hakee ajantasaiset viitekurssit julkisista markkinalähteistä ja antaa päivittää kurssit tarpeen mukaan.' },
          { q: 'Milloin kannattaa käyttää manuaalista tilaa?', a: 'Manuaalinen tila sopii parhaiten silloin, kun lasket summia tietyn pankin, kortin tai sopimuksen kiinteällä kurssilla.' },
        ],
      },
      ip: {
        title: 'Julkinen IPv4 / IPv6 -haku & yhteyden diagnostiikka',
        overview: 'Tarkista sekunneissa aktiiviset julkiset IPv4- ja IPv6-osoitteesi, operaattorin arvioitu sijainti, ASN-tunnus ja yhteyden tietoturvatila.',
        highlights: [
          { heading: 'Dual-stack IP-tunnistus', body: 'Selvitä, reitittääkö operaattorisi liikennettä vain IPv4-verkossa vai tukeeko yhteys myös IPv6-dual-stackia.' },
          { heading: 'Reitti- & tietosuojatiedot', body: 'Näe arvioitu kaupunki/alue, aikavyöhyke, DNS-salauksen tila, WebRTC-vuototesti ja siirtoturva.' },
        ],
        faqs: [
          { q: 'Miksi IP-paikannus näyttää joskus lähikaupungin?', a: 'IP-haku arvioi sijainnin operaattorin alueellisen solmupisteen (PoP) perusteella eikä laitteen GPS-sijainnin mukaan.' },
          { q: 'Mitä tarkoittaa, jos IPv6:tta ei havaita?', a: 'Nykyinen reitittimesi, VPN:si tai operaattorisi käyttää tällä hetkellä vain IPv4-reititystä, mikä on monissa verkoissa normaalia.' },
        ],
      },
      speed: {
        title: 'Reaaliaikainen laajakaistan nopeus- & laatutesti',
        overview: 'Mittaa todellinen lataus- ja lähetysnopeus, viive sekä jitter nähdäksesi, kuinka hyvin yhteys tukee 4K-suoratoistoa, pelaamista ja HD-videopuheluja.',
        highlights: [
          { heading: 'Viive, jitter & siirtonopeus', body: 'Suorittaa monivaiheiset testit reunapalvelimille vasteajan (ping ja jitter) sekä tasaisen lataus- ja lähetysnopeuden mittaamiseksi.' },
          { heading: 'Verkon laatupisteet', body: 'Muuntaa Mbps- ja millisekuntimittaukset selkeiksi 1–5 tähden arvioiksi suoratoistolle, pelaamiselle ja videopuheluille.' },
        ],
        faqs: [
          { q: 'Miten saan mahdollisimman tarkan nopeustuloksen?', a: 'Sulje raskaat taustalataukset ja suoratoistot, testaa lähellä Wi-Fi-reititintä tai Ethernet-kaapelilla ja toista testi tarvittaessa.' },
          { q: 'Miksi viive ja jitter ovat tärkeitä Mbps-nopeuden ohella?', a: 'Pieni viive ja vähäinen jitter pitävät videopuhelut sulavina ja moninpelit herkkäliikkeisinä kohtuullisellakin kaistalla.' },
        ],
      },
    },
  },
  Hindi: {
    faqHeading: 'अक्सर पूछे जाने वाले प्रश्न',
    tools: {
      links: {
        title: 'अपने रोज़मर्रा के वेब बुकमार्क व्यवस्थित करें',
        overview: 'GeekTabs बुकमार्क आपकी अक्सर देखी जाने वाली वेबसाइटों, ऑफिस सूट, AI टूल्स, म्यूज़िक प्लेटफॉर्म और निजी शॉर्टकट को साफ़ श्रेणियों में व्यवस्थित करता है।',
        highlights: [
          { heading: 'कस्टम श्रेणियाँ और तुरंत संपादन', body: 'अपने कार्यक्षेत्र को छोड़े बिना कभी भी नए बुकमार्क संग्रह बनाएँ, श्रेणियों के नाम बदलें, कस्टम URL जोड़ें या आइकन बदलें।' },
          { heading: 'स्थानीय गोपनीयता और आसान बैकअप', body: 'आपके बुकमार्क आपके ब्राउज़र में स्थानीय रूप से सुरक्षित रहते हैं और सेटिंग्स से कभी भी एक्सपोर्ट या रिस्टोर किए जा सकते हैं।' },
        ],
        faqs: [
          { q: 'क्या मैं बुकमार्क में अपनी खुद की वेबसाइट जोड़ सकता हूँ?', a: 'हाँ। किसी भी श्रेणी में “बुकमार्क जोड़ें” बटन से कस्टम वेबसाइट शीर्षक और URL सहेजें या नई श्रेणी बनाएँ।' },
          { q: 'क्या मेरे निजी बुकमार्क अपने-आप सहेजे जाते हैं?', a: 'सभी बदलाव ब्राउज़र स्टोरेज में स्वचालित रूप से सेव होते हैं, और आप सेटिंग्स > सामान्य से पूरा बैकअप डाउनलोड कर सकते हैं।' },
        ],
      },
      calendar: {
        title: 'स्मार्ट मासिक कैलेंडर और बहु-देशीय अवकाश',
        overview: 'एक स्पष्ट मासिक कैलेंडर दृश्य में आगामी समय-सीमाओं की योजना बनाएँ, व्यक्तिगत रिमाइंडर सेट करें और कई देशों की सार्वजनिक छुट्टियों पर नज़र रखें।',
        highlights: [
          { heading: 'इवेंट्स और समय-निर्धारित रिमाइंडर', body: 'किसी भी तारीख़ पर कस्टम इवेंट या समयबद्ध रिमाइंडर जोड़ें ताकि ज़रूरी मीटिंग और भुगतान पूरे महीने दिखते रहें।' },
          { heading: 'बहु-देशीय अवकाश दृश्य', body: 'अंतरराष्ट्रीय टीमों और टाइम ज़ोन के साथ तालमेल के लिए अपने शेड्यूल के साथ क्षेत्रीय अवकाश कैलेंडर चालू करें।' },
        ],
        faqs: [
          { q: 'किसी विशेष दिन पर इवेंट या रिमाइंडर कैसे जोड़ें?', a: 'कैलेंडर पर किसी तारीख़ पर क्लिक करें, इवेंट या रिमाइंडर चुनें, शीर्षक व समय दर्ज करें और सहेजें पर क्लिक करें।' },
          { q: 'क्या मैं एक से अधिक देशों के अवकाश देख सकता हूँ?', a: 'हाँ। आप कैलेंडर हेडर में मौजूद क्षेत्र चयनकर्ता से एक साथ कई देशों की छुट्टियाँ चालू कर सकते हैं।' },
        ],
      },
      calculator: {
        title: 'सटीक कैलकुलेटर और लाइव मुद्रा परिवर्तक',
        overview: 'सामान्य गणित, वैज्ञानिक फ़ंक्शन और लाइव बाज़ार विनिमय दर या मैन्युअल कस्टम दर के साथ रीयल-टाइम मुद्रा रूपांतरण के बीच सहजता से स्विच करें।',
        highlights: [
          { heading: 'मानक और वैज्ञानिक मोड', body: 'एक ही तेज़ टूल में त्वरित जोड़, प्रतिशत, त्रिकोणमिति, घात, लघुगणक और गणना इतिहास का उपयोग करें।' },
          { heading: 'लाइव और मैन्युअल FX रूपांतरण', body: 'अद्यतन बाज़ार दरों से प्रमुख मुद्राओं की तुलना करें या तय इनवॉइस दरों के लिए मैन्युअल मोड चुनें।' },
        ],
        faqs: [
          { q: 'लाइव मुद्रा दरें कहाँ से आती हैं?', a: 'लाइव मोड सार्वजनिक बाज़ार फ़ीड से वर्तमान संदर्भ विनिमय दरें प्राप्त करता है और माँग पर रीफ़्रेश करने देता है।' },
          { q: 'मुद्रा परिवर्तक में मैन्युअल मोड कब उपयोग करें?', a: 'जब आप किसी विशेष बैंक, कार्ड या अनुबंध की तय विनिमय दर से कुल राशि निकालना चाहें तो मैन्युअल मोड आदर्श है।' },
        ],
      },
      ip: {
        title: 'सार्वजनिक IPv4 / IPv6 जाँच और कनेक्शन निदान',
        overview: 'सेकंडों में अपने सक्रिय सार्वजनिक IPv4 और IPv6 पते, अनुमानित ISP स्थान, ASN नेटवर्क पहचान और कनेक्शन सुरक्षा स्थिति देखें।',
        highlights: [
          { heading: 'डुअल-स्टैक IP पहचान', body: 'जाँचें कि आपका इंटरनेट प्रदाता केवल IPv4 पर ट्रैफ़िक भेजता है या डुअल-स्टैक IPv4 और IPv6 का समर्थन करता है।' },
          { heading: 'रूट और गोपनीयता जानकारी', body: 'अनुमानित शहर/क्षेत्र रूटिंग, टाइमज़ोन ऑफ़सेट, DNS एन्क्रिप्शन स्थिति, WebRTC लीक जाँच और ट्रांसपोर्ट सुरक्षा देखें।' },
        ],
        faqs: [
          { q: 'IP स्थान कभी-कभी पास का शहर क्यों दिखाता है?', a: 'IP लुकअप डिवाइस GPS के बजाय आपके ISP के क्षेत्रीय रूटिंग नोड (PoP) के आधार पर स्थान का अनुमान लगाता है।' },
          { q: 'यदि IPv6 नहीं मिला दिखे तो इसका क्या अर्थ है?', a: 'आपका वर्तमान राउटर, VPN या इंटरनेट प्रदाता केवल IPv4 से ट्रैफ़िक रूट कर रहा है, जो कई नेटवर्क पर सामान्य है।' },
        ],
      },
      speed: {
        title: 'रीयल-टाइम ब्रॉडबैंड स्पीड और गुणवत्ता बेंचमार्क',
        overview: '4K स्ट्रीमिंग, ऑनलाइन गेमिंग और HD वीडियो कॉल के लिए अपने नेटवर्क की क्षमता जानने हेतु वास्तविक डाउनलोड, अपलोड, लेटेंसी और जिटर मापें।',
        highlights: [
          { heading: 'लेटेंसी, जिटर और थ्रूपुट', body: 'प्रतिक्रिया समय (पिंग और जिटर) तथा निरंतर डाउनलोड-अपलोड गति जाँचने के लिए एज सर्वरों पर बहु-चरणीय परीक्षण करता है।' },
          { heading: 'नेटवर्क गुणवत्ता स्कोर', body: 'Mbps और मिलीसेकंड माप को स्ट्रीमिंग, गेमिंग और वीडियो कॉल के लिए स्पष्ट 1–5 स्टार रेटिंग में बदलता है।' },
        ],
        faqs: [
          { q: 'सबसे सटीक स्पीड टेस्ट परिणाम कैसे प्राप्त करें?', a: 'बैकग्राउंड में बड़े डाउनलोड या स्ट्रीम बंद करें, Wi-Fi राउटर के पास या ईथरनेट से टेस्ट करें और पुष्टि के लिए दोबारा चलाएँ।' },
          { q: 'Mbps के साथ लेटेंसी और जिटर क्यों मायने रखते हैं?', a: 'कम लेटेंसी और कम जिटर मध्यम बैंडविड्थ होने पर भी वीडियो कॉल को सुचारू और मल्टीप्लेयर गेम्स को तेज़ बनाए रखते हैं।' },
        ],
      },
    },
  },
  Norwegian: {
    faqHeading: 'Ofte stilte spørsmål',
    tools: {
      links: {
        title: 'Organiser dine daglige nettbokmerker',
        overview: 'GeekTabs Bokmerker lar deg samle ofte besøkte nettsteder, kontorpakker, AI-verktøy, musikkplattformer og personlige snarveier i ryddige visuelle kategorier.',
        highlights: [
          { heading: 'Egne kategorier & direkte redigering', body: 'Opprett nye samlinger, gi kategorier nytt navn, legg til egne nettadresser eller endre ikoner uten å forlate startsiden.' },
          { heading: 'Lokal lagring & enkel sikkerhetskopi', body: 'Bokmerkene dine lagres lokalt i nettleseren og kan eksporteres eller gjenopprettes når som helst fra Innstillinger.' },
        ],
        faqs: [
          { q: 'Kan jeg legge til mine egne nettsider i Bokmerker?', a: 'Ja. Bruk knappen Legg til bokmerke i valgfri kategori for å lagre tittel og URL, eller opprett din egen kategori.' },
          { q: 'Blir mine personlige bokmerker lagret automatisk?', a: 'Alle endringer lagres automatisk i nettleseren, og du kan laste ned en komplett sikkerhetskopi under Innstillinger > Generelt.' },
        ],
      },
      calendar: {
        title: 'Smart månedskalender & helligdager for flere land',
        overview: 'Planlegg kommende frister, legg inn personlige påminnelser og følg offentlige helligdager i flere land i én oversiktlig månedsvisning.',
        highlights: [
          { heading: 'Hendelser & tidfestede påminnelser', body: 'Legg til egne hendelser eller påminnelser med klokkeslett på valgfri dato slik at møter, regninger og milepæler alltid er synlige.' },
          { heading: 'Helligdager på tvers av land', body: 'Vis regionale helligdager ved siden av din egen kalender for enklere koordinering med internasjonale team.' },
        ],
        faqs: [
          { q: 'Hvordan legger jeg til en hendelse eller påminnelse?', a: 'Klikk på en dato i kalenderen, velg Hendelse eller Påminnelse, skriv inn tittel og eventuelt tidspunkt, og klikk Lagre.' },
          { q: 'Kan jeg se helligdager for mer enn ett land?', a: 'Ja. Du kan aktivere flere regioner samtidig fra velgeren øverst i kalenderen.' },
        ],
      },
      calculator: {
        title: 'Presisjonskalkulator & sanntids valutakalkulator',
        overview: 'Bytt sømløst mellom hverdagsregning, vitenskapelige funksjoner og valutaomregning i sanntid med enten live-kurser eller manuelle faste kurser.',
        highlights: [
          { heading: 'Standard- & vitenskapelig modus', body: 'Beregn raske summer, prosenter, trigonometri, potenser, logaritmer og historikk i ett raskt verktøy.' },
          { heading: 'Live- & manuell valutaomregning', body: 'Sammenlign hovedvalutaer med oppdaterte markedskurser eller bytt til manuell modus for faste faktura- eller avtalekurser.' },
        ],
        faqs: [
          { q: 'Hvor kommer live-valutakursene fra?', a: 'Live-modus henter oppdaterte referansekurser fra offentlige markedsdata og lar deg oppdatere kursene ved behov.' },
          { q: 'Når bør jeg bruke manuell modus?', a: 'Manuell modus passer best når du vil regne ut beløp med en bestemt bank-, kort- eller kontraktskurs.' },
        ],
      },
      ip: {
        title: 'Offentlig IPv4 / IPv6-oppslag & tilkoblingsdiagnostikk',
        overview: 'Sjekk dine aktive offentlige IPv4- og IPv6-adresser, omtrentlig leverandørplassering, ASN-identifikator og sikkerhetsdiagnostikk på sekunder.',
        highlights: [
          { heading: 'Dual-stack IP-deteksjon', body: 'Kontroller om internettleverandøren din kun ruter trafikk over IPv4 eller støtter dual-stack IPv4 og IPv6.' },
          { heading: 'Rute- & personverninnsikt', body: 'Se omtrentlig by/region, tidssone, DNS-krypteringsstatus, WebRTC-lekkasjetest og transportsikkerhet.' },
        ],
        faqs: [
          { q: 'Hvorfor viser IP-plasseringen av og til en nærliggende by?', a: 'IP-oppslag anslår plasseringen ut fra internettleverandørens regionale knutepunkt (PoP), ikke enhetens GPS.' },
          { q: 'Hva betyr det hvis IPv6 ikke blir funnet?', a: 'Ruteren, VPN-en eller internettleverandøren din ruter for tiden kun over IPv4, noe som er vanlig i mange nettverk.' },
        ],
      },
      speed: {
        title: 'Bredbåndshastighet & kvalitetsmåling i sanntid',
        overview: 'Mål faktisk nedlastings- og opplastingshastighet, forsinkelse og jitter for å vurdere hvor godt nettet støtter 4K-strømming, spill og HD-videosamtaler.',
        highlights: [
          { heading: 'Forsinkelse, jitter & båndbredde', body: 'Kjører flertrinns tester mot edge-servere for å måle responstid (ping & jitter) samt stabil ned- og opplastingshastighet.' },
          { heading: 'Nettverkskvalitetsscore', body: 'Oversetter Mbps og millisekunder til tydelige 1–5 stjerners vurderinger for Strømming, Gaming og Videosamtaler.' },
        ],
        faqs: [
          { q: 'Hvordan får jeg mest mulig nøyaktig testresultat?', a: 'Lukk tunge nedlastinger eller strømming i bakgrunnen, test nær Wi-Fi-ruteren eller med kabel, og kjør gjerne testen på nytt.' },
          { q: 'Hvorfor er forsinkelse og jitter viktig i tillegg til Mbps?', a: 'Lav forsinkelse og lite jitter holder videosamtaler stabile og flerspillerspill responsive selv med moderat båndbredde.' },
        ],
      },
    },
  },
  Thai: {
    faqHeading: 'คำถามที่พบบ่อย',
    tools: {
      links: {
        title: 'จัดระเบียบบุ๊กมาร์กเว็บไซต์ประจำวันของคุณ',
        overview: 'บุ๊กมาร์กของ GeekTabs ช่วยจัดกลุ่มเว็บไซต์ที่ใช้บ่อย ชุดเครื่องมือทำงาน ผู้ช่วย AI แพลตฟอร์มเพลง และทางลัดส่วนตัวเป็นหมวดหมู่ที่ดูสะอาดตาในคลิกเดียว',
        highlights: [
          { heading: 'หมวดหมู่กำหนดเองและแก้ไขได้ทันที', body: 'สร้างคอลเลกชันใหม่ เปลี่ยนชื่อหมวดหมู่ เพิ่ม URL ส่วนตัว หรือแก้ไขไอคอนได้ทุกเมื่อโดยไม่ต้องออกจากหน้าเริ่มต้น' },
          { heading: 'ความเป็นส่วนตัวในเครื่องและสำรองข้อมูลง่าย', body: 'บุ๊กมาร์กของคุณจะถูกจัดเก็บไว้ในเบราว์เซอร์ของคุณเอง และสามารถส่งออกหรือกู้คืนได้ทุกเมื่อจากหน้าการตั้งค่า' },
        ],
        faqs: [
          { q: 'ฉันสามารถเพิ่มเว็บไซต์ส่วนตัวลงในบุ๊กมาร์กได้ไหม?', a: 'ได้ ใช้ปุ่มเพิ่มบุ๊กมาร์กในหมวดหมู่ใดก็ได้เพื่อบันทึกชื่อเว็บและ URL หรือสร้างหมวดหมู่ของคุณเอง' },
          { q: 'บุ๊กมาร์กส่วนตัวจะถูกบันทึกอัตโนมัติหรือไม่?', a: 'การเปลี่ยนแปลงทั้งหมดจะถูกบันทึกในเบราว์เซอร์โดยอัตโนมัติ และคุณสามารถดาวน์โหลดไฟล์สำรองข้อมูลได้จาก การตั้งค่า > ทั่วไป' },
        ],
      },
      calendar: {
        title: 'ปฏิทินรายเดือนอัจฉริยะและวันหยุดหลายประเทศ',
        overview: 'วางแผนกำหนดส่งงาน ตั้งการแจ้งเตือนส่วนตัว และติดตามวันหยุดราชการของหลายประเทศได้ครบในมุมมองปฏิทินรายเดือนเดียว',
        highlights: [
          { heading: 'กิจกรรมและตัวเตือนพร้อมเวลา', body: 'เพิ่มกิจกรรมหรือการแจ้งเตือนแบบระบุเวลาในแต่ละวัน เพื่อไม่ให้พลาดการประชุม บิล หรือวันสำคัญตลอดทั้งเดือน' },
          { heading: 'ดูวันหยุดพร้อมกันหลายประเทศ', body: 'เปิดดูปฏิทินวันหยุดของหลายภูมิภาคควบคู่กับตารางเวลาส่วนตัว เพื่อประสานงานข้ามเขตเวลาได้อย่างราบรื่น' },
        ],
        faqs: [
          { q: 'จะเพิ่มกิจกรรมหรือการแจ้งเตือนในวันที่ต้องการได้อย่างไร?', a: 'คลิกที่วันที่ใดก็ได้บนปฏิทิน เลือกกิจกรรมหรือการแจ้งเตือน กรอกชื่อและเวลา แล้วกดบันทึก' },
          { q: 'สามารถดูวันหยุดพร้อมกันมากกว่าหนึ่งประเทศได้หรือไม่?', a: 'ได้ คุณสามารถเปิดใช้งานหลายภูมิภาคพร้อมกันได้จากตัวเลือกประเทศที่ด้านบนของปฏิทิน' },
        ],
      },
      calculator: {
        title: 'เครื่องคิดเลขความแม่นยำสูงและตัวแปลงสกุลเงินเรียลไทม์',
        overview: 'สลับใช้งานระหว่างการคำนวณทั่วไป ฟังก์ชันทางวิทยาศาสตร์ และการแปลงสกุลเงินแบบเรียลไทม์หรือเรตกำหนดเองได้อย่างลื่นไหล',
        highlights: [
          { heading: 'โหมดมาตรฐานและโหมดวิทยาศาสตร์', body: 'จัดการผลรวม เปอร์เซ็นต์ ตรีโกณมิติ เลขยกกำลัง ลอการิทึม และประวัติการคำนวณได้ครบในเครื่องมือเดียว' },
          { heading: 'แปลงค่าเงินแบบสดและกำหนดเอง', body: 'เปรียบเทียบคู่สกุลเงินหลักด้วยอัตราตลาดล่าสุด หรือสลับเป็นโหมดกำหนดเองสำหรับอัตราแลกเปลี่ยนคงที่' },
        ],
        faqs: [
          { q: 'อัตราแลกเปลี่ยนสดมาจากไหน?', a: 'โหมดสดดึงอัตราอ้างอิงปัจจุบันจากแหล่งข้อมูลตลาดสาธารณะและสามารถกดรีเฟรชได้ตามต้องการ' },
          { q: 'ควรใช้โหมดกำหนดเองเมื่อใด?', a: 'โหมดกำหนดเองเหมาะมากเมื่อคุณต้องการคำนวณยอดตามอัตราคงที่ของธนาคาร บัตร หรือสัญญาเฉพาะ' },
        ],
      },
      ip: {
        title: 'ตรวจสอบ Public IPv4 / IPv6 และการวินิจฉัยการเชื่อมต่อ',
        overview: 'ตรวจสอบที่อยู่ IPv4 และ IPv6 สาธารณะ ตำแหน่งโดยประมาณของผู้ให้บริการ ASN และความปลอยภัยของการเชื่อมต่อได้ในไม่กี่วินาที',
        highlights: [
          { heading: 'ตรวจจับ IP แบบ Dual-Stack', body: 'ตรวจสอบว่าผู้ให้บริการอินเทอร์เน็ตของคุณส่งทราฟฟิกผ่าน IPv4 เท่านั้นหรือรองรับทั้ง IPv4 และ IPv6' },
          { heading: 'ข้อมูลเส้นทางและความเป็นส่วนตัว', body: 'ดูเมืองและภูมิภาคโดยประมาณ เขตเวลา สถานะการเข้ารหัส DNS การตรวจรอยรั่ว WebRTC และความปลอดภัยในการส่งข้อมูล' },
        ],
        faqs: [
          { q: 'ทำไมตำแหน่ง IP จึงแสดงเมืองใกล้เคียงเป็นบางครั้ง?', a: 'การค้นหา IP ประมาณตำแหน่งจากโหนดเครือข่ายหรือ PoP ของผู้ให้บริการอินเทอร์เน็ต ไม่ใช่ GPS ของอุปกรณ์' },
          { q: 'หากแสดงว่าไม่พบ IPv6 หมายความว่าอย่างไร?', a: 'หมายความว่าเราเตอร์ VPN หรือผู้ให้บริการของคุณกำลังใช้งานเฉพาะ IPv4 ซึ่งเป็นเรื่องปกติในหลายเครือข่าย' },
        ],
      },
      speed: {
        title: 'ทดสอบความเร็วอินเทอร์เน็ตและคุณภาพเครือข่ายแบบเรียลไทม์',
        overview: 'วัดความเร็วดาวน์โหลด อัปโหลด ค่าความหน่วง และ Jitter จริง เพื่อประเมินความพร้อมสำหรับสตรีมมิง 4K เกมออนไลน์ และวิดีโอคอลระดับ HD',
        highlights: [
          { heading: 'ความหน่วง Jitter และความเร็วรับส่ง', body: 'รันการทดสอบหลายขั้นตอนกับเซิร์ฟเวอร์ใกล้เคียงเพื่อวัดความเร็วตอบสนองและอัตราการดาวน์โหลด/อัปโหลดต่อเนื่อง' },
          { heading: 'คะแนนคุณภาพเครือข่าย', body: 'แปลงค่า Mbps และมิลลิวินาทีให้เป็นคะแนน 1–5 ดาวที่เข้าใจง่ายสำหรับการสตรีม เล่นเกม และประชุมทางวิดีโอ' },
        ],
        faqs: [
          { q: 'ทำอย่างไรจึงจะได้ผลทดสอบความเร็วที่แม่นยำที่สุด?', a: 'ปิดการดาวน์โหลดขนาดใหญ่หรือสตรีมเบื้องหลัง ทดสอบใกล้เราเตอร์ Wi-Fi หรือผ่านสาย LAN แล้วลองทดสอบซ้ำเพื่อยืนยัน' },
          { q: 'ทำไมค่า Latency และ Jitter จึงสำคัญพอๆ กับ Mbps?', a: 'Latency และ Jitter ที่ต่ำช่วยให้วิดีโอคอลลื่นไหลและเกมออนไลน์ตอบสนองไว แม้แบนด์วิดท์รวมจะอยู่ในระดับปานกลาง' },
        ],
      },
    },
  },
  Portuguese: {
    faqHeading: 'Perguntas frequentes',
    tools: {
      links: {
        title: 'Organize os seus marcadores web do dia a dia',
        overview: 'Os Marcadores GeekTabs ajudam a agrupar sites frequentes, suítes de escritório, assistentes de IA, música e atalhos pessoais em categorias visuais organizadas.',
        highlights: [
          { heading: 'Categorias personalizadas e edição imediata', body: 'Crie novas coleções, renomeie categorias, adicione URLs personalizados ou edite ícones a qualquer momento sem sair do seu espaço.' },
          { heading: 'Privacidade local e cópias de segurança fáceis', body: 'Os seus marcadores ficam guardados localmente no navegador e podem ser exportados ou restaurados a qualquer momento nas Definições.' },
        ],
        faqs: [
          { q: 'Posso adicionar os meus próprios sites aos Marcadores?', a: 'Sim. Utilize o botão Adicionar marcador dentro de qualquer categoria para guardar um título e URL ou crie uma nova categoria.' },
          { q: 'Os meus marcadores pessoais são guardados automaticamente?', a: 'Todas as alterações são guardadas automaticamente no navegador e pode transferir uma cópia completa em Definições > Geral.' },
        ],
      },
      calendar: {
        title: 'Calendário mensal inteligente e feriados multi-país',
        overview: 'Planeie prazos próximos, agende lembretes pessoais e acompanhe feriados públicos de vários países numa vista mensal clara.',
        highlights: [
          { heading: 'Eventos e lembretes com hora marcada', body: 'Adicione eventos personalizados ou lembretes com horário a qualquer data para manter reuniões, faturas e metas visíveis todo o mês.' },
          { heading: 'Vista de feriados de vários países', body: 'Ative calendários de feriados regionais em conjunto com a sua agenda para coordenar facilmente equipas internacionais.' },
        ],
        faqs: [
          { q: 'Como adiciono um evento ou lembrete a um dia específico?', a: 'Clique em qualquer data do calendário, escolha Evento ou Lembrete, introduza o título e hora opcional e clique em Guardar.' },
          { q: 'Posso ver feriados de mais do que um país?', a: 'Sim. Pode ativar várias regiões em simultâneo no seletor de país do cabeçalho do calendário.' },
        ],
      },
      calculator: {
        title: 'Calculadora de precisão e conversor de moedas ao vivo',
        overview: 'Alterne facilmente entre aritmética diária, funções científicas e conversão cambial em tempo real com cotações de mercado ou taxas manuais.',
        highlights: [
          { heading: 'Modos padrão e científico', body: 'Realize somas rápidas, percentagens, trigonometria, potências, logaritmos e consulte o histórico numa ferramenta ágil.' },
          { heading: 'Conversão FX ao vivo e manual', body: 'Compare pares de moedas com taxas de mercado atualizadas ou mude para o Modo Manual para trabalhar com taxas fixas.' },
        ],
        faqs: [
          { q: 'De onde vêm as taxas de câmbio ao vivo?', a: 'O modo ao vivo obtém taxas de referência atuais a partir de fontes públicas de mercado e permite atualizar cotações quando precisar.' },
          { q: 'Quando devo usar o Modo Manual no conversor?', a: 'O Modo Manual é ideal quando pretende calcular valores com a taxa específica de um banco, cartão ou contrato.' },
        ],
      },
      ip: {
        title: 'Consulta pública IPv4 / IPv6 e diagnóstico de ligação',
        overview: 'Consulte em segundos os seus endereços públicos IPv4 e IPv6, geolocalização aproximada do ISP, ASN e diagnósticos de segurança da ligação.',
        highlights: [
          { heading: 'Deteção IP dual-stack', body: 'Verifique se o seu fornecedor de internet encaminha tráfego apenas em IPv4 ou suporta conectividade dual-stack IPv4 e IPv6.' },
          { heading: 'Informações de rota e privacidade', body: 'Analise cidade/região aproximada, fuso horário, estado de encriptação DNS, testes de fuga WebRTC e segurança de transporte.' },
        ],
        faqs: [
          { q: 'Porque é que a geolocalização IP mostra por vezes uma cidade vizinha?', a: 'A pesquisa de IP estima a localização a partir do nó de encaminhamento (PoP) do seu ISP e não pelo GPS do dispositivo.' },
          { q: 'O que significa quando o IPv6 aparece como não detetado?', a: 'O seu router, VPN ou fornecedor está a encaminhar apenas tráfego IPv4, algo normal em muitas redes.' },
        ],
      },
      speed: {
        title: 'Teste de velocidade de banda larga e qualidade em tempo real',
        overview: 'Meça a velocidade real de download, upload, latência e jitter para avaliar como a sua ligação suporta streaming 4K, jogos online e videochamadas HD.',
        highlights: [
          { heading: 'Latência, jitter e débito', body: 'Executa diagnósticos multifase em servidores de proximidade para testar resposta (ping e jitter) e velocidades sustentadas.' },
          { heading: 'Pontuação de qualidade da rede', body: 'Converte Mbps e milissegundos em classificações claras de 1 a 5 estrelas para Streaming, Jogos e Videochamadas.' },
        ],
        faqs: [
          { q: 'Como obter o resultado mais preciso no teste de velocidade?', a: 'Feche transferências pesadas ou streams em segundo plano, teste perto do router Wi-Fi ou por cabo Ethernet e repita para confirmar.' },
          { q: 'Porque importam a latência e o jitter além dos Mbps?', a: 'Latência baixa e jitter reduzido mantêm videochamadas fluidas e jogos reativos mesmo com largura de banda moderada.' },
        ],
      },
    },
  },
  Vietnamese: {
    faqHeading: 'Câu hỏi thường gặp',
    tools: {
      links: {
        title: 'Sắp xếp dấu trang web hằng ngày của bạn',
        overview: 'Dấu trang GeekTabs giúp bạn nhóm các trang web hay dùng, bộ công cụ văn phòng, trợ lý AI, nền tảng âm nhạc và lối tắt cá nhân vào các danh mục trực quan gọn gàng.',
        highlights: [
          { heading: 'Danh mục tùy chỉnh & chỉnh sửa tức thì', body: 'Tạo bộ sưu tập mới, đổi tên danh mục, thêm URL riêng hoặc chỉnh sửa biểu tượng bất cứ lúc nào ngay trên không gian làm việc.' },
          { heading: 'Riêng tư cục bộ & sao lưu dễ dàng', body: 'Dấu trang của bạn được lưu cục bộ ngay trong trình duyệt và có thể xuất hoặc khôi phục bất kỳ lúc nào trong Cài đặt.' },
        ],
        faqs: [
          { q: 'Tôi có thể thêm trang web tùy chỉnh vào Dấu trang không?', a: 'Có. Nhấn nút Thêm dấu trang trong bất kỳ danh mục nào để lưu tiêu đề và URL riêng, hoặc tạo danh mục mới.' },
          { q: 'Dấu trang cá nhân của tôi có được tự động lưu không?', a: 'Mọi thay đổi đều tự động lưu vào bộ nhớ trình duyệt, và bạn có thể tải tệp sao lưu đầy đủ tại Cài đặt > Chung.' },
        ],
      },
      calendar: {
        title: 'Lịch tháng thông minh & ngày lễ nhiều quốc gia',
        overview: 'Lên kế hoạch hạn chót, đặt lời nhắc cá nhân và theo dõi ngày nghỉ lễ của nhiều quốc gia ngay trong một giao diện lịch tháng rõ ràng.',
        highlights: [
          { heading: 'Sự kiện & lời nhắc theo giờ', body: 'Thêm sự kiện hoặc lời nhắc hẹn giờ vào bất kỳ ngày nào để luôn nắm rõ lịch họp, hóa đơn và cột mốc quan trọng.' },
          { heading: 'Xem ngày lễ đa quốc gia', body: 'Bật đồng thời lịch ngày lễ của nhiều khu vực bên cạnh lịch cá nhân để phối hợp thuận tiện giữa các múi giờ.' },
        ],
        faqs: [
          { q: 'Làm thế nào để thêm sự kiện hoặc lời nhắc cho một ngày cụ thể?', a: 'Nhấp vào ngày bất kỳ trên lịch, chọn Sự kiện hoặc Lời nhắc, nhập tiêu đề cùng giờ tùy chọn rồi nhấn Lưu.' },
          { q: 'Tôi có thể xem ngày lễ của nhiều quốc gia cùng lúc không?', a: 'Có. Bạn có thể chọn nhiều quốc gia/khu vực cùng lúc từ bộ chọn ở đầu trang lịch.' },
        ],
      },
      calculator: {
        title: 'Máy tính chính xác & chuyển đổi tiền tệ trực tiếp',
        overview: 'Chuyển đổi mượt mà giữa phép tính hằng ngày, hàm toán học khoa học và quy đổi ngoại tệ thời gian thực theo tỷ giá thị trường hoặc tỷ giá nhập tay.',
        highlights: [
          { heading: 'Chế độ tiêu chuẩn & khoa học', body: 'Thực hiện phép cộng nhanh, phần trăm, lượng giác, lũy thừa, logarit và xem lại lịch sử tính toán trong một công cụ gọn nhẹ.' },
          { heading: 'Quy đổi ngoại tệ trực tiếp & thủ công', body: 'So sánh các cặp tiền tệ chính với tỷ giá cập nhật hoặc chuyển sang Chế độ thủ công cho tỷ giá hợp đồng cố định.' },
        ],
        faqs: [
          { q: 'Tỷ giá trực tiếp được lấy từ đâu?', a: 'Chế độ trực tiếp lấy tỷ giá tham chiếu mới nhất từ nguồn dữ liệu thị trường công khai và cho phép làm mới bất cứ lúc nào.' },
          { q: 'Khi nào nên dùng Chế độ thủ công?', a: 'Chế độ thủ công rất hữu ích khi bạn cần tính toán theo tỷ giá riêng của ngân hàng, thẻ tín dụng hoặc hợp đồng.' },
        ],
      },
      ip: {
        title: 'Tra cứu IPv4 / IPv6 công khai & chẩn đoán kết nối',
        overview: 'Kiểm tra nhanh địa chỉ IPv4 và IPv6 công khai đang hoạt động, vị trí ước tính của nhà mạng ISP, mã ASN và chẩn đoán bảo mật kết nối.',
        highlights: [
          { heading: 'Phát hiện IP Dual-Stack', body: 'Kiểm tra xem nhà mạng của bạn chỉ định tuyến qua IPv4 hay hỗ trợ kết nối song song IPv4 và IPv6.' },
          { heading: 'Thông tin tuyến mạng & quyền riêng tư', body: 'Xem thành phố/khu vực ước tính, múi giờ, trạng thái mã hóa DNS, kiểm tra rò rỉ WebRTC và bảo mật truyền tải.' },
        ],
        faqs: [
          { q: 'Vì sao định vị IP đôi khi hiển thị một thành phố lân cận?', a: 'Tra cứu IP ước tính vị trí dựa trên nút định tuyến (PoP) của nhà mạng chứ không dùng GPS của thiết bị.' },
          { q: 'Nếu hiển thị chưa phát hiện IPv6 thì có sao không?', a: 'Điều đó có nghĩa bộ định tuyến, VPN hoặc nhà mạng hiện chỉ truyền tải qua IPv4 — hoàn toàn bình thường ở nhiều mạng.' },
        ],
      },
      speed: {
        title: 'Đo tốc độ băng thông rộng & chất lượng mạng thời gian thực',
        overview: 'Đo tốc độ tải xuống, tải lên, độ trễ khứ hồi và jitter thực tế để đánh giá khả năng xem phim 4K, chơi game trực tuyến và gọi video HD.',
        highlights: [
          { heading: 'Độ trễ, Jitter & băng thông', body: 'Chạy kiểm tra nhiều pha qua máy chủ biên để đo độ phản hồi (ping & jitter) cũng như tốc độ tải ổn định.' },
          { heading: 'Điểm chất lượng mạng', body: 'Quy đổi số đo Mbps và mili-giây thành xếp hạng 1–5 sao dễ hiểu cho Phát trực tuyến, Chơi game và Gọi video.' },
        ],
        faqs: [
          { q: 'Làm sao để đo tốc độ mạng chính xác nhất?', a: 'Hãy tạm dừng tải tệp lớn hoặc xem video chạy nền, đo gần bộ phát Wi-Fi hoặc qua dây mạng rồi kiểm tra lại để đối chiếu.' },
          { q: 'Vì sao độ trễ và jitter cũng quan trọng bên cạnh Mbps?', a: 'Độ trễ thấp và jitter nhỏ giúp cuộc gọi video mượt mà và game phản hồi nhanh ngay cả khi băng thông ở mức vừa phải.' },
        ],
      },
    },
  },
  Polish: {
    faqHeading: 'Najczęściej zadawane pytania',
    tools: {
      links: {
        title: 'Uporządkuj swoje codzienne zakładki internetowe',
        overview: 'Zakładki GeekTabs pozwalają grupować często odwiedzane strony, pakiety biurowe, narzędzia AI, muzykę i prywatne skróty w przejrzyste kategorie wizualne.',
        highlights: [
          { heading: 'Własne kategorie i szybka edycja', body: 'Twórz nowe kolekcje, zmieniaj nazwy kategorii, dodawaj własne adresy URL i edytuj ikony bez opuszczania strony startowej.' },
          { heading: 'Lokalna prywatność i łatwe kopie zapasowe', body: 'Twoje zakładki są przechowywane lokalnie w przeglądarce i można je w każdej chwili wyeksportować lub przywrócić w Ustawieniach.' },
        ],
        faqs: [
          { q: 'Czy mogę dodać własne strony internetowe do Zakładek?', a: 'Tak. Użyj przycisku Dodaj zakładkę w dowolnej kategorii, aby zapisać tytuł i adres URL, lub utwórz własną kategorię.' },
          { q: 'Czy moje zakładki są zapisywane automatycznie?', a: 'Wszystkie zmiany zapisują się automatycznie w pamięci przeglądarki, a pełną kopię zapasową pobierzesz w Ustawienia > Ogólne.' },
        ],
      },
      calendar: {
        title: 'Inteligentny kalendarz miesięczny i święta wielu krajów',
        overview: 'Planuj nadchodzące terminy, ustawiaj przypomnienia i śledź dni wolne od pracy w wielu krajach w jednym czytelnym widoku miesiąca.',
        highlights: [
          { heading: 'Wydarzenia i przypomnienia z godziną', body: 'Dodawaj własne wydarzenia lub przypomnienia o określonej godzinie, aby spotkania, rachunki i ważne daty były zawsze widoczne.' },
          { heading: 'Święta z wielu krajów jednocześnie', body: 'Włącz kalendarze świąt regionalnych obok własnego harmonogramu, aby sprawnie planować pracę zespołów międzynarodowych.' },
        ],
        faqs: [
          { q: 'Jak dodać wydarzenie lub przypomnienie do konkretnego dnia?', a: 'Kliknij dowolny dzień w kalendarzu, wybierz Wydarzenie lub Przypomnienie, wpisz tytuł oraz opcjonalną godzinę i kliknij Zapisz.' },
          { q: 'Czy mogę wyświetlać święta dla więcej niż jednego kraju?', a: 'Tak. W nagłówku kalendarza możesz jednocześnie zaznaczyć kilka regionów.' },
        ],
      },
      calculator: {
        title: 'Precyzyjny kalkulator i przelicznik walut na żywo',
        overview: 'Przełączaj się płynnie między codziennymi obliczeniami, funkcjami naukowymi oraz przeliczaniem walut z obsługą kursów rynkowych i ręcznych.',
        highlights: [
          { heading: 'Tryb standardowy i naukowy', body: 'Wykonuj szybkie sumy, procenty, trygonometrię, potęgi, logarytmy i przeglądaj historię działań w jednym szybkim narzędziu.' },
          { heading: 'Kursy walut na żywo i ręczne', body: 'Porównuj główne pary walutowe według bieżących notowań lub przełącz na tryb ręczny dla stałych kursów faktur i umów.' },
        ],
        faqs: [
          { q: 'Skąd pochodzą kursy walut na żywo?', a: 'Tryb na żywo pobiera aktualne kursy referencyjne z publicznych źródeł rynkowych i pozwala odświeżać je na żądanie.' },
          { q: 'Kiedy warto wybrać tryb ręczny?', a: 'Tryb ręczny sprawdza się idealnie, gdy chcesz przeliczać kwoty według konkretnego kursu banku, karty lub kontraktu.' },
        ],
      },
      ip: {
        title: 'Sprawdzanie publicznego IPv4 / IPv6 i diagnostyka łącza',
        overview: 'Sprawdź w kilka sekund swoje publiczne adresy IPv4 i IPv6, przybliżoną lokalizację operatora, identyfikator ASN oraz diagnostykę bezpieczeństwa.',
        highlights: [
          { heading: 'Wykrywanie IP Dual-Stack', body: 'Sprawdź, czy Twój dostawca internetu obsługuje wyłącznie ruch IPv4, czy także jednoczesne połączenie IPv4 i IPv6.' },
          { heading: 'Informacje o trasie i prywatności', body: 'Zobacz przybliżone miasto/region, strefę czasową, status szyfrowania DNS, test wycieków WebRTC oraz bezpieczeństwo transportu.' },
        ],
        faqs: [
          { q: 'Dlaczego geolokalizacja IP wskazuje czasem pobliskie miasto?', a: 'Lokalizacja IP jest szacowana na podstawie węzła regionalnego (PoP) dostawcy internetu, a nie nadajnika GPS urządzenia.' },
          { q: 'Co oznacza komunikat o braku wykrycia IPv6?', a: 'Twój router, VPN lub dostawca internetu kieruje ruch wyłącznie przez IPv4, co jest całkowicie normalne w wielu sieciach.' },
        ],
      },
      speed: {
        title: 'Pomiar prędkości internetu i jakości łącza w czasie rzeczywistym',
        overview: 'Zmierz rzeczywistą prędkość pobierania, wysyłania, opóźnienie i jitter, aby ocenić komfort streamingu 4K, gier online oraz rozmów wideo HD.',
        highlights: [
          { heading: 'Opóźnienie, jitter i przepustowość', body: 'Wieloetapowa diagnostyka na serwerach brzegowych bada czas reakcji (ping i jitter) oraz stabilne transfery.' },
          { heading: 'Ocena jakości sieci', body: 'Przekłada surowe wyniki w Mbps i milisekundach na czytelne oceny od 1 do 5 gwiazdek dla Streaming, Gier i Wideorozmów.' },
        ],
        faqs: [
          { q: 'Jak uzyskać najdokładniejszy wynik testu prędkości?', a: 'Zamknij duże pobierania lub transmisje w tle, wykonaj test blisko routera Wi-Fi lub po kablu Ethernet i powtórz pomiar.' },
          { q: 'Dlaczego opóźnienie i jitter są ważne obok Mbps?', a: 'Niski ping i niewielki jitter zapewniają płynne wideorozmowy oraz szybką reakcję w grach nawet przy umiarkowanej przepustowości.' },
        ],
      },
    },
  },
  Danish: {
    faqHeading: 'Ofte stillede spørgsmål',
    tools: {
      links: {
        title: 'Organiser dine daglige webbogmærker',
        overview: 'GeekTabs Bogmærker hjælper dig med at samle ofte besøgte hjemmesider, kontorpakker, AI-værktøjer, musik og personlige genveje i overskuelige visuelle kategorier.',
        highlights: [
          { heading: 'Egne kategorier & hurtig redigering', body: 'Opret nye samlinger, omdøb kategorier, tilføj brugerdefinerede URL’er eller skift ikoner uden at forlade din startside.' },
          { heading: 'Lokal beskyttelse & nem sikkerhedskopi', body: 'Dine bogmærker gemmes lokalt i din browser og kan til enhver tid eksporteres eller gendannes fra Indstillinger.' },
        ],
        faqs: [
          { q: 'Kan jeg tilføje mine egne hjemmesider til Bogmærker?', a: 'Ja. Brug knappen Tilføj bogmærke i enhver kategori for at gemme en titel og URL, eller opret din egen kategori.' },
          { q: 'Gemmes mine personlige bogmærker automatisk?', a: 'Alle ændringer gemmes automatisk lokalt i browseren, og du kan hente en fuld backup under Indstillinger > Generelt.' },
        ],
      },
      calendar: {
        title: 'Smart månedskalender & helligdage for flere lande',
        overview: 'Planlæg kommende deadlines, opret personlige påmindelser og følg helligdage i flere lande i én overskuelig månedsvisning.',
        highlights: [
          { heading: 'Begivenheder & tidsbestemte påmindelser', body: 'Tilføj egne begivenheder eller påmindelser med klokkeslæt på enhver dato, så møder, regninger og mærkedage altid er synlige.' },
          { heading: 'Helligdage på tværs af lande', body: 'Vis regionale helligdage side om side med din egen kalender for nem koordinering på tværs af tidszoner.' },
        ],
        faqs: [
          { q: 'Hvordan tilføjer jeg en begivenhed eller påmindelse?', a: 'Klik på en dato i kalenderen, vælg Begivenhed eller Påmindelse, indtast titel og eventuelt tidspunkt og klik Gem.' },
          { q: 'Kan jeg se helligdage for mere end ét land?', a: 'Ja. Du kan aktivere flere regioner samtidigt fra landevælgeren øverst i kalenderen.' },
        ],
      },
      calculator: {
        title: 'Præcisionslommeregner & live valutaomregner',
        overview: 'Skift gnidningsfrit mellem hverdagsregning, videnskabelige funktioner og valutaomregning i realtid med både markedskurser og manuelle kurser.',
        highlights: [
          { heading: 'Standard- & videnskabelig tilstand', body: 'Beregn hurtige summer, procenter, trigonometri, potenser, logaritmer og regnehistorik i ét hurtigt værktøj.' },
          { heading: 'Live & manuel valutaomregning', body: 'Sammenlign store valutapar med opdaterede markedskurser eller skift til manuel tilstand for faste faktura- eller aftalekurser.' },
        ],
        faqs: [
          { q: 'Hvor kommer live valutakurserne fra?', a: 'Live-tilstand henter aktuelle referencekurser fra offentlige markedsfeeds og lader dig opdatere efter behov.' },
          { q: 'Hvornår bør jeg bruge manuel tilstand?', a: 'Manuel tilstand er ideel, når du vil beregne beløb med en bestemt bank-, kort- eller kontraktsats.' },
        ],
      },
      ip: {
        title: 'Offentlig IPv4 / IPv6-opslag & forbindelsesdiagnostik',
        overview: 'Se dine aktive offentlige IPv4- og IPv6-adresser, omtrentlig udbyderplacering, ASN-netværks-ID og sikkerhedsdiagnostik på få sekunder.',
        highlights: [
          { heading: 'Dual-stack IP-detektion', body: 'Tjek om din internetudbyder kun ruter trafik over IPv4 eller understøtter dual-stack IPv4 og IPv6.' },
          { heading: 'Rute- & privatlivsindsigt', body: 'Se anslået by/region, tidszone, DNS-krypteringsstatus, WebRTC-lækagetjek og transportsikkerhed.' },
        ],
        faqs: [
          { q: 'Hvorfor viser IP-placeringen sommetider en nærliggende by?', a: 'IP-opslag anslår placering ud fra din udbyders regionale knudepunkt (PoP) frem for enhedens GPS.' },
          { q: 'Hvad betyder det, hvis IPv6 vises som ikke fundet?', a: 'Din router, VPN eller internetudbyder ruter i øjeblikket kun via IPv4, hvilket er helt normalt på mange netværk.' },
        ],
      },
      speed: {
        title: 'Bredbåndshastighed & kvalitetsmåling i realtid',
        overview: 'Mål reel download- og uploadhastighed, latenstid og jitter for at vurdere, hvor godt forbindelsen klarer 4K-streaming, gaming og HD-videoopkald.',
        highlights: [
          { heading: 'Latenstid, jitter & gennemstrømning', body: 'Kører flertrinstests mod edge-servere for at måle svartid (ping & jitter) samt vedvarende download- og uploadhastighed.' },
          { heading: 'Netværkskvalitetsscore', body: 'Omsætter Mbps og millisekunder til tydelige 1–5 stjerners vurderinger til Streaming, Gaming og Videoopkald.' },
        ],
        faqs: [
          { q: 'Hvordan får jeg det mest præcise hastighedsresultat?', a: 'Luk tunge downloads eller streams i baggrunden, test tæt på Wi-Fi-routeren eller via kabel og gentag målingen.' },
          { q: 'Hvorfor er latenstid og jitter vigtige ud over Mbps?', a: 'Lav latenstid og lav jitter holder videoopkald flydende og spil hurtigt reagerende selv med moderat båndbredde.' },
        ],
      },
    },
  },
  Turkish: {
    faqHeading: 'Sıkça Sorulan Sorular',
    tools: {
      links: {
        title: 'Günlük Web Yer İmlerinizi Düzenleyin',
        overview: 'GeekTabs Yer İmleri sık ziyaret ettiğiniz siteleri, ofis paketlerini, yapay zekâ araçlarını, müzik platformlarını ve kişisel kısayollarınızı düzenli görsel kategorilerde toplar.',
        highlights: [
          { heading: 'Özel Kategoriler ve Anında Düzenleme', body: 'Başlangıç alanınızdan ayrılmadan yeni yer imi koleksiyonları oluşturun, kategorileri yeniden adlandırın, özel bağlantılar veya simgeler ekleyin.' },
          { heading: 'Yerel Gizlilik ve Kolay Yedekleme', body: 'Yer imleriniz tarayıcınızda yerel olarak saklanır ve Ayarlar üzerinden istediğiniz zaman dışa aktarılabilir veya geri yüklenebilir.' },
        ],
        faqs: [
          { q: 'Yer İmlerine kendi özel web sitelerimi ekleyebilir miyim?', a: 'Evet. Herhangi bir kategori içinde Yer İmi Ekle düğmesini kullanarak özel başlık ve URL kaydedebilir veya yeni kategori oluşturabilirsiniz.' },
          { q: 'Kişisel yer imlerim otomatik kaydediliyor mu?', a: 'Tüm değişiklikler tarayıcı depolama alanınıza otomatik kaydedilir; Ayarlar > Genel bölümünden tam yedek dosyası indirebilirsiniz.' },
        ],
      },
      calendar: {
        title: 'Akıllı Aylık Takvim ve Çoklu Ülke Tatilleri',
        overview: 'Yaklaşan teslim tarihlerini planlayın, kişisel hatırlatmalar oluşturun ve birden fazla ülkenin resmi tatillerini tek bir net aylık takvimde takip edin.',
        highlights: [
          { heading: 'Etkinlikler ve Saatli Hatırlatmalar', body: 'Toplantıların, faturaların ve özel günlerin ay boyunca görünür kalması için herhangi bir güne etkinlik veya saatli hatırlatma ekleyin.' },
          { heading: 'Çoklu Ülke Tatil Görünümü', body: 'Uluslararası ekipler ve farklı saat dilimleriyle uyumlu çalışmak için bölgesel tatil takvimlerini kendi programınızla birlikte açın.' },
        ],
        faqs: [
          { q: 'Belirli bir güne nasıl etkinlik veya hatırlatma eklerim?', a: 'Takvimdeki herhangi bir tarihe tıklayın, Etkinlik veya Hatırlatma seçin, başlık ve isteğe bağlı saati girip Kaydet’e basın.' },
          { q: 'Birden fazla ülkenin tatillerini görüntüleyebilir miyim?', a: 'Evet. Takvim başlığındaki tatil seçicisinden aynı anda birden çok ülkeyi etkinleştirebilirsiniz.' },
        ],
      },
      calculator: {
        title: 'Hassas Hesap Makinesi ve Canlı Döviz Çevirici',
        overview: 'Günlük aritmetik işlemler, bilimsel matematik fonksiyonları ve hem canlı piyasa hem de manuel sabit kurları destekleyen döviz çevirici arasında zahmetsizce geçiş yapın.',
        highlights: [
          { heading: 'Standart ve Bilimsel Modlar', body: 'Tek bir hızlı araç içinde toplamlar, yüzdeler, trigonometri, üsler, logaritmalar ve işlem geçmişini kolayca yönetin.' },
          { heading: 'Canlı ve Manuel Kur Çevirme', body: 'Başlıca döviz çiftlerini güncel piyasa kurlarıyla karşılaştırın veya sabit fatura kurları için Manuel Moda geçin.' },
        ],
        faqs: [
          { q: 'Canlı döviz kurları nereden alınıyor?', a: 'Canlı Mod güncel döviz referans kurlarını kamuya açık piyasa kaynaklarından alır ve istediğiniz anda yenilemenize olanak tanır.' },
          { q: 'Döviz çeviricide Manuel Modu ne zaman kullanmalıyım?', a: 'Belirli bir banka, kart veya sözleşme kuruyla hesaplama yapmak istediğinizde Manuel Mod en ideal seçenektir.' },
        ],
      },
      ip: {
        title: 'Genel IPv4 / IPv6 Sorgulama ve Bağlantı Tanılama',
        overview: 'Etkin genel IPv4 ve IPv6 adreslerinizi, yaklaşık İSS konumunuzu, ASN ağ kimliğinizi ve bağlantı güvenlik testlerini saniyeler içinde inceleyin.',
        highlights: [
          { heading: 'Çift Yığınlı (Dual-Stack) IP Algılama', body: 'İnternet sağlayıcınızın trafiği yalnızca IPv4 üzerinden mi yoksa hem IPv4 hem IPv6 çift yığınlı olarak mı yönlendirdiğini kontrol edin.' },
          { heading: 'Rota ve Gizlilik Bilgileri', body: 'Tahmini şehir/bölge yönlendirmesini, saat dilimi farkını, DNS şifreleme durumunu, WebRTC sızıntı testini ve aktarım güvenliğini inceleyin.' },
        ],
        faqs: [
          { q: 'IP konumu neden bazen yakındaki bir şehri gösterir?', a: 'IP sorgulama konumu cihaz GPS’i yerine İSS’nizin bölgesel yönlendirme düğümüne (PoP) göre tahmin eder.' },
          { q: 'IPv6 algılanmadı görünmesi ne anlama gelir?', a: 'Mevcut yönlendiriciniz, VPN’iniz veya internet sağlayıcınız trafiği yalnızca IPv4 üzerinden iletiyor demektir; birçok ağda normaldir.' },
        ],
      },
      speed: {
        title: 'Gerçek Zamanlı Genişbant Hız ve Kalite Testi',
        overview: 'Bağlantınızın 4K yayın, çevrimiçi oyun ve HD görüntülü aramaları ne kadar iyi desteklediğini görmek için gerçek indirme, yükleme, gecikme ve jitter değerlerini ölçün.',
        highlights: [
          { heading: 'Gecikme, Jitter ve Aktarım Hızı', body: 'Tepki süresini (ping ve jitter) ile kesintisiz indirme ve yükleme hızlarını ölçmek için uç sunucularda çok aşamalı testler çalıştırır.' },
          { heading: 'Ağ Kalite Puanı', body: 'Ham Mbps ve milisaniye ölçümlerini Yayın, Oyun ve Görüntülü Arama için net 1–5 yıldız puanlarına dönüştürür.' },
        ],
        faqs: [
          { q: 'En doğru hız testi sonucunu nasıl alabilirim?', a: 'Arka plandaki büyük indirmeleri veya yayınları kapatın, Wi-Fi yönlendiricisine yakın veya Ethernet kablosuyla test edip doğrulamak için tekrarlayın.' },
          { q: 'Mbps yanında gecikme ve jitter neden önemlidir?', a: 'Düşük gecikme ve düşük jitter, toplam bant genişliği orta düzeyde olsa bile görüntülü görüşmeleri akıcı ve oyunları tepkisel tutar.' },
        ],
      },
    },
  },
  Greek: {
    faqHeading: 'Συχνές ερωτήσεις',
    tools: {
      links: {
        title: 'Οργανώστε τους καθημερινούς σελιδοδείκτες σας',
        overview: 'Οι Σελιδοδείκτες GeekTabs ομαδοποιούν αγαπημένους ιστότοπους, εφαρμογές γραφείου, βοηθούς AI, μουσική και προσωπικές συντομεύσεις σε καθαρές οπτικές κατηγορίες.',
        highlights: [
          { heading: 'Προσαρμοσμένες κατηγορίες & άμεση επεξεργασία', body: 'Δημιουργήστε νέες συλλογές, μετονομάστε κατηγορίες, προσθέστε δικά σας URL ή αλλάξτε εικονίδια χωρίς να φύγετε από την αρχική σελίδα.' },
          { heading: 'Τοπικό απόρρητο & εύκολα αντίγραφα ασφαλείας', body: 'Οι σελιδοδείκτες αποθηκεύονται τοπικά στον περιηγητή σας και μπορούν να εξαχθούν ή να επαναφερθούν από τις Ρυθμίσεις.' },
        ],
        faqs: [
          { q: 'Μπορώ να προσθέσω τους δικούς μου ιστότοπους;', a: 'Ναι. Πατήστε Προσθήκη σελιδοδείκτη μέσα σε οποιαδήποτε κατηγορία για να αποθηκεύσετε τίτλο και URL ή δημιουργήστε νέα κατηγορία.' },
          { q: 'Αποθηκεύονται αυτόματα οι προσωπικοί σελιδοδείκτες;', a: 'Όλες οι αλλαγές αποθηκεύονται αυτόματα στον περιηγητή και μπορείτε να κατεβάσετε πλήρες αντίγραφο από Ρυθμίσεις > Γενικά.' },
        ],
      },
      calendar: {
        title: 'Έξυπνο μηνιαίο ημερολόγιο & αργίες πολλών χωρών',
        overview: 'Οργανώστε προθεσμίες, προγραμματίστε προσωπικές υπενθυμίσεις και παρακολουθήστε επίσημες αργίες πολλών χωρών σε μία καθαρή μηνιαία προβολή.',
        highlights: [
          { heading: 'Συμβάντα & υπενθυμίσεις με ώρα', body: 'Προσθέστε συμβάντα ή χρονικές υπενθυμίσεις σε οποιαδήποτε ημερομηνία ώστε συναντήσεις και υποχρεώσεις να μένουν πάντα ορατές.' },
          { heading: 'Προβολή αργιών πολλών χωρών', body: 'Ενεργοποιήστε περιφερειακά ημερολόγια αργιών παράλληλα με το πρόγραμμά σας για εύκολο συντονισμό μεταξύ ζωνών ώρας.' },
        ],
        faqs: [
          { q: 'Πώς προσθέτω συμβάν ή υπενθύμιση σε μια ημέρα;', a: 'Κάντε κλικ σε οποιαδήποτε ημερομηνία στο ημερολόγιο, επιλέξτε Συμβάν ή Υπενθύμιση, συμπληρώστε τίτλο και ώρα και πατήστε Αποθήκευση.' },
          { q: 'Μπορώ να βλέπω αργίες για περισσότερες από μία χώρες;', a: 'Ναι. Μπορείτε να ενεργοποιήσετε πολλές περιοχές ταυτόχρονα από τον επιλογέα χώρας στην κεφαλίδα του ημερολογίου.' },
        ],
      },
      calculator: {
        title: 'Αριθμομηχανή ακριβείας & μετατροπέας συναλλάγματος',
        overview: 'Εναλλαγή χωρίς κόπο ανάμεσα σε καθημερινές πράξεις, επιστημονικές συναρτήσεις και ζωντανή μετατροπή νομισμάτων με τιμές αγοράς ή χειροκίνητες ισοτιμίες.',
        highlights: [
          { heading: 'Τυπική & επιστημονική λειτουργία', body: 'Υπολογίστε γρήγορα σύνολα, ποσοστά, τριγωνομετρία, δυνάμεις, λογαρίθμους και ιστορικό πράξεων σε ένα γρήγορο εργαλείο.' },
          { heading: 'Ζωντανή & χειροκίνητη μετατροπή FX', body: 'Συγκρίνετε κύρια νομίσματα με ενημερωμένες ισοτιμίες αγοράς ή περάστε σε χειροκίνητη λειτουργία για σταθερές ισοτιμίες τιμολογίων.' },
        ],
        faqs: [
          { q: 'Από πού προέρχονται οι ζωντανές ισοτιμίες;', a: 'Η ζωντανή λειτουργία ανακτά τρέχουσες τιμές αναφοράς από δημόσιες πηγές αγοράς και επιτρέπει άμεση ανανέωση.' },
          { q: 'Πότε να χρησιμοποιώ τη χειροκίνητη λειτουργία;', a: 'Η χειροκίνητη λειτουργία είναι ιδανική όταν θέλετε να υπολογίσετε ποσά με τη σταθερή ισοτιμία τράπεζας, κάρτας ή σύμβασης.' },
        ],
      },
      ip: {
        title: 'Αναζήτηση δημόσιας IPv4 / IPv6 & διαγνωστικά σύνδεσης',
        overview: 'Ελέγξτε μέσα σε δευτερόλεπτα τις ενεργές δημόσιες διευθύνσεις IPv4 και IPv6, την εκτιμώμενη τοποθεσία παρόχου, το ASN και την ασφάλεια σύνδεσης.',
        highlights: [
          { heading: 'Ανίχνευση IP διπλής στοίβας', body: 'Ελέγξτε αν ο πάροχος διαδικτύου σας δρομολογεί μόνο μέσω IPv4 ή υποστηρίζει διπλή στοίβα IPv4 και IPv6.' },
          { heading: 'Πληροφορίες διαδρομής & απορρήτου', body: 'Δείτε εκτιμώμενη πόλη/περιοχή, ζώνη ώρας, κατάσταση κρυπτογράφησης DNS, έλεγχο διαρροής WebRTC και ασφάλεια μεταφοράς.' },
        ],
        faqs: [
          { q: 'Γιατί η γεωτοποθεσία IP δείχνει μερικές φορές κοντινή πόλη;', a: 'Η αναζήτηση IP εκτιμά τη θέση από τον περιφερειακό κόμβο δρομολόγησης (PoP) του παρόχου και όχι από το GPS της συσκευής.' },
          { q: 'Τι σημαίνει αν δεν εντοπίζεται IPv6;', a: 'Ο δρομολογητής, το VPN ή ο πάροχός σας χρησιμοποιεί προς το παρόν μόνο δρομολόγηση IPv4, κάτι συνηθισμένο σε πολλά δίκτυα.' },
        ],
      },
      speed: {
        title: 'Μέτρηση ταχύτητας ευρυζωνικής σύνδεσης & ποιότητας σε πραγματικό χρόνο',
        overview: 'Μετρήστε πραγματική ταχύτητα λήψης, αποστολής, καθυστέρηση και jitter για να αξιολογήσετε την απόδοση σε 4K streaming, online gaming και κλήσεις HD.',
        highlights: [
          { heading: 'Καθυστέρηση, jitter & εύρος ζώνης', body: 'Εκτελεί πολυφασικές δοκιμές σε edge διακομιστές για απόκριση (ping & jitter) και σταθερές ταχύτητες λήψης και αποστολής.' },
          { heading: 'Βαθμολογία ποιότητας δικτύου', body: 'Μετατρέπει τα Mbps και ms σε καθαρές αξιολογήσεις 1–5 αστέρων για Streaming, Gaming και Βιντεοκλήσεις.' },
        ],
        faqs: [
          { q: 'Πώς θα πάρω το πιο ακριβές αποτέλεσμα ταχύτητας;', a: 'Κλείστε βαριές λήψεις ή streaming στο παρασκήνιο, δοκιμάστε κοντά στο router Wi-Fi ή με καλώδιο Ethernet και επαναλάβετε τη μέτρηση.' },
          { q: 'Γιατί έχουν σημασία η καθυστέρηση και το jitter εκτός από τα Mbps;', a: 'Χαμηλή καθυστέρηση και μικρό jitter κρατούν τις βιντεοκλήσεις ομαλές και τα παιχνίδια άμεσα ακόμη και με μέτριο εύρος ζώνης.' },
        ],
      },
    },
  },
  Belgum: {
    faqHeading: 'Veelgestelde vragen',
    tools: {
      links: {
        title: 'Organiseer uw dagelijkse bladwijzers',
        overview: 'GeekTabs Bladwijzers bundelt favoriete websites, kantoortools, AI-assistenten, muziekdiensten en persoonlijke snelkoppelingen in overzichtelijke visuele categorieën.',
        highlights: [
          { heading: 'Eigen categorieën & directe bewerking', body: 'Maak nieuwe verzamelingen aan, hernoem rubrieken, voeg eigen URL’s toe of wijzig pictogrammen zonder de startpagina te verlaten.' },
          { heading: 'Lokale privacy & eenvoudige back-up', body: 'Uw bladwijzers blijven lokaal bewaard in uw browser en kunnen op elk moment via Instellingen worden geëxporteerd of hersteld.' },
        ],
        faqs: [
          { q: 'Kan ik mijn eigen websites toevoegen?', a: 'Ja. Klik binnen eender welke categorie op Bladwijzer toevoegen om een titel en URL op te slaan, of maak eerst een nieuwe rubriek.' },
          { q: 'Worden persoonlijke bladwijzers automatisch bewaard?', a: 'Elke wijziging wordt meteen lokaal opgeslagen in uw browser en u kunt via Instellingen > Algemeen altijd een volledige back-up downloaden.' },
        ],
      },
      calendar: {
        title: 'Slimme maandkalender & feestdagen wereldwijd',
        overview: 'Volg deadlines op, plan persoonlijke herinneringen en raadpleeg officiële feestdagen van meerdere landen in één helder maandoverzicht.',
        highlights: [
          { heading: 'Afspraken & getimede herinneringen', body: 'Voeg op elke datum afspraken of herinneringen met tijdstip toe zodat vergaderingen en verjaardagen altijd zichtbaar blijven.' },
          { heading: 'Feestdagen van meerdere regio’s', body: 'Toon verschillende landenkalenders naast uw eigen planning voor vlotte internationale afstemming.' },
        ],
        faqs: [
          { q: 'Hoe voeg ik een afspraak of herinnering toe?', a: 'Klik op een dag in het kalenderrooster, kies Afspraak of Herinnering, vul de titel en het tijdstip in en klik op Opslaan.' },
          { q: 'Kan ik feestdagen van meerdere landen tegelijk bekijken?', a: 'Ja. Via de landenselector bovenaan de kalender kunt u meerdere landen tegelijk inschakelen.' },
        ],
      },
      calculator: {
        title: 'Precisierekenmachine & wisselkoersomzetter',
        overview: 'Schakel moeiteloos tussen dagelijkse berekeningen, wetenschappelijke functies en live muntomrekening met actuele koersen of een eigen vast tarief.',
        highlights: [
          { heading: 'Standaard & wetenschappelijke modus', body: 'Bereken snel totalen, btw, fooien, goniometrie, machten en logaritmen met directe geschiedenis.' },
          { heading: 'Live & handmatige valuta-omrekening', body: 'Vergelijk belangrijke munten met actuele marktkoersen of schakel naar handmatig voor een vaste bank- of factuurkoers.' },
        ],
        faqs: [
          { q: 'Waar komen de live wisselkoersen vandaan?', a: 'De live modus haalt actuele referentiekoersen op uit publieke financiële bronnen en laat u meteen vernieuwen.' },
          { q: 'Wanneer gebruik ik de handmatige modus?', a: 'Handig wanneer u bedragen wilt omrekenen tegen de vaste koers van uw bank, betaalkaart of contract.' },
        ],
      },
      ip: {
        title: 'Publieke IPv4 / IPv6-opzoeking & verbindingsdiagnose',
        overview: 'Inspecteer in enkele seconden uw actieve publieke IPv4- en IPv6-adres, geschatte providerlocatie, ASN en beveiligingscontroles.',
        highlights: [
          { heading: 'Dual-Stack IP-detectie', body: 'Controleer meteen of uw internetprovider enkel IPv4 routeert of zowel IPv4 als IPv6 ondersteunt.' },
          { heading: 'Routering & privacycontroles', body: 'Bekijk uw geschatte stad of regio, tijdzone, DNS-versleuteling, WebRTC-lekcontrole en HTTPS-transportstatus.' },
        ],
        faqs: [
          { q: 'Waarom toont IP-geolocatie soms een nabijgelegen stad?', a: 'Een IP-opzoeking bepaalt de regio via het dichtstbijzijnde knooppunt (PoP) van uw provider en niet via gps.' },
          { q: 'Wat betekent het als er geen IPv6 wordt gevonden?', a: 'Uw router, VPN of provider gebruikt momenteel alleen IPv4-routering, wat op veel netwerken heel gebruikelijk is.' },
        ],
      },
      speed: {
        title: 'Realtime breedbandsnelheidstest & kwaliteitsscore',
        overview: 'Meet uw werkelijke downloadsnelheid, uploadsnelheid, ping en jitter om meteen te zien hoe geschikt uw lijn is voor 4K-streaming, gaming en videogesprekken.',
        highlights: [
          { heading: 'Latentie, jitter & bandbreedte', body: 'Voert meerdere metingen uit naar edge-servers om reactiesnelheid en duurzame doorvoer betrouwbaar te bepalen.' },
          { heading: 'Netwerkkwaliteitsscore', body: 'Vertaalt Mbps en milliseconden naar duidelijke scores van 1 tot 5 sterren voor Streaming, Gaming en Videovergaderen.' },
        ],
        faqs: [
          { q: 'Hoe krijg ik het nauwkeurigste snelheidsresultaat?', a: 'Sluit zware downloads of streams op de achtergrond, test dicht bij de router of met een netwerkkabel en probeer eventueel opnieuw.' },
          { q: 'Waarom zijn ping en jitter naast Mbps zo belangrijk?', a: 'Een lage ping en stabiele jitter zorgen voor vloeiende videogesprekken en snelle responstijden in online spellen.' },
        ],
      },
    },
  },
};

export default function ToolGuideSection({
  tool,
  language = 'English',
}: {
  tool: GuideToolKey;
  language?: string;
}) {
  const bundle = GUIDE_TRANSLATIONS[language] || GUIDE_TRANSLATIONS.English;
  const guide = bundle.tools[tool];
  const HeadingTag = tool === 'ip' || tool === 'speed' ? 'h2' : 'h1';
  const SubHeadingTag = HeadingTag === 'h1' ? 'h2' : 'h3';
  const FaqItemTag = HeadingTag === 'h1' ? 'h3' : 'h4';

  return (
    <section
      aria-label={guide.title}
      className="w-full mt-12 sm:mt-16 GeekTabs-card rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
    >
      <div className="space-y-2 border-b border-black/10 dark:border-white/10 pb-5">
        <HeadingTag className="text-lg sm:text-xl font-black tracking-tight word-color">
          {guide.title}
        </HeadingTag>
        <p className="text-xs sm:text-sm leading-relaxed word-color opacity-80">
          {guide.overview}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guide.highlights.map((item) => (
          <div
            key={item.heading}
            className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-1.5"
          >
            <SubHeadingTag className="text-sm font-bold word-color">{item.heading}</SubHeadingTag>
            <p className="text-xs sm:text-sm word-color opacity-75 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-1">
        <SubHeadingTag className="text-xs font-bold uppercase tracking-widest word-color opacity-65">
          {bundle.faqHeading}
        </SubHeadingTag>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guide.faqs.map((faq) => (
            <div key={faq.q} className="space-y-1">
              <FaqItemTag className="text-xs sm:text-sm font-bold word-color">{faq.q}</FaqItemTag>
              <p className="text-xs sm:text-sm word-color opacity-75 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
