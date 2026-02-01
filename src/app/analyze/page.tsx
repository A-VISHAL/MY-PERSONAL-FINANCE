"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FinancialForm from '@/components/FinancialForm';
import Dashboard from '@/components/Dashboard';

export default function AnalyzePage() {
    const [results, setResults] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null); // Store form data for overlays
    const [isLoading, setIsLoading] = useState(false);

    const [quote, setQuote] = useState("");

    useEffect(() => {
        const quotes = [
            "The more you learn, the more you earn. – Warren Buffett",
            "Do not save what is left after spending, but spend what is left after saving. – Warren Buffett",
            "A penny saved is a penny earned. – Benjamin Franklin",
            "Price is what you pay. Value is what you get. – Warren Buffett",
            "Beware of little expenses. A small leak will sink a great ship. – Benjamin Franklin",
            "Rich people have small TVs and big libraries, and poor people have small libraries and big TVs. – Zig Ziglar",
            "Financial freedom is available to those who learn about it and work for it. – Robert Kiyosaki",
            "It’s not how much money you make, but how much money you keep. – Robert Kiyosaki",
            "Money is a terrible master but an excellent servant. – P.T. Barnum",
            "The stock market is formatted to transfer money from the impatient to the patient. – Warren Buffett"
        ];
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    const handleAnalysis = async (formData: any) => {
        setIsLoading(true);
        setUserData(formData); // Store form data for overlay features
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
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
        <main className="min-h-screen pb-20 bg-[#050505] text-white">
            <Navbar />

            {/* Hero / Input Section */}
            <section id="analyze" className="pt-32 pb-20 px-6">
                <div className="container mx-auto">
                    {!results && (
                        <div className="text-center mb-16 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {quote && (
                                <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <p className="text-sm text-gray-300 italic">✨ "{quote}"</p>
                                </div>
                            )}
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                                Analyze Your <br />
                                <span className="text-gradient">Wealth Strategy</span>
                            </h1>
                            <p className="text-xl text-gray-400 leading-relaxed">
                                AI-powered wealth management tailored to your life goals.
                                Get institutional-grade analysis in seconds.
                            </p>
                        </div>
                    )}

                    <FinancialForm onSubmit={handleAnalysis} isLoading={isLoading} />
                </div>
            </section>

            {/* Results Section */}
            {results && (
                <section id="dashboard" className="px-6 py-20 bg-black/20">
                    <div className="container mx-auto">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold">Your Financial Blueprint</h2>
                            <p className="text-gray-400">Generated on {new Date().toLocaleDateString()}</p>
                        </div>

                        <Dashboard data={results} userData={userData} />
                    </div>
                </section>
            )}
        </main>
    );
}
