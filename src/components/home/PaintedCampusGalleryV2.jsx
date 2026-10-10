import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import { Image as ImageIcon, ArrowRight } from 'lucide-react';
import { IMAGES } from '../../data/images';

function PaintedCampusGalleryV2() {
  const reduced = useReducedMotion();

  // We use placeholder images or existing images from IMAGES
  const galleryImages = [
    { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop", alt: "Students learning" },
    { src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop", alt: "Art classroom" },
    { src: "https://images.unsplash.com/photo-1587691592099-24045742c181?q=80&w=1200&auto=format&fit=crop", alt: "Science lab" },
    { src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop", alt: "Library" }
  ];

  return (
    <section className="relative w-full py-24 px-4 sm:px-8 lg:px-16 overflow-hidden" style={{ background: '#FFFAFA' }}>
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="absolute w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 2000 1200">
          <path d="M0,200 Q400,0 1000,300 T2000,100 L2000,1200 L0,1200 Z" fill="#FFF0F5" opacity="0.6" />
        </svg>
        <motion.div className="absolute top-[10%] right-[10%] text-[#FFB3C5]" animate={reduced ? {} : { rotate: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
           <svg width="60" height="60" viewBox="0 0 100 100">
             <path d="M50 20 Q60 5 75 20 A 20 20 0 0 1 50 60 A 20 20 0 0 1 25 20 Q40 5 50 20 Z" fill="currentColor" />
           </svg>
        </motion.div>
      </div>

      <div className="container relative z-10 flex flex-col items-center">
        
        {/* Badge & Heading */}
        <Reveal className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm w-fit mb-6 border border-gray-100">
            <ImageIcon className="w-5 h-5 text-[#FF5C77]" fill="currentColor" />
            <span className="font-bold text-[#FF5C77] tracking-wide text-sm">Campus Gallery</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-[900] text-[#442613] tracking-tight mb-4" style={{ fontFamily: 'Nunito, "Baloo 2", sans-serif' }}>
            A space to grow and explore
          </h2>
        </Reveal>

        {/* Gallery Grid */}
        <div className="w-full grid gap-4 md:gap-6 mb-16" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {galleryImages.map((img, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative w-full rounded-[30px] overflow-hidden shadow-md border-4 border-white group"
                style={{ aspectRatio: '4/3' }}
              >
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* CTA Button */}
        <Reveal>
          <Link to="/campus">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-white px-8 py-4 font-bold text-[#FF5C77] text-lg flex items-center gap-3 shadow-[0_10px_20px_rgba(255,92,119,0.15)] border border-[#FFB3C5]"
            >
              View Campus Gallery
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </Reveal>

      </div>
    </section>
  );
}

export default memo(PaintedCampusGalleryV2);
