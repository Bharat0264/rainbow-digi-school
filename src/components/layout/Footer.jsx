import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { SCHOOL } from '../../data/school';
import PaintCanvas from '../ui/PaintCanvas';
import PaintDivider from '../ui/PaintDivider';

export default function Footer() {
  return (
    <footer className="relative mt-auto">
      <PaintDivider flip className="absolute -top-8 w-full h-16 z-20 text-[#1F4E8C]" />
      <PaintCanvas mood="cobalt" parallax={false} className="pt-24 pb-8 bg-[#1F4E8C]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="glass glass--strong p-10 rounded-[40px] mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-start gap-6">
                <div className="h-14 bg-white p-2 rounded-2xl shadow-lg">
                  <Logo className="h-full" iconOnly={false} />
                </div>
                <p className="text-[#3B2412]/90 text-sm max-w-sm font-medium">
                  {SCHOOL.address.full}
                </p>
                <div className="flex items-center gap-2">
                  <span className="glass-chip">
                    {SCHOOL.rating.score} ? Google Rated
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-[#1F4E8C] mb-6 tracking-wide">Quick Links</h4>
                <ul className="flex flex-col gap-3 text-sm font-medium text-[#3B2412]/80">
                  <li><Link to="/about" className="hover:text-[#1F4E8C] transition-colors">About Us</Link></li>
                  <li><Link to="/academics" className="hover:text-[#1F4E8C] transition-colors">Academics</Link></li>
                  <li><Link to="/admissions" className="hover:text-[#1F4E8C] transition-colors">Admissions</Link></li>
                  <li><Link to="/campus" className="hover:text-[#1F4E8C] transition-colors">Campus & Gallery</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-[#1F4E8C] mb-6 tracking-wide">Contact</h4>
                <ul className="flex flex-col gap-3 text-sm font-medium text-[#3B2412]/80">
                  <li>Call: <a href={SCHOOL.phoneHref} className="text-[#1F4E8C] hover:underline font-bold">{SCHOOL.phone}</a></li>
                  <li><a href={SCHOOL.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-[#1F4E8C] transition-colors">Open in Maps</a></li>
                  <li><a href={SCHOOL.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-[#1F4E8C] transition-colors">WhatsApp us</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[#F7F1E6]/60 font-medium">
            <p>� {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Excellence Begins Early.</p>
          </div>
        </div>
      </PaintCanvas>
    </footer>
  );
}
