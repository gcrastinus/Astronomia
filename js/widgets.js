(function () {
const A = window.AstroArs;
const ast = A.astro;

function css(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}
function ink() { return css("--ink", "#e8e0d0"); }
function muted() { return css("--muted", "#9aa8bc"); }
function gold() { return css("--gold", "#d4a04a"); }
function ember() { return css("--ember", "#7ea8e0"); }
function skyCol() { return css("--sky", "#071018"); }
function starCol() { return css("--star", "#f6eed8"); }
function eclCol() { return css("--ecliptic", "#e08a55"); }
function eqCol() { return css("--equator", "#6aa8e0"); }
function panel2() { return css("--panel2", "#1a2438"); }
function rule() { return css("--rule", "#2a364c"); }
function sage() { return css("--sage", "#7dba9a"); }

function pad(el, html) {
  const d = document.createElement("div");
  d.innerHTML = html;
  while (d.firstChild) el.appendChild(d.firstChild);
}

function head(el, title, read) {
  const h = document.createElement("div");
  h.className = "whead";
  h.innerHTML = `<strong>${title}</strong><span class="readout">${read || ""}</span>`;
  el.appendChild(h);
  return h.querySelector(".readout");
}

function sliderRow(parent, label, min, max, step, value, fmt) {
  const row = document.createElement("div");
  row.className = "ctrl";
  const lab = document.createElement("label");
  lab.textContent = label;
  const inp = document.createElement("input");
  inp.type = "range";
  inp.min = min; inp.max = max; inp.step = step; inp.value = value;
  const val = document.createElement("span");
  val.className = "val";
  val.textContent = fmt ? fmt(+inp.value) : inp.value;
  row.append(lab, inp, val);
  parent.appendChild(row);
  return {
    input: inp, val,
    get: () => +inp.value,
    set(v) { inp.value = v; val.textContent = fmt ? fmt(+inp.value) : inp.value; },
    on(fn) {
      inp.addEventListener("input", () => {
        val.textContent = fmt ? fmt(+inp.value) : inp.value;
        fn(+inp.value);
      });
    }
  };
}

function toggleRow(parent, items, onChange) {
  const box = document.createElement("div");
  box.className = "toggles";
  const state = {};
  items.forEach(it => {
    state[it.id] = it.on !== false;
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = it.label;
    b.dataset.id = it.id;
    if (state[it.id]) b.classList.add("on");
    b.setAttribute("aria-pressed", state[it.id] ? "true" : "false");
    b.addEventListener("click", () => {
      state[it.id] = !state[it.id];
      b.classList.toggle("on", state[it.id]);
      b.setAttribute("aria-pressed", state[it.id] ? "true" : "false");
      onChange(state);
    });
    box.appendChild(b);
  });
  parent.appendChild(box);
  return state;
}

function canvasEl(parent, w, h, cls) {
  const c = document.createElement("canvas");
  c.className = cls || "fig";
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = w * dpr; c.height = h * dpr;
  c.style.aspectRatio = w + " / " + h;
  const ctx = c.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  parent.appendChild(c);
  return { canvas: c, ctx, w, h, dpr };
}

function alive(el) { return el.isConnected; }

/* Year can be historical (AD 26, 130 BC). Date(26,...) would become 1926. */
function dateFromYD(year, doy, hour, utc) {
  const hh = Math.floor(hour), mm = Math.round((hour % 1) * 60) % 60;
  if (utc) {
    const d = new Date(Date.UTC(2000, 0, 1));
    d.setUTCFullYear(year, 0, 1);
    d.setUTCDate(doy);
    d.setUTCHours(hh, mm, 0, 0);
    return d;
  }
  const d = new Date(2000, 0, 1, hh, mm, 0);
  d.setFullYear(year, 0, 1);
  d.setDate(doy);
  d.setHours(hh, mm, 0, 0);
  return d;
}
function xyToHoriz(x, y, W, H) {
  const p = ast.horizToXY(0, 0, W, H);
  const r = Math.hypot(x - p.cx, y - p.cy);
  const alt = 90 - (r / (p.R || 1)) * 90;
  const az = ast.atan2d(p.cx - x, p.cy - y);
  return { alt, az };
}
function skyDist(a, b) {
  return ast.acosd(ast.clamp(
    ast.sind(a.alt) * ast.sind(b.alt) + ast.cosd(a.alt) * ast.cosd(b.alt) * ast.cosd(a.az - b.az),
    -1, 1));
}

A.mountWidgets = function mountWidgets(root) {
  root.querySelectorAll("[data-kind]").forEach(el => {
    const kind = el.dataset.kind;
    const map = {
      sky: mountSky, sphere: mountSphere, gnomon: mountGnomon,
      chords: A.mountChordTable, model: mountModel, ellipse: mountEllipse,
      eclipse: mountEclipse, eratosthenes: mountEratosthenes,
      menelaos: A.mountMenelaosSphere || mountMenelaos, worlds: mountWorlds, journal: mountJournal,
      drill: mountDrill, check: mountCheck, phases: mountPhases,
      precess: mountPrecess, moontest: mountMoonTest, parallax: mountParallax,
      proof: A.mountProof, varstar: mountVarstar
    };
    if (map[kind]) map[kind](el);
  });
};

/* ---- Sky ----------------------------------------------------------- */
function mountSky(el) {
  const mode = el.dataset.mode || "full"; /* full | stars | sun | moon | planets */
  const readout = head(el, el.dataset.title || "The sky from where you stand", "");
  const fig = canvasEl(el, 720, 480, "sky");
  const { canvas, ctx, w, h } = fig;

  const useUTC = el.dataset.utc === "1";
  const quietLabels = el.dataset.labels === "off";
  const quietRead = el.dataset.quiet === "1";
  let date = new Date();
  if (el.dataset.date) date = new Date(el.dataset.date);
  const epochLock = el.dataset.epoch != null && el.dataset.epoch !== ""
    ? parseInt(el.dataset.epoch, 10) : null;
  let lat = el.dataset.lat != null ? +el.dataset.lat : (A.lat ? A.lat() : 40.7);
  let lon = el.dataset.lon != null ? +el.dataset.lon : (A.lon ? A.lon() : -new Date().getTimezoneOffset() / 4);
  const startHour = el.dataset.hour != null ? +el.dataset.hour : (date.getHours() + date.getMinutes() / 60);
  const startDay = el.dataset.day != null ? +el.dataset.day : dayOfYearNow(date);
  if (epochLock != null && isFinite(epochLock)) {
    date = dateFromYD(epochLock, startDay, startHour, useUTC);
  } else if (el.dataset.hour != null || el.dataset.day != null) {
    date = dateFromYD(date.getFullYear(), startDay, startHour, useUTC);
  }
  let playing = false, timer = 0, pick = null;

  const wrap = document.createElement("div");
  el.appendChild(wrap);

  const latS = sliderRow(wrap, "Latitude", -60, 70, 0.5, lat, v => ast.fmtDeg(v, "N", "S"));
  const lonS = sliderRow(wrap, "Longitude", -180, 180, 0.5, lon, v => ast.fmtDeg(v, "E", "W"));
  const hourS = sliderRow(wrap, "Hour", 0, 24, 0.02, startHour, v => {
    const hh = Math.floor(v) % 24, mm = Math.round((v % 1) * 60) % 60;
    return String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
  });
  const dayS = sliderRow(wrap, "Day of year", 1, 365, 1, startDay, v => "day " + Math.round(v));
  if (el.dataset.hidelat === "1") latS.input.closest(".ctrl").style.display = "none";
  if (el.dataset.hidelon === "1") lonS.input.closest(".ctrl").style.display = "none";

  const toggles = [];
  if (mode === "full" || mode === "stars") toggles.push({ id: "stars", label: "Stars", on: true });
  if (mode === "full" || mode === "stars") toggles.push({ id: "lines", label: "Figures", on: true });
  if (mode === "full" || mode === "planets") toggles.push({ id: "planets", label: "Wanderers", on: true });
  if (mode !== "stars") toggles.push({ id: "sun", label: "Sun", on: mode !== "moon" });
  if (mode === "full" || mode === "moon") toggles.push({ id: "moon", label: "Moon", on: true });
  toggles.push({ id: "eq", label: "Equator", on: true }, { id: "ecl", label: "Ecliptic", on: true });
  const vis = toggleRow(wrap, toggles, draw);

  const play = document.createElement("div");
  play.className = "playrow";
  play.innerHTML = `<button class="pbtn primary" data-m="now">This hour</button>
    <button class="pbtn" data-m="play">Run the day</button>
    <button class="pbtn" data-m="year">Run the year</button>`;
  wrap.appendChild(play);
  if (useUTC || epochLock != null) {
    const nowBtn = play.querySelector("[data-m=now]");
    if (nowBtn) nowBtn.style.display = "none";
  }
  play.addEventListener("click", e => {
    const m = e.target.dataset.m;
    if (!m) return;
    if (m === "now") {
      const now = new Date();
      const y = epochLock != null && isFinite(epochLock) ? epochLock : now.getFullYear();
      date = dateFromYD(y, dayOfYearNow(now), now.getHours() + now.getMinutes() / 60, useUTC);
      latS.set(lat);
      hourS.set(now.getHours() + now.getMinutes() / 60);
      dayS.set(dayOfYearNow(now));
      stop(); draw();
    } else if (m === "play") {
      if (playing === "day") stop(); else start("day");
    } else if (m === "year") {
      if (playing === "year") stop(); else start("year");
    }
  });

  canvas.addEventListener("pointerdown", onDrag);
  let lastX = 0, startX = 0, startY = 0;
  function onDrag(e) {
    lastX = startX = e.clientX;
    startY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    const move = ev => {
      const dx = ev.clientX - lastX;
      lastX = ev.clientX;
      const hours = hourS.get() - dx * 0.02;
      let h = hours;
      while (h < 0) h += 24;
      while (h >= 24) h -= 24;
      hourS.set(h);
      apply();
    };
    const up = ev => {
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      const moved = Math.hypot(ev.clientX - startX, ev.clientY - startY);
      if (el.dataset.pick === "pole" && moved < 8) {
        const rect = canvas.getBoundingClientRect();
        const x = (ev.clientX - rect.left) / rect.width * w;
        const y = (ev.clientY - rect.top) / rect.height * h;
        pick = xyToHoriz(x, y, w, h);
        draw();
      }
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
  }

  const persist = !el.dataset.lat && !el.dataset.utc;
  latS.on(v => { lat = v; if (persist && A.setLat) A.setLat(v); draw(); });
  lonS.on(v => { lon = v; if (persist && A.setLon) A.setLon(v); draw(); });
  hourS.on(apply);
  dayS.on(apply);

  function dayOfYearNow(d) {
    const y = d.getFullYear();
    const start = Date.UTC(y, 0, 0);
    return Math.floor((Date.UTC(y, d.getMonth(), d.getDate()) - start) / 86400000);
  }
  function apply() {
    const y = epochLock != null && isFinite(epochLock) ? epochLock : date.getFullYear();
    date = dateFromYD(y, dayS.get(), hourS.get(), useUTC);
    draw();
  }
  function start(kind) {
    stop();
    playing = kind;
    play.querySelector("[data-m='" + (kind === "day" ? "play" : "year") + "']").classList.add("on");
    timer = setInterval(() => {
      if (!alive(el)) { stop(); return; }
      if (kind === "day") {
        let h = hourS.get() + 0.08;
        if (h >= 24) h -= 24;
        hourS.set(h);
      } else {
        let d = dayS.get() + 1;
        if (d > 365) d = 1;
        dayS.set(d);
      }
      apply();
    }, 40);
  }
  function stop() {
    playing = false;
    clearInterval(timer);
    play.querySelectorAll("button").forEach(b => b.classList.remove("on"));
  }

  function draw() {
    applyDate();
    const sky = ast.bodies(date, lat, lon);
    const { w, h } = fig;
    ctx.fillStyle = skyCol();
    ctx.fillRect(0, 0, w, h);
    /* twilight wash */
    const salt = sky.sun.alt;
    if (salt > -18) {
      const a = ast.clamp((salt + 18) / 30, 0, 1);
      const g = ctx.createRadialGradient(w / 2, h * 0.92, 10, w / 2, h * 0.5, h * 0.7);
      g.addColorStop(0, `rgba(232,160,80,${0.35 * a})`);
      g.addColorStop(1, `rgba(10,16,32,0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
    const rim = ast.horizToXY(0, 0, w, h);
    ctx.beginPath();
    ctx.arc(rim.cx, rim.cy, rim.R, 0, ast.TAU);
    ctx.strokeStyle = css("--horizon", "#6a7c94");
    ctx.lineWidth = 1.4;
    ctx.stroke();
    /* cardinals */
    if (!quietLabels) {
      ctx.fillStyle = muted();
      ctx.font = "12px ui-sans-serif, sans-serif";
      ctx.textAlign = "center";
      [["N", 0], ["E", 90], ["S", 180], ["W", 270]].forEach(([lab, az]) => {
        const p = ast.horizToXY(0, az, w, h);
        const dy = (az === 0 || az === 180) ? -8 : 14;
        ctx.fillText(lab, p.x, p.y + dy);
      });
    }
    /* equator / ecliptic */
    if (vis.eq) drawEquator(ctx, w, h, sky, eqCol());
    if (vis.ecl) drawEcliptic(ctx, w, h, sky, eclCol());
    /* pole */
    const pole = ast.horizToXY(sky.pole.alt, sky.pole.az, w, h);
    if (sky.pole.alt > 0 && !quietLabels) {
      ctx.beginPath();
      ctx.arc(pole.x, pole.y, 4, 0, ast.TAU);
      ctx.strokeStyle = gold();
      ctx.stroke();
    }
    if (vis.stars) {
      if (vis.lines) drawLines(ctx, w, h, sky);
      sky.stars.forEach(s => {
        if (s.alt < 0) return;
        const p = ast.horizToXY(s.alt, s.az, w, h);
        const r = Math.max(0.6, 3.2 - s.mag * 0.55);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, ast.TAU);
        ctx.fillStyle = starCol();
        ctx.globalAlpha = ast.clamp(1.1 - s.mag * 0.18, 0.35, 1);
        ctx.fill();
        ctx.globalAlpha = 1;
        if (!quietLabels && (s.mag < 2.1 || s.name === "Polaris" || s.name === "Algol")) {
          ctx.fillStyle = muted();
          ctx.font = "10px ui-sans-serif, sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(s.name, p.x + 5, p.y - 3);
        }
      });
    }
    if (vis.planets) {
      Object.values(sky.planets).forEach(p => {
        if (p.alt < -1) return;
        const xy = ast.horizToXY(p.alt, p.az, w, h);
        const pr = Math.max(1.8, 4.2 - p.mag * 0.55);
        ctx.beginPath();
        ctx.arc(xy.x, xy.y, pr, 0, ast.TAU);
        ctx.fillStyle = gold();
        ctx.fill();
        if (!quietLabels) {
          ctx.fillStyle = gold();
          ctx.font = "11px ui-sans-serif, sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(p.name, xy.x + pr + 3, xy.y - 4);
        }
      });
    }
    if (vis.moon) {
      const m = sky.moon;
      if (m.alt > -2) {
        const xy = ast.horizToXY(m.alt, m.az, w, h);
        const sxy = ast.horizToXY(sky.sun.alt, sky.sun.az, w, h);
        const pa = Math.atan2(sxy.y - xy.y, sxy.x - xy.x);
        const rMoon = 8 * ast.clamp(385000 / (m.dist || 385000), 0.84, 1.22);
        drawMoon(ctx, xy.x, xy.y, rMoon, m.phase, pa);
        if (!quietLabels) {
          ctx.fillStyle = muted();
          ctx.font = "11px ui-sans-serif, sans-serif";
          ctx.fillText("Moon", xy.x + rMoon + 4, xy.y - 6);
        }
      }
    }
    if (vis.sun) {
      const s = sky.sun;
      if (s.alt > -4) {
        const xy = ast.horizToXY(s.alt, s.az, w, h);
        const g = ctx.createRadialGradient(xy.x, xy.y, 2, xy.x, xy.y, 18);
        g.addColorStop(0, "#fff6d0");
        g.addColorStop(1, "rgba(255,200,80,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(xy.x, xy.y, 18, 0, ast.TAU); ctx.fill();
        ctx.fillStyle = "#ffe9a0";
        ctx.beginPath(); ctx.arc(xy.x, xy.y, 7, 0, ast.TAU); ctx.fill();
      }
    }
    if (pick) {
      const xy = ast.horizToXY(pick.alt, pick.az, w, h);
      ctx.strokeStyle = gold();
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(xy.x, xy.y, 8, 0, ast.TAU); ctx.stroke();
    }
    const yShow = epochLock != null && isFinite(epochLock) ? epochLock : date.getFullYear();
    const bits = [];
    if (el.dataset.hidelat !== "1") bits.push(ast.fmtDeg(lat, "N", "S"));
    if (!quietRead) {
      bits.push(yShow < 0 ? Math.abs(yShow) + " BC" : String(yShow));
      bits.push(date.toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: useUTC ? "UTC" : undefined }));
    }
    if (useUTC) {
      const hh = Math.floor(hourS.get()) % 24, mm = Math.round((hourS.get() % 1) * 60) % 60;
      bits.push(String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0"));
    } else bits.push(ast.fmtTime(date));
    if (sky.sun && !quietRead) bits.push("Sun alt " + sky.sun.alt.toFixed(0) + "°");
    readout.textContent = bits.join(" · ");
  }
  function applyDate() {
    const y = epochLock != null && isFinite(epochLock) ? epochLock : date.getFullYear();
    date = dateFromYD(y, +dayS.input.value, +hourS.input.value, useUTC);
  }
  el._astroState = function () {
    const pole = { alt: lat >= 0 ? lat : -lat, az: lat >= 0 ? 0 : 180 };
    return {
      lat, lon, hour: hourS.get(), day: dayS.get(),
      startHour, startDay, pick, pole,
      hourTurn: Math.min(Math.abs(hourS.get() - startHour), 24 - Math.abs(hourS.get() - startHour))
    };
  };
  draw();
}

function drawPath(ctx, w, h, sky, samples, color) {
  ctx.beginPath();
  let started = false;
  samples.forEach(([ra, dec]) => {
    const hz = ast.eqToHoriz(ra, dec, sky.lat, sky.lst);
    if (hz.alt < -2) { started = false; return; }
    const p = ast.horizToXY(hz.alt, hz.az, w, h);
    if (!started) { ctx.moveTo(p.x, p.y); started = true; }
    else ctx.lineTo(p.x, p.y);
  });
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.globalAlpha = 1;
}
function drawEquator(ctx, w, h, sky, color) {
  const s = [];
  for (let i = 0; i <= 72; i++) s.push([i * 5, 0]);
  drawPath(ctx, w, h, sky, s, color);
}
function drawEcliptic(ctx, w, h, sky, color) {
  const s = [], eps = sky.eps;
  for (let i = 0; i <= 72; i++) {
    const lon = i * 5;
    const ra = ast.atan2d(ast.cosd(eps) * ast.sind(lon), ast.cosd(lon));
    const dec = ast.asind(ast.sind(eps) * ast.sind(lon));
    s.push([ra, dec]);
  }
  drawPath(ctx, w, h, sky, s, color);
}

function drawLines(ctx, w, h, sky) {
  const by = {};
  sky.stars.forEach(s => { by[s.name] = s; });
  ctx.strokeStyle = "rgba(200,210,230,0.22)";
  ctx.lineWidth = 1;
  ast.LINES.forEach(([a, b]) => {
    const A = by[a], B = by[b];
    if (!A || !B || A.alt < 0 || B.alt < 0) return;
    const p = ast.horizToXY(A.alt, A.az, w, h);
    const q = ast.horizToXY(B.alt, B.az, w, h);
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
  });
}

function drawMoon(ctx, x, y, r, phase, pa) {
  /* pa: canvas angle of the sun from the moon; +x after rotate faces the sun. */
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(pa || 0);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, ast.TAU);
  ctx.fillStyle = "#1a2230"; ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, r, 0, ast.TAU);
  ctx.clip();
  const w = (phase - 0.5) * 2 * r;
  ctx.fillStyle = "#e8e0c8";
  ctx.fillRect(0, -r, r, 2 * r);
  if (phase >= 0.5) {
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.abs(w), r, 0, 0, ast.TAU);
    ctx.fill();
  } else {
    ctx.fillStyle = "#1a2230";
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.abs(w), r, 0, 0, ast.TAU);
    ctx.fill();
  }
  ctx.restore();
  ctx.beginPath(); ctx.arc(x, y, r, 0, ast.TAU);
  ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.stroke();
}

/* ---- Sphere (horizon / poles / great circles) ---------------------- */
function mountSphere(el) {
  const readout = head(el, el.dataset.title || "The celestial sphere", "drag to turn");
  const fig = canvasEl(el, 640, 420, "fig");
  const { canvas, ctx, w, h } = fig;
  let yaw = 28, pitch = 18;
  const latS = sliderRow(el, "Observer’s latitude", -60, 70, 0.5, A.lat ? A.lat() : 40, v => ast.fmtDeg(v, "N", "S"));
  const vis = toggleRow(el, [
    { id: "hor", label: "Horizon", on: true },
    { id: "eq", label: "Equator", on: true },
    { id: "ecl", label: "Ecliptic", on: true },
    { id: "pol", label: "Poles", on: true }
  ], draw);
  latS.on(draw);

  let last = null;
  canvas.style.cursor = "grab";
  canvas.addEventListener("pointerdown", e => {
    last = [e.clientX, e.clientY];
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", e => {
    if (!last) return;
    yaw += (e.clientX - last[0]) * 0.4;
    pitch = ast.clamp(pitch + (e.clientY - last[1]) * 0.3, -70, 70);
    last = [e.clientX, e.clientY];
    draw();
  });
  canvas.addEventListener("pointerup", () => { last = null; });

  function project(x, y, z) {
    const cy = ast.cosd(yaw), sy = ast.sind(yaw);
    const cp = ast.cosd(pitch), sp = ast.sind(pitch);
    let X = x * cy - z * sy;
    let Z = x * sy + z * cy;
    let Y = y * cp - Z * sp;
    Z = y * sp + Z * cp;
    const sc = 150;
    return { x: w / 2 + X * sc, y: h / 2 - Y * sc, z: Z, front: Z > -0.02 };
  }
  function circle(n, fn, color, dash) {
    const pts = [];
    for (let i = 0; i <= n; i++) pts.push(fn(i / n * 360));
    ctx.beginPath();
    let pen = false;
    pts.forEach(p => {
      const q = project(p[0], p[1], p[2]);
      if (!q.front) { pen = false; return; }
      if (!pen) { ctx.moveTo(q.x, q.y); pen = true; }
      else ctx.lineTo(q.x, q.y);
    });
    ctx.strokeStyle = color;
    ctx.setLineDash(dash || []);
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.setLineDash([]);
  }
  function draw() {
    const lat = latS.get();
    ctx.fillStyle = panel2();
    ctx.fillRect(0, 0, w, h);
    /* sphere outline */
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 150, 0, ast.TAU);
    ctx.strokeStyle = rule();
    ctx.lineWidth = 1;
    ctx.stroke();
    if (vis.eq) circle(72, t => [ast.cosd(t), 0, ast.sind(t)], eqCol());
    if (vis.ecl) {
      const eps = 23.44;
      circle(72, t => {
        const x = ast.cosd(t);
        const y = ast.sind(eps) * ast.sind(t);
        const z = ast.cosd(eps) * ast.sind(t);
        return [x, y, z];
      }, eclCol());
    }
    if (vis.hor) {
      /* horizon is a great circle whose pole is the zenith, at latitude lat from equator */
      const co = 90 - lat;
      circle(72, t => {
        /* rotate equator by co around x */
        const x = ast.cosd(t);
        const y = ast.sind(t) * ast.cosd(co);
        const z = ast.sind(t) * ast.sind(co);
        return [x, y, z];
      }, css("--horizon", "#8a9bb0"));
    }
    if (vis.pol) {
      [["NCP", 0, 1, 0], ["SCP", 0, -1, 0]].forEach(([lab, x, y, z]) => {
        const p = project(x, y, z);
        if (!p.front) return;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, ast.TAU);
        ctx.fillStyle = gold(); ctx.fill();
        ctx.fillStyle = muted();
        ctx.font = "11px ui-sans-serif, sans-serif";
        ctx.fillText(lab, p.x + 6, p.y - 4);
      });
      const zen = project(0, ast.sind(lat), ast.cosd(lat));
      if (zen.front) {
        ctx.fillStyle = ember();
        ctx.beginPath(); ctx.arc(zen.x, zen.y, 3, 0, ast.TAU); ctx.fill();
        ctx.fillStyle = muted();
        ctx.font = "11px ui-sans-serif, sans-serif";
        ctx.fillText("zenith", zen.x + 6, zen.y - 4);
      }
    }
    readout.textContent = "latitude " + ast.fmtDeg(lat, "N", "S") + " · pole altitude = latitude";
  }
  draw();
}

/* ---- Gnomon -------------------------------------------------------- */
function mountGnomon(el) {
  const readout = head(el, "The gnomon", "");
  const fig = canvasEl(el, 640, 360, "fig");
  const { ctx, w, h } = fig;
  const latS = sliderRow(el, "Latitude", 0, 60, 0.5, 30, v => ast.fmtDeg(v, "N", "S"));
  const dayS = sliderRow(el, "Day of year", 1, 365, 1, 172, v => {
    const d = new Date(2026, 0, v);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  });
  const hourS = sliderRow(el, "Hour from noon", -8, 8, 0.05, 0, v => (v >= 0 ? "+" : "") + v.toFixed(2) + " h");
  latS.on(draw); dayS.on(draw); hourS.on(draw);

  function decl(doy) {
    /* solar declination approx */
    return -23.44 * ast.cosd(360 / 365 * (doy + 10));
  }
  function draw() {
    const lat = latS.get(), doy = dayS.get(), hour = hourS.get();
    const dec = decl(doy);
    const ha = hour * 15;
    const alt = ast.asind(ast.sind(lat) * ast.sind(dec) + ast.cosd(lat) * ast.cosd(dec) * ast.cosd(ha));
    const az = ast.atan2d(-ast.cosd(dec) * ast.sind(ha), ast.cosd(lat) * ast.sind(dec) - ast.sind(lat) * ast.cosd(dec) * ast.cosd(ha));
    ctx.fillStyle = panel2(); ctx.fillRect(0, 0, w, h);
    const groundY = h * 0.72;
    ctx.fillStyle = css("--rule", "#2a364c");
    ctx.fillRect(0, groundY, w, h - groundY);
    const gx = w * 0.38, stick = 90;
    ctx.strokeStyle = gold();
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(gx, groundY); ctx.lineTo(gx, groundY - stick); ctx.stroke();
    ctx.fillStyle = gold();
    ctx.beginPath(); ctx.arc(gx, groundY - stick, 4, 0, ast.TAU); ctx.fill();
    if (alt > 0) {
      const len = stick / Math.tan(ast.rad(alt));
      const dir = ast.rad(az);
      /* shadow on ground, south-up in the drawing would be confusing; draw along +x for west of south */
      const sx = gx + Math.sin(dir) * Math.min(len, 280);
      const sy = groundY + Math.cos(dir) * Math.min(len, 40) * 0.15;
      ctx.strokeStyle = muted();
      ctx.lineWidth = 8; ctx.lineCap = "round";
      ctx.globalAlpha = 0.35;
      ctx.beginPath(); ctx.moveTo(gx, groundY); ctx.lineTo(sx, groundY); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1.5; ctx.lineCap = "butt";
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = ember();
      ctx.beginPath(); ctx.moveTo(gx, groundY - stick); ctx.lineTo(sx, groundY); ctx.stroke();
      ctx.setLineDash([]);
    }
    /* noon shadow length at this day (ha=0) */
    const noonAlt = ast.asind(ast.sind(lat) * ast.sind(dec) + ast.cosd(lat) * ast.cosd(dec));
    const noonLen = noonAlt > 0 ? 1 / Math.tan(ast.rad(noonAlt)) : Infinity;
    readout.textContent = alt > 0
      ? `sun altitude ${alt.toFixed(1)}° · noon shadow / gnomon = ${noonLen.toFixed(3)} · declination ${dec.toFixed(1)}°`
      : "the sun is below the horizon";
  }
  draw();
}

/* ---- Planetary model (the equatorium) ------------------------------ */
function mountModel(el) {
  const kind = el.dataset.model || "epicycle"; /* epicycle | eccentric | equant | build */
  const fitPlanet = (el.dataset.fit || "").toLowerCase(); /* "" | mars | venus */
  const fitting = fitPlanet === "mars" || fitPlanet === "venus";
  const planetName = fitPlanet === "venus" ? "Venus" : "Mars";
  const readout = head(el, el.dataset.title || "A model of a wanderer", "you build it");
  const fig = canvasEl(el, 640, fitting ? 400 : 480, "fig");
  const { ctx, w, h } = fig;
  const cx = w / 2, cy = h / 2;
  const R = 150;

  const spaceRead = document.createElement("p");
  spaceRead.className = "figcap";
  el.appendChild(spaceRead);

  let fitFig = null, fitCtx = null, fitW = 640, fitH = 160;
  const fitRead = document.createElement("p");
  fitRead.className = "fit-read";
  if (fitting) {
    fitFig = canvasEl(el, fitW, fitH, "fig");
    fitCtx = fitFig.ctx;
    el.appendChild(fitRead);
  }

  const PTOLEMY = {
    mars:  { e: 6 / 60, q: 6 / 60, epi: 39.5 / 60, apo: 156.1, label: "Almagest X.7: e = 6/60, epicycle 39;30/60, bisected; apogee of date 156°" },
    venus: { e: 1.25 / 60, q: 1.25 / 60, epi: (43 + 10 / 60) / 60, apo: 28.3, label: "Almagest X.1–4: e = 1;15/60, epicycle 43;10/60, bisected; apogee of date 28°" }
  };

  const defEpi = el.dataset.epi != null ? +el.dataset.epi
    : (kind === "epicycle" || kind === "build" || kind === "equant" ? 0.38 : 0);
  const defEcc = el.dataset.ecc != null ? +el.dataset.ecc
    : (kind === "eccentric" || kind === "equant" || kind === "build" ? 0.18 : 0);
  const defEq = el.dataset.eq != null ? +el.dataset.eq
    : (kind === "equant" || kind === "build" ? 0.18 : 0);

  const epiS = sliderRow(el, "Epicycle / deferent", 0, 0.7, 0.005, defEpi, v => (v * 100).toFixed(1) + "%");
  const eccS = sliderRow(el, "Eccentricity", 0, 0.45, 0.005, defEcc, v => v.toFixed(3));
  const eqS = sliderRow(el, "Equant beyond centre", 0, 0.45, 0.005, defEq, v => v.toFixed(3));
  const apoS = sliderRow(el, "Apogee", 0, 360, 0.5, fitting ? PTOLEMY[fitPlanet].apo : 0, v => v.toFixed(1) + "°");
  const meanS = sliderRow(el, "Mean longitude", 0, 360, 0.5, 20, v => v.toFixed(1) + "°");
  const anomS = sliderRow(el, "Epicycle anomaly", 0, 360, 0.5, 40, v => v.toFixed(1) + "°");

  if (kind === "eccentric") { epiS.input.closest(".ctrl").style.display = "none"; eqS.input.closest(".ctrl").style.display = "none"; }
  if (kind === "epicycle") { eccS.input.closest(".ctrl").style.display = "none"; eqS.input.closest(".ctrl").style.display = "none"; }
  if (!fitting) apoS.input.closest(".ctrl").style.display = "none";
  if (fitting) {
    meanS.input.closest(".ctrl").style.display = "none";
    anomS.input.closest(".ctrl").style.display = "none";
  }

  const series = [];
  if (fitting) {
    const t0 = Date.UTC(2026, 0, 1);
    for (let i = 0; i < 60; i++) {
      const date = new Date(t0 + i * 20 * 86400000);
      const jd = ast.julian(date);
      series.push({ jd, lon: ast.planet(planetName, jd).lon, day: i * 20 });
    }
  }

  let trail = [], trailLon = [], playing = false, timer = 0, fitIndex = 0, hasRun = false;

  function meanLonAt(jd, name) {
    const p = ast.PLANETS[name];
    const T = (jd - 2451545.0) / 36525;
    return ast.wrap360(p.L + p.dL * T);
  }
  function clockAt(jd) {
    if (fitPlanet === "venus") {
      return { mean: ast.sun(jd).lon, anomAbs: ast.planet("Venus", jd).helio.lon };
    }
    /* Outer planet: epicycle radius parallel to the earth–sun line. */
    return { mean: meanLonAt(jd, "Mars"), anomAbs: ast.sun(jd).lon };
  }

  function pos(opts) {
    const e = eccS.get(), q = eqS.get(), r = epiS.get() * R;
    const apo = apoS.get();
    const mean = opts && opts.mean != null ? opts.mean : meanS.get();
    const anomAbs = opts && opts.anomAbs != null ? opts.anomAbs : (mean + anomS.get());
    const Dx = e * R * ast.cosd(apo), Dy = e * R * ast.sind(apo);
    /* Equant offset is measured from the deferent centre, along the apsides. */
    const Ex = Dx + q * R * ast.cosd(apo), Ey = Dy + q * R * ast.sind(apo);
    const ux = ast.cosd(mean), uy = ast.sind(mean);
    const ox = Ex - Dx, oy = Ey - Dy;
    const b = 2 * (ox * ux + oy * uy);
    const c = ox * ox + oy * oy - R * R;
    const disc = Math.max(0, b * b - 4 * c);
    const t = (-b + Math.sqrt(disc)) / 2;
    const Cx = Ex + t * ux, Cy = Ey + t * uy;
    const Px = Cx + r * ast.cosd(anomAbs);
    const Py = Cy + r * ast.sind(anomAbs);
    const lon = ast.atan2d(Py, Px);
    return { Dx, Dy, Ex, Ey, Cx, Cy, Px, Py, lon, r, e, q, apo, mean };
  }

  function residuals() {
    if (!series.length) return null;
    let sum = 0, worst = 0, worstDay = 0;
    const model = [];
    series.forEach(s => {
      const ck = clockAt(s.jd);
      const p = pos(ck);
      const d = ast.wrap180(p.lon - s.lon);
      model.push(p.lon);
      sum += d * d;
      if (Math.abs(d) > Math.abs(worst)) { worst = d; worstDay = s.day; }
    });
    return { rms: Math.sqrt(sum / series.length), worst, worstDay, model };
  }

  const play = document.createElement("div");
  play.className = "playrow";
  play.innerHTML = `<button class="pbtn primary" data-m="run">Run</button>
    <button class="pbtn" data-m="clear">Clear path</button>`
    + (fitting ? `<button class="pbtn" data-m="reveal" disabled>Reveal</button>` : "");
  el.appendChild(play);
  play.addEventListener("click", e => {
    const m = e.target.dataset.m;
    if (m === "clear") { trail = []; trailLon = []; draw(); }
    if (m === "reveal" && fitting && hasRun) {
      const pv = PTOLEMY[fitPlanet];
      epiS.set(pv.epi); eccS.set(pv.e); eqS.set(pv.q); apoS.set(pv.apo);
      trail = [];
      draw();
      A.toast && A.toast(pv.label);
    }
    if (m === "run") {
      if (playing) { playing = false; clearInterval(timer); e.target.classList.remove("on"); }
      else {
        playing = true; e.target.classList.add("on");
        timer = setInterval(() => {
          if (!alive(el)) { clearInterval(timer); return; }
          if (fitting) {
            fitIndex = (fitIndex + 1) % series.length;
          } else {
            meanS.set((meanS.get() + 1.2) % 360);
            anomS.set((anomS.get() + 3.4) % 360);
          }
          draw();
        }, 40);
      }
    }
  });
  const onShape = () => { trail = []; trailLon = []; hasRun = true; const b = play.querySelector("[data-m=reveal]"); if (b) b.disabled = false; draw(); };
  [epiS, eccS, eqS, apoS, meanS, anomS].forEach(s => s.on(onShape));

  function draw() {
    const ck = fitting ? clockAt(series[fitIndex].jd) : null;
    const p = pos(ck || undefined);
    ctx.fillStyle = panel2(); ctx.fillRect(0, 0, w, h);
    /* apsidal line and bisection ticks */
    if (p.e > 0.005 || p.q > 0.005) {
      const ex = cx + p.Ex, ey = cy - p.Ey, dx = cx + p.Dx, dy = cy - p.Dy;
      ctx.strokeStyle = muted();
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();
      const vx = ex - cx, vy = ey - cy, len = Math.hypot(vx, vy) || 1;
      const px = -vy / len * 6, py = vx / len * 6;
      [[cx, cy], [dx, dy], [ex, ey]].forEach(([x, y]) => {
        ctx.beginPath(); ctx.moveTo(x - px, y - py); ctx.lineTo(x + px, y + py); ctx.stroke();
      });
    }
    /* earth */
    ctx.fillStyle = ember();
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, ast.TAU); ctx.fill();
    ctx.fillStyle = muted();
    ctx.font = "11px ui-sans-serif, sans-serif";
    const dlen = Math.hypot(p.Dx, p.Dy);
    ctx.textAlign = "center";
    if (dlen > 4) {
      ctx.fillText("Earth", cx - 20 * p.Dx / dlen, cy + 20 * p.Dy / dlen);
    } else {
      ctx.textAlign = "right";
      ctx.fillText("Earth", cx - 10, cy - 8);
    }
    ctx.textAlign = "left";
    /* deferent */
    ctx.beginPath(); ctx.arc(cx + p.Dx, cy - p.Dy, R, 0, ast.TAU);
    ctx.strokeStyle = eqCol(); ctx.lineWidth = 1.2; ctx.stroke();
    /* screen unit along apsides, and a perpendicular for labels */
    const elen = Math.hypot(p.Ex, p.Ey) || 1;
    const sUx = p.Ex / elen, sUy = -p.Ey / elen;
    const pUx = -sUy, pUy = sUx;
    const gap = Math.hypot(p.Ex - p.Dx, p.Ey - p.Dy);
    /* equant */
    if (eqS.get() > 0.005 || eccS.get() > 0.005) {
      ctx.fillStyle = sage();
      ctx.beginPath(); ctx.arc(cx + p.Ex, cy - p.Ey, 4, 0, ast.TAU); ctx.fill();
      const lift = gap < 12 ? 22 : 12;
      ctx.fillStyle = muted();
      ctx.textAlign = sUx >= 0 ? "left" : "right";
      ctx.fillText("equant", cx + p.Ex + 8 * (sUx >= 0 ? 1 : -1) + pUx * 4, cy - p.Ey - lift);
      ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(cx + p.Ex, cy - p.Ey); ctx.lineTo(cx + p.Cx, cy - p.Cy);
      ctx.strokeStyle = sage(); ctx.stroke();
      ctx.setLineDash([]);
    }
    /* centre of deferent */
    if (eccS.get() > 0.005) {
      ctx.fillStyle = gold();
      ctx.beginPath(); ctx.arc(cx + p.Dx, cy - p.Dy, 3, 0, ast.TAU); ctx.fill();
      ctx.fillStyle = muted();
      ctx.textAlign = sUx >= 0 ? "left" : "right";
      ctx.fillText("deferent centre", cx + p.Dx + 8 * (sUx >= 0 ? 1 : -1), cy - p.Dy + 16);
    }
    ctx.textAlign = "left";
    /* epicycle */
    if (p.r > 1) {
      ctx.beginPath(); ctx.arc(cx + p.Cx, cy - p.Cy, p.r, 0, ast.TAU);
      ctx.strokeStyle = eclCol(); ctx.stroke();
    }
    /* trail */
    trail.push([p.Px, p.Py]);
    trailLon.push(p.lon);
    if (trail.length > 360) { trail.shift(); trailLon.shift(); }
    if (trail.length > 1) {
      ctx.beginPath();
      trail.forEach((t, i) => {
        const x = cx + t[0], y = cy - t[1];
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = gold(); ctx.globalAlpha = 0.55; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.globalAlpha = 1;
    }
    /* planet */
    ctx.fillStyle = gold();
    ctx.beginPath(); ctx.arc(cx + p.Px, cy - p.Py, 6, 0, ast.TAU); ctx.fill();
    /* line of sight */
    ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + p.Px, cy - p.Py);
    ctx.strokeStyle = muted(); ctx.stroke(); ctx.setLineDash([]);

    const eR = p.e, qR = p.q, eqR = eR + qR;
    const bisected = Math.abs(eR - qR) < 0.002 && eR > 0.002;
    spaceRead.textContent = `Earth 0 · centre ${eR.toFixed(3)} R · equant ${eqR.toFixed(3)} R — ${bisected ? "bisected" : "not bisected"}`;

    if (fitting) {
      const res = residuals();
      const under = res.rms < 1.0;
      fitRead.classList.toggle("ok", under);
      fitRead.textContent = `residual ${res.rms.toFixed(1)}° · worst ${res.worst >= 0 ? "+" : ""}${res.worst.toFixed(1)}° at day ${res.worstDay}`
        + (under ? " — under 1.0°" : " · bring the residual under 1.0°")
        + " · anomaly tied to the sun, as Ptolemy has it for the outer planets";
      if (fitPlanet === "venus") {
        fitRead.textContent = `residual ${res.rms.toFixed(1)}° · worst ${res.worst >= 0 ? "+" : ""}${res.worst.toFixed(1)}° at day ${res.worstDay}`
          + (under ? " — under 1.0°" : " · bring the residual under 1.0°")
          + " · deferent tied to the sun, as Ptolemy has it for the inner planets";
      }
      drawFit(res);
      readout.textContent = `true longitude ${p.lon.toFixed(1)}° · day ${series[fitIndex].day}`;
    } else {
      const mean = p.mean;
      const eq = ast.wrap180(p.lon - mean);
      readout.textContent = `true longitude ${p.lon.toFixed(1)}° · mean ${mean.toFixed(1)}° · equation ${eq >= 0 ? "+" : ""}${eq.toFixed(1)}°`;
    }
  }

  function unwrap(lons) {
    const out = [lons[0]];
    for (let i = 1; i < lons.length; i++) out.push(out[i - 1] + ast.wrap180(lons[i] - lons[i - 1]));
    return out;
  }
  function drawFit(res) {
    if (!fitCtx) return;
    const fw = fitW, fh = fitH, ctx2 = fitCtx;
    ctx2.fillStyle = panel2(); ctx2.fillRect(0, 0, fw, fh);
    const obs = unwrap(series.map(s => s.lon));
    const mod = unwrap(res.model);
    let lo = Infinity, hi = -Infinity;
    obs.concat(mod).forEach(v => { if (v < lo) lo = v; if (v > hi) hi = v; });
    const pad = 8;
    const xOf = i => pad + i / (series.length - 1) * (fw - 2 * pad);
    const yOf = v => fh - pad - (v - lo) / ((hi - lo) || 1) * (fh - 2 * pad);
    ctx2.beginPath();
    obs.forEach((v, i) => { const x = xOf(i), y = yOf(v); if (i === 0) ctx2.moveTo(x, y); else ctx2.lineTo(x, y); });
    ctx2.strokeStyle = muted(); ctx2.globalAlpha = 0.45; ctx2.lineWidth = 1.6; ctx2.stroke(); ctx2.globalAlpha = 1;
    ctx2.beginPath();
    mod.forEach((v, i) => { const x = xOf(i), y = yOf(v); if (i === 0) ctx2.moveTo(x, y); else ctx2.lineTo(x, y); });
    ctx2.strokeStyle = gold(); ctx2.lineWidth = 1.6; ctx2.stroke();
    const xi = xOf(fitIndex), yi = yOf(mod[fitIndex]);
    ctx2.fillStyle = gold();
    ctx2.beginPath(); ctx2.arc(xi, yi, 3.5, 0, ast.TAU); ctx2.fill();
    ctx2.fillStyle = muted();
    ctx2.font = "11px ui-sans-serif, sans-serif";
    ctx2.fillText("observed", pad, 14);
    ctx2.fillStyle = gold();
    ctx2.fillText("model", pad + 70, 14);
  }

  el._astroState = function () {
    return {
      e: eccS.get(), q: eqS.get(), epi: epiS.get(),
      apo: apoS.get(), mean: meanS.get(), anom: anomS.get(),
      trailLon: trailLon.slice()
    };
  };
  draw();
}

/* ---- Ellipse / Kepler ---------------------------------------------- */
function mountEllipse(el) {
  const readout = head(el, el.dataset.title || "The ellipse", "two foci, string taut");
  const fig = canvasEl(el, 640, 400, "fig");
  const { ctx, w, h } = fig;
  const startE = el.dataset.e != null ? +el.dataset.e : 0.25;
  const startNu = el.dataset.nu != null ? +el.dataset.nu : 35;
  const eS = sliderRow(el, "Eccentricity", 0, 0.7, 0.005, startE, v => v.toFixed(3));
  const nuS = sliderRow(el, "True anomaly", 0, 360, 0.5, startNu, v => v.toFixed(1) + "°");
  let playing = false, timer = 0, swept = [];
  eS.on(() => { swept = []; draw(); });
  nuS.on(draw);
  const play = document.createElement("div");
  play.className = "playrow";
  play.innerHTML = `<button class="pbtn primary" data-m="run">Sweep equal times</button>`;
  el.appendChild(play);
  play.addEventListener("click", e => {
    if (!e.target.dataset.m) return;
    if (playing) { playing = false; clearInterval(timer); e.target.classList.remove("on"); return; }
    playing = true; e.target.classList.add("on"); swept = [];
    timer = setInterval(() => {
      if (!alive(el)) { clearInterval(timer); return; }
      /* equal-area: advance mean anomaly, convert to true */
      const e0 = eS.get();
      let M = ast.rad(nuS.get()); /* treat slider as mean for animation */
      M = (M + 0.04) % ast.TAU;
      const E = ast.kepler(ast.deg(M), e0);
      const nu = ast.atan2d(Math.sqrt(1 - e0 * e0) * Math.sin(E), Math.cos(E) - e0);
      nuS.set(nu);
      swept.push(nu);
      if (swept.length > 80) swept.shift();
      draw();
    }, 40);
  });

  function draw() {
    const e0 = eS.get(), nu = nuS.get();
    const a = 180, b = a * Math.sqrt(1 - e0 * e0), c = a * e0;
    const cx = w / 2, cy = h / 2;
    ctx.fillStyle = panel2(); ctx.fillRect(0, 0, w, h);
    ctx.beginPath();
    for (let i = 0; i <= 180; i++) {
      const t = i / 180 * ast.TAU;
      const x = cx + a * Math.cos(t), y = cy - b * Math.sin(t);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = eqCol(); ctx.lineWidth = 1.6; ctx.stroke();
    /* foci */
    [[-c, "S, the sun"], [c, "empty focus"]].forEach(([fx, lab], i) => {
      ctx.fillStyle = i === 0 ? gold() : muted();
      ctx.beginPath(); ctx.arc(cx + fx, cy, 5, 0, ast.TAU); ctx.fill();
      ctx.fillStyle = muted();
      ctx.font = "11px ui-sans-serif, sans-serif";
      ctx.fillText(lab, cx + fx + 8, cy - 8);
    });
    const r = a * (1 - e0 * e0) / (1 + e0 * ast.cosd(nu));
    const px = cx - c + r * ast.cosd(nu);
    const py = cy - r * ast.sind(nu);
    /* radii to both foci */
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = gold();
    ctx.beginPath(); ctx.moveTo(cx - c, cy); ctx.lineTo(px, py); ctx.lineTo(cx + c, cy); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = ember();
    ctx.beginPath(); ctx.arc(px, py, 6, 0, ast.TAU); ctx.fill();
    /* area sector from perihelion */
    ctx.fillStyle = "rgba(212,160,74,0.18)";
    ctx.beginPath(); ctx.moveTo(cx - c, cy);
    for (let t = 0; t <= nu; t += 2) {
      const rr = a * (1 - e0 * e0) / (1 + e0 * ast.cosd(t));
      ctx.lineTo(cx - c + rr * ast.cosd(t), cy - rr * ast.sind(t));
    }
    ctx.closePath(); ctx.fill();
    const peri = a * (1 - e0), aph = a * (1 + e0);
    readout.textContent = `r = ${r.toFixed(1)} · perihelion ${peri.toFixed(1)} · aphelion ${aph.toFixed(1)} · PF + P F′ = 2a`;
  }
  el._astroState = function () { return { e: eS.get(), nu: nuS.get() }; };
  draw();
}

/* ---- Eclipse / moon distance --------------------------------------- */
function mountEclipse(el) {
  const readout = head(el, "The earth’s shadow", "a lunar eclipse is a measuring-rod");
  const fig = canvasEl(el, 640, 320, "fig");
  const { ctx, w, h } = fig;
  const dS = sliderRow(el, "Moon’s distance (earth-radii)", 30, 80, 0.1, 60, v => v.toFixed(1) + " R⊕");
  dS.on(draw);
  function draw() {
    const D = dS.get();
    ctx.fillStyle = panel2(); ctx.fillRect(0, 0, w, h);
    const y = h / 2;
    /* sun off left, earth, shadow cone */
    ctx.fillStyle = "#ffe9a0";
    ctx.beginPath(); ctx.arc(40, y, 28, 0, ast.TAU); ctx.fill();
    ctx.fillStyle = ember();
    ctx.beginPath(); ctx.arc(220, y, 18, 0, ast.TAU); ctx.fill();
    /* umbra: sun radius 109 earth radii, distance sun ~ 23455 Re; umbra length ~ 216 Re */
    const L = 216;
    const umbraAtMoon = 18 * (1 - D / L);
    const mx = 220 + D * 3.2;
    ctx.fillStyle = "rgba(20,24,36,0.55)";
    ctx.beginPath();
    ctx.moveTo(220, y - 18);
    ctx.lineTo(220 + L * 3.2, y);
    ctx.lineTo(220, y + 18);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = muted();
    ctx.beginPath(); ctx.arc(mx, y, 5, 0, ast.TAU); ctx.fill();
    ctx.strokeStyle = gold();
    ctx.beginPath(); ctx.arc(mx, y, Math.max(2, umbraAtMoon), 0, ast.TAU); ctx.stroke();
    ctx.fillStyle = muted();
    ctx.font = "12px ui-sans-serif, sans-serif";
    ctx.fillText("Sun", 28, y + 48);
    ctx.fillText("Earth", 200, y + 42);
    ctx.fillText("Moon", mx - 10, y + 28);
    const parDeg = ast.asind(1 / D);
    const nowM = ast.moon(ast.julian(new Date()));
    const Re = 6378.14;
    readout.textContent = `umbra breadth at the moon ≈ ${(umbraAtMoon / 5).toFixed(2)} moon-diameters · horizontal parallax ${parDeg.toFixed(2)}° (${(parDeg * 60).toFixed(0)}′) · tonight ${nowM.dist.toFixed(0)} km (${(nowM.dist / Re).toFixed(1)} R⊕), parallax ${nowM.parallax.toFixed(2)}°`;
  }
  draw();
}

/* ---- Eratosthenes -------------------------------------------------- */
function mountEratosthenes(el) {
  const readout = head(el, "Two gnomons, one earth", "Syene and Alexandria");
  const fig = canvasEl(el, 640, 340, "fig");
  const { ctx, w, h } = fig;
  const angS = sliderRow(el, "Shadow angle at Alexandria", 4, 12, 0.05, 7.2, v => v.toFixed(2) + "°");
  const distS = sliderRow(el, "Distance of the cities", 4000, 6000, 10, 5000, v => v.toFixed(0) + " stadia");
  angS.on(draw); distS.on(draw);
  function draw() {
    const ang = angS.get(), dist = distS.get();
    const circ = dist * 360 / ang;
    ctx.fillStyle = panel2(); ctx.fillRect(0, 0, w, h);
    const cx = 220, cy = h / 2 + 10, R = 110;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, ast.TAU);
    ctx.strokeStyle = eqCol(); ctx.lineWidth = 1.6; ctx.stroke();
    /* Open the 7° for the eye; the readout keeps the measured angle. */
    const vis = Math.max(38, ang * 5);
    const a0 = -90, a1 = -90 + vis;
    const labels = [
      [a0, "Syene", -72, 6],
      [a1, "Alexandria", 10, -8]
    ];
    labels.forEach(([a, lab, dx, dy]) => {
      const x = cx + R * ast.cosd(a), y = cy + R * ast.sind(a);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y);
      ctx.strokeStyle = muted(); ctx.stroke();
      ctx.fillStyle = gold(); ctx.beginPath(); ctx.arc(x, y, 4, 0, ast.TAU); ctx.fill();
      ctx.fillStyle = muted(); ctx.font = "11px ui-sans-serif, sans-serif";
      ctx.textAlign = dx < 0 ? "right" : "left";
      ctx.fillText(lab, x + dx, y + dy);
    });
    ctx.textAlign = "left";
    /* parallel rays */
    ctx.setLineDash([4, 4]); ctx.strokeStyle = gold();
    for (let i = 0; i < 4; i++) {
      const y = 40 + i * 70;
      ctx.beginPath(); ctx.moveTo(400, y); ctx.lineTo(620, y); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.fillStyle = muted();
    ctx.font = "12px ui-sans-serif, sans-serif";
    ctx.fillText("sun’s rays, taken as parallel", 410, 24);
    readout.textContent = `circumference = ${dist.toFixed(0)} × 360 / ${ang.toFixed(2)} = ${circ.toFixed(0)} stadia`;
  }
  draw();
}

/* ---- Menelaos ------------------------------------------------------ */
function mountMenelaos(el) {
  const readout = head(el, "Menelaos on the sphere", "a transversal cutting a triangle");
  const fig = canvasEl(el, 560, 420, "fig");
  const { ctx, w, h } = fig;
  const tS = sliderRow(el, "Transversal", 10, 70, 0.5, 32, v => v.toFixed(0) + "°");
  tS.on(draw);
  function draw() {
    const t = tS.get();
    ctx.fillStyle = panel2(); ctx.fillRect(0, 0, w, h);
    const A = [280, 50], B = [80, 340], C = [500, 340];
    const D = lerp(A, B, 0.45), F = lerp(A, C, 0.55);
    const E = lerp(B, C, t / 100 + 0.15);
    function lerp(p, q, k) { return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]; }
    ctx.strokeStyle = eqCol(); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(C[0], C[1]); ctx.closePath(); ctx.stroke();
    ctx.strokeStyle = eclCol();
    ctx.beginPath(); ctx.moveTo(D[0], D[1]); ctx.lineTo(E[0], E[1]); ctx.lineTo(F[0], F[1]); ctx.stroke();
    const pts = { A, B, C, D, E, F };
    Object.entries(pts).forEach(([k, p]) => {
      ctx.fillStyle = gold(); ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, ast.TAU); ctx.fill();
      ctx.fillStyle = muted(); ctx.font = "12px ui-sans-serif, sans-serif";
      ctx.fillText(k, p[0] + 6, p[1] - 6);
    });
    readout.textContent = "crd(2 AD)/crd(2 DB) × crd(2 BE)/crd(2 EC) × crd(2 CF)/crd(2 FA) = 1";
  }
  draw();
}

/* ---- Three world-systems ------------------------------------------- */
function mountWorlds(el) {
  const readout = head(el, "Three constructions of the same appearances", "Ptolemy · Copernicus · Tycho");
  const fig = canvasEl(el, 720, 280, "fig");
  const { ctx, w, h } = fig;
  const tS = sliderRow(el, "Time", 0, 360, 0.5, 20, v => v.toFixed(0) + "°");
  tS.on(draw);
  const vis = toggleRow(el, [
    { id: "p", label: "Ptolemy", on: true },
    { id: "c", label: "Copernicus", on: true },
    { id: "t", label: "Tycho", on: true }
  ], draw);
  function draw() {
    const t = tS.get();
    ctx.fillStyle = panel2(); ctx.fillRect(0, 0, w, h);
    const panels = [
      { id: "p", x: 120, title: "Ptolemy", draw: drawP },
      { id: "c", x: 360, title: "Copernicus", draw: drawC },
      { id: "t", x: 600, title: "Tycho", draw: drawT }
    ];
    panels.forEach(p => {
      ctx.fillStyle = muted();
      ctx.font = "12px ui-sans-serif, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.title, p.x, 22);
      if (vis[p.id] !== false) p.draw(p.x, t);
    });
    readout.textContent = "the same elongation of Mars, three hypotheses";
  }
  function planet(x, y, col) {
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 5, 0, ast.TAU); ctx.fill();
  }
  function orbit(x, y, r, col) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, ast.TAU);
    ctx.strokeStyle = col; ctx.globalAlpha = 0.5; ctx.stroke(); ctx.globalAlpha = 1;
  }
  function drawP(ox, t) {
    const R = 70, r = 28;
    orbit(ox, 150, R, eqCol());
    const cx = ox + R * ast.cosd(t), cy = 150 - R * ast.sind(t);
    orbit(cx, cy, r, eclCol());
    const px = cx + r * ast.cosd(t * 2.1), py = cy - r * ast.sind(t * 2.1);
    planet(ox, 150, ember());
    planet(px, py, gold());
  }
  function drawC(ox, t) {
    orbit(ox, 150, 36, gold());
    orbit(ox, 150, 70, eqCol());
    const ex = ox + 36 * ast.cosd(t), ey = 150 - 36 * ast.sind(t);
    const px = ox + 70 * ast.cosd(t * 0.53), py = 150 - 70 * ast.sind(t * 0.53);
    planet(ox, 150, gold()); /* sun */
    planet(ex, ey, ember());
    planet(px, py, sage());
  }
  function drawT(ox, t) {
    orbit(ox, 150, 36, gold());
    const sx = ox + 36 * ast.cosd(t), sy = 150 - 36 * ast.sind(t);
    orbit(sx, sy, 40, eqCol());
    const px = sx + 40 * ast.cosd(t * 0.53), py = sy - 40 * ast.sind(t * 0.53);
    planet(ox, 150, ember());
    planet(sx, sy, gold());
    planet(px, py, sage());
  }
  draw();
}

/* ---- Venus phases -------------------------------------------------- */
function mountPhases(el) {
  const readout = head(el, "The phases of Venus", "full range refutes Ptolemy’s arrangement");
  const fig = canvasEl(el, 640, 300, "fig");
  const { ctx, w, h } = fig;
  const tS = sliderRow(el, "Venus about the sun", 0, 360, 0.5, 40, v => v.toFixed(0) + "°");
  tS.on(draw);
  function draw() {
    const t = tS.get();
    ctx.fillStyle = panel2(); ctx.fillRect(0, 0, w, h);
    const sun = [220, 150], earth = [220 + 120, 150];
    ctx.fillStyle = "#ffe9a0"; ctx.beginPath(); ctx.arc(sun[0], sun[1], 10, 0, ast.TAU); ctx.fill();
    ctx.fillStyle = ember(); ctx.beginPath(); ctx.arc(earth[0], earth[1], 7, 0, ast.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(sun[0], sun[1], 70, 0, ast.TAU);
    ctx.strokeStyle = gold(); ctx.globalAlpha = 0.4; ctx.stroke(); ctx.globalAlpha = 1;
    const vx = sun[0] + 70 * ast.cosd(t), vy = sun[1] - 70 * ast.sind(t);
    ctx.fillStyle = sage(); ctx.beginPath(); ctx.arc(vx, vy, 6, 0, ast.TAU); ctx.fill();
    /* phase from elongation earth-sun-venus */
    const ax = vx - earth[0], ay = vy - earth[1];
    const bx = sun[0] - vx, by = sun[1] - vy;
    const cos = (ax * bx + ay * by) / (Math.hypot(ax, ay) * Math.hypot(bx, by) || 1);
    const phase = (1 + cos) / 2;
    ctx.fillStyle = muted();
    ctx.font = "12px ui-sans-serif, sans-serif";
    ctx.fillText("Sun", sun[0] - 10, sun[1] + 28);
    ctx.fillText("Earth", earth[0] - 12, earth[1] + 26);
    ctx.fillText("Venus", vx + 8, vy - 8);
    /* disk */
    const dx = 500, dy = 150, R = 36;
    ctx.beginPath(); ctx.arc(dx, dy, R, 0, ast.TAU); ctx.fillStyle = "#e8e0c8"; ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(dx, dy, R, 0, ast.TAU); ctx.clip();
    ctx.fillStyle = "#1a2230";
    ctx.fillRect(dx - R, dy - R, R * 2 * (1 - phase), R * 2);
    ctx.restore();
    readout.textContent = `illuminated fraction ${ (phase * 100).toFixed(0) }% · Ptolemy’s Venus, always between earth and sun, cannot show a full face`;
  }
  draw();
}

/* ---- Precession ---------------------------------------------------- */
function mountPrecess(el) {
  const readout = head(el, "The slow swivel of the poles", "the pole among the stars");
  const fig = canvasEl(el, 640, 440, "fig");
  const { ctx, w, h } = fig;
  const yS = sliderRow(el, "Epoch", -5000, 15000, 1, 2026, v => {
    const y = Math.round(v);
    return y < 0 ? Math.abs(y) + " BC" : String(y);
  });
  yS.on(draw);
  const named = ["Thuban", "Polaris", "Vega", "Deneb", "Alderamin"];
  function jdYear(y) {
    const d = new Date(Date.UTC(2000, 6, 1));
    d.setUTCFullYear(Math.round(y), 6, 1);
    return ast.julian(d);
  }
  function plot(lon, lat, R) {
    const r = ((90 - lat) / 50) * R;
    const th = ast.rad(lon - 90);
    return { x: w / 2 + r * Math.sin(th), y: h / 2 - r * Math.cos(th), r };
  }
  function draw() {
    const year = Math.round(yS.get());
    const jd = jdYear(year);
    const eps = 23.439291;
    const R = Math.min(w, h) * 0.42;
    ctx.fillStyle = panel2(); ctx.fillRect(0, 0, w, h);
    /* ecliptic pole at centre; NCP traces a circle of radius ε */
    const ncpR = (23.44 / 50) * R;
    ctx.beginPath(); ctx.arc(w / 2, h / 2, ncpR, 0, ast.TAU);
    ctx.strokeStyle = eqCol(); ctx.globalAlpha = 0.55; ctx.lineWidth = 1.4; ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = muted();
    ctx.font = "11px ui-sans-serif, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ecliptic pole", w / 2, h / 2 + 12);
    ast.STARS.forEach(s => {
      const ecl = ast.eqToEcl(s[1] * 15, s[2], eps);
      if (ecl.lat < 40) return;
      const p = plot(ecl.lon, ecl.lat, R);
      const mag = s[3];
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.8, 3.0 - mag * 0.45), 0, ast.TAU);
      ctx.fillStyle = starCol(); ctx.fill();
      if (named.indexOf(s[0]) >= 0 || mag < 1.3) {
        ctx.fillStyle = muted();
        ctx.font = "11px ui-sans-serif, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(s[0], p.x + 5, p.y - 3);
      }
    });
    const ncp = ast.precessInv(0, 90, jd);
    const ncpE = ast.eqToEcl(ncp.ra, ncp.dec, eps);
    const pp = plot(ncpE.lon, ncpE.lat, R);
    ctx.beginPath(); ctx.arc(pp.x, pp.y, 5, 0, ast.TAU);
    ctx.strokeStyle = gold(); ctx.lineWidth = 1.6; ctx.stroke();
    ctx.fillStyle = gold();
    ctx.font = "11px ui-sans-serif, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("NCP", pp.x + 8, pp.y + 4);
    let nearest = null, best = 1e9;
    ast.STARS.forEach(s => {
      const eq = ast.precess(s[1] * 15, s[2], jd);
      const dist = 90 - eq.dec;
      if (dist < best) { best = dist; nearest = s[0]; }
    });
    const yLab = year < 0 ? "−" + Math.abs(year) : String(year);
    readout.textContent = `${yLab}: the pole is ${best.toFixed(1)}° from ${nearest}`;
  }
  draw();
}

/* ---- Moon test ----------------------------------------------------- */
function mountMoonTest(el) {
  const readout = head(el, "The same tendency here and there", "Newton’s moon test, schematic");
  const fig = canvasEl(el, 640, 320, "fig");
  const { ctx, w, h } = fig;
  const rS = sliderRow(el, "Moon’s distance in earth-radii", 50, 70, 0.1, 60, v => v.toFixed(1));
  rS.on(draw);
  function draw() {
    const n = rS.get();
    /* If gravity ~ 1/r^2, acceleration at moon / g = (R/D)^2.
       Moon falls from tangent ~ 1.37 mm in 1s; g = 9.8 m/s^2.
       Fall in 1 min at surface: 0.5 g t^2. */
    const ratio = 1 / (n * n);
    const g = 9.8;
    const fallMoon = 0.5 * g * ratio * 1; /* metres in 1s */
    ctx.fillStyle = panel2(); ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = ember();
    ctx.beginPath(); ctx.arc(180, 160, 28, 0, ast.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(180, 160, 28 * n / 8, 0, ast.TAU);
    ctx.strokeStyle = gold(); ctx.globalAlpha = 0.4; ctx.stroke(); ctx.globalAlpha = 1;
    const mx = 180 + 28 * n / 8, my = 160;
    ctx.fillStyle = muted(); ctx.beginPath(); ctx.arc(mx, my, 7, 0, ast.TAU); ctx.fill();
    ctx.fillStyle = muted(); ctx.font = "12px ui-sans-serif, sans-serif";
    ctx.fillText("Earth", 160, 210);
    ctx.fillText("Moon", mx - 10, my + 24);
    readout.textContent = `if the inverse-square holds, the moon “falls” ${ (fallMoon * 1000).toFixed(2) } mm in the first second — the number Huygens’s pendulum had already given for a stone`;
  }
  draw();
}

/* ---- Parallax ------------------------------------------------------ */
function mountParallax(el) {
  const readout = head(el, "The shift Ptolemy said would be there", "Bessel, 61 Cygni, 1838");
  const fig = canvasEl(el, 640, 300, "fig");
  const { ctx, w, h } = fig;
  const tS = sliderRow(el, "Earth in its orbit", 0, 360, 0.5, 0, v => v.toFixed(0) + "°");
  const dS = sliderRow(el, "Star distance (parsecs)", 1, 20, 0.1, 3.5, v => v.toFixed(1) + " pc");
  tS.on(draw); dS.on(draw);
  function draw() {
    const t = tS.get(), d = dS.get();
    const p = 1 / d; /* arcsec */
    ctx.fillStyle = panel2(); ctx.fillRect(0, 0, w, h);
    const sun = [160, 160];
    ctx.fillStyle = "#ffe9a0"; ctx.beginPath(); ctx.arc(sun[0], sun[1], 8, 0, ast.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(sun[0], sun[1], 50, 0, ast.TAU);
    ctx.strokeStyle = gold(); ctx.globalAlpha = 0.4; ctx.stroke(); ctx.globalAlpha = 1;
    const ex = sun[0] + 50 * ast.cosd(t), ey = sun[1] - 50 * ast.sind(t);
    ctx.fillStyle = ember(); ctx.beginPath(); ctx.arc(ex, ey, 5, 0, ast.TAU); ctx.fill();
    const star = [520, 90];
    ctx.fillStyle = starCol(); ctx.beginPath(); ctx.arc(star[0], star[1], 3, 0, ast.TAU); ctx.fill();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = muted();
    ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(star[0], star[1]); ctx.stroke();
    ctx.setLineDash([]);
    const shift = p * 40;
    ctx.strokeStyle = eclCol();
    ctx.beginPath(); ctx.arc(star[0], star[1] + 80, Math.max(6, shift), 0, ast.TAU); ctx.stroke();
    readout.textContent = `parallax ${p.toFixed(3)}″ · Ptolemy argued that if the earth moved, the stars would shift; Bessel measured the shift`;
  }
  draw();
}

/* ---- Variable star (Algol) ---------------------------------------- */
function mountVarstar(el) {
  const names = Object.keys(ast.VARSTARS || {});
  const start = el.dataset.star && ast.VARSTARS[el.dataset.star] ? el.dataset.star : "Algol";
  const readout = head(el, el.dataset.title || "A star that changes", "");
  const fig = canvasEl(el, 640, 280, "fig");
  const { ctx, w, h } = fig;
  const pick = document.createElement("div");
  pick.className = "ctrl";
  pick.innerHTML = `<label>Star</label><select>${names.map(n => `<option${n === start ? " selected" : ""}>${n}</option>`).join("")}</select><span class="val"></span>`;
  el.appendChild(pick);
  const sel = pick.querySelector("select");
  const tS = sliderRow(el, "Time from epoch", 0, 8, 0.02, 0, v => v.toFixed(2) + " d");
  sel.addEventListener("change", draw);
  tS.on(draw);

  function magAt(name, dt) {
    const rec = ast.VARSTARS[name];
    return ast.variableMag(rec, rec.epoch + dt);
  }
  function draw() {
    const name = sel.value;
    const rec = ast.VARSTARS[name];
    const dt = tS.get();
    const mag = magAt(name, dt);
    ctx.fillStyle = panel2(); ctx.fillRect(0, 0, w, h);
    /* light curve, left */
    const L = 360, T = 28, B = h - 36, top = 24;
    const pMax = rec.period * 2.2;
    ctx.strokeStyle = muted(); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(T, top); ctx.lineTo(T, B); ctx.lineTo(L, B); ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const t = i / 120 * pMax;
      const m = magAt(name, t);
      const x = T + (t / pMax) * (L - T - 8);
      const y = top + (m - rec.magMax) / (rec.magMin - rec.magMax + 0.05) * (B - top);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = gold(); ctx.lineWidth = 1.6; ctx.stroke();
    const xNow = T + (dt / pMax) * (L - T - 8);
    const yNow = top + (mag - rec.magMax) / (rec.magMin - rec.magMax + 0.05) * (B - top);
    ctx.fillStyle = gold(); ctx.beginPath(); ctx.arc(xNow, yNow, 4, 0, ast.TAU); ctx.fill();
    ctx.fillStyle = muted(); ctx.font = "11px ui-sans-serif, sans-serif";
    ctx.fillText("brighter", T + 6, top + 10);
    ctx.fillText("fainter", T + 6, B - 6);
    /* eclipsing geometry, right */
    const cx = 500, cy = h / 2;
    let phase = (dt / rec.period) % 1; if (phase < 0) phase += 1;
    if (rec.kind === "ea" || rec.kind === "eb") {
      const R1 = 28, R2 = rec.kind === "ea" ? 16 : 22;
      const sep = (R1 + R2 + 8) * Math.sin(phase * ast.TAU);
      ctx.fillStyle = "#e8d090";
      ctx.beginPath(); ctx.arc(cx - sep * 0.15, cy, R1, 0, ast.TAU); ctx.fill();
      ctx.fillStyle = rec.kind === "ea" ? "#3a4560" : "#c4a45c";
      ctx.beginPath(); ctx.arc(cx + sep, cy, R2, 0, ast.TAU); ctx.fill();
      ctx.fillStyle = muted(); ctx.textAlign = "center";
      ctx.fillText(rec.kind === "ea" ? "companion in front at minimum" : "two distorted stars", cx, h - 14);
      ctx.textAlign = "left";
    } else {
      const r = 22 + 8 * (rec.magMin - mag) / (rec.magMin - rec.magMax);
      ctx.fillStyle = gold();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, ast.TAU); ctx.fill();
      ctx.fillStyle = muted(); ctx.textAlign = "center";
      ctx.fillText("pulsating: the star itself swells and shrinks", cx, h - 14);
      ctx.textAlign = "left";
    }
    readout.textContent = name + " · mag " + mag.toFixed(2) + " · phase " + phase.toFixed(3) + " · period " + rec.period.toFixed(3) + " d";
  }
  draw();
}

/* ---- Journal ------------------------------------------------------- */
const JOURNAL_TASKS = {
  stars: { title: "The diurnal motion", prompt: "From one fixed spot, watch three bright stars for at least an hour. Do they all move? Together? What shape is each path?" },
  pole: { title: "The unmoving place", prompt: "Find the place in the sky that does not move. In the north, start from the Dipper. Note whether Polaris itself is exactly still." },
  starset: { title: "A star’s setting", prompt: "Time a star’s setting (or its disappearance behind a fixed ridge) on five nights. Does it set at the same time? At the same place?" },
  sunset: { title: "The sun on the horizon", prompt: "Mark where the sun sets, every third day for two or three weeks, from the same spot. Which way is it moving?" },
  daylength: { title: "The length of the day", prompt: "Time sunrise and sunset on the same day. Repeat monthly. When is the day longest? Are there days of equal length?" },
  lag: { title: "The sun among the stars", prompt: "Find a constellation that rises soon after sunset. Every few evenings, time that rising. The gap shrinks: the sun is creeping east." },
  moon: { title: "The moon for five nights", prompt: "From the first visibility after new moon, for five nights: which stars is she near? When does she set? How far has she moved?" },
  planets: { title: "A wanderer", prompt: "Pick a planet you can name. Sketch its place among the stars twice a week for a month. Does it always go east?" },
  gnomon: { title: "Noon shadow", prompt: "Plant a stick vertical. At local noon, measure shadow / stick. Repeat near a solstice and an equinox." },
  venus: { title: "Venus with binoculars", prompt: "If Venus is an evening or morning star, look with binoculars. Is the disk round? A crescent? Full?" },
  algol: { title: "Algol’s minimum", prompt: "Compare Algol with a nearby fixed star — β Trianguli or γ Andromedae (Almach) are the old pair — on successive nights. When is Algol the fainter? Time a minimum if you can." }
};
const JOURNAL_FIGURES = {
  sunset: { label: "Setting azimuth", unit: "°", store: "°", y: "azimuth °", placeholder: "270" },
  daylength: { label: "Hours of daylight", unit: "h", store: "h", y: "hours", placeholder: "12.4" },
  starset: { label: "Setting time", unit: "", store: "h", y: "setting time", placeholder: "21:40" },
  lag: { label: "Lag after sunset", unit: "min", store: "min", y: "minutes", placeholder: "90" },
  moon: { label: "Place along the ecliptic", unit: "°", store: "°", y: "longitude °", placeholder: "120" },
  gnomon: { label: "Shadow / stick", unit: "", store: "", y: "shadow / stick", placeholder: "0.8" },
  planets: { label: "Sketched longitude", unit: "°", store: "°", y: "longitude °", placeholder: "210" }
};

function wrap24(h) { h = h % 24; return h < 0 ? h + 24 : h; }
function jdFromISO(dateStr, hour) {
  const p = String(dateStr || "").split("-").map(Number);
  const h = hour == null ? 12 : hour;
  return ast.julian(new Date(Date.UTC(p[0] || 2026, (p[1] || 1) - 1, p[2] || 1,
    Math.floor(h), Math.round((Math.abs(h) % 1) * 60))));
}
function dayIndex(dateStr) {
  const p = String(dateStr || "").split("-").map(Number);
  return Date.UTC(p[0] || 2026, (p[1] || 1) - 1, p[2] || 1) / 86400000;
}
function parseJournalValue(task, raw) {
  const s = String(raw || "").trim().replace(",", ".");
  if (!s) return { value: null };
  const fig = JOURNAL_FIGURES[task];
  if (task === "starset") {
    const hm = s.match(/^(\d{1,2}):(\d{2})$/);
    if (hm) {
      const hh = +hm[1], mm = +hm[2];
      if (hh >= 0 && hh < 24 && mm >= 0 && mm < 60) return { value: hh + mm / 60, unit: "h" };
    }
  }
  const n = parseFloat(s);
  if (!isFinite(n)) return { error: true };
  return { value: n, unit: fig ? fig.store : "" };
}
function fmtJournalValue(e) {
  if (e.value == null || !isFinite(+e.value)) return "";
  if (e.task === "starset") {
    let h = +e.value;
    while (h < 0) h += 24;
    let hh = Math.floor(h);
    let mm = Math.round((h - hh) * 60);
    if (mm === 60) { mm = 0; hh += 1; }
    return String(hh % 24).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
  }
  const n = +e.value;
  const shown = Math.abs(n - Math.round(n)) < 1e-6 ? String(Math.round(n)) : String(Math.round(n * 1000) / 1000);
  if (!e.unit) return shown;
  if (e.unit === "°") return shown + "°";
  return shown + " " + e.unit;
}
function fmtJournalWhere(e) {
  const bits = [];
  if (e.lat != null && isFinite(+e.lat)) bits.push(ast.fmtDeg(+e.lat, "N", "S"));
  if (e.lon != null && isFinite(+e.lon)) bits.push(ast.fmtDeg(+e.lon, "E", "W"));
  return bits.join(", ");
}
function journalMarkdown(entries) {
  const list = (entries || []).slice().sort((a, b) => {
    const da = (a.date || "") + " " + (a.time || "");
    const db = (b.date || "") + " " + (b.time || "");
    return da < db ? -1 : da > db ? 1 : 0;
  });
  const order = Object.keys(JOURNAL_TASKS);
  const groups = {};
  list.forEach(e => {
    const t = e.task || "other";
    (groups[t] || (groups[t] = [])).push(e);
  });
  const lines = ["# Field journal", "", "Dated observations, from where you stand.", ""];
  const tasks = order.filter(t => groups[t]).concat(Object.keys(groups).filter(t => order.indexOf(t) < 0));
  if (!list.length) {
    lines.push("No entries yet.", "");
    return lines.join("\n");
  }
  tasks.forEach(t => {
    const title = (JOURNAL_TASKS[t] && JOURNAL_TASKS[t].title) || t;
    lines.push("## " + title, "");
    groups[t].forEach(e => {
      const when = [e.date || "", e.time || ""].filter(Boolean).join(" ");
      const head = [when, fmtJournalWhere(e), fmtJournalValue(e)].filter(Boolean).join(" · ");
      lines.push("**" + head + "** — " + String(e.note || "").replace(/\s+/g, " ").trim(), "");
    });
  });
  return lines.join("\n");
}
A.journalMarkdown = journalMarkdown;
function downloadText(filename, text, mime) {
  const blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function horizonH0(lat, dec) {
  const c = -ast.tand(lat) * ast.tand(dec);
  if (c <= -1) return 180;
  if (c >= 1) return 0;
  return ast.acosd(ast.clamp(c, -1, 1));
}
function sunsetAzimuth(lat, dec) {
  const H = horizonH0(lat, dec);
  if (H <= 0 || H >= 180) return null;
  return ast.eqToHoriz(0, dec, lat, H).az;
}
function dayLengthHours(lat, dec) {
  return 2 * horizonH0(lat, dec) / 15;
}
function noonShadowRatio(lat, dec) {
  const alt = ast.asind(ast.sind(lat) * ast.sind(dec) + ast.cosd(lat) * ast.cosd(dec));
  if (alt <= 1) return null;
  return ast.cosd(alt) / ast.sind(alt);
}
function eventLocalHours(raDeg, dec, lat, lon, dateStr, which) {
  const H = horizonH0(lat, dec);
  if (H <= 0 || H >= 180) return null;
  const lstWant = ast.wrap360(raDeg + (which === "set" ? H : -H));
  const p = String(dateStr).split("-").map(Number);
  const jd0 = ast.julian(new Date(Date.UTC(p[0], p[1] - 1, p[2], 0, 0, 0)));
  const ut = wrap24(ast.wrap360(lstWant - (lon || 0) - ast.gmst(jd0)) / 15.0410686);
  return wrap24(ut + (lon || 0) / 15);
}
function sampleDates(t0, t1, n) {
  const nPts = Math.max(2, n);
  const out = [];
  for (let i = 0; i < nPts; i++) {
    const t = t0 + (t1 - t0) * i / (nPts - 1);
    out.push({ t, date: new Date(t * 86400000).toISOString().slice(0, 10) });
  }
  return out;
}
function linearFit(points) {
  const n = points.length;
  if (n < 2) return null;
  let st = 0, sy = 0, stt = 0, sty = 0;
  points.forEach(p => { st += p.t; sy += p.y; stt += p.t * p.t; sty += p.t * p.y; });
  const den = n * stt - st * st;
  if (Math.abs(den) < 1e-9) return null;
  const m = (n * sty - st * sy) / den;
  return { m, b: (sy - m * st) / n };
}
function valuedPoints(entries, task) {
  const rows = entries.filter(e => e.task === task && e.value != null && isFinite(+e.value))
    .slice()
    .sort((a, b) => ((a.date || "") + (a.time || "")).localeCompare((b.date || "") + (b.time || "")));
  const pts = rows.map(e => ({
    t: dayIndex(e.date), y: +e.value, date: e.date, lat: e.lat, lon: e.lon
  }));
  for (let i = 1; i < pts.length; i++) {
    if (task === "starset") {
      let d = pts[i].y - pts[i - 1].y;
      while (d > 12) d -= 24;
      while (d < -12) d += 24;
      pts[i].y = pts[i - 1].y + d;
    } else if (task === "moon" || task === "planets") {
      pts[i].y = pts[i - 1].y + ast.wrap180(pts[i].y - pts[i - 1].y);
    }
  }
  return pts;
}
function alignLon(y, ref) {
  while (y - ref > 180) y -= 360;
  while (y - ref < -180) y += 360;
  return y;
}
function computedOverlay(task, points) {
  if (!points.length) return { pts: [], caption: "" };
  const lat = points[0].lat, lon = points[0].lon || 0;
  if (lat == null || !isFinite(lat)) return { pts: [], caption: "" };
  const t0 = points[0].t, t1 = points[points.length - 1].t;
  const span = Math.max(1, t1 - t0);
  const dates = sampleDates(t0, t1, Math.min(80, Math.max(12, Math.round(span) + 1)));
  const out = [];
  let caption = "";
  if (task === "sunset") {
    dates.forEach(d => {
      const az = sunsetAzimuth(lat, ast.sun(jdFromISO(d.date)).dec);
      if (az != null) out.push({ t: d.t, y: az });
    });
  } else if (task === "daylength") {
    dates.forEach(d => {
      out.push({ t: d.t, y: dayLengthHours(lat, ast.sun(jdFromISO(d.date)).dec) });
    });
  } else if (task === "gnomon") {
    dates.forEach(d => {
      const r = noonShadowRatio(lat, ast.sun(jdFromISO(d.date)).dec);
      if (r != null) out.push({ t: d.t, y: r });
    });
  } else if (task === "starset") {
    const altair = ast.STAR_MAP && ast.STAR_MAP.Altair;
    const ra = altair ? altair[1] * 15 : 19.8464 * 15;
    const dec = altair ? altair[2] : 8.868;
    dates.forEach(d => {
      const y = eventLocalHours(ra, dec, lat, lon, d.date, "set");
      if (y != null) out.push({ t: d.t, y });
    });
    for (let i = 1; i < out.length; i++) {
      let dlt = out[i].y - out[i - 1].y;
      while (dlt > 12) dlt -= 24;
      while (dlt < -12) dlt += 24;
      out[i].y = out[i - 1].y + dlt;
    }
    caption = "Altair";
  } else if (task === "lag") {
    const first = points[0];
    const sun0 = ast.sun(jdFromISO(first.date));
    const set0 = eventLocalHours(sun0.ra, sun0.dec, lat, lon, first.date, "set");
    if (set0 != null) {
      const rise0 = set0 + first.y / 60;
      const p = String(first.date).split("-").map(Number);
      const ut = rise0 - lon / 15;
      const jdR = ast.julian(new Date(Date.UTC(p[0], p[1] - 1, p[2], 0, 0, 0))) + ut / 24;
      const lstR = ast.wrap360(ast.gmst(jdR) + lon);
      const ra = ast.wrap360(lstR + horizonH0(lat, 0));
      dates.forEach(d => {
        const s = ast.sun(jdFromISO(d.date));
        const setH = eventLocalHours(s.ra, s.dec, lat, lon, d.date, "set");
        const riseH = eventLocalHours(ra, 0, lat, lon, d.date, "rise");
        if (setH == null || riseH == null) return;
        let lag = (riseH - setH) * 60;
        while (lag > 12 * 60) lag -= 24 * 60;
        while (lag < -12 * 60) lag += 24 * 60;
        out.push({ t: d.t, y: lag });
      });
    }
  } else if (task === "moon") {
    dates.forEach(d => {
      out.push({ t: d.t, y: ast.moon(jdFromISO(d.date, 21)).lon });
    });
    if (out.length) {
      out[0].y = alignLon(out[0].y, points[0].y);
      for (let i = 1; i < out.length; i++) out[i].y = out[i - 1].y + ast.wrap180(out[i].y - out[i - 1].y);
    }
  } else if (task === "planets") {
    const names = Object.keys(ast.PLANETS || {});
    let best = names[0], bestRms = Infinity;
    names.forEach(n => {
      let s = 0;
      points.forEach(p => {
        const d = ast.wrap180(ast.planet(n, jdFromISO(p.date, 21)).lon - p.y);
        s += d * d;
      });
      const rms = Math.sqrt(s / points.length);
      if (rms < bestRms) { bestRms = rms; best = n; }
    });
    caption = best;
    dates.forEach(d => out.push({ t: d.t, y: ast.planet(best, jdFromISO(d.date, 21)).lon }));
    if (out.length) {
      out[0].y = alignLon(out[0].y, points[0].y);
      for (let i = 1; i < out.length; i++) out[i].y = out[i - 1].y + ast.wrap180(out[i].y - out[i - 1].y);
    }
  }
  return { pts: out, caption };
}
function drawJournalSeries(host, spec) {
  host.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "j-series-fig";
  host.appendChild(wrap);
  const fig = canvasEl(wrap, 640, 220, "fig");
  const { ctx, w, h } = fig;
  const pad = { l: 48, r: 16, t: 18, b: 32 };
  const pts = spec.points, ov = spec.showOverlay ? spec.overlay : [];
  const ys = pts.map(p => p.y).concat(ov.map(p => p.y));
  const ts = pts.map(p => p.t).concat(ov.map(p => p.t));
  let y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
  let t0 = Math.min.apply(null, ts), t1 = Math.max.apply(null, ts);
  if (y1 === y0) { y0 -= 1; y1 += 1; }
  if (t1 === t0) { t0 -= 1; t1 += 1; }
  const yPad = (y1 - y0) * 0.12;
  y0 -= yPad; y1 += yPad;
  const xOf = t => pad.l + (t - t0) / (t1 - t0) * (w - pad.l - pad.r);
  const yOf = y => pad.t + (y1 - y) / (y1 - y0) * (h - pad.t - pad.b);
  ctx.fillStyle = panel2();
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = rule();
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.l, pad.t);
  ctx.lineTo(pad.l, h - pad.b);
  ctx.lineTo(w - pad.r, h - pad.b);
  ctx.stroke();
  ctx.fillStyle = muted();
  ctx.font = "11px ui-sans-serif, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(y1.toFixed(y1 - y0 > 20 ? 0 : 1), pad.l - 6, pad.t + 4);
  ctx.fillText(y0.toFixed(y1 - y0 > 20 ? 0 : 1), pad.l - 6, h - pad.b);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const iso = t => new Date(t * 86400000).toISOString().slice(5, 10);
  ctx.fillText(iso(t0), pad.l, h - pad.b + 8);
  ctx.fillText(iso(t1), w - pad.r, h - pad.b + 8);
  ctx.fillStyle = muted();
  ctx.textAlign = "left";
  ctx.fillText(spec.yLabel, pad.l + 8, pad.t - 2);
  if (spec.fit && pts.length >= 2) {
    ctx.strokeStyle = sage();
    ctx.setLineDash([7, 4]);
    ctx.beginPath();
    ctx.moveTo(xOf(t0), yOf(spec.fit.b + spec.fit.m * t0));
    ctx.lineTo(xOf(t1), yOf(spec.fit.b + spec.fit.m * t1));
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (ov.length > 1) {
    ctx.strokeStyle = ember();
    ctx.globalAlpha = 0.85;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ov.forEach((p, i) => { const x = xOf(p.t), y = yOf(p.y); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = gold();
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  pts.forEach((p, i) => { const x = xOf(p.t), y = yOf(p.y); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
  ctx.stroke();
  ctx.fillStyle = gold();
  pts.forEach(p => {
    ctx.beginPath();
    ctx.arc(xOf(p.t), yOf(p.y), 4, 0, ast.TAU);
    ctx.fill();
  });
  const cap = document.createElement("p");
  cap.className = "figcap";
  const bits = ["your measures"];
  if (spec.fit && spec.fitNote) bits.push(spec.fitNote);
  if (spec.showOverlay) bits.push("overlay: " + (spec.overlayCaption || "what the app computes"));
  cap.textContent = bits.join(" · ");
  wrap.appendChild(cap);
}

function mountJournal(el) {
  const tasks = (el.dataset.tasks || "stars,pole,sun,moon").split(",");
  head(el, "Field journal", "your observations, dated");
  const keep = document.createElement("p");
  keep.className = "figcap j-keep";
  keep.textContent = "Keep a copy. The art is the record, and this browser is not a safe place to keep three years of nights.";
  el.appendChild(keep);
  const form = document.createElement("div");
  form.className = "j-form";
  const now = new Date();
  const iso = now.toISOString().slice(0, 10);
  const hm = ast.fmtTime(now);
  form.innerHTML = `
    <div class="ctrl"><label>Date</label><input type="date" id="j-date" value="${iso}"><span class="val"></span></div>
    <div class="ctrl"><label>Time</label><input type="time" id="j-time" value="${hm}"><span class="val"></span></div>
    <div class="ctrl"><label>Latitude</label><input type="number" id="j-lat" step="0.1" value="${(A.lat && A.lat()) || 40}"><span class="val">°</span></div>
    <div class="ctrl"><label>Longitude</label><input type="number" id="j-lon" step="0.1" value="${A.lon ? A.lon() : -new Date().getTimezoneOffset() / 4}"><span class="val">°</span></div>
    <div class="ctrl"><label>Task</label><select id="j-task">${tasks.map(t => {
      const c = JOURNAL_TASKS[t] || { title: t };
      return `<option value="${t}">${c.title}</option>`;
    }).join("")}</select><span class="val"></span></div>
    <div class="ctrl j-value-row" id="j-value-row" hidden><label id="j-value-lab">Measure</label><input type="text" id="j-value" inputmode="decimal" autocomplete="off"><span class="val" id="j-value-unit"></span></div>
    <div class="ctrl" style="grid-template-columns:1fr"><label>What you saw</label></div>
    <textarea id="j-note" placeholder="Write what you actually saw, not what the lesson said you would see."></textarea>
    <div class="playrow"><button type="button" class="pbtn primary" id="j-save">Keep this entry</button></div>
    <p class="figcap" id="j-prompt"></p>
    <div class="playrow j-list-head">
      <button type="button" class="pbtn" id="j-series" aria-pressed="false">Series</button>
      <button type="button" class="pbtn" id="j-overlay" hidden aria-pressed="false"><span class="status crutch">what the app computes</span></button>
    </div>
    <div class="journal-list" id="j-list"></div>
    <div class="playrow j-io">
      <button type="button" class="pbtn" id="j-export-json">Export · json</button>
      <button type="button" class="pbtn" id="j-export-md">Export · md</button>
      <button type="button" class="pbtn" id="j-import">Import</button>
      <input type="file" id="j-file" accept=".json,application/json" hidden>
    </div>
    <p class="figcap j-io-msg" id="j-io-msg"></p>`;
  el.appendChild(form);
  const prompt = form.querySelector("#j-prompt");
  const task = form.querySelector("#j-task");
  const valueRow = form.querySelector("#j-value-row");
  const seriesBtn = form.querySelector("#j-series");
  const overlayBtn = form.querySelector("#j-overlay");
  const ioMsg = form.querySelector("#j-io-msg");
  let seriesOn = false, overlayOn = false;
  function showPrompt() {
    const c = JOURNAL_TASKS[task.value];
    prompt.textContent = c ? c.prompt : "";
    const fig = JOURNAL_FIGURES[task.value];
    if (fig) {
      valueRow.hidden = false;
      form.querySelector("#j-value-lab").textContent = fig.label;
      form.querySelector("#j-value-unit").textContent = fig.unit;
      form.querySelector("#j-value").placeholder = fig.placeholder;
    } else {
      valueRow.hidden = true;
      form.querySelector("#j-value").value = "";
    }
    overlayOn = false;
    overlayBtn.classList.remove("on");
    overlayBtn.setAttribute("aria-pressed", "false");
    renderList();
  }
  task.addEventListener("change", showPrompt);
  function bindRemoves(list, entries) {
    list.querySelectorAll("[data-del]").forEach(b => {
      b.addEventListener("click", () => {
        const all = (A.journal && A.journal()) || [];
        all.splice(+b.dataset.del, 1);
        A.saveJournal(all);
        renderList();
      });
    });
  }
  function proseCards(entries, filterTask) {
    const shown = filterTask ? entries.map((e, i) => [e, i]).filter(([e]) => e.task === filterTask)
      : entries.map((e, i) => [e, i]).reverse();
    if (filterTask) shown.reverse();
    if (!shown.length) return `<p class="figcap">${filterTask ? "No entries for this task yet." : "No entries yet. The art begins outside."}</p>`;
    return shown.map(([e, idx]) => {
      const c = JOURNAL_TASKS[e.task];
      const meas = fmtJournalValue(e);
      return `<div class="j-entry" data-i="${idx}">
        <div class="when">${e.date} · ${e.time} · ${e.lat != null && isFinite(e.lat) ? ast.fmtDeg(e.lat, "N", "S") : ""}${e.lon != null && isFinite(e.lon) ? " · " + ast.fmtDeg(e.lon, "E", "W") : ""}${meas ? " · " + meas : ""}</div>
        <h4>${(c && c.title) || e.task}</h4>
        <p>${escapeHtml(e.note)}</p>
        <div class="playrow"><button type="button" class="pbtn" data-del="${idx}">Remove</button></div>
      </div>`;
    }).join("");
  }
  function renderList() {
    const list = form.querySelector("#j-list");
    const entries = (A.journal && A.journal()) || [];
    const t = task.value;
    const fig = JOURNAL_FIGURES[t];
    seriesBtn.classList.toggle("on", seriesOn);
    seriesBtn.setAttribute("aria-pressed", seriesOn ? "true" : "false");
    if (!seriesOn) {
      overlayBtn.hidden = true;
      if (!entries.length) {
        list.innerHTML = `<p class="figcap">No entries yet. The art begins outside.</p>`;
        return;
      }
      list.innerHTML = proseCards(entries, null);
      bindRemoves(list, entries);
      return;
    }
    if (!fig) {
      overlayBtn.hidden = true;
      list.innerHTML = `<p class="figcap">This task is not a series. The seeing is in the words.</p>` + proseCards(entries, t);
      bindRemoves(list, entries);
      return;
    }
    const pts = valuedPoints(entries, t);
    if (pts.length < 3) {
      overlayBtn.hidden = true;
      list.innerHTML = `<p class="figcap">Three measures make a figure. Keep going.</p>` + proseCards(entries, t);
      bindRemoves(list, entries);
      return;
    }
    overlayBtn.hidden = false;
    overlayBtn.classList.toggle("on", overlayOn);
    overlayBtn.setAttribute("aria-pressed", overlayOn ? "true" : "false");
    const ov = computedOverlay(t, pts);
    const fit = t === "starset" ? linearFit(pts) : null;
    let fitNote = "";
    if (fit) {
      const minPerNight = fit.m * 60;
      fitNote = "fitted " + Math.abs(minPerNight).toFixed(1) + " min / night";
    }
    list.innerHTML = "";
    drawJournalSeries(list, {
      points: pts,
      overlay: ov.pts,
      showOverlay: overlayOn,
      overlayCaption: ov.caption ? "what the app computes · " + ov.caption : "what the app computes",
      fit, fitNote, yLabel: fig.y
    });
  }
  seriesBtn.addEventListener("click", () => {
    seriesOn = !seriesOn;
    if (!seriesOn) overlayOn = false;
    renderList();
  });
  overlayBtn.addEventListener("click", () => {
    overlayOn = !overlayOn;
    renderList();
  });
  form.querySelector("#j-save").addEventListener("click", () => {
    const note = form.querySelector("#j-note").value.trim();
    if (!note) { A.toast && A.toast("Write what you saw."); return; }
    const lat = parseFloat(form.querySelector("#j-lat").value);
    const lon = parseFloat(form.querySelector("#j-lon").value);
    if (A.setLat) A.setLat(lat);
    if (A.setLon && isFinite(lon)) A.setLon(lon);
    const rec = {
      date: form.querySelector("#j-date").value,
      time: form.querySelector("#j-time").value,
      lat,
      lon: isFinite(lon) ? lon : undefined,
      task: task.value,
      note,
      saved: Date.now()
    };
    if (JOURNAL_FIGURES[task.value]) {
      const parsed = parseJournalValue(task.value, form.querySelector("#j-value").value);
      if (parsed.error) { A.toast && A.toast("The measure is a number."); return; }
      if (parsed.value != null) {
        rec.value = parsed.value;
        if (parsed.unit) rec.unit = parsed.unit;
      }
    }
    const all = (A.journal && A.journal()) || [];
    all.push(rec);
    A.saveJournal(all);
    form.querySelector("#j-note").value = "";
    form.querySelector("#j-value").value = "";
    renderList();
    A.toast && A.toast("Kept.");
  });
  function reportMerge(r) {
    const a = r.added === 1 ? "1 added" : r.added + " added";
    const s = r.skipped === 1 ? "1 was already there" : r.skipped + " were already there";
    return a.charAt(0).toUpperCase() + a.slice(1) + ". " + s + ".";
  }
  form.querySelector("#j-export-json").addEventListener("click", () => {
    const data = (A.journal && A.journal()) || [];
    downloadText("astronomia-journal.json", JSON.stringify(data, null, 2), "application/json");
  });
  form.querySelector("#j-export-md").addEventListener("click", () => {
    const data = (A.journal && A.journal()) || [];
    downloadText("astronomia-journal.md", journalMarkdown(data), "text/markdown;charset=utf-8");
  });
  form.querySelector("#j-import").addEventListener("click", () => form.querySelector("#j-file").click());
  form.querySelector("#j-file").addEventListener("change", ev => {
    const file = ev.target.files && ev.target.files[0];
    ev.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || "null"));
        const list = Array.isArray(data) ? data
          : (data && Array.isArray(data.journal) ? data.journal
            : (data && Array.isArray(data.entries) ? data.entries : null));
        if (!list) throw new Error("not a journal");
        const r = A.mergeJournal(list);
        const msg = reportMerge(r);
        ioMsg.textContent = msg;
        A.toast && A.toast(msg);
        renderList();
      } catch (err) {
        ioMsg.textContent = "That file is not a journal export.";
        A.toast && A.toast("That file is not a journal export.");
      }
    };
    reader.readAsText(file);
  });
  showPrompt();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

/* ---- Inline check -------------------------------------------------- */
function mountCheck(el) {
  const ask = el.dataset.ask || "";
  const opts = (el.dataset.opts || "").split("|");
  const ans = +(el.dataset.ans || 0);
  const why = el.dataset.why || "";
  el.classList.add("check");
  el.innerHTML = `<p class="q">${ask}</p><div class="opts">${opts.map((o, i) =>
    `<button type="button" class="opt" data-i="${i}">${o}</button>`).join("")}</div>
    <p class="explain"></p>`;
  let done = false;
  el.querySelector(".opts").addEventListener("click", e => {
    const b = e.target.closest(".opt");
    if (!b || done) return;
    done = true;
    const i = +b.dataset.i;
    el.querySelectorAll(".opt").forEach(o => {
      if (+o.dataset.i === ans) o.classList.add("right");
      else if (o === b) o.classList.add("wrong");
      o.disabled = true;
    });
    const ex = el.querySelector(".explain");
    ex.innerHTML = (i === ans ? "<b class='good'>Rightly.</b> " : "<b class='bad'>Not so.</b> ") + why;
    ex.classList.add("show");
  });
}

/* ---- Drill --------------------------------------------------------- */
function mountDrill(el) {
  const setId = el.dataset.set;
  const set = A.DRILLS[setId];
  if (!set) { el.textContent = "Exercise set not found: " + setId; return; }
  let items = [], idx = 0, right = 0, answered = false;
  const headEl = document.createElement("div");
  headEl.className = "whead";
  const body = document.createElement("div");
  body.className = "drill-body";
  el.append(headEl, body);

  function shuffled(a) {
    const b = a.map((x, i) => [x, i]);
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }
  function paintHead() {
    const rec = A.drillRecord(setId);
    const guided = A.guided && A.guided();
    let badge = "";
    if (guided && rec.mastered) {
      const now = Date.now();
      const due = rec.due == null || rec.due <= now;
      if (due) badge = `<span class="mark">due</span>`;
      else {
        const days = Math.max(1, Math.ceil((rec.due - now) / 86400000));
        badge = `<span class="mark good">possessed · ${days}d</span>`;
      }
    } else if (guided && rec.tries) {
      badge = `<span class="mark">best ${rec.best}/${items.length || set.size}</span>`;
    }
    headEl.innerHTML = `<strong>Exercise · ${set.title}</strong>
      <span class="readout">${idx < items.length ? (idx + 1) + " of " + items.length : items.length + " of " + items.length} ${badge}</span>`;
  }
  function start() {
    items = set.build();
    idx = 0; right = 0; answered = false;
    paintHead();
    showItem();
  }
  function showItem() {
    const it = items[idx];
    answered = false;
    const order = it.type === "mc" ? shuffled(it.options) : null;
    const opts = order
      ? order.map(([text, orig], i) => `<button class="opt" data-i="${i}" data-orig="${orig}">${text}</button>`).join("")
      : "";
    const needNum = it.type === "num" || (it.type === "work" && it.input === "num");
    const input = (it.type !== "mc")
      ? `<div class="drill-input">
          ${needNum ? `<input type="text" id="drill-in" autocomplete="off" spellcheck="false"
            placeholder="a number">` : ""}
          <button class="pbtn primary" id="drill-go"${it.type === "work" ? " disabled" : ""}>Answer</button>
        </div>`
      : "";
    body.innerHTML = `
      <div class="dots">${items.map((_, i) =>
        `<i class="${i < idx ? (items[i]._ok ? "dot-ok" : "dot-no") : (i === idx ? "dot-now" : "")}"></i>`).join("")}</div>
      <p class="q">${it.ask}</p>
      <div class="opts">${opts}</div>
      ${it.type === "work" ? `<div class="widget work-host"></div>` : ""}
      ${input}
      <p class="explain" id="drill-why"></p>
      <div class="playrow drill-next" style="display:none">
        <button class="pbtn primary" id="drill-next">Next</button>
      </div>`;
    if (it.type === "mc") {
      body.querySelector(".opts").addEventListener("click", e => {
        const b = e.target.closest(".opt");
        if (!b || answered) return;
        grade(+b.dataset.orig === it.answer, b);
      });
    } else if (it.type === "work") {
      const host = body.querySelector(".work-host");
      const w = it.widget || {};
      host.dataset.kind = w.kind;
      Object.keys(w.attrs || {}).forEach(k => { host.dataset[k] = w.attrs[k]; });
      const mount = { sky: mountSky, model: mountModel, sphere: mountSphere, ellipse: mountEllipse }[w.kind];
      if (mount) mount(host);
      const go = body.querySelector("#drill-go");
      const arm = () => { if (!answered) go.disabled = false; };
      host.addEventListener("input", arm);
      host.addEventListener("pointerup", arm);
      host.addEventListener("click", arm);
      const submit = () => {
        if (answered || go.disabled) return;
        const st = host._astroState ? host._astroState() : {};
        const typed = body.querySelector("#drill-in") ? body.querySelector("#drill-in").value : "";
        const ok = !!(it.check && it.check(st, typed));
        grade(ok, null, it.reveal ? it.reveal(st, typed) : null);
      };
      go.addEventListener("click", submit);
      const inp = body.querySelector("#drill-in");
      if (inp) {
        inp.addEventListener("input", arm);
        inp.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
      }
    } else {
      const inp = body.querySelector("#drill-in");
      const submit = () => {
        if (answered) return;
        const norm = A.normNum;
        const got = norm(inp.value);
        const want = it.accept.map(norm).filter(Boolean);
        grade(!!got && want.includes(got), null, it.accept[0]);
      };
      body.querySelector("#drill-go").addEventListener("click", submit);
      inp.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
      setTimeout(() => inp.focus(), 30);
    }
    body.querySelector("#drill-next").addEventListener("click", () => {
      idx += 1;
      paintHead();
      if (idx >= items.length) finish();
      else showItem();
    });
  }
  function grade(ok, btn, want) {
    answered = true;
    items[idx]._ok = ok;
    if (ok) right += 1;
    const it = items[idx];
    if (it.type === "mc") {
      [...body.querySelectorAll(".opt")].forEach(o => {
        if (+o.dataset.orig === it.answer) o.classList.add("right");
        else if (o === btn) o.classList.add("wrong", "sel");
        o.disabled = true;
      });
    } else {
      const inp = body.querySelector("#drill-in");
      if (inp) {
        inp.disabled = true;
        inp.classList.add(ok ? "right" : "wrong");
      }
      const go = body.querySelector("#drill-go");
      if (go) go.disabled = true;
    }
    const why = body.querySelector("#drill-why");
    why.innerHTML = (ok ? "<b class='good'>Rightly.</b> " : `<b class='bad'>Not so.</b> ${want ? "The answer is <b>" + want + "</b>. " : ""}`) + it.why;
    why.classList.add("show");
    body.querySelector(".drill-next").style.display = "flex";
    const nextBtn = body.querySelector("#drill-next");
    setTimeout(() => { if (document.body.contains(nextBtn)) nextBtn.focus(); }, 160);
  }
  function finish() {
    const rec = A.recordDrill(setId, right, items.length);
    const perfect = right === items.length;
    const guided = A.guided && A.guided();
    let word;
    if (!guided) {
      word = perfect
        ? "A whole fresh draw, answered rightly. Draw another when you like."
        : (right >= items.length - 1
          ? "Close. One more draw — the items and the order will be different, so what you have is the skill and not the memory of a page."
          : "Not yet. The lessons this block rests on will serve before another draw.");
    } else if (perfect) {
      const days = rec.interval == null ? 1 : rec.interval;
      const when = days < 1 ? "later today" : (days === 1 ? "in 1 day" : "in " + days + " days");
      word = rec.reps > 1
        ? "Answered rightly. Next " + when + "."
        : "A whole fresh draw, answered rightly. This block is possessed. It will be brought back " + when + ".";
    } else if (rec.mastered) {
      word = "The interval shortens. A miss does not take the block away; it brings it back soon.";
    } else {
      word = right >= items.length - 1
        ? "Close. One more draw — the items and the order will be different."
        : "Not yet. The lessons this block rests on will serve before another draw.";
    }
    body.innerHTML = `
      <div class="dots">${items.map(i => `<i class="${i._ok ? "dot-ok" : "dot-no"}"></i>`).join("")}</div>
      <p class="q">${right} of ${items.length}.</p>
      <p class="explain show">${word}</p>
      <div class="playrow"><button class="pbtn primary" id="drill-again">Draw a fresh set</button></div>`;
    body.querySelector("#drill-again").addEventListener("click", start);
    paintHead();
  }
  start();
}

})();
