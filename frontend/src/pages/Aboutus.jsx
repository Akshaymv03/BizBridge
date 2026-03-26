import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';  // saare footer me dana hai

export default function AboutUs() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => navigate(-1)}
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-gray-300 font-semibold group-hover:text-purple-400 transition-colors">
            Back
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            About BizBridge
          </h1>

          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              BizBridge is a revolutionary platform connecting businesses and consumers
              worldwide with innovative trading solutions. We're dedicated to making
              commerce accessible, efficient, and transparent for everyone.
            </p>

            <h2 className="text-3xl font-bold text-white mt-8 mb-4">Our Mission</h2>
            <p>
              To empower businesses of all sizes by providing cutting-edge tools and
              platforms that facilitate seamless B2B, B2C, and C2C transactions globally.
            </p>

            <h2 className="text-3xl font-bold text-white mt-8 mb-4">Our Vision</h2>
            <p>
              To become the world's most trusted and innovative commerce platform,
              bridging the gap between buyers and sellers across all markets.
            </p>

            <h2 className="text-3xl font-bold text-white mt-8 mb-4">Why Choose Us</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Secure and reliable platform</li>
              <li>24/7 customer support</li>
              <li>Competitive pricing</li>
              <li>User-friendly interface</li>
              <li>Global reach with local expertise</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer accentColor="blue" /> 
    </div> //same sab me dalna hai
  );
}