import { useEffect, useState } from 'react';

export default function usePrices() {
  const [prices, setPrices] = useState(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const response = await fetch(
          'http://localhost:3000/api/prices/bitcoin'
        );
        const data = await response.json();
        setPrices(data);
      } catch (err) {
        console.error('failed to fetch prices:', err);
      }
    }

    fetchPrices();

    const interval = setInterval(fetchPrices, 2 * 60 * 1000); // two minutes
    return () => clearInterval(interval);
  }, []);

  return prices;
}
