import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IMAGES } from '../../data/images';
import SmartImage from '../ui/SmartImage';

export default function AboutTeaser() {
  return (
    <section className="bg-champagne py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2"
        >
          <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-[40px] md:rounded-[80px_40px_80px_40px]">
            <SmartImage image={IMAGES.about} className="h-full w-full" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full md:w-1/2 flex flex-col items-start"
        >
          <span className="text-gold-deep font-sans font-semibold tracking-wider uppercase text-sm mb-4">About Us</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-royal-blue leading-tight mb-6">
            Nurturing tomorrow's leaders, today.
          </h2>
          <p className="text-lg text-espresso-muted font-sans mb-10 max-w-lg">
            At Rainbow Digi School, we blend modern digital learning with deep-rooted values. Our premium campus provides the perfect environment for your child's holistic growth.
          </p>
          <Link 
            to="/about"
            className="group inline-flex items-center gap-2 text-royal-blue font-sans font-medium text-lg border-b-2 border-gold pb-1 hover:text-gold-deep transition-colors"
          >
            Learn More <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
