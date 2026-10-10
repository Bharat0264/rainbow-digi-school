import { memo, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { SCHOOL } from '../../data/school';
import './PaintedHeroV2.css';

const badges = [
  ['🌱', 'Nursery – Grade 5'],
  ['🎓', 'CBSE'],
  ['💻', 'Smart Classrooms'],
];

function SchoolScene({ reduced, mouse }) {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-[780px]"
      animate={reduced ? undefined : { x: mouse.x * -8, y: mouse.y * -5 }}
      transition={{ type: 'spring', stiffness: 42, damping: 18 }}
    >
      <svg viewBox="0 0 760 600" className="block h-auto w-full" role="img" aria-label="A cheerful Rainbow Digi School building surrounded by gardens">
        <defs>
          <linearGradient id="school-wall" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffd96b"/><stop offset="1" stopColor="#ffab35"/></linearGradient>
          <linearGradient id="roof" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ff6256"/><stop offset="1" stopColor="#e93438"/></linearGradient>
          <linearGradient id="lawn" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a9dc63"/><stop offset="1" stopColor="#5bb65d"/></linearGradient>
          <filter id="soft-shadow" x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="0" dy="13" stdDeviation="10" floodColor="#a65d34" floodOpacity=".18"/></filter>
          <filter id="cloud-shadow" x="-20%" y="-30%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#c77e39" floodOpacity=".12"/></filter>
        </defs>

        <g filter="url(#cloud-shadow)" fill="#fffdf6">
          <path d="M65 176c0-17 14-31 31-31 6-20 24-34 46-34 23 0 43 16 47 38 17-1 31 12 31 29H65Z"/>
          <path d="M492 91c0-20 16-36 36-36 10-26 34-43 63-43 34 0 62 23 68 55 26-2 48 18 48 44H492Z"/>
          <path d="M560 209c0-13 10-23 23-23 7-17 22-28 40-28 21 0 39 14 43 34 16-1 29 11 29 27H560Z" opacity=".95"/>
        </g>

        <g stroke="#f9ae1c" strokeWidth="7" strokeLinecap="round">
          <circle cx="245" cy="89" r="39" fill="#ffd449" stroke="none"/>
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => <path key={angle} d="M245 30v-17" transform={`rotate(${angle} 245 89)`}/>) }
        </g>
        <path d="M300 223c45-48 83-51 130-3 42 43 80 38 124-1" fill="none" stroke="#2488e8" strokeWidth="7" strokeLinecap="round"/>
        <path d="M633 60c40 20 61-5 83 18 21 22 17 51 34 62" fill="none" stroke="#fa6749" strokeWidth="4" strokeLinecap="round" strokeDasharray="7 12"/>
        <path d="M705 47l34-13-16 31-6-14-12-4Z" fill="#fff9dc" stroke="#ee5b32" strokeWidth="4" strokeLinejoin="round"/>

        <g filter="url(#soft-shadow)">
          <path d="M39 523C135 476 220 503 303 527c92 27 205 20 417-9v68H39Z" fill="url(#lawn)"/>
          <path d="M39 548c69-51 147-31 219-12 90 24 198 30 462-17v72H39Z" fill="#4eaa62" opacity=".7"/>
          <path d="M349 580c23-77 71-102 85-154 12 50 67 81 101 154H349Z" fill="#fff3cc"/>
          <path d="M414 456c7 12 22 12 31 0" fill="none" stroke="#f4d58b" strokeWidth="6" strokeLinecap="round"/>
          {[378, 421, 464, 508].map((x, index) => <ellipse key={x} cx={x} cy={505 + index * 17} rx="11" ry="4" fill="#efca8d" opacity=".45"/>)}
        </g>

        <g>
          <path d="M110 455v-88" stroke="#8a5932" strokeWidth="11" strokeLinecap="round"/>
          <circle cx="110" cy="341" r="63" fill="#5bb866"/><circle cx="76" cy="371" r="45" fill="#53aa61"/><circle cx="147" cy="372" r="46" fill="#65c56f"/>
          <path d="M654 459v-103" stroke="#82502e" strokeWidth="12" strokeLinecap="round"/>
          <circle cx="654" cy="331" r="73" fill="#44a960"/><circle cx="612" cy="370" r="49" fill="#52b969"/><circle cx="697" cy="376" r="48" fill="#62bf6d"/>
        </g>

        <g filter="url(#soft-shadow)">
          <path d="M177 440V269h407v171H177Z" fill="url(#school-wall)"/>
          <path d="M294 440V211h174v229H294Z" fill="#ffc150"/>
          <path d="M135 274 381 102l274 172-21 25H155Z" fill="url(#roof)"/>
          <path d="M266 242 381 143l130 99" fill="none" stroke="#fff6d7" strokeWidth="13" strokeLinejoin="round"/>
          <path d="M142 279h510" stroke="#d93437" strokeWidth="13" strokeLinecap="round"/>
          {[214, 260, 520, 566].map(x => <g key={x}><rect x={x} y="312" width="50" height="63" rx="5" fill="#f8fbf4"/><rect x={x + 7} y="319" width="16" height="22" rx="2" fill="#59c8ef"/><rect x={x + 27} y="319" width="16" height="22" rx="2" fill="#59c8ef"/><rect x={x + 7} y="347" width="16" height="21" rx="2" fill="#59c8ef"/><rect x={x + 27} y="347" width="16" height="21" rx="2" fill="#59c8ef"/></g>)}
          <circle cx="381" cy="229" r="28" fill="#fffdf4" stroke="#f06443" strokeWidth="6"/>
          <path d="M381 211v19h13" fill="none" stroke="#6c452e" strokeWidth="5" strokeLinecap="round"/>
          <path d="M337 442v-69c0-38 88-38 88 0v69Z" fill="#fdf2dc"/>
          <path d="M346 442v-65c0-29 70-29 70 0v65Z" fill="#764128"/>
          <path d="M381 350v91" stroke="#4b291e" strokeWidth="4"/><circle cx="371" cy="401" r="4" fill="#ffcf42"/><circle cx="391" cy="401" r="4" fill="#ffcf42"/>
          <path d="M381 143V72" stroke="#7e402c" strokeWidth="7"/><path d="M384 76c32-3 36 19 63 5v31c-27 14-34-7-63-3Z" fill="#f34b46"/>
        </g>

        <g fill="#1f8f4d">
          {[165, 197, 224, 254, 497, 530, 559, 590].map((x, index) => <path key={x} d={`M${x} 462c0-24 18-39 38-39 18 0 35 13 35 39Z`} transform={`translate(0 ${index % 2 ? 9 : 0})`}/>) }
        </g>
        <g stroke="#fff7df" strokeWidth="8" strokeLinecap="round"><path d="M152 452h119M160 452v-34m25 34v-34m25 34v-34m25 34v-34m25 34v-34"/><path d="M510 452h113m-105 0v-34m25 34v-34m25 34v-34m25 34v-34m25 34v-34"/></g>
        {[[91, 546], [156, 563], [251, 538], [571, 546], [657, 555]].map(([x, y]) => <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}><path d="M0 8c-14-24 14-24 0 0" fill="#fffdf0" stroke="#fffdf0" strokeWidth="3"/><path d="M8 0C32-14 32 14 8 0" fill="#fffdf0" stroke="#fffdf0" strokeWidth="3"/><path d="M0-8c14-24-14-24 0 0" fill="#fffdf0" stroke="#fffdf0" strokeWidth="3"/><path d="M-8 0c-24 14-24-14-8 0" fill="#fffdf0" stroke="#fffdf0" strokeWidth="3"/><circle r="5" fill="#ffd84d"/></g>)}
      </svg>
    </motion.div>
  );
}

function PaintedHeroV2() {
  const reduced = useReducedMotion();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return undefined;
    const move = event => setMouse({ x: event.clientX / window.innerWidth - 0.5, y: event.clientY / window.innerHeight - 0.5 });
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduced]);

  return (
    <section className="w-full px-3 py-4 sm:px-6 lg:px-8" aria-labelledby="hero-title">
      <div className="relative mx-auto min-h-[690px] max-w-[1640px] overflow-hidden rounded-[42px] bg-[#fff2b6] px-6 py-12 shadow-[0_24px_60px_rgba(131,76,30,0.13)] sm:rounded-[56px] sm:px-12 lg:min-h-[790px] lg:px-[6.5%] lg:py-[5.4rem]">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true" viewBox="0 0 1600 800">
          <path d="M0 0C154 32 220 2 379 9c173 7 278 18 424-9h797v164c-166-102-253 91-473-41-171-104-279 95-482-1C456 24 264 110 0 155Z" fill="#fff8d7" opacity=".82"/>
          <path d="M1047 0h553v151c-83-82-183-10-300-9-121 1-194-69-253-142Z" fill="#ff9d80" opacity=".78"/>
          <path d="M0 506c152-98 304 30 452-36 130-58 216-123 345-53 179 96 277-17 388 63 106 77 289-17 415 65v215H0Z" fill="#ffb391" opacity=".68"/>
          <path d="M0 566c135-55 233-20 356 33 142 61 284-10 395 22 143 42 182 125 412 52 144-45 252 25 437-37v124H0Z" fill="#ff8f75" opacity=".72"/>
          <circle cx="89" cy="566" r="9" fill="#ffd53f"/><circle cx="107" cy="593" r="6" fill="#fff5be"/><circle cx="754" cy="641" r="10" fill="#ffd95b" opacity=".75"/>
        </svg>

        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[.96fr_1.04fr] lg:gap-8">
          <div className="pt-3 lg:pt-0">
            <div className="mb-8 flex flex-wrap gap-3" aria-label="School highlights">
              {badges.map(([icon, text], index) => <motion.span key={text} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.42 }} className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/85 px-4 py-2 text-sm font-extrabold text-[#472013] shadow-[0_7px_16px_rgba(126,74,34,0.14)] backdrop-blur-sm sm:px-5 sm:text-base"><span aria-hidden="true">{icon}</span>{text}</motion.span>)}
            </div>

            <div className="relative max-w-[680px]">
              <svg className="absolute -left-10 top-9 hidden h-12 w-12 text-[#ffae16] lg:block" viewBox="0 0 54 54" fill="none" aria-hidden="true"><path d="m27 4 5.3 15.9L49 21l-13.1 10.2 4.5 16.3L27 38l-13.4 9.5 4.5-16.3L5 21l16.7-1.1L27 4Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/></svg>
              <h1 id="hero-title" className="font-['Fredoka'] text-[clamp(4rem,6.7vw,7.55rem)] font-black leading-[.86] tracking-[-.06em] text-[#3b190e]">
                Where little<br/>
                <span className="relative inline-block pr-2">dreams<svg className="pointer-events-none absolute -inset-x-5 -inset-y-3 h-[calc(100%+1.5rem)] w-[calc(100%+2.5rem)] overflow-visible" viewBox="0 0 200 100" aria-hidden="true"><path d="M12 55C14 22 180 8 192 48c9 36-159 45-180 10Z" fill="none" stroke="#f64f51" strokeWidth="6" strokeLinecap="round"/></svg><svg className="absolute -right-12 top-2 h-9 w-9 text-[#f64f51]" viewBox="0 0 34 34" fill="none" aria-hidden="true"><path d="M3 17h7M20 4v7m5 12 5 5" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg></span><br/>
                begin.
              </h1>
            </div>

            <p className="mt-8 max-w-[690px] text-lg font-semibold leading-relaxed text-[#573326] sm:text-xl lg:whitespace-nowrap lg:text-[1.55rem]">Play, discover and grow — one joyful day at a time.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link to="/admissions" className="hero-liquid-button hero-liquid-apply inline-flex items-center gap-4 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ef8e13]">
                <i className="hero-liquid-orb hero-liquid-orb--one" aria-hidden="true"/><i className="hero-liquid-orb hero-liquid-orb--two" aria-hidden="true"/>
                <span className="relative">Apply Now</span><span className="hero-liquid-icon"><ArrowRight size={20} strokeWidth={3}/></span>
              </Link>
              <a href={SCHOOL.phoneHref} className="hero-liquid-button hero-liquid-call inline-flex items-center gap-3 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f75c65]">
                <i className="hero-liquid-orb hero-liquid-orb--one" aria-hidden="true"/><i className="hero-liquid-orb hero-liquid-orb--two" aria-hidden="true"/>
                <span className="hero-liquid-icon"><Phone size={18} fill="currentColor" strokeWidth={0}/></span><span className="relative">Call {SCHOOL.phone}</span>
              </a>
            </div>
          </div>
          <div className="relative mt-3 flex min-w-0 items-center justify-center lg:mt-0"><SchoolScene reduced={reduced} mouse={mouse}/></div>
        </div>
      </div>
    </section>
  );
}

export default memo(PaintedHeroV2);
