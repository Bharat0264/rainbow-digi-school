import React from 'react';
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
