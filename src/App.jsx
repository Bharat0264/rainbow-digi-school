import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import Layout from './components/layout/Layout';
import ScrollProgress from './components/layout/ScrollProgress';
import Preloader from './components/layout/Preloader';

/* ── Route-level code splitting ────────────────────── */
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Academics = lazy(() => import('./pages/Academics'));
const Admissions = lazy(() => import('./pages/Admissions'));
const CampusGallery = lazy(() => import('./pages/CampusGallery'));
const EventsNews = lazy(() => import('./pages/EventsNews'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

/* ── Loading fallback ──────────────────────────────── */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF6]">
      <div className="w-8 h-8 border-2 border-[#F6C945] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/* ── Scroll to top on route change ─────────────────── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  /* ── Lenis smooth scrolling ──────────────────────── */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <>
      {/* Preloader – shown only on first load */}
      <Preloader onComplete={() => setLoading(false)} />

      {!loading && (
        <>
          <ScrollProgress />
          <ScrollToTop />
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="academics" element={<Academics />} />
                  <Route path="admissions" element={<Admissions />} />
                  <Route path="campus" element={<CampusGallery />} />
                  <Route path="events" element={<EventsNews />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </Layout>
        </>
      )}
    </>
  );
}
