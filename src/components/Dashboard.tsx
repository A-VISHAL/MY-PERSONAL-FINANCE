import { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area, ComposedChart
} from 'recharts';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Download, X, Briefcase, Plus } from 'lucide-react';

interface DashboardProps {
    data: any;
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#10b981', '#fbbf24'];

export default function Dashboard({ data }: DashboardProps) {
    const [selectedStock, setSelectedStock] = useState<any>(null);
    const [portfolio, setPortfolio] = useState<any[]>([]);
    const [buyModal, setBuyModal] = useState({ isOpen: false, stock: null as any, quantity: 1 });

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
        alert(`Successfully bought ${buyModal.quantity} shares of ${buyModal.stock.ticker}. View in your Portfolio.`);
    };

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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">

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

            {/* 1. Summary Header */}{/* Keep comment */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-6 rounded-2xl bg-card border border-white/5 shadow-lg">
                    <h3 className="text-gray-400 text-sm mb-1">Monthly Budget</h3>
                    <p className="text-2xl font-bold">₹{budgetPlan.monthlyAllocation.needs.amount + budgetPlan.monthlyAllocation.wants.amount + budgetPlan.monthlyAllocation.savings.amount}</p>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full mt-2 inline-block">
                        {budgetPlan.incomeBracket}
                    </span>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-white/5 shadow-lg">
                    <h3 className="text-gray-400 text-sm mb-1">Savings Rate</h3>
                    <p className="text-2xl font-bold text-green-400">{budgetPlan.monthlyAllocation.savings.percentage}%</p>
                    <span className="text-xs text-gray-500">Recommended Target</span>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-white/5 shadow-lg">
                    <h3 className="text-gray-400 text-sm mb-1">Risk Profile</h3>
                    <p className="text-2xl font-bold capitalize text-accent">{investmentPortfolio.riskProfile}</p>
                    <span className="text-xs text-gray-500">Asset Allocation Strategy</span>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-white/5 shadow-lg">
                    <h3 className="text-gray-400 text-sm mb-1">Inv. to Start</h3>
                    <p className="text-2xl font-bold text-primary">₹{investmentPortfolio.totalMonthlyInvestment}</p>
                    <span className="text-xs text-gray-500">Monthly SIP Amount</span>
                </div>
            </div>

            {/* 2. Charts Section (Portfolio & Growth) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Portfolio Allocation Pie Chart */}
                <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5 min-h-[400px]">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
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
                                    contentStyle={{ backgroundColor: '#1a1a25', borderRadius: '8px', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Investment Growth Line Chart */}
                <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5 min-h-[400px]">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
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
                                    contentStyle={{ backgroundColor: '#1a1a25', borderRadius: '8px', border: '1px solid #333' }}
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



            {/* 3. Stock Recommendations & Insurance */}{/* Keep comment */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Stock List */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-secondary/30 border border-white/5">
                    <h3 className="text-xl font-semibold mb-6">AI Stock Picks</h3>
                    <p className="text-xs text-gray-400 mb-4 -mt-4">Click on any stock to view 5-Year Forecast</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400 text-sm">
                                    <th className="py-3 px-2">Stock</th>
                                    <th className="py-3 px-2">Sector</th>
                                    <th className="py-3 px-2">Price</th>
                                    <th className="py-3 px-2">Action</th>
                                    <th className="py-3 px-2">Reasoning</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockRecommendations.map((stock: any, idx: number) => (
                                    <tr
                                        key={idx}
                                        onClick={() => setSelectedStock(stock)}
                                        className="border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                                    >
                                        <td className="py-4 px-2 font-medium group-hover:text-primary transition-colors">
                                            {stock.name} <span className="text-xs text-gray-500 block group-hover:text-primary/70">{stock.ticker}</span>
                                        </td>
                                        <td className="py-4 px-2 text-sm text-gray-400">{stock.sector}</td>
                                        <td className="py-4 px-2 font-mono">₹{stock.price}</td>
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${stock.signal === 'BUY' ? 'bg-green-500/20 text-green-400' :
                                                    stock.signal === 'SELL' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {stock.signal}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setBuyModal({ isOpen: true, stock, quantity: 1 });
                                                    }}
                                                    className="p-1 px-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-full transition-colors flex items-center gap-1"
                                                    title="Buy Stock"
                                                >
                                                    <Plus size={14} /> <span className="text-[10px]">Buy</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-sm text-gray-400 max-w-[200px] truncate" title={stock.reason}>{stock.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Insurance Card */}
                <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Shield className="text-green-400" size={20} />
                        Insurance Status
                    </h3>
                    <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">Term Life Cover</span>
                                <span className="text-lg font-bold text-green-400">₹{insuranceRecommendation.termLife.recommendedCover / 100000}L</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{insuranceRecommendation.termLife.reason}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">Health Cover</span>
                                <span className="text-lg font-bold text-blue-400">₹{insuranceRecommendation.healthInsurance.recommendedCover / 100000}L</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{insuranceRecommendation.healthInsurance.reason}</p>
                        </div>

                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recommended Riders</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {insuranceRecommendation.riders.map((rider: string, idx: number) => (
                                    <span key={idx} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-gray-300">
                                        {rider}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Goal Planning & Next Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-3xl bg-secondary/30 border border-white/5">
                    <h3 className="text-xl font-semibold mb-6">Goal Roadmap</h3>
                    <div className="space-y-4">
                        {goalPlanning.goals.map((goal: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium capitalize">{goal.goalName}</h4>
                                        <span className="text-sm font-mono font-bold">₹{goal.monthlySIPRequired}/mo</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                                        <div className="bg-primary h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Target Year: {new Date().getFullYear() + goal.timeHorizonYears} • Via {goal.suggestedRoute}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
                    <h3 className="text-xl font-semibold mb-6">Action Plan</h3>
                    <ul className="space-y-3">
                        {nextActions.map((action: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-200">
                                <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />
                                {action}
                            </li>
                        ))}
                    </ul>
                    <button className="mt-8 w-full py-3 bg-primary hover:bg-primary/90 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                        <Download size={18} /> Download Detailed Report
                    </button>
                </div>
            </div>

        </div>
    );
}
