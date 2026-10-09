const fs = require('fs');

const aboutCode = `import React from 'react';
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
`;
fs.writeFileSync('src/components/home/AboutTeaser.jsx', aboutCode);

const statsCode = `import React from 'react';
import { motion } from 'framer-motion';
import { STATS } from '../../data/school';
import CountUp from '../ui/CountUp';
import PaintCanvas from '../ui/PaintCanvas';

export default function StatsSection() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } }
  };

  return (
    <PaintCanvas mood="warm" className="px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-6xl glass p-8 sm:p-12 relative z-10">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4"
        >
          {STATS.map((stat, index) => (
            <motion.div 
              key={index} 
              variants={item}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-2 flex items-center justify-center font-['Fredoka'] text-3xl font-semibold text-[#3B2412] sm:text-4xl">
                {typeof stat.value === 'number' ? (
                  <CountUp value={stat.value} suffix={stat.suffix} decimal={stat.decimal} />
                ) : (
                  <span>{stat.value}{stat.suffix}</span>
                )}
              </div>
              <p className="max-w-32 text-sm font-semibold leading-5 text-[#3B2412] opacity-80">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PaintCanvas>
  );
}
`;
fs.writeFileSync('src/components/home/StatsSection.jsx', statsCode);

const photoCode = `import { IMAGES } from '../../data/images';
import SmartImage from '../ui/SmartImage';
import PaintCanvas from '../ui/PaintCanvas';
import PaintDivider from '../ui/PaintDivider';
import { motion } from 'framer-motion';

export default function PhotoStrip() { 
  const photos = [IMAGES.activity1, IMAGES.activity2, IMAGES.campus1, IMAGES.activity3]; 
  return (
    <div className="relative">
      <PaintDivider className="absolute -top-1 w-full h-12 z-20 text-[#F7F1E6]" />
      <PaintCanvas mood="green" className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {photos.map((image, i) => (
              <motion.div 
                key={image.key} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass p-2"
              >
                <SmartImage image={image} className="aspect-[4/3] rounded-2xl overflow-hidden"/>
              </motion.div>
            ))}
          </div>
        </div>
      </PaintCanvas>
      <PaintDivider flip className="absolute -bottom-1 w-full h-12 z-20 text-[#F7F1E6]" />
    </div>
  ); 
}
`;
fs.writeFileSync('src/components/home/PhotoStrip.jsx', photoCode);
