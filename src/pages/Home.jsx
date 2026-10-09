import { memo } from 'react';
import { motion } from 'framer-motion';
import PaintedHeroV2 from '../components/home/PaintedHeroV2';
import PaintedAboutTeaserV2 from '../components/home/PaintedAboutTeaserV2';
import PaintedStatsSectionV2 from '../components/home/PaintedStatsSectionV2';
import PaintedProgramsCardV2 from '../components/home/PaintedProgramsCardV2';
import PaintedPhotoStripV2 from '../components/home/PaintedPhotoStripV2';
import PaintedCampusGalleryV2 from '../components/home/PaintedCampusGalleryV2';
import PaintedAdmissionsCTAV2 from '../components/home/PaintedAdmissionsCTAV2';

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#FFF8EC]"
    >
      <PaintedHeroV2 />
      <PaintedAboutTeaserV2 />
      <PaintedStatsSectionV2 />
      <PaintedProgramsCardV2 />
      <PaintedPhotoStripV2 />
      <PaintedCampusGalleryV2 />
      <PaintedAdmissionsCTAV2 />
    </motion.div>
  );
}

export default memo(Home);
