import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { EVENTS, SCHOOL } from '../data/school';

// Inline SVGs for social icons
const Instagram = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const Facebook = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const Youtube = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

export default function EventsNews() {
  const [events, setEvents] = React.useState(EVENTS);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetch('/api/events', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Events request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setEvents(data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch events from backend. Using fallback.', err);
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0 }
  };

  const getTagColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'sports': return 'bg-green-100 text-green-800';
      case 'arts': return 'bg-purple-100 text-purple-800';
      default: return 'bg-[#FDF0C4] text-[#D9A514]';
    }
  };

  return (
    <motion.div
      initial="initial" animate="animate" exit="exit" variants={pageVariants}
      className="min-h-svh bg-[#FFFDF6]"
    >
      {/* Hero Banner */}
      <section className="bg-royal-blue text-white pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-6xl text-[#F6C945] mb-6">Events & Announcements</h1>
          <p className="text-[#A89888] text-lg max-w-2xl mx-auto">
            Stay up to date with the latest happenings at Rainbow Digi School.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 rainbow-line" />
      </section>

      {/* Events Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getTagColor(event.tag)}`}>
                    {event.tag || 'Event'}
                  </span>
                  <div className="flex items-center text-[#A89888] text-sm font-medium">
                    <Calendar size={16} className="mr-2" />
                    {event.date}
                  </div>
                </div>
                <h3 className="font-serif text-2xl text-royal-blue mb-3 group-hover:text-[#D9A514] transition-colors">
                  {event.title}
                </h3>
                <p className="text-[#6B5D52] line-clamp-2">
                  {event.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-[#FBF3D5] px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-royal-blue mb-8">
            Stay updated – follow us on social media
          </h2>
          <div className="flex justify-center gap-6">
            <a href={SCHOOL.social?.instagram || "#!"} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-royal-blue hover:bg-[#F6C945] hover:text-white shadow-sm transition-all duration-300">
              <Instagram size={24} />
            </a>
            <a href={SCHOOL.social?.facebook || "#!"} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-royal-blue hover:bg-[#F6C945] hover:text-white shadow-sm transition-all duration-300">
              <Facebook size={24} />
            </a>
            <a href={SCHOOL.social?.youtube || "#!"} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-royal-blue hover:bg-[#F6C945] hover:text-white shadow-sm transition-all duration-300">
              <Youtube size={24} />
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
