import { useState } from 'react';
import { motion } from 'framer-motion';
import './DestinationCard.css';

export default function DestinationCard({ destination, onSelect, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { name, country, image, price, duration, rating, tags, description, featured } = destination;

  return (
    <motion.div
      className={`dest-card ${featured ? 'dest-card--featured' : ''}`}
      onClick={() => onSelect?.(destination)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6 }}
    >
      <div className="dest-card__image-wrap">
        {/* Skeleton shimmer */}
        {!imageLoaded && <div className="dest-card__skeleton" />}

        <img
          src={image}
          alt={name}
          loading="lazy"
          className={`dest-card__image ${imageLoaded ? 'dest-card__image--loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="dest-card__overlay" />

        {featured && <span className="dest-card__badge">Featured</span>}
        <div className="dest-card__rating">
          <span className="dest-card__star">★</span>
          <span>{rating}</span>
        </div>
      </div>

      <div className="dest-card__body">
        <div className="dest-card__tags">
          {tags.slice(0, 2).map(tag => (
            <span key={tag} className="dest-card__tag">{tag}</span>
          ))}
        </div>

        <div className="dest-card__title-row">
          <div>
            <h3 className="dest-card__name">{name}</h3>
            <p className="dest-card__country">{country}</p>
          </div>
          <div className="dest-card__price-block">
            <span className="dest-card__price-from">from</span>
            <span className="dest-card__price">${price.toLocaleString()}</span>
          </div>
        </div>

        <p className="dest-card__desc">{description}</p>

        <div className="dest-card__footer">
          <span className="dest-card__duration">⏱ {duration}</span>
          <button className="dest-card__btn">
            Explore <span className="dest-card__arrow">→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}