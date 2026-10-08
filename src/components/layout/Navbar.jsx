import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { SCHOOL } from '../../data/school';

import logo from '../../assets/logo.png';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/academics', label: 'Academics' },
  { path: '/admissions', label: 'Admissions' },
  { path: '/campus', label: 'Campus' },
  { path: '/events', label: 'Events' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-white/80 backdrop-blur-lg border-b border-gold shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-white rounded-full p-1 shadow-sm flex items-center justify-center">
              <img 
                src={logo} 
                alt={SCHOOL.name} 
                className={`object-contain transition-all duration-300 ${scrolled ? 'h-10' : 'h-12 md:h-14'}`} 
              />
            </div>
            <span className="font-serif text-2xl font-bold text-royal-blue">{SCHOOL.name}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative text-sm font-medium text-espresso hover:text-gold-deep transition-colors"
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <a href={`tel:${SCHOOL.phone}`} className="flex items-center gap-2 text-sm font-medium text-espresso hover:text-gold-deep transition-colors">
              <Phone className="w-4 h-4 text-gold" />
              {SCHOOL.phone}
            </a>
            <Link
              to="/admissions"
              className="px-6 py-2.5 bg-gold text-espresso font-semibold rounded-full hover:bg-gold-deep transition-colors flex items-center gap-2"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-espresso"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-lg border-b border-gold overflow-hidden"
          >
            <nav className="flex flex-col py-4 px-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium ${
                    location.pathname === link.path
                      ? 'bg-champagne text-gold-deep'
                      : 'text-espresso hover:bg-ivory'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3 px-4">
                <a href={`tel:${SCHOOL.phone}`} className="flex items-center gap-2 text-sm font-medium text-espresso py-2">
                  <Phone className="w-4 h-4 text-gold" />
                  {SCHOOL.phone}
                </a>
                <Link
                  to="/admissions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-3 text-center bg-gold text-espresso font-semibold rounded-full hover:bg-gold-deep transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
