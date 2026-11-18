import { Server } from 'socket.io';

let io;

export function initSocket(server) {
  // Comma-separated list of frontend URLs allowed to connect, e.g.
  // "http://localhost:5173,http://192.168.1.50:5173"
  const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: origins,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

export function emit(event, data) {
  if (io) io.emit(event, data);
}
