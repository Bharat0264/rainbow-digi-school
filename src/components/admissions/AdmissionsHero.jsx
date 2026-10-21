import { ArrowRight, GraduationCap } from 'lucide-react';
import './AdmissionsHero.css';

export default function AdmissionsHero() {
  return (
    <section className="section admissions-hero-section" aria-label="Admissions introduction">
      <div className="site-container">
        <div className="admissions-hero-card">
          <div className="admissions-hero-grid">
            
            {/* Left Content Column */}
            <div className="admissions-hero-content">
              
              {/* Eyebrow Pill Badge */}
              <div className="admissions-hero-badge">
                <div className="admissions-hero-badge-icon">
                  <GraduationCap size={15} strokeWidth={2.2} />
                </div>
                <span className="admissions-hero-badge-text">
                  Nursery to Grade V · Admissions 2026–2027
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="admissions-hero-title">
                The Next Chapter
                <br />
                <span className="text-gold">Starts</span> Here.
                <span className="admissions-hero-slashes" aria-hidden="true">
                  <svg width="34" height="30" viewBox="0 0 34 30" fill="none">
                    <path d="M6 24L20 4" stroke="#EBA519" strokeWidth="5" strokeLinecap="round" />
                    <path d="M18 26L29 16" stroke="#EBA519" strokeWidth="4.5" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              {/* Lead Paragraph */}
              <p className="admissions-hero-lead">
                We welcome families looking for a caring, curiosity-driven educational
                environment. Learn about our 5-step admissions process, class age
                guidelines, and documentation, then submit your enquiry below.
              </p>

              {/* CTA Button with Radiating Sparkle Accents */}
              <div className="admissions-hero-cta-wrapper">
                {/* Left burst sparkles */}
                <svg
                  className="admissions-hero-sparkle-left"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M12 24L4 20" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M22 14L16 6" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                </svg>

                {/* Right burst sparkles */}
                <svg
                  className="admissions-hero-sparkle-right"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M10 14L16 6" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M20 24L28 20" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                </svg>

                {/* Button Link */}
                <a
                  href="#enquiry"
                  className="admissions-hero-btn"
                >
                  <span>Start an admissions enquiry</span>
                  <span className="admissions-hero-btn-arrow">
                    <ArrowRight size={18} strokeWidth={2.4} />
                  </span>
                </a>
              </div>

            </div>

            {/* Right Artwork Column */}
            <div className="admissions-hero-art-col">
              <img
                src="/images/admissions-hero-art.webp"
                alt="Rainbow Digi School Campus with cheerful 3D illustrated clouds, sun, books, and paper airplane"
                width={1018}
                height={960}
                className="admissions-hero-img"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
