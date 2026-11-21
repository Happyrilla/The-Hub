const js = [
  "customizer.js",
  "blocks.js",
  "navigation.js",
  "shortcut.js",
  "panic.js",
  "replace.js",
  "hair.js"
]

const mainScript = document.currentScript;

const vercelScript = document.createElement("script");
vercelScript.src = new URL("vercel.js", mainScript.src).href;
document.head.appendChild(vercelScript);

function loadScripts() {
  js.forEach(file => {
    const script = document.createElement("script");
    script.src = new URL(file, mainScript.src).href;
    script.async = false;
    document.head.appendChild(script);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadScripts, { once: true });
} else {
  loadScripts();
}