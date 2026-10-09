import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { NAV } from '../../data/nav';
import Logo from '../ui/Logo';
import './PaintedGlassHeader.css';

const PaintedGlassHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const menuBtnRef = useRef(null);
  const firstLinkRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Compact mode when scrolling down
    if (currentScrollY > 80) {
      setIsCompact(true);
    } else {
      setIsCompact(false);
    }
    
    // Hide header on scroll down, show on scroll up
    if (currentScrollY > 150 && currentScrollY > lastScrollY.current && !isMenuOpen) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    
    lastScrollY.current = currentScrollY;
  }, [isMenuOpen]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle scroll lock and focus management for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Focus first link on open for accessibility
      setTimeout(() => {
        if (firstLinkRef.current) {
          firstLinkRef.current.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    // Return focus to menu button when closing
    if (menuBtnRef.current) {
      menuBtnRef.current.focus();
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isMenuOpen]);

  const allNavLinks = [...NAV.left, ...NAV.right];

  const animationProps = shouldReduceMotion ? {} : {
    initial: { opacity: 0, scale: 0.95, y: -20, transformOrigin: 'top left' },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 },
    transition: { type: 'spring', damping: 20, stiffness: 300 }
  };

  return (
    <>
      <header className={`pgh-header ${isHidden ? 'pgh-header--hidden' : ''}`}>
        <div className="pgh-header-inner">
          
          {/* Painted Branch SVG Stroke */}
          <svg className="pgh-branch-svg" preserveAspectRatio="none" viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
            <filter id="paint-texture" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            {/* Base branch stroke */}
            <path 
              d="M-50,60 Q300,10 720,40 T1500,50" 
              stroke="#8B5E34" 
              strokeWidth="12" 
              fill="none" 
              filter="url(#paint-texture)"
              strokeLinecap="round"
            />
            {/* Highlight stroke for the branch */}
            <path 
              d="M-50,57 Q300,7 720,37 T1500,47" 
              stroke="rgba(255,255,255,0.2)" 
              strokeWidth="4" 
              fill="none" 
              filter="url(#paint-texture)"
              strokeLinecap="round"
            />
          </svg>

          <div className="pgh-glass-bar">
            {/* Desktop Left Nav Links */}
            <nav className="pgh-nav-group desktop-only">
              {NAV.left.map((link) => (
                <NavLink 
                  key={link.path} 
                  to={link.path} 
                  className="pgh-nav-link"
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              ref={menuBtnRef}
              className="pgh-menu-btn" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? 'Close' : 'Menu'}
            </button>

            {/* Logo Center Hanging off branch */}
            <div className="pgh-logo-container">
              <NavLink to="/" aria-label="Home">
                <Logo size={isCompact ? 60 : 80} />
              </NavLink>
            </div>

            {/* Desktop Right Nav & CTA */}
            <div className="pgh-nav-group">
              <nav className="pgh-nav-group desktop-only">
                {NAV.right.map((link) => (
                  <NavLink 
                    key={link.path} 
                    to={link.path} 
                    className="pgh-nav-link"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              <NavLink to={NAV.cta.path} className="pgh-cta pgh-nav-link">
                {NAV.cta.label}
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Full Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="pgh-mobile-menu-container">
            {/* Backdrop Dimmer */}
            <motion.div 
              className="pgh-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />
            {/* Glass Dropdown Morphing from menu button area */}
            <motion.div 
              id="mobile-menu"
              className="pgh-mobile-menu"
              role="dialog"
              aria-label="Mobile navigation menu"
              {...animationProps}
            >
              {allNavLinks.map((link, index) => (
                <NavLink 
                  key={link.path} 
                  to={link.path} 
                  className="pgh-mobile-link"
                  onClick={closeMenu}
                  ref={index === 0 ? firstLinkRef : null}
                >
                  {link.label}
                </NavLink>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PaintedGlassHeader;
