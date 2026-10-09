import { memo, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import { NAV } from '../../data/nav';
import './BranchNav.css';

const ITEMS = [...NAV.left, ...NAV.right, NAV.cta].map(item => ({ ...item, id: item.label.toLowerCase() }));

const Decoration = memo(function Decoration() {
  return <>
    <img className="compact-branch" src="/images/navigation/branch-compact.webp" width="960" height="160" alt="" aria-hidden="true" decoding="async" />
    <img className="compact-treehouse" src="/images/navigation/treehouse-compact.webp" width="116" height="116" alt="" aria-hidden="true" decoding="async" />
  </>;
});

function HomeLink({ active, onHome }) {
  return <Link to="/" aria-label="Go to Home page" className={`compact-home${active ? ' compact-active' : ''}`} onClick={onHome}>
    <span className="compact-monkey-crop" aria-hidden="true"><img src="/images/navigation/monkey-compact.webp" width="150" height="279" alt="" decoding="async" /></span>
    <span className="compact-logo-board"><Logo /></span>
  </Link>;
}

function NavBoard({ item, active, onNavigate }) {
  return <Link to={item.path} state={{ navItem: item.id }} data-nav-id={item.id} aria-current={active ? 'page' : undefined} className={`compact-board${active ? ' compact-active' : ''}`} onClick={onNavigate}><span>{item.label}</span></Link>;
}

export default function BranchNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const lastScroll = useRef(0);
  const selected = ITEMS.find(item => item.id === location.state?.navItem && item.path === location.pathname)?.id || ITEMS.find(item => item.path === location.pathname)?.id;
  const activeHome = location.pathname === '/';
  useEffect(() => {
    const update = () => { const y = window.scrollY; setCompact(y > 84 && y > lastScroll.current); lastScroll.current = y; };
    window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => setOpen(false), [location.key]);
  const goHome = event => { if (location.pathname === '/') { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } setOpen(false); };
  const close = () => setOpen(false);
  return <header className={`bn-header compact-nav${compact ? ' compact-nav-scrolled' : ''}`}>
    <nav className="compact-nav-inner" aria-label="Main navigation">
      <Decoration />
      <div className="compact-desktop-links compact-left-links">{ITEMS.slice(0, 3).map(item => <NavBoard key={item.id} item={item} active={selected === item.id} onNavigate={close} />)}</div>
      <HomeLink active={activeHome} onHome={goHome} />
      <div className="compact-desktop-links compact-right-links">{ITEMS.slice(3).map(item => <NavBoard key={item.id} item={item} active={selected === item.id} onNavigate={close} />)}</div>
      <button className="compact-menu-button" type="button" aria-label="Open navigation menu" aria-expanded={open} onClick={() => setOpen(value => !value)}><span>☰</span></button>
      {open && <div className="compact-drawer" aria-label="Navigation menu">{ITEMS.map(item => <NavBoard key={item.id} item={item} active={selected === item.id} onNavigate={close} />)}</div>}
    </nav>
  </header>;
}
