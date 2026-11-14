import React, { useState, useEffect } from 'react';
import { BellRing, RefreshCw } from 'lucide-react';
import dailyReminders from '../../data/daily-reminders.json';

const STORAGE_KEY = 'GeekTabs_daily_reminder_history';

function getFreshReminder(excludeCurrent?: string): string {
  const dataset = dailyReminders;
  if (!dataset || dataset.length === 0) {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, seen: updatedSeen }));
  } catch {
    // ignore storage error
  }

  return picked;
}

interface ReminderWidgetProps {
  language?: string;
}

export default function ReminderWidget({ language = 'English' }: ReminderWidgetProps) {
  const [reminder, setReminder] = useState<string>(() => getFreshReminder());
  const [loading, setLoading] = useState(false);

  const fetchReminder = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const next = getFreshReminder(reminder);
      setReminder(next);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setReminder(getFreshReminder());
  }, [language]);

  const widgetTitle =
    {
      English: 'Daily Reminder',
      Spanish: 'Recordatorio Diario',
      French: 'Rappel Quotidien',
      German: 'Tägliche Erinnerung',
      Chinese: '日常觉悟提醒',
      Japanese: '毎日のリマインダー',
      Korean: '오늘의 깨달음',
      Italian: 'Promemoria Quotidiano',
      Russian: 'Напоминание дня',
      Luxembourgish: 'Deeglech Erënnerung',
    }[language] || 'Daily Reminder';

  return (
    <div className="weather-huawei-style daily-webcard rounded-[2rem] h-full flex flex-col justify-between relative overflow-hidden transition-all group hover:-translate-y-0.5">
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
          className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-[#c8102e] dark:text-slate-300 dark:hover:text-red-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all shrink-0 cursor-pointer"
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
        <p className="daily-card-content-text text-xs sm:text-[13px] md:text-sm lg:text-base xl:text-[17px] font-normal leading-relaxed line-clamp-4 lg:line-clamp-5 select-text">
          {reminder}
        </p>
      </div>
    </div>
  );
}
