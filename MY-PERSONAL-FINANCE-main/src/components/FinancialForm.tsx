"use client";

import { useState } from 'react';
import { ChevronRight, Loader2, Target, Wallet, Shield, TrendingUp } from 'lucide-react';

interface FinancialFormProps {
    onSubmit: (data: any) => void;
    isLoading: boolean;
}

// Helper functions to analyze lifetime financial data
function generateLifetimeAnalysis(formData: any) {
    const yearsOfEmployment = Number(formData.yearsOfEmployment);
    const lifetimeSavings = Number(formData.lifetimeSavings);
    const lifetimeEarnings = Number(formData.lifetimeEarnings);
    const jobChanges = Number(formData.jobChanges);
    const yearsOfInvestment = Number(formData.yearsOfInvestment);
    const majorSetbacks = Number(formData.majorSetbacks);

    // Calculate key lifetime metrics
    const lifetimeSavingsRate = lifetimeEarnings > 0 ? (lifetimeSavings / lifetimeEarnings) * 100 : 0;
    const avgJobTenure = yearsOfEmployment > 0 ? yearsOfEmployment / (jobChanges + 1) : 0;
    const investmentConsistency = yearsOfEmployment > 0 ? (yearsOfInvestment / yearsOfEmployment) * 100 : 0;
    const setbackResilience = yearsOfEmployment > 0 ? Math.max(0, 100 - (majorSetbacks * 20)) : 100;

    // Generate trend data based on lifetime patterns
    const trendData = [];
    const currentYear = new Date().getFullYear();
    
    for (let i = Math.min(yearsOfEmployment, 10); i >= 1; i--) {
        const year = currentYear - i + 1;
        
        // Simulate discipline score based on career progression
        let score = 50; // Base score
        
        // Career stability factor
        if (avgJobTenure > 3) score += 15;
        else if (avgJobTenure > 1.5) score += 10;
        else score += 5;
        
        // Savings discipline factor
        if (lifetimeSavingsRate > 25) score += 20;
        else if (lifetimeSavingsRate > 15) score += 15;
        else if (lifetimeSavingsRate > 10) score += 10;
        else score += 5;
        
        // Investment consistency factor
        if (investmentConsistency > 70) score += 15;
        else if (investmentConsistency > 40) score += 10;
        else score += 5;
        
        // Add some career progression (improving over time)
        const progressionBonus = Math.min(10, (yearsOfEmployment - i) * 2);
        score += progressionBonus;
        
        // Account for setbacks
        if (majorSetbacks > 0 && i <= majorSetbacks * 2) {
            score -= 10; // Reduce score during setback years
        }
        
        trendData.push({
            year: year.toString(),
            score: Math.min(100, Math.max(20, score))
        });
    }

    return {
        lifetimeSavingsRate,
        avgJobTenure,
        investmentConsistency,
        setbackResilience,
        disciplineScores: trendData,
        careerStability: avgJobTenure > 2 ? 'Stable' : avgJobTenure > 1 ? 'Moderate' : 'Unstable',
        savingsHabit: lifetimeSavingsRate > 20 ? 'Excellent' : lifetimeSavingsRate > 15 ? 'Good' : lifetimeSavingsRate > 10 ? 'Average' : 'Poor'
    };
}

export default function FinancialForm({ onSubmit, isLoading }: FinancialFormProps) {
    const [formData, setFormData] = useState({
        salary: '',
        age: '',
        city: 'metro',
        risk: 'moderate',
        goals: [] as string[],
        rent: '',
        expenses: '',
        existingInvestments: '',
        // New fields for overlay features
        existingTermCover: '',
        existingHealthCover: '',
        existingSavings: '',
        existingSIP: '',
        // Lifetime financial data fields (required)
        yearsOfEmployment: '',
        lifetimeSavings: '',
        lifetimeEarnings: '',
        jobChanges: '',
        yearsOfInvestment: '',
        majorSetbacks: ''
    });

    const goalsList = [
        { id: 'emergency', label: 'Emergency Fund', icon: '🆘' },
        { id: 'house', label: 'Buy House', icon: '🏠' },
        { id: 'car', label: 'Buy Car', icon: '🚗' },
        { id: 'retirement', label: 'Retirement', icon: '🏖️' },
        { id: 'education', label: 'Education', icon: '🎓' },
        { id: 'wealth', label: 'Wealth Creation', icon: '💎' }
    ];

    const handleGoalToggle = (id: string) => {
        setFormData(prev => ({
            ...prev,
            goals: prev.goals.includes(id)
                ? prev.goals.filter(g => g !== id)
                : [...prev.goals, id]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            salary: Number(formData.salary),
            age: Number(formData.age),
            rent: Number(formData.rent) || 0,
            expenses: Number(formData.expenses) || 0,
            existingInvestments: Number(formData.existingInvestments) || 0,
            existingTermCover: Number(formData.existingTermCover) || 0,
            existingHealthCover: Number(formData.existingHealthCover) || 0,
            existingSavings: Number(formData.existingSavings) || 0,
            existingSIP: Number(formData.existingSIP) || 0,
            // Process lifetime data
            yearsOfEmployment: Number(formData.yearsOfEmployment),
            lifetimeSavings: Number(formData.lifetimeSavings),
            lifetimeEarnings: Number(formData.lifetimeEarnings),
            jobChanges: Number(formData.jobChanges),
            yearsOfInvestment: Number(formData.yearsOfInvestment),
            majorSetbacks: Number(formData.majorSetbacks),
            // Generate analysis based on lifetime data
            lifetimeData: generateLifetimeAnalysis(formData)
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-8 rounded-3xl border border-white/10 bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Financial Profile</h2>
                <p className="text-gray-400">Let's analyze your finances to build a perfect roadmap.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Income & Basic Details */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-semibold mb-4">
                        <Wallet size={20} />
                        <h3>Basic Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Monthly Salary (In-Hand)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    required
                                    min="5000"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="80000"
                                    value={formData.salary}
                                    onChange={e => setFormData({ ...formData, salary: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Age</label>
                            <input
                                type="number"
                                required
                                min="18"
                                max="80"
                                className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                placeholder="25"
                                value={formData.age}
                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">City Tier</label>
                            <select
                                className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                            >
                                <option value="metro">Metro (Tier 1)</option>
                                <option value="tier2">Tier 2 City</option>
                                <option value="tier3">Tier 3 / Rural</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Risk Appetite</label>
                            <select
                                className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                                value={formData.risk}
                                onChange={e => setFormData({ ...formData, risk: e.target.value as any })}
                            >
                                <option value="conservative">Conservative (Safe Plays)</option>
                                <option value="moderate">Moderate (Balanced)</option>
                                <option value="aggressive">Aggressive (High Growth)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 2: Current Financial Status */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-400 font-semibold mb-4">
                        <Shield size={20} />
                        <h3>Current Financial Status (Optional)</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Existing Term Life Cover</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="1000000 (10L)"
                                    value={formData.existingTermCover}
                                    onChange={e => setFormData({ ...formData, existingTermCover: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Existing Health Insurance</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="500000 (5L)"
                                    value={formData.existingHealthCover}
                                    onChange={e => setFormData({ ...formData, existingHealthCover: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Current Savings/Emergency Fund</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="200000 (2L)"
                                    value={formData.existingSavings}
                                    onChange={e => setFormData({ ...formData, existingSavings: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Monthly SIP Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="10000"
                                    value={formData.existingSIP}
                                    onChange={e => setFormData({ ...formData, existingSIP: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Historical Data (Required) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-purple-400 font-semibold mb-4">
                        <TrendingUp size={20} />
                        <h3>Lifetime Financial Data (Required)</h3>
                    </div>

                    <div className="mb-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <p className="text-sm text-purple-300 mb-2">
                            📊 <strong>Required for Financial Discipline Analysis</strong>
                        </p>
                        <p className="text-xs text-purple-200/80">
                            Lifetime financial data is essential for accurate discipline scoring, comprehensive analysis, and behavior-aware recommendations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">
                                Total Years of Employment <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="50"
                                className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                placeholder="5"
                                value={formData.yearsOfEmployment}
                                onChange={e => setFormData({ ...formData, yearsOfEmployment: e.target.value })}
                            />
                            <p className="text-xs text-gray-500">Total years you have been earning</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">
                                Total Lifetime Savings <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="1500000"
                                    value={formData.lifetimeSavings}
                                    onChange={e => setFormData({ ...formData, lifetimeSavings: e.target.value })}
                                />
                            </div>
                            <p className="text-xs text-gray-500">Total amount saved throughout your career</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">
                                Total Lifetime Earnings <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="6000000"
                                    value={formData.lifetimeEarnings}
                                    onChange={e => setFormData({ ...formData, lifetimeEarnings: e.target.value })}
                                />
                            </div>
                            <p className="text-xs text-gray-500">Total income earned throughout your career</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">
                                Number of Job Changes <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="20"
                                className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                placeholder="3"
                                value={formData.jobChanges}
                                onChange={e => setFormData({ ...formData, jobChanges: e.target.value })}
                            />
                            <p className="text-xs text-gray-500">Total number of times you changed jobs</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">
                                Years of Consistent SIP/Investment <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="30"
                                className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                placeholder="2"
                                value={formData.yearsOfInvestment}
                                onChange={e => setFormData({ ...formData, yearsOfInvestment: e.target.value })}
                            />
                            <p className="text-xs text-gray-500">Years you have been consistently investing</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">
                                Major Financial Setbacks <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="10"
                                className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                placeholder="1"
                                value={formData.majorSetbacks}
                                onChange={e => setFormData({ ...formData, majorSetbacks: e.target.value })}
                            />
                            <p className="text-xs text-gray-500">Number of major financial crises you faced (job loss, medical emergency, etc.)</p>
                        </div>
                    </div>
                </div>

                {/* Section 4: Goals */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-accent font-semibold mb-4">
                        <Target size={20} />
                        <h3>Financial Goals</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {goalsList.map(goal => (
                            <button
                                key={goal.id}
                                type="button"
                                onClick={() => handleGoalToggle(goal.id)}
                                className={`flex flex-col items-center p-4 rounded-xl border transition-all ${formData.goals.includes(goal.id)
                                        ? 'bg-primary/20 border-primary text-white'
                                        : 'bg-secondary/30 border-white/5 text-gray-400 hover:bg-secondary/50'
                                    }`}
                            >
                                <span className="text-2xl mb-2">{goal.icon}</span>
                                <span className="text-sm font-medium">{goal.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Analyzing Finances...
                            </>
                        ) : (
                            <>
                                Generate Financial Plan
                                <ChevronRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
