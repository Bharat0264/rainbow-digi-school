import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { galleryPhotos } from '../../data/gallery';
import styles from './GalleryPreview.module.css';

export default function GalleryPreview() {
  return <section className={styles.section} aria-label="Gallery preview">
    <ul className={styles.strip}>
      {galleryPhotos.slice(0, 6).map(photo => <li key={photo.id}>
        <Link className={styles.card} to="/school-life#gallery" aria-label={`View full gallery: ${photo.caption}`}>
          <img src={photo.thumb} alt={photo.alt} width={photo.thumbWidth} height={photo.thumbHeight} loading="lazy" decoding="async" />
        </Link>
      </li>)}
    </ul>
    <div className={styles.action}><Link className={`button button-primary ${styles.link}`} to="/school-life#gallery">View full gallery<ArrowRight size={18} aria-hidden="true" /></Link></div>
  </section>;
}
