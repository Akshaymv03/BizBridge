import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:translate-x-1 group border border-white/10 hover:border-purple-500/30"
        ><svg
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400 mb-8">Last updated: February 16, 2025</p>
          
          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using BizBridge's services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily access and use BizBridge for personal or commercial purposes. This license shall automatically terminate if you violate any of these restrictions and may be terminated by BizBridge at any time.
              </p>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">3. User Obligations</h2>
              <p>As a user of BizBridge, you agree to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not engage in fraudulent activities</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">4. Payment Terms</h2>
              <p>
                All fees are exclusive of applicable taxes unless otherwise stated. You agree to pay all fees associated with your chosen plan. Failure to pay may result in suspension or termination of services.
              </p>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">5. Refund Policy</h2>
              <p>
                We offer a 30-day money-back guarantee for first-time subscribers. Refund requests must be submitted within 30 days of the initial purchase.
              </p>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">6. Limitation of Liability</h2>
              <p>
                BizBridge shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
              </p>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the platform.
              </p>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">8. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2">
                Email: legal@bizbridge.com<br />
                Phone: +1 (555) 123-4567
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer accentColor="blue" /> 
    </div>
  );
}