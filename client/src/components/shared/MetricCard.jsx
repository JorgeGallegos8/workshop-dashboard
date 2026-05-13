import "./MetricCard.css";

const PREFIX_UNITS = new Set(["$", "€", "£", "¥"]);

function formatDisplayValue(value) {
  if (value == null || value === "") return "—";
  const raw = String(value).replace(/,/g, "").trim();
  if (raw === "" || Number.isNaN(Number(raw))) return String(value);
  return Number(raw).toLocaleString();
}

/** Turns keys like `cpu_usage` into readable label text. */
function formatMetricLabel(name) {
  if (name == null || name === "") return "";
  return String(name).replace(/_/g, " ").replace(/\s+/g, " ").trim();
}

export default function MetricCard({ metric, value, unit = "" }) {
  const display = formatDisplayValue(value);
  const metricLabel = formatMetricLabel(metric);
  const u = String(unit ?? "").trim();
  const usePrefix = u && PREFIX_UNITS.has(u);

  return (
    <article className="metric-card" aria-label={metricLabel ? `${metricLabel}: ${display}` : undefined}>
      {metricLabel ? (
        <p className="metric-card__label">{metricLabel}</p>
      ) : null}
      <div className="metric-card__value-row">
        {u && usePrefix ? (
          <span className="metric-card__unit" aria-hidden="true">
            {u}
          </span>
        ) : null}
        <p className="metric-card__value">{display}</p>
        {u && !usePrefix ? (
          <span className="metric-card__unit metric-card__unit--suffix" aria-hidden="true">
            {u}
          </span>
        ) : null}
      </div>
    </article>
  );
}
