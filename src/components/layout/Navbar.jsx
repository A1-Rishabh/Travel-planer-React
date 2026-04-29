import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const navLinks = [
  { label: 'Explore',   path: '/explore'   },
  { label: 'Itinerary', path: '/itinerary' },
  { label: 'Budget',    path: '/budget'    },
];

export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">

        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-mark">✦</span>
          <span className="navbar__logo-text">VOYA</span>
        </Link>

        <ul className="navbar__links">
          {navLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="navbar__link-dot" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/explore" className="navbar__cta">
          Plan a Trip
        </Link>

        <button
          className={`navbar__burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`}>
        <div className="navbar__drawer-inner">
          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__drawer-link ${location.pathname === link.path ? 'navbar__drawer-link--active' : ''}`}
              style={{ transitionDelay: menuOpen ? `${i * 0.06}s` : '0s' }}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/explore" className="navbar__drawer-cta">Plan a Trip →</Link>
        </div>
      </div>
    </nav>
  );
}