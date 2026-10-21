import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Grid2X2 } from 'lucide-react';
import PageTurnBook from './PageTurnBook';
import GalleryLightbox from './GalleryLightbox';
import { trapGalleryFocus } from './galleryInteraction';

export default function AlbumViewer({ album, onClose, opener, initialPage = 0 }) {
  const [pageIndex, setPageIndex] = useState(initialPage * 2 + 1);
  const [view, setView] = useState('book');
  const [closing, setClosing] = useState(false);
  const book = useRef(null);
  const [hintSeen, setHintSeen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const dialog = useRef(null), backButton = useRef(null), closeTimer = useRef(null);
  const pages = useMemo(() => album.pages.flatMap(page => page.photos.reduce((spreads, photo, index) => {
    if (index % 2 === 0) spreads.push({ ...page, id: `${page.id}-${index / 2}`, photos: [] });
    spreads[spreads.length - 1].photos.push(photo); return spreads;
  }, [])).filter(page => page.photos.length), [album]);
  const leaves = useMemo(() => [
    { id: 'front-cover', cover: 'Front', photos: [] },
    ...pages.flatMap(page => page.photos.map(photo => ({ ...page, id: `${page.id}-${photo.id}`, photos: [photo] }))),
    { id: 'back-cover', cover: 'Back', photos: [] },
  ], [pages]);
  const safeIndex = Math.min(pageIndex, leaves.length - 1);
  const pageLabel = safeIndex === 0 ? 'Front cover' : safeIndex === leaves.length - 1 ? 'Back cover' : `Page ${safeIndex} of ${leaves.length - 2}`;
  const photos = useMemo(() => pages.flatMap(page => page.photos), [pages]);

  useEffect(() => {
    const viewer = dialog.current, oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; viewer.showModal(); backButton.current.focus();
    return () => {
      clearTimeout(closeTimer.current); viewer.close(); document.body.style.overflow = oldOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
      else document.querySelector('#gallery .gallery-book')?.focus({ preventScroll: true });
    };
  }, [opener]);

  const close = () => {
    if (closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(onClose, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 140 : 600);
  };
  const move = nextDirection => { book.current?.move(nextDirection); };
  const openPhoto = (photo, element) => {
    setLightbox({ index: photos.findIndex(item => item.id === photo.id), opener: element });
  };
  return <dialog ref={dialog} className={`gallery-viewer ${closing ? 'gallery-viewer-closing' : ''}`} aria-labelledby="gallery-album-title" onPointerDownCapture={() => setHintSeen(true)}
    onCancel={event => { event.preventDefault(); close(); }}
    onKeyDown={event => {
      setHintSeen(true);
      if (event.target.closest('.gallery-lightbox')) return;
      if (!event.target.matches('input') && view === 'book' && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
        event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
      }
      if (!event.target.matches('input') && view === 'book' && ['Home','End'].includes(event.key)) { event.preventDefault(); book.current?.jump(event.key === 'Home' ? 0 : leaves.length - 1); }
      trapGalleryFocus(event, dialog.current);
    }}>
    <header className="gallery-viewer-header">
      <button ref={backButton} type="button" className="gallery-glass" aria-label="Back to albums" onClick={close}><ArrowLeft aria-hidden="true" /></button>
      <div className="gallery-viewer-title"><h2 id="gallery-album-title">{album.title}</h2><p>{photos.length} {photos.length === 1 ? 'Page' : 'Pages'} <span aria-hidden="true">·</span> {photos.length} photos</p></div>
      <div className="gallery-viewer-tools">
        <button type="button" className="gallery-glass" aria-label={view === 'book' ? 'Show grid view' : 'Show book view'} onClick={() => { setView(value => value === 'book' ? 'grid' : 'book'); }}>
          {view === 'book' ? <Grid2X2 aria-hidden="true" /> : <BookOpen aria-hidden="true" />}
        </button>
      </div>
    </header>
    <p className="gallery-sr-only" role="status" aria-live="polite" aria-atomic="true">{pages.length ? pageLabel : 'No matching photos'}</p>
    <main className={`gallery-viewer-content gallery-mode-${view}`} onWheel={() => setHintSeen(true)}>
      {!pages.length ? <p className="gallery-empty">No moments match that search. Try another word.</p> : view === 'grid' ? <div className="gallery-album-grid">
        {photos.map(photo => <button type="button" className="gallery-grid-photo" key={photo.id} onClick={event => openPhoto(photo, event.currentTarget)} aria-label={`Open photo: ${photo.caption}`}>
          <img src={photo.thumb} alt={photo.alt} width={photo.thumbWidth} height={photo.thumbHeight} loading="lazy" decoding="async" /><span>{photo.caption}</span>
        </button>)}
      </div> : <div className={`gallery-book-flow ${closing ? 'gallery-book-closing' : ''}`}>
        <div className="gallery-coverflow">
          <PageTurnBook ref={book} leaves={leaves} title={album.title} index={safeIndex} onChange={setPageIndex} onInteract={() => setHintSeen(true)} hintSeen={hintSeen} />
          <div className={`gallery-opening-cover gallery-tone-${album.tone}`} aria-hidden="true"><span>{album.title}</span></div>
        </div>
        <div className="gallery-page-controls">
          <button type="button" className="gallery-glass" aria-label="Previous page" onClick={() => move(-1)} disabled={safeIndex === 0}><ArrowLeft aria-hidden="true" /></button>
          <p>{pageLabel}</p>
          <button type="button" className="gallery-glass" aria-label="Next page" onClick={() => move(1)} disabled={safeIndex === leaves.length - 1}><ArrowRight aria-hidden="true" /></button>
        </div>
      </div>}
    </main>
    <footer className="gallery-viewer-bottom">
      <div className="gallery-progress" role="progressbar" aria-label="Album progress" aria-valuemin={0} aria-valuemax={leaves.length - 1} aria-valuenow={pages.length ? safeIndex : 0}>
        <span style={{ transform: `scaleX(${pages.length ? safeIndex / (leaves.length - 1) : 0})` }} />
      </div>
      <p className="gallery-notice">Tap a photo, swipe or use the arrows to turn a page</p>
    </footer>
    {lightbox && <GalleryLightbox photos={photos} initialIndex={lightbox.index} opener={lightbox.opener} onClose={() => setLightbox(null)} />}
  </dialog>;
}
