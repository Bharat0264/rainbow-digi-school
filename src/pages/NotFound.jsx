import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0 }
  };

  return (
    <motion.div
      initial="initial" animate="animate" exit="exit" variants={pageVariants}
      className="min-h-svh bg-[#FFFDF6] flex items-center justify-center px-6 relative overflow-hidden"
    >
      <div className="text-center z-10 relative">
        <h1 className="font-serif text-8xl md:text-[150px] text-[#F6C945] leading-none mb-6">404</h1>

        {/* Subtle decorative arc */}
        <div className="w-32 h-32 border-t-2 border-[#D9A514]/30 rounded-full mx-auto -mt-16 mb-8"></div>

        <h2 className="text-3xl md:text-4xl font-serif text-[#2B2118] mb-4">
          Page not found
        </h2>
        <p className="text-[#6B5D52] text-lg max-w-md mx-auto mb-10">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center bg-[#F6C945] hover:bg-[#D9A514] text-[#2B2118] font-medium py-3 px-8 rounded-full transition-colors duration-300 shadow-md"
        >
          Back to Home
        </Link>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-3xl max-h-3xl bg-[#FBF3D5]/50 rounded-full blur-3xl -z-0"></div>
    </motion.div>
  );
}
