import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LeafTwig, MonkeyArtwork } from './BranchNavArt';
import { SquirrelMascot } from './SquirrelMascot';
import { NAV } from '../../data/nav';
import { NavMetricsContext, useNavMetrics } from '../nav/useNavMetrics';
import './BranchNav.css';

const ITEMS = [...NAV.left, ...NAV.right, NAV.cta].map(item => ({...item, id:item.label.toLowerCase()}));
const STILL = () => {};
function branchPoint(path, x) {
  let lo=0, hi=path.getTotalLength();
  for(let i=0;i<20;i++){const mid=(lo+hi)/2;if(path.getPointAtLength(mid).x<x)lo=mid;else hi=mid;}
  return path.getPointAtLength((lo+hi)/2);
}
function Sign({x,y,width,item,active,onNavigate,children}) {
  return <g>
    {[-1,1].map(side=><g key={side} strokeLinecap="round"><path d={`M${x+side*(width/2-11)} ${y-5}v37`} stroke="#89643b" strokeWidth="2.4"/><path d={`M${x+side*(width/2-11)-2} ${y-10}q-3 8 2 15`} stroke="#c4a275" strokeWidth="2" fill="none"/></g>)}
    <foreignObject x={x-width/2} y={y+28} width={width} height="46" overflow="visible">
      {children || <Link to={item.path} state={{navItem:item.id}} data-nav-id={item.id} aria-current={active?'page':undefined} className={`bn-board${active?' bn-active':''}`} onClick={onNavigate}><span>{item.label}</span></Link>}
    </foreignObject>
  </g>;
}
export default function BranchNav() {
  const metrics=useNavMetrics(), {width,isMobile:mobile,logoBoardW,logoBoardH}=metrics;
  const location=useLocation();
  const selected=ITEMS.find(item=>item.id===location.state?.navItem && item.path===location.pathname)?.id || ITEMS.find(item=>item.path===location.pathname)?.id || 'about';
  const container=useRef(null), pathRef=useRef(null), menuRef=useRef(null), firstLink=useRef(null);
  const [menuState,setMenuState]=useState(null),[points,setPoints]=useState([]);
  const open=mobile&&menuState===location.key;
  const setOpen=value=>setMenuState(value?location.key:null);
  const branchY=mobile?104:142, height=mobile?285:370;
  const boardW=mobile?Math.min(108,width*.27):Math.min(112,width*.087);
  const d=`M-30 ${branchY-4} C${width*.18} ${branchY+15} ${width*.29} ${branchY+9} ${width*.42} ${branchY-7} S${width*.73} ${branchY+11} ${width+30} ${branchY-1}`;
  useLayoutEffect(()=>{
    const fractions=mobile?[.16,.84]:[.08,.185,.29,.665,.765,.86,.955];
    setPoints(fractions.map(t=>branchPoint(pathRef.current,width*t)));
  },[d,width,mobile]);
  useEffect(()=>{
    if(!open)return;
    firstLink.current?.focus();
    const escape=e=>{if(e.key==='Escape'){setMenuState(null);menuRef.current?.focus();}};
    window.addEventListener('keydown',escape);
    return()=>window.removeEventListener('keydown',escape);
  },[open]);
  const visible=mobile?[{id:'menu'},ITEMS[6]]:ITEMS;
  return <NavMetricsContext.Provider value={metrics}>
    <header className="bn-header" style={{'--logo-board-w':`${logoBoardW}px`,'--logo-board-h':`${logoBoardH}px`}}>
      <nav ref={container} className="bn-main-nav" aria-label="Main navigation" style={{height}}>
        <svg className="bn-scene" viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
          <defs><linearGradient id="branch-wood" x2="0" y2="1"><stop stopColor="#d3a46b"/><stop offset=".35" stopColor="#a87949"/><stop offset="1" stopColor="#79512f"/></linearGradient></defs>
          <g aria-hidden="true">
            <path d={d} fill="none" stroke="#6f482b" strokeWidth="25"/>
            <path ref={pathRef} data-branch-path d={d} fill="none" stroke="url(#branch-wood)" strokeWidth="21"/>
            <path d={d} transform="translate(0 -7)" fill="none" stroke="#e0b782" strokeWidth="2" opacity=".75"/>
            <path d={d} transform="translate(0 5)" fill="none" stroke="#714629" strokeWidth="2" opacity=".4"/>
            {points.map((p,i)=><g key={i}><path d={`M${p.x-24} ${p.y}q15-7 35 1q-18 7-35-1`} fill="none" stroke="#734824" opacity=".35"/><LeafTwig anchor={{center:{x:p.x+boardW*.43,y:p.y-6}}} index={i} width={width}/></g>)}
          </g>
          {points.slice(0,visible.length).map((p,i)=><Sign key={visible[i].id} x={p.x} y={p.y} width={boardW} item={visible[i]} active={selected===visible[i].id} onNavigate={()=>setOpen(false)}>
            {mobile&&i===0?<button ref={menuRef} data-nav-id="menu" className={`bn-board bn-menu-trigger${selected!=='apply'?' bn-active':''}`} aria-expanded={open} aria-controls="mobile-link-chain" onClick={()=>setOpen(!open)}><span>{open?'Close':'☰ Menu'}</span></button>:null}
          </Sign>)}
          <MonkeyArtwork x={width/2} y={branchY-5} scale={mobile?.55:.8} angle={0} push={STILL} logoSize={{width:logoBoardW,height:logoBoardH}}/>
        </svg>
        <SquirrelMascot containerRef={container} pathRef={pathRef} selected={mobile?(selected==='apply'?'apply':'menu'):selected} layoutKey={`${width}-${points.length}`} mobile={mobile}/>
        {mobile&&open&&<>
          <button className="bn-chain-dim" aria-label="Close menu" onClick={()=>setOpen(false)}/>
          <div id="mobile-link-chain" className="bn-mobile-chain">
            {ITEMS.slice(0,6).map((item,i)=><Link ref={i===0?firstLink:null} key={item.id} to={item.path} state={{navItem:item.id}} aria-current={selected===item.id?'page':undefined} className={`bn-board${selected===item.id?' bn-active':''}`} onClick={()=>setOpen(false)}><span>{item.label}</span></Link>)}
          </div>
        </>}
      </nav>
    </header>
  </NavMetricsContext.Provider>;
}
