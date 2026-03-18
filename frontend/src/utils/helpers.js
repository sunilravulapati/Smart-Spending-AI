export const GROQ_MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 (70B)', desc: 'Most capable, best reasoning' },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 (8B)', desc: 'Fast & lightweight' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', desc: 'Great for structured JSON' },
  { id: 'gemma2-9b-it', name: 'Gemma 2 (9B)', desc: 'Balanced & efficient' }
];


export const CHART_COLORS = {
  Bills: '#94a3b8',
  EMIs: '#ef4444', 
  Goals: '#8b5cf6', 
  FreeCash: '#10b981'
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