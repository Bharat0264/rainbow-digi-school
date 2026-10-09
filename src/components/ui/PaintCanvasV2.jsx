import { memo } from 'react';
const moods = new Set(['warm', 'cobalt', 'crimson', 'footer']);
// The original SVG paint/filter output is baked into WebP once, not on scroll.
function PaintCanvasV2({ mood = 'warm', className = '', children, flip = false }) {
  const palette = moods.has(mood) ? mood : 'warm';
  return (
    <div className={`relative overflow-hidden pg-root ${className}`}>
      <div aria-hidden="true" className="pg-paint absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: `url(/paint/${palette}.webp)`, transform: flip ? 'scaleX(-1)' : undefined }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
export default memo(PaintCanvasV2);
