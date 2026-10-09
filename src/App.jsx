import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import { Loader2 } from 'lucide-react';

/* --- Error Boundary for Routes --- */
class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Route crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#F7F1E6]">
          <h2 className="text-2xl font-bold text-[#3B1F14] mb-4">Oops! Something went wrong.</h2>
          <p className="text-[#3B1F14]/70 max-w-lg mb-6">
            We couldn't load this page. Please try refreshing.
          </p>
          <button 
            className="px-6 py-3 bg-[#F2495C] text-white rounded-full font-semibold hover:bg-[#D43F50] transition-colors"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* --- Lazy chunk retry logic --- */
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    try {
      const component = await componentImport();
      window.sessionStorage.removeItem('chunk-failed');
      return component;
    } catch (error) {
      if (!window.sessionStorage.getItem('chunk-failed')) {
        window.sessionStorage.setItem('chunk-failed', 'true');
        window.location.reload();
      }
      throw error;
    }
  });

/* --- Route-level code splitting --- */
const Home = lazyWithRetry(() => import('./pages/Home'));
const About = lazyWithRetry(() => import('./pages/About'));
const Academics = lazyWithRetry(() => import('./pages/Academics'));
const Admissions = lazyWithRetry(() => import('./pages/Admissions'));
const CampusGallery = lazyWithRetry(() => import('./pages/CampusGallery'));
const EventsNews = lazyWithRetry(() => import('./pages/EventsNews'));
const Contact = lazyWithRetry(() => import('./pages/Contact'));
const NotFound = lazyWithRetry(() => import('./pages/NotFound'));

/* --- Loading fallback --- */
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 bg-[#F7F1E6]">
      <Loader2 className="w-8 h-8 animate-spin text-[#F2495C]" />
      <span className="text-[#3B1F14] font-medium" role="status">Loading...</span>
    </div>
  );
}

/* --- Scroll to top on route change --- */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Layout>
        <RouteErrorBoundary>
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
        </RouteErrorBoundary>
      </Layout>
    </>
  );
}
