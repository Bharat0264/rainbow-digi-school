import React from 'react';
import { motion } from 'framer-motion';
import PaintedHero from '../components/home/PaintedHero';
import AboutTeaser from '../components/home/AboutTeaser';
import StatsSection from '../components/home/StatsSection';
import PaintedProgramsCard from '../components/home/PaintedProgramsCard';
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
      <PaintedHero />
      <AboutTeaser />
      <StatsSection />
      <PaintedProgramsCard />
      <PhotoStrip />
      <TestimonialsSection />
      <AdmissionsCTA />
    </motion.div>
  );
}
