import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedHeading({ children, className = '', as: Component = 'h2', delay = 0 }) {
  if (typeof children !== 'string') {
    return <Component className={className}>{children}</Component>;
  }

  const words = children.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * 0.1 },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <Component className={`${className} flex flex-wrap`} as={Component}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="inline-flex flex-wrap gap-x-[0.25em]"
      >
        {words.map((word, index) => (
          <motion.span variants={child} key={index} className="inline-block">
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}
