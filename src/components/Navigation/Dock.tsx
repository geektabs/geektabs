import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  LayoutGrid,
  Calendar,
  Link2,
  ListTodo,
  Calculator,
  FileText,
  Settings,
  Wifi,
  Globe,
  ChevronDown,
  X,
  Check,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { t, LANGUAGE_OPTIONS } from '../../i18n';
import { PWAInstallButton } from '../PWAInstallButton';

interface DockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentTheme: string;
  setTheme: (theme: string) => void;
  isDarkMode: boolean;
  language: string;
  setLanguage: (language: string) => void;
}

const NAV_ITEMS = [
  { key: 'home', icon: LayoutGrid, labelKey: 'home' },
  { key: 'links', icon: Link2, labelKey: 'links' },
  { key: 'calendar', icon: Calendar, labelKey: 'calendar' },
  { key: 'calculator', icon: Calculator, labelKey: 'calculator' },
  { key: 'todo', icon: ListTodo, labelKey: 'todo' },
  { key: 'notes', icon: FileText, labelKey: 'notes' },
  { key: 'ip', icon: Globe, labelKey: 'ip' },
  { key: 'speed', icon: Wifi, labelKey: 'speed' },
];

const NAV_HREF: Record<string, string> = {
  home: '/',
  links: '/bookmarks',
  calendar: '/calendar',
  calculator: '/calculator',
  todo: '/todo',
  notes: '/notes',
  ip: '/ip',
  speed: '/speed',
  settings: '/settings',
};

const SETTINGS_ITEM = { key: 'settings', icon: Settings, labelKey: 'settings' };

const DOCK_T: Record<string, {
  about: string;
  privacy: string;
  terms: string;
  contact: string;
  share: string;
  shareTitle: string;
  shareHeading: string;
  shareSubtitle: string;
  shareDesc: string;
  shareOn: string;
  shareLinkUrl: string;
  copied: string;
  copyLink: string;
  language: string;
  languageSelection: string;
  closeMenu: string;
  primaryNav: string;
}> = {
  English: {
    about: 'About', privacy: 'Privacy Policy', terms: 'Terms of Service', contact: 'Contact',
    share: 'Share', shareTitle: 'Share GeekTabs', shareHeading: 'Share Us',
    shareSubtitle: 'Share GeekTabs with friends and colleagues',
    shareDesc: 'A minimalist productivity dashboard for bookmarks, calendar, notes, to-dos, and utilities with immersive wallpapers.',
    shareOn: 'Share on', shareLinkUrl: 'Share link URL', copied: 'Copied!', copyLink: 'Copy Link',
    language: 'Language', languageSelection: 'Language selection', closeMenu: 'Close menu', primaryNav: 'Primary navigation',
  },
  Chinese: {
    about: '关于我们', privacy: '隐私政策', terms: '服务条款', contact: '联系我们',
    share: '分享', shareTitle: '分享 GeekTabs', shareHeading: '分享本站',
    shareSubtitle: '将 GeekTabs 分享给好友与同事',
    shareDesc: '集成书签、日历、笔记、待办和实用网络工具的极简高颜值效率主页。',
    shareOn: '分享至', shareLinkUrl: '分享链接地址', copied: '已复制！', copyLink: '复制链接',
    language: '语言', languageSelection: '选择语言', closeMenu: '关闭菜单', primaryNav: '主导航',
  },
  'Chinese Traditional': {
    about: '關於我們', privacy: '隱私權政策', terms: '服務條款', contact: '聯絡我們',
    share: '分享', shareTitle: '分享 GeekTabs', shareHeading: '分享本站',
    shareSubtitle: '將 GeekTabs 分享給朋友與同事',
    shareDesc: '整合書籤、行事曆、筆記、待辦與實用網路工具的極簡美學效率儀表板。',
    shareOn: '分享至', shareLinkUrl: '分享連結網址', copied: '已複製！', copyLink: '複製連結',
    language: '語言', languageSelection: '選擇語言', closeMenu: '關閉選單', primaryNav: '主導覽',
  },
  Spanish: {
    about: 'Acerca de', privacy: 'Política de privacidad', terms: 'Términos de servicio', contact: 'Contacto',
    share: 'Compartir', shareTitle: 'Compartir GeekTabs', shareHeading: 'Compártenos',
    shareSubtitle: 'Comparte GeekTabs con amigos y colegas',
    shareDesc: 'Un panel de productividad minimalista para marcadores, calendario, notas, tareas y utilidades con fondos inmersivos.',
    shareOn: 'Compartir en', shareLinkUrl: 'URL del enlace compartido', copied: '¡Copiado!', copyLink: 'Copiar enlace',
    language: 'Idioma', languageSelection: 'Selección de idioma', closeMenu: 'Cerrar menú', primaryNav: 'Navegación principal',
  },
  French: {
    about: 'À propos', privacy: 'Politique de confidentialité', terms: "Conditions d'utilisation", contact: 'Contact',
    share: 'Partager', shareTitle: 'Partager GeekTabs', shareHeading: 'Partagez GeekTabs',
    shareSubtitle: 'Partagez GeekTabs avec vos amis et collègues',
    shareDesc: 'Un tableau de bord minimaliste pour favoris, calendrier, notes, tâches et outils du quotidien avec fonds d’écran immersifs.',
    shareOn: 'Partager sur', shareLinkUrl: 'URL du lien de partage', copied: 'Copié !', copyLink: 'Copier le lien',
    language: 'Langue', languageSelection: 'Choix de la langue', closeMenu: 'Fermer le menu', primaryNav: 'Navigation principale',
  },
  German: {
    about: 'Über uns', privacy: 'Datenschutz', terms: 'Nutzungsbedingungen', contact: 'Kontakt',
    share: 'Teilen', shareTitle: 'GeekTabs teilen', shareHeading: 'Teile uns',
    shareSubtitle: 'Teile GeekTabs mit Freunden und Kollegen',
    shareDesc: 'Ein minimalistisches Produktivitäts-Dashboard für Lesezeichen, Kalender, Notizen, Aufgaben und Tools mit stimmungsvollen Hintergründen.',
    shareOn: 'Teilen auf', shareLinkUrl: 'Freigabelink-URL', copied: 'Kopiert!', copyLink: 'Link kopieren',
    language: 'Sprache', languageSelection: 'Sprachauswahl', closeMenu: 'Menü schließen', primaryNav: 'Hauptnavigation',
  },
  Japanese: {
    about: '概要', privacy: 'プライバシーポリシー', terms: '利用規約', contact: 'お問い合わせ',
    share: '共有', shareTitle: 'GeekTabs を共有', shareHeading: 'シェアする',
    shareSubtitle: 'GeekTabs を友人や同僚と共有しよう',
    shareDesc: 'ブックマーク、カレンダー、メモ、To-Do、便利ツールと美しい壁紙をまとめたミニマルな生産性ダッシュボード。',
    shareOn: '共有先:', shareLinkUrl: '共有リンク URL', copied: 'コピーしました！', copyLink: 'リンクをコピー',
    language: '言語', languageSelection: '言語の選択', closeMenu: 'メニューを閉じる', primaryNav: 'メインナビゲーション',
  },
  Korean: {
    about: '소개', privacy: '개인정보 처리방침', terms: '이용약관', contact: '문의하기',
    share: '공유', shareTitle: 'GeekTabs 공유', shareHeading: '공유하기',
    shareSubtitle: '친구와 동료에게 GeekTabs를 공유해 보세요',
    shareDesc: '북마크, 캘린더, 메모, 할 일, 일상 유틸리티와 감각적인 배경화면을 담은 미니멀 생산성 대시보드.',
    shareOn: '공유:', shareLinkUrl: '공유 링크 URL', copied: '복사됨!', copyLink: '링크 복사',
    language: '언어', languageSelection: '언어 선택', closeMenu: '메뉴 닫기', primaryNav: '기본 탐색',
  },
  Italian: {
    about: 'Informazioni', privacy: 'Privacy Policy', terms: 'Termini di servizio', contact: 'Contatti',
    share: 'Condividi', shareTitle: 'Condividi GeekTabs', shareHeading: 'Condividici',
    shareSubtitle: 'Condividi GeekTabs con amici e colleghi',
    shareDesc: 'Una dashboard minimalista per segnalibri, calendario, note, attività e utilità quotidiane con sfondi immersivi.',
    shareOn: 'Condividi su', shareLinkUrl: 'URL link di condivisione', copied: 'Copiato!', copyLink: 'Copia link',
    language: 'Lingua', languageSelection: 'Selezione lingua', closeMenu: 'Chiudi menu', primaryNav: 'Navigazione principale',
  },
  Russian: {
    about: 'О сервисе', privacy: 'Конфиденциальность', terms: 'Условия использования', contact: 'Контакты',
    share: 'Поделиться', shareTitle: 'Поделиться GeekTabs', shareHeading: 'Поделиться',
    shareSubtitle: 'Поделитесь GeekTabs с друзьями и коллегами',
    shareDesc: 'Минималистичная панель продуктивности с закладками, календарём, заметками, задачами и полезными инструментами.',
    shareOn: 'Поделиться в', shareLinkUrl: 'Ссылка для отправки', copied: 'Скопировано!', copyLink: 'Копировать ссылку',
    language: 'Язык', languageSelection: 'Выбор языка', closeMenu: 'Закрыть меню', primaryNav: 'Основная навигация',
  },
  Luxembourgish: {
    about: 'Iwwer eis', privacy: 'Dateschutz', terms: 'Notzungsbedéngungen', contact: 'Kontakt',
    share: 'Deelen', shareTitle: 'GeekTabs deelen', shareHeading: 'Deelt eis',
    shareSubtitle: 'Deelt GeekTabs mat Frënn a Kolleegen',
    shareDesc: 'E minimalistescht Produktivitéits-Dashboard fir Lieszeechen, Kalenner, Notizen, Aufgaben an alldeeglech Tools.',
    shareOn: 'Deelen op', shareLinkUrl: 'Share-Link URL', copied: 'Kopéiert!', copyLink: 'Link kopéieren',
    language: 'Sprooch', languageSelection: 'Sprooch auswielen', closeMenu: 'Menü zoumaachen', primaryNav: 'Haaptnavigatioun',
  },
  Dutch: {
    about: 'Over ons', privacy: 'Privacybeleid', terms: 'Servicevoorwaarden', contact: 'Contact',
    share: 'Delen', shareTitle: 'GeekTabs delen', shareHeading: 'Deel ons',
    shareSubtitle: 'Deel GeekTabs met vrienden en collega’s',
    shareDesc: 'Een minimalistisch productiviteitsdashboard voor bladwijzers, agenda, notities, taken en handige tools met fraaie achtergronden.',
    shareOn: 'Delen op', shareLinkUrl: 'Deellink-URL', copied: 'Gekopieerd!', copyLink: 'Link kopiëren',
    language: 'Taal', languageSelection: 'Taalkeuze', closeMenu: 'Menu sluiten', primaryNav: 'Hoofdnavigatie',
  },
  Swedish: {
    about: 'Om oss', privacy: 'Integritetspolicy', terms: 'Användarvillkor', contact: 'Kontakt',
    share: 'Dela', shareTitle: 'Dela GeekTabs', shareHeading: 'Dela oss',
    shareSubtitle: 'Dela GeekTabs med vänner och kollegor',
    shareDesc: 'En minimalistisk produktivitetspanel för bokmärken, kalender, anteckningar, uppgifter och vardagsverktyg.',
    shareOn: 'Dela på', shareLinkUrl: 'Delningslänkens URL', copied: 'Kopierad!', copyLink: 'Kopiera länk',
    language: 'Språk', languageSelection: 'Välj språk', closeMenu: 'Stäng meny', primaryNav: 'Huvudnavigering',
  },
  Finnish: {
    about: 'Tietoja', privacy: 'Tietosuojakäytäntö', terms: 'Käyttöehdot', contact: 'Yhteystiedot',
    share: 'Jaa', shareTitle: 'Jaa GeekTabs', shareHeading: 'Jaa meidät',
    shareSubtitle: 'Jaa GeekTabs ystävien ja kollegoiden kanssa',
    shareDesc: 'Minimalistinen tuottavuusnäkymä kirjanmerkeille, kalenterille, muistiinpanoille, tehtäville ja hyödyllisille työkaluille.',
    shareOn: 'Jaa palvelussa', shareLinkUrl: 'Jaettavan linkin URL', copied: 'Kopioitu!', copyLink: 'Kopioi linkki',
    language: 'Kieli', languageSelection: 'Kielen valinta', closeMenu: 'Sulje valikko', primaryNav: 'Päävalikko',
  },
  Hindi: {
    about: 'हमारे बारे में', privacy: 'गोपनीयता नीति', terms: 'सेवा की शर्तें', contact: 'संपर्क करें',
    share: 'साझा करें', shareTitle: 'GeekTabs साझा करें', shareHeading: 'हमें साझा करें',
    shareSubtitle: 'मित्रों और सहकर्मियों के साथ GeekTabs साझा करें',
    shareDesc: 'बुकमार्क, कैलेंडर, नोट्स, टू-डू और दैनिक उपयोगिताओं के लिए एक सहज उत्पादकता डैशबोर्ड।',
    shareOn: 'साझा करें:', shareLinkUrl: 'शेयर लिंक URL', copied: 'कॉपी हो गया!', copyLink: 'लिंक कॉपी करें',
    language: 'भाषा', languageSelection: 'भाषा चुनें', closeMenu: 'मेनू बंद करें', primaryNav: 'मुख्य नेविगेशन',
  },
  Norwegian: {
    about: 'Om oss', privacy: 'Personvernerklæring', terms: 'Vilkår for bruk', contact: 'Kontakt',
    share: 'Del', shareTitle: 'Del GeekTabs', shareHeading: 'Del oss',
    shareSubtitle: 'Del GeekTabs med venner og kolleger',
    shareDesc: 'Et minimalistisk produktivitetspanel for bokmerker, kalender, notater, gjøremål og nyttige verktøy.',
    shareOn: 'Del på', shareLinkUrl: 'Delingslenke-URL', copied: 'Kopiert!', copyLink: 'Kopier lenke',
    language: 'Språk', languageSelection: 'Språkvalg', closeMenu: 'Lukk meny', primaryNav: 'Hovednavigasjon',
  },
  Thai: {
    about: 'เกี่ยวกับ', privacy: 'นโยบายความเป็นส่วนตัว', terms: 'ข้อกำหนดการใช้งาน', contact: 'ติดต่อเรา',
    share: 'แชร์', shareTitle: 'แชร์ GeekTabs', shareHeading: 'แชร์ต่อ',
    shareSubtitle: 'แชร์ GeekTabs ให้เพื่อนและเพื่อนร่วมงาน',
    shareDesc: 'แดชบอร์ดมินิมอลสำหรับบุ๊กมาร์ก ปฏิทิน บันทึก รายการงาน และเครื่องมือประจำวันพร้อมวอลเปเปอร์สวยๆ',
    shareOn: 'แชร์บน', shareLinkUrl: 'URL ลิงก์สำหรับแชร์', copied: 'คัดลอกแล้ว!', copyLink: 'คัดลอกลิงก์',
    language: 'ภาษา', languageSelection: 'เลือกภาษา', closeMenu: 'ปิดเมนู', primaryNav: 'เมนูหลัก',
  },
  Portuguese: {
    about: 'Sobre', privacy: 'Política de Privacidade', terms: 'Termos de Serviço', contact: 'Contacto',
    share: 'Partilhar', shareTitle: 'Partilhar GeekTabs', shareHeading: 'Partilhe-nos',
    shareSubtitle: 'Partilhe o GeekTabs com amigos e colegas',
    shareDesc: 'Um painel minimalista de produtividade para marcadores, calendário, notas, tarefas e utilitários com fundos imersivos.',
    shareOn: 'Partilhar no', shareLinkUrl: 'URL do link de partilha', copied: 'Copiado!', copyLink: 'Copiar ligação',
    language: 'Idioma', languageSelection: 'Seleção de idioma', closeMenu: 'Fechar menu', primaryNav: 'Navegação principal',
  },
  Vietnamese: {
    about: 'Giới thiệu', privacy: 'Chính sách bảo mật', terms: 'Điều khoản dịch vụ', contact: 'Liên hệ',
    share: 'Chia sẻ', shareTitle: 'Chia sẻ GeekTabs', shareHeading: 'Chia sẻ GeekTabs',
    shareSubtitle: 'Chia sẻ GeekTabs với bạn bè và đồng nghiệp',
    shareDesc: 'Bảng điều khiển tối giản cho dấu trang, lịch, ghi chú, công việc và tiện ích hằng ngày với hình nền sống động.',
    shareOn: 'Chia sẻ qua', shareLinkUrl: 'URL liên kết chia sẻ', copied: 'Đã sao chép!', copyLink: 'Sao chép liên kết',
    language: 'Ngôn ngữ', languageSelection: 'Chọn ngôn ngữ', closeMenu: 'Đóng menu', primaryNav: 'Điều hướng chính',
  },
  Polish: {
    about: 'O nas', privacy: 'Polityka prywatności', terms: 'Regulamin', contact: 'Kontakt',
    share: 'Udostępnij', shareTitle: 'Udostępnij GeekTabs', shareHeading: 'Poleć nas',
    shareSubtitle: 'Udostępnij GeekTabs znajomym i współpracownikom',
    shareDesc: 'Minimalistyczny pulpit produktywności dla zakładek, kalendarza, notatek, zadań i codziennych narzędzi.',
    shareOn: 'Udostępnij w', shareLinkUrl: 'Adres URL do udostępnienia', copied: 'Skopiowano!', copyLink: 'Kopiuj link',
    language: 'Język', languageSelection: 'Wybór języka', closeMenu: 'Zamknij menu', primaryNav: 'Nawigacja główna',
  },
  Danish: {
    about: 'Om os', privacy: 'Privatlivspolitik', terms: 'Servicevilkår', contact: 'Kontakt',
    share: 'Del', shareTitle: 'Del GeekTabs', shareHeading: 'Del os',
    shareSubtitle: 'Del GeekTabs med venner og kolleger',
    shareDesc: 'Et minimalistisk produktivitetsdashboard til bogmærker, kalender, noter, opgaver og hverdags-værktøjer.',
    shareOn: 'Del på', shareLinkUrl: 'Delingslink-URL', copied: 'Kopieret!', copyLink: 'Kopiér link',
    language: 'Sprog', languageSelection: 'Sprogvalg', closeMenu: 'Luk menu', primaryNav: 'Hovednavigation',
  },
  Turkish: {
    about: 'Hakkında', privacy: 'Gizlilik Politikası', terms: 'Kullanım Şartları', contact: 'İletişim',
    share: 'Paylaş', shareTitle: 'GeekTabs’ı Paylaş', shareHeading: 'Bizi Paylaş',
    shareSubtitle: 'GeekTabs’ı arkadaşlarınız ve iş arkadaşlarınızla paylaşın',
    shareDesc: 'Yer imleri, takvim, notlar, yapılacaklar ve günlük araçlar için sade bir üretkenlik panosu.',
    shareOn: 'Paylaş:', shareLinkUrl: 'Paylaşım bağlantısı URL’si', copied: 'Kopyalandı!', copyLink: 'Bağlantıyı Kopyala',
    language: 'Dil', languageSelection: 'Dil seçimi', closeMenu: 'Menüyü kapat', primaryNav: 'Ana gezinme',
  },
  Greek: {
    about: 'Σχετικά', privacy: 'Πολιτική Απορρήτου', terms: 'Όροι Χρήσης', contact: 'Επικοινωνία',
    share: 'Κοινοποίηση', shareTitle: 'Κοινοποίηση GeekTabs', shareHeading: 'Μοιραστείτε μας',
    shareSubtitle: 'Μοιραστείτε το GeekTabs με φίλους και συναδέλφους',
    shareDesc: 'Ένας μινιμαλιστικός πίνακας παραγωγικότητας για σελιδοδείκτες, ημερολόγιο, σημειώσεις, εργασίες και καθημερινά εργαλεία.',
    shareOn: 'Κοινοποίηση στο', shareLinkUrl: 'Διεύθυνση URL κοινοποίησης', copied: 'Αντιγράφηκε!', copyLink: 'Αντιγραφή συνδέσμου',
    language: 'Γλώσσα', languageSelection: 'Επιλογή γλώσσας', closeMenu: 'Κλείσιμο μενού', primaryNav: 'Κύρια πλοήγηση',
  },
};

export default function Dock({ activeTab, setActiveTab, currentTheme, setTheme, isDarkMode, language, setLanguage }: DockProps) {
  const dt = DOCK_T[language] || DOCK_T.English;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);

  const rawOrigin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://geektabs.com';
  const isPrivateDevPreview =
    typeof window !== 'undefined' && /^ais-dev-/i.test(window.location.hostname);
  const defaultShareUrl = isPrivateDevPreview
    ? rawOrigin.replace(/^https?:\/\/ais-dev-/i, 'https://ais-pre-')
    : rawOrigin;
  const [customShareUrl, setCustomShareUrl] = useState(defaultShareUrl);
  const shareUrl = (customShareUrl || defaultShareUrl).trim();
  const shareTitle = 'GeekTabs';
  const shareDescription = dt.shareDesc;
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedShareText = encodeURIComponent(`${shareTitle} — ${shareDescription}`);

  const sharePlatforms = [
    {
      id: 'facebook',
      name: 'Meta (Facebook)',
      bgColor: '#1877F2',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}&quote=${encodedShareText}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="#ffffff" aria-hidden="true">
          <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z" />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      bgColor: '#0A66C2',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#ffffff" aria-hidden="true">
          <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.39 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.35 7.5 7.25 6.6 7.25 5.5C7.25 4.39 6.35 3.5 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.22 16.16 8.22C14.37 8.22 13.48 9.2 13.02 9.93V8.5H9.65C9.7 9.48 9.65 19.5 9.65 19.5H13.02V13.36C13.02 13.02 13.05 12.69 13.15 12.45C13.42 11.78 14.03 11.09 15.07 11.09C16.41 11.09 17.06 12.11 17.06 13.6V19.5H20.44V13.02Z" />
        </svg>
      ),
    },
    {
      id: 'x',
      name: 'X',
      bgColor: '#000000',
      href: `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareText}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-[19px] h-[19px]" fill="#ffffff" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: 'reddit',
      name: 'Reddit',
      bgColor: '#FF4500',
      href: `https://www.reddit.com/submit?url=${encodedShareUrl}&title=${encodedShareText}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-[23px] h-[23px]" fill="#ffffff" aria-hidden="true">
          <path d="M12 2.5C6.75 2.5 2.5 6.75 2.5 12c0 2.02.63 3.9 1.71 5.44L2.95 20.6a.45.45 0 0 0 .58.58l3.18-1.24A9.45 9.45 0 0 0 12 21.5c5.25 0 9.5-4.25 9.5-9.5S17.25 2.5 12 2.5zm5.62 10.65a1.5 1.5 0 0 1-.44 1.07c-.09.94-.64 1.78-1.56 2.4a6.8 6.8 0 0 1-3.62.98 6.8 6.8 0 0 1-3.62-.98c-.92-.62-1.47-1.46-1.56-2.4a1.5 1.5 0 0 1-.44-1.07 1.48 1.48 0 0 1 2.29-1.24 6.38 6.38 0 0 1 2.94-.84l.5-2.36a.32.32 0 0 1 .39-.25l1.66.35a1.06 1.06 0 1 1-.13.65l-1.41-.29-.42 1.98a6.35 6.35 0 0 1 2.89.84 1.48 1.48 0 0 1 2.15 1.24zm-8.01-.1a1.06 1.06 0 1 0 1.06 1.06 1.06 1.06 0 0 0-1.06-1.06zm4.78 0a1.06 1.06 0 1 0 1.06 1.06 1.06 1.06 0 0 0-1.06-1.06zm-4.18 2.71a.32.32 0 0 0 0 .46 2.76 2.76 0 0 0 3.58 0 .32.32 0 1 0-.46-.46 2.12 2.12 0 0 1-2.66 0 .32.32 0 0 0-.46 0z" />
        </svg>
      ),
    },
    {
      id: 'substack',
      name: 'Substack',
      bgColor: '#FF6719',
      href: `https://substack.com/notes?text=${encodeURIComponent(`${shareTitle} — ${shareDescription} ${shareUrl}`)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="#ffffff" aria-hidden="true">
          <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
        </svg>
      ),
    },
  ];

  const handleCopyShareLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const ta = document.createElement('textarea');
        ta.value = shareUrl;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedShareLink(true);
      window.setTimeout(() => setCopiedShareLink(false), 1800);
    } catch {
      // Clipboard blocked
    }
  };

  const allItems = [...NAV_ITEMS, SETTINGS_ITEM];
  const matchedNavItem = allItems.find((item) => item.key === activeTab);
  const currentItem = matchedNavItem || NAV_ITEMS[0];
  const CurrentIcon = currentItem.icon;
  const LEGAL_TAB_LABELS: Record<string, string> = {
    about: dt.about,
    privacy: dt.privacy,
    terms: dt.terms,
    contact: dt.contact,
  };
  const currentPageLabel = matchedNavItem
    ? t(language, matchedNavItem.labelKey)
    : LEGAL_TAB_LABELS[activeTab] || t(language, NAV_ITEMS[0].labelKey);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsLangOpen(false);
        setIsShareOpen(false);
      }
    };
    if (isMenuOpen || isLangOpen || isShareOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, isLangOpen, isShareOpen]);

  // Close language & share dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setIsShareOpen(false);
      }
    };
    if (isLangOpen || isShareOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangOpen, isShareOpen]);

  return (
    <>
      {/* Universal Top Menu Bar */}
      <header
        className={`top-menu-bar isolate fixed top-0 left-0 right-0 z-[60] flex flex-row items-center justify-center border-b backdrop-blur-xl shadow-xs transition-colors duration-200 [text-shadow:none] ${
          isDarkMode
            ? 'bg-slate-900/90 border-white/10 text-white'
            : 'bg-white/90 border-black/10 text-slate-900'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between relative">
          {/* Logo / Brand Indicator (left side corner) */}
          <a
            id="brand-logo-button"
            href="/"
            className="flex items-center gap-2 cursor-pointer select-none [text-shadow:none] z-10 shrink-0"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('home');
              setIsMenuOpen(false);
            }}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#5438dc] to-[#6d4aff] flex items-center justify-center shadow-xs shrink-0 [text-shadow:none]">
              <span
                className="text-white font-extrabold text-xs antialiased leading-none [text-shadow:none]"
                style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
              >
                G
              </span>
            </div>
            <span
              className={`font-bold tracking-tight text-sm [text-shadow:none] ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              GeekTabs
            </span>
          </a>

          {/* Desktop Nav Items (centered horizontally in navbar on screens >= xl) */}
          <nav
            aria-label={dt.primaryNav}
            className="hidden xl:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10"
          >
            <div className="flex flex-row items-center gap-1.5 py-1 px-2">
              {NAV_ITEMS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <DockItem
                    key={item.key}
                    href={NAV_HREF[item.key] || '/'}
                    icon={<IconComponent size={16} />}
                    label={t(language, item.labelKey)}
                    active={activeTab === item.key}
                    onClick={() => setActiveTab(item.key)}
                    isDarkMode={isDarkMode}
                  />
                );
              })}

              <div
                className={`w-[1px] h-4 mx-1 flex-shrink-0 ${
                  isDarkMode ? 'bg-white/15' : 'bg-black/10'
                }`}
              />

              <DockItem
                href={NAV_HREF.settings}
                icon={<Settings size={16} />}
                label={t(language, 'settings')}
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
                isDarkMode={isDarkMode}
              />
            </div>
          </nav>

          {/* Right Controls: Compact PWA Install button + Mobile/Tablet Menu Trigger + Global Language Dropdown */}
          <div className="flex items-center gap-2 relative ml-auto z-10 shrink-0">
            <PWAInstallButton variant="compact" isDarkMode={isDarkMode} language={language} />
            <div className="xl:hidden">
            <button
              id="mobile-tablet-menu-trigger"
              onClick={() => {
                setIsLangOpen(false);
                setIsShareOpen(false);
                setIsMenuOpen((prev) => !prev);
              }}
              className={`flex items-center gap-2 h-9 min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-xs active:scale-95 select-none ${
                isMenuOpen
                  ? isDarkMode
                    ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300 ring-2 ring-indigo-500/25'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/20'
                  : isDarkMode
                  ? 'bg-slate-800/90 hover:bg-slate-700/80 border-slate-700 text-slate-100'
                  : 'bg-slate-100/90 hover:bg-slate-200/80 border-slate-200/90 text-slate-800'
              }`}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              aria-label={`${t(language, 'menu')} (${currentPageLabel})`}
            >
              <div className="hidden sm:flex items-center gap-1.5">
                <span className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}>
                  <CurrentIcon size={16} />
                </span>
                <span
                  className={`font-semibold max-w-[120px] sm:max-w-[180px] truncate ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {currentPageLabel}
                </span>
              </div>
              <div
                className={`hidden sm:block w-px h-3.5 mx-0.5 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                }`}
              />
              <div
                className={`flex items-center gap-1 ${
                  isDarkMode ? 'text-slate-300 sm:text-slate-400' : 'text-slate-600 sm:text-slate-500'
                }`}
              >
                <Menu size={16} />
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    isMenuOpen
                      ? `rotate-180 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`
                      : ''
                  }`}
                />
              </div>
            </button>
            </div>

            {/* Share Dropdown Button (Left of Language Button) */}
            <div className="relative" ref={shareRef}>
              <button
                id="global-share-button"
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsLangOpen(false);
                  setIsShareOpen((prev) => !prev);
                }}
                title={dt.shareTitle}
                aria-label={dt.share}
                aria-expanded={isShareOpen}
                aria-haspopup="dialog"
                className={`flex items-center gap-1.5 h-9 min-h-[36px] px-2.5 sm:px-3 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-95 select-none ${
                  isShareOpen
                    ? isDarkMode
                      ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300 ring-2 ring-indigo-500/25'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/20'
                    : isDarkMode
                    ? 'bg-slate-800/90 hover:bg-slate-700/80 border-slate-700 text-slate-100'
                    : 'bg-slate-100/90 hover:bg-slate-200/80 border-slate-200/90 text-slate-800'
                }`}
              >
                <Share2
                  size={16}
                  className={isShareOpen ? (isDarkMode ? 'text-indigo-400' : 'text-indigo-600') : ''}
                />
                <span className="hidden 2xl:inline">{dt.share}</span>
              </button>

              <AnimatePresence>
                {isShareOpen && (
                  <motion.div
                    id="global-share-dropdown"
                    role="dialog"
                    aria-label={dt.shareTitle}
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className={`fixed right-4 top-16 sm:absolute sm:right-0 sm:top-full sm:mt-2 w-[330px] sm:w-[365px] max-w-[calc(100vw-2rem)] rounded-2xl border shadow-2xl p-5 z-50 ${
                      isDarkMode
                        ? 'bg-slate-900 border-slate-700 text-white shadow-black/60'
                        : 'bg-white border-slate-200 text-slate-900 shadow-slate-900/15'
                    }`}
                  >
                    <div className="mb-3.5">
                      <h3
                        className={`text-lg font-black tracking-tight leading-snug ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {dt.shareHeading}
                      </h3>
                      <p
                        className={`text-xs font-normal mt-0.5 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {dt.shareSubtitle}
                      </p>
                    </div>

                    {/* Social Share Preview Card (Default G Logo + Default Home Background + Brief Description) */}
                    <div className="relative rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 mb-4 shadow-xs select-none">
                      <img
                        src="/assets/aistudio/Gemini_Generated_Image_earth_8ba148bc.jpg"
                        alt="GeekTabs"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(105deg, rgba(7, 17, 36, 0.88) 0%, rgba(10, 23, 48, 0.78) 65%, rgba(7, 17, 36, 0.45) 100%)',
                        }}
                      />
                      <div className="relative z-10 p-3.5 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5438dc] to-[#6d4aff] flex items-center justify-center shadow-md shrink-0">
                          <span
                            className="font-extrabold text-base leading-none"
                            style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                          >
                            G
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div
                            className="text-sm font-bold leading-tight tracking-tight"
                            style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                          >
                            GeekTabs
                          </div>
                          <p
                            className="text-[11px] leading-relaxed mt-1"
                            style={{ color: '#e2e8f0', WebkitTextFillColor: '#e2e8f0' }}
                          >
                            {dt.shareDesc}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2.5 mb-5">
                      {sharePlatforms.map((platform) => (
                        <a
                          key={platform.id}
                          href={platform.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsShareOpen(false)}
                          title={`${dt.shareOn} ${platform.name}`}
                          aria-label={`${dt.shareOn} ${platform.name}`}
                          style={{ backgroundColor: platform.bgColor }}
                          className={`w-11 h-11 rounded-full hover:scale-105 hover:brightness-110 transition-all flex items-center justify-center shadow-sm shrink-0 cursor-pointer ${
                            platform.id === 'x' && isDarkMode ? 'ring-1 ring-white/20' : ''
                          }`}
                        >
                          {platform.icon}
                        </a>
                      ))}
                    </div>

                    <div
                      className={`flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl border ${
                        isDarkMode
                          ? 'bg-slate-800/80 border-slate-700'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <input
                        type="url"
                        value={customShareUrl}
                        onChange={(e) => setCustomShareUrl(e.target.value)}
                        aria-label={dt.shareLinkUrl}
                        className={`flex-1 min-w-0 bg-transparent text-xs sm:text-sm font-medium outline-none ${
                          isDarkMode ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleCopyShareLink}
                        className="text-xs sm:text-sm font-bold text-[#0284c7] hover:text-[#0369a1] dark:text-sky-400 dark:hover:text-sky-300 shrink-0 cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        {copiedShareLink ? (
                          <>
                            <Check size={13} />
                            <span>{dt.copied}</span>
                          </>
                        ) : (
                          <span>{dt.copyLink}</span>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Global Language Dropdown Button (Very Right Side) */}
            <div className="relative" ref={langRef}>
              {(() => {
                const selectedOpt = LANGUAGE_OPTIONS.find((o) => o.value === language) || LANGUAGE_OPTIONS[0];
                const displayBadge = selectedOpt.nativeLabel || selectedOpt.label;
                return (
                  <button
                    id="global-language-button"
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsShareOpen(false);
                      setIsLangOpen((prev) => !prev);
                    }}
                    title={selectedOpt.nativeLabel ? `${selectedOpt.nativeLabel} (${selectedOpt.label})` : selectedOpt.label}
                    aria-label={dt.language}
                    aria-expanded={isLangOpen}
                    aria-haspopup="listbox"
                    className={`flex items-center gap-1.5 h-9 min-h-[36px] px-2.5 sm:px-3 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-95 select-none ${
                      isLangOpen
                        ? isDarkMode
                          ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300 ring-2 ring-indigo-500/25'
                          : 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/20'
                        : isDarkMode
                        ? 'bg-slate-800/90 hover:bg-slate-700/80 border-slate-700 text-slate-100'
                        : 'bg-slate-100/90 hover:bg-slate-200/80 border-slate-200/90 text-slate-800'
                    }`}
                  >
                    <Globe
                      size={16}
                      className={isLangOpen ? (isDarkMode ? 'text-indigo-400' : 'text-indigo-600') : ''}
                    />
                    <span className="hidden 2xl:inline max-w-[130px] truncate">{displayBadge}</span>
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${
                        isLangOpen ? 'rotate-180' : 'opacity-70'
                      }`}
                    />
                  </button>
                );
              })()}

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    id="global-language-dropdown"
                    role="listbox"
                    aria-label={dt.languageSelection}
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className={`absolute right-0 top-full mt-2 w-60 max-h-80 overflow-y-auto rounded-2xl border shadow-2xl p-1.5 z-50 scrollbar-thin ${
                      isDarkMode
                        ? 'bg-slate-900/98 border-slate-700 text-slate-100 shadow-black/60'
                        : 'bg-white/98 border-slate-200 text-slate-800 shadow-slate-900/15'
                    }`}
                  >
                    {LANGUAGE_OPTIONS.map((opt) => {
                      const isSelected = language === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setLanguage(opt.value);
                            setIsLangOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer text-left ${
                            isSelected
                              ? 'bg-indigo-500 text-white'
                              : isDarkMode
                              ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
                              : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950'
                          }`}
                          style={isSelected ? { color: '#ffffff' } : undefined}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className={`truncate text-sm leading-tight ${isSelected ? 'font-bold' : 'font-semibold'}`}>
                              {opt.nativeLabel || opt.label}
                            </span>
                            {opt.nativeLabel && (
                              <span
                                className={`truncate text-[11px] font-medium leading-tight mt-0.5 ${
                                  isSelected
                                    ? 'text-white/85'
                                    : isDarkMode
                                    ? 'text-slate-400'
                                    : 'text-slate-500'
                                }`}
                                style={isSelected ? { color: 'rgba(255,255,255,0.85)' } : undefined}
                              >
                                {opt.label}
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <Check
                              size={15}
                              className="text-white shrink-0 ml-2"
                              style={{ color: '#ffffff', stroke: '#ffffff' }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile & Tablet Popup Menu List */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop Overlay for one-click dismiss */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-[2px] xl:hidden"
                  onClick={() => setIsMenuOpen(false)}
                />

                {/* Pop up menu card */}
                <motion.div
                  ref={menuRef}
                  id="mobile-tablet-menu-popup"
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className={`absolute right-4 sm:right-6 top-14 mt-1.5 w-[300px] sm:w-80 max-w-[calc(100vw-2rem)] rounded-2xl border shadow-2xl p-2 z-50 max-h-[calc(100dvh-4.75rem)] sm:max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin xl:hidden [text-shadow:none] ${
                    isDarkMode
                      ? 'bg-slate-900/98 border-slate-700 text-white shadow-black/60'
                      : 'bg-white/98 border-slate-200/90 text-slate-900 shadow-slate-900/15'
                  }`}
                >
                  {/* Menu List Header */}
                  <div
                    className={`flex items-center justify-between gap-2 px-3 py-1.5 sm:py-2 mb-1 border-b ${
                      isDarkMode ? 'border-slate-800' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Menu
                        size={15}
                        className={`shrink-0 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
                      />
                      <span
                        className={`text-xs font-bold uppercase tracking-wider shrink-0 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {t(language, 'menu')}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold truncate ${
                          isDarkMode
                            ? 'bg-indigo-950/90 text-indigo-300 border border-indigo-500/30'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
                        }`}
                      >
                        <CurrentIcon size={11} className="shrink-0" />
                        <span className="truncate">{currentPageLabel}</span>
                      </span>
                    </div>
                    <button
                      id="mobile-menu-close-button"
                      onClick={() => setIsMenuOpen(false)}
                      className={`p-1.5 sm:p-2 min-w-[36px] min-h-[36px] sm:min-w-[38px] sm:min-h-[38px] flex items-center justify-center rounded-lg transition-colors cursor-pointer shrink-0 ${
                        isDarkMode
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      aria-label={dt.closeMenu}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Nav Items List */}
                  <div className="space-y-0.5">
                    {NAV_ITEMS.map((item) => {
                      const isActive = activeTab === item.key;
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.key}
                          id={`menu-item-${item.key}`}
                          onClick={() => {
                            setActiveTab(item.key);
                            setIsMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 sm:py-3 rounded-xl text-[14.5px] sm:text-sm font-medium transition-all text-left cursor-pointer group select-none ${
                            isActive
                              ? isDarkMode
                                ? 'bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-semibold shadow-xs'
                                : 'bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-semibold shadow-xs'
                              : isDarkMode
                              ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white active:bg-slate-700/80'
                              : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-950 active:bg-slate-200/70'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                                isActive
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : isDarkMode
                                  ? 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900'
                              }`}
                            >
                              <IconComponent size={16} />
                            </div>
                            <span className="truncate">{t(language, item.labelKey)}</span>
                          </div>
                          {isActive && (
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                isDarkMode
                                  ? 'bg-indigo-900/80 text-indigo-300'
                                  : 'bg-indigo-100 text-indigo-600'
                              }`}
                            >
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div
                    className={`my-1.5 border-t ${
                      isDarkMode ? 'border-slate-800' : 'border-slate-100'
                    }`}
                  />

                  {/* Settings Item */}
                  <button
                    id="menu-item-settings"
                    onClick={() => {
                      setActiveTab('settings');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 sm:py-3 rounded-xl text-[14.5px] sm:text-sm font-medium transition-all text-left cursor-pointer group select-none ${
                      activeTab === 'settings'
                        ? isDarkMode
                          ? 'bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-semibold shadow-xs'
                          : 'bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-semibold shadow-xs'
                        : isDarkMode
                        ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white active:bg-slate-700/80'
                        : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-950 active:bg-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          activeTab === 'settings'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : isDarkMode
                            ? 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900'
                        }`}
                      >
                        <Settings size={16} />
                      </div>
                      <span className="truncate">{t(language, 'settings')}</span>
                    </div>
                    {activeTab === 'settings' && (
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isDarkMode
                            ? 'bg-indigo-900/80 text-indigo-300'
                            : 'bg-indigo-100 text-indigo-600'
                        }`}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}

function DockItem({
  href,
  icon,
  label,
  active,
  onClick,
  isDarkMode,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  isDarkMode?: boolean;
}) {
  const activeColorClass = 'text-indigo-600 font-semibold';
  const inactiveColorClass = isDarkMode
    ? 'text-slate-300 hover:text-white hover:bg-white/10'
    : 'text-slate-600 hover:text-slate-900 hover:bg-black/5';

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      aria-current={active ? 'page' : undefined}
      className={`relative px-3 py-1.5 rounded-full text-xs transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap outline-none shrink-0 cursor-pointer ${
        active ? activeColorClass : inactiveColorClass
      }`}
    >
      {active && (
        <motion.div
          layoutId="active-dock-pill"
          className="absolute inset-0 rounded-full -z-10 bg-indigo-500/15 border border-indigo-500/20"
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        />
      )}
      <div className="flex items-center justify-center shrink-0">{icon}</div>
      <span className="font-medium tracking-tight">{label}</span>
    </a>
  );
}
