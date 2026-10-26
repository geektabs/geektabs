import React, { useState, useEffect } from 'react';
import { Smile, RefreshCw } from 'lucide-react';
import humorsEnglish from '../../data/humors-English.json';
import humorsSpanish from '../../data/humors-Spanish.json';
import humorsFrench from '../../data/humors-French.json';
import humorsGerman from '../../data/humors-German.json';
import humorsChinese from '../../data/humors-Chinese.json';
import humorsJapanese from '../../data/humors-Japanese.json';
import humorsKorean from '../../data/humors-Korean.json';
import humorsItalian from '../../data/humors-Italian.json';
import humorsRussian from '../../data/humors-Russian.json';
import humorsLuxembourgish from '../../data/humors-Luxembourgish.json';

const humorsMap: Record<string, string[]> = {
  English: humorsEnglish,
  Spanish: humorsSpanish,
  French: humorsFrench,
  German: humorsGerman,
  Chinese: humorsChinese,
  Japanese: humorsJapanese,
  Korean: humorsKorean,
  Italian: humorsItalian,
  Russian: humorsRussian,
  Luxembourgish: humorsLuxembourgish,
};

const STORAGE_KEY = 'GeekTabs_daily_humor_history';

function getFreshHumor(lang: string, excludeCurrentHumor?: string): string {
  const currentDataset = humorsMap[lang] || humorsEnglish;
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

  // Filter candidates that haven't been shown today, and exclude current humor if specified
  let candidates = currentDataset.filter(h => !seenToday.includes(h) && h !== excludeCurrentHumor);

  // If all humors in dataset have been seen today, allow any except the immediately current one
  if (candidates.length === 0) {
    candidates = currentDataset.filter(h => h !== excludeCurrentHumor);
    if (candidates.length === 0) {
      candidates = currentDataset;
    }
    seenToday = [];
  }

  // If first view of the day (seenToday empty), use day-of-year index to give deterministic daily joke
  let picked: string;
  if (seenToday.length === 0 && !excludeCurrentHumor) {
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

interface HumorWidgetProps {
  language?: string;
}

export default function HumorWidget({ language = 'English' }: HumorWidgetProps) {
  const [humor, setHumor] = useState<string>(() => getFreshHumor(language));
  const [loading, setLoading] = useState(false);

  const fetchHumor = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const nextHumor = getFreshHumor(language, humor);
      setHumor(nextHumor);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHumor(getFreshHumor(language));
  }, [language]);

  const widgetTitle = {
    English: 'Daily Humor',
    Spanish: 'Humor Diario',
    French: 'Humour Quotidien',
    German: 'Täglicher Humor',
    Chinese: '每日幽默',
    Japanese: '今日のジョーク',
    Korean: '일일 유머',
    Italian: 'Umorismo Giornaliero',
    Russian: 'Юмор дня',
    Luxembourgish: 'Deeglechen Humor'
  }[language] || 'Daily Humor';

  return (
    <div className="weather-huawei-style rounded-[2rem] h-full flex flex-col justify-between relative overflow-hidden transition-all group hover:shadow-lg hover:-translate-y-0.5">
      {/* Top Header: Squircle icon + Title + Refresh Button with Light Yellow Background */}
      <div className="daily-title-yellow daily-card-title-section w-full px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-2.5">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          <div className="daily-card-icon-badge w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border border-black/5 dark:border-white/10 text-[#c8102e] dark:text-red-500 flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105">
            <Smile className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2.2} />
          </div>
          <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight leading-snug break-words">
            {widgetTitle}
          </h2>
        </div>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fetchHumor();
          }}
          className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-[#c8102e] dark:text-slate-300 dark:hover:text-red-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all shrink-0 cursor-pointer"
          title="Refresh joke"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : 'transition-transform group-hover:rotate-45'} />
        </button>
      </div>

      {/* Full Straight Line splitting title and contents from left to right */}
      <div className="daily-card-divider w-full" />

      {/* Content Area without inside frame */}
      <div 
        onClick={fetchHumor}
        className="flex-1 flex flex-col justify-center px-4 sm:px-5 py-4 sm:py-5 cursor-pointer select-none"
        title="Click to get new joke"
      >
        <p 
          className="daily-card-content-text text-xs sm:text-[13px] md:text-sm font-normal leading-relaxed line-clamp-4 select-text"
          style={{ color: '#000000', WebkitTextFillColor: '#000000' }}
        >
          {humor}
        </p>
      </div>
    </div>
  );
}

