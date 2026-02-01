import { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area, ComposedChart
} from 'recharts';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Download, X, Briefcase, Plus, Star } from 'lucide-react';

interface DashboardProps {
    data: any;
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#10b981', '#fbbf24'];

export default function Dashboard({ data }: DashboardProps) {
    const [selectedStock, setSelectedStock] = useState<any>(null);
    const [portfolio, setPortfolio] = useState<any[]>([]);
    const [buyModal, setBuyModal] = useState({ isOpen: false, stock: null as any, quantity: 1 });
    const [notification, setNotification] = useState<{ isOpen: boolean; message: string } | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('carbon_portfolio');
        if (saved) {
            try { setPortfolio(JSON.parse(saved)); } catch (e) { console.error('Failed to load portfolio', e); }
        }
    }, []);

    // Save market data for Portfolio page
    useEffect(() => {
        if (data?.stockRecommendations) {
            localStorage.setItem('carbon_market_data', JSON.stringify(data.stockRecommendations));
        }
    }, [data]);

    const handleBuy = () => {
        if (!buyModal.stock) return;
        const newItem = {
            ...buyModal.stock,
            quantity: buyModal.quantity,
            buyPrice: buyModal.stock.price,
            buyDate: new Date().toISOString()
        };
        const updated = [...portfolio, newItem];
        setPortfolio(updated);
        localStorage.setItem('carbon_portfolio', JSON.stringify(updated));
        setBuyModal({ isOpen: false, stock: null, quantity: 1 });
        setNotification({
            isOpen: true,
            message: `Successfully bought ${buyModal.quantity} shares of ${buyModal.stock.ticker}. View in your Portfolio.`
        });

        // Auto hide after 5 seconds
        setTimeout(() => setNotification(null), 5000);
    };

    const [activeTab, setActiveTab] = useState('overview');

    if (!data) return null;

    const {
        budgetPlan,
        insuranceRecommendation,
        investmentPortfolio,
        stockRecommendations,
        charts,
        goalPlanning,
        nextActions
    } = data;

    // Combine history and future for the chart
    const getStockChartData = (stock: any) => {
        if (!stock || !stock.forecast) return [];
        const historyData = stock.forecast.history.map((d: any) => ({ ...d, type: 'History' }));
        const futureData = stock.forecast.future.map((d: any) => ({ ...d, type: 'Forecast' }));
        return [...historyData, ...futureData];
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <Star size={18} /> },
        { id: 'investments', label: 'Investments', icon: <TrendingUp size={18} /> },
        { id: 'protection', label: 'Protection', icon: <Shield size={18} /> },
        { id: 'roadmap', label: 'Roadmap', icon: <Briefcase size={18} /> },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">

            {/* Sticky Sub-Navbar */}
            <div className="sticky top-16 z-40 py-4 bg-background/50 backdrop-blur-xl border-b border-white/5 -mx-4 md:-mx-12 px-4 md:px-12 mb-8">
                <div className="flex items-center gap-1 md:gap-4 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Premium Success Notification */}
            {notification && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in zoom-in duration-300">
                    <div className="bg-[#1a1a25]/90 border border-emerald-500/30 rounded-2xl p-4 pr-6 flex items-center gap-4 shadow-2xl backdrop-blur-xl">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            <CheckCircle size={24} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-white font-bold text-sm">Purchase Successful</h4>
                            <p className="text-gray-400 text-xs">{notification.message}</p>
                        </div>
                        <button
                            onClick={() => setNotification(null)}
                            className="ml-4 p-1 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Stock Forecast Modal */}
            {selectedStock && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1a1a25] border border-white/10 rounded-3xl w-full max-w-3xl p-6 shadow-2xl relative">
                        <button
                            onClick={() => setSelectedStock(null)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>

                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                    {selectedStock.name}
                                    <span className="text-sm font-normal text-gray-400">({selectedStock.ticker})</span>
                                </h3>
                                <p className="text-gray-400 text-sm mt-1">{selectedStock.sector}</p>
                            </div>
                            <div className="text-right">
                                {selectedStock.forecast ? (
                                    <>
                                        <p className="text-3xl font-bold text-primary">₹{selectedStock.forecast.projectedPrice5Y}</p>
                                        <p className="text-xs text-green-400">+ {selectedStock.forecast.potentialReturn}% in 5 Years</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-3xl font-bold text-gray-500">N/A</p>
                                        <p className="text-xs text-gray-500">Forecast Unavailable</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="h-[350px] w-full bg-black/20 rounded-xl p-4 border border-white/5">
                            <ResponsiveContainer width="100%" height="100%">
                                {selectedStock.forecast ? (
                                    <ComposedChart data={getStockChartData(selectedStock)}>
                                        <defs>
                                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="year" stroke="#666" tick={{ fill: '#888' }} />
                                        <YAxis stroke="#666" tick={{ fill: '#888' }} domain={['auto', 'auto']} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a1a25', borderRadius: '8px', border: '1px solid #333' }}
                                            labelStyle={{ color: '#888' }}
                                        />
                                        <Legend />
                                        <Area type="monotone" dataKey="price" stroke="#6366f1" fillOpacity={1} fill="url(#colorPrice)" />
                                        <Line type="monotone" dataKey="price" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} />
                                    </ComposedChart>
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-500 text-sm">
                                        Forecast data unavailable. Please re-run analysis.
                                    </div>
                                )}
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-sm text-yellow-500/80 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                            <AlertTriangle size={16} />
                            <p>Forecast based on historical CAGR & volatility models. Not a guarantee of future returns.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Buy Stock Modal */}
            {buyModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1a1a25] border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
                        <button
                            onClick={() => setBuyModal({ ...buyModal, isOpen: false })}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>

                        <h3 className="text-2xl font-bold mb-1">Buy {buyModal.stock?.ticker}</h3>
                        <p className="text-gray-400 text-sm mb-6">{buyModal.stock?.name} • ₹{buyModal.stock?.price}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={buyModal.quantity}
                                    onChange={(e) => setBuyModal({ ...buyModal, quantity: parseInt(e.target.value) || 1 })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-xl font-bold focus:outline-none focus:border-primary/50"
                                />
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                                <span className="text-gray-400">Total Investment</span>
                                <span className="text-xl font-bold text-primary">₹{(buyModal.stock?.price || 0) * buyModal.quantity}</span>
                            </div>

                            <button
                                onClick={handleBuy}
                                className="w-full py-4 bg-primary hover:bg-primary/90 rounded-xl font-bold text-white transition-all mt-4"
                            >
                                Confirm Purchase
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 p-8 rounded-[40px] bg-gradient-to-br from-[#1a1a25] to-[#12121a] border border-white/10 shadow-2xl relative flex flex-col items-center justify-center text-center overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
                            <div className="relative w-48 h-48 mb-6">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={553} strokeDashoffset={553 - (553 * (data.scoreCard?.totalScore || 0)) / 100} className="text-primary transition-all duration-1000 ease-out" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-6xl font-black text-white">{data.scoreCard?.totalScore || 0}</span>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Health Score</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold">Status: {data.scoreCard?.totalScore > 80 ? 'Excellent' : data.scoreCard?.totalScore > 60 ? 'Good' : 'Needs Attention'}</h3>
                                <p className="text-sm text-gray-400">Mode {data.scoreCard?.mode}: {data.scoreCard?.mode === 'A' ? 'Active Investor' : 'New Journey'}</p>
                            </div>
                        </div>

                        <div className="lg:col-span-2 p-8 rounded-[40px] bg-secondary/30 border border-white/5 shadow-xl">
                            <h3 className="text-xl font-bold mb-8">Score Breakdown</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {Object.entries(data.scoreCard?.breakdown || {}).map(([key, val]: any) => (
                                    <div key={key} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="capitalize text-gray-400">{key}</span>
                                            <span className="font-bold text-white">{val}/20</span>
                                        </div>
                                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${(val / 20) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                    <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">Key Strengths</h4>
                                    <ul className="space-y-1">
                                        {data.analysis?.strengths?.map((s: string, i: number) => (
                                            <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>{s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                                    <h4 className="text-xs font-bold text-red-400 uppercase mb-2">Priority Actions</h4>
                                    <ul className="space-y-1">
                                        {data.analysis?.priorityActions?.map((a: string, i: number) => (
                                            <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>{a}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 p-8 rounded-[32px] bg-gradient-to-br from-primary/10 to-transparent border border-white/10 shadow-2xl relative overflow-hidden text-left">
                            <h2 className="text-3xl font-bold mb-2">Family-First Strategy</h2>
                            <p className="text-gray-400 mb-8">Personalized allocation based on your dependents and stable surplus.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    {data.recommended_allocations?.map((alloc: any, idx: number) => (
                                        <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-white group-hover:text-primary transition-colors">{alloc.type}</span>
                                                <span className="font-mono font-bold text-primary">₹{alloc.amount}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 leading-relaxed">{alloc.reason}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-6">
                                    <div className="p-6 rounded-2xl bg-primary shadow-xl shadow-primary/20">
                                        <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Eligible for Investment</p>
                                        <p className="text-4xl font-black text-white">₹{data.eligible_investment_amount}</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                        <h4 className="text-sm font-bold mb-3 flex items-center gap-2"><Shield size={16} className="text-accent" />Why not 100% Stocks?</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">{data.why_not_full_stock_investment}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 rounded-[32px] bg-secondary/30 border border-white/5 flex flex-col justify-center text-center">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"><Star className="text-primary" size={32} fill="currentColor" /></div>
                            <h3 className="text-2xl font-bold mb-2">WealthWiseAI Pro Advice</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8">"Invest only what you can afford to lose — after your family is financially secure."</p>
                            <div className="pt-6 border-t border-white/5">
                                <span className="text-xs font-bold text-gray-500 uppercase">Strategy Type</span>
                                <p className="text-xl font-bold text-white mt-1 capitalize">{data.investment_strategy}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Investments Tab */}
            {activeTab === 'investments' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    {data.scoreCard?.mode === 'A' && data.analysis?.portfolioInsights && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
                            <div className="p-8 rounded-[40px] bg-emerald-500/5 border border-emerald-500/10">
                                <h4 className="text-sm font-bold text-emerald-400 uppercase mb-4 flex items-center gap-2 font-bold"><CheckCircle size={18} />Strengths</h4>
                                <ul className="space-y-3">{data.analysis.portfolioInsights.strengths?.map((s: string, i: number) => (<li key={i} className="text-sm text-gray-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>{s}</li>))}</ul>
                            </div>
                            <div className="p-8 rounded-[40px] bg-red-500/5 border border-red-500/10">
                                <h4 className="text-sm font-bold text-red-400 uppercase mb-4 flex items-center gap-2"><AlertTriangle size={18} />Risks</h4>
                                <ul className="space-y-3">{data.analysis.portfolioInsights.weaknesses?.map((w: string, i: number) => (<li key={i} className="text-sm text-gray-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div>{w}</li>))}</ul>
                            </div>
                            <div className="p-8 rounded-[40px] bg-primary/5 border border-primary/10">
                                <h4 className="text-sm font-bold text-primary uppercase mb-4 flex items-center gap-2"><TrendingUp size={18} />Adjustments</h4>
                                <ul className="space-y-3">{data.analysis.portfolioInsights.adjustments?.map((a: string, i: number) => (<li key={i} className="text-sm text-gray-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>{a}</li>))}</ul>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5 min-h-[400px]">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><TrendingUp className="text-primary" size={20} />Portfolio Allocation</h3>
                            <div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={charts.portfolioPie} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">{charts.portfolioPie?.map((entry: any, index: number) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip contentStyle={{ backgroundColor: '#1a1a25', borderRadius: '8px', border: '1px solid #333' }} itemStyle={{ color: '#fff' }} /><Legend /></PieChart></ResponsiveContainer></div>
                        </div>
                        <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5 min-h-[400px]">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><BarChart3 className="text-accent" size={20} />Projected Growth</h3>
                            <div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={charts.investmentGrowth}><CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} /><XAxis dataKey="year" stroke="#666" tick={{ fill: '#888' }} /><YAxis stroke="#666" tick={{ fill: '#888' }} tickFormatter={(v) => `₹${v / 100000}L`} /><Tooltip contentStyle={{ backgroundColor: '#1a1a25', borderRadius: '8px', border: '1px solid #333' }} labelStyle={{ color: '#888' }} /><Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer></div>
                        </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5">
                        <h3 className="text-xl font-semibold mb-6 text-left">AI Stock Picks</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead><tr className="border-b border-white/10 text-gray-400 text-sm"><th className="py-3 px-2">Stock</th><th className="py-3 px-2">Sector</th><th className="py-3 px-2">Price</th><th className="py-3 px-2">Action</th><th className="py-3 px-2">Reasoning</th></tr></thead>
                                <tbody>{stockRecommendations?.map((stock: any, idx: number) => (<tr key={idx} onClick={() => setSelectedStock(stock)} className="border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"><td className="py-4 px-2 font-medium group-hover:text-primary transition-colors">{stock.name} <span className="text-xs text-gray-500 block group-hover:text-primary/70">{stock.ticker}</span></td><td className="py-4 px-2 text-sm text-gray-400">{stock.sector}</td><td className="py-4 px-2 font-mono">₹{stock.price}</td><td className="py-4 px-2"><div className="flex items-center gap-2"><span className={`px-3 py-1 rounded-full text-xs font-bold ${stock.signal === 'BUY' ? 'bg-green-500/20 text-green-400' : stock.signal === 'SELL' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{stock.signal}</span><button onClick={(e) => { e.stopPropagation(); setBuyModal({ isOpen: true, stock, quantity: 1 }); }} className="p-1 px-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-full transition-colors flex items-center gap-1"><Plus size={14} /><span className="text-[10px]">Buy</span></button></div></td><td className="py-4 px-2 text-sm text-gray-400 max-w-[200px] truncate" title={stock.reason}>{stock.reason}</td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Protection Tab */}
            {activeTab === 'protection' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="p-8 rounded-[40px] bg-[#1a1a25] border border-white/5 mb-12 relative overflow-hidden text-left">
                        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
                        <h3 className="text-2xl font-bold mb-2">Insurance Adequacy</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
                            <div className="space-y-6">
                                <div className="flex justify-between items-end"><div><h4 className="text-lg font-bold">Term Life</h4><p className="text-sm text-gray-500">Target: 15x Income</p></div><div className="text-right text-sm text-red-400 font-bold">Gap: ₹{data.protectionGap?.life?.gap / 100000}L</div></div>
                                <div className="relative h-4 bg-white/5 rounded-full overflow-hidden flex"><div className="h-full bg-primary" style={{ width: `${Math.min(100, (data.protectionGap?.life?.actual / data.protectionGap?.life?.required) * 100)}%` }}></div></div>
                                <div className="flex justify-between text-xs text-gray-500 font-mono"><span>Actual: ₹{data.protectionGap?.life?.actual / 100000}L</span><span>Req: ₹{data.protectionGap?.life?.required / 100000}L</span></div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end"><div><h4 className="text-lg font-bold">Health Cover</h4><p className="text-sm text-gray-500">Family Target</p></div><div className="text-right text-sm text-red-400 font-bold">Gap: ₹{data.protectionGap?.health?.gap / 100000}L</div></div>
                                <div className="relative h-4 bg-white/5 rounded-full overflow-hidden flex"><div className="h-full bg-accent" style={{ width: `${Math.min(100, (data.protectionGap?.health?.actual / data.protectionGap?.health?.required) * 100)}%` }}></div></div>
                                <div className="flex justify-between text-xs text-gray-500 font-mono"><span>Actual: ₹{data.protectionGap?.health?.actual / 100000}L</span><span>Req: ₹{data.protectionGap?.health?.required / 100000}L</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 rounded-3xl bg-secondary/30 border border-white/5 text-left">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><Shield className="text-green-400" size={20} />Current Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-400 font-bold">Life Cover</span><span className="text-lg font-bold text-green-400">₹{insuranceRecommendation.termLife.recommendedCover / 100000}L</span></div>
                                <p className="text-xs text-gray-500 leading-relaxed">{insuranceRecommendation.termLife.reason}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-400 font-bold">Health Cover</span><span className="text-lg font-bold text-blue-400">₹{insuranceRecommendation.healthInsurance.recommendedCover / 100000}L</span></div>
                                <p className="text-xs text-gray-500 leading-relaxed">{insuranceRecommendation.healthInsurance.reason}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Roadmap Tab */}
            {activeTab === 'roadmap' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5">
                            <h3 className="text-xl font-semibold mb-6">Goal Roadmap</h3>
                            <div className="space-y-4">{goalPlanning?.goals?.map((goal: any, idx: number) => (<div key={idx} className="flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{idx + 1}</div><div className="flex-1 text-left"><div className="flex justify-between"><h4 className="font-medium capitalize">{goal.goalName}</h4><span className="text-sm font-mono font-bold">₹{goal.monthlySIPRequired}/mo</span></div><div className="w-full bg-gray-800 rounded-full h-1.5 mt-2"><div className="bg-primary h-1.5 rounded-full" style={{ width: '60%' }}></div></div><p className="text-xs text-gray-500 mt-1">Target: {new Date().getFullYear() + goal.timeHorizonYears} • Via {goal.suggestedRoute}</p></div></div>))}</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
                            <h3 className="text-xl font-semibold mb-6">Action Plan</h3>
                            <ul className="space-y-3">{nextActions?.map((action: string, idx: number) => (<li key={idx} className="flex items-start gap-3 text-sm text-gray-200"><CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />{action}</li>))}</ul>
                            <button className="mt-8 w-full py-3 bg-primary hover:bg-primary/90 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"><Download size={18} /> Download Detailed Report</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
