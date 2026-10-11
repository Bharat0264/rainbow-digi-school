import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import NavigationRopes from './NavigationRopes';
import { NAV } from '../../data/nav';
import './BranchNav.css';

const ITEMS = [{ path: '/', label: 'Home', id: 'home' }, ...NAV.left, ...NAV.right]
  .map(item => ({ ...item, id: item.id || item.label.toLowerCase().replace(/\s+/g, '-') }));

// Bark surfaces in native 2172 × 430 image (branch-house-medium.webp).
// Smooth parabolic arc hugs the physical trunk and bark surfaces.
const BRANCH_ART = '/images/navigation/branch-house-medium.webp';
const RAINBOW_BACKDROP = '/images/navigation/rainbow-cloud-backdrop.webp';
const HOUSE = { x: .474, y: .313, radius: .052, left: .416, top: .23, width: .166, height: .231 };
const COMPACT_ART = '/images/navigation/branch-house-compact.png';
const COMPACT_BRANCH = [[0,430,500],[.15,430,520],[.3,460,540],[.5,455,550],[.7,450,535],[.85,420,510],[1,425,490]];
const COMPACT_HOUSE = { x: .47, y: .332, radius: .044, left: .39, top: .255, width: .25, height: .17 };

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
  const [entering, setEntering] = useState(false);
  const maskId = useId().replaceAll(':', '');
  const selected = ITEMS.find(item => item.id === location.state?.navItem && item.path === location.pathname)?.id
    || ITEMS.find(item => item.path === location.pathname)?.id;

  useEffect(() => {
    const nav = navRef.current, canvas = canvasRef.current, context = canvas.getContext('2d');
    const sprite = new Image(); sprite.src = '/images/navigation/squirrel-gait-v2.webp';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, disposed = false, lastTime = 0;
    // Squirrel begins at rest, grounded on bark facing left toward boards
    let layout, x, y, target = 'rest', direction = -1, speed = 0, distance = 0;
    let state = 'idle', phaseStart = 0, entryStart = null, rememberedElement = null;

    const setState = next => {
      if (state === next) return;
      state = next; canvas.dataset.state = next;
      setEntering(next === 'enteringHouse' || next === 'inside');
    };
    canvas.dataset.state = state;

    const relative = element => {
      const a = element.getBoundingClientRect(), b = nav.getBoundingClientRect();
      return { x: a.x - b.x, y: a.y - b.y, width: a.width, height: a.height };
    };

    const targetX = () => {
      if (target === 'house') return layout.art.x + layout.art.width * layout.house.x;
      if (target === 'rest') return layout.art.x + layout.art.width * 0.385;
      const element = boardsRef.current.get(target);
      const rect = element?.getClientRects().length ? relative(element) : rememberedElement;
      return Math.max(layout.size / 2, Math.min(layout.width - layout.size / 2, rect ? rect.x + rect.width / 2 : x));
    };

    const draw = (frame = 0, scale = 1, shadowFade = 1) => {
      if (!layout || x === undefined) return;
      context.clearRect(0, 0, 128, 128);
      if (state !== 'inside' && state !== 'insideHome' && sprite.complete && sprite.naturalWidth) {
        // Grounding contact shadow under paws
        if (shadowFade > 0) {
          context.save();
          context.beginPath();
          context.ellipse(64, 120, 20 * scale, 5 * scale, 0, 0, Math.PI * 2);
          context.fillStyle = `rgba(45, 22, 10, ${0.45 * shadowFade})`;
          context.fill();
          context.restore();
        }
        // Character sprite
        context.save();
        context.translate(64, 120);
        context.scale(direction * scale, scale);
        context.drawImage(sprite, frame * 128, 0, 128, 128, -64, -120, 128, 128);
        context.restore();
      }
      canvas.style.transform = `translate3d(${x - layout.size / 2}px,${y - layout.size * 120 / 128}px,0)`;
      canvas.dataset.frame = String(frame);
      canvas.dataset.direction = String(direction);
      canvas.dataset.target = target;
    };

    const measure = () => {
      const art = relative(artRef.current), box = nav.getBoundingClientRect();
      art.compact = artRef.current.currentSrc.includes('branch-house-compact');
      art.wide = /branch-house-(wide|medium)/.test(artRef.current.currentSrc);
      layout = { art, house: art.compact ? COMPACT_HOUSE : HOUSE, width: box.width, height: box.height, size: parseFloat(getComputedStyle(canvas).width) };
      const ropes = [];
      [...boardsRef.current.values(), logoRef.current].forEach(element => {
        if (!element?.getClientRects().length || element.closest('.featured-drawer')) return;
        const r = relative(element);
        const isLogo = element === logoRef.current;
        (isLogo ? [.035, .965] : [.22, .78]).forEach(anchor => {
          const rx = r.x + r.width * anchor;
          ropes.push({
            x: rx,
            top: ropeTop(rx, art),
            under: branchY(rx, art, 2),
            bottom: r.y + (isLogo ? 7 : 0),
            board: isLogo ? 'logo' : element.dataset.navId
          });
        });
      });
      setGeometry({ ...layout, ropes });
      if (x === undefined || state === 'idle' || state === 'inside' || state === 'insideHome') {
        x = targetX();
        y = branchY(x, art, 1);
        draw(0);
      } else {
        x = Math.max(layout.size / 2, Math.min(layout.width - layout.size / 2, x));
      }
    };

    const tick = now => {
      const dt = Math.min(0.04, (now - lastTime) / 1000 || 0.016);
      lastTime = now;
      const goal = targetX();
      const delta = goal - x;

      if (state === 'walking' || state === 'running') {
        const desired = Math.sign(delta) * Math.min(520, Math.sqrt(2 * 1400 * Math.abs(delta)));
        speed += Math.max(-1800 * dt, Math.min(1800 * dt, desired - speed));
        const step = speed * dt;
        if (Math.abs(delta) < 1.5 || (Math.sign(step) === Math.sign(delta) && Math.abs(step) >= Math.abs(delta))) {
          x = goal;
          speed = 0;
          phaseStart = now;
          entryStart = { x, y: branchY(x, layout.art, 1) };
          if (target === 'home') {
            setState('leapingHome');
          } else if (target === 'house') {
            setState('enteringHouse');
          } else {
            setState('stopping');
          }
        } else {
          x += step;
          distance += Math.abs(step);
          if (Math.abs(speed) > 12) direction = Math.sign(speed);
          setState(Math.abs(speed) > 210 ? 'running' : 'walking');
        }
        y = branchY(x, layout.art, 1);
        const cycle = state === 'running' ? [1, 5, 2, 6, 3, 5, 4, 6] : [1, 2, 3, 4];
        draw(cycle[Math.floor(distance / (layout.size * 0.28)) % cycle.length]);
      } else if (state === 'stopping') {
        draw(7);
        if (now - phaseStart >= 150) {
          setState('idle');
          draw(0);
          return;
        }
      } else if (state === 'enteringHouse') {
        const t = Math.min(1, (now - phaseStart) / 1050);
        const eased = t * t * (3 - 2 * t);
        const doorY = layout.art.y + layout.art.height * layout.house.y + layout.size * 0.42;
        y = entryStart.y + (doorY - entryStart.y) * eased;
        draw([1, 2, 3, 4][Math.floor(t * 12) % 4], 1 - 0.7 * eased, 1 - eased);
        if (t === 1) {
          setState('inside');
          draw();
          return;
        }
      } else if (state === 'leapingHome') {
        // Playful parabolic leap into Home board
        const t = Math.min(1, (now - phaseStart) / 520);
        const homeEl = boardsRef.current.get('home');
        const r = homeEl?.getClientRects().length ? relative(homeEl) : rememberedElement;
        const targetBoardY = r ? r.y + r.height * 0.45 : entryStart.y + 70;
        // Parabolic arch upwards then descending behind wooden board face (z-index 3 vs z-index 5)
        const arch = 35 * Math.sin(t * Math.PI);
        y = entryStart.y + (targetBoardY - entryStart.y) * t - arch;
        x = entryStart.x;
        const pose = t < 0.25 ? 5 : t < 0.75 ? 6 : 7;
        const shadowFade = Math.max(0, 1 - t * 2.5);
        draw(pose, 1 - 0.2 * t, shadowFade);
        if (t === 1) {
          setState('insideHome');
          context.clearRect(0, 0, 128, 128);
          if (location.pathname !== '/') {
            navigate('/');
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          // Cleanly reset animation state so squirrel can run again
          window.setTimeout(() => {
            if (disposed) return;
            target = 'rest';
            x = targetX();
            y = branchY(x, layout.art, 1);
            direction = -1;
            setState('idle');
            draw(0);
          }, 500);
          return;
        }
      } else {
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    startRef.current = (id, element) => {
      if (id === 'house' && (target === 'house' && ['walking', 'running', 'enteringHouse', 'inside'].includes(state))) return;
      if (id === 'home' && (target === 'home' && ['walking', 'running', 'leapingHome', 'insideHome'].includes(state))) return;
      cancelAnimationFrame(raf);
      if (element) rememberedElement = relative(element);
      if (state === 'inside') {
        x = layout.art.x + layout.art.width * layout.house.x;
        y = branchY(x, layout.art, 1);
      }
      if (state === 'insideHome') {
        x = targetX();
        y = branchY(x, layout.art, 1);
      }
      target = id;
      if (reduced.matches) {
        if (id === 'home') {
          if (location.pathname !== '/') navigate('/');
          else window.scrollTo({ top: 0, behavior: 'instant' });
        }
        x = targetX();
        y = branchY(x, layout.art, 1);
        setState(id === 'house' ? 'inside' : 'idle');
        draw(0);
        return;
      }
      setState('walking');
      lastTime = performance.now();
      raf = requestAnimationFrame(tick);
    };

    measure();
    sprite.onload = () => { if (!disposed) draw(0); };
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    observer.observe(artRef.current);
    const branchImage = artRef.current;
    branchImage.addEventListener('load', measure);
    const motionChanged = () => startRef.current(target);
    reduced.addEventListener('change', motionChanged);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      branchImage.removeEventListener('load', measure);
      reduced.removeEventListener('change', motionChanged);
      startRef.current = () => {};
    };
  }, [navigate, location.pathname]);

  const visit = useCallback((event, item, house = false) => {
    if (!ordinaryClick(event)) return;
    if (item.id === 'home' || house) {
      event.preventDefault();
      startRef.current(house ? 'house' : 'home', event.currentTarget);
      setOpen(false);
    } else {
      startRef.current(item.id, event.currentTarget);
      setOpen(false);
    }
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
      onClick={event => visit(event, item)}
    >
      <span>{item.label}</span>
    </Link>
  );

  const art = geometry.art;
  const house = geometry.house || HOUSE;

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
        {entering && (
          <svg className="featured-house-front" width="100%" height="100%" aria-hidden="true">
            <defs>
              <clipPath id={maskId}>
                <path clipRule="evenodd" fillRule="evenodd" d={`M${art.x + art.width * house.left},${art.y + art.height * house.top} h${art.width * house.width} v${art.height * house.height} h${-art.width * house.width} Z M${art.x + art.width * house.x + art.height * house.radius},${art.y + art.height * house.y} a${art.height * house.radius},${art.height * house.radius} 0 1 0 ${-art.height * house.radius * 2},0 a${art.height * house.radius},${art.height * house.radius} 0 1 0 ${art.height * house.radius * 2},0 Z`} />
              </clipPath>
            </defs>
            <image href={art.compact ? COMPACT_ART : BRANCH_ART} x={art.x} y={art.y} width={art.width} height={art.height} clipPath={`url(#${maskId})`} />
          </svg>
        )}
        <div className="featured-signs featured-left">{ITEMS.slice(0, 3).map(item => sign(item))}</div>
        <div className="featured-home">
          <Link ref={logoRef} to="/" aria-label="Rainbow Digi School — Excellence begins early — home" className={`featured-logo${location.pathname === '/' ? ' featured-active' : ''}`}>
            <Logo />
          </Link>
          <button type="button" className="featured-monkey" aria-label="Send the squirrel home" onClick={() => startRef.current('house')}>
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
