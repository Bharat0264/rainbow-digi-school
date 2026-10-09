import { IMAGES } from '../../data/images';
import SmartImage from '../ui/SmartImage';
import PaintCanvasV2 from '../ui/PaintCanvasV2';
import { motion } from 'framer-motion';

export default function PaintedPhotoStripV2() { 
  const photos = [IMAGES.activity1, IMAGES.activity2, IMAGES.campus1, IMAGES.activity3]; 
  return (
    <PaintCanvasV2 mood="warm" className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl relative z-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {photos.map((image, i) => (
          <motion.div 
            key={image.key} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="pg-glass pg-glass--card p-2"
          >
            <SmartImage image={image} className="aspect-[4/3] rounded-[18px] overflow-hidden"/>
          </motion.div>
        ))}
      </div>
    </PaintCanvasV2>
  ); 
}
