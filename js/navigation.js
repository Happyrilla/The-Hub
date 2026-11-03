(() => {
    const navigation = `
<div id="sub">
    <a href="../" style="margin-left: 10px;"> <i class="fa-regular fa-face-smile"></i> The Hub</a>
    <a href="../sub-sites/games.html"><span><i class="fa-solid fa-gamepad" style="font-size: 30px;"></i> Games</span></a>
    <a href="../sub-sites/links.html"><i class="fa-solid fa-link"></i> Links</a>
    <a href="../sub-sites/movies.html"><i class="fa-solid fa-tv"></i> Media</a>
    <a href="../sub-sites/settings.html"> <i class="fa-solid fa-gear"></i> Settings</a>
</div>`;

    function injectNavigation() {
        if (!document.getElementById("sub")) {
            document.body.insertAdjacentHTML("afterbegin", navigation);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectNavigation, { once: true });
    } else {
        injectNavigation();
    }
})();
