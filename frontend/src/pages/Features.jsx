import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';

export default function Features() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🔒',
      title: 'Secure Transactions',
      description: 'End-to-end encryption and secure payment processing to protect your business'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Real-time insights and detailed analytics to track your business performance'
    },
    {
      icon: '🌍',
      title: 'Global Reach',
      description: 'Connect with businesses and customers across the world'
    },
    {
      icon: '⚡',
      title: 'Fast Processing',
      description: 'Lightning-fast transaction processing and order fulfillment'
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you succeed'
    },
    {
      icon: '🔄',
      title: 'Easy Integration',
      description: 'Seamlessly integrate with your existing tools and workflows'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:translate-x-1 group border border-white/10 hover:border-purple-500/30"
        >
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              // ✅ Left arrow
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
             </svg>
          <span className="text-gray-300 font-semibold group-hover:text-purple-400 transition-colors">
            Back
          </span>
          
        </button>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 text-center">
            Platform Features
          </h1>
          <p className="text-gray-400 text-center text-xl mb-12">
            Everything you need to grow your business
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div><Footer accentColor="blue" /> 
    </div>
  );
}