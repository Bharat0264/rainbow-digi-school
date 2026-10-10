import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from '../ui/Reveal';
import { GraduationCap, User, Star, MessageSquare } from 'lucide-react';

function PaintedStatsSectionV2() {
  const reduced = useReducedMotion();

  const stats = [
    {
      icon: <GraduationCap className="w-8 h-8 text-white" strokeWidth={2.5} />,
      color: "bg-[#FF5C77]",
      title: "Nursery - 5",
      subtitle: "Learning years",
    },
    {
      icon: <User className="w-8 h-8 text-white" strokeWidth={2.5} />,
      color: "bg-[#FF8A65]",
      title: "24+",
      subtitle: "Years of principal experience",
    },
    {
      icon: <Star className="w-8 h-8 text-white" strokeWidth={2.5} fill="currentColor" />,
      color: "bg-[#FFCA28]",
      title: "4.9 ★",
      subtitle: "Google rating",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-white" strokeWidth={2.5} fill="currentColor" />,
      color: "bg-[#FF5C77]",
      title: "31",
      subtitle: "Google reviews",
    }
  ];

  return (
    <section className="relative w-full py-16 overflow-hidden" style={{ background: '#FFF8EC' }}>
      
      {/* Background Liquid Waves */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="absolute w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 2000 1200">
          {/* Top pink wave */}
          <path d="M0,80 Q250,-20 500,50 T1000,20 T1500,80 L2000,0 L0,0 Z" fill="#FFB3C5" opacity="0.6" />
          {/* Bottom peach/pink wave */}
          <path d="M-100,1000 Q200,800 600,950 T1200,850 T1800,1000 L2000,1200 L-100,1200 Z" fill="#FFD0AC" opacity="0.8" />
          <path d="M500,1200 Q900,900 1300,1050 T1800,950 L2000,1200 Z" fill="#FF999F" opacity="0.7" />
        </svg>

        {/* Floating playful elements */}
        <motion.div className="absolute top-[20%] left-[10%] text-[#FFD34F]" animate={reduced ? {} : { rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
           <svg width="40" height="40" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="20" fill="currentColor" />
             {Array.from({length:8}).map((_,i) => (
               <line key={i} x1="50" y1="10" x2="50" y2="25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" transform={`rotate(${i*45} 50 50)`} />
             ))}
           </svg>
        </motion.div>

        <motion.div className="absolute bottom-[20%] right-[10%] text-[#8BD58B]" animate={reduced ? {} : { y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
           <svg width="60" height="60" viewBox="0 0 100 100">
             <path d="M50,90 Q80,70 90,40 Q60,30 50,60 Q40,30 10,40 Q20,70 50,90 Z" fill="currentColor" />
           </svg>
        </motion.div>
      </div>

      <div className="container relative z-10">
        <Reveal>
          {/* Glass Card */}
          <div className="relative w-full rounded-[40px] md:rounded-[60px] p-8 md:p-12 shadow-[0_20px_50px_rgba(255,153,159,0.2)] border-2 border-white/60 bg-white/40 backdrop-blur-xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            
            {/* Top/Left edge glossy highlight */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />
            
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center w-full md:w-1/4 relative group">
                
                {/* Vertical Divider for desktop (skip for last) */}
                {index !== stats.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-[20%] bottom-[20%] w-[1px] bg-red-200/50" />
                )}

                {/* 3D Bubble Icon */}
                <motion.div 
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="relative w-24 h-24 mb-6 rounded-full flex items-center justify-center border border-white/80 shadow-[0_10px_20px_rgba(0,0,0,0.05),inset_0_-5px_15px_rgba(0,0,0,0.1),inset_0_5px_15px_rgba(255,255,255,0.8)] bg-white/30 backdrop-blur-md"
                >
                  <div className={`w-16 h-16 rounded-full ${stat.color} flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.2)] relative overflow-hidden`}>
                     {/* Glossy inner reflection */}
                     <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent" />
                     {stat.icon}
                  </div>
                </motion.div>
                
                {/* Text */}
                <h3 className="text-3xl md:text-4xl font-[900] text-[#D81B60] mb-2 tracking-tight font-sans">
                  {stat.title}
                </h3>
                <p className="text-[#514B49] font-medium text-sm md:text-base max-w-[150px]">
                  {stat.subtitle}
                </p>

              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default memo(PaintedStatsSectionV2);
