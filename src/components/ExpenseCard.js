import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';
import { calculateEMI } from '../utils/helpers'; // Reusing logic

const ExpenseCard = ({ expenses, setExpenses, totalFixed }) => {
  const [expenseType, setExpenseType] = useState('Bill');
  const [newExpense, setNewExpense] = useState({ 
    name: '', amount: '', principal: '', rate: '', tenure: '' 
  });

  // Auto-calculate EMI inside the form
  useEffect(() => {
    if (expenseType === 'Loan' && newExpense.principal && newExpense.rate && newExpense.tenure) {
      const emi = calculateEMI(newExpense.principal, newExpense.rate, newExpense.tenure);
      setNewExpense(prev => ({ ...prev, amount: emi }));
    }
  }, [newExpense.principal, newExpense.rate, newExpense.tenure, expenseType]);

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    setExpenses([...expenses, { ...newExpense, type: expenseType, id: Date.now() }]);
    setNewExpense({ name: '', amount: '', principal: '', rate: '', tenure: '' });
  };

  return (
    <div className="card input-card">
      <div className="card-header">
        <TrendingUp size={18} />
        <h3>Monthly Outflow</h3>
      </div>
      
      <div className="type-toggle">
         <button className={expenseType === 'Bill' ? 'active' : ''} onClick={() => setExpenseType('Bill')}>Regular Bill</button>
         <button className={expenseType === 'Loan' ? 'active loan' : ''} onClick={() => setExpenseType('Loan')}>Loan / EMI</button>
      </div>

      <div className="input-stack">
         <input 
            placeholder={expenseType === 'Loan' ? "Loan Name" : "Expense Name"}
            value={newExpense.name}
            onChange={e => setNewExpense({...newExpense, name: e.target.value})}
         />
         
         {expenseType === 'Loan' && (
           <div className="loan-inputs fade-in">
              <div className="mini-input">
                 <label>Principal (₹)</label>
                 <input type="number" value={newExpense.principal} onChange={e => setNewExpense({...newExpense, principal: e.target.value})} />
              </div>
              <div className="mini-input">
                 <label>Rate (%)</label>
                 <input type="number" value={newExpense.rate} onChange={e => setNewExpense({...newExpense, rate: e.target.value})} />
              </div>
              <div className="mini-input">
                 <label>Months</label>
                 <input type="number" value={newExpense.tenure} onChange={e => setNewExpense({...newExpense, tenure: e.target.value})} />
              </div>
           </div>
         )}

         <div className="amount-row">
            <div className="amount-input">
              <span>₹</span>
              <input type="number" placeholder="Amount" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})}/>
            </div>
            <button className="icon-btn add-btn" onClick={addExpense}><Plus size={18}/></button>
         </div>
      </div>

      <div className="items-list">
        {expenses.map(e => (
          <div key={e.id} className="list-item">
            <div className="item-left">
              <span className="item-name">{e.name}</span>
              {e.type === 'Loan' && <span className="loan-badge">Loan: {e.rate}%</span>}
            </div>
            <div className="right-side">
              <strong>₹{e.amount}</strong>
              <button className="icon-btn del-btn" onClick={() => setExpenses(expenses.filter(x => x.id !== e.id))}><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="card-footer">
        <span>Total Outflow</span>
        <span className="total-amount">₹{totalFixed}</span>
      </div>
    </div>
  );
};

export default ExpenseCard;