import React from 'react';
import { GALLERY_IMAGES } from '../../data/school';

export default function PhotoStrip() {
  const allImages = [...GALLERY_IMAGES, ...GALLERY_IMAGES]; // Duplicate for seamless scroll
  
  return (
    <section className="bg-ivory py-12 overflow-hidden w-full relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ivory to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ivory to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex w-max animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused]">
        {allImages.map((img, idx) => (
          <div key={idx} className="w-64 md:w-80 lg:w-96 h-48 md:h-64 lg:h-72 px-3 shrink-0">
            <img 
              src={img.url || img} 
              alt={img.alt || "School life"} 
              loading="lazy"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
