(() => {
  const conditionEl = document.getElementById('weatherCondition');
  const locationEl = document.getElementById('weatherLocation');
  const iconEl = document.getElementById('weatherIcon');
  const statusEl = document.getElementById('weatherStatus');
  const metricsEl = document.getElementById('weatherMetrics');
  const tempEl = document.getElementById('weatherTemp');
  const windEl = document.getElementById('weatherWind');
  const refreshBtn = document.getElementById('weatherRefresh');
  const locationSelect = document.getElementById('weatherLocationSelect');

  if (!conditionEl || !locationEl || !iconEl || !statusEl || !metricsEl || !tempEl || !windEl || !refreshBtn || !locationSelect) return;

  const LOCATIONS = {
    seattle: { name: 'Seattle, WA', lat: 47.6062, lon: -122.3321 },
    la: { name: 'Los Angeles, CA', lat: 34.0522, lon: -118.2437 },
    boston: { name: 'Boston, MA', lat: 42.3601, lon: -71.0589 },
    waterloo: { name: 'Waterloo, IA', lat: 42.4928, lon: -92.3426 }
  };

  let currentLocationKey = locationSelect.value || 'seattle';

  const codeMap = {
    0: { label: 'Clear sky', icon: '\u2600' },
    1: { label: 'Mostly clear', icon: '\u26C5' },
    2: { label: 'Partly cloudy', icon: '\u26C5' },
    3: { label: 'Overcast', icon: '\u2601' },
    45: { label: 'Foggy', icon: '\uD83C\uDF2B' },
    48: { label: 'Depositing rime fog', icon: '\uD83C\uDF2B' },
    51: { label: 'Light drizzle', icon: '\uD83C\uDF26' },
    53: { label: 'Drizzle', icon: '\uD83C\uDF26' },
    55: { label: 'Heavy drizzle', icon: '\uD83C\uDF27' },
    56: { label: 'Freezing drizzle', icon: '\uD83C\uDF27' },
    57: { label: 'Heavy freezing drizzle', icon: '\uD83C\uDF27' },
    61: { label: 'Light rain', icon: '\uD83C\uDF26' },
    63: { label: 'Rain', icon: '\uD83C\uDF27' },
    65: { label: 'Heavy rain', icon: '\uD83C\uDF27' },
    66: { label: 'Freezing rain', icon: '\uD83C\uDF27' },
    67: { label: 'Heavy freezing rain', icon: '\uD83C\uDF27' },
    71: { label: 'Light snow', icon: '\u2744' },
    73: { label: 'Snow', icon: '\u2744' },
    75: { label: 'Heavy snow', icon: '\u2744' },
    77: { label: 'Snow grains', icon: '\u2744' },
    80: { label: 'Light rain showers', icon: '\uD83C\uDF26' },
    81: { label: 'Rain showers', icon: '\uD83C\uDF27' },
    82: { label: 'Violent rain showers', icon: '\uD83C\uDF27' },
    85: { label: 'Light snow showers', icon: '\u2744' },
    86: { label: 'Snow showers', icon: '\u2744' },
    95: { label: 'Thunderstorm', icon: '\u26C8' },
    96: { label: 'Thunderstorm with hail', icon: '\u26C8' },
    99: { label: 'Heavy thunderstorm with hail', icon: '\u26C8' }
  };

  const bgThemes = {
    clear: { bg1: '#0f172a', bg2: '#2563eb' },
    cloudy: { bg1: '#111827', bg2: '#374151' },
    rain: { bg1: '#0b1220', bg2: '#1f2a44' },
    snow: { bg1: '#0b1b2d', bg2: '#4b5563' },
    storm: { bg1: '#0b0f1a', bg2: '#4c1d95' },
    fog: { bg1: '#0f172a', bg2: '#334155' }
  };

  function setStatus(text, loading = false) {
    statusEl.textContent = text;
    statusEl.hidden = false;
    statusEl.style.opacity = loading ? '0.85' : '1';
    metricsEl.hidden = loading;
  }

  function themeForCode(code) {
    if (code === 0 || code === 1) return 'clear';
    if (code === 2 || code === 3) return 'cloudy';
    if (code === 45 || code === 48) return 'fog';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
    if ([95, 96, 99].includes(code)) return 'storm';
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
    return 'cloudy';
  }

  function applyTheme(themeKey) {
    const theme = bgThemes[themeKey];
    if (!theme) return;
    const root = document.documentElement;
    const body = document.body;
    root.style.setProperty('--bg1', theme.bg1);
    root.style.setProperty('--bg2', theme.bg2);
    Object.keys(bgThemes).forEach(key => body.classList.remove(`weather-${key}`));
    body.classList.add(`weather-${themeKey}`);
  }

  function buildApiUrl(location) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`;
  }

  function renderWeather(current, location) {
    const temp = Math.round(current.temperature);
    const wind = Math.round(current.windspeed);
    const mapped = codeMap[current.weathercode] || { label: 'Conditions unavailable', icon: '?' };

    locationEl.textContent = location.name;
    conditionEl.textContent = mapped.label;
    iconEl.textContent = mapped.icon;
    tempEl.textContent = `${temp}\u00b0F`;
    windEl.textContent = `${wind} mph`;
    applyTheme(themeForCode(current.weathercode));

    statusEl.hidden = true;
    metricsEl.hidden = false;
  }

  async function fetchWeather() {
    const location = LOCATIONS[currentLocationKey] || LOCATIONS.seattle;
    setStatus(`Refreshing weather for ${location.name}...`, true);
    try {
      const res = await fetch(buildApiUrl(location));
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      if (!data || !data.current_weather) throw new Error('No weather data returned.');
      renderWeather(data.current_weather, location);
    } catch (err) {
      console.error(err);
      setStatus('Unable to load weather right now. Please try again.');
    }
  }

  function setLocation(key) {
    currentLocationKey = LOCATIONS[key] ? key : 'seattle';
    locationSelect.value = currentLocationKey;
    fetchWeather();
  }

  refreshBtn.addEventListener('click', fetchWeather);
  locationSelect.addEventListener('change', e => setLocation(e.target.value));

  setLocation(currentLocationKey);
})();
