import React, { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { TrendingUp, Target, Sparkles, Zap, Shield, PiggyBank, Wallet, Building2, ArrowRight } from 'lucide-react';
import { CATEGORY_COLORS, calculateFutureValue } from '../utils/helpers';

const Dashboard = ({
    income, totalFixed, totalLoanEMI, totalPrincipal,
    monthlySurplus, totalGoals, freeCash,
    totalAssets, totalLiabilities, netWorth, // New Props
    aiData, isStreaming, wishlist
}) => {
    const [activeTab, setActiveTab] = useState('health');
    const [forecastData, setForecastData] = useState([]);

    // --- Forecast Logic ---
    useEffect(() => {
        const data = [];
        let currentSavings = 0;
        let savingsWithPurchase = 0;

        // Safety check for wishlist
        const safeWishlist = wishlist || [];
        const safeFreeCash = freeCash || 0;

        const wishlistFirstMonthCost = safeWishlist.reduce((acc, item) =>
            acc + (item.isEmi ? parseFloat(item.calculatedMonthly) : parseFloat(item.cost)), 0);

        const wishlistMonthlyEmiCost = safeWishlist.reduce((acc, item) =>
            acc + (item.isEmi ? parseFloat(item.calculatedMonthly) : 0), 0);

        for (let i = 1; i <= 12; i++) {
            currentSavings += parseFloat(safeFreeCash);
            if (i === 1) {
                savingsWithPurchase += (parseFloat(safeFreeCash) - wishlistFirstMonthCost);
            } else {
                savingsWithPurchase += (parseFloat(safeFreeCash) - wishlistMonthlyEmiCost);
            }
            data.push({
                name: `M${i}`,
                "Status Quo": currentSavings,
                "With Purchase": savingsWithPurchase
            });
        }
        setForecastData(data);
    }, [freeCash, wishlist]);

    // Map data directly to colors
    const allocationData = [
        { name: 'Bills', value: (totalFixed || 0) - (totalLoanEMI || 0), color: CATEGORY_COLORS.Bills },
        { name: 'EMIs', value: totalLoanEMI || 0, color: CATEGORY_COLORS.EMIs },
        { name: 'Goals', value: totalGoals || 0, color: CATEGORY_COLORS.Goals },
        { name: 'Free Cash', value: Math.max(0, freeCash || 0), color: CATEGORY_COLORS.FreeCash }
    ];

    const debtRatio = ((totalLoanEMI / (income || 1)) * 100) || 0;

    // Safety for Opportunity Cost
    const firstItem = wishlist && wishlist.length > 0 ? wishlist[0] : null;
    const itemCost = firstItem ? parseFloat(firstItem.cost) : 0;
    const fv5Years = calculateFutureValue(itemCost, 12, 5);
    const fv10Years = calculateFutureValue(itemCost, 12, 10);

    useEffect(() => { if (aiData) setActiveTab('ai'); }, [aiData]);

    return (
        <section className="right-col">
            <div className="tabs">
                <button className={activeTab === 'health' ? 'active' : ''} onClick={() => setActiveTab('health')}>Financial Health</button>
                <button className={activeTab === 'forecast' ? 'active' : ''} onClick={() => setActiveTab('forecast')}>
                    <TrendingUp size={14} /> Forecast
                </button>
                <button className={activeTab === 'ai' ? 'active' : ''} onClick={() => setActiveTab('ai')}>AI Strategy</button>
            </div>

            {activeTab === 'health' && (
                <div className="dashboard-grid fade-in">
                    {/* Pie Chart */}
                    <div className="card chart-card">
                        <h4>Money Map</h4>
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

                    {/* Net Worth Card (NEW) */}
                    <div className="card full-width-card net-worth-card">
                        <div className="nw-header">
                            <div className="nw-title">
                                <Building2 size={20} className="icon-blue" />
                                <h3>Net Worth</h3>
                            </div>
                            <span className={`nw-badge ${(netWorth || 0) >= 0 ? 'positive' : 'negative'}`}>
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

                    {/* Debt Card */}
                    {totalLoanEMI > 0 && (
                        <div className="card debt-card full-width-card">
                            <div className="card-header">
                                <Target className="icon-orange" size={20} />
                                <h3>Debt Destroyer</h3>
                            </div>
                            <div className="debt-stats">
                                <div className="debt-stat">
                                    <span>Total Liability</span>
                                    <strong>₹{(totalPrincipal || 0).toLocaleString()}</strong>
                                </div>
                                <div className="debt-stat">
                                    <span>DTI Ratio</span>
                                    <strong className={debtRatio > 30 ? 'danger-text' : 'safe-text'}>{debtRatio.toFixed(1)}%</strong>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Stack */}
                    <div className="stats-stack">
                        <div className="card stat-card">
                            <span className="stat-label">Allocated to Goals</span>
                            <span className="stat-value">₹{(totalGoals || 0).toLocaleString()}</span>
                            <PiggyBank className="stat-icon" color="#10b981" />
                        </div>
                        <div className={`card stat-card ${(freeCash || 0) < 0 ? 'risky-border' : 'green-bg'}`}>
                            <span className="stat-label">True Free Cash</span>
                            <span className="stat-value">₹{(freeCash || 0).toLocaleString()}</span>
                            <Wallet className="stat-icon" />
                        </div>
                    </div>
                </div>
            )}

            {/* Forecast Tab */}
            {activeTab === 'forecast' && (
                <div className="dashboard-grid fade-in">
                    <div className="card full-width-card chart-card">
                        <h4>Projected Savings (1 Year)</h4>
                        <div className="chart-wrapper" style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={forecastData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                    <YAxis stroke="#94a3b8" fontSize={12} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Status Quo" stroke="#10b981" strokeWidth={3} dot={false} />
                                    <Line type="monotone" dataKey="With Purchase" stroke="#ef4444" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="forecast-insight">
                            {forecastData[11] && (
                                <p>
                                    <strong>By Month 12:</strong> You will have
                                    <span className="safe-text"> ₹{(forecastData[11]["Status Quo"] || 0).toLocaleString()} </span>
                                    vs
                                    <span className="danger-text"> ₹{(forecastData[11]["With Purchase"] || 0).toLocaleString()} </span>.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* AI Tab */}
            {activeTab === 'ai' && (
                <div className="ai-panel fade-in">
                    {isStreaming ? (
                        <div className="loading-state"><Sparkles className="spin" size={24} /><p>Analyzing...</p></div>
                    ) : aiData ? (
                        <>
                            <div className="card ai-main-card">
                                <div className="ai-header"><Sparkles size={18} color="#fbbf24" /><h4>AI ASSESSMENT</h4></div>
                                <div className="ai-content">{aiData.assessment}</div>
                            </div>

                            <div className="strategy-grid">
                                {aiData.strategies?.map((strat, i) => (
                                    <div key={i} className="card strategy-card">
                                        <div className="strat-icon">
                                            {i === 0 ? <Zap size={18} color="#10b981" /> : <Shield size={18} color="#3b82f6" />}
                                        </div>
                                        <div className="strat-content"><h5>{strat.title}</h5><p>{strat.text}</p></div>
                                    </div>
                                ))}
                            </div>

                            {/* Reality Check */}
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
                                </div>
                            )}

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
                        <div className="empty-state"><p>Run Analysis first.</p></div>
                    )}
                </div>
            )}
        </section>
    );
};

export default Dashboard;