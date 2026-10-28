import React, { useState, useEffect, useMemo } from 'react';

interface ZodiacSign {
  name: string;
  zhName: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  range: string;
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Capricorn', zhName: '摩羯座', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, range: '12-22 - 01-19' },
  { name: 'Aquarius', zhName: '水瓶座', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, range: '01-20 - 02-18' },
  { name: 'Pisces', zhName: '双鱼座', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, range: '02-19 - 03-20' },
  { name: 'Aries', zhName: '白羊座', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, range: '03-21 - 04-19' },
  { name: 'Taurus', zhName: '金牛座', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, range: '04-20 - 05-20' },
  { name: 'Gemini', zhName: '双子座', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20, range: '05-21 - 06-20' },
  { name: 'Cancer', zhName: '巨蟹座', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22, range: '06-21 - 07-22' },
  { name: 'Leo', zhName: '狮子座', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, range: '07-23 - 08-22' },
  { name: 'Virgo', zhName: '处女座', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, range: '08-23 - 09-22' },
  { name: 'Libra', zhName: '天秤座', startMonth: 9, startDay: 23, endMonth: 10, endDay: 23, range: '09-23 - 10-23' },
  { name: 'Scorpio', zhName: '天蝎座', startMonth: 10, startDay: 24, endMonth: 11, endDay: 21, range: '10-24 - 11-21' },
  { name: 'Sagittarius', zhName: '射手座', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, range: '11-22 - 12-21' },
];

function getHoroscopeSign(month: number, day: number): ZodiacSign {
  for (const sign of ZODIAC_SIGNS) {
    if (sign.startMonth === 12 && sign.endMonth === 1) {
      if ((month === 12 && day >= sign.startDay) || (month === 1 && day <= sign.endDay)) {
        return sign;
      }
    } else {
      if ((month === sign.startMonth && day >= sign.startDay) || (month === sign.endMonth && day <= sign.endDay)) {
        return sign;
      }
    }
  }
  return ZODIAC_SIGNS[0];
}

interface HoroscopeInfoProps {
  language?: string;
}

export default function HoroscopeInfo({ language = 'English' }: HoroscopeInfoProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Keep live when day, week, month, or sign changes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const { line1, line2 } = useMemo(() => {
    const month = currentDate.getMonth() + 1; // 1-12
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();

    const sign = getHoroscopeSign(month, day);

    // Day of year calculation (UTC normalized for zero DST variance)
    const startOfYearUtc = Date.UTC(year, 0, 1);
    const currentUtc = Date.UTC(year, currentDate.getMonth(), day);
    const dayOfYear = Math.floor((currentUtc - startOfYearUtc) / (1000 * 60 * 60 * 24)) + 1;

    // Leap year check
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const totalDays = isLeap ? 366 : 365;

    // Week of year calculation (e.g. 40 of 52 weeks)
    const weekNum = Math.min(52, Math.ceil(dayOfYear / 7));

    // Determine language formatting (support Chinese directly or via language toggle)
    const isZh = language === 'Chinese' || (language === 'English' && typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('zh'));

    let l1 = `Today's Horoscope Sign: ${sign.name} (${sign.range})`;
    let l2 = `This Week: ${weekNum} of 52 weeks, ${dayOfYear} of ${totalDays} days`;

    if (isZh) {
      l1 = `今日星座：${sign.zhName} (${sign.range})`;
      l2 = `本周：52 周中的 ${weekNum} 周，${totalDays} 天中的 ${dayOfYear}`;
    } else if (language === 'Spanish') {
      l1 = `Signo Zodiacal de Hoy: ${sign.name} (${sign.range})`;
      l2 = `Esta semana: semana ${weekNum} de 52, día ${dayOfYear} de ${totalDays}`;
    } else if (language === 'French') {
      l1 = `Signe Astrologique du Jour : ${sign.name} (${sign.range})`;
      l2 = `Cette semaine : ${weekNum} sur 52 semaines, ${dayOfYear} sur ${totalDays} jours`;
    } else if (language === 'German') {
      l1 = `Heutiges Sternzeichen: ${sign.name} (${sign.range})`;
      l2 = `Diese Woche: ${weekNum} von 52 Wochen, ${dayOfYear} von ${totalDays} Tagen`;
    } else if (language === 'Japanese') {
      l1 = `今日の星座：${sign.zhName} (${sign.range})`;
      l2 = `今週：52週中${weekNum}週、${totalDays}日中${dayOfYear}`;
    } else if (language === 'Korean') {
      l1 = `오늘의 별자리: ${sign.name} (${sign.range})`;
      l2 = `이번 주: 52주 중 ${weekNum}주, ${totalDays}일 중 ${dayOfYear}`;
    } else if (language === 'Italian') {
      l1 = `Segno Zodiacale di Oggi: ${sign.name} (${sign.range})`;
      l2 = `Questa settimana: ${weekNum} di 52 settimane, ${dayOfYear} di ${totalDays} giorni`;
    } else if (language === 'Russian') {
      l1 = `Знак зодиака сегодня: ${sign.name} (${sign.range})`;
      l2 = `На этой неделе: ${weekNum} из 52 недель, ${dayOfYear} из ${totalDays} дней`;
    }

    return { line1: l1, line2: l2 };
  }, [currentDate, language]);

  return (
    <div className="w-full max-w-4xl mx-auto my-4 sm:my-5 text-center select-none flex flex-col items-center justify-center gap-1.5 sm:gap-2 px-4 transition-all horoscope-info-section">
      <p className="text-sm sm:text-base md:text-lg font-semibold tracking-normal horoscope-line-text leading-snug drop-shadow-xs">
        {line1}
      </p>
      <p className="text-sm sm:text-base md:text-lg font-semibold tracking-normal horoscope-line-text leading-snug drop-shadow-xs">
        {line2}
      </p>
    </div>
  );
}
