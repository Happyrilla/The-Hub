import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';

dotenv.config({ path: './assets/tmdb.env' });

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_KEY = process.env.TMDB_KEY;

// Serve static files from the project root so files like index.html and 404.html are available
app.use(express.static(process.cwd()));

app.get('/api/movies', async (req, res) => {
  const query = req.query.q || 'avengers';
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: 'TMDB request failed' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Fallback: send the project's 404.html for any unknown route (returns 404 status)
app.use((req, res) => {
  res.status(404).sendFile(path.join(process.cwd(), '404.html'));
});
