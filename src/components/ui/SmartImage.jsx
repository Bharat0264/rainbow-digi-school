import { useState } from 'react';
import { Building2, Monitor, Palette, Trophy, Calculator, PartyPopper } from 'lucide-react';
const art = { building: Building2, classroom: Monitor, art: Palette, sports: Trophy, maths: Calculator, computer: Monitor, celebration: PartyPopper };
export default function SmartImage({ image, className = '', imgClassName = '' }) {
  const [status, setStatus] = useState('loading'); const Icon = art[image.topic] || Monitor; const showFallback = status === 'error';
  return <div className={`smart-image smart-image-${image.shape || 'squircle'} ${className}`}>{!showFallback && <img src={image.path} alt={image.alt} loading="lazy" onLoad={() => setStatus('ready')} onError={() => setStatus('error')} className={`h-full w-full object-cover transition duration-500 ${status === 'loading' ? 'scale-105 blur-xl' : 'scale-100 blur-0'} ${imgClassName}`}/>} {showFallback && <div className="smart-fallback"><span className="smart-icon"><Icon size={34}/></span><span>{image.label}</span></div>}</div>;
}
