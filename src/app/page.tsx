"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowRight, BarChart3, ShieldCheck, Zap, TrendingUp, Wallet, Star } from 'lucide-react';

export default function Home() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const quotes = [
      "The more you learn, the more you earn. – Warren Buffett",
      "Do not save what is left after spending, but spend what is left after saving. – Warren Buffett",
      "A penny saved is a penny earned. – Benjamin Franklin",
      "Financial freedom is available to those who learn about it and work for it. – Robert Kiyosaki",
      "Money is a terrible master but an excellent servant. – P.T. Barnum"
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <main className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">AI-Powered Wealth Management</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Secure Your <br />
            <span className="text-gradient">Financial Future.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            WealthWiseAI uses institutional-grade intelligence to build custom roadmaps
            for your life goals. Stop guessing, start growing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link href="/analyze" className="group px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl flex items-center gap-2 transition-all hover:scale-105 shadow-xl shadow-primary/25">
              Get Started Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/calculators" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all">
              Explore Tools
            </Link>
          </div>

          {/* Quote */}
          <div className="mt-20 opacity-50 italic text-gray-400 max-w-lg mx-auto animate-in fade-in duration-1000 delay-500">
            "{quote}"
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="text-yellow-400" />}
              title="Instant Insights"
              description="Get a complete breakdown of your monthly budget and savings rate in under 10 seconds."
            />
            <FeatureCard
              icon={<TrendingUp className="text-primary" />}
              title="Stock Forecasting"
              description="Proprietary models project 5-year trends for thousands of stocks to guide your picks."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-green-400" />}
              title="Insurance Guard"
              description="AI audits your current coverage and suggests gaps in Term and Health insurance."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Mock Stats */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block p-8 rounded-[40px] bg-secondary/30 border border-white/5 backdrop-blur-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <div>
                <p className="text-4xl font-bold mb-2">₹400Cr+</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Analyzed</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">50K+</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Active Goals</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">4.9/5</p>
                <div className="flex justify-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="#6366f1" stroke="none" />)}
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">User Trust</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">24/7</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">AI Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="relative p-12 md:p-20 rounded-[40px] bg-gradient-to-br from-primary to-accent overflow-hidden shadow-2xl shadow-primary/20">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to take control?</h2>
              <p className="text-lg text-white/80 mb-10 leading-relaxed">
                Join thousands of smart investors who use WealthWiseAI to outsmart the market
                and retire years earlier.
              </p>
              <Link href="/analyze" className="px-10 py-5 bg-white text-primary font-black rounded-2xl hover:bg-gray-100 transition-all inline-block hover:scale-105 active:scale-95 shadow-xl">
                Start FREE Analysis
              </Link>
            </div>
            {/* Abstract shape */}
            <div className="absolute right-[-10%] bottom-[-20%] w-[60%] h-[120%] bg-white/10 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-secondary/30 border border-white/5 hover:border-primary/30 transition-all group">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
