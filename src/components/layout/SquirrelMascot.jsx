import { useLayoutEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export function SquirrelMascot({containerRef,pathRef,selected,layoutKey,mobile}){
  const ref=useRef(null),simulation=useRef({x:null,v:0,phase:'idle'}),destination=useRef(selected);
  const reduced=useReducedMotion();
  useLayoutEffect(()=>{destination.current=selected;},[selected]);
  useLayoutEffect(()=>{
    const node=ref.current,container=containerRef.current,path=pathRef.current;
    if(!node||!container||!path)return;
    let frame,previous=0,points=[],targets=[],disposed=false,lastPaint='',entryStart=null;
    const state=simulation.current;
    const measure=()=>{
      const box=container.getBoundingClientRect(),matrix=path.getScreenCTM(),length=path.getTotalLength();
      if(!matrix)return;
      points=Array.from({length:241},(_,i)=>{const p=path.getPointAtLength(length*i/240),q=new DOMPoint(p.x,p.y).matrixTransform(matrix);return{x:q.x-box.left,y:q.y-box.top};});
      targets=[...container.querySelectorAll('[data-nav-id]')].map(el=>{const r=el.getBoundingClientRect();return{id:el.dataset.navId,x:r.left+r.width/2-box.left,el};});
      lastPaint='';
    };
    const yAt=x=>{
      const index=points.findIndex(p=>p.x>=x),bIndex=Math.max(1,index<0?points.length-1:index),a=points[bIndex-1],b=points[bIndex];
      return a.y+(b.y-a.y)*Math.max(0,Math.min(1,(x-a.x)/(b.x-a.x||1)));
    };
    const paint=(phase,entry=0)=>{
      const y=yAt(state.x),stamp=`${phase}-${state.x.toFixed(2)}-${y.toFixed(2)}-${state.facing}-${entry.toFixed(3)}`;
      if(stamp===lastPaint)return;lastPaint=stamp;
      node.dataset.state=phase;
      node.dataset.phase=phase.startsWith('running')?'run':phase==='idle'?'idle':'enter';
      node.style.transform=`translate3d(${state.x}px,${y}px,0)`;
      node.style.setProperty('--face',state.facing||1);
      node.style.setProperty('--entry',entry);
      node.dataset.x=state.x.toFixed(2);node.dataset.y=y.toFixed(2);
      for(const sign of targets)sign.el.dataset.passing=String(phase.startsWith('running')&&sign.id!=='treehouse'&&Math.abs(sign.x-state.x)<32);
      node.style.visibility=phase==='insideTreehouse'?'hidden':'visible';
    };
    measure();
    const tick=time=>{
      const dt=Math.min((time-(previous||time))/1000,.032);previous=time;
      const target=targets.find(s=>s.id===destination.current),inside=destination.current==='treehouse';
      if(target&&points.length){
        if(!inside){entryStart=null;state.phase='idle';}
        if(state.x===null||reduced){state.x=target.x;state.v=0;paint(inside?'insideTreehouse':'idle',inside?1:0);}
        else if(inside&&entryStart!==null){
          const progress=Math.min(1,(time-entryStart)/650);state.x=target.x;
          paint(progress===1?'insideTreehouse':'enteringTreehouse',progress);
        }else{
          const delta=target.x-state.x;
          state.v+=(45*delta-13.5*state.v)*dt;state.x+=state.v*dt;
          if(Math.abs(delta)>.5||Math.abs(state.v)>2){
            state.facing=Math.abs(state.v)>8?Math.sign(state.v):state.facing;
            paint(inside?'runningToTreehouse':'runningToNavigation');
          }else{
            state.x=target.x;state.v=0;
            if(inside){entryStart=time;paint('enteringTreehouse');}else paint('idle');
          }
        }
      }
      frame=requestAnimationFrame(tick);
    };
    const observer=new ResizeObserver(measure);observer.observe(container);for(const t of targets)observer.observe(t.el);
    document.fonts.ready.then(()=>{if(!disposed)measure();});frame=requestAnimationFrame(tick);
    return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();};
  },[containerRef,pathRef,layoutKey,reduced]);
  return <div ref={ref} className={`bn-squirrel${mobile?' bn-squirrel-mobile':''}`} aria-hidden="true" data-state="idle" data-phase="idle"><div className="squirrel-facing"><div className="squirrel-sprite"/></div></div>;
}
