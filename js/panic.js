var panicb = localStorage.getItem("panicbutton") || "]";
var panicL = localStorage.getItem("panicLink") || "https://google.com";

document.addEventListener("keydown", function (e) {
  if (e.key === panicb) {
    window.location.href = panicL;
  }
});