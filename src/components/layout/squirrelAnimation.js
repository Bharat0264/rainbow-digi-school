// Native artwork measurements, scaled through live image bounds. Navigation X
// always comes from the clicked board; these traces describe the bark, not tabs.
const ART = {
  desktop: { width: 2172, height: 430, hole: [1041,233,28], rest: 830,
    surface: [[0,230],[180,255],[300,294],[450,293],[570,282],[720,290],[830,290],[920,289],[1040,305],[1190,305],[1320,290],[1450,290],[1590,298],[1770,290],[1920,264],[2090,219],[2172,210]] },
  compact: { width: 1536, height: 1024, hole: [720,340,37], rest: 530,
    surface: [[0,375],[180,400],[300,426],[460,450],[580,434],[650,442],[925,442],[1050,460],[1170,454],[1300,419],[1430,382],[1536,370]] },
};
const lerp = (a,b,t) => a + (b-a)*t;
const smooth = t => t*t*(3-2*t);

/** One RAF owner; the image-relative pose persists through routes and retargets. */
export function createSquirrelAnimation(canvas) {
  const context = canvas.getContext('2d'), sprite = new Image();
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let layout, pose, activity = null, anchor = null, raf = 0, disposed = false;
  let state = 'idle', target = 'rest', side = 1, entryProgress = 0;
  sprite.src = '/images/navigation/squirrel-gait-v2.webp';
  const source = () => ART[layout.art.compact ? 'compact' : 'desktop'];
  function surface(u) {
    const art = source(), x = Math.max(0,Math.min(art.width,u*art.width));
    const i = Math.max(1,art.surface.findIndex(p => p[0] >= x));
    const a = art.surface[i-1], b = art.surface[i];
    return lerp(a[1],b[1],(x-a[0])/(b[0]-a[0]))/art.height;
  }
  function doorway() {
    const art = source(), [x,y,r] = art.hole;
    return { u:x/art.width, v:y/art.height, r:r/art.height*layout.art.height };
  }
  function contact() {
    const door = doorway();
    return { u:door.u-side*layout.size*.32/layout.art.width,
      v:door.v+layout.size*.40/layout.art.height, scale:1, direction:side };
  }
  function boardPosition(request) {
    const board = request.resolve()?.getBoundingClientRect();
    if (board) {
      const nav = canvas.parentElement.getBoundingClientRect();
      request.u = (board.left-nav.left+board.width/2-layout.art.x)/layout.art.width;
    }
    // Closed mobile drawers retain their measured image-relative projection.
    // A visible desktop board takes over after the responsive breakpoint.
    const margin = layout.size/2/layout.art.width;
    const u = Math.max(margin,Math.min(1-margin,request.u ?? pose.u));
    return { u, v:surface(u), scale:1, direction:pose.direction };
  }
  function entrancePose(progress) {
    const door = doorway(), start = contact(), scale = lerp(1,.72,progress);
    return { u:lerp(start.u,door.u+side*(door.r+layout.size*.45)/layout.art.width,progress),
      v:door.v+layout.size*.40*scale/layout.art.height, scale, direction:side };
  }
  function draw(frame = 0) {
    if (!layout || !pose) return;
    const { art,size } = layout, door = doorway();
    const x = art.x+pose.u*art.width, y = art.y+pose.v*art.height;
    const left = x-size/2, top = y-size*120/128;
    context.clearRect(0,0,128,128);
    if (state !== 'inside' && sprite.complete && sprite.naturalWidth) {
      context.save();
      if (state === 'enteringHouse' || state === 'exitingHouse') {
        const unit = 128/size, cx = (art.x+door.u*art.width-left)*unit;
        const cy = (art.y+door.v*art.height-top)*unit, r = door.r*unit;
        context.beginPath();
        if (side === 1) context.rect(-256,-256,cx-r*.55+256,768);
        else context.rect(cx+r*.55,-256,768,768);
        context.moveTo(cx+r,cy); context.arc(cx,cy,r,0,Math.PI*2); context.clip();
      }
      if (['idle','standing','boardMoving'].includes(state)) {
        context.beginPath(); context.ellipse(64,120,20,3,0,0,Math.PI*2);
        context.fillStyle = 'rgba(45,22,10,.3)'; context.fill();
      }
      context.translate(64,120); context.scale(pose.direction*pose.scale,pose.scale);
      context.drawImage(sprite,frame*128,0,128,128,-64,-120,128,128);
      context.restore();
    }
    canvas.style.transform = `translate3d(${left}px,${top}px,0)`;
    const destination = anchor ? boardPosition(anchor) : null;
    Object.assign(canvas.dataset,{ state,target,direction:String(pose.direction),frame:String(frame),
      x:String(x),y:String(y),scale:String(pose.scale),surfaceY:String(art.y+surface(pose.u)*art.height),
      destinationX:destination ? String(art.x+destination.u*art.width) : '',
      destinationY:destination ? String(art.y+destination.v*art.height) : '',
      doorX:String(art.x+door.u*art.width),doorY:String(art.y+door.v*art.height),doorRadius:String(door.r) });
  }
  function begin(kind,request,now = performance.now(),duration = 1000) {
    activity = { kind,request,from:{ ...pose },started:now,duration,entryFrom:entryProgress };
    state = kind;
  }
  function complete(request) {
    const callback = request?.complete;
    if (request) request.complete = null;
    callback?.();
  }
  function advance(now) {
    if (!activity || disposed) return;
    const current = activity, t = Math.min(1,Math.max(0,(now-current.started)/current.duration)), eased = smooth(t);
    if (current.kind === 'boardMoving' || current.kind === 'approaching') {
      const end = current.kind === 'boardMoving' ? boardPosition(current.request) : contact();
      const u = lerp(current.from.u,end.u,eased);
      const startOffset = current.from.v-surface(current.from.u), endOffset = end.v-surface(end.u);
      pose = { u,v:surface(u)+startOffset*(1-eased)+endOffset*eased,
        scale:1,direction:Math.abs(end.u-current.from.u)<.0001 ? current.from.direction : Math.sign(end.u-current.from.u) };
      if (t === 1) {
        if (current.kind === 'boardMoving') {
          state = 'standing'; activity = null; anchor = current.request;
          draw(); complete(current.request); return;
        }
        entryProgress = 0;
        begin('enteringHouse',current.request,now,900);
      }
    } else if (current.kind === 'enteringHouse') {
      entryProgress = lerp(current.entryFrom,1,eased); pose = entrancePose(entryProgress);
      if (t === 1) { state = 'inside'; activity = null; draw(); complete(current.request); return; }
    } else if (current.kind === 'exitingHouse') {
      entryProgress = current.entryFrom*(1-eased); pose = entrancePose(entryProgress);
      if (t === 1) begin('boardMoving',current.request,now,1000);
    }
    draw([1,2,3,4][Math.floor((now-current.started)/90)%4]);
  }
  function tick(now) {
    raf = 0; advance(now);
    if (activity && !disposed) raf = requestAnimationFrame(tick);
  }
  function settle() {
    cancelAnimationFrame(raf); raf = 0;
    const request = activity?.request;
    if (!request) return;
    if (request.kind === 'house') { state = 'inside'; entryProgress = 1; pose = entrancePose(1); }
    else { pose = boardPosition(request); state = 'standing'; anchor = request; }
    activity = null; draw(); complete(request);
  }
  function start(input = null) {
    if (!layout || disposed) return;
    const request = input ? { ...input } : { kind:'house' };
    if (request.kind !== 'house' && !request.resolve()) return;
    if (request.kind === 'house' && activity?.request.kind === 'house') {
      activity.request.complete = request.complete || null;
      return;
    }
    cancelAnimationFrame(raf); raf = 0;
    // Retarget from the displayed pose; replacing activity discards stale routing.
    const wasInside = state === 'inside', wasEntering = state === 'enteringHouse' || state === 'exitingHouse';
    target = request.kind === 'house' ? 'house' : request.id;
    if (request.kind === 'house') {
      anchor = null;
      if (wasInside) { activity = null; complete(request); return; }
      if (wasEntering) begin('enteringHouse',request,performance.now(),900);
      else { side = pose.u > doorway().u ? -1 : 1; begin('approaching',request,performance.now(),850); }
    } else {
      anchor = request; boardPosition(request);
      if (wasInside || wasEntering) {
        if (wasInside) { side = boardPosition(request).u > doorway().u ? -1 : 1; entryProgress = 1; pose = entrancePose(1); }
        begin('exitingHouse',request,performance.now(),650);
      } else begin('boardMoving',request);
    }
    if (motion.matches) settle();
    else { draw(); raf = requestAnimationFrame(tick); }
  }
  function motionChanged() { if (motion.matches) settle(); }
  sprite.onload = () => { if (!disposed) draw(); };
  motion.addEventListener('change',motionChanged);
  return {
    start,
    cancelBoard() {
      // External routing invalidates only the pending route, not the visible pose.
      if (activity) activity.request.complete = null;
    },
    measure(next) {
      const previous = layout; layout = next;
      if (!pose) { const u = source().rest/source().width; pose = { u,v:surface(u),scale:1,direction:1 }; }
      if (state === 'standing') pose = anchor ? { ...boardPosition(anchor),direction:pose.direction } : { ...pose,v:surface(pose.u) };
      else if (state === 'idle') pose.v = surface(pose.u);
      else if (activity && previous) {
        if (['boardMoving','approaching'].includes(activity.kind)) activity.from.v = surface(activity.from.u);
        advance(performance.now());
      }
      draw();
    },
    dispose() { disposed = true; activity = null; cancelAnimationFrame(raf); sprite.onload = null; motion.removeEventListener('change',motionChanged); },
  };
}
