import React from 'react';
import { motion } from 'framer-motion';
import { STATS } from '../../data/school';
import CountUp from '../ui/CountUp';

export default function StatsSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="bg-royal-blue py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-gold/30"
        >
          {STATS.map((stat, index) => (
            <motion.div 
              key={index} 
              variants={item}
              className={`flex flex-col items-center text-center ${index > 0 ? 'pt-8 md:pt-0' : ''}`}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-serif text-gold mb-2 flex items-center justify-center">
                <CountUp end={Number(stat.value)} decimals={stat.decimal ? 1 : 0} suffix={stat.suffix || ""} />
              </div>
              <p className="text-white font-sans text-sm md:text-base uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
