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
      const isBatteryFact = (quote) =>
        typeof quote === "string" && quote.trim().toLowerCase() === batteryFactText.toLowerCase();

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
          factEl.innerHTML = randomQuote;
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