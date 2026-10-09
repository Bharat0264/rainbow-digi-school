import React from 'react';
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
            <span className="pg-frosted-text">Admissions are open for 2026�27</span>
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
