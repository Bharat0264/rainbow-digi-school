import { createContext, useContext, useEffect, useState } from 'react';

const defaults = { width: 1280, isMobile: false, boardW: 98, boardH: 40, ropeLen: 22, logoBoardW: 190, logoBoardH: 78 };
export const NavMetricsContext = createContext(defaults);

const getMetrics = width => {
  const isMobile = width < 768;
  const boardW = isMobile ? Math.max(92, Math.min(width * .26, 112)) : Math.min(98, width * .077);
  return { width, isMobile, boardW, boardH: isMobile ? 38 : 40, ropeLen: isMobile ? 16 : 22, logoBoardW: isMobile ? 150 : 190, logoBoardH: isMobile ? 68 : 78 };
};

export function useNavMetrics() {
  const [metrics, setMetrics] = useState(() => typeof window === 'undefined' ? defaults : getMetrics(window.innerWidth));
  useEffect(() => {
    const update = () => setMetrics(getMetrics(window.innerWidth));
    const query = window.matchMedia('(max-width: 767px)');
    update(); window.addEventListener('resize', update); window.addEventListener('orientationchange', update); query.addEventListener('change', update);
    return () => { window.removeEventListener('resize', update); window.removeEventListener('orientationchange', update); query.removeEventListener('change', update); };
  }, []);
  return metrics;
}
export const useCurrentNavMetrics = () => useContext(NavMetricsContext);
