import './AcademicsHero.css';

export default function AcademicsHero() {
  return (
    <section className="section academics-hero-section" aria-label="Curriculum and learning introduction">
      <div className="site-container">
        <div className="academics-hero-card">
          <div className="academics-hero-grid">
            
            {/* Left Content Column */}
            <div className="academics-hero-content">
              
              {/* Eyebrow */}
              <div className="academics-hero-eyebrow">
                <span className="academics-hero-dot" aria-hidden="true" />
                <span className="academics-hero-eyebrow-text">
                  Curriculum & Learning
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="academics-hero-title">
                Foundations for
                <br />
                <span className="text-caramel">Curious Minds.</span>
              </h1>

              {/* Lead Paragraph */}
              <p className="academics-hero-lead">
                At Rainbow Digi School, we nurture a lifelong love for learning. Explore
                our educational approach across the early childhood and primary years,
                from Nursery through Grade V.
              </p>

            </div>

            {/* Right Artwork Column */}
            <div className="academics-hero-art-col">
              <img
                src="/images/academics-hero-art.webp"
                alt="Illustrated stack of leatherbound books with warm pastel backdrop and radiating burst marks"
                width={770}
                height={700}
                className="academics-hero-img"
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
