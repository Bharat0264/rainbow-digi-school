import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SCHOOL } from '../../data/school';

import logo from '../../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-royal-blue text-white/80 pt-16 pb-8 relative">
      <div className="absolute top-0 left-0 right-0 rainbow-line" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-12">
          {/* Brand Col */}
          <div className="space-y-6">
            <Link to="/" className="flex flex-col items-start gap-4 inline-block">
              <div className="bg-white rounded-xl p-3 inline-block">
                <img src={logo} alt={SCHOOL.name} className="h-16 w-auto object-contain" />
              </div>
              <span className="font-serif text-2xl font-bold text-white">{SCHOOL.name}</span>
            </Link>
            <p className="text-sm leading-relaxed">{SCHOOL.tagline}</p>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <span>{SCHOOL.address.full}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-serif text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {['Home', 'About', 'Academics', 'Admissions', 'Campus', 'Events', 'Contact'].map((link) => (
                <li key={link}>
                  <Link to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="hover:text-gold transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-serif text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href={`tel:${SCHOOL.phone}`} className="flex items-center gap-3 hover:text-gold transition-colors">
                  <Phone className="w-4 h-4 text-gold" />
                  {SCHOOL.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SCHOOL.email}`} className="flex items-center gap-3 hover:text-gold transition-colors">
                  <Mail className="w-4 h-4 text-gold" />
                  {SCHOOL.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gold shrink-0 mt-1" />
                  <span>
                    Mon - Fri: 8:00 AM - 4:00 PM<br/>
                    Sat - Sun: Closed
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-serif text-lg mb-6">Follow Us</h3>
            <p className="text-sm mb-6">Stay updated with our latest news and events.</p>
            <div className="flex gap-4">
              <a href={SCHOOL.social?.facebook || "#!"} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-royal-blue transition-all">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14-3.442 0-5.143 2.138-5.143 5.424v4.076H7v4h2.5v10.5h4.5V13.5z"/></svg>
              </a>
              <a href={SCHOOL.social?.instagram || "#!"} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-royal-blue transition-all">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href={SCHOOL.social?.youtube || "#!"} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-royal-blue transition-all">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
