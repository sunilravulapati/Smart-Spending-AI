// src/utils/helpers.js

export const OLLAMA_MODELS = [
  { id: 'qwen2.5:7b', name: 'Qwen 2.5 (7B)', desc: 'Best for Math & Logic' },
  { id: 'llama3.1', name: 'Llama 3.1', desc: 'Balanced & Reliable' },
  { id: 'phi3', name: 'Phi-3', desc: 'Smart reasoning' },
  { id: 'phi3:mini', name: 'Phi-3 Mini', desc: 'Fast & Lightweight' }
];

export const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const calculateEMI = (p, r, n) => {
  if (!p || !n) return 0;
  if (!r || r === 0) return (p / n).toFixed(0);
  const rate = r / 12 / 100;
  const emi = p * rate * (Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
  return parseFloat(emi.toFixed(0));
};