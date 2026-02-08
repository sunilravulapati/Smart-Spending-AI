import React, { useEffect, useRef } from 'react';
import { Wallet, Settings } from 'lucide-react';
import { OLLAMA_MODELS } from '../utils/helpers';

const Header = ({ income, setIncome, modelName, setModelName }) => {
  const inputRef = useRef(null);

  // Auto-resize input based on content
  useEffect(() => {
    if (inputRef.current) {
      const length = income ? income.toString().length : 1;
      inputRef.current.style.width = `${Math.max(80, length * 16 + 20)}px`;
    }
  }, [income]);

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
        {/* Model Selector */}
        <div className="model-pill">
          <Settings size={14} />
          <select value={modelName} onChange={(e) => setModelName(e.target.value)}>
            {OLLAMA_MODELS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Income Input */}
        <div className="income-pill">
          <span>NET INCOME</span>
          <div className="income-input-wrapper">
            <span className="currency-symbol">₹</span>
            <input 
              ref={inputRef}
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