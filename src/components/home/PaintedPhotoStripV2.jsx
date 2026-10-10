import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import { Calculator, Monitor, Building2, Palette, ArrowRight } from 'lucide-react';

function PaintedPhotoStripV2() {
  const reduced = useReducedMotion();

  const cards = [
    {
      title: "Play and Learn",
      gradient: "from-[#FFE082] to-[#FFCA28]",
      wave: "#FFD54F",
      icon: <Calculator className="w-12 h-12 text-[#1565C0]" strokeWidth={2} />,
      link: "/academics"
    },
    {
      title: "Play and Learn",
      gradient: "from-[#FFCDD2] to-[#EF9A9A]",
      wave: "#E57373",
      icon: <Monitor className="w-12 h-12 text-[#1E88E5]" strokeWidth={2} />,
      link: "/academics"
    },
    {
      title: "Campus moment",
      gradient: "from-[#BBDEFB] to-[#90CAF9]",
      wave: "#64B5F6",
      icon: <Building2 className="w-12 h-12 text-[#F44336]" strokeWidth={2} fill="#FFCA28" />,
      link: "/campus"
    },
    {
      title: "Play and Learn",
      gradient: "from-[#E1BEE7] to-[#CE93D8]",
      wave: "#BA68C8",
      icon: <Palette className="w-12 h-12 text-[#FF9800]" strokeWidth={2} fill="white" />,
      link: "/academics"
    }
  ];

  return (
    <section className="relative w-full py-20 px-4 sm:px-8 overflow-hidden" style={{ background: '#FFF8EC' }}>
      
      {/* Background Liquid Waves */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="absolute w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 2000 1200">
          <path d="M0,100 Q400,-50 800,100 T1600,150 T2000,50 L2000,1200 L0,1200 Z" fill="#FFD0AC" opacity="0.6" />
          <path d="M-100,300 Q300,150 700,350 T1400,200 L2000,400 L2000,1200 L-100,1200 Z" fill="#FFD54F" opacity="0.3" />
        </svg>
      </div>

      <div className="container relative z-10">
        
        {/* Horizontal Card Grid */}
        <div className="w-full grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {cards.map((card, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div className="relative w-full aspect-square md:aspect-[4/5] rounded-[30px] md:rounded-[40px] shadow-[0_15px_30px_rgba(0,0,0,0.08)] bg-white border border-white/60 overflow-hidden group flex flex-col justify-end">
                
                {/* Colored Top Area */}
                <div className={`absolute inset-0 bg-gradient-to-b ${card.gradient} opacity-80`} />
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-white/70 to-transparent z-10 pointer-events-none" />
                
                {/* Wavy bottom color */}
                <svg className="absolute inset-x-0 bottom-16 w-full h-32" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z" fill={card.wave} opacity="0.8" />
                </svg>

                {/* Glass Bubble & Icon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-6">
                   <motion.div 
                     whileHover={{ scale: 1.1, y: -5 }}
                     className="w-32 h-32 rounded-full border border-white/80 shadow-[0_10px_20px_rgba(0,0,0,0.05),inset_0_-5px_15px_rgba(0,0,0,0.1),inset_0_5px_15px_rgba(255,255,255,0.9)] bg-white/30 backdrop-blur-md flex items-center justify-center relative overflow-hidden z-20"
                   >
                      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent" />
                      {card.icon}
                   </motion.div>
                </div>

                {/* Bottom Text Panel */}
                <div className="relative z-30 m-4 p-4 rounded-[24px] bg-white/90 backdrop-blur-md flex items-center justify-between border border-white">
                  <h4 className="font-bold text-[#442613] text-lg px-2">{card.title}</h4>
                  <Link to={card.link}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFCA28] to-[#FF8F00] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(PaintedPhotoStripV2);
