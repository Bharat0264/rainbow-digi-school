import { IMAGES } from '../../data/images';
import SmartImage from '../ui/SmartImage';
export default function PhotoStrip() { const photos = [IMAGES.activity1, IMAGES.activity2, IMAGES.campus1, IMAGES.activity3]; return <section className="bg-[#fffbeF] px-5 py-12 sm:px-8"><div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4">{photos.map((image) => <SmartImage key={image.key} image={image} className="aspect-[4/3] overflow-hidden"/>)}</div></section>; }
