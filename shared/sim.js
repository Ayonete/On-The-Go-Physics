// Tiny canvas helper for lesson simulations.
// Fixed logical world (w × h) scaled to the element, DPR-aware, fixed-step loop
// that sleeps while off-screen. Assign sim.update(dt) and sim.draw(ctx, colors).
(() => {
  const COLOR_VARS = ["bg", "surface", "ink", "ink-soft", "line", "accent", "accent-soft", "warn", "danger"];

  function Sim(host, { w = 400, h = 250, step = 1 / 120 } = {}) {
    const canvas = document.createElement("canvas");
    canvas.className = "sim-canvas";
    canvas.style.aspectRatio = `${w} / ${h}`;
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const sim = { canvas, ctx, w, h, t: 0, colors: {}, pointer: { x: 0, y: 0, down: false }, update: null, draw: null };

    function readColors() {
      const cs = getComputedStyle(document.documentElement);
      for (const k of COLOR_VARS) sim.colors[k.replace("-", "")] = cs.getPropertyValue("--" + k).trim();
    }
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = canvas.clientWidth;
      if (!cw) return;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round((cw * h / w) * dpr);
      ctx.setTransform((cw / w) * dpr, 0, 0, (cw / w) * dpr, 0, 0);
    }
    readColors();
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", readColors);
    new ResizeObserver(resize).observe(canvas);

    const toWorld = e => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width * w, y: (e.clientY - r.top) / r.height * h };
    };
    canvas.addEventListener("pointerdown", e => {
      Object.assign(sim.pointer, toWorld(e), { down: true });
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", e => {
      const p = toWorld(e);
      if (sim.pointer.down && sim.onDrag) sim.onDrag(p.x - sim.pointer.x, p.y - sim.pointer.y);
      Object.assign(sim.pointer, p);
    });
    const up = () => { sim.pointer.down = false; };
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    let visible = false, acc = 0, last = 0, raf = 0;
    function frame(now) {
      if (!visible) return;
      acc += Math.min((now - last) / 1000, 0.1);
      last = now;
      while (acc >= step) { sim.update && sim.update(step); sim.t += step; acc -= step; }
      ctx.clearRect(0, 0, w, h);
      sim.draw && sim.draw(ctx, sim.colors);
      raf = requestAnimationFrame(frame);
    }
    new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) { resize(); last = performance.now(); raf = requestAnimationFrame(frame); }
    }).observe(canvas);

    return sim;
  }

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  Sim.ui = {
    row(host) { const r = el("div", "sim-controls"); host.appendChild(r); return r; },
    seg(row, labels, onPick, initial = 0) {
      const wrap = el("div", "seg");
      wrap.setAttribute("role", "group");
      const btns = labels.map((label, i) => {
        const b = el("button", "", label);
        b.type = "button";
        b.setAttribute("aria-pressed", String(i === initial));
        b.onclick = () => {
          btns.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
          onPick(label, i);
        };
        wrap.appendChild(b);
        return b;
      });
      row.appendChild(wrap);
      return wrap;
    },
    toggle(row, label, onChange, on = false) {
      const wrap = el("div", "seg");
      const b = el("button", "", label);
      b.type = "button";
      b.setAttribute("aria-pressed", String(on));
      b.onclick = () => {
        on = !on;
        b.setAttribute("aria-pressed", String(on));
        onChange(on);
      };
      wrap.appendChild(b);
      row.appendChild(wrap);
      return b;
    },
    slider(row, label, { min, max, step = 0.01, value }, onInput) {
      const lab = el("label", "sim-slider");
      lab.append(el("span", "", label));
      const input = el("input");
      Object.assign(input, { type: "range", min, max, step, value });
      input.oninput = () => onInput(+input.value);
      lab.append(input);
      row.appendChild(lab);
      return input;
    },
    button(row, label, onClick, cls = "btn small ghost") {
      const b = el("button", cls, label);
      b.type = "button";
      b.onclick = onClick;
      row.appendChild(b);
      return b;
    },
    readout(row) { const r = el("span", "readout"); row.appendChild(r); return r; },
    info(host) { const p = el("p", "sim-info"); host.appendChild(p); return p; },
  };

  // Standard normal random number (Box–Muller).
  Sim.gauss = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());

  window.Sim = Sim;
})();
