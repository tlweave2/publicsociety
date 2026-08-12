'use client';

import React, { useState, useEffect } from "react";

/* ────────────────────────────────────────────────────────────
   PUBLIC SOCIETY — landing page

   Everything you'll actually edit lives in the consts below.
   ──────────────────────────────────────────────────────────── */

const INFO = {
  street: "000 Example St.",        // ← swap
  city: "City, ST 00000",           // ← swap
  phone: "(000) 000-0000",          // ← swap
  instagram: "https://instagram.com/",
  reservations: "#",                 // Resy / Tock / OpenTable link
  newsletter: "#",                   // Mailchimp signup
};

// Single source of truth. Rendered in the hero strip AND in Article III.
const HOURS = [
  { days: "Sun – Wed", open: "4PM", close: "12AM" },
  { days: "Thursday", open: "4PM", close: "1AM" },
  { days: "Fri – Sat", open: "2PM", close: "2AM" },
];

const BYLAWS = [
  "Article 3 — Dress code is whatever you're wearing",
  "Article 7 — No one sits alone",
  "Article 12 — The last round is a suggestion",
  "Article 19 — The jukebox is not a democracy",
  "Article 24 — Bring someone who's never been",
];

const POURS = [
  {
    n: "i",
    name: "Cocktails",
    body: "Twelve on the list, rotated when we get bored. The bartenders will go off-menu if you tell them a mood instead of a spirit.",
    items: ["House martini", "Something with mezcal", "The one with the egg white", "Ask for a Society"],
  },
  {
    n: "ii",
    name: "Beer & Wine",
    body: "Eight taps, mostly local, one that's always a lager because someone has to be reasonable. Wine by the glass without a lecture.",
    items: ["Rotating drafts", "Cans, cold", "Red / white / orange", "Bubbles by the bottle"],
  },
  {
    n: "iii",
    name: "Zero Proof",
    body: "Made with the same care and the same glassware. Nobody should be handed a soda water and a lime as an afterthought.",
    items: ["Seedlip & tonic", "Shrub sodas", "House lemonade", "Coffee, after 8"],
  },
];

/* ── Photo slot ──────────────────────────────────────────── */
function Frame({ src, alt, caption, slot, tilt = 0, tall = false }) {
  return (
    <figure className="ps-frame" style={{ "--tilt": `${tilt}deg` }}>
      <div className={`ps-frame-img${tall ? " ps-frame-img--tall" : ""}`}>
        {src ? (
          <img src={src} alt={alt} loading="lazy" />
        ) : (
          <span className="ps-frame-slot">{slot}</span>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/* ── Section heading ─────────────────────────────────────── */
function Article({ numeral, title, children, id }) {
  return (
    <section className="ps-article" id={id}>
      <div className="ps-article-head">
        <span className="ps-eyebrow">Article {numeral}</span>
        <h2 className="ps-h2">{title}</h2>
        <hr className="ps-rule" />
      </div>
      {children}
    </section>
  );
}

export default function PublicSociety() {
  const [memberNo, setMemberNo] = useState(null);
  const [today, setToday] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [stamped, setStamped] = useState(false);

  // Member number and date are generated client-side only — a random number
  // (or a server-timezone date) would cause a hydration mismatch in Next.
  useEffect(() => {
    const n = Math.floor(1000 + Math.random() * 8999);
    setMemberNo(String(n).padStart(5, "0"));
    setToday(
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
    const t = setTimeout(() => setStamped(true), 450);
    return () => clearTimeout(t);
  }, []);

  // Scroll reveals
  useEffect(() => {
    const els = document.querySelectorAll(".ps-reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="ps-root">
      <style>{CSS}</style>

      {/* ── Nav ───────────────────────────────────────────── */}
      <header className="ps-nav">
        <a href="#top" className="ps-wordmark">
          Public&nbsp;Society
        </a>

        <button
          className="ps-burger"
          aria-expanded={navOpen}
          aria-label="Menu"
          onClick={() => setNavOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        <nav className={`ps-navlinks${navOpen ? " is-open" : ""}`}>
          <a href="#premises" onClick={() => setNavOpen(false)}>The Premises</a>
          <a href="#pour" onClick={() => setNavOpen(false)}>The Pour</a>
          <a href="#hours" onClick={() => setNavOpen(false)}>Hours</a>
          <a href={INFO.reservations} className="ps-navcta">Reserve</a>
        </nav>
      </header>

      {/* ── Hero: the charter ─────────────────────────────── */}
      <main id="top" className="ps-hero">
        <p className="ps-charter-line">Chartered · Est. MMXXV · Open to the public</p>

        <h1 className="ps-h1">
          <span>Public</span>
          <span className="ps-h1-2">Society</span>
        </h1>

        <p className="ps-lede">
          A private club.<br />
          Everyone&apos;s a member.
        </p>

        <div className={`ps-stamp${stamped ? " is-stamped" : ""}`} aria-hidden="true">
          <span className="ps-stamp-top">Admitted</span>
          <span className="ps-stamp-no">
            Member No. {memberNo ?? "—————"}
          </span>
          <span className="ps-stamp-date">{today ?? " "}</span>
        </div>

        <div className="ps-hero-hours">
          {HOURS.map((h) => (
            <div key={h.days} className="ps-hero-hours-row">
              <span>{h.days}</span>
              <i />
              <span>{h.open} – {h.close}</span>
            </div>
          ))}
        </div>

        <div className="ps-hero-actions">
          <a href={INFO.reservations} className="ps-btn">Reserve a table</a>
          <a href="#pour" className="ps-btn ps-btn--ghost">See the pour</a>
        </div>
      </main>

      {/* ── Bylaws marquee ────────────────────────────────── */}
      <div className="ps-marquee" role="presentation">
        <div className="ps-marquee-track">
          {[0, 1].map((dup) => (
            <div className="ps-marquee-set" key={dup} aria-hidden={dup === 1}>
              {BYLAWS.map((b) => (
                <span key={b}>
                  {b}
                  <i className="ps-diamond">✦</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Article I ─────────────────────────────────────── */}
      <Article numeral="I" title="The Premises" id="premises">
        <div className="ps-premises">
          <div className="ps-premises-copy ps-reveal">
            <p className="ps-body-lg">
              Two rooms, one long bar, and a patio that stays open later than it
              probably should.
            </p>
            <p>
              The front is loud on purpose — that&apos;s where the bar is, and where
              you&apos;ll end up talking to whoever&apos;s next to you. The back room is
              darker and slower, with booths built for four and regularly used
              by seven.
            </p>
            <p>
              Dogs are welcome on the patio. So are birthdays, first dates,
              breakups, and the thing where you meant to have one and stayed
              until close.
            </p>
            <a href={INFO.reservations} className="ps-link">
              Book the back room →
            </a>
          </div>

          <div className="ps-collage ps-reveal">
            <Frame slot="01" caption="The long bar" tilt={-3} tall />
            <Frame slot="02" caption="Back booths" tilt={2.5} />
            <Frame slot="03" caption="Patio, 11PM" tilt={-1.5} />
            <Frame slot="04" caption="House martini" tilt={4} tall />
          </div>
        </div>
      </Article>

      {/* ── Article II ────────────────────────────────────── */}
      <Article numeral="II" title="The Pour" id="pour">
        <div className="ps-ledger">
          {POURS.map((p) => (
            <div className="ps-ledger-col ps-reveal" key={p.name}>
              <span className="ps-ledger-n">{p.n}</span>
              <h3 className="ps-h3">{p.name}</h3>
              <p>{p.body}</p>
              <ul className="ps-ledger-list">
                {p.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="ps-note">
          Full menu changes often enough that printing it here would be a lie.
          It&apos;s on the wall when you get here.
        </p>
      </Article>

      {/* ── Article III ───────────────────────────────────── */}
      <Article numeral="III" title="The Hours" id="hours">
        <div className="ps-hours ps-reveal">
          {HOURS.map((h) => (
            <div className="ps-hours-row" key={h.days}>
              <span className="ps-hours-days">{h.days}</span>
              <span className="ps-hours-dots" />
              <span className="ps-hours-time">
                {h.open} <em>to</em> {h.close}
              </span>
            </div>
          ))}
        </div>
        <p className="ps-note">
          Kitchen closes an hour before we do. Happy hour runs 4–6, every day,
          no exceptions and no wristbands.
        </p>
      </Article>

      {/* ── Article IV ────────────────────────────────────── */}
      <Article numeral="IV" title="Admission" id="admission">
        <div className="ps-admission">
          <div className="ps-card ps-reveal">
            <span className="ps-eyebrow">Membership</span>
            <h3 className="ps-h3">Free, and slightly meaningless</h3>
            <p>
              We&apos;ll email you when something&apos;s worth showing up for — a new
              list, a late night, a party we didn&apos;t plan well. Nothing else.
            </p>
            <a href={INFO.newsletter} className="ps-btn">Get on the list</a>
          </div>

          <div className="ps-card ps-reveal">
            <span className="ps-eyebrow">Find us</span>
            <address className="ps-address">
              {INFO.street}<br />
              {INFO.city}
            </address>
            <a href={`tel:${INFO.phone.replace(/\D/g, "")}`} className="ps-link">
              {INFO.phone}
            </a>
            <a href={INFO.instagram} className="ps-link" target="_blank" rel="noreferrer">
              Instagram →
            </a>
          </div>
        </div>
      </Article>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="ps-footer">
        <hr className="ps-rule" />
        <div className="ps-footer-inner">
          <span className="ps-footer-mark">Public Society</span>
          <span className="ps-footer-meta">
            © {new Date().getFullYear()} · All members in good standing
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Styles
   ══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,600;6..96,800&family=Archivo:wght@400;500;700&family=Courier+Prime:wght@400;700&display=swap');

.ps-root {
  /* Palette — warm institutional dark, two stamp inks */
  --ink:        #14110E;
  --ink-raised: #1E1913;
  --manila:     #E9DDC3;
  --manila-dim: #9B9077;
  --stamp:      #C6402B;
  --civic:      #5A8199;
  --rule:       #38312A;

  --display: 'Bodoni Moda', Georgia, 'Times New Roman', serif;
  --body:    'Archivo', system-ui, -apple-system, sans-serif;
  --util:    'Courier Prime', ui-monospace, 'Courier New', monospace;

  --pad: clamp(20px, 5vw, 72px);
  --maxw: 1180px;

  background: var(--ink);
  color: var(--manila);
  font-family: var(--body);
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  position: relative;
}

/* Paper grain */
.ps-root::before {
  content: '';
  position: fixed; inset: 0;
  pointer-events: none; z-index: 1; opacity: .05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");
}
.ps-root > * { position: relative; z-index: 2; }

.ps-root p { margin: 0 0 1em; color: var(--manila-dim); }
.ps-root a { color: inherit; }
.ps-root *:focus-visible {
  outline: 2px solid var(--civic); outline-offset: 3px; border-radius: 1px;
}

/* ── Nav ─────────────────────────────────────────────── */
.ps-nav {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding: 20px var(--pad);
  border-bottom: 1px solid var(--rule);
  position: sticky; top: 0; z-index: 40;
  background: rgba(20,17,14,.9);
  backdrop-filter: blur(8px);
}
.ps-wordmark {
  font-family: var(--display); font-weight: 800;
  font-size: 19px; letter-spacing: .01em; text-decoration: none;
}
.ps-navlinks { display: flex; align-items: center; gap: 28px; }
.ps-navlinks a {
  font-family: var(--util); font-size: 12px;
  letter-spacing: .14em; text-transform: uppercase;
  text-decoration: none; color: var(--manila-dim);
  transition: color .2s;
}
.ps-navlinks a:hover { color: var(--manila); }
.ps-navcta {
  color: var(--manila) !important;
  border: 1px solid var(--stamp);
  padding: 7px 14px;
}
.ps-navcta:hover { background: var(--stamp); }

.ps-burger {
  display: none; flex-direction: column; gap: 4px;
  background: none; border: 0; cursor: pointer; padding: 8px;
}
.ps-burger span {
  display: block; width: 22px; height: 1.5px; background: var(--manila);
}

/* ── Hero ────────────────────────────────────────────── */
.ps-hero {
  padding: clamp(56px, 11vh, 120px) var(--pad) clamp(48px, 8vh, 88px);
  max-width: var(--maxw); margin: 0 auto;
  text-align: center; position: relative;
  /* Column flex, not normal flow: the stamp and the hours strip are both
     inline-flex (to shrink-wrap), so in normal flow they'd share a line
     and the rotated stamp would sit on top of the hours. */
  display: flex; flex-direction: column; align-items: center;
}
.ps-charter-line {
  font-family: var(--util); font-size: 11px;
  letter-spacing: .28em; text-transform: uppercase;
  color: var(--manila-dim); margin-bottom: 26px;
}
.ps-h1 {
  font-family: var(--display); font-weight: 400;
  font-size: clamp(58px, 15vw, 172px);
  line-height: .84; letter-spacing: -.02em;
  margin: 0 0 30px; display: flex; flex-direction: column;
}
.ps-h1-2 { font-style: italic; font-weight: 600; }

.ps-lede {
  font-family: var(--display); font-style: italic;
  font-size: clamp(19px, 2.6vw, 27px); line-height: 1.4;
  color: var(--manila) !important; margin: 0 0 42px;
}

/* Signature: the membership stamp */
.ps-stamp {
  display: inline-flex; flex-direction: column; align-items: center;
  gap: 3px; padding: 13px 26px 11px;
  border: 2.5px solid var(--stamp);
  box-shadow: inset 0 0 0 1px var(--stamp);
  color: var(--stamp);
  font-family: var(--util); text-transform: uppercase;
  opacity: 0; transform: scale(1.7) rotate(1deg);
  margin-bottom: 46px;
}
.ps-stamp.is-stamped {
  animation: ps-slam .34s cubic-bezier(.2,1.5,.4,1) forwards;
}
@keyframes ps-slam {
  0%   { opacity: 0;  transform: scale(1.7) rotate(1deg); }
  70%  { opacity: .95; transform: scale(.94) rotate(-8deg); }
  100% { opacity: .9; transform: scale(1) rotate(-6.5deg); }
}
.ps-stamp-top { font-size: 22px; font-weight: 700; letter-spacing: .22em; }
.ps-stamp-no  { font-size: 11px; letter-spacing: .16em; }
.ps-stamp-date{ font-size: 9.5px; letter-spacing: .2em; opacity: .75; }

.ps-hero-hours {
  display: inline-flex; flex-wrap: wrap; justify-content: center;
  gap: 8px 30px; margin-bottom: 36px;
  font-family: var(--util); font-size: 12px;
  letter-spacing: .1em; text-transform: uppercase;
  color: var(--manila-dim);
}
.ps-hero-hours-row { display: flex; align-items: center; gap: 9px; }
.ps-hero-hours-row i { width: 14px; height: 1px; background: var(--rule); }

.ps-hero-actions {
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
}

/* ── Buttons / links ─────────────────────────────────── */
.ps-btn {
  display: inline-block; text-decoration: none;
  font-family: var(--util); font-size: 12px; font-weight: 700;
  letter-spacing: .16em; text-transform: uppercase;
  padding: 13px 24px; background: var(--stamp); color: var(--manila);
  transition: transform .15s, background .2s;
}
.ps-btn:hover { transform: translateY(-2px); background: #D64B34; }
.ps-btn--ghost {
  background: none; border: 1px solid var(--rule); color: var(--manila-dim);
}
.ps-btn--ghost:hover { background: none; border-color: var(--manila-dim); color: var(--manila); }

.ps-link {
  display: inline-block; font-family: var(--util); font-size: 12.5px;
  letter-spacing: .1em; text-transform: uppercase;
  text-decoration: none; color: var(--civic);
  border-bottom: 1px solid transparent; padding-bottom: 2px;
  margin-right: 18px; transition: border-color .2s;
}
.ps-link:hover { border-color: var(--civic); }

/* ── Marquee ─────────────────────────────────────────── */
.ps-marquee {
  border-block: 1px solid var(--rule);
  padding: 15px 0; overflow: hidden; background: var(--ink-raised);
}
.ps-marquee-track { display: flex; width: max-content; animation: ps-scroll 44s linear infinite; }
.ps-marquee-set { display: flex; }
.ps-marquee-set span {
  display: inline-flex; align-items: center;
  font-family: var(--util); font-size: 12px;
  letter-spacing: .18em; text-transform: uppercase;
  color: var(--manila-dim); white-space: nowrap;
}
.ps-diamond { color: var(--stamp); margin: 0 26px; font-style: normal; }
@keyframes ps-scroll { to { transform: translateX(-50%); } }

/* ── Article shell ───────────────────────────────────── */
.ps-article {
  max-width: var(--maxw); margin: 0 auto;
  padding: clamp(64px, 10vw, 118px) var(--pad) 0;
}
.ps-article-head { margin-bottom: 46px; }
.ps-eyebrow {
  display: block; font-family: var(--util); font-size: 11px;
  letter-spacing: .3em; text-transform: uppercase;
  color: var(--stamp); margin-bottom: 12px;
}
.ps-h2 {
  font-family: var(--display); font-weight: 400;
  font-size: clamp(38px, 6.5vw, 76px); line-height: 1;
  letter-spacing: -.015em; margin: 0 0 26px;
}
.ps-h3 {
  font-family: var(--display); font-weight: 600;
  font-size: 25px; line-height: 1.15; margin: 0 0 12px;
}
.ps-rule { border: 0; border-top: 1px solid var(--rule); margin: 0; }
.ps-body-lg {
  font-family: var(--display); font-style: italic;
  font-size: clamp(21px, 2.4vw, 27px); line-height: 1.45;
  color: var(--manila) !important;
}
.ps-note {
  font-family: var(--util); font-size: 12.5px; line-height: 1.85;
  letter-spacing: .04em; color: var(--manila-dim);
  border-left: 2px solid var(--rule); padding-left: 18px;
  margin-top: 42px; max-width: 620px;
}

/* Reveals */
.ps-reveal {
  opacity: 0; transform: translateY(22px);
  transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.3,1);
}
.ps-reveal.is-in { opacity: 1; transform: none; }

/* ── Article I: premises ─────────────────────────────── */
.ps-premises {
  display: grid; grid-template-columns: 1fr 1.05fr;
  gap: clamp(32px, 5vw, 72px); align-items: start;
}
.ps-collage {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 20px; align-items: start;
}
.ps-frame {
  margin: 0; transform: rotate(var(--tilt));
  transition: transform .3s ease;
}
.ps-frame:hover { transform: rotate(0deg) scale(1.02); }
.ps-frame-img {
  aspect-ratio: 4 / 3; overflow: hidden;
  background: var(--ink-raised);
  border: 1px solid var(--rule);
  display: grid; place-items: center;
}
.ps-frame-img--tall { aspect-ratio: 3 / 4; }
.ps-frame-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ps-frame-slot {
  font-family: var(--util); font-size: 11px;
  letter-spacing: .24em; color: var(--rule);
}
.ps-frame figcaption {
  font-family: var(--util); font-size: 10.5px;
  letter-spacing: .16em; text-transform: uppercase;
  color: var(--manila-dim); margin-top: 9px;
}

/* ── Article II: ledger ──────────────────────────────── */
.ps-ledger {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0; border-top: 1px solid var(--rule);
}
.ps-ledger-col {
  padding: 34px 30px; border-right: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}
.ps-ledger-col:first-child { padding-left: 0; }
.ps-ledger-col:last-child { border-right: 0; padding-right: 0; }
.ps-ledger-n {
  display: block; font-family: var(--display); font-style: italic;
  font-size: 34px; color: var(--stamp); line-height: 1; margin-bottom: 16px;
}
.ps-ledger-list {
  list-style: none; padding: 0; margin: 20px 0 0;
  font-family: var(--util); font-size: 12.5px;
  letter-spacing: .06em; color: var(--manila-dim);
}
.ps-ledger-list li { padding: 7px 0; border-top: 1px solid var(--rule); }

/* ── Article III: hours ──────────────────────────────── */
.ps-hours { max-width: 720px; }
.ps-hours-row {
  display: flex; align-items: baseline; gap: 14px;
  padding: 20px 0; border-bottom: 1px solid var(--rule);
}
.ps-hours-days {
  font-family: var(--display); font-size: clamp(21px, 3vw, 31px);
  flex-shrink: 0;
}
.ps-hours-dots {
  flex: 1; border-bottom: 1px dotted var(--rule); transform: translateY(-5px);
}
.ps-hours-time {
  font-family: var(--util); font-size: clamp(14px, 2vw, 17px);
  letter-spacing: .1em; flex-shrink: 0;
}
.ps-hours-time em { color: var(--manila-dim); font-style: normal; font-size: .8em; }

/* ── Article IV: admission ───────────────────────────── */
.ps-admission {
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
}
.ps-card {
  border: 1px solid var(--rule); padding: 34px 30px;
  background: var(--ink-raised);
}
.ps-address {
  font-family: var(--display); font-style: normal;
  font-size: 21px; line-height: 1.5; margin-bottom: 18px;
}

/* ── Footer ──────────────────────────────────────────── */
.ps-footer {
  max-width: var(--maxw); margin: clamp(72px, 11vw, 128px) auto 0;
  padding: 0 var(--pad) 44px;
}
.ps-footer-inner {
  display: flex; justify-content: space-between; align-items: center;
  gap: 16px; flex-wrap: wrap; padding-top: 26px;
}
.ps-footer-mark { font-family: var(--display); font-weight: 800; font-size: 17px; }
.ps-footer-meta {
  font-family: var(--util); font-size: 11px;
  letter-spacing: .14em; text-transform: uppercase; color: var(--manila-dim);
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 900px) {
  .ps-premises { grid-template-columns: 1fr; }
  .ps-ledger { grid-template-columns: 1fr; }
  .ps-ledger-col { padding: 30px 0; border-right: 0; }
  .ps-admission { grid-template-columns: 1fr; }
}

@media (max-width: 680px) {
  .ps-burger { display: flex; }
  .ps-navlinks {
    position: absolute; top: 100%; left: 0; right: 0;
    flex-direction: column; align-items: stretch; gap: 0;
    background: var(--ink); border-bottom: 1px solid var(--rule);
    max-height: 0; overflow: hidden; transition: max-height .3s ease;
  }
  .ps-navlinks.is-open { max-height: 300px; }
  .ps-navlinks a {
    padding: 16px var(--pad); border-top: 1px solid var(--rule);
  }
  .ps-navcta { border: 0; border-top: 1px solid var(--rule); text-align: left; }
  .ps-hero-actions { flex-direction: column; }
  .ps-btn { text-align: center; }
  .ps-hours-row { flex-wrap: wrap; gap: 4px 14px; }
  .ps-hours-dots { min-width: 30px; }
}

/* ── Reduced motion ──────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .ps-marquee-track { animation: none; }
  .ps-stamp, .ps-stamp.is-stamped {
    animation: none; opacity: .9; transform: rotate(-6.5deg);
  }
  .ps-reveal { opacity: 1; transform: none; transition: none; }
  .ps-frame { transition: none; }
}
`;
