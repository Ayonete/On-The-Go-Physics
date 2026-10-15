// Lesson path engine.
// A lesson is a list of "stops"; each stop is a list of blocks revealed one at a time.
// Interactive blocks (reveal, mcq, sort, sim, quiz) must be completed before the
// path continues, so learners take in one idea at a time.
//
// Block shapes:
//   "text" | { p }                         paragraph (inline HTML allowed)
//   { key }                                highlighted key idea
//   { table: { head, rows } }
//   { reveal: [[title, body], ...], prompt }
//   { mcq, options, answer, explain, hint, predict }
//   { sort: { buckets, items: [[text, bucketIndex], ...] }, prompt }
//   { sim: (host, done) => {}, caption }   call done() when the learner has explored enough
//   { quiz: [{ q, options, answer, explain }, ...] }
(() => {
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} },
  };
  const h = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const buzz = pattern => { try { navigator.vibrate && navigator.vibrate(pattern); } catch {} };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const shake = e => { e.classList.remove("shake"); void e.offsetWidth; e.classList.add("shake"); };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const btn = (cls, html) => { const b = h("button", cls, html); b.type = "button"; return b; };

  const R = {
    p(node, b) { node.innerHTML = `<p>${b.p}</p>`; },

    key(node, b) { node.classList.add("key"); node.innerHTML = b.key; },

    table(node, b) {
      const { head, rows } = b.table;
      node.innerHTML = `<div class="table-wrap"><table class="data">
        <thead><tr>${head.map(x => `<th>${x}</th>`).join("")}</tr></thead>
        <tbody>${rows.map(r => `<tr>${r.map((x, i) => i ? `<td>${x}</td>` : `<td><b>${x}</b></td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>`;
    },

    reveal(node, b, review) {
      node.append(h("p", "prompt", b.prompt || "Tap each card to reveal it."));
      const grid = h("div", "reveal-grid");
      node.append(grid);
      let left = b.reveal.length;
      return new Promise(res => {
        for (const [title, body] of b.reveal) {
          const c = btn("reveal-card", `<span class="rc-title">${title}</span><span class="rc-body">${body}</span><span class="rc-hint">Tap to reveal</span>`);
          c.setAttribute("aria-expanded", "false");
          const open = () => {
            if (c.classList.contains("open")) return;
            c.classList.add("open");
            c.setAttribute("aria-expanded", "true");
            buzz(8);
            if (--left === 0) res();
          };
          c.onclick = open;
          grid.append(c);
          if (review) open();
        }
      });
    },

    mcq(node, b, review) {
      node.append(h("p", "q", (b.predict ? "Predict: " : "") + b.mcq));
      const list = h("div", "choices");
      const fb = h("div", "feedback");
      node.append(list);
      return new Promise(res => {
        const btns = b.options.map((o, i) => {
          const c = btn("choice", o);
          list.append(c);
          c.onclick = () => {
            if (b.predict) {
              btns.forEach(x => (x.disabled = true));
              c.classList.add("picked");
              fb.className = "feedback neutral";
              fb.innerHTML = b.explain || "Hold that thought. Let's find out.";
              node.append(fb);
              res();
            } else if (i === b.answer) {
              btns.forEach(x => (x.disabled = true));
              c.classList.add("correct");
              buzz(15);
              fb.className = "feedback good";
              fb.innerHTML = `<b>Correct.</b> ${b.explain || ""}`;
              node.append(fb);
              res();
            } else {
              c.classList.add("wrong");
              c.disabled = true;
              shake(c);
              buzz([30, 40, 30]);
              fb.className = "feedback bad";
              fb.innerHTML = b.hint || "Not quite. Have another go.";
              node.append(fb);
            }
          };
          return c;
        });
        if (review) {
          btns.forEach(x => (x.disabled = true));
          if (!b.predict) {
            btns[b.answer].classList.add("correct");
            fb.className = "feedback good";
            fb.innerHTML = b.explain || "";
            if (b.explain) node.append(fb);
          }
          res();
        }
      });
    },

    sort(node, b, review) {
      node.append(h("p", "prompt", b.prompt || "Tap a card, then tap the group it belongs to."));
      const pool = h("div", "pool");
      const bucketsEl = h("div", "buckets");
      bucketsEl.style.setProperty("--n", b.sort.buckets.length);
      node.append(pool, bucketsEl);
      const buckets = b.sort.buckets.map(name => {
        const bk = h("div", "bucket", `<div class="bucket-name">${name}</div><div class="bucket-items"></div>`);
        bucketsEl.append(bk);
        return bk;
      });
      const items = shuffle(b.sort.items.map(([text, k]) => ({ text, k })));
      let selected = null, left = items.length;
      const select = it => {
        if (selected) selected.el.classList.remove("selected");
        selected = it;
        if (it) it.el.classList.add("selected");
        bucketsEl.classList.toggle("armed", !!it);
      };
      const place = it => {
        it.el.classList.remove("selected");
        it.el.classList.add("placed");
        it.el.disabled = true;
        buckets[it.k].querySelector(".bucket-items").append(it.el);
      };
      return new Promise(res => {
        for (const it of items) {
          it.el = btn("chip", it.text);
          it.el.onclick = e => { e.stopPropagation(); if (!it.el.disabled) select(selected === it ? null : it); };
          pool.append(it.el);
        }
        buckets.forEach((bk, k) => {
          bk.onclick = () => {
            if (!selected) return;
            if (selected.k === k) {
              place(selected);
              buzz(10);
              select(null);
              if (--left === 0) { pool.remove(); res(); }
            } else {
              shake(bk);
              shake(selected.el);
              buzz([30, 40, 30]);
            }
          };
        });
        if (review) { items.forEach(place); pool.remove(); res(); }
      });
    },

    sim(node, b, review) {
      if (b.caption) node.append(h("p", "caption", b.caption));
      return new Promise(res => {
        b.sim(node, res);
        if (review) res();
      });
    },

    quiz(node, b, review, ctx) {
      const box = h("div", "quiz");
      node.append(box);
      const n = b.quiz.length;
      return new Promise(res => {
        let i = 0, score = 0;
        const show = () => {
          if (i === n) return finish();
          const q = b.quiz[i];
          box.innerHTML = `<p class="eyebrow">Question ${i + 1} of ${n}</p>
            <div class="quiz-bar"><i style="width:${(i / n) * 100}%"></i></div>
            <p class="q">${q.q}</p>`;
          const list = h("div", "choices");
          box.append(list);
          q.options.forEach((o, k) => {
            const c = btn("choice", `<span class="letter">${"ABCDE"[k]}</span><span>${o}</span>`);
            list.append(c);
            c.onclick = () => {
              [...list.children].forEach(x => (x.disabled = true));
              const ok = k === q.answer;
              list.children[q.answer].classList.add("correct");
              if (ok) { score++; buzz(15); } else { c.classList.add("wrong"); shake(c); buzz([30, 40, 30]); }
              box.append(h("div", "feedback " + (ok ? "good" : "bad"), `<b>${ok ? "Correct." : "Not quite."}</b> ${q.explain}`));
              const row = h("div", "next-row");
              const next = btn("btn", i + 1 === n ? "See my score" : "Next question");
              next.onclick = () => { i++; show(); box.scrollIntoView({ behavior: "smooth", block: "nearest" }); };
              row.append(next);
              box.append(row);
              next.scrollIntoView({ behavior: "smooth", block: "nearest" });
            };
          });
        };
        const finish = () => {
          const best = Math.max(score, ctx.state.best || 0);
          ctx.state.best = best;
          ctx.save();
          const msg = score >= 8 ? "Excellent. You're exam-ready on this topic."
            : score >= 5 ? "Good work. Revisit the stops you found tricky, then try again."
            : "Keep going. Review the path above and have another go.";
          box.innerHTML = `<div class="score"><p class="eyebrow">Your score</p><div class="score-num">${score}/${n}</div><p>${msg}</p>
            ${best > score ? `<p class="muted">Best so far: ${best}/${n}</p>` : ""}</div>`;
          const row = h("div", "next-row");
          const again = btn("btn ghost small", "Try again");
          again.onclick = () => { i = 0; score = 0; show(); };
          row.append(again);
          box.append(row);
          buzz(score >= 8 ? [20, 60, 20, 60, 40] : 20);
          res();
        };
        show();
      });
    },
  };

  // scroll: whether the first interactive block may scroll into view (not on page load).
  async function run(body, blocks, review, ctx, scroll = true) {
    for (const raw of blocks) {
      const b = typeof raw === "string" ? { p: raw } : raw;
      const type = Object.keys(R).find(k => k in b);
      const node = h("div", "block block-" + type);
      body.append(node);
      const done = R[type](node, b, review, ctx);
      if (!review && done) {
        if (scroll) node.scrollIntoView({ behavior: "smooth", block: "nearest" });
        scroll = true;
        await done;
        await wait(300);
      }
    }
  }

  function mount(root, L) {
    const key = "otgp:" + L.id;
    const state = store.get(key) || { at: 0 };
    const ctx = { state, save: () => store.set(key, state) };
    const n = L.stops.length;

    root.innerHTML = "";
    const head = h("header", "path-head", `
      <div class="row"><a href="../../" class="muted">← All topics</a><span class="readout count"></span></div>
      <div class="progress" role="progressbar" aria-label="Lesson progress"><i></i></div>`);
    const intro = h("section", "path-intro", `
      <p class="eyebrow">${L.eyebrow}</p>
      <h1>${L.title}</h1>
      <p class="muted">${L.intro}</p>
      <details class="card goals-card"><summary>What you'll be able to do</summary>
        <ul>${L.goals.map(g => `<li>${g}</li>`).join("")}</ul></details>`);
    const trail = h("ol", "trail");
    root.append(head, intro, trail);

    const stops = L.stops.map((s, i) => {
      const li = h("li", "stop locked", `
        <span class="node" aria-hidden="true"></span>
        <button class="stop-head" type="button"><span class="stop-num">Stop ${i + 1}</span>
          <span class="stop-title">${s.title}</span><span class="stop-review">Review</span></button>
        <div class="stop-body"></div>`);
      li.querySelector(".stop-head").onclick = () => {
        if (!li.classList.contains("done")) return;
        const body = li.querySelector(".stop-body");
        if (!body.childElementCount) run(body, s.blocks, true, ctx);
        li.classList.toggle("open");
      };
      trail.append(li);
      return li;
    });

    const bar = head.querySelector(".progress i");
    const count = head.querySelector(".count");
    const refresh = () => {
      bar.style.width = `${(Math.min(state.at, n) / n) * 100}%`;
      count.textContent = state.at >= n ? "Complete" : `Stop ${state.at + 1} of ${n}`;
      stops.forEach((li, i) => {
        li.classList.toggle("done", i < state.at);
        li.classList.toggle("locked", i > state.at);
        li.classList.toggle("current", i === state.at);
      });
    };

    async function open(i, scroll) {
      refresh();
      if (i >= n) return finish(scroll);
      const li = stops[i];
      const body = li.querySelector(".stop-body");
      body.innerHTML = "";
      li.classList.add("open");
      if (scroll) li.scrollIntoView({ behavior: "smooth", block: "start" });
      await run(body, L.stops[i].blocks, false, ctx, scroll);
      const row = h("div", "continue-row");
      const go = btn("btn continue", i === n - 1 ? "Finish topic" : "Continue →");
      row.append(go);
      body.append(row);
      go.scrollIntoView({ behavior: "smooth", block: "nearest" });
      go.onclick = () => {
        row.remove();
        li.classList.remove("open");
        state.at = i + 1;
        ctx.save();
        buzz(20);
        open(i + 1, true);
      };
    }

    function finish(scroll) {
      const end = h("section", "card end", `
        <p class="eyebrow">Topic complete</p>
        <h2 style="margin-top:4px">Nice work!</h2>
        <p class="muted">${state.best != null ? `Best quiz score: ${state.best}/${L.quizSize || ""}` : ""}</p>
        <p>${L.next || ""}</p>
        <div class="actions"><a class="btn" href="../../">Back to topics</a></div>`);
      end.querySelector(".actions").append(restartButton("btn ghost"));
      root.append(end);
      if (scroll) end.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Two taps to restart: the first arms the button, the second clears progress.
    function restartButton(cls) {
      const b = btn(cls, "Start over");
      let armed = 0;
      b.onclick = () => {
        if (Date.now() - armed < 4000) { store.del(key); location.reload(); return; }
        armed = Date.now();
        b.textContent = "Tap again to restart";
        setTimeout(() => (b.textContent = "Start over"), 4000);
      };
      return b;
    }

    if (state.at > 0 && state.at < n) {
      intro.append(restartButton("linkish"));
    }
    open(state.at, state.at > 0);
  }

  window.Lesson = { mount };
})();
