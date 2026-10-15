// Experience scaffold: crisp canvas sized to its container, fixed-step loop.
(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener("resize", resize);
  resize();

  const STEP = 1 / 120;
  let acc = 0, last = performance.now();

  function update(dt) { /* physics */ }
  function draw() {
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
  }

  function frame(now) {
    acc += Math.min((now - last) / 1000, 0.25);
    last = now;
    while (acc >= STEP) { update(STEP); acc -= STEP; }
    draw();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
