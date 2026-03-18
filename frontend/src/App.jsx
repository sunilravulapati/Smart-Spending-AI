import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import ExpenseCard from './components/ExpenseCard';
import GoalCard from './components/GoalCard';
import AssetCard from './components/AssetCard';
import WishlistCard from './components/WishlistCard';
import ToolsCard from './components/ToolsCard';
import Dashboard from './components/Dashboard';
import AlertBanner from './components/AlertBanner';
import { GROQ_MODELS } from './utils/helpers';
import ReportTemplate from './components/ReportTemplate';

const App = () => {
  const [modelName, setModelName] = useState(GROQ_MODELS[0].id);
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
      setModelName(saved.modelName || GROQ_MODELS[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('budgetWise_v8', JSON.stringify({
      income, expenses, goals, assets, wishlist, modelName
    }));
  }, [income, expenses, goals, assets, wishlist, modelName]);

  // --- Calculations ---
  const totalFixed = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  const totalLoans = expenses.filter(e => e.type === 'Loan');
  const totalLoanEMI = totalLoans.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  const totalPrincipal = totalLoans.reduce((acc, curr) => acc + parseFloat(curr.principal || 0), 0);
  const totalLiabilities = totalPrincipal;
  const totalGoals = goals.reduce((acc, curr) => acc + parseFloat(curr.monthly || 0), 0);
  const monthlySurplus = parseFloat(income || 0) - totalFixed;
  const freeCash = monthlySurplus - totalGoals;
  const totalAssets = assets.reduce((acc, curr) => acc + parseFloat(curr.value || 0), 0);
  const netWorth = totalAssets - totalLiabilities;
  const wishlistImpact = wishlist.reduce((acc, item) => acc + (item.isEmi ? parseFloat(item.calculatedMonthly) : 0), 0);
  const postPurchaseFreeCash = freeCash - wishlistImpact;

  // Liquid assets & runway for AlertBanner
  const liquidAssets = assets
    .filter(a => a.type === 'Cash' || a.type === 'Investment')
    .reduce((acc, curr) => acc + parseFloat(curr.value || 0), 0);
  const runwayMonths = parseFloat((liquidAssets / (totalFixed || 1)).toFixed(1));

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
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API}`
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: "system", content: "Output valid JSON only. Speak English." },
            { role: "user", content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.7,
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      try {
        setAiData(JSON.parse(data.choices[0].message.content));
      } catch (e) {
        setAiData({ assessment: data.choices[0].message.content, strategies: [], verdict: null });
      }
    } catch (err) {
      setAiData({ assessment: "Error connecting to Groq API. Check your API key.", strategies: [], verdict: null });
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

      {/* Smart Alert Banner — appears only when alerts exist */}
      <AlertBanner
        income={income}
        expenses={expenses}
        freeCash={freeCash}
        runwayMonths={runwayMonths}
        totalLoanEMI={totalLoanEMI}
        wishlist={wishlist}
      />

      <main className="main-grid">
        <section className="left-col">

          <div className="input-tabs">
            <button className={inputTab === 'expenses' ? 'active' : ''} onClick={() => setInputTab('expenses')}>Cash Flow</button>
            <button className={inputTab === 'wealth' ? 'active' : ''} onClick={() => setInputTab('wealth')}>Wealth</button>
            <button className={inputTab === 'wishlist' ? 'active' : ''} onClick={() => setInputTab('wishlist')}>Wishlist</button>
            <button className={inputTab === 'tools' ? 'active' : ''} onClick={() => setInputTab('tools')}>Tools</button>
          </div>

          <ReportTemplate
            id="printable-report"
            income={income}
            totalFixed={totalFixed}
            totalAssets={totalAssets}
            totalLiabilities={totalLiabilities}
            netWorth={netWorth}
            expenses={expenses}
            goals={goals}
            assets={assets}
            aiData={aiData}
          />

          {inputTab === 'expenses' && (
            <div className="fade-in">
              <ExpenseCard expenses={expenses} setExpenses={setExpenses} totalFixed={totalFixed} />
            </div>
          )}

          {inputTab === 'wealth' && (
            <div className="fade-in">
              <AssetCard assets={assets} setAssets={setAssets} />
              <GoalCard goals={goals} setGoals={setGoals} />
            </div>
          )}

          {inputTab === 'wishlist' && (
            <div className="fade-in">
              <WishlistCard
                wishlist={wishlist}
                setWishlist={setWishlist}
                onAnalyze={analyzeBudget}
                isStreaming={isStreaming}
              />
            </div>
          )}

          {inputTab === 'tools' && (
            <div className="fade-in">
              <ToolsCard
                income={income}
                expenses={expenses}
                goals={goals}
                assets={assets}
                wishlist={wishlist}
                modelName={modelName}
              />
            </div>
          )}

        </section>

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
          assets={assets}
          expenses={expenses}
          aiData={aiData}
          isStreaming={isStreaming}
        />
      </main>
    </div>
  );
};

export default App;