"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Activity, ChevronDown, Calculator, TrendingUp, DollarSign, PieChart, BarChart3, Wallet, Landmark, Receipt, Percent, LandmarkIcon, Building2, Coins, Search, User } from 'lucide-react';

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
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg group-hover:shadow-primary/20 transition-all">
                        <Activity size={20} />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                        WealthWise<span className="text-primary">AI</span>
                    </span>
                </Link>

                {/* Search Bar */}
                <div className="flex-1 max-w-xl hidden lg:block mx-10">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search stocks, mutual funds, gold..."
                            className="w-full h-10 bg-slate-100 border border-slate-200 rounded-xl pl-11 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-white transition-all text-slate-900"
                        />
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/portfolio" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Stocks</Link>
                    <Link href="/fno" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">F&O</Link>
                    <Link href="/mutual-funds" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Mutual Funds</Link>

                    {/* Calculators Dropdown */}
                    <div
                        className="relative group"
                        onMouseEnter={() => setIsCalcOpen(true)}
                        onMouseLeave={() => setIsCalcOpen(false)}
                    >
                        <button className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors py-4">
                            Calculators <ChevronDown size={14} className={`transition-transform duration-200 ${isCalcOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`absolute top-full left-1/2 -translate-x-1/2 w-[480px] bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl transition-all duration-300 origin-top ${isCalcOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                            <div className="mb-4 px-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Popular Calculators</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                                {calculators.map((calc, idx) => (
                                    <Link
                                        key={idx}
                                        href="/calculators"
                                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all group/item"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover/item:text-primary group-hover/item:bg-primary/10 transition-colors">
                                            {calc.icon}
                                        </div>
                                        <span className="text-sm text-slate-500 group-hover/item:text-slate-900 transition-colors">{calc.name}</span>
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                                <Link href="/calculators" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
                                    View All Tools <ChevronDown size={12} className="-rotate-90" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Link href="/analyze" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Analyze</Link>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3 ml-4">
                    <div className="hidden xl:flex items-center gap-4 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold">
                        <span className="text-slate-400">NIFTY 50</span>
                        <span className="text-emerald-600 text-xs">25,235.90</span>
                        <span className="text-emerald-500/60">+0.85%</span>
                    </div>
                    <button className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
                        <User size={20} className="text-slate-500" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
