import React from 'react';
import { Wallet, Settings } from 'lucide-react';
import { OLLAMA_MODELS } from '../utils/helpers';

const Header = ({ income, setIncome, modelName, setModelName }) => {
  return (
    <header className="top-nav">
      <div className="logo-section">
        <Wallet className="logo-icon" size={28} />
        <div>
          <h1>BudgetWise <span className="highlight">India</span></h1>
          <p>Smart Finance OS</p>
        </div>
      </div>

      <div className="header-right">
        {/* New Top-Level Model Selector */}
        <div className="model-pill">
            <Settings size={14} />
            <select value={modelName} onChange={(e) => setModelName(e.target.value)}>
                {OLLAMA_MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                ))}
            </select>
        </div>

        <div className="income-pill">
          <span>NET INCOME</span>
          <div className="income-input-wrapper">
             <span className="currency-symbol">₹</span>
             <input 
               type="number" 
               value={income} 
               onChange={(e) => setIncome(e.target.value)} 
               placeholder="0"
             />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;