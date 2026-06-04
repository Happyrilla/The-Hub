let idk = localStorage.getItem("title")
let favi = localStorage.getItem("favicon")
function setTitle(value) {document.title = value || "Google";}
function setfavicon(icon) { (document.querySelector("link[rel='icon']") === icon)}
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