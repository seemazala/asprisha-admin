import React from 'react';

const Footer = ({ setActivePage }) => {
  const quickLinks = ['Home', 'About', 'Services', 'Portfolio', 'Contact'];

  const services = [
    'Portfolio Website',
    'Business Website',
    'Web Application',
    'E-Commerce Website',
    'Mobile Application',
    'Bug Fixing & Maintenance',
  ];

  return (
    <footer className="footer">
      <div className="footer-grid">

        {/* ── Brand ── */}
        <div className="footer-brand">

          {/* Logo — same style as Navbar (column layout) */}
          <div
            className="logo-wrapper"
            onClick={() => setActivePage('Home')}
            style={{ marginBottom: '1rem', cursor: 'pointer' }}
          >
            <img
              src="/logo.png"
              alt="AISPL Logo"
              className="footer-logo-img"
              onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
            />
            <div className="logo-text-block">
              <div className="logo-text">AISPL</div>
              <div className="logo-subtext">Asprisha Innovation Solutions Pvt. Ltd.</div>
            </div>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: 1.7 }}>
            Transforming Ideas Into Digital Excellence.<br />
            Jamnagar, Gujarat · Est. 2017
          </p>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/asprisha.innovative"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              marginTop: '1rem', color: 'var(--teal)', fontSize: '0.82rem',
              textDecoration: 'none', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <span style={{ fontSize: '1rem' }}>📸</span>
            @asprisha.innovative
          </a>
        </div>

        {/* ── Quick Links ── */}
        <div>
          <div className="footer-heading">Quick Links</div>
          {quickLinks.map((link) => (
            <button key={link} onClick={() => setActivePage(link)} className="footer-link">
              {link}
            </button>
          ))}
        </div>

        {/* ── Services ── */}
        <div>
          <div className="footer-heading">Services</div>
          {services.map((s) => (
            <button key={s} onClick={() => setActivePage('Services')} className="footer-link">
              {s}
            </button>
          ))}
        </div>

        {/* ── Contact ── */}
        <div>
          <div className="footer-heading">Contact</div>
          <div className="footer-contact-list">
            <div>
              <span>📞 </span>
              <a href="tel:+919978567153">+91 9978567153</a>
            </div>
            <div>
              <span>📧 </span>
              <a href="mailto:seemazala0422@gmail.com">seemazala0422@gmail.com</a>
            </div>
            <div style={{ color: 'var(--muted)', lineHeight: 1.5, marginTop: '0.5rem' }}>
              <span>📍 </span>
              40, Digvijay Plot,<br />
              Near Pavan Chaki Road,<br />
              Jamnagar, Gujarat – 361005
            </div>
          </div>

          <button
            onClick={() => setActivePage('Contact')}
            style={{
              marginTop: '1.25rem', background: 'var(--teal)', color: 'var(--navy)',
              border: 'none', borderRadius: '8px', padding: '10px 20px',
              cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '0.82rem', letterSpacing: '0.04em', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Start a Project →
          </button>
        </div>

      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer-bottom">
        <div className="footer-bottom-text">
          © 2026 Asprisha Innovation Solutions Pvt. Ltd. · CIN: U74999GJ2017PTC100177
        </div>
        <div className="footer-bottom-text">
          Innovate · Develop · Deploy · Grow
        </div>
      </div>
    </footer>
  );
};

export default Footer;