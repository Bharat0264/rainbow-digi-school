import { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Star } from 'lucide-react';
import { SCHOOL } from '../../data/school';
import PaintCanvasV2 from '../ui/PaintCanvasV2';
import { SchoolIllustration } from '../ui/Crayon';

function PaintedHeroV2() {
  return (
    <section className="pg-hero px-5 pb-5 sm:px-8">
      <PaintCanvasV2 mood="warm" className="rounded-[40px] overflow-hidden min-h-[680px]">
        <div className="relative mx-auto grid max-w-7xl items-center gap-7 px-5 pb-8 pt-32 sm:px-10 lg:grid-cols-2 lg:px-14 lg:pt-24 z-10 h-full">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              {['Nursery�Grade 5', 'CBSE', 'Smart Classrooms'].map(x => (
                <span key={x} className="pg-glass-chip">{x}</span>
              ))}
            </div>

            <h1 className="pg-heading text-[clamp(2.5rem,5vw,4.5rem)] font-semibold text-[#3B2412]">
              Where little <span className="relative inline-block whitespace-nowrap">dreams
                <motion.svg
                  className="absolute -inset-x-4 -inset-y-3 h-[1.5em] w-[calc(100%+2rem)] pointer-events-none"
                  viewBox="0 0 160 80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                >
                  <path d="M10 45C1 8 145-3 153 32c10 42-138 58-145 17" fill="none" stroke="#D7263D" strokeWidth="6" strokeLinecap="round" />
                </motion.svg>
              </span><br />begin.
            </h1>

            <p className="mt-6 max-w-md text-lg text-[#3B2412] pg-body-text">
              <span className="pg-frosted-text">Play, discover and grow � one joyful day at a time.</span>
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/admissions">
                <button
                  className="pg-glass pg-glass--pill pg-glass--tint pg-btn-primary overflow-hidden relative"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, transparent 50%), linear-gradient(rgba(255,200,61,0.6), rgba(255,200,61,0.3))'
                  }}
                >
                  Apply now
                </button>
              </Link>
              <a href={SCHOOL.phoneHref}>
                <button className="pg-glass pg-glass--pill pg-glass--strong pg-btn-secondary">
                  <Phone size={18} />
                  Call {SCHOOL.phone}
                </button>
              </a>
            </div>
          </div>

          <div className="relative min-h-[360px] sm:min-h-[420px] flex items-center justify-center">
            <div
              className="pg-glass pg-glass--panel pg-glass--strong w-full aspect-[4/3] flex items-center justify-center p-8 relative"
            >
              <SchoolIllustration className="w-full h-full object-contain" />

              <div
                className="absolute -right-4 -bottom-4 pg-glass pg-glass--panel pg-glass--strong p-4 flex items-center gap-2 border border-white/40"
                style={{ transform: 'rotate(-5deg)' }}
              >
                <Star fill="#FFC83D" strokeWidth={0} size={20} />
                <div className="text-sm">
                  <b className="text-[#3B2412]">{SCHOOL.rating.score} ? Google</b>
                  <p className="text-[#3B2412]/80 leading-none mt-1">{SCHOOL.rating.count} reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PaintCanvasV2>
    </section>
  );
}

export default memo(PaintedHeroV2);
