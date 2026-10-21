import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { PaperPage } from './PaperPage';
import './SpineBook.css';

function spreadAt(index, count, single) {
  if (single) return [index];
  if (index === 0) return [null, 0];
  if (index === count - 1) return [index, null];
  const left = 1 + Math.floor((index - 1) / 2) * 2;
  return [left, left + 1 < count ? left + 1 : null];
}

const SpineBook = forwardRef(function SpineBook({ leaves, title, index, onChange }, ref) {
  const measured = useRef(null);
  const area = useRef(null), gesture = useRef(null), timer = useRef(null), activeTurn = useRef(null);
  const latest = useRef({ index, onChange });
  useEffect(() => { latest.current = { index, onChange }; }, [index,onChange]);
  const [single,setSingle] = useState(() => matchMedia('(max-width:767px)').matches);
  const [size,setSize] = useState(null), [turn,setTurn] = useState(null);

  useLayoutEffect(() => {
    const media = matchMedia('(max-width:767px)');
    const measure = () => {
      const mobile = media.matches, box = area.current.getBoundingClientRect();
      const ratio = mobile ? 420 / 580 : 1;
      // Space for the page stack and its full desk shadow on all four sides.
      const pageWidth = Math.max(1, Math.min((box.width - 56) / (mobile ? 1 : 2), (box.height - 56) * ratio, 560));
      if (measured.current?.pageWidth === pageWidth && measured.current?.mobile === mobile) return;
      measured.current = { pageWidth, mobile };
      clearTimeout(timer.current); activeTurn.current=null; setTurn(null);
      setSingle(mobile);
      setSize({ width: pageWidth * (mobile ? 1 : 2), height: pageWidth / ratio });
    };
    measure(); const observer = new ResizeObserver(measure); observer.observe(area.current);
    media.addEventListener('change',measure);
    return () => { observer.disconnect(); media.removeEventListener('change',measure); clearTimeout(timer.current); };
  }, []);

  const cancelTurn = () => { clearTimeout(timer.current); activeTurn.current=null; setTurn(null); };
  const move = direction => {

    if (activeTurn.current) return;
    const current = latest.current.index;
    const currentSpread = spreadAt(current,leaves.length,single);
    const step = single || current === 0 ? 1 : 2;
    const target = Math.max(0,Math.min(leaves.length-1,(single ? current : currentSpread.find(value=>value!==null)) + step * direction));
    if (target===current) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const next = { from:current, to:target, direction, reduced };
    activeTurn.current=next;setTurn(next);
    timer.current=setTimeout(() => {
      activeTurn.current=null;setTurn(null);latest.current.onChange(target);
    },reduced?250:450);
  };
  useImperativeHandle(ref,()=>({move,jump(target){cancelTurn();latest.current.onChange(Math.max(0,Math.min(leaves.length-1,target)));}}));

  const current = spreadAt(index,leaves.length,single);
  const previous = turn ? spreadAt(turn.from,leaves.length,single) : current;
  const next = turn ? spreadAt(turn.to,leaves.length,single) : current;
  const resting = !turn ? current : single || turn.reduced ? next : turn.direction>0 ? [previous[0],next[1]] : [next[0],previous[1]];
  const renderPage = (leafIndex, side) => leafIndex === null || leafIndex === undefined
    ? <div className={`album-spine-blank ${side}`} aria-hidden="true" />
    : <div className={`album-spine-page ${side}`}><PaperPage leaf={leaves[leafIndex]} index={leafIndex} total={leaves.length-2} title={title}/></div>;
  const front = single ? previous[0] : turn?.direction>0 ? previous[1] : previous[0];
  const back = single ? next[0] : turn?.direction>0 ? next[0] : next[1];

  return <div ref={area} className={`album-spine-area ${single?'album-spine-single':''}`}>
    {size && <div className="album-spine-frame" style={size} data-left-page={current[0] ?? ''} data-right-page={current[1] ?? ''} data-turning={Boolean(turn)}
      onPointerDown={event=>{if(event.button!==0)return;gesture.current={x:event.clientX,y:event.clientY};event.currentTarget.setPointerCapture(event.pointerId);}}
      onPointerCancel={()=>{gesture.current=null;}}
      onPointerUp={event=>{const start=gesture.current;if(!start)return;gesture.current=null;const dx=event.clientX-start.x,dy=event.clientY-start.y;if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);else if(Math.abs(dx)<8&&Math.abs(dy)<8){const r=event.currentTarget.getBoundingClientRect();move(event.clientX<r.x+r.width/2?-1:1);}}}>
      <div className="album-spine-resting" aria-hidden={turn?true:undefined}>{resting.map((leaf,i)=><div key={i} className="album-spine-slot">{renderPage(leaf,i===0&&!single?'--left':'--right')}</div>)}</div>
      {turn && (turn.reduced ? <div className="album-spine-fade" aria-hidden="true" inert>{previous.map((leaf,i)=><div className="album-spine-slot" key={i}>{renderPage(leaf,i===0&&!single?'--left':'--right')}</div>)}</div>
        : <div className={`album-spine-sheet ${turn.direction>0?'album-spine-forward':'album-spine-backward'}`} aria-hidden="true" inert>
          <div className="album-spine-front">{renderPage(front,turn.direction>0?'--right':'--left')}</div>
          {!single && <div className="album-spine-back">{renderPage(back,turn.direction>0?'--left':'--right')}</div>}
        </div>)}
    </div>}
  </div>;
});
export default SpineBook;
