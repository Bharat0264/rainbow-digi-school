import { IMAGES } from '../../data/images';
import SmartImage from '../ui/SmartImage';
import PaintCanvas from '../ui/PaintCanvas';
import PaintDivider from '../ui/PaintDivider';
import { motion } from 'framer-motion';

export default function PhotoStrip() { 
  const photos = [IMAGES.activity1, IMAGES.activity2, IMAGES.campus1, IMAGES.activity3]; 
  return (
    <div className="relative">
      <PaintDivider className="absolute -top-1 w-full h-12 z-20 text-[#F7F1E6]" />
      <PaintCanvas mood="green" className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {photos.map((image, i) => (
              <motion.div 
                key={image.key} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass p-2"
              >
                <SmartImage image={image} className="aspect-[4/3] rounded-2xl overflow-hidden"/>
              </motion.div>
            ))}
          </div>
        </div>
      </PaintCanvas>
      <PaintDivider flip className="absolute -bottom-1 w-full h-12 z-20 text-[#F7F1E6]" />
    </div>
  ); 
}
