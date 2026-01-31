"use client";

import { useState, useMemo } from 'react';
import { ChevronDown, Calculator } from 'lucide-react';

export default function IncomeTaxCalculator() {
    const [income, setIncome] = useState<number>(1200000);
    const [deductions, setDeductions] = useState<number>(150000);
    const [ageCategory, setAgeCategory] = useState<'Below 60' | '60-80' | 'Above 80'>('Below 60');

    const calculateTax = () => {
        const taxableIncome = Math.max(0, income - deductions);
        let tax = 0;

        // Simplified Old Regime Logic (for demonstration)
        if (taxableIncome <= 250000) tax = 0;
        else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
        else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2;
        else tax = 112500 + (taxableIncome - 1000000) * 0.3;

        // Rebate u/s 87A
        if (taxableIncome <= 500000) tax = 0;

        // Cess 4%
        tax *= 1.04;

        return tax;
    };

    const tax = useMemo(() => calculateTax(), [income, deductions, ageCategory]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="bg-secondary/30 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            <div className="space-y-8">
                {/* Assessment Year */}
                <div className="space-y-4">
                    <label className="text-sm text-gray-400 font-medium">Assessment year</label>
                    <div className="relative">
                        <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-primary/50 text-gray-300">
                            <option>2025 - 2026</option>
                            <option>2024 - 2025</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                    </div>
                </div>

                {/* Age Category */}
                <div className="space-y-4">
                    <label className="text-sm text-gray-400 font-medium">Age category</label>
                    <div className="relative">
                        <select
                            value={ageCategory}
                            onChange={(e) => setAgeCategory(e.target.value as any)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-primary/50 text-gray-300"
                        >
                            <option>Below 60</option>
                            <option>60-80</option>
                            <option>Above 80</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                    </div>
                </div>

                {/* Income slider */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-400 font-medium">Annual Income</label>
                        <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg font-mono font-bold border border-primary/20">
                            ₹{income.toLocaleString()}
                        </div>
                    </div>
                    <input
                        type="range"
                        min="100000"
                        max="10000000"
                        step="50000"
                        value={income}
                        onChange={(e) => setIncome(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>

                {/* Deductions slider */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-400 font-medium">Total Deductions (80C, 80D, etc.)</label>
                        <div className="bg-accent/10 text-accent px-4 py-1.5 rounded-lg font-mono font-bold border border-accent/20">
                            ₹{deductions.toLocaleString()}
                        </div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="500000"
                        step="5000"
                        value={deductions}
                        onChange={(e) => setDeductions(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-semibold">Estimated Tax</p>
                        <p className="text-4xl font-bold text-white">{formatCurrency(tax)}</p>
                    </div>
                    <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-widest text-sm">
                        <Calculator size={18} /> Calculate Detailed
                    </button>
                </div>
            </div>
        </div>
    );
}
