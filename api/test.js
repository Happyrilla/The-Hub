export default function handler(request, response) {
  // Her har Vercel lov til å bruke process.env!
  const dashboardVerdi = process.env.ello;
  response.status(200).json({ verdi: dashboardVerdi });
}
console.log(dashboardVerdi)