import React from 'react';
import { Link } from 'react-router-dom';

export default function AdmissionsCTA() {
  return (
    <section className="bg-royal-blue w-full px-5 py-8 sm:px-6 sm:py-9 lg:px-24 lg:py-11">
      <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
        <h2 className="max-w-[900px] text-balance font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.2] text-white">
          Begin your child's journey with us
        </h2>
        <p className="mt-2 text-[15px] text-white/80 sm:text-base">
          Admissions are open for 2026–27
        </p>
        
        <div className="mt-5 flex w-full max-w-[490px] flex-wrap justify-center gap-3 sm:flex-nowrap">
          <Link to="/admissions" className="min-w-0 flex-1 sm:flex-none">
            <button className="h-11 w-full rounded-full bg-gold px-[22px] text-[15px] font-medium text-royal-blue transition-colors hover:bg-gold-deep sm:w-auto">
              Apply Now
            </button>
          </Link>
          <a href="tel:08008533078" className="min-w-0 flex-1 sm:flex-none">
            <button className="h-11 w-full rounded-full border border-white bg-transparent px-[22px] text-[15px] font-medium text-white transition-colors hover:bg-white hover:text-royal-blue sm:w-auto">
              Call: 080085 33078
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
