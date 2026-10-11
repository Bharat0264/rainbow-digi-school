import { useId } from 'react';

const LASHINGS = '/images/navigation/rope-lashings.webp';
const FRONT_LASHINGS = '/images/navigation/rope-crossed-lashings.webp';
const EYELETS = '/images/navigation/rope-eyelets.webp';
// Coordinates belong to the two native 1536x1024 sprite sheets, not the page.
const VARIANTS = [{ left: 0, center: 420, rearCenter:405, eye: 444 }, { left: 768, center: 1120, rearCenter:1128, eye: 1130 }];

function attachment(rope, index) {
  const variant = VARIANTS[index % VARIANTS.length];
  // The oval's crown and lower turn enclose the measured bark surfaces.
  const scale = (rope.under - rope.top + 4) / 600;
  return { ...rope, ...variant, scale, dropTop: rope.under + 9,
    thickness: Math.min(7.5, Math.max(5, scale * 95)),
    rearTransform: `translate(${rope.x-variant.rearCenter*scale} ${rope.top-4}) scale(${scale})`,
    transform: `translate(${rope.x-variant.center*scale} ${rope.top-4}) scale(${scale})` };
}

export default function NavigationRopes({ ropes }) {
  const id = useId().replaceAll(':', '');
  const attachments = ropes.map(attachment);
  const fiber = i => `url(#${id}-fiber-${i})`;
  return <>
    {/* The original transparent branch (z=1) occludes these closed rear turns. */}
    <svg className="featured-ropes featured-ropes-back" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-tail-fade`} x1="0" y1="770" x2="0" y2="850" gradientUnits="userSpaceOnUse">
          <stop stopColor="white"/><stop offset="1" stopColor="black"/>
        </linearGradient>
        <mask id={`${id}-tail-join`} x="0" y="0" width="1536" height="1024" maskUnits="userSpaceOnUse">
          <rect width="1536" height="770" fill="white"/>
          <rect y="770" width="1536" height="80" fill={`url(#${id}-tail-fade)`}/>
        </mask>
        {VARIANTS.map(({left},i) => <g key={i}>
          <clipPath id={`${id}-rear-${i}`}><rect x={left} y="0" width="768" height="800"/></clipPath>
          <clipPath id={`${id}-front-${i}`}>
            <rect x={left} y="0" width="768" height="850"/>
          </clipPath>
          <clipPath id={`${id}-eyelet-${i}`}><rect x={left} y="230" width="768" height="610"/></clipPath>
        </g>)}
        {attachments.map(({x,dropTop,thickness},i) => <pattern key={i} id={`${id}-fiber-${i}`}
          x={x-thickness/2} y={dropTop} width={thickness} height={thickness*1536/132}
          patternUnits="userSpaceOnUse" viewBox="446 0 132 1536" preserveAspectRatio="none">
          <image href="/images/navigation/rope-fibers.png" width="1024" height="1536"/>
        </pattern>)}
      </defs>
      {attachments.map(({rearTransform},i) => <g key={i} data-rope-rear={i} transform={rearTransform}>
        <image href={LASHINGS} width="1536" height="1024" clipPath={`url(#${id}-rear-${i%2})`}/>
      </g>)}
    </svg>
    <svg className="featured-ropes" width="100%" height="100%" aria-hidden="true">
      {attachments.map(({x,top,under,bottom,board,dropTop,thickness,transform},i) =>
        <g key={i} data-rope="true" data-board={board} data-x={x} data-top={top} data-under={under} data-bottom={bottom}>
          {/* Plumb standing part overlaps the illustrated knot's outgoing tail. */}
          <path d={`M${x+1},${dropTop} V${bottom}`} fill="none" stroke="#54321e" strokeOpacity=".22" strokeWidth={thickness+1}/>
          <path d={`M${x},${dropTop} V${bottom}`} fill="none" stroke={fiber(i)} strokeWidth={thickness}/>
          <g data-rope-front={i} transform={transform}>
            <image href={FRONT_LASHINGS} width="1536" height="1024" clipPath={`url(#${id}-front-${i%2})`} mask={`url(#${id}-tail-join)`}/>
          </g>
        </g>)}
    </svg>
    {/* Small wooden collars and tied ends overlap only the upper board frame. */}
    <svg className="featured-ropes featured-ropes-fixings" width="100%" height="100%" aria-hidden="true">
      {attachments.map(({x,bottom,eye},i) => <g key={i} data-rope-fixing={i}
        transform={`translate(${x-eye*.04} ${bottom-480*.04}) scale(.04)`}>
        <image href={EYELETS} width="1536" height="1024" clipPath={`url(#${id}-eyelet-${i%2})`}/>
      </g>)}
    </svg>
  </>;
}
