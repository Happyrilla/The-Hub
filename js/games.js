function gamer(value) {
    fetch("/api/test")
    .then(res => res.json())
    .then(data => {
    if (value === data.value) {
        window.location.href = "../sub-sites/devdash.html";
    } else {
        localStorage.setItem("iscool?", "yes")
    }
  });};