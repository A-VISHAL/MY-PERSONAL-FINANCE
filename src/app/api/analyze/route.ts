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
  existingTermCover?: number;
  existingHealthCover?: number;
  existingSavings?: number;
  existingSIP?: number;
}

// 🧮 Financial Discipline Engine
function calculateFinancialDiscipline(userData: UserData) {
  let disciplineScore = 0;
  const components = {
    incomeStability: 0,
    expenseControl: 0,
    savingsConsistency: 0,
    debtBehaviour: 0,
    investmentBehaviour: 0
  };

  // 1️⃣ Income Stability (20 points)
  if (userData.salary > 50000) {
    components.incomeStability = 20;
  } else if (userData.salary > 25000) {
    components.incomeStability = 15;
  } else {
    components.incomeStability = 10;
  }

  // 2️⃣ Expense Control (20 points)
  const expenseRatio = (userData.expenses || userData.salary * 0.8) / userData.salary;
  if (expenseRatio < 0.6) {
    components.expenseControl = 20;
  } else if (expenseRatio < 0.8) {
    components.expenseControl = 15;
  } else {
    components.expenseControl = 8;
  }

  // 3️⃣ Savings Consistency (25 points) - CORE
  const savingsRate = ((userData.salary - (userData.expenses || userData.salary * 0.8)) / userData.salary);
  if (savingsRate > 0.25) {
    components.savingsConsistency = 25;
  } else if (savingsRate > 0.15) {
    components.savingsConsistency = 20;
  } else if (savingsRate > 0.05) {
    components.savingsConsistency = 12;
  } else {
    components.savingsConsistency = 5;
  }

  // 4️⃣ Debt Behaviour (15 points)
  if (expenseRatio < 0.7) {
    components.debtBehaviour = 15;
  } else if (expenseRatio < 0.85) {
    components.debtBehaviour = 10;
  } else {
    components.debtBehaviour = 5;
  }

  // 5️⃣ Investment Behaviour (20 points)
  if (userData.existingSIP && userData.existingSIP > 0) {
    components.investmentBehaviour = 20;
  } else if (userData.existingInvestments && userData.existingInvestments > 0) {
    components.investmentBehaviour = 15;
  } else {
    components.investmentBehaviour = 8;
  }

  disciplineScore = Object.values(components).reduce((sum, score) => sum + score, 0);
  return { disciplineScore, components };
}

// 🔗 Apply Discipline-Based Adjustments
function applyDisciplineAdjustments(data: any, disciplineScore: number, originalRisk: string) {
  let adjustedRisk = originalRisk;
  let disciplineMultiplier = 1.0;
  let insurancePriority = "MEDIUM";
  
  // 1️⃣ Risk Appetite Adjustment
  if (disciplineScore < 50 && originalRisk === 'aggressive') {
    adjustedRisk = 'moderate';
  }
  
  // 2️⃣ Insurance Priority
  if (disciplineScore < 60) {
    insurancePriority = "HIGH";
  }
  
  // 3️⃣ Final Score Multiplier
  if (disciplineScore >= 80) {
    disciplineMultiplier = 1.1;
  } else if (disciplineScore < 50) {
    disciplineMultiplier = 0.9;
  }
  
  return { adjustedRisk, disciplineMultiplier, insurancePriority };
}

export async function POST(request: Request) {
  try {
    const data: UserData = await request.json();
    const { salary, age, risk } = data;

    // 🧮 STEP 1: Calculate Financial Discipline (NEW)
    const { disciplineScore, components } = calculateFinancialDiscipline(data);
    const { adjustedRisk, disciplineMultiplier, insurancePriority } = applyDisciplineAdjustments(data, disciplineScore, risk);

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

    // --- 3. Investment Portfolio (Using Adjusted Risk) ---
    let portfolioAllocation = {};
    if (adjustedRisk === 'aggressive') {
      portfolioAllocation = {
        equity: 50, mutualFunds: 25, indexFunds: 10, gold: 5, fixedIncome: 5, crypto: 5
      };
    } else if (adjustedRisk === 'moderate') {
      portfolioAllocation = {
        equity: 30, mutualFunds: 30, indexFunds: 20, gold: 10, fixedIncome: 10, crypto: 0
      };
    } else { // Conservative
      portfolioAllocation = {
        equity: 10, mutualFunds: 20, indexFunds: 30, gold: 15, fixedIncome: 25, crypto: 0
      };
    }

    // Apply discipline-based equity cap
    if (disciplineScore < 60) {
      const equityReduction = Math.max(0, (portfolioAllocation as any).equity - 25);
      (portfolioAllocation as any).equity -= equityReduction;
      (portfolioAllocation as any).fixedIncome += equityReduction;
    }

    const investmentPortfolio = {
      riskProfile: adjustedRisk,
      originalRisk: risk, // Keep original for comparison
      allocation: portfolioAllocation,
      totalMonthlyInvestment: savings,
      disciplineAdjusted: adjustedRisk !== risk
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

    // --- 8. Next Actions (Discipline-Aware) ---
    const nextActions = [
      "Open a Demat account if you haven't already.",
      `Start an SIP of ₹${Math.round(savings)} immediately.`,
      disciplineScore < 60 ? "Purchase Term Insurance within this month (Priority: HIGH)." : "Purchase Term Insurance within this month.",
      "Set up an Emergency Fund in a Liquid Fund."
    ];

    // Add discipline-specific actions
    if (disciplineScore < 50) {
      nextActions.unshift("Focus on building consistent financial habits before aggressive investing.");
    }

    const response = {
      // 🆕 Financial Discipline Data
      financialDiscipline: {
        score: disciplineScore,
        components,
        level: disciplineScore >= 80 ? 'Highly Disciplined' : disciplineScore >= 60 ? 'Moderately Disciplined' : disciplineScore >= 40 ? 'Weak Discipline' : 'Undisciplined',
        adjustments: {
          riskAdjusted: adjustedRisk !== risk,
          originalRisk: risk,
          adjustedRisk,
          insurancePriority
        }
      },
      budgetPlan,
      insuranceRecommendation: {
        ...insuranceRecommendation,
        priority: insurancePriority
      },
      investmentPortfolio,
      stockRecommendations,
      sellAnalysis,
      goalPlanning: { goals: goalsPlanned },
      charts,
      nextActions,
      // Apply discipline multiplier to overall assessment
      overallHealthScore: Math.round(75 * disciplineMultiplier) // Base score of 75
    };

    return NextResponse.json(response);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  }
}
