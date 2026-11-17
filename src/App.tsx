/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
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
import { t } from './i18n';

const DEFAULT_WALLPAPERS = [
  { id: 'def-1', url: 'https://images.unsplash.com/photo-1506744626753-dba37c25a1f1?q=80&w=2070', category: 'Nature' },
  { id: 'def-2', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070', category: 'Abstract' },
  { id: 'def-3', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072', category: 'Science' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [settingsInitialTab, setSettingsInitialTab] = useState<'general' | 'about'>('general');
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [theme, setTheme] = useLocalStorage('GeekTabs-theme', 'default-earth');
  const [isDarkMode, setIsDarkMode] = useLocalStorage('GeekTabs-dark-mode', true);
  const [customWallpapers, setCustomWallpapers] = useLocalStorage<any[]>("GeekTabs-custom-wallpapers", DEFAULT_WALLPAPERS);
  const [pageName, setPageName] = useLocalStorage('GeekTabs-page-name', '');
  const [language, setLanguage] = useLocalStorage('GeekTabs-language', 'English');
  const [cardBgMode, setCardBgMode] = useLocalStorage<'white' | 'dark' | 'dark-glass'>('GeekTabs-card-bg-mode', 'white');
  const [textColor, setTextColor] = useLocalStorage('GeekTabs-text-color', 'default');

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
    } catch (err) {
      console.warn('Background restore point initialization notice:', err);
    }
  }, [setTheme]);

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

    const isPhoto = theme.startsWith('data:image') || theme.startsWith('http') || theme === 'default-earth';
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

  const isFullPageTab = activeTab === 'todo' || activeTab === 'notes' || activeTab === 'settings';

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
    }[language] || 'Daily Digest';

  const dailySectionHumorDesc =
    {
      English:
        'Smart life tips so you wing it less, gentle reminders so you overthink less, a quick laugh before your coffee cools, and wise quotes to sound brilliant in meetings.',
      Chinese:
        '实用生活贴士让你少走弯路，温柔觉悟提醒让你少点内耗，咖啡凉前先笑一笑，名言金句帮你开会随时金句频出。',
      Spanish:
        'Trucos útiles para improvisar menos, recordatorios suaves para pensar de más un poco menos, una risa rápida antes de que se enfríe el café y citas brillantes para lucirte.',
      French:
        'Des astuces pour moins improviser, des rappels doux pour moins cogiter, un sourire avant que le café refroidisse et de belles citations pour briller en réunion.',
      German:
        'Clevere Alltagstipps gegen das Raten, sanfte Erinnerungen gegen das Grübeln, ein schneller Lacher zum Kaffee und kluge Zitate für jedes Meeting.',
      Japanese:
        '暮らしの知恵で迷いを減らし、やさしいリマインダーで考えすぎを防ぎ、コーヒーが冷める前にひと笑い、名言で会議もスマートに。',
      Korean:
        '시행착오를 줄여주는 생활 팁, 잡념을 덜어주는 깨달음 알림, 커피 식기 전 웃음 한 스푼, 회의에서 빛나는 명언까지.',
      Italian:
        'Consigli pratici per improvvisare meno, promemoria gentili per rimuginare meno, una risata prima che il caffè si raffreddi e citazioni brillanti per le riunioni.',
      Russian:
        'Житейские хитрости, чтобы меньше импровизировать, мягкие напоминания от лишних тревог, повод улыбнуться к кофе и меткие цитаты для встреч.',
      Luxembourgish:
        'Alldeeglech Tipps fir manner ze rätselen, sanft Erënnerungen géint d’Iwwerleeën, e kuerze Laach beim Kaffi a schlau Zitater.',
      Dutch:
        'Slimme levenstips zodat je minder hoeft te gokken, zachte herinneringen tegen overdenken, een snelle lach voordat je koffie afkoelt en wijze citaten.',
      Swedish:
        'Smarta livstips så att du gissar mindre, milda påminnelser mot övertänkande, ett snabbt skratt före kaffet svalnar och kloka citat.',
      Finnish:
        'Käteviä arjen vinkkejä, lempeitä muistutuksia mielenrauhaan, pieni nauru ennen kahvin jäähtymistä ja viisaita sitaatteja päivääsi.',
      Hindi:
        'दैनिक जीवन के स्मार्ट टिप्स, मन की शांति के लिए कोमल अनुस्मारक, कॉफी ठंडी होने से पहले एक हल्की मुस्कान और प्रेरणादायक अनमोल वचन।',
      Norwegian:
        'Smarte livstips så du slipper å gjette, milde påminnelser mot overtenking, en rask latter før kaffen blir kald og kloke sitater.',
      Thai:
        'เคล็ดลับชีวิตดีๆ ข้อคิดเตือนใจเบาๆ รอยยิ้มก่อนกาแฟเย็น และคำคมสร้างแรงบันดาลใจสำหรับทุกวันของคุณ',
    }[language] ||
    'Smart life tips so you wing it less, gentle reminders so you overthink less, a quick laugh before your coffee cools, and wise quotes to sound brilliant in meetings.';

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
              {/* Centerpiece */}
              <div className="flex-1 flex flex-col items-center pt-4 sm:pt-6 px-4 sm:px-6">
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
              </div>

              {/* Bottom Widgets */}
              <div className="flex flex-col gap-6 w-full max-w-6xl lg:max-w-5xl mx-auto px-4 sm:px-6 mb-20 sm:mb-24 mt-6 sm:mt-8">
                <div className="w-full">
                  <WeatherWidget language={language} />
                </div>
                <div className="daily-cards-humor-intro w-full px-2 sm:px-4 mt-12 sm:mt-16 mb-12 sm:mb-14 pt-1 select-none text-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[40px] font-black tracking-tight word-color mb-7 sm:mb-8">
                    {dailySectionTitle}
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg xl:text-[19px] font-medium word-color opacity-90 max-w-3xl lg:max-w-4xl mx-auto leading-relaxed">
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
              </div>

              {/* Home Page Footer */}
              <footer className="w-full pb-10 sm:pb-12 pt-4 sm:pt-6 select-none flex flex-col">
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
                      Your everyday space for useful websites, tools and productivity.
                    </p>
                  </div>
                </div>

                {/* Divider - Full Width */}
                <div className="w-full border-t border-current word-color opacity-15 my-4 sm:my-5" />

                {/* Bottom Row - Aligned with 4 web cards width & identical text sizes */}
                <div className="w-full max-w-6xl lg:max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4 text-xs sm:text-sm font-normal">
                    <span className="text-xs sm:text-sm font-normal word-color opacity-75 whitespace-nowrap justify-self-start">
                      © 2026 GeekTabs. All rights reserved.
                    </span>

                    <span className="text-xs sm:text-sm font-normal word-color opacity-75 md:justify-self-center md:text-center">
                      Powered and secured by Geektabs.
                    </span>

                    <div className="flex items-center gap-5 sm:gap-6 shrink-0 md:justify-self-end">
                      <button
                        type="button"
                        onClick={() => setLegalModal('privacy')}
                        className="text-xs sm:text-sm font-normal word-color opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        Privacy
                      </button>
                      <button
                        type="button"
                        onClick={() => setLegalModal('terms')}
                        className="text-xs sm:text-sm font-normal word-color opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        Terms
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSettingsInitialTab('about');
                          setActiveTab('settings');
                        }}
                        className="text-xs sm:text-sm font-normal word-color opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        About
                      </button>
                    </div>
                  </div>
                </div>
              </footer>
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              data-tab="calendar"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-36 pb-20 lg:pb-32"
            >
              <Calendar language={language} />
            </motion.div>
          )}

          {activeTab === 'links' && (
            <motion.div
              key="links"
              data-tab="links"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-36 pb-20 lg:pb-32"
            >
              <QuickLinks language={language} />
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
              className="w-full max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-36 pb-20 lg:pb-32"
            >
              <CalculatorTab language={language} />
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
              className="w-full h-full flex flex-col overflow-hidden"
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
              className="w-full max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-36 pb-20 lg:pb-32"
            >
              <IpAddressTab language={language} />
            </motion.div>
          )}

          {activeTab === 'speed' && (
            <motion.div
              key="speed"
              data-tab="speed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-36 pb-20 lg:pb-32"
            >
              <SpeedTestTab language={language} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              data-tab="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full flex flex-col overflow-hidden"
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
        </AnimatePresence>
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
      />
      <OfflineIndicator language={language} />

      {/* Privacy & Terms Info Modal */}
      <AnimatePresence>
        {legalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
            onClick={() => setLegalModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold tracking-tight">
                  {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                </h3>
                <button
                  type="button"
                  onClick={() => setLegalModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              {legalModal === 'privacy' ? (
                <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                  <p>
                    GeekTabs is designed with privacy first. Your bookmarks, notes, to-do lists, theme preferences, and settings are stored locally in your browser.
                  </p>
                  <p>
                    We do not sell personal data or track your browsing history across third-party websites. Weather and network diagnostic tools only request the minimum information needed to provide the active feature.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                  <p>
                    GeekTabs provides quick access to bookmarks, productivity widgets, and utilities for personal use as-is.
                  </p>
                  <p>
                    External websites linked from your dashboard are governed by their own terms and privacy policies. You are responsible for backing up any important local notes or bookmark data via Settings export.
                  </p>
                </div>
              )}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setLegalModal(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

