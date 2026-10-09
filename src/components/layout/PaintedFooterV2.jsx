import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { SCHOOL } from '../../data/school';
import PaintCanvasV2 from '../ui/PaintCanvasV2';
import { Phone, MapPin, ExternalLink, Leaf, Diamond } from 'lucide-react';

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function PaintedFooterV2() {
  return (
    <footer className="relative mt-auto">
      <PaintCanvasV2 mood="footer" className="pt-24 pb-8 bg-[#F7F1E6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          
          {/* Main Footer Panel */}
          <div className="pg-glass pg-glass--panel p-8 md:p-12 mb-6 border border-white/40 shadow-[0_8px_32px_rgba(31,78,140,0.08)] rounded-[2.5rem]" style={{ background: 'rgba(248,250,252,0.85)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              
              {/* Column 1 - School Info */}
              <div className="flex flex-col items-start gap-5">
                <div className="h-14 mb-1">
                  <Logo className="h-full" iconOnly={false} />
                </div>
                <p className="text-[#475569] text-sm max-w-sm font-medium leading-relaxed">
                  {SCHOOL.address.full}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                  <span className="flex items-center gap-1.5 font-bold text-[#3B2412]">
                    <GoogleIcon className="w-4 h-4" />
                    {SCHOOL.rating.score}
                  </span>
                  <span className="text-[#FBBC05] text-lg leading-none mt-[-2px]">★</span>
                  <span className="text-sm font-bold text-[#3B2412]">Google Rated</span>
                </div>
              </div>

              {/* Column 2 - Quick Links */}
              <div className="md:pl-8">
                <h4 className="font-bold text-[#1F4E8C] text-lg mb-6">Quick Links</h4>
                <ul className="flex flex-col gap-4 text-sm font-semibold text-[#475569]">
                  {['about', 'academics', 'admissions', 'campus'].map(path => (
                    <li key={path}>
                      <Link to={"/" + path} className="hover:text-[#1F4E8C] transition-colors capitalize inline-block">
                        {path === 'campus' ? 'Campus & Gallery' : path.replace('-', ' ')}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3 - Contact */}
              <div>
                <h4 className="font-bold text-[#1F4E8C] text-lg mb-6">Contact</h4>
                <ul className="flex flex-col gap-5 text-sm font-semibold text-[#475569]">
                  <li>
                    <a href={SCHOOL.phoneHref} className="group flex items-center gap-3 hover:text-[#1F4E8C] transition-colors">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1F4E8C]/10 text-[#1F4E8C] group-hover:bg-[#1F4E8C] group-hover:text-white transition-colors">
                        <Phone size={16} />
                      </div>
                      <span>Call: <span className="text-[#1F4E8C] group-hover:text-[#1E3A8A] font-bold">{SCHOOL.phone}</span></span>
                    </a>
                  </li>
                  <li>
                    <a href={SCHOOL.mapsUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 hover:text-[#1F4E8C] transition-colors">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1F4E8C]/10 text-[#1F4E8C] group-hover:bg-[#1F4E8C] group-hover:text-white transition-colors">
                        <MapPin size={16} />
                      </div>
                      Open in Maps
                    </a>
                  </li>
                  <li>
                    <a href={SCHOOL.whatsappUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 hover:text-[#25D366] transition-colors">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                        <WhatsAppIcon className="w-4 h-4" />
                      </div>
                      WhatsApp us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[#475569] font-medium pg-glass pg-glass--pill px-6 py-4 rounded-full border border-white/20 shadow-sm" style={{ background: 'rgba(203, 213, 225, 0.4)' }}>
            <div className="flex items-center gap-2 mb-3 md:mb-0">
              <Diamond size={12} className="text-[#475569]" />
              <p>&copy; 2026 {SCHOOL.name}. All rights reserved.</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <p>Excellence Begins Early.</p>
              <div className="hidden md:block w-px h-4 bg-[#94A3B8]"></div>
              <a 
                href="https://my-work-umber.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-1.5 text-[#1F4E8C] hover:text-[#1E3A8A] transition-colors"
                aria-label="Crafted by Garuda (opens in new tab)"
              >
                <Leaf size={14} className="text-[#1F4E8C] group-hover:text-[#1E3A8A] transition-colors" />
                <span>Crafted by <strong className="font-bold text-sm">Garuda</strong></span>
                <ExternalLink size={12} className="opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
          
        </div>
      </PaintCanvasV2>
    </footer>
  );
}
