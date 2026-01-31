"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Activity, ChevronDown, Calculator, TrendingUp, DollarSign, PieChart, BarChart3, Wallet, Landmark, Receipt, Percent, LandmarkIcon, Building2, Coins } from 'lucide-react';

export default function Navbar() {
    const [isCalcOpen, setIsCalcOpen] = useState(false);

    const calculators = [
        { name: 'SIP Calculator', icon: <TrendingUp size={16} /> },
        { name: 'Lumpsum Calculator', icon: <DollarSign size={16} /> },
        { name: 'Mutual Fund Returns', icon: <BarChart3 size={16} /> },
        { name: 'Sukanya Samriddhi', icon: <Landmark size={16} /> },
        { name: 'Income Tax', icon: <Receipt size={16} /> },
        { name: 'PPF Calculator', icon: <Wallet size={16} /> },
        { name: 'EPF Calculator', icon: <Building2 size={16} /> },
        { name: 'FD Calculator', icon: <LandmarkIcon size={16} /> },
        { name: 'RD Calculator', icon: <Coins size={16} /> },
        { name: 'EMI Calculator', icon: <Percent size={16} /> },
        { name: 'GST Calculator', icon: <Receipt size={16} /> },
        { name: 'XIRR Calculator', icon: <TrendingUp size={16} /> },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg group-hover:shadow-primary/20 transition-all">
                        <Activity size={20} />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        WealthWise<span className="text-primary">AI</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/portfolio" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Portfolio</Link>

                    {/* Calculators Dropdown */}
                    <div
                        className="relative group"
                        onMouseEnter={() => setIsCalcOpen(true)}
                        onMouseLeave={() => setIsCalcOpen(false)}
                    >
                        <button className="flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-white transition-colors py-4">
                            Calculators <ChevronDown size={14} className={`transition-transform duration-200 ${isCalcOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`absolute top-full left-1/2 -translate-x-1/2 w-[480px] bg-secondary border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 origin-top ${isCalcOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                            <div className="mb-4 px-2">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Popular Calculators</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                                {calculators.map((calc, idx) => (
                                    <Link
                                        key={idx}
                                        href="/calculators"
                                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group/item"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover/item:text-primary group-hover/item:bg-primary/10 transition-colors">
                                            {calc.icon}
                                        </div>
                                        <span className="text-sm text-gray-400 group-hover/item:text-white transition-colors">{calc.name}</span>
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                                <Link href="/calculators" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
                                    View All Tools <ChevronDown size={12} className="-rotate-90" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Link href="/#analyze" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Analyze</Link>
                    <Link href="/#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</Link>
                    <Link href="/#dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                </div>

                <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium">
                    Sign In
                </button>
            </div>
        </nav>
    );
}
