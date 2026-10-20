import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { House, GraduationCap, UsersRound, School, BookOpen, Phone } from 'lucide-react';
import NavigationRopes from './NavigationRopes';
import { CanopyLayer, AssemblyArt, SquirrelSprites } from './NavArtwork';
import { createSquirrelAnimation } from './squirrelAnimation';
import { ropeSurface } from './ropeGeometry';
import { NAV } from '../../data/nav';
import './BranchNav.css';

const ITEMS = [{ path: '/', label: 'Home', id: 'home' }, ...NAV.left, ...NAV.right]
  .map(item => ({ ...item, id: item.id || item.label.toLowerCase().replace(/\s+/g, '-') }));

const RAINBOW_BACKDROP = '/assets/nav/optimized/rainbow.svg';
const MENU_ICONS = { home: House, academics: GraduationCap, admissions: UsersRound, campus: School, 'school-life': BookOpen, contact: Phone };

function ordinaryClick(event) { return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey; }

export default function BranchNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null), artRef = useRef(null), canvasRef = useRef(null), logoRef = useRef(null);
  const gaitRef = useRef(null), entryRef = useRef(null);
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
    const animation = createSquirrelAnimation(canvas, gaitRef.current, entryRef.current);
    startRef.current = animation.start;
    const relative = element => {
      const a = element.getBoundingClientRect(), b = nav.getBoundingClientRect();
      return { x: a.x - b.x, y: a.y - b.y, width: a.width, height: a.height };
    };
    const measure = () => {
      const compact = window.matchMedia('(max-width: 767px)').matches;
      let sceneWidth=Math.round(Math.min(window.innerWidth*.95,compact?440:1800));
      if((window.innerWidth-sceneWidth)%2)sceneWidth--;
      nav.style.width=`${sceneWidth}px`;
      const box=nav.getBoundingClientRect();
      nav.style.setProperty('--canopy-height',`${Math.round(box.width*(compact?1024/1536:430/2172))}px`);
      const scale = box.width / (compact ? 440 : 1224);
      if (Math.abs(Number(nav.style.getPropertyValue('--scale')) - scale) > .0001) {
        nav.style.setProperty('--scale', String(scale));
      }
      nav.style.setProperty('--board-width',`${Math.round(120*scale)}px`);
      nav.style.setProperty('--board-height',`${Math.round(Math.round(120*scale)*450/594)}px`);
      nav.style.setProperty('--board-gap',`${Math.round(18*scale)}px`);
      nav.style.setProperty('--board-top',`${Math.round(220*scale)}px`);
      nav.style.setProperty('--logo-top',`${Math.round((compact?170:205)*scale)}px`);
      const art = relative(artRef.current);
      art.compact = artRef.current.currentSrc.includes('/compact-');
      // Match the board's baked rope stubs to the house mounts, so the drop is
      // vertical instead of crossing a second, angled strand at either knot.
      const nativeWidth=art.compact?1536:2172;
      const mountingXs=art.compact?[624,944]:[972,1212];
      const centralThickness=5.5*(compact?1.1:1.4)*scale;
      const logoWidth=(mountingXs[1]-mountingXs[0])/nativeWidth*art.width/(.788-.215);
      const logoCenter=art.x+mountingXs[0]/nativeWidth*art.width-centralThickness*.022+(.5-.215)*logoWidth;
      nav.style.setProperty('--logo-width',`${Math.round(logoWidth)}px`);
      nav.style.setProperty('--logo-center',`${Math.round(logoCenter-logoWidth/2)+Math.round(logoWidth)/2}px`);
      const layout = { art, width: box.width, height: box.height, size: parseFloat(getComputedStyle(canvas).width) };
      const ropes = [];
      [...boardsRef.current.values(), logoRef.current].forEach((element, index) => {
        if (!element?.getClientRects().length || element.closest('.featured-drawer')) return;
        const r = relative(element), isLogo = element === logoRef.current;
        // Board uses center top transform origin for active scale; its top edge y matches parent row.
        if (!isLogo) r.y = relative(element.parentElement).y;
        // Logo ropes meet the two knots already painted into its upper rail.
        const ropeThickness=(isLogo ? 5.5 * (compact ? 1.1 : 1.4) : 5.5) * scale;
        const pair = (isLogo ? [.215, .788] : [.22, .78]).map((anchor, pairIndex) => {
          const x = r.x + r.width * anchor;
          const surface = ropeSurface(x, art);
          let upperX=x;
          if (isLogo) {
            // Register the gold mount to the black fastener baked into the rail.
            const [boltX,boltY]=(art.compact?[[624,418],[944,418]]:[[972,291],[1212,291]])[pairIndex];
            upperX=art.x+boltX/(art.compact?1536:2172)*art.width-ropeThickness*.022;
            surface.under=art.y+boltY/(art.compact?1024:430)*art.height+ropeThickness*1.095;
            surface.top = surface.under;
            surface.angle = 0;
          }
          const branchThickness = surface.thickness;
          const wrapHeight = branchThickness * 1.10;
          const wrapTop = surface.centerY - wrapHeight / 2;
          const wrapBottom = surface.centerY + wrapHeight / 2;
          return { x, upperX, ...surface, wrapTop, wrapBottom, wrapHeight, isLogo };
        });
        // Menu holes are baked into the original 594 × 450 plank at y=57.
        const hole = r.y + r.height * (isLogo ? .20 : 57 / 450);
        const knotY = Math.max(...pair.map(rope => Math.max(rope.wrapBottom, rope.under + 2 * scale)));
        const ropeLength = Math.max(0, hole - knotY);
        const boardIndex = isLogo ? 'logo' : index + 1;
        nav.style.setProperty(`--rope-len-${boardIndex}`, `${ropeLength.toFixed(2)}px`);
        pair.forEach(rope => ropes.push({
          ...rope, bottom: r.y, hole, knotY, ropeLength, boardIndex,
          thickness: ropeThickness,
          board: isLogo ? 'logo' : element.dataset.navId,
        }));
      });
      const railFasteners=ropes.filter(rope=>rope.isLogo).map(({upperX,under,thickness})=>({
        x:upperX+thickness*.022,
        y:under-thickness*1.095,
        size:thickness*1.1,
      }));
      const nextGeometry={...layout,ropes,railFasteners};
      setGeometry(previous=>JSON.stringify(previous)===JSON.stringify(nextGeometry)?previous:nextGeometry);
      animation.measure(layout);
    };
    measure();
    let frame;
    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    window.addEventListener('resize',scheduleMeasure);
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
      window.removeEventListener('resize',scheduleMeasure);
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
    const Icon = MENU_ICONS[item.id];
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
        {drawer && <span className={`featured-menu-icon featured-menu-icon-${item.id}`} aria-hidden="true"><Icon size={23} strokeWidth={2.5} /></span>}
        <span className="featured-board-content">
          <span className={`featured-label-text featured-label-text-${item.id}`}>{item.label}</span>
        </span>
      </Link>
    );
  };

  return (
    <header className="bn-header featured-nav">
      <nav ref={navRef} className="featured-inner" aria-label="Main navigation">
        <svg className="featured-svg-defs" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
          <defs>
            <filter id="wood-paint-edge" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        <div className="featured-sky" aria-hidden="true">
          <img src={RAINBOW_BACKDROP} width="1536" height="1024" alt="" decoding="async" />
        </div>
        <div className="featured-canopy">
          <CanopyLayer layer="branch" imageRef={artRef} />
          <CanopyLayer layer="leaves" />
          <CanopyLayer layer="house" />
        </div>
        <NavigationRopes ropes={geometry.ropes} railFasteners={geometry.railFasteners} />
        <SquirrelSprites gaitRef={gaitRef} entryRef={entryRef} />
        <canvas ref={canvasRef} className="featured-squirrel" width="128" height="128" aria-hidden="true" />
        <div className="featured-signs featured-left">{ITEMS.slice(0, 3).map(item => sign(item))}</div>
        <div className="featured-home">
          <Link ref={logoRef} to="/" onClick={visitHouse} aria-label="Rainbow Digi School — Excellence begins early — home" className={`featured-logo${location.pathname === '/' ? ' featured-active' : ''}`}>
            <AssemblyArt />
          </Link>
          <button type="button" className="featured-monkey" aria-label="Send the squirrel home" onClick={visitMonkey}>
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
