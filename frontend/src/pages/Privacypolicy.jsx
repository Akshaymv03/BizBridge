import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 mb-8">Last updated: February 16, 2025</p>
          
          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Business information and tax details</li>
                <li>Payment and billing information</li>
                <li>Transaction history and preferences</li>
                <li>Communications with our support team</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>With your consent</li>
                <li>With service providers who assist in our operations</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to collect information about your browsing activities and to provide personalized content and advertising.
              </p>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
              </p>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">8. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-2">
                Email: privacy@bizbridge.com<br />
                Phone: +1 (555) 123-4567<br />
                Address: 123 Business St, Suite 100, Mumbai, Maharashtra, India
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer accentColor="blue" /> 
    </div>
  );
}