let button = localStorage.getItem("panicbutton");
let link = localStorage.getItem("paniclink");

document.addEventListener("keydown", (event) => {
    if (event.key === button) {
        if (link === null) {
            window.location.href = "https://google.com";
        } else {
            window.location.href = link;
        }
    }
});