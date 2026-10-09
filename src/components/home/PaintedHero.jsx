import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Star } from 'lucide-react';
import { SCHOOL } from '../../data/school';
import PaintCanvas from '../ui/PaintCanvas';
import { SchoolIllustration } from '../ui/Crayon';

const AnimatedStroke = () => {
  return (
    <svg 
      className="absolute -bottom-2 left-0 w-full h-4 text-[--crimson]" 
      viewBox="0 0 100 20" 
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d="M 0 10 Q 25 18 50 12 T 100 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        viewport={{ once: true }}
      />
    </svg>
  );
};

const InteractivePrimaryBtn = ({ children, to }) => {
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      className="relative inline-block"
    >
      <Link
        to={to}
        ref={btnRef}
        onMouseMove={handleMouseMove}
        className="glass-btn-primary group relative overflow-hidden px-8 py-4 rounded-full text-[--ink] font-bold text-lg inline-flex items-center justify-center bg-[--sun]/90 backdrop-blur-md shadow-lg transition-transform"
        style={{
          background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(255,255,255,0.6) 0%, rgba(255,190,0,0.8) 50%)`,
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8), 0 8px 24px rgba(245,130,31,0.3)',
          border: '1px solid rgba(255,255,255,0.6)'
        }}
      >
        <span className="relative z-10">{children}</span>
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(255,255,255,0.8) 0%, transparent 60%)`,
          }}
        />
      </Link>
    </motion.div>
  );
};

export default function PaintedHero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center p-4 lg:p-8 overflow-hidden rounded-[40px]">
      <PaintCanvas mood="warm" className="absolute inset-0 z-0 rounded-[40px] overflow-hidden" />
      
      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left Content */}
        <div className="flex flex-col items-start space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-3"
          >
            {['Nursery–Grade 5', 'CBSE', 'Smart Classrooms'].map((badge, idx) => (
              <span key={idx} className="glass-chip px-4 py-1.5 rounded-full text-sm font-medium text-[--ink] bg-white/30 backdrop-blur-md border border-white/40 shadow-sm">
                {badge}
              </span>
            ))}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-fredoka font-bold text-[--ink] leading-tight"
          >
            Where little <span className="relative inline-block text-[--crimson]">
              dreams
              <AnimatedStroke />
            </span> begin.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <InteractivePrimaryBtn to="/admissions">
              Apply now
            </InteractivePrimaryBtn>
            
            <motion.a 
              whileTap={{ scale: 0.96 }}
              href={`tel:${SCHOOL.phone.replace(/\s+/g, '')}`}
              className="glass-btn-secondary px-6 py-4 rounded-full text-[--ink] font-medium border border-[--ink]/20 bg-white/20 backdrop-blur-md shadow-sm hover:bg-white/30 transition-colors inline-flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              <span>Call {SCHOOL.phone}</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Right Content */}
        <div className="relative lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0">
          {/* Floating Rating Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 4 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="absolute -top-6 left-0 lg:-left-10 z-20 glass px-6 py-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex items-center gap-3"
            style={{
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 10px 30px rgba(0,0,0,0.05)'
            }}
          >
            <div className="relative">
              <Star className="w-8 h-8 text-[--sun] fill-[--sun]" />
              <motion.div
                animate={{ rotate: 360, opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-white blur-md rounded-full pointer-events-none mix-blend-overlay"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[--ink] leading-none">4.9</span>
              <span className="text-xs text-[--ink]/70 font-medium">Google Rating</span>
            </div>
          </motion.div>

          {/* Main Glass Window / Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full max-w-md aspect-square rounded-[40px] glass bg-white/20 backdrop-blur-2xl border border-white/50 overflow-hidden flex items-center justify-center p-8"
            style={{
              boxShadow: 'inset 0 -10px 20px rgba(255,255,255,0.15), inset 0 10px 24px rgba(0,0,0,0.06), 0 20px 40px rgba(0,0,0,0.08)'
            }}
          >
            {/* Paint splash behind illustration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--sun)_0%,transparent_70%)] opacity-30 mix-blend-multiply pointer-events-none" aria-hidden="true" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[--crimson] rounded-full blur-3xl opacity-20 pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[--azure] rounded-full blur-3xl opacity-20 pointer-events-none" aria-hidden="true" />
            
            <div className="relative z-10 w-full h-full">
              <SchoolIllustration className="w-full h-full object-contain drop-shadow-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
