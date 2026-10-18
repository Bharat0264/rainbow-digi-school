import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import NavigationRopes from './NavigationRopes';
import { createSquirrelAnimation } from './squirrelAnimation';
import { ropeSurface } from './ropeGeometry';
import { FLORA_CONFIG } from './navFloraConfig';
import { NAV } from '../../data/nav';
import './BranchNav.css';

const ITEMS = [{ path: '/', label: 'Home', id: 'home' }, ...NAV.left, ...NAV.right]
  .map(item => ({ ...item, id: item.id || item.label.toLowerCase().replace(/\s+/g, '-') }));

const BRANCH_ART = '/images/navigation/branch-house-medium.webp';
const RAINBOW_BACKDROP = '/images/navigation/rainbow-cloud-backdrop.webp';
const COMPACT_ART = '/images/navigation/branch-house-compact.png';

function ordinaryClick(event) { return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey; }

export default function BranchNav() {
  const location = useLocation();
  const navigate = useNavigate();
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

  useLayoutEffect(() => {
    const nav = navRef.current, canvas = canvasRef.current;
    const animation = createSquirrelAnimation(canvas);
    startRef.current = animation.start;
    const relative = element => {
      const a = element.getBoundingClientRect(), b = nav.getBoundingClientRect();
      return { x: a.x - b.x, y: a.y - b.y, width: a.width, height: a.height };
    };
    const measure = () => {
      const box = nav.getBoundingClientRect();
      const compact = window.matchMedia('(max-width: 767px)').matches;
      const scale = box.width / (compact ? 440 : 1224);
      if (Math.abs(Number(nav.style.getPropertyValue('--scale')) - scale) > .0001) {
        nav.style.setProperty('--scale', String(scale));
      }
      const art = relative(artRef.current);
      art.compact = artRef.current.currentSrc.includes('branch-house-compact');
      const layout = { art, width: box.width, height: box.height, size: parseFloat(getComputedStyle(canvas).width) };
      const ropes = [];
      [...boardsRef.current.values(), logoRef.current].forEach((element, index) => {
        if (!element?.getClientRects().length || element.closest('.featured-drawer')) return;
        const r = relative(element), isLogo = element === logoRef.current;
        // Use the untransformed row plus its selected offset; a newly changed
        // class can be measured before the browser paints its transform.
        if (!isLogo) r.y = relative(element.parentElement).y + (element.classList.contains('featured-active') ? 4 * scale : 0);
        const pair = (isLogo ? [.18, .82] : [.22, .78]).map(anchor => {
          const x = r.x + r.width * anchor;
          const surface = ropeSurface(x, art);
          const branchThickness = surface.under - surface.top;
          const wrapHeight = branchThickness * (isLogo ? 1.10 * 1.45 : 1.10);
          const wrapTop = isLogo
            ? (surface.top + surface.under) / 2 - wrapHeight / 2
            : surface.top - branchThickness * 0.05;
          const wrapWidth = wrapHeight * (isLogo ? 1.25 : 1.15);
          return { x, ...surface, wrapTop, wrapHeight, wrapWidth, isLogo };
        });
        // Menu holes are baked into the original 594 × 450 plank at y=57.
        const hole = r.y + r.height * (isLogo ? .13 : 57 / 450);
        const knotY = Math.max(...pair.map(rope => rope.wrapTop + rope.wrapHeight));
        const ropeLength = Math.max(0, hole - knotY);
        const boardIndex = isLogo ? 'logo' : index + 1;
        nav.style.setProperty(`--rope-len-${boardIndex}`, `${ropeLength.toFixed(2)}px`);
        pair.forEach(rope => ropes.push({
          ...rope, bottom: r.y, hole, knotY, ropeLength, boardIndex,
          thickness: (isLogo ? 6 : 5.5) * scale,
          board: isLogo ? 'logo' : element.dataset.navId,
        }));
      });
      setGeometry({ ...layout, ropes });
      animation.measure(layout);
    };
    measure();
    let frame;
    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(nav);
    observer.observe(artRef.current);
    // Board dimensions settle after the shared scale is applied. Observing them
    // keeps the fittings attached even when the outer scene size is unchanged.
    for (const board of boardsRef.current.values()) observer.observe(board);
    observer.observe(logoRef.current);
    const classObserver = new MutationObserver(scheduleMeasure);
    classObserver.observe(nav, { subtree: true, attributes: true, attributeFilter: ['class'] });
    const branchImage = artRef.current;
    branchImage.addEventListener('load', scheduleMeasure);
    return () => {
      cancelAnimationFrame(frame);
      animation.dispose();
      observer.disconnect();
      classObserver.disconnect();
      branchImage.removeEventListener('load', scheduleMeasure);
      startRef.current = () => {};
    };
  }, []);
  const navigateToItem = useCallback(item => {
    setOpen(false);
    navigate(item.path, { state: { navItem: item.id } });
  }, [navigate]);
  const visit = useCallback((event, item) => {
    if (!ordinaryClick(event)) return;
    event.preventDefault();
    const clicked = event.currentTarget;
    startRef.current({
      id: item.id,
      // Read live bounds, including drawer scrolling and viewport changes.
      resolve: () => {
        if (clicked.isConnected && clicked.getClientRects().length) return clicked;
        const board = boardsRef.current.get(item.id);
        return board?.getClientRects().length ? board : null;
      },
    });
    navigateToItem(item);
  }, [navigateToItem]);

  const visitMonkey = useCallback(() => {
    startRef.current({ kind: 'house' });
    navigateToItem(ITEMS[0]);
  }, [navigateToItem]);

  const visitHouse = useCallback(event => {
    if (!ordinaryClick(event)) return;
    event.preventDefault();
    startRef.current({ kind: 'house' });
    setOpen(false);
    navigate('/');
  }, [navigate]);

  const sign = (item, drawer = false) => {
    const flora = FLORA_CONFIG[item.id] || [];
    const isSchoolLife = item.id === 'school-life';
    return (
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
        className={`featured-sign featured-sign-${item.id}${selected === item.id ? ' featured-active' : ''}`}
        onClick={event => visit(event, item)}
      >
        <span className="featured-board-content">
          <span className="featured-word-wrap">
            <span className="featured-label">
              {isSchoolLife ? (
                <>
                  <span className="featured-word">School</span>{' '}
                  <span className="featured-word">Life</span>
                </>
              ) : (
                item.label
              )}
            </span>
            <span className="featured-flora" aria-hidden="true">
              {flora.map((f, index) => (
                <svg
                  key={index}
                  className={`flora-item flora-${f.type}`}
                  style={{
                    left: f.x,
                    top: f.y,
                    width: f.size,
                    height: f.size,
                    transform: `translate(-50%, -50%) rotate(${f.rotate})`,
                    '--base-rot': f.rotate,
                    '--sway-delay': f.delay,
                    '--bloom-delay': `${index * 40}ms`,
                  }}
                >
                  <use href={`/sprites/flowers.svg${f.symbol}`} />
                </svg>
              ))}
            </span>
          </span>
        </span>
      </Link>
    );
  };

  return (
    <header className="bn-header featured-nav">
      <nav ref={navRef} className="featured-inner" aria-label="Main navigation">
        <svg className="featured-svg-defs" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
          <defs>
            <filter id="moss-fuzzy" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        <div className="featured-sky" aria-hidden="true">
          <img src={RAINBOW_BACKDROP} width="1536" height="1024" alt="" decoding="async" />
        </div>
        <div className="featured-canopy">
          <picture>
            <source media="(max-width:767px)" srcSet={COMPACT_ART} width="1536" height="1024" />
            <img ref={artRef} className="featured-branch" fetchPriority="high" src={BRANCH_ART} width="2172" height="430" alt="" aria-hidden="true" decoding="async" />
          </picture>
        </div>
        <NavigationRopes ropes={geometry.ropes} />
        <canvas ref={canvasRef} className="featured-squirrel" width="128" height="128" aria-hidden="true" />
        <div className="featured-signs featured-left">{ITEMS.slice(0, 3).map(item => sign(item))}</div>
        <div className="featured-home">
          <Link ref={logoRef} to="/" onClick={visitHouse} aria-label="Rainbow Digi School — Excellence begins early — home" className={`featured-logo${location.pathname === '/' ? ' featured-active' : ''}`}>
            <Logo alt="Rainbow DIGI School" showTitle={false} />
          </Link>
          <button type="button" className="featured-monkey" aria-label="Send the squirrel home" onClick={visitMonkey}>
            <picture>
              <source srcSet="/images/navigation/monkey-handle-grip.webp" type="image/webp" />
              <img className="featured-handle" src="/images/navigation/monkey-handle-grip.png" width="1536" height="1024" alt="" decoding="async" />
            </picture>
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
