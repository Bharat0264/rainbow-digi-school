import { memo, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import { NAV } from '../../data/nav';
import './BranchNav.css';

const ITEMS = [{ path: '/', label: 'Home', id: 'home' }, ...NAV.left.slice(1), ...NAV.right, NAV.cta].map(item => ({ ...item, id: item.id || item.label.toLowerCase() }));
const ForestScenery = memo(function ForestScenery({ squirrelHome }) { return <><img className="featured-branch" src="/images/navigation/branch-house.webp" width="1536" height="512" alt="" aria-hidden="true" decoding="async" /><span className={`featured-squirrel${squirrelHome ? ' featured-squirrel-home' : ''}`} aria-hidden="true"><img src="/images/navigation/squirrel-featured.webp" width="320" height="160" alt="" decoding="async" /></span></>; });
function Sign({ item, active, onNavigate }) { return <Link to={item.path} state={{ navItem: item.id }} data-nav-id={item.id} aria-current={active ? 'page' : undefined} className={`featured-sign${active ? ' featured-active' : ''}`} onClick={onNavigate}><i aria-hidden="true" /><i aria-hidden="true" /><span>{item.label}</span></Link>; }
function CenterHome({ active, onHome }) { return <Link to="/" aria-label="Go to Home page" className={`featured-home${active ? ' featured-active' : ''}`} onClick={onHome}><span className="featured-monkey"><img src="/images/navigation/monkey-featured.webp" width="250" height="465" alt="" decoding="async" /></span><span className="featured-logo"><Logo /></span></Link>; }
export default function BranchNav() {
  const location = useLocation(); const [open, setOpen] = useState(false); const [squirrelHome, setSquirrelHome] = useState(false);
  const selected = ITEMS.find(item => item.id === location.state?.navItem && item.path === location.pathname)?.id || ITEMS.find(item => item.path === location.pathname)?.id;
  const homeActive = location.pathname === '/';
  useEffect(() => { setOpen(false); }, [location.key]);
  useEffect(() => {
    if (!squirrelHome) return undefined;
    const reset = window.setTimeout(() => setSquirrelHome(false), 1300);
    return () => window.clearTimeout(reset);
  }, [squirrelHome]);
  const visit = () => setOpen(false);
  const home = event => { setOpen(false); setSquirrelHome(true); if (location.pathname === '/') { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  return <header className="bn-header featured-nav"><nav className="featured-inner" aria-label="Main navigation"><ForestScenery squirrelHome={squirrelHome} /><div className="featured-signs featured-left">{ITEMS.slice(0, 3).map(item => <Sign key={item.id} item={item} active={item.id === selected} onNavigate={visit} />)}</div><CenterHome active={homeActive} onHome={home} /><div className="featured-signs featured-right">{ITEMS.slice(3).map(item => <Sign key={item.id} item={item} active={item.id === selected} onNavigate={visit} />)}</div><button type="button" className="featured-menu" aria-expanded={open} aria-label="Open navigation menu" onClick={() => setOpen(value => !value)}>☰</button>{open && <div className="featured-drawer">{ITEMS.map(item => <Sign key={item.id} item={item} active={item.id === selected} onNavigate={visit} />)}</div>}</nav></header>;
}
