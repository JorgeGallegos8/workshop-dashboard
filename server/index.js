import express, { application } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSocket } from './sockets/index.js';
import readingsRouter from './routes/readings.js';
import weatherRouter from './routes/weather.js';
import pricesRouter from './routes/prices.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/readings', readingsRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/prices', pricesRouter);

initSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
