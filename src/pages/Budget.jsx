import { useState } from 'react';
import { budgetCategories } from '../data/destinations';
import './Budget.css';

const defaultExpenses = [
  { id: 1, category: 'flights', label: 'Round-trip Flights', amount: 850 },
  { id: 2, category: 'accommodation', label: 'Hotel (7 nights)', amount: 1400 },
  { id: 3, category: 'food', label: 'Dining budget', amount: 420 },
  { id: 4, category: 'activities', label: 'Tours & Entry Fees', amount: 280 },
  { id: 5, category: 'transport', label: 'Local Transport', amount: 150 },
];

export default function Budget() {
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [totalBudget, setTotalBudget] = useState(4000);
  const [adding, setAdding] = useState(false);
  const [newExp, setNewExp] = useState({ category: 'activities', label: '', amount: '' });

  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
  const remaining = totalBudget - totalSpent;
  const pct = Math.min((totalSpent / totalBudget) * 100, 100);

  const byCategory = budgetCategories.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.id).reduce((a, e) => a + e.amount, 0),
  }));

  const addExpense = () => {
    if (!newExp.label || !newExp.amount) return;
    setExpenses(prev => [...prev, { ...newExp, id: Date.now(), amount: parseFloat(newExp.amount) }]);
    setNewExp({ category: 'activities', label: '', amount: '' });
    setAdding(false);
  };

  const removeExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));

  return (
    <main className="budget">
      <div className="budget__hero">
        <div className="budget__hero-inner">
          <p className="section-eyebrow">✦ Trip Finance</p>
          <h1 className="budget__title">Budget Planner</h1>
        </div>
      </div>

      <div className="budget__inner">
        <div className="budget__left">
          {/* Total budget control */}
          <div className="budget__overview">
            <div className="budget__overview-head">
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
                  <span className="budget__summary-val" style={{ color: '#D46E6E' }}>${totalSpent.toLocaleString()}</span>
                  <span className="budget__summary-label">Allocated</span>
                </div>
                <div className="budget__summary-divider" />
                <div className="budget__summary-item">
                  <span className="budget__summary-val" style={{ color: remaining >= 0 ? '#6DC9A9' : '#D46E6E' }}>
                    {remaining >= 0 ? '+' : ''}${remaining.toLocaleString()}
                  </span>
                  <span className="budget__summary-label">Remaining</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="budget__progress-wrap">
              <div className="budget__progress-bar">
                <div
                  className="budget__progress-fill"
                  style={{ width: `${pct}%`, background: pct > 90 ? '#D46E6E' : 'var(--gold)' }}
                />
              </div>
              <span className="budget__progress-pct">{Math.round(pct)}%</span>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="budget__categories">
            <h3 className="budget__section-title">By Category</h3>
            <div className="budget__cat-list">
              {byCategory.filter(c => c.total > 0).map(cat => (
                <div key={cat.id} className="budget__cat-item">
                  <span className="budget__cat-icon">{cat.icon}</span>
                  <span className="budget__cat-label">{cat.label}</span>
                  <div className="budget__cat-bar-wrap">
                    <div className="budget__cat-bar">
                      <div
                        className="budget__cat-bar-fill"
                        style={{ width: `${(cat.total / totalSpent) * 100}%`, background: cat.color }}
                      />
                    </div>
                  </div>
                  <span className="budget__cat-total">${cat.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="budget__right">
          <div className="budget__expenses-header">
            <h3 className="budget__section-title">Expenses</h3>
            <button className="budget__add-btn" onClick={() => setAdding(true)}>+ Add</button>
          </div>

          {adding && (
            <div className="budget__add-form">
              <select
                value={newExp.category}
                onChange={e => setNewExp(p => ({ ...p, category: e.target.value }))}
                className="budget__input"
              >
                {budgetCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Description"
                value={newExp.label}
                onChange={e => setNewExp(p => ({ ...p, label: e.target.value }))}
                className="budget__input"
              />
              <div className="budget__input-money">
                <span>$</span>
                <input
                  type="number"
                  placeholder="0"
                  value={newExp.amount}
                  onChange={e => setNewExp(p => ({ ...p, amount: e.target.value }))}
                  className="budget__input budget__input--amount"
                />
              </div>
              <div className="budget__form-actions">
                <button className="budget__save-btn" onClick={addExpense}>Save</button>
                <button className="budget__cancel-btn" onClick={() => setAdding(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="budget__expense-list">
            {expenses.map(exp => {
              const cat = budgetCategories.find(c => c.id === exp.category);
              return (
                <div key={exp.id} className="budget__expense-item">
                  <span className="budget__expense-icon" style={{ color: cat?.color }}>{cat?.icon}</span>
                  <div className="budget__expense-info">
                    <span className="budget__expense-label">{exp.label}</span>
                    <span className="budget__expense-cat">{cat?.label}</span>
                  </div>
                  <span className="budget__expense-amount">${exp.amount.toLocaleString()}</span>
                  <button className="budget__expense-remove" onClick={() => removeExpense(exp.id)}>✕</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}