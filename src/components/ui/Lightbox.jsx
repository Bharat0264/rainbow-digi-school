import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({ images, activeIndex, onClose, onNext, onPrev }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, onClose, onNext, onPrev]);

  if (activeIndex === null || !images || images.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors z-10 bg-black/50 rounded-full"
          aria-label="Close lightbox"
        >
          <X className="w-8 h-8" />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 p-3 text-white/70 hover:text-white transition-colors z-10 bg-black/50 rounded-full hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 p-3 text-white/70 hover:text-white transition-colors z-10 bg-black/50 rounded-full hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-5xl w-full max-h-[90vh] px-12"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[activeIndex].src}
            alt={images[activeIndex].alt || 'Gallery image'}
            className="w-full h-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
          {images[activeIndex].caption && (
            <div className="absolute bottom-[-40px] left-0 right-0 text-center text-white/80">
              {images[activeIndex].caption}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
