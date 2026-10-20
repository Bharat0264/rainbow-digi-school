import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Grid2X2, Maximize, Minimize, Pause, Play, Search, Share2 } from 'lucide-react';
import ScrapbookSpread from './ScrapbookSpread';
import GalleryLightbox from './GalleryLightbox';
import { trapGalleryFocus, useGallerySwipe } from './galleryInteraction';

export default function AlbumViewer({ album, onClose, opener, startSlideshow = false, initialPage = 0, initialQuery = '' }) {
  const [pageIndex, setPageIndex] = useState(Math.min(initialPage, album.pages.length - 1));
  const [view, setView] = useState('book'), [query, setQuery] = useState(initialQuery);
  const [searchOpen, setSearchOpen] = useState(Boolean(initialQuery));
  const [playing, setPlaying] = useState(startSlideshow), [closing, setClosing] = useState(false);
  const [direction, setDirection] = useState(1), [lightbox, setLightbox] = useState(null);
  const [notice, setNotice] = useState(''), [shareLink, setShareLink] = useState(''), [fullscreen, setFullscreen] = useState(false);
  const dialog = useRef(null), backButton = useRef(null), searchInput = useRef(null), closeTimer = useRef(null);
  const normalizedQuery = query.trim().toLowerCase();
  const pages = useMemo(() => album.pages.map(page => ({ ...page, photos: page.photos.filter(photo =>
    !normalizedQuery || `${album.title} ${page.label} ${photo.caption} ${photo.alt}`.toLowerCase().includes(normalizedQuery)) }))
    .filter(page => page.photos.length), [album, normalizedQuery]);
  const safeIndex = Math.min(pageIndex, Math.max(0, pages.length - 1));
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
      else document.querySelector('#gallery [aria-label="Search albums and photos"]')?.focus({ preventScroll: true });
    };
  }, [opener]);

  useEffect(() => {
    if (!playing || !pages.length || lightbox || closing) return;
    const timer = setInterval(() => {
      setDirection(1); setPageIndex(value => (value + 1) % pages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [playing, pages.length, lightbox, closing]);

  useEffect(() => {
    if (view !== 'book' || pages.length < 2) return;
    // Preload only the immediate next spread, never the rest of the album.
    const images = pages[(safeIndex + 1) % pages.length].photos.map(photo => {
      const image = new Image(); image.decoding = 'async'; image.src = photo.src; return image;
    });
    return () => { images.forEach(image => { image.onload = null; }); };
  }, [pages, safeIndex, view]);

  const close = () => {
    if (closing) return;
    pause(); setClosing(true);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    closeTimer.current = setTimeout(onClose, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 140 : 600);
  };
  const move = direction => {
    pause(); setDirection(direction);
    if (pages.length) setPageIndex((safeIndex + direction + pages.length) % pages.length);
  };
  const swipe = useGallerySwipe(move, pause);
  const openPhoto = (photo, element) => {
    pause(); setLightbox({ index: photos.findIndex(item => item.id === photo.id), opener: element });
  };
  const toggleSearch = () => {
    pause(); setSearchOpen(value => !value);
    if (!searchOpen) requestAnimationFrame(() => searchInput.current?.focus());
    else if (query) { setQuery(''); setPageIndex(0); }
  };
  const share = async () => {
    pause(); const url = new URL(window.location.href);
    url.searchParams.set('album', album.id); url.searchParams.set('page', String(safeIndex + 1)); url.hash = 'gallery';
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

  return <dialog ref={dialog} className={`gallery-viewer ${closing ? 'gallery-viewer-closing' : ''}`} aria-labelledby="gallery-album-title"
    onCancel={event => { event.preventDefault(); close(); }}
    onKeyDown={event => {
      if (event.target.closest('.gallery-lightbox')) return;
      if (!event.target.matches('input') && view === 'book' && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
        event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
      }
      if (event.key === 'Tab') pause();
      trapGalleryFocus(event, dialog.current);
    }}>
    <header className="gallery-viewer-header">
      <button ref={backButton} type="button" className="gallery-glass" aria-label="Back to albums" onClick={close}><ArrowLeft aria-hidden="true" /></button>
      <div className="gallery-viewer-title"><h2 id="gallery-album-title">{album.title}</h2><p>{pages.length} {pages.length === 1 ? 'Page' : 'Pages'} <span aria-hidden="true">·</span> {photos.length} photos</p></div>
      <div className="gallery-viewer-tools">
        <button type="button" className="gallery-glass" aria-label={view === 'book' ? 'Show grid view' : 'Show book view'} onClick={() => { pause(); setView(value => value === 'book' ? 'grid' : 'book'); }}>
          {view === 'book' ? <Grid2X2 aria-hidden="true" /> : <BookOpen aria-hidden="true" />}
        </button>
        <button type="button" className="gallery-glass" aria-label="Search this album" aria-expanded={searchOpen} onClick={toggleSearch}><Search aria-hidden="true" /></button>
      </div>
    </header>
    {searchOpen && <label className="gallery-search gallery-viewer-search"><Search size={18} aria-hidden="true" /><span className="gallery-sr-only">Search photos in this album</span>
      <input ref={searchInput} type="search" placeholder="Find a little moment…" value={query} onChange={event => { pause(); setQuery(event.target.value); setPageIndex(0); }} /></label>}
    <p className="gallery-sr-only" role="status">{pages.length ? `Page ${safeIndex + 1} of ${pages.length}` : 'No matching photos'}</p>
    <main className={`gallery-viewer-content gallery-mode-${view}`} onWheel={pause}>
      {!pages.length ? <p className="gallery-empty">No moments match that search. Try another word.</p> : view === 'grid' ? <div className="gallery-album-grid">
        {photos.map(photo => <button type="button" className="gallery-grid-photo" key={photo.id} onClick={event => openPhoto(photo, event.currentTarget)} aria-label={`Open photo: ${photo.caption}`}>
          <img src={photo.thumb} alt={photo.alt} width={photo.thumbWidth} height={photo.thumbHeight} loading="lazy" decoding="async" /><span>{photo.caption}</span>
        </button>)}
      </div> : <div className={`gallery-book-flow ${closing ? 'gallery-book-closing' : ''}`}>
        <div className="gallery-coverflow" {...swipe}>
          {[-1, 0, 1].filter((offset, index) => pages.length > 2 || offset === 0 || (pages.length === 2 && index === 2)).map(offset => {
            const index = (safeIndex + offset + pages.length) % pages.length;
            return <div key={pages[index].id} className={`gallery-flow-page ${offset === 0 ? 'gallery-flow-current' : offset < 0 ? 'gallery-flow-previous' : 'gallery-flow-next'}`}
              data-direction={direction} aria-hidden={offset !== 0 ? true : undefined} inert={offset !== 0 ? true : undefined}>
              <ScrapbookSpread page={pages[index]} number={index + 1} active={offset === 0} onPhoto={openPhoto} />
            </div>;
          })}
          <div className={`gallery-opening-cover gallery-tone-${album.tone}`} aria-hidden="true"><span>{album.title}</span></div>
        </div>
        <div className="gallery-page-controls">
          <button type="button" className="gallery-glass" aria-label="Previous page" onClick={() => move(-1)} disabled={pages.length < 2}><ArrowLeft aria-hidden="true" /></button>
          <p>Page <strong>{safeIndex + 1}</strong> of {pages.length}</p>
          <button type="button" className="gallery-glass" aria-label="Next page" onClick={() => move(1)} disabled={pages.length < 2}><ArrowRight aria-hidden="true" /></button>
        </div>
      </div>}
    </main>
    <footer className="gallery-viewer-bottom">
      <div className="gallery-progress" role="progressbar" aria-label="Album progress" aria-valuemin={0} aria-valuemax={pages.length || 1} aria-valuenow={pages.length ? safeIndex + 1 : 0}>
        <span style={{ transform: `scaleX(${pages.length ? (safeIndex + 1) / pages.length : 0})` }} />
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
      <p className="gallery-notice" role="status">{notice || (playing ? 'Slideshow playing · a new page every 3 seconds' : 'Swipe or use the arrows to turn a page')}</p>
      {shareLink && <input className="gallery-share-link" aria-label="Album link" readOnly value={shareLink} onFocus={event => event.target.select()} />}
    </footer>
    {lightbox && <GalleryLightbox photos={photos} initialIndex={lightbox.index} opener={lightbox.opener} onClose={() => setLightbox(null)} />}
  </dialog>;
}
