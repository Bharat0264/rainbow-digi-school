import { useEffect, useLayoutEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Logo from '../ui/Logo';
import monkeyImg from '../../assets/monkey.png';

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

export function MonkeyArtwork({ x, y, scale, angle, push, onBounds }) {
  const reduced=useReducedMotion();const navigate=useNavigate();
  const [hover,setHover]=useState(false),[kick,setKick]=useState(0);
  const timer=useRef();const art=useRef(null);
  
  useLayoutEffect(()=>{if(!art.current)return;const box=art.current.getBoundingClientRect(),svg=art.current.ownerSVGElement.getBoundingClientRect();onBounds?.(box.bottom-svg.top+8);},[angle,scale,kick,onBounds]);
  
  const greet=()=>{setHover(true);if(!reduced){push(.15);setKick(5);clearTimeout(timer.current);timer.current=setTimeout(()=>{setKick(-2);timer.current=setTimeout(()=>{setKick(4);timer.current=setTimeout(()=>setKick(0),180);},150);},180);}};
  
  return <g ref={art} transform={`translate(${x} ${y}) scale(${scale})`} className="bn-monkey-art" onPointerEnter={greet} onPointerLeave={()=>setHover(false)}>
    <motion.g initial={reduced?false:{y:-25,opacity:0}} animate={{y:0,opacity:1}} transition={{type:'spring',stiffness:180,damping:17}}>
      
      {/* We rotate the entire image to swing naturally from the hands */}
      <motion.g animate={{ rotate: angle + kick }} style={{ transformOrigin: "0px -15px" }}>
        
        {/* Clip path to remove any fake branch above the hands */}
        <clipPath id="monkey-clip">
          <rect x="-250" y="-15" width="500" height="450" />
        </clipPath>
        
        {/* Render the high-res monkey image */}
        <image 
          href={monkeyImg} 
          x="-200" 
          y="-60" 
          width="400" 
          height="387" 
          clipPath="url(#monkey-clip)"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Invisible clickable area over the image's chest sign */}
        <foreignObject x={-130} y="150" width={260} height={100}>
          <Link to="/" style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer' }} aria-label="Rainbow Digi School home" onFocus={greet} onBlur={()=>setHover(false)} onClick={e=>{if(reduced||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();push(.2);setKick(10);clearTimeout(timer.current);timer.current=setTimeout(()=>navigate('/'),160);}}>
            <span style={{ display: 'block', width: '100%', height: '100%' }}></span>
          </Link>
        </foreignObject>

      </motion.g>
    </motion.g>
  </g>;
}
