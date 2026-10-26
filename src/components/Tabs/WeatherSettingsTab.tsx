import React, { useState, useEffect, useRef } from 'react';
import { CloudSun, Thermometer, Calendar, Clock, Check, Sparkles, MapPin, Search, Navigation, Loader2, X, ChevronRight } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { searchGlobalLocations, detectCurrentLocation, GeoLocationResult } from '../../services/weatherService';

export interface WeatherSettingsTabProps {
  language?: string;
}

const WEATHER_SETTINGS_T: Record<string, Record<string, string>> = {
  English: {
    title: 'Weather Settings',
    subtitle: 'Configure temperature units and forecast display interval preferences.',
    unitTitle: 'Temperature Unit',
    unitDesc: 'Select Celsius (°C) or Fahrenheit (°F) for current weather and forecasts.',
    celsius: 'Celsius (°C)',
    celsiusDesc: 'Metric standard used worldwide',
    fahrenheit: 'Fahrenheit (°F)',
    fahrenheitDesc: 'Imperial standard commonly used in the US',
    forecastModeTitle: 'Forecast Display Mode',
    forecastModeDesc: 'Choose whether the forecast grid displays hourly intervals or daily forecasts.',
    hourly: 'Hourly Forecast',
    hourlyDesc: 'Displays the next 12 hours with expected conditions and temperatures',
    daily: 'Daily Forecast',
    dailyDesc: 'Displays the next 7 days with daily high and low temperatures',
    previewTitle: 'Live Preference Preview',
    previewDesc: 'Changes are automatically saved and immediately reflected on the Home weather widget.'
  },
  Chinese: {
    title: '天气设置',
    subtitle: '配置天气小组件的温度单位与预报显示模式。',
    unitTitle: '温度单位',
    unitDesc: '选择摄氏度 (°C) 或华氏度 (°F) 来显示当前气温与预报。',
    celsius: '摄氏度 (°C)',
    celsiusDesc: '全球公制标准单位',
    fahrenheit: '华氏度 (°F)',
    fahrenheitDesc: '美国等地区常用英制单位',
    forecastModeTitle: '天气预报展示模式',
    forecastModeDesc: '选择天气卡片按“逐小时”或按“天”展示天气预报。',
    hourly: '按小时预报 (Hourly)',
    hourlyDesc: '展示未来 12 小时的天气状况与逐时气温',
    daily: '按天预报 (Daily)',
    dailyDesc: '展示未来 7 天的每日天气状况与最高/最低气温',
    previewTitle: '设置预览',
    previewDesc: '所有修改已自动保存，并即时同步到首页天气卡片上。'
  },
  Spanish: {
    title: 'Configuración del Clima',
    subtitle: 'Configura las unidades de temperatura y el intervalo de visualización del pronóstico.',
    unitTitle: 'Unidad de Temperatura',
    unitDesc: 'Selecciona Celsius (°C) o Fahrenheit (°F) para el clima actual y pronósticos.',
    celsius: 'Celsius (°C)',
    celsiusDesc: 'Estándar métrico utilizado en todo el mundo',
    fahrenheit: 'Fahrenheit (°F)',
    fahrenheitDesc: 'Estándar imperial comúnmente usado en EE. UU.',
    forecastModeTitle: 'Modo de Pronóstico',
    forecastModeDesc: 'Elige si el pronóstico se muestra por horas o por días.',
    hourly: 'Pronóstico por Horas',
    hourlyDesc: 'Muestra las próximas 12 horas con condiciones y temperaturas estimadas',
    daily: 'Pronóstico por Días',
    dailyDesc: 'Muestra los próximos 7 días con temperaturas máximas y mínimas',
    previewTitle: 'Vista previa de preferencias',
    previewDesc: 'Los cambios se guardan automáticamente y se reflejan en el widget del inicio.'
  },
  French: {
    title: 'Paramètres Météo',
    subtitle: 'Configurez les unités de température et l\'intervalle de prévision.',
    unitTitle: 'Unité de Température',
    unitDesc: 'Sélectionnez Celsius (°C) ou Fahrenheit (°F).',
    celsius: 'Celsius (°C)',
    celsiusDesc: 'Norme métrique internationale',
    fahrenheit: 'Fahrenheit (°F)',
    fahrenheitDesc: 'Norme impériale utilisée aux États-Unis',
    forecastModeTitle: 'Mode de Prévision',
    forecastModeDesc: 'Choisissez si les prévisions s\'affichent par heure ou par jour.',
    hourly: 'Prévisions par Heure',
    hourlyDesc: 'Affiche les 12 prochaines heures',
    daily: 'Prévisions par Jour',
    dailyDesc: 'Affiche les 7 prochains jours avec max et min',
    previewTitle: 'Aperçu des Préférences',
    previewDesc: 'Les modifications sont automatiquement enregistrées.'
  },
  German: {
    title: 'Wettereinstellungen',
    subtitle: 'Temperatur-Einheiten und Vorhersagemodus anpassen.',
    unitTitle: 'Temperatureinheit',
    unitDesc: 'Wählen Sie zwischen Celsius (°C) oder Fahrenheit (°F).',
    celsius: 'Celsius (°C)',
    celsiusDesc: 'Metrischer Standard',
    fahrenheit: 'Fahrenheit (°F)',
    fahrenheitDesc: 'Imperiale Maßeinheit',
    forecastModeTitle: 'Vorhersagemodus',
    forecastModeDesc: 'Wählen Sie stündliche Vorhersagen oder Tagesvorhersagen.',
    hourly: 'Stündliche Vorhersage',
    hourlyDesc: 'Zeigt die nächsten 12 Stunden an',
    daily: 'Tägliche Vorhersage',
    dailyDesc: 'Zeigt die nächsten 7 Tage mit Höchst- und Tiefstwerten an',
    previewTitle: 'Einstellungsvorschau',
    previewDesc: 'Änderungen werden automatisch gespeichert.'
  },
  Japanese: {
    title: '天気設定',
    subtitle: '温度の単位および予報の表示形式を設定します。',
    unitTitle: '温度の単位',
    unitDesc: '摂氏 (°C) または華氏 (°F) を選択します。',
    celsius: '摂氏 (°C)',
    celsiusDesc: '世界標準のメートル法単位',
    fahrenheit: '華氏 (°F)',
    fahrenheitDesc: '米国などで使用されるヤード・ポンド法単位',
    forecastModeTitle: '予報の表示モード',
    forecastModeDesc: '天気予報を「1時間ごと」または「日ごと」に表示するかを選択します。',
    hourly: '1時間ごとの予報 (Hourly)',
    hourlyDesc: '今後12時間の天候と予想気温を表示します',
    daily: '日ごとの予報 (Daily)',
    dailyDesc: '今後7日間の天候と最高・最低気温を表示します',
    previewTitle: '設定プレビュー',
    previewDesc: '変更は自動的に保存され、ホーム画面に即時反映されます。'
  },
  Korean: {
    title: '날씨 설정',
    subtitle: '온도 단위 및 예보 표시 모드를 설정합니다.',
    unitTitle: '온도 단위',
    unitDesc: '섭씨 (°C) 또는 화씨 (°F)를 선택하세요.',
    celsius: '섭씨 (°C)',
    celsiusDesc: '국제 표준 미터법 단위',
    fahrenheit: '화씨 (°F)',
    fahrenheitDesc: '미국 등에서 주로 사용하는 단위',
    forecastModeTitle: '예보 표시 모드',
    forecastModeDesc: '시간별 또는 일별 예보 모드를 선택하세요.',
    hourly: '시간별 예보 (Hourly)',
    hourlyDesc: '향후 12시간 동안의 날씨 및 기온 표시',
    daily: '일별 예보 (Daily)',
    dailyDesc: '향후 7일간의 날씨 및 최고/최저 기온 표시',
    previewTitle: '설정 미리보기',
    previewDesc: '변경 사항은 자동으로 저장되어 홈 화면에 즉시 적용됩니다.'
  },
  Italian: {
    title: 'Impostazioni Meteo',
    subtitle: 'Configura l\'unità di temperatura e l\'intervallo delle previsioni.',
    unitTitle: 'Unità di Temperatura',
    unitDesc: 'Scegli Celsius (°C) o Fahrenheit (°F).',
    celsius: 'Celsius (°C)',
    celsiusDesc: 'Standard metrico internazionale',
    fahrenheit: 'Fahrenheit (°F)',
    fahrenheitDesc: 'Standard imperiale',
    forecastModeTitle: 'Modalità Previsioni',
    forecastModeDesc: 'Visualizza le previsioni orarie o giornaliere.',
    hourly: 'Previsioni Orarie',
    hourlyDesc: 'Mostra le prossime 12 ore',
    daily: 'Previsioni Giornaliere',
    dailyDesc: 'Mostra i prossimi 7 giorni con massime e minime',
    previewTitle: 'Anteprima Preferenze',
    previewDesc: 'Le modifiche vengono salvate automaticamente.'
  },
  Russian: {
    title: 'Настройки погоды',
    subtitle: 'Настройка единиц измерения температуры и режима прогноза.',
    unitTitle: 'Единица температуры',
    unitDesc: 'Выберите Цельсий (°C) или Фаренгейт (°F).',
    celsius: 'Цельсий (°C)',
    celsiusDesc: 'Метрический стандарт',
    fahrenheit: 'Фаренгейт (°F)',
    fahrenheitDesc: 'Имперский стандарт',
    forecastModeTitle: 'Режим прогноза',
    forecastModeDesc: 'Отображение прогноза по часам или по дням.',
    hourly: 'Почасовой прогноз',
    hourlyDesc: 'Показывает следующие 12 часов с температурой',
    daily: 'Прогноз по дням',
    dailyDesc: 'Показывает следующие 7 дней с макс/мин температурой',
    previewTitle: 'Предпросмотр',
    previewDesc: 'Изменения сохраняются автоматически.'
  },
  Luxembourgish: {
    title: 'Wieder Astellungen',
    subtitle: 'Temperatur-Eenheet a Prognosen-Modus konfiguréieren.',
    unitTitle: 'Temperatur-Eenheet',
    unitDesc: 'Wielt tëscht Celsius (°C) oder Fahrenheit (°F).',
    celsius: 'Celsius (°C)',
    celsiusDesc: 'Metresche Standard',
    fahrenheit: 'Fahrenheit (°F)',
    fahrenheitDesc: 'Imperiale Standard',
    forecastModeTitle: 'Prognosen-Modus',
    forecastModeDesc: 'Wielt tëscht stëndlecher oder deeglecher Prognos.',
    hourly: 'Stëndlech Prognos',
    hourlyDesc: 'Weist déi nächst 12 Stonnen',
    daily: 'Deeglech Prognos',
    dailyDesc: 'Weist déi nächst 7 Deeg',
    previewTitle: 'Virschau',
    previewDesc: 'Astellunge ginn automatesch gespäichert.'
  }
};

export default function WeatherSettingsTab({ language = 'English' }: WeatherSettingsTabProps) {
  const d = WEATHER_SETTINGS_T[language] || WEATHER_SETTINGS_T['English'];

  // Global Weather Preferences synced across app
  const [tempUnit, setTempUnit] = useLocalStorage<'C' | 'F'>('GeekTabs-weather-temp-unit', 'F');
  const [forecastMode, setForecastMode] = useLocalStorage<'hr' | 'day'>('GeekTabs-weather-forecast-mode', 'hr');
  const [location, setLocation] = useLocalStorage('GeekTabs-location', 'Boston, MA 02115, United States');
  const [weatherInputs, setWeatherInputs] = useLocalStorage('GeekTabs-weather-inputs', {
    city: 'Boston',
    state: 'MA',
    country: 'United States',
    zipcode: '02115',
    lat: 42.3424,
    lon: -71.0877
  });

  // Ensure default and currently saved location zip code is 02115
  useEffect(() => {
    if (location.includes('02109') || weatherInputs?.zipcode === '02109') {
      const fixedLocation = 'Boston, MA 02115, United States';
      const fixedInputs = {
        city: 'Boston',
        state: 'MA',
        country: 'United States',
        zipcode: '02115',
        lat: 42.3424,
        lon: -71.0877
      };
      setLocation(fixedLocation);
      setWeatherInputs(fixedInputs);
    }
  }, [location, setLocation, setWeatherInputs]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoLocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const searchTimeoutRef = useRef<any>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchGlobalLocations(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Settings location search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const handleSelectLocation = (item: GeoLocationResult) => {
    const newInputs = {
      city: item.name,
      state: item.admin1 || '',
      country: item.country,
      zipcode: item.postcode || '',
      lat: item.latitude,
      lon: item.longitude
    };
    setLocation(item.formattedAddress);
    setWeatherInputs(newInputs);
    setShowSearchBox(false);
    setSearchQuery('');
    setSearchResults([]);

    window.dispatchEvent(new CustomEvent('geektabs-weather-location-updated', {
      detail: { location: item.formattedAddress, inputs: newInputs }
    }));
  };

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    try {
      const detected = await detectCurrentLocation();
      const newInputs = {
        city: detected.name,
        state: detected.admin1 || '',
        country: detected.country,
        zipcode: detected.postcode || '',
        lat: detected.latitude,
        lon: detected.longitude
      };
      setLocation(detected.formattedAddress);
      setWeatherInputs(newInputs);
      setShowSearchBox(false);

      window.dispatchEvent(new CustomEvent('geektabs-weather-location-updated', {
        detail: { location: detected.formattedAddress, inputs: newInputs }
      }));
    } catch {
      alert('Could not detect location. Please check your browser permissions.');
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight mb-1 flex items-center gap-2.5">
          <CloudSun className="text-indigo-500 w-6 h-6" />
          <span>{d.title}</span>
        </h2>
        <p className="text-black/50 dark:text-white/50 text-xs sm:text-sm font-medium">
          {d.subtitle}
        </p>
      </div>

      <div className="space-y-6 divide-y divide-black/5 dark:divide-white/5">
        {/* Setting 0: Location & Region */}
        <div className="pt-2">
          <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
            <MapPin size={15} />
            <span>Weather Location</span>
          </label>
          <p className="text-xs text-black/60 dark:text-white/60 mb-4 leading-relaxed">
            Configure your global city, region, or postal code to accurately fetch live weather data for the home page.
          </p>

          <div className="max-w-xl space-y-3">
            {/* Current Active Location Card */}
            <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-black/40 dark:text-white/40 tracking-wider">
                    Current Location
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetecting}
                  className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Detect Current Location"
                >
                  {isDetecting ? (
                    <Loader2 size={13} className="animate-spin text-indigo-500" />
                  ) : (
                    <Navigation size={13} className="text-indigo-500" />
                  )}
                  <span className="hidden sm:inline">Auto-Detect</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSearchBox(!showSearchBox)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {showSearchBox ? 'Close' : 'Change'}
                </button>
              </div>
            </div>

            {/* Smart Search Dropdown in Settings */}
            {showSearchBox && (
              <div ref={searchContainerRef} className="relative p-3.5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 space-y-2">
                <div className="relative flex items-center">
                  <Search size={15} className="absolute left-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city, postal code, or country (e.g. Miami, Paris, Tokyo, 90210)..."
                    className="w-full bg-white dark:bg-slate-900 border border-black/10 dark:border-white/15 rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {isSearching && (
                  <div className="flex items-center gap-2 text-xs text-black/50 dark:text-white/50 px-2 py-1">
                    <Loader2 size={13} className="animate-spin text-indigo-500" />
                    <span>Searching global weather locations...</span>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-xl shadow-lg max-h-52 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectLocation(item)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-indigo-500/10 flex items-start gap-2.5 transition-colors cursor-pointer group"
                      >
                        <MapPin size={14} className="text-indigo-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {[item.admin1, item.postcode, item.country].filter(Boolean).join(', ')}
                          </p>
                        </div>
                        <ChevronRight size={13} className="text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Setting 1: Temperature Unit (C vs F) */}
        <div className="pt-2">
          <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
            <Thermometer size={15} />
            {d.unitTitle}
          </label>
          <p className="text-xs text-black/60 dark:text-white/60 mb-4 leading-relaxed">
            {d.unitDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            {/* Celsius Option */}
            <button
              type="button"
              onClick={() => setTempUnit('C')}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer select-none ${
                tempUnit === 'C'
                  ? 'border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/15 shadow-sm ring-1 ring-indigo-500/30'
                  : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 bg-black/[0.02] dark:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                    °C
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {d.celsius}
                  </span>
                </div>
                {tempUnit === 'C' && (
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-black/50 dark:text-white/50 font-medium">
                {d.celsiusDesc}
              </p>
            </button>

            {/* Fahrenheit Option */}
            <button
              type="button"
              onClick={() => setTempUnit('F')}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer select-none ${
                tempUnit === 'F'
                  ? 'border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/15 shadow-sm ring-1 ring-indigo-500/30'
                  : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 bg-black/[0.02] dark:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                    °F
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {d.fahrenheit}
                  </span>
                </div>
                {tempUnit === 'F' && (
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-black/50 dark:text-white/50 font-medium">
                {d.fahrenheitDesc}
              </p>
            </button>
          </div>
        </div>

        {/* Setting 2: Forecast Interval Mode (by hour vs by day) */}
        <div className="pt-6">
          <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
            <Calendar size={15} />
            {d.forecastModeTitle}
          </label>
          <p className="text-xs text-black/60 dark:text-white/60 mb-4 leading-relaxed">
            {d.forecastModeDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            {/* By Hour Option */}
            <button
              type="button"
              onClick={() => setForecastMode('hr')}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer select-none ${
                forecastMode === 'hr'
                  ? 'border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/15 shadow-sm ring-1 ring-indigo-500/30'
                  : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 bg-black/[0.02] dark:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Clock size={16} />
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {d.hourly}
                  </span>
                </div>
                {forecastMode === 'hr' && (
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-black/50 dark:text-white/50 font-medium">
                {d.hourlyDesc}
              </p>
            </button>

            {/* By Day Option */}
            <button
              type="button"
              onClick={() => setForecastMode('day')}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer select-none ${
                forecastMode === 'day'
                  ? 'border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/15 shadow-sm ring-1 ring-indigo-500/30'
                  : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 bg-black/[0.02] dark:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Calendar size={16} />
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {d.daily}
                  </span>
                </div>
                {forecastMode === 'day' && (
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-black/50 dark:text-white/50 font-medium">
                {d.dailyDesc}
              </p>
            </button>
          </div>
        </div>

        {/* Informational Status Card */}
        <div className="pt-6">
          <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15 flex items-start gap-3 max-w-xl">
            <Sparkles size={16} className="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {d.previewTitle}
              </h4>
              <p className="text-[11px] text-black/60 dark:text-white/60 mt-0.5">
                {d.previewDesc}
              </p>
              <div className="mt-2.5 flex items-center gap-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold">
                  Unit: °{tempUnit}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold">
                  View: {forecastMode === 'hr' ? 'Hourly (12h)' : 'Daily (7d)'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
