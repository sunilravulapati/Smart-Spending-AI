import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import ExpenseCard from './components/ExpenseCard';
import GoalCard from './components/GoalCard';
import AssetCard from './components/AssetCard';
import WishlistCard from './components/WishlistCard';
import Dashboard from './components/Dashboard';
import { OLLAMA_MODELS } from './utils/helpers';

const App = () => {
  // --- Global State ---
  const [modelName, setModelName] = useState(OLLAMA_MODELS[0].id);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [assets, setAssets] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [aiData, setAiData] = useState(null); 
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputTab, setInputTab] = useState('expenses');

  // --- Persistence ---
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('budgetWise_v8'));
    if (saved) {
      setIncome(saved.income || 0);
      setExpenses(saved.expenses || []);
      setGoals(saved.goals || []);
      setAssets(saved.assets || []);
      setWishlist(saved.wishlist || []);
      setModelName(saved.modelName || OLLAMA_MODELS[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('budgetWise_v8', JSON.stringify({ 
      income, expenses, goals, assets, wishlist, modelName 
    }));
  }, [income, expenses, goals, assets, wishlist, modelName]);

  // --- Calculations ---
  
  // 1. Fixed Expenses & Loans
  const totalFixed = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  const totalLoans = expenses.filter(e => e.type === 'Loan');
  const totalLoanEMI = totalLoans.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  
  // 2. Liabilities (Loan Principals)
  const totalPrincipal = totalLoans.reduce((acc, curr) => acc + parseFloat(curr.principal || 0), 0);
  const totalLiabilities = totalPrincipal;

  // 3. Goals
  const totalGoals = goals.reduce((acc, curr) => acc + parseFloat(curr.monthly || 0), 0);

  // 4. Surplus & Free Cash
  const monthlySurplus = parseFloat(income || 0) - totalFixed;
  const freeCash = monthlySurplus - totalGoals; 

  // 5. Assets & Net Worth
  const totalAssets = assets.reduce((acc, curr) => acc + parseFloat(curr.value || 0), 0);
  const netWorth = totalAssets - totalLiabilities;

  // 6. Wishlist Impact
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
      - Savings Goals: ₹${totalGoals}
      - True Free Cash: ₹${freeCash}
      - Total Assets: ₹${totalAssets}
      - Total Liabilities: ₹${totalLiabilities}
      - Net Worth: ₹${netWorth}
      
      Wishlist Items: ${wishlist.map(i => `${i.name} (₹${i.cost})`).join(', ')}

      TASK: Return JSON.
      1. Analyze Net Worth (Positive/Negative).
      2. Analyze Free Cash flow.
      3. Give advice on the Wishlist item based on this context.

      Structure:
      {
        "assessment": "Summary of financial health in English.",
        "strategies": [
          { "title": "Strategy Title", "text": "Advice in English" },
          { "title": "Strategy Title", "text": "Advice in English" }
        ],
        "verdict": {
          "item": "${wishlist.length > 0 ? wishlist[0].name : 'Item'}",
          "status": "Safe" or "Risky",
          "color": "green" or "red",
          "impact": "New Free Cash: ₹${postPurchaseFreeCash}",
          "advice": "Advice in English"
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
            { role: "system", content: "Output valid JSON only. Speak English." }, 
            { role: "user", content: prompt }
          ],
          stream: false, 
          format: "json"
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
      <Header 
        income={income} 
        setIncome={setIncome} 
        modelName={modelName}
        setModelName={setModelName}
      />
      
      <main className="main-grid">
        <section className="left-col">
          
          {/* NEW: Tab Navigation */}
          <div className="input-tabs">
            <button 
              className={inputTab === 'expenses' ? 'active' : ''} 
              onClick={() => setInputTab('expenses')}
            >
              Cash Flow
            </button>
            <button 
              className={inputTab === 'wealth' ? 'active' : ''} 
              onClick={() => setInputTab('wealth')}
            >
              Wealth
            </button>
            <button 
              className={inputTab === 'wishlist' ? 'active' : ''} 
              onClick={() => setInputTab('wishlist')}
            >
              Wishlist
            </button>
          </div>

          {/* CONDITIONAL RENDERING BASED ON TAB */}
          
          {/* Tab 1: Expenses (Daily Cash Flow) */}
          {inputTab === 'expenses' && (
            <div className="fade-in">
               <ExpenseCard expenses={expenses} setExpenses={setExpenses} totalFixed={totalFixed} />
            </div>
          )}

          {/* Tab 2: Wealth (Assets & Goals) */}
          {inputTab === 'wealth' && (
            <div className="fade-in">
               <AssetCard assets={assets} setAssets={setAssets} />
               <GoalCard goals={goals} setGoals={setGoals} />
            </div>
          )}

          {/* Tab 3: Wishlist (Analysis) */}
          {inputTab === 'wishlist' && (
            <div className="fade-in">
               <WishlistCard 
                 wishlist={wishlist} setWishlist={setWishlist}
                 onAnalyze={analyzeBudget} isStreaming={isStreaming}
               />
            </div>
          )}

        </section>
        
        {/* Right Column stays exactly the same */}
        <Dashboard 
          income={income}
          totalFixed={totalFixed}
          totalLoanEMI={totalLoanEMI}
          totalPrincipal={totalPrincipal}
          totalGoals={totalGoals}
          freeCash={freeCash}
          monthlySurplus={monthlySurplus}
          totalAssets={totalAssets}
          totalLiabilities={totalLiabilities}
          netWorth={netWorth}
          wishlist={wishlist}
          aiData={aiData} 
          isStreaming={isStreaming}
        />
      </main>
    </div>
  );
};

export default App;