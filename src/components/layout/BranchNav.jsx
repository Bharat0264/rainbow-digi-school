import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { LeafTwig, MonkeyArtwork, Tail } from './BranchNavArt';
import { NAV } from '../../data/nav';
import './BranchNav.css';

// All geometry is expressed in viewport-pixel SVG coordinates.
export function usePendulum({ pivot, damping = 2.4, stiffness = 12, limit = 3 }) {
  const reduced = useReducedMotion();
  const [angle, setAngle] = useState(0);
  const impulse = useRef(0);
  useEffect(() => {
    if (reduced) { setAngle(0); return; }
    let frame, previous = 0, a = 0, velocity = .07, next = performance.now() + 3500;
    const tick = time => {
      const dt = Math.min((time - (previous || time)) / 1000, .032); previous = time;
      if (!document.hidden) {
        if (time > next) { impulse.current += (Math.random() - .5) * .18; next = time + 3000 + Math.random() * 3000; }
        velocity += impulse.current; impulse.current = 0;
        velocity += (-stiffness * Math.sin(a) - damping * velocity) * dt;
        a = Math.max(-limit * Math.PI / 180, Math.min(limit * Math.PI / 180, a + velocity * dt));
        setAngle(a * 180 / Math.PI);
      }
      frame = requestAnimationFrame(tick);
    };
    const wind = e => { impulse.current += Math.max(-.012, Math.min(.012, (e.movementX || 0) * .0006)); };
    window.addEventListener('pointermove', wind); frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', wind); };
  }, [reduced, damping, stiffness, limit, pivot.x, pivot.y]);
  return { angle, push: amount => { impulse.current += amount; } };
}
const thickness = t => 34 - 12 * t;
function sample(path, x) {
  let lo = 0, hi = path.getTotalLength();
  for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (path.getPointAtLength(mid).x < x) lo = mid; else hi = mid; }
  const l = (lo + hi) / 2, p = path.getPointAtLength(l), q = path.getPointAtLength(Math.min(l + 1, path.getTotalLength()));
  const dx = q.x - p.x, dy = q.y - p.y, norm = Math.hypot(dx, dy) || 1;
  const radius = thickness(l / path.getTotalLength()) / 2;
  return { x: p.x - dy / norm * (radius - 3.5), y: p.y + dx / norm * (radius - 3.5), center: p, radius };
}
export function verifyAttachments(points) {
  if (import.meta.env.DEV) points.forEach(p => { if (Math.hypot(p.x - p.center.x, p.y - p.center.y) > p.radius + .01) console.warn('BranchNav rope attachment outside wood', p); });
}
export function Rope({ from, to, wrapOnly = false }) { return <g aria-hidden="true">{!wrapOnly&&<path d={`M${from.x} ${from.y}L${to.x} ${to.y}`} stroke="#81502d" strokeWidth="3"/>}<path d={`M${from.x-3} ${from.y-19}q-5 10 3 19`} fill="none" stroke="#bd8c57" strokeWidth="4"/><circle cx={from.x} cy={from.y} r="3" fill="#81502d"/></g>; }
export function Branch({ d, pathRef }) { return <g aria-hidden="true"><path d={d} stroke="#4a2a12" strokeWidth="34" fill="none"/><path ref={pathRef} d={d} stroke="#8b5e3c" strokeWidth="28" fill="none"/><path d={d} stroke="#c9a06a" strokeWidth="5" fill="none" transform="translate(0 -11)"/></g>; }
function rotate(point, pivot, angle) { const a=angle*Math.PI/180, x=point.x-pivot.x,y=point.y-pivot.y; return {x:pivot.x+x*Math.cos(a)-y*Math.sin(a),y:pivot.y+x*Math.sin(a)+y*Math.cos(a)}; }
export function WoodBoard({ item, anchors, width, drop, onNavigate }) {
  const pivot={x:(anchors[0].x+anchors[1].x)/2,y:(anchors[0].y+anchors[1].y)/2};
  const { angle,push }=usePendulum({pivot,limit:1.5}); const y=Math.max(anchors[0].y,anchors[1].y)+drop;
  const corners=[{x:pivot.x-width/2+10,y},{x:pivot.x+width/2-10,y}];
  return <g><Rope from={anchors[0]} to={rotate(corners[0],pivot,angle)}/><Rope from={anchors[1]} to={rotate(corners[1],pivot,angle)}/><g transform={`rotate(${angle} ${pivot.x} ${pivot.y})`}><foreignObject x={pivot.x-width/2} y={y} width={width} height="58"><NavLink to={item.path} onClick={onNavigate} onPointerEnter={()=>push(.12)} onFocus={()=>push(.1)} className={({isActive})=>`bn-board ${isActive?'bn-active':''}`}><span>{item.label}</span></NavLink></foreignObject></g></g>;
}
export function Monkey({ x, y, scale=1, onBounds }) {
  const { angle, push } = usePendulum({pivot:{x,y},limit:4});
  return <MonkeyArtwork x={x} y={y} scale={scale} angle={angle} push={push} onBounds={onBounds}/>;
}
export default function BranchNav() {
  const ref=useRef(null),pathRef=useRef(null);const[width,setWidth]=useState(1280),[open,setOpen]=useState(false),[compact,setCompact]=useState(false),[geometry,setGeometry]=useState(null);
  const [contentHeight,setContentHeight]=useState(350);
  const onBounds=useCallback(value=>setContentHeight(previous=>Math.abs(previous-value)>.25?value:previous),[]);
  const mobile=width<768;const d=`M-20 82C${width*.22} 68 ${width*.3} 95 ${width*.5} 82S${width*.8} 69 ${width+20} 82`;
  useEffect(()=>{const ro=new ResizeObserver(entries=>setWidth(entries[0].contentRect.width));ro.observe(ref.current);let last=window.scrollY;const scroll=()=>{setCompact(window.scrollY>80&&window.scrollY>last);last=window.scrollY;};window.addEventListener('scroll',scroll,{passive:true});return()=>{ro.disconnect();window.removeEventListener('scroll',scroll);}},[]);
  useEffect(()=>{const path=pathRef.current;if(!path)return;const boardWidth=mobile?78:Math.min(116,width*.077);const positions=mobile?[.13,.87]:[.065,.165,.265,.675,.775,.875,.965];const boards=positions.map(t=>[sample(path,width*t-boardWidth/2+10),sample(path,width*t+boardWidth/2-10)]);verifyAttachments(boards.flat());setGeometry({boards,boardWidth,leaves:[.055,.135,.215,.305,.365,.605,.715,.795,.865,.94].map(t=>sample(path,width*t))});},[width,d,compact,mobile]);
  const all=[...NAV.left,...NAV.right,NAV.cta];
  return <header ref={ref} className="bn-header" style={{height:contentHeight}}><nav aria-label="Main"><svg viewBox={`0 0 ${width} 350`} width="100%" height="350" className="bn-scene">{geometry&&<>{(mobile?[{path:'#',label:'Menu'},NAV.cta]:all).map((item,i)=>item.path==='#'||!geometry.boards[i]?null:<WoodBoard key={item.label} item={item} anchors={geometry.boards[i]} width={geometry.boardWidth} drop={compact?28:34+i%3*5} onNavigate={()=>setOpen(false)}/>)}</>}<Tail layer="back" x={width/2} y={82} scale={compact?.75:mobile?.82:1}/><Branch d={d} pathRef={pathRef}/>{geometry?.boards.flat().map((from,i)=><Rope key={`wrap-${i}`} from={from} wrapOnly/>)}{geometry?.leaves.map((anchor,i)=><LeafTwig key={i} anchor={anchor} index={i} width={width}/>)}<Monkey x={width/2} y={82} scale={compact?.75:mobile?.82:1} onBounds={onBounds}/>{mobile&&<foreignObject x="12" y="120" width="85" height="55"><button className="bn-board" aria-expanded={open} onClick={()=>setOpen(!open)}>Menu</button></foreignObject>}</svg>{mobile&&open&&<div className="bn-mobile-menu">{all.slice(0,6).map(item=><NavLink key={item.path} to={item.path} className="bn-board" onClick={()=>setOpen(false)}>{item.label}</NavLink>)}</div>}</nav></header>;
}
