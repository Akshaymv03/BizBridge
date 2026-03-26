import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';

const Sitemap = () => {
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#0a0b1a',
      color: '#ffffff',
      padding: '2rem',
      position: 'relative',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#8b92b2',
      background: 'rgba(26, 29, 53, 0.5)',
      border: '1px solid rgba(91, 159, 245, 0.1)',
      padding: '0.6rem 1.2rem',
      borderRadius: '8px',
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: '500',
      marginBottom: '2rem',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      zIndex: 10,
    },
    content: {
      maxWidth: '1400px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
    },
    h1: {
      fontSize: '3rem',
      fontWeight: '800',
      marginBottom: '0.5rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #5b9ff5 0%, #e879f9 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    description: {
      textAlign: 'center',
      color: '#8b92b2',
      fontSize: '1.1rem',
      marginBottom: '3rem',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem',
    },
    section: {
      background: 'rgba(26, 29, 53, 0.6)',
      border: '1px solid rgba(91, 159, 245, 0.1)',
      borderRadius: '16px',
      padding: '2rem',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid rgba(91, 159, 245, 0.2)',
    },
    ul: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    li: {
      marginBottom: '0.75rem',
    },
    link: {
      color: '#8b92b2',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem',
      borderRadius: '6px',
      transition: 'all 0.3s ease',
      fontSize: '0.95rem',
    },
    quickLinks: {
      background: 'rgba(26, 29, 53, 0.6)',
      border: '1px solid rgba(91, 159, 245, 0.1)',
      borderRadius: '16px',
      padding: '2.5rem',
      backdropFilter: 'blur(10px)',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    quickLinksGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
    },
    quickLinkCard: {
      background: 'rgba(91, 159, 245, 0.1)',
      border: '1px solid rgba(91, 159, 245, 0.2)',
      borderRadius: '12px',
      padding: '1.5rem',
      textDecoration: 'none',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
      transition: 'all 0.3s ease',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      {/* Grid Background */}
      <div style={{
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(rgba(91, 159, 245, 0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(91, 159, 245, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        zIndex: 0,
        pointerEvents: 'none',
      }}></div>
      
      {/* Back Button */}
      <Link 
        to="/pricing" 
        style={styles.backButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.3)';
          e.currentTarget.style.background = 'rgba(26, 29, 53, 0.8)';
          e.currentTarget.style.transform = 'translateX(-3px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#8b92b2';
          e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.1)';
          e.currentTarget.style.background = 'rgba(26, 29, 53, 0.5)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </Link>

      {/* Content */}
      <div style={styles.content}>
        <h1 style={styles.h1}>Sitemap</h1>
        <p style={styles.description}>
          Navigate through all pages and features available on BizBridge platform
        </p>

        {/* Main Navigation */}
        <div style={styles.grid}>
          {/* Home Section */}
          <div style={styles.section}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.3)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h2 style={styles.h2}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b9ff5" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              Home
            </h2>
            <ul style={styles.ul}>
              {['Homepage', 'About Us', 'Features', 'Contact'].map((item, i) => (
                <li key={i} style={styles.li}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} style={styles.link}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(91, 159, 245, 0.1)';
                      e.currentTarget.style.paddingLeft = '1rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '1';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(0)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#8b92b2';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.paddingLeft = '0.5rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '0';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(-10px)';
                    }}
                  >
                    <span className="arrow" style={{marginRight: '0.5rem', color: '#5b9ff5', opacity: 0, transform: 'translateX(-10px)', transition: 'all 0.3s ease'}}>→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Models Section */}
          <div style={styles.section}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.3)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h2 style={styles.h2}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b9ff5" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              Business Models
            </h2>
            <ul style={styles.ul}>
              {['B2B (Business to Business)', 'B2B Features', 'B2B Pricing', 'B2C (Business to Consumer)', 'B2C Features', 'B2C Pricing', 'C2C (Consumer to Consumer)', 'C2C Features', 'C2C Pricing'].map((item, i) => (
                <li key={i} style={styles.li}>
                  <Link to={`/${item.toLowerCase().replace(/[()]/g, '').replace(/ /g, '-')}`} style={styles.link}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(91, 159, 245, 0.1)';
                      e.currentTarget.style.paddingLeft = '1rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '1';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(0)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#8b92b2';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.paddingLeft = '0.5rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '0';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(-10px)';
                    }}
                  >
                    <span className="arrow" style={{marginRight: '0.5rem', color: '#5b9ff5', opacity: 0, transform: 'translateX(-10px)', transition: 'all 0.3s ease'}}>→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Section */}
          <div style={styles.section}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.3)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h2 style={styles.h2}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b9ff5" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Solutions
            </h2>
            <ul style={styles.ul}>
              {['Wholesale Trading', 'Retail Solutions', 'Marketplace', 'Payment Processing', 'Logistics & Shipping', 'Analytics Dashboard'].map((item, i) => (
                <li key={i} style={styles.li}>
                  <Link to={`/solutions/${item.toLowerCase().replace(/ /g, '-').replace('&', 'and')}`} style={styles.link}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(91, 159, 245, 0.1)';
                      e.currentTarget.style.paddingLeft = '1rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '1';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(0)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#8b92b2';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.paddingLeft = '0.5rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '0';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(-10px)';
                    }}
                  >
                    <span className="arrow" style={{marginRight: '0.5rem', color: '#5b9ff5', opacity: 0, transform: 'translateX(-10px)', transition: 'all 0.3s ease'}}>→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Section */}
          <div style={styles.section}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.3)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h2 style={styles.h2}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b9ff5" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              Resources
            </h2>
            <ul style={styles.ul}>
              {['Blog', 'User Guides', 'Video Tutorials', 'Webinars', 'Case Studies', 'FAQ'].map((item, i) => (
                <li key={i} style={styles.li}>
                  <Link to={`/resources/${item.toLowerCase().replace(/ /g, '-')}`} style={styles.link}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(91, 159, 245, 0.1)';
                      e.currentTarget.style.paddingLeft = '1rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '1';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(0)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#8b92b2';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.paddingLeft = '0.5rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '0';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(-10px)';
                    }}
                  >
                    <span className="arrow" style={{marginRight: '0.5rem', color: '#5b9ff5', opacity: 0, transform: 'translateX(-10px)', transition: 'all 0.3s ease'}}>→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Section */}
          <div style={styles.section}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.3)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h2 style={styles.h2}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b9ff5" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Account
            </h2>
            <ul style={styles.ul}>
              {['Login', 'Register', 'Dashboard', 'My Profile', 'Settings', 'My Orders', 'Transaction History'].map((item, i) => (
                <li key={i} style={styles.li}>
                  <Link to={`/${item.toLowerCase().replace(/ /g, '-')}`} style={styles.link}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(91, 159, 245, 0.1)';
                      e.currentTarget.style.paddingLeft = '1rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '1';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(0)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#8b92b2';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.paddingLeft = '0.5rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '0';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(-10px)';
                    }}
                  >
                    <span className="arrow" style={{marginRight: '0.5rem', color: '#5b9ff5', opacity: 0, transform: 'translateX(-10px)', transition: 'all 0.3s ease'}}>→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Section */}
          <div style={styles.section}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.3)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h2 style={styles.h2}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b9ff5" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Pricing
            </h2>
            <ul style={styles.ul}>
              {['Pricing Plans', 'Compare Plans', 'Enterprise Solutions', 'Price Calculator'].map((item, i) => (
                <li key={i} style={styles.li}>
                  <Link to={`/pricing/${item.toLowerCase().replace(/ /g, '-')}`} style={styles.link}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(91, 159, 245, 0.1)';
                      e.currentTarget.style.paddingLeft = '1rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '1';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(0)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#8b92b2';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.paddingLeft = '0.5rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '0';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(-10px)';
                    }}
                  >
                    <span className="arrow" style={{marginRight: '0.5rem', color: '#5b9ff5', opacity: 0, transform: 'translateX(-10px)', transition: 'all 0.3s ease'}}>→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div style={styles.section}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.3)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h2 style={styles.h2}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b9ff5" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Support
            </h2>
            <ul style={styles.ul}>
              {['Help Center', 'Submit Ticket', 'Live Chat', 'Documentation', 'API Reference', 'System Status'].map((item, i) => (
                <li key={i} style={styles.li}>
                  <Link to={`/support/${item.toLowerCase().replace(/ /g, '-')}`} style={styles.link}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(91, 159, 245, 0.1)';
                      e.currentTarget.style.paddingLeft = '1rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '1';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(0)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#8b92b2';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.paddingLeft = '0.5rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '0';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(-10px)';
                    }}
                  >
                    <span className="arrow" style={{marginRight: '0.5rem', color: '#5b9ff5', opacity: 0, transform: 'translateX(-10px)', transition: 'all 0.3s ease'}}>→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div style={styles.section}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.3)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h2 style={styles.h2}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b9ff5" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Legal
            </h2>
            <ul style={styles.ul}>
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Refund Policy', 'Disclaimer', 'Security'].map((item, i) => (
                <li key={i} style={styles.li}>
                  <Link to={`/${item.toLowerCase().replace(/ /g, '-')}`} style={styles.link}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(91, 159, 245, 0.1)';
                      e.currentTarget.style.paddingLeft = '1rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '1';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(0)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#8b92b2';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.paddingLeft = '0.5rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '0';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(-10px)';
                    }}
                  >
                    <span className="arrow" style={{marginRight: '0.5rem', color: '#5b9ff5', opacity: 0, transform: 'translateX(-10px)', transition: 'all 0.3s ease'}}>→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div style={styles.section}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.3)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h2 style={styles.h2}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b9ff5" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Company
            </h2>
            <ul style={styles.ul}>
              {['Our Team', 'Careers', 'Press & Media', 'Partners', 'Investors'].map((item, i) => (
                <li key={i} style={styles.li}>
                  <Link to={`/about/${item.toLowerCase().replace(/ /g, '-').replace('&', 'and')}`} style={styles.link}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(91, 159, 245, 0.1)';
                      e.currentTarget.style.paddingLeft = '1rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '1';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(0)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#8b92b2';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.paddingLeft = '0.5rem';
                      e.currentTarget.querySelector('.arrow').style.opacity = '0';
                      e.currentTarget.querySelector('.arrow').style.transform = 'translateX(-10px)';
                    }}
                  >
                    <span className="arrow" style={{marginRight: '0.5rem', color: '#5b9ff5', opacity: 0, transform: 'translateX(-10px)', transition: 'all 0.3s ease'}}>→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Links */}
        <div style={styles.quickLinks}>
          <h3 style={styles.h3}>Quick Links</h3>
          <div style={styles.quickLinksGrid}>
            {[
              { icon: '🎯', label: 'Request Demo', link: '/demo' },
              { icon: '✨', label: 'Free Trial', link: '/trial' },
              { icon: '📧', label: 'Newsletter', link: '/newsletter' },
              { icon: '💬', label: 'Feedback', link: '/feedback' }
            ].map((item, i) => (
              <Link 
                key={i}
                to={item.link} 
                style={styles.quickLinkCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(91, 159, 245, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(91, 159, 245, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(91, 159, 245, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(91, 159, 245, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{fontSize: '2rem'}}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer accentColor="blue" /> 
    </div>
  );
};

export default Sitemap;