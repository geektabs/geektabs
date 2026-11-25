import React, { useState, useEffect } from 'react';
import { BellRing, RefreshCw } from 'lucide-react';
import remindersEnglish from '../../data/reminder-English.json';
import remindersSpanish from '../../data/reminder-Spanish.json';
import remindersFrench from '../../data/reminder-French.json';
import remindersGerman from '../../data/reminder-German.json';
import remindersChinese from '../../data/reminder-Chinese.json';
import remindersChineseTraditional from '../../data/reminder-Chinese-Traditional.json';
import remindersJapanese from '../../data/reminder-Japanese.json';
import remindersKorean from '../../data/reminder-Korean.json';
import remindersItalian from '../../data/reminder-Italian.json';
import remindersRussian from '../../data/reminder-Russian.json';
import remindersLuxembourgish from '../../data/reminder-Luxembourgish.json';
import remindersDutch from '../../data/reminder-Dutch.json';
import remindersSwedish from '../../data/reminder-Swedish.json';
import remindersFinnish from '../../data/reminder-Finnish.json';
import remindersHindi from '../../data/reminder-Hindi.json';
import remindersNorwegian from '../../data/reminder-Norwegian.json';
import remindersThai from '../../data/reminder-Thai.json';
import remindersPortuguese from '../../data/reminder-Portuguese.json';
import remindersVietnamese from '../../data/reminder-Vietnamese.json';
import remindersPolish from '../../data/reminder-Polish.json';
import remindersDanish from '../../data/reminder-Danish.json';
import remindersTurkish from '../../data/reminder-Turkish.json';
import remindersGreek from '../../data/reminder-Greek.json';
import remindersBelgum from '../../data/reminder-Belgum.json';

const remindersMap: Record<string, string[]> = {
  English: remindersEnglish,
  Spanish: remindersSpanish,
  French: remindersFrench,
  German: remindersGerman,
  Chinese: remindersChinese,
  'Chinese Traditional': remindersChineseTraditional,
  Japanese: remindersJapanese,
  Korean: remindersKorean,
  Italian: remindersItalian,
  Russian: remindersRussian,
  Luxembourgish: remindersLuxembourgish,
  Dutch: remindersDutch,
  Swedish: remindersSwedish,
  Finnish: remindersFinnish,
  Hindi: remindersHindi,
  Norwegian: remindersNorwegian,
  Thai: remindersThai,
  Portuguese: remindersPortuguese,
  Vietnamese: remindersVietnamese,
  Polish: remindersPolish,
  Danish: remindersDanish,
  Turkish: remindersTurkish,
  Greek: remindersGreek,
  Belgum: remindersBelgum,
};

const STORAGE_KEY = 'GeekTabs_daily_reminder_history';

function getFreshReminder(lang: string, excludeCurrent?: string): string {
  const dataset = remindersMap[lang] || remindersEnglish;
  if (!dataset || dataset.length === 0) {
    return '';
  }

  const today = new Date().toISOString().slice(0, 10);
  const storageKey = `${STORAGE_KEY}_${lang}`;
  let seenToday: string[] = [];

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.date === today && Array.isArray(parsed.seen)) {
        seenToday = parsed.seen;
      }
    }
  } catch {
    // ignore parse error
  }

  let candidates = dataset.filter((item) => !seenToday.includes(item) && item !== excludeCurrent);

  if (candidates.length === 0) {
    candidates = dataset.filter((item) => item !== excludeCurrent);
    if (candidates.length === 0) {
      candidates = dataset;
    }
    seenToday = [];
  }

  let picked: string;
  if (seenToday.length === 0 && !excludeCurrent) {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const dayIndex = ((dayOfYear % dataset.length) + dataset.length) % dataset.length;
    picked = dataset[dayIndex] || candidates[0];
  } else {
    picked = candidates[Math.floor(Math.random() * candidates.length)] || dataset[0];
  }

  try {
    const updatedSeen = [...seenToday, picked].slice(-dataset.length);
    localStorage.setItem(storageKey, JSON.stringify({ date: today, seen: updatedSeen }));
  } catch {
    // ignore storage error
  }

  return picked;
}

interface ReminderWidgetProps {
  language?: string;
}

export default function ReminderWidget({ language = 'English' }: ReminderWidgetProps) {
  const [reminder, setReminder] = useState<string>(() => getFreshReminder(language));
  const [loading, setLoading] = useState(false);

  const fetchReminder = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const next = getFreshReminder(language, reminder);
      setReminder(next);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setReminder(getFreshReminder(language));
  }, [language]);

  const widgetTitle =
    {
      English: 'Reminder',
      Spanish: 'Recordatorio',
      French: 'Rappel',
      German: 'Erinnerung',
      Chinese: '提醒',
      'Chinese Traditional': '提醒',
      Japanese: 'リマインダー',
      Korean: '리마인더',
      Italian: 'Promemoria',
      Russian: 'Напоминание',
      Luxembourgish: 'Erënnerung',
      Dutch: 'Herinnering',
      Swedish: 'Påminnelse',
      Finnish: 'Muistutus',
      Hindi: 'अनुस्मारक',
      Norwegian: 'Påminnelse',
      Thai: 'ข้อคิดเตือนใจ',
      Portuguese: 'Lembrete',
      Vietnamese: 'Nhắc nhở',
      Polish: 'Przypomnienie',
      Danish: 'Påmindelse',
      Turkish: 'Hatırlatma',
      Greek: 'Υπενθύμιση',
      Belgum: 'Herinnering',
    }[language] || 'Reminder';

  const reminderTooltips = {
    English: { refresh: 'Refresh reminder', next: 'Click to get new reminder' },
    Chinese: { refresh: '刷新提醒', next: '点击获取新提醒' },
    'Chinese Traditional': { refresh: '重新整理提醒', next: '點擊取得新提醒' },
    Spanish: { refresh: 'Actualizar recordatorio', next: 'Haz clic para ver otro recordatorio' },
    French: { refresh: 'Actualiser le rappel', next: 'Cliquez pour un nouveau rappel' },
    German: { refresh: 'Erinnerung aktualisieren', next: 'Für eine neue Erinnerung klicken' },
    Japanese: { refresh: 'リマインダーを更新', next: 'クリックして新しいリマインダーを表示' },
    Korean: { refresh: '리마인더 새로고침', next: '클릭하여 새 리마인더 보기' },
    Italian: { refresh: 'Aggiorna promemoria', next: 'Clicca per un nuovo promemoria' },
    Russian: { refresh: 'Обновить напоминание', next: 'Нажмите для нового напоминания' },
    Luxembourgish: { refresh: 'Erënnerung aktualiséieren', next: 'Klickt fir eng nei Erënnerung' },
    Dutch: { refresh: 'Herinnering vernieuwen', next: 'Klik voor een nieuwe herinnering' },
    Swedish: { refresh: 'Uppdatera påminnelse', next: 'Klicka för en ny påminnelse' },
    Finnish: { refresh: 'Päivitä muistutus', next: 'Napsauta saadaksesi uuden muistutuksen' },
    Hindi: { refresh: 'अनुस्मारक रीफ़्रेश करें', next: 'नया अनुस्मारक पाने के लिए क्लिक करें' },
    Norwegian: { refresh: 'Oppdater påminnelse', next: 'Klikk for å få en ny påminnelse' },
    Thai: { refresh: 'รีเฟรชข้อคิดเตือนใจ', next: 'คลิกเพื่อรับข้อคิดเตือนใจใหม่' },
    Portuguese: { refresh: 'Atualizar lembrete', next: 'Clique para obter um novo lembrete' },
    Vietnamese: { refresh: 'Làm mới nhắc nhở', next: 'Nhấp để xem nhắc nhở mới' },
    Polish: { refresh: 'Odśwież przypomnienie', next: 'Kliknij, aby zobaczyć nowe przypomnienie' },
    Danish: { refresh: 'Opdater påmindelse', next: 'Klik for at få en ny påmindelse' },
    Turkish: { refresh: 'Hatırlatmayı yenile', next: 'Yeni hatırlatma için tıklayın' },
    Greek: { refresh: 'Ανανέωση υπενθύμισης', next: 'Κάντε κλικ για νέα υπενθύμιση' },
    Belgum: { refresh: 'Herinnering vernieuwen', next: 'Klik voor een nieuwe herinnering' },
  }[language] || { refresh: 'Refresh reminder', next: 'Click to get new reminder' };

  return (
    <div className="weather-huawei-style daily-webcard rounded-[2rem] h-full flex flex-col justify-between relative overflow-hidden transition-colors group">
      {/* Top Header: Squircle icon + Title + Refresh Button with Regular Rose Red Background */}
      <div className="daily-title-rose daily-card-title-section w-full px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-2.5">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          <div className="daily-card-icon-badge w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white text-[#c8102e] flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105">
            <BellRing className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2.2} />
          </div>
          <h2 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug break-words">
            {widgetTitle}
          </h2>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fetchReminder();
          }}
          className="p-2.5 lg:p-2 min-w-[40px] min-h-[40px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-xl text-slate-500 hover:text-[#c8102e] dark:text-slate-300 dark:hover:text-red-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all shrink-0 cursor-pointer"
          title={reminderTooltips.refresh}
        >
          <RefreshCw
            size={14}
            className={loading ? 'animate-spin' : 'transition-transform group-hover:rotate-45'}
          />
        </button>
      </div>

      {/* Full Straight Line splitting title and contents from left to right */}
      <div className="daily-card-divider w-full" />

      {/* Content Area without inside frame */}
      <div
        onClick={fetchReminder}
        className="flex-1 flex flex-col justify-center px-4 sm:px-5 py-4 sm:py-5 cursor-pointer select-none"
        title={reminderTooltips.next}
      >
        <p className="daily-card-content-text text-sm sm:text-[15px] lg:text-base xl:text-[17px] font-normal leading-relaxed line-clamp-none sm:line-clamp-5 lg:line-clamp-5 select-text">
          {reminder}
        </p>
      </div>
    </div>
  );
}
