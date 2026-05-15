import { Router } from 'express';

const router = Router();

let cache = {
  data: null,
  fetchedAt: null,
};

router.get('/', async (req, res) => {
  const lat = process.env.LATITUDE;
  const lon = process.env.LONGITUDE;
  const key = process.env.OPENWEATHER_API_KEY;

  const isStale = !cache.fetchedAt || Date.now() - cache.fetchedAt > 300000; // 5 minutes in milliseconds

  try {
    if (isStale) {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`
      );
      cache.data = await response.json();
      cache.fetchedAt = Date.now();
    }

    res.json(cache.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

export default router;
