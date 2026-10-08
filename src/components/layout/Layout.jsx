import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollProgress from './ScrollProgress';
import Preloader from './Preloader';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-ivory font-sans text-espresso flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
