import { useRef } from 'react';

export function trapGalleryFocus(event, root) {
  if (event.key !== 'Tab') return;
  const controls = [...root.querySelectorAll('button:not(:disabled), input, a[href], [tabindex="0"]')]
    .filter(node => node.getClientRects().length && !node.closest('[inert]'));
  const first = controls[0], last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
}

export function useGallerySwipe(onSwipe, onInteract = () => {}) {
  const gesture = useRef(null), moved = useRef(false);
  return {
    onPointerDown(event) {
      onInteract();
      moved.current = false;
      if (event.pointerType === 'touch' && !event.target.closest('[data-gallery-control]')) {
        gesture.current = { x: event.clientX, y: event.clientY };
      }
    },
    onPointerUp(event) {
      if (!gesture.current) return;
      const dx = event.clientX - gesture.current.x, dy = event.clientY - gesture.current.y;
      gesture.current = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        moved.current = true;
        onSwipe(dx < 0 ? 1 : -1);
      }
    },
    onPointerCancel() { gesture.current = null; },
    onClickCapture(event) {
      if (moved.current) { event.preventDefault(); event.stopPropagation(); moved.current = false; }
    },
  };
}
