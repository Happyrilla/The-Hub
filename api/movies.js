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
  },
  {
    id: 1399,
    name: 'Game of Thrones',
    media_type: 'tv',
    first_air_date: '2011-04-17',
    overview: 'Nine noble families fight for control over the lands of Westeros.',
    poster_path: '/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg'
  },
  {
    id: 157336,
    title: 'Interstellar',
    media_type: 'movie',
    release_date: '2014-11-05',
    overview: 'A team of explorers travel through a wormhole in search of a new home for humanity.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
  },
  {
    id: 24428,
    title: 'The Avengers',
    media_type: 'movie',
    release_date: '2012-04-11',
    overview: 'Earth\'s mightiest heroes must come together to stop Loki and his alien army.',
    poster_path: '/cezWGskPY5x7GaglTTRN4Fugfb8.jpg'
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

function isSupportedMedia(item) {
  if (!item) return false;
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  return mediaType === 'movie' || mediaType === 'tv';
}

function dedupeResults(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item || !item.id) return false;
    const key = `${item.media_type || (item.first_air_date ? 'tv' : 'movie')}:${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
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
  const requestedLimit = Math.max(Number(req.query?.limit) || 24, 1);

  if (!TMDB_API_KEY) {
    const fallback = getFallbackMovies(query);
    return res.json(fallback.slice(0, requestedLimit));
  }

  try {
    let results = [];

    if (query) {
      // Search mode
      const searchEndpoint = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
      const searchResponse = await fetch(searchEndpoint);

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        results = (searchData.results || []).filter(isSupportedMedia);
      }
    } else {
      // Trending mode - fetch both movies and TV
      const trendingEndpoints = [
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}&language=en-US`,
        `https://api.themoviedb.org/3/trending/tv/day?api_key=${TMDB_API_KEY}&language=en-US`
      ];

      for (const endpoint of trendingEndpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const data = await response.json();
            results.push(...(data.results || []).filter(isSupportedMedia));
          }
        } catch (e) {
          console.error('Trending fetch error:', e);
        }
      }
    }

    const deduped = dedupeResults(results);
    const final = deduped.slice(0, Math.max(requestedLimit, 24));

    if (final.length === 0) {
      return res.json(getFallbackMovies(query).slice(0, requestedLimit));
    }

    return res.json(final);
  } catch (error) {
    console.error('Failed to fetch TMDB media:', error);
    const fallback = getFallbackMovies(query);
    return res.json(fallback.slice(0, requestedLimit));
  }
}
