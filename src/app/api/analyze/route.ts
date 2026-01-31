import { NextResponse } from 'next/server';

interface UserData {
  salary: number;
  age: number;
  city: string;
  risk: 'conservative' | 'moderate' | 'aggressive';
  goals: string[];
  fixedExpenses: number;
  variableExpenses: number;
  hasEmergencyFund: 'yes' | 'no';
  emergencyFundAmount: number;
  dependents: number;
  monthlyEMI: number;
  currentDebts: number;
  existingLifeCover: number;
  existingHealthCover: number;
  currentMonthlyInvestment: number;
  portfolioData?: any[];
}

export async function POST(request: Request) {
  try {
    const data: UserData = await request.json();
    const {
      salary, age, risk,
      fixedExpenses, variableExpenses,
      hasEmergencyFund, emergencyFundAmount,
      dependents, monthlyEMI, currentDebts,
      existingLifeCover, existingHealthCover,
      currentMonthlyInvestment,
      portfolioData
    } = data;

    // --- Mode Detection ---
    const isModeA = portfolioData && portfolioData.length > 0;
    const mode = isModeA ? 'A' : 'B';
    const invRatio = currentMonthlyInvestment / salary;

    // --- Component Scoring (0-100 Scale, 20 pts each) ---

    // 1. Budget Score (0-20)
    const totalExpenses = fixedExpenses + variableExpenses + monthlyEMI;
    const expenseRatio = totalExpenses / salary;
    let budgetScore = 0;
    if (expenseRatio <= 0.5) budgetScore = 20;
    else if (expenseRatio <= 0.7) budgetScore = 15;
    else if (expenseRatio <= 0.9) budgetScore = 10;
    else budgetScore = 5;

    // 2. Savings Score (0-20)
    const monthsOfBuffer = emergencyFundAmount / totalExpenses;
    const savingsRate = (salary - totalExpenses) / salary;
    let savingsScore = 0;
    if (monthsOfBuffer >= 6) savingsScore += 10;
    else if (monthsOfBuffer >= 3) savingsScore += 7;
    else if (monthsOfBuffer >= 1) savingsScore += 3;

    if (savingsRate >= 0.3) savingsScore += 10;
    else if (savingsRate >= 0.2) savingsScore += 7;
    else if (savingsRate >= 0.1) savingsScore += 4;

    // 3. Debt Score (0-20)
    const emiToIncome = monthlyEMI / salary;
    let debtScore = 0;
    if (emiToIncome === 0) debtScore = 20;
    else if (emiToIncome <= 0.2) debtScore = 15;
    else if (emiToIncome <= 0.4) debtScore = 10;
    else debtScore = 5;
    if (currentDebts > salary * 24) debtScore -= 5; // Penalty for very high debt

    // 4. Investment Score (0-20)
    let investmentScore = 0;
    if (isModeA) {
      // Analyze portfolio (Mode A)
      const assetClasses = new Set(portfolioData?.map(p => p.sector));
      if (assetClasses.size >= 3) investmentScore += 10; // Diversification
      else investmentScore += 5;

      if (invRatio >= 0.2) investmentScore += 10;
      else if (invRatio >= 0.1) investmentScore += 5;
    } else {
      // Basic behavior (Mode B)
      if (invRatio >= 0.2) investmentScore = 20;
      else if (invRatio >= 0.15) investmentScore = 15;
      else if (invRatio >= 0.1) investmentScore = 10;
      else investmentScore = 5;
    }

    // 5. Insurance Score (0-20)
    const idealLifeCover = salary * 12 * 15; // 15x annual
    const idealHealthCover = 500000 + (dependents * 200000);
    let insuranceScore = 0;
    if (existingLifeCover >= idealLifeCover) insuranceScore += 10;
    else if (existingLifeCover >= idealLifeCover * 0.5) insuranceScore += 5;

    if (existingHealthCover >= idealHealthCover) insuranceScore += 10;
    else if (existingHealthCover >= idealHealthCover * 0.5) insuranceScore += 5;

    const totalFinancialScore = budgetScore + savingsScore + debtScore + investmentScore + insuranceScore;

    // --- Investment Eligibility Logic ---
    const emergencyBuffer = hasEmergencyFund === 'yes' ? (salary * 0.05) : (salary * 0.15);
    const eligibleAmount = salary - totalExpenses - emergencyBuffer;

    let recommendedAllocations = [];
    let strategy = "Conservative";

    if (eligibleAmount <= 0) {
      strategy = "Expense Optimization Required";
      recommendedAllocations = [{ type: "Emergency Buffer", amount: Math.max(0, salary - totalExpenses), reason: "Prioritize stability over risk." }];
    } else {
      strategy = eligibleAmount > 20000 ? "Aggressive-Growth" : "Moderate-Balanced";
      recommendedAllocations = [
        { type: "Equity Mutual Funds", amount: Math.round(eligibleAmount * 0.6), reason: "Long term growth engine." },
        { type: "Debt / Fixed Income", amount: Math.round(eligibleAmount * 0.3), reason: "Consistency & capital protection." },
        { type: "Gold", amount: Math.round(eligibleAmount * 0.1), reason: "Safe haven for family future." }
      ];
    }

    // --- Total Score Analysis ---
    const strengths = [];
    const weaknesses = [];
    const priorityActions = [];
    const portfolioInsights = { strengths: [] as string[], weaknesses: [] as string[], adjustments: [] as string[] };

    if (isModeA && portfolioData) {
      const sectors = new Set(portfolioData.map(p => p.sector));
      if (sectors.size >= 4) portfolioInsights.strengths.push("Excellent sectoral diversification.");
      else portfolioInsights.weaknesses.push("Concentration risk: Portfolio is limited to few sectors.");

      const totalValue = portfolioData.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
      portfolioData.forEach(p => {
        const weight = (p.price * p.quantity) / totalValue;
        if (weight > 0.4) {
          portfolioInsights.weaknesses.push(`High exposure to ${p.ticker} (${Math.round(weight * 100)}%).`);
          portfolioInsights.adjustments.push(`Reduce holdings in ${p.ticker} to below 20% for better risk management.`);
        }
      });

      if (invRatio >= 0.15) portfolioInsights.strengths.push("Consistent monthly investment habit.");
      else portfolioInsights.adjustments.push("Consider increasing your monthly SIPs to reach your goals faster.");
    }

    if (budgetScore >= 15) strengths.push("Disciplined spending habits.");
    else weaknesses.push("High expense-to-income ratio.");

    if (savingsScore >= 15) strengths.push("Healthy emergency buffer.");
    else {
      weaknesses.push("Insufficient emergency funds.");
      priorityActions.push("Build a 6-month emergency corpus immediately.");
    }

    if (debtScore < 10) {
      weaknesses.push("Debt burden is too high.");
      priorityActions.push("Focus on closing high-interest debts first.");
    }

    if (insuranceScore < 15) {
      weaknesses.push("Significant protection gap identified.");
      priorityActions.push("Increase Life and Health insurance coverage.");
    }

    const response = {
      scoreCard: {
        totalScore: totalFinancialScore,
        mode,
        breakdown: {
          budget: budgetScore,
          savings: savingsScore,
          debt: debtScore,
          investment: investmentScore,
          insurance: insuranceScore
        }
      },
      analysis: { strengths, weaknesses, priorityActions, portfolioInsights },
      protectionGap: {
        life: { required: idealLifeCover, actual: existingLifeCover, gap: Math.max(0, idealLifeCover - existingLifeCover) },
        health: { required: idealHealthCover, actual: existingHealthCover, gap: Math.max(0, idealHealthCover - existingHealthCover) }
      },
      insuranceRecommendation: {
        termLife: {
          recommendedCover: idealLifeCover,
          reason: `Based on your age and income, 15x annual cover is necessary to protect your ${dependents} dependents.`
        },
        healthInsurance: {
          recommendedCover: idealHealthCover,
          reason: "Standard family-floater cover adjusted for dependents and city tier."
        },
        riders: ["Critical Illness Rider", "Accidental Death Benefit", "Waiver of Premium"],
        actionSteps: ["Evaluate a pure Term Plan.", "Buy a Super Top-up for Health cover."]
      },
      eligible_investment_amount: eligibleAmount,
      investment_strategy: strategy,
      recommended_allocations: recommendedAllocations,
      budgetPlan: {
        incomeBracket: salary > 100000 ? "High" : "Middle", monthlyAllocation: {
          needs: { amount: fixedExpenses, percentage: Math.round(fixedExpenses / salary * 100) },
          wants: { amount: variableExpenses, percentage: Math.round(variableExpenses / salary * 100) },
          savings: { amount: eligibleAmount, percentage: Math.round(eligibleAmount / salary * 100) }
        }
      },
      stockRecommendations: [
        { ticker: "RELIANCE", name: "Reliance Industries", sector: "Energy/Telecom", price: 2950, signal: "BUY", reason: "Strong diversified cashflows and Jio growth." },
        { ticker: "HDFCBANK", name: "HDFC Bank", sector: "Banking", price: 1650, signal: "BUY", reason: "Sector leader at attractive valuation post-merger." },
        { ticker: "TCS", name: "TATA Consultancy", sector: "IT Services", price: 3800, signal: "HOLD", reason: "Strong margins but global macro headwinds." },
        { ticker: "INFY", name: "Infosys", sector: "IT Services", price: 1550, signal: "BUY", reason: "Large deal pipeline and attractive entry point." },
        { ticker: "ITC", name: "ITC Limited", sector: "FMCG/Hotels", price: 440, signal: "BUY", reason: "Strong dividend yield and FMCG margin expansion." },
        { ticker: "L&T", name: "Larsen & Toubro", sector: "Infrastructure", price: 3500, signal: "BUY", reason: "Record order book and domestic capex cycle." },
        { ticker: "TITAN", name: "Titan Company", sector: "Consumer Durables", price: 3600, signal: "HOLD", reason: "Market leader in jewelry with premium valuation." },
        { ticker: "ICICIBANK", name: "ICICI Bank", sector: "Banking", price: 1050, signal: "BUY", reason: "Superior asset quality and consistent credit growth." }
      ],
      nextActions: priorityActions.concat(["Automate your investments.", "Review your term plan riders."]),
      goalPlanning: {
        goals: (data.goals || ["Wealth Creation"]).map(g => ({
          goalName: g,
          monthlySIPRequired: Math.round(eligibleAmount * (1 / (data.goals?.length || 1))),
          timeHorizonYears: g.toLowerCase().includes('education') ? 15 : g.toLowerCase().includes('marriage') ? 10 : 20,
          suggestedRoute: risk === 'aggressive' ? "Equity Direct" : "Balanced Advantage Funds"
        }))
      },
      charts: {
        portfolioPie: recommendedAllocations.map(a => ({ name: a.type, value: a.amount })),
        investmentGrowth: Array.from({ length: 11 }, (_, i) => ({
          year: new Date().getFullYear() + i,
          amount: Math.round(eligibleAmount * 12 * i * (1 + (risk === 'aggressive' ? 0.12 : 0.08) * i))
        })),
        scoreBreakdown: [
          { name: 'Budget', value: budgetScore },
          { name: 'Savings', value: savingsScore },
          { name: 'Debt', value: debtScore },
          { name: 'Invest', value: investmentScore },
          { name: 'Protect', value: insuranceScore }
        ]
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  }
}
