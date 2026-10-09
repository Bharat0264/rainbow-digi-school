import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { LeafTwig, MonkeyArtwork } from './BranchNavArt';
import { NAV } from '../../data/nav';
import { NavMetricsContext, useNavMetrics } from '../nav/useNavMetrics';
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
const thickness = t => 24 - 8 * t;
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
export function checkNavOverlap() {
  if (!import.meta.env.DEV) return;
  const overlap = (a, b) => a && b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  const menu = document.querySelector('.bn-menu-trigger');
  const apply = [...document.querySelectorAll('.bn-board')].find(node => node.textContent === 'Apply');
  const logo = document.querySelector('.bn-logo-board');
  if (innerWidth < 768 && apply && !menu) console.warn('BranchNav: Menu button is missing on mobile');
  if (menu && logo && overlap(menu.getBoundingClientRect(), logo.getBoundingClientRect())) console.warn('BranchNav: Menu overlaps logo group');
  if (apply && logo && overlap(apply.getBoundingClientRect(), logo.getBoundingClientRect())) console.warn('BranchNav: Apply overlaps logo group');
}
export function Rope({ from, to, wrapOnly = false }) { return <g aria-hidden="true">{!wrapOnly&&<path d={`M${from.x} ${from.y}L${to.x} ${to.y}`} stroke="#81502d" strokeWidth="2.4"/>}<path d={`M${from.x-2} ${from.y-13}q-4 7 2 13`} fill="none" stroke="#bd8c57" strokeWidth="3"/><circle cx={from.x} cy={from.y} r="2.3" fill="#81502d"/></g>; }
export function Branch({ d, pathRef }) { return <g aria-hidden="true"><path d={d} stroke="#4a2a12" strokeWidth="24" fill="none"/><path ref={pathRef} d={d} stroke="#8b5e3c" strokeWidth="20" fill="none"/><path d={d} stroke="#c9a06a" strokeWidth="3.5" fill="none" transform="translate(0 -8)"/></g>; }
function rotate(point, pivot, angle) { const a=angle*Math.PI/180, x=point.x-pivot.x,y=point.y-pivot.y; return {x:pivot.x+x*Math.cos(a)-y*Math.sin(a),y:pivot.y+x*Math.sin(a)+y*Math.cos(a)}; }
export function WoodBoard({ item, anchors, width, drop, onNavigate }) {
  const pivot={x:(anchors[0].x+anchors[1].x)/2,y:(anchors[0].y+anchors[1].y)/2};
  const { angle,push }=usePendulum({pivot,limit:1.5}); const y=Math.max(anchors[0].y,anchors[1].y)+drop;
  const corners=[{x:pivot.x-width/2+10,y},{x:pivot.x+width/2-10,y}];
  return <g><Rope from={anchors[0]} to={rotate(corners[0],pivot,angle)}/><Rope from={anchors[1]} to={rotate(corners[1],pivot,angle)}/><g transform={`rotate(${angle} ${pivot.x} ${pivot.y})`}><foreignObject x={pivot.x-width/2} y={y} width={width} height="40"><NavLink to={item.path} onClick={onNavigate} onPointerEnter={()=>push(.12)} onFocus={()=>push(.1)} className={({isActive})=>`bn-board ${isActive?'bn-active':''}`}><span>{item.label}</span></NavLink></foreignObject></g></g>;
}
function MenuBoard({ anchors, width, drop, open, onToggle, buttonRef }) {
  const pivot={x:(anchors[0].x+anchors[1].x)/2,y:(anchors[0].y+anchors[1].y)/2};
  const { angle,push }=usePendulum({pivot,limit:1.5}); const y=Math.max(anchors[0].y,anchors[1].y)+drop;
  const corners=[{x:pivot.x-width/2+10,y},{x:pivot.x+width/2-10,y}];
  return <g><Rope from={anchors[0]} to={rotate(corners[0],pivot,angle)}/><Rope from={anchors[1]} to={rotate(corners[1],pivot,angle)}/><g transform={`rotate(${angle} ${pivot.x} ${pivot.y})`}><foreignObject x={pivot.x-width/2} y={y} width={width} height="40"><button ref={buttonRef} className="bn-board bn-menu-trigger" aria-expanded={open} aria-controls="mobile-link-chain" onPointerEnter={()=>push(.12)} onClick={()=>{push(.16);onToggle();}}><i aria-hidden="true" className={open?'bn-hamburger bn-open':'bn-hamburger'}><b/><b/><b/></i><span>Menu</span></button></foreignObject></g></g>;
}
export function Monkey({ x, y, scale=1, onBounds, logoSize }) {
  const { angle, push } = usePendulum({pivot:{x,y},limit:4});
  return <MonkeyArtwork x={x} y={y} scale={scale} angle={angle} push={push} onBounds={onBounds} logoSize={logoSize}/>;
}
function MobileNestedChain({items, index=0, firstLinkRef, closeMenu}){if(index>=items.length)return null;const item=items[index];return <div className="bn-chain-link" data-chain-level={index+1} style={{"--chain-index":index}}><div className="bn-chain-ropes" aria-hidden="true"><i/><i/></div><NavLink ref={index===0?firstLinkRef:null} to={item.path} className={({isActive})=>`bn-board bn-chain-board ${isActive?"bn-active":""}`} onClick={()=>{closeMenu();}}>{item.label}</NavLink><MobileNestedChain items={items} index={index+1} firstLinkRef={firstLinkRef} closeMenu={closeMenu} /></div>;} 
export default function BranchNav() {
  const metrics=useNavMetrics(); const { width, isMobile: mobile, boardW, boardH, ropeLen, logoBoardW, logoBoardH }=metrics;
  const ref=useRef(null),pathRef=useRef(null),menuButtonRef=useRef(null),firstLinkRef=useRef(null),chainRef=useRef(null);const[open,setOpen]=useState(false),[compact,setCompact]=useState(false),[geometry,setGeometry]=useState(null);
  const [contentHeight,setContentHeight]=useState(210);
  const onBounds=useCallback(value=>setContentHeight(previous=>Math.abs(previous-value)>.25?value:previous),[]);
  const branchY=mobile?54:66;const sceneHeight=mobile?200:260;const baseScale=mobile?.7:1.2;const visualScale=compact?baseScale*.85:baseScale;const d=`M-20 ${branchY}C${width*.22} ${branchY-10} ${width*.3} ${branchY+10} ${width*.5} ${branchY}S${width*.8} ${branchY-10} ${width+20} ${branchY}`;
  useEffect(()=>{let last=window.scrollY;const scroll=()=>{setCompact(window.scrollY>80&&window.scrollY>last);last=window.scrollY;};window.addEventListener('scroll',scroll,{passive:true});return()=>window.removeEventListener('scroll',scroll);},[]);
  useEffect(()=>{const timer=requestAnimationFrame(checkNavOverlap);window.addEventListener('resize',checkNavOverlap);return()=>{cancelAnimationFrame(timer);window.removeEventListener('resize',checkNavOverlap);};},[width,mobile]);
  useEffect(()=>{const path=pathRef.current;if(!path)return;const positions=mobile?[.147,.853]:[.075,.172,.269,.665,.762,.859,.952];const boards=positions.map(t=>[sample(path,width*t-boardW/2+8),sample(path,width*t+boardW/2-8)]);verifyAttachments(boards.flat());setGeometry({boards,boardW,leaves:[.055,.16,.275,.365,.63,.745,.855,.94].map(t=>sample(path,width*t))});},[width,d,mobile,boardW]);
  const all=[...NAV.left,...NAV.right,NAV.cta];
  const closeMenu=useCallback((focus=false)=>{setOpen(false);if(focus)requestAnimationFrame(()=>requestAnimationFrame(()=>menuButtonRef.current?.focus()));},[]);
  useEffect(()=>{if(!open)return;const key=e=>{if(e.key==='Escape')closeMenu(true);};window.addEventListener('keydown',key);requestAnimationFrame(()=>firstLinkRef.current?.focus());return()=>window.removeEventListener('keydown',key);},[open,closeMenu]);
  useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous;};},[open]);
  useEffect(()=>{if(!open||!mobile||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;let frame,last=performance.now(),kick=12;const theta=Array(7).fill(0),omega=Array(7).fill(0);const tick=time=>{const dt=Math.min((time-last)/1000,1/30);last=time;if(!document.hidden){for(let i=0;i<7;i++){const parent=i?omega[i-1]:0;const k=i?38:60,c=i?2.4:3.2;const alpha=-k*theta[i]-c*omega[i]+(i?3*(parent-omega[i]):Math.sin(time/720)*.6);if(i===0){omega[i]+=kick;kick=0;}omega[i]+=alpha*dt;theta[i]=Math.max(-3,Math.min(3,theta[i]+omega[i]*dt));}if(chainRef.current)chainRef.current.style.transform=`rotate(${theta[0]}deg)`;const nodes=chainRef.current?.querySelectorAll('[data-chain-level]')||[];nodes.forEach((node,i)=>{node.style.transform=`rotate(${theta[i+1]}deg)`;});}frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[open,mobile]);
  const desktopScale=visualScale;
  const logoSize = { width: logoBoardW, height: logoBoardH };
  return <NavMetricsContext.Provider value={metrics}><header ref={ref} className="bn-header" style={{height:mobile?Math.max(contentHeight,198):contentHeight,'--board-w':`${boardW}px`,'--board-h':`${boardH}px`,'--rope-len':`${ropeLen}px`,'--logo-board-w':`${logoBoardW}px`,'--logo-board-h':`${logoBoardH}px`}}><div className="bn-main-nav" aria-label="Main"><svg viewBox={`0 0 ${width} ${sceneHeight}`} width="100%" height={sceneHeight} className="bn-scene">{geometry&&<>{mobile?<><MenuBoard anchors={geometry.boards[0]} width={boardW} drop={compact?16:18} open={open} onToggle={()=>setOpen(!open)} buttonRef={menuButtonRef}/><WoodBoard item={NAV.cta} anchors={geometry.boards[1]} width={boardW} drop={compact?16:18} onNavigate={()=>closeMenu()}/></>:all.map((item,i)=><WoodBoard key={item.label} item={item} anchors={geometry.boards[i]} width={geometry.boardW} drop={compact?20:24+i%3*2} onNavigate={()=>closeMenu()}/>)}</>}<Branch d={d} pathRef={pathRef}/>{geometry?.boards.flat().map((from,i)=><Rope key={`wrap-${i}`} from={from} wrapOnly/>)}{geometry?.leaves.map((anchor,i)=><LeafTwig key={i} anchor={anchor} index={i} width={width}/>)}<Monkey x={width/2} y={branchY} scale={desktopScale} onBounds={onBounds} logoSize={logoSize}/></svg>{mobile&&open&&<><button className="bn-chain-dim" aria-label="Close menu" onClick={()=>closeMenu(true)}/><nav ref={chainRef} id="mobile-link-chain" className="bn-mobile-chain" aria-label="Mobile navigation"><MobileNestedChain items={all.slice(0,6)} firstLinkRef={firstLinkRef} closeMenu={closeMenu} /></nav></>}</div></header></NavMetricsContext.Provider>;
}
