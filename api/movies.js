import fetch from 'node-fetch';

const fallbackMovies = [
  {
    id: 603,
    title: 'The Matrix',
    media_type: 'movie',
    release_date: '1999-03-31',
    overview: 'A hacker learns that reality is a simulation and joins a rebellion to free humanity.',
    poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUkQ3.jpg'
  },
  {
    id: 550,
    title: 'Fight Club',
    media_type: 'movie',
    release_date: '1999-10-15',
    overview: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.',
    poster_path: '/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg'
  },
  {
    id: 299536,
    title: 'Avengers: Infinity War',
    media_type: 'movie',
    release_date: '2018-04-27',
    overview: 'The Avengers and their allies must be willing to sacrifice all to defeat the powerful Thanos.',
    poster_path: '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg'
  },
  {
    id: 1396,
    name: 'Breaking Bad',
    media_type: 'tv',
    first_air_date: '2008-01-20',
    overview: 'A chemistry teacher turned meth kingpin spirals into a criminal empire while trying to provide for his family.',
    poster_path: '/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg'
  },
  {
    id: 2316,
    name: 'The Office',
    media_type: 'tv',
    first_air_date: '2005-03-24',
    overview: 'A documentary-style look at the everyday lives of office employees at the Dunder Mifflin paper company.',
    poster_path: '/7DJKHzAi83BmQrWLrHX5P8YcJwG.jpg'
  }
];

function getFallbackMovies(query = '') {
  const normalized = String(query || '').trim().toLowerCase();

  if (!normalized) {
    return fallbackMovies;
  }

  return fallbackMovies.filter((movie) => {
    const haystack = `${movie.title || movie.name} ${movie.overview}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.TMDB_KEY;
  const query = String(req.query?.query ?? req.query?.q ?? '').trim();

  if (!TMDB_API_KEY) {
    return res.json(getFallbackMovies(query));
  }

  try {
    const endpoint = query
      ? `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
      : `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}&language=en-US&page=1`;

    const tmdbResponse = await fetch(endpoint);

    if (!tmdbResponse.ok) {
      const errorText = await tmdbResponse.text();
      return res.status(tmdbResponse.status).json({
        error: 'TMDB request failed',
        details: errorText
      });
    }

    const data = await tmdbResponse.json();
    const results = (data.results || []).filter((item) => item && (item.media_type === 'movie' || item.media_type === 'tv'));
    return res.json(results.slice(0, 20));
  } catch (error) {
    console.error('Failed to fetch TMDB media:', error);
    return res.json(getFallbackMovies(query));
  }
}
