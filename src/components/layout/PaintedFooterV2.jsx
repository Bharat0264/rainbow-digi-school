import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Navigation2, Send, GraduationCap, Home, BookOpen, Image as ImageIcon, Star, ArrowRight } from 'lucide-react';
import { IMAGES } from '../../data/images';

function PaintedFooterV2() {
  const reduced = useReducedMotion();

  return (
    <footer className="relative w-full overflow-hidden pt-24 pb-8 px-4 sm:px-8" style={{ background: '#FFF8EC' }}>
      
      {/* Background Liquid Waves */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="absolute w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 2000 1200">
          <path d="M-100,600 Q300,100 800,200 T1600,100 L2000,0 L2000,1200 L-100,1200 Z" fill="#BBDEFB" opacity="0.6" />
          <path d="M0,800 Q500,400 1200,600 T2000,400 L2000,1200 L0,1200 Z" fill="#90CAF9" opacity="0.5" />
          <path d="M-200,900 Q400,600 1000,800 T2000,700 L2000,1200 L-200,1200 Z" fill="#4CAF50" opacity="0.8" />
          <path d="M0,1000 Q600,800 1400,950 T2000,850 L2000,1200 L0,1200 Z" fill="#81C784" opacity="0.9" />
        </svg>

        {/* Playful Floating Elements */}
        {/* Sun */}
        <motion.div className="absolute top-[5%] left-[5%] text-[#FFCA28]" animate={reduced ? {} : { rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
           <svg width="120" height="120" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="25" fill="currentColor" />
             {Array.from({length:12}).map((_,i) => (
               <line key={i} x1="50" y1="5" x2="50" y2="15" stroke="currentColor" strokeWidth="6" strokeLinecap="round" transform={`rotate(${i*30} 50 50)`} />
             ))}
           </svg>
        </motion.div>
        
        {/* Books on the left */}
        <div className="absolute bottom-[10%] left-[5%] z-20 hidden md:block">
           <div className="w-28 h-8 bg-[#FF5C77] rounded-md transform rotate-[-5deg] shadow-lg border-t-2 border-white/40" />
           <div className="w-28 h-8 bg-[#42A5F5] rounded-md transform rotate-[-2deg] -translate-y-2 translate-x-2 shadow-lg border-t-2 border-white/40" />
           <div className="w-28 h-8 bg-[#8BD58B] rounded-md transform -translate-y-4 translate-x-4 shadow-lg border-t-2 border-white/40" />
        </div>

        {/* Airplane */}
        <motion.div className="absolute top-[10%] right-[10%] z-20" animate={reduced ? {} : { y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity }}>
          <svg width="60" height="60" viewBox="0 0 100 100">
            <path d="M90,20 L30,40 L50,60 Z" fill="#FFCA28" />
            <path d="M90,20 L50,60 L70,80 Z" fill="#FFB300" />
          </svg>
        </motion.div>
      </div>

      <div className="container relative z-10 flex flex-col items-center">
        
        {/* Main Glass Panel */}
        <div className="relative w-full rounded-[40px] md:rounded-[50px] p-8 md:p-12 lg:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-2 border-white/70 bg-white/60 backdrop-blur-xl overflow-hidden flex flex-col md:flex-row gap-12 md:gap-8 mb-6">
          
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/90 to-transparent pointer-events-none" />

          {/* Col 1: Branding & Address */}
          <div className="flex-1 flex flex-col items-start relative z-10">
            <img src={IMAGES.logo} alt="Rainbow Digi School" className="h-16 md:h-20 mb-2 object-contain" />
            <p className="text-[#1565C0] font-bold tracking-widest text-xs mb-6 uppercase">Excellence begins early</p>
            
            <div className="flex gap-4 items-start mb-6 text-[#514B49]">
              <div className="w-8 h-8 rounded-full bg-[#FFCDD2] flex shrink-0 items-center justify-center text-[#D32F2F]">
                <MapPin className="w-4 h-4" />
              </div>
              <p className="text-sm leading-relaxed max-w-[250px] font-medium">
                Plot No. 104, Padmasree Enclave, near Sanjana Courtyard, Kandalakoya, Hyderabad, Telangana 501401
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100">
              <svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <span className="font-bold text-[#442613]">4.9</span>
              <Star className="w-4 h-4 text-[#FFCA28]" fill="currentColor" />
              <span className="text-[#514B49] text-sm font-medium">Google Rated</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex-1 relative z-10">
            <h3 className="text-xl font-[900] text-[#1565C0] mb-6 flex items-center gap-2">
              Quick Links
              <svg className="w-4 h-4 text-[#FFCA28]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 17L5.5 21L7.5 13.5L2 9H9L12 2Z"/></svg>
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'School Life', path: '/school-life', icon: Home, bg: 'bg-[#FFE082]', color: 'text-[#F57F17]' },
                { name: 'Academics', path: '/academics', icon: BookOpen, bg: 'bg-[#BBDEFB]', color: 'text-[#1976D2]' },
                { name: 'Admissions', path: '/admissions', icon: GraduationCap, bg: 'bg-[#FFCDD2]', color: 'text-[#D32F2F]' },
                { name: 'Campus & Gallery', path: '/campus', icon: ImageIcon, bg: 'bg-[#E1BEE7]', color: 'text-[#7B1FA2]' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="flex items-center gap-4 text-[#514B49] hover:text-[#1565C0] transition-colors group">
                    <div className={`w-10 h-10 rounded-full ${link.bg} flex items-center justify-center ${link.color} shadow-sm group-hover:scale-110 transition-transform`}>
                      <link.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-[15px] flex-1">{link.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="flex-1 relative z-10">
            <h3 className="text-xl font-[900] text-[#1565C0] mb-6 flex items-center gap-2">
              Contact
              <svg className="w-4 h-4 text-[#FFCA28]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 17L5.5 21L7.5 13.5L2 9H9L12 2Z"/></svg>
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Call: 080085 33078', href: 'tel:08008533078', icon: Phone, bg: 'bg-[#FFCDD2]', color: 'text-[#D32F2F]' },
                { name: 'Open in Maps', href: 'https://maps.google.com', icon: Navigation2, bg: 'bg-[#BBDEFB]', color: 'text-[#1976D2]' },
                { name: 'WhatsApp us', href: 'https://wa.me/918008533078', icon: MessageCircle, bg: 'bg-[#C8E6C9]', color: 'text-[#388E3C]' },
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[#514B49] hover:text-[#1565C0] transition-colors group">
                    <div className={`w-10 h-10 rounded-full ${link.bg} flex items-center justify-center ${link.color} shadow-sm group-hover:scale-110 transition-transform`}>
                      <link.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-[15px] flex-1">{link.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Decorative Schoolhouse 3D Illustration Overlay */}
          <div className="absolute -bottom-4 right-4 md:-right-8 lg:right-0 w-48 h-48 md:w-64 md:h-64 pointer-events-none z-20 hidden sm:block">
             <div className="relative w-full h-full">
               <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
                 {/* Base */}
                 <rect x="50" y="80" width="100" height="80" fill="#FFCA28" rx="5" />
                 <rect x="50" y="150" width="100" height="10" fill="#FFB300" />
                 {/* Door */}
                 <rect x="90" y="110" width="20" height="40" fill="#42A5F5" rx="2" />
                 <rect x="92" y="112" width="16" height="38" fill="#1E88E5" rx="1" />
                 <circle cx="106" cy="130" r="2" fill="#FFCA28" />
                 {/* Windows */}
                 <rect x="60" y="100" width="15" height="20" fill="#E1F5FE" rx="2" />
                 <rect x="60" y="130" width="15" height="20" fill="#E1F5FE" rx="2" />
                 <rect x="125" y="100" width="15" height="20" fill="#E1F5FE" rx="2" />
                 <rect x="125" y="130" width="15" height="20" fill="#E1F5FE" rx="2" />
                 {/* Roof */}
                 <path d="M40 80 L100 30 L160 80 Z" fill="#FF5C77" />
                 <path d="M100 30 L160 80 L150 80 L100 40 L50 80 L40 80 Z" fill="#FF8A80" />
                 {/* Clock */}
                 <circle cx="100" cy="90" r="8" fill="white" />
                 <line x1="100" y1="90" x2="100" y2="85" stroke="#442613" strokeWidth="1.5" strokeLinecap="round" />
                 <line x1="100" y1="90" x2="104" y2="90" stroke="#442613" strokeWidth="1.5" strokeLinecap="round" />
                 {/* Flag */}
                 <rect x="98" y="10" width="4" height="20" fill="#B0BEC5" />
                 <path d="M102 10 L120 15 L102 20 Z" fill="#FFCA28" />
               </svg>
             </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="w-full relative z-20">
          <div className="rounded-full bg-white/50 backdrop-blur-md border border-white/60 p-1 flex flex-col md:flex-row items-center justify-between text-[#514B49] text-sm shadow-[0_10px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 px-4 py-2">
              <svg className="w-4 h-4 text-[#FF5C77]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <span>© 2026 Rainbow Digi School. All rights reserved.</span>
            </div>
            <div className="hidden md:block w-[1px] h-4 bg-gray-300" />
            <div className="px-4 py-2 font-bold text-[#442613] italic" style={{ fontFamily: 'Nunito, "Baloo 2", sans-serif' }}>
              Excellence Begins Early.
            </div>
            <div className="hidden md:block w-[1px] h-4 bg-gray-300" />
            <a href="https://my-work-umber.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-full transition-colors group">
              <Send className="w-4 h-4 text-[#1565C0] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              <span className="font-bold text-[#1565C0]">Crafted by Garuda</span>
              <svg className="w-3 h-3 text-[#1565C0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default memo(PaintedFooterV2);
