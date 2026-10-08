import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

export default function CountUp({ value, suffix = '', decimal = false, className = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (!isInView) return;
    
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setCount(value);
      return;
    }

    let startTime;
    const duration = 2000; // 2 seconds

    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(easeProgress * value);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref} className={className}>
      {decimal ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
}
