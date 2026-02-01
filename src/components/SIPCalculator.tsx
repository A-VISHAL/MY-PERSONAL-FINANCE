"use client";

import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SIPCalculatorProps {
    initialMode?: 'SIP' | 'Lumpsum';
}

export default function SIPCalculator({ initialMode = 'SIP' }: SIPCalculatorProps) {
    const [mode, setMode] = useState<'SIP' | 'Lumpsum'>(initialMode);
    const [monthlyInvestment, setMonthlyInvestment] = useState<number>(25000);
    const [lumpsumAmount, setLumpsumAmount] = useState<number>(100000);
    const [interestRate, setInterestRate] = useState<number>(12);
    const [years, setYears] = useState<number>(10);

    const stats = useMemo(() => {
        const r = interestRate / 100 / 12;
        const n = years * 12;

        let totalValue = 0;
        let investedAmount = 0;

        if (mode === 'SIP') {
            investedAmount = monthlyInvestment * n;
            totalValue = monthlyInvestment * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
        } else {
            investedAmount = lumpsumAmount;
            totalValue = lumpsumAmount * Math.pow(1 + (interestRate / 100), years);
        }

        const estReturns = totalValue - investedAmount;

        return {
            investedAmount,
            estReturns: Math.max(0, estReturns),
            totalValue: Math.max(investedAmount, totalValue)
        };
    }, [mode, monthlyInvestment, lumpsumAmount, interestRate, years]);

    const chartData = [
        { name: 'Invested Amount', value: stats.investedAmount },
        { name: 'Est. Returns', value: stats.estReturns },
    ];

    const COLORS = ['#6366f1', '#10b981'];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="bg-secondary/30 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            <div className="flex bg-black/20 p-1 rounded-xl w-fit mb-8 border border-white/5">
                <button
                    onClick={() => setMode('SIP')}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'SIP' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    SIP
                </button>
                <button
                    onClick={() => setMode('Lumpsum')}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'Lumpsum' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    Lumpsum
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    {/* Amount Input */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm text-gray-400 font-medium">
                                {mode === 'SIP' ? 'Monthly investment' : 'Total investment'}
                            </label>
                            <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg font-mono font-bold border border-primary/20">
                                ₹{mode === 'SIP' ? monthlyInvestment.toLocaleString() : lumpsumAmount.toLocaleString()}
                            </div>
                        </div>
                        <input
                            type="range"
                            min={mode === 'SIP' ? 500 : 5000}
                            max={mode === 'SIP' ? 1000000 : 10000000}
                            step={mode === 'SIP' ? 500 : 5000}
                            value={mode === 'SIP' ? monthlyInvestment : lumpsumAmount}
                            onChange={(e) => mode === 'SIP' ? setMonthlyInvestment(parseInt(e.target.value)) : setLumpsumAmount(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Interest Rate Input */}
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

                    {/* Time Period Input */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm text-gray-400 font-medium">Time period</label>
                            <div className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-lg font-mono font-bold border border-emerald-500/20">
                                {years} Yr{years > 1 ? 's' : ''}
                            </div>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="40"
                            value={years}
                            onChange={(e) => setYears(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>

                    <div className="pt-8 border-t border-white/5 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Invested amount</span>
                            <span className="font-semibold text-gray-300">{formatCurrency(stats.investedAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Est. returns</span>
                            <span className="font-semibold text-emerald-500">{formatCurrency(stats.estReturns)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-gray-400 font-medium font-semibold">Total value</span>
                            <span className="text-xl font-bold text-white">{formatCurrency(stats.totalValue)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center min-h-[300px]">
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
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xs text-gray-500 uppercase tracking-widest">Growth</span>
                            <span className="text-xl font-bold">+{((stats.estReturns / stats.investedAmount) * 100).toFixed(0)}%</span>
                        </div>
                    </div>

                    <div className="flex gap-6 mt-8">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span className="text-xs text-gray-400">Invested</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-xs text-gray-400">Returns</span>
                        </div>
                    </div>

                    <button className="mt-12 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-wider text-sm">
                        Invest Now
                    </button>
                </div>
            </div>
        </div>
    );
}
