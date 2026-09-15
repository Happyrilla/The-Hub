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

module.exports = async (req, res) => {
  const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.TMDB_KEY;
  const query = String(req.query?.query ?? req.query?.q ?? '').trim();

  if (!TMDB_API_KEY) {
    return res.json(getFallbackMovies(query));
  }

  try {
    const endpoint = query
      ? `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;

    const tmdbResponse = await fetch(endpoint);

    if (!tmdbResponse.ok) {
      const errorText = await tmdbResponse.text();
      return res.status(tmdbResponse.status).json({
        error: 'TMDB request failed',
        details: errorText
      });
    }

    const data = await tmdbResponse.json();
    return res.json((data.results || []).slice(0, 20));
  } catch (error) {
    console.error('Failed to fetch TMDB movies:', error);
    return res.json(getFallbackMovies(query));
  }
};
