import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface ClockProps {
  language?: string;
  customTextColor?: string;
}

const languageToLocale: Record<string, string> = {
  English: 'en-US',
  Spanish: 'es-ES',
  French: 'fr-FR',
  German: 'de-DE',
  Chinese: 'zh-CN',
  'Chinese Traditional': 'zh-TW',
  Japanese: 'ja-JP',
  Korean: 'ko-KR',
  Italian: 'it-IT',
  Russian: 'ru-RU',
  Luxembourgish: 'lb-LU',
  Dutch: 'nl-NL',
  Swedish: 'sv-SE',
  Finnish: 'fi-FI',
  Hindi: 'hi-IN',
  Norwegian: 'nb-NO',
  Thai: 'th-TH',
  Portuguese: 'pt-PT',
  Vietnamese: 'vi-VN',
  Polish: 'pl-PL',
  Danish: 'da-DK',
  Turkish: 'tr-TR',
  Greek: 'el-GR',
};

export default function Clock({ language = 'English', customTextColor }: ClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const locale = languageToLocale[language] || 'en-US';
  const timeString = time.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateString = time.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });

  const hasCustom = customTextColor && customTextColor !== 'default';
  const textStyle: React.CSSProperties = hasCustom
    ? { color: customTextColor, WebkitTextFillColor: customTextColor, background: 'none' }
    : {
        color: '#6143f7',
        WebkitTextFillColor: '#6143f7',
        background: 'none'
      };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
      className="text-center select-none"
    >
      <h1 
        className="text-[60px] sm:text-[82px] lg:text-[90px] font-normal tracking-tight leading-none clock-time-display w-fit mx-auto text-[#6143f7]"
        style={textStyle}
      >
        {timeString}
      </h1>
      <p 
        className="text-sm sm:text-base lg:text-lg font-bold tracking-[0.12em] sm:tracking-[0.18em] lg:tracking-[0.2em] uppercase mt-3 sm:mt-4 clock-date-display w-fit mx-auto text-[#6143f7]"
        style={textStyle}
      >
        {dateString}
      </p>
    </motion.div>
  );
}
