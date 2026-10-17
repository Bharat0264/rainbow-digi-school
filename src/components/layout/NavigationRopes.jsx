function RopeStroke({ rope, foreground = false }) {
  const { x, top, hole, thickness, board } = rope;
  const wrapWidth = thickness + 5;
  const knotY = hole + thickness * .9;
  if (!foreground) return <g data-rope-body={board}>
    <line x1={x} y1={top - 5} x2={x} y2={hole} stroke="#5B3B1B" strokeWidth={thickness + 1.6} strokeLinecap="round" />
    <line x1={x} y1={top - 5} x2={x} y2={hole} stroke="#A87943" strokeWidth={thickness} strokeLinecap="round" />
    {/* Fine, staggered fibres make this read as twisted hemp without broad candy-cane bands. */}
    <line x1={x - thickness * .23} y1={top - 4} x2={x - thickness * .23} y2={hole - 1} stroke="#6B4A22" strokeWidth=".85" strokeDasharray="2 4" strokeDashoffset="1" strokeLinecap="round" opacity=".8" />
    <line x1={x} y1={top - 4} x2={x} y2={hole - 1} stroke="#E8D3A8" strokeWidth=".9" strokeDasharray="2.2 4.1" strokeDashoffset="2.6" strokeLinecap="round" opacity=".9" />
    <line x1={x + thickness * .24} y1={top - 4} x2={x + thickness * .24} y2={hole - 1} stroke="#D6B77C" strokeWidth=".7" strokeDasharray="1.7 4.5" strokeDashoffset=".4" strokeLinecap="round" opacity=".8" />
  </g>;
  return <g data-rope-detail={board}>
    {[-2, 2, 6].map(offset => <g key={offset}>
      <path d={`M ${x - wrapWidth / 2} ${top + offset} Q ${x} ${top + offset + 1.4} ${x + wrapWidth / 2} ${top + offset}`} fill="none" stroke="#5B3B1B" strokeWidth={thickness * .62} strokeLinecap="round" />
      <path d={`M ${x - wrapWidth / 2} ${top + offset} Q ${x} ${top + offset + 1.4} ${x + wrapWidth / 2} ${top + offset}`} fill="none" stroke="#A87943" strokeWidth={thickness * .38} strokeLinecap="round" />
      <path d={`M ${x - wrapWidth * .28} ${top + offset - .2} Q ${x} ${top + offset + .5} ${x + wrapWidth * .28} ${top + offset - .2}`} fill="none" stroke="#E8D3A8" strokeWidth=".7" strokeLinecap="round" opacity=".8" />
    </g>)}
    <ellipse cx={x} cy={knotY} rx={thickness * .79} ry={thickness * .72} fill="#5B3B1B" />
    <ellipse cx={x} cy={knotY} rx={thickness * .6} ry={thickness * .54} fill="#A87943" />
    <path d={`M ${x - thickness * .37} ${knotY - thickness * .28} Q ${x} ${knotY - thickness * .52} ${x + thickness * .38} ${knotY + thickness * .22}`} fill="none" stroke="#E8D3A8" strokeWidth=".75" strokeLinecap="round" opacity=".85" />
  </g>;
}

export default function NavigationRopes({ ropes }) {
  return <><svg className="featured-ropes featured-ropes-back" aria-hidden="true">{ropes.map((rope, index) => <RopeStroke key={index} rope={rope} />)}</svg><svg className="featured-ropes featured-ropes-fixings" aria-hidden="true">{ropes.map((rope, index) => <RopeStroke key={index} rope={rope} foreground />)}</svg></>;
}
