import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DestinationModal.css';

export default function DestinationModal({ destination, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!destination) return null;
  const { name, country, continent, image, price, duration, rating, tags, description } = destination;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <motion.div
          className="modal"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal__image-wrap">
            <img src={image} alt={name} className="modal__image" />
            <div className="modal__image-overlay" />
            <button className="modal__close" onClick={onClose}>✕</button>
            <div className="modal__image-info">
              <h2 className="modal__name">{name}</h2>
              <p className="modal__country">{country} · {continent}</p>
            </div>
          </div>

          <div className="modal__body">
            <div className="modal__meta">
              <div className="modal__meta-item">
                <span className="modal__meta-label">From</span>
                <span className="modal__meta-val">${price.toLocaleString()}</span>
              </div>
              <div className="modal__meta-divider" />
              <div className="modal__meta-item">
                <span className="modal__meta-label">Duration</span>
                <span className="modal__meta-val">{duration}</span>
              </div>
              <div className="modal__meta-divider" />
              <div className="modal__meta-item">
                <span className="modal__meta-label">Rating</span>
                <span className="modal__meta-val">★ {rating}</span>
              </div>
            </div>

            <p className="modal__desc">{description} Experience world-class hospitality, breathtaking scenery, and memories that last a lifetime.</p>

            <div className="modal__tags">
              {tags.map(tag => (
                <span key={tag} className="modal__tag">{tag}</span>
              ))}
            </div>

            <div className="modal__actions">
              <button className="modal__cta">Plan This Trip →</button>
              <button className="modal__secondary" onClick={onClose}>Back to Explore</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}