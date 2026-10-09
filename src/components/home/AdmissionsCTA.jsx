import React from 'react';
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
              Admissions are open for 2026�27
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
