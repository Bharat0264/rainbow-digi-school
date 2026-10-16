import { useId } from 'react';

// Every attachment uses the same measured bark surface. The three SVG layers
// sandwich the branch and board images without making either image interactive.
export default function NavigationRopes({ ropes }) {
  const id = useId().replaceAll(':', '');
  const fiber = index => `url(#${id}-fiber-${index})`;
  const coils = ({ x, top, under, thickness }) => {
    const depth = under - top;
    return [0, 1].map(turn => {
      const y = turn === 0 ? top + depth * .23 : under - thickness * 1.5;
      const reach = thickness * .78;
      return `M ${x - reach} ${y} C ${x - reach * .35} ${y - thickness * .18}, ${x + reach * .3} ${y + thickness * .38}, ${x + reach} ${y + thickness * .7}`;
    });
  };

  return <>
    {/* A small rear sliver remains visible below the bark edge. */}
    <svg className="featured-ropes featured-ropes-back" aria-hidden="true">
      {ropes.map(({ x, top, under, angle, thickness }, index) => (
        <g key={index} data-rope-rear={index} transform={`rotate(${angle} ${x} ${(top + under) / 2})`}>
          <path d={`M ${x - thickness * .38} ${top + thickness} C ${x - thickness * .62} ${(top + under) / 2}, ${x - thickness * .35} ${under - 2}, ${x} ${under + thickness * .4}`}
            fill="none" stroke="var(--rope-shadow)" strokeWidth={thickness * .8} strokeLinecap="round" />
          <path d={`M ${x - thickness * .38} ${top + thickness} C ${x - thickness * .62} ${(top + under) / 2}, ${x - thickness * .35} ${under - 2}, ${x} ${under + thickness * .4}`}
            fill="none" stroke="var(--rope-tan)" strokeWidth={thickness * .48} strokeLinecap="round" />
        </g>
      ))}
    </svg>

    <svg className="featured-ropes featured-ropes-front" aria-hidden="true">
      <defs>
        <filter id={`${id}-contact`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        {ropes.map(({ x, top, thickness }, index) => <pattern key={index} id={`${id}-fiber-${index}`}
          x={x - thickness / 2} y={top} width={thickness} height={thickness * 1536 / 132}
          patternUnits="userSpaceOnUse" viewBox="446 0 132 1536" preserveAspectRatio="none">
          <image href="/images/navigation/rope-fibers.png" width="1024" height="1536" />
        </pattern>)}
      </defs>
      {ropes.map((rope, index) => {
        const { x, top, under, angle, knotY, hole, bottom, thickness, ropeLength, board, boardIndex } = rope;
        const turns = coils(rope);
        const lowerTurn = `M ${x + thickness * .78} ${under - thickness * .8} Q ${x + thickness * .45} ${under - 1} ${x} ${knotY}`;
        const lengthVariable = `var(--rope-len-${boardIndex})`;
        return <g key={index} data-rope="true" data-rope-front={index} data-board={board} data-board-index={boardIndex} data-x={x}
          data-top={top} data-under={under} data-bottom={bottom} data-hole={hole}
          data-drop-top={knotY} data-drop-bottom={hole} data-thickness={thickness}
          data-rope-length={ropeLength} data-wrap-angle={angle}>
          <g transform={`rotate(${angle} ${x} ${(top + under) / 2})`}>
            {turns.map((path, turn) => <g key={turn}>
              <path d={path} fill="none" stroke="var(--wood-dark)" strokeWidth={thickness + 3}
                strokeLinecap="round" opacity=".27" filter={`url(#${id}-contact)`} />
              <path d={path} fill="none" stroke="var(--rope-shadow)" strokeWidth={thickness + .7}
                strokeLinecap="round" opacity=".45" />
              <path d={path} fill="none" stroke={fiber(index)} strokeWidth={thickness}
                strokeLinecap="round" />
              <path d={path} fill="none" stroke="var(--rope-light)" strokeWidth={thickness * .16}
                strokeLinecap="round" opacity=".65" transform="translate(-.7 -.8)" />
            </g>)}
            <path d={lowerTurn} fill="none" stroke={fiber(index)} strokeWidth={thickness * .85}
              strokeLinecap="round" />
          </g>
          {/* The two twisted strands share one CSS-controlled hanging length. */}
          <rect x={x - thickness * .62} y={knotY} width={thickness * 1.24} height={ropeLength}
            style={{ height: lengthVariable }} fill="var(--rope-shadow)" opacity=".25" />
          <rect x={x - thickness * .55} y={knotY} width={thickness * .52} height={ropeLength}
            style={{ height: lengthVariable }} fill={fiber(index)} />
          <rect x={x + thickness * .03} y={knotY} width={thickness * .52} height={ropeLength}
            style={{ height: lengthVariable }} fill={fiber(index)} />
          <path d={`M ${x - thickness * .42} ${knotY} V ${hole}`} fill="none"
            stroke="var(--rope-light)" strokeWidth={thickness * .12} opacity=".45" />
          <path d={`M ${x - thickness * .2} ${knotY - 1} Q ${x - thickness * .55} ${knotY - 3}, ${x} ${knotY - 1} Q ${x + thickness * .55} ${knotY + 2}, ${x + thickness * .2} ${knotY + 1}`}
            fill="none" stroke="var(--rope-shadow)" strokeWidth={thickness * .65} strokeLinecap="round" />
          <path d={`M ${x - thickness * .2} ${knotY - 1} Q ${x - thickness * .55} ${knotY - 3}, ${x} ${knotY - 1} Q ${x + thickness * .55} ${knotY + 2}, ${x + thickness * .2} ${knotY + 1}`}
            fill="none" stroke={fiber(index)} strokeWidth={thickness * .42} strokeLinecap="round" />
        </g>;
      })}
    </svg>

    {/* Menu ropes disappear into dark drilled holes; logo ropes lash the top bamboo. */}
    <svg className="featured-ropes featured-ropes-fixings" aria-hidden="true">
      {ropes.map(({ x, hole, bottom, board, thickness }, index) => <g key={index} data-rope-fixing={board}>
        {board === 'logo' ? <>
          <path d={`M ${x} ${bottom - 1} V ${hole + thickness * .25} C ${x - thickness * .8} ${hole - thickness * .1}, ${x - thickness * .8} ${hole + thickness * .8}, ${x} ${hole + thickness}`}
            fill="none" stroke="var(--rope-shadow)" strokeWidth={thickness + 1} strokeLinecap="round" opacity=".35" />
          <path d={`M ${x} ${bottom - 1} V ${hole + thickness * .25} C ${x - thickness * .8} ${hole - thickness * .1}, ${x - thickness * .8} ${hole + thickness * .8}, ${x} ${hole + thickness}`}
            fill="none" stroke={fiber(index)} strokeWidth={thickness * .8} strokeLinecap="round" />
          <path d={`M ${x - thickness * .45} ${hole + thickness * .4} L ${x + thickness * .45} ${hole + thickness * .8}`}
            fill="none" stroke="var(--rope-tan)" strokeWidth={thickness * .3} strokeLinecap="round" />
        </> : <>
          <circle cx={x} cy={hole} r={thickness * .62} fill="var(--wood-light)" opacity=".7" />
          <circle cx={x} cy={hole} r={thickness * .48} fill="var(--wood-dark)" />
          <circle cx={x + thickness * .1} cy={hole + thickness * .1} r={thickness * .29} fill="#201006" />
          <path d={`M ${x} ${bottom - 1} V ${hole - thickness * .15}`}
            fill="none" stroke={fiber(index)} strokeWidth={thickness * .85} strokeLinecap="round" />
        </>}
      </g>)}
    </svg>
  </>;
}
