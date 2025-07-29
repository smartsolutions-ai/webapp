import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import VideoSlider from '../components/VideoSlider';
import ContactSection from '../components/ContactSection';
import AISolutionsSection from '../components/AISolutionsSection';

const HomePage = () => {
  // Add smooth scroll effect for better UX
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <Layout>
      <AISolutionsSection />
      <VideoSlider />
      <ContactSection />
    </Layout>
  );
};

export default HomePage;