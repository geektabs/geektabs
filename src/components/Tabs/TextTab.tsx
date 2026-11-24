import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Type, Check, RotateCcw, Eye, Sparkles } from 'lucide-react';
import { WALLPAPERS, SOLIDS_MAP, GRADIENTS_MAP } from '../Wallpaper/Wallpaper';
import { t } from '../../i18n';

interface TextTabProps {
  textColor: string;
  setTextColor: (color: string) => void;
  currentTheme: string;
  isDarkMode: boolean;
  language?: string;
  cardBgMode?: 'white' | 'dark' | 'dark-glass';
}

const TEXT_T: Record<string, Record<string, string>> = {
  English: {
    title: 'Text Color Engine',
    subtitle: 'CUSTOM PAGE TEXT COLOR CONFIGURATION',
    panelHeader: 'Text Color Palette Presets',
    panelSub: 'select a text color to match your background or wallpaper',
    resetButton: 'Reset Text Color to Default',
    groupDefault: 'default (auto)',
    groupLight: 'light tones',
    groupRegular: 'regular tones',
    groupDark: 'dark tones',
    groupVibrant: 'vibrant & contrast',
    previewTitle: '# Live Page Vision Preview',
    previewSub: 'Visual test on current background & wallpaper',
    customColorTitle: 'Custom Hex Color',
    customColorApply: 'Apply Color',
    sampleGreeting: 'Good Morning, GeekTabs',
    sampleDate: 'Thursday, September 10',
    sampleClock: '08:45'
  },
  Chinese: {
    title: '文本颜色引擎',
    subtitle: '自定义页面文本颜色配置',
    panelHeader: '文本调色板预设',
    panelSub: '选择适合背景或壁纸的文本颜色',
    resetButton: '恢复默认文本颜色',
    groupDefault: '默认 (自动)',
    groupLight: '浅色色调',
    groupRegular: '常规色调',
    groupDark: '深色色调',
    groupVibrant: '鲜艳高对比色调',
    previewTitle: '# 实时页面视觉预览',
    previewSub: '在当前背景与壁纸上的效果展示',
    customColorTitle: '自定义 Hex 颜色',
    customColorApply: '应用颜色',
    sampleGreeting: '早上好，GeekTabs',
    sampleDate: '星期四，9月10日',
    sampleClock: '08:45'
  },
  'Chinese Traditional': {
    title: '文字顏色引擎',
    subtitle: '自訂頁面文字顏色設定',
    panelHeader: '文字調色盤預設',
    panelSub: '選擇適合背景或桌布的文字顏色',
    resetButton: '恢復預設文字顏色',
    groupDefault: '預設 (自動)',
    groupLight: '淺色色調',
    groupRegular: '常規色調',
    groupDark: '深色色調',
    groupVibrant: '鮮豔高對比色調',
    previewTitle: '# 即時頁面視覺預覽',
    previewSub: '在目前背景與桌布上的效果展示',
    customColorTitle: '自訂 Hex 顏色',
    customColorApply: '套用顏色',
    sampleGreeting: '早安，GeekTabs',
    sampleDate: '星期四，9月10日',
    sampleClock: '08:45'
  },
  Spanish: {
    title: 'Motor de Color de Texto',
    subtitle: 'CONFIGURACIÓN DE COLOR DE TEXTO PERSONALIZADA',
    panelHeader: 'Ajustes de Paleta de Color de Texto',
    panelSub: 'selecciona un color de texto que coincida con tu fondo o fondo de pantalla',
    resetButton: 'Restablecer Color de Texto por Defecto',
    groupDefault: 'por defecto (auto)',
    groupLight: 'tonos claros',
    groupRegular: 'tonos regulares',
    groupDark: 'tonos oscuros',
    groupVibrant: 'tonos vibrantes',
    previewTitle: '# Vista Previa Visual en Vivo',
    previewSub: 'Prueba visual en el fondo actual',
    customColorTitle: 'Color Hex Personalizado',
    customColorApply: 'Aplicar Color',
    sampleGreeting: 'Buenos Días, GeekTabs',
    sampleDate: 'Jueves, 10 de Septiembre',
    sampleClock: '08:45'
  },
  French: {
    title: 'Moteur de Couleur du Texte',
    subtitle: 'CONFIGURATION PERSONNALISÉE DU TEXTE',
    panelHeader: 'Palettes de Couleurs de Texte',
    panelSub: 'sélectionnez une couleur de texte adaptée à votre fond ou fond d\'écran',
    resetButton: 'Réinitialiser la Couleur du Texte',
    groupDefault: 'par défaut (auto)',
    groupLight: 'tons clairs',
    groupRegular: 'tons réguliers',
    groupDark: 'tons sombres',
    groupVibrant: 'tons vifs',
    previewTitle: '# Aperçu Visuel en Direct',
    previewSub: 'Test visuel sur l\'arrière-plan actuel',
    customColorTitle: 'Couleur Hex Personnalisée',
    customColorApply: 'Appliquer',
    sampleGreeting: 'Bonjour, GeekTabs',
    sampleDate: 'Jeudi 10 Septembre',
    sampleClock: '08:45'
  },
  German: {
    title: 'Textfarbe-Engine',
    subtitle: 'BENUTZERDEFINIERTE TEXTFARBKONFIGURATION',
    panelHeader: 'Textfarben-Voreinstellungen',
    panelSub: 'Wählen Sie eine Textfarbe passend zu Ihrem Hintergrund oder Wallpaper',
    resetButton: 'Textfarbe auf Standard zurücksetzen',
    groupDefault: 'Standard (Auto)',
    groupLight: 'Helle Töne',
    groupRegular: 'Normale Töne',
    groupDark: 'Dunkle Töne',
    groupVibrant: 'Lebendige Töne',
    previewTitle: '# Live-Vorschau',
    previewSub: 'Visueller Test auf aktuellem Hintergrund',
    customColorTitle: 'Benutzerdefinierte Hex-Farbe',
    customColorApply: 'Anwenden',
    sampleGreeting: 'Guten Morgen, GeekTabs',
    sampleDate: 'Donnerstag, 10. September',
    sampleClock: '08:45'
  },
  Japanese: {
    title: 'テキストカラーエンジン',
    subtitle: 'カスタムページテキストカラー設定',
    panelHeader: 'テキストカラーパレットプリセット',
    panelSub: '背景や壁紙に最適なテキストカラーを選択してください',
    resetButton: 'テキストカラーをデフォルトに戻す',
    groupDefault: 'デフォルト (自動)',
    groupLight: 'ライトトーン',
    groupRegular: 'レギュラートーン',
    groupDark: 'ダークトーン',
    groupVibrant: 'ビビッドトーン',
    previewTitle: '# ライブ視覚プレビュー',
    previewSub: '現在の背景と壁紙での視覚テスト',
    customColorTitle: 'カスタム Hex カラー',
    customColorApply: '適用',
    sampleGreeting: 'おはようございます、GeekTabs',
    sampleDate: '9月10日 木曜日',
    sampleClock: '08:45'
  },
  Korean: {
    title: '텍스트 색상 엔진',
    subtitle: '사용자 정의 페이지 텍스트 색상 구성',
    panelHeader: '텍스트 색상 팔레트 프리셋',
    panelSub: '배경이나 배경화면에 어울리는 텍스트 색상을 선택하세요',
    resetButton: '텍스트 색상을 기본값으로 리셋',
    groupDefault: '기본 (자동)',
    groupLight: '밝은 톤',
    groupRegular: '일반 톤',
    groupDark: '어두운 톤',
    groupVibrant: '선명한 톤',
    previewTitle: '# 실시간 페이지 비전 미리보기',
    previewSub: '현재 배경 및 배경화면에서의 시각적 테스트',
    customColorTitle: '사용자 지정 Hex 색상',
    customColorApply: '색상 적용',
    sampleGreeting: '좋은 아침입니다, GeekTabs',
    sampleDate: '9월 10일 목요일',
    sampleClock: '08:45'
  },
  Italian: {
    title: 'Motore Colore Testo',
    subtitle: 'CONFIGURAZIONE COLORE DEL TESTO',
    panelHeader: 'Tavolozze di Colori del Testo',
    panelSub: 'seleziona un colore del testo per il tuo sfondo o wallpaper',
    resetButton: 'Ripristina Colore del Testo Predefinito',
    groupDefault: 'predefinito (auto)',
    groupLight: 'toni chiari',
    groupRegular: 'toni regolari',
    groupDark: 'toni scuri',
    groupVibrant: 'toni brillanti',
    previewTitle: '# Anteprima Visiva in Tempo Reale',
    previewSub: 'Test visivo sullo sfondo corrente',
    customColorTitle: 'Colore Hex Personalizzato',
    customColorApply: 'Applica Colore',
    sampleGreeting: 'Buongiorno, GeekTabs',
    sampleDate: 'Giovedì 10 Settembre',
    sampleClock: '08:45'
  },
  Russian: {
    title: 'Движок цвета текста',
    subtitle: 'НАСТРОЙКА ЦВЕТА ТЕКСТА СТРАНИЦЫ',
    panelHeader: 'Пресеты цвета текста',
    panelSub: 'выберите цвет текста для идеального сочетания с фоном или обоями',
    resetButton: 'Сбросить цвет текста по умолчанию',
    groupDefault: 'по умолчанию (авто)',
    groupLight: 'светлые тона',
    groupRegular: 'обычные тона',
    groupDark: 'темные тона',
    groupVibrant: 'яркие тона',
    previewTitle: '# Живой предпросмотр',
    previewSub: 'Визуальный тест на текущем фоне и обоях',
    customColorTitle: 'Пользовательский Hex-цвет',
    customColorApply: 'Применить',
    sampleGreeting: 'Доброе утро, GeekTabs',
    sampleDate: 'Четверг, 10 сентября',
    sampleClock: '08:45'
  },
  Luxembourgish: {
    title: 'Textfaarf-Engine',
    subtitle: 'Eegen Textfaarf Astellungen',
    panelHeader: 'Textfaarf-Voreinstellungen',
    panelSub: 'Wielt eng Textfaarf passend zu Ärem Hannergrond oder Wallpaper',
    resetButton: 'Textfaarf op Standard zrécksetzen',
    groupDefault: 'Standard (Auto)',
    groupLight: 'Hell Téin',
    groupRegular: 'Normal Téin',
    groupDark: 'Däischter Téin',
    groupVibrant: 'Lieweg Téin',
    previewTitle: '# Live Virschau',
    previewSub: 'Visuellen Test um aktuellen Hannergrond',
    customColorTitle: 'Eegen Hex-Faarf',
    customColorApply: 'Uwenden',
    sampleGreeting: 'Gudde Moien, GeekTabs',
    sampleDate: 'Donneschdeg, 10. September',
    sampleClock: '08:45'
  },
  Dutch: {
    title: 'Tekstkleur-Engine',
    subtitle: 'AANGEPASTE TEKSTKLEURCONFIGURATIE',
    panelHeader: 'Tekstkleurpaletten',
    panelSub: 'selecteer een tekstkleur die past bij je achtergrond',
    resetButton: 'Tekstkleur herstellen naar standaard',
    groupDefault: 'standaard (auto)',
    groupLight: 'lichte tinten',
    groupRegular: 'normale tinten',
    groupDark: 'donkere tinten',
    groupVibrant: 'levendig & contrast',
    previewTitle: '# Live Paginavoorbeeld',
    previewSub: 'Visuele test op huidige achtergrond',
    customColorTitle: 'Aangepaste Hex-kleur',
    customColorApply: 'Toepassen',
    sampleGreeting: 'Goedemorgen, GeekTabs',
    sampleDate: 'Donderdag 10 september',
    sampleClock: '08:45'
  },
  Swedish: {
    title: 'Textfärgsmotor',
    subtitle: 'ANPASSAD TEXTFÄRGSKONFIGURATION',
    panelHeader: 'Textfärgspaletter',
    panelSub: 'välj en textfärg som passar din bakgrund',
    resetButton: 'Återställ textfärg till standard',
    groupDefault: 'standard (auto)',
    groupLight: 'ljusa toner',
    groupRegular: 'normala toner',
    groupDark: 'mörka toner',
    groupVibrant: 'starka & kontrast',
    previewTitle: '# Liveförhandsvisning',
    previewSub: 'Visuellt test på aktuell bakgrund',
    customColorTitle: 'Anpassad Hex-färg',
    customColorApply: 'Tillämpa',
    sampleGreeting: 'God morgon, GeekTabs',
    sampleDate: 'Torsdag 10 september',
    sampleClock: '08:45'
  },
  Finnish: {
    title: 'Tekstin Värimoottori',
    subtitle: 'MUKAUTETTU TEKSTIVÄRIN MÄÄRITYS',
    panelHeader: 'Tekstin Väripaletit',
    panelSub: 'valitse taustakuvaasi sopiva tekstin väri',
    resetButton: 'Palauta tekstin oletusväri',
    groupDefault: 'oletus (auto)',
    groupLight: 'vaaleat sävyt',
    groupRegular: 'tavalliset sävyt',
    groupDark: 'tummat sävyt',
    groupVibrant: 'kirkkaat & kontrasti',
    previewTitle: '# Reaaliaikainen Esikatselu',
    previewSub: 'Visuaalinen testi nykyisellä taustalla',
    customColorTitle: 'Mukautettu Hex-väri',
    customColorApply: 'Käytä väriä',
    sampleGreeting: 'Hyvää huomenta, GeekTabs',
    sampleDate: 'Torstai 10. syyskuuta',
    sampleClock: '08:45'
  },
  Hindi: {
    title: 'टेक्स्ट कलर इंजन',
    subtitle: 'कस्टम पेज टेक्स्ट रंग कॉन्फ़िगरेशन',
    panelHeader: 'टेक्स्ट कलर पैलेट प्रीसेट',
    panelSub: 'अपनी पृष्ठभूमि के अनुसार टेक्स्ट रंग चुनें',
    resetButton: 'टेक्स्ट रंग डिफ़ॉल्ट पर रीसेट करें',
    groupDefault: 'डिफ़ॉल्ट (ऑटो)',
    groupLight: 'हल्के शेड्स',
    groupRegular: 'सामान्य शेड्स',
    groupDark: 'गहरे शेड्स',
    groupVibrant: 'चमकीला और कंट्रास्ट',
    previewTitle: '# लाइव पेज पूर्वावलोकन',
    previewSub: 'वर्तमान पृष्ठभूमि पर विज़ुअल परीक्षण',
    customColorTitle: 'कस्टम Hex रंग',
    customColorApply: 'लागू करें',
    sampleGreeting: 'सुप्रभात, GeekTabs',
    sampleDate: 'गुरुवार, 10 सितंबर',
    sampleClock: '08:45'
  },
  Norwegian: {
    title: 'Tekstfargemotor',
    subtitle: 'TILPASSET TEKSTFARGEKONFIGURASJON',
    panelHeader: 'Tekstfargepaletter',
    panelSub: 'velg en tekstfarge som passer bakgrunnen din',
    resetButton: 'Tilbakestill tekstfarge til standard',
    groupDefault: 'standard (auto)',
    groupLight: 'lyse toner',
    groupRegular: 'vanlige toner',
    groupDark: 'mørke toner',
    groupVibrant: 'sterke & kontrast',
    previewTitle: '# Direkte Forhåndsvisning',
    previewSub: 'Visuell test på nåværende bakgrunn',
    customColorTitle: 'Egendefinert Hex-farge',
    customColorApply: 'Bruk farge',
    sampleGreeting: 'God morgen, GeekTabs',
    sampleDate: 'Torsdag 10. september',
    sampleClock: '08:45'
  },
  Thai: {
    title: 'เครื่องมือสีข้อความ',
    subtitle: 'การตั้งค่าสีข้อความหน้าเว็บแบบกำหนดเอง',
    panelHeader: 'ชุดสีข้อความสำเร็จรูป',
    panelSub: 'เลือกสีข้อความให้เข้ากับพื้นหลังหรือวอลเปเปอร์ของคุณ',
    resetButton: 'รีเซ็ตสีข้อความเป็นค่าเริ่มต้น',
    groupDefault: 'ค่าเริ่มต้น (อัตโนมัติ)',
    groupLight: 'โทนอ่อน',
    groupRegular: 'โทนทั่วไป',
    groupDark: 'โทนเข้ม',
    groupVibrant: 'สีสดและคมชัด',
    previewTitle: '# ตัวอย่างหน้าเว็บแบบสด',
    previewSub: 'ทดสอบการมองเห็นบนพื้นหลังปัจจุบัน',
    customColorTitle: 'สี Hex กำหนดเอง',
    customColorApply: 'ใช้สี',
    sampleGreeting: 'สวัสดีตอนเช้า, GeekTabs',
    sampleDate: 'วันพฤหัสบดีที่ 10 กันยายน',
    sampleClock: '08:45'
  },
  Portuguese: {
    title: 'Motor de Texto',
    subtitle: 'CONFIGURAÇÃO DE CORES DE TEXTO PERSONALIZADAS',
    panelHeader: 'Paletas de Cores de Texto',
    panelSub: 'escolha uma cor de texto para combinar com o seu fundo',
    resetButton: 'Repor Cor de Texto Predefinida',
    groupDefault: 'predefinido (auto)',
    groupLight: 'tons claros',
    groupRegular: 'tons regulares',
    groupDark: 'tons escuros',
    groupVibrant: 'vibrantes e contraste',
    previewTitle: '# Pré-visualização em Direto',
    previewSub: 'Teste visual sobre o fundo atual',
    customColorTitle: 'Cor Hex Personalizada',
    customColorApply: 'Aplicar Cor',
    sampleGreeting: 'Bom dia, GeekTabs',
    sampleDate: 'Quinta-feira, 10 de setembro',
    sampleClock: '08:45'
  },
  Vietnamese: {
    title: 'Công cụ chữ',
    subtitle: 'THIẾT LẬP MÀU CHỮ TÙY CHỈNH',
    panelHeader: 'Bảng màu chữ',
    panelSub: 'chọn màu chữ phù hợp với hình nền của bạn',
    resetButton: 'Đặt lại màu chữ mặc định',
    groupDefault: 'mặc định (tự động)',
    groupLight: 'tông sáng',
    groupRegular: 'tông thường',
    groupDark: 'tông tối',
    groupVibrant: 'rực rỡ & tương phản',
    previewTitle: '# Xem trước trực tiếp',
    previewSub: 'Kiểm tra hiển thị trên nền hiện tại',
    customColorTitle: 'Màu Hex tùy chỉnh',
    customColorApply: 'Áp dụng màu',
    sampleGreeting: 'Chào buổi sáng, GeekTabs',
    sampleDate: 'Thứ Năm, 10 tháng 9',
    sampleClock: '08:45'
  },
  Polish: {
    title: 'Silnik Tekstu',
    subtitle: 'USTAWIENIA WŁASNYCH KOLORÓW TEKSTU',
    panelHeader: 'Palety kolorów tekstu',
    panelSub: 'wybierz kolor tekstu pasujący do Twojego tła',
    resetButton: 'Przywróć domyślny kolor tekstu',
    groupDefault: 'domyślny (auto)',
    groupLight: 'jasne odcienie',
    groupRegular: 'zwykłe odcienie',
    groupDark: 'ciemne odcienie',
    groupVibrant: 'żywe i kontrastowe',
    previewTitle: '# Podgląd strony na żywo',
    previewSub: 'Test czytelności na bieżącym tle',
    customColorTitle: 'Własny kolor Hex',
    customColorApply: 'Zastosuj kolor',
    sampleGreeting: 'Dzień dobry, GeekTabs',
    sampleDate: 'Czwartek, 10 września',
    sampleClock: '08:45'
  },
  Danish: {
    title: 'Tekstmotor',
    subtitle: 'BRUGERDEFINEREDE TEKSTFARVER',
    panelHeader: 'Tekstfarvepaletter',
    panelSub: 'vælg en tekstfarve, der passer til din baggrund',
    resetButton: 'Nulstil til standardtekstfarve',
    groupDefault: 'standard (auto)',
    groupLight: 'lyse nuancer',
    groupRegular: 'almindelige nuancer',
    groupDark: 'mørke nuancer',
    groupVibrant: 'stærke og kontrast',
    previewTitle: '# Live-forhåndsvisning',
    previewSub: 'Visuel test over din aktuelle baggrund',
    customColorTitle: 'Brugerdefineret Hex-farve',
    customColorApply: 'Anvend farve',
    sampleGreeting: 'Godmorgen, GeekTabs',
    sampleDate: 'Torsdag d. 10. september',
    sampleClock: '08:45'
  },
  Turkish: {
    title: 'Metin Motoru',
    subtitle: 'ÖZEL METİN RENGİ AYARLARI',
    panelHeader: 'Metin Renk Paletleri',
    panelSub: 'arka planınıza uygun bir metin rengi seçin',
    resetButton: 'Varsayılan Metin Rengine Sıfırla',
    groupDefault: 'varsayılan (otomatik)',
    groupLight: 'açık tonlar',
    groupRegular: 'normal tonlar',
    groupDark: 'koyu tonlar',
    groupVibrant: 'canlı ve kontrastlı',
    previewTitle: '# Canlı Sayfa Önizlemesi',
    previewSub: 'Mevcut arka plan üzerinde görsel test',
    customColorTitle: 'Özel Hex Rengi',
    customColorApply: 'Rengi Uygula',
    sampleGreeting: 'Günaydın, GeekTabs',
    sampleDate: '10 Eylül Perşembe',
    sampleClock: '08:45'
  },
  Greek: {
    title: 'Μηχανή Κειμένου',
    subtitle: 'ΡΥΘΜΙΣΗ ΠΡΟΣΑΡΜΟΣΜΕΝΩΝ ΧΡΩΜΑΤΩΝ ΚΕΙΜΕΝΟΥ',
    panelHeader: 'Παλέτες Χρωμάτων Κειμένου',
    panelSub: 'επιλέξτε ένα χρώμα κειμένου που ταιριάζει με το φόντο σας',
    resetButton: 'Επαναφορά Προεπιλεγμένου Χρώματος Κειμένου',
    groupDefault: 'προεπιλογή (αυτόματο)',
    groupLight: 'ανοιχτές αποχρώσεις',
    groupRegular: 'κανονικές αποχρώσεις',
    groupDark: 'σκούρες αποχρώσεις',
    groupVibrant: 'έντονα & αντίθεση',
    previewTitle: '# Ζωντανή Προεπισκόπηση Σελίδας',
    previewSub: 'Οπτική δοκιμή πάνω στο τρέχον φόντο',
    customColorTitle: 'Προσαρμοσμένο Χρώμα Hex',
    customColorApply: 'Εφαρμογή Χρώματος',
    sampleGreeting: 'Καλημέρα, GeekTabs',
    sampleDate: 'Πέμπτη, 10 Σεπτεμβρίου',
    sampleClock: '08:45'
  }
};

interface TextPreset {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_TEXT_PRESET: TextPreset = {
  id: 'default',
  name: 'Default (#6143f7)',
  color: '#6143f7'
};

const LIGHT_TEXT_PRESETS: TextPreset[] = [
  { id: '#ffffff', name: 'Pure White', color: '#ffffff' },
  { id: '#f8fafc', name: 'Snow White', color: '#f8fafc' },
  { id: '#fffbeb', name: 'Warm Cream', color: '#fffbeb' },
  { id: '#e0f2fe', name: 'Pale Sky', color: '#e0f2fe' },
  { id: '#dcfce7', name: 'Pale Mint', color: '#dcfce7' },
  { id: '#ffe4e6', name: 'Pale Rose', color: '#ffe4e6' },
  { id: '#f3e8ff', name: 'Pale Lavender', color: '#f3e8ff' },
  { id: '#fef9c3', name: 'Pale Lemon', color: '#fef9c3' },
  { id: '#ffedd5', name: 'Pale Peach', color: '#ffedd5' },
  { id: '#cffafe', name: 'Pale Cyan', color: '#cffafe' },
];

const REGULAR_TEXT_PRESETS: TextPreset[] = [
  { id: '#6143f7', name: 'Iris Violet (Default)', color: '#6143f7' },
  { id: '#7c3aed', name: 'Royal Purple', color: '#7c3aed' },
  { id: '#38bdf8', name: 'Sky Blue', color: '#38bdf8' },
  { id: '#3b82f6', name: 'Electric Blue', color: '#3b82f6' },
  { id: '#6366f1', name: 'Royal Indigo', color: '#6366f1' },
  { id: '#a855f7', name: 'Violet Purple', color: '#a855f7' },
  { id: '#ec4899', name: 'Pink Rose', color: '#ec4899' },
  { id: '#f43f5e', name: 'Coral Red', color: '#f43f5e' },
  { id: '#f97316', name: 'Vibrant Orange', color: '#f97316' },
  { id: '#eab308', name: 'Golden Sun', color: '#eab308' },
];

const DARK_TEXT_PRESETS: TextPreset[] = [
  { id: '#000000', name: 'Jet Black', color: '#000000' },
  { id: '#0f172a', name: 'Dark Slate', color: '#0f172a' },
  { id: '#1e293b', name: 'Dark Charcoal', color: '#1e293b' },
  { id: '#172554', name: 'Deep Navy', color: '#172554' },
  { id: '#451a03', name: 'Deep Bronze', color: '#451a03' },
  { id: '#4c0519', name: 'Deep Ruby', color: '#4c0519' },
  { id: '#064e3b', name: 'Deep Forest', color: '#064e3b' },
  { id: '#3b0764', name: 'Deep Violet', color: '#3b0764' },
  { id: '#292524', name: 'Dark Stone', color: '#292524' },
  { id: '#020617', name: 'Midnight', color: '#020617' },
];

const VIBRANT_TEXT_PRESETS: TextPreset[] = [
  { id: '#facc15', name: 'Neon Yellow', color: '#facc15' },
  { id: '#4ade80', name: 'Neon Lime', color: '#4ade80' },
  { id: '#2dd4bf', name: 'Bright Aqua', color: '#2dd4bf' },
  { id: '#67e8f9', name: 'Bright Cyan', color: '#67e8f9' },
  { id: '#c084fc', name: 'Neon Lilac', color: '#c084fc' },
  { id: '#f472b6', name: 'Neon Pink', color: '#f472b6' },
  { id: '#fb7185', name: 'Neon Coral', color: '#fb7185' },
  { id: '#fb923c', name: 'Neon Tangerine', color: '#fb923c' },
  { id: '#93c5fd', name: 'Light Azure', color: '#93c5fd' },
  { id: '#e2e8f0', name: 'Silver Mist', color: '#e2e8f0' },
];

const TEXT_PRESET_NAMES: Record<string, Record<string, string>> = {
  English: {
    default: 'Default (#6143f7)',
    '#ffffff': 'Pure White', '#f8fafc': 'Snow White', '#fffbeb': 'Warm Cream', '#e0f2fe': 'Pale Sky', '#dcfce7': 'Pale Mint', '#ffe4e6': 'Pale Rose', '#f3e8ff': 'Pale Lavender', '#fef9c3': 'Pale Lemon', '#ffedd5': 'Pale Peach', '#cffafe': 'Pale Cyan',
    '#6143f7': 'Iris Violet (Default)', '#7c3aed': 'Royal Purple', '#38bdf8': 'Sky Blue', '#3b82f6': 'Electric Blue', '#6366f1': 'Royal Indigo', '#a855f7': 'Violet Purple', '#ec4899': 'Pink Rose', '#f43f5e': 'Coral Red', '#f97316': 'Vibrant Orange', '#eab308': 'Golden Sun',
    '#000000': 'Jet Black', '#0f172a': 'Dark Slate', '#1e293b': 'Dark Charcoal', '#172554': 'Deep Navy', '#451a03': 'Deep Bronze', '#4c0519': 'Deep Ruby', '#064e3b': 'Deep Forest', '#3b0764': 'Deep Violet', '#292524': 'Dark Stone', '#020617': 'Midnight',
    '#facc15': 'Neon Yellow', '#4ade80': 'Neon Lime', '#2dd4bf': 'Bright Aqua', '#67e8f9': 'Bright Cyan', '#c084fc': 'Neon Lilac', '#f472b6': 'Neon Pink', '#fb7185': 'Neon Coral', '#fb923c': 'Neon Tangerine', '#93c5fd': 'Light Azure', '#e2e8f0': 'Silver Mist',
  },
  Chinese: {
    default: '默认 (#6143f7)',
    '#ffffff': '纯白', '#f8fafc': '雪白', '#fffbeb': '暖奶油色', '#e0f2fe': '淡天蓝', '#dcfce7': '淡薄荷绿', '#ffe4e6': '淡玫瑰粉', '#f3e8ff': '淡薰衣草紫', '#fef9c3': '淡柠檬黄', '#ffedd5': '淡蜜桃橙', '#cffafe': '淡青色',
    '#6143f7': '鸢尾紫（默认）', '#7c3aed': '皇家紫', '#38bdf8': '天蓝色', '#3b82f6': '电光蓝', '#6366f1': '皇家靛蓝', '#a855f7': '紫罗兰紫', '#ec4899': '玫瑰粉', '#f43f5e': '珊瑚红', '#f97316': '亮橙色', '#eab308': '金阳黄',
    '#000000': '墨黑', '#0f172a': '深岩灰', '#1e293b': '深炭灰', '#172554': '深海蓝', '#451a03': '深古铜', '#4c0519': '深红宝石', '#064e3b': '深森林绿', '#3b0764': '深紫罗兰', '#292524': '深石灰', '#020617': '午夜黑',
    '#facc15': '霓虹黄', '#4ade80': '霓虹青柠', '#2dd4bf': '亮水绿', '#67e8f9': '亮青色', '#c084fc': '霓虹丁香紫', '#f472b6': '霓虹粉', '#fb7185': '霓虹珊瑚', '#fb923c': '霓虹橘', '#93c5fd': '浅蔚蓝', '#e2e8f0': '银雾灰',
  },
  'Chinese Traditional': {
    default: '預設 (#6143f7)',
    '#ffffff': '純白', '#f8fafc': '雪白', '#fffbeb': '暖奶油色', '#e0f2fe': '淡天藍', '#dcfce7': '淡薄荷綠', '#ffe4e6': '淡玫瑰粉', '#f3e8ff': '淡薰衣草紫', '#fef9c3': '淡檸檬黃', '#ffedd5': '淡蜜桃橙', '#cffafe': '淡青色',
    '#6143f7': '鳶尾紫（預設）', '#7c3aed': '皇家紫', '#38bdf8': '天藍色', '#3b82f6': '電光藍', '#6366f1': '皇家靛藍', '#a855f7': '紫羅蘭紫', '#ec4899': '玫瑰粉', '#f43f5e': '珊瑚紅', '#f97316': '亮橙色', '#eab308': '金陽黃',
    '#000000': '墨黑', '#0f172a': '深岩灰', '#1e293b': '深炭灰', '#172554': '深海藍', '#451a03': '深古銅', '#4c0519': '深紅寶石', '#064e3b': '深森林綠', '#3b0764': '深紫羅蘭', '#292524': '深石灰', '#020617': '午夜黑',
    '#facc15': '霓虹黃', '#4ade80': '霓虹青檸', '#2dd4bf': '亮水綠', '#67e8f9': '亮青色', '#c084fc': '霓虹丁香紫', '#f472b6': '霓虹粉', '#fb7185': '霓虹珊瑚', '#fb923c': '霓虹橘', '#93c5fd': '淺蔚藍', '#e2e8f0': '銀霧灰',
  },
  Spanish: {
    default: 'Predeterminado (#6143f7)',
    '#ffffff': 'Blanco puro', '#f8fafc': 'Blanco nieve', '#fffbeb': 'Crema cálido', '#e0f2fe': 'Cielo pálido', '#dcfce7': 'Menta pálida', '#ffe4e6': 'Rosa pálido', '#f3e8ff': 'Lavanda pálida', '#fef9c3': 'Limón pálido', '#ffedd5': 'Melocotón pálido', '#cffafe': 'Cian pálido',
    '#6143f7': 'Violeta iris (Predet.)', '#7c3aed': 'Púrpura real', '#38bdf8': 'Azul cielo', '#3b82f6': 'Azul eléctrico', '#6366f1': 'Índigo real', '#a855f7': 'Púrpura violeta', '#ec4899': 'Rosa intenso', '#f43f5e': 'Rojo coral', '#f97316': 'Naranja vibrante', '#eab308': 'Sol dorado',
    '#000000': 'Negro azabache', '#0f172a': 'Pizarra oscuro', '#1e293b': 'Carbón oscuro', '#172554': 'Azul marino oscuro', '#451a03': 'Bronce oscuro', '#4c0519': 'Rubí oscuro', '#064e3b': 'Bosque oscuro', '#3b0764': 'Violeta profundo', '#292524': 'Piedra oscura', '#020617': 'Medianoche',
    '#facc15': 'Amarillo neón', '#4ade80': 'Lima neón', '#2dd4bf': 'Agua brillante', '#67e8f9': 'Cian brillante', '#c084fc': 'Lila neón', '#f472b6': 'Rosa neón', '#fb7185': 'Coral neón', '#fb923c': 'Mandarina neón', '#93c5fd': 'Azur claro', '#e2e8f0': 'Niebla plateada',
  },
  French: {
    default: 'Par défaut (#6143f7)',
    '#ffffff': 'Blanc pur', '#f8fafc': 'Blanc neige', '#fffbeb': 'Crème chaud', '#e0f2fe': 'Ciel pâle', '#dcfce7': 'Menthe pâle', '#ffe4e6': 'Rose pâle', '#f3e8ff': 'Lavande pâle', '#fef9c3': 'Citron pâle', '#ffedd5': 'Pêche pâle', '#cffafe': 'Cyan pâle',
    '#6143f7': 'Violet iris (Défaut)', '#7c3aed': 'Pourpre royal', '#38bdf8': 'Bleu ciel', '#3b82f6': 'Bleu électrique', '#6366f1': 'Indigo royal', '#a855f7': 'Violet pourpre', '#ec4899': 'Rose vif', '#f43f5e': 'Rouge corail', '#f97316': 'Orange vif', '#eab308': 'Soleil doré',
    '#000000': 'Noir jais', '#0f172a': 'Ardoise foncé', '#1e293b': 'Charbon foncé', '#172554': 'Marine profond', '#451a03': 'Bronze profond', '#4c0519': 'Rubis profond', '#064e3b': 'Forêt profonde', '#3b0764': 'Violet profond', '#292524': 'Pierre foncée', '#020617': 'Minuit',
    '#facc15': 'Jaune néon', '#4ade80': 'Citron vert néon', '#2dd4bf': 'Aqua vif', '#67e8f9': 'Cyan vif', '#c084fc': 'Lilas néon', '#f472b6': 'Rose néon', '#fb7185': 'Corail néon', '#fb923c': 'Mandarine néon', '#93c5fd': 'Azur clair', '#e2e8f0': 'Brume argentée',
  },
  German: {
    default: 'Standard (#6143f7)',
    '#ffffff': 'Reinweiß', '#f8fafc': 'Schneeweiß', '#fffbeb': 'Warmcreme', '#e0f2fe': 'Blasshimmel', '#dcfce7': 'Blassminze', '#ffe4e6': 'Blassrosa', '#f3e8ff': 'Blasslavendel', '#fef9c3': 'Blasszitrone', '#ffedd5': 'Blasspfirsich', '#cffafe': 'Blasscyan',
    '#6143f7': 'Irisviolett (Standard)', '#7c3aed': 'Königspurpur', '#38bdf8': 'Himmelblau', '#3b82f6': 'Elektrischblau', '#6366f1': 'Königsindigo', '#a855f7': 'Violettpurpur', '#ec4899': 'Rosarot', '#f43f5e': 'Korallenrot', '#f97316': 'Leuchtorange', '#eab308': 'Goldsonne',
    '#000000': 'Tiefschwarz', '#0f172a': 'Dunkelschiefer', '#1e293b': 'Dunkelanthrazit', '#172554': 'Tiefmarine', '#451a03': 'Tiefbronze', '#4c0519': 'Tiefrubin', '#064e3b': 'Tiefwald', '#3b0764': 'Tiefviolett', '#292524': 'Dunkelstein', '#020617': 'Mitternacht',
    '#facc15': 'Neongelb', '#4ade80': 'Neonlimette', '#2dd4bf': 'Hellaqua', '#67e8f9': 'Hellcyan', '#c084fc': 'Neonflieder', '#f472b6': 'Neonpink', '#fb7185': 'Neonkoralle', '#fb923c': 'Neonmandarine', '#93c5fd': 'Hellazur', '#e2e8f0': 'Silbernebel',
  },
  Japanese: {
    default: 'デフォルト (#6143f7)',
    '#ffffff': 'ピュアホワイト', '#f8fafc': 'スノーホワイト', '#fffbeb': 'ウォームクリーム', '#e0f2fe': 'ペールスカイ', '#dcfce7': 'ペールミント', '#ffe4e6': 'ペールローズ', '#f3e8ff': 'ペールラベンダー', '#fef9c3': 'ペールレモン', '#ffedd5': 'ペールピーチ', '#cffafe': 'ペールシアン',
    '#6143f7': 'アイリスバイオレット（標準）', '#7c3aed': 'ロイヤルパープル', '#38bdf8': 'スカイブルー', '#3b82f6': 'エレクトリックブルー', '#6366f1': 'ロイヤルインディゴ', '#a855f7': 'バイオレットパープル', '#ec4899': 'ピンクローズ', '#f43f5e': 'コーラルレッド', '#f97316': 'ビビッドオレンジ', '#eab308': 'ゴールデンサン',
    '#000000': 'ジェットブラック', '#0f172a': 'ダークスレート', '#1e293b': 'ダークチャコール', '#172554': 'ディープネイビー', '#451a03': 'ディープブロンズ', '#4c0519': 'ディープルビー', '#064e3b': 'ディープフォレスト', '#3b0764': 'ディープバイオレット', '#292524': 'ダークストーン', '#020617': 'ミッドナイト',
    '#facc15': 'ネオンイエロー', '#4ade80': 'ネオンライム', '#2dd4bf': 'ブライトアクア', '#67e8f9': 'ブライトシアン', '#c084fc': 'ネオンライラック', '#f472b6': 'ネオンピンク', '#fb7185': 'ネオンコーラル', '#fb923c': 'ネオンタンジェリン', '#93c5fd': 'ライトアジュール', '#e2e8f0': 'シルバーミスト',
  },
  Korean: {
    default: '기본 (#6143f7)',
    '#ffffff': '퓨어 화이트', '#f8fafc': '스노우 화이트', '#fffbeb': '웜 크림', '#e0f2fe': '페일 스카이', '#dcfce7': '페일 민트', '#ffe4e6': '페일 로즈', '#f3e8ff': '페일 라벤더', '#fef9c3': '페일 레몬', '#ffedd5': '페일 피치', '#cffafe': '페일 시안',
    '#6143f7': '아이리스 바이올렛 (기본)', '#7c3aed': '로열 퍼플', '#38bdf8': '스카이 블루', '#3b82f6': '일렉트릭 블루', '#6366f1': '로열 인디고', '#a855f7': '바이올렛 퍼플', '#ec4899': '핑크 로즈', '#f43f5e': '코랄 레드', '#f97316': '선명한 오렌지', '#eab308': '골든 선',
    '#000000': '제트 블랙', '#0f172a': '다크 슬레이트', '#1e293b': '다크 차콜', '#172554': '딥 네이비', '#451a03': '딥 브론즈', '#4c0519': '딥 루비', '#064e3b': '딥 포레스트', '#3b0764': '딥 바이올렛', '#292524': '다크 스톤', '#020617': '미드나잇',
    '#facc15': '네온 옐로우', '#4ade80': '네온 라임', '#2dd4bf': '브라이트 아쿠아', '#67e8f9': '브라이트 시안', '#c084fc': '네온 라일락', '#f472b6': '네온 핑크', '#fb7185': '네온 코랄', '#fb923c': '네온 탠저린', '#93c5fd': '라이트 아주르', '#e2e8f0': '실버 미스트',
  },
  Italian: {
    default: 'Predefinito (#6143f7)',
    '#ffffff': 'Bianco puro', '#f8fafc': 'Bianco neve', '#fffbeb': 'Crema caldo', '#e0f2fe': 'Cielo pallido', '#dcfce7': 'Menta pallida', '#ffe4e6': 'Rosa pallido', '#f3e8ff': 'Lavanda pallida', '#fef9c3': 'Limone pallido', '#ffedd5': 'Pesca pallido', '#cffafe': 'Ciano pallido',
    '#6143f7': 'Viola iris (Predef.)', '#7c3aed': 'Porpora reale', '#38bdf8': 'Blu cielo', '#3b82f6': 'Blu elettrico', '#6366f1': 'Indaco reale', '#a855f7': 'Viola porpora', '#ec4899': 'Rosa intenso', '#f43f5e': 'Rosso corallo', '#f97316': 'Arancione vivido', '#eab308': 'Sole dorato',
    '#000000': 'Nero corvino', '#0f172a': 'Ardesia scuro', '#1e293b': 'Carbone scuro', '#172554': 'Blu marino scuro', '#451a03': 'Bronzo scuro', '#4c0519': 'Rubino scuro', '#064e3b': 'Foresta scura', '#3b0764': 'Viola intenso', '#292524': 'Pietra scura', '#020617': 'Mezzanotte',
    '#facc15': 'Giallo neon', '#4ade80': 'Lime neon', '#2dd4bf': 'Acqua brillante', '#67e8f9': 'Ciano brillante', '#c084fc': 'Lillà neon', '#f472b6': 'Rosa neon', '#fb7185': 'Corallo neon', '#fb923c': 'Mandarino neon', '#93c5fd': 'Azzurro chiaro', '#e2e8f0': 'Nebbia argento',
  },
  Russian: {
    default: 'По умолчанию (#6143f7)',
    '#ffffff': 'Чистый белый', '#f8fafc': 'Белоснежный', '#fffbeb': 'Тёплый кремовый', '#e0f2fe': 'Бледно-небесный', '#dcfce7': 'Бледно-мятный', '#ffe4e6': 'Бледно-розовый', '#f3e8ff': 'Бледно-лавандовый', '#fef9c3': 'Бледно-лимонный', '#ffedd5': 'Бледно-персиковый', '#cffafe': 'Бледно-голубой',
    '#6143f7': 'Ирисовый фиолетовый', '#7c3aed': 'Королевский пурпурный', '#38bdf8': 'Небесно-голубой', '#3b82f6': 'Электрик синий', '#6366f1': 'Королевский индиго', '#a855f7': 'Фиолетово-пурпурный', '#ec4899': 'Ярко-розовый', '#f43f5e': 'Кораллово-красный', '#f97316': 'Ярко-оранжевый', '#eab308': 'Золотое солнце',
    '#000000': 'Угольно-чёрный', '#0f172a': 'Тёмный сланец', '#1e293b': 'Тёмный уголь', '#172554': 'Тёмно-синий', '#451a03': 'Тёмная бронза', '#4c0519': 'Тёмный рубин', '#064e3b': 'Тёмный лес', '#3b0764': 'Тёмно-фиолетовый', '#292524': 'Тёмный камень', '#020617': 'Полночь',
    '#facc15': 'Неоновый жёлтый', '#4ade80': 'Неоновый лайм', '#2dd4bf': 'Яркая бирюза', '#67e8f9': 'Яркий циан', '#c084fc': 'Неоновая сирень', '#f472b6': 'Неоновый розовый', '#fb7185': 'Неоновый коралл', '#fb923c': 'Неоновый мандарин', '#93c5fd': 'Светлая лазурь', '#e2e8f0': 'Серебристая дымка',
  },
  Luxembourgish: {
    default: 'Standard (#6143f7)',
    '#ffffff': 'Rengwäiss', '#f8fafc': 'Schnéiwäiss', '#fffbeb': 'Waarm Crème', '#e0f2fe': 'Blasshimmel', '#dcfce7': 'Blassminz', '#ffe4e6': 'Blassrosa', '#f3e8ff': 'Blasslavendel', '#fef9c3': 'Blasszitroun', '#ffedd5': 'Blasspiisch', '#cffafe': 'Blasscyan',
    '#6143f7': 'Irismof (Standard)', '#7c3aed': 'Kinnekspurpur', '#38bdf8': 'Himmelblo', '#3b82f6': 'Elektreschblo', '#6366f1': 'Kinneksindigo', '#a855f7': 'Mofpurpur', '#ec4899': 'Rosa', '#f43f5e': 'Korallerout', '#f97316': 'Knallorange', '#eab308': 'Gëllen Sonn',
    '#000000': 'Déifschwaarz', '#0f172a': 'Däischterschiefer', '#1e293b': 'Däischterkuel', '#172554': 'Déifmarine', '#451a03': 'Déifbronz', '#4c0519': 'Déifrubin', '#064e3b': 'Déifbësch', '#3b0764': 'Déifmof', '#292524': 'Däischtersteen', '#020617': 'Mëtternuecht',
    '#facc15': 'Neongiel', '#4ade80': 'Neonlimett', '#2dd4bf': 'Hellaqua', '#67e8f9': 'Hellcyan', '#c084fc': 'Neonlila', '#f472b6': 'Neonrosa', '#fb7185': 'Neonkorall', '#fb923c': 'Neonmandarin', '#93c5fd': 'Hellazur', '#e2e8f0': 'Sëlwerdonscht',
  },
  Dutch: {
    default: 'Standaard (#6143f7)',
    '#ffffff': 'Zuiver wit', '#f8fafc': 'Sneeuwwit', '#fffbeb': 'Warm crème', '#e0f2fe': 'Bleek hemelsblauw', '#dcfce7': 'Bleek munt', '#ffe4e6': 'Bleek roze', '#f3e8ff': 'Bleek lavendel', '#fef9c3': 'Bleek citroen', '#ffedd5': 'Bleek perzik', '#cffafe': 'Bleek cyaan',
    '#6143f7': 'Irisviolet (Standaard)', '#7c3aed': 'Koningspaars', '#38bdf8': 'Hemelsblauw', '#3b82f6': 'Elektrisch blauw', '#6366f1': 'Koningsindigo', '#a855f7': 'Violetpaars', '#ec4899': 'Rozenrood', '#f43f5e': 'Koraalrood', '#f97316': 'Levendig oranje', '#eab308': 'Goudzon',
    '#000000': 'Gitzwart', '#0f172a': 'Donker leisteen', '#1e293b': 'Donker antraciet', '#172554': 'Diep marineblauw', '#451a03': 'Diep brons', '#4c0519': 'Diep robijn', '#064e3b': 'Diep bosgroen', '#3b0764': 'Diep violet', '#292524': 'Donker steen', '#020617': 'Middernacht',
    '#facc15': 'Neon geel', '#4ade80': 'Neon limoen', '#2dd4bf': 'Helder aqua', '#67e8f9': 'Helder cyaan', '#c084fc': 'Neon lila', '#f472b6': 'Neon roze', '#fb7185': 'Neon koraal', '#fb923c': 'Neon mandarijn', '#93c5fd': 'Licht azuur', '#e2e8f0': 'Zilvermist',
  },
  Swedish: {
    default: 'Standard (#6143f7)',
    '#ffffff': 'Ren vit', '#f8fafc': 'Snövit', '#fffbeb': 'Varm grädde', '#e0f2fe': 'Blek himmel', '#dcfce7': 'Blek mint', '#ffe4e6': 'Blek ros', '#f3e8ff': 'Blek lavendel', '#fef9c3': 'Blek citron', '#ffedd5': 'Blek persika', '#cffafe': 'Blek cyan',
    '#6143f7': 'Irisviolett (Standard)', '#7c3aed': 'Kunglig lila', '#38bdf8': 'Himmelsblå', '#3b82f6': 'Elektrisk blå', '#6366f1': 'Kunglig indigo', '#a855f7': 'Violett lila', '#ec4899': 'Rosa ros', '#f43f5e': 'Korallröd', '#f97316': 'Stark orange', '#eab308': 'Gyllene sol',
    '#000000': 'Kolsvart', '#0f172a': 'Mörk skiffer', '#1e293b': 'Mörkt träkol', '#172554': 'Djup marinblå', '#451a03': 'Djup brons', '#4c0519': 'Djup rubin', '#064e3b': 'Djup skog', '#3b0764': 'Djup violett', '#292524': 'Mörk sten', '#020617': 'Midnatt',
    '#facc15': 'Neongul', '#4ade80': 'Neonlime', '#2dd4bf': 'Klar aqua', '#67e8f9': 'Klar cyan', '#c084fc': 'Neonlila', '#f472b6': 'Neonrosa', '#fb7185': 'Neonkorall', '#fb923c': 'Neonmandarin', '#93c5fd': 'Ljus azur', '#e2e8f0': 'Silverdimma',
  },
  Finnish: {
    default: 'Oletus (#6143f7)',
    '#ffffff': 'Puhdas valkoinen', '#f8fafc': 'Lumivalkoinen', '#fffbeb': 'Lämmin kerma', '#e0f2fe': 'Vaalea taivas', '#dcfce7': 'Vaalea minttu', '#ffe4e6': 'Vaalea ruusu', '#f3e8ff': 'Vaalea laventeli', '#fef9c3': 'Vaalea sitruuna', '#ffedd5': 'Vaalea persikka', '#cffafe': 'Vaalea syaani',
    '#6143f7': 'Iirisvioletti (Oletus)', '#7c3aed': 'Kuninkaallinen purppura', '#38bdf8': 'Taivaansininen', '#3b82f6': 'Sähkönsininen', '#6366f1': 'Kuninkaallinen indigo', '#a855f7': 'Violetti purppura', '#ec4899': 'Ruusunpunainen', '#f43f5e': 'Korallinpunainen', '#f97316': 'Kirkas oranssi', '#eab308': 'Kultainen aurinko',
    '#000000': 'Sysimusta', '#0f172a': 'Tumma liuskekivi', '#1e293b': 'Tumma hiili', '#172554': 'Syvä laivasto', '#451a03': 'Syvä pronssi', '#4c0519': 'Syvä rubiini', '#064e3b': 'Syvä metsä', '#3b0764': 'Syvä violetti', '#292524': 'Tumma kivi', '#020617': 'Keskiyö',
    '#facc15': 'Neonkeltainen', '#4ade80': 'Neonlime', '#2dd4bf': 'Kirkas aqua', '#67e8f9': 'Kirkas syaani', '#c084fc': 'Neonliila', '#f472b6': 'Neonpinkki', '#fb7185': 'Neonkoralli', '#fb923c': 'Neonmandariini', '#93c5fd': 'Vaalea taivaansini', '#e2e8f0': 'Hopeasumu',
  },
  Hindi: {
    default: 'डिफ़ॉल्ट (#6143f7)',
    '#ffffff': 'शुद्ध सफ़ेद', '#f8fafc': 'हिम श्वेत', '#fffbeb': 'गर्म क्रीम', '#e0f2fe': 'हल्का आकाश', '#dcfce7': 'हल्का पुदीना', '#ffe4e6': 'हल्का गुलाब', '#f3e8ff': 'हल्का लैवेंडर', '#fef9c3': 'हल्का नींबू', '#ffedd5': 'हल्का आड़ू', '#cffafe': 'हल्का सियान',
    '#6143f7': 'आइरिस वायलेट (डिफ़ॉल्ट)', '#7c3aed': 'रॉयल पर्पल', '#38bdf8': 'स्काई ब्लू', '#3b82f6': 'इलेक्ट्रिक ब्लू', '#6366f1': 'रॉयल इंडिगो', '#a855f7': 'वायलेट पर्पल', '#ec4899': 'पिंक रोज़', '#f43f5e': 'कोरल रेड', '#f97316': 'चमकीला नारंगी', '#eab308': 'सुनहरा सूरज',
    '#000000': 'जेट ब्लैक', '#0f172a': 'डार्क स्लेट', '#1e293b': 'डार्क चारकोल', '#172554': 'डीप नेवी', '#451a03': 'डीप ब्रॉन्ज़', '#4c0519': 'डीप रूबी', '#064e3b': 'डीप फ़ॉरेस्ट', '#3b0764': 'डीप वायलेट', '#292524': 'डार्क स्टोन', '#020617': 'मिडनाइट',
    '#facc15': 'नियॉन पीला', '#4ade80': 'नियॉन लाइम', '#2dd4bf': 'ब्राइट एक्वा', '#67e8f9': 'ब्राइट सियान', '#c084fc': 'नियॉन लाइलैक', '#f472b6': 'नियॉन गुलाबी', '#fb7185': 'नियॉन कोरल', '#fb923c': 'नियॉन टैंजरीन', '#93c5fd': 'हल्का अज़ूर', '#e2e8f0': 'सिल्वर मिस्ट',
  },
  Norwegian: {
    default: 'Standard (#6143f7)',
    '#ffffff': 'Ren hvit', '#f8fafc': 'Snøhvit', '#fffbeb': 'Varm krem', '#e0f2fe': 'Blek himmel', '#dcfce7': 'Blek mynte', '#ffe4e6': 'Blek rose', '#f3e8ff': 'Blek lavendel', '#fef9c3': 'Blek sitron', '#ffedd5': 'Blek fersken', '#cffafe': 'Blek cyan',
    '#6143f7': 'Irisfiolett (Standard)', '#7c3aed': 'Kongelig lilla', '#38bdf8': 'Himmelblå', '#3b82f6': 'Elektrisk blå', '#6366f1': 'Kongelig indigo', '#a855f7': 'Fiolett lilla', '#ec4899': 'Rosarød', '#f43f5e': 'Korallrød', '#f97316': 'Sterk oransje', '#eab308': 'Gyllen sol',
    '#000000': 'Beksvart', '#0f172a': 'Mørk skifer', '#1e293b': 'Mørkt kull', '#172554': 'Dyp marineblå', '#451a03': 'Dyp bronse', '#4c0519': 'Dyp rubin', '#064e3b': 'Dyp skog', '#3b0764': 'Dyp fiolett', '#292524': 'Mørk stein', '#020617': 'Midnatt',
    '#facc15': 'Neongul', '#4ade80': 'Neonlime', '#2dd4bf': 'Lys aqua', '#67e8f9': 'Lys cyan', '#c084fc': 'Neonlilla', '#f472b6': 'Neonrosa', '#fb7185': 'Neonkorall', '#fb923c': 'Neontangerin', '#93c5fd': 'Lys asur', '#e2e8f0': 'Sølvtåke',
  },
  Thai: {
    default: 'ค่าเริ่มต้น (#6143f7)',
    '#ffffff': 'ขาวบริสุทธิ์', '#f8fafc': 'ขาวหิมะ', '#fffbeb': 'ครีมอบอุ่น', '#e0f2fe': 'ฟ้าอ่อนจาง', '#dcfce7': 'มินต์อ่อน', '#ffe4e6': 'ชมพูกุหลาบอ่อน', '#f3e8ff': 'ลาเวนเดอร์อ่อน', '#fef9c3': 'เลมอนอ่อน', '#ffedd5': 'พีชอ่อน', '#cffafe': 'ฟ้าอมเขียวอ่อน',
    '#6143f7': 'ม่วงไอริส (ค่าเริ่มต้น)', '#7c3aed': 'ม่วงหลวง', '#38bdf8': 'ฟ้าสดใส', '#3b82f6': 'น้ำเงินอิเล็กทริก', '#6366f1': 'ครามหลวง', '#a855f7': 'ม่วงไวโอเล็ต', '#ec4899': 'ชมพูกุหลาบ', '#f43f5e': 'แดงปะการัง', '#f97316': 'ส้มสดใส', '#eab308': 'เหลืองทองตะวัน',
    '#000000': 'ดำสนิท', '#0f172a': 'เทาหินชนวนเข้ม', '#1e293b': 'ถ่านเข้ม', '#172554': 'กรมท่าเข้ม', '#451a03': 'บรอนซ์เข้ม', '#4c0519': 'ทับทิมเข้ม', '#064e3b': 'เขียวป่าเข้ม', '#3b0764': 'ม่วงเข้ม', '#292524': 'เทาหินเข้ม', '#020617': 'ดำเที่ยงคืน',
    '#facc15': 'เหลืองนีออน', '#4ade80': 'เขียวมะนาวนีออน', '#2dd4bf': 'อะควาสว่าง', '#67e8f9': 'ไซแอนสว่าง', '#c084fc': 'ไลแลคนีออน', '#f472b6': 'ชมพูนีออน', '#fb7185': 'ปะการังนีออน', '#fb923c': 'ส้มแทงเจอรีนนีออน', '#93c5fd': 'ฟ้าอาซูร์อ่อน', '#e2e8f0': 'หมอกเงิน',
  },
  Portuguese: {
    default: 'Predefinido (#6143f7)',
    '#ffffff': 'Branco puro', '#f8fafc': 'Branco neve', '#fffbeb': 'Creme quente', '#e0f2fe': 'Céu pálido', '#dcfce7': 'Menta pálida', '#ffe4e6': 'Rosa pálido', '#f3e8ff': 'Lavanda pálida', '#fef9c3': 'Limão pálido', '#ffedd5': 'Pêssego pálido', '#cffafe': 'Ciano pálido',
    '#6143f7': 'Violeta íris (Predef.)', '#7c3aed': 'Roxo real', '#38bdf8': 'Azul céu', '#3b82f6': 'Azul elétrico', '#6366f1': 'Índigo real', '#a855f7': 'Roxo violeta', '#ec4899': 'Rosa vivo', '#f43f5e': 'Vermelho coral', '#f97316': 'Laranja vibrante', '#eab308': 'Sol dourado',
    '#000000': 'Preto absoluto', '#0f172a': 'Ardósia escuro', '#1e293b': 'Carvão escuro', '#172554': 'Azul-marinho profundo', '#451a03': 'Bronze profundo', '#4c0519': 'Rubi profundo', '#064e3b': 'Floresta profunda', '#3b0764': 'Violeta profundo', '#292524': 'Pedra escura', '#020617': 'Meia-noite',
    '#facc15': 'Amarelo néon', '#4ade80': 'Lima néon', '#2dd4bf': 'Água brilhante', '#67e8f9': 'Ciano brilhante', '#c084fc': 'Lilás néon', '#f472b6': 'Rosa néon', '#fb7185': 'Coral néon', '#fb923c': 'Tangerina néon', '#93c5fd': 'Azul-celeste claro', '#e2e8f0': 'Névoa prateada',
  },
  Vietnamese: {
    default: 'Mặc định (#6143f7)',
    '#ffffff': 'Trắng tinh khiết', '#f8fafc': 'Trắng tuyết', '#fffbeb': 'Kem ấm', '#e0f2fe': 'Xanh trời nhạt', '#dcfce7': 'Bạc hà nhạt', '#ffe4e6': 'Hồng phấn nhạt', '#f3e8ff': 'Oải hương nhạt', '#fef9c3': 'Chanh nhạt', '#ffedd5': 'Đào nhạt', '#cffafe': 'Lục lam nhạt',
    '#6143f7': 'Tím diên vĩ (Mặc định)', '#7c3aed': 'Tím hoàng gia', '#38bdf8': 'Xanh da trời', '#3b82f6': 'Xanh điện', '#6366f1': 'Chàm hoàng gia', '#a855f7': 'Tím violet', '#ec4899': 'Hồng rực', '#f43f5e': 'Đỏ san hô', '#f97316': 'Cam rực rỡ', '#eab308': 'Nắng vàng',
    '#000000': 'Đen tuyền', '#0f172a': 'Xám đá đậm', '#1e293b': 'Than đậm', '#172554': 'Xanh hải quân sâu', '#451a03': 'Đồng đậm', '#4c0519': 'Hồng ngọc đậm', '#064e3b': 'Rừng sâu', '#3b0764': 'Tím sâu', '#292524': 'Đá tối', '#020617': 'Nửa đêm',
    '#facc15': 'Vàng neon', '#4ade80': 'Chanh neon', '#2dd4bf': 'Ngọc lam sáng', '#67e8f9': 'Lục lam sáng', '#c084fc': 'Tử đinh hương neon', '#f472b6': 'Hồng neon', '#fb7185': 'San hô neon', '#fb923c': 'Quýt neon', '#93c5fd': 'Thiên thanh nhạt', '#e2e8f0': 'Sương bạc',
  },
  Polish: {
    default: 'Domyślny (#6143f7)',
    '#ffffff': 'Czysta biel', '#f8fafc': 'Śnieżna biel', '#fffbeb': 'Ciepły kremowy', '#e0f2fe': 'Blady błękit nieba', '#dcfce7': 'Blada mięta', '#ffe4e6': 'Blady róż', '#f3e8ff': 'Blada lawenda', '#fef9c3': 'Blada cytryna', '#ffedd5': 'Blada brzoskwinia', '#cffafe': 'Blady cyjan',
    '#6143f7': 'Fiolet irysowy (Domyślny)', '#7c3aed': 'Królewska purpura', '#38bdf8': 'Błękit nieba', '#3b82f6': 'Elektryczny błękit', '#6366f1': 'Królewskie indygo', '#a855f7': 'Fioletowy purpurowy', '#ec4899': 'Różany róż', '#f43f5e': 'Koralowa czerwień', '#f97316': 'Żywy pomarańcz', '#eab308': 'Złote słońce',
    '#000000': 'Głęboka czerń', '#0f172a': 'Ciemny łupkowy', '#1e293b': 'Ciemny grafit', '#172554': 'Głęboki granat', '#451a03': 'Głęboki brąz', '#4c0519': 'Głęboki rubin', '#064e3b': 'Głęboki las', '#3b0764': 'Głęboki fiolet', '#292524': 'Ciemny kamień', '#020617': 'Północ',
    '#facc15': 'Neonowy żółty', '#4ade80': 'Neonowa limonka', '#2dd4bf': 'Jasny turkus', '#67e8f9': 'Jasny cyjan', '#c084fc': 'Neonowy bez', '#f472b6': 'Neonowy róż', '#fb7185': 'Neonowy koral', '#fb923c': 'Neonowa mandarynka', '#93c5fd': 'Jasny lazur', '#e2e8f0': 'Srebrna mgła',
  },
  Danish: {
    default: 'Standard (#6143f7)',
    '#ffffff': 'Ren hvid', '#f8fafc': 'Snehvid', '#fffbeb': 'Varm creme', '#e0f2fe': 'Bleg himmel', '#dcfce7': 'Bleg mynte', '#ffe4e6': 'Bleg rose', '#f3e8ff': 'Bleg lavendel', '#fef9c3': 'Bleg citron', '#ffedd5': 'Bleg fersken', '#cffafe': 'Bleg cyan',
    '#6143f7': 'Irisviolet (Standard)', '#7c3aed': 'Kongelig lilla', '#38bdf8': 'Himmelblå', '#3b82f6': 'Elektrisk blå', '#6366f1': 'Kongelig indigo', '#a855f7': 'Violet lilla', '#ec4899': 'Rosapink', '#f43f5e': 'Koralrød', '#f97316': 'Stærk orange', '#eab308': 'Gylden sol',
    '#000000': 'Kulsort', '#0f172a': 'Mørk skifer', '#1e293b': 'Mørkt kul', '#172554': 'Dyb marineblå', '#451a03': 'Dyb bronze', '#4c0519': 'Dyb rubin', '#064e3b': 'Dyb skov', '#3b0764': 'Dyb violet', '#292524': 'Mørk sten', '#020617': 'Midnat',
    '#facc15': 'Neongul', '#4ade80': 'Neonlime', '#2dd4bf': 'Klar akva', '#67e8f9': 'Klar cyan', '#c084fc': 'Neonlilla', '#f472b6': 'Neonpink', '#fb7185': 'Neonkoral', '#fb923c': 'Neontangerin', '#93c5fd': 'Lys azur', '#e2e8f0': 'Sølvtåge',
  },
  Turkish: {
    default: 'Varsayılan (#6143f7)',
    '#ffffff': 'Saf Beyaz', '#f8fafc': 'Kar Beyazı', '#fffbeb': 'Sıcak Krem', '#e0f2fe': 'Soluk Gökyüzü', '#dcfce7': 'Soluk Nane', '#ffe4e6': 'Soluk Gül', '#f3e8ff': 'Soluk Lavanta', '#fef9c3': 'Soluk Limon', '#ffedd5': 'Soluk Şeftali', '#cffafe': 'Soluk Camgöbeği',
    '#6143f7': 'İris Menekşe (Varsayılan)', '#7c3aed': 'Kraliyet Moru', '#38bdf8': 'Gök Mavisi', '#3b82f6': 'Elektrik Mavisi', '#6366f1': 'Kraliyet Çivit', '#a855f7': 'Menekşe Moru', '#ec4899': 'Pembe Gül', '#f43f5e': 'Mercan Kırmızısı', '#f97316': 'Canlı Turuncu', '#eab308': 'Altın Güneş',
    '#000000': 'Simsiyah', '#0f172a': 'Koyu Arduvaz', '#1e293b': 'Koyu Kömür', '#172554': 'Koyu Lacivert', '#451a03': 'Koyu Bronz', '#4c0519': 'Koyu Yakut', '#064e3b': 'Koyu Orman', '#3b0764': 'Koyu Menekşe', '#292524': 'Koyu Taş', '#020617': 'Gece Yarısı',
    '#facc15': 'Neon Sarı', '#4ade80': 'Neon Lime', '#2dd4bf': 'Parlak Su Yeşili', '#67e8f9': 'Parlak Camgöbeği', '#c084fc': 'Neon Leylak', '#f472b6': 'Neon Pembe', '#fb7185': 'Neon Mercan', '#fb923c': 'Neon Mandalina', '#93c5fd': 'Açık Azur', '#e2e8f0': 'Gümüş Sisi',
  },
  Greek: {
    default: 'Προεπιλογή (#6143f7)',
    '#ffffff': 'Καθαρό Λευκό', '#f8fafc': 'Λευκό του Χιονιού', '#fffbeb': 'Ζεστό Κρεμ', '#e0f2fe': 'Απαλό Γαλάζιο', '#dcfce7': 'Απαλή Μέντα', '#ffe4e6': 'Απαλό Τριανταφυλλί', '#f3e8ff': 'Απαλή Λεβάντα', '#fef9c3': 'Απαλό Λεμονί', '#ffedd5': 'Απαλό Ροδακινί', '#cffafe': 'Απαλό Κυανό',
    '#6143f7': 'Ίριδα Βιολετί (Προεπιλογή)', '#7c3aed': 'Βασιλικό Μωβ', '#38bdf8': 'Μπλε του Ουρανού', '#3b82f6': 'Ηλεκτρικό Μπλε', '#6366f1': 'Βασιλικό Λουλακί', '#a855f7': 'Βιολετί Μωβ', '#ec4899': 'Ροζ Τριαντάφυλλο', '#f43f5e': 'Κοραλλί Κόκκινο', '#f97316': 'Ζωηρό Πορτοκαλί', '#eab308': 'Χρυσός Ήλιος',
    '#000000': 'Κατάμαυρο', '#0f172a': 'Σκούρος Σχιστόλιθος', '#1e293b': 'Σκούρο Ανθρακί', '#172554': 'Βαθύ Ναυτικό Μπλε', '#451a03': 'Βαθύ Χάλκινο', '#4c0519': 'Βαθύ Ρουμπινί', '#064e3b': 'Βαθύ Δάσος', '#3b0764': 'Βαθύ Βιολετί', '#292524': 'Σκούρα Πέτρα', '#020617': 'Μεσάνυχτα',
    '#facc15': 'Νέον Κίτρινο', '#4ade80': 'Νέον Λάιμ', '#2dd4bf': 'Φωτεινό Άκουα', '#67e8f9': 'Φωτεινό Κυανό', '#c084fc': 'Νέον Λιλά', '#f472b6': 'Νέον Ροζ', '#fb7185': 'Νέον Κοραλλί', '#fb923c': 'Νέον Μανταρίνι', '#93c5fd': 'Ανοιχτό Γαλάζιο', '#e2e8f0': 'Ασημί Ομίχλη',
  },
};

const TEXT_PICK_CUSTOM_T: Record<string, string> = {
  English: 'Pick custom color',
  Chinese: '选择自定义颜色',
  'Chinese Traditional': '選擇自訂顏色',
  Spanish: 'Elegir color personalizado',
  French: 'Choisir une couleur personnalisée',
  German: 'Benutzerdefinierte Farbe wählen',
  Japanese: 'カスタムカラーを選択',
  Korean: '사용자 지정 색상 선택',
  Italian: 'Scegli colore personalizzato',
  Russian: 'Выбрать свой цвет',
  Luxembourgish: 'Eegen Faarf wielen',
  Dutch: 'Kies aangepaste kleur',
  Swedish: 'Välj anpassad färg',
  Finnish: 'Valitse mukautettu väri',
  Hindi: 'कस्टम रंग चुनें',
  Norwegian: 'Velg egendefinert farge',
  Thai: 'เลือกสีกำหนดเอง',
  Portuguese: 'Escolher cor personalizada',
  Vietnamese: 'Chọn màu tùy chỉnh',
  Polish: 'Wybierz własny kolor',
  Danish: 'Vælg brugerdefineret farve',
  Turkish: 'Özel renk seç',
  Greek: 'Επιλογή προσαρμοσμένου χρώματος',
};

export default function TextTab({
  textColor,
  setTextColor,
  currentTheme,
  isDarkMode,
  language = 'English',
  cardBgMode = 'white'
}: TextTabProps) {
  const tData = TEXT_T[language] || TEXT_T['English'];
  const presetNames = TEXT_PRESET_NAMES[language] || TEXT_PRESET_NAMES['English'];
  const pickCustomColorTitle = TEXT_PICK_CUSTOM_T[language] || TEXT_PICK_CUSTOM_T['English'];
  const [customHex, setCustomHex] = useState(
    textColor && textColor !== 'default' && textColor.startsWith('#') ? textColor : '#38bdf8'
  );

  // Compute background preview style based on currentTheme
  const getPreviewBgStyle = (): React.CSSProperties => {
    const isCustom = currentTheme.startsWith('data:image') || currentTheme.startsWith('http');
    const isHex = currentTheme.startsWith('#');
    const isGradient = GRADIENTS_MAP[currentTheme];
    const isSolid = SOLIDS_MAP[currentTheme];
    const wp = WALLPAPERS.find(w => w.id === currentTheme) || (isCustom ? { id: 'custom', overlay: currentTheme } : WALLPAPERS[1]);

    if (isCustom) {
      let finalUrl = currentTheme;
      if (finalUrl.includes('images.unsplash.com')) {
        finalUrl = finalUrl.replace('q=80', 'q=100').replace(/w=\d+/, 'w=7680');
      }
      return {
        backgroundImage: `url(${finalUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (isHex) {
      return { backgroundColor: currentTheme };
    }
    if (currentTheme === 'default-earth') {
      return {
        backgroundColor: '#063354',
        backgroundImage: `url('/assets/aistudio/Gemini_Generated_Image_earth_8ba148bc.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (currentTheme === 'pastel-waves') {
      return {
        backgroundColor: '#b8c8ec',
        backgroundImage: `url('/assets/aistudio/Gemini_Generated_Image_mix_b913d992.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (currentTheme === 'mix-neonpurple') {
      return {
        backgroundColor: '#eef4ff',
        backgroundImage: `url('/assets/aistudio/Gemini_Generated_Image_5_9379e872.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (isGradient) {
      return { background: GRADIENTS_MAP[currentTheme] };
    }
    if (isSolid) {
      return { backgroundColor: SOLIDS_MAP[currentTheme] };
    }
    if (currentTheme === 'light-grey' || currentTheme === 'light-slate') {
      return { backgroundColor: '#f8fafc' };
    }
    if (currentTheme === 'white-clean') {
      return { backgroundColor: '#ffffff' };
    }
    if (!isDarkMode && currentTheme === 'immersive') {
      return { backgroundColor: '#ffffff' };
    }
    return { background: wp.overlay };
  };

  const isDefaultLight = currentTheme === 'light-grey' || currentTheme === 'light-slate' || currentTheme === 'white-clean';
  const isDefaultGradient = textColor === 'default' && (!isDarkMode || isDefaultLight);
  const effectiveTextColor = textColor === 'default'
    ? (isDarkMode && !isDefaultLight ? '#ffffff' : '#6143f7')
    : textColor;

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const languageToLocale: Record<string, string> = {
    English: 'en-US',
    Spanish: 'es-ES',
    French: 'fr-FR',
    German: 'de-DE',
    Chinese: 'zh-CN',
    'Chinese Traditional': 'zh-TW',
    Japanese: 'ja-JP',
    Korean: 'ko-KR',
    Italian: 'it-IT',
    Russian: 'ru-RU',
    Luxembourgish: 'lb-LU',
    Dutch: 'nl-NL',
    Swedish: 'sv-SE',
    Finnish: 'fi-FI',
    Hindi: 'hi-IN',
    Norwegian: 'nb-NO',
    Thai: 'th-TH',
    Portuguese: 'pt-PT',
    Vietnamese: 'vi-VN',
    Polish: 'pl-PL',
    Danish: 'da-DK',
    Turkish: 'tr-TR',
    Greek: 'el-GR',
  };

  const locale = languageToLocale[language] || 'en-US';
  const timeString = currentTime.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateString = currentTime.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return t(language, 'good_morning');
    if (hour >= 12 && hour < 18) return t(language, 'good_afternoon');
    return t(language, 'good_evening');
  };

  const isCustomPhoto = currentTheme.startsWith('data:image') || currentTheme.startsWith('http');
  const isEffectiveTextLight = useMemo(() => {
    if (effectiveTextColor.startsWith('#') && effectiveTextColor.length >= 7) {
      const cleanHex = effectiveTextColor.replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return yiq >= 128;
    }
    return isDarkMode;
  }, [effectiveTextColor, isDarkMode]);

  const textShadowStyle = (isCustomPhoto || (isDarkMode && !isDefaultLight))
    ? (isEffectiveTextLight ? '0 2px 10px rgba(0,0,0,0.85)' : '0 1px 3px rgba(255,255,255,0.7)')
    : undefined;

  const renderGroup = (title: string, presets: TextPreset[]) => {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-violet-600">{title}</h4>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3.5 md:gap-4 justify-items-center">
          {presets.map((p) => {
            const isSelected = textColor === p.id;
            const isDefault = p.id === 'default';

            return (
              <button
                key={p.id}
                onClick={() => setTextColor(p.id)}
                className="group w-full min-h-[44px] min-w-[44px] lg:min-h-0 lg:min-w-0 flex flex-col items-center justify-center transition-all duration-300 relative focus:outline-none cursor-pointer py-1"
                title={presetNames[p.id] || p.name}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border transition-all duration-300 flex items-center justify-center relative shrink-0 ${
                    isSelected
                      ? 'border-black scale-110 shadow-lg shadow-black/15 ring-2 ring-violet-500'
                      : 'border-black/15 opacity-85 hover:opacity-100 hover:scale-105 shadow-inner'
                  }`}
                  style={
                    isDefault
                      ? { background: '#6143f7' }
                      : { background: p.color }
                  }
                >
                  {isSelected ? (
                    <Check
                      size={14}
                      className={
                        p.color === '#ffffff' || p.color === '#f8fafc' || p.color === '#fffbeb' || p.color === '#e0f2fe' || p.color === '#dcfce7' || p.color === '#ffe4e6' || p.color === '#f3e8ff' || p.color === '#fef9c3' || p.color === '#ffedd5' || p.color === '#cffafe' || p.color === '#facc15' || p.color === '#4ade80' || p.color === '#67e8f9'
                          ? 'text-black font-extrabold'
                          : 'text-white font-extrabold'
                      }
                    />
                  ) : (
                    <span
                      className={`text-[11px] font-black ${
                        isDefault
                          ? 'text-white'
                          : p.color === '#ffffff' || p.color === '#f8fafc' || p.color === '#fffbeb' || p.color === '#e0f2fe' || p.color === '#dcfce7' || p.color === '#ffe4e6' || p.color === '#f3e8ff' || p.color === '#fef9c3' || p.color === '#ffedd5' || p.color === '#cffafe' || p.color === '#facc15' || p.color === '#4ade80' || p.color === '#67e8f9'
                            ? 'text-black/60'
                            : 'text-white/85'
                      }`}
                    >
                      A
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-6 sm:mb-10 flex flex-col items-center text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2 sm:mb-3">{tData.title}</h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.25em] text-[10px]">{tData.subtitle}</p>
      </div>

      {/* Main Container Card - Always clean white inside Settings right pane */}
      <div
        className="text-tab-card rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8 transition-all duration-300 border w-full max-w-full overflow-hidden text-black"
        style={{
          background: '#ffffff',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 6px rgba(60,64,67,0.1), 0 16px 40px rgba(60,64,67,0.06)'
        }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-black/10 pb-4 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center border bg-black/5 border-black/10">
              <Type className="text-violet-600" size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">{tData.panelHeader}</h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{tData.panelSub}</p>
            </div>
          </div>
          <button
            onClick={() => setTextColor('default')}
            className="text-tab-reset-btn flex items-center gap-2 px-4 py-2 min-h-[42px] lg:min-h-0 border rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer text-[11px] bg-neutral-100 hover:bg-neutral-200 text-black border-black/5"
          >
            <RotateCcw size={14} />
            {tData.resetButton}
          </button>
        </div>

        {/* Live Vision Preview Box: Shows how selected text color looks on current background */}
        <div className="text-tab-preview-box rounded-2xl border p-5 relative overflow-hidden shadow-inner transition-colors bg-slate-50 border-black/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-violet-600" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                {tData.previewTitle.startsWith('#') ? tData.previewTitle : `# ${tData.previewTitle}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                {textColor === 'default' ? tData.groupDefault : (textColor.startsWith('#') ? textColor.toUpperCase() : `#${textColor.toUpperCase()}`)}
              </span>
              <div
                className="w-4 h-4 rounded-full border border-black/20 shadow-xs"
                style={{ backgroundColor: effectiveTextColor }}
              />
            </div>
          </div>

          <div
            className="w-full rounded-xl p-6 min-h-[140px] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 border border-black/10 shadow-sm"
            style={getPreviewBgStyle()}
          >
            {/* Dark overlay for photo wallpapers to mirror actual app behavior */}
            {(currentTheme.startsWith('data:image') || currentTheme.startsWith('http')) && (
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />
            )}

            <div 
              className="relative z-10 text-center select-none space-y-1 preview-vision-box"
              style={{
                color: effectiveTextColor,
                ['--preview-live-text-color' as any]: effectiveTextColor
              }}
            >
              <p
                className="text-xs sm:text-sm font-extrabold tracking-widest uppercase opacity-90 transition-colors duration-300 preview-live-text"
                style={{ color: effectiveTextColor, textShadow: textShadowStyle }}
              >
                {getGreeting()}, GeekTabs
              </p>
              <div
                className="text-4xl sm:text-5xl font-light tracking-tighter leading-none transition-colors duration-300 select-none preview-clock-display preview-live-text"
                style={{ color: effectiveTextColor, textShadow: textShadowStyle }}
              >
                {timeString}
              </div>
              <p
                className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] opacity-80 transition-colors duration-300 preview-live-text"
                style={{ color: effectiveTextColor, textShadow: textShadowStyle }}
              >
                {dateString}
              </p>
            </div>
          </div>
        </div>

        {/* Preset Palette Groups */}
        <div className="space-y-8">
          {renderGroup(tData.groupDefault, [DEFAULT_TEXT_PRESET])}
          {renderGroup(tData.groupLight, LIGHT_TEXT_PRESETS)}
          {renderGroup(tData.groupRegular, REGULAR_TEXT_PRESETS)}
          {renderGroup(tData.groupDark, DARK_TEXT_PRESETS)}
          {renderGroup(tData.groupVibrant, VIBRANT_TEXT_PRESETS)}
        </div>

        {/* Custom Hex Color Picker */}
        <div className="pt-6 border-t border-black/10 flex flex-col gap-3.5 w-full">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 bg-violet-500/10 border-violet-500/20">
              <Sparkles className="text-violet-600" size={16} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">{tData.customColorTitle}</h4>
              <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed text-slate-500">{tData.panelSub}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full max-w-sm pt-0.5">
            <div className="text-tab-input-box flex items-center gap-2 border px-3 py-2 min-h-[44px] lg:min-h-0 rounded-xl shadow-inner flex-1 min-w-0 transition-colors bg-neutral-100 hover:bg-neutral-200/70 border-black/10">
              <input
                type="color"
                value={customHex.startsWith('#') ? customHex : '#38bdf8'}
                onChange={(e) => {
                  setCustomHex(e.target.value);
                  setTextColor(e.target.value);
                }}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0 bg-transparent shrink-0"
                title={pickCustomColorTitle}
              />
              <input
                type="text"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                placeholder="#38bdf8"
                className="w-full text-base sm:text-sm font-mono font-bold bg-transparent outline-none uppercase tracking-wider text-slate-800"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (customHex && customHex.startsWith('#')) {
                  setTextColor(customHex);
                }
              }}
              style={{ color: '#ffffff' }}
              className="custom-hex-apply-btn px-5 sm:px-6 py-2.5 min-h-[44px] lg:min-h-0 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white !text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
            >
              <Check size={14} className="shrink-0 text-white !text-white custom-hex-btn-icon" style={{ color: '#ffffff', stroke: '#ffffff' }} />
              <span className="text-white !text-white font-bold custom-hex-btn-text" style={{ color: '#ffffff' }}>{tData.customColorApply}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
