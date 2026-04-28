import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DestinationCard from '../components/destination/DestinationCard';
import { destinations } from '../data/destinations';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const featured = destinations.filter(d => d.featured);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/explore?q=${encodeURIComponent(search)}`);
  };

  return (
    <main className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"
            alt="travel background"
            className="hero__bg-img"
          />
          <div className="hero__bg-overlay" />
        </div>

        <div className="hero__content">
          <p className="hero__eyebrow">The World Awaits</p>
          <h1 className="hero__title">
            Curated Journeys<br />
            <em>Beyond the Ordinary</em>
          </h1>
          <p className="hero__sub">
            Discover handpicked destinations, build seamless itineraries,<br />
            and travel with purpose.
          </p>

          <form className="hero__search" onSubmit={handleSearch}>
            <span className="hero__search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search destinations, experiences…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="hero__search-input"
            />
            <button type="submit" className="hero__search-btn">Search</button>
          </form>

          <div className="hero__stats">
            <div className="hero__stat"><span className="hero__stat-num">180+</span><span className="hero__stat-label">Destinations</span></div>
            <div className="hero__stat-divider" />
            <div className="hero__stat"><span className="hero__stat-num">50K+</span><span className="hero__stat-label">Travelers</span></div>
            <div className="hero__stat-divider" />
            <div className="hero__stat"><span className="hero__stat-num">4.9★</span><span className="hero__stat-label">Avg Rating</span></div>
          </div>
        </div>

        <div className="hero__scroll-hint">
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── Featured ── */}
      <section className="featured">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">✦ Handpicked</p>
              <h2 className="section-title">Featured Escapes</h2>
            </div>
            <button className="section-link" onClick={() => navigate('/explore')}>
              View All <span>→</span>
            </button>
          </div>

          <div className="featured__grid">
            {featured.map(dest => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onSelect={() => navigate('/explore')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Voya ── */}
      <section className="why">
        <div className="section-inner">
          <p className="section-eyebrow">✦ Our Promise</p>
          <h2 className="section-title">Travel, Elevated</h2>
          <div className="why__grid">
            {[
              { icon: '✦', title: 'Curated Selection', desc: 'Every destination is vetted and curated for exceptional experiences.' },
              { icon: '◈', title: 'Smart Itineraries', desc: 'Build day-by-day itineraries with time, routes, and alternatives.' },
              { icon: '◉', title: 'Budget Clarity', desc: 'Plan every dollar with our transparent cost breakdown tool.' },
            ].map(item => (
              <div key={item.title} className="why__card">
                <span className="why__icon">{item.icon}</span>
                <h3 className="why__title">{item.title}</h3>
                <p className="why__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}