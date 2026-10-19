import { useId } from 'react';

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
          <filter id={`${id}-wrap-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0.8" dy="1.4" stdDeviation="1.2" floodColor="rgba(30,15,0,0.35)" />
          </filter>
          <filter id={`${id}-rope-shadow`} x="-30%" y="-10%" width="160%" height="120%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="rgba(30,15,0,0.28)" />
          </filter>
          <filter id={`${id}-cylinder-blur`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.7" />
          </filter>
          {ropes.map(({ x, thickness, wrapTop, wrapBottom }, index) => (
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
          {ropes.map(({ wrapTop, wrapBottom }, index) => (
            <linearGradient
              key={`cyl-${index}`}
              id={`${id}-cylinder-${index}`}
              x1="0"
              y1={wrapTop}
              x2="0"
              y2={wrapBottom}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="rgba(25,12,0,0)" />
              <stop offset="8%" stopColor="rgba(25,12,0,0.36)" />
              <stop offset="22%" stopColor="rgba(25,12,0,0.10)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.20)" />
              <stop offset="78%" stopColor="rgba(25,12,0,0.12)" />
              <stop offset="92%" stopColor="rgba(25,12,0,0.40)" />
              <stop offset="100%" stopColor="rgba(25,12,0,0)" />
            </linearGradient>
          ))}
        </defs>
        {ropes.map((rope, index) => {
          const { x, centerY, angle, thickness, wrapTop, wrapBottom, wrapHeight } = rope;
          const step = thickness * 0.85;
          const tiltX = Math.tan(10 * Math.PI / 180) * (wrapHeight / 2);
          return (
            <g
              key={index}
              data-rope-rear={index}
              transform={angle ? `rotate(${angle} ${x} ${centerY})` : undefined}
            >
              {/* Rear wrap bands passing behind the branch */}
              <line
                x1={x - step + tiltX}
                y1={wrapBottom}
                x2={x - step - tiltX}
                y2={wrapTop}
                stroke={`url(#${id}-fiber-${index})`}
                strokeWidth={thickness * 0.9}
                strokeLinecap="round"
                opacity="0.85"
              />
              <line
                x1={x + tiltX}
                y1={wrapBottom}
                x2={x - tiltX}
                y2={wrapTop}
                stroke={`url(#${id}-fiber-${index})`}
                strokeWidth={thickness * 0.9}
                strokeLinecap="round"
                opacity="0.85"
              />
              <line
                x1={x + step + tiltX}
                y1={wrapBottom}
                x2={x + step - tiltX}
                y2={wrapTop}
                stroke={`url(#${id}-fiber-${index})`}
                strokeWidth={thickness * 0.9}
                strokeLinecap="round"
                opacity="0.85"
              />
            </g>
          );
        })}
      </svg>
      <svg className="featured-ropes featured-ropes-front" aria-hidden="true">
        {ropes.map((rope, index) => {
          const {
            x,
            top,
            under,
            centerY,
            angle,
            bottom,
            hole,
            knotY,
            thickness,
            ropeLength,
            board,
            boardIndex,
            wrapTop,
            wrapBottom,
            wrapHeight,
          } = rope;

          const step = thickness * 0.85;
          const tiltX = Math.tan(10 * Math.PI / 180) * (wrapHeight / 2);
          const wrapWidth = step * 2 + thickness;

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
                rx={wrapWidth * 0.48}
                ry={Math.max(2, thickness * 0.35)}
                fill={`url(#${id}-bark-contact)`}
              />
              <ellipse
                cx={x}
                cy={under}
                rx={wrapWidth * 0.48}
                ry={Math.max(2, thickness * 0.35)}
                fill={`url(#${id}-bark-contact)`}
              />

              {/* Wrap fixed on the branch, rotated with local branch angle */}
              <g transform={angle ? `rotate(${angle} ${x} ${centerY})` : undefined}>
                {/* Left band */}
                <line
                  x1={x - step - tiltX}
                  y1={wrapTop}
                  x2={x - step}
                  y2={wrapBottom}
                  stroke={`url(#${id}-fiber-${index})`}
                  strokeWidth={thickness}
                  strokeLinecap="round"
                  filter={`url(#${id}-wrap-shadow)`}
                />

                {/* Right band */}
                <line
                  x1={x + step - tiltX}
                  y1={wrapTop}
                  x2={x + step}
                  y2={wrapBottom}
                  stroke={`url(#${id}-fiber-${index})`}
                  strokeWidth={thickness}
                  strokeLinecap="round"
                  filter={`url(#${id}-wrap-shadow)`}
                />

                {/* Middle band: continuous from top of wrap across branch down to hole */}
                <path
                  d={`M ${x - tiltX} ${wrapTop} L ${x} ${under} V ${hole}`}
                  fill="none"
                  stroke={`url(#${id}-fiber-${index})`}
                  strokeWidth={thickness}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={`url(#${id}-rope-shadow)`}
                />

                {/* Cylinder lighting overlay fitted to the 3 tilted bands */}
                <path
                  d={`M ${x - step - tiltX - thickness * 0.5} ${wrapTop} L ${x + step - tiltX + thickness * 0.5} ${wrapTop} L ${x + step + thickness * 0.5} ${wrapBottom} L ${x - step - thickness * 0.5} ${wrapBottom} Z`}
                  fill={`url(#${id}-cylinder-${index})`}
                  filter={`url(#${id}-cylinder-blur)`}
                  pointerEvents="none"
                />

                {/* Small knot on front and 2 frayed tails */}
                <g transform={`translate(${x}, ${under})`}>
                  {/* Two short frayed tails */}
                  <path
                    d={`M -${thickness * 0.25} 0 Q -${thickness * 0.6} ${thickness * 0.4} -${thickness * 0.85} ${thickness * 0.8}`}
                    fill="none"
                    stroke={`url(#${id}-fiber-${index})`}
                    strokeWidth={thickness * 0.35}
                    strokeLinecap="round"
                  />
                  <path
                    d={`M ${thickness * 0.2} 0 Q ${thickness * 0.5} ${thickness * 0.35} ${thickness * 0.7} ${thickness * 0.7}`}
                    fill="none"
                    stroke={`url(#${id}-fiber-${index})`}
                    strokeWidth={thickness * 0.3}
                    strokeLinecap="round"
                  />
                  {/* Knot ellipse ~1.4x rope width */}
                  <ellipse
                    cx={0}
                    cy={0}
                    rx={thickness * 0.7}
                    ry={thickness * 0.55}
                    fill={`url(#${id}-fiber-${index})`}
                    filter={`url(#${id}-wrap-shadow)`}
                  />
                  <ellipse
                    cx={0}
                    cy={0}
                    rx={thickness * 0.7}
                    ry={thickness * 0.55}
                    fill="rgba(35,16,0,0.30)"
                  />
                  <ellipse
                    cx={0}
                    cy={0}
                    rx={thickness * 0.7}
                    ry={thickness * 0.55}
                    fill="none"
                    stroke="rgba(30,12,0,0.40)"
                    strokeWidth={0.8}
                  />
                </g>
              </g>
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

