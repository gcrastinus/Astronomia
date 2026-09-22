window.AstroArs = window.AstroArs || {};
(function () {
const R = {
  int: n => Math.floor(Math.random() * n),
  pick: a => a[Math.floor(Math.random() * a.length)],
  shuffle(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  },
  sample(a, n) { return R.shuffle(a).slice(0, Math.min(n, a.length)); }
};
function mc(ask, options, answer, why) {
  return { type: "mc", ask, options, answer, why };
}
function num(ask, accept, why) {
  return { type: "num", ask, accept: [].concat(accept).map(String), why };
}
function work(ask, widget, check, why, extra) {
  return Object.assign({ type: "work", ask, widget, check, why }, extra || {});
}
function angDist(a, b) {
  const ast = AstroArs.astro;
  return ast.acosd(ast.clamp(
    ast.sind(a.alt) * ast.sind(b.alt) + ast.cosd(a.alt) * ast.cosd(b.alt) * ast.cosd(a.az - b.az),
    -1, 1));
}
function hasLoop(lons) {
  if (!lons || lons.length < 24) return false;
  const ast = AstroArs.astro;
  const u = [lons[0]];
  for (let i = 1; i < lons.length; i++) u.push(u[i - 1] + ast.wrap180(lons[i] - lons[i - 1]));
  let up = false, down = false;
  for (let i = 1; i < u.length; i++) {
    const d = u[i] - u[i - 1];
    if (d > 0.4) { if (down) return true; up = true; }
    if (d < -0.4) { if (up) return true; down = true; }
  }
  return false;
}

const SPHERE = [
  () => mc("A great circle on a sphere is",
    ["Any circle drawn on the sphere", "A circle whose plane passes through the centre of the sphere", "The path of a circumpolar star", "The horizon of an observer at the pole"],
    1, "Small circles (the tropics, a star’s daily path off the equator) do not share the sphere’s centre. The horizon of a polar observer is the equator, which is a great circle — but that is a special case, not the definition."),
  () => mc("Your zenith is",
    ["The north celestial pole", "The point of the sphere straight above you, the pole of your horizon", "The point where the sun is at noon", "The intersection of ecliptic and equator"],
    1, "The zenith is defined by where you stand, not by the sun or the poles. At the terrestrial pole, zenith and celestial pole coincide; elsewhere they do not."),
  () => mc("The altitude of the celestial pole above your horizon equals",
    ["Your longitude", "Your latitude", "The obliquity of the ecliptic", "The sun’s declination"],
    1, "A theorem of the sphere: the arc from horizon to pole equals the arc from equator to zenith, which is latitude."),
  () => mc("The celestial equator is",
    ["The path of the sun in a year", "The great circle midway between the celestial poles", "Your horizon extended", "The tropic of Cancer"],
    1, "The sun’s yearly path is the ecliptic, tilted to the equator. The tropics are small circles."),
  () => mc("Stars that never set, at a given latitude, are called",
    ["Planets", "Equatorial", "Circumpolar", "Zodiacal"],
    2, "Circumpolar: they describe small circles about the pole that do not cut the horizon."),
  () => mc("The ecliptic is tilted to the equator by about",
    ["5°", "15°", "23½°", "90°"],
    2, "The obliquity, about 23½° (Ptolemy: 23;51,20°). The moon’s path is tilted to the ecliptic by about 5°."),
  () => mc("A sidereal day is shorter than a solar day by about",
    ["One hour", "Four minutes", "Forty minutes", "A whole day"],
    1, "About 3m 56s. That is why a star sets about four minutes earlier each night: the sun has fallen behind by about 1°."),
  () => mc("At the terrestrial equator, the celestial pole is",
    ["At the zenith", "On the horizon", "45° up", "Invisible"],
    1, "Latitude 0°: pole altitude 0°. The stars rise and set vertically; days and nights are equal all year."),
  () => mc("Equinoxes are",
    ["The longest and shortest days", "The intersections of ecliptic and equator", "The poles of the ecliptic", "The stations of a planet"],
    1, "Where the two great circles meet. The sun, crossing, makes day and night equal. Solstices are the farthest points, the turnings."),
  () => mc("The daily paths of the stars are",
    ["Great circles, always", "Small circles parallel to the equator (great, if on the equator)", "Straight lines east to west", "Ellipses about the sun"],
    1, "Parallel to the equator, hence small circles except for stars on the equator itself.")
];

const SPHERE_WORK = [
  () => {
    const lat = R.pick([38, 42, 48, 51]);
    return work(
      `The sky is shown from latitude ${lat}° N, with the names taken off. Drag the hour until the sky has turned a quarter turn, then click the one point that has not moved.`,
      { kind: "sky", attrs: { mode: "stars", labels: "off", hidelat: "1", hidelon: "1", utc: "1", epoch: "2026", lat: String(lat), lon: "0", hour: "20", day: "80", pick: "pole", quiet: "1" } },
      st => st.pick && st.hourTurn >= 4 && angDist(st.pick, st.pole) <= 4,
      "The unmoving point is the celestial pole. Its altitude above the horizon is your latitude — which is why, after a quarter turn, only that place has not gone with the rest.",
      { reveal: st => st.pick ? null : "click the unmoving point" }
    );
  },
  () => {
    const lat = R.pick([32, 40, 45, 52, 58]);
    return work(
      "The sky is shown from a place whose latitude you are not told. What is your latitude, in degrees north?",
      { kind: "sky", attrs: { mode: "stars", hidelat: "1", hidelon: "1", utc: "1", epoch: "2026", lat: String(lat), lon: "0", hour: "21", day: "100", quiet: "1" } },
      (st, typed) => {
        const n = parseFloat(String(typed).replace(/[^\d.-]/g, ""));
        return isFinite(n) && Math.abs(n - st.lat) <= 3;
      },
      "Latitude is the altitude of the pole. Read it off the sky: the gold ring sits that many degrees above the north point of the horizon.",
      { input: "num", reveal: st => st.lat + "°" }
    );
  }
];

const FIVE = [
  () => mc("Ptolemy’s best argument that the heavens are spherical in appearance is",
    ["Spheres are the most perfect figure", "The stars describe parallel circles about a pole", "The Bible says so", "Eclipses are circular"],
    1, "Fittingness is last and least in I.3. The circular diurnal paths, and the pole, are the demonstration. Circular eclipses argue that the earth is spherical."),
  () => mc("The earth’s shadow on the moon, in eclipse, is always round. This shows",
    ["The moon is a sphere", "The earth is a sphere", "The sun is a sphere", "The heavens are a sphere"],
    1, "A sphere casts a circular shadow from every direction. A disk would not, unless the sun were specially placed. The moon’s own roundness is shown by her phases."),
  () => mc("Going north, southern stars sink and the pole rises. This shows",
    ["The earth is flat but large", "The earth is spherical", "The heavens are expanding", "Precession"],
    1, "Travel on a sphere. The change is proportional to the journey; that is how Eratosthenes, with a meridian, finds the circumference."),
  () => mc("The earth is ‘a point’ in Ptolemy I.6 meaning",
    ["The earth has no size", "Compared with the sphere of the stars, the earth’s size does not show: no stellar parallax", "The earth is at the centre", "Only a pointlike observer can do astronomy"],
    1, "The earth has size (Eratosthenes). Relative to the stars it does not show. Relative to the moon it does: lunar parallax is measurable."),
  () => mc("Ptolemy’s strictly astronomical argument that the earth does not go around the sun is",
    ["Falling bodies would be left behind", "No annual stellar parallax is observed", "The equant would fail", "Venus would show phases"],
    1, "The physical argument from falling bodies is I.7 as well, and is natural philosophy. The astronomical one is the absence of parallax. Venus’s phases, when seen, go the other way."),
  () => mc("Eratosthenes finds the earth’s circumference from",
    ["The moon’s parallax", "A noon shadow at Alexandria when the sun is overhead at Syene, and the distance of the cities", "The length of the year", "The height of the pole at Rhodes"],
    1, "The shadow-angle is the angle at the earth’s centre between the two cities; 360° / that angle, times the distance, is the circumference."),
  () => mc("If the shadow-angle is 7.2° and the cities are 5,000 stadia apart, the circumference is",
    ["5,000 stadia", "36,000 stadia", "250,000 stadia", "1,000,000 stadia"],
    2, "360 / 7.2 = 50, and 50 × 5,000 = 250,000. That is Eratosthenes’ figure."),
  () => mc("That the earth is at the centre of the diurnal turning is shown, in I.5, by",
    ["The seasons being unequal", "The horizon bisecting the celestial sphere, and the equinoxes behaving as they do", "The phases of the moon", "The retrogrades of Mars"],
    1, "A displaced earth would make the visible hemisphere unequal and would spoil the equinoxes. Retrogrades and seasons belong to other hypotheses."),
  () => mc("Lunar parallax is possible, stellar parallax (for Ptolemy) is not, because",
    ["The moon is brighter", "The moon is near enough that the earth is not a point relative to her", "The stars do not move", "Ptolemy had no telescope"],
    1, "Distance, not brightness or a telescope. Bessel needed a telescope because the stars are far, not because the geometry is different."),
  () => mc("A man who cannot state Ptolemy’s case for a resting earth",
    ["Is ready for Copernicus", "Is not ready to leave it", "Has already seen parallax", "Should skip Chapter II"],
    1, "The course’s own rule. Copernicus is a construction, not a dismissal.")
];

const CHORDS = [
  () => mc("Ptolemy’s table of chords is computed in a circle of diameter",
    ["1", "2", "60", "120"],
    3, "Diameter 120, so radius 60, a convenient sexagesimal. crd θ = 120 sin(θ/2)."),
  () => mc("The chord of 60° in that circle is",
    ["30", "60", "90", "120"],
    1, "60° is the hexagon: the chord equals the radius, 60."),
  () => num("How many degrees of the daily turning equal one hour of time?", ["15"],
    "360° in 24 hours: 15° per hour. 1° is four minutes of time."),
  () => mc("The tropical year is",
    ["The sun’s return to the same star", "The sun’s return to the same equinox", "Twelve lunations", "A sidereal day"],
    1, "The year of the seasons. The sidereal year is return to the same star, longer by precession."),
  () => mc("Hipparchus found precession of about",
    ["1° per year", "1° in 72 years", "1° in 100 years", "1° in 26,000 years"],
    2, "His figure, which Ptolemy takes. The true rate is closer to 1° in 72 years, a circle in about 25,772 years."),
  () => mc("A gnomon at noon on the equinox gives your latitude because",
    ["The sun is then on the equator, so its zenith-distance is latitude", "The shadow is then longest", "The pole is then on the horizon", "The stick is one metre"],
    0, "On the equinox the sun is on the celestial equator. Zenith-distance at noon = latitude. The shadow/stick ratio is tan of that angle."),
  () => mc("Menelaos on the sphere relates",
    ["The periods of the planets", "Arcs cut by a transversal of great circles, through chords of twice those arcs", "The phases of the moon", "The length of the year"],
    1, "The spherical transversal theorem, Ptolemy’s instrument for moving from a known arc to an unknown one."),
  () => mc("15′ of arc of the daily turning is",
    ["One second of time", "One minute of time", "Fifteen minutes of time", "One hour"],
    1, "1° = 4 minutes of time, so 15′ of arc = 1 minute of time."),
  () => mc("The obliquity of the ecliptic is half",
    ["The year", "The arc between the tropics", "The latitude of Alexandria", "The moon’s inclination"],
    1, "Tropic to tropic is twice the obliquity. Ptolemy: 47;42,40°, hence 23;51,20°."),
  () => mc("A terrestrial parallel is a locus of",
    ["Equal longitude", "Equal latitude: the same pole-height, the same longest day", "Equal eclipse times", "The ecliptic"],
    1, "A small circle of the earth, parallel to the equator. Along it the sky is the same in that sense.")
];

const SUNMOON = [
  () => mc("The sun’s anomaly is",
    ["A defect in the sun", "The departure of the true place from the mean place", "Precession", "The phases"],
    1, "An inequality of motion along the ecliptic. The seasons are unequal because of it."),
  () => mc("On the eccentric hypothesis the sun moves uniformly about",
    ["The earth", "The centre of its circle, which is not the earth", "The equant", "A focus"],
    1, "Earth off-centre; uniform about C. The equant is a later planetary device. The focus is Kepler’s."),
  () => mc("The eccentric and the epicycle, for the sun, are",
    ["Rival physics, one of which is false", "Equivalent geometries: they produce the same apparent motion", "Useful only for the moon", "Rejected by Ptolemy"],
    1, "Almagest III.3. This is the lesson in which you learn what a model is. Aquinas’s reservation is visible in the figure."),
  () => mc("Ptolemy uses the eccentric rather than the epicycle for the sun because",
    ["It is truer", "It is simpler: one motion, not two", "The Church required it", "The epicycle cannot save the seasons"],
    1, "They are equivalent. He chooses the simpler computation."),
  () => mc("Aristarchus’s method for the moon’s distance uses",
    ["Stellar parallax", "The breadth of the earth’s shadow in a lunar eclipse, and the half-moon angle", "Radar", "The length of the month only"],
    1, "On the Sizes and Distances. The solar distance comes out far too small, because the half-moon angle is too close to 90° to measure well. The lunar distance is of the right order."),
  () => mc("The moon shines by reflected light. The phases show this because",
    ["She is sometimes red", "The terminator is the boundary of a globe lit from one side", "She sets later each night", "She stays near the ecliptic"],
    1, "A self-luminous body would not have a dark part whose shape is that of a sphere in sunlight."),
  () => mc("Eclipses happen near the ecliptic because",
    ["The word means that", "The moon’s path is only slightly tilted to the sun’s; they must be near a node as well as new or full", "The earth is a point", "The sun stops"],
    1, "New or full moon is not enough; the moon must also be near a node, or she passes above or below the shadow."),
  () => mc("The greatest equation of the sun, in Ptolemy, is about",
    ["23°", "2;23°", "1°", "47°"],
    1, "About two and a third degrees. The obliquity is 23°; tropic to tropic 47°. Do not mix these."),
  () => mc("Apogee is",
    ["The nearest point", "The farthest point, where the motion as seen from earth is slowest (if the cause is distance)", "A pole", "A station"],
    1, "Farthest; perigee nearest. On the eccentric, slowest at apogee."),
  () => mc("That two constructions save the same appearances is",
    ["A defeat of the art", "A discovery about geometry, and the precise content of Aquinas’s reservation", "Proof that Osiander was wholly right", "True only of the planets"],
    1, "Equivalence is a theorem. Osiander claimed more: that no hypothesis need be true. Equivalence is not that claim.")
];

const SUNMOON_WORK = [
  () => work(
    "The sun is shown. Find the day on which it rises furthest north.",
    { kind: "sky", attrs: { mode: "sun", hidelon: "1", utc: "1", epoch: "2026", lat: "42", lon: "0", hour: "6", day: "20", quiet: "1" } },
    st => Math.abs(st.day - 172) <= 5,
    "The sun rises furthest north at the summer solstice, around day 172 (21 June). That is when its path is the northernmost tropic.",
    { reveal: () => "day 172" }
  ),
  () => work(
    "At this latitude the days are not all equal. Find a day on which the sun is up for twelve hours.",
    { kind: "sky", attrs: { mode: "sun", hidelon: "1", utc: "1", epoch: "2026", lat: "42", lon: "0", hour: "6", day: "1", quiet: "1" } },
    st => Math.abs(st.day - 80) <= 4 || Math.abs(st.day - 266) <= 4,
    "Day and night are equal at the equinoxes, around day 80 (20 March) and day 266 (23 September). The sun then rises due east and sets due west.",
    { reveal: () => "day 80 or 266" }
  )
];

const PLANETS = [
  () => mc("Venus and Mercury never go far from the sun. A model must therefore",
    ["Put them on the ecliptic poles", "Tie their deferents (Ptolemy) or their orbits (Copernicus) to the sun", "Give them no epicycle", "Make them circumpolar"],
    1, "Bounded elongation: Venus ~47°, Mercury ~28°. In Copernicus it is natural: they orbit inside us."),
  () => mc("An outer planet is retrograde when",
    ["It is near the sun in the sky", "It is opposite the sun, on the inner part of its epicycle (Ptolemy), or when the earth overtakes it (Copernicus)", "It is at apogee", "It is at a solstice"],
    1, "Opposition for outers; inferior conjunction for inners. The two descriptions are the same geometry in different rest-frames."),
  () => mc("The equant is",
    ["The empty focus of the ellipse", "A point about which the epicycle-centre moves uniformly, displaced from the deferent-centre", "The earth", "A small epicycle"],
    1, "Three points, two equal gaps: earth, centre, equant. The empty focus is near it and is not it."),
  () => mc("Copernicus rejects the equant because",
    ["It does not save the appearances", "Uniform circular motion about a centre is, for him, a principle of the art", "Tycho told him to", "The Church forbade it"],
    1, "He replaces it with extra circles. The longitudes come out nearly the same. Kepler: he rejected it in name and kept it in fact."),
  () => mc("A station is",
    ["A place on earth for observing", "A turning-point of apparent longitude: the planet stops and reverses", "The equinox", "Apogee"],
    1, "Ptolemy Book XII. The path as seen from earth has a cusp in longitude."),
  () => mc("In Copernicus, the epicycle of an outer planet is",
    ["Unnecessary", "The earth’s orbit, appearing in that planet’s construction; hence the same for all outers, and distances are determined", "Larger than Ptolemy’s", "The equant"],
    1, "Unity of the annual motion, and the determination of relative distances: Copernicus’s structural gain."),
  () => mc("Tycho’s system is geometrically equivalent, for relative planetary motions, to",
    ["Ptolemy’s", "Copernicus’s", "Kepler’s ellipses", "Newton’s"],
    1, "Earth at rest, sun about the earth, planets about the sun. Same elongations and retrogrades as Copernicus. Parallax, when found, kills it."),
  () => mc("Mars is the loud wanderer because",
    ["It is the nearest star", "Its epicycle (or its orbit relative to earth) is large compared with its deferent, so the loops are fat", "It is red", "It has two moons"],
    1, "The ratio of epicycle to deferent is the ratio of earth’s orbit to Mars’s, about 2/3. Jupiter’s and Saturn’s are smaller."),
  () => mc("The five wanderers stay near",
    ["The equator", "The ecliptic", "The horizon", "The pole"],
    1, "The zodiac. Their latitudes are small departures from that road."),
  () => mc("Ptolemy added the equant because",
    ["He liked extra points", "A simple eccentric would not save the observed longitudes of Mars (especially) at the accuracy he wanted", "Copernicus required it", "It explains phases"],
    1, "Each device was added because the appearances demanded it. A device without a phenomenon is a toy.")
];

const PLANETS_WORK = [
  () => work(
    "The epicycle is at zero. Set it until the planet’s path shows a retrograde loop, then stop.",
    { kind: "model", attrs: { model: "build", epi: "0", ecc: "0.10", eq: "0.10", title: "Make a retrogradation" } },
    st => hasLoop(st.trailLon),
    "A large enough epicycle, run, puts a loop in the geocentric path. That loop is a retrogradation: the longitude stops climbing and falls, then climbs again.",
    { reveal: () => "raise the epicycle and Run" }
  ),
  () => work(
    "Set the model so that the mean motion is uniform about a point twice as far from the earth as the deferent’s centre.",
    { kind: "model", attrs: { model: "equant", epi: "0", ecc: "0.18", eq: "0", title: "Bisect the eccentricity" } },
    st => st.e >= 0.05 && Math.abs(st.q - st.e) < 0.01,
    "Ptolemy’s bisection: earth, centre, equant, equally spaced. The equant sits at 2e from the earth, so the slider ‘Equant beyond centre’ equals the eccentricity. The readout then says bisected.",
    { reveal: () => "equant beyond centre = eccentricity" }
  )
];

const KEPLER = [
  () => mc("Kepler would not give up eight minutes of arc because",
    ["They were a clerical error", "Tycho’s observations were good to about 2′, and the circular models failed by eight minutes", "The Church required eight", "Eight is a perfect number"],
    1, "‘These eight minutes have led the way to the reformation of all of astronomy.’"),
  () => mc("Kepler’s first law: the path is",
    ["A circle with the sun at the centre", "An ellipse with the sun at one focus", "An oval with the earth at a focus", "An epicycle"],
    1, "Sun at a focus, not at the centre. The empty focus is the other."),
  () => mc("The area law says",
    ["Equal angles in equal times about the sun", "Equal areas in equal times, swept by the radius from the sun", "Equal distances in equal times", "Equal speeds"],
    1, "Near perihelion, more arc in the same time; the triangles are short and fat."),
  () => mc("The empty focus of the ellipse is",
    ["Exactly Ptolemy’s equant", "Near the equant, and not one: uniform motion about it would contradict the area law", "The sun", "The earth"],
    1, "The reductio of the aftermath. Ptolemy’s equant remains the best circular imitation of the area law."),
  () => mc("The harmonic law: the square of the period is as",
    ["The distance", "The square of the distance", "The cube of the mean distance", "The eccentricity"],
    2, "P² ∝ a³. Saturn ~29.5 y, ~9.5 AU: 29.5² ≈ 870, 9.5³ ≈ 857."),
  () => mc("Earth’s orbit looks circular to the eye because",
    ["It is a circle", "Its eccentricity is only about 0.017: the sun is off-centre by 1.7% of the radius", "Kepler was wrong about the earth", "The equant hides it"],
    1, "The table in the aftermath. Tycho’s minutes of arc see what the eye will not."),
  () => mc("Newton’s Book I Prop. 11 shows that if the path is an ellipse about a focus, the force is",
    ["Constant", "Inverse-square", "Inverse-cube", "Forward along the path"],
    1, "A property of elliptical motion about a focus. Not yet universal gravitation — that is the moon test, Book III."),
  () => mc("The moon test shows",
    ["The moon is a sphere", "The fall of the moon from a tangent agrees with inverse-square weight at the earth’s surface", "The moon shines by its own light", "There is no gravity in the heavens"],
    1, "The same tendency here and there. Huygens’s pendulum gives g; the moon’s distance in earth-radii gives the scaled fall."),
  () => mc("This course treats Newton as a door out of the art because",
    ["Newton is too hard", "When the celestial/terrestrial division falls, astronomy stops being a scientia media and becomes mathematical physics", "Newton used calculus, which is forbidden", "Kepler already finished everything"],
    1, "What is gained: one cause. What is lost: the art’s independence, and the heavens as a distinct object. Densmore is named as the next book."),
  () => mc("Kepler got a construction rule wrong, and the Astronomia nova",
    ["Hides the error", "Leaves the false step in the path", "Was rewritten in 1619 to remove it", "Blames Tycho"],
    1, "The course’s reason for reading him as a man discovering. Day 45 in another numbering: ‘Kepler Gets the Construction Rule Wrong.’")
];

const ASSENT = [
  () => mc("A scientia media has",
    ["No subject", "A natural subject and mathematical middle terms", "Only practical ends", "No demonstrations"],
    1, "Aquinas on Boethius: music applies mathematics to sound, astronomy to the heavens."),
  () => mc("Osiander’s preface claims that astronomical hypotheses",
    ["Must be true", "Need not be true or even probable, if they save the calculations", "Are revealed", "Are the same as physics"],
    1, "Ad lectorem, 1543. Copernicus’s own dedication claims more. Motive is not an argument."),
  () => mc("Aquinas, ST I q.32 a.1 ad 2, says the theory of eccentrics and epicycles is established because",
    ["It is demonstrated as the only possible principle", "The appearances are saved; not as if the proof were sufficient, for another theory might explain them", "Aristotle required it", "It is useful for Easter"],
    1, "The single largest piece of original work this course had to do: not to walk past that sentence."),
  () => mc("Demonstration, in the Posterior Analytics, requires principles that are",
    ["Useful", "True, primary, immediate, better known, prior, and causes of the conclusion", "Agreed by a committee", "Mathematical only"],
    1, "I.2. Most of astronomy is less than that. Naming the deficit is the liberal-arts act."),
  () => mc("Tier I means",
    ["The oldest claims", "You can make the experience yourself, with at most binoculars", "NASA has confirmed it", "It is in Ptolemy"],
    1, "Assent graded by how the claim is reached, not by date. Eratosthenes, the phases of Venus, the moons of Jupiter."),
  () => mc("Bradley’s aberration and Bessel’s parallax together",
    ["Save Tycho", "Settle, by experience, that the earth moves: the appearance that would not be saved both ways", "Refute Kepler", "Are Tier IV"],
    1, "The honest answer to Osiander, not that saving appearances was foolish, but that this appearance stopped being saveable both ways."),
  () => mc("A Tier IV claim in this course is marked as",
    ["False", "The current best account of anomalies that are themselves more securely observed", "Closed demonstration", "Unworthy of mention"],
    1, "Dark matter, dark energy, inflation. The anomalies are often Tier II/III. The accounts are not."),
  () => mc("The work (opus) of astronomy as a liberal art, in St. Thomas’s list, is",
    ["To make a calendar", "To compute the courses of the stars", "To launch a satellite", "To save souls"],
    1, "Cursus siderum computare — a work immediately of reason, which stays in the one who makes it."),
  () => mc("‘Liberal’ in this tradition means",
    ["For non-majors", "Easy", "Ordered to knowing, not to a usefulness had through action", "Modern and free of religion"],
    2, "Aristotle’s free science; Aquinas: illae solae artes liberales dicuntur quae ad sciendum ordinantur."),
  () => mc("Every Tier III and IV claim in this course must",
    ["Be dated after 1900", "Name what would have to be false for it to fail", "Cite NASA", "Be believed on authority"],
    1, "The habit you take away. Name the link you distrust; do not distrust the conclusion in a lump.")
];

const KEPLER_WORK = [
  () => work(
    "Place the planet where it is moving fastest.",
    { kind: "ellipse", attrs: { e: "0.25", nu: "120", title: "The area law" } },
    st => Math.min(Math.abs(st.nu), Math.abs(st.nu - 360)) <= 20,
    "Fastest at perihelion, nearest the sun: true anomaly 0°. The area law packs more arc into the same time where the radius is short.",
    { reveal: () => "perihelion, true anomaly 0°" }
  ),
  () => work(
    "The dashed curve is a circle. Bring the eccentricity down to Mars’s, about 0.093, and watch the ellipse fall in with the circle.",
    { kind: "ellipse", attrs: { e: "0.25", nu: "40", title: "The circle destroyed" } },
    st => Math.abs(st.e - 0.093) <= 0.02,
    "Mars’s eccentricity is about 0.093. The orbit looks circular to the eye; Tycho’s minutes of arc do not. That is why the circle survived so long, and why it had to go.",
    { reveal: () => "0.093" }
  )
];

function fromFactories(list, n) { return R.sample(list, n).map(f => f()); }

const SPHERE_ALL = SPHERE.concat(SPHERE_WORK);
const SUNMOON_ALL = SUNMOON.concat(SUNMOON_WORK);
const PLANETS_ALL = PLANETS.concat(PLANETS_WORK);
const KEPLER_ALL = KEPLER.concat(KEPLER_WORK);

const SETS = {
  sphere: { title: "The sphere", size: 10, build: () => R.shuffle(fromFactories(SPHERE, 8).concat(SPHERE_WORK.map(f => f()))) },
  five: { title: "The five propositions", size: 10, build: () => fromFactories(FIVE, 10) },
  chords: { title: "Chords and the year", size: 10, build: () => fromFactories(CHORDS, 10) },
  sunmoon: { title: "Sun and moon", size: 10, build: () => R.shuffle(fromFactories(SUNMOON, 8).concat(SUNMOON_WORK.map(f => f()))) },
  planets: { title: "The wanderers", size: 10, build: () => R.shuffle(fromFactories(PLANETS, 8).concat(PLANETS_WORK.map(f => f()))) },
  kepler: { title: "Three worlds and Kepler", size: 10, build: () => R.shuffle(fromFactories(KEPLER, 8).concat(KEPLER_WORK.map(f => f()))) },
  assent: { title: "Assent", size: 10, build: () => fromFactories(ASSENT, 10) }
};
SETS.exam = {
  title: "The examination",
  size: 14,
  build: () => R.shuffle([].concat(
    fromFactories(SPHERE_ALL, 2), fromFactories(FIVE, 2), fromFactories(CHORDS, 2),
    fromFactories(SUNMOON_ALL, 2), fromFactories(PLANETS_ALL, 2), fromFactories(KEPLER_ALL, 2),
    fromFactories(ASSENT, 2)
  ))
};

AstroArs.DRILLS = SETS;

AstroArs.normNum = function (s) {
  const t = String(s).trim().replace(/\s+/g, "").replace(/,/g, "");
  if (/^\d+$/.test(t)) return t;
  const f = t.match(/^(\d+)[:/](\d+)$/);
  if (f) return String(+f[1] / +f[2]);
  if (/^\d*\.\d+$/.test(t)) return String(parseFloat(t));
  return t.replace(/[^\d.-]/g, "") || null;
};
})();
