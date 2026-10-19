import { useId } from 'react';

function RopeCoil({ x, top, angle, thickness, id }) {
  // Image is 694 x 740. The 3 horizontal turns occupy ~555px height (185px per turn).
  // Keep branch knots compact while preserving their proportions and bark anchor.
  const width = thickness * 3;
  const height = width * (740 / 694);
  // Bottom of coil rests on top bark of branch with a slight overlap to bed in naturally.
  const y = top - height + thickness * 0.18;
  return (
    <g transform={angle ? `rotate(${angle * 0.35} ${x} ${top})` : undefined}>
      {/* Soft contact shadow on bark */}
      <ellipse
        cx={x}
        cy={top}
        rx={width * 0.44}
        ry={Math.max(2, thickness * 0.32)}
        fill={`url(#${id}-bark-contact)`}
      />
      <image
        href="/rope/rope-coil.webp"
        x={x - width / 2}
        y={y}
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
        filter={`url(#${id}-coil-shadow)`}
      />
    </g>
  );
}

export default function NavigationRopes({ ropes }) {
  const id = useId().replaceAll(':', '');
  return (
    <>
      <svg className="featured-ropes featured-ropes-back" aria-hidden="true">
        <defs>
          <radialGradient id={`${id}-bark-contact`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(30,15,0,0.45)" />
            <stop offset="65%" stopColor="rgba(30,15,0,0.20)" />
            <stop offset="100%" stopColor="rgba(30,15,0,0)" />
          </radialGradient>
          <filter id={`${id}-coil-shadow`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0.5" dy="1.2" stdDeviation="1.0" floodColor="rgba(30,15,0,0.28)" />
          </filter>
          <filter id={`${id}-rope-shadow`} x="-30%" y="-10%" width="160%" height="120%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="rgba(30,15,0,0.28)" />
          </filter>
          {ropes.map(({ x, thickness }, index) => (
            <pattern
              key={index}
              id={`${id}-fiber-${index}`}
              x={x - thickness / 2}
              width={thickness}
              height={thickness * 77 / 109}
              patternUnits="userSpaceOnUse"
              viewBox="0 0 109 77"
              preserveAspectRatio="none"
            >
              <image href="/images/navigation/rope-straight-tile.png" width="109" height="77" />
            </pattern>
          ))}
        </defs>
        {ropes.map(({ x, top, under, thickness }, index) => (
          <path
            key={index}
            data-rope-rear={index}
            d={`M ${x} ${top} V ${under}`}
            fill="none"
            stroke={`url(#${id}-fiber-${index})`}
            strokeWidth={thickness * 0.85}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <svg className="featured-ropes featured-ropes-front" aria-hidden="true">
        {ropes.map((rope, index) => {
          const {
            x,
            top,
            under,
            angle,
            bottom,
            hole,
            knotY,
            thickness,
            ropeLength,
            board,
            boardIndex,
          } = rope;

          return (
            <g
              key={index}
              data-rope="true"
              data-rope-front={index}
              data-board={board}
              data-board-index={boardIndex}
              data-x={x}
              data-top={top}
              data-under={under}
              data-bottom={bottom}
              data-hole={hole}
              data-drop-top={knotY}
              data-drop-bottom={hole}
              data-thickness={thickness}
              data-rope-length={ropeLength}
              data-wrap-angle={angle}
            >
              {/* Straight vertical rope drop from underside of branch straight down to hole */}
              <path
                d={`M ${x} ${under - 2} V ${hole}`}
                fill="none"
                stroke={`url(#${id}-fiber-${index})`}
                strokeWidth={thickness}
              />
              {/* Photorealistic 3D rope coil sitting on top of the branch */}
              <RopeCoil x={x} top={top} angle={angle} thickness={thickness} id={id} />
            </g>
          );
        })}
      </svg>
      <svg className="featured-ropes featured-ropes-fixings" aria-hidden="true">
        {ropes.map(({ x, hole, bottom, board, thickness }, index) => (
          <g key={index} data-rope-fixing={board}>
            {/* Eyelet hole rim and cavity */}
            <ellipse cx={x} cy={hole} rx={thickness * 0.85} ry={thickness * 0.65} fill="#c28b49" />
            <ellipse cx={x} cy={hole - thickness * 0.08} rx={thickness * 0.6} ry={thickness * 0.48} fill="#241409" />
            {/* Rope passing through eyelet */}
            <path
              d={`M ${x} ${bottom - thickness} V ${hole}`}
              fill="none"
              stroke={`url(#${id}-fiber-${index})`}
              strokeWidth={thickness}
              strokeLinecap="round"
            />
            {/* Tiny knot at eyelet */}
            <ellipse cx={x} cy={hole + thickness * 0.15} rx={thickness * 0.62} ry={thickness * 0.48} fill={`url(#${id}-fiber-${index})`} />
            <ellipse cx={x} cy={hole + thickness * 0.15} rx={thickness * 0.62} ry={thickness * 0.48} fill="rgba(30,15,0,0.28)" />
          </g>
        ))}
      </svg>
    </>
  );
}
