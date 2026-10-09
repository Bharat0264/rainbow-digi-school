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
    <section className="px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-white/80 bg-gradient-to-br from-[#fff3c4] via-[#ffe27a] to-[#ffc93c]/80 px-5 py-10 shadow-[0_16px_36px_rgba(181,125,22,.13)] sm:px-8">
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
              <div className="mb-2 flex items-center justify-center font-['Fredoka'] text-3xl font-semibold text-[#4a2e0a] sm:text-4xl">
                {typeof stat.value === 'number' ? (
                  <CountUp value={stat.value} suffix={stat.suffix} decimal={stat.decimal} />
                ) : (
                  <span>{stat.value}{stat.suffix}</span>
                )}
              </div>
              <p className="max-w-32 text-sm font-semibold leading-5 text-[#6b5535]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
