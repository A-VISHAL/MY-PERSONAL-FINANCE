"use client";

import { useState, useMemo } from 'react';
import { Wallet, ArrowDownCircle, TrendingUp, Calendar } from 'lucide-react';

export default function SWPCalculator() {
    const [totalInvestment, setTotalInvestment] = useState<number>(4560000);
    const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(36500);
    const [interestRate, setInterestRate] = useState<number>(8);
    const [years, setYears] = useState<number>(1);

    const stats = useMemo(() => {
        const monthlyRate = interestRate / 100 / 12;
        const totalMonths = years * 12;

        let currentBalance = totalInvestment;
        let totalWithdrawn = 0;

        for (let i = 1; i <= totalMonths; i++) {
            if (currentBalance <= 0) break;

            const withdrawal = Math.min(currentBalance, monthlyWithdrawal);
            currentBalance -= withdrawal;
            totalWithdrawn += withdrawal;

            // Add interest on remaining balance
            currentBalance *= (1 + monthlyRate);
        }

        return {
            totalInvestment,
            totalWithdrawn,
            finalValue: Math.max(0, currentBalance)
        };
    }, [totalInvestment, monthlyWithdrawal, interestRate, years]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="bg-secondary/30 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            <div className="space-y-10">
                {/* Total Investment Slider */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-400 font-medium">Total investment</label>
                        <div className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-lg font-mono font-bold border border-emerald-500/20">
                            ₹{totalInvestment.toLocaleString()}
                        </div>
                    </div>
                    <input
                        type="range"
                        min="100000"
                        max="10000000"
                        step="50000"
                        value={totalInvestment}
                        onChange={(e) => setTotalInvestment(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>

                {/* Monthly Withdrawal Slider */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-400 font-medium">Withdrawal per month</label>
                        <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg font-mono font-bold border border-primary/20">
                            ₹{monthlyWithdrawal.toLocaleString()}
                        </div>
                    </div>
                    <input
                        type="range"
                        min="5000"
                        max="500000"
                        step="500"
                        value={monthlyWithdrawal}
                        onChange={(e) => setMonthlyWithdrawal(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>

                {/* Interest Rate Slider */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-400 font-medium">Expected return rate (p.a)</label>
                        <div className="bg-accent/10 text-accent px-4 py-1.5 rounded-lg font-mono font-bold border border-accent/20">
                            {interestRate}%
                        </div>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="30"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                        className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                </div>

                {/* Time Period Slider */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-400 font-medium">Time period</label>
                        <div className="bg-blue-500/10 text-blue-500 px-4 py-1.5 rounded-lg font-mono font-bold border border-blue-500/20">
                            {years} Yr{years > 1 ? 's' : ''}
                        </div>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="40"
                        value={years}
                        onChange={(e) => setYears(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Results Section */}
                <div className="pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-1">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
                            <Wallet size={14} className="text-emerald-500" />
                            Total Investment
                        </p>
                        <p className="text-xl font-bold text-white">{formatCurrency(stats.totalInvestment)}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
                            <ArrowDownCircle size={14} className="text-primary" />
                            Total Withdrawal
                        </p>
                        <p className="text-xl font-bold text-white">{formatCurrency(stats.totalWithdrawn)}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
                            <TrendingUp size={14} className="text-accent" />
                            Final Value
                        </p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(stats.finalValue)}</p>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4 items-start">
                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                        <Calendar size={20} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white">How SWP works?</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            A Systematic Withdrawal Plan allows you to withdraw a fixed amount from your investment at regular intervals while the remaining balance continues to earn returns.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
