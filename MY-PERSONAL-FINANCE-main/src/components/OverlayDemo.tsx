import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface OverlayDemoProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function OverlayDemo({ children, title, description }: OverlayDemoProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-sm font-semibold text-primary">{title}</h4>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
          title={isVisible ? 'Hide overlay' : 'Show overlay'}
        >
          {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      
      {isVisible && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

// Demo data for testing overlays
export const demoUserData = {
  salary: 80000,
  age: 28,
  city: 'metro',
  risk: 'moderate',
  goals: ['house', 'retirement', 'emergency'],
  rent: 25000,
  expenses: 60000,
  existingInvestments: 200000,
  existingTermCover: 500000, // 5L (under-insured)
  existingHealthCover: 300000, // 3L (under-insured)
  existingSavings: 150000, // 1.5L (2.5 months coverage)
  existingSIP: 5000
};

export const demoAnalysisData = {
  budgetPlan: {
    incomeBracket: "High Income",
    monthlyAllocation: {
      needs: { amount: 40000, percentage: 50 },
      wants: { amount: 24000, percentage: 30 },
      savings: { amount: 16000, percentage: 20 }
    }
  },
  insuranceRecommendation: {
    termLife: {
      recommendedCover: 19200000, // 20x annual income
      reason: "20x annual income to secure dependents financial future."
    },
    healthInsurance: {
      recommendedCover: 1000000, // 10L for metro
      reason: "Coverage adjusted for medical inflation and city tier."
    }
  },
  investmentPortfolio: {
    riskProfile: 'moderate',
    allocation: {
      equity: 30,
      mutualFunds: 30,
      indexFunds: 20,
      gold: 10,
      fixedIncome: 10,
      crypto: 0
    },
    totalMonthlyInvestment: 16000
  }
};