import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, query } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Get all favorites
app.get('/api/favorites', async (req, res) => {
  try {
    const result = await query('SELECT * FROM favorites ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add/Update favorite
app.post('/api/favorites', async (req, res) => {
  const { cityId, cityName, country, lat, lon } = req.body;

  if (!cityId || !cityName) {
    return res.status(400).json({ error: 'Missing required fields: cityId, cityName' });
  }

  try {
    const text = `
      INSERT INTO favorites (city_id, city_name, country, lat, lon)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (city_id) DO UPDATE SET
        city_name = EXCLUDED.city_name,
        country = EXCLUDED.country,
        lat = EXCLUDED.lat,
        lon = EXCLUDED.lon
      RETURNING *;
    `;
    const values = [cityId, cityName, country, lat, lon];
    const result = await query(text, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete favorite
app.delete('/api/favorites/:cityId', async (req, res) => {
  const { cityId } = req.params;
  try {
    await query('DELETE FROM favorites WHERE city_id = $1', [cityId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, async () => {
  await initDb();
  console.log(`Server running on port ${PORT}`);
});
