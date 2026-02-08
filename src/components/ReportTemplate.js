import React from 'react';
import { Wallet, TrendingUp, Shield, AlertTriangle, CheckCircle, PieChart as PieIcon } from 'lucide-react';

// We inline styles here to ensure they render correctly in the PDF snapshot
const styles = {
  container: {
    width: '800px', // Fixed width for A4 consistency
    padding: '40px',
    backgroundColor: 'white',
    color: '#1e293b',
    fontFamily: 'sans-serif',
    position: 'absolute',
    left: '-9999px', // Hide it off-screen
    top: 0,
  },
  header: {
    borderBottom: '2px solid #3b82f6',
    paddingBottom: '20px',
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  section: {
    marginBottom: '30px',
    pageBreakInside: 'avoid' // Try to prevent cutting sections in half
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: '15px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '5px'
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '15px',
    marginBottom: '20px'
  },
  statBox: {
    backgroundColor: '#f8fafc',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  statLabel: { fontSize: '12px', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' },
  statValue: { fontSize: '20px', fontWeight: 'bold', color: '#0f172a' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: { textAlign: 'left', padding: '10px', borderBottom: '2px solid #e2e8f0', color: '#64748b' },
  td: { padding: '10px', borderBottom: '1px solid #f1f5f9' },
  aiBox: {
    backgroundColor: '#eff6ff',
    padding: '20px',
    borderRadius: '12px',
    borderLeft: '4px solid #3b82f6'
  }
};

const ReportTemplate = ({ 
  id, 
  income, totalFixed, totalAssets, totalLiabilities, netWorth, 
  expenses, goals, assets, aiData 
}) => {
  return (
    <div id={id} style={styles.container}>
      {/* 1. Header */}
      <div style={styles.header}>
        <div>
          <h1 style={{ margin: 0, color: '#3b82f6' }}>ProsperOS</h1>
          <p style={{ margin: '5px 0 0', color: '#64748b' }}>Comprehensive Financial Audit</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{new Date().toLocaleDateString()}</p>
          <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* 2. Executive Summary */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Executive Summary</div>
        <div style={styles.grid4}>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Net Income</div>
            <div style={styles.statValue}>₹{parseFloat(income || 0).toLocaleString()}</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Fixed Expenses</div>
            <div style={styles.statValue}>₹{parseFloat(totalFixed || 0).toLocaleString()}</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Net Worth</div>
            <div style={{ ...styles.statValue, color: netWorth >= 0 ? '#166534' : '#dc2626' }}>
              ₹{parseFloat(netWorth || 0).toLocaleString()}
            </div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Active Goals</div>
            <div style={styles.statValue}>{goals.length}</div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Breakdown (Tables) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        
        {/* Assets Table */}
        <div>
          <div style={styles.sectionTitle}>Assets & Investments</div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Asset</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Value</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id}>
                  <td style={styles.td}>{a.name}</td>
                  <td style={styles.td}>{a.type}</td>
                  <td style={styles.td}>₹{parseFloat(a.value).toLocaleString()}</td>
                </tr>
              ))}
              {assets.length === 0 && <tr><td colSpan="3" style={{...styles.td, color: '#94a3b8', fontStyle: 'italic'}}>No assets recorded</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Expenses Table (Top 5) */}
        <div>
          <div style={styles.sectionTitle}>Fixed Outflows</div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Expense</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.slice(0, 5).map(e => (
                <tr key={e.id}>
                  <td style={styles.td}>{e.name}</td>
                  <td style={styles.td}>{e.type}</td>
                  <td style={styles.td}>₹{parseFloat(e.amount).toLocaleString()}</td>
                </tr>
              ))}
              {expenses.length === 0 && <tr><td colSpan="3" style={{...styles.td, color: '#94a3b8', fontStyle: 'italic'}}>No expenses recorded</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. AI Strategy Section */}
      {aiData && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>AI Strategic Analysis</div>
          <div style={styles.aiBox}>
            <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#1e40af' }}>Assessment</h3>
            <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>{aiData.assessment}</p>
            
            <h4 style={{ marginBottom: '10px', color: '#1e40af' }}>Key Recommendations:</h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {aiData.strategies?.map((s, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>
                  <strong>{s.title}:</strong> {s.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
        Generated by ProsperOS Personal Finance System • Private & Confidential
      </div>
    </div>
  );
};

export default ReportTemplate;