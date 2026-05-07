import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';
import './Itinerary.css';

const defaultDays = [
  {
    id: 1, label: 'Day 1',
    items: [
      {
        id: 1, time: '09:00', title: 'Arrive & Check In', type: 'stay',
        note: 'Hotel check-in, freshen up',
        meta: { location: '123 Street, City', phone: '+1 234 567 890' },
      },
      {
        id: 2, time: '13:00', title: 'Lunch at Local Bistro', type: 'food',
        note: 'Enjoy authentic flavors',
        meta: { cuisine: 'Local Specialties', rating: '4.5 Stars' },
      },
      {
        id: 3, time: '15:00', title: 'Explore Old Town', type: 'activity',
        note: 'Walk the historic quarter',
        meta: { duration: '2 hrs', meetingPoint: 'Central Square' },
      },
    ],
  },
  {
    id: 2, label: 'Day 2',
    items: [
      {
        id: 4, time: '08:00', title: 'Sunrise Hike', type: 'activity',
        note: 'Bring water and sunscreen',
        meta: { duration: '3 hrs', meetingPoint: 'Trail Entrance' },
      },
      {
        id: 5, time: '12:00', title: 'Beachside Lunch', type: 'food',
        note: 'Fresh seafood with ocean views',
        meta: { cuisine: 'Seafood', rating: '4.8 Stars' },
      },
    ],
  },
  { id: 3, label: 'Day 3', items: [] },
];

const typeConfig = {
  activity:  { icon: '✦', color: '#C9A96E', bg: 'rgba(201,169,110,0.18)',  label: 'Activity'  },
  food:      { icon: '◉', color: '#6DC9A9', bg: 'rgba(109,201,169,0.18)', label: 'Dining'    },
  stay:      { icon: '◆', color: '#9B8FD4', bg: 'rgba(155,143,212,0.18)', label: 'Stay'      },
  transport: { icon: '◎', color: '#6EA8D4', bg: 'rgba(110,168,212,0.18)', label: 'Transport' },
};

function MetaChip({ icon, text }) {
  return (
    <span className="itin-item__chip">
      <span className="itin-item__chip-icon">{icon}</span>
      {text}
    </span>
  );
}

function TimelineItem({ item, onRemove, index }) {
  const [expanded, setExpanded] = useState(false);
  const [done, setDone]         = useState(false);
  const cfg = typeConfig[item.type] || typeConfig.activity;

  const renderMeta = () => {
    const { meta } = item;
    if (!meta) return null;
    return (
      <div className="itin-item__meta-row">
        {meta.location    && <MetaChip icon="📍" text={meta.location} />}
        {meta.phone       && <MetaChip icon="📞" text={meta.phone} />}
        {meta.cuisine     && <MetaChip icon="🍽" text={meta.cuisine} />}
        {meta.rating      && <MetaChip icon="⭐" text={meta.rating} />}
        {meta.duration    && <MetaChip icon="⏱" text={meta.duration} />}
        {meta.meetingPoint&& <MetaChip icon="📍" text={meta.meetingPoint} />}
      </div>
    );
  };

  return (
    <motion.div
      className={`itin-item ${done ? 'itin-item--done' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      layout
    >
      {/* Left — time + line */}
      <div className="itin-item__left">
        <span className="itin-item__time">{item.time || '—'}</span>
        <div className="itin-item__track">
          <div className="itin-item__dot" style={{ background: cfg.color, boxShadow: `0 0 10px ${cfg.color}66` }} />
          <div className="itin-item__line" style={{ background: `linear-gradient(to bottom, ${cfg.color}44, transparent)` }} />
        </div>
      </div>

      {/* Card */}
      <div className="itin-item__card">
        <div className="itin-item__card-top">
          <span className="itin-item__badge" style={{ color: cfg.color, background: cfg.bg }}>
            {cfg.icon} {cfg.label}
          </span>

          <div className="itin-item__card-actions">
            <button
              className={`itin-item__done-btn ${done ? 'itin-item__done-btn--active' : ''}`}
              onClick={() => setDone(p => !p)}
              title="Mark complete"
            >✓</button>
            <button
              className="itin-item__expand-btn"
              onClick={() => setExpanded(p => !p)}
            >
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                ‹
              </motion.span>
            </button>
          </div>
        </div>

        <h4 className="itin-item__title">{item.title}</h4>

        <AnimatePresence>
          {expanded && (
            <motion.div
              className="itin-item__expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {renderMeta()}
              {item.note && <p className="itin-item__note">{item.note}</p>}
            </motion.div>
          )}
        </AnimatePresence>

        {!expanded && item.note && (
          <p className="itin-item__note itin-item__note--collapsed">{item.note}</p>
        )}

        <button className="itin-item__remove" onClick={() => onRemove(item.id)}>✕ Remove</button>
      </div>
    </motion.div>
  );
}

export default function Itinerary() {
  const [days, setDays]       = useState(defaultDays);
  const [activeDay, setActiveDay] = useState(1);
  const [adding, setAdding]   = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [newItem, setNewItem] = useState({ time: '', title: '', note: '', type: 'activity', meta: {} });

  const currentDay = days.find(d => d.id === activeDay);

  const filteredItems = filterType === 'all'
    ? currentDay?.items
    : currentDay?.items.filter(i => i.type === filterType);

  const addDay = () => {
    const id = Date.now();
    setDays(prev => [...prev, { id, label: `Day ${prev.length + 1}`, items: [] }]);
    setActiveDay(id);
  };

  const addItem = () => {
    if (!newItem.title.trim()) return;
    setDays(prev => prev.map(d =>
      d.id === activeDay
        ? { ...d, items: [...d.items, { ...newItem, id: Date.now(), meta: {} }].sort((a, b) => a.time.localeCompare(b.time)) }
        : d
    ));
    setNewItem({ time: '', title: '', note: '', type: 'activity', meta: {} });
    setAdding(false);
  };

  const removeItem = (itemId) => {
    setDays(prev => prev.map(d =>
      d.id === activeDay ? { ...d, items: d.items.filter(i => i.id !== itemId) } : d
    ));
  };

  const totalActivities = days.reduce((a, d) => a + d.items.length, 0);

  return (
    <PageTransition>
      <main className="itinerary">

        {/* ── Sidebar ── */}
        <aside className="itin-sidebar">
          <div className="itin-sidebar__header">
            <p className="section-eyebrow">✦ Your Trip</p>
            <h2 className="itin-sidebar__title">Itinerary</h2>
          </div>

          <div className="itin-sidebar__days">
            {days.map(day => (
              <button
                key={day.id}
                className={`itin-sidebar__day ${activeDay === day.id ? 'itin-sidebar__day--active' : ''}`}
                onClick={() => setActiveDay(day.id)}
              >
                <span className="itin-sidebar__day-label">{day.label}</span>
                <span
                  className="itin-sidebar__day-count"
                  style={activeDay === day.id ? { background: 'var(--gold)', color: 'var(--navy)' } : {}}
                >
                  {day.items.length}
                </span>
              </button>
            ))}
            <button className="itin-sidebar__add-day" onClick={addDay}>+ Add Day</button>
          </div>

          {/* Legend */}
          <div className="itin-sidebar__legend">
            {Object.entries(typeConfig).map(([key, cfg]) => (
              <div key={key} className="itin-sidebar__legend-item">
                <span style={{ color: cfg.color, fontSize: '0.75rem' }}>{cfg.icon}</span>
                <span>{cfg.label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="itin-sidebar__stats">
            <div className="itin-sidebar__stat">
              <span className="itin-sidebar__stat-num">{days.length}</span>
              <span className="itin-sidebar__stat-label">Days</span>
            </div>
            <div className="itin-sidebar__stat-divider" />
            <div className="itin-sidebar__stat">
              <span className="itin-sidebar__stat-num">{totalActivities}</span>
              <span className="itin-sidebar__stat-label">Activities</span>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="itin-main">

          {/* Map header */}
          <div className="itin-main__header">
            <div className="itin-main__map-bg" />
            <div className="itin-main__header-content">
              <div>
                <h3 className="itin-main__title">{currentDay?.label}</h3>
                <p className="itin-main__meta">{currentDay?.items.length || 0} Activities Planned</p>
              </div>
              <button className="itin-main__add-btn" onClick={() => setAdding(true)}>
                + Add Activity
              </button>
            </div>

            {/* Type filter pills */}
            <div className="itin-main__filters">
              <button
                className={`itin-filter ${filterType === 'all' ? 'itin-filter--active' : ''}`}
                onClick={() => setFilterType('all')}
                style={filterType === 'all' ? { background: 'rgba(240,235,225,0.15)', color: 'var(--cream)' } : {}}
              >
                All
              </button>
              {Object.entries(typeConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  className={`itin-filter ${filterType === key ? 'itin-filter--active' : ''}`}
                  onClick={() => setFilterType(key)}
                  style={filterType === key
                    ? { background: cfg.bg, color: cfg.color, borderColor: cfg.color }
                    : {}}
                >
                  {cfg.icon} {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="itin-main__body">

            {/* Add form */}
            <AnimatePresence>
              {adding && (
                <motion.div
                  className="itin-add-form"
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="itin-add-form__row">
                    <input
                      type="time"
                      value={newItem.time}
                      onChange={e => setNewItem(p => ({ ...p, time: e.target.value }))}
                      className="itin-add-form__input itin-add-form__input--time"
                    />
                    <input
                      type="text"
                      placeholder="Activity title"
                      value={newItem.title}
                      onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
                      className="itin-add-form__input itin-add-form__input--title"
                    />
                    <select
                      value={newItem.type}
                      onChange={e => setNewItem(p => ({ ...p, type: e.target.value }))}
                      className="itin-add-form__input itin-add-form__input--type"
                    >
                      {Object.entries(typeConfig).map(([k, v]) => (
                        <option key={k} value={k}>{v.icon} {v.label}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={newItem.note}
                    onChange={e => setNewItem(p => ({ ...p, note: e.target.value }))}
                    className="itin-add-form__input itin-add-form__input--note"
                  />
                  <div className="itin-add-form__actions">
                    <button className="itin-add-form__save" onClick={addItem}>Save</button>
                    <button className="itin-add-form__cancel" onClick={() => setAdding(false)}>Cancel</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timeline */}
            <div className="itin-timeline">
              {filteredItems?.length === 0 && !adding && (
                <div className="itin-timeline__empty">
                  <span className="itin-timeline__empty-icon">◯</span>
                  <p>No activities for {currentDay?.label}.</p>
                  <p>Add your first stop above.</p>
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {filteredItems?.map((item, idx) => (
                  <TimelineItem
                    key={item.id}
                    item={item}
                    index={idx}
                    onRemove={removeItem}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </main>
    </PageTransition>
  );
}