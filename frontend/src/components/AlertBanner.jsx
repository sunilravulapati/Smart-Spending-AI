import React, { useState } from 'react';
import { AlertTriangle, X, AlertCircle, TrendingDown, Shield } from 'lucide-react';

const AlertBanner = ({ income, expenses, freeCash, runwayMonths, totalLoanEMI, wishlist }) => {
  const [dismissed, setDismissed] = useState([]);

  const safeIncome = parseFloat(income) || 1;
  const safeFreeCash = parseFloat(freeCash) || 0;
  const safeRunway = parseFloat(runwayMonths) || 0;
  const safeLoanEMI = parseFloat(totalLoanEMI) || 0;

  const alerts = [];

  // 1. Negative free cash
  if (safeFreeCash < 0) {
    alerts.push({
      id: 'negative-cash',
      type: 'red',
      icon: <AlertCircle size={14} />,
      text: `You're spending ₹${Math.abs(safeFreeCash).toLocaleString('en-IN')} more than you earn this month.`
    });
  }

  // 2. Emergency runway warning
  if (safeRunway < 3 && safeRunway > 0) {
    alerts.push({
      id: 'low-runway',
      type: 'red',
      icon: <Shield size={14} />,
      text: `Emergency runway is only ${safeRunway} months. Target is 6 months.`
    });
  } else if (safeRunway >= 3 && safeRunway < 4) {
    alerts.push({
      id: 'medium-runway',
      type: 'amber',
      icon: <Shield size={14} />,
      text: `Emergency runway is ${safeRunway} months — a bit thin. Aim for 6.`
    });
  }

  // 3. Debt-to-income too high
  const dti = (safeLoanEMI / safeIncome) * 100;
  if (dti > 35) {
    alerts.push({
      id: 'high-dti',
      type: 'red',
      icon: <AlertTriangle size={14} />,
      text: `EMIs consume ${dti.toFixed(1)}% of income. Recommended max is 35%.`
    });
  }

  // 4. Low savings rate
  const savingsRate = (safeFreeCash / safeIncome) * 100;
  if (savingsRate < 15 && savingsRate >= 0) {
    alerts.push({
      id: 'low-savings',
      type: 'amber',
      icon: <TrendingDown size={14} />,
      text: `Savings rate is ${savingsRate.toFixed(1)}% — below the recommended 20%.`
    });
  }

  // 5. Bill cluster — 3+ bills within any 5-day window
  const billsWithDates = (expenses || []).filter(e => e.dueDate);
  if (billsWithDates.length >= 3) {
    const days = billsWithDates.map(e => parseInt(e.dueDate)).sort((a, b) => a - b);
    let clusterFound = false;
    for (let i = 0; i <= days.length - 3; i++) {
      if (days[i + 2] - days[i] <= 5) { clusterFound = true; break; }
    }
    if (clusterFound) {
      alerts.push({
        id: 'bill-cluster',
        type: 'amber',
        icon: <AlertTriangle size={14} />,
        text: `3+ bills hit within a 5-day window. Watch your cash flow mid-month.`
      });
    }
  }

  // 6. Wishlist item costs more than 2 months free cash
  if (wishlist && wishlist.length > 0) {
    const firstItem = wishlist[0];
    const itemCost = parseFloat(firstItem.cost) || 0;
    if (!firstItem.isEmi && itemCost > safeFreeCash * 2) {
      alerts.push({
        id: 'wishlist-heavy',
        type: 'amber',
        icon: <AlertTriangle size={14} />,
        text: `"${firstItem.name}" costs ${(itemCost / safeFreeCash).toFixed(1)}× your monthly free cash.`
      });
    }
  }

  const visible = alerts.filter(a => !dismissed.includes(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="alert-banner-wrap">
      {visible.map(alert => (
        <div key={alert.id} className={`alert-item alert-${alert.type}`}>
          <span className={`alert-dot alert-dot-${alert.type}`} />
          <span className="alert-icon">{alert.icon}</span>
          <span className="alert-text">{alert.text}</span>
          <button
            className="alert-dismiss"
            onClick={() => setDismissed(prev => [...prev, alert.id])}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlertBanner;