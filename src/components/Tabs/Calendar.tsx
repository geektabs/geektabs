import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, MapPin, Clock as ClockIcon, Bell, CalendarClock, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import ConfirmModal from '../ConfirmModal';

interface EventItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'event' | 'reminder';
}

const COUNTRIES = [
  { id: 'AUS', name: 'Australia', timezone: 'Australia/Sydney' },
  { id: 'CHN', name: 'China', timezone: 'Asia/Shanghai' },
  { id: 'FRA', name: 'France', timezone: 'Europe/Paris' },
  { id: 'ITA', name: 'Italy', timezone: 'Europe/Rome' },
  { id: 'JPN', name: 'Japan', timezone: 'Asia/Tokyo' },
  { id: 'KOR', name: 'Korea', timezone: 'Asia/Seoul' },
  { id: 'LUX', name: 'Luxembourg', timezone: 'Europe/Luxembourg' },
  { id: 'NZL', name: 'New Zealand', timezone: 'Pacific/Auckland' },
  { id: 'RUS', name: 'Russia', timezone: 'Europe/Moscow' },
  { id: 'SGP', name: 'Singapore', timezone: 'Asia/Singapore' },
  { id: 'ESP', name: 'Spain', timezone: 'Europe/Madrid' },
  { id: 'CHE', name: 'Switzerland', timezone: 'Europe/Zurich' },
  { id: 'UK', name: 'United Kingdom', timezone: 'Europe/London' },
  { id: 'USA', name: 'United States', timezone: 'America/New_York' },
];

const HOLIDAYS: Record<string, Record<string, string>> = {
  'USA': { '01-01': "New Year's Day", '07-04': 'Independence Day', '10-31': 'Halloween', '11-28': 'Thanksgiving', '12-25': 'Christmas' },
  'CHN': { '01-01': "New Year's Day", '05-01': 'Labor Day', '10-01': 'National Day' },
  'UK':  { '01-01': "New Year's Day", '12-25': 'Christmas', '12-26': 'Boxing Day' },
  'JPN': { '01-01': "New Year's Day", '05-03': 'Constitution Memorial Day', '05-05': "Children's Day" },
  'FRA': { '01-01': "New Year's Day", '07-14': 'Bastille Day', '12-25': 'Christmas' },
  'LUX': { '01-01': "New Year's Day", '06-23': 'National Day', '12-25': 'Christmas' },
  'ESP': { '01-01': "New Year's Day", '10-12': 'National Day', '12-25': 'Christmas' },
  'ITA': { '01-01': "New Year's Day", '06-02': 'Republic Day', '12-25': 'Christmas' },
  'KOR': { '01-01': "New Year's Day", '08-15': 'Liberation Day', '10-03': 'National Foundation Day' },
  'SGP': { '01-01': "New Year's Day", '08-09': 'National Day', '12-25': 'Christmas' },
  'CHE': { '01-01': "New Year's Day", '08-01': 'Swiss National Day', '12-25': 'Christmas' },
  'NZL': { '01-01': "New Year's Day", '02-06': 'Waitangi Day', '04-25': 'Anzac Day', '12-25': 'Christmas' },
  'AUS': { '01-01': "New Year's Day", '01-26': 'Australia Day', '04-25': 'Anzac Day', '12-25': 'Christmas' },
  'RUS': { '01-01': "New Year's Day", '05-09': 'Victory Day', '06-12': 'Russia Day' },
};

const COUNTRY_NAMES: Record<string, Record<string, string>> = {
  English: {
    AUS: 'Australia',
    CHN: 'China',
    FRA: 'France',
    ITA: 'Italy',
    JPN: 'Japan',
    KOR: 'Korea',
    LUX: 'Luxembourg',
    NZL: 'New Zealand',
    RUS: 'Russia',
    SGP: 'Singapore',
    ESP: 'Spain',
    CHE: 'Switzerland',
    UK: 'United Kingdom',
    USA: 'United States',
  },
  Korean: {
    AUS: '호주',
    CHN: '중국',
    FRA: '프랑스',
    ITA: '이탈리아',
    JPN: '일본',
    KOR: '대한민국',
    LUX: '룩셈부르크',
    NZL: '뉴질랜드',
    RUS: '러시아',
    SGP: '싱가포르',
    ESP: '스페인',
    CHE: '스위스',
    UK: '영국',
    USA: '미국',
  },
  Spanish: {
    AUS: 'Australia',
    CHN: 'China',
    FRA: 'Francia',
    ITA: 'Italia',
    JPN: 'Japón',
    KOR: 'Corea',
    LUX: 'Luxemburgo',
    NZL: 'Nueva Zelanda',
    RUS: 'Rusia',
    SGP: 'Singapur',
    ESP: 'España',
    CHE: 'Suiza',
    UK: 'Reino Unido',
    USA: 'Estados Unidos',
  },
  French: {
    AUS: 'Australie',
    CHN: 'Chine',
    FRA: 'France',
    ITA: 'Italie',
    JPN: 'Japon',
    KOR: 'Corée',
    LUX: 'Luxembourg',
    NZL: 'Nouvelle-Zélande',
    RUS: 'Russie',
    SGP: 'Singapour',
    ESP: 'Espagne',
    CHE: 'Suisse',
    UK: 'Royaume-Uni',
    USA: 'États-Unis',
  },
  German: {
    AUS: 'Australien',
    CHN: 'China',
    FRA: 'Frankreich',
    ITA: 'Italien',
    JPN: 'Japan',
    KOR: 'Korea',
    LUX: 'Luxemburg',
    NZL: 'Neuseeland',
    RUS: 'Russland',
    SGP: 'Singapur',
    ESP: 'Spanien',
    CHE: 'Schweiz',
    UK: 'Vereinigtes Königreich',
    USA: 'Vereinigte Staaten',
  },
  Chinese: {
    AUS: '澳大利亚',
    CHN: '中国',
    FRA: '法国',
    ITA: '意大利',
    JPN: '日本',
    KOR: '韩国',
    LUX: '卢堡',
    NZL: '新西兰',
    RUS: '俄罗斯',
    SGP: '新加坡',
    ESP: '西班牙',
    CHE: '瑞士',
    UK: '英国',
    USA: '美国',
  },
  Japanese: {
    AUS: 'オーストラリア',
    CHN: '中国',
    FRA: 'フランス',
    ITA: 'イタリア',
    JPN: '日本',
    KOR: '韓国',
    LUX: 'ルクセンブルク',
    NZL: 'ニュージーランド',
    RUS: 'ロシア',
    SGP: 'シンガポール',
    ESP: 'スペイン',
    CHE: 'スイス',
    UK: 'イギリス',
    USA: 'アメリカ',
  },
  Italian: {
    AUS: 'Australia',
    CHN: 'Cina',
    FRA: 'Francia',
    ITA: 'Italia',
    JPN: 'Giappone',
    KOR: 'Corea',
    LUX: 'Lussemburgo',
    NZL: 'Nuova Zelanda',
    RUS: 'Russia',
    SGP: 'Singapore',
    ESP: 'Spagna',
    CHE: 'Svizzera',
    UK: 'Regno Unito',
    USA: 'Stati Uniti',
  },
  Russian: {
    AUS: 'Австралия',
    CHN: 'Китай',
    FRA: 'Франция',
    ITA: 'Италия',
    JPN: 'Япония',
    KOR: 'Корея',
    LUX: 'Люксембург',
    NZL: 'Новая Зеландия',
    RUS: 'Россия',
    SGP: 'Сингапур',
    ESP: 'Испания',
    CHE: 'Швейцария',
    UK: 'Великобритания',
    USA: 'США',
  },
  Luxembourgish: {
    AUS: 'Australien',
    CHN: 'China',
    FRA: 'Frankräich',
    ITA: 'Italien',
    JPN: 'Japan',
    KOR: 'Korea',
    LUX: 'Lëtzebuerg',
    NZL: 'Neiséiland',
    RUS: 'Russland',
    SGP: 'Singapur',
    ESP: 'Spuenien',
    CHE: 'Schwäiz',
    UK: 'Groussbritannien',
    USA: 'USA',
  },
};

const formatTimeDifference = (c1Name: string, c2Name: string, diffHours: number, lang: string) => {
  if (Math.abs(diffHours) < 0.1) {
    const sameMap: Record<string, string> = {
      English: 'Same time zone',
      Chinese: '相同时区',
      Korean: '동일한 시간대',
      Spanish: 'Misma zona horaria',
      French: 'Même fuseau horaire',
      German: 'Gleiche Zeitzone',
      Japanese: '同じタイムゾーン',
      Italian: 'Stesso fuso orario',
      Russian: 'Тот же часовой пояс',
      Luxembourgish: 'Saddselwecht Zäitzon',
    };
    return sameMap[lang] || sameMap.English;
  }
  const absDiff = Math.abs(diffHours);
  const formatted = Math.abs(absDiff % 1) > 0.01 ? absDiff.toFixed(1) : Math.round(absDiff).toString();

  switch (lang) {
    case 'Chinese':
      return diffHours > 0 
        ? `${c1Name} 比 ${c2Name} 快 ${formatted} 小时`
        : `${c1Name} 比 ${c2Name} 慢 ${formatted} 小时`;
    case 'Korean':
      return diffHours > 0 
        ? `${c1Name}이(가) ${c2Name}보다 ${formatted}시간 빠릅니다`
        : `${c1Name}이(가) ${c2Name}보다 ${formatted}시간 느립니다`;
    case 'Japanese':
      return diffHours > 0 
        ? `${c1Name} は ${c2Name} より ${formatted} 時間進んでいます`
        : `${c1Name} は ${c2Name} より ${formatted} 時間遅れています`;
    case 'Spanish':
      return diffHours > 0 
        ? `${c1Name} está ${formatted} h por delante de ${c2Name}`
        : `${c1Name} está ${formatted} h por detrás de ${c2Name}`;
    case 'French':
      return diffHours > 0 
        ? `${c1Name} a ${formatted} h d'avance sur ${c2Name}`
        : `${c1Name} a ${formatted} h de retard sur ${c2Name}`;
    case 'German':
      return diffHours > 0 
        ? `${c1Name} ist ${formatted} Std. vor ${c2Name}`
        : `${c1Name} ist ${formatted} Std. hinter ${c2Name}`;
    case 'Italian':
      return diffHours > 0 
        ? `${c1Name} è ${formatted} ore avanti rispetto a ${c2Name}`
        : `${c1Name} è ${formatted} ore indietro rispetto a ${c2Name}`;
    case 'Russian':
      return diffHours > 0 
        ? `${c1Name} на ${formatted} ч. впереди ${c2Name}`
        : `${c1Name} на ${formatted} ч. позади ${c2Name}`;
    case 'Luxembourgish':
      return diffHours > 0 
        ? `${c1Name} ass ${formatted} Std. virun ${c2Name}`
        : `${c1Name} ass ${formatted} Std. hannert ${c2Name}`;
    default:
      return diffHours > 0 
        ? `${c1Name} is ${formatted} hr ahead of ${c2Name}`
        : `${c1Name} is ${formatted} hr behind ${c2Name}`;
  }
};

export interface CalendarProps {
  language?: string;
}

const WEEKDAYS: Record<string, string[]> = {
  English: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  Spanish: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  French: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  German: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  Chinese: ['日', '一', '二', '三', '四', '五', '六'],
  Japanese: ['日', '月', '火', '水', '木', '金', '土'],
  Korean: ['일', '월', '화', '수', '목', '금', '토'],
  Italian: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
  Russian: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  Luxembourgish: ['Son', 'Méi', 'Dës', 'Mët', 'Don', 'Fre', 'Sam']
};

const CAL_T: Record<string, Record<string, string>> = {
  English: {
    worldDates: 'World Dates',
    events: 'Events & Reminders',
    noEvents: 'No Events',
    addEvent: 'Add to Calendar',
    event: 'Event',
    reminder: 'Reminder',
    title: 'Title',
    cancel: 'Cancel',
    save: 'Save',
    deleteEvent: 'Delete Event',
    deleteConfirm: 'Are you sure you want to delete this event?',
  },
  Korean: {
    worldDates: '세계 시간',
    events: '일정 및 리마인더',
    noEvents: '일정 없음',
    addEvent: '캘린더에 추가',
    event: '일정',
    reminder: '리마인더',
    title: '제목',
    cancel: '취소',
    save: '저장',
    deleteEvent: '일정 삭제',
    deleteConfirm: '이 일정을 삭제하시겠습니까?',
  },
  Spanish: {
    worldDates: 'Fechas mundiales',
    events: 'Eventos y recordatorios',
    noEvents: 'Sin eventos',
    addEvent: 'Añadir al calendario',
    event: 'Evento',
    reminder: 'Recordatorio',
    title: 'Título',
    cancel: 'Cancelar',
    save: 'Guardar',
    deleteEvent: 'Eliminar evento',
    deleteConfirm: '¿Estás seguro de que deseas eliminar este evento?',
  },
  French: {
    worldDates: 'Heures mondiales',
    events: 'Événements & Rappels',
    noEvents: 'Aucun événement',
    addEvent: 'Ajouter au calendrier',
    event: 'Événement',
    reminder: 'Rappel',
    title: 'Titre',
    cancel: 'Annuler',
    save: 'Enregistrer',
    deleteEvent: 'Supprimer l\'événement',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet événement ?',
  },
  German: {
    worldDates: 'Weltzeiten',
    events: 'Termine & Erinnerungen',
    noEvents: 'Keine Termine',
    addEvent: 'Zum Kalender hinzufügen',
    event: 'Termin',
    reminder: 'Erinnerung',
    title: 'Titel',
    cancel: 'Abbrechen',
    save: 'Speichern',
    deleteEvent: 'Termin löschen',
    deleteConfirm: 'Sind Sie sicher, dass Sie diesen Termin löschen möchten?',
  },
  Chinese: {
    worldDates: '世界时间',
    events: '日程与提醒',
    noEvents: '暂无日程',
    addEvent: '添加到日历',
    event: '事件',
    reminder: '提醒',
    title: '标题',
    cancel: '取消',
    save: '保存',
    deleteEvent: '删除日程',
    deleteConfirm: '您确定要删除此日程吗？',
  },
  Japanese: {
    worldDates: '世界時計',
    events: '予定とリマインダー',
    noEvents: '予定なし',
    addEvent: 'カレンダーに追加',
    event: '予定',
    reminder: 'リマイン더',
    title: 'タイトル',
    cancel: 'キャンセル',
    save: '保存',
    deleteEvent: '予定の削除',
    deleteConfirm: 'この予定を削除してもよろしいですか？',
  },
  Italian: {
    worldDates: 'Fusi Orari',
    events: 'Eventi e Promemoria',
    noEvents: 'Nessun Evento',
    addEvent: 'Aggiungi al Calendario',
    event: 'Evento',
    reminder: 'Promemoria',
    title: 'Titolo',
    cancel: 'Annulla',
    save: 'Salva',
    deleteEvent: 'Elimina Evento',
    deleteConfirm: 'Sei sicuro di voler eliminare questo evento?',
  },
  Russian: {
    worldDates: 'Мировое Время',
    events: 'События и Напоминания',
    noEvents: 'Нет Событий',
    addEvent: 'Добавить в календарь',
    event: 'Событие',
    reminder: 'Напоминание',
    title: 'Название',
    cancel: 'Отмена',
    save: 'Сохранить',
    deleteEvent: 'Удалить событие',
    deleteConfirm: 'Вы уверены, что хотите удалить это событие?',
  },
  Luxembourgish: {
    worldDates: 'Weltzäiten',
    events: 'Evenementer & Erënnerungen',
    noEvents: 'Keng Evenementer',
    addEvent: 'An de Kalenner derbäisetzen',
    event: 'Evenement',
    reminder: 'Erënnerung',
    title: 'Titel',
    cancel: 'Ofbriechen',
    save: 'Späicheren',
    deleteEvent: 'Evenement läschen',
    deleteConfirm: 'Sidd Dir sécher, datt Dir dëst Evenement läschen wëllt?',
  }
};

const LOCALES: Record<string, string> = {
  English: 'en-US',
  Spanish: 'es-ES',
  French: 'fr-FR',
  German: 'de-DE',
  Chinese: 'zh-CN',
  Japanese: 'ja-JP',
  Korean: 'ko-KR',
};

export default function Calendar({ language = 'English' }: CalendarProps) {
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(now);
  
  const [events, setEvents] = useLocalStorage<EventItem[]>('GeekTabs-events', []);
  const [country1, setCountry1] = useLocalStorage('GeekTabs-cal-country1', 'ITA');
  const [country2, setCountry2] = useLocalStorage('GeekTabs-cal-country2', 'CHN');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', type: 'event' as 'event'|'reminder' });
  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState<string | null>(null);

  const locale = LOCALES[language] || 'en-US';
  const monthName = currentDate.toLocaleString(locale, { month: 'long' });
  const year = currentDate.getFullYear();

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDay }, (_, i) => null);

  const getDayString = (day: number) => {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getMMDD = (day: number) => {
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${m}-${d}`;
  };

  const isToday = (day: number) => {
    return day === now.getDate() && currentDate.getMonth() === now.getMonth() && currentDate.getFullYear() === now.getFullYear();
  };

  const isSelected = (day: number) => {
    return day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear();
  };

  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  
  const selectedEvents = events.filter(e => e.date === selectedDateStr);

  const getDayHolidays = (day: number) => {
    const mmdd = getMMDD(day);
    const dayHolidays: string[] = [];
    if (HOLIDAYS[country1] && HOLIDAYS[country1][mmdd]) dayHolidays.push(`${country1}: ${HOLIDAYS[country1][mmdd]}`);
    if (HOLIDAYS[country2] && HOLIDAYS[country2][mmdd]) dayHolidays.push(`${country2}: ${HOLIDAYS[country2][mmdd]}`);
    return dayHolidays;
  };

  const hasEvents = (day: number) => events.some(e => e.date === getDayString(day));

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;
    setEvents([...events, {
      id: `evt-${Date.now()}`,
      title: newEvent.title,
      date: selectedDateStr,
      time: newEvent.time,
      type: newEvent.type
    }]);
    setShowAddModal(false);
    setNewEvent({ title: '', time: '', type: 'event' });
  };

  const WorldClock = ({ countryId }: { countryId: string }) => {
    const country = COUNTRIES.find(c => c.id === countryId);
    if (!country) return null;
    let weekdayStr = '';
    let timeStr = '';
    try {
      weekdayStr = new Intl.DateTimeFormat(locale, {
        timeZone: country.timezone,
        weekday: 'short',
      }).format(now);
      timeStr = new Intl.DateTimeFormat(locale, { 
        timeZone: country.timezone, 
        hour: '2-digit', 
        minute: '2-digit',
      }).format(now);
    } catch(e) { 
      weekdayStr = '';
      timeStr = '--:--'; 
    }

    const countryName = COUNTRY_NAMES[language]?.[country.id] || country.name;

    return (
      <div className="world-clock-card flex flex-col p-3 sm:p-3.5 bg-black/5 dark:bg-white/10 rounded-2xl border border-black/10 dark:border-white/10 transition-all">
        {/* Country Name at the top */}
        <div className="flex items-center gap-2 mb-1.5">
          <Globe size={15} className="text-black dark:text-white opacity-70 shrink-0" />
          <span className="font-bold text-xs sm:text-sm text-black dark:text-white truncate leading-tight">{countryName}</span>
        </div>
        {/* Day and Time underneath country name */}
        <div className="flex items-baseline gap-2 pl-6">
          {weekdayStr && (
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-black/60 dark:text-white/60">
              {weekdayStr}
            </span>
          )}
          <span className="font-mono text-sm sm:text-base font-bold text-black dark:text-white tracking-tight">
            {timeStr}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto w-full px-4 sm:px-6">
      
      {/* Calendar Section (Full Calendar) */}
      <div className="w-full lg:flex-[1.6] xl:flex-[2] GeekTabs-card webcard-light-grey-bg rounded-3xl sm:rounded-[3rem] p-5 sm:p-8 md:p-10">
        <div className="flex items-center justify-between mb-4 md:mb-8 gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="calendar-header-logo-container w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/15 rounded-2xl flex items-center justify-center border border-blue-500/30 shrink-0">
              <CalendarIcon className="calendar-header-logo-icon text-[#6143f7] stroke-[#6143f7] fill-[#6143f7]/10" size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight leading-tight">{monthName}</h2>
              <p className="calendar-year-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-black dark:text-white tracking-tight mt-0.5 leading-none">{year}</p>
            </div>
          </div>

          {/* Desktop / Tablet Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="calendar-nav-arrow p-3 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 active:scale-95 rounded-2xl transition-all border border-black/10 dark:border-white/15 text-[#6143f7] dark:text-[#6143f7] flex items-center justify-center cursor-pointer"
              title="Previous month"
              aria-label="Previous Month"
            >
              <ChevronLeft size={20} className="text-[#6143f7] stroke-[#6143f7]" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="calendar-nav-arrow p-3 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 active:scale-95 rounded-2xl transition-all border border-black/10 dark:border-white/15 text-[#6143f7] dark:text-[#6143f7] flex items-center justify-center cursor-pointer"
              title="Next month"
              aria-label="Next Month"
            >
              <ChevronRight size={20} className="text-[#6143f7] stroke-[#6143f7]" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Arrows: positioned under month and year line */}
        <div className="flex sm:hidden items-center justify-between mb-5 px-1">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className="calendar-nav-arrow p-2.5 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 active:scale-95 rounded-2xl transition-all border border-black/10 dark:border-white/15 text-[#6143f7] dark:text-[#6143f7] flex items-center justify-center cursor-pointer"
            title="Previous month"
            aria-label="Previous Month"
          >
            <ChevronLeft size={20} className="text-[#6143f7] stroke-[#6143f7]" />
          </button>
          <div className="h-px bg-black/10 dark:bg-white/15 flex-1 mx-4" />
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className="calendar-nav-arrow p-2.5 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 active:scale-95 rounded-2xl transition-all border border-black/10 dark:border-white/15 text-[#6143f7] dark:text-[#6143f7] flex items-center justify-center cursor-pointer"
            title="Next month"
            aria-label="Next Month"
          >
            <ChevronRight size={20} className="text-[#6143f7] stroke-[#6143f7]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3 md:gap-4">
          {(WEEKDAYS[language] || WEEKDAYS['English']).map(day => (
            <div key={day} className="text-center calendar-weekday-header text-black dark:text-white font-bold text-[11px] md:text-xs uppercase tracking-widest pb-3 sm:pb-4">
              {day}
            </div>
          ))}

          {padding.map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}

          {days.map(day => {
            const hols = getDayHolidays(day);
            const evt = hasEvents(day);
            
            return (
              <motion.div
                key={day}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                className={`calendar-day-btn relative aspect-square flex flex-col items-center justify-center rounded-2xl text-sm sm:text-base md:text-xl font-medium transition-all group cursor-pointer ${
                  isSelected(day)
                    ? 'bg-indigo-500/25 dark:bg-indigo-500/35 text-black dark:text-white border-2 border-indigo-500 font-bold'
                    : isToday(day)
                      ? 'bg-black/5 dark:bg-white/15 border-2 border-indigo-400 text-black dark:text-white font-semibold'
                      : 'text-black dark:text-white bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 border border-black/5 dark:border-white/15'
                }`}
              >
                <span className="text-black dark:text-white font-semibold">{day}</span>
                
                <div className="absolute bottom-1.5 md:bottom-2 left-0 right-0 flex justify-center gap-1">
                  {hols.length > 0 && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected(day) ? 'bg-rose-500' : 'bg-rose-500'}`} title={hols.join('\n')} />
                  )}
                  {evt && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected(day) ? 'bg-indigo-600' : 'bg-indigo-500'}`} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* World Dates & Events Column:
          - Mobile (default): stacked in column
          - Tablet (md to lg): placed neatly under the full calendar in a 2-column grid, matching heights and aligned
          - Desktop (lg+): right sidebar column */}
      <div className="w-full lg:w-80 xl:w-96 flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-col gap-6 items-stretch">
        
        {/* World Dates Widget */}
        <div className="GeekTabs-card webcard-light-grey-bg rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <Globe size={18} className="world-dates-logo text-[#6143f7] dark:text-[#6143f7] shrink-0 opacity-90" strokeWidth={2} />
            <h3 className="world-dates-title text-sm font-bold uppercase tracking-widest text-[#6143f7] dark:text-[#6143f7]">
              {(CAL_T[language] || CAL_T['English']).worldDates}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <select 
              value={country1} 
              onChange={e => setCountry1(e.target.value)}
              className="world-dates-select bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 rounded-xl p-2.5 text-xs font-bold text-black dark:text-white outline-none cursor-pointer"
            >
              {COUNTRIES.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-[#1e2029] text-black dark:text-white">{COUNTRY_NAMES[language]?.[c.id] || c.name}</option>)}
            </select>
            <select 
              value={country2} 
              onChange={e => setCountry2(e.target.value)}
              className="world-dates-select bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 rounded-xl p-2.5 text-xs font-bold text-black dark:text-white outline-none cursor-pointer"
            >
              {COUNTRIES.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-[#1e2029] text-black dark:text-white">{COUNTRY_NAMES[language]?.[c.id] || c.name}</option>)}
            </select>
          </div>

          <div className="space-y-3 mt-1 flex-1 flex flex-col justify-between">
            <div className="space-y-2.5">
              <WorldClock countryId={country1} />
              <WorldClock countryId={country2} />
            </div>

            {country1 && country2 && country1 !== country2 && (
              <div className="world-dates-diff-pill flex items-center justify-center p-3 bg-black/5 dark:bg-white/10 rounded-2xl border border-black/10 dark:border-white/10 mt-auto">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-black dark:text-white text-center leading-relaxed">
                  {(() => {
                    const c1 = COUNTRIES.find(c => c.id === country1);
                    const c2 = COUNTRIES.find(c => c.id === country2);
                    if (!c1 || !c2) return null;
                    try {
                      const now = new Date();
                      
                      const getOffsetHours = (tz: string) => {
                        const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" }).formatToParts(now);
                        const tzName = parts.find(p => p.type === "timeZoneName")?.value || "";
                        if (!tzName.includes("+") && !tzName.includes("-")) return 0;
                        const sign = tzName.includes("-") ? -1 : 1;
                        const timePart = tzName.split(/[+-]/)[1];
                        const [h, m] = timePart.split(":");
                        return sign * (parseInt(h, 10) + (m ? parseInt(m, 10) / 60 : 0));
                      };

                      const diffHours = getOffsetHours(c1.timezone) - getOffsetHours(c2.timezone);
                      const c1Name = COUNTRY_NAMES[language]?.[c1.id] || c1.name;
                      const c2Name = COUNTRY_NAMES[language]?.[c2.id] || c2.name;
                      return formatTimeDifference(c1Name, c2Name, diffHours, language);
                    } catch { return null; }
                  })()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Selected Date Events & Reminders */}
        <div className="flex-1 GeekTabs-card webcard-light-grey-bg rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-6 flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-black dark:text-white font-bold text-base">{selectedDate.getDate()}</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-black dark:text-white truncate">
                  {(CAL_T[language] || CAL_T['English']).events}
                </h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black dark:text-white opacity-75 truncate">
                  {selectedDate.toLocaleString(locale, { weekday: 'long' })}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center hover:scale-105 transition-all shrink-0 cursor-pointer shadow-sm"
              title="Add event or reminder"
              aria-label="Add Event"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[320px]">
             {/* Show holidays for selected date */}
             {(() => {
               const dayHols = getDayHolidays(selectedDate.getDate());
               return dayHols.map((h, i) => (
                 <div key={`hol-${i}`} className="flex items-center gap-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-black dark:text-white">
                   <MapPin size={16} className="text-rose-500 shrink-0" />
                   <span className="text-xs font-bold text-black dark:text-white">{h}</span>
                 </div>
               ));
             })()}

             {selectedEvents.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-40 opacity-70">
                 <CalendarClock size={44} className="calendar-empty-icon text-[#6143f7] stroke-[#6143f7] fill-[#6143f7]/10 mb-3" strokeWidth={1} />
                 <p className="text-[10px] uppercase tracking-widest font-bold text-black dark:text-white text-center">{(CAL_T[language] || CAL_T['English']).noEvents}</p>
               </div>
             ) : (
               selectedEvents.map(evt => (
                 <div key={evt.id} className="flex items-center gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 group">
                   {evt.type === 'event' ? <CalendarIcon size={16} className="text-rose-500 shrink-0" /> : <Bell size={16} className="text-amber-500 animate-pulse shrink-0" />}
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-bold text-black dark:text-white truncate">{evt.title}</p>
                     {evt.time && <p className="text-[10px] text-black dark:text-white opacity-75 font-bold mt-0.5">{evt.time}</p>}
                   </div>
                   <button onClick={() => setConfirmDeleteEvent(evt.id)} className="opacity-0 group-hover:opacity-100 text-black dark:text-white hover:text-rose-500 transition-all p-1 cursor-pointer">
                     <Plus size={16} className="rotate-45" />
                   </button>
                 </div>
               ))
             )}
          </div>
        </div>

      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 GeekTabs-card p-8 rounded-[3rem] w-full max-w-sm shadow-2xl"
            >
              <h2 className="text-2xl font-bold word-color mb-1">{(CAL_T[language] || CAL_T['English']).addEvent}</h2>
              <p className="text-[10px] uppercase font-bold tracking-widest word-color opacity-40 mb-6">{selectedDateStr}</p>
              
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-2xl">
                  <button type="button" onClick={() => setNewEvent({...newEvent, type: 'event'})} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${newEvent.type === 'event' ? 'bg-white dark:bg-zinc-800 word-color shadow-sm' : 'word-color opacity-50'}`}>{(CAL_T[language] || CAL_T['English']).event}</button>
                  <button type="button" onClick={() => setNewEvent({...newEvent, type: 'reminder'})} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${newEvent.type === 'reminder' ? 'bg-white dark:bg-zinc-800 word-color shadow-sm' : 'word-color opacity-50'}`}>{(CAL_T[language] || CAL_T['English']).reminder}</button>
                </div>

                 <div>
                  <input
                    autoFocus
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder={(CAL_T[language] || CAL_T['English']).title}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm word-color focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                
                <div>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm word-color focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-black/5 dark:bg-white/5 word-color font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors">{(CAL_T[language] || CAL_T['English']).cancel}</button>
                  <button type="submit" className="flex-1 py-4 GeekTabs-btn font-bold text-xs uppercase tracking-widest rounded-2xl">{(CAL_T[language] || CAL_T['English']).save}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!confirmDeleteEvent}
        title={(CAL_T[language] || CAL_T['English']).deleteEvent}
        message={(CAL_T[language] || CAL_T['English']).deleteConfirm}
        onConfirm={() => {
          if (confirmDeleteEvent) {
             setEvents(events.filter(e => e.id !== confirmDeleteEvent));
             setConfirmDeleteEvent(null);
          }
        }}
        onCancel={() => setConfirmDeleteEvent(null)}
      />

    </div>
  );
}

