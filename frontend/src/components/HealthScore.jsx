import React from 'react';
import { Activity } from 'lucide-react';

const HealthScore = ({ income, totalFixed, totalGoals, freeCash, totalLoanEMI, runwayMonths, netWorth }) => {
  const safeIncome = parseFloat(income) || 1;
  const safeFreeCash = parseFloat(freeCash) || 0;
  const safeRunway = parseFloat(runwayMonths) || 0;
  const safeLoanEMI = parseFloat(totalLoanEMI) || 0;
  const safeNetWorth = parseFloat(netWorth) || 0;

  // --- Pillar scores (0-100 each) ---

  // 1. Savings Rate: freeCash / income. 30%+ = 100, 0% = 0
  const savingsRate = Math.max(0, (safeFreeCash / safeIncome) * 100);
  const savingsScore = Math.min(100, (savingsRate / 30) * 100);

  // 2. Debt Ratio: EMI / income. 0% = 100, 50%+ = 0
  const dti = (safeLoanEMI / safeIncome) * 100;
  const debtScore = Math.max(0, Math.min(100, ((50 - dti) / 50) * 100));

  // 3. Emergency Runway: 6+ months = 100, 0 = 0
  const runwayScore = Math.min(100, (safeRunway / 6) * 100);

  // 4. Net Worth: positive = scales up, negative = 0
  const nwScore = safeNetWorth > 0 ? Math.min(100, (safeNetWorth / (safeIncome * 12)) * 100) : 0;

  // Composite: weighted average
  const composite = Math.round(
    savingsScore * 0.30 +
    debtScore   * 0.25 +
    runwayScore * 0.25 +
    nwScore     * 0.20
  );

  const getGrade = (score) => {
    if (score >= 85) return { label: 'Excellent', color: 'var(--accent-green)' };
    if (score >= 70) return { label: 'Good', color: 'var(--accent-blue)' };
    if (score >= 50) return { label: 'Fair', color: 'var(--primary)' };
    return { label: 'Needs Work', color: 'var(--accent-red)' };
  };

  const grade = getGrade(composite);

  // Ring math: circumference = 2π × 35 ≈ 219.9
  const circumference = 219.9;
  const offset = circumference - (composite / 100) * circumference;

  const pillars = [
    { label: 'Savings rate', score: savingsScore, value: `${savingsRate.toFixed(1)}%` },
    { label: 'Debt ratio',   score: debtScore,    value: `${dti.toFixed(1)}%` },
    { label: 'Emergency',    score: runwayScore,   value: `${safeRunway}mo` },
    { label: 'Net worth',    score: nwScore,       value: safeNetWorth >= 0 ? `+₹${(safeNetWorth / 1000).toFixed(0)}K` : `-₹${(Math.abs(safeNetWorth) / 1000).toFixed(0)}K` },
  ];

  const barColor = (score) => {
    if (score >= 70) return 'var(--accent-green)';
    if (score >= 40) return 'var(--primary)';
    return 'var(--accent-red)';
  };

  return (
    <div className="card health-score-card full-width-card">
      <div className="card-header">
        <Activity size={18} style={{ color: 'var(--accent-blue)' }} />
        <h3>Financial Health Score</h3>
        <span className="health-grade" style={{ color: grade.color, borderColor: grade.color, background: `${grade.color}18` }}>
          {grade.label}
        </span>
      </div>
      <p className="subtext">Composite score across savings, debt, runway and net worth</p>

      <div className="health-score-body">
        {/* Ring */}
        <div className="health-ring-wrap">
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle
              cx="45" cy="45" r="35"
              fill="none" stroke="var(--surface-3)" strokeWidth="8"
            />
            <circle
              cx="45" cy="45" r="35"
              fill="none"
              stroke={grade.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '45px 45px', transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="health-ring-center">
            <span className="health-score-num" style={{ color: grade.color }}>{composite}</span>
            <span className="health-score-sub">/ 100</span>
          </div>
        </div>

        {/* Pillar bars */}
        <div className="health-pillars">
          {pillars.map((p) => (
            <div key={p.label} className="health-pillar-row">
              <span className="health-pillar-lbl">{p.label}</span>
              <div className="health-pillar-bar-wrap">
                <div
                  className="health-pillar-bar"
                  style={{ width: `${p.score}%`, background: barColor(p.score) }}
                />
              </div>
              <span className="health-pillar-val">{p.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthScore;