import { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area, ComposedChart
} from 'recharts';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Download, X, Briefcase, Plus, Star, Target, Activity } from 'lucide-react';
import {
    InsuranceAdequacyOverlay,
    RiskAlignmentOverlay,
    ProtectionFirstWarning,
    EmergencyFundStressTest,
    ScoreBoostSimulator,
    PriorityTagging,
    TimeBasedRecommendations,
    FinancialHealthBadge,
    InsightConfidenceMeter
} from './FinancialOverlays';
import {
    DisciplineScoreGauge,
    DisciplineTrendChart,
    ExpenseIncomeTrendChart,
    SavingsConsistencyChart,
    InsuranceAdequacyChart,
    FinancialScorecardRadar
} from './FinancialDiscipline';
import { WealthWiseAIDashboard } from './WealthWiseAI';

interface DashboardProps {
    data: any;
    userData?: any;
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#10b981', '#fbbf24'];

export default function Dashboard({ data, userData = {} }: DashboardProps) {
    const [selectedStock, setSelectedStock] = useState<any>(null);
    const [portfolio, setPortfolio] = useState<any[]>([]);
    const [buyModal, setBuyModal] = useState({ isOpen: false, stock: null as any, quantity: 1 });
    const [notification, setNotification] = useState<{ isOpen: boolean; message: string } | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

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

    if (!data) return null;

    const {
        financialDiscipline,
        budgetPlan,
        insuranceRecommendation,
        investmentPortfolio,
        stockRecommendations,
        charts,
        goalPlanning,
        nextActions,
        overallHealthScore
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
        { id: 'discipline', label: 'Discipline', icon: <Activity size={18} /> },
        { id: 'investments', label: 'Investments', icon: <TrendingUp size={18} /> },
        { id: 'protection', label: 'Protection', icon: <Shield size={18} /> },
        { id: 'roadmap', label: 'Roadmap', icon: <Target size={18} /> },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">

            {/* Sticky Sub-Navbar */}
            <div className="sticky top-16 z-40 py-4 bg-[#050505]/50 backdrop-blur-xl border-b border-white/5 -mx-4 md:-mx-12 px-4 md:px-12 mb-8">
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

            {/* Tab Contents */}
            <div className="min-h-[600px]">

                {/* 1. Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Summary Header */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="p-6 rounded-2xl bg-[#11111a] border border-white/5 shadow-lg">
                                <h3 className="text-gray-400 text-sm mb-1">Monthly Budget</h3>
                                <p className="text-2xl font-bold">₹{budgetPlan.monthlyAllocation.needs.amount + budgetPlan.monthlyAllocation.wants.amount + budgetPlan.monthlyAllocation.savings.amount}</p>
                                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full mt-2 inline-block">{budgetPlan.incomeBracket}</span>
                            </div>
                            <div className="p-6 rounded-2xl bg-[#11111a] border border-white/5 shadow-lg">
                                <h3 className="text-gray-400 text-sm mb-1">Savings Rate</h3>
                                <p className="text-2xl font-bold text-green-400">{budgetPlan.monthlyAllocation.savings.percentage}%</p>
                                <span className="text-xs text-gray-500">Target Reached</span>
                            </div>
                            <div className="p-6 rounded-2xl bg-[#11111a] border border-white/5 shadow-lg">
                                <h3 className="text-gray-400 text-sm mb-1">Risk Profile</h3>
                                <p className="text-2xl font-bold capitalize text-accent">{investmentPortfolio.riskProfile}</p>
                                <span className="text-xs text-gray-500">{investmentPortfolio.disciplineAdjusted ? 'Discipline Adjusted' : 'Optimal Strategy'}</span>
                            </div>
                            <div className="p-6 rounded-2xl bg-[#11111a] border border-white/5 shadow-lg">
                                <h3 className="text-gray-400 text-sm mb-1">Monthly SIP</h3>
                                <p className="text-2xl font-bold text-primary">₹{investmentPortfolio.totalMonthlyInvestment}</p>
                                <span className="text-xs text-gray-500">Automated Savings</span>
                            </div>
                            <div className="p-6 rounded-2xl bg-[#11111a] border border-white/5 shadow-lg">
                                <h3 className="text-gray-400 text-sm mb-1">Health Score</h3>
                                <p className="text-2xl font-bold text-primary">{overallHealthScore || 75}</p>
                                <span className="text-xs text-gray-500">Out of 100</span>
                            </div>
                        </div>

                        {/* Visual Gauges */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="p-8 rounded-[40px] bg-gradient-to-br from-[#1a1a25] to-[#12121a] border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
                                <h3 className="text-xl font-bold mb-8">Overall Financial Health</h3>
                                <div className="relative w-48 h-48 mb-6">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={553} strokeDashoffset={553 - (553 * (overallHealthScore || 75)) / 100} className="text-primary transition-all duration-1000 ease-out" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-6xl font-black text-white">{overallHealthScore || 75}</span>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Score</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400">Your financial status is <span className="text-white font-bold">{overallHealthScore > 80 ? 'Excellent' : overallHealthScore > 60 ? 'Good' : 'Needs Work'}</span></p>
                            </div>

                            <DisciplineScoreGauge userData={userData} />
                        </div>

                        {/* Priority Badges */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FinancialHealthBadge data={data} userData={userData} />
                            <PriorityTagging data={data} userData={userData} />
                            <InsightConfidenceMeter data={data} userData={userData} />
                        </div>
                    </div>
                )}

                {/* 2. Discipline Tab */}
                {activeTab === 'discipline' && (
                    <div className="space-y-8 animate-in fade-in duration-500 text-left">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <DisciplineTrendChart userData={userData} />
                            <ExpenseIncomeTrendChart userData={userData} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <SavingsConsistencyChart userData={userData} />
                            <FinancialScorecardRadar data={data} userData={userData} />
                        </div>
                    </div>
                )}

                {/* 3. Investments Tab */}
                {activeTab === 'investments' && (
                    <div className="space-y-8 animate-in fade-in duration-500 text-left">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Portfolio Allocation Pie Chart */}
                            <div className="p-8 rounded-[40px] bg-secondary/30 border border-white/5 min-h-[400px]">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <TrendingUp className="text-primary" size={20} />
                                    Portfolio Allocation
                                </h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={charts.portfolioPie}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={80}
                                                outerRadius={120}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {charts.portfolioPie.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1a1a25', borderRadius: '16px', border: '1px solid #333' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Investment Growth Line Chart */}
                            <div className="p-8 rounded-[40px] bg-secondary/30 border border-white/5 min-h-[400px]">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <BarChart3 className="text-accent" size={20} />
                                    Projected Wealth Growth (10 Years)
                                </h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={charts.investmentGrowth}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                            <XAxis dataKey="year" stroke="#666" tick={{ fill: '#888' }} />
                                            <YAxis stroke="#666" tick={{ fill: '#888' }} tickFormatter={(value) => `₹${value / 100000}L`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1a1a25', borderRadius: '16px', border: '1px solid #333' }}
                                                labelStyle={{ color: '#888' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#8b5cf6"
                                                strokeWidth={3}
                                                dot={{ r: 4, fill: '#8b5cf6' }}
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* AI Stock Recommendations */}
                        <div className="p-8 rounded-[40px] bg-secondary/30 border border-white/5">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold">AI Stock Picks</h3>
                                <p className="text-xs text-gray-500">Tap to view 5-Year Forecast</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 text-gray-400 text-sm">
                                            <th className="py-4 px-2">Stock</th>
                                            <th className="py-4 px-2">Sector</th>
                                            <th className="py-4 px-2">Price</th>
                                            <th className="py-4 px-2">Action</th>
                                            <th className="py-4 px-2">Analysis</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockRecommendations.map((stock: any, idx: number) => (
                                            <tr
                                                key={idx}
                                                onClick={() => setSelectedStock(stock)}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                                            >
                                                <td className="py-5 px-2 font-bold group-hover:text-primary transition-colors">
                                                    {stock.name} <span className="text-xs text-gray-500 block font-normal">{stock.ticker}</span>
                                                </td>
                                                <td className="py-5 px-2 text-sm text-gray-400">{stock.sector}</td>
                                                <td className="py-5 px-2 font-mono font-bold">₹{stock.price}</td>
                                                <td className="py-5 px-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${stock.signal === 'BUY' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                            stock.signal === 'SELL' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                                'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                            }`}>
                                                            {stock.signal}
                                                        </span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setBuyModal({ isOpen: true, stock, quantity: 1 });
                                                            }}
                                                            className="p-1 px-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full transition-all text-[10px] font-bold"
                                                        >
                                                            Buy
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-2 text-sm text-gray-400 max-w-[250px] truncate">{stock.reason}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* WealthWise AI Integration */}
                        <WealthWiseAIDashboard data={data} userData={userData} />
                    </div>
                )}

                {/* 4. Protection Tab */}
                {activeTab === 'protection' && (
                    <div className="space-y-8 animate-in fade-in duration-500 text-left">
                        {/* Protection Header Alerts */}
                        <ProtectionFirstWarning data={data} userData={userData} />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <InsuranceAdequacyChart data={data} userData={userData} />
                            </div>
                            <div className="lg:col-span-1">
                                <div className="p-8 rounded-[40px] bg-secondary/30 border border-white/5 h-full">
                                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                                        <Shield className="text-emerald-500" size={20} />
                                        Plan Details
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Life Cover</span>
                                                <span className="font-bold text-emerald-500">₹{insuranceRecommendation.termLife.recommendedCover / 100000}L</span>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed">{insuranceRecommendation.termLife.reason}</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Health Cover</span>
                                                <span className="font-bold text-blue-500">₹{insuranceRecommendation.healthInsurance.recommendedCover / 100000}L</span>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed">{insuranceRecommendation.healthInsurance.reason}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Recommended Riders</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {insuranceRecommendation.riders.map((r: string, i: number) => (
                                                    <span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-gray-300">{r}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Smart Protection Overlays */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InsuranceAdequacyOverlay data={data} userData={userData} />
                            <EmergencyFundStressTest data={data} userData={userData} />
                            <TimeBasedRecommendations data={data} userData={userData} />
                        </div>
                    </div>
                )}

                {/* 5. Roadmap Tab */}
                {activeTab === 'roadmap' && (
                    <div className="space-y-8 animate-in fade-in duration-500 text-left">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="p-8 rounded-[40px] bg-secondary/30 border border-white/5">
                                <h3 className="text-xl font-bold mb-8">Goal Roadmap</h3>
                                <div className="space-y-6">
                                    {goalPlanning.goals.map((goal: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-all group">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-end mb-2">
                                                    <h4 className="font-bold text-lg capitalize">{goal.goalName}</h4>
                                                    <span className="text-sm font-mono font-bold text-primary">₹{goal.monthlySIPRequired}/mo</span>
                                                </div>
                                                <div className="w-full bg-white/5 rounded-full h-2">
                                                    <div className="bg-primary h-2 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '60%' }}></div>
                                                </div>
                                                <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    <span>Target Year: {new Date().getFullYear() + goal.timeHorizonYears}</span>
                                                    <span>Via {goal.suggestedRoute}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 rounded-[40px] bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-8">Immediate Actions</h3>
                                    <ul className="space-y-4">
                                        {nextActions.map((action: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-[#050505]/40 border border-white/5 backdrop-blur-sm">
                                                <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                                                <span className="text-sm text-gray-300 leading-relaxed">{action}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="mt-12 w-full py-5 bg-primary hover:bg-primary/90 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-primary/20 uppercase tracking-tighter">
                                        <Download size={20} /> Download PDF Strategy
                                    </button>
                                </div>
                                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
                            </div>
                        </div>

                        {/* Stress Tests & Boosters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            <RiskAlignmentOverlay data={data} userData={userData} />
                            <ScoreBoostSimulator data={data} userData={userData} />
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-3xl bg-secondary/30 border border-white/5 hover:border-primary/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <p className="text-gray-400 leading-relaxed font-medium">
                {description}
            </p>
        </div>
    );
}
