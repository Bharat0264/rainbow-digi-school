import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'gold',
  className = '',
  arrow = false,
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold";
  
  const variants = {
    gold: "bg-gold text-espresso hover:bg-gold-deep",
    outline: "border-2 border-gold text-espresso hover:bg-gold/10",
    dark: "bg-espresso text-white hover:bg-espresso-light focus:ring-espresso",
  };

  const isInternalLink = href && href.startsWith('/');
  const Component = isInternalLink ? Link : (href ? 'a' : 'button');
  const props = isInternalLink ? { to: href } : (href ? { href, target: "_blank", rel: "noopener noreferrer" } : { onClick });

  return (
    <Component
      {...props}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        className="flex items-center gap-2 w-full h-full"
      >
        <span>{children}</span>
        {arrow && <ArrowRight className="w-5 h-5 ml-1" />}
      </motion.div>
    </Component>
  );
}
