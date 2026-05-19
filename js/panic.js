(function(){
  const b = localStorage.getItem("panicbutton") || "p";
  const l = localStorage.getItem("paniclink") || "https://www.google.com";
  window.addEventListener("keydown", e => { if (e.key === b) window.location.href = l; });
})();
