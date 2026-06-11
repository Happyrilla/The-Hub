document.addEventListener("DOMContentLoaded", (event) => {
    let idk = localStorage.getItem("title")
    let favi = localStorage.getItem("favicon")
    function setTitle(value) { document.title = value; localStorage.setItem("title", value) }
    function setfavicon(icon) { document.querySelector("link[rel*='icon']").href = icon; localStorage.setItem("favicon", icon) }
    if (idk === null) {
        setTitle("Google")
    } else {
        setTitle(idk);
        console.log("the title set is:", idk, "you can change it in the settings");
    }
    if (favi === null) {
        setfavicon("https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico");
    } else {
        setfavicon(favi)
    }
})