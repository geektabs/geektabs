import React, { useState, useEffect } from 'react';
import { BellRing, RefreshCw } from 'lucide-react';
import remindersEnglish from '../../data/daily-reminders-English.json';
import remindersSpanish from '../../data/daily-reminders-Spanish.json';
import remindersFrench from '../../data/daily-reminders-French.json';
import remindersGerman from '../../data/daily-reminders-German.json';
import remindersChinese from '../../data/daily-reminders-Chinese.json';
import remindersChineseTraditional from '../../data/daily-reminders-Chinese-Traditional.json';
import remindersJapanese from '../../data/daily-reminders-Japanese.json';
import remindersKorean from '../../data/daily-reminders-Korean.json';
import remindersItalian from '../../data/daily-reminders-Italian.json';
import remindersRussian from '../../data/daily-reminders-Russian.json';
import remindersLuxembourgish from '../../data/daily-reminders-Luxembourgish.json';
import remindersDutch from '../../data/daily-reminders-Dutch.json';
import remindersSwedish from '../../data/daily-reminders-Swedish.json';
import remindersFinnish from '../../data/daily-reminders-Finnish.json';
import remindersHindi from '../../data/daily-reminders-Hindi.json';
import remindersNorwegian from '../../data/daily-reminders-Norwegian.json';
import remindersThai from '../../data/daily-reminders-Thai.json';
import remindersPortuguese from '../../data/daily-reminders-Portuguese.json';
import remindersVietnamese from '../../data/daily-reminders-Vietnamese.json';
import remindersPolish from '../../data/daily-reminders-Polish.json';
import remindersDanish from '../../data/daily-reminders-Danish.json';
import remindersTurkish from '../../data/daily-reminders-Turkish.json';
import remindersGreek from '../../data/daily-reminders-Greek.json';

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
      English: 'Daily Reminder',
      Spanish: 'Recordatorio Diario',
      French: 'Rappel Quotidien',
      German: 'Tägliche Erinnerung',
      Chinese: '日常觉悟提醒',
      'Chinese Traditional': '日常覺察提醒',
      Japanese: '毎日のリマインダー',
      Korean: '오늘의 깨달음',
      Italian: 'Promemoria Quotidiano',
      Russian: 'Напоминание дня',
      Luxembourgish: 'Deeglech Erënnerung',
      Dutch: 'Dagelijkse Herinnering',
      Swedish: 'Daglig Påminnelse',
      Finnish: 'Päivän Muistutus',
      Hindi: 'दैनिक अनुस्मारक',
      Norwegian: 'Daglig Påminnelse',
      Thai: 'ข้อคิดเตือนใจประจำวัน',
      Portuguese: 'Lembrete Diário',
      Vietnamese: 'Nhắc Nhở Hằng Ngày',
      Polish: 'Codzienne Przypomnienie',
      Danish: 'Daglig Påmindelse',
      Turkish: 'Günlük Hatırlatma',
      Greek: 'Ημερήσια Υπενθύμιση',
    }[language] || 'Daily Reminder';

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
          title="Refresh reminder"
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
        title="Click to get new reminder"
      >
        <p className="daily-card-content-text text-sm sm:text-[15px] lg:text-base xl:text-[17px] font-normal leading-relaxed line-clamp-none sm:line-clamp-5 lg:line-clamp-5 select-text">
          {reminder}
        </p>
      </div>
    </div>
  );
}
