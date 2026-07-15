import si from 'systeminformation';
import dotenv from 'dotenv';

dotenv.config();

const backendUrl = process.env.BACKEND_URL;

async function sendStats() {
  try {
    const [cpuUsage, ramUsage, diskUsage] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
    ]);

    const cpuUsagePercentage = cpuUsage.currentLoad;
    const usedRamPercentage = (ramUsage.used / ramUsage.total) * 100;
    const availableStorage = diskUsage[0].available / 1_073_741_824; // convert bytes to gigabytes

    await Promise.all([
      fetch(`${backendUrl}/api/readings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: 'pc',
          metric: 'cpu_usage',
          value: cpuUsagePercentage,
          unit: '%',
        }),
      }),

      fetch(`${backendUrl}/api/readings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: 'pc',
          metric: 'ram_usage',
          value: usedRamPercentage,
          unit: '%',
        }),
      }),

      fetch(`${backendUrl}/api/readings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: 'pc',
          metric: 'available_storage',
          value: availableStorage,
          unit: 'GB',
        }),
      }),
    ]);
  } catch (err) {
    console.error('Failed to send stats:', err.message);
  }
}

setInterval(sendStats, 3000);
