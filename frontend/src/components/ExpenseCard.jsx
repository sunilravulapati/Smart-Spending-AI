import React, { useState } from 'react';
import { TrendingDown, Plus, Trash2 } from 'lucide-react';

const ExpenseCard = ({ expenses, setExpenses, totalFixed }) => {
  const [expenseType, setExpenseType] = useState('Bill');
  const [newExpense, setNewExpense] = useState({
    name: '', amount: '', type: 'Bill', principal: '', dueDate: ''
  });

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
    setNewExpense({ name: '', amount: '', type: expenseType, principal: '', dueDate: '' });
  };

  const switchType = (type) => {
    setExpenseType(type);
    setNewExpense(prev => ({ ...prev, type }));
  };

  return (
    <div className="card input-card">
      <div className="card-header">
        <TrendingDown size={18} style={{ color: 'var(--accent-red)' }} />
        <h3>Monthly Outflow</h3>
      </div>
      <p className="subtext">Add your recurring bills and loan EMIs.</p>

      {/* Type Toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <button
          onClick={() => switchType('Bill')}
          style={{
            flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid',
            cursor: 'pointer', fontWeight: 700, fontSize: '.78rem', fontFamily: 'inherit',
            background: expenseType === 'Bill' ? 'var(--primary-dim)' : 'var(--surface-2)',
            color: expenseType === 'Bill' ? 'var(--primary)' : 'var(--text-secondary)',
            borderColor: expenseType === 'Bill' ? 'rgba(245,158,11,.25)' : 'var(--border-bright)',
          }}
        >
          Regular Bill
        </button>
        <button
          onClick={() => switchType('Loan')}
          style={{
            flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid',
            cursor: 'pointer', fontWeight: 700, fontSize: '.78rem', fontFamily: 'inherit',
            background: expenseType === 'Loan' ? 'rgba(248,113,113,.12)' : 'var(--surface-2)',
            color: expenseType === 'Loan' ? 'var(--accent-red)' : 'var(--text-secondary)',
            borderColor: expenseType === 'Loan' ? 'rgba(248,113,113,.25)' : 'var(--border-bright)',
          }}
        >
          Loan / EMI
        </button>
      </div>

      <div className="input-stack">
        <input
          placeholder="Expense Name (e.g. Rent)"
          value={newExpense.name}
          onChange={e => setNewExpense({ ...newExpense, name: e.target.value })}
        />

        <div className="amount-row">
          <div className="input-group-small full-width">
            <label>Amount (₹/mo)</label>
            <input
              type="number"
              placeholder="₹ Monthly"
              value={newExpense.amount}
              onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
            />
          </div>
          <div className="input-group-small full-width">
            <label>Due Day (1–31)</label>
            <input
              type="number"
              placeholder="e.g. 5"
              min="1" max="31"
              value={newExpense.dueDate}
              onChange={e => setNewExpense({ ...newExpense, dueDate: e.target.value })}
            />
          </div>
        </div>

        {/* Extra fields for Loan */}
        {expenseType === 'Loan' && (
          <div className="emi-details-grid fade-in">
            <div className="input-group-small">
              <label>Principal (₹)</label>
              <input
                type="number"
                placeholder="Loan amount"
                value={newExpense.principal}
                onChange={e => setNewExpense({ ...newExpense, principal: e.target.value })}
              />
            </div>
            <div className="input-group-small">
              <label>Type</label>
              <select
                className="minimal-select"
                value={newExpense.type}
                onChange={e => setNewExpense({ ...newExpense, type: e.target.value })}
              >
                <option value="Loan">Loan / EMI</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>
          </div>
        )}

        <button className="action-btn mt-2" onClick={addExpense}>
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* List */}
      <div className="items-list">
        {expenses.map(e => (
          <div key={e.id} className="list-item">
            <div className="item-left">
              <span className="item-name">{e.name}</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
                <span style={{
                  fontSize: '.62rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                  background: e.type === 'Loan' ? 'rgba(248,113,113,.12)' : 'rgba(56,189,248,.1)',
                  color: e.type === 'Loan' ? 'var(--accent-red)' : 'var(--accent-blue)',
                  border: `1px solid ${e.type === 'Loan' ? 'rgba(248,113,113,.2)' : 'rgba(56,189,248,.2)'}`,
                  textTransform: 'uppercase',
                }}>
                  {e.type === 'Loan' ? 'LOAN' : 'BILL'}
                </span>
                {e.dueDate && (
                  <span style={{ fontSize: '.62rem', color: 'var(--text-dim)', fontFamily: "'DM Mono',monospace" }}>
                    due day {e.dueDate}
                  </span>
                )}
              </div>
            </div>
            <div className="right-side">
              <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, color: 'var(--accent-red)', fontSize: '.9rem' }}>
                ₹{parseFloat(e.amount).toLocaleString('en-IN')}
              </span>
              <button className="icon-btn del-btn" onClick={() => setExpenses(expenses.filter(x => x.id !== e.id))}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {expenses.length > 0 && (
        <div className="card-footer">
          <span>Total Outflow</span>
          <span className="total-amount">₹{totalFixed.toLocaleString('en-IN')}</span>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;