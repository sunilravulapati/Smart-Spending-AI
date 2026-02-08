# ProsperOS - AI-Powered Personal Finance System

**ProsperOS** is a privacy-first, local-first financial operating system designed for the Indian middle class. Unlike standard expense trackers, it calculates "True Free Cash," tracks Net Worth, forecasts future savings, and uses a local AI (LLM) to provide personalized financial strategy—all without your data ever leaving your device.

## 🚀 Key Features

### 📊 Smart Dashboard
- **Money Map:** Visual breakdown of Bills vs. EMIs vs. Goals vs. Free Cash.
- **Debt Destroyer:** Automatically calculates DTI (Debt-to-Income) ratio and tracks total liabilities.
- **Net Worth Tracker:** Real-time calculation of Assets (Gold, Stocks, Cash) minus Liabilities.

### 🧠 Local AI Strategy (Privacy-First)
- **Powered by Ollama:** Connects to local Llama 3 or Qwen 2.5 models.
- **Opportunity Cost Engine:** "Reality Check" widget that calculates the 10-year future value of any wishlist purchase if invested instead.
- **Spending Advice:** Context-aware advice based on your specific debt levels and cash flow.

### 🔮 Forecasting & Simulation
- **12-Month Time Travel:** A line chart projecting your bank balance a year from now based on current spending vs. buying wishlist items.
- **"What If" Simulator:** Stress-test your budget against inflation, salary hikes, or rent increases.

### 🛠 Tools
- **Emergency Fund Calculator:** Calculates your runway based on liquid assets.
- **PDF Reports:** Generate professional financial audit reports.
- **Data Privacy:** Full Import/Export capability (JSON). No external database.

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Visualization:** Recharts
- **Icons:** Lucide-React
- **AI Integration:** Ollama (Local API)
- **PDF Generation:** jsPDF, html2canvas
---
## ⚡ Getting Started

### Prerequisites
1. **Node.js** installed on your machine.
2. **Ollama** installed for AI features ([Download Here](https://ollama.com/)).

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/prosperos.git](https://github.com/yourusername/prosperos.git)
   cd prosperos
   ```
2. **Install Dependencies**
```bash
npm install
```
3. **Setup Ollama (For AI Features) Pull the recommended model (Qwen 2.5 is best for math/logic):**
```bash
ollama run qwen2.5:7b
```
Note: Ensure Ollama is running in the background.

4. **Run the App**
```bash
npm start
```
5. **Open http://localhost:3000 to view it in the browser.**

---

⚠️ Important Note on AI
This application connects to http://localhost:11434 to talk to your local AI.

If you are running this locally, it works out of the box.

If you encounter CORS errors, you may need to set the environment variable on your computer: OLLAMA_ORIGINS="*".
