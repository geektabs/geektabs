import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Delete,
  Calculator,
  Receipt,
  Coins,
  ArrowLeftRight,
  RefreshCw,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

export interface CalculatorTabProps {
  language?: string;
}

type CalcMode = 'simple' | 'tax' | 'tips' | 'currency';

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
}

const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
];

const CALC_T: Record<string, Record<string, string>> = {
  English: {
    history: 'History',
    noHistory: "There's no history yet",
    simple: 'Simple',
    tax: 'Tax',
    tips: 'Tips',
    currency: 'Currency',
    shoppingAmount: 'Total Shopping Amount',
    taxRate: 'Sales Tax Rate (%)',
    subtotal: 'Shopping Subtotal',
    totalSalesTax: 'Total Sales Tax',
    totalToPay: 'Total Amount to Pay',
    spentAmount: 'Total Amount Spent',
    tipsRate: 'Tips Rate (%)',
    baseSpending: 'Base Spending',
    totalTips: 'Total Tips',
    totalWithTips: 'Total Amount Including Tips',
    amount: 'Amount',
    from: 'From',
    to: 'To',
    convertedAmount: 'Converted Amount',
    liveRate: 'Live Rate',
    majorPairs: 'Streaming Forex Majors',
    refresh: 'Refresh',
    loadingRates: 'Loading live rates...',
    rateError: 'Could not load live rates. Tap refresh to retry.',
    reset: 'Reset',
    sourceLabel: 'Investing.com Majors',
  },
  Spanish: {
    history: 'Historial',
    noHistory: 'Aún no hay historial',
    simple: 'Simple',
    tax: 'Impuestos',
    tips: 'Propinas',
    currency: 'Divisas',
    shoppingAmount: 'Monto total de compra',
    taxRate: 'Tasa de impuesto (%)',
    subtotal: 'Subtotal',
    totalSalesTax: 'Impuesto total',
    totalToPay: 'Total a pagar',
    spentAmount: 'Total gastado',
    tipsRate: 'Porcentaje de propina (%)',
    baseSpending: 'Gasto base',
    totalTips: 'Propina total',
    totalWithTips: 'Total con propina',
    amount: 'Monto',
    from: 'De',
    to: 'A',
    convertedAmount: 'Monto convertido',
    liveRate: 'Tasa en vivo',
    majorPairs: 'Divisas principales en vivo',
    refresh: 'Actualizar',
    loadingRates: 'Cargando tasas en vivo...',
    rateError: 'No se pudieron cargar las tasas.',
    reset: 'Reiniciar',
    sourceLabel: 'Investing.com Majors',
  },
  French: {
    history: 'Historique',
    noHistory: "Il n'y a pas encore d'historique",
    simple: 'Simple',
    tax: 'Taxe',
    tips: 'Pourboire',
    currency: 'Devises',
    shoppingAmount: 'Montant total des achats',
    taxRate: 'Taux de taxe (%)',
    subtotal: 'Sous-total',
    totalSalesTax: 'Taxe totale',
    totalToPay: 'Total à payer',
    spentAmount: 'Montant dépensé',
    tipsRate: 'Taux de pourboire (%)',
    baseSpending: 'Dépense de base',
    totalTips: 'Pourboire total',
    totalWithTips: 'Total avec pourboire',
    amount: 'Montant',
    from: 'De',
    to: 'Vers',
    convertedAmount: 'Montant converti',
    liveRate: 'Taux en direct',
    majorPairs: 'Paires Forex majeures',
    refresh: 'Actualiser',
    loadingRates: 'Chargement des taux...',
    rateError: 'Impossible de charger les taux.',
    reset: 'Réinitialiser',
    sourceLabel: 'Investing.com Majors',
  },
  German: {
    history: 'Verlauf',
    noHistory: 'Noch kein Verlauf vorhanden',
    simple: 'Einfach',
    tax: 'Steuer',
    tips: 'Trinkgeld',
    currency: 'Währung',
    shoppingAmount: 'Einkaufsbetrag gesamt',
    taxRate: 'Steuersatz (%)',
    subtotal: 'Zwischensumme',
    totalSalesTax: 'Steuerbetrag',
    totalToPay: 'Gesamtbetrag zu zahlen',
    spentAmount: 'Ausgegebener Betrag',
    tipsRate: 'Trinkgeldsatz (%)',
    baseSpending: 'Grundbetrag',
    totalTips: 'Trinkgeld gesamt',
    totalWithTips: 'Gesamt inkl. Trinkgeld',
    amount: 'Betrag',
    from: 'Von',
    to: 'Nach',
    convertedAmount: 'Umgerechneter Betrag',
    liveRate: 'Live-Kurs',
    majorPairs: 'Live-Forex-Hauptpaare',
    refresh: 'Aktualisieren',
    loadingRates: 'Kurse werden geladen...',
    rateError: 'Live-Kurse konnten nicht geladen werden.',
    reset: 'Zurücksetzen',
    sourceLabel: 'Investing.com Majors',
  },
  Chinese: {
    history: '计算历史',
    noHistory: '暂无计算历史',
    simple: '标准',
    tax: '税费',
    tips: '小费',
    currency: '汇率',
    shoppingAmount: '购物总金额',
    taxRate: '消费税率 (%)',
    subtotal: '商品金额',
    totalSalesTax: '总税额',
    totalToPay: '应付总额',
    spentAmount: '消费总金额',
    tipsRate: '小费比例 (%)',
    baseSpending: '消费本金',
    totalTips: '小费金额',
    totalWithTips: '含小费总额',
    amount: '金额',
    from: '兑换货币',
    to: '目标货币',
    convertedAmount: '兑换结果',
    liveRate: '实时汇率',
    majorPairs: '实时主要外汇汇率',
    refresh: '刷新',
    loadingRates: '正在获取实时汇率...',
    rateError: '获取实时汇率失败，请重试。',
    reset: '重置',
    sourceLabel: 'Investing.com 实时外汇',
  },
  Japanese: {
    history: '履歴',
    noHistory: '履歴はまだありません',
    simple: '標準',
    tax: '税金',
    tips: 'チップ',
    currency: '通貨',
    shoppingAmount: '買い物合計金額',
    taxRate: '消費税率 (%)',
    subtotal: '小計',
    totalSalesTax: '消費税額',
    totalToPay: 'お支払い合計',
    spentAmount: '利用金額',
    tipsRate: 'チップ率 (%)',
    baseSpending: '利用額',
    totalTips: 'チップ金額',
    totalWithTips: 'チップ込み合計',
    amount: '金額',
    from: '変換元',
    to: '変換先',
    convertedAmount: '換算結果',
    liveRate: 'リアルタイムレート',
    majorPairs: '主要為替レート',
    refresh: '更新',
    loadingRates: 'レート読込中...',
    rateError: '為替レートを取得できませんでした。',
    reset: 'リセット',
    sourceLabel: 'Investing.com Majors',
  },
  Korean: {
    history: '기록',
    noHistory: '기록이 없습니다',
    simple: '일반',
    tax: '세금',
    tips: '팁',
    currency: '환율',
    shoppingAmount: '쇼핑 총 금액',
    taxRate: '세율 (%)',
    subtotal: '상품 금액',
    totalSalesTax: '총 세금',
    totalToPay: '총 결제 금액',
    spentAmount: '지출 금액',
    tipsRate: '팁 비율 (%)',
    baseSpending: '기본 지출',
    totalTips: '총 팁 금액',
    totalWithTips: '팁 포함 총 금액',
    amount: '금액',
    from: '기준 통화',
    to: '변환 통화',
    convertedAmount: '환전 금액',
    liveRate: '실시간 환율',
    majorPairs: '실시간 주요 외환',
    refresh: '새로고침',
    loadingRates: '실시간 환율 불러오는 중...',
    rateError: '환율을 불러오지 못했습니다.',
    reset: '초기화',
    sourceLabel: 'Investing.com Majors',
  },
  Italian: {
    history: 'Cronologia',
    noHistory: 'Nessuna cronologia presente',
    simple: 'Semplice',
    tax: 'Tasse',
    tips: 'Mancia',
    currency: 'Valuta',
    shoppingAmount: 'Importo totale acquisti',
    taxRate: 'Aliquota fiscale (%)',
    subtotal: 'Subtotale',
    totalSalesTax: 'Imposta totale',
    totalToPay: 'Totale da pagare',
    spentAmount: 'Importo speso',
    tipsRate: 'Percentuale mancia (%)',
    baseSpending: 'Spesa base',
    totalTips: 'Totale mancia',
    totalWithTips: 'Totale inclusa mancia',
    amount: 'Importo',
    from: 'Da',
    to: 'A',
    convertedAmount: 'Importo convertito',
    liveRate: 'Tasso in tempo reale',
    majorPairs: 'Cambio Forex principale',
    refresh: 'Aggiorna',
    loadingRates: 'Caricamento tassi...',
    rateError: 'Impossibile caricare i tassi.',
    reset: 'Ripristina',
    sourceLabel: 'Investing.com Majors',
  },
  Russian: {
    history: 'История',
    noHistory: 'История отсутствует',
    simple: 'Обычный',
    tax: 'Налог',
    tips: 'Чаевые',
    currency: 'Валюта',
    shoppingAmount: 'Сумма покупок',
    taxRate: 'Ставка налога (%)',
    subtotal: 'Подытог',
    totalSalesTax: 'Сумма налога',
    totalToPay: 'Итого к оплате',
    spentAmount: 'Потраченная сумма',
    tipsRate: 'Процент чаевых (%)',
    baseSpending: 'Базовая сумма',
    totalTips: 'Сумма чаевых',
    totalWithTips: 'Итого с чаевыми',
    amount: 'Сумма',
    from: 'Из',
    to: 'В',
    convertedAmount: 'Результат',
    liveRate: 'Текущий курс',
    majorPairs: 'Основные курсы Форекс',
    refresh: 'Обновить',
    loadingRates: 'Загрузка курсов...',
    rateError: 'Не удалось загрузить курсы.',
    reset: 'Сброс',
    sourceLabel: 'Investing.com Majors',
  },
  Luxembourgish: {
    history: 'Verlaf',
    noHistory: 'Kee Verlaf verfügbar',
    simple: 'Einfach',
    tax: 'Steier',
    tips: 'Drénkgeld',
    currency: 'Währung',
    shoppingAmount: 'Akaafsbetrag am Ganzen',
    taxRate: 'Steiersaz (%)',
    subtotal: 'Zwëschentotal',
    totalSalesTax: 'Steier am Ganzen',
    totalToPay: 'Total ze bezuelen',
    spentAmount: 'Ausginn Betrag',
    tipsRate: 'Drénkgeld Prozentsaz (%)',
    baseSpending: 'Basisbetrag',
    totalTips: 'Drénkgeld am Ganzen',
    totalWithTips: 'Total inkl. Drénkgeld',
    amount: 'Betrag',
    from: 'Vun',
    to: 'Op',
    convertedAmount: 'Ëmgerechent',
    liveRate: 'Live-Cours',
    majorPairs: 'Live Forex Majors',
    refresh: 'Aktualiséieren',
    loadingRates: 'Coursen ginn gelueden...',
    rateError: 'Coursen konnten net geluede ginn.',
    reset: 'Zrécksetzen',
    sourceLabel: 'Investing.com Majors',
  },
};

const TAX_PRESETS = ['2.5', '4', '5', '5.5', '6', '7'];
const TIP_PRESETS = ['10', '15', '18', '20', '25'];

const sanitizeDecimalInput = (raw: string): string | null => {
  const normalized = raw.replace(/,/g, '.');
  if (/^\d*(\.\d{0,2})?$/.test(normalized)) {
    return normalized;
  }
  return null;
};

const formatTwoDecimals = (raw: string, fallback = '0.00'): string => {
  const n = parseFloat(raw);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return n.toFixed(2);
};

const formatMoney = (value: number) => {
  if (!Number.isFinite(value) || value < 0) return '0.00';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatConverted = (value: number, code: string) => {
  if (!Number.isFinite(value)) return '0.00';
  const zeroDec = ['JPY', 'KRW', 'VND', 'IDR'].includes(code);
  const maxDigits = zeroDec ? 2 : value > 0 && value < 1 ? 4 : 2;
  return value.toLocaleString(undefined, {
    minimumFractionDigits: zeroDec ? 0 : 2,
    maximumFractionDigits: maxDigits,
  });
};

export default function CalculatorTab({ language = 'English' }: CalculatorTabProps = {}) {
  const dictionary = CALC_T[language] || CALC_T['English'];
  const [activeMode, setActiveMode] = useState<CalcMode>('simple');

  // Simple Calculator State
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<{ equation: string; result: string }[]>([]);

  // Tax Calculator State
  const [shoppingAmount, setShoppingAmount] = useState('100.00');
  const [taxRate, setTaxRate] = useState('5.00');

  // Tips Calculator State
  const [spentAmount, setSpentAmount] = useState('100.00');
  const [tipsRate, setTipsRate] = useState('10.00');

  // Currency Converter State
  const [currencyAmount, setCurrencyAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [majors, setMajors] = useState<Array<{ pair: string; price: number; changePct: number }>>([]);
  const [directRate, setDirectRate] = useState<number | null>(null);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState<string>('');
  const [loadingRates, setLoadingRates] = useState(false);
  const [ratesError, setRatesError] = useState(false);

  const fetchLiveRates = useCallback(
    async (forceRefresh = false) => {
      setLoadingRates(true);
      setRatesError(false);
      try {
        const params = new URLSearchParams({
          from: fromCurrency,
          to: toCurrency,
        });
        if (forceRefresh) params.set('refresh', '1');
        const res = await fetch(`/api/forex-rates?${params.toString()}`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        if (data?.rates) {
          setRates(data.rates);
        }
        if (Array.isArray(data?.majors)) {
          setMajors(data.majors);
        }
        setDirectRate(typeof data?.directRate === 'number' ? data.directRate : null);
        if (data?.updatedAt) {
          setRatesUpdatedAt(data.updatedAt);
        }
      } catch {
        setRatesError(true);
      } finally {
        setLoadingRates(false);
      }
    },
    [fromCurrency, toCurrency]
  );

  useEffect(() => {
    if (activeMode === 'currency') {
      fetchLiveRates(false);
    }
  }, [activeMode, fetchLiveRates]);

  // Simple Calculator Handlers
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

    const resultStr = Number.isInteger(result)
      ? result.toString()
      : parseFloat(result.toFixed(8)).toString();

    setHistory((prevHistory) => [
      ...prevHistory,
      { equation: `${previousValue} ${operator} ${display} =`, result: resultStr },
    ]);

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
    const resultStr = Number.isInteger(result)
      ? result.toString()
      : parseFloat(result.toFixed(8)).toString();
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
    if (activeMode !== 'simple') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
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
  }, [activeMode, display, previousValue, operator, waitingForNewValue]);

  // Derived Tax Values
  const parsedShopping = Math.max(0, parseFloat(shoppingAmount) || 0);
  const parsedTaxRate = Math.max(0, parseFloat(taxRate) || 0);
  const salesTaxAmount = (parsedShopping * parsedTaxRate) / 100;
  const totalWithTax = parsedShopping + salesTaxAmount;

  // Derived Tips Values
  const parsedSpent = Math.max(0, parseFloat(spentAmount) || 0);
  const parsedTipsRate = Math.max(0, parseFloat(tipsRate) || 0);
  const tipsAmount = (parsedSpent * parsedTipsRate) / 100;
  const totalWithTips = parsedSpent + tipsAmount;

  // Derived Currency Values
  const effectiveExchangeRate = useMemo(() => {
    if (fromCurrency === toCurrency) return 1;
    if (directRate && directRate > 0) return directRate;
    const fromR = rates[fromCurrency];
    const toR = rates[toCurrency];
    if (fromR && toR) return toR / fromR;
    return null;
  }, [fromCurrency, toCurrency, directRate, rates]);

  const parsedCurrencyAmt = Math.max(0, parseFloat(currencyAmount) || 0);
  const convertedTotal =
    effectiveExchangeRate !== null ? parsedCurrencyAmt * effectiveExchangeRate : null;

  const btnClass =
    'flex items-center justify-center p-3 h-14 text-xl font-medium rounded-lg transition-all active:scale-[0.98]';
  const numBtnClass = `${btnClass} calculator-btn GeekTabs-card hover:bg-black/5 dark:hover:bg-white/5 word-color`;
  const actionBtnClass = numBtnClass;
  const equalsBtnClass = `${btnClass} calculator-btn calculator-equals-btn bg-indigo-600 hover:bg-indigo-700 text-white font-bold !text-white`;

  const modeTabs: Array<{
    id: CalcMode;
    label: string;
    icon: React.ReactNode;
    activeGradient: string;
    inactiveTint: string;
    iconColor: string;
  }> = [
    {
      id: 'simple',
      label: dictionary.simple,
      icon: <Calculator size={15} />,
      activeGradient: 'from-indigo-500 to-violet-600 shadow-indigo-500/30',
      inactiveTint: 'hover:bg-indigo-500/10 border-indigo-500/20',
      iconColor: 'text-indigo-500',
    },
    {
      id: 'tax',
      label: dictionary.tax,
      icon: <Receipt size={15} />,
      activeGradient: 'from-emerald-500 to-teal-600 shadow-emerald-500/30',
      inactiveTint: 'hover:bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-500',
    },
    {
      id: 'tips',
      label: dictionary.tips,
      icon: <Coins size={15} />,
      activeGradient: 'from-amber-500 to-orange-500 shadow-amber-500/30',
      inactiveTint: 'hover:bg-amber-500/10 border-amber-500/20',
      iconColor: 'text-amber-500',
    },
    {
      id: 'currency',
      label: dictionary.currency,
      icon: <ArrowLeftRight size={15} />,
      activeGradient: 'from-sky-500 to-blue-600 shadow-sky-500/30',
      inactiveTint: 'hover:bg-sky-500/10 border-sky-500/20',
      iconColor: 'text-sky-500',
    },
  ];

  return (
    <div className="flex justify-center items-center h-full w-full max-w-[400px] sm:max-w-[460px] md:max-w-3xl mx-auto pb-20">
      <div className="w-full rounded-2xl GeekTabs-card weather-huawei-style webcard-light-grey-bg calculator-tab-card overflow-hidden flex flex-col min-h-[590px] md:h-[600px]">
        {/* Top Colorful Sub-Tabs Bar */}
        <div className="calc-tabs-bar px-3 pt-3 pb-2.5 border-b border-black/10 dark:border-white/10 grid grid-cols-4 gap-2 shrink-0">
          {modeTabs.map((tab) => {
            const isActive = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMode(tab.id)}
                style={isActive ? { color: '#ffffff', WebkitTextFillColor: '#ffffff' } : undefined}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 sm:px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer select-none border ${
                  isActive
                    ? `calc-mode-tab-active bg-gradient-to-r ${tab.activeGradient} text-white !text-white border-transparent shadow-md`
                    : `calc-mode-tab ${tab.inactiveTint} bg-black/5 dark:bg-white/5`
                }`}
              >
                <span className={`shrink-0 ${isActive ? '!text-white text-white' : tab.iconColor}`}>
                  {tab.icon}
                </span>
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Sub-Tab Body */}
        {activeMode === 'simple' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-1">
            {/* Keypad & Display */}
            <div className="flex-1 flex flex-col h-full justify-between">
              <div
                className="mb-2 mt-4 text-right overflow-hidden whitespace-nowrap relative z-10 px-4"
                style={{ scrollbarWidth: 'none' }}
              >
                <div className="calculator-display-history text-sm font-medium opacity-80 word-color mb-1 h-5">
                  {previousValue && operator ? `${previousValue} ${operator}` : ''}
                </div>
                <div
                  className={`calculator-display-main ${
                    display.length > 12
                      ? 'text-3xl'
                      : display.length > 9
                      ? 'text-4xl'
                      : 'text-5xl'
                  } font-semibold tracking-tight word-color transition-all duration-200`}
                >
                  {display}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1 p-2 relative z-10">
                <button onClick={handlePercent} className={actionBtnClass}>
                  %
                </button>
                <button onClick={handleClear} className={actionBtnClass}>
                  CE
                </button>
                <button onClick={handleClear} className={actionBtnClass}>
                  C
                </button>
                <button onClick={handleDelete} className={actionBtnClass}>
                  <Delete size={20} />
                </button>

                <button onClick={() => handleSpecialAction('1/x')} className={actionBtnClass}>
                  ¹/x
                </button>
                <button onClick={() => handleSpecialAction('x2')} className={actionBtnClass}>
                  x²
                </button>
                <button onClick={() => handleSpecialAction('sqrt')} className={actionBtnClass}>
                  √x
                </button>
                <button onClick={() => handleOperatorClick('/')} className={actionBtnClass}>
                  ÷
                </button>

                <button onClick={() => handleNumClick('7')} className={numBtnClass}>
                  7
                </button>
                <button onClick={() => handleNumClick('8')} className={numBtnClass}>
                  8
                </button>
                <button onClick={() => handleNumClick('9')} className={numBtnClass}>
                  9
                </button>
                <button onClick={() => handleOperatorClick('*')} className={actionBtnClass}>
                  ×
                </button>

                <button onClick={() => handleNumClick('4')} className={numBtnClass}>
                  4
                </button>
                <button onClick={() => handleNumClick('5')} className={numBtnClass}>
                  5
                </button>
                <button onClick={() => handleNumClick('6')} className={numBtnClass}>
                  6
                </button>
                <button onClick={() => handleOperatorClick('-')} className={actionBtnClass}>
                  −
                </button>

                <button onClick={() => handleNumClick('1')} className={numBtnClass}>
                  1
                </button>
                <button onClick={() => handleNumClick('2')} className={numBtnClass}>
                  2
                </button>
                <button onClick={() => handleNumClick('3')} className={numBtnClass}>
                  3
                </button>
                <button onClick={() => handleOperatorClick('+')} className={actionBtnClass}>
                  +
                </button>

                <button onClick={handleToggleSign} className={numBtnClass}>
                  ±
                </button>
                <button onClick={() => handleNumClick('0')} className={numBtnClass}>
                  0
                </button>
                <button onClick={handleDecimal} className={numBtnClass}>
                  .
                </button>
                <button
                  onClick={calculate}
                  className={equalsBtnClass}
                  style={{ color: '#ffffff' }}
                >
                  =
                </button>
              </div>
            </div>

            {/* History section for Desktop */}
            <div className="hidden md:flex flex-col w-72 border-l border-black/10 dark:border-white/10 p-5 bg-transparent">
              <h3 className="calculator-history-title text-sm font-semibold word-color mb-4 opacity-80">
                {dictionary.history}
              </h3>
              <div className="flex-1 overflow-y-auto space-y-5 pr-2">
                {history.length === 0 ? (
                  <div className="calculator-history-equation text-sm font-medium word-color opacity-70 mt-4">
                    {dictionary.noHistory}
                  </div>
                ) : (
                  history.map((item, i) => (
                    <div
                      key={i}
                      className="text-right group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-lg transition-colors"
                    >
                      <div className="calculator-history-equation text-sm word-color opacity-80 mb-1">
                        {item.equation}
                      </div>
                      <div className="calculator-history-result text-2xl font-semibold word-color group-hover:text-indigo-400 transition-colors">
                        {item.result}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="calculator-history-clear mt-4 p-2 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 rounded-lg word-color transition-colors flex items-center justify-end gap-2 self-end"
                >
                  <Delete size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {activeMode === 'tax' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 flex flex-col justify-between gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Inputs Panel */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                      <Receipt size={17} />
                    </div>
                    <h3 className="text-base font-black tracking-tight word-color">
                      {dictionary.tax}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShoppingAmount('0.00');
                      setTaxRate('5.00');
                    }}
                    className="calc-subcard px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <RotateCcw size={12} />
                    <span>{dictionary.reset}</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider opacity-75 word-color">
                    {dictionary.shoppingAmount}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold opacity-60 pointer-events-none">
                      $
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={shoppingAmount}
                      onChange={(e) => {
                        const v = sanitizeDecimalInput(e.target.value);
                        if (v !== null) setShoppingAmount(v);
                      }}
                      onBlur={() => setShoppingAmount((prev) => formatTwoDecimals(prev, '0.00'))}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-xl text-lg font-bold border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider opacity-75 word-color">
                    {dictionary.taxRate}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={taxRate}
                      onChange={(e) => {
                        const v = sanitizeDecimalInput(e.target.value);
                        if (v !== null) setTaxRate(v);
                      }}
                      onBlur={() => setTaxRate((prev) => formatTwoDecimals(prev, '0.00'))}
                      placeholder="0.00"
                      className="w-full pl-4 pr-9 py-3 rounded-xl text-lg font-bold border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base font-bold opacity-60 pointer-events-none">
                      %
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {TAX_PRESETS.map((preset) => {
                      const active =
                        taxRate.trim() !== '' &&
                        Math.abs((parseFloat(taxRate) || 0) - parseFloat(preset)) < 0.001;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setTaxRate(parseFloat(preset).toFixed(2))}
                          style={
                            active
                              ? { color: '#ffffff', WebkitTextFillColor: '#ffffff' }
                              : undefined
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            active
                              ? 'calc-rate-pill-active bg-gradient-to-r from-emerald-500 to-teal-600 text-white !text-white shadow-sm'
                              : 'calc-subcard hover:border-emerald-500/40'
                          }`}
                        >
                          {preset}%
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Output Summary Panel */}
              <div className="calc-subcard rounded-2xl p-5 space-y-4 border">
                <div className="flex items-center justify-between py-2 border-b border-black/10 dark:border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                    {dictionary.subtotal}
                  </span>
                  <span className="text-lg font-bold font-mono">
                    ${formatMoney(parsedShopping)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-black/10 dark:border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                    {dictionary.totalSalesTax} ({parsedTaxRate.toFixed(2)}%)
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-500">
                    +${formatMoney(salesTaxAmount)}
                  </span>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                    {dictionary.totalToPay}
                  </p>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-emerald-500">
                    ${formatMoney(totalWithTax)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMode === 'tips' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 flex flex-col justify-between gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Inputs Panel */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                      <Coins size={17} />
                    </div>
                    <h3 className="text-base font-black tracking-tight word-color">
                      {dictionary.tips}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSpentAmount('100.00');
                      setTipsRate('10.00');
                    }}
                    className="calc-subcard px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <RotateCcw size={12} />
                    <span>{dictionary.reset}</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider opacity-75 word-color">
                    {dictionary.spentAmount}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold opacity-60 pointer-events-none">
                      $
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={spentAmount}
                      onChange={(e) => {
                        const v = sanitizeDecimalInput(e.target.value);
                        if (v !== null) setSpentAmount(v);
                      }}
                      onBlur={() => setSpentAmount((prev) => formatTwoDecimals(prev, '0.00'))}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-xl text-lg font-bold border focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider opacity-75 word-color">
                    {dictionary.tipsRate}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={tipsRate}
                      onChange={(e) => {
                        const v = sanitizeDecimalInput(e.target.value);
                        if (v !== null) setTipsRate(v);
                      }}
                      onBlur={() => setTipsRate((prev) => formatTwoDecimals(prev, '0.00'))}
                      placeholder="0.00"
                      className="w-full pl-4 pr-9 py-3 rounded-xl text-lg font-bold border focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base font-bold opacity-60 pointer-events-none">
                      %
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {TIP_PRESETS.map((preset) => {
                      const active =
                        tipsRate.trim() !== '' &&
                        Math.abs((parseFloat(tipsRate) || 0) - parseFloat(preset)) < 0.001;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setTipsRate(parseFloat(preset).toFixed(2))}
                          style={
                            active
                              ? { color: '#ffffff', WebkitTextFillColor: '#ffffff' }
                              : undefined
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            active
                              ? 'calc-rate-pill-active bg-gradient-to-r from-amber-500 to-orange-500 text-white !text-white shadow-sm'
                              : 'calc-subcard hover:border-amber-500/40'
                          }`}
                        >
                          {preset}%
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Output Summary Panel */}
              <div className="calc-subcard rounded-2xl p-5 space-y-4 border">
                <div className="flex items-center justify-between py-2 border-b border-black/10 dark:border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                    {dictionary.baseSpending}
                  </span>
                  <span className="text-lg font-bold font-mono">${formatMoney(parsedSpent)}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-black/10 dark:border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                    {dictionary.totalTips} ({parsedTipsRate.toFixed(2)}%)
                  </span>
                  <span className="text-xl font-black font-mono text-amber-500">
                    +${formatMoney(tipsAmount)}
                  </span>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                    {dictionary.totalWithTips}
                  </p>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-amber-500">
                    ${formatMoney(totalWithTips)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMode === 'currency' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-4">
            {/* Header & Refresh */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center shrink-0">
                  <ArrowLeftRight size={17} />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight word-color leading-none">
                    {dictionary.currency}
                  </h3>
                  {ratesUpdatedAt && (
                    <p className="text-[11px] opacity-65 mt-1">
                      {new Date(ratesUpdatedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.investing.com/currencies/streaming-forex-rates-majors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="calc-subcard px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:border-sky-500/40 transition-all"
                >
                  <span>{dictionary.sourceLabel}</span>
                  <ExternalLink size={11} />
                </a>
                <button
                  type="button"
                  onClick={() => fetchLiveRates(true)}
                  disabled={loadingRates}
                  style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                  className="calc-swap-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white !text-white flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-60"
                >
                  <RefreshCw size={12} className={loadingRates ? 'animate-spin' : ''} />
                  <span>{dictionary.refresh}</span>
                </button>
              </div>
            </div>

            {/* Amount + Currency Pair Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-4 space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider opacity-75 word-color">
                  {dictionary.amount}
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={currencyAmount}
                  onChange={(e) => setCurrencyAmount(e.target.value)}
                  placeholder="100"
                  className="w-full px-3.5 py-2.5 rounded-xl text-base font-bold border focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider opacity-75 word-color">
                  {dictionary.from}
                </label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="calc-select w-full px-3 py-2.5 rounded-xl text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-sky-500/40 cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setFromCurrency(toCurrency);
                    setToCurrency(fromCurrency);
                  }}
                  style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                  className="calc-swap-btn w-full md:w-11 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white !text-white flex items-center justify-center shadow-md cursor-pointer active:scale-95 transition-transform"
                  title="Swap currencies"
                >
                  <ArrowLeftRight size={17} />
                </button>
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider opacity-75 word-color">
                  {dictionary.to}
                </label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="calc-select w-full px-3 py-2.5 rounded-xl text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-sky-500/40 cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conversion Output Box */}
            <div className="calc-subcard rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                  {dictionary.convertedAmount}
                </p>
                {loadingRates && convertedTotal === null ? (
                  <p className="text-sm font-semibold opacity-70">{dictionary.loadingRates}</p>
                ) : ratesError && convertedTotal === null ? (
                  <p className="text-sm font-semibold text-red-500">{dictionary.rateError}</p>
                ) : (
                  <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-sky-500">
                    {convertedTotal !== null
                      ? `${formatConverted(convertedTotal, toCurrency)} ${toCurrency}`
                      : '—'}
                  </div>
                )}
              </div>

              {effectiveExchangeRate !== null && (
                <div className="sm:text-right space-y-0.5">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-65">
                    {dictionary.liveRate}
                  </p>
                  <p className="text-sm font-bold font-mono">
                    1 {fromCurrency} = {effectiveExchangeRate.toFixed(4)} {toCurrency}
                  </p>
                  <p className="text-xs font-mono opacity-65">
                    1 {toCurrency} = {(1 / effectiveExchangeRate).toFixed(4)} {fromCurrency}
                  </p>
                </div>
              )}
            </div>

            {/* Live Major Pairs Grid */}
            {majors.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider opacity-70">
                  {dictionary.majorPairs}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {majors.slice(0, 10).map((m) => (
                    <button
                      key={m.pair}
                      type="button"
                      onClick={() => {
                        const [base, quote] = m.pair.split('/');
                        if (base && quote) {
                          setFromCurrency(base);
                          setToCurrency(quote);
                        }
                      }}
                      className="calc-subcard p-2.5 rounded-xl border text-left hover:border-sky-500/45 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-black">{m.pair}</span>
                        <span
                          className={`text-[10px] font-bold ${
                            m.changePct >= 0 ? 'text-emerald-500' : 'text-red-500'
                          }`}
                        >
                          {m.changePct >= 0 ? '+' : ''}
                          {m.changePct.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-xs font-mono font-bold mt-0.5">
                        {m.price.toFixed(m.pair.includes('JPY') ? 2 : 4)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
