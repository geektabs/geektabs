import React, { useState, useEffect } from 'react';
import { Smile, RefreshCw } from 'lucide-react';
import humorsEnglish from '../../data/humors-English.json';
import humorsSpanish from '../../data/humors-Spanish.json';
import humorsFrench from '../../data/humors-French.json';
import humorsGerman from '../../data/humors-German.json';
import humorsChinese from '../../data/humors-Chinese.json';
import humorsChineseTraditional from '../../data/humors-Chinese-Traditional.json';
import humorsJapanese from '../../data/humors-Japanese.json';
import humorsKorean from '../../data/humors-Korean.json';
import humorsItalian from '../../data/humors-Italian.json';
import humorsRussian from '../../data/humors-Russian.json';
import humorsLuxembourgish from '../../data/humors-Luxembourgish.json';
import humorsDutch from '../../data/humors-Dutch.json';
import humorsSwedish from '../../data/humors-Swedish.json';
import humorsFinnish from '../../data/humors-Finnish.json';
import humorsHindi from '../../data/humors-Hindi.json';
import humorsNorwegian from '../../data/humors-Norwegian.json';
import humorsThai from '../../data/humors-Thai.json';
import humorsPortuguese from '../../data/humors-Portuguese.json';
import humorsVietnamese from '../../data/humors-Vietnamese.json';
import humorsPolish from '../../data/humors-Polish.json';
import humorsDanish from '../../data/humors-Danish.json';
import humorsTurkish from '../../data/humors-Turkish.json';
import humorsGreek from '../../data/humors-Greek.json';

const humorsMap: Record<string, string[]> = {
  English: humorsEnglish,
  Spanish: humorsSpanish,
  French: humorsFrench,
  German: humorsGerman,
  Chinese: humorsChinese,
  'Chinese Traditional': humorsChineseTraditional,
  Japanese: humorsJapanese,
  Korean: humorsKorean,
  Italian: humorsItalian,
  Russian: humorsRussian,
  Luxembourgish: humorsLuxembourgish,
  Dutch: humorsDutch,
  Swedish: humorsSwedish,
  Finnish: humorsFinnish,
  Hindi: humorsHindi,
  Norwegian: humorsNorwegian,
  Thai: humorsThai,
  Portuguese: humorsPortuguese,
  Vietnamese: humorsVietnamese,
  Polish: humorsPolish,
  Danish: humorsDanish,
  Turkish: humorsTurkish,
  Greek: humorsGreek,
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
    'Chinese Traditional': '每日幽默',
    Japanese: '今日のジョーク',
    Korean: '일일 유머',
    Italian: 'Umorismo Giornaliero',
    Russian: 'Юмор дня',
    Luxembourgish: 'Deeglechen Humor',
    Dutch: 'Dagelijkse Humor',
    Swedish: 'Dagens Humor',
    Finnish: 'Päivän Huumori',
    Hindi: 'दैनिक हास्य',
    Norwegian: 'Daglig Humor',
    Thai: 'อารมณ์ขันประจำวัน',
    Portuguese: 'Humor Diário',
    Vietnamese: 'Hài Hước Hằng Ngày',
    Polish: 'Dawka Humoru',
    Danish: 'Dagens Humor',
    Turkish: 'Günün Mizahı',
    Greek: 'Χιούμορ Ημέρας',
  }[language] || 'Daily Humor';

  const humorTooltips = {
    English: { refresh: 'Refresh joke', next: 'Click to get new joke' },
    Chinese: { refresh: '换一条幽默', next: '点击查看新笑话' },
    'Chinese Traditional': { refresh: '換一則幽默', next: '點擊查看新笑話' },
    Spanish: { refresh: 'Actualizar chiste', next: 'Haz clic para ver otro chiste' },
    French: { refresh: 'Actualiser la blague', next: 'Cliquez pour une nouvelle blague' },
    German: { refresh: 'Witz aktualisieren', next: 'Für einen neuen Witz klicken' },
    Japanese: { refresh: 'ジョークを更新', next: 'クリックして新しいジョークを表示' },
    Korean: { refresh: '유머 새로고침', next: '클릭하여 새 유머 보기' },
    Italian: { refresh: 'Aggiorna battuta', next: 'Clicca per una nuova battuta' },
    Russian: { refresh: 'Обновить шутку', next: 'Нажмите для новой шутки' },
    Luxembourgish: { refresh: 'Witz aktualiséieren', next: 'Klickt fir en neie Witz' },
    Dutch: { refresh: 'Grap vernieuwen', next: 'Klik voor een nieuwe grap' },
    Swedish: { refresh: 'Uppdatera skämt', next: 'Klicka för ett nytt skämt' },
    Finnish: { refresh: 'Päivitä vitsi', next: 'Napsauta saadaksesi uuden vitsin' },
    Hindi: { refresh: 'चुटकुला रीफ़्रेश करें', next: 'नया चुटकुला पाने के लिए क्लिक करें' },
    Norwegian: { refresh: 'Oppdater vits', next: 'Klikk for å få en ny vits' },
    Thai: { refresh: 'รีเฟรชเรื่องขำขัน', next: 'คลิกเพื่อดูเรื่องขำขันใหม่' },
    Portuguese: { refresh: 'Atualizar piada', next: 'Clique para obter uma nova piada' },
    Vietnamese: { refresh: 'Làm mới truyện cười', next: 'Nhấp để xem truyện cười mới' },
    Polish: { refresh: 'Odśwież żart', next: 'Kliknij, aby zobaczyć nowy żart' },
    Danish: { refresh: 'Opdater vittighed', next: 'Klik for at få en ny vittighed' },
    Turkish: { refresh: 'Fıkrayı yenile', next: 'Yeni fıkra için tıklayın' },
    Greek: { refresh: 'Ανανέωση αστείου', next: 'Κάντε κλικ για νέο αστείο' },
  }[language] || { refresh: 'Refresh joke', next: 'Click to get new joke' };

  return (
    <div className="weather-huawei-style daily-webcard rounded-[2rem] h-full flex flex-col justify-between relative overflow-hidden transition-colors group">
      {/* Top Header: Squircle icon + Title + Refresh Button with Regular Blue Background */}
      <div className="daily-title-blue daily-card-title-section w-full px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-2.5">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          <div className="daily-card-icon-badge w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white text-[#c8102e] flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105">
            <Smile className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2.2} />
          </div>
          <h2 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug break-words">
            {widgetTitle}
          </h2>
        </div>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fetchHumor();
          }}
          className="p-2.5 lg:p-2 min-w-[40px] min-h-[40px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-xl text-slate-500 hover:text-[#c8102e] dark:text-slate-300 dark:hover:text-red-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all shrink-0 cursor-pointer"
          title={humorTooltips.refresh}
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
        title={humorTooltips.next}
      >
        <p 
          className="daily-card-content-text text-sm sm:text-[15px] lg:text-base xl:text-[17px] font-normal leading-relaxed line-clamp-none sm:line-clamp-5 lg:line-clamp-5 select-text"
        >
          {humor}
        </p>
      </div>
    </div>
  );
}

