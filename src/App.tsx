/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Sparkles, Palette, X } from 'lucide-react';
import Wallpaper, { WALLPAPERS, SOLIDS_MAP, GRADIENTS_MAP } from './components/Wallpaper/Wallpaper';
import Clock from './components/Clock/Clock';
import SearchBar from './components/Search/SearchBar';
import HumorWidget from './components/Widgets/HumorWidget';
import QuoteWidget from './components/Widgets/QuoteWidget';
import WeatherWidget from './components/Widgets/WeatherWidget';
import TipsWidget from './components/Widgets/TipsWidget';
import HoroscopeInfo from './components/Widgets/HoroscopeInfo';
import Dock from './components/Navigation/Dock';
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
  const [theme, setTheme] = useLocalStorage('GeekTabs-theme', 'light-grey');
  const [isDarkMode, setIsDarkMode] = useLocalStorage('GeekTabs-dark-mode', false);
  const [customWallpapers, setCustomWallpapers] = useLocalStorage<any[]>("GeekTabs-custom-wallpapers", DEFAULT_WALLPAPERS);
  const [pageName, setPageName] = useLocalStorage('GeekTabs-page-name', '');
  const [language, setLanguage] = useLocalStorage('GeekTabs-language', 'English');
  const [cardBgMode, setCardBgMode] = useLocalStorage<'white' | 'dark-glass'>('GeekTabs-card-bg-mode', 'white');
  const [textColor, setTextColor] = useLocalStorage('GeekTabs-text-color', 'default');
  const [dismissRestorePill, setDismissRestorePill] = useLocalStorage('GeekTabs-dismiss-restore-pill', false);

  // Initialize Default Light Grey background and restore points
  React.useEffect(() => {
    try {
      if (!localStorage.getItem('GeekTabs-light-grey-restore-point')) {
        localStorage.setItem(
          'GeekTabs-light-grey-restore-point',
          JSON.stringify({
            theme: 'light-grey',
            cardBgMode: 'white',
            isDarkMode: false,
            createdAt: new Date().toISOString(),
            label: 'Default Light Grey Background'
          })
        );
      }

      const hasAppliedLightGrey = localStorage.getItem('GeekTabs-migrated-to-light-grey-default-v3');
      if (!hasAppliedLightGrey) {
        const currentStoredTheme = localStorage.getItem('GeekTabs-theme');
        if (!currentStoredTheme || currentStoredTheme === '"white-clean"' || currentStoredTheme === 'white-clean') {
          setTheme('light-grey');
        }
        localStorage.setItem('GeekTabs-migrated-to-light-grey-default-v3', 'true');
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

    const isPhoto = theme.startsWith('data:image') || theme.startsWith('http');
    if (isPhoto) {
      isLight = false; 
    } else if (theme === 'light-grey' || theme === 'light-slate' || theme === 'white-clean' || theme === 'pastel-waves') {
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
    if (theme === 'light-grey' || theme === 'light-slate') {
      document.body.style.backgroundColor = '#f8fafc';
    } else if (theme === 'white-clean') {
      document.body.style.backgroundColor = '#ffffff';
    } else if (theme === 'pastel-waves') {
      document.body.style.backgroundColor = '#d8f0fa';
    } else {
      document.body.style.backgroundColor = '';
    }
  }, [theme]);

  const isPhoto = theme.startsWith('data:image') || theme.startsWith('http');
  const hasCustomTextColor = textColor && textColor !== 'default';

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

  return (
    <div 
      className={`relative min-h-screen font-sans transition-colors duration-500 ${isDarkMode && !isDefaultLightBg ? 'dark text-white' : 'light'} ${isPhoto ? 'photo-mode' : ''} ${cardBgMode === 'dark-glass' ? 'card-style-dark-glass' : 'card-style-white'} ${theme === 'light-grey' || theme === 'light-slate' ? 'bg-[#f8fafc]' : theme === 'white-clean' ? 'bg-white' : (theme === 'pastel-waves' || theme === 'mix-neonpurple') ? 'bg-[#d8f0fa]' : ''}`}
      style={hasCustomTextColor ? ({ '--custom-page-text-color': textColor } as React.CSSProperties) : undefined}
      data-has-custom-text={hasCustomTextColor ? 'true' : 'false'}
      data-custom-text-light={isTextColorLight ? 'true' : 'false'}
      data-bg-light={!isDarkMode || isDefaultLightBg ? 'true' : 'false'}
      data-default-white-bg={theme === 'white-clean' ? 'true' : 'false'}
      data-default-light-grey-bg={theme === 'light-grey' || theme === 'light-slate' ? 'true' : 'false'}
      data-active-tab={activeTab}
      data-page-theme={isExemptPage ? 'exempt' : 'blue-purple-mix'}
    >
      <Wallpaper currentTheme={theme} isDarkMode={isDarkMode} />

      <main className="relative z-10 container mx-auto px-4 sm:px-6 min-h-screen flex flex-col items-center" data-active-tab={activeTab}>
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
              <div className="flex-1 flex flex-col items-center pt-4 sm:pt-6">
                {displayName && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-5 sm:mb-7"
                  >
                    <span 
                      className="welcome-greeting-display text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter cursor-default select-none border-b-2 border-transparent hover:border-black/10 dark:hover:border-white/10 transition-all pb-1.5 px-5 sm:px-8 py-2 sm:py-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl sm:rounded-full leading-tight inline-block text-center text-[#6143f7]"
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
              <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto mb-20 sm:mb-24 mt-6 sm:mt-8">
                <div className="w-full">
                  <WeatherWidget language={language} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-6 w-full">
                  <div className="min-h-[250px] sm:min-h-[260px] h-full">
                    <TipsWidget language={language} />
                  </div>
                  <div className="min-h-[250px] sm:min-h-[260px] h-full">
                    <HumorWidget language={language} />
                  </div>
                  <div className="min-h-[250px] sm:min-h-[260px] h-full">
                    <QuoteWidget language={language} />
                  </div>
                </div>
              </div>

              {/* Home Page Footer */}
              <footer className="w-full max-w-6xl mx-auto text-center pb-28 pt-8 sm:pt-10 mb-2 select-none flex flex-col items-center justify-center gap-1">
                <p className="text-xs sm:text-sm font-medium tracking-wide word-color opacity-75">
                  © 2026 Geektabs All Rights
                </p>
                <p className="text-xs sm:text-sm font-medium tracking-wide word-color opacity-75">
                  Powered and secured by Geektabs.
                </p>
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
              className="w-full max-w-6xl pt-36 pb-32"
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
              className="w-full max-w-6xl pt-36 pb-32"
            >
              <QuickLinks language={language} />
            </motion.div>
          )}

          {activeTab === 'todo' && (
            <motion.div
              key="todo"
              data-tab="todo"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-6xl pt-36 pb-32"
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
              className="w-full max-w-6xl pt-36 pb-32"
            >
              <CalculatorTab language={language} />
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              data-tab="notes"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-6xl pt-36 pb-32"
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
              className="w-full max-w-6xl pt-36 pb-32"
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
              className="w-full max-w-6xl pt-36 pb-32"
            >
              <SpeedTestTab language={language} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              data-tab="settings"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-6xl pt-36 pb-32"
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
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Non-intrusive Floating Restore Point Switcher Pill */}
      <AnimatePresence>
        {!dismissRestorePill && (theme === 'pastel-waves' || theme === 'mix-neonpurple' || theme === 'light-grey' || theme === 'light-slate' || theme === 'white-clean') && (
          <motion.aside
            aria-label="Theme switcher"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-4 sm:left-6 z-40"
          >
            <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-black/10 dark:border-white/15 px-3 py-1.5 rounded-full shadow-lg shadow-black/5 text-xs">
              {(theme === 'pastel-waves' || theme === 'mix-neonpurple') ? (
                <>
                  <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 pl-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Pastel Waves
                  </span>
                  <span className="text-black/20 dark:text-white/20">|</span>
                  <button
                    onClick={() => setTheme('light-grey')}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full font-bold text-[11px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200"
                    title="Switch to Light Grey background"
                  >
                    <Sparkles size={12} className="text-slate-500" />
                    Light Grey
                  </button>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 pl-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-100 border border-slate-300 shadow-xs" />
                    {theme === 'white-clean' ? 'White Background' : 'Light Grey (Default)'}
                  </span>
                  <span className="text-black/20 dark:text-white/20">|</span>
                  <button
                    onClick={() => setTheme('mix-neonpurple')}
                    className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 rounded-full font-bold text-[11px] text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
                    title="Switch to Pastel Waves background"
                  >
                    <Palette size={12} />
                    Pastel Waves
                  </button>
                </>
              )}
              <button
                onClick={() => setDismissRestorePill(true)}
                className="p-1 text-black/40 hover:text-black/80 dark:text-white/40 dark:hover:text-white/80 transition-colors rounded-full cursor-pointer ml-0.5"
                title="Dismiss quick switcher"
              >
                <X size={12} />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <Dock
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTheme={theme}
        setTheme={setTheme}
        isDarkMode={isDarkMode}
        language={language}
      />
    </div>
  );
}

