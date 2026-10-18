import { useId } from 'react';

function RopeCoil({ x, top, angle, thickness, id }) {
  const width = thickness * 2.2;
  const height = width * 55 / 40;
  // Bottom of lowest ring is at y=47.5 in the 40x55 viewBox.
  // Align bottom ring with the top bark surface.
  const y = top - height * (47.5 / 55);
  return (
    <g transform={`rotate(${angle * 0.35} ${x} ${top})`} filter={`url(#${id}-contact)`}>
      <svg
        x={x - width / 2}
        y={y}
        width={width}
        height={height}
        viewBox="0 0 40 55"
        overflow="visible"
        aria-hidden="true"
      >
        {/* Top peg */}
        <path
          d="M 14 26 V 14 A 6 6 0 0 1 26 14 V 26 Z"
          fill={`url(#${id}-coil-grad)`}
          stroke="#38200f"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <ellipse cx="20" cy="14" rx="3.5" ry="3.5" fill="#edd2a4" opacity="0.6" />

        {/* Ring 1 (top) */}
        <rect
          x="5"
          y="17"
          width="30"
          height="11"
          rx="5.5"
          fill={`url(#${id}-coil-grad)`}
          stroke="#38200f"
          strokeWidth="2.2"
        />
        <rect x="8" y="18.5" width="24" height="3" rx="1.5" fill={`url(#${id}-coil-hl)`} />

        {/* Ring 2 (middle) */}
        <rect
          x="4"
          y="27"
          width="32"
          height="11"
          rx="5.5"
          fill={`url(#${id}-coil-grad)`}
          stroke="#38200f"
          strokeWidth="2.2"
        />
        <rect x="7" y="28.5" width="26" height="3" rx="1.5" fill={`url(#${id}-coil-hl)`} />

        {/* Ring 3 (bottom) */}
        <rect
          x="5"
          y="37"
          width="30"
          height="11"
          rx="5.5"
          fill={`url(#${id}-coil-grad)`}
          stroke="#38200f"
          strokeWidth="2.2"
        />
        <rect x="8" y="38.5" width="24" height="3" rx="1.5" fill={`url(#${id}-coil-hl)`} />
      </svg>
    </g>
  );
}

export default function NavigationRopes({ ropes }) {
  const id = useId().replaceAll(':', '');
  return (
    <>
      <svg className="featured-ropes featured-ropes-back" aria-hidden="true">
        <defs>
          <filter id={`${id}-contact`} x="-50%" y="-30%" width="200%" height="160%">
            <feDropShadow dx=".6" dy="1.2" stdDeviation="1" floodColor="#321a08" floodOpacity=".32" />
          </filter>
          <linearGradient id={`${id}-coil-grad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c49a65" />
            <stop offset="35%" stopColor="#a27546" />
            <stop offset="100%" stopColor="#704824" />
          </linearGradient>
          <linearGradient id={`${id}-coil-hl`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffae8" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#fffae8" stopOpacity="0" />
          </linearGradient>
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
            strokeWidth={thickness * 0.8}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <svg className="featured-ropes featured-ropes-front" aria-hidden="true">
        {ropes.map((rope, index) => {
          const { x, top, under, angle, bottom, hole, knotY, thickness, ropeLength, board, boardIndex } = rope;
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
                d={`M ${x} ${under} V ${hole}`}
                fill="none"
                stroke={`url(#${id}-fiber-${index})`}
                strokeWidth={thickness}
              />
              {/* Compact 3-ring coil sitting on top of the branch */}
              <RopeCoil x={x} top={top} angle={angle} thickness={thickness} id={id} />
            </g>
          );
        })}
      </svg>
      <svg className="featured-ropes featured-ropes-fixings" aria-hidden="true">
        {ropes.map(({ x, hole, bottom, board, thickness }, index) => (
          <g key={index} data-rope-fixing={board}>
            <ellipse cx={x} cy={hole} rx={thickness * 0.8} ry={thickness * 0.65} fill="#c28b49" />
            <ellipse cx={x} cy={hole - thickness * 0.08} rx={thickness * 0.6} ry={thickness * 0.5} fill="#241409" />
            <path
              d={`M ${x} ${bottom - thickness} V ${hole}`}
              fill="none"
              stroke={`url(#${id}-fiber-${index})`}
              strokeWidth={thickness}
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>
    </>
  );
}
