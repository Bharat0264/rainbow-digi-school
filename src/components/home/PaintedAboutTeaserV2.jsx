import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import { Leaf } from 'lucide-react';

function PaintedAboutTeaserV2() {
  const reduced = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden py-24 px-4 sm:px-8 lg:px-16" style={{ background: '#FFEDD5' }}>
      {/* Organic Wavy Backgrounds */}
      <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none" preserveAspectRatio="none" viewBox="0 0 2000 1200">
        {/* Soft peach waves */}
        <path d="M0,0 Q200,100 400,0 T800,50 T1200,0 T1600,80 L2000,0 L0,0 Z" fill="#FFDDC1" opacity="0.8" />
        <path d="M-100,200 Q200,350 500,250 T1100,300 T1600,200 L2000,1000 L-100,1000 Z" fill="#FFE4B5" opacity="0.5" />
        <path d="M-200,600 Q300,500 700,650 T1300,550 T1800,650 L2000,1200 L-200,1200 Z" fill="#FFCBA4" opacity="0.6" />
        {/* Bottom wave matching design */}
        <path d="M0,800 Q300,750 600,850 T1200,800 T1600,900 L2000,1200 L0,1200 Z" fill="#FF9E80" opacity="0.4" />
      </svg>

      {/* Playful Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sun */}
        <motion.div 
          className="absolute top-10 right-[15%]"
          animate={reduced ? {} : { rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="relative w-20 h-20 bg-[#FFB703] rounded-full shadow-[0_0_30px_#FFB703]">
            {Array.from({length:8}).map((_,i) => (
              <div 
                key={i} 
                className="absolute w-2 h-6 bg-[#FFB703] rounded-full -top-6 left-1/2 -translate-x-1/2 origin-[50%_46px]"
                style={{ transform: `translateX(-50%) rotate(${i * 45}deg)` }}
              />
            ))}
          </div>
        </motion.div>

        {/* Paper Airplane */}
        <motion.div 
          className="absolute top-12 right-12 z-20"
          animate={reduced ? {} : { y: [-10, 10, -10], x: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-lg">
            <path d="M80,20 Q60,30 40,50" fill="none" stroke="#FF5722" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
            <path d="M90,10 L30,40 L50,60 Z" fill="#FF7043" />
            <path d="M90,10 L50,60 L70,80 Z" fill="#FF5722" />
          </svg>
        </motion.div>

        {/* Stars */}
        <motion.div className="absolute top-[40%] right-[5%] text-[#FFB703]" animate={reduced ? {} : { scale: [1, 1.2, 1], rotate: [0, 15, 0] }} transition={{ duration: 4, repeat: Infinity }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 17L5.5 21L7.5 13.5L2 9H9L12 2Z" fill="#FFF3E0" stroke="#FFB703" strokeWidth="2"/></svg>
        </motion.div>
        
        {/* Floating elements left side */}
        <motion.div className="absolute top-[25%] left-[5%]" animate={reduced ? {} : { y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }}>
           <svg width="60" height="60" viewBox="0 0 100 100">
             <path d="M20,60 L30,20 L40,60 Z" fill="none" stroke="#FFB703" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
             <path d="M40,50 L50,10 L60,50 Z" fill="none" stroke="#FFB703" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
             <path d="M60,65 L75,30 L85,65 Z" fill="none" stroke="#FFB703" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
           </svg>
        </motion.div>

        {/* Decorative Plants (Bottom corners) */}
        <div className="absolute bottom-[-10px] left-[-20px] w-64 h-64 z-20">
          <svg viewBox="0 0 200 200">
            <path d="M 0 200 Q 20 100 100 200 Z" fill="#4CAF50" />
            <path d="M 0 200 Q 50 50 150 200 Z" fill="#81C784" />
            <circle cx="60" cy="150" r="12" fill="white" />
            <circle cx="60" cy="150" r="4" fill="#FFC107" />
          </svg>
        </div>
        <div className="absolute bottom-[-10px] right-[-20px] w-72 h-72 z-20">
          <svg viewBox="0 0 200 200">
            <path d="M 200 200 Q 150 50 50 200 Z" fill="#4CAF50" />
            <path d="M 200 200 Q 100 100 0 200 Z" fill="#81C784" />
            <circle cx="120" cy="140" r="15" fill="white" />
            <circle cx="120" cy="140" r="5" fill="#FFC107" />
          </svg>
        </div>
      </div>

      <div className="container flex flex-col lg:flex-row items-stretch gap-8 relative z-10">
        
        {/* Left Column: Image with thick frame */}
        <Reveal className="w-full lg:w-[45%] flex">
          <div className="w-full bg-[#FFFDF6] p-4 sm:p-6 rounded-[40px] shadow-[0_20px_40px_rgba(200,100,50,0.15)] flex flex-col border-4 border-white">
            <div className="relative w-full h-full min-h-[400px] overflow-hidden rounded-[24px]">
              <img 
                src="/images/about-building-real.jpg" 
                alt="Rainbow Digi School Building" 
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </Reveal>

        {/* Right Column: Content Card */}
        <Reveal className="w-full lg:w-[55%] flex">
          <div className="w-full bg-[#FFFDF6]/90 backdrop-blur-md rounded-[40px] shadow-[0_20px_40px_rgba(200,100,50,0.1)] p-8 sm:p-12 lg:p-16 flex flex-col justify-center border-4 border-white/60 relative">
            
            {/* Sparkle/Badge */}
            <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm w-fit mb-8 border border-gray-100">
              <Leaf className="w-5 h-5 text-[#4CAF50]" fill="#4CAF50" />
              <span className="font-bold text-[#3B1F14] tracking-wide text-sm">About Us</span>
            </div>

            {/* Headline */}
            <div className="relative">
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-[900] leading-[1.1] text-[#3B1F14] mb-6 tracking-tight" style={{ fontFamily: 'Nunito, "Baloo 2", sans-serif' }}>
                Nurturing <br />
                tomorrow's <br />
                leaders, today.
              </h2>
              {/* Red emphasis marks */}
              <svg className="absolute -right-4 bottom-[20%] w-12 h-12" viewBox="0 0 50 50">
                <path d="M 10 30 Q 30 15 45 10" fill="none" stroke="#FF5722" strokeWidth="5" strokeLinecap="round" />
                <path d="M 15 40 Q 35 25 50 20" fill="none" stroke="#FF5722" strokeWidth="5" strokeLinecap="round" />
              </svg>
              <svg className="absolute left-0 -bottom-2 w-[180px] h-[20px]" viewBox="0 0 180 20">
                <path d="M0,10 Q90,0 180,10" fill="none" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>

            {/* Description */}
            <p className="text-xl text-[#3B1F14]/80 font-medium leading-relaxed mb-10 mt-6 max-w-xl">
              At Rainbow Digi School, we blend modern digital learning with deep-rooted values. Our premium campus provides the perfect environment for your child's holistic growth.
            </p>

            {/* CTA Button */}
            <Link to="/about" className="inline-block w-fit group">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden rounded-[30px] px-10 py-5 font-bold text-[#3B1F14] text-xl flex items-center gap-4 shadow-[0_12px_30px_rgba(255,183,3,0.4)] border-2 border-[#FFE082]"
                style={{ background: 'linear-gradient(180deg, #FFD54F 0%, #FFB300 100%)' }}
              >
                {/* Glossy top highlight */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none rounded-t-[30px]" />
                
                Learn More
                
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner group-hover:translate-x-1 transition-transform">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B1F14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </motion.button>
            </Link>

          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default memo(PaintedAboutTeaserV2);
