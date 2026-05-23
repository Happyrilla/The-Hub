exports.handler = async function (event) {
  const API_KEY = process.env.TMDB_KEY;
  const q = event.queryStringParameters.q || "matrix";

  const url =
    "https://api.themoviedb.org/3/search/movie?api_key=" +
    API_KEY +
    "&query=" +
    encodeURIComponent(q);

  const res = await fetch(url);
  const data = await res.json();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type"
    },
    body: JSON.stringify(data)
  };
};