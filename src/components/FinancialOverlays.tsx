import { useState } from 'react';
import { Shield, AlertTriangle, TrendingUp, Target, Clock, Award, Zap, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface OverlayProps {
  data: any;
  userData: any;
}

// 1️⃣ Insurance Adequacy Overlay
export function InsuranceAdequacyOverlay({ data, userData }: OverlayProps) {
  const currentTermCover = userData.existingTermCover || 0;
  const currentHealthCover = userData.existingHealthCover || 0;
  
  const termAdequacy = Math.min((currentTermCover / data.insuranceRecommendation.termLife.recommendedCover) * 100, 100);
  const healthAdequacy = Math.min((currentHealthCover / data.insuranceRecommendation.healthInsurance.recommendedCover) * 100, 100);
  
  const getAdequacyLabel = (percentage: number) => {
    if (percentage < 40) return { label: 'Under-insured', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (percentage < 80) return { label: 'Adequate', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { label: 'Well-protected', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const termStatus = getAdequacyLabel(termAdequacy);
  const healthStatus = getAdequacyLabel(healthAdequacy);

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
      <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
        <Shield size={16} className="text-blue-400" />
        Insurance Adequacy Check
      </h4>
      
      {/* Term Life Adequacy */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Term Life Coverage</span>
          <span className={`text-xs px-2 py-1 rounded-full ${termStatus.bg} ${termStatus.color}`}>
            {termStatus.label}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(termAdequacy, 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-500">
          Current: ₹{currentTermCover/100000}L / Recommended: ₹{data.insuranceRecommendation.termLife.recommendedCover/100000}L
        </div>
      </div>

      {/* Health Insurance Adequacy */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Health Coverage</span>
          <span className={`text-xs px-2 py-1 rounded-full ${healthStatus.bg} ${healthStatus.color}`}>
            {healthStatus.label}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(healthAdequacy, 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-500">
          Current: ₹{currentHealthCover/100000}L / Recommended: ₹{data.insuranceRecommendation.healthInsurance.recommendedCover/100000}L
        </div>
      </div>
    </div>
  );
}

// 2️⃣ Risk Appetite Alignment Check
export function RiskAlignmentOverlay({ data, userData }: OverlayProps) {
  const userRisk = userData.risk;
  const portfolioRisk = data.investmentPortfolio.riskProfile;
  const equityAllocation = data.investmentPortfolio.allocation.equity + data.investmentPortfolio.allocation.mutualFunds;
  
  const getRiskAlignment = () => {
    if (userRisk === portfolioRisk) return { status: 'Aligned', color: 'text-green-400', icon: CheckCircle };
    
    const riskLevels = { conservative: 1, moderate: 2, aggressive: 3 };
    const userLevel = riskLevels[userRisk as keyof typeof riskLevels];
    const portfolioLevel = riskLevels[portfolioRisk as keyof typeof riskLevels];
    
    if (portfolioLevel > userLevel) return { status: 'Over-risked', color: 'text-red-400', icon: AlertTriangle };
    return { status: 'Under-utilized', color: 'text-yellow-400', icon: AlertCircle };
  };

  const alignment = getRiskAlignment();
  const Icon = alignment.icon;

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
      <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
        <Target size={16} className="text-purple-400" />
        Risk Appetite Alignment
      </h4>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">Portfolio vs Your Risk Profile</span>
        <div className={`flex items-center gap-1 ${alignment.color}`}>
          <Icon size={14} />
          <span className="text-xs font-medium">{alignment.status}</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <div>Your Risk Appetite: <span className="capitalize text-gray-300">{userRisk}</span></div>
        <div>Portfolio Risk: <span className="capitalize text-gray-300">{portfolioRisk}</span></div>
        <div>Equity Allocation: <span className="text-gray-300">{equityAllocation}%</span></div>
      </div>
    </div>
  );
}

// 3️⃣ Protection-First Rule Warning
export function ProtectionFirstWarning({ data, userData }: OverlayProps) {
  const currentTermCover = userData.existingTermCover || 0;
  const termAdequacy = (currentTermCover / data.insuranceRecommendation.termLife.recommendedCover) * 100;
  const equityAllocation = data.investmentPortfolio.allocation.equity + data.investmentPortfolio.allocation.mutualFunds;
  
  const showWarning = termAdequacy < 60 && equityAllocation > 60;
  
  if (!showWarning) return null;

  return (
    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
      <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
      <div>
        <h4 className="text-sm font-semibold text-red-400 mb-1">Protection Gap Alert</h4>
        <p className="text-xs text-red-300/80 leading-relaxed">
          You are taking high investment risk ({equityAllocation}% equity) without adequate insurance protection. 
          Consider securing your family first before aggressive investing.
        </p>
      </div>
    </div>
  );
}

// 4️⃣ Emergency Fund Stress Test
export function EmergencyFundStressTest({ data, userData }: OverlayProps) {
  const monthlyExpenses = userData.expenses || (userData.salary * 0.8); // 80% of salary as expenses
  const currentSavings = userData.existingSavings || 0;
  const monthsCovered = currentSavings / monthlyExpenses;
  
  const getStressLevel = (months: number) => {
    if (months < 3) return { level: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (months < 6) return { level: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: 'Strong', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const stressLevel = getStressLevel(monthsCovered);

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
      <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
        <Zap size={16} className="text-orange-400" />
        Emergency Fund Stress Test
      </h4>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Survival Period</span>
          <span className={`text-xs px-2 py-1 rounded-full ${stressLevel.bg} ${stressLevel.color}`}>
            {stressLevel.level}
          </span>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{monthsCovered.toFixed(1)}</div>
          <div className="text-xs text-gray-400">months covered</div>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <div>Current Savings: ₹{(currentSavings/100000).toFixed(1)}L</div>
          <div>Monthly Expenses: ₹{(monthlyExpenses/1000).toFixed(0)}K</div>
          <div className="pt-2 text-gray-400">
            <strong>What-if scenario:</strong> If income stops today, you can survive {monthsCovered.toFixed(1)} months.
          </div>
        </div>
      </div>
    </div>
  );
}

// 5️⃣ Score Boost Simulator
export function ScoreBoostSimulator({ data, userData }: OverlayProps) {
  const [simulation, setSimulation] = useState({
    healthCover: userData.existingHealthCover || 0,
    termCover: userData.existingTermCover || 0,
    emergencyFund: userData.existingSavings || 0
  });

  const calculateScoreBoost = () => {
    // Simple scoring logic (you can enhance this)
    let currentScore = 65; // Base score
    let simulatedScore = 65;
    
    // Current score adjustments
    const currentHealthAdequacy = (userData.existingHealthCover || 0) / data.insuranceRecommendation.healthInsurance.recommendedCover;
    const currentTermAdequacy = (userData.existingTermCover || 0) / data.insuranceRecommendation.termLife.recommendedCover;
    
    currentScore += Math.min(currentHealthAdequacy * 15, 15);
    currentScore += Math.min(currentTermAdequacy * 20, 20);
    
    // Simulated score adjustments
    const simHealthAdequacy = simulation.healthCover / data.insuranceRecommendation.healthInsurance.recommendedCover;
    const simTermAdequacy = simulation.termCover / data.insuranceRecommendation.termLife.recommendedCover;
    
    simulatedScore += Math.min(simHealthAdequacy * 15, 15);
    simulatedScore += Math.min(simTermAdequacy * 20, 20);
    
    return { current: Math.round(currentScore), simulated: Math.round(simulatedScore) };
  };

  const scores = calculateScoreBoost();
  const boost = scores.simulated - scores.current;

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
      <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
        <TrendingUp size={16} className="text-green-400" />
        Score Boost Simulator
      </h4>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-300">{scores.current}</div>
            <div className="text-xs text-gray-400">Current Score</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">{scores.simulated}</div>
            <div className="text-xs text-gray-400">Simulated Score</div>
          </div>
        </div>
        
        {boost > 0 && (
          <div className="text-center p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="text-sm font-bold text-green-400">+{boost} points boost!</div>
          </div>
        )}
        
        <div className="space-y-2 text-xs">
          <div>
            <label className="text-gray-400 block mb-1">Health Cover (₹L)</label>
            <input
              type="number"
              value={simulation.healthCover / 100000}
              onChange={(e) => setSimulation({...simulation, healthCover: Number(e.target.value) * 100000})}
              className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white"
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">Term Cover (₹L)</label>
            <input
              type="number"
              value={simulation.termCover / 100000}
              onChange={(e) => setSimulation({...simulation, termCover: Number(e.target.value) * 100000})}
              className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 6️⃣ Priority Tagging Engine
export function PriorityTagging({ data, userData }: OverlayProps) {
  const priorities = [];
  
  // Insurance gap check
  const termAdequacy = ((userData.existingTermCover || 0) / data.insuranceRecommendation.termLife.recommendedCover) * 100;
  const healthAdequacy = ((userData.existingHealthCover || 0) / data.insuranceRecommendation.healthInsurance.recommendedCover) * 100;
  
  if (termAdequacy < 50) {
    priorities.push({ task: 'Fix Term Insurance Gap', priority: 'HIGH', color: 'bg-red-500/20 text-red-400' });
  }
  
  if (healthAdequacy < 50) {
    priorities.push({ task: 'Increase Health Coverage', priority: 'HIGH', color: 'bg-red-500/20 text-red-400' });
  }
  
  // Emergency fund check
  const monthlyExpenses = userData.expenses || (userData.salary * 0.8);
  const monthsCovered = (userData.existingSavings || 0) / monthlyExpenses;
  
  if (monthsCovered < 3) {
    priorities.push({ task: 'Build Emergency Fund', priority: 'HIGH', color: 'bg-red-500/20 text-red-400' });
  }
  
  // SIP regularity (mock check)
  if (!userData.existingSIP) {
    priorities.push({ task: 'Start Regular SIP', priority: 'MEDIUM', color: 'bg-yellow-500/20 text-yellow-400' });
  }

  if (priorities.length === 0) {
    priorities.push({ task: 'Optimize Portfolio Mix', priority: 'LOW', color: 'bg-green-500/20 text-green-400' });
  }

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
      <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
        <Target size={16} className="text-red-400" />
        Priority Actions
      </h4>
      
      <div className="space-y-2">
        {priorities.slice(0, 3).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-xs text-gray-300">{item.task}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${item.color}`}>
              {item.priority}
            </span>
          </div>
        ))}
      </div>
      
      {priorities.length > 0 && (
        <div className="mt-3 p-2 rounded-lg bg-primary/10 border border-primary/20">
          <div className="text-xs font-medium text-primary">
            Top Priority: {priorities[0].task}
          </div>
        </div>
      )}
    </div>
  );
}

// 7️⃣ Time-Based Recommendations
export function TimeBasedRecommendations({ data, userData }: OverlayProps) {
  const recommendations: {
    next30Days: string[];
    next6Months: string[];
    next1Year: string[];
  } = {
    next30Days: [],
    next6Months: [],
    next1Year: []
  };

  // Logic to populate recommendations based on user data
  const termAdequacy = ((userData.existingTermCover || 0) / data.insuranceRecommendation.termLife.recommendedCover) * 100;
  const monthsCovered = (userData.existingSavings || 0) / (userData.expenses || userData.salary * 0.8);

  if (termAdequacy < 50) {
    recommendations.next30Days.push('Increase term insurance coverage');
  }
  
  if (monthsCovered < 3) {
    recommendations.next6Months.push('Build emergency fund to 6 months');
  }
  
  recommendations.next1Year.push(`Increase SIP by ₹${Math.round(data.investmentPortfolio.totalMonthlyInvestment * 0.2)}`);

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
      <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
        <Clock size={16} className="text-blue-400" />
        Timeline Roadmap
      </h4>
      
      <div className="space-y-3 text-xs">
        <div>
          <div className="text-gray-400 font-medium mb-1">Next 30 days:</div>
          {recommendations.next30Days.map((item, idx) => (
            <div key={idx} className="text-gray-300 ml-2">• {item}</div>
          ))}
          {recommendations.next30Days.length === 0 && (
            <div className="text-gray-500 ml-2">• Continue current plan</div>
          )}
        </div>
        
        <div>
          <div className="text-gray-400 font-medium mb-1">Next 6 months:</div>
          {recommendations.next6Months.map((item, idx) => (
            <div key={idx} className="text-gray-300 ml-2">• {item}</div>
          ))}
          {recommendations.next6Months.length === 0 && (
            <div className="text-gray-500 ml-2">• Review and optimize portfolio</div>
          )}
        </div>
        
        <div>
          <div className="text-gray-400 font-medium mb-1">Next 1 year:</div>
          {recommendations.next1Year.map((item, idx) => (
            <div key={idx} className="text-gray-300 ml-2">• {item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 8️⃣ Financial Health Badge
export function FinancialHealthBadge({ data, userData }: OverlayProps) {
  // Calculate overall score (simplified)
  let score = 65; // Base score
  
  const termAdequacy = ((userData.existingTermCover || 0) / data.insuranceRecommendation.termLife.recommendedCover);
  const healthAdequacy = ((userData.existingHealthCover || 0) / data.insuranceRecommendation.healthInsurance.recommendedCover);
  const monthsCovered = (userData.existingSavings || 0) / (userData.expenses || userData.salary * 0.8);
  
  score += Math.min(termAdequacy * 20, 20);
  score += Math.min(healthAdequacy * 15, 15);
  score += Math.min(monthsCovered * 3, 15); // 3 points per month up to 5 months
  
  const finalScore = Math.round(score);
  
  const getBadge = (score: number) => {
    if (score >= 80) return { badge: 'Financially Fit 🟢', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score >= 60) return { badge: 'Improving 🟡', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { badge: 'At Risk 🔴', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const badge = getBadge(finalScore);

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
      <h4 className="text-sm font-semibold text-gray-300 flex items-center justify-center gap-2 mb-3">
        <Award size={16} className="text-yellow-400" />
        Financial Health Badge
      </h4>
      
      <div className="space-y-3">
        <div className="text-3xl font-bold text-primary">{finalScore}</div>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.color}`}>
          {badge.badge}
        </div>
        
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(finalScore, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// 9️⃣ Insight Confidence Meter
export function InsightConfidenceMeter({ data, userData }: OverlayProps) {
  // Calculate confidence based on data completeness
  let confidence = 0;
  let factors = [];
  
  if (userData.salary) { confidence += 20; factors.push('Income data'); }
  if (userData.expenses) { confidence += 15; factors.push('Expense tracking'); }
  if (userData.existingInvestments) { confidence += 15; factors.push('Investment history'); }
  if (userData.existingTermCover) { confidence += 10; factors.push('Insurance details'); }
  if (userData.goals && userData.goals.length > 0) { confidence += 10; factors.push('Clear goals'); }
  if (userData.age && userData.age > 0) { confidence += 10; factors.push('Age profile'); }
  
  // Stability factors
  if (userData.salary > 50000) { confidence += 10; factors.push('Stable income'); }
  if (userData.city) { confidence += 10; factors.push('Location context'); }
  
  const getConfidenceLevel = (conf: number) => {
    if (conf >= 80) return { level: 'High', color: 'text-green-400', desc: 'Comprehensive data available' };
    if (conf >= 60) return { level: 'Medium', color: 'text-yellow-400', desc: 'Some data gaps exist' };
    return { level: 'Low', color: 'text-red-400', desc: 'Limited data for analysis' };
  };

  const confidenceLevel = getConfidenceLevel(confidence);

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
      <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
        <CheckCircle size={16} className="text-purple-400" />
        Analysis Confidence
      </h4>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Confidence Level</span>
          <span className={`text-xs font-medium ${confidenceLevel.color}`}>
            {confidenceLevel.level}
          </span>
        </div>
        
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(confidence, 100)}%` }}
          />
        </div>
        
        <div className="text-xs text-gray-400">{confidenceLevel.desc}</div>
        
        <div className="text-xs text-gray-500">
          <div className="font-medium text-gray-400 mb-1">Data Sources:</div>
          {factors.slice(0, 4).map((factor, idx) => (
            <div key={idx} className="ml-2">• {factor}</div>
          ))}
          {factors.length > 4 && (
            <div className="ml-2 text-gray-600">+{factors.length - 4} more...</div>
          )}
        </div>
      </div>
    </div>
  );
}