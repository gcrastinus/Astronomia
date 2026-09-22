(function () {
function fail(err) {
  const main = document.getElementById("main");
  if (!main) return;
  const msg = (err && err.message) ? err.message : String(err);
  main.innerHTML = `<article class="wrap">
    <p class="kicker">Error</p>
    <h2 class="lesson">The page did not start</h2>
    <p>${msg}</p>
    <p>Open <code>index.html</code> from the Astronomia folder (the files <code>js/</code> and <code>css/</code> must sit beside it). A Dropbox website preview will not run the course.</p>
  </article>`;
}
try {
const LESSONS = window.AstroArs && AstroArs.LESSONS;
const CHAPTERS = window.AstroArs && AstroArs.CHAPTERS;
const mountWidgets = window.AstroArs && AstroArs.mountWidgets;
const DRILLS = (window.AstroArs && AstroArs.DRILLS) || {};

const $ = (s, r = document) => r.querySelector(s);
const STORE = "astronomia.v1";

const state = {
  id: (LESSONS && LESSONS[0] && LESSONS[0].id) || "welcome",
  theme: "dark",
  done: {},
  answers: {},
  drills: {},
  contemplations: {},
  journal: [],
  lat: 40.7,
  lon: -new Date().getTimezoneOffset() / 4,
  guided: false,
  speakRate: 1
};

const chapterOf = {};
CHAPTERS.forEach(c => { chapterOf[c.id] = c; });
(function number() {
  let k = 0;
  for (const l of LESSONS) {
    if (l.n == null) l.n = String(k++);
    const ch = chapterOf[l.ch];
    if (!l.kicker) {
      l.kicker = (ch && ch.num)
        ? `Chapter ${ch.num} · Lesson ${l.n}`
        : (ch ? ch.title : "");
    }
  }
})();
const byId = {};
LESSONS.forEach(l => { byId[l.id] = l; });

function isDrill(l) { return !!l.drill; }
function isContemplation(l) { return !!(l && l.ch === "cont"); }
function blocks() { return LESSONS.filter(isDrill); }
function mastered(l) { return !!(state.drills[l.drill] && state.drills[l.drill].mastered); }
function neighborOf(lesson, dir) {
  const pool = LESSONS.filter(l => isContemplation(l) === isContemplation(lesson));
  const i = pool.indexOf(lesson);
  if (i < 0) return null;
  return pool[i + dir] || null;
}

function progressHTML() {
  if (!state.guided) return "";
  const b = blocks();
  const m = b.filter(mastered).length;
  const d = drillDue().length;
  return d ? `${m}/${b.length} · ${d} due` : `${m}/${b.length}`;
}

const DAY_MS = 86400000;

function drillDue() {
  if (!state.guided) return [];
  const now = Date.now();
  const out = [];
  for (const l of blocks()) {
    const rec = state.drills[l.drill];
    if (rec && rec.mastered && (rec.due == null || rec.due <= now)) {
      out.push({ id: l.id, title: l.title, set: l.drill });
    }
  }
  return out;
}

function scheduleDrill(rec, perfect) {
  const now = Date.now();
  if (rec.ease == null) rec.ease = 2.0;
  if (rec.reps == null) rec.reps = 0;
  if (perfect) {
    rec.mastered = true;
    if (rec.reps === 0) rec.interval = 1;
    else if (rec.reps === 1) rec.interval = 3;
    else rec.interval = Math.min(30, Math.round(rec.interval * rec.ease * 10) / 10);
    rec.reps += 1;
    rec.ease = Math.min(2.5, rec.ease + 0.08);
    rec.due = now + rec.interval * DAY_MS;
  } else if (rec.mastered) {
    rec.lapses = (rec.lapses || 0) + 1;
    rec.reps = 0;
    rec.interval = 0.5;
    rec.ease = Math.max(1.3, rec.ease - 0.2);
    rec.due = now + rec.interval * DAY_MS;
  }
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE) || "{}");
    if (raw.theme === "light" || raw.theme === "dark") state.theme = raw.theme;
    if (raw.id && byId[raw.id]) state.id = raw.id;
    if (raw.done && typeof raw.done === "object") state.done = raw.done;
    if (raw.answers && typeof raw.answers === "object") state.answers = raw.answers;
    if (raw.drills && typeof raw.drills === "object") state.drills = raw.drills;
    if (raw.contemplations && typeof raw.contemplations === "object") state.contemplations = raw.contemplations;
    if (Array.isArray(raw.journal)) state.journal = raw.journal;
    if (typeof raw.lat === "number" && isFinite(raw.lat)) state.lat = raw.lat;
    if (typeof raw.lon === "number" && isFinite(raw.lon)) state.lon = raw.lon;
    if (typeof raw.guided === "boolean") state.guided = raw.guided;
    if (typeof raw.speakRate === "number" && isFinite(raw.speakRate)) state.speakRate = raw.speakRate;
  } catch (_) { /* ignore */ }
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.dataset.guide = state.guided ? "on" : "off";
  $("#b-theme").textContent = state.theme === "dark" ? "☀" : "☾";
}
function save() {
  try {
    localStorage.setItem(STORE, JSON.stringify({
      theme: state.theme, id: state.id, done: state.done,
      answers: state.answers, drills: state.drills,
      contemplations: state.contemplations, journal: state.journal,
      lat: state.lat, lon: state.lon, guided: state.guided,
      speakRate: state.speakRate
    }));
  } catch (_) { /* file:// or private mode */ }
}
AstroArs._contState = function () { return state.contemplations; };
AstroArs._contSave = function (all) {
  state.contemplations = all || {};
  save();
};
AstroArs.journal = function () { return state.journal; };
AstroArs.saveJournal = function (entries) {
  state.journal = entries || [];
  save();
};
AstroArs.mergeJournal = function (incoming) {
  if (!Array.isArray(incoming)) throw new Error("Journal import must be a list of entries.");
  const cur = (state.journal || []).slice();
  const keys = new Set(cur.map(e => (e.date || "") + "\t" + (e.time || "") + "\t" + (e.task || "")));
  let added = 0, skipped = 0;
  incoming.forEach(e => {
    if (!e || typeof e !== "object") { skipped += 1; return; }
    const k = (e.date || "") + "\t" + (e.time || "") + "\t" + (e.task || "");
    if (keys.has(k)) { skipped += 1; return; }
    keys.add(k);
    const rec = {
      date: String(e.date || ""),
      time: String(e.time || ""),
      task: String(e.task || ""),
      note: String(e.note || ""),
      saved: typeof e.saved === "number" ? e.saved : Date.now()
    };
    if (e.lat != null && isFinite(+e.lat)) rec.lat = +e.lat;
    if (e.lon != null && isFinite(+e.lon)) rec.lon = +e.lon;
    if (e.value != null && e.value !== "" && isFinite(+e.value)) {
      rec.value = +e.value;
      if (e.unit != null && e.unit !== "") rec.unit = String(e.unit);
    }
    cur.push(rec);
    added += 1;
  });
  state.journal = cur;
  save();
  return { added, skipped, total: cur.length };
};
AstroArs.lat = function () { return state.lat; };
AstroArs.setLat = function (lat) {
  const n = Number(lat);
  if (isFinite(n)) {
    state.lat = Math.max(-90, Math.min(90, n));
    save();
  }
  return state.lat;
};
AstroArs.lon = function () { return state.lon; };
AstroArs.setLon = function (lon) {
  const n = Number(lon);
  if (isFinite(n)) {
    state.lon = Math.max(-180, Math.min(180, n));
    save();
  }
  return state.lon;
};

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 1600);
}
AstroArs.toast = toast;

function searchText(l) {
  let s = (l.title || "") + " " + (l.kicker || "") + " " + (l.html || "");
  const th = l.contemplate && AstroArs.THEMES && AstroArs.THEMES[l.contemplate];
  if (th) {
    const take = p => (p.cite || "") + " " + (p.latin || "") + " " + (p.english || "");
    (th.first && th.first.passages || []).forEach(p => { s += " " + take(p); });
    (th.returns || []).forEach(r => {
      if (!r) return;
      s += " " + (r.recast || "");
      (r.passages || []).forEach(p => { s += " " + take(p); });
    });
    s += " " + (th.honesty || "");
  }
  return s.toLowerCase();
}

function buildNav() {
  const box = $("#nav-list");
  const q = ($("#find").value || "").trim().toLowerCase();
  const dueIds = state.guided ? new Set(drillDue().map(d => d.id)) : null;
  box.innerHTML = "";
  for (const ch of CHAPTERS) {
    const items = LESSONS.filter(l => l.ch === ch.id);
    if (!items.length) continue;
    const vis = items.filter(l => !q || searchText(l).includes(q));
    if (q && !vis.length) continue;
    const h = document.createElement("h3");
    h.textContent = ch.title;
    box.appendChild(h);
    for (const l of vis) {
      const a = document.createElement("a");
      a.href = "#" + l.id;
      a.dataset.id = l.id;
      if (l.id === state.id) a.classList.add("on");
      if (state.guided && isDrill(l) && mastered(l)) a.classList.add("done");
      if (dueIds && dueIds.has(l.id)) a.classList.add("due");
      a.innerHTML = `<b>${l.n}</b><span>${l.title}</span>`;
      a.addEventListener("click", e => {
        e.preventDefault();
        go(l.id);
        closeNav();
      });
      box.appendChild(a);
    }
  }
}

function closeNav() {
  $("#side-nav").classList.remove("open");
  $("#nav-backdrop").classList.remove("show");
  $("#b-nav").setAttribute("aria-expanded", "false");
}

function go(id) {
  stopSpeak();
  const lesson = byId[id] || LESSONS[0];
  state.id = lesson.id;
  if (!isDrill(lesson) && !isContemplation(lesson)) state.done[lesson.id] = true;
  save();
  render(lesson);
  buildNav();
  applyGuide();
  $("#b-lab").classList.toggle("on", lesson.id === "lab");
  $("#b-jour").classList.toggle("on", lesson.id === "journal");
  $("#main").scrollTop = 0;
  history.replaceState(null, "", "#" + lesson.id);
}
AstroArs.go = go;

function fillRefs(root) {
  root.querySelectorAll(".xref").forEach(el => {
    const chId = el.dataset.ch;
    if (chId) {
      const ch = chapterOf[chId];
      if (!ch) return;
      el.textContent = el.dataset.text || ("Chapter " + (ch.num || ch.title));
      el.classList.add("live");
      const first = LESSONS.find(l => l.ch === chId);
      if (first) el.addEventListener("click", () => go(first.id));
      return;
    }
    const l = byId[el.dataset.to];
    if (!l) return;
    el.textContent = el.dataset.text || ((/^\d+$/.test(l.n) ? "Lesson " : "Block ") + l.n);
    el.classList.add("live");
    el.addEventListener("click", () => go(l.id));
  });
}

function joinList(links) {
  if (links.length === 1) return links[0];
  return links.slice(0, -1).join(", ") + " and " + links.slice(-1);
}

function inviteBanner(lesson) {
  const bits = [];
  if (AstroArs.contemplateDue) {
    const due = AstroArs.contemplateDue().filter(d => {
      const l = LESSONS.find(x => x.contemplate === d.id);
      return l && l.id !== lesson.id;
    });
    if (due.length) {
      const links = due.map(d => {
        const l = LESSONS.find(x => x.contemplate === d.id);
        return `<a class="invite-link" href="#${l.id}" data-id="${l.id}">${l.title}</a>`;
      });
      const lead = links.length === 1 ? "A return is waiting on " : "Returns are waiting on ";
      bits.push(lead + joinList(links) + ".");
    }
  }
  if (state.guided) {
    const due = drillDue().filter(d => d.id !== lesson.id);
    if (due.length) {
      const links = due.map(d => `<a class="invite-link" href="#${d.id}" data-id="${d.id}">${d.title}</a>`);
      const lead = links.length === 1 ? "A block is due: " : "Blocks are due: ";
      bits.push(lead + joinList(links) + ".");
    }
  }
  if (!bits.length) return "";
  return `<div class="invite">${bits.map(b => `<p>${b}</p>`).join("")}</div>`;
}

function render(lesson) {
  const prev = neighborOf(lesson, -1);
  const next = neighborOf(lesson, 1);
  const main = $("#main");
  main.innerHTML = `
    <article class="wrap${isContemplation(lesson) ? " contemplative" : ""}">
      ${inviteBanner(lesson)}
      <div class="kicker">${lesson.kicker}</div>
      <h2 class="lesson">${lesson.title}</h2>
      <div class="prose">${lesson.html || ""}</div>
      ${lesson.drill ? `<div class="widget" data-kind="drill" data-set="${lesson.drill}"></div>` : ""}
      ${lesson.sources ? `<p class="sources">${lesson.sources}</p>` : ""}
      <div class="pager">
        <button class="tbtn" id="b-prev" ${prev ? "" : "disabled"}>${prev ? "← " + prev.title : ""}</button>
        <button class="tbtn" id="b-next" ${next ? "" : "disabled"}>${next ? next.title + " →" : ""}</button>
      </div>
    </article>`;
  if (lesson.contemplate && AstroArs.renderContemplation) {
    AstroArs.renderContemplation($(".prose", main), lesson.contemplate);
  }
  fillRefs(main);
  mountWidgets(main);
  main.querySelectorAll(".invite-link").forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      go(a.dataset.id);
    });
  });
  $("#b-prev")?.addEventListener("click", () => prev && go(prev.id));
  $("#b-next")?.addEventListener("click", () => next && go(next.id));
}

AstroArs.recordDrill = function (setId, right, total) {
  const rec = state.drills[setId] || { best: 0, tries: 0, mastered: false };
  rec.tries += 1;
  if (right > rec.best) rec.best = right;
  const perfect = right === total && total > 0;
  if (perfect) rec.mastered = true;
  if (state.guided) scheduleDrill(rec, perfect);
  state.drills[setId] = rec;
  save();
  buildNav();
  applyGuide();
  return rec;
};
AstroArs.drillRecord = function (setId) {
  return state.drills[setId] || { best: 0, tries: 0, mastered: false };
};
AstroArs.guided = function () { return !!state.guided; };
AstroArs.drillDue = drillDue;

let speakGen = 0;
let speaking = false;

function setSpeaking(on) {
  speaking = on;
  const b = $("#b-speak");
  if (!b) return;
  b.setAttribute("aria-pressed", on ? "true" : "false");
  b.setAttribute("aria-label", on ? "Stop reading" : "Read this page");
  b.title = on ? "Stop reading (r)" : "Read this page (r)";
  b.textContent = on ? "⏹" : "🔊";
}

function stopSpeak() {
  speakGen += 1;
  speaking = false;
  try { window.speechSynthesis && speechSynthesis.cancel(); } catch (_) { /* ignore */ }
  setSpeaking(false);
}
AstroArs.stopSpeak = stopSpeak;

function skipSpeakEl(el) {
  if (!el || el.nodeType !== 1) return false;
  if (el.hidden || el.getAttribute("aria-hidden") === "true") return true;
  if (el.matches(".pager, .invite, .kicker, .sources, .playrow, .dots, .drill-next, .drill-input, .snaps, .tbtns, .ctrl, .toggles, .legend, .sky-read, svg, canvas, .j-form, .speak-rate, .speak-unit")) return true;
  if (el.matches("button.pbtn, button.tbtn, button.key, input, select, textarea")) return true;
  if (el.matches(".explain") && !el.classList.contains("show")) return true;
  if (el.matches(".whead")) {
    const w = el.closest("[data-kind]");
    if (w && (w.dataset.kind === "drill")) return true;
  }
  return false;
}

function walkSpeak(node, out) {
  if (node.nodeType === 3) {
    const t = node.textContent.replace(/\s+/g, " ");
    if (t.trim()) out.push(t);
    return;
  }
  if (node.nodeType !== 1) return;
  if (skipSpeakEl(node)) return;
  const block = /^(P|H1|H2|H3|H4|LI|DT|DD|TR|DIV|BLOCKQUOTE|ARTICLE)$/.test(node.tagName);
  const before = out.length;
  for (const child of node.childNodes) walkSpeak(child, out);
  if (block && out.length > before) out.push("\n");
}

function collectSpeakText() {
  const root = $("#main article.wrap") || $("#main");
  const out = [];
  if (root) walkSpeak(root, out);
  if (state.id === "welcome") {
    const colo = $(".colophon");
    if (colo) out.push("\n", colo.textContent, "\n");
    const nav = $("#nav-list");
    if (nav) {
      nav.querySelectorAll("h3, a").forEach(el => {
        const t = el.textContent.replace(/\s+/g, " ").trim();
        if (t) out.push(t, "\n");
      });
    }
  }
  return out.join("").replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n").replace(/\n{2,}/g, "\n").trim();
}

function prepSpeak(s) {
  return s
    .replace(/(\d+)\s*:\s*(\d+)/g, "$1 to $2")
    .replace(/°/g, " degrees")
    .replace(/·/g, ", ")
    .replace(/\s*\n+\s*/g, ". ")
    .replace(/\s+/g, " ")
    .replace(/\.\s*\./g, ".")
    .trim();
}

function chunkSpeak(text) {
  const bits = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    if ((text[i] === "." || text[i] === "!" || text[i] === "?") &&
        (i === text.length - 1 || text[i + 1] === " ")) {
      const piece = text.slice(start, i + 1).trim();
      if (piece) bits.push(piece);
      start = i + 1;
    }
  }
  const rest = text.slice(start).trim();
  if (rest) bits.push(rest);
  const chunks = [];
  let buf = "";
  for (const b of bits) {
    if (buf && (buf + " " + b).length > 280) {
      chunks.push(buf);
      buf = b;
    } else buf = buf ? buf + " " + b : b;
  }
  if (buf) chunks.push(buf);
  return chunks;
}

function pickVoice() {
  try {
    const voices = speechSynthesis.getVoices() || [];
    const en = voices.filter(v => /^en/i.test(v.lang));
    return en.find(v => v.localService && /samantha|daniel|karen|moira|serena|rishi|siri/i.test(v.name))
      || en.find(v => v.localService)
      || en[0]
      || voices[0]
      || null;
  } catch (_) {
    return null;
  }
}

function startSpeak() {
  if (!window.speechSynthesis) {
    toast("This browser cannot read the page aloud.");
    return;
  }
  const raw = collectSpeakText();
  const text = prepSpeak(raw);
  if (!text) {
    toast("Nothing on this page to read.");
    return;
  }
  const gen = ++speakGen;
  try { speechSynthesis.cancel(); } catch (_) { /* ignore */ }
  const chunks = chunkSpeak(text);
  const voice = pickVoice();
  let i = 0;
  const next = () => {
    if (gen !== speakGen) return;
    if (i >= chunks.length) { setSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(chunks[i]);
    u.rate = state.speakRate || 1;
    u.lang = "en-US";
    if (voice) u.voice = voice;
    u.onend = () => { i += 1; next(); };
    u.onerror = () => { if (gen === speakGen) setSpeaking(false); };
    speechSynthesis.speak(u);
  };
  setSpeaking(true);
  setTimeout(() => { if (gen === speakGen) next(); }, 40);
}

function toggleSpeak() {
  if (speaking) stopSpeak();
  else startSpeak();
}

function bindSpeakRate() {
  const rateEl = $("#speak-rate");
  if (!rateEl) return;
  const RATES = [1, 1.5, 2, 2.5, 3];
  if (RATES.indexOf(state.speakRate) < 0) state.speakRate = 1;
  const rateBtn = rateEl.querySelector(".speak-rate-btn");
  const rateMenu = rateEl.querySelector(".speak-rate-menu");
  function rateLabel(r) { return String(r) + "×"; }
  function applyRateUI(r) {
    if (RATES.indexOf(r) < 0) r = 1;
    state.speakRate = r;
    if (rateBtn) rateBtn.textContent = rateLabel(r);
    if (rateMenu) {
      rateMenu.querySelectorAll("[data-rate]").forEach(li => {
        li.setAttribute("aria-selected", parseFloat(li.getAttribute("data-rate")) === r ? "true" : "false");
      });
    }
  }
  applyRateUI(state.speakRate);
  function closeRateMenu() {
    rateEl.classList.remove("open");
    if (rateBtn) rateBtn.setAttribute("aria-expanded", "false");
    if (rateMenu) rateMenu.hidden = true;
  }
  function openRateMenu() {
    rateEl.classList.add("open");
    if (rateBtn) rateBtn.setAttribute("aria-expanded", "true");
    if (rateMenu) rateMenu.hidden = false;
  }
  if (rateBtn) {
    rateBtn.addEventListener("click", ev => {
      ev.stopPropagation();
      if (rateMenu && rateMenu.hidden) openRateMenu();
      else closeRateMenu();
    });
  }
  if (rateMenu) {
    rateMenu.addEventListener("click", ev => {
      const li = ev.target.closest("[data-rate]");
      if (!li) return;
      applyRateUI(parseFloat(li.getAttribute("data-rate")) || 1);
      save();
      closeRateMenu();
    });
  }
  document.addEventListener("click", ev => {
    if (!rateEl.contains(ev.target)) closeRateMenu();
  });
  document.addEventListener("keydown", ev => {
    if (ev.key === "Escape") closeRateMenu();
  });
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = state.theme;
  $("#b-theme").textContent = state.theme === "dark" ? "☀" : "☾";
  save();
  const lesson = byId[state.id];
  if (lesson) render(lesson);
}

function applyGuide() {
  document.documentElement.dataset.guide = state.guided ? "on" : "off";
  const box = $("#b-guide");
  if (box) box.checked = !!state.guided;
  const p = $("#progress");
  if (p) {
    p.hidden = !state.guided;
    p.textContent = progressHTML();
  }
}

function onGuideChange() {
  state.guided = !!$("#b-guide").checked;
  if (state.guided) {
    const now = Date.now();
    blocks().forEach(l => {
      const rec = state.drills[l.drill];
      if (rec && rec.mastered && rec.due == null) rec.due = now;
    });
  }
  save();
  applyGuide();
  buildNav();
  const lesson = byId[state.id];
  if (lesson) render(lesson);
}

function init() {
  if (!LESSONS || !LESSONS.length) throw new Error("Lessons did not load.");
  for (const l of LESSONS) {
    if (l.drill && !DRILLS[l.drill]) throw new Error("Exercise set missing: " + l.drill);
  }
  load();
  const hash = decodeURIComponent((location.hash || "").slice(1));
  if (hash && byId[hash]) state.id = hash;
  $("#b-theme").addEventListener("click", toggleTheme);
  $("#b-speak").addEventListener("click", toggleSpeak);
  bindSpeakRate();
  $("#b-lab").addEventListener("click", () => go("lab"));
  $("#b-jour").addEventListener("click", () => go("journal"));
  $("#b-guide")?.addEventListener("change", onGuideChange);
  applyGuide();
  try { speechSynthesis.getVoices(); speechSynthesis.addEventListener("voiceschanged", pickVoice); } catch (_) { /* ignore */ }
  document.addEventListener("click", e => {
    if (e.target.closest("#drill-next, #drill-again")) stopSpeak();
  }, true);
  $("#b-nav").addEventListener("click", () => {
    const open = $("#side-nav").classList.toggle("open");
    $("#nav-backdrop").classList.toggle("show", open);
    $("#b-nav").setAttribute("aria-expanded", open ? "true" : "false");
  });
  $("#nav-backdrop").addEventListener("click", closeNav);
  $("#find").addEventListener("input", buildNav);
  window.addEventListener("keydown", e => {
    if (e.target.matches("input, textarea, select")) return;
    if (e.key === "d") toggleTheme();
    if (e.key === "r") { e.preventDefault(); toggleSpeak(); }
    if (e.key === "/") { e.preventDefault(); $("#find").focus(); }
    if (e.key === "Escape") closeNav();
    if (e.key === "ArrowRight") {
      const n = neighborOf(byId[state.id], 1);
      if (n) go(n.id);
    }
    if (e.key === "ArrowLeft") {
      const n = neighborOf(byId[state.id], -1);
      if (n) go(n.id);
    }
  });
  window.addEventListener("hashchange", () => {
    const h = decodeURIComponent((location.hash || "").slice(1));
    if (h && byId[h] && h !== state.id) go(h);
  });
  buildNav();
  go(state.id);
}

init();
} catch (err) { fail(err); }
})();
