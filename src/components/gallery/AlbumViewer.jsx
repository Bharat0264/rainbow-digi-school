import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Grid2X2, Maximize, Minimize, Pause, Play, Search, Share2 } from 'lucide-react';
import PageTurnBook from './PageTurnBook';
import GalleryLightbox from './GalleryLightbox';
import { trapGalleryFocus } from './galleryInteraction';

export default function AlbumViewer({ album, onClose, opener, startSlideshow = false, initialPage = 0, initialQuery = '' }) {
  const [pageIndex, setPageIndex] = useState(initialPage * 2 + 1);
  const [view, setView] = useState('book'), [query, setQuery] = useState(initialQuery);
  const [searchOpen, setSearchOpen] = useState(Boolean(initialQuery));
  const [playing, setPlaying] = useState(startSlideshow), [closing, setClosing] = useState(false);
  const book = useRef(null);
  const [hintSeen, setHintSeen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [notice, setNotice] = useState(''), [shareLink, setShareLink] = useState(''), [fullscreen, setFullscreen] = useState(false);
  const dialog = useRef(null), backButton = useRef(null), searchInput = useRef(null), closeTimer = useRef(null);
  const normalizedQuery = query.trim().toLowerCase();
  const pages = useMemo(() => album.pages.flatMap(page => page.photos.reduce((spreads, photo, index) => {
    if (index % 2 === 0) spreads.push({ ...page, id: `${page.id}-${index / 2}`, photos: [] });
    spreads[spreads.length - 1].photos.push(photo); return spreads;
  }, [])).map(page => ({ ...page, photos: page.photos.filter(photo =>
    !normalizedQuery || `${album.title} ${page.label} ${photo.caption} ${photo.alt}`.toLowerCase().includes(normalizedQuery)) }))
    .filter(page => page.photos.length), [album, normalizedQuery]);
  const leaves = useMemo(() => [
    { id: 'front-cover', cover: 'Front', photos: [] },
    ...pages.flatMap(page => page.photos.map(photo => ({ ...page, id: `${page.id}-${photo.id}`, photos: [photo] }))),
    { id: 'back-cover', cover: 'Back', photos: [] },
  ], [pages]);
  const safeIndex = Math.min(pageIndex, leaves.length - 1);
  const pageLabel = safeIndex === 0 ? 'Front cover' : safeIndex === leaves.length - 1 ? 'Back cover' : `Page ${safeIndex} of ${leaves.length - 2}`;
  const photos = useMemo(() => pages.flatMap(page => page.photos), [pages]);
  const pause = () => setPlaying(false);

  useEffect(() => {
    const viewer = dialog.current, oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; viewer.showModal(); backButton.current.focus();
    const fullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', fullscreenChange);
    return () => {
      clearTimeout(closeTimer.current); viewer.close(); document.body.style.overflow = oldOverflow;
      document.removeEventListener('fullscreenchange', fullscreenChange);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
      else document.querySelector('#gallery .gallery-book')?.focus({ preventScroll: true });
    };
  }, [opener]);

  useEffect(() => {
    if (!playing || !pages.length || lightbox || closing) return;
    const timer = setInterval(() => {
      book.current?.move(1);
    }, 3000);
    return () => clearInterval(timer);
  });

  const close = () => {
    if (closing) return;
    pause(); setClosing(true);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    closeTimer.current = setTimeout(onClose, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 140 : 600);
  };
  const move = nextDirection => { pause(); book.current?.move(nextDirection); };
  const openPhoto = (photo, element) => {
    pause(); setLightbox({ index: photos.findIndex(item => item.id === photo.id), opener: element });
  };
  const toggleSearch = () => {
    pause(); setSearchOpen(value => !value);
    if (!searchOpen) requestAnimationFrame(() => searchInput.current?.focus());
    else if (query) { setQuery(''); setPageIndex(1); }
  };
  const share = async () => {
    pause(); const url = new URL(window.location.href);
    url.searchParams.set('album', album.id); url.searchParams.set('page', String(Math.max(1, Math.ceil(safeIndex / 2)))); url.hash = 'gallery';
    try { await navigator.clipboard.writeText(url.href); setNotice('Album link copied.'); setShareLink(''); }
    catch { setShareLink(url.href); setNotice('Select and copy this album link.'); }
  };
  const toggleFullscreen = async () => {
    pause();
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { setNotice('Your browser could not open fullscreen. The album already fits your screen.'); }
  };

  return <dialog ref={dialog} className={`gallery-viewer ${closing ? 'gallery-viewer-closing' : ''}`} aria-labelledby="gallery-album-title" onPointerDownCapture={() => setHintSeen(true)}
    onCancel={event => { event.preventDefault(); close(); }}
    onKeyDown={event => {
      setHintSeen(true);
      if (event.target.closest('.gallery-lightbox')) return;
      if (!event.target.matches('input') && view === 'book' && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
        event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
      }
      if (!event.target.matches('input') && view === 'book' && ['Home','End'].includes(event.key)) { event.preventDefault(); pause(); book.current?.jump(event.key === 'Home' ? 0 : leaves.length - 1); }
      if (event.key === 'Tab') pause();
      trapGalleryFocus(event, dialog.current);
    }}>
    <header className="gallery-viewer-header">
      <button ref={backButton} type="button" className="gallery-glass" aria-label="Back to albums" onClick={close}><ArrowLeft aria-hidden="true" /></button>
      <div className="gallery-viewer-title"><h2 id="gallery-album-title">{album.title}</h2><p>{photos.length} {photos.length === 1 ? 'Page' : 'Pages'} <span aria-hidden="true">·</span> {photos.length} photos</p></div>
      <div className="gallery-viewer-tools">
        <button type="button" className="gallery-glass" aria-label={view === 'book' ? 'Show grid view' : 'Show book view'} onClick={() => { pause(); setView(value => value === 'book' ? 'grid' : 'book'); }}>
          {view === 'book' ? <Grid2X2 aria-hidden="true" /> : <BookOpen aria-hidden="true" />}
        </button>
        <button type="button" className="gallery-glass" aria-label="Search this album" aria-expanded={searchOpen} onClick={toggleSearch}><Search aria-hidden="true" /></button>
      </div>
    </header>
    {searchOpen && <label className="gallery-search gallery-viewer-search"><Search size={18} aria-hidden="true" /><span className="gallery-sr-only">Search photos in this album</span>
      <input ref={searchInput} type="search" placeholder="Find a little moment…" value={query} onChange={event => { pause(); setQuery(event.target.value); setPageIndex(1); }} /></label>}
    <p className="gallery-sr-only" role="status" aria-live="polite" aria-atomic="true">{pages.length ? pageLabel : 'No matching photos'}</p>
    <main className={`gallery-viewer-content gallery-mode-${view}`} onWheel={pause}>
      {!pages.length ? <p className="gallery-empty">No moments match that search. Try another word.</p> : view === 'grid' ? <div className="gallery-album-grid">
        {photos.map(photo => <button type="button" className="gallery-grid-photo" key={photo.id} onClick={event => openPhoto(photo, event.currentTarget)} aria-label={`Open photo: ${photo.caption}`}>
          <img src={photo.thumb} alt={photo.alt} width={photo.thumbWidth} height={photo.thumbHeight} loading="lazy" decoding="async" /><span>{photo.caption}</span>
        </button>)}
      </div> : <div className={`gallery-book-flow ${closing ? 'gallery-book-closing' : ''}`}>
        <div className="gallery-coverflow">
          <PageTurnBook ref={book} leaves={leaves} title={album.title} index={safeIndex} onChange={setPageIndex} onInteract={() => { pause(); setHintSeen(true); }} hintSeen={hintSeen} />
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
      <div className="gallery-floating-controls">
        <button type="button" className="gallery-glass" aria-label="Share album" onClick={share}>{notice === 'Album link copied.' ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}</button>
        <button type="button" className="gallery-glass gallery-play" aria-label={playing ? 'Pause slideshow' : 'Start slideshow'} aria-pressed={playing} disabled={!pages.length} onClick={() => { setView('book'); setPlaying(value => !value); }}>
          {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        </button>
        <button type="button" className="gallery-glass" aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} disabled={typeof document === 'undefined' || typeof document.documentElement.requestFullscreen !== 'function'} onClick={toggleFullscreen}>
          {fullscreen ? <Minimize aria-hidden="true" /> : <Maximize aria-hidden="true" />}
        </button>
      </div>
      <p className="gallery-notice" role="status">{notice || (playing ? 'Slideshow playing · a new page every 3 seconds' : 'Tap a photo, swipe or use the arrows to turn a page')}</p>
      {shareLink && <input className="gallery-share-link" aria-label="Album link" readOnly value={shareLink} onFocus={event => event.target.select()} />}
    </footer>
    {lightbox && <GalleryLightbox photos={photos} initialIndex={lightbox.index} opener={lightbox.opener} onClose={() => setLightbox(null)} />}
  </dialog>;
}
