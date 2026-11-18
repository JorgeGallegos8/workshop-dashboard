import si from 'systeminformation';
import dotenv from 'dotenv';

dotenv.config();

const backendUrl = process.env.BACKEND_URL;
const INTERVAL_MS = 3000;

if (!backendUrl) {
  console.error('BACKEND_URL is not set. Add it to your .env file.');
  process.exit(1);
}

let connected = null; // null = unknown, true = connected, false = disconnected

function timestamp() {
  return new Date().toLocaleTimeString();
}

async function postReading(metric, value, unit) {
  const res = await fetch(`${backendUrl}/api/readings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ device_id: 'pc', metric, value, unit }),
  });

  if (!res.ok) {
    throw new Error(`${metric}: HTTP ${res.status} ${res.statusText}`);
  }
}

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
      postReading('cpu_usage', cpuUsagePercentage, '%'),
      postReading('ram_usage', usedRamPercentage, '%'),
      postReading('available_storage', availableStorage, 'GB'),
    ]);

    if (connected !== true) {
      console.log(
        `[${timestamp()}] ${connected === false ? 'Reconnected' : 'Connected'} to ${backendUrl}`
      );
      connected = true;
    }

    console.log(
      `[${timestamp()}] Sent: CPU ${cpuUsagePercentage.toFixed(1)}% | RAM ${usedRamPercentage.toFixed(1)}% | Storage ${availableStorage.toFixed(1)} GB`
    );
  } catch (err) {
    // Log the first failure in full, then stay quiet until the connection is back
    if (connected !== false) {
      const reason = err.cause?.code ?? err.message;
      console.error(`[${timestamp()}] Failed to send stats: ${reason}. Retrying every ${INTERVAL_MS / 1000}s...`);
      connected = false;
    }
  }
}

console.log(`PC agent started. Sending stats to ${backendUrl} every ${INTERVAL_MS / 1000}s`);
sendStats();
setInterval(sendStats, INTERVAL_MS);
