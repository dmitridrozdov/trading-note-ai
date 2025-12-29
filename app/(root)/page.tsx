"use client"

import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, FileText, Shield, Zap, Target } from 'lucide-react';

const TradingNotesLanding: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Track Every Trade",
      description: "Comprehensive logging of all your trades with detailed entry and exit points"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Visual insights into your trading patterns and profitability metrics"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Strategy Notes",
      description: "Document your reasoning, setups, and lessons learned from each trade"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your trading data stays protected with enterprise-grade security"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Built with Next.js for optimal performance and instant page loads"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Growth Tracking",
      description: "Monitor your evolution as a trader with comprehensive statistics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 text-2xl font-bold">
          <TrendingUp className="w-8 h-8 text-emerald-400" />
          <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            TradeNotes
          </span>
        </div>
        <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32 max-w-7xl mx-auto">
        <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Master Your Trading
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              One Trade at a Time
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            The ultimate platform for traders who are serious about improving. 
            Log, analyze, and learn from every position you take.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg text-lg font-semibold hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105">
              Start Trading Journal
            </button>
            <button className="px-8 py-4 bg-white border-2 border-slate-300 rounded-lg text-lg font-semibold hover:bg-slate-50 transition-all duration-300">
              View Demo
            </button>
          </div>
        </div>

        {/* Floating stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20" 
             style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          {[
            { label: 'Trades Logged', value: '10K+' },
            { label: 'Active Traders', value: '2.5K+' },
            { label: 'Success Rate', value: '68%' }
          ].map((stat, i) => (
            <div key={i} 
                 className={`bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                 style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-slate-600 text-lg">
            Powerful features designed for serious traders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i}
                 className="group bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 hover:bg-white hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 transform hover:scale-105"
                 style={{ 
                   animationDelay: `${i * 100}ms`,
                   animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none',
                   opacity: isVisible ? 1 : 0
                 }}>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/30 to-blue-600/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-emerald-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-blue-700 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Level Up Your Trading?
            </h2>
            <p className="text-lg text-emerald-50 mb-8">
              Join thousands of traders who are improving their performance with TradeNotes
            </p>
            <button className="px-10 py-4 bg-white text-slate-900 rounded-lg text-lg font-bold hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto text-center text-slate-500">
          <p>&copy; 2026 TradeNotes. Built with Next.js & TypeScript</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TradingNotesLanding;