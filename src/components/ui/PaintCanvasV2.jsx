import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export default function PaintCanvasV2({ mood = 'warm', className = '', children, flip = false }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const prefersReducedMotion = useReducedMotion();
  const shouldParallax = !prefersReducedMotion;
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, shouldParallax ? 40 : 0]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, shouldParallax ? -20 : 0]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, shouldParallax ? 25 : 0]);

  const palettes = {
    warm: ['#FFC83D', '#F5821F', '#F5821F'],
    cobalt: ['#38A3E8', '#1F4E8C', '#1F4E8C'],
    crimson: ['#F5821F', '#D7263D', '#D7263D'],
    footer: ['#1F4E8C', '#10305e', '#10305e']
  };
  
  const colors = palettes[mood] || palettes.warm;
  const seed = mood === 'warm' ? 10 : mood === 'cobalt' ? 20 : mood === 'crimson' ? 30 : 40;
  
  const transform = flip ? "scaleX(-1)" : "none";

  return (
    <div ref={containerRef} className={`relative overflow-hidden pg-root ${className}`}>
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ transform }}>
        <svg className="w-full h-full opacity-90" preserveAspectRatio="none">
          <defs>
            <filter id={`pg-oil-${mood}`} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency=".012 .01" numOctaves="4" seed={seed} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" xChannelSelector="R" yChannelSelector="G" result="disp" />
              <feSpecularLighting in="disp" surfaceScale="2" specularConstant="0.65" specularExponent="25" lightingColor="#ffffff" result="spec">
                <fePointLight x="-1000" y="-5000" z="10000" />
              </feSpecularLighting>
              <feComposite in="spec" in2="SourceGraphic" operator="in" result="spec-masked" />
              <feComposite in="SourceGraphic" in2="spec-masked" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          </defs>
          <g filter={`url(#pg-oil-${mood})`}>
            {/* Base stroke spanning the width */}
            <motion.path 
              d="M-100,50 Q 500,200 1500,50 L 1500,800 Q 500,700 -100,800 Z" 
              fill={colors[0]} 
              opacity="0.85" 
              style={{ y: y1 }} 
            />
            {/* Mid stroke overlapping */}
            <motion.path 
              d="M1500,150 Q 800,-50 -100,150 L -100,600 Q 800,800 1500,600 Z" 
              fill={colors[1]} 
              opacity="0.8" 
              style={{ y: y2 }} 
            />
            {/* Splash/Drip decoration */}
            <motion.path 
              d="M300,800 Q 400,900 500,800 T 800,850 T 1100,800" 
              fill="none"
              stroke={colors[2]}
              strokeWidth="60"
              strokeLinecap="round"
              opacity="0.9" 
              style={{ y: y3 }} 
            />
          </g>
        </svg>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
