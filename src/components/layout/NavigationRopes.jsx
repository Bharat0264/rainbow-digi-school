import { useId } from 'react';

const LASHINGS = '/images/navigation/rope-lashings.webp';
const FRONT_LASHINGS = '/images/navigation/rope-crossed-lashings.webp';
const EYELETS = '/images/navigation/rope-eyelets.webp';
// Coordinates belong to the two native 1536x1024 sprite sheets, not the page.
const VARIANTS = [
  { left: 0, frontCenter: 430, rearCenter: 406, eyeRopeX: 438, ringBaseY: 575 },
  { left: 768, frontCenter: 1116, rearCenter: 1128, eyeRopeX: 1122, ringBaseY: 575 }
];

function attachment(rope, index) {
  const variant = VARIANTS[index % VARIANTS.length];
  // Native crown y=16, lower hitch y=740. The knot hugs the lower bark
  // instead of hanging a fixed distance beneath it on small screens.
  const barkScale = (rope.under - rope.top) / (740 - 16);
  // In a short hanging span, keep both knots distinct. The front hitch sits
  // higher on the bark and its standing end runs down the remaining face.
  // 255 is the eyelet's collar-to-frame distance; 60 leaves half a strand
  // between the two knots, all measured in the existing sprite coordinates.
  const spanScale = (rope.bottom - rope.top) / (724 + 255 * 120 / 132 + 60);
  const scale = Math.min(barkScale, spanScale);
  const spriteY = rope.top - 16 * scale;
  const thickness = scale * 120;
  const eyeScale = thickness / 132;
  const dropTop = spriteY + 740 * scale;
  // Position so the drop rope runs continuously from branch underside directly into the board top edge
  const dropBottom = rope.bottom + 8;

  return {
    ...rope,
    ...variant,
    scale,
    thickness,
    eyeScale,
    dropTop,
    dropBottom,
    spriteTop,
    // Show the rear turn just above the bark; the branch occludes its sides.
    rearTransform: `translate(${rope.x - variant.rearCenter * scale} ${spriteY - thickness / 2}) scale(${scale})`,
    transform: `translate(${rope.x - variant.frontCenter * scale} ${spriteY}) scale(${scale})`,
    fixingTransform: `translate(${rope.x - variant.eyeRopeX * eyeScale} ${spriteTop}) scale(${eyeScale})`
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
        <linearGradient id={`${id}-tail-fade`} x1="0" y1="750" x2="0" y2="800" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <mask id={`${id}-tail-join`} x="0" y="0" width="1536" height="1024" maskUnits="userSpaceOnUse">
          <rect width="1536" height="750" fill="white" />
          <rect y="750" width="1536" height="50" fill={`url(#${id}-tail-fade)`} />
        </mask>
        {VARIANTS.map(({ left }, i) => (
          <clipPath key={i} id={`${id}-front-${i}`}>
            <rect x={left} y="0" width="768" height="800" />
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
      {attachments.map(({ x, top, under, bottom, board, dropTop, dropBottom, thickness, transform }, i) => (
        <g key={i} data-rope="true" data-board={board} data-x={x} data-top={top} data-under={under} data-bottom={bottom} data-drop-top={dropTop} data-drop-bottom={dropBottom} data-thickness={thickness}>
          {/* Drop rope shadow */}
          <path d={`M${x + 0.5},${dropTop} V${dropBottom}`} fill="none" stroke="#3d2212" strokeOpacity=".3" strokeWidth={thickness + 1} />
          {/* Drop rope body */}
          <path d={`M${x},${dropTop} V${dropBottom}`} fill="none" stroke="#c4965c" strokeWidth={thickness} />
          <path d={`M${x},${dropTop} V${dropBottom}`} fill="none" stroke={fiber(i)} strokeWidth={thickness} />
          {/* Front crossed loop over bark */}
          <g data-rope-front={i} transform={transform}>
            <image href={FRONT_LASHINGS} width="1536" height="1024" clipPath={`url(#${id}-front-${i % 2})`} mask={`url(#${id}-tail-join)`} />
          </g>
        </g>
      ))}
    </svg>

    {/* Small, believable securing ring and knot anchored firmly onto board frame (z-index 6) */}
    <svg className="featured-ropes featured-ropes-fixings" width="100%" height="100%" aria-hidden="true">
      <defs>
        {/* Blend the standing rope into the short collar above the eyelet. */}
        <linearGradient id={`${id}-eyelet-fade`} x1="0" y1="280" x2="0" y2="320" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="black" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        {/* Soft fade at bottom (y=610..640) so knot ends neatly on the wooden frame */}
        <linearGradient id={`${id}-eyelet-tail`} x1="0" y1="610" x2="0" y2="640" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        {VARIANTS.map(({ left }, i) => (
          <mask key={i} id={`${id}-eyelet-mask-${i}`} maskUnits="userSpaceOnUse" x={left} y="0" width="768" height="650">
            <rect x={left} y="280" width="768" height="40" fill={`url(#${id}-eyelet-fade)`} />
            <rect x={left} y="320" width="768" height="290" fill="white" />
            <rect x={left} y="610" width="768" height="30" fill={`url(#${id}-eyelet-tail)`} />
          </mask>
        ))}
        {VARIANTS.map(({ left }, i) => (
          <clipPath key={i} id={`${id}-eyelet-${i}`}>
            <rect x={left} y="0" width="768" height="640" />
          </clipPath>
        ))}
      </defs>
      {/* Contact shadows grounding the rings and knots onto the wooden board top frame */}
      {attachments.map(({ x, bottom, thickness }, i) => (
        <ellipse key={`shadow-${i}`} cx={x} cy={bottom} rx={thickness * 1.5} ry={thickness * .35} fill="#2d160a" opacity="0.38" />
      ))}
      {/* Fully visible wooden attachment rings with through-rope and compact securing knots */}
      {attachments.map(({ fixingTransform }, i) => (
        <g key={`fixing-${i}`} data-rope-fixing={i} transform={fixingTransform}>
          <image href={EYELETS} width="1536" height="1024" clipPath={`url(#${id}-eyelet-${i % 2})`} mask={`url(#${id}-eyelet-mask-${i % 2})`} />
        </g>
      ))}
    </svg>
  </>;
}
