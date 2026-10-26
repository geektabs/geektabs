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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { t } from '../../i18n';

interface DockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentTheme: string;
  setTheme: (theme: string) => void;
  isDarkMode: boolean;
  language: string;
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

const SETTINGS_ITEM = { key: 'settings', icon: Settings, labelKey: 'settings' };

export default function Dock({ activeTab, setActiveTab, currentTheme, setTheme, isDarkMode, language }: DockProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const allItems = [...NAV_ITEMS, SETTINGS_ITEM];
  const currentItem = allItems.find((item) => item.key === activeTab) || NAV_ITEMS[0];
  const CurrentIcon = currentItem.icon;

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Universal Top Menu Bar */}
      <div
        className={`top-menu-bar fixed top-0 left-0 right-0 z-[60] flex flex-row items-center justify-center border-b backdrop-blur-xl shadow-xs transition-colors duration-200 [text-shadow:none] ${
          isDarkMode
            ? 'bg-slate-900/90 border-white/10 text-white'
            : 'bg-white/90 border-black/10 text-slate-900'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between relative">
          {/* Logo / Brand Indicator (left side corner) */}
          <div
            id="brand-logo-button"
            className="flex items-center gap-2 cursor-pointer select-none [text-shadow:none] z-10 shrink-0"
            onClick={() => {
              setActiveTab('home');
              setIsMenuOpen(false);
            }}
          >
            <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 [text-shadow:none]">
              <span className="text-white font-extrabold text-xs antialiased [text-shadow:none]">G</span>
            </div>
            <span
              className={`font-bold tracking-tight text-sm [text-shadow:none] ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              GeekTabs
            </span>
          </div>

          {/* Desktop Nav Items (centered horizontally in navbar on screens >= xl) */}
          <div className="hidden xl:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10">
            <div className="flex flex-row items-center gap-1.5 py-1 px-2">
              {NAV_ITEMS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <DockItem
                    key={item.key}
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
                icon={<Settings size={16} />}
                label={t(language, 'settings')}
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {/* Mobile and Tablet One-Click Menu Trigger (screens < xl) */}
          <div className="flex items-center gap-2 xl:hidden relative ml-auto z-10">
            <button
              id="mobile-tablet-menu-trigger"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-xs active:scale-95 select-none ${
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
              aria-label={t(language, 'menu')}
            >
              <div className="flex items-center gap-1.5">
                <span className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}>
                  <CurrentIcon size={16} />
                </span>
                <span
                  className={`font-semibold max-w-[120px] sm:max-w-[180px] truncate ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {t(language, currentItem.labelKey)}
                </span>
              </div>
              <div
                className={`w-px h-3.5 mx-0.5 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                }`}
              />
              <div
                className={`flex items-center gap-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <Menu size={16} />
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isMenuOpen
                      ? `rotate-180 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`
                      : ''
                  }`}
                />
              </div>
            </button>
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
                  className={`absolute right-4 sm:right-6 top-14 mt-1.5 w-72 sm:w-80 max-w-[calc(100vw-2rem)] rounded-2xl border shadow-2xl p-2 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin xl:hidden [text-shadow:none] ${
                    isDarkMode
                      ? 'bg-slate-900/98 border-slate-700 text-white shadow-black/60'
                      : 'bg-white/98 border-slate-200/90 text-slate-900 shadow-slate-900/15'
                  }`}
                >
                  {/* Menu List Header */}
                  <div
                    className={`flex items-center justify-between px-3 py-2 mb-1 border-b ${
                      isDarkMode ? 'border-slate-800' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Menu
                        size={15}
                        className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}
                      />
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {t(language, 'menu')}
                      </span>
                    </div>
                    <button
                      id="mobile-menu-close-button"
                      onClick={() => setIsMenuOpen(false)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isDarkMode
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      aria-label="Close menu"
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
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer group select-none ${
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
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer group select-none ${
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
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
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
      </div>
    </>
  );
}

function DockItem({
  icon,
  label,
  active,
  onClick,
  isDarkMode,
}: {
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
    <button
      onClick={onClick}
      className={`relative px-3 py-1.5 rounded-full text-xs transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap outline-none shrink-0 cursor-pointer ${
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
    </button>
  );
}
