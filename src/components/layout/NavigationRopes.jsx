import { useId } from 'react';

const BRAID = '/images/navigation/rope-crossed-lashings.webp';

// These viewports reuse the original transparent braid at its native aspect ratio.
// Wrap, drop and board knot overlap so there are no exposed cut ends.
function RopeArtwork({ x, y, width, viewBox, height }) {
  return <svg x={x} y={y} width={width} height={height} viewBox={viewBox} overflow="hidden" aria-hidden="true">
    <image href={BRAID} width="1536" height="1024" />
  </svg>;
}

export default function NavigationRopes({ ropes }) {
  const id = useId().replaceAll(':', '');
  return <>
    <svg className="featured-ropes featured-ropes-back" aria-hidden="true">
      <defs>
        <filter id={`${id}-contact`} x="-50%" y="-30%" width="200%" height="160%">
          <feDropShadow dx=".6" dy="1.2" stdDeviation="1" floodColor="#321a08" floodOpacity=".32" />
        </filter>
        {ropes.map(({ x, thickness }, index) => <pattern key={index} id={`${id}-fiber-${index}`}
          x={x - thickness / 2} width={thickness} height={thickness * 77 / 109} patternUnits="userSpaceOnUse"
          viewBox="0 0 109 77" preserveAspectRatio="none">
          <image href="/images/navigation/rope-straight-tile.png" width="109" height="77" />
        </pattern>)}
      </defs>
      {ropes.map(({ x, top, under, thickness }, index) => <path key={index} data-rope-rear={index}
        d={`M ${x - thickness} ${top + thickness} Q ${x - thickness * 1.2} ${top - thickness} ${x} ${top - thickness * .35} L ${x} ${under}`}
        fill="none" stroke={`url(#${id}-fiber-${index})`} strokeWidth={thickness * .65} strokeLinecap="round" />)}
    </svg>
    <svg className="featured-ropes featured-ropes-front" aria-hidden="true">
      {ropes.map((rope, index) => {
        const { x, top, under, angle, bottom, hole, knotY, thickness, ropeLength, board, boardIndex, wrapTop, wrapHeight, wrapWidth } = rope;
        const end = wrapTop + wrapHeight;
        return <g key={index} data-rope="true" data-rope-front={index} data-board={board} data-board-index={boardIndex}
          data-x={x} data-top={top} data-under={under} data-bottom={bottom} data-hole={hole}
          data-drop-top={knotY} data-drop-bottom={hole} data-thickness={thickness}
          data-rope-length={ropeLength} data-wrap-angle={angle}>
          {/* The straight drop sits behind the wrap's tapered tail. */}
          <path d={`M ${x} ${end - thickness * 1.5} V ${hole}`} fill="none"
            stroke={`url(#${id}-fiber-${index})`} strokeWidth={thickness} />
          <g transform={`rotate(${angle * .3} ${x} ${end})`} filter={`url(#${id}-contact)`}>
            <RopeArtwork x={x - wrapWidth / 2} y={wrapTop} width={wrapWidth} height={wrapHeight} viewBox="275 20 290 480" />
          </g>
        </g>;
      })}
    </svg>
    <svg className="featured-ropes featured-ropes-fixings" aria-hidden="true">
      {ropes.map(({ x, hole, bottom, board, thickness }, index) => {
        const knotWidth = thickness * 2.3;
        const knotHeight = knotWidth * 220 / 280;
        return <g key={index} data-rope-fixing={board}>
          <ellipse cx={x} cy={hole} rx={thickness * .8} ry={thickness * .65} fill="#c28b49" />
          <ellipse cx={x} cy={hole - thickness * .08} rx={thickness * .6} ry={thickness * .5} fill="#241409" />
          <path d={`M ${x} ${bottom - thickness} V ${hole}`} fill="none"
            stroke={`url(#${id}-fiber-${index})`} strokeWidth={thickness} strokeLinecap="round" />
          <RopeArtwork x={x - knotWidth / 2} y={hole - knotHeight * .82}
            width={knotWidth} height={knotHeight} viewBox="285 555 280 220" />
        </g>;
      })}
    </svg>
  </>;
}
