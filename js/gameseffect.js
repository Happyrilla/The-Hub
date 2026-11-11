"use strict";

(function initMatrixBackground() {
  const start = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let canvas = document.getElementById("matrix-bg");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "matrix-bg";
      document.body.prepend(canvas);
    }
    canvas.setAttribute("aria-hidden", "true");

    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      zIndex: "-1",
      pointerEvents: "none"
    });

    const context = canvas.getContext("2d");
    if (!context) {
      console.warn("[Matrix background] Canvas rendering is unavailable.");
      return;
    }

    const fontSize = 20;
    const bits = ["0", "1"];
    let drops = [];
    let width = 0;
    let height = 0;
    let colorKey = "";
    let animationFrame = 0;
    let lastFrame = 0;
    let resetFrames = 0;

    function primaryColor() {
      const value = getComputedStyle(document.body)
        .getPropertyValue("--primary-orange")
        .trim();
      const hex = value.match(/^#([0-9a-f]{6})$/i);
      if (hex) {
        return [
          parseInt(hex[1].slice(0, 2), 16),
          parseInt(hex[1].slice(2, 4), 16),
          parseInt(hex[1].slice(4, 6), 16)
        ];
      }

      const rgb = value.match(/^rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/i);
      if (rgb) return rgb.slice(1).map(Number);
      return [194, 124, 21];
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const columnCount = Math.max(1, Math.floor(width / fontSize));
      drops = Array.from({ length: columnCount }, () =>
        Math.floor(Math.random() * height / fontSize)
      );
      context.clearRect(0, 0, width, height);
      resetFrames = 14;
      lastFrame = 0;
      if (!document.hidden && !animationFrame) {
        animationFrame = requestAnimationFrame(draw);
      }
    }

    function draw(now) {
      animationFrame = 0;
      if (document.hidden) return;
      if (now - lastFrame < 1000 / 55) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;

      const [red, green, blue] = primaryColor();
      const nextColorKey = `${red},${green},${blue}`;
      if (colorKey !== nextColorKey) {
        colorKey = nextColorKey;
        resetFrames = 22;
        context.clearRect(0, 0, width, height);
      }

      const trail = [red, green, blue].map(value =>
        Math.max(2, Math.round(value * 0.1))
      );
      context.fillStyle = `rgba(${trail.join(",")},${resetFrames ? 0.46 : 0.1})`;
      context.fillRect(0, 0, width, height);
      context.fillStyle = `rgb(${Math.min(255, red + 14)},${Math.min(255, green + 14)},${Math.min(255, blue + 14)})`;
      context.font = `${fontSize}px monospace`;

      for (let column = 0; column < drops.length; column++) {
        const y = drops[column] * fontSize;
        context.fillText(bits[Math.random() < 0.5 ? 0 : 1], column * fontSize, y);
        drops[column] = y > height && Math.random() > 0.972
          ? 0
          : drops[column] + 1.06;
      }

      if (resetFrames > 0) resetFrames--;
      animationFrame = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else if (!animationFrame) {
        lastFrame = 0;
        animationFrame = requestAnimationFrame(draw);
      }
    });

    resize();
  };

  if (document.body) {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  }
})();