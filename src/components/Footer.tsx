import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>SmartSolution.AI</h3>
            <p>Transforming futures with AI-powered solutions</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li>About Us</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Solutions</h4>
              <ul>
                <li>Job Interview Prep</li>
                <li>College Rankings</li>
                <li>Stock Analysis</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} SmartSolution.AI. All rights reserved.</p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer {
          background: #1a1a1a;
          color: white;
          padding: 4rem 0 2rem;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .footer-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .footer-brand {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .footer-brand h3 {
          font-size: 1.5rem;
          color: #00ff88;
          margin-bottom: 0.5rem;
        }
        
        .footer-brand p {
          color: #999;
        }
        
        .footer-links {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .footer-column {
          h4 {
            font-size: 1rem;
            margin-bottom: 1rem;
            color: #00ff88;
          }
          
          ul {
            list-style: none;
            padding: 0;
          }
          
          li {
            margin-bottom: 0.5rem;
            color: #999;
          }
        }
        
        .footer-bottom {
          text-align: center;
          color: #666;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 768px) {
          .footer-content {
            padding: 2rem 1rem;
          }
          
          .footer-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
