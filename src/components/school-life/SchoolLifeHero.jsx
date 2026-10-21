import './SchoolLifeHero.css';

export default function SchoolLifeHero() {
  return (
    <section className="section school-life-hero-section" aria-label="Student Life introduction">
      <div className="site-container">
        <div className="school-life-hero-card">
          <div className="school-life-hero-grid">
            
            {/* Left Content Column */}
            <div className="school-life-hero-content">
              
              {/* Eyebrow with gold accent underline */}
              <div className="school-life-hero-eyebrow-wrapper">
                <div className="school-life-hero-eyebrow">
                  <span className="school-life-hero-dot" aria-hidden="true" />
                  <span className="school-life-hero-eyebrow-text">
                    Student Life & School Culture
                  </span>
                </div>
                <div className="school-life-hero-underline" aria-hidden="true" />
              </div>

              {/* Main Heading */}
              <h1 className="school-life-hero-title">
                More Than a <span className="text-gold">School Day.</span>
                <span className="school-life-hero-burst" aria-hidden="true">
                  <svg width="44" height="38" viewBox="0 0 44 38" fill="none">
                    <path d="M6 32L16 6" stroke="#EEA32B" strokeWidth="4.5" strokeLinecap="round" />
                    <path d="M16 28L36 12" stroke="#EEA32B" strokeWidth="4.5" strokeLinecap="round" />
                    <path d="M18 36L32 30" stroke="#EEA32B" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              {/* Lead Paragraph */}
              <p className="school-life-hero-lead">
                Beyond textbooks and workbooks, childhood at Rainbow Digi School is
                filled with laughter, shared celebrations, creative expression, and
                meaningful friendships.
              </p>

            </div>

            {/* Right Artwork Column */}
            <div className="school-life-hero-art-col">
              <img
                src="/images/school-life-hero-art.webp"
                alt="Illustrated open book with fanning pages, stars, and green paper airplane"
                width={684}
                height={682}
                className="school-life-hero-img"
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
