import React from 'react';
import { motion } from 'framer-motion';
import PaintedHeroV2 from '../components/home/PaintedHeroV2';
import PaintedAboutTeaserV2 from '../components/home/PaintedAboutTeaserV2';
import PaintedStatsSectionV2 from '../components/home/PaintedStatsSectionV2';
import PaintedProgramsCardV2 from '../components/home/PaintedProgramsCardV2';
import PaintedPhotoStripV2 from '../components/home/PaintedPhotoStripV2';
import PaintedTestimonialsSectionV2 from '../components/home/PaintedTestimonialsSectionV2';
import PaintedAdmissionsCTAV2 from '../components/home/PaintedAdmissionsCTAV2';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#F7F1E6]"
    >
      <PaintedHeroV2 />
      <PaintedAboutTeaserV2 />
      <PaintedStatsSectionV2 />
      <PaintedProgramsCardV2 />
      <PaintedPhotoStripV2 />
      <PaintedTestimonialsSectionV2 />
      <PaintedAdmissionsCTAV2 />
    </motion.div>
  );
}
