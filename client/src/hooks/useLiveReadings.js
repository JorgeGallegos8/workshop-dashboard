import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function useLiveReadings() {
  const [readings, setReadings] = useState({
    cpu_usage: 0,
    ram_usage: 0,
    available_storage: 0,
  });

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('new_reading', (reading) => {
      setReadings((prev) => ({
        ...prev,
        [reading.metric]: reading,
      }));
    });

    // cleanup
    return () => socket.disconnect();
  }, []);

  return readings;
}
