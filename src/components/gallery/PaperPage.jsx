import './PageTurnBook.css';

export function PaperPage({ leaf, index, total, title }) {
  return <article className={`paper-leaf ${leaf.cover ? 'paper-hardcover' : ''}`} data-density={leaf.cover ? 'hard' : 'soft'} data-leaf={index} aria-label={leaf.cover ? `${leaf.cover} cover` : `Page ${index} of ${total}: ${leaf.label}`}>
    <div className="paper-leaf-content">
      {leaf.cover ? <div className="paper-cover-design"><img src="/logo.webp" width="1021" height="491" alt="Rainbow Digi School logo" draggable={false} /><h3>{title}</h3><p>Little moments, lasting memories</p><span>{leaf.cover === 'Back' ? 'Rainbow Digi School' : 'Our Photo Albums'}</span></div> : <>
        <header className="paper-heading"><strong>{String(index).padStart(2,'0')}</strong><span>{leaf.label}</span></header>
        <figure className="paper-photo"><img src={leaf.photos[0].src} alt={leaf.photos[0].alt} width={leaf.photos[0].width} height={leaf.photos[0].height} loading="lazy" decoding="async" draggable={false} /><figcaption>{leaf.photos[0].caption}</figcaption></figure>
        <footer className="paper-footer">Little moments, lasting memories <span>{index} / {total}</span></footer>
      </>}
    </div>
  </article>;
}
