import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';

export default function FAQs() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click on the "Sign Up" button in the top right corner, choose your business model (B2B, B2C, or C2C), and fill in your details. You\'ll receive a verification email to activate your account.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, PayPal, and bank transfers. For enterprise clients, we also offer invoice-based billing.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption (SSL/TLS) to protect your data. All transactions are processed through secure payment gateways, and we never store your complete payment information.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can change your plan at any time from your account settings. Upgrades take effect immediately, while downgrades apply from the next billing cycle.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all our plans. If you\'re not satisfied, contact our support team within 30 days of purchase for a full refund.'
    },
    {
      question: 'How does the free trial work?',
      answer: 'Our 14-day free trial gives you full access to all features. No credit card is required to start. You can upgrade to a paid plan at any time during or after the trial.'
    },
    {
      question: 'What support options are available?',
      answer: 'We offer 24/7 email support for all users. Professional and Enterprise plans include priority support and phone support. Enterprise clients get a dedicated account manager.'
    },
    {
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your current billing period.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 text-center">
            FAQs
          </h1>
          <p className="text-gray-400 text-center text-xl mb-12">
            Frequently Asked Questions
          </p>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-purple-500/50"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="text-lg font-semibold text-white pr-8">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 text-purple-400 transform transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Still have questions?</p>
            <button
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
      <Footer accentColor="blue" /> 
    </div>
  );
}