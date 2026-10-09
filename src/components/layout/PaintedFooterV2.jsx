import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { SCHOOL } from '../../data/school';
import PaintCanvasV2 from '../ui/PaintCanvasV2';

export default function PaintedFooterV2() {
  return (
    <footer className="relative mt-auto">
      <PaintCanvasV2 mood="footer" className="pt-24 pb-8 bg-[#F7F1E6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="pg-glass pg-glass--panel p-10 mb-8 border border-white/40" style={{ background: 'rgba(255,255,255,0.85)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-start gap-6">
                <div className="h-14">
                  <Logo className="h-full" iconOnly={false} />
                </div>
                <p className="text-[#3B2412]/90 text-sm max-w-sm font-medium">{SCHOOL.address.full}</p>
                <span className="pg-glass-chip bg-white/80">{SCHOOL.rating.score} ? Google Rated</span>
              </div>
              <div>
                <h4 className="font-bold text-[#1F4E8C] mb-6 tracking-wide">Quick Links</h4>
                <ul className="flex flex-col gap-3 text-sm font-medium text-[#3B2412]/80">
                  {['about', 'academics', 'admissions', 'campus'].map(path => (
                    <li key={path}><Link to={"/" + path} className="hover:text-[#1F4E8C] capitalize">{path === 'campus' ? 'Campus & Gallery' : path.replace('-', ' ')}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#1F4E8C] mb-6 tracking-wide">Contact</h4>
                <ul className="flex flex-col gap-3 text-sm font-medium text-[#3B2412]/80">
                  <li>Call: <a href={SCHOOL.phoneHref} className="text-[#1F4E8C] font-bold">{SCHOOL.phone}</a></li>
                  <li><a href={SCHOOL.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-[#1F4E8C]">Open in Maps</a></li>
                  <li><a href={SCHOOL.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-[#1F4E8C]">WhatsApp us</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[#3B2412]/60 font-bold pg-glass pg-glass--pill px-6 py-3">
            <p>� {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Excellence Begins Early.</p>
          </div>
        </div>
      </PaintCanvasV2>
    </footer>
  );
}
