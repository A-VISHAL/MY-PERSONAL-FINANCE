"use client";

import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function SSYCalculator() {
    const [yearlyInvestment, setYearlyInvestment] = useState<number>(10000);
    const [girlAge, setGirlAge] = useState<number>(5);
    const [startYear, setStartYear] = useState<number>(new Date().getFullYear());

    const rate = 8.2; // Latest SSY Rate

    const stats = useMemo(() => {
        const r = rate / 100;
        let totalInvestment = 0;
        let maturityValue = 0;

        // SSY Logic: Deposit for 15 years, maturity after 21 years from start
        for (let i = 0; i < 21; i++) {
            if (i < 15) {
                maturityValue += yearlyInvestment;
                totalInvestment += yearlyInvestment;
            }
            maturityValue *= (1 + r);
        }

        return {
            totalInvestment,
            totalInterest: maturityValue - totalInvestment,
            maturityValue,
            maturityYear: startYear + 21
        };
    }, [yearlyInvestment, startYear]);

    const chartData = [
        { name: 'Total Investment', value: stats.totalInvestment },
        { name: 'Total Interest', value: stats.totalInterest },
    ];

    const COLORS = ['#e2e8f0', '#6366f1'];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="bg-secondary/30 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            <div className="mb-8 text-sm text-gray-500 font-medium bg-white/5 w-fit px-4 py-1 rounded-full border border-white/5">
                Latest SSY Rate = <span className="text-primary">{rate}%</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    {/* Yearly Investment */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm text-gray-400 font-medium">Yearly investment</label>
                            <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg font-mono font-bold border border-primary/20">
                                ₹{yearlyInvestment.toLocaleString()}
                            </div>
                        </div>
                        <input
                            type="range"
                            min="250"
                            max="150000"
                            step="250"
                            value={yearlyInvestment}
                            onChange={(e) => setYearlyInvestment(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Girl's Age */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm text-gray-400 font-medium">Girl's age</label>
                            <div className="bg-accent/10 text-accent px-4 py-1.5 rounded-lg font-mono font-bold border border-accent/20">
                                {girlAge} Yr{girlAge > 1 ? 's' : ''}
                            </div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={girlAge}
                            onChange={(e) => setGirlAge(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                    </div>

                    {/* Start Period */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm text-gray-400 font-medium">Start period</label>
                            <div className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-lg font-mono font-bold border border-emerald-500/20">
                                {startYear}
                            </div>
                        </div>
                        <input
                            type="range"
                            min="2015"
                            max={new Date().getFullYear()}
                            value={startYear}
                            onChange={(e) => setStartYear(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>

                    <div className="pt-8 border-t border-white/5 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Total investment</span>
                            <span className="font-semibold text-gray-300">{formatCurrency(stats.totalInvestment)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Total interest</span>
                            <span className="font-semibold text-emerald-500">{formatCurrency(stats.totalInterest)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Maturity year</span>
                            <span className="font-semibold text-gray-300">{stats.maturityYear}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-gray-400 font-medium font-semibold">Maturity value</span>
                            <span className="text-xl font-bold text-white">{formatCurrency(stats.maturityValue)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="w-full h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#12121a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex gap-6 mt-8">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-200" />
                            <span className="text-xs text-gray-400">Principal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span className="text-xs text-gray-400">Interest</span>
                        </div>
                    </div>

                    <button className="mt-12 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-wider text-sm">
                        Tax Saver Funds
                    </button>
                </div>
            </div>
        </div>
    );
}
