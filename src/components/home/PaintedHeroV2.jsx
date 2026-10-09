import { memo, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { SCHOOL } from '../../data/school';

const stagger = {
  hidden: { opacity: 0, y: 15 },
  show: (i = 1) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.06 * i, duration: 0.6, type: 'spring', bounce: 0.2 }
  })
};

function PaintedHeroV2() {
  const reduced = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const handleMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [reduced]);

  return (
    <section className="px-3 sm:px-6 py-4 w-full">
      <div 
        className="relative w-full overflow-hidden mx-auto max-w-[1440px] rounded-[48px] min-h-[85vh] flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 lg:px-20 py-16"
        style={{
          background: 'linear-gradient(135deg, #FFF3C9 0%, #FFE9A8 100%)',
          boxShadow: '0 20px 40px rgba(255, 200, 100, 0.15)'
        }}
      >
        {/* Background Blobs & Hills */}
        <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none" preserveAspectRatio="none">
          <path d="M0,0 L100,0 Q200,200 400,0 L500,0 L500,500 L0,500 Z" fill="#FFC4A3" opacity="0.4" transform="scale(3 1) translate(-50 -200) rotate(15)" />
          <path d="M-100,600 Q300,300 800,600 Q1200,900 1600,500 L1600,1000 L-100,1000 Z" fill="#F9A98B" opacity="0.3" />
          <path d="M-200,800 Q400,400 1000,700 Q1500,800 2000,600 L2000,1200 L-200,1200 Z" fill="#FFD5A1" opacity="0.4" />
        </svg>

        {/* Left Content */}
        <div className="z-10 w-full lg:w-[50%] flex flex-col justify-center text-left pt-10 lg:pt-0">
          
          {/* Chips */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { text: 'Nursery – Grade 5', icon: '🌱', color: '#5DBE7E' },
              { text: 'CBSE', icon: '🎓', color: '#8A56E9' },
              { text: 'Smart Classrooms', icon: '💻', color: '#2C88D9' }
            ].map((chip, i) => (
              <motion.div
                key={chip.text}
                custom={i}
                initial="hidden"
                animate="show"
                variants={stagger}
                className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.06)] font-semibold text-sm text-[#3B1F14]"
              >
                <span style={{ color: chip.color }}>{chip.icon}</span> {chip.text}
              </motion.div>
            ))}
          </div>

          {/* Headline */}
          <motion.div custom={4} initial="hidden" animate="show" variants={stagger} className="relative mb-6">
            <svg className="absolute -left-12 top-10 w-8 h-8" viewBox="0 0 50 50">
              <path d="M25 0l6 18 19 2-14 13 4 17-15-10-15 10 4-17-14-13 19-2z" fill="none" stroke="#FFD54A" strokeWidth="3" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-[clamp(3rem,6.5vw,5.5rem)] font-[900] leading-[1.05] text-[#3B1F14] tracking-tight" style={{ fontFamily: 'Nunito, "Baloo 2", sans-serif' }}>
              Where little<br/>
              <span className="relative inline-block">
                dreams
                <motion.svg
                  className="absolute -inset-x-6 -inset-y-4 w-[calc(100%+3rem)] h-[calc(100%+2rem)] pointer-events-none"
                  viewBox="0 0 200 100"
                  initial={{ strokeDasharray: 600, strokeDashoffset: 600 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                >
                  <path d="M20 50C20 20 180 20 180 50C180 80 20 80 20 50Z" fill="none" stroke="#F2495C" strokeWidth="6" strokeLinecap="round" />
                </motion.svg>
                {/* Sparkle ticks */}
                <svg className="absolute -right-12 top-0 w-8 h-8" viewBox="0 0 30 30">
                  <path d="M5 15L0 15M25 15L30 15M15 5L15 0M15 25L15 30" stroke="#F2495C" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span><br/>
              begin.
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p custom={5} initial="hidden" animate="show" variants={stagger} className="text-[1.25rem] lg:text-[1.35rem] font-medium text-[#3B1F14]/80 mb-10">
            Play, discover and grow — one joyful day at a time.
          </motion.p>

          {/* Buttons */}
          <motion.div custom={6} initial="hidden" animate="show" variants={stagger} className="flex flex-wrap gap-5 relative">
            
            {/* Glossy Drops */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-6 -top-6 w-4 h-4 rounded-full bg-gradient-to-tr from-[#FFD54A] to-white shadow-sm opacity-80" />
            <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute left-40 -bottom-8 w-6 h-6 rounded-full bg-gradient-to-tr from-[#FFD54A] to-white shadow-sm opacity-60" />
            
            <Link to="/admissions" className="relative group block">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden rounded-[30px] px-8 py-4 font-bold text-[#3B1F14] text-lg flex items-center gap-3 shadow-[0_8px_20px_rgba(245,168,0,0.3)] border border-white/40"
                style={{ background: 'linear-gradient(180deg, #FFDF70 0%, #F5A800 100%)' }}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none rounded-t-[30px]" />
                Apply Now
                <svg className="w-5 h-5 bg-white/30 rounded-full p-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </motion.button>
            </Link>

            <a href={SCHOOL.phoneHref} className="relative group block">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden rounded-[30px] px-8 py-4 font-bold text-[#3B1F14] text-lg flex items-center gap-3 shadow-[0_8px_20px_rgba(255,180,190,0.3)] border border-white/60 bg-white/70 backdrop-blur-md"
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/90 to-transparent pointer-events-none rounded-t-[30px]" />
                <div className="w-8 h-8 rounded-full bg-[#F2495C] flex items-center justify-center text-white">
                  <Phone size={16} fill="currentColor" strokeWidth={0} />
                </div>
                Call {SCHOOL.phone}
              </motion.button>
            </a>
          </motion.div>
        </div>

        {/* Right Content - Illustration */}
        <div className="z-10 w-full lg:w-[50%] mt-16 lg:mt-0 relative flex justify-center items-end min-h-[400px]">
          <motion.div 
            className="w-full max-w-[600px] relative"
            animate={reduced ? {} : { x: mousePos.x * -8, y: mousePos.y * -8 }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          >
            {/* The SVG Artwork - meticulously drawn to match reference */}
            <svg viewBox="0 0 800 600" className="w-full h-auto drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
              {/* Sun & Rays */}
              <g transform="translate(150, 120)">
                <circle cx="0" cy="0" r="45" fill="#FFD54A" />
                <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }}>
                  {Array.from({length:8}).map((_,i)=>(
                    <path key={i} d="M0 -60 L0 -80" stroke="#FFD54A" strokeWidth="6" strokeLinecap="round" transform={`rotate(${i*45})`} />
                  ))}
                </motion.g>
              </g>

              {/* Clouds */}
              <motion.g animate={{ x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 40, ease: "easeInOut" }}>
                <path d="M 500 150 Q 500 130 520 130 Q 540 100 570 120 Q 590 120 600 140 Q 620 140 620 160 L 500 160 Z" fill="white" />
                <path d="M 100 250 Q 100 240 110 240 Q 120 220 140 230 Q 150 230 155 240 Q 165 240 165 250 L 100 250 Z" fill="white" opacity="0.8" />
              </motion.g>

              {/* Paper Plane */}
              <motion.g animate={{ x: [0, -30, 0], y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}>
                <path d="M 680 80 Q 640 100 580 80" fill="none" stroke="#F2495C" strokeWidth="3" strokeDasharray="8 8" strokeLinecap="round" />
                <path d="M 680 80 L 720 60 L 710 90 L 700 80 Z M 700 80 L 705 95 L 710 90" fill="#F2495C" stroke="#F2495C" strokeWidth="2" strokeLinejoin="round" />
              </motion.g>

              {/* Swoosh lines over roof */}
              <path d="M 280 250 Q 350 200 400 250 T 520 250" fill="none" stroke="#2C88D9" strokeWidth="5" strokeLinecap="round" />
              <path d="M 580 240 Q 620 210 660 250" fill="none" stroke="#2C88D9" strokeWidth="5" strokeLinecap="round" />

              {/* Grass / Ground */}
              <path d="M 50 550 Q 400 530 750 550 L 750 600 L 50 600 Z" fill="#75C158" />
              <path d="M 50 530 Q 400 500 750 530 L 750 560 L 50 560 Z" fill="#88D468" />
              
              {/* Path */}
              <path d="M 400 480 Q 430 550 550 600 L 250 600 Q 370 550 400 480 Z" fill="#FFF3C9" />
              
              {/* Back Trees */}
              <circle cx="200" cy="400" r="60" fill="#5DBE7E" />
              <path d="M 195 400 L 195 470 L 205 470 L 205 400 Z" fill="#8B5E34" />
              <circle cx="650" cy="380" r="75" fill="#4AA468" />
              <path d="M 645 380 L 645 470 L 655 470 L 655 380 Z" fill="#8B5E34" />

              {/* Picket Fence */}
              <g fill="#FFFFFF" stroke="#E5D9B1" strokeWidth="2">
                <rect x="150" y="450" width="120" height="8" />
                <rect x="150" y="470" width="120" height="8" />
                {Array.from({length:4}).map((_,i) => (
                  <path key={'L'+i} d={`M ${160+i*30} 430 L ${165+i*30} 420 L ${170+i*30} 430 L ${170+i*30} 490 L ${160+i*30} 490 Z`} />
                ))}
                
                <rect x="530" y="450" width="150" height="8" />
                <rect x="530" y="470" width="150" height="8" />
                {Array.from({length:5}).map((_,i) => (
                  <path key={'R'+i} d={`M ${540+i*30} 430 L ${545+i*30} 420 L ${550+i*30} 430 L ${550+i*30} 490 L ${540+i*30} 490 Z`} />
                ))}
              </g>

              {/* Building Base */}
              <rect x="280" y="320" width="240" height="160" fill="#FFB74D" rx="4" />
              {/* Building Columns/Edges */}
              <rect x="275" y="320" width="10" height="160" fill="#FFA726" />
              <rect x="515" y="320" width="10" height="160" fill="#FFA726" />
              
              {/* Center Projection */}
              <path d="M 360 280 L 440 280 L 440 480 L 360 480 Z" fill="#FFCC80" />

              {/* Roofs */}
              <path d="M 260 320 L 400 240 L 540 320 Z" fill="#E53935" stroke="#D32F2F" strokeWidth="8" strokeLinejoin="round" />
              <path d="M 250 320 L 360 320 L 360 330 L 250 330 Z" fill="#C62828" />
              <path d="M 440 320 L 550 320 L 550 330 L 440 330 Z" fill="#C62828" />
              <path d="M 345 280 L 400 230 L 455 280 Z" fill="#E53935" stroke="#D32F2F" strokeWidth="6" strokeLinejoin="round" />

              {/* Flag */}
              <path d="M 400 230 L 400 170" stroke="#8B5E34" strokeWidth="4" />
              <motion.path 
                animate={{ d: ["M 400 175 Q 415 165 430 175 T 450 175 L 450 195 Q 430 195 415 185 T 400 195 Z", "M 400 175 Q 415 185 430 175 T 450 175 L 450 195 Q 430 195 415 205 T 400 195 Z"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                fill="#E53935" 
              />

              {/* Clock */}
              <circle cx="400" cy="290" r="15" fill="#FFFFFF" stroke="#8B5E34" strokeWidth="3" />
              <path d="M 400 290 L 400 282 M 400 290 L 406 290" stroke="#8B5E34" strokeWidth="2" strokeLinecap="round" />

              {/* Windows */}
              {[305, 455].map(x => (
                <g key={x} transform={`translate(${x}, 350)`}>
                  <rect x="0" y="0" width="40" height="40" fill="#E3F2FD" stroke="#FFFFFF" strokeWidth="4" rx="2" />
                  <line x1="20" y1="0" x2="20" y2="40" stroke="#FFFFFF" strokeWidth="4" />
                  <line x1="0" y1="20" x2="40" y2="20" stroke="#FFFFFF" strokeWidth="4" />
                </g>
              ))}

              {/* Double Door */}
              <path d="M 370 480 L 370 410 A 30 30 0 0 1 430 410 L 430 480 Z" fill="#FFFFFF" />
              <path d="M 375 480 L 375 410 A 25 25 0 0 1 425 410 L 425 480 Z" fill="#795548" />
              <line x1="400" y1="385" x2="400" y2="480" stroke="#5D4037" strokeWidth="3" />
              <circle cx="392" cy="440" r="3" fill="#FFD54A" />
              <circle cx="408" cy="440" r="3" fill="#FFD54A" />

              {/* Bushes & Flowers */}
              <circle cx="260" cy="480" r="35" fill="#5DBE7E" />
              <circle cx="220" cy="500" r="40" fill="#4AA468" />
              <circle cx="560" cy="470" r="30" fill="#5DBE7E" />
              <circle cx="610" cy="510" r="45" fill="#4AA468" />
              
              {/* Front large bushes */}
              <path d="M 50 600 Q 150 480 280 600 Z" fill="#4AA468" />
              <path d="M 750 600 Q 650 480 520 600 Z" fill="#5DBE7E" />

              {/* Daisies */}
              {[{x: 150, y: 550}, {x: 230, y: 580}, {x: 600, y: 570}, {x: 680, y: 540}].map((pos, i) => (
                <g key={'F'+i} transform={`translate(${pos.x}, ${pos.y}) scale(0.6)`}>
                  <circle cx="0" cy="0" r="5" fill="#FFD54A" />
                  <path d="M 0 -5 L 3 -12 L -3 -12 Z M 5 0 L 12 3 L 12 -3 Z M 0 5 L 3 12 L -3 12 Z M -5 0 L -12 3 L -12 -3 Z" fill="white" />
                </g>
              ))}
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default memo(PaintedHeroV2);
