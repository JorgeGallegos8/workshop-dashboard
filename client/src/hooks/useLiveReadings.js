import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function useLiveReadings() {
  const [readings, setReadings] = useState({
    cpu_usage: 0,
    ram_usage: 0,
    available_storage: 0,
  });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('new_reading', (reading) => {
      setReadings((prev) => ({
        ...prev,
        [reading.metric]: reading,
      }));
    });

    // cleanup
    return () => socket.disconnect();
  }, []);

  return { readings, connected };
}
