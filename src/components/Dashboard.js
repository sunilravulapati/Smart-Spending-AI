import React, { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import {
    TrendingUp, Target, Sparkles, Zap, Shield, PiggyBank,
    Wallet, Building2, ArrowRight, AlertTriangle, CheckCircle
} from 'lucide-react';
import { CHART_COLORS, calculateFutureValue } from '../utils/helpers';
import Simulator from './Simulator';

const Dashboard = ({
    income, totalFixed, totalLoanEMI, totalPrincipal,
    monthlySurplus, totalGoals, freeCash,
    totalAssets, totalLiabilities, netWorth,
    assets, // Assets array for Emergency Fund calculation
    aiData, isStreaming, wishlist
}) => {
    const [activeTab, setActiveTab] = useState('health');
    const [forecastData, setForecastData] = useState([]);

    // --- Emergency Fund Calculation ---
    const liquidAssets = (assets || [])
        .filter(a => a.type === 'Cash' || a.type === 'Investment')
        .reduce((acc, curr) => acc + parseFloat(curr.value || 0), 0);

    const monthlyNeeds = totalFixed || 1; // Avoid divide by zero
    const runwayMonths = (liquidAssets / monthlyNeeds).toFixed(1);
    const isRunwaySafe = runwayMonths >= 6;
    const isRunwayRisky = runwayMonths < 3;

    // --- Forecast Logic ---
    useEffect(() => {
        const data = [];
        let currentSavings = 0;
        let savingsWithPurchase = 0;
        const safeWishlist = wishlist || [];
        const safeFreeCash = freeCash || 0;
        const wishlistFirstMonthCost = safeWishlist.reduce((acc, item) =>
            acc + (item.isEmi ? parseFloat(item.calculatedMonthly) : parseFloat(item.cost)), 0);
        const wishlistMonthlyEmiCost = safeWishlist.reduce((acc, item) =>
            acc + (item.isEmi ? parseFloat(item.calculatedMonthly) : 0), 0);

        for (let i = 1; i <= 12; i++) {
            currentSavings += parseFloat(safeFreeCash);
            if (i === 1) savingsWithPurchase += (parseFloat(safeFreeCash) - wishlistFirstMonthCost);
            else savingsWithPurchase += (parseFloat(safeFreeCash) - wishlistMonthlyEmiCost);
            data.push({ name: `M${i}`, "Status Quo": currentSavings, "With Purchase": savingsWithPurchase });
        }
        setForecastData(data);
    }, [freeCash, wishlist]);

    // --- Allocation Data for Pie Chart ---
    const allocationData = [
        { name: 'Bills', value: (totalFixed || 0) - (totalLoanEMI || 0), color: CHART_COLORS.Bills },
        { name: 'EMIs', value: totalLoanEMI || 0, color: CHART_COLORS.EMIs },
        { name: 'Goals', value: totalGoals || 0, color: CHART_COLORS.Goals },
        { name: 'Free Cash', value: Math.max(0, freeCash || 0), color: CHART_COLORS.FreeCash }
    ];

    // --- Debt Calculations ---
    const debtRatio = ((totalLoanEMI / (income || 1)) * 100) || 0;

    // --- Opportunity Cost Calculation ---
    const firstItem = wishlist && wishlist.length > 0 ? wishlist[0] : null;
    const itemCost = firstItem ? parseFloat(firstItem.cost) : 0;
    const fv5Years = calculateFutureValue(itemCost, 12, 5);
    const fv10Years = calculateFutureValue(itemCost, 12, 10);

    // Auto-switch to AI tab when analysis completes
    useEffect(() => {
        if (aiData) setActiveTab('ai');
    }, [aiData]);

    return (
        <section className="right-col">
            <div className="tabs">
                <button onClick={() => setActiveTab('health')} className={activeTab === 'health' ? 'active' : ''}>Health</button>
                <button onClick={() => setActiveTab('forecast')} className={activeTab === 'forecast' ? 'active' : ''}>Forecast</button>
                <button onClick={() => setActiveTab('simulator')} className={activeTab === 'simulator' ? 'active' : ''}>What If?</button>
                <button onClick={() => setActiveTab('ai')} className={activeTab === 'ai' ? 'active' : ''}>AI Strategy</button>
            </div>

            {/* --- HEALTH TAB --- */}
            {activeTab === 'health' && (
                <div className="dashboard-grid fade-in" id="dashboard-content">
                    {/* 1. Money Map */}
                    <div className="card chart-card">
                        <div className="card-header">
                            <h3>Money Map</h3>
                        </div>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={allocationData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {allocationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 2. Emergency Fund Calculator */}
                    <div className={`card emergency-card ${isRunwayRisky ? 'risk' : ''}`}>
                        <div className="card-header">
                            <Shield size={20} className={isRunwayRisky ? 'text-red' : 'text-green'} />
                            <h3>Emergency Runway</h3>
                        </div>
                        <div className="em-body">
                            <div className="em-stat-row">
                                <div className="em-stat">
                                    <span>Liquid Assets</span>
                                    <strong>₹{liquidAssets.toLocaleString()}</strong>
                                </div>
                                <div className="em-stat">
                                    <span>Monthly Needs</span>
                                    <strong>₹{monthlyNeeds.toLocaleString()}</strong>
                                </div>
                            </div>
                            <div className="em-result">
                                <span className="em-label">Coverage Period</span>
                                <span className={`em-value ${isRunwayRisky ? 'danger-text' : 'safe-text'}`}>
                                    {runwayMonths}
                                </span>
                                <span className="em-months-label">Months</span>
                            </div>
                            {isRunwayRisky && (
                                <div className="em-warning">
                                    <AlertTriangle size={16} />
                                    <span>Aim for at least 6 months (₹{(monthlyNeeds * 6).toLocaleString()})</span>
                                </div>
                            )}
                            {isRunwaySafe && (
                                <div className="em-success">
                                    <CheckCircle size={16} />
                                    <span>Well protected against emergencies!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. Net Worth */}
                    <div className="card net-worth-card">
                        <div className="nw-header">
                            <div className="nw-title">
                                <Building2 size={20} className="icon-blue" />
                                <h3>Net Worth</h3>
                            </div>
                            <span className={`badge ${(netWorth || 0) >= 0 ? 'safe' : 'risky'}`}>
                                {(netWorth || 0) >= 0 ? 'POSITIVE' : 'NEGATIVE'}
                            </span>
                        </div>
                        <div className="nw-grid">
                            <div className="nw-item">
                                <span>Assets</span>
                                <strong className="text-blue">₹{(totalAssets || 0).toLocaleString()}</strong>
                            </div>
                            <div className="nw-item">
                                <span>Liabilities</span>
                                <strong className="text-red">₹{(totalLiabilities || 0).toLocaleString()}</strong>
                            </div>
                            <div className="nw-divider"></div>
                            <div className="nw-item big">
                                <span>Net Worth</span>
                                <strong className={(netWorth || 0) >= 0 ? 'text-green' : 'text-red'}>
                                    ₹{(netWorth || 0).toLocaleString()}
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* 4. Debt Destroyer */}
                    {totalLoanEMI > 0 && (
                        <div className="card debt-card">
                            <div className="card-header">
                                <Target size={20} style={{ color: '#f97316' }} />
                                <h3>Debt Destroyer</h3>
                            </div>
                            <div className="debt-stats">
                                <div className="debt-stat">
                                    <span>Total Liability</span>
                                    <strong>₹{(totalPrincipal || 0).toLocaleString()}</strong>
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

                    {/* 5. Stats Stack - Full Width */}
                    <div className="full-width-card">
                        <div className="stats-stack">
                            <div className="card stat-card">
                                <span className="stat-label">Allocated to Goals</span>
                                <span className="stat-value">₹{(totalGoals || 0).toLocaleString()}</span>
                                <PiggyBank className="stat-icon" color="#10b981" />
                            </div>
                            <div className={`card stat-card ${(freeCash || 0) < 0 ? 'risky-border' : 'green-bg'}`}>
                                <span className="stat-label">True Free Cash</span>
                                <span className="stat-value">₹{(freeCash || 0).toLocaleString()}</span>
                                <Wallet className="stat-icon" color={(freeCash || 0) < 0 ? '#ef4444' : '#10b981'} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- FORECAST TAB --- */}
            {activeTab === 'forecast' && (
                <div className="fade-in">
                    <div className="card">
                        <div className="card-header">
                            <TrendingUp size={20} className="icon-blue" />
                            <h3>12-Month Savings Forecast</h3>
                        </div>
                        <p className="subtext">
                            Compares your savings with and without wishlist purchases
                        </p>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={forecastData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="Status Quo"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="With Purchase"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="forecast-insight">
                            {forecastData[11] && (
                                <p>
                                    <strong>By Month 12:</strong> You will have
                                    <span className="safe-text"> ₹{(forecastData[11]["Status Quo"] || 0).toLocaleString()} </span>
                                    vs
                                    <span className="danger-text"> ₹{(forecastData[11]["With Purchase"] || 0).toLocaleString()}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- SIMULATOR TAB --- */}
            {activeTab === 'simulator' && (
                <div className="fade-in">
                    <Simulator
                        income={income}
                        totalFixed={totalFixed}
                        freeCash={freeCash}
                    />
                </div>
            )}

            {/* --- AI TAB --- */}
            {activeTab === 'ai' && (
                <div className="ai-panel fade-in">
                    {isStreaming ? (
                        <div className="loading-state">
                            <Sparkles className="spin" size={24} />
                            <p>Analyzing your financial data...</p>
                        </div>
                    ) : aiData ? (
                        <>
                            {/* AI Assessment */}
                            <div className="card ai-main-card">
                                <div className="ai-header">
                                    <Sparkles size={18} color="#fbbf24" />
                                    <h4>AI ASSESSMENT</h4>
                                </div>
                                <div className="ai-content">{aiData.assessment}</div>
                            </div>

                            {/* Strategy Cards */}
                            {aiData.strategies && aiData.strategies.length > 0 && (
                                <div className="strategy-grid">
                                    {aiData.strategies.map((strat, i) => (
                                        <div key={i} className="card strategy-card">
                                            <div className="strat-icon">
                                                {i === 0 ? (
                                                    <Zap size={18} color="#10b981" />
                                                ) : (
                                                    <Shield size={18} color="#3b82f6" />
                                                )}
                                            </div>
                                            <div className="strat-content">
                                                <h5>{strat.title}</h5>
                                                <p>{strat.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Opportunity Cost "Reality Check" */}
                            {firstItem && (
                                <div className="card opportunity-card">
                                    <div className="opp-header">
                                        <h5>💰 The "Reality Check"</h5>
                                        <span className="tag">Invested @ 12%</span>
                                    </div>
                                    <div className="opp-grid">
                                        <div className="opp-stat">
                                            <span>5 Years</span>
                                            <strong>₹{fv5Years.toLocaleString()}</strong>
                                        </div>
                                        <ArrowRight size={16} className="arrow-icon" />
                                        <div className="opp-stat highlight">
                                            <span>10 Years</span>
                                            <strong>₹{fv10Years.toLocaleString()}</strong>
                                        </div>
                                    </div>
                                    <div className="opp-note">
                                        This is what ₹{itemCost.toLocaleString()} could become if invested instead
                                    </div>
                                </div>
                            )}

                            {/* Verdict Card */}
                            {aiData.verdict && (
                                <div className={`card verdict-card ${aiData.verdict.status === 'Safe' ? 'safe-border' : 'risky-border'}`}>
                                    <div className="verdict-header">
                                        <h3>{aiData.verdict.item}</h3>
                                        <span className={`badge ${aiData.verdict.status.toLowerCase()}`}>
                                            {aiData.verdict.status}
                                        </span>
                                    </div>
                                    <div className="verdict-impact-row">
                                        <span>Free Cash Impact</span>
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
                            <p>Run the analysis from the Wishlist tab to see AI recommendations.</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default Dashboard;