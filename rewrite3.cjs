const fs = require('fs');

const aboutCode = `import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IMAGES } from '../../data/images';
import SmartImage from '../ui/SmartImage';
import PaintCanvasV2 from '../ui/PaintCanvasV2';

export default function PaintedAboutTeaserV2() {
  return (
    <PaintCanvasV2 mood="sun" className="py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2"
        >
          <div className="pg-glass pg-glass--strong p-3 rounded-[40px] md:rounded-[60px_30px_60px_30px]">
            <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-[30px] md:rounded-[50px_20px_50px_20px]">
              <SmartImage image={IMAGES.about} className="h-full w-full" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full md:w-1/2 flex flex-col items-start pg-glass pg-glass--panel pg-glass--strong p-8 md:p-12"
        >
          <span className="pg-glass-chip mb-4">About Us</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl pg-heading text-[#3B2412] mb-6">
            <span className="pg-frosted-text">Nurturing tomorrow's leaders, today.</span>
          </h2>
          <p className="text-lg text-[#3B2412] pg-body-text mb-10 max-w-lg opacity-90">
            <span className="pg-frosted-text">At Rainbow Digi School, we blend modern digital learning with deep-rooted values. Our premium campus provides the perfect environment for your child's holistic growth.</span>
          </p>
          <Link to="/about">
            <button className="pg-btn-secondary pg-glass pg-glass--pill">
              Learn More
            </button>
          </Link>
        </motion.div>
      </div>
    </PaintCanvasV2>
  );
}
`;
fs.writeFileSync('src/components/home/PaintedAboutTeaserV2.jsx', aboutCode);

const statsCode = `import React from 'react';
import { motion } from 'framer-motion';
import { STATS } from '../../data/school';
import CountUp from '../ui/CountUp';
import PaintCanvasV2 from '../ui/PaintCanvasV2';

export default function PaintedStatsSectionV2() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <PaintCanvasV2 mood="crimson" flip className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl pg-glass pg-glass--panel pg-glass--strong p-8 sm:p-12 relative z-10">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4"
        >
          {STATS.map((stat, index) => (
            <motion.div key={index} variants={item} className="flex flex-col items-center text-center">
              <div className="mb-2 flex items-center justify-center font-['Fredoka'] text-4xl font-semibold text-[#D7263D]">
                {typeof stat.value === 'number' ? <CountUp value={stat.value} suffix={stat.suffix} decimal={stat.decimal} /> : <span>{stat.value}{stat.suffix}</span>}
              </div>
              <p className="max-w-32 text-sm font-bold text-[#3B2412] leading-tight">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PaintCanvasV2>
  );
}
`;
fs.writeFileSync('src/components/home/PaintedStatsSectionV2.jsx', statsCode);

const photoCode = `import { IMAGES } from '../../data/images';
import SmartImage from '../ui/SmartImage';
import PaintCanvasV2 from '../ui/PaintCanvasV2';
import { motion } from 'framer-motion';

export default function PaintedPhotoStripV2() { 
  const photos = [IMAGES.activity1, IMAGES.activity2, IMAGES.campus1, IMAGES.activity3]; 
  return (
    <PaintCanvasV2 mood="warm" className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl relative z-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {photos.map((image, i) => (
          <motion.div 
            key={image.key} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="pg-glass pg-glass--card p-2"
          >
            <SmartImage image={image} className="aspect-[4/3] rounded-[18px] overflow-hidden"/>
          </motion.div>
        ))}
      </div>
    </PaintCanvasV2>
  ); 
}
`;
fs.writeFileSync('src/components/home/PaintedPhotoStripV2.jsx', photoCode);

const testCode = `import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../../data/school';
import PaintCanvasV2 from '../ui/PaintCanvasV2';

export default function PaintedTestimonialsSectionV2() {
  if (TESTIMONIALS.length === 0) return null;
  return (
    <PaintCanvasV2 mood="cobalt" className="py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <div className="text-center mb-16 pg-glass pg-glass--panel pg-glass--strong p-6 inline-block">
          <span className="pg-glass-chip mb-3 inline-block">Testimonials</span>
          <h2 className="text-4xl md:text-5xl pg-heading text-[#1F4E8C]">Words from our families</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.2, duration: 0.6 }} className="pg-glass pg-glass--card pg-glass--strong p-8 md:p-10 relative flex flex-col">
              <div className="text-6xl font-serif text-[#1F4E8C] opacity-20 absolute top-6 left-8">"</div>
              <div className="flex-1 mt-6 relative z-10">
                <p className="text-lg text-[#3B2412] pg-body-text italic leading-relaxed mb-8">{testimonial.text}</p>
              </div>
              <div className="mt-auto pt-6 border-t border-[#1F4E8C]/20">
                <p className="font-bold text-[#1F4E8C] text-lg">{testimonial.name}</p>
                <p className="font-sans text-sm text-[#3B2412]/80">{testimonial.relation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PaintCanvasV2>
  );
}
`;
fs.writeFileSync('src/components/home/PaintedTestimonialsSectionV2.jsx', testCode);

const ctaCode = `import React from 'react';
import { Link } from 'react-router-dom';
import PaintCanvasV2 from '../ui/PaintCanvasV2';

export default function PaintedAdmissionsCTAV2() {
  return (
    <PaintCanvasV2 mood="crimson" className="w-full px-5 py-24 sm:px-6 lg:px-24">
      <div className="mx-auto flex max-w-[900px] flex-col items-center text-center relative z-10">
        <div className="pg-glass pg-glass--panel pg-glass--strong p-10 md:p-16 flex flex-col items-center w-full">
          <h2 className="max-w-[800px] text-balance pg-heading text-[clamp(2rem,4vw,3.5rem)] text-[#3B2412] mb-4">
            <span className="pg-frosted-text">Begin your child's journey</span>
          </h2>
          <p className="text-[17px] text-[#3B2412] font-bold sm:text-lg mb-8">
            <span className="pg-frosted-text">Admissions are open for 2026–27</span>
          </p>
          <div className="flex w-full max-w-[500px] flex-wrap justify-center gap-4 sm:flex-nowrap">
            <Link to="/admissions" className="w-full sm:w-auto">
              <button className="pg-btn-primary pg-glass pg-glass--pill pg-glass--tint w-full justify-center">Apply Now</button>
            </Link>
            <a href="tel:08008533078" className="w-full sm:w-auto">
              <button className="pg-btn-secondary pg-glass pg-glass--pill w-full justify-center bg-white/50">Call: 080085 33078</button>
            </a>
          </div>
        </div>
      </div>
    </PaintCanvasV2>
  );
}
`;
fs.writeFileSync('src/components/home/PaintedAdmissionsCTAV2.jsx', ctaCode);

const footerCode = `import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { SCHOOL } from '../../data/school';
import PaintCanvasV2 from '../ui/PaintCanvasV2';

export default function PaintedFooterV2() {
  return (
    <footer className="relative mt-auto">
      <PaintCanvasV2 mood="footer" className="pt-24 pb-8 bg-[#F7F1E6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="pg-glass pg-glass--panel p-10 mb-8 border border-white/40" style={{ background: 'rgba(255,255,255,0.85)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-start gap-6">
                <div className="h-14">
                  <Logo className="h-full" iconOnly={false} />
                </div>
                <p className="text-[#3B2412]/90 text-sm max-w-sm font-medium">{SCHOOL.address.full}</p>
                <span className="pg-glass-chip bg-white/80">{SCHOOL.rating.score} ? Google Rated</span>
              </div>
              <div>
                <h4 className="font-bold text-[#1F4E8C] mb-6 tracking-wide">Quick Links</h4>
                <ul className="flex flex-col gap-3 text-sm font-medium text-[#3B2412]/80">
                  {['about', 'academics', 'admissions', 'campus'].map(path => (
                    <li key={path}><Link to={"/" + path} className="hover:text-[#1F4E8C] capitalize">{path === 'campus' ? 'Campus & Gallery' : path.replace('-', ' ')}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#1F4E8C] mb-6 tracking-wide">Contact</h4>
                <ul className="flex flex-col gap-3 text-sm font-medium text-[#3B2412]/80">
                  <li>Call: <a href={SCHOOL.phoneHref} className="text-[#1F4E8C] font-bold">{SCHOOL.phone}</a></li>
                  <li><a href={SCHOOL.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-[#1F4E8C]">Open in Maps</a></li>
                  <li><a href={SCHOOL.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-[#1F4E8C]">WhatsApp us</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[#3B2412]/60 font-bold pg-glass pg-glass--pill px-6 py-3">
            <p>© {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Excellence Begins Early.</p>
          </div>
        </div>
      </PaintCanvasV2>
    </footer>
  );
}
`;
fs.writeFileSync('src/components/layout/PaintedFooterV2.jsx', footerCode);
