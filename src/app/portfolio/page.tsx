"use client";

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import {
    Briefcase, TrendingUp, ArrowUpRight, ArrowDownRight,
    ArrowRight, Wallet, BarChart3, PieChart, Activity,
    Shield, Target, ChevronRight, Zap, Flame, Trophy, Clock
} from 'lucide-react';
import Link from 'next/link';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';

export default function PortfolioPage() {
    const [activeTab, setActiveTab] = useState('explore');
    const [portfolio, setPortfolio] = useState<any[]>([]);
    const [marketData, setMarketData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mock Indices for the ticker bar
    const indices = [
        { name: 'NIFTY 50', value: '25,320.65', change: '-98.25', percent: '-0.39%' },
        { name: 'SENSEX', value: '82,269.78', change: '-296.59', percent: '-0.36%' },
        { name: 'BANKNIFTY', value: '52,610.45', change: '+347.40', percent: '+0.58%' },
        { name: 'FINNIFTY', value: '23,130.85', change: '+12.30', percent: '+0.05%' },
    ];

    const [isLive, setIsLive] = useState(false);

    const marketMovers = [
        { ticker: 'RELIANCE', name: 'Reliance Industries', price: 2950.40, change: '+44.50', percent: '+3.46%', volume: '52,92,100', sparkData: [{ v: 20 }, { v: 25 }, { v: 22 }, { v: 30 }, { v: 28 }, { v: 35 }] },
        { ticker: 'HDFCBANK', name: 'HDFC Bank', price: 1650.80, change: '-12.20', percent: '-0.74%', volume: '25,55,905', sparkData: [{ v: 40 }, { v: 38 }, { v: 39 }, { v: 35 }, { v: 36 }, { v: 32 }] },
        { ticker: 'INFY', name: 'Infosys', price: 1550.60, change: '+32.20', percent: '+2.42%', volume: '18,03,157', sparkData: [{ v: 10 }, { v: 12 }, { v: 11 }, { v: 15 }, { v: 14 }, { v: 18 }] },
        { ticker: 'TATAMOTORS', name: 'Tata Motors', price: 980.50, change: '+25.70', percent: '+2.41%', volume: '25,70,414', sparkData: [{ v: 50 }, { v: 55 }, { v: 52 }, { v: 58 }, { v: 54 }, { v: 60 }] },
        { ticker: 'ICICIBANK', name: 'ICICI Bank', price: 1050.50, change: '-15.40', percent: '-1.45%', volume: '42,81,100', sparkData: [{ v: 30 }, { v: 28 }, { v: 29 }, { v: 25 }, { v: 26 }, { v: 22 }] },
    ];

    const sidebarTools = [
        { name: 'Intraday Screener', icon: <Activity size={18} className="text-primary" /> },
        { name: 'Stocks SIP', icon: <TrendingUp size={18} className="text-emerald-400" /> },
        { name: 'IPO Center', icon: <Flame size={18} className="text-orange-400" /> },
        { name: 'Events Calendar', icon: <Clock size={18} className="text-blue-400" /> },
    ];

    useEffect(() => {
        const saved = localStorage.getItem('carbon_portfolio');
        const market = localStorage.getItem('carbon_market_data');
        if (saved) {
            try { setPortfolio(JSON.parse(saved)); } catch (e) { console.error('Failed to load portfolio', e); }
        }
        if (market) {
            try { setMarketData(JSON.parse(market)); } catch (e) { console.error('Failed to load market data', e); }
        }
        setIsLoading(false);
    }, []);

    // REAL-TIME PRICE FETCHING (Alpha Vantage)
    useEffect(() => {
        const fetchRealPrices = async () => {
            if (activeTab !== 'explore' && portfolio.length === 0) return;

            setIsLive(true);
            const targets = activeTab === 'explore'
                ? marketMovers.map(m => m.ticker)
                : portfolio.map(p => p.ticker);

            // To save API credits, we only fetch top 3 if in explore
            const limitedTargets = targets.slice(0, 3);

            for (const ticker of limitedTargets) {
                try {
                    const response = await fetch(`/api/stocks/quote?ticker=${ticker}`);
                    const data = await response.json();

                    if (data.price) {
                        setMarketData(prev => {
                            const exists = prev.find(s => s.ticker === ticker);
                            if (exists) {
                                return prev.map(s => s.ticker === ticker ? { ...s, price: data.price } : s);
                            }
                            return [...prev, { ticker, price: data.price }];
                        });
                    }
                } catch (e) {
                    console.error(`Failed to fetch price for ${ticker}`, e);
                }
                // Minor delay to respect API limits
                await new Promise(r => setTimeout(r, 2000));
            }
            setIsLive(false);
        };

        fetchRealPrices();
        const interval = setInterval(fetchRealPrices, 300000); // Update every 5 minutes (save credits)

        return () => clearInterval(interval);
    }, [activeTab, portfolio]);

    // MICRO-SIMULATION (For "Alive" feel between API refreshes)
    useEffect(() => {
        if (marketData.length === 0) return;

        const interval = setInterval(() => {
            setMarketData(prev => prev.map(stock => {
                const change = 1 + (Math.random() * 0.002 - 0.001); // Very subtle +/- 0.1%
                return {
                    ...stock,
                    price: Math.round(stock.price * change * 100) / 100
                };
            }));
        }, 10000); // Every 10 seconds

        return () => clearInterval(interval);
    }, [marketData.length]);


    const portfolioStats = useMemo(() => {
        let totalInvested = 0;
        let totalCurrentValue = 0;

        portfolio.forEach(item => {
            const currentPrice = marketData.find((s: any) => s.ticker === item.ticker)?.price || item.price;
            totalInvested += item.buyPrice * item.quantity;
            totalCurrentValue += currentPrice * item.quantity;
        });

        const totalPL = totalCurrentValue - totalInvested;
        const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

        return { totalInvested, totalCurrentValue, totalPL, totalPLPercent };
    }, [portfolio, marketData]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <main className="min-h-screen pb-20 bg-[#050505] text-white">
            <Navbar />

            {/* 1. Market Ticker Bar */}
            <div className="pt-16 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-16 z-30">
                <div className="w-full px-4 md:px-12 h-14 flex items-center gap-10 overflow-x-auto no-scrollbar">
                    {indices.map((idx, i) => (
                        <div key={i} className="flex items-center gap-3 shrink-0 py-2 border-r border-white/5 pr-10 last:border-0">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{idx.name}</span>
                            <span className="text-sm font-mono font-bold">{idx.value}</span>
                            <span className={`text-[10px] font-bold ${idx.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                {idx.change} ({idx.percent})
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-4 md:px-12 w-full max-w-[1600px] mx-auto pt-6">

                {/* 2. Sub-Navigation Tabs */}
                <div className="flex items-center gap-8 mb-8 border-b border-white/5 sticky top-[7.5rem] bg-[#050505] z-20 pb-1">
                    {['Explore', 'Holdings', 'Watchlist', 'Positions', 'Orders'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`pb-3 text-sm font-bold transition-all relative ${activeTab === tab.toLowerCase() ? 'text-primary' : 'text-gray-500 hover:text-white'}`}
                        >
                            {tab}
                            {activeTab === tab.toLowerCase() && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary animate-in fade-in slide-in-from-bottom-1" />}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {activeTab === 'explore' ? (
                            <div className="space-y-12">
                                {/* Top Market Movers */}
                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <Zap size={20} className="text-primary fill-primary" />
                                            Top market movers
                                            {isLive && (
                                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[8px] font-black text-primary animate-pulse ml-2 uppercase">
                                                    <div className="w-1 h-1 rounded-full bg-primary" />
                                                    Price Live
                                                </span>
                                            )}
                                        </h2>
                                        <div className="flex gap-2">
                                            {['Gainers', 'Losers', 'Volume'].map(f => (
                                                <button key={f} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:border-white/20 transition-all">{f}</button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-secondary/20 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-white/5 text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                                                    <th className="py-4 px-6">Company</th>
                                                    <th className="py-4 px-6 text-center">Trend (1D)</th>
                                                    <th className="py-4 px-6 text-right">Market Price</th>
                                                    <th className="py-4 px-6 text-right">Volume</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {marketMovers.map((stock, i) => (
                                                    <tr key={i} className="hover:bg-white/5 transition-all group cursor-pointer">
                                                        <td className="py-5 px-6">
                                                            <p className="font-bold text-white group-hover:text-primary transition-colors text-sm">{stock.name}</p>
                                                        </td>
                                                        <td className="py-5 px-6 min-w-[120px]">
                                                            <div className="h-8 w-full">
                                                                <ResponsiveContainer width="100%" height="100%">
                                                                    <LineChart data={stock.sparkData}>
                                                                        <Line
                                                                            type="monotone"
                                                                            dataKey="v"
                                                                            stroke={stock.change.startsWith('+') ? '#10b981' : '#ef4444'}
                                                                            strokeWidth={2}
                                                                            dot={false}
                                                                        />
                                                                        <YAxis hide domain={['dataMin', 'dataMax']} />
                                                                    </LineChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-6 text-right">
                                                            <p className="text-sm font-bold font-mono text-white">
                                                                ₹{marketData.find(s => s.ticker === stock.ticker)?.price?.toLocaleString('en-IN') || stock.price.toLocaleString('en-IN')}
                                                            </p>
                                                            <p className={`text-[10px] font-bold ${stock.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                                                {stock.change} ({stock.percent})
                                                            </p>
                                                        </td>
                                                        <td className="py-5 px-6 text-right text-xs text-gray-500 font-mono">
                                                            {stock.volume}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <button className="w-full py-4 text-xs font-bold text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1 bg-white/[0.02]">
                                            See more <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </section>

                                {/* Most traded stocks cards */}
                                <section>
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Trophy size={20} className="text-accent fill-accent" />
                                        Most traded stocks in MTF
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {portfolio.length > 0 ? portfolio.map((s, i) => (
                                            <div key={i} className="p-6 rounded-2xl bg-secondary/20 border border-white/5 hover:border-primary/30 transition-all group">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                                                    <span className="font-black text-xs text-gray-500 group-hover:text-primary">{s.ticker.substring(0, 2)}</span>
                                                </div>
                                                <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{s.name}</p>
                                                <div className="mt-4">
                                                    <p className="text-lg font-bold font-mono">₹{s.buyPrice}</p>
                                                    <p className="text-[10px] font-bold text-green-400">+12.45 (2.3%)</p>
                                                </div>
                                            </div>
                                        )) : (
                                            [1, 2, 3, 4].map(i => (
                                                <div key={i} className="p-6 rounded-2xl bg-secondary/20 border border-white/5 animate-pulse">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 mb-4" />
                                                    <div className="h-4 w-2/3 bg-white/5 rounded mb-4" />
                                                    <div className="h-6 w-1/2 bg-white/5 rounded" />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </section>
                            </div>
                        ) : activeTab === 'holdings' ? (
                            <div className="space-y-8">
                                {/* Current Stats for Holdings */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#12121a] to-[#0a0a0a] border border-white/5 shadow-xl">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Invested</p>
                                        <p className="text-3xl font-black">{formatCurrency(portfolioStats.totalInvested)}</p>
                                    </div>
                                    <div className="p-8 rounded-[32px] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 shadow-xl">
                                        <p className="text-xs font-bold text-primary/70 uppercase tracking-widest mb-1">Current Value</p>
                                        <p className="text-3xl font-black text-white">{formatCurrency(portfolioStats.totalCurrentValue)}</p>
                                    </div>
                                    <div className="p-8 rounded-[32px] bg-secondary/20 border border-white/5 shadow-xl">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total P/L</p>
                                        <div className={`flex items-baseline gap-2 text-3xl font-black ${portfolioStats.totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {portfolioStats.totalPL >= 0 ? '+' : ''}{formatCurrency(portfolioStats.totalPL)}
                                            <span className="text-sm font-bold opacity-80 decoration-none">
                                                ({portfolioStats.totalPLPercent.toFixed(2)}%)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-secondary/20 border border-white/5 rounded-[32px] overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-white/5 text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                                                <th className="py-4 px-8">Stock</th>
                                                <th className="py-4 px-6">Buy Price</th>
                                                <th className="py-4 px-6">Qty</th>
                                                <th className="py-4 px-6">Invested</th>
                                                <th className="py-4 px-6 text-right">P/L</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {portfolio.map((item, idx) => {
                                                const currentPrice = marketData.find((s: any) => s.ticker === item.ticker)?.price || item.price;
                                                const currentValue = currentPrice * item.quantity;
                                                const invested = item.buyPrice * item.quantity;
                                                const pl = currentValue - invested;
                                                const plPercent = (pl / invested) * 100;

                                                return (
                                                    <tr key={idx} className="hover:bg-white/5 transition-all group">
                                                        <td className="py-6 px-8">
                                                            <p className="font-bold text-white group-hover:text-primary transition-colors">{item.name}</p>
                                                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{item.ticker}</p>
                                                        </td>
                                                        <td className="py-6 px-6 text-sm font-mono text-gray-400">₹{item.buyPrice}</td>
                                                        <td className="py-6 px-6 text-sm font-bold text-gray-300">{item.quantity}</td>
                                                        <td className="py-6 px-6 text-sm font-mono text-gray-400">₹{invested}</td>
                                                        <td className="py-6 px-6 text-right">
                                                            <div className={`flex items-center justify-end gap-1 font-bold ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                                {pl >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                                                <span>{pl >= 0 ? '+' : ''}₹{formatCurrency(pl)}</span>
                                                            </div>
                                                            <div className={`text-[10px] font-bold ${pl >= 0 ? 'text-green-400/60' : 'text-red-400/60'}`}>
                                                                {plPercent.toFixed(2)}%
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-20 text-center bg-secondary/10 rounded-[40px] border border-dashed border-white/10">
                                <Activity className="text-gray-600 mb-6" size={60} />
                                <h2 className="text-xl font-bold mb-2">No activity in {activeTab}</h2>
                                <p className="text-gray-500 max-w-sm">This section is currently under development to provide live trading simulations.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">

                        {/* Products & Tools */}
                        <div className="p-8 rounded-[40px] bg-secondary/20 border border-white/5">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Products & Tools</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {sidebarTools.map((tool, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                {tool.icon}
                                            </div>
                                            <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{tool.name}</span>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-600 group-hover:text-primary transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trading Screens / Strategies */}
                        <div className="p-8 rounded-[40px] bg-gradient-to-br from-[#12121a] to-transparent border border-white/5">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Trading Screens</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/10 hover:border-emerald-500/30 transition-all">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Bullish</span>
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    </div>
                                    <h4 className="text-sm font-bold mb-1">Resistance Breakouts</h4>
                                    <p className="text-[10px] text-gray-500">8 Stocks crossing 52-week highs.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-red-500/10 hover:border-red-500/30 transition-all">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-red-500 uppercase">Bearish</span>
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                    </div>
                                    <h4 className="text-sm font-bold mb-1">RSI Overbought</h4>
                                    <p className="text-[10px] text-gray-500">12 stocks with RSI &gt; 70.</p>
                                </div>
                            </div>
                        </div>

                        {/* Promotion / Action */}
                        <div className="p-8 rounded-[40px] bg-primary relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 transition-transform">
                                <BarChart3 size={120} />
                            </div>
                            <h3 className="text-xl font-black mb-2 relative z-10">Start Your SIP</h3>
                            <p className="text-sm text-white/80 mb-6 relative z-10">Consistency is key to long-term wealth. Build your future today.</p>
                            <Link href="/analyze" className="px-6 py-3 bg-white text-primary rounded-xl font-bold text-sm inline-flex items-center gap-2 hover:shadow-xl transition-all relative z-10">
                                Explore <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
