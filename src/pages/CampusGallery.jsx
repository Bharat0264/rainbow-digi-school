import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_IMAGES } from '../data/school';

const CATEGORIES = ['All', 'Classrooms', 'Sports', 'Events', 'Arts'];

export default function CampusGallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredImages = activeCategory === 'All'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === activeCategory);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const showPrev = useCallback((e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1));
  }, [filteredImages.length]);

  const showNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0));
  }, [filteredImages.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, showPrev, showNext]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0 }
  };

  return (
    <motion.div
      initial="initial" animate="animate" exit="exit" variants={pageVariants}
      className="min-h-svh bg-[#FFFDF6]"
    >
      {/* Hero Banner */}
      <section className="bg-royal-blue text-white pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-6xl text-[#F6C945] mb-6">Campus & Gallery</h1>
          <p className="text-[#A89888] text-lg max-w-2xl mx-auto">
            Explore our state-of-the-art facilities and vibrant student life.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 opacity-80" />
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#F6C945] text-royal-blue shadow-md'
                    : 'bg-transparent text-[#6B5D52] border border-[#A89888]/30 hover:border-[#F6C945]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
          >
            <AnimatePresence>
              {filteredImages.map((img, index) => (
                <motion.div
                  layout
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="break-inside-avoid cursor-pointer group"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-sm hover:scale-[1.02] transition-transform duration-300">
                    <img src={img.url}
                      alt={img.alt || img.title}
                      loading="lazy"
                      className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                     width="800" height="600" decoding="async" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B2118]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white font-medium">{img.title}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-royal-blue/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-6 right-6 text-[#A89888] hover:text-[#F6C945] transition-colors p-2"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>

            <button
              className="absolute left-6 text-[#A89888] hover:text-[#F6C945] transition-colors p-2"
              onClick={showPrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={48} />
            </button>

            <div className="relative max-w-5xl max-h-[85vh] w-full px-16 flex justify-center items-center" onClick={e => e.stopPropagation()}>
              <img src={filteredImages[lightboxIndex].url}
                alt={filteredImages[lightboxIndex].alt || filteredImages[lightboxIndex].title}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-md"
               width="800" height="600" loading="lazy" decoding="async" />
              <div className="absolute bottom-[-40px] text-center w-full text-[#FBF3D5]">
                {filteredImages[lightboxIndex].title}
              </div>
            </div>

            <button
              className="absolute right-6 text-[#A89888] hover:text-[#F6C945] transition-colors p-2"
              onClick={showNext}
              aria-label="Next image"
            >
              <ChevronRight size={48} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
