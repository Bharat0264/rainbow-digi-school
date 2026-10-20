import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Leaf, Play, Search } from 'lucide-react';
import { albums } from '../../data/gallery';
import AlbumViewer from './AlbumViewer';
import './Gallery.css';

export default function Gallery() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [selected, setSelected] = useState(() => {
    const album = albums.find(item => item.id === params.get('album'));
    return album ? { album, page: Math.max(0, (Number(params.get('page')) || 1) - 1) } : null;
  });
  const [query, setQuery] = useState(''), [searchOpen, setSearchOpen] = useState(false);
  const searchInput = useRef(null), fallbackFocus = useRef(null);
  const normalizedQuery = query.trim().toLowerCase();
  const matches = album => `${album.title} ${album.category} ${album.description}`.toLowerCase().includes(normalizedQuery);
  const visibleAlbums = albums.filter(album => !normalizedQuery || matches(album) || album.pages.some(page => page.photos.some(photo => `${photo.caption} ${photo.alt}`.toLowerCase().includes(normalizedQuery))));
  const openAlbum = (album, event, play = false) => setSelected({ album, opener: event.currentTarget, play, query: matches(album) ? '' : query });

  return <section id="gallery" className="section site-container gallery-section" aria-labelledby="gallery-heading">
    <header className="gallery-section-header">
      <div><p className="eyebrow"><span className="eyebrow-dot" /> Little moments, lasting memories</p><h2 id="gallery-heading">Our Photo Albums</h2><p className="gallery-intro">A shelf full of stories from our little world.</p></div>
      <button ref={fallbackFocus} className="gallery-glass" type="button" aria-label="Search albums and photos" aria-expanded={searchOpen} onClick={() => {
        setSearchOpen(value => !value);
        if (!searchOpen) requestAnimationFrame(() => searchInput.current?.focus());
        else setQuery('');
      }}><Search aria-hidden="true" /></button>
    </header>
    {searchOpen && <label className="gallery-search"><Search size={18} aria-hidden="true" /><span className="gallery-sr-only">Search albums and photos by title</span>
      <input ref={searchInput} type="search" value={query} placeholder="Search albums or little moments…" onChange={event => setQuery(event.target.value)} /></label>}
    <p className="gallery-preview-note">Preview albums use replaceable school screenshots and our campus photograph. Event photos will be added to their own albums.</p>
    <p className="gallery-sr-only" role="status">{visibleAlbums.length} albums found</p>
    <div className="gallery-shelf-wrap">
      <Leaf className="gallery-shelf-leaf" size={38} aria-hidden="true" />
      <ul className="gallery-shelf" aria-label="School photo albums">
        {visibleAlbums.map(album => <li key={album.id} className={`gallery-book-shell gallery-tone-${album.tone}`}>
          <button className="gallery-book" type="button" onClick={event => openAlbum(album, event)} aria-label={`Open ${album.title} album, ${album.pages.flatMap(page => page.photos).length} preview photos`} aria-haspopup="dialog">
            <span className="gallery-cover-kicker">Rainbow DIGI School</span>
            <span className="gallery-cover-window"><img src={album.cover} alt="" width="400" height="300" loading="lazy" decoding="async" /></span>
            <span className="gallery-book-title">{album.title}</span>
            <span className="gallery-book-count">{album.pages.flatMap(page => page.photos).length} photos <span aria-hidden="true">·</span> {album.pages.length} pages</span>
            <span className="gallery-book-preview">Preview album</span>
          </button>
          <button className="gallery-glass gallery-book-play" type="button" aria-label={`Play ${album.title} slideshow`} onClick={event => openAlbum(album, event, true)}><Play size={17} aria-hidden="true" /></button>
        </li>)}
      </ul>
    </div>
    {!visibleAlbums.length && <p className="gallery-empty">No albums match that search. Try an event or a photo caption.</p>}
    <p className="gallery-shelf-hint">Choose a book and turn a little moment into a memory.</p>
    <p className="gallery-privacy">Photos are shared with parental consent.</p>
    {selected && <AlbumViewer album={selected.album} opener={selected.opener} startSlideshow={selected.play}
      initialPage={selected.page || 0} initialQuery={selected.query || ''} onClose={() => setSelected(null)} />}
  </section>;
}
