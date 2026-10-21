import introStyles from "./CampusIntro.module.css";
import botanicalArt from "../assets/campus-botanical.webp";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { X, Expand, ArrowUpRight, ArrowRight, School, MessagesSquare, Palette, ShieldCheck, Bus, Phone } from "lucide-react";
import walkthroughArt from "../assets/campus-walkthrough.webp";
import styles from "./CampusWalkthrough.module.css";
import { CAMPUS_DETAILS, SCHOOL } from "../data/school";
import {
  SectionHeading,
  CampusPhoto,
} from "../components/ui/PageElements";

const WALKTHROUGH_ICONS = [School, MessagesSquare, Palette, ShieldCheck, Bus];

export default function CampusGallery() {
  const dialog = useRef(null);

  return (
    <>
      <section className="section page-intro">
        <div className="site-container">
          <div className={introStyles.card}>
            <img className={introStyles.background} src={botanicalArt} width="1600" height="800" alt="" aria-hidden="true" decoding="async" />
            <div className={introStyles.copy}>
              <p className={`eyebrow ${introStyles.eyebrow}`}><span className="eyebrow-dot" /> Our Campus in Kandlakoya</p>
              <h1>A Thoughtful Setting<br className={introStyles.break} /> for Learning.</h1>
              <p className={introStyles.lead}>
                Located in a quiet residential enclave in Kandlakoya, Hyderabad, our
                school offers young learners a calm, secure, and inspiring environment
                away from busy city noise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Photo & Environment Bento */}
      <section className="section site-container photo-story">
        <div className="photo-story-image-card clay-tile clay-mint">
          <button
            type="button"
            className="photo-open"
            onClick={() => dialog.current.showModal()}
            aria-label="Enlarge photograph of Rainbow Digi School exterior"
          >
            <CampusPhoto caption={false} />
            <span className="photo-pill-badge clay-tile clay-cream clay-shape-pill">
              <Expand size={18} aria-hidden="true" />
              <span>View full photograph</span>
            </span>
          </button>
          <p className="image-caption">
            Rainbow Digi School exterior · School-approved photograph
          </p>
        </div>

        <div className="editorial-copy clay-tile clay-cream">
          <SectionHeading
            eyebrow="The physical environment"
            title="Designed for comfort, security, and focus."
          />
          <p>
            A child’s learning space plays a vital role in their daily comfort and
            confidence. Our campus is thoughtfully planned to balance focused
            indoor study with active, creative movement.
          </p>
          <div className="feature-grid" style={{ gridTemplateColumns: "1fr", gap: "14px", marginTop: "16px" }}>
            {CAMPUS_DETAILS.environment.map((item) => (
              <div key={item.title} className="clay-tile clay-yellow" style={{ padding: "18px 22px" }}>
                <h3 style={{ fontSize: "17px", marginBottom: "4px" }}>{item.title}</h3>
                <p style={{ fontSize: "14px", margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planning a Visit & Walkthrough Checklist */}
      <section className={`section site-container ${styles.walkthrough}`} aria-labelledby="walkthrough-heading">
        <header className={styles.heading}>
          <p className="eyebrow"><span className="eyebrow-dot" /> Parent walkthrough guide</p>
          <h2 id="walkthrough-heading">What to observe when<br /> <span>visiting</span> our campus.</h2>
          <p className={styles.description}>We invite prospective parents to tour our classrooms in person. Here are practical aspects to look for during a school walkthrough:</p>
        </header>
        <ul className={styles.checklist}>
          {CAMPUS_DETAILS.visitChecklist.map((item, index) => {
            const Icon = WALKTHROUGH_ICONS[index];
            return <li key={item}><span className={styles.icon} aria-hidden="true"><Icon /></span><span>{item}</span></li>;
          })}
        </ul>
        <figure className={styles.art}>
          <img src={walkthroughArt} alt="" width="1600" height="800" loading="lazy" decoding="async" />
        </figure>
        <div className={styles.callout}>
          <span className={styles.phone} aria-hidden="true"><Phone /></span>
          <p>Please call our office ahead of travelling so we can schedule an educator to greet you and answer your questions without disrupting ongoing classes.</p>
        </div>
      </section>

      {/* Location, Landmarks & Commute Guide */}
      <section className="section site-container community-band-section">
        <div className="community-band clay-tile clay-cream clay-shape-blob">
          <div className="intro-grid">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-dot" /> Finding the campus
              </p>
              <h2>
                Easy access in
                <br />
                <em>Kandlakoya, Hyderabad.</em>
              </h2>
              <p style={{ marginTop: "16px", color: "var(--ink-muted)", fontSize: "15px" }}>
                Plot No. 61, Padmashree Enclave, near Sanjana Courtyard,
                Kandlakoya, Hyderabad – 501401
              </p>
            </div>
            <div className="editorial-copy">
              <p>
                Conveniently located near the Medchal Highway (NH-44) and Kandlakoya
                ORR Junction, the school is easily accessible for families residing
                across Kandlakoya, Medchal, Kompally, and surrounding northern
                Hyderabad residential communities.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "24px" }}>
                <a
                  className="button button-secondary clay-btn-mint"
                  href={SCHOOL.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Open directions in Google Maps</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <Link
                  className="button button-primary clay-btn-yellow"
                  to="/admissions#enquiry"
                >
                  <span>Schedule a campus walkthrough</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <dialog
        ref={dialog}
        className="photo-dialog clay-tile clay-cream"
        aria-label="Rainbow Digi School exterior photograph"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current.close();
        }}
      >
        <button
          type="button"
          className="dialog-close clay-tile clay-yellow clay-shape-pill"
          onClick={() => dialog.current.close()}
          aria-label="Close photograph"
          autoFocus
        >
          <X aria-hidden="true" size={20} />
        </button>
        <img {...SCHOOL.campusPhoto} />
        <p>Rainbow Digi School, Kandlakoya, Hyderabad</p>
      </dialog>
    </>
  );
}
