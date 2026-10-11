import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import NavigationRopes from './NavigationRopes';
import MonkeyHandle from './MonkeyHandle';
import { NAV } from '../../data/nav';
import './BranchNav.css';

const ITEMS = [{ path: '/', label: 'Home', id: 'home' }, ...NAV.left, ...NAV.right]
  .map(item => ({ ...item, id: item.id || item.label.toLowerCase().replace(/\s+/g, '-') }));
// Traced bark surfaces in the new 2172 × 724 source. Leaves do not define the
// contact surface: each loop crosses the bark's full visible thickness.
const BRANCH = [[0,225,299],[.05,218,285],[.12,250,332],[.2,278,368],
  [.27,300,401],[.34,310,385],[.4,285,381],[.43,297,372],[.5,295,354],
  [.57,290,354],[.64,319,400],[.7,331,429],[.76,315,405],[.82,281,375],
  [.9,258,341],[.96,222,303],[1,222,290]];
const BRANCH_ART = '/images/navigation/branch-house-textured.png';
const HOUSE = { x: .474, y: .313, radius: .052, left: .416, top: .23, width: .166, height: .231 };
function branchY(x, art, edge = 1) {
  const ratio = Math.max(0, Math.min(1, (x-art.x)/art.width));
  const index = BRANCH.findIndex(point => point[0] >= ratio);
  const a = BRANCH[Math.max(0,index-1)], b = BRANCH[Math.max(1,index)];
  return art.y + (a[edge]+(b[edge]-a[edge])*(ratio-a[0])/(b[0]-a[0]))/724*art.height;
}
function ordinaryClick(event) { return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey; }

export default function BranchNav() {
  const location = useLocation();
  const navRef = useRef(null), artRef = useRef(null), canvasRef = useRef(null), logoRef = useRef(null);
  const boardsRef = useRef(new Map()), startRef = useRef(() => {});
  const [open,setOpen] = useState(false);
  const menuRef = useRef(null), drawerRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    drawerRef.current?.querySelector('a')?.focus();
    const dismiss = event => {
      if (event.key === 'Escape') { setOpen(false); menuRef.current?.focus(); }
    };
    const outside = event => {
      if (!drawerRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('keydown', dismiss);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', dismiss);
      document.removeEventListener('pointerdown', outside);
    };
  }, [open]);
  const [geometry,setGeometry] = useState({width:1,height:1,ropes:[],art:{x:0,y:0,width:1,height:1}});
  const [entering,setEntering] = useState(false);
  const maskId = useId().replaceAll(':','');
  const selected = ITEMS.find(item => item.id === location.state?.navItem && item.path === location.pathname)?.id
    || ITEMS.find(item => item.path === location.pathname)?.id;

  useEffect(() => {
    const nav = navRef.current, canvas = canvasRef.current, context = canvas.getContext('2d');
    const sprite = new Image(); sprite.src = '/images/navigation/squirrel-gait-v2.webp';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, disposed = false, lastTime = 0;
    let layout, x, y, target = 'rest', direction = 1, speed = 0, distance = 0;
    let state = 'idle', phaseStart = 0, entryStart = null, rememberedElement = null;
    const setState = next => {
      if(state === next) return;
      state = next; canvas.dataset.state = next;
      setEntering(next === 'enteringHouse' || next === 'inside');
    };
    canvas.dataset.state = state;
    const relative = element => { const a=element.getBoundingClientRect(), b=nav.getBoundingClientRect(); return {x:a.x-b.x,y:a.y-b.y,width:a.width,height:a.height}; };
    const targetX = () => {
      if(target === 'house') return layout.art.x + layout.art.width * HOUSE.x;
      if(target === 'rest') return layout.art.x + layout.art.width * .385;
      const element = boardsRef.current.get(target);
      const rect = element?.getClientRects().length ? relative(element) : rememberedElement;
      return Math.max(layout.size/2,Math.min(layout.width-layout.size/2,rect ? rect.x+rect.width/2 : x));
    };
    const draw = (frame=0,scale=1) => {
      if(!layout || x === undefined) return;
      context.clearRect(0,0,128,128);
      if(state !== 'inside' && sprite.complete && sprite.naturalWidth) {
        context.save(); context.translate(64,120); context.scale(direction*scale,scale);
        context.drawImage(sprite,frame*128,0,128,128,-64,-120,128,128); context.restore();
      }
      canvas.style.transform = `translate3d(${x-layout.size/2}px,${y-layout.size*120/128}px,0)`;
      canvas.dataset.frame = String(frame); canvas.dataset.direction = String(direction);
      canvas.dataset.target = target;
    };
    const measure = () => {
      const art = relative(artRef.current), box = nav.getBoundingClientRect();
      layout = {art,width:box.width,height:box.height,size:parseFloat(getComputedStyle(canvas).width)};
      const ropes = [];
      [...boardsRef.current.values(),logoRef.current].forEach(element => {
        if(!element?.getClientRects().length || element.closest('.featured-drawer')) return;
        const r=relative(element);
        const isLogo = element === logoRef.current;
        // The logo's corner fixings sit outside the birdhouse front.
        (isLogo ? [.035,.965] : [.22,.78]).forEach(anchor => {
          const rx=r.x+r.width*anchor;
          ropes.push({x:rx,top:branchY(rx,art),under:branchY(rx,art,2),bottom:r.y+7,
            board:isLogo ? 'logo' : element.dataset.navId});
        });
      });
      setGeometry({...layout,ropes});
      // Re-measure the current destination without resetting an interrupted journey.
      if(x === undefined || state === 'idle' || state === 'inside') {
        x=targetX(); y=branchY(x,art); draw();
      } else { x=Math.max(layout.size/2,Math.min(layout.width-layout.size/2,x)); }
    };
    const tick = now => {
      const dt=Math.min(.04,(now-lastTime)/1000 || .016); lastTime=now;
      const goal=targetX(), delta=goal-x;
      if(state === 'walking' || state === 'running') {
        const desired=Math.sign(delta)*Math.min(520,Math.sqrt(2*1400*Math.abs(delta)));
        speed += Math.max(-1800*dt,Math.min(1800*dt,desired-speed));
        const step=speed*dt;
        if(Math.abs(delta)<1.5 || (Math.sign(step)===Math.sign(delta) && Math.abs(step)>=Math.abs(delta))) {
          x=goal; speed=0; phaseStart=now; entryStart={x,y:branchY(x,layout.art)};
          setState(target==='house' ? 'enteringHouse' : 'stopping');
        } else { x+=step; distance+=Math.abs(step); if(Math.abs(speed)>12) direction=Math.sign(speed); setState(Math.abs(speed)>210?'running':'walking'); }
        y=branchY(x,layout.art);
        // Advance poses by ground distance, so faster travel has a faster gait.
        const cycle=state==='running'?[1,5,2,6,3,5,4,6]:[1,2,3,4];
        draw(cycle[Math.floor(distance/(layout.size*.28))%cycle.length]);
      } else if(state === 'stopping') {
        draw(7);
        if(now-phaseStart>=150) {setState('idle');draw(0);return;}
      } else if(state === 'enteringHouse') {
        const t=Math.min(1,(now-phaseStart)/520), eased=t*t*(3-2*t);
        const doorY=layout.art.y+layout.art.height*HOUSE.y;
        y=entryStart.y+(doorY-entryStart.y)*eased;
        draw([1,2,3,4][Math.floor(t*12)%4],1-.7*eased);
        if(t===1) {setState('inside');draw();return;}
      } else return;
      raf=requestAnimationFrame(tick);
    };
    startRef.current = (id, element) => {
      if(id === 'house' && (target==='house' && ['walking','running','enteringHouse','inside'].includes(state))) return;
      cancelAnimationFrame(raf);
      if(element) rememberedElement=relative(element);
      if(state==='inside') {x=layout.art.x+layout.art.width*HOUSE.x;y=branchY(x,layout.art);}
      target=id;
      if(reduced.matches) { x=targetX();y=branchY(x,layout.art);setState(id==='house'?'inside':'idle');draw();return; }
      setState('walking'); lastTime=performance.now(); raf=requestAnimationFrame(tick);
    };
    measure(); sprite.onload=()=>{if(!disposed) draw();};
    const observer=new ResizeObserver(measure); observer.observe(nav); observer.observe(artRef.current);
    const motionChanged=()=>startRef.current(target);
    reduced.addEventListener('change',motionChanged);
    return ()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();reduced.removeEventListener('change',motionChanged);startRef.current=()=>{};};
  },[]);

  const visit = useCallback((event,item,house=false) => {
    if(!ordinaryClick(event)) return;
    startRef.current(house?'house':item.id,event.currentTarget);
    setOpen(false);
    if(item.path==='/' && location.pathname==='/') {
      event.preventDefault();window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    }
  },[location.pathname]);
  const sign = (item,drawer=false) => <Link key={item.id} ref={element=>{if(!drawer) {if(element) boardsRef.current.set(item.id,element);else boardsRef.current.delete(item.id);}}}
    to={item.path} state={{navItem:item.id}} data-nav-id={item.id} aria-current={selected===item.id?'page':undefined}
    className={`featured-sign${selected===item.id?' featured-active':''}`} onClick={event=>visit(event,item)}><span>{item.label}</span></Link>;
  const art=geometry.art;
  return <header className="bn-header featured-nav"><nav ref={navRef} className="featured-inner" aria-label="Main navigation">
    <div className="featured-canopy"><img ref={artRef} className="featured-branch" fetchPriority="high" src={BRANCH_ART} width="2172" height="724" alt="" aria-hidden="true" decoding="async" /></div>
    <NavigationRopes ropes={geometry.ropes} />
    <canvas ref={canvasRef} className="featured-squirrel" width="128" height="128" aria-hidden="true" />
    {entering && <svg className="featured-house-front" width="100%" height="100%" aria-hidden="true">
      <defs><clipPath id={maskId}><path clipRule="evenodd" fillRule="evenodd" d={`M${art.x+art.width*HOUSE.left},${art.y+art.height*HOUSE.top} h${art.width*HOUSE.width} v${art.height*HOUSE.height} h${-art.width*HOUSE.width} Z M${art.x+art.width*HOUSE.x+art.height*HOUSE.radius},${art.y+art.height*HOUSE.y} a${art.height*HOUSE.radius},${art.height*HOUSE.radius} 0 1 0 ${-art.height*HOUSE.radius*2},0 a${art.height*HOUSE.radius},${art.height*HOUSE.radius} 0 1 0 ${art.height*HOUSE.radius*2},0 Z`}/></clipPath></defs>
      <image href={BRANCH_ART} x={art.x} y={art.y} width={art.width} height={art.height} clipPath={`url(#${maskId})`}/>
    </svg>}
    <div className="featured-signs featured-left">{ITEMS.slice(0,3).map(item=>sign(item))}</div>
    <div className="featured-home"><Link ref={logoRef} to="/" aria-label="Rainbow Digi School — Excellence begins early — home" className={`featured-logo${location.pathname==='/'?' featured-active':''}`} onClick={event=>visit(event,ITEMS[0],true)}><Logo /></Link>
      <MonkeyHandle />
      <button type="button" className="featured-monkey" aria-label="Send the squirrel home" onClick={()=>startRef.current('house')}><img src="/images/navigation/monkey-featured.webp" width="250" height="465" alt="" decoding="async" /></button>
    </div>
    <div className="featured-signs featured-right">{ITEMS.slice(3).map(item=>sign(item))}</div>
    <button ref={menuRef} type="button" className="featured-menu" aria-controls="school-navigation-menu" aria-expanded={open} aria-label={open?'Close navigation menu':'Open navigation menu'} onClick={()=>setOpen(value=>!value)}>☰</button>
    {open && <div ref={drawerRef} id="school-navigation-menu" className="featured-drawer">{ITEMS.map(item=>sign(item,true))}</div>}
  </nav></header>;
}
