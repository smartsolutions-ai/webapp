import React from 'react';
import Image from 'next/image';
import styles from '../styles/AISolutionsSection.module.css';

const AISolutionsSection = () => {
  return (
    <section className={styles.solutionsSection}>
      <div className={styles.container}>
        
        <div className={styles.solutionsGrid}>
          {/* Solution 1 */}
          <div className={`${styles.solutionCard} ${styles.solution1}`}>
            <div className={styles.imageContainer}>
              <Image 
                src="/images/ai-solutions/analytics.png" 
                alt="AI Analytics" 
                width={80} 
                height={80}
                className={styles.solutionImage}
              />
            </div>
            <h3>AI-Powered Analytics</h3>
            <p>Transform your data into actionable insights with our advanced AI analytics platform.</p>
            <a href="#learn-more" className={styles.learnMoreLink}>
              Learn more <span>→</span>
            </a>
          </div>
          
          {/* Solution 2 */}
          <div className={`${styles.solutionCard} ${styles.solution2}`}>
            <div className={styles.imageContainer}>
              <Image 
                src="/images/ai-solutions/automation.png" 
                alt="Intelligent Automation" 
                width={80} 
                height={80}
                className={styles.solutionImage}
              />
            </div>
            <h3>Intelligent Automation</h3>
            <p>Streamline operations and reduce costs with our intelligent automation solutions.</p>
            <a href="#learn-more" className={styles.learnMoreLink}>
              Learn more <span>→</span>
            </a>
          </div>
          
          {/* Solution 3 */}
          <div className={`${styles.solutionCard} ${styles.solution3}`}>
            <div className={styles.imageContainer}>
              <Image 
                src="/images/ai-solutions/predictive.png" 
                alt="Predictive Modeling" 
                width={80} 
                height={80}
                className={styles.solutionImage}
              />
            </div>
            <h3>Predictive Modeling</h3>
            <p>Anticipate market trends and customer behavior with our predictive analytics.</p>
            <a href="#learn-more" className={styles.learnMoreLink}>
              Learn more <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISolutionsSection;
