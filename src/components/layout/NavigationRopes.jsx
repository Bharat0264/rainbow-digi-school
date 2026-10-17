import { useId } from 'react';

function RopeStroke({ rope, pattern, foreground = false }) {
  const { x, top, hole, thickness, board } = rope;
  const wrapWidth = thickness + 8;
  const knotY = hole + thickness * .9;
  if (!foreground) return <g data-rope-body={board}>
    <line x1={x} y1={top - 5} x2={x} y2={hole} stroke="#6B4A22" strokeWidth={thickness + 1.4} strokeLinecap="round" />
    <line x1={x} y1={top - 5} x2={x} y2={hole} stroke="#B8935F" strokeWidth={thickness} strokeLinecap="round" />
    <line x1={x - thickness * .18} y1={top - 4} x2={x - thickness * .18} y2={hole - 1} stroke={`url(#${pattern})`} strokeWidth="1.15" strokeLinecap="round" />
  </g>;
  return <g data-rope-detail={board}>
    {[0, 3, 6].map(offset => <path key={offset} d={`M ${x - wrapWidth / 2} ${top + offset} Q ${x} ${top + offset + 1} ${x + wrapWidth / 2} ${top + offset}`} fill="none" stroke="#6B4A22" strokeWidth={thickness + 1.2} strokeLinecap="round" />)}
    {[0, 3, 6].map(offset => <path key={offset} d={`M ${x - wrapWidth / 2} ${top + offset} Q ${x} ${top + offset + 1} ${x + wrapWidth / 2} ${top + offset}`} fill="none" stroke="#B8935F" strokeWidth={thickness * .72} strokeLinecap="round" />)}
    <circle cx={x} cy={knotY} r={thickness * .82} fill="#6B4A22" /><circle cx={x} cy={knotY} r={thickness * .62} fill="#B8935F" />
    <path d={`M ${x - thickness * .4} ${knotY - thickness * .3} L ${x + thickness * .45} ${knotY + thickness * .35}`} stroke="#E8D3A8" strokeWidth="1" strokeLinecap="round" />
  </g>;
}

export default function NavigationRopes({ ropes }) {
  const id = useId().replaceAll(':', '');
  return <><svg className="featured-ropes featured-ropes-back" aria-hidden="true"><defs><pattern id={id} width="5" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-26)"><path d="M 0 0 L 0 3" stroke="#E8D3A8" strokeWidth="1.2" /></pattern></defs>{ropes.map((rope, index) => <RopeStroke key={index} rope={rope} pattern={id} />)}</svg><svg className="featured-ropes featured-ropes-fixings" aria-hidden="true">{ropes.map((rope, index) => <RopeStroke key={index} rope={rope} foreground />)}</svg></>;
}
