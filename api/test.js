module.exports = function(req, res) {
  try {
    // Hent variabelen din fra Vercel Dashboard
    const dashboardVerdi = process.env.ello;
    
    // Hvis variabelen er tom, sender vi en hjelpetekst i stedet for å krasje
    const svarVerdi = dashboardVerdi || "Fant ikke variabelen 'ello' i Vercel Dashboard";
    
    res.status(200).json({ verdi: svarVerdi });
  } catch (error) {
    res.status(500).json({ feilmelding: error.message });
  }
};
console.log(svarVerdi)