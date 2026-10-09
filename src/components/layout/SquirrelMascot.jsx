import { useLayoutEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

// Articulated vector layers; the planted feet are at (95,130).
function SquirrelArt() {
  return <svg viewBox="0 0 160 140" aria-hidden="true">
    <defs>
      <linearGradient id="sq-fur" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffc26a"/><stop offset=".4" stopColor="#ef8b2e"/><stop offset="1" stopColor="#ac4217"/></linearGradient>
      <linearGradient id="sq-tail" x1="0" y1="0" x2="1" y2=".8"><stop stopColor="#ffe09a"/><stop offset=".3" stopColor="#f8a447"/><stop offset=".75" stopColor="#d56624"/><stop offset="1" stopColor="#a34019"/></linearGradient>
    </defs>
    <g className="sq-facing"><g className="sq-body">
      <g className="sq-tail">
        <path d="M76 109C48 115 35 91 34 71C34 52 20 58 19 71C4 60 5 37 19 23L14 21L25 16L22 12L35 12L34 8C74 6 88 31 79 54C72 72 53 86 76 109Z" fill="url(#sq-tail)" stroke="#b75a26" strokeWidth="1.3"/>
        <path d="M69 103C40 92 51 62 35 48C23 39 15 51 19 65C8 47 22 27 39 31C67 38 40 74 69 103" fill="#ffe1a0" opacity=".78"/>
        <path d="M24 23Q50 9 67 31M20 29Q45 15 64 36M39 19Q64 22 68 44" fill="none" stroke="#ffd17b" strokeWidth="2" opacity=".6"/>
      </g>
      <g className="sq-leg sq-leg-far"><path d="M86 106Q91 119 82 126L97 128" fill="none" stroke="#9f411c" strokeWidth="9" strokeLinecap="round"/></g>
      <g className="sq-arm sq-arm-far"><path d="M111 84Q119 104 127 117" fill="none" stroke="#b45322" strokeWidth="8" strokeLinecap="round"/></g>
      <path d="M76 76Q89 62 106 75Q120 89 112 116Q103 133 80 124Q59 119 67 98Z" fill="url(#sq-fur)" stroke="#a9481d" strokeWidth="1.4"/>
      <path d="M101 81Q115 88 108 113Q102 124 91 118Q81 110 90 93Z" fill="#fff0c8"/>
      <g className="sq-leg sq-leg-near"><ellipse cx="78" cy="111" rx="15" ry="16" fill="url(#sq-fur)"/><path d="M77 117Q73 129 88 128L96 128" fill="none" stroke="#c26828" strokeWidth="8" strokeLinecap="round"/><path d="M85 127h9" stroke="#f5b45c" strokeWidth="2" strokeLinecap="round"/></g>
      <g className="sq-arm sq-arm-near"><path d="M99 87Q90 101 106 104" fill="none" stroke="#a94a20" strokeWidth="10" strokeLinecap="round"/><path d="M99 86Q92 99 107 101" fill="none" stroke="#f6a449" strokeWidth="7" strokeLinecap="round"/><ellipse cx="109" cy="102" rx="6" ry="4" fill="#ffe0a5"/></g>
      <g className="sq-head" id="sq-head-art">
        <path d="M91 53Q81 38 89 24L92 19L96 26Q108 33 104 48M114 45Q109 27 117 19L121 32L123 47" fill="url(#sq-fur)" stroke="#a64b21" strokeWidth="1.4"/>
        <path d="M91 31L95 43L91 42ZM117 29L119 41L115 40Z" fill="#ffd4a0"/>
        <path d="M86 49Q99 34 116 42Q133 47 132 63L141 69Q143 80 127 85Q108 93 94 80Q79 71 86 49Z" fill="url(#sq-fur)" stroke="#ab4c21" strokeWidth="1.2"/>
        <path d="M93 66Q102 57 111 69Q120 77 133 67L142 71Q145 80 125 85Q105 87 93 76Z" fill="#ffeac2"/>
        <g className="sq-eye"><ellipse cx="117" cy="57" rx="9" ry="12" fill="#fff8e9"/><ellipse cx="120" cy="58" rx="5.5" ry="8" fill="#482519"/><ellipse cx="122" cy="54" rx="2.3" ry="3" fill="white"/></g>
        <path d="M108 43Q116 37 123 45" fill="none" stroke="#884019" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="139" cy="68" rx="4" ry="3" fill="#522c22"/>
        <path d="M123 76Q130 80 135 74" fill="none" stroke="#84432b" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M128 78v4l4-1v-3" fill="white"/><path d="M88 62l-5 5 6 1-4 5 8-1" fill="#fbbb69"/>
      </g>
    </g>
    <g className="sq-gallop">
      <g className="sq-run-tail"><path d="M73 108C43 104 36 72 4 83C13 42 48 42 64 66Q73 89 83 102Z" fill="url(#sq-tail)" stroke="#b75a26" strokeWidth="1.3"/><path d="M7 81Q35 60 72 102Q45 78 7 81" fill="#ffe1a0"/></g>
      <g className="sq-run-back far"><path d="M78 109l-11 10 14 8" fill="none" stroke="#a64a20" strokeWidth="8" strokeLinecap="round"/></g>
      <g className="sq-run-front far"><path d="M113 105l5 14 16 7" fill="none" stroke="#a64a20" strokeWidth="7" strokeLinecap="round"/></g>
      <path d="M67 100Q83 88 113 98L124 108Q104 121 78 116Q65 115 67 100Z" fill="url(#sq-fur)" stroke="#aa4c20"/>
      <path d="M83 111Q100 115 118 106L117 113Q97 121 83 116Z" fill="#ffe9be"/>
      <g className="sq-run-back"><path d="M78 109l-11 10 14 8" fill="none" stroke="#d7752b" strokeWidth="9" strokeLinecap="round"/></g>
      <g className="sq-run-front"><path d="M113 105l5 14 16 7" fill="none" stroke="#e78a37" strokeWidth="8" strokeLinecap="round"/><ellipse cx="134" cy="127" rx="5" ry="3" fill="#ffd495"/></g>
      <use href="#sq-head-art" transform="translate(13 27) scale(.95)"/>
    </g></g>
  </svg>;
}

export function SquirrelMascot({containerRef,pathRef,selected,layoutKey,mobile}) {
  const ref=useRef(null), simulation=useRef({x:null,v:0}), destination=useRef(selected);
  const reduced=useReducedMotion();
  useLayoutEffect(()=>{destination.current=selected;},[selected]);
  useLayoutEffect(()=>{
    const node=ref.current, container=containerRef.current, path=pathRef.current;
    if(!node||!container||!path)return;
    let frame,previous=0,points=[],signs=[],landingUntil=0,disposed=false,lastPaint='';
    const state=simulation.current;
    const measure=()=>{
      const box=container.getBoundingClientRect(), matrix=path.getScreenCTM(), length=path.getTotalLength();
      if(!matrix)return;
      points=Array.from({length:201},(_,i)=>{const p=path.getPointAtLength(length*i/200);const q=new DOMPoint(p.x,p.y-12).matrixTransform(matrix);return{x:q.x-box.left,y:q.y-box.top};});
      signs=[...container.querySelectorAll('[data-nav-id]')].map(el=>{const r=el.getBoundingClientRect();return{id:el.dataset.navId,x:r.left+r.width/2-box.left,el};});
    };
    const yAt=x=>{
      const index=points.findIndex(p=>p.x>=x), bIndex=Math.max(1,index<0?points.length-1:index);
      const b=points[bIndex],a=points[bIndex-1];
      return a.y+(b.y-a.y)*Math.max(0,Math.min(1,(x-a.x)/(b.x-a.x||1)));
    };
    const paint=phase=>{
      const stamp=`${phase}-${state.x.toFixed(2)}-${yAt(state.x).toFixed(2)}-${state.facing}`;
      if(stamp===lastPaint)return;
      lastPaint=stamp;
      node.dataset.phase=phase;
      node.style.transform=`translate3d(${state.x}px,${yAt(state.x)}px,0)`;
      node.style.setProperty('--face',state.facing||1);
      node.dataset.x=state.x.toFixed(2);node.dataset.y=yAt(state.x).toFixed(2);
      for(const sign of signs)sign.el.dataset.passing=String(phase==='run'&&Math.abs(sign.x-state.x)<45);
      node.style.visibility='visible';
    };
    measure();
    const tick=time=>{
      const dt=Math.min((time-(previous||time))/1000,.032);previous=time;
      const target=signs.find(s=>s.id===destination.current);
      if(target&&points.length){
        if(state.x===null||reduced){state.x=target.x;state.v=0;landingUntil=0;paint('idle');}
        else {
          const delta=target.x-state.x;
          // Damped travel preserves velocity on a mid-stride retarget; no arrival timers.
          state.v+=(52*delta-14.5*state.v)*dt;state.x+=state.v*dt;
          if(Math.abs(delta)>.6||Math.abs(state.v)>3){
            state.facing=Math.abs(state.v)>8?Math.sign(state.v):state.facing;
            state.moving=true;landingUntil=0;paint('run');
          } else {
            state.x=target.x;state.v=0;
            if(state.moving){state.moving=false;landingUntil=time+280;}
            paint(time<landingUntil?'land':'idle');
          }
        }
      }
      frame=requestAnimationFrame(tick);
    };
    const observer=new ResizeObserver(measure);observer.observe(container);
    for(const sign of signs)observer.observe(sign.el);
    document.fonts.ready.then(()=>{if(!disposed)measure();});
    frame=requestAnimationFrame(tick);
    return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();};
  },[containerRef,pathRef,layoutKey,reduced]);
  return <div ref={ref} className={`bn-squirrel${mobile?' bn-squirrel-mobile':''}`} aria-hidden="true" data-phase="idle"><SquirrelArt/></div>;
}
