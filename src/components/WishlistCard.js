import React, { useState } from 'react';
import { Sparkles, Plus, Trash2 } from 'lucide-react';
import { calculateEMI } from '../utils/helpers';

const WishlistCard = ({ wishlist, setWishlist, modelName, setModelName, onAnalyze, isStreaming }) => {
  const [newItem, setNewItem] = useState({
    name: '', cost: '', isEmi: false, months: 12, interest: 15
  });

  const addWishlist = () => {
    if (!newItem.name || !newItem.cost) return;
    let monthly = newItem.cost;
    if (newItem.isEmi) monthly = calculateEMI(newItem.cost, newItem.interest, newItem.months);

    setWishlist([...wishlist, { ...newItem, calculatedMonthly: monthly, id: Date.now() }]);
    setNewItem({ name: '', cost: '', isEmi: false, months: 12, interest: 15 });
  };

  return (
    <div className="card input-card">
      <div className="card-header">
        <Sparkles size={18} className="highlight-icon" />
        <h3>Goals & Wishlist</h3>
      </div>

      <div className="wishlist-form">
        <input
          className="full-width" placeholder="Item Name"
          value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
        />
        <div className="input-row mt-2">
          <div className="amount-input full-width">
            <span>₹</span>
            <input type="number" placeholder="Cost" value={newItem.cost} onChange={e => setNewItem({ ...newItem, cost: e.target.value })} />
          </div>
          <div className="toggle-wrapper">
            <label className="switch">
              <input type="checkbox" checked={newItem.isEmi} onChange={e => setNewItem({ ...newItem, isEmi: e.target.checked })} />
              <span className="slider round"></span>
            </label>
            <span className="label-text">EMI</span>
          </div>
        </div>

        {/* FIX: Better layout for EMI inputs */}
        {newItem.isEmi && (
          <div className="emi-details-grid fade-in">
            <div className="input-group-small">
              <label>Tenure (Months)</label>
              <input type="number" value={newItem.months} onChange={e => setNewItem({ ...newItem, months: e.target.value })} />
            </div>
            <div className="input-group-small">
              <label>Interest Rate (%)</label>
              <input type="number" value={newItem.interest} onChange={e => setNewItem({ ...newItem, interest: e.target.value })} />
            </div>
          </div>
        )}

        <button className="action-btn mt-3" onClick={addWishlist}><Plus size={16} /> Add Goal</button>
      </div>

      <div className="items-list wishlist-list">
        {wishlist.map(w => (
          <div key={w.id} className="list-item">
            <div>
              <span className="item-name">{w.name}</span>
              <span className="item-sub">{w.isEmi ? `EMI: ₹${w.calculatedMonthly}/mo` : 'Cash Payment'}</span>
            </div>
            <button className="icon-btn del-btn" onClick={() => setWishlist(wishlist.filter(x => x.id !== w.id))}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      {wishlist.length > 0 && (
        <button className="analyze-btn" onClick={onAnalyze} disabled={isStreaming}>
          <Sparkles size={18} />
          {isStreaming ? 'Thinking...' : 'Analyze Plan'}
        </button>
      )}
    </div>
  );
};

export default WishlistCard;