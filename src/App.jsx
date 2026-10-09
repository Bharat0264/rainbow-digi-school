import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import CampusGallery from './pages/CampusGallery';
import EventsNews from './pages/EventsNews';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

/* --- Scroll to top on route change --- */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Layout>
              <Routes>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="academics" element={<Academics />} />
                <Route path="admissions" element={<Admissions />} />
                <Route path="campus" element={<CampusGallery />} />
                <Route path="events" element={<EventsNews />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
      </Layout>
    </>
  );
}
