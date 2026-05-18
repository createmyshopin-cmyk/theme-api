import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';

/* ─────────────────── Nav ─────────────────── */
function Nav() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(14px)',
      background: 'rgba(255,255,255,0.82)',
      borderBottom: '1px solid rgba(12,13,16,0.07)',
    }}>
      <div className="wrap nav-inner">
        <a href="#" className="nav-logo">
          <span className="hex-glyph sm">
            <svg viewBox="0 0 24 24" width="13" height="13"><path d="M12 4v16M4 12h16" stroke="#fff" strokeWidth="2.8" /></svg>
          </span>
          ThemePro V2
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#performance">Performance</a>
          <a href="#demos">Demos</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="https://superprofile.bio/vp/shopify-415" target="_blank" rel="noopener noreferrer" className="btn btn-dark btn-sm nav-buy-btn">Buy theme · ₹2499</a>
          <a href="https://themeprov2.myshopify.com/password" target="_blank" rel="noopener noreferrer" className="btn btn-dark btn-sm nav-preview-btn">Preview Theme &nbsp;<span style={{ color: '#ff3333', fontWeight: 700, display: 'inline' }} className="nav-pw-text">Shopify store password: "V2"</span></a>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────── Hero ─────────────────── */
function Hero() {
  return (
    <header className="hero">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <span className="eyebrow-text">The fastest Shopify theme on the market</span>
        <h1 className="hero-headline">
          The Perfect <span className="highlight">Shopify Theme</span><br />
          For Your Business.
        </h1>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
          <a href="https://superprofile.bio/vp/shopify-415" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
            Buy theme — ₹2499
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <a href="https://themeprov2.myshopify.com/password" target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light btn-lg">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            Live preview &nbsp;<span style={{ color: '#ff3333', fontWeight: 700 }}>Shopify store password: "V2"</span>
          </a>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13.5, marginTop: 18 }}>
          One-time payment · Lifetime updates · 30-day refund
        </p>
      </div>

      {/* Text marquee — 2 rows */}
      <div style={{ overflow: 'hidden', width: '100%', margin: '40px 0 10px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <style>{`
          @keyframes marquee-ltr  { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
          @keyframes marquee-rtl  { 0% { transform: translateX(-33.333%); } 100% { transform: translateX(0); } }
        `}</style>

        {/* Row 1 — left to right */}
        <div style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content', animation: 'marquee-ltr 22s linear infinite', gap: 40 }}>
          {[...Array(3)].map((_, r) =>
            ['Dropshipping', 'Fashion', 'Jewellery', 'Food & Beverage', 'Electronics', 'Beauty & Skincare', 'Home Decor', 'Sports & Fitness'].map((label, i) => (
              <span key={`r1-${r}-${i}`} style={{
                fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em',
                color: i % 2 === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                display: 'inline-flex', alignItems: 'center', gap: 40,
              }}>
                {label}
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', display: 'inline-block', flexShrink: 0 }} />
              </span>
            ))
          )}
        </div>

        {/* Row 2 — right to left */}
        <div style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content', animation: 'marquee-rtl 22s linear infinite', gap: 40 }}>
          {[...Array(3)].map((_, r) =>
            ['Pet Supplies', 'Toys & Games', 'Health & Wellness', 'Books & Stationery', 'Baby Products', 'Automotive', 'Travel Accessories', 'Organic & Natural'].map((label, i) => (
              <span key={`r2-${r}-${i}`} style={{
                fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em',
                color: i % 2 === 0 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.9)',
                display: 'inline-flex', alignItems: 'center', gap: 40,
              }}>
                {label}
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', display: 'inline-block', flexShrink: 0 }} />
              </span>
            ))
          )}
        </div>
      </div>

      <div className="strap">
        <div className="strap-inner">
          {['Free Lifetime Update', 'High Speed Performance', 'First Class Support', 'Shopify 2.0'].map((s, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}>
              {i > 0 && <span className="dot" />}
              {s}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ─────────────────── Hook Banner ─────────────────── */
function HookBanner() {
  return (
    <div className="hook-banner">
      <div className="hook-inner">
        <span className="hook-icon">⚡</span>
        <p className="hook-text">
          Launch Your Shopify Website <span className="hook-em">Just in 15 mins</span> with ThemePro V2
        </p>
        <a href="https://superprofile.bio/vp/shopify-415" target="_blank" rel="noopener noreferrer" className="hook-cta">
          Get Started →
        </a>
      </div>
    </div>
  );
}

/* ─────────────────── Anniversary Offer Section ─────────────────── */
const ANNIV_MSGS = [
  '🎂 3rd Anniversary Sale — ₹2499 only!',
  '🔥 Flash Sale — Only a few spots left!',
  '⚡ 247 people viewing this right now',
  '🚨 Price goes up when timer hits zero!',
  '💸 Save ₹24,201 today only!',
  '⏳ Anniversary offer — grab it before it\'s gone',
  '🏆 #1 Rated Shopify theme in India',
  '🎯 Offer valid for today only!',
];

function AnniversaryOffer() {
  const [msgIdx,  setMsgIdx]  = useState(0);
  const [anim,    setAnim]    = useState('ann-msg-in');

  useEffect(() => {
    const id = setInterval(() => {
      setAnim('ann-msg-out');
      setTimeout(() => {
        setMsgIdx((i) => (i + 1) % ANNIV_MSGS.length);
        setAnim('ann-msg-in');
      }, 350);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const avatars = [
    { emoji: '👨🏾', bg: ['#26a66a','#0e4d2d'] },
    { emoji: '👩🏾', bg: ['#f6b733','#b07800'] },
    { emoji: '👨🏿', bg: ['#7b5cff','#3a2358'] },
    { emoji: '👩🏽', bg: ['#ff7ab8','#8b1a4a'] },
    { emoji: '🧑🏾', bg: ['#2f80ed','#1c3a6e'] },
  ];

  return (
    <section className="ann-section">
      {['ann-dot1','ann-dot2','ann-dot3','ann-dot4'].map((c) => (
        <span key={c} className={`ann-dot ${c}`} aria-hidden="true" />
      ))}

      <div className="wrap ann-wrap">
        {/* LEFT — Headline + badge */}
        <div className="ann-left">
          <div className="ann-badge">🎂 3rd Anniversary Offer</div>
          <h2 className="ann-headline">
            Celebrate With Us —<br />
            Get The Theme at<br />
            <span className="ann-price-inline">₹2499</span>
          </h2>
          {/* Social proof — desktop shows here */}
          <div className="ann-proof ann-proof-desktop" style={{ display: 'none' }}>
            <div className="ann-avatars">
              {avatars.map((av, i) => (
                <span key={i} className="ann-av" style={{ background: `linear-gradient(135deg,${av.bg[0]},${av.bg[1]})` }}>
                  {av.emoji}
                </span>
              ))}
            </div>
            <span className="ann-proof-text">28,000+ stores already running this theme</span>
          </div>
        </div>

        {/* RIGHT — Price card + strip + CTA */}
        <div className="ann-right">
          {/* Price card */}
          <div className="ann-price-card">
            <div className="ann-price-row">
              <div className="ann-price-block">
                <span className="ann-now">₹2499</span>
                <span className="ann-mrp">₹26,700</span>
              </div>
              <div className="ann-off-pill">91% OFF</div>
            </div>
            <div className="ann-saved-badge">🎉 You save ₹24,201 today!</div>
            <div className="ann-price-meta">
              <span className="ann-price-tag">⏱ Limited time</span>
              <span className="ann-price-tag">📅 Today only</span>
              <span className="ann-price-tag">✅ No hidden charges</span>
            </div>
          </div>
          <p className="ann-sub">One-time payment · Lifetime updates included</p>

          {/* Rotating urgency strip */}
          <div className="ann-strip">
            <span className="ann-strip-dot" />
            <span className={`ann-strip-text ${anim}`}>{ANNIV_MSGS[msgIdx]}</span>
          </div>

          {/* CTA */}
          <div className="ann-cta-wrap">
            <a href="https://superprofile.bio/vp/shopify-415" target="_blank" rel="noopener noreferrer" className="ann-cta">
              🎂 Grab Anniversary Deal →
            </a>
            <p className="ann-guarantee">🔒 Secure checkout</p>
          </div>

          {/* Social proof — mobile shows here */}
          <div className="ann-proof ann-proof-mobile">
            <div className="ann-avatars">
              {avatars.map((av, i) => (
                <span key={i} className="ann-av" style={{ background: `linear-gradient(135deg,${av.bg[0]},${av.bg[1]})` }}>
                  {av.emoji}
                </span>
              ))}
            </div>
            <span className="ann-proof-text">28,000+ stores already running this theme</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Performance ─────────────────── */
function Performance() {
  const [perf, setPerf] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let raf;
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let n = 0;
        const tick = () => { n += 2; setPerf(Math.min(99, n)); if (n < 99) raf = requestAnimationFrame(tick); };
        tick(); ob.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) ob.observe(ref.current);
    return () => { cancelAnimationFrame(raf); ob.disconnect(); };
  }, []);

  return (
    <section id="performance" className="perf-section" ref={ref}>
      <div className="wrap" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <span className="hex-glyph sm"><svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M14 2L4 14h7l-2 8 10-12h-7z" /></svg></span>
        </div>
        <span className="badge-white">The fastest theme on the market</span>
        <h2 className="section-title" style={{ color: '#fff' }}>Super Fast Loading Speed</h2>
        <p className="lead" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Our Shopify themes pass rigorous tests of <u>PageSpeed Insights</u>,&nbsp;
          <u>GTmetrix</u> — ensuring fast speeds, optimal functionality, and an excellent user experience.
        </p>

        <div className="perf-card">
          <div className="gauge-ring" style={{ '--p': perf }}>
            <div className="gauge-num">{perf}</div>
          </div>
          <div style={{ fontWeight: 700, fontSize: 24, textAlign: 'center', marginBottom: 8 }}>Performance</div>
          <p style={{ color: '#5b6270', textAlign: 'center', fontSize: 14.5, maxWidth: 540, margin: '0 auto 18px' }}>
            Values are estimated and may vary. The performance score is calculated directly from these metrics.
          </p>
          <div className="legend">
            <span><i className="legend-i red" />0–49</span>
            <span><i className="legend-i amber" />50–89</span>
            <span><i className="legend-i green" />90–100</span>
          </div>
          <div className="gauge-mini-row">
            {[['Accessibility', 100], ['Best Practices', 100], ['SEO', 100]].map(([label, val]) => (
              <div key={label}>
                <div className="gauge-mini" style={{ '--p': val }}><div className="gauge-num-sm">{val}</div></div>
                <div className="gauge-mini-label">{label}</div>
              </div>
            ))}
          </div>
          <div className="gtm-bar">
            <div>
              <div className="gtm-grade">A</div>
              <div className="gtm-lbl">GTmetrix Grade</div>
            </div>
            <div>
              <div className="gtm-lbl">Performance</div>
              <div className="gtm-pct">99%</div>
            </div>
            <div>
              <div className="gtm-lbl">Structure</div>
              <div className="gtm-pct">100%</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 36, display: 'flex', justifyContent: 'center' }}>
          <a className="btn btn-ink btn-lg" href="#">Live test now</a>
        </div>
        <p style={{ color: '#fff', marginTop: 26, fontSize: 15, fontWeight: 600 }}>
          Performance report by <u>Google PageSpeed Insight</u> and <u>GTmetrix</u>
        </p>
      </div>

      <svg className="wave" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0 40 C 240 0, 480 80, 720 40 C 960 0, 1200 60, 1440 30 L1440 80 L0 80 Z" fill="rgba(0,0,0,0.15)" />
        <path d="M0 40 C 240 0, 480 80, 720 40 C 960 0, 1200 60, 1440 30" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none" />
      </svg>
    </section>
  );
}

/* ─────────────────── Features Grid ─────────────────── */
function FeaturesGrid() {
  return (
    <section className="section section-soft" id="features">
      <div className="wrap">
        <div className="section-head">
          <h2 className="section-title">ThemePro V2 Features</h2>
        </div>
        <div className="boost-img-wrap">
          <img src="/new.png" alt="The list of great features" className="boost-img" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Boost Traffic ─────────────────── */
function BoostTraffic() {
  return (
    <section className="section section-white">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Perfect for E-commerce</span>
          <h2 className="section-title">Boost The Traffic</h2>
          <p className="lead">ThemePro V2 focuses on customer experience and behavior to provide the best features for enticing customers and boosting sales.</p>
        </div>
        <div className="boost-img-wrap">
          <img
            src="/boost.png"
            alt="Boost Traffic Features"
            className="boost-img"
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Color Schemes ─────────────────── */
function ColorSchemes() {
  return (
    <section className="section" style={{ background: 'linear-gradient(170deg,#d8f0e0,#d6c8ff)', padding: '60px 0' }}>
      <div className="wrap">
        <div className="boost-img-wrap">
          <img src="/color.gif" alt="Color Schemes Feature" className="boost-img" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Stats ─────────────────── */
function Stats() {
  const stats = [
    { num: '28k+',   lbl: 'stores already shipped' },
    { num: '99/100', lbl: 'PageSpeed performance' },
    { num: '4.95 ★', lbl: 'average review (2.4k)' },
    { num: '$1.2M+', lbl: 'GMV powered by ThemePro V2' },
  ];
  return (
    <section className="section section-white" style={{ paddingTop: 0, paddingBottom: 30 }}>
      <div className="wrap">
        <div className="stats-strip">
          {stats.map((s) => (
            <div key={s.lbl}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Testimonials ─────────────────── */
const TESTIMONIALS = [
  { name: 'Marta Rovira',  role: 'Founder, Lumen Skin',     letter: 'M', quote: 'We migrated from a custom theme in a weekend. Conversion was up 22% in the first two weeks — purely from the speed lift.' },
  { name: 'Daniel Okafor', role: 'Head of E-comm, Anteo',   letter: 'D', quote: "The shoppable video block alone paid back the license inside a month. Our team finally has a theme that doesn't fight us." },
  { name: 'Jess Lin',      role: 'Independent Designer',    letter: 'J', quote: "Every section is genuinely well thought through. I haven't touched Liquid in three client builds and the outcomes look bespoke." },
];

function Testimonials() {
  return (
    <section className="section section-soft">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Loved by founders</span>
          <h2 className="section-title">28,000+ stores running ThemePro V2</h2>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <div className="testi-quote">"{t.quote}"</div>
              <div className="testi-who">
                <div className="testi-av">{t.letter}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── FAQ ─────────────────── */
const FAQS = [
  { q: 'How does the one-time license work?',      a: 'Buy once, install on the number of stores your tier allows, and use it forever. You\'ll receive every future update and new demo at no extra cost.' },
  { q: 'Will it slow down my store?',              a: 'ThemePro V2 consistently scores 95–100 on PageSpeed Insights with content-rich storefronts. The theme ships only what each page needs and uses native Shopify primitives wherever possible.' },
  { q: 'Do I need a developer to install it?',     a: 'No. Every section is configurable through Shopify\'s theme editor. Most merchants are live within an afternoon. Studio and Agency tiers include migration assistance if you\'d like a hand.' },
  { q: 'Can I customize the design later?',        a: 'Yes — color schemes, fonts, layouts and 80+ blocks are exposed in the editor. Liquid source is included if you want to dig deeper.' },
  { q: 'What if it\'s not for me?',               a: 'We offer a no-questions 30-day refund. If ThemePro V2 doesn\'t fit your business, email us within 30 days of purchase.' },
  { q: 'Is support included?',                     a: 'All tiers ship with support. Starter is email-based; Studio gets priority chat with a 24-hour SLA; Agency adds a dedicated Slack channel.' },
];

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section section-white" id="faq">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2 className="section-title">Questions, answered.</h2>
        </div>
        <div className="faq">
          {FAQS.map((f, i) => (
            <div key={i} className="faq-item">
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                {f.q}
                <span className={`faq-ic${open === i ? ' faq-ic-open' : ''}`}>+</span>
              </button>
              {open === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Final CTA ─────────────────── */
function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="wrap" style={{ position: 'relative', textAlign: 'center' }}>
        <div className="cta-badge">⚡ Get started in minutes</div>
        <h2 className="cta-title">Ship the storefront<br />your brand deserves.</h2>
        <p className="cta-sub">One purchase. Every demo. Forever updates. Built for Shopify 2.0.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://superprofile.bio/vp/shopify-415" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">Buy ThemePro V2 — ₹2499 →</a>
          <a href="https://themeprov2.myshopify.com/password" target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light btn-lg">See live demos &nbsp;<span style={{ color: '#ff3333', fontWeight: 700 }}>Shopify store password: "V2"</span></a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Footer ─────────────────── */
function Footer() {
  const cols = [
    { heading: 'Product',   links: ['Features', 'Demos', 'Pricing', 'Changelog'] },
    { heading: 'Resources', links: ['Documentation', 'Migration guide', 'Support', 'Affiliates'] },
    { heading: 'Company',   links: ['About', 'Customers', 'Terms', 'Privacy'] },
  ];
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-cols">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span className="hex-glyph sm"><svg viewBox="0 0 24 24" width="13" height="13"><path d="M12 4v16M4 12h16" stroke="#fff" strokeWidth="2.8" /></svg></span>
              <span style={{ fontWeight: 900, color: '#fff', fontSize: 22, letterSpacing: '-0.02em' }}>ThemePro V2</span>
            </div>
            <p style={{ maxWidth: 320, lineHeight: 1.55 }}>
              The most opinionated Shopify 2.0 theme on the market. Built for speed, polished for taste, tuned for conversion.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.heading}>
              <h4 className="footer-head">{col.heading}</h4>
              <ul className="footer-list">
                {col.links.map((l) => <li key={l}><a href="#">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-legal">
          <span>© 2026 ThemePro V2. All rights reserved.</span>
          <span>Made with ⚡ for Shopify merchants.</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────── Purchase Notifications ─────────────────── */
const BUYERS = [
  { name: 'Afsal',      city: 'Calicut' },
  { name: 'Arjun',      city: 'Kochi' },
  { name: 'Divya',      city: 'Bangalore' },
  { name: 'Ramesh',     city: 'Chennai' },
  { name: 'Priya',      city: 'Coimbatore' },
  { name: 'Karthik',    city: 'Hyderabad' },
  { name: 'Anjali',     city: 'Trivandrum' },
  { name: 'Mohammed',   city: 'Malappuram' },
  { name: 'Sneha',      city: 'Mysuru' },
  { name: 'Vishnu',     city: 'Thrissur' },
  { name: 'Lakshmi',    city: 'Madurai' },
  { name: 'Rahul',      city: 'Mangalore' },
  { name: 'Fathima',    city: 'Kozhikode' },
  { name: 'Suresh',     city: 'Vijayawada' },
  { name: 'Nithya',     city: 'Salem' },
  { name: 'Arun',       city: 'Tirupur' },
  { name: 'Meera',      city: 'Ernakulam' },
  { name: 'Shafeeq',    city: 'Kannur' },
  { name: 'Kavya',      city: 'Vizag' },
  { name: 'Deepak',     city: 'Puducherry' },
];

const TIMES = ['just now', '1 min ago', '2 mins ago', '3 mins ago', '5 mins ago', '7 mins ago', '9 mins ago', '12 mins ago'];

const AVATAR_COLORS = [
  ['#26a66a','#0e4d2d'], ['#2f80ed','#1c3a6e'], ['#7b5cff','#3a2358'],
  ['#ff5b48','#5c1a12'], ['#f6b733','#5c3d00'], ['#ff7ab8','#5c1a3a'],
];

function PurchaseToast() {
  const [visible,  setVisible]  = useState(false);
  const [leaving,  setLeaving]  = useState(false);
  const [buyer,    setBuyer]    = useState(null);
  const [colors,   setColors]   = useState(AVATAR_COLORS[0]);
  const [time,     setTime]     = useState(TIMES[0]);
  const indexRef = useRef(-1);

  useEffect(() => {
    const show = () => {
      indexRef.current = (indexRef.current + 1) % BUYERS.length;
      setBuyer(BUYERS[indexRef.current]);
      setColors(AVATAR_COLORS[indexRef.current % AVATAR_COLORS.length]);
      setTime(TIMES[Math.floor(Math.random() * TIMES.length)]);
      setLeaving(false);
      setVisible(true);
      setTimeout(() => setLeaving(true),  3800);
      setTimeout(() => setVisible(false), 4300);
    };
    const first    = setTimeout(show, 2500);
    const interval = setInterval(show, 6500);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  if (!visible || !buyer) return null;

  const initials = buyer.name.slice(0, 2).toUpperCase();

  return (
    <div className={`toast${leaving ? ' toast-leave' : ' toast-enter'}`}>
      {/* Shimmer bar at top */}
      <div className="toast-shimmer" />

      <div className="toast-inner">
        {/* Avatar */}
        <div className="toast-avatar" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
          {initials}
          <span className="toast-online" />
        </div>

        {/* Content */}
        <div className="toast-content">
          <div className="toast-row1">
            <span className="toast-name">{buyer.name}</span>
            {/* Verified blue tick */}
            <svg viewBox="0 0 22 22" width="15" height="15" fill="none">
              <path d="M11 1L13.4 3.8L17 3.2L17.8 6.8L21 8.5L19.5 12L21 15.5L17.8 17.2L17 20.8L13.4 20.2L11 23L8.6 20.2L5 20.8L4.2 17.2L1 15.5L2.5 12L1 8.5L4.2 6.8L5 3.2L8.6 3.8Z" fill="#1d9bf0"/>
              <path d="M7.5 12l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="toast-time">{time}</span>
          </div>
          <div className="toast-row2">
            <span className="toast-city">📍 {buyer.city}</span>
          </div>
          <div className="toast-row3">
            purchased <span className="toast-product">ThemePro v2</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Mobile Sticky Bar ─────────────────── */
const TIMER_START = 9 * 60;

const URGENCY_MSGS = [
  { icon: '🎂', text: '3rd Anniversary Sale — ₹2499 only!' },
  { icon: '🔥', text: 'Flash Sale — Only a few spots left!' },
  { icon: '⚡', text: '247 people viewing this right now' },
  { icon: '🚨', text: 'Price goes up when timer hits zero!' },
  { icon: '✅', text: '28,000+ stores already use this theme' },
  { icon: '💸', text: 'Save ₹24,201 today only!' },
  { icon: '⏳', text: 'Anniversary offer — grab it before it\'s gone' },
  { icon: '🏆', text: '#1 Rated Shopify theme in India' },
];

function MobileStickyBar() {
  const [seconds,  setSeconds]  = useState(TIMER_START);
  const [msgIdx,   setMsgIdx]   = useState(0);
  const [msgAnim,  setMsgAnim]  = useState('msb-msg-in');

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Rotate urgency message every 3s with fade animation
  useEffect(() => {
    const id = setInterval(() => {
      setMsgAnim('msb-msg-out');
      setTimeout(() => {
        setMsgIdx((i) => (i + 1) % URGENCY_MSGS.length);
        setMsgAnim('msb-msg-in');
      }, 350);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const mm  = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss  = String(seconds % 60).padStart(2, '0');
  const expired = seconds === 0;
  const msg = URGENCY_MSGS[msgIdx];

  return (
    <div className="msb">
      {/* Top urgency strip */}
      <div className="msb-strip">
        <span className="msb-strip-dot" />
        <span className={`msb-strip-text ${msgAnim}`}>
          {msg.icon} {msg.text}
        </span>
        <span className={`msb-clock${expired ? ' msb-clock-expired' : ''}`}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
          {expired ? 'Offer ended' : `Ends in ${mm}:${ss}`}
        </span>
      </div>

      {/* Main row */}
      <div className="msb-main">
        {/* Price block */}
        <div className="msb-price-block">
          <div className="msb-anniv">
            🎂 3rd Anniversary Offer
          </div>
          <div className="msb-price-row">
            <span className="msb-now">₹2499</span>
            <span className="msb-mrp">₹26,700</span>
            <span className="msb-badge">91% OFF</span>
          </div>
          <div className="msb-sublabel">Limited time · Today only</div>
        </div>

        {/* CTA */}
        <a href="https://superprofile.bio/vp/shopify-415" target="_blank" rel="noopener noreferrer" className="msb-cta">
          <span>Buy Now</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  );
}

/* ─────────────────── Page ─────────────────── */
export default function ThemePage() {
  return (
    <>
      <Head>
        <title>ThemePro V2 — The Perfect Shopify Theme For Your Business</title>
        <meta name="description" content="The fastest Shopify 2.0 theme on the market. One-time payment, lifetime updates, 30-day refund. Built for speed, polished for taste, tuned for conversion." />
        <meta property="og:title" content="ThemePro V2 Shopify Theme" />
        <meta property="og:description" content="The fastest Shopify 2.0 theme on the market." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <Nav />
      <Hero />
      <HookBanner />
      <AnniversaryOffer />
      <Performance />
      <FeaturesGrid />
      <BoostTraffic />
      <ColorSchemes />
      <Stats />

      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
      <PurchaseToast />
      <MobileStickyBar />
    </>
  );
}

