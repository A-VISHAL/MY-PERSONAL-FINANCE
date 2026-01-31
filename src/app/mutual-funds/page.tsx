"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import {
    ChevronRight, Zap, Flame, Trophy, Coins,
    PieChart, Landmark, Shield, LayoutGrid,
    ArrowUpRight, AlertCircle, Plus, Info,
    BarChart3, LineChart, TrendingUp, Search
} from 'lucide-react';
import Link from 'next/link';

export default function MutualFundsPage() {
    const [scrolled, setScrolled] = useState(false);
    const [isLive, setIsLive] = useState(true);
    const [fundReturns, setFundReturns] = useState([63.8, 39.8, 21.6, 30.4]);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsSyncing(true);
            setTimeout(() => {
                setFundReturns(prev => prev.map(r => {
                    const change = (Math.random() * 0.1 - 0.05);
                    return parseFloat((r + change).toFixed(1));
                }));
                setIsSyncing(false);
            }, 800);
        }, 15000); // Sync every 15 seconds

        return () => clearInterval(interval);
    }, []);

    const popularFunds = [
        { name: 'HDFC Silver ETF FoF Direct - Growth', return: '+63.8%', icon: <Coins className="text-gray-400" />, color: 'from-blue-500/20 to-transparent' },
        { name: 'SBI Gold Direct Plan-Growth', return: '+39.8%', icon: <Landmark className="text-yellow-500" />, color: 'from-amber-500/20 to-transparent' },
        { name: 'Parag Parikh Flexi Cap Fund', return: '+21.6%', icon: <PieChart className="text-emerald-500" />, color: 'from-emerald-500/20 to-transparent' },
        { name: 'Bandhan Small Cap Fund', return: '+30.4%', icon: <Zap className="text-orange-500" />, color: 'from-orange-500/20 to-transparent' },
    ];

    const collections = [
        { name: 'High return', icon: <TrendingUp size={24} className="text-primary" /> },
        { name: 'Gold & Silver', icon: <Coins size={24} className="text-amber-400" /> },
        { name: '5 Star Funds', icon: <Trophy size={24} className="text-yellow-400" /> },
        { name: 'Large Cap', icon: <Landmark size={24} className="text-blue-400" /> },
        { name: 'Mid Cap', icon: <BarChart3 size={24} className="text-purple-400" /> },
        { name: 'Small Cap', icon: <LayoutGrid size={24} className="text-emerald-400" /> },
    ];

    const growwFunds = [
        { name: 'Groww Nifty PSE ETF FOF Direct-Growth', type: 'NFO', date: '06 Feb', end: 'Ends in 6 days' },
        { name: 'Groww Silver ETF FoF Direct Growth', type: '', status: '9M Old', date: '--' },
        { name: 'Groww Gold ETF FOF Direct Growth', type: '', status: 'NA', date: '--' },
        { name: 'Groww Multicap Fund Direct Growth', type: '', status: 'NA', date: '--' },
    ];

    const tools = [
        { name: 'NFO Live', count: '9 open', icon: <AlertCircle className="text-primary" /> },
        { name: 'Import funds', icon: <Plus className="text-gray-400" /> },
        { name: 'Compare funds', icon: <BarChart3 className="text-gray-400" /> },
        { name: 'SIP Calculator', icon: <LineChart className="text-gray-400" /> },
        { name: 'Mutual funds screener', icon: <Search className="text-gray-400" /> },
    ];

    return (
        <main className="min-h-screen pb-20 bg-[#050505] text-white selection:bg-primary/30">
            <Navbar />

            <div className="px-4 md:px-12 w-full max-w-[1600px] mx-auto pt-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* Popular Funds */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                                    Popular Funds
                                    {isLive && (
                                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-500 animate-pulse uppercase tracking-widest"> Live NAV</span>
                                    )}
                                </h3>
                                <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">All Mutual Funds <ChevronRight size={14} /></button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                {popularFunds.map((fund, i) => (
                                    <div key={i} className={`p-6 rounded-[32px] bg-secondary/20 border border-white/5 hover:border-white/10 transition-all group cursor-pointer relative overflow-hidden`}>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${fund.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                        <div className="relative z-10">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                {fund.icon}
                                            </div>
                                            <h4 className="text-sm font-bold leading-relaxed mb-8 line-clamp-2 h-10">{fund.name}</h4>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-lg font-black transition-colors duration-500 ${isSyncing ? 'text-primary' : 'text-emerald-500'}`}>
                                                    +{fundReturns[i]}%
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-500">3Y</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Collections */}
                        <section>
                            <h3 className="text-xl font-black tracking-tight mb-8">Collections</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                                {collections.map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-[24px] hover:bg-white/5 transition-all cursor-pointer group">
                                        <div className="w-16 h-16 rounded-[20px] bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:-translate-y-1 transition-all shadow-lg">
                                            {item.icon}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Funds by Groww */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black tracking-tight">Funds by WealthWise</h3>
                                <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">View all <ChevronRight size={14} /></button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                {growwFunds.map((fund, i) => (
                                    <div key={i} className="p-6 rounded-[32px] bg-secondary/10 border border-white/5 hover:border-primary/20 transition-all group cursor-pointer relative">
                                        {fund.type === 'NFO' && (
                                            <span className="absolute top-4 right-4 px-2 py-0.5 rounded-md bg-primary text-white text-[8px] font-black tracking-widest uppercase">NFO</span>
                                        )}
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent mb-6 animate-pulse" />
                                        <h4 className="text-sm font-bold leading-relaxed mb-8 h-10 line-clamp-2">{fund.name}</h4>
                                        <div className="flex items-center justify-between text-gray-500 text-[10px] font-bold">
                                            <span>{fund.date}</span>
                                            <span className="uppercase tracking-widest">{fund.end || fund.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">

                        {/* Setup CTA */}
                        <div className="p-8 rounded-[40px] bg-gradient-to-b from-[#12121a] to-[#050505] border border-white/10 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.1),transparent)]" />
                            <div className="w-32 h-32 mx-auto mb-8 relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                                <div className="relative z-10 w-full h-full rounded-full border border-white/5 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                                    <div className="p-4 bg-emerald-500/10 rounded-2xl">
                                        <Shield size={40} className="text-emerald-500" />
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-lg font-black mb-2">Attention required!</h4>
                            <p className="text-xs text-gray-500 mb-8 max-w-[200px] mx-auto">Complete setting up your account to start investing in Mutual Funds.</p>
                            <button className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-tighter">
                                Complete Setup
                            </button>
                        </div>

                        {/* Your Investments */}
                        <div className="p-8 rounded-[40px] bg-secondary/10 border border-white/5">
                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-8">Your Investments</h4>
                            <div className="py-12 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                    <PieChart size={32} className="text-gray-600" />
                                </div>
                                <p className="text-sm font-bold text-gray-500">You haven't invested yet</p>
                            </div>
                        </div>

                        {/* Products and Tools */}
                        <div className="p-8 rounded-[40px] bg-[#0a0a0a] border border-white/5">
                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-8 px-2">Products and Tools</h4>
                            <div className="space-y-2">
                                {tools.map((tool, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                                                {tool.icon}
                                            </div>
                                            <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{tool.name}</span>
                                        </div>
                                        {tool.count && (
                                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase">{tool.count}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
