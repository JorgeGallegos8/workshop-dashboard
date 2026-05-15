import { Router } from 'express';

const router = Router();

let cache = {
  data: null,
  fetchedAt: null,
};

router.get('/bitcoin', async (req, res) => {
  const isStale = !cache.fetchedAt || Date.now() - cache.fetchedAt > 60000; // 1 minute in milliseconds

  try {
    if (isStale) {
      const response = await fetch(
        'https://api.coinbase.com/v2/prices/BTC-USD/spot'
      );
      cache.data = await response.json();
      cache.fetchedAt = Date.now();
    }

    res.json(cache.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch bitcoin price' });
  }
});

export default router;
