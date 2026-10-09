import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IMAGES } from '../../data/images';
import SmartImage from '../ui/SmartImage';
import PaintCanvasV2 from '../ui/PaintCanvasV2';

export default function PaintedAboutTeaserV2() {
  return (
    <PaintCanvasV2 mood="sun" className="py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2"
        >
          <div className="pg-glass pg-glass--strong p-3 rounded-[40px] md:rounded-[60px_30px_60px_30px]">
            <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-[30px] md:rounded-[50px_20px_50px_20px]">
              <SmartImage image={IMAGES.about} className="h-full w-full" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full md:w-1/2 flex flex-col items-start pg-glass pg-glass--panel pg-glass--strong p-8 md:p-12"
        >
          <span className="pg-glass-chip mb-4">About Us</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl pg-heading text-[#3B2412] mb-6">
            <span className="pg-frosted-text">Nurturing tomorrow's leaders, today.</span>
          </h2>
          <p className="text-lg text-[#3B2412] pg-body-text mb-10 max-w-lg opacity-90">
            <span className="pg-frosted-text">At Rainbow Digi School, we blend modern digital learning with deep-rooted values. Our premium campus provides the perfect environment for your child's holistic growth.</span>
          </p>
          <Link to="/about">
            <button className="pg-btn-secondary pg-glass pg-glass--pill">
              Learn More
            </button>
          </Link>
        </motion.div>
      </div>
    </PaintCanvasV2>
  );
}
