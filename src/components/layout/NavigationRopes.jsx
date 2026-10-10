import { useId } from 'react';

// All geometry is supplied by the existing board/branch measurements. These
// three drawing layers change only the material and depth of the attachments.
export default function NavigationRopes({ ropes }) {
  const id = useId().replaceAll(':', '');
  const ropeId = `${id}-fiber`, knotId = `${id}-knot`;
  return <>
    <svg className="featured-ropes" style={{ zIndex: -1 }} width="100%" height="100%" aria-hidden="true">
      {ropes.map(({ x, top }, i) => <path key={i}
        d={`M${x+5},${top+8} C${x+12},${top-15} ${x-7},${top-21} ${x-5},${top-10}`}
        fill="none" stroke="#916039" strokeWidth="6" strokeLinecap="round" />)}
    </svg>
    <svg className="featured-ropes" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id={ropeId} x1="0" x2="1" y1="0" y2="0">
          <stop stopColor="#85502a"/><stop offset=".28" stopColor="#e9b677"/>
          <stop offset=".5" stopColor="#ffe0a6"/><stop offset=".76" stopColor="#c58a4e"/><stop offset="1" stopColor="#87512c"/>
        </linearGradient>
        <linearGradient id={knotId} x1="0" x2=".6" y1="0" y2="1">
          <stop stopColor="#f9d59b"/><stop offset=".5" stopColor="#cf985d"/><stop offset="1" stopColor="#8c552e"/>
        </linearGradient>
      </defs>
      {ropes.map(({ x, top, bottom }, i) => {
        const start = top-12;
        const spine = `M${x-4},${start} C${x+5},${start-5} ${x+7},${top-5} ${x+2},${top+4} Q${x-1},${top+12} ${x},${top+19} L${x},${bottom}`;
        return <g key={i} data-rope="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={spine} transform="translate(1.5 1)" stroke="#4d2c19" strokeOpacity=".24" strokeWidth="9"/>
          <path d={spine} stroke={`url(#${ropeId})`} strokeWidth="7.5"/>
          {/* Rounded overlapping diagonal strands form the twisted rope body. */}
          {Array.from({ length: Math.max(0,Math.ceil((bottom-top+7)/6)) }, (_,j) => {
            const y=top-4+j*6;
            if(y>bottom-2) return null;
            const bend=j===0?2:0;
            const d=`M${x-2.6+bend},${y+5} C${x-3.7+bend},${y+2} ${x+2.8+bend},${y+1} ${x+2.7+bend},${y-1}`;
            return <g key={j}><path d={d} stroke="#88532e" strokeWidth="3.8"/>
              <path d={d} stroke="#dba66b" strokeWidth="2.7"/>
              <path d={d} transform="translate(-.45 -.55)" stroke="#ffe1ab" strokeWidth=".85"/>
              <path d={d} transform="translate(.45 .4)" stroke="#bd834b" strokeWidth=".45"/>
            </g>;
          })}
          <path d={`M${x-5},${start+2} C${x-3},${start-4} ${x+5},${start-3} ${x+6},${start+4}`} stroke="#e5b37a" strokeWidth="3"/>
          <path d={`M${x-5},${start+1} Q${x},${start-6} ${x+5},${start+1}`} stroke="#ffe2af" strokeWidth=".9"/>
        </g>;
      })}
    </svg>
    <svg className="featured-ropes" style={{ zIndex:6 }} width="100%" height="100%" aria-hidden="true">
      {ropes.map(({ x, bottom },i) => <g key={i} transform={`translate(${x} ${bottom-4})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx=".6" cy="2" rx="6.7" ry="4.2" fill="#5c341d" opacity=".28"/>
        <path d="M-2,-5 C-7,-5 -7,2 -2,4 C3,6 7,2 5,-2 C3,-5 -3,-4 -4,-1" stroke="#89502b" strokeWidth="4.6"/>
        <path d="M-2,-5 C-7,-5 -7,2 -2,4 C3,6 7,2 5,-2 C3,-5 -3,-4 -4,-1" stroke={`url(#${knotId})`} strokeWidth="3.4"/>
        <path d="M-5,2 Q0,-2 5,-2 M-4,-2 Q0,0 4,3" stroke="#93603a" strokeWidth="3.8"/>
        <path d="M-5,1 Q0,-3 5,-3 M-4,-3 Q0,-1 4,2" stroke="#e9bd86" strokeWidth="2.6"/>
        <path d="M-5,.4 Q0,-3.6 5,-3.6 M-4,-3.6 Q0,-1.6 4,1.4" stroke="#ffe6b6" strokeWidth=".65"/>
        <path d="M2,4 Q4,6 2,8" stroke="#b47a43" strokeWidth="2.4"/>
        <path d="M1.5,6 L.5,8 M2,6 L3,8" stroke="#eac48e" strokeWidth=".65"/>
      </g>)}
    </svg>
  </>;
}
