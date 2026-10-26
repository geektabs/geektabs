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
  cardBgMode?: 'white' | 'dark-glass';
}

const TEXT_T: Record<string, Record<string, string>> = {
  English: {
    title: 'TEXT COLOR ENGINE',
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
  Spanish: {
    title: 'MOTOR DE COLOR DE TEXTO',
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
    title: 'MOTEUR DE COULEUR DU TEXTE',
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
    title: 'TEXTFARBE-ENGINE',
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
    title: 'MOTORE COLORE TESTO',
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
    title: 'ДВИЖОК ЦВЕТА ТЕКСТА',
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
    title: 'TEXTFAARF-ENGINE',
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

export default function TextTab({
  textColor,
  setTextColor,
  currentTheme,
  isDarkMode,
  language = 'English',
  cardBgMode = 'white'
}: TextTabProps) {
  const isDarkGlass = cardBgMode === 'dark-glass';
  const isDefaultTheme = currentTheme === 'light-grey' || currentTheme === 'light-slate' || currentTheme === 'white-clean' || currentTheme === 'pastel-waves' || currentTheme === 'mix-neonpurple';
  const isDefaultGlass = isDarkGlass && isDefaultTheme && !isDarkMode;
  const tData = TEXT_T[language] || TEXT_T['English'];
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
    if (isGradient) {
      return { background: GRADIENTS_MAP[currentTheme] };
    }
    if (isSolid) {
      return { backgroundColor: SOLIDS_MAP[currentTheme] };
    }
    if (currentTheme === 'pastel-waves') {
      return {
        backgroundColor: '#d8f0fa',
        backgroundImage: `radial-gradient(ellipse at 15% 15%, rgba(142, 227, 239, 0.75) 0%, transparent 60%),
                          radial-gradient(ellipse at 85% 15%, rgba(255, 198, 255, 0.75) 0%, transparent 60%),
                          radial-gradient(ellipse at 25% 85%, rgba(216, 180, 254, 0.75) 0%, transparent 60%),
                          radial-gradient(ellipse at 80% 85%, rgba(167, 243, 208, 0.7) 0%, transparent 55%),
                          url('/wallpapers/pastel-soothing-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
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
    Japanese: 'ja-JP',
    Korean: 'ko-KR',
    Italian: 'it-IT',
    Russian: 'ru-RU',
    Luxembourgish: 'lb-LU',
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
          <h4 className="text-xs font-black uppercase tracking-widest text-violet-400">{title}</h4>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3.5 md:gap-4 justify-items-center">
          {presets.map((p) => {
            const isSelected = textColor === p.id;
            const isDefault = p.id === 'default';

            return (
              <button
                key={p.id}
                onClick={() => setTextColor(p.id)}
                className="group w-full flex flex-col items-center justify-center transition-all duration-300 relative focus:outline-none cursor-pointer py-1"
                title={p.name}
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border transition-all duration-300 flex items-center justify-center relative shrink-0 ${
                    isSelected
                      ? (isDarkGlass
                          ? 'border-white scale-110 shadow-lg ring-2 ring-violet-400'
                          : 'border-black scale-110 shadow-lg shadow-black/15 ring-2 ring-violet-500')
                      : (isDarkGlass
                          ? 'border-white/20 opacity-85 hover:opacity-100 hover:scale-105 hover:border-white/50 shadow-sm'
                          : 'border-black/10 opacity-85 hover:opacity-100 hover:scale-105 shadow-inner')
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
                          ? 'text-white mix-blend-difference'
                          : p.color === '#ffffff' || p.color === '#f8fafc' || p.color === '#fffbeb' || p.color === '#e0f2fe' || p.color === '#dcfce7' || p.color === '#ffe4e6' || p.color === '#f3e8ff' || p.color === '#fef9c3' || p.color === '#ffedd5' || p.color === '#cffafe' || p.color === '#facc15' || p.color === '#4ade80' || p.color === '#67e8f9'
                            ? (isDarkGlass ? 'text-black/70' : 'text-black/60')
                            : 'text-white/80'
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
      <div className="mb-6 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-4xl font-black text-black dark:text-white tracking-tighter mb-2 italic">{tData.title}</h2>
        <p className="text-black/40 dark:text-white/40 font-bold uppercase tracking-[0.4em] text-[10px]">{tData.subtitle}</p>
      </div>

      {/* Main Container Card - Transparent Glass style or Classic White */}
      <div
        className={`text-tab-card rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8 transition-all duration-300 border w-full max-w-full overflow-hidden ${
          isDefaultGlass ? 'text-[#6143f7]' : isDarkGlass ? 'text-white' : 'text-black'
        }`}
        style={
          isDefaultGlass
            ? {
                background: 'rgba(255, 255, 255, 0.48)',
                borderColor: 'rgba(147, 197, 253, 0.85)',
                backdropFilter: 'blur(28px) saturate(190%)',
                WebkitBackdropFilter: 'blur(28px) saturate(190%)',
                boxShadow:
                  '0 0 0 1px rgba(186, 230, 253, 0.55), inset 0 1.5px 1.5px 0 rgba(224, 242, 254, 0.95), inset 0 0 16px 0 rgba(191, 219, 254, 0.25), 0 16px 40px -8px rgba(59, 130, 246, 0.12), 0 2px 8px -2px rgba(59, 130, 246, 0.05)',
                color: '#6143f7'
              }
            : isDarkGlass
            ? {
                background: 'rgba(18, 22, 34, 0.32)',
                borderColor: 'rgba(255, 255, 255, 0.22)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.18)',
                color: '#ffffff'
              }
            : {
                background: '#ffffff',
                borderColor: 'rgba(0, 0, 0, 0.08)',
                boxShadow: '0 4px 6px rgba(60,64,67,0.1), 0 16px 40px rgba(60,64,67,0.06)'
              }
        }
      >
        {/* Header Bar */}
        <div className={`flex items-center justify-between border-b pb-4 flex-wrap gap-4 ${isDefaultGlass ? 'border-indigo-200/40' : isDarkGlass ? 'border-white/10' : 'border-black/5'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              isDefaultGlass ? 'bg-indigo-500/10 border-indigo-200' : isDarkGlass ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/10'
            }`}>
              <Type className={isDefaultGlass ? "text-[#6143f7]" : "text-violet-400"} size={16} />
            </div>
            <div>
              <h3 className={`text-sm font-black uppercase tracking-wider ${isDefaultGlass ? 'text-[#6143f7]' : isDarkGlass ? 'text-white' : 'text-black'}`}>{tData.panelHeader}</h3>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isDefaultGlass ? 'text-neutral-500' : isDarkGlass ? 'text-white/60' : 'text-black/40'}`}>{tData.panelSub}</p>
            </div>
          </div>
          <button
            onClick={() => setTextColor('default')}
            className={`text-tab-reset-btn flex items-center gap-2 px-4 py-2 border rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer text-[11px] ${
              isDefaultGlass
                ? 'bg-white/50 hover:bg-white/80 text-[#6143f7] border-indigo-200/60'
                : isDarkGlass
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                : 'bg-neutral-100 hover:bg-neutral-200 text-black border-black/5'
            }`}
          >
            <RotateCcw size={14} />
            {tData.resetButton}
          </button>
        </div>

        {/* Live Vision Preview Box: Shows how selected text color looks on current background */}
        <div className={`text-tab-preview-box rounded-2xl border p-5 relative overflow-hidden shadow-inner transition-colors ${
          isDefaultGlass
            ? 'bg-white/35 border-indigo-200/50 backdrop-blur-md'
            : isDarkGlass
            ? 'bg-black/25 border-white/15 backdrop-blur-md'
            : 'bg-slate-50 border-black/10'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye size={14} className={isDarkGlass ? 'text-violet-400' : 'text-violet-600'} />
              <span className={`text-xs font-black uppercase tracking-wider ${isDarkGlass ? 'text-white' : 'text-slate-800'}`}>
                {tData.previewTitle.startsWith('#') ? tData.previewTitle : `# ${tData.previewTitle}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isDarkGlass ? 'text-white/70' : 'text-slate-500'}`}>
                {textColor === 'default' ? 'Default (Auto)' : (textColor.startsWith('#') ? textColor.toUpperCase() : `#${textColor.toUpperCase()}`)}
              </span>
              <div
                className={`w-4 h-4 rounded-full border shadow-xs ${isDarkGlass ? 'border-white/40' : 'border-black/20'}`}
                style={{ backgroundColor: effectiveTextColor }}
              />
            </div>
          </div>

          <div
            className={`w-full rounded-xl p-6 min-h-[140px] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 border shadow-sm ${
              isDarkGlass ? 'border-white/20' : 'border-black/10'
            }`}
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
        <div className={`pt-6 border-t flex flex-col gap-3.5 w-full ${isDarkGlass ? 'border-white/10' : 'border-black/5'}`}>
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${
              isDarkGlass ? 'bg-violet-500/20 border-violet-400/30' : 'bg-violet-500/10 border-violet-500/20'
            }`}>
              <Sparkles className="text-violet-400" size={16} />
            </div>
            <div className="min-w-0">
              <h4 className={`text-xs sm:text-sm font-black uppercase tracking-wider ${isDarkGlass ? 'text-white' : 'text-black'}`}>{tData.customColorTitle}</h4>
              <p className={`text-[10px] font-bold uppercase tracking-wider leading-relaxed ${isDarkGlass ? 'text-white/60' : 'text-black/40'}`}>{tData.panelSub}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 w-full max-w-sm pt-0.5">
            <div className={`text-tab-input-box flex items-center gap-2 border px-3 py-2 rounded-xl shadow-inner flex-1 min-w-0 transition-colors ${
              isDarkGlass
                ? 'bg-black/25 hover:bg-black/35 border-white/20'
                : 'bg-neutral-100 hover:bg-neutral-200/70 border-black/10'
            }`}>
              <input
                type="color"
                value={customHex.startsWith('#') ? customHex : '#38bdf8'}
                onChange={(e) => {
                  setCustomHex(e.target.value);
                  setTextColor(e.target.value);
                }}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0 bg-transparent shrink-0"
                title="Pick custom color"
              />
              <input
                type="text"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                placeholder="#38bdf8"
                className={`w-full text-xs sm:text-sm font-mono font-bold bg-transparent outline-none uppercase tracking-wider ${
                  isDarkGlass ? 'text-white placeholder-white/40' : 'text-slate-800'
                }`}
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
              className="custom-hex-apply-btn px-5 sm:px-6 py-2.5 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white !text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
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
