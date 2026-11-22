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

const SETTINGS_ITEM = { key: 'settings', icon: Settings, labelKey: 'settings' };

export default function Dock({ activeTab, setActiveTab, currentTheme, setTheme, isDarkMode, language, setLanguage }: DockProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);

  const shareUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://geektabs.com';
  const shareTitle = 'GeekTabs — Bookmarks, Calendar, Notes & Productivity Workspace';
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedShareTitle = encodeURIComponent(shareTitle);

  const sharePlatforms = [
    {
      id: 'facebook',
      name: 'Meta (Facebook)',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2" aria-hidden="true">
          <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0A66C2" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    },
    {
      id: 'x',
      name: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareTitle}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="#0F172A" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: 'reddit',
      name: 'Reddit',
      href: `https://www.reddit.com/submit?url=${encodedShareUrl}&title=${encodedShareTitle}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#FF4500" aria-hidden="true">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5.92 11.11a1.59 1.59 0 0 1-.47 1.13c-.1.99-.68 1.88-1.64 2.53a7.17 7.17 0 0 1-3.81 1.03 7.17 7.17 0 0 1-3.81-1.03c-.96-.65-1.54-1.54-1.64-2.53a1.61 1.61 0 0 1-.47-1.13 1.56 1.56 0 0 1 2.41-1.31 6.72 6.72 0 0 1 3.1-.88l.53-2.49a.34.34 0 0 1 .41-.26l1.75.37a1.12 1.12 0 1 1-.14.68l-1.48-.31-.44 2.09a6.69 6.69 0 0 1 3.04.88 1.56 1.56 0 0 1 2.26 1.3zm-8.44-.11a1.12 1.12 0 1 0 1.12 1.12A1.12 1.12 0 0 0 9.48 13zm5.04 0a1.12 1.12 0 1 0 1.12 1.12A1.12 1.12 0 0 0 14.52 13zm-4.4 2.86a.34.34 0 0 0 0 .48 2.91 2.91 0 0 0 3.76 0 .34.34 0 1 0-.48-.48 2.24 2.24 0 0 1-2.8 0 .34.34 0 0 0-.48 0z" />
        </svg>
      ),
    },
    {
      id: 'substack',
      name: 'Substack',
      href: `https://substack.com/notes?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="#FF6719" aria-hidden="true">
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
  const currentItem = allItems.find((item) => item.key === activeTab) || NAV_ITEMS[0];
  const CurrentIcon = currentItem.icon;

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
      <div
        className={`top-menu-bar isolate fixed top-0 left-0 right-0 z-[60] flex flex-row items-center justify-center border-b backdrop-blur-xl shadow-xs transition-colors duration-200 [text-shadow:none] ${
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
              className={`flex items-center gap-2 min-h-[40px] px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-xs active:scale-95 select-none ${
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
                title="Share GeekTabs"
                aria-label="Share"
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
                <span className="hidden 2xl:inline">Share</span>
              </button>

              <AnimatePresence>
                {isShareOpen && (
                  <motion.div
                    id="global-share-dropdown"
                    role="dialog"
                    aria-label="Share GeekTabs"
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
                    <div className="mb-4">
                      <h3
                        className={`text-lg font-black tracking-tight leading-snug ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        Show Us Some Love
                      </h3>
                      <p
                        className={`text-xs sm:text-sm font-normal mt-0.5 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        Tell the world about GeekTabs
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2.5 mb-5">
                      {sharePlatforms.map((platform) => (
                        <a
                          key={platform.id}
                          href={platform.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsShareOpen(false)}
                          title={`Share on ${platform.name}`}
                          aria-label={`Share on ${platform.name}`}
                          className="w-11 h-11 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:scale-105 transition-all flex items-center justify-center shadow-2xs shrink-0 cursor-pointer"
                        >
                          {platform.icon}
                        </a>
                      ))}
                    </div>

                    <div
                      className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border ${
                        isDarkMode
                          ? 'bg-slate-800/80 border-slate-700'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <span
                        className={`text-xs sm:text-sm font-medium truncate select-all ${
                          isDarkMode ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        {shareUrl}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyShareLink}
                        className="text-xs sm:text-sm font-bold text-[#0284c7] hover:text-[#0369a1] dark:text-sky-400 dark:hover:text-sky-300 shrink-0 cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        {copiedShareLink ? (
                          <>
                            <Check size={13} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <span>Copy Link</span>
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
                    aria-label="Language"
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
                    aria-label="Language selection"
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
                    className={`flex items-center justify-between px-3 py-1.5 sm:py-2 mb-1 border-b ${
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
                      className={`p-1.5 sm:p-2 min-w-[36px] min-h-[36px] sm:min-w-[38px] sm:min-h-[38px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
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
    </button>
  );
}
