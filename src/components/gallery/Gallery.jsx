import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, X } from 'lucide-react';
import { galleryPhotos, GALLERY_CATEGORIES } from '../../data/gallery';
import styles from './Gallery.module.css';

const PAGE_SIZE = 12;

export default function Gallery({ photos = galleryPhotos }) {
  const [category, setCategory] = useState('All');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [activeId, setActiveId] = useState(null);
  const dialog = useRef(null), closeButton = useRef(null), returnFocus = useRef(null), swipe = useRef(null);
  const filtered = category === 'All' ? photos : photos.filter(photo => photo.category === category);
  const activeIndex = filtered.findIndex(photo => photo.id === activeId);
  const current = filtered[activeIndex];
  const isOpen = Boolean(current);

  useEffect(() => {
    if (!isOpen) return;
    const viewer = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    viewer.showModal();
    closeButton.current.focus();
    return () => {
      viewer.close();
      document.body.style.overflow = previousOverflow;
      if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const close = () => setActiveId(null);
  const move = direction => setActiveId(filtered[(activeIndex + direction + filtered.length) % filtered.length].id);
  const open = (photo, event) => {
    returnFocus.current = event.currentTarget;
    setActiveId(photo.id);
  };
  const keyboard = event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Tab') {
      const controls = [...dialog.current.querySelectorAll('button:not(:disabled)')];
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  };
  const pointerDown = event => {
    if (event.pointerType !== 'touch' || event.target.closest('button')) return;
    swipe.current = { x: event.clientX, y: event.clientY };
    if (event.nativeEvent.isTrusted) event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const pointerUp = event => {
    if (!swipe.current) return;
    const dx = event.clientX - swipe.current.x, dy = event.clientY - swipe.current.y;
    swipe.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) move(dx < 0 ? 1 : -1);
  };

  return (
    <section id="gallery" className={`section site-container ${styles.section}`} aria-labelledby="gallery-heading">
      <div className={styles.heading}>
        <p className="eyebrow"><span className="eyebrow-dot" /> Little moments, lasting memories</p>
        <h2 id="gallery-heading">Our Gallery</h2>
        <p>Moments from our little world.</p>
      </div>
      {photos.some(photo => photo.placeholder) && <p className={styles.previewNote}>These replaceable previews use supplied school screenshots and our campus photograph.</p>}
      <div className={styles.filters} role="group" aria-label="Filter gallery photos">
        {GALLERY_CATEGORIES.map(name => <button key={name} type="button" className={styles.filter} aria-pressed={category === name} onClick={() => { setCategory(name); setLimit(PAGE_SIZE); }}>{name}</button>)}
      </div>
      <p className={styles.status} role="status">{filtered.length} {filtered.length === 1 ? 'photo' : 'photos'}{category === 'All' ? '' : ` in ${category}`}</p>
      <ul key={category} className={styles.grid}>
          {filtered.slice(0, limit).map((photo, index) => <li key={photo.id} data-category={photo.category}>
            <button type="button" className={styles.card} aria-label={`Open photo ${index + 1}: ${photo.caption}`} aria-haspopup="dialog" onClick={event => open(photo, event)}>
              <span className={styles.imageWrap}>
                <img src={photo.thumb} alt={photo.alt} width={photo.thumbWidth} height={photo.thumbHeight} loading="lazy" decoding="async" />
                {photo.placeholder && <span className={styles.placeholder}>Placeholder</span>}
              </span>
              <span className={styles.caption}>{photo.caption}</span>
            </button>
          </li>)}
      </ul>
      {filtered.length === 0 && <p className={styles.empty}>More little moments are on their way.</p>}
      {limit < filtered.length && <div className={styles.more}><button type="button" className={`button button-primary ${styles.loadMore}`} onClick={() => setLimit(value => value + PAGE_SIZE)}><ImagePlus size={18} aria-hidden="true" /> Load more<span className={styles.status}> photos</span></button></div>}
      <p className={styles.privacy}>Photos are shared with parental consent.</p>

      <dialog ref={dialog} className={styles.dialog} aria-labelledby="gallery-viewer-heading" aria-describedby="gallery-viewer-caption" onCancel={event => { event.preventDefault(); close(); }} onClose={close} onKeyDown={keyboard}>
        {current && <>
          <div className={styles.toolbar}>
            <h2 id="gallery-viewer-heading">Photo gallery</h2>
            <p className={styles.counter} aria-live="polite" aria-atomic="true">{activeIndex + 1} / {filtered.length}</p>
            <button ref={closeButton} type="button" className={styles.viewerButton} aria-label="Close gallery" onClick={close}><X aria-hidden="true" /></button>
          </div>
          <div className={styles.stage} onPointerDown={pointerDown} onPointerUp={pointerUp} onPointerCancel={() => { swipe.current = null; }}>
            <button type="button" className={styles.viewerButton} aria-label="Previous photo" disabled={filtered.length < 2} onClick={() => move(-1)}><ArrowLeft aria-hidden="true" /></button>
            <img key={current.id} className={styles.fullImage} src={current.src} alt={current.alt} width={current.width} height={current.height} decoding="async" draggable={false} />
            <button type="button" className={styles.viewerButton} aria-label="Next photo" disabled={filtered.length < 2} onClick={() => move(1)}><ArrowRight aria-hidden="true" /></button>
          </div>
          <div id="gallery-viewer-caption" className={styles.viewerCaption} aria-live="polite">
            <p>{current.caption}</p>
            {current.date && <time dateTime={current.date}>{new Date(`${current.date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time>}
          </div>
        </>}
      </dialog>
    </section>
  );
}
