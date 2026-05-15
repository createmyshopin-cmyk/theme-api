import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import '../styles/theme.css';

/* ─────────────────── Utility ─────────────────── */
function shade(hex, amt) {
  const h = hex.replace('#', '');
  const num = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  let r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  const f = (c) => Math.max(0, Math.min(255, Math.round(c + (amt < 0 ? c : 255 - c) * amt)));
  return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
}

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
          VESTA
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#performance">Performance</a>
          <a href="#demos">Demos</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="#pricing" className="btn btn-dark btn-sm">Buy theme · $89</a>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────── Hero ─────────────────── */
const TILES = [
  { palette: 'warm',   title: 'Hulton',   sub: 'Perfect Simple' },
  { palette: 'fresh',  title: 'Stylish',  sub: 'Top Trending' },
  { palette: 'slate',  title: 'Modern',   sub: 'Edition' },
  { palette: 'amber',  title: 'Perfect',  sub: "You're Unique" },
  { palette: 'violet', title: 'Beauty',   sub: 'Routine' },
  { palette: 'pink',   title: 'Atelier',  sub: "Spring '26" },
  { palette: 'green',  title: 'Botanic',  sub: 'Skincare' },
  { palette: 'coral',  title: 'Sneakers', sub: 'Drop 04' },
];
const TILES_DBL = [...TILES, ...TILES];

function ThemeTile({ palette, title, sub, flip }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', fontSize: 9.5, color: '#5b6270' }}>
        <span style={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#0c0d10' }}>VESTA</span>
        <span style={{ display: 'flex', gap: 10 }}><span>Shop</span><span>Page</span><span>Blog</span></span>
        <span style={{ display: 'flex', gap: 6 }}>
          <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /><path d="M3 4h2l2.5 12h11l2-9H6" /></svg>
        </span>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <div className={`ph ph-${palette}`} style={{ height: '100%', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: flip ? '14px 14px auto 14px' : 'auto 14px 14px 14px',
            background: 'rgba(255,255,255,0.92)',
            color: '#0c0d10',
            padding: '10px 12px', borderRadius: 8,
            backdropFilter: 'blur(4px)',
            maxWidth: '55%',
          }}>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>{title}</div>
            <div style={{ fontSize: 11, color: '#5b6270' }}>{sub}</div>
            <div style={{ marginTop: 6, background: '#0c0d10', color: '#fff', borderRadius: 999, padding: '4px 10px', fontSize: 9, fontWeight: 700, display: 'inline-block', letterSpacing: '0.06em' }}>EXPLORE NOW</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <header className="hero">
      <div className="wrap" style={{ textAlign: 'center' }}>
        {/* Rotating seal */}
        <div className="seal" aria-hidden="true">
          <svg className="seal-mark" viewBox="0 0 200 200">
            <defs><path id="cp" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
            <text fontSize="13.5" fontFamily="Plus Jakarta Sans" fontWeight="800" fill="rgba(255,255,255,0.8)" letterSpacing="3">
              <textPath href="#cp">BUILD · NEXT GENERATION · SHOPIFY 2.0 STORE · BUILD · NEXT GENERATION · SHOPIFY 2.0 STORE · </textPath>
            </text>
          </svg>
          <span className="hex-glyph lg">
            <svg viewBox="0 0 60 68" width="40" height="46" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round">
              <path d="M22 22 L30 16 L38 22 L38 46 L30 52 L22 46 Z" />
              <path d="M22 22 L30 28 L38 22" />
              <path d="M30 28 L30 52" />
            </svg>
          </span>
          <span className="seal-badge">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff"><path d="M14 2L4 14h7l-2 8 10-12h-7z" /></svg>
          </span>
        </div>

        <span className="eyebrow-text">The fastest Shopify theme on the market</span>
        <h1 className="hero-headline">
          The Perfect <span className="highlight">Shopify Theme</span><br />
          For Your Business.
        </h1>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
          <a href="#pricing" className="btn btn-primary btn-lg">
            Buy theme — $89
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <a href="#demos" className="btn btn-ghost-light btn-lg">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            Live preview
          </a>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13.5, marginTop: 18 }}>
          One-time payment · Lifetime updates · 30-day refund
        </p>
      </div>

      {/* Scrolling tile rails */}
      <div className="hero-grid">
        <div className="hero-rail">
          {TILES_DBL.map((t, i) => (
            <div key={`a${i}`} className="theme-tile"><ThemeTile {...t} /></div>
          ))}
        </div>
        <div className="hero-rail reverse">
          {TILES_DBL.map((t, i) => (
            <div key={`b${i}`} className="theme-tile"><ThemeTile {...t} flip /></div>
          ))}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
            {[['Accessibility', 100], ['Best Practices', 100], ['SEO', 100]].map(([label, val]) => (
              <div key={label}>
                <div className="gauge-mini" style={{ '--p': val }}><div className="gauge-num-sm">{val}</div></div>
                <div style={{ fontWeight: 700, fontSize: 18, textAlign: 'center' }}>{label}</div>
              </div>
            ))}
          </div>
          <div className="gtm-bar">
            <div>
              <div className="gtm-grade">A</div>
              <div className="gtm-lbl">GTmetrix Grade</div>
            </div>
            <div>
              <div style={{ color: '#5b6270', fontSize: 15 }}>Performance</div>
              <div className="gtm-pct">99%</div>
            </div>
            <div>
              <div style={{ color: '#5b6270', fontSize: 15 }}>Structure</div>
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

      <svg className="wave" viewBox="0 0 1440 220" preserveAspectRatio="none">
        <path d="M0 160 C 180 60, 360 220, 540 140 C 720 60, 900 200, 1080 130 C 1260 70, 1440 160, 1440 160 L1440 220 L0 220 Z" fill="rgba(0,0,0,0.18)" />
        <path d="M0 160 C 180 60, 360 220, 540 140 C 720 60, 900 200, 1080 130 C 1260 70, 1440 160, 1440 160" stroke="#5dd3a0" strokeWidth="3" fill="none" />
        {[540, 720, 900, 1080].map((cx, i) => (
          <circle key={i} cx={cx} cy={[140, 100, 200, 130][i]} r="6" fill="#fff" />
        ))}
      </svg>
    </section>
  );
}

/* ─────────────────── Features Grid ─────────────────── */
const FEATURE_CARDS = [
  { title: 'Cart Upsell Products', emoji: '🛒', color: '#e9ebef' },
  { title: 'Search Suggest',       emoji: '🔍', color: '#e1f0f7' },
  { title: 'Vendor Logo',          emoji: '🏷',  color: '#f0f7e1' },
  { title: 'Product 360°',         emoji: '🔄', color: '#f7e9e1' },
  { title: 'Bundle Product',       emoji: '📦', color: '#ede1f7' },
  { title: 'Product Navigation',   emoji: '🗂',  color: '#e1f7f0' },
  { title: 'Save For Later',       emoji: '❤️',  color: '#f7e1e1' },
  { title: 'Image Focal Point',    emoji: '🎯', color: '#f7f5e1' },
  { title: 'Scroll Animation',     emoji: '✨', color: '#e1e9f7' },
  { title: 'Preload Icon',         emoji: '⚡', color: '#f7eee1' },
  { title: 'Product Group Option', emoji: '🎨', color: '#ede1f7' },
  { title: 'Subscription Product', emoji: '🔁', color: '#e1f7e9' },
];

function FeaturesGrid() {
  return (
    <section className="section section-soft" id="features">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Always evolving</span>
          <h2 className="section-title">The list of great features</h2>
          <p className="lead">Updated regularly — bringing the best experience to our customers.</p>
        </div>
        <div className="feat-grid">
          {FEATURE_CARDS.map((c) => (
            <div key={c.title} className="feat-card">
              <div className="feat-ill" style={{ background: c.color }}>
                <span style={{ fontSize: 56 }}>{c.emoji}</span>
              </div>
              <div className="feat-body">
                <div className="feat-title">{c.title}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <a className="btn btn-dark btn-lg" href="#pricing">And More…</a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Boost Traffic ─────────────────── */
const BOOST_ITEMS = [
  { title: 'Free Shipping Bar',       desc: 'Motivate your customers to buy more by offering free shipping.',                     emoji: '🚚', bg: '#fff3e6' },
  { title: 'Promotion Popup',          desc: 'Keep your customers shopping and maximize product awareness.',                        emoji: '🎁', bg: '#fce6e6' },
  { title: 'Countdown Timer',          desc: 'A great way to promote your business and create urgency.',                           emoji: '⏱', bg: '#f3f2ed' },
  { title: 'Custom Product Option',    desc: 'Grow sales with sticky add cart, real-time visitor, recently viewed products.',      emoji: '🎛', bg: '#f1f2f5' },
  { title: 'Live Chat',               desc: 'Speed up your customer service and positively impact your sales.',                   emoji: '💬', bg: '#fcd4d4' },
  { title: 'Shoppable Images',         desc: 'Add tags to your product images & shorten the purchasing process.',                  emoji: '🏷',  bg: '#fff5e6' },
  { title: 'Compare Color',            desc: 'Help customers have an overview of all colors to make the right choice.',           emoji: '🎨', bg: '#e6ebe6' },
  { title: 'Buy Together',             desc: 'Increase your average order value. Decrease your marketing costs.',                  emoji: '🤝', bg: '#e7dfd2' },
  { title: 'Size Chart',              desc: 'Increases conversions, reduces returns, and improves the consumer experience.',      emoji: '📏', bg: '#e0e9d3' },
  { title: 'Effective Product Page',  desc: 'Grow sales with sticky add cart, real-time visitor, recently viewed products.',      emoji: '🛍',  bg: '#f0eee9' },
];

function BoostTraffic() {
  return (
    <section className="section section-white">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Perfect for E-commerce</span>
          <h2 className="section-title">Boost The Traffic</h2>
          <p className="lead">Vesta focuses on customer experience and behavior to provide the best features for enticing customers and boosting sales.</p>
        </div>
        <div className="boost-grid">
          {BOOST_ITEMS.map((it) => (
            <div key={it.title} className="boost-card">
              <div className="boost-ill" style={{ background: it.bg }}>
                <span style={{ fontSize: 72 }}>{it.emoji}</span>
              </div>
              <div className="boost-title">{it.title}</div>
              <div className="boost-desc">{it.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <a className="btn btn-dark btn-lg" href="#pricing">And More…</a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Color Schemes ─────────────────── */
const PALETTES = [
  { name: 'Forest', primary: '#26a66a', bg: '#2c4a2a' },
  { name: 'Ocean',  primary: '#2f80ed', bg: '#1c2a47' },
  { name: 'Sunset', primary: '#ff5b48', bg: '#3b1e1c' },
  { name: 'Plum',   primary: '#7b5cff', bg: '#3a2358' },
  { name: 'Mono',   primary: '#0c0d10', bg: '#1c1d22' },
  { name: 'Honey',  primary: '#f6b733', bg: '#3a2c10' },
];

function ColorSchemes() {
  const [active, setActive] = useState(0);
  const p = PALETTES[active];

  return (
    <section className="section" style={{ background: 'linear-gradient(170deg,#d8f0e0,#d6c8ff)' }}>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Hot feature</span>
          <h2 className="section-title">Color Schemes</h2>
          <p className="lead">Apply your brand colors for a standout shopping experience across every section.</p>
        </div>

        <div className="cs-stage">
          {/* Store preview */}
          <div className="cs-preview">
            <div style={{ background: p.primary, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 250ms' }}>
              <span style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>LOGO</span>
              <span style={{ display: 'flex', gap: 10 }}>
                <span style={{ width: 26, height: 8, background: 'rgba(255,255,255,0.3)', borderRadius: 4 }} />
                <span style={{ width: 26, height: 8, background: 'rgba(255,255,255,0.3)', borderRadius: 4 }} />
              </span>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 12 }}>5</span>
            </div>
            <div style={{ flex: 1, background: p.bg, padding: 18, display: 'flex', flexDirection: 'column', gap: 14, transition: 'background 250ms' }}>
              <div>
                <div style={{ height: 12, width: '60%', background: 'rgba(255,255,255,0.18)', borderRadius: 4, marginBottom: 6 }} />
                <div style={{ height: 8, width: '80%', background: 'rgba(255,255,255,0.12)', borderRadius: 4 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 96px', gap: 12, alignItems: 'center' }}>
                <div>
                  <div style={{ height: 8, width: '70%', background: 'rgba(255,255,255,0.14)', borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ height: 8, width: '55%', background: 'rgba(255,255,255,0.10)', borderRadius: 4, marginBottom: 12 }} />
                  <div style={{ background: p.primary, color: '#fff', padding: '8px 14px', borderRadius: 999, fontSize: 11, fontWeight: 700, display: 'inline-flex', transition: 'background 250ms' }}>Shop Now ▸</div>
                </div>
                <div style={{ background: '#f5d3c5', borderRadius: 12, aspectRatio: '3/4', display: 'grid', placeItems: 'center', fontSize: 30 }}>🧴</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginTop: 'auto' }}>
                {[0,1,2,3].map((i) => <span key={i} style={{ aspectRatio: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 7 }} />)}
              </div>
              <div style={{ background: p.primary, height: 34, borderRadius: 9, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 10, fontWeight: 700, transition: 'background 250ms' }}>────</div>
            </div>
          </div>

          {/* Picker controls */}
          <div className="cs-controls">
            <div style={{ borderRadius: 14, aspectRatio: '4/3', background: `linear-gradient(180deg,transparent,rgba(0,0,0,0.9)),linear-gradient(90deg,#fff,${p.primary})`, position: 'relative', cursor: 'pointer', overflow: 'hidden' }} onClick={() => setActive((active + 1) % PALETTES.length)}>
              <div style={{ position: 'absolute', width: 22, height: 22, borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.2)', top: `${20 + active * 12}%`, left: `${40 + (active * 9) % 50}%`, transform: 'translate(-50%,-50%)', transition: 'top 200ms, left 200ms' }} />
            </div>
            <div style={{ marginTop: 12, height: 14, borderRadius: 8, background: 'linear-gradient(90deg,#ff5252,#ff9b3d,#f7e94a,#6ddc6a,#2eb8e6,#4a64ff,#9b4af7,#ff5252)' }} />

            <div className="cs-row">
              <span className="cs-swatch" style={{ background: p.primary }} />
              <div><div className="cs-lbl">Primary Color</div><div className="cs-hex">{p.primary.toUpperCase()}</div></div>
            </div>
            <div className="cs-row">
              <span className="cs-swatch" style={{ background: p.bg }} />
              <div><div className="cs-lbl">Background gradient</div><div className="cs-hex">{p.bg.toUpperCase()}</div></div>
            </div>

            <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PALETTES.map((pal, i) => (
                <button key={i} onClick={() => setActive(i)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: i === active ? '#e6f7ee' : '#fff',
                  border: i === active ? `1.5px solid ${pal.primary}` : '1.5px solid #e4e7ec',
                  padding: '6px 12px 6px 6px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5, fontWeight: 700,
                }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: pal.primary }} />
                  {pal.name}
                </button>
              ))}
            </div>
          </div>
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
    { num: '$1.2M+', lbl: 'GMV powered by Vesta' },
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

/* ─────────────────── Pricing ─────────────────── */
const PLANS = [
  {
    tier: 'Starter', price: 49, per: '/ store',
    blurb: 'For founders launching their first storefront.',
    features: ['1 Shopify storefront license', 'All 24 demo layouts', '6 months of updates', 'Email support'],
    cta: 'Get Starter', featured: false,
  },
  {
    tier: 'Studio', price: 89, per: '/ store',
    blurb: 'Best for serious brands and agencies starting out.',
    features: ['3 Shopify storefront licenses', 'All 24 demo layouts + premium', 'Lifetime updates & new demos', 'Priority chat support — 24h SLA', 'Migration assistance'],
    cta: 'Get Studio →', featured: true, ribbon: 'Most Popular',
  },
  {
    tier: 'Agency', price: 249, per: '/ team',
    blurb: 'Unlimited client builds for agencies and partners.',
    features: ['Unlimited client licenses', 'Everything in Studio', 'Custom section requests', 'Dedicated Slack channel', 'White-label demos'],
    cta: 'Talk to sales', featured: false,
  },
];

function Pricing() {
  return (
    <section className="section section-white" id="pricing">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Pick your plan</span>
          <h2 className="section-title">One-time payment.<br />Lifetime everything.</h2>
          <p className="lead">No subscriptions, no per-store fees. Pay once and ship your storefront today.</p>
        </div>
        <div className="pricing-grid">
          {PLANS.map((plan) => (
            <div key={plan.tier} className={`price-card${plan.featured ? ' price-card-featured' : ''}`}>
              {plan.ribbon && <span className="price-ribbon">{plan.ribbon}</span>}
              <div className="price-tier">{plan.tier}</div>
              <div className="price-amount"><span className="price-cur">$</span>{plan.price}<span className="price-per">{plan.per}</span></div>
              <div className="price-blurb">{plan.blurb}</div>
              <ul className="price-list">
                {plan.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <a href="#" className={`btn btn-full${plan.featured ? ' btn-primary' : plan.tier === 'Agency' ? ' btn-dark' : ' btn-ghost'}`}>{plan.cta}</a>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 28, color: '#5b6270' }}>
          🔒 Secure checkout · 30-day money-back guarantee · VAT included
        </p>
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
          <h2 className="section-title">28,000+ stores running Vesta</h2>
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
  { q: 'Will it slow down my store?',              a: 'Vesta consistently scores 95–100 on PageSpeed Insights with content-rich storefronts. The theme ships only what each page needs and uses native Shopify primitives wherever possible.' },
  { q: 'Do I need a developer to install it?',     a: 'No. Every section is configurable through Shopify\'s theme editor. Most merchants are live within an afternoon. Studio and Agency tiers include migration assistance if you\'d like a hand.' },
  { q: 'Can I customize the design later?',        a: 'Yes — color schemes, fonts, layouts and 80+ blocks are exposed in the editor. Liquid source is included if you want to dig deeper.' },
  { q: 'What if it\'s not for me?',               a: 'We offer a no-questions 30-day refund. If Vesta doesn\'t fit your business, email us within 30 days of purchase.' },
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
          <a href="#pricing" className="btn btn-primary btn-lg">Buy Vesta — $89 →</a>
          <a href="#demos"   className="btn btn-ghost-light btn-lg">See live demos</a>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 22, fontSize: 13 }}>
          30-day money-back guarantee · Secure checkout via Stripe
        </p>
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
              <span style={{ fontWeight: 900, color: '#fff', fontSize: 22, letterSpacing: '-0.02em' }}>VESTA</span>
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
          <span>© 2026 Vesta Studio. All rights reserved.</span>
          <span>Made with ⚡ for Shopify merchants.</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────── Mobile Sticky Bar ─────────────────── */
const TIMER_START = 9 * 60; // 9 minutes in seconds

function MobileStickyBar() {
  const [seconds, setSeconds] = useState(TIMER_START);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(id); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [dismissed]);

  if (dismissed) return null;

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const expired = seconds === 0;

  return (
    <div className="msb">
      <button className="msb-close" onClick={() => setDismissed(true)} aria-label="Close">×</button>

      {/* Urgency row */}
      <div className="msb-top">
        <span className="msb-fire">🔥</span>
        <span className="msb-urgent">Limited time offer — ends in</span>
        <span className={`msb-timer${expired ? ' msb-timer-red' : ''}`}>
          {expired ? 'EXPIRED' : `${mm}:${ss}`}
        </span>
      </div>

      {/* Price + CTA row */}
      <div className="msb-bottom">
        <div className="msb-prices">
          <span className="msb-mrp">₹32,000</span>
          <span className="msb-now">₹2,499</span>
          <span className="msb-off">92% OFF</span>
        </div>
        <a href="#pricing" className="msb-btn">
          Buy Theme Now →
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
        <title>VESTA — The Perfect Shopify Theme For Your Business</title>
        <meta name="description" content="The fastest Shopify 2.0 theme on the market. One-time payment, lifetime updates, 30-day refund. Built for speed, polished for taste, tuned for conversion." />
        <meta property="og:title" content="VESTA Shopify Theme" />
        <meta property="og:description" content="The fastest Shopify 2.0 theme on the market." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <Nav />
      <Hero />
      <Performance />
      <FeaturesGrid />
      <BoostTraffic />
      <ColorSchemes />
      <Stats />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
      <MobileStickyBar />
    </>
  );
}

