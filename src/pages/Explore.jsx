import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import DestinationCard from '../components/destination/DestinationCard';
import DestinationModal from '../components/destination/DestinationModal';
import PageTransition from '../components/ui/PageTransition';
import { destinations, continents } from '../data/destinations';
import './Explore.css';

export default function Explore() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeContinent, setActiveContinent] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let result = [...destinations];
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (activeContinent !== 'All') result = result.filter(d => d.continent === activeContinent);
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return result;
  }, [query, activeContinent, sortBy]);

  return (
    <PageTransition>
      <main className="explore">
        <div className="explore__hero">
          <div className="explore__hero-inner">
            <p className="section-eyebrow">✦ All Destinations</p>
            <h1 className="explore__title">Explore the World</h1>
            <p className="explore__sub">{destinations.length} curated destinations waiting for you</p>
          </div>
        </div>

        <div className="explore__inner">
          <div className="explore__toolbar">
            <div className="explore__search-wrap">
              <span className="explore__search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search by name, country, or tag…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="explore__search"
              />
              {query && (
                <button className="explore__clear" onClick={() => setQuery('')}>✕</button>
              )}
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="explore__sort">
              <option value="featured">Featured First</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>

          <div className="explore__filters">
            {continents.map(c => (
              <motion.button
                key={c}
                className={`explore__filter ${activeContinent === c ? 'explore__filter--active' : ''}`}
                onClick={() => setActiveContinent(c)}
                whileTap={{ scale: 0.96 }}
              >
                {c}
              </motion.button>
            ))}
          </div>

          <div className="explore__results-meta">
            <span>{filtered.length} destination{filtered.length !== 1 ? 's' : ''} found</span>
          </div>

          {filtered.length > 0 ? (
            <div className="explore__masonry">
              {filtered.map((dest, i) => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  index={i}
                  onSelect={setSelected}
                />
              ))}
            </div>
          ) : (
            <div className="explore__empty">
              <p className="explore__empty-icon">◯</p>
              <p className="explore__empty-title">No destinations found</p>
              <p className="explore__empty-sub">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {selected && (
          <DestinationModal destination={selected} onClose={() => setSelected(null)} />
        )}
      </main>
    </PageTransition>
  );
}