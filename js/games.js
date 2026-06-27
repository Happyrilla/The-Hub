function search() {
  let searchbarVal = document.querySelector(".searchbar").value.toLowerCase();
  let games = document.getElementsByClassName("gamesy");

  for (let i = 0; i < games.length; i++) {
    let name = games[i].dataset.name.toLowerCase();

    if (name.includes(searchbarVal)) {
      games[i].style.display = "inline-block";
    } else {
      games[i].style.display = "none";
    }
  }
}