import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { calculateEMI } from '../utils/helpers';

const WishlistCard = ({ wishlist, setWishlist, onAnalyze, isStreaming }) => {
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
        <ShoppingBag size={18} style={{ color: 'var(--primary)' }} />
        <h3>Goals & Wishlist</h3>
      </div>
      <p className="subtext">Add items to analyze if you can afford them.</p>

      <div className="input-stack">
        <input
          placeholder="Item Name (e.g. MacBook Pro)"
          value={newItem.name}
          onChange={e => setNewItem({ ...newItem, name: e.target.value })}
        />

        <div className="input-row">
          <div className="amount-input" style={{ flex: 1 }}>
            <span>₹</span>
            <input
              type="number"
              placeholder="Cost"
              value={newItem.cost}
              onChange={e => setNewItem({ ...newItem, cost: e.target.value })}
            />
          </div>
          <div className="toggle-wrapper">
            <label className="switch">
              <input
                type="checkbox"
                checked={newItem.isEmi}
                onChange={e => setNewItem({ ...newItem, isEmi: e.target.checked })}
              />
              <span className="slider round"></span>
            </label>
            <span className="label-text">EMI</span>
          </div>
        </div>

        {newItem.isEmi && (
          <div className="emi-details-grid fade-in">
            <div className="input-group-small">
              <label>Tenure (Months)</label>
              <input
                type="number"
                value={newItem.months}
                onChange={e => setNewItem({ ...newItem, months: e.target.value })}
              />
            </div>
            <div className="input-group-small">
              <label>Interest Rate (%)</label>
              <input
                type="number"
                value={newItem.interest}
                onChange={e => setNewItem({ ...newItem, interest: e.target.value })}
              />
            </div>
          </div>
        )}

        <button className="action-btn mt-2" onClick={addWishlist}>
          <Plus size={16} /> Add to Wishlist
        </button>
      </div>

      {/* Wishlist Items */}
      <div className="items-list">
        {wishlist.map(w => (
          <div key={w.id} className="list-item wishlist-item">
            <div className="item-left">
              <span className="item-name">{w.name}</span>
              <span className="wishlist-sub">
                {w.isEmi
                  ? `EMI: ₹${parseFloat(w.calculatedMonthly).toLocaleString()}/mo`
                  : `₹${parseFloat(w.cost).toLocaleString()} cash`}
              </span>
            </div>
            <div className="right-side">
              <span className={`wishlist-badge ${w.isEmi ? 'emi' : 'cash'}`}>
                {w.isEmi ? 'EMI' : 'CASH'}
              </span>
              <button
                className="icon-btn del-btn"
                onClick={() => setWishlist(wishlist.filter(x => x.id !== w.id))}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {wishlist.length === 0 && (
          <div className="wishlist-empty">
            <ShoppingBag size={28} style={{ opacity: 0.2, marginBottom: 8 }} />
            <p>No items yet. Add something you want to buy.</p>
          </div>
        )}
      </div>

      {wishlist.length > 0 && (
        <button className="analyze-btn" onClick={onAnalyze} disabled={isStreaming}>
          <Sparkles size={18} />
          {isStreaming ? 'Analyzing...' : 'Analyze with AI'}
        </button>
      )}
    </div>
  );
};

export default WishlistCard;