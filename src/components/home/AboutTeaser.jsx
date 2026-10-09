import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IMAGES } from '../../data/images';
import SmartImage from '../ui/SmartImage';
import PaintCanvas from '../ui/PaintCanvas';

export default function AboutTeaser() {
  return (
    <PaintCanvas mood="sun" className="py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="w-full md:w-1/2"
        >
          <div className="glass p-4 rounded-[40px] md:rounded-[60px_30px_60px_30px]">
            <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-[30px] md:rounded-[50px_20px_50px_20px]">
              <SmartImage image={IMAGES.about} className="h-full w-full" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="w-full md:w-1/2 flex flex-col items-start glass glass--tint p-8 md:p-12"
        >
          <span className="text-white font-bold tracking-wider uppercase text-sm mb-4 glass-chip glass--strong">About Us</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl pg-display text-[#3B2412] leading-tight mb-6">
            Nurturing tomorrow's leaders, today.
          </h2>
          <p className="text-lg text-[#3B2412] pg-body mb-10 max-w-lg opacity-80">
            At Rainbow Digi School, we blend modern digital learning with deep-rooted values. Our premium campus provides the perfect environment for your child's holistic growth.
          </p>
          <Link 
            to="/about"
            className="glass-btn-primary"
          >
            Learn More
          </Link>
        </motion.div>
      </div>
    </PaintCanvas>
  );
}
