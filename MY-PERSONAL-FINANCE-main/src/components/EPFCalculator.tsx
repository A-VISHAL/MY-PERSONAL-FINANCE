"use client";

import { useState, useMemo } from 'react';

export default function EPFCalculator() {
    const [monthlySalary, setMonthlySalary] = useState<number>(50000);
    const [age, setAge] = useState<number>(30);
    const [contribution, setContribution] = useState<number>(12);
    const [salaryIncrease, setSalaryIncrease] = useState<number>(5);
    const rate = 8.25;

    const stats = useMemo(() => {
        const r = rate / 100 / 12;
        const retirementAge = 58;
        const totalMonths = (retirementAge - age) * 12;

        let currentBalance = 0;
        let currentSalary = monthlySalary;

        for (let i = 1; i <= totalMonths; i++) {
            // Employer contribution to EPF is 3.67%
            // Employee contribution is usually 12%
            const monthlyContribution = currentSalary * (contribution / 100 + 0.0367);
            currentBalance += monthlyContribution;
            currentBalance *= (1 + r);

            // Annual salary increase
            if (i % 12 === 0) {
                currentSalary *= (1 + salaryIncrease / 100);
            }
        }

        return {
            accumulated: currentBalance
        };
    }, [monthlySalary, age, contribution, salaryIncrease]);

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
                {/* Monthly Salary */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-400 font-medium">Monthly salary (Basic + DA)</label>
                        <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg font-mono font-bold border border-primary/20">
                            ₹{monthlySalary.toLocaleString()}
                        </div>
                    </div>
                    <input
                        type="range"
                        min="5000"
                        max="500000"
                        step="1000"
                        value={monthlySalary}
                        onChange={(e) => setMonthlySalary(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>

                {/* Age */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-400 font-medium">Your age</label>
                        <div className="bg-accent/10 text-accent px-4 py-1.5 rounded-lg font-mono font-bold border border-accent/20">
                            {age} Yr{age > 1 ? 's' : ''}
                        </div>
                    </div>
                    <input
                        type="range"
                        min="18"
                        max="57"
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                </div>

                {/* Contribution */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-400 font-medium">Your contribution to EPF</label>
                        <div className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-lg font-mono font-bold border border-emerald-500/20">
                            {contribution}%
                        </div>
                    </div>
                    <input
                        type="range"
                        min="12"
                        max="20"
                        value={contribution}
                        onChange={(e) => setContribution(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>

                {/* Salary Increase */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-400 font-medium">Annual increase in salary</label>
                        <div className="bg-blue-500/10 text-blue-500 px-4 py-1.5 rounded-lg font-mono font-bold border border-blue-500/20">
                            {salaryIncrease}%
                        </div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="30"
                        value={salaryIncrease}
                        onChange={(e) => setSalaryIncrease(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Interest Rate */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-400 font-medium">Rate of interest</label>
                        <div className="bg-white/5 text-gray-400 px-4 py-1.5 rounded-lg font-mono font-bold border border-white/10">
                            {rate}%
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center pt-8 border-t border-white/5">
                    <p className="text-gray-400 text-sm mb-2">You will have accumulated</p>
                    <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {formatCurrency(stats.accumulated)}
                    </p>
                    <p className="text-gray-500 text-xs mt-2 font-medium">by the time you retire</p>
                </div>
            </div>
        </div>
    );
}
