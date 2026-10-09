import { memo } from 'react';
import Reveal from '../ui/Reveal';
import { Link } from 'react-router-dom';
import { ACADEMICS } from '../../data/school';
import { IMAGES } from '../../data/images';
import SmartImage from '../ui/SmartImage';
import PaintCanvasV2 from '../ui/PaintCanvasV2';

function ProgramCard({ program, index }) {
  return (
    <Reveal as="article"
      className="pg-program-card"
    >
      <div
        className="pg-glass pg-glass--card pg-glass--strong p-5 relative overflow-hidden group"
      >
        <div className="absolute -inset-4 opacity-30 rounded-full" style={{ background: `radial-gradient(ellipse, ${index ? '#38A3E8' : '#F5821F'}, transparent 70%)` }} />

        <div className="relative">
          <SmartImage image={index ? IMAGES.activity2 : IMAGES.activity1} className="mb-6 aspect-[16/8] rounded-[16px]"/>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full pg-glass pg-glass--tint flex items-center justify-center border border-white/60">
              <div className="w-3 h-3 rounded-full" style={{ background: index ? '#1F4E8C' : '#F5821F' }} />
            </div>
            <h3 className="font-['Fredoka'] text-2xl font-semibold text-[#3B2412]">{program.stage}</h3>
          </div>

          <p className="text-sm font-bold text-[#1F4E8C] mb-3">{program.grades}</p>
          <p className="text-[#3B2412]/80 leading-relaxed text-sm">{program.description}</p>
        </div>
      </div>
    </Reveal>
  );
}

function PaintedProgramsCardV2() {


  return (
    <PaintCanvasV2 mood="cobalt" className="pg-deferred px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="mb-14 text-center">
          <span className="pg-glass-chip mb-4 inline-block">Academics</span>
          <h2 className="pg-heading text-[clamp(2rem,4vw,3rem)] text-[#3B2412] relative inline-block">
            <span className="pg-frosted-text">Programs that inspire</span>
            <svg className="absolute -bottom-3 left-0 w-full h-4 text-[#F5821F]" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {ACADEMICS.map((program, index) => (
            <ProgramCard key={program.id} program={program} index={index} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link to="/academics">
            <button className="pg-glass pg-glass--pill pg-glass--strong pg-btn-secondary bg-white/50">
              Explore academics
            </button>
          </Link>
        </div>
      </div>
    </PaintCanvasV2>
  );
}

export default memo(PaintedProgramsCardV2);
