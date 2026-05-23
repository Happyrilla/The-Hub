exports.handler = async function () {
  const API_KEY = process.env.TMDB_KEY;

  const url =
    "https://api.themoviedb.org/3/movie/popular?api_key=" + API_KEY;

  const res = await fetch(url);
  const data = await res.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};