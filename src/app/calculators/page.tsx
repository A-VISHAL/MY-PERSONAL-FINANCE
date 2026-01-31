"use client";

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { Plus, Trash2, Calculator, TrendingUp, DollarSign, PieChart, BarChart3, ArrowRight, Wallet, Landmark, Receipt, Building2, LandmarkIcon, Coins, Percent } from 'lucide-react';
import Link from 'next/link';
import FutureWealthCalculator from '@/components/FutureWealthCalculator';
import SIPCalculator from '@/components/SIPCalculator';
import SWPCalculator from '@/components/SWPCalculator';
import SSYCalculator from '@/components/SSYCalculator';
import PPFCalculator from '@/components/PPFCalculator';
import EPFCalculator from '@/components/EPFCalculator';
import IncomeTaxCalculator from '@/components/IncomeTaxCalculator';

export default function CalculatorsPage() {
    const [selectedCalc, setSelectedCalc] = useState('Sukanya Samriddhi');
    const [shares, setShares] = useState([{ id: 1, price: '', quantity: '' }, { id: 2, price: '', quantity: '' }]);

    const addShare = () => {
        setShares([...shares, { id: Date.now(), price: '', quantity: '' }]);
    };

    const removeShare = (id: number) => {
        if (shares.length > 1) {
            setShares(shares.filter(s => s.id !== id));
        }
    };

    const updateShare = (id: number, field: 'price' | 'quantity', value: string) => {
        const newShares = shares.map(s => {
            if (s.id === id) {
                return { ...s, [field]: value };
            }
            return s;
        });
        setShares(newShares);
    };

    const stats = useMemo(() => {
        let totalQty = 0;
        let totalAmt = 0;

        shares.forEach(s => {
            const p = parseFloat(s.price) || 0;
            const q = parseFloat(s.quantity) || 0;
            totalQty += q;
            totalAmt += p * q;
        });

        const avgPrice = totalQty > 0 ? totalAmt / totalQty : 0;

        return { totalQty, totalAmt, avgPrice };
    }, [shares]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    };

    const calculatorOptions = [
        { name: 'SIP Calculator', icon: <TrendingUp size={18} />, desc: 'Systematic Investment Plan calculator for SIP and Lumpsum investments.' },
        { name: 'Lumpsum Calculator', icon: <DollarSign size={18} />, desc: 'Check the returns of your one-time investment over time.' },
        { name: 'Mutual Fund Returns', icon: <BarChart3 size={18} />, desc: 'Calculate the returns on your mutual fund investments.' },
        { name: 'Sukanya Samriddhi', icon: <Landmark size={18} />, desc: 'Calculate your returns for the girl child savings scheme.' },
        { name: 'Income Tax', icon: <Receipt size={18} />, desc: 'Estimate your annual income tax liability.' },
        { name: 'PPF Calculator', icon: <Wallet size={18} />, desc: 'Predict the returns on your Public Provident Fund account.' },
        { name: 'EPF Calculator', icon: <Building2 size={18} />, desc: 'Calculate your Employee Provident Fund corpus maturity.' },
        { name: 'FD Calculator', icon: <LandmarkIcon size={18} />, desc: 'Check the returns on your Fixed Deposits.' },
        { name: 'RD Calculator', icon: <Coins size={18} />, desc: 'Calculate your Recurring Deposit maturity amount.' },
        { name: 'EMI Calculator', icon: <Percent size={18} />, desc: 'Estimate your monthly loan installments.' },
        { name: 'GST Calculator', icon: <Receipt size={18} />, desc: 'Calculate the GST amount for any price.' },
        { name: 'XIRR Calculator', icon: <TrendingUp size={18} />, desc: 'Find the annualized yield for irregular cashflows.' },
        { name: 'Future Wealth', icon: <TrendingUp size={18} />, desc: 'Predict how your money will grow over time with compound interest.' },
        { name: 'Stock Average', icon: <Calculator size={18} />, desc: 'Calculate the average cost of your stock purchases.' },
        { name: 'SWP Calculator', icon: <PieChart size={18} />, desc: 'Estimate how long your retirement corpus will last.' },
    ];

    return (
        <main className="min-h-screen pb-20 bg-background text-white">
            <Navbar />

            <div className="pt-32 px-6 container mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                        {calculatorOptions.find(c => c.name === selectedCalc)?.icon}
                        {selectedCalc} Calculator
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        {calculatorOptions.find(c => c.name === selectedCalc)?.desc}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Calculator Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {selectedCalc === 'Stock Average' ? (
                            <>
                                <div className="bg-secondary/30 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                                    <div className="space-y-6">
                                        {shares.map((share, index) => (
                                            <div key={share.id} className="animate-in fade-in slide-in-from-left-4 duration-300">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-sm font-medium text-gray-400">Purchase {index + 1}</h3>
                                                    {shares.length > 1 && (
                                                        <button
                                                            onClick={() => removeShare(share.id)}
                                                            className="text-red-400/50 hover:text-red-400 transition-colors p-1"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs text-gray-500">Buy Price</label>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                                            <input
                                                                type="number"
                                                                value={share.price}
                                                                onChange={(e) => updateShare(share.id, 'price', e.target.value)}
                                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs text-gray-500">Quantity</label>
                                                        <input
                                                            type="number"
                                                            value={share.quantity}
                                                            onChange={(e) => updateShare(share.id, 'quantity', e.target.value)}
                                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={addShare}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-primary transition-all text-sm font-medium border border-white/5"
                                        >
                                            <Plus size={16} /> Add More
                                        </button>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">Total Shares</p>
                                            <p className="text-2xl font-bold">{stats.totalQty}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                                            <p className="text-2xl font-bold text-gray-300">{formatCurrency(stats.totalAmt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">Average Price</p>
                                            <p className="text-3xl font-bold text-primary">{formatCurrency(stats.avgPrice)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-invert max-w-none text-gray-400 text-sm leading-relaxed">
                                    <h3 className="text-white font-semibold text-lg mb-2">How it works</h3>
                                    <p>
                                        Buying stocks at different price points is a common strategy to average out your investment cost.
                                        This logic is fundamental for effective Rupee Cost Averaging (SIP).
                                    </p>
                                    <p className="mt-2">
                                        Use this calculator to determine your break-even point and average entry price when accumulating stock over time.
                                    </p>
                                </div>
                            </>
                        ) : selectedCalc === 'Future Wealth' ? (
                            <FutureWealthCalculator />
                        ) : selectedCalc === 'SIP Calculator' ? (
                            <SIPCalculator initialMode="SIP" />
                        ) : selectedCalc === 'Lumpsum Calculator' ? (
                            <SIPCalculator initialMode="Lumpsum" />
                        ) : selectedCalc === 'Mutual Fund Returns' ? (
                            <SIPCalculator initialMode="Lumpsum" />
                        ) : selectedCalc === 'Sukanya Samriddhi' ? (
                            <SSYCalculator />
                        ) : selectedCalc === 'PPF Calculator' ? (
                            <PPFCalculator />
                        ) : selectedCalc === 'EPF Calculator' ? (
                            <EPFCalculator />
                        ) : selectedCalc === 'Income Tax' ? (
                            <IncomeTaxCalculator />
                        ) : selectedCalc === 'SWP Calculator' ? (
                            <SWPCalculator />
                        ) : (
                            <div className="bg-secondary/30 border border-white/5 rounded-3xl p-12 text-center backdrop-blur-sm">
                                <Wallet size={48} className="mx-auto mb-4 text-gray-600" />
                                <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
                                <p className="text-gray-400">We are currently building this calculator. Check back soon!</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Sidebar / CTA */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-3xl p-6 text-center">
                            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                                <TrendingUp size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Discover Stocks That Fit You</h3>
                            <p className="text-sm text-gray-400 mb-6">Build a diversified portfolio with AI-driven insights.</p>
                            <Link href="/#analyze" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-all w-full justify-center">
                                Start Analysis <ArrowRight size={18} />
                            </Link>
                        </div>

                        <div className="bg-secondary/30 border border-white/5 rounded-3xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Calculators</h3>
                            <ul className="space-y-2">
                                {calculatorOptions.map((calc, idx) => (
                                    <li key={idx}>
                                        <button
                                            onClick={() => setSelectedCalc(calc.name)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left group ${selectedCalc === calc.name ? 'bg-primary/20 text-white' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                        >
                                            <span className={`${selectedCalc === calc.name ? 'text-primary' : 'text-gray-500 group-hover:text-primary'} transition-colors`}>{calc.icon}</span>
                                            {calc.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
