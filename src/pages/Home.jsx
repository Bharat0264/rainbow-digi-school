import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import AboutTeaser from '../components/home/AboutTeaser';
import StatsSection from '../components/home/StatsSection';
import ProgramsPreview from '../components/home/ProgramsPreview';
import PhotoStrip from '../components/home/PhotoStrip';
import TestimonialsSection from '../components/home/TestimonialsSection';
import AdmissionsCTA from '../components/home/AdmissionsCTA';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <HeroSection />
      <AboutTeaser />
      <StatsSection />
      <ProgramsPreview />
      <PhotoStrip />
      <TestimonialsSection />
      <AdmissionsCTA />
    </motion.div>
  );
}
