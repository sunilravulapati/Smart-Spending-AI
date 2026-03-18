import React, { useState } from 'react';
import { PiggyBank, Plus, Trash2 } from 'lucide-react';

const MilestoneRing = ({ progress, color }) => {
  const r = 16;
  const circ = 2 * Math.PI * r; // ~100.5
  const pct = Math.min(100, Math.max(0, progress));
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="milestone-ring">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle
          cx="20" cy="20" r={r}
          fill="none" stroke="var(--surface-3)" strokeWidth="3.5"
        />
        <circle
          cx="20" cy="20" r={r}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '20px 20px', transition: 'stroke-dashoffset .6s ease' }}
        />
      </svg>
      <div className="milestone-ring-center" style={{ color }}>
        {pct.toFixed(0)}%
      </div>
    </div>
  );
};

const getColor = (pct) => {
  if (pct >= 75) return 'var(--accent-green)';
  if (pct >= 40) return 'var(--primary)';
  return 'var(--accent-blue)';
};

const getETA = (target, saved, monthly) => {
  if (!target || !monthly || monthly <= 0) return null;
  const remaining = parseFloat(target) - parseFloat(saved || 0);
  if (remaining <= 0) return 'Complete!';
  const months = Math.ceil(remaining / parseFloat(monthly));
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
};

const GoalCard = ({ goals, setGoals }) => {
  const [newGoal, setNewGoal] = useState({ name: '', target: '', monthly: '', saved: '' });

  const addGoal = () => {
    if (!newGoal.name || !newGoal.monthly) return;
    setGoals([...goals, { ...newGoal, id: Date.now(), current: 0 }]);
    setNewGoal({ name: '', target: '', monthly: '', saved: '' });
  };

  return (
    <div className="card input-card">
      <div className="card-header">
        <PiggyBank size={18} style={{ color: 'var(--accent-green)' }} />
        <h3>Savings Goals</h3>
      </div>
      <p className="subtext">Set targets, track progress with milestone rings.</p>

      <div className="input-stack">
        <input
          placeholder="Goal Name (e.g. Emergency Fund)"
          value={newGoal.name}
          onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
        />
        <div className="amount-row">
          <div className="input-group-small full-width">
            <label>Target (₹)</label>
            <input
              type="number"
              placeholder="₹ Target"
              value={newGoal.target}
              onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
            />
          </div>
          <div className="input-group-small full-width">
            <label>Monthly (₹)</label>
            <input
              type="number"
              placeholder="₹ / mo"
              value={newGoal.monthly}
              onChange={e => setNewGoal({ ...newGoal, monthly: e.target.value })}
            />
          </div>
        </div>
        <div className="input-group-small">
          <label>Already Saved (₹) — optional</label>
          <input
            type="number"
            placeholder="₹ saved so far"
            value={newGoal.saved}
            onChange={e => setNewGoal({ ...newGoal, saved: e.target.value })}
          />
        </div>
        <button className="action-btn mt-2" onClick={addGoal}>
          <Plus size={16} /> Add Goal
        </button>
      </div>

      <div className="items-list">
        {goals.map(g => {
          const saved = parseFloat(g.saved || 0);
          const target = parseFloat(g.target || 0);
          const pct = target > 0 ? (saved / target) * 100 : 0;
          const color = getColor(pct);
          const eta = getETA(g.target, g.saved, g.monthly);

          return (
            <div key={g.id} className="milestone-item">
              {target > 0 && <MilestoneRing progress={pct} color={color} />}

              <div className="item-left" style={{ flex: 1 }}>
                <span className="item-name">{g.name}</span>
                {target > 0 && (
                  <span style={{ fontSize: '.68rem', color: 'var(--text-dim)' }}>
                    ₹{saved.toLocaleString('en-IN')} of ₹{target.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div style={{ textAlign: 'right', marginRight: 8 }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, color: 'var(--accent-green)', fontSize: '.85rem' }}>
                  +₹{parseFloat(g.monthly).toLocaleString('en-IN')}/mo
                </div>
                {eta && (
                  <div style={{ fontSize: '.65rem', color: eta === 'Complete!' ? 'var(--accent-green)' : 'var(--text-dim)', marginTop: 2, fontFamily: "'DM Mono',monospace" }}>
                    {eta}
                  </div>
                )}
              </div>

              <button className="icon-btn del-btn" onClick={() => setGoals(goals.filter(x => x.id !== g.id))}>
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalCard;