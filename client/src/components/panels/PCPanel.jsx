import { useState, useEffect } from 'react';
import useLiveReadings from '../../hooks/useLiveReadings';
import MetricCard from '../shared/MetricCard';
import LiveChart from '../shared/LiveChart';

export default function PCPanel() {
  const [chartData, setChartData] = useState([]);
  const readings = useLiveReadings();

  useEffect(() => {
    if (readings.cpu_usage && readings.ram_usage) {
      setChartData((prev) => {
        const newPoint = {
          time: new Date(readings.cpu_usage.timestamp).toLocaleTimeString(),
          cpu_usage: readings.cpu_usage.value,
          ram_usage: readings.ram_usage.value,
        };
        const updated = [...prev, newPoint];
        return updated.slice(-60);
      });
    }
  }, [readings]);

  return (
    <div>
      <MetricCard
        metric="cpu_usage"
        value={readings.cpu_usage?.value}
        unit="%"
      />

      <MetricCard
        metric="ram_usage"
        value={readings.ram_usage?.value}
        unit="%"
      />

      <MetricCard
        metric="available_storage"
        value={readings.available_storage?.value}
        unit="GB"
      />

      <div style={{ width: '500px', height: '300px' }}>
        <LiveChart
          data={chartData}
          lines={[
            { key: 'cpu_usage', color: '#3b82f6' },
            { key: 'ram_usage', color: '#10b981' },
          ]}
        />
      </div>
    </div>
  );
}
