import React from 'react';
import styles from '../styles/ContactSection.module.css';

const ContactSection: React.FC = () => {
  return (
    <section className={styles.contactSection} id="contact">
      <div className={styles.container}>
        <h2>Get Started</h2>
        <p>Ready to transform your business with our AI solutions? Contact us today for a free consultation.</p>
        
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <h3>Contact Information</h3>
            <p>Email: info@aisolutions.com</p>
            <p>Phone: (555) 123-4567</p>
            <p>Address: 123 AI Street, Tech City, TC 12345</p>
          </div>
          
          <form className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} required></textarea>
            </div>
            
            <button type="submit" className={styles.submitButton}>Send Message</button>
          </form>
        </div>
      </div>
      <style jsx>{`
        .contactSection {
          padding: 4rem 0;
          background-color: #ECEFCA;
          color: #333;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #333;
          font-weight: 700;
        }
        
        .contactGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }
        
        .contactInfo {
          background: rgba(0, 0, 0, 0.1);
          padding: 2rem;
          border-radius: 15px;
          text-align: center;
        }
        
        .contactForm {
          background: rgba(0, 0, 0, 0.1);
          padding: 2rem;
          border-radius: 15px;
          text-align: center;
        }
        
        .formGroup {
          margin-bottom: 1.5rem;
        }
        
        .contactForm input,
        .contactForm textarea {
          width: 100%;
          padding: 0.8rem;
          border: none;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #333;
          font-size: 1rem;
        }
        
        .submitButton {
          width: 100%;
          padding: 1rem;
          background: #333;
          color: #ECEFCA;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .submitButton:hover {
          background: #444;
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .contactGrid {
            grid-template-columns: 1fr;
          }
          
          .contactInfo,
          .contactForm {
            padding: 1.5rem;
          }
          
          h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default ContactSection;
