import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ACADEMICS } from '../../data/school';
import PaintCanvas from '../ui/PaintCanvas';

const AnimatedUnderline = () => {
  return (
    <svg 
      className="absolute -bottom-3 left-0 w-full h-3 text-[--azure]" 
      viewBox="0 0 100 20" 
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d="M 0 15 Q 30 5 60 12 T 100 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      />
    </svg>
  );
};

const TiltCard = ({ program, index, isMobile }) => {
  const cardRef = useRef(null);
  
  // Motion values for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Map to rotations (-6deg to 6deg)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate normalized mouse position (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    x.set(0);
    y.set(0);
  };

  // Assign colors based on index for variety
  const colors = [
    { bg: 'bg-[--orange]', text: 'text-[--orange]' },
    { bg: 'bg-[--azure]', text: 'text-[--azure]' },
    { bg: 'bg-[--crimson]', text: 'text-[--crimson]' },
  ];
  const color = colors[index % colors.length];
  
  const Icon = program.icon;

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={isMobile ? { scale: 0.98 } : {}}
      className="relative w-full h-full perspective-[800px] group"
    >
      {/* Background paint blob */}
      <div 
        className={`absolute inset-0 scale-75 blur-3xl opacity-40 rounded-full pointer-events-none transition-transform duration-500 group-hover:scale-100 ${color.bg}`}
        aria-hidden="true"
        style={{ transform: 'translateZ(-50px)' }}
      />

      {/* Glass Card */}
      <div 
        className="glass h-full p-8 rounded-[32px] bg-white/20 backdrop-blur-xl border border-white/50 flex flex-col relative z-10 overflow-hidden"
        style={{
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -10px 20px rgba(255,255,255,0.15), 0 15px 35px rgba(0,0,0,0.05)',
          transform: 'translateZ(0px)'
        }}
      >
        {/* Specular Rim Highlight */}
        <div className="absolute inset-0 rounded-[32px] pointer-events-none border border-white/60 mix-blend-overlay" />
        
        {/* Glass Bead Icon */}
        <div 
          className="w-16 h-16 rounded-full glass mb-6 flex items-center justify-center relative shadow-sm border border-white/60 bg-white/40 backdrop-blur-md"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* Inner colored glow */}
          <div className={`absolute inset-0 rounded-full opacity-20 blur-md ${color.bg}`} />
          {Icon && typeof Icon === 'object' || typeof Icon === 'function' ? (
             <Icon className={`w-8 h-8 relative z-10 ${color.text}`} />
          ) : (
            <span className="text-2xl relative z-10">{program.icon}</span>
          )}
        </div>

        <h3 className="text-2xl font-bold font-fredoka text-[--ink] mb-2" style={{ transform: 'translateZ(10px)' }}>
          {program.title}
        </h3>
        <p className="text-sm font-bold text-[--ink]/60 uppercase tracking-wider mb-4" style={{ transform: 'translateZ(10px)' }}>
          {program.grades}
        </p>
        <p className="text-[--ink]/80 leading-relaxed flex-grow" style={{ transform: 'translateZ(5px)' }}>
          {program.description}
        </p>
      </div>
    </motion.div>
  );
};

export default function PaintedProgramsCard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use only Early Years and Primary for this section
  const displayPrograms = ACADEMICS.slice(0, 2);

  return (
    <section className="relative w-full py-24 px-4 lg:px-8 overflow-hidden rounded-[40px] my-12">
      <PaintCanvas mood="cobalt" className="absolute inset-0 z-0 rounded-[40px] overflow-hidden" />
      
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center relative inline-block"
        >
          <h2 className="text-4xl lg:text-6xl font-fredoka font-bold text-[--ink]">
            Programs that inspire
          </h2>
          <AnimatedUnderline />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-16">
          {displayPrograms.map((program, index) => (
            <TiltCard 
              key={program.id || index} 
              program={program} 
              index={index} 
              isMobile={isMobile} 
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link 
            to="/academics"
            className="glass-btn-secondary px-8 py-4 rounded-full text-[--ink] font-bold text-lg border-2 border-[--cobalt]/20 bg-white/30 backdrop-blur-md shadow-lg hover:bg-white/40 hover:scale-105 transition-all inline-flex items-center gap-2 relative overflow-hidden group"
            style={{
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 10px 20px rgba(31,78,140,0.1)'
            }}
          >
            <span className="relative z-10">Explore academics</span>
            {/* Hover reflection */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
