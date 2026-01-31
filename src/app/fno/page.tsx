"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import {
    Activity, ArrowUpRight, ArrowDownRight, ArrowRight, ChevronRight,
    X, Bell, Lock, Code, Zap, BarChart3, TrendingUp, User, Target
} from 'lucide-react';
import Link from 'next/link';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';

// Simple Candlestick Visual Component
const CandlestickChart = ({ data }: { data: { open: number, close: number, high: number, low: number }[] }) => {
    return (
        <div className="flex items-end gap-1 h-12">
            {data.map((d, i) => {
                const isGreen = d.close >= d.open;
                const bodyHeight = Math.max(Math.abs(d.close - d.open), 2);
                const bodyBottom = Math.min(d.open, d.close);
                const wickHeight = d.high - d.low;

                return (
                    <div key={i} className="relative flex flex-col items-center w-1.5 h-full">
                        {/* Wick */}
                        <div
                            className={`absolute w-[1px] ${isGreen ? 'bg-emerald-500/50' : 'bg-red-500/50'}`}
                            style={{ height: `${wickHeight}%`, bottom: `${d.low}%` }}
                        />
                        {/* Body */}
                        <div
                            className={`absolute w-full rounded-sm ${isGreen ? 'bg-emerald-500' : 'bg-red-500'}`}
                            style={{ height: `${bodyHeight}%`, bottom: `${bodyBottom}%` }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default function FNOPage() {
    const [showMarketNotice, setShowMarketNotice] = useState(true);
    const [selectedTerminal, setSelectedTerminal] = useState<any>(null);

    const indices = [
        { name: 'NIFTY 50', value: '25,320.65', change: '-98.25', percent: '-0.39%' },
        { name: 'SENSEX', value: '82,269.78', change: '-296.59', percent: '-0.36%' },
        { name: 'BANKNIFTY', value: '52,610.45', change: '-347.40', percent: '-0.58%' },
    ];

    const topTraded = [
        { name: 'Vedanta', price: '681.55', change: '-84.80', percent: '-11.07%' },
        { name: 'Hindustan Zinc', price: '628.50', change: '-86.70', percent: '-12.12%' },
        { name: 'Ambuja Cement', price: '510.15', change: '-25.90', percent: '-4.83%' },
    ];

    const mockChartData = Array.from({ length: 12 }, () => ({
        open: Math.random() * 60 + 20,
        close: Math.random() * 60 + 20,
        high: 90,
        low: 10
    }));

    // High detail data for terminal
    const terminalData = Array.from({ length: 50 }, (_, i) => ({
        time: `${10 + Math.floor(i / 6)}:${(i % 6) * 10}`,
        open: 52000 + Math.random() * 1000,
        close: 52000 + Math.random() * 1000,
        high: 53500,
        low: 51500
    }));

    if (selectedTerminal) {
        return (
            <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col animate-in fade-in duration-300">
                {/* 1. Terminal Top Bar */}
                <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#050505]">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setSelectedTerminal(null)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-black tracking-tighter text-primary">TERMINAL</span>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <span className="text-sm font-bold">{selectedTerminal.name}</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2 ml-4">
                            {['1m', '5m', '15m', '1h', 'D'].map(t => (
                                <button key={t} className={`px-3 py-1 text-[10px] font-bold rounded-md ${t === '5m' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-gray-500 hover:bg-white/5'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                            <TrendingUp size={14} /> <span>Indicators</span>
                        </div>
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Bell size={18} /></button>
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><User size={18} /></button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* 2. Left Toolbar */}
                    <div className="w-12 border-r border-white/10 flex flex-col items-center py-4 gap-6 bg-[#050505]">
                        <div className="p-2 text-primary hover:bg-primary/10 rounded-lg cursor-pointer"><ArrowUpRight size={20} /></div>
                        <div className="p-2 text-gray-500 hover:bg-white/5 rounded-lg cursor-pointer"><Activity size={20} /></div>
                        <div className="p-2 text-gray-500 hover:bg-white/5 rounded-lg cursor-pointer"><Target size={20} /></div>
                        <div className="p-2 text-gray-500 hover:bg-white/5 rounded-lg cursor-pointer"><Lock size={20} /></div>
                    </div>

                    {/* 3. Main Chart Area */}
                    <div className="flex-1 relative bg-[#080808] p-4">
                        <div className="absolute top-4 left-6 z-10 flex gap-4 text-[10px] font-mono font-bold">
                            <span className="text-gray-500">O: <span className="text-white">52,610.45</span></span>
                            <span className="text-gray-500">H: <span className="text-white">53,120.20</span></span>
                            <span className="text-gray-500">L: <span className="text-white">52,400.15</span></span>
                            <span className="text-gray-500">C: <span className="text-white">52,650.00</span></span>
                        </div>
                        <div className="w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={terminalData}>
                                    <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                                    <Line type="stepAfter" dataKey="close" stroke="#10b981" strokeWidth={2} dot={false} />
                                    <Line type="stepAfter" dataKey="open" stroke="#ef4444" strokeWidth={1} dot={false} strokeDasharray="3 3 opacity-30" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 4. Right Sidebar: Option Chain */}
                    <div className="w-80 border-l border-white/10 flex flex-col bg-[#050505]">
                        <div className="h-12 border-b border-white/10 flex items-center justify-between px-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Option Chain</span>
                            <button className="text-[10px] font-bold text-primary flex items-center gap-1">24 Feb <ChevronRight size={12} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            <table className="w-full text-[10px] text-left">
                                <thead className="sticky top-0 bg-[#050505] z-10 border-b border-white/5">
                                    <tr className="text-gray-600 font-bold">
                                        <th className="py-3 px-4">Call Price</th>
                                        <th className="py-3 px-2 text-center">Strike</th>
                                        <th className="py-3 px-4 text-right">Put Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.02]">
                                    {[52000, 52100, 52200, 52300, 52400, 52500, 52600].map(strike => (
                                        <tr key={strike} className="hover:bg-white/5 transition-colors group">
                                            <td className="py-4 px-4">
                                                <p className="font-bold text-red-500">₹{(Math.random() * 200 + 100).toFixed(2)}</p>
                                                <p className="text-[8px] text-gray-600">OI: {(Math.random() * 100).toFixed(1)}k</p>
                                            </td>
                                            <td className="py-4 px-2 text-center">
                                                <span className="px-2 py-1 bg-white/5 rounded border border-white/10 font-bold text-gray-400 group-hover:text-primary transition-colors">{strike}</span>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <p className="font-bold text-emerald-500">₹{(Math.random() * 200 + 100).toFixed(2)}</p>
                                                <p className="text-[8px] text-gray-600">OI: {(Math.random() * 100).toFixed(1)}k</p>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-primary/5 border-y border-primary/20">
                                        <td colSpan={3} className="py-1 text-center text-[8px] font-bold text-primary uppercase tracking-widest">At the Money (ATM)</td>
                                    </tr>
                                    {[52700, 52800, 52900, 53000].map(strike => (
                                        <tr key={strike} className="hover:bg-white/5 transition-colors group">
                                            <td className="py-4 px-4">
                                                <p className="font-bold text-red-500">₹{(Math.random() * 200 + 100).toFixed(2)}</p>
                                            </td>
                                            <td className="py-4 px-2 text-center">
                                                <span className="px-2 py-1 bg-white/5 rounded border border-white/10 font-bold text-gray-400 transition-colors">{strike}</span>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <p className="font-bold text-emerald-500">₹{(Math.random() * 200 + 100).toFixed(2)}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-primary/10 border-t border-primary/20">
                            <button className="w-full py-2.5 bg-primary text-white text-[10px] font-black rounded-xl shadow-lg shadow-primary/20 uppercase tracking-tighter">Place Market Order</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pb-20 bg-[#050505] text-white">
            <Navbar />

            {/* 1. Market Ticker (Reused from Portfolio style) */}
            <div className="pt-16 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-16 z-30">
                <div className="w-full px-4 md:px-12 h-14 flex items-center gap-10 overflow-x-auto no-scrollbar text-xs font-bold">
                    <div className="flex items-center gap-3 shrink-0 border-r border-white/5 pr-10">
                        <span className="text-gray-400">NIFTY 50</span>
                        <span>25,320.65</span>
                        <span className="text-red-400">-98.25 (0.39%)</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 border-r border-white/5 pr-10">
                        <span className="text-gray-400">SENSEX</span>
                        <span>82,269.78</span>
                        <span className="text-red-400">-296.59 (0.36%)</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 border-r border-white/5 pr-10">
                        <span className="text-gray-400">BANKNIFTY</span>
                        <span>52,610.45</span>
                        <span className="text-red-400">-347.40 (0.58%)</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 border-r border-white/5 pr-10 text-[10px]">
                        <span className="p-1 bg-white/5 rounded"><Activity size={14} /></span>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-12 w-full max-w-[1600px] mx-auto pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Content Area */}
                    <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* Market Open Notice */}
                        {showMarketNotice && (
                            <div className="p-10 rounded-[40px] bg-secondary/20 border border-white/5 relative group flex items-center justify-between overflow-hidden">
                                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                                <div className="flex items-start gap-6 relative z-10">
                                    <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-xl">
                                        <Bell size={32} className="animate-bounce" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold mb-2">Market will be open on 1 Feb (Sunday)</h2>
                                        <p className="text-sm text-gray-400 max-w-md">Equity F&O: 9:15 AM to 3:30 PM. Commodities: 9:00 AM to 5:00 PM on account of Budget 2026.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowMarketNotice(false)}
                                    className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all relative z-10"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}

                        {/* Top Traded Section */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black tracking-tight">Top traded</h3>
                                <div className="flex gap-4">
                                    <button className="px-6 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20">Equity</button>
                                    <button className="px-6 py-2 rounded-full bg-white/5 text-gray-400 text-xs font-bold hover:bg-white/10 transition-all">Commodities</button>
                                    <button className="ml-4 text-xs font-bold text-primary hover:underline flex items-center gap-1">See more <ChevronRight size={14} /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Index Cards */}
                                {indices.map((idx, i) => (
                                    <div key={i} onClick={() => setSelectedTerminal(idx)} className="p-6 rounded-[32px] bg-secondary/20 border border-white/5 hover:border-primary/30 transition-all group cursor-pointer">
                                        <div className="flex justify-between items-start mb-6">
                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{idx.name}</p>
                                            <div className="p-2 rounded-lg bg-white/5 text-gray-500 group-hover:text-primary transition-colors">
                                                <TrendingUp size={16} />
                                            </div>
                                        </div>
                                        <CandlestickChart data={mockChartData} />
                                        <div className="mt-6 flex justify-between items-end">
                                            <div>
                                                <p className="text-xl font-bold font-mono">{idx.value}</p>
                                                <p className="text-xs font-bold text-red-400">{idx.change} ({idx.percent})</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-500 group-hover:bg-primary group-hover:text-white transition-all">
                                                <ArrowRight />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Stock Cards */}
                                {topTraded.map((stk, i) => (
                                    <div key={i} onClick={() => setSelectedTerminal(stk)} className="p-6 rounded-[32px] bg-[#0a0a0a] border border-white/5 hover:border-red-500/30 transition-all group cursor-pointer">
                                        <div className="flex justify-between items-start mb-6">
                                            <p className="text-sm font-bold text-gray-400">{stk.name}</p>
                                            <div className="p-2 rounded-lg bg-white/5 text-gray-500">
                                                <Zap size={16} />
                                            </div>
                                        </div>
                                        <div className="flex items-end gap-1 h-12 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                            {/* Reversed chart trend for red stocks */}
                                            <CandlestickChart data={Array.from({ length: 12 }, () => ({ open: 80, close: 20, high: 90, low: 10 }))} />
                                        </div>
                                        <div className="mt-6 flex justify-between items-end">
                                            <div>
                                                <p className="text-xl font-bold font-mono">₹{stk.price}</p>
                                                <p className="text-xs font-bold text-red-500">{stk.change} ({stk.percent})</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-500">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar Area */}
                    <div className="lg:col-span-4 space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">

                        {/* Unlock F&O CTA */}
                        <div className="p-10 rounded-[48px] bg-gradient-to-b from-[#12121a] to-[#050505] border border-white/10 text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_rgba(34,197,94,0.3)]" />

                            <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform duration-500 relative">
                                <div className="absolute inset-0 rounded-full animate-ping bg-primary/5" />
                                <Lock size={40} className="text-primary" />
                            </div>

                            <h3 className="text-2xl font-black mb-3">Unlock Futures & Options</h3>
                            <p className="text-gray-500 text-sm mb-10 max-w-xs mx-auto">Start trading indices and stock derivatives with low latency execution.</p>

                            <button className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <Zap size={18} fill="currentColor" />
                                PROCEED TO UNLOCK
                            </button>
                        </div>

                        {/* Products & Tools */}
                        <div className="p-8 rounded-[40px] bg-secondary/10 border border-white/5">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-8 px-2">Products & tools</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-5 rounded-[24px] bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-background border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                                            <Code size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold">WealthWise API</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Trading Integration</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg">NEW</span>
                                </div>

                                <div className="flex items-center justify-between p-5 rounded-[24px] bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-background border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-accent transition-colors">
                                            <BarChart3 size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold">Option Chain</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Real-time OI data</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Market Sentiment */}
                        <div className="p-8 rounded-[40px] bg-[#0a0a0a] border border-white/5">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-6 px-2">Market Sentiment</h3>
                            <div className="flex items-center gap-2 h-2 rounded-full overflow-hidden bg-white/5 mb-4">
                                <div className="h-full bg-emerald-500" style={{ width: '65%' }} />
                                <div className="h-full bg-red-500" style={{ width: '35%' }} />
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest px-1">
                                <span className="text-emerald-500">Bullish 65%</span>
                                <span className="text-red-500">Bearish 35%</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}

