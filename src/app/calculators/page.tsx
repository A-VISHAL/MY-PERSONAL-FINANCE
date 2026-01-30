"use client";

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { Plus, Trash2, Calculator, TrendingUp, DollarSign, PieChart, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CalculatorsPage() {
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

    const otherCalculators = [
        { name: 'SIP Calculator', icon: <TrendingUp size={18} />, href: '#' },
        { name: 'Lumpsum Calculator', icon: <DollarSign size={18} />, href: '#' },
        { name: 'SWP Calculator', icon: <PieChart size={18} />, href: '#' },
        { name: 'Mutual Fund Returns', icon: <BarChart3 size={18} />, href: '#' },
    ];

    return (
        <main className="min-h-screen pb-20 bg-background text-white">
            <Navbar />

            <div className="pt-32 px-6 container mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                        <Calculator className="text-primary" size={32} />
                        Stock Average Calculator
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Calculate average price of your stock investments instantly.
                        Enter your buy price and quantity for each purchase to see your averaged entry price.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Calculator Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-secondary/30 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                            <div className="space-y-6">
                                {shares.map((share, index) => (
                                    <div key={share.id} className="animate-in fade-in slide-in-from-left-4 duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-medium text-gray-400">Share {index + 1}Purchase</h3>
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

                        {/* Explanation Text */}
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
                            <h3 className="text-lg font-semibold mb-4">Popular Calculators</h3>
                            <ul className="space-y-2">
                                {otherCalculators.map((calc, idx) => (
                                    <li key={idx}>
                                        <a href={calc.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white group">
                                            <span className="text-gray-500 group-hover:text-primary transition-colors">{calc.icon}</span>
                                            {calc.name}
                                        </a>
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
