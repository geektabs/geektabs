export interface GeoLocationResult {
  id: string;
  name: string;
  admin1?: string; // state or province or region
  country: string;
  countryCode?: string;
  postcode?: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface LiveWeatherData {
  temp: number;
  text: string;
  icon: string;
  timezone?: string;
  high?: number;
  low?: number;
  hourly: Array<{ time: string; temp: number; icon: string }>;
  daily: Array<{ time: string; date?: string; temp: number; maxTemp: number; minTemp: number; icon: string }>;
  lastUpdated: number;
}

export const WMO_CODE_MAP: Record<number, { text: string; icon: string }> = {
  0: { text: 'Clear', icon: 'sun' },
  1: { text: 'Mainly Clear', icon: 'sun' },
  2: { text: 'Partly Cloudy', icon: 'cloud' },
  3: { text: 'Overcast', icon: 'cloud' },
  45: { text: 'Foggy', icon: 'cloud' },
  48: { text: 'Depositing Rime Fog', icon: 'cloud' },
  51: { text: 'Light Drizzle', icon: 'rain' },
  53: { text: 'Moderate Drizzle', icon: 'rain' },
  55: { text: 'Dense Drizzle', icon: 'rain' },
  56: { text: 'Freezing Drizzle', icon: 'rain' },
  57: { text: 'Dense Freezing Drizzle', icon: 'rain' },
  61: { text: 'Slight Rain', icon: 'rain' },
  63: { text: 'Moderate Rain', icon: 'rain' },
  65: { text: 'Heavy Rain', icon: 'rain' },
  66: { text: 'Freezing Rain', icon: 'rain' },
  67: { text: 'Heavy Freezing Rain', icon: 'rain' },
  71: { text: 'Slight Snow', icon: 'snow' },
  73: { text: 'Moderate Snow', icon: 'snow' },
  75: { text: 'Heavy Snow', icon: 'snow' },
  77: { text: 'Snow Grains', icon: 'snow' },
  80: { text: 'Slight Rain Showers', icon: 'rain' },
  81: { text: 'Moderate Rain Showers', icon: 'rain' },
  82: { text: 'Violent Rain Showers', icon: 'rain' },
  85: { text: 'Slight Snow Showers', icon: 'snow' },
  86: { text: 'Heavy Snow Showers', icon: 'snow' },
  95: { text: 'Thunderstorm', icon: 'rain' },
  96: { text: 'Thunderstorm with Slight Hail', icon: 'rain' },
  99: { text: 'Thunderstorm with Heavy Hail', icon: 'rain' }
};

export function mapWmoCode(code: number, hourNum = 12): { text: string; icon: string } {
  const isNight = hourNum >= 20 || hourNum < 6;
  const match = WMO_CODE_MAP[code] || { text: 'Partly Cloudy', icon: 'cloud' };
  if (code === 0 && isNight) {
    return { text: match.text, icon: 'cloud' };
  }
  return match;
}

export function formatCanonicalAddress(
  cityOrName: string,
  stateOrRegion?: string,
  country?: string,
  postcode?: string
): string {
  const parts: string[] = [];
  const cName = (cityOrName || '').trim();
  const sRegion = (stateOrRegion || '').trim();
  const coName = (country || '').trim();
  const pCode = (postcode || '').trim();

  if (cName) parts.push(cName);
  if (sRegion && sRegion.toLowerCase() !== cName.toLowerCase()) {
    parts.push(sRegion);
  }
  if (pCode && !parts.some(p => p.includes(pCode))) {
    parts.push(pCode);
  }
  if (coName && coName.toLowerCase() !== cName.toLowerCase() && coName.toLowerCase() !== sRegion.toLowerCase()) {
    parts.push(coName);
  }

  return parts.join(', ');
}

/**
 * Searches global locations via Open-Meteo Geocoding + Photon multilingual OSM geocoder.
 * Returns deduplicated, canonical location suggestions.
 */
export async function searchGlobalLocations(query: string): Promise<GeoLocationResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery || cleanQuery.length < 2) return [];

  const results: GeoLocationResult[] = [];
  const seenKeys = new Set<string>();

  // 1. Try Open-Meteo Geocoding API (Fast, standard, global)
  try {
    const omUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=8&language=en`;
    const res = await fetch(omUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.results)) {
        for (const item of data.results) {
          const lat = parseFloat(item.latitude);
          const lon = parseFloat(item.longitude);
          const name = item.name || cleanQuery;
          const admin1 = item.admin1 || '';
          const country = item.country || '';
          const postcode = Array.isArray(item.postcodes) && item.postcodes.length > 0 ? item.postcodes[0] : '';
          const formatted = formatCanonicalAddress(name, admin1, country, postcode);
          const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;

          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            results.push({
              id: `om-${item.id || key}`,
              name,
              admin1,
              country,
              countryCode: item.country_code || '',
              postcode,
              latitude: lat,
              longitude: lon,
              formattedAddress: formatted
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn('Open-Meteo geocoding search failed:', err);
  }

  // 2. Try Photon multilingual geocoder (Handles international names, postal codes, and detailed address queries)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery)}&limit=8`;
    const res = await fetch(photonUrl, {
      headers: { 'Accept-Language': 'en' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.features)) {
        for (const feat of data.features) {
          const props = feat.properties || {};
          const coords = feat.geometry?.coordinates || [];
          if (coords.length >= 2) {
            const lon = coords[0];
            const lat = coords[1];
            const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              const name = props.name || props.city || props.town || props.district || cleanQuery;
              const admin1 = props.state || '';
              const country = props.country || '';
              const postcode = props.postcode || '';
              const formatted = formatCanonicalAddress(name, admin1, country, postcode);

              results.push({
                id: `photon-${feat.properties?.osm_id || key}`,
                name,
                admin1,
                country,
                countryCode: props.countrycode || '',
                postcode,
                latitude: lat,
                longitude: lon,
                formattedAddress: formatted
              });
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('Photon geocoding search failed:', err);
  }

  return results;
}

/**
 * Reverse geocodes coordinates to a canonical address and place information.
 */
export async function reverseGeocodeCoords(lat: number, lon: number): Promise<GeoLocationResult | null> {
  try {
    const photonUrl = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`;
    const res = await fetch(photonUrl, { headers: { 'Accept-Language': 'en' } });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.features) && data.features.length > 0) {
        const props = data.features[0].properties || {};
        const name = props.city || props.name || props.town || props.district || 'Current Location';
        const admin1 = props.state || '';
        const country = props.country || '';
        const postcode = props.postcode || '';
        const formatted = formatCanonicalAddress(name, admin1, country, postcode);

        return {
          id: `rev-${lat.toFixed(3)},${lon.toFixed(3)}`,
          name,
          admin1,
          country,
          countryCode: props.countrycode || '',
          postcode,
          latitude: lat,
          longitude: lon,
          formattedAddress: formatted
        };
      }
    }
  } catch (err) {
    console.warn('Photon reverse geocode failed:', err);
  }

  return null;
}

/**
 * Automatically detects user location using fast IP geolocation with GPS fallback.
 */
export async function detectCurrentLocation(): Promise<GeoLocationResult> {
  // Strategy 1: ipwho.is
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const name = data.city || '';
        const admin1 = data.region || data.region_code || '';
        const country = data.country || '';
        const postcode = data.postal || '';
        const formatted = formatCanonicalAddress(name, admin1, country, postcode);

        return {
          id: `ip-${data.ip || Date.now()}`,
          name: name || 'Local City',
          admin1,
          country,
          countryCode: data.country_code || '',
          postcode,
          latitude: data.latitude,
          longitude: data.longitude,
          formattedAddress: formatted || 'Detected Location'
        };
      }
    }
  } catch {
    // fallback
  }

  // Strategy 2: ipapi.co
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const name = data.city || '';
        const admin1 = data.region || data.region_code || '';
        const country = data.country_name || data.country || '';
        const postcode = data.postal || '';
        const formatted = formatCanonicalAddress(name, admin1, country, postcode);

        return {
          id: `ipapi-${Date.now()}`,
          name: name || 'Local City',
          admin1,
          country,
          countryCode: data.country_code || '',
          postcode,
          latitude: data.latitude,
          longitude: data.longitude,
          formattedAddress: formatted || 'Detected Location'
        };
      }
    }
  } catch {
    // fallback
  }

  // Strategy 3: Browser navigator.geolocation
  return new Promise((resolve, reject) => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const rev = await reverseGeocodeCoords(lat, lon);
          if (rev) {
            resolve(rev);
          } else {
            resolve({
              id: `gps-${Date.now()}`,
              name: 'Current Location',
              country: '',
              latitude: lat,
              longitude: lon,
              formattedAddress: 'Current Location'
            });
          }
        },
        (err) => reject(new Error(err.message || 'Geolocation access denied')),
        { timeout: 7000 }
      );
    } else {
      reject(new Error('Geolocation not supported'));
    }
  });
}

/**
 * Fetches authoritative real-time live forecast data from Open-Meteo meteorological API.
 */
export async function fetchLiveForecast(
  lat: number,
  lon: number,
  unit: 'C' | 'F',
  dictionary: Record<string, string>
): Promise<LiveWeatherData> {
  const unitParam = unit === 'C' ? 'celsius' : 'fahrenheit';
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=${unitParam}&timezone=auto`;

  const weatherRes = await fetch(weatherUrl);
  if (!weatherRes.ok) {
    throw new Error(`Weather service responded with status ${weatherRes.status}`);
  }

  const weatherData = await weatherRes.json();
  if (!weatherData || !weatherData.current_weather) {
    throw new Error('Invalid current weather structure');
  }

  const currentTemp = Math.round(weatherData.current_weather.temperature);
  const code = weatherData.current_weather.weathercode;
  const currentTimeIso = weatherData.current_weather.time;
  const curHourLocal = currentTimeIso ? parseInt(currentTimeIso.split('T')[1].split(':')[0], 10) : new Date().getHours();

  const condition = mapWmoCode(code, curHourLocal);

  // Hourly Forecast (12 hours) synchronized to target location's timezone
  let curHourIndex = 0;
  if (weatherData.hourly && weatherData.hourly.time && currentTimeIso) {
    const prefix = currentTimeIso.slice(0, 13);
    const idx = weatherData.hourly.time.findIndex((t: string) => t.startsWith(prefix));
    if (idx !== -1) curHourIndex = idx;
  }

  const hourlyForecast: Array<{ time: string; temp: number; icon: string }> = [];
  const hTimes = weatherData.hourly?.time || [];
  const hTemps = weatherData.hourly?.temperature_2m || [];
  const hCodes = weatherData.hourly?.weathercode || [];

  for (let i = 0; i < 12; i++) {
    const idx = curHourIndex + i;
    if (idx < hTimes.length) {
      const isoTime = hTimes[idx];
      const hourNum = parseInt(isoTime.split('T')[1].split(':')[0], 10);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
      const timeLabel = i === 0 ? (dictionary.now || 'Now') : `${displayHour} ${ampm}`;
      const hCode = hCodes[idx] !== undefined ? hCodes[idx] : 0;
      const hTemp = Math.round(hTemps[idx] !== undefined ? hTemps[idx] : currentTemp);
      const hDetails = mapWmoCode(hCode, hourNum);

      hourlyForecast.push({
        time: timeLabel,
        temp: hTemp,
        icon: hDetails.icon
      });
    }
  }

  // 7-day Daily Forecast
  const dailyForecast: Array<{ time: string; date?: string; temp: number; maxTemp: number; minTemp: number; icon: string }> = [];
  const dayNamesKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const dailyTimes = weatherData.daily?.time || [];
  const dailyMax = weatherData.daily?.temperature_2m_max || [];
  const dailyMin = weatherData.daily?.temperature_2m_min || [];
  const dailyCodes = weatherData.daily?.weathercode || [];
  const dayCount = Math.min(dailyTimes.length, 7);

  for (let i = 0; i < dayCount; i++) {
    const datePart = dailyTimes[i];
    const [yr, mo, da] = datePart.split('-').map(Number);
    const dObj = new Date(yr, mo - 1, da);
    const dayKey = dayNamesKeys[dObj.getDay()];
    const dayLabel = i === 0 ? (dictionary.today || 'Today') : (dictionary[dayKey] || dayKey);
    const dateStr = `${mo}/${da}/${String(yr).slice(-2)}`;
    const dCode = dailyCodes[i] !== undefined ? dailyCodes[i] : 0;
    const dMax = Math.round(dailyMax[i] !== undefined ? dailyMax[i] : currentTemp);
    const dMin = Math.round(dailyMin[i] !== undefined ? dailyMin[i] : currentTemp);
    const dDetails = mapWmoCode(dCode, 12);

    dailyForecast.push({
      time: dayLabel,
      date: dateStr,
      temp: dMax,
      maxTemp: dMax,
      minTemp: dMin,
      icon: dDetails.icon
    });
  }

  const highVal = (weatherData.daily && weatherData.daily.temperature_2m_max && weatherData.daily.temperature_2m_max.length > 0)
    ? Math.round(weatherData.daily.temperature_2m_max[0])
    : Math.round(currentTemp);

  const lowVal = (weatherData.daily && weatherData.daily.temperature_2m_min && weatherData.daily.temperature_2m_min.length > 0)
    ? Math.round(weatherData.daily.temperature_2m_min[0])
    : Math.round(currentTemp);

  return {
    temp: currentTemp,
    text: condition.text,
    icon: condition.icon,
    timezone: weatherData.timezone,
    hourly: hourlyForecast,
    daily: dailyForecast,
    high: highVal,
    low: lowVal,
    lastUpdated: Date.now()
  };
}
