// Simulations for this topic. Each takes (host, done); call done() once explored.
window.Sims = (() => {
  function example(host, done) {
    const sim = Sim(host, { w: 400, h: 250 });
    const row = Sim.ui.row(host);
    Sim.ui.button(row, "Try me", done);
    sim.update = dt => {};
    sim.draw = (ctx, c) => {};
  }
  return { example };
})();
