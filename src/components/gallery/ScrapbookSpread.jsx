import { Leaf, Rainbow, Star } from 'lucide-react';

export default function ScrapbookSpread({ page, number, active, onPhoto }) {
  return <article className={`gallery-spread gallery-template-${page.template}`} aria-label={`Page ${number}: ${page.label}`} onClick={event => { if (active && !event.target.closest("button")) onPhoto?.(); }}>
    <header className="gallery-paper-heading"><span className="gallery-page-number">{String(number).padStart(2, '0')}</span><span>{page.label}</span><Rainbow size={22} aria-hidden="true" /></header>
    <div className="gallery-photo-layout">
      {page.photos.map((photo, index) => <button key={photo.id} className={`gallery-paper-photo gallery-photo-${index + 1}`} type="button"
        tabIndex={active ? 0 : -1} aria-label={`Turn to next page: ${photo.caption}`} onClick={event => onPhoto?.(photo, event.currentTarget)}>
        <span className="gallery-tape" aria-hidden="true" />
        <img src={active ? photo.src : photo.thumb} alt={photo.alt} width={active ? photo.width : photo.thumbWidth} height={active ? photo.height : photo.thumbHeight} loading="lazy" decoding="async" draggable={false} />
        <span className="gallery-paper-caption">{photo.caption}</span>
      </button>)}
    </div>
    <footer className="gallery-paper-footer"><Leaf size={18} aria-hidden="true" /><span>Little moments, lasting memories</span><Star size={18} aria-hidden="true" /></footer>
  </article>;
}
