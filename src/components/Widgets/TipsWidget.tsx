import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import tipsEnglish from '../../data/tips-English.json';
import tipsSpanish from '../../data/tips-Spanish.json';
import tipsFrench from '../../data/tips-French.json';
import tipsGerman from '../../data/tips-German.json';
import tipsChinese from '../../data/tips-Chinese.json';
import tipsChineseTraditional from '../../data/tips-Chinese-Traditional.json';
import tipsJapanese from '../../data/tips-Japanese.json';
import tipsKorean from '../../data/tips-Korean.json';
import tipsItalian from '../../data/tips-Italian.json';
import tipsRussian from '../../data/tips-Russian.json';
import tipsLuxembourgish from '../../data/tips-Luxembourgish.json';
import tipsDutch from '../../data/tips-Dutch.json';
import tipsSwedish from '../../data/tips-Swedish.json';
import tipsFinnish from '../../data/tips-Finnish.json';
import tipsHindi from '../../data/tips-Hindi.json';
import tipsNorwegian from '../../data/tips-Norwegian.json';
import tipsThai from '../../data/tips-Thai.json';
import tipsPortuguese from '../../data/tips-Portuguese.json';
import tipsVietnamese from '../../data/tips-Vietnamese.json';
import tipsPolish from '../../data/tips-Polish.json';
import tipsDanish from '../../data/tips-Danish.json';
import tipsTurkish from '../../data/tips-Turkish.json';
import tipsGreek from '../../data/tips-Greek.json';
import tipsBelgum from '../../data/tips-Belgum.json';

const tipsMap: Record<string, string[]> = {
  English: tipsEnglish,
  Spanish: tipsSpanish,
  French: tipsFrench,
  German: tipsGerman,
  Chinese: tipsChinese,
  'Chinese Traditional': tipsChineseTraditional,
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
  Belgum: tipsBelgum,
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
    English: 'Tips',
    Spanish: 'Consejos',
    French: 'Conseils',
    German: 'Tipps',
    Chinese: '小贴士',
    'Chinese Traditional': '小撇步',
    Japanese: 'ヒント',
    Korean: '팁',
    Italian: 'Consigli',
    Russian: 'Советы',
    Luxembourgish: 'Tipps',
    Dutch: 'Tips',
    Swedish: 'Tips',
    Finnish: 'Vinkit',
    Hindi: 'सुझाव',
    Norwegian: 'Tips',
    Thai: 'เคล็ดลับ',
    Portuguese: 'Dicas',
    Vietnamese: 'Mẹo',
    Polish: 'Porady',
    Danish: 'Tips',
    Turkish: 'İpuçları',
    Greek: 'Συμβουλές',
    Belgum: 'Tips',
  }[language] || 'Tips';

  const tipTooltips = {
    English: { refresh: 'Refresh tip', next: 'Click to get new tip' },
    Chinese: { refresh: '刷新小贴士', next: '点击获取新贴士' },
    'Chinese Traditional': { refresh: '重新整理小撇步', next: '點擊取得新撇步' },
    Spanish: { refresh: 'Actualizar consejo', next: 'Haz clic para ver un nuevo consejo' },
    French: { refresh: 'Actualiser le conseil', next: 'Cliquez pour un nouveau conseil' },
    German: { refresh: 'Tipp aktualisieren', next: 'Für einen neuen Tipp klicken' },
    Japanese: { refresh: 'ヒントを更新', next: 'クリックして新しいヒントを表示' },
    Korean: { refresh: '팁 새로고침', next: '클릭하여 새 팁 보기' },
    Italian: { refresh: 'Aggiorna consiglio', next: 'Clicca per un nuovo consiglio' },
    Russian: { refresh: 'Обновить совет', next: 'Нажмите для нового совета' },
    Luxembourgish: { refresh: 'Tipp aktualiséieren', next: 'Klickt fir en neien Tipp' },
    Dutch: { refresh: 'Tip vernieuwen', next: 'Klik voor een nieuwe tip' },
    Swedish: { refresh: 'Uppdatera tips', next: 'Klicka för ett nytt tips' },
    Finnish: { refresh: 'Päivitä vinkki', next: 'Napsauta saadaksesi uuden vinkin' },
    Hindi: { refresh: 'सुझाव रीफ़्रेश करें', next: 'नया सुझाव पाने के लिए क्लिक करें' },
    Norwegian: { refresh: 'Oppdater tips', next: 'Klikk for å få et nytt tips' },
    Thai: { refresh: 'รีเฟรชเคล็ดลับ', next: 'คลิกเพื่อรับเคล็ดลับใหม่' },
    Portuguese: { refresh: 'Atualizar dica', next: 'Clique para obter uma nova dica' },
    Vietnamese: { refresh: 'Làm mới mẹo', next: 'Nhấp để xem mẹo mới' },
    Polish: { refresh: 'Odśwież poradę', next: 'Kliknij, aby zobaczyć nową poradę' },
    Danish: { refresh: 'Opdater tip', next: 'Klik for at få et nyt tip' },
    Turkish: { refresh: 'İpucunu yenile', next: 'Yeni ipucu için tıklayın' },
    Greek: { refresh: 'Ανανέωση συμβουλής', next: 'Κάντε κλικ για νέα συμβουλή' },
    Belgum: { refresh: 'Tip vernieuwen', next: 'Klik voor een nieuwe tip' },
  }[language] || { refresh: 'Refresh tip', next: 'Click to get new tip' };

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
          title={tipTooltips.refresh}
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
        title={tipTooltips.next}
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

