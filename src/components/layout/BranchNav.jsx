import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import { NAV } from '../../data/nav';
import './BranchNav.css';

const ITEMS = [{ path: '/', label: 'Home', id: 'home' }, ...NAV.left.slice(1), ...NAV.right, NAV.cta].map(item => ({ ...item, id: item.id || item.label.toLowerCase() }));
const SQUIRREL_WIDTH = 64;

const ForestScenery = memo(function ForestScenery({ squirrelRef, squirrelState }) {
  return <><img className="featured-branch" src="/images/navigation/branch-house.webp" width="1536" height="512" alt="" aria-hidden="true" decoding="async" /><span ref={squirrelRef} className={`featured-squirrel featured-squirrel-${squirrelState}`} aria-hidden="true"><img src="/images/navigation/squirrel-featured.webp" width="320" height="160" alt="" decoding="async" /></span></>;
});

function Sign({ item, active, onNavigate }) {
  return <Link to={item.path} state={{ navItem: item.id }} data-nav-id={item.id} aria-current={active ? 'page' : undefined} className={`featured-sign${active ? ' featured-active' : ''}`} onClick={event => onNavigate(event, item)}><i aria-hidden="true" /><i aria-hidden="true" /><span>{item.label}</span></Link>;
}

function CenterHome({ active, onHome, onMonkeyHome }) {
  return <div className="featured-home"><Link to="/" aria-label="Go to Home page" className={`featured-logo${active ? ' featured-active' : ''}`} onClick={onHome}><Logo /></Link><button type="button" className="featured-monkey" aria-label="Send the squirrel home" onClick={onMonkeyHome}><img src="/images/navigation/monkey-featured.webp" width="250" height="465" alt="" decoding="async" /></button></div>;
}

export default function BranchNav() {
  const location = useLocation();
  const innerRef = useRef(null);
  const squirrelRef = useRef(null);
  const positionRef = useRef(null);
  const frameRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [squirrelState, setSquirrelState] = useState('idle');
  const selected = ITEMS.find(item => item.id === location.state?.navItem && item.path === location.pathname)?.id || ITEMS.find(item => item.path === location.pathname)?.id;

  const getTarget = useCallback(id => {
    const inner = innerRef.current;
    if (!inner) return 0;
    const innerBox = inner.getBoundingClientRect();
    // The house is centered above the logo. Its doorstep is kept just to the left
    // of the logo so the resting squirrel stays visible rather than being covered.
    if (id === 'house') return Math.max(0, innerBox.width / 2 - 200);
    const target = [...inner.querySelectorAll(`[data-nav-id="${id}"]`)].find(element => element.getClientRects().length);
    if (!target) return positionRef.current ?? 0;
    const box = target.getBoundingClientRect();
    return Math.max(0, Math.min(innerBox.width - SQUIRREL_WIDTH, box.left - innerBox.left + box.width / 2 - SQUIRREL_WIDTH / 2));
  }, []);

  const moveSquirrel = useCallback((id, returningHome = false) => {
    const node = squirrelRef.current;
    if (!node) return;
    window.cancelAnimationFrame(frameRef.current);
    const start = positionRef.current ?? getTarget('house');
    const target = getTarget(id);
    const distance = Math.abs(target - start);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || distance < 2) {
      positionRef.current = target;
      node.style.transform = `translate3d(${target}px, 0, 0)`;
      setSquirrelState('idle');
      return;
    }
    const duration = Math.min(900, Math.max(400, distance * 2.2));
    const startedAt = performance.now();
    setSquirrelState('running');
    const tick = now => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = progress < .5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const next = start + (target - start) * eased;
      positionRef.current = next;
      node.style.transform = `translate3d(${next}px, ${Math.sin(progress * Math.PI * 8) * -2}px, 0)`;
      if (progress < 1) frameRef.current = window.requestAnimationFrame(tick);
      else { node.style.transform = `translate3d(${target}px, 0, 0)`; setSquirrelState(returningHome ? 'home' : 'idle'); }
    };
    frameRef.current = window.requestAnimationFrame(tick);
  }, [getTarget]);

  useEffect(() => {
    const placeAtHouse = () => {
      const target = getTarget('house');
      positionRef.current = target;
      if (squirrelRef.current) squirrelRef.current.style.transform = `translate3d(${target}px, 0, 0)`;
    };
    placeAtHouse();
    window.addEventListener('resize', placeAtHouse);
    return () => { window.removeEventListener('resize', placeAtHouse); window.cancelAnimationFrame(frameRef.current); };
  }, [getTarget]);
  useEffect(() => { setOpen(false); }, [location.key]);

  const visit = (event, item) => {
    moveSquirrel(item.id);
    setOpen(false);
    if (item.id === 'home' && location.pathname === '/') { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };
  return <header className="bn-header featured-nav"><nav ref={innerRef} className="featured-inner" aria-label="Main navigation"><ForestScenery squirrelRef={squirrelRef} squirrelState={squirrelState} /><div className="featured-signs featured-left">{ITEMS.slice(0, 3).map(item => <Sign key={item.id} item={item} active={item.id === selected} onNavigate={visit} />)}</div><CenterHome active={location.pathname === '/'} onHome={event => visit(event, ITEMS[0])} onMonkeyHome={() => moveSquirrel('house', true)} /><div className="featured-signs featured-right">{ITEMS.slice(3).map(item => <Sign key={item.id} item={item} active={item.id === selected} onNavigate={visit} />)}</div><button type="button" className="featured-menu" aria-expanded={open} aria-label="Open navigation menu" onClick={() => setOpen(value => !value)}>☰</button>{open && <div className="featured-drawer">{ITEMS.map(item => <Sign key={item.id} item={item} active={item.id === selected} onNavigate={visit} />)}</div>}</nav></header>;
}
