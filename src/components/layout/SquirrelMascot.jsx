import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useSpring, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';

export function useBranchTarget(geometry, width, mobile, allItems, open, pathRef) {
  const location = useLocation();
  const [hoverPath, setHoverPath] = useState(null);
  const targetPath = hoverPath || location.pathname;
  
  const [target, setTarget] = useState(null);

  useEffect(() => {
    if (!geometry || !pathRef.current) return;
    
    let index = allItems.findIndex(item => item.path === targetPath || (item.path !== '/' && targetPath.startsWith(item.path)));
    if (index === -1) index = 0;

    let targetX = width / 2;
    let targetY = 0;
    
    if (mobile) {
      if (open) {
        const menuBoardX = (geometry.boards[0][0].x + geometry.boards[0][1].x) / 2;
        targetX = menuBoardX + 70;
        targetY = 150 + index * 45;
      } else {
        const menuBoardX = (geometry.boards[0][0].x + geometry.boards[0][1].x) / 2;
        targetX = menuBoardX + geometry.boardW / 2 + 16;
        targetY = geometry.boards[0][0].y - 5;
      }
    } else {
      const anchors = geometry.boards[index];
      const boardCenter = (anchors[0].x + anchors[1].x) / 2;
      const onRight = boardCenter < width / 2;
      targetX = boardCenter + (onRight ? 1 : -1) * (geometry.boardW / 2 + 16);
      
      const path = pathRef.current;
      let lo = 0, hi = path.getTotalLength();
      for (let i = 0; i < 20; i++) {
        const mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).x < targetX) lo = mid; else hi = mid;
      }
      targetY = path.getPointAtLength((lo + hi) / 2).y - 12;
    }

    setTarget({ x: targetX, y: targetY, path: targetPath, index });
  }, [geometry, targetPath, width, mobile, open, allItems, pathRef]);

  return { hoverPath, setHoverPath, target };
}

export function SquirrelMascot({ target, monkeyX, pathRef, mobile }) {
  const reduced = useReducedMotion();
  const [state, setState] = useState('idle');
  const [facingRight, setFacingRight] = useState(true);
  
  const x = useMotionValue(target ? target.x : 0);
  const y = useMotionValue(target ? target.y : 0);
  
  const isFirstRender = useRef(true);

  const springX = useSpring(x, { stiffness: 170, damping: 18, mass: 1 });
  
  const hopY = useTransform(springX, currentX => {
    if (mobile || !monkeyX || state !== 'run') return 0;
    const dist = Math.abs(currentX - monkeyX);
    if (dist < 100) {
      return -40 * (1 - (dist / 100) ** 2);
    }
    return 0;
  });

  useEffect(() => {
    const unsub = springX.on('change', currentX => {
      if (!pathRef.current || mobile || state !== 'run') return;
      
      const path = pathRef.current;
      let lo = 0, hi = path.getTotalLength();
      for (let i = 0; i < 15; i++) {
        const mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).x < currentX) lo = mid; else hi = mid;
      }
      const p = path.getPointAtLength((lo + hi) / 2);
      
      const hop = Math.abs(Math.sin((currentX / 30) * Math.PI)) * 4;
      y.set(p.y - 12 - hop);
    });
    return unsub;
  }, [springX, pathRef, mobile, y, state]);

  useEffect(() => {
    if (!target) return;
    
    if (isFirstRender.current) {
      x.set(target.x);
      y.set(target.y - 100);
      setTimeout(() => y.set(target.y), 10);
      isFirstRender.current = false;
      return;
    }

    if (reduced) {
      x.set(target.x);
      y.set(target.y);
      return;
    }

    const startX = springX.get();
    const destX = target.x;
    if (Math.abs(startX - destX) < 2) return;

    const goingRight = destX > startX;
    setFacingRight(goingRight);
    
    setState('anticipate');
    
    const timeout = setTimeout(() => {
      setState('run');
      springX.set(destX);
      
      if (mobile) y.set(target.y);
      
      const checkSettle = setInterval(() => {
        if (Math.abs(springX.get() - destX) < 2 && Math.abs(springX.getVelocity()) < 10) {
          clearInterval(checkSettle);
          setState('look');
          if (!mobile) y.set(target.y);
          setTimeout(() => setState('idle'), 800);
          
          window.dispatchEvent(new CustomEvent('squirrelLand', { detail: { path: target.path } }));
        }
      }, 50);
      
      return () => clearInterval(checkSettle);
    }, 120);

    return () => clearTimeout(timeout);
  }, [target, reduced, mobile, springX, x, y]);

  useEffect(() => {
    if (state !== 'idle') return;
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        setState('acorn');
        setTimeout(() => {
          setState(prev => prev === 'acorn' ? 'idle' : prev);
        }, 2000);
      }
    }, 6000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [state]);

  let sprite = '/mascot/squirrel-sit.png';
  if (state === 'run') sprite = '/mascot/squirrel-run.png';
  if (state === 'look' || state === 'anticipate') sprite = '/mascot/squirrel-look.png';
  if (state === 'acorn') sprite = '/mascot/squirrel-acorn.png';

  const scaleY = state === 'idle' ? [1, 1.02, 1] : state === 'anticipate' ? 0.94 : 1;
  const scaleX = state === 'anticipate' ? 1.06 : 1;
  const finalScale = mobile ? 0.6 : 1;

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        x: springX,
        y: useTransform(() => y.get() + hopY.get()),
        pointerEvents: 'none',
        zIndex: 50,
        willChange: 'transform'
      }}
    >
      <motion.img
        src={sprite}
        alt=""
        animate={{ 
          scaleY, 
          scaleX: facingRight ? scaleX * finalScale : -scaleX * finalScale
        }}
        transition={state === 'idle' ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : { duration: 0.1 }}
        style={{
          width: 50,
          height: 50,
          objectFit: 'contain',
          transformOrigin: 'bottom center',
          display: 'block',
          marginLeft: -25,
          marginTop: -50,
          willChange: 'transform'
        }}
      />
      {state === 'run' && !mobile && (
        <div style={{
          position: 'absolute',
          bottom: 0, left: -10, width: 20, height: 4,
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '50%',
          filter: 'blur(2px)'
        }} />
      )}
    </motion.div>
  );
}
