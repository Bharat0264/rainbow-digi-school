import { useId } from 'react';

// The branch occludes the rear turn; the front turn and board fixing are
// separate from both the branch artwork and the plank bitmap.
export default function NavigationRopes({ ropes }) {
  const id = useId().replaceAll(':', '');
  const wrap = ({ x, top, under, thickness }) => {
    const start = top + thickness * 3.6;
    const middle = (top + under) / 2;
    return [
      `M ${x - 3} ${start} C ${x + 5} ${start + 5}, ${x + 5} ${middle}, ${x - 1} ${under - 3}`,
      `M ${x + 3} ${start} C ${x - 5} ${start + 5}, ${x - 5} ${middle}, ${x + 1} ${under + 2}`,
    ];
  };

  return <>
    <svg className="featured-ropes featured-ropes-back" aria-hidden="true">
      {ropes.map(({ x, top, under, thickness }, i) => (
        <path key={i} data-rope-rear={i} d={`M ${x - 2} ${top + thickness * 3.6} C ${x - 6} ${(top + under) / 2}, ${x - 5} ${under - 5}, ${x} ${under + 2}`}
          fill="none" stroke="var(--rope-shadow)" strokeWidth={thickness + 1} strokeLinecap="round" />
      ))}
    </svg>

    <svg className="featured-ropes featured-ropes-front" aria-hidden="true">
      <defs>
        {ropes.map(({ x, top, thickness }, i) => <pattern key={i} id={`${id}-fiber-${i}`}
          x={x - thickness / 2} y={top} width={thickness} height={thickness * 1536 / 132}
          patternUnits="userSpaceOnUse" viewBox="446 0 132 1536" preserveAspectRatio="none">
          <image href="/images/navigation/rope-fibers.png" width="1024" height="1536" />
        </pattern>)}
      </defs>
      {ropes.map((rope, i) => {
        const { x, top, under, hole, board, bottom, thickness } = rope;
        const dropTop = under + thickness * .5;
        const dropBottom = Math.max(hole, dropTop + 1);
        return <g key={i} data-rope="true" data-rope-front={i} data-board={board} data-x={x} data-top={top}
          data-under={under} data-bottom={bottom} data-hole={hole} data-drop-top={dropTop}
          data-drop-bottom={dropBottom} data-thickness={thickness}>
          {wrap(rope).map((d, strand) => <g key={strand}>
            <path d={d} fill="none" stroke="var(--rope-shadow)" strokeWidth={thickness + 2} strokeLinecap="round" opacity=".65" />
            <path d={d} fill="none" stroke={`url(#${id}-fiber-${i})`} strokeWidth={thickness} strokeLinecap="round" />
          </g>)}
          <path d={`M ${x} ${under - 1} Q ${x - 4} ${under + 2} ${x} ${under + 5} L ${x} ${dropBottom}`}
            fill="none" stroke="var(--rope-shadow)" strokeWidth={thickness + 2} strokeLinecap="round" opacity=".55" />
          <path d={`M ${x} ${under - 1} Q ${x - 4} ${under + 2} ${x} ${under + 5} L ${x} ${dropBottom}`}
            fill="none" stroke={`url(#${id}-fiber-${i})`} strokeWidth={thickness} strokeLinecap="round" />
          <path d={`M ${x - thickness * .6} ${under + 1} L ${x + thickness * .5} ${under + 4} M ${x + thickness * .6} ${under + 1} L ${x - thickness * .3} ${under + 5}`}
            fill="none" stroke="var(--rope-tan)" strokeWidth={thickness * .48} strokeLinecap="round" />
        </g>;
      })}
    </svg>

    <svg className="featured-ropes featured-ropes-fixings" aria-hidden="true">
      {ropes.map(({ x, hole, board, thickness, tailLength }, i) => <g key={i} data-rope-fixing={board}>
        {board !== 'logo' && <>
        <ellipse cx={x} cy={hole} rx={thickness * .9} ry={thickness * .7} fill="var(--wood-dark)" opacity=".9" />
        <ellipse cx={x} cy={hole + 1} rx={thickness * .5} ry={thickness * .4} fill="#221205" />
        <path d={`M ${x} ${hole - 2} V ${hole + tailLength - 2}`} fill="none" stroke="var(--rope-tan)"
          strokeWidth={thickness * .9} strokeLinecap="round" />
        <ellipse cx={x} cy={hole + tailLength - 2} rx={thickness * .8} ry={thickness * .55}
          fill="var(--rope-tan)" stroke="var(--rope-shadow)" strokeWidth={thickness * .25} />
        </>}
      </g>)}
    </svg>
  </>;
}
