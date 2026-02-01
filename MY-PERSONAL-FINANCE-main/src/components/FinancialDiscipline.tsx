import { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, Shield } from 'lucide-react';

interface FinancialDisciplineProps {
  userData: any;
  data: any;
}

// 🧮 Financial Discipline Score Calculator
export function calculateFinancialDiscipline(userData: any) {
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
    components.incomeStability = 20; // Assume stable high income
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
  // Assume good debt behavior if no excessive expenses
  if (expenseRatio < 0.7) {
    components.debtBehaviour = 15;
  } else if (expenseRatio < 0.85) {
    components.debtBehaviour = 10;
  } else {
    components.debtBehaviour = 5;
  }

  // 5️⃣ Investment Behaviour (20 points)
  if (userData.existingSIP > 0) {
    components.investmentBehaviour = 20;
  } else if (userData.existingInvestments > 0) {
    components.investmentBehaviour = 15;
  } else {
    components.investmentBehaviour = 8;
  }

  disciplineScore = Object.values(components).reduce((sum, score) => sum + score, 0);

  return { disciplineScore, components };
}

// 🎖️ Get Discipline Level
export function getDisciplineLevel(score: number) {
  if (score >= 80) return { level: 'Highly Disciplined', color: 'text-green-400', bg: 'bg-green-500/20', emoji: '🟢' };
  if (score >= 60) return { level: 'Moderately Disciplined', color: 'text-yellow-400', bg: 'bg-yellow-500/20', emoji: '🟡' };
  if (score >= 40) return { level: 'Weak Discipline', color: 'text-orange-400', bg: 'bg-orange-500/20', emoji: '🟠' };
  return { level: 'Undisciplined', color: 'text-red-400', bg: 'bg-red-500/20', emoji: '🔴' };
}

// 1️⃣ Financial Discipline Gauge (Primary)
export function DisciplineScoreGauge({ userData }: { userData: any }) {
  const { disciplineScore } = calculateFinancialDiscipline(userData);
  const disciplineLevel = getDisciplineLevel(disciplineScore);
  
  // Create gauge data
  const gaugeData = [
    { name: 'Score', value: disciplineScore, fill: disciplineScore >= 80 ? '#10b981' : disciplineScore >= 60 ? '#f59e0b' : disciplineScore >= 40 ? '#f97316' : '#ef4444' },
    { name: 'Remaining', value: 100 - disciplineScore, fill: '#1f2937' }
  ];

  return (
    <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Target className="text-primary" size={20} />
        Financial Discipline Score
      </h3>
      
      <div className="flex items-center justify-between">
        <div className="h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {gaugeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center -mt-16">
            <div className="text-3xl font-bold text-primary">{disciplineScore}%</div>
            <div className="text-sm text-gray-400">Discipline Score</div>
          </div>
        </div>
        
        <div className="flex-1 ml-6">
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${disciplineLevel.bg} ${disciplineLevel.color} mb-4`}>
            {disciplineLevel.emoji} {disciplineLevel.level}
          </div>
          
          <p className="text-sm text-gray-400 leading-relaxed">
            {disciplineScore >= 80 ? "Excellent financial habits! You consistently save and control expenses." :
             disciplineScore >= 60 ? "Good discipline with room for improvement in consistency." :
             disciplineScore >= 40 ? "Moderate discipline. Focus on regular savings and expense control." :
             "Needs significant improvement in financial habits and consistency."}
          </p>
          
          <div className="mt-3 text-xs text-gray-500">
            <div>Financial Discipline: <span className="text-primary font-medium">{disciplineScore}%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2️⃣ Discipline Trend (Career Progression) - BASED ON LIFETIME DATA
export function DisciplineTrendChart({ userData }: { userData: any }) {
  const trendData = userData.lifetimeData?.disciplineScores || [];
  
  if (trendData.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <AlertTriangle className="text-red-400" size={20} />
          Career Discipline Progression
        </h3>
        
        <div className="h-[250px] w-full flex items-center justify-center">
          <div className="text-center text-red-400">
            <div className="text-sm mb-2">Invalid lifetime data</div>
            <div className="text-xs">Please check your career and financial information</div>
          </div>
        </div>
      </div>
    );
  }

  const trend = trendData[trendData.length - 1].score > trendData[0].score ? 'improving' : 'declining';

  return (
    <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        {trend === 'improving' ? 
          <TrendingUp className="text-green-400" size={20} /> : 
          <TrendingDown className="text-red-400" size={20} />
        }
        Career Discipline Progression ({trendData.length} Years)
      </h3>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="year" stroke="#666" tick={{ fill: '#888' }} />
            <YAxis stroke="#666" tick={{ fill: '#888' }} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a25', borderRadius: '8px', border: '1px solid #333' }}
              labelStyle={{ color: '#888' }}
              formatter={(value: any) => [`${value}%`, 'Discipline Score']}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, fill: '#6366f1' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${trend === 'improving' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
        {trend === 'improving' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span className="text-sm">
          Your financial discipline has been {trend} over your {trendData.length}-year career ({trendData[trendData.length - 1].score}% current).
        </span>
      </div>
    </div>
  );
}

// 3️⃣ Lifetime Savings vs Earnings Analysis
export function ExpenseIncomeTrendChart({ userData }: { userData: any }) {
  const lifetimeData = userData.lifetimeData;
  
  if (!lifetimeData) {
    return (
      <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <AlertTriangle className="text-red-400" size={20} />
          Lifetime Financial Analysis
        </h3>
        
        <div className="h-[250px] w-full flex items-center justify-center">
          <div className="text-center text-red-400">
            <div className="text-sm mb-2">Invalid lifetime data</div>
            <div className="text-xs">Please check your lifetime financial information</div>
          </div>
        </div>
      </div>
    );
  }

  const { lifetimeSavingsRate, avgJobTenure, careerStability, savingsHabit } = lifetimeData;

  // Create visualization data
  const analysisData = [
    { metric: 'Savings Rate', value: lifetimeSavingsRate, benchmark: 20 },
    { metric: 'Job Stability', value: Math.min(avgJobTenure * 20, 100), benchmark: 60 },
    { metric: 'Investment Consistency', value: lifetimeData.investmentConsistency, benchmark: 70 },
    { metric: 'Setback Resilience', value: lifetimeData.setbackResilience, benchmark: 80 }
  ];

  return (
    <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <TrendingUp className="text-blue-400" size={20} />
        Lifetime Financial Metrics
      </h3>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analysisData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} stroke="#666" tick={{ fill: '#888' }} tickFormatter={(value) => `${value}%`} />
            <YAxis type="category" dataKey="metric" stroke="#666" tick={{ fill: '#888' }} width={120} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a25', borderRadius: '8px', border: '1px solid #333' }}
              formatter={(value: any) => [`${value.toFixed(1)}%`, '']}
            />
            <Bar dataKey="benchmark" fill="#374151" name="Benchmark" />
            <Bar dataKey="value" fill="#6366f1" name="Your Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 rounded-lg bg-white/5">
          <div className="text-gray-400">Career Stability</div>
          <div className={`font-medium ${careerStability === 'Stable' ? 'text-green-400' : careerStability === 'Moderate' ? 'text-yellow-400' : 'text-red-400'}`}>
            {careerStability}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-white/5">
          <div className="text-gray-400">Savings Habit</div>
          <div className={`font-medium ${savingsHabit === 'Excellent' ? 'text-green-400' : savingsHabit === 'Good' ? 'text-blue-400' : savingsHabit === 'Average' ? 'text-yellow-400' : 'text-red-400'}`}>
            {savingsHabit}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 rounded-lg bg-blue-500/10 text-blue-400 flex items-center gap-2">
        <CheckCircle size={16} />
        <span className="text-sm">
          Analysis based on your {userData.yearsOfEmployment}-year career history
        </span>
      </div>
    </div>
  );
}

// 4️⃣ Career & Investment Consistency Analysis
export function SavingsConsistencyChart({ userData }: { userData: any }) {
  const lifetimeData = userData.lifetimeData;
  
  if (!lifetimeData) {
    return (
      <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <AlertTriangle className="text-red-400" size={20} />
          Career Consistency Analysis
        </h3>
        
        <div className="h-[250px] w-full flex items-center justify-center">
          <div className="text-center text-red-400">
            <div className="text-sm mb-2">Invalid career data</div>
            <div className="text-xs">Please check your employment and investment history</div>
          </div>
        </div>
      </div>
    );
  }

  // Create career milestone data
  const milestoneData = [
    { 
      milestone: 'Career Start', 
      year: new Date().getFullYear() - userData.yearsOfEmployment,
      achievement: 'Started earning',
      score: 30
    },
    { 
      milestone: 'Investment Start', 
      year: new Date().getFullYear() - userData.yearsOfInvestment,
      achievement: 'Started investing',
      score: 50
    },
    { 
      milestone: 'Current Status', 
      year: new Date().getFullYear(),
      achievement: `${lifetimeData.lifetimeSavingsRate.toFixed(1)}% lifetime savings rate`,
      score: Math.min(100, lifetimeData.lifetimeSavingsRate * 4)
    }
  ];

  return (
    <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <CheckCircle className="text-green-400" size={20} />
        Career & Investment Journey
      </h3>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={milestoneData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="year" stroke="#666" tick={{ fill: '#888' }} />
            <YAxis stroke="#666" tick={{ fill: '#888' }} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a25', borderRadius: '8px', border: '1px solid #333' }}
              formatter={(value: any, name: any) => [
                name === 'score' ? `${value}%` : value,
                name === 'score' ? 'Progress Score' : 'Achievement'
              ]}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 6, fill: '#6366f1' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 space-y-2">
        {milestoneData.map((milestone, idx) => (
          <div key={idx} className="flex justify-between items-center p-2 rounded bg-white/5">
            <div>
              <div className="text-sm font-medium text-gray-300">{milestone.milestone}</div>
              <div className="text-xs text-gray-500">{milestone.achievement}</div>
            </div>
            <div className="text-sm font-bold text-primary">{milestone.year}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 rounded-lg bg-blue-500/10 text-blue-400 flex items-center gap-2">
        <CheckCircle size={16} />
        <span className="text-sm">
          {userData.yearsOfInvestment} years of investment experience out of {userData.yearsOfEmployment} working years
        </span>
      </div>
    </div>
  );
}

// 6️⃣ Insurance Adequacy Chart (Dual Progress Bars)
export function InsuranceAdequacyChart({ data, userData }: FinancialDisciplineProps) {
  const termAdequacy = Math.min(((userData.existingTermCover || 0) / data.insuranceRecommendation.termLife.recommendedCover) * 100, 100);
  const healthAdequacy = Math.min(((userData.existingHealthCover || 0) / data.insuranceRecommendation.healthInsurance.recommendedCover) * 100, 100);

  return (
    <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Shield className="text-blue-400" size={20} />
        Insurance Adequacy
      </h3>
      
      <div className="space-y-6">
        {/* Term Life Adequacy */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Term Life Coverage</span>
            <span className="text-sm font-bold text-primary">{termAdequacy.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${termAdequacy}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ₹{(userData.existingTermCover || 0)/100000}L / ₹{data.insuranceRecommendation.termLife.recommendedCover/100000}L
          </div>
        </div>

        {/* Health Insurance Adequacy */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Health Insurance Coverage</span>
            <span className="text-sm font-bold text-primary">{healthAdequacy.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${healthAdequacy}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ₹{(userData.existingHealthCover || 0)/100000}L / ₹{data.insuranceRecommendation.healthInsurance.recommendedCover/100000}L
          </div>
        </div>

        {/* Overall Status */}
        <div className={`p-3 rounded-lg ${(termAdequacy + healthAdequacy) / 2 >= 70 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          <div className="text-sm font-medium">
            {(termAdequacy + healthAdequacy) / 2 >= 70 ? 'Well Protected' : 'Needs Attention'}
          </div>
          <div className="text-xs opacity-80">
            Overall coverage: {((termAdequacy + healthAdequacy) / 2).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}

// 7️⃣ Overall Financial Scorecard (Radar Chart)
export function FinancialScorecardRadar({ data, userData }: FinancialDisciplineProps) {
  const { disciplineScore, components } = calculateFinancialDiscipline(userData);
  
  // Calculate component scores (0-100 scale)
  const radarData = [
    { subject: 'Budget', score: Math.min((userData.salary - (userData.expenses || userData.salary * 0.8)) / userData.salary * 100 * 1.5, 100) },
    { subject: 'Savings', score: components.savingsConsistency * 4 }, // Convert to 100 scale
    { subject: 'Debt', score: components.debtBehaviour * 6.67 }, // Convert to 100 scale
    { subject: 'Investments', score: components.investmentBehaviour * 5 }, // Convert to 100 scale
    { subject: 'Insurance', score: Math.min(((userData.existingTermCover || 0) / data.insuranceRecommendation.termLife.recommendedCover) * 100, 100) },
    { subject: 'Discipline', score: disciplineScore },
    { subject: 'Planning', score: userData.goals?.length ? Math.min(userData.goals.length * 20, 100) : 40 }
  ];

  return (
    <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Target className="text-purple-400" size={20} />
        Financial Health Radar
      </h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#666', fontSize: 10 }} 
              tickCount={5}
              tickFormatter={(value) => `${value}%`}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {radarData.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span className="text-gray-400">{item.subject}:</span>
            <span className={`font-medium ${item.score >= 70 ? 'text-green-400' : item.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {item.score.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}