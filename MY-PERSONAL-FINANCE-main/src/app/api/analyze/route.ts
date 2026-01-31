import { NextResponse } from 'next/server';

interface UserData {
  salary: number;
  age: number;
  city: string;
  risk: 'conservative' | 'moderate' | 'aggressive';
  goals: string[];
  rent?: number;
  expenses?: number;
  existingInvestments?: number;
}

export async function POST(request: Request) {
  try {
    const data: UserData = await request.json();
    const { salary, age, risk } = data;

    // --- 1. Budgeting Logic (50-30-20 Rule Modified) ---
    const needs = salary * 0.5;
    const wants = salary * 0.3;
    const savings = salary * 0.2;

    // Income Bracket
    let bracket = "Middle Income";
    if (salary < 30000) bracket = "Low Income";
    if (salary > 150000) bracket = "High Income";

    const budgetPlan = {
      incomeBracket: bracket,
      monthlyAllocation: {
        needs: { amount: needs, percentage: 50, label: "Needs (Rent, Food, Bills)" },
        wants: { amount: wants, percentage: 30, label: "Wants (Entertainment, Shopping)" },
        savings: { amount: savings, percentage: 20, label: "Savings & Investments" }
      }
    };

    // --- 2. Insurance Recommendation ---
    const termCover = salary * 12 * 20; // 20x annual income
    const healthCover = 500000 + (data.city === 'metro' ? 500000 : 0); // 5L base + 5L for metro

    const insuranceRecommendation = {
      termLife: {
        recommendedCover: termCover,
        reason: "20x annual income to secure dependents financial future."
      },
      healthInsurance: {
        recommendedCover: healthCover,
        reason: "Coverage adjusted for medical inflation and city tier."
      },
      personalAccident: {
        recommendedCover: salary * 12 * 10, // 10x annual income
        reason: "To cover disability or loss of income due to accidents."
      },
      riders: ["Critical Illness Rider", "Waiver of Premium"]
    };

    // --- 3. Investment Portfolio ---
    let portfolioAllocation = {};
    if (risk === 'aggressive') {
      portfolioAllocation = {
        equity: 50, mutualFunds: 25, indexFunds: 10, gold: 5, fixedIncome: 5, crypto: 5
      };
    } else if (risk === 'moderate') {
      portfolioAllocation = {
        equity: 30, mutualFunds: 30, indexFunds: 20, gold: 10, fixedIncome: 10, crypto: 0
      };
    } else { // Conservative
      portfolioAllocation = {
        equity: 10, mutualFunds: 20, indexFunds: 30, gold: 15, fixedIncome: 25, crypto: 0
      };
    }

    const investmentPortfolio = {
      riskProfile: risk,
      allocation: portfolioAllocation,
      totalMonthlyInvestment: savings // Assuming all savings go to investment for simplicity
    };

    // --- 4. Stock Recommendations & Forecasting Engine ---
    const generateForecast = (currentPrice: number, growthRate: number, volatility: number) => {
      const history = [];
      const future = [];
      const currentYear = new Date().getFullYear();

      // Generate 5 Years Historical Data (Reverse Engineering)
      for (let i = 5; i > 0; i--) {
        const year = currentYear - i;
        // Price = Current / (1 + rate)^years (+/- random noise)
        const noise = 1 + (Math.random() * volatility - volatility / 2);
        const price = Math.round((currentPrice / Math.pow(1 + growthRate, i)) * noise);
        history.push({ year, price });
      }
      history.push({ year: currentYear, price: currentPrice });

      // Generate 5 Years Future Forecast
      for (let i = 1; i <= 5; i++) {
        const year = currentYear + i;
        // Price = Current * (1 + rate)^years (+/- random noise)
        const noise = 1 + (Math.random() * volatility - volatility / 2);
        const price = Math.round((currentPrice * Math.pow(1 + growthRate, i)) * noise);
        future.push({ year, price });
      }

      return { history, future };
    };

    const stockList = [
      { ticker: "RELIANCE", name: "Reliance Industries", sector: "Energy", price: 2450, signal: "BUY", reason: "5G & Green Energy pivot", growth: 0.12, vol: 0.05 },
      { ticker: "HDFCBANK", name: "HDFC Bank", sector: "Banking", price: 1600, signal: "HOLD", reason: "Merger synergies pending", growth: 0.10, vol: 0.04 },
      { ticker: "TCS", name: "Tata Consultancy", sector: "IT", price: 3400, signal: "BUY", reason: "Strong AI deal pipeline", growth: 0.15, vol: 0.08 },
      { ticker: "INFY", name: "Infosys", sector: "IT", price: 1400, signal: "BUY", reason: "Undervalued vs Peers", growth: 0.14, vol: 0.09 },
      { ticker: "ITC", name: "ITC Ltd", sector: "FMCG", price: 450, signal: "HOLD", reason: "Defensive dividend stock", growth: 0.08, vol: 0.03 }
    ];

    const stockRecommendations = stockList.map(stock => {
      const { history, future } = generateForecast(stock.price, stock.growth, stock.vol);
      return {
        ...stock,
        forecast: {
          history,
          future,
          projectedPrice5Y: future[4].price,
          potentialReturn: Math.round(((future[4].price - stock.price) / stock.price) * 100)
        }
      };
    });

    // --- 5. Sell Analysis (General Advice) ---
    const sellAnalysis = {
      advice: "HOLD",
      reasoning: "Market is currently volatile but long-term trend is bullish. Avoid panic selling quality stocks.",
      risks: ["Global inflation", "Geopolitical tensions"]
    };

    // --- 6. Goal Planning ---
    const goalsPlanned = data.goals.map(goal => {
      let amount = 0;
      let years = 5;
      if (goal === 'house') { amount = 5000000; years = 10; }
      if (goal === 'car') { amount = 1500000; years = 5; }
      if (goal === 'emergency') { amount = salary * 6; years = 1; }
      if (goal === 'retirement') { amount = salary * 12 * 25; years = 30; }

      // Simple SIP Calc: Future Value = P * [ (1+i)^n - 1 ] / i * (1+i)
      // Reverse to find P (Monthly Installment). approximated for speed.
      // Assuming 12% annual return
      const r = 0.12 / 12;
      const n = years * 12;
      // Formula: SIP = Target / ( ((1+r)^n - 1)/r * (1+r) )
      const sipAmount = amount / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

      return {
        goalName: goal,
        targetAmount: amount,
        timeHorizonYears: years,
        monthlySIPRequired: Math.round(sipAmount),
        suggestedRoute: years > 5 ? "Equity Mutual Funds" : "Debt Funds / RD"
      };
    });

    // --- 7. Charts Data ---
    const charts = {
      portfolioPie: Object.entries(portfolioAllocation).map(([key, value]) => ({ name: key, value })),
      investmentGrowth: Array.from({ length: 11 }, (_, i) => {
        const year = new Date().getFullYear() + i;
        // Compound interest: A = P(1 + r/n)^(nt)
        // Assuming monthly contribution of 'savings' amount at 10% APY
        const r = 0.10;
        const P = savings * 12; // Annual contribution
        // Future Value of a Series (simplified)
        const amount = P * ((Math.pow(1 + r, i) - 1) / r);
        return { year, amount: Math.round(amount) };
      }),
      stockComparison: stockRecommendations.map(s => ({ name: s.ticker, price: s.price }))
    };

    // --- 8. Next Actions ---
    const nextActions = [
      "Open a Demat account if you haven't already.",
      `Start an SIP of ₹${Math.round(savings)} immediately.`,
      "Purchase Term Insurance within this month.",
      "Set up an Emergency Fund in a Liquid Fund."
    ];

    const response = {
      budgetPlan,
      insuranceRecommendation,
      investmentPortfolio,
      stockRecommendations,
      sellAnalysis,
      goalPlanning: { goals: goalsPlanned },
      charts,
      nextActions
    };

    return NextResponse.json(response);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  }
}
