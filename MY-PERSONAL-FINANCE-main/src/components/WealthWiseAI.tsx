import { useState } from 'react';
import { 
  Target, TrendingUp, AlertTriangle, CheckCircle, Award, 
  Calendar, Zap, DollarSign, Shield, Clock, Star, Flame
} from 'lucide-react';

interface WealthWiseAIProps {
  data: any;
  userData: any;
}

// 1️⃣ Dream-to-Discipline Mapping
export function DreamToDisciplineMapping({ data, userData }: WealthWiseAIProps) {
  // Identify primary financial dream based on goals
  const getPrimaryDream = () => {
    const goals = userData.goals || [];
    if (goals.includes('house')) return { dream: 'Buy House', target: 5000000, timeline: 10, priority: 'HIGH' };
    if (goals.includes('retirement')) return { dream: 'Retirement', target: userData.salary * 12 * 25, timeline: 30, priority: 'HIGH' };
    if (goals.includes('car')) return { dream: 'Buy Car', target: 1500000, timeline: 5, priority: 'MEDIUM' };
    if (goals.includes('education')) return { dream: 'Education', target: 2000000, timeline: 8, priority: 'MEDIUM' };
    if (goals.includes('wealth')) return { dream: 'Wealth Creation', target: 10000000, timeline: 15, priority: 'HIGH' };
    return { dream: 'Emergency Fund', target: userData.salary * 6, timeline: 1, priority: 'HIGH' };
  };

  const primaryDream = getPrimaryDream();
  
  // Calculate dream requirements
  const monthlyTarget = primaryDream.target / (primaryDream.timeline * 12);
  const recommendedExpenseLimit = userData.salary * 0.7; // 70% of income
  const requiredInsurance = primaryDream.target * 0.1; // 10% of dream value
  
  // Check if user is on track
  const currentSavings = userData.existingSIP || 0;
  const currentExpenses = userData.expenses || userData.salary * 0.8;
  const currentInsurance = (userData.existingTermCover || 0) + (userData.existingHealthCover || 0);
  
  const savingsOnTrack = currentSavings >= monthlyTarget * 0.8; // 80% tolerance
  const expensesOnTrack = currentExpenses <= recommendedExpenseLimit;
  const insuranceOnTrack = currentInsurance >= requiredInsurance;
  
  const overallOnTrack = savingsOnTrack && expensesOnTrack && insuranceOnTrack;

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Target className="text-purple-400" size={20} />
        Dream-to-Discipline Mapping
      </h3>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-bold text-purple-300">🎯 {primaryDream.dream}</h4>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${overallOnTrack ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {overallOnTrack ? 'ON TRACK' : 'OFF TRACK'}
          </span>
        </div>
        <div className="text-sm text-gray-400">
          Target: ₹{(primaryDream.target/100000).toFixed(1)}L in {primaryDream.timeline} years
        </div>
      </div>

      <div className="space-y-4">
        {/* Monthly Savings Requirement */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
          <div>
            <div className="text-sm text-gray-400">Required Monthly SIP</div>
            <div className="text-lg font-bold text-primary">₹{Math.round(monthlyTarget).toLocaleString()}</div>
          </div>
          <div className={`flex items-center gap-2 ${savingsOnTrack ? 'text-green-400' : 'text-red-400'}`}>
            {savingsOnTrack ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <span className="text-sm">
              Current: ₹{currentSavings.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Expense Limit */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
          <div>
            <div className="text-sm text-gray-400">Recommended Expense Limit</div>
            <div className="text-lg font-bold text-yellow-400">₹{Math.round(recommendedExpenseLimit).toLocaleString()}</div>
          </div>
          <div className={`flex items-center gap-2 ${expensesOnTrack ? 'text-green-400' : 'text-red-400'}`}>
            {expensesOnTrack ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <span className="text-sm">
              Current: ₹{currentExpenses.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Insurance Requirement */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
          <div>
            <div className="text-sm text-gray-400">Mandatory Insurance</div>
            <div className="text-lg font-bold text-blue-400">₹{(requiredInsurance/100000).toFixed(1)}L</div>
          </div>
          <div className={`flex items-center gap-2 ${insuranceOnTrack ? 'text-green-400' : 'text-red-400'}`}>
            {insuranceOnTrack ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <span className="text-sm">
              Current: ₹{(currentInsurance/100000).toFixed(1)}L
            </span>
          </div>
        </div>
      </div>

      {!overallOnTrack && (
        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="text-sm font-medium text-red-400 mb-2">Action Required</div>
          <div className="text-xs text-red-300 space-y-1">
            {!savingsOnTrack && <div>• Increase SIP by ₹{Math.round(monthlyTarget - currentSavings).toLocaleString()}</div>}
            {!expensesOnTrack && <div>• Reduce expenses by ₹{Math.round(currentExpenses - recommendedExpenseLimit).toLocaleString()}</div>}
            {!insuranceOnTrack && <div>• Increase insurance by ₹{((requiredInsurance - currentInsurance)/100000).toFixed(1)}L</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// 2️⃣ Discipline Streaks & Habit Scoring
export function DisciplineStreaksHabits({ data, userData }: WealthWiseAIProps) {
  // Generate streak data based on user's lifetime data
  const generateStreakData = () => {
    const lifetimeData = userData.lifetimeData;
    if (!lifetimeData) return { currentStreak: 0, longestStreak: 0, habits: [] };

    const savingsRate = lifetimeData.lifetimeSavingsRate;
    const investmentConsistency = lifetimeData.investmentConsistency;
    const careerStability = lifetimeData.avgJobTenure;

    // Calculate current streak (months of good behavior)
    let currentStreak = 0;
    if (savingsRate > 15) currentStreak += 6;
    if (investmentConsistency > 50) currentStreak += 12;
    if (careerStability > 2) currentStreak += 18;

    const longestStreak = Math.max(currentStreak, userData.yearsOfInvestment * 12);

    const habits = [
      { 
        habit: 'Consistent Investing', 
        streak: userData.yearsOfInvestment * 12, 
        status: investmentConsistency > 70 ? 'strong' : 'moderate',
        icon: '📈'
      },
      { 
        habit: 'Expense Control', 
        streak: savingsRate > 20 ? 24 : savingsRate > 15 ? 12 : 6, 
        status: savingsRate > 20 ? 'strong' : 'moderate',
        icon: '💰'
      },
      { 
        habit: 'Career Stability', 
        streak: Math.round(careerStability * 12), 
        status: careerStability > 3 ? 'strong' : 'moderate',
        icon: '🏢'
      }
    ];

    return { currentStreak, longestStreak, habits };
  };

  const streakData = generateStreakData();

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Flame className="text-orange-400" size={20} />
        Discipline Streaks & Habits
      </h3>

      {/* Current Streak */}
      <div className="mb-6 text-center">
        <div className="text-3xl font-bold text-orange-400 mb-2">
          🔥 {streakData.currentStreak} months
        </div>
        <div className="text-sm text-gray-400">Current Discipline Streak</div>
        <div className="text-xs text-gray-500 mt-1">
          Longest streak: {streakData.longestStreak} months
        </div>
      </div>

      {/* Habit Breakdown */}
      <div className="space-y-4">
        {streakData.habits.map((habit, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{habit.icon}</span>
              <div>
                <div className="text-sm font-medium text-gray-300">{habit.habit}</div>
                <div className="text-xs text-gray-500">{habit.streak} months streak</div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              habit.status === 'strong' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {habit.status === 'strong' ? 'Strong' : 'Building'}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
        <div className="text-sm font-medium text-green-400 mb-2">🎉 Positive Highlights</div>
        <div className="text-xs text-green-300">
          You've maintained {userData.yearsOfInvestment} years of consistent investing - that's excellent financial discipline!
        </div>
      </div>
    </div>
  );
}

// 3️⃣ Lifestyle Inflation Detection
export function LifestyleInflationDetection({ data, userData }: WealthWiseAIProps) {
  // Calculate lifestyle inflation based on lifetime data
  const calculateInflation = () => {
    const currentSalary = userData.salary;
    const currentExpenses = userData.expenses || userData.salary * 0.8;
    const yearsOfEmployment = userData.yearsOfEmployment;
    const lifetimeEarnings = userData.lifetimeEarnings;
    
    // Estimate starting salary (assuming 8% annual growth)
    const estimatedStartingSalary = lifetimeEarnings / (yearsOfEmployment * 1.5); // Conservative estimate
    const salaryGrowthRate = yearsOfEmployment > 0 ? Math.pow(currentSalary / estimatedStartingSalary, 1/yearsOfEmployment) - 1 : 0;
    
    // Estimate expense growth (assuming it grew with lifestyle)
    const currentExpenseRatio = currentExpenses / currentSalary;
    const estimatedStartingExpenses = estimatedStartingSalary * 0.7; // Assume 70% initially
    const expenseGrowthRate = yearsOfEmployment > 0 ? Math.pow(currentExpenses / estimatedStartingExpenses, 1/yearsOfEmployment) - 1 : 0;
    
    const inflationDetected = expenseGrowthRate > salaryGrowthRate;
    const inflationSeverity = inflationDetected ? 
      (expenseGrowthRate - salaryGrowthRate > 0.05 ? 'High' : 
       expenseGrowthRate - salaryGrowthRate > 0.02 ? 'Moderate' : 'Low') : 'None';

    // Calculate dream delay
    const primaryDream = userData.goals?.includes('house') ? 'house purchase' : 
                        userData.goals?.includes('retirement') ? 'retirement' : 'financial goals';
    const delayMonths = inflationDetected ? Math.round((expenseGrowthRate - salaryGrowthRate) * 100 * 6) : 0;

    return {
      inflationDetected,
      inflationSeverity,
      salaryGrowthRate: salaryGrowthRate * 100,
      expenseGrowthRate: expenseGrowthRate * 100,
      primaryDream,
      delayMonths,
      currentExpenseRatio: currentExpenseRatio * 100
    };
  };

  const inflation = calculateInflation();

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-red-500/10 border border-yellow-500/20">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <TrendingUp className="text-yellow-400" size={20} />
        Lifestyle Inflation Analysis
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
          <div className="text-2xl font-bold text-green-400">{inflation.salaryGrowthRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-400">Annual Income Growth</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
          <div className="text-2xl font-bold text-red-400">{inflation.expenseGrowthRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-400">Annual Expense Growth</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Lifestyle Inflation Status</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            inflation.inflationSeverity === 'None' ? 'bg-green-500/20 text-green-400' :
            inflation.inflationSeverity === 'Low' ? 'bg-yellow-500/20 text-yellow-400' :
            inflation.inflationSeverity === 'Moderate' ? 'bg-orange-500/20 text-orange-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {inflation.inflationSeverity}
          </span>
        </div>
        
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              inflation.inflationSeverity === 'None' ? 'bg-green-500' :
              inflation.inflationSeverity === 'Low' ? 'bg-yellow-500' :
              inflation.inflationSeverity === 'Moderate' ? 'bg-orange-500' :
              'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, Math.abs(inflation.expenseGrowthRate - inflation.salaryGrowthRate) * 10)}%` }}
          />
        </div>
      </div>

      {inflation.inflationDetected && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="text-sm font-medium text-red-400 mb-2">⚠️ Lifestyle Inflation Alert</div>
          <div className="text-xs text-red-300 space-y-1">
            <div>Your expenses are growing faster than your income by {(inflation.expenseGrowthRate - inflation.salaryGrowthRate).toFixed(1)}% annually.</div>
            <div>This behavior may delay your {inflation.primaryDream} by approximately {inflation.delayMonths} months.</div>
            <div>Current expense ratio: {inflation.currentExpenseRatio.toFixed(1)}% of income</div>
          </div>
        </div>
      )}

      {!inflation.inflationDetected && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="text-sm font-medium text-green-400 mb-2">✅ Excellent Control</div>
          <div className="text-xs text-green-300">
            Your expenses are growing slower than your income - great financial discipline!
          </div>
        </div>
      )}
    </div>
  );
}

// 4️⃣ Monthly Financial Discipline Report
export function MonthlyDisciplineReport({ data, userData }: WealthWiseAIProps) {
  // Generate discipline grade and insights
  const generateReport = () => {
    const lifetimeData = userData.lifetimeData;
    const disciplineScore = data.financialDiscipline?.score || 70;
    
    // Calculate grade
    let grade = 'D';
    if (disciplineScore >= 90) grade = 'A';
    else if (disciplineScore >= 80) grade = 'B';
    else if (disciplineScore >= 70) grade = 'C';
    
    // Identify strong habit
    const strongHabits = [];
    if (lifetimeData?.lifetimeSavingsRate > 20) strongHabits.push('Excellent lifetime savings rate');
    if (lifetimeData?.investmentConsistency > 70) strongHabits.push('Consistent investment discipline');
    if (lifetimeData?.avgJobTenure > 3) strongHabits.push('Strong career stability');
    if (userData.existingSIP > userData.salary * 0.15) strongHabits.push('High monthly SIP commitment');
    
    const strongHabit = strongHabits[0] || 'Building financial awareness';
    
    // Identify weak area
    const weakAreas = [];
    if ((userData.existingTermCover || 0) < userData.salary * 10) weakAreas.push('Insufficient term insurance');
    if ((userData.existingHealthCover || 0) < 1000000) weakAreas.push('Low health insurance coverage');
    if (!userData.existingSIP || userData.existingSIP < userData.salary * 0.1) weakAreas.push('Low investment allocation');
    if (userData.expenses > userData.salary * 0.8) weakAreas.push('High expense ratio');
    
    const weakArea = weakAreas[0] || 'Minor optimization needed';
    
    // Generate focused action
    let focusedAction = 'Continue current financial habits';
    if (weakAreas.includes('Insufficient term insurance')) {
      focusedAction = 'Increase term insurance to ₹' + ((userData.salary * 15)/100000).toFixed(0) + 'L within 30 days';
    } else if (weakAreas.includes('Low health insurance coverage')) {
      focusedAction = 'Upgrade health insurance to ₹10L within 45 days';
    } else if (weakAreas.includes('Low investment allocation')) {
      focusedAction = 'Increase SIP by ₹' + Math.round(userData.salary * 0.05).toLocaleString() + ' next month';
    } else if (weakAreas.includes('High expense ratio')) {
      focusedAction = 'Reduce monthly expenses by ₹' + Math.round((userData.expenses - userData.salary * 0.75)).toLocaleString() + ' over 60 days';
    }

    return { grade, strongHabit, weakArea, focusedAction, disciplineScore };
  };

  const report = generateReport();
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Calendar className="text-blue-400" size={20} />
        Monthly Discipline Report - {currentMonth}
      </h3>

      {/* Grade Display */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-4xl font-bold ${
          report.grade === 'A' ? 'bg-green-500/20 text-green-400' :
          report.grade === 'B' ? 'bg-blue-500/20 text-blue-400' :
          report.grade === 'C' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {report.grade}
        </div>
        <div className="text-sm text-gray-400 mt-2">
          Discipline Grade ({report.disciplineScore}%)
        </div>
      </div>

      {/* Report Sections */}
      <div className="space-y-4">
        {/* Strong Habit */}
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Star className="text-green-400" size={16} />
            <span className="text-sm font-medium text-green-400">Strong Habit</span>
          </div>
          <div className="text-sm text-green-300">{report.strongHabit}</div>
        </div>

        {/* Weak Area */}
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-yellow-400" size={16} />
            <span className="text-sm font-medium text-yellow-400">Area for Improvement</span>
          </div>
          <div className="text-sm text-yellow-300">{report.weakArea}</div>
        </div>

        {/* Focused Action */}
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-blue-400" size={16} />
            <span className="text-sm font-medium text-blue-400">Next Month Focus</span>
          </div>
          <div className="text-sm text-blue-300">{report.focusedAction}</div>
        </div>
      </div>

      {/* Supportive Message */}
      <div className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
        <div className="text-sm text-purple-300">
          {report.grade === 'A' ? '🎉 Outstanding financial discipline! Keep up the excellent work.' :
           report.grade === 'B' ? '👏 Great progress! Small improvements will make a big difference.' :
           report.grade === 'C' ? '💪 You\'re on the right track. Focus on one area at a time.' :
           '🌱 Every financial journey starts with small steps. You\'ve got this!'}
        </div>
      </div>
    </div>
  );
}

// Main WealthWiseAI Dashboard Integration Component
export function WealthWiseAIDashboard({ data, userData }: WealthWiseAIProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Award className="text-yellow-400" size={24} />
          WealthWise AI - Dream-Driven Discipline
        </h2>
        <p className="text-gray-400">Intelligent financial co-pilot for your dreams</p>
      </div>

      {/* Dream Mapping */}
      <DreamToDisciplineMapping data={data} userData={userData} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DisciplineStreaksHabits data={data} userData={userData} />
        <LifestyleInflationDetection data={data} userData={userData} />
      </div>

      {/* Monthly Report */}
      <MonthlyDisciplineReport data={data} userData={userData} />
    </div>
  );
}