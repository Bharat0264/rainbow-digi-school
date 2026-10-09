import { memo } from 'react';
import Reveal from '../ui/Reveal';
import { TESTIMONIALS } from '../../data/school';
import PaintCanvasV2 from '../ui/PaintCanvasV2';

function PaintedTestimonialsSectionV2() {
  if (TESTIMONIALS.length === 0) return null;
  return (
    <PaintCanvasV2 mood="cobalt" className="pg-deferred py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <div className="text-center mb-16 pg-glass pg-glass--panel pg-glass--strong p-6 inline-block">
          <span className="pg-glass-chip mb-3 inline-block">Testimonials</span>
          <h2 className="text-4xl md:text-5xl pg-heading text-[#1F4E8C]">Words from our families</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={index} className="pg-glass pg-glass--card pg-glass--strong p-8 md:p-10 relative flex flex-col">
              <div className="text-6xl font-serif text-[#1F4E8C] opacity-20 absolute top-6 left-8">"</div>
              <div className="flex-1 mt-6 relative z-10">
                <p className="text-lg text-[#3B2412] pg-body-text italic leading-relaxed mb-8">{testimonial.text}</p>
              </div>
              <div className="mt-auto pt-6 border-t border-[#1F4E8C]/20">
                <p className="font-bold text-[#1F4E8C] text-lg">{testimonial.name}</p>
                <p className="font-sans text-sm text-[#3B2412]/80">{testimonial.relation}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </PaintCanvasV2>
  );
}

export default memo(PaintedTestimonialsSectionV2);
