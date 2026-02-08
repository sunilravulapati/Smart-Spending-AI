import React, { useState } from 'react';
import { Landmark, Plus, Trash2, TrendingUp } from 'lucide-react';

const AssetCard = ({ assets, setAssets }) => {
  const [newAsset, setNewAsset] = useState({ name: '', value: '', type: 'Investment' });

  const addAsset = () => {
    if (!newAsset.name || !newAsset.value) return;
    setAssets([...assets, { ...newAsset, id: Date.now() }]);
    setNewAsset({ name: '', value: '', type: 'Investment' });
  };

  return (
    <div className="card input-card">
      <div className="card-header">
        <Landmark size={18} className="icon-blue" />
        <h3>Assets & Investments</h3>
      </div>
      <p className="subtext">Track what you <strong>own</strong> (Stocks, Gold, PF).</p>

      <div className="input-stack">
        <input 
          placeholder="Asset Name (e.g. Nifty 50 SIP)" 
          value={newAsset.name}
          onChange={e => setNewAsset({...newAsset, name: e.target.value})}
        />
        <div className="amount-row">
           <div className="input-group-small full-width">
              <label>Current Value (₹)</label>
              <input 
                type="number" 
                placeholder="₹ Value" 
                value={newAsset.value} 
                onChange={e => setNewAsset({...newAsset, value: e.target.value})}
              />
           </div>
           <div className="input-group-small full-width">
              <label>Type</label>
              <select 
                value={newAsset.type}
                onChange={e => setNewAsset({...newAsset, type: e.target.value})}
                className="minimal-select"
              >
                <option value="Investment">Investment</option>
                <option value="Cash">Cash/Bank</option>
                <option value="Property">Property</option>
                <option value="Gold">Gold</option>
              </select>
           </div>
        </div>
        <button className="action-btn mt-2" onClick={addAsset}>
          <Plus size={16} /> Add Asset
        </button>
      </div>

      <div className="items-list">
        {assets.map(a => (
          <div key={a.id} className="list-item asset-item">
            <div className="item-left">
              <span className="item-name">{a.name}</span>
              <span className="asset-type-badge">{a.type}</span>
            </div>
            <div className="right-side">
              <span className="asset-amount">₹{parseFloat(a.value).toLocaleString()}</span>
              <button className="icon-btn del-btn" onClick={() => setAssets(assets.filter(x => x.id !== a.id))}>
                <Trash2 size={14}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetCard;