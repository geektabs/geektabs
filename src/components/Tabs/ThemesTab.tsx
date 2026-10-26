import React from 'react';
import { motion } from 'motion/react';
import { Palette, Check, RotateCcw } from 'lucide-react';

interface ThemesTabProps {
  currentTheme: string;
  setTheme: (theme: string) => void;
  isDarkMode: boolean;
  language?: string;
  cardBgMode?: 'white' | 'dark-glass';
}

const THEME_T: Record<string, Record<string, string>> = {
  English: {
    title: 'THEME ENGINE',
    subtitle: 'PRESET COLOR CONFIGURATION',
    panelHeader: 'Color Palette Presets',
    panelSub: 'select a color for your favorite',
    resetButton: 'Reset to Pastel Waves',
    restoreWhiteButton: 'Restore Default Light Grey',
    groupDefault: 'default',
    groupLight: 'light',
    groupRegular: 'regular',
    groupDark: 'dark',
    groupGradient: 'gradient'
  },
  Chinese: {
    title: '主题引擎',
    subtitle: '预设颜色配置',
    panelHeader: '调色板预设',
    panelSub: '选择您最喜爱的背景颜色',
    resetButton: '重置为浅彩波纹',
    restoreWhiteButton: '恢复默认浅灰背景',
    groupDefault: '默认',
    groupLight: '浅色',
    groupRegular: '常规',
    groupDark: '深色',
    groupGradient: '渐变'
  },
  Spanish: {
    title: 'MOTOR DE TEMAS',
    subtitle: 'CONFIGURACIÓN DE COLOR PREESTABLECIDA',
    panelHeader: 'Ajustes del Tema de Color',
    panelSub: 'selecciona un color de fondo preferido',
    resetButton: 'Restablecer a Ondas Pastel',
    restoreWhiteButton: 'Restaurar Gris Claro (Predeterminado)',
    groupDefault: 'por defecto',
    groupLight: 'claro',
    groupRegular: 'regular',
    groupDark: 'oscuro',
    groupGradient: 'gradiente'
  },
  French: {
    title: 'MOTEUR DE THÈMES',
    subtitle: 'CONFIGURATION DES COULEURS PRÉDÉFINIES',
    panelHeader: 'Palettes de Couleurs Prédéfinies',
    panelSub: 'sélectionnez une couleur de fond préférée',
    resetButton: 'Réinitialiser Vagues Pastel',
    restoreWhiteButton: 'Restaurer Gris Clair (Défaut)',
    groupDefault: 'par défaut',
    groupLight: 'clair',
    groupRegular: 'régulier',
    groupDark: 'sombre',
    groupGradient: 'dégradé'
  },
  German: {
    title: 'THEME-ENGINE',
    subtitle: 'VOREINGESTELLTE FARBKONFIGURATION',
    panelHeader: 'Farbpaletten-Voreinstellungen',
    panelSub: 'Wählen Sie Ihre bevorzugte Hintergrundfarbe',
    resetButton: 'Auf Pastellwellen zurücksetzen',
    restoreWhiteButton: 'Standard-Hellgrau wiederherstellen',
    groupDefault: 'Standard',
    groupLight: 'Hell',
    groupRegular: 'Normal',
    groupDark: 'Dunkel',
    groupGradient: 'Verlauf'
  },
  Japanese: {
    title: 'テーマエンジン',
    subtitle: 'プリセットカラー設定',
    panelHeader: 'カラーパレットプリセット',
    panelSub: 'お好みの背景色を選択してください',
    resetButton: 'パステルウェーブに戻す',
    restoreWhiteButton: 'デフォルトのライトグレーに戻す',
    groupDefault: 'デフォルト',
    groupLight: 'ライト',
    groupRegular: 'レギュラー',
    groupDark: 'ダーク',
    groupGradient: 'グラデーション'
  },
  Korean: {
    title: '테마 엔진',
    subtitle: '사전 설정 색상 구성',
    panelHeader: '컬러 팔레트 프리셋',
    panelSub: '원하는 배경색을 선택하세요',
    resetButton: '파스텔 웨이브로 리셋',
    restoreWhiteButton: '기본 라이트 그레이 복원',
    groupDefault: '기본',
    groupLight: '밝은색',
    groupRegular: '일반색',
    groupDark: '어두운색',
    groupGradient: '그라데이션'
  },
  Italian: {
    title: 'MOTORE DI TEMI',
    subtitle: 'CONFIGURAZIONE DEI COLORI PREDEFINITI',
    panelHeader: 'Tavolozze di Colori Predefinite',
    panelSub: 'seleziona il colore di sfondo preferito',
    resetButton: 'Reimposta Onde Pastello',
    restoreWhiteButton: 'Ripristina Grigio Chiaro (Predefinito)',
    groupDefault: 'predefinito',
    groupLight: 'chiaro',
    groupRegular: 'regolare',
    groupDark: 'scuro',
    groupGradient: 'sfumato'
  },
  Russian: {
    title: 'ДВИЖОК ТЕМ',
    subtitle: 'НАСТРОЙКА ЦВЕТОВЫХ ПРЕСЕТОВ',
    panelHeader: 'Цветовые палитры',
    panelSub: 'выберите цвет для фона',
    resetButton: 'Сбросить на пастельные волны',
    restoreWhiteButton: 'Восстановить светло-серый (по умолч.)',
    groupDefault: 'по умолчанию',
    groupLight: 'светлый',
    groupRegular: 'обычный',
    groupDark: 'темный',
    groupGradient: 'градиент'
  },
  Luxembourgish: {
    title: 'THEME-ENGINE',
    subtitle: 'Sproochen an Hannergrënn',
    panelHeader: 'Faarfpaletten-Voreinstellungen',
    panelSub: 'Wielt Är Liiblingshannergrondfaarf',
    resetButton: 'Op Pastellwellen zrécksetzen',
    restoreWhiteButton: 'Hellgrau zrécksetzen (Standard)',
    groupDefault: 'Standard',
    groupLight: 'Hell',
    groupRegular: 'Normal',
    groupDark: 'Däischter',
    groupGradient: 'Verlaf'
  }
};

interface Preset {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'light-grey',
    name: 'Light Grey (Default)',
    color: '#f8fafc'
  }
];

const LIGHT_PRESETS: Preset[] = [
  { id: 'light-blue', name: 'Light Blue', color: '#f0f9ff' },
  { id: 'light-pink', name: 'Light Pink', color: '#fff1f2' },
  { id: 'light-green', name: 'Light Green', color: '#f0fdf4' },
  { id: 'light-yellow', name: 'Light Yellow', color: '#fffbeb' },
  { id: 'light-purple', name: 'Light Purple', color: '#f5f3ff' },
  { id: 'light-orange', name: 'Light Orange', color: '#fff7ed' },
  { id: 'light-teal', name: 'Light Teal', color: '#f0fdfa' },
  { id: 'white-clean', name: 'White', color: '#ffffff' },
  { id: 'light-indigo', name: 'Light Indigo', color: '#f5f7ff' },
  { id: 'light-stone', name: 'Light Stone', color: '#fafaf9' },
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
  { id: 'dark-rust', name: 'Dark Rust', color: '#7c2d12' },
  { id: 'dark-blue', name: 'Dark Blue', color: '#1e3a8a' },
  { id: 'dark-purple', name: 'Dark Purple', color: '#581c87' },
  { id: 'dark-ruby', name: 'Dark Ruby', color: '#4c0519' },
  { id: 'dark-green', name: 'Dark Green', color: '#064e3b' },
  { id: 'dark-bronze', name: 'Dark Bronze', color: '#451a03' },
  { id: 'dark-wine', name: 'Dark Wine', color: '#881337' },
  { id: 'dark-teal', name: 'Dark Teal', color: '#115e59' },
  { id: 'dark-indigo', name: 'Dark Indigo', color: '#312e81' },
  { id: 'dark-midnight', name: 'Midnight', color: '#030712' },
];

const MIXING_PRESETS: Preset[] = [
  { id: 'mix-aurora', name: 'Aurora', color: 'linear-gradient(135deg, #60a5fa, #a78bfa)' },
  { id: 'mix-sunset', name: 'Sunset', color: 'linear-gradient(135deg, #fbbf24, #ef4444)' },
  { id: 'mix-ocean', name: 'Ocean', color: 'linear-gradient(135deg, #0ea5e9, #22c55e)' },
  { id: 'mix-cosmic', name: 'Cosmic', color: 'linear-gradient(135deg, #6366f1, #ec4899)' },
  { id: 'mix-fire', name: 'Fire', color: 'linear-gradient(135deg, #f97316, #facc15)' },
  { id: 'mix-cyber', name: 'Cyber', color: 'linear-gradient(135deg, #2dd4bf, #e879f9)' },
  { id: 'mix-forest', name: 'Decorated White', color: 'radial-gradient(circle at 20% 20%, #bae6fd 0%, #ffffff 50%, #ede9fe 100%)' },
  { id: 'mix-violetteal', name: 'Violet Teal', color: 'linear-gradient(135deg, #7c3aed, #0d9488)' },
  { id: 'mix-cottoncandy', name: 'Cotton Candy', color: 'linear-gradient(135deg, #f472b6, #38bdf8)' },
  { id: 'mix-neonpurple', name: 'Pastel Waves', color: 'linear-gradient(135deg, #a7f3d0 0%, #bae6fd 30%, #fbcfe8 70%, #fed7aa 100%)' },
];

export default function ThemesTab({
  currentTheme,
  setTheme,
  isDarkMode,
  language = 'English',
  cardBgMode = 'white'
}: ThemesTabProps) {
  const isDarkGlass = cardBgMode === 'dark-glass';
  const isDefaultTheme = currentTheme === 'light-grey' || currentTheme === 'light-slate' || currentTheme === 'white-clean';
  const isDefaultGlass = isDarkGlass && isDefaultTheme && !isDarkMode;
  const tData = THEME_T[language] || THEME_T['English'];

  const renderGroup = (title: string, presets: Preset[]) => {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h4 className={`text-xs font-black uppercase tracking-widest ${isDarkGlass ? 'text-violet-400' : 'text-violet-500'}`}>{title}</h4>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3.5 md:gap-4 justify-items-center">
          {presets.map((p) => {
            const isSelected = currentTheme === p.id || (p.id === 'light-grey' && (currentTheme === 'light-grey' || currentTheme === 'light-slate'));
            // Determine if check icon should be black or white for contrast
            const isLightColor = p.id.startsWith('light-') || p.id === 'light-stone' || p.id === 'white-clean' || p.id === 'mix-forest' || p.id === 'mix-neonpurple';
            
            return (
              <button
                key={p.id}
                onClick={() => setTheme(p.id)}
                className="group w-full flex flex-col items-center justify-center transition-all duration-300 relative focus:outline-none cursor-pointer py-1"
                title={p.name}
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border transition-all duration-300 flex items-center justify-center relative shrink-0 ${
                    isSelected
                      ? (isDarkGlass
                          ? 'border-white scale-110 shadow-lg ring-2 ring-violet-400'
                          : 'border-black scale-110 shadow-lg shadow-black/10 ring-2 ring-black/10')
                      : (isDarkGlass
                          ? 'border-white/25 opacity-85 hover:opacity-100 hover:scale-105 hover:border-white/50 shadow-sm'
                          : 'border-black/10 opacity-85 hover:opacity-100 hover:scale-105 shadow-inner')
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
      <div className="mb-6 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-4xl font-black text-black dark:text-white tracking-tighter mb-2 italic">{tData.title}</h2>
        <p className="text-black/40 dark:text-white/40 font-bold uppercase tracking-[0.4em] text-[10px]">{tData.subtitle}</p>
      </div>

      {/* Themes / Color Webcard - Transparent Glass style or Classic White */}
      <div
        className={`themes-tab-card rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8 transition-all duration-300 border w-full max-w-full overflow-hidden ${
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
        <div className={`flex items-center justify-between border-b pb-4 flex-wrap gap-4 ${isDefaultGlass ? 'border-indigo-200/40' : isDarkGlass ? 'border-white/10' : 'border-black/5'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              isDefaultGlass ? 'bg-indigo-500/10 border-indigo-200' : isDarkGlass ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/10'
            }`}>
              <Palette className={isDefaultGlass ? "text-[#6143f7]" : isDarkGlass ? "text-violet-400" : "text-violet-500 opacity-80"} size={16} />
            </div>
            <div>
              <h3 className={`text-sm font-black uppercase tracking-wider ${isDefaultGlass ? 'text-[#6143f7]' : isDarkGlass ? 'text-white' : 'text-black'}`}>{tData.panelHeader}</h3>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isDefaultGlass ? 'text-neutral-500' : isDarkGlass ? 'text-white/60' : 'text-black/40'}`}>{tData.panelSub}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setTheme('light-grey')}
              className={`themes-tab-action-btn flex items-center gap-1.5 px-3.5 py-2 border rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer text-[11px] ${
                currentTheme === 'light-grey' || currentTheme === 'light-slate'
                  ? (isDefaultGlass
                      ? 'bg-indigo-500/20 text-[#6143f7] border-indigo-400/60 ring-2 ring-indigo-400/30'
                      : isDarkGlass
                      ? 'bg-white/25 text-white border-white/40 ring-2 ring-white/30'
                      : 'bg-neutral-200 text-black border-neutral-300 ring-2 ring-neutral-400/30')
                  : (isDefaultGlass
                      ? 'bg-white/50 hover:bg-white/80 text-[#6143f7] border-indigo-200/60'
                      : isDarkGlass
                      ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-black border-black/5')
              }`}
              title="Restore default light grey background"
            >
              <RotateCcw size={13} />
              {tData.restoreWhiteButton}
            </button>
            <button
              onClick={() => setTheme('pastel-waves')}
              className={`themes-tab-action-btn flex items-center gap-1.5 px-3.5 py-2 border rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer text-[11px] ${
                currentTheme === 'pastel-waves'
                  ? (isDefaultGlass
                      ? 'bg-indigo-500/25 text-[#6143f7] border-indigo-400/60 ring-2 ring-indigo-400/30'
                      : isDarkGlass
                      ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400/50 ring-2 ring-indigo-400/30'
                      : 'bg-indigo-100 text-indigo-900 border-indigo-300 ring-2 ring-indigo-400/30')
                  : (isDefaultGlass
                      ? 'bg-white/50 hover:bg-white/80 text-[#6143f7] border-indigo-200/60'
                      : isDarkGlass
                      ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200/60')
              }`}
              title="Apply new pastel waves design"
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
