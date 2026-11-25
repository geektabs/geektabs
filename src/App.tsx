/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Wallpaper, { WALLPAPERS, SOLIDS_MAP, GRADIENTS_MAP } from './components/Wallpaper/Wallpaper';
import Clock from './components/Clock/Clock';
import SearchBar from './components/Search/SearchBar';
import HumorWidget from './components/Widgets/HumorWidget';
import QuoteWidget from './components/Widgets/QuoteWidget';
import WeatherWidget from './components/Widgets/WeatherWidget';
import TipsWidget from './components/Widgets/TipsWidget';
import ReminderWidget from './components/Widgets/ReminderWidget';
import HoroscopeInfo from './components/Widgets/HoroscopeInfo';
import Dock from './components/Navigation/Dock';
import { OfflineIndicator } from './components/PWAInstallButton';
import { useLocalStorage } from './hooks/useLocalStorage';
import Calendar from './components/Tabs/Calendar';
import QuickLinks from './components/Tabs/QuickLinks';
import TodoListTab from './components/Tabs/TodoListTab';
import CalculatorTab from './components/Tabs/CalculatorTab';
import NotesTab from './components/Tabs/NotesTab';
import SettingsTab from './components/Tabs/SettingsTab';
import IpAddressTab from './components/Tabs/IpAddressTab';
import SpeedTestTab from './components/Tabs/SpeedTestTab';
import LegalInfoPages from './components/Tabs/LegalInfoPages';
import ToolGuideSection from './components/Tabs/ToolGuideSection';
import { t } from './i18n';
import { isGifWallpaperUrl } from './services/wallpaperStorage';

const DEFAULT_WALLPAPERS = [
  { id: 'def-1', url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Lake_Wanaka_-_northern_part%2C_New_Zealand.jpg', category: 'Nature' },
  { id: 'def-2', url: 'https://images.pexels.com/photos/28648054/pexels-photo-28648054.jpeg?auto=compress&cs=srgb&w=7680', category: 'Abstract' },
  { id: 'def-3', url: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=srgb&w=7680', category: 'Science' },
];

const TAB_TO_PATH: Record<string, string> = {
  home: '/',
  links: '/bookmarks',
  calendar: '/calendar',
  calculator: '/calculator',
  todo: '/todo',
  notes: '/notes',
  ip: '/ip',
  speed: '/speed',
  settings: '/settings',
  privacy: '/privacy',
  terms: '/terms',
  about: '/about',
  contact: '/contact',
};

const PATH_TO_TAB: Record<string, string> = Object.fromEntries(
  Object.entries(TAB_TO_PATH).map(([tab, routePath]) => [routePath, tab])
);

const ROUTE_SEO: Record<string, Record<string, { title: string; description: string }>> = {
  English: {
    home: { title: 'GeekTabs Dashboard', description: 'A minimalist, aesthetic productivity dashboard with immersive wallpapers, smart widgets, and integrated search.' },
    links: { title: 'Bookmarks & Quick Links – GeekTabs', description: 'Organize favorite websites, office suites, AI tools, and personal shortcuts into categorized visual bookmarks.' },
    calendar: { title: 'Calendar & Regional Holidays – GeekTabs', description: 'Plan events, timed reminders, and track multi-country public holidays in a clean monthly calendar.' },
    calculator: { title: 'Calculator & Live Currency Converter – GeekTabs', description: 'Perform scientific calculations and convert currencies using live market exchange rates or custom manual rates.' },
    todo: { title: 'To-Do List – GeekTabs', description: 'Manage daily tasks, priorities, and checklists inside your GeekTabs workspace.' },
    notes: { title: 'Notes – GeekTabs', description: 'Write and organize rich formatted notes across customizable sections in GeekTabs.' },
    ip: { title: 'IP Address & Connection Diagnostics – GeekTabs', description: 'Inspect your public IPv4 and IPv6 addresses, ISP geolocation, ASN details, and network security diagnostics.' },
    speed: { title: 'Broadband Speed Test – GeekTabs', description: 'Measure real-time download speed, upload bandwidth, ping latency, jitter, and network quality scores.' },
    settings: { title: 'Settings – GeekTabs', description: 'Customize GeekTabs themes, wallpapers, card styles, language, and data backups.' },
    privacy: { title: 'Privacy Policy – GeekTabs', description: 'Learn how GeekTabs handles local browser storage, utility network requests, cookies, and Google AdSense disclosures.' },
    terms: { title: 'Terms of Service – GeekTabs', description: 'Read the GeekTabs Terms of Service covering acceptable use, local data backups, and third-party links.' },
    about: { title: 'About GeekTabs – Minimalist Productivity Workspace', description: 'Discover GeekTabs: an all-in-one productivity dashboard featuring bookmarks, calendar, calculator, notes, and network tools.' },
    contact: { title: 'Contact Us – GeekTabs', description: 'Get in touch with the GeekTabs team for support, feedback, bug reports, or privacy inquiries.' },
  },
  Chinese: {
    home: { title: 'GeekTabs 主页', description: '极简高颜值效率主页，集成高清壁纸、智能小组件与多引擎聚合搜索。' },
    links: { title: '书签与快速导航 – GeekTabs', description: '将常用网站、办公套件、AI 工具与个人快捷方式整理为分类视觉书签。' },
    calendar: { title: '日历与多国节假日 – GeekTabs', description: '在清爽的月历视图中规划日程、定时提醒与多国法定节假日。' },
    calculator: { title: '计算器与实时汇率换算 – GeekTabs', description: '一站式进行科学数学计算与实时/手动外汇汇率换算。' },
    todo: { title: '待办事项 – GeekTabs', description: '在 GeekTabs 工作区高效管理每日任务、优先级与清单。' },
    notes: { title: '笔记 – GeekTabs', description: '在可自定义的分类分区中撰写并整理富文本笔记。' },
    ip: { title: 'IP 地址与网络诊断 – GeekTabs', description: '即时检测公网 IPv4/IPv6 地址、运营商地理位置、ASN 与连接安全诊断。' },
    speed: { title: '宽带网速测试 – GeekTabs', description: '实时测算下载速度、上传带宽、Ping 延迟、抖动与网络质量评分。' },
    settings: { title: '设置 – GeekTabs', description: '自定义 GeekTabs 主题、壁纸、卡片样式、语言与本地数据备份。' },
    privacy: { title: '隐私政策 – GeekTabs', description: '了解 GeekTabs 的本地存储架构、外部工具请求、Cookie 与广告声明。' },
    terms: { title: '服务条款 – GeekTabs', description: '阅读涵盖允许使用、本地备份责任与第三方链接的 GeekTabs 服务条款。' },
    about: { title: '关于 GeekTabs – 极简效率工作空间', description: '探索集书签、日历、计算器、笔记与网络诊断于一体的 GeekTabs 效率仪表盘。' },
    contact: { title: '联系我们 – GeekTabs', description: '联系 GeekTabs 团队反馈意见、提交问题或咨询隐私事宜。' },
  },
  'Chinese Traditional': {
    home: { title: 'GeekTabs 首頁', description: '極簡美學效率儀表板，結合精選桌布、智慧小工具與整合搜尋。' },
    links: { title: '書籤與快速連結 – GeekTabs', description: '將常用網站、辦公套件、AI 工具與個人捷徑依分類整理成視覺書籤。' },
    calendar: { title: '行事曆與多國節假日 – GeekTabs', description: '在簡潔的月曆檢視中規劃活動、定時提醒並追蹤多國國定假日。' },
    calculator: { title: '計算機與即時匯率換算 – GeekTabs', description: '進行科學運算並使用即時市場匯率或手動固定匯率換算貨幣。' },
    todo: { title: '待辦事項 – GeekTabs', description: '在 GeekTabs 工作區內輕鬆管理每日任務、優先順序與檢查清單。' },
    notes: { title: '筆記 – GeekTabs', description: '在可自訂分區中撰寫並整理格式豐富的筆記內容。' },
    ip: { title: 'IP 位址與連線診斷 – GeekTabs', description: '即時檢查您的公網 IPv4 與 IPv6 位址、ISP 定位、ASN 與網路安全診斷。' },
    speed: { title: '寬頻網速測試 – GeekTabs', description: '即時量測下載速度、上傳頻寬、Ping 延遲、抖動與網路品質評分。' },
    settings: { title: '設定 – GeekTabs', description: '自訂 GeekTabs 主題、桌布、卡片樣式、語言與資料備份。' },
    privacy: { title: '隱私權政策 – GeekTabs', description: '了解 GeekTabs 如何處理瀏覽器本機儲存空間、網路工具請求、Cookie 與廣告揭露。' },
    terms: { title: '服務條款 – GeekTabs', description: '閱讀涵蓋允許使用範圍、本機備份與第三方連結的 GeekTabs 服務條款。' },
    about: { title: '關於 GeekTabs – 極簡生產力工作空間', description: '認識集結書籤、行事曆、計算機、筆記與網路工具的 GeekTabs 效率平台。' },
    contact: { title: '聯絡我們 – GeekTabs', description: '聯絡 GeekTabs 團隊提供意見回饋、回報錯誤或諮詢隱私問題。' },
  },
  Belgum: {
    home: { title: 'GeekTabs Dashboard', description: 'Een minimalistisch, stijlvol productiviteitsdashboard met meeslepende achtergronden, slimme widgets en geïntegreerde zoekfunctie.' },
    links: { title: 'Bladwijzers & Snelkoppelingen – GeekTabs', description: 'Organiseer favoriete websites, kantoorsuites, AI-tools en persoonlijke snelkoppelingen in overzichtelijke visuele categorieën.' },
    calendar: { title: 'Kalender & Regionale Feestdagen – GeekTabs', description: 'Plan afspraken, tijdgebonden herinneringen en volg feestdagen uit meerdere landen in één heldere maandkalender.' },
    calculator: { title: 'Rekenmachine & Live Valutaomzetter – GeekTabs', description: 'Voer wetenschappelijke berekeningen uit en reken valuta om met live wisselkoersen of handmatige vaste tarieven.' },
    todo: { title: 'Takenlijst – GeekTabs', description: 'Beheer dagelijkse taken, prioriteiten en checklists overzichtelijk in uw GeekTabs-werkruimte.' },
    notes: { title: 'Notities – GeekTabs', description: 'Schrijf en organiseer overzichtelijke notities met opmaak in aanpasbare secties.' },
    ip: { title: 'IP-adres & Verbindingsdiagnose – GeekTabs', description: 'Bekijk uw publieke IPv4- en IPv6-adressen, providerlocatie, ASN-gegevens en beveiligingsdiagnose van uw verbinding.' },
    speed: { title: 'Snelheidstest – GeekTabs', description: 'Meet uw werkelijke downloadsnelheid, uploadsnelheid, ping-vertraging, jitter en netwerkkwaliteitsscore.' },
    settings: { title: 'Instellingen – GeekTabs', description: 'Pas GeekTabs-thema’s, achtergronden, kaartstijlen, taal en lokale gegevensback-ups aan.' },
    privacy: { title: 'Privacybeleid – GeekTabs', description: 'Lees hoe GeekTabs omgaat met lokale browseropslag, netwerkaanvragen, cookies en advertentiemeldingen.' },
    terms: { title: 'Gebruiksvoorwaarden – GeekTabs', description: 'Lees de gebruiksvoorwaarden van GeekTabs over aanvaardbaar gebruik, lokale back-ups en externe links.' },
    about: { title: 'Over GeekTabs – Minimalistische Productiviteitswerkruimte', description: 'Ontdek GeekTabs: een alles-in-één productiviteitsdashboard met bladwijzers, kalender, rekenmachine, notities en netwerktools.' },
    contact: { title: 'Contact – GeekTabs', description: 'Neem contact op met het GeekTabs-team voor ondersteuning, feedback, bugmeldingen of privacyvragen.' },
  },
};

const TAB_TITLE_KEYS: Record<string, string> = {
  home: 'home',
  links: 'links',
  calendar: 'calendar',
  calculator: 'calculator',
  todo: 'todo',
  notes: 'notes',
  ip: 'ip',
  speed: 'speed',
  settings: 'settings',
};

const FOOTER_T: Record<string, {
  tagline: string;
  copyright: string;
  poweredBy: string;
  privacy: string;
  terms: string;
  about: string;
  contact: string;
  footerNavAria: string;
  heroAria: string;
  weatherAria: string;
}> = {
  English: {
    tagline: 'Your everyday space for useful websites, tools and productivity.',
    copyright: '© 2026 GeekTabs. All rights reserved.',
    poweredBy: 'Powered and secured by Geektabs.',
    privacy: 'Privacy', terms: 'Terms', about: 'About', contact: 'Contact',
    footerNavAria: 'Footer navigation', heroAria: 'Workspace Hero', weatherAria: 'Weather Forecast',
  },
  Chinese: {
    tagline: '您的日常精选网站、实用工具与高效率工作空间。',
    copyright: '© 2026 GeekTabs. 保留所有权利。',
    poweredBy: '由 Geektabs 提供技术支持与安全保障。',
    privacy: '隐私政策', terms: '服务条款', about: '关于我们', contact: '联系我们',
    footerNavAria: '页脚导航', heroAria: '工作区主视图', weatherAria: '天气预报',
  },
  'Chinese Traditional': {
    tagline: '您的日常實用網站、專注工具與生產力空間。',
    copyright: '© 2026 GeekTabs. 保留一切權利。',
    poweredBy: '由 Geektabs 提供技術支援與安全守護。',
    privacy: '隱私權政策', terms: '服務條款', about: '關於我們', contact: '聯絡我們',
    footerNavAria: '頁尾導覽', heroAria: '工作區主視覺', weatherAria: '天氣預報',
  },
  Spanish: {
    tagline: 'Tu espacio diario para sitios útiles, herramientas y productividad.',
    copyright: '© 2026 GeekTabs. Todos los derechos reservados.',
    poweredBy: 'Impulsado y protegido por Geektabs.',
    privacy: 'Privacidad', terms: 'Términos', about: 'Acerca de', contact: 'Contacto',
    footerNavAria: 'Navegación de pie de página', heroAria: 'Espacio principal', weatherAria: 'Pronóstico del tiempo',
  },
  French: {
    tagline: 'Votre espace quotidien pour vos sites utiles, outils et productivité.',
    copyright: '© 2026 GeekTabs. Tous droits réservés.',
    poweredBy: 'Propulsé et sécurisé par Geektabs.',
    privacy: 'Confidentialité', terms: 'Conditions', about: 'À propos', contact: 'Contact',
    footerNavAria: 'Navigation de pied de page', heroAria: 'Espace principal', weatherAria: 'Prévisions météo',
  },
  German: {
    tagline: 'Ihr täglicher Raum für nützliche Websites, Tools und Produktivität.',
    copyright: '© 2026 GeekTabs. Alle Rechte vorbehalten.',
    poweredBy: 'Bereitgestellt und gesichert durch Geektabs.',
    privacy: 'Datenschutz', terms: 'Bedingungen', about: 'Über uns', contact: 'Kontakt',
    footerNavAria: 'Fußzeilen-Navigation', heroAria: 'Arbeitsbereich-Header', weatherAria: 'Wettervorhersage',
  },
  Japanese: {
    tagline: '便利なサイト、ツール、日々の生産性をひとつに。',
    copyright: '© 2026 GeekTabs. All rights reserved.',
    poweredBy: 'Powered and secured by Geektabs.',
    privacy: 'プライバシー', terms: '利用規約', about: '概要', contact: 'お問い合わせ',
    footerNavAria: 'フッターナビゲーション', heroAria: 'ワークスペースヒーロー', weatherAria: '天気予報',
  },
  Korean: {
    tagline: '유용한 웹사이트, 도구, 일상의 생산성을 위한 공간.',
    copyright: '© 2026 GeekTabs. All rights reserved.',
    poweredBy: 'Geektabs에서 제공하고 보호합니다.',
    privacy: '개인정보', terms: '이용약관', about: '소개', contact: '문의',
    footerNavAria: '바닥글 탐색', heroAria: '작업 공간 히어로', weatherAria: '일기예보',
  },
  Italian: {
    tagline: 'Il tuo spazio quotidiano per siti utili, strumenti e produttività.',
    copyright: '© 2026 GeekTabs. Tutti i diritti riservati.',
    poweredBy: 'Realizzato e protetto da Geektabs.',
    privacy: 'Privacy', terms: 'Termini', about: 'Informazioni', contact: 'Contatti',
    footerNavAria: 'Navigazione a piè di pagina', heroAria: 'Area principale', weatherAria: 'Previsioni meteo',
  },
  Russian: {
    tagline: 'Ваше ежедневное пространство для полезных сайтов, инструментов и продуктивности.',
    copyright: '© 2026 GeekTabs. Все права защищены.',
    poweredBy: 'Работает и защищено Geektabs.',
    privacy: 'Конфиденциальность', terms: 'Условия', about: 'О сервисе', contact: 'Контакты',
    footerNavAria: 'Навигация в подвале', heroAria: 'Главный экран', weatherAria: 'Прогноз погоды',
  },
  Luxembourgish: {
    tagline: 'Äre alldeegleche Raum fir nëtzlech Websäiten, Tools a Produktivitéit.',
    copyright: '© 2026 GeekTabs. All Rechter virbehalen.',
    poweredBy: 'Bereetgestallt a geséchert vu Geektabs.',
    privacy: 'Dateschutz', terms: 'Bedéngungen', about: 'Iwwer eis', contact: 'Kontakt',
    footerNavAria: 'Fousszäil-Navigatioun', heroAria: 'Aarbechtsberäich', weatherAria: 'Wiederprevisioun',
  },
  Dutch: {
    tagline: 'Uw dagelijkse plek voor handige websites, tools en productiviteit.',
    copyright: '© 2026 GeekTabs. Alle rechten voorbehouden.',
    poweredBy: 'Aangedreven en beveiligd door Geektabs.',
    privacy: 'Privacy', terms: 'Voorwaarden', about: 'Over ons', contact: 'Contact',
    footerNavAria: 'Voettekstnavigatie', heroAria: 'Werkruimte', weatherAria: 'Weersverwachting',
  },
  Swedish: {
    tagline: 'Din dagliga plats för användbara webbplatser, verktyg och produktivitet.',
    copyright: '© 2026 GeekTabs. Alla rättigheter förbehållna.',
    poweredBy: 'Drivs och skyddas av Geektabs.',
    privacy: 'Integritet', terms: 'Villkor', about: 'Om oss', contact: 'Kontakt',
    footerNavAria: 'Sidfotsnavigering', heroAria: 'Arbetsyta', weatherAria: 'Väderprognos',
  },
  Finnish: {
    tagline: 'Päivittäinen tilasi hyödyllisille sivustoille, työkaluille ja tuottavuudelle.',
    copyright: '© 2026 GeekTabs. Kaikki oikeudet pidätetään.',
    poweredBy: 'Tekniikka ja suojaus: Geektabs.',
    privacy: 'Tietosuoja', terms: 'Ehdot', about: 'Tietoja', contact: 'Yhteystiedot',
    footerNavAria: 'Alatunnisteen valikko', heroAria: 'Työtilan otsake', weatherAria: 'Sääennuste',
  },
  Hindi: {
    tagline: 'उपयोगी वेबसाइटों, टूल्स और दैनिक उत्पादकता के लिए आपका स्थान।',
    copyright: '© 2026 GeekTabs. सर्वाधिकार सुरक्षित।',
    poweredBy: 'Geektabs द्वारा संचालित और सुरक्षित।',
    privacy: 'गोपनीयता', terms: 'शर्तें', about: 'परिचय', contact: 'संपर्क',
    footerNavAria: 'फ़ुटर नेविगेशन', heroAria: 'कार्यक्षेत्र मुख्य अनुभाग', weatherAria: 'मौसम पूर्वानुमान',
  },
  Norwegian: {
    tagline: 'Ditt daglige rom for nyttige nettsider, verktøy og produktivitet.',
    copyright: '© 2026 GeekTabs. Alle rettigheter forbeholdt.',
    poweredBy: 'Drevet og sikret av Geektabs.',
    privacy: 'Personvern', terms: 'Vilkår', about: 'Om oss', contact: 'Kontakt',
    footerNavAria: 'Bunntekstnavigasjon', heroAria: 'Arbeidsområde', weatherAria: 'Værvarsel',
  },
  Thai: {
    tagline: 'พื้นที่ประจำวันของคุณสำหรับเว็บไซต์ที่มีประโยชน์ เครื่องมือ และประสิทธิภาพการทำงาน',
    copyright: '© 2026 GeekTabs. สงวนลิขสิทธิ์',
    poweredBy: 'ขับเคลื่อนและดูแลความปลอดภัยโดย Geektabs',
    privacy: 'ความเป็นส่วนตัว', terms: 'ข้อกำหนด', about: 'เกี่ยวกับ', contact: 'ติดต่อ',
    footerNavAria: 'เมนูส่วนท้าย', heroAria: 'พื้นที่ทำงานหลัก', weatherAria: 'พยากรณ์อากาศ',
  },
  Portuguese: {
    tagline: 'O seu espaço diário para sites úteis, ferramentas e produtividade.',
    copyright: '© 2026 GeekTabs. Todos os direitos reservados.',
    poweredBy: 'Desenvolvido e protegido por Geektabs.',
    privacy: 'Privacidade', terms: 'Termos', about: 'Sobre', contact: 'Contacto',
    footerNavAria: 'Navegação do rodapé', heroAria: 'Área principal', weatherAria: 'Previsão do tempo',
  },
  Vietnamese: {
    tagline: 'Không gian hằng ngày cho trang web hữu ích, công cụ và hiệu suất làm việc.',
    copyright: '© 2026 GeekTabs. Bảo lưu mọi quyền.',
    poweredBy: 'Vận hành và bảo mật bởi Geektabs.',
    privacy: 'Bảo mật', terms: 'Điều khoản', about: 'Giới thiệu', contact: 'Liên hệ',
    footerNavAria: 'Điều hướng chân trang', heroAria: 'Khu vực chính', weatherAria: 'Dự báo thời tiết',
  },
  Polish: {
    tagline: 'Twoja codzienna przestrzeń na przydatne strony, narzędzia i produktywność.',
    copyright: '© 2026 GeekTabs. Wszelkie prawa zastrzeżone.',
    poweredBy: 'Napędzane i zabezpieczone przez Geektabs.',
    privacy: 'Prywatność', terms: 'Regulamin', about: 'O nas', contact: 'Kontakt',
    footerNavAria: 'Nawigacja w stopce', heroAria: 'Główny obszar roboczy', weatherAria: 'Prognoza pogody',
  },
  Danish: {
    tagline: 'Dit daglige rum til nyttige hjemmesider, værktøjer og produktivitet.',
    copyright: '© 2026 GeekTabs. Alle rettigheder forbeholdes.',
    poweredBy: 'Drevet og sikret af Geektabs.',
    privacy: 'Privatliv', terms: 'Vilkår', about: 'Om os', contact: 'Kontakt',
    footerNavAria: 'Sidefodsnavigation', heroAria: 'Arbejdsområde', weatherAria: 'Vejrudsigt',
  },
  Turkish: {
    tagline: 'Faydalı web siteleri, araçlar ve üretkenlik için günlük alanınız.',
    copyright: '© 2026 GeekTabs. Tüm hakları saklıdır.',
    poweredBy: 'Geektabs tarafından desteklenir ve korunur.',
    privacy: 'Gizlilik', terms: 'Şartlar', about: 'Hakkında', contact: 'İletişim',
    footerNavAria: 'Alt bilgi gezinmesi', heroAria: 'Çalışma alanı', weatherAria: 'Hava tahmini',
  },
  Greek: {
    tagline: 'Ο καθημερινός σας χώρος για χρήσιμους ιστότοπους, εργαλεία και παραγωγικότητα.',
    copyright: '© 2026 GeekTabs. Με επιφύλαξη παντός δικαιώματος.',
    poweredBy: 'Με την υποστήριξη και ασφάλεια της Geektabs.',
    privacy: 'Απόρρητο', terms: 'Όροι', about: 'Σχετικά', contact: 'Επικοινωνία',
    footerNavAria: 'Πλοήγηση υποσέλιδου', heroAria: 'Κύριος χώρος εργασίας', weatherAria: 'Πρόγνωση καιρού',
  },
  Belgum: {
    tagline: 'Uw dagelijkse plek voor handige websites, tools en productiviteit.',
    copyright: '© 2026 GeekTabs. Alle rechten voorbehouden.',
    poweredBy: 'Aangedreven en beveiligd door Geektabs.',
    privacy: 'Privacy', terms: 'Voorwaarden', about: 'Over ons', contact: 'Contact',
    footerNavAria: 'Voettekstnavigatie', heroAria: 'Werkruimte', weatherAria: 'Weersverwachting',
  },
};

function getTabFromLocation(): string {
  if (typeof window === 'undefined') return 'home';
  const normalized = window.location.pathname.replace(/\/+$/, '') || '/';
  return PATH_TO_TAB[normalized] || 'home';
}

export default function App() {
  const [activeTab, setActiveTabState] = useState<string>(getTabFromLocation);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'general' | 'about'>('general');
  const [theme, setTheme] = useLocalStorage('GeekTabs-theme', 'default-earth');
  const [isDarkMode, setIsDarkMode] = useLocalStorage('GeekTabs-dark-mode', true);
  const [customWallpapers, setCustomWallpapers] = useLocalStorage<any[]>("GeekTabs-custom-wallpapers", DEFAULT_WALLPAPERS);
  const [pageName, setPageName] = useLocalStorage('GeekTabs-page-name', '');
  const [language, setLanguage] = useLocalStorage('GeekTabs-language', 'English');
  const [cardBgMode, setCardBgMode] = useLocalStorage<'white' | 'dark' | 'dark-glass'>('GeekTabs-card-bg-mode', 'white');
  const [textColor, setTextColor] = useLocalStorage('GeekTabs-text-color', 'default');
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  React.useEffect(() => {
    const handleQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Initialize Default background and restore points
  React.useEffect(() => {
    try {
      localStorage.setItem(
        'GeekTabs-light-grey-restore-point',
        JSON.stringify({
          theme: 'default-earth',
          cardBgMode: 'white',
          isDarkMode: true,
          createdAt: new Date().toISOString(),
          label: 'Default Background'
        })
      );

      const hasAppliedEarthDefault = localStorage.getItem('GeekTabs-migrated-to-earth-default-v4');
      if (!hasAppliedEarthDefault) {
        const currentStoredTheme = localStorage.getItem('GeekTabs-theme');
        if (
          !currentStoredTheme ||
          currentStoredTheme === '"light-grey"' ||
          currentStoredTheme === 'light-grey' ||
          currentStoredTheme === '"light-slate"' ||
          currentStoredTheme === 'light-slate' ||
          currentStoredTheme === '"white-clean"' ||
          currentStoredTheme === 'white-clean'
        ) {
          setTheme('default-earth');
        }
        localStorage.setItem('GeekTabs-migrated-to-earth-default-v4', 'true');
      }

      if (isGifWallpaperUrl(theme)) {
        setTheme('default-earth');
      }
    } catch (err) {
      console.warn('Background restore point initialization notice:', err);
    }
  }, [setTheme, theme]);

  const getGreetingByTime = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return t(language, 'good_morning');
    } else if (hour >= 12 && hour < 18) {
      return t(language, 'good_afternoon');
    } else {
      return t(language, 'good_evening');
    }
  };

  // Ensure default welcome greeting has capitalized 2nd word
  React.useEffect(() => {
    if (pageName === 'Good morning') setPageName('Good Morning');
    else if (pageName === 'Good afternoon') setPageName('Good Afternoon');
    else if (pageName === 'Good evening') setPageName('Good Evening');
    else if (pageName === 'Buenos días') setPageName('Buenos Días');
    else if (pageName === 'Buenas tardes') setPageName('Buenas Tardes');
    else if (pageName === 'Buenas noches') setPageName('Buenas Noches');
  }, [pageName, setPageName]);

  const rawDisplayName = (!pageName || pageName === 'have a good day') ? getGreetingByTime() : pageName;
  const displayName = rawDisplayName === 'Good morning'
    ? 'Good Morning'
    : rawDisplayName === 'Good afternoon'
    ? 'Good Afternoon'
    : rawDisplayName === 'Good evening'
    ? 'Good Evening'
    : rawDisplayName === 'Buenos días'
    ? 'Buenos Días'
    : rawDisplayName === 'Buenas tardes'
    ? 'Buenas Tardes'
    : rawDisplayName === 'Buenas noches'
    ? 'Buenas Noches'
    : rawDisplayName;

  // Automatically update dark mode based on theme selection
  React.useEffect(() => {
    let isLight = false;

    const isPhoto =
      theme.startsWith('data:image') ||
      theme.startsWith('data:video') ||
      theme.startsWith('idb-wall://') ||
      theme.startsWith('blob:') ||
      theme.startsWith('http') ||
      theme === 'default-earth';
    if (isPhoto) {
      isLight = false; 
    } else if (theme === 'light-grey' || theme === 'light-slate' || theme === 'white-clean' || theme === 'pastel-waves' || theme === 'mix-neonpurple') {
      isLight = true;
    } else {
      const colorsToAnalyze: string[] = [];

      if (theme.startsWith('#')) {
        colorsToAnalyze.push(theme);
      } else if (SOLIDS_MAP[theme]) {
        colorsToAnalyze.push(SOLIDS_MAP[theme]);
      } else if (GRADIENTS_MAP[theme]) {
        const hexes = GRADIENTS_MAP[theme].match(/#[0-9a-fA-F]{6}\b/g);
        if (hexes) {
          colorsToAnalyze.push(...hexes);
        }
      } else {
        const wp = WALLPAPERS.find(w => w.id === theme);
        if (wp && wp.overlay) {
          if (wp.overlay.startsWith('#')) {
            colorsToAnalyze.push(wp.overlay);
          } else {
            const hexes = wp.overlay.match(/#[0-9a-fA-F]{6}\b/g);
            if (hexes) {
              colorsToAnalyze.push(...hexes);
            }
          }
        }
      }

      if (colorsToAnalyze.length > 0) {
        let totalYiq = 0;
        colorsToAnalyze.forEach(hex => {
          const cleanHex = hex.replace('#', '');
          const r = parseInt(cleanHex.substring(0, 2), 16);
          const g = parseInt(cleanHex.substring(2, 4), 16);
          const b = parseInt(cleanHex.substring(4, 6), 16);
          const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
          totalYiq += yiq;
        });
        const avgYiq = totalYiq / colorsToAnalyze.length;
        isLight = avgYiq >= 128;
      }
    }

    setIsDarkMode(!isLight);
  }, [theme, setIsDarkMode]);

  // Synchronize document.body background color with current theme
  React.useEffect(() => {
    if (theme === 'default-earth') {
      document.body.style.backgroundColor = '#063354';
    } else if (theme === 'light-grey' || theme === 'light-slate') {
      document.body.style.backgroundColor = '#f8fafc';
    } else if (theme === 'white-clean') {
      document.body.style.backgroundColor = '#ffffff';
    } else if (theme === 'pastel-waves') {
      document.body.style.backgroundColor = '#b8c8ec';
    } else if (theme === 'mix-neonpurple') {
      document.body.style.backgroundColor = '#eef4ff';
    } else {
      document.body.style.backgroundColor = '';
    }
  }, [theme]);

  const isPhoto =
    theme === 'default-earth' ||
    theme.startsWith('data:image') ||
    theme.startsWith('data:video') ||
    theme.startsWith('idb-wall://') ||
    theme.startsWith('http') ||
    theme.startsWith('blob:') ||
    theme.startsWith('/');
  const hasCustomTextColor = textColor && textColor !== 'default';

  // For Glass card text color:
  // Dark presets & photo/dark wallpapers -> white text ('dark');
  // Light, Regular, Mix, and Default backgrounds -> black text ('light').
  const isGlassBgDark = React.useMemo(() => {
    if (isPhoto) return true;
    if (theme.startsWith('dark-')) return true;
    if (['immersive', 'deep-space', 'forest', 'northern-lights', 'purple-vibe'].includes(theme)) return true;
    if (theme.startsWith('#') && theme.length >= 7) {
      const cleanHex = theme.replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return yiq < 128;
    }
    return false;
  }, [theme, isPhoto]);

  const isTextColorLight = React.useMemo(() => {
    if (!textColor || textColor === 'default') return isDarkMode;
    if (textColor.startsWith('#') && textColor.length >= 7) {
      const cleanHex = textColor.replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return yiq >= 128;
    }
    return true;
  }, [textColor, isDarkMode]);

  const isDefaultLightBg = theme === 'light-grey' || theme === 'light-slate' || theme === 'white-clean';
  const isExemptPage = activeTab === 'links' || activeTab === 'settings';

  const isFullPageTab = activeTab === 'todo';

  const setActiveTab = React.useCallback((nextTab: string) => {
    const resolvedTab = TAB_TO_PATH[nextTab] ? nextTab : 'home';
    setActiveTabState(resolvedTab);
    if (typeof window !== 'undefined') {
      const targetPath = TAB_TO_PATH[resolvedTab] || '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab: resolvedTab }, '', targetPath);
      }
    }
  }, []);

  React.useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(getTabFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const ft = FOOTER_T[language] || FOOTER_T.English;

  React.useEffect(() => {
    const LANG_TO_BCP47: Record<string, string> = {
      English: 'en',
      Belgum: 'nl-BE',
      Chinese: 'zh-CN',
      'Chinese Traditional': 'zh-TW',
      Danish: 'da',
      Dutch: 'nl',
      Finnish: 'fi',
      French: 'fr',
      German: 'de',
      Greek: 'el',
      Hindi: 'hi',
      Italian: 'it',
      Japanese: 'ja',
      Korean: 'ko',
      Luxembourgish: 'lb',
      Norwegian: 'nb',
      Polish: 'pl',
      Portuguese: 'pt',
      Russian: 'ru',
      Spanish: 'es',
      Swedish: 'sv',
      Thai: 'th',
      Turkish: 'tr',
      Vietnamese: 'vi',
    };
    document.documentElement.lang = LANG_TO_BCP47[language] || 'en';

    const langSeo = ROUTE_SEO[language];
    let resolvedTitle = 'GeekTabs Dashboard';
    let resolvedDesc = ROUTE_SEO.English.home.description;

    if (langSeo && langSeo[activeTab]) {
      resolvedTitle = langSeo[activeTab].title;
      resolvedDesc = langSeo[activeTab].description;
    } else if (TAB_TITLE_KEYS[activeTab]) {
      resolvedTitle = `${t(language, TAB_TITLE_KEYS[activeTab])} – GeekTabs`;
      const enSeo = ROUTE_SEO.English[activeTab] || ROUTE_SEO.English.home;
      resolvedDesc = enSeo.description;
    } else {
      const legalLabel =
        activeTab === 'privacy' ? ft.privacy :
        activeTab === 'terms' ? ft.terms :
        activeTab === 'about' ? ft.about :
        activeTab === 'contact' ? ft.contact : 'GeekTabs';
      resolvedTitle = `${legalLabel} – GeekTabs`;
      const enSeo = ROUTE_SEO.English[activeTab] || ROUTE_SEO.English.home;
      resolvedDesc = enSeo.description;
    }

    document.title = resolvedTitle;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', resolvedDesc);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', resolvedTitle);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', resolvedDesc);

    const isNoIndexRoute = activeTab === 'todo' || activeTab === 'notes' || activeTab === 'settings';
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', isNoIndexRoute ? 'noindex, nofollow' : 'index, follow');

    if (typeof window !== 'undefined') {
      const targetPath = TAB_TO_PATH[activeTab] || '/';
      const canonicalHref = `${window.location.origin}${targetPath}`;
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalHref);
    }

    window.scrollTo(0, 0);
  }, [activeTab, language, ft.privacy, ft.terms, ft.about, ft.contact]);

  const cardStyleClass =
    cardBgMode === 'dark-glass'
      ? 'card-style-dark-glass'
      : cardBgMode === 'dark'
      ? 'card-style-dark'
      : 'card-style-white';

  const dailySectionTitle =
    {
      English: 'Daily Digest',
      Chinese: '每日精选',
      'Chinese Traditional': '每日精選',
      Spanish: 'Resumen Diario',
      French: 'Le Quatuor du Jour',
      German: 'Tagesbriefing',
      Japanese: 'デイリーダイジェスト',
      Korean: '데일리 다이제스트',
      Italian: 'Riepilogo Quotidiano',
      Russian: 'Сводка дня',
      Luxembourgish: 'Dagbléck',
      Dutch: 'Dagelijks Overzicht',
      Swedish: 'Dagens Sammanfattning',
      Finnish: 'Päivän Katsaus',
      Hindi: 'दैनिक सारांश',
      Norwegian: 'Daglig Sammendrag',
      Thai: 'สรุปประจำวัน',
      Portuguese: 'Resumo Diário',
      Vietnamese: 'Tổng hợp hằng ngày',
      Polish: 'Przegląd dnia',
      Danish: 'Dagligt overblik',
      Turkish: 'Günlük Özet',
      Greek: 'Ημερήσια Σύνοψη',
      Belgum: 'Dagelijks Overzicht',
    }[language] || 'Daily Digest';

  const dailySectionHumorDesc =
    {
      English:
        'Practical life tips to simplify your routine, gentle reminders for a calmer mind, a quick laugh before your coffee cools, and timeless quotes to inspire your day.',
      Chinese:
        '实用生活贴士让日常更从容，温柔提醒让思绪更平静，趁咖啡未凉先笑一笑，经典名言为你的每一天注入灵感。',
      'Chinese Traditional':
        '實用生活小撇步讓日常更從容，溫柔提醒讓思緒更平靜，趁咖啡未涼先笑一笑，經典名言為你的每一天注入靈感。',
      Spanish:
        'Consejos prácticos para simplificar tu rutina, recordatorios suaves para calmar la mente, una sonrisa antes de que se enfríe el café y citas atemporales para inspirar tu día.',
      French:
        'Des astuces pratiques pour simplifier votre quotidien, des rappels doux pour apaiser l’esprit, un sourire avant que le café ne refroidisse et des citations intemporelles pour inspirer votre journée.',
      German:
        'Praktische Alltagstipps für mehr Leichtigkeit, sanfte Erinnerungen für einen klaren Kopf, ein kurzes Lachen zum Kaffee und zeitlose Zitate für neue Inspiration.',
      Japanese:
        '毎日の習慣を整える暮らしの知恵、心を落ち着かせるやさしいリマインダー、コーヒーが冷める前のひと笑い、そして一日にインスピレーションを与える名言を。',
      Korean:
        '일상을 단순하게 만드는 실용적인 팁, 마음을 차분하게 해주는 부드러운 알림, 커피가 식기 전의 짧은 웃음, 그리고 하루에 영감을 주는 명언까지.',
      Italian:
        'Consigli pratici per semplificare la routine, promemoria gentili per schiarire la mente, una risata prima che il caffè si raffreddi e citazioni senza tempo per ispirare la tua giornata.',
      Russian:
        'Практичные советы для лёгкой рутины, мягкие напоминания для ясного ума, повод улыбнуться к горячему кофе и мудрые цитаты для вдохновения на весь день.',
      Luxembourgish:
        'Praktesch Alldagstipps fir méi Liichtegkeet, sanft Erënnerungen fir e klore Kapp, e kuerze Laach beim Kaffi an zäitlos Zitater fir nei Inspiratioun.',
      Dutch:
        'Praktische levenstips voor een vlottere routine, zachte herinneringen voor een rustiger hoofd, een snelle glimlach voordat je koffie afkoelt en tijdloze citaten voor dagelijkse inspiratie.',
      Swedish:
        'Praktiska vardagstips för en enklare rutin, milda påminnelser för ett lugnare sinne, ett snabbt skratt innan kaffet kallnar och tidlösa citat som inspirerar din dag.',
      Finnish:
        'Käytännöllisiä arjen vinkkejä sujuvampaan päivään, lempeitä muistutuksia mielenrauhaan, pieni nauru ennen kahvin jäähtymistä ja ajattomia sitaatteja inspiraatioksi.',
      Hindi:
        'दिनचर्या को आसान बनाने के व्यावहारिक टिप्स, मन को शांत रखने के कोमल अनुस्मारक, कॉफी ठंडी होने से पहले एक हल्की मुस्कान और दिन को प्रेरित करने वाले अनमोल विचार।',
      Norwegian:
        'Praktiske hverdagstips for en enklere rutine, milde påminnelser for et roligere sinn, en rask latter før kaffen blir kald og tidløse sitater som inspirerer dagen din.',
      Thai:
        'เคล็ดลับใช้ชีวิตที่ช่วยให้ทุกวันง่ายขึ้น ข้อคิดเตือนใจเพื่อความสงบของจิตใจ เสียงหัวเราะเบาๆ ก่อนกาแฟเย็น และคำคมอมตะที่สร้างแรงบันดาลใจตลอดวัน',
      Portuguese:
        'Dicas práticas para simplificar a rotina, lembretes gentis para acalmar a mente, uma risada rápida antes que o café arrefeça e citações atemporais para inspirar o seu dia.',
      Vietnamese:
        'Mẹo sống thiết thực giúp nhịp sống nhẹ nhàng hơn, lời nhắc dịu dàng cho tâm trí bình yên, tiếng cười nhanh trước khi cà phê nguội và những câu nói vượt thời gian truyền cảm hứng mỗi ngày.',
      Polish:
        'Praktyczne porady ułatwiające codzienność, łagodne przypomnienia dla spokojniejszego umysłu, szybki uśmiech zanim kawa ostygnie i ponadczasowe cytaty inspirujące każdego dnia.',
      Danish:
        'Praktiske hverdagstips til en lettere rutine, milde påmindelser til et roligere sind, et hurtigt grin før kaffen bliver kold og tidløse citater til at inspirere din dag.',
      Turkish:
        'Günlük düzeni kolaylaştıran pratik ipuçları, zihni sakinleştiren nazik hatırlatmalar, kahveniz soğumadan kısa bir tebessüm ve gününüze ilham veren zamansız sözler.',
      Greek:
        'Πρακτικές συμβουλές για πιο απλή καθημερινότητα, ήπιες υπενθυμίσεις για ήρεμο νου, ένα γρήγορο χαμόγελο πριν κρυώσει ο καφές και διαχρονικά αποφθέγματα που εμπνέουν τη μέρα σας.',
      Belgum:
        'Praktische levenstips om uw routine te vereenvoudigen, zachte herinneringen voor een rustiger gemoed, een snelle glimlach nog voor uw koffie afkoelt en tijdloze citaten ter inspiratie.',
    }[language] ||
    'Practical life tips to simplify your routine, gentle reminders for a calmer mind, a quick laugh before your coffee cools, and timeless quotes to inspire your day.';

  return (
    <div 
      className={`relative min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'dark text-white' : 'light'} ${isPhoto ? 'photo-mode' : ''} ${cardStyleClass} ${theme === 'default-earth' ? 'bg-[#063354]' : theme === 'light-grey' || theme === 'light-slate' ? 'bg-[#f8fafc]' : theme === 'white-clean' ? 'bg-white' : theme === 'pastel-waves' ? 'bg-[#b8c8ec]' : theme === 'mix-neonpurple' ? 'bg-[#eef4ff]' : ''}`}
      style={hasCustomTextColor ? ({ '--custom-page-text-color': textColor } as React.CSSProperties) : undefined}
      data-has-custom-text={hasCustomTextColor ? 'true' : 'false'}
      data-custom-text-light={isTextColorLight ? 'true' : 'false'}
      data-bg-light={!isDarkMode || isDefaultLightBg ? 'true' : 'false'}
      data-dark-mode={isDarkMode ? 'true' : 'false'}
      data-card-bg-mode={cardBgMode}
      data-glass-bg={isGlassBgDark ? 'dark' : 'light'}
      data-default-earth-bg={theme === 'default-earth' ? 'true' : 'false'}
      data-default-white-bg={theme === 'white-clean' ? 'true' : 'false'}
      data-default-light-grey-bg={theme === 'light-grey' || theme === 'light-slate' ? 'true' : 'false'}
      data-active-tab={activeTab}
      data-page-theme={isExemptPage ? 'exempt' : 'blue-purple-mix'}
    >
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <Wallpaper currentTheme={theme} isDarkMode={isDarkMode} />

      <main 
        className={
          isFullPageTab 
            ? "fixed top-14 bottom-0 left-0 right-0 z-10 flex flex-col overflow-hidden" 
            : "relative z-10 w-full min-h-screen flex flex-col items-center"
        } 
        data-active-tab={activeTab}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              data-tab="home"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1 w-full flex flex-col pt-20 sm:pt-24"
            >
              {/* Centerpiece Hero Section */}
              <section aria-label={ft.heroAria} className="flex-1 flex flex-col items-center pt-4 sm:pt-6 px-4 sm:px-6">
                {displayName && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-5 sm:mb-7"
                  >
                    <span 
                      className="welcome-greeting-display text-2xl sm:text-4xl md:text-5xl font-black italic tracking-tighter cursor-default select-none border-b-2 border-transparent hover:border-black/10 dark:hover:border-white/10 transition-all pb-1.5 px-4 sm:px-8 py-2 sm:py-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl sm:rounded-full leading-tight inline-block text-center text-[#6143f7]"
                      style={
                        hasCustomTextColor
                          ? { color: textColor, WebkitTextFillColor: textColor, background: 'none' }
                          : {
                              color: '#6143f7',
                              WebkitTextFillColor: '#6143f7',
                              background: 'none'
                            }
                      }
                    >
                      {displayName}
                    </span>
                  </motion.div>
                )}
                <Clock language={language} customTextColor={textColor} />
                {/* Live Horoscope Sign and Calendar Progress Text */}
                <HoroscopeInfo language={language} />
                <div className="mt-4 sm:mt-5 w-full max-w-3xl px-2 sm:px-4">
                  <SearchBar language={language} />
                </div>
              </section>

              {/* Bottom Widgets */}
              <div className="flex flex-col gap-6 w-full max-w-6xl lg:max-w-5xl mx-auto px-4 sm:px-6 mb-20 sm:mb-24 mt-6 sm:mt-8">
                <section aria-label={ft.weatherAria} className="w-full">
                  <WeatherWidget language={language} />
                </section>
                <section aria-label={dailySectionTitle} className="w-full flex flex-col">
                  <div className="daily-cards-humor-intro w-full px-2 sm:px-4 mt-12 sm:mt-14 mb-8 sm:mb-10 pt-1 select-none text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[40px] font-black tracking-tight word-color mb-3 sm:mb-4">
                      {dailySectionTitle}
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg xl:text-[18px] font-medium word-color opacity-90 max-w-3xl mx-auto leading-relaxed">
                      {dailySectionHumorDesc}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 w-full">
                    <div className="min-h-[210px] sm:min-h-[235px] lg:min-h-[250px] h-full">
                      <TipsWidget language={language} />
                    </div>
                    <div className="min-h-[210px] sm:min-h-[235px] lg:min-h-[250px] h-full">
                      <ReminderWidget language={language} />
                    </div>
                    <div className="min-h-[210px] sm:min-h-[235px] lg:min-h-[250px] h-full">
                      <HumorWidget language={language} />
                    </div>
                    <div className="min-h-[210px] sm:min-h-[235px] lg:min-h-[250px] h-full">
                      <QuoteWidget language={language} />
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              data-tab="calendar"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-36 pb-12"
            >
              <Calendar language={language} />
              <ToolGuideSection tool="calendar" language={language} />
            </motion.div>
          )}

          {activeTab === 'links' && (
            <motion.div
              key="links"
              data-tab="links"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-36 pb-12"
            >
              <QuickLinks language={language} />
              <ToolGuideSection tool="links" language={language} />
            </motion.div>
          )}

          {activeTab === 'todo' && (
            <motion.div
              key="todo"
              data-tab="todo"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full flex flex-col overflow-hidden"
            >
              <TodoListTab language={language} />
            </motion.div>
          )}

          {activeTab === 'calculator' && (
            <motion.div
              key="calculator"
              data-tab="calculator"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-36 pb-12"
            >
              <CalculatorTab language={language} />
              <ToolGuideSection tool="calculator" language={language} />
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              data-tab="notes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full flex-1 flex flex-col pt-14"
            >
              <NotesTab language={language} />
            </motion.div>
          )}

          {activeTab === 'ip' && (
            <motion.div
              key="ip"
              data-tab="ip"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-36 pb-12"
            >
              <IpAddressTab language={language} />
              <ToolGuideSection tool="ip" language={language} />
            </motion.div>
          )}

          {activeTab === 'speed' && (
            <motion.div
              key="speed"
              data-tab="speed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-36 pb-12"
            >
              <SpeedTestTab language={language} />
              <ToolGuideSection tool="speed" language={language} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              data-tab="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full flex-1 flex flex-col pt-14"
            >
              <SettingsTab 
                currentTheme={theme}
                setTheme={setTheme}
                isDarkMode={isDarkMode}
                customWallpapers={customWallpapers}
                setCustomWallpapers={setCustomWallpapers}
                language={language}
                setLanguage={setLanguage}
                cardBgMode={cardBgMode}
                setCardBgMode={setCardBgMode}
                textColor={textColor}
                setTextColor={setTextColor}
                initialTab={settingsInitialTab}
              />
            </motion.div>
          )}

          {(activeTab === 'privacy' || activeTab === 'terms' || activeTab === 'about' || activeTab === 'contact') && (
            <motion.div
              key={activeTab}
              data-tab={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="w-full flex-1 flex flex-col"
            >
              <LegalInfoPages page={activeTab} onNavigate={setActiveTab} language={language} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Site Footer (Rendered across Home, Public Tool Pages, and Legal/Info Pages; hidden in Workspace Editors & Settings) */}
        {['home', 'links', 'calendar', 'calculator', 'ip', 'speed', 'privacy', 'terms', 'about', 'contact'].includes(activeTab) && (
          <footer className="w-full pb-10 sm:pb-12 pt-4 sm:pt-6 select-none flex flex-col mt-auto">
            <div className="w-full max-w-6xl lg:max-w-5xl mx-auto px-4 sm:px-6 text-left">
              {/* Brand & Tagline */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#5438dc] to-[#6d4aff] flex items-center justify-center shadow-xs shrink-0 [text-shadow:none]">
                    <span
                      className="text-white font-extrabold text-xs antialiased leading-none [text-shadow:none]"
                      style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                    >
                      G
                    </span>
                  </div>
                  <span className="text-lg font-bold tracking-tight word-color">
                    GeekTabs
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-normal word-color opacity-75 leading-relaxed">
                  {ft.tagline}
                </p>
              </div>
            </div>

            {/* Divider - Full Width */}
            <div className="w-full border-t border-current word-color opacity-15 my-4 sm:my-5" />

            {/* Bottom Row */}
            <div className="w-full max-w-6xl lg:max-w-5xl mx-auto px-4 sm:px-6">
              <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4 text-xs sm:text-sm font-normal">
                <span className="text-xs sm:text-sm font-normal word-color opacity-75 whitespace-nowrap justify-self-start">
                  {ft.copyright}
                </span>

                <span className="text-xs sm:text-sm font-normal word-color opacity-75 md:justify-self-center md:text-center">
                  {ft.poweredBy}
                </span>

                <nav aria-label={ft.footerNavAria} className="flex items-center gap-4 sm:gap-5 shrink-0 md:justify-self-end flex-wrap">
                  <a
                    href="/privacy"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('privacy');
                    }}
                    className="text-xs sm:text-sm font-normal word-color opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {ft.privacy}
                  </a>
                  <a
                    href="/terms"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('terms');
                    }}
                    className="text-xs sm:text-sm font-normal word-color opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {ft.terms}
                  </a>
                  <a
                    href="/about"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('about');
                    }}
                    className="text-xs sm:text-sm font-normal word-color opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {ft.about}
                  </a>
                  <a
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('contact');
                    }}
                    className="text-xs sm:text-sm font-normal word-color opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {ft.contact}
                  </a>
                </nav>
              </div>
            </div>
          </footer>
        )}
      </main>

      <Dock
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'settings') setSettingsInitialTab('general');
          setActiveTab(tab);
        }}
        currentTheme={theme}
        setTheme={setTheme}
        isDarkMode={isDarkMode}
        language={language}
        setLanguage={setLanguage}
      />
      <OfflineIndicator language={language} />
    </div>
  );
}

