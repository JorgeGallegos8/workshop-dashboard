import { useEffect, useState } from 'react';

export default function useWeather() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch('http://localhost:3000/api/weather');
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
      }
    }

    fetchWeather();

    const interval = setInterval(fetchWeather, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return weather;
}