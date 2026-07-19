const hub = "https://the-hubb.vercel.app";

function enableShortcuts() {
    document.addEventListener('keydown', (event) => {
        if (!event || event.defaultPrevented) return;
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
        const key = (event.key || '').toLowerCase();
        if (key === 'h') {
            window.location.href = hub;
        } else if (key === 'g') {
            window.location.href = hub + '/sub-sites/games.html';
        } else if (key === 'l') {
            window.location.href = hub + '/sub-sites/links.html';n
        } else if (key === 'm') {
            window.location.href = hub + '/sub-sites/media.html';
        } else if (key === 's') {
            window.location.href = hub + '/sub-sites/settings.html';
        } else if (key === 'd') {
            window.location.href = hub + '/sub-sites/dashboard.html';
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const local = localStorage.getItem('shortcut?');
    if (local === 'true') {
        enableShortcuts();
    } else {
        console.log('Shortcuts are not Activated');
    }
});

function on() {
    localStorage.setItem('shortcut?', 'true');
    enableShortcuts();
}