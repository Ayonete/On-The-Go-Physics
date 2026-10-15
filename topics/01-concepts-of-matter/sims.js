// Simulations for Topic 1: Concepts of Matter.
// Each takes (host, done) and calls done() once the learner has explored enough.
window.Sims = (() => {
  const { ui, gauss } = Sim;
  const TAU = Math.PI * 2;
  const WATER = "#3d9be0";

  function circle(ctx, x, y, r, fill, stroke) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  }

  // ── Zoom into a drop of water ────────────────────────────────────────────
  function zoom(host, done) {
    const W = 400, H = 250;
    const sim = Sim(host, { w: W, h: H });
    const LV = [
      ["× 1", "A drop of water, about 4 mm across. It looks smooth all the way through."],
      ["× 1 000", "Magnified a thousand times, it <i>still</i> looks smooth and continuous."],
      ["× 10 000 000", "Now we see it: water is made of tiny particles called <b>molecules</b>, and they never stop moving."],
      ["× 100 000 000", "One water molecule, H₂O: one oxygen atom joined to two hydrogen atoms."],
    ];
    let level = 0, t = 1;
    const mols = Array.from({ length: 70 }, () => ({ x: Math.random() * W, y: Math.random() * H, a: Math.random() * TAU }));
    const row = ui.row(host);
    const go = ui.button(row, "Zoom in +", () => {
      level = (level + 1) % 4;
      t = 0;
      go.textContent = level === 3 ? "Zoom back out" : "Zoom in +";
      mag.textContent = LV[level][0];
      info.innerHTML = LV[level][1];
      if (level === 3) done();
    }, "btn small");
    const mag = ui.readout(row);
    const info = ui.info(host);
    mag.textContent = LV[0][0];
    info.innerHTML = LV[0][1];

    sim.update = dt => {
      t = Math.min(1, t + dt / 0.7);
      for (const m of mols) {
        m.x = (m.x + (Math.random() - 0.5) * 1.6 + W) % W;
        m.y = (m.y + (Math.random() - 0.5) * 1.6 + H) % H;
        m.a += (Math.random() - 0.5) * 0.12;
      }
    };
    const molecule = (ctx, x, y, a, s, c) => {
      const hx = d => x + Math.cos(a + d) * s * 1.3, hy = d => y + Math.sin(a + d) * s * 1.3;
      const bond = 0.91; // half of 104.5°
      circle(ctx, hx(bond), hy(bond), s * 0.62, "#f4f4f4", c.inksoft);
      circle(ctx, hx(-bond), hy(-bond), s * 0.62, "#f4f4f4", c.inksoft);
      circle(ctx, x, y, s, "#e0533d");
    };
    sim.draw = (ctx, c) => {
      const e = 1 - Math.pow(1 - t, 3);
      ctx.save();
      ctx.globalAlpha = e;
      ctx.translate(W / 2, H / 2);
      const s = 0.55 + 0.45 * e;
      ctx.scale(s, s);
      ctx.translate(-W / 2, -H / 2);
      if (level === 0) {
        ctx.beginPath();
        ctx.moveTo(200, 62);
        ctx.quadraticCurveTo(246, 128, 246, 160);
        ctx.arc(200, 160, 46, 0, Math.PI);
        ctx.quadraticCurveTo(154, 128, 200, 62);
        ctx.fillStyle = WATER;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(184, 150, 7, 13, -0.3, 0, TAU);
        ctx.fillStyle = "rgba(255,255,255,.55)";
        ctx.fill();
      } else if (level === 1) {
        const g = ctx.createRadialGradient(200, 125, 20, 200, 125, 260);
        g.addColorStop(0, "#6db6ec");
        g.addColorStop(1, WATER);
        ctx.fillStyle = g;
        ctx.fillRect(-100, -100, W + 200, H + 200);
      } else if (level === 2) {
        ctx.fillStyle = "rgba(61,155,224,.14)";
        ctx.fillRect(-100, -100, W + 200, H + 200);
        for (const m of mols) molecule(ctx, m.x, m.y, m.a, 7, c);
      } else {
        const jx = Math.sin(sim.t * 9) * 1.2, jy = Math.cos(sim.t * 7) * 1.2;
        molecule(ctx, 200 + jx, 140 + jy, -Math.PI / 2, 46, c);
        ctx.fillStyle = "#fff";
        ctx.font = "600 26px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("O", 200 + jx, 142 + jy);
        ctx.fillStyle = "#444";
        ctx.font = "600 18px system-ui, sans-serif";
        for (const d of [0.91, -0.91]) {
          const a = -Math.PI / 2 + d;
          ctx.fillText("H", 200 + jx + Math.cos(a) * 60, 141 + jy + Math.sin(a) * 60);
        }
      }
      ctx.restore();
    };
  }

  // ── Solid, liquid, gas ───────────────────────────────────────────────────
  function states(host, done) {
    const W = 400, H = 250, R = 7, S = 14.6, COLS = 8, ROWS = 6;
    const box = { x0: 16, y0: 12, x1: 384, y1: 238 };
    const sim = Sim(host, { w: W, h: H });
    const INFO = {
      Solid: "<b>Solid:</b> particles are packed closely in a regular pattern. Strong forces hold them, so they can only <b>vibrate about fixed positions</b>. Fixed shape, fixed volume, very hard to compress.",
      Liquid: "<b>Liquid:</b> particles are still close together, but the forces are weaker, so they can <b>slide past one another</b>. It takes the shape of its container but keeps its volume.",
      Gas: "<b>Gas:</b> particles are <b>far apart</b> and move fast in all directions. The forces between them are almost zero, so a gas fills its whole container and is easy to compress.",
    };
    const slots = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) slots.push({ x: W / 2 - ((COLS - 1) / 2) * S + c * S, y: box.y1 - R - 1 - r * S });
    const P = slots.map(s => ({ x: s.x, y: s.y, vx: 0, vy: 0, ax: 0, ay: 0, hx: s.x, hy: s.y }));
    let mode = "Solid";
    const seen = new Set([mode]);

    const row = ui.row(host);
    ui.seg(row, ["Solid", "Liquid", "Gas"], m => {
      if (m === "Solid" && mode !== "Solid") anchor();
      mode = m;
      seen.add(m);
      info.innerHTML = INFO[m];
      if (seen.size === 3) done();
    });
    const info = ui.info(host);
    info.innerHTML = INFO.Solid;

    function anchor() {
      const ps = [...P].sort((a, b) => b.y - a.y);
      for (let r = 0; r < ROWS; r++) {
        ps.slice(r * COLS, r * COLS + COLS).sort((a, b) => a.x - b.x).forEach((p, c) => {
          p.hx = slots[r * COLS + c].x;
          p.hy = slots[r * COLS + c].y;
        });
      }
    }

    sim.update = dt => {
      for (const p of P) { p.ax = 0; p.ay = 0; }
      if (mode === "Solid") {
        for (const p of P) {
          p.ax = -900 * (p.x - p.hx);
          p.ay = -900 * (p.y - p.hy);
          p.vx = p.vx * 0.96 + (Math.random() - 0.5) * 40;
          p.vy = p.vy * 0.96 + (Math.random() - 0.5) * 40;
        }
      } else {
        const reach = 2 * R * 1.6;
        for (let i = 0; i < P.length; i++) {
          const a = P[i];
          for (let j = i + 1; j < P.length; j++) {
            const b = P[j];
            const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
            if (d2 > reach * reach || d2 === 0) continue;
            const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
            let f = 0;
            if (d < 2 * R) f = 2500 * (2 * R - d);
            else if (mode === "Liquid") f = -70;
            a.ax -= f * nx; a.ay -= f * ny;
            b.ax += f * nx; b.ay += f * ny;
          }
        }
        const vT = mode === "Liquid" ? 55 : 170;
        let mean = 0;
        for (const p of P) mean += Math.hypot(p.vx, p.vy);
        mean = Math.max(mean / P.length, 1);
        const k = 1 + (vT / mean - 1) * 0.03;
        for (const p of P) {
          if (mode === "Liquid") p.ay += 420;
          p.vx *= k; p.vy *= k;
        }
      }
      const e = mode === "Gas" ? 1 : 0.5;
      for (const p of P) {
        p.vx += p.ax * dt; p.vy += p.ay * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < box.x0 + R) { p.x = box.x0 + R; p.vx = Math.abs(p.vx) * e; }
        if (p.x > box.x1 - R) { p.x = box.x1 - R; p.vx = -Math.abs(p.vx) * e; }
        if (p.y < box.y0 + R) { p.y = box.y0 + R; p.vy = Math.abs(p.vy) * e; }
        if (p.y > box.y1 - R) { p.y = box.y1 - R; p.vy = -Math.abs(p.vy) * e; }
      }
    };
    sim.draw = (ctx, c) => {
      ctx.strokeStyle = c.inksoft;
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x0 - 1, box.y0 - 1, box.x1 - box.x0 + 2, box.y1 - box.y0 + 2);
      for (const p of P) circle(ctx, p.x, p.y, R - 0.5, c.accent);
    };
  }

  // ── Brownian motion in a smoke cell ──────────────────────────────────────
  function brownian(host, done) {
    const W = 400, H = 250, CX = 200, CY = 125, VIEW = 112;
    const sim = Sim(host, { w: W, h: H });
    const big = { x: CX, y: CY, vx: 0, vy: 0, R: 6, M: 14 };
    const trail = [];
    let speed = 140, show = false, tick = 0;
    const N = 170, r = 1.6;
    const box = { x0: CX - 150, x1: CX + 150, y0: 4, y1: H - 4 };
    const mols = Array.from({ length: N }, () => ({
      x: box.x0 + Math.random() * (box.x1 - box.x0),
      y: box.y0 + Math.random() * (box.y1 - box.y0),
      vx: gauss() * speed, vy: gauss() * speed,
    }));

    const row = ui.row(host);
    ui.toggle(row, "Show air molecules", on => { show = on; if (on) done(); });
    ui.seg(row, ["Cool", "Warm", "Hot"], (_, i) => {
      const next = [80, 140, 230][i];
      for (const m of mols) { m.vx *= next / speed; m.vy *= next / speed; }
      speed = next;
    }, 1);

    sim.update = dt => {
      for (const m of mols) {
        m.x += m.vx * dt; m.y += m.vy * dt;
        if (m.x < box.x0) { m.x = box.x0; m.vx = Math.abs(m.vx); }
        if (m.x > box.x1) { m.x = box.x1; m.vx = -Math.abs(m.vx); }
        if (m.y < box.y0) { m.y = box.y0; m.vy = Math.abs(m.vy); }
        if (m.y > box.y1) { m.y = box.y1; m.vy = -Math.abs(m.vy); }
        const dx = m.x - big.x, dy = m.y - big.y, d = Math.hypot(dx, dy);
        if (d < big.R + r && d > 0) {
          const nx = dx / d, ny = dy / d;
          const vrel = (m.vx - big.vx) * nx + (m.vy - big.vy) * ny;
          if (vrel < 0) {
            const j = (-2 * vrel) / (1 + 1 / big.M);
            m.vx += j * nx; m.vy += j * ny;
            big.vx -= (j * nx) / big.M; big.vy -= (j * ny) / big.M;
          }
          m.x = big.x + nx * (big.R + r);
          m.y = big.y + ny * (big.R + r);
        }
      }
      // A very gentle pull keeps the speck inside the microscope's field of view.
      big.vx += (CX - big.x) * 0.25 * dt;
      big.vy += (CY - big.y) * 0.25 * dt;
      big.x += big.vx * dt; big.y += big.vy * dt;
      if (++tick % 4 === 0) { trail.push(big.x, big.y); if (trail.length > 700) trail.splice(0, 2); }
    };
    sim.draw = (ctx, c) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, VIEW, 0, TAU);
      ctx.fillStyle = "#0c0e12";
      ctx.fill();
      ctx.clip();
      if (trail.length > 2) {
        ctx.beginPath();
        ctx.moveTo(trail[0], trail[1]);
        for (let i = 2; i < trail.length; i += 2) ctx.lineTo(trail[i], trail[i + 1]);
        ctx.strokeStyle = "rgba(47,191,134,.55)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      if (show) for (const m of mols) circle(ctx, m.x, m.y, r, "rgba(110,170,255,.8)");
      const g = ctx.createRadialGradient(big.x, big.y, 0, big.x, big.y, big.R * 2.4);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.4, "rgba(255,255,240,.9)");
      g.addColorStop(1, "rgba(255,255,240,0)");
      circle(ctx, big.x, big.y, big.R * 2.4, g);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(CX, CY, VIEW, 0, TAU);
      ctx.strokeStyle = c.inksoft;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = c.inksoft;
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Microscope view", 8, 16);
    };
  }

  // ── Diffusion of two gases ───────────────────────────────────────────────
  function diffusion(host, done) {
    const W = 400, H = 250, r = 4.5, N = 75, MID = W / 2;
    const box = { x0: 10, x1: 390, y0: 10, y1: 240 };
    const sim = Sim(host, { w: W, h: H, step: 1 / 60 });
    let sigma = 45, wall = true, since = 0, mixedAt = null;
    let P = [];
    const reset = () => {
      P = [];
      for (let t = 0; t < 2; t++)
        for (let i = 0; i < N; i++)
          P.push({
            t,
            x: t ? MID + r + 2 + Math.random() * (box.x1 - MID - 2 * r - 2) : box.x0 + r + Math.random() * (MID - box.x0 - 2 * r - 2),
            y: box.y0 + r + Math.random() * (box.y1 - box.y0 - 2 * r),
            vx: gauss() * sigma, vy: gauss() * sigma,
          });
      wall = true; since = 0; mixedAt = null;
      lift.textContent = "Lift the partition";
    };

    const row = ui.row(host);
    const lift = ui.button(row, "Lift the partition", () => {
      if (wall) { wall = false; lift.textContent = "Reset"; done(); } else reset();
    }, "btn small");
    ui.seg(row, ["Cold", "Warm", "Hot"], (_, i) => {
      const next = [25, 45, 85][i];
      for (const p of P) { p.vx *= next / sigma; p.vy *= next / sigma; }
      sigma = next;
    }, 1);
    const out = ui.readout(row);
    reset();

    const mixing = () => {
      let a = 0;
      for (const p of P) if (p.t === 0 && p.x > MID) a++;
      return Math.min(100, Math.round((a / N) * 200));
    };

    sim.update = dt => {
      for (const p of P) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < box.x0 + r) { p.x = box.x0 + r; p.vx = Math.abs(p.vx); }
        if (p.x > box.x1 - r) { p.x = box.x1 - r; p.vx = -Math.abs(p.vx); }
        if (p.y < box.y0 + r) { p.y = box.y0 + r; p.vy = Math.abs(p.vy); }
        if (p.y > box.y1 - r) { p.y = box.y1 - r; p.vy = -Math.abs(p.vy); }
        if (wall) {
          if (p.t === 0 && p.x > MID - 1 - r) { p.x = MID - 1 - r; p.vx = -Math.abs(p.vx); }
          if (p.t === 1 && p.x < MID + 1 + r) { p.x = MID + 1 + r; p.vx = Math.abs(p.vx); }
        }
      }
      const D = 2 * r;
      for (let i = 0; i < P.length; i++) {
        const a = P[i];
        for (let j = i + 1; j < P.length; j++) {
          const b = P[j];
          const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
          if (d2 >= D * D || d2 === 0) continue;
          const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
          const vrel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (vrel < 0) {
            a.vx += vrel * nx; a.vy += vrel * ny;
            b.vx -= vrel * nx; b.vy -= vrel * ny;
          }
          const o = (D - d) / 2;
          a.x -= nx * o; a.y -= ny * o;
          b.x += nx * o; b.y += ny * o;
        }
      }
      if (!wall) {
        since += dt;
        const m = mixing();
        if (m >= 90 && mixedAt == null) mixedAt = since;
        out.textContent = mixedAt != null ? `Mixed in ${mixedAt.toFixed(1)} s` : `Mixing: ${m}% · ${since.toFixed(1)} s`;
      } else out.textContent = "";
    };
    sim.draw = (ctx, c) => {
      ctx.strokeStyle = c.inksoft;
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x0 - 1, box.y0 - 1, box.x1 - box.x0 + 2, box.y1 - box.y0 + 2);
      if (wall) { ctx.fillStyle = c.inksoft; ctx.fillRect(MID - 1.5, box.y0, 3, box.y1 - box.y0); }
      for (const p of P) circle(ctx, p.x, p.y, r - 0.4, p.t ? c.warn : c.accent);
    };
  }

  // ── Gas pressure in a cylinder with a piston ────────────────────────────
  function pressure(host, done) {
    const W = 400, H = 250, r = 4, N = 32;
    const x0 = 16, y0 = 44, y1 = 234, xFull = 380;
    const sim = Sim(host, { w: W, h: H });
    const SIG = [45, 70, 100];
    let sigma = SIG[1], xp = xFull, target = xFull, ema = 1, hitRate = 0;
    const touched = { v: false, t: false };
    const flashes = [];
    const P = Array.from({ length: N }, () => ({
      x: x0 + r + Math.random() * (xFull - x0 - 2 * r),
      y: y0 + r + Math.random() * (y1 - y0 - 2 * r),
      vx: gauss() * sigma, vy: gauss() * sigma,
    }));
    const Pref = (N * SIG[1] ** 2) / ((xFull - x0) * (y1 - y0));

    const row = ui.row(host);
    ui.slider(row, "Volume", { min: 0.35, max: 1, value: 1 }, v => {
      target = x0 + v * (xFull - x0);
      touched.v = true;
      if (touched.t) done();
    });
    ui.seg(row, ["Cool", "Warm", "Hot"], (_, i) => {
      for (const p of P) { p.vx *= SIG[i] / sigma; p.vy *= SIG[i] / sigma; }
      sigma = SIG[i];
      touched.t = true;
      if (touched.v) done();
    }, 1);

    sim.update = dt => {
      xp += (target - xp) * Math.min(1, dt * 6);
      let impulse = 0, hits = 0;
      const hit = (p, v, fx, fy) => { impulse += 2 * Math.abs(v); hits++; if (Math.random() < 0.5) flashes.push({ x: fx, y: fy, life: 1 }); };
      for (const p of P) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < x0 + r) { p.x = x0 + r; if (p.vx < 0) { hit(p, p.vx, x0, p.y); p.vx = -p.vx; } }
        if (p.x > xp - r) { p.x = xp - r; if (p.vx > 0) { hit(p, p.vx, xp, p.y); p.vx = -p.vx; } }
        if (p.y < y0 + r) { p.y = y0 + r; if (p.vy < 0) { hit(p, p.vy, p.x, y0); p.vy = -p.vy; } }
        if (p.y > y1 - r) { p.y = y1 - r; if (p.vy > 0) { hit(p, p.vy, p.x, y1); p.vy = -p.vy; } }
      }
      const perim = 2 * (xp - x0 + (y1 - y0));
      ema += ((impulse / dt / perim) / Pref - ema) * dt / 1.2;
      hitRate += (hits / dt - hitRate) * dt / 1.2;
      for (const f of flashes) f.life -= dt * 4;
      while (flashes.length && flashes[0].life <= 0) flashes.shift();
    };
    sim.draw = (ctx, c) => {
      ctx.strokeStyle = c.inksoft;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(xFull + 4, y0 - 1.5); ctx.lineTo(x0 - 1.5, y0 - 1.5); ctx.lineTo(x0 - 1.5, y1 + 1.5); ctx.lineTo(xFull + 4, y1 + 1.5);
      ctx.stroke();
      ctx.fillStyle = c.ink;
      ctx.fillRect(xp, y0, 7, y1 - y0);
      ctx.fillRect(xp + 7, (y0 + y1) / 2 - 2, W - xp, 4);
      for (const f of flashes) {
        ctx.strokeStyle = `rgba(217,130,43,${f.life})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 4 + (1 - f.life) * 6, 0, TAU);
        ctx.stroke();
      }
      for (const p of P) circle(ctx, p.x, p.y, r - 0.3, c.accent);
      // Gauge
      const ratio = Math.max(0, ema);
      ctx.fillStyle = c.ink;
      ctx.font = "600 13px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Pressure ${ratio.toFixed(1)}×`, x0, 18);
      ctx.fillStyle = c.inksoft;
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillText(`${Math.round(hitRate)} wall hits per second`, x0, 33);
      const gx = 190, gw = 190;
      ctx.fillStyle = c.line;
      ctx.fillRect(gx, 10, gw, 10);
      ctx.fillStyle = ratio > 2.5 ? c.danger : c.accent;
      ctx.fillRect(gx, 10, Math.min(1, ratio / 4) * gw, 10);
      ctx.fillStyle = c.inksoft;
      ctx.fillRect(gx + gw / 4 - 1, 8, 2, 14);
      ctx.fillText("1×", gx + gw / 4 - 5, 34);
    };
  }

  // ── Evaporation from a dish ──────────────────────────────────────────────
  function evaporation(host, done) {
    const W = 400, H = 250, r = 4.2, N0 = 110, SIG = 45, ESC = 2.1 * SIG;
    const dish = { x0: 92, x1: 308, y1: 226, rim: 140 };
    const DEPTH = 52;
    const sim = Sim(host, { w: W, h: H, step: 1 / 60 });
    let L = [], V = [], sun = false, wind = false, temp = 30;
    const surface = () => dish.y1 - DEPTH * (L.length / N0);
    const reset = () => {
      L = []; V = [];
      const top = dish.y1 - DEPTH;
      for (let i = 0; i < N0; i++)
        L.push({ x: dish.x0 + r + Math.random() * (dish.x1 - dish.x0 - 2 * r), y: top + r + Math.random() * (DEPTH - 2 * r), vx: gauss() * SIG, vy: gauss() * SIG });
    };
    reset();

    const row = ui.row(host);
    ui.toggle(row, "☀ Sun", on => (sun = on));
    ui.toggle(row, "Wind", on => (wind = on));
    ui.button(row, "Refill", reset);
    const out = ui.readout(row);

    sim.update = dt => {
      const yS = surface();
      for (const p of L) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < dish.x0 + r) { p.x = dish.x0 + r; p.vx = Math.abs(p.vx); }
        if (p.x > dish.x1 - r) { p.x = dish.x1 - r; p.vx = -Math.abs(p.vx); }
        if (p.y > dish.y1 - r) { p.y = dish.y1 - r; p.vy = -Math.abs(p.vy); }
      }
      const D = 2 * r;
      for (let i = 0; i < L.length; i++) {
        const a = L[i];
        for (let j = i + 1; j < L.length; j++) {
          const b = L[j];
          const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
          if (d2 >= D * D || d2 === 0) continue;
          const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
          const vrel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (vrel < 0) { a.vx += vrel * nx; a.vy += vrel * ny; b.vx -= vrel * nx; b.vy -= vrel * ny; }
          const o = (D - d) / 2;
          a.x -= nx * o; a.y -= ny * o; b.x += nx * o; b.y += ny * o;
        }
      }
      // At the surface: the fastest upward-moving molecules break free, the rest are pulled back.
      for (let i = L.length - 1; i >= 0; i--) {
        const p = L[i];
        if (p.y - r < yS && p.vy < 0) {
          if (-p.vy > ESC) {
            p.vy = -Math.sqrt(p.vy * p.vy - ESC * ESC) - 15;
            V.push(p);
            L.splice(i, 1);
            if (L.length <= N0 - 6) done();
          } else { p.y = yS + r; p.vy = -p.vy; }
        }
      }
      for (let i = V.length - 1; i >= 0; i--) {
        const p = V[i];
        p.vx += (gauss() * 60 + (wind ? 260 : 0)) * dt;
        p.vy += (gauss() * 60 - 12) * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        const back = p.y > surface() && p.x > dish.x0 && p.x < dish.x1;
        if (back) { p.vy = -Math.abs(p.vy) * 0.3; p.y = surface() + r; L.push(p); V.splice(i, 1); }
        else if (p.x < -10 || p.x > W + 10 || p.y < -10) V.splice(i, 1);
        else if (p.y > dish.rim && (p.x <= dish.x0 || p.x >= dish.x1)) { p.vy = -Math.abs(p.vy); }
      }
      let m2 = 0;
      for (const p of L) m2 += p.vx * p.vx + p.vy * p.vy;
      m2 = L.length ? m2 / L.length : 0;
      if (sun && m2 < 2 * (1.35 * SIG) ** 2) for (const p of L) { p.vx *= 1 + 0.5 * dt; p.vy *= 1 + 0.5 * dt; }
      const T = 10 + (20 * m2) / (2 * SIG * SIG);
      temp += (T - temp) * Math.min(1, dt * 2);
      out.textContent = `In the dish: ${L.length} of ${N0}`;
    };
    sim.draw = (ctx, c) => {
      const yS = surface();
      ctx.fillStyle = "rgba(61,155,224,.16)";
      ctx.fillRect(dish.x0, yS, dish.x1 - dish.x0, dish.y1 - yS);
      ctx.strokeStyle = c.inksoft;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(dish.x0 - 2, dish.rim); ctx.lineTo(dish.x0 - 2, dish.y1 + 2); ctx.lineTo(dish.x1 + 2, dish.y1 + 2); ctx.lineTo(dish.x1 + 2, dish.rim);
      ctx.stroke();
      const fast = 1.8 * SIG;
      for (const p of L) circle(ctx, p.x, p.y, r - 0.3, Math.hypot(p.vx, p.vy) > fast ? c.warn : c.accent);
      for (const p of V) circle(ctx, p.x, p.y, r - 0.3, c.warn);
      if (sun) {
        circle(ctx, 36, 36, 16, "#f5b82e");
        ctx.strokeStyle = "#f5b82e";
        ctx.lineWidth = 2;
        for (let a = 0; a < 8; a++) {
          const t = (a / 8) * TAU + sim.t * 0.5;
          ctx.beginPath();
          ctx.moveTo(36 + Math.cos(t) * 21, 36 + Math.sin(t) * 21);
          ctx.lineTo(36 + Math.cos(t) * 28, 36 + Math.sin(t) * 28);
          ctx.stroke();
        }
      }
      if (wind) {
        ctx.strokeStyle = c.inksoft;
        ctx.lineWidth = 1.5;
        for (let k = 0; k < 3; k++) {
          const x = ((sim.t * 160 + k * 140) % 460) - 60, y = 40 + k * 26;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 40, y); ctx.stroke();
        }
      }
      // Thermometer for the liquid left in the dish
      const tx = 360, top = 52, bot = 206;
      ctx.fillStyle = c.line;
      ctx.fillRect(tx - 5, top, 10, bot - top);
      circle(ctx, tx, bot + 8, 10, c.danger);
      const frac = Math.max(0, Math.min(1, (temp - 10) / 40));
      ctx.fillStyle = c.danger;
      ctx.fillRect(tx - 3, bot - frac * (bot - top), 6, frac * (bot - top) + 4);
      ctx.fillStyle = c.ink;
      ctx.font = "600 12px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${temp.toFixed(1)}°C`, tx, top - 10);
      ctx.fillStyle = c.inksoft;
      ctx.font = "10px system-ui, sans-serif";
      ctx.fillText("liquid", tx, top - 26);
    };
  }

  // ── Capillarity: water vs mercury in tubes of different widths ───────────
  function capillary(host, done) {
    const W = 400, H = 250;
    const sim = Sim(host, { w: W, h: H });
    const LEVEL = 178, TOP = 30, BOTTOM = 214;
    const tubes = [{ x: 110, w: 30, name: "wide" }, { x: 210, w: 16, name: "medium" }, { x: 300, w: 8, name: "narrow" }];
    tubes.forEach(t => (t.h = 0));
    let liquid = "Water";
    const seen = new Set([liquid]);
    const row = ui.row(host);
    ui.seg(row, ["Water", "Mercury"], m => { liquid = m; seen.add(m); if (seen.size === 2) done(); });

    sim.update = dt => {
      for (const t of tubes) {
        const target = liquid === "Water" ? 600 / t.w : -280 / t.w;
        t.h += (target - t.h) * Math.min(1, dt * 3);
      }
    };
    sim.draw = (ctx, c) => {
      const water = liquid === "Water";
      const fill = water ? "rgba(61,155,224,.5)" : "#a7afb8";
      ctx.fillStyle = fill;
      ctx.fillRect(30, LEVEL, 340, 232 - LEVEL);
      ctx.strokeStyle = c.inksoft;
      ctx.lineWidth = 2;
      ctx.strokeRect(29, LEVEL - 20, 342, 232 - LEVEL + 21);
      for (const t of tubes) {
        const xl = t.x - t.w / 2, xr = t.x + t.w / 2, top = LEVEL - t.h, m = t.w * 0.32;
        ctx.clearRect(xl, TOP, t.w, BOTTOM - TOP);
        ctx.fillStyle = c.bg;
        ctx.fillRect(xl, TOP, t.w, BOTTOM - TOP);
        // Column of liquid with a curved meniscus: concave (water) or convex (mercury).
        ctx.beginPath();
        ctx.moveTo(xl, BOTTOM);
        ctx.lineTo(xl, water ? top - m : top + m * 0.6);
        ctx.quadraticCurveTo(t.x, water ? top + m : top - m * 1.2, xr, water ? top - m : top + m * 0.6);
        ctx.lineTo(xr, BOTTOM);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = c.ink;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(xl - 1, TOP); ctx.lineTo(xl - 1, BOTTOM);
        ctx.moveTo(xr + 1, TOP); ctx.lineTo(xr + 1, BOTTOM);
        ctx.stroke();
        ctx.fillStyle = c.inksoft;
        ctx.font = "11px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(t.name, t.x, TOP - 8);
      }
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = c.inksoft;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(30, LEVEL); ctx.lineTo(370, LEVEL); ctx.stroke();
      ctx.setLineDash([]);
    };
  }

  // ── Crystal lattices (3D, drag to rotate) ────────────────────────────────
  function crystal(host, done) {
    const W = 400, H = 250;
    const sim = Sim(host, { w: W, h: H });
    const corners = [];
    for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) corners.push([x, y, z, 0]);
    const faces = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map(p => [...p, 1]);
    const amorphous = [];
    while (amorphous.length < 15) {
      const p = [Math.random() * 2.4 - 1.2, Math.random() * 2.4 - 1.2, Math.random() * 2.4 - 1.2, 2];
      if (amorphous.every(q => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) > 0.8)) amorphous.push(p);
    }
    const MODES = {
      "Simple cubic": { atoms: corners, edges: true, info: "Start simple: one atom at each of the 8 corners of a cube. This tiny cube (the <b>unit cell</b>) repeats in every direction." },
      "Body-centred": { atoms: [...corners, [0, 0, 0, 1]], edges: true, info: "<b>Body-centred cubic (BCC):</b> an atom at each corner <b>plus one in the centre</b> of the cube. e.g. iron, sodium, chromium." },
      "Face-centred": { atoms: [...corners, ...faces], edges: true, info: "<b>Face-centred cubic (FCC):</b> an atom at each corner <b>plus one in the centre of each of the 6 faces</b>. e.g. copper, aluminium, gold, silver, common salt." },
      Amorphous: { atoms: amorphous, edges: false, info: "<b>Amorphous:</b> no regular, repeating pattern, just a jumble. e.g. glass, rubber, plastics, candle wax." },
    };
    let mode = "Simple cubic", ax = -0.45, ay = 0.6, idle = 0;
    const seen = new Set();
    const row = ui.row(host);
    ui.seg(row, Object.keys(MODES), m => {
      mode = m;
      info.innerHTML = MODES[m].info;
      seen.add(m);
      if (seen.has("Body-centred") && seen.has("Face-centred")) done();
    });
    const info = ui.info(host);
    info.innerHTML = MODES[mode].info;
    sim.onDrag = (dx, dy) => { ay += dx * 0.012; ax += dy * 0.012; idle = 0; };

    const project = ([x, y, z]) => {
      const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
      const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
      const y2 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
      const s = 70 * (4 / (4 + z2));
      return { x: W / 2 + x1 * s, y: H / 2 + y2 * s, z: z2, s };
    };
    sim.update = dt => { idle += dt; if (idle > 1.5) ay += dt * 0.5; };
    sim.draw = (ctx, c) => {
      const M = MODES[mode];
      if (M.edges) {
        ctx.strokeStyle = c.inksoft;
        ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
          const a = corners[i], b = corners[j];
          if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) !== 2) continue;
          const p = project(a), q = project(b);
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      const pts = M.atoms.map(a => ({ ...project(a), kind: a[3] })).sort((a, b) => b.z - a.z);
      for (const p of pts) {
        const col = p.kind === 0 ? "#8f98a6" : p.kind === 1 ? c.accent : c.warn;
        const rad = 0.2 * p.s;
        const g = ctx.createRadialGradient(p.x - rad * 0.35, p.y - rad * 0.35, rad * 0.1, p.x, p.y, rad);
        g.addColorStop(0, "rgba(255,255,255,.65)");
        g.addColorStop(0.35, col);
        g.addColorStop(1, col);
        circle(ctx, p.x, p.y, rad, g);
      }
      ctx.fillStyle = c.inksoft;
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Drag to rotate", 8, 16);
    };
  }

  return { zoom, states, brownian, diffusion, pressure, evaporation, capillary, crystal };
})();
