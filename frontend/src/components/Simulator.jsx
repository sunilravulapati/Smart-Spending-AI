import React, { useState } from 'react';
import { Sliders, RefreshCcw, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const Simulator = ({ income, totalFixed, freeCash }) => {
  const [incomeChange, setIncomeChange] = useState(0);
  const [expenseChange, setExpenseChange] = useState(0);

  // --- Core Calculations ---
  const safeIncome = parseFloat(income) || 0;
  const safeFixed = parseFloat(totalFixed) || 0;
  const safeFreeCash = parseFloat(freeCash) || 0;

  // Reverse-calculate goals from existing data
  const goals = safeIncome - safeFixed - safeFreeCash;

  // Simulated values
  const simulatedIncome = safeIncome * (1 + incomeChange / 100);
  // If no expenses entered yet, simulate a realistic baseline (30% of income)
  const baseExpenses = safeFixed > 0 ? safeFixed : safeIncome * 0.3;
  const simulatedExpenses = baseExpenses * (1 + expenseChange / 100);
  const simulatedFreeCash = simulatedIncome - simulatedExpenses - goals;

  const difference = simulatedFreeCash - safeFreeCash;
  const isPositive = difference >= 0;

  // --- Derived Metrics ---
  const savingsRate = simulatedIncome > 0
    ? ((simulatedFreeCash / simulatedIncome) * 100).toFixed(1)
    : 0;

  const expenseRatio = simulatedIncome > 0
    ? ((simulatedExpenses / simulatedIncome) * 100).toFixed(1)
    : 0;

  // 12-month projections
  const projection12m = simulatedFreeCash * 12;
  const currentProjection12m = safeFreeCash * 12;

  // Bar widths relative to income
  const maxVal = Math.max(safeIncome, simulatedIncome, 1);
  const currentBarW = Math.min(100, Math.max(8, (Math.abs(safeFreeCash) / maxVal) * 100));
  const simBarW = Math.min(100, Math.max(8, (Math.abs(simulatedFreeCash) / maxVal) * 100));

  const reset = () => {
    setIncomeChange(0);
    setExpenseChange(0);
  };

  const fmt = (n) => Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="card simulator-card">
      <div className="card-header">
        <Sliders size={18} style={{ color: 'var(--accent-purple)' }} />
        <h3>"What If" Simulator</h3>
      </div>
      <p className="subtext">
        Stress test your budget. What if you get a raise? What if costs go up?
        {safeFixed === 0 && (
          <span style={{ color: 'var(--primary)', marginLeft: 6, fontStyle: 'italic' }}>
            (Using 30% income as expense baseline — add expenses for accurate results)
          </span>
        )}
      </p>

      <div className="sim-grid">

        {/* --- SLIDERS --- */}
        <div className="sim-controls">

          {/* Income Slider */}
          <div className="sim-control-group">
            <div className="sim-label">
              <span>Income Change</span>
              <span style={{
                color: incomeChange >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                fontFamily: "'DM Mono', monospace",
                fontWeight: 700
              }}>
                {incomeChange > 0 ? '+' : ''}{incomeChange}%
              </span>
            </div>
            <input
              type="range" min="-50" max="100" step="5"
              value={incomeChange}
              onChange={e => setIncomeChange(Number(e.target.value))}
              className="range-slider"
            />
            <div className="sim-value-preview">
              ₹{safeIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              <span style={{ color: 'var(--text-dim)', margin: '0 6px' }}>→</span>
              <strong style={{
                color: incomeChange >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                fontFamily: "'DM Mono', monospace"
              }}>
                ₹{simulatedIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </strong>
            </div>
          </div>

          {/* Expense Slider */}
          <div className="sim-control-group">
            <div className="sim-label">
              <span>Expense Inflation</span>
              <span style={{
                color: expenseChange <= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                fontFamily: "'DM Mono', monospace",
                fontWeight: 700
              }}>
                {expenseChange > 0 ? '+' : ''}{expenseChange}%
              </span>
            </div>
            <input
              type="range" min="-20" max="100" step="5"
              value={expenseChange}
              onChange={e => setExpenseChange(Number(e.target.value))}
              className="range-slider"
            />
            <div className="sim-value-preview">
              ₹{baseExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              <span style={{ color: 'var(--text-dim)', margin: '0 6px' }}>→</span>
              <strong style={{
                color: expenseChange <= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                fontFamily: "'DM Mono', monospace"
              }}>
                ₹{simulatedExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </strong>
            </div>
          </div>

          {/* Metric Pills */}
          <div className="sim-metrics-row">
            <div className="sim-metric-pill">
              <span className="sim-metric-label">Savings Rate</span>
              <strong className="sim-metric-val" style={{
                color: savingsRate >= 20
                  ? 'var(--accent-green)'
                  : savingsRate >= 10
                    ? 'var(--primary)'
                    : 'var(--accent-red)'
              }}>
                {savingsRate}%
              </strong>
            </div>
            <div className="sim-metric-pill">
              <span className="sim-metric-label">Expense Ratio</span>
              <strong className="sim-metric-val" style={{
                color: expenseRatio <= 50
                  ? 'var(--accent-green)'
                  : expenseRatio <= 70
                    ? 'var(--primary)'
                    : 'var(--accent-red)'
              }}>
                {expenseRatio}%
              </strong>
            </div>
          </div>

          <button className="sim-reset-btn" onClick={reset}>
            <RefreshCcw size={14} /> Reset
          </button>
        </div>

        {/* --- RESULTS --- */}
        <div className="sim-result">
          <h4>Monthly Free Cash</h4>

          {/* Before / After Bars */}
          <div className="sim-comparison">
            <div className="sim-bar-group">
              <span className="sim-bar-label">Current</span>
              <div className="sim-bar-container">
                <div
                  className="sim-bar sim-bar-current"
                  style={{ width: `${currentBarW}%` }}
                >
                  <span className="sim-bar-value">₹{fmt(safeFreeCash)}</span>
                </div>
              </div>
            </div>

            <div className="sim-bar-group">
              <span className="sim-bar-label">Simulated</span>
              <div className="sim-bar-container">
                <div
                  className={`sim-bar ${
                    simulatedFreeCash < 0
                      ? 'sim-bar-negative'
                      : isPositive
                        ? 'sim-bar-positive'
                        : 'sim-bar-current'
                  }`}
                  style={{ width: `${simBarW}%` }}
                >
                  <span className="sim-bar-value">
                    {simulatedFreeCash < 0 ? '-' : ''}₹{fmt(simulatedFreeCash)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Change */}
          <div className="sim-impact-box">
            <span className="sim-impact-label">Monthly Δ</span>
            <div className={`sim-impact-value ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
              ₹{fmt(difference)}
            </div>
            <span className="sim-impact-subtitle">
              {isPositive ? 'extra' : 'less'} per month
            </span>
          </div>

          {/* 12-month projection */}
          <div className="sim-projection-row">
            <div className="sim-proj-item">
              <span className="sim-metric-label">12-mo now</span>
              <strong style={{
                fontFamily: "'DM Mono', monospace",
                color: 'var(--text-secondary)',
                fontSize: '0.88rem'
              }}>
                ₹{currentProjection12m.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </strong>
            </div>
            <span style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>→</span>
            <div className="sim-proj-item">
              <span className="sim-metric-label">12-mo simulated</span>
              <strong style={{
                fontFamily: "'DM Mono', monospace",
                color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
                fontSize: '0.88rem'
              }}>
                ₹{projection12m.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </strong>
            </div>
          </div>

          {/* Warning if expenses exceed income */}
          {simulatedFreeCash < 0 && (
            <div className="sim-warning-banner">
              <AlertCircle size={14} />
              <span>Expenses exceed income in this scenario!</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Simulator;