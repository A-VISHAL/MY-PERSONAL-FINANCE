import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg group-hover:shadow-primary/20 transition-all">
                        <Activity size={20} />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        WealthWise<span className="text-primary">AI</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/portfolio" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Portfolio</Link>
                    <Link href="/calculators" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Calculators</Link>
                    <Link href="/#analyze" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Analyze</Link>
                    <Link href="/#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</Link>
                    <Link href="/#dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                </div>

                <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium">
                    Sign In
                </button>
            </div>
        </nav>
    );
}
