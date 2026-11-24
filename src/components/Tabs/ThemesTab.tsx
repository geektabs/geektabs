import React from 'react';
import { motion } from 'motion/react';
import { Palette, Check, RotateCcw } from 'lucide-react';

interface ThemesTabProps {
  currentTheme: string;
  setTheme: (theme: string) => void;
  isDarkMode: boolean;
  language?: string;
  cardBgMode?: 'white' | 'dark' | 'dark-glass';
}

const THEME_T: Record<string, Record<string, string>> = {
  English: {
    title: 'Theme Engine',
    subtitle: 'PRESET COLOR CONFIGURATION',
    panelHeader: 'Color Palette Presets',
    panelSub: 'select a color for your favorite',
    resetButton: 'Reset to Pastel Waves',
    restoreWhiteButton: 'Restore Default Background',
    groupDefault: 'default',
    groupLight: 'light',
    groupRegular: 'regular',
    groupDark: 'dark',
    groupGradient: 'Mix'
  },
  Chinese: {
    title: '主题引擎',
    subtitle: '预设颜色配置',
    panelHeader: '调色板预设',
    panelSub: '选择您最喜爱的背景颜色',
    resetButton: '重置为浅彩波纹',
    restoreWhiteButton: '恢复默认背景',
    groupDefault: '默认',
    groupLight: '浅色',
    groupRegular: '常规',
    groupDark: '深色',
    groupGradient: 'Mix'
  },
  'Chinese Traditional': {
    title: '主題引擎',
    subtitle: '預設顏色設定',
    panelHeader: '調色盤預設',
    panelSub: '選擇您最喜愛的背景顏色',
    resetButton: '重置為粉彩波紋',
    restoreWhiteButton: '恢復預設背景',
    groupDefault: '預設',
    groupLight: '淺色',
    groupRegular: '常規',
    groupDark: '深色',
    groupGradient: 'Mix'
  },
  Spanish: {
    title: 'Motor de Temas',
    subtitle: 'CONFIGURACIÓN DE COLOR PREESTABLECIDA',
    panelHeader: 'Ajustes del Tema de Color',
    panelSub: 'selecciona un color de fondo preferido',
    resetButton: 'Restablecer a Ondas Pastel',
    restoreWhiteButton: 'Restaurar Fondo (Predeterminado)',
    groupDefault: 'por defecto',
    groupLight: 'claro',
    groupRegular: 'regular',
    groupDark: 'oscuro',
    groupGradient: 'Mix'
  },
  French: {
    title: 'Moteur de Thèmes',
    subtitle: 'CONFIGURATION DES COULEURS PRÉDÉFINIES',
    panelHeader: 'Palettes de Couleurs Prédéfinies',
    panelSub: 'sélectionnez une couleur de fond préférée',
    resetButton: 'Réinitialiser Vagues Pastel',
    restoreWhiteButton: 'Restaurer Fond (Défaut)',
    groupDefault: 'par défaut',
    groupLight: 'clair',
    groupRegular: 'régulier',
    groupDark: 'sombre',
    groupGradient: 'Mix'
  },
  German: {
    title: 'Theme-Engine',
    subtitle: 'VOREINGESTELLTE FARBKONFIGURATION',
    panelHeader: 'Farbpaletten-Voreinstellungen',
    panelSub: 'Wählen Sie Ihre bevorzugte Hintergrundfarbe',
    resetButton: 'Auf Pastellwellen zurücksetzen',
    restoreWhiteButton: 'Standardhintergrund wiederherstellen',
    groupDefault: 'Standard',
    groupLight: 'Hell',
    groupRegular: 'Normal',
    groupDark: 'Dunkel',
    groupGradient: 'Mix'
  },
  Japanese: {
    title: 'テーマエンジン',
    subtitle: 'プリセットカラー設定',
    panelHeader: 'カラーパレットプリセット',
    panelSub: 'お好みの背景色を選択してください',
    resetButton: 'パステルウェーブに戻す',
    restoreWhiteButton: 'デフォルト背景に戻す',
    groupDefault: 'デフォルト',
    groupLight: 'ライト',
    groupRegular: 'レギュラー',
    groupDark: 'ダーク',
    groupGradient: 'Mix'
  },
  Korean: {
    title: '테마 엔진',
    subtitle: '사전 설정 색상 구성',
    panelHeader: '컬러 팔레트 프리셋',
    panelSub: '원하는 배경색을 선택하세요',
    resetButton: '파스텔 웨이브로 리셋',
    restoreWhiteButton: '기본 배경 복원',
    groupDefault: '기본',
    groupLight: '밝은색',
    groupRegular: '일반색',
    groupDark: '어두운색',
    groupGradient: 'Mix'
  },
  Italian: {
    title: 'Motore di Temi',
    subtitle: 'CONFIGURAZIONE DEI COLORI PREDEFINITI',
    panelHeader: 'Tavolozze di Colori Predefinite',
    panelSub: 'seleziona il colore di sfondo preferito',
    resetButton: 'Reimposta Onde Pastello',
    restoreWhiteButton: 'Ripristina Sfondo (Predefinito)',
    groupDefault: 'predefinito',
    groupLight: 'chiaro',
    groupRegular: 'regolare',
    groupDark: 'scuro',
    groupGradient: 'Mix'
  },
  Russian: {
    title: 'Движок тем',
    subtitle: 'НАСТРОЙКА ЦВЕТОВЫХ ПРЕСЕТОВ',
    panelHeader: 'Цветовые палитры',
    panelSub: 'выберите цвет для фона',
    resetButton: 'Сбросить на пастельные волны',
    restoreWhiteButton: 'Восстановить фон (по умолч.)',
    groupDefault: 'по умолчанию',
    groupLight: 'светлый',
    groupRegular: 'обычный',
    groupDark: 'темный',
    groupGradient: 'Mix'
  },
  Luxembourgish: {
    title: 'Theme-Engine',
    subtitle: 'Sproochen an Hannergrënn',
    panelHeader: 'Faarfpaletten-Voreinstellungen',
    panelSub: 'Wielt Är Liiblingshannergrondfaarf',
    resetButton: 'Op Pastellwellen zrécksetzen',
    restoreWhiteButton: 'Standardhannergrond zrécksetzen',
    groupDefault: 'Standard',
    groupLight: 'Hell',
    groupRegular: 'Normal',
    groupDark: 'Däischter',
    groupGradient: 'Mix'
  },
  Dutch: {
    title: 'Thema-Engine',
    subtitle: 'VOORAF INGESTELDE KLEURCONFIGURATIE',
    panelHeader: 'Kleurenpalet Voorkeuren',
    panelSub: 'kies een favoriete achtergrondkleur',
    resetButton: 'Herstellen naar Pastelgolven',
    restoreWhiteButton: 'Standaardachtergrond herstellen',
    groupDefault: 'standaard',
    groupLight: 'licht',
    groupRegular: 'normaal',
    groupDark: 'donker',
    groupGradient: 'Mix'
  },
  Swedish: {
    title: 'Temamotor',
    subtitle: 'FÖRINSTÄLLD FÄRGKONFIGURATION',
    panelHeader: 'Färgpalettförinställningar',
    panelSub: 'välj din favoritfärg för bakgrunden',
    resetButton: 'Återställ till Pastellvågor',
    restoreWhiteButton: 'Återställ standardbakgrund',
    groupDefault: 'standard',
    groupLight: 'ljus',
    groupRegular: 'normal',
    groupDark: 'mörk',
    groupGradient: 'Mix'
  },
  Finnish: {
    title: 'Teemamoottori',
    subtitle: 'ESIASENNETUT VÄRIASETUKSET',
    panelHeader: 'Väripaletin Esivalinnat',
    panelSub: 'valitse suosikkitaustavärisi',
    resetButton: 'Palauta Pastelliaallot',
    restoreWhiteButton: 'Palauta oletustausta',
    groupDefault: 'oletus',
    groupLight: 'vaalea',
    groupRegular: 'tavallinen',
    groupDark: 'tumma',
    groupGradient: 'Mix'
  },
  Hindi: {
    title: 'थीम इंजन',
    subtitle: 'प्रीसेट रंग कॉन्फ़िगरेशन',
    panelHeader: 'कलर पैलेट प्रीसेट',
    panelSub: 'अपनी पसंदीदा पृष्ठभूमि चुनें',
    resetButton: 'पेस्टल वेव्स पर रीसेट करें',
    restoreWhiteButton: 'डिफ़ॉल्ट पृष्ठभूमि बहाल करें',
    groupDefault: 'डिफ़ॉल्ट',
    groupLight: 'हल्का',
    groupRegular: 'सामान्य',
    groupDark: 'गहरा',
    groupGradient: 'मिक्स'
  },
  Norwegian: {
    title: 'Temamotor',
    subtitle: 'FORHÅNDSINNSTILT FARGEKONFIGURASJON',
    panelHeader: 'Fargepalett-forhåndsinnstillinger',
    panelSub: 'velg en favorittfarge til bakgrunnen',
    resetButton: 'Tilbakestill til Pastellbølger',
    restoreWhiteButton: 'Gjenopprett standardbakgrunn',
    groupDefault: 'standard',
    groupLight: 'lys',
    groupRegular: 'vanlig',
    groupDark: 'mørk',
    groupGradient: 'Mix'
  },
  Thai: {
    title: 'เครื่องมือธีม',
    subtitle: 'การตั้งค่าชุดสีสำเร็จรูป',
    panelHeader: 'ชุดสีพื้นหลังสำเร็จรูป',
    panelSub: 'เลือกสีหรือพื้นหลังที่คุณชื่นชอบ',
    resetButton: 'รีเซ็ตเป็น Pastel Waves',
    restoreWhiteButton: 'คืนค่าพื้นหลังเริ่มต้น',
    groupDefault: 'ค่าเริ่มต้น',
    groupLight: 'สีอ่อน',
    groupRegular: 'สีทั่วไป',
    groupDark: 'สีเข้ม',
    groupGradient: 'มิกซ์'
  },
  Portuguese: {
    title: 'Motor de Temas',
    subtitle: 'CONFIGURAÇÃO DE CORES PREDEFINIDAS',
    panelHeader: 'Paletas de Cores Predefinidas',
    panelSub: 'selecione uma cor para a sua favorita',
    resetButton: 'Repor para Ondas Pastel',
    restoreWhiteButton: 'Restaurar Fundo Predefinido',
    groupDefault: 'predefinido',
    groupLight: 'claro',
    groupRegular: 'regular',
    groupDark: 'escuro',
    groupGradient: 'Mix'
  },
  Vietnamese: {
    title: 'Công cụ giao diện',
    subtitle: 'THIẾT LẬP BẢNG MÀU CÀI SẴN',
    panelHeader: 'Bảng màu cài sẵn',
    panelSub: 'chọn một màu cho nền yêu thích của bạn',
    resetButton: 'Đặt lại về Sóng Pastel',
    restoreWhiteButton: 'Khôi phục nền mặc định',
    groupDefault: 'mặc định',
    groupLight: 'sáng',
    groupRegular: 'thường',
    groupDark: 'tối',
    groupGradient: 'Pha trộn'
  },
  Polish: {
    title: 'Silnik Motywów',
    subtitle: 'USTAWIENIA GOTOWYCH PALET KOLORÓW',
    panelHeader: 'Gotowe palety kolorów',
    panelSub: 'wybierz ulubiony kolor tła',
    resetButton: 'Przywróć Pastelowe Fale',
    restoreWhiteButton: 'Przywróć domyślne tło',
    groupDefault: 'domyślne',
    groupLight: 'jasne',
    groupRegular: 'standardowe',
    groupDark: 'ciemne',
    groupGradient: 'Mix'
  },
  Danish: {
    title: 'Temamotor',
    subtitle: 'FORUDINDSTILLEDE FARVEPALETTER',
    panelHeader: 'Forudindstillede farvepaletter',
    panelSub: 'vælg en yndlingsfarve til baggrunden',
    resetButton: 'Nulstil til Pastel Waves',
    restoreWhiteButton: 'Gendan standardbaggrund',
    groupDefault: 'standard',
    groupLight: 'lys',
    groupRegular: 'almindelig',
    groupDark: 'mørk',
    groupGradient: 'Mix'
  },
  Turkish: {
    title: 'Tema Motoru',
    subtitle: 'HAZIR RENK PALETİ AYARI',
    panelHeader: 'Hazır Renk Paletleri',
    panelSub: 'favori arka plan renginizi seçin',
    resetButton: 'Pastel Dalgalara Sıfırla',
    restoreWhiteButton: 'Varsayılan Arka Planı Geri Yükle',
    groupDefault: 'varsayılan',
    groupLight: 'açık',
    groupRegular: 'normal',
    groupDark: 'koyu',
    groupGradient: 'Karışım'
  },
  Greek: {
    title: 'Μηχανή Θεμάτων',
    subtitle: 'ΡΥΘΜΙΣΗ ΠΡΟΕΠΙΛΕΓΜΕΝΩΝ ΧΡΩΜΑΤΩΝ',
    panelHeader: 'Προεπιλεγμένες Παλέτες Χρωμάτων',
    panelSub: 'επιλέξτε ένα αγαπημένο χρώμα φόντου',
    resetButton: 'Επαναφορά σε Pastel Waves',
    restoreWhiteButton: 'Επαναφορά Προεπιλεγμένου Φόντου',
    groupDefault: 'προεπιλογή',
    groupLight: 'ανοιχτό',
    groupRegular: 'κανονικό',
    groupDark: 'σκούρο',
    groupGradient: 'Μείξη'
  }
};

interface Preset {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'default-earth',
    name: 'Default Background',
    color: "url('/assets/aistudio/Gemini_Generated_Image_earth_8ba148bc.jpg') center/cover no-repeat"
  },
  {
    id: 'pastel-waves',
    name: 'Pastel Waves',
    color: "url('/assets/aistudio/Gemini_Generated_Image_mix_b913d992.jpg') center/cover no-repeat"
  }
];

const LIGHT_PRESETS: Preset[] = [
  { id: 'light-grey', name: 'Light Grey', color: '#f8fafc' },
  { id: 'light-blue', name: 'Light Blue', color: '#f0f9ff' },
  { id: 'light-pink', name: 'Light Pink', color: '#fff1f2' },
  { id: 'light-green', name: 'Light Green', color: '#f0fdf4' },
  { id: 'light-yellow', name: 'Light Yellow', color: '#fffbeb' },
  { id: 'light-purple', name: 'Light Purple', color: '#f5f3ff' },
  { id: 'light-orange', name: 'Light Orange', color: '#fff7ed' },
  { id: 'light-teal', name: 'Light Teal', color: '#f0fdfa' },
  { id: 'white-clean', name: 'White', color: '#ffffff' },
  { id: 'light-indigo', name: 'Light Indigo', color: '#f5f7ff' },
];

const REGULAR_PRESETS: Preset[] = [
  { id: 'reg-blue', name: 'Blue', color: '#3b82f6' },
  { id: 'reg-rose', name: 'Rose', color: '#e11d48' },
  { id: 'reg-green', name: 'Green', color: '#22c55e' },
  { id: 'reg-yellow', name: 'Yellow', color: '#eab308' },
  { id: 'reg-purple', name: 'Purple', color: '#8b5cf6' },
  { id: 'reg-orange', name: 'Orange', color: '#f97316' },
  { id: 'reg-teal', name: 'Teal', color: '#14b8a6' },
  { id: 'reg-slate', name: 'Slate', color: '#64748b' },
  { id: 'reg-indigo', name: 'Indigo', color: '#6366f1' },
  { id: 'reg-pink', name: 'Pink', color: '#ec4899' },
];

const DARK_PRESETS: Preset[] = [
  { id: 'dark-navy', name: 'Deep Navy', color: '#01295f' },
  { id: 'dark-violet', name: 'Deep Violet', color: '#370160' },
  { id: 'dark-crimson', name: 'Deep Crimson', color: '#ff0000' },
  { id: 'dark-forest', name: 'Deep Forest', color: '#2a6001' },
  { id: 'dark-espresso', name: 'Dark Espresso', color: '#382209' },
  { id: 'dark-plum', name: 'Deep Plum', color: '#4e062f' },
  { id: 'dark-charcoal', name: 'Charcoal Slate', color: '#33333f' },
  { id: 'dark-royal', name: 'Royal Indigo', color: '#0000ff' },
  { id: 'dark-olive', name: 'Dark Olive', color: '#706934' },
  { id: 'dark-obsidian', name: 'Obsidian', color: '#111111' },
];

const MIXING_PRESETS: Preset[] = [
  { id: 'mix-aurora', name: 'Aurora', color: 'linear-gradient(135deg, #60a5fa, #a78bfa)' },
  { id: 'mix-sunset', name: 'Sunset', color: 'linear-gradient(135deg, #fbbf24, #ef4444)' },
  { id: 'mix-ocean', name: 'Ocean', color: 'linear-gradient(135deg, #0ea5e9, #22c55e)' },
  { id: 'mix-cosmic', name: 'Cosmic', color: 'linear-gradient(135deg, #6366f1, #ec4899)' },
  { id: 'mix-fire', name: 'Fire', color: 'linear-gradient(135deg, #ef4444 0%, #22c55e 34%, #3b82f6 67%, #9333ea 100%)' },
  { id: 'mix-cyber', name: 'Cyber', color: 'linear-gradient(135deg, #2dd4bf, #e879f9)' },
  { id: 'mix-forest', name: 'Decorated White', color: 'radial-gradient(circle at 20% 20%, #bae6fd 0%, #ffffff 50%, #ede9fe 100%)' },
  { id: 'mix-violetteal', name: 'Violet Teal', color: 'linear-gradient(135deg, #7c3aed, #0d9488)' },
  { id: 'mix-cottoncandy', name: 'Cotton Candy', color: 'linear-gradient(135deg, #f472b6, #38bdf8)' },
  { id: 'mix-neonpurple', name: 'Pastel Waves', color: 'linear-gradient(135deg, #fceeff 0%, #eef2ff 50%, #e4f8fb 100%)' },
];

const THEME_PRESET_NAMES: Record<string, Record<string, string>> = {
  English: {
    'default-earth': 'Default Background', 'pastel-waves': 'Pastel Waves',
    'light-grey': 'Light Grey', 'light-blue': 'Light Blue', 'light-pink': 'Light Pink', 'light-green': 'Light Green', 'light-yellow': 'Light Yellow',
    'light-purple': 'Light Purple', 'light-orange': 'Light Orange', 'light-teal': 'Light Teal', 'white-clean': 'White', 'light-indigo': 'Light Indigo',
    'reg-blue': 'Blue', 'reg-rose': 'Rose', 'reg-green': 'Green', 'reg-yellow': 'Yellow', 'reg-purple': 'Purple',
    'reg-orange': 'Orange', 'reg-teal': 'Teal', 'reg-slate': 'Slate', 'reg-indigo': 'Indigo', 'reg-pink': 'Pink',
    'dark-navy': 'Deep Navy', 'dark-violet': 'Deep Violet', 'dark-crimson': 'Deep Crimson', 'dark-forest': 'Deep Forest', 'dark-espresso': 'Dark Espresso',
    'dark-plum': 'Deep Plum', 'dark-charcoal': 'Charcoal Slate', 'dark-royal': 'Royal Indigo', 'dark-olive': 'Dark Olive', 'dark-obsidian': 'Obsidian',
    'mix-aurora': 'Aurora', 'mix-sunset': 'Sunset', 'mix-ocean': 'Ocean', 'mix-cosmic': 'Cosmic', 'mix-fire': 'Fire',
    'mix-cyber': 'Cyber', 'mix-forest': 'Decorated White', 'mix-violetteal': 'Violet Teal', 'mix-cottoncandy': 'Cotton Candy', 'mix-neonpurple': 'Pastel Waves',
  },
  Chinese: {
    'default-earth': '默认背景', 'pastel-waves': '粉彩波纹',
    'light-grey': '浅灰', 'light-blue': '浅蓝', 'light-pink': '浅粉', 'light-green': '浅绿', 'light-yellow': '浅黄',
    'light-purple': '浅紫', 'light-orange': '浅橙', 'light-teal': '浅青绿', 'white-clean': '纯白', 'light-indigo': '浅靛蓝',
    'reg-blue': '蓝色', 'reg-rose': '玫瑰红', 'reg-green': '绿色', 'reg-yellow': '黄色', 'reg-purple': '紫色',
    'reg-orange': '橙色', 'reg-teal': '青绿', 'reg-slate': '石板灰', 'reg-indigo': '靛蓝', 'reg-pink': '粉色',
    'dark-navy': '深海蓝', 'dark-violet': '深紫罗兰', 'dark-crimson': '深绯红', 'dark-forest': '深森林绿', 'dark-espresso': '深浓缩棕',
    'dark-plum': '深梅紫', 'dark-charcoal': '炭灰', 'dark-royal': '皇家靛蓝', 'dark-olive': '深橄榄绿', 'dark-obsidian': '黑曜石',
    'mix-aurora': '极光', 'mix-sunset': '日落', 'mix-ocean': '海洋', 'mix-cosmic': '宇宙', 'mix-fire': '烈焰',
    'mix-cyber': '赛博', 'mix-forest': '饰白渐变', 'mix-violetteal': '紫青渐变', 'mix-cottoncandy': '棉花糖', 'mix-neonpurple': '粉彩波纹',
  },
  'Chinese Traditional': {
    'default-earth': '預設背景', 'pastel-waves': '粉彩波紋',
    'light-grey': '淺灰', 'light-blue': '淺藍', 'light-pink': '淺粉', 'light-green': '淺綠', 'light-yellow': '淺黃',
    'light-purple': '淺紫', 'light-orange': '淺橙', 'light-teal': '淺青綠', 'white-clean': '純白', 'light-indigo': '淺靛藍',
    'reg-blue': '藍色', 'reg-rose': '玫瑰紅', 'reg-green': '綠色', 'reg-yellow': '黃色', 'reg-purple': '紫色',
    'reg-orange': '橙色', 'reg-teal': '青綠', 'reg-slate': '石板灰', 'reg-indigo': '靛藍', 'reg-pink': '粉色',
    'dark-navy': '深海藍', 'dark-violet': '深紫羅蘭', 'dark-crimson': '深緋紅', 'dark-forest': '深森林綠', 'dark-espresso': '深濃縮棕',
    'dark-plum': '深梅紫', 'dark-charcoal': '炭灰', 'dark-royal': '皇家靛藍', 'dark-olive': '深橄欖綠', 'dark-obsidian': '黑曜石',
    'mix-aurora': '極光', 'mix-sunset': '日落', 'mix-ocean': '海洋', 'mix-cosmic': '宇宙', 'mix-fire': '烈焰',
    'mix-cyber': '賽博', 'mix-forest': '飾白漸層', 'mix-violetteal': '紫青漸層', 'mix-cottoncandy': '棉花糖', 'mix-neonpurple': '粉彩波紋',
  },
  Spanish: {
    'default-earth': 'Fondo predeterminado', 'pastel-waves': 'Ondas pastel',
    'light-grey': 'Gris claro', 'light-blue': 'Azul claro', 'light-pink': 'Rosa claro', 'light-green': 'Verde claro', 'light-yellow': 'Amarillo claro',
    'light-purple': 'Morado claro', 'light-orange': 'Naranja claro', 'light-teal': 'Verde azulado claro', 'white-clean': 'Blanco', 'light-indigo': 'Índigo claro',
    'reg-blue': 'Azul', 'reg-rose': 'Rosa intenso', 'reg-green': 'Verde', 'reg-yellow': 'Amarillo', 'reg-purple': 'Púrpura',
    'reg-orange': 'Naranja', 'reg-teal': 'Verde azulado', 'reg-slate': 'Pizarra', 'reg-indigo': 'Índigo', 'reg-pink': 'Rosa',
    'dark-navy': 'Azul marino oscuro', 'dark-violet': 'Violeta oscuro', 'dark-crimson': 'Carmesí oscuro', 'dark-forest': 'Bosque oscuro', 'dark-espresso': 'Espresso oscuro',
    'dark-plum': 'Ciruela oscuro', 'dark-charcoal': 'Carbón pizarra', 'dark-royal': 'Índigo real', 'dark-olive': 'Oliva oscuro', 'dark-obsidian': 'Obsidiana',
    'mix-aurora': 'Aurora', 'mix-sunset': 'Atardecer', 'mix-ocean': 'Océano', 'mix-cosmic': 'Cósmico', 'mix-fire': 'Fuego',
    'mix-cyber': 'Ciber', 'mix-forest': 'Blanco decorado', 'mix-violetteal': 'Violeta y turquesa', 'mix-cottoncandy': 'Algodón de azúcar', 'mix-neonpurple': 'Ondas pastel',
  },
  French: {
    'default-earth': 'Fond par défaut', 'pastel-waves': 'Vagues pastel',
    'light-grey': 'Gris clair', 'light-blue': 'Bleu clair', 'light-pink': 'Rose clair', 'light-green': 'Vert clair', 'light-yellow': 'Jaune clair',
    'light-purple': 'Violet clair', 'light-orange': 'Orange clair', 'light-teal': 'Sarcelle clair', 'white-clean': 'Blanc', 'light-indigo': 'Indigo clair',
    'reg-blue': 'Bleu', 'reg-rose': 'Rose vif', 'reg-green': 'Vert', 'reg-yellow': 'Jaune', 'reg-purple': 'Violet',
    'reg-orange': 'Orange', 'reg-teal': 'Sarcelle', 'reg-slate': 'Ardoise', 'reg-indigo': 'Indigo', 'reg-pink': 'Rose',
    'dark-navy': 'Bleu marine profond', 'dark-violet': 'Violet profond', 'dark-crimson': 'Cramoisi profond', 'dark-forest': 'Forêt profonde', 'dark-espresso': 'Expresso foncé',
    'dark-plum': 'Prune profond', 'dark-charcoal': 'Anthracite', 'dark-royal': 'Indigo royal', 'dark-olive': 'Olive foncé', 'dark-obsidian': 'Obsidienne',
    'mix-aurora': 'Aurore', 'mix-sunset': 'Coucher de soleil', 'mix-ocean': 'Océan', 'mix-cosmic': 'Cosmique', 'mix-fire': 'Feu',
    'mix-cyber': 'Cyber', 'mix-forest': 'Blanc décoré', 'mix-violetteal': 'Violet sarcelle', 'mix-cottoncandy': 'Barbe à papa', 'mix-neonpurple': 'Vagues pastel',
  },
  German: {
    'default-earth': 'Standardhintergrund', 'pastel-waves': 'Pastellwellen',
    'light-grey': 'Hellgrau', 'light-blue': 'Hellblau', 'light-pink': 'Hellrosa', 'light-green': 'Hellgrün', 'light-yellow': 'Hellgelb',
    'light-purple': 'Hellviolett', 'light-orange': 'Hellorange', 'light-teal': 'Helltürkis', 'white-clean': 'Weiß', 'light-indigo': 'Hellindigo',
    'reg-blue': 'Blau', 'reg-rose': 'Rosé', 'reg-green': 'Grün', 'reg-yellow': 'Gelb', 'reg-purple': 'Violett',
    'reg-orange': 'Orange', 'reg-teal': 'Türkis', 'reg-slate': 'Schiefer', 'reg-indigo': 'Indigo', 'reg-pink': 'Pink',
    'dark-navy': 'Tiefes Marineblau', 'dark-violet': 'Tiefes Violett', 'dark-crimson': 'Tiefes Karmesin', 'dark-forest': 'Tiefes Waldgrün', 'dark-espresso': 'Dunkles Espresso',
    'dark-plum': 'Tiefes Pflaume', 'dark-charcoal': 'Anthrazitschiefer', 'dark-royal': 'Königsindigo', 'dark-olive': 'Dunkeloliv', 'dark-obsidian': 'Obsidian',
    'mix-aurora': 'Polarlicht', 'mix-sunset': 'Sonnenuntergang', 'mix-ocean': 'Ozean', 'mix-cosmic': 'Kosmisch', 'mix-fire': 'Feuer',
    'mix-cyber': 'Cyber', 'mix-forest': 'Dekoratives Weiß', 'mix-violetteal': 'Violett-Petrol', 'mix-cottoncandy': 'Zuckerwatte', 'mix-neonpurple': 'Pastellwellen',
  },
  Japanese: {
    'default-earth': 'デフォルト背景', 'pastel-waves': 'パステルウェーブ',
    'light-grey': 'ライトグレー', 'light-blue': 'ライトブルー', 'light-pink': 'ライトピンク', 'light-green': 'ライトグリーン', 'light-yellow': 'ライトイエロー',
    'light-purple': 'ライトパープル', 'light-orange': 'ライトオレンジ', 'light-teal': 'ライトティール', 'white-clean': 'ホワイト', 'light-indigo': 'ライトインディゴ',
    'reg-blue': 'ブルー', 'reg-rose': 'ローズ', 'reg-green': 'グリーン', 'reg-yellow': 'イエロー', 'reg-purple': 'パープル',
    'reg-orange': 'オレンジ', 'reg-teal': 'ティール', 'reg-slate': 'スレート', 'reg-indigo': 'インディゴ', 'reg-pink': 'ピンク',
    'dark-navy': 'ディープネイビー', 'dark-violet': 'ディープバイオレット', 'dark-crimson': 'ディープクリムゾン', 'dark-forest': 'ディープフォレスト', 'dark-espresso': 'ダークエスプレッソ',
    'dark-plum': 'ディーププラム', 'dark-charcoal': 'チャコールスレート', 'dark-royal': 'ロイヤルインディゴ', 'dark-olive': 'ダークオリーブ', 'dark-obsidian': 'オブシディアン',
    'mix-aurora': 'オーロラ', 'mix-sunset': 'サンセット', 'mix-ocean': 'オーシャン', 'mix-cosmic': 'コズミック', 'mix-fire': 'ファイア',
    'mix-cyber': 'サイバー', 'mix-forest': 'デコレーションホワイト', 'mix-violetteal': 'バイオレットティール', 'mix-cottoncandy': 'コットンキャンディ', 'mix-neonpurple': 'パステルウェーブ',
  },
  Korean: {
    'default-earth': '기본 배경', 'pastel-waves': '파스텔 웨이브',
    'light-grey': '연한 회색', 'light-blue': '연한 파랑', 'light-pink': '연한 분홍', 'light-green': '연한 초록', 'light-yellow': '연한 노랑',
    'light-purple': '연한 보라', 'light-orange': '연한 주황', 'light-teal': '연한 청록', 'white-clean': '화이트', 'light-indigo': '연한 남색',
    'reg-blue': '파랑', 'reg-rose': '로즈', 'reg-green': '초록', 'reg-yellow': '노랑', 'reg-purple': '보라',
    'reg-orange': '주황', 'reg-teal': '청록', 'reg-slate': '슬레이트', 'reg-indigo': '인디고', 'reg-pink': '분홍',
    'dark-navy': '딥 네이비', 'dark-violet': '딥 바이올렛', 'dark-crimson': '딥 크림슨', 'dark-forest': '딥 포레스트', 'dark-espresso': '다크 에스프레소',
    'dark-plum': '딥 플럼', 'dark-charcoal': '차콜 슬레이트', 'dark-royal': '로열 인디고', 'dark-olive': '다크 올리브', 'dark-obsidian': '옵시디언',
    'mix-aurora': '오로라', 'mix-sunset': '선셋', 'mix-ocean': '오션', 'mix-cosmic': '코스믹', 'mix-fire': '파이어',
    'mix-cyber': '사이버', 'mix-forest': '데코 화이트', 'mix-violetteal': '바이올렛 틸', 'mix-cottoncandy': '코튼 캔디', 'mix-neonpurple': '파스텔 웨이브',
  },
  Italian: {
    'default-earth': 'Sfondo predefinito', 'pastel-waves': 'Onde pastello',
    'light-grey': 'Grigio chiaro', 'light-blue': 'Azzurro chiaro', 'light-pink': 'Rosa chiaro', 'light-green': 'Verde chiaro', 'light-yellow': 'Giallo chiaro',
    'light-purple': 'Viola chiaro', 'light-orange': 'Arancione chiaro', 'light-teal': 'Verde acqua chiaro', 'white-clean': 'Bianco', 'light-indigo': 'Indaco chiaro',
    'reg-blue': 'Blu', 'reg-rose': 'Rosa intenso', 'reg-green': 'Verde', 'reg-yellow': 'Giallo', 'reg-purple': 'Viola',
    'reg-orange': 'Arancione', 'reg-teal': 'Verde acqua', 'reg-slate': 'Ardesia', 'reg-indigo': 'Indaco', 'reg-pink': 'Rosa',
    'dark-navy': 'Blu marino scuro', 'dark-violet': 'Viola intenso', 'dark-crimson': 'Cremisi intenso', 'dark-forest': 'Foresta profonda', 'dark-espresso': 'Espresso scuro',
    'dark-plum': 'Prugna scuro', 'dark-charcoal': 'Ardesia carbone', 'dark-royal': 'Indaco reale', 'dark-olive': 'Oliva scuro', 'dark-obsidian': 'Ossidiana',
    'mix-aurora': 'Aurora', 'mix-sunset': 'Tramonto', 'mix-ocean': 'Oceano', 'mix-cosmic': 'Cosmico', 'mix-fire': 'Fuoco',
    'mix-cyber': 'Cyber', 'mix-forest': 'Bianco decorato', 'mix-violetteal': 'Viola e verde acqua', 'mix-cottoncandy': 'Zucchero filato', 'mix-neonpurple': 'Onde pastello',
  },
  Russian: {
    'default-earth': 'Фон по умолчанию', 'pastel-waves': 'Пастельные волны',
    'light-grey': 'Светло-серый', 'light-blue': 'Светло-голубой', 'light-pink': 'Светло-розовый', 'light-green': 'Светло-зелёный', 'light-yellow': 'Светло-жёлтый',
    'light-purple': 'Светло-фиолетовый', 'light-orange': 'Светло-оранжевый', 'light-teal': 'Светло-бирюзовый', 'white-clean': 'Белый', 'light-indigo': 'Светлый индиго',
    'reg-blue': 'Синий', 'reg-rose': 'Розовый кармин', 'reg-green': 'Зелёный', 'reg-yellow': 'Жёлтый', 'reg-purple': 'Фиолетовый',
    'reg-orange': 'Оранжевый', 'reg-teal': 'Бирюзовый', 'reg-slate': 'Сланцевый', 'reg-indigo': 'Индиго', 'reg-pink': 'Розовый',
    'dark-navy': 'Тёмно-синий', 'dark-violet': 'Тёмно-фиолетовый', 'dark-crimson': 'Тёмно-малиновый', 'dark-forest': 'Тёмный лесной', 'dark-espresso': 'Тёмный эспрессо',
    'dark-plum': 'Тёмно-сливовый', 'dark-charcoal': 'Угольно-сланцевый', 'dark-royal': 'Королевский индиго', 'dark-olive': 'Тёмно-оливковый', 'dark-obsidian': 'Обсидиан',
    'mix-aurora': 'Аврора', 'mix-sunset': 'Закат', 'mix-ocean': 'Океан', 'mix-cosmic': 'Космос', 'mix-fire': 'Огонь',
    'mix-cyber': 'Кибер', 'mix-forest': 'Декоративный белый', 'mix-violetteal': 'Фиолетово-бирюзовый', 'mix-cottoncandy': 'Сладкая вата', 'mix-neonpurple': 'Пастельные волны',
  },
  Luxembourgish: {
    'default-earth': 'Standardhannergrond', 'pastel-waves': 'Pastellwellen',
    'light-grey': 'Hellgro', 'light-blue': 'Hellblo', 'light-pink': 'Hellrosa', 'light-green': 'Hellgréng', 'light-yellow': 'Hellgiel',
    'light-purple': 'Hellmof', 'light-orange': 'Hellorange', 'light-teal': 'Helltürkis', 'white-clean': 'Wäiss', 'light-indigo': 'Hellindigo',
    'reg-blue': 'Blo', 'reg-rose': 'Rosé', 'reg-green': 'Gréng', 'reg-yellow': 'Giel', 'reg-purple': 'Mof',
    'reg-orange': 'Orange', 'reg-teal': 'Türkis', 'reg-slate': 'Schiefer', 'reg-indigo': 'Indigo', 'reg-pink': 'Rosa',
    'dark-navy': 'Déif Marineblo', 'dark-violet': 'Déif Mof', 'dark-crimson': 'Déif Karmesin', 'dark-forest': 'Déif Bëschgréng', 'dark-espresso': 'Däischter Espresso',
    'dark-plum': 'Déif Promm', 'dark-charcoal': 'Kueleschiefer', 'dark-royal': 'Kinneksindigo', 'dark-olive': 'Däischter Olif', 'dark-obsidian': 'Obsidian',
    'mix-aurora': 'Polarliicht', 'mix-sunset': 'Sonnenënnergang', 'mix-ocean': 'Ozean', 'mix-cosmic': 'Kosmesch', 'mix-fire': 'Feier',
    'mix-cyber': 'Cyber', 'mix-forest': 'Dekoréiert Wäiss', 'mix-violetteal': 'Mof-Türkis', 'mix-cottoncandy': 'Zockerwatt', 'mix-neonpurple': 'Pastellwellen',
  },
  Dutch: {
    'default-earth': 'Standaardachtergrond', 'pastel-waves': 'Pastelgolven',
    'light-grey': 'Lichtgrijs', 'light-blue': 'Lichtblauw', 'light-pink': 'Lichtroze', 'light-green': 'Lichtgroen', 'light-yellow': 'Lichtgeel',
    'light-purple': 'Lichtpaars', 'light-orange': 'Lichtoranje', 'light-teal': 'Lichtturquoise', 'white-clean': 'Wit', 'light-indigo': 'Lichtindigo',
    'reg-blue': 'Blauw', 'reg-rose': 'Rozerood', 'reg-green': 'Groen', 'reg-yellow': 'Geel', 'reg-purple': 'Paars',
    'reg-orange': 'Oranje', 'reg-teal': 'Zeegroen', 'reg-slate': 'Leigrijs', 'reg-indigo': 'Indigo', 'reg-pink': 'Roze',
    'dark-navy': 'Diep marineblauw', 'dark-violet': 'Dieppaars', 'dark-crimson': 'Diep karmozijnrood', 'dark-forest': 'Diep bosgroen', 'dark-espresso': 'Donker espresso',
    'dark-plum': 'Diep pruim', 'dark-charcoal': 'Antraciet', 'dark-royal': 'Koningsindigo', 'dark-olive': 'Donkerolijf', 'dark-obsidian': 'Obsidiaan',
    'mix-aurora': 'Noorderlicht', 'mix-sunset': 'Zonsondergang', 'mix-ocean': 'Oceaan', 'mix-cosmic': 'Kosmisch', 'mix-fire': 'Vuur',
    'mix-cyber': 'Cyber', 'mix-forest': 'Gedecoreerd wit', 'mix-violetteal': 'Paars-zeegroen', 'mix-cottoncandy': 'Suikerspin', 'mix-neonpurple': 'Pastelgolven',
  },
  Swedish: {
    'default-earth': 'Standardbakgrund', 'pastel-waves': 'Pastellvågor',
    'light-grey': 'Ljusgrå', 'light-blue': 'Ljusblå', 'light-pink': 'Ljusrosa', 'light-green': 'Ljusgrön', 'light-yellow': 'Ljusgul',
    'light-purple': 'Ljuslila', 'light-orange': 'Ljusorange', 'light-teal': 'Ljus turkos', 'white-clean': 'Vit', 'light-indigo': 'Ljusindigo',
    'reg-blue': 'Blå', 'reg-rose': 'Ros', 'reg-green': 'Grön', 'reg-yellow': 'Gul', 'reg-purple': 'Lila',
    'reg-orange': 'Orange', 'reg-teal': 'Turkos', 'reg-slate': 'Skiffer', 'reg-indigo': 'Indigo', 'reg-pink': 'Rosa',
    'dark-navy': 'Djup marinblå', 'dark-violet': 'Djup violett', 'dark-crimson': 'Djup karmosinröd', 'dark-forest': 'Djup skogsgrön', 'dark-espresso': 'Mörk espresso',
    'dark-plum': 'Djup plommon', 'dark-charcoal': 'Kolskiffer', 'dark-royal': 'Kunglig indigo', 'dark-olive': 'Mörk oliv', 'dark-obsidian': 'Obsidian',
    'mix-aurora': 'Norrsken', 'mix-sunset': 'Solnedgång', 'mix-ocean': 'Hav', 'mix-cosmic': 'Kosmisk', 'mix-fire': 'Eld',
    'mix-cyber': 'Cyber', 'mix-forest': 'Dekorerad vit', 'mix-violetteal': 'Violett turkos', 'mix-cottoncandy': 'Sockervadd', 'mix-neonpurple': 'Pastellvågor',
  },
  Finnish: {
    'default-earth': 'Oletustausta', 'pastel-waves': 'Pastelliaallot',
    'light-grey': 'Vaaleanharmaa', 'light-blue': 'Vaaleansininen', 'light-pink': 'Vaaleanpunainen', 'light-green': 'Vaaleanvihreä', 'light-yellow': 'Vaaleankeltainen',
    'light-purple': 'Vaaleanvioletti', 'light-orange': 'Vaaleanoranssi', 'light-teal': 'Vaalea sinivihreä', 'white-clean': 'Valkoinen', 'light-indigo': 'Vaalea indigo',
    'reg-blue': 'Sininen', 'reg-rose': 'Ruusunpunainen', 'reg-green': 'Vihreä', 'reg-yellow': 'Keltainen', 'reg-purple': 'Violetti',
    'reg-orange': 'Oranssi', 'reg-teal': 'Sinivihreä', 'reg-slate': 'Liuskekivi', 'reg-indigo': 'Indigo', 'reg-pink': 'Pinkki',
    'dark-navy': 'Syvä laivastonsininen', 'dark-violet': 'Syvä violetti', 'dark-crimson': 'Syvä karmiini', 'dark-forest': 'Syvä metsänvihreä', 'dark-espresso': 'Tumma espresso',
    'dark-plum': 'Syvä luumu', 'dark-charcoal': 'Hiilenharmaa', 'dark-royal': 'Kuninkaallinen indigo', 'dark-olive': 'Tumma oliivi', 'dark-obsidian': 'Obsidiaani',
    'mix-aurora': 'Revontulet', 'mix-sunset': 'Auringonlasku', 'mix-ocean': 'Valtameri', 'mix-cosmic': 'Kosminen', 'mix-fire': 'Tuli',
    'mix-cyber': 'Kyber', 'mix-forest': 'Koristeltu valkoinen', 'mix-violetteal': 'Violetti-sinivihreä', 'mix-cottoncandy': 'Hattara', 'mix-neonpurple': 'Pastelliaallot',
  },
  Hindi: {
    'default-earth': 'डिफ़ॉल्ट पृष्ठभूमि', 'pastel-waves': 'पेस्टल वेव्स',
    'light-grey': 'हल्का ग्रे', 'light-blue': 'हल्का नीला', 'light-pink': 'हल्का गुलाबी', 'light-green': 'हल्का हरा', 'light-yellow': 'हल्का पीला',
    'light-purple': 'हल्का बैंगनी', 'light-orange': 'हल्का नारंगी', 'light-teal': 'हल्का टील', 'white-clean': 'सफ़ेद', 'light-indigo': 'हल्का इंडिगो',
    'reg-blue': 'नीला', 'reg-rose': 'रोज़', 'reg-green': 'हरा', 'reg-yellow': 'पीला', 'reg-purple': 'बैंगनी',
    'reg-orange': 'नारंगी', 'reg-teal': 'टील', 'reg-slate': 'स्लेट', 'reg-indigo': 'इंडिगो', 'reg-pink': 'गुलाबी',
    'dark-navy': 'गहरा नेवी', 'dark-violet': 'गहरा वायलेट', 'dark-crimson': 'गहरा क्रिमसन', 'dark-forest': 'गहरा फ़ॉरेस्ट', 'dark-espresso': 'डार्क एस्प्रेसो',
    'dark-plum': 'गहरा प्लम', 'dark-charcoal': 'चारकोल स्लेट', 'dark-royal': 'रॉयल इंडिगो', 'dark-olive': 'डार्क ऑलिव', 'dark-obsidian': 'ओब्सीडियन',
    'mix-aurora': 'ऑरोरा', 'mix-sunset': 'सनसेट', 'mix-ocean': 'ओशन', 'mix-cosmic': 'कॉस्मिक', 'mix-fire': 'फ़ायर',
    'mix-cyber': 'साइबर', 'mix-forest': 'सजावटी सफ़ेद', 'mix-violetteal': 'वायलेट टील', 'mix-cottoncandy': 'कॉटन कैंडी', 'mix-neonpurple': 'पेस्टल वेव्स',
  },
  Norwegian: {
    'default-earth': 'Standardbakgrunn', 'pastel-waves': 'Pastellbølger',
    'light-grey': 'Lysegrå', 'light-blue': 'Lyseblå', 'light-pink': 'Lyserosa', 'light-green': 'Lysegrønn', 'light-yellow': 'Lysegul',
    'light-purple': 'Lys lilla', 'light-orange': 'Lys oransje', 'light-teal': 'Lys blågrønn', 'white-clean': 'Hvit', 'light-indigo': 'Lys indigo',
    'reg-blue': 'Blå', 'reg-rose': 'Rose', 'reg-green': 'Grønn', 'reg-yellow': 'Gul', 'reg-purple': 'Lilla',
    'reg-orange': 'Oransje', 'reg-teal': 'Blågrønn', 'reg-slate': 'Skifer', 'reg-indigo': 'Indigo', 'reg-pink': 'Rosa',
    'dark-navy': 'Dyp marineblå', 'dark-violet': 'Dyp fiolett', 'dark-crimson': 'Dyp karmosin', 'dark-forest': 'Dyp skoggrønn', 'dark-espresso': 'Mørk espresso',
    'dark-plum': 'Dyp plomme', 'dark-charcoal': 'Kullskifer', 'dark-royal': 'Kongelig indigo', 'dark-olive': 'Mørk oliven', 'dark-obsidian': 'Obsidian',
    'mix-aurora': 'Nordlys', 'mix-sunset': 'Solnedgang', 'mix-ocean': 'Hav', 'mix-cosmic': 'Kosmisk', 'mix-fire': 'Ild',
    'mix-cyber': 'Cyber', 'mix-forest': 'Dekorert hvit', 'mix-violetteal': 'Fiolett blågrønn', 'mix-cottoncandy': 'Sukkerspinn', 'mix-neonpurple': 'Pastellbølger',
  },
  Thai: {
    'default-earth': 'พื้นหลังเริ่มต้น', 'pastel-waves': 'คลื่นพาสเทล',
    'light-grey': 'เทาอ่อน', 'light-blue': 'ฟ้าอ่อน', 'light-pink': 'ชมพูอ่อน', 'light-green': 'เขียวอ่อน', 'light-yellow': 'เหลืองอ่อน',
    'light-purple': 'ม่วงอ่อน', 'light-orange': 'ส้มอ่อน', 'light-teal': 'เขียวน้ำทะเลอ่อน', 'white-clean': 'ขาว', 'light-indigo': 'ครามอ่อน',
    'reg-blue': 'น้ำเงิน', 'reg-rose': 'กุหลาบ', 'reg-green': 'เขียว', 'reg-yellow': 'เหลือง', 'reg-purple': 'ม่วง',
    'reg-orange': 'ส้ม', 'reg-teal': 'เขียวน้ำทะเล', 'reg-slate': 'เทาหินชนวน', 'reg-indigo': 'คราม', 'reg-pink': 'ชมพู',
    'dark-navy': 'น้ำเงินกรมท่าเข้ม', 'dark-violet': 'ม่วงเข้ม', 'dark-crimson': 'แดงเข้ม', 'dark-forest': 'เขียวป่าเข้ม', 'dark-espresso': 'น้ำตาลเอสเพรสโซเข้ม',
    'dark-plum': 'พลัมเข้ม', 'dark-charcoal': 'เทาถ่านเข้ม', 'dark-royal': 'ครามหลวง', 'dark-olive': 'เขียวมะกอกเข้ม', 'dark-obsidian': 'ออบซิเดียน',
    'mix-aurora': 'ออโรรา', 'mix-sunset': 'พระอาทิตย์ตก', 'mix-ocean': 'มหาสมุทร', 'mix-cosmic': 'จักรวาล', 'mix-fire': 'เปลวไฟ',
    'mix-cyber': 'ไซเบอร์', 'mix-forest': 'ขาวตกแต่ง', 'mix-violetteal': 'ม่วงน้ำทะเล', 'mix-cottoncandy': 'สายไหม', 'mix-neonpurple': 'คลื่นพาสเทล',
  },
  Portuguese: {
    'default-earth': 'Fundo predefinido', 'pastel-waves': 'Ondas pastel',
    'light-grey': 'Cinzento claro', 'light-blue': 'Azul claro', 'light-pink': 'Rosa claro', 'light-green': 'Verde claro', 'light-yellow': 'Amarelo claro',
    'light-purple': 'Roxo claro', 'light-orange': 'Laranja claro', 'light-teal': 'Verde-azulado claro', 'white-clean': 'Branco', 'light-indigo': 'Índigo claro',
    'reg-blue': 'Azul', 'reg-rose': 'Rosa intenso', 'reg-green': 'Verde', 'reg-yellow': 'Amarelo', 'reg-purple': 'Roxo',
    'reg-orange': 'Laranja', 'reg-teal': 'Verde-azulado', 'reg-slate': 'Ardósia', 'reg-indigo': 'Índigo', 'reg-pink': 'Rosa',
    'dark-navy': 'Azul-marinho profundo', 'dark-violet': 'Violeta profundo', 'dark-crimson': 'Carmesim profundo', 'dark-forest': 'Floresta profunda', 'dark-espresso': 'Expresso escuro',
    'dark-plum': 'Ameixa profundo', 'dark-charcoal': 'Carvão ardósia', 'dark-royal': 'Índigo real', 'dark-olive': 'Azeitona escuro', 'dark-obsidian': 'Obsidiana',
    'mix-aurora': 'Aurora', 'mix-sunset': 'Pôr do sol', 'mix-ocean': 'Oceano', 'mix-cosmic': 'Cósmico', 'mix-fire': 'Fogo',
    'mix-cyber': 'Ciber', 'mix-forest': 'Branco decorado', 'mix-violetteal': 'Violeta e turquesa', 'mix-cottoncandy': 'Algodão doce', 'mix-neonpurple': 'Ondas pastel',
  },
  Vietnamese: {
    'default-earth': 'Nền mặc định', 'pastel-waves': 'Sóng pastel',
    'light-grey': 'Xám nhạt', 'light-blue': 'Xanh dương nhạt', 'light-pink': 'Hồng nhạt', 'light-green': 'Xanh lá nhạt', 'light-yellow': 'Vàng nhạt',
    'light-purple': 'Tím nhạt', 'light-orange': 'Cam nhạt', 'light-teal': 'Xanh mòng két nhạt', 'white-clean': 'Trắng', 'light-indigo': 'Chàm nhạt',
    'reg-blue': 'Xanh dương', 'reg-rose': 'Hồng hoa hồng', 'reg-green': 'Xanh lá', 'reg-yellow': 'Vàng', 'reg-purple': 'Tím',
    'reg-orange': 'Cam', 'reg-teal': 'Xanh mòng két', 'reg-slate': 'Xám đá', 'reg-indigo': 'Chàm', 'reg-pink': 'Hồng',
    'dark-navy': 'Xanh hải quân đậm', 'dark-violet': 'Tím đậm', 'dark-crimson': 'Đỏ thẫm', 'dark-forest': 'Xanh rừng đậm', 'dark-espresso': 'Nâu cà phê đậm',
    'dark-plum': 'Mận đậm', 'dark-charcoal': 'Than chì', 'dark-royal': 'Chàm hoàng gia', 'dark-olive': 'Ô liu đậm', 'dark-obsidian': 'Đá vỏ chai',
    'mix-aurora': 'Cực quang', 'mix-sunset': 'Hoàng hôn', 'mix-ocean': 'Đại dương', 'mix-cosmic': 'Vũ trụ', 'mix-fire': 'Ngọn lửa',
    'mix-cyber': 'Không gian mạng', 'mix-forest': 'Trắng trang trí', 'mix-violetteal': 'Tím xanh ngọc', 'mix-cottoncandy': 'Kẹo bông', 'mix-neonpurple': 'Sóng pastel',
  },
  Polish: {
    'default-earth': 'Domyślne tło', 'pastel-waves': 'Pastelowe fale',
    'light-grey': 'Jasnoszary', 'light-blue': 'Jasnoniebieski', 'light-pink': 'Jasnoróżowy', 'light-green': 'Jasnozielony', 'light-yellow': 'Jasnożółty',
    'light-purple': 'Jasnofioletowy', 'light-orange': 'Jasnopomarańczowy', 'light-teal': 'Jasnomorski', 'white-clean': 'Biały', 'light-indigo': 'Jasne indygo',
    'reg-blue': 'Niebieski', 'reg-rose': 'Różany', 'reg-green': 'Zielony', 'reg-yellow': 'Żółty', 'reg-purple': 'Fioletowy',
    'reg-orange': 'Pomarańczowy', 'reg-teal': 'Morski', 'reg-slate': 'Łupkowy', 'reg-indigo': 'Indygo', 'reg-pink': 'Różowy',
    'dark-navy': 'Głęboki granat', 'dark-violet': 'Głęboki fiolet', 'dark-crimson': 'Głęboki karmazyn', 'dark-forest': 'Głęboka zieleń lasu', 'dark-espresso': 'Ciemne espresso',
    'dark-plum': 'Głęboka śliwka', 'dark-charcoal': 'Grafitowy łupek', 'dark-royal': 'Królewskie indygo', 'dark-olive': 'Ciemna oliwka', 'dark-obsidian': 'Obsydian',
    'mix-aurora': 'Zorza', 'mix-sunset': 'Zachód słońca', 'mix-ocean': 'Ocean', 'mix-cosmic': 'Kosmos', 'mix-fire': 'Ogień',
    'mix-cyber': 'Cyber', 'mix-forest': 'Dekoracyjna biel', 'mix-violetteal': 'Fioletowo-morski', 'mix-cottoncandy': 'Wata cukrowa', 'mix-neonpurple': 'Pastelowe fale',
  },
  Danish: {
    'default-earth': 'Standardbaggrund', 'pastel-waves': 'Pastelbølger',
    'light-grey': 'Lysegrå', 'light-blue': 'Lyseblå', 'light-pink': 'Lyserød', 'light-green': 'Lysegrøn', 'light-yellow': 'Lysegul',
    'light-purple': 'Lyslilla', 'light-orange': 'Lysorange', 'light-teal': 'Lys blågrøn', 'white-clean': 'Hvid', 'light-indigo': 'Lys indigo',
    'reg-blue': 'Blå', 'reg-rose': 'Rosa', 'reg-green': 'Grøn', 'reg-yellow': 'Gul', 'reg-purple': 'Lilla',
    'reg-orange': 'Orange', 'reg-teal': 'Blågrøn', 'reg-slate': 'Skifer', 'reg-indigo': 'Indigo', 'reg-pink': 'Pink',
    'dark-navy': 'Dyb marineblå', 'dark-violet': 'Dyb violet', 'dark-crimson': 'Dyb karmoisin', 'dark-forest': 'Dyb skovgrøn', 'dark-espresso': 'Mørk espresso',
    'dark-plum': 'Dyb blomme', 'dark-charcoal': 'Kulskifer', 'dark-royal': 'Kongelig indigo', 'dark-olive': 'Mørk oliven', 'dark-obsidian': 'Obsidian',
    'mix-aurora': 'Nordlys', 'mix-sunset': 'Solnedgang', 'mix-ocean': 'Ocean', 'mix-cosmic': 'Kosmisk', 'mix-fire': 'Ild',
    'mix-cyber': 'Cyber', 'mix-forest': 'Dekoreret hvid', 'mix-violetteal': 'Violet blågrøn', 'mix-cottoncandy': 'Candyfloss', 'mix-neonpurple': 'Pastelbølger',
  },
  Turkish: {
    'default-earth': 'Varsayılan Arka Plan', 'pastel-waves': 'Pastel Dalgalar',
    'light-grey': 'Açık Gri', 'light-blue': 'Açık Mavi', 'light-pink': 'Açık Pembe', 'light-green': 'Açık Yeşil', 'light-yellow': 'Açık Sarı',
    'light-purple': 'Açık Mor', 'light-orange': 'Açık Turuncu', 'light-teal': 'Açık Turkuaz', 'white-clean': 'Beyaz', 'light-indigo': 'Açık Çivit',
    'reg-blue': 'Mavi', 'reg-rose': 'Gül Kurusu', 'reg-green': 'Yeşil', 'reg-yellow': 'Sarı', 'reg-purple': 'Mor',
    'reg-orange': 'Turuncu', 'reg-teal': 'Turkuaz', 'reg-slate': 'Arduvaz', 'reg-indigo': 'Çivit', 'reg-pink': 'Pembe',
    'dark-navy': 'Koyu Lacivert', 'dark-violet': 'Koyu Menekşe', 'dark-crimson': 'Koyu Kırmızı', 'dark-forest': 'Koyu Orman', 'dark-espresso': 'Koyu Espresso',
    'dark-plum': 'Koyu Erik', 'dark-charcoal': 'Kömür Arduvaz', 'dark-royal': 'Kraliyet Çivit', 'dark-olive': 'Koyu Zeytin', 'dark-obsidian': 'Obsidyen',
    'mix-aurora': 'Aurora', 'mix-sunset': 'Gün Batımı', 'mix-ocean': 'Okyanus', 'mix-cosmic': 'Kozmik', 'mix-fire': 'Ateş',
    'mix-cyber': 'Siber', 'mix-forest': 'Süslü Beyaz', 'mix-violetteal': 'Mor Turkuaz', 'mix-cottoncandy': 'Pamuk Şeker', 'mix-neonpurple': 'Pastel Dalgalar',
  },
  Greek: {
    'default-earth': 'Προεπιλεγμένο Φόντο', 'pastel-waves': 'Παστέλ Κύματα',
    'light-grey': 'Ανοιχτό Γκρι', 'light-blue': 'Ανοιχτό Μπλε', 'light-pink': 'Ανοιχτό Ροζ', 'light-green': 'Ανοιχτό Πράσινο', 'light-yellow': 'Ανοιχτό Κίτρινο',
    'light-purple': 'Ανοιχτό Μωβ', 'light-orange': 'Ανοιχτό Πορτοκαλί', 'light-teal': 'Ανοιχτό Πετρόλ', 'white-clean': 'Λευκό', 'light-indigo': 'Ανοιχτό Λουλακί',
    'reg-blue': 'Μπλε', 'reg-rose': 'Τριανταφυλλί', 'reg-green': 'Πράσινο', 'reg-yellow': 'Κίτρινο', 'reg-purple': 'Μωβ',
    'reg-orange': 'Πορτοκαλί', 'reg-teal': 'Πετρόλ', 'reg-slate': 'Σχιστόλιθος', 'reg-indigo': 'Λουλακί', 'reg-pink': 'Ροζ',
    'dark-navy': 'Βαθύ Ναυτικό Μπλε', 'dark-violet': 'Βαθύ Βιολετί', 'dark-crimson': 'Βαθύ Βυσσινί', 'dark-forest': 'Βαθύ Δασικό', 'dark-espresso': 'Σκούρο Εσπρέσο',
    'dark-plum': 'Βαθύ Δαμασκηνί', 'dark-charcoal': 'Ανθρακί', 'dark-royal': 'Βασιλικό Λουλακί', 'dark-olive': 'Σκούρο Λαδί', 'dark-obsidian': 'Οψιδιανός',
    'mix-aurora': 'Σέλας', 'mix-sunset': 'Ηλιοβασίλεμα', 'mix-ocean': 'Ωκεανός', 'mix-cosmic': 'Κοσμικό', 'mix-fire': 'Φωτιά',
    'mix-cyber': 'Κυβερνο', 'mix-forest': 'Διακοσμημένο Λευκό', 'mix-violetteal': 'Βιολετί Πετρόλ', 'mix-cottoncandy': 'Μαλλί της Γριάς', 'mix-neonpurple': 'Παστέλ Κύματα',
  },
};

export default function ThemesTab({
  currentTheme,
  setTheme,
  isDarkMode,
  language = 'English',
  cardBgMode = 'white'
}: ThemesTabProps) {
  const tData = THEME_T[language] || THEME_T['English'];
  const presetNames = THEME_PRESET_NAMES[language] || THEME_PRESET_NAMES['English'];

  const renderGroup = (title: string, presets: Preset[]) => {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-violet-600">{title}</h4>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3.5 md:gap-4 justify-items-center">
          {presets.map((p) => {
            const isSelected =
              currentTheme === p.id ||
              (p.id === 'light-grey' && (currentTheme === 'light-grey' || currentTheme === 'light-slate'));
            // Determine if check icon should be black or white for contrast
            const isLightColor = p.id.startsWith('light-') || p.id === 'white-clean' || p.id === 'mix-forest' || p.id === 'mix-neonpurple' || p.id === 'pastel-waves';
            
            return (
              <button
                key={p.id}
                onClick={() => setTheme(p.id)}
                className="group w-full min-h-[44px] min-w-[44px] lg:min-h-0 lg:min-w-0 flex flex-col items-center justify-center transition-all duration-300 relative focus:outline-none cursor-pointer py-1"
                title={presetNames[p.id] || p.name}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border transition-all duration-300 flex items-center justify-center relative shrink-0 ${
                    isSelected
                      ? 'border-black scale-110 shadow-lg shadow-black/10 ring-2 ring-indigo-500/40'
                      : 'border-black/15 opacity-85 hover:opacity-100 hover:scale-105 shadow-inner'
                  }`}
                  style={{ background: p.color }}
                >
                  {isSelected && (
                    <Check
                      size={14}
                      className={isLightColor ? 'text-black font-extrabold' : 'text-white font-extrabold'}
                    />
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

      {/* Themes / Color Webcard - Always clean white card inside white Settings pane */}
      <div
        className="themes-tab-card rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8 transition-all duration-300 border w-full max-w-full overflow-hidden text-black"
        style={{
          background: '#ffffff',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 20px -2px rgba(60, 64, 67, 0.08), 0 2px 6px -1px rgba(60, 64, 67, 0.04)'
        }}
      >
        <div className="flex items-center justify-between border-b border-black/10 pb-4 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center border bg-black/5 border-black/10">
              <Palette className="text-violet-600" size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">{tData.panelHeader}</h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{tData.panelSub}</p>
            </div>
          </div>
          <div className="w-full sm:w-auto grid grid-cols-1 sm:flex sm:items-center gap-2 sm:flex-wrap">
            <button
              onClick={() => setTheme('default-earth')}
              className={`themes-tab-action-btn w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[42px] lg:min-h-0 border rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer text-[11px] ${
                currentTheme === 'default-earth'
                  ? 'bg-neutral-200 text-black border-neutral-300 ring-2 ring-neutral-400/30'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-black border-black/5'
              }`}
              title={tData.restoreWhiteButton}
            >
              <RotateCcw size={13} />
              {tData.restoreWhiteButton}
            </button>
            <button
              onClick={() => setTheme('pastel-waves')}
              className={`themes-tab-action-btn w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[42px] lg:min-h-0 border rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer text-[11px] ${
                currentTheme === 'pastel-waves'
                  ? 'bg-indigo-100 text-indigo-900 border-indigo-300 ring-2 ring-indigo-400/30'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200/60'
              }`}
              title={tData.resetButton}
            >
              <Palette size={13} />
              {tData.resetButton}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {renderGroup(tData.groupDefault, DEFAULT_PRESETS)}
          {renderGroup(tData.groupLight, LIGHT_PRESETS)}
          {renderGroup(tData.groupRegular, REGULAR_PRESETS)}
          {renderGroup(tData.groupDark, DARK_PRESETS)}
          {renderGroup(tData.groupGradient, MIXING_PRESETS)}
        </div>
      </div>
    </motion.div>
  );
}
