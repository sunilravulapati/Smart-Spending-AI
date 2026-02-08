// src/utils/helpers.js

export const OLLAMA_MODELS = [
  { id: 'qwen2.5:7b', name: 'Qwen 2.5 (7B)', desc: 'Best for Math & Logic' },
  { id: 'llama3.1', name: 'Llama 3.1', desc: 'Balanced & Reliable' },
  { id: 'phi3', name: 'Phi-3', desc: 'Smart reasoning' },
  { id: 'phi3:mini', name: 'Phi-3 Mini', desc: 'Fast & Lightweight' }
];

// NEW: Semantic Colors
export const CHART_COLORS = {
  Bills: '#94a3b8',      // Slate Gray (Boring, fixed expenses)
  EMIs: '#ef4444',       // Red (Debt, negative impact)
  Goals: '#8b5cf6',      // Purple (Future savings, aspirational)
  FreeCash: '#10b981'    // Emerald Green (Safe to spend!)
};

export const calculateEMI = (p, r, n) => {
  if (!p || !n) return 0;
  if (!r || r === 0) return (p / n).toFixed(0);
  const rate = r / 12 / 100;
  const emi = p * rate * (Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
  return parseFloat(emi.toFixed(0));
};
export const calculateFutureValue = (principal, rate = 12, years = 10) => {
  if (!principal) return 0;
  // Formula: FV = P * (1 + r/100)^n
  const fv = principal * Math.pow((1 + rate / 100), years);
  return parseFloat(fv.toFixed(0));
};