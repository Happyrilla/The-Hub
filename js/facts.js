// i found this script online. this isnt mine. you can take it if you want
document.addEventListener("DOMContentLoaded", function () {
  fetch("../assets/facts.JSON")
    .then((response) => response.json())
    .then((data) => {
      const randomQuote = data[Math.floor(Math.random() * data.length)];
      document.getElementById("fact").innerHTML = randomQuote;

      document.getElementById("fact").addEventListener("click", function () {
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        document.getElementById("fact").innerHTML = randomQuote;
      });
    })
    .catch((error) => {
      document.getElementById("fact").innerHTML =
        "idk what happened something broke";
    });
});