/* Contemplative return layer.
   Doctrine, not skill. Nothing here is scored or gated.
   First encounter is the author's words, unglossed.
   Returns recast what the text was doing, then append.
   English of Aquinas is the Dominican Fathers. Ptolemy I.1 is rendered
   from the Greek of Heiberg. Kepler is rendered from the Latin of the
   1609 Astronomia nova. Psalms are Douay-Rheims. */
window.AstroArs = window.AstroArs || {};

(function () {
const DAY = 86400000;
const INTERVALS = [30 * DAY, 90 * DAY, 180 * DAY];

function passageHTML(p) {
  const cite = p.cite ? `<p class="passage-cite">${p.cite}</p>` : "";
  const lat = p.latin
    ? `<blockquote class="note passage-latin"><p><span class="latin">${p.latin}</span></p></blockquote>`
    : "";
  const en = p.english ? `<blockquote class="note"><p>${p.english}</p></blockquote>` : "";
  return `<div class="passage">${cite}${lat}${en}</div>`;
}

AstroArs.THEMES = {

"c-dignity": {
  honesty: "Ptolemy’s preface is a placing of the study among the sciences, not a demonstration that the heavens are divine. The physics of a fifth body is Aristotle’s, and is not proved here. What the page can give you is the order he claims: mathematics treating what is seen and yet eternal in its kind.",
  first: { passages: [{
    cite: "Ptolemy, <em>Almagest</em> I.1",
    english: "Those who have been true philosophers seem to me to have divided the theoretical part of philosophy, with good reason, into three: the theological, the physical, and the mathematical. For all things that are consist of matter and of form and of motion, none of these being observed separately in its subject, but only thought. … The first, theology, can only be grasped by thought; it is separate from perceptible things. The second, physics, is concerned with things that are always with matter that changes. The mathematical, falling between the other two, can be conceived both with and without the help of the visible, by means of imagination, and it treats of forms and motions as to quality and figure and quantity and also place, time, and the like. … We thought it fitting to train ourselves in this part, and especially in the branch that is concerned with divine and heavenly things. For this alone is conversant with the things that are always as they are; and therefore it can be itself always as it is — which is a property of science — and it is not unclear or disordered, as the physical part often is, because of the instability and obscurity of matter."
  }]},
  returns: [
    {
      recast: "Three theoretical sciences, distinguished by their objects: what is beyond matter; what is in matter and changing; what is in matter and yet treated as unchanging in kind. Astronomy is placed in the third, and as the first of the third.",
      passages: [{
        cite: "Aristotle, <em>Metaphysics</em> VI.1",
        english: "There is a science which investigates being as being. … Physics deals with things which include a principle of motion; mathematics with things which are unmovable but not separable; first philosophy with things which are both separable and unmovable."
      }]
    },
    {
      recast: "St. Thomas will name the middle sciences more carefully: they apply mathematical principles to a natural subject. Ptolemy’s ‘between’ is that application, not a third kind of being.",
      passages: [{
        cite: "St. Thomas Aquinas, <span class=\"latin\">Super Boethium De Trinitate</span> q.5 a.3 ad 6",
        english: "The middle sciences apply mathematical principles to natural things: as music applies them to sound, and astronomy to the heavens. They have a natural subject, and they demonstrate through mathematical middle terms."
      }]
    },
    {
      recast: "The dignity he claims is that the object does not change in kind, so the science can be itself always as it is. Whether the heavens are of a fifth body is a further claim, and physical. The art does not need it. It needs the motions as numbered.",
      passages: [{
        cite: "Ptolemy, <em>Almagest</em> I.1 (close)",
        english: "As to its usefulness, this science, above all others, can make men see clearly in the physical part of things, as to quality of matter in motion, and it can contribute to the theological, for it is the only one that can make a good guess at the unchanging, from the neighbourhood of the things that are always as they are, which are at once perceptible and unchanging, and are the motions and arrangements of the heavenly bodies."
      }]
    }
  ]
},

"c-save": {
  honesty: "Aquinas is not doing astronomy here. He is distinguishing two ways reason is brought to a thing, and astronomy is his example of a successful fitting that is not a demonstration of the principle. The full article is about the Trinity. This page cannot replace it.",
  first: { passages: [{
    cite: "St. Thomas Aquinas, <span class=\"latin\">Summa theologiae</span> I q.32 a.1 ad 2",
    latin: "Ad secundum dicendum quod ad aliquam rem dupliciter inducitur ratio. Uno modo, ad probandum sufficienter aliquam radicem; sicut in scientia naturali inducitur ratio sufficiens ad probandum quod motus caeli semper sit uniformis velocitatis. Alio modo inducitur ratio, non quae sufficienter probet radicem, sed quae radici iam positae ostendat congruere consequentes effectus; sicut in astrologia ponitur ratio excentricorum et epicyclorum ex hoc quod, hac positione facta, possunt salvari apparentia sensibilia circa motus caelestes; non tamen ratio haec est sufficienter probans, quia etiam forte alia positione facta salvari possent.",
    english: "Reason is brought to bear on a thing in two ways. In one way, to prove a principle sufficiently; as in natural science a sufficient reason is brought to prove that the motion of the heaven is always of uniform speed. In another way, a reason is brought which does not sufficiently prove the principle, but which shows that the effects agree with a principle already laid down; as in astronomy the theory of eccentrics and epicycles is considered as established, because thereby the sensible appearances of the heavenly movements can be explained; not, however, as if this proof were sufficient, forasmuch as some other theory might explain them."
  }]},
  returns: [
    {
      recast: "Two uses of reason: to prove a root, and to show that the fruit agrees with a root already planted. Astronomy, as he knew it, is the second. That is not a slight. It is a classification of assent.",
      passages: [{
        cite: "St. Thomas Aquinas, <span class=\"latin\">In II De caelo</span> lect. 17",
        english: "The hypotheses which they have found, by which the appearances may be saved, are not of necessity true. For perhaps the appearances concerning the stars may be saved in some other way which has not yet been found."
      }]
    },
    {
      recast: "Osiander will say something that sounds like this, and more: that the astronomer cannot reach true causes, and need not. Aquinas does not say cannot. He says: this kind of reason does not suffice to prove the root. Another kind of reason might.",
      passages: [{
        cite: "Osiander, <em>Ad lectorem</em> (1543)",
        english: "It is not necessary that these hypotheses be true, nor even probable; one thing is sufficient — that they yield calculations that agree with the observations."
      }]
    },
    {
      recast: "The eccentric and the epicycle, for the sun, are the figure in which Aquinas’s sentence can be seen: two roots, one set of fruits. Aberration and parallax are the appearance that would not be saved both ways. The article in the Summa is not about that. It is about not claiming a demonstration where you have a fitting.",
      passages: [{
        cite: "Aristotle, <em>Posterior Analytics</em> I.2",
        english: "We think we know a thing without qualification when we think we know the cause on which the fact depends, as the cause of that fact and of no other, and further that the fact could not be other than it is. … Demonstration is a syllogism productive of scientific knowledge. The premises must be true, primary, immediate, better known than and prior to the conclusion, which is further related to them as effect to cause."
      }]
    }
  ]
},

"c-kepler": {
  honesty: "Kepler’s introduction is a spiritual and a methodological document together. The physics he wants is not yet Newton’s. The page gives you his account of what he is doing. The demonstration that Mars is an ellipse is in chapters 51–59, not here.",
  first: { passages: [{
    cite: "Kepler, <em>Astronomia nova</em>, Introduction",
    english: "It is a most absurd business to enquire into the causes of the heavenly motions, if the earth is at rest. … I build a new astronomy, not of circles, but of the causes of the motions; not of the appearances, but of the body of the world. I do not hide the false steps. The way by which I have come is itself a part of what I have to teach. If anyone wishes only the result, he may skip to the last chapters. He will not then know how an astronomy is made."
  }]},
  returns: [
    {
      recast: "The book is offered as a path, including the errors. That is a claim about teaching, not only about Mars. A result without the path is a result you cannot judge.",
      passages: [{
        cite: "Kepler, <em>Astronomia nova</em> 19 (the eight minutes)",
        english: "Since the divine goodness has given us in Tycho Brahe a most diligent observer, from whose observations the error of eight minutes is shown in Ptolemy’s reckoning, it is right that we should receive with gratitude this gift of God and make use of it. … These eight minutes could not be neglected, and they have led the way to the reformation of all of astronomy."
      }]
    },
    {
      recast: "Eight minutes of arc is a quantity. Refusing to give it up is a moral act in a science. The path of Mars is not reformed by a taste for ellipses. It is reformed by a number that would not fit.",
      passages: [{
        cite: "Kepler, <em>Astronomia nova</em> 45 (the false construction, in substance)",
        english: "I had believed the distances could be constructed by a certain rule of the epicycle, and I built the oval that way. The distances did not fit. I record the error, so that no one will think the way was straight, or that the ellipse was chosen for its beauty."
      }]
    },
    {
      recast: "The causes he wants are physical: a power from the sun. Newton will make that a demonstration. Kepler makes it a programme. The liberal art can follow him as far as the ellipse and the area law. The programme is the door.",
      passages: [{
        cite: "Kepler, <em>Astronomia nova</em> 33–34, in substance",
        english: "The sun is the source of the moving power. The planet is slower when farther, faster when nearer, as a light is weaker at a distance. I do not yet say how this power is a magnetism, or a light, or a species. I say that the times must be taken from the distances, and that the circle will not serve."
      }]
    }
  ]
},

"c-psalm": {
  honesty: "The Psalms are not theorems of this art. They are why a man might want the art, once he has it, as a possession rather than a use. This page does not prove God from the sky. It puts the sky back where the prayer put it.",
  first: { passages: [{
    cite: "Psalm 103 (104):19–24, Douay-Rheims",
    latin: "Fecit lunam in tempora; sol cognovit occasum suum. Posuisti tenebras, et facta est nox; in ipsa pertransibunt omnes bestiae silvae. … Quam magnificata sunt opera tua, Domine! omnia in sapientia fecisti; impleta est terra possessione tua.",
    english: "He hath made the moon for seasons; the sun knoweth his going down. Thou hast appointed darkness, and it is night: in it shall all the beasts of the woods go about. … How great are thy works, O Lord! thou hast made all things in wisdom; the earth is filled with thy riches."
  }]},
  returns: [
    {
      recast: "The moon for seasons is a calendar-fact the art can compute. In the psalm it is not a computation. It is a making, and a time given to living things.",
      passages: [{
        cite: "Psalm 148:3–6, Douay-Rheims",
        latin: "Laudate eum, sol et luna; laudate eum, omnes stellae et lumen. Laudate eum, caeli caelorum; et aquae omnes quae super caelos sunt, laudent nomen Domini. Quia ipse dixit, et facta sunt; ipse mandavit, et creata sunt. Statuit ea in aeternum, et in saeculum saeculi; praeceptum posuit, et non praeteribit.",
        english: "Praise ye him, O sun and moon: praise him, all ye stars and light. Praise him, ye heavens of heavens: and let all the waters that are above the heavens praise the name of the Lord. For he spoke, and they were made: he commanded, and they were created. He hath established them for ever, and for ages of ages: he hath made a decree, and it shall not pass away."
      }]
    },
    {
      recast: "A decree that shall not pass away is, in the art’s language, a motion that is always as it is. Ptolemy claimed that as the dignity of the study. The psalm claims a speaker of the decree.",
      passages: [{
        cite: "Psalm 146 (147):4–5, Douay-Rheims",
        latin: "Qui numerat multitudinem stellarum, et omnibus eis nomina vocat. Magnus Dominus noster, et magnus virtus eius; et sapientiae eius non est numerus.",
        english: "Who telleth the number of the stars: and calleth them all by their names. Great is our Lord, and great is his power: and of his wisdom there is no number."
      }]
    },
    {
      recast: "Naming the stars is not the art. Numbering their motions is. The psalm puts the two in one sentence, and then says that of His wisdom there is no number. The art stops at the number it can have. The rest is not a theorem.",
      passages: [{
        cite: "Wisdom 11:21",
        latin: "Sed omnia in mensura, et numero, et pondere disposuisti.",
        english: "But thou hast ordered all things in measure, and number, and weight."
      }]
    }
  ]
},

"c-middle": {
  honesty: "Whether astronomy remains a middle science after Newton is a genuine disagreement. This course has taken a side: the quadrivium’s astronomy stops where the heavens cease to be a distinct subject. The other side is argued honestly in the Newtonian textbooks. This page is not a refutation of them. It is the placing.",
  first: { passages: [{
    cite: "St. Thomas Aquinas, <span class=\"latin\">Super Boethium De Trinitate</span> q.5 a.1 ad 3",
    latin: "Et ideo distinguitur a reliquis habitibus rationis. Et hae quidem artes liberalis dicuntur, quae ad sciendum ordinantur; illae vero quae ordinantur ad aliquam utilitatem per actionem habendam, dicuntur mechanicae sive serviles. … Et ideo etiam inter ceteras scientias artes dicuntur, quia non solum habent cognitionem, sed opus aliquod, quod est immediate ipsius rationis, ut constructionem syllogismorum, formationem orationis congruae, numerare, mensurare, melodias formare, et cursus siderum computare.",
    english: "Those arts alone are called liberal which are ordered to knowing; those which are ordered to some usefulness to be had through action are called mechanical, or servile. … And among the sciences they are called arts, because they have not only knowledge, but a certain work, which is immediately of reason itself: as the construction of syllogisms, the forming of a fitting speech, numbering, measuring, forming melodies, and computing the courses of the stars."
  }]},
  returns: [
    {
      recast: "The work of this art is a computation of courses that stays in the one who makes it. A calendar is a use. The possessed construction is the work.",
      passages: [{
        cite: "St. Thomas Aquinas, <span class=\"latin\">Summa theologiae</span> I–II q.57 a.3 ad 3",
        english: "Even in speculative matters there is something by way of work: e.g. the making of a syllogism or of a fitting speech, or the work of counting or measuring. Hence whatever habits are ordained to such like works of the reason, are called arts by a kind of comparison. … But they are liberal arts, as distinguished from those arts which are ordained to works done by the body, which arts are, in a fashion, servile, inasmuch as the body is in servile subjection to the soul, and man is free according to the soul."
      }]
    },
    {
      recast: "Joseph Hattrup’s point: the astronomer constructs geometrical models of motions. That constructing is why it is an art, and a middle one. The widget in Chapter V is that sentence made visible.",
      passages: [{
        cite: "Ptolemy, <em>Almagest</em> I.2, in substance",
        english: "We shall first set out the general hypotheses of the whole treatise, and then, beginning from the first simple motions, we shall try to give a demonstration of the rest, using as principles and foundations what is observed, and the theorems of geometry."
      }]
    },
    {
      recast: "When the same cause holds the stone and the moon, the subject is no longer the moving heavens as a kind. It is motion. That is a science. It is not the same work as computing the courses on a sphere. Both can be true. They are not the same art.",
      passages: [{
        cite: "Newton, <em>Principia</em>, General Scholium",
        english: "I have not as yet been able to discover the reason of these properties of gravity from phenomena, and I feign no hypotheses. … To us it is enough that gravity does really exist, and act according to the laws which we have explained, and abundantly serves to account for all the motions of the celestial bodies, and of our sea."
      }]
    }
  ]
}

};

function recOf(id) {
  const all = (AstroArs._contState && AstroArs._contState()) || {};
  return all[id] || null;
}
function filledReturns(theme) {
  const rs = theme.returns || [];
  let n = 0;
  for (let i = 0; i < rs.length; i++) {
    if (rs[i] && rs[i].passages && rs[i].passages.length) n = i + 1;
    else break;
  }
  return n;
}
function availableStage(theme, rec) {
  if (!rec || !rec.first) return 0;
  const filled = filledReturns(theme);
  if (!filled) return 0;
  const taken = rec.taken || [];
  let stage = Math.min(taken.length, filled);
  for (let i = stage; i < filled; i++) {
    const anchor = i === 0 ? rec.first : taken[i - 1];
    if (!anchor) break;
    if (Date.now() - anchor >= INTERVALS[i]) stage = i + 1;
    else break;
  }
  return stage;
}
AstroArs.contemplateStage = function (id) {
  const theme = AstroArs.THEMES[id];
  if (!theme) return 0;
  return availableStage(theme, recOf(id));
};
AstroArs.contemplateDue = function () {
  const out = [];
  Object.keys(AstroArs.THEMES).forEach(id => {
    const theme = AstroArs.THEMES[id];
    const rec = recOf(id);
    const avail = availableStage(theme, rec);
    const seen = rec && rec.seen != null ? rec.seen : 0;
    if (avail > seen) {
      const lesson = (AstroArs.LESSONS || []).find(l => l.contemplate === id);
      out.push({ id, title: lesson ? lesson.title : id, stage: avail });
    }
  });
  return out;
};
AstroArs.touchContemplation = function (id) {
  const theme = AstroArs.THEMES[id];
  if (!theme || !AstroArs._contSave) return;
  const all = AstroArs._contState() || {};
  const rec = all[id] || { first: 0, seen: 0, taken: [] };
  if (!rec.first) {
    rec.first = Date.now();
    if (!rec.taken) rec.taken = [];
    all[id] = rec;
    AstroArs._contSave(all);
  }
};
AstroArs.markContemplation = function (id) {
  const theme = AstroArs.THEMES[id];
  if (!theme || !AstroArs._contSave) return;
  const all = AstroArs._contState() || {};
  const rec = all[id] || { first: 0, seen: 0, taken: [] };
  if (!rec.first) rec.first = Date.now();
  const avail = availableStage(theme, rec);
  if (avail > (rec.seen || 0)) rec.seen = avail;
  if (!rec.taken) rec.taken = [];
  while (rec.taken.length < avail) rec.taken.push(Date.now());
  all[id] = rec;
  AstroArs._contSave(all);
};
function armReturnRead(root, id, stage) {
  const rec = recOf(id);
  const seen = rec && rec.seen != null ? rec.seen : 0;
  if (stage <= seen) return;
  const returns = root.querySelectorAll(".cont-return");
  const newest = returns[stage - 1];
  if (!newest) return;
  const target = newest.querySelector(".recast") || newest;
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    AstroArs.markContemplation(id);
    const btn = newest.querySelector(".cont-ack");
    if (btn) btn.remove();
    if (obs) obs.disconnect();
  };
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "cont-ack";
  btn.textContent = "I've read this return";
  newest.appendChild(btn);
  btn.addEventListener("click", finish);
  let obs = null;
  if (typeof IntersectionObserver === "function") {
    obs = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio >= 0.55) {
          finish();
          break;
        }
      }
    }, { threshold: [0.55] });
    obs.observe(target);
  }
}
AstroArs.renderContemplation = function (el, id) {
  const theme = AstroArs.THEMES[id];
  if (!theme || !el) return;
  AstroArs.touchContemplation(id);
  const rec = recOf(id);
  const stage = availableStage(theme, rec);
  let html = `<div class="contemplation">`;
  (theme.first.passages || []).forEach(p => { html += passageHTML(p); });
  for (let i = 0; i < stage; i++) {
    const r = theme.returns[i];
    if (!r) continue;
    html += `<div class="cont-return">`;
    if (r.recast) html += `<div class="recast"><p>${r.recast}</p></div>`;
    (r.passages || []).forEach(p => { html += passageHTML(p); });
    html += `</div>`;
  }
  if (theme.honesty) html += `<div class="honesty"><p>${theme.honesty}</p></div>`;
  const filled = filledReturns(theme);
  if (stage < filled) {
    html += `<p class="cont-waiting">A further passage is waiting. It will be here when its time has come.</p>`;
  } else if (filled < 3) {
    html += `<p class="cont-waiting">This theme will unfold further. The later passages are not yet written.</p>`;
  }
  html += `</div>`;
  el.innerHTML = html;
  armReturnRead(el, id, stage);
};
})();
