import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { trapGalleryFocus, useGallerySwipe } from './galleryInteraction';

export default function GalleryLightbox({ photos, initialIndex, onClose, opener }) {
  const [index, setIndex] = useState(initialIndex);
  const dialog = useRef(null), closeButton = useRef(null);
  const current = photos[index];
  const move = direction => setIndex(value => (value + direction + photos.length) % photos.length);
  const swipe = useGallerySwipe(move);
  useEffect(() => {
    const viewer = dialog.current;
    viewer.showModal(); closeButton.current.focus();
    return () => { viewer.close(); if (opener?.isConnected) opener.focus({ preventScroll: true }); };
  }, [opener]);
  return <dialog ref={dialog} className="gallery-lightbox" aria-label="Album photo" aria-describedby="gallery-lightbox-caption"
    onCancel={event => { event.preventDefault(); event.stopPropagation(); onClose(); }}
    onKeyDown={event => {
      event.stopPropagation();
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
      trapGalleryFocus(event, dialog.current);
    }}>
    <div className="gallery-lightbox-toolbar"><p aria-live="polite" aria-atomic="true">{index + 1} / {photos.length}</p>
      <button ref={closeButton} className="gallery-glass" type="button" aria-label="Close photo" onClick={onClose}><X aria-hidden="true" /></button></div>
    <div className="gallery-lightbox-stage" {...swipe}>
      <button className="gallery-glass" data-gallery-control type="button" aria-label="Previous photo" onClick={() => move(-1)}><ArrowLeft aria-hidden="true" /></button>
      <img key={current.id} src={current.src} alt={current.alt} width={current.width} height={current.height} decoding="async" draggable={false} />
      <button className="gallery-glass" data-gallery-control type="button" aria-label="Next photo" onClick={() => move(1)}><ArrowRight aria-hidden="true" /></button>
    </div>
    <p id="gallery-lightbox-caption" className="gallery-lightbox-caption">{current.caption}</p>
  </dialog>;
}
