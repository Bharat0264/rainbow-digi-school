import { useId } from 'react';

export default function NavigationRopes({ ropes }) {
  const id = useId().replaceAll(':', '');
  return (
    <>
      <svg className="featured-ropes featured-ropes-back" aria-hidden="true">
        <defs>
          <radialGradient id={`${id}-bark-contact`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(30,15,0,0.38)" />
            <stop offset="65%" stopColor="rgba(30,15,0,0.18)" />
            <stop offset="100%" stopColor="rgba(30,15,0,0)" />
          </radialGradient>
          <filter id={`${id}-wrap-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1.2" dy="2.2" stdDeviation="1.8" floodColor="rgba(30,15,0,0.35)" />
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
            strokeWidth={thickness * 0.8}
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
            wrapTop,
            wrapHeight,
            wrapWidth,
          } = rope;

          const wWidth = wrapWidth || (under - top) * 1.10 * 1.15;
          const wHeight = wrapHeight || (under - top) * 1.10;
          const wTop = wrapTop !== undefined ? wrapTop : top - (under - top) * 0.05;

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
              {/* Soft contact shadows on bark above and below each wrap */}
              <ellipse
                cx={x}
                cy={top}
                rx={wWidth * 0.42}
                ry={Math.max(2.5, wHeight * 0.08)}
                fill={`url(#${id}-bark-contact)`}
              />
              <ellipse
                cx={x}
                cy={under}
                rx={wWidth * 0.42}
                ry={Math.max(2.5, wHeight * 0.08)}
                fill={`url(#${id}-bark-contact)`}
              />

              {/* Hanging rope tucked 10px under lowest coil turn, swings around wrap bottom center (x, under) */}
              <g transform={angle ? `rotate(${angle} ${x} ${under})` : undefined}>
                <path
                  d={`M ${x} ${under - 10} V ${hole}`}
                  fill="none"
                  stroke={`url(#${id}-fiber-${index})`}
                  strokeWidth={thickness}
                  filter={`url(#${id}-rope-shadow)`}
                />
              </g>

              {/* Realistic rope wrap fixed in place on the branch, in front of leaves and bark */}
              <image
                href="/rope/wrap.webp"
                x={x - wWidth / 2}
                y={wTop}
                width={wWidth}
                height={wHeight}
                preserveAspectRatio="none"
                filter={`url(#${id}-wrap-shadow)`}
              />
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

