import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ACADEMICS } from '../../data/school';

export default function ProgramsPreview() {
  return (
    <section className="bg-ivory py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-16">
          <span className="text-gold-deep font-sans font-semibold tracking-wider uppercase text-sm mb-4 block">Academics</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-royal-blue leading-tight">
            Programs that inspire
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mb-16">
          {ACADEMICS.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                <img 
                  src={program.image || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80"} 
                  alt={program.stage} 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-serif text-royal-blue mb-2">{program.stage}</h3>
              <p className="text-sm font-sans font-semibold text-gold-deep mb-3 uppercase tracking-wider">{program.grades}</p>
              <p className="text-espresso-muted font-sans line-clamp-2">
                {program.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        <Link to="/academics">
          <button className="bg-espresso text-white hover:bg-espresso-light px-8 py-4 rounded-full font-sans font-medium flex items-center gap-2 transition-colors">
            Explore Academics <span>→</span>
          </button>
        </Link>
      </div>
    </section>
  );
}
