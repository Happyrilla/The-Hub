if (!window.location.hostname.endsWith('vercel.app')) {
    if (!window.location.hostname.includes('sub-sites')) {
        document.querySelector('a[href="/g"]').href = "./sub-sites/games.html";
        document.querySelector('a[href="/l"]').href = "./sub-sites/links.html";
        document.querySelector('a[href="/m"]').href = "./sub-sites/movies.html";
        document.querySelector('a[href="/s"]').href = "./sub-sites/settings.html";
    } else {
        document.querySelector('a[href="../"]').href = "../index.html";
        document.querySelector('a[href="/g"]').href = "./games.html";
        document.querySelector('a[href="/l"]').href = "./links.html";
        document.querySelector('a[href="/m"]').href = "./movies.html";
        document.querySelector('a[href="/s"]').href = "./settings.html";
    }
};