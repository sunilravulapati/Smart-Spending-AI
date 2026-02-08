import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import ExpenseCard from './components/ExpenseCard';
import GoalCard from './components/GoalCard'; // Import the new card
import WishlistCard from './components/WishlistCard.js';
import Dashboard from './components/Dashboard';
import { OLLAMA_MODELS } from './utils/helpers';

const App = () => {
  const [modelName, setModelName] = useState(OLLAMA_MODELS[0].id);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]); // New State
  const [wishlist, setWishlist] = useState([]);
  const [aiData, setAiData] = useState(null); 
  const [isStreaming, setIsStreaming] = useState(false);

  // Persistence (Update key to v6)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('budgetWise_v6'));
    if (saved) {
      setIncome(saved.income || 0);
      setExpenses(saved.expenses || []);
      setGoals(saved.goals || []); // Load goals
      setWishlist(saved.wishlist || []);
      setModelName(saved.modelName || OLLAMA_MODELS[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('budgetWise_v6', JSON.stringify({ income, expenses, goals, wishlist, modelName }));
  }, [income, expenses, goals, wishlist, modelName]);

  // --- Calculations ---
  const totalFixed = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  const totalLoans = expenses.filter(e => e.type === 'Loan');
  const totalLoanEMI = totalLoans.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  const totalPrincipal = totalLoans.reduce((acc, curr) => acc + parseFloat(curr.principal || 0), 0);
  
  // New Calculation: Goals
  const totalGoals = goals.reduce((acc, curr) => acc + parseFloat(curr.monthly || 0), 0);

  const monthlySurplus = parseFloat(income || 0) - totalFixed;
  const freeCash = monthlySurplus - totalGoals; // The REAL spending money

  const wishlistImpact = wishlist.reduce((acc, item) => acc + (item.isEmi ? parseFloat(item.calculatedMonthly) : 0), 0);
  const postPurchaseFreeCash = freeCash - wishlistImpact;

  // --- AI Handler ---
  const analyzeBudget = async () => {
    setAiData(null);
    setIsStreaming(true);

    const prompt = `
      You are a strictly English-speaking financial advisor.
      
      Financial Data:
      - Net Income: ₹${income}
      - Fixed Expenses: ₹${totalFixed}
      - Savings Goals (Committed): ₹${totalGoals}
      - True Free Cash (Income - Fixed - Goals): ₹${freeCash}
      
      Wishlist Items to Buy: ${wishlist.map(i => `${i.name} (₹${i.cost})`).join(', ')}

      TASK: Return JSON.
      Context: The user has ₹${freeCash} in TRUE free cash after meeting their savings goals.
      If Free Cash is negative, warn them they are dipping into savings/bills.
      
      Structure:
      {
        "assessment": "Summary focusing on Free Cash flow in English.",
        "strategies": [
          { "title": "Strategy Title", "text": "Advice in English" },
          { "title": "Strategy Title", "text": "Advice in English" }
        ],
        "verdict": {
          "item": "${wishlist.length > 0 ? wishlist[0].name : 'Item'}",
          "status": "Safe" or "Risky",
          "color": "green" or "red",
          "impact": "New Free Cash: ₹${postPurchaseFreeCash}",
          "advice": "Advice based on Free Cash, not just surplus."
        }
      }
    `;

    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          messages: [
             { role: "system", content: "You are a helpful assistant. Output valid JSON only. Speak English." }, 
             { role: "user", content: prompt }
          ],
          stream: false, format: "json"
        })
      });

      const data = await response.json();
      try {
        setAiData(JSON.parse(data.message.content));
      } catch (e) {
        setAiData({ assessment: data.message.content, strategies: [], verdict: null });
      }
    } catch (err) {
      setAiData({ assessment: "Error connecting to AI.", strategies: [], verdict: null });
    }
    setIsStreaming(false);
  };

  return (
    <div className="app-container">
      <Header income={income} setIncome={setIncome} modelName={modelName} setModelName={setModelName} />
      
      <main className="main-grid">
        <section className="left-col">
          <ExpenseCard expenses={expenses} setExpenses={setExpenses} totalFixed={totalFixed} />
          
          {/* Insert GoalCard Here */}
          <GoalCard goals={goals} setGoals={setGoals} />
          
          <WishlistCard 
            wishlist={wishlist} setWishlist={setWishlist}
            onAnalyze={analyzeBudget} isStreaming={isStreaming}
          />
        </section>
        
        <Dashboard 
          income={income}
          totalFixed={totalFixed}
          totalLoanEMI={totalLoanEMI}
          totalPrincipal={totalPrincipal}
          totalGoals={totalGoals}   // Pass this
          freeCash={freeCash}       // Pass this (replaces surplus in some views)
          monthlySurplus={monthlySurplus}
          aiData={aiData} 
          isStreaming={isStreaming}
        />
      </main>
    </div>
  );
};

export default App;