import { memo } from 'react';
import Reveal from '../ui/Reveal';
import { STATS } from '../../data/school';
import CountUp from '../ui/CountUp';
import PaintCanvasV2 from '../ui/PaintCanvasV2';

function PaintedStatsSectionV2() {
  return (
    <PaintCanvasV2 mood="crimson" flip className="pg-deferred px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl pg-glass pg-glass--panel pg-glass--strong p-8 sm:p-12 relative z-10">
        <Reveal
          className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <div className="mb-2 flex items-center justify-center font-['Fredoka'] text-4xl font-semibold text-[#D7263D]">
                {typeof stat.value === 'number' ? <CountUp value={stat.value} suffix={stat.suffix} decimal={stat.decimal} /> : <span>{stat.value}{stat.suffix}</span>}
              </div>
              <p className="max-w-32 text-sm font-bold text-[#3B2412] leading-tight">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </PaintCanvasV2>
  );
}

export default memo(PaintedStatsSectionV2);
