"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, Activity, ChevronDown, TrendingUp, DollarSign, BarChart3, Wallet, Landmark, Receipt, Percent, LandmarkIcon, Building2, Coins, User } from 'lucide-react';

export default function Navbar() {
    const [isCalcOpen, setIsCalcOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const calculators = [
        { name: 'SIP Calculator', icon: <TrendingUp size={16} /> },
        { name: 'Lumpsum Calculator', icon: <DollarSign size={16} /> },
        { name: 'EMICalculator', icon: <Percent size={16} /> },
        { name: 'Income Tax', icon: <Receipt size={16} /> },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-background/80 backdrop-blur-xl border-white/10 shadow-lg' : 'bg-transparent border-transparent'}`}>
            <div className="w-full px-4 md:px-12 h-16 flex items-center justify-between gap-8">
                {/* Left: Logo & Core Tabs */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                            <Activity size={18} />
                        </div>
                        <span className="hidden lg:block text-xl font-bold tracking-tight">
                            WealthWise<span className="text-primary">AI</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/portfolio" className="text-sm font-semibold text-white/90 hover:text-primary transition-colors">Stocks</Link>
                        <Link href="/fno" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">F&O</Link>
                        <Link href="/mutual-funds" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">Mutual Funds</Link>
                    </div>
                </div>

                {/* Center: Search Bar */}
                <div className="flex-1 max-w-xl hidden lg:block">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search stocks, mutual funds, calculators..."
                            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-12 pr-16 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-gray-500 pointer-events-none">
                            Ctrl+K
                        </div>
                    </div>
                </div>

                {/* Right: Tools & Profile */}
                <div className="flex items-center gap-4">
                    <div className="hidden xl:flex items-center gap-4 mr-2">
                        <div className="relative group" onMouseEnter={() => setIsCalcOpen(true)} onMouseLeave={() => setIsCalcOpen(false)}>
                            <button className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-white transition-colors py-2">
                                Calculators <ChevronDown size={14} className={`transition-transform ${isCalcOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`absolute top-full right-0 w-64 bg-secondary border border-white/10 rounded-2xl p-3 shadow-2xl backdrop-blur-xl transition-all duration-200 origin-top ${isCalcOpen ? 'opacity-100 visible translate-y-2' : 'opacity-0 invisible translate-y-0'}`}>
                                {calculators.map((calc, idx) => (
                                    <Link key={idx} href="/calculators" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 group/item underline-none">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover/item:text-primary group-hover/item:bg-primary/10 transition-colors">{calc.icon}</div>
                                        <span className="text-sm text-gray-300 group-hover/item:text-white transition-colors">{calc.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link href="/analyze" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Analyze</Link>
                    </div>

                    <button className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all relative">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                    </button>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center text-primary cursor-pointer hover:border-primary/50 transition-all">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </nav>
    );
}
