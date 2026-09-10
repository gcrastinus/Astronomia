/* Naked-eye astronomy, computed. Meeus-style truncated formulae:
   good to well under an arcminute for the sun, a few minutes for the moon
   and planets — enough to check the window, not enough for a telescope. */
window.AstroArs = window.AstroArs || {};
(function (A) {
const D2R = Math.PI / 180, R2D = 180 / Math.PI;
const TAU = Math.PI * 2;

function deg(x) { return x * R2D; }
function rad(x) { return x * D2R; }
function wrap360(x) { x = x % 360; return x < 0 ? x + 360 : x; }
function wrap180(x) { x = wrap360(x); return x > 180 ? x - 360 : x; }
function sind(x) { return Math.sin(rad(x)); }
function cosd(x) { return Math.cos(rad(x)); }
function tand(x) { return Math.tan(rad(x)); }
function asind(x) { return deg(Math.asin(clamp(x, -1, 1))); }
function acosd(x) { return deg(Math.acos(clamp(x, -1, 1))); }
function atan2d(y, x) { return wrap360(deg(Math.atan2(y, x))); }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function hypot(x, y) { return Math.sqrt(x * x + y * y); }

function julian(date) {
  const y = date.getUTCFullYear();
  let m = date.getUTCMonth() + 1;
  const d = date.getUTCDate()
    + (date.getUTCHours()
      + (date.getUTCMinutes() + date.getUTCSeconds() / 60) / 60) / 24;
  let yy = y, mm = m;
  if (mm <= 2) { yy -= 1; mm += 12; }
  const A = Math.floor(yy / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + d + B - 1524.5;
}

function gmst(jd) {
  const T = (jd - 2451545.0) / 36525;
  let st = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T - T * T * T / 38710000;
  return wrap360(st);
}

function obliquity(jd) {
  const T = (jd - 2451545.0) / 36525;
  return 23.439291 - 0.0130042 * T;
}

/* IAU 1976 precession, J2000 → of date. Angles in degrees. */
function precessAngles(jd) {
  const T = (jd - 2451545.0) / 36525;
  const T2 = T * T, T3 = T2 * T, s = 1 / 3600;
  return {
    zeta: (2306.2181 * T + 0.30188 * T2 + 0.017998 * T3) * s,
    z: (2306.2181 * T + 1.09468 * T2 + 0.018203 * T3) * s,
    theta: (2004.3109 * T - 0.42665 * T2 - 0.041833 * T3) * s
  };
}
function precess(ra, dec, jd) {
  const { zeta, z, theta } = precessAngles(jd);
  const a = ra + zeta;
  const A = cosd(dec) * sind(a);
  const B = cosd(theta) * cosd(dec) * cosd(a) - sind(theta) * sind(dec);
  const C = sind(theta) * cosd(dec) * cosd(a) + cosd(theta) * sind(dec);
  return { ra: wrap360(atan2d(A, B) + z), dec: asind(clamp(C, -1, 1)) };
}
function precessInv(ra, dec, jd) {
  const { zeta, z, theta } = precessAngles(jd);
  const a = ra - z;
  const A = cosd(dec) * sind(a);
  const B = cosd(theta) * cosd(dec) * cosd(a) + sind(theta) * sind(dec);
  const C = -sind(theta) * cosd(dec) * cosd(a) + cosd(theta) * sind(dec);
  return { ra: wrap360(atan2d(A, B) - zeta), dec: asind(clamp(C, -1, 1)) };
}
function eqToEcl(ra, dec, eps) {
  const e = eps == null ? 23.439291 : eps;
  const lat = asind(sind(dec) * cosd(e) - cosd(dec) * sind(e) * sind(ra));
  const lon = atan2d(sind(dec) * sind(e) + cosd(dec) * cosd(e) * sind(ra), cosd(dec) * cosd(ra));
  return { lon, lat };
}

function kepler(M, e) {
  M = rad(wrap360(M));
  let E = M + e * Math.sin(M) * (1 + e * Math.cos(M));
  for (let i = 0; i < 8; i++) {
    const d = E - e * Math.sin(E) - M;
    E -= d / (1 - e * Math.cos(E));
    if (Math.abs(d) < 1e-8) break;
  }
  return E;
}

function sun(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = wrap360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = wrap360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C = (1.914602 - 0.004817 * T) * sind(M)
    + (0.019993 - 0.000101 * T) * sind(2 * M)
    + 0.000289 * sind(3 * M);
  const lon = wrap360(L0 + C);
  const eps = obliquity(jd);
  const ra = atan2d(cosd(eps) * sind(lon), cosd(lon));
  const dec = asind(sind(eps) * sind(lon));
  const R = 1.00014 - 0.01671 * cosd(M) - 0.00014 * cosd(2 * M);
  return { lon, lat: 0, ra, dec, dist: R, mag: -26.7, name: "Sun" };
}

function moon(jd) {
  const T = (jd - 2451545.0) / 36525;
  const Lp = wrap360(218.3164477 + 481267.88123421 * T);
  const D = wrap360(297.8501921 + 445267.1114034 * T);
  const M = wrap360(357.5291092 + 35999.0502909 * T);
  const Mp = wrap360(134.9633964 + 477198.8675055 * T);
  const F = wrap360(93.2720950 + 483202.0175233 * T);
  const lon = wrap360(Lp
    + 6.289 * sind(Mp)
    + 1.274 * sind(2 * D - Mp)
    + 0.658 * sind(2 * D)
    + 0.214 * sind(2 * Mp)
    - 0.186 * sind(M)
    - 0.114 * sind(2 * F));
  const lat = 5.128 * sind(F)
    + 0.281 * sind(Mp + F)
    + 0.278 * sind(Mp - F)
    + 0.173 * sind(2 * D - F);
  const eps = obliquity(jd);
  const ra = atan2d(
    sind(lon) * cosd(eps) - tand(lat) * sind(eps),
    cosd(lon)
  );
  const dec = asind(sind(lat) * cosd(eps) + cosd(lat) * sind(eps) * sind(lon));
  const dist = 385000.6
    - 20905.4 * cosd(Mp)
    - 3699.1 * cosd(2 * D - Mp)
    - 2955.97 * cosd(2 * D)
    - 569.9 * cosd(2 * Mp);
  const Re = 6378.14;
  const parallax = asind(clamp(Re / dist, 0, 1)); /* degrees */
  const sd = asind(clamp(1737.4 / dist, 0, 1)); /* apparent semidiameter, degrees */
  const sunLon = sun(jd).lon;
  const elong = wrap180(lon - sunLon);
  const phase = (1 - cosd(elong)) / 2;
  const age = wrap360(lon - sunLon) / 12.1907; /* days, approx */
  return { lon, lat, ra, dec, dist, parallax, sd, phase, elong, age, mag: -12.5 + 3 * (1 - phase), name: "Moon" };
}

/* J2000 mean elements + rates (deg, AU, deg/century). Sufficient for a sky. */
const PLANETS = {
  Mercury: { a: 0.387098, e: 0.205635, i: 7.005, N: 48.331, w: 29.124, L: 252.251, da: 0, de: 0.000020, di: -0.006, dN: 0.126, dw: 0.284, dL: 149472.674 },
  Venus:   { a: 0.723332, e: 0.006773, i: 3.395, N: 76.680, w: 54.884, L: 181.980, da: 0, de: -0.000041, di: -0.001, dN: 0.901, dw: 0.517, dL: 58517.815 },
  Mars:    { a: 1.523679, e: 0.093405, i: 1.850, N: 49.558, w: 286.502, L: 355.433, da: 0, de: 0.000091, di: -0.007, dN: 0.772, dw: 0.736, dL: 19140.302 },
  Jupiter: { a: 5.202603, e: 0.048495, i: 1.303, N: 100.464, w: 273.867, L:  34.351, da: 0, de: 0.000163, di: -0.002, dN: 1.020, dw: 0.212, dL:  3034.906 },
  Saturn:  { a: 9.554909, e: 0.055508, i: 2.489, N: 113.666, w: 339.391, L:  50.078, da: 0, de: -0.000346, di:  0.002, dN: 0.874, dw: 1.085, dL:  1222.114 }
};

function helio(name, jd) {
  const p = PLANETS[name];
  const T = (jd - 2451545.0) / 36525;
  const a = p.a + p.da * T;
  const e = p.e + p.de * T;
  const i = p.i + p.di * T;
  const N = wrap360(p.N + p.dN * T);
  const w = wrap360(p.w + p.dw * T);
  const L = wrap360(p.L + p.dL * T);
  const M = wrap360(L - w - N);
  const E = kepler(M, e);
  const xv = a * (Math.cos(E) - e);
  const yv = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const v = Math.atan2(yv, xv);
  const r = hypot(xv, yv);
  const lon = v + rad(w);
  const xh = r * (Math.cos(rad(N)) * Math.cos(lon) - Math.sin(rad(N)) * Math.sin(lon) * cosd(i));
  const yh = r * (Math.sin(rad(N)) * Math.cos(lon) + Math.cos(rad(N)) * Math.sin(lon) * cosd(i));
  const zh = r * Math.sin(lon) * sind(i);
  return { x: xh, y: yh, z: zh, r, lon: wrap360(deg(lon) + N), a, e };
}

function planet(name, jd) {
  const h = helio(name, jd);
  const s = sun(jd);
  /* Earth at origin: planet helio minus earth helio.
     Earth helio = -sun vector in ecliptic. */
  const ex = -s.dist * cosd(s.lon);
  const ey = -s.dist * sind(s.lon);
  const ez = 0;
  const x = h.x - ex, y = h.y - ey, z = h.z - ez;
  const lon = atan2d(y, x);
  const lat = asind(z / Math.sqrt(x * x + y * y + z * z));
  const dist = Math.sqrt(x * x + y * y + z * z);
  const eps = obliquity(jd);
  const ra = atan2d(sind(lon) * cosd(eps) - tand(lat) * sind(eps), cosd(lon));
  const dec = asind(sind(lat) * cosd(eps) + cosd(lat) * sind(eps) * sind(lon));
  const r = h.r, R = s.dist, delta = dist;
  const cosI = clamp((r * r + delta * delta - R * R) / (2 * r * delta || 1), -1, 1);
  const i = acosd(cosI);
  const H = { Mercury: -0.60, Venus: -4.38, Mars: -1.60, Jupiter: -9.40, Saturn: -8.91 }[name] || 0;
  let ph = 0;
  if (name === "Mercury") ph = 0.0675 * i - 0.001769 * i * i + 0.000001204 * i * i * i;
  else if (name === "Venus") ph = 0.0009 * i + 0.000239 * i * i - 0.00000065 * i * i * i;
  else if (name === "Mars") ph = 0.0164 * i;
  else if (name === "Jupiter") ph = 0.0052 * i;
  else if (name === "Saturn") ph = 0.044 * i;
  const mag = H + 5 * Math.log10(Math.max(1e-6, r * delta)) + ph;
  return { name, lon, lat, ra, dec, dist, mag, phase: i, helio: h };
}

function eqToHoriz(ra, dec, lat, lst) {
  const ha = wrap180(lst - ra);
  const alt = asind(sind(lat) * sind(dec) + cosd(lat) * cosd(dec) * cosd(ha));
  let az = atan2d(-cosd(dec) * sind(ha), cosd(lat) * sind(dec) - sind(lat) * cosd(dec) * cosd(ha));
  return { alt, az, ha };
}

function horizToXY(alt, az, W, H) {
  /* Azimuthal equidistant: zenith at centre, horizon at rim.
     From inside the dome: North up, East left. */
  const R = Math.min(W, H) * 0.44;
  const cx = W / 2, cy = H / 2;
  const z = 90 - alt;
  const r = (z / 90) * R;
  const th = rad(az);
  return { x: cx - r * Math.sin(th), y: cy - r * Math.cos(th), r, cx, cy, R, on: alt >= -1 };
}

/* Bright stars: name, RA hours, Dec deg, mag. J2000. */
const STARS = [
  ["Sirius", 6.7525, -16.716, -1.46],
  ["Canopus", 6.3992, -52.696, -0.74],
  ["Arcturus", 14.2610, 19.182, -0.05],
  ["Rigil Kentaurus", 14.6601, -60.834, -0.01],
  ["Vega", 18.6156, 38.783, 0.03],
  ["Capella", 5.2781, 45.998, 0.08],
  ["Rigel", 5.2423, -8.202, 0.13],
  ["Procyon", 7.6553, 5.225, 0.34],
  ["Achernar", 1.6286, -57.237, 0.46],
  ["Betelgeuse", 5.9195, 7.407, 0.50],
  ["Hadar", 14.0637, -60.373, 0.61],
  ["Altair", 19.8464, 8.868, 0.76],
  ["Acrux", 12.4433, -63.099, 0.77],
  ["Aldebaran", 4.5987, 16.509, 0.85],
  ["Antares", 16.4901, -26.432, 0.96],
  ["Spica", 13.4199, -11.161, 0.98],
  ["Pollux", 7.7553, 28.026, 1.14],
  ["Fomalhaut", 22.9608, -29.622, 1.16],
  ["Deneb", 20.6905, 45.280, 1.25],
  ["Mimosa", 12.7954, -59.689, 1.25],
  ["Regulus", 10.1395, 11.967, 1.35],
  ["Adhara", 6.9771, -28.972, 1.50],
  ["Castor", 7.5767, 31.888, 1.58],
  ["Shaula", 17.5601, -37.104, 1.62],
  ["Bellatrix", 5.4188, 6.350, 1.64],
  ["Elnath", 5.4381, 28.608, 1.65],
  ["Miaplacidus", 9.2200, -69.717, 1.67],
  ["Alnilam", 5.6036, -1.202, 1.69],
  ["Alnair", 22.1372, -46.961, 1.74],
  ["Alioth", 12.9004, 55.960, 1.76],
  ["Alnitak", 5.6793, -1.943, 1.77],
  ["Dubhe", 11.0621, 61.751, 1.79],
  ["Mirfak", 3.4054, 49.861, 1.79],
  ["Wezen", 7.1398, -26.393, 1.83],
  ["Sadr", 20.3705, 40.257, 2.23],
  ["Peacock", 20.4275, -56.735, 1.91],
  ["Alkaid", 13.7923, 49.313, 1.85],
  ["Avior", 8.3752, -59.510, 1.86],
  ["Menkalinan", 5.9922, 44.947, 1.90],
  ["Atria", 16.8111, -69.028, 1.91],
  ["Alhena", 6.6285, 16.399, 1.93],
  ["Polaris", 2.5303, 89.264, 1.98],
  ["Mirzam", 6.3783, -17.955, 1.98],
  ["Alphard", 9.4598, -8.659, 1.98],
  ["Hamal", 2.1195, 23.462, 2.00],
  ["Diphda", 0.7265, -17.987, 2.04],
  ["Nunki", 18.9211, -26.297, 2.05],
  ["Menkent", 14.1114, -36.370, 2.06],
  ["Alpheratz", 0.1398, 29.090, 2.07],
  ["Mirach", 1.1622, 35.621, 2.07],
  ["Saiph", 5.7960, -9.670, 2.07],
  ["Kochab", 14.8451, 74.155, 2.08],
  ["Rasalhague", 17.5822, 12.560, 2.08],
  ["Algol", 3.1361, 40.955, 2.12],
  ["Sheliak", 18.7462, 33.365, 3.45],
  ["δ Cephei", 22.4550, 58.415, 4.00],
  ["Almach", 2.0640, 42.330, 2.10],
  ["Denebola", 11.8181, 14.572, 2.14],
  ["Naos", 8.0597, -40.003, 2.21],
  ["Eltanin", 17.9434, 51.489, 2.23],
  ["Alphecca", 15.5781, 26.715, 2.23],
  ["Mintaka", 5.5334, -0.299, 2.23],
  ["Mizar", 13.3987, 54.925, 2.23],
  ["Sargas", 17.6219, -42.998, 1.86],
  ["Kaus Australis", 18.4029, -34.385, 1.85],
  ["Gacrux", 12.5194, -57.113, 1.63],
  ["Merak", 11.0307, 56.382, 2.37],
  ["Phecda", 11.8972, 53.695, 2.44],
  ["Megrez", 12.2573, 57.033, 3.31],
  ["Phad", 11.8972, 53.695, 2.44],
  ["Schedar", 0.6751, 56.537, 2.23],
  ["Caph", 0.1528, 59.150, 2.27],
  ["Cih", 0.9459, 60.717, 2.47],
  ["Ruchbah", 1.4302, 60.235, 2.68],
  ["Segin", 1.9066, 63.670, 3.35],
  ["Markab", 23.0793, 15.205, 2.49],
  ["Scheat", 23.0629, 28.083, 2.42],
  ["Algenib", 0.2206, 15.183, 2.83],
  ["Enif", 21.7364, 9.875, 2.38],
  ["Gienah", 20.7702, 33.970, 2.48],
  ["Albireo", 19.5120, 27.960, 3.05],
  ["Deneb Algedi", 21.7789, -16.127, 2.85],
  ["Thuban", 14.0731, 64.376, 3.65],
  ["Alderamin", 21.3096, 62.586, 2.45],
  ["Pherkad", 15.3454, 71.834, 3.05],
  ["Yildun", 17.5368, 86.586, 4.36],
  ["ε UMi", 16.7661, 82.037, 4.23],
  ["ζ UMi", 15.7343, 77.794, 4.32],
  ["η UMi", 16.2917, 75.755, 4.95]
];

const LINES = [
  /* Ursa Major */
  ["Dubhe", "Merak"], ["Merak", "Phecda"], ["Phecda", "Megrez"],
  ["Megrez", "Dubhe"], ["Megrez", "Alioth"], ["Alioth", "Mizar"], ["Mizar", "Alkaid"],
  /* Ursa Minor */
  ["Polaris", "Yildun"], ["Yildun", "ε UMi"], ["ε UMi", "ζ UMi"],
  ["ζ UMi", "η UMi"], ["η UMi", "Pherkad"], ["Pherkad", "Kochab"], ["Kochab", "ζ UMi"],
  /* Orion */
  ["Betelgeuse", "Bellatrix"], ["Bellatrix", "Mintaka"], ["Mintaka", "Alnilam"],
  ["Alnilam", "Alnitak"], ["Alnitak", "Saiph"], ["Saiph", "Rigel"],
  ["Rigel", "Mintaka"], ["Betelgeuse", "Alnitak"],
  /* Cassiopeia */
  ["Caph", "Schedar"], ["Schedar", "Cih"], ["Cih", "Ruchbah"], ["Ruchbah", "Segin"],
  /* Summer triangle */
  ["Vega", "Deneb"], ["Deneb", "Altair"], ["Altair", "Vega"],
  /* Crux */
  ["Acrux", "Gacrux"], ["Mimosa", "Acrux"],
  /* Scorpius hint */
  ["Antares", "Shaula"], ["Shaula", "Sargas"]
];

const STAR_MAP = {};
STARS.forEach(s => { STAR_MAP[s[0]] = s; });

/* Optional variability: period (days), epoch (JD of a primary minimum or max light),
   magMax (brightest), magMin (faintest), width (days, EA eclipse duration). */
const VARSTARS = {
  Algol: { period: 2.867328, epoch: 2458923.958, magMax: 2.12, magMin: 3.39, width: 10 / 24, kind: "ea" },
  Sheliak: { period: 12.9414, epoch: 2451545.0, magMax: 3.25, magMin: 4.36, kind: "eb" },
  "δ Cephei": { period: 5.366341, epoch: 2451545.0, magMax: 3.48, magMin: 4.37, kind: "cep" }
};

function variableMag(rec, jd) {
  let p = (jd - rec.epoch) / rec.period;
  p -= Math.floor(p);
  if (p < 0) p += 1;
  if (rec.kind === "ea") {
    const hw = (rec.width || 10 / 24) / rec.period / 2;
    const d = Math.min(p, 1 - p);
    if (d >= hw) return rec.magMax;
    const x = d / hw;
    return rec.magMax + (rec.magMin - rec.magMax) * 0.5 * (1 + Math.cos(Math.PI * x));
  }
  if (rec.kind === "eb") {
    const amp = (rec.magMin - rec.magMax) / 2;
    const mid = (rec.magMin + rec.magMax) / 2;
    const prim = Math.cos(2 * Math.PI * p);
    const sec = 0.35 * Math.cos(4 * Math.PI * p);
    return mid + amp * (0.72 * prim + sec);
  }
  /* cepheid: steep rise, slow fall */
  const rise = 0.18;
  const f = p < rise ? p / rise : 1 - (p - rise) / (1 - rise);
  return rec.magMin - f * (rec.magMin - rec.magMax);
}

function starPos(s, lat, lst, jd) {
  const eq = precess(s[1] * 15, s[2], jd);
  const rec = VARSTARS[s[0]];
  const mag = rec ? variableMag(rec, jd) : s[3];
  return Object.assign({ name: s[0], mag, magMean: s[3], ra: eq.ra, dec: eq.dec }, eqToHoriz(eq.ra, eq.dec, lat, lst));
}

function bodies(date, lat, lon) {
  const jd = julian(date);
  const lst = wrap360(gmst(jd) + lon);
  const s = sun(jd);
  const m = moon(jd);
  const out = {
    jd, lst, lat, lon,
    sun: Object.assign({}, s, eqToHoriz(s.ra, s.dec, lat, lst)),
    moon: Object.assign({}, m, eqToHoriz(m.ra, m.dec, lat, lst)),
    planets: {},
    stars: STARS.map(st => starPos(st, lat, lst, jd)),
    eps: obliquity(jd)
  };
  for (const n of Object.keys(PLANETS)) {
    const p = planet(n, jd);
    out.planets[n] = Object.assign({}, p, eqToHoriz(p.ra, p.dec, lat, lst));
  }
  /* Ecliptic and equator poles / sample points */
  out.pole = eqToHoriz(0, 90, lat, lst);
  out.spole = eqToHoriz(0, -90, lat, lst);
  return out;
}

function fmtDeg(x, pos, neg) {
  const n = Math.abs(x);
  const d = Math.floor(n);
  const m = Math.round((n - d) * 60);
  const hemi = x >= 0 ? pos : neg;
  return d + "°" + String(m).padStart(2, "0") + "′ " + hemi;
}

function fmtTime(date) {
  const h = date.getHours(), m = date.getMinutes();
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}

A.astro = {
  D2R, R2D, TAU, deg, rad, wrap360, wrap180, sind, cosd, tand, asind, acosd, atan2d, clamp, hypot,
  julian, gmst, obliquity, sun, moon, planet, helio, eqToHoriz, horizToXY,
  precess, precessInv, eqToEcl,
  STARS, LINES, STAR_MAP, VARSTARS, variableMag, PLANETS, bodies, fmtDeg, fmtTime, kepler
};
})(window.AstroArs);
