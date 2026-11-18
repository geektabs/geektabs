import React, { useState, useEffect, useRef } from 'react';
import { 
  Cloud, 
  CloudSun,
  Sun, 
  CloudRain, 
  Snowflake, 
  MapPin, 
  Loader2, 
  ChevronRight, 
  Search, 
  RefreshCw, 
  X, 
  SlidersHorizontal,
  Navigation
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { 
  searchGlobalLocations, 
  fetchLiveForecast, 
  detectCurrentLocation, 
  GeoLocationResult,
  LiveWeatherData,
  formatCanonicalAddress
} from '../../services/weatherService';

export const WEATHER_T: Record<string, Record<string, string>> = {
  English: {
    title: "Weather",
    locationTitle: "Weather Location",
    searchPlaceholder: "Search city, postal code, state, or country...",
    searching: "Searching locations...",
    noResults: "No locations found. Try city or postal code.",
    quickSearch: "Global Search",
    detailedSearch: "Detailed Address Fields",
    detectLocation: "Use My Location",
    detecting: "Detecting location...",
    city: "City",
    state: "State / Region",
    zip: "Zip / Postal Code",
    country: "Country",
    placeholderCity: "e.g. San Francisco",
    placeholderState: "e.g. CA",
    placeholderZip: "e.g. 94103",
    placeholderCountry: "e.g. United States",
    setBtn: "Set Location",
    backBtn: "Back to Forecast",
    clearBtn: "Clear",
    refreshTooltip: "Refresh live weather",
    liveBadge: "Live",
    hourlyForecast: "Hourly forecast",
    dailyForecast: "Daily forecast",
    byHour: "By Hour",
    byDay: "By Day",
    now: "Now",
    today: "Today",
    high: "H",
    low: "L",
    errInput: "Please enter at least a City or a Postal Code.",
    errDetect: "Could not detect location. Please check your location permissions or search manually.",
    tooltipDetect: "Detect current location",
    tooltipChange: "Change location",
    clear: 'Clear',
    cloudy: 'Partly Cloudy',
    foggy: 'Foggy',
    rainy: 'Rainy',
    snowy: 'Snowy',
    thunderstorm: 'Thunderstorm',
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
  },
  Chinese: {
    title: "天气",
    locationTitle: "天气位置设置",
    searchPlaceholder: "搜索全球城市、邮编、省份或国家...",
    searching: "正在搜索位置...",
    noResults: "未找到匹配位置，请输入城市或邮政编码。",
    quickSearch: "快速全球搜索",
    detailedSearch: "详细地址字段",
    detectLocation: "使用当前位置",
    detecting: "正在定位...",
    city: "城市",
    state: "省份 / 地区",
    zip: "邮政编码",
    country: "国家",
    placeholderCity: "例如：北京",
    placeholderState: "例如：北京市",
    placeholderZip: "例如：100000",
    placeholderCountry: "例如：中国",
    setBtn: "保存并查询天气",
    backBtn: "返回天气预报",
    clearBtn: "清空",
    refreshTooltip: "刷新实时天气",
    liveBadge: "实时",
    hourlyForecast: "逐小时预报",
    dailyForecast: "7天预报",
    byHour: "按小时",
    byDay: "按天",
    now: "现在",
    today: "今天",
    high: "最高",
    low: "最低",
    errInput: "请至少输入城市或邮政编码。",
    errDetect: "无法自动检测位置，请检查权限或手动输入搜索。",
    tooltipDetect: "自动定位当前位置",
    tooltipChange: "修改位置",
    clear: '晴朗',
    cloudy: '多云',
    foggy: '有雾',
    rainy: '有雨',
    snowy: '有雪',
    thunderstorm: '雷阵雨',
    sun: '周日',
    mon: '周一',
    tue: '周二',
    wed: '周三',
    thu: '周四',
    fri: '周五',
    sat: '周六',
  },
  Spanish: {
    title: "Clima",
    locationTitle: "Ubicación del Clima",
    searchPlaceholder: "Buscar ciudad, código postal, estado o país...",
    searching: "Buscando ubicaciones...",
    noResults: "No se encontraron ubicaciones.",
    quickSearch: "Búsqueda Global",
    detailedSearch: "Campos Detallados",
    detectLocation: "Usar Mi Ubicación",
    detecting: "Detectando ubicación...",
    city: "Ciudad",
    state: "Estado / Región",
    zip: "Código Postal",
    country: "País",
    placeholderCity: "ej. Madrid",
    placeholderState: "ej. MD",
    placeholderZip: "ej. 28001",
    placeholderCountry: "ej. España",
    setBtn: "Establecer Ubicación",
    backBtn: "Volver al Pronóstico",
    clearBtn: "Limpiar",
    refreshTooltip: "Actualizar clima en vivo",
    liveBadge: "En vivo",
    hourlyForecast: "Pronóstico por horas",
    dailyForecast: "Pronóstico diario",
    byHour: "Por hora",
    byDay: "Por día",
    now: "Ahora",
    today: "Hoy",
    high: "MÁX",
    low: "MÍN",
    errInput: "Por favor, introduce al menos una ciudad o código postal.",
    errDetect: "No se pudo detectar la ubicación.",
    tooltipDetect: "Detectar ubicación actual",
    tooltipChange: "Cambiar ubicación",
    clear: 'Despejado',
    cloudy: 'Parcialmente Nublado',
    foggy: 'Neblina',
    rainy: 'Lluvioso',
    snowy: 'Nevado',
    thunderstorm: 'Tormenta',
    sun: 'Dom',
    mon: 'Lun',
    tue: 'Mar',
    wed: 'Mié',
    thu: 'Jue',
    fri: 'Vie',
    sat: 'Sáb',
  },
  French: {
    title: "Météo",
    locationTitle: "Localisation Météo",
    searchPlaceholder: "Rechercher une ville, un code postal ou un pays...",
    searching: "Recherche en cours...",
    noResults: "Aucun lieu trouvé.",
    quickSearch: "Recherche Mondiale",
    detailedSearch: "Champs Détaillés",
    detectLocation: "Utiliser Ma Position",
    detecting: "Détection...",
    city: "Ville",
    state: "État / Région",
    zip: "Code Postal",
    country: "Pays",
    placeholderCity: "ex. Paris",
    placeholderState: "ex. Île-de-France",
    placeholderZip: "ex. 75001",
    placeholderCountry: "ex. France",
    setBtn: "Définir le lieu",
    backBtn: "Retour aux prévisions",
    clearBtn: "Effacer",
    refreshTooltip: "Actualiser la météo en direct",
    liveBadge: "En direct",
    hourlyForecast: "Prévisions horaires",
    dailyForecast: "Prévisions quotidiennes",
    byHour: "Par heure",
    byDay: "Par jour",
    now: "Maintenant",
    today: "Aujourd'hui",
    high: "Max",
    low: "Min",
    errInput: "Veuillez entrer une ville ou un code postal.",
    errDetect: "Impossible de détecter la localisation.",
    tooltipDetect: "Détecter la position",
    tooltipChange: "Modifier le lieu",
    clear: 'Dégagé',
    cloudy: 'Partiellement Nuageux',
    foggy: 'Brouillard',
    rainy: 'Pluvieux',
    snowy: 'Neigeux',
    thunderstorm: 'Orageux',
    sun: 'Dim',
    mon: 'Lun',
    tue: 'Mar',
    wed: 'Mer',
    thu: 'Jeu',
    fri: 'Ven',
    sat: 'Sam',
  },
  German: {
    title: "Wetter",
    locationTitle: "Wetter-Standort",
    searchPlaceholder: "Stadt, Postleitzahl oder Land suchen...",
    searching: "Suche Standorte...",
    noResults: "Keine Standorte gefunden.",
    quickSearch: "Globale Suche",
    detailedSearch: "Detaillierte Felder",
    detectLocation: "Meinen Standort verwenden",
    detecting: "Standort wird ermittelt...",
    city: "Stadt",
    state: "Bundesland / Region",
    zip: "Postleitzahl",
    country: "Land",
    placeholderCity: "z.B. Berlin",
    placeholderState: "z.B. BE",
    placeholderZip: "z.B. 10115",
    placeholderCountry: "z.B. Deutschland",
    setBtn: "Standort festlegen",
    backBtn: "Zurück zur Vorhersage",
    clearBtn: "Leeren",
    refreshTooltip: "Live-Wetter aktualisieren",
    liveBadge: "Live",
    hourlyForecast: "Stündliche Vorhersage",
    dailyForecast: "Tagesvorhersage",
    byHour: "Stündlich",
    byDay: "Täglich",
    now: "Jetzt",
    today: "Heute",
    high: "H",
    low: "T",
    errInput: "Bitte Stadt oder Postleitzahl eingeben.",
    errDetect: "Standort konnte nicht erkannt werden.",
    tooltipDetect: "Aktuellen Standort ermitteln",
    tooltipChange: "Standort ändern",
    clear: 'Klar',
    cloudy: 'Leicht Bewölkt',
    foggy: 'Nebelig',
    rainy: 'Regnerisch',
    snowy: 'Schneebedeckt',
    thunderstorm: 'Gewitter',
    sun: 'So',
    mon: 'Mo',
    tue: 'Di',
    wed: 'Mi',
    thu: 'Do',
    fri: 'Fr',
    sat: 'Sa',
  },
  Japanese: {
    title: "天気",
    locationTitle: "天気の場所設定",
    searchPlaceholder: "世界中の都市、郵便番号、国を検索...",
    searching: "場所を検索中...",
    noResults: "一致する場所が見つかりません。",
    quickSearch: "クイック検索",
    detailedSearch: "詳細住所入力",
    detectLocation: "現在地を使用",
    detecting: "現在地を取得中...",
    city: "市区町村",
    state: "都道府県",
    zip: "郵便番号",
    country: "国",
    placeholderCity: "例：東京都",
    placeholderState: "例：東京都",
    placeholderZip: "例：100-0001",
    placeholderCountry: "例：日本",
    setBtn: "位置を設定",
    backBtn: "予報に戻る",
    clearBtn: "クリア",
    refreshTooltip: "リアルタイム天気を更新",
    liveBadge: "ライブ",
    hourlyForecast: "時間ごとの予報",
    dailyForecast: "週間予報",
    byHour: "時間別",
    byDay: "日別",
    now: "現在",
    today: "今日",
    high: "最高",
    low: "最低",
    errInput: "市区町村または郵便番号を入力してください。",
    errDetect: "位置情報を取得できませんでした。",
    tooltipDetect: "現在地を検出",
    tooltipChange: "位置を変更",
    clear: '快晴',
    cloudy: '晴れのち曇り',
    foggy: '霧',
    rainy: '雨',
    snowy: '雪',
    thunderstorm: '雷雨',
    sun: '日',
    mon: '月',
    tue: '火',
    wed: '水',
    thu: '木',
    fri: '金',
    sat: '土',
  },
  Korean: {
    title: "날씨",
    locationTitle: "날씨 위치 설정",
    searchPlaceholder: "전 세계 도시, 우편번호, 국가 검색...",
    searching: "위치 검색 중...",
    noResults: "검색 결과가 없습니다.",
    quickSearch: "빠른 글로벌 검색",
    detailedSearch: "상세 주소 입력",
    detectLocation: "현재 위치 사용",
    detecting: "위치 확인 중...",
    city: "도시",
    state: "도 / 특별시",
    zip: "우편번호",
    country: "국가",
    placeholderCity: "예: 서울시",
    placeholderState: "예: 서울",
    placeholderZip: "예: 03045",
    placeholderCountry: "예: 대한민국",
    setBtn: "위치 설정",
    backBtn: "날씨 예보로 돌아가기",
    clearBtn: "지우기",
    refreshTooltip: "실시간 날씨 새로고침",
    liveBadge: "실시간",
    hourlyForecast: "시간별 예보",
    dailyForecast: "일별 예보",
    byHour: "시간별",
    byDay: "일별",
    now: "지금",
    today: "오늘",
    high: "최고",
    low: "최저",
    errInput: "도시 또는 우편번호를 입력해주세요.",
    errDetect: "위치를 감지할 수 없습니다.",
    tooltipDetect: "현재 위치 감지",
    tooltipChange: "위치 변경",
    clear: '맑음',
    cloudy: '구름 조금',
    foggy: '안개',
    rainy: '비',
    snowy: '눈',
    thunderstorm: '뇌우',
    sun: '일',
    mon: '월',
    tue: '화',
    wed: '수',
    thu: '목',
    fri: '금',
    sat: '토',
  },
  Italian: {
    title: "Meteo",
    locationTitle: "Posizione Meteo",
    searchPlaceholder: "Cerca città, CAP o paese...",
    searching: "Ricerca posizioni...",
    noResults: "Nessuna posizione trovata.",
    quickSearch: "Ricerca Globale",
    detailedSearch: "Campi Dettagliati",
    detectLocation: "Usa La Mia Posizione",
    detecting: "Rilevamento in corso...",
    city: "Città",
    state: "Stato / Regione",
    zip: "Codice Postale",
    country: "Paese",
    placeholderCity: "es. Roma",
    placeholderState: "es. RM",
    placeholderZip: "es. 00187",
    placeholderCountry: "es. Italia",
    setBtn: "Imposta posizione",
    backBtn: "Torna alle previsioni",
    clearBtn: "Cancella",
    refreshTooltip: "Aggiorna meteo in tempo reale",
    liveBadge: "Live",
    hourlyForecast: "Previsioni orarie",
    dailyForecast: "Previsioni giornaliere",
    byHour: "Orario",
    byDay: "Giorni",
    now: "Ora",
    today: "Oggi",
    high: "MAX",
    low: "MIN",
    errInput: "Inserisci almeno una città o un codice postale.",
    errDetect: "Impossibile rilevare la posizione.",
    tooltipDetect: "Rileva posizione attuale",
    tooltipChange: "Cambia posizione",
    clear: 'Sereno',
    cloudy: 'Nuvoloso',
    foggy: 'Nebbia',
    rainy: 'Piovoso',
    snowy: 'Nevoso',
    thunderstorm: 'Temporale',
    sun: 'Dom',
    mon: 'Lun',
    tue: 'Mar',
    wed: 'Mer',
    thu: 'Gio',
    fri: 'Ven',
    sat: 'Sab',
  },
  Russian: {
    title: "Погода",
    locationTitle: "Местоположение погоды",
    searchPlaceholder: "Поиск города, индекса или страны...",
    searching: "Поиск мест...",
    noResults: "Места не найдены.",
    quickSearch: "Глобальный поиск",
    detailedSearch: "Подробные поля",
    detectLocation: "Мое местоположение",
    detecting: "Определение...",
    city: "Город",
    state: "Регион",
    zip: "Индекс",
    country: "Страна",
    placeholderCity: "например, Москва",
    placeholderState: "например, Московская обл.",
    placeholderZip: "например, 101000",
    placeholderCountry: "например, Россия",
    setBtn: "Установить местоположение",
    backBtn: "Назад к прогнозу",
    clearBtn: "Очистить",
    refreshTooltip: "Обновить погоду",
    liveBadge: "В эфире",
    hourlyForecast: "Почасовой прогноз",
    dailyForecast: "Прогноз по дням",
    byHour: "По часам",
    byDay: "По дням",
    now: "Сейчас",
    today: "Сегодня",
    high: "Макс",
    low: "Мин",
    errInput: "Пожалуйста, введите город или индекс.",
    errDetect: "Не удалось определить местоположение.",
    tooltipDetect: "Определить текущее место",
    tooltipChange: "Изменить местоположение",
    clear: 'Ясно',
    cloudy: 'Переменная облачность',
    foggy: 'Туман',
    rainy: 'Дождь',
    snowy: 'Снег',
    thunderstorm: 'Гроза',
    sun: 'Вс',
    mon: 'Пн',
    tue: 'Вт',
    wed: 'Ср',
    thu: 'Чт',
    fri: 'Пт',
    sat: 'Сб',
  },
  Luxembourgish: {
    title: "Wieder",
    locationTitle: "Wieder Standuert",
    searchPlaceholder: "Stad, Postleitzuel oder Land sichen...",
    searching: "Sichen no Standuerter...",
    noResults: "Keng Standuerter fonnt.",
    quickSearch: "Global Sich",
    detailedSearch: "Detailléiert Felder",
    detectLocation: "Mäi Standuert benotzen",
    detecting: "Standuert gëtt festgestallt...",
    city: "Stad",
    state: "Regioun",
    zip: "Postleitzuel",
    country: "Land",
    placeholderCity: "z.B. Lëtzebuerg",
    placeholderState: "z.B. LU",
    placeholderZip: "z.B. 1011",
    placeholderCountry: "z.B. Lëtzebuerg",
    setBtn: "Standuert astellen",
    backBtn: "Zréck op d'Prognos",
    clearBtn: "Läschen",
    refreshTooltip: "Live-Wieder aktualiséieren",
    liveBadge: "Live",
    hourlyForecast: "Stonnweis Prognos",
    dailyForecast: "Dagesprognos",
    byHour: "Pro Stonn",
    byDay: "Pro Dag",
    now: "Elo",
    today: "Haut",
    high: "H",
    low: "T",
    errInput: "Gitt wgl. op d'mannst eng Stad oder eng Postleitzuel un.",
    errDetect: "Standuert konnt net festgestallt ginn.",
    tooltipDetect: "Aktuelle Standuert feststellen",
    tooltipChange: "Standuert änneren",
    clear: 'Klor',
    cloudy: 'Licht Wollekeg',
    foggy: 'Niwweleg',
    rainy: 'Regneresch',
    snowy: 'Schneibedeckt',
    thunderstorm: 'Gewitter',
    sun: 'So',
    mon: 'Mé',
    tue: 'Dë',
    wed: 'Më',
    thu: 'Do',
    fri: 'Fr',
    sat: 'Sa',
  },
  Dutch: {
    title: "Weer",
    locationTitle: "Weerlocatie",
    searchPlaceholder: "Zoek stad, postcode of land...",
    searching: "Locaties zoeken...",
    noResults: "Geen locaties gevonden.",
    quickSearch: "Wereldwijd zoeken",
    detailedSearch: "Gedetailleerde velden",
    detectLocation: "Mijn locatie gebruiken",
    detecting: "Locatie bepalen...",
    city: "Stad",
    state: "Provincie",
    zip: "Postcode",
    country: "Land",
    placeholderCity: "bijv. Amsterdam",
    placeholderState: "bijv. NH",
    placeholderZip: "bijv. 1012",
    placeholderCountry: "bijv. Nederland",
    setBtn: "Locatie instellen",
    backBtn: "Terug naar verwachting",
    clearBtn: "Wissen",
    refreshTooltip: "Live weer vernieuwen",
    liveBadge: "Live",
    hourlyForecast: "Uurverwachting",
    dailyForecast: "Dagverwachting",
    byHour: "Per uur",
    byDay: "Per dag",
    now: "Nu",
    today: "Vandaag",
    high: "H",
    low: "L",
    errInput: "Vul minimaal een stad of postcode in.",
    errDetect: "Kan locatie niet bepalen.",
    tooltipDetect: "Huidige locatie detecteren",
    tooltipChange: "Locatie wijzigen",
    clear: 'Helder',
    cloudy: 'Licht bewolkt',
    foggy: 'Mistig',
    rainy: 'Regenachtig',
    snowy: 'Sneeuw',
    thunderstorm: 'Onweer',
    sun: 'Zo',
    mon: 'Ma',
    tue: 'Di',
    wed: 'Wo',
    thu: 'Do',
    fri: 'Vr',
    sat: 'Za',
  },
  Swedish: {
    title: "Väder",
    locationTitle: "Väderplats",
    searchPlaceholder: "Sök stad, postnummer eller land...",
    searching: "Söker platser...",
    noResults: "Inga platser hittades.",
    quickSearch: "Global sökning",
    detailedSearch: "Detaljerade fält",
    detectLocation: "Använd min plats",
    detecting: "Hämtar plats...",
    city: "Stad",
    state: "Län / Region",
    zip: "Postnummer",
    country: "Land",
    placeholderCity: "t.ex. Stockholm",
    placeholderState: "t.ex. AB",
    placeholderZip: "t.ex. 111 22",
    placeholderCountry: "t.ex. Sverige",
    setBtn: "Ange plats",
    backBtn: "Tillbaka till prognos",
    clearBtn: "Rensa",
    refreshTooltip: "Uppdatera vädret",
    liveBadge: "Live",
    hourlyForecast: "Timprognos",
    dailyForecast: "Dygnsprognos",
    byHour: "Per timme",
    byDay: "Per dag",
    now: "Nu",
    today: "Idag",
    high: "H",
    low: "L",
    errInput: "Ange minst en stad eller ett postnummer.",
    errDetect: "Kunde inte fastställa plats.",
    tooltipDetect: "Upptäck aktuell plats",
    tooltipChange: "Byt plats",
    clear: 'Klart',
    cloudy: 'Halvklart',
    foggy: 'Dimmigt',
    rainy: 'Regnigt',
    snowy: 'Snö',
    thunderstorm: 'Åskväder',
    sun: 'Sön',
    mon: 'Mån',
    tue: 'Tis',
    wed: 'Ons',
    thu: 'Tor',
    fri: 'Fre',
    sat: 'Lör',
  },
  Finnish: {
    title: "Sää",
    locationTitle: "Sääsijainti",
    searchPlaceholder: "Hae kaupunkia, postinumeroa tai maata...",
    searching: "Haetaan sijainteja...",
    noResults: "Sijainteja ei löytynyt.",
    quickSearch: "Maailmanlaajuinen haku",
    detailedSearch: "Tarkat kentät",
    detectLocation: "Käytä sijaintiani",
    detecting: "Tunnistetaan sijaintia...",
    city: "Kaupunki",
    state: "Maakunta",
    zip: "Postinumero",
    country: "Maa",
    placeholderCity: "esim. Helsinki",
    placeholderState: "esim. Uusimaa",
    placeholderZip: "esim. 00100",
    placeholderCountry: "esim. Suomi",
    setBtn: "Aseta sijainti",
    backBtn: "Takaisin ennusteeseen",
    clearBtn: "Tyhjennä",
    refreshTooltip: "Päivitä reaaliaikainen sää",
    liveBadge: "Live",
    hourlyForecast: "Tuntiennuste",
    dailyForecast: "Päiväennuste",
    byHour: "Tunneittain",
    byDay: "Päivittäin",
    now: "Nyt",
    today: "Tänään",
    high: "Y",
    low: "A",
    errInput: "Anna vähintään kaupunki tai postinumero.",
    errDetect: "Sijainnin tunnistus epäonnistui.",
    tooltipDetect: "Tunnista nykyinen sijainti",
    tooltipChange: "Vaihda sijaintia",
    clear: 'Selkeää',
    cloudy: 'Puolipilvistä',
    foggy: 'Sumuista',
    rainy: 'Sateista',
    snowy: 'Lumisadetta',
    thunderstorm: 'Ukkosta',
    sun: 'Su',
    mon: 'Ma',
    tue: 'Ti',
    wed: 'Ke',
    thu: 'To',
    fri: 'Pe',
    sat: 'La',
  },
  Hindi: {
    title: "मौसम",
    locationTitle: "मौसम का स्थान",
    searchPlaceholder: "शहर, पिन कोड या देश खोजें...",
    searching: "स्थान खोजे जा रहे हैं...",
    noResults: "कोई स्थान नहीं मिला।",
    quickSearch: "वैश्विक खोज",
    detailedSearch: "विस्तृत फ़ील्ड",
    detectLocation: "मेरा स्थान उपयोग करें",
    detecting: "स्थान का पता लगाया जा रहा है...",
    city: "शहर",
    state: "राज्य",
    zip: "पिन कोड",
    country: "देश",
    placeholderCity: "उदा. नई दिल्ली",
    placeholderState: "उदा. दिल्ली",
    placeholderZip: "उदा. 110001",
    placeholderCountry: "उदा. भारत",
    setBtn: "स्थान सेट करें",
    backBtn: "पूर्वानुमान पर वापस जाएं",
    clearBtn: "साफ़ करें",
    refreshTooltip: "लाइव मौसम रीफ़्रेश करें",
    liveBadge: "लाइव",
    hourlyForecast: "प्रति घंटा पूर्वानुमान",
    dailyForecast: "दैनिक पूर्वानुमान",
    byHour: "प्रति घंटा",
    byDay: "प्रति दिन",
    now: "अभी",
    today: "आज",
    high: "उच्च",
    low: "न्यून",
    errInput: "कृपया कम से कम एक शहर या पिन कोड दर्ज करें।",
    errDetect: "स्थान का पता नहीं लगाया जा सका।",
    tooltipDetect: "वर्तमान स्थान पहचानें",
    tooltipChange: "स्थान बदलें",
    clear: 'साफ़ मौसम',
    cloudy: 'आंशिक बादल',
    foggy: 'कोहरा',
    rainy: 'बारिश',
    snowy: 'बर्फबारी',
    thunderstorm: 'आंधी-तूफान',
    sun: 'रवि',
    mon: 'सोम',
    tue: 'मंगल',
    wed: 'बुध',
    thu: 'गुरु',
    fri: 'शुक्र',
    sat: 'शनि',
  },
  Norwegian: {
    title: "Vær",
    locationTitle: "Værlokasjon",
    searchPlaceholder: "Søk etter by, postnummer eller land...",
    searching: "Søker etter steder...",
    noResults: "Ingen steder funnet.",
    quickSearch: "Globalt søk",
    detailedSearch: "Detaljerte felt",
    detectLocation: "Bruk min posisjon",
    detecting: "Finner posisjon...",
    city: "By",
    state: "Fylke",
    zip: "Postnummer",
    country: "Land",
    placeholderCity: "f.eks. Oslo",
    placeholderState: "f.eks. Oslo",
    placeholderZip: "f.eks. 0150",
    placeholderCountry: "f.eks. Norge",
    setBtn: "Angi posisjon",
    backBtn: "Tilbake til varsel",
    clearBtn: "Tøm",
    refreshTooltip: "Oppdater live vær",
    liveBadge: "Live",
    hourlyForecast: "Timevarsel",
    dailyForecast: "Langtidsvarsel",
    byHour: "Per time",
    byDay: "Per dag",
    now: "Nå",
    today: "I dag",
    high: "H",
    low: "L",
    errInput: "Vennligst oppgi minst en by eller et postnummer.",
    errDetect: "Kunne ikke finne posisjon.",
    tooltipDetect: "Finn nåværende posisjon",
    tooltipChange: "Endre posisjon",
    clear: 'Klart',
    cloudy: 'Delvis skyet',
    foggy: 'Tåke',
    rainy: 'Regn',
    snowy: 'Snø',
    thunderstorm: 'Tordenvær',
    sun: 'Søn',
    mon: 'Man',
    tue: 'Tir',
    wed: 'Ons',
    thu: 'Tor',
    fri: 'Fre',
    sat: 'Lør',
  },
  Thai: {
    title: "สภาพอากาศ",
    locationTitle: "ตำแหน่งสภาพอากาศ",
    searchPlaceholder: "ค้นหาเมือง รหัสไปรษณีย์ หรือประเทศ...",
    searching: "กำลังค้นหาสถานที่...",
    noResults: "ไม่พบสถานที่",
    quickSearch: "ค้นหาทั่วโลก",
    detailedSearch: "กรอกรายละเอียด",
    detectLocation: "ใช้ตำแหน่งปัจจุบัน",
    detecting: "กำลังระบุตำแหน่ง...",
    city: "เมือง",
    state: "จังหวัด / รัฐ",
    zip: "รหัสไปรษณีย์",
    country: "ประเทศ",
    placeholderCity: "เช่น กรุงเทพมหานคร",
    placeholderState: "เช่น กทม.",
    placeholderZip: "เช่น 10110",
    placeholderCountry: "เช่น ประเทศไทย",
    setBtn: "ตั้งค่าตำแหน่ง",
    backBtn: "กลับไปที่พยากรณ์อากาศ",
    clearBtn: "ล้าง",
    refreshTooltip: "รีเฟรชสภาพอากาศสด",
    liveBadge: "สด",
    hourlyForecast: "พยากรณ์รายชั่วโมง",
    dailyForecast: "พยากรณ์รายวัน",
    byHour: "รายชั่วโมง",
    byDay: "รายวัน",
    now: "ตอนนี้",
    today: "วันนี้",
    high: "สูงสุด",
    low: "ต่ำสุด",
    errInput: "โปรดระบุอย่างน้อยหนึ่งเมืองหรือรหัสไปรษณีย์",
    errDetect: "ไม่สามารถระบุตำแหน่งได้",
    tooltipDetect: "ตรวจจับตำแหน่งปัจจุบัน",
    tooltipChange: "เปลี่ยนตำแหน่ง",
    clear: 'ท้องฟ้าแจ่มใส',
    cloudy: 'มีเมฆบางส่วน',
    foggy: 'มีหมอก',
    rainy: 'ฝนตก',
    snowy: 'หิมะตก',
    thunderstorm: 'พายุฝนฟ้าคะนอง',
    sun: 'อา.',
    mon: 'จ.',
    tue: 'อ.',
    wed: 'พ.',
    thu: 'พฤ.',
    fri: 'ศ.',
    sat: 'ส.',
  },
  Portuguese: {
    title: "Clima",
    locationTitle: "Localização do Clima",
    searchPlaceholder: "Pesquisar cidade, código postal ou país...",
    searching: "A procurar localizações...",
    noResults: "Nenhuma localização encontrada",
    quickSearch: "Pesquisa Global",
    detailedSearch: "Campos Detalhados",
    detectLocation: "Usar Minha Localização",
    detecting: "A detetar localização...",
    city: "Cidade",
    state: "Distrito / Região",
    zip: "Código Postal",
    country: "País",
    placeholderCity: "ex. Lisboa",
    placeholderState: "ex. Lisboa",
    placeholderZip: "ex. 1100-001",
    placeholderCountry: "ex. Portugal",
    setBtn: "Definir Localização",
    backBtn: "Voltar à Previsão",
    clearBtn: "Limpar",
    refreshTooltip: "Atualizar clima em tempo real",
    liveBadge: "Ao Vivo",
    hourlyForecast: "Previsão Horária",
    dailyForecast: "Previsão Diária",
    byHour: "Por Hora",
    byDay: "Por Dia",
    now: "Agora",
    today: "Hoje",
    high: "Máx",
    low: "Mín",
    errInput: "Por favor, insira pelo menos uma cidade ou código postal.",
    errDetect: "Não foi possível detetar a localização.",
    tooltipDetect: "Detetar localização atual",
    tooltipChange: "Alterar localização",
    clear: 'Céu limpo',
    cloudy: 'Parcialmente nublado',
    foggy: 'Nevoeiro',
    rainy: 'Chuva',
    snowy: 'Neve',
    thunderstorm: 'Trovoada',
    sun: 'Dom',
    mon: 'Seg',
    tue: 'Ter',
    wed: 'Qua',
    thu: 'Qui',
    fri: 'Sex',
    sat: 'Sáb',
  }
};

export default function WeatherWidget({ language = 'English' }: { language?: string }) {
  const dictionary = WEATHER_T[language] || WEATHER_T['English'];

  const [tempUnit] = useLocalStorage<'C' | 'F'>('GeekTabs-weather-temp-unit', 'F');
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

  // Detailed fields state
  const [city, setCity] = useState(weatherInputs?.city || 'Boston');
  const [stateName, setStateName] = useState(weatherInputs?.state || 'MA');
  const [country, setCountry] = useState(weatherInputs?.country || 'United States');
  const [zipcode, setZipcode] = useState(weatherInputs?.zipcode || '02115');

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
      setZipcode('02115');
    }
  }, [location, setLocation, setWeatherInputs]);

  // Smart search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoLocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDetailed, setShowDetailed] = useState(false);

  const [weather, setWeather] = useState<LiveWeatherData | null>(() => {
    try {
      const cached = localStorage.getItem('GeekTabs-cached-weather');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed.temp === 'number') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const searchTimeoutRef = useRef<any>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search when user types in smart search bar
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchGlobalLocations(searchQuery);
        setSearchResults(results);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Location search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Apply location and fetch live weather
  const applyLocationAndFetch = async (
    lat: number,
    lon: number,
    formattedAddr: string,
    cName: string,
    sName: string,
    coName: string,
    zCode: string
  ) => {
    setLoading(true);
    try {
      const liveData = await fetchLiveForecast(lat, lon, tempUnit, dictionary);
      setWeather(liveData);

      setCity(cName);
      setStateName(sName);
      setCountry(coName);
      setZipcode(zCode);

      const newInputs = {
        city: cName,
        state: sName,
        country: coName,
        zipcode: zCode,
        lat,
        lon
      };
      setWeatherInputs(newInputs);
      setLocation(formattedAddr);
      setIsEditing(false);
      setShowSuggestions(false);
      setSearchQuery('');

      try {
        localStorage.setItem(
          'GeekTabs-cached-weather',
          JSON.stringify({
            ...liveData,
            location: formattedAddr,
            inputs: newInputs
          })
        );
      } catch {
        // ignore
      }

      // Notify other tabs / settings tab of location update
      window.dispatchEvent(new CustomEvent('geektabs-weather-location-updated', {
        detail: { location: formattedAddr, inputs: newInputs }
      }));
    } catch (err) {
      console.error('Failed to fetch live weather:', err);
      alert(dictionary.errDetect || 'Could not retrieve live weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Select suggestion from dropdown
  const handleSelectLocation = (item: GeoLocationResult) => {
    applyLocationAndFetch(
      item.latitude,
      item.longitude,
      item.formattedAddress,
      item.name,
      item.admin1 || '',
      item.country || '',
      item.postcode || ''
    );
  };

  // Manual search submit (if user hits enter or clicks search button)
  const handleSmartSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchGlobalLocations(searchQuery);
      if (results.length > 0) {
        handleSelectLocation(results[0]);
      } else {
        alert(dictionary.noResults || 'No locations found for this query.');
      }
    } catch {
      alert(dictionary.errDetect);
    } finally {
      setIsSearching(false);
    }
  };

  // Submit Detailed Form (cleans conflicting residual fields)
  const handleDetailedSubmit = async () => {
    const cClean = city.trim();
    const sClean = stateName.trim();
    const coClean = country.trim();
    const zClean = zipcode.trim();

    if (!cClean && !zClean) {
      alert(dictionary.errInput);
      return;
    }

    setLoading(true);
    try {
      // Build search query prioritizing the user's specific inputs
      const queryCandidates: string[] = [];
      const full = [cClean, sClean, zClean, coClean].filter(Boolean).join(', ');
      if (full) queryCandidates.push(full);
      if (cClean && coClean) queryCandidates.push(`${cClean}, ${coClean}`);
      if (zClean && coClean) queryCandidates.push(`${zClean}, ${coClean}`);
      if (cClean && sClean) queryCandidates.push(`${cClean}, ${sClean}`);
      if (cClean) queryCandidates.push(cClean);
      if (zClean) queryCandidates.push(zClean);

      let found: GeoLocationResult | null = null;
      for (const q of queryCandidates) {
        const matches = await searchGlobalLocations(q);
        if (matches.length > 0) {
          // If country or state specified, find best matching result
          if (coClean || sClean) {
            const best = matches.find(m => {
              const cMatch = coClean ? (m.country.toLowerCase().includes(coClean.toLowerCase()) || m.countryCode?.toLowerCase() === coClean.toLowerCase()) : true;
              const sMatch = sClean ? (m.admin1?.toLowerCase().includes(sClean.toLowerCase())) : true;
              return cMatch && sMatch;
            }) || matches.find(m => {
              return coClean ? (m.country.toLowerCase().includes(coClean.toLowerCase()) || m.countryCode?.toLowerCase() === coClean.toLowerCase()) : true;
            });
            found = best || matches[0];
          } else {
            found = matches[0];
          }
          break;
        }
      }

      if (found) {
        await applyLocationAndFetch(
          found.latitude,
          found.longitude,
          found.formattedAddress,
          found.name,
          found.admin1 || sClean,
          found.country || coClean,
          found.postcode || zClean
        );
      } else {
        alert(dictionary.noResults || 'Could not find coordinates for this address.');
      }
    } catch (err) {
      console.error('Detailed search error:', err);
      alert(dictionary.errDetect);
    } finally {
      setLoading(false);
    }
  };

  // Auto-detect current location
  const handleAutoDetect = async () => {
    setLoading(true);
    try {
      const detected = await detectCurrentLocation();
      await applyLocationAndFetch(
        detected.latitude,
        detected.longitude,
        detected.formattedAddress,
        detected.name,
        detected.admin1 || '',
        detected.country || '',
        detected.postcode || ''
      );
    } catch (err) {
      console.warn('Auto-detect error:', err);
      alert(dictionary.errDetect);
    } finally {
      setLoading(false);
    }
  };

  // Refresh live weather data
  const handleRefresh = async () => {
    if (loading || isRefreshing) return;
    setIsRefreshing(true);
    try {
      const lat = weatherInputs?.lat || 42.3601;
      const lon = weatherInputs?.lon || -71.0589;
      const liveData = await fetchLiveForecast(lat, lon, tempUnit, dictionary);
      setWeather(liveData);
      try {
        localStorage.setItem(
          'GeekTabs-cached-weather',
          JSON.stringify({
            ...liveData,
            location,
            inputs: weatherInputs
          })
        );
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('Refresh weather failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial load and unit sync
  useEffect(() => {
    const lat = weatherInputs?.lat || 42.3601;
    const lon = weatherInputs?.lon || -71.0589;
    fetchLiveForecast(lat, lon, tempUnit, dictionary)
      .then(data => setWeather(data))
      .catch(e => console.warn('Live forecast init error:', e));
  }, [tempUnit]);

  // Listen to external location updates (e.g. from WeatherSettingsTab)
  useEffect(() => {
    const handleLocationUpdate = (e: any) => {
      if (e.detail?.inputs?.lat && e.detail?.inputs?.lon) {
        const inp = e.detail.inputs;
        if (e.detail.location) {
          setLocation(e.detail.location);
        }
        setWeatherInputs(inp);
        setCity(inp.city || '');
        setStateName(inp.state || '');
        setCountry(inp.country || '');
        setZipcode(inp.zipcode || '');
        fetchLiveForecast(inp.lat, inp.lon, tempUnit, dictionary)
          .then(data => setWeather(data))
          .catch(() => {});
      }
    };

    window.addEventListener('geektabs-weather-location-updated', handleLocationUpdate);
    return () => window.removeEventListener('geektabs-weather-location-updated', handleLocationUpdate);
  }, [tempUnit, dictionary, setLocation, setWeatherInputs]);

  const getConditionTranslation = (text: string): string => {
    switch (text) {
      case 'Clear':
      case 'Mainly Clear':
        return dictionary.clear;
      case 'Partly Cloudy':
      case 'Overcast':
        return dictionary.cloudy;
      case 'Foggy':
      case 'Depositing Rime Fog':
        return dictionary.foggy;
      case 'Rainy':
      case 'Light Drizzle':
      case 'Moderate Drizzle':
      case 'Dense Drizzle':
      case 'Slight Rain':
      case 'Moderate Rain':
      case 'Heavy Rain':
      case 'Slight Rain Showers':
      case 'Moderate Rain Showers':
      case 'Violent Rain Showers':
        return dictionary.rainy;
      case 'Snowy':
      case 'Slight Snow':
      case 'Moderate Snow':
      case 'Heavy Snow':
      case 'Snow Grains':
      case 'Slight Snow Showers':
      case 'Heavy Snow Showers':
        return dictionary.snowy;
      case 'Thunderstorm':
      case 'Thunderstorm with Slight Hail':
      case 'Thunderstorm with Heavy Hail':
        return dictionary.thunderstorm;
      default:
        return text;
    }
  };

  // Default placeholders for first render before API response
  const defaultHrDetails = Array.from({ length: 12 }).map((_, i) => {
    const hour = (new Date().getHours() + i) % 24;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const baseF = 65 + (i % 3 === 0 ? 4 : -2);
    const tempVal = tempUnit === 'C' ? Math.round(((baseF - 32) * 5) / 9) : baseF;
    return {
      time: `${displayHour} ${ampm}`,
      temp: tempVal,
      icon: i % 4 === 0 ? 'sun' : i % 4 === 2 ? 'partly-cloudy' : 'cloud'
    };
  });

  const defaultDayDetails = Array.from({ length: 7 }).map((_, i) => {
    const dayNamesKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayKey = dayNamesKeys[d.getDay()];
    const dayLabel = i === 0 ? dictionary.today || 'Today' : dictionary[dayKey] || dayKey;
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(-2)}`;
    const baseF = 68 + (i % 2 === 0 ? 3 : -3);
    const tempVal = tempUnit === 'C' ? Math.round(((baseF - 32) * 5) / 9) : baseF;
    return {
      time: dayLabel,
      date: dateStr,
      temp: tempVal,
      maxTemp: tempVal + (tempUnit === 'C' ? 3 : 5),
      minTemp: tempVal - (tempUnit === 'C' ? 4 : 7),
      icon: i % 3 === 0 ? 'sun' : i % 3 === 1 ? 'rain' : 'partly-cloudy'
    };
  });

  const displayLocation = React.useMemo(() => {
    const cName = (weatherInputs?.city || '').trim();
    const sRegion = (weatherInputs?.state || '').trim();
    const coName = (weatherInputs?.country || '').trim();

    if (cName || sRegion || coName) {
      const parts: string[] = [];
      if (cName) parts.push(cName);
      if (sRegion && sRegion.toLowerCase() !== cName.toLowerCase()) {
        parts.push(sRegion);
      }
      if (
        coName &&
        coName.toLowerCase() !== cName.toLowerCase() &&
        coName.toLowerCase() !== sRegion.toLowerCase()
      ) {
        parts.push(coName);
      }
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }

    let cleaned = location || '';
    const zip = (weatherInputs?.zipcode || '').trim();
    if (zip) {
      const escapedZip = zip.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      cleaned = cleaned.replace(new RegExp(`\\s*,?\\s*${escapedZip}(?=\\s*,|\\s*$)`, 'gi'), '');
    }
    cleaned = cleaned
      .replace(/,\s*\d{4,10}(?:-\d{4})?\s*(?=,|$)/g, '')
      .replace(/\s+\d{4,10}(?:-\d{4})?\s*(?=,|$)/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/,\s*,/g, ',')
      .replace(/^[\s,]+|[\s,]+$/g, '');
    return cleaned || location;
  }, [weatherInputs, location]);

  const renderWeatherIcon = (icon: string, text?: string, size = 20) => {
    const isPartlyCloudy =
      icon === 'partly-cloudy' || (icon === 'cloud' && Boolean(text && text.toLowerCase().includes('partly')));
    if (icon === 'sun') {
      return <Sun size={size} className="weather-icon-sun" strokeWidth={1.8} />;
    }
    if (icon === 'rain') {
      return <CloudRain size={size} className="weather-icon-accent" strokeWidth={1.8} />;
    }
    if (icon === 'snow') {
      return <Snowflake size={size} className="weather-icon-accent" strokeWidth={1.8} />;
    }
    if (isPartlyCloudy) {
      return <CloudSun size={size} className="weather-icon-accent" strokeWidth={1.8} />;
    }
    return <Cloud size={size} className="weather-icon-accent" strokeWidth={1.8} />;
  };

  const formatHourlyTime = (time: string, idx: number) => {
    if (idx === 0 && (time === 'Now' || time === dictionary.now)) {
      const h = new Date().getHours();
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayHour = h % 12 === 0 ? 12 : h % 12;
      return `${displayHour} ${ampm}`;
    }
    return time;
  };

  return (
    <div className="weather-huawei-style rounded-[2rem] sm:rounded-[2.25rem] p-5 sm:p-7 lg:p-8 h-full flex flex-col justify-center relative overflow-visible transition-all group">
      {isEditing ? (
        /* Location Setup View */
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-10 w-full">
          {/* Left Column: Title & Actions */}
          <div className="flex flex-col shrink-0 lg:max-w-[240px] w-full">
            <div className="w-fit">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                {dictionary.locationTitle || dictionary.title}
              </h2>
              <div className="w-full h-[3.5px] bg-[#c8102e] dark:bg-red-500 rounded-full mt-3 mb-4" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {dictionary.tooltipChange}
            </p>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setShowSuggestions(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#c8102e] dark:text-red-400 hover:underline font-extrabold mt-4 uppercase tracking-wider transition-colors cursor-pointer"
            >
              &larr; {dictionary.backBtn}
            </button>
          </div>

          {/* Right Column: Unified Smart Location Search & Detailed Options */}
          <div className="flex-1 min-w-0 weather-subcard rounded-2xl p-5 sm:p-6 space-y-4 relative">
            {/* Smart Search Bar (Weather.com-style Instant Geocoding) */}
            <div ref={searchContainerRef} className="relative">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                <span>{dictionary.quickSearch}</span>
                <span className="text-[10px] font-bold text-slate-400 lowercase">global weather network</span>
              </label>

              <form onSubmit={handleSmartSearchSubmit} className="relative flex items-center">
                <Search size={16} className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowSuggestions(true);
                  }}
                  placeholder={dictionary.searchPlaceholder}
                  className="w-full bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/15 rounded-xl pl-10 pr-24 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 text-base sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 shadow-inner"
                />

                <div className="absolute right-2 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        setShowSuggestions(false);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 dark:border-slate-200 shadow-sm rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSearching ? <Loader2 size={13} className="animate-spin text-slate-700" /> : dictionary.setBtn}
                  </button>
                </div>
              </form>

              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-slate-100 dark:divide-slate-800">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectLocation(item)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 flex items-start gap-2.5 transition-colors cursor-pointer group/item"
                    >
                      <MapPin size={15} className="text-[#c8102e] dark:text-red-400 shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {[item.admin1, item.postcode, item.country].filter(Boolean).join(', ')}
                        </p>
                      </div>
                      <ChevronRight size={13} className="text-slate-400 group-hover/item:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions: Use Current Location & Toggle Detailed Fields */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={handleAutoDetect}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                title={dictionary.tooltipDetect}
              >
                {loading ? (
                  <Loader2 size={13} className="animate-spin text-[#c8102e]" />
                ) : (
                  <Navigation size={13} className="text-[#c8102e] dark:text-red-400" />
                )}
                <span>{dictionary.detectLocation}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDetailed(!showDetailed)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <SlidersHorizontal size={12} />
                <span>{dictionary.detailedSearch}</span>
              </button>
            </div>

            {/* Expandable Detailed Fields */}
            {showDetailed && (
              <div className="pt-2 space-y-3 bg-slate-50/70 dark:bg-black/20 p-3.5 rounded-xl border border-slate-200/70 dark:border-white/5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    {dictionary.city}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={dictionary.placeholderCity}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 sm:py-1.5 text-slate-900 dark:text-white placeholder-slate-400 text-base sm:text-xs focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      {dictionary.state}
                    </label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder={dictionary.placeholderState}
                      className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 sm:py-1.5 text-slate-900 dark:text-white placeholder-slate-400 text-base sm:text-xs focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      {dictionary.zip}
                    </label>
                    <input
                      type="text"
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                      placeholder={dictionary.placeholderZip}
                      className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 sm:py-1.5 text-slate-900 dark:text-white placeholder-slate-400 text-base sm:text-xs focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    {dictionary.country}
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder={dictionary.placeholderCountry}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 sm:py-1.5 text-slate-900 dark:text-white placeholder-slate-400 text-base sm:text-xs focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDetailedSubmit}
                    disabled={loading}
                    className="flex-1 py-2 bg-[#c8102e] hover:bg-[#b00e28] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {loading ? <Loader2 size={13} className="animate-spin mx-auto" /> : dictionary.setBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCity('');
                      setStateName('');
                      setCountry('');
                      setZipcode('');
                    }}
                    className="px-3 py-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold"
                  >
                    {dictionary.clearBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Normal Live Weather View */
        <div className="flex flex-col w-full">
          {/* Top Header Row: Title + Refresh on Left, By Hour / By Day Switch on Right */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3.5 sm:mb-4">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight leading-none truncate">
                {dictionary.title}
              </h2>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading || isRefreshing}
                title={dictionary.refreshTooltip}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <RefreshCw
                  size={15}
                  className={`${isRefreshing ? 'animate-spin' : 'opacity-85 hover:opacity-100'}`}
                />
              </button>
            </div>

            <div
              role="group"
              aria-label="Forecast interval switch"
              className="inline-flex items-center p-0.5 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 shrink-0"
            >
              <button
                type="button"
                onClick={() => setForecastMode('hr')}
                aria-pressed={forecastMode === 'hr'}
                title={dictionary.hourlyForecast}
                className={`px-2 sm:px-2.5 py-1 rounded-[10px] text-[11px] sm:text-xs font-bold leading-none transition-all cursor-pointer select-none whitespace-nowrap ${
                  forecastMode === 'hr'
                    ? 'bg-indigo-500 text-white shadow-xs'
                    : 'opacity-70 hover:opacity-100 bg-transparent'
                }`}
              >
                {dictionary.byHour}
              </button>
              <button
                type="button"
                onClick={() => setForecastMode('day')}
                aria-pressed={forecastMode === 'day'}
                title={dictionary.dailyForecast}
                className={`px-2 sm:px-2.5 py-1 rounded-[10px] text-[11px] sm:text-xs font-bold leading-none transition-all cursor-pointer select-none whitespace-nowrap ${
                  forecastMode === 'day'
                    ? 'bg-indigo-500 text-white shadow-xs'
                    : 'opacity-70 hover:opacity-100 bg-transparent'
                }`}
              >
                {dictionary.byDay}
              </button>
            </div>
          </div>

          {/* Middle Section: Current Weather Icon + Temp / (Condition & H) / (Address & L) */}
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="flex items-center justify-center shrink-0">
              {renderWeatherIcon(weather?.icon || 'partly-cloudy', weather?.text || 'Partly Cloudy', 44)}
            </div>

            <div className="grid grid-cols-[auto_auto] items-baseline gap-x-8 sm:gap-x-14 md:gap-x-20 min-w-0">
              {/* Row 1: Temperature */}
              <div className="col-span-2 flex items-start gap-0.5 leading-none">
                <span className="text-2xl sm:text-[28px] font-bold tracking-tight leading-none tabular-nums">
                  {loading ? '--' : weather?.temp}
                </span>
                <span className="text-xs sm:text-sm font-bold leading-none mt-0.5 opacity-90">
                  °{tempUnit}
                </span>
              </div>

              {/* Row 2: Weather condition line + H degree */}
              <p className="text-xs sm:text-sm font-normal opacity-80 leading-snug mt-1">
                {getConditionTranslation(weather?.text || 'Partly Cloudy')}
              </p>
              {weather?.high !== undefined ? (
                <span className="text-xs sm:text-[13px] font-medium opacity-65 leading-snug tabular-nums whitespace-nowrap mt-1">
                  {dictionary.high}: {weather?.high}°
                </span>
              ) : (
                <span />
              )}

              {/* Row 3: Address line (without zip/post code) + L degree */}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                title={dictionary.tooltipChange}
                className="inline-flex items-center gap-1 text-left text-xs sm:text-[13px] font-normal opacity-60 hover:opacity-100 transition-opacity cursor-pointer mt-0.5 leading-snug bg-transparent border-0 p-0 min-w-0"
              >
                <span className="weather-location-text break-words">{displayLocation}</span>
              </button>
              {weather?.low !== undefined ? (
                <span className="text-xs sm:text-[13px] font-medium opacity-65 leading-snug tabular-nums whitespace-nowrap mt-0.5">
                  {dictionary.low}: {weather?.low}°
                </span>
              ) : (
                <span />
              )}
            </div>
          </div>

          {/* Horizontal Divider */}
          <div className="w-full border-t border-current opacity-15 my-4 sm:my-5" />

          {/* Bottom Section: 12-Hour Horizontal Forecast Strip (or 7-Day Daily Mode) */}
          <div className="w-full h-[270px] sm:h-[176px] lg:h-[82px]">
            {forecastMode === 'day' ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-y-3 gap-x-2 w-full h-full content-start">
                {(weather?.daily || defaultDayDetails).slice(0, 7).map((dayItem, idx) => (
                  <div
                    key={idx}
                    className="h-[82px] flex flex-col items-center justify-center gap-1 py-1 text-center select-text"
                  >
                    <span className="weather-card-item-text text-[11px] sm:text-xs font-medium opacity-65 whitespace-nowrap leading-none">
                      {dayItem.time}
                    </span>
                    {dayItem.date && (
                      <span className="weather-card-item-text text-[10px] opacity-50 whitespace-nowrap leading-none">
                        {dayItem.date}
                      </span>
                    )}
                    <div className="flex items-center justify-center my-0.5">
                      {renderWeatherIcon(dayItem.icon, undefined, 20)}
                    </div>
                    <div className="flex items-baseline gap-1 leading-none tabular-nums">
                      <span className="weather-card-item-text text-xs sm:text-sm font-bold">
                        {dayItem.maxTemp !== undefined ? dayItem.maxTemp : dayItem.temp}°
                      </span>
                      {dayItem.minTemp !== undefined && (
                        <span className="weather-card-item-text text-[11px] font-medium opacity-60">
                          {dayItem.minTemp}°
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-y-3 gap-x-1 sm:gap-x-2 w-full h-full content-start">
                {(weather?.hourly || defaultHrDetails).slice(0, 12).map((hr, idx) => (
                  <div
                    key={idx}
                    className="h-[82px] flex flex-col items-center justify-center gap-2 py-1 text-center select-text"
                  >
                    <span className="weather-card-item-text text-[11px] sm:text-xs font-medium opacity-60 whitespace-nowrap leading-none">
                      {formatHourlyTime(hr.time, idx)}
                    </span>
                    <div className="flex items-center justify-center">
                      {renderWeatherIcon(hr.icon, undefined, 20)}
                    </div>
                    <span className="weather-card-item-text text-xs sm:text-sm font-bold leading-none tabular-nums">
                      {hr.temp}°
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
