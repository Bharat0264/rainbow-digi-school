import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const findPathPoint = (path, x) => {
  let low = 0;
  let high = path.getTotalLength();
  for (let index = 0; index < 18; index += 1) {
    const middle = (low + high) / 2;
    if (path.getPointAtLength(middle).x < x) low = middle;
    else high = middle;
  }
  return path.getPointAtLength((low + high) / 2);
};

export function useBranchTarget(geometry, width, mobile, allItems, open, pathRef) {
  const location = useLocation();
  const [hoverPath, setHoverPath] = useState(null);
  const [target, setTarget] = useState(null);
  const targetPath = hoverPath || location.pathname;

  useEffect(() => {
    if (!geometry || !pathRef.current) return;
    let index = allItems.findIndex(item => item.path === targetPath || (item.path !== '/' && targetPath.startsWith(item.path)));
    if (index < 0) index = 0;

    if (mobile) {
      const [left, right] = geometry.boards[open ? Math.min(index, geometry.boards.length - 1) : 0];
      setTarget({
        x: (left.x + right.x) / 2 + geometry.boardW / 2 + 18,
        y: open ? 150 + index * 45 : left.y - 12,
        path: targetPath,
        index,
      });
      return;
    }

    const [left, right] = geometry.boards[index];
    const center = (left.x + right.x) / 2;
    const x = center + (center < width / 2 ? 1 : -1) * (geometry.boardW / 2 + 20);
    const point = findPathPoint(pathRef.current, x);
    setTarget({ x, y: point.y - 12, path: targetPath, index });
  }, [allItems, geometry, mobile, open, pathRef, targetPath, width]);

  return { hoverPath, setHoverPath, target };
}

function SquirrelArt({ state, facingRight, reduced }) {
  const running = state === 'run';
  const landing = state === 'land';
  const tailAnimation = reduced ? undefined : running
    ? { rotate: [-8, 10, -8], scale: [1, 1.04, 1] }
    : { rotate: [-3, 5, -3], scale: [1, 1.025, 1] };

  return (
    <motion.svg viewBox="0 0 120 120" width="78" height="78" aria-hidden="true" style={{ overflow: 'visible', scaleX: facingRight ? 1 : -1 }}>
      <defs>
        <linearGradient id="squirrel-fur" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffad37"/><stop offset=".55" stopColor="#ef7022"/><stop offset="1" stopColor="#bd461c"/></linearGradient>
        <linearGradient id="squirrel-tail" x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#ffba43"/><stop offset=".5" stopColor="#f36c20"/><stop offset="1" stopColor="#b93e1b"/></linearGradient>
        <linearGradient id="squirrel-belly" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff2cd"/><stop offset="1" stopColor="#ffd49c"/></linearGradient>
        <filter id="squirrel-shadow" x="-40%" y="-35%" width="180%" height="190%"><feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#743819" floodOpacity=".26"/></filter>
      </defs>
      {running && !reduced && <motion.g animate={{ opacity: [0, .55, 0], x: [0, -18, -30] }} transition={{ repeat: Infinity, duration: .45 }}><path d="M23 80h-16M25 88H1M28 96H11" stroke="#f6b44b" strokeWidth="3" strokeLinecap="round" opacity=".75"/></motion.g>}
      <g filter="url(#squirrel-shadow)">
        <motion.g style={{ transformOrigin: '42px 71px' }} animate={tailAnimation} transition={{ duration: running ? .38 : 2.2, repeat: Infinity, ease: 'easeInOut' }}>
          <path d="M40 75C4 70 5 29 35 13c27-15 50 10 34 31-7 10-20 13-25 23 14-7 26-14 38-2 14 15 0 42-23 39-18-2-29-14-19-29Z" fill="url(#squirrel-tail)" stroke="#a93c1c" strokeWidth="2.5"/>
          <path d="M33 23c16-11 31-2 28 12-3 13-16 13-26 26" fill="none" stroke="#ffd477" strokeWidth="5" strokeLinecap="round" opacity=".82"/>
          <path d="M22 42c7-10 15-15 27-16" fill="none" stroke="#fff0af" strokeWidth="3" strokeLinecap="round" opacity=".66"/>
        </motion.g>
        <motion.g animate={running && !reduced ? { y: [0, -3, 0] } : landing ? { y: [0, 5, 0] } : { y: [0, -1.5, 0] }} transition={{ duration: running ? .28 : landing ? .34 : 2.4, repeat: running || !reduced ? Infinity : 0, ease: 'easeInOut' }}>
          <path d="M41 65c-6-27 8-43 28-43 22 0 34 16 28 44l-8 31H48Z" fill="url(#squirrel-fur)" stroke="#a93c1c" strokeWidth="2.5"/>
          <ellipse cx="71" cy="78" rx="17" ry="24" fill="url(#squirrel-belly)"/>
          <motion.g animate={running && !reduced ? { rotate: [-26, 24, -26] } : undefined} transition={{ duration: .28, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '56px 92px' }}><path d="M58 87c-12 7-13 19-6 23 6 4 18-2 20-9" fill="none" stroke="#c54e20" strokeWidth="9" strokeLinecap="round"/><path d="M55 103c6 3 11 1 16-4" stroke="#ffe2ae" strokeWidth="4" strokeLinecap="round"/></motion.g>
          <motion.g animate={running && !reduced ? { rotate: [24, -26, 24] } : undefined} transition={{ duration: .28, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '83px 92px' }}><path d="M84 88c14 5 16 16 9 22-6 5-18 0-21-8" fill="none" stroke="#c54e20" strokeWidth="9" strokeLinecap="round"/><path d="M78 103c6 4 12 2 17-2" stroke="#ffe2ae" strokeWidth="4" strokeLinecap="round"/></motion.g>
          <path d="M50 61c-8 2-15 10-13 17 2 8 11 5 17-2M91 60c9 1 16 8 15 15-1 8-11 6-17-1" fill="none" stroke="#e96b28" strokeWidth="8" strokeLinecap="round"/>
          <path d="M40 49c-5-19 4-32 16-35l8 14M87 27l10-17c9 8 11 25 4 37" fill="url(#squirrel-fur)" stroke="#a93c1c" strokeWidth="2.5" strokeLinejoin="round"/>
          <ellipse cx="71" cy="47" rx="27" ry="25" fill="url(#squirrel-fur)" stroke="#a93c1c" strokeWidth="2.5"/>
          <ellipse cx="71" cy="57" rx="19" ry="14" fill="url(#squirrel-belly)"/>
          <motion.g animate={reduced ? undefined : { scaleY: [1, 1, .12, 1, 1] }} transition={{ duration: 4.7, repeat: Infinity, times: [0, .7, .73, .77, 1] }} style={{ transformOrigin: '71px 44px' }}><ellipse cx="61" cy="44" rx="8" ry="9" fill="#fffdf4"/><ellipse cx="82" cy="44" rx="8" ry="9" fill="#fffdf4"/><circle cx="63" cy="46" r="4.2" fill="#39231b"/><circle cx="80" cy="46" r="4.2" fill="#39231b"/><circle cx="64" cy="44" r="1.4" fill="white"/><circle cx="81" cy="44" r="1.4" fill="white"/></motion.g>
          <path d="M67 55q4-4 8 0" fill="none" stroke="#8d3b28" strokeWidth="2" strokeLinecap="round"/><path d="M67 65q5 5 11 0" fill="none" stroke="#8d3b28" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="71" cy="56" r="3.3" fill="#6e3023"/><path d="M48 36q7-5 12-1M80 34q8-4 13 2" fill="none" stroke="#8d3b28" strokeWidth="3" strokeLinecap="round"/>
        </motion.g>
      </g>
      {landing && <motion.path initial={{ opacity: 0, scale: .4 }} animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 1.2] }} transition={{ duration: .65 }} d="M100 25l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#ffcf3c"/>}
    </motion.svg>
  );
}

export function SquirrelMascot({ target, pathRef, mobile }) {
  const reduced = useReducedMotion();
  const [state, setState] = useState('idle');
  const [facingRight, setFacingRight] = useState(true);
  const initialised = useRef(false);
  const stateTimer = useRef();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 125, damping: 18, mass: .72 });
  const y = useSpring(rawY, { stiffness: 125, damping: 18, mass: .72 });

  useEffect(() => () => clearTimeout(stateTimer.current), []);

  useEffect(() => {
    const unsubscribe = x.on('change', value => {
      if (!pathRef.current || mobile || state !== 'run') return;
      const point = findPathPoint(pathRef.current, value);
      rawY.set(point.y - 16 - Math.abs(Math.sin(value / 25)) * 5);
    });
    return unsubscribe;
  }, [mobile, pathRef, rawY, state, x]);

  useEffect(() => {
    if (!target) return undefined;
    clearTimeout(stateTimer.current);
    if (!initialised.current) {
      rawX.set(target.x);
      rawY.set(target.y);
      initialised.current = true;
      return undefined;
    }
    const distance = target.x - x.get();
    setFacingRight(distance >= 0);
    rawX.set(target.x);
    rawY.set(target.y);
    if (reduced || Math.abs(distance) < 5) {
      setState('idle');
      return undefined;
    }
    setState('run');
    const journey = Math.min(1250, Math.max(460, Math.abs(distance) * 1.65));
    stateTimer.current = setTimeout(() => {
      setState('land');
      window.dispatchEvent(new CustomEvent('squirrelLand', { detail: { path: target.path } }));
      stateTimer.current = setTimeout(() => setState('idle'), 680);
    }, journey);
    return () => clearTimeout(stateTimer.current);
  }, [rawX, rawY, reduced, target, x]);

  return (
    <motion.div
      className="bn-squirrel"
      style={{ x, y, marginLeft: -39, marginTop: -60, pointerEvents: 'none', position: 'absolute', top: 0, left: 0, zIndex: 55, willChange: 'transform' }}
    >
      <SquirrelArt state={state} facingRight={facingRight} reduced={reduced}/>
    </motion.div>
  );
}
