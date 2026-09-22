window.AstroArs = window.AstroArs || {};
AstroArs.LESSONS = (AstroArs.LESSONS || []).concat([

{
  id: "iv-1",
  ch: "IV",
  title: "The sun’s year, and its inequality",
  html: `
<p>The sun returns to the same equinox in a year. That year is not the same as a return to the same star: precession, waiting in a later lesson, splits them. For the sun’s own motion along the ecliptic, Ptolemy needs two facts.</p>
<p><strong>The mean motion.</strong> In a year the sun goes 360°. Divided equally, a little less than 1° a day. If that were the whole truth, the seasons would be equal, and a table of mean longitude would predict the sun.</p>
<p><strong>They are not equal.</strong> From spring equinox to summer solstice is longer than from summer to autumn, and so on. Hipparchus already had: spring 94½ days, summer 92½, autumn 88⅛, winter 90⅛ (Ptolemy’s figures, from Hipparchus). The sun takes longer to go through the spring and summer signs than through the autumn and winter. It is slower at some longitudes, faster at others.</p>
<dl class="dl">
  <dt>Anomaly</dt>
  <dd>The inequality: the departure of the true place from the mean place. Not a defect in the sun. A fact to be saved.</dd>
  <dt>Equation of the sun</dt>
  <dd>The angle you add (or subtract) to the mean longitude to get the true. Greatest, for Ptolemy, about 2;23°.</dd>
  <dt>Apogee, perigee</dt>
  <dd>The places of slowest and fastest motion — farthest from, and nearest to, the earth, if the cause is a change of distance.</dd>
</dl>
<p>Two hypotheses will save this. That there are two, and that they are equivalent, is how you will see what a model is.</p>
`,
  sources: "Ptolemy, Almagest III.1–4; Hipparchus, as reported there."
},

{
  id: "iv-2",
  ch: "IV",
  title: "The eccentric hypothesis",
  html: `
<p>The sun moves uniformly on a circle. The earth is not at the centre of that circle. The centre is displaced toward the apogee, by an amount called the eccentricity.</p>
<p>Uniform motion about the centre C, seen from an earth at O off-centre, does not look uniform. When the sun is at apogee, it is farthest from O and its angular speed as seen from O is least. When at perigee, greatest. The seasons on the apogee side last longer.</p>
<p>Hipparchus found the eccentricity and the place of apogee from the lengths of the seasons. Ptolemy takes the same: apogee at Gemini 5;30°, eccentricity 1/24 of the radius.</p>
<div class="widget" data-kind="model" data-model="eccentric" data-title="The sun on an eccentric"></div>
<p>Move the eccentricity. Watch the equation — the difference between mean longitude (uniform about C) and true longitude (as seen from Earth). At 90° from apogee the equation is greatest. That is a theorem: the tangent from O to the circle of motion is the line of greatest equation.</p>
<p class="qed">The eccentric saves the solar anomaly</p>
`,
  sources: "Ptolemy, Almagest III.3–4."
},

{
  id: "iv-3",
  ch: "IV",
  title: "The epicyclic hypothesis",
  html: `
<p>The sun’s circle is concentric with the earth. On that deferent a small circle, the epicycle, is carried. The sun rides on the epicycle. The two motions are equal in period and opposite in sense, so that the epicycle turns once in a year, backward, while its centre goes once around, forward. The resulting path is again a circle, off-centre.</p>
<p>That last sentence is the surprise. An epicycle of radius e, carried on a deferent of radius R, with equal opposite periods, traces a circle of radius R whose centre is displaced by e. The epicycle <em>is</em> the eccentric, drawn another way.</p>
<div class="widget" data-kind="model" data-model="epicycle" data-title="The sun on an epicycle"></div>
<p>Set the epicycle at 1/24 of the deferent, matching Ptolemy’s eccentricity. Run it. The path is a circle that does not enclose the earth at its centre. The appearances from Earth are the same appearances the eccentric gave.</p>
`,
  sources: "Ptolemy, Almagest III.3."
},

{
  id: "iv-4",
  ch: "IV",
  title: "The two hypotheses are one geometry",
  html: `
<p>This is the lesson in which you learn what a <em>model</em> is.</p>
<p>Ptolemy, III.3: the eccentric and the epicycle, so arranged, produce the same apparent motion of the sun. He demonstrates it by exhibiting the figure in which the radius of the epicycle is equal, parallel, and opposite to the line from the earth to the eccentric centre. The sun’s place is then the same point, whichever construction you named.</p>
<p>Two consequences, both permanent.</p>
<p><strong>First, for the sun.</strong> You may compute with whichever is convenient. Ptolemy uses the eccentric for the sun, because it is simpler: one motion, not two.</p>
<p><strong>Second, for the art.</strong> That two constructions save the same appearances is a discovery about geometry, not a defeat — and it is one only because the appearances are stable enough to pin the parameters down. It is exactly Aquinas’s reservation: the theory is established because the appearances are saved; not as if the proof were sufficient, “forasmuch as some other theory might explain them.” Here you can <em>see</em> the other theory. It is not a threat. It is a theorem.</p>
<div class="widget" data-kind="model" data-model="build" data-title="Eccentric and epicycle together"></div>
<div class="remark">
  <h4>What “saving the appearances” now means</h4>
  <p>It does not mean “anything goes.” The appearances constrain the parameters: the eccentricity (or epicyclic radius) and the place of apogee are determined by the seasons. What they do not determine is which of two equivalent constructions you name. Osiander claimed more than this — that <em>no</em> hypothesis need be true. Equivalence is not that claim. Keep the distinction.</p>
</div>
<p class="qed">Q.E.D. — the hypotheses are equivalent for the sun</p>
`,
  sources: "Ptolemy, Almagest III.3; Aquinas, ST I q.32 a.1 ad 2."
},

{
  id: "iv-5",
  ch: "IV",
  title: "Precession",
  html: `
<p>Hipparchus found that the stars, measured from the equinox, do not keep their longitudes. Spica, near the autumnal equinox in his time, was not where Timocharis had it. The equinoxes are slipping westward along the ecliptic — or the sphere of the stars is slipping eastward, which is the same relative motion. About 1° in 100 years, Hipparchus said. Ptolemy takes 1° in 100 years. The true rate is closer to 1° in 72 years, a circle in about 25,772 years.</p>
<dl class="dl">
  <dt>Tropical year</dt>
  <dd>Return of the sun to the same equinox. The year of the seasons and the calendar.</dd>
  <dt>Sidereal year</dt>
  <dd>Return of the sun to the same star. Longer, by the amount of precession.</dd>
</dl>
<div class="widget" data-kind="precess"></div>
<div class="widget" data-kind="sky" data-mode="stars" data-epoch="-130" data-title="The sky around 130 BC"></div>
<div class="widget" data-kind="sky" data-mode="stars" data-title="The same figures, this year"></div>
<p>Ptolemy puts precession in a slow turning of the sphere of the stars about the poles of the ecliptic. Copernicus will put it in a motion of the earth’s axis. The appearance is the same. Another equivalence, of a larger kind.</p>
<div class="remark">
  <h4>The paradigm of celestial change</h4>
  <p>Precession is the type of change the art was built to catch: too slow for a lifetime, visible only against records, and once seen, regular enough for a construction to save it. It is the qualifier stated in <span class="xref" data-to="i-1b"></span>, now measured. The other exceptions, caught with the same ordinary instruments, are <span class="xref" data-ch="chg"></span>.</p>
</div>
`,
  sources: "Ptolemy, Almagest III.1, VII.1–3; Hipparchus, as reported there."
},

{
  id: "iv-6",
  ch: "IV",
  title: "The moon’s distance",
  html: `
<p>A lunar eclipse is a measuring-rod. The sun’s rays, passing the earth, cast a conical shadow. The moon, entering that shadow, shows by how long she takes to cross it, and by how much of her disk is covered, the breadth of the shadow at her distance.</p>
<p>Aristarchus, in <em>On the Sizes and Distances of the Sun and Moon</em>, used the angle between sun and moon at half-moon, and the breadth of the shadow in eclipse, to find both distances in earth-radii. His solar distance is far too small (the half-moon angle is too close to 90° to measure well). His lunar distance is of the right order.</p>
<p>Hipparchus and Ptolemy, with parallax and with eclipse durations, put the moon at about 59–64 earth-radii (mean, in the simple model). The widget shows the geometry: the umbra’s breadth at a given distance, compared with the moon’s disk.</p>
<div class="widget" data-kind="eclipse"></div>
<p>The moon shines by reflected light. The phases show it: the terminator is the boundary of a globe lit from one side. The dark part of a crescent, faintly seen, is earthshine — the earth’s own disk, as a moon, lighting the moon. That last is later; the phases themselves are enough.</p>
`,
  sources: "Aristarchus, On the Sizes and Distances; Ptolemy, Almagest V.11–16; Geminos, Introduction 11."
},

{
  id: "iv-7",
  ch: "IV",
  title: "What the sun and moon have taught",
  html: `
<p>A mean motion, an inequality, a construction that saves it, and another construction that saves the same. Distances in earth-radii. A slow motion of the frame itself.</p>
<p>The sun’s inequality is simple: one anomaly, one apogee, equivalent hypotheses. The moon is already worse: Ptolemy needs an epicycle and a moving deferent (the “prosneusis” and the evection) to save her, and even then the predicted size of the disk at perigee is larger than the eye allows. The art is not finished with the moon. It is competent with the sun.</p>
<p>The wanderers will need everything the sun needed, and one thing more: a device that makes the motion uniform about a point that is not the centre of the circle. That device is the equant. Mars’s longitudes required it.</p>
`,
  sources: "Ptolemy, Almagest III–V, summary."
},

{
  id: "chg-1",
  ch: "chg",
  title: "The claim, and its bound",
  html: `
<p>The art rests on this: the heavens repeat, so a construction can be tested (<span class="xref" data-to="i-1b"></span>). A figure that saves this year’s solstice must save next year’s, or it is false. That is why astronomy, and not the study of falling leaves, is a quadrivial art.</p>
<p>The claim was never that nothing changes. It was that change is rare, slow, and itself measurable by the same art. Every exception in this chapter was caught with a quadrant, a cross-staff, or an unaided eye. None of them required a telescope. They are how the bound of the claim was found.</p>
<p>What follows: the new star and the comet, which Tycho placed by parallax; a star that winks, which you can time from a chair; and a slow drift of the catalogue, which only centuries reveal. The wanderers of the next chapter are a different kind of change. They wander, but on closed constructions. The changes in this chapter are in the sphere of the stars itself, or in what had been held to belong to it.</p>
`,
  sources: "Ptolemy, Almagest I.1; the bound is the course’s own, from i-1b."
},

{
  id: "chg-2",
  ch: "chg",
  title: "The new star of 1572, and the comet of 1577",
  html: `
<p>In November 1572 a star appeared in Cassiopeia, as bright as Venus, where no star had been. Tycho measured its place against neighbouring stars through the night. An object at the moon’s distance has a horizontal parallax of about 57′ — the earth’s radius seen from the moon. In six hours the observer is carried a quarter turn of the earth; such an object would shift against the stars by the better part of a degree. Tycho’s quadrants resolved a minute of arc. He found no shift. The nova was farther than the moon, in the region that had been held changeless.</p>
<p>He did the same for the comet of 1577. Again no lunar parallax. The comet stood above the moon, on a path that would have carried it through the crystalline spheres if those spheres had been solid.</p>
<p>Two things follow. First, the invariance claim was tested by the art’s own method and partly failed — and the failure was <em>located</em>, not merely announced. That is the difference between a science and a story. Second, anyone who later listened to Tycho on the earth’s rest or motion was listening to a man who had already measured.</p>
<div class="widget" data-kind="check"
  data-ask="Tycho found no parallax of the 1572 star over a night. Therefore"
  data-opts="It was a vapour in the air, under the moon|It was at the moon’s distance|It was farther than the moon|His instruments were too coarse to see a lunar shift"
  data-ans="2"
  data-why="At the moon’s distance the shift in six hours is a large fraction of a degree. A minute of arc would have shown it. None appeared, so the star was beyond the moon."></div>
`,
  sources: "Tycho, De nova stella (1573); De mundi aetherei recentioribus phaenomenis (1588), on the comet of 1577."
},

{
  id: "chg-3",
  ch: "chg",
  title: "Algol — a change you can time yourself",
  html: `
<p>Algol, in Perseus, is in this app’s own catalogue. For most of its cycle it is about magnitude 2.1. About every 2.867 days it falls to about 3.4 and returns, the faintness lasting some ten hours. The naked eye sees it. Goodricke timed it in 1783 with no instrument, and proposed a dark companion passing in front.</p>
<p>The widget steps the light through time and draws the eclipse beside the curve. β Lyrae (Sheliak) and δ Cephei are there too: a pair of distorted stars, and a star that swells and shrinks. The machinery is the same. The sky widget dims Algol on the same schedule.</p>
<div class="widget" data-kind="varstar" data-star="Algol" data-title="Algol’s light"></div>
<p>So the heavens change, and the change is visible in a single night to an unaided eye. But the variation has a period, and a period can be saved by a construction. Algol does not refute the regularity the art rests on. It puts a second regularity inside it.</p>
<div class="widget" data-kind="journal" data-tasks="algol"></div>
`,
  sources: "Goodricke, 1783 (Phil. Trans.); GCVS periods for Algol, β Lyrae, δ Cephei."
},

{
  id: "chg-4",
  ch: "chg",
  title: "The fixed stars are not quite fixed",
  html: `
<p>Halley, 1718: comparing Sirius, Arcturus and Aldebaran with Ptolemy’s catalogue, he found them displaced by degrees. The “fixed” stars move. Arcturus moves about 2.3″ a year — about 4′ in a century, about a degree in the fifteen hundred years from Ptolemy to Halley. A human life is far too short to see it. A millennium is not.</p>
<p>This is the qualifier stated as a measured fact: the heavens do not change, so far as we can observe with senses and ordinary instruments. Over a night, a year, a lifetime, the catalogue holds. Over records, it does not — and the drift, once seen, is itself regular.</p>
<p>The sky widget does not add this proper motion to the stars. Over the epochs it spans for a single night, the shift is far below what the eye can tell, and putting it in would complicate the positions for no visible gain. Precession, which the widget does show, is a different motion: of the frame, not of one star against another. Halley’s displacements are of the stars themselves.</p>
<div class="widget" data-kind="precess"></div>
`,
  sources: "Halley, 1718 (Phil. Trans.); Ptolemy, Almagest VII–VIII, the catalogue."
},

{
  id: "v-1",
  ch: "V",
  title: "The five wanderers",
  html: `
<p>Mercury, Venus, Mars, Jupiter, Saturn. They stay near the ecliptic. They have a mean eastward motion among the stars, each at its own rate: Saturn in about 30 years, Jupiter in 12, Mars in 2, Venus and Mercury keeping pace, on average, with the sun.</p>
<p>They do not keep that pace. They slow, stop, go west (retrograde), stop, and resume. The retrogrades of the outer planets happen when the planet is opposite the sun; of Venus and Mercury, when they are near the sun and switching from evening to morning star, or back. The stations — the standings — are the moments of stopping.</p>
<p>Venus and Mercury never go far from the sun: Venus at most about 47°, Mercury about 28°. They are morning stars or evening stars. They are never opposite the sun. That is a fact a model must save, and it is why Ptolemy ties their deferent-centres to the sun’s mean motion.</p>
<div class="widget" data-kind="sky" data-mode="planets" data-title="The wanderers tonight"></div>
<div class="widget" data-kind="journal" data-tasks="planets"></div>
`,
  sources: "Ptolemy, Almagest IX.1; Geminos, Introduction 12."
},

{
  id: "v-2",
  ch: "V",
  title: "Deferent and epicycle",
  html: `
<p>The basic planetary construction, already used for the sun, now does real work.</p>
<p>A deferent, roughly concentric with the earth (or eccentric — next lesson). On it, an epicycle. The planet rides on the epicycle. For an outer planet, the radius of the epicycle, from planet to epicycle-centre, stays parallel to the direction from earth to the mean sun. For Venus and Mercury, the centre of the epicycle stays in line with the mean sun.</p>
<p>That parallelism is the geometric form of a fact: retrogradation happens at opposition (outers) or inferior conjunction (inners). When the planet is on the inner part of the epicycle, its epicyclic motion is westward and can overpower the deferent, so the planet goes retrograde as seen from Earth.</p>
<div class="widget" data-kind="model" data-model="epicycle" data-title="Deferent and epicycle — find a station"></div>
<p>Run the model. Watch the path. The loops are the retrogrades. A station is where the path, as seen from Earth, has a cusp: the longitude stops and turns. Set the epicycle large (Mars) and the loops are large; set it small (Jupiter, Saturn) and they are modest. That is why Mars is the loud wanderer in the night sky, and Saturn a slow one.</p>
`,
  sources: "Ptolemy, Almagest IX.2, IX.5–6; XII.1."
},

{
  id: "v-3",
  ch: "V",
  title: "The eccentric among the planets",
  html: `
<p>The deferent’s centre is not the earth. The planet is slower at apogee, faster at perigee, as the sun was. The line of apsides — the line through earth, deferent-centre, apogee — is fixed among the stars, to a first approximation, and different for each planet. Venus’s apsides, Ptolemy finds, lie in a determined direction; that determination is one of the prettier pieces of the <em>Almagest</em>.</p>
<p>You now have three devices: concentric deferent, eccentric, epicycle. Combinations of them save the mean motions, the inequality of motion along the zodiac, and the retrogrades. They do not yet save the <em>observed times</em> of the stations as well as Ptolemy wants. For that he introduces a fourth device.</p>
`,
  sources: "Ptolemy, Almagest IX.7–11, X.1–2."
},

{
  id: "v-4",
  ch: "V",
  title: "The equant",
  html: `
<p>The equant is the construction that makes plain what a model is. It is not obvious, and it is not arbitrary: the appearances of Mars require it.</p>
<p>The planet’s epicycle-centre (the “mean planet”) does not move uniformly about the centre of the deferent. It moves uniformly about another point, the <strong>equant</strong>, as far from the deferent-centre as the deferent-centre is from the earth, and in the same line: earth, centre, equant, equally spaced. Uniform angular speed about the equant; circular path about the deferent-centre; seen from the earth.</p>
<p>Three points, two equal gaps. Motion uniform where it is not centred, centred where it is not uniform. Ptolemy does not apologise. The appearances of Mars, especially, will not be saved without it.</p>
<div class="widget" data-kind="model" data-model="equant" data-title="The equant — uniform about a point that is not the centre"></div>
<p>Set the equant offset equal to the eccentricity. Run. The equation of centre — the difference between mean (from the equant) and true (from the earth) — is now larger than the eccentric alone would give, and it is asymmetric in a way that matches Mars. Copernicus rejected this. He called it not a principle of the art, and spent a generation trying to do without it. Kepler will find that the empty focus of the ellipse <em>is</em> the equant, nearly: Ptolemy had seen, in a circle, what the ellipse would later justify.</p>
<div class="why-block">
  <h4>Status</h4>
  <p><span class="status open">Open</span> as a claim about how the heaven is built. <span class="status closed">Closed</span> as a claim about the appearances of Mars: without some device that does what the equant does, the longitudes fail. Kepler’s ellipse will be that device, with a cause. Here, possess the construction.</p>
</div>
`,
  sources: "Ptolemy, Almagest IX.5–6, X.6; Copernicus, De revolutionibus IV (on the equant); Kepler, Astronomia nova 2–4."
},

{
  id: "v-5",
  ch: "V",
  title: "Stations and retrogradations",
  html: `
<p>Ptolemy, Book XII. A station is where the apparent longitude of the planet has a turning-point: the derivative of longitude with respect to time is zero, in our language; in his, a proportion of the motions of deferent and epicycle.</p>
<p>He can predict <em>where</em> the planet will stand, and <em>how long</em> the retrograde will last, from the radii and the speeds — a computation, and one that works. The widget shows the geometry: the line of sight from earth is tangent, in a sense, to the planet’s path on the epicycle-composite. At that instant the planet neither gains nor loses longitude.</p>
<div class="widget" data-kind="model" data-model="equant" data-title="Find the stations by running the model"></div>
<p>Watch the true longitude in the readout. When it stops climbing and begins to fall, you have a station. The loop in the trail is the retrograde. Mars’s loop is fat; Jupiter’s, smaller; Saturn’s, almost a hitch. Venus’s loops are on the near side of the sun, and she is never there in the midnight sky.</p>
`,
  sources: "Ptolemy, Almagest XII.1–6."
},

{
  id: "v-6",
  ch: "V",
  title: "Build an equatorium",
  html: `
<p>James Evans, in the book that is the most useful single companion to this course, prints cut-out patterns for a paper equatorium: a Ptolemaic computing instrument on which you set the deferent, the epicycle, the equant, and <em>read a longitude off it</em>. The widget is that instrument.</p>
<p>You are not watching a demonstration. You are fitting. Set eccentricity and equant for a Mars-like wanderer (try 0.10 each, epicycle about 0.66 of the deferent). Run until you have a retrograde. The <span class="latin">opus</span> of the art is this figure, set by your own hand.</p>
<div class="widget" data-kind="model" data-model="build" data-fit="mars" data-title="The equatorium — set, run, read"></div>
<div class="remark">
  <h4>Dennis Duke’s animations</h4>
  <p>Duke’s running figures are the check for every ancient and medieval planetary model. They do not ask you to construct. This widget is built to be set wrong. Set it wrong, see the loops fail, then set it right.</p>
</div>
`,
  sources: "Evans, History and Practice of Ancient Astronomy, ch. 7 and appendix; Duke, Almagest Planetary Model Animations."
},

{
  id: "v-7",
  ch: "V",
  title: "What a Ptolemaic model is",
  html: `
<p>It is not a machine in the sky. It is a geometry from which the longitudes (and, with more work, the latitudes) follow. Its parts have names because they have jobs:</p>
<dl class="dl">
  <dt>Deferent</dt>
  <dd>Carries the epicycle around the zodiac. Mean motion.</dd>
  <dt>Epicycle</dt>
  <dd>Saves the retrogrades, and the bounded elongation of Venus and Mercury.</dd>
  <dt>Eccentric</dt>
  <dd>Saves the inequality of motion in longitude: slower at apogee.</dd>
  <dt>Equant</dt>
  <dd>Saves the remaining inequality, which a simple eccentric will not: uniform motion about a displaced point.</dd>
</dl>
<p>Each was added because the appearances required it. A device with no phenomenon does no work; a phenomenon with no device is a failure of the art.</p>
<p>Whether the heaven is <em>made of</em> these circles is the question Aquinas said this art does not settle, and Osiander said it need not even ask. The next chapter is the asking, by men who thought the question was now ripe.</p>
`,
  sources: "Ptolemy, Almagest IX–XIII, as a whole; Aquinas, ST I q.32 a.1 ad 2."
},

{
  id: "vi-1",
  ch: "VI",
  title: "Tycho’s middle way",
  html: `
<p>Tycho Brahe would not grant the earth a motion. He had looked for parallax and not found it; he had physical reasons, Ptolemy’s and his own. He had already proved, with those instruments, that the nova of 1572 and the comet of 1577 stood above the moon (<span class="xref" data-to="chg-2"></span>) — that is why anyone listened to him. He would also not grant Ptolemy’s nesting of spheres, because the comet’s path would have carried it through them if they had been solid, and because Copernicus’s arrangement of the planets was, as geometry, too good to throw away.</p>
<p>His system: the earth at rest. The sun goes around the earth. The planets go around the sun. The sphere of stars encloses the whole, centred on the earth. It is Ptolemy for the sun, Copernicus for the planets, with the annual motion attributed to the sun rather than to the earth.</p>
<p>Geometrically, Tycho and Copernicus are equivalent for the relative motions of the planets and the sun. The appearances of elongation, of retrograde, of the order of the planets, are the same. What differs is which body is at rest. Another equivalence — and now a live one, in 1588, with instruments better than Ptolemy’s and still no parallax.</p>
<div class="widget" data-kind="worlds"></div>
`,
  sources: "Tycho, De mundi aetherei recentioribus phaenomenis (1588); Gingerich, The Eye of Heaven."
},

{
  id: "vi-2",
  ch: "VI",
  title: "Copernicus",
  html: `
<p>Nicolaus Copernicus, 1473–1543. The book, <em>De revolutionibus orbium coelestium</em>, printed as he died. The unsigned preface you have met. His own dedication to Paul III is a different document: he knows the hypothesis will seem absurd, and he claims it as the more harmonious arrangement of the world.</p>
<p>The construction: the sun at rest, or nearly, at the centre. The earth a planet, turning on itself in a day, going about the sun in a year, with a third motion of the axis to keep the poles pointed (or, in later readings, a simple inertia of the axis). The planets about the sun. The moon about the earth. Retrogrades are what the earth’s passing produces: you overtake Mars, and Mars seems to back.</p>
<p>He keeps circles. He keeps epicycles — small ones, to do the work of the equant, which he will not grant. The Copernican system of the textbooks, with clean ellipses, is Kepler’s. Copernicus is still a man of the art as Ptolemy defined it, with a different rest-frame.</p>
`,
  sources: "Copernicus, De revolutionibus I.1–11, dedication; Osiander, Ad lectorem."
},

{
  id: "vi-3",
  ch: "VI",
  title: "Three systems as models",
  html: `
<p>Do not yet ask which is true. Ask what each saves, and at what cost.</p>
<div class="era">
  <b>Ptolemy</b>
  <span>Earth at rest. Each planet a deferent-plus-epicycle (and equant). Retrogrades are real motions on epicycles. Venus and Mercury tied to the sun by a shared mean. No stellar parallax expected. Cost: a separate construction for each wanderer; the equant; no common measure of the planetary distances.</span>
  <b>Copernicus</b>
  <span>Sun at rest. Earth a planet. Retrogrades are optical, from our motion. The order and relative sizes of the orbits are determined: the epicycle of an outer planet <em>is</em> the earth’s orbit, seen in that planet’s construction, and must be the same size for all. Cost: a moving earth; still no parallax (so the stars must be immensely far); small epicycles to avoid the equant; a third motion of the axis.</span>
  <b>Tycho</b>
  <span>Earth at rest. Sun about the earth; planets about the sun. All Copernican relative geometry, without a moving earth. Cost: the sun’s orbit intersects Mars’s (the spheres cannot be solid); still no parallax; a physics in which the sun hauls the planets around a resting earth.</span>
</div>
<div class="widget" data-kind="worlds"></div>
<p>The widget runs the same elongation three ways, and prints it once. Preference, if it is to be more than taste, needs a reason that is not the appearances of longitude alone — because those, Tycho and Copernicus share. Run the year and watch a retrograde arrive in all three together.</p>
`,
  sources: "Copernicus, De revolutionibus I.9–11; Tycho, as above; Ptolemy, Almagest IX."
},

{
  id: "vi-4",
  ch: "VI",
  title: "Why prefer Copernicus — the arguments he gave",
  html: `
<p>Copernicus’s reasons, in Book I, are not a new longitude of Mars. They are reasons of <em>fittingness</em> and of <em>unity</em>.</p>
<p><strong>One annual motion, not five.</strong> In Ptolemy the epicycle of each outer planet, and the deferent of each inner, is timed to the sun. That is a conspiracy. In Copernicus it is one motion, the earth’s, appearing five ways.</p>
<p><strong>The order of the planets is determined.</strong> Mercury nearest the sun, then Venus, then the earth with its moon, then Mars, Jupiter, Saturn, then the stars. Distances follow from elongations and from the retrogrades. In Ptolemy the order is traditional (or from the periods) and the distances are not given by the longitudes.</p>
<p><strong>The bounded elongation of Venus and Mercury is natural.</strong> They go around the sun, inside our path. They cannot be opposite the sun. In Ptolemy this is arranged by hand.</p>
<p><strong>The sphere of stars is at rest.</strong> The daily turning is the earth’s. The largest thing does not spin fastest.</p>
<p>These are good reasons. They are not yet a demonstration that the earth moves. They are the kind of reason Aquinas distinguished from a proof of the principle: they show that the effects agree with a principle laid down. Copernicus laid it down. Tycho refused it, and kept the effects another way.</p>
<div class="widget" data-kind="check"
  data-ask="Copernicus’s strongest structural argument is that"
  data-opts="He had better instruments than Ptolemy|The annual motions Ptolemy assigns separately to five planets become one motion of the earth|The Church required it|The equant is ugly"
  data-ans="1"
  data-why="Unity of the annual motion, and the determination of planetary distances, are the structural gains. He did not have better instruments (Tycho did). The equant he also disliked, but that is a separate fight, and he did not fully win it."></div>
`,
  sources: "Copernicus, De revolutionibus I.10; Kuhn, The Copernican Revolution, ch. 5, as a map of the arguments (not as an authority on their worth)."
},

{
  id: "vi-5",
  ch: "VI",
  title: "Rejecting the equant",
  html: `
<p>Copernicus, Book IV and the planetary books: the equant is “not a principle of the art.” Uniform circular motion is. He replaces the equant with a pair of small epicycles, or with an eccentric on an eccentric, so that every motion is uniform about its own centre.</p>
<p>The longitudes come out nearly the same. That is the point of the replacement, and its limit. He has not found a new appearance. He has found a new construction of the old one, at the cost of extra circles. Kepler will say, with some heat, that Copernicus, having rejected the equant in name, kept it in fact.</p>
<p>The fight is not aesthetic in the cheap sense. It is about what a principle of the art <em>is</em>. Ptolemy: whatever saves the appearances with the fewest devices, including a displaced centre of uniform motion. Copernicus: uniform circular motion about a centre, even if the centres multiply. Kepler: a physical cause, even if the circle dies.</p>
`,
  sources: "Copernicus, De revolutionibus IV; Kepler, Astronomia nova 2–4."
},

{
  id: "vi-6",
  ch: "VI",
  title: "Osiander, still not answered",
  html: `
<p>You now have three world-systems, two of them equivalent in the planetary appearances, the third (Ptolemy) equivalent in longitudes if not in distances. Aquinas’s sentence has been illustrated, not refuted: some other theory might explain them.</p>
<p>Osiander claimed more: that the astronomer <em>cannot</em> reach true causes, and need not. Copernicus’s dedication claims the contrary: that the more harmonious arrangement is the true one, or is to be taken as true. Duhem, in <em>To Save the Phenomena</em>, takes Osiander’s side as a philosopher of science, from Plato through Bellarmine. Gingerich, among others, takes Copernicus’s side as a historian of what Copernicus thought he was doing.</p>
<p>This course does not settle that dispute by an attribution of motive. It waits for appearances that will not be saved both ways. Two of them:</p>
<p>The <strong>phases of Venus</strong>. In Ptolemy, Venus is always roughly between the earth and the sun; her disk should be a crescent, never full. Galileo saw the full range of phases. That kills Ptolemy’s arrangement of Venus. It does not kill Tycho: in Tycho, Venus goes around the sun, and shows the same phases as in Copernicus.</p>
<p><strong>Aberration and parallax.</strong> Bradley (1728) and Bessel (1838). Those kill a resting earth. They are <span class="xref" data-ch="IX"></span>. Until then, Tycho remains a live hypothesis of the art. Honesty requires saying so.</p>
`,
  sources: "Osiander, Ad lectorem; Copernicus, dedication to Paul III; Duhem, To Save the Phenomena; Galileo, Sidereus nuncius and Letters on Sunspots (phases of Venus)."
}

]);
