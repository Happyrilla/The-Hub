(() => {
    const navigation = `
<div id="sub">
    <a href="../" style="margin-left: 10px;"> <i class="fa-regular fa-face-smile"></i> The Hub</a>
    <a href="/g"><span><i class="fa-solid fa-gamepad" style="font-size: 30px;"></i> Games</span></a>
    <a href="/l"><i class="fa-solid fa-link"></i> Links</a>
    <a href="/m"><i class="fa-solid fa-tv"></i> Media</a>
    <a href="/s"> <i class="fa-solid fa-gear"></i> Settings</a>
</div>`;

    function injectNavigation() {
        if (!document.getElementById("sub") && !document.body.hasAttribute("data-no-nav")) {
            document.body.insertAdjacentHTML("afterbegin", navigation);
        }

        const nav = document.getElementById("sub");
        if (nav) {
            const storedValue = localStorage.getItem("navtrans");
            const sliderValue = storedValue === null ? 7 : Number(storedValue);
            const opacity = Number.isFinite(sliderValue)
                ? Math.min(10, Math.max(0, sliderValue)) / 10
                : 0.7;
            nav.style.setProperty("--nav-opacity", String(opacity));
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectNavigation, { once: true });
    } else {
        injectNavigation();
    }
})();
