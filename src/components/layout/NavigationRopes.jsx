import { useId } from 'react';

// Each rope wraps the measured top AND underside of the bark, then hangs plumb
// into its board fixing. Three layers show the back, front and board-side knots.
export default function NavigationRopes({ ropes }) {
  const id = useId().replaceAll(':', '');
  const fiber = `${id}-fiber`, knot = `${id}-knot`;
  return <>
    <svg className="featured-ropes featured-ropes-back" width="100%" height="100%" aria-hidden="true">
      {ropes.map(({ x, top }, i) => <path key={i}
        d={`M${x+1},${top-9} C${x-11},${top-13} ${x-10},${top+7} ${x-5},${top+18}`}
        fill="none" stroke="#a57341" strokeWidth="8" strokeLinecap="round" />)}
    </svg>
    <svg className="featured-ropes" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id={fiber} x1="0" x2="1" y1="0" y2="0">
          <stop stopColor="#754a2c"/><stop offset=".23" stopColor="#c69255"/>
          <stop offset=".48" stopColor="#f4cf8c"/><stop offset=".72" stopColor="#d4a263"/><stop offset="1" stopColor="#946035"/>
        </linearGradient>
        <linearGradient id={knot} x1="0" x2=".7" y1="0" y2="1">
          <stop stopColor="#ffde9f"/><stop offset=".48" stopColor="#d4a066"/><stop offset="1" stopColor="#81502d"/>
        </linearGradient>
      </defs>
      {ropes.map(({ x, top, under, bottom, board }, i) => {
        const wrapEnd = under + 6;
        const spine = `M${x+1},${top-9} C${x+8},${top-9} ${x+9},${top-2} ${x+6},${top+3} C${x+5},${top+(under-top)*.5} ${x},${under-5} ${x},${wrapEnd} L${x},${bottom}`;
        return <g key={i} data-rope="true" data-board={board} data-top={top} data-under={under} data-bottom={bottom} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={spine} transform="translate(2 1.5)" stroke="#382010" strokeOpacity=".28" strokeWidth="10"/>
          <path d={spine} stroke="#875630" strokeWidth="9"/>
          <path d={spine} stroke={`url(#${fiber})`} strokeWidth="7.5"/>
          {Array.from({ length: Math.max(0,Math.ceil((bottom-top+5)/5.5)) }, (_,j) => {
            const y=top+j*5.5;
            if(y>bottom-3) return null;
            const t=Math.min(1,(y-top)/(wrapEnd-top));
            const offset=6*(1-t)*(1-t);
            const d=`M${x+offset-3.1},${y+2.8} C${x+offset-1.3},${y+2.3} ${x+offset+1.4},${y-1.3} ${x+offset+3.1},${y-1.9}`;
            return <g key={j}>
              <path d={d} stroke="#946136" strokeWidth="2.2"/>
              <path d={d} transform="translate(0 -.8)" stroke="#eed09b" strokeWidth="1.1"/>
              <path d={d} transform="translate(.1 -1.65)" stroke="#fff0c6" strokeOpacity=".7" strokeWidth=".4"/>
            </g>;
          })}
          <path d={`M${x+1},${top-9} Q${x+9},${top-9} ${x+7},${top-1}`} stroke="#f1cb8b" strokeWidth="3"/>
          <path d={`M${x+1},${top-10} Q${x+7},${top-10} ${x+7},${top-4}`} stroke="#ffe7b9" strokeWidth=".9"/>
          <path d={`M${x},${top-12} l1,5 M${x+5},${top-10} l-2,5 M${x+9},${top-5} l-5,2`} stroke="#a77b48" strokeWidth=".8"/>
          {/* A small hitch tightens the wrap against the bottom of the branch. */}
          <path d={`M${x-4},${under+3} Q${x},${under+8} ${x+4},${under+2} M${x-4},${under+6} Q${x},${under+11} ${x+4},${under+5}`} stroke="#926139" strokeWidth="4"/>
          <path d={`M${x-4},${under+2} Q${x},${under+7} ${x+4},${under+1} M${x-4},${under+5} Q${x},${under+10} ${x+4},${under+4}`} stroke="#edc68b" strokeWidth="2.6"/>
        </g>;
      })}
    </svg>
    <svg className="featured-ropes featured-ropes-fixings" width="100%" height="100%" aria-hidden="true">
      {ropes.map(({ x, bottom },i) => <g key={i} transform={`translate(${x} ${bottom-3})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cy="2" rx="6" ry="4" fill="#513019" stroke="#ebbe75" strokeWidth="1.5"/>
        <path d="M0,-7 L0,-2 C-7,-5 -8,3 -2,5 C3,7 7,2 4,-2 C2,-5 -3,-4 -4,-1" stroke="#86532d" strokeWidth="5"/>
        <path d="M0,-7 L0,-2 C-7,-5 -8,3 -2,5 C3,7 7,2 4,-2 C2,-5 -3,-4 -4,-1" stroke={`url(#${knot})`} strokeWidth="3.5"/>
        <path d="M-5,1 Q0,-3 5,-3 M-4,-3 Q0,-1 4,2" stroke="#e7bc80" strokeWidth="2.7"/>
        <path d="M-5,.4 Q0,-3.6 5,-3.6 M-4,-3.6 Q0,-1.6 4,1.4" stroke="#ffe6b6" strokeWidth=".65"/>
        <path d="M2,5 Q4,8 2,10" stroke="#bd8a51" strokeWidth="2.7"/>
        <path d="M1.5,8 L.5,10 M2,8 L3,10" stroke="#eac48e" strokeWidth=".65"/>
      </g>)}
    </svg>
  </>;
}
