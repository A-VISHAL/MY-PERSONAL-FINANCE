"use client";

import { useState } from 'react';
import { ChevronRight, Loader2, Target, Wallet, Shield, TrendingUp } from 'lucide-react';

interface FinancialFormProps {
    onSubmit: (data: any) => void;
    isLoading: boolean;
}

export default function FinancialForm({ onSubmit, isLoading }: FinancialFormProps) {
    const [formData, setFormData] = useState({
        salary: '',
        age: '',
        city: 'metro',
        risk: 'moderate',
        goals: [] as string[],
        fixedExpenses: '',
        variableExpenses: '',
        hasEmergencyFund: 'no',
        emergencyFundAmount: '',
        dependents: '0',
        monthlyEMI: '',
        currentDebts: '',
        existingLifeCover: '',
        existingHealthCover: '',
        currentMonthlyInvestment: ''
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
            fixedExpenses: Number(formData.fixedExpenses),
            variableExpenses: Number(formData.variableExpenses),
            emergencyFundAmount: Number(formData.emergencyFundAmount) || 0,
            dependents: Number(formData.dependents),
            monthlyEMI: Number(formData.monthlyEMI) || 0,
            currentDebts: Number(formData.currentDebts) || 0,
            existingLifeCover: Number(formData.existingLifeCover) || 0,
            existingHealthCover: Number(formData.existingHealthCover) || 0,
            currentMonthlyInvestment: Number(formData.currentMonthlyInvestment) || 0
        });
    };

    return (
        <div className="w-full p-8 md:p-16 lg:p-20 rounded-[40px] border border-white/10 bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
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
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                    placeholder="80000"
                                    value={formData.salary}
                                    onChange={e => setFormData({ ...formData, salary: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Monthly Fixed Expenses (Rent, EMI, School)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                    placeholder="30000"
                                    value={formData.fixedExpenses}
                                    onChange={e => setFormData({ ...formData, fixedExpenses: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Monthly Variable Expenses (Food, Medical)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                    placeholder="15000"
                                    value={formData.variableExpenses}
                                    onChange={e => setFormData({ ...formData, variableExpenses: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Age</label>
                                <input
                                    type="number"
                                    required
                                    min="18"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                    placeholder="25"
                                    value={formData.age}
                                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Dependents</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                    placeholder="2"
                                    value={formData.dependents}
                                    onChange={e => setFormData({ ...formData, dependents: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Emergency Fund Saved?</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, hasEmergencyFund: 'yes' })}
                                    className={`py-3 rounded-xl border transition-all text-sm font-bold ${formData.hasEmergencyFund === 'yes' ? 'bg-primary/20 border-primary text-white' : 'bg-secondary/50 border-white/10 text-gray-400'}`}
                                >
                                    YES
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, hasEmergencyFund: 'no' })}
                                    className={`py-3 rounded-xl border transition-all text-sm font-bold ${formData.hasEmergencyFund === 'no' ? 'bg-primary/20 border-primary text-white' : 'bg-secondary/50 border-white/10 text-gray-400'}`}
                                >
                                    NO
                                </button>
                            </div>
                        </div>

                        {formData.hasEmergencyFund === 'yes' && (
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Emergency Fund Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                        placeholder="200000"
                                        value={formData.emergencyFundAmount}
                                        onChange={e => setFormData({ ...formData, emergencyFundAmount: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Risk Appetite</label>
                            <select
                                className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all appearance-none"
                                value={formData.risk}
                                onChange={e => setFormData({ ...formData, risk: e.target.value as any })}
                            >
                                <option value="conservative">Conservative (Safe)</option>
                                <option value="moderate">Moderate (Balanced)</option>
                                <option value="aggressive">Aggressive (Growth)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 2: Debt & Protection (New) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-4">
                        <Shield size={20} />
                        <h3>Debt & Protection</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Monthly EMI Payments</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                    placeholder="15000"
                                    value={formData.monthlyEMI}
                                    onChange={e => setFormData({ ...formData, monthlyEMI: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Total Outstanding Debt (Home, Car, Personal)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                    placeholder="2000000"
                                    value={formData.currentDebts}
                                    onChange={e => setFormData({ ...formData, currentDebts: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Existing Life Insurance (Sum Assured)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                    placeholder="5000000"
                                    value={formData.existingLifeCover}
                                    onChange={e => setFormData({ ...formData, existingLifeCover: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Existing Health Insurance Cover</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                    placeholder="500000"
                                    value={formData.existingHealthCover}
                                    onChange={e => setFormData({ ...formData, existingHealthCover: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 lg:col-span-2">
                            <label className="text-sm text-gray-400">Total Current Monthly Investments (SIPs, RD, etc.)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                    placeholder="10000"
                                    value={formData.currentMonthlyInvestment}
                                    onChange={e => setFormData({ ...formData, currentMonthlyInvestment: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Goals */}
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
