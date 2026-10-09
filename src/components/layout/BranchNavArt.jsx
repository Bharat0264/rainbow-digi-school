import { useEffect, useLayoutEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Logo from '../ui/Logo';

export const LEAF_PATH = 'M0 0 C-6-4-13-9-12-16 C-16-24-7-32 0-40 C5-32 15-27 12-19 C15-12 6-4 0 0Z';
const MIDRIB = 'M0 0 Q-2-18 0-38';
const LEAF_PAIRS = [[-2,-9,-53,.78],[2,-15,57,.9],[-2,-23,-58,.72],[1,-29,52,.69],[-1,-35,-44,.55],[0,-41,38,.49],[0,-45,4,.48]];

export function LeafTwig({ anchor, index, width }) {
  const id = useId().replace(/:/g, '');
  const reduced = useReducedMotion();
  const lower = index % 3 === 1;
  const size = lower ? .18 : width < 768 ? .32 : .49;
  return <g transform={`translate(${anchor.center.x} ${anchor.center.y})`} aria-hidden="true">
    <defs><linearGradient id={id} x1="0" y1="1" x2=".8" y2="0"><stop stopColor="#2F6B1E"/><stop offset=".5" stopColor="#5FA52A"/><stop offset="1" stopColor="#A9D04A"/></linearGradient></defs>
    <g transform={`rotate(${lower ? 157 : index % 2 ? 24 : -21}) scale(${size})`}>
      <g className={reduced ? '' : 'bn-twig-motion'} style={{ animationDuration: `${4 + index % 4}s`, animationDelay: `${-index * .6}s` }}>
        <path d="M0 0Q-5-20 0-48" fill="none" stroke="#765031" strokeWidth="2.8"/>
        {LEAF_PAIRS.map(([x,y,angle,scale],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${angle})`}>
          <path d="M0 0v-6" stroke="#668231" strokeWidth="1.6"/>
          <g transform={`translate(0 -6) scale(${scale})`}>
            <g className={reduced ? '' : 'bn-leaf-flutter'} style={{animationDelay:`${-i-index}s`,animationDuration:`${4+i*.3}s`}}>
              <path d={LEAF_PATH} transform="translate(1 1)" fill="#244b1e" opacity=".16"/>
              <path d={LEAF_PATH} fill={`url(#${id})`} stroke="#afd35c" strokeOpacity=".55" strokeWidth=".75"/>
              <path d="M0 0Q-3-20 0-40C5-32 15-27 12-19C15-12 6-4 0 0" fill="#bfe269" opacity={i>4?'.24':'.12'}/>
              <path d={MIDRIB} fill="none" stroke="#c4db86" strokeWidth=".8"/>
              {Array.from({length:7},(_,j)=><path key={j} d={`M-1 ${-5-j*4}q-5-1 ${-6+(j>4?2:0)}-5M-1 ${-5-j*4}q5-1 ${7-(j>4?2:0)}-5`} fill="none" stroke="#d2e6a5" strokeOpacity=".35" strokeWidth=".5"/>)}
            </g>
          </g>
        </g>)}
      </g>
    </g>
  </g>;
}

export function MonkeyArtwork({ x, y, scale, angle, push, onBounds, logoSize = { width: 265, height: 92 } }) {
  const id=useId().replace(/:/g,'');const reduced=useReducedMotion();const navigate=useNavigate();
  const [hover,setHover]=useState(false),[blink,setBlink]=useState(false),[look,setLook]=useState({x:0,y:0}),[kick,setKick]=useState(0);
  const [lag,setLag]=useState({head:0,arms:0,legs:0,tail:0});const history=useRef([]),timer=useRef();const face=useRef(null),art=useRef(null);
  
  useLayoutEffect(()=>{if(!art.current)return;const box=art.current.getBoundingClientRect(),svg=art.current.ownerSVGElement.getBoundingClientRect();onBounds?.(box.bottom-svg.top+8);},[angle,scale,kick,lag,onBounds]);
  
  useEffect(()=>{const now=performance.now();history.current.push({time:now,angle});history.current=history.current.filter(p=>p.time>now-400);const old=ms=>history.current.find(p=>p.time>=now-ms)?.angle||0;setLag({head:old(120)-angle,arms:old(150)-angle,legs:old(220)-angle,tail:old(300)-angle});},[angle]);
  
  useEffect(()=>{if(reduced)return;let closed,t;const schedule=()=>{t=setTimeout(()=>{if(!document.hidden){setBlink(true);closed=setTimeout(()=>setBlink(false),130);}schedule();},3000+Math.random()*2000);};schedule();const follow=e=>{if(document.hidden||!face.current)return;const r=face.current.getBoundingClientRect();setLook({x:Math.max(-3,Math.min(3,(e.clientX-r.x-r.width/2)/60)),y:Math.max(-2,Math.min(2,(e.clientY-r.y-r.height/2)/60))});};window.addEventListener('pointermove',follow);return()=>{clearTimeout(t);clearTimeout(closed);clearTimeout(timer.current);window.removeEventListener('pointermove',follow);};},[reduced]);
  
  const greet=()=>{setHover(true);if(!reduced){push(.25);setKick(15);clearTimeout(timer.current);timer.current=setTimeout(()=>{setKick(-5);timer.current=setTimeout(()=>{setKick(10);timer.current=setTimeout(()=>setKick(0),180);},150);},180);}};
  
  const handleLogoClick = e => {
    if (reduced || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    push(.4);
    setKick(20);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => navigate('/'), 200);
  };

  const furColor = "#6a3b22";
  const skinColor = "#f8c69e";
  const darkColor = "#3e2723";

  return (
    <g ref={art} transform={`translate(${x} ${y}) scale(${scale})`} className="bn-monkey-art" onPointerEnter={greet} onPointerLeave={()=>setHover(false)}>
      <motion.g initial={reduced?false:{y:-25,opacity:0}} animate={{y:0,opacity:1}} transition={{type:'spring',stiffness:180,damping:17}}>
        <g transform={`rotate(${angle})`}>
          
          <g transform={`rotate(${lag.tail * 0.8} 0 130)`}>
            <path d="M 0 130 C -60 140 -80 180 -40 190 C -10 195 0 170 -15 160" fill="none" stroke={furColor} strokeWidth="14" strokeLinecap="round" />
          </g>

          <path d="M -35 -2 Q -45 35 -25 70" fill="none" stroke={furColor} strokeWidth="16" strokeLinecap="round" />
          <path d="M 35 -2 Q 45 35 25 70" fill="none" stroke={furColor} strokeWidth="16" strokeLinecap="round" />

          <g transform={`rotate(${lag.legs * 0.6 + kick} -20 130)`}>
            <path d="M -20 130 Q -35 155 -20 180" fill="none" stroke={furColor} strokeWidth="16" strokeLinecap="round" />
            <ellipse cx="-20" cy="183" rx="14" ry="8" fill={skinColor} />
            <path d="M -30 183 Q -20 180 -10 183" fill="none" stroke={darkColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          </g>
          
          <g transform={`rotate(${lag.legs * 0.6 - kick * 0.5} 20 130)`}>
            <path d="M 20 130 Q 35 155 20 180" fill="none" stroke={furColor} strokeWidth="16" strokeLinecap="round" />
            <ellipse cx="20" cy="183" rx="14" ry="8" fill={skinColor} />
            <path d="M 10 183 Q 20 180 30 183" fill="none" stroke={darkColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          </g>

          <ellipse cx="0" cy="100" rx="36" ry="46" fill={furColor} />
          <ellipse cx="0" cy="105" rx="26" ry="36" fill={skinColor} />

          <g ref={face} transform={`rotate(${lag.head * 0.8} 0 50)`}>
            <g transform={`rotate(${kick * -0.5})`}>
              <circle cx="-35" cy="45" r="14" fill={furColor} />
              <circle cx="-35" cy="45" r="8" fill={skinColor} />
            </g>
            <g transform={`rotate(${kick * 0.5})`}>
              <circle cx="35" cy="45" r="14" fill={furColor} />
              <circle cx="35" cy="45" r="8" fill={skinColor} />
            </g>

            <ellipse cx="0" cy="45" rx="38" ry="34" fill={furColor} />
            <path d="M -8 10 Q 0 -10 10 10 Q 15 0 18 15 Q 0 5 -8 10 Z" fill={furColor} />

            <path d="M -30 50 C -30 20 -15 20 0 38 C 15 20 30 20 30 50 C 30 75 15 82 0 82 C -15 82 -30 75 -30 50 Z" fill={skinColor} />

            <g transform={`translate(0 ${blink ? 42 : 0}) scale(1 ${blink ? 0.05 : 1}) translate(0 ${blink ? -42 : 0})`}>
              <ellipse cx="-13" cy="42" rx="9" ry="12" fill="#FFF" />
              <ellipse cx="13" cy="42" rx="9" ry="12" fill="#FFF" />
              <g transform={`translate(${look.x} ${look.y})`}>
                <ellipse cx="-13" cy="42" rx="5" ry="7" fill={darkColor} />
                <ellipse cx="13" cy="42" rx="5" ry="7" fill={darkColor} />
                <circle cx="-15" cy="39" r="2" fill="#FFF" />
                <circle cx="11" cy="39" r="2" fill="#FFF" />
              </g>
            </g>

            <ellipse cx="0" cy="56" rx="5" ry="3" fill={darkColor} opacity="0.8" />
            <path d={hover ? "M -10 65 Q 0 78 10 65 Q 0 82 -10 65 Z" : "M -10 65 Q 0 75 10 65"} fill={hover ? "#D7263D" : "none"} stroke={darkColor} strokeWidth="2" strokeLinecap="round" />
            {hover && <path d="M -5 71 Q 0 75 5 71 Q 0 80 -5 71 Z" fill="#FF8A80" />}

            <ellipse cx="-20" cy="58" rx="6" ry="4" fill="#FF8A80" opacity="0.4" />
            <ellipse cx="20" cy="58" rx="6" ry="4" fill="#FF8A80" opacity="0.4" />
          </g>

          <g transform={`rotate(${lag.head * 0.3} 0 100)`}>
            <line x1="-15" y1="70" x2={-logoSize.width/2 + 25} y2="105" stroke="#D2B48C" strokeWidth="3" />
            <line x1="15" y1="70" x2={logoSize.width/2 - 25} y2="105" stroke="#D2B48C" strokeWidth="3" />
            
            <foreignObject x={-logoSize.width/2} y="105" width={logoSize.width} height={logoSize.height}>
              <Link to="/" className="logo-board" aria-label="Rainbow Digi School home" onFocus={greet} onBlur={() => setHover(false)} onClick={handleLogoClick}>
                <span className="logo-plate" style={{ display: 'flex', width: '100%', height: '100%' }}>
                  <Logo />
                </span>
              </Link>
            </foreignObject>
          </g>

          <g fill={skinColor}>
            <rect x="-42" y="-12" width="7" height="18" rx="3.5" transform="rotate(20 -38 -3)" />
            <rect x="-35" y="-14" width="7" height="18" rx="3.5" />
            <rect x="-28" y="-12" width="7" height="18" rx="3.5" transform="rotate(-20 -24 -3)" />
          </g>
          <g fill={skinColor}>
            <rect x="21" y="-12" width="7" height="18" rx="3.5" transform="rotate(20 25 -3)" />
            <rect x="28" y="-14" width="7" height="18" rx="3.5" />
            <rect x="35" y="-12" width="7" height="18" rx="3.5" transform="rotate(-20 38 -3)" />
          </g>
        </g>
      </motion.g>
    </g>
  );
}
