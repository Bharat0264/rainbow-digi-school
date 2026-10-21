import { useId } from 'react';
import { ropeWrapFit } from './ropeGeometry';

function RopeCoil({ x, top, under, angle = 0, thickness, id, isLogo }) {
  // House connectors and branch wraps share the same measured rope anchors.
  if (isLogo) {
    const connectorWidth = thickness * 2.8;
    const height = connectorWidth * 1040 / 390;
    return (
      <svg x={x - connectorWidth / 2} y={top - thickness * 2.1} width={connectorWidth} height={height} viewBox="245 40 390 1040" style={{ overflow: 'hidden' }} filter={`url(#${id}-coil-shadow)`}>
        <image href="/assets/nav/hex-brass-rope-connector.webp" width="887" height="1774" clipPath={`url(#${id}-logo-knot-clip)`} />
      </svg>
    );
  }
  const fit = ropeWrapFit(x, top, under, angle, thickness);
  return (
    <g data-wrap-angle={angle} data-wrap-join={fit.joinY} transform={fit.transform}>
      <ellipse cx={x} cy={fit.joinY - fit.bodyHeight / 2} rx={fit.width * .55} ry={fit.bodyHeight * .49} fill={`url(#${id}-bark-contact)`} opacity=".42" />
      <svg data-branch-wrap="double" x={fit.x} y={fit.y} width={fit.width} height={fit.height} viewBox="160 60 720 940" preserveAspectRatio="none" style={{ overflow: 'hidden' }} filter={`url(#${id}-coil-shadow)`}>
        <image href="/assets/nav/branch-double-wrap.webp" width="1024" height="1536" clipPath={`url(#${id}-branch-wrap-clip)`} />
      </svg>
    </g>
  );
}

export default function NavigationRopes({ ropes, railFasteners = [] }) {
  const id = useId().replaceAll(':', '');
  return (
    <>
      <svg className="featured-ropes featured-ropes-back" aria-hidden="true">
        <defs>
          <clipPath id={`${id}-branch-wrap-clip`}><rect x="160" y="60" width="720" height="1460" /></clipPath>
          <clipPath id={`${id}-branch-stem-clip`}><rect x="410" y="1040" width="220" height="300" /></clipPath>
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
              height={thickness * (isLogo ? 380 / 180 : 300 / 220)}
              patternUnits="userSpaceOnUse"
              viewBox={isLogo ? '348 1100 180 380' : '410 1040 220 300'}
              preserveAspectRatio="none"
              style={{ overflow: 'hidden' }}
            >
              {isLogo ? (
                <image href="/assets/nav/hex-brass-rope-connector.webp" width="887" height="1774" clipPath={`url(#${id}-logo-stem-clip)`} />
              ) : (
                <image href="/assets/nav/branch-double-wrap.webp" width="1024" height="1536" clipPath={`url(#${id}-branch-stem-clip)`} />
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
        {railFasteners.map(({x,y,size},index)=>(
          <image key={`screw-${index}`} data-house-screw={index} href="/assets/nav/gold-rail-screw.webp" x={x-size/2} y={y-size/2} width={size} height={size} preserveAspectRatio="xMidYMid meet" />
        ))}
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
                  d={`M ${rope.upperX ?? x} ${under + thickness * 5} L ${x} ${hole}`}
                  fill="none"
                  stroke="#936033"
                  strokeWidth={thickness}
                  strokeLinecap="butt"
                />
              )}
              <path
                d={rope.isLogo ? `M ${rope.upperX ?? x} ${under + thickness * 5} L ${x} ${hole}` : `M ${x} ${under - 2} V ${hole}`}
                fill="none"
                stroke={`url(#${id}-fiber-${index})`}
                strokeWidth={thickness}
                strokeLinecap="butt"
              />
              {/* Photorealistic 3D rope coil sitting on top of the branch */}
              <RopeCoil x={rope.isLogo ? (rope.upperX ?? x) : x} top={top} under={under} angle={angle} thickness={thickness} id={id} isLogo={rope.isLogo} />
            </g>
          );
        })}
      </svg>
      <svg className="featured-ropes featured-ropes-fixings" aria-hidden="true">
        {ropes.map(({ x, hole, bottom, under, isLogo, board, thickness }, index) => isLogo ? null : (
          <g key={index} data-rope-fixing={board}>
            <defs>
              <clipPath id={`${id}-nut-lip-${index}`}>
                <rect x={x-thickness*1.8} y={hole+thickness*.2} width={thickness*3.6} height={thickness*2} />
              </clipPath>
            </defs>
            {/* Eyelet hole rim and cavity */}
            <ellipse cx={x} cy={hole} rx={thickness * 0.85} ry={thickness * 0.65} fill="#c28b49" />
            <ellipse cx={x} cy={hole - thickness * 0.08} rx={thickness * 0.6} ry={thickness * 0.48} fill="#241409" />
            <image
              data-board-nut={board}
              href="/assets/nav/board-rope-hex-nut.webp"
              x={x - thickness * 1.8}
              y={hole - thickness * 3.6 * .43}
              width={thickness * 3.6}
              height={thickness * 3.6}
              preserveAspectRatio="xMidYMid meet"
              filter={`url(#${id}-coil-shadow)`}
            />
            {/* Rope passing through eyelet */}
            <path
              d={`M ${x} ${bottom - thickness} V ${hole + thickness * .15}`}
              fill="none"
              stroke={`url(#${id}-fiber-${index})`}
              strokeWidth={thickness}
              strokeLinecap={isLogo ? 'butt' : 'round'}
            />
            {/* The front washer occludes the rope tip as it passes into the hole. */}
            <image href="/assets/nav/board-rope-hex-nut.webp" x={x-thickness*1.8} y={hole-thickness*3.6*.43} width={thickness*3.6} height={thickness*3.6} clipPath={`url(#${id}-nut-lip-${index})`} />
          </g>
        ))}
      </svg>
    </>
  );
}
