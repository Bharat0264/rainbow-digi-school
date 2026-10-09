import React from 'react';

/**
 * PaintDrip - A small decorative component that renders a wavy, drippy paint SVG.
 * @param {Object} props
 * @param {string} props.color - Hex color string for the drip
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function PaintDrip({ color = '#3B2412', className = '' }) {
  return (
    <svg 
      className={`w-full h-12 block ${className}`} 
      viewBox="0 0 1000 100" 
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path 
        d="M0,0 L1000,0 L1000,20 C950,20 900,60 850,30 C800,0 750,90 700,50 C650,10 600,80 550,40 C500,0 450,100 400,60 C350,20 300,70 250,30 C200,-10 150,80 100,40 C50,0 25,20 0,20 Z" 
        fill={color} 
      />
    </svg>
  );
}
