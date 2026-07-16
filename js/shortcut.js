const local = localStorage.getItem("shortcut?");
const hub = "https://the-hubb.vercel.app"

document.addEventListener("DOMContentLoaded", function () {
    if (local === "true") {
        document.addEventListener('keydown', (event) => {
            if (event === "h") {
                window.location.href = hub
            } else if (event === "g") {
                window.location.href = hub + "/sub-sites/games.html"
            } else if (event === "l") {
                window.location.href = hub + "/sub-sites/links.html"
            } else if (event === "m") {
                window.location.href = hub + "/sub-sites/media.html"
            } else if (event === "s") {
                window.location.href = hub + "/sub-sites/settings.html"
            }
        });
    } else {console.log("Shortcuts are not Activated")}
});
function on() {localStorage.setItem("shortcut?", "true")}