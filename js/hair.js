function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

if (getRandomInt(1, 2) === 1) {
  if (window.location.hostname.endsWith('vercel.app')) {
    const size = getRandomInt(50, 200);
    const img = document.createElement('img');
    img.src = "/assets/hair.png";
    img.width = size;
    img.height = size;
    img.style.position = 'fixed';
    img.style.left = `${getRandomInt(0, window.innerWidth - size)}px`;
    img.style.top = `${getRandomInt(0, window.innerHeight - size)}px`;
    img.style.pointerEvents = 'none';
    document.body.appendChild(img);
  }
}