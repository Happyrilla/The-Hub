(function() {
  const b = (localStorage.getItem("panicbutton") || "p").toLowerCase();
  const l = localStorage.getItem("paniclink");

  window.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === b) {
      if (sentence.includes("https://")) {
        window.location.href = l;
      } else {
        window.location.href = "https://" + l;
      }
}});
})();
