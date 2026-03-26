import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';

export default function HelpCenter() {
  const navigate = useNavigate();

  const categories = [
    {
      icon: '🚀',
      title: 'Getting Started',
      topics: ['Account Setup', 'First Transaction', 'Platform Overview', 'Quick Start Guide']
    },
    {
      icon: '💳',
      title: 'Payments & Billing',
      topics: ['Payment Methods', 'Billing Issues', 'Refunds', 'Subscription Management']
    },
    {
      icon: '🔐',
      title: 'Security & Privacy',
      topics: ['Account Security', 'Data Protection', 'Two-Factor Authentication', 'Privacy Settings']
    },
    {
      icon: '⚙️',
      title: 'Account Management',
      topics: ['Profile Settings', 'Password Reset', 'Email Preferences', 'Delete Account']
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
            Help Center
          </h1>
          <p className="text-gray-400 text-center text-xl mb-12">
            Find answers to your questions
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full bg-gray-900/90 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
              <svg className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.topics.map((topic, idx) => (
                    <li key={idx}>
                      <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2">
                        <span>→</span>
                        {topic}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer accentColor="blue" /> 
    </div>
  );
}