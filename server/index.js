import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSocket } from './sockets/index.js';
import readingsRouter from './routes/readings.js';
import weatherRouter from './routes/weather.js';
import pricesRouter from './routes/prices.js';
import pool from './db/index.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/readings', readingsRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/prices', pricesRouter);

initSocket(server);

setInterval(
  async () => {
    try {
      const result = await pool.query(
        `DELETE FROM readings WHERE timestamp < NOW() - INTERVAL '30 days'`
      );
      console.log(`Cleanup: deleted ${result.rowCount} old readings`);
    } catch (err) {
      console.error('Cleanup job failed:', err.message);
    }
  },
  24 * 60 * 60 * 1000
);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
