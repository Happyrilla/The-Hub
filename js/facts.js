// i found this script online. this isnt mine. you can take it if you want
document.addEventListener("DOMContentLoaded", function () {

  const isGitHubPages = window.location.hostname.includes("github.io");
  const basePath = isGitHubPages ? "/The-Hub" : "";

  fetch(`${basePath}/assets/facts.JSON`)
    .then((response) => response.json())
    .then((data) => {

      const factEl = document.getElementById("fact");

      const setRandomFact = () => {
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        factEl.innerHTML = randomQuote;
      };

      setRandomFact();

      factEl.addEventListener("click", setRandomFact);

    })
    .catch(() => {
      document.getElementById("fact").innerHTML =
        "idk what happened something broke";
    });

});