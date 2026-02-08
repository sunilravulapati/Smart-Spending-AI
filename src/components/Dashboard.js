import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Wallet, Target, Sparkles, Zap, Shield, PiggyBank } from 'lucide-react';
import { CHART_COLORS } from '../utils/helpers';

const Dashboard = ({ 
  income, totalFixed, totalLoanEMI, totalPrincipal, 
  monthlySurplus, totalGoals, freeCash, aiData, isStreaming 
}) => {
  const [activeTab, setActiveTab] = useState('health');

  const allocationData = [
    { name: 'Bills', value: totalFixed - totalLoanEMI },
    { name: 'EMIs', value: totalLoanEMI },
    { name: 'Goals', value: totalGoals },
    { name: 'Free Cash', value: Math.max(0, freeCash) }
  ];

  const debtRatio = ((totalLoanEMI / income) * 100) || 0;

  // Function to switch to AI tab automatically when data arrives
  React.useEffect(() => {
    if (aiData) setActiveTab('ai');
  }, [aiData]);

  return (
    <section className="right-col">
      <div className="tabs">
        <button className={activeTab === 'health' ? 'active' : ''} onClick={() => setActiveTab('health')}>Financial Health</button>
        <button className={activeTab === 'ai' ? 'active' : ''} onClick={() => setActiveTab('ai')}>AI Strategy</button>
      </div>

      {activeTab === 'health' && (
        <div className="dashboard-grid fade-in">
          <div className="card chart-card">
            <h4>Money Map</h4>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={allocationData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {allocationData.map((entry, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                <span style={{color: CHART_COLORS[2]}}>● Goals</span>
                <span style={{color: CHART_COLORS[3]}}>● Free Cash</span>
              </div>
            </div>
          </div>

          {totalLoanEMI > 0 && (
            <div className="card debt-card full-width-card">
              <div className="card-header">
                <Target className="icon-orange" size={20} />
                <h3>Debt Destroyer</h3>
              </div>
              <div className="debt-stats">
                <div className="debt-stat">
                  <span>Total Liability</span>
                  <strong>₹{totalPrincipal.toLocaleString()}</strong>
                </div>
                <div className="debt-stat">
                  <span>DTI Ratio</span>
                  <strong className={debtRatio > 30 ? 'danger-text' : 'safe-text'}>
                    {debtRatio.toFixed(1)}%
                  </strong>
                </div>
              </div>
            </div>
          )}

          <div className="stats-stack">
            <div className="card stat-card">
              <span className="stat-label">Allocated to Goals</span>
              <span className="stat-value">₹{totalGoals.toLocaleString()}</span>
              <PiggyBank className="stat-icon" color="#10b981" />
            </div>
            <div className={`card stat-card ${freeCash < 0 ? 'risky-border' : 'green-bg'}`}>
              <span className="stat-label">True Free Cash</span>
              <span className="stat-value">₹{freeCash.toLocaleString()}</span>
              <Wallet className="stat-icon" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="ai-panel fade-in">
          {isStreaming ? (
            <div className="loading-state">
              <Sparkles className="spin" size={24} />
              <p>Analyzing your finances...</p>
            </div>
          ) : aiData ? (
            <>
              <div className="card ai-main-card">
                <div className="ai-header">
                  <Sparkles size={18} color="#fbbf24" />
                  <h4>AI OVERALL ASSESSMENT</h4>
                </div>
                <div className="ai-content">
                  {aiData.assessment}
                </div>
              </div>

              <div className="strategy-grid">
                {aiData.strategies?.map((strat, i) => (
                  <div key={i} className="card strategy-card">
                    <div className="strat-icon">
                      {i === 0 ? <Zap size={18} color="#10b981"/> : <Shield size={18} color="#3b82f6"/>}
                    </div>
                    <div className="strat-content">
                      <h5>{strat.title}</h5>
                      <p>{strat.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {aiData.verdict && (
                <div className={`card verdict-card ${aiData.verdict.status === 'Safe' ? 'safe-border' : 'risky-border'}`}>
                  <div className="verdict-header">
                    <h3>{aiData.verdict.item}</h3>
                    <span className={`badge ${aiData.verdict.status.toLowerCase()}`}>
                      {aiData.verdict.status}
                    </span>
                  </div>
                  <div className="verdict-impact-row">
                    <span>MONTHLY SURPLUS IMPACT</span>
                    <strong>{aiData.verdict.impact}</strong>
                  </div>
                  <div className="verdict-text">
                    {aiData.verdict.advice}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>Click "Analyze Affordability" to generate your report.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Dashboard;