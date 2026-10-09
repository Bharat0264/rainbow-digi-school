import React from 'react';
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
