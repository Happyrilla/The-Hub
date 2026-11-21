if (!location.hostname.endsWith("github.io")) {
  ["/_vercel/insights/script.js", "/_vercel/speed-insights/script.js"].forEach(src => {
    const script = document.createElement("script");
    script.defer = true;
    script.src = src;
    document.head.appendChild(script);
  });
}
