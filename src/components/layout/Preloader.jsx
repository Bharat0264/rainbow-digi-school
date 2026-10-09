import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHOOL } from '../../data/school';
import Logo from '../ui/Logo';

export default function Preloader({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 850);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-ivory flex flex-col items-center justify-center"
          initial={{ y: 0 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="bg-white p-4 rounded-full shadow-lg mb-6">
              <Logo className="h-20 w-28" />
            </div>
            <motion.h1 
              className="text-royal-blue font-serif text-3xl md:text-4xl font-bold tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {SCHOOL.name}
            </motion.h1>
            <motion.div 
              className="h-0.5 bg-gold mt-6 origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1, ease: "easeInOut" }}
              style={{ width: '120px' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
