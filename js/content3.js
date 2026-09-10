window.AstroArs = window.AstroArs || {};
AstroArs.LESSONS = (AstroArs.LESSONS || []).concat([

{
  id: "vii-1",
  ch: "VII",
  title: "Kepler’s task",
  html: `
<p>Johannes Kepler, 1571–1630. He had Tycho’s observations of Mars — the best longitudes yet taken — and a conviction that Copernicus was right about the earth’s motion, and a further conviction that the sun was not merely at rest but was a <em>cause</em>. The <em>Astronomia nova</em> (1609) is the book of that task: to find the path of Mars, and the law of its speed, from Tycho’s numbers, without sparing a false step.</p>
<p>This course reads Kepler as a man discovering, not as a man who was right. He gets a construction wrong, and the book says so. He thinks physically, and sometimes the physics is a guess (magnetism). He destroys the circle because the numbers destroy it, not because ellipses are beautiful. That habit — marking the status of each claim — is the reason the <em>Astronomia nova</em> is usable by someone who will go on to the primary text.</p>
<blockquote class="note">
<p>He is constructing a new astronomy, not of circles, but of the causes of the motions; not of the appearances, but of the body of the world. Whether that is still the liberal art, or already physics, is a question Chapter VIII will take up. Here, follow the geometry.</p>
</blockquote>
`,
  sources: "Kepler, Astronomia nova, introduction; Donahue’s translation and selections."
},

{
  id: "vii-2",
  ch: "VII",
  title: "Thinking physically about planetary motion",
  html: `
<p>If the sun is a cause, the planet’s speed should depend on its distance from the sun. Nearer, faster; farther, slower. Kepler tries this as a rule of times: the time to traverse a small arc is as the distance. That is not yet the area law, but it is on the way.</p>
<p>He also needs a path. Copernicus’s circles, even with small epicycles, do not fit Tycho’s Mars to the accuracy Tycho had reached — about 2′ of arc. An eight-minute discrepancy remains. Eight minutes of arc is what Kepler later says he will not give up: “because they could not be neglected, these eight minutes have led the way to the reformation of all of astronomy.” That refusal is only rational because the matter is the most certain: the heavens are regular enough for eight minutes to be a fact, not noise (<span class="xref" data-to="i-1b"></span>).</p>
<p>The physical thought and the numerical shame are the two engines of the book. Neither is a Euclidean given. Both are how a middle science begins to want a cause.</p>
`,
  sources: "Kepler, Astronomia nova 32–40, 51; the eight minutes in ch. 19’s aftermath and in the introduction."
},

{
  id: "vii-3",
  ch: "VII",
  title: "The destruction of the circle",
  html: `
<p>Kepler can find the sun–Mars distances at various points of the orbit, by triangulation: the earth’s orbit used as a base, Tycho’s oppositions and other observations as the angles. The distances do not fit a circle, whether centred on the sun or eccentric.</p>
<p>He tries an oval. He tries an epicycle that would fatten the circle into a kind of ellipse-before-the-name. He gets the construction rule <em>wrong</em>: a chapter of the <em>Astronomia nova</em> is the error, left in the book. Then he finds the right rule. The distances match an ellipse with the sun at one focus.</p>
<p>That is not a guess at a pretty curve. It is the remaining oval after the circle has been measured and has failed. The focus is not yet so named in the physical sense Kepler needs; the word is Apollonius’s. The empty focus will turn out to sit where the equant sat. Ptolemy’s displaced point of uniform motion lies near where the second focus would later be found.</p>
<div class="widget" data-kind="ellipse" data-title="The circle destroyed — set the eccentricity of Mars (~0.09)"></div>
<p>Set eccentricity to 0.09, about Mars. The circle and the ellipse are nearly the same to the eye. They are not the same to Tycho’s 2′. That is why the circle survived so long, and why it had to go.</p>
<p class="qed">Q.E.D. — the orbit of Mars is not a circle</p>
`,
  sources: "Kepler, Astronomia nova 44–59; Apollonius, Conics."
},

{
  id: "vii-4",
  ch: "VII",
  title: "The ellipse, defined",
  html: `
<dl class="dl">
  <dt>Ellipse</dt>
  <dd>A conic: the locus of points the sum of whose distances to two fixed points (the foci) is constant, 2a. Equivalent: a stretched circle; a plane section of a cone.</dd>
  <dt>Focus</dt>
  <dd>One of those two points. The sun is at one. The other is empty. (The name, <span class="latin">focus</span>, “hearth,” is Kepler’s own, later than the <em>Astronomia nova</em>.)</dd>
  <dt>Eccentricity</dt>
  <dd>e = c/a, the ratio of the distance between centre and focus to the semi-major axis. Mars, about 0.093. Earth, 0.017. Venus, 0.007. The planets are very nearly circular. The table in the aftermath says so.</dd>
  <dt>True anomaly</dt>
  <dd>The angle at the sun from perihelion to the planet.</dd>
</dl>
<div class="widget" data-kind="ellipse"></div>
<p>The string construction is the definition made with the hands: two pins, a loop of string, a pencil. The string is taut; the sum of distances is the length of the loop. That is the <span class="latin">opus</span> of this lesson, as the monochord is of music.</p>
`,
  sources: "Apollonius, Conics I; Kepler, Astronomia nova 59; Kepler, Epitome of Copernican Astronomy V."
},

{
  id: "vii-5",
  ch: "VII",
  title: "The area law",
  html: `
<p>The planet does not move equal angles in equal times about the sun. It does sweep equal <em>areas</em> in equal times. That is the second law (the first, in the later numbering, being the ellipse; in the <em>Astronomia nova</em> the area law is found first, as a way of computing times, before the ellipse is confirmed).</p>
<p>Kepler reached it from the physical guess that speed is inverse to distance, plus an approximation: the area of a sector as a sum of distances. The approximation is not exact for the guess, but it is exact for the world. The law is truer than the argument that first found it. That is not rare in this art, and it is to be marked, not hidden.</p>
<div class="widget" data-kind="ellipse" data-title="Equal areas in equal times — run the sweep"></div>
<p>Run the sweep. Near perihelion the planet covers more arc; the triangle is short and fat. Near aphelion, long and thin. The areas match. The empty focus is not an equant: motion is not uniform about it. A short <em>reductio</em>, which belongs in the aftermath: if the second focus were an equant, the area law would fail. It does not. So the equant, as Ptolemy stated it, is not the second focus, though it is near.</p>
<p class="qed">Q.E.D. — equal areas, not equal angles</p>
`,
  sources: "Kepler, Astronomia nova 32–40, 59."
},

{
  id: "vii-6",
  ch: "VII",
  title: "The harmonic law",
  html: `
<p>The third law is later, in the <em>Harmonice mundi</em> (1619): the square of the period is as the cube of the mean distance, for planet compared with planet. Saturn is about 9.5 times as far as the earth and takes about 29.5 years: 29.5² ≈ 870, 9.5³ ≈ 857. The fit is the discovery.</p>
<p>This law is not in the <em>Astronomia nova</em>, and it is not needed to destroy the circle. It is needed when Newton asks what force, toward the sun, would produce these three laws together. The answer — an inverse-square — is the door out of the art. Here, possess the proportion as a fact about the system of the planets, a unity Copernicus had promised and Kepler measured.</p>
<table class="numtab">
  <thead><tr><th>Planet</th><th class="r">Period (y)</th><th class="r">Distance (AU)</th><th class="r">P² / a³</th></tr></thead>
  <tbody>
    <tr><td>Mercury</td><td class="r">0.241</td><td class="r">0.387</td><td class="r">0.987</td></tr>
    <tr><td>Venus</td><td class="r">0.615</td><td class="r">0.723</td><td class="r">1.000</td></tr>
    <tr><td>Earth</td><td class="r">1.000</td><td class="r">1.000</td><td class="r">1.000</td></tr>
    <tr><td>Mars</td><td class="r">1.881</td><td class="r">1.524</td><td class="r">1.000</td></tr>
    <tr><td>Jupiter</td><td class="r">11.86</td><td class="r">5.203</td><td class="r">0.999</td></tr>
    <tr><td>Saturn</td><td class="r">29.46</td><td class="r">9.537</td><td class="r">1.000</td></tr>
  </tbody>
</table>
<p class="figcap">P² / a³ is 1 when period is in years and distance in astronomical units. Mercury’s small departure is real; it is not needed for the law as Kepler stated it.</p>
`,
  sources: "Kepler, Harmonice mundi V.3."
},

{
  id: "vii-7",
  ch: "VII",
  title: "Aftermath",
  html: `
<p>Six short possessions, after the ellipse.</p>
<p><strong>The word “focus.”</strong> Kepler’s hearth. The sun is a hearth; the other focus is not.</p>
<p><strong>How nearly circular the orbits are.</strong> Earth’s eccentricity 0.017 means the sun is off-centre by 1.7% of the radius. The eye would not see the difference in a figure the size of this page. Tycho’s minutes of arc would.</p>
<table class="numtab">
  <thead><tr><th>Planet</th><th class="r">e</th><th class="r">Perihelion / aphelion</th></tr></thead>
  <tbody>
    <tr><td>Mercury</td><td class="r">0.206</td><td class="r">0.66</td></tr>
    <tr><td>Venus</td><td class="r">0.007</td><td class="r">0.99</td></tr>
    <tr><td>Earth</td><td class="r">0.017</td><td class="r">0.97</td></tr>
    <tr><td>Mars</td><td class="r">0.093</td><td class="r">0.83</td></tr>
    <tr><td>Jupiter</td><td class="r">0.049</td><td class="r">0.91</td></tr>
    <tr><td>Saturn</td><td class="r">0.056</td><td class="r">0.89</td></tr>
  </tbody>
</table>
<p><strong>What became of the equant.</strong> The empty focus is near the equant-point, and is not one. Uniform motion about the empty focus contradicts the area law. Ptolemy’s device remains the best circular imitation of the area law.</p>
<p><strong>The lines of apsides</strong> are not fixed forever; they move. Kepler regretted not having a cause. Newton will have one.</p>
<p><strong>The telescope</strong> is not needed for the ellipse. It is needed for the phases of Venus and the moons of Jupiter, which are the next chapter’s neighbours.</p>
<p><strong>What the <em>New Astronomy</em> teaches about discovery.</strong> Kepler leaves a false step in the path. He uses a physical guess that is better than the argument that first found it. He will not give up eight minutes of arc. The book is a record of finding, not a list of finished results.</p>
`,
  sources: "Kepler, Astronomia nova 59 and the closing chapters; Epitome V."
},

{
  id: "vii-8",
  ch: "VII",
  title: "The three laws, together",
  html: `
<ol class="demo-steps">
  <li>The planet’s path is an ellipse, with the sun at one focus.</li>
  <li>The radius from sun to planet sweeps equal areas in equal times.</li>
  <li>The square of the period is as the cube of the mean distance, planet to planet.</li>
</ol>
<p>These are the <span class="latin">opus</span> of Kepler’s astronomy as a liberal art. They are demonstrated from Tycho’s observations and from geometry, with a physical running-commentary that is not yet a demonstration. The commentary becomes a demonstration in Newton. That is why Newton is a door, and not a chapter of the same kind.</p>
<div class="widget" data-kind="ellipse"></div>
`,
  sources: "Kepler, Astronomia nova; Harmonice mundi V."
},

{
  id: "viii-1",
  ch: "VIII",
  title: "A marked door",
  html: `
<p>This chapter is not a course in the <em>Principia</em>. It is the place where astronomy, as a quadrivial art, meets the claim that the same cause is at work here and in the heavens — and where this course stops.</p>
<p>The claim is real, and it is the most consequential in the history of the art. The same tendency that makes a stone plummet holds the moon in its orbit. If that is so, the heavens are no longer a distinct object of contemplation, and the art is no longer independent of natural philosophy. It becomes applied physics: mathematical physics, which one tradition is willing to call the liberal art of astronomy grown up.</p>
<p>This course takes the other side of that disagreement, on purpose. The sibling course in music stopped before the dissolution of tonality. Astronomy stops where it stops being a <span class="latin">scientia media</span> and becomes physics, and it says why that is a real threshold. What is gained is named. What is lost is named. What lies beyond is another course. Dana Densmore’s <em>Newton’s Principia: The Central Argument</em> is the book of that course, and it is named here so that you can find the door.</p>
`,
  sources: "Newton, Principia, Definitions, Laws, I.1–3, III; Densmore, Newton’s Principia: The Central Argument; Augros, Advanced Astronomy, on mathematical physics as the grown-up form of the art."
},

{
  id: "viii-2",
  ch: "VIII",
  title: "Newton’s words, as he used them",
  html: `
<p>Do not read these words as a modern textbook uses them. Newton’s <em>quantity of matter</em>, <em>quantity of motion</em>, and <em>force</em> are not mass, momentum, and force as those books now define them, though they wear the same names. Read the Definitions.</p>
<dl class="dl">
  <dt>Quantity of matter</dt>
  <dd><span class="latin">Quantitas materiae</span>. Density and bulk conjunctly. What we call mass, but reached from the weight of a body and the density of the parts, not from an algebraic m.</dd>
  <dt>Quantity of motion</dt>
  <dd>The quantity of matter and the velocity conjunctly. Momentum, if you must; but it is a measure, not a vector in a space Newton has not named.</dd>
  <dt>Innate force of matter</dt>
  <dd><span class="latin">Vis insita</span>. A power of resisting, by which a body perseveres in its state. Inertia, as a force of a kind — which is not how a modern textbook will say it.</dd>
  <dt>Impressed force</dt>
  <dd>An action exerted on a body, to change its state. Impulse, more than a standing push.</dd>
  <dt>Centripetal force</dt>
  <dd>That by which bodies are drawn, impelled, or any way tend, toward a point as to a centre. Gravity is one species; magnetism another; the force (whatever it is) that holds the planets, a third — until Book III identifies the third with the first.</dd>
</dl>
<p>The Scholium on absolute space and time is not optional. The art of the <em>Almagest</em> could take the sphere of stars as a frame. Newton cannot. He needs a rest that is not a body. Whether he is entitled to it is a question of natural philosophy and of later physics. The <em>Principia</em> argues for it from the rotating bucket, and from the need of the laws.</p>
`,
  sources: "Newton, Principia, Definitions 1–8 and Scholium; Cohen &amp; Whitman translation."
},

{
  id: "viii-3",
  ch: "VIII",
  title: "From the ellipse to the inverse square",
  html: `
<p>Newton, Book I, Proposition 11. A body revolves in an ellipse; the force is directed to a focus; the force is inversely as the square of the distance. The demonstration is from the geometry of the ellipse and from the area law (which is Proposition 1: equal areas mean a centripetal force, and conversely).</p>
<p>This is the inverse-square law as a <em>property of elliptical motion about a focus</em>. It is not yet universal gravitation. It is a theorem of the same kind this course has been teaching: from a path and a law of speed, a force. The middle terms are still geometrical. The subject is beginning not to be.</p>
<p>Proposition 1 of Book I is the area law made general: if the force is centripetal, the areas are equal, whether the path is an ellipse or not. Kepler’s second law becomes Newton’s first dynamical theorem. That is a genuine gain of the art: what was a fact about planets is a fact about forces to a point.</p>
`,
  sources: "Newton, Principia I, Prop. 1 and Prop. 11."
},

{
  id: "viii-4",
  ch: "VIII",
  title: "The moon test",
  html: `
<p>Book III, the moon test. If the force that holds the moon is the same as weight, and if that force falls as the square of the distance, then the distance the moon “falls” from a tangent in one second can be computed from the length of a seconds-pendulum at the earth’s surface (Huygens) and from the moon’s distance in earth-radii. The number matches the astronomical fall of the moon. That is the demonstration that the same tendency is at work here and there.</p>
<div class="widget" data-kind="moontest"></div>
<p>What is gained: one physics. The stone and the moon. The tides. The precession of the equinoxes as a torque on a spinning earth. The perturbation of Saturn by Jupiter. A system of the world that is a system of causes, not only of constructions.</p>
<p>What is lost: the heavens as a distinct object. The art’s independence from natural philosophy. The right to stop at a construction that saves the appearances, without being asked the cause. Aquinas’s reservation is not refuted by the moon test — another theory of the moon’s fall might have been offered — but it is pressed hard, because the same number comes out from a stone and from a satellite. That pressure is the threshold.</p>
<div class="why-block">
  <h4>Status</h4>
  <p><span class="status closed">Closed</span>, as a proportion: the moon’s fall agrees with inverse-square weight. <span class="status open">Open</span>, if you ask what gravity <em>is</em>. Newton, in the General Scholium, refuses a hypothesis of that. The art, grown into physics, still knows a reservation. It is not Osiander’s reservation. It is a different one: the law, not the cause of the law.</p>
</div>
`,
  sources: "Newton, Principia III, Prop. 4 and Moon test; General Scholium; Huygens, Horologium oscillatorium."
},

{
  id: "viii-5",
  ch: "VIII",
  title: "Why this course stops here",
  html: `
<p>The quadrivium treats quantity as such, and then quantity applied: to sound, to the moving heavens. When the celestial/terrestrial division falls, the application is no longer to a distinct kind of motion. It is to motion as such, on the earth and off it. That is a science. It is not the same science.</p>
<p>You can go through the door. You should, if you want the <em>Principia</em>. Densmore, with Donahue’s figures, is the book that fills in the steps from the lemmas of Book I through Book III, for a reader without a professor. Collating that reading with a course that stops at Proposition 11 is itself instructive: two guides, one threshold.</p>
<p>What this course will still do, in the next chapter, is say what was settled <em>after</em>, at the level of appearances the art can still judge: what you can see, what you must borrow an instrument for, what you hold by a chain, and what is a model under revision. That last act is not a survey of later astrophysics. It is the same habit of naming the kind of assent.</p>
`,
  sources: "Aquinas, Super Boethium De Trinitate q.5 a.3; Newton, Principia III; Densmore, as above; Augros, Advanced Astronomy, stopping at Prop. 11."
},

{
  id: "ix-0",
  ch: "IX",
  title: "A second door",
  html: `
<p>A second threshold has been crossed. What follows in this chapter was reached with instruments beyond the senses and beyond ordinary aid — the telescope, the spectroscope, the heliometer — and so lies outside the art as this course has defined it.</p>
<p>It is reported here for two reasons. First, the art’s own questions are answered there: above all Osiander’s, which this course posed and could not close. Second, silence would mislead as much as overreach would. The art is entitled to know where its questions went, even when the closing of them was not its work.</p>
<p>Newton’s door (<span class="xref" data-ch="VIII"></span>) was a door into another <em>kind</em> of science. This one is a door into the same questions, asked with other instruments. Tier I below is still the art. Tiers II–IV are beyond it, reported honestly.</p>
`,
  sources: "The bound is the course’s own, from i-1b: senses and ordinary instruments."
},

{
  id: "ix-1",
  ch: "IX",
  title: "The four tiers",
  html: `
<p>An item earns its place by the kind of assent it can command, not by its date. This is the same discipline the appendix already uses for the old art, extended to four centuries of discovery. A second mark is now needed: whether the item still belongs to the art as this course defined it.</p>
<dl class="dl">
  <dt><span class="tier i">Tier I</span> · within the art</dt>
  <dd>You can make the experience yourself: a patient person, a clear sky, a stick, a string, at most binoculars. Senses and ordinary instruments. This is still the art.</dd>
  <dt><span class="tier ii">Tier II</span> · beyond the art, reported</dt>
  <dd>The reasoning is available; the measurement must be borrowed from an instrument this course does not grant as ordinary. Kepler already taught you to accept Tycho’s numbers. This is that, continued — but Tycho’s quadrant was still an ordinary instrument; Bradley’s telescope is not.</dd>
  <dt><span class="tier iii">Tier III</span> · beyond the art, reported</dt>
  <dd>Secure, but resting on a chain. A broken link would matter. The liberal-arts act is to say which link is which.</dd>
  <dt><span class="tier iv">Tier IV</span> · beyond the art, reported</dt>
  <dd>Models under revision. The anomalies they address are often measurements. The accounts are not. Marking the difference is the habit, even here.</dd>
</dl>
<p>The rule: every Tier III and Tier IV claim states what would have to be false for it to fail.</p>
`,
  sources: "This chapter’s principle; cf. the status marks of Ars Musica’s appendix."
},

{
  id: "ix-2",
  ch: "IX",
  title: "Venus and Jupiter’s moons",
  html: `
<p><span class="tier i">Tier I</span> — binoculars suffice.</p>
<p>The phases of Venus: she shows a crescent when large (near, and between us and the sun) and a nearly full disk when small (far, beyond the sun). Ptolemy’s Venus, always tied between earth and sun, cannot show a full face. Galileo saw the full range in 1610–1611. You can see it in a pair of binoculars, held steadily, when Venus is well placed.</p>
<div class="widget" data-kind="phases"></div>
<p>The moons of Jupiter: four small lights, changing place from night to night, never leaving Jupiter. A miniature of the Copernican system, next to a planet. Ptolemy has no place for them. Tycho can grant them (they go around Jupiter as the planets around the sun). They do not, by themselves, move the earth.</p>
<div class="defeater">
  <h4>What would have to be false</h4>
  <p>If Venus never showed a gibbous or full phase, Ptolemy’s arrangement of Venus could stand. If the four lights did not keep with Jupiter, they would not be moons. Both are open to a binocular and a week of nights.</p>
</div>
<div class="widget" data-kind="journal" data-tasks="venus"></div>
`,
  sources: "Galileo, Sidereus nuncius (1610); Letters on Sunspots (phases of Venus, 1613)."
},

{
  id: "ix-3",
  ch: "IX",
  title: "Aberration and parallax — Osiander answered",
  html: `
<p><span class="tier ii">Tier II</span> — the reasoning is yours; the instrument is not.</p>
<p><strong>James Bradley, 1728, aberration of starlight.</strong> The stars shift annually by up to 20″, not toward the sun (as parallax would), but toward the direction of the earth’s motion. The cause is the finite speed of light together with the earth’s velocity: the telescope must be tilted, as a man walking in rain tilts a tube to let the drops fall through. Bradley proved the earth moves. He also measured the speed of light, independently of Rømer.</p>
<p><strong>Friedrich Bessel, 1838, 61 Cygni.</strong> The shift Ptolemy said would be there if the earth moved: an annual ellipse of 0.3″, the nearest stars showing it, the far ones not. Later catalogues have multiplied the number of such stars. The demonstration is still Bessel’s: a measured annual shift, in the direction of the earth’s orbit, inversely as the distance.</p>
<div class="widget" data-kind="parallax"></div>
<p>Take these together. They settle, by experience, the exact question Ptolemy and Copernicus argued from fittingness. Bradley proves the earth moves. Bessel measures the shift. This is the honest answer to Osiander — not that saving the appearances was always foolish, but that <em>this</em> appearance eventually stopped being saveable both ways. Tycho is no longer live.</p>
<p>There is a small inconsistency, and it should be named rather than smoothed over. Osiander’s question belongs to <em>this</em> art. Bradley’s telescope and Bessel’s heliometer do not. The art posed the question and could not close it; it was closed from outside, and the art is entitled to the answer.</p>
<div class="defeater">
  <h4>What would have to be false</h4>
  <p>If the 20″ shift were toward the sun, it would be parallax, not aberration, and the nearby stars would have to be absurdly close. If no star showed a parallax at the precision now reached, either the earth does not move or the stars are farther than the nearest measured distances allow. The two measurements also have to agree with Rømer’s speed of light and with the earth’s orbital speed from Kepler. A break in that agreement would reopen the case.</p>
</div>
`,
  sources: "Bradley, 1728 (Phil. Trans.); Bessel, 1838 (61 Cygni)."
},

{
  id: "ix-4",
  ch: "IX",
  title: "The same stuff",
  html: `
<p><span class="tier ii">Tier II</span></p>
<p>Fraunhofer, 1814: dark lines in the solar spectrum, fixed, named. Kirchhoff and Bunsen, later: those lines are the signatures of elements known in the laboratory. In 1868, a line in the sun that was not then known on earth: helium, named for the sun, found on earth in 1895. The heavens are made of the same stuff. That is the observational answer to the old division between celestial and terrestrial matter — the same question the moon test had already pressed, now from a spectrum rather than a pendulum.</p>
<p>Distances Aristarchus sought with a half-moon can now be timed as an echo (radar to Venus; a laser return from the moon). The reasoning is the same: time, speed, twice the path. The instrument is borrowed.</p>
<div class="defeater">
  <h4>What would have to be false</h4>
  <p>If the solar lines did not match laboratory wavelengths (allowing for known shifts), the identification of solar elements would fail. If the radar delay to Venus did not scale with Kepler’s distances, the AU would be unhooked from the solar system’s geometry.</p>
</div>
`,
  sources: "Fraunhofer, 1814; Kirchhoff &amp; Bunsen, 1859–1860; Janssen &amp; Lockyer, 1868 (helium); Muhleman et al., radar AU; Apollo laser ranging."
},

{
  id: "ix-5",
  ch: "IX",
  title: "A chain: stars, galaxies, expansion",
  html: `
<p><span class="tier iii">Tier III</span> — held by a chain. This course does not teach the later astronomy of galaxies or of the universe as a whole. It names how such claims are reached, so you can mark them.</p>
<p>Once parallax is measured, a star’s distance is a triangle. Distance and apparent brightness then give a luminosity. If that luminosity is of the same order as the sun’s, the star is a sun. That is still geometry applied to an observation, and Bessel is the link. If parallax were systematically wrong, this fails.</p>
<p>Claims about other galaxies, and about the universe as a whole, rest on further identifications — standard candles, redshift, a microwave background. Each can be named. This art does not walk that chain. If you go on, name the link you distrust; do not distrust the conclusion in a lump.</p>
<div class="defeater">
  <h4>What would have to be false</h4>
  <p>The parallax. The step from distance and brightness to luminosity. Beyond that, whichever later identification you are asked to hold: the candle, the reading of redshift, the account of the background. Name the link.</p>
</div>
`,
  sources: "Bessel, 1838; Leavitt, 1912; Hubble, 1924–1929, as examples of later links, not as lessons of this art."
},

{
  id: "ix-6",
  ch: "IX",
  title: "Models under revision",
  html: `
<p><span class="tier iv">Tier IV</span></p>
<p>Later astronomy uses models for measurements it has not yet demonstrated a cause of. Galaxy rotation that does not match the visible mass; a distant brightness that does not match a simple slowing expansion; a microwave sky that is very uniform. The measurements, so far as they are measurements, can be marked. The accounts offered for them — extra unseen matter; a field that accelerates expansion; a rapid early expansion — are fittings. They may be right. They are not, here, demonstrated.</p>
<p>This course does not follow those tests. It leaves them as an example of the same habit: say whether you have a phenomenon, a fitting, or a demonstration.</p>
<div class="defeater">
  <h4>What would have to be false</h4>
  <p>For the <em>anomalies</em>: the measurements themselves. For the <em>accounts</em>: the tests now being run against them. Ask which are being run, and what they would show if the account failed.</p>
</div>
<p>Osiander was wrong that the astronomer can never reach a true cause of a particular appearance — the earth moves; Bessel’s shift is that appearance. He was not wrong that a successful fitting is, until the alternatives are dead, a fitting. The habit of saying so is what you take away.</p>
`,
  sources: "The living literature of those anomalies and accounts, which this page will not pretend to close."
},

{
  id: "x-1",
  ch: "X",
  title: "Number in motion",
  html: `
<p>The art was never about news from the sky. It was about number as it is found in a motion you can see. A day, a year, a month; a chord of an arc; an eccentricity; an ellipse and an area; a square of a period and a cube of a distance. The constructions were to make those numbers <em>causes of the appearances</em>, in the only sense a middle science can: mathematical middles, a natural subject. The heavens were the matter of that number because they repeat, for the most part, within the reach of the senses and ordinary instruments — the reason there is an art here at all (<span class="xref" data-to="i-1b"></span>).</p>
<p>Ptolemy, I.1, on the dignity of the study: of the three parts of theoretical philosophy, theology is about what is beyond nature and not seen, physics about what is in nature and changing, and mathematics about what is seen and yet eternal in its kind — the qualities of shapes and motions and arrangements. Astronomy, he says, is the best of the mathematical sciences, because it treats things that are eternal and divine, and because it bears on the other two. You need not take his physics of the fifth body to take his ordering of the study.</p>
`,
  sources: "Ptolemy, Almagest I.1."
},

{
  id: "x-2",
  ch: "X",
  title: "What it is for",
  html: `
<p>Not a career. Not a calendar, though it yields one. Not a physics, though it yielded one. For this:</p>
<p>That you can stand under the sky and know what you are seeing — not the name of a constellation only, but the kind of motion, and the kind of construction that saves it, and the kind of assent that construction commands.</p>
<p>That you can hear a claim about the heavens, or about anything that is sold as a model of appearances, and ask Aquinas’s question: is this a proof of the principle, or a showing that the effects agree?</p>
<p>That you have practised the difference between a phenomenon, a hypothesis, and a demonstration, on material that will not flatter you: the equant is hard, the eight minutes are small, the journal is inconvenient.</p>
<p>That number in motion has been, for a while, a contemplation and not a tool. The Psalms that set the moon for seasons, and the stars which He named, are not theorems of this art. They are why a man might want the art, once he has it, as a possession rather than a use.</p>
`,
  sources: "Psalm 104 (103), 19; Psalm 147, 4; Ptolemy, Almagest I.1; Aquinas, ST I q.32 a.1 ad 2."
},

{
  id: "x-3",
  ch: "X",
  title: "Return to the sky",
  html: `
<p>Return to the sky. The widget will name what you saw when you come in. It does not replace the seeing.</p>
<div class="widget" data-kind="sky" data-mode="full" data-title="The sky from where you stand"></div>
<div class="widget" data-kind="journal" data-tasks="stars,pole,sunset,moon,planets,gnomon,venus"></div>
<p>The palaestra is next, if you want the definitions and the constructions as a possessed skill, not only as a remembered path. The contemplations are for a month from now, and a season, and a year. The workshop is always open.</p>
`
},

{
  id: "ex-1",
  ch: "ex",
  title: "The sphere",
  drill: "sphere",
  html: `<p>Definitions and consequences of the celestial sphere, the horizon, and the poles. A fresh draw each time; a block is possessed only when a whole draw is answered rightly. Two of these ask you to find the pole on the sky, not to name it.</p>`
},
{
  id: "ex-2",
  ch: "ex",
  title: "The five propositions",
  drill: "five",
  html: `<p>Ptolemy’s opening demonstrations: the heavens spherical, the earth spherical, central, a point, and (as he argues) at rest. Know the argument, not the slogan.</p>`
},
{
  id: "ex-3",
  ch: "ex",
  title: "Chords and the year",
  drill: "chords",
  html: `<p>Sexagesimals, chords, obliquity, the two years, the gnomon.</p>`
},
{
  id: "ex-4",
  ch: "ex",
  title: "Sun and moon",
  drill: "sunmoon",
  html: `<p>Anomaly, eccentric, epicycle, equivalence, eclipse geometry, Eratosthenes. Two of these ask you to find a day on the sky, not to recall a date.</p>`
},
{
  id: "ex-5",
  ch: "ex",
  title: "The wanderers",
  drill: "planets",
  html: `<p>Deferent, epicycle, equant, stations, inner and outer planets. Two of these ask you to build rather than to answer. Knowing what an epicycle is and being able to set one are different possessions.</p>`
},
{
  id: "ex-6",
  ch: "ex",
  title: "Three worlds and Kepler",
  drill: "kepler",
  html: `<p>Ptolemy, Copernicus, Tycho; the ellipse, the area law, the harmonic law. Two of these ask you to set the ellipse with your hand, not to recite the laws.</p>`
},
{
  id: "ex-7",
  ch: "ex",
  title: "Assent",
  drill: "assent",
  html: `<p>What kind of knowledge this is: middle science, Osiander, Aquinas, the four tiers.</p>`
},
{
  id: "ex-8",
  ch: "ex",
  title: "The examination",
  drill: "exam",
  html: `<p>A mixed draw from the whole art. Possessed when a fresh fourteen are answered rightly.</p>`
},

{
  id: "lab",
  ch: "lab",
  title: "Workshop",
  html: `
<p>The sky, the models, the gnomon, the chords, the ellipse. No lesson is running. Set latitude, run a year, build an equant, stretch an ellipse.</p>
<div class="widget" data-kind="sky" data-mode="full" data-title="Naked-eye sky"></div>
<div class="widget" data-kind="model" data-model="build" data-title="Equatorium"></div>
<div class="widget" data-kind="worlds"></div>
<div class="widget" data-kind="ellipse"></div>
<div class="widget" data-kind="gnomon"></div>
<div class="widget" data-kind="chords"></div>
`
},

{
  id: "journal",
  ch: "jour",
  title: "Field journal",
  html: `
<p>Dated observations, from where you stand. The tasks are the seven of Chapter 0, and a few later ones that still belong outdoors. Write what you saw. The course will keep it on this machine.</p>
<div class="widget" data-kind="journal" data-tasks="stars,pole,starset,sunset,daylength,lag,moon,planets,gnomon,venus,algol"></div>
`
},

{
  id: "appendix",
  ch: "app",
  title: "The status of claims",
  html: `
<p>Every claim the course has asked you to hold, named by the kind of assent. Not a list of results. A list of <em>how</em> they were reached.</p>
<table class="numtab">
  <thead><tr><th>Claim</th><th>Mark</th></tr></thead>
  <tbody>
    <tr><td>Diurnal motion is spherical in appearance</td><td><span class="status closed">Closed</span></td></tr>
    <tr><td>Earth is spherical</td><td><span class="status closed">Closed</span></td></tr>
    <tr><td>Earth is at the centre of the daily turning, and a point relative to the stars</td><td><span class="status closed">Closed</span></td></tr>
    <tr><td>Earth is at rest (Ptolemy’s claim)</td><td><span class="status open">Open until IX</span> then <span class="status closed">Closed against</span></td></tr>
    <tr><td>Latitude = altitude of the pole</td><td><span class="status closed">Closed</span></td></tr>
    <tr><td>Solar anomaly saved by eccentric</td><td><span class="status closed">Closed</span></td></tr>
    <tr><td>Eccentric ≡ epicycle, for the sun</td><td><span class="status closed">Closed</span></td></tr>
    <tr><td>Ptolemaic planetary models as how the heaven is</td><td><span class="status open">Open</span></td></tr>
    <tr><td>Equant as a saver of Mars’s longitudes</td><td><span class="status closed">Closed</span></td></tr>
    <tr><td>Copernicus / Tycho as equivalent in relative motions</td><td><span class="status closed">Closed</span></td></tr>
    <tr><td>Which of those two is true, from longitudes alone</td><td><span class="status open">Open</span></td></tr>
    <tr><td>Mars’s orbit is not a circle</td><td><span class="status closed">Closed</span></td></tr>
    <tr><td>Ellipse and area law</td><td><span class="status closed">Closed</span></td></tr>
    <tr><td>Harmonic law</td><td><span class="status closed">Closed</span></td></tr>
    <tr><td>Inverse-square as property of the ellipse</td><td><span class="status closed">Closed</span></td></tr>
    <tr><td>Gravity as the cause, identified with weight</td><td><span class="status closed">Closed as proportion</span>; <span class="status open">open as to what gravity is</span></td></tr>
    <tr><td>The nova of 1572 and the comet of 1577 stand above the moon</td><td><span class="status closed">Closed</span> · within the art</td></tr>
    <tr><td>Algol’s period, timed by the eye</td><td><span class="status closed">Closed</span> · within the art</td></tr>
    <tr><td>The bright stars drift against the catalogue (Halley)</td><td><span class="status closed">Closed</span> · within the art</td></tr>
    <tr><td>Phases of Venus refute Ptolemy’s Venus</td><td><span class="tier i">I</span> <span class="status closed">Closed</span> · within the art</td></tr>
    <tr><td>Earth moves (Bradley, Bessel)</td><td><span class="tier ii">II</span> <span class="status closed">Closed</span> · beyond the art, reported</td></tr>
    <tr><td>Heavens of the same stuff (spectra)</td><td><span class="tier ii">II</span> <span class="status closed">Closed</span> · beyond the art, reported</td></tr>
    <tr><td>Stars are suns; galaxies; expansion</td><td><span class="tier iii">III</span> chain · beyond the art, reported</td></tr>
    <tr><td>Dark matter, dark energy, inflation</td><td><span class="tier iv">IV</span> models · beyond the art, reported</td></tr>
    <tr><td>Sun and moon positions in the Sky</td><td><span class="status closed">Closed</span> · under an arcminute; verified against the equinox, the solstices, and the new and full moons of 2026</td></tr>
    <tr><td>Planet positions in the Sky</td><td><span class="status closed">Closed</span> · a few arcminutes; enough to find one, not enough to time an occultation</td></tr>
    <tr><td>The Sky’s horizon, twilight and figure lines</td><td><span class="status crutch">Pedagogical</span> · drawn to teach; refraction and extinction are not modelled</td></tr>
  </tbody>
</table>
<p>The course marks its own instrument by the same rule it marks Ptolemy’s. An app that graded everything but itself would be teaching the opposite of what it says.</p>
<p>The demonstrations are reconstructed from Ptolemy, Copernicus, Kepler, Newton, and the others named in the sources. They are not a port of any living author’s prose. Where a living course was used as a map of topics, the arguments have been written from the primary texts.</p>
`
},

{
  id: "c-dignity",
  ch: "cont",
  title: "The dignity of the study",
  contemplate: "c-dignity",
  html: ``
},
{
  id: "c-save",
  ch: "cont",
  title: "To save the appearances",
  contemplate: "c-save",
  html: ``
},
{
  id: "c-kepler",
  ch: "cont",
  title: "Kepler on discovery",
  contemplate: "c-kepler",
  html: ``
},
{
  id: "c-psalm",
  ch: "cont",
  title: "The moon for seasons",
  contemplate: "c-psalm",
  html: ``
},
{
  id: "c-middle",
  ch: "cont",
  title: "The middle science",
  contemplate: "c-middle",
  html: ``
}

]);
