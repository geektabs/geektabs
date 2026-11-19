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
import tipsDutch from '../../data/life-tips-Dutch.json';
import tipsSwedish from '../../data/life-tips-Swedish.json';
import tipsFinnish from '../../data/life-tips-Finnish.json';
import tipsHindi from '../../data/life-tips-Hindi.json';
import tipsNorwegian from '../../data/life-tips-Norwegian.json';
import tipsThai from '../../data/life-tips-Thai.json';
import tipsPortuguese from '../../data/life-tips-Portuguese.json';
import tipsVietnamese from '../../data/life-tips-Vietnamese.json';
import tipsPolish from '../../data/life-tips-Polish.json';
import tipsDanish from '../../data/life-tips-Danish.json';
import tipsTurkish from '../../data/life-tips-Turkish.json';
import tipsGreek from '../../data/life-tips-Greek.json';

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
  Dutch: tipsDutch,
  Swedish: tipsSwedish,
  Finnish: tipsFinnish,
  Hindi: tipsHindi,
  Norwegian: tipsNorwegian,
  Thai: tipsThai,
  Portuguese: tipsPortuguese,
  Vietnamese: tipsVietnamese,
  Polish: tipsPolish,
  Danish: tipsDanish,
  Turkish: tipsTurkish,
  Greek: tipsGreek,
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
    Luxembourgish: 'Deeglech Tipps',
    Dutch: 'Dagelijkse Tips',
    Swedish: 'Dagliga Tips',
    Finnish: 'Päivän Vinkit',
    Hindi: 'दैनिक सुझाव',
    Norwegian: 'Daglige Tips',
    Thai: 'เคล็ดลับประจำวัน',
    Portuguese: 'Dicas Diárias',
    Vietnamese: 'Mẹo Hằng Ngày',
    Polish: 'Codzienne Porady',
    Danish: 'Daglige Tips',
    Turkish: 'Günlük İpuçları',
    Greek: 'Ημερήσιες Συμβουλές',
  }[language] || 'Daily Tips';

  return (
    <div className="weather-huawei-style daily-webcard rounded-[2rem] h-full flex flex-col justify-between relative overflow-hidden transition-colors group">
      {/* Top Header: Squircle icon + Title + Refresh Button with Regular Green Background */}
      <div className="daily-title-green daily-card-title-section w-full px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-2.5">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          <div className="daily-card-icon-badge w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white text-[#c8102e] flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105">
            <Lightbulb className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2.2} />
          </div>
          <h2 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug break-words">
            {widgetTitle}
          </h2>
        </div>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fetchTip();
          }}
          className="p-2.5 lg:p-2 min-w-[40px] min-h-[40px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-xl text-slate-500 hover:text-[#c8102e] dark:text-slate-300 dark:hover:text-red-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all shrink-0 cursor-pointer"
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
          className="daily-card-content-text text-sm sm:text-[15px] lg:text-base xl:text-[17px] font-normal leading-relaxed line-clamp-none sm:line-clamp-5 lg:line-clamp-5 select-text"
        >
          {tip}
        </p>
      </div>
    </div>
  );
}

