import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import NavigationRopes from './NavigationRopes';
import NavbarMonkey from './NavbarMonkey';
import { createSquirrelAnimation } from './squirrelAnimation';
import { ropeSurface } from './ropeGeometry';
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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
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
      document.body.style.overflow = previousOverflow;
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
      nav.style.setProperty('--navbar-bottom', `${Math.max(0, box.bottom)}px`);
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
        if (!isLogo) r.y = relative(element.parentElement).y;
        const pair = (isLogo ? [.18, .82] : [.16, .84]).map(anchor => {
          const x = r.x + r.width * anchor;
          const surface = ropeSurface(x, art);
          const wrapTop = surface.top - 2 * scale;
          const wrapHeight = (surface.under - wrapTop) * 1024 / 800;
          return { x, ...surface, wrapTop, wrapHeight, wrapWidth: wrapHeight * 290 / 480 };
        });
        // Menu holes are baked into the original 594 × 450 plank at y=57.
        const hole = r.y + r.height * (isLogo ? .11 : .09);
        const knotY = Math.max(...pair.map(rope => rope.wrapTop + rope.wrapHeight));
        const ropeLength = Math.max(0, hole - knotY);
        const boardIndex = isLogo ? 'logo' : index + 1;
        nav.style.setProperty(`--rope-len-${boardIndex}`, `${ropeLength.toFixed(2)}px`);
        pair.forEach(rope => ropes.push({
          ...rope, bottom: r.y, hole, knotY, ropeLength, boardIndex,
          thickness: compact ? 4.5 : 6,
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
      className={`featured-sign featured-sign-${item.id}${selected === item.id ? ' featured-active' : ''}`}
      onClick={event => visit(event, item)}
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
            <source media="(max-width:767px)" srcSet={COMPACT_ART} width="1536" height="1024" />
            <img ref={artRef} className="featured-branch" fetchPriority="high" src={BRANCH_ART} width="2172" height="430" alt="" aria-hidden="true" decoding="async" />
          </picture>
        </div>
        <NavigationRopes ropes={geometry.ropes} />
        <canvas ref={canvasRef} className="featured-squirrel" width="128" height="128" aria-hidden="true" />
        <div className="featured-signs featured-left">{ITEMS.slice(0, 3).map(item => sign(item))}</div>
        <div className="featured-home">
          <NavbarMonkey />
          <Link ref={logoRef} to="/" onClick={visitHouse} aria-label="Rainbow Digi School — Excellence begins early — home" className={`featured-logo${location.pathname === '/' ? ' featured-active' : ''}`}>
            <Logo alt="Rainbow DIGI School" showTitle={false} />
          </Link>
          <button type="button" hidden className="featured-monkey" aria-label="Send the squirrel home" onClick={visitMonkey}>
            <picture>
              <source srcSet="/images/navigation/monkey-handle-grip.webp" type="image/webp" />
              <img className="featured-handle" src="/images/navigation/monkey-handle-grip.png" width="1536" height="1024" alt="" decoding="async" />
            </picture>
          </button>
        </div>
        <div className="featured-signs featured-right">{ITEMS.slice(3).map(item => sign(item))}</div>
        <button ref={menuRef} type="button" className="featured-menu" aria-controls="school-navigation-menu" aria-expanded={open} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setOpen(value => !value)}>
          Menu
        </button>
        <Link className="featured-apply" to="/admissions" onClick={() => setOpen(false)}>Apply</Link>
        {open && (<>
          <button className="featured-backdrop" aria-label="Close navigation menu" onClick={() => setOpen(false)}/>
          <div ref={drawerRef} id="school-navigation-menu" className="featured-drawer">
            {ITEMS.map(item => sign(item, true))}
          </div>
        </>)}
      </nav>
    </header>
  );
}
