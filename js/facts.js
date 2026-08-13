// i found this script online. this isnt mine. you can take it if you want
document.addEventListener("DOMContentLoaded", function () {

  const isGitHubPages = window.location.hostname.includes("github.io");
  const basePath = isGitHubPages ? "/The-Hub" : "";
  const factEl = document.getElementById("fact");

  if (!factEl) return;

  fetch(`${basePath}/assets/facts.JSON`)
    .then((response) => response.json())
    .then((data) => {

      const batteryFactText = "your battery percentage is:";
      const gameFactText = "Did you know we have";
      const isBatteryFact = (quote) =>
        typeof quote === "string" && quote.trim().toLowerCase() === batteryFactText.toLowerCase();
      const isGameFact = (quote) =>
        typeof quote === "string" && quote.trim().toLowerCase() === gameFactText.toLowerCase();

      const setRandomFact = () => {
        const randomQuote = data[Math.floor(Math.random() * data.length)];

        if (isBatteryFact(randomQuote)) {
          if ("getBattery" in navigator) {
            navigator.getBattery()
              .then((battery) => {
                const percentage = Math.round(battery.level * 100);
                factEl.textContent = batteryFactText + " " + percentage + "%";
              })
              .catch(() => {
                factEl.textContent = batteryFactText + " unavailable";
              });
          } else {
            factEl.textContent = batteryFactText + " unavailable";
          }
        } else {
          if (isGameFact(randomQuote)) {
            fetch("../sub-sites/games.html")
              .then((response) => response.text())
              .then((html) => {
                const doc = new DOMParser().parseFromString(html, "text/html");
                const gameCount = doc.querySelectorAll("img.gamesy").length;

                factEl.textContent = gameFactText + " " + gameCount + " games";

                // example: show it somewhere else
                const el = document.getElementById("gameCount");
                if (el) el.textContent = gameCount;
              })
              .catch((err) => {
                console.error("Could not load games page:", err);
              });
          } else {
          factEl.innerHTML = randomQuote;
          }
        }
      };

      setRandomFact();

      factEl.addEventListener("click", setRandomFact);

    })
    .catch(() => {
      factEl.innerHTML =
        "idk what happened something broke";
    });

});