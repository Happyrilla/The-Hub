"use strict";

(function initBlocksBackground() {
  let blocksForeground = false;
  try {
    const blocksSetting = localStorage.getItem("blocks");
    console.info('[Blocks] localStorage["blocks"] =', blocksSetting);
    if (blocksSetting !== "ok") return;
    blocksForeground = localStorage.getItem("blocksForeground") === "ok";
  } catch (error) {
    console.warn("[Blocks] Could not read localStorage; background effect disabled.", error);
    return;
  }

  function readNumberSetting(key, fallback, min, max, step) {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return fallback;
      const value = Number(stored);
      const stepPosition = (value - min) / step;
      if (
        Number.isFinite(value) &&
        value >= min &&
        value <= max &&
        Math.abs(stepPosition - Math.round(stepPosition)) < 1e-8
      ) {
        return value;
      }
      console.warn("[Blocks] Invalid " + key + " setting; using default.", stored);
    } catch (error) {
      console.warn("[Blocks] Could not read " + key + "; using default.", error);
    }
    return fallback;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.id = "blocks-background";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const styles = document.createElement("style");
  styles.textContent = `
    body { isolation: isolate; }
    :where(body.blocks-foreground) :is(h1, h2, h3, h4, h5, h6, p, a, span, strong, em, b, i, small, li, dt, dd, label, button, legend, summary, td, th, figcaption, blockquote, pre, code, textarea, [contenteditable="true"]) {
      position: relative;
      z-index: 2;
    }
    #blocks-background {
      position: fixed;
      inset: 0;
      z-index: ${blocksForeground ? 1 : -1};
      width: 100vw;
      height: 100vh;
      pointer-events: none;
    }
  `;
  document.head.appendChild(styles);

  function setBlocksForeground(enabled) {
    document.body.classList.toggle("blocks-foreground", enabled);
    canvas.style.zIndex = enabled ? "1" : "-1";
  }

  setBlocksForeground(blocksForeground);
  window.addEventListener("blocksForegroundChange", event => {
    setBlocksForeground(event.detail === true);
  });

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    styles.remove();
    return;
  }

  const CELL = readNumberSetting("blocksCell", 16, 4, 64, 1);
  const REACH = readNumberSetting("blocksReach", 2.5, 0.5, 8, 0.1);
  const MAX_LIT = Math.max(1, Math.round(300 * (16 / CELL) ** 2));
  const FADE_IN = 160;
  const FADE_OUT = 750;
  const TINTS = [72, 65, 58, 51, 44];
  const cells = new Map();

  let cols = 1;
  let rows = 1;
  let width = 0;
  let height = 0;
  let frame = 0;

  const easeOut = t => 1 - (1 - t) * (1 - t);
  const easeIn = t => t * t;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    cols = Math.max(1, Math.ceil(width / CELL));
    rows = Math.max(1, Math.ceil(height / CELL));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    wake();
  }

  function colourFor(row) {
    const t = rows > 1 ? row / (rows - 1) : 0;
    const hue = t * 360;
    const tint = TINTS[Math.floor(Math.random() * TINTS.length)];
    return `hsl(${Math.round(hue)} 94% ${tint}%)`;
  }

  function draw(now) {
    frame = 0;
    ctx.clearRect(0, 0, width, height);

    for (const [key, cell] of cells) {
      let alpha;
      if (now < cell.until) {
        alpha = easeOut(Math.min(1, (now - cell.born) / FADE_IN));
      } else {
        const t = (now - cell.until) / FADE_OUT;
        if (t >= 1) {
          cells.delete(key);
          continue;
        }
        alpha = 1 - easeIn(t);
      }

      ctx.globalAlpha = alpha;
      ctx.fillStyle = cell.colour;
      ctx.fillRect(cell.col * CELL + 1, cell.row * CELL + 1, CELL - 1, CELL - 1);
    }

    ctx.globalAlpha = 1;
    if (cells.size) frame = requestAnimationFrame(draw);
  }

  function wake() {
    if (!frame) frame = requestAnimationFrame(draw);
  }

  function light(col, row, hold) {
    if (col < 0 || row < 0 || col >= cols || row >= rows) return;

    const key = `${col},${row}`;
    const now = performance.now();
    const existing = cells.get(key);
    if (existing && now < existing.until) return;
    if (!existing && cells.size >= MAX_LIT) return;

    let born = now;
    if (existing) {
      const faded = 1 - easeIn(Math.min(1, (now - existing.until) / FADE_OUT));
      born = now - (1 - Math.sqrt(1 - faded)) * FADE_IN;
    }

    cells.set(key, {
      col,
      row,
      colour: existing ? existing.colour : colourFor(row),
      born,
      until: now + hold
    });
    wake();
  }

  function lightAround(x, y, radius, hold) {
    const cx = Math.floor(x / CELL);
    const cy = Math.floor(y / CELL);
    const span = Math.ceil(radius);

    for (let dy = -span; dy <= span; dy++) {
      for (let dx = -span; dx <= span; dx++) {
        const distance = Math.hypot(dx, dy);
        if (distance > radius) continue;
        light(cx + dx, cy + dy, hold * (1 - distance / (radius + 0.6)));
      }
    }
  }

  let visible = true;
  let beat;
  let pointerFrame = 0;
  let pointer = null;

  function paintPointer() {
    pointerFrame = 0;
    if (!pointer) return;

    const cx = Math.floor(pointer.x / CELL);
    const cy = Math.floor(pointer.y / CELL);
    for (let dy = -Math.ceil(REACH); dy <= Math.ceil(REACH); dy++) {
      for (let dx = -Math.ceil(REACH); dx <= Math.ceil(REACH); dx++) {
        const distance = Math.hypot(dx, dy);
        if (distance > REACH || Math.random() > 1 - distance / (REACH + 0.6)) continue;
        light(cx + dx, cy + dy, 260 + Math.random() * 900);
      }
    }
  }

  function drift() {
    beat = window.setTimeout(drift, 1800 + Math.random() * 2200);
    if (!visible || document.hidden) return;

    const x = Math.random() * width;
    const y = Math.random() * height;
    lightAround(x, y, 1.4 + Math.random() * 1.6, 500 + Math.random() * 1300);
  }

  const observer = new IntersectionObserver(entries => {
    visible = entries[0] ? entries[0].isIntersecting : true;
  });
  observer.observe(canvas);

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", event => {
    pointer = { x: event.clientX, y: event.clientY };
    if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
  }, { passive: true });

  resize();
  beat = window.setTimeout(drift, 700);
})();
