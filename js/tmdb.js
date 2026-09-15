import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';

dotenv.config({ path: './assets/tmdb.env' });

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_KEY = process.env.TMDB_API_KEY || process.env.TMDB_KEY;

const fallbackMovies = [
  {
    id: 603,
    title: 'The Matrix',
    release_date: '1999-03-31',
    overview: 'A hacker learns that reality is a simulation and joins a rebellion to free humanity.',
    poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUkQ3.jpg'
  },
  {
    id: 550,
    title: 'Fight Club',
    release_date: '1999-10-15',
    overview: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.',
    poster_path: '/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg'
  },
  {
    id: 299536,
    title: 'Avengers: Infinity War',
    release_date: '2018-04-27',
    overview: 'The Avengers and their allies must be willing to sacrifice all to defeat the powerful Thanos.',
    poster_path: '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg'
  }
];

function getFallbackMovies(query = '') {
  const normalized = String(query || '').trim().toLowerCase();

  if (!normalized) {
    return fallbackMovies;
  }

  return fallbackMovies.filter((movie) => {
    const haystack = `${movie.title} ${movie.overview}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

// Serve static files from the project root so files like index.html and 404.html are available
app.use(express.static(process.cwd()));

app.get('/api/movies', async (req, res) => {
  const query = String(req.query?.query ?? req.query?.q ?? '').trim();

  if (!TMDB_KEY) {
    return res.json(getFallbackMovies(query));
  }

  const endpoint = query
    ? `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
    : `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=1`;

  try {
    const r = await fetch(endpoint);

    if (!r.ok) {
      return res.status(r.status).json({
        error: 'TMDB request failed',
        details: await r.text()
      });
    }

    const data = await r.json();
    return res.json((data.results || []).slice(0, 20));
  } catch (error) {
    return res.status(500).json({
      error: 'TMDB request failed',
      details: error.message || 'Unknown error'
    });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Fallback: send the project's 404.html for any unknown route (returns 404 status)
app.use((req, res) => {
  res.status(404).sendFile(path.join(process.cwd(), '404.html'));
});
