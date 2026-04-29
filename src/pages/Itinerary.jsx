import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';
import './Itinerary.css';

const defaultDays = [
  {
    id: 1, label: 'Day 1',
    items: [
      { id: 1, time: '09:00', title: 'Arrive & Check In', note: 'Hotel check-in, freshen up', type: 'stay' },
      { id: 2, time: '13:00', title: 'Lunch at Local Bistro', note: '', type: 'food' },
      { id: 3, time: '15:00', title: 'Explore Old Town', note: 'Walk the historic quarter', type: 'activity' },
    ]
  },
  {
    id: 2, label: 'Day 2',
    items: [
      { id: 4, time: '08:00', title: 'Sunrise Hike', note: 'Bring water and sunscreen', type: 'activity' },
      { id: 5, time: '12:00', title: 'Beachside Lunch', note: '', type: 'food' },
    ]
  },
  { id: 3, label: 'Day 3', items: [] },
];

const typeConfig = {
  activity: { icon: '◈', color: '#C9A96E', label: 'Activity' },
  food:     { icon: '◉', color: '#6DC9A9', label: 'Dining' },
  stay:     { icon: '◆', color: '#9B8FD4', label: 'Stay' },
  transport:{ icon: '◎', color: '#6EA8D4', label: 'Transport' },
};

export default function Itinerary() {
  const [days, setDays] = useState(defaultDays);
  const [activeDay, setActiveDay] = useState(1);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ time: '', title: '', note: '', type: 'activity' });

  const currentDay = days.find(d => d.id === activeDay);

  const addDay = () => {
    const id = Date.now();
    setDays(prev => [...prev, { id, label: `Day ${prev.length + 1}`, items: [] }]);
    setActiveDay(id);
  };

  const addItem = () => {
    if (!newItem.title.trim()) return;
    setDays(prev => prev.map(d =>
      d.id === activeDay
        ? { ...d, items: [...d.items, { ...newItem, id: Date.now() }].sort((a, b) => a.time.localeCompare(b.time)) }
        : d
    ));
    setNewItem({ time: '', title: '', note: '', type: 'activity' });
    setAdding(false);
  };

  const removeItem = (itemId) => {
    setDays(prev => prev.map(d =>
      d.id === activeDay
        ? { ...d, items: d.items.filter(i => i.id !== itemId) }
        : d
    ));
  };

  return (
    <PageTransition>
      <main className="itinerary">
        {/* Sidebar */}
        <aside className="itinerary__sidebar">
          <div className="itinerary__sidebar-header">
            <p className="section-eyebrow">✦ Your Trip</p>
            <h2 className="itinerary__sidebar-title">Itinerary</h2>
          </div>

          <div className="itinerary__days">
            {days.map(day => (
              <button
                key={day.id}
                className={`itinerary__day-btn ${activeDay === day.id ? 'itinerary__day-btn--active' : ''}`}
                onClick={() => setActiveDay(day.id)}
              >
                <span className="itinerary__day-label">{day.label}</span>
                <span className="itinerary__day-count">{day.items.length}</span>
              </button>
            ))}
            <button className="itinerary__add-day" onClick={addDay}>+ Add Day</button>
          </div>

          {/* Type legend */}
          <div className="itinerary__legend">
            {Object.entries(typeConfig).map(([key, cfg]) => (
              <div key={key} className="itinerary__legend-item">
                <span style={{ color: cfg.color }}>{cfg.icon}</span>
                <span>{cfg.label}</span>
              </div>
            ))}
          </div>

          <div className="itinerary__overview">
            <div className="itinerary__overview-stat">
              <span className="itinerary__overview-num">{days.length}</span>
              <span className="itinerary__overview-label">Days</span>
            </div>
            <div className="itinerary__overview-divider" />
            <div className="itinerary__overview-stat">
              <span className="itinerary__overview-num">{days.reduce((a, d) => a + d.items.length, 0)}</span>
              <span className="itinerary__overview-label">Activities</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="itinerary__content">
          <div className="itinerary__content-header">
            <div>
              <h3 className="itinerary__content-title">{currentDay?.label}</h3>
              <p className="itinerary__content-meta">{currentDay?.items.length || 0} activities planned</p>
            </div>
            <button className="itinerary__add-btn" onClick={() => setAdding(true)}>+ Add Activity</button>
          </div>

          {/* Add form */}
          <AnimatePresence>
            {adding && (
              <motion.div
                className="itinerary__add-form"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="itinerary__form-row">
                  <input type="time" value={newItem.time} onChange={e => setNewItem(p => ({ ...p, time: e.target.value }))} className="itinerary__input itinerary__input--time" />
                  <input type="text" placeholder="Activity title" value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))} className="itinerary__input itinerary__input--title" />
                  <select value={newItem.type} onChange={e => setNewItem(p => ({ ...p, type: e.target.value }))} className="itinerary__input itinerary__input--type">
                    {Object.entries(typeConfig).map(([k, v]) => (
                      <option key={k} value={k}>{v.icon} {v.label}</option>
                    ))}
                  </select>
                </div>
                <input type="text" placeholder="Notes (optional)" value={newItem.note} onChange={e => setNewItem(p => ({ ...p, note: e.target.value }))} className="itinerary__input itinerary__input--note" />
                <div className="itinerary__form-actions">
                  <button className="itinerary__form-save" onClick={addItem}>Save</button>
                  <button className="itinerary__form-cancel" onClick={() => setAdding(false)}>Cancel</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timeline */}
          <div className="itinerary__timeline">
            {currentDay?.items.length === 0 && !adding && (
              <div className="itinerary__empty">
                <span className="itinerary__empty-icon">◯</span>
                <p>No activities yet for {currentDay?.label}.</p>
                <p>Add your first stop above.</p>
              </div>
            )}

            <AnimatePresence>
              {currentDay?.items.map((item, idx) => {
                const cfg = typeConfig[item.type] || typeConfig.activity;
                return (
                  <motion.div
                    key={item.id}
                    className="itinerary__item"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <div className="itinerary__item-time">{item.time || '—'}</div>
                    <div className="itinerary__item-line">
                      <div className="itinerary__item-dot" style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}55` }} />
                      {idx < currentDay.items.length - 1 && <div className="itinerary__item-connector" />}
                    </div>
                    <div className="itinerary__item-body">
                      <div className="itinerary__item-header">
                        <span className="itinerary__item-type-tag" style={{ color: cfg.color, borderColor: `${cfg.color}33` }}>
                          {cfg.icon} {cfg.label}
                        </span>
                        <button className="itinerary__item-remove" onClick={() => removeItem(item.id)}>✕</button>
                      </div>
                      <p className="itinerary__item-title">{item.title}</p>
                      {item.note && <p className="itinerary__item-note">{item.note}</p>}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}