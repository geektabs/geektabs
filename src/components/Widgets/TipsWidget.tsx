import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import tipsEnglish from '../../data/life-tips-English.json';
import tipsSpanish from '../../data/life-tips-Spanish.json';
import tipsFrench from '../../data/life-tips-French.json';
import tipsGerman from '../../data/life-tips-German.json';
import tipsChinese from '../../data/life-tips-Chinese.json';
import tipsJapanese from '../../data/life-tips-Japanese.json';
import tipsKorean from '../../data/life-tips-Korean.json';
import tipsItalian from '../../data/life-tips-Italian.json';
import tipsRussian from '../../data/life-tips-Russian.json';
import tipsLuxembourgish from '../../data/life-tips-Luxembourgish.json';

const tipsMap: Record<string, string[]> = {
  English: tipsEnglish,
  Spanish: tipsSpanish,
  French: tipsFrench,
  German: tipsGerman,
  Chinese: tipsChinese,
  Japanese: tipsJapanese,
  Korean: tipsKorean,
  Italian: tipsItalian,
  Russian: tipsRussian,
  Luxembourgish: tipsLuxembourgish,
};

const STORAGE_KEY = 'GeekTabs_daily_tip_history';

function getFreshTip(lang: string, excludeCurrentTip?: string): string {
  const currentDataset = tipsMap[lang] || tipsEnglish;
  if (!currentDataset || currentDataset.length === 0) {
    return '';
  }

  const today = new Date().toISOString().slice(0, 10);
  let seenToday: string[] = [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.date === today && Array.isArray(parsed.seen)) {
        seenToday = parsed.seen;
      }
    }
  } catch (e) {
    // ignore parse error
  }

  // Filter candidates that haven't been shown today, and exclude current tip if specified
  let candidates = currentDataset.filter(t => !seenToday.includes(t) && t !== excludeCurrentTip);

  // If all tips in dataset have been seen today, allow any except the immediately current one
  if (candidates.length === 0) {
    candidates = currentDataset.filter(t => t !== excludeCurrentTip);
    if (candidates.length === 0) {
      candidates = currentDataset;
    }
    seenToday = [];
  }

  // If first view of the day (seenToday empty), use day-of-year index to give deterministic daily tip
  let picked: string;
  if (seenToday.length === 0 && !excludeCurrentTip) {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const dayIndex = ((dayOfYear % currentDataset.length) + currentDataset.length) % currentDataset.length;
    picked = currentDataset[dayIndex] || candidates[0];
  } else {
    picked = candidates[Math.floor(Math.random() * candidates.length)] || currentDataset[0];
  }

  try {
    const updatedSeen = [...seenToday, picked].slice(-currentDataset.length);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, seen: updatedSeen }));
  } catch (e) {
    // ignore storage error
  }

  return picked;
}

interface TipsWidgetProps {
  language?: string;
}

export default function TipsWidget({ language = 'English' }: TipsWidgetProps) {
  const [tip, setTip] = useState<string>(() => getFreshTip(language));
  const [loading, setLoading] = useState(false);

  const fetchTip = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const nextTip = getFreshTip(language, tip);
      setTip(nextTip);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTip(getFreshTip(language));
  }, [language]);

  const widgetTitle = {
    English: 'Daily Tips',
    Spanish: 'Consejos Diarios',
    French: 'Conseils Quotidiens',
    German: 'Tägliche Tipps',
    Chinese: '每日小贴士',
    Japanese: '今日のヒント',
    Korean: '일일 팁',
    Italian: 'Consigli Giornalieri',
    Russian: 'Совет дня',
    Luxembourgish: 'Deeglech Tipps'
  }[language] || 'Daily Tips';

  return (
    <div className="weather-huawei-style rounded-[2rem] h-full flex flex-col justify-between relative overflow-hidden transition-all group hover:shadow-lg hover:-translate-y-0.5">
      {/* Top Header: Squircle icon + Title + Refresh Button with Light Green Background */}
      <div className="daily-title-green daily-card-title-section w-full px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-2.5">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          <div className="daily-card-icon-badge w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border border-black/5 dark:border-white/10 text-[#c8102e] dark:text-red-500 flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105">
            <Lightbulb className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2.2} />
          </div>
          <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight leading-snug break-words">
            {widgetTitle}
          </h2>
        </div>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fetchTip();
          }}
          className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-[#c8102e] dark:text-slate-300 dark:hover:text-red-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all shrink-0 cursor-pointer"
          title="Refresh tip"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : 'transition-transform group-hover:rotate-45'} />
        </button>
      </div>

      {/* Full Straight Line splitting title and contents from left to right */}
      <div className="daily-card-divider w-full" />

      {/* Content Area without inside frame */}
      <div 
        onClick={fetchTip}
        className="flex-1 flex flex-col justify-center px-4 sm:px-5 py-4 sm:py-5 cursor-pointer select-none"
        title="Click to get new tip"
      >
        <p 
          className="daily-card-content-text text-xs sm:text-[13px] md:text-sm font-normal leading-relaxed line-clamp-4 select-text"
          style={{ color: '#000000', WebkitTextFillColor: '#000000' }}
        >
          {tip}
        </p>
      </div>
    </div>
  );
}

