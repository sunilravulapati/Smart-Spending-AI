import React, { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import {
    TrendingUp, Target, Sparkles, Zap, Shield, PiggyBank,
    Wallet, Building2, ArrowRight, AlertTriangle, CheckCircle,
    Brain, TrendingDown, CircleDollarSign, Lightbulb, BadgeCheck, XCircle, Clock
} from 'lucide-react';
import { CHART_COLORS, calculateFutureValue } from '../utils/helpers';
import Simulator from './Simulator';
import HealthScore from './HealthScore';
import BillCalendar from './BillCalendar';

/* ─── STATUS CONFIG ─────────────────────────────────────────── */
const STATUS_CONFIG = {
    Safe: {
        icon: BadgeCheck,
        gradient: 'linear-gradient(135deg, #052e16 0%, #064e3b 100%)',
        border: '#10b981',
        badge: { bg: '#10b981', text: '#fff' },
        glow: '0 0 24px rgba(16,185,129,0.15)',
        label: 'Safe to Buy',
    },
    Risky: {
        icon: AlertTriangle,
        gradient: 'linear-gradient(135deg, #431407 0%, #7c2d12 100%)',
        border: '#f97316',
        badge: { bg: '#f97316', text: '#fff' },
        glow: '0 0 24px rgba(249,115,22,0.15)',
        label: 'Proceed with Caution',
    },
    Avoid: {
        icon: XCircle,
        gradient: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
        border: '#ef4444',
        badge: { bg: '#ef4444', text: '#fff' },
        glow: '0 0 24px rgba(239,68,68,0.15)',
        label: 'Not Recommended',
    },
    Hold: {
        icon: Clock,
        gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        border: '#818cf8',
        badge: { bg: '#818cf8', text: '#fff' },
        glow: '0 0 24px rgba(129,140,248,0.15)',
        label: 'Wait & Save',
    },
};

const getStatusConfig = (status) =>
    STATUS_CONFIG[status] || STATUS_CONFIG['Risky'];

/* ─── INLINE STYLES ─────────────────────────────────────────── */
const S = {
    aiPanel: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },

    /* Assessment card */
    assessmentCard: {
        background: 'linear-gradient(135deg, #0a0a1a 0%, #0f172a 60%, #0a1628 100%)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '16px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1)',
    },
    assessmentGlow: {
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    assessmentHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '14px',
    },
    assessmentBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(99,102,241,0.15)',
        border: '1px solid rgba(99,102,241,0.4)',
        borderRadius: '20px',
        padding: '4px 12px',
        fontSize: '11px',
        fontWeight: 700,
        color: '#a5b4fc',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
    },
    assessmentText: {
        color: '#cbd5e1',
        fontSize: '14px',
        lineHeight: '1.75',
        margin: 0,
    },

    /* Verdict cards */
    verdictsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '14px',
    },
    verdictCard: (status) => {
        const cfg = getStatusConfig(status);
        return {
            background: cfg.gradient,
            border: `1px solid ${cfg.border}40`,
            borderLeft: `3px solid ${cfg.border}`,
            borderRadius: '14px',
            padding: '18px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: cfg.glow,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'default',
        };
    },
    verdictTopRow: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '10px',
        gap: '8px',
    },
    verdictItemName: {
        color: '#f1f5f9',
        fontWeight: 700,
        fontSize: '15px',
        lineHeight: 1.3,
        flex: 1,
    },
    verdictBadge: (status) => {
        const cfg = getStatusConfig(status);
        return {
            background: cfg.badge.bg,
            color: cfg.badge.text,
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            flexShrink: 0,
        };
    },
    verdictIconRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '8px',
    },
    verdictStatusLabel: (status) => {
        const cfg = getStatusConfig(status);
        return {
            fontSize: '11px',
            fontWeight: 600,
            color: cfg.border,
            letterSpacing: '0.04em',
        };
    },
    verdictAdvice: {
        color: '#94a3b8',
        fontSize: '13px',
        lineHeight: '1.65',
        margin: 0,
    },

    /* Opportunity / Reality Check card */
    oppCard: {
        background: 'linear-gradient(135deg, #0c1a0c 0%, #0f2d1a 100%)',
        border: '1px solid rgba(16,185,129,0.25)',
        borderRadius: '16px',
        padding: '22px',
        boxShadow: '0 0 24px rgba(16,185,129,0.08)',
    },
    oppHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px',
    },
    oppTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#f1f5f9',
        fontWeight: 700,
        fontSize: '15px',
        margin: 0,
    },
    oppTag: {
        background: 'rgba(16,185,129,0.15)',
        border: '1px solid rgba(16,185,129,0.3)',
        color: '#6ee7b7',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 700,
    },
    oppGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '14px',
    },
    oppStat: (highlight) => ({
        textAlign: 'center',
    }),
    oppStatLabel: {
        display: 'block',
        fontSize: '11px',
        color: '#64748b',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '4px',
    },
    oppStatValue: (highlight) => ({
        display: 'block',
        fontSize: highlight ? '22px' : '18px',
        fontWeight: 800,
        color: highlight ? '#10b981' : '#94a3b8',
        lineHeight: 1.1,
    }),
    oppArrow: {
        color: '#374151',
    },
    oppNote: {
        textAlign: 'center',
        fontSize: '12px',
        color: '#475569',
        lineHeight: 1.5,
    },
    oppNoteHighlight: {
        color: '#10b981',
        fontWeight: 600,
    },

    /* Loading / empty states */
    loadingState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        padding: '60px 20px',
        color: '#64748b',
    },
    loadingText: {
        fontSize: '14px',
        color: '#94a3b8',
        margin: 0,
    },
    loadingOrb: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'pulse 1.5s ease-in-out infinite',
        boxShadow: '0 0 24px rgba(99,102,241,0.4)',
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#475569',
    },
    emptyIcon: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
    },
    emptyTitle: {
        color: '#94a3b8',
        fontWeight: 600,
        fontSize: '15px',
        margin: '0 0 6px',
    },
    emptySubtext: {
        color: '#475569',
        fontSize: '13px',
        margin: 0,
    },

    /* Section label */
    sectionLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        fontWeight: 700,
        color: '#475569',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '0 2px',
    },
    sectionLine: {
        flex: 1,
        height: '1px',
        background: 'rgba(255,255,255,0.06)',
    },
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
const Dashboard = ({
    income, totalFixed, totalLoanEMI, totalPrincipal,
    monthlySurplus, totalGoals, freeCash,
    totalAssets, totalLiabilities, netWorth,
    assets, expenses,
    aiData, isStreaming, wishlist
}) => {
    const [activeTab, setActiveTab] = useState('health');
    const [forecastData, setForecastData] = useState([]);

    // --- Emergency Fund Calculation ---
    const liquidAssets = (assets || [])
        .filter(a => a.type === 'Cash' || a.type === 'Investment')
        .reduce((acc, curr) => acc + parseFloat(curr.value || 0), 0);

    const monthlyNeeds = totalFixed || 1;
    const runwayMonths = parseFloat((liquidAssets / monthlyNeeds).toFixed(1));
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

    // --- Opportunity Cost (total across all wishlist items) ---
    const firstItem = wishlist && wishlist.length > 0 ? wishlist[0] : null;
    const totalWishlistCost = (wishlist || []).reduce((acc, item) => acc + parseFloat(item.cost || 0), 0);
    const itemCost = totalWishlistCost;
    const fv5Years = calculateFutureValue(totalWishlistCost, 12, 5);
    const fv10Years = calculateFutureValue(totalWishlistCost, 12, 10);

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
                    <div className="full-width-card">
                        <HealthScore
                            income={income}
                            totalFixed={totalFixed}
                            totalGoals={totalGoals}
                            freeCash={freeCash}
                            totalLoanEMI={totalLoanEMI}
                            runwayMonths={runwayMonths}
                            netWorth={netWorth}
                        />
                    </div>

                    <div className="card chart-card">
                        <div className="card-header">
                            <h3>Money Map</h3>
                        </div>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={allocationData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
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
                                <span className={`em-value ${isRunwayRisky ? 'danger-text' : 'safe-text'}`}>{runwayMonths}</span>
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

                    <div className="full-width-card">
                        <BillCalendar expenses={expenses} />
                    </div>

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
                        <p className="subtext">Compares your savings with and without wishlist purchases</p>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={forecastData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Status Quo" stroke="#10b981" strokeWidth={2} />
                                    <Line type="monotone" dataKey="With Purchase" stroke="#ef4444" strokeWidth={2} />
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
                    <Simulator income={income} totalFixed={totalFixed} freeCash={freeCash} />
                </div>
            )}

            {/* ════════════════════════════════════════════════
                AI STRATEGY TAB — redesigned
            ════════════════════════════════════════════════ */}
            {activeTab === 'ai' && (
                <div style={S.aiPanel} className="fade-in">

                    {/* ── LOADING ── */}
                    {isStreaming && (
                        <div style={S.loadingState}>
                            <div style={S.loadingOrb}>
                                <Sparkles size={22} color="#fff" />
                            </div>
                            <p style={S.loadingText}>Analysing your financial data…</p>
                        </div>
                    )}

                    {/* ── DATA ── */}
                    {!isStreaming && aiData && (
                        <>
                            {/* 1. Assessment */}
                            <div style={S.assessmentCard}>
                                <div style={S.assessmentGlow} />
                                <div style={S.assessmentHeader}>
                                    <div style={S.assessmentBadge}>
                                        <Brain size={12} />
                                        AI Assessment
                                    </div>
                                </div>
                                <p style={S.assessmentText}>{aiData.assessment}</p>
                            </div>

                            {/* 2. Verdict cards — multiple items */}
                            {aiData.verdicts && aiData.verdicts.length > 0 && (
                                <>
                                    <div style={S.sectionLabel}>
                                        <span>Purchase Verdicts</span>
                                        <div style={S.sectionLine} />
                                    </div>
                                    <div style={S.verdictsGrid}>
                                        {aiData.verdicts.map((v, i) => {
                                            const cfg = getStatusConfig(v.status);
                                            const Icon = cfg.icon;
                                            return (
                                                <div key={i} style={S.verdictCard(v.status)}>
                                                    <div style={S.verdictTopRow}>
                                                        <span style={S.verdictItemName}>{v.item}</span>
                                                        <span style={S.verdictBadge(v.status)}>{v.status}</span>
                                                    </div>
                                                    <div style={S.verdictIconRow}>
                                                        <Icon size={14} color={cfg.border} />
                                                        <span style={S.verdictStatusLabel(v.status)}>{cfg.label}</span>
                                                    </div>
                                                    <p style={S.verdictAdvice}>{v.advice}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {/* 3. Single legacy verdict (aiData.verdict) */}
                            {aiData.verdict && !aiData.verdicts && (() => {
                                const v = aiData.verdict;
                                const cfg = getStatusConfig(v.status);
                                const Icon = cfg.icon;
                                return (
                                    <>
                                        <div style={S.sectionLabel}>
                                            <span>Purchase Verdict</span>
                                            <div style={S.sectionLine} />
                                        </div>
                                        <div style={S.verdictCard(v.status)}>
                                            <div style={S.verdictTopRow}>
                                                <span style={S.verdictItemName}>{v.item}</span>
                                                <span style={S.verdictBadge(v.status)}>{v.status}</span>
                                            </div>
                                            <div style={S.verdictIconRow}>
                                                <Icon size={14} color={cfg.border} />
                                                <span style={S.verdictStatusLabel(v.status)}>{cfg.label}</span>
                                            </div>
                                            {v.impact && (
                                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                                                    <CircleDollarSign size={13} color="#64748b" />
                                                    <span style={{ fontSize: '12px', color: '#64748b' }}>Free Cash Impact: </span>
                                                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>{v.impact}</span>
                                                </div>
                                            )}
                                            <p style={S.verdictAdvice}>{v.advice}</p>
                                        </div>
                                    </>
                                );
                            })()}

                            {/* 4. Opportunity / Reality Check */}
                            {totalWishlistCost > 0 && (
                                <>
                                    <div style={S.sectionLabel}>
                                        <span>Opportunity Cost</span>
                                        <div style={S.sectionLine} />
                                    </div>
                                    <div style={S.oppCard}>
                                        <div style={S.oppHeader}>
                                            <h5 style={S.oppTitle}>
                                                <Lightbulb size={16} color="#fbbf24" />
                                                The Reality Check
                                            </h5>
                                            <span style={S.oppTag}>Invested @ 12% p.a.</span>
                                        </div>
                                        <div style={S.oppGrid}>
                                            <div style={S.oppStat(false)}>
                                                <span style={S.oppStatLabel}>5 Years</span>
                                                <span style={S.oppStatValue(false)}>₹{fv5Years.toLocaleString()}</span>
                                            </div>
                                            <ArrowRight size={18} style={S.oppArrow} />
                                            <div style={S.oppStat(true)}>
                                                <span style={S.oppStatLabel}>10 Years</span>
                                                <span style={S.oppStatValue(true)}>₹{fv10Years.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <p style={S.oppNote}>
                                            ₹{itemCost.toLocaleString()} total wishlist cost could become{' '}
                                            <span style={S.oppNoteHighlight}>₹{fv10Years.toLocaleString()}</span>{' '}
                                            in 10 years if invested instead.
                                        </p>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* ── EMPTY ── */}
                    {!isStreaming && !aiData && (
                        <div style={S.emptyState}>
                            <div style={S.emptyIcon}>
                                <Sparkles size={24} color="#6366f1" />
                            </div>
                            <p style={S.emptyTitle}>No analysis yet</p>
                            <p style={S.emptySubtext}>
                                Run the analysis from the Wishlist tab to see AI recommendations.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default Dashboard;