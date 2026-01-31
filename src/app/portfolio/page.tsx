"use client";

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { Briefcase, TrendingUp, ArrowUpRight, ArrowDownRight, ArrowRight, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function PortfolioPage() {
    const [portfolio, setPortfolio] = useState<any[]>([]);
    const [marketData, setMarketData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
        if (marketData.length === 0 || isLoading) return;

        const fetchRealPrices = async () => {
            const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY;
            if (!apiKey) {
                console.warn('Alpha Vantage API key is missing');
                return;
            }
            const updatedMarketData = [...marketData];
            let changed = false;

            for (const stock of updatedMarketData) {
                try {
                    // Alpha Vantage symbols for Indian stocks usually need .BSE or .NSE
                    const symbol = `${stock.ticker}.BSE`;
                    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);
                    const data = await response.json();

                    if (data['Global Quote'] && data['Global Quote']['05. price']) {
                        const newPrice = parseFloat(data['Global Quote']['05. price']);
                        if (newPrice !== stock.price) {
                            stock.price = newPrice;
                            changed = true;
                        }
                    }
                    // Rate limiting: Free tier allows limited requests per minute
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (e) {
                    console.error(`Failed to fetch price for ${stock.ticker}`, e);
                }
            }

            if (changed) {
                setMarketData(updatedMarketData);
                localStorage.setItem('carbon_market_data', JSON.stringify(updatedMarketData));
            }
        };

        fetchRealPrices();
        const interval = setInterval(fetchRealPrices, 60000); // Update every 1 minute

        return () => clearInterval(interval);
    }, [isLoading]);

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
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);
    };

    return (
        <main className="min-h-screen pb-20 bg-background text-white">
            <Navbar />

            <div className="pt-32 px-6 container mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-6">
                            <h1 className="text-4xl font-bold flex items-center gap-3">
                                <Briefcase className="text-primary" size={32} />
                                My Portfolio
                            </h1>
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit mb-1 animate-pulse">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live Market Data</span>
                            </div>
                        </div>
                    </div>
                    {/* Add more button? */}
                </div>

                {!isLoading && portfolio.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-secondary/30 rounded-3xl border border-white/5 animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Wallet className="text-gray-500" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Your Portfolio is Empty</h2>
                        <p className="text-gray-400 mb-8 max-w-md">
                            It looks like you haven't made any investments yet.
                            Start by analyzing your finances to get personalized stock recommendations.
                        </p>
                        <Link href="/#analyze" className="px-8 py-4 bg-primary hover:bg-primary/90 rounded-xl font-bold text-white flex items-center gap-2 transition-all">
                            Start Analysis <ArrowRight size={20} />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="p-6 rounded-2xl bg-secondary/30 border border-white/5 backdrop-blur-sm">
                                <p className="text-sm text-gray-400 mb-1">Total Invested</p>
                                <p className="text-3xl font-bold">{formatCurrency(portfolioStats.totalInvested)}</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-secondary/30 border border-white/5 backdrop-blur-sm">
                                <p className="text-sm text-gray-400 mb-1">Current Value</p>
                                <p className="text-3xl font-bold text-white">{formatCurrency(portfolioStats.totalCurrentValue)}</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-secondary/30 border border-white/5 backdrop-blur-sm">
                                <p className="text-sm text-gray-400 mb-1">Total P/L</p>
                                <div className={`flex items-baseline gap-2 text-3xl font-bold ${portfolioStats.totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {portfolioStats.totalPL >= 0 ? '+' : ''}{formatCurrency(portfolioStats.totalPL)}
                                    <span className="text-sm font-medium opacity-80">
                                        ({portfolioStats.totalPLPercent.toFixed(2)}%)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Holdings Table */}
                        <div className="bg-secondary/30 border border-white/5 rounded-3xl overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 text-gray-400 text-sm">
                                            <th className="py-4 px-6 font-medium">Stock</th>
                                            <th className="py-4 px-6 font-medium">Buy Price</th>
                                            <th className="py-4 px-6 font-medium">Qty</th>
                                            <th className="py-4 px-6 font-medium">Invested</th>
                                            <th className="py-4 px-6 font-medium">Current Value</th>
                                            <th className="py-4 px-6 font-medium">P/L</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {portfolio.map((item: any, idx: number) => {
                                            const currentPrice = marketData.find((s: any) => s.ticker === item.ticker)?.price || item.price;
                                            const currentValue = currentPrice * item.quantity;
                                            const invested = item.buyPrice * item.quantity;
                                            const pl = currentValue - invested;
                                            const plPercent = (pl / invested) * 100;

                                            return (
                                                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                                    <td className="py-4 px-6">
                                                        <div className="font-bold text-white group-hover:text-primary transition-colors">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 font-mono mt-0.5">{item.ticker}</div>
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-300 font-mono">₹{item.buyPrice}</td>
                                                    <td className="py-4 px-6 text-white font-medium">{item.quantity}</td>
                                                    <td className="py-4 px-6 text-gray-300 font-mono">₹{invested}</td>
                                                    <td className="py-4 px-6 text-white font-bold font-mono">₹{currentValue}</td>
                                                    <td className="py-4 px-6">
                                                        <div className={`flex items-center gap-1 font-bold ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                            {pl >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                                            <span>{pl >= 0 ? '+' : ''}₹{pl}</span>
                                                        </div>
                                                        <div className={`text-xs ${pl >= 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
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

                        <div className="mt-8 text-center">
                            <Link href="/#analyze" className="text-sm text-gray-500 hover:text-primary transition-colors underline decoration-dotted">
                                Add more stocks from analysis tool
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
