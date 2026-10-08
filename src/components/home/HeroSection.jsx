import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SCHOOL } from '../../data/school';
import AnimatedHeading from '../ui/AnimatedHeading';
import MagneticButton from '../ui/MagneticButton';

export default function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative w-full min-h-screen bg-ivory flex flex-col md:flex-row items-center pt-24 pb-12 overflow-hidden px-6 md:px-16 lg:px-24">
      {/* Content Area */}
      <div className="w-full md:w-3/5 z-10 flex flex-col justify-center pr-0 md:pr-12 mb-12 md:mb-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-champagne mb-8 self-start w-auto">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-xs md:text-sm font-sans font-medium text-royal-blue">4.9 ★ Rated by 31 Parents on Google</span>
        </div>
        
        <AnimatedHeading className="text-5xl md:text-7xl lg:text-8xl font-serif text-royal-blue leading-tight mb-6">
          Excellence Begins Early
        </AnimatedHeading>
        
        <p className="text-lg md:text-xl text-espresso-muted font-sans max-w-xl mb-10">
          {SCHOOL.name} – Premium digital education in the heart of Kandlakoya, Hyderabad.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Link to="/admissions">
            <MagneticButton className="bg-gold text-royal-blue hover:bg-gold-deep px-8 py-4 rounded-full font-sans font-medium flex items-center gap-2 transition-colors">
              Apply Now <span>→</span>
            </MagneticButton>
          </Link>
          <Link to="/campus">
            <MagneticButton className="bg-transparent border border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white px-8 py-4 rounded-full font-sans font-medium flex items-center gap-2 transition-colors">
              Take a Tour <span>→</span>
            </MagneticButton>
          </Link>
        </div>
      </div>

      {/* Image Area */}
      <div className="w-full md:w-2/5 h-[50vh] md:h-[80vh] relative mt-8 md:mt-0">
        <motion.div 
          style={{ y, borderRadius: '9999px 9999px 24px 24px' }}
          className="w-full h-full overflow-hidden"
        >
          <img 
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80" 
            alt="Students learning brightly" 
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Floating badge */}
        <div className="absolute bottom-6 right-6 lg:bottom-12 lg:-left-12 bg-white/80 backdrop-blur-lg px-6 py-4 rounded-2xl shadow-xl z-20">
          <p className="font-serif text-lg text-royal-blue font-bold">4.9 ★ on Google</p>
          <p className="font-sans text-sm text-espresso-muted">31 Reviews</p>
        </div>
      </div>
    </section>
  );
}
