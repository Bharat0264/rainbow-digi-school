import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ForestMascot, Treehouse, TwistedRope } from './ForestMascot';
import { SquirrelMascot } from './SquirrelMascot';
import { NAV } from '../../data/nav';
import './BranchNav.css';

const ITEMS=[...NAV.left,...NAV.right,NAV.cta].map(item=>({...item,id:item.label.toLowerCase()}));
function branchPoint(path,x){
  let lo=0,hi=path.getTotalLength();
  for(let i=0;i<20;i++){const mid=(lo+hi)/2;if(path.getPointAtLength(mid).x<x)lo=mid;else hi=mid;}
  return path.getPointAtLength((lo+hi)/2);
}
function Sign({point,width,item,active,onNavigate,children}){
  const y=point.y+48;
  return <g>
    {[-1,1].map(side=><TwistedRope key={side} x={point.x+side*(width/2-16)} top={point.y-5} bottom={y+3}/>)}
    <foreignObject x={point.x-width/2} y={y} width={width} height="64" overflow="visible">
      {children||<Link to={item.path} state={{navItem:item.id}} data-nav-id={item.id} aria-current={active?'page':undefined} className={`bn-board${active?' bn-active':''}`} onClick={onNavigate}><span>{item.label}</span></Link>}
    </foreignObject>
  </g>;
}
export default function BranchNav(){
  const container=useRef(null),pathRef=useRef(null),entranceRef=useRef(null),menuRef=useRef(null),firstLink=useRef(null);
  const [width,setWidth]=useState(()=>window.innerWidth),[points,setPoints]=useState([]),[menuState,setMenuState]=useState(null),[homeRequest,setHomeRequest]=useState(null);
  const location=useLocation(),mobile=width<768;
  const selected=ITEMS.find(i=>i.id===location.state?.navItem&&i.path===location.pathname)?.id||ITEMS.find(i=>i.path===location.pathname)?.id||'about';
  const open=mobile&&menuState===location.key;
  const branchY=mobile?148:Math.max(136,Math.min(210,width*.105));
  const mascotW=mobile?Math.min(156,width*.4):Math.max(188,Math.min(280,width*.14));
  const houseW=mobile?190:Math.max(240,Math.min(350,width*.19));
  const height=Math.ceil(branchY+mascotW*1341/720+24);
  const boardW=mobile?Math.min(108,width*.27):Math.min(160,width*.087);
  const branchImageW=mobile?900:width,branchImageH=mobile?180:Math.max(200,Math.min(400,width*.2)),b=branchImageH/200;
  // Sampled top surface of the branch artwork, in the same SVG coordinate space.
  const d=mobile?`M0 ${branchY+3} Q${width*.5} ${branchY-2} ${width} ${branchY+5}`:`M0 ${branchY-14*b} C${width*.12} ${branchY-14*b} ${width*.18} ${branchY+8*b} ${width*.27} ${branchY+7*b} S${width*.44} ${branchY-2*b} ${width*.51} ${branchY+2*b} S${width*.60} ${branchY+10*b} ${width*.69} ${branchY+4*b} S${width*.86} ${branchY+b} ${width} ${branchY-17*b}`;
  useLayoutEffect(()=>{
    const observer=new ResizeObserver(entries=>setWidth(entries[0].contentRect.width));observer.observe(container.current);
    return()=>observer.disconnect();
  },[]);
  useLayoutEffect(()=>{
    setPoints((mobile?[.15,.85]:[.077,.19,.302,.654,.75,.847,.945]).map(t=>branchPoint(pathRef.current,width*t)));
  },[d,width,mobile]);
  useEffect(()=>{
    if(!open)return;
    firstLink.current?.focus();
    const escape=e=>{if(e.key==='Escape'){setMenuState(null);menuRef.current?.focus();}};
    window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);
  },[open]);
  const visible=mobile?[{id:'menu'},ITEMS[6]]:ITEMS;
  const goInside=()=>setHomeRequest({key:location.key,nonce:performance.now()});
  const destination=homeRequest?.key===location.key?'treehouse':mobile?(selected==='apply'?'apply':'menu'):selected;
  const navigate=()=>{setMenuState(null);setHomeRequest(null);};
  return <header className="bn-header">
    <nav ref={container} className="bn-main-nav" aria-label="Main navigation" style={{height,'--branch-y':`${branchY}px`}}>
      <svg className="bn-scene" viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
        <image href="/images/navigation/branch.webp" x={(width-branchImageW)/2} y={branchY-branchImageH*.44} width={branchImageW} height={branchImageH} preserveAspectRatio="none"/>
        <path ref={pathRef} data-branch-path d={d} fill="none" stroke="transparent"/>
        {points.slice(0,visible.length).map((p,i)=><Sign key={visible[i].id} point={p} width={boardW} item={visible[i]} active={selected===visible[i].id} onNavigate={navigate}>
          {mobile&&i===0?<button ref={menuRef} data-nav-id="menu" className={`bn-board bn-menu-trigger${selected!=='apply'?' bn-active':''}`} aria-expanded={open} aria-controls="mobile-link-chain" onClick={()=>setMenuState(open?null:location.key)}><span>{open?'Close':'☰ Menu'}</span></button>:null}
        </Sign>)}
        {[-1,1].map(side=><TwistedRope key={side} x={width/2+side*mascotW*.32} top={branchY-4} bottom={branchY+mascotW*.06+15}/>)}
      </svg>
      <Treehouse width={houseW} branchY={branchY} entranceRef={entranceRef}/>
      <ForestMascot width={mascotW} top={branchY+8} onActivate={goInside}/>
      <SquirrelMascot containerRef={container} pathRef={pathRef} selected={destination} layoutKey={`${width}-${points.length}`} mobile={mobile}/>
      {mobile&&open&&<>
        <button className="bn-chain-dim" aria-label="Close menu" onClick={()=>{setMenuState(null);menuRef.current?.focus();}}/>
        <div id="mobile-link-chain" className="bn-mobile-chain" style={{top:branchY+114}}>
          {ITEMS.slice(0,6).map((item,i)=><Link ref={i===0?firstLink:null} key={item.id} to={item.path} state={{navItem:item.id}} aria-current={selected===item.id?'page':undefined} className={`bn-board${selected===item.id?' bn-active':''}`} onClick={navigate}><span>{item.label}</span></Link>)}
        </div>
      </>}
    </nav>
  </header>;
}
