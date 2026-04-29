import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DestinationCard from '../components/destination/DestinationCard';
import DestinationModal from '../components/destination/DestinationModal';
import PageTransition from '../components/ui/PageTransition';
import { destinations } from '../data/destinations';
import './Home.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const featured = destinations.filter(d => d.featured);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/explore?q=${encodeURIComponent(search)}`);
  };

  return (
    <PageTransition>
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
            <div className="hero__bg-grid" />
          </div>

          <div className="hero__content">
            <motion.p className="hero__eyebrow" {...fadeUp(0)}>The World Awaits</motion.p>

            <motion.h1 className="hero__title" {...fadeUp(0.1)}>
              Curated Journeys<br />
              <em>Beyond the Ordinary</em>
            </motion.h1>

            <motion.p className="hero__sub" {...fadeUp(0.2)}>
              Discover handpicked destinations, build seamless itineraries,<br />
              and travel with purpose.
            </motion.p>

            <motion.form className="hero__search" onSubmit={handleSearch} {...fadeUp(0.3)}>
              <span className="hero__search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search destinations, experiences…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="hero__search-input"
              />
              <button type="submit" className="hero__search-btn">Search</button>
            </motion.form>

            <motion.div className="hero__stats" {...fadeUp(0.4)}>
              {[
                { num: '180+', label: 'Destinations' },
                { num: '50K+', label: 'Travelers' },
                { num: '4.9★', label: 'Avg Rating' },
              ].map((s, i) => (
                <>
                  {i > 0 && <div key={`d${i}`} className="hero__stat-divider" />}
                  <div key={s.label} className="hero__stat">
                    <span className="hero__stat-num">{s.num}</span>
                    <span className="hero__stat-label">{s.label}</span>
                  </div>
                </>
              ))}
            </motion.div>
          </div>

          <div className="hero__scroll-hint">
            <span>Scroll</span>
            <div className="hero__scroll-line" />
          </div>
        </section>

        {/* ── Marquee ticker ── */}
        <div className="marquee-strip">
          <div className="marquee-track">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="marquee-inner">
                {['Santorini', 'Kyoto', 'Maldives', 'Patagonia', 'Amalfi', 'Marrakech', 'Bali', 'Dubrovnik'].map(n => (
                  <span key={n} className="marquee-item">
                    <span className="marquee-dot">✦</span> {n}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── Featured Cards ── */}
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
              {featured.map((dest, i) => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  index={i}
                  onSelect={setSelected}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Editorial Banner ── */}
        <section className="editorial">
          <div className="editorial__inner">
            <div className="editorial__text">
              <p className="section-eyebrow">✦ Our Philosophy</p>
              <h2 className="editorial__title">Travel is not<br /><em>a destination,</em><br />it's a state of mind.</h2>
              <p className="editorial__body">
                We believe the most transformative journeys are those that strip away the familiar and replace it with wonder.
                Every destination we curate is chosen for its ability to do exactly that.
              </p>
              <button className="editorial__cta" onClick={() => navigate('/explore')}>
                Begin Your Journey →
              </button>
            </div>
            <div className="editorial__image-stack">
              <div className="editorial__img editorial__img--back">
                <img src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&q=80" alt="travel" />
              </div>
              <div className="editorial__img editorial__img--front">
                <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80" alt="travel" />
              </div>
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
                { icon: '✦', num: '01', title: 'Curated Selection', desc: 'Every destination is vetted and chosen for exceptional, transformative experiences.' },
                { icon: '◈', num: '02', title: 'Smart Itineraries', desc: 'Build precise day-by-day plans with times, routes, and flexible alternatives.' },
                { icon: '◉', num: '03', title: 'Budget Clarity', desc: 'Plan every dollar with our transparent, category-level cost breakdown tool.' },
              ].map(item => (
                <motion.div
                  key={item.title}
                  className="why__card"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="why__num">{item.num}</span>
                  <span className="why__icon">{item.icon}</span>
                  <h3 className="why__title">{item.title}</h3>
                  <p className="why__desc">{item.desc}</p>
                  <div className="why__card-line" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {selected && (
        <DestinationModal destination={selected} onClose={() => setSelected(null)} />
      )}
    </PageTransition>
  );
}