import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <header className="header" >
      <div className="container">
        <div className="header-content">
          <motion.div 
            className="header-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>AI Solutions Landing Page</h1>
            <p className="subtitle">Smart Solutions for Your Business Needs</p>
          </motion.div>
          <nav className="nav-links">
            <Link href="/login" className="nav-link">
              Login
            </Link>
          </nav>
        </div>
      </div>
      <style jsx>{`
        .header {
          position: relative;
          width: 100%;
          padding: 4rem 0;
          background: #7fabcc;
          color: white;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 30vh;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 1rem;
        }
        
        .header-title {
          margin-bottom: 1.5rem;
        }
        
        .header-title h1 {
          font-size: 2.8rem;
          margin: 0 0 1rem 0 !important;
          padding: 0 2rem;
          color: white;
          text-align: center;
          width: 100%;
        }
        
        .subtitle {
          font-size: 1.25rem;
          margin: 0;
          opacity: 0.9;
          font-weight: 300;
        }
        
        .header-title {
          margin-bottom: 1.5rem;
        }
        
        .brand-logo:hover {
          transform: translateY(-2px);
        }
        
        .nav-links {
          display: flex;
          gap: 1.5rem;
        }
        
        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .nav-link:hover {
          color: #00ff88;
        }
        
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
