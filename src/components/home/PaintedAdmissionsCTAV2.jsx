import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import { ArrowRight, Phone } from 'lucide-react';

function PaintedAdmissionsCTAV2() {
  const reduced = useReducedMotion();

  return (
    <section className="relative w-full py-28 px-4 sm:px-8 overflow-hidden" style={{ background: '#FFF8EC' }}>
      
      {/* Background Organic Waves */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="absolute w-full h-full object-cover" preserveAspectRatio="none">
          <path d="M0,500 Q300,100 800,400 T1600,200 T2000,400 L2000,1000 L0,1000 Z" fill="#FFD0AC" opacity="0.6" />
          <path d="M-100,600 Q400,200 1000,500 T1800,200 L2000,300 L2000,1000 L-100,1000 Z" fill="#FF999F" opacity="0.9" />
          <path d="M0,800 Q500,400 1200,700 T2000,600 L2000,1000 L0,1000 Z" fill="#FF5C77" opacity="0.7" />
        </svg>

        {/* Playful Decorative Elements */}
        {/* Sun */}
        <div className="absolute top-[10%] left-[5%]">
           <svg width="100" height="100" viewBox="0 0 100 100" className="text-[#FFCA28]">
             <circle cx="50" cy="50" r="25" fill="currentColor" />
             <path d="M50 35 Q40 45 35 45 Q40 50 35 60 Q45 55 50 65 Q60 55 65 60 Q60 45 65 35 Q55 45 50 35 Z" fill="#442613" />
             {Array.from({length:8}).map((_,i) => (
               <line key={i} x1="50" y1="5" x2="50" y2="15" stroke="currentColor" strokeWidth="6" strokeLinecap="round" transform={`rotate(${i*45} 50 50)`} />
             ))}
           </svg>
        </div>
        {/* Books & Pencils Left */}
        <div className="absolute bottom-[5%] left-[5%] z-20 hidden md:block">
           <div className="w-24 h-6 bg-[#42A5F5] rounded-md transform rotate-[-10deg] shadow-lg border-t border-white/50" />
           <div className="w-24 h-6 bg-[#FFCA28] rounded-md transform rotate-[-5deg] -translate-y-2 translate-x-2 shadow-lg border-t border-white/50" />
           <div className="w-24 h-6 bg-[#FF5C77] rounded-md transform -translate-y-4 translate-x-4 shadow-lg border-t border-white/50" />
        </div>
        {/* Crayons Right */}
        <div className="absolute bottom-[10%] right-[10%] z-20 hidden md:block flex gap-2 rotate-12">
           <div className="w-6 h-24 bg-[#FF5C77] rounded-t-full shadow-lg border-l border-white/50" />
           <div className="w-6 h-24 bg-[#FFCA28] rounded-t-full shadow-lg border-l border-white/50 translate-y-4" />
        </div>
        {/* Airplane */}
        <motion.div className="absolute top-[10%] right-[5%] z-20" animate={reduced ? {} : { y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity }}>
          <svg width="60" height="60" viewBox="0 0 100 100">
            <path d="M90,20 L30,40 L50,60 Z" fill="#FFCA28" />
            <path d="M90,20 L50,60 L70,80 Z" fill="#FFB300" />
          </svg>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <Reveal>
          {/* Glass Card */}
          <div className="relative w-full rounded-[40px] md:rounded-[60px] p-10 md:p-16 shadow-[0_20px_50px_rgba(255,153,159,0.3)] border-2 border-white/50 bg-white/30 backdrop-blur-xl overflow-hidden flex flex-col items-center text-center">
            
            {/* Glossy top edge */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />
            
            {/* Title */}
            <div className="relative mb-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-[900] text-[#442613] tracking-tight" style={{ fontFamily: 'Nunito, "Baloo 2", sans-serif' }}>
                Begin your child's journey
              </h2>
              {/* Starburst decor */}
              <svg className="absolute -left-12 top-0 w-8 h-8 text-[#FFCA28]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" />
              </svg>
              <svg className="absolute -right-12 bottom-0 w-8 h-8 text-[#FFCA28]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" />
              </svg>
            </div>

            {/* Badge */}
            <div className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-full mb-10 shadow-sm border border-white">
              <span className="font-bold text-[#442613] tracking-wide">Admissions are open for 2026–27</span>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              
              <Link to="/admissions">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden rounded-[30px] px-8 py-4 font-bold text-[#442613] text-xl flex items-center gap-4 shadow-[0_12px_30px_rgba(255,183,3,0.4)] border-2 border-white/60"
                  style={{ background: 'linear-gradient(180deg, #FFE082 0%, #FFB300 100%)' }}
                >
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none rounded-t-[30px]" />
                  Apply Now
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#FF8F00] shadow-inner">
                    <ArrowRight strokeWidth={3} className="w-5 h-5" />
                  </div>
                </motion.button>
              </Link>

              <a href="tel:08008533078">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden rounded-[30px] px-8 py-4 font-bold text-[#442613] text-xl flex items-center gap-4 shadow-[0_12px_30px_rgba(0,0,0,0.05)] border-2 border-white/80 bg-white/90 backdrop-blur-md"
                >
                  <div className="w-8 h-8 bg-[#FF5C77] rounded-full flex items-center justify-center text-white shadow-inner">
                    <Phone strokeWidth={3} className="w-4 h-4" />
                  </div>
                  Call: 08008533078
                </motion.button>
              </a>

            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default memo(PaintedAdmissionsCTAV2);
