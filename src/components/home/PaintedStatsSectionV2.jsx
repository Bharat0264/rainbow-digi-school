import React from 'react';
import { motion } from 'framer-motion';
import { STATS } from '../../data/school';
import CountUp from '../ui/CountUp';
import PaintCanvasV2 from '../ui/PaintCanvasV2';

export default function PaintedStatsSectionV2() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <PaintCanvasV2 mood="crimson" flip className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl pg-glass pg-glass--panel pg-glass--strong p-8 sm:p-12 relative z-10">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4"
        >
          {STATS.map((stat, index) => (
            <motion.div key={index} variants={item} className="flex flex-col items-center text-center">
              <div className="mb-2 flex items-center justify-center font-['Fredoka'] text-4xl font-semibold text-[#D7263D]">
                {typeof stat.value === 'number' ? <CountUp value={stat.value} suffix={stat.suffix} decimal={stat.decimal} /> : <span>{stat.value}{stat.suffix}</span>}
              </div>
              <p className="max-w-32 text-sm font-bold text-[#3B2412] leading-tight">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PaintCanvasV2>
  );
}
