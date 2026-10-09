import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../../data/school';

export default function TestimonialsSection() {
  return (
    <section className="bg-champagne py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-16">
          <span className="text-gold-deep font-sans font-semibold tracking-wider uppercase text-sm mb-4 block">Testimonials</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-royal-blue leading-tight">
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
              className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm relative flex flex-col"
            >
              <div className="text-6xl font-serif text-gold/30 absolute top-6 left-8">"</div>
              <div className="flex-1 mt-6">
                <p className="text-lg text-espresso-muted font-serif italic leading-relaxed mb-8">
                  {testimonial.text}
                </p>
              </div>
              <div className="mt-auto pt-6 border-t border-champagne">
                <p className="font-serif text-royal-blue font-semibold text-lg">{testimonial.name}</p>
                <p className="font-sans text-sm text-warm-gray">{testimonial.relation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
