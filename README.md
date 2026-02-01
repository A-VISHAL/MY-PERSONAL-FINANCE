# WealthWise AI - Personal Finance Advisor

WealthWiseAI: Your AI-powered personal finance co-pilot. Analyze finances, plan budgets, and get smart stock picks. Features real-time portfolio tracking, simulated trading, and wealth calculators. Built with Next.js 15 & Tailwind CSS for a modern, glassmorphic experience.

## 🚀 Features

- **Smart Budgeting**: Automates 50-30-20 rule allocations based on income brackets.
- **Insurance Engine**: Recommends Term Life and Health coverage calculated on user specific data.
- **Investment Portfolio**: Generates risk-adjusted portfolios (Equity, Debt, Gold, Crypto).
- **AI Stock Picks & Trading**: Simulates Buy/Sell signals with forecast charts and virtual trading.
- **My Portfolio**: Track your holdings, P/L, and total investment in real-time.
- **Financial Calculators**: Tools for Averaging Stock Price, SIP, and Lumpsum calculations.
- **Goal Planning**: Calculates SIPs required for major life goals (House, Education, Retirement).
- **Interactive Visuals**: Beautiful charts for portfolio allocation and wealth projection.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Custom Glassmorphism Theme
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript

## 🏗️ Architecture

### Frontend
- **State Management**: React Hooks (useState) for form and data handling.
- **Components**: Modularized into `components/ui` and `components/dashboard`.
- **Visualization**: Interactive charts for data storytelling.

### Backend (API Routes)
- **Route**: `src/app/api/analyze/route.ts`
- **Logic**: Contains the financial intelligence engine that processes inputs and returns the structured JSON response.
- **Scalability**: Ready to be connected to a real LLM (Ollama/OpenAI) or Database (PostgreSQL).

## 🏃‍♂️ Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔮 Future Roadmap (per user request)

- **LLM Integration**: Connect to Ollama/Llama 3 for generates personalized explanations.
- **Database**: Store user profiles in PostgreSQL/Supabase.
- **Auth**: Add NextAuth for proper user sessions.
- **Real-time Data**: Integrate Yahoo Finance API for live stock prices.
