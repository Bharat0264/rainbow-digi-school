import React from 'react';

/**
 * PaintDivider - A section divider component rendering a wavy brush-stroke edge.
 * @param {Object} props
 * @param {string} props.color - Hex color string for the divider
 * @param {boolean} [props.flip=false] - If true, flips the divider vertically
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function PaintDivider({ color = '#F7F1E6', flip = false, className = '' }) {
  return (
    <svg 
      className={`w-full h-16 block ${flip ? 'rotate-180' : ''} ${className}`} 
      viewBox="0 0 1000 100" 
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path 
        d="M0,60 C150,10 250,90 500,50 C750,10 850,80 1000,40 L1000,100 L0,100 Z" 
        fill={color} 
      />
    </svg>
  );
}
