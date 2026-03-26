import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = ({ accentColor = 'blue' }) => {
  const accent = {
    blue: {
      text: 'text-blue-400',
      hover: 'hover:text-blue-400',
      border: 'border-blue-800',
      bg: 'bg-slate-900',
    },
    purple: {
      text: 'text-purple-400',
      hover: 'hover:text-purple-400',
      border: 'border-purple-900',
      bg: 'bg-slate-900',
    },
  }[accentColor] || {
    text: 'text-blue-400',
    hover: 'hover:text-blue-400',
    border: 'border-blue-800',
    bg: 'bg-slate-900',
  }

  {/*const quickLinks = [
    { label: 'About Us', path: `/${accentColor === 'purple' ? 'c2c' : 'b2b'}/about` },
    { label: 'Features', path: `/${accentColor === 'purple' ? 'c2c' : 'b2b'}/features` },
    { label: 'Blog',     path: `/${accentColor === 'purple' ? 'c2c' : 'b2b'}/blog` },
  ]

  const supportLinks = [
    { label: 'Help Center',      path: `/${accentColor === 'purple' ? 'c2c' : 'b2b'}/help` },
    { label: 'Contact Us',       path: `/${accentColor === 'purple' ? 'c2c' : 'b2b'}/contact` },
    { label: 'FAQs',             path: `/${accentColor === 'purple' ? 'c2c' : 'b2b'}/faqs` },
    { label: 'Terms of Service', path: `/${accentColor === 'purple' ? 'c2c' : 'b2b'}/terms` },
  ]

  const bottomLinks = [
    { label: 'Privacy Policy', path: `/${accentColor === 'purple' ? 'c2c' : 'b2b'}/privacy-policy` },
    { label: 'Cookie Policy',  path: `/${accentColor === 'purple' ? 'c2c' : 'b2b'}/cookie-policy` },
    { label: 'Sitemap',        path: `/${accentColor === 'purple' ? 'c2c' : 'b2b'}/sitemap` },
  ]*/}
  const portal = accentColor === 'purple' ? 'c2c' : accentColor === 'green' ? 'b2c' : 'b2b'

const quickLinks = [
  { label: 'About Us', path: `/${portal}/about` },
  { label: 'Features', path: `/${portal}/features` },
  { label: 'Blog',     path: `/${portal}/blog` },
]
const supportLinks = [
  { label: 'Help Center',      path: `/${portal}/help` },
  { label: 'Contact Us',       path: `/${portal}/contact` },
  { label: 'FAQs',             path: `/${portal}/faqs` },
  { label: 'Terms of Service', path: `/${portal}/terms` },
]
const bottomLinks = [
  { label: 'Privacy Policy', path: `/${portal}/privacy-policy` },
  { label: 'Cookie Policy',  path: `/${portal}/cookie-policy` },
  { label: 'Sitemap',        path: `/${portal}/sitemap` },
]


  return (
    <footer className={`${accent.bg} text-gray-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h3 className={`text-2xl font-black mb-3 ${accent.text}`}>BizBridge</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Connecting businesses and consumers worldwide with innovative trading solutions.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Youtube, Linkedin].map((Icon, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center ${accent.hover} hover:border-white/30 transition`}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h5>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map(({ label, path }) => (
                <li key={label}>
                  <Link to={path} className={`text-gray-400 ${accent.hover} transition`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Support</h5>
            <ul className="space-y-2.5 text-sm">
              {supportLinks.map(({ label, path }) => (
                <li key={label}>
                  <Link to={path} className={`text-gray-400 ${accent.hover} transition`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact</h5>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={14} className={accent.text} />
                support@bizbridge.com
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={14} className={accent.text} />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin size={14} className={`${accent.text} mt-0.5 shrink-0`} />
                123 Business St, Suite 100<br />Mumbai, Maharashtra, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`border-t ${accent.border} mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3`}>
          <p className="text-xs text-gray-500">© 2025 BizBridge. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {bottomLinks.map(({ label, path }) => (
              <Link key={label} to={path} className={`${accent.hover} transition`}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer