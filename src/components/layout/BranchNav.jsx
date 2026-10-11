import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import NavigationRopes from './NavigationRopes';
import { createSquirrelAnimation } from './squirrelAnimation';
import { NAV } from '../../data/nav';
import './BranchNav.css';

const ITEMS = [{ path: '/', label: 'Home', id: 'home' }, ...NAV.left, ...NAV.right]
  .map(item => ({ ...item, id: item.id || item.label.toLowerCase().replace(/\s+/g, '-') }));

// Bark surfaces in native 2172 × 430 image (branch-house-medium.webp).
// Smooth parabolic arc hugs the physical trunk and bark surfaces.
const BRANCH_ART = '/images/navigation/branch-house-medium.webp';
const RAINBOW_BACKDROP = '/images/navigation/rainbow-cloud-backdrop.webp';
const COMPACT_ART = '/images/navigation/branch-house-compact.png';
const COMPACT_BRANCH = [[0,430,500],[.15,430,520],[.3,460,540],[.5,455,550],[.7,450,535],[.85,420,510],[1,425,490]];

function ropeTop(x, art) {
  if (art.compact) return branchY(x, art) - art.height * .012;
  const ratio = Math.max(0, Math.min(1, (x - art.x) / art.width));
  const topNative = 215 + 45 * (1.0 - 4.0 * Math.pow(ratio - 0.5, 2));
  return art.y + (topNative / 430) * art.height;
}

function branchY(x, art, edge = 1) {
  if (art.compact) {
    const ratio = Math.max(0, Math.min(1, (x - art.x) / art.width));
    const trace = COMPACT_BRANCH;
    const index = trace.findIndex(point => point[0] >= ratio);
    const a = trace[Math.max(0, index - 1)], b = trace[Math.max(1, index)];
    return art.y + (a[edge] + (b[edge] - a[edge]) * (ratio - a[0]) / (b[0] - a[0] || 1)) / 1024 * art.height;
  }
  const ratio = Math.max(0, Math.min(1, (x - art.x) / art.width));
  if (edge === 2) {
    // Under edge of trunk where loops secure and knots hug
    const underNative = 345 + 5 * (1.0 - 4.0 * Math.pow(ratio - 0.5, 2));
    return art.y + (underNative / 430) * art.height;
  }
  // Upper bark surface where squirrel paws sit directly on wood
  const topNative = 218 + 44 * (1.0 - 4.0 * Math.pow(ratio - 0.5, 2));
  return art.y + (topNative / 430) * art.height;
}

function ordinaryClick(event) { return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey; }

export default function BranchNav() {
  const location = useLocation();
  const navRef = useRef(null), artRef = useRef(null), canvasRef = useRef(null), logoRef = useRef(null);
  const boardsRef = useRef(new Map()), startRef = useRef(() => {});
  const [open, setOpen] = useState(false);
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

  const [geometry, setGeometry] = useState({ width: 1, height: 1, ropes: [], art: { x: 0, y: 0, width: 1, height: 1 } });
  const selected = ITEMS.find(item => item.id === location.state?.navItem && item.path === location.pathname)?.id
    || ITEMS.find(item => item.path === location.pathname)?.id;

  useEffect(() => {
    const nav = navRef.current, canvas = canvasRef.current;
    const animation = createSquirrelAnimation(canvas);
    startRef.current = animation.start;
    const relative = element => {
      const a = element.getBoundingClientRect(), b = nav.getBoundingClientRect();
      return { x: a.x - b.x, y: a.y - b.y, width: a.width, height: a.height };
    };
    const measure = () => {
      const art = relative(artRef.current), box = nav.getBoundingClientRect();
      art.compact = artRef.current.currentSrc.includes('branch-house-compact');
      const layout = { art, width: box.width, height: box.height, size: parseFloat(getComputedStyle(canvas).width) };
      const ropes = [];
      [...boardsRef.current.values(), logoRef.current].forEach(element => {
        if (!element?.getClientRects().length || element.closest('.featured-drawer')) return;
        const r = relative(element), isLogo = element === logoRef.current;
        (isLogo ? [.035, .965] : [.22, .78]).forEach(anchor => {
          const x = r.x + r.width * anchor;
          ropes.push({ x, top: ropeTop(x, art), under: branchY(x, art, 2), bottom: r.y,
            board: isLogo ? 'logo' : element.dataset.navId });
        });
      });
      setGeometry({ ...layout, ropes });
      animation.measure(layout);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    observer.observe(artRef.current);
    const branchImage = artRef.current;
    branchImage.addEventListener('load', measure);
    return () => {
      animation.dispose();
      observer.disconnect();
      branchImage.removeEventListener('load', measure);
      startRef.current = () => {};
    };
  }, []);
  const visit = useCallback(event => {
    if (!ordinaryClick(event)) return;
    // Routing stays immediate; the mounted header completes the same entrance.
    startRef.current();
    setOpen(false);
  }, []);

  const sign = (item, drawer = false) => (
    <Link
      key={item.id}
      ref={element => {
        if (!drawer) {
          if (element) boardsRef.current.set(item.id, element);
          else boardsRef.current.delete(item.id);
        }
      }}
      to={item.path}
      state={{ navItem: item.id }}
      data-nav-id={item.id}
      aria-current={selected === item.id ? 'page' : undefined}
      className={`featured-sign${selected === item.id ? ' featured-active' : ''}`}
      onClick={visit}
    >
      <span>{item.label}</span>
    </Link>
  );

  return (
    <header className="bn-header featured-nav">
      <nav ref={navRef} className="featured-inner" aria-label="Main navigation">
        <div className="featured-sky" aria-hidden="true">
          <img src={RAINBOW_BACKDROP} width="1536" height="1024" alt="" decoding="async" />
        </div>
        <div className="featured-canopy">
          <picture>
            <source media="(max-width:1100px)" srcSet={COMPACT_ART} width="1536" height="1024" />
            <img ref={artRef} className="featured-branch" fetchPriority="high" src={BRANCH_ART} width="2172" height="430" alt="" aria-hidden="true" decoding="async" />
          </picture>
        </div>
        <NavigationRopes ropes={geometry.ropes} />
        <canvas ref={canvasRef} className="featured-squirrel" width="128" height="128" aria-hidden="true" />
        <div className="featured-signs featured-left">{ITEMS.slice(0, 3).map(item => sign(item))}</div>
        <div className="featured-home">
          <Link ref={logoRef} to="/" aria-label="Rainbow Digi School — Excellence begins early — home" className={`featured-logo${location.pathname === '/' ? ' featured-active' : ''}`}>
            <Logo />
          </Link>
          <button type="button" className="featured-monkey" aria-label="Send the squirrel home" onClick={() => startRef.current()}>
            <img className="featured-handle" src="/images/navigation/monkey-handle-grip.png" width="1536" height="1024" alt="" decoding="async" />
          </button>
        </div>
        <div className="featured-signs featured-right">{ITEMS.slice(3).map(item => sign(item))}</div>
        <button ref={menuRef} type="button" className="featured-menu" aria-controls="school-navigation-menu" aria-expanded={open} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setOpen(value => !value)}>
          ☰
        </button>
        {open && (
          <div ref={drawerRef} id="school-navigation-menu" className="featured-drawer">
            {ITEMS.map(item => sign(item, true))}
          </div>
        )}
      </nav>
    </header>
  );
}
