function search(value) {
  const searchInput = document.querySelector(".searchbar") || document.getElementById("search");
  const searchbarVal = (value ?? searchInput?.value ?? "").toLowerCase().trim();
  const games = document.getElementsByClassName("gamesy");

  for (let i = 0; i < games.length; i++) {
    const name = (games[i].dataset.name || "").toLowerCase();
    games[i].style.display = name.includes(searchbarVal) ? "inline-block" : "none";
  }
}