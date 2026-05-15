import useWeather from '../../hooks/useWeather';
import './WeatherPanel.css';

const CONDITION_EMOJI = {
  Clear: '☀️',
  Clouds: '🌤',
  Rain: '🌧',
  Drizzle: '🌦',
  Thunderstorm: '⛈',
  Snow: '❄️',
  Mist: '🌫',
  Smoke: '🌫',
  Haze: '🌫',
  Dust: '🌫',
  Fog: '🌫',
  Sand: '🌫',
  Ash: '🌫',
  Squall: '💨',
  Tornado: '🌪',
};

function formatCondition(description) {
  if (!description) return '';
  return description
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatTemp(value) {
  if (value == null) return '—';
  return `${Math.round(value)}°F`;
}

export default function WeatherPanel() {
  const weather = useWeather();

  if (!weather) {
    return (
      <article
        className="weather-panel weather-panel--loading"
        aria-busy="true"
      >
        Loading weather…
      </article>
    );
  }

  const condition = weather.weather?.[0];
  const emoji = CONDITION_EMOJI[condition?.main] ?? '🌡';
  const label = formatCondition(condition?.description);
  const temp = weather.main?.temp;
  const feelsLike = weather.main?.feels_like;
  const humidity = weather.main?.humidity;
  const wind = weather.wind?.speed;

  return (
    <article
      className="weather-panel"
      aria-label={`Weather in ${weather.name}`}
    >
      <h2 className="weather-panel__city">{weather.name}</h2>
      <p className="weather-panel__condition">
        {emoji} {label}
      </p>

      <p className="weather-panel__temps">
        {formatTemp(temp)}{' '}
        <span className="weather-panel__feels">
          feels like {formatTemp(feelsLike)}
        </span>
      </p>

      <div className="weather-panel__details">
        <p>Humidity: {humidity != null ? `${humidity}%` : '—'}</p>
        <p>Wind: {wind != null ? `${wind.toFixed(2)} mph` : '—'}</p>
      </div>
    </article>
  );
}
