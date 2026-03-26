import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';

export default function Blog() {
  const navigate = useNavigate();

  const posts = [
    {
      title: '5 Tips for Successful B2B Trading',
      date: 'February 10, 2025',
      excerpt: 'Learn the essential strategies for building strong B2B relationships and maximizing your trading success.',
      image: '📈'
    },
    {
      title: 'The Future of E-Commerce',
      date: 'February 8, 2025',
      excerpt: 'Explore the latest trends and technologies shaping the future of online commerce and digital marketplaces.',
      image: '🚀'
    },
    {
      title: 'How to Scale Your Business',
      date: 'February 5, 2025',
      excerpt: 'Proven strategies and best practices for growing your business efficiently and sustainably.',
      image: '📊'
    },
    {
      title: 'Understanding C2C Marketplaces',
      date: 'February 1, 2025',
      excerpt: 'A comprehensive guide to consumer-to-consumer trading and how to succeed in peer-to-peer markets.',
      image: '🤝'
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
            BizBridge Blog
          </h1>
          <p className="text-gray-400 text-center text-xl mb-12">
            Insights, tips, and news from the world of commerce
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
              >
                <div className="p-8">
                  <div className="text-6xl mb-4">{post.image}</div>
                  <div className="text-sm text-purple-400 mb-2">{post.date}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{post.title}</h3>
                  <p className="text-gray-400 mb-4">{post.excerpt}</p>
                  <button className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2">
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer accentColor="blue" /> 
    </div>
  );
}