import usePrices from '../../hooks/usePrices';
import './PricesPanel.css';

function formatUsd(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export default function PricesPanel() {
  const prices = usePrices();

  if (!prices) {
    return (
      <article
        className="prices-panel prices-panel--loading"
        aria-busy="true"
      >
        Loading price…
      </article>
    );
  }

  const spot = prices.data;
  const base = spot?.base ?? 'BTC';
  const currency = spot?.currency ?? 'USD';

  return (
    <article
      className="prices-panel"
      aria-label={`${base} spot price in ${currency}`}
    >
      <h2 className="prices-panel__title">Bitcoin</h2>
      <p className="prices-panel__pair">
        {base} / {currency}
      </p>

      <p className="prices-panel__price">{formatUsd(spot?.amount)}</p>

      <div className="prices-panel__details">
        <p>Spot · Coinbase</p>
      </div>
    </article>
  );
}
