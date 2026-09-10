/* Chapter III: proof player, constructed chord table, spherical Menelaos. */
window.AstroArs = window.AstroArs || {};
(function () {
const A = window.AstroArs;
const G = window.Geom;
const ast = A.astro;

function beatSpec(b) {
  if (b === null || b === "clear") return null;
  const empty = { hl: [], draw: [], show: [], keep: [], dim: [] };
  if (Array.isArray(b)) return Object.assign(empty, { hl: b.slice() });
  if (b && typeof b === "object") {
    return {
      hl: (b.hl || []).slice(), draw: (b.draw || []).slice(), show: (b.show || []).slice(),
      keep: (b.keep || []).slice(), dim: (b.dim || []).slice()
    };
  }
  return empty;
}

A.mountProof = function mountProof(el) {
  const id = el.dataset.fig;
  const def = (A.FIGS || {})[id];
  if (!def) { el.textContent = "Figure not found: " + id; return; }
  if (def.sphere) { A.mountMenelaosSphere(el); return; }
  if (!G || !G.makeFigure) { el.textContent = "Geometry engine did not load."; return; }

  el.classList.add("proof-fig");
  const title = document.createElement("div");
  title.className = "whead";
  title.innerHTML = `<strong>${def.title || id}</strong><span class="readout"></span>`;
  const box = document.createElement("div");
  box.className = "figbox";
  const measure = document.createElement("p");
  measure.className = "measure";
  const stepEl = document.createElement("p");
  stepEl.className = "step-text";
  const row = document.createElement("div");
  row.className = "playrow";
  row.innerHTML = `
    <button type="button" class="pbtn" data-k="prev">←</button>
    <button type="button" class="pbtn" data-k="next">→</button>
    <button type="button" class="pbtn" data-k="replay">Replay</button>
    <button type="button" class="pbtn" data-k="slow">½×</button>
    <button type="button" class="pbtn on" data-k="mid">1×</button>
    <button type="button" class="pbtn" data-k="fast">2×</button>`;
  el.append(title, box, measure, stepEl, row);

  const fig = G.makeFigure(def, {});
  let step = 0, beat = 0, speed = 1, timer = 0, revealed = new Set();
  const nSteps = (def.steps || []).length;

  function clearTimer() { if (timer) { clearTimeout(timer); timer = 0; } }

  function partsNow() {
    if (step === 0) return { hl: [], draw: [], show: [], keep: [], dim: [] };
    const st = def.steps[step - 1];
    if (st.hlBeats && st.hlBeats.length) {
      const sp = beatSpec(st.hlBeats[Math.min(beat, st.hlBeats.length - 1)]);
      return sp || { hl: [], draw: [], show: [], keep: [], dim: [] };
    }
    if (st.hlIds) return { hl: st.hlIds.slice(), draw: [], show: [], keep: [], dim: [] };
    return { hl: [], draw: [], show: [], keep: [], dim: [] };
  }

  function collectRevealed(p) {
    p.hl.concat(p.draw, p.show, p.keep).forEach(id => revealed.add(id));
  }

  function hideForLaterBeats() {
    const hide = new Set();
    if (step === 0) return hide;
    const st = def.steps[step - 1];
    if (!st.hlBeats) return hide;
    st.hlBeats.forEach((b, i) => {
      if (i <= beat) return;
      const sp = beatSpec(b);
      if (!sp) return;
      sp.draw.concat(sp.show).forEach(id => hide.add(id));
    });
    return hide;
  }

  function paint(opt) {
    opt = opt || {};
    const p = partsNow();
    const hl = new Set(p.hl.concat(p.draw, p.show));
    const drawIds = new Set(p.draw);
    const forceIds = new Set([...revealed, ...p.draw, ...p.show]);
    const hideIds = hideForLaterBeats();
    const svg = fig.render({
      w: 560, h: 400, upTo: step, speed,
      highlight: hl.size ? hl : null,
      hlKeep: false,
      drawIds, forceIds, hideIds,
      revealedIds: revealed,
      keepIds: new Set(p.keep),
      dimIds: new Set(p.dim),
      animate: !!opt.animate,
      noDrawAnim: !drawIds.size,
      showScaffold: false
    });
    box.innerHTML = svg;
    const node = box.querySelector("svg");
    bindDrag(node);
    const st = step === 0 ? null : def.steps[step - 1];
    if (step === 0) {
      stepEl.innerHTML = "<span class='muted'>Given.</span> Drag a labelled point; the figure keeps its properties.";
    } else if (st && st.qed) {
      stepEl.innerHTML = `<p class="qed">${st.text}</p>`;
    } else {
      stepEl.textContent = (st && st.text) || "";
    }
    if (def.measure) measure.textContent = def.measure(fig) || "";
    else measure.textContent = "";
    title.querySelector(".readout").textContent = step === 0 ? "given" : (step + " / " + nSteps);
  }

  function bindDrag(svg) {
    if (!svg) return;
    let dragging = null;
    svg.addEventListener("pointerdown", e => {
      const hit = e.target.closest("[data-eid]");
      if (!hit) return;
      const eid = hit.dataset.eid || "";
      if (!eid.startsWith("pt:")) return;
      const name = eid.slice(3);
      if (!fig.fig.free.some(f => f.name === name)) return;
      dragging = name;
      svg.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    svg.addEventListener("pointermove", e => {
      if (!dragging) return;
      const r = svg.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * 560;
      const y = (e.clientY - r.top) / r.height * 400;
      fig.drag(dragging, fig.toWorld({ x, y }));
      paint();
    });
    svg.addEventListener("pointerup", () => { dragging = null; });
  }

  function startBeats() {
    clearTimer();
    beat = 0;
    const st = step === 0 ? null : def.steps[step - 1];
    const n = st && st.hlBeats ? st.hlBeats.length : 1;
    paint({ animate: true });
    const p0 = partsNow();
    collectRevealed(p0);
    if (n <= 1) return;
    const gap = Math.max(420, 900 / speed);
    const tick = () => {
      if (beat >= n - 1) return;
      beat += 1;
      const p = partsNow();
      collectRevealed(p);
      paint({ animate: true });
      if (beat < n - 1) timer = setTimeout(tick, gap);
    };
    timer = setTimeout(tick, gap);
  }

  function go(s) {
    step = Math.max(0, Math.min(nSteps, s));
    if (s < step) { /* rebuilt below */ }
    startBeats();
  }

  row.addEventListener("click", e => {
    const k = e.target.closest("[data-k]");
    if (!k) return;
    const kind = k.dataset.k;
    if (kind === "prev") {
      revealed = new Set();
      go(step - 1);
    } else if (kind === "next") {
      go(step + 1);
    } else if (kind === "replay") {
      revealed = new Set();
      go(0);
      const play = () => {
        if (step >= nSteps) return;
        go(step + 1);
        timer = setTimeout(play, Math.max(700, 1400 / speed) + ((def.steps[step - 1] && def.steps[step - 1].hlBeats) ? (def.steps[step - 1].hlBeats.length - 1) * 900 / speed : 0));
      };
      timer = setTimeout(play, 500);
    } else if (kind === "slow" || kind === "mid" || kind === "fast") {
      speed = kind === "slow" ? 0.5 : kind === "fast" ? 2 : 1;
      row.querySelectorAll("[data-k=slow],[data-k=mid],[data-k=fast]").forEach(b => b.classList.toggle("on", b === k));
    }
  });

  el._proofGo = s => { if (s < step) revealed = new Set(); go(s); };
  el._proofStepCount = nSteps;
  el._proofProduct = def.product ? () => def.product(fig) : null;
  el._proofSetT = (name, t) => { fig.state[name] = { t }; fig.rebuild(); paint(); };
  paint();
};

/* ---- Chord table constructed from Euclid + Ptolemy ---------------- */
function supp(c) { return Math.sqrt(Math.max(0, 14400 - c * c)); }
function halfChord(c) { return Math.sqrt(Math.max(0, 60 * (120 - supp(c)))); }
function diffChord(cA, cB) { return (cA * supp(cB) - cB * supp(cA)) / 120; }
function arcLabel(a) {
  if (Math.abs(a - 1.5) < 1e-9) return "1½°";
  if (Math.abs(a - 0.75) < 1e-9) return "¾°";
  if (Math.abs(a - Math.round(a)) < 1e-9) return Math.round(a) + "°";
  return a + "°";
}
function keyOf(a) { return Math.round(a * 10000) / 10000; }

A.mountChordTable = function mountChordTable(el) {
  const readout = el.appendChild(document.createElement("div"));
  readout.className = "whead";
  readout.innerHTML = `<strong>The table of chords</strong><span class="readout">diameter 120 · built, not assumed</span>`;
  const fig = (function () {
    const c = document.createElement("canvas");
    c.className = "fig";
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = 520, h = 280;
    c.width = w * dpr; c.height = h * dpr;
    c.style.aspectRatio = w + " / " + h;
    el.appendChild(c);
    return { canvas: c, ctx: c.getContext("2d"), w, h, dpr };
  })();
  fig.ctx.setTransform(fig.dpr, 0, 0, fig.dpr, 0, 0);

  const table = {};
  function add(arc, value, how) {
    table[keyOf(arc)] = { arc: keyOf(arc), value, how };
  }
  add(60, 60, "Euclid — hexagon");
  add(90, 60 * Math.sqrt(2), "Euclid — square");
  add(120, 60 * Math.sqrt(3), "Euclid — triangle");
  add(36, 30 * (Math.sqrt(5) - 1), "Euclid XIII — decagon");
  add(72, 30 * Math.sqrt(10 - 2 * Math.sqrt(5)), "Euclid XIII — pentagon");
  add(180, 120, "diameter");

  const ops = document.createElement("div");
  ops.className = "chord-ops";
  ops.innerHTML = `
    <button type="button" class="pbtn" id="c-diff">Difference</button>
    <button type="button" class="pbtn" id="c-half">Half</button>
    <button type="button" class="pbtn" id="c-one">Bound 1°</button>
    <button type="button" class="pbtn" id="c-sine"><span class="status crutch">check against the sine</span></button>
    <span class="sel" id="c-sel">Select one row, or two for a difference.</span>`;
  el.appendChild(ops);
  const tab = document.createElement("table");
  tab.className = "numtab";
  tab.innerHTML = `<thead><tr><th>Arc</th><th class="r">Chord</th><th>How it was got</th><th class="r sinecol" hidden>120 sin(θ/2)</th></tr></thead><tbody></tbody>`;
  el.appendChild(tab);
  const body = tab.querySelector("tbody");
  let picked = [];
  let showSine = false;
  let focus = 60;

  function known(a) { return table[keyOf(a)] || null; }

  function paintTable() {
    const rows = Object.values(table).sort((a, b) => a.arc - b.arc);
    body.innerHTML = "";
    rows.forEach(r => {
      const tr = document.createElement("tr");
      if (picked.some(p => keyOf(p) === r.arc)) tr.classList.add("picked");
      if (r.interp) tr.classList.add("interp");
      const sine = showSine ? `<td class="r">${(120 * Math.sin(r.arc * Math.PI / 360)).toFixed(4)}</td>` : "";
      tr.innerHTML = `<td>${arcLabel(r.arc)}</td><td class="r">${r.value.toFixed(4)}</td><td>${r.how}${r.interp ? " · interpolated" : ""}</td>${sine}`;
      tr.addEventListener("click", () => {
        const k = r.arc;
        const i = picked.indexOf(k);
        if (i >= 0) picked.splice(i, 1);
        else {
          if (picked.length >= 2) picked.shift();
          picked.push(k);
        }
        focus = k;
        paintTable();
        drawFig();
        ops.querySelector("#c-sel").textContent = picked.length
          ? "Selected: " + picked.map(arcLabel).join(" and ")
          : "Select one row, or two for a difference.";
      });
      body.appendChild(tr);
    });
    tab.querySelectorAll(".sinecol").forEach(c => { c.hidden = !showSine; });
  }

  function drawFig() {
    const { ctx, w, h } = fig;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--panel2").trim() || "#1a2438";
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2 + 8, R = 96;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--muted").trim() || "#9aa8bc";
    ctx.lineWidth = 1.3; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
    ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([]);
    const rec = known(focus);
    const gold = getComputedStyle(document.documentElement).getPropertyValue("--gold").trim() || "#d4a04a";
    if (rec) {
      const th = rec.arc * Math.PI / 180;
      const x0 = cx - R, y0 = cy;
      const x1 = cx + R * Math.cos(Math.PI - th), y1 = cy - R * Math.sin(th);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
      ctx.strokeStyle = gold; ctx.lineWidth = 2.3; ctx.stroke();
      ctx.fillStyle = gold;
      ctx.beginPath(); ctx.arc(x0, y0, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x1, y1, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#e8e0d0";
      ctx.font = "12px ui-sans-serif, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("crd " + arcLabel(rec.arc) + " = " + rec.value.toFixed(3), cx, h - 14);
    }
    readout.querySelector(".readout").textContent = rec
      ? rec.how
      : "diameter 120 · built, not assumed";
  }

  function say(msg) {
    ops.querySelector("#c-sel").textContent = msg;
    A.toast && A.toast(msg);
  }
  function clearPick() {
    picked = [];
    paintTable();
    drawFig();
  }
  ops.querySelector("#c-diff").addEventListener("click", () => {
    if (picked.length !== 2) { say("Pick two arcs."); return; }
    const a = Math.max(picked[0], picked[1]), b = Math.min(picked[0], picked[1]);
    const d = keyOf(a - b);
    if (d <= 0) return;
    if (known(d)) { say("Already in the table."); return; }
    const cA = known(a).value, cB = known(b).value;
    add(d, diffChord(cA, cB), "crd " + arcLabel(d) + " = crd(" + arcLabel(a) + "−" + arcLabel(b) + ")");
    clearPick();
    say("crd " + arcLabel(d) + " added. Select the next arcs.");
  });
  ops.querySelector("#c-half").addEventListener("click", () => {
    if (picked.length !== 1) { say("Pick one arc."); return; }
    const a = picked[0], h = keyOf(a / 2);
    if (known(h)) { say("Already in the table."); return; }
    add(h, halfChord(known(a).value), "crd " + arcLabel(h) + " = half of crd " + arcLabel(a));
    clearPick();
    say("crd " + arcLabel(h) + " added. Select the next arc.");
  });
  ops.querySelector("#c-one").addEventListener("click", () => {
    const a = known(1.5), b = known(0.75);
    if (!a || !b) { say("Build crd 1½° and crd ¾° first."); return; }
    const lo = (2 / 3) * a.value, hi = (4 / 3) * b.value;
    const midv = (lo + hi) / 2;
    if (known(1)) { say("Already in the table."); return; }
    table[1] = {
      arc: 1, value: midv, interp: true,
      how: "cannot be constructed · between ⅔·crd 1½° = " + lo.toFixed(6) + " and 4/3·crd ¾° = " + hi.toFixed(6) + " — Ptolemy takes the mean"
    };
    clearPick();
    say("crd 1° bounded and interpolated.");
  });
  ops.querySelector("#c-sine").addEventListener("click", ev => {
    showSine = !showSine;
    ev.currentTarget.classList.toggle("on", showSine);
    paintTable();
  });

  paintTable();
  drawFig();
};

/* ---- Spherical Menelaos -------------------------------------------- */
function v3(x, y, z) { return { x, y, z }; }
function add3(a, b) { return v3(a.x + b.x, a.y + b.y, a.z + b.z); }
function mul3(a, s) { return v3(a.x * s, a.y * s, a.z * s); }
function dot3(a, b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
function cross3(a, b) { return v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x); }
function len3(a) { return Math.hypot(a.x, a.y, a.z); }
function norm3(a) { const L = len3(a) || 1; return mul3(a, 1 / L); }
function slerp(a, b, t) {
  const c = Math.max(-1, Math.min(1, dot3(a, b)));
  const th = Math.acos(c);
  if (th < 1e-5) return a;
  const s = Math.sin(th);
  return add3(mul3(a, Math.sin((1 - t) * th) / s), mul3(b, Math.sin(t * th) / s));
}

A.mountMenelaosSphere = function mountMenelaosSphere(el) {
  el.classList.add("proof-fig");
  const head = document.createElement("div");
  head.className = "whead";
  head.innerHTML = `<strong>Menelaos, spherical</strong><span class="readout">great circles · drag to turn</span>`;
  el.appendChild(head);
  const c = document.createElement("canvas");
  c.className = "fig";
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = 560, h = 400;
  c.width = w * dpr; c.height = h * dpr;
  c.style.aspectRatio = w + " / " + h;
  el.appendChild(c);
  const ctx = c.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const measure = document.createElement("p");
  measure.className = "measure";
  el.appendChild(measure);
  const stepEl = document.createElement("p");
  stepEl.className = "step-text";
  el.appendChild(stepEl);
  const row = document.createElement("div");
  row.className = "playrow";
  row.innerHTML = `
    <button type="button" class="pbtn" data-k="prev">←</button>
    <button type="button" class="pbtn" data-k="next">→</button>
    <button type="button" class="pbtn" data-k="replay">Replay</button>`;
  el.appendChild(row);

  const steps = [
    "Given: a spherical triangle in great circles. Drag the sphere; drag the sliders to move D and F.",
    "A transversal great circle cuts AB at D, CA at F, and BC (produced if needed) at E.",
    "The ratios are now chords of twice the arcs: crd(2 AD)/crd(2 DB) · crd(2 BE)/crd(2 EC) · crd(2 CF)/crd(2 FA).",
    "Q.E.D. — the product is 1, as in the plane, with chords of the double arcs."
  ];
  let step = 0, yaw = 28, pitch = 18, tD = 0.34, tF = 0.48;

  const A0 = norm3(v3(0.15, 0.75, 0.64));
  const B0 = norm3(v3(-0.82, -0.12, 0.55));
  const C0 = norm3(v3(0.78, -0.18, 0.60));

  function project(p) {
    const cy = Math.cos(yaw * Math.PI / 180), sy = Math.sin(yaw * Math.PI / 180);
    const cp = Math.cos(pitch * Math.PI / 180), sp = Math.sin(pitch * Math.PI / 180);
    let X = p.x * cy - p.z * sy;
    let Z = p.x * sy + p.z * cy;
    let Y = p.y * cp - Z * sp;
    Z = p.y * sp + Z * cp;
    const sc = 150;
    return { x: w / 2 + X * sc, y: h / 2 - Y * sc, z: Z, front: Z > -0.02 };
  }
  function great(n) {
    const a = Math.abs(n.y) < 0.9 ? v3(0, 1, 0) : v3(1, 0, 0);
    const u = norm3(cross3(n, a)), v = cross3(n, u);
    const pts = [];
    for (let i = 0; i <= 72; i++) {
      const t = i / 72 * Math.PI * 2;
      pts.push(add3(mul3(u, Math.cos(t)), mul3(v, Math.sin(t))));
    }
    return pts;
  }
  function strokeGreat(pts, color, width) {
    ctx.beginPath();
    let pen = false;
    pts.forEach(p => {
      const q = project(p);
      if (!q.front) { pen = false; return; }
      if (!pen) { ctx.moveTo(q.x, q.y); pen = true; } else ctx.lineTo(q.x, q.y);
    });
    ctx.strokeStyle = color; ctx.lineWidth = width || 1.5; ctx.stroke();
  }
  function crd2(P, Q) { return len3(cross3(P, Q)); } /* ∝ sin(arc) = crd(2 arc) / 120 */

  function config() {
    const D = slerp(A0, B0, tD);
    const F = slerp(C0, A0, tF);
    const nDF = cross3(D, F), nBC = cross3(B0, C0);
    let E = norm3(cross3(nDF, nBC));
    const midBC = slerp(B0, C0, 0.5);
    if (dot3(E, midBC) < 0) E = mul3(E, -1);
    const r1 = crd2(A0, D) / (crd2(D, B0) || 1e-9);
    const r2 = crd2(B0, E) / (crd2(E, C0) || 1e-9);
    const r3 = crd2(C0, F) / (crd2(F, A0) || 1e-9);
    return { D, F, E, r1, r2, r3, prod: r1 * r2 * r3 };
  }

  function draw() {
    const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#e8e0d0";
    const panel = getComputedStyle(document.documentElement).getPropertyValue("--panel2").trim() || "#1a2438";
    const gold = getComputedStyle(document.documentElement).getPropertyValue("--gold").trim() || "#d4a04a";
    const ember = getComputedStyle(document.documentElement).getPropertyValue("--ember").trim() || "#7ea8e0";
    const muted = getComputedStyle(document.documentElement).getPropertyValue("--muted").trim() || "#9aa8bc";
    ctx.fillStyle = panel; ctx.fillRect(0, 0, w, h);
    ctx.beginPath(); ctx.arc(w / 2, h / 2, 150, 0, Math.PI * 2);
    ctx.strokeStyle = muted; ctx.lineWidth = 1; ctx.stroke();
    const cf = config();
    strokeGreat(great(cross3(A0, B0)), ember, 1.5);
    strokeGreat(great(cross3(B0, C0)), ember, 1.5);
    strokeGreat(great(cross3(C0, A0)), ember, 1.5);
    if (step >= 1) strokeGreat(great(cross3(cf.D, cf.F)), gold, 2);
    const labels = [["A", A0], ["B", B0], ["C", C0]];
    if (step >= 1) labels.push(["D", cf.D], ["F", cf.F], ["E", cf.E]);
    labels.forEach(([lab, p]) => {
      const q = project(p);
      if (!q.front) return;
      ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(q.x, q.y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = ink; ctx.font = "italic 14px " + (getComputedStyle(document.documentElement).getPropertyValue("--serif") || "serif");
      ctx.fillText(lab, q.x + 6, q.y - 4);
    });
    measure.textContent = step >= 2
      ? `crd(2AD)/crd(2DB) = ${cf.r1.toFixed(3)} · crd(2BE)/crd(2EC) = ${cf.r2.toFixed(3)} · crd(2CF)/crd(2FA) = ${cf.r3.toFixed(3)} · product ${cf.prod.toFixed(3)}`
      : "the product of the three ratios of chords of twice the arcs is 1";
    stepEl.innerHTML = steps[step].indexOf("Q.E.D.") === 0
      ? `<p class="qed">${steps[step]}</p>`
      : steps[step];
    A._menelaosSphereProduct = cf.prod;
    A._menelaosSphereSet = (td, tf) => { tD = td; tF = tf; draw(); return config().prod; };
  }

  let last = null;
  c.style.cursor = "grab";
  c.addEventListener("pointerdown", e => { last = [e.clientX, e.clientY]; c.setPointerCapture(e.pointerId); });
  c.addEventListener("pointermove", e => {
    if (!last) return;
    yaw += (e.clientX - last[0]) * 0.4;
    pitch = Math.max(-70, Math.min(70, pitch + (e.clientY - last[1]) * 0.3));
    last = [e.clientX, e.clientY];
    draw();
  });
  c.addEventListener("pointerup", () => { last = null; });

  const sliders = document.createElement("div");
  el.insertBefore(sliders, measure);
  function slider(lab, min, max, val, on) {
    const row = document.createElement("div");
    row.className = "ctrl";
    row.innerHTML = `<label>${lab}</label><input type="range" min="${min}" max="${max}" step="0.01" value="${val}"><span class="val"></span>`;
    sliders.appendChild(row);
    const inp = row.querySelector("input");
    inp.addEventListener("input", () => on(+inp.value));
    return inp;
  }
  slider("D on AB", 0.12, 0.88, tD, v => { tD = v; draw(); });
  slider("F on CA", 0.12, 0.88, tF, v => { tF = v; draw(); });

  row.addEventListener("click", e => {
    const k = e.target.closest("[data-k]");
    if (!k) return;
    if (k.dataset.k === "prev") step = Math.max(0, step - 1);
    if (k.dataset.k === "next") step = Math.min(steps.length - 1, step + 1);
    if (k.dataset.k === "replay") step = 0;
    draw();
  });
  draw();
};

})();
