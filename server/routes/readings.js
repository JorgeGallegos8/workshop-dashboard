import { Router } from 'express';
import pool from '../db/index.js';
import { emit } from '../sockets/index.js';

const router = Router();

router.post('/', async (req, res) => {
  const { device_id, metric, value, unit } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO readings (device_id, metric, value, unit)
            VALUES ($1, $2, $3, $4) RETURNING *`,
      [device_id, metric, value, unit]
    );

    const reading = result.rows[0];
    emit('new_reading', reading);

    res.status(201).json(reading);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save reading' });
  }
});

router.get('/', async (req, res) => {
  const { metric, device_id, limit = 60 } = req.query;

  try {
    let query = 'SELECT * FROM readings WHERE 1=1';
    const params = [];

    if (metric) {
      params.push(metric);
      query += ` AND metric = $${params.length}`;
    }

    if (device_id) {
      params.push(device_id);
      query += ` AND device_id = $${params.length}`;
    }

    params.push(limit);
    query += ` ORDER BY timestamp DESC LIMIT $${params.length}`;

    const result = await pool.query(query, params);
    res.json(result.rows.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
});

router.get('/latest', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (metric) *
            FROM readings
            ORDER BY metric, timestamp DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch latest readings' });
  }
});

export default router;
