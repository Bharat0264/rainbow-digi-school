import { useId } from 'react';

function RopeCoil({ x, top, angle, thickness, id, isLogo }) {
  // Image is 694 x 740. The 3 horizontal turns occupy ~555px height (185px per turn).
  // Keep branch knots compact while preserving their proportions and bark anchor.
  const width = thickness * 3;
  if (isLogo) {
    const connectorWidth = thickness * 2.8;
    const height = connectorWidth * 1040 / 390;
    return (
      <svg x={x - connectorWidth / 2} y={top - thickness * 2.1} width={connectorWidth} height={height} viewBox="245 40 390 1040" style={{ overflow: 'hidden' }} filter={`url(#${id}-coil-shadow)`}>
        <image href="/assets/nav/brass-rope-connector.webp" width="887" height="1774" clipPath={`url(#${id}-logo-knot-clip)`} />
      </svg>
    );
  }
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
          <clipPath id={`${id}-logo-knot-clip`}><rect x="245" y="40" width="390" height="1040" /></clipPath>
          <clipPath id={`${id}-logo-stem-clip`}><rect x="348" y="1100" width="180" height="380" /></clipPath>
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
          {/* Match the hanging fiber texture to the upper coil's warm brown palette. */}
          <filter id={`${id}-fiber-color`} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.7975" />
              <feFuncG type="linear" slope="0.7343" />
              <feFuncB type="linear" slope="0.7458" />
            </feComponentTransfer>
          </filter>
          {ropes.map(({ x, thickness, isLogo }, index) => (
            <pattern
              key={index}
              id={`${id}-fiber-${index}`}
              x={x - thickness / 2}
              width={thickness}
              height={thickness * (isLogo ? 380 / 180 : 77 / 109)}
              patternUnits="userSpaceOnUse"
              viewBox={isLogo ? '348 1100 180 380' : '0 0 109 77'}
              preserveAspectRatio="none"
              style={{ overflow: 'hidden' }}
            >
              {isLogo ? (
                <image href="/assets/nav/brass-rope-connector.webp" width="887" height="1774" clipPath={`url(#${id}-logo-stem-clip)`} />
              ) : (
                <image href="/images/navigation/rope-straight-tile.png" width="109" height="77" filter={`url(#${id}-fiber-color)`} />
              )}
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
              {rope.isLogo && (
                <path
                  d={`M ${x} ${under + thickness * 5} V ${hole}`}
                  fill="none"
                  stroke="#936033"
                  strokeWidth={thickness}
                  strokeLinecap="butt"
                />
              )}
              <path
                d={`M ${x} ${rope.isLogo ? under + thickness * 5 : under - 2} V ${hole}`}
                fill="none"
                stroke={`url(#${id}-fiber-${index})`}
                strokeWidth={thickness}
                strokeLinecap="butt"
              />
              {/* Photorealistic 3D rope coil sitting on top of the branch */}
              <RopeCoil x={x} top={top} angle={angle} thickness={thickness} id={id} isLogo={rope.isLogo} />
            </g>
          );
        })}
      </svg>
      <svg className="featured-ropes featured-ropes-fixings" aria-hidden="true">
        {ropes.map(({ x, hole, bottom, under, isLogo, board, thickness }, index) => isLogo ? null : (
          <g key={index} data-rope-fixing={board}>
            {/* Eyelet hole rim and cavity */}
            <ellipse cx={x} cy={hole} rx={thickness * 0.85} ry={thickness * 0.65} fill="#c28b49" />
            <ellipse cx={x} cy={hole - thickness * 0.08} rx={thickness * 0.6} ry={thickness * 0.48} fill="#241409" />
            {/* Rope passing through eyelet */}
            <path
              d={`M ${x} ${isLogo ? under : bottom - thickness} V ${hole}`}
              fill="none"
              stroke={`url(#${id}-fiber-${index})`}
              strokeWidth={thickness}
              strokeLinecap={isLogo ? 'butt' : 'round'}
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
