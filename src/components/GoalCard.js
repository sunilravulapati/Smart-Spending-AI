import React, { useState } from 'react';
import { PiggyBank, Plus, Trash2, Target } from 'lucide-react';

const GoalCard = ({ goals, setGoals }) => {
  const [newGoal, setNewGoal] = useState({ name: '', target: '', monthly: '' });

  const addGoal = () => {
    if (!newGoal.name || !newGoal.monthly) return;
    setGoals([...goals, { ...newGoal, id: Date.now(), current: 0 }]); // 'current' tracks progress
    setNewGoal({ name: '', target: '', monthly: '' });
  };

  return (
    <div className="card input-card">
      <div className="card-header">
        <PiggyBank size={18} className="icon-green" />
        <h3>Savings Goals</h3>
      </div>
      <p className="subtext">Allocate your surplus to future goals.</p>

      <div className="input-stack">
        <input 
          placeholder="Goal Name (e.g. Emergency Fund)" 
          value={newGoal.name}
          onChange={e => setNewGoal({...newGoal, name: e.target.value})}
        />
        <div className="amount-row">
           <div className="input-group-small full-width">
              <label>Target Amount (Optional)</label>
              <input 
                type="number" 
                placeholder="₹ Target" 
                value={newGoal.target} 
                onChange={e => setNewGoal({...newGoal, target: e.target.value})}
              />
           </div>
           <div className="input-group-small full-width">
              <label>Monthly Saving</label>
              <input 
                type="number" 
                placeholder="₹ / month" 
                value={newGoal.monthly} 
                onChange={e => setNewGoal({...newGoal, monthly: e.target.value})}
              />
           </div>
        </div>
        <button className="action-btn mt-2" onClick={addGoal}>
          <Plus size={16} /> Add Goal
        </button>
      </div>

      <div className="items-list">
        {goals.map(g => (
          <div key={g.id} className="list-item goal-item">
            <div className="item-left">
              <span className="item-name">{g.name}</span>
              {g.target && (
                 <span className="goal-progress-text">Target: ₹{g.target}</span>
              )}
            </div>
            <div className="right-side">
              <span className="goal-amount">+₹{g.monthly}/mo</span>
              <button className="icon-btn del-btn" onClick={() => setGoals(goals.filter(x => x.id !== g.id))}>
                <Trash2 size={14}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalCard;