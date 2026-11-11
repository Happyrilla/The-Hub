function search(value) {
  const searchInput = document.querySelector(".searchbar") || document.getElementById("search");
  const searchbarVal = (value ?? searchInput?.value ?? "").toLowerCase().trim();
  const games = document.getElementsByClassName("gamesy");

  for (let i = 0; i < games.length; i++) {
    const name = (games[i].dataset.name || "").toLowerCase();
    games[i].style.display = name.includes(searchbarVal) ? "inline-block" : "none";
  }
}

fetch('../assets/games.json')
  .then(response => {
    if (!response.ok) throw new Error(`Failed to load games: ${response.status}`);
    return response.json();
  })
  .then(games => {
    const container = document.querySelector('.games');
    if (!container) return;

    games.forEach(game => {
      const image = document.createElement('img');
      image.src = game.image;
      image.alt = game.name;
      image.className = 'gamesy';
      image.dataset.name = game.name;
      image.setAttribute('data-tilt', '');
      image.addEventListener('click', () => {
        window.location.href = game.link;
      });
      container.appendChild(image);
    });

    if (window.VanillaTilt) {
      window.VanillaTilt.init(container.querySelectorAll('[data-tilt]'));
    }

    if (typeof updateGameCountLabel === 'function') updateGameCountLabel();
  })
  .catch(error => console.error(error));
