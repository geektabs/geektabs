import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { t } from '../../i18n';

interface SearchBarProps {
  language: string;
}

export default function SearchBar({ language }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useLocalStorage('GeekTabs-search-engine', 'Google');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      let url = '';
      switch (engine) {
        case 'Bing': url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`; break;
        case 'DuckDuckGo': url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`; break;
        case 'Baidu': url = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`; break;
        case 'Google':
        default: url = `https://www.google.com/search?q=${encodeURIComponent(query)}`; break;
      }
      window.open(url, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className="w-full flex justify-center"
    >
      <form 
        onSubmit={handleSearch} 
        className="w-full max-w-3xl bg-white/95 dark:bg-[#202124]/95 backdrop-blur-md border border-[#dfe1e5] dark:border-[#5f6368] rounded-full flex items-center px-2.5 sm:px-4 py-2 sm:py-3 hover:shadow-md focus-within:shadow-md focus-within:border-indigo-500/40 dark:focus-within:border-indigo-400/40 transition-all overflow-hidden"
      >
        <div className="relative group/engine shrink-0 ml-1 sm:ml-2">
          <select
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
            className="appearance-none bg-transparent outline-none cursor-pointer text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 pl-1 pr-4"
          >
            <option value="Google">Google</option>
            <option value="Bing">Bing</option>
            <option value="DuckDuckGo">DuckDuckGo</option>
            <option value="Baidu">Baidu</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-0.5">
            <svg className="h-3 w-3 fill-current text-gray-500 dark:text-gray-400" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

        <div className="w-[1px] h-4 bg-gray-200 dark:bg-white/15 mx-1.5 sm:mx-2 shrink-0" />

        <Search className="text-[#9aa0a6] shrink-0 ml-0.5 sm:ml-1" size={17} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t(language, 'search')}
          className="min-w-0 flex-1 bg-transparent border-none outline-none px-2 sm:px-3 text-xs sm:text-sm md:text-base text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </form>
    </motion.div>
  );
}
