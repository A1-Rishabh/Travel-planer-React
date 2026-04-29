import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';
import { budgetCategories } from '../data/destinations';
import './Budget.css';

const defaultExpenses = [
  { id: 1, category: 'flights',       label: 'Round-trip Flights',  amount: 850  },
  { id: 2, category: 'accommodation', label: 'Hotel (7 nights)',    amount: 1400 },
  { id: 3, category: 'food',          label: 'Dining budget',       amount: 420  },
  { id: 4, category: 'activities',    label: 'Tours & Entry Fees',  amount: 280  },
  { id: 5, category: 'transport',     label: 'Local Transport',     amount: 150  },
];

export default function Budget() {
  const [expenses, setExpenses]       = useState(defaultExpenses);
  const [totalBudget, setTotalBudget] = useState(4000);
  const [adding, setAdding]           = useState(false);
  const [newExp, setNewExp]           = useState({ category: 'activities', label: '', amount: '' });

  const totalSpent = expenses.reduce((a, e) => a + e.amount, 0);
  const remaining  = totalBudget - totalSpent;
  const pct        = Math.min((totalSpent / totalBudget) * 100, 100);
  const overBudget = remaining < 0;

  const byCategory = budgetCategories.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.id).reduce((a, e) => a + e.amount, 0),
  })).filter(c => c.total > 0);

  const addExpense = () => {
    if (!newExp.label || !newExp.amount) return;
    setExpenses(prev => [...prev, { ...newExp, id: Date.now(), amount: parseFloat(newExp.amount) }]);
    setNewExp({ category: 'activities', label: '', amount: '' });
    setAdding(false);
  };

  const removeExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));

  return (
    <PageTransition>
      <main className="budget">

        {/* Hero */}
        <div className="budget__hero">
          <div className="budget__hero-inner">
            <p className="section-eyebrow">✦ Trip Finance</p>
            <h1 className="budget__title">Budget Planner</h1>
            <p className="budget__subtitle">Plan every dollar. Travel without surprises.</p>
          </div>
        </div>

        <div className="budget__inner">

          {/* ── Left column ── */}
          <div className="budget__left">

            {/* Total overview card */}
            <div className="budget__overview">
              <div className="budget__overview-top">
                <div>
                  <p className="budget__label">Total Budget</p>
                  <div className="budget__total-edit">
                    <span className="budget__currency">$</span>
                    <input
                      type="number"
                      value={totalBudget}
                      onChange={e => setTotalBudget(Number(e.target.value))}
                      className="budget__total-input"
                    />
                  </div>
                </div>

                <div className="budget__summary">
                  <div className="budget__summary-item">
                    <span className="budget__summary-val" style={{ color: '#D46E6E' }}>
                      ${totalSpent.toLocaleString()}
                    </span>
                    <span className="budget__summary-label">Allocated</span>
                  </div>
                  <div className="budget__summary-divider" />
                  <div className="budget__summary-item">
                    <span className="budget__summary-val" style={{ color: overBudget ? '#D46E6E' : '#6DC9A9' }}>
                      {overBudget ? '-' : '+'}${Math.abs(remaining).toLocaleString()}
                    </span>
                    <span className="budget__summary-label">{overBudget ? 'Over Budget' : 'Remaining'}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="budget__progress-wrap">
                <div className="budget__progress-track">
                  <motion.div
                    className="budget__progress-fill"
                    style={{ background: overBudget ? '#D46E6E' : 'var(--gold)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </div>
                <span className="budget__progress-pct">{Math.round(pct)}%</span>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="budget__categories">
              <h3 className="budget__section-title">By Category</h3>
              <div className="budget__cat-list">
                {byCategory.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    className="budget__cat-row"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <span className="budget__cat-icon">{cat.icon}</span>
                    <span className="budget__cat-label">{cat.label}</span>
                    <div className="budget__cat-bar-wrap">
                      <div className="budget__cat-bar-track">
                        <motion.div
                          className="budget__cat-bar-fill"
                          style={{ background: cat.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(cat.total / totalSpent) * 100}%` }}
                          transition={{ duration: 0.7, delay: i * 0.07 }}
                        />
                      </div>
                    </div>
                    <span className="budget__cat-pct">
                      {Math.round((cat.total / totalSpent) * 100)}%
                    </span>
                    <span className="budget__cat-total">${cat.total.toLocaleString()}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Donut-style visual summary */}
            <div className="budget__rings">
              {byCategory.map(cat => (
                <div key={cat.id} className="budget__ring-item">
                  <div className="budget__ring-circle" style={{ borderColor: cat.color }}>
                    <span style={{ color: cat.color }}>{cat.icon}</span>
                  </div>
                  <span className="budget__ring-label">{cat.label}</span>
                  <span className="budget__ring-val">${cat.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column — Expense list ── */}
          <div className="budget__right">
            <div className="budget__expenses-header">
              <h3 className="budget__section-title">Expenses</h3>
              <button className="budget__add-btn" onClick={() => setAdding(true)}>+ Add</button>
            </div>

            <AnimatePresence>
              {adding && (
                <motion.div
                  className="budget__add-form"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                >
                  <select value={newExp.category} onChange={e => setNewExp(p => ({ ...p, category: e.target.value }))} className="budget__input">
                    {budgetCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                  <input type="text" placeholder="Description" value={newExp.label} onChange={e => setNewExp(p => ({ ...p, label: e.target.value }))} className="budget__input" />
                  <div className="budget__input-money">
                    <span className="budget__input-currency">$</span>
                    <input type="number" placeholder="0" value={newExp.amount} onChange={e => setNewExp(p => ({ ...p, amount: e.target.value }))} className="budget__input budget__input--amount" />
                  </div>
                  <div className="budget__form-actions">
                    <button className="budget__save-btn" onClick={addExpense}>Save</button>
                    <button className="budget__cancel-btn" onClick={() => setAdding(false)}>Cancel</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="budget__expense-list">
              <AnimatePresence>
                {expenses.map((exp, i) => {
                  const cat = budgetCategories.find(c => c.id === exp.category);
                  const expPct = Math.round((exp.amount / totalSpent) * 100);
                  return (
                    <motion.div
                      key={exp.id}
                      className="budget__expense-item"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.04 }}
                      layout
                    >
                      <div className="budget__expense-icon-wrap" style={{ background: `${cat?.color}18`, borderColor: `${cat?.color}33` }}>
                        <span style={{ color: cat?.color }}>{cat?.icon}</span>
                      </div>
                      <div className="budget__expense-info">
                        <span className="budget__expense-label">{exp.label}</span>
                        <span className="budget__expense-cat">{cat?.label} · {expPct}% of total</span>
                      </div>
                      <span className="budget__expense-amount">${exp.amount.toLocaleString()}</span>
                      <button className="budget__expense-remove" onClick={() => removeExpense(exp.id)}>✕</button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Total footer */}
            <div className="budget__expense-total">
              <span className="budget__expense-total-label">Total Allocated</span>
              <span className="budget__expense-total-val">${totalSpent.toLocaleString()}</span>
            </div>
          </div>

        </div>
      </main>
    </PageTransition>
  );
}