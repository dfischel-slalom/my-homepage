(() => {
  const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph';

  const conditionEl = document.getElementById('weatherCondition');
  const iconEl = document.getElementById('weatherIcon');
  const statusEl = document.getElementById('weatherStatus');
  const metricsEl = document.getElementById('weatherMetrics');
  const tempEl = document.getElementById('weatherTemp');
  const windEl = document.getElementById('weatherWind');
  const refreshBtn = document.getElementById('weatherRefresh');

  if (!conditionEl || !iconEl || !statusEl || !metricsEl || !tempEl || !windEl || !refreshBtn) return;

  const codeMap = {
    0: { label: 'Clear sky', icon: '☀️' },
    1: { label: 'Mostly clear', icon: '🌤️' },
    2: { label: 'Partly cloudy', icon: '⛅' },
    3: { label: 'Overcast', icon: '☁️' },
    45: { label: 'Foggy', icon: '🌫️' },
    48: { label: 'Depositing rime fog', icon: '🌫️' },
    51: { label: 'Light drizzle', icon: '🌦️' },
    53: { label: 'Drizzle', icon: '🌦️' },
    55: { label: 'Heavy drizzle', icon: '🌧️' },
    56: { label: 'Freezing drizzle', icon: '🌧️' },
    57: { label: 'Heavy freezing drizzle', icon: '🌧️' },
    61: { label: 'Light rain', icon: '🌦️' },
    63: { label: 'Rain', icon: '🌧️' },
    65: { label: 'Heavy rain', icon: '🌧️' },
    66: { label: 'Freezing rain', icon: '🌧️' },
    67: { label: 'Heavy freezing rain', icon: '🌧️' },
    71: { label: 'Light snow', icon: '🌨️' },
    73: { label: 'Snow', icon: '🌨️' },
    75: { label: 'Heavy snow', icon: '❄️' },
    77: { label: 'Snow grains', icon: '❄️' },
    80: { label: 'Light rain showers', icon: '🌦️' },
    81: { label: 'Rain showers', icon: '🌧️' },
    82: { label: 'Violent rain showers', icon: '🌧️' },
    85: { label: 'Light snow showers', icon: '🌨️' },
    86: { label: 'Snow showers', icon: '🌨️' },
    95: { label: 'Thunderstorm', icon: '⛈️' },
    96: { label: 'Thunderstorm with hail', icon: '⛈️' },
    99: { label: 'Heavy thunderstorm with hail', icon: '⛈️' }
  };

  function setStatus(text, loading = false) {
    statusEl.textContent = text;
    statusEl.hidden = false;
    statusEl.style.opacity = loading ? '0.85' : '1';
    metricsEl.hidden = loading;
  }

  function renderWeather(current) {
    const temp = Math.round(current.temperature);
    const wind = Math.round(current.windspeed);
    const mapped = codeMap[current.weathercode] || { label: 'Conditions unavailable', icon: '❔' };

    conditionEl.textContent = mapped.label;
    iconEl.textContent = mapped.icon;
    tempEl.textContent = `${temp}°F`;
    windEl.textContent = `${wind} mph`;

    statusEl.hidden = true;
    metricsEl.hidden = false;
  }

  async function fetchWeather() {
    setStatus('Refreshing weather…', true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      if (!data || !data.current_weather) throw new Error('No weather data returned.');
      renderWeather(data.current_weather);
    } catch (err) {
      console.error(err);
      setStatus('Unable to load weather right now. Please try again.');
    }
  }

  refreshBtn.addEventListener('click', fetchWeather);
  fetchWeather();
})();
