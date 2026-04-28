import './DestinationCard.css';

export default function DestinationCard({ destination, onSelect }) {
  const { name, country, image, price, duration, rating, tags, description, featured } = destination;

  return (
    <div className={`dest-card ${featured ? 'dest-card--featured' : ''}`} onClick={() => onSelect?.(destination)}>
      <div className="dest-card__image-wrap">
        <img src={image} alt={name} loading="lazy" className="dest-card__image" />
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
    </div>
  );
}