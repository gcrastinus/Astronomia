/* Chapter III figures: Ptolemy’s theorem, chord operations, Menelaos. */
window.AstroArs = window.AstroArs || {};
(function (root) {
"use strict";
const G = root.Geom;
const { V, add, sub, mul, dot, dist, unit, perp, mid, lerp, ang, rotAbout, interLL, interCC, DEG } = G;
const FIGS = root.AstroArs.FIGS || (root.AstroArs.FIGS = {});

function minDistFrom(P, m) {
  return q => {
    const l = dist(q, P);
    return l >= m ? q : (l < 1e-9 ? add(P, V(m, 0)) : add(P, mul(sub(q, P), m / l)));
  };
}
function copyAnglePoint(B, D, C, A) {
  const th = ang(sub(C, B)) - ang(sub(D, B));
  for (const s of [1, -1]) {
    const P = rotAbout(A, B, s * th);
    const E = interLL(A, sub(C, A), B, sub(P, B));
    if (!E) continue;
    const ac = sub(C, A);
    const t = dot(sub(E, A), ac) / (dot(ac, ac) || 1);
    if (t > 0.08 && t < 0.92) return E;
  }
  return lerp(A, C, 0.42);
}

/* ---- 1. Ptolemy’s theorem ----------------------------------------- */
FIGS["ptolemy"] = {
  title: "Ptolemy’s theorem",
  build(b) {
    const O = V(0, 0);
    const R = 78;
    b.circle(O, R, { id: "cir:O", step: 0 });
    const A = b.ptOn("A", { kind: "circle", c: O, r: R }, Math.PI, { dir: [-1, 0] });
    const B = b.ptOn("B", { kind: "circle", c: O, r: R }, 1.95, { dir: [-0.4, 1] });
    const C = b.ptOn("C", { kind: "circle", c: O, r: R }, 0.85, { dir: [0.5, 1] });
    const D = b.ptOn("D", { kind: "circle", c: O, r: R }, 0.05, { dir: [1, 0] });
    b.seg(A, B);
    b.seg(B, C);
    b.seg(C, D);
    b.seg(D, A);
    b.seg(A, C, { id: "seg:AC" });
    b.seg(B, D, { id: "seg:BD" });
    const E = b.at("E", copyAnglePoint(B, D, C, A), { step: 1, dir: [0, 0.4], hideUntilHl: true, keepAfterStep: true });
    b.seg(B, E, { id: "seg:BE", step: 1, hideUntilHl: true, keepAfterStep: true });
    b.seg(A, E, { id: "seg:AE", step: 1, hideUntilHl: true, keepAfterStep: true });
    b.seg(E, C, { id: "seg:EC", step: 1, hideUntilHl: true, keepAfterStep: true });
    b.ang(A, B, E, { id: "ang:ABE", step: 1, r: 16, hideUntilHl: true, keepAfterStep: true });
    b.ang(D, B, C, { id: "ang:DBC", step: 1, r: 16, hideUntilHl: true, keepAfterStep: true });
    b.ang(B, A, E, { id: "ang:BAE", step: 2, r: 14, hideUntilHl: true, keepAfterStep: true });
    b.ang(B, D, C, { id: "ang:BDC", step: 2, r: 14, hideUntilHl: true, keepAfterStep: true });
    b.poly("ABE", [A, B, E], { step: 2, cls: "tri1", hideUntilHl: true, keepAfterStep: true });
    b.poly("DBC", [D, B, C], { step: 2, cls: "tri2", hideUntilHl: true, keepAfterStep: true });
    b.poly("ABD", [A, B, D], { step: 4, cls: "tri1", hideUntilHl: true, keepAfterStep: true });
    b.poly("EBC", [E, B, C], { step: 4, cls: "tri2", hideUntilHl: true, keepAfterStep: true });
  },
  steps: [
    {
      text: "On AC construct the ray BE so that ∠ABE = ∠DBC. E is the cut of that ray with AC.",
      hlBeats: [
        { hl: ["pt:A", "pt:C", "seg:AC"] },
        { draw: ["seg:BE", "pt:E"], hl: ["seg:BE", "pt:E", "pt:B"] },
        { hl: ["ang:ABE", "ang:DBC"] }
      ]
    },
    {
      text: "∠ABE = ∠DBC by construction. ∠BAE = ∠BDC (same segment, both subtend arc BC). So △ABE ~ △DBC.",
      hlExpand: "none",
      hlBeats: [
        { hl: ["ang:ABE", "ang:DBC"] },
        { hl: ["ang:BAE", "ang:BDC"] },
        { hl: ["poly:ABE", "poly:DBC"] }
      ]
    },
    {
      text: "The similar triangles give AB / DB = AE / DC, hence AB · DC = DB · AE.",
      hlExpand: "none",
      hlBeats: [
        { hl: ["seg:AB", "seg:BD"] },
        { hl: ["seg:AE", "seg:DC"] },
        { hl: ["seg:AB", "seg:DC", "seg:BD", "seg:AE"] }
      ]
    },
    {
      text: "Likewise ∠ABD = ∠EBC and ∠ADB = ∠ECB (same segment, arc AB). So △ABD ~ △EBC.",
      hlExpand: "none",
      hlBeats: [
        { hl: ["poly:ABD"] },
        { hl: ["poly:EBC"] },
        { hl: ["poly:ABD", "poly:EBC"] }
      ]
    },
    {
      text: "Those similar triangles give AD / EC = BD / BC, hence AD · BC = BD · EC.",
      hlExpand: "none",
      hlBeats: [
        { hl: ["seg:AD", "seg:BC"] },
        { hl: ["seg:BD", "seg:EC"] }
      ]
    },
    {
      text: "Add the two equalities: AB · DC + AD · BC = BD · (AE + EC) = BD · AC.",
      hlBeats: [
        { hl: ["seg:AC", "seg:BD"] },
        { hl: ["seg:AB", "seg:CD", "seg:AD", "seg:BC", "seg:AC", "seg:BD"] }
      ]
    },
    {
      text: "Q.E.D. — in a cyclic quadrilateral, the product of the diagonals equals the sum of the products of the opposite sides.",
      qed: true,
      hlIds: ["seg:AC", "seg:BD", "seg:AB", "seg:CD", "seg:BC", "seg:AD"]
    }
  ]
};

/* ---- 2. Chord of a difference -------------------------------------- */
FIGS["crddiff"] = {
  title: "The chord of a difference",
  build(b) {
    const O = V(0, 0);
    const R = 78;
    b.circle(O, R, { id: "cir:O" });
    const A = b.ptOn("A", { kind: "circle", c: O, r: R }, Math.PI, { dir: [-1, 0] });
    const D = b.ptOn("D", { kind: "circle", c: O, r: R }, 0, { dir: [1, 0] });
    b.seg(A, D, { id: "seg:AD", dash: "4 4" });
    const B = b.ptOn("B", { kind: "circle", c: O, r: R }, 2.15, { dir: [-0.3, 1] });
    const C = b.ptOn("C", { kind: "circle", c: O, r: R }, 1.15, { dir: [0.4, 1] });
    b.seg(A, B, { id: "seg:AB" });
    b.seg(A, C, { id: "seg:AC" });
    b.seg(B, C, { id: "seg:BC", step: 1, hideUntilHl: true });
    b.seg(B, D, { id: "seg:BD" });
    b.seg(C, D, { id: "seg:CD" });
    b.text("AD = 120", mid(A, D), { dy: -10, step: 0, size: 13, cls: "callout-txt" });
  },
  steps: [
    {
      text: "Let AD be a diameter of the circle of diameter 120. Then ∠ABD and ∠ACD are right (angle in a semicircle), so BD = crd(180° − β) and CD = crd(180° − α).",
      hlBeats: [
        { hl: ["seg:AD", "pt:A", "pt:D"] },
        { hl: ["seg:AB", "seg:BD"] },
        { hl: ["seg:AC", "seg:CD"] }
      ]
    },
    {
      text: "Set AB = crd β and AC = crd α. Then BC is the chord of the difference: crd(α − β).",
      hlBeats: [
        { hl: ["seg:AB"] },
        { hl: ["seg:AC"] },
        { draw: ["seg:BC"], hl: ["seg:BC", "pt:B", "pt:C"] }
      ]
    },
    {
      text: "Ptolemy on ABCD: AC · BD = AB · CD + AD · BC. With AD = 120 this is crd α · crd(180° − β) = crd β · crd(180° − α) + 120 · crd(α − β).",
      hlBeats: [
        { hl: ["seg:AC", "seg:BD"] },
        { hl: ["seg:AB", "seg:CD"] },
        { hl: ["seg:AD", "seg:BC"] }
      ]
    },
    {
      text: "Q.E.D. — crd(α − β) = (crd α · crd(180° − β) − crd β · crd(180° − α)) / 120.",
      qed: true,
      hlIds: ["seg:BC"]
    }
  ]
};

/* ---- 3. Half-arc --------------------------------------------------- */
FIGS["crdhalf"] = {
  title: "The half-arc",
  build(b) {
    const O = V(0, 0);
    const R = 78;
    b.circle(O, R, { id: "cir:O" });
    const A = b.ptOn("A", { kind: "circle", c: O, r: R }, Math.PI, { dir: [-1, 0] });
    const D = b.ptOn("D", { kind: "circle", c: O, r: R }, 0, { dir: [1, 0] });
    b.seg(A, D, { dash: "4 4", id: "seg:AD" });
    const B = b.ptOn("B", { kind: "circle", c: O, r: R }, 1.7, { dir: [0.2, 1] });
    b.seg(A, B, { id: "seg:AB" });
    b.seg(B, D, { id: "seg:BD" });
    const M = b.at("M", unit(add(A, B)).x ? mul(unit(add(A, B)), R) : V(0, R), { step: 1, dir: [-0.2, 1], hideUntilHl: true });
    /* recompute M as midpoint of arc AB: the unit of A+B */
    /* rebuild uses A,B live: */
  },
  steps: []
};

/* rebuild crdhalf with M derived in build */
FIGS["crdhalf"].build = function (b) {
  const O = V(0, 0);
  const R = 78;
  b.circle(O, R, { id: "cir:O" });
  const A = b.ptOn("A", { kind: "circle", c: O, r: R }, Math.PI, { dir: [-1, 0] });
  const D = b.ptOn("D", { kind: "circle", c: O, r: R }, 0, { dir: [1, 0] });
  b.seg(A, D, { dash: "4 4", id: "seg:AD" });
  const B = b.ptOn("B", { kind: "circle", c: O, r: R }, 1.65, { dir: [0.25, 1] });
  b.seg(A, B, { id: "seg:AB" });
  b.seg(B, D, { id: "seg:BD" });
  const s = add(A, B);
  const L = dist(s, O) || 1;
  const M = b.at("M", mul(s, R / L), { step: 1, dir: [0, 1], hideUntilHl: true });
  b.seg(A, M, { id: "seg:AM", step: 1, hideUntilHl: true });
  b.seg(O, M, { id: "seg:OM", step: 2, role: "scaffold", hideUntilHl: true });
};
FIGS["crdhalf"].steps = [
  {
    text: "Let AB = crd θ, AD a diameter. Let M be the midpoint of arc AB. Then AM = crd(θ/2).",
    hlBeats: [
      { hl: ["seg:AB", "pt:A", "pt:B"] },
      { draw: ["pt:M", "seg:AM"], hl: ["pt:M", "seg:AM"] }
    ]
  },
  {
    text: "BD = crd(180° − θ) = √(120² − crd² θ), by the right angle in the semicircle. The half-arc formula is then crd(θ/2) = √[60 · (120 − crd(180° − θ))].",
    hlBeats: [
      { hl: ["seg:BD", "seg:AD"] },
      { hl: ["seg:AM"] }
    ]
  },
  {
    text: "Q.E.D. — from a known chord, the chord of half the arc, by square roots only.",
    qed: true,
    hlIds: ["seg:AM"]
  }
];

/* ---- 4. Menelaos, plane -------------------------------------------- */
FIGS["menelaos-plane"] = {
  title: "Menelaos, plane",
  measure(fig) {
    const A = fig.fig.pts.A, B = fig.fig.pts.B, C = fig.fig.pts.C;
    const D = fig.fig.pts.D, F = fig.fig.pts.F, E = fig.fig.pts.E;
    if (!A || !E) return "";
    function sr(P, Q, R) {
      const u = sub(R, P);
      const n = dist(P, R) || 1;
      const PQ = dot(sub(Q, P), u) / (n * n) * n;
      const QR = dot(sub(R, Q), u) / (n * n) * n;
      if (Math.abs(QR) < 1e-9) return null;
      return PQ / QR;
    }
    const r1 = sr(A, D, B), r2 = sr(B, E, C), r3 = sr(C, F, A);
    if (r1 == null || r2 == null || r3 == null) return "the transversal is parallel to a side";
    const p = Math.abs(r1 * r2 * r3);
    return `AD/DB = ${Math.abs(r1).toFixed(3)} · BE/EC = ${Math.abs(r2).toFixed(3)} · CF/FA = ${Math.abs(r3).toFixed(3)} · product ${p.toFixed(3)}`;
  },
  product(fig) {
    const A = fig.fig.pts.A, B = fig.fig.pts.B, C = fig.fig.pts.C;
    const D = fig.fig.pts.D, F = fig.fig.pts.F, E = fig.fig.pts.E;
    function sr(P, Q, R) {
      const u = sub(R, P);
      const n2 = dot(u, u) || 1;
      const PQ = dot(sub(Q, P), u) / n2;
      const QR = dot(sub(R, Q), u) / n2;
      if (Math.abs(QR) < 1e-12) return null;
      return PQ / QR;
    }
    const r1 = sr(A, D, B), r2 = sr(B, E, C), r3 = sr(C, F, A);
    if (r1 == null || r2 == null || r3 == null) return null;
    return Math.abs(r1 * r2 * r3);
  },
  build(b) {
    const A = b.pt("A", 0, 78, { dir: [0, 1] });
    const B = b.pt("B", -88, -42, { dir: [-1, -0.4], clamp: minDistFrom(A, 40) });
    const C = b.pt("C", 92, -38, { dir: [1, -0.4], clamp: minDistFrom(B, 40) });
    b.seg(A, B, { id: "seg:AB" });
    b.seg(B, C, { id: "seg:BC" });
    b.seg(C, A, { id: "seg:CA" });
    const D = b.ptOn("D", { kind: "seg", a: A, b: B }, 0.38, { dir: [-0.8, 0.4] });
    const F = b.ptOn("F", { kind: "seg", a: C, b: A }, 0.42, { dir: [0.8, 0.4] });
    const Ept = interLL(D, sub(F, D), B, sub(C, B)) || lerp(B, C, 0.5);
    const E = b.at("E", Ept, { dir: [0, -1] });
    b.seg(D, F, { id: "seg:DF" });
    b.seg(F, E, { id: "seg:FE", dash: "5 4" });
    b.seg(D, E, { id: "seg:DE", dash: "5 4" });
  },
  steps: [
    {
      text: "Let a transversal cut AB at D, CA at F, and BC (produced if needed) at E.",
      hlBeats: [
        { hl: ["pt:A", "pt:B", "pt:C", "seg:AB", "seg:BC", "seg:CA"] },
        { hl: ["pt:D", "pt:F", "pt:E", "seg:DF"] }
      ]
    },
    {
      text: "Drop perpendiculars from A, B, C to the transversal, or equivalently compare similar triangles formed by those perpendiculars. The three ratios of segments are then equal in pairs.",
      hlBeats: [
        { hl: ["seg:AB", "pt:D"] },
        { hl: ["seg:BC", "pt:E"] },
        { hl: ["seg:CA", "pt:F"] }
      ]
    },
    {
      text: "The product AD/DB · BE/EC · CF/FA telescopes to 1. Drag D or F: the product stays 1.",
      hlBeats: [
        { hl: ["pt:D", "pt:E", "pt:F", "seg:DF"] }
      ]
    },
    {
      text: "Q.E.D. — Menelaos, plane: the product of the three ratios is 1.",
      qed: true,
      hlIds: ["seg:AB", "seg:BC", "seg:CA", "seg:DF"]
    }
  ]
};

FIGS["menelaos-sphere"] = { title: "Menelaos, spherical", sphere: true };

root.AstroArs.FIGS = FIGS;
})(typeof window !== "undefined" ? window : globalThis);
