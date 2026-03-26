import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';

const CookiePolicy = () => {
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
      maxWidth: '900px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
      background: 'rgba(26, 29, 53, 0.6)',
      border: '1px solid rgba(91, 159, 245, 0.1)',
      borderRadius: '16px',
      padding: '3rem',
      backdropFilter: 'blur(10px)',
    },
    h1: {
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '0.5rem',
      background: 'linear-gradient(135deg, #5b9ff5 0%, #e879f9 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    lastUpdated: {
      color: '#8b92b2',
      fontSize: '0.9rem',
      marginBottom: '2rem',
      fontStyle: 'italic',
    },
    section: {
      marginBottom: '2.5rem',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid rgba(91, 159, 245, 0.2)',
    },
    paragraph: {
      color: '#8b92b2',
      lineHeight: '1.8',
      marginBottom: '1rem',
      fontSize: '1rem',
    },
    ul: {
      listStyle: 'none',
      paddingLeft: 0,
      marginBottom: '1rem',
    },
    li: {
      color: '#8b92b2',
      lineHeight: '1.8',
      marginBottom: '0.75rem',
      paddingLeft: '1.5rem',
      position: 'relative',
    },
    strong: {
      color: '#ffffff',
    },
    table: {
      background: 'rgba(10, 11, 26, 0.5)',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid rgba(91, 159, 245, 0.1)',
      margin: '1.5rem 0',
      width: '100%',
    },
    tableRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr',
      gap: '1rem',
      padding: '1rem 1.5rem',
      borderBottom: '1px solid rgba(91, 159, 245, 0.1)',
    },
    tableHeader: {
      background: 'rgba(91, 159, 245, 0.1)',
      fontWeight: '700',
      color: '#ffffff',
    },
    tableCell: {
      color: '#8b92b2',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
    },
    contactInfo: {
      background: 'rgba(91, 159, 245, 0.05)',
      borderLeft: '3px solid #5b9ff5',
      padding: '1.5rem',
      borderRadius: '8px',
      marginTop: '1rem',
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
        <h1 style={styles.h1}>Cookie Policy</h1>
        <p style={styles.lastUpdated}>Last Updated: February 16, 2026</p>

        <section style={styles.section}>
          <h2 style={styles.h2}>What Are Cookies</h2>
          <p style={styles.paragraph}>
            Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
            They are widely used to make websites work more efficiently and provide information to the owners of the site.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>How We Use Cookies</h2>
          <p style={styles.paragraph}>BizBridge uses cookies for the following purposes:</p>
          <ul style={styles.ul}>
            <li style={styles.li}>
              <span style={{position: 'absolute', left: 0, color: '#5b9ff5', fontWeight: 'bold'}}>→</span>
              <strong style={styles.strong}>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
            </li>
            <li style={styles.li}>
              <span style={{position: 'absolute', left: 0, color: '#5b9ff5', fontWeight: 'bold'}}>→</span>
              <strong style={styles.strong}>Analytics Cookies:</strong> We use these cookies to understand how visitors interact with our website, helping us improve user experience.
            </li>
            <li style={styles.li}>
              <span style={{position: 'absolute', left: 0, color: '#5b9ff5', fontWeight: 'bold'}}>→</span>
              <strong style={styles.strong}>Functionality Cookies:</strong> These cookies allow the website to remember choices you make and provide enhanced features.
            </li>
            <li style={styles.li}>
              <span style={{position: 'absolute', left: 0, color: '#5b9ff5', fontWeight: 'bold'}}>→</span>
              <strong style={styles.strong}>Marketing Cookies:</strong> We use these cookies to deliver relevant advertisements and track campaign performance.
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Types of Cookies We Use</h2>
          <div style={styles.table}>
            <div style={{...styles.tableRow, ...styles.tableHeader}}>
              <div style={styles.tableCell}>Cookie Name</div>
              <div style={styles.tableCell}>Purpose</div>
              <div style={styles.tableCell}>Duration</div>
            </div>
            <div style={styles.tableRow}>
              <div style={styles.tableCell}>_bizbridge_session</div>
              <div style={styles.tableCell}>Essential - Maintains user session</div>
              <div style={styles.tableCell}>Session</div>
            </div>
            <div style={styles.tableRow}>
              <div style={styles.tableCell}>_bizbridge_token</div>
              <div style={styles.tableCell}>Essential - Authentication token</div>
              <div style={styles.tableCell}>30 days</div>
            </div>
            <div style={styles.tableRow}>
              <div style={styles.tableCell}>_ga</div>
              <div style={styles.tableCell}>Analytics - Google Analytics</div>
              <div style={styles.tableCell}>2 years</div>
            </div>
            <div style={{...styles.tableRow, borderBottom: 'none'}}>
              <div style={styles.tableCell}>_fbp</div>
              <div style={styles.tableCell}>Marketing - Facebook Pixel</div>
              <div style={styles.tableCell}>90 days</div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Managing Cookies</h2>
          <p style={styles.paragraph}>
            You can control and manage cookies in various ways. Please note that removing or blocking cookies 
            can impact your user experience and parts of our website may no longer be fully accessible.
          </p>
          <p style={styles.paragraph}>
            Most browsers automatically accept cookies, but you can modify your browser settings to decline 
            cookies if you prefer. Instructions for managing cookies in popular browsers:
          </p>
          <ul style={styles.ul}>
            <li style={styles.li}>
              <span style={{position: 'absolute', left: 0, color: '#5b9ff5', fontWeight: 'bold'}}>→</span>
              <strong style={styles.strong}>Chrome:</strong> Settings → Privacy and security → Cookies and other site data
            </li>
            <li style={styles.li}>
              <span style={{position: 'absolute', left: 0, color: '#5b9ff5', fontWeight: 'bold'}}>→</span>
              <strong style={styles.strong}>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
            </li>
            <li style={styles.li}>
              <span style={{position: 'absolute', left: 0, color: '#5b9ff5', fontWeight: 'bold'}}>→</span>
              <strong style={styles.strong}>Safari:</strong> Preferences → Privacy → Cookies and website data
            </li>
            <li style={styles.li}>
              <span style={{position: 'absolute', left: 0, color: '#5b9ff5', fontWeight: 'bold'}}>→</span>
              <strong style={styles.strong}>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Third-Party Cookies</h2>
          <p style={styles.paragraph}>
            In addition to our own cookies, we may also use various third-party cookies to report usage 
            statistics of the website and deliver advertisements on and through the website.
          </p>
          <p style={styles.paragraph}>Our third-party partners include:</p>
          <ul style={styles.ul}>
            <li style={styles.li}>
              <span style={{position: 'absolute', left: 0, color: '#5b9ff5', fontWeight: 'bold'}}>→</span>
              Google Analytics - for website analytics
            </li>
            <li style={styles.li}>
              <span style={{position: 'absolute', left: 0, color: '#5b9ff5', fontWeight: 'bold'}}>→</span>
              Facebook - for social media integration and advertising
            </li>
            <li style={styles.li}>
              <span style={{position: 'absolute', left: 0, color: '#5b9ff5', fontWeight: 'bold'}}>→</span>
              LinkedIn - for professional networking features
            </li>
            <li style={styles.li}>
              <span style={{position: 'absolute', left: 0, color: '#5b9ff5', fontWeight: 'bold'}}>→</span>
              Stripe - for payment processing
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Changes to This Cookie Policy</h2>
          <p style={styles.paragraph}>
            We may update our Cookie Policy from time to time. We will notify you of any changes by posting 
            the new Cookie Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Contact Us</h2>
          <p style={styles.paragraph}>
            If you have any questions about our use of cookies, please contact us at:
          </p>
          <div style={styles.contactInfo}>
            <p style={{...styles.paragraph, marginBottom: '0.5rem'}}>
              <strong style={styles.strong}>Email:</strong> privacy@bizbridge.com
            </p>
            <p style={{...styles.paragraph, marginBottom: '0.5rem'}}>
              <strong style={styles.strong}>Phone:</strong> +1 (555) 123-4567
            </p>
            <p style={{...styles.paragraph, marginBottom: 0}}>
              <strong style={styles.strong}>Address:</strong> 123 Business Street, Tech City, TC 12345
            </p>
          </div>
        </section>
      </div>
      <Footer accentColor="blue" /> 
    </div>
  );
};

export default CookiePolicy;