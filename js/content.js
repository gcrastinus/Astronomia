window.AstroArs = window.AstroArs || {};

AstroArs.CHAPTERS = [
  { id: "beg", title: "Beginning" },
  { id: "0",   num: "0",    title: "0 · Under the sky" },
  { id: "I",   num: "I",    title: "I · What kind of knowledge this is" },
  { id: "II",  num: "II",   title: "II · The sphere" },
  { id: "III", num: "III",  title: "III · The instruments of the art" },
  { id: "IV",  num: "IV",   title: "IV · Sun and moon" },
  { id: "chg", num: "V",    title: "V · What does change" },
  { id: "V",   num: "VI",   title: "VI · The wandering stars" },
  { id: "VI",  num: "VII",  title: "VII · The turn" },
  { id: "VII", num: "VIII", title: "VIII · Kepler" },
  { id: "VIII",num: "IX",   title: "IX · The door out" },
  { id: "IX",  num: "X",    title: "X · What was settled after" },
  { id: "X",   num: "XI",   title: "XI · Order" },
  { id: "ex",  title: "Exercises · the palaestra" },
  { id: "lab", title: "Workshop" },
  { id: "jour",title: "Field journal" },
  { id: "app", title: "Appendix" },
  { id: "cont",title: "Contemplations" }
];

AstroArs.LESSONS = [

{
  id: "welcome",
  ch: "beg",
  title: "How to use this course",
  html: `
<p>This is a course in the <em>liberal art of astronomy</em>, as that art was understood from the Greeks through Kepler. It is not a survey of what telescopes have found. You need no observatory and no calculus. You need a place to stand, a clear night, and the patience to let a figure be constructed in front of you.</p>
<p>The art is the application of geometry to the motion of the heavens. That motion is the most certain matter geometry can be given among things we see: it does not change, for the most part, so far as the senses and ordinary instruments reach.</p>
<p>Each lesson is short. Most of them ask you to <em>see</em> something: a motion in the sky, then a construction that saves it, then the reason the construction is as it is. The pictures are not decoration. They are to the eye what a Euclidean diagram is to the geometer: the thing, then the cause.</p>
<p>Two practical notes. First, the <strong>Sky</strong> button at the top is a computed naked-eye sky for a latitude you choose. Positions are calculated, not sketched; you can check the app against your own window. Second, the <strong>Journal</strong> is part of the work. The art begins in observation. Write dated entries. The course will keep them. You can export a copy, so a year of nights is not only this browser's.</p>
<div class="remark">
  <h4>What you will possess</h4>
  <p>By the end you should be able to say, from first principles, what this art is; why the heavens and the earth are treated as spheres; what a model is, and how two models can save the same appearances; why the sun’s motion is eccentric or epicyclic, and why those two hypotheses are equivalent; what the equant does; how Kepler destroyed the circle and found the ellipse; and where the art stops being a <span class="latin">scientia media</span> and becomes mathematical physics. You will not yet be an astrophysicist. That is another study, and this course names the door.</p>
  <p>This course teaches the mathematical skill of the art in full, and shows the doctrine of the whole faithfully enough to be believed and returned to — but the doctrine’s full demonstration lives in the books it points you toward: Ptolemy’s <em>Almagest</em>, Copernicus’s <em>De revolutionibus</em>, Kepler’s <em>Astronomia nova</em>.</p>
</div>
<p>Guided practice, if you turn it on, will bring the exercise blocks back on a spaced schedule. The contemplations are not scored. They are for returning to in a month, then a season, then a year.</p>
`
},

{
  id: "0-1",
  ch: "0",
  title: "Before any model",
  html: `
<p>The first duty is not to explain the sky. It is to look at it long enough that an explanation would have something to be an explanation <em>of</em>.</p>
<p>Ptolemy, opening the <em>Almagest</em>, does not begin with a hypothesis. He begins with what is seen: that the stars rise and set; that they keep their figures; that they turn about a pole; that the sun and moon and five wanderers do not keep their places among those figures. Geminos, writing an introductory course two centuries earlier, does the same. Sacrobosco, who was the quadrivial astronomy of every medieval university, does the same. The art has always begun outdoors.</p>
<p>This chapter asks for seven observations. They take time. A model you have not earned by watching is a picture in a book, and you will not know when it has failed.</p>
<dl class="dl">
  <dt>Phenomenon</dt>
  <dd>What appears: a motion, a place, a time, recorded from a standing-spot. Not yet a cause.</dd>
  <dt>Hypothesis</dt>
  <dd>A construction laid down in order to save the phenomena — to give a reason why they appear as they do.</dd>
  <dt>To save the appearances</dt>
  <dd><span class="latin">σῴζειν τὰ φαινόμενα</span>. To exhibit a geometry from which the seen motions follow. It is not yet to say what the heavens <em>are</em>.</dd>
</dl>
<div class="remark">
  <h4>How this chapter is to be used</h4>
  <p>Do the observations on real dates. The sky widget will show you what to expect, and that is a help, not a substitute. An entry in the journal that records only what the widget showed is not an observation. Use the widget to know <em>when</em> to go out, and the window to see.</p>
</div>
<div class="widget" data-kind="sky" data-mode="full" data-title="The sky as it is tonight"></div>
`,
  sources: "Ptolemy, Almagest I.1–2; Geminos, Introduction to the Phenomena 1–5; Sacrobosco, De sphaera 1."
},

{
  id: "0-2",
  ch: "0",
  title: "The stars turn",
  html: `
<p>Go out on a clear night. Pick a fixed spot — a chair, a mark on a railing — and three bright stars. Watch them for an hour, or return to them several times in an hour, against a tree or a ridge that does not move.</p>
<p>You will see three things, if the night is long enough.</p>
<p><strong>First:</strong> they move. Not by twinkling, and not by the eye’s wandering. Against the ridge they have gone west.</p>
<p><strong>Second:</strong> they move together. The figure they make with one another is the same figure an hour later. The whole sky has turned as one piece.</p>
<p><strong>Third:</strong> the path of each is an arc of a circle. Stars high in the south go in large arcs; stars nearer the pole, if you have a pole, go in small ones. One place in the sky does not move, or moves so little the eye cannot catch it in an hour.</p>
<div class="widget" data-kind="sky" data-mode="stars" data-title="Diurnal motion — drag to turn the hour"></div>
<p>If you are in the northern hemisphere, that unmoving place is near Polaris, at the end of the Little Dipper’s handle. The Dipper itself turns counter-clockwise about it, “a clock-hand going the wrong way.” In the south there is no bright pole-star; you must find the still point by watching.</p>
<div class="widget" data-kind="check"
  data-ask="The stars overhead, watched for an hour from one spot, appear to move"
  data-opts="From west to east, like the sun in a year|From east to west, together, on circular arcs|Each on its own path, some east, some west|Not at all, if you sit still"
  data-ans="1"
  data-why="The diurnal motion is a single turning of the whole heaven, east to west. The yearly drift of the sun among the stars is a later phenomenon, and the opposite way."></div>
<div class="widget" data-kind="journal" data-tasks="stars,pole"></div>
`,
  sources: "Ptolemy, Almagest I.3; Geminos, Introduction 4–6."
},

{
  id: "0-3",
  ch: "0",
  title: "A star does not set with the clock",
  html: `
<p>Pick a star that sets at a convenient hour, or that disappears behind a fixed ridge. From the same spot, with the eye against the same mark, time the setting on five nights.</p>
<p>Two results, if the timing is honest:</p>
<p>The <em>place</em> of setting is the same. The star meets the same notch in the ridge, night after night. The fixed stars do not wander among themselves.</p>
<p>The <em>time</em> of setting is not the same. Each night the star sets about four minutes earlier — more precisely, 3 minutes 56 seconds. A clock that strikes twenty-four equal hours is keeping the sun, not the stars.</p>
<dl class="dl">
  <dt>Sidereal day</dt>
  <dd>The time in which the sphere of the fixed stars turns once, measured by a star’s return to the same place. About 23<sup>h</sup> 56<sup>m</sup> 4<sup>s</sup> of mean solar time.</dd>
  <dt>Solar day</dt>
  <dd>The time in which the sun returns to the same place — noon to noon. The civil day of twenty-four hours.</dd>
</dl>
<p>The difference is the whole of the next observation. If the stars gain about four minutes a night on the sun, then in a year they gain a whole day: the sun has gone once around among them.</p>
<div class="widget" data-kind="journal" data-tasks="starset"></div>
`,
  sources: "Ptolemy, Almagest I.2–3; Geminos, Introduction 6."
},

{
  id: "0-4",
  ch: "0",
  title: "The sun on the horizon",
  html: `
<p>The sun does not set where it set last week. From the same standing-spot, mark the setting-place every third day for two or three weeks. A chimney, a gap in trees, a notch on a card held at arm’s length against a fence — anything fixed.</p>
<p>Between late December and late June the setting-place moves north. Between late June and late December it moves south. It never reaches due north, or due south, in the temperate latitudes. There is a definite range, and two turning-points.</p>
<dl class="dl">
  <dt>Solstice</dt>
  <dd><span class="latin">solstitium</span>, the standing of the sun: the days when the setting-place turns around. The longest and shortest days.</dd>
  <dt>Equinox</dt>
  <dd>The days when day and night are equal, and the sun rises and sets due east and due west — if your horizon is true.</dd>
  <dt>Tropic</dt>
  <dd>The turning-circle: the northernmost and southernmost paths the sun takes in the year.</dd>
</dl>
<div class="widget" data-kind="gnomon"></div>
<p>A vertical stick — a gnomon — makes the same fact by day. The noon shadow is longest at the winter turning, shortest at the summer. The ratio of shadow to stick, at noon on an equinox, is the tangent of your latitude. The measurement is waiting in <span class="xref" data-to="ii-6"></span>.</p>
<div class="widget" data-kind="journal" data-tasks="sunset,daylength,gnomon"></div>
`,
  sources: "Geminos, Introduction 1, 5–7; Sacrobosco, De sphaera 3; Ptolemy, Almagest I.10."
},

{
  id: "0-5",
  ch: "0",
  title: "The sun among the stars",
  html: `
<p>You have two clocks. The stars set four minutes earlier each night. The sun sets, on average, twenty-four hours after it last set. Therefore the gap between sunset and the rising of a given star shrinks, night by night.</p>
<p>Find a constellation that rises in the east soon after the sun sets. Time that rising every few evenings. In three weeks the constellation is well up before the sun is gone. The sun is not keeping its place among the stars. It is creeping <em>eastward</em> — the opposite way from the daily turning.</p>
<p>Plato called the daily turning “the motion of the Same,” and this slower contrary motion “the motion of the Other.” The names are metaphysical. The fact is not. In a year the sun has gone once around against the figures of the stars, always on the same road: a great circle tilted to the equator. That road is the <em>ecliptic</em>. Eclipses happen on it, which is why it has the name.</p>
<div class="widget" data-kind="sky" data-mode="sun" data-title="The sun’s place — run the year"></div>
<div class="widget" data-kind="check"
  data-ask="Relative to the fixed stars, over weeks, the sun"
  data-opts="Stays in one constellation|Creeps westward, the same way as the daily motion|Creeps eastward, the contrary way, along a tilted path|Moves north and south but not along the stars"
  data-ans="2"
  data-why="The daily motion is east to west. The sun’s yearly motion is west to east among the stars, on the ecliptic, which is tilted to the equator by about 23½°."></div>
<div class="widget" data-kind="journal" data-tasks="lag"></div>
`,
  sources: "Plato, Timaeus 36c–d, 39a–b; Geminos, Introduction 1, 7; Ptolemy, Almagest I.2, III.1."
},

{
  id: "0-6",
  ch: "0",
  title: "The moon, and the wanderers",
  html: `
<p>From the first visibility after new moon, watch her for five nights. Each night: which stars is she near? When does she set?</p>
<p>She sets forty to fifty minutes later each night. The stars set four minutes earlier. So she is moving east among the stars much faster than the sun — a circuit in about 27⅓ days, the sidereal month. She stays near the ecliptic, but not on it; she can be a few degrees north or south, which is why not every new or full moon is an eclipse.</p>
<p>Her shape changes. The terminator — the line between light and dark — is the reason you will later know she shines by another’s light.</p>
<div class="widget" data-kind="sky" data-mode="moon" data-title="The moon among the stars"></div>
<p>Five other lights do not keep their places: Mercury, Venus, Mars, Jupiter, Saturn. The Greeks called them <span class="latin">πλάνητες</span>, wanderers. They stay near the ecliptic. They usually creep east, like the sun. Sometimes they stop, go west for a time, stop again, and resume. Those standings and retreats are the hard phenomenon of the art. They wait until <span class="xref" data-ch="V"></span>.</p>
<div class="widget" data-kind="journal" data-tasks="moon,planets"></div>
<div class="remark">
  <h4>What you now have</h4>
  <p>A daily turning of the whole heaven. A yearly contrary motion of the sun on a tilted circle. A monthly contrary motion of the moon, with phases. Five wanderers on the same road, not keeping to it uniformly. No model yet. The next chapter asks what kind of knowing a model is.</p>
</div>
`,
  sources: "Ptolemy, Almagest I.2; Geminos, Introduction 8–12; Aristotle, De caelo II.12."
},

{
  id: "i-1",
  ch: "I",
  title: "Three studies of the heavens",
  html: `
<p>The word <em>astronomy</em> is used in several ways, and if we mix them we will never find the art.</p>
<p><strong>First, astronomy as a useful craft.</strong> Calendars, navigation, the hours of prayer, the date of Easter. This is noble when it is done well. It is not a liberal art. It is ordered to a work outside the one who knows: a date, a course, a table.</p>
<p><strong>Second, astronomy as natural philosophy.</strong> What the heavens <em>are</em>: whether they are of a fifth body, whether they are alive, whether the earth is a planet, whether the same physics holds here and there. Aristotle’s <em>De caelo</em> is this study. So is the question of universal gravitation. It is a higher study than the art, and it uses the art. It is not the art.</p>
<p><strong>Third, astronomy as a liberal art</strong> — which the tradition, when it is being careful, treats as a <span class="latin">scientia media</span>, a middle science. Its work is not a calendar and not a physics. Its work is a <em>construction</em>: geometrical models of motions, from which the appearances follow, demonstrated from the properties of circles, spheres, and (later) ellipses. One considers these constructions as a nature, for the sake of the truth about numbered motion, not for the sake of a voyage and not yet for the sake of saying what a heaven is made of.</p>
<div class="remark">
  <h4>A name</h4>
  <p>Ptolemy’s own title was <span class="latin">Μαθηματικὴ σύνταξις</span>, the mathematical composition. The Arabs called it the Greatest. The art is mathematics applied to what is given in sight. St. Thomas’s name for that application is the one this course keeps: a middle science, with a natural subject and mathematical middle terms.</p>
</div>
<p>This course is the third study. The other two are real. They are not first, and they are not what the quadrivium names <em>astronomia</em>.</p>
`,
  sources: "Ptolemy, Almagest I.1; Aquinas, Super Boethium De Trinitate q.5 a.3 ad 6; Aristotle, Metaphysics VI.1."
},

{
  id: "i-1b",
  ch: "I",
  title: "The matter of this art",
  html: `
<p>Geometry is one art. It can be applied to anything that has size and shape: a field, a beam, a thrown stone, a river. Why, then, is there a fourth art of the quadrivium whose matter is the heavens, and not a quadrivial art of falling bodies or of weather?</p>
<p>A construction becomes a science of its matter only where the matter holds still enough to be caught. A figure that saves this year’s solstice must save next year’s, or it is refuted. The sun returns to the same solstice; the same stars rise at the same points of the horizon; the moon returns to the same phase in the same count of days. A falling leaf does not. A river floods in season, which is regular enough to expect and not regular enough to compute. Terrestrial motions are irregular, or regular only loosely and for the most part. The heavens repeat. That repetition is what lets a figure be tested rather than merely drawn, and it is why astronomy — not mechanics, not meteorology — sits where it does in the quadrivium.</p>
<p>The regularity is not absolute. The heavens do change; the changes are few, slow, and themselves measurable. <span class="xref" data-ch="chg"></span> will treat them. For the most part, and for a lifetime of watching, the same motions return.</p>
<p>Nor is the certainty metaphysical. It reaches as far as the senses and ordinary instruments reach: a gnomon, an armillary, a quadrant, a pair of binoculars. What lies past them is another question. The course will name that threshold when it comes to it.</p>
<p>Because this is the most certain matter among things we see, a small discrepancy is information, not noise. Chapter VII will turn on eight minutes of arc. Kepler refuses them. Anyone who has not held that the heavens are regular enough to be measured that finely will not see why he refused, and will take the eight minutes for a wobble in the instrument or a looseness in the sky.</p>
<div class="widget" data-kind="check"
  data-ask="The heavens are the matter of this art because"
  data-opts="They are the noblest bodies|They are regular enough for a construction to be tested against them|They are far away, and so not mixed with earthly change|They do not change at all"
  data-ans="1"
  data-why="Nobility, distance, and absolute unchangeableness are claims of natural philosophy. The art needs only this: the appearances repeat well enough that a figure which fails next year is a false figure."></div>
`,
  sources: "Aristotle, Physics II.5 and Metaphysics VI.2; Aristotle, De caelo I.3, II.6; Ptolemy, Almagest I.1; Aquinas, Super Boethium De Trinitate q.5 a.1; Sacrobosco, De sphaera 1."
},

{
  id: "i-2",
  ch: "I",
  title: "Why this art is called liberal",
  html: `
<p>Three things make this art liberal: its <strong>end</strong>, its <strong>work</strong>, and its <strong>effect</strong>.</p>

<h4 class="sec">First: its end. It is ordered to knowing.</h4>
<p>Aristotle: we call a man free who exists for his own sake and not for another’s; so we call that science free which exists for its own sake. St. Thomas, commenting: those arts alone are called liberal which are ordered to knowing; those ordered to a usefulness had through action are mechanical, or servile.</p>
<p>So <em>liberal</em> does not mean refined, or suitable to gentlemen, or “for non-majors.” It means: <strong>ordered to knowing</strong>. An art is servile when it exists for what it produces. It is liberal when it exists for the truth it holds. A navigator’s astronomy is servile in this precise sense, however skilled. The same constructions, sought as true, are liberal.</p>

<h4 class="sec">Second: its work. The <span class="latin">opus</span> stays in the one who makes it.</h4>
<p>Why call it an <em>art</em> at all, if it is ordered to knowing? St. Thomas: the seven are called arts among the sciences because they have not only knowledge, but a certain work, which is immediately of reason itself. He lists the works: to construct a syllogism; to form a speech; to number; to measure; to form melodies; <span class="latin">et cursus siderum computare</span> — to compute the courses of the stars.</p>
<p>That work does not end in a shoe. When you have constructed the eccentric that saves the sun’s anomaly and know why the epicycle saves the same, the work is a possession of your reason. There is nothing left on the bench.</p>

<h4 class="sec">Third: its effect. It makes a judge.</h4>
<p>Anyone can see a planet go retrograde. Only the one who possesses the construction can say what has been seen, and by what. The judge is free in Aristotle’s sense: not an instrument of the art, but its master.</p>
<div class="remark">
  <h4>The quadrivium, not an elective</h4>
  <p>Arithmetic treats multitude. Geometry treats magnitude. Music treats quantity as it is found in sound. Astronomy treats quantity as it is found in the moving heavens. The last two are not electives. They are quantity applied. That is why this course is the sibling of <em>Ars Musica</em>, and why it will not dissolve itself into physics until it has said what is lost in the dissolving.</p>
</div>
`,
  sources: "Aristotle, Metaphysics I.2 (982b25–28); Aquinas, Sententia libri Metaphysicae I lect. 3; Super Boethium De Trinitate q.5 a.1 ad 3; cf. ST I–II q.57 a.3 ad 3."
},

{
  id: "i-3",
  ch: "I",
  title: "A middle science",
  html: `
<p>St. Thomas, on Boethius: the middle sciences apply mathematical principles to natural things — as music applies them to sound, and astronomy to the heavens. They have a natural subject, and they demonstrate through mathematical middle terms.</p>
<p>The pairing is the same Ptolemy stated for harmonics: hearing as matter, reason as form and cause. Here, <em>sight</em> is the matter, geometry the form. Sight is not to be despised because it is approximate; reason is not to be trusted as if it had a heaven of its own. Each does the work the other cannot do.</p>
<dl class="dl">
  <dt>Subject</dt>
  <dd>The moving lights: what is given to sight, as sound is given to hearing.</dd>
  <dt>Middle terms</dt>
  <dd>The properties of circles, spheres, chords, triangles — and, from Kepler, of the ellipse. Euclid, not Aristotle’s physics.</dd>
  <dt>Demonstration</dt>
  <dd>From those middles, that the appearances follow. <span class="latin">Q.E.D.</span> is not a decoration. It is the claim that this, and not a story, has been shown.</dd>
</dl>
<p>Joseph Hattrup’s point, which this course takes as its own: astronomy is an art precisely because the astronomer <em>constructs</em> — geometrical models of motions. The widget you will use in <span class="xref" data-ch="V"></span> is that thesis made visible. You will not be shown a model. You will build one to fit what was seen.</p>
<div class="widget" data-kind="check"
  data-ask="Astronomy is a middle science because"
  data-opts="It is easier than physics and harder than geometry|It has a natural subject and demonstrates through mathematical middles|It is useful to navigators and calendar-makers|It studies the heavens, which are above the earth"
  data-ans="1"
  data-why="The ‘middle’ is between natural philosophy and mathematics: the subject is the moving heaven (natural), the middle terms are geometrical (mathematical). Usefulness and altitude do not make a science middle."></div>
`,
  sources: "Aquinas, Super Boethium De Trinitate q.5 a.3 ad 6; Ptolemy, Harmonics I.1–2; Hattrup, The Order of Astronomy and Music to Wisdom."
},

{
  id: "i-4",
  ch: "I",
  title: "Osiander’s problem, posed",
  html: `
<p>In 1543, Copernicus’s book went out with an unsigned preface “To the Reader, concerning the hypotheses of this work.” Andreas Osiander wrote it. Copernicus did not. The preface says this:</p>
<blockquote class="note">
<p>It is the job of the astronomer to compose, by the command of reason, a history of the celestial motions. Then, since he cannot by any line of reasoning reach the true causes of these motions, he must think out and devise hypotheses, by which those motions can be correctly calculated, both for the future and the past. … It is not necessary that these hypotheses be true, nor even probable; one thing is sufficient — that they yield calculations that agree with the observations.</p>
</blockquote>
<p>That is the question this art has to answer. Not “the earth moves or it does not,” but: <em>what kind of assent does a successful hypothesis command?</em></p>
<p>It is common to answer Osiander by attributing a motive to him: that he feared a conflict between astronomy and Scripture, and wrote a disclaimer to prevent one. He may have. A motive is not an argument, and the argument is owed twice over, because <strong>Aquinas says something very close</strong>, and cannot be answered that way:</p>
<blockquote class="note">
<p><span class="latin">Ad secundum dicendum quod ad aliquam rem dupliciter inducitur ratio. Uno modo, ad probandum sufficienter aliquam radicem… Alio modo inducitur ratio, non quae sufficienter probet radicem, sed quae radici iam positae ostendat congruere consequentes effectus… Sicut in astrologia ponitur ratio excentricorum et epicyclorum ex hoc quod, hac positione facta, possunt salvari apparentia sensibilia circa motus caelestes; non tamen ratio haec est sufficienter probans, quia etiam forte alia positione facta salvari possent.</span></p>
<p>Reason is brought to bear in two ways. In one way, to prove a principle sufficiently. In another, not to prove the principle, but to show that the effects agree with a principle already laid down… As in astronomy the theory of eccentrics and epicycles is considered as established, because thereby the sensible appearances of the heavenly movements can be explained; not, however, as if this proof were sufficient, forasmuch as some other theory might explain them.</p>
</blockquote>
<p>This is <span class="latin">ST</span> I, q.32, a.1, ad 2. Aquinas is discussing whether the Trinity can be proved. Astronomy is his example of a successful fitting that is not a demonstration of the principle. This course treats that sentence as a problem it owes an answer to.</p>
<div class="why-block">
  <h4>What this chapter will not do</h4>
  <p>It will not answer Osiander yet. The answer, if there is one, has to be earned: first by seeing that two constructions can save the same appearances (the eccentric and the epicycle, <span class="xref" data-to="iv-4"></span>), then by seeing a case where they cannot (the phases of Venus, <span class="xref" data-to="ix-2"></span>), then by seeing the appearance that finally would not be saved both ways (aberration and parallax, <span class="xref" data-to="ix-3"></span>). Until then, hold the problem.</p>
</div>
`,
  sources: "Osiander, Ad lectorem (1543); Aquinas, ST I q.32 a.1 ad 2; In II De caelo lect. 17; Duhem, To Save the Phenomena."
},

{
  id: "i-5",
  ch: "I",
  title: "Demonstration, and what is less than it",
  html: `
<p>Aristotle’s <em>Posterior Analytics</em> I.2: we think we know a thing without qualification when we think we know the cause on which the fact depends, that it is the cause, and that the fact cannot be otherwise. Demonstration is a syllogism productive of that knowledge. Its principles must be true, primary, immediate, better known than the conclusion, prior to it, and causes of it.</p>
<p>Most of astronomy is less than that. That is why it is called a middle science. The appendix will mark, lesson by lesson, what kind of claim you have.</p>
<dl class="dl">
  <dt><span class="status closed">Closed</span></dt>
  <dd>Demonstrated from what you can see and from geometry you possess. The five Ptolemaic propositions about the sphere; the equivalence of eccentric and epicycle; the ellipse as the remaining oval after the circle is destroyed.</dd>
  <dt><span class="status open">Open</span></dt>
  <dd>A fitting that saves the appearances, where another fitting has not been ruled out. Osiander’s case. Aquinas’s case. Most of Ptolemy’s planetary models, taken as claims about how the heaven is.</dd>
  <dt><span class="status crutch">Pedagogical</span></dt>
  <dd>A device that teaches, which is not itself a claim of the art. The sky widget’s schematic horizon; a scaled figure in which the earth is visible.</dd>
</dl>
<p>From <span class="xref" data-ch="IX"></span> a fourth mark will be needed, because the art did not stop in 1630:</p>
<dl class="dl">
  <dt>Tier I–IV</dt>
  <dd>Assent graded by how the claim is reached, not by its date. You can make the experience; you must borrow the instrument; you hold a chain; you hold a model under revision. Every Tier III and IV claim will name what would have to be false for it to fail.</dd>
</dl>
<p>The habit of naming the kind of assent is the work this course is for.</p>
`,
  sources: "Aristotle, Posterior Analytics I.2; Aquinas, ST I q.32 a.1 ad 2; In I Post. An. lect. 4."
},

{
  id: "ii-1",
  ch: "II",
  title: "Horizon, zenith, poles",
  html: `
<p>Stand. The plane under your feet, extended until it meets the sky, is your <strong>horizon</strong>. Everything above it you can see; everything below it is cut off by the earth. If the stars lie on a sphere, and the earth is a point at its centre, the horizon is a <em>great circle</em> on that sphere: a circle whose plane passes through the centre, hence the largest circle the sphere admits.</p>
<dl class="dl">
  <dt>Zenith</dt>
  <dd>The point of the sphere straight above you: the pole of your horizon.</dd>
  <dt>Nadir</dt>
  <dd>The opposite point, under your feet.</dd>
  <dt>Celestial poles</dt>
  <dd>The two points on the sphere that do not move in the daily turning. The ends of the axis.</dd>
  <dt>Celestial equator</dt>
  <dd>The great circle midway between the poles. The daily paths of the stars are small circles parallel to it — except the stars on the equator itself, which describe a great circle.</dd>
  <dt>Great circle</dt>
  <dd>A circle on a sphere whose centre is the centre of the sphere. All others are small circles.</dd>
</dl>
<div class="widget" data-kind="sphere" data-title="Horizon, equator, ecliptic, poles"></div>
<div class="remark">
  <h4>Two ways to draw one sphere</h4>
  <p>This figure shows the sphere from outside, as a maker of globes sees it. The Sky shows it from inside, as you see it standing under it. The two are mirror images, necessarily: turn the globe one way and, from within, it turns the other. Ptolemy asks you to hold both pictures. So does this course.</p>
</div>
<p>Drag the sphere. Set your latitude. The altitude of the visible pole above your horizon is equal to your latitude. That is not a convention. It is a theorem of the figure, and it is how the art finds where you are standing.</p>
`,
  sources: "Sacrobosco, De sphaera 1–2; Geminos, Introduction 4–5; Ptolemy, Almagest I.2–3."
},

{
  id: "ii-2",
  ch: "II",
  title: "The heavens are spherical",
  html: `
<p>Ptolemy, <em>Almagest</em> I.3. The first of five propositions on which the rest of the composition stands. The arguments are from what is seen, not from a taste for spheres.</p>
<p><strong>From the diurnal paths.</strong> The stars rise, culminate, and set on circular arcs, and the same stars always rise at the same points of the horizon — the invariance this art rests on (<span class="xref" data-to="i-1b"></span>). A sphere turning about a fixed axis gives this at once. A vault of some other shape does not, unless it is rigged to imitate a sphere — which is to grant the conclusion.</p>
<p><strong>From the pole.</strong> There is a place in the sky that does not move, and the stars describe parallel circles about it, larger as they are farther from it. That is the geometry of a rotating sphere.</p>
<p><strong>From first visibility of risings.</strong> A sphere is the only figure that presents the same surface in all directions as it turns, so that the same stars can rise and set for observers at different longitudes in the same order.</p>
<p><strong>From fittingness, last and least.</strong> Of all solid figures the sphere is the most capacious for its surface, and the heavens should have the figure that holds the most. Ptolemy gives this. It is not the demonstration. The demonstration is the circular paths.</p>
<div class="why-block">
  <h4>Status</h4>
  <p><span class="status closed">Closed</span> as a description of the <em>appearances</em>: the daily motion is indistinguishable from that of a sphere. Whether the heaven is a solid sphere, or a space in which things move as if on a sphere, is natural philosophy. The art does not need the solid. It needs the geometry.</p>
</div>
<p class="qed">Q.E.D. — the diurnal motion is spherical</p>
`,
  sources: "Ptolemy, Almagest I.3; Aristotle, De caelo II.4; Sacrobosco, De sphaera 1."
},

{
  id: "ii-3",
  ch: "II",
  title: "The earth is spherical",
  html: `
<p>Ptolemy, I.4. Again from what is seen.</p>
<p><strong>From lunar eclipses.</strong> The earth’s shadow on the moon is always circular in outline. A disk would cast a circular shadow only when the sun is in particular directions; a sphere casts a circular shadow from every direction. The eclipsed moon has been seen in the east and in the west, at different hours, and the bite is round.</p>
<p><strong>From northward travel.</strong> Go north, and the southern stars sink; the northern stars rise, and the pole rises. Go south, the reverse. The change is proportional to the journey. That is travel on a sphere.</p>
<p><strong>From eastward travel.</strong> The same eclipse is reported at different hours of the day by observers east and west. The sun is higher for one than for the other at the same moment. A flat earth, with a sun that is not absurdly near, does not give this.</p>
<p><strong>From the sea.</strong> A mountain or a mast, approached from the sea, rises as if out of the water. The surface of the water is convex.</p>
<div class="widget" data-kind="eratosthenes"></div>
<p>Once the earth is a sphere, its size is a fair question. Eratosthenes: at noon on the summer solstice the sun is overhead at Syene (a well shows no shadow). At Alexandria, on the same meridian, a gnomon casts a shadow of about 1/50 of a circle (7.2°). The cities are 5,000 stadia apart. The circumference is 250,000 stadia. The widget lets you vary the angle and the distance; the form of the argument does not change.</p>
<p class="qed">Q.E.D. — the earth is spherical</p>
`,
  sources: "Ptolemy, Almagest I.4; Aristotle, De caelo II.14; Cleomedes, Lectures I.7 (Eratosthenes)."
},

{
  id: "ii-4",
  ch: "II",
  title: "The earth is in the middle, and a point",
  html: `
<p>Ptolemy, I.5–6. Two propositions, because they are not the same claim.</p>
<p><strong>In the middle.</strong> If the earth were away from the centre, toward one pole, the visible hemisphere of the sky would not be bisected by the horizon: the equator would not rise and set on a great circle, and the six zodiacal signs of a night would not be equal, at the equinox, to the six of the day. They are. If it were away from the centre in the plane of the equator, the equinoxes would not occur when they do, and the sizes of the stars at rising and setting would change with the year as we approached and receded from a part of the sphere. They do not. The remaining displacements are excluded the same way. The earth is at the centre of the diurnal turning.</p>
<p><strong>A point.</strong> The earth has size, as Eratosthenes measured. But compared with the sphere of the stars, that size does not show. Parallax of the fixed stars is not seen. The horizon always bisects the sphere. For the purposes of the starry motions, the earth is a point. (The moon is near enough that the earth is <em>not</em> a point: lunar parallax is measurable. That is a later instrument, not a contradiction.)</p>
<div class="why-block">
  <h4>Status — hold this carefully</h4>
  <p><span class="status closed">Closed</span>: the earth is at the centre of the <em>diurnal</em> turning, and is as a point relative to the stars. <span class="status open">Open</span>, at this stage of the art: whether the earth is at rest at the centre of the <em>planetary</em> motions, or whether those motions can be saved by putting the earth in motion. Ptolemy will argue rest. Copernicus will argue the other construction. Do not settle that question here.</p>
</div>
<p class="qed">Q.E.D. — central, and a point, for the daily sphere</p>
`,
  sources: "Ptolemy, Almagest I.5–6."
},

{
  id: "ii-5",
  ch: "II",
  title: "The earth does not move — as Ptolemy argues it",
  html: `
<p>Ptolemy, I.7. He knows the Pythagorean suggestion that the earth turns. He argues against it from what a turning earth would do to the air and to the clouds and to falling bodies: they would be left behind. He also argues that a translation of the earth would show in the stars, and does not.</p>
<p>The second argument is the serious one. It is the argument from stellar parallax, in a negative form: if the earth went around the sun at a distance large enough to matter, the stars would shift against one another in a year. They do not — <em>to the naked eye, with Ptolemy’s instruments</em>.</p>
<p>The first argument (clouds left behind) is a physical argument, and it belongs to natural philosophy. It assumes that the air is not carried with the earth. That assumption is not a theorem of this art.</p>
<div class="why-block">
  <h4>Status</h4>
  <p><span class="status open">Open</span> as a physical claim. <span class="status closed">Closed</span> as a claim about the appearances Ptolemy could measure: no annual parallax was seen, so any motion of the earth must be either absent or too small for those instruments. Bessel will measure it in 1838. Bradley will already have found the earth’s motion another way, by aberration, in 1728. Those are <span class="xref" data-ch="IX"></span>. Here, learn Ptolemy’s argument as he made it. A man who cannot state the case for rest is not ready to leave it.</p>
</div>
<div class="widget" data-kind="check"
  data-ask="Ptolemy’s best astronomical reason for a resting earth is that"
  data-opts="The Bible says so|Falling bodies would be left behind|No annual shift of the stars is observed|Spheres are the more perfect figure"
  data-ans="2"
  data-why="The physical argument from falling bodies is the one he leans on, but the strictly astronomical one is the absence of parallax. Fittingness of spheres is not this proposition."></div>
`,
  sources: "Ptolemy, Almagest I.7; Copernicus, De revolutionibus I.5–8."
},

{
  id: "ii-6",
  ch: "II",
  title: "Latitude is the altitude of the pole",
  html: `
<p>A theorem, not a definition.</p>
<p>Your <strong>latitude</strong> is the arc of the meridian from the equator to your zenith — how far you stand from the earth’s equator. The <strong>altitude of the pole</strong> is the arc of the same meridian from the horizon to the celestial pole.</p>
<p>Those two arcs are equal. The celestial equator is 90° from the pole. Your horizon is 90° from your zenith. The angle between zenith and equator is therefore the angle between horizon and pole. Inspect the sphere until this is not a formula but a seen equality.</p>
<div class="widget" data-kind="sphere"></div>
<p>At the terrestrial equator the pole is on the horizon. At the terrestrial pole the celestial pole is at the zenith, and the stars do not rise or set: they go in circles parallel to the horizon. In between, some stars are always up (the circumpolar), some always down, and some rise and set.</p>
<p>The gnomon at noon on the equinox gives the same number another way. The sun is then on the equator, so its zenith-distance at noon is your latitude, and the ratio of shadow to stick is the tangent of that angle.</p>
`,
  sources: "Sacrobosco, De sphaera 2–3; Ptolemy, Almagest I.2, II.6; Geminos, Introduction 5, 16."
},

{
  id: "ii-7",
  ch: "II",
  title: "The two prime movements",
  html: `
<p>Everything so far is one turning: the sphere of the stars, east to west, in a sidereal day, about the poles of the equator.</p>
<p>The sun does not keep up. It slips east along a second great circle, the ecliptic, tilted to the equator by about 23;51° in Ptolemy’s measure (about 23;44° in ours). That tilt is the <strong>obliquity of the ecliptic</strong>. It is why there are seasons, why the sun’s noon altitude changes, why the tropic circles exist, why the arctic circle is what it is at a given latitude.</p>
<dl class="dl">
  <dt>Equinoxes</dt>
  <dd>The two intersections of ecliptic and equator. The sun, crossing, makes day and night equal.</dd>
  <dt>Solstices</dt>
  <dd>The two points of the ecliptic farthest from the equator. The sun, arriving, stands in its northing or southing.</dd>
  <dt>Colures</dt>
  <dd>The two great circles through the poles and the equinoxes, and through the poles and the solstices. They quarter the sphere.</dd>
</dl>
<p>Ptolemy treats these two movements first, as the frame on which every later motion is hung. The planets and the moon stay near the ecliptic; their difficulties are difficulties <em>along</em> that road, and of small departures from it.</p>
<div class="widget" data-kind="sky" data-mode="sun" data-title="Equator and ecliptic in the sky"></div>
`,
  sources: "Ptolemy, Almagest I.8–10; Sacrobosco, De sphaera 2; Geminos, Introduction 5."
},

{
  id: "iii-1",
  ch: "III",
  title: "Sexagesimals",
  html: `
<p>The Babylonians divided the circle into 360 degrees, the degree into 60 minutes, the minute into 60 seconds. Ptolemy inherited this, and with it a way of writing fractions: a number is a row of sixties, not a decimal.</p>
<p>We write 23;51,20° for 23 + 51/60 + 20/3600 degrees. The semicolon marks the units; commas mark the sexagesimal places. Computation with these is the same as with hours and minutes, because it is the same system.</p>
<p>Why 360? Because 360 is divisible by 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180 — the factors a geometer actually needs when he halves arcs and takes thirds of a circle. A decimal circle of 100 would be a nuisance in this art.</p>
<div class="remark">
  <h4>A practical possession</h4>
  <p>You need to be able to add, subtract, and take a simple multiple of sexagesimal quantities. 15° of the equator is one hour of the daily turning. 1° is four minutes. 15′ of arc is one minute of time. That last is why a star sets about four minutes earlier each night: the sun has fallen behind by about 1°.</p>
</div>
<div class="widget" data-kind="check"
  data-ask="15° of the daily turning is"
  data-opts="One minute of time|Four minutes of time|One hour of time|A whole day"
  data-ans="2"
  data-why="The sphere turns 360° in about 24 hours, so 15° in one hour, and 1° in four minutes of time."></div>
`,
  sources: "Ptolemy, Almagest I.10; Van Brummelen, Heavenly Mathematics, ch. 1."
},

{
  id: "iii-2",
  ch: "III",
  title: "The table of chords",
  html: `
<p>To compute on a sphere you must know, from an arc, the straight line that subtends it. Ptolemy’s instrument for this is the <strong>chord</strong>.</p>
<p>He takes a circle of diameter 120 — so that the radius is 60, a convenient sexagesimal. The chord of an arc is the length of the straight line joining its ends, in those units. In modern language: crd θ = 120 sin(θ/2). You will not need that formula if you build the table as he did.</p>
<p><strong>Known chords from Euclid.</strong> The hexagon: crd 60° = 60 (the radius). The square: crd 90° = 60√2. The equilateral triangle: crd 120° = 60√3. The pentagon: crd 72° from Elements XIII. The half of 72° is 36°.</p>
<p><strong>Ptolemy’s theorem</strong> (Almagest I.10): in a cyclic quadrilateral, the product of the diagonals equals the sum of the products of the opposite sides. The demonstration is the figure below. This is the theorem that yields the chord of a difference. With <em>AD</em> a diameter, the same quadrilateral gives crd(α − β) from crd α, crd β and the diameter 120: crd(α − β) = (crd α · crd(180° − β) − crd β · crd(180° − α)) / 120. Halving then gives crd 12°, crd 6°, crd 3°, crd 1½°. crd 1° cannot be constructed; it is bounded and interpolated.</p>
<div class="widget" data-kind="proof" data-fig="ptolemy"></div>
<div class="widget" data-kind="proof" data-fig="crddiff"></div>
<div class="widget" data-kind="proof" data-fig="crdhalf"></div>
<div class="widget" data-kind="chords"></div>
<div class="why-block">
  <h4>Status</h4>
  <p><span class="status closed">Closed</span> from Euclid and Ptolemy’s theorem, for every chord reached by difference and half. <span class="status crutch">Pedagogical</span> for crd 1°, which is bounded, not derived.</p>
</div>
<p>The table is a tool you keep, the way a geometer keeps a compass. Later lessons will ask for a chord without apology.</p>
<p class="qed">Q.E.D. — the table of chords, from Euclid and Ptolemy’s theorem</p>
`,
  sources: "Ptolemy, Almagest I.10–11; Euclid, Elements IV, VI.D, XIII; Van Brummelen, Heavenly Mathematics, ch. 2."
},

{
  id: "iii-3",
  ch: "III",
  title: "The obliquity",
  html: `
<p>The arc between the tropics is twice the obliquity. Ptolemy measures it with a meridian circle and a gnomon, or with an armillary, at the solstices. He finds 47;42,40°, hence an obliquity of 23;51,20°.</p>
<p>The modern value is about 23;26°. The difference is real: the obliquity changes slowly. For the art as Ptolemy practised it, 23;51,20° is the number. For checking the sky widget against your noon shadow, use the present value. The demonstration does not care which, once the number is measured.</p>
<p>From the obliquity, by spherical triangles, one computes: the declination of the sun from its longitude; the length of daylight at a given latitude; the rising-times of the signs. The rule that does it is Menelaos.</p>
<div class="widget" data-kind="gnomon"></div>
`,
  sources: "Ptolemy, Almagest I.12, I.14–16."
},

{
  id: "iii-4",
  ch: "III",
  title: "Menelaos",
  html: `
<p>The hard step is not a planet. It is a transversal of great circles on a sphere.</p>
<p><strong>Menelaos, plane.</strong> A transversal cuts the three sides of a triangle (produced if needed). Then a certain product of ratios of segments equals 1. The figure computes it: drag a point and the product stays 1.</p>
<div class="widget" data-kind="proof" data-fig="menelaos-plane"></div>
<p class="qed">Q.E.D. — Menelaos, plane</p>
<p><strong>Menelaos, spherical.</strong> The same figure, drawn in great circles on a sphere. The “segments” are now arcs, and the ratios are chords of twice those arcs: crd(2 AD)/crd(2 DB) · crd(2 BE)/crd(2 EC) · crd(2 CF)/crd(2 FA) = 1. That is the rule by which Ptolemy moves from a known arc to an unknown one, on the sphere of the heavens.</p>
<div class="widget" data-kind="proof" data-fig="menelaos-sphere"></div>
<p class="qed">Q.E.D. — Menelaos, spherical</p>
<p>Van Brummelen’s remark, which is the right spirit: this is not a formula to survive. It is a historical art with its own beauty. The Islamic astronomers reworked it into the rule of four quantities and the spherical law of sines. You may use the sine law if you have it; you should see once that Ptolemy did not need it.</p>
<div class="remark">
  <h4>What you actually need</h4>
  <p>Given the sun’s longitude, find its declination: a right spherical triangle with the obliquity as one side. Given latitude and declination, find the length of day: another. The widget is the figure; the table of chords is the arithmetic. Together they are the instrument of <span class="xref" data-ch="IV"></span>.</p>
</div>
`,
  sources: "Ptolemy, Almagest I.13–16; Van Brummelen, Heavenly Mathematics, chs. 3–4."
},

{
  id: "iii-5",
  ch: "III",
  title: "Where you stand",
  html: `
<p>A <strong>terrestrial parallel</strong> is a small circle of the earth, parallel to the equator: the locus of a given latitude. Along it, the sky is the same in this sense: the same stars are circumpolar, the same longest day is had, the pole stands at the same height.</p>
<p>Ptolemy computes, for each climate (a belt named by the length of the longest day), the rising-times of the signs, the height of the pole, and the ratios of gnomon to shadow at the turnings. Alexandria, Rhodes, the Hellespont, the Borysthenes: a table of the inhabited world as a table of the sky.</p>
<p>What to take from the table is this: a place on earth is a way of standing under the sphere. Latitude is that standing, not a label. Change latitude, and the ecliptic stands up or lies down, the arctic circle grows or shrinks, and some stars you had never seen come over the southern horizon.</p>
<div class="widget" data-kind="sky" data-mode="full" data-title="Change latitude; the heaven changes"></div>
`,
  sources: "Ptolemy, Almagest II.1–6; Sacrobosco, De sphaera 3; Geminos, Introduction 16."
}

];
