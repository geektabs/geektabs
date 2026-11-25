import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import quotesEnglish from '../../data/quote-English.json';
import quotesSpanish from '../../data/quote-Spanish.json';
import quotesFrench from '../../data/quote-French.json';
import quotesGerman from '../../data/quote-German.json';
import quotesChinese from '../../data/quote-Chinese.json';
import quotesChineseTraditional from '../../data/quote-Chinese-Traditional.json';
import quotesJapanese from '../../data/quote-Japanese.json';
import quotesKorean from '../../data/quote-Korean.json';
import quotesItalian from '../../data/quote-Italian.json';
import quotesRussian from '../../data/quote-Russian.json';
import quotesLuxembourgish from '../../data/quote-Luxembourgish.json';
import quotesDutch from '../../data/quote-Dutch.json';
import quotesSwedish from '../../data/quote-Swedish.json';
import quotesFinnish from '../../data/quote-Finnish.json';
import quotesHindi from '../../data/quote-Hindi.json';
import quotesNorwegian from '../../data/quote-Norwegian.json';
import quotesThai from '../../data/quote-Thai.json';
import quotesPortuguese from '../../data/quote-Portuguese.json';
import quotesVietnamese from '../../data/quote-Vietnamese.json';
import quotesPolish from '../../data/quote-Polish.json';
import quotesDanish from '../../data/quote-Danish.json';
import quotesTurkish from '../../data/quote-Turkish.json';
import quotesGreek from '../../data/quote-Greek.json';
import quotesBelgum from '../../data/quote-Belgum.json';

const quotesMap: Record<string, Array<{ quote: string; author: string }>> = {
  English: quotesEnglish,
  Spanish: quotesSpanish,
  French: quotesFrench,
  German: quotesGerman,
  Chinese: quotesChinese,
  'Chinese Traditional': quotesChineseTraditional,
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
  Belgum: quotesBelgum,
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
    English: 'Quote',
    Spanish: 'Cita',
    French: 'Citation',
    German: 'Zitat',
    Chinese: '名言',
    'Chinese Traditional': '名言',
    Japanese: '名言',
    Korean: '명언',
    Italian: 'Citazione',
    Russian: 'Цитата',
    Luxembourgish: 'Zitat',
    Dutch: 'Citaat',
    Swedish: 'Citat',
    Finnish: 'Sitaatti',
    Hindi: 'सुविचार',
    Norwegian: 'Sitat',
    Thai: 'คำคม',
    Portuguese: 'Citação',
    Vietnamese: 'Danh ngôn',
    Polish: 'Cytat',
    Danish: 'Citat',
    Turkish: 'Özlü Söz',
    Greek: 'Απόφθεγμα',
    Belgum: 'Citaat',
  }[language] || 'Quote';

  const quoteTooltips = {
    English: { refresh: 'Refresh quote', next: 'Click to get new quote' },
    Chinese: { refresh: '换一条名言', next: '点击获取新名言' },
    'Chinese Traditional': { refresh: '換一則名言', next: '點擊取得新名言' },
    Spanish: { refresh: 'Actualizar cita', next: 'Haz clic para ver otra cita' },
    French: { refresh: 'Actualiser la citation', next: 'Cliquez pour une nouvelle citation' },
    German: { refresh: 'Zitat aktualisieren', next: 'Für ein neues Zitat klicken' },
    Japanese: { refresh: '名言を更新', next: 'クリックして新しい名言を表示' },
    Korean: { refresh: '명언 새로고침', next: '클릭하여 새 명언 보기' },
    Italian: { refresh: 'Aggiorna citazione', next: 'Clicca per una nuova citazione' },
    Russian: { refresh: 'Обновить цитату', next: 'Нажмите для новой цитаты' },
    Luxembourgish: { refresh: 'Zitat aktualiséieren', next: 'Klickt fir en neit Zitat' },
    Dutch: { refresh: 'Citaat vernieuwen', next: 'Klik voor een nieuw citaat' },
    Swedish: { refresh: 'Uppdatera citat', next: 'Klicka för ett nytt citat' },
    Finnish: { refresh: 'Päivitä sitaatti', next: 'Napsauta saadaksesi uuden sitaatin' },
    Hindi: { refresh: 'सुविचार रीफ़्रेश करें', next: 'नया सुविचार पाने के लिए क्लिक करें' },
    Norwegian: { refresh: 'Oppdater sitat', next: 'Klikk for å få et nytt sitat' },
    Thai: { refresh: 'รีเฟรชคำคม', next: 'คลิกเพื่อรับคำคมใหม่' },
    Portuguese: { refresh: 'Atualizar citação', next: 'Clique para obter uma nova citação' },
    Vietnamese: { refresh: 'Làm mới danh ngôn', next: 'Nhấp để xem danh ngôn mới' },
    Polish: { refresh: 'Odśwież cytat', next: 'Kliknij, aby zobaczyć nowy cytat' },
    Danish: { refresh: 'Opdater citat', next: 'Klik for at få et nyt citat' },
    Turkish: { refresh: 'Sözü yenile', next: 'Yeni söz için tıklayın' },
    Greek: { refresh: 'Ανανέωση αποφθέγματος', next: 'Κάντε κλικ για νέο απόφθεγμα' },
    Belgum: { refresh: 'Citaat vernieuwen', next: 'Klik voor een nieuw citaat' },
  }[language] || { refresh: 'Refresh quote', next: 'Click to get new quote' };

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
          title={quoteTooltips.refresh}
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
        title={quoteTooltips.next}
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

