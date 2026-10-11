// Measured dark openings in the ORIGINAL assets, not viewport coordinates.
// The desktop image is a 2172x430 crop; it does not share the compact image's Y.
const OPENINGS = {
  desktop: { width: 2172, height: 430, x: 1041, y: 233, radius: 28, restX: 830, restY: 290 },
  compact: { width: 1536, height: 1024, x: 720, y: 340, radius: 37, restX: 530, restY: 458 },
};
const APPROACH = 800;
const DURATION = 1800;
const BOARD_TRAVEL = 1100;
const BOARD_DURATION = BOARD_TRAVEL + 150;
const smooth = t => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

/** One clock owns movement, sprite frames and portal occlusion. No reset timers. */
export function createSquirrelAnimation(canvas) {
  const context = canvas.getContext('2d');
  const sprite = new Image();
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let layout, raf = 0, startTime = null, elapsed = 0, state = 'idle', disposed = false;
  let boardRequest = null;
  sprite.src = '/images/navigation/squirrel-gait-v2.webp';

  function render() {
    if (!layout) return;
    if (state === 'boardDone' && !boardRequest) {
      context.clearRect(0, 0, 128, 128);
      return;
    }
    const { art, size } = layout;
    const source = OPENINGS[art.compact ? 'compact' : 'desktop'];
    const sx = art.width / source.width, sy = art.height / source.height;
    const door = { x: art.x + source.x * sx, y: art.y + source.y * sy, r: source.radius * sy };
    const rest = { x: art.x + source.restX * sx, y: art.y + source.restY * sy };
    // The head/nose is 0.32 sprite-width ahead of the paw anchor.
    const contact = { x: door.x - size * .32, y: door.y + size * .40 };
    let x = rest.x, y = rest.y, scale = 1, frame = 0, shadow = 1, direction = 1;
    if (boardRequest) {
      const element = boardRequest.resolve();
      if (!element) { cancel(); return; }
      const board = element.getBoundingClientRect();
      const container = canvas.parentElement.getBoundingClientRect();
      const destination = { x: board.left - container.left + board.width / 2, y: board.top - container.top };
      const t = smooth(Math.min(1, elapsed / BOARD_TRAVEL));
      x = lerp(rest.x, destination.x, t);
      y = lerp(rest.y, destination.y, t) - Math.sin(Math.PI * t) * size * .45;
      direction = destination.x < rest.x ? -1 : 1;
      frame = elapsed < BOARD_TRAVEL ? [1, 2, 3, 4][Math.floor(elapsed / 90) % 4] : 0;
      shadow = t === 1 ? 1 : 0;
      canvas.dataset.destinationX = String(destination.x);
      canvas.dataset.destinationY = String(destination.y);
    } else if (state === 'approaching') {
      const t = smooth(Math.min(1, elapsed / APPROACH));
      x = lerp(rest.x, contact.x, t);
      y = lerp(rest.y, contact.y, t);
      frame = [1, 2, 3, 4][Math.floor(elapsed / 100) % 4];
      shadow = 1 - t;
    } else if (state === 'enteringHouse' || state === 'inside') {
      const t = smooth(Math.min(1, (elapsed - APPROACH) / (DURATION - APPROACH)));
      scale = lerp(1, .72, t);
      x = lerp(contact.x, door.x + door.r + size * .45, t);
      y = door.y + size * .40 * scale;
      frame = [1, 2, 3, 4][Math.floor(elapsed / 100) % 4];
      shadow = 0;
    }
    const left = x - size / 2, top = y - size * 120 / 128;
    context.clearRect(0, 0, 128, 128);
    if (state !== 'inside' && state !== 'boardDone' && sprite.complete && sprite.naturalWidth) {
      context.save();
      if (state === 'enteringHouse') {
        // View-space portal: the approaching body stays in front on the left;
        // the head crosses the opening, then the wall conceals body and tail.
        // Clipping the actual sprite prevents any leakage over the right wall.
        const unit = 128 / size;
        const cx = (door.x - left) * unit, cy = (door.y - top) * unit, r = door.r * unit;
        context.beginPath();
        context.rect(-256, -256, cx - r * .55 + 256, 768);
        context.moveTo(cx + r, cy);
        context.arc(cx, cy, r, 0, Math.PI * 2);
        context.clip();
      }
      if (shadow > 0) {
        context.beginPath(); context.ellipse(64, 120, 20, 3, 0, 0, Math.PI * 2);
        context.fillStyle = `rgba(45,22,10,${.3 * shadow})`; context.fill();
      }
      context.translate(64, 120);
      context.scale(direction * scale, scale);
      context.drawImage(sprite, frame * 128, 0, 128, 128, -64, -120, 128, 128);
      context.restore();
    }
    canvas.style.transform = `translate3d(${left}px,${top}px,0)`;
    Object.assign(canvas.dataset, { state, direction: String(direction), target: boardRequest?.id || 'house', frame: String(frame),
      elapsed: String(elapsed), x: String(x), y: String(y), doorX: String(door.x), doorY: String(door.y), doorRadius: String(door.r) });
  }
  function tick(now) {
    if (disposed) return;
    if (boardRequest) {
      elapsed = Math.min(BOARD_DURATION, now - startTime);
      state = elapsed < BOARD_TRAVEL ? 'boardMoving' : 'boardArrived';
      render();
      if (!boardRequest) return; // Target was removed (e.g. Escape closes drawer).
      if (elapsed === BOARD_DURATION) { finishBoard(); return; }
      raf = requestAnimationFrame(tick);
      return;
    }
    elapsed = Math.min(DURATION, now - startTime);
    state = elapsed < APPROACH ? 'approaching' : elapsed < DURATION ? 'enteringHouse' : 'inside';
    render();
    if (state !== 'inside') raf = requestAnimationFrame(tick);
    else raf = 0;
  }
  function finishBoard() {
    const complete = boardRequest?.complete;
    state = 'boardDone'; render();
    boardRequest = null; raf = 0;
    canvas.style.zIndex = '';
    complete?.();
  }
  function cancel() {
    cancelAnimationFrame(raf); raf = 0; boardRequest = null;
    state = 'idle'; elapsed = 0; canvas.style.zIndex = ''; render();
  }
  function start(request = null) {
    if (!layout || disposed || ['approaching', 'enteringHouse', 'boardMoving', 'boardArrived'].includes(state)) return;
    cancelAnimationFrame(raf);
    if (request) {
      if (!request.resolve()) return;
      boardRequest = request;
      elapsed = motion.matches ? BOARD_DURATION : 0;
      state = motion.matches ? 'boardArrived' : 'boardMoving';
      canvas.style.zIndex = '8'; // Above the open drawer; canvas remains pointer-events:none.
      startTime = performance.now(); render();
      if (motion.matches) finishBoard();
      else raf = requestAnimationFrame(tick);
      return;
    }
    boardRequest = null;
    elapsed = motion.matches ? DURATION : 0;
    state = motion.matches ? 'inside' : 'approaching';
    startTime = performance.now();
    render();
    if (!motion.matches) raf = requestAnimationFrame(tick);
  }
  function motionChanged() {
    if (motion.matches && boardRequest) {
      cancelAnimationFrame(raf); elapsed = BOARD_DURATION; finishBoard(); return;
    }
    if (motion.matches && (state === 'approaching' || state === 'enteringHouse')) {
      cancelAnimationFrame(raf); raf = 0; elapsed = DURATION; state = 'inside'; render();
    }
  }
  sprite.onload = () => { if (!disposed) render(); };
  motion.addEventListener('change', motionChanged);
  return {
    start,
    cancelBoard() { if (boardRequest) cancel(); },
    measure(next) { layout = next; render(); }, // Resize recomputes same timeline, never restarts it.
    dispose() { disposed = true; cancelAnimationFrame(raf); sprite.onload = null; motion.removeEventListener('change', motionChanged); },
  };
}
