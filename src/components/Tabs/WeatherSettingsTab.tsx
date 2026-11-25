import React, { useState, useEffect, useRef } from 'react';
import { CloudSun, Thermometer, Calendar, Clock, Check, Sparkles, MapPin, Search, Navigation, Loader2, X, ChevronRight } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { searchGlobalLocations, detectCurrentLocation, GeoLocationResult } from '../../services/weatherService';

export interface WeatherSettingsTabProps {
  language?: string;
}

const WEATHER_SETTINGS_T: Record<string, Record<string, string>> = {
  English: {
    title: 'Weather Setting',
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
  'Chinese Traditional': {
    title: '天氣設定',
    subtitle: '設定天氣小工具的溫度單位與預報顯示模式。',
    unitTitle: '溫度單位',
    unitDesc: '選擇攝氏 (°C) 或華氏 (°F) 來顯示目前氣溫與預報。',
    celsius: '攝氏 (°C)',
    celsiusDesc: '全球公制標準單位',
    fahrenheit: '華氏 (°F)',
    fahrenheitDesc: '美國等地區常用英制單位',
    forecastModeTitle: '天氣預報顯示模式',
    forecastModeDesc: '選擇天氣卡片按「逐小時」或按「天」顯示天氣預報。',
    hourly: '按小時預報 (Hourly)',
    hourlyDesc: '顯示未來 12 小時的天氣狀況與逐時氣溫',
    daily: '按天預報 (Daily)',
    dailyDesc: '顯示未來 7 天的每日天氣狀況與最高/最低氣溫',
    previewTitle: '設定預覽',
    previewDesc: '所有修改已自動儲存，並即時同步到首頁天氣卡片上。'
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
  },
  Dutch: {
    title: 'Weerinstellingen',
    subtitle: 'Configureer temperatuureenheden en het weergave-interval voor de verwachting.',
    unitTitle: 'Temperatuureenheid',
    unitDesc: 'Selecteer Celsius (°C) of Fahrenheit (°F) voor het actuele weer en verwachtingen.',
    celsius: 'Celsius (°C)',
    celsiusDesc: 'Metrische standaard wereldwijd gebruikt',
    fahrenheit: 'Fahrenheit (°F)',
    fahrenheitDesc: 'Imperiale standaard veelgebruikt in de VS',
    forecastModeTitle: 'Verwachtingsweergave',
    forecastModeDesc: 'Kies of het verwachtingsraster per uur of per dag wordt weergegeven.',
    hourly: 'Uurverwachting',
    hourlyDesc: 'Toont de komende 12 uur met weersomstandigheden en temperaturen',
    daily: 'Dagverwachting',
    dailyDesc: 'Toont de komende 7 dagen met hoogste en laagste temperaturen',
    previewTitle: 'Live Voorkeursvoorbeeld',
    previewDesc: 'Wijzigingen worden automatisch opgeslagen en direct weergegeven op de startpagina.'
  },
  Swedish: {
    title: 'Väderinställningar',
    subtitle: 'Konfigurera temperaturenheter och visningsläge för prognoser.',
    unitTitle: 'Temperaturenhet',
    unitDesc: 'Välj Celsius (°C) eller Fahrenheit (°F) för aktuellt väder och prognoser.',
    celsius: 'Celsius (°C)',
    celsiusDesc: 'Metrisk standard som används globalt',
    fahrenheit: 'Fahrenheit (°F)',
    fahrenheitDesc: 'Imperial standard vanlig i USA',
    forecastModeTitle: 'Visningsläge för Prognos',
    forecastModeDesc: 'Välj om prognosen ska visas timvis eller dagligen.',
    hourly: 'Timprognos',
    hourlyDesc: 'Visar de kommande 12 timmarna med förväntat väder och temperatur',
    daily: 'Dygnsprognos',
    dailyDesc: 'Visar de kommande 7 dagarna med högsta och lägsta temperatur',
    previewTitle: 'Förhandsvisning',
    previewDesc: 'Ändringar sparas automatiskt och visas omedelbart på startsidan.'
  },
  Finnish: {
    title: 'Sääasetukset',
    subtitle: 'Määritä lämpötilayksiköt ja ennusteen näyttöväli.',
    unitTitle: 'Lämpötilayksikkö',
    unitDesc: 'Valitse Celsius (°C) tai Fahrenheit (°F) säätietoihin ja ennusteisiin.',
    celsius: 'Celsius (°C)',
    celsiusDesc: 'Maailmanlaajuinen metrinen standardi',
    fahrenheit: 'Fahrenheit (°F)',
    fahrenheitDesc: 'Yhdysvalloissa yleisesti käytetty yksikkö',
    forecastModeTitle: 'Ennusteen Näyttötila',
    forecastModeDesc: 'Valitse näytetäänkö ennuste tunneittain vai päivittäin.',
    hourly: 'Tuntiennuste',
    hourlyDesc: 'Näyttää seuraavat 12 tuntia sääolosuhteineen ja lämpötiloineen',
    daily: 'Päiväennuste',
    dailyDesc: 'Näyttää seuraavat 7 päivää päivän ylimmillä ja alimmilla lämpötiloilla',
    previewTitle: 'Asetusten Esikatselu',
    previewDesc: 'Muutokset tallennetaan automaattisesti ja päivittyvät heti etusivulle.'
  },
  Hindi: {
    title: 'मौसम सेटिंग्स',
    subtitle: 'तापमान इकाई और पूर्वानुमान प्रदर्शन अंतराल कॉन्फ़िगर करें।',
    unitTitle: 'तापमान इकाई',
    unitDesc: 'वर्तमान मौसम और पूर्वानुमान के लिए सेल्सियस (°C) या फ़ारेनहाइट (°F) चुनें।',
    celsius: 'सेल्सियस (°C)',
    celsiusDesc: 'दुनिया भर में उपयोग किया जाने वाला मीट्रिक मानक',
    fahrenheit: 'फ़ारेनहाइट (°F)',
    fahrenheitDesc: 'अमेरिका में आमतौर पर उपयोग किया जाने वाला मानक',
    forecastModeTitle: 'पूर्वानुमान प्रदर्शन मोड',
    forecastModeDesc: 'चुनें कि पूर्वानुमान प्रति घंटा दिखाया जाए या दैनिक।',
    hourly: 'प्रति घंटा पूर्वानुमान',
    hourlyDesc: 'अपेक्षित स्थिति और तापमान के साथ अगले 12 घंटे दिखाता है',
    daily: 'दैनिक पूर्वानुमान',
    dailyDesc: 'दैनिक उच्च और निम्न तापमान के साथ अगले 7 दिन दिखाता है',
    previewTitle: 'लाइव पूर्वावलोकन',
    previewDesc: 'बदलाव स्वतः सहेजे जाते हैं और होम मौसम विजेट पर तुरंत दिखते हैं।'
  },
  Norwegian: {
    title: 'Værinnstillinger',
    subtitle: 'Konfigurer temperaturenheter og visningsintervall for værvarsel.',
    unitTitle: 'Temperaturenhet',
    unitDesc: 'Velg Celsius (°C) eller Fahrenheit (°F) for nåværende vær og varsler.',
    celsius: 'Celsius (°C)',
    celsiusDesc: 'Metrisk standard brukt over hele verden',
    fahrenheit: 'Fahrenheit (°F)',
    fahrenheitDesc: 'Imperial standard vanlig brukt i USA',
    forecastModeTitle: 'Visningsmodus for Varsel',
    forecastModeDesc: 'Velg om varselet skal vises time for time eller dag for dag.',
    hourly: 'Timevarsel',
    hourlyDesc: 'Viser de neste 12 timene med forventet vær og temperatur',
    daily: 'Langtidsvarsel',
    dailyDesc: 'Viser de neste 7 dagene med høyeste og laveste temperatur',
    previewTitle: 'Forhåndsvisning',
    previewDesc: 'Endringer lagres automatisk og vises umiddelbart på startsiden.'
  },
  Thai: {
    title: 'ตั้งค่าสภาพอากาศ',
    subtitle: 'กำหนดหน่วยอุณหภูมิและรูปแบบการแสดงพยากรณ์อากาศ',
    unitTitle: 'หน่วยอุณหภูมิ',
    unitDesc: 'เลือกองศาเซลเซียส (°C) หรือฟาเรนไฮต์ (°F) สำหรับสภาพอากาศและพยากรณ์',
    celsius: 'เซลเซียส (°C)',
    celsiusDesc: 'มาตรฐานสากลที่ใช้ทั่วโลก',
    fahrenheit: 'ฟาเรนไฮต์ (°F)',
    fahrenheitDesc: 'มาตรฐานที่นิยมใช้ในสหรัฐอเมริกา',
    forecastModeTitle: 'โหมดแสดงพยากรณ์อากาศ',
    forecastModeDesc: 'เลือกว่าต้องการแสดงพยากรณ์อากาศแบบรายชั่วโมงหรือรายวัน',
    hourly: 'พยากรณ์รายชั่วโมง',
    hourlyDesc: 'แสดงสภาพอากาศและอุณหภูมิล่วงหน้า 12 ชั่วโมง',
    daily: 'พยากรณ์รายวัน',
    dailyDesc: 'แสดงสภาพอากาศและอุณหภูมิสูงสุด/ต่ำสุดล่วงหน้า 7 วัน',
    previewTitle: 'ตัวอย่างการตั้งค่า',
    previewDesc: 'การเปลี่ยนแปลงจะถูกบันทึกอัตโนมัติและแสดงผลบนวิดเจ็ตหน้าแรกทันที'
  },
  Portuguese: {
    title: 'Definições de Meteorologia',
    subtitle: 'CONFIGURAR UNIDADE DE TEMPERATURA E INTERVALO DE PREVISÃO',
    unitTitle: 'Unidade de Temperatura',
    unitDesc: 'Escolha entre Celsius (°C) ou Fahrenheit (°F) para a meteorologia atual e previsão.',
    celsius: 'Celsius (°C)',
    celsiusDesc: 'Unidade métrica padrão utilizada na maioria dos países',
    fahrenheit: 'Fahrenheit (°F)',
    fahrenheitDesc: 'Unidade padrão utilizada sobretudo nos Estados Unidos',
    forecastModeTitle: 'Modo de Previsão',
    forecastModeDesc: 'Escolha se pretende ver os detalhes da previsão por hora ou por dia.',
    hourly: 'Previsão por Hora',
    hourlyDesc: 'Mostra as próximas 12 horas com detalhes de estado do tempo e temperatura',
    daily: 'Previsão por Dia',
    dailyDesc: 'Mostra os próximos 7 dias com temperaturas máximas e mínimas diárias',
    previewTitle: 'Pré-visualização em Direto',
    previewDesc: 'As alterações são guardadas automaticamente e aplicadas ao widget na página inicial.'
  },
  Vietnamese: {
    title: 'Cài đặt thời tiết',
    subtitle: 'CẤU HÌNH ĐƠN VỊ NHIỆT ĐỘ VÀ CHU KỲ DỰ BÁO',
    unitTitle: 'Đơn vị nhiệt độ',
    unitDesc: 'Chọn giữa độ C (°C) hoặc độ F (°F) cho thời tiết hiện tại và dự báo.',
    celsius: 'Độ C (°C)',
    celsiusDesc: 'Đơn vị mét tiêu chuẩn được dùng ở hầu hết các quốc gia',
    fahrenheit: 'Độ F (°F)',
    fahrenheitDesc: 'Đơn vị tiêu chuẩn chủ yếu dùng tại Hoa Kỳ',
    forecastModeTitle: 'Chế độ hiển thị dự báo',
    forecastModeDesc: 'Chọn hiển thị chi tiết dự báo theo giờ hoặc theo ngày.',
    hourly: 'Dự báo theo giờ',
    hourlyDesc: 'Hiển thị 12 giờ tiếp theo với trạng thái và nhiệt độ',
    daily: 'Dự báo theo ngày',
    dailyDesc: 'Hiển thị 7 ngày tiếp theo với nhiệt độ cao nhất và thấp nhất mỗi ngày',
    previewTitle: 'Xem trước trực tiếp',
    previewDesc: 'Các thay đổi được lưu tự động và áp dụng ngay cho tiện ích trên trang chủ.'
  },
  Polish: {
    title: 'Ustawienia pogody',
    subtitle: 'KONFIGURACJA JEDNOSTEK TEMPERATURY I ZAKRESU PROGNOZY',
    unitTitle: 'Jednostka temperatury',
    unitDesc: 'Wybierz Celsjusza (°C) lub Fahrenheita (°F) dla bieżącej pogody i prognozy.',
    celsius: 'Celsjusz (°C)',
    celsiusDesc: 'Standardowa jednostka metryczna używana w większości krajów',
    fahrenheit: 'Fahrenheit (°F)',
    fahrenheitDesc: 'Standardowa jednostka używana głównie w Stanach Zjednoczonych',
    forecastModeTitle: 'Tryb wyświetlania prognozy',
    forecastModeDesc: 'Wybierz wyświetlanie prognozy w ujęciu godzinowym lub dziennym.',
    hourly: 'Prognoza godzinowa',
    hourlyDesc: 'Pokazuje następne 12 godzin ze szczegółami pogody i temperatury',
    daily: 'Prognoza dzienna',
    dailyDesc: 'Pokazuje następne 7 dni z dziennymi temperaturami maksymalnymi i minimalnymi',
    previewTitle: 'Podgląd ustawień na żywo',
    previewDesc: 'Zmiany są zapisywane automatycznie i natychmiast stosowane w widżecie na stronie głównej.'
  },
  Danish: {
    title: 'Vejrindstillinger',
    subtitle: 'KONFIGURER TEMPERATURENHED OG PROGNOSEINTERVAL',
    unitTitle: 'Temperaturenhed',
    unitDesc: 'Vælg mellem Celsius (°C) eller Fahrenheit (°F) til aktuelt vejr og vejrudsigt.',
    celsius: 'Celsius (°C)',
    celsiusDesc: 'Standard metrisk enhed brugt i de fleste lande',
    fahrenheit: 'Fahrenheit (°F)',
    fahrenheitDesc: 'Standardenhed brugt primært i USA',
    forecastModeTitle: 'Visning af vejrudsigt',
    forecastModeDesc: 'Vælg om du vil se detaljer for vejrudsigten pr. time eller pr. dag.',
    hourly: 'Timeudsigt',
    hourlyDesc: 'Viser de næste 12 timer med vejrtilstand og temperatur',
    daily: 'Dagsudsigt',
    dailyDesc: 'Viser de næste 7 dage med daglige maksimums- og minimumstemperaturer',
    previewTitle: 'Live-forhåndsvisning',
    previewDesc: 'Ændringer gemmes automatisk og anvendes på startsides-widgetten.'
  },
  Turkish: {
    title: 'Hava Durumu Ayarları',
    subtitle: 'SICAKLIK BİRİMİNİ VE TAHMİN ARALIĞINI YAPILANDIRIN',
    unitTitle: 'Sıcaklık Birimi',
    unitDesc: 'Mevcut hava durumu ve tahmin için Santigrat (°C) veya Fahrenhayt (°F) seçin.',
    celsius: 'Santigrat (°C)',
    celsiusDesc: 'Çoğu ülkede kullanılan standart metrik birim',
    fahrenheit: 'Fahrenhayt (°F)',
    fahrenheitDesc: 'Esas olarak Amerika Birleşik Devletleri’nde kullanılan standart birim',
    forecastModeTitle: 'Tahmin Görünüm Modu',
    forecastModeDesc: 'Tahmin ayrıntılarını saatlik mi yoksa günlük mü göreceğinizi seçin.',
    hourly: 'Saatlik Tahmin',
    hourlyDesc: 'Önümüzdeki 12 saati hava durumu ve sıcaklıkla gösterir',
    daily: 'Günlük Tahmin',
    dailyDesc: 'Önümüzdeki 7 günü günlük en yüksek ve en düşük sıcaklıklarla gösterir',
    previewTitle: 'Canlı Ayar Önizlemesi',
    previewDesc: 'Değişiklikler otomatik olarak kaydedilir ve ana sayfa bileşenine uygulanır.'
  },
  Greek: {
    title: 'Ρυθμίσεις Καιρού',
    subtitle: 'ΡΥΘΜΙΣΗ ΜΟΝΑΔΑΣ ΘΕΡΜΟΚΡΑΣΙΑΣ & ΕΥΡΟΥΣ ΠΡΟΓΝΩΣΗΣ',
    unitTitle: 'Μονάδα Θερμοκρασίας',
    unitDesc: 'Επιλέξτε Κελσίου (°C) ή Φαρενάιτ (°F) για τον τρέχοντα καιρό και την πρόγνωση.',
    celsius: 'Κελσίου (°C)',
    celsiusDesc: 'Τυπική μετρική μονάδα που χρησιμοποιείται στις περισσότερες χώρες',
    fahrenheit: 'Φαρενάιτ (°F)',
    fahrenheitDesc: 'Τυπική μονάδα που χρησιμοποιείται κυρίως στις Ηνωμένες Πολιτείες',
    forecastModeTitle: 'Λειτουργία Εμφάνισης Πρόγνωσης',
    forecastModeDesc: 'Επιλέξτε αν θέλετε να βλέπετε λεπτομέρειες πρόγνωσης ανά ώρα ή ανά ημέρα.',
    hourly: 'Ωριαία Πρόγνωση',
    hourlyDesc: 'Εμφανίζει τις επόμενες 12 ώρες με συνθήκες και θερμοκρασία',
    daily: 'Ημερήσια Πρόγνωση',
    dailyDesc: 'Εμφανίζει τις επόμενες 7 ημέρες με ημερήσιες μέγιστες και ελάχιστες θερμοκρασίες',
    previewTitle: 'Ζωντανή Προεπισκόπηση Ρυθμίσεων',
    previewDesc: 'Οι αλλαγές αποθηκεύονται αυτόματα και εφαρμόζονται στο widget της αρχικής σελίδας.'
  },
  Belgum: {
    title: 'Weerinstellingen',
    subtitle: 'TEMPERATUUREENHEID & VERWACHTINGSWEERGAVE',
    unitTitle: 'Temperatuureenheid',
    unitDesc: 'Kies Celsius (°C) of Fahrenheit (°F) voor het actuele weer en de weersverwachting.',
    celsius: 'Celsius (°C)',
    celsiusDesc: 'Standaard metrische eenheid in België en de meeste landen',
    fahrenheit: 'Fahrenheit (°F)',
    fahrenheitDesc: 'Standaardeenheid die vooral in de Verenigde Staten wordt gebruikt',
    forecastModeTitle: 'Weergave van de verwachting',
    forecastModeDesc: 'Kies of u weersdetails per uur of per dag wilt bekijken.',
    hourly: 'Per uur',
    hourlyDesc: 'Toont de komende 12 uur met weersomstandigheden en temperatuur',
    daily: 'Dagelijkse verwachting',
    dailyDesc: 'Toont de komende 7 dagen met minimum- en maximumtemperaturen',
    previewTitle: 'Live instellingsvoorbeeld',
    previewDesc: 'Wijzigingen worden automatisch bewaard en meteen toegepast op de startpagina.'
  }
};

const WEATHER_SETTINGS_EXTRA_T: Record<string, {
  weatherLocation: string;
  weatherLocationDesc: string;
  currentLocation: string;
  detectTitle: string;
  autoDetect: string;
  close: string;
  change: string;
  searchPlaceholder: string;
  searching: string;
  detectError: string;
  unitLabel: string;
  viewLabel: string;
  hourlyShort: string;
  dailyShort: string;
}> = {
  English: {
    weatherLocation: 'Weather Location',
    weatherLocationDesc: 'Configure your global city, region, or postal code to accurately fetch live weather data for the home page.',
    currentLocation: 'Current Location',
    detectTitle: 'Detect Current Location',
    autoDetect: 'Auto-Detect',
    close: 'Close',
    change: 'Change',
    searchPlaceholder: 'Search city, postal code, or country (e.g. Miami, Paris, Tokyo, 90210)...',
    searching: 'Searching global weather locations...',
    detectError: 'Could not detect location. Please check your browser permissions.',
    unitLabel: 'Unit',
    viewLabel: 'View',
    hourlyShort: 'Hourly (12h)',
    dailyShort: 'Daily (7d)',
  },
  Chinese: {
    weatherLocation: '天气城市位置',
    weatherLocationDesc: '设置全球城市、地区或邮政编码，为首页准确获取实时天气数据。',
    currentLocation: '当前位置',
    detectTitle: '检测当前位置',
    autoDetect: '自动定位',
    close: '关闭',
    change: '更改',
    searchPlaceholder: '搜索城市、邮编或国家（例如：北京、上海、Tokyo、90210）...',
    searching: '正在搜索全球天气位置...',
    detectError: '无法检测当前位置，请检查浏览器定位权限。',
    unitLabel: '单位',
    viewLabel: '视图',
    hourlyShort: '逐小时 (12h)',
    dailyShort: '按天 (7d)',
  },
  'Chinese Traditional': {
    weatherLocation: '天氣城市位置',
    weatherLocationDesc: '設定全球城市、地區或郵遞區號，為首頁準確取得即時天氣資料。',
    currentLocation: '目前位置',
    detectTitle: '偵測目前位置',
    autoDetect: '自動定位',
    close: '關閉',
    change: '變更',
    searchPlaceholder: '搜尋城市、郵遞區號或國家（例如：台北、東京、90210）...',
    searching: '正在搜尋全球天氣位置...',
    detectError: '無法偵測目前位置，請檢查瀏覽器定位權限。',
    unitLabel: '單位',
    viewLabel: '檢視',
    hourlyShort: '逐小時 (12h)',
    dailyShort: '按天 (7d)',
  },
  Spanish: {
    weatherLocation: 'Ubicación del Clima',
    weatherLocationDesc: 'Configura tu ciudad, región o código postal global para obtener datos meteorológicos precisos en la página de inicio.',
    currentLocation: 'Ubicación Actual',
    detectTitle: 'Detectar Ubicación Actual',
    autoDetect: 'Detección automática',
    close: 'Cerrar',
    change: 'Cambiar',
    searchPlaceholder: 'Buscar ciudad, código postal o país (ej. Madrid, París, Tokio, 90210)...',
    searching: 'Buscando ubicaciones meteorológicas globales...',
    detectError: 'No se pudo detectar la ubicación. Revisa los permisos del navegador.',
    unitLabel: 'Unidad',
    viewLabel: 'Vista',
    hourlyShort: 'Por hora (12h)',
    dailyShort: 'Diario (7d)',
  },
  French: {
    weatherLocation: 'Localisation Météo',
    weatherLocationDesc: 'Configurez votre ville, région ou code postal dans le monde pour afficher la météo en direct sur la page d’accueil.',
    currentLocation: 'Position Actuelle',
    detectTitle: 'Détecter la Position Actuelle',
    autoDetect: 'Détection auto',
    close: 'Fermer',
    change: 'Modifier',
    searchPlaceholder: 'Rechercher une ville, code postal ou pays (ex. Paris, Tokyo, 90210)...',
    searching: 'Recherche de lieux météo dans le monde...',
    detectError: 'Impossible de détecter la position. Veuillez vérifier les autorisations du navigateur.',
    unitLabel: 'Unité',
    viewLabel: 'Vue',
    hourlyShort: 'Horaire (12h)',
    dailyShort: 'Quotidien (7j)',
  },
  German: {
    weatherLocation: 'Wetterstandort',
    weatherLocationDesc: 'Legen Sie Stadt, Region oder Postleitzahl weltweit fest, um genaue Live-Wetterdaten für die Startseite abzurufen.',
    currentLocation: 'Aktueller Standort',
    detectTitle: 'Aktuellen Standort ermitteln',
    autoDetect: 'Automatisch erkennen',
    close: 'Schließen',
    change: 'Ändern',
    searchPlaceholder: 'Stadt, Postleitzahl oder Land suchen (z. B. Berlin, Paris, Tokio, 90210)...',
    searching: 'Globale Wetterstandorte werden gesucht...',
    detectError: 'Standort konnte nicht ermittelt werden. Bitte prüfen Sie die Browserberechtigungen.',
    unitLabel: 'Einheit',
    viewLabel: 'Ansicht',
    hourlyShort: 'Stündlich (12h)',
    dailyShort: 'Täglich (7T)',
  },
  Japanese: {
    weatherLocation: '天気の場所',
    weatherLocationDesc: '世界中の都市、地域、郵便番号を設定して、ホーム画面に正確なリアルタイム天気を表示します。',
    currentLocation: '現在の場所',
    detectTitle: '現在地を検出',
    autoDetect: '自動検出',
    close: '閉じる',
    change: '変更',
    searchPlaceholder: '都市名、郵便番号、国名を検索（例：東京、パリ、90210）...',
    searching: '世界中の天気エリアを検索中...',
    detectError: '現在地を検出できませんでした。ブラウザの位置情報権限をご確認ください。',
    unitLabel: '単位',
    viewLabel: '表示',
    hourlyShort: '時間ごと (12h)',
    dailyShort: '日ごと (7d)',
  },
  Korean: {
    weatherLocation: '날씨 위치',
    weatherLocationDesc: '홈 화면에 정확한 실시간 날씨 정보를 표시할 전 세계 도시, 지역 또는 우편번호를 설정하세요.',
    currentLocation: '현재 위치',
    detectTitle: '현재 위치 감지',
    autoDetect: '자동 감지',
    close: '닫기',
    change: '변경',
    searchPlaceholder: '도시, 우편번호 또는 국가 검색 (예: 서울, 파리, 도쿄, 90210)...',
    searching: '전 세계 날씨 위치 검색 중...',
    detectError: '위치를 감지할 수 없습니다. 브라우저 위치 권한을 확인해 주세요.',
    unitLabel: '단위',
    viewLabel: '보기',
    hourlyShort: '시간별 (12h)',
    dailyShort: '일별 (7d)',
  },
  Italian: {
    weatherLocation: 'Località Meteo',
    weatherLocationDesc: 'Configura città, regione o codice postale nel mondo per ricevere dati meteo precisi sulla pagina iniziale.',
    currentLocation: 'Posizione Attuale',
    detectTitle: 'Rileva Posizione Attuale',
    autoDetect: 'Rileva automaticamente',
    close: 'Chiudi',
    change: 'Cambia',
    searchPlaceholder: 'Cerca città, CAP o paese (es. Roma, Parigi, Tokyo, 90210)...',
    searching: 'Ricerca località meteo globali in corso...',
    detectError: 'Impossibile rilevare la posizione. Controlla i permessi del browser.',
    unitLabel: 'Unità',
    viewLabel: 'Vista',
    hourlyShort: 'Oraria (12h)',
    dailyShort: 'Giornaliera (7g)',
  },
  Russian: {
    weatherLocation: 'Местоположение погоды',
    weatherLocationDesc: 'Укажите город, регион или почтовый индекс в любой точке мира для точного прогноза на главной странице.',
    currentLocation: 'Текущее местоположение',
    detectTitle: 'Определить текущее местоположение',
    autoDetect: 'Автоопределение',
    close: 'Закрыть',
    change: 'Изменить',
    searchPlaceholder: 'Поиск города, индекса или страны (напр., Москва, Париж, Токио)...',
    searching: 'Поиск городов и регионов...',
    detectError: 'Не удалось определить местоположение. Проверьте разрешения браузера.',
    unitLabel: 'Единица',
    viewLabel: 'Режим',
    hourlyShort: 'По часам (12ч)',
    dailyShort: 'По дням (7д)',
  },
  Luxembourgish: {
    weatherLocation: 'Wieder-Standuert',
    weatherLocationDesc: 'Konfiguréiert Är Stad, Regioun oder Postleitzuel weltwäit fir genee Live-Wiederdaten op der Startsäit.',
    currentLocation: 'Aktuelle Standuert',
    detectTitle: 'Aktuelle Standuert erkennen',
    autoDetect: 'Automatesch erkennen',
    close: 'Zoumaachen',
    change: 'Änneren',
    searchPlaceholder: 'Stad, Postleitzuel oder Land sichen (z. B. Lëtzebuerg, Paräis, 90210)...',
    searching: 'Globale Wieder-Standuerter ginn gesicht...',
    detectError: 'De Standuert konnt net erkannt ginn. Préift w.e.g. d’Browser-Berechtegungen.',
    unitLabel: 'Eenheet',
    viewLabel: 'Usiicht',
    hourlyShort: 'Stëndlech (12h)',
    dailyShort: 'Deeglech (7D)',
  },
  Dutch: {
    weatherLocation: 'Weerlocatie',
    weatherLocationDesc: 'Stel je stad, regio of postcode wereldwijd in om nauwkeurige live weergegevens voor de startpagina op te halen.',
    currentLocation: 'Huidige locatie',
    detectTitle: 'Huidige locatie detecteren',
    autoDetect: 'Automatisch detecteren',
    close: 'Sluiten',
    change: 'Wijzigen',
    searchPlaceholder: 'Zoek stad, postcode of land (bijv. Amsterdam, Parijs, Tokio, 90210)...',
    searching: 'Wereldwijde weerlocaties zoeken...',
    detectError: 'Kan locatie niet detecteren. Controleer de browsermachtigingen.',
    unitLabel: 'Eenheid',
    viewLabel: 'Weergave',
    hourlyShort: 'Per uur (12u)',
    dailyShort: 'Per dag (7d)',
  },
  Swedish: {
    weatherLocation: 'Väderplats',
    weatherLocationDesc: 'Ange valfri stad, region eller postnummer för att hämta exakta väderdata till startsidan.',
    currentLocation: 'Nuvarande plats',
    detectTitle: 'Upptäck nuvarande plats',
    autoDetect: 'Automatisk plats',
    close: 'Stäng',
    change: 'Ändra',
    searchPlaceholder: 'Sök stad, postnummer eller land (t.ex. Stockholm, Paris, Tokyo, 90210)...',
    searching: 'Söker globala väderplatser...',
    detectError: 'Kunde inte hämta plats. Kontrollera webbläsarens behörigheter.',
    unitLabel: 'Enhet',
    viewLabel: 'Visning',
    hourlyShort: 'Timvis (12h)',
    dailyShort: 'Dagligen (7d)',
  },
  Finnish: {
    weatherLocation: 'Sääsijainti',
    weatherLocationDesc: 'Määritä kaupunki, alue tai postinumero saadaksesi tarkat reaaliaikaiset säätiedot etusivulle.',
    currentLocation: 'Nykyinen sijainti',
    detectTitle: 'Tunnista nykyinen sijainti',
    autoDetect: 'Tunnista automaattisesti',
    close: 'Sulje',
    change: 'Vaihda',
    searchPlaceholder: 'Hae kaupunkia, postinumeroa tai maata (esim. Helsinki, Pariisi, 90210)...',
    searching: 'Haetaan maailmanlaajuisia sääkohteita...',
    detectError: 'Sijaintia ei voitu tunnistaa. Tarkista selaimen käyttöoikeudet.',
    unitLabel: 'Yksikkö',
    viewLabel: 'Näkymä',
    hourlyShort: 'Tunneittain (12h)',
    dailyShort: 'Päivittäin (7pv)',
  },
  Hindi: {
    weatherLocation: 'मौसम स्थान',
    weatherLocationDesc: 'होम पेज पर सटीक लाइव मौसम डेटा प्राप्त करने के लिए अपना शहर, क्षेत्र या पिन कोड सेट करें।',
    currentLocation: 'वर्तमान स्थान',
    detectTitle: 'वर्तमान स्थान पहचानें',
    autoDetect: 'स्वतः पहचानें',
    close: 'बंद करें',
    change: 'बदलें',
    searchPlaceholder: 'शहर, पिन कोड या देश खोजें (उदा. दिल्ली, पेरिस, टोक्यो, 90210)...',
    searching: 'वैश्विक मौसम स्थान खोजे जा रहे हैं...',
    detectError: 'स्थान की पहचान नहीं हो सकी। कृपया ब्राउज़र अनुमतियाँ जांचें।',
    unitLabel: 'इकाई',
    viewLabel: 'दृश्य',
    hourlyShort: 'प्रति घंटा (12h)',
    dailyShort: 'दैनिक (7d)',
  },
  Norwegian: {
    weatherLocation: 'Værsted',
    weatherLocationDesc: 'Angi by, region eller postnummer verden over for å hente nøyaktige værdata til startsiden.',
    currentLocation: 'Nåværende posisjon',
    detectTitle: 'Finn nåværende posisjon',
    autoDetect: 'Finn automatisk',
    close: 'Lukk',
    change: 'Endre',
    searchPlaceholder: 'Søk etter by, postnummer eller land (f.eks. Oslo, Paris, Tokyo, 90210)...',
    searching: 'Søker etter globale værsteder...',
    detectError: 'Kunne ikke finne posisjon. Kontroller nettleserens tillatelser.',
    unitLabel: 'Enhet',
    viewLabel: 'Visning',
    hourlyShort: 'Timevis (12t)',
    dailyShort: 'Daglig (7d)',
  },
  Thai: {
    weatherLocation: 'ตำแหน่งสภาพอากาศ',
    weatherLocationDesc: 'ตั้งค่าเมือง ภูมิภาค หรือรหัสไปรษณีย์ทั่วโลกเพื่อดึงข้อมูลสภาพอากาศแบบเรียลไทม์บนหน้าแรกอย่างแม่นยำ',
    currentLocation: 'ตำแหน่งปัจจุบัน',
    detectTitle: 'ตรวจจับตำแหน่งปัจจุบัน',
    autoDetect: 'ตรวจจับอัตโนมัติ',
    close: 'ปิด',
    change: 'เปลี่ยน',
    searchPlaceholder: 'ค้นหาเมือง รหัสไปรษณีย์ หรือประเทศ (เช่น กรุงเทพฯ, ปารีส, โตเกียว)...',
    searching: 'กำลังค้นหาตำแหน่งสภาพอากาศทั่วโลก...',
    detectError: 'ไม่สามารถตรวจจับตำแหน่งได้ โปรดตรวจสอบสิทธิ์ของเบราว์เซอร์',
    unitLabel: 'หน่วย',
    viewLabel: 'มุมมอง',
    hourlyShort: 'รายชั่วโมง (12 ชม.)',
    dailyShort: 'รายวัน (7 วัน)',
  },
  Portuguese: {
    weatherLocation: 'Localização Meteorológica',
    weatherLocationDesc: 'Configure a sua cidade, região ou código postal global para obter dados meteorológicos em direto na página inicial.',
    currentLocation: 'Localização Atual',
    detectTitle: 'Detetar Localização Atual',
    autoDetect: 'Deteção automática',
    close: 'Fechar',
    change: 'Alterar',
    searchPlaceholder: 'Pesquisar cidade, código postal ou país (ex.: Lisboa, Paris, Tóquio, 90210)...',
    searching: 'A pesquisar localizações meteorológicas globais...',
    detectError: 'Não foi possível detetar a localização. Verifique as permissões do navegador.',
    unitLabel: 'Unidade',
    viewLabel: 'Vista',
    hourlyShort: 'Por hora (12h)',
    dailyShort: 'Diário (7d)',
  },
  Vietnamese: {
    weatherLocation: 'Vị trí thời tiết',
    weatherLocationDesc: 'Thiết lập thành phố, khu vực hoặc mã bưu chính toàn cầu để lấy dữ liệu thời tiết trực tiếp chính xác cho trang chủ.',
    currentLocation: 'Vị trí hiện tại',
    detectTitle: 'Xác định vị trí hiện tại',
    autoDetect: 'Tự động định vị',
    close: 'Đóng',
    change: 'Thay đổi',
    searchPlaceholder: 'Tìm thành phố, mã bưu chính hoặc quốc gia (vd: Hà Nội, Paris, Tokyo)...',
    searching: 'Đang tìm vị trí thời tiết toàn cầu...',
    detectError: 'Không thể xác định vị trí. Vui lòng kiểm tra quyền truy cập của trình duyệt.',
    unitLabel: 'Đơn vị',
    viewLabel: 'Chế độ xem',
    hourlyShort: 'Theo giờ (12h)',
    dailyShort: 'Theo ngày (7d)',
  },
  Polish: {
    weatherLocation: 'Lokalizacja pogody',
    weatherLocationDesc: 'Ustaw dowolne miasto, region lub kod pocztowy na świecie, aby pobierać dokładne dane pogodowe na stronie głównej.',
    currentLocation: 'Bieżąca lokalizacja',
    detectTitle: 'Wykryj bieżącą lokalizację',
    autoDetect: 'Wykryj automatycznie',
    close: 'Zamknij',
    change: 'Zmień',
    searchPlaceholder: 'Szukaj miasta, kodu pocztowego lub kraju (np. Warszawa, Paryż, Tokio)...',
    searching: 'Wyszukiwanie lokalizacji pogodowych na świecie...',
    detectError: 'Nie udało się wykryć lokalizacji. Sprawdź uprawnienia przeglądarki.',
    unitLabel: 'Jednostka',
    viewLabel: 'Widok',
    hourlyShort: 'Godzinowa (12h)',
    dailyShort: 'Dzienna (7d)',
  },
  Danish: {
    weatherLocation: 'Vejrplacering',
    weatherLocationDesc: 'Indstil din by, region eller postnummer globalt for at hente nøjagtige live vejrdata til forsiden.',
    currentLocation: 'Nuværende placering',
    detectTitle: 'Registrer nuværende placering',
    autoDetect: 'Automatisk registrering',
    close: 'Luk',
    change: 'Skift',
    searchPlaceholder: 'Søg efter by, postnummer eller land (f.eks. København, Paris, Tokyo)...',
    searching: 'Søger globale vejrplaceringer...',
    detectError: 'Kunne ikke registrere placering. Tjek venligst browserens tilladelser.',
    unitLabel: 'Enhed',
    viewLabel: 'Visning',
    hourlyShort: 'Timevis (12t)',
    dailyShort: 'Daglig (7d)',
  },
  Turkish: {
    weatherLocation: 'Hava Durumu Konumu',
    weatherLocationDesc: 'Ana sayfada doğru canlı hava durumu verileri almak için küresel şehir, bölge veya posta kodunuzu yapılandırın.',
    currentLocation: 'Mevcut Konum',
    detectTitle: 'Mevcut Konumu Algıla',
    autoDetect: 'Otomatik Algıla',
    close: 'Kapat',
    change: 'Değiştir',
    searchPlaceholder: 'Şehir, posta kodu veya ülke arayın (ör. İstanbul, Paris, Tokyo, 90210)...',
    searching: 'Küresel hava durumu konumları aranıyor...',
    detectError: 'Konum algılanamadı. Lütfen tarayıcı izinlerinizi kontrol edin.',
    unitLabel: 'Birim',
    viewLabel: 'Görünüm',
    hourlyShort: 'Saatlik (12s)',
    dailyShort: 'Günlük (7g)',
  },
  Greek: {
    weatherLocation: 'Τοποθεσία Καιρού',
    weatherLocationDesc: 'Ρυθμίστε την πόλη, την περιοχή ή τον ταχυδρομικό κώδικά σας παγκοσμίως για ακριβή ζωντανά δεδομένα καιρού στην αρχική σελίδα.',
    currentLocation: 'Τρέχουσα Τοποθεσία',
    detectTitle: 'Εντοπισμός Τρέχουσας Τοποθεσίας',
    autoDetect: 'Αυτόματος εντοπισμός',
    close: 'Κλείσιμο',
    change: 'Αλλαγή',
    searchPlaceholder: 'Αναζήτηση πόλης, Τ.Κ. ή χώρας (π.χ. Αθήνα, Παρίσι, Τόκιο)...',
    searching: 'Αναζήτηση παγκόσμιων τοποθεσιών καιρού...',
    detectError: 'Δεν ήταν δυνατός ο εντοπισμός τοποθεσίας. Ελέγξτε τα δικαιώματα του προγράμματος περιήγησης.',
    unitLabel: 'Μονάδα',
    viewLabel: 'Προβολή',
    hourlyShort: 'Ωριαία (12ω)',
    dailyShort: 'Ημερήσια (7η)',
  },
  Belgum: {
    weatherLocation: 'Weerlocatie',
    weatherLocationDesc: 'Stel uw stad, gemeente of postcode wereldwijd in om nauwkeurige live weergegevens voor de startpagina op te halen.',
    currentLocation: 'Huidige locatie',
    detectTitle: 'Huidige locatie detecteren',
    autoDetect: 'Automatisch bepalen',
    close: 'Sluiten',
    change: 'Wijzigen',
    searchPlaceholder: 'Zoek stad, postcode of land (bv. Brussel, Antwerpen, Gent, 1000)...',
    searching: 'Wereldwijde weerlocaties zoeken...',
    detectError: 'Kan locatie niet bepalen. Controleer de browsermachtigingen.',
    unitLabel: 'Eenheid',
    viewLabel: 'Weergave',
    hourlyShort: 'Per uur (12u)',
    dailyShort: 'Per dag (7d)',
  },
};

export default function WeatherSettingsTab({ language = 'English' }: WeatherSettingsTabProps) {
  const d = WEATHER_SETTINGS_T[language] || WEATHER_SETTINGS_T['English'];
  const extra = WEATHER_SETTINGS_EXTRA_T[language] || WEATHER_SETTINGS_EXTRA_T['English'];

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
  const [detectError, setDetectError] = useState<string | null>(null);
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
    setDetectError(null);

    window.dispatchEvent(new CustomEvent('geektabs-weather-location-updated', {
      detail: { location: item.formattedAddress, inputs: newInputs }
    }));
  };

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    setDetectError(null);
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
      setDetectError(extra.detectError);
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="mb-6 sm:mb-10 flex flex-col items-center text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2 sm:mb-3 flex items-center justify-center gap-2.5">
          <CloudSun className="text-indigo-500 w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
          <span>{d.title}</span>
        </h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.25em] text-[10px]">
          {d.subtitle}
        </p>
      </div>

      <div className="space-y-6 divide-y divide-black/5">
        {/* Setting 0: Location & Region */}
        <div className="pt-2 flex flex-col items-center text-center">
          <label className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-2 flex items-center justify-center gap-2">
            <MapPin size={15} />
            <span>{extra.weatherLocation}</span>
          </label>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed max-w-xl mx-auto">
            {extra.weatherLocationDesc}
          </p>

          <div className="max-w-xl w-full mx-auto space-y-3 text-left">
            {/* Current Active Location Card */}
            <div className="p-4 rounded-2xl border border-black/10 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {extra.currentLocation}
                  </p>
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetecting}
                  className="flex-1 sm:flex-initial justify-center px-3 py-2 lg:py-1.5 min-h-[42px] lg:min-h-0 rounded-xl border border-black/10 hover:bg-black/5 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  title={extra.detectTitle}
                >
                  {isDetecting ? (
                    <Loader2 size={13} className="animate-spin text-indigo-500" />
                  ) : (
                    <Navigation size={13} className="text-indigo-500" />
                  )}
                  <span>{extra.autoDetect}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSearchBox(!showSearchBox)}
                  className="flex-1 sm:flex-initial justify-center px-3 py-2 lg:py-1.5 min-h-[42px] lg:min-h-0 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center"
                >
                  {showSearchBox ? extra.close : extra.change}
                </button>
              </div>
            </div>

            {detectError && (
              <p className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 text-center">
                {detectError}
              </p>
            )}

            {/* Smart Search Dropdown in Settings */}
            {showSearchBox && (
              <div ref={searchContainerRef} className="relative p-3.5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-2">
                <div className="relative flex items-center">
                  <Search size={15} className="absolute left-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={extra.searchPlaceholder}
                    className="w-full bg-white border border-black/10 rounded-xl pl-9 pr-10 py-2.5 lg:py-2 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="absolute right-1.5 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-slate-600"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {isSearching && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 px-2 py-1">
                    <Loader2 size={13} className="animate-spin text-indigo-500" />
                    <span>{extra.searching}</span>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="bg-white border border-black/10 rounded-xl shadow-lg max-h-52 overflow-y-auto divide-y divide-black/5">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectLocation(item)}
                        className="w-full text-left px-3.5 py-3 lg:py-2.5 min-h-[44px] lg:min-h-0 hover:bg-indigo-500/10 flex items-start gap-2.5 transition-colors cursor-pointer group"
                      >
                        <MapPin size={14} className="text-indigo-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
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
        <div className="pt-6 flex flex-col items-center text-center">
          <label className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-2 flex items-center justify-center gap-2">
            <Thermometer size={15} />
            {d.unitTitle}
          </label>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed max-w-xl mx-auto">
            {d.unitDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full mx-auto">
            {/* Celsius Option */}
            <button
              type="button"
              onClick={() => setTempUnit('C')}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer select-none ${
                tempUnit === 'C'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm ring-1 ring-indigo-500/30'
                  : 'border-black/10 hover:border-black/20 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center font-black text-sm">
                    °C
                  </span>
                  <span className="font-extrabold text-sm text-slate-900">
                    {d.celsius}
                  </span>
                </div>
                {tempUnit === 'C' && (
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {d.celsiusDesc}
              </p>
            </button>

            {/* Fahrenheit Option */}
            <button
              type="button"
              onClick={() => setTempUnit('F')}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer select-none ${
                tempUnit === 'F'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm ring-1 ring-indigo-500/30'
                  : 'border-black/10 hover:border-black/20 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center font-black text-sm">
                    °F
                  </span>
                  <span className="font-extrabold text-sm text-slate-900">
                    {d.fahrenheit}
                  </span>
                </div>
                {tempUnit === 'F' && (
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {d.fahrenheitDesc}
              </p>
            </button>
          </div>
        </div>

        {/* Setting 2: Forecast Interval Mode (by hour vs by day) */}
        <div className="pt-6 flex flex-col items-center text-center">
          <label className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-2 flex items-center justify-center gap-2">
            <Calendar size={15} />
            {d.forecastModeTitle}
          </label>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed max-w-xl mx-auto">
            {d.forecastModeDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full mx-auto">
            {/* By Hour Option */}
            <button
              type="button"
              onClick={() => setForecastMode('hr')}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer select-none ${
                forecastMode === 'hr'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm ring-1 ring-indigo-500/30'
                  : 'border-black/10 hover:border-black/20 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center">
                    <Clock size={16} />
                  </span>
                  <span className="font-extrabold text-sm text-slate-900">
                    {d.hourly}
                  </span>
                </div>
                {forecastMode === 'hr' && (
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {d.hourlyDesc}
              </p>
            </button>

            {/* By Day Option */}
            <button
              type="button"
              onClick={() => setForecastMode('day')}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer select-none ${
                forecastMode === 'day'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm ring-1 ring-indigo-500/30'
                  : 'border-black/10 hover:border-black/20 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center">
                    <Calendar size={16} />
                  </span>
                  <span className="font-extrabold text-sm text-slate-900">
                    {d.daily}
                  </span>
                </div>
                {forecastMode === 'day' && (
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {d.dailyDesc}
              </p>
            </button>
          </div>
        </div>

        {/* Informational Status Card */}
        <div className="pt-6 flex justify-center">
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 flex flex-col items-center text-center gap-2.5 max-w-xl w-full mx-auto">
            <Sparkles size={16} className="text-indigo-500 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {d.previewTitle}
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {d.previewDesc}
              </p>
              <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-600 font-bold">
                  {extra.unitLabel}: °{tempUnit}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-600 font-bold">
                  {extra.viewLabel}: {forecastMode === 'hr' ? extra.hourlyShort : extra.dailyShort}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
