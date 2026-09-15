module.exports = async (req, res) => {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    return res.status(500).json({
      error: 'TMDB_API_KEY is not configured on the server.'
    });
  }

  try {
    const query = String(req.query?.query || '').trim();
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
    return res.json(data.results || []);
  } catch (error) {
    console.error('Failed to fetch TMDB movies:', error);
    return res.status(500).json({
      error: 'Failed to fetch TMDB movies',
      details: error.message
    });
  }
};
