import React, { useState } from 'react';
import { Sliders, RefreshCcw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Simulator = ({ income, totalFixed, freeCash }) => {
  const [incomeChange, setIncomeChange] = useState(0); // Percentage -50% to +50%
  const [expenseChange, setExpenseChange] = useState(0); // Percentage -50% to +50%

  // --- Calculations ---
  // 1. New Income
  const simulatedIncome = income * (1 + incomeChange / 100);
  
  // 2. New Expenses (Inflation/Lifestyle Creep)
  const simulatedExpenses = totalFixed * (1 + expenseChange / 100);
  
  // 3. New Free Cash (Assuming goals stay fixed for now)
  const goals = income - totalFixed - freeCash; // Reverse calculate goal amount
  const simulatedFreeCash = simulatedIncome - simulatedExpenses - goals;

  const reset = () => {
    setIncomeChange(0);
    setExpenseChange(0);
  };

  const difference = simulatedFreeCash - freeCash;
  const isPositive = difference >= 0;

  return (
    <div className="card full-width-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
      <div className="card-header">
        <Sliders size={20} color="#8b5cf6" />
        <h3>"What If" Simulator</h3>
      </div>
      <p className="subtext">Stress test your budget. What if you get a raise? What if rent goes up?</p>

      <div className="sim-grid">
        {/* Sliders */}
        <div className="sim-controls">
          
          {/* Income Slider */}
          <div className="sim-control-group">
            <div className="sim-label">
              <span>Income Change</span>
              <span className={incomeChange >= 0 ? 'text-green' : 'text-red'}>
                {incomeChange > 0 ? '+' : ''}{incomeChange}%
              </span>
            </div>
            <input 
              type="range" min="-50" max="50" step="5"
              value={incomeChange}
              onChange={(e) => setIncomeChange(Number(e.target.value))}
              className="range-slider"
            />
            <div className="sim-value-preview">
                New Income: <strong>₹{simulatedIncome.toFixed(0)}</strong>
            </div>
          </div>

          {/* Expense Slider */}
          <div className="sim-control-group">
            <div className="sim-label">
              <span>Expense Inflation</span>
              <span className={expenseChange <= 0 ? 'text-green' : 'text-red'}>
                {expenseChange > 0 ? '+' : ''}{expenseChange}%
              </span>
            </div>
            <input 
              type="range" min="-20" max="50" step="5"
              value={expenseChange}
              onChange={(e) => setExpenseChange(Number(e.target.value))}
              className="range-slider"
            />
            <div className="sim-value-preview">
                New Expenses: <strong>₹{simulatedExpenses.toFixed(0)}</strong>
            </div>
          </div>

          <button className="sim-reset-btn" onClick={reset}>
             <RefreshCcw size={14} /> Reset
          </button>
        </div>

        {/* Results Visual - Simplified Comparison */}
        <div className="sim-result">
            <h4>Impact on Free Cash</h4>
            
            {/* Before/After Comparison Bars */}
            <div className="sim-comparison">
              <div className="sim-bar-group">
                <span className="sim-bar-label">Current</span>
                <div className="sim-bar-container">
                  <div 
                    className="sim-bar sim-bar-current" 
                    style={{ width: `${Math.min(100, (freeCash / (income || 1)) * 100)}%` }}
                  >
                    <span className="sim-bar-value">₹{freeCash.toFixed(0)}</span>
                  </div>
                </div>
              </div>
              
              <div className="sim-bar-group">
                <span className="sim-bar-label">Simulated</span>
                <div className="sim-bar-container">
                  <div 
                    className={`sim-bar ${isPositive ? 'sim-bar-positive' : 'sim-bar-negative'}`}
                    style={{ width: `${Math.min(100, Math.max(5, (Math.abs(simulatedFreeCash) / (income || 1)) * 100))}%` }}
                  >
                    <span className="sim-bar-value">₹{simulatedFreeCash.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Big Difference Display */}
            <div className="sim-impact-box">
              <span className="sim-impact-label">Net Change</span>
              <div className={`sim-impact-value ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? '↑' : '↓'} ₹{Math.abs(difference).toFixed(0)}
              </div>
              <span className="sim-impact-subtitle">
                {isPositive ? 'More free cash!' : 'Less free cash'}
              </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;