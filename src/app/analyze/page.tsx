"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import FinancialForm from '@/components/FinancialForm';
import Dashboard from '@/components/Dashboard';

export default function AnalyzePage() {
    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalysis = async (formData: any) => {
        setIsLoading(true);
        try {
            const savedPortfolio = localStorage.getItem('carbon_portfolio');
            const portfolioData = savedPortfolio ? JSON.parse(savedPortfolio) : [];

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, portfolioData }),
            });
            const data = await response.json();
            setResults(data);

            // Smooth scroll to results
            setTimeout(() => {
                document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);

        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen pb-20">
            <Navbar />

            <section className="pt-32 pb-20 px-4 md:px-12">
                <div className="w-full">
                    {!results && (
                        <div className="text-center mb-16 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                                Your <span className="text-gradient">Financial Roadmap</span>
                            </h1>
                            <p className="text-lg text-gray-400 leading-relaxed">
                                Provide your details below to generate a tailored wealth management strategy,
                                stock recommendations, and retirement goals.
                            </p>
                        </div>
                    )}

                    <FinancialForm onSubmit={handleAnalysis} isLoading={isLoading} />
                </div>
            </section>

            {/* Results Section */}
            {results && (
                <section id="dashboard" className="px-4 md:px-12 py-20 bg-black/20">
                    <div className="w-full">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold">Your Financial Blueprint</h2>
                            <p className="text-gray-400">Generated on {new Date().toLocaleDateString()}</p>
                        </div>

                        <Dashboard data={results} />
                    </div>
                </section>
            )}
        </main>
    );
}
