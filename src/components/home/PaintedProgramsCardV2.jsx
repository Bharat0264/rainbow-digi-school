import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import { GraduationCap, ArrowRight } from 'lucide-react';

function PaintedProgramsCardV2() {
  const reduced = useReducedMotion();

  const programs = [
    {
      title: "Early Years",
      grades: "Nursery – LKG – UKG",
      description: "Play and Learn gives early curiosity room to grow.",
      gradient: "from-[#FFD54F] to-[#FFB300]",
      blob: "#FFE082",
      iconColor: "text-[#FF8F00]",
      link: "/academics#early-years",
      visual: (
        <div className="relative w-full h-48 flex items-center justify-center">
           {/* Abstract ABC Blocks & Book */}
           <div className="absolute w-16 h-16 bg-[#FF5C77] rounded-lg rotate-12 transform -translate-x-12 -translate-y-4 shadow-lg flex items-center justify-center border-t-2 border-white/40 z-20">
             <span className="text-white font-bold text-3xl font-sans">A</span>
           </div>
           <div className="absolute w-16 h-16 bg-[#42A5F5] rounded-lg -rotate-6 transform -translate-x-4 translate-y-6 shadow-lg flex items-center justify-center border-t-2 border-white/40 z-30">
             <span className="text-white font-bold text-3xl font-sans">B</span>
           </div>
           <div className="absolute w-16 h-16 bg-[#FFCA28] rounded-lg rotate-6 transform translate-x-10 translate-y-2 shadow-lg flex items-center justify-center border-t-2 border-white/40 z-10">
             <span className="text-white font-bold text-3xl font-sans">C</span>
           </div>
           <div className="absolute w-24 h-16 bg-white rounded-md transform translate-x-20 translate-y-12 shadow-md rotate-12 z-0 border border-gray-100 flex items-center justify-center">
             <div className="w-20 h-[2px] bg-gray-200 mt-2" />
           </div>
        </div>
      )
    },
    {
      title: "Primary",
      grades: "Grades 1 – 5",
      description: "CBSE-aligned learning made hands-on, thoughtful and connected.",
      gradient: "from-[#64B5F6] to-[#1E88E5]",
      blob: "#90CAF9",
      iconColor: "text-[#1565C0]",
      link: "/academics#primary",
      visual: (
        <div className="relative w-full h-48 flex items-center justify-center">
           {/* Abstract Books & Lightbulb */}
           <div className="absolute w-28 h-8 bg-[#FF5C77] rounded-md transform -translate-x-4 translate-y-4 shadow-lg border-t-2 border-white/40 z-30" />
           <div className="absolute w-28 h-8 bg-[#FFCA28] rounded-md transform -translate-x-4 translate-y-10 shadow-lg border-t-2 border-white/40 z-20" />
           <div className="absolute w-28 h-8 bg-[#42A5F5] rounded-md transform -translate-x-4 translate-y-16 shadow-lg border-t-2 border-white/40 z-10" />
           
           <motion.div 
             animate={reduced ? {} : { y: [0, -10, 0] }} 
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="absolute w-16 h-16 bg-[#FFD54F] rounded-full transform translate-x-16 -translate-y-4 shadow-[0_0_30px_#FFD54F] border-4 border-white flex flex-col items-center justify-end overflow-hidden z-40"
           >
             <div className="w-8 h-4 bg-gray-700 rounded-t-sm" />
           </motion.div>
        </div>
      )
    }
  ];

  return (
    <section className="relative w-full py-20 px-4 sm:px-8 lg:px-16 overflow-hidden" style={{ background: '#E1F5FE' }}>
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="absolute w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 2000 1200">
          <path d="M0,0 Q300,50 600,0 T1200,50 T1800,0 L2000,50 L2000,1200 L0,1200 Z" fill="#BBDEFB" opacity="0.4" />
        </svg>
        <div className="absolute top-[10%] left-[5%] text-[#FFD34F]">
          <svg width="80" height="80" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="25" fill="currentColor" />
             <path d="M50 35 Q40 45 35 45 Q40 50 35 60 Q45 55 50 65 Q60 55 65 60 Q60 45 65 35 Q55 45 50 35 Z" fill="#442613" />
          </svg>
        </div>
        <motion.div className="absolute top-[15%] right-[10%] z-20" animate={reduced ? {} : { y: [-10, 10, -10], x: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity }}>
          <svg width="60" height="60" viewBox="0 0 100 100">
            <path d="M90,20 L30,40 L50,60 Z" fill="#FFCA28" />
            <path d="M90,20 L50,60 L70,80 Z" fill="#FFB300" />
            <path d="M90,20 Q70,40 40,60" fill="none" stroke="#FFA000" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        </motion.div>
      </div>

      <div className="container relative z-10 flex flex-col items-center">
        
        {/* Badge & Heading */}
        <Reveal className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm w-fit mb-6">
            <GraduationCap className="w-5 h-5 text-[#1565C0]" fill="currentColor" />
            <span className="font-bold text-[#1565C0] tracking-wide text-sm">Academics</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-[900] text-[#442613] tracking-tight" style={{ fontFamily: 'Nunito, "Baloo 2", sans-serif' }}>
            Programs that inspire
          </h2>
          <svg className="w-48 h-4 mt-2" viewBox="0 0 200 20">
            <path d="M10,10 Q100,0 190,10" fill="none" stroke="#FFCA28" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </Reveal>

        {/* Cards */}
        <div className="w-full grid gap-8 mb-16" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {programs.map((program, idx) => (
            <Reveal key={idx}>
              <div className="relative w-full rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] bg-white border-2 border-white overflow-hidden group">
                
                {/* Top Colored/Glass Area */}
                <div className={`w-full h-[240px] bg-gradient-to-br ${program.gradient} relative overflow-hidden flex items-center justify-center p-6`}>
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                  <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                  {/* Organic blob behind visual */}
                  <svg className="absolute w-[120%] h-[120%] opacity-40 -bottom-10" viewBox="0 0 200 200">
                    <path d="M 0 200 Q 100 100 200 150 L 200 200 Z" fill={program.blob} />
                  </svg>
                  {program.visual}
                </div>
                
                {/* Bottom Content Area */}
                <div className="p-8 md:p-10 bg-white relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-4 h-4 rounded-full bg-current ${program.iconColor}`} />
                        <h3 className="text-3xl font-[900] text-[#442613] font-sans tracking-tight">{program.title}</h3>
                      </div>
                      <p className="text-sm font-bold text-[#1565C0] mb-4 tracking-wide">{program.grades}</p>
                      <p className="text-[#514B49] text-base leading-relaxed">
                        {program.description}
                      </p>
                    </div>
                    <Link to={program.link} className="shrink-0 mt-2">
                      <div className="w-12 h-12 rounded-full bg-[#FFF3E0] flex items-center justify-center text-[#FF8F00] group-hover:scale-110 group-hover:bg-[#FF8F00] group-hover:text-white transition-all shadow-sm">
                        <ArrowRight strokeWidth={2.5} />
                      </div>
                    </Link>
                  </div>
                </div>
                
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA Button */}
        <Reveal>
          <Link to="/academics">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-white px-8 py-4 font-bold text-[#1565C0] text-lg flex items-center gap-3 shadow-md border border-white"
            >
              Explore academics
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </Reveal>

      </div>
    </section>
  );
}

export default memo(PaintedProgramsCardV2);
