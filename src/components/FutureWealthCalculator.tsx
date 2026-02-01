"use client";

import { useState, useMemo } from 'react';
import { TrendingUp, Calendar, IndianRupee, ChevronDown } from 'lucide-react';

export default function FutureWealthCalculator() {
    const [principal, setPrincipal] = useState<string>('100000');
    const [interestRate, setInterestRate] = useState<number>(12);
    const [years, setYears] = useState<number>(10);

    const stats = useMemo(() => {
        const p = parseFloat(principal) || 0;
        const r = interestRate / 100;
        const n = years;

        const yearlyData = [];
        let currentBalance = p;

        for (let i = 1; i <= n; i++) {
            const interestEarned = currentBalance * r;
            const openingBalance = currentBalance;
            currentBalance += interestEarned;
            yearlyData.push({
                year: i,
                openingBalance,
                interestEarned,
                closingBalance: currentBalance
            });
        }

        return {
            finalAmount: currentBalance,
            totalInterest: currentBalance - p,
            yearlyData
        };
    }, [principal, interestRate, years]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="space-y-8">
            <div className="bg-secondary/30 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 font-medium">Initial Investment</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                            <input
                                type="number"
                                value={principal}
                                onChange={(e) => setPrincipal(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 font-medium">Expected Interest Rate (p.a.)</label>
                        <div className="relative">
                            <select
                                value={interestRate}
                                onChange={(e) => setInterestRate(parseInt(e.target.value))}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                            >
                                {[5, 8, 10, 12, 15, 20, 25, 30].map(rate => (
                                    <option key={rate} value={rate} className="bg-secondary">{rate}%</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 font-medium">Period (Years)</label>
                        <div className="relative">
                            <select
                                value={years}
                                onChange={(e) => setYears(parseInt(e.target.value))}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                            >
                                {Array.from({ length: 30 }, (_, i) => i + 1).map(year => (
                                    <option key={year} value={year} className="bg-secondary">{year} {year === 1 ? 'Year' : 'Years'}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-semibold">Total Wealth</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(stats.finalAmount)}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-semibold">Total Returns</p>
                        <p className="text-3xl font-bold text-accent">{formatCurrency(stats.totalInterest)}</p>
                    </div>
                </div>
            </div>

            {/* Yearly Breakdown */}
            <div className="bg-secondary/20 border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar size={20} className="text-primary" />
                        Yearly Growth Projection
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Year</th>
                                <th className="px-6 py-4 font-semibold">Interest Earned</th>
                                <th className="px-6 py-4 font-semibold">Closing Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.yearlyData.map((data) => (
                                <tr key={data.year} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-300">Year {data.year}</td>
                                    <td className="px-6 py-4 font-mono text-accent">+{formatCurrency(data.interestEarned)}</td>
                                    <td className="px-6 py-4 font-mono text-white font-semibold">{formatCurrency(data.closingBalance)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* How it works */}
            <div className="prose prose-invert max-w-none text-gray-400 text-sm leading-relaxed">
                <h3 className="text-white font-semibold text-lg mb-2">The Power of Compounding</h3>
                <p>
                    Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods.
                </p>
                <p className="mt-2 text-primary font-medium italic">
                    "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it." — Albert Einstein
                </p>
            </div>
        </div>
    );
}
