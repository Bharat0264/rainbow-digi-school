import { useId } from 'react';

const LASHINGS = '/images/navigation/rope-lashings.webp';
const FRONT_LASHINGS = '/images/navigation/rope-crossed-lashings.webp';
const EYELETS = '/images/navigation/rope-eyelets.webp';
// Coordinates belong to the two native 1536x1024 sprite sheets, not the page.
const VARIANTS = [
  { left: 0, frontCenter: 419, rearCenter: 406, eyeCenter: 453, eyeKnotY: 546 },
  { left: 768, frontCenter: 1119, rearCenter: 1132, eyeCenter: 1127, eyeKnotY: 548 }
];

function attachment(rope, index) {
  const variant = VARIANTS[index % VARIANTS.length];
  // Loop height from crown to knot bottom in sprite is ~620px
  const barkH = Math.max(20, rope.under - rope.top);
  const scale = barkH / 620;
  const thickness = Math.min(8, Math.max(5.5, scale * 95));
  const eyeScale = thickness / 120;
  const dropTop = rope.top + 600 * scale;

  return {
    ...rope,
    ...variant,
    scale,
    thickness,
    eyeScale,
    dropTop,
    rearTransform: `translate(${rope.x - variant.rearCenter * scale} ${rope.top}) scale(${scale})`,
    transform: `translate(${rope.x - variant.frontCenter * scale} ${rope.top}) scale(${scale})`,
    fixingTransform: `translate(${rope.x - variant.eyeCenter * eyeScale} ${rope.bottom - variant.eyeKnotY * eyeScale}) scale(${eyeScale})`
  };
}

export default function NavigationRopes({ ropes }) {
  const id = useId().replaceAll(':', '');
  const attachments = ropes.map(attachment);
  const fiber = i => `url(#${id}-fiber-${i})`;
  return <>
    {/* Rear rope segments passing behind the branch (z-index 0) */}
    <svg className="featured-ropes featured-ropes-back" width="100%" height="100%" aria-hidden="true">
      <defs>
        {VARIANTS.map(({ left }, i) => (
          <clipPath key={i} id={`${id}-rear-${i}`}>
            <rect x={left} y="0" width="768" height="360" />
          </clipPath>
        ))}
      </defs>
      {attachments.map(({ rearTransform }, i) => (
        <g key={i} data-rope-rear={i} transform={rearTransform}>
          <image href={LASHINGS} width="1536" height="1024" clipPath={`url(#${id}-rear-${i % 2})`} />
        </g>
      ))}
    </svg>

    {/* Front crossed loops over bark and plumb drop ropes (z-index 2) */}
    <svg className="featured-ropes" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-tail-fade`} x1="0" y1="640" x2="0" y2="720" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <mask id={`${id}-tail-join`} x="0" y="0" width="1536" height="1024" maskUnits="userSpaceOnUse">
          <rect width="1536" height="640" fill="white" />
          <rect y="640" width="1536" height="80" fill={`url(#${id}-tail-fade)`} />
        </mask>
        {VARIANTS.map(({ left }, i) => (
          <clipPath key={i} id={`${id}-front-${i}`}>
            <rect x={left} y="0" width="768" height="720" />
          </clipPath>
        ))}
        {attachments.map(({ x, dropTop, thickness }, i) => (
          <pattern key={i} id={`${id}-fiber-${i}`}
            x={x - thickness / 2} y={dropTop} width={thickness} height={thickness * 1536 / 132}
            patternUnits="userSpaceOnUse" viewBox="446 0 132 1536" preserveAspectRatio="none">
            <image href="/images/navigation/rope-fibers.png" width="1024" height="1536" />
          </pattern>
        ))}
      </defs>
      {attachments.map(({ x, top, under, bottom, board, dropTop, thickness, transform }, i) => (
        <g key={i} data-rope="true" data-board={board} data-x={x} data-top={top} data-under={under} data-bottom={bottom}>
          {/* Drop rope shadow */}
          <path d={`M${x + 0.5},${dropTop} V${bottom}`} fill="none" stroke="#3d2212" strokeOpacity=".3" strokeWidth={thickness + 1} />
          {/* Drop rope body */}
          <path d={`M${x},${dropTop} V${bottom}`} fill="none" stroke="#b98547" strokeWidth={thickness} />
          <path d={`M${x},${dropTop} V${bottom}`} fill="none" stroke={fiber(i)} strokeWidth={thickness} />
          {/* Front crossed loop over bark */}
          <g data-rope-front={i} transform={transform}>
            <image href={FRONT_LASHINGS} width="1536" height="1024" clipPath={`url(#${id}-front-${i % 2})`} mask={`url(#${id}-tail-join)`} />
          </g>
        </g>
      ))}
    </svg>

    {/* Compact tied knots and attachment loops directly on board frames (z-index 6) */}
    <svg className="featured-ropes featured-ropes-fixings" width="100%" height="100%" aria-hidden="true">
      <defs>
        {VARIANTS.map(({ left }, i) => (
          <clipPath key={i} id={`${id}-eyelet-${i}`}>
            <rect x={left} y="380" width="768" height="280" />
          </clipPath>
        ))}
      </defs>
      {attachments.map(({ fixingTransform }, i) => (
        <g key={i} data-rope-fixing={i} transform={fixingTransform}>
          <image href={EYELETS} width="1536" height="1024" clipPath={`url(#${id}-eyelet-${i % 2})`} />
        </g>
      ))}
    </svg>
  </>;
}
