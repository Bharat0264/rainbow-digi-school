import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import './PageTurnBook.css';

// Invert x(t), then evaluate y(t): cubic-bezier(.645,.045,.355,1).
function paperEase(x) {
  const cubic = (t, a, b) => 3 * (1-t)**2 * t * a + 3 * (1-t) * t*t * b + t**3;
  let lo = 0, hi = 1;
  for (let i = 0; i < 14; i++) { const mid = (lo + hi) / 2; if (cubic(mid,.645,.355) < x) lo = mid; else hi = mid; }
  return cubic((lo + hi) / 2,.045,1);
}

export function PaperPage({ leaf, index, total, title }) {
  return <article className={`paper-leaf ${leaf.cover ? 'paper-hardcover' : ''}`} data-density={leaf.cover ? 'hard' : 'soft'} data-leaf={index} aria-label={leaf.cover ? `${leaf.cover} cover` : `Page ${index} of ${total}: ${leaf.label}`}>
    <div className="paper-leaf-content">
      {leaf.cover ? <div className="paper-cover-design"><img src="/logo.webp" width="1021" height="491" alt="Rainbow Digi School logo" draggable={false} /><h3>{title}</h3><p>Little moments, lasting memories</p><span>{leaf.cover === 'Back' ? 'Rainbow Digi School' : 'Our Photo Albums'}</span></div> : <>
        <header className="paper-heading"><strong>{String(index).padStart(2,'0')}</strong><span>{leaf.label}</span></header>
        <figure className="paper-photo"><img src={leaf.photos[0].src} alt={leaf.photos[0].alt} width={leaf.photos[0].width} height={leaf.photos[0].height} loading="lazy" decoding="async" draggable={false} /><figcaption>{leaf.photos[0].caption}</figcaption></figure>
        <footer className="paper-footer">Little moments, lasting memories <span>{index} / {total}</span></footer>
      </>}
    </div>
  </article>;
}

const PageTurnBook = forwardRef(function PageTurnBook({ leaves, title, index, onChange, onInteract, hintSeen }, ref) {
  const slot = useRef(null), source = useRef(null), engine = useRef(null), api = useRef(null);
  const latest = useRef({ index, onChange, onInteract });
  useEffect(() => { latest.current = { index, onChange, onInteract }; }, [index,onChange,onInteract]);
  const interacted = useRef(hintSeen), hintTimers = useRef([]), lastTurn = useRef(0), gesture = useRef(null);
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches), [mobile, setMobile] = useState(() => typeof window !== 'undefined' && matchMedia('(max-width:767px)').matches), [failed, setFailed] = useState(false);
  const reducedTimer = useRef(null);
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)'), size = matchMedia('(max-width:767px)');
    const update = () => { setReduced(motion.matches); setMobile(size.matches); };
    update(); motion.addEventListener('change', update); size.addEventListener('change', update);
    return () => { motion.removeEventListener('change', update); size.removeEventListener('change', update); clearTimeout(reducedTimer.current); };
  }, []);
  const stopHint = () => {
    if (!interacted.current) {
      interacted.current = true; hintTimers.current.forEach(clearTimeout); hintTimers.current = [];
      const flip = engine.current;
      if (flip?.getState() === 'fold_corner') { flip.getRender().finishAnimation(); flip.getFlipController().stopMove(); }
    }
    latest.current.onInteract();
  };
  useEffect(() => { if(hintSeen) stopHint(); }, [hintSeen]);
  useImperativeHandle(ref, () => ({
    move(direction) { stopHint(); api.current?.move(direction); },
    jump(target) { stopHint(); api.current?.jump(target); },
  }));

  useEffect(() => {
    let cancelled = false, book, observer, disposed = false, animationFrame, dirty = true;
    const container = slot.current;
    const paintIndex = next => latest.current.onChange(Math.max(0, Math.min(leaves.length - 1, next)));
    if (reduced || failed) {
      const crossfade = next => {
        if (next === latest.current.index) return;
        container.animate([{opacity:1},{opacity:0}], {duration:125,fill:'forwards'});
        clearTimeout(reducedTimer.current);
        reducedTimer.current = setTimeout(() => { paintIndex(next); container.animate([{opacity:0},{opacity:1}],{duration:125,fill:'forwards'}); },125);
      };
      api.current = {
        move(direction) {
          const step = mobile || latest.current.index === 0 ? 1 : 2;
          const next = Math.max(0,Math.min(leaves.length-1,latest.current.index + direction*step));
          crossfade(next);
        },
        jump(target) { crossfade(target); },
      };
      return () => { api.current = null; clearTimeout(reducedTimer.current); };
    }
    async function mount() {
      try {
        // Import only in an effect: neither the engine nor its DOM run during prerendering.
        const { PageFlip } = await import('page-flip');
        if (cancelled) return;
        const host = document.createElement('div'); host.className = 'paper-engine'; container.append(host);
        const nodes = [...source.current.children].map(node => node.cloneNode(true));
        host.append(...nodes);
        book = new PageFlip(host, { width: mobile ? 420 : 580, height: 580, size:'stretch', minWidth:mobile ? 768 : 100, maxWidth:900,
          minHeight:50, maxHeight:900, autoSize:false, usePortrait:mobile, showCover:true, startPage:latest.current.index,
          flippingTime:850, drawShadow:true, maxShadowOpacity:.35, useMouseEvents:false, showPageCorners:false,
          mobileScrollSupport:false, clickEventForward:false, swipeDistance:35 });
        // 2.0.7 has an otherwise uncancellable perpetual render loop. Attach a
        // scoped loop before loadFromHTML starts it, so closing a book releases
        // its RAF and idle books do not repaint. This adapter is version-pinned.
        const settings = book.getSettings.bind(book);
        let ownsLoop = false;
        book.getSettings = () => {
          const renderer = book.getRender();
          if (renderer && !ownsLoop) {
            ownsLoop = true;
            renderer.start = () => {
              renderer.update();
              const tick = time => {
                if(disposed) return;
                if(dirty || renderer.animation || book.getState() !== 'read') { dirty = false; renderer.render(Math.max(time,renderer.timer)); }
                animationFrame = requestAnimationFrame(tick);
              };
              animationFrame = requestAnimationFrame(tick);
            };
          }
          return settings();
        };
        engine.current = book;
        const update = next => {
          dirty = true; paintIndex(next);
          host.style.setProperty('--paper-left-stack', `${1 + 6*next/(leaves.length-1)}px`);
          host.style.setProperty('--paper-right-stack', `${7 - 6*next/(leaves.length-1)}px`);
          const visible = mobile || next===0 || next===leaves.length-1 ? [next] : [next, next+1];
          nodes.forEach((node,i) => { node.setAttribute('aria-hidden', String(!visible.includes(i))); });
        };
        book.on('flip', event => update(event.data));
        book.on('changeState', event => {
          if (disposed) return;
          dirty = true; host.dataset.state = event.data;
          if (event.data === 'read') {
            host.style.setProperty('--paper-sheen-opacity','0');
            host.querySelectorAll('.paper-leaf-content').forEach(node => node.animate([{transform:'rotateZ(-.15deg)'},{transform:'rotateZ(.08deg)'},{transform:'rotateZ(0)'}],{duration:150,easing:'ease-out'}));
          }
        });
        book.loadFromHTML(nodes);
        const shadow = book.getRender().setShadowData.bind(book.getRender());
        book.getRender().setShadowData = (pos, angle, progress, direction) => {
          shadow(pos, angle, progress, direction);
          host.style.setProperty('--paper-fold-opacity', String(.35 * Math.sin(progress / 100 * Math.PI)));
          host.style.setProperty('--paper-sheen-x', `${-100 + progress * 2}%`);
          host.style.setProperty('--paper-sheen-opacity', String(Math.sin(progress / 100 * Math.PI) * .24));
        };
        // Resample the public renderer frame list, preserving its fold geometry and
        // front/back clipping while applying the requested timing curve.
        const render = book.getRender(), start = render.startAnimation.bind(render);
        render.startAnimation = (frames, duration, done) => {
          const fast = lastTurn.current > 0 && performance.now() - lastTurn.current < 1000;
          const normalTurn = book.getState() === 'flipping';
          const time = normalTurn ? (fast ? 420 : 850) : Math.min(600,Math.max(240,duration));
          const eased = Array.from({length:120},(_,i) => () => {
            const progress = paperEase(i/119);
            frames[Math.min(frames.length-1,Math.round(progress*(frames.length-1)))]();
            host.style.setProperty('--paper-sheen-x', `${-100+progress*200}%`);
            host.style.setProperty('--paper-sheen-opacity',String(Math.sin(progress*Math.PI)*.24));
          });
          if (normalTurn) lastTurn.current = performance.now();
          render.timer = performance.now();
          dirty = true; start(eased,time,done);
        };
        api.current = {
          move(direction) { const current=book.getCurrentPageIndex(); if(direction>0 && current<leaves.length-1) book.flipNext('bottom'); else if(direction<0 && current>0) book.flipPrev('bottom'); },
          jump(target) { render.finishAnimation(); book.turnToPage(target); update(book.getCurrentPageIndex()); },
        };
        update(book.getCurrentPageIndex());
        observer = new ResizeObserver(() => { if(!disposed) {dirty=true;book.update();} }); observer.observe(container);
        if (!interacted.current) {
          const curl = () => { if(disposed || interacted.current) return; const r=book.getBoundsRect(); book.getFlipController().showCorner({x:r.left+r.width-2,y:r.height-2}); };
          const flatten = () => { if(disposed || interacted.current) return; book.getFlipController().showCorner({x:-100,y:-100}); };
          hintTimers.current = [setTimeout(curl,900),setTimeout(flatten,1500),setTimeout(curl,2200),setTimeout(flatten,2800)];
        }
      } catch (error) { if (!cancelled) { console.error('Page-turn renderer could not start',error); setFailed(true); } }
    }
    mount();
    return () => { cancelled=true; disposed=true; observer?.disconnect(); hintTimers.current.forEach(clearTimeout); engine.current=null; api.current=null; cancelAnimationFrame(animationFrame); if(book?.getUI()) { book.getUI().removeHandlers(); book.destroy(); } container.querySelector('.paper-engine')?.remove();  };
  }, [leaves,mobile,reduced,failed]);

  useEffect(() => {
    const upcoming = leaves.slice(index+1,index+3).flatMap(leaf=>leaf.photos || []);
    const images=upcoming.map(photo=>{const image=new Image();image.decoding='async';image.src=photo.src;return image;});
    return ()=>images.forEach(image=>{image.onload=null;});
  },[index,leaves]);

  const point = event => {const block=slot.current.querySelector('.stf__block')?.getBoundingClientRect() || slot.current.getBoundingClientRect();return {x:event.clientX-block.left,y:event.clientY-block.top};};
  const pointerDown = event => {
    if(event.button!==0) return;
    stopHint(); const book=engine.current, pos=point(event);
    if(book) {book.getRender().finishAnimation();book.startUserTouch(pos);}
    gesture.current={x:event.clientX,y:event.clientY,time:performance.now(),lastTime:performance.now(),lastX:event.clientX,velocity:0,pos,last:pos};
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = event => {
    const drag=gesture.current;if(!drag)return;const pos=point(event),now=performance.now();
    drag.velocity=Math.abs(event.clientX-drag.lastX)/Math.max(1,now-drag.lastTime);drag.lastTime=now;drag.lastX=event.clientX;drag.last=pos;engine.current?.userMove(pos,true);
  };
  const pointerEnd = (event,cancel=false) => {
    const drag=gesture.current;if(!drag)return;gesture.current=null;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y,book=engine.current;
    if(!book) {if(!cancel && Math.abs(dx)>35 && Math.abs(dx)>Math.abs(dy)) api.current?.move(dx<0?1:-1);else if(!cancel && Math.abs(dx)<8)api.current?.move(event.clientX<event.currentTarget.getBoundingClientRect().left+event.currentTarget.clientWidth*.25?-1:1);return;}
    if(cancel){book.userMove({x:drag.pos.x+6,y:drag.pos.y},true);book.userStop(drag.pos);return;}
    const velocity=performance.now()-drag.lastTime<100 ? drag.velocity : 0;
    if(Math.abs(dx)>35 && velocity>.55) {book.userStop(drag.last,true);api.current?.move(dx<0?1:-1);}
    else book.userStop(point(event));
  };
  const fallbackVisible = mobile || index===0 || index===leaves.length-1 ? [index] : [index,index+1].filter(i=>i<leaves.length);
  return <div className={`paper-turn-book ${mobile?'paper-single':'paper-double'}`} data-reduced={reduced || failed}>
    <div ref={source} hidden aria-hidden="true">{leaves.map((leaf,i)=><PaperPage key={leaf.id} leaf={leaf} index={i} total={leaves.length-2} title={title}/>)}</div>
    <div ref={slot} className="paper-engine-slot" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={event=>pointerEnd(event)} onPointerCancel={event=>pointerEnd(event,true)}>
      {(reduced || failed) && <div className="paper-crossfade-spread">{fallbackVisible.map(i=><PaperPage key={leaves[i].id} leaf={leaves[i]} index={i} total={leaves.length-2} title={title}/>)}</div>}
    </div>
  </div>;
});
export default PageTurnBook;
