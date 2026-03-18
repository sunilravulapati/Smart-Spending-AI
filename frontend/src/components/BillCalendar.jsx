import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Returns day-of-week index (0=Mon) for day 1 of current month
const getMonthStartOffset = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  // getDay(): 0=Sun...6=Sat → convert to Mon-first
  return (first.getDay() + 6) % 7;
};

const getDaysInMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

const getMonthLabel = () => {
  const now = new Date();
  return now.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const BillCalendar = ({ expenses }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  const today = new Date().getDate();
  const daysInMonth = getDaysInMonth();
  const offset = getMonthStartOffset();

  // Map dueDate → list of bill names
  const billMap = {};
  (expenses || []).forEach(e => {
    const day = parseInt(e.dueDate);
    if (!day || day < 1 || day > 31) return;
    if (!billMap[day]) billMap[day] = [];
    billMap[day].push({ name: e.name, amount: e.amount, type: e.type });
  });

  // Salary assumed day 1
  const incomeDay = 1;

  const cells = [];
  // Empty offset cells
  for (let i = 0; i < offset; i++) {
    cells.push(<div key={`empty-${i}`} className="cal-cell empty" />);
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const hasBill = !!billMap[d];
    const isToday = d === today;
    const isIncome = d === incomeDay;
    const isHovered = hoveredDay === d;
    const bills = billMap[d] || [];

    let cls = 'cal-cell';
    if (isToday) cls += ' cal-today';
    if (hasBill) cls += ' cal-has-bill';
    if (isIncome && !hasBill) cls += ' cal-has-income';

    cells.push(
      <div
        key={d}
        className={cls}
        onMouseEnter={() => hasBill && setHoveredDay(d)}
        onMouseLeave={() => setHoveredDay(null)}
      >
        <span className="cal-day-num">{d}</span>
        {(hasBill || (isIncome && !hasBill)) && (
          <span className={`cal-dot ${hasBill ? 'dot-bill' : 'dot-income'}`} />
        )}
        {/* Tooltip */}
        {isHovered && bills.length > 0 && (
          <div className="cal-tooltip">
            {bills.map((b, i) => (
              <div key={i} className="cal-tooltip-row">
                <span>{b.name}</span>
                <span>₹{parseFloat(b.amount).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Total bills this month
  const totalBillDays = Object.keys(billMap).length;
  const totalBillAmount = (expenses || [])
    .filter(e => e.dueDate)
    .reduce((acc, e) => acc + parseFloat(e.amount || 0), 0);

  return (
    <div className="card cal-card">
      <div className="card-header">
        <Calendar size={18} style={{ color: 'var(--accent-purple)' }} />
        <h3>Bill Calendar</h3>
        <span className="cal-month-label">{getMonthLabel()}</span>
      </div>
      <p className="subtext">
        {totalBillDays > 0
          ? `${totalBillDays} bill days · ₹${totalBillAmount.toLocaleString('en-IN')} goes out this month`
          : 'Add a due date to your expenses to see them here'}
      </p>

      {/* Day headers */}
      <div className="cal-grid">
        {DAYS.map((d, i) => (
          <div key={i} className="cal-header-cell">{d}</div>
        ))}
        {cells}
      </div>

      {/* Legend */}
      <div className="cal-legend">
        <div className="cal-legend-item">
          <span className="cal-dot dot-income" style={{ position: 'static', transform: 'none' }} />
          <span>Salary</span>
        </div>
        <div className="cal-legend-item">
          <span className="cal-dot dot-bill" style={{ position: 'static', transform: 'none' }} />
          <span>Bill / EMI</span>
        </div>
        <div className="cal-legend-item">
          <span className="cal-today-swatch" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default BillCalendar;