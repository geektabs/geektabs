import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Delete } from 'lucide-react';

export interface CalculatorTabProps {
  language?: string;
}

const CALC_T: Record<string, Record<string, string>> = {
  English: {
    history: 'History',
    noHistory: "There's no history yet"
  },
  Spanish: {
    history: 'Historial',
    noHistory: 'Aún no hay historial'
  },
  French: {
    history: 'Historique',
    noHistory: "Il n'y a pas encore d'historique"
  },
  German: {
    history: 'Verlauf',
    noHistory: 'Noch kein Verlauf vorhanden'
  },
  Chinese: {
    history: '计算历史',
    noHistory: '暂无计算历史'
  },
  Japanese: {
    history: '履歴',
    noHistory: '履歴はまだありません'
  },
  Korean: {
    history: '기록',
    noHistory: '기록이 없습니다'
  },
  Italian: {
    history: 'Cronologia',
    noHistory: 'Nessuna cronologia presente'
  },
  Russian: {
    history: 'История',
    noHistory: 'История отсутствует'
  },
  Luxembourgish: {
    history: 'Verlaf',
    noHistory: 'Kee Verlaf verfügbar'
  }
};

export default function CalculatorTab({ language = 'English' }: CalculatorTabProps = {}) {
  const dictionary = CALC_T[language] || CALC_T['English'];
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<{ equation: string, result: string }[]>([]);

  const handleNumClick = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperatorClick = (op: string) => {
    if (operator && previousValue && !waitingForNewValue) {
      calculate();
    } else {
      setPreviousValue(display);
    }
    setOperator(op);
    setWaitingForNewValue(true);
  };

  const calculate = () => {
    if (!operator || !previousValue) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result = 0;

    switch (operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        result = current !== 0 ? prev / current : NaN;
        break;
    }

    const resultStr = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(8)).toString();
    
    setHistory(prevHistory => [...prevHistory, { equation: `${previousValue} ${operator} ${display} =`, result: resultStr }]);
    
    setDisplay(resultStr);
    setPreviousValue(resultStr);
    setOperator(null);
    setWaitingForNewValue(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const handleDelete = () => {
    if (waitingForNewValue) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    setDisplay((val / 100).toString());
    setWaitingForNewValue(true);
  };

  const handleToggleSign = () => {
    const val = parseFloat(display);
    setDisplay((val * -1).toString());
  };

  const handleSpecialAction = (action: string) => {
    const val = parseFloat(display);
    let result = val;
    switch (action) {
      case '1/x':
        result = 1 / val;
        break;
      case 'x2':
        result = val * val;
        break;
      case 'sqrt':
        result = Math.sqrt(val);
        break;
    }
    const resultStr = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(8)).toString();
    setDisplay(resultStr);
    setWaitingForNewValue(true);
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const key = e.key;
      if (/[0-9]/.test(key)) {
        e.preventDefault();
        handleNumClick(key);
      } else if (key === '+') {
        e.preventDefault();
        handleOperatorClick('+');
      } else if (key === '-') {
        e.preventDefault();
        handleOperatorClick('-');
      } else if (key === '*') {
        e.preventDefault();
        handleOperatorClick('*');
      } else if (key === '/') {
        e.preventDefault();
        handleOperatorClick('/');
      } else if (key === '.' || key === ',') {
        e.preventDefault();
        handleDecimal();
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      } else if (key === '%') {
        e.preventDefault();
        handlePercent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [display, previousValue, operator, waitingForNewValue]);

  const btnClass = "flex items-center justify-center p-4 h-16 text-xl font-medium rounded-lg transition-all active:scale-[0.98]";
  const numBtnClass = `${btnClass} calculator-btn GeekTabs-card hover:bg-black/5 dark:hover:bg-white/5 word-color`;
  const opBtnClass = numBtnClass;
  const actionBtnClass = numBtnClass;
  const equalsBtnClass = `${btnClass} calculator-btn calculator-equals-btn bg-indigo-600 hover:bg-indigo-700 text-white font-bold !text-white`;

  return (
    <div className="flex justify-center items-center h-full w-full max-w-[320px] md:max-w-3xl mx-auto pb-20">
      <div className="w-full rounded-2xl GeekTabs-card webcard-light-grey-bg calculator-tab-card p-1 overflow-hidden flex flex-col md:flex-row h-[560px]">
        
        {/* Calculator section */}
        <div className="flex-1 flex flex-col h-full">
          <div className="mb-2 mt-8 text-right overflow-hidden whitespace-nowrap relative z-10 px-4" style={{ scrollbarWidth: 'none' }}>
          <div className="calculator-display-history text-sm font-medium opacity-80 word-color mb-1 h-5">
            {previousValue && operator ? `${previousValue} ${operator}` : ''}
          </div>
          <div className={`calculator-display-main ${display.length > 12 ? 'text-3xl' : display.length > 9 ? 'text-4xl' : 'text-5xl'} font-semibold tracking-tight word-color transition-all duration-200`}>
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1 p-2 relative z-10">
          <button onClick={handlePercent} className={actionBtnClass}>%</button>
          <button onClick={handleClear} className={actionBtnClass}>CE</button>
          <button onClick={handleClear} className={actionBtnClass}>C</button>
          <button onClick={handleDelete} className={actionBtnClass}>
            <Delete size={20} />
          </button>
          
          <button onClick={() => handleSpecialAction('1/x')} className={actionBtnClass}>¹/x</button>
          <button onClick={() => handleSpecialAction('x2')} className={actionBtnClass}>x²</button>
          <button onClick={() => handleSpecialAction('sqrt')} className={actionBtnClass}>√x</button>
          <button onClick={() => handleOperatorClick('/')} className={actionBtnClass}>÷</button>

          <button onClick={() => handleNumClick('7')} className={numBtnClass}>7</button>
          <button onClick={() => handleNumClick('8')} className={numBtnClass}>8</button>
          <button onClick={() => handleNumClick('9')} className={numBtnClass}>9</button>
          <button onClick={() => handleOperatorClick('*')} className={actionBtnClass}>×</button>

          <button onClick={() => handleNumClick('4')} className={numBtnClass}>4</button>
          <button onClick={() => handleNumClick('5')} className={numBtnClass}>5</button>
          <button onClick={() => handleNumClick('6')} className={numBtnClass}>6</button>
          <button onClick={() => handleOperatorClick('-')} className={actionBtnClass}>−</button>

          <button onClick={() => handleNumClick('1')} className={numBtnClass}>1</button>
          <button onClick={() => handleNumClick('2')} className={numBtnClass}>2</button>
          <button onClick={() => handleNumClick('3')} className={numBtnClass}>3</button>
          <button onClick={() => handleOperatorClick('+')} className={actionBtnClass}>+</button>

          <button onClick={handleToggleSign} className={numBtnClass}>±</button>
          <button onClick={() => handleNumClick('0')} className={numBtnClass}>0</button>
          <button onClick={handleDecimal} className={numBtnClass}>.</button>
          <button onClick={calculate} className={equalsBtnClass} style={{ color: '#ffffff' }}>=</button>
        </div>
        </div>

        {/* History section for Desktop */}
        <div className="hidden md:flex flex-col w-72 border-l border-black/10 dark:border-white/10 p-5 bg-transparent">
           <h3 className="calculator-history-title text-sm font-semibold word-color mb-4 opacity-80">{dictionary.history}</h3>
           <div className="flex-1 overflow-y-auto space-y-5 pr-2">
             {history.length === 0 ? (
               <div className="calculator-history-equation text-sm font-medium word-color opacity-70 mt-4">{dictionary.noHistory}</div>
             ) : (
               history.map((item, i) => (
                 <div key={i} className="text-right group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-lg transition-colors">
                   <div className="calculator-history-equation text-sm word-color opacity-80 mb-1">{item.equation}</div>
                   <div className="calculator-history-result text-2xl font-semibold word-color group-hover:text-indigo-400 transition-colors">{item.result}</div>
                 </div>
               ))
             )}
           </div>
           {history.length > 0 && (
             <button onClick={() => setHistory([])} className="calculator-history-clear mt-4 p-2 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 rounded-lg word-color transition-colors flex items-center justify-end gap-2 self-end">
               <Delete size={16} />
             </button>
           )}
        </div>
      </div>
    </div>
  );
}
