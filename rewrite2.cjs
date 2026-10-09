const fs = require('fs');

const testimonialsCode = `import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../../data/school';
import PaintCanvas from '../ui/PaintCanvas';

export default function TestimonialsSection() {
  if (TESTIMONIALS.length === 0) return null; // Since data is empty, safely handle it
  return (
    <PaintCanvas mood="cobalt" className="py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <div className="text-center mb-16 glass glass--strong p-6 rounded-[28px]">
          <span className="text-[#38A3E8] font-bold tracking-wider uppercase text-sm mb-4 block">Testimonials</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl pg-display text-[#1F4E8C] leading-tight">
            Words from our families
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="glass p-8 md:p-10 relative flex flex-col"
            >
              <div className="text-6xl font-serif text-[#1F4E8C] opacity-20 absolute top-6 left-8">"</div>
              <div className="flex-1 mt-6 relative z-10">
                <p className="text-lg text-[#3B2412] pg-body italic leading-relaxed mb-8">
                  {testimonial.text}
                </p>
              </div>
              <div className="mt-auto pt-6 border-t border-[#1F4E8C]/20">
                <p className="font-bold text-[#1F4E8C] text-lg">{testimonial.name}</p>
                <p className="font-sans text-sm text-[#3B2412]/80">{testimonial.relation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PaintCanvas>
  );
}
`;
fs.writeFileSync('src/components/home/TestimonialsSection.jsx', testimonialsCode);

const admissionsCTACode = `import React from 'react';
import { Link } from 'react-router-dom';
import PaintCanvas from '../ui/PaintCanvas';
import PaintDivider from '../ui/PaintDivider';

export default function AdmissionsCTA() {
  return (
    <div className="relative">
      <PaintDivider className="absolute -top-1 w-full h-12 z-20 text-[#F7F1E6]" />
      <PaintCanvas mood="crimson" className="w-full px-5 py-24 sm:px-6 lg:px-24">
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center relative z-10">
          <div className="glass p-10 md:p-16 rounded-[40px] flex flex-col items-center w-full shadow-2xl">
            <h2 className="max-w-[800px] text-balance pg-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] text-[#3B2412] mb-4">
              Begin your child's journey with us
            </h2>
            <p className="text-[17px] text-[#3B2412]/80 sm:text-lg mb-8">
              Admissions are open for 2026–27
            </p>
            
            <div className="flex w-full max-w-[500px] flex-wrap justify-center gap-4 sm:flex-nowrap">
              <Link to="/admissions" className="w-full sm:w-auto">
                <button className="glass-btn-primary w-full shadow-lg">
                  Apply Now
                </button>
              </Link>
              <a href="tel:08008533078" className="w-full sm:w-auto">
                <button className="glass-btn-secondary w-full shadow-lg h-full px-[28px] rounded-full font-bold">
                  Call: 080085 33078
                </button>
              </a>
            </div>
          </div>
        </div>
      </PaintCanvas>
    </div>
  );
}
`;
fs.writeFileSync('src/components/home/AdmissionsCTA.jsx', admissionsCTACode);

const footerCode = `import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { SCHOOL } from '../../data/school';
import PaintCanvas from '../ui/PaintCanvas';
import PaintDivider from '../ui/PaintDivider';

export default function Footer() {
  return (
    <footer className="relative mt-auto">
      <PaintDivider flip className="absolute -top-8 w-full h-16 z-20 text-[#1F4E8C]" />
      <PaintCanvas mood="cobalt" parallax={false} className="pt-24 pb-8 bg-[#1F4E8C]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="glass glass--strong p-10 rounded-[40px] mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-start gap-6">
                <div className="h-14 bg-white p-2 rounded-2xl shadow-lg">
                  <Logo className="h-full" iconOnly={false} />
                </div>
                <p className="text-[#3B2412]/90 text-sm max-w-sm font-medium">
                  {SCHOOL.address.full}
                </p>
                <div className="flex items-center gap-2">
                  <span className="glass-chip">
                    {SCHOOL.rating.score} ? Google Rated
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-[#1F4E8C] mb-6 tracking-wide">Quick Links</h4>
                <ul className="flex flex-col gap-3 text-sm font-medium text-[#3B2412]/80">
                  <li><Link to="/about" className="hover:text-[#1F4E8C] transition-colors">About Us</Link></li>
                  <li><Link to="/academics" className="hover:text-[#1F4E8C] transition-colors">Academics</Link></li>
                  <li><Link to="/admissions" className="hover:text-[#1F4E8C] transition-colors">Admissions</Link></li>
                  <li><Link to="/campus" className="hover:text-[#1F4E8C] transition-colors">Campus & Gallery</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-[#1F4E8C] mb-6 tracking-wide">Contact</h4>
                <ul className="flex flex-col gap-3 text-sm font-medium text-[#3B2412]/80">
                  <li>Call: <a href={SCHOOL.phoneHref} className="text-[#1F4E8C] hover:underline font-bold">{SCHOOL.phone}</a></li>
                  <li><a href={SCHOOL.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-[#1F4E8C] transition-colors">Open in Maps</a></li>
                  <li><a href={SCHOOL.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-[#1F4E8C] transition-colors">WhatsApp us</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[#F7F1E6]/60 font-medium">
            <p>© {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Excellence Begins Early.</p>
          </div>
        </div>
      </PaintCanvas>
    </footer>
  );
}
`;
fs.writeFileSync('src/components/layout/Footer.jsx', footerCode);
