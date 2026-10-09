import { memo, useEffect, useRef } from 'react';

// One observer for all content reveals; no scroll listener or frame-by-frame state.
let observer;
const reveal = (element) => {
  element.style.willChange = 'transform, opacity';
  element.dataset.revealed = 'true';
};

function Reveal({ as: Tag = 'div', className = '', children }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    element.dataset.revealed = 'false';
    observer ??= new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '-80px 0px' });
    observer.observe(element);
    const complete = () => { element.style.willChange = ''; };
    element.addEventListener('transitionend', complete);
    element.addEventListener('transitioncancel', complete);
    return () => {
      observer.unobserve(element);
      element.removeEventListener('transitionend', complete);
      element.removeEventListener('transitioncancel', complete);
      complete();
    };
  }, []);

  return <Tag ref={ref} className={`pg-reveal ${className}`}>{children}</Tag>;
}

export default memo(Reveal);
