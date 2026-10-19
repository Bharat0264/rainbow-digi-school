// All paths are in the original image's coordinates. The artwork is never edited.
const ART = {
  desktop: { width:2172, height:430, hole:[1041,233,28], sill:276, edges:[943,1223], rest:650,
    surface:[[0,230],[180,255],[300,294],[450,293],[570,282],[720,290],[830,290],[920,289],[1040,305],[1190,305],[1320,290],[1450,290],[1590,298],[1770,290],[1920,264],[2090,219],[2172,210]] },
  compact: { width:1536, height:1024, hole:[720,340,37], sill:401, edges:[600,971], rest:350,
    surface:[[0,375],[180,400],[300,426],[460,450],[580,434],[650,442],[925,442],[1050,460],[1170,454],[1300,419],[1430,382],[1536,370]] },
};
const lerp = (a,b,t) => a+(b-a)*t;
const smooth = t => t*t*(3-2*t);
const clamp = t => Math.max(0,Math.min(1,t));
// Measured alpha bounds of gait frames 1–4 in the existing 128px cells:
// x=14..113, paws end at y=119; the head centre is approximately (94,70).
// Place the paw baseline, not the padded image rectangle, on the bark/sill.
const SPRITE = { cell:128, centre:64, feet:120, headY:70, extent:50, insideScale:.92 };

/** One small transparent canvas and one RAF; no video or artwork replacement. */
export function createSquirrelAnimation(canvas) {
  const context = canvas.getContext('2d'), sprite = new Image(), portalSprite = new Image();
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let layout, pose, activity, anchor, raf=0, disposed=false;
  let state='inside', target='house', side=1, entryProgress=1, distance=0;
  let visible=true, pausedAt=0, lastFrame=0;
  let peekAt=0, peekTimer=0;
  const source = () => ART[layout.art.compact ? 'compact' : 'desktop'];
  const bodySize = () => Math.min(layout.size,layout.art.width/source().width*104);
  const baseScale = () => bodySize()/layout.size;
  function surface(u) {
    const art=source(), x=clamp(u)*art.width;
    const i=Math.max(1,art.surface.findIndex(p=>p[0]>=x));
    const a=art.surface[i-1], b=art.surface[i];
    return lerp(a[1],b[1],(x-a[0])/(b[0]-a[0]))/art.height;
  }
  function doorway() {
    const art=source(), [x,y,r]=art.hole;
    return {u:x/art.width,v:y/art.height,r:r/art.width*layout.art.width};
  }
  function contact() {
    const door=doorway();
    return {u:door.u-side*(door.r+bodySize()*SPRITE.extent/SPRITE.cell)/layout.art.width,
      v:source().sill/source().height,scale:1,direction:side};
  }
  function branchEnd() {
    const art=source(), u=(art.edges[side===1?0:1]-side*40)/art.width;
    return {u,v:surface(u),scale:1,direction:side};
  }
  function boardPosition(request) {
    const board=request.resolve?.()?.getBoundingClientRect();
    if (board) {
      const nav=canvas.parentElement.getBoundingClientRect();
      request.u=(board.left-nav.left+board.width/2-layout.art.x)/layout.art.width;
    }
    const margin=bodySize()/2/layout.art.width;
    const u=Math.max(margin,Math.min(1-margin,request.u??pose.u));
    return {u,v:surface(u),scale:1,direction:pose.direction};
  }
  function entrancePose(progress) {
    const door=doorway(), start=contact(), scale=lerp(1,SPRITE.insideScale,progress);
    const paddedExtent=bodySize()*SPRITE.extent/SPRITE.cell*SPRITE.insideScale;
    // Both the muzzle on exit and trailing tail on entry finish beyond the
    // opening's far rim, with a one-native-pixel antialiasing allowance.
    const inside=door.u+side*(door.r+paddedExtent+layout.art.width/source().width)/layout.art.width;
    const headHeight=bodySize()*(SPRITE.feet-SPRITE.headY)/SPRITE.cell*scale;
    return {u:lerp(start.u,inside,progress),
      v:lerp(start.v,door.v+headHeight/layout.art.height,smooth(Math.min(1,progress*3))),
      scale,direction:state==='exitingHouse'?-side:side};
  }
  function exitStartProgress() {
    // Place the emerging head where the initial peek is, without a hidden jump.
    const door=doorway(), body=bodySize(), extent=body*SPRITE.extent/128;
    const outside=door.r+extent, inside=door.r+extent*SPRITE.insideScale+layout.art.width/source().width;
    const head=body*30/128;
    return clamp((outside+head)/(outside+inside+head*(1-SPRITE.insideScale)));
  }
  function showInsidePeek(now=performance.now()) {
    peekAt=now+220;
    clearTimeout(peekTimer);
    peekTimer=setTimeout(()=>{if(!disposed && state==='inside')draw(0);},225);
  }
  function draw(frame=lastFrame) {
    if (!layout || !pose) return;
    lastFrame=frame;
    const {art,size}=layout, door=doorway(), unit=128/size;
    const peeking=state==='inside' && performance.now()>=peekAt;
    const renderPose=peeking?{u:door.u,v:door.v+door.r*.95/art.height,scale:.9,direction:1}:pose;
    const x=art.x+renderPose.u*art.width, y=art.y+renderPose.v*art.height;
    const left=x-size/2, top=y-size*120/128;
    context.clearRect(0,0,128,128);
    if ((state!=='inside'||peeking) && sprite.complete && sprite.naturalWidth) {
      context.save();
      // Clip only the squirrel. The untouched window rim/wall stays in front.
      // The outside half-plane joins the actual dark circular opening.
      if (state==='enteringHouse' || state==='exitingHouse' || peeking) {
        const cx=(art.x+door.u*art.width-left)*unit;
        const cy=(art.y+door.v*art.height-top)*unit, r=door.r*unit;
        context.beginPath();
        if (!peeking) {
          if (side===1) context.rect(-512,-512,cx-r+512,1536);
          else context.rect(cx+r,-512,1536,1536);
        }
        context.moveTo(cx+r,cy); context.arc(cx,cy,r,0,Math.PI*2); context.clip();
      }
      // Appear from outside the branch image; never pop into its middle.
      context.beginPath();
      context.rect((art.x-left)*unit,-512,art.width*unit,1536); context.clip();
      const moving=state==='approaching'||state==='boardMoving';
      const bounce=moving ? Math.sin(distance/18*Math.PI)**2*1.5 : 0;
      context.translate(64,120-bounce);
      const scale=renderPose.scale*baseScale();
      context.scale(renderPose.direction*scale,scale);
      // Tilt into the opening while the head leads and the tail follows.
      if (state==='climbing' || state==='descending') {
        context.rotate(Math.sin(activity.progress*Math.PI)*(state==='climbing'?-.16:.12));
      }
      if (portalSprite.naturalWidth && (peeking||state==='enteringHouse')) {
        const cell=peeking?3:(entryProgress>.67?2:(entryProgress>.2?1:0));
        context.drawImage(portalSprite,cell*256,0,256,256,-64,-120,128,128);
      } else context.drawImage(sprite,frame*128,0,128,128,-64,-120,128,128);
      context.restore();
    }
    canvas.style.transform=`translate3d(${left}px,${top}px,0)`;
    Object.assign(canvas.dataset,{state,target,direction:String(pose.direction),frame:String(frame),
      x:String(x),y:String(y),scale:String(pose.scale),surfaceY:String(art.y+surface(pose.u)*art.height),
      doorX:String(art.x+door.u*art.width),doorY:String(art.y+door.v*art.height),doorRadius:String(door.r),
      progress:String(activity?.progress??1),entryProgress:String(entryProgress),peeking:String(peeking)});
  }
  function begin(kind,request,now=performance.now(),duration=1000) {
    activity={kind,request,from:{...pose},started:now,duration:Math.max(1,duration),entryFrom:entryProgress,progress:0};
    state=kind;
  }
  function finish() {
    activity=null; draw(0);
  }
  function advance(now) {
    if (!activity || disposed) return;
    const current=activity, t=clamp((now-current.started)/current.duration), eased=smooth(t);
    current.progress=t;
    const previousU=pose.u;
    if (current.kind==='boardMoving' || current.kind==='approaching') {
      const end=current.kind==='boardMoving' ? boardPosition(current.request) : branchEnd();
      const u=lerp(current.from.u,end.u,eased);
      pose={u,v:surface(u)+(current.from.v-surface(current.from.u))*(1-eased),scale:1,
        direction:Math.abs(end.u-current.from.u)<.0001 ? current.from.direction : Math.sign(end.u-current.from.u)};
      if (t===1) {
        if (current.kind==='boardMoving') { state='standing'; anchor=current.request; finish(); return; }
        const duration=Math.max(650,Math.abs(contact().u-pose.u)*source().width*3);
        begin('climbing',current.request,now,duration);
      }
    } else if (current.kind==='climbing' || current.kind==='descending') {
      const climbing=current.kind==='climbing', end=climbing?contact():branchEnd();
      // Climb to the sill before entering; on exit settle onto nearby bark
      // before the existing branch run starts. Do not drift diagonally to a tab.
      pose={u:lerp(current.from.u,end.u,eased),v:lerp(current.from.v,end.v,eased),
        scale:1,direction:climbing?side:-side};
      if (t===1) {
        if (climbing) {entryProgress=0;begin('enteringHouse',current.request,now,1250);}
        else begin('boardMoving',current.request,now,1000);
      }
    } else if (current.kind==='enteringHouse' || current.kind==='exitingHouse') {
      entryProgress=current.kind==='enteringHouse' ? lerp(current.entryFrom,1,eased) : current.entryFrom*(1-eased);
      pose=entrancePose(entryProgress);
      if (t===1) {
        if (current.kind==='enteringHouse') {
          state='inside';
          showInsidePeek(now);
          if (current.request.kind==='house') {finish();return;}
          // A new board click replaces the destination, but a partially hidden
          // squirrel finishes passing the rim before turning inside the house.
          activity=null;launch(current.request);return;
        }
        if (current.request.kind==='house') begin('enteringHouse',current.request,now,1250);
        else begin('descending',current.request,now,500);
      }
    }
    distance+=Math.abs(pose.u-previousU)*source().width;
    draw([1,2,3,4][Math.floor(distance/18)%4]);
  }
  function tick(now) {
    raf=0; advance(now);
    if (activity && !raf && !disposed && visible && !document.hidden) raf=requestAnimationFrame(tick);
  }
  function settle() {
    cancelAnimationFrame(raf); raf=0;
    const request=activity?.request;
    if (!request) return;
    if (request.kind==='house') {state='inside';entryProgress=1;pose=entrancePose(1);}
    else {pose=boardPosition(request);state='standing';anchor=request;}
    finish();
  }
  function launch(request) {
    if (!layout || disposed) return;
    // A drawer link disappears after immediate navigation; keep its measured
    // destination when finishing a portal passage before the next trip.
    if (request.kind!=='house' && !request.resolve?.() && !Number.isFinite(request.u)) return;
    target=request.kind==='house' ? 'house' : request.id;
    if (request.kind!=='house') {anchor=request;boardPosition(request);}
    // Supersede the intent without mirroring a half-occluded animal or
    // restarting a loop. The current portal passage ends before it turns.
    if (activity && (state==='enteringHouse' || state==='exitingHouse'
      || (state==='descending' && request.kind!=='house')
      || (request.kind==='house' && activity.request.kind==='house'))) {
      activity.request=request;
      draw();
      return;
    }
    cancelAnimationFrame(raf); raf=0;
    const wasInside=state==='inside', wasClimbing=state==='climbing', wasDescending=state==='descending';
    if (request.kind==='house') {
      anchor=null;
      if (wasInside) {finish();return;}
      if (wasDescending) begin('climbing',request,performance.now(),650);
      else {
        side=pose.u>doorway().u ? -1 : 1;
        // A squirrel already on the sill can climb directly to the opening.
        const end=branchEnd(), between=(pose.u-end.u)*side>=0;
        begin(between?'climbing':'approaching',request,performance.now(),
          between?650:Math.max(850,Math.abs(end.u-pose.u)*source().width*3));
      }
    } else {
      if (wasInside) {
        side=boardPosition(request).u>doorway().u?-1:1;entryProgress=exitStartProgress();
        begin('exitingHouse',request,performance.now(),900);
        pose=entrancePose(entryProgress);
      } else if (wasClimbing) begin('descending',request,performance.now(),500);
      else begin('boardMoving',request);
    }
    if (motion.matches) settle();
    else {draw(); if (visible&&!document.hidden) raf=requestAnimationFrame(tick);}
  }
  function start(input=null) {
    launch(input?{...input}:{kind:'house'});
  }
  function motionChanged() {
    if (motion.matches) settle();
  }
  function visibilityChanged() {
    const paused=!visible||document.hidden;
    if (paused && !pausedAt) {
      pausedAt=performance.now(); cancelAnimationFrame(raf);raf=0;
    } else if (!paused && pausedAt) {
      if (activity) activity.started+=performance.now()-pausedAt;
      pausedAt=0;
      if (activity) raf=requestAnimationFrame(tick);
    }
  }
  const observer=new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;visibilityChanged();
  });
  observer.observe(canvas.parentElement);
  document.addEventListener('visibilitychange',visibilityChanged);
  motion.addEventListener('change',motionChanged);
  sprite.onload=()=>{if (!disposed) draw(0);};
  sprite.src='/images/navigation/squirrel-gait-v2.webp';
  portalSprite.onload=()=>{if(!disposed)draw();};
  portalSprite.src='/images/navigation/squirrel-entry-poses.webp';
  return {
    start,
    measure(next) {
      const previous=layout&&source();
      layout=next;
      if (previous && previous!==source() && activity && ['climbing','descending'].includes(activity.kind)) {
        // Picture-source changes also change the native house position. Rebase
        // a partial climb in house-local art coordinates, not desktop pixels.
        activity.from.u=(source().hole[0]+activity.from.u*previous.width-previous.hole[0])/source().width;
        activity.from.v=(source().sill+activity.from.v*previous.height-previous.sill)/source().height;
      }
      if (!pose) pose=entrancePose(1);
      if (state==='standing') pose=anchor?{...boardPosition(anchor),direction:pose.direction}:{...pose,v:surface(pose.u)};
      else if (state==='idle') pose.v=surface(pose.u);
      else if (state==='inside') pose=entrancePose(1);
      else if (activity) {
        if (['boardMoving','approaching'].includes(activity.kind)) activity.from.v=surface(activity.from.u);
        advance(pausedAt||performance.now());
      }
      draw();
    },
    dispose() {
      disposed=true;activity=null;cancelAnimationFrame(raf);
      clearTimeout(peekTimer);portalSprite.onload=null;
      observer.disconnect();sprite.onload=null;
      motion.removeEventListener('change',motionChanged);
      document.removeEventListener('visibilitychange',visibilityChanged);
    },
  };
}
