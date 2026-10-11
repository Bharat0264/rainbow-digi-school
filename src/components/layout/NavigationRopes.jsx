import { useId } from 'react';

// Back loops are occluded by the bark, front wraps cross its measured thickness,
// and the mounting knots overlap the boards. No layer intercepts pointer events.
export default function NavigationRopes({ ropes }) {
  const id = useId().replaceAll(':', '');
  const material = i => `url(#${id}-fiber-${i})`;
  return <>
    <svg className="featured-ropes featured-ropes-back" width="100%" height="100%" aria-hidden="true">
      <defs>
        {/* High-resolution fibers repeat for longer drops, never stretch. */}
        {ropes.map(({x,top},i) => <pattern key={i} id={`${id}-fiber-${i}`} x={x-4} y={top}
          width="8" height="93.09" patternUnits="userSpaceOnUse" viewBox="446 0 132 1536" preserveAspectRatio="none">
          <image href="/images/navigation/rope-fibers.png" width="1024" height="1536"/>
        </pattern>)}
      </defs>
      {ropes.map(({x,top,under},i) => <path key={i}
        d={`M${x-5},${top-6} C${x-17},${top-3} ${x-14},${under-5} ${x},${under+4}`}
        fill="none" stroke={material(i)} strokeWidth="8" strokeLinecap="round"/>)}
    </svg>
    <svg className="featured-ropes" width="100%" height="100%" aria-hidden="true">
      {ropes.map(({x,top,under,bottom,board},i) => {
        const spine=`M${x-5},${top-6} C${x+1},${top-13} ${x+10},${top-6} ${x+7},${top+3} C${x+5},${top+(under-top)*.5} ${x},${under-5} ${x},${under+6} L${x},${bottom}`;
        const hitch=`M${x-4},${under+1} Q${x},${under+8} ${x+4},${under+2} M${x-4},${under+5} Q${x},${under+12} ${x+4},${under+6}`;
        return <g key={i} data-rope="true" data-board={board} data-top={top} data-under={under} data-bottom={bottom}
          fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={spine} transform="translate(2 1.5)" stroke="#382010" strokeOpacity=".28" strokeWidth="10"/>
          <path d={spine} stroke="#875630" strokeWidth="8.5"/>
          <path d={spine} stroke={material(i)} strokeWidth="8"/>
          <path d={hitch} transform="translate(1 1)" stroke="#57351d" strokeOpacity=".5" strokeWidth="5"/>
          <path d={hitch} stroke={material(i)} strokeWidth="4"/>
        </g>;
      })}
    </svg>
    <svg className="featured-ropes featured-ropes-fixings" width="100%" height="100%" aria-hidden="true">
      {ropes.map(({x,bottom},i) => {
        const fixing=`M${x},${bottom-10} L${x},${bottom-5} C${x-7},${bottom-8} ${x-8},${bottom} ${x-2},${bottom+2} C${x+3},${bottom+4} ${x+7},${bottom-1} ${x+4},${bottom-5} C${x+2},${bottom-8} ${x-3},${bottom-7} ${x-4},${bottom-4}`;
        return <g key={i} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx={x} cy={bottom-1} rx="6" ry="4" fill="#513019" stroke="#ebbe75" strokeWidth="1.5"/>
          <path d={fixing} stroke="#714524" strokeWidth="5.5"/>
          <path d={fixing} stroke={material(i)} strokeWidth="4.5"/>
          <path d={`M${x-5},${bottom-2} Q${x},${bottom-6} ${x+5},${bottom-6} M${x-4},${bottom-6} Q${x},${bottom-4} ${x+4},${bottom-1}`} stroke={material(i)} strokeWidth="3"/>
          <path d={`M${x+2},${bottom+2} Q${x+4},${bottom+5} ${x+2},${bottom+7}`} stroke={material(i)} strokeWidth="3"/>
        </g>;
      })}
    </svg>
  </>;
}
