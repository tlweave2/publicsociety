'use client';

import React, { useState, useEffect } from "react";

/* ────────────────────────────────────────────────────────────
   PUBLIC SOCIETY BAR & LOUNGE — Ceres, California

   Everything you'll actually edit lives in the consts below.
   ──────────────────────────────────────────────────────────── */

const INFO = {
  street: "805 4th Street",
  city: "Ceres, CA 95307",
  phone: "(209) 538-1942",
  instagram: "https://instagram.com/publicsocietylounge",
  instagramHandle: "@publicsocietylounge",
  facebook: "https://facebook.com/",
  // Resy / Tock / OpenTable link. Until it's set, reservation buttons fall
  // back to the phone number rather than going nowhere.
  reservations: "",
  // Google Form for employment applications. Empty = the Careers section
  // shows a "positions posted soon" state instead of a dead button.
  careersForm: "",
  // Mailing-list endpoint (Mailchimp form action, etc.). Empty = the footer
  // signup is replaced by an Instagram follow prompt.
  newsletter: "",
};

const HOURS = [
  { days: "Tuesday – Thursday", time: "4:00PM – 12:00AM" },
  { days: "Friday – Saturday", time: "4:00PM – 2:00AM" },
  { days: "Sunday", time: "4:00PM – 10:00PM" },
  { days: "Monday", time: "Closed", closed: true },
];

const PILLARS = [
  {
    icon: "martini",
    title: "Craft Cocktails",
    body: "Intentional drinks. Quality ingredients. Unforgettable sips.",
  },
  {
    icon: "disco",
    title: "The Experience",
    body: "Dim lights, high energy, and a vibe like no other.",
  },
  {
    icon: "sparkle",
    title: "Events & Nightlife",
    body: "Live music, DJ sets, and curated events that keep the energy just right.",
  },
];

/* Media lives in public/. See docs/media.md for the file list and specs. */
const MEDIA = {
  // The hero is a still image until this is set. When the walkthrough video is
  // ready, drop it at public/video/walkthrough.mp4 and set this to
  // "/video/walkthrough.mp4" — heroImage then becomes its poster frame.
  heroVideo: "",
  heroImage: "/images/interior.jpg",
  storefront: "/images/storefront.jpg",
  vip: "/images/bottle-service.jpg",
};

// basePath does not rewrite plain src attributes, so asset URLs are prefixed
// here. Inlined at build time.
const asset = (path) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

/* ── Icons ───────────────────────────────────────────────── */
const ICONS = {
  martini: (
    <>
      <path d="M6 8h20L16 20z" />
      <path d="M16 20v8" />
      <path d="M11 30h10" />
      <circle cx="23" cy="5" r="2" />
    </>
  ),
  disco: (
    <>
      <circle cx="16" cy="19" r="10" />
      <path d="M16 9v20M6 19h20" />
      <path d="M9 12c4.5 3 9.5 3 14 0M9 26c4.5-3 9.5-3 14 0" />
      <path d="M16 3v6" />
    </>
  ),
  sparkle: <path d="M16 2l3 11 11 3-11 3-3 11-3-11-11-3 11-3z" />,
};

function Icon({ name }) {
  return (
    <svg
      className="ps-icon"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

/* ── Monogram wordmark ───────────────────────────────────── */
function Wordmark({ compact = false }) {
  return (
    <span className={`ps-mark${compact ? " ps-mark--compact" : ""}`}>
      <span className="ps-mark-mono" aria-hidden="true">
        <span className="ps-mark-p">P</span>
        <span className="ps-mark-s">S</span>
      </span>
      <span className="ps-mark-name">Public Society</span>
      <span className="ps-mark-sub">
        <i /> Bar &amp; Lounge <i />
      </span>
      <span className="ps-mark-city">Ceres, California</span>
    </span>
  );
}

/* ── Photo with graceful fallback ────────────────────────── */
/* Renders a styled panel instead of a broken-image icon while the real
   photography is still being added to public/images/. */
function Photo({ src, alt, label, className = "" }) {
  const [failed, setFailed] = useState(false);

  // On a static export the browser starts loading images before React
  // hydrates, so a 404 can fire its error event before onError is attached.
  // Re-check the element once mounted to catch those.
  const check = (img) => {
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  };

  if (failed) {
    return (
      <div className={`ps-photo ps-photo--empty ${className}`} role="img" aria-label={alt}>
        <span>{label ?? "Photo"}</span>
      </div>
    );
  }

  return (
    <div className={`ps-photo ${className}`}>
      <img
        ref={check}
        src={asset(src)}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

/* ── Section heading ─────────────────────────────────────── */
function Heading({ eyebrow, title, align = "left" }) {
  return (
    <div className={`ps-heading ps-heading--${align}`}>
      {eyebrow && <span className="ps-eyebrow">{eyebrow}</span>}
      <h2 className="ps-h2">{title}</h2>
      <span className="ps-heading-rule" />
    </div>
  );
}

export default function PublicSociety() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Start false so server and first client render agree; the effect below
  // turns the video on only when it's both available and wanted.
  const [videoOk, setVideoOk] = useState(false);

  // Reservation links fall back to the phone number until a booking URL is set.
  const reserveHref = INFO.reservations || `tel:${INFO.phone.replace(/\D/g, "")}`;

  // A looping background video is motion, so honour the OS setting: those
  // visitors keep the poster still. Checked in an effect rather than CSS so
  // the video never downloads for them.
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVideoOk(true);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      { rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const closeNav = () => setNavOpen(false);

  return (
    <div className="ps-root">
      <style>{CSS}</style>

      {/* ── Nav ───────────────────────────────────────────── */}
      <header className={`ps-nav${scrolled ? " is-scrolled" : ""}`}>
        <a href="#top" className="ps-nav-mark" onClick={closeNav}>
          <Wordmark />
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
          <a href="#top" onClick={closeNav}>Home</a>
          <a href="#about" onClick={closeNav}>About</a>
          <a href="#vip" onClick={closeNav}>VIP Tables</a>
          <a href="#careers" onClick={closeNav}>Careers</a>
          <a href="#visit" onClick={closeNav}>Contact</a>
          <a href={reserveHref} className="ps-btn ps-btn--sm" onClick={closeNav}>
            Reserve a Table
          </a>
        </nav>
      </header>

      <main id="top">
        {/* ── Hero ────────────────────────────────────────── */}
        <section className="ps-hero">
          <div className="ps-hero-media">
            {MEDIA.heroVideo && videoOk ? (
              <video
                className="ps-hero-media-el"
                autoPlay
                muted
                loop
                playsInline
                poster={asset(MEDIA.heroImage)}
                onError={() => setVideoOk(false)}
              >
                <source src={asset(MEDIA.heroVideo)} type="video/mp4" />
              </video>
            ) : (
              // No video configured (or it failed): the still carries the hero.
              // Eager + high priority — this is the largest paint on the page.
              <img
                className="ps-hero-media-el"
                src={asset(MEDIA.heroImage)}
                alt=""
                fetchPriority="high"
              />
            )}
            <div className="ps-hero-scrim" />
          </div>

          <div className="ps-hero-copy">
            <h1 className="ps-h1">
              Meet me
              <br />
              at <em>Public Society.</em>
            </h1>
            <p className="ps-hero-tag">Cocktails. Music. Late Nights.</p>
            <a href={reserveHref} className="ps-btn ps-btn--outline">
              Reserve a Table
            </a>
          </div>
        </section>

        {/* ── About ───────────────────────────────────────── */}
        <section className="ps-section ps-about" id="about">
          <div className="ps-about-copy ps-reveal">
            <Heading eyebrow="Ceres’ Premier" title="Cocktail Lounge" />
            <p>
              An elevated lounge for every occasion. Whether it’s a night out
              with friends, a celebration, or just because—you belong here.
            </p>
            <a href="#visit" className="ps-btn ps-btn--outline">About Us</a>
          </div>

          <Photo
            src={MEDIA.storefront}
            alt="The Public Society Bar & Lounge storefront on 4th Street in Ceres"
            label="Storefront"
            className="ps-reveal"
          />
        </section>

        {/* ── Pillars ─────────────────────────────────────── */}
        <section className="ps-pillars">
          {PILLARS.map((p) => (
            <div className="ps-pillar ps-reveal" key={p.title}>
              <Icon name={p.icon} />
              <h3 className="ps-h3">{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </section>

        {/* ── VIP ─────────────────────────────────────────── */}
        <section className="ps-section ps-vip" id="vip">
          <Photo
            src={MEDIA.vip}
            alt="A bottle of Patrón El Alto tequila on the bar at Public Society"
            label="Bottle Service"
            className="ps-reveal ps-photo--framed"
          />

          <div className="ps-vip-copy ps-reveal">
            <Heading eyebrow="Elevate Your Night" title="VIP Tables" />
            <p>
              Bottle service, private seating, and the best view in the house.
            </p>
            <a href={reserveHref} className="ps-btn ps-btn--outline">
              Book a VIP Table
            </a>
          </div>
        </section>

        {/* ── Careers ─────────────────────────────────────── */}
        <section className="ps-section ps-careers" id="careers">
          <div className="ps-careers-inner ps-reveal">
            <Heading eyebrow="Now Hiring" title="Join the Team" align="center" />
            <p>
              Bartenders, servers, barbacks, and security. If you take
              hospitality seriously and like a room with energy, we’d like to
              meet you.
            </p>

            {INFO.careersForm ? (
              <a
                href={INFO.careersForm}
                className="ps-btn"
                target="_blank"
                rel="noreferrer"
              >
                Apply Now
              </a>
            ) : (
              <p className="ps-careers-soon">
                Open positions are posted soon. In the meantime, reach us at{" "}
                <a href={`tel:${INFO.phone.replace(/\D/g, "")}`} className="ps-inline-link">
                  {INFO.phone}
                </a>{" "}
                or on{" "}
                <a href={INFO.instagram} className="ps-inline-link" target="_blank" rel="noreferrer">
                  Instagram
                </a>
                .
              </p>
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="ps-footer" id="visit">
        <div className="ps-footer-grid">
          <div className="ps-footer-mark">
            <Wordmark />
          </div>

          <div className="ps-footer-col">
            <h4>Visit Us</h4>
            <address>
              {INFO.street}
              <br />
              {INFO.city}
            </address>
            <a href={`tel:${INFO.phone.replace(/\D/g, "")}`} className="ps-inline-link">
              {INFO.phone}
            </a>
            <div className="ps-socials">
              <a href={INFO.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </a>
              <a href={INFO.facebook} aria-label="Facebook" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M13.5 21v-7h2.2l.4-2.7h-2.6V9.6c0-.8.2-1.3 1.3-1.3h1.4V5.9c-.2 0-1.1-.1-2-.1-2 0-3.3 1.2-3.3 3.4v1.9H8.6V14h2.3v7" />
                </svg>
              </a>
            </div>
            <a href={INFO.instagram} className="ps-handle" target="_blank" rel="noreferrer">
              {INFO.instagramHandle}
            </a>
          </div>

          <div className="ps-footer-col">
            <h4>Hours</h4>
            <ul className="ps-hours">
              {HOURS.map((h) => (
                <li key={h.days} className={h.closed ? "is-closed" : undefined}>
                  <span>{h.days}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="ps-footer-col">
            <h4>Stay in the Know</h4>
            <p>Be the first to know about events, specials, and more.</p>
            {INFO.newsletter ? (
              <form className="ps-signup" action={INFO.newsletter} method="post" target="_blank">
                <input
                  type="email"
                  name="EMAIL"
                  required
                  placeholder="Enter your email"
                  aria-label="Email address"
                />
                <button type="submit" aria-label="Sign up">→</button>
              </form>
            ) : (
              <a href={INFO.instagram} className="ps-inline-link" target="_blank" rel="noreferrer">
                Follow {INFO.instagramHandle} →
              </a>
            )}
          </div>
        </div>

        <div className="ps-footer-base">
          <span>
            © {new Date().getFullYear()} Public Society Bar &amp; Lounge. All rights reserved.
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
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500&display=swap');

.ps-root {
  --black:   #080808;
  --panel:   #0F0F0F;
  --raised:  #141414;
  --gold:    #C6A15B;
  --gold-lo: #8C6F3E;
  --gold-hi: #E3C68B;
  --cream:   #EFEAE1;
  --muted:   #9A938A;
  --line:    #262220;

  --display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --sans:    'Jost', system-ui, -apple-system, sans-serif;

  --pad: clamp(20px, 5vw, 76px);
  --maxw: 1240px;

  background: var(--black);
  color: var(--cream);
  font-family: var(--sans);
  font-weight: 300;
  font-size: 16px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

.ps-root p { margin: 0 0 1.4em; color: var(--muted); }
.ps-root a { color: inherit; }
.ps-root *:focus-visible {
  outline: 2px solid var(--gold); outline-offset: 3px;
}

/* ── Wordmark ────────────────────────────────────────── */
.ps-mark {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; line-height: 1;
}
.ps-mark-mono {
  font-family: var(--display); font-weight: 500;
  font-size: 40px; color: var(--gold);
  display: inline-flex; align-items: baseline; letter-spacing: -.04em;
}
.ps-mark-p { transform: translateX(3px); }
.ps-mark-s { transform: translateX(-3px) translateY(4px); }
.ps-mark-name {
  font-family: var(--display); font-size: 21px; font-weight: 500;
  letter-spacing: .17em; text-transform: uppercase;
  color: var(--gold); margin-top: 6px; white-space: nowrap;
}
.ps-mark-sub {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--sans); font-size: 8.5px; font-weight: 400;
  letter-spacing: .34em; text-transform: uppercase;
  color: var(--gold-lo); margin-top: 7px; white-space: nowrap;
}
.ps-mark-sub i { width: 26px; height: 1px; background: var(--gold-lo); }
.ps-mark-city {
  font-size: 9px; letter-spacing: .3em; text-transform: uppercase;
  color: var(--muted); margin-top: 9px; white-space: nowrap;
}

/* ── Nav ─────────────────────────────────────────────── */
.ps-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  gap: 20px; padding: 14px var(--pad);
  transition: background .3s ease, border-color .3s ease;
  border-bottom: 1px solid transparent;
}
.ps-nav.is-scrolled {
  background: rgba(8,8,8,.94);
  backdrop-filter: blur(10px);
  border-bottom-color: var(--line);
}
.ps-nav-mark { text-decoration: none; flex-shrink: 0; }
.ps-nav-mark .ps-mark-mono { font-size: 30px; }
.ps-nav-mark .ps-mark-name { font-size: 15px; letter-spacing: .15em; }

.ps-navlinks { display: flex; align-items: center; gap: clamp(14px, 2vw, 30px); }
.ps-navlinks > a {
  font-size: 11.5px; font-weight: 400;
  letter-spacing: .19em; text-transform: uppercase;
  text-decoration: none; color: var(--cream);
  padding-bottom: 3px; border-bottom: 1px solid transparent;
  transition: color .2s, border-color .2s;
}
.ps-navlinks > a:hover { color: var(--gold); border-bottom-color: var(--gold); }

.ps-burger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: 0; cursor: pointer; padding: 8px;
}
.ps-burger span { display: block; width: 24px; height: 1px; background: var(--gold); }

/* ── Buttons ─────────────────────────────────────────── */
.ps-btn {
  display: inline-block; text-decoration: none;
  font-family: var(--sans); font-size: 11.5px; font-weight: 400;
  letter-spacing: .2em; text-transform: uppercase;
  padding: 15px 30px; border: 1px solid var(--gold);
  background: var(--gold); color: var(--black);
  transition: background .25s, color .25s, border-color .25s;
}
.ps-btn:hover { background: var(--gold-hi); border-color: var(--gold-hi); }
.ps-btn--outline {
  background: none; color: var(--cream); border-color: rgba(198,161,91,.55);
}
.ps-btn--outline:hover {
  background: var(--gold); color: var(--black); border-color: var(--gold);
}
.ps-btn--sm { padding: 11px 22px; font-size: 10.5px; }
.ps-navlinks > a.ps-btn { border-bottom: 1px solid var(--gold); color: var(--black); }
.ps-navlinks > a.ps-btn:hover { color: var(--black); border-bottom-color: var(--gold-hi); }

.ps-inline-link {
  color: var(--gold); text-decoration: none;
  border-bottom: 1px solid transparent; transition: border-color .2s;
}
.ps-inline-link:hover { border-bottom-color: var(--gold); }

/* ── Hero ────────────────────────────────────────────── */
.ps-hero {
  position: relative; min-height: 100svh;
  display: flex; align-items: center;
  padding: 140px var(--pad) 80px;
  max-width: 100%;
}
.ps-hero-media {
  position: absolute; inset: 0; overflow: hidden;
  /* Shows through until interior.jpg is added, so the hero reads as
     lamplight rather than an empty black box. */
  background:
    radial-gradient(120% 90% at 72% 38%, rgba(198,161,91,.16), transparent 58%),
    radial-gradient(80% 60% at 20% 90%, rgba(140,111,62,.1), transparent 60%),
    var(--black);
}
.ps-hero-media-el {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.ps-hero-scrim {
  position: absolute; inset: 0;
  background:
    linear-gradient(to right, rgba(8,8,8,.92) 0%, rgba(8,8,8,.65) 45%, rgba(8,8,8,.35) 100%),
    linear-gradient(to bottom, rgba(8,8,8,.85) 0%, transparent 30%, rgba(8,8,8,.9) 100%);
}
.ps-hero-copy { position: relative; z-index: 2; max-width: 720px; }
.ps-h1 {
  font-family: var(--display); font-weight: 400;
  font-size: clamp(46px, 8.2vw, 104px); line-height: 1.02;
  letter-spacing: .01em; text-transform: uppercase;
  margin: 0 0 26px; color: var(--cream);
}
.ps-h1 em { font-style: normal; color: var(--gold); }
.ps-hero-tag {
  font-size: clamp(13px, 1.6vw, 16px); font-weight: 300;
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--cream) !important; margin: 0 0 38px;
}

/* ── Section shell ───────────────────────────────────── */
/* The nav is fixed, so anchor targets need room underneath it or the heading
   lands behind the bar. The footer's own padding is smaller than the nav. */
.ps-section, .ps-footer, .ps-hero { scroll-margin-top: clamp(78px, 9vw, 122px); }

.ps-section {
  max-width: var(--maxw); margin: 0 auto;
  padding: clamp(64px, 9vw, 118px) var(--pad);
}
.ps-heading { margin-bottom: 26px; }
.ps-eyebrow {
  display: block; font-size: 11.5px; font-weight: 400;
  letter-spacing: .28em; text-transform: uppercase;
  color: var(--cream); margin-bottom: 10px;
}
.ps-h2 {
  font-family: var(--display); font-weight: 400;
  font-size: clamp(32px, 4.4vw, 54px); line-height: 1.1;
  letter-spacing: .05em; text-transform: uppercase;
  color: var(--gold); margin: 0;
}
.ps-h3 {
  font-family: var(--display); font-weight: 400;
  font-size: 25px; letter-spacing: .1em; text-transform: uppercase;
  color: var(--gold); margin: 0 0 12px;
}
.ps-heading-rule {
  display: block; width: 62px; height: 1px;
  background: var(--gold-lo); margin-top: 20px;
}
.ps-heading--center { text-align: center; }
.ps-heading--center .ps-heading-rule { margin-inline: auto; }

/* Reveals */
.ps-reveal {
  opacity: 0; transform: translateY(24px);
  transition: opacity .8s ease, transform .8s cubic-bezier(.2,.7,.3,1);
}
.ps-reveal.is-in { opacity: 1; transform: none; }

/* ── Photos ──────────────────────────────────────────── */
.ps-photo { overflow: hidden; background: var(--raised); }
.ps-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ps-photo--empty {
  display: grid; place-items: center; min-height: 320px;
  border: 1px solid var(--line);
}
.ps-photo--empty span {
  font-size: 10.5px; letter-spacing: .28em;
  text-transform: uppercase; color: var(--gold-lo);
}
.ps-photo--framed {
  border: 1px solid rgba(198,161,91,.35); padding: 10px; background: none;
}

/* ── About ───────────────────────────────────────────── */
.ps-about {
  display: grid; grid-template-columns: 1fr 1.15fr;
  gap: clamp(32px, 6vw, 80px); align-items: center;
}
.ps-about-copy p { max-width: 42ch; }

/* ── Pillars ─────────────────────────────────────────── */
.ps-pillars {
  display: grid; grid-template-columns: repeat(3, 1fr);
  border-block: 1px solid var(--line);
  background: var(--panel);
}
.ps-pillar {
  padding: clamp(40px, 5vw, 64px) clamp(24px, 3.5vw, 48px);
  text-align: center; border-right: 1px solid var(--line);
}
.ps-pillar:last-child { border-right: 0; }
.ps-pillar p { margin: 0; max-width: 34ch; margin-inline: auto; }
.ps-icon { width: 40px; height: 40px; color: var(--gold); margin-bottom: 20px; }

/* ── VIP ─────────────────────────────────────────────── */
.ps-vip {
  display: grid; grid-template-columns: 1.15fr 1fr;
  gap: clamp(32px, 6vw, 80px); align-items: center;
}
.ps-vip-copy p { max-width: 38ch; }
/* The bottle shot is portrait (2:3). Unconstrained it would tower over the
   copy beside it, so cap the width and centre it in its column. */
.ps-vip .ps-photo { max-width: 400px; margin-inline: auto; width: 100%; }

/* ── Careers ─────────────────────────────────────────── */
.ps-careers { text-align: center; }
.ps-careers-inner { max-width: 640px; margin: 0 auto; }
.ps-careers-inner p { margin-inline: auto; }
.ps-careers-soon { font-size: 14px; }

/* ── Footer ──────────────────────────────────────────── */
.ps-footer {
  border-top: 1px solid var(--line);
  background: var(--panel);
  padding: clamp(48px, 6vw, 72px) var(--pad) 0;
}
.ps-footer-grid {
  max-width: var(--maxw); margin: 0 auto;
  display: grid; grid-template-columns: 1.1fr 1fr 1fr 1.2fr;
  gap: clamp(28px, 4vw, 56px);
}
.ps-footer-col h4 {
  font-family: var(--sans); font-size: 11.5px; font-weight: 400;
  letter-spacing: .26em; text-transform: uppercase;
  color: var(--gold); margin: 0 0 18px;
}
.ps-footer-col p { font-size: 14px; }
.ps-footer-col address {
  font-style: normal; font-size: 14px; color: var(--muted); margin-bottom: 12px;
}
.ps-footer-col .ps-inline-link { font-size: 14px; }

.ps-hours { list-style: none; padding: 0; margin: 0; font-size: 14px; }
.ps-hours li {
  display: flex; flex-direction: column; margin-bottom: 12px; color: var(--muted);
}
.ps-hours li span:first-child { color: var(--cream); }
.ps-hours li.is-closed span:last-child { color: var(--gold-lo); }

.ps-socials { display: flex; gap: 12px; margin: 16px 0 10px; }
.ps-socials a { color: var(--gold); display: inline-flex; }
.ps-socials svg { width: 20px; height: 20px; }
.ps-handle {
  display: block; font-size: 12px; letter-spacing: .16em;
  text-transform: uppercase; color: var(--muted); text-decoration: none;
}
.ps-handle:hover { color: var(--gold); }

.ps-signup { display: flex; max-width: 320px; }
.ps-signup input {
  flex: 1; min-width: 0; background: var(--raised);
  border: 1px solid var(--line); border-right: 0;
  padding: 12px 14px; color: var(--cream);
  font-family: var(--sans); font-size: 13px;
}
.ps-signup input::placeholder { color: var(--muted); }
.ps-signup button {
  background: var(--gold); border: 1px solid var(--gold);
  color: var(--black); padding: 0 18px; cursor: pointer; font-size: 16px;
}
.ps-signup button:hover { background: var(--gold-hi); }

.ps-footer-base {
  max-width: var(--maxw); margin: clamp(40px, 5vw, 64px) auto 0;
  border-top: 1px solid var(--line);
  padding: 22px 0 26px; text-align: center;
  font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase;
  color: var(--gold-lo);
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 1080px) {
  .ps-footer-grid { grid-template-columns: 1fr 1fr; row-gap: 44px; }
}

@media (max-width: 920px) {
  .ps-about, .ps-vip { grid-template-columns: 1fr; }
  /* Photo first on desktop for VIP, copy first when stacked. */
  .ps-vip .ps-photo { order: 2; }
  .ps-pillars { grid-template-columns: 1fr; }
  .ps-pillar { border-right: 0; border-bottom: 1px solid var(--line); }
  .ps-pillar:last-child { border-bottom: 0; }
}

@media (max-width: 820px) {
  .ps-burger { display: flex; }
  .ps-nav { padding: 10px var(--pad); }
  .ps-navlinks {
    position: absolute; top: 100%; left: 0; right: 0;
    flex-direction: column; align-items: stretch; gap: 0;
    background: var(--black); border-bottom: 1px solid var(--line);
    max-height: 0; overflow: hidden; transition: max-height .35s ease;
  }
  .ps-navlinks.is-open { max-height: 420px; }
  .ps-navlinks > a {
    padding: 17px var(--pad); border-bottom: 1px solid var(--line);
    text-align: left;
  }
  .ps-navlinks > a.ps-btn {
    background: none; color: var(--gold); border: 0;
    border-bottom: 1px solid var(--line);
  }
  .ps-navlinks > a.ps-btn:hover { background: none; color: var(--gold-hi); }
  .ps-nav-mark .ps-mark-mono { font-size: 25px; }
  .ps-nav-mark .ps-mark-name { font-size: 12.5px; }
  .ps-nav-mark .ps-mark-sub, .ps-nav-mark .ps-mark-city { display: none; }
  .ps-hero { min-height: 92svh; padding-top: 120px; }
  .ps-footer-grid { grid-template-columns: 1fr; }
  .ps-mark { align-items: flex-start; text-align: left; }
}

/* ── Reduced motion ──────────────────────────────────── */
/* The hero video is handled in JS (see videoOk) so it is never fetched for
   these visitors — the poster image carries the hero instead. */
@media (prefers-reduced-motion: reduce) {
  .ps-reveal { opacity: 1; transform: none; transition: none; }
}
`;
