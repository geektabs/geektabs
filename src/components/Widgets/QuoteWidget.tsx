import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import quotesEnglish from '../../data/quotes-English.json';
import quotesSpanish from '../../data/quotes-Spanish.json';
import quotesFrench from '../../data/quotes-French.json';
import quotesGerman from '../../data/quotes-German.json';
import quotesChinese from '../../data/quotes-Chinese.json';
import quotesJapanese from '../../data/quotes-Japanese.json';
import quotesKorean from '../../data/quotes-Korean.json';
import quotesItalian from '../../data/quotes-Italian.json';
import quotesRussian from '../../data/quotes-Russian.json';
import quotesLuxembourgish from '../../data/quotes-Luxembourgish.json';
import quotesDutch from '../../data/quotes-Dutch.json';
import quotesSwedish from '../../data/quotes-Swedish.json';
import quotesFinnish from '../../data/quotes-Finnish.json';
import quotesHindi from '../../data/quotes-Hindi.json';
import quotesNorwegian from '../../data/quotes-Norwegian.json';
import quotesThai from '../../data/quotes-Thai.json';
import quotesPortuguese from '../../data/quotes-Portuguese.json';
import quotesVietnamese from '../../data/quotes-Vietnamese.json';
import quotesPolish from '../../data/quotes-Polish.json';
import quotesDanish from '../../data/quotes-Danish.json';
import quotesTurkish from '../../data/quotes-Turkish.json';
import quotesGreek from '../../data/quotes-Greek.json';

const quotesMap: Record<string, Array<{ quote: string; author: string }>> = {
  English: quotesEnglish,
  Spanish: quotesSpanish,
  French: quotesFrench,
  German: quotesGerman,
  Chinese: quotesChinese,
  Japanese: quotesJapanese,
  Korean: quotesKorean,
  Italian: quotesItalian,
  Russian: quotesRussian,
  Luxembourgish: quotesLuxembourgish,
  Dutch: quotesDutch,
  Swedish: quotesSwedish,
  Finnish: quotesFinnish,
  Hindi: quotesHindi,
  Norwegian: quotesNorwegian,
  Thai: quotesThai,
  Portuguese: quotesPortuguese,
  Vietnamese: quotesVietnamese,
  Polish: quotesPolish,
  Danish: quotesDanish,
  Turkish: quotesTurkish,
  Greek: quotesGreek,
};

const STORAGE_KEY = 'GeekTabs_daily_quote_history';

function getFreshQuote(lang: string, excludeCurrentQuote?: string): { quote: string; author: string } {
  const currentDataset = quotesMap[lang] || quotesEnglish;
  if (!currentDataset || currentDataset.length === 0) {
    return { quote: '', author: '' };
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

  // Filter candidates that haven't been shown today, and exclude current quote if specified
  let candidates = currentDataset.filter(q => !seenToday.includes(q.quote) && q.quote !== excludeCurrentQuote);

  // If all quotes in dataset have been seen today, allow any except the immediately current one
  if (candidates.length === 0) {
    candidates = currentDataset.filter(q => q.quote !== excludeCurrentQuote);
    if (candidates.length === 0) {
      candidates = currentDataset;
    }
    seenToday = [];
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)] || currentDataset[0];

  try {
    const updatedSeen = [...seenToday, picked.quote].slice(-currentDataset.length);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, seen: updatedSeen }));
  } catch (e) {
    // ignore storage error
  }

  return picked;
}

interface QuoteWidgetProps {
  language?: string;
}

export default function QuoteWidget({ language = 'English' }: QuoteWidgetProps) {
  const [data, setData] = useState<{ quote: string; author: string } | null>(() => getFreshQuote(language));
  const [loading, setLoading] = useState(false);

  const fetchInspiration = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const nextQuote = getFreshQuote(language, data?.quote);
      setData(nextQuote);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData(getFreshQuote(language));
  }, [language]);

  const widgetTitle = {
    English: 'Daily Quote',
    Spanish: 'Cita Diaria',
    French: 'Citation Quotidienne',
    German: 'Tägliches Zitat',
    Chinese: '每日名言',
    Japanese: '今日の名言',
    Korean: '오늘의 명언',
    Italian: 'Citazione Giornaliera',
    Russian: 'Цитата дня',
    Luxembourgish: 'Deeglecht Zitat',
    Dutch: 'Dagelijks Citaat',
    Swedish: 'Dagens Citat',
    Finnish: 'Päivän Sitaatti',
    Hindi: 'दैनिक सुविचार',
    Norwegian: 'Dagens Sitat',
    Thai: 'คำคมประจำวัน',
    Portuguese: 'Citação Diária',
    Vietnamese: 'Danh Ngôn Hằng Ngày',
    Polish: 'Cytat Dnia',
    Danish: 'Dagens Citat',
    Turkish: 'Günün Sözü',
    Greek: 'Απόφθεγμα Ημέρας',
  }[language] || 'Daily Quote';

  return (
    <div className="weather-huawei-style daily-webcard rounded-[2rem] h-full flex flex-col justify-between relative overflow-hidden transition-colors group">
      {/* Top Header: Squircle icon + Title + Refresh Button with Regular Orange Background */}
      <div className="daily-title-orange daily-card-title-section w-full px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-2.5">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          <div className="daily-card-icon-badge w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white text-[#c8102e] flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105">
            <Quote className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2.2} />
          </div>
          <h2 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug break-words">
            {widgetTitle}
          </h2>
        </div>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fetchInspiration();
          }}
          className="p-2.5 lg:p-2 min-w-[40px] min-h-[40px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-xl text-slate-500 hover:text-[#c8102e] dark:text-slate-300 dark:hover:text-red-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all shrink-0 cursor-pointer"
          title="Refresh quote"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : 'transition-transform group-hover:rotate-45'} />
        </button>
      </div>

      {/* Full Straight Line splitting title and contents from left to right */}
      <div className="daily-card-divider w-full" />

      {/* Content Area without inside frame */}
      <div 
        onClick={fetchInspiration}
        className="flex-1 flex flex-col justify-between px-4 sm:px-5 py-4 sm:py-5 cursor-pointer select-none"
        title="Click to get new quote"
      >
        <div className="my-auto py-1">
          <p 
            className="daily-card-content-text text-sm sm:text-[15px] lg:text-base xl:text-[17px] font-normal leading-relaxed italic line-clamp-none sm:line-clamp-4 lg:line-clamp-4 select-text"
          >
            {data?.quote}
          </p>
        </div>

        <div className="pt-2 border-t border-black/5 dark:border-white/5 mt-1">
          <p 
            className="daily-card-content-text quote-author text-xs lg:text-[11px] font-bold uppercase tracking-wider leading-snug line-clamp-1 select-text opacity-90"
          >
            &mdash; {data?.author}
          </p>
        </div>
      </div>
    </div>
  );
}

