import React from 'react';
import { Link } from 'react-router-dom';

export default function AdmissionsCTA() {
  return (
    <section className="bg-royal-blue py-24 px-6 md:px-16 lg:px-24 w-full">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight mb-6">
          Begin your child's journey with us
        </h2>
        <p className="text-xl text-white/80 font-sans mb-12">
          Admissions are open for 2026–27
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/admissions">
            <button className="w-full sm:w-auto bg-gold text-royal-blue hover:bg-gold-deep px-8 py-4 rounded-full font-sans font-medium transition-colors">
              Apply Now
            </button>
          </Link>
          <a href="tel:08008533078">
            <button className="w-full sm:w-auto bg-transparent border border-white text-white hover:bg-white hover:text-royal-blue px-8 py-4 rounded-full font-sans font-medium transition-colors">
              Call: 080085 33078
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
