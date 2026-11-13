import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, MapPin, Bell, CalendarClock, Globe, LocateFixed } from 'lucide-react';
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

const formatMMDD = (date: Date) => {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}-${d}`;
};

const addDaysToDate = (date: Date, days: number) => {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  return copy;
};

// Anonymous Gregorian Easter algorithm (accurate for all Gregorian years)
const getEasterSunday = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=March, 4=April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

// weekday: 0=Sun, 1=Mon, ..., 6=Sat; month1: 1..12; nth: 1..5
const nthWeekdayOfMonth = (year: number, month1: number, weekday: number, nth: number): string => {
  const firstDay = new Date(year, month1 - 1, 1).getDay();
  const offset = (weekday - firstDay + 7) % 7;
  const day = 1 + offset + (nth - 1) * 7;
  return formatMMDD(new Date(year, month1 - 1, day));
};

const lastWeekdayOfMonth = (year: number, month1: number, weekday: number): string => {
  const lastDate = new Date(year, month1, 0);
  const offset = (lastDate.getDay() - weekday + 7) % 7;
  return formatMMDD(new Date(year, month1 - 1, lastDate.getDate() - offset));
};

// Nearest weekday for US federal observed holidays (Sat -> Fri, Sun -> Mon)
const getUSObservedDate = (year: number, month1: number, day: number): string | null => {
  const d = new Date(year, month1 - 1, day);
  if (d.getDay() === 6) return formatMMDD(addDaysToDate(d, -1));
  if (d.getDay() === 0) return formatMMDD(addDaysToDate(d, 1));
  return null;
};

// Official lunar / solar-term holiday dates by year (2025–2028)
const CHN_LUNAR_HOLIDAYS: Record<number, Record<string, string>> = {
  2025: { '01-29': 'Chinese New Year', '04-04': 'Qingming Festival', '05-31': 'Dragon Boat Festival', '10-06': 'Mid-Autumn Festival' },
  2026: { '02-17': 'Chinese New Year', '04-05': 'Qingming Festival', '06-19': 'Dragon Boat Festival', '09-25': 'Mid-Autumn Festival' },
  2027: { '02-06': 'Chinese New Year', '04-05': 'Qingming Festival', '06-09': 'Dragon Boat Festival', '09-15': 'Mid-Autumn Festival' },
  2028: { '01-26': 'Chinese New Year', '04-04': 'Qingming Festival', '05-28': 'Dragon Boat Festival', '10-03': 'Mid-Autumn Festival' },
};

const KOR_LUNAR_HOLIDAYS: Record<number, Record<string, string>> = {
  2025: {
    '01-28': 'Seollal Holiday',
    '01-29': 'Seollal (Lunar New Year)',
    '01-30': 'Seollal Holiday',
    '05-05': "Children's Day / Buddha's Birthday",
    '10-05': 'Chuseok Holiday',
    '10-06': 'Chuseok',
    '10-07': 'Chuseok Holiday',
  },
  2026: {
    '02-16': 'Seollal Holiday',
    '02-17': 'Seollal (Lunar New Year)',
    '02-18': 'Seollal Holiday',
    '05-24': "Buddha's Birthday",
    '05-25': "Buddha's Birthday (Observed)",
    '09-24': 'Chuseok Holiday',
    '09-25': 'Chuseok',
    '09-26': 'Chuseok Holiday',
  },
  2027: {
    '02-06': 'Seollal Holiday',
    '02-07': 'Seollal (Lunar New Year)',
    '02-08': 'Seollal Holiday',
    '05-13': "Buddha's Birthday",
    '09-14': 'Chuseok Holiday',
    '09-15': 'Chuseok',
    '09-16': 'Chuseok Holiday',
  },
  2028: {
    '01-25': 'Seollal Holiday',
    '01-26': 'Seollal (Lunar New Year)',
    '01-27': 'Seollal Holiday',
    '05-02': "Buddha's Birthday",
    '10-02': 'Chuseok Holiday',
    '10-03': 'Chuseok',
    '10-04': 'Chuseok Holiday',
  },
};

const SGP_LUNAR_HOLIDAYS: Record<number, Record<string, string>> = {
  2025: {
    '01-29': 'Chinese New Year',
    '01-30': 'Chinese New Year (Day 2)',
    '03-31': 'Hari Raya Puasa',
    '05-12': 'Vesak Day',
    '06-07': 'Hari Raya Haji',
    '10-20': 'Deepavali',
  },
  2026: {
    '02-17': 'Chinese New Year',
    '02-18': 'Chinese New Year (Day 2)',
    '03-21': 'Hari Raya Puasa',
    '05-27': 'Hari Raya Haji',
    '05-31': 'Vesak Day',
    '06-01': 'Vesak Day (Observed)',
    '11-08': 'Deepavali',
    '11-09': 'Deepavali (Observed)',
  },
  2027: {
    '02-06': 'Chinese New Year',
    '02-07': 'Chinese New Year (Day 2)',
    '02-08': 'Chinese New Year (Observed)',
    '03-10': 'Hari Raya Puasa',
    '05-17': 'Hari Raya Haji',
    '05-20': 'Vesak Day',
    '10-29': 'Deepavali',
  },
  2028: {
    '01-26': 'Chinese New Year',
    '01-27': 'Chinese New Year (Day 2)',
    '02-27': 'Hari Raya Puasa',
    '05-05': 'Hari Raya Haji',
    '05-09': 'Vesak Day',
    '10-17': 'Deepavali',
  },
};

const NZL_MATARIKI: Record<number, string> = {
  2025: '06-20',
  2026: '07-10',
  2027: '06-25',
  2028: '07-14',
};

const getCountryHolidaysForYear = (countryId: string, year: number): Record<string, string> => {
  const map: Record<string, string> = {};
  const setHol = (mmdd: string, name: string) => {
    map[mmdd] = map[mmdd] ? `${map[mmdd]} / ${name}` : name;
  };

  const easter = getEasterSunday(year);
  const goodFriday = formatMMDD(addDaysToDate(easter, -2));
  const easterSunday = formatMMDD(easter);
  const easterMonday = formatMMDD(addDaysToDate(easter, 1));
  const ascensionDay = formatMMDD(addDaysToDate(easter, 39));
  const whitMonday = formatMMDD(addDaysToDate(easter, 50));

  switch (countryId) {
    case 'USA': {
      setHol('01-01', "New Year's Day");
      setHol(nthWeekdayOfMonth(year, 1, 1, 3), 'Martin Luther King Jr. Day');
      setHol(nthWeekdayOfMonth(year, 2, 1, 3), "Presidents' Day");
      setHol(lastWeekdayOfMonth(year, 5, 1), 'Memorial Day');
      setHol('06-19', 'Juneteenth');
      const obsJuneteenth = getUSObservedDate(year, 6, 19);
      if (obsJuneteenth) setHol(obsJuneteenth, 'Juneteenth (Observed)');
      setHol('07-04', 'Independence Day');
      const obsJuly4 = getUSObservedDate(year, 7, 4);
      if (obsJuly4) setHol(obsJuly4, 'Independence Day (Observed)');
      setHol(nthWeekdayOfMonth(year, 9, 1, 1), 'Labor Day');
      setHol(nthWeekdayOfMonth(year, 10, 1, 2), 'Columbus Day');
      setHol('10-31', 'Halloween');
      setHol('11-11', 'Veterans Day');
      setHol(nthWeekdayOfMonth(year, 11, 4, 4), 'Thanksgiving Day');
      setHol('12-25', 'Christmas Day');
      const obsXmas = getUSObservedDate(year, 12, 25);
      if (obsXmas) setHol(obsXmas, 'Christmas Day (Observed)');
      break;
    }
    case 'CHN': {
      setHol('01-01', "New Year's Day");
      setHol('05-01', 'Labour Day');
      setHol('10-01', 'National Day');
      const lunar = CHN_LUNAR_HOLIDAYS[year];
      if (lunar) Object.entries(lunar).forEach(([k, v]) => setHol(k, v));
      break;
    }
    case 'UK': {
      setHol('01-01', "New Year's Day");
      const nyDay = new Date(year, 0, 1).getDay();
      if (nyDay === 6) setHol('01-03', "New Year's Day (Observed)");
      if (nyDay === 0) setHol('01-02', "New Year's Day (Observed)");
      setHol(goodFriday, 'Good Friday');
      setHol(easterMonday, 'Easter Monday');
      setHol(nthWeekdayOfMonth(year, 5, 1, 1), 'Early May Bank Holiday');
      setHol(lastWeekdayOfMonth(year, 5, 1), 'Spring Bank Holiday');
      setHol(lastWeekdayOfMonth(year, 8, 1), 'Summer Bank Holiday');
      setHol('12-25', 'Christmas Day');
      setHol('12-26', 'Boxing Day');
      const xmasDay = new Date(year, 11, 25).getDay();
      if (xmasDay === 5) setHol('12-28', 'Boxing Day (Observed)');
      if (xmasDay === 6) {
        setHol('12-27', 'Christmas Day (Observed)');
        setHol('12-28', 'Boxing Day (Observed)');
      }
      if (xmasDay === 0) setHol('12-27', 'Christmas Day (Observed)');
      break;
    }
    case 'JPN': {
      setHol('01-01', "New Year's Day");
      setHol(nthWeekdayOfMonth(year, 1, 1, 2), 'Coming of Age Day');
      setHol('02-11', 'National Foundation Day');
      setHol('02-23', "Emperor's Birthday");
      setHol(year === 2027 ? '03-21' : '03-20', 'Vernal Equinox Day');
      setHol('04-29', 'Shōwa Day');
      setHol('05-03', 'Constitution Memorial Day');
      setHol('05-04', 'Greenery Day');
      setHol('05-05', "Children's Day");
      if (new Date(year, 4, 3).getDay() === 0 || new Date(year, 4, 4).getDay() === 0 || new Date(year, 4, 5).getDay() === 0) {
        setHol('05-06', "Children's Day (Observed)");
      }
      setHol(nthWeekdayOfMonth(year, 7, 1, 3), 'Marine Day');
      setHol('08-11', 'Mountain Day');
      setHol(nthWeekdayOfMonth(year, 9, 1, 3), 'Respect for the Aged Day');
      setHol(year === 2028 ? '09-22' : '09-23', 'Autumnal Equinox Day');
      setHol(nthWeekdayOfMonth(year, 10, 1, 2), 'Sports Day');
      setHol('11-03', 'Culture Day');
      setHol('11-23', 'Labour Thanksgiving Day');
      break;
    }
    case 'FRA': {
      setHol('01-01', "New Year's Day");
      setHol(easterMonday, 'Easter Monday');
      setHol('05-01', 'Labour Day');
      setHol('05-08', 'Victory in Europe Day');
      setHol(ascensionDay, 'Ascension Day');
      setHol(whitMonday, 'Whit Monday');
      setHol('07-14', 'Bastille Day');
      setHol('08-15', 'Assumption Day');
      setHol('11-01', "All Saints' Day");
      setHol('11-11', 'Armistice Day');
      setHol('12-25', 'Christmas Day');
      break;
    }
    case 'LUX': {
      setHol('01-01', "New Year's Day");
      setHol(easterMonday, 'Easter Monday');
      setHol('05-01', 'Labour Day');
      setHol('05-09', 'Europe Day');
      setHol(ascensionDay, 'Ascension Day');
      setHol(whitMonday, 'Whit Monday');
      setHol('06-23', 'Luxembourg National Day');
      setHol('08-15', 'Assumption Day');
      setHol('11-01', "All Saints' Day");
      setHol('12-25', 'Christmas Day');
      setHol('12-26', "St. Stephen's Day");
      break;
    }
    case 'ESP': {
      setHol('01-01', "New Year's Day");
      setHol('01-06', 'Epiphany');
      setHol(goodFriday, 'Good Friday');
      setHol('05-01', 'Labour Day');
      setHol('08-15', 'Assumption Day');
      setHol('10-12', 'National Day of Spain');
      setHol('11-01', "All Saints' Day");
      setHol('12-06', 'Constitution Day');
      setHol('12-08', 'Immaculate Conception');
      setHol('12-25', 'Christmas Day');
      break;
    }
    case 'ITA': {
      setHol('01-01', "New Year's Day");
      setHol('01-06', 'Epiphany');
      setHol(easterSunday, 'Easter Sunday');
      setHol(easterMonday, 'Easter Monday');
      setHol('04-25', 'Liberation Day');
      setHol('05-01', 'Labour Day');
      setHol('06-02', 'Republic Day');
      setHol('08-15', 'Assumption Day');
      setHol('11-01', "All Saints' Day");
      setHol('12-08', 'Immaculate Conception');
      setHol('12-25', 'Christmas Day');
      setHol('12-26', "St. Stephen's Day");
      break;
    }
    case 'KOR': {
      setHol('01-01', "New Year's Day");
      setHol('03-01', 'Independence Movement Day');
      setHol('05-05', "Children's Day");
      setHol('06-06', 'Memorial Day');
      setHol('08-15', 'Liberation Day');
      setHol('10-03', 'National Foundation Day');
      setHol('10-09', 'Hangul Day');
      setHol('12-25', 'Christmas Day');
      const lunar = KOR_LUNAR_HOLIDAYS[year];
      if (lunar) {
        Object.entries(lunar).forEach(([k, v]) => {
          if (k === '05-05' && map[k]) {
            map[k] = v;
          } else {
            setHol(k, v);
          }
        });
      }
      break;
    }
    case 'SGP': {
      setHol('01-01', "New Year's Day");
      setHol(goodFriday, 'Good Friday');
      setHol('05-01', 'Labour Day');
      setHol('08-09', 'National Day');
      if (new Date(year, 7, 9).getDay() === 0) setHol('08-10', 'National Day (Observed)');
      setHol('12-25', 'Christmas Day');
      const lunar = SGP_LUNAR_HOLIDAYS[year];
      if (lunar) Object.entries(lunar).forEach(([k, v]) => setHol(k, v));
      break;
    }
    case 'CHE': {
      setHol('01-01', "New Year's Day");
      setHol(goodFriday, 'Good Friday');
      setHol(easterMonday, 'Easter Monday');
      setHol(ascensionDay, 'Ascension Day');
      setHol(whitMonday, 'Whit Monday');
      setHol('08-01', 'Swiss National Day');
      setHol('12-25', 'Christmas Day');
      setHol('12-26', "St. Stephen's Day");
      break;
    }
    case 'NZL': {
      setHol('01-01', "New Year's Day");
      setHol('01-02', "Day after New Year's Day");
      setHol('02-06', 'Waitangi Day');
      setHol(goodFriday, 'Good Friday');
      setHol(easterMonday, 'Easter Monday');
      setHol('04-25', 'Anzac Day');
      if (new Date(year, 3, 25).getDay() === 6) setHol('04-27', 'Anzac Day (Observed)');
      if (new Date(year, 3, 25).getDay() === 0) setHol('04-26', 'Anzac Day (Observed)');
      setHol(nthWeekdayOfMonth(year, 6, 1, 1), "King's Birthday");
      if (NZL_MATARIKI[year]) setHol(NZL_MATARIKI[year], 'Matariki');
      setHol(nthWeekdayOfMonth(year, 10, 1, 4), 'Labour Day');
      setHol('12-25', 'Christmas Day');
      setHol('12-26', 'Boxing Day');
      if (new Date(year, 11, 25).getDay() === 5) setHol('12-28', 'Boxing Day (Observed)');
      if (new Date(year, 11, 25).getDay() === 6) {
        setHol('12-27', 'Christmas Day (Observed)');
        setHol('12-28', 'Boxing Day (Observed)');
      }
      break;
    }
    case 'AUS': {
      setHol('01-01', "New Year's Day");
      setHol('01-26', 'Australia Day');
      setHol(goodFriday, 'Good Friday');
      setHol(easterMonday, 'Easter Monday');
      setHol('04-25', 'Anzac Day');
      setHol(nthWeekdayOfMonth(year, 6, 1, 2), "King's Birthday");
      setHol('12-25', 'Christmas Day');
      setHol('12-26', 'Boxing Day');
      if (new Date(year, 11, 25).getDay() === 5) setHol('12-28', 'Boxing Day (Observed)');
      if (new Date(year, 11, 25).getDay() === 6) {
        setHol('12-27', 'Christmas Day (Observed)');
        setHol('12-28', 'Boxing Day (Observed)');
      }
      break;
    }
    case 'RUS': {
      setHol('01-01', 'New Year Holiday');
      setHol('01-02', 'New Year Holiday');
      setHol('01-03', 'New Year Holiday');
      setHol('01-04', 'New Year Holiday');
      setHol('01-05', 'New Year Holiday');
      setHol('01-06', 'New Year Holiday');
      setHol('01-07', 'Orthodox Christmas Day');
      setHol('02-23', 'Defender of the Fatherland Day');
      setHol('03-08', "International Women's Day");
      setHol('05-01', 'Spring and Labour Day');
      setHol('05-09', 'Victory Day');
      setHol('06-12', 'Russia Day');
      setHol('11-04', 'Unity Day');
      break;
    }
  }

  return map;
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

const ISO_TO_COUNTRY_ID: Record<string, string> = {
  US: 'USA',
  CN: 'CHN',
  GB: 'UK',
  UK: 'UK',
  JP: 'JPN',
  FR: 'FRA',
  IT: 'ITA',
  KR: 'KOR',
  LU: 'LUX',
  NZ: 'NZL',
  RU: 'RUS',
  SG: 'SGP',
  ES: 'ESP',
  CH: 'CHE',
  AU: 'AUS',
};

const mapIsoToCountryId = (iso?: string | null): string | null => {
  if (!iso) return null;
  const upper = iso.trim().toUpperCase();
  return ISO_TO_COUNTRY_ID[upper] || null;
};

const guessCountryFromBrowserTimezone = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (!tz) return 'USA';
    const exact = COUNTRIES.find((c) => c.timezone === tz);
    if (exact) return exact.id;
    if (
      tz.startsWith('America/') &&
      (tz.includes('New_York') ||
        tz.includes('Chicago') ||
        tz.includes('Denver') ||
        tz.includes('Los_Angeles') ||
        tz.includes('Phoenix') ||
        tz.includes('Detroit') ||
        tz.includes('Anchorage') ||
        tz.includes('Honolulu'))
    ) {
      return 'USA';
    }
    if (tz.startsWith('Australia/')) return 'AUS';
    if (
      tz.startsWith('Asia/Shanghai') ||
      tz.startsWith('Asia/Chongqing') ||
      tz.startsWith('Asia/Harbin') ||
      tz.startsWith('Asia/Urumqi')
    ) {
      return 'CHN';
    }
    if (tz === 'Asia/Tokyo') return 'JPN';
    if (tz === 'Asia/Seoul') return 'KOR';
    if (tz === 'Asia/Singapore') return 'SGP';
    if (tz === 'Europe/London') return 'UK';
    if (tz === 'Europe/Paris') return 'FRA';
    if (tz === 'Europe/Rome') return 'ITA';
    if (tz === 'Europe/Luxembourg') return 'LUX';
    if (tz === 'Europe/Madrid') return 'ESP';
    if (tz === 'Europe/Zurich') return 'CHE';
    if (
      tz.startsWith('Europe/Moscow') ||
      tz.startsWith('Asia/Yekaterinburg') ||
      tz.startsWith('Asia/Vladivostok')
    ) {
      return 'RUS';
    }
    if (tz === 'Pacific/Auckland') return 'NZL';
  } catch {
    // Ignore Intl errors
  }
  return 'USA';
};

const LUNAR_DAYS_ZH = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];

const chineseLunarFmt = (() => {
  try {
    return new Intl.DateTimeFormat('zh-CN-u-ca-chinese', { month: 'long', day: 'numeric' });
  } catch {
    return null;
  }
})();

const getChineseLunarParts = (date: Date): { fullLabel: string; cellLabel: string } | null => {
  if (!chineseLunarFmt) return null;
  try {
    const parts = chineseLunarFmt.formatToParts(
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
    );
    const monthPart = parts.find((p) => p.type === 'month')?.value || '';
    const dayNum = parseInt(parts.find((p) => p.type === 'day')?.value || '', 10);
    if (!monthPart || !Number.isFinite(dayNum) || dayNum < 1 || dayNum > 30) return null;
    const dayWord = LUNAR_DAYS_ZH[dayNum - 1] || String(dayNum);
    return {
      fullLabel: `${monthPart}${dayWord}`,
      cellLabel: dayNum === 1 ? monthPart : dayWord,
    };
  } catch {
    return null;
  }
};

const WEEKDAYS: Record<string, string[]> = {
  English: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  Spanish: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
  French: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
  German: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  Chinese: ['日', '一', '二', '三', '四', '五', '六'],
  Japanese: ['日', '月', '火', '水', '木', '金', '土'],
  Korean: ['일', '월', '화', '수', '목', '금', '토'],
  Italian: ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'],
  Russian: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  Luxembourgish: ['So', 'Mé', 'Dë', 'Më', 'Do', 'Fr', 'Sa'],
};

const CAL_T: Record<string, Record<string, string>> = {
  English: {
    worldDates: 'World Dates',
    events: 'Events & Reminders',
    holidaysMonth: 'Holidays This Month',
    noEvents: 'No Events',
    addEvent: 'Add to Calendar',
    event: 'Event',
    reminder: 'Reminder',
    title: 'Title',
    cancel: 'Cancel',
    save: 'Save',
    deleteEvent: 'Delete Event',
    deleteConfirm: 'Are you sure you want to delete this event?',
    oneCalendar: '1 Calendar',
    twoCalendars: '2 Calendars',
    today: 'Today',
    ipLocation: 'IP Location',
    lunar: 'Lunar',
    primaryCal: 'Calendar 1',
    secondaryCal: 'Calendar 2',
  },
  Korean: {
    worldDates: '세계 시간',
    events: '일정 및 리마인더',
    holidaysMonth: '이달의 공휴일',
    noEvents: '일정 없음',
    addEvent: '캘린더에 추가',
    event: '일정',
    reminder: '리마인더',
    title: '제목',
    cancel: '취소',
    save: '저장',
    deleteEvent: '일정 삭제',
    deleteConfirm: '이 일정을 삭제하시겠습니까?',
    oneCalendar: '1개 달력',
    twoCalendars: '2개 달력',
    today: '오늘',
    ipLocation: 'IP 위치',
    lunar: '음력',
    primaryCal: '달력 1',
    secondaryCal: '달력 2',
  },
  Spanish: {
    worldDates: 'Fechas mundiales',
    events: 'Eventos y recordatorios',
    holidaysMonth: 'Festivos del mes',
    noEvents: 'Sin eventos',
    addEvent: 'Añadir al calendario',
    event: 'Evento',
    reminder: 'Recordatorio',
    title: 'Título',
    cancel: 'Cancelar',
    save: 'Guardar',
    deleteEvent: 'Eliminar evento',
    deleteConfirm: '¿Estás seguro de que deseas eliminar este evento?',
    oneCalendar: '1 Calendario',
    twoCalendars: '2 Calendarios',
    today: 'Hoy',
    ipLocation: 'Ubicación IP',
    lunar: 'Lunar',
    primaryCal: 'Calendario 1',
    secondaryCal: 'Calendario 2',
  },
  French: {
    worldDates: 'Heures mondiales',
    events: 'Événements & Rappels',
    holidaysMonth: 'Jours fériés du mois',
    noEvents: 'Aucun événement',
    addEvent: 'Ajouter au calendrier',
    event: 'Événement',
    reminder: 'Rappel',
    title: 'Titre',
    cancel: 'Annuler',
    save: 'Enregistrer',
    deleteEvent: 'Supprimer l\'événement',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet événement ?',
    oneCalendar: '1 Calendrier',
    twoCalendars: '2 Calendriers',
    today: 'Aujourd\'hui',
    ipLocation: 'Position IP',
    lunar: 'Lunaire',
    primaryCal: 'Calendrier 1',
    secondaryCal: 'Calendrier 2',
  },
  German: {
    worldDates: 'Weltzeiten',
    events: 'Termine & Erinnerungen',
    holidaysMonth: 'Feiertage im Monat',
    noEvents: 'Keine Termine',
    addEvent: 'Zum Kalender hinzufügen',
    event: 'Termin',
    reminder: 'Erinnerung',
    title: 'Titel',
    cancel: 'Abbrechen',
    save: 'Speichern',
    deleteEvent: 'Termin löschen',
    deleteConfirm: 'Sind Sie sicher, dass Sie diesen Termin löschen möchten?',
    oneCalendar: '1 Kalender',
    twoCalendars: '2 Kalender',
    today: 'Heute',
    ipLocation: 'IP-Standort',
    lunar: 'Mondkalender',
    primaryCal: 'Kalender 1',
    secondaryCal: 'Kalender 2',
  },
  Chinese: {
    worldDates: '世界时间',
    events: '日程与提醒',
    holidaysMonth: '本月节假日',
    noEvents: '暂无日程',
    addEvent: '添加到日历',
    event: '事件',
    reminder: '提醒',
    title: '标题',
    cancel: '取消',
    save: '保存',
    deleteEvent: '删除日程',
    deleteConfirm: '您确定要删除此日程吗？',
    oneCalendar: '单日历',
    twoCalendars: '双日历',
    today: '今天',
    ipLocation: 'IP 所在地',
    lunar: '农历',
    primaryCal: '日历 1',
    secondaryCal: '日历 2',
  },
  Japanese: {
    worldDates: '世界時計',
    events: '予定とリマインダー',
    holidaysMonth: '今月の祝日',
    noEvents: '予定なし',
    addEvent: 'カレンダーに追加',
    event: '予定',
    reminder: 'リマインダー',
    title: 'タイトル',
    cancel: 'キャンセル',
    save: '保存',
    deleteEvent: '予定の削除',
    deleteConfirm: 'この予定を削除してもよろしいですか？',
    oneCalendar: '1カレンダー',
    twoCalendars: '2カレンダー',
    today: '今日',
    ipLocation: 'IP 位置情報',
    lunar: '旧暦',
    primaryCal: 'カレンダー 1',
    secondaryCal: 'カレンダー 2',
  },
  Italian: {
    worldDates: 'Fusi Orari',
    events: 'Eventi e Promemoria',
    holidaysMonth: 'Festività del mese',
    noEvents: 'Nessun Evento',
    addEvent: 'Aggiungi al Calendario',
    event: 'Evento',
    reminder: 'Promemoria',
    title: 'Titolo',
    cancel: 'Annulla',
    save: 'Salva',
    deleteEvent: 'Elimina Evento',
    deleteConfirm: 'Sei sicuro di voler eliminare questo evento?',
    oneCalendar: '1 Calendario',
    twoCalendars: '2 Calendari',
    today: 'Oggi',
    ipLocation: 'Posizione IP',
    lunar: 'Lunare',
    primaryCal: 'Calendario 1',
    secondaryCal: 'Calendario 2',
  },
  Russian: {
    worldDates: 'Мировое Время',
    events: 'События и Напоминания',
    holidaysMonth: 'Праздники месяца',
    noEvents: 'Нет Событий',
    addEvent: 'Добавить в календарь',
    event: 'Событие',
    reminder: 'Напоминание',
    title: 'Название',
    cancel: 'Отмена',
    save: 'Сохранить',
    deleteEvent: 'Удалить событие',
    deleteConfirm: 'Вы уверены, что хотите удалить это событие?',
    oneCalendar: '1 Календарь',
    twoCalendars: '2 Календаря',
    today: 'Сегодня',
    ipLocation: 'IP-локация',
    lunar: 'Лунный',
    primaryCal: 'Календарь 1',
    secondaryCal: 'Календарь 2',
  },
  Luxembourgish: {
    worldDates: 'Weltzäiten',
    events: 'Evenementer & Erënnerungen',
    holidaysMonth: 'Feierdeeg dëse Mount',
    noEvents: 'Keng Evenementer',
    addEvent: 'An de Kalenner derbäisetzen',
    event: 'Evenement',
    reminder: 'Erënnerung',
    title: 'Titel',
    cancel: 'Ofbriechen',
    save: 'Späicheren',
    deleteEvent: 'Evenement läschen',
    deleteConfirm: 'Sidd Dir sécher, datt Dir dëst Evenement läschen wëllt?',
    oneCalendar: '1 Kalenner',
    twoCalendars: '2 Kalenneren',
    today: 'Haut',
    ipLocation: 'IP-Standuert',
    lunar: 'Mound',
    primaryCal: 'Kalenner 1',
    secondaryCal: 'Kalenner 2',
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
  Italian: 'it-IT',
  Russian: 'ru-RU',
  Luxembourgish: 'lb-LU',
};

export default function Calendar({ language = 'English' }: CalendarProps) {
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(now);

  const initialBrowserCountry = useMemo(() => guessCountryFromBrowserTimezone(), []);

  const [events, setEvents] = useLocalStorage<EventItem[]>('GeekTabs-events', []);
  const [calendarCount, setCalendarCount] = useLocalStorage<1 | 2>('GeekTabs-cal-count-v2', 1);
  const [country1Mode, setCountry1Mode] = useLocalStorage<'auto' | 'manual'>('GeekTabs-cal-country1-mode', 'auto');
  const [country1, setCountry1] = useLocalStorage<string>('GeekTabs-cal-country1', initialBrowserCountry);
  const [country2, setCountry2] = useLocalStorage<string>(
    'GeekTabs-cal-country2-v2',
    initialBrowserCountry === 'CHN' ? 'USA' : 'CHN'
  );
  const [lunarSetting, setLunarSetting] = useLocalStorage<'auto' | 'on' | 'off'>('GeekTabs-cal-lunar', 'auto');
  const [ipDetectedCountry, setIpDetectedCountry] = useState<string>(initialBrowserCountry);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', type: 'event' as 'event' | 'reminder' });
  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState<string | null>(null);

  const calText = CAL_T[language] || CAL_T['English'];
  const locale = LOCALES[language] || 'en-US';
  const monthName = currentDate.toLocaleString(locale, { month: 'long' });
  const year = currentDate.getFullYear();

  // Resolve current IP location country on mount
  useEffect(() => {
    let cancelled = false;

    const fetchWithTimeout = async (url: string, ms = 2200) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), ms);
      try {
        return await fetch(url, { signal: controller.signal });
      } finally {
        clearTimeout(timer);
      }
    };

    const detectCountry = async () => {
      let mapped: string | null = null;

      try {
        const res = await fetchWithTimeout('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data && !data.error && data.country_code) {
            mapped = mapIsoToCountryId(data.country_code);
          }
        }
      } catch {
        // Fallback below
      }

      if (!mapped) {
        try {
          const res = await fetchWithTimeout('https://ipinfo.io/json');
          if (res.ok) {
            const data = await res.json();
            if (data?.country) {
              mapped = mapIsoToCountryId(data.country);
            }
          }
        } catch {
          // Fallback below
        }
      }

      if (!mapped) {
        try {
          const res = await fetchWithTimeout('https://www.cloudflare.com/cdn-cgi/trace');
          if (res.ok) {
            const txt = await res.text();
            const locLine = txt.split('\n').find((l) => l.startsWith('loc='));
            if (locLine) {
              mapped = mapIsoToCountryId(locLine.split('=')[1]);
            }
          }
        } catch {
          // Keep browser timezone guess
        }
      }

      if (!cancelled && mapped) {
        setIpDetectedCountry(mapped);
        if (country1Mode === 'auto') {
          setCountry1(mapped);
          if (country2 === mapped) {
            setCountry2(mapped === 'CHN' ? 'USA' : 'CHN');
          }
        }
      }
    };

    detectCountry();
    return () => {
      cancelled = true;
    };
  }, [country1Mode]);

  const handleResetToIpCountry = () => {
    setCountry1Mode('auto');
    setCountry1(ipDetectedCountry);
  };

  const handleSelectCountry1 = (val: string) => {
    setCountry1Mode('manual');
    setCountry1(val);
  };

  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const selectedEvents = events.filter((e) => e.date === selectedDateStr);

  const activeCountries = useMemo(() => {
    if (calendarCount === 1) {
      return [country1];
    }
    if (country1 && country2 && country1 !== country2) {
      return [country1, country2];
    }
    return [country1 || country2].filter(Boolean);
  }, [calendarCount, country1, country2]);

  const getHolidaysForYMD = (y: number, m1: number, d: number, countriesList = activeCountries) => {
    const mmdd = `${String(m1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const result: string[] = [];
    for (const cId of countriesList) {
      const hols = getCountryHolidaysForYear(cId, y);
      if (hols[mmdd]) {
        result.push(`${cId}: ${hols[mmdd]}`);
      }
    }
    return result;
  };

  const selectedDayHolidays = getHolidaysForYMD(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    selectedDate.getDate()
  );

  const viewedMonthHolidays = useMemo(() => {
    const y = currentDate.getFullYear();
    const mPrefix = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-`;
    const list: Array<{ day: number; countryId: string; name: string }> = [];
    for (const cId of activeCountries) {
      const hols = getCountryHolidaysForYear(cId, y);
      for (const [mmdd, name] of Object.entries(hols)) {
        if (mmdd.startsWith(mPrefix)) {
          list.push({
            day: parseInt(mmdd.slice(3), 10),
            countryId: cId,
            name,
          });
        }
      }
    }
    list.sort((a, b) => a.day - b.day || a.countryId.localeCompare(b.countryId));
    return list;
  }, [currentDate, activeCountries]);

  // Windows 11 style 42-cell (6 weeks x 7 days) month grid
  const calendarCells = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDayOfWeek = new Date(y, m, 1).getDay();
    const daysInCurr = new Date(y, m + 1, 0).getDate();
    const daysInPrev = new Date(y, m, 0).getDate();

    const cells: Array<{ date: Date; inCurrentMonth: boolean }> = [];

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      cells.push({ date: new Date(y, m - 1, daysInPrev - i), inCurrentMonth: false });
    }
    for (let d = 1; d <= daysInCurr; d++) {
      cells.push({ date: new Date(y, m, d), inCurrentMonth: true });
    }
    while (cells.length < 42) {
      const nextDay = cells.length - firstDayOfWeek - daysInCurr + 1;
      cells.push({ date: new Date(y, m + 1, nextDay), inCurrentMonth: false });
    }

    return cells;
  }, [currentDate]);

  const shouldShowLunarForCountry = (cId: string) => {
    if (lunarSetting === 'on') return true;
    if (lunarSetting === 'off') return false;
    return cId === 'CHN' || cId === 'KOR' || cId === 'SGP' || language === 'Chinese';
  };

  const selectedHeaderDateText = useMemo(() => {
    try {
      return selectedDate.toLocaleDateString(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return selectedDateStr;
    }
  }, [selectedDate, locale, selectedDateStr]);

  const selectedLunarInfo = useMemo(() => {
    const anyLunarActive =
      lunarSetting === 'on' ||
      (lunarSetting === 'auto' && activeCountries.some((c) => c === 'CHN' || c === 'KOR' || c === 'SGP')) ||
      language === 'Chinese';
    if (!anyLunarActive) return null;
    return getChineseLunarParts(selectedDate)?.fullLabel || null;
  }, [selectedDate, lunarSetting, activeCountries, language]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;
    setEvents([
      ...events,
      {
        id: `evt-${Date.now()}`,
        title: newEvent.title,
        date: selectedDateStr,
        time: newEvent.time,
        type: newEvent.type,
      },
    ]);
    setShowAddModal(false);
    setNewEvent({ title: '', time: '', type: 'event' });
  };

  const renderCountryGrid = (
    countryId: string,
    onChangeCountry: (val: string) => void,
    isAutoIp: boolean,
    slotLabel?: string
  ) => {
    const showLunar = shouldShowLunarForCountry(countryId);
    const holidaysMap = getCountryHolidaysForYear(countryId, currentDate.getFullYear());
    const countryName = COUNTRY_NAMES[language]?.[countryId] || COUNTRIES.find((c) => c.id === countryId)?.name || countryId;

    return (
      <div className="flex flex-col">
        {/* Per-calendar selector bar (shown prominently in 2-calendar mode or compact country header in 1-calendar mode) */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-black/8 dark:border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            {slotLabel && (
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 shrink-0">
                {slotLabel}
              </span>
            )}
            <select
              value={countryId}
              onChange={(e) => onChangeCountry(e.target.value)}
              aria-label={slotLabel || countryName}
              className="world-dates-select bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 rounded-xl px-2.5 py-1.5 text-xs font-bold text-black dark:text-white outline-none cursor-pointer truncate max-w-[175px]"
            >
              {COUNTRIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-white dark:bg-[#1e2029] text-black dark:text-white">
                  {COUNTRY_NAMES[language]?.[c.id] || c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isAutoIp ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                <LocateFixed size={12} />
                <span>{calText.ipLocation}</span>
              </span>
            ) : slotLabel === calText.primaryCal || calendarCount === 1 ? (
              <button
                type="button"
                onClick={handleResetToIpCountry}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 text-[11px] font-semibold text-black dark:text-white transition-colors cursor-pointer"
                title={calText.ipLocation}
              >
                <LocateFixed size={11} />
                <span>{calText.ipLocation}</span>
              </button>
            ) : (
              <span className="text-[11px] font-mono opacity-55 font-semibold">{countryId}</span>
            )}
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5">
          {(WEEKDAYS[language] || WEEKDAYS['English']).map((day) => (
            <div
              key={day}
              className="text-center calendar-weekday-header text-black dark:text-white font-semibold text-xs py-1.5"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Windows 11 6x7 Date Matrix */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {calendarCells.map(({ date, inCurrentMonth }) => {
            const cellY = date.getFullYear();
            const cellM = date.getMonth() + 1;
            const cellD = date.getDate();
            const dateKey = `${cellY}-${String(cellM).padStart(2, '0')}-${String(cellD).padStart(2, '0')}`;
            const mmdd = `${String(cellM).padStart(2, '0')}-${String(cellD).padStart(2, '0')}`;

            // Use accurate year lookup when leading/trailing cells span adjacent year
            const cellHolidaysMap =
              cellY === currentDate.getFullYear()
                ? holidaysMap
                : getCountryHolidaysForYear(countryId, cellY);
            const holidayName = cellHolidaysMap[mmdd] || null;
            const hasEvt = events.some((e) => e.date === dateKey);
            const lunarCell = showLunar ? getChineseLunarParts(date)?.cellLabel : null;

            const isTodayCell =
              cellD === now.getDate() &&
              date.getMonth() === now.getMonth() &&
              cellY === now.getFullYear();
            const isSelectedCell =
              cellD === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              cellY === selectedDate.getFullYear();

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => {
                  setSelectedDate(date);
                  if (!inCurrentMonth) {
                    setCurrentDate(new Date(cellY, date.getMonth(), 1));
                  }
                }}
                title={holidayName ? `${countryId}: ${holidayName}` : dateKey}
                className={`calendar-day-btn relative flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer select-none ${
                  calendarCount === 2 ? 'py-1.5 min-h-[48px]' : 'py-2 min-h-[54px] sm:min-h-[60px]'
                } ${
                  isSelectedCell
                    ? 'bg-transparent'
                    : isTodayCell
                      ? 'bg-indigo-500/10 border border-indigo-500/60 hover:bg-indigo-500/15'
                      : inCurrentMonth
                        ? 'hover:bg-black/5 dark:hover:bg-white/10'
                        : 'opacity-40 hover:opacity-75 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                <div
                  className={`flex flex-col items-center justify-center rounded-full transition-all ${
                    calendarCount === 2 ? 'w-9 h-9 sm:w-10 sm:h-10' : 'w-11 h-11 sm:w-12 sm:h-12'
                  } ${
                    isSelectedCell
                      ? 'cal-selected-circle bg-[#0067c0] text-white shadow-sm'
                      : ''
                  }`}
                >
                  <span
                    className={`leading-none tabular-nums ${
                      calendarCount === 2 ? 'text-sm sm:text-base' : 'text-sm sm:text-lg'
                    } ${
                      isSelectedCell
                        ? '!text-white font-bold'
                        : isTodayCell
                          ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-black dark:text-white font-medium'
                    }`}
                  >
                    {cellD}
                  </span>

                  {/* Sub-label inside circle (Holiday short label or Lunar date, matching Windows 11 calendar) */}
                  {(holidayName || lunarCell) && (
                    <span
                      className={`mt-0.5 max-w-[92%] truncate text-[9px] leading-none font-medium ${
                        isSelectedCell
                          ? '!text-white/95'
                          : holidayName
                            ? '!text-rose-500 font-semibold'
                            : 'opacity-65 text-black dark:text-white'
                      }`}
                    >
                      {holidayName ? holidayName.replace(/ \(Observed\)/, '') : lunarCell}
                    </span>
                  )}
                </div>

                {/* Tiny dot indicator for user events */}
                {hasEvt && (
                  <span
                    className={`absolute bottom-1 w-1 h-1 rounded-full ${
                      isSelectedCell ? 'bg-[#0067c0]' : 'bg-indigo-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const WorldClock = ({ countryId }: { countryId: string }) => {
    const country = COUNTRIES.find((c) => c.id === countryId);
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
    } catch {
      weekdayStr = '';
      timeStr = '--:--';
    }

    const countryName = COUNTRY_NAMES[language]?.[country.id] || country.name;

    return (
      <div className="world-clock-card flex flex-col p-3 sm:p-3.5 bg-black/5 dark:bg-white/10 rounded-2xl border border-black/10 dark:border-white/10 transition-all">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <Globe size={15} className="text-black dark:text-white opacity-70 shrink-0" />
            <span className="font-bold text-xs sm:text-sm text-black dark:text-white truncate leading-tight">
              {countryName}
            </span>
          </div>
          {countryId === country1 && country1Mode === 'auto' && (
            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
              {calText.ipLocation}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2 pl-6">
          {weekdayStr && (
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-black/60 dark:text-white/60">
              {weekdayStr}
            </span>
          )}
          <span className="font-mono text-sm sm:text-base font-bold text-black dark:text-white tracking-tight tabular-nums">
            {timeStr}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`calendar-container flex flex-col lg:flex-row gap-6 lg:gap-7 mx-auto w-full px-4 sm:px-6 ${
        calendarCount === 2 ? 'max-w-7xl' : 'max-w-6xl'
      }`}
    >
      {/* Main Windows-style Calendar Card */}
      <div className="w-full lg:flex-[1.7] xl:flex-[2.1] GeekTabs-card weather-huawei-style webcard-light-grey-bg rounded-3xl overflow-hidden flex flex-col">
        {/* Windows 11 Top Date Strip + View Mode Setting (1 Calendar / 2 Calendars) */}
        <div className="px-5 sm:px-7 py-4 border-b border-black/10 dark:border-white/15 bg-black/[0.025] dark:bg-white/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-base sm:text-lg font-semibold text-black dark:text-white tracking-tight truncate">
              {selectedHeaderDateText}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-black/65 dark:text-white/70 mt-0.5">
              {selectedLunarInfo && <span className="font-medium">{selectedLunarInfo}</span>}
              {selectedLunarInfo && selectedDayHolidays.length > 0 && <span aria-hidden="true">·</span>}
              {selectedDayHolidays.length > 0 && (
                <span className="font-semibold text-rose-500">{selectedDayHolidays.join(' / ')}</span>
              )}
            </div>
          </div>

          {/* Calendar Settings Controls (1 Calendar vs 2 Calendars, Lunar Toggle, Today) */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="inline-flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15">
              <button
                type="button"
                onClick={() => setCalendarCount(1)}
                style={calendarCount === 1 ? { color: '#ffffff', WebkitTextFillColor: '#ffffff' } : undefined}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  calendarCount === 1
                    ? 'cal-seg-active bg-[#0067c0] text-white !text-white shadow-xs'
                    : 'text-black dark:text-white opacity-75 hover:opacity-100'
                }`}
              >
                {calText.oneCalendar}
              </button>
              <button
                type="button"
                onClick={() => setCalendarCount(2)}
                style={calendarCount === 2 ? { color: '#ffffff', WebkitTextFillColor: '#ffffff' } : undefined}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  calendarCount === 2
                    ? 'cal-seg-active bg-[#0067c0] text-white !text-white shadow-xs'
                    : 'text-black dark:text-white opacity-75 hover:opacity-100'
                }`}
              >
                {calText.twoCalendars}
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                setLunarSetting((prev) => (prev === 'on' ? 'off' : 'on'))
              }
              style={lunarSetting === 'on' ? { color: '#ffffff', WebkitTextFillColor: '#ffffff' } : undefined}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                lunarSetting === 'on'
                  ? 'cal-seg-active bg-[#0067c0] border-transparent text-white !text-white'
                  : 'bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/15 text-black dark:text-white opacity-75 hover:opacity-100'
              }`}
              title={calText.lunar}
            >
              {calText.lunar}
            </button>

            <button
              type="button"
              onClick={() => {
                const t = new Date();
                setCurrentDate(new Date(t.getFullYear(), t.getMonth(), 1));
                setSelectedDate(t);
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 border border-black/10 dark:border-white/15 text-black dark:text-white transition-all cursor-pointer"
            >
              {calText.today}
            </button>
          </div>
        </div>

        {/* Month / Year Bar + Left/Right Navigation Arrows */}
        <div className="p-5 sm:p-7 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-5 gap-3">
            <div className="flex items-baseline gap-2.5 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight truncate">
                {monthName}
              </h2>
              <span className="calendar-year-display text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight tabular-nums">
                {year}
              </span>
            </div>

            {/* Left / Right Month Navigation Arrows (preserved per user request) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                className="calendar-nav-arrow p-2.5 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 active:scale-95 rounded-xl transition-all border border-black/10 dark:border-white/15 flex items-center justify-center cursor-pointer"
                title="Previous month"
                aria-label="Previous Month"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="calendar-nav-arrow p-2.5 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 active:scale-95 rounded-xl transition-all border border-black/10 dark:border-white/15 flex items-center justify-center cursor-pointer"
                title="Next month"
                aria-label="Next Month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* 1 Calendar or 2 Calendars Side-by-Side */}
          {calendarCount === 1 ? (
            renderCountryGrid(country1, handleSelectCountry1, country1Mode === 'auto')
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {renderCountryGrid(country1, handleSelectCountry1, country1Mode === 'auto', calText.primaryCal)}
              {renderCountryGrid(country2, setCountry2, false, calText.secondaryCal)}
            </div>
          )}
        </div>
      </div>

      {/* World Dates & Events Sidebar Column */}
      <div className="w-full lg:w-80 xl:w-96 flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-col gap-6 items-stretch shrink-0">
        {/* World Dates Widget */}
        <div className="GeekTabs-card weather-huawei-style webcard-light-grey-bg rounded-3xl p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-0.5">
            <Globe size={18} className="world-dates-logo text-[#6143f7] dark:text-[#6143f7] shrink-0 opacity-90" strokeWidth={2} />
            <h3 className="world-dates-title text-sm font-bold uppercase tracking-widest text-[#6143f7] dark:text-[#6143f7]">
              {calText.worldDates}
            </h3>
          </div>

          <div className={`grid ${calendarCount === 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
            <select
              value={country1}
              onChange={(e) => handleSelectCountry1(e.target.value)}
              className="world-dates-select bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 rounded-xl p-2.5 text-xs font-bold text-black dark:text-white outline-none cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-white dark:bg-[#1e2029] text-black dark:text-white">
                  {COUNTRY_NAMES[language]?.[c.id] || c.name}
                </option>
              ))}
            </select>
            {calendarCount === 2 && (
              <select
                value={country2}
                onChange={(e) => setCountry2(e.target.value)}
                className="world-dates-select bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 rounded-xl p-2.5 text-xs font-bold text-black dark:text-white outline-none cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-white dark:bg-[#1e2029] text-black dark:text-white">
                    {COUNTRY_NAMES[language]?.[c.id] || c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-3 mt-1 flex-1 flex flex-col justify-between">
            <div className="space-y-2.5">
              <WorldClock countryId={country1} />
              {calendarCount === 2 && <WorldClock countryId={country2} />}
            </div>

            {calendarCount === 2 && country1 && country2 && country1 !== country2 && (
              <div className="world-dates-diff-pill flex items-center justify-center p-3 bg-black/5 dark:bg-white/10 rounded-2xl border border-black/10 dark:border-white/10 mt-auto">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-black dark:text-white text-center leading-relaxed">
                  {(() => {
                    const c1 = COUNTRIES.find((c) => c.id === country1);
                    const c2 = COUNTRIES.find((c) => c.id === country2);
                    if (!c1 || !c2) return null;
                    try {
                      const currentNow = new Date();
                      const getOffsetHours = (tz: string) => {
                        const parts = new Intl.DateTimeFormat('en-US', {
                          timeZone: tz,
                          timeZoneName: 'shortOffset',
                        }).formatToParts(currentNow);
                        const tzName = parts.find((p) => p.type === 'timeZoneName')?.value || '';
                        if (!tzName.includes('+') && !tzName.includes('-')) return 0;
                        const sign = tzName.includes('-') ? -1 : 1;
                        const timePart = tzName.split(/[+-]/)[1];
                        const [h, m] = timePart.split(':');
                        return sign * (parseInt(h, 10) + (m ? parseInt(m, 10) / 60 : 0));
                      };

                      const diffHours = getOffsetHours(c1.timezone) - getOffsetHours(c2.timezone);
                      const c1Name = COUNTRY_NAMES[language]?.[c1.id] || c1.name;
                      const c2Name = COUNTRY_NAMES[language]?.[c2.id] || c2.name;
                      return formatTimeDifference(c1Name, c2Name, diffHours, language);
                    } catch {
                      return null;
                    }
                  })()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Selected Date Events, Reminders & Holidays */}
        <div className="flex-1 GeekTabs-card weather-huawei-style webcard-light-grey-bg rounded-3xl p-5 sm:p-6 flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-black dark:text-white font-bold text-base tabular-nums">
                  {selectedDate.getDate()}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-black dark:text-white truncate">{calText.events}</h3>
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

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[340px]">
            {/* Holidays for selected date */}
            {selectedDayHolidays.map((h, i) => (
              <div
                key={`hol-${i}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-black dark:text-white"
              >
                <MapPin size={16} className="text-rose-500 shrink-0" />
                <span className="text-xs font-bold text-black dark:text-white">{h}</span>
              </div>
            ))}

            {selectedEvents.length === 0 && selectedDayHolidays.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 opacity-70">
                <CalendarClock
                  size={40}
                  className="calendar-empty-icon text-[#6143f7] stroke-[#6143f7] fill-[#6143f7]/10 mb-2.5"
                  strokeWidth={1}
                />
                <p className="text-[10px] uppercase tracking-widest font-bold text-black dark:text-white text-center">
                  {calText.noEvents}
                </p>
              </div>
            ) : (
              selectedEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 group"
                >
                  {evt.type === 'event' ? (
                    <CalendarIcon size={16} className="text-rose-500 shrink-0" />
                  ) : (
                    <Bell size={16} className="text-amber-500 animate-pulse shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-black dark:text-white truncate">{evt.title}</p>
                    {evt.time && (
                      <p className="text-[10px] text-black dark:text-white opacity-75 font-bold mt-0.5">
                        {evt.time}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setConfirmDeleteEvent(evt.id)}
                    className="opacity-0 group-hover:opacity-100 text-black dark:text-white hover:text-rose-500 transition-all p-1 cursor-pointer"
                  >
                    <Plus size={16} className="rotate-45" />
                  </button>
                </div>
              ))
            )}

            {/* Monthly holidays for active country/countries */}
            {viewedMonthHolidays.length > 0 && (
              <div className="pt-2 border-t border-black/10 dark:border-white/15 space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-widest text-rose-500 px-1">
                  {calText.holidaysMonth} · {activeCountries.join(' / ')}
                </p>
                <div className="space-y-1.5">
                  {viewedMonthHolidays.map((h, idx) => (
                    <button
                      key={`${h.countryId}-${h.day}-${idx}`}
                      type="button"
                      onClick={() =>
                        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), h.day))
                      }
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 border border-black/5 dark:border-white/10 text-left transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-bold text-rose-500 shrink-0">
                          {h.countryId}
                        </span>
                        <span className="text-xs font-semibold text-black dark:text-white truncate">
                          {h.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold font-mono tabular-nums text-black/65 dark:text-white/70 shrink-0">
                        {String(currentDate.getMonth() + 1).padStart(2, '0')}/{String(h.day).padStart(2, '0')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
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

