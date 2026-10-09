import { useEffect, useLayoutEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Logo from '../ui/Logo';

export const LEAF_PATH = 'M0 0 C-6-4-13-9-12-16 C-16-24-7-32 0-40 C5-32 15-27 12-19 C15-12 6-4 0 0Z';
const MIDRIB = 'M0 0 Q-2-18 0-38';
const LEAF_PAIRS = [[-2,-9,-53,.78],[2,-15,57,.9],[-2,-23,-58,.72],[1,-29,52,.69],[-1,-35,-44,.55],[0,-41,38,.49],[0,-45,4,.48]];
const FUR_STROKES = Array.from({length:220},(_,i)=>{
  const side=i%2?1:-1, t=(i%110)/109;
  const x=side*(30+Math.sin(t*Math.PI)*7),y=83+t*65;
  return `M${x} ${y}l${side*(1.4+(i%3)*.4)} ${2+(i%4)*.25}`;
}).join(' ');

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

export function Tail({ layer = 'front', x = 0, y = 0, scale = 1 }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} fill="none" strokeLinecap="round" aria-hidden="true">
    {layer === 'back' ? <><path d="M25 153C66 132 64 107 48 83S24 37 19 12C16-10 3-28-12-22Q-24-18-20-5" stroke="#4F2C14" strokeWidth="13"/><path d="M25 153C66 132 64 107 48 83S24 37 19 12C16-10 3-28-12-22Q-24-18-20-5" stroke="#7B4A2B" strokeWidth="9"/><path d="M28 148C63 129 59 106 45 84S20 36 16 11" stroke="#b78052" strokeWidth="2.5"/></> : <><path d="M-20-5C-19 4-9 17 3 17Q20 18 19 4" stroke="#4F2C14" strokeWidth="10"/><path d="M-20-5C-19 4-9 17 3 17Q20 18 19 4" stroke="#9d6940" strokeWidth="6"/><path d="M19 4Q18-11 29-15Q41-18 44-8Q46 0 39 2" stroke="#4F2C14" strokeWidth="6"/><path d="M19 4Q18-11 29-15Q41-18 44-8Q46 0 39 2" stroke="#a6764a" strokeWidth="3"/></>}
  </g>;
}

function Hand({ side }) {
  return <g transform={`translate(${side*88} 97) scale(${side} 1)`} fill="#F2B58A" stroke="#925c3c" strokeWidth="1.2">
    <ellipse cx="0" cy="5" rx="16" ry="5" fill="#4f2c14" opacity=".22" stroke="none"/>
    <path d="M-12-8Q-13-23-3-22Q9-22 13-9L14 0Q10 10 2 7L-10 3Z"/>
    {[0,1,2,3].map(i=><g key={i}><path d={`M${-10+i*5}-5v10q2.6 8 5 0v-9`} fill="#f8c69e"/><path d={`M${-8+i*5}-3v7`} fill="none" stroke="#ffe0ba" strokeWidth="1.2"/></g>)}
    <path d="M-10-9q-10 2-8 8q3 6 10-1"/>
  </g>;
}
function Leg({ side, lag, kick }) {
  const bend=side===1?8:0;
  return <g transform={`rotate(${side*lag+side*kick} ${side*22} 154)`}>
    <g fill="none" strokeLinecap="round"><path d={`M${side*22} 151Q${side*(43+bend)} 180 ${side*(36+bend)} 206`} stroke="#4F2C14" strokeWidth="27"/><path d={`M${side*22} 151Q${side*(43+bend)} 180 ${side*(36+bend)} 206`} stroke="#7b4a2b" strokeWidth="23"/><path d={`M${side*(36+bend)} 204Q${side*20} 221 ${side*29} 238`} stroke="#4F2C14" strokeWidth="20"/><path d={`M${side*(36+bend)} 204Q${side*20} 221 ${side*29} 238`} stroke="#925e37" strokeWidth="16"/><path d={`M${side*17} 155Q${side*35} 182 ${side*30} 200`} stroke="#b78152" strokeWidth="4"/><path d={`M${side*(37+bend)} 208Q${side*23} 225 ${side*31} 236`} stroke="#c89462" strokeWidth="1.5"/></g>
    <g transform={`translate(${side*29} 237) rotate(${side*-12+lag*.5})`} fill="#F2B58A" stroke="#925c3c" strokeWidth="1.2"><path d="M-9-8Q-17 2-15 12Q-13 19-8 10L-7 6L-6 19Q-3 25 0 17L1 7L2 20Q6 24 8 16L8 5L10 17Q14 21 15 12L14 2Q23 12 26 7Q28 2 13-8Q4-14-9-8Z"/><path d="M-7-4Q2 2 12-3M-4 9v7M5 8v8M12 5l1 6" fill="none" stroke="#ffdbb6"/></g>
  </g>;
}

export function MonkeyArtwork({ x, y, scale, angle, push, onBounds, logoSize = { width: 265, height: 92 } }) {
  const id=useId().replace(/:/g,'');const reduced=useReducedMotion();const navigate=useNavigate();
  const [hover,setHover]=useState(false),[blink,setBlink]=useState(false),[look,setLook]=useState({x:0,y:0}),[kick,setKick]=useState(0);
  const [lag,setLag]=useState({head:0,arms:0,legs:0});const history=useRef([]),timer=useRef();const face=useRef(null),art=useRef(null);
  useLayoutEffect(()=>{if(!art.current)return;const box=art.current.getBoundingClientRect(),svg=art.current.ownerSVGElement.getBoundingClientRect();onBounds?.(box.bottom-svg.top+8);},[angle,scale,kick,lag,onBounds]);
  useEffect(()=>{const now=performance.now();history.current.push({time:now,angle});history.current=history.current.filter(p=>p.time>now-400);const old=ms=>history.current.find(p=>p.time>=now-ms)?.angle||0;setLag({head:old(120)-angle,arms:old(150)-angle,legs:old(220)-angle});},[angle]);
  useEffect(()=>{if(reduced)return;let closed,t;const schedule=()=>{t=setTimeout(()=>{if(!document.hidden){setBlink(true);closed=setTimeout(()=>setBlink(false),130);}schedule();},3000+Math.random()*2000);};schedule();const follow=e=>{if(document.hidden||!face.current)return;const r=face.current.getBoundingClientRect();setLook({x:Math.max(-2,Math.min(2,(e.clientX-r.x-r.width/2)/100)),y:Math.max(-1.5,Math.min(1.5,(e.clientY-r.y-r.height/2)/100))});};window.addEventListener('pointermove',follow);return()=>{clearTimeout(t);clearTimeout(closed);clearTimeout(timer.current);window.removeEventListener('pointermove',follow);};},[reduced]);
  const greet=()=>{setHover(true);if(!reduced){push(.22);setKick(8);clearTimeout(timer.current);timer.current=setTimeout(()=>{setKick(-4);timer.current=setTimeout(()=>{setKick(7);timer.current=setTimeout(()=>setKick(0),180);},150);},180);}};
  return <g ref={art} transform={`translate(${x} ${y}) scale(${scale})`} className="bn-monkey-art" onPointerEnter={greet} onPointerLeave={()=>setHover(false)}>
    <defs><linearGradient id={`${id}fur`} x1="0" x2="1" y2=".7"><stop stopColor="#b07a4b"/><stop offset=".4" stopColor="#7B4A2B"/><stop offset="1" stopColor="#4F2C14"/></linearGradient><radialGradient id={`${id}skin`} cx=".35" cy=".3"><stop stopColor="#ffdab4"/><stop offset="1" stopColor="#F2B58A"/></radialGradient></defs>
    <motion.g initial={reduced?false:{y:-25,opacity:0}} animate={{y:0,opacity:1}} transition={{type:'spring',stiffness:180,damping:17}}>
      <g transform={`rotate(${angle})`}>
        <g aria-hidden="true" stroke="#4F2C14" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M-24 73Q-45 85-37 125L-27 169Q0 190 32 163L38 116Q46 81 23 73Z" fill={`url(#${id}fur)`}/>
          <path d="M25 78Q42 108 29 151L18 172Q40 167 36 120Q44 90 25 78" fill="#4f2c14" opacity=".3" stroke="none"/>
          <path d="M-27 84Q-41 108-28 138" fill="none" stroke="#c38e5d" strokeWidth="3" opacity=".55"/>
          <motion.ellipse cx="0" cy="112" rx="28" ry="37" fill={`url(#${id}skin)`} animate={reduced?{}:{scale:[1,1.01,1]}} transition={{duration:3,repeat:Infinity}} style={{transformOrigin:'0px 112px'}}/>
          <ellipse cx="0" cy="90" rx="22" ry="6" fill="#4f2c14" opacity=".16" stroke="none"/>
          <path d="M-28 127Q0 115 30 127L29 147H-28Z" fill="#4f2c14" opacity=".15" stroke="none"/>
          <path d={FUR_STROKES} fill="none" stroke="#bf8f62" strokeWidth=".45" strokeLinecap="round" opacity=".4"/>
        </g>
        <Leg side={-1} lag={lag.legs*1.4} kick={kick}/><Leg side={1} lag={lag.legs*1.4} kick={kick}/>
        <g transform={`rotate(${lag.arms*.5} 0 90)`} aria-hidden="true" strokeLinecap="round">
          {[-1,1].map(side=><g key={side}><path d={`M${side*28} 84Q${side*49} 87 ${side*62} 110Q${side*72} 127 ${side*88} 116`} fill="none" stroke="#4f2c14" strokeWidth="23"/><path d={`M${side*28} 84Q${side*49} 87 ${side*62} 110Q${side*72} 127 ${side*88} 116`} fill="none" stroke={`url(#${id}fur)`} strokeWidth="19"/><circle cx={side*62} cy="110" r="9" fill="#80502e"/><path d={`M${side*29} 79Q${side*49} 84 ${side*59} 102`} stroke="#c59361" strokeWidth="3" fill="none" opacity=".7"/><path d={`M${side*64} 113Q${side*74} 124 ${side*85} 116`} fill="none" stroke="#bd8554" strokeWidth="1.5"/></g>)}
        </g>
        <g ref={face} transform={`rotate(${lag.head*1.2} 0 78)`} aria-hidden="true" stroke="#4F2C14" strokeWidth="1.7">
          <g className={reduced?'':'bn-ear-twitch'}><ellipse cx="-34" cy="58" rx="14" ry="18" fill={`url(#${id}fur)`}/><ellipse cx="34" cy="58" rx="14" ry="18" fill={`url(#${id}fur)`}/><ellipse cx="-35" cy="58" rx="9" ry="12" fill="#eaa17e"/><ellipse cx="35" cy="58" rx="9" ry="12" fill="#eaa17e"/><path d="M-38 53q8-7 8 9M38 53q-8-7-8 9" fill="none" opacity=".5"/></g>
          <path d="M-33 59Q-34 29-13 24L-18 17Q-3 18 4 25L14 20L11 28Q38 31 33 66Q29 88 0 92Q-31 88-33 59Z" fill={`url(#${id}fur)`}/>
          <path d="M-27 52Q-22 30 0 43Q22 30 27 52L24 73Q0 96-24 73Z" fill={`url(#${id}skin)`} stroke="#a7734f"/>
          <ellipse cx="0" cy="74" rx="25" ry="16" fill={`url(#${id}skin)`} stroke="none"/>
          <g transform={`translate(0 ${blink?58:0}) scale(1 ${blink?.07:1}) translate(0 ${blink?-58:0})`}>
            <g fill="#fffdf5"><ellipse cx="-12" cy="56" rx="9" ry={hover?13:12}/><ellipse cx="12" cy="56" rx="9" ry={hover?13:12}/></g>
            <g transform={`translate(${look.x} ${look.y})`}><g fill="#37251b"><ellipse cx="-11" cy="58" rx="5" ry="7"/><ellipse cx="13" cy="58" rx="5" ry="7"/></g><g fill="white" stroke="none"><circle cx="-12" cy="55" r="2.5"/><circle cx="12" cy="55" r="2.5"/><circle cx="-9" cy="60" r="1"/><circle cx="15" cy="60" r="1"/></g></g>
          </g>
          <g transform={`translate(0 ${hover?-2:0})`} fill="none" strokeLinecap="round"><path d="M-20 41q7-6 13-1M8 40q7-5 13 2"/></g>
          <g fill="#815034" stroke="none"><ellipse cx="-3" cy="71" rx="1.6" ry="1"/><ellipse cx="3" cy="71" rx="1.6" ry="1"/></g>
          <path d="M-4 62q4-3 8 0M-6 83q6 3 12-1" fill="none" stroke="#d68d63" strokeWidth="1"/>
          <path d={hover?'M-11 78Q0 92 12 77Q1 82-11 78':'M-9 78Q0 86 10 77'} fill={hover?'#713e29':'none'} strokeLinecap="round"/>
          <g stroke="#c7966b" strokeWidth=".8" opacity=".6"><path d="M-28 36l-3 5M-30 42l-2 5M28 38l3 5M28 45l3 4M-10 26l5 3M6 28l4 3"/></g>
        </g>
        <g transform={`rotate(${lag.head*.3} 0 123)`}>
          <foreignObject x={-logoSize.width/2} y="95" width={logoSize.width} height={logoSize.height}><Link to="/" className="logo-board" aria-label="Rainbow Digi School home" onFocus={greet} onBlur={()=>setHover(false)} onClick={e=>{if(reduced||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();push(.3);setKick(12);clearTimeout(timer.current);timer.current=setTimeout(()=>navigate('/'),160);}}><span className="logo-plate"><Logo/></span></Link></foreignObject>
          <g aria-hidden="true"><Hand side={-1}/><Hand side={1}/></g>
        </g>
      </g>
    </motion.g>
    <Tail/>
  </g>;
}
