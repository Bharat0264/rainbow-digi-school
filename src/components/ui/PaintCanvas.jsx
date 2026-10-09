import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * @typedef {'warm' | 'cobalt' | 'crimson' | 'green' | 'sun'} Mood
 */

/**
 * PaintCanvas - Renders an oil-painting canvas background using inline SVG filters.
 * @param {Object} props
 * @param {Mood} [props.mood='warm'] - Controls dominant stroke colors
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {React.ReactNode} props.children - Section content rendered on top
 * @param {boolean} [props.parallax=true] - Enable slow parallax on scroll
 */
export default function PaintCanvas({ mood = 'warm', className = '', children, parallax = true }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const prefersReducedMotion = useReducedMotion();
  const shouldParallax = parallax && !prefersReducedMotion;
  
  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, shouldParallax ? 60 : 0]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, shouldParallax ? -40 : 0]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, shouldParallax ? 30 : 0]);

  // Mood color palettes matching the Painted Glass spec
  const moodColors = {
    warm: ['#F5821F', '#FFC83D', '#F7F1E6'],
    cobalt: ['#1F4E8C', '#38A3E8', '#F7F1E6'],
    crimson: ['#D7263D', '#F5821F', '#F7F1E6'],
    green: ['#2D8B50', '#38A3E8', '#F7F1E6'],
    sun: ['#FFC83D', '#F5821F', '#F7F1E6']
  };

  const colors = moodColors[mood] || moodColors.warm;
  // Use a predictable seed based on mood to avoid hydration mismatches
  const seed = { warm: 10, cobalt: 25, crimson: 42, green: 50, sun: 77 }[mood] || 10;

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* SVG Background with Filters */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="w-full h-full opacity-80" preserveAspectRatio="none">
          <defs>
            <filter id={`oil-paint-${mood}`} x="-20%" y="-20%" width="140%" height="140%">
              {/* Generates noise for the bristle texture */}
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency=".015 .012" 
                numOctaves="4" 
                seed={seed} 
                result="noise" 
              />
              {/* Displaces the graphic using the noise to create ridges */}
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="noise" 
                scale="18" 
                xChannelSelector="R" 
                yChannelSelector="G" 
                result="displacement" 
              />
              {/* Adds shiny highlights typical of thick oil paint */}
              <feSpecularLighting 
                in="displacement" 
                surfaceScale="2" 
                specularConstant=".6" 
                specularExponent="20" 
                lightingColor="#ffffff" 
                result="highlight"
              >
                <fePointLight x="-5000" y="-10000" z="20000" />
              </feSpecularLighting>
              {/* Composites the highlight over the displaced graphic */}
              <feComposite in="highlight" in2="SourceGraphic" operator="in" result="highlight-masked" />
              <feComposite in="SourceGraphic" in2="highlight-masked" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          </defs>

          {/* Canvas base color could be added here if needed, but we rely on strokes */}
          <g filter={`url(#oil-paint-${mood})`}>
            {/* Background broad stroke */}
            <motion.ellipse 
              cx="20%" cy="10%" rx="60%" ry="40%" 
              fill={colors[0]} 
              style={{ y: y1 }}
              opacity="0.9"
            />
            {/* Midground contrasting stroke */}
            <motion.ellipse 
              cx="80%" cy="70%" rx="50%" ry="60%" 
              fill={colors[1]} 
              style={{ y: y2 }}
              opacity="0.85"
            />
            {/* Foreground splash/swirl */}
            <motion.path 
              d="M-200,800 Q 400,200 800,900 T 1500,500 L 1500,1500 L-200,1500 Z"
              fill={colors[2]}
              style={{ y: y3 }}
              opacity="0.95"
            />
          </g>
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
